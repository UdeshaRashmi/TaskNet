require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to database
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasknest';
    await mongoose.connect(mongoURI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// List all registered users
const listUsers = async () => {
  await connectDB();
  
  try {
    const users = await User.find({}, 'name email createdAt');
    
    if (users.length === 0) {
      console.log('No registered users found in the database');
    } else {
      console.log(`Found ${users.length} registered users:`);
      console.log('----------------------------------------');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Registered: ${user.createdAt.toLocaleString()}`);
      });
      console.log('----------------------------------------');
    }
  } catch (error) {
    console.error('Error fetching users:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

listUsers();