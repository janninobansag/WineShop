import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNotification } from '../context/NotificationContext';
import '../App.css';

const WineCard = ({ wine }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }

    addToCart(wine);
    toast.success(`${wine.wine} added to cart!`);
    addNotification(`Added to cart`, 'cart', wine.image, wine.wine);  // NEW
  };

  // CALCULATE REAL RATING FROM LOCAL STORAGE (Ignores backend completely!)
  const reviewsFromStorage = JSON.parse(localStorage.getItem(`reviews_${wine.id}`) || '[]');
  const calculatedRating = reviewsFromStorage.length > 0 
    ? Math.min(5, (reviewsFromStorage.reduce((acc, curr) => acc + parseFloat(curr.rating || 0), 0) / reviewsFromStorage.length)).toFixed(1)
    : "0.0";
    
  const reviewCount = reviewsFromStorage.length;
  const price = parseFloat(wine.price) || 0;

  return (
    <Link to={`/wine/${wine.id}`} className="wine-card">
      <div className="wine-image">
        <img src={wine.image} alt={wine.wine} />
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <FiShoppingCart />
        </button>
      </div>
      <div className="wine-info">
        <h3 className="wine-name">{wine.wine}</h3>
        <p className="winery">{wine.winery}</p>
        <div className="wine-rating">
          <FiStar className="star-icon" />
          <span>{calculatedRating}</span>
          <span className="reviews">({reviewCount} real reviews)</span>
        </div>
        <div className="wine-footer">
          <span className="wine-price">${price.toFixed(2)}</span>
          <span className="wine-location">{wine.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default WineCard;