const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createLand,
  getFarmerLands,
  getLandById,
  updateLand,
  deleteLand,
  addCrop,
  addWaterUsage,
  addFertilizerUsage,
  generateLandReport
} = require('../controllers/landController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Farmer routes
router.route('/')
  .post(authorize('farmer'), createLand)
  .get(authorize('farmer'), getFarmerLands);

router.route('/:id')
  .get(getLandById)
  .put(authorize('farmer'), updateLand)
  .delete(authorize('farmer'), deleteLand);

router.route('/:id/crops').post(authorize('farmer'), addCrop);
router.route('/:id/water').post(authorize('farmer'), addWaterUsage);
router.route('/:id/fertilizer').post(authorize('farmer'), addFertilizerUsage);
router.route('/:id/report').get(generateLandReport);

module.exports = router;