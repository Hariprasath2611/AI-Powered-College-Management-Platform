const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', eventController.getEvents);

router.post('/:eventId/register', authorizeRoles('STUDENT'), eventController.registerForEvent);

router.post('/', authorizeRoles('ADMIN'), eventController.createEvent);

router.post('/:eventId/checkin', authorizeRoles('ADMIN', 'FACULTY'), eventController.checkInEvent);
router.get('/:id/analytics', authorizeRoles('ADMIN', 'FACULTY'), eventController.getEventAnalytics);

module.exports = router;
