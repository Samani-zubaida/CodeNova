import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Unlock, Crosshair, AlertTriangle } from 'lucide-react';

// Standard English letter frequencies (A-Z) in percentages
const englishFrequencies = [
  8.17, 1.49, 2.78, 4.25, 12.70, 2.23, 2.02, 6.09, 6.97, 0.15, 0.77, 4.03, 2.41,
  6.75, 7.51, 1.93, 0.09, 5.99, 6.33, 9.06, 2.76, 0.98, 2.36, 0.15, 1.97, 0.07
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// The secret plaintext
const plaintext = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG AND EVERYONE CHEERS BECAUSE CRYPTOGRAPHY IS AWESOME";
const SECRET_SHIFT = 7;

export default function HackerModeVisualizer() {
  const [shiftGuess, setShiftGuess] = useState(0); // 0 to 25
  const [isCracked, setIsCracked] = useState(false);
  const [ciphertext, setCiphertext] = useState('');
  const [cipherFrequencies, setCipherFrequencies] = useState(Array(26).fill(0));

  useEffect(() => {
    // Generate ciphertext with secret shift
    let cipher = '';
    const counts = Array(26).fill(0);
    let letterCount = 0;

    for (let i = 0; i < plaintext.length; i++) {
      const char = plaintext[i];
      if (char >= 'A' && char <= 'Z') {
        const charCode = char.charCodeAt(0) - 65;
        const newCode = (charCode + SECRET_SHIFT) % 26;
        cipher += String.fromCharCode(newCode + 65);
        counts[newCode]++;
        letterCount++;
      } else {
        cipher += char;
      }
    }
    
    // Calculate percentages
    const freqs = counts.map(c => (c / letterCount) * 100);
    
    setCiphertext(cipher);
    setCipherFrequencies(freqs);
  }, []);

  useEffect(() => {
    // Check if cracked (guess + shift = 26 or guess matches secret)
    // Actually, if we shift the ciphertext back by guess, we want guess == SECRET_SHIFT
    if (shiftGuess === SECRET_SHIFT) {
      setIsCracked(true);
    } else {
      setIsCracked(false);
    }
  }, [shiftGuess]);

  // Decode text based on current shift guess
  const decodedText = ciphertext.split('').map(char => {
    if (char >= 'A' && char <= 'Z') {
      let newCode = (char.charCodeAt(0) - 65 - shiftGuess);
      if (newCode < 0) newCode += 26;
      return String.fromCharCode(newCode + 65);
    }
    return char;
  }).join('');

  // Shift the frequency array for visualization based on guess
  const shiftedCipherFreqs = [...cipherFrequencies];
  for (let i = 0; i < shiftGuess; i++) {
    const first = shiftedCipherFreqs.shift();
    shiftedCipherFreqs.push(first);
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto min-h-max pb-8 text-white font-mono">
      
      {/* Intro */}
      <div>
        <h3 className="text-2xl font-bold mb-2 text-[var(--color-nova-red)] flex items-center gap-2">
          <Crosshair /> Hacker Mode: Frequency Analysis
        </h3>
        <p className="text-gray-400 text-sm max-w-3xl">
          You have intercepted an encrypted message. Since different letters are used more often in English (like 'E' and 'T'), you can crack simple substitution ciphers by analyzing the frequency of letters. 
          Use the slider to shift the intercepted frequencies until they align with standard English.
        </p>
      </div>

      {/* Controls & Ciphertext */}
      <div className="flex flex-col gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg relative z-20">
        
        <div className="flex items-center gap-4">
          <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase w-32">
            Ciphertext:
          </label>
          <div className="flex-1 font-mono text-red-400 break-words opacity-80">
            {ciphertext}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-xs text-[var(--color-nova-green)] font-semibold tracking-widest uppercase w-32 flex items-center gap-1">
            {isCracked ? <Unlock size={14} /> : <AlertTriangle size={14} className="text-yellow-500" />}
            Decoding:
          </label>
          <div className={`flex-1 font-mono break-words transition-colors ${isCracked ? 'text-[var(--color-nova-green)] font-bold' : 'text-gray-500'}`}>
            {decodedText}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-6">
          <label className="text-sm font-bold w-32">Shift Guess: {shiftGuess}</label>
          <input 
            type="range" 
            min="0" 
            max="25" 
            value={shiftGuess} 
            onChange={(e) => setShiftGuess(parseInt(e.target.value))}
            className="flex-1 accent-[var(--color-nova-red)] cursor-pointer"
          />
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 flex flex-col gap-8 p-8 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden">
        
        {/* English Frequencies */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Standard English Frequency (Target)</h4>
          <div className="flex items-end justify-center h-48 gap-1 border-b border-gray-600 pb-2">
            {ALPHABET.map((letter, i) => (
              <div key={letter} className="flex flex-col items-center flex-1">
                <motion.div 
                  className="w-full bg-blue-500/50 border border-blue-400 rounded-t-sm"
                  style={{ height: `${englishFrequencies[i] * 3}px` }}
                />
                <span className="text-[10px] mt-1 text-gray-400">{letter}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ciphertext Frequencies */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-[var(--color-nova-red)] uppercase tracking-widest text-center">Intercepted Ciphertext Frequency</h4>
          <div className="flex items-end justify-center h-48 gap-1 border-b border-gray-600 pb-2 relative">
            
            {/* Success Overlay */}
            {isCracked && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <div className="px-8 py-4 bg-[var(--color-nova-green)] text-black font-bold text-2xl rounded-xl shadow-[0_0_40px_rgba(197,206,174,0.6)] flex items-center gap-3">
                  <Unlock /> CIPHER CRACKED!
                </div>
              </motion.div>
            )}

            {ALPHABET.map((letter, i) => (
              <div key={letter} className="flex flex-col items-center flex-1">
                <motion.div 
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`w-full rounded-t-sm border ${isCracked ? 'bg-[var(--color-nova-green)] border-green-300' : 'bg-red-500/80 border-red-400'}`}
                  style={{ height: `${shiftedCipherFreqs[i] * 3}px` }}
                />
                <span className={`text-[10px] mt-1 font-bold ${isCracked ? 'text-[var(--color-nova-green)]' : 'text-red-400'}`}>
                  {String.fromCharCode(((i + shiftGuess) % 26) + 65)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
