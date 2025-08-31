const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const { getMyClasses, getClassSubjectsForStaff, getMySchedule } = require('../controllers/staff.controller');

router.get('/classes', auth(true), requireRole(['staff','counsellor']), getMyClasses);
router.get('/class/:id/subjects', auth(true), requireRole(['staff','counsellor']), getClassSubjectsForStaff);
router.get('/schedule', auth(true), requireRole(['staff','counsellor']), getMySchedule);

module.exports = router;


