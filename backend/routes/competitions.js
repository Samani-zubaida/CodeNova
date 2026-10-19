const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');
const authenticate = require('../middleware/authMiddleware');

// POST /api/competitions/create (Protected)
router.post('/create', authenticate, async (req, res) => {
  try {
    const { title, hostOrg, startTime, endTime, questions } = req.body;
    
    const newComp = new Competition({
      title,
      hostOrg: hostOrg || req.user.username,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      dateString: new Date(startTime).toLocaleString(),
      type: 'Hosted',
      status: 'Upcoming',
      questions,
      participants: []
    });

    await newComp.save();
    res.status(201).json(newComp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create competition' });
  }
});

// POST /api/competitions/generate-tests (Protected)
router.post('/generate-tests', authenticate, (req, res) => {
  const { description, solution } = req.body;
  
  let mockTestCases = [];
  const descLower = (description || '').toLowerCase();
  if (descLower.includes('array') || descLower.includes('list')) {
    mockTestCases = [
      { input: "[1, 2, 3]", expectedOutput: "6" },
      { input: "[-1, 0, 1]", expectedOutput: "0" },
      { input: "[10, 20, 30, 40]", expectedOutput: "100" }
    ];
  } else if (descLower.includes('string')) {
    mockTestCases = [
      { input: "'hello'", expectedOutput: "'olleh'" },
      { input: "'racecar'", expectedOutput: "'racecar'" },
      { input: "'a'", expectedOutput: "'a'" }
    ];
  } else {
    mockTestCases = [
      { input: "5, 10", expectedOutput: "15" },
      { input: "0, 0", expectedOutput: "0" },
      { input: "-5, 5", expectedOutput: "0" }
    ];
  }

  setTimeout(() => {
    res.json({ testCases: mockTestCases });
  }, 1500);
});

// POST /api/competitions/:id/enroll (Protected)
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const comp = await Competition.findById(req.params.id);
    if (!comp) return res.status(404).json({ error: 'Competition not found' });
    
    comp.enrollmentCount = (comp.enrollmentCount || 0) + 1;
    await comp.save();
    res.json({ success: true, enrollmentCount: comp.enrollmentCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to enroll in competition' });
  }
});

// POST /api/competitions/:id/submit-score (Protected)
router.post('/:id/submit-score', authenticate, async (req, res) => {
  try {
    const { score, timeTakenMs } = req.body;
    if (req.body.username && req.body.username !== req.user.username) {
      return res.status(403).json({ error: 'Forbidden: You cannot submit scores for another user.' });
    }
    const username = req.user.username;
    const comp = await Competition.findById(req.params.id);
    if (!comp) return res.status(404).json({ error: 'Competition not found' });

    comp.participants.push({
      username,
      score,
      timeTakenMs,
      submissionTime: new Date()
    });

    await comp.save();
    res.json({ success: true, message: 'Score submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// GET /api/competitions/:id/leaderboard
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const comp = await Competition.findById(req.params.id);
    if (!comp) return res.status(404).json({ error: 'Competition not found' });

    // Sort participants by score descending, then timeTakenMs ascending (faster is better), then submissionTime ascending
    const sortedParticipants = comp.participants.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeTakenMs && b.timeTakenMs && a.timeTakenMs !== b.timeTakenMs) return a.timeTakenMs - b.timeTakenMs;
      return new Date(a.submissionTime) - new Date(b.submissionTime);
    });

    res.json({
      title: comp.title,
      enrollmentCount: comp.enrollmentCount || 0,
      participants: sortedParticipants
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
