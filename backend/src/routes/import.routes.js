const router = require('express').Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const { auth, requireRole } = require('../middleware/auth');
const { importExcel, importSheet, getDatabaseStatus } = require('../controllers/import.controller');

router.post('/excel', auth(true), requireRole(['admin','counsellor']), upload.single('file'), importExcel);
router.post('/sheet/:name', auth(true), requireRole(['admin','counsellor']), upload.single('file'), importSheet);
router.get('/status', auth(true), requireRole(['admin','counsellor']), getDatabaseStatus);

module.exports = router;


