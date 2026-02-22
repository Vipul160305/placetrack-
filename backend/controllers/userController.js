const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
const updateMe = async (req, res) => {
    try {
        const { name, branch, cgpa, skills } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (branch) user.branch = branch;
        if (cgpa !== undefined) user.cgpa = cgpa;
        if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());

        const updated = await user.save();
        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            branch: updated.branch,
            cgpa: updated.cgpa,
            skills: updated.skills,
            isPlaced: updated.isPlaced,
            resume: updated.resume,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload resume
// @route   POST /api/users/me/resume
// @access  Private (student)
const uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const user = await User.findById(req.user._id);
        user.resume = req.file.filename;
        await user.save();

        res.json({ message: 'Resume uploaded successfully', resume: req.file.filename });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const { role, search } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (search) filter.name = { $regex: search, $options: 'i' };

        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin/TPO
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMe, updateMe, uploadResume, getAllUsers, deleteUser, getUserById };
