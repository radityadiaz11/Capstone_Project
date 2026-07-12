const express = require('express');
const router  = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// GET    /api/v1/students       → ambil semua siswa (guru, admin, ortu)
router.get('/',      protect, restrictTo('guru', 'admin', 'ortu'), getAllStudents);

// GET    /api/v1/students/:id   → ambil 1 siswa (guru, admin, ortu)
router.get('/:id',   protect, restrictTo('guru', 'admin', 'ortu'), getStudentById);

// POST   /api/v1/students       → tambah siswa baru (hanya admin & guru)
router.post('/',     protect, restrictTo('admin', 'guru'), createStudent);

// PUT    /api/v1/students/:id   → update data siswa (hanya admin & guru)
router.put('/:id',   protect, restrictTo('admin', 'guru'), updateStudent);

// DELETE /api/v1/students/:id   → hapus siswa (hanya admin)
router.delete('/:id', protect, restrictTo('admin'), deleteStudent);

module.exports = router;
