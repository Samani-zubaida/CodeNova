import React from 'react';
import GraphDataStructureStage from '../components/GraphDataStructureStage';

export default function GraphCanvasView({
  graphData,
  explanation = {},
  currentAlgo = {},
  animationSteps = [],
  currentStepIdx = 0,
  activeNode = null,
  probingNode = null,
  visitedSet = new Set(),
  activeEdge = null,
  highlightedMstEdges = new Set(),
  highlightedPathEdges = new Set(),
  highlightedPathNodes = new Set(),
  distances = {},
  nodeColors = {},
  startNode = 'A',
  targetNode = null,
  onNodeClick = () => {},
  onShowConcept = () => {},
  queueState = [],
  stackState = [],
  priorityQueueState = [],
  visitedSequence = [],
  visitedTable = {},
  inDegreeMap = {}
}) {
  const getNodeCalculationBadge = (node) => {
    if (distances && distances[node.id] !== undefined) {
      const d = distances[node.id];
      return {
        text: `d: ${d === Infinity ? '∞' : d}`,
        color: '#38BDF8',
        border: '#0284C7'
      };
    }
    if (nodeColors && nodeColors[node.id] !== undefined) {
      return {
        text: `C: ${nodeColors[node.id]}`,
        color: nodeColors[node.id] === 0 ? '#38BDF8' : '#F43F5E',
        border: nodeColors[node.id] === 0 ? '#0284C7' : '#E11D48'
      };
    }
    return null;
  };

  const accumulatedTraversedEdges = highlightedPathEdges || new Set();

  return (
    <div className="relative w-full h-full flex-1 min-h-[600px] bg-gradient-to-br from-slate-50/80 via-white/60 to-slate-100/40 dark:from-[#0f1019] dark:via-[#12131a] dark:to-[#0d0e14] rounded-3xl border border-[#EBE0D3]/40 dark:border-[#282828]/60 shadow-2xl overflow-hidden flex flex-col">
      {/* Minimal Floating Step Action Pill (Top Center - Zero Clutter & Never Overlaps Quick Card) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/85 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-md pointer-events-none select-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-bold text-gray-800 dark:text-gray-100 font-sans">
          {explanation.action || currentAlgo.name}
        </span>
        <span className="text-[10px] font-mono font-bold text-gray-400 pl-2 border-l border-gray-200 dark:border-white/10">
          Step {animationSteps.length > 0 ? currentStepIdx + 1 : 1}/{Math.max(1, animationSteps.length)}
        </span>
      </div>

      {/* Concept Guide Button (Top Right) */}
      <button
        onClick={() => onShowConcept()}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/85 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-md text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-amber-500 hover:border-amber-500/40 transition-all cursor-pointer"
      >
        <span>💡</span>
        <span>Concept</span>
      </button>

      {/* Main Workspace Area: Graph Canvas on Left, Live Data Structure Stage Beside It */}
      <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row items-stretch overflow-hidden">
        {/* The Large, Immersive SVG Canvas */}
        <div className="flex-1 min-w-0 h-full relative flex items-center justify-center p-2 overflow-hidden">
          <svg
            viewBox="0 0 960 580"
            className="w-full h-full max-h-[85vh] select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* High-Tech Glow Filters */}
              <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="emeraldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradients for Nodes */}
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Pixel-Perfect Arrowheads */}
            <marker id="arrowhead" markerWidth="14" markerHeight="14" refX="40" refY="7" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M 1 2 L 12 7 L 1 12 z" fill="#64748B" />
            </marker>
            <marker id="arrowhead-active" markerWidth="16" markerHeight="16" refX="40" refY="8" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M 1 2 L 14 8 L 1 14 z" fill="#F43F5E" />
            </marker>
            <marker id="arrowhead-path" markerWidth="16" markerHeight="16" refX="40" refY="8" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M 1 2 L 14 8 L 1 14 z" fill="#10B981" />
            </marker>
            <marker id="arrowhead-reject" markerWidth="14" markerHeight="14" refX="40" refY="7" orient="auto" markerUnits="userSpaceOnUse">
              <path d="M 1 2 L 12 7 L 1 12 z" fill="#EF4444" />
            </marker>
          </defs>

          {/* Render Graph Edges */}
          {graphData.edges.map((edge, idx) => {
            const uNode = graphData.nodes.find((n) => n.id === edge.u);
            const vNode = graphData.nodes.find((n) => n.id === edge.v);
            if (!uNode || !vNode) return null;

            const edgeKey = `${edge.u}-${edge.v}`;
            const reverseKey = `${edge.v}-${edge.u}`;

            // Active State
            const isActive = activeEdge === edgeKey || activeEdge === reverseKey;
            const isRejected = isActive && animationSteps[currentStepIdx]?.isRejected;

            // Path State
            const isPath = highlightedPathEdges.has(edgeKey) || highlightedPathEdges.has(reverseKey);
            const isMst = highlightedMstEdges.has(edgeKey) || highlightedMstEdges.has(reverseKey);
            const isTraversed = accumulatedTraversedEdges.has(edgeKey) || accumulatedTraversedEdges.has(reverseKey);

            const isTraversingReverse = isActive
              ? activeEdge === reverseKey
              : isPath && highlightedPathEdges.has(reverseKey) && !highlightedPathEdges.has(edgeKey);
            const sourceNode = isTraversingReverse ? vNode : uNode;
            const targetNode = isTraversingReverse ? uNode : vNode;

            const midX = (uNode.x + vNode.x) / 2;
            const midY = (uNode.y + vNode.y) / 2;

            const edgeMarker = isActive
              ? isRejected
                ? 'url(#arrowhead-reject)'
                : 'url(#arrowhead-active)'
              : isPath || isTraversed || isMst
              ? 'url(#arrowhead-path)'
              : graphData.isDirected
              ? 'url(#arrowhead)'
              : undefined;

            return (
              <g key={`graph-edge-${idx}`}>
                {/* Active Laser Glow Conduit */}
                {isActive && !isRejected && (
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="#F43F5E"
                    strokeWidth={9}
                    opacity={0.4}
                    filter="url(#laserGlow)"
                  />
                )}

                {/* Confirmed Path Emerald Glow Conduit */}
                {(isPath || isTraversed || isMst) && !isActive && (
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="#10B981"
                    strokeWidth={7}
                    opacity={0.3}
                    filter="url(#emeraldGlow)"
                  />
                )}

                {/* Main Edge Line */}
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={
                    isActive
                      ? isRejected
                        ? '#EF4444'
                        : '#F43F5E'
                      : isPath || isTraversed || isMst
                      ? '#10B981'
                      : '#CBD5E1'
                  }
                  strokeWidth={isActive ? 4.5 : isPath || isTraversed || isMst ? 4 : 2.5}
                  strokeDasharray={isRejected ? '6 4' : isActive ? '10 5' : 'none'}
                  markerEnd={edgeMarker}
                  className="transition-colors duration-200"
                />

                {/* Edge Weight Pill Badge */}
                {edge.w !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`} className="pointer-events-none select-none">
                    <rect
                      x="-13"
                      y="-11"
                      width="26"
                      height="22"
                      rx="7"
                      fill={
                        isActive
                          ? isRejected
                            ? '#EF4444'
                            : '#F43F5E'
                          : isPath || isTraversed || isMst
                          ? '#059669'
                          : '#FFFFFF'
                      }
                      stroke={isActive ? '#FFFFFF' : isPath || isTraversed || isMst ? '#A7F3D0' : '#CBD5E1'}
                      strokeWidth="1.8"
                      className="shadow-sm"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="800"
                      fill={isActive || isPath || isTraversed || isMst ? '#FFFFFF' : '#334155'}
                    >
                      {edge.w}
                    </text>
                  </g>
                )}

                {/* Live Arithmetic / Inspection Callout directly on Active Edge */}
                {isActive && (explanation.math || explanation.badge) && (
                  <g transform={`translate(${midX}, ${midY - 28})`} className="pointer-events-none select-none">
                    <rect
                      x={-(Math.min((explanation.math || explanation.badge).length, 36) * 3.6 + 14)}
                      y="-12"
                      width={Math.min((explanation.math || explanation.badge).length, 36) * 7.2 + 28}
                      height="24"
                      rx="8"
                      fill="#0F172A"
                      stroke={isRejected ? '#EF4444' : '#F43F5E'}
                      strokeWidth="1.8"
                      className="shadow-2xl"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="900"
                      fill={isRejected ? '#FCA5A5' : '#FFFFFF'}
                    >
                      {explanation.math
                        ? explanation.math.length > 36
                          ? explanation.math.slice(0, 34) + '…'
                          : explanation.math
                        : isRejected
                        ? `⚠️ ${explanation.badge}`
                        : `⚡ ${explanation.badge}`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Graph Nodes (Bigger, Vibrant, Animated) */}
          {graphData.nodes.map((node) => {
            const isCurrent = activeNode === node.id;
            const isProbing = probingNode === node.id;
            const isVisited = visitedSet.has(node.id);
            const isStart = startNode === node.id;
            const isPathNode = highlightedPathNodes.has(node.id);

            return (
              <g
                key={`graph-node-${node.id}`}
                onClick={() => onNodeClick(node.id)}
                className="cursor-pointer group"
              >
                {/* Active Frontier Expanding Shockwave */}
                {isCurrent && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="32"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="3"
                      className="animate-ping opacity-40 pointer-events-none"
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="40"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="3.5"
                      opacity="0.85"
                      filter="url(#laserGlow)"
                      className="pointer-events-none"
                    />
                  </>
                )}

                {/* Probed Neighbor Amber Orbit Ring */}
                {isProbing && !isCurrent && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="42"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                    className="opacity-90 pointer-events-none animate-pulse"
                  />
                )}

                {/* Start Vertex Marker Halo */}
                {isStart && !isCurrent && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="40"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="3"
                    strokeDasharray="5 3"
                  />
                )}

                {/* Path Vertex Radiant Halo */}
                {isPathNode && !isCurrent && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    opacity="0.75"
                    filter="url(#emeraldGlow)"
                    className="pointer-events-none"
                  />
                )}

                {/* Main Node Circle (r=32) */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="32"
                  fill={
                    isCurrent
                      ? 'url(#laserGrad)'
                      : isProbing
                      ? '#F59E0B'
                      : isPathNode || isVisited
                      ? 'url(#emeraldGrad)'
                      : '#1E293B'
                  }
                  stroke={
                    isCurrent
                      ? '#FFFFFF'
                      : isProbing
                      ? '#FEF08A'
                      : isPathNode || isVisited
                      ? '#A7F3D0'
                      : '#475569'
                  }
                  strokeWidth={isCurrent || isProbing ? '4' : isPathNode ? '4' : '3'}
                  filter={isCurrent ? 'url(#laserGlow)' : isPathNode || isVisited ? 'url(#emeraldGlow)' : 'none'}
                  className="transition-colors duration-200 shadow-xl group-hover:scale-105"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />

                {/* Node Text Label (High Contrast) */}
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="17"
                  fontWeight="900"
                  fill="#FFFFFF"
                  className="select-none pointer-events-none font-mono"
                >
                  {node.label}
                </text>

                {/* Unified Calculation Value Stored Above Node */}
                {(() => {
                  const calc = getNodeCalculationBadge(node);
                  if (!calc) return null;
                  return (
                    <g transform={`translate(${node.x}, ${node.y - 42})`} className="pointer-events-none select-none">
                      <line x1="0" y1="12" x2="0" y2="28" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
                      <rect
                        x={-(Math.min(calc.text.length, 18) * 3.6 + 10)}
                        y="-11"
                        width={Math.min(calc.text.length, 18) * 7.2 + 20}
                        height="22"
                        rx="8"
                        fill="#0F172A"
                        stroke={calc.border}
                        strokeWidth="1.6"
                        className="shadow-md"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="10.5"
                        fontFamily="monospace"
                        fontWeight="800"
                        fill={calc.color}
                      >
                        {calc.text}
                      </text>
                    </g>
                  );
                })()}

                {/* Visited Checkmark Badge on Node Shoulder */}
                {isVisited && !isCurrent && (
                  <g transform={`translate(${node.x + 18}, ${node.y - 18})`} className="pointer-events-none select-none">
                    <circle r="9" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" filter="url(#emeraldGlow)" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="10"
                      fontWeight="900"
                      fill="#FFFFFF"
                    >
                      ✓
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        </div>

        {/* Textbook Data Structure Diagram Beside Graph (No Right Panel) */}
        <div className="w-full lg:w-auto flex items-center justify-center p-2 lg:p-4 shrink-0 overflow-y-auto z-10">
          <GraphDataStructureStage
            currentAlgo={currentAlgo}
            queue={queueState}
            stack={stackState}
            priorityQueue={priorityQueueState}
            visitedSet={visitedSet}
            visitedSequence={visitedSequence}
            visitedTable={visitedTable}
            distances={distances}
            inDegreeMap={inDegreeMap}
            activeNode={activeNode}
            probingNode={probingNode}
            explanation={explanation}
            nodes={graphData?.nodes || []}
            isDirected={graphData?.isDirected || false}
          />
        </div>
      </div>

      {/* Minimal Interactive Legend Ribbon at Canvas Bottom */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-white/70 dark:bg-black/40 border-t border-gray-200/80 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 select-none shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#AB526B]" />
            <span>
              Active: <strong className="text-gray-800 dark:text-gray-200">{activeNode || 'None'}</strong>
            </span>
          </span>
          {probingNode && (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span>Probing: [{probingNode}]</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span>
              Visited: <strong className="text-gray-800 dark:text-gray-200">{visitedSet.size}/{graphData.nodes.length}</strong>
            </span>
          </span>
          {highlightedPathEdges.size > 0 && (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span>🛣️ Path: {highlightedPathEdges.size} Edges</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-gray-400">
            Click any node to set Start
          </span>
        </div>
      </div>
    </div>
  );
}
