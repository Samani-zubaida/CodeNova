import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Terminal, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StackVisualizer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stack, setStack] = useState([10, 20, 30]);
  const [inputValue, setInputValue] = useState('');
  
  // Console Output State
  const [outputLines, setOutputLines] = useState(["> Stack Initialized"]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isPulsingAll, setIsPulsingAll] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const logOutput = (msg) => {
    setOutputLines(prev => [...prev, msg].slice(-8));
  };

  const handlePush = () => {
    if (!inputValue) return;
    setStack([...stack, Number(inputValue)]);
    logOutput(`> stack.push(${inputValue})`);
    logOutput(`  Pushed to top of stack.`);
    setInputValue('');
  };

  const handlePop = () => {
    if (stack.length === 0) {
      logOutput(`> stack.pop()`);
      logOutput(`  Error: Stack Underflow (Empty)`);
      return;
    }
    const val = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    logOutput(`> stack.pop()`);
    logOutput(`  Returned: ${val}`);
  };

  const handlePeek = async () => {
    if (stack.length === 0) {
      logOutput(`> stack.peek()`);
      logOutput(`  Returned: null (Empty)`);
      return;
    }
    const val = stack[stack.length - 1];
    logOutput(`> stack.peek()`);
    logOutput(`  Returned: ${val}`);
    
    setHighlightedIndex(stack.length - 1);
    setTimeout(() => setHighlightedIndex(null), 1000);
  };

  const handleIsEmpty = async () => {
    const empty = stack.length === 0;
    logOutput(`> stack.isEmpty()`);
    logOutput(`  Returned: ${empty}`);
    
    setIsPulsingAll(true);
    setTimeout(() => setIsPulsingAll(false), 1000);
  };

  const handleSize = async () => {
    logOutput(`> stack.size()`);
    logOutput(`  Returned: ${stack.length}`);
    
    setIsPulsingAll(true);
    setTimeout(() => setIsPulsingAll(false), 1000);
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">

      {/* Left Sidebar: Controls & Output */}
      <div className={`w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "ml-0" : "-ml-[100%] lg:-ml-[400px]"}`}>
        <div className="p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 h-full">
          
          {/* In-flow Back Button */}
          <Link to="/visualizer" className="text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-2 font-semibold w-fit bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-white/10">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-orange-500 tracking-tight mb-2">Stack</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">LIFO (Last In, First Out) data structure.</p>
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
                placeholder="Value to push"
              />
              <div className="flex gap-2">
                <button onClick={handlePush} className="flex-1 bg-orange-500 text-white py-1.5 rounded text-sm font-bold shadow-sm hover:brightness-110">Push</button>
                <button onClick={handlePop} className="flex-1 border border-orange-500 text-orange-500 py-1.5 rounded text-sm font-bold hover:bg-orange-500 hover:text-white">Pop</button>
              </div>
            </div>
          </div>

          {/* Built-in Methods */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Methods</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handlePeek} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10">peek()</button>
              <button onClick={handleSize} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10">size()</button>
              <button onClick={handleIsEmpty} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 col-span-2">isEmpty()</button>
            </div>
          </div>

          <div className="mt-auto pt-8"></div>
        </div>
      </div>

      {/* Right Canvas: Visualization & Console */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full flex flex-col relative overflow-hidden">
        {/* Sidebar Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-50 p-2 bg-white/80 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-white/10 rounded shadow-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" /> : <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />}
        </button>

        
        {/* Main Visualization Area */}
        <div className="flex-1 flex items-end justify-center p-8 lg:p-12 overflow-y-auto relative pb-12">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Container representing the physical stack bounds */}
          <div className="w-48 sm:w-64 border-x-4 border-b-4 border-orange-500/50 rounded-b-xl flex flex-col-reverse items-center justify-start p-4 min-h-[300px] bg-black/5 dark:bg-white/5 relative z-10">
            <AnimatePresence>
              {stack.map((val, idx) => (
                <motion.div 
                  key={`${idx}-${val}`}
                  layout
                  initial={{ opacity: 0, y: -100, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -100, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-full ${highlightedIndex === idx || isPulsingAll ? 'bg-orange-100 dark:bg-orange-900/40 shadow-[0_0_20px_rgba(249,115,22,0.4)] border-orange-400' : 'bg-white dark:bg-[#1a1a1a] border-orange-500'} border-2 text-black dark:text-white font-bold text-xl py-3 rounded mb-2 shadow-md flex items-center justify-between px-4 relative transition-colors duration-300`}
                >
                  <span className="text-xs text-gray-400 font-mono">[{idx}]</span>
                  <span>{val}</span>
                  {idx === stack.length - 1 && (
                    <span className="absolute -right-16 text-orange-500 text-sm font-mono font-bold animate-pulse">&larr; TOP</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {stack.length === 0 && (
              <div className="text-gray-400 font-mono italic h-full flex items-center text-sm absolute top-1/2 -translate-y-1/2">
                Stack is empty
              </div>
            )}
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
