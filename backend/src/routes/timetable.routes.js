const router = require('express').Router();
const { body, param } = require('express-validator');
const { auth, requireRole } = require('../middleware/auth');
const { addTimetable, getClassTimetable } = require('../controllers/timetable.controller');

router.post(
  '/add',
  auth(true),
  requireRole(['counsellor']),
  [
    body('classId').isMongoId(),
    body('day').isIn(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
    body('periods').isArray({ min: 1 }),
  ],
  addTimetable
);

router.get('/class/:classId', auth(true), requireRole(['counsellor', 'staff', 'student']), [param('classId').isMongoId()], getClassTimetable);

module.exports = router;


