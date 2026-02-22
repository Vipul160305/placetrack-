const express = require('express');
const router = express.Router();
const {
    getMe, updateMe, uploadResume, getAllUsers, deleteUser, getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const upload = require('../middleware/upload');

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.post('/me/resume', protect, requireRole('student'), upload.single('resume'), uploadResume);
router.get('/', protect, requireRole('admin', 'tpo'), getAllUsers);
router.get('/:id', protect, requireRole('admin', 'tpo'), getUserById);
router.delete('/:id', protect, requireRole('admin'), deleteUser);

module.exports = router;
