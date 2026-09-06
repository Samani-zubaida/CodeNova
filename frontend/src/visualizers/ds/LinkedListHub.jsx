import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ArrowLeft, GitCommit, Layers, RefreshCw } from 'lucide-react';

// ========================================================
// 12 CUSTOM PASTEL SVG GRAPHICS FOR LINKED LIST CONCEPTS
// ========================================================

const SinglyGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(10, 40)">
      <rect x="0" y="0" width="20" height="16" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="7" y="12" fontSize="9" fill="#333" fontWeight="bold" fontFamily="monospace">10</text>
      <line x1="14" y1="0" x2="14" y2="16" stroke="#888" strokeWidth="0.8"/>
      <path d="M20 8 L32 8" stroke="#333" strokeWidth="1.5"/>
      <polygon points="30,6 34,8 30,10" fill="#333"/>
      
      <rect x="36" y="0" width="20" height="16" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="43" y="12" fontSize="9" fill="#333" fontWeight="bold" fontFamily="monospace">20</text>
      <line x1="50" y1="0" x2="50" y2="16" stroke="#888" strokeWidth="0.8"/>
      <path d="M56 8 L68 8" stroke="#333" strokeWidth="1.5"/>
      <polygon points="66,6 70,8 66,10" fill="#333"/>

      <rect x="72" y="2" width="16" height="12" rx="2" fill="#BC4A54"/>
      <text x="80" y="10.5" fontSize="6" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">NULL</text>
    </g>
    <text x="50" y="76" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Head ➔ Next ➔ NULL</text>
  </svg>
);

const DoublyGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(8, 38)">
      <rect x="0" y="0" width="26" height="18" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="13" y="12" fontSize="8" fill="#333" fontWeight="bold" textAnchor="middle" fontFamily="monospace">A</text>
      <line x1="8" y1="0" x2="8" y2="18" stroke="#888" strokeWidth="0.8"/>
      <line x1="18" y1="0" x2="18" y2="18" stroke="#888" strokeWidth="0.8"/>

      {/* Dual Arrows */}
      <path d="M26 6 L52 6" stroke="#06B6D4" strokeWidth="1.2"/>
      <polygon points="50,4.5 54,6 50,7.5" fill="#06B6D4"/>
      <path d="M52 12 L26 12" stroke="#BC4A54" strokeWidth="1.2"/>
      <polygon points="28,10.5 24,12 28,13.5" fill="#BC4A54"/>

      <rect x="54" y="0" width="26" height="18" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="67" y="12" fontSize="8" fill="#333" fontWeight="bold" textAnchor="middle" fontFamily="monospace">B</text>
      <line x1="62" y1="0" x2="62" y2="18" stroke="#888" strokeWidth="0.8"/>
      <line x1="72" y1="0" x2="72" y2="18" stroke="#888" strokeWidth="0.8"/>
    </g>
    <text x="50" y="78" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">prev ⮜ Node ➔ next</text>
  </svg>
);

const CircularGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <circle cx="50" cy="50" r="26" stroke="#333" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="50" cy="24" r="8" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
    <text x="50" y="27" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="bold">H</text>
    <circle cx="76" cy="50" r="8" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="50" cy="76" r="8" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="24" cy="50" r="8" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <path d="M46 76 C 20 76 10 35 42 24" stroke="#10B981" strokeWidth="1.5" strokeDasharray="2 2" fill="none"/>
    <text x="50" y="53" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold" fontFamily="monospace">tail.next=head</text>
  </svg>
);

const ReverseGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(10, 32)">
      <rect x="0" y="0" width="18" height="16" rx="2" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="9" y="11" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">1</text>
      <path d="M30 8 L18 8" stroke="#BC4A54" strokeWidth="2"/>
      <polygon points="20,6 16,8 20,10" fill="#BC4A54"/>
      
      <rect x="32" y="0" width="18" height="16" rx="2" fill="#BC4A54"/>
      <text x="41" y="11" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">2</text>
      <path d="M62 8 L50 8" stroke="#BC4A54" strokeWidth="2"/>
      <polygon points="52,6 48,8 52,10" fill="#BC4A54"/>

      <rect x="64" y="0" width="18" height="16" rx="2" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="73" y="11" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">3</text>
    </g>
    <text x="50" y="74" fontSize="8" fill="#BC4A54" textAnchor="middle" fontWeight="bold" fontFamily="monospace">curr.next = prev</text>
  </svg>
);

const FloydCycleGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <line x1="15" y1="50" x2="40" y2="50" stroke="#333" strokeWidth="1.5"/>
    <circle cx="15" cy="50" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="30" cy="50" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="45" cy="50" r="6" fill="#06B6D4" stroke="#333" strokeWidth="1.2"/>
    <text x="45" y="40" fontSize="6" fill="#06B6D4" textAnchor="middle" fontWeight="bold">SLOW</text>

    {/* Cycle loop */}
    <circle cx="68" cy="50" r="18" stroke="#BC4A54" strokeWidth="1.8" fill="none"/>
    <circle cx="78" cy="36" r="6" fill="#BC4A54" stroke="#333" strokeWidth="1.2"/>
    <text x="78" y="27" fontSize="6" fill="#BC4A54" textAnchor="middle" fontWeight="bold">FAST</text>
    <text x="50" y="82" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">2x speed collision</text>
  </svg>
);

const MiddleNodeGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(10, 38)">
      <circle cx="10" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <circle cx="28" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <circle cx="46" cy="10" r="8" fill="#10B981" stroke="#333" strokeWidth="1.5"/>
      <text x="46" y="13" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">MID</text>
      <circle cx="64" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <circle cx="82" cy="10" r="6" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="82" y="2" fontSize="6" fill="#BC4A54" textAnchor="middle" fontWeight="bold">END</text>
    </g>
    <text x="50" y="74" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Fast at End ➔ Slow at Mid</text>
  </svg>
);

const MergeSortedGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(12, 22)">
      <circle cx="10" cy="10" r="6" fill="#06B6D4" stroke="#333" strokeWidth="1"/>
      <text x="10" y="13" fontSize="7" fill="#fff" textAnchor="middle">1</text>
      <circle cx="36" cy="10" r="6" fill="#06B6D4" stroke="#333" strokeWidth="1"/>
      <text x="36" y="13" fontSize="7" fill="#fff" textAnchor="middle">4</text>
    </g>
    <g transform="translate(12, 42)">
      <circle cx="23" cy="10" r="6" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="23" y="13" fontSize="7" fill="#fff" textAnchor="middle">2</text>
      <circle cx="49" cy="10" r="6" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
      <text x="49" y="13" fontSize="7" fill="#fff" textAnchor="middle">5</text>
    </g>
    <path d="M22 32 L35 52 L48 32 L61 52" stroke="#333" strokeWidth="1.2" strokeDasharray="2 2" fill="none"/>
    <text x="50" y="78" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Zipper Merge O(N+M)</text>
  </svg>
);

const RemoveNthGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(10, 36)">
      <circle cx="10" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <circle cx="28" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <circle cx="46" cy="10" r="7" fill="#F43F5E" stroke="#333" strokeWidth="1.5"/>
      <line x1="41" y1="5" x2="51" y2="15" stroke="#fff" strokeWidth="1.8"/>
      <line x1="51" y1="5" x2="41" y2="15" stroke="#fff" strokeWidth="1.8"/>
      <circle cx="64" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <circle cx="82" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <path d="M34 5 C 40 -6 52 -6 58 5" stroke="#10B981" strokeWidth="1.8" fill="none"/>
    </g>
    <text x="50" y="74" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Skip N-th in 1-Pass</text>
  </svg>
);

const PalindromeGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(10, 36)">
      <circle cx="10" cy="10" r="7" fill="#10B981" stroke="#333" strokeWidth="1"/>
      <text x="10" y="13" fontSize="8" fill="#fff" textAnchor="middle">1</text>
      <circle cx="30" cy="10" r="7" fill="#06B6D4" stroke="#333" strokeWidth="1"/>
      <text x="30" y="13" fontSize="8" fill="#fff" textAnchor="middle">2</text>
      <circle cx="50" cy="10" r="7" fill="#06B6D4" stroke="#333" strokeWidth="1"/>
      <text x="50" y="13" fontSize="8" fill="#fff" textAnchor="middle">2</text>
      <circle cx="70" cy="10" r="7" fill="#10B981" stroke="#333" strokeWidth="1"/>
      <text x="70" y="13" fontSize="8" fill="#fff" textAnchor="middle">1</text>
    </g>
    <path d="M17 50 C 40 68 40 68 63 50" stroke="#10B981" strokeWidth="1.5" strokeDasharray="2 2" fill="none"/>
    <text x="50" y="76" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Mirror Match [1,2,2,1]</text>
  </svg>
);

const IntersectionGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(10, 20)">
      <circle cx="10" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <circle cx="28" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <line x1="34" y1="10" x2="48" y2="25" stroke="#333" strokeWidth="1.5"/>
    </g>
    <g transform="translate(10, 48)">
      <circle cx="10" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <circle cx="28" cy="10" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <line x1="34" y1="10" x2="48" y2="-5" stroke="#333" strokeWidth="1.5"/>
    </g>
    <circle cx="58" cy="45" r="8" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
    <text x="58" y="48" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="bold">X</text>
    <circle cx="78" cy="45" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <text x="50" y="80" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Shared Node Confluence</text>
  </svg>
);

const DeleteValGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(10, 36)">
      <circle cx="15" cy="10" r="7" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <circle cx="40" cy="10" r="8" fill="#F43F5E" stroke="#333" strokeWidth="1.5" opacity="0.4"/>
      <text x="40" y="13" fontSize="8" fill="#F43F5E" textAnchor="middle" fontWeight="bold">DEL</text>
      <circle cx="65" cy="10" r="7" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <path d="M22 6 C 35 -6 45 -6 58 6" stroke="#10B981" strokeWidth="2" fill="none"/>
      <polygon points="56,4 60,6 57,8" fill="#10B981"/>
    </g>
    <text x="50" y="74" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">prev.next = curr.next</text>
  </svg>
);

const LRUCacheGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(8, 30)">
      <rect x="0" y="0" width="22" height="16" rx="2" fill="#10B981"/>
      <text x="11" y="11" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="bold">MRU</text>
      <line x1="22" y1="8" x2="32" y2="8" stroke="#333" strokeWidth="1.5"/>
      <rect x="32" y="0" width="20" height="16" rx="2" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <line x1="52" y1="8" x2="62" y2="8" stroke="#333" strokeWidth="1.5"/>
      <rect x="62" y="0" width="22" height="16" rx="2" fill="#BC4A54"/>
      <text x="73" y="11" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="bold">LRU</text>
    </g>
    <text x="50" y="72" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Hash Map + Doubly List</text>
  </svg>
);

// ========================================================
// 12 LINKED LIST ALGORITHMS CATALOG LIST
// ========================================================

export const LINKED_LIST_ALGORITHMS = [
  {
    id: 'singly',
    name: 'Singly Linked List',
    category: 'Fundamentals',
    desc: 'Unidirectional pointer chain supporting dynamic node insertions and deletions without contiguous memory.',
    tag: 'O(1) Insert',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(n)' },
    graphic: <SinglyGraphic />
  },
  {
    id: 'doubly',
    name: 'Doubly Linked List',
    category: 'Fundamentals',
    desc: 'Bidirectional chain equipped with both next and prev pointers for rapid two-way traversal.',
    tag: 'O(1) Splice',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(n)' },
    graphic: <DoublyGraphic />
  },
  {
    id: 'circular',
    name: 'Circular Linked List',
    category: 'Ring Buffer',
    desc: 'Endless ring topology where the tail node loops directly back to the head pointer.',
    tag: 'O(1) Loop',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(n)' },
    graphic: <CircularGraphic />
  },
  {
    id: 'reverse',
    name: 'Reverse Linked List',
    category: 'Transformation',
    desc: 'Classic 3-pointer iterative pointer flipping (prev, curr, next) in a single linear pass.',
    tag: 'O(n) 1-Pass',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    graphic: <ReverseGraphic />
  },
  {
    id: 'floyd_cycle',
    name: "Floyd's Cycle Detection",
    category: 'Two Pointers',
    desc: 'Tortoise and Hare two-pointer algorithm racing at 1x and 2x speed to detect closed cycles.',
    tag: 'O(n) Race',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    graphic: <FloydCycleGraphic />
  },
  {
    id: 'middle_node',
    name: 'Middle of Linked List',
    category: 'Two Pointers',
    desc: 'Finds exact midpoint in 1 pass by advancing fast pointer 2 steps for every 1 step of slow pointer.',
    tag: 'O(n) 1-Pass',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    graphic: <MiddleNodeGraphic />
  },
  {
    id: 'merge_sorted',
    name: 'Merge Two Sorted Lists',
    category: 'Divide & Conquer',
    desc: 'Splices two pre-sorted lists into a single sorted chain by comparing heads in O(N+M) time.',
    tag: 'O(n+m)',
    complexity: { time: { best: 'O(1)', average: 'O(n+m)', worst: 'O(n+m)' }, space: 'O(1)' },
    graphic: <MergeSortedGraphic />
  },
  {
    id: 'remove_nth',
    name: 'Remove N-th From End',
    category: 'Two Pointers',
    desc: 'Offset pointer window of size N allows targeting and unlinking the target in a single traversal.',
    tag: 'O(n) 1-Pass',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    graphic: <RemoveNthGraphic />
  },
  {
    id: 'palindrome',
    name: 'Palindrome Linked List',
    category: 'Validation',
    desc: 'Splits at midpoint, reverses the second half, and verifies symmetrical node identity.',
    tag: 'O(n)',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    graphic: <PalindromeGraphic />
  },
  {
    id: 'intersection',
    name: 'Intersection of Two Lists',
    category: 'Two Pointers',
    desc: 'Equalizes path lengths by switching runners to opposite heads to find exact merge node.',
    tag: 'O(n+m)',
    complexity: { time: { best: 'O(1)', average: 'O(n+m)', worst: 'O(n+m)' }, space: 'O(1)' },
    graphic: <IntersectionGraphic />
  },
  {
    id: 'delete_val',
    name: 'Delete Node by Value',
    category: 'Modification',
    desc: 'Traverses to target value and updates predecessor pointer: prev.next = curr.next.',
    tag: 'O(n)',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    graphic: <DeleteValGraphic />
  },
  {
    id: 'lru_cache',
    name: 'LRU Cache Mechanics',
    category: 'Design Pattern',
    desc: 'Combines Hash Map with Doubly Linked List to provide true O(1) Get and Put cache eviction.',
    tag: 'O(1) Design',
    complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: 'O(capacity)' },
    graphic: <LRUCacheGraphic />
  }
];

export default function LinkedListHub() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = LINKED_LIST_ALGORITHMS.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FDFBF7] dark:bg-[#121212] relative overflow-hidden flex flex-col transition-colors duration-300 pb-16">
      
      {/* Background Ambient Gradients */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#D3DFC8]/30 rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 z-10">
        
        {/* Top Navigation & Breadcrumb */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to="/visualizer"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search 12 linked list algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Linked List Algorithms & Data Structures Suite
            </h1>
            <span className="text-xs font-mono font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2.5 py-1 rounded-full border border-teal-500/20">
              12 Cards
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Select any card below to launch its dedicated interactive visualizer with dynamic node add/delete, 3-pointer reverse, Floyd's cycle race, memory address tags, and ELI5 step intuition.
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
                <Link to={`/visualizer/linkedlist/${item.id}`} className="block group/head flex-1 flex flex-col">
                  {/* Top Graphic Box */}
                  <div className="w-full h-24 md:h-28 mb-3 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#252525] flex items-center justify-center transform group-hover/head:scale-[1.02] transition-transform duration-300">
                    {item.graphic}
                  </div>

                  {/* Title & Tag */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover/head:text-teal-600 dark:group-hover/head:text-teal-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20 shrink-0">
                      {item.tag}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.desc}
                  </p>
                </Link>

                {/* Bottom Action Footer */}
                <div className="flex justify-end mt-auto pt-2">
                  <Link 
                    to={`/visualizer/linkedlist/${item.id}`}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-xs"
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
