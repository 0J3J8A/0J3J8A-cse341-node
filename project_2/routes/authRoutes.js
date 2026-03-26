// routes/authRoutes.js
// Authentication routes for Google OAuth

const express = require('express');
const passport = require('passport');
const router = express.Router();

console.log(' Auth routes file loaded');

// @desc    Initiate Google OAuth authentication
// @route   GET /auth/google
router.get('/google', (req, res, next) => {
    console.log(' /auth/google route called');
    console.log('  Session ID:', req.sessionID);
    console.log('  Is authenticated:', req.isAuthenticated());
    console.log('  GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('  GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
    
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res, next);
});

// @desc    Google OAuth callback endpoint
router.get('/google/callback',
    (req, res, next) => {
        console.log(' Callback received');
        console.log('  Query params:', req.query);
        console.log('  Session ID:', req.sessionID);
        next();
    },
    passport.authenticate('google', { 
        failureRedirect: '/auth/login-failed',
        failureMessage: true
    }),
    (req, res) => {
        console.log(' Authentication successful for:', req.user?.email);
        console.log('  Session ID after auth:', req.sessionID);
        console.log('  User object:', req.user?._id);
        res.redirect('/auth/success');
    }
);

// @desc    Check current user authentication status
router.get('/status', (req, res) => {
    console.log(' /auth/status called, isAuthenticated:', req.isAuthenticated());
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

// @desc    Logout user and destroy session
router.get('/logout', (req, res, next) => {
    console.log('🚪 /auth/logout called');
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
            console.log(' Logout successful');
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    });
});

// @desc    Success endpoint after successful login
router.get('/success', (req, res) => {
    console.log(' /auth/success called, isAuthenticated:', req.isAuthenticated());
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
        console.log(' /auth/success called but user not authenticated');
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});

// @desc    Login failed endpoint
router.get('/login-failed', (req, res) => {
    console.log(' /auth/login-failed called');
    res.status(401).json({
        success: false,
        message: 'Google authentication failed. Please try again.'
    });
});

// @desc    Test route to verify auth routes are working
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Auth routes are working!',
        sessionID: req.sessionID,
        isAuthenticated: req.isAuthenticated()
    });
});

module.exports = router;