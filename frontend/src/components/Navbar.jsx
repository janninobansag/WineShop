import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiChevronDown, FiLogOut } from 'react-icons/fi';
import { GiWineBottle } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = ({ activeCategory, setActiveCategory }) => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { name: 'Red Wines', value: 'reds' },
    { name: 'White Wines', value: 'whites' },
    { name: 'Rose Wines', value: 'rose' },
    { name: 'Sparkling', value: 'sparkling' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
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

        {/* AUTH LINKS */}
        {isAuthenticated ? (
          <div className="user-menu">
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