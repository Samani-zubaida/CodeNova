import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

export default function MergeSortView({
  array = [],
  activeRange = null,
  sortedIndices = new Set(),
  activeDivideState = null,
  activeMergeState = null
}) {
  return (
    <div className="w-full max-w-3xl bg-white dark:bg-[#423834] rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] p-4 sm:p-5 shadow-sm flex flex-col gap-4">
      {/* 1. Global Array State with Active Range Frame */}
      <div className="flex flex-col gap-1.5 pb-3 border-b border-gray-100 dark:border-[#222]">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={13} className="text-[#AB526B]" />
            <span>Main Array State [0...{array.length - 1}]</span>
          </span>
          <span className="font-mono text-[#AB526B] bg-[#AB526B]/10 dark:bg-[#AB526B]/20 px-2 py-0.5 rounded-full text-[10px]">
            {activeRange ? `Active Range: [${activeRange.l}...${activeRange.r}]` : 'Divide & Conquer Root'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-2">
          {array.map((val, idx) => {
            const inRange = activeRange ? (idx >= activeRange.l && idx <= activeRange.r) : true;
            const isMid = activeRange && idx === activeRange.m;
            const isLeft = activeRange && idx >= activeRange.l && idx <= activeRange.m;
            const isRight = activeRange && idx > activeRange.m && idx <= activeRange.r;
            const isSorted = sortedIndices.has(idx);

            return (
              <motion.div
                key={`ms-global-${idx}`}
                className={`relative flex flex-col items-center justify-end rounded-xl p-2 transition-all flex-1 max-w-[52px] min-w-[34px] ${
                  !inRange 
                    ? 'opacity-30 grayscale' 
                    : isSorted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-700'
                    : isLeft
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 border-2 border-cyan-400'
                    : isRight
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-400'
                    : 'bg-gray-50 dark:bg-[#1E1E1E] border border-gray-300 dark:border-[#5C4E49]'
                }`}
              >
                {/* Pointer Tag */}
                <div className="absolute -top-5 text-[9px] font-mono font-black uppercase text-[#AB526B]">
                  {activeRange?.l === idx && 'L'}
                  {activeRange?.m === idx && ' M'}
                  {activeRange?.r === idx && ' R'}
                </div>

                <span className={`font-mono font-bold text-sm ${isSorted ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-gray-900 dark:text-gray-100'}`}>
                  {val}
                </span>
                <span className="text-[9px] font-mono text-gray-400">[{idx}]</span>
                {isSorted && (
                  <span className="absolute -top-2 -right-1 text-[10px]">✓</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Divide Tree Level Visualizer */}
      {activeDivideState ? (
        <div className="p-3 bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/40 rounded-xl flex flex-col gap-2">
          {(() => {
            const leftArr = activeDivideState.left || activeDivideState.leftPart || (activeDivideState.val !== undefined ? [activeDivideState.val] : []);
            const rightArr = activeDivideState.right || activeDivideState.rightPart || [];
            const isBase = activeDivideState.val !== undefined && rightArr.length === 0;

            return (
              <>
                <div className="flex items-center justify-between text-xs font-bold text-cyan-900 dark:text-cyan-200">
                  <span className="flex items-center gap-1.5 font-mono">
                    <span>✂️ Divide Phase:</span>
                    {activeDivideState.range && (
                      <span className="text-[11px] font-mono bg-cyan-100 dark:bg-cyan-900/60 px-1.5 py-0.2 rounded">
                        Range: {activeDivideState.range}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                    Depth Lvl {activeDivideState.depth !== undefined ? activeDivideState.depth : 1}
                  </span>
                </div>

                {isBase ? (
                  <div className="flex items-center justify-center p-3 bg-white dark:bg-[#1E1E1E] rounded-lg border border-cyan-300 dark:border-cyan-700/60 text-xs font-mono font-bold text-cyan-800 dark:text-cyan-300">
                    ✓ Base Element: [{activeDivideState.val}] at index [{activeDivideState.l}] (Size 1 — Inherently Sorted)
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Left Subarray Halve */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white dark:bg-[#1E1E1E] border border-cyan-200 dark:border-cyan-800">
                      <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase">
                        Left Half [{activeDivideState.l}...{activeDivideState.m}]
                      </span>
                      <div className="flex items-center gap-1">
                        {leftArr.map((v, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-cyan-100 dark:bg-cyan-900/50 text-cyan-900 dark:text-cyan-200 font-mono font-bold text-xs">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Subarray Halve */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white dark:bg-[#1E1E1E] border border-purple-200 dark:border-purple-800">
                      <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 uppercase">
                        Right Half [{activeDivideState.m + 1}...{activeDivideState.r}]
                      </span>
                      <div className="flex items-center gap-1">
                        {rightArr.map((v, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200 font-mono font-bold text-xs">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      ) : activeMergeState ? (
        /* 3. Conquer / Two-Way Merge Stage Visualizer */
        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl flex flex-col gap-2.5">
          {(() => {
            const leftSub = activeMergeState.leftSub || [];
            const rightSub = activeMergeState.rightSub || [];
            const mergedArr = activeMergeState.merged || activeMergeState.mergedBuffer || [];

            return (
              <>
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-1.5 font-mono">
                    <span>⚡ Two-Way Merge In Progress:</span>
                    <span className="text-[11px] font-mono bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.2 rounded">
                      Comparing Left[{activeMergeState.p1 ?? 'done'}] vs Right[{activeMergeState.p2 ?? 'done'}]
                    </span>
                  </span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold">
                    Comparing Elements
                  </span>
                </div>

                {/* Dual Sub-arrays Source Feed */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Left Feed */}
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white dark:bg-[#1E1E1E] border border-amber-200 dark:border-amber-800/50">
                    <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300">Left Buffer:</span>
                    <div className="flex items-center gap-1">
                      {leftSub.map((v, i) => {
                        const isPointer = activeMergeState.p1 === i || activeMergeState.activeI === i;
                        return (
                          <div key={i} className="flex flex-col items-center">
                            <span className={`px-2 py-1 rounded font-mono font-bold text-xs ${
                              isPointer 
                                ? 'bg-amber-500 text-white ring-2 ring-amber-300 scale-105' 
                                : 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-900 dark:text-cyan-200'
                            }`}>
                              {v}
                            </span>
                            {isPointer && <span className="text-[8px] font-mono font-bold text-amber-600">p1</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Feed */}
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white dark:bg-[#1E1E1E] border border-amber-200 dark:border-amber-800/50">
                    <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300">Right Buffer:</span>
                    <div className="flex items-center gap-1">
                      {rightSub.map((v, i) => {
                        const isPointer = activeMergeState.p2 === i || activeMergeState.activeJ === i;
                        return (
                          <div key={i} className="flex flex-col items-center">
                            <span className={`px-2 py-1 rounded font-mono font-bold text-xs ${
                              isPointer 
                                ? 'bg-amber-500 text-white ring-2 ring-amber-300 scale-105' 
                                : 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200'
                            }`}>
                              {v}
                            </span>
                            {isPointer && <span className="text-[8px] font-mono font-bold text-amber-600">p2</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Target Merged Destination Runway */}
                <div className="flex flex-col gap-1 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                    Sorted Merged Stream:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {mergedArr.length === 0 ? (
                      <span className="text-[11px] font-mono text-gray-400 italic">Awaiting winner...</span>
                    ) : (
                      mergedArr.map((v, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0.5, y: -4 }}
                          animate={{ scale: 1, y: 0 }}
                          className="px-2.5 py-1 rounded bg-emerald-500 text-white font-mono font-black text-xs shadow-xs"
                        >
                          {v}
                        </motion.span>
                      ))
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        <div className="p-3 text-center text-xs font-mono text-gray-400 border border-dashed border-gray-200 dark:border-[#5C4E49] rounded-xl">
          Merge sort divide & conquer ready. Press Simulate to observe split and two-way merge.
        </div>
      )}

      {/* Merge Sort Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] font-mono pt-1 text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400" />
          <span>Left Branch</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-purple-400" />
          <span>Right Branch</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
          <span>Comparing Pointers</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
          <span>Merged & Sorted</span>
        </div>
      </div>
    </div>
  );
}
