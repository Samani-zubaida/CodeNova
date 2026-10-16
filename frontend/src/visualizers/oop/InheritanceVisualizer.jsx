import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitFork, CheckCircle2, Zap, BookOpen, Code2
} from 'lucide-react';
import { ClassNodeCard } from './inheritance/ClassNodeCard';
import { CodeModal, JAVA_CODE_FILES } from './inheritance/CodeModal';
import { InheritanceConduits } from './inheritance/InheritanceConduits';
import { INHERITANCE_CLASSES as CLASSES } from './data/inheritanceData';
import useAppStore from '../../store/useAppStore';
import OopStudioWorkspace from './components/common/OopStudioWorkspace';

const HIERARCHICAL_PHASES = [
  {
    id: 'intro',
    stepNumber: 1,
    title: 'Base Parent Class (Person)',
    tag: 'PARENT BLUEPRINT',
    desc: 'Person acts as the root parent class, encapsulating universal human attributes (skinTone, hairColor, height, wearsGlasses) and methods (eat, sleep).',
    accentColor: '#F59E0B',
    principleInsight: 'Hierarchical inheritance establishes a single foundational base class that can be shared across multiple specialized child subclasses.'
  },
  {
    id: 'delivering_traits',
    stepNumber: 2,
    title: 'Trait Delivery Down Conduits',
    tag: 'GENETIC PASS-THROUGH',
    desc: 'Luminous conduits branch down from Person. Child1 and Child2 inherit foundational methods and attributes without duplicating code.',
    accentColor: '#10B981',
    principleInsight: 'Child classes automatically gain all public and protected capabilities of their parent through class extension.'
  },
  {
    id: 'specialization',
    stepNumber: 3,
    title: 'Subclass Specialization & Overrides',
    tag: 'POLYMORPHIC DIVERGENCE',
    desc: 'Child1 overrides hairColor to black & height to shorter. Child2 introduces its own distinct fair skin and blue eyes.',
    accentColor: '#38BDF8',
    principleInsight: 'Subclasses inherit shared traits while retaining full freedom to override or add custom properties.'
  },
  {
    id: 'completed',
    stepNumber: 4,
    title: 'Hierarchical Network Verified',
    tag: 'MULTI-CHILD TREE VERIFIED',
    desc: '1 single parent class powers multiple child subclasses simultaneously. Common behavior is centralized; unique behavior is localized.',
    accentColor: '#8B5CF6',
    principleInsight: 'Hierarchical inheritance eliminates redundancy across brother/sister classes in large software architectures.'
  }
];

export default function InheritanceVisualizer({ isEmbedded = false, onNext, onReturnToCatalog }) {
  // Animation timeline state:
  // 'intro' -> 'delivering_traits' -> 'specialization' -> 'completed'
  const [phase, setPhase] = useState('intro');
  const [hoveredNode, setHoveredNode] = useState(null); // 'parent' | 'child1' | 'child2' | null
  const [selectedNode, setSelectedNode] = useState(null); // 'child1' | 'child2' | null
  const [activeCodeModalTab, setActiveCodeModalTab] = useState(null);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('HierarchicalDemo');
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

  return (
    <>
      <OopStudioWorkspace
        conceptName="Hierarchical Inheritance"
        conceptSubtitle="INHERITANCE PATTERN 03/05"
        conceptDesc="One base parent class (Person) acts as the root template for multiple child subclasses (Child1 & Child2), sharing foundational traits while allowing individual specialization."
        conceptIcon={GitFork}
        conceptAccent="#F59E0B"
        phases={HIERARCHICAL_PHASES}
        activePhaseId={phase}
        onSelectPhase={(id) => {
          clearAllTimeouts();
          setPhase(id);
          if (id === 'delivering_traits') setHighlightedMembers(['skinTone', 'wearsGlasses', 'hairColor', 'height']);
          if (id === 'specialization') setHighlightedMembers(['hairColor', 'height', 'skinTone', 'eyeColor']);
        }}
        onReplay={handleReplay}
        primaryAction={{
          label: 'Transmit Traits',
          onClick: handleManualTransmit,
          icon: <Zap size={13} className="text-amber-500" />
        }}
        isCodeOpen={isCodeOpen}
        onToggleCode={() => setIsCodeOpen(prev => !prev)}
        codeFilename={JAVA_CODE_FILES[activeCodeTab]?.filename || 'HierarchicalDemo.java'}
        rawCode={JAVA_CODE_FILES[activeCodeTab]?.code || JAVA_CODE_FILES.HierarchicalDemo.code}
        codeTabs={['HierarchicalDemo', 'Person', 'Child1', 'Child2']}
        activeCodeTab={activeCodeTab}
        onSelectCodeTab={setActiveCodeTab}
        activeHighlightKey={phase}
        activeMemberId={hoveredNode}
        canvasHeaderAction={
          <button
            type="button"
            onClick={() => setActiveCodeModalTab('HierarchicalDemo')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title="Open Complete 3-Class Comparison Modal"
          >
            <BookOpen size={13} className="text-amber-500" />
            <span>Compare</span>
          </button>
        }
        nextConcept={{
          label: "Next: Polymorphism",
          onNext: onNext
        }}
      >
        <div className="relative z-20 w-full flex flex-col items-center justify-center max-w-5xl mx-auto space-y-3 min-w-[320px] md:min-w-[640px]">
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
      </OopStudioWorkspace>

      {/* ── 6. JAVA ARCHITECTURE CODE MODAL (POPUP) ── */}
      <CodeModal
        isOpen={Boolean(activeCodeModalTab)}
        onClose={() => setActiveCodeModalTab(null)}
        initialTab={activeCodeModalTab || 'Person'}
      />
    </>
  );
}
