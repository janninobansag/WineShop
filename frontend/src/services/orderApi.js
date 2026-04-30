// frontend/src/services/orderApi.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Create a new order
export const createOrder = async (orderData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create order');
  }
  
  return data;
};

// Get user's orders
export const getUserOrders = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch orders');
  }
  
  return data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
  const response = await fetch(`${API_URL}/${orderId}`, {
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch order');
  }
  
  return data;
};

// Request cancellation
export const requestCancellation = async (orderId, reason) => {
  const response = await fetch(`${API_URL}/${orderId}/cancel-request`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ reason }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to request cancellation');
  }
  
  return data;
};

// Send notification to user about order status
export const notifyOrderStatus = async (orderId, notificationData) => {
  const response = await fetch(`${API_URL}/${orderId}/notify`, {
    method: 'POST',
    headers: getHeaders(),  // Use existing helper instead of duplicating
    body: JSON.stringify(notificationData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to send notification');
  }
  
  return data;
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  requestCancellation,
  notifyOrderStatus,  // Add this
};