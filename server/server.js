
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


// Load environment variables
dotenv.config();

const app = express();
// Marketplace routes
const marketplaceRoutes = require('./routes/marketplaceRoutes');
app.use('/api/marketplace', marketplaceRoutes);
const PORT = process.env.PORT || 8080;


// Middleware
app.use(express.json());
// Serve uploaded images statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure CORS for production
const corsOptions = {
  origin: process.env.CLIENT_URL || 'https://ogollas-final-project.vercel.app',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Greenlands API is running!' });
});

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Land routes
const landRoutes = require('./routes/landRoutes');
app.use('/api/land', landRoutes);

// Government routes
const governmentRoutes = require('./routes/governmentRoutes');
app.use('/api/government', governmentRoutes);
// Subsidy routes
const subsidyRoutes = require('./routes/subsidyRoutes');
app.use('/api/subsidies', subsidyRoutes);


// Equipment routes
const equipmentRoutes = require('./routes/equipmentRoutes');
app.use('/api/equipment', equipmentRoutes);

// Policy routes
const policyRoutes = require('./routes/policyRoutes');
app.use('/api/policies', policyRoutes);


// Message routes
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

// Contact routes
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/greenlands-db')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});