const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { recipientId, subject, content, channelType } = req.body;
    
    // Generate a thread ID (for simplicity, we'll use timestamp + sender ID)
    const threadId = `${Date.now()}-${req.user._id}`;
    
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      subject,
      content,
      threadId,
      channelType: channelType || 'general'
    });
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for the current user
const getMessages = async (req, res) => {
  try {
    const { channelType } = req.query;
    
    // Build query based on channel type
    const query = {
      $or: [
        { recipient: req.user._id },
        { sender: req.user._id }
      ]
    };
    
    if (channelType) {
      query.channelType = channelType;
    }
    
    const messages = await Message.find(query)
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages in a specific thread
const getThreadMessages = async (req, res) => {
  try {
    const { threadId } = req.params;
    
    const messages = await Message.find({ threadId })
      .populate('sender', 'name email role')
      .populate('recipient', 'name email role')
      .sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { threadId, recipient: req.user._id },
      { read: true }
    );
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const { channelType } = req.query;
    
    const query = {
      recipient: req.user._id,
      read: false
    };
    
    if (channelType) {
      query.channelType = channelType;
    }
    
    const count = await Message.countDocuments(query);
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get users for messaging (filtered by role for government users)
const getMessagingUsers = async (req, res) => {
  try {
    let query = {};
    
    // If user is government, they can message anyone
    // If user is farmer, they can only message government and other farmers
    if (req.user.role === 'farmer') {
      query = { role: { $in: ['government', 'farmer'] } };
    }
    
    const users = await User.find(query).select('name email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getThreadMessages,
  getUnreadCount,
  getMessagingUsers
};