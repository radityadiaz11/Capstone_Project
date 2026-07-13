const express = require('express');
const router  = express.Router();
const { predictStudent, predictBatch, getAiModelStatus, getNarasi } = require('../controllers/predictController');
const { protect, restrictTo }        = require('../middleware/authMiddleware');

// POST /api/v1/predict → prediksi performa siswa (guru, admin, ortu)
router.post('/', protect, restrictTo('guru', 'admin', 'ortu'), predictStudent);

// POST /api/v1/predict/batch → prediksi semua siswa (guru & admin)
router.post('/batch', protect, restrictTo('guru', 'admin'), predictBatch);

// GET /api/v1/predict/model-status → cek status model AI (all authenticated)
router.get('/model-status', protect, getAiModelStatus);

// POST /api/v1/predict/narasi → ambil narasi AI (guru, admin, ortu)
router.post('/narasi', protect, restrictTo('guru', 'admin', 'ortu'), getNarasi);

module.exports = router;
