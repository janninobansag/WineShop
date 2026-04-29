import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiChevronDown, FiLogOut, FiBell, FiPackage, FiX, FiCheckCircle, FiTruck, FiClock } from 'react-icons/fi';
import { GiWineBottle } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../App.css';

const Navbar = ({ activeCategory, setActiveCategory }) => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotification();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const notifButtonRef = useRef(null);

  const categories = [
    { name: 'Red Wines', value: 'reds' },
    { name: 'White Wines', value: 'whites' },
    { name: 'Rose Wines', value: 'rose' },
    { name: 'Sparkling', value: 'sparkling' },
  ];

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target) && 
          notifButtonRef.current && !notifButtonRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { 
    logout(); 
    navigate('/'); 
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return <FiPackage size={14} />;
      case 'cart': return <FiShoppingCart size={14} />;
      case 'delivered': return <FiCheckCircle size={14} />;
      case 'shipped': return <FiTruck size={14} />;
      default: return <FiBell size={14} />;
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (notification.id) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type and orderId
    if (notification.orderId) {
      // If there's a specific order ID, go to that order
      navigate(`/orders/${notification.orderId}`);
    } else if (notification.type === 'order') {
      navigate('/orders');
    } else if (notification.type === 'cart') {
      navigate('/cart');
    }
    
    // Close dropdown
    setIsNotifOpen(false);
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <GiWineBottle size={28} />
        <span>WineShop</span>
      </Link>
      
      <div className="navbar-links">
        <div className="dropdown" ref={dropdownRef}>
          <button className="dropbtn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {categories.find(c => c.value === activeCategory)?.name || 'Wines'} 
            <FiChevronDown className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              {categories.map((cat) => (
                <button 
                  key={cat.value} 
                  onClick={() => { 
                    setActiveCategory(cat.value); 
                    setIsDropdownOpen(false); 
                  }} 
                  className={activeCategory === cat.value ? 'active' : ''}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link to="/cart" className="nav-link cart-link">
          <FiShoppingCart size={22} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {/* NOTIFICATION BELL */}
        {isAuthenticated && (
          <div className="notification-wrapper">
            <button 
              ref={notifButtonRef}
              className="nav-link bell-btn" 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              <FiBell size={22} />
              {unreadCount > 0 && <span className="cart-badge">{unreadCount}</span>}
            </button>
            
            {isNotifOpen && (
              <div className="notification-dropdown" ref={notifRef}>
                <div className="notification-header">
                  <span>Notifications</span>
                  {notifications.length > 0 && (
                    <button onClick={() => { clearAll(); setIsNotifOpen(false); }} className="clear-notif-btn">
                      <FiX size={14} /> Clear all
                    </button>
                  )}
                </div>
                
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">
                      <FiBell size={32} color="#444" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <div 
                        key={notification.id || notification._id} 
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="notification-icon">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <p className="notification-message">
                            {typeof notification.message === 'string' 
                              ? notification.message 
                              : notification.message?.message || 'New notification'}
                          </p>
                          {notification.wineName && (
                            <span className="notification-wine">{notification.wineName}</span>
                          )}
                          <span className="notification-time">
                            {getTimeAgo(notification.timestamp || notification.id)}
                          </span>
                        </div>
                        {!notification.read && <div className="notification-dot" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AUTH LINKS */}
        {isAuthenticated ? (
          <div className="user-menu">
            <Link to="/orders" className="nav-link orders-link" title="My Orders">
              <FiPackage size={20} />
            </Link>
            <span className="user-greeting">Hi, {user?.name?.split(' ')[0] || user?.name || 'User'}</span>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <FiLogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">Log In</Link>
            <Link to="/register" className="nav-link register-link">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;