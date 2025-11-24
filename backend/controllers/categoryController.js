const Category = require('../models/Category');

const createCategory = async (req, res) => {
  try {
    const categoryData = {
      ...req.body,
      user: req.user.id
    };

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ 
      message: 'Failed to create category',
      error: error.message 
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id })
      .sort({ name: 1 });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      message: 'Failed to get categories',
      error: error.message 
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ 
      message: 'Failed to get category',
      error: error.message 
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ 
      message: 'Failed to update category',
      error: error.message 
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update all tasks that were using this category to have no category
    const Task = require('../models/Task');
    await Task.updateMany(
      { category: req.params.id },
      { $unset: { category: 1 } }
    );

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ 
      message: 'Failed to delete category',
      error: error.message 
    });
  }
};

const createDefaultCategories = async (req, res) => {
  try {
    const defaultCategories = [
      { name: 'Personal', color: '#ef4444', icon: 'user', isDefault: true },
      { name: 'Work', color: '#3b82f6', icon: 'briefcase', isDefault: true },
      { name: 'Health', color: '#10b981', icon: 'heart', isDefault: true },
      { name: 'Education', color: '#f59e0b', icon: 'book', isDefault: true },
      { name: 'Shopping', color: '#8b5cf6', icon: 'shopping-cart', isDefault: true }
    ];

    const categories = await Promise.all(
      defaultCategories.map(catData => 
        Category.create({ ...catData, user: req.user.id })
      )
    );

    res.status(201).json({
      success: true,
      message: 'Default categories created successfully',
      data: { categories }
    });
  } catch (error) {
    console.error('Create default categories error:', error);
    res.status(500).json({ 
      message: 'Failed to create default categories',
      error: error.message 
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createDefaultCategories
};

