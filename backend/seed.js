require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const Application = require('./models/Application');
const connectDB = require('./config/db');

const seed = async () => {
    await connectDB();

    // Drop collections to clear indexes + data cleanly on Atlas
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        try { await collections[key].drop(); } catch (e) { /* ignore if not exist */ }
    }
    console.log('🗑️  Cleared existing data');

    // Create admin
    const admin = await User.create({
        name: 'Admin User',
        email: 'admin@demo.com',
        password: 'demo123',
        role: 'admin',
        branch: 'CSE',
        cgpa: 10,
    });

    // Create TPO
    const tpo = await User.create({
        name: 'Dr. Rajesh Kumar',
        email: 'tpo@demo.com',
        password: 'demo123',
        role: 'tpo',
        branch: 'CSE',
        cgpa: 10,
    });

    // Demo student
    const demoStudent = await User.create({
        name: 'Demo Student',
        email: 'student@demo.com',
        password: 'demo123',
        role: 'student',
        branch: 'CSE',
        cgpa: 8.2,
        skills: ['JavaScript', 'React', 'Node.js'],
        isPlaced: false,
    });

    // Other students
    const students = await User.create([
        {
            name: 'Alice Johnson',
            email: 'alice@student.com',
            password: 'Student@123',
            role: 'student',
            branch: 'CSE',
            cgpa: 8.5,
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            isPlaced: false,
        },
        {
            name: 'Bob Smith',
            email: 'bob@student.com',
            password: 'Student@123',
            role: 'student',
            branch: 'ECE',
            cgpa: 7.8,
            skills: ['Python', 'Machine Learning', 'Arduino'],
            isPlaced: false,
        },
        {
            name: 'Charlie Brown',
            email: 'charlie@student.com',
            password: 'Student@123',
            role: 'student',
            branch: 'CSE',
            cgpa: 9.1,
            skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
            isPlaced: true,
        },
        {
            name: 'Diana Prince',
            email: 'diana@student.com',
            password: 'Student@123',
            role: 'student',
            branch: 'IT',
            cgpa: 7.2,
            skills: ['HTML', 'CSS', 'Angular', 'TypeScript'],
            isPlaced: false,
        },
        {
            name: 'Ethan Hunt',
            email: 'ethan@student.com',
            password: 'Student@123',
            role: 'student',
            branch: 'ME',
            cgpa: 6.9,
            skills: ['AutoCAD', 'SolidWorks', 'MATLAB'],
            isPlaced: false,
        },
        {
            name: 'Priya Sharma',
            email: 'priya@student.com',
            password: 'Student@123',
            role: 'student',
            branch: 'IT',
            cgpa: 8.8,
            skills: ['Python', 'Django', 'PostgreSQL'],
            isPlaced: false,
        },
        {
            name: 'Rahul Verma',
            email: 'rahul@student.com',
            password: 'Student@123',
            role: 'student',
            branch: 'ECE',
            cgpa: 7.5,
            skills: ['Embedded C', 'VLSI', 'MATLAB'],
            isPlaced: false,
        },
    ]);

    // Create companies
    const companies = await Company.create([
        {
            companyName: 'Google India',
            role: 'Software Engineer',
            package: 24,
            description: "Join Google's engineering team to build products used by billions.",
            location: 'Bangalore',
            minCGPA: 8.0,
            eligibleBranches: ['CSE', 'IT', 'ECE'],
            requiredSkills: ['Data Structures', 'Algorithms', 'JavaScript'],
            rounds: [
                { name: 'Online Test', type: 'Aptitude' },
                { name: 'Technical Round 1', type: 'Technical' },
                { name: 'Technical Round 2', type: 'Technical' },
                { name: 'HR Round', type: 'HR' },
            ],
            applicationDeadline: new Date('2026-03-31'),
            createdBy: tpo._id,
        },
        {
            companyName: 'Infosys',
            role: 'Systems Engineer',
            package: 6.5,
            description: 'Entry-level engineering role with comprehensive training program.',
            location: 'Pune',
            minCGPA: 6.5,
            eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'],
            requiredSkills: ['Programming Basics', 'Problem Solving'],
            rounds: [
                { name: 'Aptitude Test', type: 'Aptitude' },
                { name: 'Technical Interview', type: 'Technical' },
                { name: 'HR Interview', type: 'HR' },
            ],
            applicationDeadline: new Date('2026-04-15'),
            createdBy: tpo._id,
        },
        {
            companyName: 'TCS',
            role: 'Associate Software Engineer',
            package: 7,
            description: 'Large-scale enterprise software development with global exposure.',
            location: 'Chennai',
            minCGPA: 7.0,
            eligibleBranches: ['CSE', 'IT', 'ECE'],
            requiredSkills: ['Java', 'SQL', 'OOP Concepts'],
            rounds: [
                { name: 'TCS NQT', type: 'Aptitude' },
                { name: 'Coding Round', type: 'Coding' },
                { name: 'HR Interview', type: 'HR' },
            ],
            applicationDeadline: new Date('2026-04-30'),
            createdBy: tpo._id,
        },
        {
            companyName: 'Amazon',
            role: 'SDE-1',
            package: 18,
            description: 'Build the next generation of Amazon cloud and e-commerce services.',
            location: 'Hyderabad',
            minCGPA: 7.5,
            eligibleBranches: ['CSE', 'IT'],
            requiredSkills: ['DSA', 'System Design', 'Java/Python/C++'],
            rounds: [
                { name: 'Online Assessment', type: 'Aptitude' },
                { name: 'Coding Interview', type: 'Coding' },
                { name: 'Bar Raiser', type: 'Technical' },
                { name: 'HR', type: 'HR' },
            ],
            applicationDeadline: new Date('2026-03-20'),
            createdBy: tpo._id,
        },
        {
            companyName: 'Microsoft',
            role: 'Software Engineer II',
            package: 20,
            description: 'Work on cutting-edge Microsoft products and Azure cloud platform.',
            location: 'Noida',
            minCGPA: 7.5,
            eligibleBranches: ['CSE', 'IT', 'ECE'],
            requiredSkills: ['C#', '.NET', 'Azure', 'Data Structures'],
            rounds: [
                { name: 'Online Assessment', type: 'Aptitude' },
                { name: 'Technical Round 1', type: 'Technical' },
                { name: 'Technical Round 2', type: 'Technical' },
                { name: 'HR', type: 'HR' },
            ],
            applicationDeadline: new Date('2026-05-01'),
            createdBy: tpo._id,
        },
    ]);

    // Create sample applications
    await Application.create([
        {
            studentId: students[0]._id, // Alice - CSE 8.5
            companyId: companies[0]._id, // Google
            status: 'Technical',
            currentRound: 'Technical Round 1',
        },
        {
            studentId: students[0]._id,
            companyId: companies[1]._id, // Infosys
            status: 'Applied',
            currentRound: '',
        },
        {
            studentId: students[2]._id, // Charlie - placed
            companyId: companies[0]._id, // Google
            status: 'Selected',
            currentRound: 'Selected',
        },
        {
            studentId: students[1]._id, // Bob - ECE 7.8
            companyId: companies[1]._id, // Infosys
            status: 'HR',
            currentRound: 'HR Interview',
        },
        {
            studentId: students[3]._id, // Diana - IT 7.2
            companyId: companies[1]._id, // Infosys
            status: 'Aptitude',
            currentRound: 'Aptitude Test',
        },
        {
            studentId: demoStudent._id, // Demo student - CSE 8.2
            companyId: companies[0]._id, // Google (8.0 min - eligible)
            status: 'Applied',
            currentRound: '',
        },
        {
            studentId: students[5]._id, // Priya - IT 8.8
            companyId: companies[3]._id, // Amazon
            status: 'Technical',
            currentRound: 'Bar Raiser',
        },
        {
            studentId: students[5]._id,
            companyId: companies[4]._id, // Microsoft
            status: 'Rejected',
            currentRound: '',
        },
    ]);

    console.log('\n✅ Seed data inserted successfully!');
    console.log('\n📋 Demo Accounts (password: demo123):');
    console.log('┌──────────────────────────────────────────┐');
    console.log('│  Role    │ Email                          │');
    console.log('├──────────────────────────────────────────┤');
    console.log('│  Admin   │ admin@demo.com                 │');
    console.log('│  TPO     │ tpo@demo.com                   │');
    console.log('│  Student │ student@demo.com               │');
    console.log('└──────────────────────────────────────────┘');
    console.log('\n📋 Additional Student Accounts (password: Student@123):');
    console.log('  alice@student.com  • CSE • 8.5 CGPA');
    console.log('  bob@student.com    • ECE • 7.8 CGPA');
    console.log('  charlie@student.com • CSE • 9.1 CGPA (Placed)');

    process.exit(0);
};

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
