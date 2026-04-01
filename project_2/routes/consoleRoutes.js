// routes/consoleRoutes.js
// Console API endpoints

const express = require('express');
const router = express.Router();
const {
    getAllConsoles,
    getConsoleById,
    createConsole,
    updateConsole,
    deleteConsole
} = require('../controllers/consoleController');
const { isAuthenticated, optionalAuth } = require('../middleware/authMiddleware');

// /api/consoles
router.route('/')
    .get(optionalAuth, getAllConsoles)
    .post(isAuthenticated, createConsole);

// /api/consoles/:id
router.route('/:id')
    .get(optionalAuth, getConsoleById)
    .put(isAuthenticated, updateConsole)
    .delete(isAuthenticated, deleteConsole);

module.exports = router;