const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');

// Public route - anyone can submit contact form
router.post('/', createContact);

// Protected routes - require authentication
router.use(optionalAuth); // This allows both authenticated and unauthenticated access

// Apply pagination middleware
router.use(validatePagination);

// Routes
router.get('/', protect, getContacts);
router.get('/stats', protect, getContactStats);
router.get('/:id', protect, validateObjectId('id'), getContactById);
router.put('/:id', protect, validateObjectId('id'), updateContact);
router.delete('/:id', protect, validateObjectId('id'), deleteContact);

module.exports = router;