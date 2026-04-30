// frontend/src/services/orderApi.js
const API_URL = 'https://wineshop-api.onrender.com/api';

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
  const response = await fetch(`${API_URL}/orders`, {
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
  const response = await fetch(`${API_URL}/orders`, {
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
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
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
  const response = await fetch(`${API_URL}/orders/${orderId}/cancel-request`, {
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

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  requestCancellation,
};