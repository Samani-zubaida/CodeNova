const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const jwt = require('jsonwebtoken');
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

router.get('/', authenticate, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = new Progress({ userId: req.user.id });
      await progress.save();
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/update', authenticate, async (req, res) => {
  try {
    const { score, town2Unlocked, town3Unlocked } = req.body;
    let progress = await Progress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = new Progress({ userId: req.user.id });
    }

    if (score) progress.totalScore += score;
    if (town2Unlocked !== undefined) progress.town2Unlocked = town2Unlocked;
    if (town3Unlocked !== undefined) progress.town3Unlocked = town3Unlocked;

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
