require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { sendTaskDueNotification } = require('../services/emailService');

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

// Send email to a specific user by email address
const sendEmailToUser = async (userEmail) => {
  await connectDB();
  
  try {
    // Find the user in the database
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.log(`User with email ${userEmail} not found in the database`);
      process.exit(1);
    }
    
    console.log(`Found user: ${user.name} (${user.email})`);
    
    // Create a mock task for testing
    const mockTask = {
      _id: 'test-task-id',
      title: 'Test Email Notification',
      description: 'This is a test email sent to a registered user to verify email functionality.',
      status: 'pending',
      priority: 'medium',
      category: {
        name: 'Test'
      }
    };
    
    console.log(`Sending email to registered user: ${user.email}`);
    
    // Send the email
    await sendTaskDueNotification(user, mockTask);
    console.log('✅ Email sent successfully to registered user!');
    
  } catch (error) {
    console.error('❌ Failed to send email to user:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Get email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('Usage: node scripts/send-email-to-user.js <user-email>');
  console.log('Example: node scripts/send-email-to-user.js user@example.com');
  process.exit(1);
}

sendEmailToUser(userEmail);