const express = require('express');
const router = express.Router();
const {
  addReview,
  getReviewsByWine,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public route - get reviews for a wine
router.get('/wine/:wineId', getReviewsByWine);

// Protected routes
router.post('/:wineId', protect, addReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;