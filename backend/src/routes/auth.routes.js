const router = require('express').Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/auth.controller');

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['admin', 'staff', 'counsellor', 'student']),
  ],
  register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], login);

module.exports = router;


