import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      
      // Check if user is admin - BLOCK admin from regular login
      if (userData.role === 'admin') {
        setError('Admin accounts cannot login here');
        setLoading(false);
        return;
      }
      
      // Regular user goes to home page
      navigate('/');
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
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        
        <div className="auth-switch">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
        
        
      </form>
    </div>
  );
};

export default Login;