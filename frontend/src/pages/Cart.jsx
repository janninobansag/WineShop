import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import '../App.css';

const Cart = () => {
  const { cart, cartTotal, cartCount, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>🛒 Your cart is empty</h2>
        <p>Start adding some wines!</p>
        <Link to="/" className="continue-shopping-btn">
          Browse Wines
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Shopping Cart ({cartCount} items)</h2>
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">
            Proceed to Checkout
          </button>
          <Link to="/" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;