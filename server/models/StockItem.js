const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['book', 'supply'],
    default: 'book'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  minStock: {
    type: Number,
    required: [true, 'Minimum stock is required'],
    min: [0, 'Minimum stock cannot be negative'],
    default: 5
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

stockItemSchema.index({ name: 'text', category: 'text' });
stockItemSchema.index({ type: 1 });
stockItemSchema.index({ category: 1 });

module.exports = mongoose.model('StockItem', stockItemSchema);
