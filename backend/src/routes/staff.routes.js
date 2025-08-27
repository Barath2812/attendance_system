const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const { getMyClasses, getClassSubjectsForStaff } = require('../controllers/staff.controller');

router.get('/classes', auth(true), requireRole(['staff','counsellor']), getMyClasses);
router.get('/class/:id/subjects', auth(true), requireRole(['staff','counsellor']), getClassSubjectsForStaff);

module.exports = router;


