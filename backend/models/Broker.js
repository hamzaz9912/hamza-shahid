const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  commission: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  contact: {
    type: String,
    required: true
  },
  station: {
    type: String,
    required: true
  },
  debit: {
    type: Number,
    default: 0
  },
  credit: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Broker', brokerSchema);