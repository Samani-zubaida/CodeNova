import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ArrayVisualizer() {
  const [array, setArray] = useState([10, 25, 33]);
  const [inputValue, setInputValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [animatingIndex, setAnimatingIndex] = useState(null);
  
  // Console Output State
  const [outputLines, setOutputLines] = useState(["> Array Initialized"]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [isPulsingAll, setIsPulsingAll] = useState(false);
  const [isIterating, setIsIterating] = useState(false);

  const logOutput = (msg) => {
    setOutputLines(prev => [...prev, msg].slice(-8)); // Keep last 8 lines
  };

  const handlePush = () => {
    if (!inputValue) return;
    setArray([...array, Number(inputValue)]);
    logOutput(`> array.push(${inputValue})`);
    logOutput(`  Returned: ${array.length + 1}`);
    setInputValue('');
  };

  const handlePop = () => {
    if (array.length === 0) {
      logOutput(`> array.pop()`);
      logOutput(`  Returned: undefined`);
      return;
    }
    const val = array[array.length - 1];
    setArray(array.slice(0, -1));
    logOutput(`> array.pop()`);
    logOutput(`  Returned: ${val}`);
  };

  const handleInsert = () => {
    if (!inputValue || !insertIndex) return;
    const idx = Number(insertIndex);
    if (idx < 0 || idx > array.length) {
      logOutput(`> Invalid index: ${idx}`);
      return;
    }
    const newArray = [...array];
    newArray.splice(idx, 0, Number(inputValue));
    setArray(newArray);
    logOutput(`> array.splice(${idx}, 0, ${inputValue})`);
    logOutput(`  Inserted at index ${idx}`);
    setInputValue('');
    setInsertIndex('');
  };

  const handleLength = async () => {
    if (isIterating) return;
    logOutput(`> array.length`);
    logOutput(`  Returned: ${array.length}`);
    
    setIsPulsingAll(true);
    setTimeout(() => setIsPulsingAll(false), 1000);
  };

  const handleReverse = () => {
    const reversed = [...array].reverse();
    setArray(reversed);
    logOutput(`> array.reverse()`);
    logOutput(`  Array reversed in place.`);
  };

  const handleSort = async () => {
    if (isIterating) return;
    setIsIterating(true);
    logOutput(`> array.sort((a,b) => a-b)`);
    
    // Simple visual bubble sort for effect
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          setActiveIndex(j + 1);
          await new Promise(r => setTimeout(r, 400));
        }
      }
    }
    setActiveIndex(null);
    logOutput(`  Returned: Sorted Array`);
    setIsIterating(false);
  };

  const handleIterate = async () => {
    if (isIterating) return;
    setIsIterating(true);
    logOutput(`> Iterating array...`);
    for (let i = 0; i < array.length; i++) {
      setActiveIndex(i);
      logOutput(`  array[${i}] = ${array[i]}`);
      await new Promise(r => setTimeout(r, 600));
    }
    setActiveIndex(null);
    setIsIterating(false);
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">

      {/* Left Sidebar: Controls & Output */}
      <div className="w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto">
        <div className="p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 h-full">
          
          {/* In-flow Back Button */}
          <Link to="/visualizer" className="text-gray-500 hover:text-[var(--color-nova-red)] transition-colors flex items-center gap-2 font-semibold w-fit bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-white/10">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--color-nova-red)] tracking-tight mb-2">Array</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Contiguous memory structure supporting O(1) random access.</p>
          </div>

          {/* Core Operations */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Modify</h3>
            
            <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/5">
              <input 
                type="number" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-3 py-1.5 text-sm"
                placeholder="Value (e.g. 42)"
              />
              <div className="flex gap-2">
                <button onClick={handlePush} disabled={isIterating} className="flex-1 bg-[var(--color-nova-red)] text-white py-1.5 rounded text-sm font-bold shadow-sm hover:brightness-110 disabled:opacity-50">Push</button>
                <button onClick={handlePop} disabled={isIterating} className="flex-1 border border-[var(--color-nova-red)] text-[var(--color-nova-red)] py-1.5 rounded text-sm font-bold hover:bg-[var(--color-nova-red)] hover:text-white disabled:opacity-50">Pop</button>
              </div>
            </div>

            <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/5">
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={insertIndex}
                  onChange={(e) => setInsertIndex(e.target.value)}
                  className="w-1/2 bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-3 py-1.5 text-sm"
                  placeholder="Index"
                />
                <button onClick={handleInsert} disabled={isIterating} className="w-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-black py-1.5 rounded text-sm font-bold shadow-sm disabled:opacity-50">Insert</button>
              </div>
            </div>
          </div>

          {/* Built-in Methods */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Methods</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleLength} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">length</button>
              <button onClick={handleReverse} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">reverse()</button>
              <button onClick={handleSort} disabled={isIterating} className="bg-[var(--color-nova-brown)] text-white py-2 rounded text-sm font-bold shadow-sm hover:brightness-110 col-span-2 disabled:opacity-50">sort()</button>
            </div>
            <button onClick={handleIterate} disabled={isIterating} className="bg-[var(--color-nova-green)] text-black py-2 rounded text-sm font-bold shadow-sm hover:brightness-110 disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
              Iterate Array (for loop)
            </button>
          </div>

          <div className="mt-auto pt-8"></div>
        </div>
      </div>

      {/* Right Canvas: Visualization & Console */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full flex flex-col relative overflow-hidden">
        
        {/* Main Visualization Area */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-x-auto relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-nova-red)] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex gap-2 lg:gap-4 p-8 min-w-max">
            <AnimatePresence>
              {array.map((val, idx) => (
                <motion.div 
                  key={`${idx}-${val}`}
                  layout
                  initial={{ opacity: 0, scale: 0.5, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  whileHover={!isIterating ? { scale: 1.05, y: -5, cursor: 'pointer' } : {}}
                  className="flex flex-col items-center group relative z-10"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-xl shadow-lg relative overflow-hidden transition-all duration-300
                    ${isPulsingAll 
                      ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                      : activeIndex === idx 
                        ? 'bg-[var(--color-nova-red)] text-white scale-110 z-20 border-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                        : 'bg-white dark:bg-[#1a1a1a] border-[var(--color-nova-red)] text-black dark:text-white'
                    }`}>
                    <span className="relative z-10">{val}</span>
                  </div>
                  <div className="mt-3 text-xs md:text-sm font-mono font-bold text-gray-500 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10">
                    {idx}
                  </div>
                </motion.div>
              ))}
              {array.length === 0 && (
                <div className="text-gray-400 font-mono text-xl md:text-2xl italic flex items-center justify-center h-24">[] (Empty Array)</div>
              )}
            </AnimatePresence>
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
