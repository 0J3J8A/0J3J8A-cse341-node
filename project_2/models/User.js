// models/User.js
// User model for authentication and user management

const mongoose = require('mongoose');

// Define the schema for a user document
const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values for non-Google users
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters'],
        // Password is optional for Google OAuth users
        select: false // Don't return password by default in queries
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;