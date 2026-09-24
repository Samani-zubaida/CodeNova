import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TreeDataStructureStage
 * Clean, textbook-style diagram placed BESIDE the tree:
 * - Stack (LIFO): Red beaker with Exit ↑, Entry ↓, light blue stacked blocks, Stack (LIFO) label.
 * - Queue (FIFO): Horizontal red rails with Exit ←, ← Entry, light blue inline blocks, Queues (FIFO) label.
 * - Traversal Array: Connected textbook array cells with index on top, visited node values inside.
 * - Live Operation on top: Animated banner showing the active tree operation with spring transitions.
 */
export default function TreeDataStructureStage({
  currentAlgo = {},
  activeStep = {},
  traversalOutput = []
}) {
  const algoId = currentAlgo.id || 'inorder';
  const isQueueMode = algoId === 'levelorder' || algoId === 'bfs' || (activeStep?.queue && activeStep.queue.length > 0);

  // Normalize stack items
  const rawStack = activeStep?.stack || [];
  const stackItems = rawStack.map(item => 
    typeof item === 'object' ? (item.val ?? item.node ?? JSON.stringify(item)) : item
  );

  // Normalize queue items
  const rawQueue = activeStep?.queue || [];
  const queueItems = rawQueue.map(item => 
    typeof item === 'object' ? (item.val ?? item.node ?? JSON.stringify(item)) : item
  );

  // Traversal sequence / result array
  const seq = activeStep?.traversalSeq || traversalOutput || [];
  const currentVal = activeStep?.activeNodeVal;

  return (
    <div className="flex flex-col items-center justify-center gap-5 p-3 select-none shrink-0 w-full lg:w-auto">
      
      {/* ======================================================== */}
      {/* 1. ANIMATION / LIVE OPERATION ON TOP                      */}
      {/* ======================================================== */}
      <AnimatePresence mode="wait">
        {activeStep?.explanation?.action && (
          <motion.div
            key={activeStep.explanation.action}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-[#EF4444]/40 shadow-xs max-w-[340px] text-center"
          >
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping shrink-0" />
            <span className="text-xs font-bold text-[#DC2626] dark:text-[#F87171] truncate">
              {activeStep.explanation.action}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. TEXTBOOK DATA STRUCTURE: STACK (LIFO) or QUEUE (FIFO) */}
      {/* ======================================================== */}
      {isQueueMode ? (
        /* -------------------------------------------------------- */
        /* QUEUES (FIFO) - FOR LEVEL-ORDER / BFS TRAVERSAL          */
        /* -------------------------------------------------------- */
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            {/* Exit Arrow on the Left */}
            <div className="flex items-center gap-1.5 text-[#DC2626] dark:text-[#F87171] shrink-0 font-bold text-sm">
              <span>Exit</span>
              <span className="text-xl leading-none">←</span>
            </div>

            {/* Horizontal Red Rails: Open on Left and Right */}
            <div className="relative min-w-[150px] max-w-[240px] h-12 border-t-2 border-b-2 border-[#DC2626] dark:border-[#F87171] flex items-center px-1 gap-1 overflow-x-auto bg-white/40 dark:bg-black/20 backdrop-blur-xs">
              {/* Vertical tick marks at rail ends */}
              <div className="absolute -top-1.5 -left-0.5 w-0.5 h-2 bg-[#DC2626] dark:bg-[#F87171]" />
              <div className="absolute -bottom-1.5 -left-0.5 w-0.5 h-2 bg-[#DC2626] dark:bg-[#F87171]" />
              <div className="absolute -top-1.5 -right-0.5 w-0.5 h-2 bg-[#DC2626] dark:bg-[#F87171]" />
              <div className="absolute -bottom-1.5 -right-0.5 w-0.5 h-2 bg-[#DC2626] dark:bg-[#F87171]" />

              {/* Queue Items inside rails */}
              <AnimatePresence mode="popLayout">
                {queueItems.length === 0 ? (
                  <div className="w-full text-center text-xs font-mono text-gray-400 italic">
                    [ Empty ]
                  </div>
                ) : (
                  queueItems.map((item, idx) => {
                    const isFront = idx === 0;
                    return (
                      <motion.div
                        key={`tree-queue-${item}-${idx}`}
                        layout
                        initial={{ x: 35, opacity: 0, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: -35, opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
                        className={`min-w-9 h-9 px-2 flex items-center justify-center rounded-sm font-bold font-sans text-base shrink-0 transition-colors ${
                          isFront
                            ? 'bg-[#BAE6FD] dark:bg-[#0369A1] border-2 border-[#DC2626] text-[#DC2626] dark:text-white shadow-xs'
                            : 'bg-[#E0F2FE] dark:bg-[#0c2a42] border border-[#DC2626]/80 text-[#1E293B] dark:text-[#F1F5F9]'
                        }`}
                      >
                        <span>{item}</span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Entry Arrow on the Right */}
            <div className="flex items-center gap-1.5 text-[#DC2626] dark:text-[#F87171] shrink-0 font-bold text-sm">
              <span className="text-xl leading-none">←</span>
              <span>Entry</span>
            </div>
          </div>

          {/* Label Below */}
          <div className="mt-2 text-sm font-black text-[#EA580C] dark:text-[#FB923C] tracking-wide text-center">
            Queues (FIFO)
          </div>
        </div>
      ) : (
        /* -------------------------------------------------------- */
        /* STACK (LIFO) - FOR INORDER, PREORDER, POSTORDER, DFS     */
        /* -------------------------------------------------------- */
        <div className="flex flex-col items-center">
          {/* Top Exit Indicator */}
          <div className="flex flex-col items-center mb-1 text-[#DC2626] dark:text-[#F87171]">
            <span className="text-sm font-bold tracking-tight">Exit</span>
            <span className="text-lg font-bold leading-none animate-bounce">↑</span>
          </div>

          {/* The Beaker Container with Entry Arrow on the Left */}
          <div className="relative flex items-center justify-center">
            {/* Entry Arrow on Left pointing down */}
            <div className="absolute -left-16 top-4 flex flex-col items-center text-[#DC2626] dark:text-[#F87171]">
              <span className="text-sm font-bold tracking-tight">Entry</span>
              <span className="text-xl font-bold leading-none">↓</span>
            </div>

            {/* Red U-Shaped Beaker: Open on top, left + bottom + right walls */}
            <div className="relative w-28 min-h-[160px] border-b-2 border-l-2 border-r-2 border-[#DC2626] dark:border-[#F87171] flex flex-col-reverse justify-start items-center p-1 gap-1 bg-white/40 dark:bg-black/20 backdrop-blur-xs">
              {/* Outward flanges at beaker opening */}
              <div className="absolute -top-1.5 -left-1 w-2 h-0.5 bg-[#DC2626] dark:bg-[#F87171]" />
              <div className="absolute -top-1.5 -right-1 w-2 h-0.5 bg-[#DC2626] dark:bg-[#F87171]" />

              {/* Stack items (bottom element at bottom, top element at top) */}
              <AnimatePresence mode="popLayout">
                {stackItems.length === 0 ? (
                  <div className="my-auto text-xs font-mono text-gray-400 italic">
                    [ Empty ]
                  </div>
                ) : (
                  stackItems.map((item, idx) => {
                    const isTop = idx === stackItems.length - 1;
                    return (
                      <motion.div
                        key={`tree-stack-${item}-${idx}`}
                        layout
                        initial={{ y: -35, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -35, opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 280 }}
                        className={`w-full h-8 flex items-center justify-center rounded-sm font-bold font-sans text-sm transition-colors ${
                          isTop
                            ? 'bg-[#BAE6FD] dark:bg-[#0369A1] border-2 border-[#DC2626] text-[#DC2626] dark:text-white shadow-xs'
                            : 'bg-[#E0F2FE] dark:bg-[#0c2a42] border border-[#DC2626]/80 text-[#1E293B] dark:text-[#F1F5F9]'
                        }`}
                      >
                        <span>{item}</span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Label Below */}
          <div className="mt-2 text-sm font-black text-[#EA580C] dark:text-[#FB923C] tracking-wide">
            Stack (LIFO)
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TRAVERSAL SEQUENCE / RESULT ARRAY                     */}
      {/* ======================================================== */}
      <div className="flex flex-col items-center max-w-[340px]">
        <div className="flex border border-[#DC2626] dark:border-[#F87171] rounded overflow-x-auto max-w-full shadow-xs">
          {seq.length === 0 ? (
            <div className="px-4 py-2 font-mono text-xs text-gray-400 italic bg-white dark:bg-[#151621]">
              [ None visited yet ]
            </div>
          ) : (
            seq.map((val, idx) => {
              const isCurrent = currentVal === val;
              return (
                <div
                  key={`tree-seq-${val}-${idx}`}
                  className="flex flex-col border-r border-[#DC2626]/40 dark:border-[#F87171]/40 last:border-r-0 shrink-0"
                >
                  {/* Step Index Label */}
                  <div className="px-2 py-0.5 bg-gray-100 dark:bg-black/40 text-[9px] font-mono font-bold text-gray-600 dark:text-gray-300 text-center border-b border-[#DC2626]/30">
                    [{idx}]
                  </div>
                  {/* Visited Value */}
                  <div
                    className={`w-9 h-8 flex items-center justify-center font-mono font-black text-xs transition-colors ${
                      isCurrent
                        ? 'bg-amber-400 text-black font-extrabold animate-pulse'
                        : 'bg-[#E0F2FE] dark:bg-[#0c2a42] text-[#DC2626] dark:text-[#38BDF8]'
                    }`}
                  >
                    {val}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <span className="mt-1 text-xs font-bold text-[#EA580C] dark:text-[#FB923C]">
          Traversal Output Array
        </span>
      </div>

    </div>
  );
}
