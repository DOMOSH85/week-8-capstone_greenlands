const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
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
  size: {
    type: Number, // in acres
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    address: String
  },
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'silty', 'peaty', 'chalky', 'loamy'],
    required: true
  },
  crops: [{
    name: String,
    plantingDate: Date,
    harvestDate: Date,
    yield: Number // in tons/hectare
  }],
  waterUsage: [{
    date: Date,
    amount: Number // in liters
  }],
  fertilizerUsage: [{
    date: Date,
    type: String,
    amount: Number // in kg
  }],
  pesticideUsage: [{
    date: Date,
    type: String,
    amount: Number // in liters
  }],
  sustainabilityScore: {
    type: Number, // 0-100
    default: 0
  },
  certifications: [{
    name: String,
    issuedDate: Date,
    expiryDate: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Land', landSchema);