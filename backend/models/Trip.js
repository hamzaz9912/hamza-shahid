const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  serialNumber: {
    type: Number,
    required: true,
    unique: true
  },
  driverNumber: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  vehicleSize: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  freight: {
    type: Number,
    required: true
  },
  officeFare: {
    type: Number,
    required: true
  },
  vehicleReceivedBilty: {
    type: Number,
    required: true
  },
  vehicleFare: {
    type: Number,
    required: true
  },
  laborCharges: {
    type: Number,
    required: true
  },
  exciseCharges: {
    type: Number,
    required: true
  },
  bonus: {
    type: Number,
    required: true
  },
  miscExpenses: {
    type: Number,
    required: true
  },
  dailyWages: {
    type: Number,
    required: true
  },
  extraWeight: {
    type: Number,
    required: true
  },
  partyBalance: {
    type: Number,
    required: true
  },
  partyReceived: {
    type: Number,
    required: true
  },
  brokerageCommission: {
    type: Number,
    required: true
  },
  vehicleBalance: {
    type: Number,
    required: true
  },
  vehicleAccount: {
    type: String,
    required: true
  },
  additionalDetails: {
    type: String,
    default: ''
  },
  station: {
    type: String,
    required: true
  },
  brokerName: {
    type: String,
    required: true
  },
  partyName: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    default: ''
  },
  productQuantity: {
    type: Number,
    default: 0
  },
  productUnit: {
    type: String,
    default: ''
  },
  productType: {
    type: String,
    default: ''
  },
  truckDimensions: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);