// controllers/consoleController.js
// Handles all console related operations

const Console = require('../models/Console');

// Get all consoles from database
const getAllConsoles = async (req, res) => {
    try {
        const consoles = await Console.find();
        
        res.status(200).json({
            success: true,
            count: consoles.length,
            data: consoles
        });
    } catch (error) {
        console.error('Error in getAllConsoles:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching consoles'
        });
    }
};

// Get a single console by id
const getConsoleById = async (req, res) => {
    try {
        const consoleItem = await Console.findById(req.params.id);

        if (!consoleItem) {
            return res.status(404).json({
                success: false,
                message: `Console not found with id ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: consoleItem
        });
    } catch (error) {
        console.error('Error in getConsoleById:', error);
        
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

// Create a new console
const createConsole = async (req, res) => {
    try {
        const consoleItem = await Console.create(req.body);

        res.status(201).json({
            success: true,
            data: consoleItem
        });
    } catch (error) {
        console.error('Error in createConsole:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Console name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while creating the console'
        });
    }
};

// Update an existing console
const updateConsole = async (req, res) => {
    try {
        const consoleItem = await Console.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!consoleItem) {
            return res.status(404).json({
                success: false,
                message: `Console not found with id ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: consoleItem
        });
    } catch (error) {
        console.error('Error in updateConsole:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid console ID format'
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Console name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while updating the console'
        });
    }
};

// Delete a console
const deleteConsole = async (req, res) => {
    try {
        const consoleItem = await Console.findByIdAndDelete(req.params.id);

        if (!consoleItem) {
            return res.status(404).json({
                success: false,
                message: `Console not found with id ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Console deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Error in deleteConsole:', error);
        
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

module.exports = {
    getAllConsoles,
    getConsoleById,
    createConsole,
    updateConsole,
    deleteConsole
};