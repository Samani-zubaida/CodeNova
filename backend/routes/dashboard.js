const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Competition = require('../models/Competition');
const storage = require('../services/storage');
const bcrypt = require('bcryptjs');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Seed script to populate mock data if empty (only when MongoDB is connected)
const seedDatabase = async () => {
  if (!isDbConnected()) return;
  try {
    const compCount = await Competition.countDocuments().maxTimeMS(2000);
    if (compCount === 0) {
      await Competition.insertMany([
        {
          title: 'Global Code-Off 2024',
          dateString: 'May 15-16',
          prizePool: ',000',
          registrations: '1,200/5,000',
          status: 'Active',
          type: 'Global'
        },
        {
          title: 'AI Challenge: Image Recognition',
          dateString: 'June 1',
          difficulty: 'Expert',
          status: 'Upcoming',
          type: 'Challenge'
        },
        {
          title: 'Fastest Coder Series: Python',
          dateString: 'Weekly (Next: Mon)',
          difficulty: 'Leaderboard Qualified',
          status: 'Upcoming',
          type: 'Series'
        }
      ]);
    }

    const userCount = await User.countDocuments().maxTimeMS(2000);
    if (userCount < 5) {
      const hash = await bcrypt.hash('password123', 10);
      await User.insertMany([
        { username: 'aanmirack', email: 'aanmirack@example.com', passwordHash: hash, xp: 62350 },
        { username: 'Christrova', email: 'christrova@example.com', passwordHash: hash, xp: 3128 },
        { username: 'NovaCoder', email: 'novacoder@example.com', passwordHash: hash, xp: 2500 },
        { username: 'ByteMaster', email: 'bytemaster@example.com', passwordHash: hash, xp: 1800 },
        { username: 'AlgoPro', email: 'algopro@example.com', passwordHash: hash, xp: 950 }
      ]);
    }
  } catch (err) {
    // Silent catch
  }
};

// Periodic leaderboard simulation (only when connected)
setInterval(async () => {
  if (!isDbConnected()) return;
  try {
    const users = await User.find({}).maxTimeMS(2000);
    for (const user of users) {
      if (Math.random() > 0.6) {
        user.xp += Math.floor(Math.random() * 50);
        await user.save();
      }
    }
  } catch (err) {}
}, 10000);

// Fire the seed async when connection is ready
mongoose.connection.on('connected', () => {
  seedDatabase();
});

// GET /api/dashboard/leaderboard
router.get('/leaderboard', async (req, res) => {
  if (isDbConnected()) {
    try {
      const topUsers = await User.find({}).sort({ xp: -1 }).limit(10).select('username xp').maxTimeMS(2000);
      if (topUsers && topUsers.length > 0) {
        return res.json(topUsers);
      }
    } catch (err) {
      console.warn('[Leaderboard] MongoDB error, using fallback:', err.message);
    }
  }

  // Fallback to storage
  const users = storage.getAllUsers().slice(0, 10).map(u => ({
    username: u.username,
    xp: u.xp || 0
  }));
  return res.json(users);
});

// GET /api/dashboard/competitions
router.get('/competitions', async (req, res) => {
  if (isDbConnected()) {
    try {
      const competitions = await Competition.find({}).maxTimeMS(2000);
      const now = new Date();
      const updatedCompetitions = competitions.map(comp => {
        if (comp.type === 'Hosted' && comp.startTime) {
          if (now >= comp.startTime && now <= comp.endTime) comp.status = 'Active';
          else if (now > comp.endTime) comp.status = 'Completed';
          else comp.status = 'Upcoming';
        }
        return comp;
      });
      return res.json(updatedCompetitions);
    } catch (err) {
      console.warn('[Competitions] MongoDB error, using fallback:', err.message);
    }
  }

  // Fallback to storage
  const comps = storage.getCompetitions();
  return res.json(comps);
});

module.exports = router;
