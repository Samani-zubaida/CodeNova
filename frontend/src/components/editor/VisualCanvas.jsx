import React from 'react';
import { Network } from 'lucide-react';

const VisualCanvas = ({ data, isVisualizing }) => {
  return (
    <div className="h-full w-full glass-card p-4 overflow-hidden flex flex-col relative group shadow-lg">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[var(--color-nova-red)]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[var(--color-nova-red)]/20 transition-all duration-700" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[var(--color-nova-green)]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[var(--color-nova-green)]/20 transition-all duration-700" />
      
      <div className="flex items-center gap-2 mb-4 relative z-10 pb-3 border-b border-black/5 dark:border-white/5">
        <div className="p-1.5 bg-gradient-to-br from-[var(--color-nova-red)] to-[var(--color-nova-brown)] rounded-lg shadow-sm shadow-[var(--color-nova-red)]/20">
          <Network size={16} className="text-white" />
        </div>
        <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          Neural Visualizer
        </h3>
      </div>

      {isVisualizing ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[var(--color-nova-red)]/20 border-t-[var(--color-nova-red)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[var(--color-nova-brown)]/20 border-b-[var(--color-nova-brown)] rounded-full animate-spin-reverse" />
            </div>
          </div>
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 animate-pulse tracking-widest uppercase">
            Mapping Syntax Tree...
          </p>
        </div>
      ) : data ? (
        <div className="flex-1 overflow-auto relative z-10 custom-scrollbar pr-2">
          <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4 border border-black/5 dark:border-white/5 backdrop-blur-sm">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">AI Execution Pipeline (D3.js Data Map)</p>
            <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
          <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-[var(--color-nova-red)]/10 to-[var(--color-nova-wheat)]/20 flex items-center justify-center">
            <Network size={24} className="text-[var(--color-nova-red)]/50" />
          </div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Awaiting Code Input</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
            Write your logic in the editor and click <span className="font-semibold text-[var(--color-nova-red)]">Visualize</span> to generate an interactive 3D execution map of your algorithms.
          </p>
        </div>
      )}
    </div>
  );
};

export default VisualCanvas;
