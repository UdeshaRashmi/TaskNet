const User = require('../models/User');
const { sendTaskDueNotification } = require('../services/emailService');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get user profile',
      error: error.message 
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, preferences } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (preferences) updates.preferences = preferences;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile',
      error: error.message 
    });
  }
};

const testEmailNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Check if user has email notifications enabled
    if (user.preferences?.notifications?.email === false) {
      return res.status(400).json({ 
        success: false,
        message: 'Email notifications are disabled in your preferences' 
      });
    }
    
    // Send test email notification
    const testTask = {
      _id: 'test-task-id',
      title: 'Test Notification',
      description: 'This is a test email to verify your notification settings are working correctly.',
      status: 'pending',
      priority: 'medium',
      category: {
        name: 'Test'
      }
    };
    
    await sendTaskDueNotification(user, testTask);
    
    res.json({
      success: true,
      message: `Test email sent successfully to ${user.email}`
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send test email',
      error: error.message 
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  testEmailNotification
};