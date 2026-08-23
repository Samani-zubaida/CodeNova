import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, ArrowRight } from 'lucide-react';

const ALPHABET = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // No J

export default function PlayfairVisualizer({ mode = 'encrypt' }) {
  const [keyword, setKeyword] = useState('ALGOVERSE');
  const [inputText, setInputText] = useState('');
  const [matrix, setMatrix] = useState([]);
  
  // Animation state
  const [activePair, setActivePair] = useState(null); // { p1, p2, c1, c2 }
  const [animating, setAnimating] = useState(false);
  const [resultText, setResultText] = useState('');

  // Generate 5x5 Matrix
  useEffect(() => {
    let keyStr = (keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '') + ALPHABET);
    let uniqueChars = [];
    for (let i = 0; i < keyStr.length; i++) {
      if (!uniqueChars.includes(keyStr[i])) {
        uniqueChars.push(keyStr[i]);
      }
    }
    
    let m = [];
    for (let i = 0; i < 5; i++) {
      m.push(uniqueChars.slice(i * 5, i * 5 + 5));
    }
    setMatrix(m);
  }, [keyword]);

  const findPos = (char) => {
    if (char === 'J') char = 'I';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (matrix[r][c] === char) return { r, c };
      }
    }
    return null;
  };

  const handleProcess = () => {
    if (animating || !inputText || matrix.length === 0) return;
    setAnimating(true);
    setResultText('');
    
    // Clean input
    let clean = inputText.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    
    // Create pairs (insert X if double letters, pad X if odd)
    let pairs = [];
    let i = 0;
    while (i < clean.length) {
      let c1 = clean[i];
      let c2 = clean[i + 1];
      if (c2 === undefined) {
        pairs.push([c1, 'X']);
        i += 1;
      } else if (c1 === c2) {
        pairs.push([c1, 'X']);
        i += 1;
      } else {
        pairs.push([c1, c2]);
        i += 2;
      }
    }

    let results = [];
    let delay = 0;

    pairs.forEach((pair, idx) => {
      setTimeout(() => {
        let pos1 = findPos(pair[0]);
        let pos2 = findPos(pair[1]);
        
        let out1, out2;
        let shift = mode === 'encrypt' ? 1 : 4; // +4 is same as -1 modulo 5

        if (pos1.r === pos2.r) {
          // Same row
          out1 = matrix[pos1.r][(pos1.c + shift) % 5];
          out2 = matrix[pos2.r][(pos2.c + shift) % 5];
        } else if (pos1.c === pos2.c) {
          // Same col
          out1 = matrix[(pos1.r + shift) % 5][pos1.c];
          out2 = matrix[(pos2.r + shift) % 5][pos2.c];
        } else {
          // Rectangle
          out1 = matrix[pos1.r][pos2.c];
          out2 = matrix[pos2.r][pos1.c];
        }

        setActivePair({
          p1: { char: pair[0], ...pos1 },
          p2: { char: pair[1], ...pos2 },
          c1: { char: out1, ...findPos(out1) },
          c2: { char: out2, ...findPos(out2) },
          type: pos1.r === pos2.r ? 'row' : pos1.c === pos2.c ? 'col' : 'rect'
        });

        results.push(out1, out2);
        setResultText(results.join(''));

        if (idx === pairs.length - 1) {
          setTimeout(() => {
            setActivePair(null);
            setAnimating(false);
          }, 1500);
        }
      }, delay);
      delay += 1500;
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto min-h-max pb-8 text-white font-mono">
      
      {/* Intro */}
      <div>
        <h3 className="text-2xl font-bold mb-2 text-[var(--color-nova-green)] flex items-center gap-2">
          <Grid3X3 /> Playfair Cipher (WWI)
        </h3>
        <p className="text-gray-400 text-sm max-w-3xl">
          The Playfair cipher uses a 5x5 grid (I and J are combined). Instead of encrypting single letters, it encrypts pairs (digraphs) by drawing rectangles on the grid! 
          This made frequency analysis much harder in WWI.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Controls */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Keyword</label>
              <input 
                type="text" 
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                disabled={animating}
                className="bg-black border border-gray-700 p-3 rounded-xl font-mono text-xl focus:border-[var(--color-nova-green)] outline-none disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plaintext</label>
              <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                disabled={animating}
                placeholder="SECRET MESSAGE"
                className="bg-black border border-gray-700 p-3 rounded-xl font-mono text-xl focus:border-[var(--color-nova-green)] outline-none disabled:opacity-50"
              />
            </div>
            <button 
              onClick={handleProcess}
              disabled={animating || !inputText}
              className="mt-2 py-3 bg-[var(--color-nova-green)] text-black font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              {mode === 'encrypt' ? 'Encrypt with Playfair' : 'Decrypt with Playfair'}
            </button>
          </div>

          {/* Output Display */}
          <div className="bg-black/50 p-6 rounded-2xl border border-[var(--color-nova-green)] shadow-[0_0_20px_rgba(197,206,174,0.1)] flex flex-col gap-2">
            <label className="text-xs font-bold text-[var(--color-nova-green)] uppercase tracking-widest">Ciphertext Out</label>
            <div className="font-mono text-2xl text-[var(--color-nova-green)] break-all min-h-[4rem]">
              {resultText}
            </div>
          </div>
        </div>

        {/* Matrix Visualization */}
        <div className="lg:w-2/3 flex items-center justify-center p-8 bg-black/30 rounded-2xl border border-white/5 relative">
          
          <div className="grid grid-cols-5 gap-2 relative">
            
            {/* Draw Rectangle if active */}
            {activePair && activePair.type === 'rect' && (
              <motion.div 
                layoutId="rect-overlay"
                className="absolute inset-0 border-4 border-yellow-500/50 rounded-xl bg-yellow-500/10 pointer-events-none z-10"
                style={{
                  top: `${Math.min(activePair.p1.r, activePair.p2.r) * 20}%`,
                  left: `${Math.min(activePair.p1.c, activePair.p2.c) * 20}%`,
                  height: `${(Math.abs(activePair.p1.r - activePair.p2.r) + 1) * 20}%`,
                  width: `${(Math.abs(activePair.p1.c - activePair.p2.c) + 1) * 20}%`,
                }}
              />
            )}

            {matrix.map((row, r) => row.map((char, c) => {
              
              const isP1 = activePair?.p1.r === r && activePair?.p1.c === c;
              const isP2 = activePair?.p2.r === r && activePair?.p2.c === c;
              const isC1 = activePair?.c1.r === r && activePair?.c1.c === c;
              const isC2 = activePair?.c2.r === r && activePair?.c2.c === c;

              let bgColor = 'bg-gray-900';
              let textColor = 'text-gray-500';
              let borderColor = 'border-gray-800';
              let zIndex = 0;

              if (isP1 || isP2) {
                bgColor = 'bg-white';
                textColor = 'text-black';
                borderColor = 'border-white';
                zIndex = 20;
              } else if (isC1 || isC2) {
                bgColor = 'bg-[var(--color-nova-green)]';
                textColor = 'text-black';
                borderColor = 'border-green-400';
                zIndex = 20;
              }

              return (
                <motion.div 
                  key={`${r}-${c}`}
                  layout
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl font-bold rounded-xl border-2 transition-colors duration-500 shadow-sm relative`}
                  style={{ zIndex }}
                  animate={{
                    backgroundColor: isP1 || isP2 ? '#ffffff' : isC1 || isC2 ? '#c5ceae' : '#111827',
                    scale: (isP1 || isP2 || isC1 || isC2) ? 1.1 : 1
                  }}
                >
                  <span className={textColor}>{char}</span>
                  
                  {/* Arrows showing the mapping */}
                  {(isP1 && activePair.type === 'rect') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -z-10 text-[var(--color-nova-green)]" style={{ left: '100%' }}>
                      <ArrowRight />
                    </motion.div>
                  )}
                </motion.div>
              );
            }))}
          </div>

          {/* Explanation Tooltip */}
          <AnimatePresence>
            {activePair && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-xl flex items-center gap-4 whitespace-nowrap z-30"
              >
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white px-2 py-1 bg-white/20 rounded">{activePair.p1.char}</span>
                  <span className="font-bold text-white px-2 py-1 bg-white/20 rounded">{activePair.p2.char}</span>
                </div>
                <ArrowRight className="text-[var(--color-nova-green)]" />
                <div className="flex items-center gap-1">
                  <span className="font-bold text-black px-2 py-1 bg-[var(--color-nova-green)] rounded">{activePair.c1.char}</span>
                  <span className="font-bold text-black px-2 py-1 bg-[var(--color-nova-green)] rounded">{activePair.c2.char}</span>
                </div>
                <span className="text-gray-400 text-sm ml-2 font-sans">
                  ({activePair.type === 'rect' ? 'Opposite Corners' : activePair.type === 'row' ? 'Shift Right' : 'Shift Down'})
                </span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
