import React, { useState } from 'react';
import { Clock, HardDrive, Zap, Info } from 'lucide-react';

/**
 * Universal complexity badge displaying Big-O performance metrics and operation counts.
 */
export default function ComplexityBadge({
  timeComplexity = { average: 'O(1)', worst: 'O(n)' },
  spaceComplexity = 'O(1)',
  operationsCount = null,
  activeOperation = '',
  notes = '',
  className = ''
}) {
  const [showDetails, setShowDetails] = useState(false);

  // Normalize time complexity object
  const time = typeof timeComplexity === 'string' 
    ? { average: timeComplexity } 
    : timeComplexity;

  // Determine badge color tone based on big-o rating
  const getComplexityColor = (notation = '') => {
    if (notation.includes('O(1)')) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800';
    if (notation.includes('log')) return 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800';
    if (notation.includes('n log n')) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800';
    if (notation.includes('n^2') || notation.includes('n²')) return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800';
    if (notation.includes('n')) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800';
    return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800';
  };

  return (
    <div className={`w-full bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-sm border border-[#EBE0D3] dark:border-[#2E2E2E] rounded-xl p-3 shadow-xs flex flex-col gap-2 ${className}`}>
      
      {/* Header with quick info toggle */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-[10px]">
          <Zap size={13} className="text-[#BC4A54]" />
          <span>Algorithm Performance</span>
        </div>
        
        {activeOperation && (
          <span className="text-[10px] font-semibold text-[#BC4A54] truncate max-w-[150px]">
            {activeOperation}
          </span>
        )}
      </div>

      {/* Complexity Badges Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        
        {/* Time Complexity */}
        <div className={`p-2 rounded-lg border flex flex-col gap-0.5 ${getComplexityColor(time.average)}`}>
          <div className="flex items-center gap-1 opacity-80 text-[10px] font-bold">
            <Clock size={11} />
            <span>TIME COMPLEXITY</span>
          </div>
          <div className="font-mono font-black text-sm tracking-tight">
            {time.average}
          </div>
          {time.worst && (
            <span className="text-[9px] opacity-70">
              Worst: {time.worst}
            </span>
          )}
        </div>

        {/* Space Complexity */}
        <div className={`p-2 rounded-lg border flex flex-col gap-0.5 ${getComplexityColor(spaceComplexity)}`}>
          <div className="flex items-center gap-1 opacity-80 text-[10px] font-bold">
            <HardDrive size={11} />
            <span>SPACE (AUXILIARY)</span>
          </div>
          <div className="font-mono font-black text-sm tracking-tight">
            {spaceComplexity}
          </div>
          {operationsCount !== null && (
            <span className="text-[9px] opacity-70">
              Ops: {operationsCount} steps
            </span>
          )}
        </div>

      </div>

      {/* Notes / Explanation Banner if provided */}
      {notes && (
        <div className="text-[11px] text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#202020] p-2 rounded-lg border border-gray-200 dark:border-[#333] flex items-start gap-1.5 leading-relaxed">
          <Info size={12} className="shrink-0 mt-0.5 text-[#BC4A54]" />
          <span>{notes}</span>
        </div>
      )}

    </div>
  );
}
