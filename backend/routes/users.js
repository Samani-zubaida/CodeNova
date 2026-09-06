const express = require('express');
const User = require('../models/User');
const router = express.Router();

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

  try {
    let user = await User.findOne({ username });
    if (!user) {
      // Create mockup user if not exists for testing
      user = new User({ username, email: `${username}@test.com`, passwordHash: 'mock' });
    }

    const today = getTodayStr();
    const yesterday = getYesterdayStr();

    if (!user.activityLog) user.activityLog = [];
    
    // If already logged today, do nothing
    if (user.activityLog.includes(today)) {
      return res.json({ 
        success: true, 
        message: 'Already logged today', 
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        activityLog: user.activityLog,
        earnedBadges: user.earnedBadges || []
      });
    }

    // Check streak continuation
    if (user.activityLog.includes(yesterday)) {
      user.currentStreak += 1;
    } else {
      user.currentStreak = 1; // Streak broken, restart
    }

    if (user.currentStreak > (user.longestStreak || 0)) {
      user.longestStreak = user.currentStreak;
    }

    user.activityLog.push(today);
    await user.save();

    res.json({ 
      success: true, 
      currentStreak: user.currentStreak, 
      longestStreak: user.longestStreak,
      activityLog: user.activityLog,
      earnedBadges: user.earnedBadges || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile data (including badges and activity)
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      username: user.username,
      xp: user.xp,
      activityLog: user.activityLog || [],
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      earnedBadges: user.earnedBadges || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Award badge
router.post('/award-badge', async (req, res) => {
  const { username, badgeId, badgeName } = req.body;
  if (!username || !badgeId || !badgeName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.earnedBadges) user.earnedBadges = [];

    // Check if already awarded
    const alreadyHas = user.earnedBadges.find(b => b.badgeId === badgeId);
    if (alreadyHas) {
      return res.json({ success: true, message: 'Badge already earned', badges: user.earnedBadges });
    }

    user.earnedBadges.push({ badgeId, name: badgeName });
    await user.save();

    res.json({ success: true, badges: user.earnedBadges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
