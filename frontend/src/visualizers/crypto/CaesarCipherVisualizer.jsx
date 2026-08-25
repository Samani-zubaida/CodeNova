import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Play, Square, History, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CaesarCipherVisualizer() {
  const [text, setText] = useState("CODE");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(Array(text.length).fill(''));

  // Pre-calculate steps
  const steps = text.split('').map((char) => {
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';
    const base = isUpper ? 65 : (isLower ? 97 : null);
    
    if (base === null) return { original: char, shifted: char, shiftAmount: 0 };
    
    let shiftAmount = mode === 'encrypt' ? shift : -shift;
    // Handle negative shifts correctly in JS modulo
    const shiftedCode = ((char.charCodeAt(0) - base + shiftAmount) % 26 + 26) % 26 + base;
    return {
      original: char,
      shifted: String.fromCharCode(shiftedCode),
      shiftAmount: shiftAmount
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
      }, 1000);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
    setResult(Array(text.length).fill(''));
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full pt-8 font-sans">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-emerald-400 drop-shadow-lg flex items-center justify-center gap-4">
          <Lock size={40} className="text-emerald-500" />
          Caesar Cipher
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          The legendary shifting substitution cipher used by Julius Caesar.
        </p>
      </motion.div>

      {/* Controls Panel */}
      <div className="w-full max-w-4xl glass-panel p-6 rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl mb-8 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -z-10" />

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Input Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => { setText(e.target.value.toUpperCase()); reset(); }}
            className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors text-lg tracking-widest uppercase font-mono"
            maxLength={12}
            placeholder="SECRET"
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Shift (Key: {shift})</label>
          <input
            type="range"
            min="1"
            max="25"
            value={shift}
            onChange={(e) => { setShift(Number(e.target.value)); reset(); }}
            className="w-full accent-emerald-500 mt-3"
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
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 z-10 relative ${isPlaying ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}
        >
          {isPlaying ? <Square size={20} /> : <Play size={20} />}
          {isPlaying ? "Pause" : (currentStep >= steps.length ? "Replay" : "Start Animation")}
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 z-10 relative"
        >
          <History size={20} /> Reset
        </button>
      </div>

      {/* Animation Stage */}
      <div className="w-full max-w-5xl flex flex-col items-center gap-8 relative pb-20">
        
        {/* Step Indicator */}
        {currentStep >= 0 && currentStep < steps.length && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-12 bg-white/10 px-6 py-2 rounded-full border border-white/20 text-emerald-300 font-mono font-bold tracking-widest text-lg"
          >
            Processing: '{steps[currentStep].original}' 
            {mode === 'encrypt' ? <ArrowRight className="inline mx-2" size={18} /> : <ArrowLeft className="inline mx-2" size={18} />} 
            {mode === 'encrypt' ? `+${shift}` : `-${shift}`} 
            {mode === 'encrypt' ? <ArrowRight className="inline mx-2" size={18} /> : <ArrowLeft className="inline mx-2" size={18} />} 
            '{steps[currentStep].shifted}'
          </motion.div>
        )}

        <div className="flex gap-3 flex-wrap justify-center mt-8">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              
              {/* Original Box */}
              <motion.div 
                animate={{
                  y: currentStep === i ? -10 : 0,
                  boxShadow: currentStep === i ? '0 0 30px rgba(16, 185, 129, 0.5)' : '0 0 0 rgba(0,0,0,0)',
                  borderColor: currentStep === i ? 'rgba(16, 185, 129, 1)' : 'rgba(255,255,255,0.1)'
                }}
                className={`w-16 h-20 rounded-xl flex items-center justify-center text-3xl font-black font-mono border-2 transition-all duration-300 bg-black/40 z-10 ${currentStep === i ? 'text-emerald-400' : 'text-gray-300'}`}
              >
                {s.original}
              </motion.div>

              {/* Connecting Laser */}
              <div className="h-16 w-1 relative flex justify-center z-0">
                <div className="w-0.5 h-full bg-gray-800" />
                <AnimatePresence>
                  {currentStep >= i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: '100%', opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className={`absolute top-0 w-1 rounded-full ${mode === 'encrypt' ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_10px_currentColor]`}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Result Box */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: currentStep >= i ? 1 : 0.8,
                  opacity: currentStep >= i ? 1 : 0.3,
                  borderColor: currentStep === i ? (mode === 'encrypt' ? 'rgba(16, 185, 129, 1)' : 'rgba(244, 63, 94, 1)') : (currentStep > i ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)')
                }}
                className={`w-16 h-20 rounded-xl flex items-center justify-center text-3xl font-black font-mono border-2 transition-all duration-500 shadow-xl z-10 ${currentStep >= i ? (mode === 'encrypt' ? 'bg-emerald-500/20 text-white' : 'bg-rose-500/20 text-white') : 'bg-black/20 text-transparent'}`}
              >
                {result[i]}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Sliding Alphabet Tape Overlay Animation */}
        <div className="mt-16 w-full max-w-3xl overflow-hidden glass-panel rounded-2xl p-4 border border-white/10 relative z-10 bg-black/30 backdrop-blur-md">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">Alphabet Reference Tape</div>
          
          <div className="relative h-12 flex items-center justify-center">
            {/* Top Tape (Original) */}
            <motion.div 
              className="absolute flex gap-1 whitespace-nowrap"
            >
              {alphabet.map((letter, i) => (
                <div key={i} className="w-8 h-8 flex items-center justify-center text-sm font-mono font-bold text-gray-400 border border-gray-800 rounded bg-black/50">
                  {letter}
                </div>
              ))}
            </motion.div>
          </div>
          
          <div className="relative h-12 flex items-center justify-center mt-2">
            {/* Bottom Tape (Shifted) */}
            <motion.div 
              animate={{
                x: mode === 'encrypt' ? -(shift * 36) : (shift * 36)
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute flex gap-1 whitespace-nowrap"
            >
              {[...alphabet, ...alphabet, ...alphabet].map((letter, i) => (
                <div key={i} className={`w-8 h-8 flex items-center justify-center text-sm font-mono font-bold border rounded ${i >= 26 && i < 52 ? 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-gray-600 border-gray-800 bg-black/20'}`}>
                  {letter}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
