import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Load notifications when user logs in
  useEffect(() => {
    if (user) {
      const notifKey = `notif_${user.email}`;
      const savedNotifs = localStorage.getItem(notifKey);
      if (savedNotifs) {
        try {
          const parsed = JSON.parse(savedNotifs);
          const cleanNotifs = parsed.filter(n => n && typeof n === 'object').map(n => ({
            ...n,
            message: typeof n.message === 'string' ? n.message : 'Notification'
          }));
          setNotifications(cleanNotifs);
        } catch (e) {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  }, [user?.email]);

  // Save notifications when they change
  useEffect(() => {
    if (user && notifications.length >= 0) {
      const notifKey = `notif_${user.email}`;
      const toStore = notifications.slice(0, 50);
      localStorage.setItem(notifKey, JSON.stringify(toStore));
    }
  }, [notifications, user?.email]);

  // Wrapped in useCallback to prevent the polling interval from restarting on every render
  const addNotification = useCallback((message, type = 'info', image = null, wineName = null, orderId = null) => {
    let messageString;
    if (typeof message === 'string') {
      messageString = message;
    } else if (typeof message === 'object') {
      messageString = message.message || JSON.stringify(message);
    } else {
      messageString = String(message || 'Notification');
    }

    const id = Date.now();
    
    setNotifications(prev => {
      const isDuplicate = prev.some(n => 
        n.message === messageString && 
        n.wineName === wineName && 
        (id - n.id) < 3000
      );
      
      if (isDuplicate) return prev;
      
      const newNotifications = [{ 
        id, 
        message: messageString, 
        type, 
        image, 
        wineName, 
        orderId, 
        read: false,
        timestamp: id
      }, ...prev];
      
      return newNotifications.slice(0, 100);
    });
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    if (user) {
      const notifKey = `notif_${user.email}`;
      localStorage.removeItem(notifKey);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // ==========================================
  // ✅ UPDATED POLLING EFFECT HERE
  // ==========================================
  useEffect(() => {
    if (!user) return;

    // Replaced with your requested function
    const checkForOrderUpdates = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        const response = await fetch('http://localhost:5000/api/orders/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          console.error('Failed to fetch orders:', response.status);
          return;
        }
        
        const orders = await response.json();
        
        const storedNotifKey = `last_order_status_${user.email}`;
        const lastStatus = JSON.parse(localStorage.getItem(storedNotifKey) || '{}');
        
        orders.forEach(order => {
          if (lastStatus[order._id] !== order.status && order.status !== 'pending') {
            const statusMessages = {
              'processing': `⚙️ Your order #${order.orderNumber?.slice(-8)} is now being processed.`,
              'shipped': `🚚 Your order #${order.orderNumber?.slice(-8)} has been shipped!`,
              'delivered': `✅ Your order #${order.orderNumber?.slice(-8)} has been delivered!`,
              'cancelled': `❌ Your order #${order.orderNumber?.slice(-8)} has been cancelled.`
            };
            
            if (statusMessages[order.status]) {
              addNotification(
                statusMessages[order.status],
                'order',
                order.items?.[0]?.image,
                order.items?.[0]?.wine,
                order._id
              );
            }
            
            lastStatus[order._id] = order.status;
          }
        });
        
        localStorage.setItem(storedNotifKey, JSON.stringify(lastStatus));
      } catch (error) {
        console.error('Error checking order updates:', error);
      }
    };
    
    // Initial check
    checkForOrderUpdates();
    
    // Check every 30 seconds
    const interval = setInterval(checkForOrderUpdates, 30000);
    
    return () => clearInterval(interval);
  }, [user, addNotification]); 
  // ==========================================

  // Listen for Admin Updates (localStorage cross-tab sync)
  useEffect(() => {
    if (!user) return;

    const handleAdminUpdate = (event) => {
      const userAlertKey = `alert_${user.email}`;
      
      if (event.key === userAlertKey && event.newValue) {
        try {
          const alertData = JSON.parse(event.newValue);
          if (alertData.message) {
            const id = Date.now();
            
            let alertMessage = alertData.message;
            if (typeof alertMessage === 'object') {
              alertMessage = alertMessage.message || 'Update';
            }
            
            setNotifications(prev => {
              const isDuplicate = prev.some(n => 
                n.message === alertMessage && 
                (id - n.id) < 5000
              );
              
              if (isDuplicate) return prev;
              
              return [{
                id,
                message: alertMessage,
                type: alertData.type || 'order',
                image: alertData.image || null,
                wineName: alertData.wineName || null,
                orderId: alertData.orderId || null,
                read: false,
                timestamp: id
              }, ...prev];
            });
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
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      markAsRead,
      markAllAsRead,
      clearAll, 
      removeNotification,
      unreadCount 
    }}>
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