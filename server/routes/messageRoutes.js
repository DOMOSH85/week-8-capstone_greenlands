const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getMessages,
  getThreadMessages,
  getUnreadCount,
  getMessagingUsers
} = require('../controllers/messageController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(sendMessage)
  .get(getMessages);

router.get('/unread-count', getUnreadCount);
router.get('/thread/:threadId', getThreadMessages);
router.get('/users', getMessagingUsers);

module.exports = router;