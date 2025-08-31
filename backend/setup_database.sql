-- MySQL Database Setup for Attendance System
-- Run this script in your MySQL client to create the database

-- Create the database
CREATE DATABASE IF NOT EXISTS attendance_system;

-- Use the database
USE attendance_system;

-- Show confirmation
SELECT 'Database attendance_system created successfully!' AS message;

-- Note: The tables will be created automatically when you run the Node.js application
-- due to Sequelize's auto-sync feature. No need to create tables manually.
