// Pure Step Generators for String Visualizer

function generateKmpSteps(text, pattern) {
  const steps = [];
  const m = pattern.length, n = text.length;
  if (!text || !pattern || m > n) {
    steps.push({ status: "Input invalid: Text must be longer than pattern.", highlightText: [], highlightPattern: [], lps: [], pIdx: 0, tIdx: 0 });
    return steps;
  }

  const lps = Array(m).fill(0);
  let len = 0, i = 1;
  steps.push({
    status: `Step 0: Precomputing LPS array for pattern "${pattern}".`,
    lps: [...lps], tIdx: 0, pIdx: 0, highlightText: [], highlightPattern: [0], phase: 'lps'
  });

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++; lps[i] = len;
      steps.push({
        status: `LPS[${i}]: '${pattern[i]}' matches prefix '${pattern[len - 1]}'. Prefix-suffix length = ${len}.`,
        lps: [...lps], tIdx: 0, pIdx: i, highlightText: [], highlightPattern: [i, len - 1], phase: 'lps'
      });
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
        steps.push({
          status: `LPS mismatch at ${i}. Fallback length to lps[${len}].`,
          lps: [...lps], tIdx: 0, pIdx: i, highlightText: [], highlightPattern: [i], phase: 'lps'
        });
      } else {
        lps[i] = 0;
        steps.push({
          status: `LPS[${i}] = 0 (No prefix match).`,
          lps: [...lps], tIdx: 0, pIdx: i, highlightText: [], highlightPattern: [i], phase: 'lps'
        });
        i++;
      }
    }
  }

  let t = 0, p = 0;
  const matches = [];
  steps.push({
    status: `LPS array ready: [${lps.join(', ')}]. Commencing non-backtracking text scanning.`,
    lps: [...lps], tIdx: 0, pIdx: 0, highlightText: [0], highlightPattern: [0], matches: [], phase: 'search'
  });

  while (t < n) {
    if (pattern[p] === text[t]) {
      steps.push({
        status: `Match: text[${t}] ('${text[t]}') === pattern[${p}] ('${pattern[p]}'). Advance both pointers.`,
        lps: [...lps], tIdx: t, pIdx: p, highlightText: [t], highlightPattern: [p], matches: [...matches], phase: 'search'
      });
      p++; t++;
    }

    if (p === m) {
      matches.push(t - p);
      steps.push({
        status: `FOUND! Pattern fully matched in text starting at index ${t - p}.`,
        lps: [...lps], tIdx: t - 1, pIdx: p - 1,
        highlightText: Array.from({ length: m }, (_, idx) => t - p + idx),
        highlightPattern: Array.from({ length: m }, (_, idx) => idx),
        matches: [...matches], phase: 'search', matchFound: true
      });
      p = lps[p - 1];
    } else if (t < n && pattern[p] !== text[t]) {
      if (p !== 0) {
        const prevP = p;
        p = lps[p - 1];
        steps.push({
          status: `Mismatch: text[${t}] ('${text[t]}') !== pattern[${prevP}] ('${pattern[prevP]}'). Jump pattern pointer to lps[${prevP - 1}] = ${p} WITHOUT rewinding text pointer t=${t}!`,
          lps: [...lps], tIdx: t, pIdx: p, highlightText: [t], highlightPattern: [p], matches: [...matches], phase: 'search'
        });
      } else {
        steps.push({
          status: `Mismatch at pattern start: text[${t}] ('${text[t]}') !== pattern[0]. Advance text pointer.`,
          lps: [...lps], tIdx: t, pIdx: 0, highlightText: [t], highlightPattern: [0], matches: [...matches], phase: 'search'
        });
        t++;
      }
    }
  }

  steps.push({
    status: `Search complete. Total occurrences found: ${matches.length} at indices [${matches.join(', ')}].`,
    lps: [...lps], tIdx: n, pIdx: 0, highlightText: [], highlightPattern: [], matches: [...matches], phase: 'complete'
  });
  return steps;
}

function generateRabinKarpSteps(text, pattern) {
  const steps = [];
  const d = 256, q = 101;
  const n = text.length, m = pattern.length;
  if (m > n || !m || !n) {
    steps.push({ status: "Input invalid for Rabin-Karp.", windowStart: 0, pHash: 0, wHash: 0 });
    return steps;
  }

  let pHash = 0, wHash = 0, h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * d) % q;
  for (let i = 0; i < m; i++) {
    pHash = (d * pHash + pattern.charCodeAt(i)) % q;
    wHash = (d * wHash + text.charCodeAt(i)) % q;
  }

  const matches = [];
  steps.push({
    status: `Pattern "${pattern}" hash = ${pHash}. Initial window "${text.substring(0, m)}" hash = ${wHash}.`,
    windowStart: 0, pHash, wHash, matches: [],
    highlightIndices: Array.from({ length: m }, (_, idx) => idx),
    hashMatch: pHash === wHash
  });

  for (let i = 0; i <= n - m; i++) {
    const currentSub = text.substring(i, i + m);
    if (pHash === wHash) {
      const isTrueMatch = currentSub === pattern;
      if (isTrueMatch) {
        matches.push(i);
        steps.push({
          status: `Hash match at index ${i} (${wHash} === ${pHash})! Verification: "${currentSub}" === "${pattern}" confirmed!`,
          windowStart: i, pHash, wHash, matches: [...matches],
          highlightIndices: Array.from({ length: m }, (_, idx) => i + idx),
          hashMatch: true, verified: true
        });
      } else {
        steps.push({
          status: `Spurious Hash Collision at index ${i}: hash matched (${wHash}), but characters differ ("${currentSub}" !== "${pattern}").`,
          windowStart: i, pHash, wHash, matches: [...matches],
          highlightIndices: Array.from({ length: m }, (_, idx) => i + idx),
          hashMatch: true, verified: false
        });
      }
    } else {
      steps.push({
        status: `Window [${i}..${i + m - 1}] "${currentSub}": Hash ${wHash} !== Pattern Hash ${pHash}. Slide window.`,
        windowStart: i, pHash, wHash, matches: [...matches],
        highlightIndices: Array.from({ length: m }, (_, idx) => i + idx),
        hashMatch: false
      });
    }

    if (i < n - m) {
      wHash = (d * (wHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (wHash < 0) wHash += q;
    }
  }

  steps.push({
    status: `Rabin-Karp complete. Found ${matches.length} matches at [${matches.join(', ')}].`,
    windowStart: n - m, pHash, wHash, matches: [...matches], highlightIndices: []
  });
  return steps;
}

function generateBoyerMooreSteps(text, pattern) {
  const steps = [];
  const m = pattern.length, n = text.length;
  if (m > n || !m || !n) {
    steps.push({ status: "Input invalid for Boyer-Moore.", shift: 0, badChar: {} });
    return steps;
  }

  const badChar = {};
  for (let i = 0; i < m; i++) badChar[pattern[i]] = i;

  steps.push({
    status: `Step 0: Bad Character Table generated: ${JSON.stringify(badChar)}. Scanning right-to-left.`,
    shift: 0, badChar, matches: [], scanIdx: m - 1
  });

  let s = 0;
  const matches = [];
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pattern[j] === text[s + j]) {
      steps.push({
        status: `Right-to-left match at pattern[${j}] ('${pattern[j]}') === text[${s + j}]. Decrement scan pointer.`,
        shift: s, scanIdx: j, badChar, matches: [...matches], highlightPair: [s + j, j], matchType: 'char_match'
      });
      j--;
    }

    if (j < 0) {
      matches.push(s);
      const nextShift = (s + m < n) ? m - (badChar[text[s + m]] ?? -1) : 1;
      steps.push({
        status: `FULL MATCH found at index ${s}! Shifting window ahead by ${nextShift}.`,
        shift: s, scanIdx: 0, badChar, matches: [...matches], highlightPair: [], matchType: 'found'
      });
      s += nextShift;
    } else {
      const mismatchedChar = text[s + j];
      const lastSeen = badChar[mismatchedChar] ?? -1;
      const skip = Math.max(1, j - lastSeen);
      steps.push({
        status: `Mismatch at pattern[${j}] with text[${s + j}] ('${mismatchedChar}'). Bad Character Rule: skip ahead by max(1, ${j} - ${lastSeen}) = ${skip} spots!`,
        shift: s, scanIdx: j, badChar, matches: [...matches], highlightPair: [s + j, j], skipAmount: skip, matchType: 'mismatch'
      });
      s += skip;
    }
  }

  steps.push({
    status: `Boyer-Moore completed. Matches: [${matches.join(', ')}].`,
    shift: s, scanIdx: 0, badChar, matches: [...matches]
  });
  return steps;
}

function generatePalindromeSteps(text) {
  const steps = [];
  const n = text.length;
  if (!text) {
    steps.push({ status: "Empty text.", start: 0, end: 0, longest: "" });
    return steps;
  }

  let bestStart = 0, bestEnd = 0, maxLen = 1;
  steps.push({
    status: `Starting expansion around ${2 * n - 1} possible center points for "${text}".`,
    centerL: 0, centerR: 0, currL: 0, currR: 0, bestStart: 0, bestEnd: 0, longest: text[0]
  });

  for (let i = 0; i < n; i++) {
    // Odd Center
    let l = i, r = i;
    steps.push({
      status: `Testing ODD center at index ${i} ('${text[i]}'). Expanding outward.`,
      centerL: i, centerR: i, currL: l, currR: r, bestStart, bestEnd, longest: text.substring(bestStart, bestEnd + 1)
    });
    while (l >= 0 && r < n && text[l] === text[r]) {
      const len = r - l + 1;
      if (len > maxLen) { maxLen = len; bestStart = l; bestEnd = r; }
      steps.push({
        status: `Symmetry matched: text[${l}] ('${text[l]}') === text[${r}] ('${text[r]}'). Length = ${len}.`,
        centerL: i, centerR: i, currL: l, currR: r, bestStart, bestEnd, longest: text.substring(bestStart, bestEnd + 1)
      });
      l--; r++;
    }

    // Even Center
    l = i; r = i + 1;
    if (r < n) {
      steps.push({
        status: `Testing EVEN center between indices ${i} and ${i + 1} ('${text[i]}' and '${text[r]}').`,
        centerL: i, centerR: r, currL: l, currR: r, bestStart, bestEnd, longest: text.substring(bestStart, bestEnd + 1)
      });
      while (l >= 0 && r < n && text[l] === text[r]) {
        const len = r - l + 1;
        if (len > maxLen) { maxLen = len; bestStart = l; bestEnd = r; }
        steps.push({
          status: `Symmetry matched: text[${l}] ('${text[l]}') === text[${r}] ('${text[r]}'). Length = ${len}.`,
          centerL: i, centerR: i + 1, currL: l, currR: r, bestStart, bestEnd, longest: text.substring(bestStart, bestEnd + 1)
        });
        l--; r++;
      }
    }
  }

  const result = text.substring(bestStart, bestEnd + 1);
  steps.push({
    status: `Expansion complete. Longest Palindrome: "${result}" (Length: ${result.length}).`,
    centerL: bestStart, centerR: bestEnd, currL: bestStart, currR: bestEnd, bestStart, bestEnd, longest: result
  });
  return steps;
}

function generateZAlgoSteps(text, pattern) {
  const steps = [];
  const s = pattern ? `${pattern}$${text}` : text;
  const n = s.length;
  const z = Array(n).fill(0);
  let l = 0, r = 0;

  steps.push({
    status: `Constructed string: "${s}". Initializing Z-array [${z.join(', ')}].`,
    s, z: [...z], l: 0, r: 0, i: 0, patternLen: pattern ? pattern.length : 0, matches: []
  });

  const matches = [];
  for (let i = 1; i < n; i++) {
    steps.push({
      status: `Inspecting index ${i} ('${s[i]}'). Current Z-box interval: [${l}, ${r}].`,
      s, z: [...z], l, r, i, patternLen: pattern ? pattern.length : 0, matches: [...matches]
    });

    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }

    if (pattern && z[i] === pattern.length) matches.push(i - pattern.length - 1);

    steps.push({
      status: `Z[${i}] = ${z[i]}. Updated Z-box: [${l}, ${r}]. ${pattern && z[i] === pattern.length ? 'Match detected!' : ''}`,
      s, z: [...z], l, r, i, patternLen: pattern ? pattern.length : 0, matches: [...matches]
    });
  }

  steps.push({
    status: `Z-Algorithm finished. Z-array: [${z.join(', ')}].`,
    s, z: [...z], l, r, i: n, patternLen: pattern ? pattern.length : 0, matches: [...matches]
  });
  return steps;
}

function generateLevenshteinSteps(word1, word2) {
  const steps = [];
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  steps.push({
    status: `Initialized DP grid for "${word1}" vs "${word2}". Base row and base col filled.`,
    dp: dp.map(row => [...row]), activeI: 0, activeJ: 0, word1, word2
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let op = "";
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        op = `Characters match ('${word1[i - 1]}'). Cost is 0 (carry diagonal ${dp[i - 1][j - 1]}).`;
      } else {
        const del = dp[i - 1][j], ins = dp[i][j - 1], rep = dp[i - 1][j - 1];
        const minVal = Math.min(del, ins, rep);
        dp[i][j] = 1 + minVal;
        const opName = minVal === rep ? 'Substitution' : minVal === del ? 'Deletion' : 'Insertion';
        op = `'${word1[i - 1]}' !== '${word2[j - 1]}'. Minimum operation: ${opName} (Cost: 1 + ${minVal} = ${dp[i][j]}).`;
      }

      steps.push({
        status: `dp[${i}][${j}] = ${dp[i][j]}. ${op}`,
        dp: dp.map(row => [...row]), activeI: i, activeJ: j, word1, word2
      });
    }
  }

  steps.push({
    status: `Levenshtein Matrix complete! Total minimum edit distance: ${dp[m][n]}.`,
    dp: dp.map(row => [...row]), activeI: m, activeJ: n, word1, word2
  });
  return steps;
}

function generateLcsSteps(s1, s2) {
  const steps = [];
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  steps.push({
    status: `Initialized LCS Matrix for "${s1}" and "${s2}". Base cells are 0.`,
    dp: dp.map(row => [...row]), activeI: 0, activeJ: 0, s1, s2, lcsResult: ""
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          status: `Match found: '${s1[i - 1]}' === '${s2[j - 1]}'. Diagonal + 1: dp[${i}][${j}] = ${dp[i][j]}.`,
          dp: dp.map(row => [...row]), activeI: i, activeJ: j, s1, s2, isMatch: true
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          status: `'${s1[i - 1]}' !== '${s2[j - 1]}'. Take max(top: ${dp[i - 1][j]}, left: ${dp[i][j - 1]}) = ${dp[i][j]}.`,
          dp: dp.map(row => [...row]), activeI: i, activeJ: j, s1, s2, isMatch: false
        });
      }
    }
  }

  let i = m, j = n, lcsChars = [];
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) { lcsChars.unshift(s1[i - 1]); i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  const lcsStr = lcsChars.join('');
  steps.push({
    status: `LCS complete! Max length: ${dp[m][n]}. Reconstructed subsequence: "${lcsStr}".`,
    dp: dp.map(row => [...row]), activeI: m, activeJ: n, s1, s2, lcsResult: lcsStr
  });
  return steps;
}

function generateAnagramSteps(text, pattern) {
  const steps = [];
  const n = text.length, k = pattern.length;
  if (k > n || !k || !n) {
    steps.push({ status: "Input invalid for Anagram Search.", windowStart: 0, pMap: {}, wMap: {}, matches: [] });
    return steps;
  }

  const pMap = {}, wMap = {};
  for (let c of pattern) pMap[c] = (pMap[c] || 0) + 1;

  steps.push({
    status: `Step 0: Target pattern "${pattern}" frequency map: ${JSON.stringify(pMap)}. Window size = ${k}.`,
    windowStart: 0, pMap: { ...pMap }, wMap: {}, matches: []
  });

  const matches = [];
  for (let i = 0; i < n; i++) {
    const c = text[i];
    wMap[c] = (wMap[c] || 0) + 1;

    if (i >= k) {
      const outChar = text[i - k];
      if (wMap[outChar] === 1) delete wMap[outChar];
      else wMap[outChar]--;
    }

    if (i >= k - 1) {
      const start = i - k + 1;
      let isMatch = true;
      for (let key in pMap) if (pMap[key] !== wMap[key]) { isMatch = false; break; }
      for (let key in wMap) if (wMap[key] !== pMap[key]) { isMatch = false; break; }

      if (isMatch) {
        matches.push(start);
        steps.push({
          status: `ANAGRAM FOUND at index ${start}! Window "${text.substring(start, start + k)}" matches frequency of "${pattern}".`,
          windowStart: start, pMap: { ...pMap }, wMap: { ...wMap }, matches: [...matches], isMatch: true
        });
      } else {
        steps.push({
          status: `Window [${start}..${start + k - 1}] "${text.substring(start, start + k)}": Frequencies do not match. Slide window.`,
          windowStart: start, pMap: { ...pMap }, wMap: { ...wMap }, matches: [...matches], isMatch: false
        });
      }
    }
  }

  steps.push({
    status: `Anagram search complete. Found ${matches.length} anagram windows at indices [${matches.join(', ')}].`,
    windowStart: n - k, pMap: { ...pMap }, wMap: { ...wMap }, matches: [...matches]
  });
  return steps;
}

function generateRleSteps(text) {
  const steps = [];
  if (!text) {
    steps.push({ status: "Empty text.", currentIdx: 0, encoded: "" });
    return steps;
  }

  let encoded = "", i = 0;
  steps.push({
    status: `Starting Run-Length Encoding on "${text}" (Original length: ${text.length}).`,
    currentIdx: 0, currentChar: text[0], runCount: 1, encoded: "", text
  });

  while (i < text.length) {
    const char = text[i];
    let count = 1;
    steps.push({
      status: `Scanning character '${char}' at index ${i}.`,
      currentIdx: i, currentChar: char, runCount: count, encoded, text
    });

    while (i + 1 < text.length && text[i] === text[i + 1]) {
      count++; i++;
      steps.push({
        status: `Identical character detected: '${text[i]}'. Streak count increased to ${count}.`,
        currentIdx: i, currentChar: char, runCount: count, encoded, text
      });
    }

    encoded += `${count}${char}`;
    steps.push({
      status: `Run completed for '${char}': appended "${count}${char}". Result so far: "${encoded}".`,
      currentIdx: i, currentChar: char, runCount: count, encoded, text
    });
    i++;
  }

  const reduction = Math.round((1 - (encoded.length / text.length)) * 100);
  steps.push({
    status: `Compression complete! "${text}" -> "${encoded}". Space reduced by ${reduction}%.`,
    currentIdx: text.length - 1, currentChar: '', runCount: 0, encoded, text
  });
  return steps;
}

function generateReverseWordsSteps(sentence) {
  const steps = [];
  if (!sentence) {
    steps.push({ status: "Empty string.", words: [], activeIdx: -1 });
    return steps;
  }

  const words = sentence.trim().split(/\s+/);
  steps.push({
    status: `Parsed sentence into ${words.length} words: [${words.join(', ')}].`,
    words: [...words], left: 0, right: words.length - 1, phase: 'start'
  });

  let l = 0, r = words.length - 1;
  while (l < r) {
    steps.push({
      status: `Two-pointer swap: Swapping word at [${l}] ("${words[l]}") with word at [${r}] ("${words[r]}").`,
      words: [...words], left: l, right: r, phase: 'swapping'
    });

    const temp = words[l];
    words[l] = words[r];
    words[r] = temp;

    steps.push({
      status: `Swapped! Result: [${words.join(' ')}]. Advance inward.`,
      words: [...words], left: l, right: r, phase: 'swapped'
    });
    l++; r--;
  }

  steps.push({
    status: `Sentence successfully reversed: "${words.join(' ')}"!`,
    words: [...words], left: -1, right: -1, phase: 'complete'
  });
  return steps;
}

function generateIsomorphicSteps(s, t) {
  const steps = [];
  if (s.length !== t.length) {
    steps.push({ status: `Lengths differ (${s.length} !== ${t.length}): Cannot be isomorphic.`, isValid: false, mapST: {}, mapTS: {}, index: 0 });
    return steps;
  }

  const mapST = {}, mapTS = {};
  steps.push({
    status: `Checking isomorphism between "${s}" and "${t}". Initializing dual mapping tables.`,
    mapST: {}, mapTS: {}, index: 0, isValid: true
  });

  for (let i = 0; i < s.length; i++) {
    const c1 = s[i], c2 = t[i];
    steps.push({
      status: `Inspecting pair at index ${i}: s[${i}] = '${c1}', t[${i}] = '${c2}'.`,
      mapST: { ...mapST }, mapTS: { ...mapTS }, index: i, isValid: true
    });

    if ((mapST[c1] && mapST[c1] !== c2) || (mapTS[c2] && mapTS[c2] !== c1)) {
      steps.push({
        status: `CONFLICT DETECTED at index ${i}! '${c1}' mapped to '${mapST[c1]}' but current char is '${c2}'. Strings are NOT isomorphic!`,
        mapST: { ...mapST }, mapTS: { ...mapTS }, index: i, isValid: false, conflict: true
      });
      return steps;
    }

    mapST[c1] = c2; mapTS[c2] = c1;
    steps.push({
      status: `Valid mapping registered: '${c1}' <---> '${c2}'.`,
      mapST: { ...mapST }, mapTS: { ...mapTS }, index: i, isValid: true
    });
  }

  steps.push({
    status: `Verification successful! "${s}" and "${t}" are 1-to-1 ISOMORPHIC.`,
    mapST: { ...mapST }, mapTS: { ...mapTS }, index: s.length, isValid: true
  });
  return steps;
}

function generateParenthesesSteps(brackets) {
  const steps = [];
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  steps.push({
    status: `Checking validity for bracket sequence: "${brackets}". Stack is initially empty.`,
    stack: [], idx: -1, isValid: true
  });

  for (let i = 0; i < brackets.length; i++) {
    const c = brackets[i];
    if (c === '(' || c === '{' || c === '[') {
      stack.push(c);
      steps.push({
        status: `Encountered opening bracket '${c}'. Push onto stack. Stack height: ${stack.length}.`,
        stack: [...stack], idx: i, char: c, action: 'push', isValid: true
      });
    } else if (map[c]) {
      if (stack.length === 0) {
        steps.push({
          status: `ERROR at index ${i}: Closing bracket '${c}' encountered but stack is EMPTY!`,
          stack: [], idx: i, char: c, action: 'error', isValid: false
        });
        return steps;
      }
      const top = stack.pop();
      if (top !== map[c]) {
        steps.push({
          status: `MISMATCH at index ${i}: Expected matching opening for '${c}' ('${map[c]}'), but popped '${top}'!`,
          stack: [...stack], idx: i, char: c, action: 'mismatch', isValid: false
        });
        return steps;
      }
      steps.push({
        status: `Valid match: '${c}' pairs with popped '${top}'. Stack height: ${stack.length}.`,
        stack: [...stack], idx: i, char: c, action: 'pop', isValid: true
      });
    }
  }

  if (stack.length === 0) {
    steps.push({
      status: `All brackets properly closed and matched! Bracket sequence is VALID.`,
      stack: [], idx: brackets.length, isValid: true
    });
  } else {
    steps.push({
      status: `ERROR: Unclosed brackets remaining in stack: [${stack.join(', ')}]. Sequence is INVALID.`,
      stack: [...stack], idx: brackets.length, isValid: false
    });
  }
  return steps;
}

// MAIN EXPORT COMPONENT

// Pedagogical HUD Helper to explain WHY each step happens in String algorithms

export function generateStringSteps(algoId, { text, pattern, s2, sentence, brackets, word1, word2, s, t }) {
  switch (algoId) {
    case 'kmp': return generateKmpSteps(text, pattern);
    case 'rabin_karp': return generateRabinKarpSteps(text, pattern);
    case 'boyer_moore': return generateBoyerMooreSteps(text, pattern);
    case 'palindrome': return generatePalindromeSteps(text);
    case 'z_algorithm': return generateZAlgoSteps(text, pattern);
    case 'levenshtein': return generateLevenshteinSteps(word1 || text, word2 || s2);
    case 'lcs': return generateLcsSteps(word1 || text, word2 || s2);
    case 'anagram_search': return generateAnagramSteps(text, pattern);
    case 'run_length': return generateRleSteps(text);
    case 'reverse_words': return generateReverseWordsSteps(sentence || text);
    case 'isomorphic': return generateIsomorphicSteps(s || text, t || s2);
    case 'valid_parentheses': return generateParenthesesSteps(brackets || text);
    default: return generateKmpSteps(text, pattern);
  }
}

export {
  generateKmpSteps,
  generateRabinKarpSteps,
  generateBoyerMooreSteps,
  generatePalindromeSteps,
  generateZAlgoSteps,
  generateLevenshteinSteps,
  generateLcsSteps,
  generateAnagramSteps,
  generateRleSteps,
  generateReverseWordsSteps,
  generateIsomorphicSteps,
  generateParenthesesSteps
};
