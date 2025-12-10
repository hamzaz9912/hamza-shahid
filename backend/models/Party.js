const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Regular', 'One-time'],
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: ''
  },
  businessType: {
    type: String,
    default: ''
  },
  gstNumber: {
    type: String,
    default: ''
  },
  panNumber: {
    type: String,
    default: ''
  },
  debit: {
    type: Number,
    default: 0
  },
  credit: {
    type: Number,
    default: 0
  },
  outstandingBalance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Party', partySchema);