import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { createOrder } from '../services/orderApi';
import '../App.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  // SAFETY: Ensure cartItems is always an array
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const safeCartTotal = cartTotal || 0;
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    deliveryInstructions: '', // NEW FIELD
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [submitting, setSubmitting] = useState(false);

  // If cart is empty, redirect to home
  if (safeCartItems.length === 0 && !submitting) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>You cannot checkout with an empty cart.</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      addNotification('Please fill in all required fields', 'error', null, null);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare order data for MongoDB
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
          deliveryInstructions: formData.deliveryInstructions, // NEW FIELD
        },
        paymentMethod: paymentMethod,
        items: safeCartItems.map(item => ({
          wineId: item.wineId || item._id,
          wine: item.wine,
          winery: item.winery,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1,
        })),
        subtotal: safeCartTotal,
        shipping: 0,
        total: safeCartTotal,
      };
      
      // Send order to backend
      const result = await createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      addNotification(`Order ${result.order.orderNumber} placed successfully! Thank you for your purchase.`, 'success', null, null);
      navigate('/orders');
    } catch (error) {
      console.error('Order error:', error);
      addNotification(error.message || 'Failed to place order. Please try again.', 'error', null, null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      
      <div className="checkout-grid">
        {/* Shipping Information Form */}
        <div className="checkout-form">
          <h3>Shipping Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
                disabled={submitting}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={submitting}
                />
              </div>
              
              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Contact number for delivery"
                disabled={submitting}
              />
            </div>
            
            {/* NEW: Delivery Instructions Field */}
            <div className="form-group">
              <label>Delivery Instructions</label>
              <textarea
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                placeholder="e.g., Leave at the front door, Call before delivery, Gate code: 1234, etc."
                className="checkout-textarea"
                rows="3"
                disabled={submitting}
                style={{ resize: 'vertical' }}
              />
              <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
                Special instructions for the delivery rider
              </small>
            </div>
            
            {/* Payment Method */}
            <div className="payment-method-section">
              <h3>Payment Method</h3>
              <label className="radio-label">
                <input
                  type="radio"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  disabled={submitting}
                />
                <span className="radio-custom"></span>
                Credit Card
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  disabled={submitting}
                />
                <span className="radio-custom"></span>
                PayPal
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  disabled={submitting}
                />
                <span className="radio-custom"></span>
                Cash on Delivery
              </label>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="order-review">
          <h3>Order Summary</h3>
          
          <div className="order-items">
            {safeCartItems.map((item) => (
              <div key={item._id || item.id || item.wine} className="order-item">
                <img src={item.image} alt={item.wine} />
                <div className="order-item-info">
                  <div className="order-item-name">{item.wine}</div>
                  <div className="order-item-qty">Qty: {item.quantity || 1}</div>
                </div>
                <div className="order-item-price">
                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-summary-checkout">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${safeCartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${safeCartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            className="checkout-btn" 
            onClick={handleSubmit}
            disabled={submitting || safeCartItems.length === 0}
          >
            {submitting ? 'Processing...' : `Place Order • $${safeCartTotal.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;