import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SimpleQueueDiagram({ queue = [], activeVal }) {
  const items = queue.length > 0 
    ? queue.map(item => (typeof item === 'object' ? (item.node || item.val || JSON.stringify(item)) : item))
    : [];

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-slate-100/90 dark:bg-[#12131a]/90 border border-gray-300 dark:border-white/10 rounded-2xl shadow-xl w-full select-none">
      {/* Horizontal Tube Container */}
      <div className="w-full flex items-center justify-center gap-3 py-6">
        {/* Left Side: Exit Arrow (pointing left) and Exit text */}
        <div className="flex flex-col items-center gap-1">
          <svg width="44" height="20" viewBox="0 0 44 20" className="overflow-visible">
            <line x1="44" y1="10" x2="10" y2="10" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="14,4 0,10 14,16" fill="currentColor" className="text-slate-900 dark:text-white" />
          </svg>
          <span className="text-sm font-black text-slate-900 dark:text-white font-sans tracking-wide">
            Exit
          </span>
        </div>

        {/* The Queue Chamber: Top & Bottom Horizontal Walls with Open Ends */}
        <div className="relative min-w-[180px] max-w-[270px] h-12 border-t-[3px] border-b-[3px] border-slate-900 dark:border-white bg-slate-200/60 dark:bg-black/40 flex items-center justify-start overflow-x-auto px-0">
          <AnimatePresence initial={false}>
            {items.length === 0 ? (
              <div className="w-full text-center text-xs text-gray-500 font-mono italic">
                [ Empty ]
              </div>
            ) : (
              items.map((val, idx) => {
                const isFront = idx === 0;

                return (
                  <motion.div
                    key={`queue-block-${idx}-${val}`}
                    layout
                    initial={{ opacity: 0, x: 35, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -35, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className={`h-full min-w-[50px] px-3.5 border-r-2 last:border-r-0 border-slate-900 dark:border-white flex items-center justify-center font-mono text-base font-black transition-colors shrink-0 ${
                      isFront
                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white shadow-inner'
                        : 'bg-slate-200 dark:bg-gray-100 dark:bg-[#5C4E49] text-slate-900 dark:text-[#2D1F23] dark:text-[#F4EBC3]'
                    }`}
                  >
                    {val}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Entry text and Entry Arrow (pointing left into tube) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-black text-slate-900 dark:text-white font-sans tracking-wide">
            Entry
          </span>
          <svg width="44" height="20" viewBox="0 0 44 20" className="overflow-visible">
            <line x1="44" y1="10" x2="10" y2="10" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="14,4 0,10 14,16" fill="currentColor" className="text-slate-900 dark:text-white" />
          </svg>
        </div>
      </div>

      {/* Caption Underneath */}
      <div className="text-center mt-3">
        <div className="text-base font-black text-slate-900 dark:text-white font-sans tracking-wide">
          Queues
        </div>
        <div className="text-sm font-bold text-slate-600 dark:text-gray-500 dark:text-[#BCA297] font-sans">
          (FIFO)
        </div>
      </div>
    </div>
  );
}
