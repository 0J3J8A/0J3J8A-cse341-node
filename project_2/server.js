// server.js
// Main application entry point

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');

const gameRoutes = require('./routes/gameRoutes');
const consoleRoutes = require('./routes/consoleRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Check if running in production
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

// CORS setup
const allowedOrigins = [
    'http://localhost:3000',
    'https://zeroj3j8a-cse341-node.onrender.com'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true
}));

// Trust proxy for Render (required for secure cookies)
app.set('trust proxy', isProduction ? 1 : 0);

// Session configuration - works for both localhost and Render
app.use(session({
    secret: process.env.SESSION_SECRET || 'change-this-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({  
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60
    }),
    cookie: {
        secure: isProduction,  // true in production (HTTPS), false in local (HTTP)
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: isProduction ? 'none' : 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/consoles', consoleRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Video Games and Consoles API is running');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});