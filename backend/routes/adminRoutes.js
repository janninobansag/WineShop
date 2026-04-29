const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Order = require('../models/Order');
const Wine = require('../models/Wine');
const Review = require('../models/Review');

router.use(protect);
router.use(admin);

// Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalWines = await Wine.countDocuments();
    
    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalWines
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent orders
router.get('/recent-orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new wine (Admin only)
router.post('/wines', async (req, res) => {
  try {
    const wine = await Wine.create(req.body);
    res.status(201).json(wine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update wine (Admin only)
router.put('/wines/:id', async (req, res) => {
  try {
    const wine = await Wine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(wine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete wine (Admin only)
router.delete('/wines/:id', async (req, res) => {
  try {
    await Wine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Wine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;