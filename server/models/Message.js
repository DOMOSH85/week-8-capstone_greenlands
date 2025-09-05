const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  threadId: {
    type: String,
    required: true
  },
  channelType: {
    type: String,
    enum: ['government-government', 'government-farmer', 'farmer-farmer', 'general'],
    default: 'general'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);