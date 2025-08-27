/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const { connectToDatabase } = require('../src/config/db');
const User = require('../src/models/User.model');
const ClassModel = require('../src/models/Class.model');
const Subject = require('../src/models/Subject.model');
const Timetable = require('../src/models/Timetable.model');

async function run() {
  await connectToDatabase();
  await Promise.all([
    User.deleteMany({}),
    ClassModel.deleteMany({}),
    Subject.deleteMany({}),
    Timetable.deleteMany({}),
  ]);

  const counsellor = await User.create({ name: 'Counsellor', email: 'counsellor@example.com', password: 'Password1!', role: 'counsellor' });
  const staff1 = await User.create({ name: 'Alice Teacher', email: 'alice@example.com', password: 'Password1!', role: 'staff' });
  const staff2 = await User.create({ name: 'Bob Teacher', email: 'bob@example.com', password: 'Password1!', role: 'staff' });

  const students = await User.insertMany(
    Array.from({ length: 10 }).map((_, i) => ({
      name: `Student ${i + 1}`,
      email: `student${i + 1}@example.com`,
      password: 'Password1!',
      role: 'student',
    }))
  );

  const cls = await ClassModel.create({ name: 'CSE-A', students: students.map((s) => s._id), counsellorId: counsellor._id });

  await User.updateMany({ role: 'student' }, { $set: { classId: cls._id } });

  const sub1 = await Subject.create({ name: 'Maths', code: 'MTH101', staffId: staff1._id, classId: cls._id });
  const sub2 = await Subject.create({ name: 'Physics', code: 'PHY101', staffId: staff2._id, classId: cls._id });

  await User.findByIdAndUpdate(staff1._id, { $set: { assignedSubjects: [sub1._id] } });
  await User.findByIdAndUpdate(staff2._id, { $set: { assignedSubjects: [sub2._id] } });

  // Timetable Mon-Fri with 5 periods default
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const periods = [
    { periodNo: 1, subjectId: sub1._id, staffId: staff1._id },
    { periodNo: 2, subjectId: sub2._id, staffId: staff2._id },
    { periodNo: 3, subjectId: sub1._id, staffId: staff1._id },
    { periodNo: 4, subjectId: sub2._id, staffId: staff2._id },
    { periodNo: 5, subjectId: sub1._id, staffId: staff1._id },
  ];

  await Timetable.insertMany(days.map((d) => ({ classId: cls._id, day: d, periods })));

  console.log('Seed completed. Logins:');
  console.log('Counsellor: counsellor@example.com / Password1!');
  console.log('Staff1: alice@example.com / Password1!');
  console.log('Staff2: bob@example.com / Password1!');
  console.log('Students: student1@example.com..student10@example.com / Password1!');

  await mongoose.connection.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


