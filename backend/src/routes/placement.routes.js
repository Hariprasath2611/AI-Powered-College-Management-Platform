const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placement.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(authenticate);

// Drives & Companies Lists (accessible by all authenticated users)
router.get('/companies', placementController.getCompanies);
router.get('/drives', placementController.getDrives);
router.get('/stats', placementController.getPlacementStats);

// Student Only
router.post('/drives/:driveId/apply', authorizeRoles('STUDENT'), placementController.applyToDrive);

// Admin / Faculty Only
router.post('/companies', authorizeRoles('ADMIN'), placementController.createCompany);
router.post('/drives', authorizeRoles('ADMIN'), placementController.scheduleDrive);
router.get('/drives/:driveId/applications', authorizeRoles('ADMIN', 'FACULTY'), placementController.getDriveApplications);
router.put('/applications/:id', authorizeRoles('ADMIN', 'FACULTY'), placementController.updateApplicationStatus);

module.exports = router;
