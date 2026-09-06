const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate, progressController.getProgress);
router.post('/update', authenticate, progressController.updateProgress);

module.exports = router;
