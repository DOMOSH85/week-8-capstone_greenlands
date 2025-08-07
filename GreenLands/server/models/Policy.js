const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Inactive', 'Expired', 'Planning'],
    default: 'Draft'
  },
  effectiveDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  budget: {
    type: Number,
    default: 0
  },
  beneficiaries: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update updatedAt
PolicySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Policy', PolicySchema);