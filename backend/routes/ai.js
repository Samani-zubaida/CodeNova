const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const router = express.Router();

router.post('/hint', async (req, res) => {
  const { username, questionText, options } = req.body;
  if (!username || !questionText) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if user has enough XP (costs 50 XP)
    if (user.xp < 50) {
      return res.status(403).json({ error: 'Not enough XP. Need at least 50 XP.' });
    }

    // Call LLM for a hint
    const prompt = `You are a subtle coding tutor. The student is stuck on this question:\n\nQuestion: "${questionText}"\nOptions: ${JSON.stringify(options || [])}\n\nProvide a concise, helpful hint in 1-2 sentences. Do NOT give away the direct answer. Just nudge them in the right direction.`;

    let hint = "Think about the time complexity or standard design patterns that fit this scenario."; // Fallback

    if (process.env.OPENROUTER_API_KEY) {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      hint = response.data.choices[0].message.content;
    } else if (process.env.GEMINI_API_KEY) {
      // Alternate fallback if they decide to use native Gemini SDK
      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      hint = response.text;
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
