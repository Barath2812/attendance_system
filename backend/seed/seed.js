/* eslint-disable no-console */
require('dotenv').config();
const { connectToDatabase, sequelize } = require('../src/config/db');
const { Admin, Staff, Student, Class, Subject, Timetable, Department } = require('../src/models/index');

async function run() {
  await connectToDatabase();
  
  // Clear existing data
  await Promise.all([
    Timetable.destroy({ where: {} }),
    Admin.destroy({ where: {} }),
    Staff.destroy({ where: {} }),
    Student.destroy({ where: {} }),
    Class.destroy({ where: {} }),
    Subject.destroy({ where: {} }),
    Department.destroy({ where: {} }),
  ]);

  // Create department
  const department = await Department.create({ 
    code: 'CSE', 
    name: 'Computer Science Engineering' 
  });

  // Create admin user
  const admin = await Admin.create({ 
    name: 'System Administrator', 
    email: 'admin@example.com', 
    password: 'Password1!',
    permissions: 'all'
  });

  // Create staff users
  const counsellor = await Staff.create({ 
    name: 'Counsellor', 
    email: 'counsellor@example.com', 
    password: 'Password1!', 
    designation: 'Counsellor',
    departmentId: department.id
  });
  
  const staff1 = await Staff.create({ 
    name: 'Alice Teacher', 
    email: 'alice@example.com', 
    password: 'Password1!', 
    designation: 'Assistant Professor',
    departmentId: department.id
  });
  
  const staff2 = await Staff.create({ 
    name: 'Bob Teacher', 
    email: 'bob@example.com', 
    password: 'Password1!', 
    designation: 'Associate Professor',
    departmentId: department.id
  });

  // Create students
  const students = await Promise.all(
    Array.from({ length: 10 }).map((_, i) => 
      Student.create({
        name: `Student ${i + 1}`,
        email: `student${i + 1}@example.com`,
        password: 'Password1!',
        regNo: `CSE2024${String(i + 1).padStart(3, '0')}`,
        rollNo: i + 1
      })
    )
  );

  // Create class
  const cls = await Class.create({ 
    name: 'CSE-A', 
    departmentId: department.id,
    year: 2,
    semester: 3,
    section: 'A',
    counsellorId: counsellor.id
  });

  // Update students with class
  await Promise.all(
    students.map(student => 
      student.update({ classId: cls.id })
    )
  );

  // Create subjects
  const sub1 = await Subject.create({ 
    name: 'Mathematics', 
    code: 'MTH101',
    departmentId: department.id
  });
  
  const sub2 = await Subject.create({ 
    name: 'Physics', 
    code: 'PHY101',
    departmentId: department.id
  });

  // Create timetable entries
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timetableEntries = [];
  
  days.forEach(day => {
    timetableEntries.push(
      Timetable.create({
        classId: cls.id,
        day: day,
        periodNo: 1,
        subjectId: sub1.id,
        staffId: staff1.id
      }),
      Timetable.create({
        classId: cls.id,
        day: day,
        periodNo: 2,
        subjectId: sub2.id,
        staffId: staff2.id
      }),
      Timetable.create({
        classId: cls.id,
        day: day,
        periodNo: 3,
        subjectId: sub1.id,
        staffId: staff1.id
      }),
      Timetable.create({
        classId: cls.id,
        day: day,
        periodNo: 4,
        subjectId: sub2.id,
        staffId: staff2.id
      }),
      Timetable.create({
        classId: cls.id,
        day: day,
        periodNo: 5,
        subjectId: sub1.id,
        staffId: staff1.id
      })
    );
  });

  await Promise.all(timetableEntries);

  console.log('Seed completed. Logins:');
  console.log('Admin: admin@example.com / Password1!');
  console.log('Counsellor: counsellor@example.com / Password1!');
  console.log('Staff1: alice@example.com / Password1!');
  console.log('Staff2: bob@example.com / Password1!');
  console.log('Students: student1@example.com..student10@example.com / Password1!');

  await sequelize.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


