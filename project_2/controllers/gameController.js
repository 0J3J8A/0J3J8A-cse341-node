// controllers/gameController.js
// Controller functions for Game CRUD operations
// Contains all business logic for handling game-related requests

const Game = require('../models/Game');

// @desc    Get all games from the database
// @route   GET /api/games
// @access  Public
const getAllGames = async (req, res) => {
    try {
        // Find all games in the collection
        const games = await Game.find();
        
        // Return success response with games array
        res.status(200).json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        console.error('Error in getAllGames:', error);
        // Return 500 Internal Server Error
        res.status(500).json({
            success: false,
            message: 'Server error while fetching games'
        });
    }
};

// @desc    Get a single game by its ID
// @route   GET /api/games/:id
// @access  Public
const getGameById = async (req, res) => {
    try {
        // Find game by ID from URL parameter
        const game = await Game.findById(req.params.id);

        // If game not found, return 404
        if (!game) {
            return res.status(404).json({
                success: false,
                message: `Game not found with id ${req.params.id}`
            });
        }

        // Return the found game
        res.status(200).json({
            success: true,
            data: game
        });
    } catch (error) {
        console.error('Error in getGameById:', error);
        
        // Handle invalid MongoDB ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid game ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while fetching the game'
        });
    }
};

// @desc    Create a new game
// @route   POST /api/games
// @access  Public
const createGame = async (req, res) => {
    try {
        // Create new game with data from request body
        const game = await Game.create(req.body);

        // Return 201 Created status with the new game
        res.status(201).json({
            success: true,
            data: game
        });
    } catch (error) {
        console.error('Error in createGame:', error);
        
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
        
        res.status(500).json({
            success: false,
            message: 'Server error while creating the game'
        });
    }
};

// @desc    Update an existing game
// @route   PUT /api/games/:id
// @access  Public
const updateGame = async (req, res) => {
    try {
        // Find game by ID and update with request body data
        const game = await Game.findByIdAndUpdate(
            req.params.id,      // ID of game to update
            req.body,           // New data
            {
                new: true,      // Return the updated document
                runValidators: true // Run schema validators on update
            }
        );

        // If game not found, return 404
        if (!game) {
            return res.status(404).json({
                success: false,
                message: `Game not found with id ${req.params.id}`
            });
        }

        // Return the updated game
        res.status(200).json({
            success: true,
            data: game
        });
    } catch (error) {
        console.error('Error in updateGame:', error);
        
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
                message: 'Invalid game ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while updating the game'
        });
    }
};

// @desc    Delete a game
// @route   DELETE /api/games/:id
// @access  Public
const deleteGame = async (req, res) => {
    try {
        // Find game by ID and delete it
        const game = await Game.findByIdAndDelete(req.params.id);

        // If game not found, return 404
        if (!game) {
            return res.status(404).json({
                success: false,
                message: `Game not found with id ${req.params.id}`
            });
        }

        // Return success message
        res.status(200).json({
            success: true,
            message: 'Game deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Error in deleteGame:', error);
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid game ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while deleting the game'
        });
    }
};

// Export all controller functions
module.exports = {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
};