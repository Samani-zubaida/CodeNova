import React from 'react';

export default function BfsQueueView({
  currentQ = ['A'],
  visited = ['A'],
  activeNode = null,
  order = []
}) {
  const nodeCoords = {
    'A': { x: 180, y: 40 },
    'B': { x: 90, y: 110 },
    'C': { x: 270, y: 110 },
    'D': { x: 40, y: 180 },
    'E': { x: 140, y: 180 },
    'F': { x: 270, y: 180 }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      {/* Graph Diagram Canvas */}
      <div className="relative w-[360px] h-[220px]">
        <svg className="w-full h-full">
          {/* Graph Edges */}
          <line x1={nodeCoords.A.x} y1={nodeCoords.A.y} x2={nodeCoords.B.x} y2={nodeCoords.B.y} stroke="#5C4E49" strokeWidth="2" />
          <line x1={nodeCoords.A.x} y1={nodeCoords.A.y} x2={nodeCoords.C.x} y2={nodeCoords.C.y} stroke="#5C4E49" strokeWidth="2" />
          <line x1={nodeCoords.B.x} y1={nodeCoords.B.y} x2={nodeCoords.D.x} y2={nodeCoords.D.y} stroke="#5C4E49" strokeWidth="2" />
          <line x1={nodeCoords.B.x} y1={nodeCoords.B.y} x2={nodeCoords.E.x} y2={nodeCoords.E.y} stroke="#5C4E49" strokeWidth="2" />
          <line x1={nodeCoords.C.x} y1={nodeCoords.C.y} x2={nodeCoords.F.x} y2={nodeCoords.F.y} stroke="#5C4E49" strokeWidth="2" />
          <line x1={nodeCoords.E.x} y1={nodeCoords.E.y} x2={nodeCoords.F.x} y2={nodeCoords.F.y} stroke="#5C4E49" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Graph Nodes */}
          {Object.entries(nodeCoords).map(([n, pos]) => {
            const isActive = activeNode === n;
            const isVisited = visited.includes(n);
            const inQueue = currentQ.includes(n);

            return (
              <g key={n} className="transition-all duration-300">
                {isActive && (
                  <circle cx={pos.x} cy={pos.y} r="24" fill="none" stroke="#AB526B" strokeWidth="2">
                    <animate attributeName="r" values="18;26;18" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={isActive ? "#AB526B" : inQueue ? "#F0E2A4" : isVisited ? "#C5CEAE" : "#FAF7F2"}
                  stroke={isActive ? "#F0E2A4" : "#5C4E49"}
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y + 4.5}
                  textAnchor="middle"
                  fill={isActive ? "#ffffff" : "#2D1F23"}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {n}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* FIFO Queue Frontier Runway */}
      <div className="w-full bg-[#FAF7F2] dark:bg-[#331921] border-2 border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3 flex items-center justify-between shadow-sm">
        <span className="text-xs font-mono font-bold text-[#AB526B]">BFS Queue:</span>
        <div className="flex items-center gap-2">
          {currentQ.map((node, i) => (
            <span key={i} className="px-3 py-1 rounded-xl bg-[#AB526B] text-white font-mono font-black text-xs shadow-sm">
              {node}
            </span>
          ))}
          {currentQ.length === 0 && <span className="text-xs text-[#BCA297] italic">Empty</span>}
        </div>
        <span className="text-xs font-mono text-gray-500">Output: [{order.join(', ')}]</span>
      </div>
    </div>
  );
}
