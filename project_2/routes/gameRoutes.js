// routes/gameRoutes.js
// Route definitions for game-related API endpoints

const express = require('express');
const router = express.Router();
const {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
} = require('../controllers/gameController');

// Route: /api/games
// GET all games, POST a new game
router.route('/')
    .get(getAllGames)    // GET /api/games - Get all games
    .post(createGame);    // POST /api/games - Create a new game

// Route: /api/games/:id
// GET a specific game by ID, PUT (update) a game, DELETE a game
router.route('/:id')
    .get(getGameById)     // GET /api/games/:id - Get a single  game information
    .put(updateGame)      // PUT /api/games/:id - Update a  game information
    .delete(deleteGame);  // DELETE /api/games/:id - Delete a  game information

module.exports = router;