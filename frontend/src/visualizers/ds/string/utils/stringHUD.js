export const getStringHUDInfo = (algoId, step, text, pattern, s2) => {
  const t = text || '';
  const p = pattern || '';
  const tChar = step.tIdx !== undefined && step.tIdx < t.length ? t[step.tIdx] : null;
  const pChar = step.pIdx !== undefined && step.pIdx < p.length ? p[step.pIdx] : null;

  // 1. KMP
  if (algoId === 'kmp') {
    if (step.matchFound) {
      return {
        badge: '🎯 PATTERN OCCURRENCE FOUND!',
        bg: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300',
        icon: '🎯',
        why: `The full pattern "${p}" was discovered starting at index ${step.tIdx - p.length + 1}! To find any overlapping occurrences, p jumps to LPS[m-1] = ${step.lps?.[p.length - 1] ?? 0} without resetting text pointer t.`
      };
    }
    if (step.phase === 'lps') {
      return {
        badge: '📐 BUILDING LPS (FAILURE) TABLE',
        bg: 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300',
        icon: '📐',
        why: `Precomputing Longest Prefix which is also a Suffix for pattern[0..${step.pIdx}]. When a mismatch occurs during searching, this table dictates the exact number of characters to skip without backtracking text pointer t.`
      };
    }
    if (step.status?.includes('Match:')) {
      return {
        badge: '✓ CHARACTER MATCH (t & p++)',
        bg: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300',
        icon: '✓',
        why: `text[${step.tIdx}] ('${tChar}') matches pattern[${step.pIdx}] ('${pChar}')! Both characters are verified. Increment both text pointer t (${step.tIdx} -> ${step.tIdx + 1}) and pattern pointer p (${step.pIdx} -> ${step.pIdx + 1}).`
      };
    }
    if (step.status?.includes('Mismatch:')) {
      const prevP = step.pIdx ?? 0;
      const newP = step.lps?.[Math.max(0, prevP - 1)] ?? 0;
      return {
        badge: '⚡ LPS JUMP (NO TEXT BACKTRACK)',
        bg: 'bg-rose-500/20 border-rose-500/60 text-rose-300',
        icon: '⚡',
        why: `Mismatch at text[${step.tIdx}] ('${tChar}') vs pattern[${prevP}] ('${pChar}'). Instead of rewinding text pointer t (which would cause naive O(N*M) worst-case time), KMP jumps pattern pointer p to LPS[${Math.max(0, prevP - 1)}] = ${newP}. We skip ${prevP - newP} redundant re-checks!`
      };
    }
    return {
      badge: '🔍 KMP SCANNING IN PROGRESS',
      bg: 'bg-amber-500/20 border-amber-500/60 text-amber-300',
      icon: '🔍',
      why: step.status || 'Scanning text characters with KMP non-backtracking automata.'
    };
  }

  // 2. Rabin-Karp
  if (algoId === 'rabin_karp') {
    if (step.hashMatch) {
      return {
        badge: '✓ HASH MATCH! VERIFYING CHARACTERS',
        bg: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300',
        icon: '✓',
        why: `Window Hash (${step.wHash}) matches Pattern Hash (${step.pHash})! We now verify characters one-by-one to confirm an exact match and rule out spurious hash collisions.`
      };
    }
    return {
      badge: '🔢 ROLLING HASH RECOMPUTATION (O(1))',
      bg: 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300',
      icon: '🔢',
      why: `Hashes do not match (${step.wHash} !== ${step.pHash}). Using rolling hash math, we drop the exiting character and add the entering character in O(1) time without re-hashing all M characters.`
    };
  }

  // 3. Longest Palindrome
  if (algoId === 'longest_palindrome') {
    if (step.status?.includes('Symmetry matched')) {
      const leftChar = t[step.currL];
      const rightChar = t[step.currR];
      const spanLen = (step.currR ?? 0) - (step.currL ?? 0) + 1;
      return {
        badge: '👑 SYMMETRIC MATCH: EXPANDING WINGS',
        bg: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300',
        icon: '👑',
        why: `text[${step.currL}] ('${leftChar}') === text[${step.currR}] ('${rightChar}'). Palindromic mirror symmetry holds! Substring "${t.substring(step.currL, step.currR + 1)}" is a valid palindrome of length ${spanLen}. Expand wings outward (left--, right++).`
      };
    }
    if (step.status?.includes('Testing')) {
      return {
        badge: '📍 ANCHORING AT NEW CENTER',
        bg: 'bg-amber-500/20 border-amber-500/60 text-amber-300',
        icon: '📍',
        why: `Testing center beacon at index ${step.centerL === step.centerR ? step.centerL : `${step.centerL} and ${step.centerR}`}. Every character and every space between adjacent characters can serve as the center of a palindrome.`
      };
    }
    return {
      badge: '✨ PALINDROME SEARCH',
      bg: 'bg-purple-500/20 border-purple-500/60 text-purple-300',
      icon: '✨',
      why: step.status || 'Expanding outward around centers.'
    };
  }

  // 4. Levenshtein
  if (algoId === 'levenshtein') {
    return {
      badge: '📊 DP EDIT DISTANCE GRID',
      bg: 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300',
      icon: '📊',
      why: step.status || 'Evaluating minimum operations between Insert (+1), Delete (+1), and Replace/Match (+1/+0).'
    };
  }

  // 5. LCS
  if (algoId === 'lcs') {
    return {
      badge: '🧬 LONGEST COMMON SUBSEQUENCE',
      bg: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300',
      icon: '🧬',
      why: step.status || 'If characters match, take 1 + diagonal; otherwise take max of top and left DP cells.'
    };
  }

  // 6. Boyer-Moore
  if (algoId === 'boyer_moore') {
    return {
      badge: '⚡ BAD CHARACTER HEURISTIC SCAN',
      bg: 'bg-amber-500/20 border-amber-500/60 text-amber-300',
      icon: '⚡',
      why: step.status || 'Scanning pattern from right-to-left. On mismatch, shift pattern by bad character lookup.'
    };
  }

  // 7. Z-Algorithm
  if (algoId === 'z_algorithm') {
    return {
      badge: '📦 Z-BOX [L, R] SEARCH',
      bg: 'bg-purple-500/20 border-purple-500/60 text-purple-300',
      icon: '📦',
      why: step.status || 'Z[i] stores the length of the longest substring starting at i that matches a prefix of S.'
    };
  }

  // Default
  return {
    badge: '📍 STRING ALGORITHM EXECUTION',
    bg: 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300',
    icon: '📍',
    why: step.status || 'Executing string processing algorithm.'
  };
};

