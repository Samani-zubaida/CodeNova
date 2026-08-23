import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Key } from 'lucide-react';

export default function RSAVisualizer({ mode }) {
  const [inputText, setInputText] = useState('SECRET');
  const [isAnimating, setIsAnimating] = useState(false);
  const [stage, setStage] = useState('initial'); // initial, processing, done

  const isEncrypt = mode === 'encrypt';
  const actionText = isEncrypt ? 'ENCRYPT' : 'DECRYPT';
  const actionColor = isEncrypt ? 'var(--color-nova-green)' : 'var(--color-nova-red)';

  const handleAction = () => {
    if (!inputText) return;
    setIsAnimating(true);
    setStage('processing');
    
    setTimeout(() => {
      setStage('done');
      setIsAnimating(false);
    }, 3000);
  };

  const handleReset = () => {
    setStage('initial');
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto h-full">
      {/* Intro Text */}
      <div>
        <h3 className="text-2xl font-bold mb-2">RSA (Rivest–Shamir–Adleman)</h3>
        <p className="text-gray-400 text-sm">
          An asymmetric cryptographic algorithm. {isEncrypt 
            ? 'Anyone can encrypt data using the Public Key.' 
            : 'Only the holder of the Private Key can decrypt the data.'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-end bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">
            {isEncrypt ? 'Plaintext Message' : 'Ciphertext Data'}
          </label>
          <input 
            maxLength={16}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value.toUpperCase());
              setStage('initial');
            }}
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none text-xl w-64 focus:border-[var(--color-nova-brown)] transition-colors"
          />
        </div>

        <button 
          onClick={stage === 'done' ? handleReset : handleAction}
          disabled={isAnimating || !inputText}
          style={{ backgroundColor: stage === 'done' ? '#333' : actionColor }}
          className="text-black px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,0,0,0.3)] ml-auto"
        >
          {stage === 'done' ? 'RESET' : actionText}
        </button>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center gap-12 p-8 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden">
        
        {/* Keys Dashboard */}
        <div className="absolute top-6 left-6 flex flex-col gap-4">
          <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isEncrypt ? 'bg-[var(--color-nova-green)]/10 border-[var(--color-nova-green)]/30' : 'bg-black/50 border-white/5'}`}>
            <Lock className={isEncrypt ? 'text-[var(--color-nova-green)]' : 'text-gray-500'} size={20} />
            <div className="flex flex-col">
              <span className={`text-xs font-bold ${isEncrypt ? 'text-[var(--color-nova-green)]' : 'text-gray-500'}`}>PUBLIC KEY (e, n)</span>
              <span className="text-[10px] text-gray-400">Used for Encryption</span>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${!isEncrypt ? 'bg-[var(--color-nova-red)]/10 border-[var(--color-nova-red)]/30' : 'bg-black/50 border-white/5'}`}>
            <Key className={!isEncrypt ? 'text-[var(--color-nova-red)]' : 'text-gray-500'} size={20} />
            <div className="flex flex-col">
              <span className={`text-xs font-bold ${!isEncrypt ? 'text-[var(--color-nova-red)]' : 'text-gray-500'}`}>PRIVATE KEY (d, n)</span>
              <span className="text-[10px] text-gray-400">Used for Decryption</span>
            </div>
          </div>
        </div>

        {/* Animation Area */}
        <div className="relative w-64 h-64 flex items-center justify-center mt-12">
          
          <AnimatePresence mode="wait">
            {stage === 'initial' && (
              <motion.div
                key="initial"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                className="w-48 p-6 bg-[#111] border border-white/20 rounded-xl shadow-xl flex flex-col items-center gap-4 text-center z-10"
              >
                <span className="text-xl font-bold break-all">{inputText}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">{isEncrypt ? 'Plaintext' : 'Ciphertext'}</span>
              </motion.div>
            )}

            {stage === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex items-center justify-center w-full h-full"
              >
                {/* Math Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                  className="absolute inset-0 border-4 border-dashed rounded-full"
                  style={{ borderColor: actionColor, opacity: 0.3 }}
                />
                
                {/* Center Action */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="z-20 p-6 rounded-full bg-black border-2 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                  style={{ borderColor: actionColor }}
                >
                  {isEncrypt ? (
                    <Lock size={48} color={actionColor} />
                  ) : (
                    <Unlock size={48} color={actionColor} />
                  )}
                </motion.div>
                
                {/* Math floating text */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: -40, opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-1/4 text-sm font-bold font-mono"
                  style={{ color: actionColor }}
                >
                  {isEncrypt ? 'C = M^e mod n' : 'M = C^d mod n'}
                </motion.div>
              </motion.div>
            )}

            {stage === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-64 p-6 bg-[#0a0a0a] border-2 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 text-center z-10"
                style={{ borderColor: actionColor }}
              >
                {isEncrypt ? (
                  <div className="flex flex-col items-center gap-2">
                    <Lock size={24} color={actionColor} />
                    <span className="text-xl font-bold font-mono break-all text-white/50 blur-[1px]">
                      {btoa(inputText).substring(0, 16)}...
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest mt-2">Encrypted Data</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Unlock size={24} color={actionColor} />
                    <span className="text-2xl font-bold font-mono break-all text-white">
                      {inputText}
                    </span>
                    <span className="text-xs text-[var(--color-nova-green)] uppercase tracking-widest mt-2">Decrypted Message</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
