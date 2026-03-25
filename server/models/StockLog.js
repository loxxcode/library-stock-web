const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: ['add', 'remove', 'borrow', 'return']
  },
  quantityChanged: {
    type: Number,
    required: [true, 'Quantity changed is required']
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

stockLogSchema.index({ bookId: 1, date: -1 });
stockLogSchema.index({ action: 1 });
stockLogSchema.index({ date: -1 });

module.exports = mongoose.model('StockLog', stockLogSchema);
