import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Code, EyeOff, Eye, Play, Square, History, Cpu } from 'lucide-react';

export default function SteganographyVisualizer() {
  const [secretMessage, setSecretMessage] = useState("HI");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBitIndex, setCurrentBitIndex] = useState(-1);
  const [mode, setMode] = useState('embed'); // 'embed' or 'extract'
  
  // Convert secret message to binary string
  const getBinaryString = (str) => {
    return str.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
  };
  
  const binaryMessage = getBinaryString(secretMessage.toUpperCase());
  
  // Generate a dummy 4x4 image grid (16 pixels, each with RGB = 24 bits)
  // For simplicity, we just show a block of pixels with their hex color, and focus on one channel's LSB
  const [pixels, setPixels] = useState(() => {
    const p = [];
    for(let i=0; i<16; i++) {
      // random bluish pixels
      const r = 30 + Math.floor(Math.random() * 20);
      const g = 100 + Math.floor(Math.random() * 50);
      const b = 200 + Math.floor(Math.random() * 55);
      p.push({ id: i, r, g, b, modified: false, lsbSetTo: null });
    }
    return p;
  });

  const reset = () => {
    setIsPlaying(false);
    setCurrentBitIndex(-1);
    setPixels(prev => prev.map(p => ({ ...p, modified: false, lsbSetTo: null })));
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentBitIndex < binaryMessage.length && currentBitIndex < pixels.length) {
      timer = setTimeout(() => {
        const bitToHide = binaryMessage[currentBitIndex];
        
        setPixels(prev => {
          const newPixels = [...prev];
          const pixel = { ...newPixels[currentBitIndex] };
          
          if (mode === 'embed') {
            // We'll hide the bit in the Blue channel's LSB
            const bBin = pixel.b.toString(2).padStart(8, '0');
            const newBBin = bBin.substring(0, 7) + bitToHide;
            pixel.b = parseInt(newBBin, 2);
            pixel.modified = true;
            pixel.lsbSetTo = bitToHide;
          } else {
            // Extract mode: just highlight what was found
            pixel.modified = true;
            const bBin = pixel.b.toString(2).padStart(8, '0');
            pixel.lsbSetTo = bBin[7];
          }
          
          newPixels[currentBitIndex] = pixel;
          return newPixels;
        });
        
        setCurrentBitIndex(prev => prev + 1);
      }, mode === 'embed' ? 800 : 500);
    } else if (currentBitIndex >= binaryMessage.length || currentBitIndex >= pixels.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentBitIndex, binaryMessage, pixels.length, mode]);

  // Helper to get binary representation of blue channel
  const getBlueBinary = (val, modified, lsbSetTo) => {
    const bin = val.toString(2).padStart(8, '0');
    if (modified && lsbSetTo !== null) {
      return (
        <span>
          <span className="text-gray-400">{bin.substring(0, 7)}</span>
          <motion.span 
            initial={{ scale: 2, color: '#f43f5e' }}
            animate={{ scale: 1, color: '#10b981' }}
            className="font-black text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]"
          >
            {lsbSetTo}
          </motion.span>
        </span>
      );
    }
    return <span className="text-gray-400">{bin}</span>;
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full pt-8 font-sans">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-purple-400 drop-shadow-lg flex items-center justify-center gap-4">
          <EyeOff size={40} className="text-purple-500" />
          Steganography (LSB)
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Hiding data in plain sight. This visualizer injects the binary representation of your secret message into the Least Significant Bits (LSB) of image pixels, changing the color so slightly that the human eye cannot detect it.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="w-full max-w-4xl glass-panel p-6 rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl mb-8 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -z-10" />

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Secret Message (Max 2 chars for 4x4 grid)</label>
          <input
            type="text"
            value={secretMessage}
            onChange={(e) => { setSecretMessage(e.target.value.toUpperCase()); reset(); }}
            className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 font-mono"
            maxLength={2}
            placeholder="HI"
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-1">Mode</label>
          <div className="flex bg-black/40 rounded-xl p-1 border border-purple-500/30">
            <button 
              onClick={() => { setMode('embed'); reset(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${mode === 'embed' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <EyeOff size={16} /> Embed
            </button>
            <button 
              onClick={() => { setMode('extract'); reset(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${mode === 'extract' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Eye size={16} /> Extract
            </button>
          </div>
        </div>
      </div>

      {/* Playback */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => {
            if (currentBitIndex >= binaryMessage.length || currentBitIndex >= pixels.length) reset();
            setIsPlaying(!isPlaying);
            if (currentBitIndex === -1) setCurrentBitIndex(0);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${isPlaying ? 'bg-amber-500 text-white' : 'bg-purple-500 text-white'}`}
        >
          {isPlaying ? <Square size={20} /> : <Play size={20} />}
          {isPlaying ? "Pause" : (currentBitIndex >= binaryMessage.length ? "Replay" : "Start Animation")}
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
        >
          <History size={20} /> Reset
        </button>
      </div>

      {/* Binary Translation Stream */}
      <div className="w-full max-w-4xl glass-panel p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md mb-8 flex flex-col items-center">
        <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
          <Code size={16} /> {mode === 'embed' ? "Message Binary Stream" : "Extracted Binary Stream"}
        </h3>
        
        <div className="flex gap-2 flex-wrap justify-center font-mono text-xl">
          {mode === 'embed' ? (
            binaryMessage.split('').map((bit, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: currentBitIndex === i ? 1.5 : 1,
                  color: currentBitIndex === i ? '#10b981' : (currentBitIndex > i ? '#6b7280' : '#d1d5db'),
                  y: currentBitIndex === i ? -10 : 0
                }}
                className={`transition-colors duration-300 ${currentBitIndex === i ? 'font-black drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] z-10' : ''}`}
              >
                {bit}
              </motion.div>
            ))
          ) : (
            // In extract mode, reconstruct the binary stream from pixels
            pixels.slice(0, binaryMessage.length).map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentBitIndex > i ? 1 : (currentBitIndex === i ? 1 : 0),
                  scale: currentBitIndex === i ? 1.5 : 1,
                  color: currentBitIndex === i ? '#6366f1' : '#d1d5db',
                  y: currentBitIndex === i ? -10 : 0
                }}
                className={`transition-colors duration-300 ${currentBitIndex === i ? 'font-black drop-shadow-[0_0_8px_rgba(99,102,241,0.8)] z-10' : ''}`}
              >
                {p.modified && p.lsbSetTo !== null ? p.lsbSetTo : "?"}
              </motion.div>
            ))
          )}
        </div>
        
        {/* Extracted Message Preview */}
        {mode === 'extract' && currentBitIndex >= binaryMessage.length && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-2xl font-black text-indigo-400 flex items-center gap-4"
          >
            Decoded Message: <span className="text-white tracking-widest">{secretMessage}</span>
          </motion.div>
        )}
      </div>

      {/* Image Grid Stage */}
      <div className="w-full max-w-4xl flex justify-center pb-20">
        <div className="grid grid-cols-4 gap-4 p-8 glass-panel rounded-2xl border border-white/5 bg-black/60 shadow-2xl relative">
          
          <div className="absolute -top-4 -left-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
            <Image size={14}/> 4x4 Pixel Grid
          </div>

          {pixels.map((pixel, i) => (
            <motion.div 
              key={pixel.id}
              animate={{
                scale: currentBitIndex === i ? 1.05 : 1,
                borderColor: currentBitIndex === i ? (mode === 'embed' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(99, 102, 241, 0.8)') : 'rgba(255,255,255,0.1)',
                boxShadow: currentBitIndex === i ? (mode === 'embed' ? '0 0 20px rgba(16,185,129,0.4)' : '0 0 20px rgba(99,102,241,0.4)') : 'none'
              }}
              className="relative w-32 h-32 rounded-xl border-2 transition-all duration-300 overflow-hidden group flex flex-col justify-end"
            >
              {/* Actual Pixel Color Background */}
              <div 
                className="absolute inset-0 z-0 transition-colors duration-1000"
                style={{ backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})` }}
              />
              
              {/* Overlay with data */}
              <div className="z-10 bg-black/70 w-full p-2 flex flex-col items-center justify-center font-mono text-[10px] sm:text-xs">
                <div className="text-red-400">R: {pixel.r.toString(2).padStart(8,'0')}</div>
                <div className="text-green-400">G: {pixel.g.toString(2).padStart(8,'0')}</div>
                <div className="text-blue-400 flex items-center gap-1">
                  B: {getBlueBinary(pixel.b, pixel.modified, pixel.lsbSetTo)}
                </div>
              </div>

              {/* Status Icon */}
              {pixel.modified && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`absolute top-2 right-2 p-1 rounded-full ${mode === 'embed' ? 'bg-emerald-500' : 'bg-indigo-500'} text-white shadow-lg z-20`}
                >
                  <Cpu size={12} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
