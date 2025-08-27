const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const { getClassOverview } = require('../controllers/counsellor.controller');

router.get('/class/:id/overview', auth(true), requireRole(['counsellor']), getClassOverview);

module.exports = router;


