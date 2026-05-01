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
const getInventoryByWineId = async (req, res) => {
  try {
    const { wineId } = req.params;
    const inventory = await Inventory.findOne({ wineId });
    if (!inventory) {
      return res.json({ quantity: 0, inStock: false });
    }
    res.json(inventory);
  } catch (error) {
    console.error('Get inventory by wineId error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update inventory
const updateInventory = async (req, res) => {
  try {
    const { wineId } = req.params;
    const { quantity, lowStockThreshold, supplier } = req.body;
    
    let inventory = await Inventory.findOne({ wineId });
    
    if (inventory) {
      if (quantity !== undefined) inventory.quantity = parseInt(quantity);
      if (lowStockThreshold !== undefined) inventory.lowStockThreshold = parseInt(lowStockThreshold);
      if (supplier !== undefined) inventory.supplier = supplier;
      inventory.updatedAt = Date.now();
      await inventory.save();
    } else {
      const wine = await Wine.findById(wineId);
      inventory = await Inventory.create({
        wineId,
        wineName: wine.wine,
        quantity: parseInt(quantity) || 0,
        lowStockThreshold: lowStockThreshold || 10,
        supplier: supplier || '',
        price: wine.price || 20
      });
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

// Get inventory stats
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