import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import '../App.css';

const Cart = () => {
  const { cartItems, cartTotal, loading, clearCart } = useCart();
  
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const safeCartTotal = cartTotal || 0;

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (safeCartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any wines to your cart yet.</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      <div className="cart-content">
        <div className="cart-items">
          {safeCartItems.map((item) => (
            <CartItem key={item._id || item.id || item.wine} item={item} />
          ))}
          
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${safeCartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${safeCartTotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
          <Link to="/" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;