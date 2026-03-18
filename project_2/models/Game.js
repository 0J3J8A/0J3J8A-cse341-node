// models/Game.js
// Game model schema definition for MongoDB using Mongoose

const mongoose = require('mongoose');

// Define the schema for a video game document
const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Game title is required'], // Custom error message
        trim: true, // Remove whitespace from both ends
        maxlength: [100, 'Game title cannot exceed 100 characters']
    },
    genre: {
        type: String,
        required: [true, 'Game genre is required'],
        enum: ['Action', 'Adventure', 'RPG', 'Shooter', 'Sports', 'Strategy', 
               'Simulation', 'Puzzle', 'Platformer', 'Fighting', 'Racing', 'Horror'],
        default: 'Action'
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required'],
        min: [1950, 'Release year must be 1950 or later'],
        max: [2030, 'Release year cannot be later than 2030']
    },
    developer: {
        type: String,
        required: [true, 'Developer name is required'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [0, 'Rating cannot be less than 0'],
        max: [10, 'Rating cannot exceed 10']
    },
    isMultiplayer: {
        type: Boolean,
        required: [true, 'Please specify if the game is multiplayer'],
        default: false
    },
    platforms: {
        type: [String], // Array of strings
        required: [true, 'At least one platform is required'],
        validate: {
            validator: function(v) {
                return v && v.length > 0; // Confirm array is NOT empty
            },
            message: 'Please specify at least one platform'
        }
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create and export the Game model
// Mongoose will automatically look for the 'games' collection (plural, lowercase)
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;