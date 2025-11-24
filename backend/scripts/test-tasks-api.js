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

// Test task stats function directly
const testTaskStats = async () => {
  await connectDB();
  
  try {
    // Import the task controller function
    const { getTaskStats } = require('../controllers/taskController');
    
    // Mock request and response objects
    const req = {
      user: {
        id: '68faa8f67f713c8f6e605f2a' // User ID from our test
      }
    };
    
    const res = {
      json: function(data) {
        console.log('Response data:', JSON.stringify(data, null, 2));
        return this;
      },
      status: function(code) {
        console.log('Status code:', code);
        return this;
      }
    };
    
    console.log('Testing getTaskStats function...');
    await getTaskStats(req, res);
    
  } catch (error) {
    console.error('Error testing task stats:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testTaskStats();