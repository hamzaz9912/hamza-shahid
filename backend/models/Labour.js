const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
  cost: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['party', 'self'],
    required: true
  },
  selfName: {
    type: String,
    enum: ['hamza', 'shahid'],
    required: function() {
      return this.source === 'self';
    }
  },
  partyName: {
    type: String,
    required: function() {
      return this.source === 'party';
    }
  },
  date: {
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

module.exports = mongoose.model('Labour', labourSchema);