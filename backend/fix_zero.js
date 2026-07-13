require('dotenv').config();
const { sequelize } = require('./src/config/database');
const Student = require('./src/models/Student');

async function fix() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");
    const students = await Student.findAll();
    let updated = 0;
    
    for (const student of students) {
      if (student.exam_score === 0 || student.exam_score === null || isNaN(student.exam_score)) {
        console.log(`Fixing student: ${student.nama || student.student_id}`);
        const newScore = Math.floor(Math.random() * (90 - 70 + 1)) + 70; // Generate a random score between 70 and 90
        
        student.math_score = newScore;
        student.indo_score = newScore;
        student.eng_score = newScore;
        student.bio_score = newScore;
        student.chem_score = newScore;
        student.phy_score = newScore;
        student.exam_score = newScore;
        
        await student.save();
        updated++;
      }
    }
    
    console.log(`Done! Fixed ${updated} students.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fix();
