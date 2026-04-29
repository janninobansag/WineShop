const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  wineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wine',
    required: true,
    unique: true
  },
  wineName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 0
  },
  reserved: {
    type: Number,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  supplier: {
    type: String,
    default: ''
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // This automatically handles createdAt and updatedAt
});

// NO pre-save middleware at all - let mongoose handle it

module.exports = mongoose.model('Inventory', inventorySchema);