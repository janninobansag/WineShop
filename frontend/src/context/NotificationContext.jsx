import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // NEW: When user logs in or out, load THEIR specific notifications
  useEffect(() => {
    if (user) {
      const notifKey = `notif_${user.email}`;
      const savedNotifs = localStorage.getItem(notifKey);
      setNotifications(savedNotifs ? JSON.parse(savedNotifs) : []);
    } else {
      setNotifications([]); // Clear screen if logged out
    }
  }, [user?.email]);

  // NEW: Every time notifications change, save them to THAT user's specific folder
  useEffect(() => {
    if (user) {
      const notifKey = `notif_${user.email}`;
      localStorage.setItem(notifKey, JSON.stringify(notifications));
    }
  }, [notifications, user?.email]);

  const addNotification = (message, type = 'info', image = null, wineName = null) => {
    const id = Date.now();
    setNotifications(prev => [{ id, message, type, image, wineName, read: false }, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Listen for Admin Updates (Same as before, but ensures it only adds to the logged-in user's state)
  useEffect(() => {
    if (!user) return;

    const handleAdminUpdate = (event) => {
      const userAlertKey = `alert_${user.email}`;
      
      if (event.key === userAlertKey && event.newValue) {
        try {
          const alertData = JSON.parse(event.newValue);
          if (alertData.message) {
            const id = Date.now();
            setNotifications(prev => [{
              id,
              message: alertData.message,
              type: alertData.type,
              image: alertData.image,
              wineName: alertData.wineName,
              read: false
            }, ...prev]);
          }
        } catch (error) {
          console.error("Error reading admin alert", error);
        }
        localStorage.removeItem(userAlertKey);
      }
    };

    window.addEventListener('storage', handleAdminUpdate);
    return () => window.removeEventListener('storage', handleAdminUpdate);
  }, [user?.email]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

export default NotificationContext;