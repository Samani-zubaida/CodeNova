import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StringVisualizer() {
  const [baseInput, setBaseInput] = useState("CODE");
  const [addInput, setAddInput] = useState("NOVA");
  
  // Method Inputs
  const [subStart, setSubStart] = useState('');
  const [subEnd, setSubEnd] = useState('');
  const [searchChar, setSearchChar] = useState('');

  // State for visualizations
  const [str, setStr] = useState("CODE");
  const [stringBuilder, setStringBuilder] = useState(["C", "O", "D", "E"]);

  const [isAppending, setIsAppending] = useState(false);
  const [isPulsingAll, setIsPulsingAll] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  // Highlighting State
  const [highlightedIndex, setHighlightedIndex] = useState(null); 
  const [foundIndex, setFoundIndex] = useState(null); 
  const [subRange, setSubRange] = useState(null);
  
  // Console Output State
  const [outputLines, setOutputLines] = useState(["> String Initialized"]);

  const logOutput = (msg) => {
    setOutputLines(prev => [...prev, msg].slice(-8));
  };

  const handleReset = () => {
    setStr(baseInput);
    setStringBuilder(baseInput.split(''));
    logOutput(`> Visualizers reset to "${baseInput}"`);
  };

  const handleStringConcat = () => {
    const newStr = str + addInput;
    setStr(newStr);
    logOutput(`> str = str + "${addInput}"`);
    logOutput(`  Allocated new string in memory.`);
  };

  const handleStringBuilderAppend = async () => {
    if (isAppending || !addInput) return;
    setIsAppending(true);
    
    logOutput(`> stringBuilder.append("${addInput}")`);
    const newChars = addInput.split('');
    let current = [...stringBuilder];
    
    for (let i = 0; i < newChars.length; i++) {
      current.push(newChars[i]);
      setStringBuilder([...current]);
      await new Promise(r => setTimeout(r, 200));
    }
    
    logOutput(`  Mutated existing buffer.`);
    setIsAppending(false);
  };

  const handleLength = async () => {
    logOutput(`> str.length`);
    logOutput(`  Returned: ${str.length}`);
    setIsPulsingAll(true);
    setTimeout(() => setIsPulsingAll(false), 1000);
  };

  const handleSubstring = async () => {
    if (subStart === '' || subEnd === '' || isIterating) return;
    const s = Number(subStart);
    const e = Number(subEnd);
    if (s < 0 || e > str.length || s > e) {
      logOutput(`> str.substring(${s}, ${e})`);
      logOutput(`  Error: Invalid bounds`);
      return;
    }
    const result = str.substring(s, e);
    logOutput(`> str.substring(${s}, ${e})`);
    setSubRange({start: s, end: e});
    logOutput(`  Returned: "${result}"`);
    setTimeout(() => setSubRange(null), 2000);
  };

  const handleIndexOf = async () => {
    if (!searchChar || isIterating) return;
    setIsIterating(true);
    setFoundIndex(null);
    setSubRange(null);
    logOutput(`> str.indexOf("${searchChar}")`);
    
    let result = -1;
    for (let i = 0; i < str.length; i++) {
      setHighlightedIndex(i);
      await new Promise(r => setTimeout(r, 400));
      if (str[i] === searchChar) {
        result = i;
        break;
      }
    }
    
    setHighlightedIndex(null);
    if (result !== -1) {
      setFoundIndex(result);
      logOutput(`  Found at index: ${result}`);
      setTimeout(() => setFoundIndex(null), 2000);
    } else {
      logOutput(`  Returned: -1 (Not found)`);
    }
    setIsIterating(false);
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">

      {/* Left Sidebar: Controls & Output */}
      <div className="w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto">
        <div className="p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 h-full">
          
          {/* In-flow Back Button */}
          <Link to="/visualizer" className="text-gray-500 hover:text-purple-500 transition-colors flex items-center gap-2 font-semibold w-fit bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-white/10">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-purple-500 tracking-tight mb-2">String</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Immutable vs Mutable Sequences.</p>
          </div>

          {/* Core Operations */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Setup & Modify</h3>
            
            <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/5">
              <input 
                type="text" 
                value={baseInput}
                onChange={(e) => setBaseInput(e.target.value.toUpperCase())}
                className="bg-white dark:bg-black border border-gray-300 dark:border-800 rounded px-3 py-1.5 text-sm w-full"
                placeholder="Base String"
              />
              <button onClick={handleReset} disabled={isAppending} className="bg-gray-800 dark:bg-gray-200 text-white dark:text-black py-1.5 rounded text-sm font-bold shadow-sm disabled:opacity-50">Reset Visualizers</button>
            </div>

            <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/5">
              <input 
                type="text" 
                value={addInput}
                onChange={(e) => setAddInput(e.target.value.toUpperCase())}
                className="bg-white dark:bg-black border border-gray-300 dark:border-800 rounded px-3 py-1.5 text-sm w-full"
                placeholder="Text to Add"
              />
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button onClick={handleStringConcat} disabled={isAppending} className="bg-blue-500 text-white py-1.5 rounded text-xs font-bold shadow-sm hover:brightness-110 disabled:opacity-50">Concat (Immutable)</button>
                <button onClick={handleStringBuilderAppend} disabled={isAppending} className="bg-green-500 text-white py-1.5 rounded text-xs font-bold shadow-sm hover:brightness-110 disabled:opacity-50">Append (Mutable)</button>
              </div>
            </div>
          </div>

          {/* Built-in Methods */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">String Methods</h3>
            <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/5">
              <button onClick={handleLength} disabled={isAppending} className="bg-purple-500 text-white py-1.5 rounded text-sm font-bold shadow-sm hover:brightness-110 disabled:opacity-50">str.length</button>
              
              <div className="flex gap-2 mt-2">
                <input type="number" placeholder="start" value={subStart} onChange={e=>setSubStart(e.target.value)} className="w-1/3 bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-2 py-1 text-xs" />
                <input type="number" placeholder="end" value={subEnd} onChange={e=>setSubEnd(e.target.value)} className="w-1/3 bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-2 py-1 text-xs" />
                <button onClick={handleSubstring} className="w-1/3 border border-purple-500 text-purple-500 rounded text-xs font-bold hover:bg-purple-500 hover:text-white">substring</button>
              </div>

              <div className="flex gap-2 mt-2">
                <input type="text" placeholder="char" value={searchChar} onChange={e=>setSearchChar(e.target.value)} maxLength={1} className="w-1/2 bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-2 py-1 text-xs text-center" />
                <button onClick={handleIndexOf} className="w-1/2 border border-purple-500 text-purple-500 rounded text-xs font-bold hover:bg-purple-500 hover:text-white">indexOf</button>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8"></div>
        </div>
      </div>

      {/* Right Canvas: Visualization & Console */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full flex flex-col relative overflow-hidden">
        
        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto overflow-x-auto relative gap-12 items-center justify-center">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* String (Immutable) */}
          <div className="w-full max-w-2xl bg-white/40 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl relative z-10">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-3 h-3 rounded-full bg-blue-500"></div>
               <h3 className="font-bold text-lg">String <span className="text-gray-500 font-normal text-sm">(Immutable)</span></h3>
             </div>
             
             <div className="max-w-full overflow-x-auto pb-4 scrollbar-thin flex">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={str}
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className={`inline-flex border-2 rounded overflow-hidden shadow-md bg-white dark:bg-[#1a1a1a] ${isPulsingAll ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-blue-500'}`}
                >
                  {str.split('').map((char, i) => {
                    const isSubRange = subRange && i >= subRange.start && i < subRange.end;
                    const isHighlighted = highlightedIndex === i;
                    const isFound = foundIndex === i;
                    
                    let bgClass = 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
                    if (isPulsingAll) bgClass = 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
                    if (isSubRange) bgClass = 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] z-10';
                    if (isHighlighted) bgClass = 'bg-orange-500 text-white shadow-lg scale-110 z-20';
                    if (isFound) bgClass = 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-110 z-20';

                    return (
                      <div key={i} className={`w-12 h-12 flex-shrink-0 flex items-center justify-center font-mono font-bold border-r last:border-none text-xl transition-all duration-300 ${bgClass}`}>
                        {char}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-xs text-gray-500 mt-2">When mutated, a completely new array is allocated in memory.</p>
          </div>

          {/* StringBuilder */}
          <div className="w-full max-w-2xl bg-white/40 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl relative z-10">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <h3 className="font-bold text-lg">StringBuilder <span className="text-gray-500 font-normal text-sm">(Mutable)</span></h3>
             </div>
             
             <div className="flex border-2 border-green-500 rounded p-2 gap-2 flex-wrap shadow-inner bg-black/5 dark:bg-white/5 min-h-[68px]">
              <AnimatePresence>
                {stringBuilder.map((char, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className="w-12 h-12 flex items-center justify-center bg-white dark:bg-black border border-green-500 text-green-600 dark:text-green-400 font-mono font-bold rounded shadow-sm text-xl"
                  >
                    {char}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <p className="text-xs text-gray-500 mt-4">Pushes characters sequentially into the same buffer array without reallocating.</p>
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
