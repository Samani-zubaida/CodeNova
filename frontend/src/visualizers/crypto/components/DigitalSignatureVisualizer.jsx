import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Hash, Key, Lock, Unlock, ShieldCheck, ShieldAlert, ArrowRight, ArrowDown } from 'lucide-react';

export default function DigitalSignatureVisualizer({ mode }) {
  const [documentText, setDocumentText] = useState('CONTRACT: TRANSFER $100');
  const [stage, setStage] = useState('input'); // input, hash, encrypt/decrypt, verify
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTampered, setIsTampered] = useState(false); // Only for Verify mode testing

  const isSign = mode === 'encrypt'; // Encrypt mode = Sign
  const actionColor = isSign ? 'var(--color-nova-green)' : 'var(--color-nova-red)';

  // Mock Hashes
  const originalHash = '8f4343...d9c2';
  const tamperedHash = '1b9e77...3f1a';
  const currentHash = isTampered ? tamperedHash : originalHash;
  const signature = 'Sig(8f4343...d9c2)';

  const handleAction = () => {
    if (!documentText) return;
    setIsAnimating(true);
    setStage('hash');
    
    setTimeout(() => {
      setStage('crypt');
      setTimeout(() => {
        setStage('verify'); // Result stage
        setTimeout(() => setIsAnimating(false), 1000);
      }, 2500);
    }, 2000);
  };

  const handleReset = () => {
    setStage('input');
    setIsTampered(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto min-h-max pb-8 text-white font-mono">
      
      {/* Intro */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Digital Signatures</h3>
        <p className="text-gray-400 text-sm max-w-3xl">
          {isSign 
            ? 'Signing a document proves authenticity. The document is hashed, and the hash is encrypted with a Private Key.' 
            : 'Verifying a signature proves the document was not tampered with. The signature is decrypted with a Public Key to reveal the original hash, which is compared against a new hash of the document.'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-end bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg relative z-20">
        <div className="flex flex-col gap-2 flex-1 min-w-[250px]">
          <label className="text-xs text-gray-400 font-semibold tracking-widest uppercase">
            Document Content
          </label>
          <input 
            value={documentText}
            onChange={(e) => {
              setDocumentText(e.target.value.toUpperCase());
              setStage('input');
            }}
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 outline-none text-xl w-full focus:border-[var(--color-nova-brown)] transition-colors"
          />
        </div>

        {!isSign && stage === 'input' && (
          <button 
            onClick={() => setIsTampered(!isTampered)}
            className={`px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
              isTampered ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/20 text-gray-400 hover:text-white'
            }`}
          >
            {isTampered ? 'TAMPERED: TRUE' : 'TAMPER DOCUMENT'}
          </button>
        )}

        <button 
          onClick={stage === 'input' ? handleAction : handleReset}
          disabled={isAnimating || !documentText}
          style={{ backgroundColor: stage === 'input' ? actionColor : '#333' }}
          className="text-black px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,0,0,0.3)] ml-auto"
        >
          {stage === 'input' ? (isSign ? 'SIGN DOCUMENT' : 'VERIFY SIGNATURE') : 'RESET'}
        </button>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 min-h-[450px] flex flex-col items-center justify-center p-8 bg-black/20 rounded-2xl border border-white/5 relative overflow-hidden">
        
        {stage === 'input' && (
          <div className="text-gray-500 font-mono text-sm tracking-widest uppercase opacity-50">
            Click {isSign ? 'Sign' : 'Verify'} to visualize the protocol.
          </div>
        )}

        {/* --- SIGNING (ENCRYPT) ANIMATION --- */}
        {isSign && stage !== 'input' && (
          <div className="relative w-full h-[400px] flex justify-center items-center">
            
            {/* Step 1: Document */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: stage === 'hash' ? 0 : -200, opacity: stage === 'hash' ? 1 : 0.5 }}
              className="absolute left-[10%] p-4 bg-white/5 border border-white/20 rounded-xl flex flex-col items-center gap-2"
            >
              <FileText size={48} className="text-gray-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Document</span>
            </motion.div>

            {/* Step 2: Hashing */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: stage === 'hash' || stage === 'crypt' ? 1 : 0, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute z-10 flex flex-col items-center"
            >
              <div className="p-4 rounded-full bg-black border-2 border-dashed border-gray-500">
                <Hash size={32} className="text-gray-400" />
              </div>
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: stage === 'crypt' ? 40 : 0, opacity: stage === 'crypt' ? 1 : 0 }}
                className="w-0.5 bg-gray-500"
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: stage === 'crypt' ? 1 : 0, y: 0 }}
                className="px-4 py-2 bg-black border border-white/20 rounded text-sm font-bold text-gray-300 shadow-xl"
              >
                {originalHash}
              </motion.div>
            </motion.div>

            {/* Step 3: Encryption (Private Key) */}
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: stage === 'crypt' ? 1 : 0, x: stage === 'verify' ? 0 : 150 }}
              transition={{ delay: stage === 'crypt' ? 0.5 : 0 }}
              className="absolute flex flex-col items-center"
            >
              <div className="p-4 rounded-full bg-black border-2 border-[var(--color-nova-green)] shadow-[0_0_30px_rgba(197,206,174,0.3)] z-20">
                <Lock size={32} className="text-[var(--color-nova-green)]" />
              </div>
              <div className="flex items-center gap-2 mt-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                <Key size={14} className="text-[var(--color-nova-green)]" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-nova-green)]">Private Key</span>
              </div>
            </motion.div>

            {/* Final Signature */}
            <AnimatePresence>
              {stage === 'verify' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute p-6 bg-black border-2 border-[var(--color-nova-green)] rounded-xl shadow-[0_0_40px_rgba(197,206,174,0.4)] flex flex-col items-center gap-2 z-30"
                >
                  <FileText size={32} className="text-gray-500" />
                  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded font-bold text-gray-300">
                    {signature}
                  </div>
                  <span className="text-xs text-[var(--color-nova-green)] uppercase tracking-widest mt-2 font-bold flex items-center gap-1">
                    <ShieldCheck size={14} /> Digital Signature Created
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- VERIFYING (DECRYPT) ANIMATION --- */}
        {!isSign && stage !== 'input' && (
          <div className="relative w-full h-[400px] flex justify-between items-center px-12">
            
            {/* Left side: Hashing the received document */}
            <div className="flex flex-col items-center gap-4 w-1/3">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 bg-white/5 border border-white/20 rounded-xl flex flex-col items-center gap-2 relative"
              >
                {isTampered && <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />}
                <FileText size={48} className={isTampered ? "text-red-400" : "text-gray-300"} />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Received Doc</span>
              </motion.div>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: stage !== 'input' ? 1 : 0 }} transition={{ delay: 0.5 }}>
                <ArrowDown size={24} className="text-gray-600" />
              </motion.div>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: stage !== 'input' ? 1 : 0 }} transition={{ delay: 0.8 }} className="p-3 rounded-full bg-black border border-gray-500">
                <Hash size={24} className="text-gray-400" />
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: stage !== 'input' ? 1 : 0 }} transition={{ delay: 1 }}>
                <ArrowDown size={24} className="text-gray-600" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ opacity: stage === 'crypt' || stage === 'verify' ? 1 : 0, scale: 1 }}
                transition={{ delay: stage === 'crypt' ? 0.2 : 0 }}
                className={`px-4 py-2 bg-black border rounded text-sm font-bold shadow-xl ${isTampered ? 'border-red-500 text-red-400' : 'border-gray-500 text-gray-300'}`}
              >
                {currentHash}
              </motion.div>
            </div>

            {/* Middle: Comparison Result */}
            <AnimatePresence>
              {stage === 'verify' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 z-20 absolute left-1/2 -translate-x-1/2"
                >
                  <div className="flex items-center gap-4 text-xl font-bold font-mono">
                    <span className={isTampered ? 'text-red-400' : 'text-gray-300'}>{currentHash.substring(0, 6)}</span>
                    <span>{isTampered ? '≠' : '=='}</span>
                    <span className="text-blue-400">{originalHash.substring(0, 6)}</span>
                  </div>
                  {isTampered ? (
                    <div className="flex items-center gap-2 px-6 py-3 bg-red-900/30 border border-red-500 rounded-xl text-red-400 font-bold shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      <ShieldAlert size={24} /> SIGNATURE INVALID
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-6 py-3 bg-green-900/30 border border-green-500 rounded-xl text-green-400 font-bold shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                      <ShieldCheck size={24} /> SIGNATURE VERIFIED
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right side: Decrypting the Signature */}
            <div className="flex flex-col items-center gap-4 w-1/3">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 bg-white/5 border border-white/20 rounded-xl flex flex-col items-center gap-2"
              >
                <div className="px-2 py-1 bg-black border border-white/10 rounded font-bold text-gray-300 text-xs">
                  {signature}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Signature</span>
              </motion.div>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: stage !== 'input' ? 1 : 0 }} transition={{ delay: 1.2 }}>
                <ArrowDown size={24} className="text-gray-600" />
              </motion.div>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: stage !== 'input' ? 1 : 0 }} transition={{ delay: 1.5 }} className="flex flex-col items-center relative">
                <div className="p-3 rounded-full bg-black border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10">
                  <Unlock size={24} className="text-blue-400" />
                </div>
                <div className="absolute top-10 flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full border border-white/20 whitespace-nowrap z-20">
                  <Key size={10} className="text-blue-400" />
                  <span className="text-[8px] uppercase font-bold tracking-widest text-blue-400">Public Key</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: stage !== 'input' ? 1 : 0 }} transition={{ delay: 1.8 }} className="mt-4">
                <ArrowDown size={24} className="text-gray-600" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ opacity: stage === 'crypt' || stage === 'verify' ? 1 : 0, scale: 1 }}
                transition={{ delay: stage === 'crypt' ? 1 : 0 }}
                className="px-4 py-2 bg-black border border-blue-500 rounded text-sm font-bold text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                {originalHash}
              </motion.div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
