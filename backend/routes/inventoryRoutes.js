const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

const {
  getAllInventory,
  getLowStockItems,
  getInventoryByWineId,
  updateInventory,
  adjustStock,
  initializeInventory,
  getInventoryStats
} = require('../controllers/inventoryController');

// ========== PUBLIC ROUTES (no auth) ==========
router.get('/public/:wineId', getInventoryByWineId);

// ========== SPECIFIC ROUTES FIRST (must come BEFORE /:wineId) ==========
router.get('/stats', protect, admin, getInventoryStats);
router.get('/low-stock', protect, admin, getLowStockItems);
router.post('/initialize', protect, admin, initializeInventory);
router.get('/', protect, admin, getAllInventory);

// ========== PARAMETER ROUTES LAST ==========
router.get('/:wineId', protect, getInventoryByWineId);
router.put('/:wineId', protect, admin, updateInventory);
router.patch('/:wineId/adjust', protect, admin, adjustStock);

module.exports = router;