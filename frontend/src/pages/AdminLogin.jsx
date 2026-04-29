import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { isAdminAccessGranted, checkSessionAccess } from '../utils/adminSecret';
import '../App.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [secretGranted, setSecretGranted] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin access was already granted via secret code
    const hasAccess = checkSessionAccess();
    setSecretGranted(hasAccess);
    
    if (!hasAccess) {
      addNotification(
        '⚠️ Admin access requires secret code. Check browser console for instructions.',
        'warning',
        null,
        null
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // First check if secret code was granted
    if (!isAdminAccessGranted() && !secretGranted) {
      setError('⚠️ Admin access not granted. You need to enter the secret code first.');
      addNotification(
        'Open browser console (F12) and type: grantAdminAccess("WineShopAdmin2024")',
        'error',
        null,
        null
      );
      return;
    }
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = await login(email, password);
      
      // Check if user has admin role
      if (userData.role !== 'admin') {
        setError('❌ You do not have admin privileges. Regular users cannot access admin panel.');
        addNotification('Access denied: Not an admin account', 'error', null, null);
        setLoading(false);
        return;
      }
      
      addNotification('Welcome Admin!', 'success', null, null);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
      addNotification(err.message || 'Login failed', 'error', null, null);
    } finally {
      setLoading(false);
    }
  };

  // Instructions for getting secret code
  const showInstructions = () => {
    addNotification(
      'To get admin access, open browser console (F12) and type: grantAdminAccess("WineShopAdmin2024")',
      'info',
      null,
      null
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Admin Login</h1>
        <p className="auth-subtitle">Secure admin dashboard access</p>
        
        {!secretGranted && (
          <div className="admin-secret-warning">
            
          </div>
        )}
        
        {secretGranted && (
          <div className="admin-secret-success">
            
          </div>
        )}
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              disabled={loading || !secretGranted}
            />
          </div>
          
          <div className="form-group">
            <label>Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              disabled={loading || !secretGranted}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-btn" 
            disabled={loading || !secretGranted}
          >
            {loading ? 'Logging in...' : 'Access Admin Dashboard'}
          </button>
        </form>
        
        <div className="auth-switch">
          <Link to="/login">Back to User Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;