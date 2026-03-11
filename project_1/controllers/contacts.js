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

// @desc    Create a new contact
// @route   POST /contacts
const createContact = async (req, res) => {
  try {
    // Get the contact data from the request body
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validate that all fields are present
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday'
      });
    }
    
    // Create the new contact
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });
    
    // Return the new contact id in the response body
    res.status(201).json({
      success: true,
      data: {
        id: contact._id
      }
    });
  } catch (error) {
    // Handle duplicate email error or other validation errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update a contact
// @route   PUT /contacts/:id
const updateContact = async (req, res) => {
  try {
    // Get the ID from the URL parameters
    const contactId = req.params.id;
    
    // Get the update data from the request body
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Find and update the contact
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { firstName, lastName, email, favoriteColor, birthday },
      { 
        new: true,           // Return the updated document
        runValidators: true  // Run schema validators
      }
    );
    
    // If contact not found, return 404
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    
    // Return http status code representing successful completion
    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete a contact
// @route   DELETE /contacts/:id
const deleteContact = async (req, res) => {
  try {
    // Get the ID from the URL parameters
    const contactId = req.params.id;
    
    // Find and delete the contact
    const contact = await Contact.findByIdAndDelete(contactId);
    
    // If contact not found, return 404
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    
    // Return http status code representing successful completion
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};