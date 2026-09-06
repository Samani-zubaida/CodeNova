import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Search, Compass, Layers, CheckCircle, AlertCircle, Type, Sparkles,
  Hash, ArrowRight, ArrowLeft, RefreshCw, Eye, CornerDownRight, Database,
  Sliders, Activity, Cpu, Lightbulb, Zap, ShieldCheck, HelpCircle, Key, FileText
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import { STRING_ALGORITHMS } from './StringHub';

// Web Audio Sound Synthesizer
const playSynthTone = (type = 'char', isMuted = false) => {
  if (isMuted || typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'char') {
      osc.frequency.setValueAtTime(360, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'match') {
      osc.frequency.setValueAtTime(580, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'mismatch') {
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'found') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {}
};

// MULTI-LANGUAGE CODE SNIPPETS
const CODE_SNIPPETS = {
  kmp: {
    javascript: `function kmpSearch(text, pattern) {
  const m = pattern.length, n = text.length;
  const lps = Array(m).fill(0);
  let len = 0, i = 1;
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++; lps[i] = len; i++;
    } else {
      if (len !== 0) len = lps[len - 1];
      else { lps[i] = 0; i++; }
    }
  }
  let p = 0, t = 0;
  const matches = [];
  while (t < n) {
    if (pattern[p] === text[t]) { p++; t++; }
    if (p === m) {
      matches.push(t - p);
      p = lps[p - 1];
    } else if (t < n && pattern[p] !== text[t]) {
      if (p !== 0) p = lps[p - 1];
      else t++;
    }
  }
  return matches;
}`,
    python: `def kmp_search(text, pattern):
    m, n = len(pattern), len(text)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0: length = lps[length - 1]
            else: lps[i] = 0; i += 1
    matches, p, t = [], 0, 0
    while t < n:
        if pattern[p] == text[t]: p += 1; t += 1
        if p == m:
            matches.append(t - p)
            p = lps[p - 1]
        elif t < n and pattern[p] != text[t]:
            if p != 0: p = lps[p - 1]
            else: t += 1
    return matches`,
    cpp: `vector<int> kmpSearch(string text, string pattern) {
    int m = pattern.size(), n = text.size();
    vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) { len++; lps[i] = len; i++; }
        else {
            if (len != 0) len = lps[len - 1];
            else { lps[i] = 0; i++; }
        }
    }
    vector<int> matches;
    int p = 0, t = 0;
    while (t < n) {
        if (pattern[p] == text[t]) { p++; t++; }
        if (p == m) {
            matches.push_back(t - p);
            p = lps[p - 1];
        } else if (t < n && pattern[p] != text[t]) {
            if (p != 0) p = lps[p - 1];
            else t++;
        }
    }
    return matches;
}`,
    java: `public static List<Integer> kmpSearch(String text, String pattern) {
    int m = pattern.length(), n = text.length();
    int[] lps = new int[m];
    int len = 0, i = 1;
    while (i < m) {
        if (pattern.charAt(i) == pattern.charAt(len)) { len++; lps[i] = len; i++; }
        else {
            if (len != 0) len = lps[len - 1];
            else { lps[i] = 0; i++; }
        }
    }
    List<Integer> matches = new ArrayList<>();
    int p = 0, t = 0;
    while (t < n) {
        if (pattern.charAt(p) == text.charAt(t)) { p++; t++; }
        if (p == m) {
            matches.add(t - p);
            p = lps[p - 1];
        } else if (t < n && pattern.charAt(p) != text.charAt(t)) {
            if (p != 0) p = lps[p - 1];
            else t++;
        }
    }
    return matches;
}`
  },

  rabin_karp: {
    javascript: `function rabinKarp(text, pattern) {
  const d = 256, q = 101;
  const n = text.length, m = pattern.length;
  let p = 0, t = 0, h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * d) % q;
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
  const matches = [];
  for (let i = 0; i <= n - m; i++) {
    if (p === t && text.substring(i, i + m) === pattern) matches.push(i);
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t += q;
    }
  }
  return matches;
}`,
    python: `def rabin_karp(text, pattern):
    d, q = 256, 101
    n, m = len(text), len(pattern)
    p, t = 0, 0
    h = pow(d, m - 1, q)
    for i in range(m):
        p = (d * p + ord(pattern[i])) % q
        t = (d * t + ord(text[i])) % q
    matches = []
    for i in range(n - m + 1):
        if p == t and text[i:i+m] == pattern: matches.append(i)
        if i < n - m:
            t = (d * (t - ord(text[i]) * h) + ord(text[i + m])) % q
            if t < 0: t += q
    return matches`,
    cpp: `vector<int> rabinKarp(string text, string pattern) {
    int d = 256, q = 101, n = text.size(), m = pattern.size();
    int p = 0, t = 0, h = 1;
    for (int i = 0; i < m - 1; i++) h = (h * d) % q;
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern[i]) % q;
        t = (d * t + text[i]) % q;
    }
    vector<int> matches;
    for (int i = 0; i <= n - m; i++) {
        if (p == t && text.substr(i, m) == pattern) matches.push_back(i);
        if (i < n - m) {
            t = (d * (t - text[i] * h) + text[i + m]) % q;
            if (t < 0) t += q;
        }
    }
    return matches;
}`,
    java: `public static List<Integer> rabinKarp(String text, String pattern) {
    int d = 256, q = 101, n = text.length(), m = pattern.length();
    int p = 0, t = 0, h = 1;
    for (int i = 0; i < m - 1; i++) h = (h * d) % q;
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern.charAt(i)) % q;
        t = (d * t + text.charAt(i)) % q;
    }
    List<Integer> matches = new ArrayList<>();
    for (int i = 0; i <= n - m; i++) {
        if (p == t && text.substring(i, i + m).equals(pattern)) matches.add(i);
        if (i < n - m) {
            t = (d * (t - text.charAt(i) * h) + text.charAt(i + m)) % q;
            if (t < 0) t += q;
        }
    }
    return matches;
}`
  },

  boyer_moore: {
    javascript: `function boyerMoore(text, pattern) {
  const m = pattern.length, n = text.length;
  const badChar = {};
  for (let i = 0; i < m; i++) badChar[pattern[i]] = i;
  let s = 0;
  const matches = [];
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pattern[j] === text[s + j]) j--;
    if (j < 0) {
      matches.push(s);
      s += (s + m < n) ? m - (badChar[text[s + m]] ?? -1) : 1;
    } else {
      const last = badChar[text[s + j]] ?? -1;
      s += Math.max(1, j - last);
    }
  }
  return matches;
}`,
    python: `def boyer_moore(text, pattern):
    m, n = len(pattern), len(text)
    bad_char = {c: i for i, c in enumerate(pattern)}
    s, matches = 0, []
    while s <= n - m:
        j = m - 1
        while j >= 0 and pattern[j] == text[s + j]: j -= 1
        if j < 0:
            matches.append(s)
            s += (m - bad_char.get(text[s + m], -1)) if s + m < n else 1
        else:
            s += max(1, j - bad_char.get(text[s + j], -1))
    return matches`,
    cpp: `vector<int> boyerMoore(string text, string pattern) {
    int m = pattern.size(), n = text.size();
    unordered_map<char, int> badChar;
    for (int i = 0; i < m; i++) badChar[pattern[i]] = i;
    int s = 0; vector<int> matches;
    while (s <= n - m) {
        int j = m - 1;
        while (j >= 0 && pattern[j] == text[s + j]) j--;
        if (j < 0) {
            matches.push_back(s);
            s += (s + m < n) ? m - (badChar.count(text[s + m]) ? badChar[text[s + m]] : -1) : 1;
        } else {
            int last = badChar.count(text[s + j]) ? badChar[text[s + j]] : -1;
            s += max(1, j - last);
        }
    }
    return matches;
}`,
    java: `public static List<Integer> boyerMoore(String text, String pattern) {
    int m = pattern.length(), n = text.length();
    Map<Character, Integer> badChar = new HashMap<>();
    for (int i = 0; i < m; i++) badChar.put(pattern.charAt(i), i);
    int s = 0; List<Integer> matches = new ArrayList<>();
    while (s <= n - m) {
        int j = m - 1;
        while (j >= 0 && pattern.charAt(j) == text.charAt(s + j)) j--;
        if (j < 0) {
            matches.add(s);
            s += (s + m < n) ? m - badChar.getOrDefault(text.charAt(s + m), -1) : 1;
        } else {
            int last = badChar.getOrDefault(text.charAt(s + j), -1);
            s += Math.max(1, j - last);
        }
    }
    return matches;
}`
  },

  longest_palindrome: {
    javascript: `function longestPalindrome(s) {
  if (!s || s.length < 1) return "";
  let start = 0, end = 0;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--; right++;
    }
    return right - left - 1;
  }
  for (let i = 0; i < s.length; i++) {
    const len1 = expand(i, i);
    const len2 = expand(i, i + 1);
    const len = Math.max(len1, len2);
    if (len > end - start) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
    }
  }
  return s.substring(start, end + 1);
}`,
    python: `def longest_palindrome(s):
    if not s: return ""
    start = end = 0
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]: l -= 1; r += 1
        return r - l - 1
    for i in range(len(s)):
        l1, l2 = expand(i, i), expand(i, i + 1)
        mx = max(l1, l2)
        if mx > end - start:
            start = i - (mx - 1) // 2
            end = i + mx // 2
    return s[start:end + 1]`,
    cpp: `string longestPalindrome(string s) {
    if (s.empty()) return "";
    int start = 0, end = 0;
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < s.size() && s[l] == s[r]) { l--; r++; }
        return r - l - 1;
    };
    for (int i = 0; i < s.size(); i++) {
        int len = max(expand(i, i), expand(i, i + 1));
        if (len > end - start) {
            start = i - (len - 1) / 2;
            end = i + len / 2;
        }
    }
    return s.substr(start, end - start + 1);
}`,
    java: `public static String longestPalindrome(String s) {
    if (s == null || s.length() < 1) return "";
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        int len = Math.max(expand(s, i, i), expand(s, i, i + 1));
        if (len > end - start) {
            start = i - (len - 1) / 2;
            end = i + len / 2;
        }
    }
    return s.substring(start, end + 1);
}`
  },

  z_algorithm: {
    javascript: `function zAlgorithm(s) {
  const n = s.length, z = Array(n).fill(0);
  let l = 0, r = 0;
  for (let i = 1; i < n; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
  }
  return z;
}`,
    python: `def z_algorithm(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i <= r: z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]: z[i] += 1
        if i + z[i] - 1 > r: l = i; r = i + z[i] - 1
    return z`,
    cpp: `vector<int> zAlgorithm(string s) {
    int n = s.size(); vector<int> z(n, 0);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i <= r) z[i] = min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
    }
    return z;
}`,
    java: `public static int[] zAlgorithm(String s) {
    int n = s.length(); int[] z = new int[n];
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
        if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
    }
    return z;
}`
  },

  levenshtein: {
    javascript: `function minDistance(w1, w2) {
  const m = w1.length, n = w2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (w1[i - 1] === w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}`,
    python: `def min_distance(w1, w2):
    m, n = len(w1), len(w2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if w1[i - 1] == w2[j - 1]: dp[i][j] = dp[i - 1][j - 1]
            else: dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]`,
    cpp: `int minDistance(string w1, string w2) {
    int m = w1.size(), n = w2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (w1[i - 1] == w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
        }
    }
    return dp[m][n];
}`,
    java: `public static int minDistance(String w1, String w2) {
    int m = w1.length(), n = w2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (w1.charAt(i - 1) == w2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
        }
    }
    return dp[m][n];
}`
  },

  lcs: {
    javascript: `function longestCommonSubsequence(t1, t2) {
  const m = t1.length, n = t2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (t1[i - 1] === t2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,
    python: `def lcs(t1, t2):
    m, n = len(t1), len(t2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if t1[i - 1] == t2[j - 1]: dp[i][j] = dp[i - 1][j - 1] + 1
            else: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
    cpp: `int lcs(string t1, string t2) {
    int m = t1.size(), n = t2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (t1[i - 1] == t2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
    java: `public static int lcs(String t1, String t2) {
    int m = t1.length(), n = t2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (t1.charAt(i - 1) == t2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`
  },

  anagram_search: {
    javascript: `function findAnagrams(s, p) {
  const res = [];
  if (s.length < p.length) return res;
  const pCount = {}, sCount = {};
  for (let c of p) pCount[c] = (pCount[c] || 0) + 1;
  const k = p.length;
  for (let i = 0; i < s.length; i++) {
    sCount[s[i]] = (sCount[s[i]] || 0) + 1;
    if (i >= k) {
      if (sCount[s[i - k]] === 1) delete sCount[s[i - k]];
      else sCount[s[i - k]]--;
    }
    if (i >= k - 1) {
      let match = true;
      for (let key in pCount) if (pCount[key] !== sCount[key]) { match = false; break; }
      if (match) res.push(i - k + 1);
    }
  }
  return res;
}`,
    python: `from collections import Counter
def find_anagrams(s, p):
    res, p_count, s_count, k = [], Counter(p), Counter(), len(p)
    for i, c in enumerate(s):
        s_count[c] += 1
        if i >= k:
            if s_count[s[i - k]] == 1: del s_count[s[i - k]]
            else: s_count[s[i - k]] -= 1
        if s_count == p_count: res.append(i - k + 1)
    return res`,
    cpp: `vector<int> findAnagrams(string s, string p) {
    vector<int> res; if (s.size() < p.size()) return res;
    vector<int> pC(26, 0), sC(26, 0);
    for (char c : p) pC[c - 'a']++;
    for (int i = 0; i < s.size(); i++) {
        sC[s[i] - 'a']++;
        if (i >= p.size()) sC[s[i - p.size()] - 'a']--;
        if (pC == sC) res.push_back(i - p.size() + 1);
    }
    return res;
}`,
    java: `public static List<Integer> findAnagrams(String s, String p) {
    List<Integer> res = new ArrayList<>();
    if (s.length() < p.length()) return res;
    int[] pC = new int[26], sC = new int[26];
    for (char c : p.toCharArray()) pC[c - 'a']++;
    for (int i = 0; i < s.length(); i++) {
        sC[s.charAt(i) - 'a']++;
        if (i >= p.length()) sC[s.charAt(i - p.length()) - 'a']--;
        if (Arrays.equals(pC, sC)) res.add(i - p.length() + 1);
    }
    return res;
}`
  },

  run_length: {
    javascript: `function compressRLE(s) {
  let encoded = "", i = 0;
  while (i < s.length) {
    let count = 1;
    while (i + 1 < s.length && s[i] === s[i + 1]) { count++; i++; }
    encoded += count + s[i];
    i++;
  }
  return encoded;
}`,
    python: `def compress_rle(s):
    res, i = [], 0
    while i < len(s):
        c = 1
        while i + 1 < len(s) and s[i] == s[i + 1]: c += 1; i += 1
        res.append(f"{c}{s[i]}"); i += 1
    return "".join(res)`,
    cpp: `string compressRLE(string s) {
    string enc = ""; int i = 0;
    while (i < s.size()) {
        int c = 1;
        while (i + 1 < s.size() && s[i] == s[i + 1]) { c++; i++; }
        enc += to_string(c) + s[i]; i++;
    }
    return enc;
}`,
    java: `public static String compressRLE(String s) {
    StringBuilder sb = new StringBuilder(); int i = 0;
    while (i < s.length()) {
        int c = 1;
        while (i + 1 < s.length() && s.charAt(i) == s.charAt(i + 1)) { c++; i++; }
        sb.append(c).append(s.charAt(i)); i++;
    }
    return sb.toString();
}`
  },

  reverse_words: {
    javascript: `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(" ");
}`,
    python: `def reverse_words(s):
    return " ".join(s.strip().split()[::-1])`,
    cpp: `string reverseWords(string s) {
    stringstream ss(s); string w, res = ""; vector<string> v;
    while (ss >> w) v.push_back(w);
    for (int i = v.size() - 1; i >= 0; i--) res += v[i] + (i > 0 ? " " : "");
    return res;
}`,
    java: `public static String reverseWords(String s) {
    String[] parts = s.trim().split("\\\\s+");
    StringBuilder sb = new StringBuilder();
    for (int i = parts.length - 1; i >= 0; i--) sb.append(parts[i]).append(i > 0 ? " " : "");
    return sb.toString();
}`
  },

  isomorphic: {
    javascript: `function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  const mapST = {}, mapTS = {};
  for (let i = 0; i < s.length; i++) {
    const c1 = s[i], c2 = t[i];
    if ((mapST[c1] && mapST[c1] !== c2) || (mapTS[c2] && mapTS[c2] !== c1)) return false;
    mapST[c1] = c2; mapTS[c2] = c1;
  }
  return true;
}`,
    python: `def is_isomorphic(s, t):
    if len(s) != len(t): return False
    mST, mTS = {}, {}
    for c1, c2 in zip(s, t):
        if (c1 in mST and mST[c1] != c2) or (c2 in mTS and mTS[c2] != c1): return False
        mST[c1] = c2; mTS[c2] = c1
    return True`,
    cpp: `bool isIsomorphic(string s, string t) {
    if (s.size() != t.size()) return false;
    unordered_map<char, char> mST, mTS;
    for (int i = 0; i < s.size(); i++) {
        char c1 = s[i], c2 = t[i];
        if (mST.count(c1) && mST[c1] != c2) return false;
        if (mTS.count(c2) && mTS[c2] != c1) return false;
        mST[c1] = c2; mTS[c2] = c1;
    }
    return true;
}`,
    java: `public static boolean isIsomorphic(String s, String t) {
    if (s.length() != t.length()) return false;
    Map<Character, Character> mST = new HashMap<>(), mTS = new HashMap<>();
    for (int i = 0; i < s.length(); i++) {
        char c1 = s.charAt(i), c2 = t.charAt(i);
        if (mST.containsKey(c1) && mST.get(c1) != c2) return false;
        if (mTS.containsKey(c2) && mTS.get(c2) != c1) return false;
        mST.put(c1, c2); mTS.put(c2, c1);
    }
    return true;
}`
  },

  valid_parentheses: {
    javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let c of s) {
    if (c === '(' || c === '{' || c === '[') stack.push(c);
    else if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    }
  }
  return stack.length === 0;
}`,
    python: `def is_valid(s):
    st, m = [], {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in "({[": st.append(c)
        elif c in m:
            if not st or st.pop() != m[c]: return False
    return len(st) == 0`,
    cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> m = {{')','('}, {'}','{'}, {']','['}};
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else if (m.count(c)) {
            if (st.empty() || st.top() != m[c]) return false;
            st.pop();
        }
    }
    return st.empty();
}`,
    java: `public static boolean isValid(String s) {
    Stack<Character> st = new Stack<>();
    Map<Character, Character> m = Map.of(')', '(', '}', '{', ']', '[');
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else if (m.containsKey(c)) {
            if (st.isEmpty() || st.pop() != m.get(c)) return false;
        }
    }
    return st.isEmpty();
}`
  }
};

// INTUITIONS FOR ALL 12 PURE STRING ALGORITHMS
const INTUITIONS = {
  kmp: {
    concept: "Never re-read text you already know. When a mismatch happens, the precomputed LPS table tells you the longest prefix you can reuse without rewinding your text pointer.",
    whyItWorks: "If pattern 'ABABC' fails on 'C', you already know you matched 'ABAB'. Since 'AB' is both a prefix and suffix, you align the pattern's prefix 'AB' with the text's suffix 'AB' and resume without backtrack.",
    analogy: "Like reading a book with a bookmark: if you misread the end of a long sentence, you don't flip back to the very beginning of the chapter; you just jump back to the last recognizable clause."
  },
  rabin_karp: {
    concept: "Compare fingerprints (hashes) rather than full words. Calculating a hash takes O(1) time per step via a rolling polynomial formula.",
    whyItWorks: "If window hash doesn't equal pattern hash, they cannot possibly be the same string. Only when hashes collide do you do a slow letter-by-letter check.",
    analogy: "Like weighing suitcases at airport check-in: if a luggage weighs 42.5kg, you only open it if that matches the exact weight of the target package."
  },
  boyer_moore: {
    concept: "Scan from right to left! If the last letter doesn't exist in the pattern anywhere, you can leap forward by the entire length of the pattern in one step.",
    whyItWorks: "Right-to-left comparison detects mismatches at the rightmost character first. The bad character lookup table gives the largest safe jump.",
    analogy: "Like proofreading from the end of a word: if the last letter of a 10-letter word is 'Z' and your target word has no 'Z', you instantly skip 10 letters ahead."
  },
  longest_palindrome: {
    concept: "A palindrome is a mirror. Pick every single character (odd) and every gap between characters (even) as a center, and expand outward until the reflection breaks.",
    whyItWorks: "Every palindrome has a center. With N characters, there are 2N-1 possible centers. Expanding takes at most O(N) per center, resulting in O(N²) time and O(1) memory.",
    analogy: "Like ripples in a pond: dropping a pebble creates circles that expand symmetrically until hitting a rock."
  },
  z_algorithm: {
    concept: "Build an array Z where Z[i] is the length of the longest substring starting at index i that matches the prefix of string S.",
    whyItWorks: "By maintaining a [L, R] window (the furthest matched segment so far), you can copy previously computed Z values inside the box in O(1) time.",
    analogy: "Like photocopying a blueprint: once you trace a section, any exact clone inside the boundaries can be copied directly rather than re-measured."
  },
  levenshtein: {
    concept: "Find the minimum number of single-character edits (insertions, deletions, substitutions) required to transform Word A into Word B.",
    whyItWorks: "2D Dynamic Programming builds the optimal solution from smaller subproblems: cell (i, j) chooses the cheapest operation between Delete (top), Insert (left), or Replace (diagonal).",
    analogy: "Like auto-correct on your smartphone: calculating how many typos separate 'teh' from 'the' or 'kitten' from 'sitting'."
  },
  lcs: {
    concept: "Find the longest sequence of characters that appear in both strings in the exact same order, though not necessarily consecutively.",
    whyItWorks: "If characters match at (i, j), extend the diagonal match (dp[i-1][j-1] + 1). If they differ, take the best subsequence seen so far from top or left.",
    analogy: "Like comparing DNA strands between two organisms: finding common genetic heritage even if some genes were inserted or deleted."
  },
  anagram_search: {
    concept: "An anagram is just a scrambled permutation. Track character frequencies in a fixed sliding window of size M.",
    whyItWorks: "As the window slides right, increment the newly entered character and decrement the evicted character in O(1) time.",
    analogy: "Like holding a hand of Scrabble tiles: as you draw one tile and discard one, you check if your current hand can spell the secret target word."
  },
  run_length: {
    concept: "Count streaks of repeated consecutive characters and replace them with (count + character) to compress repetitive data.",
    whyItWorks: "Consecutive identical letters like 'AAAAAA' take 6 bytes. Replacing with '6A' takes only 2 bytes, achieving 66% compression ratio.",
    analogy: "Like shorthand note-taking: writing '5 apples' instead of writing 'apple, apple, apple, apple, apple'."
  },
  reverse_words: {
    concept: "Reverse the order of words without reversing the individual letters within the words.",
    whyItWorks: "Reversing the entire string flips word order but leaves letters backwards. Reversing each individual word restores the letters to their natural order.",
    analogy: "Like flipping a stack of books upside down, then rotating each individual book so its cover faces right-side up."
  },
  isomorphic: {
    concept: "Two strings are isomorphic if characters in S can be replaced to get T with a 1-to-1 bijection (no two characters map to the same character).",
    whyItWorks: "Dual hash maps ensure both forward (s -> t) and reverse (t -> s) uniqueness without cross-contamination.",
    analogy: "Like a cipher substitution key in a spy code: 'A' must always translate to 'X', and no other letter can also translate to 'X'."
  },
  valid_parentheses: {
    concept: "Brackets must close in Last-In, First-Out (LIFO) order. A stack records opening brackets as obligations to be met.",
    whyItWorks: "Whenever a closing bracket appears, it must correspond to the most recently opened bracket sitting on top of the stack.",
    analogy: "Like Russian nesting dolls: the innermost doll that was opened last must be the first doll you close."
  }
};

// STEP GENERATORS FOR ALL 12 PURE STRING ALGORITHMS
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
export default function StringVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const currentAlgoId = useMemo(() => {
    const valid = STRING_ALGORITHMS.find(a => a.id === algoId);
    return valid ? valid.id : 'kmp';
  }, [algoId]);

  const currentAlgo = useMemo(() => {
    return STRING_ALGORITHMS.find(a => a.id === currentAlgoId) || STRING_ALGORITHMS[0];
  }, [currentAlgoId]);

  // Customizable String Inputs
  const [textInput, setTextInput] = useState('ABABDABACDABABCABAB');
  const [patternInput, setPatternInput] = useState('ABABCABAB');
  const [secondTextInput, setSecondTextInput] = useState('sitting');

  const [isMuted, setIsMuted] = useState(false);

  // Playback state
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  // Preset configuration according to algorithm
  useEffect(() => {
    if (currentAlgoId === 'kmp') {
      setTextInput('ABABDABACDABABCABAB');
      setPatternInput('ABABCABAB');
    } else if (currentAlgoId === 'rabin_karp') {
      setTextInput('GEEKS FOR GEEKS');
      setPatternInput('GEEK');
    } else if (currentAlgoId === 'boyer_moore') {
      setTextInput('FINDINAHAYSTACKNEEDLE');
      setPatternInput('NEEDLE');
    } else if (currentAlgoId === 'longest_palindrome') {
      setTextInput('babad');
    } else if (currentAlgoId === 'z_algorithm') {
      setTextInput('aabzaa');
      setPatternInput('aa');
    } else if (currentAlgoId === 'levenshtein') {
      setTextInput('kitten');
      setSecondTextInput('sitting');
    } else if (currentAlgoId === 'lcs') {
      setTextInput('AGGTAB');
      setSecondTextInput('GXTXAYB');
    } else if (currentAlgoId === 'anagram_search') {
      setTextInput('cbaebabacd');
      setPatternInput('abc');
    } else if (currentAlgoId === 'run_length') {
      setTextInput('WWWWWWAAAAAABBBCCCC');
    } else if (currentAlgoId === 'reverse_words') {
      setTextInput('the sky is blue');
    } else if (currentAlgoId === 'isomorphic') {
      setTextInput('egg');
      setSecondTextInput('add');
    } else if (currentAlgoId === 'valid_parentheses') {
      setTextInput('{[()]}');
    }
  }, [currentAlgoId]);

  // Step computation
  const computeSteps = () => {
    let generated = [];
    if (currentAlgoId === 'kmp') {
      generated = generateKmpSteps(textInput, patternInput);
    } else if (currentAlgoId === 'rabin_karp') {
      generated = generateRabinKarpSteps(textInput, patternInput);
    } else if (currentAlgoId === 'boyer_moore') {
      generated = generateBoyerMooreSteps(textInput, patternInput);
    } else if (currentAlgoId === 'longest_palindrome') {
      generated = generatePalindromeSteps(textInput);
    } else if (currentAlgoId === 'z_algorithm') {
      generated = generateZAlgoSteps(textInput, patternInput);
    } else if (currentAlgoId === 'levenshtein') {
      generated = generateLevenshteinSteps(textInput, secondTextInput);
    } else if (currentAlgoId === 'lcs') {
      generated = generateLcsSteps(textInput, secondTextInput);
    } else if (currentAlgoId === 'anagram_search') {
      generated = generateAnagramSteps(textInput, patternInput);
    } else if (currentAlgoId === 'run_length') {
      generated = generateRleSteps(textInput);
    } else if (currentAlgoId === 'reverse_words') {
      generated = generateReverseWordsSteps(textInput);
    } else if (currentAlgoId === 'isomorphic') {
      generated = generateIsomorphicSteps(textInput, secondTextInput);
    } else if (currentAlgoId === 'valid_parentheses') {
      generated = generateParenthesesSteps(textInput);
    }
    setSteps(generated);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    computeSteps();
  }, [currentAlgoId, textInput, patternInput, secondTextInput]);

  // Ticker loop
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(80, Math.round(900 / speed));
      timerRef.current = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          const nextIdx = currentStepIdx + 1;
          setCurrentStepIdx(nextIdx);
          playSynthTone('char', isMuted);
        } else {
          setIsPlaying(false);
          playSynthTone('found', isMuted);
        }
      }, delay);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIdx, steps.length, speed, isMuted]);

  const step = steps[currentStepIdx] || {};

  // Playback Handlers (Matches VisualizerPlaybackBar props exactly!)
  const handlePlay = () => {
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      playSynthTone('char', isMuted);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      playSynthTone('char', isMuted);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  // Quick Preset Helper
  const applyPreset = (t, p = '', s2 = '') => {
    setTextInput(t);
    if (p) setPatternInput(p);
    if (s2) setSecondTextInput(s2);
    playSynthTone('char', isMuted);
  };

  // RENDER CANVASES ACCORDING TO ALGORITHM
  const renderCanvas = () => {
    // 1. KMP CANVAS
    if (currentAlgoId === 'kmp') {
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Text Array (Pointer t = {step.tIdx ?? 0})</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const isCurrent = step.tIdx === idx;
                const isMatched = step.matches && step.matches.some(m => idx >= m && idx < m + patternInput.length);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.15 : 1,
                        borderColor: isMatched ? '#10b981' : isCurrent ? '#06b6d4' : '#334155',
                        backgroundColor: isMatched ? 'rgba(16, 185, 129, 0.25)' : isCurrent ? 'rgba(6, 182, 212, 0.25)' : '#0f172a'
                      }}
                      className="w-9 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-slate-100 shadow-sm"
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Pattern Alignment (Pointer p = {step.pIdx ?? 0})</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {patternInput.split('').map((char, idx) => {
                const isP = step.pIdx === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: isP ? 1.15 : 1,
                        borderColor: isP ? '#f59e0b' : '#334155',
                        backgroundColor: isP ? 'rgba(245, 158, 11, 0.25)' : '#0f172a'
                      }}
                      className="w-9 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-amber-300 shadow-sm"
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
            <div className="text-xs font-mono font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Preprocessed LPS (Longest Prefix Suffix) Table
            </div>
            <div className="flex gap-2">
              {patternInput.split('').map((char, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">{char}</span>
                  <div className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-sm mt-1 font-bold ${
                    step.pIdx === idx ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}>
                    {step.lps ? step.lps[idx] : 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 2. RABIN-KARP CANVAS
    if (currentAlgoId === 'rabin_karp') {
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Rolling Window on Text</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const inWindow = idx >= step.windowStart && idx < step.windowStart + patternInput.length;
                const isMatch = step.matches && step.matches.includes(step.windowStart);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: inWindow ? 1.08 : 1,
                        borderColor: inWindow ? (isMatch ? '#10b981' : '#38bdf8') : '#334155',
                        backgroundColor: inWindow ? (isMatch ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)') : '#0f172a'
                      }}
                      className="w-9 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-slate-100 shadow-sm"
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <div className="p-3 bg-slate-900/90 border border-amber-500/30 rounded-xl flex flex-col items-center">
              <span className="text-xs font-mono text-slate-400">Pattern Hash ("{patternInput}")</span>
              <span className="text-2xl font-mono font-extrabold text-amber-400 mt-1">{step.pHash ?? 0}</span>
            </div>
            <div className={`p-3 bg-slate-900/90 border rounded-xl flex flex-col items-center ${
              step.hashMatch ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-cyan-500/30'
            }`}>
              <span className="text-xs font-mono text-slate-400">Current Window Hash</span>
              <span className={`text-2xl font-mono font-extrabold mt-1 ${
                step.hashMatch ? 'text-emerald-400' : 'text-cyan-400'
              }`}>{step.wHash ?? 0}</span>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
            Polynomial Rolling Hash modulo q = 101, base d = 256
          </div>
        </div>
      );
    }

    // 3. BOYER-MOORE CANVAS
    if (currentAlgoId === 'boyer_moore') {
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Text (Right-to-Left Scan)</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const inShift = idx >= step.shift && idx < step.shift + patternInput.length;
                const isScanning = step.highlightPair && step.highlightPair[0] === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: isScanning ? 1.15 : 1,
                        borderColor: isScanning ? '#f59e0b' : inShift ? '#06b6d4' : '#334155',
                        backgroundColor: isScanning ? 'rgba(245, 158, 11, 0.25)' : inShift ? 'rgba(6, 182, 212, 0.15)' : '#0f172a'
                      }}
                      className="w-9 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-slate-100 shadow-sm"
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-mono font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Bad Character Skip Table
            </div>
            <div className="flex flex-wrap gap-2">
              {patternInput.split('').map((char, idx) => (
                <div key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono">
                  <span className="text-slate-300 font-bold">{char}:</span>
                  <span className="text-cyan-400 font-extrabold">{idx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 4. LONGEST PALINDROME CANVAS
    if (currentAlgoId === 'longest_palindrome') {
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Expansion Around Centers</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const isCenter = (step.centerL === idx || step.centerR === idx);
                const isBound = (step.currL === idx || step.currR === idx);
                const inPalindrome = idx >= step.bestStart && idx <= step.bestEnd;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: isBound ? 1.15 : 1,
                        borderColor: isBound ? '#f43f5e' : isCenter ? '#e11d48' : inPalindrome ? '#10b981' : '#334155',
                        backgroundColor: inPalindrome ? 'rgba(16, 185, 129, 0.2)' : isCenter ? 'rgba(225, 29, 72, 0.2)' : '#0f172a'
                      }}
                      className="w-9 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-slate-100 shadow-sm"
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-rose-500/30 rounded-xl flex items-center gap-4">
            <Sparkles className="w-6 h-6 text-rose-400" />
            <div>
              <div className="text-xs font-mono text-slate-400">Current Longest Palindrome</div>
              <div className="text-xl font-mono font-extrabold text-rose-300 tracking-wider">
                "{step.longest || textInput[0]}"
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 5. Z-ALGORITHM CANVAS
    if (currentAlgoId === 'z_algorithm') {
      const s = step.s || textInput;
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Concatenated String S = P + "$" + T</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {s.split('').map((char, idx) => {
                const inBox = idx >= step.l && idx <= step.r && step.r > 0;
                const isI = step.i === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: isI ? 1.15 : 1,
                        borderColor: isI ? '#f59e0b' : inBox ? '#8b5cf6' : '#334155',
                        backgroundColor: inBox ? 'rgba(139, 92, 246, 0.2)' : '#0f172a'
                      }}
                      className="w-9 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-slate-100 shadow-sm"
                    >
                      {char}
                    </motion.div>
                    <div className="w-8 h-7 mt-1 border border-slate-700 bg-slate-800/80 rounded flex items-center justify-center font-mono text-xs text-purple-300 font-bold">
                      {step.z ? step.z[idx] : 0}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Z-Box: [L={step.l ?? 0}, R={step.r ?? 0}] | Purple numbers below characters denote Z[i]
          </div>
        </div>
      );
    }

    // 6. LEVENSHTEIN CANVAS
    if (currentAlgoId === 'levenshtein') {
      const dp = step.dp || [];
      return (
        <div className="flex flex-col items-center gap-4 w-full py-2 overflow-x-auto">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400">2D Dynamic Programming Edit Distance Grid</div>
          <div className="inline-block border border-slate-800 rounded-xl overflow-hidden bg-slate-950 p-2 shadow-2xl">
            <table className="border-collapse font-mono text-xs">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-800 bg-slate-900 text-slate-500"></th>
                  <th className="p-2 border border-slate-800 bg-slate-900 text-slate-400">Ø</th>
                  {secondTextInput.split('').map((c, j) => (
                    <th key={j} className="p-2 border border-slate-800 bg-slate-900 text-cyan-400 font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 border border-slate-800 bg-slate-900 text-amber-400 font-bold">
                      {i === 0 ? 'Ø' : textInput[i - 1]}
                    </td>
                    {row.map((val, j) => {
                      const isActive = step.activeI === i && step.activeJ === j;
                      return (
                        <td
                          key={j}
                          className={`p-2 text-center border font-bold ${
                            isActive
                              ? 'border-cyan-400 bg-cyan-500/30 text-white scale-105 transition-transform'
                              : 'border-slate-800/80 text-slate-300 bg-slate-900/40'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // 7. LCS CANVAS
    if (currentAlgoId === 'lcs') {
      const dp = step.dp || [];
      return (
        <div className="flex flex-col items-center gap-4 w-full py-2 overflow-x-auto">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400">2D LCS Subsequence Grid</div>
          <div className="inline-block border border-slate-800 rounded-xl overflow-hidden bg-slate-950 p-2 shadow-2xl">
            <table className="border-collapse font-mono text-xs">
              <thead>
                <tr>
                  <th className="p-2 border border-slate-800 bg-slate-900 text-slate-500"></th>
                  <th className="p-2 border border-slate-800 bg-slate-900 text-slate-400">Ø</th>
                  {secondTextInput.split('').map((c, j) => (
                    <th key={j} className="p-2 border border-slate-800 bg-slate-900 text-emerald-400 font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 border border-slate-800 bg-slate-900 text-indigo-400 font-bold">
                      {i === 0 ? 'Ø' : textInput[i - 1]}
                    </td>
                    {row.map((val, j) => {
                      const isActive = step.activeI === i && step.activeJ === j;
                      return (
                        <td
                          key={j}
                          className={`p-2 text-center border font-bold ${
                            isActive
                              ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200'
                              : 'border-slate-800/80 text-slate-300 bg-slate-900/40'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {step.lcsResult && (
            <div className="p-3 bg-slate-900 border border-emerald-500/40 rounded-xl font-mono text-sm text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Common Subsequence: <strong>"{step.lcsResult}"</strong>
            </div>
          )}
        </div>
      );
    }

    // 8. ANAGRAM SEARCH CANVAS
    if (currentAlgoId === 'anagram_search') {
      const pMap = step.pMap || {};
      const wMap = step.wMap || {};
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Sliding Frequency Window</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const inWin = idx >= step.windowStart && idx < step.windowStart + patternInput.length;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: inWin ? 1.1 : 1,
                        borderColor: inWin ? (step.isMatch ? '#10b981' : '#f59e0b') : '#334155',
                        backgroundColor: inWin ? (step.isMatch ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)') : '#0f172a'
                      }}
                      className="w-9 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-slate-100 shadow-sm"
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-xs font-mono text-slate-400 mb-1.5 font-bold">Pattern Frequency:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(pMap).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-amber-300">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-xs font-mono text-slate-400 mb-1.5 font-bold">Window Frequency:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(wMap).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono text-cyan-300">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 9. RUN-LENGTH ENCODING CANVAS
    if (currentAlgoId === 'run_length') {
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Original Character Stream</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const isCurrent = step.currentIdx === idx;
                return (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                      borderColor: isCurrent ? '#06b6d4' : '#334155',
                      backgroundColor: isCurrent ? 'rgba(6, 182, 212, 0.25)' : '#0f172a'
                    }}
                    className="w-9 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-slate-100 shadow-sm"
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-md p-4 bg-slate-900 border border-cyan-500/30 rounded-xl flex flex-col items-center">
            <div className="text-xs font-mono text-slate-400 mb-1">Compressed Output Stream</div>
            <div className="text-2xl font-mono font-extrabold text-cyan-400 tracking-wider">
              {step.encoded || '—'}
            </div>
          </div>
        </div>
      );
    }

    // 10. REVERSE WORDS CANVAS
    if (currentAlgoId === 'reverse_words') {
      const words = step.words || textInput.trim().split(/\s+/);
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400">Two-Pointer Word Reversal</div>
          <div className="flex flex-wrap gap-3 justify-center p-3">
            {words.map((w, idx) => {
              const isL = step.left === idx;
              const isR = step.right === idx;
              return (
                <motion.div
                  key={idx}
                  animate={{
                    scale: (isL || isR) ? 1.1 : 1,
                    borderColor: (isL || isR) ? '#f59e0b' : '#334155',
                    backgroundColor: (isL || isR) ? 'rgba(245, 158, 11, 0.2)' : '#0f172a'
                  }}
                  className="px-4 py-2.5 rounded-xl border font-mono font-bold text-lg text-slate-100 shadow-md"
                >
                  {w}
                  {(isL || isR) && (
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5 text-center">
                      {isL ? 'PTR L' : 'PTR R'}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    // 11. ISOMORPHIC CANVAS
    if (currentAlgoId === 'isomorphic') {
      const mapST = step.mapST || {};
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {textInput.split('').map((c, i) => (
                <div key={i} className={`w-9 h-9 rounded border flex items-center justify-center font-mono font-bold ${
                  step.index === i ? 'border-indigo-400 bg-indigo-500/30 text-white' : 'border-slate-700 bg-slate-800 text-slate-200'
                }`}>
                  {c}
                </div>
              ))}
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />
            <div className="flex gap-2">
              {secondTextInput.split('').map((c, i) => (
                <div key={i} className={`w-9 h-9 rounded border flex items-center justify-center font-mono font-bold ${
                  step.index === i ? 'border-indigo-400 bg-indigo-500/30 text-white' : 'border-slate-700 bg-slate-800 text-slate-200'
                }`}>
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-xs font-mono font-bold text-indigo-400 mb-2">Registered 1-to-1 Bijection Mappings:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(mapST).map(([k, v]) => (
                <span key={k} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-200">
                  '{k}' ➔ '{v}'
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 12. VALID PARENTHESES CANVAS
    if (currentAlgoId === 'valid_parentheses') {
      const stack = step.stack || [];
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Bracket Stream</div>
            <div className="flex flex-wrap gap-2 justify-center p-2">
              {textInput.split('').map((c, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    scale: step.idx === idx ? 1.2 : 1,
                    borderColor: step.idx === idx ? '#06b6d4' : '#334155',
                    backgroundColor: step.idx === idx ? 'rgba(6, 182, 212, 0.25)' : '#0f172a'
                  }}
                  className="w-9 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-slate-100 shadow-sm"
                >
                  {c}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-xs font-mono text-slate-400 mb-2">LIFO Stack (Top on Top)</div>
            <div className="w-24 min-h-[140px] border-b-2 border-l-2 border-r-2 border-cyan-500/50 bg-slate-950/80 rounded-b-xl flex flex-col-reverse items-center p-2 gap-1.5 shadow-inner">
              <AnimatePresence>
                {stack.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="w-16 h-8 rounded bg-cyan-600/30 border border-cyan-400 flex items-center justify-center font-mono font-bold text-cyan-200"
                  >
                    {item}
                  </motion.div>
                ))}
              </AnimatePresence>
              {stack.length === 0 && (
                <span className="text-[11px] font-mono text-slate-600 mt-auto mb-auto">Empty</span>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      category="String Algorithms"
      headerRight={
        <div className="flex items-center gap-3">
          <select
            value={currentAlgoId}
            onChange={(e) => navigate(`/visualizer/string/${e.target.value}`)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {STRING_ALGORITHMS.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <Link
            to="/visualizer/string"
            className="text-xs px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-mono transition-colors"
          >
            All Algorithms
          </Link>
        </div>
      }
      controls={
        <div className="flex flex-col gap-3.5 w-full">
          {/* USER INTERACTION BAR: CUSTOM STRING & PATTERN INPUTS */}
          <div className="flex flex-col gap-3 p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
            
            {/* Row 1: Inputs and Compute button */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Main String Input */}
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {currentAlgoId === 'levenshtein' || currentAlgoId === 'lcs' || currentAlgoId === 'isomorphic' ? 'Word 1:' : currentAlgoId === 'reverse_words' ? 'Sentence:' : currentAlgoId === 'valid_parentheses' ? 'Brackets:' : 'Main String:'}
                </span>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 shadow-inner"
                  placeholder="Type any custom string..."
                />
                <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                  {textInput.length} chars
                </span>
              </div>

              {/* Second Input for Pattern or Word 2 */}
              {(currentAlgoId === 'kmp' || currentAlgoId === 'rabin_karp' || currentAlgoId === 'boyer_moore' || currentAlgoId === 'z_algorithm' || currentAlgoId === 'anagram_search') && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" /> Pattern:
                  </span>
                  <input
                    type="text"
                    value={patternInput}
                    onChange={(e) => setPatternInput(e.target.value)}
                    className="w-36 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 shadow-inner"
                    placeholder="Search pattern..."
                  />
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                    {patternInput.length}
                  </span>
                </div>
              )}

              {(currentAlgoId === 'levenshtein' || currentAlgoId === 'lcs' || currentAlgoId === 'isomorphic') && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">Word 2:</span>
                  <input
                    type="text"
                    value={secondTextInput}
                    onChange={(e) => setSecondTextInput(e.target.value)}
                    className="w-36 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 shadow-inner"
                    placeholder="Second string..."
                  />
                </div>
              )}

              <button
                onClick={computeSteps}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" /> Run Algorithm
              </button>
            </div>

            {/* Row 2: Quick Presets Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-500">Quick Presets:</span>
              {currentAlgoId === 'kmp' && (
                <>
                  <button onClick={() => applyPreset('ABABDABACDABABCABAB', 'ABABCABAB')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Default LPS</button>
                  <button onClick={() => applyPreset('ATCGATCGAATCGATCG', 'AATC')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">DNA Sequence</button>
                  <button onClick={() => applyPreset('AAAAABAAAAAB', 'AAAAB')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Repeated Prefix</button>
                </>
              )}
              {currentAlgoId === 'rabin_karp' && (
                <>
                  <button onClick={() => applyPreset('GEEKS FOR GEEKS', 'GEEK')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Geeks</button>
                  <button onClick={() => applyPreset('ALGOVERSE IS AWESOME', 'ALGO')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Algoverse</button>
                </>
              )}
              {currentAlgoId === 'boyer_moore' && (
                <>
                  <button onClick={() => applyPreset('FINDINAHAYSTACKNEEDLE', 'NEEDLE')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Needle in Haystack</button>
                  <button onClick={() => applyPreset('MICROPROCESSOR ARCHITECTURE', 'ROC')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Microprocessor</button>
                </>
              )}
              {currentAlgoId === 'longest_palindrome' && (
                <>
                  <button onClick={() => applyPreset('babad')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">babad</button>
                  <button onClick={() => applyPreset('racecar')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">racecar</button>
                  <button onClick={() => applyPreset('cbbd')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">cbbd</button>
                  <button onClick={() => applyPreset('deified')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">deified</button>
                </>
              )}
              {currentAlgoId === 'levenshtein' && (
                <>
                  <button onClick={() => applyPreset('kitten', '', 'sitting')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">kitten ➔ sitting</button>
                  <button onClick={() => applyPreset('sunday', '', 'saturday')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">sunday ➔ saturday</button>
                </>
              )}
              {currentAlgoId === 'lcs' && (
                <>
                  <button onClick={() => applyPreset('AGGTAB', '', 'GXTXAYB')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">AGGTAB vs GXTXAYB</button>
                  <button onClick={() => applyPreset('ABCDE', '', 'ACE')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">ABCDE vs ACE</button>
                </>
              )}
              {currentAlgoId === 'valid_parentheses' && (
                <>
                  <button onClick={() => applyPreset('{[()]}')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Valid: &#123;[()]&#125;</button>
                  <button onClick={() => applyPreset('()[]{}')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Pairs: ()[]&#123;&#125;</button>
                  <button onClick={() => applyPreset('(]')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Invalid: (]</button>
                  <button onClick={() => applyPreset('([)]')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Crossed: ([)]</button>
                </>
              )}
              {currentAlgoId === 'run_length' && (
                <>
                  <button onClick={() => applyPreset('WWWWWWAAAAAABBBCCCC')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Run Heavy</button>
                  <button onClick={() => applyPreset('AAABBAAAACCCC')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">Alternating</button>
                </>
              )}
              {currentAlgoId === 'reverse_words' && (
                <>
                  <button onClick={() => applyPreset('the sky is blue')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">the sky is blue</button>
                  <button onClick={() => applyPreset('algoverse makes dsa visual')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700">algoverse makes dsa visual</button>
                </>
              )}
            </div>
          </div>

          {/* Core Playback Controller with Exact Prop Binding */}
          <VisualizerPlaybackBar
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onReset={handleReset}
            speed={speed}
            onSpeedChange={setSpeed}
            currentStep={currentStepIdx}
            totalSteps={steps.length}
            stepDescription={step.status || ''}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Step Explanation Callout */}
        <div className="p-3.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl flex items-start gap-3 shadow-lg">
          <Activity className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Step {currentStepIdx + 1} of {Math.max(1, steps.length)}
            </span>
            <span className="text-sm font-mono text-slate-200 mt-0.5 leading-relaxed">
              {step.status || "Click Play or Step Forward to begin simulation."}
            </span>
          </div>
        </div>

        {/* Live Canvas */}
        <div className="min-h-[280px] flex items-center justify-center bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
          {renderCanvas()}
        </div>

        {/* Intuition (ELI5) Card */}
        {INTUITIONS[currentAlgoId] && (
          <div className="p-5 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
              <Lightbulb className="w-5 h-5" /> Intuition & ELI5: {currentAlgo.name}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">How To Think About It</span>
                <p className="text-xs text-slate-300 leading-relaxed">{INTUITIONS[currentAlgoId].concept}</p>
              </div>
              <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">Why It Works</span>
                <p className="text-xs text-slate-300 leading-relaxed">{INTUITIONS[currentAlgoId].whyItWorks}</p>
              </div>
              <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <span className="text-xs font-mono font-bold text-amber-400 block mb-1">Real-World Metaphor</span>
                <p className="text-xs text-slate-300 leading-relaxed">{INTUITIONS[currentAlgoId].analogy}</p>
              </div>
            </div>
          </div>
        )}

        {/* Complexity Badges */}
        <div className="flex flex-wrap gap-4 items-center">
          <ComplexityBadge type="time" complexity={currentAlgo.complexity?.time?.average || currentAlgo.tag} />
          <ComplexityBadge type="space" complexity={currentAlgo.complexity?.space || "O(1)"} />
        </div>

        {/* Code Inspector */}
        {CODE_SNIPPETS[currentAlgoId] && (
          <CodeInspector snippets={CODE_SNIPPETS[currentAlgoId]} />
        )}
      </div>
    </ResponsiveVisualizerShell>
  );
}
