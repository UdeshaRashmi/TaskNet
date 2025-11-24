const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(protect); // Apply protect middleware to all routes below

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;