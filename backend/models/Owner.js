const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  trucks: [{
    vehicleNumber: {
      type: String,
      required: true
    },
    vehicleSize: {
      type: String,
      required: true
    },
    dimensions: {
      length: {
        type: Number,
        default: 0
      },
      width: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      }
    },
    capacity: {
      type: Number,
      default: 0 // in tons or kg
    },
    registrationDate: {
      type: String,
      default: ''
    },
    insuranceExpiry: {
      type: String,
      default: ''
    },
    fitnessExpiry: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active'
    }
  }],
  // Financial tracking
  debit: {
    type: Number,
    default: 0 // Amount I owe to this owner
  },
  credit: {
    type: Number,
    default: 0 // Amount this owner owes me
  },
  outstandingBalance: {
    type: Number,
    default: 0 // Net balance (credit - debit)
  },
  totalTrips: {
    type: Number,
    default: 0 // Total number of trips completed
  },
  totalEarnings: {
    type: Number,
    default: 0 // Total amount earned from this owner
  },
  totalPayments: {
    type: Number,
    default: 0 // Total amount paid to this owner
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Owner', ownerSchema);