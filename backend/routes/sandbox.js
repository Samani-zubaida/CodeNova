const express = require('express');
const router = express.Router();
const axios = require('axios');

// Execute code via JDoodle API
router.post('/execute', async (req, res) => {
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
});


// Visualize code using OpenRouter API
router.post('/visualize', async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ message: 'Missing OPENROUTER_API_KEY in .env file' });
    }

    const prompt = `
Analyze the provided ${language} code step-by-step as it executes, tracing actual runtime behavior (use reasonable sample input if the code doesn't already define one).

This code may implement ANY data structure or algorithm — arrays, strings, linked lists, stacks, queues, hash maps, binary search, sorting, trees (binary trees, BSTs, tries, heaps), graphs (adjacency list/matrix), BFS, DFS, dynamic programming (tabulation or memoization), backtracking, recursion, greedy, two-pointer, or sliding window. Trace whichever of these actually appear in the code, using these conventions for "state" so the visualization is meaningful:

- Arrays / strings: show the full array/string each step, and call out the active index or pointer(s) (e.g. "i": 3, "left": 0, "right": 6).
- Linked lists: show node values as an ordered list in traversal order, and the current pointer (e.g. "current node").
- Stacks / queues: show current contents as an ordered list (top/front first), labeled clearly.
- Trees: show the current node's value, and the relevant traversal/recursion path so far (e.g. ["root","left","left.right"]).
- Graphs: show the adjacency structure once, then per-step show the current node, the visited set, and the frontier (queue for BFS / stack or call stack for DFS).
- Dynamic programming: show the relevant slice of the DP table/array as it's filled in each step, not just the final value — this is the most important thing to visualize for DP.
- Recursion / backtracking: show the current call's arguments and the effective call-stack depth or path.
- Hash maps / sets: show current key-value pairs or elements relevant to that step.

General rules:
- Cap at 12 key execution steps — this is a hard limit, not a target, because output length is constrained. Prioritize steps that change the core data structure (a swap, a visit, a DP cell fill, a push/pop, a comparison result) over steps that don't (e.g. skip trivial variable increments if they don't affect the structure being visualized).
- For loops/recursion over many elements, sample representative iterations (first couple, one middle, last couple) rather than every single one, but never skip the step where the final result is produced.
- Keep every state value SHORT. If an array, DP table, or adjacency list has more than 8 elements/cells, show only the relevant window (e.g. the row/cell just filled plus its direct dependencies) rather than the whole structure, and note truncation with "...". Never dump a full large structure into one state value.
- Keep all state values as compact strings (stringify arrays/objects, e.g. "[1, 2, 3]" or "{0: 'A', 2: 'B'}"). Do not add commentary inside state values.
- The entire response must be valid, complete, parseable JSON — always finish the array with a closing "]". Do not run out of room mid-object.

You MUST return ONLY a valid JSON array where each object represents a step in execution.
DO NOT wrap the response in markdown blocks like \`\`\`json. Return pure JSON only.

The JSON array must contain objects with exactly these keys:
- "line": The integer line number being executed
- "action": A short string description of what this line does
- "state": A dictionary object representing variable/structure names as keys and their current values as strings, following the conventions above

Code to analyze:
\`\`\`${language}
${code}
\`\`\`
`;

    // NOTE: OpenRouter's free-tier lineup rotates frequently — models get
    // added/removed without notice, which is why hardcoded IDs eventually
    // 404. 'openrouter/free' is OpenRouter's own auto-router that picks a
    // currently-live free model, so it's listed first as the most durable
    // option. The rest are fallbacks in case the auto-router itself has issues.
    const freeModels = [
      'openrouter/free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'qwen/qwen3-coder:free',
      'deepseek/deepseek-chat-v3-0324:free',
      'google/gemma-2-9b-it:free'
    ];

    let response;
    let success = false;
    let lastError = null;

    for (const model of freeModels) {
      const startedAt = Date.now();
      console.log(`[visualize] trying model: ${model}`);
      try {
        response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
          model: model,
          messages: [
            { role: 'user', content: prompt }
          ],
          // Reasoning models otherwise burn many seconds "thinking" before
          // answering, which is what makes this feel hung. We don't need
          // chain-of-thought for a JSON extraction task, so turn it off.
          reasoning: { enabled: false },
          // Keep generation bounded so a verbose model can't run long.
          max_tokens: 4096,
          temperature: 0.2
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Code Nova Sandbox'
          },
          timeout: 20000
        });

        success = true;
        console.log(`[visualize] success with ${model} in ${Date.now() - startedAt}ms`);
        break; // Request succeeded
      } catch (err) {
        lastError = err;
        const status = err.response?.status;
        const isTimeout = err.code === 'ECONNABORTED';
        console.warn(
          `[visualize] model ${model} failed after ${Date.now() - startedAt}ms ` +
          `(status=${status ?? 'n/a'}${isTimeout ? ', timeout' : ''}): ` +
          `${err.response?.data ? JSON.stringify(err.response.data) : err.message}`
        );

        // 429: rate limited, 404: model unavailable/renamed, 5xx: upstream
        // issue, timeout: model took too long — all worth trying the next model for.
        if (status === 429 || status === 404 || status >= 500 || isTimeout) {
          if (status === 429) {
            await new Promise(r => setTimeout(r, 1500)); // brief backoff
          }
          continue;
        }
        break; // Auth error (401) or bad request (400) — retrying won't help
      }
    }

    if (!success) {
      throw lastError;
    }

    const finishReason = response.data.choices?.[0]?.finish_reason;
    if (finishReason === 'length') {
      console.warn('[visualize] response was cut off by max_tokens (finish_reason=length) — will attempt to salvage complete steps');
    }

    let content = response.data.choices[0].message.content.trim();

    // Strip markdown formatting if the model accidentally included it
    if (content.startsWith('```json')) {
      content = content.substring(7);
    } else if (content.startsWith('```')) {
      content = content.substring(3);
    }
    if (content.endsWith('```')) {
      content = content.substring(0, content.length - 3);
    }
    content = content.trim();

    let steps;
    try {
      steps = JSON.parse(content);
    } catch (parseErr) {
      console.warn(`[visualize] JSON.parse failed (${parseErr.message}) — attempting to repair truncated response`);
      try {
        steps = repairTruncatedStepsArray(content);
        console.warn(`[visualize] repaired truncated response — recovered ${steps.length} of the generated steps`);
      } catch (repairErr) {
        console.error('[visualize] repair failed, raw content was:', content.slice(0, 500));
        throw new Error(
          `Model returned invalid or truncated JSON and it could not be repaired (${parseErr.message}). ` +
          `Try again, or simplify/shorten the code being visualized.`
        );
      }
    }

    res.json({ steps, truncated: finishReason === 'length' });

  } catch (error) {
    console.error('Visualization error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to generate visual steps', error: error.response?.data || error.message });
  }
});

/**
 * Attempts to salvage a valid array of step objects from a JSON response
 * that got cut off mid-generation (e.g. due to hitting max_tokens).
 * Scans for the last position where a complete top-level object in the
 * array closed, truncates there, and closes the array.
 */
function repairTruncatedStepsArray(raw) {
  let str = raw.trim();
  const start = str.indexOf('[');
  if (start === -1) {
    throw new Error('No JSON array found in response');
  }
  str = str.slice(start);

  let depth = 0;
  let inString = false;
  let escape = false;
  let lastCompleteEnd = -1;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{' || ch === '[') {
      depth++;
    } else if (ch === '}' || ch === ']') {
      depth--;
      // depth === 1 means we're back to just inside the outer array —
      // i.e. we just closed a complete top-level step object.
      if (depth === 1 && ch === '}') {
        lastCompleteEnd = i;
      }
    }
  }

  if (lastCompleteEnd === -1) {
    throw new Error('Could not find any complete step object to salvage');
  }

  const salvaged = str.slice(0, lastCompleteEnd + 1) + ']';
  return JSON.parse(salvaged);
}

module.exports = router;
