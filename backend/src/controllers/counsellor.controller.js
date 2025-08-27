const ClassModel = require('../models/Class.model');
const User = require('../models/User.model');
const SubjectOffering = require('../models/SubjectOffering.model');
const Subject = require('../models/Subject.model');
const Attendance = require('../models/Attendance.model');

exports.getClassOverview = async (req, res) => {
  const { id } = req.params; // classId
  const klass = await ClassModel.findById(id).lean();
  if (!klass) return res.status(404).json({ message: 'Class not found' });
  if (String(klass.counsellorId) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  const students = await User.find({ _id: { $in: klass.students } }).select('name email').lean();
  const offerings = await SubjectOffering.find({ classId: id }).lean();
  const subjectIds = [...new Set(offerings.map((o) => String(o.subjectId)))];
  const subjects = await Subject.find({ _id: { $in: subjectIds } }).lean();

  const byStudent = {};
  const attendance = await Attendance.find({ classId: id }).select('studentId status').lean();
  attendance.forEach((a) => {
    const key = String(a.studentId);
    byStudent[key] = byStudent[key] || { present: 0, total: 0 };
    byStudent[key].total += 1;
    if (a.status === 'Present') byStudent[key].present += 1;
  });

  res.json({ class: klass, students, subjects, statsByStudent: byStudent });
};


