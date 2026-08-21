import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function CryptoVisualizer() {
  const [shift, setShift] = useState(3);
  const [inputText, setInputText] = useState('CODE');
  const [isEncrypting, setIsEncrypting] = useState(false);

  const getShiftedChar = (char, amount) => {
    const idx = ALPHABET.indexOf(char.toUpperCase());
    if (idx === -1) return char;
    return ALPHABET[(idx + amount) % 26];
  };

  const handleEncrypt = () => {
    setIsEncrypting(true);
    setTimeout(() => setIsEncrypting(false), 2000);
  };

  return (
    <div className="w-full h-[500px] glass-card flex flex-col items-center justify-center p-8 text-white overflow-hidden relative font-mono shadow-inner">
      <h2 className="absolute top-6 left-6 text-xl font-bold text-[var(--color-nova-green)] tracking-widest">CIPHER_SHIFT</h2>
      
      <div className="flex flex-col gap-10 items-center w-full max-w-lg z-10">
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center bg-black/40 p-4 rounded-lg border border-white/10 w-full justify-between">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">INPUT (A-Z)</label>
            <input 
              maxLength={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
              className="bg-transparent border-b border-[var(--color-nova-brown)] outline-none text-xl w-32 focus:border-[var(--color-nova-red)] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1 items-center">
            <label className="text-xs text-gray-400">SHIFT: +{shift}</label>
            <input 
              type="range" 
              min="1" max="10" 
              value={shift} 
              onChange={(e) => setShift(Number(e.target.value))}
              className="w-24 accent-[var(--color-nova-green)]"
            />
          </div>
          <button 
            onClick={handleEncrypt}
            disabled={isEncrypting || !inputText}
            className="bg-[var(--color-nova-green)] text-black px-4 py-2 rounded font-bold hover:bg-white transition-colors disabled:opacity-50"
          >
            ENCRYPT
          </button>
        </div>

        {/* Visualization area */}
        <div className="flex flex-wrap justify-center gap-4">
          <AnimatePresence mode="popLayout">
            {inputText.split('').map((char, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                {/* Input Block */}
                <motion.div 
                  className="w-16 h-16 bg-black border-2 border-[var(--color-nova-brown)] flex items-center justify-center text-3xl font-bold rounded shadow-[0_0_15px_rgba(188,162,151,0.2)]"
                >
                  {char}
                </motion.div>
                
                {/* Transformation Line */}
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={isEncrypting ? { height: 40, opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.3 }}
                  className="w-1 bg-[var(--color-nova-green)] relative"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={isEncrypting ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: (i * 0.2) + 0.1 }}
                    className="absolute top-1/2 -translate-y-1/2 left-3 text-xs text-[var(--color-nova-green)]"
                  >
                    +{shift}
                  </motion.div>
                </motion.div>

                {/* Output Block */}
                <motion.div 
                  initial={{ scale: 0, rotateX: 90 }}
                  animate={isEncrypting ? { scale: 1, rotateX: 0 } : { scale: 0, rotateX: 90 }}
                  transition={{ delay: (i * 0.2) + 0.3, type: "spring" }}
                  className="w-16 h-16 bg-[var(--color-nova-red)] border-2 border-transparent flex items-center justify-center text-3xl font-bold rounded shadow-[0_0_20px_rgba(171,82,107,0.5)]"
                >
                  {getShiftedChar(char, shift)}
                </motion.div>
              </div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
