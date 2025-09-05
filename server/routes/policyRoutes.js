const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');

// Create a new policy (government only)
router.post('/', protect, policyController.createPolicy);

// Get all policies
router.get('/', protect, policyController.getPolicies);

// Update a policy
router.put('/:id', protect, policyController.updatePolicy);

// Delete a policy
router.delete('/:id', protect, policyController.deletePolicy);

// Notify users about a policy (stub)
router.post('/:id/notify', protect, policyController.notifyPolicy);

module.exports = router;
