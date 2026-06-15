const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(authenticate, authorizeRoles('STUDENT'));

router.get('/dashboard', studentController.getDashboardSummary);
router.get('/attendance', studentController.getAttendance);
router.get('/assignments', studentController.getAssignments);
router.post('/assignments/submit', studentController.submitAssignment);
router.get('/marks', studentController.getMarks);
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);

module.exports = router;
