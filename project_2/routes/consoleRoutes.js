// routes/consoleRoutes.js
// Route definitions for console-related API endpoints

const express = require('express');
const router = express.Router();
const {
    getAllConsoles,
    getConsoleById,
    createConsole,
    updateConsole,
    deleteConsole
} = require('../controllers/consoleController');

// Route: /api/consoles
// GET all consoles, POST a new console
router.route('/')
    .get(getAllConsoles)    // GET /api/consoles - Get all consoles
    .post(createConsole);    // POST /api/consoles - Create a new console

// Route: /api/consoles/:id
// GET a specific console by ID, PUT (update) a console, DELETE a console
router.route('/:id')
    .get(getConsoleById)     // GET /api/consoles/:id - Get a single  console information
    .put(updateConsole)      // PUT /api/consoles/:id - Update a  console information
    .delete(deleteConsole);  // DELETE /api/consoles/:id - Delete a  console information

module.exports = router;