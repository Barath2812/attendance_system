-- Reset Database Script
-- This will completely remove the old database and create a fresh one

-- Drop the existing database (this will remove all tables and data)
DROP DATABASE IF EXISTS attendance_system;

-- Create a fresh database
CREATE DATABASE attendance_system;

-- Use the new database
USE attendance_system;

-- Show confirmation
SELECT 'Database attendance_system has been reset successfully!' AS message;
SELECT 'All old tables and constraints have been removed.' AS note;
SELECT 'Run the seed script to populate with new data.' AS next_step;
