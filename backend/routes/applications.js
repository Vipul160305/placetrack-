const express = require('express');
const router = express.Router();
const {
    applyToCompany, getMyApplications,
    getCompanyApplications, getAllApplications, updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.post('/', protect, requireRole('student'), applyToCompany);
router.get('/me', protect, requireRole('student'), getMyApplications);
router.get('/', protect, requireRole('tpo', 'admin'), getAllApplications);
router.get('/company/:companyId', protect, requireRole('tpo', 'admin'), getCompanyApplications);
router.put('/:id/status', protect, requireRole('tpo', 'admin'), updateApplicationStatus);

module.exports = router;
