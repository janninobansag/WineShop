import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
  clearAllNotifications as apiClearAll,
  addNotification as apiAddNotification
} from '../services/notificationApi';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load notifications from MongoDB
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const [notifs, count] = await Promise.all([
        getNotifications(),
        getUnreadCount()
      ]);
      setNotifications(notifs || []);
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Add notification
const addNotification = useCallback(async (message, type = 'info', image = null, wineName = null, orderId = null) => {
  if (!isAuthenticated) return;
  
  try {
    let messageString = typeof message === 'string' ? message : String(message);
    
    const newNotification = await apiAddNotification({
      message: messageString,
      type,
      image,
      wineName,
      orderId  // ← This is the orderId
    });
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  } catch (error) {
    console.error('Error adding notification:', error);
  }
}, [isAuthenticated]);

  // Mark as read
  const markAsRead = useCallback(async (id) => {
    try {
      await apiMarkAsRead(id);
      setNotifications(prev => prev.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await apiMarkAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  // Clear all
  const clearAll = useCallback(async () => {
    try {
      await apiClearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export default NotificationContext;