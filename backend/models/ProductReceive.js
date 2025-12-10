const mongoose = require('mongoose');

const productReceiveSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  receivedFrom: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    required: true
  },
  truckDimensions: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProductReceive', productReceiveSchema);