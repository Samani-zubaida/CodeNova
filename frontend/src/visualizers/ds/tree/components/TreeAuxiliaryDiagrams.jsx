import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, GitFork } from 'lucide-react';

function SimpleStackDiagram({ stack = [], activeVal = null }) {
  const items = stack.length > 0 ? stack : [{ val: 'empty', label: 'Stack is Empty' }];

  return (
    <div className="flex flex-col gap-2 p-3 bg-white dark:bg-[#331921] rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase text-[#AB526B] dark:text-[#F0E2A4] flex items-center gap-1">
          <Layers size={13} />
          Call Stack (LIFO)
        </span>
        <span className="text-[10px] font-mono text-gray-400">
          Depth: {stack.length}
        </span>
      </div>

      <div className="flex flex-col-reverse gap-1.5 min-h-[140px] max-h-[220px] overflow-y-auto p-2 bg-gray-50 dark:bg-[#423834] rounded-xl border border-dashed border-[#EBE0D3] dark:border-[#5C4E49]">
        {items.map((item, idx) => {
          const isTop = idx === items.length - 1 && stack.length > 0;
          const isActive = item.val === activeVal;
          return (
            <motion.div
              key={`stack-${idx}-${item.val}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between border transition-all ${
                isTop
                  ? 'bg-[#AB526B]/20 border-[#AB526B] text-[#AB526B] dark:text-[#F0E2A4] font-bold shadow-sm'
                  : isActive
                  ? 'bg-[#F0E2A4]/20 border-[#F0E2A4] text-amber-700 dark:text-[#F0E2A4]'
                  : 'bg-white dark:bg-[#331921] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-700 dark:text-[#F4EBC3]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">#{idx + 1}</span>
                <span>{item.label || `dfs(${item.val})`}</span>
              </div>
              {isTop && (
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#AB526B] text-white font-black">
                  TOP
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Simple Queue Diagram for BFS Chamber
function SimpleQueueDiagram({ queue = [], activeVal = null }) {
  const items = queue.length > 0 ? queue : [{ val: 'empty', label: 'Queue is Empty' }];

  return (
    <div className="flex flex-col gap-2 p-3 bg-white dark:bg-[#331921] rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase text-[#C5CEAE] flex items-center gap-1">
          <GitFork size={13} />
          BFS Queue (FIFO)
        </span>
        <span className="text-[10px] font-mono text-gray-400">
          Size: {queue.length}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 min-h-[90px] max-h-[160px] overflow-y-auto p-2 bg-gray-50 dark:bg-[#423834] rounded-xl border border-dashed border-[#EBE0D3] dark:border-[#5C4E49]">
        {items.map((item, idx) => {
          const isFront = idx === 0 && queue.length > 0;
          return (
            <motion.div
              key={`queue-${idx}-${item.val}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                isFront
                  ? 'bg-[#C5CEAE]/25 border-[#C5CEAE] text-[#2D1F23] dark:text-[#C5CEAE] font-bold shadow-sm'
                  : 'bg-white dark:bg-[#331921] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-700 dark:text-[#F4EBC3]'
              }`}
            >
              {isFront && (
                <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded bg-[#C5CEAE] text-[#2D1F23] font-black">
                  FRONT
                </span>
              )}
              <span>{item.label || item.val}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// MAIN TREE VISUALIZER COMPONENT
// =========================================================================

export { SimpleStackDiagram, SimpleQueueDiagram };
