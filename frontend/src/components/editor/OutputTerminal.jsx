import React from 'react';
import { Terminal } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const OutputTerminal = ({ isLoading, isError }) => {
  const { currentCodeOutput } = useAppStore();

  return (
    <div className="bg-black/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl text-[#00ff00] font-mono text-[13px] p-4 h-full overflow-y-auto rounded-[10px] border border-white/10 shadow-2xl flex flex-col relative group">
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[var(--color-nova-red)]/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-gray-400" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Execution Output</span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="flex items-center gap-2 text-[11px] text-[var(--color-nova-wheat)] font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-nova-wheat)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-nova-wheat)]"></span>
              </span>
              Processing...
            </span>
          )}
        </div>
      </div>
      <pre className={`flex-1 whitespace-pre-wrap relative z-10 leading-relaxed ${isError ? 'text-red-400' : 'text-[#33ff33]'}`}>
        {currentCodeOutput || '> Ready.'}
      </pre>
    </div>
  );
};

export default OutputTerminal;
