const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'attendance_system',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('MySQL database connected successfully.');
    
    // Import models to establish relationships
    require('../models/index');
    
    // Sync all models with database - use force: false to avoid key limit issues
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

module.exports = { sequelize, connectToDatabase };


