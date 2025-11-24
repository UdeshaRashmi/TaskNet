const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Task title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  subtasks: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  estimatedTime: {
    hours: {
      type: Number,
      min: 0,
      max: 24
    },
    minutes: {
      type: Number,
      min: 0,
      max: 59
    }
  },
  actualTime: {
    hours: {
      type: Number,
      min: 0,
      default: 0
    },
    minutes: {
      type: Number,
      min: 0,
      max: 59,
      default: 0
    }
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: null
  },
  recurringEndDate: Date,
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, category: 1 });

// Virtual for completion percentage based on subtasks
taskSchema.virtual('completionPercentage').get(function() {
  if (!this.subtasks || this.subtasks.length === 0) {
    return this.status === 'completed' ? 100 : 0;
  }
  
  const completedSubtasks = this.subtasks.filter(subtask => subtask.completed).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Method to mark task as completed
taskSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  
  // Mark all subtasks as completed
  this.subtasks.forEach(subtask => {
    if (!subtask.completed) {
      subtask.completed = true;
      subtask.completedAt = new Date();
    }
  });
  
  return this.save();
};

// Method to calculate total estimated time in minutes
taskSchema.methods.getEstimatedTimeInMinutes = function() {
  return (this.estimatedTime.hours || 0) * 60 + (this.estimatedTime.minutes || 0);
};

// Method to calculate total actual time in minutes
taskSchema.methods.getActualTimeInMinutes = function() {
  return (this.actualTime.hours || 0) * 60 + (this.actualTime.minutes || 0);
};

module.exports = mongoose.model('Task', taskSchema);

