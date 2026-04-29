import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeFromCart, clearCart as apiClearCart } from '../services/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // Start with empty array
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load cart from MongoDB when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cart = await getCart();
      const items = cart?.items || [];
      setCartItems(items);
      
      const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
      
      const total = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
      setCartTotal(total);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const cartItem = {
        wineId: product._id,
        wine: product.wine,
        winery: product.winery,
        price: product.price,
        image: product.image,
        quantity,
      };
      
      const updatedCart = await apiAddToCart(cartItem);
      const items = updatedCart?.items || [];
      setCartItems(items);
      
      const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
      
      const total = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
      setCartTotal(total);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const updatedCart = await updateCartItem(itemId, quantity);
      const items = updatedCart?.items || [];
      setCartItems(items);
      
      const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
      
      const total = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
      setCartTotal(total);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const updatedCart = await removeFromCart(itemId);
      const items = updatedCart?.items || [];
      setCartItems(items);
      
      const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
      
      const total = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
      setCartTotal(total);
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await apiClearCart();
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};