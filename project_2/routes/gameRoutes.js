// routes/gameRoutes.js
// Game API endpoints

const express = require('express');
const router = express.Router();
const {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
} = require('../controllers/gameController');
const { isAuthenticated, optionalAuth } = require('../middleware/authMiddleware');

// /api/games
router.route('/')
    .get(optionalAuth, getAllGames)
    .post(isAuthenticated, createGame);

// /api/games/:id
router.route('/:id')
    .get(optionalAuth, getGameById)
    .put(isAuthenticated, updateGame)
    .delete(isAuthenticated, deleteGame);

module.exports = router;