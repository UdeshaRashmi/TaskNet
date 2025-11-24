require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');

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

// Test task stats
const testTaskStats = async () => {
  await connectDB();
  
  try {
    // Find a user ID to test with
    const task = await Task.findOne({});
    if (task) {
      console.log('Found a task with user ID:', task.user);
      console.log('Task details:', task);
    } else {
      console.log('No tasks found in the database');
    }
  } catch (error) {
    console.error('Error testing task stats:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testTaskStats();