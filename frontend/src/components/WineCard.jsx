import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../App.css';

const WineCard = ({ wine }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Stops the Link from navigating away
    e.stopPropagation(); // Stops event bubbling
    
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }

    addToCart(wine);
    toast.success(`${wine.wine} added to cart!`);
  };

  const rating = parseFloat(wine.rating?.average) || 0;
  const reviews = wine.rating?.reviews || 0;
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
          <span>{rating.toFixed(1)}</span>
          <span className="reviews">({reviews} reviews)</span>
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