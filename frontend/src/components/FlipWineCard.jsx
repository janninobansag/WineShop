// frontend/src/components/FlipWineCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { toast } from 'react-toastify';

const FlipWineCard = ({ wine }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();

  // SAFE: Convert price to number
  let priceNumber = 0;
  if (wine.price !== undefined && wine.price !== null) {
    priceNumber = typeof wine.price === 'string' ? parseFloat(wine.price) : Number(wine.price);
    if (isNaN(priceNumber)) priceNumber = 0;
  }
  const formattedPrice = priceNumber.toFixed(2);

  // Calculate rating from localStorage
  const getRating = () => {
    const reviews = JSON.parse(localStorage.getItem(`reviews_${wine.id}`) || '[]');
    if (reviews.length === 0) return 0;
    const avg = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviews.length;
    return Math.min(5, avg);
  };

  const rating = getRating();
  const reviewCount = JSON.parse(localStorage.getItem(`reviews_${wine.id}`) || '[]').length;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      addNotification('Please login to add items to cart', 'error', null, null);
      toast.error("Please login to add items to cart."); // Add this too
      return;
    }
    
    const wineWithNumericPrice = {
      ...wine,
      price: priceNumber
    };
    
    addToCart(wineWithNumericPrice);
    
    // ADD THIS LINE BELOW TO GET THE POP-UP ALERT BACK:
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

  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front of card */}
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
          </div>
        </div>

        {/* Back of card */}
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

          <button 
            className="add-to-cart-flip"
            onClick={handleAddToCart}
          >
            <FiShoppingCart /> Add to Cart
          </button>

          <Link 
            to={`/wine/${wine.id}`} 
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