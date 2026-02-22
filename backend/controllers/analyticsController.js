const User = require('../models/User');
const Company = require('../models/Company');
const Application = require('../models/Application');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private/TPO/Admin
const getAnalytics = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const placedStudents = await User.countDocuments({ role: 'student', isPlaced: true });
        const placementPercentage = totalStudents > 0
            ? ((placedStudents / totalStudents) * 100).toFixed(2)
            : 0;

        const companies = await Company.find({});
        const highestPackage = companies.length > 0
            ? Math.max(...companies.map(c => c.package))
            : 0;
        const averagePackage = companies.length > 0
            ? (companies.reduce((sum, c) => sum + c.package, 0) / companies.length).toFixed(2)
            : 0;

        // Branch-wise placement (use _id so frontend charts match)
        const branches = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'Other'];
        const branchWiseRaw = await Promise.all(
            branches.map(async (branch) => {
                const total = await User.countDocuments({ role: 'student', branch });
                const placed = await User.countDocuments({ role: 'student', branch, isPlaced: true });
                return { _id: branch, total, placed };
            })
        );
        const branchWise = branchWiseRaw.filter(b => b.total > 0);

        // Applications by status
        const applicationStats = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const totalCompanies = await Company.countDocuments({});
        const totalApplications = await Application.countDocuments({});

        // applicationsByStatus as object { Applied: 5, Selected: 3, ... }
        const applicationsByStatus = applicationStats.reduce((acc, s) => {
            acc[s._id] = s.count;
            return acc;
        }, {});

        res.json({
            totalStudents,
            placedStudents,
            unplacedStudents: totalStudents - placedStudents,
            placementPercentage: parseFloat(placementPercentage),
            highestPackage,
            averagePackage: parseFloat(averagePackage),
            totalCompanies,
            totalApplications,
            branchWise,
            applicationsByStatus,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics };
