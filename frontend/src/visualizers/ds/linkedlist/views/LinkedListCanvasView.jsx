import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Repeat, Check, CheckCircle, Zap, Split, RefreshCw, Layers, GitMerge, Award
} from 'lucide-react';

export default function LinkedListCanvasView({
  currentAlgoId,
  step = {},
  currentStepIdx = 0,
  steps = [],
  nodeList = [],
  mergeList1 = [],
  mergeList2 = [],
  intersectA = [],
  intersectB = [],
  intersectCommon = [],
  lruCache = [],
  hasCycle = false,
  cycleIndex = -1,
  nthParam = 1
}) {
  // ZERO-TEXT FLOATING VARIABLE HUD (Directly on Visualization)
  // ========================================================
  const renderVariableHUD = () => {
    const activeNodes = step.nodes || nodeList;
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#423834]/90 border border-[#EBE0D3] dark:border-[#5C4E49]/80 shadow-2xl backdrop-blur-md text-xs font-mono">
        {/* Step Indicator */}
        <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-[#5C4E49] text-gray-500 dark:text-[#BCA297] font-bold border border-[#EBE0D3] dark:border-[#5C4E49]/50">
          Step {currentStepIdx + 1}/{Math.max(1, steps.length)}
        </span>

        {currentAlgoId === 'reverse' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
              prev: {step.prevIdx >= 0 && step.prevIdx < activeNodes.length ? activeNodes[step.prevIdx].val : 'NULL'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
              curr: {step.currIdx >= 0 && step.currIdx < activeNodes.length ? activeNodes[step.currIdx].val : 'NULL'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
              next: {step.nextIdx >= 0 && step.nextIdx < activeNodes.length ? activeNodes[step.nextIdx].val : 'NULL'}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
              flipped: {step.reversedLinks ? step.reversedLinks.length : 0}/{activeNodes.length}
            </span>
          </>
        )}

        {(currentAlgoId === 'middle_node' || currentAlgoId === 'middle') && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-400/30">
              slow (1x): {step.slow !== undefined && step.slow < activeNodes.length ? activeNodes[step.slow]?.val : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 font-bold border border-fuchsia-400/30">
              fast (2x): {step.fast !== undefined && step.fast < activeNodes.length ? activeNodes[step.fast]?.val : 'END'}
            </span>
            {step.foundMiddle && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/25 text-emerald-300 font-extrabold border border-emerald-400">
                MID: {activeNodes[step.slow]?.val}
              </span>
            )}
          </>
        )}

        {currentAlgoId === 'floyd_cycle' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-400/30">
              slow: {step.slow !== undefined && step.slow < activeNodes.length ? activeNodes[step.slow]?.val : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
              fast: {step.fast !== undefined && step.fast < activeNodes.length ? activeNodes[step.fast]?.val : '-'}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
              phase: {step.phase || 1}
            </span>
            {step.collision && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-500/30 text-rose-300 font-black border border-rose-400 animate-bounce">
                💥 COLLISION
              </span>
            )}
            {step.cycleFound && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/30 text-emerald-300 font-black border border-emerald-400">
                ENTRY: Node {step.cycleEntry}
              </span>
            )}
          </>
        )}

        {currentAlgoId === 'remove_nth' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
              N: {step.safeN || nthParam}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-400/30">
              slow: {step.slow !== undefined && step.slow >= 0 && step.slow < activeNodes.length ? activeNodes[step.slow]?.val : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 font-bold border border-fuchsia-400/30">
              fast: {step.fast !== undefined && step.fast < activeNodes.length ? activeNodes[step.fast]?.val : 'END'}
            </span>
            {step.targetIdx !== undefined && (
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/25 text-rose-300 font-extrabold border border-rose-400">
                TARGET: {activeNodes[step.targetIdx]?.val}
              </span>
            )}
          </>
        )}

        {currentAlgoId === 'palindrome' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
              left: {step.p1 !== undefined && step.p1 < activeNodes.length ? activeNodes[step.p1]?.val : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
              right: {step.p2 !== undefined && step.p2 < activeNodes.length ? activeNodes[step.p2]?.val : '-'}
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg font-bold border ${
              step.failed ? 'bg-rose-500/25 text-rose-300 border-rose-400' :
              step.success ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400' :
              'bg-gray-100 dark:bg-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4] border-[#EBE0D3] dark:border-[#5C4E49]'
            }`}>
              {step.failed ? '✗ NOT PALINDROME' : step.success ? '✓ PALINDROME' : 'CHECKING...'}
            </span>
          </>
        )}

        {currentAlgoId === 'merge_sorted' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
              p1: {step.p1 !== undefined && step.p1 < (step.list1?.length || 0) ? step.list1[step.p1] : 'EOF'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
              p2: {step.p2 !== undefined && step.p2 < (step.list2?.length || 0) ? step.list2[step.p2] : 'EOF'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
              merged: {step.merged ? step.merged.length : 0}
            </span>
          </>
        )}

        {currentAlgoId === 'intersection' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
              pA: {step.idxA !== undefined ? (step.fullA?.[step.idxA] || '-') : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
              pB: {step.idxB !== undefined ? (step.fullB?.[step.idxB] || '-') : '-'}
            </span>
            {step.isIntersect && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/25 text-emerald-300 font-extrabold border border-emerald-400">
                INTERSECT!
              </span>
            )}
          </>
        )}

        {(currentAlgoId === 'singly' || currentAlgoId === 'doubly' || currentAlgoId === 'circular' || currentAlgoId === 'delete_val') && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
              curr: {step.currIdx >= 0 && step.currIdx < activeNodes.length ? activeNodes[step.currIdx]?.val : 'NULL'}
            </span>
            {step.nextIdx !== undefined && step.nextIdx >= 0 && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                next: {activeNodes[step.nextIdx]?.val}
              </span>
            )}
            {step.targetVal !== undefined && (
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-bold border border-rose-400/30">
                target: {step.targetVal}
              </span>
            )}
          </>
        )}
      </div>
    );
  };

  // ========================================================
  // VISUALIZATION CANVAS (PURE HERO GRAPHICS, ZERO TEXT WALLS)

  const renderCanvas = () => {
    // 1. MERGE SORTED CANVAS
    if (currentAlgoId === 'merge_sorted') {
      const l1 = step.list1 || mergeList1;
      const l2 = step.list2 || mergeList2;
      const merged = step.merged || [];

      return (
        <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
          {renderVariableHUD()}

          {/* List 1 & List 2 rows */}
          <div className="flex flex-col lg:flex-row items-center justify-around gap-8 w-full max-w-4xl pt-8">
            {/* List 1 */}
            <div className="flex flex-col items-center p-4 bg-white dark:bg-[#423834]/60 border border-[#EBE0D3] dark:border-[#5C4E49]/80 rounded-2xl shadow-xl">
              <span className="text-xs font-mono text-cyan-400 font-bold mb-3 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" /> List 1 (p1)
              </span>
              <div className="flex items-center gap-2 overflow-x-auto p-1">
                {l1.map((v, i) => {
                  const isCurrent = step.p1 === i;
                  const isConsumed = i < (step.p1 || 0);
                  return (
                    <React.Fragment key={`l1_${i}`}>
                      <div className="flex flex-col items-center">
                        <div className="h-5 text-[10px] font-mono text-cyan-400 font-bold">
                          {isCurrent ? 'p1' : ''}
                        </div>
                        <motion.div
                          animate={{
                            scale: isCurrent ? 1.15 : 1,
                            borderColor: isCurrent ? '#22d3ee' : isConsumed ? '#1e293b' : '#334155',
                            backgroundColor: isCurrent ? 'rgba(6, 182, 212, 0.25)' : isConsumed ? 'rgba(15, 23, 42, 0.4)' : '#1e293b'
                          }}
                          className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold shadow-md ${
                            isConsumed ? 'text-slate-600 line-through' : 'text-[#2D1F23] dark:text-[#F4EBC3]'
                          }`}
                        >
                          <span className="text-base font-extrabold">{v}</span>
                          <span className="text-[8px] font-mono text-slate-500">0x{(100 + i*8).toString(16)}</span>
                        </motion.div>
                      </div>
                      {i < l1.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 mt-4" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* List 2 */}
            <div className="flex flex-col items-center p-4 bg-white dark:bg-[#423834]/60 border border-[#EBE0D3] dark:border-[#5C4E49]/80 rounded-2xl shadow-xl">
              <span className="text-xs font-mono text-purple-400 font-bold mb-3 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm" /> List 2 (p2)
              </span>
              <div className="flex items-center gap-2 overflow-x-auto p-1">
                {l2.map((v, i) => {
                  const isCurrent = step.p2 === i;
                  const isConsumed = i < (step.p2 || 0);
                  return (
                    <React.Fragment key={`l2_${i}`}>
                      <div className="flex flex-col items-center">
                        <div className="h-5 text-[10px] font-mono text-purple-400 font-bold">
                          {isCurrent ? 'p2' : ''}
                        </div>
                        <motion.div
                          animate={{
                            scale: isCurrent ? 1.15 : 1,
                            borderColor: isCurrent ? '#c084fc' : isConsumed ? '#1e293b' : '#334155',
                            backgroundColor: isCurrent ? 'rgba(192, 132, 252, 0.25)' : isConsumed ? 'rgba(15, 23, 42, 0.4)' : '#1e293b'
                          }}
                          className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold shadow-md ${
                            isConsumed ? 'text-slate-600 line-through' : 'text-[#2D1F23] dark:text-[#F4EBC3]'
                          }`}
                        >
                          <span className="text-base font-extrabold">{v}</span>
                          <span className="text-[8px] font-mono text-slate-500">0x{(200 + i*8).toString(16)}</span>
                        </motion.div>
                      </div>
                      {i < l2.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 mt-4" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Merged Output Chain */}
          <div className="w-full max-w-3xl bg-white dark:bg-[#423834]/80 border border-emerald-500/30 rounded-3xl p-5 flex flex-col items-center shadow-2xl">
            <span className="text-xs font-mono text-emerald-400 font-bold mb-3 flex items-center gap-2">
              <GitMerge className="w-4 h-4" /> Merged Sorted Chain
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {merged.length === 0 ? (
                <span className="text-xs font-mono text-slate-500 py-3 italic">Empty (traversing lists...)</span>
              ) : (
                merged.map((v, i) => (
                  <React.Fragment key={`m_${i}`}>
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="h-4 text-[9px] font-mono text-emerald-400 font-bold">
                        {i === 0 ? 'HEAD' : i === merged.length - 1 ? 'TAIL' : ''}
                      </div>
                      <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex flex-col items-center justify-center font-mono font-bold text-emerald-200 shadow-md">
                        <span className="text-base font-black">{v}</span>
                        <span className="text-[8px] text-emerald-400/70">0x{(300 + i*8).toString(16)}</span>
                      </div>
                    </motion.div>
                    {i < merged.length - 1 && <ArrowRight className="w-4 h-4 text-emerald-500 mt-3" />}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    // 2. INTERSECTION CANVAS
    if (currentAlgoId === 'intersection') {
      const fullA = step.fullA || ['A1', 'A2', 'C1', 'C2', 'C3'];
      const fullB = step.fullB || ['B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

      return (
        <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
          {renderVariableHUD()}

          <div className="flex flex-col items-center gap-6 pt-8 w-full max-w-3xl">
            {/* List A */}
            <div className="flex items-center gap-2 overflow-x-auto p-2">
              <span className="text-xs font-mono text-amber-400 font-bold w-16">List A:</span>
              {fullA.map((val, i) => {
                const isShared = val.startsWith('C');
                const isCurr = step.idxA === i;
                return (
                  <React.Fragment key={`ia_${i}`}>
                    <div className="flex flex-col items-center">
                      <div className="h-5 text-[10px] font-mono text-amber-400 font-bold">
                        {isCurr ? 'pA' : ''}
                      </div>
                      <div className={`px-3.5 py-2.5 rounded-2xl border-2 font-mono font-bold text-base shadow-md transition-all ${
                        isShared 
                          ? 'border-emerald-500 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-500/40' 
                          : 'border-[#EBE0D3] dark:border-[#5C4E49] bg-gray-100 dark:bg-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3]'
                      }`}>
                        {val}
                      </div>
                    </div>
                    {i < fullA.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 mt-5" />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* List B */}
            <div className="flex items-center gap-2 overflow-x-auto p-2">
              <span className="text-xs font-mono text-indigo-400 font-bold w-16">List B:</span>
              {fullB.map((val, i) => {
                const isShared = val.startsWith('C');
                const isCurr = step.idxB === i;
                return (
                  <React.Fragment key={`ib_${i}`}>
                    <div className="flex flex-col items-center">
                      <div className="h-5 text-[10px] font-mono text-indigo-400 font-bold">
                        {isCurr ? 'pB' : ''}
                      </div>
                      <div className={`px-3.5 py-2.5 rounded-2xl border-2 font-mono font-bold text-base shadow-md transition-all ${
                        isShared 
                          ? 'border-emerald-500 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-500/40' 
                          : 'border-[#EBE0D3] dark:border-[#5C4E49] bg-gray-100 dark:bg-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3]'
                      }`}>
                        {val}
                      </div>
                    </div>
                    {i < fullB.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 mt-5" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 3. LRU CACHE CANVAS
    if (currentAlgoId === 'lru_cache') {
      const cache = step.cache || [];
      return (
        <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
          {renderVariableHUD()}

          <div className="flex items-center gap-3 max-w-full overflow-x-auto p-4 pt-10">
            <span className="text-xs font-mono text-emerald-400 font-bold px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
              HEAD (MRU)
            </span>
            <div className="flex items-center gap-3">
              {cache.map((item, idx) => (
                <React.Fragment key={item.key}>
                  <motion.div
                    animate={{
                      scale: step.activeKey === item.key ? 1.15 : 1,
                      borderColor: step.activeKey === item.key ? '#06b6d4' : '#334155'
                    }}
                    className="flex flex-col items-center p-3 rounded-2xl border-2 bg-white dark:bg-[#423834] min-w-[85px] shadow-xl"
                  >
                    <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297] font-semibold">Key: <strong className="text-cyan-400">{item.key}</strong></span>
                    <span className="text-base font-mono font-extrabold text-[#2D1F23] dark:text-[#F4EBC3] mt-1">Val: {item.val}</span>
                    <span className="text-[9px] font-mono text-slate-500 mt-1">0x{(400 + idx*8).toString(16)}</span>
                  </motion.div>
                  {idx < cache.length - 1 && (
                    <div className="flex flex-col items-center text-xs font-mono text-slate-500 font-bold">
                      <span>◄──►</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {cache.length === 0 && (
                <span className="text-xs font-mono text-slate-500 italic">Cache Empty</span>
              )}
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold px-3 py-1.5 bg-rose-950/40 border border-rose-500/40 rounded-xl">
              TAIL (LRU)
            </span>
          </div>
        </div>
      );
    }

    // 4. FLOYD CYCLE CANVAS (Loop curve)
    if (currentAlgoId === 'floyd_cycle') {
      const activeNodes = step.nodes || nodeList;
      const cycleEntry = step.cycleEntry !== undefined ? step.cycleEntry : (hasCycle ? cycleIndex : -1);

      return (
        <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
          {renderVariableHUD()}

          <div className="flex flex-wrap items-center justify-center gap-4 max-w-full overflow-x-auto p-4 pt-10 relative">
            {activeNodes.map((n, i) => {
              const isSlow = step.slow === i;
              const isFast = step.fast === i;
              const isEntry = cycleEntry >= 0 && i === cycleEntry;
              const inLoop = cycleEntry >= 0 && i >= cycleEntry;
              const isCollision = step.collision && isSlow && isFast;

              return (
                <React.Fragment key={n.id || i}>
                  <div className="flex flex-col items-center relative">
                    {/* Floating Badges */}
                    <div className="h-6 flex items-center gap-1 mb-1.5">
                      {isCollision && (
                        <span className="px-2 py-0.5 bg-rose-500/30 border border-rose-400 rounded-md text-[10px] font-mono text-rose-300 font-black animate-bounce">
                          💥 COLLISION
                        </span>
                      )}
                      {isSlow && !isCollision && (
                        <span className="px-1.5 py-0.5 bg-teal-500/25 border border-teal-400 rounded-md text-[10px] font-mono text-teal-300 font-bold">
                          SLOW
                        </span>
                      )}
                      {isFast && !isCollision && (
                        <span className="px-1.5 py-0.5 bg-fuchsia-500/25 border border-fuchsia-400 rounded-md text-[10px] font-mono text-fuchsia-300 font-bold">
                          FAST
                        </span>
                      )}
                      {isEntry && (
                        <span className="px-1.5 py-0.5 bg-purple-500/25 border border-purple-400 rounded-md text-[10px] font-mono text-purple-300 font-bold">
                          ENTRY
                        </span>
                      )}
                    </div>

                    {/* Node Card */}
                    <motion.div
                      animate={{
                        scale: isCollision ? 1.25 : (isSlow || isFast) ? 1.15 : 1,
                        borderColor: isCollision ? '#f43f5e' : (isSlow && isFast) ? '#f43f5e' : isFast ? '#d946ef' : isSlow ? '#14b8a6' : inLoop ? '#a855f7' : '#334155',
                        backgroundColor: isCollision ? 'rgba(244, 63, 94, 0.3)' : (isSlow || isFast) ? 'rgba(20, 184, 166, 0.2)' : inLoop ? 'rgba(168, 85, 247, 0.15)' : '#423834'
                      }}
                      className={`w-24 h-26 rounded-2xl border-2 flex flex-col items-center justify-between p-2 font-mono shadow-xl transition-all ${
                        isEntry ? 'ring-2 ring-purple-500/50' : ''
                      }`}
                    >
                      <span className="text-[10px] text-gray-500 dark:text-[#BCA297] font-bold">idx {i}</span>
                      <span className="text-2xl font-black text-[#2D1F23] dark:text-[#F4EBC3]">{n.val}</span>
                      <span className="text-[9px] text-cyan-400 font-mono">
                        {cycleEntry >= 0 && i === activeNodes.length - 1 ? `↺0x${(100 + cycleEntry*8).toString(16)}` : `0x${(100 + (i+1)*8).toString(16)}`}
                      </span>
                    </motion.div>

                    <span className="text-[10px] font-mono text-slate-500 mt-1 font-semibold">
                      0x{(100 + i*8).toString(16)}
                    </span>
                  </div>

                  {i < activeNodes.length - 1 && (
                    <div className="flex items-center text-slate-500 pt-5">
                      <ArrowRight className={`w-5 h-5 ${inLoop ? 'text-purple-400' : 'text-cyan-400'}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Loopback Arrow to Entry Node */}
            {cycleEntry >= 0 && (
              <div className="flex items-center gap-1.5 pl-2 pt-5">
                <Repeat className="w-5 h-5 text-purple-400 animate-spin" />
                <span className="text-xs font-mono font-bold text-purple-300">
                  ↺ Node {cycleEntry}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 5. STANDARD CHAIN CANVAS (Singly, Doubly, Circular, Reverse, Middle, RemoveNth, Palindrome, Delete, Search)
    const activeNodes = step.nodes || nodeList;

    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
        {renderVariableHUD()}

        <div className="flex flex-wrap items-center justify-center gap-4 max-w-full overflow-x-auto p-4 pt-10">
          {activeNodes.map((node, idx) => {
            const isCurr = step.currIdx === idx;
            const isPrev = step.prevIdx === idx;
            const isNext = step.nextIdx === idx;
            const isSlow = (currentAlgoId === 'middle_node' || currentAlgoId === 'middle' || currentAlgoId === 'remove_nth') && step.slow === idx;
            const isFast = (currentAlgoId === 'middle_node' || currentAlgoId === 'middle' || currentAlgoId === 'remove_nth') && step.fast === idx;
            const isReversed = step.reversedLinks && step.reversedLinks.includes(idx);
            const isMiddle = step.foundMiddle && step.slow === idx;
            const isGoal = step.isGoalFound && step.currIdx === idx;
            const isLeft = currentAlgoId === 'palindrome' && step.p1 === idx;
            const isRight = currentAlgoId === 'palindrome' && step.p2 === idx;
            const isTargetPos = step.insertPos === idx || step.targetPos === idx || (step.targetVal && node.val === step.targetVal);
            const isSevering = step.isSevering || (currentAlgoId === 'reverse' && step.currIdx === idx && step.isFlipping);

            // Memory address
            const nodeAddr = `0x${(100 + idx*8).toString(16)}`;
            const nextAddr = isReversed
              ? (idx > 0 ? `0x${(100 + (idx-1)*8).toString(16)}` : 'NULL')
              : (idx < activeNodes.length - 1 ? `0x${(100 + (idx+1)*8).toString(16)}` : (currentAlgoId === 'circular' ? '0x100' : 'NULL'));

            return (
              <React.Fragment key={node.id || idx}>
                <div className="flex flex-col items-center">
                  {/* Floating Variable Badges Rack */}
                  <div className="h-6 flex items-center gap-1 mb-1.5">
                    {isGoal && (
                      <span className="px-2 py-0.5 bg-emerald-500/30 border border-emerald-400 rounded-md text-[10px] font-mono text-emerald-300 font-extrabold flex items-center gap-0.5">
                        <Award className="w-3 h-3" /> GOAL!
                      </span>
                    )}
                    {idx === 0 && !isGoal && (
                      <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-400 rounded-md text-[10px] font-mono text-amber-300 font-bold">
                        HEAD
                      </span>
                    )}
                    {idx === activeNodes.length - 1 && currentAlgoId !== 'circular' && (
                      <span className="px-1.5 py-0.5 bg-slate-700/40 border border-slate-600 rounded-md text-[10px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] font-bold">
                        TAIL
                      </span>
                    )}
                    {isPrev && (
                      <span className="px-1.5 py-0.5 bg-sky-500/25 border border-sky-400 rounded-md text-[10px] font-mono text-sky-300 font-bold">
                        PREV
                      </span>
                    )}
                    {isCurr && !isGoal && !isSlow && (
                      <span className="px-1.5 py-0.5 bg-amber-500/25 border border-amber-400 rounded-md text-[10px] font-mono text-amber-300 font-bold animate-pulse">
                        CURR
                      </span>
                    )}
                    {isNext && (
                      <span className="px-1.5 py-0.5 bg-emerald-500/25 border border-emerald-400 rounded-md text-[10px] font-mono text-emerald-300 font-bold">
                        NEXT
                      </span>
                    )}
                    {isSlow && (
                      <span className="px-1.5 py-0.5 bg-teal-500/25 border border-teal-400 rounded-md text-[10px] font-mono text-teal-300 font-bold">
                        SLOW
                      </span>
                    )}
                    {isFast && (
                      <span className="px-1.5 py-0.5 bg-fuchsia-500/25 border border-fuchsia-400 rounded-md text-[10px] font-mono text-fuchsia-300 font-bold">
                        FAST
                      </span>
                    )}
                    {isLeft && (
                      <span className="px-1.5 py-0.5 bg-cyan-500/25 border border-cyan-400 rounded-md text-[10px] font-mono text-cyan-300 font-bold">
                        LEFT
                      </span>
                    )}
                    {isRight && (
                      <span className="px-1.5 py-0.5 bg-purple-500/25 border border-purple-400 rounded-md text-[10px] font-mono text-purple-300 font-bold">
                        RIGHT
                      </span>
                    )}
                    {isMiddle && (
                      <span className="px-2 py-0.5 bg-emerald-500/30 border border-emerald-400 rounded-md text-[10px] font-mono text-emerald-300 font-extrabold">
                        MID
                      </span>
                    )}
                  </div>

                  {/* 3-Layer Hero Node Card */}
                  <motion.div
                    animate={{
                      scale: isGoal ? 1.25 : (isCurr || isMiddle || isLeft || isRight) ? 1.15 : 1,
                      borderColor: isGoal ? '#10b981' : isMiddle ? '#10b981' : isTargetPos ? '#f59e0b' : isCurr ? '#f59e0b' : isPrev ? '#38bdf8' : isNext ? '#10b981' : '#334155',
                      backgroundColor: isGoal ? 'rgba(16, 185, 129, 0.35)' : isMiddle ? 'rgba(16, 185, 129, 0.25)' : isCurr ? 'rgba(245, 158, 11, 0.2)' : isPrev ? 'rgba(56, 189, 248, 0.15)' : '#423834'
                    }}
                    className="flex flex-col rounded-2xl border-2 overflow-hidden shadow-2xl min-w-[102px] transition-all"
                  >
                    {/* Top Cell: Data Value */}
                    <div className="px-4 py-3 font-mono font-black text-2xl text-[#2D1F23] dark:text-[#F4EBC3] flex items-center justify-center bg-white dark:bg-[#423834]/90 border-b border-[#EBE0D3] dark:border-[#5C4E49]">
                      {node.val}
                    </div>
                    {/* Bottom Cell: Next Address Pointer */}
                    <div className="px-2.5 py-1.5 bg-white dark:bg-[#331921] text-[10px] font-mono text-cyan-400 flex items-center justify-between gap-1.5">
                      <span className="text-slate-500 font-semibold">.next:</span>
                      <span className="font-bold">{nextAddr}</span>
                    </div>
                  </motion.div>

                  {/* Heap Memory Address */}
                  <span className="text-[10px] font-mono text-slate-500 mt-1.5 font-medium">
                    {nodeAddr}
                  </span>
                </div>

                {/* Connecting Arrow */}
                {idx < activeNodes.length - 1 && (
                  <div className="flex flex-col items-center justify-center px-1 text-slate-500 pt-6">
                    {currentAlgoId === 'doubly' ? (
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-mono font-bold text-cyan-400">◄──►</span>
                      </div>
                    ) : isSevering ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <span className="text-[9px] font-mono text-amber-400 font-extrabold">⚡ FLIP ⚡</span>
                        <span className="text-xs font-mono text-amber-400 font-bold">- - -</span>
                      </div>
                    ) : isReversed ? (
                      <div className="flex flex-col items-center">
                        <ArrowLeft className="w-8 h-8 text-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-mono text-emerald-400 font-bold">REVERSED</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-8 h-8 text-cyan-400" />
                        <span className="text-[8px] font-mono text-slate-500">.next</span>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {currentAlgoId !== 'circular' && (
            <div className="flex flex-col items-center gap-1 pl-2 pt-6">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="w-5 h-5 text-slate-600" />
                <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-xs font-mono text-rose-400/90 font-black shadow-inner">
                  NULL
                </div>
              </div>
            </div>
          )}

          {currentAlgoId === 'circular' && (
            <div className="flex flex-col items-center gap-1 pl-2 pt-6">
              <div className="flex items-center gap-1.5">
                <Repeat className="w-5 h-5 text-amber-400 animate-spin" />
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 font-bold">
                  ↺ HEAD (0x100)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[460px] relative">
      {renderCanvas()}
    </div>
  );
}
