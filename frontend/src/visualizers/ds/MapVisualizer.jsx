import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Terminal, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MapVisualizer() {
  const [mapData, setMapData] = useState([
    { key: "Alice", value: 95 },
    { key: "Bob", value: 82 },
    { key: "Charlie", value: 88 }
  ]);
  
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  // Console Output State
  const [outputLines, setOutputLines] = useState(["> HashMap Initialized"]);
  const [isIterating, setIsIterating] = useState(false);
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [isPulsingAll, setIsPulsingAll] = useState(false);
  const [highlightColumn, setHighlightColumn] = useState(null); // 'keys', 'values', or null
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const logOutput = (msg) => {
    setOutputLines(prev => [...prev, msg].slice(-8));
  };

  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; 
    }
    return Math.abs(hash) % 1000; 
  };

  const handlePut = async () => {
    if (!inputKey || !inputValue || isIterating) return;
    setIsIterating(true);
    
    logOutput(`> map.put("${inputKey}", ${inputValue})`);
    
    const hash = simpleHash(inputKey);
    logOutput(`  Hashing key "${inputKey}" -> ${hash}`);
    
    await new Promise(r => setTimeout(r, 600));

    const existingIndex = mapData.findIndex(item => item.key === inputKey);
    if (existingIndex !== -1) {
      logOutput(`  Key exists. Updating value O(1).`);
      setHighlightedKey(inputKey);
      await new Promise(r => setTimeout(r, 400));
      const newData = [...mapData];
      newData[existingIndex].value = inputValue;
      setMapData(newData);
    } else {
      logOutput(`  New key. Inserting O(1).`);
      setMapData([...mapData, { key: inputKey, value: inputValue }]);
    }
    
    await new Promise(r => setTimeout(r, 400));
    setHighlightedKey(null);
    setInputKey('');
    setInputValue('');
    setIsIterating(false);
  };

  const handleDelete = async (keyToRemove) => {
    if (isIterating) return;
    setIsIterating(true);
    logOutput(`> map.delete("${keyToRemove}")`);
    
    const hash = simpleHash(keyToRemove);
    logOutput(`  Hashing key "${keyToRemove}" -> ${hash}`);
    
    setHighlightedKey(keyToRemove);
    await new Promise(r => setTimeout(r, 600));
    
    setMapData(mapData.filter(item => item.key !== keyToRemove));
    logOutput(`  Deleted entry.`);
    
    setHighlightedKey(null);
    setIsIterating(false);
  };

  const handleHas = async () => {
    if (!inputKey || isIterating) return;
    setIsIterating(true);
    logOutput(`> map.has("${inputKey}")`);
    
    const hash = simpleHash(inputKey);
    logOutput(`  Hashing key "${inputKey}" -> ${hash}`);
    
    await new Promise(r => setTimeout(r, 600));
    
    const exists = mapData.some(item => item.key === inputKey);
    if (exists) {
      setHighlightedKey(inputKey);
      logOutput(`  Returned: true`);
      await new Promise(r => setTimeout(r, 600));
      setHighlightedKey(null);
    } else {
      logOutput(`  Returned: false`);
    }
    setIsIterating(false);
  };

  const handleSize = () => {
    logOutput(`> map.size`);
    logOutput(`  Returned: ${mapData.length}`);
    setIsPulsingAll(true);
    setTimeout(() => setIsPulsingAll(false), 1000);
  };

  const handleKeySet = () => {
    logOutput(`> map.keys()`);
    const keys = mapData.map(item => item.key);
    logOutput(`  Returned: [${keys.join(', ')}]`);
    setIsPulsingAll(true);
    setHighlightColumn('keys');
    setTimeout(() => { setIsPulsingAll(false); setHighlightColumn(null); }, 1000);
  };

  const handleValues = () => {
    logOutput(`> map.values()`);
    const values = mapData.map(item => item.value);
    logOutput(`  Returned: [${values.join(', ')}]`);
    setIsPulsingAll(true);
    setHighlightColumn('values');
    setTimeout(() => { setIsPulsingAll(false); setHighlightColumn(null); }, 1000);
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">

      {/* Left Sidebar: Controls & Output */}
      <div className="w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto">
        <div className="p-4 lg:p-6 flex flex-col gap-6 h-full">
          
          {/* In-flow Back Button */}
          <Link to="/visualizer" className="text-gray-500 hover:text-pink-500 transition-colors flex items-center gap-2 font-semibold w-fit bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-white/10">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-pink-500 tracking-tight mb-2">Hash Map</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Key-Value store utilizing a hash function for O(1) lookups.</p>
          </div>

          {/* Core Operations */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Modify</h3>
            
            <div className="flex flex-col gap-2 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/5">
              <input 
                type="text" 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-3 py-1.5 text-sm w-full"
                placeholder="Key (String)"
              />
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-3 py-1.5 text-sm w-full"
                placeholder="Value"
              />
              <button onClick={handlePut} disabled={isIterating} className="bg-pink-500 text-white py-1.5 rounded text-sm font-bold shadow-sm hover:brightness-110 disabled:opacity-50 mt-1">Put (Insert / Update)</button>
            </div>
            
          </div>

          {/* Built-in Methods */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Methods</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleHas} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-pink-200 dark:border-pink-900/30 text-pink-600 dark:text-pink-400 py-2 rounded text-sm font-bold hover:bg-pink-50 dark:hover:bg-pink-900/20 disabled:opacity-50 flex items-center justify-center gap-1">
                <Search size={14}/> has(key)
              </button>
              <button onClick={handleSize} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">size()</button>
              <button onClick={handleKeySet} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">keys()</button>
              <button onClick={handleValues} disabled={isIterating} className="bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 py-2 rounded text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">values()</button>
            </div>
          </div>

          <div className="mt-auto pt-8"></div>
        </div>
      </div>

      {/* Right Canvas: Visualization & Console */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full flex flex-col relative overflow-hidden">
        
        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12 overflow-y-auto overflow-x-auto relative z-10">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Premium Table Map Visualization */}
          <div className="w-full max-w-2xl bg-white/60 dark:bg-black/60  rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden relative">
            
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_2fr_2fr_auto] gap-4 p-4 bg-gray-100/80 dark:bg-[#161b22] border-b border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <div>Hash</div>
              <div>Key</div>
              <div>Value</div>
              <div className="w-8"></div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {mapData.map((item, idx) => {
                  const isHighlighted = highlightedKey === item.key;
                  return (
                    <motion.div 
                      key={item.key}
                      layout
                      initial={{ opacity: 0, x: -20, backgroundColor: 'rgba(236,72,153,0)' }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        backgroundColor: (isHighlighted || isPulsingAll) ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0)'
                      }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`grid grid-cols-[1fr_2fr_2fr_auto] gap-4 p-4 border-b border-gray-100 dark:border-white/5 items-center transition-colors ${(isHighlighted || isPulsingAll) && !highlightColumn ? 'border-pink-500/50 shadow-[inset_0_0_15px_rgba(236,72,153,0.2)]' : 'hover:bg-white/50 dark:hover:bg-white/5'}`}
                    >
                      <div className="font-mono text-gray-400 text-sm">
                        #{simpleHash(item.key)}
                      </div>
                      <div className={`font-bold transition-all duration-300 rounded px-2 py-1 ${isPulsingAll && highlightColumn === 'keys' ? 'bg-pink-500/20 text-pink-600 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : ''}`}>
                        "{item.key}"
                      </div>
                      <div className={`font-mono text-gray-600 dark:text-gray-300 transition-all duration-300 rounded px-2 py-1 ${isPulsingAll && highlightColumn === 'values' ? 'bg-pink-500/20 text-pink-600 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : ''}`}>
                        {item.value}
                      </div>
                      <button 
                        onClick={() => handleDelete(item.key)}
                        disabled={isIterating}
                        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete Entry"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              {mapData.length === 0 && (
                <div className="p-8 text-center text-gray-400 font-mono italic">
                  Map is empty
                </div>
              )}
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
