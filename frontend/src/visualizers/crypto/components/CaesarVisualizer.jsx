import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, History } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function CaesarVisualizer({ mode = 'encrypt' }) {
  const [inputText, setInputText] = useState('CIPHER');
  const [shift, setShift] = useState(3);
  
  // Execution State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [results, setResults] = useState([]);
  const [isDone, setIsDone] = useState(false);

  const isEncrypt = mode === 'encrypt';
  const actionColor = isEncrypt ? 'var(--color-nova-green)' : 'var(--color-nova-red)';
  const actualShift = isEncrypt ? shift : -shift;

  // The bottom tape is shifted by `actualShift`
  // Positive shift means 'A' on top aligns with 'D' on bottom (shifted right conceptually, but visually we shift the bottom tape left)
  // We'll just shift the array of characters for the bottom tape
  const getShiftedAlphabet = () => {
    let s = ((actualShift % 26) + 26) % 26; // handle negative
    return [...ALPHABET.slice(s), ...ALPHABET.slice(0, s)];
  };
  const shiftedAlphabet = getShiftedAlphabet();

  useEffect(() => {
    let timer;
    if (isPlaying && currentIndex < inputText.length) {
      timer = setTimeout(() => {
        const char = inputText[currentIndex];
        let resChar = char;
        
        if (ALPHABET.includes(char)) {
          const idx = ALPHABET.indexOf(char);
          resChar = shiftedAlphabet[idx];
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
      }, 1500); // 1.5s per step
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, inputText, shiftedAlphabet]);

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

  const handleShiftChange = (e) => {
    setShift(Number(e.target.value));
    handleReset();
  };

  // Find the active index mapping for the highlighter
  const activeChar = currentIndex >= 0 && currentIndex < inputText.length ? inputText[currentIndex] : null;
  const activeAlphabetIndex = ALPHABET.indexOf(activeChar);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto h-full text-white font-mono">
      
      {/* Intro Text */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Caesar Cipher</h3>
        <p className="text-gray-400 text-sm max-w-3xl">
          A classic substitution cipher. We take the standard alphabet (top tape) and shift it by a fixed number of positions (bottom tape). To encrypt a letter, find it on the top tape and drop down to the bottom tape!
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-end bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg relative z-20">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Input Text (A-Z)</label>
          <input 
            maxLength={15}
            value={inputText}
            onChange={handleInputChange}
            disabled={isPlaying || currentIndex !== -1}
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none text-xl w-48 focus:border-[var(--color-nova-brown)] transition-colors disabled:opacity-50"
          />
        </div>
        
        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Shift Value</label>
            <span className="font-bold" style={{ color: actionColor }}>{isEncrypt ? '+' : '-'}{shift}</span>
          </div>
          <input 
            type="range" 
            min="1" max="25" 
            value={shift} 
            onChange={handleShiftChange}
            disabled={isPlaying || currentIndex !== -1}
            style={{ accentColor: actionColor }}
            className="w-full cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Playback Controls */}
        <div className="flex gap-2">
          {!isPlaying ? (
            <button 
              onClick={handlePlay}
              disabled={!inputText}
              className="p-3 rounded-xl hover:scale-105 transition-transform bg-white/10 text-white border border-white/20 shadow-lg disabled:opacity-50 flex items-center justify-center w-14"
            >
              <Play fill="currentColor" size={20} />
            </button>
          ) : (
            <button 
              onClick={handlePause}
              className="p-3 rounded-xl hover:scale-105 transition-transform bg-white/10 text-white border border-white/20 shadow-lg flex items-center justify-center w-14"
            >
              <Square fill="currentColor" size={20} />
            </button>
          )}
          <button 
            onClick={handleReset}
            className="p-3 rounded-xl hover:scale-105 transition-transform bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg flex items-center justify-center w-14"
          >
            <History size={20} />
          </button>
        </div>
      </div>

      {/* Step Explanation Overlay */}
      <div className="flex items-center justify-center h-8">
        <AnimatePresence mode="wait">
          {activeChar && (
            <motion.div 
              key={activeChar}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-black/60 px-6 py-2 rounded-full border border-white/20 text-sm"
            >
              Step {currentIndex + 1}: Find <span className="font-bold text-white px-2 py-1 bg-white/20 rounded mx-1">{activeChar}</span> 
              on top tape, shift {isEncrypt ? 'forward' : 'backward'} by {shift}, mapped to <span className="font-bold text-black px-2 py-1 rounded mx-1" style={{ backgroundColor: actionColor }}>{shiftedAlphabet[activeAlphabetIndex]}</span>
            </motion.div>
          )}
          {isDone && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--color-nova-green)] text-black px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(197,206,174,0.4)]"
            >
              Complete!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animation Canvas */}
      <div className="flex-1 flex flex-col gap-16 p-8 bg-[#0a0a0a] rounded-2xl border border-white/5 relative overflow-hidden">
        
        {/* Tapes Container */}
        <div className="relative flex flex-col gap-2 mx-auto w-full max-w-full overflow-x-auto pb-8 scrollbar-hide">
          <div className="min-w-max flex flex-col gap-2 relative px-32 py-12">
            
            {/* Top Tape (Plaintext Alphabet) */}
            <div className="flex items-center gap-1">
              <span className="absolute left-0 text-gray-500 text-xs font-bold uppercase tracking-widest w-24 text-right">Plaintext</span>
              {ALPHABET.map((char, i) => (
                <div 
                  key={`top-${char}`} 
                  className={`w-10 h-10 flex items-center justify-center font-bold text-lg rounded-md transition-all duration-300 relative z-10 ${activeAlphabetIndex === i ? 'bg-white text-black shadow-lg scale-110' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
                >
                  {char}
                </div>
              ))}
            </div>

            {/* Connecting Lines */}
            <div className="h-16 relative w-full">
              {activeAlphabetIndex !== -1 && (
                <motion.div 
                  layoutId="connector"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-white to-transparent left-0 ml-[20px]"
                  style={{ 
                    left: `calc(10rem + ${activeAlphabetIndex * 2.75}rem)`, 
                    background: `linear-gradient(to bottom, white, ${actionColor})`,
                    boxShadow: `0 0 15px ${actionColor}` 
                  }}
                />
              )}
            </div>

            {/* Bottom Tape (Shifted Alphabet) */}
            <div className="flex items-center gap-1 relative">
              <span className="absolute left-0 text-gray-500 text-xs font-bold uppercase tracking-widest w-24 text-right">Ciphertext</span>
              
              {/* Animate the entire bottom row layout changes */}
              {ALPHABET.map((char, i) => {
                const shiftedChar = shiftedAlphabet[i];
                const isActive = activeAlphabetIndex === i;
                
                return (
                  <motion.div 
                    layout
                    key={`bottom-${shiftedChar}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className={`w-10 h-10 flex items-center justify-center font-bold text-lg rounded-md transition-all duration-300 relative z-10 ${isActive ? 'text-black shadow-[0_0_20px_currentColor] scale-125 border-none' : 'bg-gray-900 text-gray-600 border border-gray-800'}`}
                    style={{ backgroundColor: isActive ? actionColor : undefined }}
                  >
                    {shiftedChar}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Working Output Area */}
        <div className="flex flex-col items-center gap-4 mt-auto">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Processing</span>
          <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
            {inputText.split('').map((char, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {/* Input box */}
                <div className={`w-12 h-12 flex items-center justify-center font-bold text-xl rounded-lg border-2 transition-all ${
                  currentIndex === i ? 'bg-white text-black border-white scale-110 shadow-lg' :
                  currentIndex > i ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-black text-gray-600 border-gray-800'
                }`}>
                  {char}
                </div>
                {/* Arrow */}
                <div className={`h-6 w-0.5 transition-colors ${results[i] ? 'bg-gray-600' : 'bg-transparent'}`} />
                {/* Output box */}
                <div className={`w-12 h-12 flex items-center justify-center font-bold text-xl rounded-lg border-2 transition-all duration-500 ${
                  results[i] 
                    ? 'text-black scale-100 shadow-[0_0_15px_rgba(255,255,255,0.1)] border-transparent' 
                    : 'bg-transparent text-transparent border-dashed border-gray-800'
                }`}
                style={{ backgroundColor: results[i] ? actionColor : undefined }}>
                  {results[i] || char}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
