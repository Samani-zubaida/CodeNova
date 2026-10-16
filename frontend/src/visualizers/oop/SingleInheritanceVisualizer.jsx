import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, ArrowRight, ArrowDown, Sparkles,
  CheckCircle2, Info, Code2, Zap, Layers, ShieldCheck, Box, Car as CarIcon
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import {
  VEHICLE_CLASS, CAR_CLASS, TIMELINE_STEPS, JAVA_CODE_LINES
} from './data/singleInheritanceData';
import { VehicleIllustration } from './singleInheritance/VehicleIllustration';
import { CarIllustration } from './singleInheritance/CarIllustration';
import { SingleConduit } from './singleInheritance/SingleConduit';
import OopStudioWorkspace from './components/common/OopStudioWorkspace';

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
  const [isCodeOpen, setIsCodeOpen] = useState(true);

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
    <OopStudioWorkspace
      conceptName="Single Inheritance"
      conceptSubtitle="INHERITANCE PATTERN 01/05"
      conceptDesc="One child class (Car) inherits universal capabilities from exactly one parent class (Vehicle)."
      conceptIcon={Zap}
      conceptAccent="#0EA5E9"
      phases={TIMELINE_STEPS}
      currentStepIndex={currentStepIndex}
      onSelectPhase={(_, idx) => handleSelectStep(idx)}
      isPlaying={isPlaying}
      onTogglePlay={handleTogglePlay}
      onReplay={handleReplay}
      isCodeOpen={isCodeOpen}
      onToggleCode={() => setIsCodeOpen(prev => !prev)}
      codeFilename="SingleInheritanceDemo.java"
      codeLines={JAVA_CODE_LINES}
      activeHighlightKey={activeHighlightKey}
      activeMemberId={hoveredMember?.id || transferringMember?.id}
      nextConcept={{
        label: "Next: Multilevel",
        onNext: onNext
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-3 w-full max-w-xl min-w-[280px]">
        {/* ══════════════════════════════════════════════════
            LEVEL 1: PARENT CLASS — VEHICLE
            ══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-xl p-3.5 sm:p-4 rounded-3xl border ${cardBgClass} relative group transition-all duration-300 ${currentStepIndex === 0 ? 'ring-2 ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : ''
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
              className={`w-full max-w-xl p-3.5 sm:p-4 rounded-3xl border ${cardBgClass} relative group transition-all duration-300 ${currentStepIndex >= 4 ? 'ring-2 ring-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : ''
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
                <div className={`p-2.5 rounded-2xl border transition-all ${isDark ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-cyan-50/60 border-cyan-200'
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
                      className={`p-2.5 rounded-2xl border transition-all ${isDark ? 'bg-purple-950/20 border-purple-500/30' : 'bg-purple-50/60 border-purple-200'
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
    </OopStudioWorkspace>
  );
}

// ── MEMBER BADGE COMPONENT (VEHICLE PARENT) ──
function MemberCard({ id, member, isHovered, isTransferring, onHover, onLeave, isDark }) {
  return (
    <div
      id={id}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`p-2 rounded-xl border font-mono text-[10.5px] transition-all cursor-pointer flex items-center justify-between ${isTransferring
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
      className={`p-2 rounded-xl border font-mono text-[10.5px] transition-all cursor-pointer flex items-center justify-between ${!isReceived
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
      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-200/80 text-cyan-900'
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
      className={`p-2 rounded-xl border font-mono text-[10.5px] transition-all cursor-pointer flex items-center justify-between ${isHovered
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
      <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-200/80 text-purple-900'
        }`}>
        Own
      </span>
    </div>
  );
}
