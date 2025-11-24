const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createDefaultCategories
} = require('../controllers/categoryController');

// Apply protect middleware to all routes
router.use(protect);

// Routes
router.post('/', createCategory);
router.post('/defaults', createDefaultCategories);
router.get('/', getCategories);
router.get('/:id', validateObjectId('id'), getCategoryById);
router.put('/:id', validateObjectId('id'), updateCategory);
router.delete('/:id', validateObjectId('id'), deleteCategory);

module.exports = router;