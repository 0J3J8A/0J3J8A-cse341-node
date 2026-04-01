// controllers/gameController.js
// Handles all game related operations

const Game = require('../models/Game');

// Get all games
const getAllGames = async (req, res) => {
    try {
        const games = await Game.find();
        
        res.status(200).json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        console.error('Error in getAllGames:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching games'
        });
    }
};

// Get a single game by id
const getGameById = async (req, res) => {
    try {
        const gameItem = await Game.findById(req.params.id);

        if (!gameItem) {
            return res.status(404).json({
                success: false,
                message: `Game not found with id ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: gameItem
        });
    } catch (error) {
        console.error('Error in getGameById:', error);
        
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

// Create a new game
const createGame = async (req, res) => {
    try {
        const gameItem = await Game.create(req.body);

        res.status(201).json({
            success: true,
            data: gameItem
        });
    } catch (error) {
        console.error('Error in createGame:', error);
        
        if (error.name === 'ValidationError') {
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

// Update an existing game
const updateGame = async (req, res) => {
    try {
        const gameItem = await Game.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!gameItem) {
            return res.status(404).json({
                success: false,
                message: `Game not found with id ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: gameItem
        });
    } catch (error) {
        console.error('Error in updateGame:', error);
        
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
                message: 'Invalid game ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error while updating the game'
        });
    }
};

// Delete a game
const deleteGame = async (req, res) => {
    try {
        const gameItem = await Game.findByIdAndDelete(req.params.id);

        if (!gameItem) {
            return res.status(404).json({
                success: false,
                message: `Game not found with id ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Game deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Error in deleteGame:', error);
        
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

module.exports = {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
};