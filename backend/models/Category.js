const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  color: {
    type: String,
    default: '#6366f1',
    match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color']
  },
  icon: {
    type: String,
    default: 'folder'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  taskCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
categorySchema.index({ user: 1 });

// Virtual to get completed tasks count for this category
categorySchema.virtual('completedTaskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'category',
  count: true,
  match: { status: 'completed' }
});

// Method to update task count
categorySchema.methods.updateTaskCount = async function() {
  const Task = mongoose.model('Task');
  const count = await Task.countDocuments({ category: this._id });
  this.taskCount = count;
  return this.save();
};

// Pre-save middleware to ensure unique category names per user
categorySchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    const existingCategory = await this.constructor.findOne({
      name: this.name,
      user: this.user,
      _id: { $ne: this._id }
    });
    
    if (existingCategory) {
      return next(new Error('Category name already exists'));
    }
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);

