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
import { ArrowLeft, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { val: 10, label: '10' }, style: { background: 'var(--color-nova-red)', color: 'white', borderRadius: '8px', border: 'none', width: 60, textAlign: 'center', padding: '10px', fontWeight: 'bold' } },
];

const initialEdges = [];

export default function TreeGraphVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [nodeVal, setNodeVal] = useState('');
  const [targetVal, setTargetVal] = useState('10');
  const [targetNodeId, setTargetNodeId] = useState('1');
  const [direction, setDirection] = useState('left');
  
  const [outputLines, setOutputLines] = useState(["> Tree Initialized with Root (10)"]);
  const [isIterating, setIsIterating] = useState(false);
  const [isPulsingAll, setIsPulsingAll] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const logOutput = (msg) => {
    setOutputLines(prev => [...prev, msg].slice(-8));
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddNode = () => {
    if (!nodeVal || !targetVal) {
      logOutput(`> Error: Missing input values.`);
      return;
    }
    
    const parentNode = nodes.find(n => n.data.val === Number(targetVal));
    if (!parentNode) {
      logOutput(`> Error: Parent ${targetVal} not found.`);
      return;
    }

    const isOccupied = edges.some(e => e.source === parentNode.id && e.data?.direction === direction);
    if (isOccupied) {
      logOutput(`> Error: Parent ${targetVal} already has a ${direction} child.`);
      return;
    }

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
      data: { direction },
      animated: true,
      style: { stroke: 'var(--color-nova-brown)', strokeWidth: 2 }
    };

    setNodes([...nodes, newNode]);
    setEdges([...edges, newEdge]);
    setNodeVal('');
    logOutput(`> Added node ${nodeVal} as ${direction} child of ${targetVal}.`);
  };

  const handleClear = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    logOutput(`> Tree Reset to Root (10).`);
  };

  const getRoot = () => {
    const targets = new Set(edges.map(e => e.target));
    return nodes.find(n => !targets.has(n.id)) || nodes[0];
  };

  const getChildren = (nodeId) => {
    const outEdges = edges.filter(e => e.source === nodeId);
    const leftEdge = outEdges.find(e => e.data.direction === 'left');
    const rightEdge = outEdges.find(e => e.data.direction === 'right');
    return {
      left: leftEdge ? nodes.find(n => n.id === leftEdge.target) : null,
      right: rightEdge ? nodes.find(n => n.id === rightEdge.target) : null
    };
  };

  const highlightNode = async (nodeId, color) => {
    setNodes(nds => nds.map(n => {
      if (n.id === nodeId) {
        return { ...n, style: { ...n.style, background: color, color: 'white' } };
      }
      return n;
    }));
    await new Promise(r => setTimeout(r, 600));
  };

  const resetHighlight = () => {
    setNodes(nds => nds.map(n => ({
      ...n, 
      style: { ...n.style, background: n.id === '1' ? 'var(--color-nova-red)' : 'var(--color-nova-green)', color: n.id === '1' ? 'white' : 'black' }
    })));
  };

  const handleFind = async () => {
    if (isIterating) return;
    const target = prompt("Enter value to find:");
    if (!target) return;
    
    setIsIterating(true);
    resetHighlight();
    logOutput(`> tree.find(${target})`);
    
    let found = false;
    for (let i = 0; i < nodes.length; i++) {
      logOutput(`  Checking node ${nodes[i].data.val}...`);
      await highlightNode(nodes[i].id, 'orange');
      if (nodes[i].data.val === Number(target)) {
        logOutput(`  Found node ${target}!`);
        await highlightNode(nodes[i].id, '#3b82f6');
        found = true;
        break;
      }
    }
    
    if (!found) {
      logOutput(`  Returned: null (Not found)`);
      resetHighlight();
    }
    setIsIterating(false);
  };

  const handleBFS = async () => {
    if (isIterating || nodes.length === 0) return;
    setIsIterating(true);
    resetHighlight();
    logOutput(`> tree.bfs()`);
    
    const queue = [getRoot()];
    const result = [];
    
    while(queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      
      logOutput(`  Visiting: ${current.data.val}`);
      await highlightNode(current.id, 'orange');
      result.push(current.data.val);
      
      const { left, right } = getChildren(current.id);
      if (left) queue.push(left);
      if (right) queue.push(right);
    }
    
    logOutput(`  BFS Order: ${result.join(', ')}`);
    resetHighlight();
    setIsIterating(false);
  };

  const handleDFS = async () => {
    if (isIterating) return;
    setIsIterating(true);
    resetHighlight();
    logOutput(`> tree.dfs(preorder)`);

    const stack = [];
    const root = getRoot();
    if(root) stack.push(root.id);

    const visitedOrder = [];

    while(stack.length > 0) {
      const currentId = stack.pop();
      highlightNode(currentId, 'orange');
      logOutput(`  Visited ${currentId}`);
      visitedOrder.push(currentId);
      await new Promise(r => setTimeout(r, 600));
      highlightNode(currentId, 'green');

      const { left, right } = getChildren(currentId);
      if(right) stack.push(right.id);
      if(left) stack.push(left.id);
    }

    logOutput(`  DFS Traversal: [${visitedOrder.join(', ')}]`);
    setIsIterating(false);
  };

  const handleHeight = async () => {
    const calculateHeight = (nodeId) => {
      if (!nodeId) return 0;
      const { left, right } = getChildren(nodeId);
      const leftH = left ? calculateHeight(left.id) : 0;
      const rightH = right ? calculateHeight(right.id) : 0;
      return Math.max(leftH, rightH) + 1;
    };
    
    const root = getRoot();
    const h = calculateHeight(root.id);
    logOutput(`> tree.height()`);
    logOutput(`  Returned: ${h}`);
    
    setIsPulsingAll(true);
    setNodes(nds => nds.map(n => ({
      ...n, 
      style: { ...n.style, background: 'var(--color-nova-brown)', color: 'white' }
    })));
    setTimeout(() => {
      setIsPulsingAll(false);
      resetHighlight();
    }, 1500);
  };

  const handleInorderSuccessor = async () => {
    if (!targetNodeId || isIterating) return;
    
    const target = nodes.find(n => n.id === targetNodeId);
    if (!target) {
      logOutput(`> tree.inorderSuccessor(${targetNodeId})`);
      logOutput(`  Error: Node not found`);
      return;
    }

    setIsIterating(true);
    resetHighlight();
    logOutput(`> tree.inorderSuccessor(${targetNodeId})`);
    
    highlightNode(target.id, 'yellow');
    await new Promise(r => setTimeout(r, 600));

    let current = target.id;
    const { right } = getChildren(current);

    if (right) {
      logOutput(`  Node has right child, finding min in right subtree`);
      highlightNode(right.id, 'orange');
      await new Promise(r => setTimeout(r, 600));
      
      let succ = right.id;
      while (true) {
        const { left } = getChildren(succ);
        if (!left) break;
        logOutput(`  Checking left child ${left.id}...`);
        highlightNode(left.id, 'orange');
        await new Promise(r => setTimeout(r, 600));
        succ = left.id;
      }
      
      highlightNode(succ, 'green');
      logOutput(`  Successor: ${succ}`);
    } else {
      logOutput(`  No right child, finding deepest ancestor`);
      let succ = null;
      let ancestorId = getRoot().id;
      
      let tempPath = [];
      while (ancestorId !== target.id) {
        tempPath.push(ancestorId);
        const ancestor = nodes.find(n => n.id === ancestorId);
        if (Number(target.id) < Number(ancestorId)) {
          succ = ancestorId;
          ancestorId = getChildren(ancestorId).left?.id;
        } else {
          ancestorId = getChildren(ancestorId).right?.id;
        }
      }
      
      for(let a of tempPath) {
        highlightNode(a, 'orange');
        await new Promise(r => setTimeout(r, 400));
      }

      if (succ) {
        highlightNode(succ, 'green');
        logOutput(`  Successor: ${succ}`);
      } else {
        logOutput(`  No successor (node is max)`);
      }
    }
    
    setIsIterating(false);
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">
      <div className="w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto">
        <div className="p-4 lg:p-6 flex flex-col gap-6 h-full">
          <Link to="/visualizer" className="text-gray-500 hover:text-[var(--color-nova-red)] transition-colors flex items-center gap-2 font-semibold w-fit bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-white/10">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--color-nova-red)] tracking-tight mb-2">Binary Tree</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Hierarchical nodes with left and right child pointers.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Modify</h3>
            <div className="flex flex-col gap-3 bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/5">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-bold">Target Parent Node</label>
                <input 
                  type="number" 
                  value={targetVal}
                  onChange={(e) => setTargetVal(e.target.value)}
                  className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-3 py-1.5 text-sm w-full"
                  placeholder="e.g. 10"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-gray-500 font-bold">New Value</label>
                  <input 
                    type="number" 
                    value={nodeVal}
                    onChange={(e) => setNodeVal(e.target.value)}
                    className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-3 py-1.5 text-sm w-full"
                    placeholder="e.g. 5"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-gray-500 font-bold">Direction</label>
                  <select 
                    value={direction} 
                    onChange={(e) => setDirection(e.target.value)}
                    className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-3 py-1.5 text-sm w-full"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              <button onClick={handleAddNode} disabled={isIterating} className="bg-[var(--color-nova-brown)] text-white py-2 mt-1 rounded text-sm font-bold shadow-sm hover:brightness-110 disabled:opacity-50">Add Node</button>
            </div>
            <button onClick={handleClear} disabled={isIterating} className="border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 py-1.5 rounded text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50">Reset Tree</button>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Methods</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleHeight} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">height()</button>
              <button onClick={handleFind} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">find(val)</button>
            </div>
            <div className="flex gap-2 mt-2">
                <input type="text" placeholder="id" value={targetNodeId} onChange={e=>setTargetNodeId(e.target.value)} className="w-1/3 bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-2 py-1 text-xs" />
                <button onClick={handleInorderSuccessor} disabled={isIterating} className="w-2/3 border border-[var(--color-nova-brown)] text-[var(--color-nova-brown)] rounded text-[10px] sm:text-xs font-bold hover:bg-[var(--color-nova-brown)] hover:text-white disabled:opacity-50">Successor</button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={handleBFS} disabled={isIterating} className="border border-[var(--color-nova-brown)] text-[var(--color-nova-brown)] rounded text-[10px] sm:text-xs font-bold hover:bg-[var(--color-nova-brown)] hover:text-white disabled:opacity-50 py-1.5">bfs()</button>
              <button onClick={handleDFS} disabled={isIterating} className="border border-[var(--color-nova-brown)] text-[var(--color-nova-brown)] rounded text-[10px] sm:text-xs font-bold hover:bg-[var(--color-nova-brown)] hover:text-white disabled:opacity-50 py-1.5">dfs()</button>
            </div>
          </div>
          <div className="mt-auto pt-8"></div>
        </div>
      </div>
      <div className="w-full lg:flex-1 h-1/2 lg:h-full flex flex-col relative overflow-hidden">
        <div className="flex-1 w-full h-full relative overflow-hidden bg-gray-50/50 dark:bg-black/20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-lg" />
            <Background variant="dots" gap={16} size={1} color="rgba(150,150,150,0.2)" />
          </ReactFlow>
        </div>
        <div className={`w-full bg-[#0d1117] border-t border-white/10 flex flex-col shrink-0 font-mono shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 transition-all duration-300 ${isConsoleOpen ? 'h-48 lg:h-56' : 'h-10'}`}>
          <div 
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5 cursor-pointer hover:bg-[#1f2630] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400 font-bold tracking-wider">CONSOLE OUTPUT</span>
            </div>
            {isConsoleOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronUp size={14} className="text-gray-400" />}
          </div>
          <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-1 text-sm">
            <AnimatePresence initial={false}>
              {outputLines.map((line, i) => (
                <motion.div 
                  key={`${i}-${line}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${line.startsWith('>') ? 'text-[#7ee787]' : 'text-[#c9d1d9] ml-4 opacity-80'}`}
                >
                  {line}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
