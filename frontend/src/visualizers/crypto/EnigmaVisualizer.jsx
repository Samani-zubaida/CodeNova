import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Zap, History } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function EnigmaVisualizer() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [rotorPositions, setRotorPositions] = useState([0, 0, 0]); // Right, Middle, Left
  const [activePath, setActivePath] = useState(null); // The current letter being animated
  const [isAnimating, setIsAnimating] = useState(false);

  // Simplified Enigma logic for visualization
  // Rotors just shift the letter by some constant + their current position
  const handleKeyPress = (letter) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const newPositions = [...rotorPositions];
    newPositions[0] = (newPositions[0] + 1) % 26; // Right rotor spins every time
    if (newPositions[0] === 0) {
      newPositions[1] = (newPositions[1] + 1) % 26; // Middle spins if right completes a revolution
      if (newPositions[1] === 0) {
        newPositions[2] = (newPositions[2] + 1) % 26; // Left spins if middle completes
      }
    }
    
    setRotorPositions(newPositions);

    // Mock encryption path
    const charCode = letter.charCodeAt(0) - 65;
    
    // Simulate scrambling (just a mock math function for the visualizer to show a different letter)
    const scrambledCode = (charCode + newPositions[0] * 3 + newPositions[1] * 5 + newPositions[2] * 7 + 13) % 26;
    const finalLetter = String.fromCharCode(scrambledCode + 65);

    setActivePath({
      input: letter,
      output: finalLetter
    });

    setInputText(prev => prev + letter);
    setOutputText(prev => prev + finalLetter);

    setTimeout(() => {
      setActivePath(null);
      setIsAnimating(false);
    }, 1500); // 1.5s animation
  };

  const reset = () => {
    setInputText('');
    setOutputText('');
    setRotorPositions([0, 0, 0]);
    setActivePath(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto min-h-max pb-8 text-white font-mono">
      
      {/* Intro */}
      <div>
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Settings className="text-[var(--color-nova-brown)]" /> Enigma Machine (WWII)
        </h3>
        <p className="text-gray-400 text-sm max-w-3xl">
          An electro-mechanical rotor cipher machine. When you press a key, current flows through the plugboard, scrambles through 3 spinning rotors, hits a reflector, and flows backward to light up the ciphertext letter. 
          The rotors step (spin) after every keypress, meaning the same letter encrypted twice will yield different results!
        </p>
      </div>

      {/* Main Machine UI */}
      <div className="flex flex-col gap-8 bg-[#111] p-8 rounded-3xl border-4 border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-20">
        
        {/* The Rotors and Reflector */}
        <div className="flex items-center justify-between px-12 pb-8 border-b border-gray-800">
          
          {/* Reflector */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-32 bg-gray-700 rounded-l-full border-r-4 border-gray-900 flex items-center justify-center relative overflow-hidden">
              <span className="text-gray-400 font-bold -rotate-90 tracking-widest uppercase">Reflector</span>
              {activePath && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.5] }}
                  transition={{ duration: 1.5, times: [0, 0.4, 0.6, 1] }}
                  className="absolute inset-0 bg-[var(--color-nova-brown)] mix-blend-overlay"
                />
              )}
            </div>
          </div>

          {/* 3 Rotors */}
          <div className="flex gap-4">
            {[2, 1, 0].map((rotorIdx) => (
              <div key={rotorIdx} className="flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  {rotorIdx === 0 ? 'Right' : (rotorIdx === 1 ? 'Middle' : 'Left')}
                </span>
                <div className="w-20 h-32 bg-gradient-to-b from-gray-800 via-gray-600 to-gray-800 rounded-lg border-2 border-gray-900 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                  {/* Rotor Numbers */}
                  <div className="flex flex-col items-center text-gray-400 font-mono font-bold text-xl opacity-30">
                    <span>{String.fromCharCode(((rotorPositions[rotorIdx] + 25) % 26) + 65)}</span>
                  </div>
                  <motion.div 
                    key={rotorPositions[rotorIdx]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center text-white font-mono font-bold text-3xl my-1 bg-black/50 w-full text-center border-y border-white/20 py-1 shadow-lg"
                  >
                    {String.fromCharCode(rotorPositions[rotorIdx] + 65)}
                  </motion.div>
                  <div className="flex flex-col items-center text-gray-400 font-mono font-bold text-xl opacity-30">
                    <span>{String.fromCharCode(((rotorPositions[rotorIdx] + 1) % 26) + 65)}</span>
                  </div>

                  {/* Active Path Lightning */}
                  {activePath && (
                    <motion.div 
                      initial={{ opacity: 0, x: rotorIdx === 0 ? 50 : 0 }}
                      animate={{ opacity: [0, 1, 1, 0], x: [50, 0, 0, -50] }}
                      transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
                      className="absolute inset-0 flex items-center justify-center text-[var(--color-nova-brown)]"
                    >
                      <Zap size={32} className="animate-pulse" />
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Entry/Exit (Plugboard) */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Plugboard</span>
            <div className="w-16 h-32 bg-gray-900 rounded-lg border border-gray-700 flex flex-col items-center justify-evenly relative">
              <div className="w-4 h-4 rounded-full bg-black border border-gray-600 shadow-inner" />
              <div className="w-4 h-4 rounded-full bg-black border border-gray-600 shadow-inner" />
              <div className="w-4 h-4 rounded-full bg-black border border-gray-600 shadow-inner" />
              <div className="w-4 h-4 rounded-full bg-black border border-gray-600 shadow-inner" />
              
              {/* Wiring animation */}
              {activePath && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 bg-[var(--color-nova-brown)] mix-blend-overlay rounded-lg"
                />
              )}
            </div>
          </div>

        </div>

        {/* Lightboard (Outputs) */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Lightboard (Ciphertext)</span>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
            {ALPHABET.map(letter => (
              <div 
                key={`light-${letter}`} 
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 border-2 shadow-inner ${
                  activePath?.output === letter 
                    ? 'bg-yellow-400 text-black border-yellow-200 shadow-[0_0_30px_rgba(250,204,21,1)]' 
                    : 'bg-black text-gray-600 border-gray-800'
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard (Inputs) */}
        <div className="flex flex-col items-center gap-4 pt-8 border-t border-gray-800">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Keyboard (Plaintext)</span>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
            {ALPHABET.map(letter => (
              <button 
                key={`key-${letter}`} 
                onClick={() => handleKeyPress(letter)}
                disabled={isAnimating}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all active:translate-y-2 border-2 border-b-4 ${
                  activePath?.input === letter
                    ? 'bg-gray-700 text-white border-gray-500 border-b-2 translate-y-1'
                    : 'bg-gray-800 text-gray-300 border-gray-900 border-b-black hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Output Log */}
      <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <History size={16} /> Transmission Log
          </h4>
          <button onClick={reset} className="text-xs px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
            CLEAR
          </button>
        </div>
        
        <div className="flex gap-8">
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-xs text-gray-500 font-bold uppercase">Plaintext In</span>
            <div className="p-4 bg-black/50 border border-white/10 rounded-xl font-mono text-xl tracking-widest break-all min-h-[4rem]">
              {inputText}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-xs text-[var(--color-nova-brown)] font-bold uppercase">Ciphertext Out</span>
            <div className="p-4 bg-black/50 border border-[var(--color-nova-brown)] rounded-xl font-mono text-xl text-[var(--color-nova-brown)] tracking-widest break-all min-h-[4rem] shadow-[0_0_15px_rgba(188,162,151,0.2)]">
              {outputText}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
