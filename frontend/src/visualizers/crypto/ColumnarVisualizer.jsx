import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColumnarVisualizer({ mode }) {
  const [inputText, setInputText] = useState('WEAREDISCOVEREDFLEEATONCE');
  const [keyword, setKeyword] = useState('ZEBRAS');
  const [stage, setStage] = useState('input'); // input, grid, sort, read
  const [isAnimating, setIsAnimating] = useState(false);

  const isEncrypt = mode === 'encrypt';
  const actionColor = isEncrypt ? 'var(--color-nova-green)' : 'var(--color-nova-red)';

  const handleAction = () => {
    if (!inputText || !keyword) return;
    setIsAnimating(true);
    setStage('grid');
    
    setTimeout(() => {
      setStage('sort');
      setTimeout(() => {
        setStage('read');
        setIsAnimating(false);
      }, 2000);
    }, 1500);
  };

  const handleReset = () => {
    setStage('input');
  };

  // Math for Grid
  const cols = keyword.length || 1;
  const rows = Math.ceil(inputText.length / cols);
  const totalCells = cols * rows;

  // Prepare characters
  const paddedInput = inputText.padEnd(totalCells, 'X');

  // Define column sorting mapping
  // e.g. ZEBRAS -> A=0, B=1, E=2, R=3, S=4, Z=5
  const keywordArr = keyword.split('').map((char, originalIndex) => ({ char, originalIndex }));
  const sortedKeywordArr = [...keywordArr].sort((a, b) => a.char.localeCompare(b.char));
  
  // Mapping from visual column index to original keyword index
  // In Encrypt mode, stage 'grid' shows original. stage 'sort' shows sorted.
  // In Decrypt mode, stage 'grid' shows sorted. stage 'sort' shows original.
  
  let currentColumns = keywordArr;
  if (isEncrypt && (stage === 'sort' || stage === 'read')) currentColumns = sortedKeywordArr;
  if (!isEncrypt && (stage === 'input' || stage === 'grid')) currentColumns = sortedKeywordArr;
  if (!isEncrypt && (stage === 'sort' || stage === 'read')) currentColumns = keywordArr;

  // Generate grid data
  let gridData = Array.from({ length: rows }, () => Array(cols).fill(''));
  let resultText = '';

  if (isEncrypt) {
    // Plaintext -> Grid (Horizontal)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        gridData[r][c] = paddedInput[r * cols + c];
      }
    }
    // Result = Read Vertically by sorted columns
    sortedKeywordArr.forEach(col => {
      for (let r = 0; r < rows; r++) {
        resultText += gridData[r][col.originalIndex];
      }
    });
  } else {
    // Ciphertext -> Grid (Vertical by sorted columns)
    let idx = 0;
    sortedKeywordArr.forEach(col => {
      for (let r = 0; r < rows; r++) {
        gridData[r][col.originalIndex] = paddedInput[idx++] || 'X';
      }
    });
    // Result = Read Horizontally by original columns
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        resultText += gridData[r][c];
      }
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto h-full overflow-hidden">
      
      {/* Intro */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Columnar Transposition</h3>
        <p className="text-gray-400 text-sm">
          Writes data into a grid and rearranges the columns based on the alphabetical order of the keyword.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-end bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">
            {isEncrypt ? 'Plaintext' : 'Ciphertext'}
          </label>
          <input 
            maxLength={25}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value.toUpperCase().replace(/\s/g, ''));
              setStage('input');
            }}
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none text-xl w-full focus:border-[var(--color-nova-brown)] transition-colors"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Keyword</label>
          <input 
            maxLength={8}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''));
              setStage('input');
            }}
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none text-xl w-32 focus:border-[var(--color-nova-brown)] transition-colors text-center"
          />
        </div>

        <button 
          onClick={stage === 'input' ? handleAction : handleReset}
          disabled={isAnimating || !inputText || !keyword}
          style={{ backgroundColor: stage === 'input' ? actionColor : '#333' }}
          className="text-black px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,0,0,0.3)] ml-auto"
        >
          {stage === 'input' ? (isEncrypt ? 'ENCRYPT' : 'DECRYPT') : 'RESET'}
        </button>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 min-h-[400px] flex flex-col items-center p-8 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden">
        
        <div className="flex flex-col gap-1 items-center mt-4 relative">
          
          {/* Header Row (Keyword) */}
          <div className="flex gap-2 mb-4">
            <AnimatePresence mode="popLayout">
              {currentColumns.map((col, idx) => (
                <motion.div
                  layout
                  key={col.originalIndex} // Important: keys track the column identity for sorting animation
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 15 }}
                  style={{ color: actionColor, borderColor: actionColor }}
                  className="w-12 h-12 flex flex-col items-center justify-center border-b-2 font-bold text-2xl"
                >
                  {col.char}
                  <span className="text-[10px] text-gray-500 absolute -top-4">{col.originalIndex + 1}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Grid Rows */}
          <div className="flex flex-col gap-2">
            {stage !== 'input' && Array.from({ length: rows }).map((_, r) => (
              <div key={r} className="flex gap-2">
                <AnimatePresence mode="popLayout">
                  {currentColumns.map((col, c) => {
                    const char = gridData[r][col.originalIndex];
                    return (
                      <motion.div
                        layout
                        key={col.originalIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          type: "spring", stiffness: 120, damping: 15,
                          delay: isEncrypt 
                            ? (stage === 'grid' ? (r * cols + col.originalIndex) * 0.05 : 0) // fill horizontally
                            : (stage === 'grid' ? (sortedKeywordArr.findIndex(s => s.originalIndex === col.originalIndex) * rows + r) * 0.05 : 0) // fill vertically
                        }}
                        className="w-12 h-12 bg-black border border-white/20 rounded-lg flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        style={{ color: stage === 'read' ? actionColor : 'white' }}
                      >
                        {char}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {stage === 'input' && (
             <div className="text-gray-500 font-mono text-sm tracking-widest uppercase mt-12">
               Click {isEncrypt ? 'Encrypt' : 'Decrypt'} to build the grid.
             </div>
          )}
        </div>

        {/* Output Area */}
        <AnimatePresence>
          {stage === 'read' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-black border border-white/10 rounded-xl shadow-2xl flex flex-col items-center text-center gap-2 max-w-full"
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest">{isEncrypt ? 'Encrypted Output' : 'Decrypted Plaintext'}</span>
              <span className="text-2xl font-bold tracking-[0.2em] break-all" style={{ color: actionColor }}>
                {resultText}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
