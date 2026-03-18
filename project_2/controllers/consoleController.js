// controllers/consoleController.js
// Controller functions for Console CRUD operations
// Contains all business logic for handling console-related requests

const Console = require('../models/Console');

// @desc    Get all consoles from the database
// @route   GET /api/consoles
// @access  Public
const getAllConsoles = async (req, res) => {
    try {
        // Find all consoles in the collection
        const consoles = await Console.find();
        
        // Return success response with consoles array
        res.status(200).json({
            success: true,
            count: consoles.length,
            data: consoles
        });
    } catch (error) {
        console.error('Error in getAllConsoles:', error);
        // Return 500 Internal Server Error
        res.status(500).json({
            success: false,
            message: 'Server error while fetching consoles'
        });
    }
};

// @desc    Get a single console by its ID
// @route   GET /api/consoles/:id
// @access  Public
const getConsoleById = async (req, res) => {
    try {
        // Find console by ID from URL parameter
        // Using consoleItem instead of console to avoid conflict with global console object
        const consoleItem = await Console.findById(req.params.id);

        // If console not found, return 404
        if (!consoleItem) {
            return res.status(404).json({
                success: false,
                message: `Console not found with id ${req.params.id}`
            });
        }

        // Return the found console
        res.status(200).json({
            success: true,
            data: consoleItem
        });
    } catch (error) {
        console.error('Error in getConsoleById:', error);
        
        // Handle invalid MongoDB ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid console ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while fetching the console'
        });
    }
};

// @desc    Create a new console
// @route   POST /api/consoles
// @access  Public
const createConsole = async (req, res) => {
    try {
        // Create new console with data from request body
        const consoleItem = await Console.create(req.body);

        // Return 201 Created status with the new console
        res.status(201).json({
            success: true,
            data: consoleItem
        });
    } catch (error) {
        console.error('Error in createConsole:', error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            // Extract all validation error messages
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        
        // Handle duplicate key error (unique constraint violation)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Console name already exists. Name must be unique.'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while creating the console'
        });
    }
};

// @desc    Update an existing console
// @route   PUT /api/consoles/:id
// @access  Public
const updateConsole = async (req, res) => {
    try {
        // Find console by ID and update with request body data
        const consoleItem = await Console.findByIdAndUpdate(
            req.params.id,      // ID of console to update
            req.body,           // New data
            {
                new: true,      // Return the updated document
                runValidators: true // Run schema validators on update
            }
        );

        // If console not found, return 404
        if (!consoleItem) {
            return res.status(404).json({
                success: false,
                message: `Console not found with id ${req.params.id}`
            });
        }

        // Return the updated console
        res.status(200).json({
            success: true,
            data: consoleItem
        });
    } catch (error) {
        console.error('Error in updateConsole:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid console ID format'
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Console name already exists. Name must be unique.'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while updating the console'
        });
    }
};

// @desc    Delete a console
// @route   DELETE /api/consoles/:id
// @access  Public
const deleteConsole = async (req, res) => {
    try {
        // Find console by ID and delete it
        const consoleItem = await Console.findByIdAndDelete(req.params.id);

        // If console not found, return 404
        if (!consoleItem) {
            return res.status(404).json({
                success: false,
                message: `Console not found with id ${req.params.id}`
            });
        }

        // Return success message
        res.status(200).json({
            success: true,
            message: 'Console deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Error in deleteConsole:', error);
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid console ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while deleting the console'
        });
    }
};

// Export all controller functions
module.exports = {
    getAllConsoles,
    getConsoleById,
    createConsole,
    updateConsole,
    deleteConsole
};