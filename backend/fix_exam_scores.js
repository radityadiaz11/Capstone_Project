require('dotenv').config();
const { sequelize } = require('./src/config/database');
const Student = require('./src/models/Student');

async function fixExamScores() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");
    const students = await Student.findAll();
    let updated = 0;
    
    for (const student of students) {
      const scores = [
        student.math_score,
        student.indo_score,
        student.eng_score,
        student.bio_score,
        student.chem_score,
        student.phy_score
      ];
      
      let total = 0;
      let count = 0;
      
      for (const score of scores) {
        if (score !== null && score !== undefined && !isNaN(score)) {
          total += parseFloat(score);
          count++;
        }
      }
      
      const calcScore = count > 0 ? total / count : 0;
      
      if (student.exam_score !== calcScore) {
        console.log(`Fixing student: ${student.nama || student.student_id}. Old exam_score: ${student.exam_score}, New: ${calcScore}`);
        student.exam_score = calcScore;
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

fixExamScores();
