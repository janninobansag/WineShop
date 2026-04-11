import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { GiWineBottle } from 'react-icons/gi';
import '../App.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/admin';

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <Link to="/admin" className="navbar-brand">
          <GiWineBottle size={24} />
          <span>WineShop <span className="admin-badge-nav">ADMIN</span></span>
        </Link>
        
        {isDashboard && (
          <Link to="/admin" className="admin-nav-link active">
            <FiGrid /> Dashboard
          </Link>
        )}
      </div>

      <div className="admin-navbar-right">
        <button onClick={() => navigate('/')} className="admin-nav-btn">
          <FiArrowLeft /> Back to Store
        </button>

        {isDashboard && (
          <button onClick={() => { localStorage.removeItem('isAdmin'); navigate('/admin-login'); }} className="admin-nav-btn logout">
            <FiLogOut /> Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;