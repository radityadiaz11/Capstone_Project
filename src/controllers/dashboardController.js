const Student      = require('../models/Student');
const EarlyWarning = require('../models/EarlyWarning');
const { sequelize } = require('../config/database');
const {
  isUsingDatabase,
  getInMemoryStudents,
  getInMemoryWarnings
} = require('../config/dataStore');

// ================================================
// GET DATA RINGKASAN DASHBOARD
// GET /api/v1/dashboard
// ================================================
const getDashboard = async (req, res) => {
  try {
    let totalSiswa, avgScore, maxScore, minScore;
    let risikoTinggi = 0, risikoSedang = 0, risikoRendah = 0;
    let warningBelumDibaca = 0;

    if (isUsingDatabase()) {
      // Ambil dari database
      totalSiswa = await Student.count();

      const stats = await Student.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('exam_score')), 'avg'],
          [sequelize.fn('MAX', sequelize.col('exam_score')), 'max'],
          [sequelize.fn('MIN', sequelize.col('exam_score')), 'min'],
        ],
        raw: true
      });

      avgScore = parseFloat(stats.avg || 0).toFixed(2);
      maxScore = parseFloat(stats.max || 0).toFixed(2);
      minScore = parseFloat(stats.min || 0).toFixed(2);

      const semuaSiswa = await Student.findAll({ raw: true });
      semuaSiswa.forEach(s => {
        if (s.exam_score < 10)      risikoTinggi++;
        else if (s.exam_score < 20) risikoSedang++;
        else                        risikoRendah++;
      });

      warningBelumDibaca = await EarlyWarning.count({
        where: { is_read: false }
      });

    } else {
      // Ambil dari memori
      const list = getInMemoryStudents();
      totalSiswa = list.length;

      const scores = list.map(s => s.exam_score);
      avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
      maxScore = Math.max(...scores).toFixed(2);
      minScore = Math.min(...scores).toFixed(2);

      list.forEach(s => {
        if (s.exam_score < 10)      risikoTinggi++;
        else if (s.exam_score < 20) risikoSedang++;
        else                        risikoRendah++;
      });

      warningBelumDibaca = getInMemoryWarnings()
        .filter(w => !w.is_read).length;
    }

    res.json({
      success: true,
      data: {
        totalSiswa,
        examScore: {
          rataRata:  avgScore,
          tertinggi: maxScore,
          terendah:  minScore
        },
        distribusiRisiko: {
          tinggi: risikoTinggi,
          sedang: risikoSedang,
          rendah: risikoRendah
        },
        warningBelumDibaca
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard };
