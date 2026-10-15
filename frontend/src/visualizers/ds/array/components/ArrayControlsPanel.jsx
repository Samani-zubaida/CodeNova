import React from 'react';
import { ChevronDown, Target, Compass, Play, RefreshCw } from 'lucide-react';
import { ARRAY_CATALOG } from '../../ArrayHub';

export default function ArrayControlsPanel({
  currentAlgo,
  onSelectAlgo,
  searchTarget,
  setSearchTarget,
  targetSum,
  setTargetSum,
  isTrappingRain,
  goalIndex,
  setGoalIndex,
  arrayLength,
  onExecute,
  onRandomize
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Algorithm Selector Switcher */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Select Algorithm Model
        </label>
        <div className="relative">
          <select
            value={currentAlgo.id}
            onChange={(e) => onSelectAlgo(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#5C4E49] rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-100 appearance-none cursor-pointer pr-8 focus:outline-hidden focus:ring-2 focus:ring-[#AB526B]"
          >
            {ARRAY_CATALOG.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.tag})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Contextual Config Controls */}
      {currentAlgo.id === 'binary_search' && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#2A2A2A]">
          <Target size={14} className="text-[#AB526B] shrink-0" />
          <input
            type="number"
            value={searchTarget}
            onChange={(e) => setSearchTarget(e.target.value)}
            placeholder="Search Target"
            className="w-full bg-transparent text-xs font-mono font-bold focus:outline-hidden"
          />
        </div>
      )}

      {currentAlgo.id === 'two_sum' && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#2A2A2A]">
          <Target size={14} className="text-[#AB526B] shrink-0" />
          <input
            type="number"
            value={targetSum}
            onChange={(e) => setTargetSum(e.target.value)}
            placeholder="Target Sum"
            className="w-full bg-transparent text-xs font-mono font-bold focus:outline-hidden"
          />
        </div>
      )}

      {/* Trapping Rain Water: Goal Index Inspector Input */}
      {isTrappingRain && (
        <div className="p-3 bg-blue-50/70 dark:bg-[#15202B] rounded-xl border border-blue-200 dark:border-blue-900/60 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 dark:text-blue-300">
            <span className="flex items-center gap-1.5">
              <Compass size={13} className="text-blue-600" />
              <span>Inspect Column (Goal Index)</span>
            </span>
            <span className="font-mono text-blue-600 bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.2 rounded">
              Index [{goalIndex}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={Math.max(0, arrayLength - 1)}
              value={goalIndex}
              onChange={(e) => setGoalIndex(parseInt(e.target.value, 10))}
              className="flex-1 accent-blue-600 h-1.5 cursor-pointer bg-blue-200 dark:bg-blue-950 rounded-lg"
            />
            <span className="text-xs font-mono font-bold w-5 text-center text-blue-800 dark:text-blue-300">
              {goalIndex}
            </span>
          </div>
        </div>
      )}

      {/* Action Triggers */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onExecute}
          className="flex-1 py-2.5 bg-[#AB526B] hover:bg-[#a63d46] active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <Play size={14} className="fill-white" />
          <span>Simulate {currentAlgo.name}</span>
        </button>
        <button
          onClick={onRandomize}
          title="Randomize Elements"
          className="p-2.5 bg-gray-100 dark:bg-[#202020] border border-gray-200 dark:border-[#5C4E49] rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors shrink-0"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  );
}
