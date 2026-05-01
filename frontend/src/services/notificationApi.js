// frontend/src/services/notificationApi.js
import { API_URL } from '../config';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Get all notifications
export const getNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch notifications');
  }
  
  return data;
};

// Get unread count
export const getUnreadCount = async () => {
  const response = await fetch(`${API_URL}/notifications/unread-count`, {
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to get unread count');
  }
  
  return data.unreadCount;
};

// Add notification
export const addNotification = async (notificationData) => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(notificationData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add notification');
  }
  
  return data;
};

// Mark as read
export const markAsRead = async (notificationId) => {
  const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to mark as read');
  }
  
  return data;
};

// Mark all as read
export const markAllAsRead = async () => {
  const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to mark all as read');
  }
  
  return data;
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete notification');
  }
  
  return data;
};

// Clear all notifications
export const clearAllNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to clear notifications');
  }
  
  return data;
};

export default {
  getNotifications,
  getUnreadCount,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};