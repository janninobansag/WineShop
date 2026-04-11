import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import wineApi from '../services/wineApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // <-- THIS WAS MISSING
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import '../App.css';

const WineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- THIS WAS MISSING
  const [wine, setWine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth(); // <-- THIS WAS MISSING

  useEffect(() => {
    const fetchWine = async () => {
      try {
        setLoading(true);
        const data = await wineApi.getWineById(id);
        setWine(data.data);
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

  if (loading) return <Loader />;
  
  if (error || !wine) {
    return (
      <div className="error-message">
        <p>❌ {error || 'Wine not found'}</p>
        <Link to="/">Go back home</Link>
      </div>
    );
  }

  const rating = parseFloat(wine.rating?.average) || 0;
  const reviews = wine.rating?.reviews || 0;
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
            <FiStar className="star-icon" />
            <span>{rating.toFixed(1)}</span>
            <span className="reviews">({reviews} reviews)</span>
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
    </div>
  );
};

export default WineDetail;