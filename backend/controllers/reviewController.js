const Review = require('../models/Review');
const Wine = require('../models/Wine');

// Add a review to a wine
const addReview = async (req, res) => {
  try {
    const { wineId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name || req.user.email;

    // Check if user already reviewed this wine
    const existingReview = await Review.findOne({ wineId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this wine' });
    }

    // Create new review
    const review = await Review.create({
      wineId,
      userId,
      userName,
      rating,
      comment,
    });

    // Update wine rating
    await updateWineRating(wineId);

    res.status(201).json({ 
      message: 'Review added successfully', 
      review 
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a wine
const getReviewsByWine = async (req, res) => {
  try {
    const { wineId } = req.params;
    const reviews = await Review.find({ wineId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update wine rating based on all reviews
const updateWineRating = async (wineId) => {
  try {
    const reviews = await Review.find({ wineId });
    const reviewCount = reviews.length;
    
    if (reviewCount === 0) {
      await Wine.findByIdAndUpdate(wineId, {
        'rating.average': 0,
        'rating.reviews': 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviewCount;

    await Wine.findByIdAndUpdate(wineId, {
      'rating.average': parseFloat(averageRating.toFixed(1)),
      'rating.reviews': reviewCount,
    });
  } catch (error) {
    console.error('Update wine rating error:', error);
  }
};

// Delete a review (admin or review owner)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is admin or review owner
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    
    // Update wine rating
    await updateWineRating(review.wineId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getReviewsByWine,
  deleteReview,
};