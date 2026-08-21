import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColumnarVisualizer() {
  const [text, setText] = useState("CODENOVA");
  const [keyword, setKeyword] = useState("KEY");
  
  // Calculate grid and sorted columns
  const cols = keyword.length || 1;
  const rows = Math.ceil(text.length / cols);
  const grid = Array.from({ length: rows }, (_, r) => 
    Array.from({ length: cols }, (_, c) => text[r * cols + c] || '')
  );

  // Get order of columns based on alphabetical sort of keyword
  const sortedKeyword = keyword.split('').map((char, index) => ({ char, index })).sort((a, b) => a.char.localeCompare(b.char));

  return (
    <div className="w-full min-h-[500px] glass-card flex flex-col items-center p-8 text-white overflow-hidden relative font-mono shadow-inner">
      <h3 className="text-xl font-bold mb-2 text-[var(--color-nova-red)] tracking-widest">COLUMNAR_TRANSPOSITION</h3>
      <p className="text-sm text-gray-400 mb-8 text-center max-w-lg">Writes text into a grid, then reads the columns downwards in alphabetical order of the keyword.</p>

      <div className="flex flex-wrap gap-4 mb-8 bg-black/40 p-4 rounded-lg border border-white/10 w-full max-w-lg justify-between items-center">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">INPUT</label>
          <input 
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
            maxLength={16}
            className="bg-transparent border-b border-[var(--color-nova-red)] outline-none text-xl w-32 focus:border-white"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">KEYWORD</label>
          <input 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
            maxLength={6}
            className="bg-transparent border-b border-[var(--color-nova-brown)] outline-none text-xl w-24 focus:border-[var(--color-nova-wheat)]"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Header / Keyword Row */}
        <div className="flex gap-2 mb-2">
          {keyword.split('').map((char, i) => {
            const order = sortedKeyword.findIndex(k => k.index === i) + 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1 w-10">
                <span className="text-[10px] text-[var(--color-nova-green)] font-bold">{order}</span>
                <div className="w-10 h-10 bg-[var(--color-nova-brown)] flex items-center justify-center font-bold text-xl rounded-t border-b-2 border-black">
                  {char}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid Body */}
        <div className="flex flex-col gap-2">
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-2">
              {row.map((char, cIdx) => (
                <div key={cIdx} className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl rounded">
                  {char}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="text-xs text-gray-500 tracking-widest">CIPHERTEXT (READ DOWN BY ORDER)</div>
        <div className="flex gap-3 flex-wrap justify-center mt-2">
          {sortedKeyword.map((col, i) => (
            <div key={i} className="flex gap-1 bg-black/50 px-2 py-1 rounded border border-white/10">
               {grid.map(row => row[col.index]).filter(Boolean).map((char, j) => (
                 <span key={j} className="text-[var(--color-nova-wheat)] font-bold">{char}</span>
               ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
