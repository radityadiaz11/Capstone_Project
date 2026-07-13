require('dotenv').config();
const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');

async function checkUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    console.log(`Found ${users.length} users.`);
    users.forEach(u => console.log(u.email));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
