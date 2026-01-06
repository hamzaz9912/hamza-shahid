const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  serialNumber: {
    type: Number,
    required: true,
    unique: true
  },
  driverNumber: {
    type: String,
    default: ''
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
    default: ''
  },
  weight: {
    type: Number,
    default: 0
  },
  freight: {
    type: Number,
    default: 0
  },
  officeFare: {
    type: Number,
    default: 0
  },
  vehicleReceivedBilty: {
    type: Number,
    default: 0
  },
  vehicleFare: {
    type: Number,
    default: 0
  },
  laborCharges: {
    type: Number,
    default: 0
  },
  exciseCharges: {
    type: Number,
    default: 0
  },
  bonus: {
    type: Number,
    default: 0
  },
  miscExpenses: {
    type: Number,
    default: 0
  },
  dailyWages: {
    type: Number,
    default: 0
  },
  extraWeight: {
    type: Number,
    default: 0
  },
  mt: {
    type: Number,
    default: 0
  },
  partyBalance: {
    type: Number,
    default: 0
  },
  partyReceived: {
    type: Number,
    default: 0
  },
  brokerageCommission: {
    type: Number,
    default: 0
  },
  vehicleBalance: {
    type: Number,
    default: 0
  },
  vehicleAccount: {
    type: String,
    default: ''
  },
  additionalDetails: {
    type: String,
    default: ''
  },
  station: {
    type: String,
    default: ''
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