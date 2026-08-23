import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RailFenceVisualizer({ mode }) {
  const [inputText, setInputText] = useState('CODENOVA');
  const [rails, setRails] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stage, setStage] = useState('input'); // input, zigzag, read

  const isEncrypt = mode === 'encrypt';
  const actionColor = isEncrypt ? 'var(--color-nova-green)' : 'var(--color-nova-red)';

  const handleAction = () => {
    if (!inputText) return;
    setIsAnimating(true);
    setStage('zigzag');
    
    setTimeout(() => {
      setStage('read');
      setTimeout(() => setIsAnimating(false), 2000);
    }, inputText.length * 200 + 1000);
  };

  const handleReset = () => {
    setStage('input');
  };

  // Compute ZigZag layout
  const getZigZagLayout = () => {
    const layout = Array.from({ length: rails }, () => Array(inputText.length).fill(null));
    let r = 0;
    let down = false;
    for (let c = 0; c < inputText.length; c++) {
      layout[r][c] = true; // placeholder
      if (r === 0 || r === rails - 1) down = !down;
      r += down ? 1 : -1;
    }
    return layout;
  };

  const layout = getZigZagLayout();
  
  // Fill text into layout
  const filledLayout = Array.from({ length: rails }, () => Array(inputText.length).fill(null));
  let resultText = '';

  if (isEncrypt) {
    // Encrypt: fill zigzag with plaintext, read row by row
    let r = 0;
    let down = false;
    for (let c = 0; c < inputText.length; c++) {
      filledLayout[r][c] = inputText[c];
      if (r === 0 || r === rails - 1) down = !down;
      r += down ? 1 : -1;
    }
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < inputText.length; c++) {
        if (filledLayout[r][c] !== null) resultText += filledLayout[r][c];
      }
    }
  } else {
    // Decrypt: fill rows with ciphertext, read zigzag
    let idx = 0;
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < inputText.length; c++) {
        if (layout[r][c] && idx < inputText.length) {
          filledLayout[r][c] = inputText[idx++];
        }
      }
    }
    let r = 0;
    let down = false;
    for (let c = 0; c < inputText.length; c++) {
      resultText += filledLayout[r][c];
      if (r === 0 || r === rails - 1) down = !down;
      r += down ? 1 : -1;
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto h-full">
      
      {/* Intro Text */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Rail Fence Cipher</h3>
        <p className="text-gray-400 text-sm">
          A transposition cipher that writes data in a zig-zag pattern over a set number of rails.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-end bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">
            {isEncrypt ? 'Plaintext' : 'Ciphertext'}
          </label>
          <input 
            maxLength={15}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value.toUpperCase().replace(/\s/g, ''));
              setStage('input');
            }}
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none text-xl w-48 focus:border-[var(--color-nova-brown)] transition-colors"
          />
        </div>
        
        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Rails</label>
            <span className="text-[var(--color-nova-brown)] font-bold">{rails}</span>
          </div>
          <input 
            type="range" 
            min="2" max="6" 
            value={rails} 
            onChange={(e) => {
              setRails(Number(e.target.value));
              setStage('input');
            }}
            className="w-full accent-[var(--color-nova-brown)] cursor-pointer"
          />
        </div>

        <button 
          onClick={stage === 'input' ? handleAction : handleReset}
          disabled={isAnimating || !inputText}
          style={{ backgroundColor: stage === 'input' ? actionColor : '#333' }}
          className="text-black px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,0,0,0.3)] ml-auto"
        >
          {stage === 'input' ? (isEncrypt ? 'ENCRYPT' : 'DECRYPT') : 'RESET'}
        </button>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center gap-12 p-8 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden">
        
        {/* Rail Grid */}
        <div className="relative">
          {stage !== 'input' && (
            <div className="flex flex-col gap-2">
              {filledLayout.map((row, r) => (
                <div key={`row-${r}`} className="flex gap-2 relative">
                  {/* Rail Line */}
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2" />
                  
                  {row.map((char, c) => (
                    <div key={`cell-${r}-${c}`} className="w-12 h-12 relative flex items-center justify-center z-10">
                      {char && stage !== 'input' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0, y: isEncrypt ? -20 : 0 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: stage === 'read' ? (isEncrypt ? 0 : (r % 2 === 0 ? 10 : -10)) : 0 
                          }}
                          transition={{ 
                            delay: stage === 'zigzag' ? (isEncrypt ? c * 0.2 : (r * inputText.length + c) * 0.05) : 0,
                            type: 'spring'
                          }}
                          style={{ borderColor: actionColor, color: stage === 'read' ? actionColor : 'white' }}
                          className="w-10 h-10 bg-black border-2 rounded-lg flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        >
                          {char}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {stage === 'input' && (
             <div className="text-gray-500 font-mono text-sm tracking-widest uppercase">
               Click {isEncrypt ? 'Encrypt' : 'Decrypt'} to visualize the transposition.
             </div>
          )}
        </div>

        {/* Output Area */}
        <AnimatePresence>
          {stage === 'read' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-black border border-white/10 rounded-xl shadow-2xl flex flex-col items-center text-center gap-2"
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest">{isEncrypt ? 'Encrypted Output' : 'Decrypted Plaintext'}</span>
              <span className="text-3xl font-bold tracking-[0.2em]" style={{ color: actionColor }}>
                {resultText}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
