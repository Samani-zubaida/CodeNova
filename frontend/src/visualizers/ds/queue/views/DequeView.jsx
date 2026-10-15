import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DequeView({ items = [20, 40, 60] }) {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      <div className="w-full bg-[#FAF7F2] dark:bg-[#331921] border-2 border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl p-6 shadow-2xl flex items-center justify-between min-h-[180px]">
        {/* Left Port */}
        <div className="flex flex-col items-center gap-1 border-r-2 border-dashed border-[#AB526B]/40 pr-4">
          <span className="text-xs font-mono font-bold text-[#AB526B]">FRONT PORT</span>
          <div className="flex gap-1">
            <span className="text-[10px] text-emerald-500 font-bold">Push</span>
            <span className="text-[10px] text-gray-400">/</span>
            <span className="text-[10px] text-rose-500 font-bold">Pop</span>
          </div>
        </div>

        {/* Center Deque Slot Deck */}
        <div className="flex items-center gap-3 overflow-x-auto px-4">
          <AnimatePresence mode="popLayout">
            {items.map((val, idx) => (
              <motion.div
                key={`${val}-${idx}`}
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 20 }}
                className="w-18 h-22 rounded-2xl bg-white dark:bg-[#423834] border-2 border-[#AB526B] text-gray-900 dark:text-white flex flex-col items-center justify-center font-mono font-black shadow-lg"
              >
                <span className="text-xl">{val}</span>
                <span className="text-[9px] text-[#BCA297]">[{idx}]</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Port */}
        <div className="flex flex-col items-center gap-1 border-l-2 border-dashed border-[#C5CEAE]/40 pl-4">
          <span className="text-xs font-mono font-bold text-[#C5CEAE]">REAR PORT</span>
          <div className="flex gap-1">
            <span className="text-[10px] text-emerald-500 font-bold">Push</span>
            <span className="text-[10px] text-gray-400">/</span>
            <span className="text-[10px] text-rose-500 font-bold">Pop</span>
          </div>
        </div>
      </div>
    </div>
  );
}
