const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Job role is required'],
            trim: true,
        },
        package: {
            type: Number,
            required: [true, 'Package (LPA) is required'],
            min: 0,
        },
        description: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        minCGPA: {
            type: Number,
            required: [true, 'Minimum CGPA is required'],
            min: 0,
            max: 10,
        },
        eligibleBranches: [{ type: String }],
        requiredSkills: [{ type: String }],
        rounds: [
            {
                name: { type: String },
                type: {
                    type: String,
                    enum: ['Aptitude', 'Technical', 'HR', 'Group Discussion', 'Coding'],
                },
            },
        ],
        applicationDeadline: {
            type: Date,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
