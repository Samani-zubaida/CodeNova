import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Unlock, Play, Square, History, Cpu, ArrowRight } from 'lucide-react';

export default function AESVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [mode, setMode] = useState('encrypt');

  // Pseudo-AES states
  const steps = [
    { name: "Initial Round", desc: "AddRoundKey", state: "State Matrix ⊕ Round Key 0" },
    { name: "Round 1-9", desc: mode === 'encrypt' ? "SubBytes → ShiftRows → MixColumns → AddRoundKey" : "InvShiftRows → InvSubBytes → AddRoundKey → InvMixColumns", state: "Transforming 128-bit block" },
    { name: "Final Round", desc: mode === 'encrypt' ? "SubBytes → ShiftRows → AddRoundKey" : "InvShiftRows → InvSubBytes → AddRoundKey", state: "Final mixing (No MixColumns)" },
    { name: "Output", desc: mode === 'encrypt' ? "Ciphertext Block Generated" : "Plaintext Block Recovered", state: mode === 'encrypt' ? "0xA3 0x4F..." : "0x48 0x45..." }
  ];

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full pt-8 font-sans">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-cyan-400 drop-shadow-lg flex items-center justify-center gap-4">
          <Shield size={40} className="text-cyan-500" />
          AES-256
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Advanced Encryption Standard. A symmetric block cipher used worldwide to secure sensitive data.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="w-full max-w-4xl glass-panel p-6 rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl mb-8 flex flex-col md:flex-row gap-6 justify-center items-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -z-10" />

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-1">Mode</label>
          <div className="flex bg-black/40 rounded-xl p-1 border border-cyan-500/30">
            <button 
              onClick={() => { setMode('encrypt'); reset(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${mode === 'encrypt' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
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

      {/* Playback */}
      <div className="flex gap-4 mb-12">
        <button 
          onClick={() => {
            if (currentStep >= steps.length) reset();
            setIsPlaying(!isPlaying);
            if (currentStep === -1) setCurrentStep(0);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${isPlaying ? 'bg-amber-500 text-white' : 'bg-cyan-500 text-white'}`}
        >
          {isPlaying ? <Square size={20} /> : <Play size={20} />}
          {isPlaying ? "Pause" : (currentStep >= steps.length ? "Replay" : "Start")}
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
        >
          <History size={20} /> Reset
        </button>
      </div>

      {/* Animation Stage */}
      <div className="w-full max-w-4xl flex flex-col items-center relative pb-20">
        <div className="flex flex-col gap-4 w-full">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              animate={{ 
                opacity: currentStep >= i ? 1 : 0.2, 
                x: 0,
                scale: currentStep === i ? 1.05 : 1,
                borderColor: currentStep === i ? (mode === 'encrypt' ? 'rgba(34, 211, 238, 1)' : 'rgba(244, 63, 94, 1)') : 'rgba(255,255,255,0.1)'
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-500 flex items-center justify-between glass-panel bg-black/40 ${currentStep === i ? 'shadow-[0_0_30px_rgba(34,211,238,0.3)] z-10' : ''}`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${currentStep === i ? (mode === 'encrypt' ? 'bg-cyan-500 text-white' : 'bg-rose-500 text-white') : 'bg-gray-800 text-gray-500'}`}>
                  {i + 1}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold tracking-wider ${currentStep === i ? 'text-white' : 'text-gray-400'}`}>{step.name}</h3>
                  <p className="text-cyan-400 font-mono text-sm mt-1">{step.desc}</p>
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end">
                <Cpu size={32} className={currentStep === i ? (mode === 'encrypt' ? 'text-cyan-400' : 'text-rose-400') : 'text-gray-700'} />
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">{step.state}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
