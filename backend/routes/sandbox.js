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

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
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

// Visualize code using Mock API (Bypassing Gemini)
router.post('/visualize', async (req, res) => {
  try {
    const { language, code } = req.body;

    // We simulate a slight network delay to make it feel real
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return a mock response that matches what the frontend expects
    const steps = [
      { line: 1, action: "Initializing program", state: { message: "Starting execution" } },
      { line: 2, action: "Parsing variables", state: { step: "Parsing" } },
      { line: 3, action: "Executing main logic", state: { status: "Running" } },
      { line: 4, action: "Program finished", state: { result: "Success" } }
    ];

    res.json({ steps });
  } catch (error) {
    console.error('Visualization error:', error);
    res.status(500).json({ message: 'Failed to generate visual steps' });
  }
});

module.exports = router;
