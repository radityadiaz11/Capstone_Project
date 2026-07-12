const express = require('express');
const router  = express.Router();
const { getDashboard, getSnbpStats } = require('../controllers/dashboardController');
const { protect, restrictTo }      = require('../middleware/authMiddleware');

// GET /api/v1/dashboard → data ringkasan dashboard (guru, admin, ortu)
router.get('/', protect, restrictTo('guru', 'admin', 'ortu'), getDashboard);

// GET /api/v1/dashboard/snbp-stats → data statistik untuk snbp (guru, admin)
router.get('/snbp-stats', protect, restrictTo('guru', 'admin'), getSnbpStats);

module.exports = router;
