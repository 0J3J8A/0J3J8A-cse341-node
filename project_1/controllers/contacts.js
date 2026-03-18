// controllers/contacts.js
// Import the Contact model
const Contact = require('../models/Contact');
const mongoose = require('mongoose'); // Needed for checking CastError

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
    // Handle any unexpected server errors
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Get a single contact by ID
// @route   GET /contacts/:id
const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    
    // Validate if the ID is a valid MongoDB ObjectId 
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ // 400 Bad Request
        success: false,
        error: 'Invalid contact ID format'
      });
    }
    
    const contact = await Contact.findById(contactId);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    // Handle other potential errors (like server issues)
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Create a new contact
// @route   POST /contacts
const createContact = async (req, res) => {
  try {
    
    // Create the new contact. Mongoose runs validators automatically.
    const contact = await Contact.create(req.body);
    
    // Return the new contact id in the response body
    res.status(201).json({
      success: true,
      data: {
        id: contact._id
      }
    });
  } catch (error) {
    // ERROR HANDLING
    // Handle Mongoose validation errors (e.g., missing field, invalid email)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ // 400 Bad Request
        success: false,
        error: messages.join('. ') // Combine all validation messages
      });
    }
    
    // Handle duplicate email error (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({ // 400 Bad Request
        success: false,
        error: 'Email already exists. Please use a different email.'
      });
    }
    
    // Handle other server errors
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Update a contact
// @route   PUT /contacts/:id
const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    
    // Validate if the ID is a valid MongoDB ObjectId 
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contact ID format'
      });
    }
    
    // Find and update the contact. runValidators: true is crucial here!
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      req.body, // Use the whole body
      { 
        new: true,           // Return the updated document
        runValidators: true  // Run schema validators on update
      }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    // ERROR HANDLING
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join('. ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists. Please use a different email.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Delete a contact
// @route   DELETE /contacts/:id
const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contact ID format'
      });
    }
    
    const contact = await Contact.findByIdAndDelete(contactId);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
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