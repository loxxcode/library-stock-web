const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  returnDate: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    default: function() {
      const dueDate = new Date(this.borrowDate);
      dueDate.setDate(dueDate.getDate() + 14);
      return dueDate;
    }
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

borrowSchema.pre('save', function(next) {
  if (this.returnDate && this.status === 'borrowed') {
    this.status = 'returned';
  } else if (!this.returnDate && this.dueDate < new Date() && this.status === 'borrowed') {
    this.status = 'overdue';
  }
  next();
});

borrowSchema.index({ userId: 1, status: 1 });
borrowSchema.index({ bookId: 1, status: 1 });
borrowSchema.index({ status: 1 });
borrowSchema.index({ dueDate: 1 });

borrowSchema.methods.isOverdue = function() {
  return this.status === 'borrowed' && this.dueDate < new Date();
};

module.exports = mongoose.model('Borrow', borrowSchema);
