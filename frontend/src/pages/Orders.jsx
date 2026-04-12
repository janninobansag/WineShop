import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
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

  // NEW: User requests cancellation
  const handleCancelRequest = (orderId) => {
    const userOrderKey = `orders_${user.email}`;
    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, status: 5 } : o // 5 = Pending Cancel
    );
    setOrders(updatedOrders);
    localStorage.setItem(userOrderKey, JSON.stringify(updatedOrders));
  };

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
        const isCancelled = status === 6;
        const isPendingCancel = status === 5;
         // User can ONLY cancel if it's still Placed (1)
        const canCancel = status === 1;

        return (
          <div key={order.id} className={`order-card ${isCancelled ? 'cancelled-order' : ''}`}>
            <div className="order-card-header">
              <div>
                <p style={{color:'#888', fontSize:'0.85rem'}}>ORDER PLACED</p>
                <p style={{color:'white', fontWeight:'bold'}}>{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div style={{textAlign:'right'}}>
                <p style={{color:'#888', fontSize:'0.85rem'}}>TOTAL</p>
                <p style={{color: isCancelled ? '#666' : '#C5A059', fontWeight:'bold', fontSize:'1.2rem', textDecoration: isCancelled ? 'line-through' : 'none'}}>${order.total.toFixed(2)}</p>
              </div>
            </div>

            {/* CANCEL STATUS BADGES */}
            {isPendingCancel && <div className="status-badge pending-badge">Cancellation Pending Admin Approval</div>}
            {isCancelled && <div className="status-badge cancelled-badge">❌ Order Cancelled</div>}

            <div className="order-items-list">
              {order.items.map(item => (
                <div key={item.id} className="order-item-mini">
                  <img src={item.image} alt={item.wine} style={{opacity: isCancelled ? 0.5 : 1}} />
                  <div>
                    <p style={{color:'white', opacity: isCancelled ? 0.5 : 1}}>{item.wine}</p>
                    <p style={{color:'#888', fontSize:'0.8rem'}}>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* TIMELINE (Greys out if cancelled) */}
            <div className="tracker-timeline" style={{opacity: isCancelled ? 0.4 : 1}}>
              <div className={`timeline-step ${status >= 1 && !isCancelled ? 'active' : ''}`}>
                <div className="step-icon"><FiCheckCircle /></div>
                <div className="step-text"><p>Order Placed</p><span>Confirmed</span></div>
              </div>
              <div className={`timeline-line ${status >= 2 && !isCancelled ? 'active' : ''}`}></div>
              <div className={`timeline-step ${status >= 2 && !isCancelled ? 'active' : ''}`}>
                <div className="step-icon"><FiPackage /></div>
                <div className="step-text"><p>Preparing</p><span>Packing your wine</span></div>
              </div>
              <div className={`timeline-line ${status >= 3 && !isCancelled ? 'active' : ''}`}></div>
              <div className={`timeline-step ${status >= 3 && !isCancelled ? 'active' : ''}`}>
                <div className="step-icon"><FiTruck /></div>
                <div className="step-text"><p>Shipped</p><span>On the way</span></div>
              </div>
              <div className={`timeline-line ${status >= 4 && !isCancelled ? 'active' : ''}`}></div>
              <div className={`timeline-step ${status >= 4 && !isCancelled ? 'active' : ''}`}>
                <div className="step-icon"><FiCheckCircle /></div>
                <div className="step-text"><p>Delivered</p><span>Cash on Delivery</span></div>
              </div>
            </div>

            {/* CANCEL BUTTON */}
            {canCancel && (
              <button onClick={() => handleCancelRequest(order.id)} className="cancel-order-btn">
                Cancel Order
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Orders;