import React from 'react';
import { ChevronDown, Play, RotateCcw } from 'lucide-react';
import { GRAPH_CATALOG } from '../../GraphHub';
import { PRESET_TOPOLOGIES } from '../constants/graphTopologies';

export default function GraphControlsPanel({
  currentAlgo,
  onSelectAlgo,
  selectedTopologyKey,
  onSelectTopology,
  startNode,
  setStartNode,
  targetNode,
  setTargetNode,
  nodes = [],
  onExecute,
  onReset
}) {
  return (
    <div className="flex flex-col gap-3.5">
      {/* Algorithm Model Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Select Algorithm Model
        </label>
        <div className="relative">
          <select
            value={currentAlgo.id}
            onChange={(e) => onSelectAlgo(e.target.value)}
            className="w-full appearance-none bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#AB526B] cursor-pointer"
          >
            {GRAPH_CATALOG.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.tag})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* Topology Preset Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Network Topology Preset
        </label>
        <div className="relative">
          <select
            value={selectedTopologyKey}
            onChange={(e) => onSelectTopology(e.target.value)}
            className="w-full appearance-none bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#AB526B] cursor-pointer"
          >
            {Object.entries(PRESET_TOPOLOGIES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* Start & Goal Node Selectors */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Start Vertex</label>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            className="bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            {nodes.map(n => <option key={n.id} value={n.id}>Node {n.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Target Goal</label>
          <select
            value={targetNode}
            onChange={(e) => setTargetNode(e.target.value)}
            className="bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            {nodes.map(n => <option key={n.id} value={n.id}>Node {n.label}</option>)}
          </select>
        </div>
      </div>

      {/* Action Trigger Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onExecute}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#AB526B] hover:bg-[#A33D46] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Play size={14} fill="currentColor" />
          <span>Simulate {currentAlgo.name.split(' ')[0]}</span>
        </button>
        <button
          onClick={onReset}
          title="Reset Visualizer"
          className="p-2.5 bg-gray-100 dark:bg-[#202020] border border-gray-200 dark:border-[#5C4E49] rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
