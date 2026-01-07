const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for adding user');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const addUser = async () => {
  try {
    const newUser = new User({
      username: 'newuser',
      password: 'newpass123',
      role: 'Staff',
      permissions: {
        canEditTrips: true,
        canDeleteTrips: false,
        canManageParties: true,
        canManageBrokers: true,
        canManageOwners: true,
        canViewReports: true
      }
    });
    await newUser.save();
    console.log('New user added successfully: username=newuser, password=newpass123');
  } catch (error) {
    console.error('Error adding user:', error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(() => {
  addUser();
});