import React from 'react';
import { motion } from 'framer-motion';

export default function SortingBarsView({
  array = [],
  swappingIndices = [],
  highlightedIndices = [],
  sortedIndices = new Set(),
  pointers = {},
  eliminatedRange = null,
  maxSortingVal = 100,
  currentAlgo = { id: 'bubblesort' },
  searchTarget,
  targetSum
}) {
  return (
    <div className="w-full max-w-5xl bg-white/80 dark:bg-[#423834]/90 rounded-3xl border border-[#EBE0D3]/60 dark:border-[#5C4E49]/60 p-6 sm:p-8 shadow-lg flex flex-col items-center backdrop-blur-sm">
      {/* 1. INSTANT INTUITION FLOATING COMPARISON / CONDITION BRIDGE */}
      {(() => {
        // Check if currently swapping or comparing 2 elements
        const activePair = swappingIndices.length >= 2 
          ? swappingIndices 
          : (highlightedIndices.length >= 2 ? highlightedIndices : []);

        if (activePair.length >= 2) {
          const idxA = Math.min(activePair[0], activePair[1]);
          const idxB = Math.max(activePair[0], activePair[1]);
          const valA = array[idxA];
          const valB = array[idxB];
          const isSwappingNow = swappingIndices.includes(idxA) && swappingIndices.includes(idxB);
          const needsSwap = valA > valB; // Ascending sort condition

          return (
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: -6 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className={`mb-6 px-5 py-2.5 rounded-2xl border-2 shadow-md flex items-center gap-3 font-mono font-bold text-xs ${
                isSwappingNow
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300'
                  : needsSwap
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-700 dark:text-amber-300'
                  : 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">[{idxA}]</span>
                <span className="text-base font-black">{valA}</span>
              </div>

              <div className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-black/30 text-[11px] font-black uppercase tracking-wider">
                {isSwappingNow 
                  ? '⇄ SWAPPING' 
                  : needsSwap 
                  ? `${valA} > ${valB} ➔ SWAP` 
                  : `${valA} ≤ ${valB} ➔ IN ORDER`}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base font-black">{valB}</span>
                <span className="text-[10px] text-gray-500">[{idxB}]</span>
              </div>
            </motion.div>
          );
        }

        // Binary Search & Two-Pointer Target HUD
        if (currentAlgo.id === 'binary_search' || currentAlgo.id === 'two_sum') {
          const target = searchTarget !== undefined ? searchTarget : targetSum;
          const midIdx = pointers.mid;
          const midVal = midIdx !== undefined ? array[midIdx] : undefined;
          const isFound = midVal == target;

          return (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`mb-6 px-4 py-2 rounded-2xl border-2 font-mono text-xs font-bold flex items-center gap-3 shadow-xs ${
                isFound
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
              }`}
            >
              <span>Target: <strong className="text-sm font-black">{target}</strong></span>
              <span>•</span>
              <span>Mid Value: <strong className="text-sm font-black">{midVal !== undefined ? midVal : '—'}</strong></span>
              {midVal !== undefined && (
                <>
                  <span>•</span>
                  <span className="font-black">
                    {midVal == target ? '🎯 TARGET MATCH!' : midVal < target ? 'Mid < Target (Go Right)' : 'Mid > Target (Go Left)'}
                  </span>
                </>
              )}
            </motion.div>
          );
        }

        // Quick Sort Pivot Banner
        if (currentAlgo.id === 'quicksort' && pointers.pivot !== undefined) {
          const pVal = array[pointers.pivot];
          return (
            <div className="mb-6 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-400 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Pivot Element: <strong>{pVal}</strong> at index [{pointers.pivot}]</span>
            </div>
          );
        }

        return null;
      })()}

      {/* 2. BAR CHART CANVAS WITH ENHANCED CINEMATIC HEIGHTS & GRADIENTS */}
      <div className="relative flex items-end justify-center gap-3 sm:gap-4 md:gap-5 w-full min-h-[360px] pb-10 pt-8 px-4 overflow-x-auto">
        {array.map((val, idx) => {
          const isHighlighted = highlightedIndices.includes(idx);
          const isSwapping = swappingIndices.includes(idx);
          const isSorted = sortedIndices.has(idx);
          const isEliminated = eliminatedRange && (idx >= eliminatedRange.start && idx <= eliminatedRange.end);
          const isMid = pointers.mid === idx;
          const isPivot = pointers.pivot === idx;

          // Scaled bar height (up to 280px tall)
          const barHeight = Math.max(42, (Math.abs(val) / maxSortingVal) * 280);

          // Matching pointers for this column
          const matchingPointers = Object.entries(pointers)
            .filter(([_, pos]) => pos === idx)
            .map(([p]) => p.toUpperCase());

          return (
            <div
              key={`bar-col-${idx}`}
              className="relative flex flex-col items-center justify-end flex-1 max-w-[72px] min-w-[36px] transition-all group"
            >
              {/* Floating Pointer Badges with Bounce Indicator */}
              <div className="absolute -top-10 flex flex-col items-center pointer-events-none z-20 gap-0.5">
                {matchingPointers.map((p) => (
                  <motion.div
                    key={p}
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`px-2 py-0.5 rounded-md font-mono font-black text-[10px] shadow-md border ${
                      p === 'MID' || p === 'PIVOT'
                        ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-300/50'
                        : p === 'LOW' || p === 'L' || p === 'LEFT'
                        ? 'bg-cyan-600 text-white border-cyan-400'
                        : p === 'HIGH' || p === 'R' || p === 'RIGHT'
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-[#AB526B] text-white border-[#F0E2A4]'
                    }`}
                  >
                    {p}
                  </motion.div>
                ))}
              </div>

              {/* The Cinematic Animated Bar */}
              <motion.div
                layout
                initial={{ height: 0 }}
                animate={{ height: `${barHeight}px` }}
                transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                style={{
                  background: isSwapping
                    ? 'linear-gradient(180deg, #f87171 0%, #ef4444 50%, #b91c1c 100%)'
                    : isHighlighted
                    ? 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
                    : isSorted
                    ? 'linear-gradient(180deg, #34d399 0%, #10b981 50%, #047857 100%)'
                    : isMid || isPivot
                    ? 'linear-gradient(180deg, #818cf8 0%, #6366f1 50%, #4338ca 100%)'
                    : isEliminated
                    ? 'linear-gradient(180deg, #9ca3af 0%, #6b7280 100%)'
                    : 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                  boxShadow: isSwapping
                    ? '0 0 24px rgba(239, 68, 68, 0.55)'
                    : isHighlighted
                    ? '0 0 24px rgba(245, 158, 11, 0.55)'
                    : isSorted
                    ? '0 0 20px rgba(16, 185, 129, 0.45)'
                    : isMid || isPivot
                    ? '0 0 22px rgba(99, 102, 241, 0.5)'
                    : '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
                className={`w-full rounded-2xl flex flex-col items-center justify-between py-2 transition-colors relative border-2 ${
                  isSwapping
                    ? 'border-red-300 ring-4 ring-red-400/30'
                    : isHighlighted
                    ? 'border-amber-200 ring-4 ring-amber-400/30'
                    : isSorted
                    ? 'border-emerald-300 ring-2 ring-emerald-400/20'
                    : isMid || isPivot
                    ? 'border-indigo-200 ring-4 ring-indigo-400/30'
                    : isEliminated
                    ? 'border-dashed border-red-300 dark:border-red-700 opacity-30 grayscale'
                    : 'border-blue-400/40 hover:border-blue-300'
                }`}
              >
                {/* Value displayed at top of bar */}
                <span className="font-mono font-black text-sm sm:text-base text-white drop-shadow-md">
                  {val}
                </span>

                {/* Subtle sheen highlight bar */}
                <div className="w-2/3 h-1 rounded-full bg-white/30" />
              </motion.div>

              {/* Sub-label for index */}
              <div className="absolute -bottom-7 flex flex-col items-center">
                <span className={`text-[11px] font-mono font-bold ${
                  isSwapping ? 'text-red-500 font-black' : isHighlighted ? 'text-amber-500 font-black' : 'text-gray-400'
                }`}>
                  [{idx}]
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Sorting & Search Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-mono font-semibold pt-6 border-t border-gray-100 dark:border-[#5C4E49] w-full">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md" style={{ background: 'linear-gradient(180deg, #60a5fa, #2563eb)' }} />
          <span className="text-gray-600 dark:text-gray-400">Default Array</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md" style={{ background: 'linear-gradient(180deg, #fcd34d, #d97706)' }} />
          <span className="text-gray-600 dark:text-gray-400">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md" style={{ background: 'linear-gradient(180deg, #fca5a5, #dc2626)' }} />
          <span className="text-gray-600 dark:text-gray-400">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md" style={{ background: 'linear-gradient(180deg, #6ee7b7, #059669)' }} />
          <span className="text-gray-600 dark:text-gray-400">Sorted ✓</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md" style={{ background: 'linear-gradient(180deg, #a5b4fc, #4f46e5)' }} />
          <span className="text-gray-600 dark:text-gray-400">Mid / Pivot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md bg-gray-300 dark:bg-gray-700 border border-dashed border-red-400" />
          <span className="text-gray-600 dark:text-gray-400">Eliminated</span>
        </div>
      </div>
    </div>
  );
}
