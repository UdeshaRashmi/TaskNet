require('dotenv').config();
const { sendTaskDueNotification } = require('../services/emailService');

// Test email functionality
const testEmail = async () => {
  try {
    console.log('Testing email notification...');
    console.log('Current environment variables:');
    console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('- EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('- EMAIL_SECURE:', process.env.EMAIL_SECURE);
    console.log('- EMAIL_USER:', process.env.EMAIL_USER);
    console.log('- TEST_EMAIL:', process.env.TEST_EMAIL);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('\n⚠️  WARNING: Email credentials not configured!');
      console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file');
      return;
    }
    
    // Mock user and task data for testing
    const mockUser = {
      name: 'Test User',
      email: process.env.TEST_EMAIL || 'test@example.com',
      preferences: {
        notifications: {
          email: true
        }
      }
    };
    
    console.log('\nSending test email to:', mockUser.email);
    
    const mockTask = {
      _id: '12345',
      title: 'Test Task Due Today',
      description: 'This is a test task to verify email notifications are working correctly.',
      status: 'pending',
      priority: 'high',
      category: {
        name: 'Work'
      }
    };
    
    await sendTaskDueNotification(mockUser, mockTask);
    console.log('✅ Email test completed successfully!');
    console.log('Check your inbox (and spam folder) for the test email.');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\nTo properly test email functionality:');
    console.log('1. Update your .env file with valid email credentials');
    console.log('2. Set TEST_EMAIL environment variable to a valid email address');
    console.log('3. For Gmail, use an App Password instead of your regular password');
    console.log('4. For development, consider using Ethereal Email (https://ethereal.email/) for testing');
    console.log('\nCommon issues:');
    console.log('- Incorrect email credentials');
    console.log('- Email provider blocking "less secure apps"');
    console.log('- Firewall or network restrictions');
    console.log('- Email going to spam folder');
  }
};

testEmail();