import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, EyeOff, Search } from 'lucide-react';

// Helper to convert text to binary string
const textToBinary = (text) => {
  return text.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('');
};

const binaryToText = (binary) => {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte.length === 8) text += String.fromCharCode(parseInt(byte, 2));
  }
  return text;
};

// Initial generic image grid (4x4 = 16 pixels)
const initialGrid = [
  [ [120, 45, 200], [122, 47, 198], [118, 42, 201], [125, 48, 195] ],
  [ [121, 44, 199], [123, 46, 202], [119, 43, 197], [124, 49, 196] ],
  [ [118, 43, 201], [121, 45, 199], [120, 44, 200], [122, 47, 198] ],
  [ [122, 46, 198], [120, 44, 200], [123, 45, 199], [119, 43, 201] ],
];

export default function SteganographyVisualizer({ mode }) {
  const [inputText, setInputText] = useState('HI');
  const [stage, setStage] = useState('input'); // input, binary, inject, result
  const [isAnimating, setIsAnimating] = useState(false);

  const isHide = mode === 'encrypt'; // Encrypt = Hide
  const actionColor = isHide ? 'var(--color-nova-green)' : 'var(--color-nova-red)';

  const binaryString = textToBinary(inputText.padEnd(2, ' ')).substring(0, 16); // Only 16 bits fit in our 16 pixels (modifying Blue channel)

  const handleAction = () => {
    if (!inputText) return;
    setIsAnimating(true);
    setStage('binary');
    
    setTimeout(() => {
      setStage('inject');
      setTimeout(() => {
        setStage('result');
        setIsAnimating(false);
      }, 3000); // 3 seconds for injection animation
    }, 1500);
  };

  const handleReset = () => {
    setStage('input');
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto min-h-max pb-8 text-white font-mono">
      
      {/* Intro */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Steganography (LSB)</h3>
        <p className="text-gray-400 text-sm max-w-3xl">
          {isHide 
            ? 'Hides data in plain sight. We convert a 2-character message into 16 binary bits and replace the Least Significant Bit (LSB) of the Blue color channel in 16 pixels.' 
            : 'Extracts hidden data. We scan the 16 pixels, extract the LSB of the Blue color channel, reconstruct the binary string, and decode the message.'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-end bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg relative z-20">
        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">
            {isHide ? 'Secret Message (2 Chars max)' : 'Image with Hidden Data'}
          </label>
          <input 
            maxLength={2}
            value={inputText}
            disabled={!isHide}
            onChange={(e) => {
              setInputText(e.target.value.toUpperCase());
              setStage('input');
            }}
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none text-xl w-full focus:border-[var(--color-nova-brown)] transition-colors disabled:opacity-50"
          />
        </div>

        <button 
          onClick={stage === 'input' ? handleAction : handleReset}
          disabled={isAnimating || !inputText}
          style={{ backgroundColor: stage === 'input' ? actionColor : '#333' }}
          className="text-black px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,0,0,0.3)] ml-auto"
        >
          {stage === 'input' ? (isHide ? 'HIDE MESSAGE' : 'EXTRACT DATA') : 'RESET'}
        </button>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 min-h-[450px] flex flex-col items-center justify-start p-8 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden">
        
        {stage === 'input' && (
          <div className="text-gray-500 font-mono text-sm tracking-widest uppercase opacity-50 absolute top-1/2 -translate-y-1/2">
            Click {isHide ? 'Hide Message' : 'Extract Data'} to visualize LSB Steganography.
          </div>
        )}

        {/* Top: The Binary String */}
        <div className="h-24 w-full flex items-center justify-center">
          <AnimatePresence>
            {(stage === 'binary' || stage === 'inject' || stage === 'result') && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-1"
              >
                {binaryString.split('').map((bit, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      y: (isHide && stage === 'inject') ? 100 : 0, 
                      opacity: (isHide && stage === 'inject') ? 0 : (stage === 'result' && !isHide ? 1 : (stage === 'result' ? 0.3 : 1)),
                      scale: (isHide && stage === 'inject') ? 0.5 : 1
                    }}
                    transition={{ delay: isHide ? i * 0.1 : (!isHide && stage === 'inject' ? i * 0.1 : 0), duration: 0.5 }}
                    className={`w-8 h-10 flex items-center justify-center font-bold text-lg rounded border ${bit === '1' ? 'bg-blue-900/50 border-blue-500 text-blue-400' : 'bg-gray-900/50 border-gray-500 text-gray-400'}`}
                  >
                    {bit}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: The Pixel Grid */}
        <div className="mt-8 flex flex-col gap-2 relative">
          
          {/* Scanning Line Animation */}
          {stage === 'inject' && (
             <motion.div 
               initial={{ top: -10 }}
               animate={{ top: '100%' }}
               transition={{ duration: 2.5, ease: "linear" }}
               className="absolute left-0 w-full h-[2px] bg-[var(--color-nova-green)] shadow-[0_0_15px_var(--color-nova-green)] z-30 pointer-events-none"
             />
          )}

          {initialGrid.map((row, r) => (
            <div key={r} className="flex gap-2">
              {row.map((pixel, c) => {
                const pixelIndex = r * 4 + c;
                const bitToInject = binaryString[pixelIndex];
                
                // If hiding and stage >= inject, we modify the Blue channel's LSB
                let currentB = pixel[2];
                let isModified = false;
                
                if (isHide && (stage === 'inject' || stage === 'result')) {
                  const bBin = currentB.toString(2).padStart(8, '0');
                  const newBBin = bBin.substring(0, 7) + bitToInject;
                  const newB = parseInt(newBBin, 2);
                  if (currentB !== newB) isModified = true;
                  currentB = newB;
                } else if (!isHide) {
                   // When extracting, we assume the input text's binary is already in the grid
                   const bBin = currentB.toString(2).padStart(8, '0');
                   const newBBin = bBin.substring(0, 7) + bitToInject;
                   currentB = parseInt(newBBin, 2);
                   isModified = true;
                }

                return (
                  <motion.div 
                    key={c}
                    className="relative w-24 h-24 rounded-lg flex flex-col items-center justify-center border-2 border-white/5 overflow-hidden group"
                  >
                    {/* The Color */}
                    <div 
                      className="absolute inset-0 z-0" 
                      style={{ backgroundColor: `rgb(${pixel[0]}, ${pixel[1]}, ${currentB})` }} 
                    />
                    
                    {/* The RGB Data Overlay */}
                    <div className="z-10 bg-black/60 px-2 py-1 rounded text-[10px] font-mono flex flex-col items-center backdrop-blur-sm">
                      <span className="text-red-400">R:{pixel[0]}</span>
                      <span className="text-green-400">G:{pixel[1]}</span>
                      
                      <div className="flex flex-col items-center">
                        <span className="text-blue-400">B:{currentB}</span>
                        {/* Highlight the LSB */}
                        <div className="flex">
                           <span className="text-gray-500">{currentB.toString(2).padStart(8, '0').substring(0, 7)}</span>
                           <motion.span 
                             animate={{ 
                               color: isModified && (stage === 'inject' || stage === 'result') ? actionColor : '#3b82f6',
                               scale: isModified && stage === 'inject' ? [1, 2, 1] : 1
                             }}
                             className="font-bold font-mono"
                           >
                             {currentB.toString(2).padStart(8, '0')[7]}
                           </motion.span>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom: Result message */}
        <AnimatePresence>
          {stage === 'result' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center gap-4 bg-black p-4 border rounded-xl"
              style={{ borderColor: actionColor }}
            >
              {isHide ? <EyeOff className="text-[var(--color-nova-green)]" /> : <Search className="text-[var(--color-nova-red)]" />}
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-widest">{isHide ? 'Data Hidden Successfully' : 'Extracted Message'}</span>
                <span className="font-bold text-xl" style={{ color: actionColor }}>
                  {isHide ? 'IMAGE APPEARS UNCHANGED' : binaryToText(binaryString)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
