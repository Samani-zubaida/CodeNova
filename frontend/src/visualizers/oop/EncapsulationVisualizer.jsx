import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, RotateCcw, ArrowRight, Zap, Ban, CheckCircle2, Code2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { ENCAPSULATION_PHASES, JAVA_ENCAPSULATION_CODE } from './data/encapsulationData';
import OopStudioWorkspace from './components/common/OopStudioWorkspace';

export default function EncapsulationVisualizer({ isEmbedded = false, onNext, onReturnToCatalog }) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Animation Phases: 'exposed' -> 'bundling' -> 'sealed' -> 'requesting' -> 'responding' -> 'completed'
  const [phase, setPhase] = useState('exposed');
  const [requestCount, setRequestCount] = useState(0);
  const [isManualRequestRunning, setIsManualRequestRunning] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
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
    <OopStudioWorkspace
      conceptName="Encapsulation"
      conceptSubtitle="OOP PILLAR • DATA HIDING"
      conceptDesc="Encapsulation bundles data and methods into a single unit while controlling access via public methods."
      conceptIcon={Lock}
      conceptAccent="#F43F5E"
      phases={[
        ENCAPSULATION_PHASES.exposed,
        ENCAPSULATION_PHASES.bundling,
        ENCAPSULATION_PHASES.sealed,
        ENCAPSULATION_PHASES.requesting,
        ENCAPSULATION_PHASES.completed,
      ]}
      activePhaseId={phase === 'responding' ? 'requesting' : phase}
      onSelectPhase={(phaseId) => {
        clearAllTimeouts();
        setPhase(phaseId);
      }}
      onReplay={handleReplay}
      primaryAction={{
        label: 'Send getData() Request',
        disabled: isManualRequestRunning || phase === 'exposed',
        onClick: handleTriggerManualRequest,
        icon: <Zap size={13} className="text-cyan-400" />
      }}
      isCodeOpen={isCodeOpen}
      onToggleCode={() => setIsCodeOpen(prev => !prev)}
      codeFilename="BankAccount.java"
      rawCode={JAVA_ENCAPSULATION_CODE}
      activeLineNumbers={
        phase === 'exposed' ? [4] :
          phase === 'bundling' ? [8, 9, 10, 11] :
            phase === 'sealed' ? [4, 5] :
              phase === 'requesting' ? [14] :
                phase === 'responding' ? [15] :
                  [2]
      }
      nextConcept={{
        label: "Next: Abstraction",
        onNext: onNext
      }}
    >
      <div className="relative w-full max-w-3xl flex-1 min-h-[300px] flex items-center justify-center">

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
                  y: phase === 'exposed' ? [-40, -55, -40] : [-6, 6, -6],
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
                  y: phase === 'exposed' ? [40, 55, 40] : [6, -6, 6],
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
    </OopStudioWorkspace>
  );
}

