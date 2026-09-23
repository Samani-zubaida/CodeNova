import React from 'react';
import {
  Activity, Search, Plus, Play, Target, Layers,
  RefreshCw, CheckCircle2, Cpu, Shuffle
} from 'lucide-react';

export default function TreeControlsPanel({
  currentAlgo,
  allNodes = [],
  searchVal,
  setSearchVal,
  handleSearch,
  newNodeVal,
  setNewNodeVal,
  handleBSTInsert,
  handleAVLInsert,
  handleTraversal,
  lcaP,
  setLcaP,
  lcaQ,
  setLcaQ,
  handleLCA,
  handleMaxDepth,
  handleInvertTree,
  handleValidateBST,
  handleDiameter,
  segRangeL,
  setSegRangeL,
  segRangeR,
  setSegRangeR,
  handleSegmentTree,
  selectedParentVal,
  setSelectedParentVal,
  childSide,
  setChildSide,
  handleAddByParent,
  loadPreset
}) {
  return (
    <div className="flex flex-col gap-3.5 p-1 text-xs">
      {/* Algorithm Specific Trigger Buttons */}
      <div className="bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4] flex items-center gap-1.5">
            <Activity size={13} className="text-[#AB526B]" />
            {currentAlgo.name} Controls
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            {allNodes.length} nodes
          </span>
        </div>

        {currentAlgo.id === 'bst' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search Val"
                className="flex-1 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-[#AB526B]"
              />
              <button
                onClick={() => handleSearch()}
                className="px-3 py-1.5 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <Search size={12} /> Search
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newNodeVal}
                onChange={(e) => setNewNodeVal(e.target.value)}
                placeholder="Insert Val"
                className="flex-1 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-[#AB526B]"
              />
              <button
                onClick={() => handleBSTInsert()}
                className="px-3 py-1.5 rounded-xl bg-[#C5CEAE] hover:bg-[#B8C29D] text-[#2D1F23] font-bold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <Plus size={12} /> Insert
              </button>
            </div>
          </div>
        )}

        {currentAlgo.id === 'avl' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newNodeVal}
                onChange={(e) => setNewNodeVal(e.target.value)}
                placeholder="AVL Value"
                className="flex-1 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-[#AB526B]"
              />
              <button
                onClick={() => handleAVLInsert()}
                className="px-3 py-1.5 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <Plus size={12} /> AVL Insert
              </button>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-[#BCA297] leading-relaxed">
              Maintains strict height balance via LL, RR, LR, and RL rotations.
            </p>
          </div>
        )}

        {['inorder', 'preorder', 'postorder', 'levelorder'].includes(currentAlgo.id) && (
          <button
            onClick={() => handleTraversal(currentAlgo.id)}
            className="w-full py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Play size={13} fill="currentColor" /> Run {currentAlgo.name}
          </button>
        )}

        {currentAlgo.id === 'lca' && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Node P:</label>
                <input
                  type="number"
                  value={lcaP}
                  onChange={(e) => setLcaP(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Node Q:</label>
                <input
                  type="number"
                  value={lcaQ}
                  onChange={(e) => setLcaQ(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1 text-xs font-mono"
                />
              </div>
            </div>
            <button
              onClick={() => handleLCA()}
              className="w-full py-1.5 px-2 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              <Target size={13} /> Find Lowest Common Ancestor
            </button>
          </div>
        )}

        {currentAlgo.id === 'max_depth' && (
          <button
            onClick={handleMaxDepth}
            className="w-full py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Layers size={13} /> Calculate Tree Depth / Height
          </button>
        )}

        {currentAlgo.id === 'invert_tree' && (
          <button
            onClick={handleInvertTree}
            className="w-full py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={13} /> Invert / Mirror Tree
          </button>
        )}

        {currentAlgo.id === 'validate_bst' && (
          <button
            onClick={handleValidateBST}
            className="w-full py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 size={13} /> Validate BST Invariant
          </button>
        )}

        {currentAlgo.id === 'diameter' && (
          <button
            onClick={handleDiameter}
            className="w-full py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Activity size={13} /> Calculate Diameter
          </button>
        )}

        {currentAlgo.id === 'segment_tree' && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Left L:</label>
                <input
                  type="number"
                  value={segRangeL}
                  onChange={(e) => setSegRangeL(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Right R:</label>
                <input
                  type="number"
                  value={segRangeR}
                  onChange={(e) => setSegRangeR(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1 text-xs font-mono"
                />
              </div>
            </div>
            <button
              onClick={handleSegmentTree}
              className="w-full py-1.5 px-2 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              <Cpu size={13} /> Query Range Sum [L..R]
            </button>
          </div>
        )}
      </div>

      {/* Quick Node Operations */}
      <div className="bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3 shadow-sm flex flex-col gap-2">
        <span className="font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-[#F4EBC3] flex items-center gap-1">
          <Plus size={13} className="text-[#AB526B]" />
          Add Node by Parent
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Parent Node:</label>
            <select
              value={selectedParentVal}
              onChange={(e) => setSelectedParentVal(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2 py-1 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3]"
            >
              {allNodes.map(n => (
                <option key={n.id} value={n.val}>Node [{n.val}]</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Branch:</label>
            <div className="flex rounded-xl overflow-hidden border border-[#EBE0D3] dark:border-[#5C4E49]">
              <button
                type="button"
                onClick={() => setChildSide('left')}
                className={`flex-1 py-1 text-[11px] font-bold ${childSide === 'left' ? 'bg-[#AB526B] text-white' : 'bg-gray-50 dark:bg-[#423834] text-gray-600 dark:text-[#BCA297]'}`}
              >
                Left
              </button>
              <button
                type="button"
                onClick={() => setChildSide('right')}
                className={`flex-1 py-1 text-[11px] font-bold ${childSide === 'right' ? 'bg-[#AB526B] text-white' : 'bg-gray-50 dark:bg-[#423834] text-gray-600 dark:text-[#BCA297]'}`}
              >
                Right
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            value={newNodeVal}
            onChange={(e) => setNewNodeVal(e.target.value)}
            placeholder="Val"
            className="w-20 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2 py-1 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3]"
          />
          <button
            onClick={() => handleAddByParent()}
            className="flex-1 py-1.5 px-3 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            <Plus size={12} /> Add {childSide.toUpperCase()} Child
          </button>
        </div>
      </div>

      {/* Tree Presets */}
      <div className="bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3 shadow-sm flex flex-col gap-2">
        <span className="font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-[#F4EBC3] flex items-center gap-1">
          <Shuffle size={13} className="text-[#F0E2A4]" />
          Tree Presets
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => loadPreset('balanced7')}
            className="py-1 px-1.5 rounded-lg bg-gray-50 dark:bg-[#423834] hover:bg-gray-100 border border-[#EBE0D3] dark:border-[#5C4E49] text-[10px] text-gray-700 dark:text-[#F4EBC3] font-bold text-center"
          >
            Balanced 7
          </button>
          <button
            onClick={() => loadPreset('full15')}
            className="py-1 px-1.5 rounded-lg bg-gray-50 dark:bg-[#423834] hover:bg-gray-100 border border-[#EBE0D3] dark:border-[#5C4E49] text-[10px] text-gray-700 dark:text-[#F4EBC3] font-bold text-center"
          >
            Full 15
          </button>
          <button
            onClick={() => loadPreset('random')}
            className="py-1 px-1.5 rounded-lg bg-gray-50 dark:bg-[#423834] hover:bg-gray-100 border border-[#EBE0D3] dark:border-[#5C4E49] text-[10px] text-gray-700 dark:text-[#F4EBC3] font-bold text-center"
          >
            Random
          </button>
        </div>
      </div>
    </div>
  );
}
