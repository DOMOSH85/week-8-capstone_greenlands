const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Department = require('../models/Department');
const Policy = require('../models/Policy');
const Subsidy = require('../models/Subsidy');
const SubsidyApplication = require('../models/SubsidyApplication');
const SupportRequest = require('../models/SupportRequest');

const router = express.Router();

// @route   GET /api/government
// @desc    Get all government officials
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const governmentOfficials = await User.find({ role: 'government', isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(governmentOfficials);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/:id
// @desc    Get government official by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const official = await User.findOne({ 
      _id: req.params.id, 
      role: 'government',
      isActive: true 
    }).select('-password');
    
    if (!official) {
      return res.status(404).json({ message: 'Government official not found' });
    }
    
    res.json(official);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Government official not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/government/:id
// @desc    Update government official profile
// @access  Private
router.put('/:id', auth, [
  body('name', 'Name is required').not().isEmpty(),
  body('phone', 'Phone number is required').not().isEmpty(),
  body('department', 'Department is required').not().isEmpty(),
  body('position', 'Position is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, department, position, permissions } = req.body;

    // Check if user is updating their own profile or is admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updateFields = {
      name,
      phone,
      department,
      position
    };

    if (permissions) {
      updateFields.permissions = permissions;
    }

    const official = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!official) {
      return res.status(404).json({ message: 'Government official not found' });
    }

    res.json(official);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Government official not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/department/:department
// @desc    Get government officials by department
// @access  Private
router.get('/department/:department', auth, async (req, res) => {
  try {
    const officials = await User.find({ 
      role: 'government',
      department: new RegExp(req.params.department, 'i'),
      isActive: true 
    })
    .select('-password')
    .sort({ name: 1 });
    
    res.json(officials);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/stats/summary
// @desc    Get government statistics summary
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalOfficials = await User.countDocuments({ role: 'government', isActive: true });
    
    const officialsByDepartment = await User.aggregate([
      { $match: { role: 'government', isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const officialsByPosition = await User.aggregate([
      { $match: { role: 'government', isActive: true } },
      { $group: { _id: '$position', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const permissionsSummary = await User.aggregate([
      { $match: { role: 'government', isActive: true } },
      { $unwind: '$permissions' },
      { $group: { _id: '$permissions', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalOfficials,
      officialsByDepartment,
      officialsByPosition,
      permissionsSummary
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/government/:id/permissions
// @desc    Add permission to government official
// @access  Private
router.post('/:id/permissions', auth, [
  body('permission', 'Permission is required').isIn(['read', 'write', 'admin', 'approve', 'report']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Only admins can modify permissions
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { permission } = req.body;

    const official = await User.findById(req.params.id);
    
    if (!official) {
      return res.status(404).json({ message: 'Government official not found' });
    }

    if (!official.permissions.includes(permission)) {
      official.permissions.push(permission);
      await official.save();
    }

    res.json(official.select('-password'));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/government/:id/permissions/:permission
// @desc    Remove permission from government official
// @access  Private
router.delete('/:id/permissions/:permission', auth, async (req, res) => {
  try {
    // Only admins can modify permissions
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const official = await User.findById(req.params.id);
    
    if (!official) {
      return res.status(404).json({ message: 'Government official not found' });
    }

    official.permissions = official.permissions.filter(
      permission => permission !== req.params.permission
    );
    
    await official.save();

    res.json(official.select('-password'));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/policies
// @desc    Get government policies
// @access  Private
router.get('/policies', auth, async (req, res) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });
    res.json(policies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/government/policies
// @desc    Create a new policy
// @access  Private
router.post('/policies', auth, [
  body('title', 'Title is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('department', 'Department is required').not().isEmpty(),
  body('effectiveDate', 'Effective date is required').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, department, status, effectiveDate, expiryDate, budget, beneficiaries } = req.body;

    const policy = new Policy({
      title,
      description,
      department,
      status: status || 'Draft',
      effectiveDate,
      expiryDate,
      budget: budget || 0,
      beneficiaries: beneficiaries || 0,
      createdBy: req.user.id
    });

    const savedPolicy = await policy.save();
    res.json(savedPolicy);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/government/policies/:id
// @desc    Update a policy
// @access  Private
router.put('/policies/:id', auth, [
  body('title', 'Title is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('department', 'Department is required').not().isEmpty(),
  body('effectiveDate', 'Effective date is required').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, department, status, effectiveDate, expiryDate, budget, beneficiaries } = req.body;

    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    policy.title = title;
    policy.description = description;
    policy.department = department;
    policy.status = status || policy.status;
    policy.effectiveDate = effectiveDate;
    policy.expiryDate = expiryDate;
    policy.budget = budget || policy.budget;
    policy.beneficiaries = beneficiaries || policy.beneficiaries;

    const updatedPolicy = await policy.save();
    res.json(updatedPolicy);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/government/policies/:id
// @desc    Delete a policy
// @access  Private
router.delete('/policies/:id', auth, async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    await Policy.findByIdAndRemove(req.params.id);
    res.json({ message: 'Policy removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/subsidies
// @desc    Get available subsidies
// @access  Private
router.get('/subsidies', auth, async (req, res) => {
  try {
    const subsidies = await Subsidy.find().sort({ applicationDeadline: 1 });
    res.json(subsidies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/government/subsidies
// @desc    Create a new subsidy
// @access  Private
router.post('/subsidies', auth, [
  body('name', 'Name is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('eligibility', 'Eligibility criteria is required').not().isEmpty(),
  body('applicationDeadline', 'Application deadline is required').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const subsidy = new Subsidy(req.body);
    const savedSubsidy = await subsidy.save();
    res.json(savedSubsidy);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/government/subsidies/:id
// @desc    Update a subsidy
// @access  Private
router.put('/subsidies/:id', auth, [
  body('name', 'Name is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('eligibility', 'Eligibility criteria is required').not().isEmpty(),
  body('applicationDeadline', 'Application deadline is required').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const subsidy = await Subsidy.findById(req.params.id);
    if (!subsidy) {
      return res.status(404).json({ message: 'Subsidy not found' });
    }

    Object.assign(subsidy, req.body);
    const updatedSubsidy = await subsidy.save();
    res.json(updatedSubsidy);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Subsidy not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/government/subsidies/:id
// @desc    Delete a subsidy
// @access  Private
router.delete('/subsidies/:id', auth, async (req, res) => {
  try {
    const subsidy = await Subsidy.findById(req.params.id);
    if (!subsidy) {
      return res.status(404).json({ message: 'Subsidy not found' });
    }

    await Subsidy.findByIdAndRemove(req.params.id);
    res.json({ message: 'Subsidy removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Subsidy not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/subsidy-applications
// @desc    Get all subsidy applications
// @access  Private
router.get('/subsidy-applications', auth, async (req, res) => {
  try {
    const applications = await SubsidyApplication.find()
      .populate('subsidy', 'name')
      .populate('farmer', 'name email')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/government/subsidy-applications/:id
// @desc    Update subsidy application status
// @access  Private
router.put('/subsidy-applications/:id', auth, [
  body('status', 'Status is required').isIn(['pending', 'approved', 'rejected'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const application = await SubsidyApplication.findById(req.params.id)
      .populate('subsidy')
      .populate('farmer');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = req.body.status;
    const updatedApplication = await application.save();
    
    // TODO: Send notification to farmer about status change
    
    res.json(updatedApplication);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/departments
// @desc    Get all departments
// @access  Private
router.get('/departments', auth, async (req, res) => {
  try {
    const departments = await Department.find({ active: true }).sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/government/departments
// @desc    Create a new department
// @access  Private
router.post('/departments', auth, [
  body('name', 'Department name is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, head, budget } = req.body;
    
    // Check if department already exists
    const existingDepartment = await Department.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const department = new Department({
      name,
      description,
      head: head || null,
      budget: budget || 0
    });

    const savedDepartment = await department.save();
    res.json(savedDepartment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/government/departments/:id
// @desc    Update a department
// @access  Private
router.put('/departments/:id', auth, [
  body('name', 'Department name is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if another department with same name exists
    const existingDepartment = await Department.findOne({
      name: new RegExp(`^${req.body.name}$`, 'i'),
      _id: { $ne: req.params.id }
    });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department name already exists' });
    }

    Object.assign(department, req.body);
    const updatedDepartment = await department.save();
    res.json(updatedDepartment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/government/departments/:id
// @desc    Delete a department
// @access  Private
router.delete('/departments/:id', auth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Instead of deleting, mark as inactive
    department.active = false;
    await department.save();
    
    res.json({ message: 'Department deactivated' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/government/support-requests
// @desc    Get all support requests
// @access  Private
router.get('/support-requests', auth, async (req, res) => {
  try {
    const requests = await SupportRequest.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/government/support-requests/:id
// @desc    Update support request status
// @access  Private
router.put('/support-requests/:id', auth, [
  body('status', 'Status is required').isIn(['pending', 'in-progress', 'resolved', 'closed']),
  body('response', 'Response is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const request = await SupportRequest.findById(req.params.id).populate('user');
    if (!request) {
      return res.status(404).json({ message: 'Support request not found' });
    }

    request.status = req.body.status;
    request.response = req.body.response;
    request.resolvedBy = req.user.id;
    request.resolvedAt = new Date();
    
    const updatedRequest = await request.save();
    
    // TODO: Send notification to user about status change
    
    res.json(updatedRequest);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Support request not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 