const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['farmer', 'government', 'admin'],
    default: 'farmer'
  },
  location: {
    type: String,
    trim: true
  },
  farmSize: {
    type: Number, // in acres
    required: function() { return this.role === 'farmer'; }
  },
  department: {
    type: String,
    trim: true,
    required: function() { return this.role === 'government'; }
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);