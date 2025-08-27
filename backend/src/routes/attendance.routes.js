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
    body('classId').isMongoId(),
    body('subjectId').isMongoId(),
    body('records').isArray({ min: 1 }),
  ],
  markAttendance
);

router.get('/subject/:subjectId', auth(true), requireRole(['staff', 'counsellor']), [param('subjectId').isMongoId()], getSubjectAttendance);
router.get('/class/:classId', auth(true), requireRole(['counsellor']), [param('classId').isMongoId()], getClassAttendance);
router.get('/student/:studentId', auth(true), requireRole(['counsellor', 'staff', 'student']), [param('studentId').isMongoId()], getStudentAttendance);

module.exports = router;


