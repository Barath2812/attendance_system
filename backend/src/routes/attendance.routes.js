const router = require('express').Router();
const { body, param } = require('express-validator');
const { auth, requireRole } = require('../middleware/auth');
const {
  markAttendance,
  getSubjectAttendance,
  getClassAttendance,
  getStudentAttendance,
} = require('../controllers/attendance.controller');

router.post(
  '/mark',
  auth(true),
  requireRole(['staff']),
  [
    body('date').notEmpty(),
    body('period').isInt({ min: 1 }),
    body('classId').isInt({ min: 1 }),
    body('subjectId').isInt({ min: 1 }),
    body('records').isArray({ min: 1 }),
  ],
  markAttendance
);

router.get('/subject/:subjectId', auth(true), requireRole(['staff', 'counsellor']), [param('subjectId').isInt()], getSubjectAttendance);
router.get('/class/:classId', auth(true), requireRole(['counsellor']), [param('classId').isInt()], getClassAttendance);
router.get('/student/:studentId', auth(true), requireRole(['counsellor', 'staff', 'student']), [param('studentId').isInt()], getStudentAttendance);

module.exports = router;


