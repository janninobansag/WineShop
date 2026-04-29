import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCreditCard, FiArrowLeft } from 'react-icons/fi';
import { getOrderById } from '../services/orderApi';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Loader from '../components/Loader';
import '../App.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (isAuthenticated && orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      addNotification('Failed to load order details', 'error', null, null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock size={20} />;
      case 'processing': return <FiPackage size={20} />;
      case 'shipped': return <FiTruck size={20} />;
      case 'delivered': return <FiCheckCircle size={20} />;
      default: return <FiPackage size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f1c40f';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#888';
    }
  };

  if (loading) return <Loader />;

  if (!order) {
    return (
      <div className="orders-empty">
        <div className="orders-empty-content">
          <h2>Order Not Found</h2>
          <Link to="/orders" className="orders-empty-btn">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(order.status);

  return (
    <div className="order-detail-page">
      <Link to="/orders" className="back-link">
        <FiArrowLeft /> Back to Orders
      </Link>

      <div className="order-detail-card">
        <div className="order-detail-header">
          <div>
            <h1>Order #{order.orderNumber?.slice(-10) || order._id?.slice(-10)}</h1>
            <p>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
          <div className="order-status-large" style={{ color: statusColor }}>
            {getStatusIcon(order.status)}
            <span>{order.status?.toUpperCase() || 'PENDING'}</span>
          </div>
        </div>

        <div className="order-detail-items">
          <h3>Items</h3>
          <div className="items-list">
            {order.items?.map((item, idx) => (
              <div key={idx} className="order-detail-item">
                <img src={item.image} alt={item.wine} />
                <div className="item-details">
                  <div className="item-name">{item.wine}</div>
                  <div className="item-winery">{item.winery}</div>
                  <div className="item-meta">Qty: {item.quantity} × ${item.price}</div>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-detail-summary">
          <div className="summary-section">
            <h3><FiMapPin /> Shipping Address</h3>
            <p>{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city} {order.shippingAddress?.zipCode}</p>
            {order.shippingAddress?.phone && <p>📞 {order.shippingAddress.phone}</p>}
            {order.shippingAddress?.deliveryInstructions && (
              <p className="instructions">📝 Note: {order.shippingAddress.deliveryInstructions}</p>
            )}
          </div>

          <div className="summary-section">
            <h3><FiCreditCard /> Payment</h3>
            <p>Method: {order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}</p>
          </div>

          <div className="summary-section totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${(order.subtotal || order.total || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;