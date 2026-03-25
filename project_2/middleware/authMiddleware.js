// middleware/authMiddleware.js
// Authentication middleware / Protect API routes

// Functions to check if a user is logged in before allowing access

// Middleware to check if user is authenticated
// Use this to protect routes that require login
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // User is logged in - proceed to the route handler
        return next();
    }
    // User is not logged in - return 401 Unauthorized
    res.status(401).json({
        success: false,
        message: 'Unauthorized. Please log in to access this resource.'
    });
};

// Middleware for routes that can be accessed with or without authentication
// Use this for GET routes where you want to show data but maybe with extra info if logged in
const optionalAuth = (req, res, next) => {
    // User may or may not be authenticated - proceed anyway
    // The route handler can check req.isAuthenticated() if needed
    next();
};

// Middleware to check if user is admin (for future expansion)
// Reserved for future admin-only features
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({
        success: false,
        message: 'Forbidden. Admin access required.'
    });
};

module.exports = {
    isAuthenticated,
    optionalAuth,
    isAdmin
};