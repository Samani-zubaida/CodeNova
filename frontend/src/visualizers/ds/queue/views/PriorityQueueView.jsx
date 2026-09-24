import React from 'react';
import { motion } from 'framer-motion';

export default function PriorityQueueView({
  items = [
    { id: 1, val: 95, priority: 1, label: 'P1 (Urgent)' },
    { id: 2, val: 50, priority: 2, label: 'P2 (Normal)' },
    { id: 3, val: 20, priority: 3, label: 'P3 (Low)' }
  ]
}) {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {items.map((item, idx) => {
          const isP1 = item.priority === 1;
          const isP2 = item.priority === 2;
          return (
            <motion.div
              key={item.id || idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-5 rounded-3xl border-2 font-mono flex flex-col items-center justify-center space-y-2 shadow-xl ${
                isP1
                  ? 'bg-[#AB526B] border-[#F0E2A4] text-white'
                  : isP2
                  ? 'bg-[#5C4E49] border-[#C5CEAE] text-white'
                  : 'bg-white dark:bg-[#423834] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-900 dark:text-[#FAF7F2]'
              }`}
            >
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-black/20">
                {item.label}
              </span>
              <span className="text-3xl font-black">{item.val}</span>
              <span className="text-xs opacity-75 font-bold">
                {idx === 0 ? '★ NEXT OUT' : `Queue Slot #${idx + 1}`}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
