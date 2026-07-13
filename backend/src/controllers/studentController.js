const Student      = require('../models/Student');
const EarlyWarning = require('../models/EarlyWarning');
const {
  isUsingDatabase,
  getInMemoryStudents,
  setInMemoryStudents
} = require('../config/dataStore');

const formatSequelizeError = (error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors && error.errors[0] ? error.errors[0].path : '';
    if (field === 'id' || field === 'PRIMARY') {
      return 'Internal Database Error: ID Auto-increment bentrok (Sequence out of sync).';
    }
    return `NISN sudah terdaftar.`;
  }
  if (error.name === 'SequelizeValidationError') {
    return error.errors.map(e => {
      const fieldMap = {
        student_id: 'NISN',
        nama: 'Nama',
        prodi: 'Program Studi',
        math_score: 'Nilai Matematika',
        indo_score: 'Nilai B. Indo',
        eng_score: 'Nilai B. Inggris',
        bio_score: 'Nilai Biologi',
        chem_score: 'Nilai Kimia',
        phy_score: 'Nilai Fisika'
      };
      const fieldName = fieldMap[e.path] || e.path;
      if (e.validatorKey === 'isFloat' || e.validatorKey === 'isNumeric') {
        return `${fieldName} harus berupa angka.`;
      }
      if (e.validatorKey === 'notEmpty' || e.validatorKey === 'notNull') {
        return `${fieldName} tidak boleh kosong.`;
      }
      return `${fieldName} tidak valid.`;
    }).join(' | ');
  }
  return error.message;
};

// ================================================
// GET SEMUA SISWA
// GET /api/v1/students
// ================================================
const getAllStudents = async (req, res) => {
  try {
    let data;

    if (isUsingDatabase()) {
      const Prediksi = require('../models/Prediksi');
      data = await Student.findAll({ 
        order: [['student_id', 'ASC']],
        include: [{ model: Prediksi, as: 'riwayatPrediksi' }]
      });
    } else {
      data = getInMemoryStudents();
    }

    res.json({ success: true, total: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================================
// GET SISWA BERDASARKAN ID
// GET /api/v1/students/:id
// ================================================
const getStudentById = async (req, res) => {
  try {
    let student;

    if (isUsingDatabase()) {
      student = await Student.findOne({
        where:   { student_id: req.params.id },
        include: [{ model: EarlyWarning, as: 'warnings' }]
      });
    } else {
      student = getInMemoryStudents()
        .find(s => s.student_id === parseInt(req.params.id));
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Siswa tidak ditemukan'
      });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================================
// POST TAMBAH SISWA BARU
// POST /api/v1/students
// ================================================
const createStudent = async (req, res) => {
  try {
    const payload = { ...req.body };
    const scores = ['math_score', 'indo_score', 'eng_score', 'bio_score', 'chem_score', 'phy_score'];
    let totalScore = 0;
    let count = 0;
    scores.forEach(key => {
      const val = parseFloat(payload[key]);
      if (!isNaN(val)) {
        totalScore += val;
        count++;
      }
    });
    if (count > 0 && (payload.exam_score === undefined || payload.exam_score === null || payload.exam_score === 0 || payload.exam_score === '')) {
      payload.exam_score = totalScore / count;
    }

    const { student_id, age, gender, academic_level, exam_score } = payload;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'student_id wajib diisi'
      });
    }

    let student;

    if (isUsingDatabase()) {
      student = await Student.create(payload);
    } else {
      const list = getInMemoryStudents();
      const exists = list.find(s => String(s.student_id) === String(student_id));
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'student_id sudah terdaftar'
        });
      }
      student = {
        id:     list.length + 1,
        status: 'aktif',
        ...payload
      };
      setInMemoryStudents([...list, student]);
    }

    res.status(201).json({
      success: true,
      message: 'Siswa berhasil ditambahkan',
      data:    student
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: formatSequelizeError(error) });
    }
    res.status(500).json({ success: false, message: `[${error.name}] ${error.message}` });
  }
};

// ================================================
// PUT UPDATE DATA SISWA
// PUT /api/v1/students/:id
// ================================================
const updateStudent = async (req, res) => {
  try {
    let student;

    if (isUsingDatabase()) {
      student = await Student.findOne({
        where: { student_id: req.params.id }
      });
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Siswa tidak ditemukan'
        });
      }
      const payload = { ...req.body };
      const scores = ['math_score', 'indo_score', 'eng_score', 'bio_score', 'chem_score', 'phy_score'];
      let totalScore = 0;
      let count = 0;
      scores.forEach(key => {
        const val = parseFloat(payload[key] !== undefined ? payload[key] : student[key]);
        if (!isNaN(val)) {
          totalScore += val;
          count++;
        }
      });
      if (count > 0 && (payload.exam_score === undefined || payload.exam_score === null || payload.exam_score === 0 || payload.exam_score === '')) {
        payload.exam_score = totalScore / count;
      }
      
      await student.update(payload);
    } else {
      const list  = getInMemoryStudents();
      const index = list.findIndex(
        s => String(s.student_id) === String(req.params.id)
      );
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Siswa tidak ditemukan'
        });
      }
      list[index] = { ...list[index], ...req.body };
      setInMemoryStudents(list);
      student = list[index];
    }

    res.json({
      success: true,
      message: 'Data siswa berhasil diupdate',
      data:    student
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: formatSequelizeError(error) });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================================
// DELETE HAPUS SISWA
// DELETE /api/v1/students/:id
// ================================================
const deleteStudent = async (req, res) => {
  try {
    if (isUsingDatabase()) {
      const student = await Student.findOne({
        where: { student_id: req.params.id }
      });
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Siswa tidak ditemukan'
        });
      }
      await student.destroy();
    } else {
      const list   = getInMemoryStudents();
      const exists = list.find(
        s => s.student_id === parseInt(req.params.id)
      );
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Siswa tidak ditemukan'
        });
      }
      setInMemoryStudents(
        list.filter(s => s.student_id !== parseInt(req.params.id))
      );
    }

    res.json({
      success: true,
      message: 'Data siswa berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
