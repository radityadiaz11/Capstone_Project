const express = require('express');
const router  = express.Router();
const { getAllWarnings, markAsRead } = require('../controllers/warningController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// GET /api/v1/warnings           → ambil semua warning (guru, admin)
router.get('/', protect, restrictTo('guru', 'admin'), getAllWarnings);

// PUT /api/v1/warnings/:id/read  → tandai sudah dibaca (guru, admin)
router.put('/:id/read', protect, restrictTo('guru', 'admin'), markAsRead);

module.exports = router;
