const Application = require('../models/Application');
const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Apply to a company
// @route   POST /api/applications
// @access  Private/Student
const applyToCompany = async (req, res) => {
    try {
        const { companyId } = req.body;
        if (!companyId) return res.status(400).json({ message: 'Company ID is required' });

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const student = req.user;

        // Eligibility check
        if (student.cgpa < company.minCGPA) {
            return res.status(403).json({ message: 'You do not meet the minimum CGPA requirement' });
        }
        if (!company.eligibleBranches.includes(student.branch)) {
            return res.status(403).json({ message: 'Your branch is not eligible for this company' });
        }

        // Duplicate check
        const existing = await Application.findOne({ studentId: student._id, companyId });
        if (existing) {
            return res.status(400).json({ message: 'You have already applied to this company' });
        }

        const application = await Application.create({
            studentId: student._id,
            companyId,
            status: 'Applied',
            currentRound: 0,
        });

        const populated = await application.populate([
            { path: 'companyId', select: 'companyName role package' },
            { path: 'studentId', select: 'name email branch cgpa' },
        ]);

        res.status(201).json(populated);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already applied to this company' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my applications (student)
// @route   GET /api/applications/me
// @access  Private/Student
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ studentId: req.user._id })
            .populate('companyId', 'companyName role package location rounds')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a company (TPO)
// @route   GET /api/applications/company/:companyId
// @access  Private/TPO/Admin
const getCompanyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ companyId: req.params.companyId })
            .populate('studentId', 'name email branch cgpa skills isPlaced')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications (TPO/Admin)
// @route   GET /api/applications
// @access  Private/TPO/Admin
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({})
            .populate('studentId', 'name email branch cgpa')
            .populate('companyId', 'companyName role package')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status / round (TPO)
// @route   PUT /api/applications/:id/status
// @access  Private/TPO/Admin
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, currentRound, remarks } = req.body;
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (status) application.status = status;
        if (currentRound !== undefined) application.currentRound = currentRound;
        if (remarks !== undefined) application.remarks = remarks;

        // If selected, mark student as placed
        if (status === 'Selected') {
            await User.findByIdAndUpdate(application.studentId, { isPlaced: true });
        }
        // If rejected after being placed, unmark (edge case safety)
        if (status === 'Rejected') {
            const otherSelected = await Application.findOne({
                studentId: application.studentId,
                status: 'Selected',
                _id: { $ne: application._id },
            });
            if (!otherSelected) {
                await User.findByIdAndUpdate(application.studentId, { isPlaced: false });
            }
        }

        await application.save();
        const updated = await application.populate([
            { path: 'studentId', select: 'name email branch cgpa' },
            { path: 'companyId', select: 'companyName role' },
        ]);

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyToCompany,
    getMyApplications,
    getCompanyApplications,
    getAllApplications,
    updateApplicationStatus,
};
