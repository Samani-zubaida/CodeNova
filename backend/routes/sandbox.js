const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Execute code via JDoodle API
router.post('/execute', async (req, res) => {
  try {
    const { language, code } = req.body;
    
    // Check for JDoodle credentials
    const clientId = process.env.JDOODLE_CLIENT_ID;
    const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ 
        message: 'Missing JDoodle credentials in backend .env file',
        error: 'Please add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to your .env file.'
      });
    }
    
    // Map our languages to JDoodle language codes and versions
    const jdoodleLanguages = {
      javascript: { language: 'nodejs', versionIndex: '4' },
      python: { language: 'python3', versionIndex: '4' },
      cpp: { language: 'cpp17', versionIndex: '0' },
      java: { language: 'java', versionIndex: '4' }
    };

    const jConfig = jdoodleLanguages[language];
    if (!jConfig) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    // Call JDoodle API
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      script: code,
      language: jConfig.language,
      versionIndex: jConfig.versionIndex,
      clientId: clientId,
      clientSecret: clientSecret
    });

    const data = response.data;

    // JDoodle returns 'output' and 'statusCode'
    // A statusCode of 200 means API call success, but code could have a syntax error
    // We treat it as successful execution if there's output, and map it for our frontend
    res.json({
      language: language,
      run: {
        stdout: data.output || '',
        stderr: data.error || '', // JDoodle usually puts compilation errors in 'output', but just in case
        code: data.statusCode === 200 ? 0 : 1
      }
    });

  } catch (error) {
    console.error('Execution error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to execute code', error: error.response?.data?.error || error.message });
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
