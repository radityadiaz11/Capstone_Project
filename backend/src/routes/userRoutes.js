const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// GET /api/v1/users (Untuk Admin, get semua user)
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/v1/users/profile (Get profile diri sendiri, semua role)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/users/profile (Update profile diri sendiri, semua role)
router.put('/profile', protect, async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (nama) user.nama = nama;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', data: { id: user.id, nama: user.nama, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/v1/users (Admin create user)
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { nama, email, password, role, mengampu_kelas } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ nama, email, password: hashedPassword, role, mengampu_kelas });
    res.status(201).json({ success: true, message: 'User created', data: { id: newUser.id, nama: newUser.nama, role: newUser.role, mengampu_kelas: newUser.mengampu_kelas } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/v1/users/:id (Admin edit user)
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { nama, email, password, role, mengampu_kelas } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (nama) user.nama = nama;
    if (email) user.email = email;
    if (role) user.role = role;
    if (mengampu_kelas !== undefined) user.mengampu_kelas = mengampu_kelas;
    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }
    await user.save();
    res.json({ success: true, message: 'User updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/v1/users/:id (Admin delete user)
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.destroy();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
