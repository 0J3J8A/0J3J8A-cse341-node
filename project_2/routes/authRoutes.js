// routes/authRoutes.js
// Authentication routes

const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google login
router.get('/google', (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
});

// Google callback
router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/auth/login-failed',
        failureMessage: true
    }),
    (req, res) => {
        res.redirect('/auth/success');
    }
);

// Check authentication status
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return next(err);
            }
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    });
});

// Success page after login
router.get('/success', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            message: 'Login successful',
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

// Login failed
router.get('/login-failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Google authentication failed'
    });
});

// Test route
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Auth routes working',
        sessionID: req.sessionID,
        isAuthenticated: req.isAuthenticated()
    });
});

module.exports = router;