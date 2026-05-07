const mongoose = require('mongoose');
const User = require('./src/models/userModel');
const Lead = require('./src/models/leadModel');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Lead.deleteMany();

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true
        });

        console.log('Admin User Created!');

        await Lead.create([
            {
                name: 'John Doe',
                companyName: 'Tech Corp',
                email: 'john@techcorp.com',
                phoneNumber: '1234567890',
                leadSource: 'Website',
                assignedSalesperson: admin._id,
                status: 'New',
                estimatedDealValue: 5000,
                notes: [{ content: 'Initial interest from website form.', createdBy: admin._id }]
            },
            {
                name: 'Jane Smith',
                companyName: 'Innovate LLC',
                email: 'jane@innovate.com',
                phoneNumber: '0987654321',
                leadSource: 'LinkedIn',
                assignedSalesperson: admin._id,
                status: 'Qualified',
                estimatedDealValue: 12000,
                notes: [{ content: 'High value lead, needs follow up.', createdBy: admin._id }]
            }
        ]);

        console.log('Sample Leads Created!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
