// middleware/authMiddleware.js
// Functions to protect routes based on authentication status

// Check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        success: false,
        message: 'Unauthorized. Please log in to access this resource.'
    });
};

// For routes that work with or without login
const optionalAuth = (req, res, next) => {
    next();
};

// Admin check (for future use)
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