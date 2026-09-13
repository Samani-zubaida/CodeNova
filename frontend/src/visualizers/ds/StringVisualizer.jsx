import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Search, Compass, Layers, CheckCircle, AlertCircle, Type, Sparkles,
  Hash, ArrowRight, ArrowLeft, RefreshCw, Eye, CornerDownRight, Database,
  Sliders, Activity, Cpu, Lightbulb, Zap, ShieldCheck, HelpCircle, Key, FileText, Award, Check, X, Flame
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';
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

// Pedagogical HUD Helper to explain WHY each step happens in String algorithms
const getStringHUDInfo = (algoId, step, text, pattern, s2) => {
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
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

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
      const delay = Math.max(180, Math.round(1500 / speed));
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

  // RENDER CANVASES ACCORDING TO ALGORITHM WITH EDUCATIONAL ALIGNMENT
  const renderCanvas = () => {
    // 1. KMP CANVAS (DIRECT SLIDING ALIGNMENT + LASER CONNECTOR + INTERACTIVE LPS)
    if (currentAlgoId === 'kmp') {
      const cellStride = 46; // 40px cell + 6px gap
      const pOffset = ((step.tIdx ?? 0) - (step.pIdx ?? 0)) * cellStride;
      const isCharMatch = step.status?.includes('Match:');
      const isCharMismatch = step.status?.includes('Mismatch:');
      const currentTChar = textInput[step.tIdx ?? 0];
      const currentPChar = patternInput[step.pIdx ?? 0];

      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          {/* Active Comparison Laser HUD Callout */}
          <div className="w-full max-w-xl p-3 bg-white dark:bg-[#423834]/90 border border-cyan-500/40 rounded-2xl shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gray-500 dark:text-[#BCA297]">Comparing:</span>
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-mono text-xs font-bold">
                Text[t={step.tIdx ?? 0}]: '{currentTChar ?? ''}'
              </span>
              <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297] font-extrabold">vs</span>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-400 text-amber-200 font-mono text-xs font-bold">
                Pattern[p={step.pIdx ?? 0}]: '{currentPChar ?? ''}'
              </span>
            </div>
            {isCharMatch ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> MATCH (Advance t, p)
              </span>
            ) : isCharMismatch ? (
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-400 text-rose-300 text-xs font-mono font-bold flex items-center gap-1 animate-pulse">
                <X className="w-3.5 h-3.5" /> MISMATCH (Consult LPS)
              </span>
            ) : (
              <span className="text-xs font-mono text-slate-500">Aligning...</span>
            )}
          </div>

          {/* Interactive Aligned Canvas Tracks */}
          <div className="w-full max-w-3xl overflow-x-auto p-4 bg-white dark:bg-[#331921]/80 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl flex flex-col gap-6 relative">
            {/* Track 1: Text String Array */}
            <div className="flex flex-col">
              <div className="text-xs font-mono text-cyan-400 font-bold mb-2 flex items-center justify-between">
                <span>Text Array (Pointer t = {step.tIdx ?? 0})</span>
                <span className="text-[10px] text-slate-500">Indices 0 to {textInput.length - 1}</span>
              </div>
              <div className="flex gap-1.5 relative">
                {textInput.split('').map((char, idx) => {
                  const isCurrent = step.tIdx === idx;
                  const isMatched = step.matches && step.matches.some(m => idx >= m && idx < m + patternInput.length);
                  return (
                    <div key={idx} className="flex flex-col items-center min-w-[40px]">
                      <span className={`text-[10px] font-mono mb-1 font-semibold ${isCurrent ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                        {idx}
                      </span>
                      <motion.div
                        animate={{
                          scale: isCurrent ? 1.15 : 1,
                          borderColor: isMatched ? '#10b981' : isCurrent ? '#06b6d4' : '#334155',
                          backgroundColor: isMatched ? 'rgba(16, 185, 129, 0.25)' : isCurrent ? 'rgba(6, 182, 212, 0.25)' : '#423834'
                        }}
                        className={`w-10 h-12 rounded-xl border flex items-center justify-center font-mono font-extrabold text-base shadow-md ${
                          isMatched ? 'text-emerald-200' : isCurrent ? 'text-cyan-200 ring-2 ring-cyan-400/50' : 'text-[#2D1F23] dark:text-[#F4EBC3]'
                        }`}
                      >
                        {char}
                      </motion.div>
                      {isCurrent && (
                        <span className="text-[9px] font-mono text-cyan-400 font-bold mt-1">▲ t</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vertical Comparison Laser Beam */}
            {step.phase === 'search' && step.tIdx !== undefined && step.pIdx !== undefined && (
              <div className="w-full flex items-center justify-center my-[-8px]">
                <div className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold flex items-center gap-1.5 border shadow-lg ${
                  isCharMatch ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border-rose-400 text-rose-300'
                }`}>
                  {isCharMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {isCharMatch ? 'Characters Match' : 'Mismatch: Trigger LPS Jump'}
                </div>
              </div>
            )}

            {/* Track 2: Aligned Sliding Pattern Array */}
            <div className="flex flex-col">
              <div className="text-xs font-mono text-amber-400 font-bold mb-2 flex items-center justify-between">
                <span>Pattern Sliding Track (Pointer p = {step.pIdx ?? 0})</span>
                <span className="text-[10px] text-slate-500">Aligned under Text at offset {pOffset / cellStride} chars</span>
              </div>
              <div className="relative overflow-visible" style={{ height: '70px' }}>
                <motion.div
                  animate={{ x: pOffset }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="flex gap-1.5 absolute top-0 left-0"
                >
                  {patternInput.split('').map((char, idx) => {
                    const isP = step.pIdx === idx;
                    return (
                      <div key={idx} className="flex flex-col items-center min-w-[40px]">
                        <span className={`text-[10px] font-mono mb-1 font-semibold ${isP ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                          p={idx}
                        </span>
                        <motion.div
                          animate={{
                            scale: isP ? 1.15 : 1,
                            borderColor: isP ? '#f59e0b' : '#475569',
                            backgroundColor: isP ? 'rgba(245, 158, 11, 0.25)' : '#1e293b'
                          }}
                          className={`w-10 h-12 rounded-xl border flex items-center justify-center font-mono font-extrabold text-base shadow-md ${
                            isP ? 'text-amber-200 ring-2 ring-amber-400/50' : 'text-[#2D1F23] dark:text-[#F0E2A4]'
                          }`}
                        >
                          {char}
                        </motion.div>
                        {isP && (
                          <span className="text-[9px] font-mono text-amber-400 font-bold mt-1">▲ p</span>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Preprocessed LPS Table with Interactive Pointer */}
          <div className="w-full max-w-xl bg-white dark:bg-[#423834]/90 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-5 flex flex-col items-center shadow-xl">
            <div className="text-xs font-mono font-bold text-cyan-400 mb-3 flex items-center justify-between w-full">
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> Preprocessed LPS (Longest Prefix Suffix) Table</span>
              <span className="text-[10px] text-gray-500 dark:text-[#BCA297] font-normal">LPS[p-1] determines jump on mismatch</span>
            </div>
            <div className="flex gap-2.5">
              {patternInput.split('').map((char, idx) => {
                const isActiveLps = step.pIdx !== undefined && (idx === step.pIdx || idx === step.pIdx - 1);
                const lpsVal = step.lps ? step.lps[idx] : 0;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs font-mono text-[#2D1F23] dark:text-[#F0E2A4] font-bold">{char}</span>
                    <span className="text-[9px] font-mono text-slate-500">[{idx}]</span>
                    <motion.div
                      animate={{
                        scale: isActiveLps ? 1.15 : 1,
                        borderColor: isActiveLps ? '#22d3ee' : '#334155',
                        backgroundColor: isActiveLps ? 'rgba(6, 182, 212, 0.25)' : '#1e293b'
                      }}
                      className="w-9 h-9 rounded-xl border flex items-center justify-center font-mono text-sm mt-1 font-extrabold text-[#2D1F23] dark:text-[#F4EBC3] shadow-sm"
                    >
                      {lpsVal}
                    </motion.div>
                  </div>
                );
              })}
            </div>
            {isCharMismatch && step.pIdx > 0 && (
              <div className="mt-3 text-xs font-mono text-amber-300 bg-amber-950/30 border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                LPS[{step.pIdx - 1}] = {step.lps?.[step.pIdx - 1] ?? 0} ➔ Slide pattern so prefix matches suffix without rewinding text!
              </div>
            )}
          </div>
        </div>
      );
    }

    // 2. RABIN-KARP CANVAS (SLIDING WINDOW BRACKET + LIVE ROLLING MATH)
    if (currentAlgoId === 'rabin_karp') {
      const wStart = step.windowStart ?? 0;
      const wEnd = wStart + patternInput.length;
      const currentWinStr = textInput.substring(wStart, wEnd);

      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          {/* Side-by-Side Hash Inspector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="p-4 bg-white dark:bg-[#423834]/90 border border-amber-500/40 rounded-2xl flex flex-col items-center shadow-lg">
              <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297]">Target Pattern Hash ("{patternInput}")</span>
              <span className="text-2xl font-mono font-extrabold text-amber-400 mt-1">{step.pHash ?? 0}</span>
            </div>
            <div className={`p-4 bg-white dark:bg-[#423834]/90 border rounded-2xl flex flex-col items-center shadow-lg transition-all ${
              step.hashMatch ? 'border-emerald-400 bg-emerald-950/30 ring-2 ring-emerald-500/40' : 'border-cyan-500/40'
            }`}>
              <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297]">Current Window Hash ("{currentWinStr}")</span>
              <span className={`text-2xl font-mono font-extrabold mt-1 ${
                step.hashMatch ? 'text-emerald-300' : 'text-cyan-400'
              }`}>{step.wHash ?? 0}</span>
            </div>
          </div>

          {/* Text String with Physical Sliding Bracket */}
          <div className="w-full max-w-3xl overflow-x-auto p-4 bg-white dark:bg-[#331921]/80 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl flex flex-col items-center">
            <div className="text-xs font-mono text-gray-500 dark:text-[#BCA297] mb-3 font-semibold">
              Text Array with Sliding Substring Frame [Window {wStart} to {wEnd - 1}]
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full">
              {textInput.split('').map((char, idx) => {
                const inWindow = idx >= wStart && idx < wEnd;
                const isMatch = step.matches && step.matches.includes(wStart);
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className={`text-[10px] font-mono mb-1 ${inWindow ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                      {idx}
                    </span>
                    <motion.div
                      animate={{
                        scale: inWindow ? 1.12 : 1,
                        borderColor: inWindow ? (step.hashMatch ? '#10b981' : '#38bdf8') : '#334155',
                        backgroundColor: inWindow ? (step.hashMatch ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.2)') : '#423834'
                      }}
                      className={`w-10 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-base shadow-sm ${
                        inWindow ? 'text-white' : 'text-[#2D1F23] dark:text-[#F0E2A4]'
                      }`}
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rolling Hash Formula Banner */}
          <div className="w-full max-w-xl p-3 bg-white dark:bg-[#423834]/80 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl flex items-center justify-between text-xs font-mono text-[#2D1F23] dark:text-[#F0E2A4]">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Rolling Math:
            </span>
            <span className="text-gray-500 dark:text-[#BCA297]">
              Hash = ((OldHash - OutChar × d<sup>m-1</sup>) × d + InChar) % q
            </span>
          </div>
        </div>
      );
    }

    // 3. BOYER-MOORE CANVAS
    if (currentAlgoId === 'boyer_moore') {
      const wStart = step.shift ?? 0;
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-500 dark:text-[#BCA297] mb-2">Right-to-Left Scanning Window</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const inWin = idx >= wStart && idx < wStart + patternInput.length;
                const isCheck = step.textIdx === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: isCheck ? 1.15 : inWin ? 1.05 : 1,
                        borderColor: isCheck ? '#06b6d4' : inWin ? '#f59e0b' : '#334155',
                        backgroundColor: isCheck ? 'rgba(6, 182, 212, 0.25)' : inWin ? 'rgba(245, 158, 11, 0.15)' : '#423834'
                      }}
                      className="w-10 h-11 rounded-xl border flex items-center justify-center font-mono font-bold text-[#2D1F23] dark:text-[#F4EBC3] shadow-sm"
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-lg bg-white dark:bg-[#423834]/90 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-4 shadow-md">
            <div className="text-xs font-mono font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Bad Character Last Occurrence Table
            </div>
            <div className="flex flex-wrap gap-2">
              {patternInput.split('').map((char, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg text-xs font-mono">
                  <span className="text-[#2D1F23] dark:text-[#F0E2A4] font-bold">{char}:</span>
                  <span className="text-cyan-400 font-extrabold">{idx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 4. LONGEST PALINDROME CANVAS (EXPANDING WINGS & CHAMPION TROPHY)
    if (currentAlgoId === 'longest_palindrome') {
      const bestStr = step.longest || textInput[0] || '';
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          {/* Champion Palindrome Trophy Card */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-rose-500/40 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-gray-500 dark:text-[#BCA297]">Current Longest Palindrome</div>
              <div className="text-2xl font-mono font-extrabold text-rose-300 tracking-wider">
                "{bestStr}" <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297] font-normal">({bestStr.length} characters)</span>
              </div>
            </div>
          </div>

          {/* Text String with Expanding Center & Wings */}
          <div className="w-full max-w-3xl overflow-x-auto p-4 bg-white dark:bg-[#331921]/80 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl flex flex-col items-center">
            <div className="text-xs font-mono text-gray-500 dark:text-[#BCA297] mb-3 font-semibold">
              Expanding Outward from Center [left = {step.currL ?? 0}, right = {step.currR ?? 0}]
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-full">
              {textInput.split('').map((char, idx) => {
                const isCenter = (step.centerL === idx || step.centerR === idx);
                const isLeftWing = step.currL === idx;
                const isRightWing = step.currR === idx;
                const inBestPalindrome = idx >= step.bestStart && idx <= step.bestEnd;

                return (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Top Marker Badges */}
                    <div className="h-5 flex items-center gap-1 mb-1">
                      {isCenter && (
                        <span className="px-1.5 py-0.5 bg-rose-500/20 border border-rose-400 rounded text-[9px] font-mono text-rose-300 font-bold">
                          📍
                        </span>
                      )}
                      {isLeftWing && (
                        <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-400 rounded text-[9px] font-mono text-amber-300 font-bold">
                          ⇦ L
                        </span>
                      )}
                      {isRightWing && (
                        <span className="px-1.5 py-0.5 bg-cyan-500/20 border border-cyan-400 rounded text-[9px] font-mono text-cyan-300 font-bold">
                          R ⇨
                        </span>
                      )}
                    </div>

                    <motion.div
                      animate={{
                        scale: (isLeftWing || isRightWing) ? 1.2 : isCenter ? 1.1 : 1,
                        borderColor: (isLeftWing || isRightWing) ? '#f43f5e' : isCenter ? '#e11d48' : inBestPalindrome ? '#10b981' : '#334155',
                        backgroundColor: (isLeftWing || isRightWing) ? 'rgba(244, 63, 94, 0.3)' : inBestPalindrome ? 'rgba(16, 185, 129, 0.2)' : isCenter ? 'rgba(225, 29, 72, 0.2)' : '#423834'
                      }}
                      className={`w-11 h-12 rounded-xl border flex items-center justify-center font-mono font-extrabold text-base shadow-md ${
                        (isLeftWing || isRightWing) ? 'text-rose-200' : inBestPalindrome ? 'text-emerald-200' : 'text-[#2D1F23] dark:text-[#F4EBC3]'
                      }`}
                    >
                      {char}
                    </motion.div>

                    <span className="text-[10px] font-mono text-slate-500 mt-1">{idx}</span>
                  </div>
                );
              })}
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
            <div className="text-xs uppercase font-mono tracking-wider text-gray-500 dark:text-[#BCA297] mb-2">Concatenated String S = P + "$" + T</div>
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
                        backgroundColor: inBox ? 'rgba(139, 92, 246, 0.2)' : '#423834'
                      }}
                      className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold text-[#2D1F23] dark:text-[#F4EBC3] shadow-sm"
                    >
                      {char}
                    </motion.div>
                    <div className="w-8 h-7 mt-1 border border-[#EBE0D3] dark:border-[#5C4E49] bg-gray-100 dark:bg-[#5C4E49]/80 rounded flex items-center justify-center font-mono text-xs text-purple-300 font-bold">
                      {step.z ? step.z[idx] : 0}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-xs font-mono text-gray-500 dark:text-[#BCA297]">
            Z-Box: [L={step.l ?? 0}, R={step.r ?? 0}] | Purple numbers below characters denote Z[i]
          </div>
        </div>
      );
    }

    // 6. LEVENSHTEIN CANVAS (2D DP GRID)
    if (currentAlgoId === 'levenshtein') {
      const dp = step.dp || [];
      return (
        <div className="flex flex-col items-center gap-4 w-full py-2 overflow-x-auto">
          <div className="text-xs uppercase font-mono tracking-wider text-gray-500 dark:text-[#BCA297]">2D Dynamic Programming Edit Distance Grid</div>
          <div className="inline-block border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl overflow-hidden bg-white dark:bg-[#331921] p-3 shadow-2xl">
            <table className="border-collapse font-mono text-xs">
              <thead>
                <tr>
                  <th className="p-2.5 border border-[#EBE0D3] dark:border-[#5C4E49] bg-white dark:bg-[#423834] text-slate-500"></th>
                  <th className="p-2.5 border border-[#EBE0D3] dark:border-[#5C4E49] bg-white dark:bg-[#423834] text-gray-500 dark:text-[#BCA297]">ε</th>
                  {secondTextInput.split('').map((c, j) => (
                    <th key={j} className="p-2.5 border border-[#EBE0D3] dark:border-[#5C4E49] bg-white dark:bg-[#423834] text-cyan-400 font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2.5 border border-[#EBE0D3] dark:border-[#5C4E49] bg-white dark:bg-[#423834] text-amber-400 font-bold">
                      {i === 0 ? 'ε' : textInput[i - 1]}
                    </td>
                    {row.map((val, j) => {
                      const isActive = step.activeI === i && step.activeJ === j;
                      return (
                        <td
                          key={j}
                          className={`p-2.5 text-center border font-bold min-w-[36px] transition-all ${
                            isActive
                              ? 'border-cyan-400 bg-cyan-500/30 text-white scale-110 ring-2 ring-cyan-400/50'
                              : 'border-[#EBE0D3] dark:border-[#5C4E49]/80 text-[#2D1F23] dark:text-[#F0E2A4] bg-white dark:bg-[#423834]/40'
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
          <div className="text-xs uppercase font-mono tracking-wider text-gray-500 dark:text-[#BCA297]">Longest Common Subsequence DP Matrix</div>
          <div className="inline-block border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl overflow-hidden bg-white dark:bg-[#331921] p-3 shadow-2xl">
            <table className="border-collapse font-mono text-xs">
              <thead>
                <tr>
                  <th className="p-2.5 border border-[#EBE0D3] dark:border-[#5C4E49] bg-white dark:bg-[#423834] text-slate-500"></th>
                  <th className="p-2.5 border border-[#EBE0D3] dark:border-[#5C4E49] bg-white dark:bg-[#423834] text-gray-500 dark:text-[#BCA297]">ε</th>
                  {secondTextInput.split('').map((c, j) => (
                    <th key={j} className="p-2.5 border border-[#EBE0D3] dark:border-[#5C4E49] bg-white dark:bg-[#423834] text-emerald-400 font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2.5 border border-[#EBE0D3] dark:border-[#5C4E49] bg-white dark:bg-[#423834] text-cyan-400 font-bold">
                      {i === 0 ? 'ε' : textInput[i - 1]}
                    </td>
                    {row.map((val, j) => {
                      const isActive = step.activeI === i && step.activeJ === j;
                      return (
                        <td
                          key={j}
                          className={`p-2.5 text-center border font-bold min-w-[36px] ${
                            isActive
                              ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200 scale-110 ring-2 ring-emerald-400/50'
                              : 'border-[#EBE0D3] dark:border-[#5C4E49]/80 text-[#2D1F23] dark:text-[#F0E2A4] bg-white dark:bg-[#423834]/40'
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

    // 8. ANAGRAM SEARCH CANVAS
    if (currentAlgoId === 'anagram_search') {
      const pMap = step.pMap || {};
      const wMap = step.wMap || {};
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-500 dark:text-[#BCA297] mb-2">Sliding Frequency Window</div>
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
                        backgroundColor: inWin ? (step.isMatch ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.15)') : '#423834'
                      }}
                      className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold text-[#2D1F23] dark:text-[#F4EBC3] shadow-sm"
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <div className="p-3 bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl">
              <div className="text-xs font-mono text-gray-500 dark:text-[#BCA297] mb-1.5 font-bold">Pattern Frequency:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(pMap).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 bg-gray-100 dark:bg-[#5C4E49] rounded text-xs font-mono text-amber-300">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl">
              <div className="text-xs font-mono text-gray-500 dark:text-[#BCA297] mb-1.5 font-bold">Window Frequency:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(wMap).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 bg-gray-100 dark:bg-[#5C4E49] rounded text-xs font-mono text-cyan-300">
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
            <div className="text-xs uppercase font-mono tracking-wider text-gray-500 dark:text-[#BCA297] mb-2">Original Character Stream</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const isCurrent = step.currentIdx === idx;
                return (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                      borderColor: isCurrent ? '#06b6d4' : '#334155',
                      backgroundColor: isCurrent ? 'rgba(6, 182, 212, 0.25)' : '#423834'
                    }}
                    className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold text-[#2D1F23] dark:text-[#F4EBC3] shadow-sm"
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-md p-4 bg-white dark:bg-[#423834] border border-cyan-500/30 rounded-xl flex flex-col items-center">
            <div className="text-xs font-mono text-gray-500 dark:text-[#BCA297] mb-1">Compressed Output Stream</div>
            <div className="text-2xl font-mono font-extrabold text-cyan-400 tracking-wider">
              {step.encoded || '...'}
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
          <div className="text-xs uppercase font-mono tracking-wider text-gray-500 dark:text-[#BCA297]">Two-Pointer Word Reversal</div>
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
                    backgroundColor: (isL || isR) ? 'rgba(245, 158, 11, 0.2)' : '#423834'
                  }}
                  className="px-4 py-2.5 rounded-xl border font-mono font-bold text-lg text-[#2D1F23] dark:text-[#F4EBC3] shadow-md"
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
                <div key={i} className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold ${
                  step.idx === i ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-[#EBE0D3] dark:border-[#5C4E49] bg-gray-100 dark:bg-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4]'
                }`}>{c}</div>
              ))}
            </div>
            <span className="text-slate-500 font-mono text-xs">↕ 1-to-1 bijection</span>
            <div className="flex gap-2">
              {secondTextInput.split('').map((c, i) => (
                <div key={i} className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold ${
                  step.idx === i ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200' : 'border-[#EBE0D3] dark:border-[#5C4E49] bg-gray-100 dark:bg-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4]'
                }`}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 12. VALID PARENTHESES CANVAS
    const stack = step.stack || [];
    return (
      <div className="flex flex-col items-center gap-6 w-full py-4">
        <div className="flex gap-2 justify-center">
          {textInput.split('').map((c, i) => (
            <div key={i} className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold ${
              step.idx === i ? 'border-cyan-400 bg-cyan-500/30 text-white scale-110' : 'border-[#EBE0D3] dark:border-[#5C4E49] bg-gray-100 dark:bg-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4]'
            }`}>{c}</div>
          ))}
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl w-48 shadow-lg">
          <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297] mb-2 font-bold">Stack (LIFO)</span>
          <div className="flex flex-col-reverse gap-1.5 w-full items-center">
            {stack.map((c, i) => (
              <div key={i} className="w-full py-1.5 text-center rounded bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] font-mono text-sm text-cyan-300 font-bold">
                {c}
              </div>
            ))}
            {stack.length === 0 && <span className="text-xs font-mono text-slate-600">Stack Empty</span>}
          </div>
        </div>
      </div>
    );
  };

  // Live Dry-Run Variables Tracker
  const trackedVariables = useMemo(() => {
    const vars = [];
    
    if (currentAlgoId === 'kmp') {
      vars.push({
        name: 't (text index)',
        value: step.tIdx !== undefined ? `${step.tIdx} ('${textInput[step.tIdx] ?? ''}')` : '-',
        type: 'Index',
        role: 'Current scanner index in Text',
        isChanged: true
      });
      vars.push({
        name: 'p (pattern index)',
        value: step.pIdx !== undefined ? `${step.pIdx} ('${patternInput[step.pIdx] ?? ''}')` : '-',
        type: 'Index',
        role: 'Current index in Pattern',
        isChanged: true
      });
      if (step.pIdx > 0 && step.lps) {
        vars.push({
          name: 'LPS[p-1]',
          value: step.lps[step.pIdx - 1] ?? 0,
          type: 'Lookup',
          role: 'Fallback jump length on mismatch'
        });
      }
      vars.push({
        name: 'matchesFound',
        value: step.matches ? step.matches.length : 0,
        type: 'Count',
        role: 'Full pattern matches found'
      });
    } else if (currentAlgoId === 'rabin_karp') {
      vars.push({
        name: 'windowStart',
        value: step.windowStart ?? 0,
        type: 'Index',
        role: 'Left boundary of text sliding frame',
        isChanged: true
      });
      vars.push({
        name: 'windowString',
        value: `"${textInput.substring(step.windowStart ?? 0, (step.windowStart ?? 0) + patternInput.length)}"`,
        type: 'String',
        role: 'Current M-character text window'
      });
      vars.push({
        name: 'wHash (Window)',
        value: step.wHash ?? 0,
        type: 'Hash',
        role: 'Rolling hash code of current window',
        isChanged: true
      });
      vars.push({
        name: 'pHash (Pattern)',
        value: step.pHash ?? 0,
        type: 'Hash',
        role: 'Fixed hash code of target pattern'
      });
      vars.push({
        name: 'hashMatch',
        value: step.hashMatch ? 'TRUE (Hashes Match!)' : 'FALSE',
        type: 'Boolean',
        role: 'Whether window and pattern hashes match'
      });
    } else if (currentAlgoId === 'longest_palindrome') {
      vars.push({
        name: 'left (wing)',
        value: step.currL !== undefined ? `${step.currL} ('${textInput[step.currL] ?? ''}')` : '-',
        type: 'Index',
        role: 'Left expansion pointer',
        isChanged: true
      });
      vars.push({
        name: 'right (wing)',
        value: step.currR !== undefined ? `${step.currR} ('${textInput[step.currR] ?? ''}')` : '-',
        type: 'Index',
        role: 'Right expansion pointer',
        isChanged: true
      });
      vars.push({
        name: 'currentSpan',
        value: (step.currR !== undefined && step.currL !== undefined) ? `${step.currR - step.currL + 1} chars` : '-',
        type: 'Length',
        role: 'Length of currently expanded palindrome'
      });
      vars.push({
        name: 'longest',
        value: `"${step.longest || textInput[0] || ''}" (${(step.longest || textInput[0] || '').length})`,
        type: 'Result',
        role: 'Best palindrome discovered so far'
      });
    } else if (currentAlgoId === 'levenshtein' || currentAlgoId === 'lcs') {
      vars.push({
        name: 'i (row)',
        value: step.activeI !== undefined ? `${step.activeI} ('${textInput[step.activeI - 1] ?? 'ε'}')` : '-',
        type: 'Index',
        role: 'Current char index in String 1'
      });
      vars.push({
        name: 'j (col)',
        value: step.activeJ !== undefined ? `${step.activeJ} ('${secondTextInput[step.activeJ - 1] ?? 'ε'}')` : '-',
        type: 'Index',
        role: 'Current char index in String 2'
      });
      if (step.dp && step.activeI !== undefined && step.activeJ !== undefined && step.dp[step.activeI]) {
        vars.push({
          name: 'dp[i][j]',
          value: step.dp[step.activeI][step.activeJ],
          type: 'Cost',
          role: 'Optimal cost for subproblem',
          isChanged: true
        });
      }
    } else {
      if (step.currentIdx !== undefined || step.idx !== undefined) {
        vars.push({
          name: 'index',
          value: step.currentIdx ?? step.idx,
          type: 'Index',
          role: 'Character pointer position',
          isChanged: true
        });
      }
      if (step.stack) {
        vars.push({
          name: 'stackSize',
          value: step.stack.length,
          type: 'Stack',
          role: 'Number of open parentheses in stack'
        });
      }
      vars.push({
        name: 'textLength',
        value: textInput.length,
        type: 'Number',
        role: 'Length of input string'
      });
    }

    return vars;
  }, [currentAlgoId, step, textInput, patternInput, secondTextInput]);

  // Code Statement for Dry Run trace
  const currentCodeStatement = useMemo(() => {
    if (currentAlgoId === 'kmp') {
      if (step.status?.includes('Match:')) return 'if (pattern[p] === text[t]) { p++; t++; }';
      if (step.status?.includes('Mismatch:')) return 'if (p !== 0) p = lps[p - 1]; else t++;';
      if (step.phase === 'lps') return 'lps[i] = len;';
      return 'while (t < text.length) { ... }';
    }
    if (currentAlgoId === 'rabin_karp') {
      if (step.hashMatch) return 'if (wHash === pHash) verifyCharacters();';
      return 'wHash = ((wHash - outChar * d) * 256 + inChar) % q;';
    }
    if (currentAlgoId === 'longest_palindrome') {
      return 'while (l >= 0 && r < n && s[l] === s[r]) { l--; r++; }';
    }
    if (currentAlgoId === 'levenshtein') {
      return 'dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);';
    }
    return 'processNextCharacter();';
  }, [currentAlgoId, step]);

  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      category="String Algorithms"
      headerRight={
        <div className="flex items-center gap-3">
          <select
            value={currentAlgoId}
            onChange={(e) => navigate(`/visualizer/string/${e.target.value}`)}
            className="bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {STRING_ALGORITHMS.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4] hover:text-white"
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
          <div className="flex flex-col gap-3 p-3.5 bg-white dark:bg-[#423834]/80 rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-md">
            
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
                  className="flex-1 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-3 py-1.5 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-cyan-500 shadow-inner"
                  placeholder="Type any custom string..."
                />
                <span className="text-[10px] font-mono text-slate-500 bg-gray-100 dark:bg-[#5C4E49] px-1.5 py-0.5 rounded">
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
                    className="w-36 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-3 py-1.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 shadow-inner"
                    placeholder="Search pattern..."
                  />
                  <span className="text-[10px] font-mono text-slate-500 bg-gray-100 dark:bg-[#5C4E49] px-1.5 py-0.5 rounded">
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
                    className="w-36 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 shadow-inner"
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
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#EBE0D3] dark:border-[#5C4E49]/80">
              <span className="text-[11px] font-mono text-slate-500">Quick Presets:</span>
              {currentAlgoId === 'kmp' && (
                <>
                  <button onClick={() => applyPreset('ABABDABACDABABCABAB', 'ABABCABAB')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Default LPS</button>
                  <button onClick={() => applyPreset('ATCGATCGAATCGATCG', 'AATC')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">DNA Sequence</button>
                  <button onClick={() => applyPreset('AAAAABAAAAAB', 'AAAAB')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Repeated Prefix</button>
                </>
              )}
              {currentAlgoId === 'rabin_karp' && (
                <>
                  <button onClick={() => applyPreset('GEEKS FOR GEEKS', 'GEEK')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Geeks</button>
                  <button onClick={() => applyPreset('ALGOVERSE IS AWESOME', 'ALGO')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Algoverse</button>
                </>
              )}
              {currentAlgoId === 'boyer_moore' && (
                <>
                  <button onClick={() => applyPreset('FINDINAHAYSTACKNEEDLE', 'NEEDLE')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Needle in Haystack</button>
                  <button onClick={() => applyPreset('MICROPROCESSOR ARCHITECTURE', 'ROC')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Microprocessor</button>
                </>
              )}
              {currentAlgoId === 'longest_palindrome' && (
                <>
                  <button onClick={() => applyPreset('babad')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">babad</button>
                  <button onClick={() => applyPreset('racecar')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">racecar</button>
                  <button onClick={() => applyPreset('cbbd')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">cbbd</button>
                  <button onClick={() => applyPreset('deified')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">deified</button>
                </>
              )}
              {currentAlgoId === 'levenshtein' && (
                <>
                  <button onClick={() => applyPreset('kitten', '', 'sitting')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">kitten ➔ sitting</button>
                  <button onClick={() => applyPreset('sunday', '', 'saturday')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">sunday ➔ saturday</button>
                </>
              )}
              {currentAlgoId === 'lcs' && (
                <>
                  <button onClick={() => applyPreset('AGGTAB', '', 'GXTXAYB')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">AGGTAB vs GXTXAYB</button>
                  <button onClick={() => applyPreset('ABCDE', '', 'ACE')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">ABCDE vs ACE</button>
                </>
              )}
              {currentAlgoId === 'valid_parentheses' && (
                <>
                  <button onClick={() => applyPreset('{[()]}')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Valid: &#123;[()]&#125;</button>
                  <button onClick={() => applyPreset('()[]{}')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Pairs: ()[]&#123;&#125;</button>
                  <button onClick={() => applyPreset('(]')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Invalid: (]</button>
                  <button onClick={() => applyPreset('([)]')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Crossed: ([)]</button>
                </>
              )}
              {currentAlgoId === 'run_length' && (
                <>
                  <button onClick={() => applyPreset('WWWWWWAAAAAABBBCCCC')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Run Heavy</button>
                  <button onClick={() => applyPreset('AAABBAAAACCCC')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Alternating</button>
                </>
              )}
              {currentAlgoId === 'reverse_words' && (
                <>
                  <button onClick={() => applyPreset('the sky is blue')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">the sky is blue</button>
                  <button onClick={() => applyPreset('algoverse makes dsa visual')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">algoverse makes dsa visual</button>
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
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
          />
        </div>
      }
      rightPanel={
        <div className="flex flex-col gap-3">
          <DryRunVariableTracker
            title={`${currentAlgo.name} — Dry Run`}
            stepNumber={currentStepIdx + 1}
            totalSteps={Math.max(1, steps.length)}
            actionBadge={(() => {
              const h = getStringHUDInfo(currentAlgoId, step, textInput, patternInput, secondTextInput);
              return { label: h.badge, icon: h.icon, bg: h.bg };
            })()}
            codeStatement={currentCodeStatement}
            explanation={(() => {
              const h = getStringHUDInfo(currentAlgoId, step, textInput, patternInput, secondTextInput);
              return h.why;
            })()}
            variables={trackedVariables}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
          />
        </div>
      }
    >
      <div className="w-full h-full flex-1 flex flex-col p-3 sm:p-5 overflow-hidden">
        <div className="w-full h-full flex-1 min-h-[560px] flex items-center justify-center bg-white/80 dark:bg-[#423834] dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49]/80 rounded-3xl p-6 relative overflow-x-auto shadow-2xl backdrop-blur-sm">
          {renderCanvas()}
        </div>
      </div>
    </ResponsiveVisualizerShell>
  );
}
