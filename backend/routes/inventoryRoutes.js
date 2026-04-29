const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Import controllers - make sure each one exists
const {
  getAllInventory,
  getLowStockItems,
  getInventoryByWineId,
  updateInventory,
  adjustStock,
  initializeInventory
} = require('../controllers/inventoryController');

// Import stats from separate file (create this file if needed)
let getInventoryStats;
try {
  const statsController = require('../controllers/inventoryStats');
  getInventoryStats = statsController.getInventoryStats;
} catch (err) {
  console.log('⚠️ Stats controller not found, creating placeholder');
  getInventoryStats = async (req, res) => {
    res.json({ totalItems: 0, lowStock: 0, totalValue: 0 });
  };
}

// All inventory routes require admin access
router.use(protect, admin);

// Define routes - make sure all handlers exist
router.get('/', getAllInventory);
router.get('/stats', getInventoryStats);
router.get('/low-stock', getLowStockItems);
router.get('/:wineId', getInventoryByWineId);
router.put('/:wineId', updateInventory);
router.patch('/:wineId/adjust', adjustStock);
router.post('/initialize', initializeInventory);

module.exports = router;