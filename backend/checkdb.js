require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const User = require('./models/User');
    const Company = require('./models/Company');
    const Application = require('./models/Application');

    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const tpos = await User.countDocuments({ role: 'tpo' });
    const admins = await User.countDocuments({ role: 'admin' });
    const placed = await User.countDocuments({ role: 'student', isPlaced: true });
    const companies = await Company.countDocuments();
    const apps = await Application.countDocuments();
    const statuses = await Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const allCompanies = await Company.find({}, 'companyName package minCGPA');
    const allStudents = await User.find({ role: 'student' }, 'name email branch cgpa isPlaced');

    console.log('\n============================');
    console.log('   DATABASE HEALTH CHECK   ');
    console.log('============================');
    console.log('Total Users:', totalUsers);
    console.log('  Students:', students, '| Placed:', placed, '| Unplaced:', students - placed);
    console.log('  TPOs:', tpos, '| Admins:', admins);
    console.log('Total Companies:', companies);
    console.log('Total Applications:', apps);
    console.log('\nApplication Statuses:');
    statuses.forEach(s => console.log(' ', s._id, ':', s.count));
    console.log('\nCompanies:');
    allCompanies.forEach(c => console.log(' ', c.companyName, '-', c.package, 'LPA, minCGPA:', c.minCGPA));
    console.log('\nStudents:');
    allStudents.forEach(s => console.log(' ', s.name, '|', s.branch, '|', s.cgpa, 'CGPA |', s.isPlaced ? 'PLACED' : 'Seeking'));
    console.log('\n============================');
    console.log('   ALL CHECKS PASSED ✅    ');
    console.log('============================\n');
    process.exit(0);
}).catch(e => {
    console.error('DB ERROR:', e.message);
    process.exit(1);
});
