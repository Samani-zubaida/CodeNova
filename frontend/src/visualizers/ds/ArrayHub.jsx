import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ArrowLeft } from 'lucide-react';

// ========================================================
// 16 CUSTOM SVG GRAPHICS MATCHING DASHBOARD AESTHETIC
// ========================================================

const StaticArrayGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(10, 35)">
      <rect x="0" y="0" width="18" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="9" y="16" fontSize="12" fill="#333" textAnchor="middle" fontFamily="monospace">15</text>
      <rect x="20" y="0" width="18" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="29" y="16" fontSize="12" fill="#333" textAnchor="middle" fontFamily="monospace">28</text>
      <rect x="40" y="0" width="18" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="49" y="16" fontSize="12" fill="#333" textAnchor="middle" fontFamily="monospace">42</text>
      <rect x="60" y="0" width="18" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="69" y="16" fontSize="12" fill="#333" textAnchor="middle" fontFamily="monospace">65</text>
    </g>
    <text x="50" y="75" fontSize="9" fill="#666" textAnchor="middle" fontFamily="monospace">0x7FFE00 + i*4</text>
  </svg>
);

const DynamicArrayGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(10, 30)">
      <rect x="0" y="0" width="16" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="18" y="0" width="16" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="36" y="0" width="16" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="54" y="0" width="16" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    </g>
    <g transform="translate(10, 55)">
      <rect x="0" y="0" width="9" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="10" y="0" width="9" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="20" y="0" width="9" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="30" y="0" width="9" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="40" y="0" width="9" height="15" fill="none" stroke="#BC4A54" strokeWidth="1" strokeDasharray="2 2"/>
      <rect x="50" y="0" width="9" height="15" fill="none" stroke="#BC4A54" strokeWidth="1" strokeDasharray="2 2"/>
      <rect x="60" y="0" width="9" height="15" fill="none" stroke="#BC4A54" strokeWidth="1" strokeDasharray="2 2"/>
      <rect x="70" y="0" width="9" height="15" fill="none" stroke="#BC4A54" strokeWidth="1" strokeDasharray="2 2"/>
    </g>
    <text x="50" y="22" fontSize="10" fill="#333" textAnchor="middle" fontWeight="bold">Cap: 4 → 8 (2x)</text>
  </svg>
);

const Matrix2DGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(25, 25)">
      <rect x="0" y="0" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="17" y="0" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="34" y="0" width="15" height="15" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      
      <rect x="0" y="17" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="17" y="17" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="34" y="17" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>

      <rect x="0" y="34" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="17" y="34" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="34" y="34" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    </g>
    <text x="50" y="85" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">[r*cols + c]</text>
  </svg>
);

const CircularBufferGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <circle cx="50" cy="50" r="28" stroke="#333" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="50" cy="22" r="7" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
    <circle cx="78" cy="50" r="7" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="50" cy="78" r="7" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="22" cy="50" r="7" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <text x="50" y="53" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">(i+1)%N</text>
  </svg>
);

const SparseArrayGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(15, 30)">
      <rect x="0" y="0" width="12" height="16" fill="#FDFBF7" stroke="#888" strokeWidth="0.8"/>
      <text x="6" y="11" fontSize="9" fill="#888" textAnchor="middle">0</text>
      <rect x="14" y="0" width="12" height="16" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="20" y="11" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold">9</text>
      <rect x="28" y="0" width="12" height="16" fill="#FDFBF7" stroke="#888" strokeWidth="0.8"/>
      <text x="34" y="11" fontSize="9" fill="#888" textAnchor="middle">0</text>
      <rect x="42" y="0" width="12" height="16" fill="#FDFBF7" stroke="#888" strokeWidth="0.8"/>
      <text x="48" y="11" fontSize="9" fill="#888" textAnchor="middle">0</text>
      <rect x="56" y="0" width="12" height="16" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="62" y="11" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold">4</text>
    </g>
    <text x="50" y="70" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">90% Zero Saved</text>
  </svg>
);

const BinarySearchGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(12, 35)">
      <rect x="0" y="0" width="14" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="15" y="0" width="14" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="30" y="0" width="16" height="22" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
      <text x="38" y="15" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="bold">M</text>
      <rect x="47" y="0" width="14" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="62" y="0" width="14" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    </g>
    <path d="M20 63 L20 70 M69 63 L69 70" stroke="#333" strokeWidth="1.5"/>
    <text x="20" y="80" fontSize="9" fill="#333" textAnchor="middle" fontWeight="bold">L</text>
    <text x="69" y="80" fontSize="9" fill="#333" textAnchor="middle" fontWeight="bold">R</text>
  </svg>
);

const QuickSortGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(15, 25)">
      <rect x="0" y="25" width="12" height="25" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="15" y="15" width="12" height="35" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="30" y="30" width="12" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="45" y="5" width="12" height="45" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="60" y="20" width="14" height="30" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
    </g>
    <text x="77" y="20" fontSize="9" fill="#BC4A54" fontWeight="bold">PIVOT</text>
    <path d="M20 78 L45 78" stroke="#333" strokeWidth="1.5"/>
    <path d="M25 75 L20 78 L25 81" stroke="#333" fill="none"/>
    <path d="M40 75 L45 78 L40 81" stroke="#333" fill="none"/>
    <text x="50" y="90" fontSize="9" fill="#333" textAnchor="middle">&lt; Pivot &lt;</text>
  </svg>
);

const MergeSortGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <rect x="25" y="20" width="50" height="12" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <path d="M40 32 L30 45 M60 32 L70 45" stroke="#333" strokeWidth="1.5"/>
    <rect x="15" y="45" width="28" height="12" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <rect x="57" y="45" width="28" height="12" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
    <path d="M30 57 L45 70 M70 57 L55 70" stroke="#333" strokeWidth="1.5"/>
    <rect x="25" y="72" width="50" height="12" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
  </svg>
);

const BubbleSortGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <circle cx="28" cy="55" r="14" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <text x="28" y="59" fontSize="11" fill="#333" textAnchor="middle" fontWeight="bold">64</text>
    <circle cx="62" cy="42" r="18" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
    <text x="62" y="47" fontSize="13" fill="#fff" textAnchor="middle" fontWeight="bold">92</text>
    <path d="M35 35 Q45 20 55 30" stroke="#333" strokeWidth="1.5" fill="none"/>
    <path d="M53 25 L55 30 L50 32" stroke="#333" fill="#333"/>
    <text x="50" y="80" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">Swap Adjacent</text>
  </svg>
);

const InsertionSortGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(15, 40)">
      <rect x="0" y="0" width="14" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="16" y="0" width="14" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="32" y="-12" width="16" height="26" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
      <rect x="50" y="0" width="14" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    </g>
    <path d="M48 25 Q35 15 20 28" stroke="#333" strokeWidth="1.5" fill="none"/>
    <path d="M22 23 L20 28 L25 29" stroke="#333" fill="#333"/>
    <text x="50" y="80" fontSize="9" fill="#333" textAnchor="middle">Insert in Sorted</text>
  </svg>
);

const TwoSumGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(15, 35)">
      <rect x="0" y="0" width="15" height="22" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="7.5" y="15" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="bold">L</text>
      <rect x="18" y="0" width="15" height="22" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="36" y="0" width="15" height="22" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="54" y="0" width="15" height="22" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="61.5" y="15" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="bold">R</text>
    </g>
    <path d="M12 25 L30 25 M68 25 L50 25" stroke="#333" strokeWidth="1.5"/>
    <path d="M27 22 L30 25 L27 28 M53 22 L50 25 L53 28" stroke="#333" fill="none"/>
    <text x="50" y="78" fontSize="9" fill="#333" textAnchor="middle" fontWeight="bold">L + R == Target</text>
  </svg>
);

const SlidingWindowGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(12, 35)">
      <rect x="0" y="0" width="14" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="16" y="0" width="14" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="32" y="0" width="14" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="48" y="0" width="14" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="64" y="0" width="14" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    </g>
    <rect x="25" y="30" width="36" height="30" rx="4" fill="none" stroke="#BC4A54" strokeWidth="2.5"/>
    <path d="M68 45 L78 45" stroke="#BC4A54" strokeWidth="2"/>
    <path d="M74 41 L78 45 L74 49" stroke="#BC4A54" fill="none" strokeWidth="2"/>
    <text x="50" y="78" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">O(1) Delta Slide</text>
  </svg>
);

const KadaneGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(15, 20)">
      <rect x="0" y="25" width="10" height="25" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="12" y="38" width="10" height="12" fill="#888" stroke="#333" strokeWidth="1"/>
      <rect x="24" y="10" width="12" height="40" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <rect x="38" y="5" width="12" height="45" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <rect x="52" y="15" width="12" height="35" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
    </g>
    <line x1="10" y1="70" x2="90" y2="70" stroke="#333" strokeWidth="1"/>
    <text x="50" y="85" fontSize="9" fill="#333" textAnchor="middle" fontWeight="bold">Max Subarray Streak</text>
  </svg>
);

const DutchFlagGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(15, 30)">
      <rect x="0" y="0" width="22" height="35" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="11" y="22" fontSize="12" fill="#fff" textAnchor="middle" fontWeight="bold">0</text>
      
      <rect x="24" y="0" width="22" height="35" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="35" y="22" fontSize="12" fill="#333" textAnchor="middle" fontWeight="bold">1</text>
      
      <rect x="48" y="0" width="22" height="35" fill="#3B82F6" stroke="#333" strokeWidth="1"/>
      <text x="59" y="22" fontSize="12" fill="#fff" textAnchor="middle" fontWeight="bold">2</text>
    </g>
    <text x="50" y="80" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">Low | Mid | High</text>
  </svg>
);

const TrappingRainGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(15, 20)">
      <rect x="0" y="20" width="13" height="40" fill="#333"/>
      <rect x="15" y="50" width="13" height="10" fill="#333"/>
      <rect x="30" y="30" width="13" height="30" fill="#333"/>
      <rect x="45" y="50" width="13" height="10" fill="#333"/>
      <rect x="60" y="10" width="13" height="50" fill="#333"/>

      <rect x="15" y="30" width="13" height="20" fill="#06B6D4" opacity="0.85"/>
      <rect x="45" y="30" width="13" height="20" fill="#06B6D4" opacity="0.85"/>
    </g>
    <text x="50" y="82" fontSize="9" fill="#333" textAnchor="middle" fontWeight="bold">💧 3D Trapped Water</text>
  </svg>
);

const PrefixSumGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(15, 25)">
      <rect x="0" y="0" width="68" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="34" y="11" fontSize="8" fill="#333" textAnchor="middle">arr: [3, 1, 4, 2, 5]</text>
      
      <rect x="0" y="20" width="68" height="15" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="34" y="31" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">P: [0, 3, 4, 8, 10, 15]</text>
    </g>
    <text x="50" y="75" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">Query sum = P[R]-P[L]</text>
  </svg>
);

// 16 Complete Options with full metadata for visualizer
export const ARRAY_ALGORITHMS_LIST = [
  {
    id: 'static_array',
    name: 'Static 1D Array',
    category: 'Memory Model',
    desc: 'Fixed-size contiguous memory allocation with O(1) random offset lookups.',
    tag: 'O(1)',
    complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(n)' },
    codeId: 'static_array',
    graphic: <StaticArrayGraphic />
  },
  {
    id: 'dynamic_array',
    name: 'Dynamic Array (Vector)',
    category: 'Memory Model',
    desc: 'Geometric capacity doubling (2x) with amortized O(1) append operations.',
    tag: 'O(1)*',
    complexity: { time: { best: 'O(1)', average: 'O(1)*', worst: 'O(n)' }, space: 'O(n)' },
    codeId: 'dynamic_array',
    graphic: <DynamicArrayGraphic />
  },
  {
    id: 'matrix_2d',
    name: '2D Matrix / Grid',
    category: 'Memory Model',
    desc: 'Multi-dimensional coordinate grid mapped into 1D RAM in row-major order.',
    tag: 'O(1)',
    complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(R×C)' },
    codeId: 'matrix_2d',
    graphic: <Matrix2DGraphic />
  },
  {
    id: 'circular_buffer',
    name: 'Circular Buffer (Ring)',
    category: 'Memory Model',
    desc: 'Fixed-capacity ring queue utilizing modulo arithmetic to prevent element shifting.',
    tag: 'O(1)',
    complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(n)' },
    codeId: 'circular_buffer',
    graphic: <CircularBufferGraphic />
  },
  {
    id: 'sparse_array',
    name: 'Sparse Array & Matrix',
    category: 'Memory Model',
    desc: 'Coordinate compression eliminating memory overhead in zero-dominated arrays.',
    tag: 'O(k)',
    complexity: { time: { best: 'O(1)', average: 'O(k)', worst: 'O(k)' }, space: 'O(k)' },
    codeId: 'sparse_array',
    graphic: <SparseArrayGraphic />
  },
  {
    id: 'binary_search',
    name: 'Binary Search',
    category: 'Searching',
    desc: 'Logarithmic divide-and-conquer search by halving sorted search spaces.',
    tag: 'O(log n)',
    complexity: { time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(1)' },
    codeId: 'binary_search',
    graphic: <BinarySearchGraphic />
  },
  {
    id: 'quicksort',
    name: 'Quick Sort (Lomuto)',
    category: 'Sorting',
    desc: 'In-place partitioning around a 3D pivot element with dual pointer scanning.',
    tag: 'O(n log n)',
    complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n)' },
    codeId: 'quicksort',
    graphic: <QuickSortGraphic />
  },
  {
    id: 'mergesort',
    name: 'Merge Sort',
    category: 'Sorting',
    desc: 'Divide-and-conquer recursive splitting with synchronized 3D merging.',
    tag: 'O(n log n)',
    complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)' },
    codeId: 'mergesort',
    graphic: <MergeSortGraphic />
  },
  {
    id: 'bubblesort',
    name: 'Bubble Sort',
    category: 'Sorting',
    desc: 'Adjacent pair comparisons bubbling the largest unsorted element to the boundary.',
    tag: 'O(n²)',
    complexity: { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' },
    codeId: 'bubblesort',
    graphic: <BubbleSortGraphic />
  },
  {
    id: 'insertionsort',
    name: 'Insertion Sort',
    category: 'Sorting',
    desc: 'Incrementally shifting elements right to insert new values into a sorted prefix.',
    tag: 'O(n²)',
    complexity: { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' },
    codeId: 'insertionsort',
    graphic: <InsertionSortGraphic />
  },
  {
    id: 'two_sum',
    name: 'Two Pointers (Two-Sum)',
    category: 'Two Pointers',
    desc: 'Inward converging pointers from opposite ends of a sorted array to hit target sum.',
    tag: 'O(n)',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    codeId: 'two_sum',
    graphic: <TwoSumGraphic />
  },
  {
    id: 'sliding_window',
    name: 'Sliding Window (Max Sum)',
    category: 'Two Pointers',
    desc: 'Dynamic bounding frame that expands and contracts across array elements in O(1).',
    tag: 'O(n)',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    codeId: 'sliding_window',
    graphic: <SlidingWindowGraphic />
  },
  {
    id: 'kadane',
    name: "Kadane's Algorithm",
    category: 'Dynamic Programming',
    desc: 'Maximum contiguous subarray sum calculation with dynamic reset logic.',
    tag: 'O(n)',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    codeId: 'kadane',
    graphic: <KadaneGraphic />
  },
  {
    id: 'dutch_flag',
    name: 'Dutch National Flag',
    category: 'Partitioning',
    desc: "Dijkstra's 3-way partitioning sorting 0s, 1s, and 2s in a single pass.",
    tag: 'O(n)',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    codeId: 'dutch_flag',
    graphic: <DutchFlagGraphic />
  },
  {
    id: 'trapping_rain',
    name: 'Trapping Rain Water',
    category: 'Two Pointers',
    desc: 'Calculates trapped 3D water volume between elevation pillars using dual walls.',
    tag: 'O(n)',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    codeId: 'trapping_rain',
    graphic: <TrappingRainGraphic />
  },
  {
    id: 'prefix_sum',
    name: 'Prefix Sum Array',
    category: 'Optimization',
    desc: 'Precomputed cumulative sums to evaluate range queries sum(L..R) in O(1) time.',
    tag: 'O(1)',
    complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(n)' },
    codeId: 'prefix_sum',
    graphic: <PrefixSumGraphic />
  }
];

export const ARRAY_CATALOG = ARRAY_ALGORITHMS_LIST;

export default function ArrayHub() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ARRAY_ALGORITHMS_LIST.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FDFBF7] dark:bg-[#121212] relative overflow-hidden flex flex-col transition-colors duration-300 pb-16">
      
      {/* Background Ambient Gradients */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[#BC4A54]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#D3DFC8]/30 rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 z-10">
        
        {/* Top Navigation & Breadcrumb */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to="/visualizer"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-[#BC4A54] dark:hover:text-[#E27D86] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search 16 array algorithms & types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#BC4A54] shadow-xs text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Array Algorithms & Types Suite
            </h1>
            <span className="text-xs font-mono font-bold bg-[#BC4A54]/10 text-[#BC4A54] px-2.5 py-1 rounded-full border border-[#BC4A54]/20">
              16 Options
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Select any card below to launch its dedicated, high-detail 3D animation visualizer with physical RAM addresses, cache line monitors, and step-by-step playback.
          </p>
        </div>

        {/* EXACT DASHBOARD-STYLE CARDS GRID */}
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
                {/* Topic Header & Graphic (Navigates to 3D page) */}
                <Link to={`/visualizer/array/${item.id}`} className="block group/head flex-1 flex flex-col">
                  {/* Top Graphic Box */}
                  <div className="w-full h-24 md:h-28 mb-3 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#252525] flex items-center justify-center transform group-hover/head:scale-[1.02] transition-transform duration-300">
                    {item.graphic}
                  </div>

                  {/* Title & Tag */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover/head:text-[#BC4A54] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-[#BC4A54]/10 text-[#BC4A54] px-2 py-0.5 rounded-full border border-[#BC4A54]/20 shrink-0">
                      {item.tag}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.desc}
                  </p>
                </Link>

                {/* Bottom Action Footer (Circular Arrow Button) */}
                <div className="flex justify-end mt-auto pt-2">
                  <Link 
                    to={`/visualizer/array/${item.id}`}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] flex items-center justify-center text-[#BC4A54] group-hover:bg-[#BC4A54] group-hover:text-white transition-colors duration-300 shadow-xs"
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
