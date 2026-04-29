// frontend/src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkSessionAccess } from '../utils/adminSecret';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const hasAdminSecret = checkSessionAccess();
  
  // Wait for auth to load
  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }
  
  // Check if user is admin AND has secret code access
  if (!isAuthenticated || user?.role !== 'admin' || !hasAdminSecret) {
    return <Navigate to="/admin-login" />;
  }
  
  return children;
};

export default AdminRoute;