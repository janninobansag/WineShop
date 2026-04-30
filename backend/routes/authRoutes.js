const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUserById,
  deleteUserById,
  forgotPassword,    // Add this
  verifyResetToken,  // Add this
  resetPassword      // Add this
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);           // Add this
router.get('/verify-reset-token/:token', verifyResetToken); // Add this
router.post('/reset-password/:token', resetPassword);       // Add this

// Private routes (user only)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/users', protect, admin, getUsers);
router.put('/users/:userId', protect, admin, updateUserById);
router.delete('/users/:userId', protect, admin, deleteUserById);

module.exports = router;