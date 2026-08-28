const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Competition = require('../models/Competition');
const bcrypt = require('bcryptjs');

// Seed script to populate mock data if empty
const seedDatabase = async () => {
  try {
    const compCount = await Competition.countDocuments();
    if (compCount === 0) {
      await Competition.insertMany([
        {
          title: 'Global Code-Off 2024',
          dateString: 'May 15-16',
          prizePool: '$10,000',
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
      console.log("Seeded default competitions.");
    }

    const userCount = await User.countDocuments();
    if (userCount < 5) {
      const hash = await bcrypt.hash('password123', 10);
      await User.insertMany([
        { username: 'aanmirack', email: 'aanmirack@example.com', passwordHash: hash, xp: 62350 },
        { username: 'Christrova', email: 'christrova@example.com', passwordHash: hash, xp: 3128 },
        { username: 'NovaCoder', email: 'novacoder@example.com', passwordHash: hash, xp: 2500 },
        { username: 'ByteMaster', email: 'bytemaster@example.com', passwordHash: hash, xp: 1800 },
        { username: 'AlgoPro', email: 'algopro@example.com', passwordHash: hash, xp: 950 }
      ]);
      console.log("Seeded default users for leaderboard.");
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  }
};

// Fire the seed async (doesn't block)
seedDatabase();

// GET /api/dashboard/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({}).sort({ xp: -1 }).limit(10).select('username xp');
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
});

// GET /api/dashboard/competitions
router.get('/competitions', async (req, res) => {
  try {
    const competitions = await Competition.find({});
    const now = new Date();
    const updatedCompetitions = competitions.map(comp => {
      if (comp.type === "Hosted" && comp.startTime) {
        if (now >= comp.startTime && now <= comp.endTime) comp.status = "Active";
        else if (now > comp.endTime) comp.status = "Completed";
        else comp.status = "Upcoming";
      }
      return comp;
    });
    res.json(updatedCompetitions);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching competitions' });
  }
});

module.exports = router;

