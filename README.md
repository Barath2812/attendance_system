# Campus Attendance System

A comprehensive attendance management system for educational institutions with Excel data import functionality and role-based access control.

## Features

### 🔐 Authentication & Authorization
- **Role-based access control**: Admin, Staff, Counsellor, and Student roles
- **Secure login**: Staff and students can login with credentials from Excel uploads
- **No registration required**: Users are created automatically from Excel data

### 📊 Excel Data Import
- **Bulk data upload**: Import classes, students, staff, subjects, and timetables
- **Automatic password generation**: Passwords are hashed and stored securely
- **Template-based**: Use provided Excel templates for consistent data format
- **Individual sheet upload**: Upload specific data types separately

### 👥 User Management
- **Staff**: Mark attendance, view subject history
- **Students**: View personal attendance records
- **Counsellors**: Monitor class attendance, manage data
- **Admins**: Upload Excel data, manage system

### 📈 Attendance Tracking
- **Real-time marking**: Staff can mark attendance during class
- **24-hour edit window**: Attendance can be modified within 24 hours
- **Visual dashboards**: Role-specific dashboards with attendance insights
- **Export capabilities**: Generate reports in Excel format

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance_system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Database Setup**
   - Create a MySQL database
   - Update database configuration in `backend/src/config/db.js`
   - Run the setup script: `mysql -u root -p < setup_database.sql`

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

5. **Start the Application**
   ```bash
   # Backend (from backend directory)
   npm start
   
   # Frontend (from frontend directory)
   npm run dev
   ```

## Excel Import Process

### 1. Download Templates
- Navigate to the admin uploads page
- Download the Excel templates for each data type:
  - `Classes.xlsx` - Class information
  - `Students.xlsx` - Student data with passwords
  - `Staff.xlsx` - Staff data with passwords
  - `Subjects.xlsx` - Subject information
  - `Timetable.xlsx` - Class schedules
  - `admin-master-template.xlsx` - Complete template with all sheets

### 2. Prepare Data
Fill in the Excel templates with your data:

**Students Template:**
| RegNo | Name | Email | Class | Password |
|-------|------|-------|-------|----------|
| 22IT001 | Alice | alice@example.com | IT-2-4-A | StudentPass123! |

**Staff Template:**
| StaffId | Name | Email | DepartmentCode | Role | Password |
|---------|------|-------|----------------|------|----------|
| STF001 | Staff One | staff1@example.com | IT | staff | StaffPass123! |

### 3. Upload Data
- Use the admin uploads page to import your Excel files
- Choose between individual sheet upload or complete master template
- The system will automatically create user accounts with hashed passwords

### 4. Login Access
- Staff and students can immediately login using their email and password from the Excel
- No registration process required
- Passwords are securely hashed using bcrypt

## User Roles & Access

### 👨‍💼 Staff
- **Login**: Use email and password from Excel upload
- **Features**: 
  - Mark attendance for assigned subjects
  - View attendance history
  - Access to class-specific data

### 👨‍🎓 Students
- **Login**: Use email and password from Excel upload
- **Features**:
  - View personal attendance records
  - Access to class information
  - No registration required

### 👨‍🏫 Counsellors
- **Login**: Use email and password from Excel upload
- **Features**:
  - Monitor class attendance
  - Access to comprehensive reports
  - Data management capabilities

### 👨‍💻 Admins
- **Login**: Use admin credentials
- **Features**:
  - Upload Excel data
  - Manage system configuration
  - Access to all system features

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)

### Data Import
- `POST /api/import/excel` - Import complete Excel file
- `POST /api/import/:sheet` - Import specific sheet (Classes, Students, Staff, etc.)

### Attendance
- `POST /api/attendance/mark` - Mark attendance (staff only)
- `GET /api/attendance/student/:id` - Get student attendance
- `GET /api/attendance/subject/:id` - Get subject attendance
- `GET /api/attendance/class/:id` - Get class attendance

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Strict role-based route protection
- **Input Validation**: Comprehensive validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## File Structure

```
attendance_system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication middleware
│   │   └── config/          # Database configuration
│   └── server.js           # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── views/           # Page components
│   │   ├── routes/          # Frontend routing
│   │   └── context/         # React context
│   └── public/templates/    # Excel templates
```

## Troubleshooting

### Common Issues

1. **Import Fails**
   - Ensure Excel format matches templates exactly
   - Check that all required fields are filled
   - Verify database connection

2. **Login Issues**
   - Confirm email exists in uploaded data
   - Check password matches Excel file
   - Ensure user role is correctly assigned

3. **Database Connection**
   - Verify MySQL service is running
   - Check database credentials in config
   - Ensure database exists and tables are created

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
