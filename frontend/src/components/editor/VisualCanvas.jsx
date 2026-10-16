import React from 'react';
import { Network, Clock, HardDrive, Database, Zap, AlertCircle, Sparkles } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const getDataStructureBadgeClass = (ds = '') => {
  const name = ds.toLowerCase();
  if (name.includes('array')) {
    return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
  }
  if (name.includes('vector') || name.includes('list')) {
    return 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30';
  }
  if (name.includes('map') || name.includes('hash') || name.includes('dict')) {
    return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
  }
  if (name.includes('tree') || name.includes('graph') || name.includes('heap')) {
    return 'bg-violet-500/15 text-violet-800 dark:text-violet-300 border-violet-500/30';
  }
  return 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30';
};

const VisualCanvas = ({ analysisData, isAnalyzing }) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';
  const isWarm = theme === 'warm';

  // Container styling matching Code Nova theme
  const containerClasses = isDark
    ? 'bg-[#181118]/95 border-[#4D3640] text-[#F4EBC3] shadow-2xl'
    : isWarm
      ? 'bg-[#FAF5ED]/95 border-[#E2D5C5] text-[#2D1F23] shadow-lg'
      : 'bg-white/95 border-slate-300/80 text-slate-900 shadow-xl';

  const headerBorderClasses = isDark
    ? 'border-[#3D2833]'
    : isWarm
      ? 'border-[#E8DFD5]'
      : 'border-slate-200';

  if (isAnalyzing) {
    return (
      <div className={`h-full w-full rounded-2xl p-4 sm:p-5 overflow-hidden flex flex-col relative group backdrop-blur-xl border transition-all duration-300 ${containerClasses}`}>
        <div className={`flex items-center justify-between mb-4 relative z-10 pb-3 border-b shrink-0 ${headerBorderClasses}`}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg shadow-md shadow-violet-500/25">
              <Zap size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              AI Code Analysis
            </h3>
          </div>
          <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30">
            PROCESSING
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-4">
          <div className="relative">
            <div className="w-14 h-14 border-3 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-cyan-400/25 border-b-cyan-400 rounded-full animate-spin-reverse" />
            </div>
          </div>
          <p className="text-xs font-mono font-bold text-violet-600 dark:text-violet-300 animate-pulse tracking-widest uppercase">
            Analyzing Algorithmic Complexity...
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Evaluating time bounds, space overhead, and structural patterns
          </span>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className={`h-full w-full rounded-2xl p-4 sm:p-5 overflow-hidden flex flex-col relative group backdrop-blur-xl border transition-all duration-300 ${containerClasses}`}>
        {/* Subtle decorative aura */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-violet-500/10 rounded-full blur-[70px] pointer-events-none group-hover:bg-violet-500/15 transition-all duration-700" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-cyan-500/10 rounded-full blur-[70px] pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-700" />

        <div className={`flex items-center justify-between mb-4 relative z-10 pb-3 border-b shrink-0 ${headerBorderClasses}`}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg shadow-md shadow-violet-500/25">
              <Zap size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              AI Code Analysis
            </h3>
          </div>
          <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            IDLE
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-violet-500/15 via-sky-500/15 to-emerald-500/15 border border-violet-500/25 flex items-center justify-center shadow-inner">
            <Network size={28} className="text-violet-600 dark:text-violet-400" />
          </div>
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1.5">
            Awaiting Code Input
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            Write your code in the editor and click <span className="font-bold text-violet-600 dark:text-violet-400">Analyze</span> to generate an algorithmic breakdown of Time/Space complexity and data structures.
          </p>
        </div>
      </div>
    );
  }

  if (analysisData.error) {
    return (
      <div className={`h-full w-full rounded-2xl p-4 sm:p-5 overflow-hidden flex flex-col relative group backdrop-blur-xl border transition-all duration-300 ${containerClasses}`}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-3">
            <AlertCircle size={28} className="text-rose-500" />
          </div>
          <h4 className="text-base font-extrabold text-rose-700 dark:text-rose-400 mb-1">
            Analysis Failed
          </h4>
          <p className="text-xs text-rose-600/90 dark:text-rose-300/90 max-w-sm">
            {analysisData.error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full rounded-2xl p-4 sm:p-5 overflow-hidden flex flex-col relative group backdrop-blur-xl border transition-all duration-300 ${containerClasses}`}>
      {/* Decorative ambient auras */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-violet-500/10 rounded-full blur-[70px] pointer-events-none group-hover:bg-violet-500/15 transition-all duration-700" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-sky-500/10 rounded-full blur-[70px] pointer-events-none group-hover:bg-sky-500/15 transition-all duration-700" />

      {/* Header Bar */}
      <div className={`flex items-center justify-between mb-4 relative z-10 pb-3 border-b shrink-0 ${headerBorderClasses}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg shadow-md shadow-violet-500/25">
            <Zap size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            AI Code Analysis
          </h3>
        </div>
        <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
          DIAGNOSTIC REPORT
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 [scrollbar-width:thin] space-y-3.5 relative z-10 pb-2">

        {/* Time & Space Complexity Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Time Complexity Card (Warm Amber) */}
          <div className="bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border border-amber-300/80 dark:border-amber-500/25 rounded-2xl p-4 shadow-xs hover:border-amber-400 transition-all">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold font-mono text-xs uppercase tracking-wider">
                <Clock size={15} className="text-amber-500" />
                <span>Time Complexity</span>
              </div>
              <span className="px-2.5 py-1 bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono font-black shadow-xs">
                {analysisData.timeComplexity || "O(N)"}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-2.5 font-sans">
              {analysisData.timeExplanation || "No explanation provided."}
            </p>
          </div>

          {/* Space Complexity Card (Ocean Sky) */}
          <div className="bg-sky-500/[0.04] dark:bg-sky-500/[0.06] border border-sky-300/80 dark:border-sky-500/25 rounded-2xl p-4 shadow-xs hover:border-sky-400 transition-all">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold font-mono text-xs uppercase tracking-wider">
                <HardDrive size={15} className="text-sky-500" />
                <span>Space Complexity</span>
              </div>
              <span className="px-2.5 py-1 bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/30 rounded-lg text-xs font-mono font-black shadow-xs">
                {analysisData.spaceComplexity || "O(1)"}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-2.5 font-sans">
              {analysisData.spaceExplanation || "No explanation provided."}
            </p>
          </div>
        </div>

        {/* Data Structures Section (Royal Violet) */}
        {analysisData.dataStructures && analysisData.dataStructures.length > 0 && (
          <div className="bg-violet-500/[0.03] dark:bg-violet-500/[0.05] border border-violet-300/80 dark:border-violet-500/25 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-slate-900 dark:text-slate-100">
              <Database size={15} className="text-violet-500" />
              <span className="text-xs font-extrabold uppercase tracking-wider font-mono text-violet-700 dark:text-violet-400">
                Data Structures Identified
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysisData.dataStructures.map((ds, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-2xs ${getDataStructureBadgeClass(ds)}`}
                >
                  {ds}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* General Analysis Section (Emerald / Slate) */}
        {analysisData.generalAnalysis && (
          <div className="bg-emerald-500/[0.02] dark:bg-white/[0.02] border border-slate-300/80 dark:border-[#4D3640] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-slate-100">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="text-xs font-extrabold uppercase tracking-wider font-mono text-emerald-700 dark:text-emerald-400">
                Architectural Breakdown
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {analysisData.generalAnalysis}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default VisualCanvas;
