import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ArrowRight, Play, Square, History, Unlock, Lock, Server, User, GitMerge } from 'lucide-react';

export default function DHVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0); 

  // DH Parameters
  const [p, setP] = useState(23); // Prime
  const [g, setG] = useState(5);  // Generator
  
  const [a, setA] = useState(6);  // Alice Private
  const [b, setB] = useState(15); // Bob Private

  // Calculated values
  const A = Math.pow(g, a) % p; // Alice Public
  const B = Math.pow(g, b) % p; // Bob Public
  
  const aliceSharedSecret = Math.pow(B, a) % p;
  const bobSharedSecret = Math.pow(A, b) % p;

  const totalSteps = 8; // 0 to 7

  const reset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && step < totalSteps - 1) {
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 2000); // 2 seconds per step for reading
    } else if (step >= totalSteps - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full pt-8 font-sans pb-20 overflow-x-hidden">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-emerald-400 drop-shadow-lg flex items-center justify-center gap-4">
          <GitMerge size={40} className="text-emerald-500" />
          Diffie-Hellman Key Exchange
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Securely establish a shared secret over an insecure channel. Watch how Alice and Bob combine their private keys with public parameters to generate the identical symmetric key.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="w-full max-w-4xl glass-panel p-6 rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl mb-8 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -z-10" />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Prime (p)</label>
          <input
            type="number"
            value={p}
            onChange={(e) => { setP(Number(e.target.value)); reset(); }}
            className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-400 font-mono"
            disabled={isPlaying || step > 0}
          />
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Generator (g)</label>
          <input
            type="number"
            value={g}
            onChange={(e) => { setG(Number(e.target.value)); reset(); }}
            className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-400 font-mono"
            disabled={isPlaying || step > 0}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs font-semibold text-pink-300 uppercase tracking-wider">Alice's Pvt Key (a)</label>
          <input
            type="number"
            value={a}
            onChange={(e) => { setA(Number(e.target.value)); reset(); }}
            className="w-full bg-black/40 border border-pink-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-pink-400 font-mono"
            disabled={isPlaying || step > 0}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Bob's Pvt Key (b)</label>
          <input
            type="number"
            value={b}
            onChange={(e) => { setB(Number(e.target.value)); reset(); }}
            className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
            disabled={isPlaying || step > 0}
          />
        </div>
      </div>

      {/* Playback */}
      <div className="flex gap-4 mb-12 relative z-10">
        <button 
          onClick={() => {
            if (step >= totalSteps - 1) reset();
            setIsPlaying(!isPlaying);
          }}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-lg ${isPlaying ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}
        >
          {isPlaying ? <Square size={20} /> : <Play size={20} />}
          {isPlaying ? "Pause Simulation" : (step >= totalSteps - 1 ? "Replay Simulation" : "Start Simulation")}
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-4 rounded-full font-bold transition-all bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
        >
          <History size={20} /> Reset
        </button>
      </div>

      {/* Animation Stage - Two Columns */}
      <div className="w-full max-w-6xl relative flex flex-col md:flex-row justify-between items-start gap-4 px-4 min-h-[500px]">
        
        {/* Background Track indicating Network */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500/0 via-yellow-500/20 to-cyan-500/0 -translate-y-1/2 hidden md:block border-t border-dashed border-white/10" />

        {/* ALICE (Sender) */}
        <div className="w-full md:w-[40%] flex flex-col items-center relative">
          <div className="flex items-center gap-3 mb-6 bg-pink-500/10 border border-pink-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.2)]">
            <User className="text-pink-400" />
            <h2 className="text-2xl font-black text-pink-400 tracking-wider">ALICE</h2>
          </div>

          <div className="flex flex-col gap-6 w-full items-center relative">
            
            {/* Alice Private Key */}
            <motion.div 
              animate={{
                scale: step === 0 ? 1.05 : 1,
                opacity: step >= 0 ? 1 : 0.3
              }}
              className="glass-card p-4 border border-pink-500/30 rounded-xl bg-pink-900/20 flex flex-col items-center gap-2 w-[240px] shadow-lg relative z-20"
            >
              <Lock size={28} className="text-pink-400" />
              <div className="text-center">
                <p className="text-[10px] text-pink-400/80 uppercase tracking-widest font-bold">1. Secret Key (a)</p>
                <p className="text-2xl font-mono font-black mt-1 text-pink-300">{a}</p>
              </div>
            </motion.div>

            {/* Public Key Generation */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: step >= 3 ? 0.4 : 1, 
                    scale: step === 1 ? 1.05 : 1,
                  }}
                  className="glass-card p-4 border border-yellow-500/30 rounded-xl bg-yellow-900/20 flex flex-col items-center gap-2 w-[240px] shadow-lg relative z-20"
                >
                  <Unlock size={28} className="text-yellow-400" />
                  <div className="text-center">
                    <p className="text-[10px] text-yellow-400/80 uppercase tracking-widest font-bold">2. Calculate Public Key (A)</p>
                    <p className="text-xs font-mono font-bold mt-1 text-yellow-200">A = g^a mod p</p>
                    <p className="text-xs font-mono mt-1 text-yellow-200/70">A = {g}^{a} mod {p}</p>
                    <p className="text-2xl font-mono font-black mt-2 text-yellow-400">{A}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Secret Generation */}
            <AnimatePresence>
              {step >= 6 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: step === 6 ? 1.05 : 1,
                  }}
                  className="glass-card p-4 border border-emerald-500/50 rounded-xl bg-emerald-900/20 flex flex-col items-center gap-2 w-[240px] shadow-[0_0_30px_rgba(16,185,129,0.3)] relative z-20 mt-16"
                >
                  <KeyRound size={32} className="text-emerald-400" />
                  <div className="text-center">
                    <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-bold">4. Shared Secret</p>
                    <p className="text-xs font-mono font-bold mt-1 text-emerald-200">S = B^a mod p</p>
                    <p className="text-xs font-mono mt-1 text-emerald-200/70">S = {B}^{a} mod {p}</p>
                    <p className="text-4xl font-mono font-black mt-2 text-emerald-400">{aliceSharedSecret}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* NETWORK TRANSIT */}
        <div className="w-full md:w-[20%] flex flex-col items-center justify-center py-12 md:py-0 relative min-h-[300px]">
          
          <div className="absolute top-1/3 text-gray-600 uppercase tracking-widest text-xs font-bold mb-4 flex items-center gap-2">
            <Server size={14} /> The Internet
          </div>

          <AnimatePresence>
            {step >= 3 && step < 5 && (
              <>
                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 100, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="absolute top-1/2 -translate-y-12 z-30"
                >
                  <div className="p-2 rounded-xl border border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] flex flex-col items-center gap-1 text-xs font-bold whitespace-nowrap bg-black/80">
                    <span className="text-[10px] text-yellow-500/70 uppercase">Alice's Public (A)</span>
                    <span className="text-lg font-mono text-yellow-400">{A}</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: -100, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="absolute top-1/2 translate-y-12 z-30"
                >
                  <div className="p-2 rounded-xl border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] flex flex-col items-center gap-1 text-xs font-bold whitespace-nowrap bg-black/80">
                    <span className="text-[10px] text-blue-500/70 uppercase">Bob's Public (B)</span>
                    <span className="text-lg font-mono text-blue-400">{B}</span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Final Match Indicator */}
          <AnimatePresence>
            {step >= 7 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-0 p-4 bg-emerald-500/20 border border-emerald-500 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center"
              >
                <div className="text-emerald-400 font-black flex items-center gap-2">
                  Match! <KeyRound size={20} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* BOB (Receiver) */}
        <div className="w-full md:w-[40%] flex flex-col items-center relative">
          <div className="flex items-center gap-3 mb-6 bg-cyan-500/10 border border-cyan-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <User className="text-cyan-400" />
            <h2 className="text-2xl font-black text-cyan-400 tracking-wider">BOB</h2>
          </div>

          <div className="flex flex-col gap-6 w-full items-center relative">
            
            {/* Bob Private Key */}
            <motion.div 
              animate={{
                scale: step === 0 ? 1.05 : 1,
                opacity: step >= 0 ? 1 : 0.3
              }}
              className="glass-card p-4 border border-cyan-500/30 rounded-xl bg-cyan-900/20 flex flex-col items-center gap-2 w-[240px] shadow-lg relative z-20"
            >
              <Lock size={28} className="text-cyan-400" />
              <div className="text-center">
                <p className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-bold">1. Secret Key (b)</p>
                <p className="text-2xl font-mono font-black mt-1 text-cyan-300">{b}</p>
              </div>
            </motion.div>

            {/* Public Key Generation */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: step >= 4 ? 0.4 : 1, 
                    scale: step === 2 ? 1.05 : 1,
                  }}
                  className="glass-card p-4 border border-blue-500/30 rounded-xl bg-blue-900/20 flex flex-col items-center gap-2 w-[240px] shadow-lg relative z-20"
                >
                  <Unlock size={28} className="text-blue-400" />
                  <div className="text-center">
                    <p className="text-[10px] text-blue-400/80 uppercase tracking-widest font-bold">2. Calculate Public Key (B)</p>
                    <p className="text-xs font-mono font-bold mt-1 text-blue-200">B = g^b mod p</p>
                    <p className="text-xs font-mono mt-1 text-blue-200/70">B = {g}^{b} mod {p}</p>
                    <p className="text-2xl font-mono font-black mt-2 text-blue-400">{B}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Secret Generation */}
            <AnimatePresence>
              {step >= 6 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: step === 6 ? 1.05 : 1,
                  }}
                  className="glass-card p-4 border border-emerald-500/50 rounded-xl bg-emerald-900/20 flex flex-col items-center gap-2 w-[240px] shadow-[0_0_30px_rgba(16,185,129,0.3)] relative z-20 mt-16"
                >
                  <KeyRound size={32} className="text-emerald-400" />
                  <div className="text-center">
                    <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-bold">4. Shared Secret</p>
                    <p className="text-xs font-mono font-bold mt-1 text-emerald-200">S = A^b mod p</p>
                    <p className="text-xs font-mono mt-1 text-emerald-200/70">S = {A}^{b} mod {p}</p>
                    <p className="text-4xl font-mono font-black mt-2 text-emerald-400">{bobSharedSecret}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
