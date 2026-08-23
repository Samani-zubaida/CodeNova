import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeapVisualizer() {
  const [heap, setHeap] = useState([10, 20, 30, 40, 50, 60, 70]);
  const [inputValue, setInputValue] = useState('');
  const [heapType, setHeapType] = useState('min'); // 'min' or 'max'
  
  // Console Output State
  const [outputLines, setOutputLines] = useState(["> Heap Initialized"]);
  const [isIterating, setIsIterating] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isPulsingAll, setIsPulsingAll] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const logOutput = (msg) => {
    setOutputLines(prev => [...prev, msg].slice(-8));
  };

  const handleToggleType = () => {
    setHeapType(prev => prev === 'min' ? 'max' : 'min');
    setHeap([]); // Clear heap when switching types to avoid logic mismatch, or we could re-heapify
    logOutput(`> Heap type changed to ${heapType === 'min' ? 'MAX' : 'MIN'} heap.`);
    logOutput(`  Heap cleared.`);
  };

  const bubbleUp = async (arr, idx) => {
    let current = idx;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      const shouldSwap = heapType === 'min' 
        ? arr[current] < arr[parent] 
        : arr[current] > arr[parent];

      if (shouldSwap) {
        let temp = arr[current];
        arr[current] = arr[parent];
        arr[parent] = temp;
        setHeap([...arr]);
        current = parent;
        await new Promise(r => setTimeout(r, 400));
      } else {
        break;
      }
    }
  };

  const bubbleDown = async (arr, idx) => {
    let current = idx;
    const len = arr.length;
    
    while (true) {
      let left = 2 * current + 1;
      let right = 2 * current + 2;
      let target = current;

      if (heapType === 'min') {
        if (left < len && arr[left] < arr[target]) target = left;
        if (right < len && arr[right] < arr[target]) target = right;
      } else {
        if (left < len && arr[left] > arr[target]) target = left;
        if (right < len && arr[right] > arr[target]) target = right;
      }

      if (target !== current) {
        let temp = arr[current];
        arr[current] = arr[target];
        arr[target] = temp;
        setHeap([...arr]);
        current = target;
        await new Promise(r => setTimeout(r, 400));
      } else {
        break;
      }
    }
  };

  const handleInsert = async () => {
    if (!inputValue || isIterating) return;
    setIsIterating(true);
    const val = Number(inputValue);
    logOutput(`> heap.insert(${val})`);
    
    const newHeap = [...heap, val];
    setHeap(newHeap);
    setInputValue('');
    
    await new Promise(r => setTimeout(r, 400));
    await bubbleUp(newHeap, newHeap.length - 1);
    
    logOutput(`  Inserted and bubbled up.`);
    setIsIterating(false);
  };

  const handleExtractRoot = async () => {
    if (heap.length === 0 || isIterating) {
      logOutput(`> heap.extract()`);
      logOutput(`  Error: Heap is empty`);
      return;
    }
    setIsIterating(true);
    logOutput(`> heap.extract()`);

    if (heap.length === 1) {
      const root = heap[0];
      setHeap([]);
      logOutput(`  Extracted root: ${root}`);
      setIsIterating(false);
      return;
    }

    const newHeap = [...heap];
    const root = newHeap[0];
    const lastNode = newHeap.pop(); // Remove last element
    newHeap[0] = lastNode; // Move last element to root
    setHeap([...newHeap]);
    
    logOutput(`  Extracted root: ${root}`);
    logOutput(`  Bubbling down...`);
    
    await new Promise(r => setTimeout(r, 600));
    await bubbleDown(newHeap, 0);

    logOutput(`  Heap property restored.`);
    setIsIterating(false);
  };

  const handlePeek = () => {
    if (heap.length === 0) {
      logOutput(`> heap.peek()`);
      logOutput(`  Returned: null`);
      return;
    }
    logOutput(`> heap.peek()`);
    logOutput(`  Returned: ${heap[0]}`);
    setHighlightedIndex(0);
    setTimeout(() => setHighlightedIndex(null), 1000);
  };

  const handleSize = () => {
    logOutput(`> heap.size()`);
    logOutput(`  Returned: ${heap.length}`);
    setIsPulsingAll(true);
    setTimeout(() => setIsPulsingAll(false), 1000);
  };

  // SVG dimensions for tree drawing
  const svgWidth = 800;
  const svgHeight = 400;
  
  const getNodePosition = (idx, totalLevels) => {
    const level = Math.floor(Math.log2(idx + 1));
    const posInLevel = idx - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    
    const y = 40 + level * 80;
    // Calculate x based on level spacing to avoid overlap
    const spacing = svgWidth / (nodesInLevel + 1);
    const x = spacing * (posInLevel + 1);
    
    return { x, y };
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">

      {/* Left Sidebar: Controls & Output */}
      <div className="w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto">
        <div className="p-4 lg:p-6 flex flex-col gap-6 h-full">
          
          {/* In-flow Back Button */}
          <Link to="/visualizer" className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2 font-semibold w-fit bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-white/10">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-yellow-500 tracking-tight mb-2">Priority Queue</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Heap-backed queue where elements are ordered by priority.</p>
          </div>

          <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-lg">
            <button 
              onClick={() => { if(!isIterating && heapType !== 'min') handleToggleType(); }} 
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${heapType === 'min' ? 'bg-yellow-500 text-white shadow-sm' : 'text-gray-500'}`}
            >
              MIN HEAP
            </button>
            <button 
              onClick={() => { if(!isIterating && heapType !== 'max') handleToggleType(); }} 
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${heapType === 'max' ? 'bg-yellow-500 text-white shadow-sm' : 'text-gray-500'}`}
            >
              MAX HEAP
            </button>
          </div>

          {/* Core Operations */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Modify</h3>
            
            <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/5">
              <input 
                type="number" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-3 py-1.5 text-sm w-full"
                placeholder="Value to Insert"
              />
              <button onClick={handleInsert} disabled={isIterating} className="bg-yellow-500 text-white py-1.5 rounded text-sm font-bold shadow-sm hover:brightness-110 disabled:opacity-50">Insert Node</button>
            </div>
            
            <button onClick={handleExtractRoot} disabled={isIterating} className="border border-yellow-500 text-yellow-600 dark:text-yellow-400 py-1.5 rounded text-sm font-bold hover:bg-yellow-500 hover:text-white disabled:opacity-50">
              Extract Root (Pop)
            </button>
          </div>

          {/* Built-in Methods */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Methods</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handlePeek} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">peek()</button>
              <button onClick={handleSize} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">size()</button>
            </div>
          </div>

          <div className="mt-auto pt-8"></div>
        </div>
      </div>

      {/* Right Canvas: Visualization & Console */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full flex flex-col relative overflow-hidden">
        
        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto overflow-x-auto relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Array Representation */}
          <div className="mb-8 w-full max-w-3xl border border-gray-200 dark:border-white/10 rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur p-4">
            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase">Underlying Array</h3>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              <AnimatePresence>
                {heap.map((val, idx) => (
                  <motion.div 
                    key={`${idx}-${val}`}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`w-10 h-10 ${highlightedIndex === idx || isPulsingAll ? 'bg-yellow-300 text-yellow-900 border-yellow-500 shadow-[0_0_15px_rgba(253,224,71,0.6)]' : 'bg-yellow-500 text-white border-yellow-600'} font-bold flex items-center justify-center rounded shadow-sm relative group cursor-default border transition-all duration-300`}
                  >
                    {val}
                    <div className="absolute -bottom-4 opacity-0 group-hover:opacity-100 text-[10px] text-gray-500 font-mono transition-opacity">
                      {idx}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {heap.length === 0 && <span className="text-sm text-gray-400 font-mono italic">Array is empty</span>}
            </div>
          </div>

          {/* SVG Tree Representation */}
          <div className="w-full max-w-4xl overflow-x-auto border border-gray-200 dark:border-white/10 rounded-xl bg-white/40 dark:bg-black/40 backdrop-blur">
            <div className="min-w-[800px] h-[400px] relative">
              <svg width="100%" height="100%" className="absolute inset-0 z-0">
                <AnimatePresence>
                  {heap.map((val, idx) => {
                    if (idx === 0) return null;
                    const parentIdx = Math.floor((idx - 1) / 2);
                    const totalLevels = Math.floor(Math.log2(heap.length)) + 1;
                    const pos = getNodePosition(idx, totalLevels);
                    const parentPos = getNodePosition(parentIdx, totalLevels);
                    
                    return (
                      <motion.line
                        key={`edge-${parentIdx}-${idx}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        x1={parentPos.x}
                        y1={parentPos.y}
                        x2={pos.x}
                        y2={pos.y}
                        stroke="var(--color-nova-brown)"
                        strokeWidth="2"
                        className="opacity-50"
                      />
                    );
                  })}
                </AnimatePresence>
              </svg>
              
              <div className="absolute inset-0 z-10 pointer-events-none">
                <AnimatePresence>
                  {heap.map((val, idx) => {
                    const totalLevels = Math.floor(Math.log2(heap.length)) + 1;
                    const pos = getNodePosition(idx, totalLevels);
                    return (
                      <motion.div
                        key={`node-${idx}-${val}`}
                        layout
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`absolute w-12 h-12 ${highlightedIndex === idx || isPulsingAll ? 'bg-yellow-200 border-yellow-400 text-yellow-900 scale-125 shadow-[0_0_20px_rgba(253,224,71,0.8)] z-20' : 'bg-yellow-400 border-yellow-600 text-black shadow-lg'} border-2 font-bold rounded-full flex items-center justify-center transition-all duration-300`}
                        style={{
                          left: pos.x - 24,
                          top: pos.y - 24
                        }}
                      >
                        {val}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
        </div>

        {/* Output Console Panel */}
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
