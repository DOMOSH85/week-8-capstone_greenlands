const mongoose = require('mongoose');
const MarketplaceItem = require('../models/MarketplaceItem');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/greenlands-db';

const demoImages = [
  '/uploads/demo1.jpg',
  '/uploads/demo2.jpg',
  '/uploads/demo3.jpg',
  '/uploads/demo4.jpg',
  '/uploads/demo5.jpg',
];

const demoItems = [
  {
    title: 'Fresh Maize',
    description: 'High quality maize harvested this season.',
    type: 'produce',
    price: 2500,
    unit: '100kg bag',
    images: [demoImages[0]],
    status: 'available',
  },
  {
    title: 'Organic Tomatoes',
    description: 'Red, juicy, and organic tomatoes for sale.',
    type: 'produce',
    price: 150,
    unit: 'kg',
    images: [demoImages[1]],
    status: 'available',
  },
  {
    title: 'Land for Lease - 5 acres',
    description: 'Fertile land available for lease, suitable for horticulture.',
    type: 'land-lease',
    price: 20000,
    unit: 'acre/year',
    images: [demoImages[2]],
    status: 'available',
  },
  {
    title: 'Tractor for Sale',
    description: 'Well-maintained tractor, 3 years old, low hours.',
    type: 'equipment-sale',
    price: 800000,
    unit: 'unit',
    images: [demoImages[3]],
    status: 'available',
  },
  {
    title: 'Government Subsidized Fertilizer',
    description: 'Fertilizer available for farmers at subsidized rates.',
    type: 'produce',
    price: 1200,
    unit: '50kg bag',
    images: [demoImages[4]],
    status: 'available',
  },
  {
    title: 'Land for Sale - 10 acres',
    description: 'Prime land for sale, close to main road.',
    type: 'land-sale',
    price: 1500000,
    unit: 'acre',
    images: [demoImages[2]],
    status: 'available',
  },
  {
    title: 'Irrigation Pump (Govt)',
    description: 'Government-issued irrigation pump for lease.',
    type: 'equipment-lease',
    price: 5000,
    unit: 'month',
    images: [demoImages[3]],
    status: 'available',
  },
];

async function populate() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Find a farmer and a government user
  const farmer = await User.findOne({ role: 'farmer' });
  const government = await User.findOne({ role: 'government' });
  if (!farmer || !government) {
    console.error('Please ensure at least one farmer and one government user exist in the database.');
    process.exit(1);
  }

  // Alternate between farmer and government for demo listings
  const items = demoItems.map((item, idx) => ({
    ...item,
    postedBy: idx % 2 === 0 ? farmer._id : government._id,
  }));

  await MarketplaceItem.deleteMany({});
  await MarketplaceItem.insertMany(items);
  console.log('Marketplace populated with demo data.');
  process.exit(0);
}

populate().catch(err => {
  console.error(err);
  process.exit(1);
});