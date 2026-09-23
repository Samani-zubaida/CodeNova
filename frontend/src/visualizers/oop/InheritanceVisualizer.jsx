import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitFork, ArrowRight, RotateCcw, Sparkles, CheckCircle2,
  Code2, Shield, Play, Info, Zap, BookOpen
} from 'lucide-react';
import { ClassNodeCard } from './inheritance/ClassNodeCard';
import { CodeModal } from './inheritance/CodeModal';
import { InheritanceConduits } from './inheritance/InheritanceConduits';
import { INHERITANCE_CLASSES as CLASSES } from './data/inheritanceData';
import useAppStore from '../../store/useAppStore';

export default function InheritanceVisualizer({ isEmbedded = false, onNext, onReturnToCatalog }) {
  // Animation timeline state:
  // 'intro' -> 'delivering_traits' -> 'specialization' -> 'completed'
  const [phase, setPhase] = useState('intro');
  const [hoveredNode, setHoveredNode] = useState(null); // 'parent' | 'child1' | 'child2' | null
  const [selectedNode, setSelectedNode] = useState(null); // 'child1' | 'child2' | null
  const [activeCodeModalTab, setActiveCodeModalTab] = useState(null);
  const [highlightedMembers, setHighlightedMembers] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Educational step progression timeline
  const startTimeline = () => {
    clearAllTimeouts();
    setPhase('intro');
    setHighlightedMembers([]);
    setSelectedNode(null);

    // 0s - 3s: Phase 1: Base Class Person Definition
    // 3s - 8s: Phase 2: Trait Delivery Stream (particles travel to Child1 & Child2)
    const t1 = setTimeout(() => {
      setPhase('delivering_traits');
      setHighlightedMembers(['skinTone', 'wearsGlasses', 'hairColor', 'height']);
    }, 3000);

    // 8s - 13s: Phase 3: Children Specialization & Overrides
    const t2 = setTimeout(() => {
      setPhase('specialization');
      setHighlightedMembers(['hairColor', 'height', 'skinTone', 'eyeColor']);
    }, 8000);

    // 13s+: Phase 4: Full Hierarchical Tree Ready
    const t3 = setTimeout(() => {
      setPhase('completed');
    }, 13000);

    timeoutsRef.current = [t1, t2, t3];
  };

  useEffect(() => {
    startTimeline();
    return () => clearAllTimeouts();
  }, [requestCount]);

  const handleReplay = () => {
    setRequestCount(prev => prev + 1);
  };

  const handleManualTransmit = () => {
    clearAllTimeouts();
    setPhase('delivering_traits');
    setHighlightedMembers(['skinTone', 'wearsGlasses', 'hairColor', 'height']);
    const t1 = setTimeout(() => {
      setPhase('specialization');
    }, 4500);
    const t2 = setTimeout(() => {
      setPhase('completed');
    }, 8500);
    timeoutsRef.current = [t1, t2];
  };

  const handleSelectChild = (childId) => {
    clearAllTimeouts();
    setSelectedNode(childId);
    setPhase('delivering_traits');

    if (childId === 'child1' || childId === 'student') {
      setHighlightedMembers(['skinTone', 'wearsGlasses']);
      const t1 = setTimeout(() => {
        setPhase('specialization');
        setHighlightedMembers(['hairColor', 'height']);
      }, 3500);
      timeoutsRef.current = [t1];
    } else if (childId === 'child2' || childId === 'employee') {
      setHighlightedMembers(['hairColor', 'height']);
      const t1 = setTimeout(() => {
        setPhase('specialization');
        setHighlightedMembers(['skinTone', 'eyeColor']);
      }, 3500);
      timeoutsRef.current = [t1];
    }
  };

  // Status info panel
  const getStatusInfo = () => {
    switch (phase) {
      case 'intro':
        return {
          step: "STEP 1 / 4",
          title: "Base Class Person",
          desc: "Person is the superclass. Declares base genetic properties: dusky skin, brown hair, tall height, and glasses.",
          tag: "BASE CLASS DEFINITION",
          badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-300"
        };
      case 'delivering_traits':
        return {
          step: "STEP 2 / 4",
          title: "Hierarchical Trait Transmission",
          desc: "Base properties stream down from Person to both Child1 and Child2 along the inheritance conduits.",
          tag: "TRANSMITTING TRAITS",
          badgeBg: "bg-sky-500/10 border-sky-500/30 text-sky-300"
        };
      case 'specialization':
        return {
          step: "STEP 3 / 4",
          title: "Specialization & Overrides",
          desc: "Child1 overrides hairColor to black and height to shorter. Child2 introduces fair skin and blue eyes.",
          tag: "OVERRIDES & SPECIALIZATION",
          badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
        };
      case 'completed':
      default:
        return {
          step: "STEP 4 / 4",
          title: "Hierarchical Tree Complete",
          desc: "One parent (Person) successfully inherited by multiple children (Child1 & Child2). Click any class to inspect.",
          tag: "HIERARCHICAL COMPLETE",
          badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
        };
    }
  };

  const status = getStatusInfo();

  // Active highlights
  const isParentHovered = hoveredNode === 'parent';
  const isChild1Active = hoveredNode === 'child1' || hoveredNode === 'student' || selectedNode === 'child1' || selectedNode === 'student';
  const isChild2Active = hoveredNode === 'child2' || hoveredNode === 'employee' || selectedNode === 'child2' || selectedNode === 'employee';

  const isLeftConduitActive = isChild1Active || phase === 'delivering_traits' || phase === 'specialization';
  const isRightConduitActive = isChild2Active || phase === 'delivering_traits' || phase === 'specialization';

  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const containerBgClass = isDark
    ? 'bg-[#080C16] text-slate-100'
    : isWarm
    ? 'bg-[#FDFBF7] text-[#2D1F23]'
    : 'bg-[#F8FAFC] text-slate-900';

  const defPanelCardClass = isDark
    ? 'bg-[#090D17]/90 border-amber-500/25 text-slate-300'
    : isWarm
    ? 'bg-[#FAF7F2]/95 border-amber-600/30 text-[#2D1F23] shadow-lg'
    : 'bg-white/95 border-amber-500/30 text-slate-800 shadow-xl';

  const statusPillClass = isDark
    ? 'bg-[#090D17]/85 border-white/10 text-amber-300'
    : isWarm
    ? 'bg-[#FAF7F2]/90 border-[#EBE0D3] text-amber-800'
    : 'bg-white/95 border-slate-200 text-amber-800 shadow-md';

  const relationshipBadgeClass = isDark
    ? 'bg-slate-950 border-amber-500/40 text-amber-300'
    : isWarm
    ? 'bg-[#FAF7F2] border-amber-600/40 text-amber-800'
    : 'bg-white border-amber-500/40 text-amber-800 shadow-sm';

  const footerClass = isDark
    ? 'bg-[#080C16]/95 border-white/10 text-white'
    : isWarm
    ? 'bg-[#FDFBF7]/95 border-[#EBE0D3] text-[#2D1F23]'
    : 'bg-white/95 border-slate-200 text-slate-800 shadow-xl';

  return (
    <div className={`relative w-full min-h-full flex flex-col items-center justify-between select-none ${containerBgClass} font-sans transition-colors duration-300`}>
      
      {/* ── 1. ATMOSPHERIC DEEP COSMIC BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Center Warm Amber Aurora (Person Parent Level) */}
        <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-600/15 via-orange-500/10 to-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Bottom Left Emerald Aurora (Child1 Level) */}
        <div className="absolute bottom-[10%] left-[8%] w-[520px] h-[320px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Bottom Right Indigo Aurora (Child2 Level) */}
        <div className="absolute bottom-[10%] right-[8%] w-[520px] h-[320px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Minimal Futuristic Coordinate Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf806_1px,transparent_1px),linear-gradient(to_bottom,#38bdf806_1px,transparent_1px)] bg-[size:44px_44px] opacity-60" />

        {/* Floating Stardust Particles */}
        <div className="absolute inset-0">
          {[
            { top: '15%', left: '18%', size: '3px', col: '#F59E0B' },
            { top: '25%', left: '82%', size: '2px', col: '#10B981' },
            { top: '65%', left: '12%', size: '3px', col: '#6366F1' },
            { top: '75%', left: '86%', size: '2px', col: '#38BDF8' },
          ].map((pt, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut" }}
              className="absolute rounded-full"
              style={{
                top: pt.top,
                left: pt.left,
                width: pt.size,
                height: pt.size,
                backgroundColor: pt.col,
                boxShadow: `0 0 10px ${pt.col}`
              }}
            />
          ))}
        </div>
      </div>

      {/* ── 2. TOP-LEFT HIERARCHICAL INHERITANCE DEFINITION PANEL ── */}
      <div className="hidden xl:flex absolute top-5 left-6 z-30 max-w-xs flex-col pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-col gap-2 ${defPanelCardClass}`}
        >
          {/* Header with Hierarchical Badge */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-500">
              <GitFork size={15} />
            </div>
            <div>
              <span className={`font-mono text-xs font-black tracking-wider uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                HIERARCHICAL INHERITANCE
              </span>
              <span className={`block text-[10px] font-mono ${isDark ? 'text-amber-300/80' : 'text-amber-700'}`}>
                1 Parent Class → Multiple Child Subclasses
              </span>
            </div>
          </div>

          {/* Explanation Body */}
          <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            In <strong>Hierarchical Inheritance</strong>, one base class (<strong className={isDark ? 'text-amber-300' : 'text-amber-700'}>Person</strong>) acts as the parent for multiple subclasses (<strong className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>Child1</strong> & <strong className={isDark ? 'text-indigo-300' : 'text-indigo-700'}>Child2</strong>), which inherit shared properties while introducing their own specializations.
          </p>

          {/* Live Step Badge */}
          <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-white/10' : 'border-slate-200'} font-mono text-[10px]`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{status.step}:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold border ${status.badgeBg}`}>
              {status.tag}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── 3. TOP-RIGHT LIVE STATUS PILL ── */}
      <div className="hidden sm:flex absolute top-5 right-6 z-30 pointer-events-none">
        <motion.div
          key={status.title}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-3.5 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-2 font-mono text-xs font-bold shadow-lg ${statusPillClass}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#F59E0B]" />
          <span>{status.title}</span>
        </motion.div>
      </div>

      {/* ======================================================================
          ── 4. FAMILY TREE GRAPH CANVAS (PARENT ON TOP, CHILDREN BELOW) ──
          ====================================================================== */}
      <div className="relative z-20 w-full flex-1 flex flex-col items-center justify-center px-4 max-w-6xl mx-auto pt-3 pb-12 sm:pb-16 my-auto min-h-max">
        
        {/* Quick Navigation Chips */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 z-30 flex-wrap">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold mr-1">
            Focus Class:
          </span>
          <button
            onClick={() => {
              setSelectedNode(null);
              document.getElementById('node-parent')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 font-mono text-[10.5px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs flex items-center gap-1"
          >
            <span>👨 Person (Base Class)</span>
          </button>
          <button
            onClick={() => {
              handleSelectChild('child1');
              document.getElementById('node-child1')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-mono text-[10.5px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs flex items-center gap-1"
          >
            <span>🌱 Child1 (Subclass)</span>
          </button>
          <button
            onClick={() => {
              handleSelectChild('child2');
              document.getElementById('node-child2')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="px-3 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/35 text-indigo-300 font-mono text-[10.5px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs flex items-center gap-1"
          >
            <span>🌟 Child2 (Subclass)</span>
          </button>
        </div>

        {/* ── ROW 1: PARENT CLASS (BASE CLASS: PERSON) ── */}
        <div className="relative flex flex-col items-center z-30">
          <ClassNodeCard
            classData={CLASSES.parent}
            isHovered={isParentHovered}
            isDimmed={isChild1Active || isChild2Active}
            onMouseEnter={() => setHoveredNode('parent')}
            onMouseLeave={() => setHoveredNode(null)}
            onOpenCode={(tab) => setActiveCodeModalTab(tab)}
            isInheritanceActive={true}
            highlightedMembers={highlightedMembers}
          />

          {/* Golden Parent Emitter Hub */}
          <div className="relative w-8 h-8 -mt-2 flex items-center justify-center z-30">
            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_18px_#F59E0B] border-2 border-white animate-pulse" />
          </div>
        </div>

        {/* ── ROW 2: DUAL INHERITANCE CONDUITS (SVG BEZIER PATHS) ── */}
        <InheritanceConduits
          phase={phase}
          isLeftConduitActive={isLeftConduitActive}
          isRightConduitActive={isRightConduitActive}
        />

        {/* ── ROW 3: SUBCLASSES (CHILD1 & CHILD2 ALIGNED SIDE-BY-SIDE) ── */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 justify-items-center z-30">
          
          {/* Child 1 Card */}
          <ClassNodeCard
            classData={CLASSES.child1}
            isHovered={isChild1Active}
            isSelected={selectedNode === 'child1' || selectedNode === 'student'}
            isDimmed={isParentHovered ? false : (isChild2Active && !isChild1Active)}
            onMouseEnter={() => setHoveredNode('child1')}
            onMouseLeave={() => setHoveredNode(null)}
            onSelectNode={() => handleSelectChild('child1')}
            onOpenCode={(tab) => setActiveCodeModalTab(tab || 'Child1')}
            isInheritanceActive={true}
            highlightedMembers={highlightedMembers}
          />

          {/* Child 2 Card */}
          <ClassNodeCard
            classData={CLASSES.child2}
            isHovered={isChild2Active}
            isSelected={selectedNode === 'child2' || selectedNode === 'employee'}
            isDimmed={isParentHovered ? false : (isChild1Active && !isChild2Active)}
            onMouseEnter={() => setHoveredNode('child2')}
            onMouseLeave={() => setHoveredNode(null)}
            onSelectNode={() => handleSelectChild('child2')}
            onOpenCode={(tab) => setActiveCodeModalTab(tab || 'Child2')}
            isInheritanceActive={true}
            highlightedMembers={highlightedMembers}
          />
        </div>

      </div>

      {/* ── 5. FINAL HIERARCHICAL INHERITANCE TAKEAWAY ── */}
      <AnimatePresence>
        {phase === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 mb-3 text-center max-w-2xl px-4 pointer-events-none"
          >
            <div className="font-mono text-xs tracking-wider uppercase font-black text-amber-500 mb-1 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>HIERARCHICAL INHERITANCE PRINCIPLE</span>
            </div>
            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-amber-300' : 'text-amber-700'}>Person</strong> passes its base code foundation to multiple subclasses. <strong className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>Child1</strong> inherits dusky skin & specs while overriding hair to black. <strong className={isDark ? 'text-indigo-300' : 'text-indigo-700'}>Child2</strong> inherits brown hair & tall height while defining fair skin & blue eyes.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 6. PERSISTENT CONTROLS FOOTER DOCK ── */}
      <footer className={`sticky bottom-0 z-40 w-full px-4 sm:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 border-t backdrop-blur-xl shrink-0 shadow-2xl transition-colors duration-300 ${footerClass}`}>
        
        {/* Left: Replay & Trait Trigger */}
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
            <RotateCcw size={13} className="text-amber-500" />
            <span>Replay Flow</span>
          </button>

          <button
            onClick={handleManualTransmit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
          >
            <Zap size={13} className="text-amber-500" />
            <span>Transmit Traits</span>
          </button>
        </div>

        {/* Center: Live Step Pills */}
        <div className="hidden lg:flex items-center gap-1 font-mono text-[10px]">
          {[
            { id: 'intro', label: '1. Base Person' },
            { id: 'delivering_traits', label: '2. Trait Delivery' },
            { id: 'specialization', label: '3. Specialization' },
            { id: 'completed', label: '4. Complete' },
          ].map(st => {
            const isActive = phase === st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  clearAllTimeouts();
                  setPhase(st.id);
                  if (st.id === 'delivering_traits') setHighlightedMembers(['skinTone', 'wearsGlasses', 'hairColor', 'height']);
                  if (st.id === 'specialization') setHighlightedMembers(['hairColor', 'height', 'skinTone', 'eyeColor']);
                }}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-amber-500/20 text-amber-500 font-bold border border-amber-500/40 shadow-xs' 
                    : isDark ? 'text-slate-400 opacity-50 hover:opacity-100 hover:bg-white/5' : 'text-slate-500 opacity-60 hover:opacity-100 hover:bg-black/5'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Right: View Java Architecture & Next OOP Concept */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveCodeModalTab('HierarchicalDemo')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10' 
                : isWarm 
                ? 'bg-[#EBE0D3]/50 hover:bg-[#EBE0D3] text-[#2D1F23] border-[#D9CAB9]' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
          >
            <BookOpen size={13} className="text-amber-500" />
            <span className="hidden sm:inline">Compare All 3 Classes</span>
            <span className="sm:hidden">Java Code</span>
          </button>

          {onNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Next: Polymorphism</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </footer>

      {/* ── 7. JAVA ARCHITECTURE CODE MODAL ── */}
      <CodeModal
        isOpen={Boolean(activeCodeModalTab)}
        onClose={() => setActiveCodeModalTab(null)}
        initialTab={activeCodeModalTab || 'Person'}
      />

    </div>
  );
}
