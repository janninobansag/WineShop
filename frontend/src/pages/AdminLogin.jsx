import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiWineBottle } from 'react-icons/gi';
import '../App.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hardcoded Admin Credentials for now
    if (email === 'admin@wineshop.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid Admin Credentials');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <GiWineBottle size={40} color="#C5A059" style={{marginBottom: '1rem'}}/>
        <h1>Admin Portal</h1>
        <p className="auth-subtitle">Authorized personnel only</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <div className="form-group">
          <label>Admin Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        <button type="submit" className="auth-btn">Access Dashboard</button>
      </form>
    </div>
  );
};

export default AdminLogin;