// routes/authRoutes.js
// Authentication routes for Google OAuth

const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc    Initiate Google OAuth authentication
// @route   GET /auth/google
// @access  Public
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // Request user profile and email from Google
}));

// @desc    Google OAuth callback endpoint
// @route   GET /auth/google/callback
// @access  Public (handles the redirect from Google after authentication)
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login-failed' }),
    (req, res) => {
        // Successful authentication - redirect to success endpoint
        res.redirect('/auth/success');
    }
);

// @desc    Check current user authentication status
// @route   GET /auth/status
// @access  Public
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        // User is logged in - return user info
        res.json({
            isAuthenticated: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } else {
        // User is not logged in
        res.json({ isAuthenticated: false });
    }
});

// @desc    Logout user and destroy session
// @route   GET /auth/logout
// @access  Public (requires being logged in)
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        // Destroy session after logout
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    });
});

// @desc    Success endpoint after successful login
// @route   GET /auth/success
// @access  Public (redirected here after Google login)
router.get('/success', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                name: req.user.name,
                email: req.user.email
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});

// @desc    Login failed endpoint
// @route   GET /auth/login-failed
// @access  Public (redirected here if Google authentication fails)
router.get('/login-failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Google authentication failed. Please try again.'
    });
});

module.exports = router;