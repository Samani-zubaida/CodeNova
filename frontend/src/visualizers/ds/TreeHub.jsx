import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ArrowLeft, GitFork, Sparkles } from 'lucide-react';

// ========================================================
// 12 CUSTOM PASTEL SVG GRAPHICS FOR TREE CONCEPTS
// ========================================================

const BSTGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <circle cx="50" cy="24" r="8" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <text x="50" y="27.5" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">50</text>
    <line x1="44" y1="29" x2="30" y2="49" stroke="#5C4E49" strokeWidth="1.2"/>
    <line x1="56" y1="29" x2="70" y2="49" stroke="#5C4E49" strokeWidth="1.2"/>
    <circle cx="26" cy="54" r="7" fill="#C5CEAE" stroke="#423834" strokeWidth="1"/>
    <text x="26" y="57" fontSize="7" fill="#2D1F23" textAnchor="middle" fontWeight="bold">25</text>
    <circle cx="74" cy="54" r="7" fill="#F0E2A4" stroke="#423834" strokeWidth="1"/>
    <text x="74" y="57" fontSize="7" fill="#2D1F23" textAnchor="middle" fontWeight="bold">75</text>
    <text x="50" y="80" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace">Left &lt; Root &lt; Right</text>
  </svg>
);

const AVLGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <circle cx="50" cy="30" r="8" fill="#AB526B" stroke="#423834" strokeWidth="1.2"/>
    <text x="50" y="33.5" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">30</text>
    <text x="62" y="22" fontSize="7" fill="#AB526B" fontWeight="bold">BF=0</text>
    <line x1="44" y1="35" x2="30" y2="55" stroke="#5C4E49" strokeWidth="1.2"/>
    <line x1="56" y1="35" x2="70" y2="55" stroke="#5C4E49" strokeWidth="1.2"/>
    <circle cx="26" cy="60" r="7" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <text x="26" y="63" fontSize="7" fill="#333" textAnchor="middle">20</text>
    <circle cx="74" cy="60" r="7" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <text x="74" y="63" fontSize="7" fill="#333" textAnchor="middle">40</text>
    <path d="M78 48 C 88 35 65 15 52 20" stroke="#AB526B" strokeWidth="1.5" strokeDasharray="2 2" fill="none"/>
    <text x="50" y="82" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace">|BF| ≤ 1 Auto-Rotations</text>
  </svg>
);

const InorderGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <circle cx="50" cy="24" r="7" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <text x="50" y="27" fontSize="8" fill="#333" textAnchor="middle">2</text>
    <line x1="45" y1="28" x2="30" y2="46" stroke="#5C4E49" strokeWidth="1"/>
    <line x1="55" y1="28" x2="70" y2="46" stroke="#5C4E49" strokeWidth="1"/>
    <circle cx="26" cy="50" r="7" fill="#C5CEAE" stroke="#423834" strokeWidth="1"/>
    <text x="26" y="53" fontSize="8" fill="#2D1F23" textAnchor="middle" fontWeight="bold">1</text>
    <circle cx="74" cy="50" r="7" fill="#F0E2A4" stroke="#423834" strokeWidth="1"/>
    <text x="74" y="53" fontSize="8" fill="#2D1F23" textAnchor="middle" fontWeight="bold">3</text>
    <rect x="20" y="70" width="60" height="15" rx="3" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <text x="50" y="81" fontSize="8" fill="#AB526B" textAnchor="middle" fontWeight="bold" fontFamily="monospace">[1 ➔ 2 ➔ 3] Sorted</text>
  </svg>
);

const PreorderGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <circle cx="50" cy="24" r="8" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <text x="50" y="27.5" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">1</text>
    <line x1="45" y1="28" x2="30" y2="46" stroke="#5C4E49" strokeWidth="1"/>
    <line x1="55" y1="28" x2="70" y2="46" stroke="#5C4E49" strokeWidth="1"/>
    <circle cx="26" cy="50" r="7" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <text x="26" y="53" fontSize="8" fill="#333" textAnchor="middle">2</text>
    <circle cx="74" cy="50" r="7" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <text x="74" y="53" fontSize="8" fill="#333" textAnchor="middle">3</text>
    <text x="50" y="78" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace">Root ➔ Left ➔ Right</text>
  </svg>
);

const PostorderGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <circle cx="50" cy="24" r="8" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <text x="50" y="27.5" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">3</text>
    <line x1="45" y1="28" x2="30" y2="46" stroke="#5C4E49" strokeWidth="1"/>
    <line x1="55" y1="28" x2="70" y2="46" stroke="#5C4E49" strokeWidth="1"/>
    <circle cx="26" cy="50" r="7" fill="#C5CEAE" stroke="#423834" strokeWidth="1"/>
    <text x="26" y="53" fontSize="8" fill="#2D1F23" textAnchor="middle" fontWeight="bold">1</text>
    <circle cx="74" cy="50" r="7" fill="#F0E2A4" stroke="#423834" strokeWidth="1"/>
    <text x="74" y="53" fontSize="8" fill="#2D1F23" textAnchor="middle" fontWeight="bold">2</text>
    <text x="50" y="78" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace">Left ➔ Right ➔ Root</text>
  </svg>
);

const LevelorderGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <circle cx="50" cy="22" r="6" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <line x1="45" y1="26" x2="30" y2="42" stroke="#5C4E49" strokeWidth="1"/>
    <line x1="55" y1="26" x2="70" y2="42" stroke="#5C4E49" strokeWidth="1"/>
    <circle cx="26" cy="46" r="6" fill="#C5CEAE" stroke="#423834" strokeWidth="1"/>
    <circle cx="74" cy="46" r="6" fill="#C5CEAE" stroke="#423834" strokeWidth="1"/>
    <path d="M15 22 L85 22" stroke="#AB526B" strokeWidth="1" strokeDasharray="3 3"/>
    <path d="M15 46 L85 46" stroke="#AB526B" strokeWidth="1" strokeDasharray="3 3"/>
    <text x="50" y="76" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace">Row-by-Row FIFO Queue</text>
  </svg>
);

const LCAGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <circle cx="50" cy="24" r="8" fill="#AB526B" stroke="#423834" strokeWidth="1.5"/>
    <text x="50" y="27.5" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">LCA</text>
    <line x1="45" y1="28" x2="26" y2="52" stroke="#AB526B" strokeWidth="1.8"/>
    <line x1="55" y1="28" x2="74" y2="52" stroke="#AB526B" strokeWidth="1.8"/>
    <circle cx="26" cy="56" r="7" fill="#C5CEAE" stroke="#423834" strokeWidth="1"/>
    <text x="26" y="59" fontSize="7" fill="#2D1F23" textAnchor="middle" fontWeight="bold">p</text>
    <circle cx="74" cy="56" r="7" fill="#F0E2A4" stroke="#423834" strokeWidth="1"/>
    <text x="74" y="59" fontSize="7" fill="#2D1F23" textAnchor="middle" fontWeight="bold">q</text>
    <text x="50" y="80" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace">Lowest Shared Ancestor</text>
  </svg>
);

const MaxDepthGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <line x1="50" y1="18" x2="30" y2="38" stroke="#5C4E49" strokeWidth="1"/>
    <line x1="30" y1="38" x2="20" y2="58" stroke="#5C4E49" strokeWidth="1"/>
    <line x1="20" y1="58" x2="15" y2="78" stroke="#AB526B" strokeWidth="2"/>
    <circle cx="50" cy="18" r="5" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <circle cx="30" cy="38" r="5" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <circle cx="20" cy="58" r="5" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <circle cx="15" cy="78" r="6" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <text x="65" y="52" fontSize="9" fill="#423834" fontWeight="bold" fontFamily="monospace">h = 4</text>
  </svg>
);

const InvertTreeGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <circle cx="50" cy="24" r="7" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <circle cx="25" cy="54" r="7" fill="#C5CEAE" stroke="#423834" strokeWidth="1"/>
    <text x="25" y="57" fontSize="7" fill="#2D1F23" textAnchor="middle">L</text>
    <circle cx="75" cy="54" r="7" fill="#F0E2A4" stroke="#423834" strokeWidth="1"/>
    <text x="75" y="57" fontSize="7" fill="#2D1F23" textAnchor="middle">R</text>
    <path d="M34 54 C 50 64 50 64 66 54" stroke="#423834" strokeWidth="1.5" strokeDasharray="2 2" fill="none"/>
    <text x="50" y="78" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace">Mirror Swap Left ⇄ Right</text>
  </svg>
);

const ValidateBSTGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <circle cx="50" cy="24" r="8" fill="#C5CEAE" stroke="#423834" strokeWidth="1.2"/>
    <text x="50" y="27" fontSize="8" fill="#2D1F23" textAnchor="middle" fontWeight="bold">10</text>
    <text x="50" y="12" fontSize="6" fill="#888" textAnchor="middle">(-∞, +∞)</text>
    <line x1="45" y1="28" x2="30" y2="48" stroke="#5C4E49" strokeWidth="1"/>
    <line x1="55" y1="28" x2="70" y2="48" stroke="#5C4E49" strokeWidth="1"/>
    <circle cx="26" cy="52" r="7" fill="#C5CEAE" stroke="#423834" strokeWidth="1"/>
    <text x="26" y="55" fontSize="7" fill="#2D1F23" textAnchor="middle">5</text>
    <circle cx="74" cy="52" r="7" fill="#C5CEAE" stroke="#423834" strokeWidth="1"/>
    <text x="74" y="55" fontSize="7" fill="#2D1F23" textAnchor="middle">15</text>
    <text x="50" y="78" fontSize="8" fill="#AB526B" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Valid: Low &lt; Node &lt; High</text>
  </svg>
);

const DiameterGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <circle cx="50" cy="20" r="6" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <line x1="45" y1="24" x2="25" y2="46" stroke="#AB526B" strokeWidth="2"/>
    <line x1="55" y1="24" x2="75" y2="46" stroke="#AB526B" strokeWidth="2"/>
    <circle cx="25" cy="50" r="6" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <line x1="25" y1="56" x2="15" y2="76" stroke="#AB526B" strokeWidth="2"/>
    <circle cx="15" cy="78" r="6" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <circle cx="75" cy="50" r="6" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
    <text x="50" y="82" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace">Longest Path Between Leaves</text>
  </svg>
);

const SegmentTreeGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <rect x="35" y="16" width="30" height="15" rx="3" fill="#AB526B"/>
    <text x="50" y="27" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">Σ[0..3]</text>
    <line x1="42" y1="31" x2="28" y2="48" stroke="#5C4E49" strokeWidth="1.2"/>
    <line x1="58" y1="31" x2="72" y2="48" stroke="#5C4E49" strokeWidth="1.2"/>
    <rect x="14" y="48" width="28" height="14" rx="2" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <text x="28" y="58" fontSize="7" fill="#333" textAnchor="middle">Σ[0..1]</text>
    <rect x="58" y="48" width="28" height="14" rx="2" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
    <text x="72" y="58" fontSize="7" fill="#333" textAnchor="middle">Σ[2..3]</text>
    <text x="50" y="80" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace">Range Queries O(log n)</text>
  </svg>
);

// ========================================================
// 12 TREE ALGORITHMS CATALOG LIST
// ========================================================

export const TREE_ALGORITHMS = [
  {
    id: 'bst',
    name: 'Binary Search Tree',
    category: 'BST Fundamentals',
    desc: 'Ordered tree satisfying Left < Root < Right, enabling average O(log n) search, insertion, and deletion.',
    tag: 'O(log n) Avg',
    complexity: { time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' }, space: 'O(h)' },
    graphic: <BSTGraphic />
  },
  {
    id: 'avl',
    name: 'AVL Tree (Self-Balancing)',
    category: 'Balanced Trees',
    desc: 'Strictly height-balanced BST guaranteeing O(log n) worst-case time via LL, RR, LR, and RL rotations.',
    tag: 'O(log n) Strict',
    complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(n)' },
    graphic: <AVLGraphic />
  },
  {
    id: 'inorder',
    name: 'In-Order Traversal',
    category: 'Traversals',
    desc: 'Visits nodes Left ➔ Root ➔ Right, yielding a strictly sorted ascending sequence for any BST.',
    tag: 'O(n) Sorted',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)' },
    graphic: <InorderGraphic />
  },
  {
    id: 'preorder',
    name: 'Pre-Order Traversal',
    category: 'Traversals',
    desc: 'Processes Root ➔ Left ➔ Right, ideal for serializing and cloning hierarchical tree data.',
    tag: 'O(n) Clone',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)' },
    graphic: <PreorderGraphic />
  },
  {
    id: 'postorder',
    name: 'Post-Order Traversal',
    category: 'Traversals',
    desc: 'Evaluates Left ➔ Right ➔ Root, ideal for bottom-up computation like directory sizing and pruning.',
    tag: 'O(n) Bottom-Up',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)' },
    graphic: <PostorderGraphic />
  },
  {
    id: 'levelorder',
    name: 'Level-Order (BFS)',
    category: 'Traversals',
    desc: 'Breadth-first exploration exploring nodes row-by-row using a FIFO conveyor queue chamber.',
    tag: 'O(n) BFS',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(w)' },
    graphic: <LevelorderGraphic />
  },
  {
    id: 'lca',
    name: 'Lowest Common Ancestor',
    category: 'Ancestry',
    desc: 'Finds the lowest shared ancestor node that has both targets p and q as descendants.',
    tag: 'O(h) Ancestor',
    complexity: { time: { best: 'O(1)', average: 'O(h)', worst: 'O(n)' }, space: 'O(h)' },
    graphic: <LCAGraphic />
  },
  {
    id: 'max_depth',
    name: 'Maximum Depth / Height',
    category: 'Divide & Conquer',
    desc: 'Calculates the longest path from root to leaf via 1 + max(depth(L), depth(R)).',
    tag: 'O(n) Height',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)' },
    graphic: <MaxDepthGraphic />
  },
  {
    id: 'invert_tree',
    name: 'Invert / Mirror Tree',
    category: 'Transformation',
    desc: 'Recursively mirrors all left and right child pointers to produce a horizontal flip.',
    tag: 'O(n) Mirror',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)' },
    graphic: <InvertTreeGraphic />
  },
  {
    id: 'validate_bst',
    name: 'Validate BST Invariant',
    category: 'Validation',
    desc: 'Propagates min/max value bounds to guarantee every subtree strictly obeys BST ordering.',
    tag: 'O(n) Valid',
    complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)' },
    graphic: <ValidateBSTGraphic />
  },
  {
    id: 'diameter',
    name: 'Diameter of Binary Tree',
    category: 'Calculus',
    desc: 'Measures the longest path between any two leaf nodes in the tree, which may or may not pass root.',
    tag: 'O(n) Path',
    complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(h)' },
    graphic: <DiameterGraphic />
  },
  {
    id: 'segment_tree',
    name: 'Segment Tree',
    category: 'Advanced Query',
    desc: 'Tree data structure storing interval intervals to answer range sum/min queries in O(log n).',
    tag: 'O(log n) Query',
    complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(n)' },
    graphic: <SegmentTreeGraphic />
  }
];

export default function TreeHub() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = TREE_ALGORITHMS.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FAF7F2] dark:bg-[#331921] relative overflow-hidden flex flex-col transition-colors duration-300 pb-16">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#AB526B]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#F0E2A4]/20 rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 z-10">
        
        {/* Top Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#5C4E49]/20 pb-4">
          <Link
            to="/oop"
            className="inline-flex items-center gap-2 text-xs font-bold font-mono text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#BCA297]" size={16} />
            <input
              type="text"
              placeholder="Search 12 tree algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#AB526B] shadow-xs text-gray-800 dark:text-[#FAF7F2]"
            />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#AB526B] text-white shadow-md">
              <GitFork size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-[#FAF7F2] tracking-tight">
              Tree & Hierarchy Algorithms Suite
            </h1>
            <span className="text-xs font-mono font-bold bg-[#AB526B]/10 text-[#AB526B] dark:text-[#F0E2A4] px-2.5 py-1 rounded-full border border-[#AB526B]/20">
              12 Modes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#BCA297] mt-2 max-w-2xl">
            Explore 12 interactive tree algorithms with step-by-step memory dry runs, in-canvas node additions, self-balancing AVL rotations, and Lowest Common Ancestor tracking.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.02 }}
                className="bg-white dark:bg-[#423834] rounded-2xl p-4 md:p-5 shadow-sm border border-[#EBE0D3]/60 dark:border-[#5C4E49] hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Graphic Thumbnail */}
                  <div className="w-full h-28 mb-3 rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#5C4E49] flex items-center justify-center transform group-hover:scale-[1.02] transition-transform duration-300">
                    {item.graphic}
                  </div>

                  {/* Title & Tag */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold bg-[#AB526B]/10 text-[#AB526B] dark:text-[#F0E2A4] px-2 py-0.5 rounded-full border border-[#AB526B]/20">
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 dark:text-[#BCA297]">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-[#AB526B] transition-colors mb-1.5">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Launch Button */}
                <Link 
                  to={`/visualizer/tree/${item.id}`}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white text-xs font-mono font-bold shadow-xs transition-all flex items-center justify-center gap-2 group-hover:gap-3"
                >
                  <span>Enter Studio</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
