import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiChevronDown, FiLogOut, FiBell, FiPackage, FiX } from 'react-icons/fi';
import { GiWineBottle } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../App.css';

const Navbar = ({ activeCategory, setActiveCategory }) => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logoutUser } = useAuth();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotification();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const categories = [
    { name: 'Red Wines', value: 'reds' },
    { name: 'White Wines', value: 'whites' },
    { name: 'Rose Wines', value: 'rose' },
    { name: 'Sparkling', value: 'sparkling' },
  ];

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { logoutUser(); navigate('/'); };

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
                <button key={cat.value} onClick={() => { setActiveCategory(cat.value); setIsDropdownOpen(false); }} className={activeCategory === cat.value ? 'active' : ''}>
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
          <div className="dropdown" ref={notifRef}>
            <button className="nav-link bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <FiBell size={22} />
              {unreadCount > 0 && <span className="cart-badge">{unreadCount}</span>}
            </button>
            
            {isNotifOpen && (
              <div className="dropdown-content notif-dropdown">
                <div className="notif-header">
                  <span>Notifications</span>
                  {notifications.length > 0 && <button onClick={clearAll}><FiX size={16}/> Clear all</button>}
                </div>
                {notifications.length === 0 ? (
                  <p className="notif-empty">No new notifications</p>
                ) : (
                   notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`notif-item ${n.read ? 'read' : 'unread'}`}
                      onClick={() => {
                        if(n.type === 'order') navigate('/orders');
                        if(n.type === 'cart') navigate('/cart');
                        markAsRead(n.id);
                        setIsNotifOpen(false);
                      }}
                    >
                      {/* Show Wine Image if it exists */}
                      {n.image && <img src={n.image} alt="wine" className="notif-image" />}
                      
                      <div className="notif-content-text">
                        {/* Show Wine Name if it exists */}
                        {n.wineName && <strong className="notif-wine-name">{n.wineName}</strong>}
                        <p>{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
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
            <span className="user-greeting">Hi, {user?.name}</span>
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