import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Terminal, ChevronDown, ChevronUp, ArrowRight as ArrowRightIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import VisualizerNav from '../../components/layout/VisualizerNav';

export default function LinkedListVisualizer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [nodes, setNodes] = useState([10, 20, 30]);
  const [inputValue, setInputValue] = useState('');
  const [findValue, setFindValue] = useState('');
  const [isIterating, setIsIterating] = useState(false);
  const [foundIndex, setFoundIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [reversingIndex, setReversingIndex] = useState(-1);
  
  // Console Output State
  const [outputLines, setOutputLines] = useState(["> Linked List Initialized"]);
  const [isPulsingAll, setIsPulsingAll] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const logOutput = (msg) => {
    setOutputLines(prev => [...prev, msg].slice(-8));
  };

  const handleAppend = () => {
    if (!inputValue) return;
    setNodes([...nodes, Number(inputValue)]);
    logOutput(`> list.append(${inputValue})`);
    logOutput(`  Created new node, updated tail.`);
    setInputValue('');
  };

  const handlePrepend = () => {
    if (!inputValue) return;
    setNodes([Number(inputValue), ...nodes]);
    logOutput(`> list.prepend(${inputValue})`);
    logOutput(`  Created new node, updated head.`);
    setInputValue('');
  };

  const handleRemove = (indexToRemove) => {
    const val = nodes[indexToRemove];
    setNodes(nodes.filter((_, idx) => idx !== indexToRemove));
    logOutput(`> list.remove(${val})`);
    logOutput(`  Updated pointers to bypass node.`);
  };

  const handleSize = async () => {
    logOutput(`> list.size()`);
    logOutput(`  Returned: ${nodes.length}`);
    
    setIsPulsingAll(true);
    setTimeout(() => setIsPulsingAll(false), 1000);
  };

  const handleFind = async () => {
    if (!findValue || isIterating) return;
    setIsIterating(true);
    setFoundIndex(null);
    logOutput(`> list.find(${findValue})`);
    
    let found = false;
    for (let i = 0; i < nodes.length; i++) {
      setActiveIndex(i);
      await new Promise(r => setTimeout(r, 600));
      if (nodes[i] === Number(findValue)) {
        setFoundIndex(i);
        logOutput(`  Found at index ${i}`);
        found = true;
        break;
      }
    }
    if (!found) {
      logOutput(`  Returned -1 (Not found)`);
    }
    
    setTimeout(() => {
      setActiveIndex(null);
      setFoundIndex(null);
      setIsIterating(false);
    }, 2000);
  };

  const handleReverse = async () => {
    if (nodes.length <= 1 || isIterating) return;
    setIsIterating(true);
    logOutput(`> list.reverse()`);
    logOutput(`  Reversing pointers iteratively...`);
    
    // Simulate pointer flipping
    for (let i = 0; i < nodes.length; i++) {
      setActiveIndex(i);
      setReversingIndex(i);
      logOutput(`  curr.next = prev (at node ${nodes[i]})`);
      await new Promise(r => setTimeout(r, 800));
    }
    
    logOutput(`  Rearranging view for standard left-to-right display...`);
    await new Promise(r => setTimeout(r, 600));
    
    // Once pointers are "flipped", we physically reverse the array to restore the left-to-right view
    const reversed = [...nodes].reverse();
    setNodes(reversed);
    
    setReversingIndex(-1);
    setActiveIndex(null);
    setIsIterating(false);
    logOutput(`  List successfully reversed.`);
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">

      {/* Left Sidebar: Controls & Output */}
      <div className={`w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "ml-0" : "-ml-[100%] lg:-ml-[400px]"}`}>
        <div className="p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 h-full">
          
          {/* In-flow Back Button */}
          <VisualizerNav currentPath="/visualizer/linkedlist" />

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-teal-500 tracking-tight mb-2">Linked List</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Nodes connected by pointers, scattered in memory.</p>
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
                placeholder="Value (e.g. 42)"
              />
              <div className="flex gap-2">
                <button onClick={handlePrepend} className="flex-1 bg-teal-600 text-white py-1.5 rounded text-sm font-bold shadow-sm hover:brightness-110">Prepend</button>
                <button onClick={handleAppend} className="flex-1 border border-teal-500 text-teal-600 dark:text-teal-400 py-1.5 rounded text-sm font-bold hover:bg-teal-600 hover:text-white">Append</button>
              </div>
              <div className="flex gap-2 mt-2">
                <input type="number" placeholder="value" value={findValue} onChange={e=>setFindValue(e.target.value)} className="w-1/2 bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-2 py-1 text-xs" />
                <button onClick={handleFind} disabled={isIterating} className="w-1/2 border border-teal-500 text-teal-500 rounded text-xs font-bold hover:bg-teal-500 hover:text-white disabled:opacity-50 transition-colors">find(val)</button>
              </div>
              <button onClick={handleReverse} disabled={isIterating} className="mt-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-1.5 rounded text-sm font-bold shadow-sm hover:brightness-110 disabled:opacity-50 transition-all">reverse()</button>
            </div>
            <p className="text-xs text-gray-500 italic px-1">Tip: Click on any node in the visualizer to delete it!</p>
          </div>

          {/* Built-in Methods */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Methods</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleSize} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10">size()</button>
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
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-x-auto relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center p-4">
            {reversingIndex !== -1 && nodes.length > 0 && (
              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-mono font-bold mr-2 md:mr-4"
              >
                NULL <ArrowLeft size={24} />
              </motion.div>
            )}

            <AnimatePresence>
              {nodes.map((val, idx) => (
                <React.Fragment key={`${idx}-${val}`}>
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0, y: -50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 50 }}
                    whileHover={{ scale: 1.1, cursor: 'pointer' }}
                    onClick={() => handleRemove(idx)}
                    className={`flex flex-col items-center group relative z-10 transition-all duration-300 ${isPulsingAll || activeIndex === idx ? 'scale-110 drop-shadow-[0_0_15px_rgba(20,184,166,0.6)]' : ''}`}
                  >
                    <div className={`flex border-2 ${isPulsingAll || activeIndex === idx ? 'border-teal-400' : 'border-teal-500'} rounded-lg overflow-hidden shadow-lg bg-white dark:bg-[#1a1a1a] ${foundIndex === idx ? 'ring-2 ring-yellow-400' : ''}`}>
                      <div className={`px-4 md:px-6 py-3 md:py-4 border-r-2 ${isPulsingAll || activeIndex === idx ? 'border-teal-400 bg-teal-100 dark:bg-teal-900/40' : 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'} text-black dark:text-white font-bold text-lg md:text-2xl flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors`}>
                        {val}
                      </div>
                      <div className="px-2 md:px-3 py-3 md:py-4 bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center font-bold text-sm">
                        *next
                      </div>
                    </div>
                    {idx === (reversingIndex !== -1 ? nodes.length - 1 : 0) && <span className="absolute -top-6 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest font-mono">Head</span>}
                    {idx === (reversingIndex !== -1 ? 0 : nodes.length - 1) && <span className="absolute -bottom-6 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest font-mono">Tail</span>}
                  </motion.div>
                  
                  {idx < nodes.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-teal-500"
                    >
                      {idx < reversingIndex ? (
                        <ArrowLeft size={24} className="md:w-8 md:h-8" />
                      ) : (
                        <ArrowRightIcon size={24} className="md:w-8 md:h-8" />
                      )}
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
            
            {reversingIndex === -1 && nodes.length > 0 && (
              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-mono font-bold ml-2 md:ml-4"
              >
                <ArrowRightIcon size={24} /> NULL
              </motion.div>
            )}

            {nodes.length === 0 && (
              <div className="text-gray-400 font-mono italic">List is empty (Head is NULL)</div>
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
