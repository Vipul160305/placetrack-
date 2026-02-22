const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Get companies (students see eligible ones, TPO/admin see all)
// @route   GET /api/companies
// @access  Private
const getCompanies = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === 'student') {
            filter = {
                minCGPA: { $lte: req.user.cgpa },
                eligibleBranches: req.user.branch,
            };
        }

        const companies = await Company.find(filter)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create company
// @route   POST /api/companies
// @access  Private/TPO
const createCompany = async (req, res) => {
    try {
        const {
            companyName, role, package: pkg, description, location,
            minCGPA, eligibleBranches, requiredSkills, rounds, applicationDeadline,
        } = req.body;

        if (!companyName || !role || !pkg || !minCGPA) {
            return res.status(400).json({ message: 'Company name, role, package, and minCGPA are required' });
        }

        const company = await Company.create({
            companyName,
            role,
            package: pkg,
            description,
            location,
            minCGPA,
            eligibleBranches: Array.isArray(eligibleBranches) ? eligibleBranches : [],
            requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
            rounds: Array.isArray(rounds) ? rounds : [],
            applicationDeadline,
            createdBy: req.user._id,
        });

        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).populate('createdBy', 'name email');
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/TPO
const updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const fields = ['companyName', 'role', 'package', 'description', 'location', 'minCGPA',
            'eligibleBranches', 'requiredSkills', 'rounds', 'applicationDeadline'];
        fields.forEach(f => { if (req.body[f] !== undefined) company[f] = req.body[f]; });

        const updated = await company.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/TPO/Admin
const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        await company.deleteOne();
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get eligible students for a company
// @route   GET /api/companies/:id/eligible-students
// @access  Private/TPO/Admin
const getEligibleStudents = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const students = await User.find({
            role: 'student',
            cgpa: { $gte: company.minCGPA },
            branch: { $in: company.eligibleBranches },
        }).select('-password');

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCompanies, createCompany, getCompanyById, updateCompany, deleteCompany, getEligibleStudents };
