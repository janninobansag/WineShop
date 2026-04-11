import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import wineApi from '../services/wineApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
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

  // Reviews State
  const [userReviews, setUserReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Calculate REAL average rating based ONLY on actual reviews
   const calculatedRating = userReviews.length > 0 
    ? Math.min(5, (userReviews.reduce((acc, curr) => acc + parseFloat(curr.rating || 0), 0) / userReviews.length)).toFixed(1)
    : "0.0";

  useEffect(() => {
    const fetchWine = async () => {
      try {
        setLoading(true);
        const data = await wineApi.getWineById(id);
        setWine(data.data);
        
        // Load real reviews from localStorage
        const savedReviews = localStorage.getItem(`reviews_${id}`);
        if (savedReviews) setUserReviews(JSON.parse(savedReviews));
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
      toast.error("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }
    addToCart(wine);
    toast.success(`${wine.wine} added to cart!`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to leave a review.");
      navigate('/login');
      return;
    }
    if (reviewRating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    const newReview = {
      name: user.name,
      rating: reviewRating,
      text: reviewText
    };

    const updatedReviews = [newReview, ...userReviews];
    setUserReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    
    // Reset form
    setReviewText('');
    setReviewRating(0);
    setHoverRating(0);
    toast.success("Review submitted!");
  };

  if (loading) return <Loader />;
  if (error || !wine) return (<div className="error-message"><p>❌ {error || 'Wine not found'}</p><Link to="/">Go back home</Link></div>);

  const price = parseFloat(wine.price) || 0;

  return (
    <div className="wine-detail-page">
      <Link to="/" className="back-link"><FiArrowLeft /> Back to wines</Link>
      <div className="wine-detail">
        <div className="wine-detail-image"><img src={wine.image} alt={wine.wine} /></div>
        <div className="wine-detail-info">
          <h1>{wine.wine}</h1>
          <p className="detail-winery">{wine.winery}</p>
          
          {/* DYNAMIC RATING BASED ON REAL REVIEWS */}
          <div className="detail-rating">
            <FiStar className="star-icon" />
            <span>{calculatedRating}</span>
            <span className="reviews">({userReviews.length} real reviews)</span>
          </div>

          <p className="detail-price">${price.toFixed(2)}</p>
          <div className="detail-meta">
            <p><strong>Location:</strong> {wine.location}</p>
            <p><strong>Type:</strong> Red Wine</p>
          </div>
          <button className="add-to-cart-large" onClick={handleAddToCart}><FiShoppingCart /> Add to Cart</button>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        
        {/* LIST OF REAL REVIEWS */}
        {userReviews.length > 0 ? (
          <div className="reviews-grid" style={{marginBottom: '2rem'}}>
            {userReviews.map((review, index) => (
              <div key={index} className="review-card user-review-card">
                <div className="review-header">
                  <span className="reviewer-name">{review.name}</span>
                  <span className="reviewer-rating"><FiStar className="star-icon" /> {review.rating}</span>
                </div>
                <p className="review-text">"{review.text}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{color:'#888', marginBottom:'2rem'}}>No reviews yet. Be the first to review this wine!</p>
        )}

        {/* WRITE A REVIEW FORM */}
        <div className="write-review-box">
          <h4>Write a Review</h4>
          <form onSubmit={handleReviewSubmit} className="review-form">
            
            {/* INTERACTIVE STAR SELECTOR */}
            <div className="form-group">
              <label>Your Rating</label>
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className="selectable-star"
                    style={{ color: star <= (hoverRating || reviewRating) ? "#C5A059" : "#444" }}
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
              ></textarea>
            </div>
            <button type="submit" className="auth-btn" style={{width: 'fit-content', padding: '0.6rem 1.5rem'}}>Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WineDetail;