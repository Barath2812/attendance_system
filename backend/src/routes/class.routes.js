const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const { listClasses, getClassStudents, getClassById } = require('../controllers/class.controller');

router.get('/', auth(true), requireRole(['counsellor', 'staff']), listClasses);
router.get('/:id', auth(true), requireRole(['counsellor', 'staff']), getClassById);
router.get('/:id/students', auth(true), requireRole(['counsellor', 'staff']), getClassStudents);

module.exports = router;


