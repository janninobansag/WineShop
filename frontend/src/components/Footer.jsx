import React from 'react';
import { Link } from 'react-router-dom';
import { GiWineBottle } from 'react-icons/gi';
import { FiMail, FiPhone } from 'react-icons/fi';
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        
        {/* Column 1: Brand */}
        <div className="footer-col">
          <Link to="/" className="footer-brand">
            <GiWineBottle size={28} />
            <span>WineShop</span>
          </Link>
          <p className="footer-desc">
            Premium wines delivered to your door. Curated selections from the world's finest vineyards since 2026.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/cart">Shopping Cart</Link>
        </div>

        {/* Column 3: Categories */}
        <div className="footer-col">
          <h4>Categories</h4>
          <Link to="/" onClick={() => window.scrollTo(0,0)}>Red Wines</Link>
          <Link to="/" onClick={() => window.scrollTo(0,0)}>White Wines</Link>
          <Link to="/" onClick={() => window.scrollTo(0,0)}>Rose Wines</Link>
          <Link to="/" onClick={() => window.scrollTo(0,0)}>Sparkling</Link>
        </div>

        {/* Column 4: Contact */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p className="footer-contact-item"><FiMail size={14} /> kimuelldano@gmail.com</p>
          <p className="footer-contact-item"><FiMail size={14} /> janninobansag@gmail.com</p>
          <p className="footer-contact-item"><FiMail size={14} /> akisato203@gmail.com</p>
          <p className="footer-contact-item"><FiMail size={14} /> richarddean.segovia1@gmail.com</p>
          <p className="footer-contact-item"><FiPhone size={14} /> +63 949 798 7581</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} WineShop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;