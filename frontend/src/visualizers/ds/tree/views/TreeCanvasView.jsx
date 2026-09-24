import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, ZoomIn, ZoomOut, Maximize2, X,
  SkipBack, Play, Pause, SkipForward, RotateCcw
} from 'lucide-react';
import TreeDataStructureStage from '../components/TreeDataStructureStage';

export default function TreeCanvasView({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleWheel,
  currentAlgo,
  activeStep = {},
  zoom,
  setZoom,
  pan,
  setPan,
  handleAutoCenter,
  svgEdges = [],
  ghostSlots = [],
  svgNodes = [],
  selectedNode,
  setSelectedNode,
  selectedParentVal,
  setSelectedParentVal,
  accumulatedAnnotations = {},
  inCanvasModal,
  setInCanvasModal,
  handleAddByParent,
  isPlaying,
  setIsPlaying,
  currentStepIdx,
  setCurrentStepIdx,
  steps = [],
  speed,
  setSpeed,
  traversalOutput = []
}) {
  return (
    <div className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden w-full h-full">
      {/* Interactive Main Workspace: Tree Canvas on Left, Live Data Structure Stage Beside It */}
      <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row items-stretch gap-4 overflow-hidden">
        {/* The SVG Canvas Viewport */}
        <div
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="flex-1 min-w-0 h-full min-h-[480px] bg-[#FAF7F2] dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl relative overflow-hidden shadow-xl cursor-grab active:cursor-grabbing select-none"
        >
        {/* Top-Center Floating Variable HUD (Zero Clutter & Never Overlaps Quick Card) */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-1.5 p-2.5 sm:p-3 rounded-2xl bg-white/90 dark:bg-[#331921]/90 backdrop-blur-xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-xl max-w-[280px] sm:max-w-[340px] pointer-events-none select-none transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4] flex items-center gap-1">
              <Activity size={12} className="text-[#AB526B]" />
              {currentAlgo.name}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100 dark:border-[#5C4E49]/60">
            <span className="text-gray-500 dark:text-[#BCA297] text-[11px]">Active Node:</span>
            <span className="font-mono font-black text-xs text-[#2D1F23] dark:text-[#F4EBC3] bg-[#AB526B]/15 px-2 py-0.5 rounded-lg border border-[#AB526B]/30">
              {activeStep?.activeNodeVal !== null && activeStep?.activeNodeVal !== undefined ? `[${activeStep.activeNodeVal}]` : 'None'}
            </span>
          </div>

          {activeStep?.explanation?.action && (
            <div className="text-[11px] font-medium text-gray-700 dark:text-[#F0E2A4] line-clamp-2 pt-0.5 leading-tight">
              {activeStep.explanation.action}
            </div>
          )}
        </div>

        {/* Top-Right Pan & Zoom Viewport Controls */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 bg-white/90 dark:bg-[#331921]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-lg">
          <button
            onClick={() => setZoom(prev => Math.min(prev * 1.15, 2.5))}
            className="p-1.5 rounded-lg text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-[#F0E2A4] hover:bg-gray-100 dark:hover:bg-[#423834] transition-all"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev * 0.85, 0.35))}
            className="p-1.5 rounded-lg text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-[#F0E2A4] hover:bg-gray-100 dark:hover:bg-[#423834] transition-all"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-white transition-all"
            title="Reset 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleAutoCenter}
            className="p-1.5 rounded-lg text-[#C5CEAE] hover:bg-[#C5CEAE]/10 transition-all"
            title="Auto-Fit Tree to Screen"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* SVG Canvas with Zoom & Pan transform */}
        <svg className="w-full h-full">
          <defs>
            <filter id="treeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <marker id="arrow-down" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#AB526B" />
            </marker>
            <marker id="arrow-up" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#C5CEAE" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* 1. EDGES */}
            {svgEdges.map((edge) => {
              const isTraveled = activeStep.branchEdge && (
                activeStep.branchEdge.parentVal === edge.from.val &&
                activeStep.branchEdge.childSide === edge.side
              );
              const isPathEdge = activeStep.highlightPath && (
                activeStep.highlightPath.includes(edge.from.val) &&
                activeStep.highlightPath.includes(edge.to.val)
              );

              const cY = (edge.from.y + edge.to.y) / 2;
              const pathD = `M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${cY}, ${edge.to.x} ${cY}, ${edge.to.x} ${edge.to.y}`;

              return (
                <g key={edge.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isTraveled ? "#AB526B" : isPathEdge ? "#C5CEAE" : "#BCA297"}
                    strokeWidth={isTraveled ? "3.5" : isPathEdge ? "3" : "2"}
                    strokeDasharray={isTraveled ? "6,3" : "none"}
                    className="transition-all duration-300 dark:stroke-[#5C4E49]"
                  />
                </g>
              );
            })}

            {/* 2. GHOST (+) SLOTS FOR INLINE NODE ADDITIONS (Hidden during algorithm playback) */}
            {(!isPlaying && steps.length === 0) && ghostSlots.map((slot) => (
              <g
                key={`ghost-${slot.parentVal}-${slot.side}`}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  const defVal = slot.side === 'left' ? slot.parentVal - 5 : slot.parentVal + 5;
                  setInCanvasModal({
                    isOpen: true,
                    parentVal: slot.parentVal,
                    side: slot.side,
                    inputVal: String(defVal)
                  });
                }}
              >
                <circle
                  cx={slot.x}
                  cy={slot.y}
                  r="14"
                  fill="rgba(171, 82, 107, 0.05)"
                  stroke="rgba(171, 82, 107, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  className="group-hover:stroke-[#AB526B] group-hover:fill-[#AB526B]/20 transition-all"
                />
                <text
                  x={slot.x}
                  y={slot.y + 4}
                  textAnchor="middle"
                  fill="rgba(171, 82, 107, 0.8)"
                  fontSize="13"
                  fontWeight="bold"
                  className="pointer-events-none group-hover:fill-[#AB526B]"
                >
                  +
                </text>
              </g>
            ))}

            {/* 3. NODES */}
            {svgNodes.map((node) => {
              const isActive = activeStep.activeNodeVal === node.val;
              const isComparing = activeStep.comparingVal === node.val;
              const isPath = activeStep.highlightPath?.includes(node.val);
              const isPathP = activeStep.pathP?.includes(node.val);
              const isPathQ = activeStep.pathQ?.includes(node.val);
              const isLCA = activeStep.lcaNodeVal === node.val;
              const isSelected = selectedNode && selectedNode.val === node.val;
              const isChosenParent = Number(selectedParentVal) === node.val;

              let fill = "#FAF7F2";
              let stroke = "#BCA297";
              let textFill = "#2D1F23";

              if (isLCA) {
                fill = "#AB526B"; stroke = "#F0E2A4"; textFill = "#ffffff";
              } else if (isActive) {
                fill = "#AB526B"; stroke = "#F0E2A4"; textFill = "#ffffff";
              } else if (isComparing) {
                fill = "#F0E2A4"; stroke = "#AB526B"; textFill = "#2D1F23";
              } else if (isPathP) {
                fill = "#AB526B"; stroke = "#F0E2A4"; textFill = "#ffffff";
              } else if (isPathQ) {
                fill = "#C5CEAE"; stroke = "#AB526B"; textFill = "#2D1F23";
              } else if (isPath) {
                fill = "#C5CEAE"; stroke = "#AB526B"; textFill = "#2D1F23";
              } else if (isChosenParent) {
                fill = "#F4E9D4"; stroke = "#AB526B"; textFill = "#2D1F23";
              }

              return (
                <g
                  key={node.id}
                  className="interactive-node cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                    setSelectedParentVal(String(node.val));
                  }}
                >
                  {(isActive || isChosenParent) && (
                    <circle cx={node.x} cy={node.y} r="29" fill="none" stroke={isActive ? "#AB526B" : "#F0E2A4"} strokeWidth="2" opacity="0.6">
                      <animate attributeName="r" values="24;32;24" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {isSelected && (
                    <circle cx={node.x} cy={node.y} r="26" fill="none" stroke="#AB526B" strokeWidth="2.5" />
                  )}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="2.2"
                    className="transition-colors duration-300 shadow-md"
                  />

                  <text
                    x={node.x}
                    y={node.y + 4.5}
                    textAnchor="middle"
                    fill={textFill}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="pointer-events-none select-none"
                  >
                    {node.val}
                  </text>
                </g>
              );
            })}

            {/* 4. ANNOTATION BADGES */}
            {svgNodes.map((node) => {
              const annotation = accumulatedAnnotations[node.val];
              if (!annotation) return null;

              const text = String(annotation.text);
              const badgeW = Math.max(38, text.length * 7 + 14);
              const badgeH = 19;
              const badgeX = node.x - badgeW / 2;
              const badgeY = node.y - 45;
              const color = annotation.color || '#AB526B';
              const bg = annotation.bg || 'rgba(51, 25, 33, 0.9)';

              return (
                <g key={`annotation-${node.id}`} className="pointer-events-none transition-all duration-300">
                  <line x1={node.x} y1={node.y - 26} x2={node.x} y2={node.y - 22} stroke={color} strokeWidth="1.5" />
                  <rect x={badgeX} y={badgeY} width={badgeW} height={badgeH} rx="6" fill={bg} stroke={color} strokeWidth="1.2" />
                  <text x={node.x} y={badgeY + 13} textAnchor="middle" fill={color} fontSize="10" fontWeight="bold" fontFamily="monospace">
                    {text}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* IN-CANVAS MODAL FOR ADDING CHILD */}
        {inCanvasModal?.isOpen && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#331921] border-2 border-[#AB526B] rounded-3xl p-5 shadow-2xl max-w-sm w-full space-y-4 font-mono"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#5C4E49] pb-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-[#FAF7F2]">
                  Add {inCanvasModal.side.toUpperCase()} Child
                </h3>
                <button onClick={() => setInCanvasModal(null)} className="text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-gray-600 dark:text-[#BCA297]">
                Attaching to Parent Node <strong className="text-[#AB526B]">[{inCanvasModal.parentVal}]</strong>
              </p>

              <div className="space-y-1">
                <label className="text-[11px] text-gray-500 dark:text-[#BCA297]">Integer Node Value:</label>
                <input
                  type="number"
                  autoFocus
                  value={inCanvasModal.inputVal}
                  onChange={(e) => setInCanvasModal(prev => ({ ...prev, inputVal: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-3 py-2 text-sm font-mono text-gray-900 dark:text-[#FAF7F2] focus:outline-none focus:border-[#AB526B]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt(inCanvasModal.inputVal, 10);
                      if (!isNaN(val)) {
                        handleAddByParent(inCanvasModal.parentVal, inCanvasModal.side, val);
                        setInCanvasModal(null);
                      }
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setInCanvasModal(null)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#5C4E49] text-xs text-gray-600 dark:text-[#BCA297]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const val = parseInt(inCanvasModal.inputVal, 10);
                    if (!isNaN(val)) {
                      handleAddByParent(inCanvasModal.parentVal, inCanvasModal.side, val);
                      setInCanvasModal(null);
                    }
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white text-xs font-bold shadow-sm"
                >
                  Confirm & Attach
                </button>
              </div>
            </motion.div>
          </div>
        )}

        </div>

        {/* Pure Textbook Data Structure Stage Beside Tree (No full-height right panel container) */}
        <div className="w-full lg:w-auto flex items-center justify-center p-2 lg:p-4 shrink-0 overflow-y-auto z-10">
          <TreeDataStructureStage
            currentAlgo={currentAlgo}
            activeStep={activeStep}
            traversalOutput={traversalOutput}
          />
        </div>
      </div>
    </div>
  );
}
