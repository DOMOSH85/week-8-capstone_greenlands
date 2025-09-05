const Equipment = require('../models/Equipment');
const User = require('../models/User');

// Add new equipment
const addEquipment = async (req, res) => {
  try {
    const { name, type, manufacturer, model, purchaseDate, purchasePrice } = req.body;

    const equipment = await Equipment.create({
      farmer: req.user._id,
      name,
      type,
      manufacturer,
      model,
      purchaseDate,
      purchasePrice
    });

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all equipment for a farmer
const getFarmerEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({ farmer: req.user._id });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific equipment
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Make sure user owns the equipment
    if (equipment.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update equipment
const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Make sure user owns the equipment
    if (equipment.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, type, manufacturer, model, purchaseDate, purchasePrice, status } = req.body;

    equipment.name = name || equipment.name;
    equipment.type = type || equipment.type;
    equipment.manufacturer = manufacturer || equipment.manufacturer;
    equipment.model = model || equipment.model;
    equipment.purchaseDate = purchaseDate || equipment.purchaseDate;
    equipment.purchasePrice = purchasePrice || equipment.purchasePrice;
    equipment.status = status || equipment.status;

    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete equipment
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Make sure user owns the equipment
    if (equipment.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await equipment.remove();
    res.json({ message: 'Equipment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add maintenance record
const addMaintenanceRecord = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Make sure user owns the equipment
    if (equipment.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { date, description, cost } = req.body;

    equipment.maintenanceSchedule.push({
      date,
      description,
      cost
    });

    equipment.lastMaintenanceDate = date;

    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update usage hours
const updateUsageHours = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Make sure user owns the equipment
    if (equipment.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { hours } = req.body;

    equipment.usageHours = hours;

    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addEquipment,
  getFarmerEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  addMaintenanceRecord,
  updateUsageHours
};