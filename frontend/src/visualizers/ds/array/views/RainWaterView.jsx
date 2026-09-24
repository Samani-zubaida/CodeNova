import React from 'react';
import { motion } from 'framer-motion';

export default function RainWaterView({
  array = [],
  pointers = {},
  goalIndex = 0,
  setGoalIndex = () => {},
  trappedWaterHeights = [],
  computeGoalIndexBreakdown = () => ({}),
  trappingWaterStats = { totalTrapped: 0 },
  rainTicks = [0, 1, 2, 3, 4],
  compactUnitPx = 20
}) {
  return (
    <div className="w-full max-w-3xl bg-white dark:bg-[#423834] rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] p-4 sm:p-5 shadow-sm overflow-x-auto">
      <div className="relative flex items-end min-h-[160px] pl-7 pb-6 min-w-[380px]">
        {/* Y-Axis Arrow */}
        <div className="absolute left-5 top-0 bottom-6 flex flex-col items-center pointer-events-none">
          <div className="w-0 h-0 border-x-3 border-x-transparent border-b-6 border-b-gray-900 dark:border-b-gray-100" />
          <div className="w-0.5 flex-1 bg-gray-900 dark:bg-gray-100" />
        </div>

        {/* Y-Axis Ticks */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col-reverse justify-between pointer-events-none text-[10px] font-mono font-bold text-gray-400 pr-1">
          {rainTicks.map((tick) => (
            <div 
              key={`tick-${tick}`}
              className="relative flex items-center justify-end h-0"
              style={{ bottom: `${tick * compactUnitPx}px` }}
            >
              <span className="mr-2">{tick}</span>
              <div className="w-1 h-0.5 bg-gray-400" />
            </div>
          ))}
        </div>

        {/* X-Axis Baseline */}
        <div className="absolute left-5 right-0 bottom-6 h-0.5 bg-gray-900 dark:bg-gray-100 pointer-events-none" />

        {/* Contiguous Black Bars + Blue Water Blocks (Compact & Neat) */}
        <div className="flex items-end gap-1 w-full justify-start pl-1 z-10">
          {array.map((val, idx) => {
            const trapped = trappedWaterHeights[idx] || computeGoalIndexBreakdown(idx)?.trappedAtCol || 0;
            const isGoal = idx === goalIndex;

            const matchingPointers = Object.entries(pointers)
              .filter(([_, pos]) => pos === idx)
              .map(([p]) => p.toUpperCase());

            return (
              <div 
                key={`rain-col-${idx}`} 
                className="relative flex flex-col items-center justify-end flex-1 max-w-[42px] min-w-[26px] group cursor-pointer"
                onClick={() => setGoalIndex(idx)}
              >
                {/* Active Pointers Floating Tag (Left / Right) */}
                <div className="absolute -top-7 flex flex-col items-center pointer-events-none z-20">
                  {matchingPointers.length > 0 && (
                    <div className="flex gap-0.5">
                      {matchingPointers.map((p) => (
                        <span 
                          key={p} 
                          className="px-1.5 py-0.2 rounded font-mono font-bold text-[9px] bg-blue-600 text-white shadow-xs"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                  {isGoal && matchingPointers.length === 0 && (
                    <span className="px-1 py-0.2 rounded font-mono font-bold text-[8px] bg-amber-500 text-white shadow-xs">
                      INSPECT
                    </span>
                  )}
                </div>

                {/* Trapped Water Stack (Light Blue) */}
                {trapped > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${trapped * compactUnitPx}px`, opacity: 1 }}
                    className="w-full bg-blue-500 border border-blue-400/80 rounded-t-xs flex items-center justify-center text-[10px] font-mono font-black text-white shadow-xs"
                  >
                    +{trapped}
                  </motion.div>
                )}

                {/* Solid Elevation Block (Elevation Terrain) */}
                <div
                  className={`w-full rounded-t-xs transition-colors flex items-center justify-center font-mono font-bold text-xs ${
                    isGoal
                      ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                      : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  }`}
                  style={{ height: `${Math.max(val * compactUnitPx, 4)}px` }}
                >
                  {val > 0 ? val : ''}
                </div>

                {/* X-Axis Column Subtitle */}
                <div className="absolute -bottom-5 flex flex-col items-center">
                  <span className={`text-[10px] font-mono ${isGoal ? 'font-black text-amber-600' : 'text-gray-400'}`}>
                    [{idx}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trapping Summary Footnote */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-[#5C4E49] text-xs font-mono text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-gray-900 dark:bg-gray-100 rounded-xs" />
            <span>Terrain</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs" />
            <span>Trapped Water</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
          <span>Total Accumulated:</span>
          <span className="text-sm font-black">{trappingWaterStats.totalTrapped} Units 💧</span>
        </div>
      </div>
    </div>
  );
}
