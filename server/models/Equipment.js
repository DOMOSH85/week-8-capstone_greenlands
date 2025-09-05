const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'retired'],
    default: 'active'
  },
  maintenanceSchedule: [{
    date: Date,
    description: String,
    cost: Number
  }],
  usageHours: {
    type: Number,
    default: 0
  },
  lastMaintenanceDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Equipment', equipmentSchema);