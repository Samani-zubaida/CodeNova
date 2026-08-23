import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ShieldCheck, Globe, User } from 'lucide-react';

export default function DHVisualizer() {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Math parameters (small numbers for visualization)
  const p = 23; // Prime
  const g = 5;  // Base
  const a = 4;  // Alice Secret
  const b = 3;  // Bob Secret

  const A = Math.pow(g, a) % p; // Alice Public = 5^4 mod 23 = 4
  const B = Math.pow(g, b) % p; // Bob Public = 5^3 mod 23 = 10

  const S_Alice = Math.pow(B, a) % p; // 10^4 mod 23 = 18
  const S_Bob = Math.pow(A, b) % p;   // 4^3 mod 23 = 18

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto min-h-max text-white font-mono pb-8">
      
      {/* Intro */}
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-[var(--color-nova-brown)]">Diffie-Hellman Key Exchange</h3>
          <p className="text-gray-400 text-sm max-w-2xl">
            Allows two parties to jointly establish a shared secret key over an insecure channel. 
            Eve (an eavesdropper) can see the public variables, but cannot compute the shared secret!
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={reset} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-bold">
            RESET
          </button>
          <button 
            onClick={nextStep} 
            disabled={step === 4 || isAnimating}
            className="px-6 py-2 bg-[var(--color-nova-brown)] text-black rounded-lg transition-all hover:brightness-110 disabled:opacity-50 text-sm font-bold shadow-[0_0_15px_rgba(240,226,164,0.3)]"
          >
            {step === 4 ? 'COMPLETE' : 'NEXT STEP'}
          </button>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 min-h-[500px] flex gap-4 p-4 rounded-2xl relative overflow-hidden">
        
        {/* Alice (Left) */}
        <div className="flex-1 bg-black/40 border border-blue-500/30 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-[inset_0_0_50px_rgba(59,130,246,0.1)]">
          <div className="flex items-center gap-3 mb-6 border-b border-blue-500/20 pb-4">
            <div className="p-3 bg-blue-500/20 rounded-full"><User size={24} className="text-blue-400" /></div>
            <h2 className="text-xl font-bold text-blue-400 tracking-widest uppercase">Alice</h2>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <AnimatePresence>
              {step >= 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                  <span className="text-xs text-blue-300 uppercase">Private Secret (a)</span>
                  <div className="text-2xl font-bold text-white mt-1">a = {a}</div>
                </motion.div>
              )}
              {step >= 2 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <span className="text-xs text-gray-400 uppercase">Compute Public Value (A)</span>
                  <div className="text-sm font-bold text-gray-300 mt-1">A = gª mod p</div>
                  <div className="text-lg font-bold text-blue-400 mt-1">A = {g}⁴ mod {p} = {A}</div>
                </motion.div>
              )}
              {step >= 4 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-auto bg-green-900/30 p-4 rounded-lg border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <span className="text-xs text-green-400 uppercase font-bold flex items-center gap-2"><ShieldCheck size={14}/> Shared Secret</span>
                  <div className="text-sm font-bold text-gray-300 mt-1">S = Bª mod p</div>
                  <div className="text-2xl font-bold text-green-400 mt-1">S = {B}⁴ mod {p} = {S_Alice}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Public Channel (Middle) */}
        <div className="w-64 bg-black/80 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-start relative z-10">
          <div className="flex flex-col items-center gap-2 mb-8">
            <Globe size={32} className="text-gray-500" />
            <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase text-center">Public Channel</h2>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="bg-white/10 p-3 rounded border border-white/20 text-center">
              <span className="text-[10px] text-gray-400 uppercase block mb-1">Public Prime (p)</span>
              <span className="font-bold text-white text-xl">p = {p}</span>
            </div>
            <div className="bg-white/10 p-3 rounded border border-white/20 text-center">
              <span className="text-[10px] text-gray-400 uppercase block mb-1">Public Base (g)</span>
              <span className="font-bold text-white text-xl">g = {g}</span>
            </div>
          </div>

          {/* Animated Exchange Paths */}
          <div className="absolute top-[250px] left-0 w-full h-32 flex flex-col justify-between">
            <AnimatePresence>
              {step === 3 && (
                <>
                  <motion.div 
                    initial={{ x: -150, opacity: 0 }}
                    animate={{ x: 300, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, ease: "linear" }}
                    className="absolute top-0 w-12 h-12 bg-blue-500/20 border border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-50"
                  >
                    A={A}
                  </motion.div>
                  <motion.div 
                    initial={{ x: 150, opacity: 0 }}
                    animate={{ x: -300, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, ease: "linear" }}
                    className="absolute bottom-0 right-0 w-12 h-12 bg-purple-500/20 border border-purple-500 rounded-full flex items-center justify-center font-bold text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-50"
                  >
                    B={B}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bob (Right) */}
        <div className="flex-1 bg-black/40 border border-purple-500/30 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-[inset_0_0_50px_rgba(168,85,247,0.1)]">
          <div className="flex items-center gap-3 mb-6 border-b border-purple-500/20 pb-4 justify-end">
            <h2 className="text-xl font-bold text-purple-400 tracking-widest uppercase">Bob</h2>
            <div className="p-3 bg-purple-500/20 rounded-full"><User size={24} className="text-purple-400" /></div>
          </div>

          <div className="flex flex-col gap-4 flex-1 items-end text-right">
            <AnimatePresence>
              {step >= 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30 w-full">
                  <span className="text-xs text-purple-300 uppercase">Private Secret (b)</span>
                  <div className="text-2xl font-bold text-white mt-1">b = {b}</div>
                </motion.div>
              )}
              {step >= 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 p-4 rounded-lg border border-white/10 w-full">
                  <span className="text-xs text-gray-400 uppercase">Compute Public Value (B)</span>
                  <div className="text-sm font-bold text-gray-300 mt-1">B = gᵇ mod p</div>
                  <div className="text-lg font-bold text-purple-400 mt-1">B = {g}³ mod {p} = {B}</div>
                </motion.div>
              )}
              {step >= 4 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-auto bg-green-900/30 p-4 rounded-lg border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)] w-full">
                  <span className="text-xs text-green-400 uppercase font-bold flex items-center justify-end gap-2"><ShieldCheck size={14}/> Shared Secret</span>
                  <div className="text-sm font-bold text-gray-300 mt-1">S = Aᵇ mod p</div>
                  <div className="text-2xl font-bold text-green-400 mt-1">S = {A}³ mod {p} = {S_Bob}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map(s => (
            <div key={s} className={`h-2 rounded-full transition-all duration-500 ${s <= step ? 'w-12 bg-[var(--color-nova-brown)]' : 'w-4 bg-white/20'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
