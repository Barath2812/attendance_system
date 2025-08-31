const Department = require('./Department.model');
const User = require('./User.model');
const Class = require('./Class.model');
const Subject = require('./Subject.model');
const Attendance = require('./Attendance.model');
const SubjectOffering = require('./SubjectOffering.model');
const Timetable = require('./Timetable.model');

// Department relationships
Department.hasMany(User, { foreignKey: 'departmentId', as: 'users' });
Department.hasMany(Class, { foreignKey: 'departmentId', as: 'classes' });
Department.hasMany(Subject, { foreignKey: 'departmentId', as: 'subjects' });

// User relationships
User.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
User.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
User.hasMany(Attendance, { foreignKey: 'staffId', as: 'staffAttendances' });
User.hasMany(Attendance, { foreignKey: 'studentId', as: 'studentAttendances' });
User.hasMany(SubjectOffering, { foreignKey: 'staffId', as: 'subjectOfferings' });
User.hasMany(Timetable, { foreignKey: 'staffId', as: 'timetables' });
User.hasMany(Class, { foreignKey: 'counsellorId', as: 'counselledClasses' });

// Class relationships
Class.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Class.belongsTo(User, { foreignKey: 'counsellorId', as: 'counsellor' });
Class.hasMany(User, { foreignKey: 'classId', as: 'students' });
Class.hasMany(Attendance, { foreignKey: 'classId', as: 'attendances' });
Class.hasMany(SubjectOffering, { foreignKey: 'classId', as: 'subjectOfferings' });
Class.hasMany(Timetable, { foreignKey: 'classId', as: 'timetables' });

// Subject relationships
Subject.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Subject.hasMany(Attendance, { foreignKey: 'subjectId', as: 'attendances' });
Subject.hasMany(SubjectOffering, { foreignKey: 'subjectId', as: 'subjectOfferings' });
Subject.hasMany(Timetable, { foreignKey: 'subjectId', as: 'timetables' });

// Attendance relationships
Attendance.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Attendance.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Attendance.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });
Attendance.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// SubjectOffering relationships
SubjectOffering.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
SubjectOffering.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
SubjectOffering.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });

// Timetable relationships
Timetable.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
Timetable.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
Timetable.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });

module.exports = {
  Department,
  User,
  Class,
  Subject,
  Attendance,
  SubjectOffering,
  Timetable
};
