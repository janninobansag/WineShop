import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import { GiWineBottle } from 'react-icons/gi';
import { useCart } from '../context/CartContext';
import '../App.css';

const Navbar = ({ activeCategory, setActiveCategory }) => {
  const { cartCount } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // This ref lets us detect clicks outside the dropdown
  const dropdownRef = useRef(null);

  const categories = [
    { name: 'Red Wines', value: 'reds' },
    { name: 'White Wines', value: 'whites' },
    { name: 'Rose Wines', value: 'rose' },
    { name: 'Sparkling', value: 'sparkling' },
  ];

  // Close dropdown if user clicks anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <GiWineBottle size={28} />
        <span>WineShop</span>
      </Link>
      
      <div className="navbar-links">
        {/* Category Dropdown */}
        <div className="dropdown" ref={dropdownRef}>
          <button 
            className="dropbtn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Click to toggle!
          >
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
                    setIsDropdownOpen(false); // Close after selecting
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
      </div>
    </nav>
  );
};

export default Navbar;