const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['produce', 'land-sale', 'land-lease', 'equipment-sale', 'equipment-lease'], required: true },
  price: { type: Number, required: true },
  unit: { type: String }, // e.g. kg, acre, per day
  images: [String],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'sold', 'leased'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);
