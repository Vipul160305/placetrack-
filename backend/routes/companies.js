const express = require('express');
const router = express.Router();
const {
    getCompanies, createCompany, getCompanyById,
    updateCompany, deleteCompany, getEligibleStudents,
} = require('../controllers/companyController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.get('/', protect, getCompanies);
router.post('/', protect, requireRole('tpo', 'admin'), createCompany);
router.get('/:id', protect, getCompanyById);
router.put('/:id', protect, requireRole('tpo', 'admin'), updateCompany);
router.delete('/:id', protect, requireRole('tpo', 'admin'), deleteCompany);
router.get('/:id/eligible-students', protect, requireRole('tpo', 'admin'), getEligibleStudents);

module.exports = router;
