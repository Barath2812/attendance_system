# MySQL Database Setup for Attendance System

## Prerequisites
- MySQL Server installed and running
- Node.js and npm installed

## Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE attendance_system;
   ```

2. **Create Environment File**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=attendance_system
   DB_USER=root
   DB_PASSWORD=your_mysql_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Database Migration**
   ```bash
   npm run dev
   ```
   This will automatically create all tables and establish relationships.

3. **Seed the Database (Optional)**
   ```bash
   npm run seed
   ```

## Database Schema

The system includes the following tables with proper relationships:

- **departments**: Stores department information
- **users**: Stores all users (admin, staff, counsellor, students)
- **classes**: Stores class information with department and counsellor relationships
- **subjects**: Stores subject information with department relationships
- **attendances**: Stores attendance records with relationships to class, subject, staff, and student
- **subject_offerings**: Stores which subjects are offered by which staff to which classes
- **timetables**: Stores timetable information with class, subject, and staff relationships

## Key Features

- **Foreign Key Constraints**: All relationships are properly enforced with foreign keys
- **Indexes**: Optimized queries with appropriate indexes
- **Data Validation**: Sequelize validation rules ensure data integrity
- **Password Hashing**: Automatic password hashing using bcrypt
- **Timestamps**: Automatic created_at and updated_at timestamps

## Migration from MongoDB

This system has been migrated from MongoDB to MySQL with the following changes:

1. **ORM Change**: From Mongoose to Sequelize
2. **Data Types**: From MongoDB ObjectId to MySQL INTEGER primary keys
3. **Relationships**: From MongoDB references to MySQL foreign keys
4. **Queries**: Updated to use Sequelize query syntax
5. **Indexes**: Converted to MySQL index syntax

## Troubleshooting

- Ensure MySQL server is running
- Check database credentials in `.env` file
- Verify database exists before running the application
- Check MySQL user permissions for the database
