const asyncHandler = require('express-async-handler');

// Importing the Task model and User model to interact with the database
const Task = require('../models/taskModel');
const User = require('../models/userModel');

const getTasks = asyncHandler(async (req, res) => {
    // Fetch all tasks from the database that belong to the logged-in user
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
});

const setTask = asyncHandler(async (req, res) => {
    // Check if the request body contains the 'text' field, which is required to create a task
    if (!req?.body?.text) {
        res.status(400)
        throw new Error('Please add a task');
    }

    // Create a new task in the database with the text from the request body and associate it with the logged-in user's ID
    const task = await Task.create({
        text: req.body.text,
        user: req.user.id
    });
    res.status(200).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
    // Check if the task exists
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    // Check if the user exists
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Check if the logged in user matches the task's user
    if (task.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    // Update the task with the new data from the request body
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
    // Check if the task exists
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(400);
        throw new Error('Task not found');
    }

    // Check if the user exists
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Check if the logged in user matches the task's user
    if (task.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    // Delete the task from the database
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: `Task ${req.params.id} deleted.` });
})

module.exports = { getTasks, setTask, updateTask, deleteTask }