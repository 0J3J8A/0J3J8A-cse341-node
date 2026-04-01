// models/Game.js
// Schema for video games

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Game title is required'],
        trim: true,
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
        type: [String],
        required: [true, 'At least one platform is required'],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Please specify at least one platform'
        }
    }
}, {
    timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;