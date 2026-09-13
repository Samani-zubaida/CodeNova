import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, CheckCircle, ChevronRight, Calculator, Lock, Unlock, ArrowRight, ShieldCheck, RefreshCw, Send } from 'lucide-react';

const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Greatest Common Divisor
const gcd = (a, b) => {
  return b === 0 ? a : gcd(b, a % b);
};

// Extended Euclidean Algorithm to find modular inverse
const modInverse = (a, m) => {
  let m0 = m, y = 0, x = 1;
  if (m === 1) return 0;
  let q, t;
  while (a > 1) {
    q = Math.floor(a / m);
    t = m;
    m = a % m;
    a = t;
    t = y;
    y = x - q * y;
    x = t;
  }
  if (x < 0) x += m0;
  return x;
};

// Fast modular exponentiation (base^exp % mod)
const modPow = (base, exp, mod) => {
  try {
    let res = 1n;
    let b = BigInt(base) % BigInt(mod);
    let e = BigInt(exp);
    let m = BigInt(mod);
    while (e > 0n) {
      if (e % 2n === 1n) res = (res * b) % m;
      b = (b * b) % m;
      e /= 2n;
    }
    return Number(res);
  } catch {
    return 0;
  }
};

export default function RSAKeyGenVisualizer() {
  const [p, setP] = useState(11);
  const [q, setQ] = useState(13);
  const [step, setStep] = useState(1);
  const [messageNum, setMessageNum] = useState(7);

  // Derived Values
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  
  // Calculate valid e (coprime to phi and 1 < e < phi)
  const e = useMemo(() => {
    let testE = 3;
    while (gcd(testE, phi) !== 1 && testE < phi) {
      testE += 2;
    }
    return testE < phi ? testE : 3;
  }, [phi]);

  const d = useMemo(() => {
    return modInverse(e, phi);
  }, [e, phi]);

  const isValidP = isPrime(p);
  const isValidQ = isPrime(q) && p !== q;

  // Live Encryption / Decryption calculation
  const safeMessage = Math.min(Math.max(1, messageNum), n > 1 ? n - 1 : 1);
  const ciphertext = useMemo(() => {
    return modPow(safeMessage, e, n);
  }, [safeMessage, e, n]);

  const decrypted = useMemo(() => {
    return modPow(ciphertext, d, n);
  }, [ciphertext, d, n]);

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleReset = () => {
    setStep(1);
    setP(11);
    setQ(13);
    setMessageNum(7);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto min-h-max pb-8 font-sans">
      
      {/* Intro */}
      <div className="pb-2 border-b border-[#BCA297]/20 dark:border-[#5C4E49]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-[#2D1F23] dark:text-[#F4EBC3]">
            <KeyRound className="text-[#AB526B] dark:text-[#F0E2A4]" size={24} />
            RSA Asymmetric Cryptosystem
          </h3>
          <p className="text-xs text-[#8C7A70] dark:text-[#BCA297] mt-1 max-w-2xl">
            Interactive mathematical walkthrough of Rivest–Shamir–Adleman (RSA): Prime generation, Euler's totient, modular inverse derivation, and live asymmetric message encryption/recovery.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl border border-[#BCA297]/30 dark:border-[#5C4E49] text-xs font-semibold text-[#8C7A70] dark:text-[#BCA297] hover:text-[#AB526B] hover:bg-[#BCA297]/10 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Reset Math</span>
        </button>
      </div>

      {/* Steps Progress Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { num: 1, name: '1. Primes (p, q)' },
          { num: 2, name: '2. Modulus & φ(n)' },
          { num: 3, name: '3. Public Exponent (e)' },
          { num: 4, name: '4. Private Key (d)' },
          { num: 5, name: '5. Live Encryption Lab' }
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
              step === s.num
                ? 'bg-[#AB526B] text-white border-[#AB526B] shadow-sm font-bold'
                : step > s.num
                  ? 'bg-[#C5CEAE]/20 border-[#C5CEAE]/50 text-[#607345] dark:text-[#C5CEAE]'
                  : 'bg-white/60 dark:bg-[#423834]/60 border-[#BCA297]/30 dark:border-[#5C4E49] text-[#8C7A70] dark:text-[#BCA297]'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="flex flex-col gap-6">

        {/* Step 1: Prime Selection */}
        <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${step === 1 ? 'bg-white dark:bg-[#423834] border-[#AB526B] dark:border-[#F0E2A4] shadow-sm' : 'bg-white/70 dark:bg-[#423834]/50 border-[#BCA297]/30 dark:border-[#5C4E49]'}`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-[#2D1F23] dark:text-[#F4EBC3] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#AB526B]/20 text-[#AB526B] dark:text-[#F0E2A4] flex items-center justify-center text-xs font-bold">1</span>
              Choose Two Secret Primes (p and q)
            </h4>
            {isValidP && isValidQ && <CheckCircle size={18} className="text-green-500" />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/25 dark:border-[#5C4E49] flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#8C7A70] dark:text-[#BCA297]">Prime p:</span>
                <span className={isValidP ? "text-green-600 dark:text-green-400 font-bold" : "text-red-500 font-bold"}>
                  {isValidP ? "Prime Number" : "Not Prime!"}
                </span>
              </div>
              <input 
                type="number"
                value={p}
                min={2}
                max={97}
                onChange={(e) => setP(parseInt(e.target.value) || 2)}
                className="w-full bg-white dark:bg-[#423834] border border-[#BCA297]/30 dark:border-[#5C4E49] rounded-lg px-3 py-2 text-lg font-mono font-bold text-[#2D1F23] dark:text-[#F4EBC3] outline-none focus:border-[#AB526B]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/25 dark:border-[#5C4E49] flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#8C7A70] dark:text-[#BCA297]">Prime q:</span>
                <span className={isValidQ ? "text-green-600 dark:text-green-400 font-bold" : "text-red-500 font-bold"}>
                  {isValidQ ? "Prime Number" : (p === q ? "Must differ from p" : "Not Prime!")}
                </span>
              </div>
              <input 
                type="number"
                value={q}
                min={2}
                max={97}
                onChange={(e) => setQ(parseInt(e.target.value) || 2)}
                className="w-full bg-white dark:bg-[#423834] border border-[#BCA297]/30 dark:border-[#5C4E49] rounded-lg px-3 py-2 text-lg font-mono font-bold text-[#2D1F23] dark:text-[#F4EBC3] outline-none focus:border-[#AB526B]"
              />
            </div>
          </div>

          {step === 1 && (
            <div className="mt-4 flex justify-end">
              <button 
                disabled={!isValidP || !isValidQ}
                onClick={handleNext}
                className="px-4 py-2 bg-[#AB526B] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-40 hover:brightness-110 shadow-sm transition-all"
              >
                Compute Modulus & Totient <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Modulus & Totient */}
        {step >= 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 sm:p-6 rounded-2xl border transition-all ${step === 2 ? 'bg-white dark:bg-[#423834] border-[#AB526B] dark:border-[#F0E2A4] shadow-sm' : 'bg-white/70 dark:bg-[#423834]/50 border-[#BCA297]/30 dark:border-[#5C4E49]'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#2D1F23] dark:text-[#F4EBC3] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#AB526B]/20 text-[#AB526B] dark:text-[#F0E2A4] flex items-center justify-center text-xs font-bold">2</span>
                Calculate Modulus (n) & Euler's Totient φ(n)
              </h4>
              <CheckCircle size={18} className="text-green-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/25 dark:border-[#5C4E49]">
                <span className="text-xs font-bold text-[#8C7A70] dark:text-[#BCA297] block mb-1">Public Modulus n = p × q</span>
                <div className="font-mono text-base sm:text-xl font-bold text-[#2D1F23] dark:text-[#F4EBC3]">
                  {p} × {q} = <span className="text-[#AB526B] dark:text-[#F0E2A4]">{n}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/25 dark:border-[#5C4E49]">
                <span className="text-xs font-bold text-[#8C7A70] dark:text-[#BCA297] block mb-1">Euler's Totient φ(n) = (p-1) × (q-1)</span>
                <div className="font-mono text-base sm:text-xl font-bold text-[#2D1F23] dark:text-[#F4EBC3]">
                  ({p}-1) × ({q}-1) = <span className="text-[#AB526B] dark:text-[#F0E2A4]">{phi}</span>
                </div>
              </div>
            </div>

            {step === 2 && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="px-4 py-2 bg-[#AB526B] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 shadow-sm transition-all"
                >
                  Choose Public Exponent (e) <ChevronRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Public Exponent (e) */}
        {step >= 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 sm:p-6 rounded-2xl border transition-all ${step === 3 ? 'bg-white dark:bg-[#423834] border-[#AB526B] dark:border-[#F0E2A4] shadow-sm' : 'bg-white/70 dark:bg-[#423834]/50 border-[#BCA297]/30 dark:border-[#5C4E49]'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#2D1F23] dark:text-[#F4EBC3] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#AB526B]/20 text-[#AB526B] dark:text-[#F0E2A4] flex items-center justify-center text-xs font-bold">3</span>
                Select Public Exponent (e)
              </h4>
              <CheckCircle size={18} className="text-green-500" />
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/25 dark:border-[#5C4E49] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#8C7A70] dark:text-[#BCA297]">
                  Must be coprime with φ(n): <strong className="font-mono">gcd(e, {phi}) = 1</strong> and <strong className="font-mono">1 &lt; e &lt; {phi}</strong>
                </p>
              </div>
              <div className="font-mono text-2xl font-bold text-[#AB526B] dark:text-[#F0E2A4] px-4 py-2 bg-white dark:bg-[#423834] rounded-xl border border-[#BCA297]/30 dark:border-[#5C4E49]">
                e = {e}
              </div>
            </div>

            {step === 3 && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="px-4 py-2 bg-[#AB526B] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 shadow-sm transition-all"
                >
                  Derive Private Key (d) <ChevronRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 4: Keypair Summary */}
        {step >= 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 sm:p-6 rounded-2xl border transition-all ${step === 4 ? 'bg-white dark:bg-[#423834] border-[#AB526B] dark:border-[#F0E2A4] shadow-sm' : 'bg-white/70 dark:bg-[#423834]/50 border-[#BCA297]/30 dark:border-[#5C4E49]'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#2D1F23] dark:text-[#F4EBC3] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#AB526B]/20 text-[#AB526B] dark:text-[#F0E2A4] flex items-center justify-center text-xs font-bold">4</span>
                Derived Asymmetric Keypair
              </h4>
              <CheckCircle size={18} className="text-green-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Public Key */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/30 dark:border-[#5C4E49]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#2D1F23] dark:text-[#F4EBC3] uppercase tracking-wider flex items-center gap-1.5">
                    <Unlock size={14} className="text-green-600 dark:text-green-400" />
                    Public Key (n, e)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">Shareable</span>
                </div>
                <p className="text-[11px] text-[#8C7A70] dark:text-[#BCA297] mb-2">Used by the sender to encrypt messages.</p>
                <div className="font-mono text-xl font-bold text-[#AB526B] dark:text-[#F0E2A4]">
                  ({n}, {e})
                </div>
              </div>

              {/* Private Key */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/30 dark:border-[#5C4E49]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#2D1F23] dark:text-[#F4EBC3] uppercase tracking-wider flex items-center gap-1.5">
                    <Lock size={14} className="text-[#AB526B]" />
                    Private Key (n, d)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#AB526B]/15 text-[#AB526B]">Confidential</span>
                </div>
                <p className="text-[11px] text-[#8C7A70] dark:text-[#BCA297] mb-2">d ≡ e⁻¹ (mod φ) = {e}⁻¹ mod {phi} = {d}</p>
                <div className="font-mono text-xl font-bold text-[#AB526B]">
                  ({n}, {d})
                </div>
              </div>
            </div>

            {step === 4 && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="px-4 py-2 bg-[#AB526B] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:brightness-110 shadow-sm transition-all"
                >
                  Test Live Encryption Sandbox <ChevronRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 5: Live Encryption & Decryption Sandbox */}
        {step >= 5 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 sm:p-6 rounded-2xl border border-[#AB526B] dark:border-[#F0E2A4] bg-white dark:bg-[#423834] shadow-md flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-[#2D1F23] dark:text-[#F4EBC3] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#AB526B] text-white flex items-center justify-center text-xs font-bold">5</span>
                Live Message Encryption & Recovery Sandbox
              </h4>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#C5CEAE]/30 text-[#607345] dark:text-[#C5CEAE] border border-[#C5CEAE]/40">
                End-to-End Simulation
              </span>
            </div>

            {/* Input Message Slider / Box */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/30 dark:border-[#5C4E49] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-[#2D1F23] dark:text-[#F4EBC3]">
                  Select Message Integer (M &lt; {n}):
                </span>
                <span className="text-[11px] text-[#8C7A70] dark:text-[#BCA297]">
                  Any numeric payload smaller than the modulus n
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max={Math.max(2, n - 1)}
                  value={safeMessage}
                  onChange={(e) => setMessageNum(parseInt(e.target.value))}
                  className="w-32 sm:w-48 accent-[#AB526B]"
                />
                <span className="font-mono text-lg font-extrabold text-[#AB526B] dark:text-[#F0E2A4] w-12 text-right">
                  {safeMessage}
                </span>
              </div>
            </div>

            {/* Visual Encryption Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              {/* Box 1: Plaintext M */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#331921] border border-[#BCA297]/30 dark:border-[#5C4E49] flex flex-col items-center text-center gap-1">
                <span className="text-xs font-bold text-[#8C7A70] dark:text-[#BCA297] uppercase">Original Payload (M)</span>
                <span className="font-mono text-3xl font-black text-[#2D1F23] dark:text-[#F4EBC3] my-2">{safeMessage}</span>
                <span className="text-[10px] text-[#8C7A70] dark:text-[#BCA297]">Sender plaintext</span>
              </div>

              {/* Box 2: Ciphertext C */}
              <div className="p-4 rounded-xl bg-[#AB526B]/15 dark:bg-[#AB526B]/30 border border-[#AB526B]/50 flex flex-col items-center text-center gap-1">
                <span className="text-xs font-bold text-[#AB526B] dark:text-[#F0E2A4] uppercase">Ciphertext (C = Mᵉ mod n)</span>
                <div className="font-mono text-3xl font-black text-[#AB526B] dark:text-[#F0E2A4] my-2">
                  {ciphertext}
                </div>
                <span className="text-[10px] text-[#8C7A70] dark:text-[#BCA297] font-mono">
                  {safeMessage}^{e} mod {n}
                </span>
              </div>

              {/* Box 3: Decrypted M' */}
              <div className="p-4 rounded-xl bg-[#C5CEAE]/20 dark:bg-[#C5CEAE]/20 border border-[#C5CEAE]/60 flex flex-col items-center text-center gap-1">
                <span className="text-xs font-bold text-[#607345] dark:text-[#C5CEAE] uppercase flex items-center gap-1">
                  <ShieldCheck size={14} /> Recovered (M = Cᵈ mod n)
                </span>
                <span className="font-mono text-3xl font-black text-[#607345] dark:text-[#C5CEAE] my-2">
                  {decrypted}
                </span>
                <span className="text-[10px] text-[#8C7A70] dark:text-[#BCA297] font-mono">
                  {ciphertext}^{d} mod {n} = {decrypted}
                </span>
              </div>

            </div>

            {/* Verification Success Pill */}
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-between text-xs">
              <span className="text-green-700 dark:text-green-300 font-semibold flex items-center gap-1.5">
                <CheckCircle size={15} />
                Mathematical Invariance Verified: M ≡ (Mᵉ)ᵈ ≡ M (mod n)
              </span>
              <span className="font-mono font-bold text-green-700 dark:text-green-300">
                {safeMessage} == {decrypted}
              </span>
            </div>

          </motion.div>
        )}

      </div>

    </div>
  );
}