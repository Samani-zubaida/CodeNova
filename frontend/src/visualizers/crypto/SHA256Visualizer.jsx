import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Sparkles, Binary, Copy, Check, Zap, ArrowRight, ShieldCheck, RefreshCw, Gauge } from 'lucide-react';

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  const hashBin = hashArray.map((b) => b.toString(2).padStart(8, '0')).join('');
  return { hashHex, hashBin };
}

const PRESETS = [
  { label: 'Fox "dog"', text: 'The quick brown fox jumps over the lazy dog' },
  { label: 'Fox "cog" (1 char diff)', text: 'The quick brown fox jumps over the lazy cog' },
  { label: 'Bitcoin Genesis', text: 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks' },
  { label: 'Password123', text: 'Password123!' }
];

export default function HashVisualizer() {
  const [inputText, setInputText] = useState('The quick brown fox jumps over the lazy dog');
  const [debouncedText, setDebouncedText] = useState(inputText);
  const [hash, setHash] = useState('');
  const [hashBin, setHashBin] = useState('');
  const [prevHash, setPrevHash] = useState('');
  const [prevHashBin, setPrevHashBin] = useState('');
  const [viewFormat, setViewFormat] = useState('hex'); // 'hex' | 'binary'
  const [copied, setCopied] = useState(false);

  // Debounce input to prevent high-frequency crypto calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(inputText);
    }, 120);
    return () => clearTimeout(timer);
  }, [inputText]);

  // Compute SHA-256 hash when debouncedText changes
  useEffect(() => {
    let active = true;
    const computeHash = async () => {
      const { hashHex, hashBin: bin } = await digestMessage(debouncedText || ' ');
      if (active) {
        setPrevHash(hash);
        setPrevHashBin(hashBin);
        setHash(hashHex);
        setHashBin(bin);
      }
    };
    computeHash();
    return () => { active = false; };
  }, [debouncedText]);

  // Calculate Avalanche Effect Metrics
  const avalancheMetrics = useMemo(() => {
    if (!prevHashBin || !hashBin || prevHashBin.length !== hashBin.length) {
      return { diffCount: 0, percent: 50.0, label: 'Standard Diffusion' };
    }
    let diff = 0;
    for (let i = 0; i < hashBin.length; i++) {
      if (hashBin[i] !== prevHashBin[i]) diff++;
    }
    const pct = ((diff / hashBin.length) * 100).toFixed(1);
    let label = 'Near-Perfect Diffusion';
    if (diff === 0) label = 'Unchanged';
    else if (Math.abs(pct - 50) <= 8) label = 'Optimal Avalanche (Ideal ~50%)';
    else label = 'High Entropy Diffusion';

    return { diffCount: diff, percent: pct, label };
  }, [hashBin, prevHashBin]);

  const handleCopy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto h-full font-sans">
      
      {/* Intro & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#BCA297]/20 dark:border-[#5C4E49]/60">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-[#2D1F23] dark:text-[#F4EBC3]">
            <Hash className="text-[#AB526B] dark:text-[#F0E2A4]" size={24} />
            SHA-256 Cryptographic Hash & Avalanche Visualizer
          </h3>
          <p className="text-xs text-[#8C7A70] dark:text-[#BCA297] mt-1 max-w-3xl">
            A deterministic 256-bit one-way hash function. Demonstrates strict avalanche criteria: changing a single bit in the input randomly alters ~50% of the output bits.
          </p>
        </div>

        {/* Format Switcher */}
        <div className="flex items-center bg-[#FAF7F2] dark:bg-[#331921] p-1 rounded-xl border border-[#BCA297]/30 dark:border-[#5C4E49] self-start sm:self-auto">
          <button
            onClick={() => setViewFormat('hex')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewFormat === 'hex'
                ? 'bg-white dark:bg-[#423834] text-[#AB526B] dark:text-[#F0E2A4] shadow-sm font-bold'
                : 'text-[#8C7A70] dark:text-[#BCA297] hover:text-[#2D1F23]'
            }`}
          >
            64-Hex
          </button>
          <button
            onClick={() => setViewFormat('binary')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              viewFormat === 'binary'
                ? 'bg-white dark:bg-[#423834] text-[#AB526B] dark:text-[#F0E2A4] shadow-sm font-bold'
                : 'text-[#8C7A70] dark:text-[#BCA297] hover:text-[#2D1F23]'
            }`}
          >
            <Binary size={12} />
            256-Bits
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs custom-scrollbar">
        <span className="text-[11px] font-bold text-[#8C7A70] dark:text-[#BCA297] whitespace-nowrap">
          Presets:
        </span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(p.text)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all whitespace-nowrap ${
              inputText === p.text
                ? 'bg-[#AB526B]/15 dark:bg-[#AB526B]/30 border-[#AB526B] text-[#AB526B] dark:text-[#F0E2A4] font-bold'
                : 'bg-white/80 dark:bg-[#423834]/80 border-[#BCA297]/30 dark:border-[#5C4E49] text-[#8C7A70] dark:text-[#BCA297] hover:border-[#AB526B]/50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Text Area */}
      <div className="bg-white dark:bg-[#423834] p-4 sm:p-5 rounded-2xl border border-[#BCA297]/30 dark:border-[#5C4E49] shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#8C7A70] dark:text-[#BCA297]">
          <span className="uppercase tracking-wider font-bold">Input Plaintext (Live Stream)</span>
          <span>{inputText.length} bytes ({inputText.length * 8} bits)</span>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste any text to hash..."
          rows={3}
          className="w-full bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/30 dark:border-[#5C4E49] rounded-xl p-3 text-sm font-mono text-[#2D1F23] dark:text-[#F4EBC3] outline-none focus:border-[#AB526B] dark:focus:border-[#F0E2A4] transition-colors resize-none"
        />
      </div>

      {/* Avalanche Metrics HUD */}
      {prevHash && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#AB526B]/10 via-[#F0E2A4]/15 to-[#C5CEAE]/15 border border-[#BCA297]/30 dark:border-[#5C4E49] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#AB526B]/20 text-[#AB526B] dark:text-[#F0E2A4] flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#8C7A70] dark:text-[#BCA297] uppercase tracking-wider">
                Avalanche Diffusion Metric
              </div>
              <div className="text-sm font-extrabold text-[#2D1F23] dark:text-[#F4EBC3] flex items-center gap-2">
                <span>{avalancheMetrics.diffCount} / 256 bits changed ({avalancheMetrics.percent}%)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5CEAE]/30 text-[#607345] dark:text-[#C5CEAE] font-mono border border-[#C5CEAE]/40 font-bold">
                  {avalancheMetrics.label}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-48 flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-mono text-[#8C7A70] dark:text-[#BCA297]">
              <span>0%</span>
              <span className="font-bold text-[#AB526B] dark:text-[#F0E2A4]">50% Ideal</span>
              <span>100%</span>
            </div>
            <div className="h-2 w-full bg-[#BCA297]/25 dark:bg-black/30 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-[#AB526B] to-[#C5CEAE] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, avalancheMetrics.percent))}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Output Hash Canvas */}
      <div className="flex-1 bg-white dark:bg-[#423834] p-5 sm:p-6 rounded-2xl border border-[#BCA297]/30 dark:border-[#5C4E49] shadow-sm flex flex-col gap-4">
        
        {/* Output Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#2D1F23] dark:text-[#F4EBC3] uppercase tracking-wider">
              {viewFormat === 'hex' ? '256-Bit SHA-256 Digest (64 Hex Characters)' : '256-Bit Binary Stream Matrix'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#BCA297]/20 dark:bg-white/10 text-[#8C7A70] dark:text-[#BCA297]">
              Fixed 32 Bytes
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded-lg border border-[#BCA297]/30 dark:border-[#5C4E49] text-xs font-semibold text-[#8C7A70] dark:text-[#BCA297] hover:text-[#AB526B] hover:bg-[#BCA297]/10 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
          </button>
        </div>

        {/* View 1: 64 Hex Characters Grid */}
        {viewFormat === 'hex' ? (
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 sm:gap-2 p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/25 dark:border-[#5C4E49]">
            {hash.split('').map((char, i) => {
              const isChanged = prevHash && prevHash[i] !== char;
              return (
                <motion.div
                  key={`${i}-${char}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: i * 0.003 }}
                  className={`aspect-square flex items-center justify-center rounded-lg font-mono text-sm sm:text-base font-bold transition-colors ${
                    isChanged
                      ? 'bg-[#AB526B]/20 text-[#AB526B] dark:text-[#F0E2A4] border border-[#AB526B]/60 shadow-sm'
                      : 'bg-white/80 dark:bg-[#423834]/80 text-[#2D1F23] dark:text-[#F4EBC3] border border-[#BCA297]/30 dark:border-[#5C4E49]/60'
                  }`}
                  title={`Byte ${Math.floor(i / 2)}: 0x${char}`}
                >
                  {char}
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* View 2: 256 Binary Bits Matrix */
          <div className="grid grid-cols-16 sm:grid-cols-32 gap-1 p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/25 dark:border-[#5C4E49] max-h-72 overflow-y-auto custom-scrollbar">
            {hashBin.split('').map((bit, i) => {
              const isChanged = prevHashBin && prevHashBin[i] !== bit;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded text-[10px] font-mono font-bold flex items-center justify-center transition-colors ${
                    isChanged
                      ? 'bg-[#AB526B] text-white shadow-sm'
                      : bit === '1'
                        ? 'bg-[#C5CEAE]/30 text-[#607345] dark:text-[#C5CEAE] border border-[#C5CEAE]/40'
                        : 'bg-white/60 dark:bg-[#423834]/60 text-[#8C7A70] dark:text-[#BCA297]'
                  }`}
                  title={`Bit ${i}: ${bit}${isChanged ? ' (Flipped!)' : ''}`}
                >
                  {bit}
                </div>
              );
            })}
          </div>
        )}

        {/* Full Hex String Display */}
        <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/20 dark:border-[#5C4E49]/60 flex items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-[#2D1F23] dark:text-[#F4EBC3] break-all select-all">
            {hash}
          </span>
        </div>

      </div>

    </div>
  );
}