const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        status: {
            type: String,
            enum: ['Applied', 'Aptitude', 'Technical', 'HR', 'Selected', 'Rejected'],
            default: 'Applied',
        },
        currentRound: {
            type: String,
            default: '',
        },
        remarks: {
            type: String,
            default: '',
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ studentId: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
