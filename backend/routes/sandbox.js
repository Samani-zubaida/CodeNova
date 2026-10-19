const express = require('express');
const router = express.Router();
const sandboxController = require('../controllers/sandboxController');
const authenticate = require('../middleware/authMiddleware');

// Execute code via JDoodle API (Protected)
router.post('/execute', authenticate, sandboxController.executeCode);

// Visualize code using native Gemini API (Protected)
router.post('/visualize', authenticate, sandboxController.visualizeCode);

module.exports = router;