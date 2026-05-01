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

// ========== PUBLIC ROUTE - NO AUTHENTICATION ==========
// This MUST be before any protect middleware
router.get('/public/:wineId', getInventoryByWineId);

// ========== PROTECTED ROUTES ==========
router.get('/:wineId', protect, getInventoryByWineId);

// ========== ADMIN ONLY ROUTES ==========
router.use(protect, admin);

router.get('/', getAllInventory);
router.get('/stats', getInventoryStats);
router.get('/low-stock', getLowStockItems);
router.put('/:wineId', updateInventory);
router.patch('/:wineId/adjust', adjustStock);
router.post('/initialize', initializeInventory);

module.exports = router;