// models/Console.js
// Schema for gaming consoles

const mongoose = require('mongoose');

const consoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Console name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Console name cannot exceed 100 characters']
    },
    manufacturer: {
        type: String,
        required: [true, 'Manufacturer name is required'],
        trim: true
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required'],
        min: [1970, 'Release year must be 1970 or later'],
        max: [2030, 'Release year cannot be later than 2030']
    },
    generation: {
        type: Number,
        required: [true, 'Console generation is required'],
        min: [1, 'Generation cannot be less than 1'],
        max: [10, 'Generation cannot exceed 10']
    },
    isPortable: {
        type: Boolean,
        required: [true, 'Please specify if the console is portable'],
        default: false
    },
    unitsSold: {
        type: Number,
        min: [0, 'Units sold cannot be negative'],
        default: 0
    },
    discontinued: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Console = mongoose.model('Console', consoleSchema);

module.exports = Console;