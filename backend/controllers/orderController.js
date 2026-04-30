const Order = require('../models/Order');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    console.log('Creating order for user:', req.user.id);
    
    const userId = req.user.id;
    const { 
      shippingAddress, 
      paymentMethod, 
      items, 
      subtotal, 
      shipping, 
      total 
    } = req.body;
    
    const userEmail = req.user.email;
    const userName = req.user.name || req.user.email;
    
    const orderNumber = generateOrderNumber();
    
    // DECREASE INVENTORY FOR EACH ITEM
    for (const item of items) {
      const inventory = await Inventory.findOne({ wineId: item.wineId });
      if (inventory) {
        const newQuantity = inventory.quantity - item.quantity;
        if (newQuantity < 0) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${item.wine}. Only ${inventory.quantity} left.` 
          });
        }
        inventory.quantity = newQuantity;
        inventory.updatedAt = Date.now();
        await inventory.save();
        console.log(`Stock updated for ${item.wine}: ${inventory.quantity} left`);
      }
    }
    
    const order = await Order.create({
      orderNumber,
      userId,
      userEmail,
      userName,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod,
      shippingAddress,
      status: 'pending',
    });
    
    console.log('Order created successfully:', order.orderNumber);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's orders for notifications (optimized payload)
const getUserOrdersForNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .select('orderNumber status items')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ 
      _id: orderId,
      userId: req.user.id 
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Request order cancellation (User)
const requestCancellation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    
    const order = await Order.findOne({ _id: orderId, userId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered orders' });
    }
    
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }
    
    if (order.status === 'cancellation_requested') {
      return res.status(400).json({ message: 'Cancellation already requested' });
    }
    
    order.status = 'cancellation_requested';
    order.cancellationRequested = true;
    order.cancellationReason = reason || 'No reason provided';
    order.cancellationRequestedAt = Date.now();
    
    await order.save();
    
    res.json({ 
      success: true, 
      message: 'Cancellation request submitted. Admin will review it.',
      order 
    });
  } catch (error) {
    console.error('Request cancellation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Approve cancellation (Admin)
const approveCancellation = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'cancellation_requested') {
      return res.status(400).json({ message: 'No pending cancellation request for this order' });
    }
    
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    order.updatedAt = Date.now();
    
    await order.save();
    
    res.json({ 
      success: true, 
      message: 'Order cancelled successfully',
      order 
    });
  } catch (error) {
    console.error('Approve cancellation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reject cancellation (Admin)
const rejectCancellation = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'cancellation_requested') {
      return res.status(400).json({ message: 'No pending cancellation request for this order' });
    }
    
    order.status = 'pending';
    order.cancellationRequested = false;
    order.cancellationReason = '';
    order.cancellationRequestedAt = null;
    order.updatedAt = Date.now();
    
    await order.save();
    
    res.json({ 
      success: true, 
      message: 'Cancellation request rejected',
      order 
    });
  } catch (error) {
    console.error('Reject cancellation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    order.updatedAt = Date.now();
    await order.save();
    
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// NEW: Send notification to user about order status
const sendOrderNotification = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { message, type, image, wineName, status } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log(`📧 Notification sent to user ${order.userEmail}: ${message}`);
    
    res.json({
      success: true,
      message: 'Notification sent to user',
      notification: {
        orderId,
        message,
        type,
        image,
        wineName,
        status,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getUserOrdersForNotifications, // Added here
  getOrderById,
  requestCancellation,
  approveCancellation,
  rejectCancellation,
  updateOrderStatus,
  getAllOrders,
  sendOrderNotification,
};