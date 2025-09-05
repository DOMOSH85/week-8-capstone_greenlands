const Land = require('../models/Land');
const User = require('../models/User');

// Create a new land parcel
const createLand = async (req, res) => {
  try {
    const { name, size, location, soilType } = req.body;

    const land = await Land.create({
      farmer: req.user._id,
      name,
      size,
      location,
      soilType
    });

    res.status(201).json(land);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all land parcels for a farmer
const getFarmerLands = async (req, res) => {
  try {
    const lands = await Land.find({ farmer: req.user._id });
    res.json(lands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific land parcel
const getLandById = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // Make sure user owns the land or is government
    if (land.farmer.toString() !== req.user._id.toString() && req.user.role !== 'government') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(land);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a land parcel
const updateLand = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // Make sure user owns the land
    if (land.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedLand = await Land.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(updatedLand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a land parcel
const deleteLand = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // Make sure user owns the land
    if (land.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await land.remove();
    res.json({ message: 'Land removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add crop to land
const addCrop = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // Make sure user owns the land
    if (land.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    land.crops.push(req.body);
    await land.save();

    res.json(land);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add water usage record
const addWaterUsage = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // Make sure user owns the land
    if (land.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    land.waterUsage.push(req.body);
    await land.save();

    res.json(land);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add fertilizer usage record
const addFertilizerUsage = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // Make sure user owns the land
    if (land.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    land.fertilizerUsage.push(req.body);
    await land.save();

    res.json(land);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate land report
const generateLandReport = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id).populate('farmer', 'name email');

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // Make sure user owns the land or is government
    if (land.farmer.toString() !== req.user._id.toString() && req.user.role !== 'government') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Generate report data
    const report = {
      land: {
        name: land.name,
        size: land.size,
        soilType: land.soilType,
        sustainabilityScore: land.sustainabilityScore,
        location: land.location
      },
      farmer: {
        name: land.farmer.name,
        email: land.farmer.email
      },
      crops: land.crops,
      waterUsage: land.waterUsage,
      fertilizerUsage: land.fertilizerUsage,
      pesticideUsage: land.pesticideUsage,
      totalWaterUsed: land.waterUsage.reduce((acc, w) => acc + w.amount, 0),
      totalFertilizerUsed: land.fertilizerUsage.reduce((acc, f) => acc + f.amount, 0),
      totalPesticideUsed: land.pesticideUsage.reduce((acc, p) => acc + (p.amount || 0), 0),
      reportDate: new Date()
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLand,
  getFarmerLands,
  getLandById,
  updateLand,
  deleteLand,
  addCrop,
  addWaterUsage,
  addFertilizerUsage,
  generateLandReport
};