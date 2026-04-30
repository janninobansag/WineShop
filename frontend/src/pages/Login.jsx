import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { checkSessionAccess } from '../utils/adminSecret';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = await login(email, password);
      
      if (userData.role === 'admin') {
        const hasAdminSecret = checkSessionAccess();
        if (hasAdminSecret) {
          navigate('/admin/dashboard');
        } else {
          setError('Admin access requires secret code. Please use admin login page.');
          return;
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to your WineShop account</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group password-field">
          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        
        <div className="auth-switch">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
        
        <div className="auth-switch" style={{ marginTop: '0.5rem' }}>
          <Link to="/admin-login">Admin Login →</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;