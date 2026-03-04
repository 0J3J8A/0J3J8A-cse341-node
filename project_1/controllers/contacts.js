// controllers/contacts.js
// Import the Contact model
const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /contacts
const getAllContacts = async (req, res) => {
  try {
    // Fetch all contacts from the database
    const contacts = await Contact.find();
    
    // Return the contacts as JSON
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get a single contact by ID
// @route   GET /contacts/:id
const getContactById = async (req, res) => {
  try {
    // Get the ID from the URL parameters
    const contactId = req.params.id;
    
    // Find the contact by ID
    const contact = await Contact.findById(contactId);
    
    // If contact not found, return 404
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    
    // Return the contact
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    // Handle invalid ID format or other errors
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Export both functions
module.exports = {
  getAllContacts,
  getContactById
};