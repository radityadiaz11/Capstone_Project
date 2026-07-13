require('dotenv').config();
const { sequelize } = require('./src/config/database');
const Prediksi = require('./src/models/Prediksi');

async function fixPredictions() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");
    
    const deletedCount = await Prediksi.destroy({
      where: {
        prediksi_nilai: 0
      }
    });
    
    console.log(`Deleted ${deletedCount} bad predictions.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixPredictions();
