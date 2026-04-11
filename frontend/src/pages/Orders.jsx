import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // NEW IMPORT
import '../App.css';

const Orders = () => {
  const { user } = useAuth(); // NEW HOOK
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    // ONLY get orders for this specific email
    const userOrderKey = `orders_${user.email}`;
    const savedOrders = localStorage.getItem(userOrderKey);
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const handleStorageChange = () => {
      const updated = localStorage.getItem(userOrderKey);
      if (updated) setOrders(JSON.parse(updated));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  if (orders.length === 0) {
    return (
      <div className="error-message" style={{minHeight: '60vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <FiPackage size={50} style={{color:'#333', marginBottom:'1rem'}}/>
        <h2>No orders yet</h2>
        <p style={{color:'#888', marginBottom:'2rem'}}>Your order history will appear here.</p>
        <Link to="/" className="continue-shopping-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2>My Orders ({orders.length})</h2>
      
      {orders.map(order => {
        const status = order.status || 1; 
        return (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div>
                <p style={{color:'#888', fontSize:'0.85rem'}}>ORDER PLACED</p>
                <p style={{color:'white', fontWeight:'bold'}}>{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div style={{textAlign:'right'}}>
                <p style={{color:'#888', fontSize:'0.85rem'}}>TOTAL</p>
                <p style={{color:'#C5A059', fontWeight:'bold', fontSize:'1.2rem'}}>${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="order-items-list">
              {order.items.map(item => (
                <div key={item.id} className="order-item-mini">
                  <img src={item.image} alt={item.wine} />
                  <div>
                    <p style={{color:'white'}}>{item.wine}</p>
                    <p style={{color:'#888', fontSize:'0.8rem'}}>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="tracker-timeline">
              <div className={`timeline-step ${status >= 1 ? 'active' : ''}`}>
                <div className="step-icon"><FiCheckCircle /></div>
                <div className="step-text"><p>Order Placed</p><span>Confirmed</span></div>
              </div>
              <div className={`timeline-line ${status >= 2 ? 'active' : ''}`}></div>
              <div className={`timeline-step ${status >= 2 ? 'active' : ''}`}>
                <div className="step-icon"><FiPackage /></div>
                <div className="step-text"><p>Preparing</p><span>Packing your wine</span></div>
              </div>
              <div className={`timeline-line ${status >= 3 ? 'active' : ''}`}></div>
              <div className={`timeline-step ${status >= 3 ? 'active' : ''}`}>
                <div className="step-icon"><FiTruck /></div>
                <div className="step-text"><p>Shipped</p><span>On the way</span></div>
              </div>
              <div className={`timeline-line ${status >= 4 ? 'active' : ''}`}></div>
              <div className={`timeline-step ${status >= 4 ? 'active' : ''}`}>
                <div className="step-icon"><FiCheckCircle /></div>
                <div className="step-text"><p>Delivered</p><span>Cash on Delivery</span></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;