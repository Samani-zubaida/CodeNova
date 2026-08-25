import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Basic pseudo-SHA-256 for visualization purposes
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function HashVisualizer() {
  const [inputText, setInputText] = useState('hello');
  const [hash, setHash] = useState('');
  const [prevHash, setPrevHash] = useState('');

  useEffect(() => {
    let active = true;
    const computeHash = async () => {
      const result = await digestMessage(inputText || ' ');
      if (active) {
        setPrevHash(hash);
        setHash(result);
      }
    };
    computeHash();
    return () => { active = false; };
  }, [inputText]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto h-full">
      {/* Intro Text */}
      <div>
        <h3 className="text-2xl font-bold mb-2 text-[var(--color-nova-brown)]">SHA-256 Hashing</h3>
        <p className="text-gray-400 text-sm">
          A cryptographic hash function that produces a fixed-size 256-bit (64-character) hash. Notice the <strong>Avalanche Effect</strong>: changing even one letter completely scrambles the output.
        </p>
      </div>

      {/* Input Area */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col gap-4">
        <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Input Data</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type anything here..."
          className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-lg font-mono outline-none focus:border-[var(--color-nova-brown)] transition-colors min-h-[100px] resize-none"
        />
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-8 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden">
        
        {/* Waterfall/Avalanche Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          {inputText && (
            <motion.div
              key={inputText}
              initial={{ y: -100 }}
              animate={{ y: '100%' }}
              transition={{ duration: 1, ease: "linear" }}
              className="w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-nova-brown)] to-transparent"
            />
          )}
        </div>

        {/* Output Hash Grid */}
        <div className="relative z-10 w-full max-w-3xl flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[var(--color-nova-brown)] font-bold tracking-widest uppercase">256-Bit Hash Digest</span>
            <span className="text-xs text-gray-500">{hash.length} Characters</span>
          </div>
          
          <div className="grid grid-cols-8 md:grid-cols-16 gap-2">
            <AnimatePresence mode="popLayout">
              {hash.split('').map((char, i) => {
                const isChanged = prevHash && prevHash[i] !== char;
                return (
                  <motion.div
                    key={`${i}-${char}`}
                    initial={{ opacity: 0, scale: 0, rotateX: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: i * 0.01 // Stagger effect
                    }}
                    className={`aspect-square flex items-center justify-center rounded border font-mono text-lg font-bold shadow-sm transition-colors duration-300 ${
                      isChanged 
                        ? 'bg-[var(--color-nova-brown)]/20 border-[var(--color-nova-brown)] text-white' 
                        : 'bg-black/80 border-white/10 text-gray-400'
                    }`}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
