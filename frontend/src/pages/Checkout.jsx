import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../App.css';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Cash on delivery state

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    instructions: '' // Changed to delivery instructions
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If typing in the phone field, remove everything that is NOT a number
    if (name === 'phone') {
      const onlyNumbers = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNumbers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

   const handleSubmit = (e) => {
    e.preventDefault();
    
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: cartTotal,
      status: 1,
      customerEmail: user.email, // NEW: Track who ordered
      customerName: user.name    // NEW: Track who ordered
    };

    // Save to user-specific key (e.g., orders_john@email.com)
    const userOrderKey = `orders_${user.email}`;
    const existingOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
    existingOrders.unshift(newOrder);
    localStorage.setItem(userOrderKey, JSON.stringify(existingOrders));

    addNotification(`Order placed successfully! Total: $${cartTotal.toFixed(2)}`, 'order');
    setIsSuccess(true);
    clearCart();
  };
    

  if (!user) {
    return (
      <div className="error-message">
        <h2>Please log in to proceed to checkout.</h2>
        <Link to="/login" className="continue-shopping-btn">Log In</Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="success-container">
        <div className="success-box">
          <h1>🎉 Order Placed!</h1>
          <p>Thank you, {formData.name}! Your wine is on its way.</p>
          <p style={{marginTop: '1rem', color: '#888'}}>Payment Method: <strong style={{color: '#C5A059'}}>Cash on Delivery</strong></p>
          <Link to="/" className="auth-btn" style={{marginTop: '2rem', display: 'inline-block', textDecoration: 'none'}}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="error-message">
        <h2>Your cart is empty</h2>
        <Link to="/" className="continue-shopping-btn">Browse Wines</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        
        <div className="checkout-form-container">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Shipping Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
               <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="e.g., 09123456789" 
                required 
              />
            </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input type="text" name="zip" value={formData.zip} onChange={handleChange} required />
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="payment-method-section">
              <h3>Payment Method</h3>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                />
                <span className="radio-custom"></span>
                Cash on Delivery
              </label>
            </div><br/>

            <div className="form-group">
              <label>Delivery Instructions (Optional)</label>
              <textarea 
                name="instructions" 
                rows="3" 
                value={formData.instructions} 
                onChange={handleChange} 
                placeholder="e.g., Leave at the door, ring the bell..."
                className="checkout-textarea"
              ></textarea>
            </div>

            <button type="submit" className="auth-btn">Place Order - ${cartTotal.toFixed(2)}</button>
          </form>
        </div>

        <div className="order-review">
          <h3>Review Order ({cart.length} items)</h3>
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.wine} />
                <div className="order-item-info">
                  <p className="order-item-name">{item.wine}</p>
                  <p className="order-item-qty">Qty: {item.quantity}</p>
                </div>
                <p className="order-item-price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="order-summary-checkout">
            <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>Free</span></div>
            <div className="summary-row total"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;