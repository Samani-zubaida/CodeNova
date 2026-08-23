import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Play, RotateCcw, FastForward, ArrowRight } from 'lucide-react';

// Mock initial 4x4 state matrix for a 128-bit block (16 bytes)
const INITIAL_STATE = [
  ['32', '88', '31', 'e0'],
  ['43', '5a', '31', '37'],
  ['f6', '30', '98', '07'],
  ['a8', '8d', 'a2', '34']
];

// Mock values for transformations to show it changing visually
const SUB_BYTES_STATE = [
  ['23', 'c4', 'c7', 'e1'],
  ['1a', 'be', 'c7', '9a'],
  ['42', '04', '46', 'c5'],
  ['c2', '5d', '3a', '18']
];

const SHIFT_ROWS_STATE = [
  ['23', 'c4', 'c7', 'e1'],  // Row 0: shift 0
  ['be', 'c7', '9a', '1a'],  // Row 1: shift 1 left
  ['46', 'c5', '42', '04'],  // Row 2: shift 2 left
  ['18', 'c2', '5d', '3a']   // Row 3: shift 3 left
];

const MIX_COLUMNS_STATE = [
  ['d4', 'e0', 'b8', '1e'],
  ['bf', 'b4', '41', '27'],
  ['5d', '52', '11', '98'],
  ['30', 'ae', 'f1', 'e5']
];

const ADD_ROUND_KEY_STATE = [
  ['a4', '9c', '7f', 'f2'],
  ['68', '9f', '35', '2b'],
  ['6b', '5b', 'ea', '43'],
  ['c6', '76', '05', '9a']
];

const STEPS = [
  { name: 'Initial State', matrix: INITIAL_STATE, desc: 'The 128-bit block of plaintext is divided into a 4x4 matrix of bytes.' },
  { name: '1. SubBytes', matrix: SUB_BYTES_STATE, desc: 'Non-linear substitution. Every byte is replaced with another byte using a lookup table (S-Box) to provide confusion.' },
  { name: '2. ShiftRows', matrix: SHIFT_ROWS_STATE, desc: 'Transposition step. Row 0 is shifted 0 spaces. Row 1 is shifted 1 space left. Row 2 by 2, Row 3 by 3. This provides diffusion.' },
  { name: '3. MixColumns', matrix: MIX_COLUMNS_STATE, desc: 'Matrix multiplication. Each column is multiplied by a fixed polynomial matrix, thoroughly mixing the bytes vertically.' },
  { name: '4. AddRoundKey', matrix: ADD_ROUND_KEY_STATE, desc: 'Bitwise XOR. The state matrix is XORed with the Round Key derived from the Master Key. This is the only step that uses the secret key.' }
];

export default function AESVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const activeStep = STEPS[currentStep];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto min-h-max pb-8 text-white font-mono">
      
      {/* Intro */}
      <div>
        <h3 className="text-2xl font-bold mb-2 text-[var(--color-nova-cyan)] flex items-center gap-2">
          <Shield /> AES-256 (Advanced Encryption Standard)
        </h3>
        <p className="text-gray-400 text-sm max-w-4xl">
          Unlike Caesar or Vigenère which operate on single letters, AES is a <strong>Block Cipher</strong>. It encrypts data in 128-bit chunks (16 bytes) at a time, arranged in a 4x4 matrix. 
          It runs through multiple "Rounds" (14 rounds for AES-256). Below is an interactive breakdown of exactly what happens inside a single round!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Steps Tracker */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col gap-4">
            
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Round Breakdown</h4>
            
            <div className="flex flex-col gap-2">
              {STEPS.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`text-left px-4 py-3 rounded-xl transition-all duration-300 font-bold border-l-4 ${
                    currentStep === idx 
                      ? 'bg-[var(--color-nova-cyan)]/20 text-[var(--color-nova-cyan)] border-[var(--color-nova-cyan)]' 
                      : 'bg-black/40 text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {step.name}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
              <button 
                onClick={handleReset}
                className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <RotateCcw size={16} /> Reset
              </button>
              
              <button 
                onClick={handleNext}
                disabled={currentStep === STEPS.length - 1}
                className="px-6 py-3 bg-[var(--color-nova-cyan)] text-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Matrix Visualization */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Explanation Tooltip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-black/60 p-6 rounded-2xl border border-[var(--color-nova-cyan)]/30 text-gray-300 shadow-xl"
            >
              <h4 className="text-xl font-bold text-[var(--color-nova-cyan)] mb-2">{activeStep.name}</h4>
              <p className="leading-relaxed font-sans">{activeStep.desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* 4x4 State Matrix */}
          <div className="flex-1 flex items-center justify-center p-8 bg-black/30 rounded-2xl border border-white/5 relative">
            <div className="grid grid-rows-4 gap-3">
              {activeStep.matrix.map((row, rIdx) => (
                <div key={`row-${rIdx}`} className="flex gap-3 relative">
                  
                  {/* ShiftRows Row Indicators */}
                  {currentStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute -left-20 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--color-nova-cyan)] uppercase whitespace-nowrap"
                    >
                      Shift {rIdx}
                    </motion.div>
                  )}

                  <AnimatePresence mode="popLayout">
                    {row.map((hex, cIdx) => {
                      
                      // Calculate animations based on current step
                      let initialParams = { opacity: 0, scale: 0.8 };
                      let animateParams = { opacity: 1, scale: 1 };
                      let transitionParams = { type: 'spring', stiffness: 300, damping: 25 };

                      if (currentStep === 1) {
                        // SubBytes: Pop effect
                        initialParams = { rotateY: 90, opacity: 0 };
                        animateParams = { rotateY: 0, opacity: 1 };
                        transitionParams = { delay: (rIdx * 4 + cIdx) * 0.05 };
                      } else if (currentStep === 2) {
                        // ShiftRows: Slide from right
                        initialParams = { x: 50, opacity: 0 };
                        animateParams = { x: 0, opacity: 1 };
                        transitionParams = { delay: rIdx * 0.2 };
                      } else if (currentStep === 3) {
                        // MixColumns: Slide from top column by column
                        initialParams = { y: -50, opacity: 0 };
                        animateParams = { y: 0, opacity: 1 };
                        transitionParams = { delay: cIdx * 0.2 };
                      } else if (currentStep === 4) {
                        // AddRoundKey: XOR pulse
                        initialParams = { scale: 1.2, backgroundColor: '#22d3ee' };
                        animateParams = { scale: 1, backgroundColor: '#111827' };
                        transitionParams = { delay: (rIdx * 4 + cIdx) * 0.05, duration: 0.5 };
                      }

                      return (
                        <motion.div
                          key={`cell-${currentStep}-${rIdx}-${cIdx}`}
                          layout
                          initial={initialParams}
                          animate={animateParams}
                          transition={transitionParams}
                          className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-900 border border-gray-700 rounded-xl text-xl sm:text-2xl font-bold text-[var(--color-nova-cyan)] shadow-inner relative group hover:border-[var(--color-nova-cyan)]/50 transition-colors"
                        >
                          {hex.toUpperCase()}
                          <span className="absolute bottom-1 right-2 text-[8px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            {rIdx},{cIdx}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            {/* Mix Columns Overlay Indicator */}
            {currentStep === 3 && (
              <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
                <div className="w-[360px] h-[360px] flex gap-3 p-8">
                  {[0, 1, 2, 3].map(col => (
                    <motion.div
                      key={`mix-col-${col}`}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ delay: col * 0.2, duration: 0.3 }}
                      className="flex-1 bg-[var(--color-nova-cyan)]/10 border-x border-[var(--color-nova-cyan)]/30 rounded-lg origin-top"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
