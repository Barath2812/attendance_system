const { sequelize } = require('./src/config/db');
require('dotenv').config();

async function forceSyncDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('MySQL database connected successfully.');
    
    // Import models to establish relationships
    require('./src/models/index');
    
    console.log('Models loaded. Force syncing database...');
    // Force sync will drop all tables and recreate them
    await sequelize.sync({ force: true });
    console.log('Database force synchronized successfully!');
    console.log('All tables have been recreated with correct structure.');
    
    await sequelize.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('Error force syncing database:', error);
    if (sequelize) {
      await sequelize.close();
    }
    process.exit(1);
  }
}

forceSyncDatabase();
