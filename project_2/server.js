// server.js
// Main server file for the Video Games and Consoles API
// This file configures Express, connects to MongoDB, and sets up routes

const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Import your swagger documentation
require('dotenv').config(); // Load environment variables from .env file

// Import route handlers
const gameRoutes = require('./routes/gameRoutes');
const consoleRoutes = require('./routes/consoleRoutes');

const app = express();
const PORT = process.env.PORT || 3000; // Use port from environment or default to 3000

// Middleware to parse JSON request bodies
app.use(express.json());

// Swagger Documentation Route
// Visit http://localhost:3000/api-docs to see the Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Register API routes
// All game-related routes will be prefixed with /api/games
app.use('/api/games', gameRoutes);
// All console-related routes will be prefixed with /api/consoles
app.use('/api/consoles', consoleRoutes);

// Root route for testing
app.get('/', (req, res) => {
    res.send('🎮 Video Games and Consoles API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger Documentation available at http://localhost:${PORT}/api-docs`);
});