// Update a policy
exports.updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, effectiveDate } = req.body;
    const policy = await Policy.findByIdAndUpdate(
      id,
      { title, description, status, effectiveDate },
      { new: true }
    );
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update policy', error: err.message });
  }
};

// Delete a policy
exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findByIdAndDelete(id);
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json({ message: 'Policy deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete policy', error: err.message });
  }
};

// Notify all users about a new policy (stub, extend as needed)
exports.notifyPolicy = async (req, res) => {
  // This is a stub for notification logic (e.g., email, push, in-app)
  // You can integrate with a notification service here
  res.json({ message: 'Notification sent (stub)' });
};
const Policy = require('../models/Policy');

// Create a new policy
exports.createPolicy = async (req, res) => {
  try {
    const { title, description, status, effectiveDate } = req.body;
    const policy = new Policy({
      title,
      description,
      status: status || 'Draft',
      effectiveDate,
      createdBy: req.user._id
    });
    await policy.save();
    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create policy', error: err.message });
  }
};

// Get all policies
exports.getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().populate('createdBy', 'name email');
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch policies', error: err.message });
  }
};
