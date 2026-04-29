import React from 'react';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  
  // Get the correct item ID (MongoDB uses _id)
  const itemId = item._id || item.id;
  
  const handleIncrease = () => {
    updateQuantity(itemId, (item.quantity || 1) + 1);
  };
  
  const handleDecrease = () => {
    if ((item.quantity || 1) > 1) {
      updateQuantity(itemId, (item.quantity || 1) - 1);
    }
  };
  
  const handleRemove = () => {
    removeItem(itemId);
  };
  
  const itemPrice = item.price || 0;
  const itemQuantity = item.quantity || 1;
  const subtotal = itemPrice * itemQuantity;
  
  return (
    <div className="cart-item">
      <img 
        src={item.image || 'https://via.placeholder.com/80x120?text=Wine'} 
        alt={item.wine}
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <h3>{item.wine}</h3>
        <p className="cart-item-winery">{item.winery}</p>
        <p className="cart-item-price">${itemPrice.toFixed(2)}</p>
      </div>
      <div className="cart-item-actions">
        <div className="quantity-control">
          <button onClick={handleDecrease}>
            <FiMinus />
          </button>
          <span>{itemQuantity}</span>
          <button onClick={handleIncrease}>
            <FiPlus />
          </button>
        </div>
        <div className="cart-item-subtotal">
          ${subtotal.toFixed(2)}
        </div>
        <button className="remove-btn" onClick={handleRemove}>
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default CartItem;