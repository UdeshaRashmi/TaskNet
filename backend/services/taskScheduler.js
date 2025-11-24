const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendTaskDueNotification } = require('../services/emailService');

// Check for tasks due today and send notifications
const checkDueTasks = async () => {
  try {
    console.log('Checking for tasks due today...');
    
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date (end of day)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log('Date range for due tasks:', { today, tomorrow });
    
    // Find tasks due today that haven't been notified yet
    const tasks = await Task.find({
      dueDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: { $ne: 'completed' }
    }).populate('user', 'name email preferences')
      .populate('category', 'name color');
    
    console.log(`Found ${tasks.length} tasks due today`);
    
    // Log task details for debugging
    tasks.forEach((task, index) => {
      console.log(`Task ${index + 1}:`, {
        id: task._id,
        title: task.title,
        userEmail: task.user?.email,
        userNotificationsEnabled: task.user?.preferences?.notifications?.email !== false
      });
    });
    
    let notificationCount = 0;
    
    // Send notifications for each task
    for (const task of tasks) {
      try {
        // Check if user has email notifications enabled
        const emailNotificationsEnabled = task.user?.preferences?.notifications?.email !== false;
        console.log(`Checking notification for task ${task._id}:`, {
          userEmail: task.user?.email,
          emailNotificationsEnabled
        });
        
        if (emailNotificationsEnabled && task.user?.email) {
          try {
            await sendTaskDueNotification(task.user, task);
            notificationCount++;
          } catch (emailError) {
            console.error(`Failed to send notification for task ${task._id}:`, emailError);
          }
        } else {
          console.log(`Skipping notification for task ${task._id} - user has email notifications disabled or no email`);
        }
      } catch (error) {
        console.error(`Failed to send notification for task ${task._id}:`, error);
      }
    }
    
    console.log(`Sent ${notificationCount} email notifications for due tasks`);
  } catch (error) {
    console.error('Error checking due tasks:', error);
  }
};

// Schedule the task checker to run daily at 9 AM
const scheduleTaskNotifications = () => {
  // Schedule to run every day at 9:00 AM
  cron.schedule('0 9 * * *', checkDueTasks, {
    scheduled: true,
    timezone: process.env.TZ || "UTC"
  });
  
  console.log('Task notification scheduler started - will check for due tasks daily at 9:00 AM');
};

module.exports = {
  scheduleTaskNotifications,
  checkDueTasks
};