const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getUserOrdersForNotifications,  // Add this import
  getOrderById,
  requestCancellation,
  approveCancellation,
  rejectCancellation,
  updateOrderStatus,
  getAllOrders,
  sendOrderNotification,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// User routes - Specific routes FIRST
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/user', getUserOrdersForNotifications);  // Add this route - for notification polling
router.post('/:orderId/cancel-request', requestCancellation);
router.get('/:orderId', getOrderById);

// Admin routes
router.put('/:orderId/status', admin, updateOrderStatus);
router.put('/:orderId/cancel-approve', admin, approveCancellation);
router.put('/:orderId/cancel-reject', admin, rejectCancellation);
router.get('/admin/all', admin, getAllOrders);
router.post('/:orderId/notify', admin, sendOrderNotification);

module.exports = router;