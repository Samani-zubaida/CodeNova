const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Execute code via Piston API
router.post('/execute', async (req, res) => {
  try {
    const { language, code } = req.body;
    
    // Map our languages to Piston versions
    const languageVersions = {
      javascript: { language: 'javascript', version: '18.15.0' },
      python: { language: 'python', version: '3.10.0' },
      cpp: { language: 'c++', version: '10.2.0' },
      java: { language: 'java', version: '15.0.2' }
    };

    const pistonConfig = languageVersions[language];
    if (!pistonConfig) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    const response = await axios.post('https://emacs.piston.rs/api/v2/execute', {
      language: pistonConfig.language,
      version: pistonConfig.version,
      files: [{ content: code }]
    });

    res.json(response.data);
  } catch (error) {
    console.error('Execution error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to execute code' });
  }
});

// Visualize code using Gemini API
router.post('/visualize', async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is missing from backend configuration.' });
    }

    const prompt = `Analyze the following ${language} code.
    Return a valid JSON array where each object represents a step in execution.
    Include the line number, the action taking place, and any variable states changed.
    Do NOT return markdown formatting like \`\`\`json. Return ONLY raw JSON.

    Code to analyze:
    ${code}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const outputText = response.text;
    let steps = [];
    try {
      steps = JSON.parse(outputText);
    } catch (parseErr) {
      // Fallback clean if there's markdown wrappers
      const clean = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
      steps = JSON.parse(clean);
    }

    res.json({ steps });
  } catch (error) {
    console.error('Visualization error:', error);
    res.status(500).json({ message: 'Failed to generate visual steps' });
  }
});

module.exports = router;
