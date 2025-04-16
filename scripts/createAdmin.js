const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../Models/User.js'); // Adjust the path as necessary
dotenv.config();

async function createAdmin() {
    await mongoose.connect(process.env.MONGO_URL);

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
        // console.log('Admin user already exists. Exiting...');
        return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash("adminrishabh123", 10)

    const admin = new User({
        username: "admin",
        email: "admin@gogo.com",
        password: hashedPassword,
        role: "admin"
    });

    await admin.save();
    // console.log('Admin user created successfully.');
    mongoose.disconnect();
}

createAdmin().catch((err) => {
    console.log(err);
    mongoose.disconnect();
    // process.exit(1);
})