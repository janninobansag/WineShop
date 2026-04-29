const Inventory = require('../models/Inventory');

const getInventoryStats = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    
    let totalItems = inventory.length;
    let lowStock = 0;
    let totalValue = 0;
    
    for (const item of inventory) {
      const price = item.price || 20;
      totalValue += (item.quantity || 0) * price;
      
      if ((item.quantity || 0) <= (item.lowStockThreshold || 10)) {
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

module.exports = { getInventoryStats };