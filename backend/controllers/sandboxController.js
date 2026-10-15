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


// Static deterministic analyzer fallback in case AI APIs are unreachable/unconfigured
function generateStaticAnalysis(code, language) {
  const cleanCode = code || '';
  const lines = cleanCode.split('\n');

  // Detect data structures
  const dsSet = new Set();
  if (/(\[|\bArray\b|\bArrayList\b|\bvector\b|\blist\()/i.test(cleanCode)) dsSet.add('Array');
  if (/(\bMap\b|\bHashMap\b|\bdict\b|\bunordered_map\b|\{\s*["'\w]+\s*:)/i.test(cleanCode)) dsSet.add('Hash Map');
  if (/(\bSet\b|\bHashSet\b|\bunordered_set\b)/i.test(cleanCode)) dsSet.add('Set');
  if (/(\bStack\b|\.push\(|\.pop\()/i.test(cleanCode)) dsSet.add('Stack');
  if (/(\bQueue\b|\bdeque\b|\.shift\(|\bunshift\()/i.test(cleanCode)) dsSet.add('Queue');
  if (/(\bListNode\b|\bLinkedList\b|\bNode\b|\.next\b)/i.test(cleanCode)) dsSet.add('Linked List');
  if (/(\bTreeNode\b|\.left\b|\.right\b|\bTree\b)/i.test(cleanCode)) dsSet.add('Binary Tree');
  if (/(\bleft\b|\bright\b|\bstart\b|\bend\b|\blow\b|\bhigh\b)/i.test(cleanCode)) dsSet.add('Two Pointers');

  const dataStructures = Array.from(dsSet);
  if (dataStructures.length === 0) dataStructures.push('Primitive Variables');

  // Loop & nesting analysis
  let maxLoopNesting = 0;
  let currentLoopNesting = 0;
  let hasLogStep = false;
  let hasSort = false;
  let hasRecursion = false;

  if (/(\.sort\(|\bArrays\.sort\b|\bstd::sort\b|\bsorted\()/i.test(cleanCode)) {
    hasSort = true;
  }

  if (/(\/=\s*2|\*=\s*2|>>=\s*1|Math\.floor\s*\([^)]*\/|mid\s*=|mid\s*\+)/i.test(cleanCode)) {
    hasLogStep = true;
  }

  const loopRegex = /\b(for\s*\(|while\s*\(|for\s+[a-zA-Z0-9_]+\s+in|for\s+[a-zA-Z0-9_]+\s+of|\.forEach\(|\.map\()/;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (loopRegex.test(line)) {
      currentLoopNesting++;
      if (currentLoopNesting > maxLoopNesting) {
        maxLoopNesting = currentLoopNesting;
      }
    }
    const closeBraces = (line.match(/\}/g) || []).length;
    const openBraces = (line.match(/\{/g) || []).length;
    if (closeBraces > openBraces && currentLoopNesting > 0) {
      currentLoopNesting = Math.max(0, currentLoopNesting - (closeBraces - openBraces));
    }
  }

  const fnMatch = cleanCode.match(/(?:function\s+([a-zA-Z0-9_]+)|(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>)|def\s+([a-zA-Z0-9_]+))/);
  const fnName = fnMatch ? (fnMatch[1] || fnMatch[2] || fnMatch[3]) : null;
  if (fnName && new RegExp(`\\b${fnName}\\s*\\(`, 'g').test(cleanCode.slice(cleanCode.indexOf(fnName) + fnName.length + 10))) {
    hasRecursion = true;
  }

  let timeComplexity = "O(1)";
  let timeExplanation = "The code executes in constant time with sequential operations and no iterative loops.";

  if (hasRecursion) {
    if (hasLogStep) {
      timeComplexity = "O(log N)";
      timeExplanation = "Recursive divide-and-conquer strategy repeatedly halves the input domain at each step.";
    } else if (hasSort) {
      timeComplexity = "O(N log N)";
      timeExplanation = "Recursive partitioning combined with sorting operations operates in linearithmic time.";
    } else {
      timeComplexity = "O(N)";
      timeExplanation = "Linear recursive function depth scales directly with the input size N.";
    }
  } else if (hasSort && maxLoopNesting === 0) {
    timeComplexity = "O(N log N)";
    timeExplanation = "Comparison-based sorting algorithm executes in O(N log N) average and worst-case time.";
  } else if (maxLoopNesting === 1) {
    if (hasLogStep) {
      timeComplexity = "O(log N)";
      timeExplanation = "Loop step counter halves/multiplies the search window, running in logarithmic time.";
    } else if (hasSort) {
      timeComplexity = "O(N log N)";
      timeExplanation = "Linear pass containing sorting operations results in linearithmic time complexity.";
    } else {
      timeComplexity = "O(N)";
      timeExplanation = "Single loop iterates through input elements once, giving linear time complexity.";
    }
  } else if (maxLoopNesting === 2) {
    timeComplexity = "O(N^2)";
    timeExplanation = "Two nested iterative loops iterate over the data, resulting in quadratic time complexity.";
  } else if (maxLoopNesting >= 3) {
    timeComplexity = `O(N^${maxLoopNesting})`;
    timeExplanation = `${maxLoopNesting} nested iterative loops execute in polynomial time.`;
  }

  let spaceComplexity = "O(1)";
  let spaceExplanation = "Operates in-place using a fixed number of scalar variables and pointers.";

  const hasArrayAlloc = /(new\s+Array|\[\s*\]|new\s+ArrayList|new\s+vector|\.push\(|\.append\(|new\s+HashMap|new\s+Map)/i.test(cleanCode);
  const hasMatrixAlloc = /(new\s+Array\([^)]*\)\.map|\[\s*\[)/i.test(cleanCode);

  if (hasMatrixAlloc) {
    spaceComplexity = "O(N^2)";
    spaceExplanation = "Allocates a 2D matrix or nested tables requiring quadratic auxiliary memory.";
  } else if (hasArrayAlloc || hasRecursion) {
    spaceComplexity = "O(N)";
    spaceExplanation = hasRecursion
      ? "Call stack frames accumulate proportional to recursive invocation depth."
      : "Dynamic collection allocation scales linearly with input size N.";
  }

  let generalAnalysis = `This ${language || 'code'} routine executes in ${timeComplexity} time with ${spaceComplexity} memory usage. Primary data structures utilized include ${dataStructures.slice(0, 3).join(', ')}.`;

  return {
    timeComplexity,
    timeExplanation,
    spaceComplexity,
    spaceExplanation,
    dataStructures,
    generalAnalysis
  };
}

// Clean and extract valid JSON from raw LLM output
function extractAndParseJSON(text) {
  if (!text) return null;
  let cleaned = text.trim();

  // Strip markdown formatting if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  }

  // Check for XML wrapper tags
  const tagStart = '<json_result>';
  const tagEnd = '</json_result>';
  if (cleaned.includes(tagStart)) {
    const startIdx = cleaned.indexOf(tagStart) + tagStart.length;
    const endIdx = cleaned.includes(tagEnd) ? cleaned.lastIndexOf(tagEnd) : cleaned.length;
    cleaned = cleaned.substring(startIdx, endIdx).trim();
  }

  // Find outermost braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.timeComplexity && parsed.spaceComplexity) {
      return parsed;
    }
  } catch (e) {
    // Ignore JSON parse error, fall through
  }
  return null;
}

// Multi-provider LLM analyzer (OpenRouter free models -> Native Gemini API)
async function analyzeWithLLM(code, language) {
  const prompt = `You are an expert Code Analyst. Analyze the provided ${language} code.
Return ONLY a valid JSON object matching this schema:
{
  "timeComplexity": "O(N)",
  "timeExplanation": "A brief 1-2 sentence explanation of time complexity.",
  "spaceComplexity": "O(1)",
  "spaceExplanation": "A brief 1-2 sentence explanation of space complexity.",
  "dataStructures": ["Array", "Two Pointers"],
  "generalAnalysis": "A brief 2-3 sentence overview of what the algorithm accomplishes."
}

Code:
\`\`\`${language}
${code}
\`\`\`
`;

  // 1. Try OpenRouter if key is configured
  if (process.env.OPENROUTER_API_KEY) {
    const candidateModels = [
      'openrouter/free',
      'google/gemma-4-31b-it:free',
      'qwen/qwen3.8-27b:free',
      'stealth/space-bunny-alpha'
    ];

    for (const model of candidateModels) {
      try {
        console.log(`[analyze] attempting OpenRouter with model: ${model}...`);
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });

        const text = response.data.choices?.[0]?.message?.content || '';
        const parsed = extractAndParseJSON(text);
        if (parsed) {
          console.log(`[analyze] successfully analyzed code via OpenRouter (${model})`);
          return parsed;
        }
      } catch (err) {
        console.warn(`[analyze] OpenRouter (${model}) attempt failed:`, err.response?.data?.error?.message || err.message);
      }
    }
  }

  // 2. Try native Gemini API if GEMINI_API_KEY is configured
  const geminiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_KEY;
  if (geminiKey) {
    try {
      console.log('[analyze] attempting native Gemini API...');
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = extractAndParseJSON(text);
      if (parsed) {
        console.log('[analyze] successfully analyzed code via native Gemini API');
        return parsed;
      }
    } catch (err) {
      console.warn('[analyze] native Gemini API failed:', err.response?.data || err.message);
    }
  }

  return null;
}

// Analyze code for visual complexity, space, and time breakdowns
exports.visualizeCode = async (req, res) => {
  try {
    const { language = 'javascript', code = '' } = req.body;

    if (!code || !code.trim()) {
      return res.json({
        analysis: {
          timeComplexity: "O(1)",
          timeExplanation: "No executable code provided.",
          spaceComplexity: "O(1)",
          spaceExplanation: "No memory allocated.",
          dataStructures: [],
          generalAnalysis: "Please enter code in the editor to analyze."
        }
      });
    }

    // Try AI models first
    let analysis = await analyzeWithLLM(code, language);

    // If AI is unavailable or fails, use intelligent static analyzer
    if (!analysis) {
      console.log('[analyze] using local static analyzer fallback');
      analysis = generateStaticAnalysis(code, language);
    }

    res.json({ analysis });

  } catch (error) {
    console.error('Analysis error caught, falling back to static analyzer:', error.message);
    const fallback = generateStaticAnalysis(req.body?.code || '', req.body?.language || 'javascript');
    res.json({ analysis: fallback });
  }
};