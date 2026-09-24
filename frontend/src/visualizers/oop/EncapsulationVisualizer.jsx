import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, RotateCcw, ArrowRight, Zap, Ban, CheckCircle2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { ENCAPSULATION_PHASES } from './data/encapsulationData';

export default function EncapsulationVisualizer({ isEmbedded = false, onNext, onReturnToCatalog }) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Animation Phases: 'exposed' -> 'bundling' -> 'sealed' -> 'requesting' -> 'responding' -> 'completed'
  const [phase, setPhase] = useState('exposed');
  const [requestCount, setRequestCount] = useState(0);
  const [isManualRequestRunning, setIsManualRequestRunning] = useState(false);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Run the full cinematic timeline sequence
  const startCinematicTimeline = () => {
    clearAllTimeouts();
    setPhase('exposed');
    setIsManualRequestRunning(false);

    // 0.0s - 4.2s: Phase 1: Exposed floating state outside the capsule
    // 4.2s - 7.5s: Phase 2: Capsule begins wrapping around the two objects
    const t1 = setTimeout(() => {
      setPhase('bundling');
    }, 4200);

    // 7.5s - 10.0s: Phase 3: Shells seal shut completely, lock engages
    const t2 = setTimeout(() => {
      setPhase('sealed');
    }, 7500);

    // 10.0s - 12.5s: Phase 4: External request signal approaches the capsule
    const t3 = setTimeout(() => {
      setPhase('requesting');
    }, 10000);

    // 12.5s - 15.0s: Phase 5: Controlled response emitted via public getData()
    const t4 = setTimeout(() => {
      setPhase('responding');
    }, 12500);

    // 15.0s+: Phase 6: Completion and educational summary reveal
    const t5 = setTimeout(() => {
      setPhase('completed');
    }, 15000);

    timeoutsRef.current = [t1, t2, t3, t4, t5];
  };

  useEffect(() => {
    startCinematicTimeline();
    return () => clearAllTimeouts();
  }, [requestCount]);

  // Handle manual interactive request
  const handleTriggerManualRequest = async () => {
    if (isManualRequestRunning) return;
    setIsManualRequestRunning(true);
    setPhase('requesting');

    await new Promise(r => setTimeout(r, 1800));
    setPhase('responding');

    await new Promise(r => setTimeout(r, 2200));
    setPhase('completed');
    setIsManualRequestRunning(false);
  };

  const handleReplay = () => {
    setRequestCount(prev => prev + 1);
  };

  // Status banner information from centralized configuration
  const status = ENCAPSULATION_PHASES[phase] || ENCAPSULATION_PHASES.completed;

  const containerBgClass = isDark
    ? 'bg-[#080C16] text-[#FAF7F2]'
    : isWarm
    ? 'bg-[#FDFBF7] text-[#2D1F23]'
    : 'bg-[#F8FAFC] text-slate-900';

  const cardBgClass = isDark
    ? 'bg-slate-900/70 border-white/10 text-slate-300 shadow-[0_20px_45px_rgba(0,0,0,0.6)]'
    : isWarm
    ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] text-[#2D1F23] shadow-lg'
    : 'bg-white/95 border-slate-200 text-slate-800 shadow-xl';

  return (
    <div className={`relative w-full h-full flex-1 flex flex-col items-center justify-between select-none overflow-hidden ${containerBgClass} font-sans transition-colors duration-300`}>
      
      {/* ── 1. ATMOSPHERIC COSMIC NEBULA BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Deep Multi-Hued Atmospheric Auroras */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] bg-gradient-to-tr from-cyan-600/10 via-purple-600/15 to-transparent rounded-full blur-[160px] opacity-75" />
        <div className="absolute -bottom-32 -left-28 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 -right-28 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />

        {/* Minimal Futuristic Coordinate Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf806_1px,transparent_1px),linear-gradient(to_bottom,#38bdf806_1px,transparent_1px)] bg-[size:44px_44px] opacity-50" />

        {/* Subtle Stardust Floating Particles */}
        <div className="absolute inset-0">
          {[
            { top: '16%', left: '20%', size: '3px', delay: '0s', dur: '6s', col: '#C084FC' },
            { top: '38%', left: '80%', size: '2px', delay: '1s', dur: '8s', col: '#38BDF8' },
            { top: '68%', left: '16%', size: '3px', delay: '2s', dur: '7s', col: '#818CF8' },
            { top: '80%', left: '84%', size: '2px', delay: '3s', dur: '9s', col: '#22D3EE' },
            { top: '24%', left: '86%', size: '3.5px', delay: '1.5s', dur: '6.5s', col: '#E879F9' },
            { top: '55%', left: '10%', size: '2.5px', delay: '0.5s', dur: '7.5s', col: '#38BDF8' },
          ].map((pt, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -28, 0], 
                opacity: [0.2, 0.8, 0.2] 
              }}
              transition={{ repeat: Infinity, duration: parseFloat(pt.dur), delay: parseFloat(pt.delay), ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: pt.top,
                left: pt.left,
                width: pt.size,
                height: pt.size,
                backgroundColor: pt.col,
                borderRadius: '50%',
                boxShadow: `0 0 12px ${pt.col}`
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 2. TOP-LEFT FLOATING GLASSMORPHIC EXPLANATION PANEL ── */}
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`relative sm:absolute top-3 sm:top-5 left-auto sm:left-6 z-30 w-full max-w-[340px] sm:max-w-xs mx-auto sm:mx-0 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-2xl transition-colors ${cardBgClass}`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-sm">
            <Lock size={13} />
          </div>
          <span className={`font-mono text-xs font-black tracking-widest uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ENCAPSULATION
          </span>
        </div>
        <p className={`text-[11px] sm:text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Encapsulation bundles data and the methods that operate on it into a single unit while controlling direct access to the internal data.
        </p>

        {/* Live Step Badge */}
        <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{status.step}:</span>
          <span className={`px-2 py-0.5 rounded-full font-bold border ${status.badgeBg}`}>
            {status.tag}
          </span>
        </div>
      </motion.div>

      {/* ── 3. TOP-RIGHT LIVE TELEMETRY STATUS BADGE ── */}
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`hidden md:flex absolute top-5 right-6 z-30 items-center gap-2.5 px-3.5 py-2 rounded-xl border backdrop-blur-2xl font-mono text-xs ${cardBgClass}`}
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{status.title}</span>
      </motion.div>

      {/* ── 4. MAIN CENTRAL ANIMATION STAGE (UNBOXED FULL VIEWPORT CANVAS) ── */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 my-auto">
        
        {/* Interactive Scene Stage Container */}
        <div className="relative w-full max-w-4xl h-[420px] sm:h-[480px] flex items-center justify-center">

          {/* ==============================================================
              A. EXTERNAL CALLER NODE & REQUEST FLIGHT (PHASE 4 & 5)
              ============================================================== */}
          <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none">
            {/* External Caller Station */}
            <motion.div
              animate={{
                opacity: phase === 'requesting' || phase === 'responding' || phase === 'completed' ? 1 : 0.3,
                scale: phase === 'requesting' ? 1.05 : 1
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-900/85 border border-slate-700/70 shadow-lg backdrop-blur-md flex items-center gap-2 font-mono text-xs text-slate-300"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-extrabold text-white">External Caller / Client</span>
            </motion.div>

            {/* Glowing Request Packet Flight (Descends toward Capsule) */}
            <AnimatePresence>
              {phase === 'requesting' && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1],
                    y: [10, 50, 75]
                  }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  className="absolute top-10 flex flex-col items-center"
                >
                  <div className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-mono text-[10px] font-black shadow-[0_0_20px_#F59E0B] flex items-center gap-1.5 whitespace-nowrap">
                    <Zap size={12} className="text-slate-950 animate-bounce" />
                    <span>REQUEST: #data</span>
                  </div>
                  <div className="w-0.5 h-6 bg-gradient-to-b from-amber-500 to-transparent mt-1" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Return Token Flight (Ascends from Capsule getData()) */}
            <AnimatePresence>
              {phase === 'responding' && (
                <motion.div
                  initial={{ opacity: 0, y: 75 }}
                  animate={{ 
                    opacity: [0, 1, 1],
                    y: [75, 40, 10]
                  }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute top-10 flex flex-col items-center"
                >
                  <div className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-mono text-[10px] font-black shadow-[0_0_20px_#10B981] flex items-center gap-1.5 whitespace-nowrap">
                    <CheckCircle2 size={12} className="text-slate-950" />
                    <span>RETURN: data "safe_value"</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ==============================================================
              B. THE LARGE FUTURISTIC CAPSULE (THE PROTECTIVE SHELL)
              ============================================================== */}
          <div className="relative w-[320px] sm:w-[440px] h-[220px] sm:h-[260px] flex items-center justify-center scale-90 sm:scale-100 transition-transform">

            {/* 1. Direct Access Deflection Shield Notice (Flashes during request) */}
            <AnimatePresence>
              {phase === 'requesting' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/60 backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-300 whitespace-nowrap pointer-events-none"
                >
                  <Ban size={12} className="text-rose-400" />
                  <span>DIRECT ACCESS DEFLECTED &bull; Route via public getData()</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Outer Protective Energy Boundary (Activates after sealed) */}
            <motion.div
              animate={{
                opacity: phase === 'exposed' ? 0 : [0.4, 0.8, 0.4],
                scale: phase === 'exposed' ? 0.94 : [1, 1.02, 1],
                borderColor: phase === 'responding' ? '#10B981' : phase === 'requesting' ? '#38BDF8' : '#818CF8'
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-[-14px] rounded-[75px] border-2 border-dashed pointer-events-none z-10"
              style={{
                boxShadow: phase !== 'exposed' ? '0 0 50px rgba(56, 189, 248, 0.25)' : 'none'
              }}
            />

            {/* 3. LEFT CAPSULE SHELL */}
            <motion.div
              initial={{ x: -140, opacity: 0.15 }}
              animate={{
                x: phase === 'exposed' ? -140 : 0,
                opacity: phase === 'exposed' ? 0.15 : 0.95,
                borderColor: phase !== 'exposed' ? 'rgba(168, 85, 247, 0.65)' : 'rgba(255, 255, 255, 0.1)'
              }}
              transition={{ type: "spring", stiffness: 60, damping: 14 }}
              className="absolute left-0 top-0 bottom-0 w-1/2 rounded-l-[70px] border-l-2 border-t-2 border-b-2 bg-gradient-to-br from-slate-900/90 via-purple-950/40 to-slate-900/90 backdrop-blur-xl shadow-2xl z-20 overflow-hidden flex flex-col justify-between p-4 pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.04] to-transparent" />
              <div className="font-mono text-[9px] text-purple-400/80 tracking-wider font-bold">
                SHELL_LEFT &bull; BOUNDARY
              </div>
              <div className="flex items-center gap-1.5 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <div className="h-0.5 w-14 bg-purple-400/40" />
              </div>
            </motion.div>

            {/* 4. RIGHT CAPSULE SHELL */}
            <motion.div
              initial={{ x: 140, opacity: 0.15 }}
              animate={{
                x: phase === 'exposed' ? 140 : 0,
                opacity: phase === 'exposed' ? 0.15 : 0.95,
                borderColor: phase !== 'exposed' ? 'rgba(56, 189, 248, 0.65)' : 'rgba(255, 255, 255, 0.1)'
              }}
              transition={{ type: "spring", stiffness: 60, damping: 14 }}
              className="absolute right-0 top-0 bottom-0 w-1/2 rounded-r-[70px] border-r-2 border-t-2 border-b-2 bg-gradient-to-bl from-slate-900/90 via-cyan-950/40 to-slate-900/90 backdrop-blur-xl shadow-2xl z-20 overflow-hidden flex flex-col justify-between p-4 items-end pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.04] to-transparent" />
              <div className="font-mono text-[9px] text-cyan-400/80 tracking-wider font-bold">
                SHELL_RIGHT &bull; BOUNDARY
              </div>
              <div className="flex items-center gap-1.5 opacity-40">
                <div className="h-0.5 w-14 bg-cyan-400/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            </motion.div>

            {/* 5. CENTRAL LOCKING SEAM & CLASP (Illuminates when sealed) */}
            <AnimatePresence>
              {phase !== 'exposed' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute z-30 flex flex-col items-center justify-center pointer-events-none"
                >
                  {/* Seam Energy Beam */}
                  <motion.div 
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-0.5 h-48 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38BDF8]" 
                  />

                  {/* Central Lock Clasp */}
                  <div className="absolute p-3 rounded-2xl bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: phase === 'requesting' ? [0, -8, 8, 0] : 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Lock size={18} className="text-cyan-300" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 6. CONTROLLED PUBLIC METHOD PORT: getData() */}
            <motion.div
              initial={{ opacity: 0.2, y: 12 }}
              animate={{
                opacity: phase === 'exposed' ? 0.2 : 1,
                y: phase === 'exposed' ? 12 : 0,
                scale: phase === 'requesting' || phase === 'responding' ? 1.08 : 1,
                borderColor: phase === 'responding' ? '#10B981' : phase === 'requesting' ? '#38BDF8' : 'rgba(255,255,255,0.2)'
              }}
              className="absolute -top-7 right-8 sm:right-14 z-30 px-3.5 py-1.5 rounded-xl bg-slate-900 border backdrop-blur-xl shadow-lg flex items-center gap-2 font-mono text-[11px]"
            >
              <span className={`w-2 h-2 rounded-full ${phase === 'requesting' || phase === 'responding' ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
              <span className="font-extrabold text-cyan-300">public getData()</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider hidden sm:inline">&bull; Port</span>
            </motion.div>

            {/* ==============================================================
                C. THE TWO OBJECTS (DATA & METHODS)
                - Phase 1: Separated outside the capsule
                - Phase 2+: Wrapped and bundled together inside
                ============================================================== */}

            {/* 1. DATA OBJECT (VIOLET/PURPLE BALL) */}
            <motion.div
              initial={{ x: -210, y: -45, scale: 1.15 }}
              animate={{
                x: phase === 'exposed' ? -210 : -65,
                y: phase === 'exposed' ? [ -40, -55, -40 ] : [ -6, 6, -6 ],
                scale: phase === 'exposed' ? 1.15 : 1,
              }}
              transition={{
                x: { type: "spring", stiffness: 55, damping: 14 },
                y: { repeat: Infinity, duration: phase === 'exposed' ? 4 : 3, ease: "easeInOut" },
                scale: { duration: 0.5 }
              }}
              className="absolute z-30 flex flex-col items-center justify-center cursor-default"
            >
              {/* 3D Radiant Violet Sphere */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-[0_0_45px_rgba(168,85,247,0.7)]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E9D5FF] via-[#A855F7] to-[#581C87] border-2 border-white/60 shadow-inner" />
                <div className="absolute top-2 left-3 w-6 h-4 bg-white/50 rounded-full blur-[2px] -rotate-45" />

                <motion.div 
                  animate={{ scale: [0.88, 1.04, 0.88] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="relative z-10 flex flex-col items-center justify-center text-center font-mono"
                >
                  <span className="text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                    data
                  </span>
                  <span className="text-[8px] text-purple-200 font-bold opacity-90">
                    #private
                  </span>
                </motion.div>
              </div>

              {/* Data Attached Label */}
              <div className="mt-2 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-[10px] font-mono text-purple-300 font-bold shadow-md whitespace-nowrap">
                ● private data
              </div>
            </motion.div>

            {/* 2. METHODS OBJECT (CYAN/BLUE BALL) */}
            <motion.div
              initial={{ x: 210, y: 45, scale: 1.15 }}
              animate={{
                x: phase === 'exposed' ? 210 : 65,
                y: phase === 'exposed' ? [ 40, 55, 40 ] : [ 6, -6, 6 ],
                scale: phase === 'exposed' ? 1.15 : 1,
              }}
              transition={{
                x: { type: "spring", stiffness: 55, damping: 14 },
                y: { repeat: Infinity, duration: phase === 'exposed' ? 4.5 : 3.2, ease: "easeInOut" },
                scale: { duration: 0.5 }
              }}
              className="absolute z-30 flex flex-col items-center justify-center cursor-default"
            >
              {/* 3D Radiant Cyan Sphere */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-[0_0_45px_rgba(6,182,212,0.7)]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#CFFAFE] via-[#06B6D4] to-[#0E7490] border-2 border-white/60 shadow-inner" />
                <div className="absolute top-2 left-3 w-6 h-4 bg-white/50 rounded-full blur-[2px] -rotate-45" />

                <motion.div 
                  animate={{ scale: [0.88, 1.04, 0.88] }}
                  transition={{ repeat: Infinity, duration: 2.2, delay: 0.4 }}
                  className="relative z-10 flex flex-col items-center justify-center text-center font-mono"
                >
                  <span className="text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                    methods
                  </span>
                  <span className="text-[8px] text-cyan-100 font-bold opacity-90">
                    public API
                  </span>
                </motion.div>
              </div>

              {/* Methods Attached Label */}
              <div className="mt-2 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold shadow-md whitespace-nowrap">
                ● public methods
              </div>
            </motion.div>

            {/* BINDING CONDUIT LINE (Connecting data & methods together inside) */}
            <AnimatePresence>
              {phase !== 'exposed' && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute w-36 h-1 bg-gradient-to-r from-purple-400 via-white to-cyan-400 z-20 pointer-events-none rounded-full shadow-[0_0_12px_#FFFFFF]"
                />
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* ── 5. FINAL EDUCATIONAL SUMMARY MESSAGE ── */}
        <AnimatePresence>
          {phase === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-3 text-center max-w-xl px-4 z-30"
            >
              <h2 className="text-base sm:text-lg font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-cyan-400 tracking-wider">
                ENCAPSULATION PRINCIPLE
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans leading-relaxed">
                <span className="text-purple-300 font-bold">Bundle</span> data and methods together &bull;{' '}
                <span className="text-rose-300 font-bold">Protect</span> internal data &bull;{' '}
                <span className="text-cyan-300 font-bold">Allow controlled access</span> via public methods.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── 6. MINIMAL, NON-INTRUSIVE BOTTOM CONTROLS DOCK ── */}
      <footer className={`relative z-30 w-full px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 border-t backdrop-blur-xl shrink-0 transition-colors duration-300 ${
        isDark 
          ? 'border-white/10 bg-[#080C16]/90 text-white' 
          : isWarm 
          ? 'border-[#EBE0D3] bg-[#FDFBF7]/95 text-[#2D1F23]' 
          : 'border-slate-200 bg-white/95 text-slate-800 shadow-xl'
      }`}>
        
        {/* Left: Replay & Interactive Trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReplay}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10' 
                : isWarm 
                ? 'bg-[#EBE0D3]/50 hover:bg-[#EBE0D3] text-[#2D1F23] border-[#D9CAB9]' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
          >
            <RotateCcw size={13} className="text-cyan-400" />
            <span>Replay Animation</span>
          </button>

          <button
            onClick={handleTriggerManualRequest}
            disabled={isManualRequestRunning || phase === 'exposed'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-md cursor-pointer"
          >
            <Zap size={13} className="text-cyan-400" />
            <span>Send getData() Request</span>
          </button>
        </div>

        {/* Center: Live Timeline Step Pills */}
        <div className="hidden lg:flex items-center gap-1 font-mono text-[10px]">
          {[
            { id: 'exposed', label: '1. Exposed' },
            { id: 'bundling', label: '2. Bundle' },
            { id: 'sealed', label: '3. Protected' },
            { id: 'requesting', label: '4. Controlled Access' },
            { id: 'completed', label: '5. Complete' },
          ].map(st => {
            const isActive = phase === st.id || (st.id === 'requesting' && phase === 'responding');
            return (
              <button
                key={st.id}
                onClick={() => {
                  clearAllTimeouts();
                  setPhase(st.id);
                }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm' 
                    : isDark 
                    ? 'text-slate-400 opacity-60 hover:opacity-100 hover:bg-white/5' 
                    : 'text-slate-500 opacity-60 hover:opacity-100 hover:bg-black/5'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Right: Next OOP Concept Navigation */}
        <div className="flex items-center gap-3">
          {onNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>Next: Abstraction</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}
