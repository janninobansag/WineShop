import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { GiWineBottle } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); // Get logout function from context
  const isDashboard = location.pathname === '/admin';

  // FIXED: Complete logout function
  const handleLogout = () => {
    // Clear all authentication and session data
    localStorage.removeItem('authToken');
    localStorage.removeItem('wineShopUser');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminAccess');
    sessionStorage.removeItem('adminAccess');
    
    // Call the auth context logout
    logout();
    
    // Navigate to admin login page
    navigate('/admin-login');
  };

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
          <button onClick={handleLogout} className="admin-nav-btn logout">
            <FiLogOut /> Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;