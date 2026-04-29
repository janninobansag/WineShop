const express = require('express');
const router = express.Router();
const { 
  getWinesByCategory, 
  getWineById, 
  addWine, 
  updateWine, 
  deleteWine 
} = require('../controllers/wineController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/:category', getWinesByCategory);
router.get('/item/:id', getWineById);

// Admin routes
router.post('/', protect, admin, addWine);
router.put('/:id', protect, admin, updateWine);
router.delete('/:id', protect, admin, deleteWine);

module.exports = router;