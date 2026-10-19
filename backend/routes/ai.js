const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/hint', authenticate, async (req, res) => {
  const { questionText, options } = req.body;
  if (!questionText || typeof questionText !== 'string' || !questionText.trim()) {
    return res.status(400).json({ error: 'Missing or invalid required field: questionText must be a non-empty string' });
  }

  if (questionText.length > 4000) {
    return res.status(400).json({ error: 'Payload too large: questionText exceeds 4000 character limit' });
  }

  try {
    const userId = req.user.id;
    let user = null;
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      try {
        user = (await User.findById(userId)) || (await User.findOne({ username: req.user.username }));
      } catch (e) {}
    }
    if (!user) {
      const storage = require('../services/storage');
      user = storage.findUserById(userId) || storage.findUserByUsername(req.user.username);
    }
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if user has enough XP (costs 50 XP, grandfather users with xp undefined)
    const currentXp = user.xp !== undefined ? user.xp : 100;
    if (currentXp < 50) {
      return res.status(403).json({ error: 'Not enough XP. Need at least 50 XP.' });
    }

    // Call LLM for a hint
    const prompt = `You are a subtle coding tutor. The student is stuck on this question:\n\nQuestion: "${questionText.slice(0, 1000)}"\nOptions: ${JSON.stringify(options || []).slice(0, 500)}\n\nProvide a concise, helpful hint in 1-2 sentences. Do NOT give away the direct answer. Just nudge them in the right direction.`;

    let hint = "Think about the time complexity or standard design patterns that fit this scenario."; // Fallback

    if (process.env.OPENROUTER_API_KEY) {
      try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
          model: 'openrouter/free',
          messages: [{ role: 'user', content: prompt }]
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });
        if (response.data.choices?.[0]?.message?.content) {
          hint = response.data.choices[0].message.content;
        }
      } catch (orErr) {
        console.warn("OpenRouter hint attempt failed, checking fallback:", orErr.message);
      }
    } else if (process.env.GEMINI_API_KEY || process.env.Gemini_API_KEY) {
      // Alternate fallback if they decide to use native Gemini SDK
      try {
        const { GoogleGenAI } = require('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.Gemini_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt
        });
        if (response.text) hint = response.text;
      } catch (gemErr) {
        console.warn("Gemini hint attempt failed:", gemErr.message);
      }
    }

    // Deduct XP
    user.xp -= 50;
    await user.save();

    res.json({ success: true, hint, newXp: user.xp });
  } catch (error) {
    console.error("AI Hint Error:", error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

module.exports = router;
