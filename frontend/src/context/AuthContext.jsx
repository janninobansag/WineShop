import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile, setAuthToken, getAuthToken } from '../services/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Session expired:', error);
          apiLogout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      setUser(response);
      setIsAuthenticated(true);
      localStorage.setItem('wineShopUser', JSON.stringify(response));
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      setUser(response);
      setIsAuthenticated(true);
      localStorage.setItem('wineShopUser', JSON.stringify(response));
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem('wineShopUser');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      register,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};