const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Import controllers - remove duplicate
const {
  getAllInventory,
  getLowStockItems,
  getInventoryByWineId,
  updateInventory,
  adjustStock,
  initializeInventory,
  getInventoryStats  // Import this once
} = require('../controllers/inventoryController');

// All inventory routes require admin access
router.use(protect, admin);

// Define routes - remove duplicate /stats
router.get('/', getAllInventory);
router.get('/stats', getInventoryStats);  // Only once
router.get('/low-stock', getLowStockItems);
router.get('/:wineId', getInventoryByWineId);
router.put('/:wineId', updateInventory);
router.patch('/:wineId/adjust', adjustStock);
router.post('/initialize', initializeInventory);

module.exports = router;