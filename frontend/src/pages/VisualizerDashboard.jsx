import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Binary, KeyRound, ArrowRight } from 'lucide-react';

const GraphGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g stroke="#333" strokeWidth="1.5">
      <line x1="25" y1="35" x2="55" y2="25"/>
      <line x1="25" y1="35" x2="40" y2="70"/>
      <line x1="55" y1="25" x2="75" y2="50"/>
      <line x1="40" y1="70" x2="75" y2="50"/>
      <line x1="55" y1="25" x2="40" y2="70"/>
    </g>
    <circle cx="25" cy="35" r="7" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
    <circle cx="55" cy="25" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="40" cy="70" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="75" cy="50" r="7" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
  </svg>
);

const ArrayGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(10, 35)">
      <rect x="0" y="0" width="18" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="9" y="16" fontSize="12" fill="#333" textAnchor="middle" fontFamily="monospace">0</text>
      
      <rect x="20" y="0" width="18" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="29" y="16" fontSize="12" fill="#333" textAnchor="middle" fontFamily="monospace">1</text>
      
      <rect x="40" y="0" width="18" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="49" y="16" fontSize="12" fill="#333" textAnchor="middle" fontFamily="monospace">2</text>
      
      <rect x="60" y="0" width="18" height="24" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <text x="69" y="16" fontSize="12" fill="#333" textAnchor="middle" fontFamily="monospace">3</text>
    </g>
    <circle cx="35" cy="70" r="1.5" fill="#333"/>
    <circle cx="45" cy="70" r="1.5" fill="#333"/>
    <circle cx="55" cy="70" r="1.5" fill="#333"/>
  </svg>
);

const StringGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <text x="15" y="45" fontSize="32" fill="#333" fontFamily="serif">“</text>
    <text x="75" y="45" fontSize="32" fill="#333" fontFamily="serif">”</text>
    <g transform="translate(15, 60)" stroke="#333" strokeWidth="2">
      <line x1="0" y1="0" x2="15" y2="0"/>
      <line x1="20" y1="0" x2="35" y2="0"/>
      <line x1="40" y1="0" x2="55" y2="0"/>
      <line x1="60" y1="0" x2="75" y2="0"/>
    </g>
  </svg>
);

const StackGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(25, 20)">
      <rect x="0" y="0" width="30" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="0" y="15" width="30" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="0" y="30" width="30" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="0" y="45" width="30" height="10" fill="#BC4A54" stroke="#333" strokeWidth="1"/>
    </g>
    <g transform="translate(70, 20)" stroke="#333" strokeWidth="1.5">
      <line x1="0" y1="50" x2="0" y2="5"/>
      <path d="M-4 9 L0 5 L4 9"/>
    </g>
  </svg>
);

const QueueGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(20, 35)">
      <rect x="0" y="0" width="15" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="15" y="0" width="30" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="45" y="0" width="15" height="20" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    </g>
    <g transform="translate(10, 45)" stroke="#333" strokeWidth="1.5">
      <line x1="-5" y1="0" x2="5" y2="0"/>
      <path d="M1 -3 L5 0 L1 3"/>
    </g>
    <g transform="translate(80, 45)" stroke="#333" strokeWidth="1.5">
      <line x1="0" y1="0" x2="10" y2="0"/>
      <path d="M6 -3 L10 0 L6 3"/>
    </g>
    <circle cx="45" cy="70" r="1.5" fill="#333"/>
    <circle cx="50" cy="70" r="1.5" fill="#333"/>
    <circle cx="55" cy="70" r="1.5" fill="#333"/>
  </svg>
);

const LinkedListGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(10, 40)">
      <rect x="0" y="0" width="20" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <path d="M20 7.5 L30 7.5" stroke="#333" strokeWidth="1"/>
      <path d="M28 5.5 L30 7.5 L28 9.5" stroke="#333" fill="none"/>
      
      <rect x="35" y="0" width="20" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <path d="M55 7.5 L65 7.5" stroke="#333" strokeWidth="1" strokeDasharray="2 2"/>
      <path d="M63 5.5 L65 7.5 L63 9.5" stroke="#333" fill="none"/>
      
      <rect x="70" y="0" width="15" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    </g>
  </svg>
);

const TreeGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g stroke="#333" strokeWidth="1">
      <line x1="50" y1="20" x2="30" y2="45"/>
      <line x1="50" y1="20" x2="70" y2="45"/>
      
      <line x1="30" y1="45" x2="20" y2="70"/>
      <line x1="30" y1="45" x2="40" y2="70"/>
      
      <line x1="70" y1="45" x2="60" y2="70"/>
      <line x1="70" y1="45" x2="80" y2="70"/>
    </g>
    <circle cx="50" cy="20" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    
    <circle cx="30" cy="45" r="5" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="70" cy="45" r="5" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    
    <circle cx="20" cy="70" r="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="40" cy="70" r="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="60" cy="70" r="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="80" cy="70" r="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
  </svg>
);

const HeapGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g stroke="#333" strokeWidth="1">
      <line x1="50" y1="25" x2="35" y2="50"/>
      <line x1="50" y1="25" x2="65" y2="50"/>
      <line x1="35" y1="50" x2="25" y2="75"/>
      <line x1="35" y1="50" x2="45" y2="75"/>
      <line x1="65" y1="50" x2="55" y2="75"/>
      <line x1="65" y1="50" x2="75" y2="75"/>
    </g>
    <circle cx="50" cy="25" r="5" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="35" cy="50" r="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="65" cy="50" r="4" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="25" cy="75" r="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="45" cy="75" r="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="55" cy="75" r="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <circle cx="75" cy="75" r="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
  </svg>
);

const HashMapGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(15, 20)">
      <rect x="0" y="0" width="15" height="60" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <line x1="0" y1="15" x2="15" y2="15" stroke="#333" strokeWidth="1"/>
      <line x1="0" y1="30" x2="15" y2="30" stroke="#333" strokeWidth="1"/>
      <line x1="0" y1="45" x2="15" y2="45" stroke="#333" strokeWidth="1"/>
      <text x="7" y="11" fontSize="8" fill="#333" textAnchor="middle">0</text>
      <text x="7" y="26" fontSize="8" fill="#333" textAnchor="middle">1</text>
      <text x="7" y="41" fontSize="8" fill="#333" textAnchor="middle">2</text>
      <text x="7" y="55" fontSize="10" fill="#333" textAnchor="middle">..</text>
    </g>
    <g stroke="#333" strokeWidth="1">
      <path d="M30 27.5 L45 27.5" />
      <path d="M43 25.5 L45 27.5 L43 29.5" fill="none"/>
      
      <path d="M30 42.5 L45 50" />
      <path d="M42 48.5 L45 50 L44 47" fill="none"/>
      
      <path d="M30 57.5 L45 70" />
      <path d="M42 68.5 L45 70 L44 67" fill="none"/>
    </g>
    <g transform="translate(50, 20)">
      <rect x="0" y="0" width="20" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="0" y="20" width="20" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="0" y="40" width="20" height="15" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    </g>
  </svg>
);

const GenericGraphic = ({ color = "#F4E9D4" }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill={color}/>
    <circle cx="50" cy="50" r="20" fill="#FDFBF7" opacity="0.5"/>
  </svg>
);

const categories = [
  {
    id: 'ds',
    title: 'Data Structures',
    icon: <Database size={24} className="text-white" />,
    items: [
      { 
        name: 'Array Suite', 
        path: '/visualizer/array', 
        desc: '16 Types & Algos • Dedicated 3D Spatial Simulator', 
        graphic: <ArrayGraphic />,
        totalCount: 16,
        algorithms: [
          { id: 'binary_search', name: 'Binary Search', tag: 'O(log n)' },
          { id: 'quicksort', name: 'Quick Sort', tag: 'O(n log n)' },
          { id: 'mergesort', name: 'Merge Sort', tag: 'O(n log n)' },
          { id: 'bubblesort', name: 'Bubble Sort', tag: 'O(n²)' },
          { id: 'two_sum', name: 'Two Pointers', tag: 'O(n)' },
          { id: 'sliding_window', name: 'Sliding Window', tag: 'O(n)' }
        ]
      },
      { 
        name: 'Graph Suite', 
        path: '/visualizer/graph', 
        desc: 'Network traversals, paths & structural analysis', 
        graphic: <GraphGraphic />,
        totalCount: 15,
        algorithms: [
          { id: 'bfs', name: 'BFS Traversal', tag: 'O(V+E)' },
          { id: 'dfs', name: 'DFS Traversal', tag: 'O(V+E)' },
          { id: 'dijkstra', name: "Dijkstra's Path", tag: 'O((V+E)log V)' },
          { id: 'astar', name: 'A* Heuristic', tag: 'Heuristic' },
          { id: 'toposort', name: 'Topological Sort', tag: 'O(V+E)' },
          { id: 'cycle', name: 'Cycle Detection', tag: '3-Color' }
        ]
      },
      { name: 'String', path: '/visualizer/string', desc: 'Immutable vs Mutable', graphic: <StringGraphic /> },
      { name: 'Stack', path: '/visualizer/stack', desc: 'LIFO principle', graphic: <StackGraphic /> },
      { name: 'Queue', path: '/visualizer/queue', desc: 'FIFO principle', graphic: <QueueGraphic /> },
      { name: 'Linked List', path: '/visualizer/linkedlist', desc: 'Nodes and pointers', graphic: <LinkedListGraphic /> },
      { name: 'Tree', path: '/visualizer/tree', desc: 'Hierarchical nodes', graphic: <TreeGraphic /> },
      { name: 'Heap', path: '/visualizer/heap', desc: 'Priority queues', graphic: <HeapGraphic /> },
      { name: 'Hash Map', path: '/visualizer/map', desc: 'O(1) lookups', graphic: <HashMapGraphic /> },
    ]
  },
  {
    id: 'oop',
    title: 'Object-Oriented',
    icon: <Binary size={20} className="text-gray-600" />,
    items: [
      { name: 'Encapsulation', path: '/visualizer/encapsulation', desc: 'Protecting internal state', graphic: <GenericGraphic color="#D3DFC8" /> },
      { name: 'Abstraction', path: '/visualizer/abstraction', desc: 'Hiding complexity', graphic: <GenericGraphic color="#F4E9D4" /> },
      { name: 'Inheritance', path: '/visualizer/inheritance', desc: 'Hierarchy and code reuse', graphic: <GenericGraphic color="#E8D1CB" /> },
      { name: 'Polymorphism', path: '/visualizer/polymorphism', desc: 'Many forms, one interface', graphic: <GenericGraphic color="#D3DFC8" /> },
    ]
  },
  {
    id: 'crypto',
    title: 'Cryptography',
    icon: <KeyRound size={20} className="text-gray-600" />,
    items: [
      { name: 'Caesar Cipher', path: '/visualizer/caesar', desc: 'Shift substitution', graphic: <GenericGraphic color="#D3DFC8" /> },
      { name: 'Vigenère Cipher', path: '/visualizer/vigenere', desc: 'Polyalphabetic substitution', graphic: <GenericGraphic color="#E8D1CB" /> },
      { name: 'Playfair Cipher', path: '/visualizer/playfair', desc: '5x5 grid substitution', graphic: <GenericGraphic color="#F4E9D4" /> },
      { name: 'AES-256', path: '/visualizer/aes', desc: 'Advanced Encryption Standard', graphic: <GenericGraphic color="#D3DFC8" /> },
      { name: 'RSA Key Gen', path: '/visualizer/rsa', desc: 'Asymmetric cryptography', graphic: <GenericGraphic color="#E8D1CB" /> },
      { name: 'SHA-256', path: '/visualizer/hash', desc: 'Cryptographic hashing', graphic: <GenericGraphic color="#F4E9D4" /> },
    ]
  }
];

export default function VisualizerDashboard() {
  const [activeCategory, setActiveCategory] = useState('ds');

  const getArcStyles = (catId) => {
    // DS is active -> large red button in center left
    // Others are smaller greenish/beige buttons
    if (activeCategory === catId) {
      return "w-20 h-20 bg-[#BC4A54] rounded-full border-[6px] border-white dark:border-[#121212] flex items-center justify-center shadow-lg transform scale-110 z-10 transition-all duration-300 cursor-default";
    }
    return "w-12 h-12 bg-[#D3DFC8] dark:bg-[#2A3324] rounded-full border-[4px] border-white dark:border-[#121212] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#c1d1b4] hover:scale-105 transition-all duration-300 z-10 text-xs font-bold";
  };

  const getArcPosition = (catId) => {
    const isActive = activeCategory === catId;
    if (catId === 'crypto') return isActive ? 'top-[120px] -translate-y-1/2 left-[48px]' : 'top-[120px] -translate-y-1/2 left-[16px]';
    if (catId === 'ds') return isActive ? 'top-[300px] -translate-y-1/2 left-[48px]' : 'top-[300px] -translate-y-1/2 left-[36px]';
    if (catId === 'oop') return isActive ? 'top-[480px] -translate-y-1/2 left-[48px]' : 'top-[480px] -translate-y-1/2 left-[16px]';
    return '';
  };

  const getActiveArcPath = () => {
    if (activeCategory === 'crypto') return "M60,50 A 100,100 0 0,1 60,190";
    if (activeCategory === 'ds') return "M60,230 A 100,100 0 0,1 60,370";
    if (activeCategory === 'oop') return "M60,410 A 100,100 0 0,1 60,550";
    return "";
  };

  const getLabelPosition = (catId) => {
    if (activeCategory === catId) return "absolute -right-12 top-1/2 -translate-y-1/2 text-[#BC4A54] font-bold text-lg pointer-events-none";
    return "absolute -bottom-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase pointer-events-none";
  };

  const currentData = categories.find(c => c.id === activeCategory);

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FDFBF7] dark:bg-[#121212] relative overflow-hidden flex transition-colors duration-300">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[#BC4A54]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-[#D3DFC8]/30 rounded-full blur-[100px] pointer-events-none translate-y-1/4 translate-x-1/4"></div>

      {/* Mobile Category Navigation (Hidden on Desktop) */}
      <div className="md:hidden flex overflow-x-auto gap-2 p-4 w-full items-center justify-start sticky top-0 z-20 bg-[#FDFBF7]/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-[#EBE0D3] dark:border-[#333]">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-xs transition-colors shadow-sm border ${
              activeCategory === cat.id 
                ? 'bg-[#BC4A54] text-white border-[#BC4A54]' 
                : 'bg-white dark:bg-[#1A1A1A] text-gray-500 dark:text-gray-400 border-[#EBE0D3] dark:border-[#333]'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Left Arc Navigation (Hidden on Mobile) */}
      <div className="hidden md:flex w-64 h-[600px] fixed left-0 top-[40%] -translate-y-1/2 items-center">
        {/* SVG Arcs */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300" viewBox="0 0 256 600" fill="none">
          <path d="M10,50 A 1056,1056 0 0,1 10,550" className="stroke-[#EBE0D3] dark:stroke-[#333]" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M40,120 A 820,820 0 0,1 40,480" className="stroke-[#EBE0D3] dark:stroke-[#333]" strokeWidth="1" />
          {/* Active indicator arc */}
          <path d={getActiveArcPath()} stroke="#BC4A54" strokeWidth="4" className="transition-all duration-300" />
        </svg>

        {/* Nodes */}
        {categories.map((cat) => (
          <div key={cat.id} className={`absolute ${getArcPosition(cat.id)} flex flex-col items-center`}>
            <div 
              className={getArcStyles(cat.id)}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.id === 'ds' && activeCategory === 'ds' ? (
                <Database size={32} className="text-white" />
              ) : cat.icon}
            </div>
            <span className={getLabelPosition(cat.id)}>{cat.id.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 w-full md:ml-64 md:w-[calc(100%-16rem)] p-4 md:p-8 overflow-y-auto z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto w-full"
          >
            {currentData.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 md:p-5 shadow-sm border border-[#EBE0D3]/50 dark:border-[#333] hover:shadow-md transition-all duration-300 group flex flex-col h-full"
              >
                {/* Topic Header & Graphic */}
                <Link to={item.path} className="block group/head">
                  <div className="w-full h-24 md:h-28 mb-3 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#252525] flex items-center justify-center transform group-hover/head:scale-[1.02] transition-transform duration-300">
                    {item.graphic}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover/head:text-[#BC4A54] transition-colors">
                      {item.name}
                    </h3>
                    {item.totalCount && (
                      <span className="text-[10px] font-mono font-bold bg-[#BC4A54]/10 text-[#BC4A54] px-2 py-0.5 rounded-full border border-[#BC4A54]/20 shrink-0">
                        {item.totalCount} Algos
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.desc}
                  </p>
                </Link>

                {/* DISTINCT ALGORITHM CARDS INSIDE THE TOPIC CARD */}
                {item.algorithms && item.algorithms.length > 0 ? (
                  <div className="flex flex-col gap-1.5 pt-2 mb-2 border-t border-gray-100 dark:border-[#262626]">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <span>Algorithms Included</span>
                      <span className="text-[#BC4A54]">{item.totalCount} Cards</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {item.algorithms.slice(0, 4).map((algo) => (
                        <Link
                          key={algo.id}
                          to={item.path === '/visualizer/array' ? `${item.path}/${algo.id}` : `${item.path}?algo=${algo.id}`}
                          className="p-1.5 rounded-lg bg-gray-50 dark:bg-[#222] border border-gray-200/80 dark:border-[#333] hover:border-[#BC4A54] dark:hover:border-[#BC4A54] hover:bg-[#BC4A54]/5 transition-all flex flex-col justify-between gap-0.5 group/algo shadow-2xs"
                        >
                          <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate group-hover/algo:text-[#BC4A54]">
                            {algo.name}
                          </span>
                          <span className="text-[8px] font-mono font-semibold text-gray-400">
                            {algo.tag}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {item.totalCount > 4 && (
                      <Link
                        to={item.path}
                        className="text-[10px] font-bold text-[#BC4A54] hover:underline flex items-center justify-end gap-1 pt-1"
                      >
                        <span>+{item.totalCount - 4} more algorithm cards</span>
                        <ArrowRight size={11} />
                      </Link>
                    )}
                  </div>
                ) : null}

                {/* Bottom Action Footer */}
                <div className="flex justify-end mt-auto pt-2">
                  <Link 
                    to={item.path}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] flex items-center justify-center text-[#BC4A54] hover:bg-[#BC4A54] hover:text-white transition-colors duration-300 shadow-xs"
                  >
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
