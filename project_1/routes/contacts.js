// routes/contacts.js
// Import express
const express = require('express');

// Import the functions
const {
  getAllContacts,
  getContactById
} = require('../controllers/contacts');

// Create a router instance
const router = express.Router();

// Define routes

// GET /contacts - Get all contacts
router.get('/', getAllContacts);

// GET /contacts/:id - Get a single contact by ID
router.get('/:id', getContactById);

// Export the router
module.exports = router;