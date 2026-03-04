// models/Contact.js
// Import mongoose
const mongoose = require('mongoose');

// Schema for a contact as step 3 (firstName, lastName, email, favoriteColor, birthday.)
const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  favoriteColor: {
    type: String,
    required: [true, 'Favorite color is required'],
    trim: true
  },
  birthday: {
    type: String,
    required: [true, 'Birthday is required']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create/Export the model
module.exports = mongoose.model('Contact', contactSchema);