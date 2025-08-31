# Fix Staff Dashboard - Classes Not Showing

## 🚨 Problem
The staff dashboard is not showing scheduled classes because:
1. Missing `SubjectOffering` records that link staff to classes
2. Seed file was using non-existent models (`Admin`, `Staff`, `Student`)
3. Database relationships not properly set up

## ✅ Solution

### 1. Reset and Reseed Database
```bash
cd backend

# Clear existing data and recreate
npm run reset:db

# Or manually run the updated seed file
node seed/seed.js
```

### 2. Verify Database Structure
The system now uses a single `User` model with different roles:
- `admin` - System administrators
- `staff` - Teachers/professors  
- `counsellor` - Class counsellors
- `student` - Students

### 3. Check SubjectOffering Records
After seeding, you should have:
- Staff users (Alice Teacher, Bob Teacher)
- Classes (CSE-A)
- Subjects (Mathematics, Physics)
- SubjectOfferings linking staff to classes and subjects

### 4. Test Staff Login
Use these credentials:
- **Alice Teacher**: alice@example.com / Password1!
- **Bob Teacher**: bob@example.com / Password1!

### 5. Verify API Endpoints
The staff dashboard calls:
- `GET /api/staff/classes` - Should return classes where staff teaches
- `GET /api/staff/class/:id/subjects` - Should return subjects for a class

## 🔧 Debugging

### Check Backend Console
Look for these log messages:
```
🔍 Fetching classes for staff ID: [ID]
📚 Found SubjectOfferings: [COUNT]
✅ Returning classes: [COUNT]
```

### Check Database
```sql
-- Verify SubjectOfferings exist
SELECT * FROM subject_offerings;

-- Check staff users
SELECT * FROM users WHERE role = 'staff';

-- Check classes
SELECT * FROM classes;
```

### Check Frontend Console
Look for:
- API call to `/staff/classes`
- Response data structure
- Any error messages

## 🚀 Expected Result
After fixing:
1. Staff login should work
2. Dashboard should show assigned classes
3. Each class should show assigned subjects
4. Staff can mark attendance for their classes

## 📝 Notes
- The system now uses `SubjectOffering` to link staff to classes
- Each staff member can teach multiple subjects in multiple classes
- The dashboard shows unique classes (no duplicates)
- Subjects are fetched per class basis

## 🆘 Still Not Working?
1. Check backend console for errors
2. Verify database has data after seeding
3. Check if staff user ID matches SubjectOffering records
4. Ensure CORS is properly configured
5. Check if frontend is calling correct API endpoints
