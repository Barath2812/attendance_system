const { validationResult } = require('express-validator');
const Attendance = require('../models/Attendance.model');
const Timetable = require('../models/Timetable.model');
const Subject = require('../models/Subject.model');
const ClassModel = require('../models/Class.model');

exports.markAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { date, period, classId, subjectId, records } = req.body; // records: [{studentId, status}]

  // Ensure staff can only mark their assigned period/subject
  const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }); // e.g., Mon
  const mapDay = { Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat', Sun: 'Sun' };
  const shortDay = mapDay[day] || 'Mon';
  const timetable = await Timetable.findOne({ classId, day: shortDay });
  if (!timetable) return res.status(400).json({ message: 'No timetable for selected day' });
  const slot = timetable.periods.find((p) => p.periodNo === period);
  if (!slot) return res.status(400).json({ message: 'Invalid period' });
  if (String(slot.staffId) !== String(req.user._id) || String(slot.subjectId) !== String(subjectId)) {
    return res.status(403).json({ message: 'Not authorized for this period/subject' });
  }

  // Disallow edits after 24 hours
  const now = Date.now();
  const cutoffMs = 24 * 60 * 60 * 1000;
  if (now - new Date(date).getTime() > cutoffMs) {
    return res.status(400).json({ message: 'Attendance can only be marked/edited within 24 hours' });
  }

  const bulk = records.map((r) => ({
    updateOne: {
      filter: { date: new Date(date), period, classId, subjectId, staffId: req.user._id, studentId: r.studentId },
      update: { $set: { status: r.status } },
      upsert: true,
    },
  }));
  await Attendance.bulkWrite(bulk);
  res.json({ message: 'Attendance marked' });
};

exports.getSubjectAttendance = async (req, res) => {
  const { subjectId } = req.params;
  // Ensure staff can only view their own subject
  const subject = await Subject.findById(subjectId);
  if (!subject) return res.status(404).json({ message: 'Subject not found' });
  if (req.user.role === 'staff' && String(subject.staffId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const records = await Attendance.find({ subjectId }).populate('studentId', 'name');
  res.json(records);
};

exports.getClassAttendance = async (req, res) => {
  const { classId } = req.params;
  const cls = await ClassModel.findById(classId);
  if (!cls) return res.status(404).json({ message: 'Class not found' });
  const records = await Attendance.find({ classId }).populate('studentId', 'name').populate('subjectId', 'name code');
  res.json(records);
};

exports.getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;
  const records = await Attendance.find({ studentId }).populate('subjectId', 'name code');
  res.json(records);
};


