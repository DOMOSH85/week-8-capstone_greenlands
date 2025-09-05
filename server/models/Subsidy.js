const mongoose = require('mongoose');

const subsidySchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make farmer field optional to allow government-created subsidies
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: {
    type: Date
  },
  governmentNotes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subsidy', subsidySchema);