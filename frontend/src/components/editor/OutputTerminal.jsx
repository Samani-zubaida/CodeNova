import React from 'react';
import { Terminal } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const OutputTerminal = ({ isLoading, isError }) => {
  const { currentCodeOutput } = useAppStore();

  return (
    <div className="bg-black/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl text-[#00ff00] font-mono text-sm p-5 h-full overflow-y-auto rounded-xl border border-white/10 shadow-2xl flex flex-col relative group">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[var(--color-nova-red)]/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-gray-400" />
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Execution Output</span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="flex items-center gap-2 text-xs text-[var(--color-nova-wheat)] font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-nova-wheat)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-nova-wheat)]"></span>
              </span>
              Processing...
            </span>
          )}
        </div>
      </div>
      <pre className={`flex-1 whitespace-pre-wrap relative z-10 ${isError ? 'text-red-400' : 'text-[#33ff33]'}`}>
        {currentCodeOutput || '> Ready.'}
      </pre>
    </div>
  );
};

export default OutputTerminal;
