import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TwoStacksQueueView({
  inStack = [10, 20, 30],
  outStack = []
}) {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      <div className="grid grid-cols-2 gap-8 w-full">
        {/* In-Stack Chamber */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#C5CEAE]">In-Stack (Push Intake)</span>
          <div className="w-full h-64 bg-[#FAF7F2] dark:bg-[#331921] border-2 border-[#EBE0D3] dark:border-[#5C4E49] rounded-b-3xl p-4 flex flex-col-reverse gap-2 shadow-inner">
            <AnimatePresence>
              {inStack.map((val, idx) => (
                <motion.div
                  key={`${val}-${idx}`}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  className="w-full py-2.5 rounded-xl bg-[#5C4E49] border border-[#C5CEAE] text-white font-mono font-black text-center text-sm shadow-md"
                >
                  {val}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Out-Stack Chamber */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#AB526B]">Out-Stack (Pop Outflow)</span>
          <div className="w-full h-64 bg-[#FAF7F2] dark:bg-[#331921] border-2 border-[#EBE0D3] dark:border-[#5C4E49] rounded-b-3xl p-4 flex flex-col-reverse gap-2 shadow-inner">
            <AnimatePresence>
              {outStack.map((val, idx) => (
                <motion.div
                  key={`${val}-${idx}`}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  className="w-full py-2.5 rounded-xl bg-[#AB526B] border border-[#F0E2A4] text-white font-mono font-black text-center text-sm shadow-md"
                >
                  {val}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
