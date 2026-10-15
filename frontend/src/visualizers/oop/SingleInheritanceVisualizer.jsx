import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, ArrowRight, ArrowDown, Sparkles, 
  CheckCircle2, Info, Code2, Zap, Layers, ShieldCheck, Box, Car as CarIcon
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { 
  VEHICLE_CLASS, CAR_CLASS, TIMELINE_STEPS 
} from './data/singleInheritanceData';
import { VehicleIllustration } from './singleInheritance/VehicleIllustration';
import { CarIllustration } from './singleInheritance/CarIllustration';
import { SingleConduit } from './singleInheritance/SingleConduit';
import { SingleInheritanceCodePanel } from './singleInheritance/SingleInheritanceCodePanel';

export default function SingleInheritanceVisualizer({
  isEmbedded = false,
  onNext,
  onReturnToCatalog,
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // ── TIMELINE STATE ──
  // Step 1: 'intro' (Vehicle appears)
  // Step 2: 'car_enters' (Car appears with extends Vehicle)
  // Step 3: 'conduit_active' (Conduit line illuminates)
  // Step 4: 'transfer_traits' (color -> speed -> start -> stop transfer sequentially)
  // Step 5: 'own_specialization' (numberOfDoors & openTrunk appear)
  // Step 6: 'completed' (Full single inheritance verified)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [transferringMember, setTransferringMember] = useState(null);
  const [receivedInheritedMembers, setReceivedInheritedMembers] = useState([]);

  const currentStep = TIMELINE_STEPS[currentStepIndex] || TIMELINE_STEPS[0];
  const timerRef = useRef(null);

  // Clear running timers
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Step 4 transfer sequence: flows color, speed, start, stop one by one
  const runTransferSequence = async () => {
    const membersToTransfer = [...CAR_CLASS.inheritedMembers];
    setReceivedInheritedMembers([]);

    for (let i = 0; i < membersToTransfer.length; i++) {
      const mem = membersToTransfer[i];
      setTransferringMember(mem);
      await new Promise(r => setTimeout(r, 1400));
      setReceivedInheritedMembers(prev => [...prev, mem.id]);
      setTransferringMember(null);
      await new Promise(r => setTimeout(r, 400));
    }
  };

  // Timeline Step Advancement
  const advanceStep = (targetIndex) => {
    clearTimer();
    const nextIdx = targetIndex !== undefined ? targetIndex : (currentStepIndex + 1);

    if (nextIdx >= TIMELINE_STEPS.length) {
      setIsPlaying(false);
      return;
    }

    setCurrentStepIndex(nextIdx);

    // If jumping to transfer step
    if (TIMELINE_STEPS[nextIdx].id === 'transfer_traits') {
      runTransferSequence();
    } else if (nextIdx >= 4) {
      // All inherited members have settled
      setReceivedInheritedMembers(CAR_CLASS.inheritedMembers.map(m => m.id));
      setTransferringMember(null);
    } else {
      setReceivedInheritedMembers([]);
      setTransferringMember(null);
    }
  };

  // Auto-play timeline ticker
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    // Step durations: step 4 needs extra time for the 4 member transfers
    const stepDuration = currentStep.id === 'transfer_traits' ? 8000 : 3800;

    if (currentStep.id === 'transfer_traits') {
      runTransferSequence();
    }

    timerRef.current = setTimeout(() => {
      if (currentStepIndex < TIMELINE_STEPS.length - 1) {
        advanceStep(currentStepIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, stepDuration);

    return () => clearTimer();
  }, [isPlaying, currentStepIndex]);

  const handleReplay = () => {
    clearTimer();
    setReceivedInheritedMembers([]);
    setTransferringMember(null);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleSelectStep = (idx) => {
    advanceStep(idx);
    setIsPlaying(false);
  };

  // Active highlights
  const isConduitActive = currentStepIndex >= 2;
  const isCarVisible = currentStepIndex >= 1;
  const isOwnMembersVisible = currentStepIndex >= 4;

  // Active code highlight key
  const activeHighlightKey = hoveredMember 
    ? hoveredMember.id 
    : transferringMember 
    ? transferringMember.id 
    : currentStep.activeHighlight;

  // Container & card theme styles
  const containerBg = isDark
    ? 'bg-[#080C16] text-slate-100'
    : isWarm
    ? 'bg-[#FDFBF7] text-[#2D1F23]'
    : 'bg-[#F8FAFC] text-slate-900';

  const cardBgClass = isDark
    ? 'bg-[#090D17]/90 border-white/10 text-slate-200 shadow-2xl'
    : isWarm
    ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] text-[#2D1F23] shadow-lg'
    : 'bg-white/95 border-slate-200 text-slate-800 shadow-xl';

  const footerClass = isDark
    ? 'bg-[#080C16]/95 border-white/10 text-white'
    : isWarm
    ? 'bg-[#FDFBF7]/95 border-[#EBE0D3] text-[#2D1F23]'
    : 'bg-white/95 border-slate-200 text-slate-800 shadow-xl';

  return (
    <div className={`relative w-full min-h-full flex flex-col items-center justify-between select-none ${containerBg} font-sans transition-colors duration-300`}>
      
      {/* ── 1. ATMOSPHERIC COSMIC NEBULA BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Radial Glow for Vehicle */}
        <div className="absolute top-[5%] left-1/3 w-[600px] h-[320px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        {/* Bottom Radial Glow for Car */}
        <div className="absolute bottom-[10%] left-1/3 w-[600px] h-[320px] bg-gradient-to-tr from-purple-600/15 via-violet-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        {/* Futuristic Coordinate Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf806_1px,transparent_1px),linear-gradient(to_bottom,#38bdf806_1px,transparent_1px)] bg-[size:44px_44px] opacity-60" />
      </div>

      {/* ── 2. TOP EDUCATIONAL STATUS RIBBON ── */}
      <div className="relative z-20 w-full max-w-7xl px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Left: Concept Title & Definition */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono shadow-sm">
            <Zap size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-sm sm:text-base font-black tracking-wider uppercase">
                Single Inheritance
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                1 Parent → 1 Child
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              One child class (<span className="text-purple-400 font-bold">Car</span>) inherits universal capabilities from exactly one parent class (<span className="text-cyan-400 font-bold">Vehicle</span>).
            </p>
          </div>
        </div>

        {/* Right: Live Step Pill */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-xl border backdrop-blur-md font-mono text-xs font-bold flex items-center gap-2 ${
            isDark ? 'bg-slate-900/80 border-white/10 text-cyan-300' : 'bg-white border-slate-200 text-blue-700 shadow-md'
          }`}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-400">{currentStep.stepNumber}/6:</span>
            <span>{currentStep.title}</span>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN CINEMATIC WORKSPACE (2-COLUMN RESPONSIVE GRID) ── */}
      <div className="relative z-20 w-full max-w-7xl px-4 sm:px-6 py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-auto">
        
        {/* ── LEFT COLUMN: 2.5D INTERACTIVE INHERITANCE SCENE (7 COLS) ── */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-2">
          
          {/* ══════════════════════════════════════════════════
              LEVEL 1: PARENT CLASS — VEHICLE
              ══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-full max-w-lg p-3 sm:p-4 rounded-3xl border ${cardBgClass} relative group transition-all duration-300 ${
              currentStepIndex === 0 ? 'ring-2 ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : ''
            }`}
          >
            {/* Header: Badge & Role */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Box size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-black text-cyan-400">class Vehicle</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      PARENT CLASS
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Universal vehicular foundation
                  </span>
                </div>
              </div>

              <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                1 Parent
              </span>
            </div>

            {/* Illustration & Floating Members Split */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {/* 2.5D Futuristic Vehicle Illustration */}
              <VehicleIllustration
                isActive={currentStepIndex === 0}
                isDimmed={false}
              />

              {/* Members Capsule Grid */}
              <div className="w-full sm:w-auto flex-1 flex flex-col gap-1.5">
                <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Defined Members (to be inherited):
                </span>

                <div className="grid grid-cols-2 gap-1.5">
                  {/* Property: color */}
                  <MemberCard
                    id="member-vehicle-color"
                    member={VEHICLE_CLASS.properties[0]}
                    isHovered={hoveredMember?.id === 'color'}
                    isTransferring={transferringMember?.id === 'color'}
                    onHover={() => setHoveredMember(VEHICLE_CLASS.properties[0])}
                    onLeave={() => setHoveredMember(null)}
                    isDark={isDark}
                  />

                  {/* Property: speed */}
                  <MemberCard
                    id="member-vehicle-speed"
                    member={VEHICLE_CLASS.properties[1]}
                    isHovered={hoveredMember?.id === 'speed'}
                    isTransferring={transferringMember?.id === 'speed'}
                    onHover={() => setHoveredMember(VEHICLE_CLASS.properties[1])}
                    onLeave={() => setHoveredMember(null)}
                    isDark={isDark}
                  />

                  {/* Method: start() */}
                  <MemberCard
                    id="member-vehicle-start"
                    member={VEHICLE_CLASS.methods[0]}
                    isHovered={hoveredMember?.id === 'start'}
                    isTransferring={transferringMember?.id === 'start'}
                    onHover={() => setHoveredMember(VEHICLE_CLASS.methods[0])}
                    onLeave={() => setHoveredMember(null)}
                    isDark={isDark}
                  />

                  {/* Method: stop() */}
                  <MemberCard
                    id="member-vehicle-stop"
                    member={VEHICLE_CLASS.methods[1]}
                    isHovered={hoveredMember?.id === 'stop'}
                    isTransferring={transferringMember?.id === 'stop'}
                    onHover={() => setHoveredMember(VEHICLE_CLASS.methods[1])}
                    onLeave={() => setHoveredMember(null)}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════════════
              LEVEL 2: INHERITANCE CONDUIT (VEHICLE -> CAR)
              ══════════════════════════════════════════════════ */}
          <SingleConduit
            isActive={isConduitActive}
            transferringMember={transferringMember}
            currentPhase={currentStep.id}
          />

          {/* ══════════════════════════════════════════════════
              LEVEL 3: CHILD CLASS — CAR (EXTENDS VEHICLE)
              ══════════════════════════════════════════════════ */}
          <AnimatePresence>
            {isCarVisible && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className={`w-full max-w-lg p-3 sm:p-4 rounded-3xl border ${cardBgClass} relative group transition-all duration-300 ${
                  currentStepIndex >= 4 ? 'ring-2 ring-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : ''
                }`}
              >
                {/* Header: Class declaration with 'extends Vehicle' */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                      <CarIcon size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs sm:text-sm font-black text-purple-400">class Car</span>
                        <span className="font-mono text-[11px] font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.2 rounded border border-cyan-500/30">
                          extends Vehicle
                        </span>
                        <span className="px-2 py-0.2 rounded-full text-[8.5px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          CHILD CLASS
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Specialized passenger automobile
                      </span>
                    </div>
                  </div>

                  <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                    1 Child
                  </span>
                </div>

                {/* Car Graphic & Dual Member Compartments */}
                <div className="pt-2 space-y-2.5">
                  {/* 2.5D Car Illustration */}
                  <div className="flex justify-center">
                    <CarIllustration
                      isActive={currentStepIndex >= 4}
                      highlightDoors={hoveredMember?.id === 'numberOfDoors' || currentStepIndex === 4}
                      highlightTrunk={hoveredMember?.id === 'openTrunk' || currentStepIndex === 4}
                    />
                  </div>

                  {/* Section A: INHERITED MEMBERS FROM VEHICLE */}
                  <div className={`p-2.5 rounded-2xl border transition-all ${
                    isDark ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-cyan-50/60 border-cyan-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-extrabold text-cyan-400">
                        <ShieldCheck size={13} />
                        <span>INHERITED FROM VEHICLE</span>
                      </div>
                      <span className="text-[9px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.2 rounded-full font-bold">
                        Zero Code Duplication
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {CAR_CLASS.inheritedMembers.map((mem) => {
                        const hasReceived = receivedInheritedMembers.includes(mem.id);
                        return (
                          <InheritedBadge
                            key={mem.id}
                            id={`member-car-${mem.id}`}
                            member={mem}
                            isReceived={hasReceived}
                            isHovered={hoveredMember?.id === mem.id}
                            onHover={() => setHoveredMember(mem)}
                            onLeave={() => setHoveredMember(null)}
                            isDark={isDark}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Section B: CAR'S OWN SPECIALIZED MEMBERS */}
                  <AnimatePresence>
                    {isOwnMembersVisible && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className={`p-2.5 rounded-2xl border transition-all ${
                          isDark ? 'bg-purple-950/20 border-purple-500/30' : 'bg-purple-50/60 border-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-extrabold text-purple-400">
                            <Sparkles size={13} />
                            <span>CAR'S OWN MEMBERS (SPECIALIZATION)</span>
                          </div>
                          <span className="text-[9px] font-mono text-purple-400/80 bg-purple-500/10 px-2 py-0.2 rounded-full font-bold">
                            Unique To Car
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          {/* Property: numberOfDoors */}
                          <OwnMemberBadge
                            id="member-car-numberOfDoors"
                            member={CAR_CLASS.ownProperties[0]}
                            isHovered={hoveredMember?.id === 'numberOfDoors'}
                            onHover={() => setHoveredMember(CAR_CLASS.ownProperties[0])}
                            onLeave={() => setHoveredMember(null)}
                            isDark={isDark}
                          />

                          {/* Method: openTrunk() */}
                          <OwnMemberBadge
                            id="member-car-openTrunk"
                            member={CAR_CLASS.ownMethods[0]}
                            isHovered={hoveredMember?.id === 'openTrunk'}
                            onHover={() => setHoveredMember(CAR_CLASS.ownMethods[0])}
                            onLeave={() => setHoveredMember(null)}
                            isDark={isDark}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ── RIGHT COLUMN: SYNCHRONIZED CODE PANEL & MEMBER INSPECTOR (5 COLS) ── */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full">
          
          {/* Synchronized Java Architecture Code Panel */}
          <SingleInheritanceCodePanel
            activeMemberId={hoveredMember?.id || transferringMember?.id}
            activeHighlightKey={activeHighlightKey}
            activeStepNumber={currentStep.stepNumber}
          />

          {/* Interactive Member Telemetry Inspector Card */}
          <AnimatePresence mode="wait">
            {hoveredMember ? (
              <motion.div
                key={hoveredMember.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-2xl border backdrop-blur-xl shadow-xl font-mono text-xs flex flex-col gap-2 ${
                  isDark ? 'bg-[#090D17]/95 border-cyan-500/40 text-slate-200' : 'bg-white border-blue-400 text-slate-800 shadow-lg'
                }`}
              >
                <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <span className={`font-black flex items-center gap-1.5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                    <Info size={14} /> Member Telemetry
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    hoveredMember.status === 'Inherited' 
                      ? (isDark ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-cyan-100 text-cyan-800 border border-cyan-300')
                      : (isDark ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-purple-100 text-purple-800 border border-purple-300')
                  }`}>
                    {hoveredMember.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className={`block text-[9.5px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>Identifier:</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{hoveredMember.name}</span>
                  </div>
                  <div>
                    <span className={`block text-[9.5px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>Kind:</span>
                    <span className={`font-bold capitalize ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{hoveredMember.kind}</span>
                  </div>
                  <div>
                    <span className={`block text-[9.5px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>Origin Source:</span>
                    <span className={`font-bold ${isDark ? 'text-cyan-300' : 'text-blue-600'}`}>{hoveredMember.source} Class</span>
                  </div>
                  <div>
                    <span className={`block text-[9.5px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500 font-semibold'}`}>Data / Return:</span>
                    <span className={`font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{hoveredMember.dataType || hoveredMember.returnType}</span>
                  </div>
                </div>

                <p className={`text-[11px] font-sans leading-relaxed pt-1 border-t ${
                  isDark ? 'text-slate-300 border-white/10' : 'text-slate-600 border-slate-200'
                }`}>
                  {hoveredMember.description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="default-pedagogy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 rounded-2xl border backdrop-blur-xl shadow-lg flex flex-col gap-2 ${
                  isDark ? 'bg-[#090D17]/80 border-white/10 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-black text-amber-400">
                  <Info size={14} />
                  <span>Real-World Inheritance Insight</span>
                </div>
                <p className="text-xs leading-relaxed font-sans">
                  Hover over any attribute or method in <strong className="text-cyan-400">Vehicle</strong> or <strong className="text-purple-400">Car</strong> to inspect its origin, memory allocation, and synchronized Java syntax.
                </p>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 font-mono text-[10.5px] flex items-center justify-between">
                  <span className="text-slate-400">Relationship Rule:</span>
                  <span className="font-bold text-cyan-300">Car is-a Vehicle</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* ── 4. FINAL EDUCATIONAL TAKEAWAY MESSAGE ── */}
      <AnimatePresence>
        {currentStepIndex === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 mb-3 text-center max-w-2xl px-4 pointer-events-none"
          >
            <div className="font-mono text-xs tracking-wider uppercase font-black text-cyan-400 mb-1 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>SINGLE INHERITANCE VERIFIED</span>
            </div>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className="text-cyan-400">One parent class (Vehicle)</strong> transfers universal traits (<code className="text-cyan-300">color</code>, <code className="text-cyan-300">speed</code>, <code className="text-cyan-300">start()</code>, <code className="text-cyan-300">stop()</code>) to <strong className="text-purple-400">one child class (Car)</strong>. Car enhances the blueprint with its own specialization (<code className="text-purple-300">numberOfDoors</code>, <code className="text-purple-300">openTrunk()</code>).
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 5. PERSISTENT VIDEO-LIKE CONTROLS FOOTER DOCK ── */}
      <footer className={`sticky bottom-0 z-40 w-full px-4 sm:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 border-t backdrop-blur-xl shrink-0 shadow-2xl transition-colors duration-300 ${footerClass}`}>
        
        {/* Left: Play/Pause & Replay */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause Sequence' : 'Play Sequence'}</span>
          </button>

          <button
            onClick={handleReplay}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
              isDark ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
          >
            <RotateCcw size={13} className="text-cyan-400" />
            <span>Replay</span>
          </button>
        </div>

        {/* Center: Interactive 6-Step Timeline Scrubber Pills */}
        <div className="hidden md:flex items-center gap-1 font-mono text-[10px]">
          {TIMELINE_STEPS.map((st, idx) => {
            const isActive = currentStepIndex === idx;
            return (
              <button
                key={st.id}
                onClick={() => handleSelectStep(idx)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                    : isDark ? 'text-slate-400 opacity-60 hover:opacity-100 hover:bg-white/5' : 'text-slate-500 opacity-60 hover:opacity-100 hover:bg-black/5'
                }`}
              >
                {st.stepNumber}. {st.title.split(':')[0]}
              </button>
            );
          })}
        </div>

        {/* Right: Next OOP Concept Navigation */}
        <div className="flex items-center gap-3">
          {onNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Next: Polymorphism</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}

// ── MEMBER BADGE COMPONENT (VEHICLE PARENT) ──
function MemberCard({ id, member, isHovered, isTransferring, onHover, onLeave, isDark }) {
  return (
    <div
      id={id}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`p-2 rounded-xl border font-mono text-[10.5px] transition-all cursor-pointer flex items-center justify-between ${
        isTransferring
          ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 animate-pulse scale-105'
          : isHovered
          ? isDark
            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200 scale-102 shadow-sm'
            : 'bg-cyan-100 border-cyan-500 text-cyan-950 font-bold scale-102 shadow-sm'
          : isDark
          ? 'bg-slate-900/70 border-white/10 text-slate-300 hover:border-cyan-500/30'
          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>{member.kind === 'method' ? 'ƒ' : '•'}</span>
        <span className="font-bold">{member.name}</span>
      </div>
      <span className={`text-[9px] opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {member.dataType || member.returnType}
      </span>
    </div>
  );
}

// ── INHERITED BADGE COMPONENT (CAR CHILD) ──
function InheritedBadge({ id, member, isReceived, isHovered, onHover, onLeave, isDark }) {
  return (
    <div
      id={id}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`p-2 rounded-xl border font-mono text-[10.5px] transition-all cursor-pointer flex items-center justify-between ${
        !isReceived
          ? 'opacity-30 border-dashed border-slate-700'
          : isHovered
          ? isDark
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 scale-102 shadow-sm'
            : 'bg-cyan-100 border-cyan-500 text-cyan-950 font-bold scale-102 shadow-sm'
          : isDark
          ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
          : 'bg-cyan-100/60 border-cyan-300 text-cyan-900'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>✓</span>
        <span className="font-bold">{member.name}</span>
      </div>
      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
        isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-200/80 text-cyan-900'
      }`}>
        Inherited
      </span>
    </div>
  );
}

// ── OWN MEMBER BADGE COMPONENT (CAR SPECIALIZATION) ──
function OwnMemberBadge({ id, member, isHovered, onHover, onLeave, isDark }) {
  return (
    <div
      id={id}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`p-2 rounded-xl border font-mono text-[10.5px] transition-all cursor-pointer flex items-center justify-between ${
        isHovered
          ? isDark
            ? 'bg-purple-500/20 border-purple-400 text-purple-200 scale-102 shadow-sm'
            : 'bg-purple-100 border-purple-500 text-purple-950 font-bold scale-102 shadow-sm'
          : isDark
          ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
          : 'bg-purple-100/60 border-purple-300 text-purple-900'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>{member.kind === 'method' ? 'ƒ' : '★'}</span>
        <span className="font-bold">{member.name}</span>
      </div>
      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
        isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-200/80 text-purple-900'
      }`}>
        Own
      </span>
    </div>
  );
}
