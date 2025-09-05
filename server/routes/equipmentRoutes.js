const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  addEquipment,
  getFarmerEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  addMaintenanceRecord,
  updateUsageHours
} = require('../controllers/equipmentController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Farmer routes
router.route('/')
  .post(authorize('farmer'), addEquipment)
  .get(authorize('farmer'), getFarmerEquipment);

router.route('/:id')
  .get(getEquipmentById)
  .put(authorize('farmer'), updateEquipment)
  .delete(authorize('farmer'), deleteEquipment);

router.route('/:id/maintenance')
  .post(authorize('farmer'), addMaintenanceRecord);

router.route('/:id/usage')
  .put(authorize('farmer'), updateUsageHours);

module.exports = router;