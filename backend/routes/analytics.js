const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', protect, requireRole('tpo', 'admin'), getAnalytics);

module.exports = router;
