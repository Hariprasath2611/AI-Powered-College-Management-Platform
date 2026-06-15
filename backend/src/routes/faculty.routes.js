const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(authenticate, authorizeRoles('FACULTY'));

router.get('/dashboard', facultyController.getDashboardSummary);
router.post('/assign-subject', facultyController.assignSubject);
router.get('/classes', facultyController.getAssignedClasses);
router.get('/students', facultyController.getStudentsForAttendance);
router.post('/attendance', facultyController.markAttendance);
router.put('/attendance/:id', facultyController.editAttendance);

router.post('/assignments', facultyController.createAssignment);
router.get('/assignments/:id/submissions', facultyController.getAssignmentSubmissions);
router.post('/submissions/:submissionId/grade', facultyController.gradeSubmission);

router.post('/marks', facultyController.addMarks);

router.get('/monitoring/alerts', facultyController.getLowAttendanceAlerts);
router.get('/class-report', facultyController.getClassReport);

module.exports = router;
