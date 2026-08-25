import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, ShieldCheck, KeyRound, ArrowRight, Play, Square, History, AlertTriangle, FileText, Hash, Send, User, Server } from 'lucide-react';

export default function DigitalSignatureVisualizer() {
  const [documentText, setDocumentText] = useState("PAY ALICE $100");
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0); 
  const [isTampered, setIsTampered] = useState(false);
  
  // Fake pseudo-random hash generator based on string
  const generateHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase() + "B3F9A2C";
  };

  const aliceHash = generateHash(documentText);
  const aliceSignature = "SIG-" + aliceHash.split('').reverse().join('');
  
  const receivedDoc = isTampered ? "PAY ALICE $900" : documentText;
  const bobRecalculatedHash = generateHash(receivedDoc);
  const bobDecryptedHash = aliceSignature.replace("SIG-", "").split('').reverse().join(''); // Simplified decryption logic
  const isValid = bobRecalculatedHash === bobDecryptedHash;

  const totalSteps = 8; // 0 to 7

  const reset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && step < totalSteps - 1) {
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 1500); // 1.5 seconds per step
    } else if (step >= totalSteps - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full pt-8 font-sans pb-20 overflow-x-hidden">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-indigo-400 drop-shadow-lg flex items-center justify-center gap-4">
          <FileSignature size={40} className="text-indigo-500" />
          Digital Signatures
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          An end-to-end simulation. Watch Alice create a signature using her Private Key and send it across the network to Bob, who verifies it with her Public Key.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="w-full max-w-4xl glass-panel p-6 rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl mb-8 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -z-10" />

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">Document to Send</label>
          <input
            type="text"
            value={documentText}
            onChange={(e) => { setDocumentText(e.target.value.toUpperCase()); reset(); }}
            className="w-full bg-black/40 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-400 font-mono text-lg"
            placeholder="Contract Details..."
            disabled={isPlaying || step > 0}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-semibold text-rose-300 uppercase tracking-wider mb-1">Network Attack</label>
          <button 
            onClick={() => { setIsTampered(!isTampered); reset(); }}
            disabled={isPlaying || step > 0}
            className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${isTampered ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400' : 'bg-black/40 border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400'}`}
          >
            <AlertTriangle size={18} />
            {isTampered ? "Document Tampered!" : "Simulate Tampering"}
          </button>
        </div>
      </div>

      {/* Playback */}
      <div className="flex gap-4 mb-12 relative z-10">
        <button 
          onClick={() => {
            if (step >= totalSteps - 1) reset();
            setIsPlaying(!isPlaying);
          }}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-lg ${isPlaying ? 'bg-amber-500 text-white' : 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}
        >
          {isPlaying ? <Square size={20} /> : <Play size={20} />}
          {isPlaying ? "Pause Simulation" : (step >= totalSteps - 1 ? "Replay Simulation" : "Start Simulation")}
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-4 rounded-full font-bold transition-all bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
        >
          <History size={20} /> Reset
        </button>
      </div>

      {/* Animation Stage - Two Columns */}
      <div className="w-full max-w-6xl relative flex flex-col md:flex-row justify-between items-start gap-4 px-4 min-h-[500px]">
        
        {/* Background Track indicating Network */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-emerald-500/0 -translate-y-1/2 hidden md:block border-t border-dashed border-white/10" />

        {/* ALICE (Sender) */}
        <div className="w-full md:w-[40%] flex flex-col items-center relative">
          <div className="flex items-center gap-3 mb-6 bg-indigo-500/10 border border-indigo-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <User className="text-indigo-400" />
            <h2 className="text-2xl font-black text-indigo-400 tracking-wider">ALICE</h2>
          </div>

          <div className="flex flex-col gap-4 w-full items-center relative">
            
            {/* Original Document */}
            <motion.div 
              animate={{
                scale: step === 0 ? 1.05 : 1,
                borderColor: step === 0 ? 'rgba(99, 102, 241, 1)' : 'rgba(255,255,255,0.1)',
                opacity: step >= 3 ? 0.3 : 1
              }}
              className="glass-card p-4 border rounded-xl bg-black/40 flex flex-col items-center gap-2 w-[280px] shadow-lg relative z-20"
            >
              <FileText size={32} className={step === 0 ? "text-indigo-400" : "text-gray-500"} />
              <div className="text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">1. Document</p>
                <p className="text-sm font-mono font-bold mt-1 text-white">"{documentText}"</p>
              </div>
            </motion.div>

            {/* Hashing Arrow */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 40 }} className="w-0.5 bg-gray-700 relative z-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500/20 border border-pink-500/50 rounded-full px-2 py-1 text-[10px] text-pink-300 font-bold uppercase whitespace-nowrap"><Hash size={10} className="inline mr-1"/> Hash</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Document Hash */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: step >= 3 ? 0.3 : 1, 
                    scale: step === 1 ? 1.05 : 1,
                    borderColor: step === 1 ? 'rgba(236, 72, 153, 1)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="glass-card p-4 border rounded-xl bg-black/40 flex flex-col items-center gap-2 w-[280px] shadow-lg relative z-20"
                >
                  <Hash size={32} className={step === 1 ? "text-pink-400" : "text-gray-500"} />
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">2. Hash</p>
                    <p className="text-xs font-mono font-bold mt-1 text-pink-300 break-all">{aliceHash}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Encryption Arrow */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 40 }} className="w-0.5 bg-gray-700 relative z-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-500/20 border border-rose-500/50 rounded-full px-2 py-1 text-[10px] text-rose-300 font-bold uppercase whitespace-nowrap"><KeyRound size={10} className="inline mr-1"/> Alice's Pvt Key</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Signature */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: step >= 3 ? 0.3 : 1, 
                    scale: step === 2 ? 1.05 : 1,
                    borderColor: step === 2 ? 'rgba(244, 63, 94, 1)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="glass-card p-4 border rounded-xl bg-black/40 flex flex-col items-center gap-2 w-[280px] shadow-lg relative z-20"
                >
                  <FileSignature size={32} className={step === 2 ? "text-rose-400" : "text-gray-500"} />
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">3. Digital Signature</p>
                    <p className="text-[10px] font-mono font-bold mt-1 text-rose-300 break-all">{aliceSignature}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* NETWORK TRANSIT */}
        <div className="w-full md:w-[20%] flex flex-col items-center justify-center py-12 md:py-0 relative min-h-[150px]">
          
          <div className="text-gray-600 uppercase tracking-widest text-xs font-bold mb-4 flex items-center gap-2">
            <Server size={14} /> The Internet
          </div>

          <AnimatePresence>
            {step >= 3 && step < 4 && (
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 100, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "linear" }}
                className="flex flex-col gap-2 absolute top-1/2 -translate-y-1/2 z-30"
              >
                <div className={`p-2 rounded border shadow-lg flex items-center gap-2 text-xs font-bold whitespace-nowrap bg-black/80 ${isTampered ? 'border-red-500 text-red-400' : 'border-indigo-500 text-indigo-300'}`}>
                  <FileText size={14} /> {isTampered ? "PAY ALICE $900" : "PAY ALICE $100"}
                  {isTampered && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                </div>
                <div className="p-2 rounded border border-rose-500 bg-black/80 shadow-lg flex items-center gap-2 text-xs font-bold text-rose-300 whitespace-nowrap">
                  <FileSignature size={14} /> {aliceSignature.substring(0,8)}...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* BOB (Receiver) */}
        <div className="w-full md:w-[40%] flex flex-col items-center relative">
          <div className="flex items-center gap-3 mb-6 bg-emerald-500/10 border border-emerald-500/30 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <User className="text-emerald-400" />
            <h2 className="text-2xl font-black text-emerald-400 tracking-wider">BOB</h2>
          </div>

          <div className="flex flex-col gap-4 w-full items-center relative">
            
            {/* Received Package Container */}
            <AnimatePresence>
              {step >= 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex justify-center gap-4"
                >
                  {/* Received Doc */}
                  <motion.div 
                    animate={{
                      scale: step === 4 ? 1.05 : 1,
                      borderColor: step === 4 ? 'rgba(16, 185, 129, 1)' : (isTampered ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255,255,255,0.1)')
                    }}
                    className={`glass-card p-4 border rounded-xl bg-black/40 flex flex-col items-center gap-2 w-[160px] shadow-lg ${isTampered ? 'shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}`}
                  >
                    <FileText size={24} className={isTampered ? "text-red-400" : "text-emerald-400"} />
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">4. Received Doc</p>
                      <p className={`text-xs font-mono font-bold mt-1 break-words ${isTampered ? 'text-red-400' : 'text-white'}`}>"{receivedDoc}"</p>
                    </div>
                  </motion.div>

                  {/* Received Sig */}
                  <motion.div 
                    animate={{
                      scale: step === 4 ? 1.05 : 1,
                      borderColor: step === 4 ? 'rgba(244, 63, 94, 1)' : 'rgba(255,255,255,0.1)'
                    }}
                    className="glass-card p-4 border rounded-xl bg-black/40 flex flex-col items-center gap-2 w-[160px] shadow-lg"
                  >
                    <FileSignature size={24} className="text-rose-400" />
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">4. Received Sig</p>
                      <p className="text-[10px] font-mono font-bold mt-1 text-rose-300 break-all">{aliceSignature.substring(0,10)}...</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 5 && (
                <div className="w-full flex justify-center gap-4 relative">
                  
                  {/* Left branch: Recalculate Hash */}
                  <div className="flex flex-col items-center w-[160px]">
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 30 }} className="w-0.5 bg-gray-700 relative z-10">
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 bg-pink-500/20 border border-pink-500/50 rounded-full px-2 py-0.5 text-[9px] text-pink-300 font-bold uppercase whitespace-nowrap"><Hash size={8} className="inline mr-1"/> Hash</div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: step === 5 ? 1.05 : 1,
                        borderColor: step === 5 ? 'rgba(236, 72, 153, 1)' : 'rgba(255,255,255,0.1)'
                      }}
                      className="glass-card p-3 border rounded-xl bg-black/40 flex flex-col items-center gap-1 w-full shadow-lg"
                    >
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold text-center">5. Re-hashed Doc</p>
                      <p className="text-[10px] font-mono font-bold text-pink-300 break-all text-center">{bobRecalculatedHash}</p>
                    </motion.div>
                  </div>

                  {/* Right branch: Decrypt Signature */}
                  {step >= 6 && (
                    <div className="flex flex-col items-center w-[160px]">
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 30 }} className="w-0.5 bg-gray-700 relative z-10">
                        <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-cyan-500/20 border border-cyan-500/50 rounded-full px-2 py-0.5 text-[9px] text-cyan-300 font-bold uppercase whitespace-nowrap"><KeyRound size={8} className="inline mr-1"/> Alice Pub Key</div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: step === 6 ? 1.05 : 1,
                          borderColor: step === 6 ? 'rgba(34, 211, 238, 1)' : 'rgba(255,255,255,0.1)'
                        }}
                        className="glass-card p-3 border rounded-xl bg-black/40 flex flex-col items-center gap-1 w-full shadow-lg"
                      >
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold text-center">6. Decrypted Sig</p>
                        <p className="text-[10px] font-mono font-bold text-cyan-300 break-all text-center">{bobDecryptedHash}</p>
                      </motion.div>
                    </div>
                  )}

                </div>
              )}
            </AnimatePresence>

            {/* Final Compare Stage */}
            <AnimatePresence>
              {step >= 7 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 w-[340px] p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 shadow-2xl ${isValid ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]'}`}
                >
                  <div className="flex gap-4 items-center mb-2">
                    <span className="font-mono text-xs text-pink-300">{bobRecalculatedHash.substring(0,8)}...</span>
                    <span className="text-gray-400 font-black text-lg">{isValid ? "===" : "!=="}</span>
                    <span className="font-mono text-xs text-cyan-300">{bobDecryptedHash.substring(0,8)}...</span>
                  </div>

                  {isValid ? (
                    <>
                      <ShieldCheck size={40} className="text-emerald-400" />
                      <h3 className="text-xl font-black text-emerald-400 tracking-wider uppercase">Signature Valid</h3>
                      <p className="text-center text-emerald-200/70 text-xs">Authenticity verified. Document has not been tampered with.</p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={40} className="text-red-400" />
                      <h3 className="text-xl font-black text-red-400 tracking-wider uppercase">Signature Invalid</h3>
                      <p className="text-center text-red-200/70 text-xs">Integrity check failed. Document was tampered with or signature is forged.</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
