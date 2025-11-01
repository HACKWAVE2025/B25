const router = require('express').Router();
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { createHospital, listHospitals, updateHospitalStatus } = require('../controllers/adminController');

router.post('/hospitals', authenticate, authorize('admin'), createHospital);
router.get('/hospitals', authenticate, authorize('admin'), listHospitals);
router.patch('/hospitals/:id/status', authenticate, authorize('admin'), updateHospitalStatus);

module.exports = router;
