import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, History } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Generate Tabula Recta
const tabulaRecta = [];
for (let i = 0; i < 26; i++) {
  let row = [];
  for (let j = 0; j < 26; j++) {
    row.push(ALPHABET[(i + j) % 26]);
  }
  tabulaRecta.push(row);
}

export default function VigenereVisualizer({ mode = 'encrypt' }) {
  const [inputText, setInputText] = useState('SECRET');
  const [keyword, setKeyword] = useState('KEY');
  
  // Execution State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [results, setResults] = useState([]);
  const [isDone, setIsDone] = useState(false);

  const isEncrypt = mode === 'encrypt';
  const actionColor = isEncrypt ? 'var(--color-nova-green)' : 'var(--color-nova-red)';

  useEffect(() => {
    let timer;
    if (isPlaying && currentIndex < inputText.length) {
      timer = setTimeout(() => {
        const pChar = inputText[currentIndex];
        const kChar = keyword[currentIndex % keyword.length];
        
        let resChar = pChar;
        
        if (ALPHABET.includes(pChar) && ALPHABET.includes(kChar)) {
          const colIdx = ALPHABET.indexOf(pChar);
          const rowIdx = ALPHABET.indexOf(kChar);
          
          if (isEncrypt) {
            resChar = tabulaRecta[rowIdx][colIdx];
          } else {
            // Decrypt: Find pChar in rowIdx, the index is the colIdx
            const row = tabulaRecta[rowIdx];
            const cIdx = row.indexOf(pChar);
            resChar = ALPHABET[cIdx];
          }
        }

        setResults(prev => {
          const newRes = [...prev];
          newRes[currentIndex] = resChar;
          return newRes;
        });

        if (currentIndex === inputText.length - 1) {
          setIsPlaying(false);
          setIsDone(true);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 2000); // 2s per step to allow laser animation to finish
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, inputText, keyword, isEncrypt]);

  const handlePlay = () => {
    if (isDone) {
      setResults([]);
      setIsDone(false);
      setCurrentIndex(0);
    }
    if (currentIndex === -1) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(-1);
    setResults([]);
    setIsDone(false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''));
    handleReset();
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''));
    handleReset();
  };

  // Active indices for the grid
  let activeRow = -1;
  let activeCol = -1;
  let activePChar = '';
  let activeKChar = '';
  let activeRes = '';

  if (currentIndex >= 0 && currentIndex < inputText.length) {
    activePChar = inputText[currentIndex];
    activeKChar = keyword[currentIndex % keyword.length];
    
    if (ALPHABET.includes(activePChar) && ALPHABET.includes(activeKChar)) {
      if (isEncrypt) {
        activeCol = ALPHABET.indexOf(activePChar); // Plaintext is columns
        activeRow = ALPHABET.indexOf(activeKChar); // Key is rows
        activeRes = tabulaRecta[activeRow][activeCol];
      } else {
        activeRow = ALPHABET.indexOf(activeKChar);
        const row = tabulaRecta[activeRow];
        activeCol = row.indexOf(activePChar);
        activeRes = ALPHABET[activeCol];
      }
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto h-full text-white font-mono">
      
      {/* Intro Text */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Vigenère Cipher</h3>
        <p className="text-gray-400 text-sm max-w-3xl">
          A polyalphabetic substitution cipher. It uses a series of interwoven Caesar ciphers based on the letters of a keyword. 
          To encrypt, find the intersection of the plaintext letter (column) and the keyword letter (row) on the Tabula Recta!
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left Column: Controls & Output */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col gap-4">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Input Text (A-Z)</label>
              <input 
                maxLength={15}
                value={inputText}
                onChange={handleInputChange}
                disabled={isPlaying || currentIndex !== -1}
                className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none text-xl w-full focus:border-[var(--color-nova-brown)] transition-colors disabled:opacity-50"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Keyword (A-Z)</label>
              <input 
                maxLength={15}
                value={keyword}
                onChange={handleKeywordChange}
                disabled={isPlaying || currentIndex !== -1}
                className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none text-xl w-full focus:border-[var(--color-nova-brown)] transition-colors disabled:opacity-50"
              />
            </div>

            {/* Playback Controls */}
            <div className="flex gap-2 mt-2">
              {!isPlaying ? (
                <button 
                  onClick={handlePlay}
                  disabled={!inputText || !keyword}
                  className="p-3 flex-1 rounded-xl hover:scale-105 transition-transform bg-white/10 text-white border border-white/20 shadow-lg disabled:opacity-50 flex items-center justify-center"
                >
                  <Play fill="currentColor" size={20} />
                </button>
              ) : (
                <button 
                  onClick={handlePause}
                  className="p-3 flex-1 rounded-xl hover:scale-105 transition-transform bg-white/10 text-white border border-white/20 shadow-lg flex items-center justify-center"
                >
                  <Square fill="currentColor" size={20} />
                </button>
              )}
              <button 
                onClick={handleReset}
                className="p-3 rounded-xl hover:scale-105 transition-transform bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg flex items-center justify-center w-16"
              >
                <History size={20} />
              </button>
            </div>
          </div>

          {/* Working Output Area */}
          <div className="bg-black/50 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Processing Tape</span>
            <div className="flex flex-wrap gap-x-2 gap-y-4">
              {inputText.split('').map((char, i) => {
                const kChar = keyword[i % keyword.length] || '';
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-500">{kChar}</span>
                    <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded transition-all ${
                      currentIndex === i ? 'bg-white text-black border-white shadow-lg' :
                      currentIndex > i ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-black text-gray-600 border border-gray-800'
                    }`}>
                      {char}
                    </div>
                    <div className={`h-4 w-px transition-colors ${results[i] ? 'bg-gray-600' : 'bg-transparent'}`} />
                    <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded transition-all duration-500 ${
                      results[i] 
                        ? 'text-black shadow-[0_0_10px_rgba(255,255,255,0.1)] border-transparent' 
                        : 'bg-transparent text-transparent border border-dashed border-gray-800'
                    }`}
                    style={{ backgroundColor: results[i] ? actionColor : undefined }}>
                      {results[i] || char}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Step Explanation */}
          <AnimatePresence mode="wait">
            {activeRow !== -1 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-[#111] p-4 rounded-xl border border-white/10 text-sm leading-relaxed"
              >
                Step {currentIndex + 1}: <br/>
                {isEncrypt ? (
                  <>
                    Find Plaintext <span className="font-bold text-white bg-white/20 px-1 rounded">{activePChar}</span> on the top row.<br/>
                    Find Keyword <span className="font-bold text-white bg-white/20 px-1 rounded">{activeKChar}</span> on the left column.<br/>
                    Intersection is <span className="font-bold text-black px-1 rounded" style={{ backgroundColor: actionColor }}>{activeRes}</span>.
                  </>
                ) : (
                  <>
                    Find Keyword <span className="font-bold text-white bg-white/20 px-1 rounded">{activeKChar}</span> on the left column.<br/>
                    Scan row to find Ciphertext <span className="font-bold text-white bg-white/20 px-1 rounded">{activePChar}</span>.<br/>
                    Go up to top row to get Plaintext <span className="font-bold text-black px-1 rounded" style={{ backgroundColor: actionColor }}>{activeRes}</span>.
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Tabula Recta Grid */}
        <div className="w-full xl:w-2/3 flex items-center justify-center p-4 lg:p-8 bg-black/30 rounded-2xl border border-white/5 overflow-x-auto relative min-h-[600px]">
          
          <div className="relative flex flex-col gap-[2px]">
            {/* Top Header Row (Plaintext Columns) */}
            <div className="flex gap-[2px] ml-6 mb-2">
              {ALPHABET.map((char, cIdx) => (
                <div key={`header-${char}`} className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-[10px] lg:text-xs font-bold rounded-sm transition-colors ${activeCol === cIdx ? 'bg-white text-black scale-110 z-10' : 'bg-gray-800/50 text-gray-500'}`}>
                  {char}
                </div>
              ))}
            </div>

            {/* Grid Rows */}
            {tabulaRecta.map((row, rIdx) => (
              <div key={`row-${rIdx}`} className="flex gap-[2px]">
                {/* Left Header Column (Keyword Rows) */}
                <div className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-[10px] lg:text-xs font-bold rounded-sm mr-2 transition-colors ${activeRow === rIdx ? 'bg-white text-black scale-110 z-10' : 'bg-gray-800/50 text-gray-500'}`}>
                  {ALPHABET[rIdx]}
                </div>
                
                {/* Cells */}
                {row.map((char, cIdx) => {
                  const isIntersect = activeRow === rIdx && activeCol === cIdx;
                  const isRowActive = activeRow === rIdx && cIdx <= activeCol;
                  const isColActive = activeCol === cIdx && rIdx <= activeRow;
                  
                  let bg = 'bg-black/40 text-gray-700 hover:bg-gray-800/50';
                  let z = 0;

                  if (isIntersect) {
                    bg = 'text-black shadow-[0_0_15px_currentColor] scale-125 rounded-md';
                    z = 20;
                  } else if (isRowActive || isColActive) {
                    bg = 'bg-white/20 text-white';
                    z = 10;
                  }

                  return (
                    <div 
                      key={`cell-${rIdx}-${cIdx}`}
                      className={`w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-[10px] lg:text-xs font-mono transition-all duration-300 relative ${bg}`}
                      style={{ 
                        zIndex: z,
                        backgroundColor: isIntersect ? actionColor : undefined
                      }}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Animated Laser Beams */}
            {activeRow !== -1 && activeCol !== -1 && (
              <>
                {/* Horizontal Laser */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(activeCol + 1) * 26}px` }} // Approx calculation based on cell size (24px + 2px gap)
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute left-8 h-[2px] bg-white/80 shadow-[0_0_10px_white] z-30 pointer-events-none"
                  style={{ top: `${(activeRow * 26) + 38}px` }} 
                />
                {/* Vertical Laser */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(activeRow + 1) * 26}px` }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: isEncrypt ? 0.2 : 0 }}
                  className="absolute top-8 w-[2px] bg-white/80 shadow-[0_0_10px_white] z-30 pointer-events-none"
                  style={{ left: `${(activeCol * 26) + 36}px` }} 
                />
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
