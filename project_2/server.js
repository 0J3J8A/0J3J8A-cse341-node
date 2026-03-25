// server.js
require('dotenv').config();
// Main server file for the Video Games and Consoles API

const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
require('dotenv').config();

// Import route handlers
const gameRoutes = require('./routes/gameRoutes');
const consoleRoutes = require('./routes/consoleRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CORS CONFIGURATION =====
// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:3000', 'https://zeroj3j8a-cse341-node.onrender.com'],
    credentials: true // Allows cookies to be sent with requests
}));

// ===== SESSION CONFIGURATION ===== 
// Sets up session management for storing user login state
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevents client-side access to the cookie
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// ===== PASSPORT INITIALIZATION ===== 
// Initializes Passport for authentication and restores session state
app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse JSON request bodies
app.use(express.json());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Register API routes
app.use('/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/consoles', consoleRoutes);

// Root route for testing
app.get('/', (req, res) => {
    res.send('Video Games and Consoles API is running!');
});

// 404 handler for undefined routes - CORREGIDO: quitamos el '*'
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found. Please check the URL and try again.'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger Documentation available at http://localhost:${PORT}/api-docs`);
});