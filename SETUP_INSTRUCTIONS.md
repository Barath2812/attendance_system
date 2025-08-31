# Attendance System Setup Guide

## 🚨 Issues Fixed

This guide addresses the following problems:
- **Login errors** - Improved error handling and validation
- **Page refreshes** - Prevented form submissions from refreshing the page
- **CORS issues** - Better backend CORS configuration
- **Database connection** - Improved error handling and setup

## 🛠️ Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Run the setup script to create .env file
npm run setup

# Edit .env file with your database credentials
# Example:
DB_HOST=localhost
DB_PORT=3306
DB_NAME=attendance_system
DB_USER=root
DB_PASSWORD=your_password_here
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Database Setup
```bash
# Make sure MySQL is running
# Create database if it doesn't exist
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS attendance_system;"

# Run database setup
npm run setup:db

# Seed with sample data
npm run seed
```

### 4. Start Backend Server
```bash
npm run dev
```

The server should start on `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend should start on `http://localhost:5173`

## 🔧 Troubleshooting

### Login Issues
- Check that backend is running on port 5000
- Verify database connection in backend console
- Check browser console for error messages
- Ensure demo credentials are correct

### Page Refresh Issues
- Forms now use `e.preventDefault()` to stop refreshes
- All buttons have proper `type` attributes
- Navigation uses React Router instead of page reloads

### Database Connection Issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u root -p

# Reset database if needed
npm run reset:db
npm run setup:db
npm run seed
```

### CORS Issues
- Backend now has specific CORS configuration
- Only allows localhost:3000 and localhost:5173
- Check that frontend URL matches CORS settings

## 📱 Demo Credentials

Use these credentials to test the system:

- **Admin**: admin@college.com / password
- **Staff**: john.doe@college.com / password  
- **Student**: alice.johnson@college.com / password

## 🚀 Production Notes

- Change JWT_SECRET in production
- Update CORS origins for production domain
- Set NODE_ENV=production
- Use environment variables for all sensitive data

## 📞 Support

If you still encounter issues:
1. Check browser console for errors
2. Check backend console for errors
3. Verify database connection
4. Ensure all environment variables are set correctly
