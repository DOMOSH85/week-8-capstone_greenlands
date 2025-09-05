const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  applyForSubsidy,
  getFarmerSubsidies,
  getSubsidyById,
  updateSubsidy,
  deleteSubsidy,
  getAllSubsidies,
  updateSubsidyStatus
} = require('../controllers/subsidyController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Farmer routes
router.route('/')
  .post(authorize('farmer'), applyForSubsidy)
  .get(authorize('farmer'), getFarmerSubsidies);

router.route('/:id')
  .get(getSubsidyById)
  .put(authorize('farmer'), updateSubsidy)
  .delete(authorize('farmer'), deleteSubsidy);

// Government routes
router.route('/admin/all')
  .get(authorize('government'), getAllSubsidies);

router.route('/admin/:id/status')
  .put(authorize('government'), updateSubsidyStatus);

module.exports = router;