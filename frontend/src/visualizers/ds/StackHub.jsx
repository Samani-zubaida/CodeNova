import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ArrowLeft, Layers } from 'lucide-react';

// ========================================================
// 10 CUSTOM PASTEL SVG GRAPHICS FOR STACK CONCEPTS
// ========================================================

const BasicStackGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(30, 20)">
      {/* Bucket Container */}
      <path d="M0 0 L0 58 Q0 60 2 60 L38 60 Q40 60 40 58 L40 0" stroke="#423834" strokeWidth="2" fill="none"/>
      {/* Stack Items */}
      <rect x="4" y="44" width="32" height="13" rx="3" fill="#D3DFC8" stroke="#423834" strokeWidth="1"/>
      <text x="20" y="53" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace" fontWeight="bold">15</text>
      <rect x="4" y="28" width="32" height="13" rx="3" fill="#E8D1CB" stroke="#423834" strokeWidth="1"/>
      <text x="20" y="37" fontSize="8" fill="#423834" textAnchor="middle" fontFamily="monospace" fontWeight="bold">30</text>
      <rect x="4" y="12" width="32" height="13" rx="3" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
      <text x="20" y="21" fontSize="8" fill="#FFF" textAnchor="middle" fontFamily="monospace" fontWeight="bold">45</text>
      {/* Top arrow */}
      <path d="M46 18 L54 18 M50 14 L54 18 L50 22" stroke="#AB526B" strokeWidth="1.5" fill="none"/>
      <text x="68" y="20" fontSize="7" fill="#AB526B" fontFamily="monospace" fontWeight="bold">TOP</text>
    </g>
    <text x="50" y="88" fontSize="7.5" fill="#423834" textAnchor="middle" fontFamily="monospace">LIFO: Last-In First-Out</text>
  </svg>
);

const BalancedParenGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(12, 28)">
      <rect x="0" y="0" width="76" height="24" rx="6" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="38" y="16" fontSize="13" fill="#423834" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
        {'{'} <tspan fill="#AB526B">[</tspan> ( ) <tspan fill="#AB526B">]</tspan> {'}'}
      </text>
    </g>
    <g transform="translate(24, 60)">
      <rect x="0" y="0" width="52" height="16" rx="4" fill="#AB526B"/>
      <text x="26" y="11" fontSize="8" fill="#FFF" textAnchor="middle" fontFamily="monospace" fontWeight="bold">✓ VALID MATCH</text>
    </g>
  </svg>
);

const PostfixGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(10, 24)">
      <rect x="0" y="0" width="80" height="18" rx="4" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="40" y="12" fontSize="8.5" fill="#423834" textAnchor="middle" fontFamily="monospace" fontWeight="bold">3 4 + 2 * ➔ 14</text>
    </g>
    <g transform="translate(25, 48)">
      <rect x="0" y="16" width="22" height="14" rx="3" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="11" y="26" fontSize="9" fill="#423834" textAnchor="middle" fontFamily="monospace">7</text>
      <rect x="28" y="16" width="22" height="14" rx="3" fill="#AB526B"/>
      <text x="39" y="26" fontSize="9" fill="#FFF" textAnchor="middle" fontFamily="monospace">2</text>
      <text x="25" y="10" fontSize="10" fill="#AB526B" textAnchor="middle" fontWeight="bold">*</text>
    </g>
    <text x="50" y="88" fontSize="7" fill="#423834" textAnchor="middle" fontFamily="monospace">Operand Evaluation</text>
  </svg>
);

const InfixToPostfixGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(8, 22)">
      <rect x="0" y="0" width="84" height="16" rx="4" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="42" y="11" fontSize="7.5" fill="#423834" textAnchor="middle" fontFamily="monospace">Infix: A + B * C</text>
    </g>
    <path d="M50 42 L50 50 M46 47 L50 51 L54 47" stroke="#AB526B" strokeWidth="1.5" fill="none"/>
    <g transform="translate(8, 54)">
      <rect x="0" y="0" width="84" height="16" rx="4" fill="#AB526B"/>
      <text x="42" y="11" fontSize="7.5" fill="#FFF" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Postfix: A B C * +</text>
    </g>
    <text x="50" y="86" fontSize="7" fill="#423834" textAnchor="middle" fontFamily="monospace">Shunting-Yard Parser</text>
  </svg>
);

const NextGreaterGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(10, 24)">
      <rect x="0" y="0" width="18" height="18" rx="3" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="9" y="12" fontSize="9" fill="#423834" textAnchor="middle" fontFamily="monospace">4</text>
      <rect x="21" y="0" width="18" height="18" rx="3" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="30" y="12" fontSize="9" fill="#423834" textAnchor="middle" fontFamily="monospace">5</text>
      <rect x="42" y="0" width="18" height="18" rx="3" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="51" y="12" fontSize="9" fill="#423834" textAnchor="middle" fontFamily="monospace">2</text>
      <rect x="63" y="0" width="18" height="18" rx="3" fill="#AB526B"/>
      <text x="72" y="12" fontSize="9" fill="#FFF" textAnchor="middle" fontFamily="monospace">25</text>
    </g>
    <path d="M19 46 Q45 60 72 46" stroke="#AB526B" strokeWidth="1.5" strokeDasharray="2 2" fill="none"/>
    <text x="50" y="80" fontSize="7.5" fill="#423834" textAnchor="middle" fontFamily="monospace">4 ➔ 5, 5 ➔ 25, 2 ➔ 25</text>
  </svg>
);

const MinStackGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(12, 20)">
      <rect x="0" y="0" width="34" height="48" rx="4" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="17" y="14" fontSize="7" fill="#888" textAnchor="middle" fontFamily="monospace">MAIN</text>
      <rect x="4" y="20" width="26" height="10" rx="2" fill="#D3DFC8"/>
      <text x="17" y="27" fontSize="7" fill="#423834" textAnchor="middle" fontFamily="monospace">2</text>
      <rect x="4" y="32" width="26" height="10" rx="2" fill="#D3DFC8"/>
      <text x="17" y="39" fontSize="7" fill="#423834" textAnchor="middle" fontFamily="monospace">5</text>

      <rect x="42" y="0" width="34" height="48" rx="4" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="59" y="14" fontSize="7" fill="#AB526B" textAnchor="middle" fontFamily="monospace" fontWeight="bold">MIN</text>
      <rect x="46" y="20" width="26" height="10" rx="2" fill="#AB526B"/>
      <text x="59" y="27" fontSize="7" fill="#FFF" textAnchor="middle" fontFamily="monospace" fontWeight="bold">2</text>
      <rect x="46" y="32" width="26" height="10" rx="2" fill="#AB526B"/>
      <text x="59" y="39" fontSize="7" fill="#FFF" textAnchor="middle" fontFamily="monospace" fontWeight="bold">5</text>
    </g>
    <text x="50" y="82" fontSize="7.5" fill="#423834" textAnchor="middle" fontFamily="monospace">getMin() in O(1) Time</text>
  </svg>
);

const DailyTempGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(15, 25)">
      <rect x="0" y="12" width="14" height="30" rx="3" fill="#D3DFC8" stroke="#423834" strokeWidth="1"/>
      <text x="7" y="24" fontSize="7" fill="#423834" textAnchor="middle" fontFamily="monospace">73°</text>
      <rect x="18" y="4" width="14" height="38" rx="3" fill="#AB526B"/>
      <text x="25" y="16" fontSize="7" fill="#FFF" textAnchor="middle" fontFamily="monospace">74°</text>
      <rect x="36" y="18" width="14" height="24" rx="3" fill="#D3DFC8" stroke="#423834" strokeWidth="1"/>
      <text x="43" y="30" fontSize="7" fill="#423834" textAnchor="middle" fontFamily="monospace">71°</text>
      <rect x="54" y="0" width="14" height="42" rx="3" fill="#AB526B"/>
      <text x="61" y="12" fontSize="7" fill="#FFF" textAnchor="middle" fontFamily="monospace">76°</text>
    </g>
    <text x="50" y="82" fontSize="7.5" fill="#423834" textAnchor="middle" fontFamily="monospace">Wait Days for Warmer Temp</text>
  </svg>
);

const HistogramGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <g transform="translate(16, 25)">
      <rect x="0" y="20" width="12" height="24" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <rect x="13" y="8" width="13" height="36" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
      <rect x="27" y="0" width="13" height="44" fill="#AB526B" stroke="#423834" strokeWidth="1"/>
      <rect x="41" y="14" width="12" height="30" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <rect x="54" y="24" width="12" height="20" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      {/* Max rectangle area highlight */}
      <rect x="13" y="8" width="27" height="36" fill="none" stroke="#FFF" strokeWidth="1.5" strokeDasharray="2 2"/>
    </g>
    <text x="50" y="84" fontSize="7" fill="#423834" textAnchor="middle" fontFamily="monospace">Max Area in O(n) Stack</text>
  </svg>
);

const StockSpanGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(14, 26)">
      <polyline points="0,32 18,18 36,24 54,10 72,16" stroke="#AB526B" strokeWidth="2" fill="none"/>
      <circle cx="18" cy="18" r="3" fill="#AB526B"/>
      <circle cx="54" cy="10" r="4" fill="#AB526B"/>
      <line x1="54" y1="10" x2="54" y2="40" stroke="#888" strokeWidth="1" strokeDasharray="2 2"/>
      <text x="54" y="48" fontSize="7" fill="#423834" textAnchor="middle" fontFamily="monospace">Span = 4</text>
    </g>
    <text x="50" y="86" fontSize="7" fill="#423834" textAnchor="middle" fontFamily="monospace">Consecutive Lower Prices</text>
  </svg>
);

const ValidParenWildcardGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <g transform="translate(14, 28)">
      <rect x="0" y="0" width="72" height="22" rx="4" fill="#FDFBF7" stroke="#423834" strokeWidth="1"/>
      <text x="36" y="15" fontSize="11" fill="#423834" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
        ( * ) ➔ <tspan fill="#AB526B">VALID</tspan>
      </text>
    </g>
    <text x="50" y="68" fontSize="7.5" fill="#423834" textAnchor="middle" fontFamily="monospace">* can be '(', ')', or ''</text>
    <text x="50" y="82" fontSize="7" fill="#888" textAnchor="middle" fontFamily="monospace">Greedy Bounds Tracking</text>
  </svg>
);

// ========================================================
// 10 STACK ALGORITHMS CATALOG LIST
// ========================================================

export const STACK_ALGORITHMS_CATALOG = [
  {
    id: 'basic',
    name: 'Basic LIFO Operations',
    category: 'Fundamentals',
    desc: 'Core push, pop, peek, and isEmpty operations on a contiguous array stack container.',
    tag: 'O(1) Core',
    graphic: <BasicStackGraphic />,
  },
  {
    id: 'parentheses',
    name: 'Balanced Parentheses',
    category: 'Syntax Parsing',
    desc: 'Validates matching opening and closing delimiter brackets (), {}, [] using a frame stack.',
    tag: 'O(n) Syntax',
    graphic: <BalancedParenGraphic />,
  },
  {
    id: 'postfix',
    name: 'RPN Postfix Evaluation',
    category: 'Math & Compilers',
    desc: 'Evaluates arithmetic in Reverse Polish Notation by collapsing operands on operator discovery.',
    tag: 'O(n) Math',
    graphic: <PostfixGraphic />,
  },
  {
    id: 'infixToPostfix',
    name: 'Infix to Postfix (Shunting-Yard)',
    category: 'Math & Compilers',
    desc: 'Dijkstra Shunting-Yard algorithm parsing operator precedence into postfix order.',
    tag: 'O(n) Parser',
    graphic: <InfixToPostfixGraphic />,
  },
  {
    id: 'nextGreater',
    name: 'Next Greater Element',
    category: 'Monotonic Stack',
    desc: 'Maintains a monotonic decreasing stack to resolve the next strictly greater value in O(n).',
    tag: 'O(n) Monotonic',
    graphic: <NextGreaterGraphic />,
  },
  {
    id: 'minStack',
    name: 'Min Stack (O(1) Min)',
    category: 'Data Structures',
    desc: 'Maintains an auxiliary minimum tracker alongside the primary stack for O(1) minimum lookups.',
    tag: 'O(1) Aux',
    graphic: <MinStackGraphic />,
  },
  {
    id: 'dailyTemp',
    name: 'Daily Temperatures',
    category: 'Monotonic Stack',
    desc: 'Finds number of days to wait until a warmer temperature using index-tracking stack.',
    tag: 'O(n) Monotonic',
    graphic: <DailyTempGraphic />,
  },
  {
    id: 'histogram',
    name: 'Largest Rectangle in Histogram',
    category: 'Advanced Monotonic',
    desc: 'Calculates maximum rectangular area under histogram bars using height-index stack bounds.',
    tag: 'O(n) Hard',
    graphic: <HistogramGraphic />,
  },
  {
    id: 'stockSpan',
    name: 'Online Stock Span',
    category: 'Applications',
    desc: 'Calculates the consecutive previous days where stock price was less than or equal to current.',
    tag: 'Amortized O(1)',
    graphic: <StockSpanGraphic />,
  },
  {
    id: 'validParenWildcard',
    name: 'Valid Parentheses with Wildcards',
    category: 'Syntax Parsing',
    desc: 'Tracks min/max open bracket bounds to validate bracket expressions containing * wildcards.',
    tag: 'O(n) Greedy',
    graphic: <ValidParenWildcardGraphic />,
  },
];

export default function StackHub() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = STACK_ALGORITHMS_CATALOG.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FDFBF7] dark:bg-[#331921] relative overflow-hidden flex flex-col transition-colors duration-300 pb-16">
      {/* Background Ambient Gradients */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#F4E9D4]/40 rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 z-10">
        {/* Top Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to="/oop"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-[#AB526B] dark:hover:text-[#F0E2A4] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search 10 stack algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#AB526B] shadow-xs text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Stack Algorithms & LIFO Structures Suite
            </h1>
            <span className="text-xs font-mono font-bold bg-[#AB526B]/10 text-[#AB526B] dark:text-[#F0E2A4] px-2.5 py-1 rounded-full border border-[#AB526B]/20">
              10 Cards
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Select any card below to launch its dedicated interactive visualizer with tactile push/pop animations, bracket matching, Shunting-yard expression parsing, and monotonic frame inspection.
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
                className="bg-white dark:bg-[#423834] rounded-2xl p-4 md:p-5 shadow-sm border border-[#EBE0D3]/50 dark:border-[#5C4E49] hover:shadow-md transition-all duration-300 group flex flex-col h-full cursor-pointer"
              >
                <Link to={`/visualizer/stack/${item.id}`} className="block group/head flex-1 flex flex-col">
                  {/* Graphic Thumbnail */}
                  <div className="w-full h-24 md:h-28 mb-3 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#5C4E49] flex items-center justify-center transform group-hover/head:scale-[1.02] transition-transform duration-300">
                    {item.graphic}
                  </div>

                  {/* Title & Tag */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover/head:text-[#AB526B] dark:group-hover/head:text-[#F0E2A4] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-[#AB526B]/10 text-[#AB526B] dark:text-[#F0E2A4] px-2 py-0.5 rounded-full border border-[#AB526B]/20 shrink-0">
                      {item.tag}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.desc}
                  </p>
                </Link>

                {/* Bottom Arrow Button */}
                <div className="flex justify-end mt-auto pt-2">
                  <Link
                    to={`/visualizer/stack/${item.id}`}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] flex items-center justify-center text-[#AB526B] dark:text-[#F0E2A4] group-hover:bg-[#AB526B] group-hover:text-white transition-colors duration-300 shadow-xs"
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
