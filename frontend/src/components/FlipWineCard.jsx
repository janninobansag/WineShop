import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

const FlipWineCard = ({ wine }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  // Stock state
  const [stock, setStock] = useState(null);
  const [loadingStock, setLoadingStock] = useState(true);
  
  // Review state
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // SAFE: Convert price to number
  let priceNumber = 0;
  if (wine.price !== undefined && wine.price !== null) {
    priceNumber = typeof wine.price === 'string' ? parseFloat(wine.price) : Number(wine.price);
    if (isNaN(priceNumber)) priceNumber = 0;
  }
  const formattedPrice = priceNumber.toFixed(2);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/reviews/wine/${wine._id}`);
        
        if (response.ok) {
          const reviews = await response.json();
          setReviewCount(reviews.length);
          
          if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            const avgRating = totalRating / reviews.length;
            setRating(parseFloat(avgRating.toFixed(1)));
          } else {
            setRating(0);
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    
    fetchReviews();
  }, [wine._id]);

  // Fetch stock information
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(`${API_URL}/inventory/public/${wine._id}`);
        
        if (response.ok) {
          const data = await response.json();
          setStock(data.quantity || 0);
        } else {
          setStock(null);
        }
      } catch (err) {
        console.error('Error fetching stock:', err);
        setStock(null);
      } finally {
        setLoadingStock(false);
      }
    };
    
    fetchStock();
  }, [wine._id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      addNotification('Please login to add items to cart', 'error', null, null);
      toast.error("Please login to add items to cart.");
      navigate('/login');
      return;
    }
    
    if (stock === 0) {
      addNotification('This wine is out of stock!', 'error', null, null);
      toast.error("This wine is out of stock!");
      return;
    }
    
    const wineWithNumericPrice = {
      ...wine,
      price: priceNumber
    };
    
    addToCart(wineWithNumericPrice);
    toast.success(`${wine.wine || wine.name || 'Wine'} added to cart! 🍷`);
    addNotification(
      `${wine.wine || wine.name || 'Wine'} added to cart! 🍷`,
      'cart',
      wine.image,
      wine.wine || wine.name
    );
  };

  const getWineDescription = () => {
    if (wine.description) return wine.description;
    const descriptions = [
      `A exquisite wine showcasing exceptional craftsmanship from ${wine.location || 'premium wine region'}.`,
      `Notes of dark berries, oak, and subtle spices. Perfectly balanced with a long, elegant finish.`,
      `Hand-selected grapes from prime vineyards. Aged to perfection for a memorable tasting experience.`
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const getFoodPairing = () => {
    const pairings = {
      'Red': 'Red meat, aged cheeses, pasta dishes',
      'White': 'Seafood, poultry, light pasta',
      'Rosé': 'Salads, grilled vegetables',
      'Sparkling': 'Oysters, sushi, celebration dishes'
    };
    return pairings[wine.type] || 'Red meat, cheese, pasta';
  };

  const isOutOfStock = stock === 0;
  const isLowStock = stock !== null && stock <= 5 && stock > 0;

  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="wine-image">
            <img 
              src={wine.image || 'https://via.placeholder.com/200x300?text=Wine'} 
              alt={wine.wine || wine.name || 'Wine'}
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x300?text=Wine+Image';
              }}
            />
            <div className="flip-hint" />
          </div>
          <div className="wine-info">
            <h3 className="wine-name">{wine.wine || wine.name || 'Premium Wine'}</h3>
            <p className="winery">{wine.winery || 'Premium Winery'}</p>
            <div className="wine-rating">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="star-icon" style={{ fill: i < Math.floor(rating) ? '#C5A059' : 'none' }} />
              ))}
              <span>{rating.toFixed(1)}</span>
              <span className="reviews">({reviewCount} reviews)</span>
            </div>
            <div className="wine-footer">
              <span className="wine-price">${formattedPrice}</span>
              <span className="wine-location">{wine.location || 'Imported'}</span>
            </div>
            
            {isLowStock && !isOutOfStock && (
              <div className="low-stock-warning">
                ⚠️ Only {stock} left in stock!
              </div>
            )}
            {isOutOfStock && (
              <div className="out-of-stock-badge">
                ❌ Out of Stock
              </div>
            )}
          </div>
        </div>

        <div className="flip-card-back">
          <h3>{wine.wine || wine.name || 'Premium Wine'}</h3>
          
          <div className="wine-description">
            {getWineDescription()}
          </div>

          <div className="wine-details-list">
            <div className="detail-item">
              <span className="detail-label">Type</span>
              <span className="detail-value">{wine.type || 'Red Wine'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Region</span>
              <span className="detail-value">{wine.location || 'International'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Vintage</span>
              <span className="detail-value">{wine.vintage || 'NV'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pairing</span>
              <span className="detail-value">{getFoodPairing()}</span>
            </div>
          </div>

          <div className="wine-price-back">
            ${formattedPrice}
          </div>

          {isOutOfStock && (
            <div className="out-of-stock-back">
              Currently Unavailable
            </div>
          )}

          <button 
            className="add-to-cart-flip"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{ 
              opacity: isOutOfStock ? 0.5 : 1, 
              cursor: isOutOfStock ? 'not-allowed' : 'pointer' 
            }}
          >
            <FiShoppingCart /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <Link 
            to={`/wine/${wine._id}`} 
            className="view-details-link"
            onClick={(e) => e.stopPropagation()}
          >
            View Full Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlipWineCard;