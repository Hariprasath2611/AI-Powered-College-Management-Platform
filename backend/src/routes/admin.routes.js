const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);

router.post('/users/student', adminController.createStudent);
router.post('/users/faculty', adminController.createFaculty);
router.put('/users/student/:id', adminController.updateStudent);
router.put('/users/faculty/:id', adminController.updateFaculty);
router.delete('/users/:id', adminController.deleteUser);
router.get('/users', adminController.getUsers);

router.post('/departments', adminController.createDepartment);
router.get('/departments', adminController.getDepartments);

router.post('/subjects', adminController.createSubject);
router.get('/subjects', adminController.getSubjects);

module.exports = router;
