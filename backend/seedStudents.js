require('dotenv').config();
const { sequelize } = require('./src/config/database');
const Student = require('./src/models/Student');
const Prediksi = require('./src/models/Prediksi');
const EarlyWarning = require('./src/models/EarlyWarning');
const { getInMemoryWarnings } = require('./src/config/dataStore');

async function seed() {
  try {
    await sequelize.sync({ alter: true });
    
    const count = await Student.count();
    if (count === 0) {
      console.log('Database kosong. Jalankan "node restoreDb.js" terlebih dahulu untuk mengisi data riil.');
      process.exit(0);
    }

    console.log(`Menemukan ${count} siswa di database. Melakukan pembaruan status...`);

    const students = await Student.findAll();

    for (let s of students) {
      // Pastikan exam_score valid
      const baseScore = s.exam_score < 40 ? 40 + s.exam_score : s.exam_score;
      
      let status = 'Siap';
      if (baseScore < 60) status = 'Berisiko';

      await s.update({
        exam_score: baseScore,
        status: status
      });
    }

    console.log(`Berhasil memperbarui status untuk ${count} siswa di database lokal.`);

    const inMemoryWarnings = getInMemoryWarnings();
    if (inMemoryWarnings && inMemoryWarnings.length > 0) {
      // Opsional: kita bisa menambahkan warning jika belum ada
      const wCount = await EarlyWarning.count();
      if (wCount === 0) {
        await EarlyWarning.bulkCreate(inMemoryWarnings);
        console.log(`Berhasil memasukkan ${inMemoryWarnings.length} data early warning ke database.`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Gagal melakukan pembaruan:', error);
    process.exit(1);
  }
}

seed();
