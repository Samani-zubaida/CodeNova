import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RailFenceVisualizer() {
  const [text, setText] = useState("CODENOVA");
  const [rails, setRails] = useState(3);
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    // Generate the zig-zag grid for visualization
    if (!text) return setGrid([]);
    
    let tempGrid = Array.from({ length: rails }, () => Array(text.length).fill(null));
    let r = 0;
    let down = false;

    for (let c = 0; c < text.length; c++) {
      tempGrid[r][c] = text[c];
      if (r === 0 || r === rails - 1) down = !down;
      r += down ? 1 : -1;
    }
    
    setGrid(tempGrid);
  }, [text, rails]);

  return (
    <div className="w-full min-h-[500px] glass-card flex flex-col items-center p-8 text-white overflow-hidden relative font-mono shadow-inner">
      <h3 className="text-xl font-bold mb-2 text-[var(--color-nova-wheat)] tracking-widest">RAIL_FENCE_CIPHER</h3>
      <p className="text-sm text-gray-400 mb-8 text-center max-w-lg">Writes text downwards on successive "rails" in a zig-zag pattern, then reads off each row horizontally to encrypt.</p>

      <div className="flex flex-wrap gap-4 mb-8 bg-black/40 p-4 rounded-lg border border-white/10 w-full max-w-lg justify-between items-center">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">INPUT</label>
          <input 
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
            maxLength={12}
            className="bg-transparent border-b border-[var(--color-nova-wheat)] outline-none text-xl w-32 focus:border-[var(--color-nova-red)]"
          />
        </div>
        <div className="flex flex-col gap-1 items-center">
          <label className="text-xs text-gray-400">RAILS: {rails}</label>
          <input 
            type="range" 
            min="2" max="5" 
            value={rails} 
            onChange={(e) => setRails(Number(e.target.value))}
            className="w-24 accent-[var(--color-nova-wheat)]"
          />
        </div>
      </div>

      {/* Grid Visualization */}
      <div className="flex flex-col gap-2 overflow-x-auto pb-4 w-full max-w-2xl justify-center items-center">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2">
            {row.map((char, cIdx) => (
              <motion.div 
                key={`${rIdx}-${cIdx}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: char ? cIdx * 0.1 : 0 }}
                className={`w-10 h-10 flex items-center justify-center font-bold text-xl rounded ${char ? 'bg-[var(--color-nova-brown)] text-white shadow-[0_0_10px_rgba(188,162,151,0.5)] border border-[var(--color-nova-wheat)]' : 'bg-white/5 border border-white/5'}`}
              >
                {char || ''}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Ciphertext Output */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="text-xs text-gray-500 tracking-widest">CIPHERTEXT</div>
        <div className="flex gap-1 flex-wrap justify-center">
          {grid.flat().filter(Boolean).map((char, i) => (
             <motion.span 
               key={i} 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               transition={{ delay: (text.length * 0.1) + (i * 0.1) }}
               className="text-[var(--color-nova-red)] font-bold text-2xl"
             >
               {char}
             </motion.span>
          ))}
        </div>
      </div>

    </div>
  );
}
