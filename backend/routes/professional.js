// backend/routes/professional.js
const express = require('express');
const professionalController = require('../controllers/professional');

const router = express.Router();

// GET /professional - returns the professional data
router.get('/', professionalController.getData);

module.exports = router;