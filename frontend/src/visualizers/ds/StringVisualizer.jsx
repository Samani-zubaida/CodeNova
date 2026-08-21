import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StringVisualizer() {
  const [baseInput, setBaseInput] = useState("CODE");
  const [addInput, setAddInput] = useState("NOVA");
  
  // State for visualizations
  const [str, setStr] = useState("CODE");
  const [stringBuilder, setStringBuilder] = useState(["C", "O", "D", "E"]);

  const [isAppending, setIsAppending] = useState(false);

  const handleReset = () => {
    setStr(baseInput);
    setStringBuilder(baseInput.split(''));
  };

  const handleStringConcat = () => {
    // Strings are immutable, creates entirely new object
    setStr(str + addInput);
  };

  const handleStringBuilderAppend = async () => {
    if (isAppending || !addInput) return;
    setIsAppending(true);
    
    // Visually append one by one
    const newChars = addInput.split('');
    let current = [...stringBuilder];
    
    for (let i = 0; i < newChars.length; i++) {
      current.push(newChars[i]);
      setStringBuilder([...current]);
      await new Promise(r => setTimeout(r, 300));
    }
    
    setIsAppending(false);
  };

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col gap-8">
      
      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-end bg-gray-50 dark:bg-black/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-bold">Base String</label>
          <input 
            type="text" 
            value={baseInput}
            onChange={(e) => setBaseInput(e.target.value.toUpperCase())}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded px-3 py-1 w-32"
          />
        </div>
        <button onClick={handleReset} className="border border-gray-400 px-4 py-1 rounded text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 h-8">
          Reset Visualizers
        </button>
        
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-2"></div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-bold">Text to Add</label>
          <input 
            type="text" 
            value={addInput}
            onChange={(e) => setAddInput(e.target.value.toUpperCase())}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded px-3 py-1 w-32"
          />
        </div>
      </div>

      {/* Immutable String */}
      <div>
        <h3 className="text-lg font-bold mb-2 text-[var(--color-nova-red)]">String (Immutable)</h3>
        <p className="text-xs text-gray-500 mb-4">Concatenating discards the old array and allocates a completely new array in memory.</p>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <button onClick={handleStringConcat} className="bg-[var(--color-nova-brown)] text-white px-4 py-1 rounded text-sm hover:scale-105 transition-transform font-bold">
            + Concat Word
          </button>
          
          <div className="max-w-full overflow-x-auto pb-2 scrollbar-thin">
            <AnimatePresence mode="wait">
              <motion.div 
                key={str}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="inline-flex border-2 border-[var(--color-nova-brown)] rounded overflow-hidden shadow-md"
              >
                {str.split('').map((char, i) => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center bg-[var(--color-nova-wheat)] text-black font-mono font-bold border-r last:border-none border-black/10">
                    {char}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* StringBuilder */}
      <div>
        <h3 className="text-lg font-bold mb-2 text-[var(--color-nova-green)]">StringBuilder (Mutable)</h3>
        <p className="text-xs text-gray-500 mb-4">Appending pushes characters directly into the existing mutable buffer array sequentially.</p>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <button 
            onClick={handleStringBuilderAppend} 
            disabled={isAppending}
            className="bg-[var(--color-nova-green)] text-black font-bold px-4 py-1 rounded text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            + Append Word
          </button>
          
          <div className="flex border-2 border-[var(--color-nova-green)] rounded overflow-hidden p-1 gap-1 flex-wrap shadow-inner bg-black/5 dark:bg-white/5 min-h-[50px] min-w-[50px]">
            <AnimatePresence>
              {stringBuilder.map((char, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white dark:bg-black border border-[var(--color-nova-green)] text-[var(--color-nova-green)] font-mono font-bold rounded shadow-sm"
                >
                  {char}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
