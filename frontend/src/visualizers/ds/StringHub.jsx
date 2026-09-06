import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ArrowLeft } from 'lucide-react';

// ========================================================
// 12 CUSTOM PASTEL SVG GRAPHICS FOR PURE STRING ALGORITHMS
// ========================================================

const KMPGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(10, 26)">
      <rect x="0" y="0" width="13" height="16" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="6.5" y="11" fontSize="8" fill="#333" textAnchor="middle">A</text>
      <rect x="14" y="0" width="13" height="16" fill="#10B981" stroke="#333" strokeWidth="0.8"/>
      <text x="20.5" y="11" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">B</text>
      <rect x="28" y="0" width="13" height="16" fill="#10B981" stroke="#333" strokeWidth="0.8"/>
      <text x="34.5" y="11" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">A</text>
      <rect x="42" y="0" width="13" height="16" fill="#10B981" stroke="#333" strokeWidth="0.8"/>
      <text x="48.5" y="11" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">B</text>
      <rect x="56" y="0" width="13" height="16" fill="#F43F5E" stroke="#333" strokeWidth="0.8"/>
      <text x="62.5" y="11" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">C</text>
      <rect x="70" y="0" width="13" height="16" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="76.5" y="11" fontSize="8" fill="#333" textAnchor="middle">D</text>
    </g>
    <path d="M58 52 C 45 68 30 68 22 52" stroke="#BC4A54" strokeWidth="1.8" strokeDasharray="2 2" fill="none"/>
    <text x="50" y="78" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">LPS Shift (No Backtrack)</text>
  </svg>
);

const RabinKarpGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(12, 30)">
      <rect x="0" y="0" width="36" height="20" rx="3" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="18" y="13" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">H:5280</text>
      <text x="50" y="14" fontSize="11" fill="#333" textAnchor="middle" fontWeight="bold">==</text>
      <rect x="62" y="0" width="36" height="20" rx="3" fill="#10B981" stroke="#333" strokeWidth="1"/>
      <text x="80" y="13" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">H:5280</text>
    </g>
    <text x="50" y="74" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Rolling Hash O(1) Slide</text>
  </svg>
);

const BoyerMooreGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(12, 28)">
      <rect x="0" y="0" width="15" height="16" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="7.5" y="11" fontSize="8" fill="#333" textAnchor="middle">N</text>
      <rect x="18" y="0" width="15" height="16" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="25.5" y="11" fontSize="8" fill="#333" textAnchor="middle">E</text>
      <rect x="36" y="0" width="15" height="16" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="43.5" y="11" fontSize="8" fill="#333" textAnchor="middle">E</text>
      <rect x="54" y="0" width="15" height="16" fill="#10B981" stroke="#333" strokeWidth="1"/>
      <text x="61.5" y="11" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">D</text>
    </g>
    <path d="M68 50 L20 50" stroke="#BC4A54" strokeWidth="1.8"/>
    <polygon points="22,47 18,50 22,53" fill="#BC4A54"/>
    <text x="50" y="65" fontSize="7" fill="#BC4A54" textAnchor="middle" fontWeight="bold">Right-to-Left Scan</text>
    <text x="50" y="80" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Bad Character Jump</text>
  </svg>
);

const LongestPalindromeGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(10, 36)">
      <rect x="0" y="0" width="15" height="18" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="7.5" y="12" fontSize="9" fill="#333" textAnchor="middle">b</text>
      <rect x="16" y="0" width="15" height="18" fill="#10B981" stroke="#333" strokeWidth="1.2"/>
      <text x="23.5" y="12" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold">a</text>
      <rect x="32" y="0" width="16" height="18" fill="#BC4A54" stroke="#333" strokeWidth="1.2"/>
      <text x="40" y="12" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold">b</text>
      <rect x="49" y="0" width="15" height="18" fill="#10B981" stroke="#333" strokeWidth="1.2"/>
      <text x="56.5" y="12" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold">a</text>
      <rect x="65" y="0" width="15" height="18" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="72.5" y="12" fontSize="9" fill="#333" textAnchor="middle">d</text>
    </g>
    <path d="M40 28 L24 28" stroke="#06B6D4" strokeWidth="1.5"/>
    <path d="M40 28 L56 28" stroke="#06B6D4" strokeWidth="1.5"/>
    <text x="50" y="74" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Expand Around Center</text>
  </svg>
);

const ZAlgorithmGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(10, 32)">
      <rect x="0" y="0" width="15" height="15" fill="#BC4A54" stroke="#333" strokeWidth="0.8"/>
      <text x="7.5" y="10.5" fontSize="8" fill="#fff" textAnchor="middle">a</text>
      <rect x="16" y="0" width="15" height="15" fill="#BC4A54" stroke="#333" strokeWidth="0.8"/>
      <text x="23.5" y="10.5" fontSize="8" fill="#fff" textAnchor="middle">b</text>
      <rect x="32" y="0" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="39.5" y="10.5" fontSize="8" fill="#333" textAnchor="middle">c</text>
      <rect x="48" y="0" width="15" height="15" fill="#BC4A54" stroke="#333" strokeWidth="0.8"/>
      <text x="55.5" y="10.5" fontSize="8" fill="#fff" textAnchor="middle">a</text>
      <rect x="64" y="0" width="15" height="15" fill="#BC4A54" stroke="#333" strokeWidth="0.8"/>
      <text x="71.5" y="10.5" fontSize="8" fill="#fff" textAnchor="middle">b</text>
    </g>
    <g transform="translate(10, 52)">
      <text x="7.5" y="11" fontSize="9" fill="#888" textAnchor="middle" fontFamily="monospace">-</text>
      <text x="23.5" y="11" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">0</text>
      <text x="39.5" y="11" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">0</text>
      <text x="55.5" y="11" fontSize="9" fill="#BC4A54" textAnchor="middle" fontWeight="bold" fontFamily="monospace">2</text>
      <text x="71.5" y="11" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">0</text>
    </g>
    <text x="50" y="80" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Z[i] Prefix Match Length</text>
  </svg>
);

const LevenshteinGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(25, 25)">
      <rect x="0" y="0" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="7.5" y="10" fontSize="7" fill="#888" textAnchor="middle">0</text>
      <rect x="16" y="0" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="23.5" y="10" fontSize="7" fill="#888" textAnchor="middle">1</text>
      <rect x="32" y="0" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="39.5" y="10" fontSize="7" fill="#888" textAnchor="middle">2</text>

      <rect x="0" y="16" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="7.5" y="26" fontSize="7" fill="#888" textAnchor="middle">1</text>
      <rect x="16" y="16" width="15" height="15" fill="#10B981" stroke="#333" strokeWidth="1"/>
      <text x="23.5" y="26" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="bold">0</text>
      <rect x="32" y="16" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="39.5" y="26" fontSize="7" fill="#888" textAnchor="middle">1</text>

      <rect x="0" y="32" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="7.5" y="42" fontSize="7" fill="#888" textAnchor="middle">2</text>
      <rect x="16" y="32" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="23.5" y="42" fontSize="7" fill="#888" textAnchor="middle">1</text>
      <rect x="32" y="32" width="15" height="15" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="39.5" y="42" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="bold">1</text>
    </g>
    <text x="50" y="84" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Edit Distance DP Grid</text>
  </svg>
);

const LCSGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(10, 32)">
      <text x="10" y="14" fontSize="9" fill="#BC4A54" fontWeight="bold">A</text>
      <text x="25" y="14" fontSize="9" fill="#10B981" fontWeight="bold">B</text>
      <text x="40" y="14" fontSize="9" fill="#BC4A54" fontWeight="bold">C</text>
      <text x="55" y="14" fontSize="9" fill="#10B981" fontWeight="bold">D</text>
      <text x="70" y="14" fontSize="9" fill="#888">E</text>
    </g>
    <g transform="translate(10, 52)">
      <text x="10" y="14" fontSize="9" fill="#888">X</text>
      <text x="25" y="14" fontSize="9" fill="#10B981" fontWeight="bold">B</text>
      <text x="40" y="14" fontSize="9" fill="#888">Y</text>
      <text x="55" y="14" fontSize="9" fill="#10B981" fontWeight="bold">D</text>
      <text x="70" y="14" fontSize="9" fill="#888">Z</text>
    </g>
    <path d="M35 48 L35 60" stroke="#10B981" strokeWidth="1.5"/>
    <path d="M65 48 L65 60" stroke="#10B981" strokeWidth="1.5"/>
    <text x="50" y="80" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Common: "BD" (Len 2)</text>
  </svg>
);

const AnagramGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(15, 34)">
      <rect x="0" y="0" width="30" height="20" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="15" y="13" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">"cba"</text>
      <text x="35" y="14" fontSize="10" fill="#10B981" fontWeight="bold">⇄</text>
      <rect x="42" y="0" width="30" height="20" rx="3" fill="#10B981" stroke="#333" strokeWidth="1"/>
      <text x="57" y="13" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">"abc"</text>
    </g>
    <text x="50" y="74" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Equal Char Counts</text>
  </svg>
);

const RunLengthGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(10, 30)">
      <rect x="0" y="0" width="80" height="16" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="40" y="11" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">"AAAAABBBCC"</text>
      <path d="M40 22 L40 32" stroke="#BC4A54" strokeWidth="1.5"/>
      <rect x="15" y="34" width="50" height="16" rx="3" fill="#BC4A54"/>
      <text x="40" y="45" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">"A5B3C2"</text>
    </g>
    <text x="50" y="76" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Lossless Compression</text>
  </svg>
);

const ReverseWordsGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(10, 30)">
      <rect x="0" y="0" width="36" height="16" rx="2" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
      <text x="18" y="11" fontSize="7" fill="#333" textAnchor="middle">"the"</text>
      <rect x="42" y="0" width="38" height="16" rx="2" fill="#BC4A54"/>
      <text x="61" y="11" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="bold">"sky"</text>
    </g>
    <path d="M40 52 C 55 64 25 64 40 52" stroke="#333" strokeWidth="1.2" fill="none"/>
    <text x="50" y="74" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">"sky the" (O(1) Space)</text>
  </svg>
);

const IsomorphicGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(15, 32)">
      <text x="15" y="12" fontSize="9" fill="#06B6D4" fontWeight="bold">e ➔ a</text>
      <text x="15" y="26" fontSize="9" fill="#BC4A54" fontWeight="bold">g ➔ d</text>
      <text x="15" y="40" fontSize="9" fill="#BC4A54" fontWeight="bold">g ➔ d</text>
    </g>
    <text x="50" y="78" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">"egg" ⟷ "add" Valid</text>
  </svg>
);

const ValidParenthesesGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(12, 34)">
      <rect x="0" y="0" width="76" height="20" rx="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="12" y="14" fontSize="11" fill="#BC4A54" fontWeight="bold">{'{'}</text>
      <text x="24" y="14" fontSize="11" fill="#06B6D4" fontWeight="bold">[</text>
      <text x="36" y="14" fontSize="11" fill="#10B981" fontWeight="bold">(</text>
      <text x="46" y="14" fontSize="11" fill="#10B981" fontWeight="bold">)</text>
      <text x="56" y="14" fontSize="11" fill="#06B6D4" fontWeight="bold">]</text>
      <text x="66" y="14" fontSize="11" fill="#BC4A54" fontWeight="bold">{'}'}</text>
    </g>
    <text x="50" y="76" fontSize="8" fill="#10B981" textAnchor="middle" fontWeight="bold" fontFamily="monospace">LIFO Match: Valid ✓</text>
  </svg>
);

// ========================================================
// 12 PURE STRING ALGORITHMS CATALOG LIST (NO TRIE)
// ========================================================

export const STRING_ALGORITHMS = [
  {
    id: 'kmp',
    name: 'KMP Pattern Search',
    category: 'Pattern Matching',
    desc: 'Preprocesses pattern with Longest Prefix Suffix (LPS) table to bypass redundant character comparisons.',
    tag: 'O(N+M)',
    complexity: { time: { best: 'O(N)', average: 'O(N+M)', worst: 'O(N+M)' }, space: 'O(M)' },
    graphic: <KMPGraphic />
  },
  {
    id: 'rabin_karp',
    name: 'Rabin-Karp Algorithm',
    category: 'Hashing',
    desc: 'Polynomial rolling hash compares window fingerprints in O(1) time per character slide.',
    tag: 'O(N+M) Avg',
    complexity: { time: { best: 'O(N+M)', average: 'O(N+M)', worst: 'O(N·M)' }, space: 'O(1)' },
    graphic: <RabinKarpGraphic />
  },
  {
    id: 'boyer_moore',
    name: 'Boyer-Moore Search',
    category: 'Pattern Matching',
    desc: 'Scans characters from right to left, achieving sublinear O(N/M) average performance using bad character rule.',
    tag: 'O(N/M) Sublinear',
    complexity: { time: { best: 'O(N/M)', average: 'O(N)', worst: 'O(N·M)' }, space: 'O(Σ)' },
    graphic: <BoyerMooreGraphic />
  },
  {
    id: 'longest_palindrome',
    name: 'Longest Palindrome',
    category: 'Two Pointers',
    desc: 'Expands outward around 2N-1 centers to detect maximum symmetrical palindromic substrings.',
    tag: 'O(N²)',
    complexity: { time: { best: 'O(N)', average: 'O(N²)', worst: 'O(N²)' }, space: 'O(1)' },
    graphic: <LongestPalindromeGraphic />
  },
  {
    id: 'z_algorithm',
    name: 'Z-Algorithm',
    category: 'Pattern Matching',
    desc: 'Computes Z-array where Z[i] is the length of the longest prefix of S starting from S[i].',
    tag: 'O(N+M)',
    complexity: { time: { best: 'O(N)', average: 'O(N+M)', worst: 'O(N+M)' }, space: 'O(N+M)' },
    graphic: <ZAlgorithmGraphic />
  },
  {
    id: 'levenshtein',
    name: 'Levenshtein Edit Distance',
    category: 'Dynamic Programming',
    desc: 'Calculates minimum insertions, deletions, and substitutions needed to transform string A to B.',
    tag: 'O(N·M) DP',
    complexity: { time: { best: 'O(N·M)', average: 'O(N·M)', worst: 'O(N·M)' }, space: 'O(N·M)' },
    graphic: <LevenshteinGraphic />
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'Dynamic Programming',
    desc: 'Finds the longest shared subsequence between two strings without requiring contiguous placement.',
    tag: 'O(N·M)',
    complexity: { time: { best: 'O(N·M)', average: 'O(N·M)', worst: 'O(N·M)' }, space: 'O(N·M)' },
    graphic: <LCSGraphic />
  },
  {
    id: 'anagram_search',
    name: 'Anagram Sliding Window',
    category: 'Sliding Window',
    desc: 'Tracks character frequency map across fixed window to detect permutations of pattern in text.',
    tag: 'O(N) Window',
    complexity: { time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' }, space: 'O(1)' },
    graphic: <AnagramGraphic />
  },
  {
    id: 'run_length',
    name: 'Run-Length Encoding',
    category: 'Compression',
    desc: 'Replaces repeated character sequences with single character and frequency count (e.g. AAAA ➔ A4).',
    tag: 'O(N) 1-Pass',
    complexity: { time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' }, space: 'O(1)' },
    graphic: <RunLengthGraphic />
  },
  {
    id: 'reverse_words',
    name: 'Reverse Words in String',
    category: 'Two Pointers',
    desc: 'Reverses the entire string buffer and then reverses each individual word in-place.',
    tag: 'O(N) In-Place',
    complexity: { time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' }, space: 'O(1)' },
    graphic: <ReverseWordsGraphic />
  },
  {
    id: 'isomorphic',
    name: 'Isomorphic Strings',
    category: 'Hash Map',
    desc: 'Validates 1-to-1 bijection character mappings between two strings with dual hash maps.',
    tag: 'O(N) Map',
    complexity: { time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' }, space: 'O(1)' },
    graphic: <IsomorphicGraphic />
  },
  {
    id: 'valid_parentheses',
    name: 'Valid Parentheses',
    category: 'Stack',
    desc: 'Validates balanced nested bracket sequences using LIFO stack push and match pop mechanics.',
    tag: 'O(N) Stack',
    complexity: { time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' }, space: 'O(N)' },
    graphic: <ValidParenthesesGraphic />
  }
];

export default function StringHub() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = STRING_ALGORITHMS.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FDFBF7] dark:bg-[#121212] relative overflow-hidden flex flex-col transition-colors duration-300 pb-16">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#E8D1CB]/30 rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 z-10">
        
        {/* Top Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to="/visualizer"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search 12 pure string algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              String Algorithms & Pattern Matching Suite
            </h1>
            <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20">
              12 Pure String Cards
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Select any card below to launch its dedicated interactive visualizer with dynamic character tracing, LPS jumps, rolling hash fingerprints, and ELI5 step intuition.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 md:p-5 shadow-sm border border-[#EBE0D3]/50 dark:border-[#333] hover:shadow-md transition-all duration-300 group flex flex-col h-full cursor-pointer"
              >
                <Link to={`/visualizer/string/${item.id}`} className="block group/head flex-1 flex flex-col">
                  <div className="w-full h-24 md:h-28 mb-3 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#252525] flex items-center justify-center transform group-hover/head:scale-[1.02] transition-transform duration-300">
                    {item.graphic}
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover/head:text-indigo-600 dark:group-hover/head:text-indigo-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 shrink-0">
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.desc}
                  </p>
                </Link>

                <div className="flex justify-end mt-auto pt-2">
                  <Link 
                    to={`/visualizer/string/${item.id}`}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-xs"
                    title={`Visualize ${item.name}`}
                  >
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
