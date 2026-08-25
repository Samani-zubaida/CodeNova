import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, ShieldCheck, KeyRound, Lock, Unlock, ArrowRight, Play, Square, History, AlertTriangle, FileText, Hash } from 'lucide-react';

export default function DigitalSignatureVisualizer() {
  const [documentText, setDocumentText] = useState("PAY ALICE $100");
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0); 
  const [mode, setMode] = useState('sign'); // 'sign' or 'verify'
  
  // Animation states
  const [hash, setHash] = useState("");
  const [signature, setSignature] = useState("");
  const [receivedDoc, setReceivedDoc] = useState("");
  const [receivedSig, setReceivedSig] = useState("");
  const [decryptedHash, setDecryptedHash] = useState("");
  const [recalculatedHash, setRecalculatedHash] = useState("");
  const [isValid, setIsValid] = useState(null);

  // Fake pseudo-random hash generator based on string
  const generateHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase() + "B3F9A2C";
  };

  const reset = () => {
    setIsPlaying(false);
    setStep(0);
    setHash("");
    setSignature("");
    setReceivedDoc("");
    setReceivedSig("");
    setDecryptedHash("");
    setRecalculatedHash("");
    setIsValid(null);
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      if (mode === 'sign') {
        if (step === 0) {
          timer = setTimeout(() => { setStep(1); setHash(generateHash(documentText)); }, 1000);
        } else if (step === 1) {
          timer = setTimeout(() => { setStep(2); setSignature("SIG-" + hash.split('').reverse().join('')); }, 1500);
        } else if (step === 2) {
          timer = setTimeout(() => setIsPlaying(false), 500);
        }
      } else { // verify
        if (step === 0) {
          // Send over network (simulate tampering if needed)
          timer = setTimeout(() => { 
            setStep(1); 
            setReceivedDoc(documentText);
            setReceivedSig("SIG-" + generateHash(documentText).split('').reverse().join(''));
          }, 1000);
        } else if (step === 1) {
          // Decrypt signature with public key
          timer = setTimeout(() => {
            setStep(2);
            setDecryptedHash(receivedSig.replace("SIG-", "").split('').reverse().join(''));
          }, 1500);
        } else if (step === 2) {
          // Recalculate hash of received document
          timer = setTimeout(() => {
            setStep(3);
            setRecalculatedHash(generateHash(receivedDoc));
          }, 1500);
        } else if (step === 3) {
          // Compare
          timer = setTimeout(() => {
            setStep(4);
            setIsValid(decryptedHash === recalculatedHash);
          }, 1000);
        } else if (step === 4) {
          timer = setTimeout(() => setIsPlaying(false), 500);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, mode, documentText, hash, receivedDoc, receivedSig, decryptedHash, recalculatedHash]);

  return (
    <div className="flex flex-col items-center min-h-[80vh] w-full pt-8 font-sans">
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
          Ensuring Authenticity and Integrity. Alice hashes her document and encrypts the hash with her <b>Private Key</b> to create a signature. Bob verifies it using Alice's <b>Public Key</b>.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="w-full max-w-4xl glass-panel p-6 rounded-2xl bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl mb-8 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -z-10" />

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">Document Content</label>
          <input
            type="text"
            value={documentText}
            onChange={(e) => { setDocumentText(e.target.value.toUpperCase()); reset(); }}
            className="w-full bg-black/40 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-400 font-mono text-lg"
            placeholder="Contract Details..."
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-1">Process</label>
          <div className="flex bg-black/40 rounded-xl p-1 border border-indigo-500/30">
            <button 
              onClick={() => { setMode('sign'); reset(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${mode === 'sign' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <FileSignature size={16} /> Sign (Alice)
            </button>
            <button 
              onClick={() => { setMode('verify'); reset(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${mode === 'verify' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <ShieldCheck size={16} /> Verify (Bob)
            </button>
          </div>
        </div>
      </div>

      {/* Playback */}
      <div className="flex gap-4 mb-12">
        <button 
          onClick={() => {
            if ((mode === 'sign' && step >= 2) || (mode === 'verify' && step >= 4)) reset();
            setIsPlaying(!isPlaying);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${isPlaying ? 'bg-amber-500 text-white' : (mode === 'sign' ? 'bg-indigo-500' : 'bg-emerald-500') + ' text-white'}`}
        >
          {isPlaying ? <Square size={20} /> : <Play size={20} />}
          {isPlaying ? "Pause" : (((mode === 'sign' && step >= 2) || (mode === 'verify' && step >= 4)) ? "Replay" : "Start")}
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
        >
          <History size={20} /> Reset
        </button>
      </div>

      {/* Animation Stage */}
      <div className="w-full max-w-5xl relative pb-20 flex justify-center">
        
        {mode === 'sign' && (
          <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
            {/* Step 0: Document */}
            <motion.div 
              className="glass-card p-6 border border-indigo-500/30 rounded-xl bg-black/40 flex flex-col items-center gap-4 w-64 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              <FileText size={48} className="text-indigo-400" />
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Original Document</p>
                <p className="text-lg font-mono font-bold mt-2 text-white">"{documentText}"</p>
              </div>
            </motion.div>

            {/* Step 1: Hashing */}
            <AnimatePresence>
              {step >= 1 && (
                <>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center">
                    <ArrowRight className="text-gray-500 mb-2" />
                    <div className="bg-pink-500/20 border border-pink-500/50 rounded-full px-4 py-1 text-xs text-pink-300 font-bold uppercase flex items-center gap-1"><Hash size={12}/> SHA-256</div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 border border-pink-500/30 rounded-xl bg-black/40 flex flex-col items-center gap-4 w-64 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                  >
                    <Hash size={48} className="text-pink-400" />
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Document Hash</p>
                      <p className="text-sm font-mono font-bold mt-2 text-pink-300 break-all">{hash}</p>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Step 2: Encrypting with Private Key */}
            <AnimatePresence>
              {step >= 2 && (
                <>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center">
                    <ArrowRight className="text-gray-500 mb-2" />
                    <div className="bg-rose-500/20 border border-rose-500/50 rounded-full px-4 py-1 text-xs text-rose-300 font-bold uppercase flex items-center gap-1"><KeyRound size={12}/> Alice's Private Key</div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 border border-rose-500/30 rounded-xl bg-black/40 flex flex-col items-center gap-4 w-64 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                  >
                    <FileSignature size={48} className="text-rose-400" />
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Digital Signature</p>
                      <p className="text-xs font-mono font-bold mt-2 text-rose-300 break-all">{signature}</p>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {mode === 'verify' && (
          <div className="flex flex-col gap-12 w-full items-center">
            
            {/* Step 1: Received Package */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-8 p-6 glass-panel rounded-2xl border border-indigo-500/30 bg-indigo-500/5 relative w-full max-w-3xl justify-center shadow-[0_0_30px_rgba(99,102,241,0.1)]"
                >
                  <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">Received from Network</div>
                  
                  <div className="flex flex-col items-center w-1/2">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Document</p>
                    <div className="bg-black/50 border border-gray-700 p-4 rounded-xl w-full text-center">
                      <p className="text-lg font-mono font-bold text-white">"{receivedDoc}"</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center w-1/2">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Signature</p>
                    <div className="bg-black/50 border border-rose-500/30 p-4 rounded-xl w-full text-center">
                      <p className="text-xs font-mono font-bold text-rose-400 break-all">{receivedSig}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex w-full max-w-3xl justify-between items-start">
              {/* Step 3: Recalculate Hash (Left Side) */}
              <div className="flex flex-col items-center w-1/2 gap-4">
                <AnimatePresence>
                  {step >= 3 && (
                    <>
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 40 }} className="w-0.5 bg-gray-700 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500/20 border border-pink-500/50 rounded-full px-2 py-1 text-[10px] text-pink-300 font-bold uppercase whitespace-nowrap"><Hash size={10} className="inline mr-1"/> SHA-256</div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-4 border border-pink-500/30 rounded-xl bg-black/40 w-full max-w-[250px] text-center"
                      >
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Recalculated Hash</p>
                        <p className="text-sm font-mono font-bold text-pink-300 break-all">{recalculatedHash}</p>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 2: Decrypt Signature (Right Side) */}
              <div className="flex flex-col items-center w-1/2 gap-4">
                <AnimatePresence>
                  {step >= 2 && (
                    <>
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 40 }} className="w-0.5 bg-gray-700 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500/20 border border-emerald-500/50 rounded-full px-2 py-1 text-[10px] text-emerald-300 font-bold uppercase whitespace-nowrap"><KeyRound size={10} className="inline mr-1"/> Alice's Public Key</div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-4 border border-emerald-500/30 rounded-xl bg-black/40 w-full max-w-[250px] text-center"
                      >
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Decrypted Hash</p>
                        <p className="text-sm font-mono font-bold text-emerald-300 break-all">{decryptedHash}</p>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Step 4: Compare */}
            <AnimatePresence>
              {step >= 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 w-full max-w-xl p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 shadow-2xl ${isValid ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-red-500/10 border-red-500/50'}`}
                >
                  {isValid ? (
                    <>
                      <ShieldCheck size={48} className="text-emerald-400" />
                      <h3 className="text-2xl font-black text-emerald-400 tracking-wider uppercase">Signature Valid</h3>
                      <p className="text-center text-emerald-200/70 text-sm">The decrypted hash matches the recalculated hash. The document was written by Alice and has not been tampered with.</p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={48} className="text-red-400" />
                      <h3 className="text-2xl font-black text-red-400 tracking-wider uppercase">Signature Invalid</h3>
                      <p className="text-center text-red-200/70 text-sm">The hashes do not match. The document was either tampered with in transit, or the signature was not created by Alice.</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

      </div>
    </div>
  );
}
