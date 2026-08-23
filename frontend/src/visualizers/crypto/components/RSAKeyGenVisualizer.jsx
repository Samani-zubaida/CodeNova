import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, CheckCircle, ChevronRight, Calculator, Lock } from 'lucide-react';

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

export default function RSAKeyGenVisualizer() {
  const [p, setP] = useState(11);
  const [q, setQ] = useState(13);
  const [step, setStep] = useState(1);

  // Derived Values
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  
  // Choose e (must be coprime with phi and 1 < e < phi)
  // We'll just auto-pick a common one or calculate a valid one
  let e = 3;
  while (gcd(e, phi) !== 1 && e < phi) {
    e += 2;
  }
  if (e >= phi) e = 3; // Fallback

  const d = modInverse(e, phi);

  const isValidP = isPrime(p);
  const isValidQ = isPrime(q) && p !== q;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleReset = () => {
    setStep(1);
    setP(11);
    setQ(13);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto min-h-max pb-8 text-white font-mono">
      
      {/* Intro */}
      <div>
        <h3 className="text-2xl font-bold mb-2 text-[var(--color-nova-cyan)] flex items-center gap-2">
          <KeyRound /> RSA Key Generation
        </h3>
        <p className="text-gray-400 text-sm max-w-3xl">
          RSA is an asymmetric algorithm, meaning it uses two keys: a Public Key (to encrypt) and a Private Key (to decrypt). 
          The security relies on the fact that multiplying two large prime numbers is easy, but factoring their product is extremely difficult. Let's generate a keypair mathematically!
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Step 1: Primes */}
        <div className={`p-6 rounded-2xl border transition-all duration-500 ${step >= 1 ? 'bg-white/5 border-[var(--color-nova-cyan)]' : 'bg-black/50 border-gray-800 opacity-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-[var(--color-nova-cyan)] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--color-nova-cyan)] text-black flex items-center justify-center text-sm">1</span>
              Choose Two Prime Numbers
            </h4>
            {step > 1 && <CheckCircle className="text-green-400" />}
          </div>
          
          <div className="flex gap-8 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-400">Prime (p)</label>
              <input 
                type="number" 
                value={p} 
                onChange={e => setP(parseInt(e.target.value) || 0)}
                disabled={step > 1}
                className={`bg-black border p-3 rounded-xl font-mono text-xl w-32 ${isValidP ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}
              />
              {!isValidP && <span className="text-xs text-red-400">Must be a prime number</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-400">Prime (q)</label>
              <input 
                type="number" 
                value={q} 
                onChange={e => setQ(parseInt(e.target.value) || 0)}
                disabled={step > 1}
                className={`bg-black border p-3 rounded-xl font-mono text-xl w-32 ${isValidQ ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}
              />
              {!isValidQ && <span className="text-xs text-red-400">Must be a unique prime</span>}
            </div>
            
            {step === 1 && (
              <button 
                onClick={handleNext}
                disabled={!isValidP || !isValidQ}
                className="mb-2 px-6 py-3 bg-[var(--color-nova-cyan)] text-black font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Derive Modulus <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Step 2: Calculate n and phi */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border transition-all duration-500 ${step >= 2 ? 'bg-white/5 border-[var(--color-nova-cyan)]' : 'bg-black/50 border-gray-800 opacity-50'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-[var(--color-nova-cyan)] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-nova-cyan)] text-black flex items-center justify-center text-sm">2</span>
                  Calculate Modulus (n) & Totient (φ)
                </h4>
                {step > 2 && <CheckCircle className="text-green-400" />}
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex flex-col gap-2 relative overflow-hidden group">
                  <span className="text-sm text-gray-400 font-bold">Modulus (n) = p × q</span>
                  <div className="font-mono text-xl text-white">
                    {p} × {q} = <span className="text-[var(--color-nova-cyan)] font-bold text-3xl">{n}</span>
                  </div>
                  <Calculator className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:scale-110 transition-transform" />
                </div>
                
                <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex flex-col gap-2 relative overflow-hidden group">
                  <span className="text-sm text-gray-400 font-bold">Euler's Totient φ(n) = (p-1) × (q-1)</span>
                  <div className="font-mono text-xl text-white">
                    ({p}-1) × ({q}-1) = <span className="text-[var(--color-nova-cyan)] font-bold text-3xl">{phi}</span>
                  </div>
                  <Calculator className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              
              {step === 2 && (
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleNext}
                    className="px-6 py-3 bg-[var(--color-nova-cyan)] text-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    Select Exponent (e) <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Public Exponent */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border transition-all duration-500 ${step >= 3 ? 'bg-white/5 border-[var(--color-nova-cyan)]' : 'bg-black/50 border-gray-800 opacity-50'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-[var(--color-nova-cyan)] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-nova-cyan)] text-black flex items-center justify-center text-sm">3</span>
                  Choose Public Exponent (e)
                </h4>
                {step > 3 && <CheckCircle className="text-green-400" />}
              </div>
              
              <div className="flex items-center gap-8 bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-2">
                    We need an integer <strong>e</strong> such that 1 {'<'} e {'<'} φ(n) and e is coprime to φ(n).
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    gcd(e, {phi}) = 1
                  </p>
                </div>
                <div className="text-4xl font-bold font-mono text-[var(--color-nova-cyan)] bg-black/50 p-4 rounded-xl border border-[var(--color-nova-cyan)]/30">
                  e = {e}
                </div>
              </div>
              
              {step === 3 && (
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleNext}
                    className="px-6 py-3 bg-[var(--color-nova-cyan)] text-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    Calculate Private Key (d) <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: Final Keys */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl border bg-gradient-to-br from-[var(--color-nova-cyan)]/20 to-transparent border-[var(--color-nova-cyan)] shadow-[0_0_50px_rgba(34,211,238,0.15)]"
            >
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Lock className="text-[var(--color-nova-cyan)]" /> Keypair Generated Successfully!
                </h4>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  Start Over
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                
                {/* Public Key */}
                <div className="flex flex-col gap-4 p-6 bg-black/60 rounded-xl border border-gray-600 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <KeyRound size={64} />
                  </div>
                  <h5 className="text-lg font-bold text-gray-300 uppercase tracking-widest border-b border-gray-700 pb-2">Public Key (n, e)</h5>
                  <p className="text-sm text-gray-500">Shared publicly. Anyone can use this to encrypt a message for you.</p>
                  <div className="font-mono text-2xl text-[var(--color-nova-cyan)] mt-2 font-bold break-all">
                    ({n}, {e})
                  </div>
                </div>

                {/* Private Key */}
                <div className="flex flex-col gap-4 p-6 bg-black/60 rounded-xl border border-[var(--color-nova-red)]/50 relative overflow-hidden group shadow-[inset_0_0_30px_rgba(239,68,68,0.1)]">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lock size={64} className="text-[var(--color-nova-red)]" />
                  </div>
                  <h5 className="text-lg font-bold text-[var(--color-nova-red)] uppercase tracking-widest border-b border-red-900 pb-2">Private Key (n, d)</h5>
                  <p className="text-sm text-gray-400">Kept secret! Only you can use this to decrypt the message.</p>
                  <p className="text-xs text-gray-500 font-mono">d ≡ e⁻¹ (mod φ) ➔ {e} × d ≡ 1 (mod {phi})</p>
                  <div className="font-mono text-2xl text-[var(--color-nova-red)] mt-2 font-bold break-all">
                    ({n}, {d})
                  </div>
                </div>

              </div>
              
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
