const express = require('express');
const router = express.Router();

// Importing the user controller
const { registerUser, loginUser, getCurrentUser } = require('../controllers/userController');

// Importing the protect middleware to secure routes that require authentication
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post('/', registerUser);

// @route   POST /api/users/login
// @desc    Authenticate a user and get a token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/users/current
// @desc    Get the current logged in user
// @access  Private
router.get('/current', protect, getCurrentUser);

module.exports = router;
