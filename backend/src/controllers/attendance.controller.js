const { validationResult } = require('express-validator');
const { Attendance, Timetable, Subject, Class, User, SubjectOffering } = require('../models/index');
const { Op } = require('sequelize');

exports.markAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { date, period, classId, subjectId, records } = req.body; // records: [{studentId, status}]

    // Ensure staff can only mark attendance for their assigned subjects
    const subjectOffering = await SubjectOffering.findOne({
      where: { classId, subjectId, staffId: req.user.id }
    });
    if (!subjectOffering) {
      return res.status(403).json({ message: 'Not authorized for this subject/class combination' });
    }

    // Disallow edits after 24 hours
    const now = Date.now();
    const cutoffMs = 24 * 60 * 60 * 1000;
    if (now - new Date(date).getTime() > cutoffMs) {
      return res.status(400).json({ message: 'Attendance can only be marked/edited within 24 hours' });
    }

    // Process attendance records
    for (const record of records) {
      await Attendance.upsert({
        date: new Date(date),
        period,
        classId,
        subjectId,
        staffId: req.user.id,
        studentId: record.studentId,
        status: record.status
      });
    }
    
    res.json({ message: 'Attendance marked' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
};

exports.getSubjectAttendance = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    // For staff, check if they're assigned to this subject through SubjectOffering
    if (req.user.role === 'staff') {
      const subjectOffering = await SubjectOffering.findOne({
        where: { subjectId, staffId: req.user.id }
      });
      if (!subjectOffering) {
        return res.status(403).json({ message: 'Not authorized to view this subject' });
      }
    }
    
    const records = await Attendance.findAll({ 
      where: { subjectId },
      include: [
        { model: User, as: 'student', attributes: ['id', 'name'] },
        { model: User, as: 'staff', attributes: ['id', 'name'] }
      ]
    });
    res.json(records);
  } catch (error) {
    console.error('Error getting subject attendance:', error);
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message });
  }
};

exports.getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const cls = await Class.findByPk(classId);
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    const records = await Attendance.findAll({ 
      where: { classId },
      include: [
        { model: User, as: 'student', attributes: ['id', 'name'] },
        { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] }
      ]
    });
    res.json(records);
  } catch (error) {
    console.error('Error getting class attendance:', error);
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await Attendance.findAll({ 
      where: { studentId },
      include: [{ model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] }]
    });
    res.json(records);
  } catch (error) {
    console.error('Error getting student attendance:', error);
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message });
  }
};


