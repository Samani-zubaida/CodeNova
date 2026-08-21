import React, { useCallback } from 'react';
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
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Root (10)' }, style: { background: 'var(--color-nova-red)', color: 'white', borderRadius: '8px', border: 'none', width: 100, textAlign: 'center', padding: '10px' } },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'Left (5)' }, style: { background: 'var(--color-nova-brown)', color: 'white', borderRadius: '8px', border: 'none', width: 100, textAlign: 'center', padding: '10px' } },
  { id: '3', position: { x: 400, y: 150 }, data: { label: 'Right (15)' }, style: { background: 'var(--color-nova-brown)', color: 'white', borderRadius: '8px', border: 'none', width: 100, textAlign: 'center', padding: '10px' } },
  { id: '4', position: { x: 50, y: 250 }, data: { label: 'Leaf (2)' }, style: { background: 'var(--color-nova-green)', color: 'black', borderRadius: '8px', border: 'none', width: 100, textAlign: 'center', padding: '10px' } },
  { id: '5', position: { x: 150, y: 250 }, data: { label: 'Leaf (7)' }, style: { background: 'var(--color-nova-green)', color: 'black', borderRadius: '8px', border: 'none', width: 100, textAlign: 'center', padding: '10px' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'var(--color-nova-red)' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: 'var(--color-nova-red)' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: 'var(--color-nova-brown)' } },
  { id: 'e2-5', source: '2', target: '5', animated: true, style: { stroke: 'var(--color-nova-brown)' } },
];

export default function DataStructureVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
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
  );
}
