// routes/contacts.js
// Import express
const express = require('express');

// Import the functions
const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} = require('../controllers/contacts');

// Create a router instance
const router = express.Router();

// Define routes

// GET /contacts - Get all contacts
router.get('/', getAllContacts);

// GET /contacts/:id - Get a single contact by ID
router.get('/:id', getContactById);

// POST /contacts - Create a new contact
router.post('/', createContact);

// PUT /contacts/:id - Update a contact
router.put('/:id', updateContact);

// DELETE /contacts/:id - Delete a contact
router.delete('/:id', deleteContact);

// Export the router
module.exports = router;