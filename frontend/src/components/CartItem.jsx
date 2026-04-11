import React from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import '../App.css';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const price = parseFloat(item.price) || 0;
  const subtotal = price * item.quantity;

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.wine} className="cart-item-image" />
      
      <div className="cart-item-details">
        <h3>{item.wine}</h3>
        <p className="cart-item-winery">{item.winery}</p>
        <p className="cart-item-price">${price.toFixed(2)}</p>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-control">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            <FiMinus />
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            <FiPlus />
          </button>
        </div>
        
        <p className="cart-item-subtotal">${subtotal.toFixed(2)}</p>
        
        <button 
          className="remove-btn" 
          onClick={() => removeFromCart(item.id)}
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default CartItem;