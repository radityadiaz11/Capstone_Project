require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function fixSequence() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");

    // Query to find the max ID and reset the sequence
    const [results] = await sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('students', 'id'), 
        COALESCE(MAX(id), 1)
      ) FROM students;
    `);
    
    console.log("Sequence successfully reset to match max ID:", results);
  } catch (err) {
    console.error("Error fixing sequence:", err);
  } finally {
    await sequelize.close();
  }
}

fixSequence();
