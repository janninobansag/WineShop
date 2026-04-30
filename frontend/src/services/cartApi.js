// frontend/src/services/cartApi.js
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

// Get user's cart
export const getCart = async () => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch cart');
  }
  
  return data;
};

// Add item to cart
export const addToCart = async (item) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(item),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add to cart');
  }
  
  return data;
};

// Update item quantity
export const updateCartItem = async (itemId, quantity) => {
  if (!itemId) {
    throw new Error('Item ID is required');
  }
  
  const response = await fetch(`${API_URL}/cart/${itemId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ quantity }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update cart');
  }
  
  return data;
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
  if (!itemId) {
    throw new Error('Item ID is required');
  }
  
  const response = await fetch(`${API_URL}/cart/${itemId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to remove from cart');
  }
  
  return data;
};

// Clear cart
export const clearCart = async () => {
  const response = await fetch(`${API_URL}/cart/clear`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to clear cart');
  }
  
  return data;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};