const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAnalytics, getAllFarmers, getAllLands, createSubsidy, updateSubsidy } = require('../controllers/governmentController');

const router = express.Router();

// All routes are protected and only accessible by government users
router.use(protect);
router.use(authorize('government'));

router.get('/analytics', getAnalytics);
router.get('/farmers', getAllFarmers);
router.get('/lands', getAllLands);

// Subsidy management routes
router.post('/subsidies', createSubsidy);
router.put('/subsidies/:id', updateSubsidy);

module.exports = router;