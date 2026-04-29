import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { toast } from 'react-toastify';

const FlipWineCard = ({ wine }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // SAFE: Convert price to number
  let priceNumber = 0;
  if (wine.price !== undefined && wine.price !== null) {
    priceNumber = typeof wine.price === 'string' ? parseFloat(wine.price) : Number(wine.price);
    if (isNaN(priceNumber)) priceNumber = 0;
  }
  const formattedPrice = priceNumber.toFixed(2);

  // Use rating from MongoDB
  const rating = wine.rating?.average || 0;
  const reviewCount = wine.rating?.reviews || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      addNotification('Please login to add items to cart', 'error', null, null);
      toast.error("Please login to add items to cart.");
      return;
    }
    
    const wineWithNumericPrice = {
      ...wine,
      price: priceNumber
    };
    
    addToCart(wineWithNumericPrice);
    toast.success(`${wine.wine} added to cart! 🍷`);
    addNotification(
      `${wine.wine} added to cart! 🍷`,
      'cart',
      wine.image,
      wine.wine
    );
  };

  const handleCardClick = () => {
    navigate(`/wine/${wine._id}`);
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

  const wineId = wine._id || wine.id;

  return (
    <div className="flip-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="flip-card-inner">
        {/* Front of card */}
        <div className="flip-card-front">
          <div className="wine-image">
            <img 
              src={wine.image || 'https://via.placeholder.com/200x300?text=Wine'} 
              alt={wine.wine}
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x300?text=Wine+Image';
              }}
            />
          </div>
          <div className="wine-info">
            <h3 className="wine-name">{wine.wine}</h3>
            <p className="winery">{wine.winery}</p>
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
          <h3>{wine.wine}</h3>
          
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

          <button 
            className="view-details-link"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/wine/${wineId}`);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View Full Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipWineCard;