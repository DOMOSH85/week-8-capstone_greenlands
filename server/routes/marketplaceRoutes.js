const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Create item (farmer or government) with image upload
router.post('/', protect, upload.array('images', 5), marketplaceController.createItem);
// Get all items
router.get('/', marketplaceController.getItems);
// Update item status
router.put('/:id/status', protect, marketplaceController.updateItemStatus);
// Delete item
router.delete('/:id', protect, marketplaceController.deleteItem);

module.exports = router;
