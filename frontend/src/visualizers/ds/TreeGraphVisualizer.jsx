import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { val: 10, label: '10' }, style: { background: 'var(--color-nova-red)', color: 'white', borderRadius: '8px', border: 'none', width: 60, textAlign: 'center', padding: '10px', fontWeight: 'bold' } },
];

const initialEdges = [];

export default function TreeGraphVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [nodeVal, setNodeVal] = useState('');
  const [targetVal, setTargetVal] = useState('10');
  const [direction, setDirection] = useState('left');
  const [error, setError] = useState('');

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddNode = () => {
    setError('');
    if (!nodeVal || !targetVal) return setError('Please provide both values.');
    
    const parentNode = nodes.find(n => n.data.val === Number(targetVal));
    if (!parentNode) return setError(`Parent node with value ${targetVal} not found.`);

    // Check if direction is already occupied by looking at edges
    const isOccupied = edges.some(e => e.source === parentNode.id && e.sourceHandle === direction);
    if (isOccupied) return setError(`Parent ${targetVal} already has a ${direction} child.`);

    const newNodeId = `node_${Date.now()}`;
    const xOffset = direction === 'left' ? -100 : 100;
    
    const newNode = {
      id: newNodeId,
      position: { x: parentNode.position.x + xOffset, y: parentNode.position.y + 100 },
      data: { val: Number(nodeVal), label: String(nodeVal) },
      style: { background: 'var(--color-nova-green)', color: 'black', borderRadius: '8px', border: 'none', width: 60, textAlign: 'center', padding: '10px', fontWeight: 'bold' }
    };

    const newEdge = {
      id: `e_${parentNode.id}-${newNodeId}`,
      source: parentNode.id,
      target: newNodeId,
      sourceHandle: direction,
      animated: true,
      style: { stroke: 'var(--color-nova-brown)' }
    };

    setNodes([...nodes, newNode]);
    setEdges([...edges, newEdge]);
    setNodeVal('');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Control Panel */}
      <div className="flex flex-wrap gap-4 items-end bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-bold">Value to Add</label>
          <input 
            type="number" 
            value={nodeVal}
            onChange={(e) => setNodeVal(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded px-3 py-1 w-24"
            placeholder="e.g. 5"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-bold">Target Parent Value</label>
          <input 
            type="number" 
            value={targetVal}
            onChange={(e) => setTargetVal(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded px-3 py-1 w-24"
            placeholder="e.g. 10"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-bold">Direction</label>
          <select 
            value={direction} 
            onChange={(e) => setDirection(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded px-3 py-1 w-24"
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <button onClick={handleAddNode} className="bg-[var(--color-nova-brown)] text-white px-4 py-1 rounded font-bold hover:scale-105 transition-transform h-8">
          Add Node
        </button>
        {error && <span className="text-red-500 text-sm font-semibold ml-4">{error}</span>}
      </div>

      <div className="w-full h-[500px] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-black/50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap nodeStrokeColor={(n) => {
            if (n.style?.background === 'var(--color-nova-red)') return '#AB526B';
            if (n.style?.background === 'var(--color-nova-brown)') return '#BCA297';
            return '#C5CEAE';
          }} nodeColor={(n) => {
            if (n.style?.background === 'var(--color-nova-red)') return '#AB526B';
            if (n.style?.background === 'var(--color-nova-brown)') return '#BCA297';
            return '#C5CEAE';
          }} />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
