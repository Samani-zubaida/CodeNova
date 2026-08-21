import React from 'react';
import { Network } from 'lucide-react';

const VisualCanvas = ({ data, isVisualizing }) => {
  return (
    <div className="h-full w-full glass-card p-6 overflow-hidden flex flex-col relative group shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-nova-red)]/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-[var(--color-nova-red)]/30 transition-all duration-700" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[var(--color-nova-green)]/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-[var(--color-nova-green)]/30 transition-all duration-700" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10 pb-4 border-b border-black/5 dark:border-white/5">
        <div className="p-2.5 bg-gradient-to-br from-[var(--color-nova-red)] to-[var(--color-nova-brown)] rounded-xl shadow-lg shadow-[var(--color-nova-red)]/20">
          <Network size={22} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          Neural Visualizer
        </h3>
      </div>

      {isVisualizing ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--color-nova-red)]/20 border-t-[var(--color-nova-red)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[var(--color-nova-brown)]/20 border-b-[var(--color-nova-brown)] rounded-full animate-spin-reverse" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse tracking-widest uppercase">
            Mapping Syntax Tree...
          </p>
        </div>
      ) : data ? (
        <div className="flex-1 overflow-auto relative z-10 custom-scrollbar pr-2">
          <div className="bg-black/5 dark:bg-white/5 rounded-xl p-5 border border-black/5 dark:border-white/5 backdrop-blur-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">AI Execution Pipeline (D3.js Data Map)</p>
            <pre className="text-[13px] text-gray-700 dark:text-gray-300 font-mono leading-relaxed overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-10 relative z-10">
          <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-[var(--color-nova-red)]/10 to-[var(--color-nova-wheat)]/20 flex items-center justify-center">
            <Network size={40} className="text-[var(--color-nova-red)]/50" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Awaiting Code Input</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
            Write your logic in the editor and click <span className="font-semibold text-[var(--color-nova-red)]">Visualize</span> to generate an interactive 3D execution map of your algorithms.
          </p>
        </div>
      )}
    </div>
  );
};

export default VisualCanvas;
