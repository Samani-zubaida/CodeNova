const express = require('express');
const router = express.Router();
const sandboxController = require('../controllers/sandboxController');

// Execute code via JDoodle API
router.post('/execute', sandboxController.executeCode);

// Visualize code using native Gemini API
router.post('/visualize', sandboxController.visualizeCode);

module.exports = router;