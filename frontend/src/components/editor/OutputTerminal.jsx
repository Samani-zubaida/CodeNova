import React from 'react';
import { Terminal, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const OutputTerminal = ({ isLoading, isError }) => {
  const { currentCodeOutput, theme } = useAppStore();
  const isDark = theme === 'dark';
  const isWarm = theme === 'warm';

  // Dynamic theme container styles
  const containerClasses = isDark
    ? 'bg-[#181118]/95 border-[#4D3640] text-emerald-300 shadow-2xl'
    : isWarm
      ? 'bg-[#FAF5ED]/95 border-[#E2D5C5] text-[#2D1F23] shadow-lg'
      : 'bg-white/95 border-slate-300/80 text-slate-800 shadow-xl';

  const headerBorderClasses = isDark
    ? 'border-[#3D2833]'
    : isWarm
      ? 'border-[#E8DFD5]'
      : 'border-slate-200';

  const glowBg = isDark
    ? 'bg-[#AB526B]/15'
    : 'bg-sky-500/5';

  return (
    <div className={`backdrop-blur-xl font-mono text-[13px] p-4 h-full overflow-y-auto rounded-xl border flex flex-col relative group transition-all duration-300 [scrollbar-width:thin] ${containerClasses}`}>
      {/* Subtle ambient lighting */}
      <div className={`absolute top-0 left-1/4 w-1/2 h-1/2 blur-3xl pointer-events-none rounded-full ${glowBg}`} />

      {/* Terminal Header */}
      <div className={`flex items-center justify-between mb-3 pb-2.5 border-b relative z-10 shrink-0 ${headerBorderClasses}`}>
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Terminal size={14} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Execution Console
          </span>
        </div>

        {/* Dynamic Status Badges */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              Processing...
            </span>
          ) : isError ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 shadow-xs">
              <AlertTriangle size={11} className="text-rose-500" />
              Runtime Error
            </span>
          ) : currentCodeOutput ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 shadow-xs">
              <CheckCircle2 size={11} className="text-emerald-500" />
              Completed
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="flex-1 overflow-y-auto [scrollbar-width:thin] relative z-10">
        {isError ? (
          <pre className="whitespace-pre-wrap leading-relaxed p-3 rounded-lg border bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-300 font-medium">
            {currentCodeOutput}
          </pre>
        ) : currentCodeOutput ? (
          <pre className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-emerald-300 font-mono font-medium">
            {currentCodeOutput}
          </pre>
        ) : (
          <div className="flex flex-col items-start gap-1 py-2 text-slate-500 dark:text-slate-400 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400">
              <span className="text-amber-500 font-black">❯</span> System idle.
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Press "Run Code" above to execute and stream real-time output.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputTerminal;
