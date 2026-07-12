const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/scores', protect, restrictTo('guru', 'admin'), academicController.getScores);
router.get('/monitoring', protect, restrictTo('guru', 'admin'), academicController.getMonitoring);

module.exports = router;
