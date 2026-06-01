const express = require('express');
const router = express.Router();

// Importing the task controller
const { getTasks, setTask, updateTask, deleteTask } = require('../controllers/taskController');

// Importing the protect middleware to secure routes that require authentication
const { protect } = require('../middlewares/authMiddleware');

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', protect, getTasks);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, setTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, deleteTask);

module.exports = router;
