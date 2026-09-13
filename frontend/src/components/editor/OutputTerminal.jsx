import React from 'react';
import { Terminal } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const OutputTerminal = ({ isLoading, isError }) => {
  const { currentCodeOutput } = useAppStore();

  return (
    <div className="bg-[#28141B] dark:bg-[#331921] backdrop-blur-xl text-[#C5CEAE] font-mono text-[13px] p-4 h-full overflow-y-auto rounded-xl border border-[#5C4E49] shadow-2xl flex flex-col relative group transition-colors">
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[#AB526B]/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#5C4E49] relative z-10">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#BCA297]" />
          <span className="text-[10px] text-[#BCA297] uppercase tracking-widest font-bold">Execution Output</span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="flex items-center gap-2 text-[11px] text-[#F0E2A4] font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F0E2A4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F0E2A4]"></span>
              </span>
              Processing...
            </span>
          )}
        </div>
      </div>
      <pre className={`flex-1 whitespace-pre-wrap relative z-10 leading-relaxed ${isError ? 'text-red-400' : 'text-[#C5CEAE]'}`}>
        {currentCodeOutput || '> Ready.'}
      </pre>
    </div>
  );
};

export default OutputTerminal;
