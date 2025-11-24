const Task = require('../models/Task');
const Category = require('../models/Category');
const mongoose = require('mongoose');

const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      user: req.user.id
    };

    // Remove category if it's empty string to avoid MongoDB cast error
    if (taskData.category === '' || taskData.category === null) {
      delete taskData.category;
    }

    console.log('Creating task with data:', taskData);
    
    // Validate required fields before creating
    if (!taskData.title) {
      return res.status(400).json({ 
        success: false,
        message: 'Task title is required'
      });
    }
    
    const task = await Task.create(taskData);

    // Update category task count if category is provided
    if (task.category) {
      await Category.findByIdAndUpdate(
        task.category,
        { $inc: { taskCount: 1 } }
      );
    }

    await task.populate('category', 'name color icon');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create task error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Duplicate field value entered'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to create task',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const { page, limit, skip } = req.pagination;

    // Build filter object
    const filter = { user: req.user.id };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(filter)
      .populate('category', 'name color icon')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      message: 'Failed to get tasks',
      error: error.message 
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('category', 'name color icon');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      message: 'Failed to get task',
      error: error.message 
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Get current task to check category changes
    const currentTask = await Task.findOne({ _id: taskId, user: userId });
    if (!currentTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name color icon');

    // Update category task counts if category changed
    if (currentTask.category?.toString() !== task.category?.toString()) {
      // Decrease old category count
      if (currentTask.category) {
        await Category.findByIdAndUpdate(
          currentTask.category,
          { $inc: { taskCount: -1 } }
        );
      }
      
      // Increase new category count
      if (task.category) {
        await Category.findByIdAndUpdate(
          task.category,
          { $inc: { taskCount: 1 } }
        );
      }
    }

    // If status changed to completed, set completedAt
    if (req.body.status === 'completed' && currentTask.status !== 'completed') {
      task.completedAt = new Date();
      await task.save();
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      message: 'Failed to update task',
      error: error.message 
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update category task count
    if (task.category) {
      await Category.findByIdAndUpdate(
        task.category,
        { $inc: { taskCount: -1 } }
      );
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      message: 'Failed to delete task',
      error: error.message 
    });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    
    const stats = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$dueDate', null] },
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$status', 'completed'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Task.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId),
          category: { $ne: null }
        } 
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $project: {
          count: 1,
          categoryName: { $arrayElemAt: ['$categoryInfo.name', 0] }
        }
      }
    ]);

    // Get recent activities (recently created, updated, or completed tasks)
    const recentActivities = await Task.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('title status createdAt updatedAt completedAt')
      .lean();

    // Format activities for frontend
    const formattedActivities = recentActivities.map(task => {
      let action, time;
      
      // Determine the most recent action
      if (task.completedAt && (!task.updatedAt || task.completedAt > task.updatedAt)) {
        action = 'completed';
        time = task.completedAt;
      } else if (task.status === 'in-progress') {
        action = 'in progress';
        time = task.updatedAt || task.createdAt;
      } else if (task.status === 'pending') {
        action = 'created';
        time = task.createdAt;
      } else {
        action = task.status;
        time = task.updatedAt || task.createdAt;
      }
      
      // Calculate time ago
      const timeAgo = getTimeAgo(time);
      
      return {
        task: task.title,
        action: action,
        time: timeAgo,
        taskId: task._id
      };
    });

    // Calculate average completion time for completed tasks
    const completedTasks = await Task.find({ 
      user: userId, 
      status: 'completed',
      completedAt: { $ne: null }
    }).select('createdAt completedAt');

    let averageCompletionTime = 'N/A';
    if (completedTasks.length > 0) {
      const totalCompletionTime = completedTasks.reduce((total, task) => {
        const completionTime = task.completedAt - task.createdAt;
        return total + completionTime;
      }, 0);
      
      const averageTimeMs = totalCompletionTime / completedTasks.length;
      averageCompletionTime = formatTimeDuration(averageTimeMs);
    }

    // Calculate productivity trend (comparing last 7 days to previous 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const recentCompleted = await Task.countDocuments({
      user: userId,
      status: 'completed',
      completedAt: { $gte: sevenDaysAgo }
    });
    
    const previousCompleted = await Task.countDocuments({
      user: userId,
      status: 'completed',
      completedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
    });
    
    let productivityTrend = '0%';
    if (previousCompleted > 0) {
      const trend = ((recentCompleted - previousCompleted) / previousCompleted * 100).toFixed(0);
      productivityTrend = `${trend >= 0 ? '+' : ''}${trend}%`;
    } else if (recentCompleted > 0) {
      productivityTrend = '+100%';
    }

    // Get weekly performance data (tasks completed per day for the last 7 days)
    const weeklyPerformance = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      
      const count = await Task.countDocuments({
        user: userId,
        status: 'completed',
        completedAt: { $gte: dayStart, $lt: dayEnd }
      });
      
      weeklyPerformance.push({
        date: dayStart,
        count: count,
        day: dayStart.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }

    res.json({
      success: true,
      data: {
        overall: stats[0] || {
          total: 0,
          completed: 0,
          pending: 0,
          inProgress: 0,
          cancelled: 0,
          overdue: 0
        },
        byPriority: priorityStats,
        byCategory: categoryStats,
        recentActivities: formattedActivities,
        averageCompletionTime: averageCompletionTime,
        productivityTrend: productivityTrend,
        weeklyPerformance: weeklyPerformance
      }
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ 
      message: 'Failed to get task statistics',
      error: error.message 
    });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " day" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hour" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minute" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
  }
  
  return Math.floor(seconds) + " second" + (seconds > 1 ? "s" : "") + " ago";
}

// Helper function to format time duration
function formatTimeDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
};

