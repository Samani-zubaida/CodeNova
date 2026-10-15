import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Plus, Trash2, Search, ArrowRight, Zap, 
  ChevronDown, ChevronUp, Minimize2, Maximize2, 
  Sliders, Compass, Play, Shuffle, Sparkles, Move
} from 'lucide-react';

/**
 * QuickCornerCard
 * Floating, user-friendly, minimizable corner card for dynamic actions:
 * - Target value search
 * - Add / Insert operations
 * - Remove / Delete operations
 * - Graph start/target node inputs & topology presets
 */
export default function QuickCornerCard({
  title = "Quick Controls",
  subtitle = "Instant Canvas Actions",
  position = "top-left", // "top-left" | "top-right" | "bottom-left"
  defaultMinimized = false,
  targetInput = null,   // { value, onChange, onSearch, label, placeholder, isFound }
  addInput = null,      // { value, onChange, onAdd, label, placeholder, onAddHead, onAddTail, posValue, onPosChange }
  removeInput = null,   // { value, onChange, onRemove, label, placeholder, mode }
  graphInputs = null,   // { startNode, setStartNode, targetNode, setTargetNode, nodes, onExecute, topologies, selectedTopology, onSelectTopology }
  customActions = null, // Extra buttons or presets
  children = null
}) {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [corner, setCorner] = useState(position);

  // Position classes
  const positionClass = 
    corner === 'top-left' ? 'top-14 left-3.5' :
    corner === 'top-right' ? 'top-14 right-3.5' :
    'bottom-16 left-3.5';

  const toggleCorner = () => {
    setCorner(prev => prev === 'top-left' ? 'top-right' : 'top-left');
  };

  return (
    <div className={`absolute ${positionClass} z-30 select-none transition-all duration-300 pointer-events-auto`}>
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* ======================================================== */
          /* MINIMIZED FLOATING PILL BADGE                             */
          /* ======================================================== */
          <motion.button
            key="minimized-pill"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#331921]/95 border-2 border-[#AB526B]/40 dark:border-[#F0E2A4]/40 shadow-xl backdrop-blur-xl text-xs font-mono font-bold text-gray-800 dark:text-[#F4EBC3] hover:border-[#AB526B] transition-all group"
            title="Expand Quick Actions Card"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AB526B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#AB526B]"></span>
            </span>
            <Zap size={14} className="text-[#AB526B] group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">{title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#AB526B]/15 text-[#AB526B] dark:text-[#F0E2A4]">
              Expand ▾
            </span>
          </motion.button>
        ) : (
          /* ======================================================== */
          /* EXPANDED INTERACTIVE CORNER CARD                          */
          /* ======================================================== */
          <motion.div
            key="expanded-card"
            initial={{ scale: 0.9, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-[280px] sm:w-[320px] bg-white/95 dark:bg-[#331921]/95 backdrop-blur-2xl border-2 border-[#AB526B]/30 dark:border-[#F0E2A4]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col gap-2.5 p-3.5 text-xs text-gray-800 dark:text-[#F4EBC3]"
          >
            {/* Header: Title, Corner Switcher & Minimize Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-[#EBE0D3] dark:border-[#5C4E49]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#AB526B]/15 text-[#AB526B] dark:text-[#F0E2A4]">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h4 className="font-mono font-black text-xs text-gray-900 dark:text-[#F4EBC3] leading-none">
                    {title}
                  </h4>
                  <span className="text-[10px] text-gray-500 dark:text-[#BCA297] font-mono">
                    {subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Switch Corner button */}
                <button
                  onClick={toggleCorner}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#5C4E49] text-gray-400 hover:text-gray-700 dark:hover:text-[#F0E2A4] transition-colors"
                  title="Switch between left/right corner"
                >
                  <Move size={12} />
                </button>
                {/* Minimize button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#5C4E49] text-gray-400 hover:text-gray-700 dark:hover:text-[#F0E2A4] transition-colors"
                  title="Minimize to floating chip"
                >
                  <Minimize2 size={13} />
                </button>
              </div>
            </div>

            {/* 1. TARGET / SEARCH SECTION (if available) */}
            {targetInput && (
              <div className="flex flex-col gap-1 p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Target size={12} />
                  <span>{targetInput.label || "Target Search Value"}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type={targetInput.type || "text"}
                    value={targetInput.value}
                    onChange={(e) => targetInput.onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && targetInput.onSearch && targetInput.onSearch()}
                    placeholder={targetInput.placeholder || "Target..."}
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-xs font-mono font-bold text-gray-900 dark:text-[#F4EBC3] focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                  <button
                    onClick={targetInput.onSearch}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-mono font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all shrink-0"
                  >
                    <Search size={12} />
                    <span>Find</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. ADD / INSERT SECTION (if available) */}
            {addInput && (
              <div className="flex flex-col gap-1.5 p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <Plus size={12} />
                  <span>{addInput.label || "Insert Element"}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type={addInput.type || "text"}
                    value={addInput.value}
                    onChange={(e) => addInput.onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addInput.onAdd && addInput.onAdd()}
                    placeholder={addInput.placeholder || "Val"}
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-xs font-mono font-bold text-gray-900 dark:text-[#F4EBC3] focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                  {addInput.onPosChange && (
                    <input
                      type="number"
                      value={addInput.posValue}
                      onChange={(e) => addInput.onPosChange(e.target.value)}
                      placeholder="Pos"
                      title="Position Index"
                      className="w-12 px-1.5 py-1.5 rounded-xl bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-xs font-mono font-bold text-center text-gray-900 dark:text-[#F4EBC3] focus:outline-none focus:border-emerald-500"
                    />
                  )}
                  <button
                    onClick={addInput.onAdd}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all shrink-0"
                  >
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Optional Head / Tail shortcuts */}
                {(addInput.onAddHead || addInput.onAddTail) && (
                  <div className="flex items-center gap-1 pt-0.5">
                    {addInput.onAddHead && (
                      <button
                        onClick={addInput.onAddHead}
                        className="flex-1 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 transition-colors"
                      >
                        + Head
                      </button>
                    )}
                    {addInput.onAddTail && (
                      <button
                        onClick={addInput.onAddTail}
                        className="flex-1 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 transition-colors"
                      >
                        + Tail
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. REMOVE / DELETE SECTION (if available) */}
            {removeInput && (
              <div className="flex flex-col gap-1 p-2 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1">
                  <Trash2 size={12} />
                  <span>{removeInput.label || "Remove / Delete"}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {removeInput.onChange ? (
                    <input
                      type={removeInput.type || "text"}
                      value={removeInput.value}
                      onChange={(e) => removeInput.onChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && removeInput.onRemove && removeInput.onRemove()}
                      placeholder={removeInput.placeholder || "Pos / Val..."}
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-xs font-mono font-bold text-gray-900 dark:text-[#F4EBC3] focus:outline-none focus:border-rose-500 shadow-inner"
                    />
                  ) : (
                    <span className="flex-1 text-[11px] font-mono text-gray-500 dark:text-[#BCA297] italic">
                      {removeInput.hint || "Remove top/active element"}
                    </span>
                  )}
                  <button
                    onClick={removeInput.onRemove}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-mono font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all shrink-0"
                  >
                    <Trash2 size={12} />
                    <span>Del</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. GRAPH INPUTS (Start Node, Target Node, Topology) */}
            {graphInputs && (
              <div className="flex flex-col gap-2 p-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 font-mono">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1">
                  <Compass size={12} />
                  <span>Graph Node Input</span>
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase">
                      Start Node
                    </label>
                    <select
                      value={graphInputs.startNode}
                      onChange={(e) => graphInputs.setStartNode(e.target.value)}
                      className="w-full px-2 py-1 rounded-xl bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-xs font-bold text-gray-900 dark:text-[#F4EBC3] focus:outline-none focus:border-purple-500"
                    >
                      {(graphInputs.nodes || []).map(n => (
                        <option key={`start_${n.id || n}`} value={n.id || n}>Node {n.id || n}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <label className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase">
                      Target Node
                    </label>
                    <select
                      value={graphInputs.targetNode}
                      onChange={(e) => graphInputs.setTargetNode(e.target.value)}
                      className="w-full px-2 py-1 rounded-xl bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-xs font-bold text-gray-900 dark:text-[#F4EBC3] focus:outline-none focus:border-purple-500"
                    >
                      {(graphInputs.nodes || []).map(n => (
                        <option key={`target_${n.id || n}`} value={n.id || n}>Node {n.id || n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {graphInputs.onExecute && (
                  <button
                    onClick={graphInputs.onExecute}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Play size={12} />
                    <span>Run Graph Traversal</span>
                  </button>
                )}
              </div>
            )}

            {/* 5. CUSTOM ACTIONS / CHILDREN SLOT */}
            {customActions && (
              <div className="pt-1 flex items-center gap-1.5">
                {customActions}
              </div>
            )}

            {children && (
              <div className="pt-1">
                {children}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
