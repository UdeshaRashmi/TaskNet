const mongoose = require('mongoose');
require('../models/Task');
require('../models/User');
require('../models/Category');
const { checkDueTasks } = require('../services/taskScheduler');

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

// Run the due task checker immediately
const runCheck = async () => {
  await connectDB();
  
  try {
    await checkDueTasks();
    console.log('Manual task check completed');
  } catch (error) {
    console.error('Manual task check failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

runCheck();