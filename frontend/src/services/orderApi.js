// frontend/src/services/orderApi.js
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

// Create a new order
export const createOrder = async (orderData) => {
  try {
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
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

// Get user's orders
export const getUserOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getHeaders(),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    
    return data;
  } catch (error) {
    console.error('Get orders error:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: getHeaders(),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order');
    }
    
    return data;
  } catch (error) {
    console.error('Get order error:', error);
    throw error;
  }
};


// Request cancellation
export const requestCancellation = async (orderId, reason) => {
  try {
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
  } catch (error) {
    console.error('Request cancellation error:', error);
    throw error;
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  requestCancellation,
};