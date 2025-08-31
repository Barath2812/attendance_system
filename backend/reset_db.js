const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDatabase() {
  let connection;
  
  try {
    // Connect to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL server...');

    // Drop the existing database
    await connection.execute('DROP DATABASE IF EXISTS attendance_system');
    console.log('Dropped existing database...');

    // Create a fresh database
    await connection.execute('CREATE DATABASE attendance_system');
    console.log('Created fresh database...');

    await connection.end();
    console.log('Database reset completed successfully!');
    console.log('Now run: node seed/seed.js');

  } catch (error) {
    console.error('Error resetting database:', error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

resetDatabase();
