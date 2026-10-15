import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, ArrowRight, ArrowDown, Sparkles, 
  CheckCircle2, Info, Code2, Zap, Layers, ShieldCheck, Box,
  User, Briefcase, Award, GitFork
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { 
  PERSON_CLASS, EMPLOYEE_CLASS, MANAGER_CLASS,
  MULTILEVEL_TIMELINE_STEPS, MEMBER_ORIGIN_REGISTRY 
} from './data/multilevelInheritanceData';
import { PersonIllustration } from './multilevelInheritance/PersonIllustration';
import { EmployeeIllustration } from './multilevelInheritance/EmployeeIllustration';
import { ManagerIllustration } from './multilevelInheritance/ManagerIllustration';
import { MultilevelConduit } from './multilevelInheritance/MultilevelConduit';
import { MultilevelCodeDrawer } from './multilevelInheritance/MultilevelCodeDrawer';
import { MultilevelClassDetailModal } from './multilevelInheritance/MultilevelClassDetailModal';
import { MultilevelInteractiveMap } from './multilevelInheritance/MultilevelInteractiveMap';

export default function MultilevelInheritanceVisualizer({
  isEmbedded = false,
  onNext,
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // ── TIMELINE STATE ──
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 1.5x, 2x
  const [hoveredMember, setHoveredMember] = useState(null);
  const [transferringMember, setTransferringMember] = useState(null);
  const [receivedPersonMembers, setReceivedPersonMembers] = useState([]);
  const [receivedEmployeeMembers, setReceivedEmployeeMembers] = useState([]);
  const [receivedDeepChainMembers, setReceivedDeepChainMembers] = useState([]);

  // Modals
  const [codeDrawerOpen, setCodeDrawerOpen] = useState(false);
  const [activeCodeClass, setActiveCodeClass] = useState('all');
  const [inspectingClassId, setInspectingClassId] = useState(null);

  const currentStep = MULTILEVEL_TIMELINE_STEPS[currentStepIndex] || MULTILEVEL_TIMELINE_STEPS[0];
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Trait Transfer Sequences
  const runPersonToEmployeeTransfer = async () => {
    const members = [...EMPLOYEE_CLASS.inheritedFromPerson];
    setReceivedPersonMembers([]);

    for (let i = 0; i < members.length; i++) {
      const mem = members[i];
      setTransferringMember(mem);
      await new Promise(r => setTimeout(r, 1000 / playbackSpeed));
      setReceivedPersonMembers(prev => [...prev, mem.id]);
      setTransferringMember(null);
      await new Promise(r => setTimeout(r, 300 / playbackSpeed));
    }
  };

  const runEmployeeToManagerTransfer = async () => {
    const members = [...MANAGER_CLASS.inheritedFromEmployee];
    setReceivedEmployeeMembers([]);

    for (let i = 0; i < members.length; i++) {
      const mem = members[i];
      setTransferringMember(mem);
      await new Promise(r => setTimeout(r, 1000 / playbackSpeed));
      setReceivedEmployeeMembers(prev => [...prev, mem.id]);
      setTransferringMember(null);
      await new Promise(r => setTimeout(r, 300 / playbackSpeed));
    }
  };

  const runDeepChainTransfer = async () => {
    const members = [...MANAGER_CLASS.inheritedThroughEmployeeFromPerson];
    setReceivedDeepChainMembers([]);

    for (let i = 0; i < members.length; i++) {
      const mem = members[i];
      setTransferringMember(mem);
      await new Promise(r => setTimeout(r, 1200 / playbackSpeed));
      setReceivedDeepChainMembers(prev => [...prev, mem.id]);
      setTransferringMember(null);
      await new Promise(r => setTimeout(r, 300 / playbackSpeed));
    }
  };

  // Timeline Step Advancement
  const advanceStep = (targetIndex) => {
    clearTimer();
    const nextIdx = targetIndex !== undefined ? targetIndex : (currentStepIndex + 1);

    if (nextIdx >= MULTILEVEL_TIMELINE_STEPS.length) {
      setIsPlaying(false);
      return;
    }

    setCurrentStepIndex(nextIdx);

    // Fast-forward or trigger animations based on target step
    if (MULTILEVEL_TIMELINE_STEPS[nextIdx].id === 'employee_traits') {
      runPersonToEmployeeTransfer();
    } else if (MULTILEVEL_TIMELINE_STEPS[nextIdx].id === 'manager_traits') {
      runEmployeeToManagerTransfer();
    } else if (MULTILEVEL_TIMELINE_STEPS[nextIdx].id === 'deep_chain_transfer') {
      runDeepChainTransfer();
    } else if (nextIdx >= 7) {
      // Completed state: all inherited lists settled
      setReceivedPersonMembers(EMPLOYEE_CLASS.inheritedFromPerson.map(m => m.id));
      setReceivedEmployeeMembers(MANAGER_CLASS.inheritedFromEmployee.map(m => m.id));
      setReceivedDeepChainMembers(MANAGER_CLASS.inheritedThroughEmployeeFromPerson.map(m => m.id));
      setTransferringMember(null);
    } else if (nextIdx >= 4) {
      setReceivedPersonMembers(EMPLOYEE_CLASS.inheritedFromPerson.map(m => m.id));
      setTransferringMember(null);
    } else {
      setReceivedPersonMembers([]);
      setReceivedEmployeeMembers([]);
      setReceivedDeepChainMembers([]);
      setTransferringMember(null);
    }
  };

  // Auto-play timeline ticker
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    let stepDuration = 3500 / playbackSpeed;
    if (currentStep.id === 'employee_traits') {
      stepDuration = 5200 / playbackSpeed;
      runPersonToEmployeeTransfer();
    } else if (currentStep.id === 'manager_traits') {
      stepDuration = 5200 / playbackSpeed;
      runEmployeeToManagerTransfer();
    } else if (currentStep.id === 'deep_chain_transfer') {
      stepDuration = 6000 / playbackSpeed;
      runDeepChainTransfer();
    }

    timerRef.current = setTimeout(() => {
      if (currentStepIndex < MULTILEVEL_TIMELINE_STEPS.length - 1) {
        advanceStep(currentStepIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, stepDuration);

    return () => clearTimer();
  }, [isPlaying, currentStepIndex, playbackSpeed]);

  const handleReplay = () => {
    clearTimer();
    setReceivedPersonMembers([]);
    setReceivedEmployeeMembers([]);
    setReceivedDeepChainMembers([]);
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

  const handleOpenCodeDrawer = (classTab = 'all') => {
    setActiveCodeClass(classTab);
    setCodeDrawerOpen(true);
  };

  // Active highlights
  const isEmployeeVisible = currentStepIndex >= 1;
  const isConduit1Active = currentStepIndex >= 1;
  const isManagerVisible = currentStepIndex >= 4;
  const isConduit2Active = currentStepIndex >= 4;
  const isDeepChainActive = currentStepIndex >= 6;

  // Active highlight key for code highlighting
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
      
      {/* ── 1. ATMOSPHERIC AURORA BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[5%] left-1/4 w-[500px] h-[300px] bg-gradient-to-tr from-sky-600/15 via-blue-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[40%] right-1/4 w-[500px] h-[300px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-1/3 w-[500px] h-[300px] bg-gradient-to-tr from-purple-600/15 via-pink-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf806_1px,transparent_1px),linear-gradient(to_bottom,#38bdf806_1px,transparent_1px)] bg-[size:44px_44px] opacity-60" />
      </div>

      {/* ── 2. TOP EDUCATIONAL STATUS RIBBON ── */}
      <div className="relative z-20 w-full max-w-7xl px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Left: Concept Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono shadow-sm">
            <Layers size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-sm sm:text-base font-black tracking-wider uppercase">
                Multilevel Inheritance
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                Person → Employee → Manager
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              One class inherits from another class, forming a chain of inheritance.
            </p>
          </div>
        </div>

        {/* Right: Live Step Pill & Show Code Button */}
        <div className="flex items-center gap-2.5">
          <div className={`px-3 py-1.5 rounded-xl border backdrop-blur-md font-mono text-xs font-bold flex items-center gap-2 ${
            isDark ? 'bg-slate-900/80 border-white/10 text-cyan-300' : 'bg-white border-slate-200 text-blue-700 shadow-md'
          }`}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-400">{currentStep.stepNumber}/8:</span>
            <span>{currentStep.title}</span>
          </div>

          <button
            onClick={() => handleOpenCodeDrawer('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer shadow-md ${
              isDark
                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-700'
            }`}
          >
            <Code2 size={14} />
            <span>Show Code</span>
          </button>
        </div>
      </div>

      {/* ── 3. MAIN CINEMATIC WORKSPACE (VERTICAL 3-TIER CANVAS) ── */}
      <div className="relative z-20 w-full max-w-4xl px-4 sm:px-6 py-4 flex-1 flex flex-col items-center my-auto space-y-2">
        
        {/* ══════════════════════════════════════════════════
            LEVEL 1: BASE CLASS — PERSON
            ══════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setInspectingClassId('person')}
          className={`w-full max-w-lg p-3 sm:p-4 rounded-3xl border ${cardBgClass} relative group transition-all duration-300 cursor-pointer ${
            currentStep.activeClassId === 'person' ? 'ring-2 ring-sky-500/50 shadow-[0_0_30px_rgba(56,189,248,0.2)]' : ''
          }`}
          title="Click to inspect Person class details"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                <User size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-black text-sky-400">class Person</span>
                  <span className="px-2 py-0.2 rounded-full text-[8.5px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    BASE CLASS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Root biological entity
                </span>
              </div>
            </div>

            <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
              Level 1
            </span>
          </div>

          {/* Body: 2.5D Illustration + Members */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-3">
            <div className="sm:col-span-5 flex justify-center">
              <PersonIllustration isActive={currentStepIndex === 0} highlightedMember={hoveredMember} />
            </div>

            <div className="sm:col-span-7 space-y-2">
              {/* Defined In Person Tag */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={`font-bold ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>DEFINED IN PERSON:</span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}>Original Traits</span>
              </div>

              {/* Members List */}
              <div className="grid grid-cols-1 gap-1.5">
                {PERSON_CLASS.properties.map(prop => (
                  <MemberCard
                    key={prop.id}
                    id={`person-${prop.id}`}
                    member={prop}
                    isHovered={hoveredMember?.id === prop.id}
                    isTransferring={transferringMember?.id === prop.id}
                    onHover={() => setHoveredMember(prop)}
                    onLeave={() => setHoveredMember(null)}
                    isDark={isDark}
                    accentColor="#38BDF8"
                  />
                ))}

                {PERSON_CLASS.methods.map(method => (
                  <MemberCard
                    key={method.id}
                    id={`person-${method.id}`}
                    member={method}
                    isHovered={hoveredMember?.id === method.id}
                    isTransferring={transferringMember?.id === method.id}
                    onHover={() => setHoveredMember(method)}
                    onLeave={() => setHoveredMember(null)}
                    isDark={isDark}
                    accentColor="#38BDF8"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════
            CONDUIT 1: PERSON -> EMPLOYEE
            ══════════════════════════════════════════════════ */}
        <MultilevelConduit
          level={1}
          isActive={isConduit1Active}
          isDeepPassing={isDeepChainActive}
          transferringMember={currentStepIndex <= 3 || isDeepChainActive ? transferringMember : null}
          currentPhase={currentStep.id}
        />

        {/* ══════════════════════════════════════════════════
            LEVEL 2: INTERMEDIATE SUBCLASS — EMPLOYEE
            ══════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isEmployeeVisible && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.55 }}
              onClick={() => setInspectingClassId('employee')}
              className={`w-full max-w-lg p-3 sm:p-4 rounded-3xl border ${cardBgClass} relative group transition-all duration-300 cursor-pointer ${
                currentStep.activeClassId === 'employee' ? 'ring-2 ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : ''
              }`}
              title="Click to inspect Employee class details"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs sm:text-sm font-black ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>class Employee</span>
                      <span className={`font-mono text-[11px] font-extrabold px-2 py-0.2 rounded border ${
                        isDark ? 'text-sky-400 bg-sky-500/10 border-sky-500/30' : 'text-sky-800 bg-sky-100 border-sky-300'
                      }`}>
                        extends Person
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[8.5px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        INTERMEDIATE
                      </span>
                    </div>
                    <span className={`text-[10px] block font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Workforce specialization
                    </span>
                  </div>
                </div>

                <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                  Level 2
                </span>
              </div>

              {/* Body: 2.5D Illustration + Dual Member Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-3">
                <div className="sm:col-span-5 flex justify-center">
                  <EmployeeIllustration isActive={currentStep.activeClassId === 'employee'} highlightedMember={hoveredMember} />
                </div>

                <div className="sm:col-span-7 space-y-2.5">
                  {/* INHERITED FROM PERSON */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={`font-bold flex items-center gap-1 ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>
                        <ArrowDown size={10} /> INHERITED FROM PERSON:
                      </span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Via extends</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      {EMPLOYEE_CLASS.inheritedFromPerson.map(mem => {
                        const isSettled = receivedPersonMembers.includes(mem.id) || currentStepIndex >= 4;
                        return (
                          <div
                            key={mem.id}
                            onMouseEnter={() => setHoveredMember(mem)}
                            onMouseLeave={() => setHoveredMember(null)}
                            className={`p-1.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                              isSettled 
                                ? (isDark ? 'bg-sky-500/10 border-sky-500/30 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-950')
                                : 'opacity-30 border-dashed border-slate-500'
                            }`}
                          >
                            <span className="font-bold text-[11px]">{mem.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100 text-sky-800 border border-sky-300'
                            }`}>
                              Origin: Person
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* OWN MEMBERS */}
                  {currentStepIndex >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>OWN MEMBERS:</span>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Specialized</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1">
                        {EMPLOYEE_CLASS.ownProperties.map(p => (
                          <MemberCard
                            key={p.id}
                            id={`emp-${p.id}`}
                            member={p}
                            isHovered={hoveredMember?.id === p.id}
                            isTransferring={transferringMember?.id === p.id}
                            onHover={() => setHoveredMember(p)}
                            onLeave={() => setHoveredMember(null)}
                            isDark={isDark}
                            accentColor="#818CF8"
                          />
                        ))}
                        {EMPLOYEE_CLASS.ownMethods.map(m => (
                          <MemberCard
                            key={m.id}
                            id={`emp-${m.id}`}
                            member={m}
                            isHovered={hoveredMember?.id === m.id}
                            isTransferring={transferringMember?.id === m.id}
                            onHover={() => setHoveredMember(m)}
                            onLeave={() => setHoveredMember(null)}
                            isDark={isDark}
                            accentColor="#818CF8"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════
            CONDUIT 2: EMPLOYEE -> MANAGER
            ══════════════════════════════════════════════════ */}
        {isManagerVisible && (
          <MultilevelConduit
            level={2}
            isActive={isConduit2Active}
            isDeepPassing={isDeepChainActive}
            transferringMember={currentStepIndex >= 5 ? transferringMember : null}
            currentPhase={currentStep.id}
          />
        )}

        {/* ══════════════════════════════════════════════════
            LEVEL 3: FINAL SUBCLASS — MANAGER
            ══════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isManagerVisible && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              onClick={() => setInspectingClassId('manager')}
              className={`w-full max-w-lg p-3 sm:p-4 rounded-3xl border ${cardBgClass} relative group transition-all duration-300 cursor-pointer ${
                currentStep.activeClassId === 'manager' ? 'ring-2 ring-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : ''
              }`}
              title="Click to inspect Manager class details"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <Award size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs sm:text-sm font-black ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>class Manager</span>
                      <span className={`font-mono text-[11px] font-extrabold px-2 py-0.2 rounded border ${
                        isDark ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' : 'text-indigo-800 bg-indigo-100 border-indigo-300'
                      }`}>
                        extends Employee
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[8.5px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        FINAL CHILD
                      </span>
                    </div>
                    <span className={`text-[10px] block font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Executive leadership entity
                    </span>
                  </div>
                </div>

                <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                  Level 3
                </span>
              </div>

              {/* Body: 2.5D Illustration + 3 Distinct Origin Breakdown Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-3">
                <div className="sm:col-span-5 flex justify-center">
                  <ManagerIllustration isActive={currentStep.activeClassId === 'manager'} highlightedMember={hoveredMember} />
                </div>

                <div className="sm:col-span-7 space-y-2.5">
                  {/* BREAKDOWN SECTION 1: INHERITED FROM PERSON THROUGH EMPLOYEE */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={`font-bold flex items-center gap-1 ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>
                        <ArrowDown size={10} /> VIA PERSON (2 LEVELS):
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        isDark ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}>
                        Through Employee
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      {MANAGER_CLASS.inheritedThroughEmployeeFromPerson.map(mem => {
                        const isSettled = receivedDeepChainMembers.includes(mem.id) || currentStepIndex >= 7;
                        return (
                          <div
                            key={mem.id}
                            onMouseEnter={() => setHoveredMember(mem)}
                            onMouseLeave={() => setHoveredMember(null)}
                            className={`p-1.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                              isSettled 
                                ? (isDark ? 'bg-sky-500/10 border-sky-500/30 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-950')
                                : 'opacity-30 border-dashed border-slate-500'
                            }`}
                          >
                            <span className="font-bold text-[11px]">{mem.name}</span>
                            <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                              isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100 text-sky-800 border border-sky-300'
                            }`}>
                              Origin: Person
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* BREAKDOWN SECTION 2: INHERITED FROM EMPLOYEE */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={`font-bold flex items-center gap-1 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                        <ArrowDown size={10} /> VIA EMPLOYEE (1 LEVEL):
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        Direct Parent
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      {MANAGER_CLASS.inheritedFromEmployee.map(mem => {
                        const isSettled = receivedEmployeeMembers.includes(mem.id) || currentStepIndex >= 6;
                        return (
                          <div
                            key={mem.id}
                            onMouseEnter={() => setHoveredMember(mem)}
                            onMouseLeave={() => setHoveredMember(null)}
                            className={`p-1.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                              isSettled 
                                ? (isDark ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-950')
                                : 'opacity-30 border-dashed border-slate-500'
                            }`}
                          >
                            <span className="font-bold text-[11px]">{mem.name}</span>
                            <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                              isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            }`}>
                              Origin: Employee
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* BREAKDOWN SECTION 3: OWN MEMBERS */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>OWN MEMBERS:</span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Manager Specialization</span>
                    </div>

                    <div className="grid grid-cols-1 gap-1">
                      {MANAGER_CLASS.ownProperties.map(p => (
                        <MemberCard
                          key={p.id}
                          id={`mgr-${p.id}`}
                          member={p}
                          isHovered={hoveredMember?.id === p.id}
                          isTransferring={transferringMember?.id === p.id}
                          onHover={() => setHoveredMember(p)}
                          onLeave={() => setHoveredMember(null)}
                          isDark={isDark}
                          accentColor="#C084FC"
                        />
                      ))}
                      {MANAGER_CLASS.ownMethods.map(m => (
                        <MemberCard
                          key={m.id}
                          id={`mgr-${m.id}`}
                          member={m}
                          isHovered={hoveredMember?.id === m.id}
                          isTransferring={transferringMember?.id === m.id}
                          onHover={() => setHoveredMember(m)}
                          onLeave={() => setHoveredMember(null)}
                          isDark={isDark}
                          accentColor="#C084FC"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 4. FLOATING BOTTOM CONTROLS & TIMELINE DOCK ── */}
      <div className={`sticky bottom-0 z-30 w-full backdrop-blur-xl border-t transition-colors duration-300 ${footerClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Playback Transport Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500'
              }`}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play Timeline'}</span>
            </button>

            <button
              onClick={handleReplay}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 shadow-xs'
              }`}
              title="Reset to Step 1"
            >
              <RotateCcw size={14} />
            </button>

            {/* Speed Selector */}
            <div className={`flex items-center p-0.5 rounded-lg border text-[11px] font-mono ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}>
              {[1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded transition-all cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-purple-600 text-white font-bold'
                      : 'hover:text-purple-400'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Step Pills */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
            {MULTILEVEL_TIMELINE_STEPS.map((step, idx) => {
              const isCurrent = currentStepIndex === idx;
              const isPassed = currentStepIndex > idx;
              return (
                <button
                  key={step.id}
                  onClick={() => handleSelectStep(idx)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg font-mono text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    isCurrent
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md scale-105'
                      : isPassed
                      ? isDark
                        ? 'bg-white/5 text-purple-300 border-purple-500/30'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                      : isDark
                      ? 'text-slate-500 border-transparent hover:text-slate-300'
                      : 'text-slate-400 border-transparent hover:text-slate-700'
                  }`}
                >
                  <span>{step.stepNumber}. {step.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Next Route Button */}
          {onNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-sky-500 text-white hover:bg-sky-400 transition-all cursor-pointer shadow-md"
            >
              <span>Next Concept</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── 5. EDUCATIONAL SECTION & INTERACTIVE MAP (BELOW CANVAS) ── */}
      <MultilevelInteractiveMap
        activeHoveredMember={hoveredMember}
        onHoverMember={setHoveredMember}
      />

      {/* ── 6. MODALS & DRAWERS ── */}
      <MultilevelCodeDrawer
        isOpen={codeDrawerOpen}
        onClose={() => setCodeDrawerOpen(false)}
        activeHighlightKey={activeHighlightKey}
        activeClassTab={activeCodeClass}
      />

      <MultilevelClassDetailModal
        classId={inspectingClassId}
        onClose={() => setInspectingClassId(null)}
      />
    </div>
  );
}

/**
 * MemberCard - Reusable Member Item Component for Class Cards
 */
const MemberCard = ({
  id,
  member,
  isHovered = false,
  isTransferring = false,
  onHover,
  onLeave,
  isDark = true,
  accentColor = '#38BDF8',
}) => {
  const textColor = isDark 
    ? (isHovered ? accentColor : '#E2E8F0')
    : (isHovered 
        ? (accentColor === '#38BDF8' ? '#0369A1' : accentColor === '#818CF8' ? '#4338CA' : '#7E22CE') 
        : '#0F172A');

  const badgeBg = isDark 
    ? `${accentColor}15` 
    : (accentColor === '#38BDF8' ? '#E0F2FE' : accentColor === '#818CF8' ? '#EEF2FF' : '#FAF5FF');

  const badgeTextColor = isDark 
    ? accentColor 
    : (accentColor === '#38BDF8' ? '#0369A1' : accentColor === '#818CF8' ? '#4338CA' : '#7E22CE');

  const badgeBorder = isDark 
    ? `${accentColor}30` 
    : (accentColor === '#38BDF8' ? '#BAE6FD' : accentColor === '#818CF8' ? '#C7D2FE' : '#E9D5FF');

  return (
    <div
      id={id}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`p-1.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
        isHovered
          ? 'scale-102 ring-2 shadow-lg'
          : isDark
          ? 'bg-white/[0.04] border-white/10 text-slate-200 hover:bg-white/[0.08]'
          : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100 shadow-xs'
      }`}
      style={{
        borderColor: isHovered ? (isDark ? accentColor : badgeTextColor) : undefined,
        boxShadow: isHovered ? `0 0 14px ${accentColor}40` : undefined,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-[11px]" style={{ color: textColor }}>
          {member.name}
        </span>
      </div>

      <span className="text-[9px] px-1.5 py-0.2 rounded font-black uppercase"
        style={{
          backgroundColor: badgeBg,
          color: badgeTextColor,
          border: `1px solid ${badgeBorder}`,
        }}
      >
        {member.dataType || member.returnType}
      </span>
    </div>
  );
};
