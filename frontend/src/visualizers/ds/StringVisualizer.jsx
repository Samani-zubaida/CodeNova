import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StringVisualizer() {
  const [str, setStr] = useState("CODE");
  const [stringBuilder, setStringBuilder] = useState(["C", "O", "D", "E"]);
  const [inputChar, setInputChar] = useState("!");

  const handleStringConcat = () => {
    // Strings are immutable, so we show the old one fading out and a new one replacing it
    setStr(str + inputChar);
  };

  const handleStringBuilderAppend = () => {
    // StringBuilder is mutable, so we just append to the array
    setStringBuilder([...stringBuilder, inputChar]);
  };

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <input 
          type="text" 
          maxLength={1}
          value={inputChar}
          onChange={(e) => setInputChar(e.target.value.toUpperCase())}
          className="border border-gray-300 dark:border-gray-700 bg-transparent rounded px-3 py-1 w-16 text-center"
        />
        <span className="text-gray-500 text-sm">Character to append</span>
      </div>

      {/* Immutable String */}
      <div>
        <h3 className="text-lg font-bold mb-2 text-[var(--color-nova-red)]">String (Immutable)</h3>
        <p className="text-xs text-gray-500 mb-4">Concatenating creates a completely new string object in memory.</p>
        <div className="flex items-center gap-4">
          <button onClick={handleStringConcat} className="bg-[var(--color-nova-brown)] text-white px-4 py-1 rounded text-sm hover:scale-105 transition-transform">+ Concat</button>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={str}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex border-2 border-[var(--color-nova-brown)] rounded overflow-hidden"
            >
              {str.split('').map((char, i) => (
                <div key={i} className="w-10 h-10 flex items-center justify-center bg-[var(--color-nova-wheat)] text-black font-mono font-bold border-r last:border-none border-black/10">
                  {char}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* StringBuilder */}
      <div>
        <h3 className="text-lg font-bold mb-2 text-[var(--color-nova-green)]">StringBuilder (Mutable)</h3>
        <p className="text-xs text-gray-500 mb-4">Appending modifies the existing character buffer without creating a new object.</p>
        <div className="flex items-center gap-4">
          <button onClick={handleStringBuilderAppend} className="bg-[var(--color-nova-green)] text-black font-semibold px-4 py-1 rounded text-sm hover:scale-105 transition-transform">+ Append</button>
          
          <div className="flex border-2 border-[var(--color-nova-green)] rounded overflow-hidden p-1 gap-1">
            <AnimatePresence>
              {stringBuilder.map((char, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/10 text-[var(--color-nova-green)] font-mono font-bold rounded"
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
