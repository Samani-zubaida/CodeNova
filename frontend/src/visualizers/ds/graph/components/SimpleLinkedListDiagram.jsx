import React from 'react';

export default function SimpleLinkedListDiagram({
  adjacencyList = {},
  activeNode,
  probingNode,
  visitedSequence = []
}) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-100/90 dark:bg-[#12131a]/90 border border-gray-300 dark:border-white/10 rounded-2xl shadow-xl w-full select-none">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-[#2D1F23] dark:text-[#F4EBC3] font-mono">
          Adjacency Linked List
        </span>
        <span className="text-[10px] font-mono font-bold text-gray-500">
          {Object.keys(adjacencyList).length} Vertices
        </span>
      </div>

      {/* Traversal Path Linked List Chain */}
      {visitedSequence && visitedSequence.length > 0 && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 font-mono">
            Visited Linked List:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px] font-black shrink-0">
              HEAD
            </span>
            <span className="text-emerald-500 font-bold shrink-0">➔</span>
            {visitedSequence.map((vId, idx) => (
              <React.Fragment key={`visited-ll-${idx}-${vId}`}>
                <div className="flex items-stretch border border-emerald-500/50 rounded-lg overflow-hidden shrink-0 bg-white dark:bg-gray-100 dark:bg-[#5C4E49] shadow-xs">
                  <span className="px-2 py-0.5 font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">
                    {vId}
                  </span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] border-l border-emerald-500/30 flex items-center">
                    •
                  </span>
                </div>
                <span className="text-emerald-500 font-bold shrink-0">➔</span>
              </React.Fragment>
            ))}
            <span className="px-1.5 py-0.5 rounded bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono text-[10px] font-bold shrink-0">
              NULL
            </span>
          </div>
        </div>
      )}

      {/* Adjacency List Rows */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {Object.entries(adjacencyList).map(([u, neighbors]) => {
          const isRowActive = activeNode === u;

          return (
            <div
              key={`adj-row-${u}`}
              className={`flex items-center gap-1.5 p-1.5 rounded-xl transition-all ${
                isRowActive
                  ? 'bg-amber-500/15 border border-amber-500/40 shadow-xs'
                  : 'bg-black/5 dark:bg-white/5 border border-transparent'
              }`}
            >
              {/* Vertex Head Node */}
              <div className={`flex items-stretch border-2 rounded-lg overflow-hidden shrink-0 shadow-xs ${
                isRowActive
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-[#EBE0D3] dark:border-[#5C4E49] dark:border-slate-300 bg-gray-100 dark:bg-[#5C4E49] dark:bg-slate-200 text-white dark:text-slate-900'
              }`}>
                <span className="px-2.5 py-1 font-mono text-xs font-black">
                  {u}
                </span>
                <span className="px-1.5 py-1 bg-black/20 text-[10px] font-mono border-l border-white/20 flex items-center">
                  •
                </span>
              </div>

              <span className="text-gray-400 dark:text-gray-500 font-bold shrink-0">➔</span>

              {/* Linked List of Neighbors */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {neighbors.length === 0 ? (
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-500 font-mono text-[10px] font-bold">
                    NULL
                  </span>
                ) : (
                  neighbors.map((nbr, nIdx) => {
                    const isNbrProbing = isRowActive && probingNode === nbr.target;

                    return (
                      <React.Fragment key={`adj-${u}-${nbr.target}-${nIdx}`}>
                        <div className={`flex items-stretch border rounded-lg overflow-hidden shrink-0 shadow-xs transition-all ${
                          isNbrProbing
                            ? 'border-amber-400 bg-amber-500/30 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/50'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-100 dark:bg-[#5C4E49] text-gray-800 dark:text-gray-200'
                        }`}>
                          <span className="px-2 py-0.5 font-mono text-xs font-black flex items-center gap-1">
                            {nbr.target}
                            {nbr.weight !== undefined && (
                              <span className="text-[9px] text-gray-400 font-normal">
                                (w:{nbr.weight})
                              </span>
                            )}
                          </span>
                          <span className="px-1.5 py-0.5 bg-black/5 dark:bg-white/5 border-l border-gray-200 dark:border-gray-700 font-mono text-[9px] text-gray-400 flex items-center">
                            •
                          </span>
                        </div>
                        <span className="text-gray-400 dark:text-gray-500 font-bold shrink-0 text-xs">➔</span>
                      </React.Fragment>
                    );
                  })
                )}
                {neighbors.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-500 font-mono text-[10px] font-bold shrink-0">
                    NULL
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 font-sans mt-1">
        Graph Adjacency List Representation (Linked List)
      </div>
    </div>
  );
}
