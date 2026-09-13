const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const storage = require('../services/storage');
const router = express.Router();

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to get YYYY-MM-DD
const getTodayStr = () => new Date().toISOString().split('T')[0];
const getYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

// Record daily activity
router.post('/record-activity', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  if (isDbConnected()) {
    try {
      let user = await User.findOne({ username }).maxTimeMS(2000);
      if (!user) {
        user = new User({ username, email: username.toLowerCase() + '@local.dev', passwordHash: 'mock' });
      }

      const today = getTodayStr();
      const yesterday = getYesterdayStr();

      if (!user.activityLog) user.activityLog = [];
      
      if (user.activityLog.includes(today)) {
        return res.json({ 
          success: true, 
          message: 'Already logged today', 
          currentStreak: user.currentStreak || 1,
          longestStreak: user.longestStreak || 1,
          activityLog: user.activityLog,
          earnedBadges: user.earnedBadges || []
        });
      }

      if (user.activityLog.includes(yesterday)) {
        user.currentStreak = (user.currentStreak || 0) + 1;
      } else {
        user.currentStreak = 1;
      }

      if (user.currentStreak > (user.longestStreak || 0)) {
        user.longestStreak = user.currentStreak;
      }

      user.activityLog.push(today);
      await user.save();

      return res.json({ 
        success: true, 
        currentStreak: user.currentStreak, 
        longestStreak: user.longestStreak,
        activityLog: user.activityLog,
        earnedBadges: user.earnedBadges || []
      });
    } catch (error) {
      console.warn('[Users record-activity] MongoDB error, switching to local store:', error.message);
    }
  }

  // Local storage fallback
  const result = storage.recordActivity(username);
  return res.json(result);
});

// Get user profile data (including badges and activity)
router.get('/:username', async (req, res) => {
  const { username } = req.params;

  if (isDbConnected()) {
    try {
      const user = await User.findOne({ username }).maxTimeMS(2000);
      if (user) {
        return res.json({
          username: user.username,
          xp: user.xp || 0,
          activityLog: user.activityLog || [],
          currentStreak: user.currentStreak || 0,
          longestStreak: user.longestStreak || 0,
          earnedBadges: user.earnedBadges || []
        });
      }
    } catch (err) {
      console.warn('[Users GET] MongoDB error, checking local store:', err.message);
    }
  }

  // Local storage fallback
  const localUser = storage.findUserByUsername(username);
  if (localUser) {
    return res.json({
      username: localUser.username,
      xp: localUser.xp || 0,
      activityLog: localUser.activityLog || [],
      currentStreak: localUser.currentStreak || 0,
      longestStreak: localUser.longestStreak || 0,
      earnedBadges: localUser.earnedBadges || []
    });
  }

  return res.status(404).json({ error: 'User not found' });
});

// Award badge
router.post('/award-badge', async (req, res) => {
  const { username, badgeId, badgeName } = req.body;
  if (!username || !badgeId || !badgeName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (isDbConnected()) {
    try {
      const user = await User.findOne({ username }).maxTimeMS(2000);
      if (user) {
        if (!user.earnedBadges) user.earnedBadges = [];
        const alreadyHas = user.earnedBadges.find(b => b.badgeId === badgeId);
        if (alreadyHas) {
          return res.json({ success: true, message: 'Badge already earned', badges: user.earnedBadges });
        }

        user.earnedBadges.push({ badgeId, name: badgeName, awardedAt: new Date() });
        await user.save();
        return res.json({ success: true, badges: user.earnedBadges });
      }
    } catch (error) {
      console.warn('[Users award-badge] MongoDB error, checking local store:', error.message);
    }
  }

  // Local storage fallback
  const result = storage.awardBadge(username, badgeId, badgeName);
  if (result) {
    return res.json(result);
  }

  return res.status(404).json({ error: 'User not found' });
});

module.exports = router;
