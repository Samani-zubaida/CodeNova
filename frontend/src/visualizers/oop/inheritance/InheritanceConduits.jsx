import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles, RefreshCw } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';

/**
 * InheritanceConduits - Dual cubic Bezier curves and animated trait particles
 * Visualizes hierarchical trait delivery from Person to Child1 and Child2.
 */
export const InheritanceConduits = ({
  phase,
  isLeftConduitActive = false,
  isRightConduitActive = false,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const relationshipBadgeClass = isDark
    ? 'bg-slate-950 border-amber-500/40 text-amber-300'
    : isWarm
    ? 'bg-[#FAF7F2] border-amber-600/40 text-amber-800'
    : 'bg-white border-amber-500/40 text-amber-800 shadow-sm';

  return (
    <div className="relative w-full max-w-4xl h-16 sm:h-20 -my-2 pointer-events-none">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <defs>
          {/* Left Path Gradient: Amber -> Emerald (Person -> Child1) */}
          <linearGradient id="child1BranchGrad" x1="50%" y1="0%" x2="25%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="60%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Right Path Gradient: Amber -> Indigo (Person -> Child2) */}
          <linearGradient id="child2BranchGrad" x1="50%" y1="0%" x2="75%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="60%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* Conduits Glow Filter */}
          <filter id="branchGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Conduit (Person -> Child1) */}
        <path
          d="M 500 0 C 500 45, 250 45, 250 100"
          fill="none"
          stroke="url(#child1BranchGrad)"
          strokeWidth={isLeftConduitActive ? "5" : "2.5"}
          strokeOpacity={isLeftConduitActive ? "0.95" : "0.35"}
          vectorEffect="non-scaling-stroke"
          filter="url(#branchGlow)"
          className="transition-all duration-300"
        />
        {/* Left Pulse Dash */}
        <path
          d="M 500 0 C 500 45, 250 45, 250 100"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="8 40"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="animate-pulse"
          opacity={isLeftConduitActive ? 0.9 : 0.4}
        />

        {/* Right Conduit (Person -> Child2) */}
        <path
          d="M 500 0 C 500 45, 750 45, 750 100"
          fill="none"
          stroke="url(#child2BranchGrad)"
          strokeWidth={isRightConduitActive ? "5" : "2.5"}
          strokeOpacity={isRightConduitActive ? "0.95" : "0.35"}
          vectorEffect="non-scaling-stroke"
          filter="url(#branchGlow)"
          className="transition-all duration-300"
        />
        {/* Right Pulse Dash */}
        <path
          d="M 500 0 C 500 45, 750 45, 750 100"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="8 40"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="animate-pulse"
          opacity={isRightConduitActive ? 0.9 : 0.4}
        />
      </svg>

      {/* Central Hierarchical Relationship Badge */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[9px] font-mono font-bold flex items-center gap-1.5 shadow-lg pointer-events-auto border ${relationshipBadgeClass}`}>
        <span>HIERARCHICAL: extends Person</span>
        <ArrowDown size={10} className="text-amber-500" />
      </div>

      {/* ── ANIMATED PROPERTY FLOW (DATA PARTICLES TRANSMITTING TRAITS) ── */}
      <AnimatePresence>
        {(phase === 'delivering_traits' || phase === 'specialization') && (
          <>
            {/* Particle 1 -> Child1: dusky skin */}
            <motion.div
              initial={{ top: '0%', left: '50%', opacity: 0 }}
              animate={{ 
                top: ['0%', '100%'],
                left: ['50%', '25%'],
                opacity: [0, 1, 1, 0.85]
              }}
              transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
              className="absolute z-40 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[9px] font-black shadow-[0_0_20px_#10B981] pointer-events-none"
            >
              <Sparkles size={9} />
              <span>PASSING: [dusky skin, glasses]</span>
            </motion.div>

            {/* Particle 2 -> Child1: Brown hair overridden by black hair */}
            <motion.div
              initial={{ top: '0%', left: '50%', opacity: 0 }}
              animate={{ 
                top: ['0%', '100%'],
                left: ['50%', '25%'],
                opacity: [0, 0.9, 1, 0.9]
              }}
              transition={{ duration: 3.2, delay: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
              className="absolute z-40 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono text-[9px] font-black shadow-[0_0_20px_#F59E0B] pointer-events-none"
            >
              <RefreshCw size={9} className="animate-spin" />
              <span>MUTATING: hairColor → "black"</span>
            </motion.div>

            {/* Particle 3 -> Child2: Brown hair & tall height */}
            <motion.div
              initial={{ top: '0%', left: '50%', opacity: 0 }}
              animate={{ 
                top: ['0%', '100%'],
                left: ['50%', '75%'],
                opacity: [0, 1, 1, 0.85]
              }}
              transition={{ duration: 2.8, delay: 0.3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
              className="absolute z-40 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500 text-slate-950 font-mono text-[9px] font-black shadow-[0_0_20px_#6366F1] pointer-events-none"
            >
              <Sparkles size={9} />
              <span>PASSING: [brown hair, tall height]</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
