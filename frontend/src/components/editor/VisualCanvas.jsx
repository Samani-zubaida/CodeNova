import React from 'react';
import { Network, Clock, HardDrive, Database, Zap, AlertCircle } from 'lucide-react';

const VisualCanvas = ({ analysisData, isAnalyzing }) => {
  
  if (isAnalyzing) {
    return (
      <div className="h-full w-full glass-card p-4 overflow-hidden flex flex-col relative group shadow-lg">
        <div className="flex items-center gap-2 mb-4 relative z-10 pb-3 border-b border-black/5 dark:border-white/5">
          <div className="p-1.5 bg-gradient-to-br from-[var(--color-nova-red)] to-[var(--color-nova-brown)] rounded-lg shadow-sm shadow-[var(--color-nova-red)]/20">
            <Zap size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 flex-1">
            AI Code Analysis
          </h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[var(--color-nova-red)]/20 border-t-[var(--color-nova-red)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[var(--color-nova-brown)]/20 border-b-[var(--color-nova-brown)] rounded-full animate-spin-reverse" />
            </div>
          </div>
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 animate-pulse tracking-widest uppercase">
            Analyzing Complexity...
          </p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="h-full w-full glass-card p-4 overflow-hidden flex flex-col relative group shadow-lg">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[var(--color-nova-red)]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[var(--color-nova-red)]/20 transition-all duration-700" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[var(--color-nova-brown)]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[var(--color-nova-brown)]/20 transition-all duration-700" />
        
        <div className="flex items-center gap-2 mb-2 relative z-10 pb-3 border-b border-black/5 dark:border-white/5">
          <div className="p-1.5 bg-gradient-to-br from-[var(--color-nova-red)] to-[var(--color-nova-brown)] rounded-lg shadow-sm shadow-[var(--color-nova-red)]/20">
            <Zap size={16} className="text-white" />
          </div>
          <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 flex-1">
            AI Code Analysis
          </h3>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
          <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-[var(--color-nova-red)]/10 to-[var(--color-nova-wheat)]/20 flex items-center justify-center">
            <Network size={24} className="text-[var(--color-nova-red)]/50" />
          </div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Awaiting Code Input</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
            Write your logic in the editor and click <span className="font-semibold text-[var(--color-nova-red)]">Analyze</span> to generate an AI breakdown of your code's performance and data structures.
          </p>
        </div>
      </div>
    );
  }

  if (analysisData.error) {
    return (
      <div className="h-full w-full glass-card p-4 overflow-hidden flex flex-col relative group shadow-lg">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <AlertCircle size={32} className="text-red-500 mb-3" />
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Analysis Failed</h4>
          <p className="text-xs text-red-500/80">{analysisData.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full glass-card p-4 overflow-hidden flex flex-col relative group shadow-lg">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[var(--color-nova-red)]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[var(--color-nova-red)]/20 transition-all duration-700" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[var(--color-nova-brown)]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[var(--color-nova-brown)]/20 transition-all duration-700" />
      
      <div className="flex items-center gap-2 mb-4 relative z-10 pb-3 border-b border-black/5 dark:border-white/5 shrink-0">
        <div className="p-1.5 bg-gradient-to-br from-[var(--color-nova-red)] to-[var(--color-nova-brown)] rounded-lg shadow-sm shadow-[var(--color-nova-red)]/20">
          <Zap size={16} className="text-white" />
        </div>
        <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 flex-1">
          AI Code Analysis
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 relative z-10 pb-4">
        
        {/* Time & Space Complexity Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Time Complexity Card */}
          <div className="bg-white/40 dark:bg-[#1a1a1a]/40 border border-black/5 dark:border-white/5 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-[var(--color-nova-red)]">
                <Clock size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Time</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-nova-red)]/10 text-[var(--color-nova-red)] rounded text-sm font-mono font-bold">
                {analysisData.timeComplexity || "Unknown"}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
              {analysisData.timeExplanation || "No explanation provided."}
            </p>
          </div>

          {/* Space Complexity Card */}
          <div className="bg-white/40 dark:bg-[#1a1a1a]/40 border border-black/5 dark:border-white/5 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-[var(--color-nova-brown)]">
                <HardDrive size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Space</span>
              </div>
              <span className="px-2 py-1 bg-[var(--color-nova-brown)]/10 text-[var(--color-nova-brown)] rounded text-sm font-mono font-bold">
                {analysisData.spaceComplexity || "Unknown"}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
              {analysisData.spaceExplanation || "No explanation provided."}
            </p>
          </div>
        </div>

        {/* Data Structures Section */}
        {analysisData.dataStructures && analysisData.dataStructures.length > 0 && (
          <div className="bg-white/40 dark:bg-[#1a1a1a]/40 border border-black/5 dark:border-white/5 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-gray-800 dark:text-gray-200">
              <Database size={16} className="text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Data Structures Used</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysisData.dataStructures.map((ds, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold">
                  {ds}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* General Analysis Section */}
        {analysisData.generalAnalysis && (
          <div className="bg-white/40 dark:bg-[#1a1a1a]/40 border border-black/5 dark:border-white/5 rounded-xl p-4 shadow-sm">
             <div className="flex items-center gap-2 mb-2 text-gray-800 dark:text-gray-200">
               <span className="text-xs font-bold uppercase tracking-wider">General Analysis</span>
             </div>
             <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
               {analysisData.generalAnalysis}
             </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default VisualCanvas;
