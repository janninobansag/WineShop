const mongoose = require('mongoose');

const wineSchema = new mongoose.Schema({
  winery: {
    type: String,
    required: true,
  },
  wine: {
    type: String,
    required: true,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 29.99,
  },
  category: {
    type: String,
    enum: ['reds', 'whites', 'rose', 'sparkling'],
    required: true,
  },
  type: {
    type: String,
    enum: ['Red', 'White', 'Rosé', 'Sparkling'],
    required: true,
  },
  vintage: {
    type: String,
    default: 'NV',
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Wine', wineSchema);