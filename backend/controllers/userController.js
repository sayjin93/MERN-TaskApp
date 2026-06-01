const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Importing the User model to interact with the users collection in the database
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
    // Destructuring the name, email, and password from the request body
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill in all fields');
    }

    // Check if a user with the provided email already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Generate a salt and hash the password using bcrypt before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database with the provided name, email, and hashed password
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token: generateJTWToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if a user with the provided email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error('Invalid credentials');
    }

    // Check if the provided password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid credentials');
    }

    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateJTWToken(user._id)
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
});

const generateJTWToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
});

module.exports = { registerUser, loginUser, getCurrentUser }
