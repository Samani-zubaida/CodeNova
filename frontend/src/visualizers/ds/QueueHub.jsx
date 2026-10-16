import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ArrowLeft, Layers, RefreshCw, Sparkles, Activity, ShieldAlert, Cpu } from 'lucide-react';
import QueueVisualizer from './QueueVisualizer';

// ========================================================
// 8 CUSTOM SVG GRAPHICS FOR QUEUE ALGORITHMS & SUITE
// ========================================================

const BasicQueueGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(10, 38)">
      <rect x="0" y="0" width="18" height="24" rx="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="9" y="16" fontSize="11" fill="#333" textAnchor="middle" fontFamily="monospace" fontWeight="bold">12</text>
      <rect x="22" y="0" width="18" height="24" rx="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="31" y="16" fontSize="11" fill="#333" textAnchor="middle" fontFamily="monospace" fontWeight="bold">24</text>
      <rect x="44" y="0" width="18" height="24" rx="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="53" y="16" fontSize="11" fill="#333" textAnchor="middle" fontFamily="monospace" fontWeight="bold">36</text>
      
      {/* Front and Rear Pointers */}
      <path d="M9 28 L9 36" stroke="#AB526B" strokeWidth="1.5" markerEnd="url(#arrow)"/>
      <text x="9" y="44" fontSize="7" fill="#AB526B" textAnchor="middle" fontFamily="monospace" fontWeight="bold">FRONT</text>
      <path d="M53 28 L53 36" stroke="#C5CEAE" strokeWidth="1.5"/>
      <text x="53" y="44" fontSize="7" fill="#333" textAnchor="middle" fontFamily="monospace" fontWeight="bold">REAR</text>
    </g>
  </svg>
);

const CircularQueueGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <circle cx="50" cy="50" r="30" stroke="#333" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
    <circle cx="50" cy="20" r="8" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <text x="50" y="23" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace" fontWeight="bold">A</text>
    <circle cx="80" cy="50" r="8" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <text x="80" y="53" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace" fontWeight="bold">B</text>
    <circle cx="50" cy="80" r="8" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <text x="50" y="83" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace" fontWeight="bold">C</text>
    <circle cx="20" cy="50" r="8" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <text x="20" y="53" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="50" y="53" fontSize="7" fill="#666" textAnchor="middle" fontFamily="monospace">(i+1)%N</text>
  </svg>
);

const DequeGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D5C4"/>
    <g transform="translate(15, 38)">
      <path d="M-5 12 L5 12 M0 7 L-5 12 L0 17" stroke="#AB526B" strokeWidth="2"/>
      <rect x="10" y="0" width="16" height="24" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="28" y="0" width="16" height="24" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="46" y="0" width="16" height="24" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <path d="M75 12 L65 12 M70 7 L75 12 L70 17" stroke="#C5CEAE" strokeWidth="2"/>
    </g>
    <text x="50" y="78" fontSize="7" fill="#555" textAnchor="middle" fontFamily="monospace">Push & Pop Both Ends</text>
  </svg>
);

const PriorityQueueGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F0E2A4"/>
    <g transform="translate(12, 35)">
      <rect x="0" y="0" width="18" height="26" rx="4" fill="#AB526B" stroke="#333" strokeWidth="1"/>
      <text x="9" y="14" fontSize="10" fill="#FFF" textAnchor="middle" fontWeight="bold" fontFamily="monospace">99</text>
      <text x="9" y="22" fontSize="6" fill="#F0E2A4" textAnchor="middle" fontFamily="monospace">Prio 1</text>
      
      <rect x="22" y="4" width="18" height="22" rx="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="31" y="18" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">45</text>

      <rect x="44" y="8" width="18" height="18" rx="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="53" y="20" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">12</text>
    </g>
    <text x="50" y="78" fontSize="7" fill="#666" textAnchor="middle" fontFamily="monospace">Highest Priority Dequeued First</text>
  </svg>
);

const SlidingWindowGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#C5CEAE"/>
    <g transform="translate(10, 35)">
      <rect x="0" y="0" width="16" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="8" y="14" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">1</text>
      <rect x="18" y="0" width="40" height="20" rx="4" fill="#AB526B" fillOpacity="0.2" stroke="#AB526B" strokeWidth="2"/>
      <rect x="20" y="2" width="16" height="16" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="28" y="14" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">3</text>
      <rect x="38" y="2" width="16" height="16" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="46" y="14" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">-1</text>
      <rect x="60" y="0" width="16" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="68" y="14" fontSize="9" fill="#333" textAnchor="middle" fontFamily="monospace">-3</text>
    </g>
    <text x="50" y="75" fontSize="7" fill="#333" textAnchor="middle" fontFamily="monospace">Monotonic Deque O(N)</text>
  </svg>
);

const HotPotatoGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#FAF7F2"/>
    <circle cx="50" cy="50" r="28" stroke="#AB526B" strokeWidth="2" strokeDasharray="3 3"/>
    <circle cx="50" cy="22" r="7" fill="#AB526B"/>
    <circle cx="75" cy="45" r="7" fill="#C5CEAE"/>
    <circle cx="62" cy="73" r="7" fill="#F0E2A4"/>
    <circle cx="38" cy="73" r="7" fill="#423834"/>
    <circle cx="25" cy="45" r="7" fill="#5C4E49"/>
    <text x="50" y="53" fontSize="14" textAnchor="middle">🥔</text>
  </svg>
);

const TwoStacksGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E2D4C9"/>
    <g transform="translate(15, 30)">
      {/* In Stack */}
      <rect x="0" y="0" width="25" height="40" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="12.5" y="48" fontSize="7" fill="#333" textAnchor="middle" fontFamily="monospace">In Stack</text>
      {/* Transfer Arrow */}
      <path d="M28 20 L40 20" stroke="#AB526B" strokeWidth="2" markerEnd="url(#arrow)"/>
      {/* Out Stack */}
      <rect x="43" y="0" width="25" height="40" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="55.5" y="48" fontSize="7" fill="#333" textAnchor="middle" fontFamily="monospace">Out Stack</text>
    </g>
  </svg>
);

const BFSGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#331921"/>
    <circle cx="50" cy="25" r="7" fill="#F0E2A4"/>
    <circle cx="28" cy="55" r="7" fill="#C5CEAE"/>
    <circle cx="72" cy="55" r="7" fill="#C5CEAE"/>
    <line x1="50" y1="25" x2="28" y2="55" stroke="#F0E2A4" strokeWidth="1.5"/>
    <line x1="50" y1="25" x2="72" y2="55" stroke="#F0E2A4" strokeWidth="1.5"/>
    <text x="50" y="82" fontSize="7" fill="#FAF7F2" textAnchor="middle" fontFamily="monospace">Level-Order BFS Queue</text>
  </svg>
);

export const QUEUE_CATALOG_ITEMS = [
  {
    id: 'basic',
    name: 'FIFO Queue (Basic Linear Queue)',
    tag: 'O(1)',
    category: 'Fundamentals',
    desc: 'Elements enqueue at Rear and dequeue at Front. First-In, First-Out sequence.',
    graphic: <BasicQueueGraphic />
  },
  {
    id: 'circular',
    name: 'Circular Queue (Ring Buffer)',
    tag: 'O(1)',
    category: 'Advanced Buffers',
    desc: 'Fixed-capacity ring buffer with wrap-around head/tail pointers using (rear + 1) % N modulo indexing.',
    graphic: <CircularQueueGraphic />
  },
  {
    id: 'deque',
    name: 'Double-Ended Queue (Deque)',
    tag: 'O(1)',
    category: 'Fundamentals',
    desc: 'Insertion and deletion supported at both ends (Push Front, Push Rear, Pop Front, Pop Rear).',
    graphic: <DequeGraphic />
  },
  {
    id: 'priority',
    name: 'Priority Queue (Min-Max Priority)',
    tag: 'O(log N)',
    category: 'Advanced Buffers',
    desc: 'Elements are ordered by priority keys. The highest/lowest priority element is dequeued first.',
    graphic: <PriorityQueueGraphic />
  },
  {
    id: 'slidingWindow',
    name: 'Sliding Window Maximum',
    tag: 'O(N)',
    category: 'Applications',
    desc: 'Monotonic decreasing deque to track maximum values in sliding subarray windows in linear time.',
    graphic: <SlidingWindowGraphic />
  },
  {
    id: 'hotPotato',
    name: 'Hot Potato Game (Josephus)',
    tag: 'O(N*K)',
    category: 'Applications',
    desc: 'Circular elimination game simulating round-robin pass using enqueue(dequeue()) loop.',
    graphic: <HotPotatoGraphic />
  },
  {
    id: 'twoStacks',
    name: 'Queue using 2 Stacks',
    tag: 'Amortized O(1)',
    category: 'Fundamentals',
    desc: 'Simulating FIFO queue operations using an In-Stack and an Out-Stack for element reversal.',
    graphic: <TwoStacksGraphic />
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS Queue)',
    tag: 'O(V + E)',
    category: 'Queues in Graphs/Games',
    desc: 'Level-order graph and tree traversal driven by FIFO queue frontier expansion.',
    graphic: <BFSGraphic />
  }
];

export default function QueueHub() {
  const { algoId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // If URL has an algorithm ID, render dedicated Queue visualizer studio
  if (algoId) {
    return <QueueVisualizer initialAlgoId={algoId} />;
  }

  const categories = ['All', 'Fundamentals', 'Advanced Buffers', 'Applications', 'Queues in Graphs/Games'];

  const filteredItems = QUEUE_CATALOG_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#331921] text-[#423834] dark:text-[#FAF7F2] p-4 md:p-8 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP HUB HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#5C4E49]/20 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-[#AB526B] text-white shadow-lg">
                <Layers size={28} />
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Queue Data Structures Suite
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[#BCA297] max-w-2xl">
              Explore 8 comprehensive Queue algorithms and data structure variations. Select any card below to launch its interactive visualizer studio with step-by-step memory inspection!
            </p>
          </div>

          {/* Return to Dashboard Button */}
          <Link
            to="/oop"
            className="px-4 py-2.5 rounded-xl bg-[#423834] text-[#FAF7F2] hover:bg-[#5C4E49] text-xs font-mono font-bold transition-all flex items-center gap-2 self-start md:self-auto shadow-md"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* SEARCH & CATEGORY FILTERS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#331921]/10 dark:bg-[#423834]/40 p-4 rounded-2xl border border-[#5C4E49]/30">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#AB526B] text-white shadow-md'
                    : 'bg-[#423834]/20 hover:bg-[#423834]/40 text-[#BCA297]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BCA297]" />
            <input
              type="text"
              placeholder="Search Queue algorithms..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#5C4E49]/40 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#AB526B]"
            />
          </div>
        </div>

        {/* 8-CARD CATALOG GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#423834] rounded-2xl p-4 md:p-5 shadow-sm border border-[#EBE0D3]/50 dark:border-[#5C4E49] hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Card Graphic Header */}
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-gray-50 dark:bg-[#5C4E49] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                    {item.graphic}
                  </div>

                  {/* Badge & Title */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#AB526B]/10 text-[#AB526B] dark:text-[#F0E2A4] border border-[#AB526B]/20">
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 dark:text-gray-300">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#AB526B] transition-colors mb-2">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Launch Button */}
                <Link
                  to={`/visualizer/queue/${item.id}`}
                  className="mt-5 w-full py-2.5 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white text-xs font-mono font-bold shadow-xs transition-all flex items-center justify-center gap-2 group-hover:gap-3"
                >
                  <span>Enter Visualization</span>
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
