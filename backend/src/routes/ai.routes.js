const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(authenticate, authorizeRoles('STUDENT'));

router.post('/resume/analyze', aiController.analyzeResume);
router.post('/interview/start', aiController.startInterview);
router.post('/interview/submit', aiController.submitInterview);
router.get('/career/recommend', aiController.recommendCareer);

module.exports = router;
