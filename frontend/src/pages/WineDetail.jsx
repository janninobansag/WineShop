// frontend/src/pages/WineDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import wineApi from '../services/wineApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Loader from '../components/Loader';
import '../App.css';

const WineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wine, setWine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotification();

  // Reviews State
  const [userReviews, setUserReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3; // Show 3 reviews per page

  // Calculate average rating
  const calculatedRating = userReviews.length > 0 
    ? (userReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / userReviews.length).toFixed(1)
    : "0.0";

  // Pagination calculations
  const totalReviews = userReviews.length;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = userReviews.slice(indexOfFirstReview, indexOfLastReview);

  // Reset to first page when reviews change
  useEffect(() => {
    setCurrentPage(1);
  }, [userReviews.length]);

  useEffect(() => {
    const fetchWine = async () => {
      try {
        setLoading(true);
        const data = await wineApi.getWineById(id);
        setWine(data.data);
        
        // Load reviews from localStorage using wine ID
        const savedReviews = localStorage.getItem(`reviews_${id}`);
        if (savedReviews) {
          setUserReviews(JSON.parse(savedReviews));
        } else {
          setUserReviews([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWine();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      addNotification('Please login to add items to cart', 'error', null, null);
      navigate('/login');
      return;
    }
    
    addToCart(wine);
    addNotification(
      `${wine.wine} added to cart! 🍷`,
      'cart',
      wine.image,
      wine.wine
    );
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      addNotification('Please login to leave a review', 'error', null, null);
      navigate('/login');
      return;
    }
    
    if (reviewRating === 0) {
      addNotification('Please select a star rating', 'error', null, null);
      return;
    }
    
    if (!reviewText.trim()) {
      addNotification('Please write a review', 'error', null, null);
      return;
    }

    const newReview = {
      id: Date.now(),
      name: user?.name || user?.email || "Anonymous",
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString()
    };

    const updatedReviews = [newReview, ...userReviews];
    setUserReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    
    // Reset form
    setReviewText('');
    setReviewRating(0);
    setHoverRating(0);
    
    addNotification(`Your review for ${wine.wine} has been posted!`, 'success', wine.image, wine.wine);
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: document.querySelector('.reviews-section').offsetTop - 100, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: document.querySelector('.reviews-section').offsetTop - 100, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: document.querySelector('.reviews-section').offsetTop - 100, behavior: 'smooth' });
  };

  if (loading) return <Loader />;
  if (error || !wine) return (
    <div className="error-message">
      <p>❌ {error || 'Wine not found'}</p>
      <Link to="/">Go back home</Link>
    </div>
  );

  const price = parseFloat(wine.price) || 0;

  return (
    <div className="wine-detail-page">
      <Link to="/" className="back-link">
        <FiArrowLeft /> Back to wines
      </Link>
      
      <div className="wine-detail">
        <div className="wine-detail-image">
          <img src={wine.image} alt={wine.wine} />
        </div>
        <div className="wine-detail-info">
          <h1>{wine.wine}</h1>
          <p className="detail-winery">{wine.winery}</p>
          
          <div className="detail-rating">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className="star-icon" style={{ fill: i < parseFloat(calculatedRating) ? '#C5A059' : 'none' }} />
            ))}
            <span>{calculatedRating}</span>
            <span className="reviews">({userReviews.length} reviews)</span>
          </div>

          <p className="detail-price">${price.toFixed(2)}</p>
          <div className="detail-meta">
            <p><strong>Location:</strong> {wine.location}</p>
            <p><strong>Type:</strong> Red Wine</p>
          </div>
          <button className="add-to-cart-large" onClick={handleAddToCart}>
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        
        {userReviews.length > 0 ? (
          <>
            <div className="reviews-grid">
              {currentReviews.map((review, index) => (
                <div key={review.id || index} className="review-card user-review-card">
                  <div className="review-header">
                    <span className="reviewer-name">{review.name}</span>
                    <span className="reviewer-rating">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="star-icon" style={{ fill: i < review.rating ? '#C5A059' : 'none' }} />
                      ))}
                    </span>
                  </div>
                  <p className="review-text">"{review.text}"</p>
                  {review.date && <small className="review-date">{review.date}</small>}
                </div>
              ))}
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="review-pagination-container">
                <button 
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="review-page-btn"
                >
                  <FiChevronLeft /> Previous
                </button>
                
                <div className="review-page-numbers">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show limited page numbers with ellipsis for many pages
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`review-page-num-btn ${currentPage === pageNum ? 'active-review-page' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === currentPage - 2 && currentPage > 3) ||
                      (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={pageNum} className="review-page-ellipsis">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="review-page-btn"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: '#888', marginBottom: '2rem' }}>No reviews yet. Be the first to review this wine!</p>
        )}

        {/* Write a Review Form */}
        <div className="write-review-box">
          <h4>Write a Review</h4>
          <form onSubmit={handleReviewSubmit} className="review-form">
            <div className="form-group">
              <label>Your Rating</label>
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className="selectable-star"
                    style={{ 
                      color: star <= (hoverRating || reviewRating) ? "#C5A059" : "#444",
                      cursor: 'pointer',
                      fontSize: '1.5rem'
                    }}
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Your Thoughts</label>
              <textarea 
                value={reviewText} 
                onChange={(e) => setReviewText(e.target.value)}
                required
                placeholder="What did you think of this wine?"
                className="checkout-textarea"
                rows="4"
              />
            </div>
            <button type="submit" className="auth-btn" style={{ width: 'fit-content', padding: '0.6rem 1.5rem' }}>
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WineDetail;