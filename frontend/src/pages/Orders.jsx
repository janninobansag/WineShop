import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiSettings, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { getUserOrders, requestCancellation } from '../services/orderApi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Loader from '../components/Loader';
import CancelOrderModal from '../components/CancelOrderModal';
import '../App.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      case 'cancellation_requested': return 'status-pending';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'PENDING';
      case 'processing': return 'PROCESSING';
      case 'shipped': return 'SHIPPED';
      case 'delivered': return 'DELIVERED';
      case 'cancelled': return 'CANCELLED';
      case 'cancellation_requested': return 'CANCELLATION REQUESTED';
      default: return status.toUpperCase();
    }
  };

  const canCancel = (status) => {
    return ['pending', 'processing'].includes(status);
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCancelSubmit = async (reason) => {
    try {
      await requestCancellation(selectedOrder._id, reason);
      addNotification('Cancellation request submitted. Admin will review it.', 'info', null, null);
      await fetchOrders(); // Refresh orders
    } catch (error) {
      addNotification(error.message || 'Failed to submit cancellation request', 'error', null, null);
    }
  };

  const getTimelineSteps = (status) => {
    const steps = [
      { name: 'Order Placed', key: 'pending', icon: FiPackage },
      { name: 'Processing', key: 'processing', icon: FiSettings },
      { name: 'Shipped', key: 'shipped', icon: FiTruck },
      { name: 'Delivered', key: 'delivered', icon: FiCheckCircle }
    ];
    
    let currentIndex = 0;
    switch (status) {
      case 'pending': currentIndex = 0; break;
      case 'processing': currentIndex = 1; break;
      case 'shipped': currentIndex = 2; break;
      case 'delivered': currentIndex = 3; break;
      case 'cancelled':
      case 'cancellation_requested':
        currentIndex = -1; break;
      default: currentIndex = 0;
    }
    
    return steps.map((step, index) => ({
      ...step,
      active: currentIndex >= 0 && index <= currentIndex,
      completed: currentIndex >= 0 && index < currentIndex
    }));
  };

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="empty-cart">
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/" className="continue-shopping-btn">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <br/>
      {orders.map((order) => {
        const timelineSteps = getTimelineSteps(order.status);
        const cancellable = canCancel(order.status);
        const isCancelled = order.status === 'cancelled';
        const isCancellationRequested = order.status === 'cancellation_requested';
        
        return (
          <div key={order._id} className={`order-card ${isCancelled ? 'cancelled-order' : ''}`}>
            <div className="order-card-header">
              <div>
                <strong>Order #{order.orderNumber}</strong>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                {getStatusText(order.status)}
              </div>
            </div>
            
            <div className="order-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item-mini">
                  <img src={item.image} alt={item.wine} />
                  <div>
                    <p><strong>{item.wine}</strong></p>
                    <p>{item.winery}</p>
                    <p>Qty: {item.quantity} × ${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Delivery Instructions */}
            {order.shippingAddress?.deliveryInstructions && (
              <div className="delivery-instructions">
                <strong>📝 Delivery Instructions:</strong>
                <p>{order.shippingAddress.deliveryInstructions}</p>
              </div>
            )}
            
            {/* Cancellation Reason */}
            {isCancellationRequested && order.cancellationReason && (
              <div className="delivery-instructions" style={{ borderLeftColor: '#f1c40f' }}>
                <strong>⏳ Cancellation Requested:</strong>
                <p>Reason: {order.cancellationReason}</p>
                <small>Waiting for admin approval</small>
              </div>
            )}
            
            {isCancelled && order.cancellationReason && (
              <div className="delivery-instructions" style={{ borderLeftColor: '#e74c3c' }}>
                <strong>❌ Order Cancelled:</strong>
                <p>Reason: {order.cancellationReason}</p>
              </div>
            )}
            
            {/* Timeline Tracker (only if not cancelled) */}
            {!isCancelled && !isCancellationRequested && (
              <div className="tracker-timeline">
                <div className={`timeline-line ${timelineSteps[1]?.active ? 'active' : ''}`}></div>
                {timelineSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={step.key} className="timeline-step">
                      <div className={`step-icon ${step.active ? 'active' : ''}`}>
                        <IconComponent size={18} />
                      </div>
                      <div className="step-text">
                        <p>{step.name}</p>
                        {step.completed && <span>✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="order-summary">
              <p><strong>Total: ${order.total.toFixed(2)}</strong></p>
              {cancellable && (
                <button 
                  className="cancel-order-btn"
                  onClick={() => handleCancelClick(order)}
                >
                  <FiXCircle /> Request Cancellation
                </button>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCancelSubmit}
        orderNumber={selectedOrder?.orderNumber}
      />
    </div>
  );
};

export default Orders;