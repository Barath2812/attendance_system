const router = require('express').Router();
const { param } = require('express-validator');
const { auth, requireRole } = require('../middleware/auth');
const { listMySubjects, listByClass, getSubjectById } = require('../controllers/subject.controller');

router.get('/mine', auth(true), requireRole(['staff', 'counsellor']), listMySubjects);
router.get('/class/:classId', auth(true), requireRole(['counsellor', 'staff']), [param('classId').isInt()], listByClass);
router.get('/:id', auth(true), requireRole(['staff', 'counsellor']), [param('id').isInt()], getSubjectById);

module.exports = router;


