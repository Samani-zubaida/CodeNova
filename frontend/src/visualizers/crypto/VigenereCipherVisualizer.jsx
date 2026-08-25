import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Unlock, Lock, Play, Square, History, ArrowRight, ArrowLeft } from 'lucide-react';

export default function VigenereCipherVisualizer() {
  const [text, setText] = useState("SECURE");
  const [keyWord, setKeyWord] = useState("KEY");
  const [mode, setMode] = useState('encrypt');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(Array(text.length).fill(''));

  const cleanText = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
  const cleanKey = keyWord.replace(/[^a-zA-Z]/g, '').toUpperCase() || 'A';

  const steps = cleanText.split('').map((char, index) => {
    const kChar = cleanKey[index % cleanKey.length];
    const shift = kChar.charCodeAt(0) - 65;
    const base = char.charCodeAt(0) - 65;
    
    let resultChar;
    if (mode === 'encrypt') {
      resultChar = String.fromCharCode(((base + shift) % 26) + 65);
    } else {
      resultChar = String.fromCharCode(((base - shift + 26) % 26) + 65);
    }
    
    return {
      original: char,
      keyChar: kChar,
      shifted: resultChar
    };
  });

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length) {
      timer = setTimeout(() => {
        setResult(prev => {
          const newRes = [...prev];
          newRes[currentStep] = steps[currentStep].shifted;
          return newRes;
        });
        setCurrentStep(prev => prev + 1);
      }, 1200);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
    setResult(Array(cleanText.length).fill(''));
  };

  const generateTabulaRecta = () => {
    const rows = [];
    for(let i = 0; i < 26; i++) {
      const row = [];
      for(let j = 0; j < 26; j++) {
        row.push(String.fromCharCode(((i + j) % 26) + 65));
      }
      rows.push(row);
    }
    return rows;
  };

  const tabulaRecta = generateTabulaRecta();

  // Find coordinates for lasers
  let activeRow = -1;
  let activeCol = -1;
  if (currentStep >= 0 && currentStep < steps.length) {
    if (mode === 'encrypt') {
      activeRow = steps[currentStep].keyChar.charCodeAt(0) - 65;
      activeCol = steps[currentStep].original.charCodeAt(0) - 65;
    } else {
      activeRow = steps[currentStep].keyChar.charCodeAt(0) - 65;
      activeCol = tabulaRecta[activeRow].indexOf(steps[currentStep].original);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full pt-8 font-sans">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-emerald-500 drop-shadow-lg flex items-center justify-center gap-4">
          <Layers size={40} className="text-emerald-400" />
          Vigenère Cipher
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          The legendary polyalphabetic substitution cipher that remained unbroken for three centuries.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="w-full max-w-4xl glass-panel p-6 rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl mb-8 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Input Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => { setText(e.target.value); reset(); }}
            className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 font-mono"
            maxLength={12}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Key Word</label>
          <input
            type="text"
            value={keyWord}
            onChange={(e) => { setKeyWord(e.target.value); reset(); }}
            className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 font-mono"
            maxLength={12}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-1">Mode</label>
          <div className="flex bg-black/40 rounded-xl p-1 border border-emerald-500/30">
            <button 
              onClick={() => { setMode('encrypt'); reset(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${mode === 'encrypt' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Lock size={16} /> Encrypt
            </button>
            <button 
              onClick={() => { setMode('decrypt'); reset(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${mode === 'decrypt' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Unlock size={16} /> Decrypt
            </button>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex gap-4 mb-12">
        <button 
          onClick={() => {
            if (currentStep >= steps.length) reset();
            setIsPlaying(!isPlaying);
            if (currentStep === -1) setCurrentStep(0);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${isPlaying ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}
        >
          {isPlaying ? <Square size={20} /> : <Play size={20} />}
          {isPlaying ? "Pause" : (currentStep >= steps.length ? "Replay" : "Start Animation")}
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
        >
          <History size={20} /> Reset
        </button>
      </div>

      {/* Animation Stage */}
      <div className="w-full max-w-6xl flex flex-col xl:flex-row gap-12 items-center xl:items-start justify-center pb-20">
        
        {/* Left Side: Blocks */}
        <div className="flex flex-col gap-8 w-full xl:w-auto">
          {/* Original Text */}
          <div className="flex gap-2 flex-wrap justify-center">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">Plain</span>
                <motion.div 
                  animate={{
                    y: currentStep === i ? -5 : 0,
                    borderColor: currentStep === i ? 'rgba(16, 185, 129, 1)' : 'rgba(255,255,255,0.1)'
                  }}
                  className={`w-12 h-14 rounded-lg flex items-center justify-center text-2xl font-black font-mono border-2 transition-all duration-300 bg-black/40 ${currentStep === i ? 'text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-gray-300'}`}
                >
                  {s.original}
                </motion.div>
                
                <span className="text-xs text-gray-500 mt-2">Key</span>
                <motion.div 
                  animate={{
                    borderColor: currentStep === i ? 'rgba(56, 189, 248, 1)' : 'rgba(255,255,255,0.1)'
                  }}
                  className={`w-12 h-10 rounded-lg flex items-center justify-center text-lg font-bold font-mono border-2 transition-all duration-300 bg-black/40 ${currentStep === i ? 'text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]' : 'text-gray-400'}`}
                >
                  {s.keyChar}
                </motion.div>

                {/* Connecting Laser */}
                <div className="h-8 w-1 relative flex justify-center mt-2 mb-2">
                  <div className="w-0.5 h-full bg-gray-800" />
                  <AnimatePresence>
                    {currentStep >= i && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        className={`absolute top-0 w-1 rounded-full ${mode === 'encrypt' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <span className="text-xs text-gray-500">Result</span>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: currentStep >= i ? 1 : 0.8,
                    opacity: currentStep >= i ? 1 : 0.3,
                    borderColor: currentStep === i ? (mode === 'encrypt' ? 'rgba(16, 185, 129, 1)' : 'rgba(244, 63, 94, 1)') : (currentStep > i ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)')
                  }}
                  className={`w-12 h-14 rounded-lg flex items-center justify-center text-2xl font-black font-mono border-2 transition-all duration-500 ${currentStep >= i ? (mode === 'encrypt' ? 'bg-emerald-500/20 text-white' : 'bg-rose-500/20 text-white') : 'bg-black/20 text-transparent'}`}
                >
                  {result[i]}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Tabula Recta Grid */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-x-auto">
          <div className="text-center mb-4 text-emerald-300 font-bold tracking-widest uppercase">Tabula Recta</div>
          <div className="grid grid-cols-[auto_repeat(26,minmax(0,1fr))] gap-1">
            {/* Header row (Plaintext) */}
            <div className="w-6 h-6"></div>
            {Array.from({length: 26}).map((_, i) => (
              <div key={i} className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${activeCol === i ? 'text-emerald-400 bg-emerald-500/20 rounded shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'text-gray-500'}`}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            
            {/* Body */}
            {tabulaRecta.map((row, i) => (
              <React.Fragment key={i}>
                {/* Header col (Key) */}
                <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${activeRow === i ? 'text-sky-400 bg-sky-500/20 rounded shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'text-gray-500'}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                {/* Cells */}
                {row.map((cell, j) => {
                  const isTarget = activeRow === i && activeCol === j;
                  const inRowPath = activeRow === i && j < activeCol;
                  const inColPath = activeCol === j && i < activeRow;
                  
                  return (
                    <motion.div 
                      key={`${i}-${j}`}
                      animate={{
                        backgroundColor: isTarget ? (mode === 'encrypt' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(244, 63, 94, 0.8)') : (inRowPath ? 'rgba(56, 189, 248, 0.2)' : (inColPath ? 'rgba(16, 185, 129, 0.2)' : 'transparent')),
                        color: isTarget ? '#fff' : (activeRow === i || activeCol === j ? '#cbd5e1' : '#475569'),
                        scale: isTarget ? 1.2 : 1
                      }}
                      className={`w-6 h-6 flex items-center justify-center text-xs font-mono rounded ${isTarget ? 'shadow-[0_0_15px_rgba(16,185,129,1)] z-10 font-black' : ''}`}
                    >
                      {cell}
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
