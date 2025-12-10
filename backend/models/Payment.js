const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['received', 'paid'],
    required: true
  },
  entityType: {
    type: String,
    enum: ['party', 'broker'],
    required: true
  },
  entityName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);