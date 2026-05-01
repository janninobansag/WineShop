const Inventory = require('../models/Inventory');
const Wine = require('../models/Wine');

// Get all inventory items
const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ createdAt: -1 });
    res.json(inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get low stock items
const getLowStockItems = async (req, res) => {
  try {
    const lowStock = await Inventory.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    });
    res.json(lowStock);
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get inventory by wine ID
// Get inventory by wine ID (works for both public and authenticated)
const getInventoryByWineId = async (req, res) => {
  try {
    const { wineId } = req.params;
    console.log(`Fetching inventory for wineId: ${wineId}`);
    
    const inventory = await Inventory.findOne({ wineId });
    
    // Always return a response, even if not found
    if (!inventory) {
      return res.json({ 
        quantity: 0, 
        inStock: false,
        message: 'No inventory record found'
      });
    }
    
    res.json({
      quantity: inventory.quantity,
      inStock: inventory.quantity > 0,
      lowStock: inventory.quantity <= (inventory.lowStockThreshold || 10)
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create or update inventory
const updateInventory = async (req, res) => {
  try {
    const { wineId } = req.params;
    const { quantity, lowStockThreshold, supplier } = req.body;
    
    console.log('Updating inventory for wineId:', wineId);
    console.log('New quantity:', quantity);
    
    // Find inventory by wineId (not by _id)
    let inventory = await Inventory.findOne({ wineId: wineId });
    
    if (inventory) {
      // Update existing inventory
      if (quantity !== undefined) inventory.quantity = parseInt(quantity);
      if (lowStockThreshold !== undefined) inventory.lowStockThreshold = parseInt(lowStockThreshold);
      if (supplier !== undefined) inventory.supplier = supplier;
      inventory.updatedAt = Date.now();
      
      await inventory.save();
      console.log('Inventory updated successfully. New quantity:', inventory.quantity);
    } else {
      // Create new inventory if doesn't exist
      const wine = await Wine.findById(wineId);
      inventory = await Inventory.create({
        wineId: wineId,
        wineName: wine.wine,
        quantity: parseInt(quantity) || 0,
        lowStockThreshold: lowStockThreshold || 10,
        supplier: supplier || '',
        price: wine.price || 20
      });
      console.log('New inventory created');
    }
    
    res.json(inventory);
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Adjust stock
const adjustStock = async (req, res) => {
  try {
    const { wineId } = req.params;
    const { adjustment, reason } = req.body;
    
    const inventory = await Inventory.findOne({ wineId });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    
    const newQuantity = inventory.quantity + adjustment;
    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    inventory.quantity = newQuantity;
    if (adjustment > 0) {
      inventory.lastRestocked = Date.now();
    }
    await inventory.save();
    
    res.json(inventory);
  } catch (error) {
    console.error('Adjust stock error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Initialize inventory
const initializeInventory = async (req, res) => {
  try {
    const wines = await Wine.find({});
    let created = 0;
    
    for (const wine of wines) {
      const existing = await Inventory.findOne({ wineId: wine._id });
      if (!existing) {
        await Inventory.create({
          wineId: wine._id,
          wineName: wine.wine,
          quantity: 50,
          lowStockThreshold: 10,
          supplier: 'Default Supplier',
          price: wine.price || 20
        });
        created++;
      }
    }
    
    res.json({ 
      message: 'Inventory initialized', 
      created,
      total: wines.length 
    });
  } catch (error) {
    console.error('Initialize inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};
const getInventoryStats = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    
    let totalItems = inventory.length;
    let lowStock = 0;
    let totalValue = 0;
    
    for (const item of inventory) {
      const price = item.price || 20;
      totalValue += (item.quantity || 0) * price;
      
      const threshold = item.lowStockThreshold || 10;
      if ((item.quantity || 0) <= threshold) {
        lowStock++;
      }
    }
    
    res.json({
      totalItems,
      lowStock,
      totalValue: Math.round(totalValue)
    });
  } catch (error) {
    console.error('Get inventory stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllInventory,
  getLowStockItems,
  getInventoryByWineId,
  updateInventory,
  adjustStock,
  initializeInventory,
  getInventoryStats
};