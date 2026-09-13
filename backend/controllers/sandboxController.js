const axios = require('axios');

// Execute code via JDoodle API
exports.executeCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    const clientId = process.env.JDOODLE_CLIENT_ID;
    const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        message: 'Missing JDoodle credentials in backend .env file',
        error: 'Please add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to your .env file.'
      });
    }

    const jdoodleLanguages = {
      javascript: { language: 'nodejs', versionIndex: '4' },
      python: { language: 'python3', versionIndex: '4' },
      cpp: { language: 'cpp17', versionIndex: '0' },
      java: { language: 'java', versionIndex: '4' }
    };

    const jConfig = jdoodleLanguages[language];

    if (!jConfig) {
      return res.status(400).json({
        message: 'Unsupported language'
      });
    }

    const response = await axios.post(
      'https://api.jdoodle.com/v1/execute',
      {
        script: code,
        language: jConfig.language,
        versionIndex: jConfig.versionIndex,
        clientId,
        clientSecret
      }
    );

    const data = response.data;

    res.json({
      language,
      run: {
        stdout: data.output || '',
        stderr: data.error || '',
        code: data.statusCode === 200 ? 0 : 1
      }
    });

  } catch (error) {
    console.error(
      'Execution error:',
      error.response?.data || error.message
    );

    res.status(500).json({
      message: 'Failed to execute code',
      error: error.response?.data?.error || error.message
    });
  }
};


// Analyze code using native Gemini API
exports.visualizeCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!process.env.Gemini_API_KEY) {
      return res.status(500).json({ message: 'Missing Gemini_API_KEY in .env file' });
    }

    const prompt = `
You are an expert Code Analyst. Analyze the provided ${language} code.

Your response MUST be a pure JSON object. DO NOT wrap it in markdown formatting like \`\`\`json. 
Return ONLY the JSON object.

The JSON object must contain exactly these keys:
- "timeComplexity": A string representing the Big O time complexity (e.g., "O(N)", "O(N log N)", "O(1)").
- "timeExplanation": A brief explanation (1-3 sentences) of how the time complexity was determined.
- "spaceComplexity": A string representing the Big O space complexity (e.g., "O(1)", "O(N)").
- "spaceExplanation": A brief explanation (1-3 sentences) of why the space complexity is what it is.
- "dataStructures": An array of strings listing the primary data structures used in the code (e.g., ["Array", "Hash Map", "Stack"]).
- "generalAnalysis": A brief summary (2-4 sentences) explaining what the code does overall.

IMPORTANT: You MUST wrap your final JSON object inside <json_result> and </json_result> tags.

<json_result>
{
  "timeComplexity": "O(N)",
  "timeExplanation": "The function contains a single loop that iterates over the array of size N, resulting in linear time complexity.",
  "spaceComplexity": "O(1)",
  "spaceExplanation": "The algorithm uses a constant amount of extra space for the two pointer variables regardless of the input size.",
  "dataStructures": ["Array", "Two Pointers"],
  "generalAnalysis": "This code implements an in-place array reversal algorithm. It uses a two-pointer approach, starting from the ends and moving towards the center, swapping elements."
}
</json_result>

\`\`\`${language}
${code}
\`\`\`
`;

    const startedAt = Date.now();
    console.log(`[analyze] calling native Gemini API...`);

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.Gemini_API_KEY}`, {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 70000
    });

    console.log(`[analyze] success with Gemini in ${Date.now() - startedAt}ms`);

    let content = (response.data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();

    // Extract JSON using XML tags
    const tagStart = '<json_result>';
    const tagEnd = '</json_result>';
    const startIndex = content.indexOf(tagStart);

    if (startIndex !== -1) {
      let endIndex = content.lastIndexOf(tagEnd);
      if (endIndex === -1) endIndex = content.length; // Handle cut off
      content = content.substring(startIndex + tagStart.length, endIndex).trim();
    } else {
      // Fallback if model forgot tags
      const bracketStart = content.indexOf('{');
      if (bracketStart !== -1) {
        let bracketEnd = content.lastIndexOf('}');
        if (bracketEnd === -1) bracketEnd = content.length;
        content = content.substring(bracketStart, bracketEnd === content.length ? content.length : bracketEnd + 1);
      }
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseErr) {
      console.error('[analyze] JSON.parse failed, raw content was:', content);
      throw new Error('Model returned invalid JSON format.');
    }

    res.json({ analysis: parsed });

  } catch (error) {
    console.error('Analysis error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to analyze code', error: error.response?.data || error.message });
  }
};