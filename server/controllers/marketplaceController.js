const MarketplaceItem = require('../models/MarketplaceItem');

// Create a new marketplace item
exports.createItem = async (req, res) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }
    const item = new MarketplaceItem({
      ...req.body,
      images,
      postedBy: req.user._id
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create item', error: err.message });
  }
};

// Get all marketplace items
exports.getItems = async (req, res) => {
  try {
    const items = await MarketplaceItem.find().populate('postedBy', 'name role');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
};

// Update item status (sold/leased)
exports.updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const item = await MarketplaceItem.findByIdAndUpdate(id, { status }, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item', error: err.message });
  }
};

// Delete item and its images
const fs = require('fs');
const path = require('path');
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MarketplaceItem.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    // Delete images from uploads folder
    if (item.images && item.images.length > 0) {
      item.images.forEach(imgPath => {
        const filePath = path.join(__dirname, '..', imgPath);
        fs.unlink(filePath, err => {
          // Ignore errors for missing files
        });
      });
    }
    res.json({ message: 'Item and images deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
};
