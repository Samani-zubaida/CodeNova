const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Progress = require('../models/Progress');
const storage = require('../services/storage');

const JWT_SECRET = process.env.JWT_SECRET || 'algoverse_super_secret_jwt_key_2026';
const isDbConnected = () => mongoose.connection.readyState === 1;

const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate, async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        let progress = await Progress.findOne({ userId: req.user.id }).maxTimeMS(2000);
        if (!progress) {
          progress = new Progress({ userId: req.user.id });
          await progress.save();
        }
        return res.json(progress);
      } catch (dbErr) {
        console.warn('[Progress GET] MongoDB error, switching to local store:', dbErr.message);
      }
    }

    const localProg = storage.getProgress(req.user.id);
    return res.json(localProg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/update', authenticate, async (req, res) => {
  try {
    const { score, town2Unlocked, town3Unlocked } = req.body;

    if (score !== undefined && (typeof score !== 'number' || score < 0 || !Number.isFinite(score))) {
      return res.status(400).json({ message: 'Invalid score: must be a non-negative finite number' });
    }
    if (town2Unlocked !== undefined && typeof town2Unlocked !== 'boolean') {
      return res.status(400).json({ message: 'Invalid town2Unlocked: must be a boolean' });
    }
    if (town3Unlocked !== undefined && typeof town3Unlocked !== 'boolean') {
      return res.status(400).json({ message: 'Invalid town3Unlocked: must be a boolean' });
    }
    
    if (isDbConnected()) {
      try {
        let progress = await Progress.findOne({ userId: req.user.id }).maxTimeMS(2000);
        if (!progress) {
          progress = new Progress({ userId: req.user.id });
        }

        if (score) progress.totalScore += score;
        if (town2Unlocked !== undefined) progress.town2Unlocked = town2Unlocked;
        if (town3Unlocked !== undefined) progress.town3Unlocked = town3Unlocked;

        await progress.save();
        return res.json(progress);
      } catch (dbErr) {
        console.warn('[Progress Update] MongoDB error, switching to local store:', dbErr.message);
      }
    }

    const updates = {};
    if (score) {
      const current = storage.getProgress(req.user.id);
      updates.totalScore = (current.totalScore || 0) + score;
    }
    if (town2Unlocked !== undefined) updates.town2Unlocked = town2Unlocked;
    if (town3Unlocked !== undefined) updates.town3Unlocked = town3Unlocked;

    const updated = storage.updateProgress(req.user.id, updates);
    return res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
