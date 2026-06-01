// Importing necessary modules
const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middlewares/errorMiddleware');
const connectDB = require('./connect/database');
const cors = require('cors');

// Connecting to the database
connectDB();

// Setting the port for the server
const port = process.env.PORT || 5000;

// Initializing the Express application
const app = express();

// Enabling CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Middleware to parse URL-encoded bodies in requests
app.use(express.urlencoded({ extended: false }));

// Importing and using task routes
app.use('/api/tasks', require('./routes/taskRoutes'));

// Importing and using user routes
app.use('/api/users', require('./routes/userRoutes'));

// Using the custom error handling middleware
app.use(errorHandler);

// Starting the server and listening on the specified port
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
