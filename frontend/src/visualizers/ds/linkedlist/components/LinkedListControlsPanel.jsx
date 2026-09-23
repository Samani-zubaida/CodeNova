import React from 'react';
import { Layers, Shuffle, Plus, Trash2, Search, Target } from 'lucide-react';

export default function LinkedListControlsPanel({
  customListInput,
  setCustomListInput,
  handleApplyCustomList,
  handleRandomizeList,
  currentAlgoId,
  cycleIndex,
  setCycleIndex,
  handleToggleCycle,
  hasCycle,
  nthParam,
  setNthParam,
  handleLoadPalindrome,
  deleteTarget,
  setDeleteTarget,
  handleDeleteTargetVal,
  handleLruOp,
  goalNodeVal,
  setGoalNodeVal,
  handleSearchGoalNode,
  nodeValToAdd,
  setNodeValToAdd,
  nodePositionToAdd,
  setNodePositionToAdd,
  handleInsertAtPosition,
  handleInsertHead,
  handleInsertTail,
  positionToDelete,
  setPositionToDelete,
  handleDeleteAtPosition,
  nodeList
}) {
  return (
        <div className="flex flex-col gap-3 w-full">
          {/* 1. FLEXIBLE DATA & PRESETS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#423834]/80 rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-md">
            {/* Custom List Input */}
            <div className="flex items-center gap-2 flex-1 min-w-[260px]">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> List:
              </span>
              <input
                type="text"
                value={customListInput}
                onChange={(e) => setCustomListInput(e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                placeholder="10, 20, 30, 40, 50"
              />
              <button
                onClick={handleApplyCustomList}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
              >
                Apply
              </button>
              <button
                onClick={handleRandomizeList}
                className="px-2.5 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4] rounded-lg text-xs font-mono flex items-center gap-1 transition-all active:scale-95"
                title="Generate clean random list"
              >
                <Shuffle className="w-3.5 h-3.5" /> Random
              </button>
            </div>

            {/* Quick Algorithm-Specific Adjusters */}
            <div className="flex flex-wrap items-center gap-2">
              {currentAlgoId === 'floyd_cycle' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-purple-400 font-bold">Loop:</span>
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, nodeList.length - 1)}
                    value={cycleIndex}
                    onChange={(e) => setCycleIndex(parseInt(e.target.value) || 0)}
                    className="w-12 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-purple-300"
                  />
                  <button
                    onClick={handleToggleCycle}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      hasCycle 
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
                        : 'bg-gray-100 dark:bg-[#5C4E49] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-500 dark:text-[#BCA297]'
                    }`}
                  >
                    Cycle: {hasCycle ? 'ON' : 'OFF'}
                  </button>
                </div>
              )}

              {currentAlgoId === 'remove_nth' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-indigo-400 font-bold">N from end:</span>
                  <input
                    type="number"
                    min="1"
                    max={nodeList.length}
                    value={nthParam}
                    onChange={(e) => setNthParam(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-indigo-300"
                  />
                </div>
              )}

              {currentAlgoId === 'palindrome' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLoadPalindrome(true)}
                    className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-mono font-bold"
                  >
                    1,2,3,2,1
                  </button>
                  <button
                    onClick={() => handleLoadPalindrome(false)}
                    className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono font-bold"
                  >
                    1,2,3,4,5
                  </button>
                </div>
              )}

              {currentAlgoId === 'delete_val' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-rose-400 font-bold">Target Val:</span>
                  <input
                    type="number"
                    value={deleteTarget}
                    onChange={(e) => setDeleteTarget(e.target.value)}
                    className="w-14 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-rose-300"
                  />
                  <button
                    onClick={handleDeleteTargetVal}
                    className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono font-bold"
                  >
                    Delete Val
                  </button>
                </div>
              )}

              {currentAlgoId === 'lru_cache' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLruOp('put', 'A', 100)}
                    className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono"
                  >
                    PUT(A)
                  </button>
                  <button
                    onClick={() => handleLruOp('get', 'A')}
                    className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-emerald-300 rounded-lg text-xs font-mono"
                  >
                    GET(A)
                  </button>
                  <button
                    onClick={() => handleLruOp('put', 'X', 999)}
                    className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-purple-300 rounded-lg text-xs font-mono"
                  >
                    PUT(X)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. NODE MANIPULATION BAR (Add, Delete, Search) */}
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#423834]/80 rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-md">
            {/* Search Goal Node */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Goal:
              </span>
              <input
                type="number"
                value={goalNodeVal}
                onChange={(e) => setGoalNodeVal(e.target.value)}
                className="w-16 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2.5 py-1 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                placeholder="40"
              />
              <button
                onClick={handleSearchGoalNode}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all active:scale-95"
              >
                <Search className="w-3.5 h-3.5" /> Find
              </button>
            </div>

            {/* Add Node */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add:
              </span>
              <input
                type="number"
                value={nodeValToAdd}
                onChange={(e) => setNodeValToAdd(e.target.value)}
                className="w-14 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                placeholder="Val"
              />
              <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297]">at:</span>
              <input
                type="number"
                min="0"
                max={nodeList.length}
                value={nodePositionToAdd}
                onChange={(e) => setNodePositionToAdd(e.target.value)}
                className="w-12 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-cyan-500"
                placeholder="Pos"
              />
              <button
                onClick={handleInsertAtPosition}
                className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500 text-cyan-200 rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
              >
                Insert
              </button>
              <button
                onClick={handleInsertHead}
                className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg text-xs font-mono text-[#2D1F23] dark:text-[#F0E2A4]"
              >
                Head
              </button>
              <button
                onClick={handleInsertTail}
                className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg text-xs font-mono text-[#2D1F23] dark:text-[#F0E2A4]"
              >
                Tail
              </button>
            </div>

            {/* Delete at Position */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Del Pos:
              </span>
              <input
                type="number"
                min="0"
                max={Math.max(0, nodeList.length - 1)}
                value={positionToDelete}
                onChange={(e) => setPositionToDelete(e.target.value)}
                className="w-12 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={handleDeleteAtPosition}
                className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
  );
}
