/* eslint-disable no-console */
require('dotenv').config();
const { connectToDatabase, sequelize } = require('../src/config/db');
const { User, Class, Subject, Timetable, Department, SubjectOffering } = require('../src/models/index');

async function run() {
  await connectToDatabase();
  
  // Clear existing data
  await Promise.all([
    Timetable.destroy({ where: {} }),
    SubjectOffering.destroy({ where: {} }),
    User.destroy({ where: {} }),
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
  const admin = await User.create({ 
    name: 'System Administrator', 
    email: 'admin@example.com', 
    password: 'Password1!',
    role: 'admin'
  });

  // Create staff users
  const counsellor = await User.create({ 
    name: 'Counsellor', 
    email: 'counsellor@example.com', 
    password: 'Password1!', 
    role: 'counsellor',
    departmentId: department.id
  });
  
  const staff1 = await User.create({ 
    name: 'Alice Teacher', 
    email: 'alice@example.com', 
    password: 'Password1!', 
    role: 'staff',
    staffId: 'STAFF001',
    departmentId: department.id
  });
  
  const staff2 = await User.create({ 
    name: 'Bob Teacher', 
    email: 'bob@example.com', 
    password: 'Password1!', 
    role: 'staff',
    staffId: 'STAFF002',
    departmentId: department.id
  });

  // Create students
  const students = await Promise.all(
    Array.from({ length: 10 }).map((_, i) => 
      User.create({
        name: `Student ${i + 1}`,
        email: `student${i + 1}@example.com`,
        password: 'Password1!',
        role: 'student',
        staffId: `STU${String(i + 1).padStart(3, '0')}`,
        departmentId: department.id
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
    capacity: 50,
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

  // Create SubjectOffering records to link staff to classes and subjects
  await SubjectOffering.create({
    subjectId: sub1.id,
    classId: cls.id,
    staffId: staff1.id
  });

  await SubjectOffering.create({
    subjectId: sub2.id,
    classId: cls.id,
    staffId: staff2.id
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


