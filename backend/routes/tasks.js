const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateObjectId, validatePagination, validateTaskStatus, validatePriority } = require('../middleware/validation');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');

// Apply protect middleware to all routes
router.use(protect);

// Routes
router.post('/', validateTaskStatus, validatePriority, createTask);
router.get('/', validatePagination, validateTaskStatus, validatePriority, getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', validateObjectId('id'), getTaskById);
router.put('/:id', validateObjectId('id'), validateTaskStatus, validatePriority, updateTask);
router.delete('/:id', validateObjectId('id'), deleteTask);

module.exports = router;