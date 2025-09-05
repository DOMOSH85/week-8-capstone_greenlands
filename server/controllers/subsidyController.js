const Subsidy = require('../models/Subsidy');
const User = require('../models/User');

// Apply for a subsidy
const applyForSubsidy = async (req, res) => {
  try {
    const { name, description, amount } = req.body;

    const subsidy = await Subsidy.create({
      farmer: req.user._id,
      name,
      description,
      amount
    });

    res.status(201).json(subsidy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all subsidies for a farmer
const getFarmerSubsidies = async (req, res) => {
  try {
    const subsidies = await Subsidy.find({ farmer: req.user._id });
    res.json(subsidies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific subsidy
const getSubsidyById = async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id);

    if (!subsidy) {
      return res.status(404).json({ message: 'Subsidy not found' });
    }

    // Make sure user owns the subsidy
    if (subsidy.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(subsidy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a subsidy application
const updateSubsidy = async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id);

    if (!subsidy) {
      return res.status(404).json({ message: 'Subsidy not found' });
    }

    // Make sure user owns the subsidy
    if (subsidy.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, description, amount } = req.body;

    subsidy.name = name || subsidy.name;
    subsidy.description = description || subsidy.description;
    subsidy.amount = amount || subsidy.amount;

    const updatedSubsidy = await subsidy.save();
    res.json(updatedSubsidy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a subsidy application
const deleteSubsidy = async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id);

    if (!subsidy) {
      return res.status(404).json({ message: 'Subsidy not found' });
    }

    // Make sure user owns the subsidy
    if (subsidy.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await subsidy.remove();
    res.json({ message: 'Subsidy application removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all subsidies (for government users)
const getAllSubsidies = async (req, res) => {
  try {
    const subsidies = await Subsidy.find().populate('farmer', 'name email');
    res.json(subsidies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update subsidy status (for government users)
const updateSubsidyStatus = async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id);

    if (!subsidy) {
      return res.status(404).json({ message: 'Subsidy not found' });
    }

    const { status, governmentNotes } = req.body;

    subsidy.status = status;
    subsidy.governmentNotes = governmentNotes;
    if (status === 'approved') {
      subsidy.approvalDate = Date.now();
    }

    const updatedSubsidy = await subsidy.save();
    res.json(updatedSubsidy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForSubsidy,
  getFarmerSubsidies,
  getSubsidyById,
  updateSubsidy,
  deleteSubsidy,
  getAllSubsidies,
  updateSubsidyStatus
};