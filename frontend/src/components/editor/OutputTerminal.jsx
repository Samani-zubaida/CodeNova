import React from 'react';
import useAppStore from '../../store/useAppStore';

const OutputTerminal = ({ isLoading, isError }) => {
  const { currentCodeOutput } = useAppStore();

  return (
    <div className="bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 h-full overflow-y-auto rounded-md border border-border flex flex-col">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#333]">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Terminal Output</span>
        {isLoading && <span className="text-xs text-primary animate-pulse">Executing...</span>}
      </div>
      <pre className={`flex-1 whitespace-pre-wrap ${isError ? 'text-destructive' : 'text-[#d4d4d4]'}`}>
        {currentCodeOutput || 'Ready for execution...'}
      </pre>
    </div>
  );
};

export default OutputTerminal;
