import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function LinearQueueView({ items = [] }) {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-8">
      {/* Conveyor Runway Frame */}
      <div className="relative w-full bg-[#FAF7F2] dark:bg-[#331921] border-2 border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl p-8 shadow-2xl flex items-center justify-between overflow-x-auto min-h-[220px]">
        
        {/* Outflow Arch (Front / Dequeue) */}
        <div className="flex flex-col items-center gap-1 shrink-0 pr-4 border-r-2 border-dashed border-[#AB526B]/30">
          <span className="px-2.5 py-1 rounded-full bg-[#AB526B]/15 text-[#AB526B] dark:text-[#F0E2A4] font-mono font-black text-xs border border-[#AB526B]/30">
            FRONT
          </span>
          <span className="text-[9px] text-[#BCA297] uppercase tracking-wider font-bold">Dequeue Port</span>
          <ArrowLeft size={16} className="text-[#AB526B] animate-pulse" />
        </div>

        {/* Queue Element Track */}
        <div className="flex items-center gap-3.5 px-4 overflow-x-auto py-4">
          <AnimatePresence mode="popLayout">
            {items.map((val, idx) => {
              const isFront = idx === 0;
              const isRear = idx === items.length - 1;
              return (
                <motion.div
                  key={`${val}-${idx}`}
                  initial={{ scale: 0.3, y: -40, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.2, x: -60, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`relative w-20 h-24 rounded-2xl flex flex-col items-center justify-center font-mono font-black shadow-lg border-2 transition-all ${
                    isFront
                      ? 'bg-[#AB526B] border-[#F0E2A4] text-white shadow-[#AB526B]/40 scale-105'
                      : isRear
                      ? 'bg-[#5C4E49] border-[#C5CEAE] text-white'
                      : 'bg-white dark:bg-[#423834] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-900 dark:text-[#FAF7F2]'
                  }`}
                >
                  <span className="text-xl">{val}</span>
                  <span className={`text-[10px] ${isFront || isRear ? 'text-white/70' : 'text-[#BCA297]'}`}>
                    index [{idx}]
                  </span>

                  {isFront && (
                    <span className="absolute -top-7 text-[9px] font-mono font-bold text-white bg-[#AB526B] px-2 py-0.5 rounded-full shadow-sm">
                      HEAD
                    </span>
                  )}

                  {isRear && (
                    <span className="absolute -bottom-7 text-[9px] font-mono font-bold text-[#2D1F23] bg-[#C5CEAE] px-2 py-0.5 rounded-full shadow-sm">
                      TAIL
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="text-center py-6 text-gray-400 dark:text-[#BCA297] font-mono text-sm italic">
              Queue is completely empty. Enqueue elements to populate runway!
            </div>
          )}
        </div>

        {/* Inflow Arch (Rear / Enqueue) */}
        <div className="flex flex-col items-center gap-1 shrink-0 pl-4 border-l-2 border-dashed border-[#C5CEAE]/40">
          <span className="px-2.5 py-1 rounded-full bg-[#C5CEAE]/20 text-[#2D1F23] dark:text-[#C5CEAE] font-mono font-black text-xs border border-[#C5CEAE]/40">
            REAR
          </span>
          <span className="text-[9px] text-[#BCA297] uppercase tracking-wider font-bold">Enqueue Port</span>
          <ArrowRight size={16} className="text-[#C5CEAE] animate-pulse" />
        </div>
      </div>

      {/* Status Summary Bar */}
      <div className="flex items-center justify-center gap-6 text-xs font-mono">
        <span className="text-gray-600 dark:text-[#BCA297]">
          Front Pointer: <strong className="text-[#AB526B]">{items.length ? items[0] : 'None'}</strong>
        </span>
        <span className="text-gray-600 dark:text-[#BCA297]">
          Total Length: <strong className="text-[#F0E2A4]">{items.length}</strong>
        </span>
        <span className="text-gray-600 dark:text-[#BCA297]">
          Rear Pointer: <strong className="text-[#C5CEAE]">{items.length ? items[items.length - 1] : 'None'}</strong>
        </span>
      </div>
    </div>
  );
}
