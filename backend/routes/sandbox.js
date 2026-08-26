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
You are a code execution tracing engine for a D3.js algorithm and data-structure visualizer.

Analyze the provided ${language} code and simulate its ACTUAL runtime execution step-by-step.

The code may contain ANY algorithm or data structure, including but not limited to:
- Arrays
- Strings
- Linked Lists
- Doubly Linked Lists
- Circular Linked Lists
- Stacks
- Queues
- Deques
- Priority Queues
- Min Heaps
- Max Heaps
- Hash Maps
- Hash Sets
- Binary Trees
- Binary Search Trees (BST)
- AVL Trees
- Tries
- Graphs
- BFS
- DFS
- Dijkstra
- Bellman-Ford
- Floyd-Warshall
- Topological Sort
- Union Find / DSU
- Sorting algorithms
- Searching algorithms
- Two Pointer
- Sliding Window
- Greedy algorithms
- Dynamic Programming
- Recursion
- Backtracking
- Divide and Conquer
- Any combination of the above

Your output will be consumed directly by a FRONTEND D3.js visualization.
Therefore, every execution step must contain enough structured state information for the frontend to visually reconstruct what is happening.

==================================================
1. EXECUTION SIMULATION
==================================================

Trace the code according to actual execution order.

If the code contains input:
- Use the provided input.

If the code does not contain input:
- Generate a small, reasonable sample input that allows the algorithm to execute meaningfully.

Do NOT invent behavior that the code does not perform.

Track:
- Variable changes
- Data structure changes
- Pointer/reference changes
- Comparisons
- Swaps
- Insertions
- Deletions
- Visits
- Pushes/pops
- Enqueue/dequeue
- Recursive calls/returns
- DP updates
- Heap operations
- Graph traversal
- Final result

==================================================
2. MAXIMUM NUMBER OF STEPS
==================================================

Return AT MOST 12 execution steps.

12 is a HARD LIMIT.

Do NOT generate more than 12 objects.

Prioritize important visualization events over trivial statements.

Prefer steps such as:
- Array swap
- Array comparison
- Pointer movement
- Linked-list pointer change
- Node insertion/deletion
- Stack push/pop
- Queue enqueue/dequeue
- Heap insertion/removal/swapping
- Tree traversal
- Graph node visit
- Graph edge exploration
- DP cell update
- Recursive call
- Backtracking decision
- Final result

Do not waste steps on simple variable declarations unless they are important to understanding the visualization.

If execution contains many iterations:
- Show the first important iterations
- Show representative middle iterations
- Show the final important iteration
- ALWAYS include the step that produces the final result

==================================================
3. STATE REPRESENTATION
==================================================

The "state" object is specifically designed for D3.js visualization.

Every state value MUST be a STRING.

Never place arrays, numbers, booleans, or objects directly inside state.

Examples:

Correct:
"array": "[5, 2, 8, 1]"
"i": "2"
"visited": "{0, 1, 3}"
"queue": "[2, 4, 5]"

Incorrect:
"array": [5, 2, 8, 1]
"i": 2

==================================================
4. ARRAYS
==================================================

For arrays show:
- Current array
- Important indexes/pointers
- Current comparison
- Swapped elements when applicable

Example:

"state": {
  "array": "[5, 2, 8, 1]",
  "i": "0",
  "j": "1",
  "comparing": "[5, 2]"
}

For large arrays (>8 elements):
show only the relevant window and use "...".

==================================================
5. STRINGS
==================================================

Show:
- Current string
- Active index
- left/right pointers
- Current substring when relevant

Example:

"state": {
  "string": "abcdef",
  "left": "1",
  "right": "4",
  "current": "bcde"
}

==================================================
6. LINKED LISTS
==================================================

Represent the list in traversal order.

Example:

"state": {
  "list": "10 -> 20 -> 30 -> 40 -> null",
  "current": "20",
  "previous": "10",
  "next": "30"
}

For reversal:

"state": {
  "list": "10 <- 20 <- 30 <- 40",
  "previous": "20",
  "current": "30",
  "next": "40"
}

Track:
- head
- current
- previous
- next
- inserted node
- deleted node

==================================================
7. DOUBLY LINKED LIST
==================================================

Show both directions when relevant.

Example:

"state": {
  "list": "10 <-> 20 <-> 30",
  "current": "20",
  "previous": "10",
  "next": "30"
}

==================================================
8. CIRCULAR LINKED LIST
==================================================

Clearly indicate the circular connection.

Example:

"state": {
  "list": "10 -> 20 -> 30 -> 10",
  "current": "20"
}

==================================================
9. STACK
==================================================

Represent stack from TOP to BOTTOM.

Example:

"state": {
  "stack": "[30, 20, 10]",
  "top": "30",
  "action": "push"
}

For pop:

"state": {
  "stack": "[20, 10]",
  "popped": "30"
}

==================================================
10. QUEUE
==================================================

Represent queue from FRONT to REAR.

Example:

"state": {
  "queue": "[10, 20, 30]",
  "front": "10",
  "rear": "30"
}

==================================================
11. DEQUE
==================================================

Show elements from FRONT to REAR.

Example:

"state": {
  "deque": "[10, 20, 30]",
  "front": "10",
  "rear": "30"
}

==================================================
12. PRIORITY QUEUE
==================================================

Treat priority queues as a logical data structure.

Show:
- Elements
- Priority
- Current highest/lowest priority element
- Operation being performed

Example:

"state": {
  "priorityQueue": "[(A,1), (B,3), (C,5)]",
  "top": "C",
  "operation": "extract"
}

If implemented using a heap, ALSO show heap state.

==================================================
13. MIN HEAP / MAX HEAP
==================================================

Represent the heap in BOTH useful forms when possible:

1. Array representation
2. Tree relationship

Example:

"state": {
  "heap": "[10, 20, 30, 40, 50]",
  "type": "minHeap",
  "current": "10",
  "parent": "20",
  "children": "[20, 30]"
}

For heapify/swap:

"state": {
  "heap": "[20, 10, 30, 40]",
  "comparing": "[10, 20]",
  "swapped": "true"
}

==================================================
14. HASH MAP
==================================================

Show relevant key-value pairs.

Example:

"state": {
  "map": "{a: 10, b: 20, c: 30}",
  "key": "b",
  "value": "20"
}

Do not dump a huge map.

==================================================
15. HASH SET
==================================================

Example:

"state": {
  "set": "{1, 3, 5}",
  "current": "3"
}

==================================================
16. BINARY TREE
==================================================

Show:
- Current node
- Parent
- Left child
- Right child
- Traversal path

Example:

"state": {
  "current": "10",
  "left": "5",
  "right": "15",
  "path": "[10, 5]"
}

==================================================
17. BST
==================================================

Show the comparison and traversal direction.

Example:

"state": {
  "current": "10",
  "target": "7",
  "comparison": "7 < 10",
  "direction": "left",
  "path": "[10]"
}

==================================================
18. AVL / BALANCED TREES
==================================================

Track:
- Node
- Balance factor
- Rotation
- Tree relationship

Example:

"state": {
  "node": "30",
  "balanceFactor": "2",
  "rotation": "rightRotate",
  "path": "[30, 20, 10]"
}

==================================================
19. TRIE
==================================================

Show:
- Current character
- Current prefix
- Traversal path

Example:

"state": {
  "character": "p",
  "prefix": "app",
  "path": "a -> p -> p"
}

==================================================
20. GRAPH
==================================================

For graphs, show the adjacency structure ONCE when it becomes relevant.

Example:

"state": {
  "graph": "{0:[1,2], 1:[0,3], 2:[0,3], 3:[1,2]}",
  "current": "0",
  "visited": "{0}",
  "frontier": "[1,2]"
}

For large graphs, truncate irrelevant portions with "...".

==================================================
21. BFS
==================================================

Track:

- Current node
- Visited nodes
- Queue/frontier
- Traversal order

Example:

"state": {
  "current": "2",
  "visited": "{0,1,2}",
  "queue": "[3,4]",
  "order": "[0,1,2]"
}

==================================================
22. DFS
==================================================

Track:

- Current node
- Visited nodes
- DFS stack OR recursion path
- Traversal order

Example:

"state": {
  "current": "3",
  "visited": "{0,1,3}",
  "stack": "[0,1,3]",
  "order": "[0,1,3]"
}

For recursive DFS, prefer:

"callStack": "[dfs(0), dfs(1), dfs(3)]"

==================================================
23. DIJKSTRA / SHORTEST PATH
==================================================

Track:

- Current node
- Distance table
- Priority queue
- Visited/finalized nodes
- Relaxed edge

Example:

"state": {
  "current": "B",
  "distances": "{A:0, B:4, C:2, D:7}",
  "priorityQueue": "[(C,2),(B,4)]",
  "visited": "{A,C}",
  "edge": "C -> D"
}

==================================================
24. TOPOLOGICAL SORT
==================================================

Track:

- Current node
- In-degree
- Queue
- Result

Example:

"state": {
  "current": "A",
  "indegree": "{A:0, B:1, C:2}",
  "queue": "[B]",
  "order": "[A]"
}

==================================================
25. UNION FIND / DSU
==================================================

Track:

- Parent array
- Rank/size
- Current nodes
- Find path
- Union operation

Example:

"state": {
  "parent": "[0,0,2,2]",
  "rank": "[2,0,1,0]",
  "current": "[1,3]",
  "operation": "union"
}

==================================================
26. DYNAMIC PROGRAMMING
==================================================

DP IS ONE OF THE MOST IMPORTANT CASES.

Do NOT only show the final answer.

Show the DP table/array as it changes.

For 1D DP:

"state": {
  "dp": "[0, 1, 1, 2, ...]",
  "index": "3",
  "value": "2"
}

For 2D DP:

"state": {
  "dp": "[[0,0,0],[0,1,1],[0,1,2],...]",
  "row": "2",
  "col": "2",
  "value": "2"
}

For large tables:
show the relevant local region only.

==================================================
27. MEMOIZATION
==================================================

Show:

- Current recursive call
- Memo table
- Cache hit/miss
- Returned value

Example:

"state": {
  "call": "fib(5)",
  "memo": "{2:1,3:2,4:3}",
  "cache": "miss"
}

==================================================
28. RECURSION
==================================================

Track:

- Current function
- Arguments
- Call stack
- Depth
- Return value when relevant

Example:

"state": {
  "function": "factorial",
  "args": "3",
  "callStack": "[factorial(5), factorial(4), factorial(3)]",
  "depth": "3"
}

==================================================
29. BACKTRACKING
==================================================

Track:

- Current choice
- Current path
- Choices remaining
- Backtracking event

Example:

"state": {
  "path": "[1,2]",
  "choice": "3",
  "remaining": "[4]",
  "action": "backtrack"
}

==================================================
30. SORTING
==================================================

For sorting algorithms track:

- Array
- Active indexes
- Compared elements
- Swapped elements
- Sorted region when relevant

Example:

"state": {
  "array": "[1,3,2,5]",
  "i": "1",
  "j": "2",
  "comparing": "[3,2]",
  "swapped": "[1,2,3,5]"
}

==================================================
31. TWO POINTER
==================================================

Track:

- Array/string
- left
- right
- Current values
- Comparison/result

Example:

"state": {
  "array": "[1,2,4,7,9]",
  "left": "0",
  "right": "4",
  "values": "[1,9]"
}

==================================================
32. SLIDING WINDOW
==================================================

Track:

- Current window
- left
- right
- Window contents
- Current result

Example:

"state": {
  "array": "[2,3,1,4,5]",
  "left": "1",
  "right": "3",
  "window": "[3,1,4]",
  "result": "8"
}

==================================================
33. GREEDY
==================================================

Track:

- Current candidate
- Selected candidates
- Remaining candidates
- Current result

==================================================
34. BACKTRACKING / SEARCH
==================================================

Track decisions and state changes rather than every trivial recursive statement.

==================================================
35. FINAL RESULT
==================================================

The FINAL execution step MUST represent the completed result.

Examples:

"state": {
  "array": "[1,2,3,4]",
  "result": "sorted"
}

or:

"state": {
  "result": "7"
}

or:

"state": {
  "order": "[0,1,2,3]",
  "result": "BFS complete"
}

==================================================
36. LINE NUMBERS
==================================================

"line" MUST be the actual line number from the supplied code.

Count lines starting from 1.

Do not invent line numbers.

==================================================
37. ACTION
==================================================

"action" must be a SHORT description of what happened.

Good:

"Compare adjacent elements"
"Swap elements"
"Visit graph node"
"Enqueue neighbor"
"Fill DP cell"
"Push value onto stack"
"Pop from queue"
"Reverse linked-list pointer"
"Recursive call"
"Backtrack"
"Extract minimum from heap"

Bad:

"Something happens here"

==================================================
38. IMPORTANT D3.JS RULE
==================================================

The state must describe the CURRENT state AFTER the action on that line.

This means the frontend should be able to render the state directly without executing the code itself.

For example, after a swap:

"state": {
  "array": "[1,2,3,4]",
  "swapped": "[1,2]"
}

NOT the state before the swap.

==================================================
39. CONSISTENCY RULE
==================================================

Use stable variable names whenever possible.

For example:

Arrays:
array, i, j, left, right

Linked lists:
head, current, previous, next

Stacks:
stack, top

Queues:
queue, front, rear

Graphs:
graph, current, visited, queue, stack, order

DP:
dp, row, col, value

Trees:
root, current, left, right, path

Heaps:
heap, parent, children, current

This makes the frontend D3.js renderer easier to implement.

==================================================
40. OUTPUT FORMAT
==================================================

You MUST return ONLY valid JSON.

Do NOT use markdown.

Do NOT use \`\`\`json.

Do NOT include explanations before or after the JSON.

Return an array containing AT MOST 12 objects.

Every object MUST contain EXACTLY these keys:

- "line"
- "action"
- "state"

"line" must be an integer.

"action" must be a short string.

"state" must be an object.

EVERY value inside "state" MUST be a STRING.

Example:

[
  {
    "line": 5,
    "action": "Initialize array",
    "state": {
      "array": "[5,2,8,1]",
      "i": "0"
    }
  },
  {
    "line": 8,
    "action": "Compare elements",
    "state": {
      "array": "[5,2,8,1]",
      "i": "0",
      "j": "1",
      "comparing": "[5,2]"
    }
  },
  {
    "line": 9,
    "action": "Swap elements",
    "state": {
      "array": "[2,5,8,1]",
      "i": "0",
      "j": "1",
      "swapped": "[5,2]"
    }
  }
]

==================================================
CODE TO ANALYZE
==================================================

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