import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles, Zap } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';

/**
 * SingleConduit - Animated vertical inheritance pathway connecting Vehicle to Car.
 * Features glowing stream pulse, travelling trait capsules, and central "extends Vehicle" badge.
 */
export const SingleConduit = ({
  isActive = false,
  transferringMember = null, // 'color' | 'speed' | 'start' | 'stop' | null
  currentPhase = 'intro',
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Conduit stroke color & glow styling
  const conduitStroke = isDark
    ? 'rgba(56, 189, 248, 0.7)'
    : isWarm
    ? 'rgba(217, 119, 6, 0.7)'
    : 'rgba(37, 99, 235, 0.7)';

  const activeGlow = isDark ? '#38BDF8' : isWarm ? '#D97706' : '#2563EB';

  const badgeBg = isDark
    ? 'bg-slate-950/95 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
    : isWarm
    ? 'bg-[#FAF7F2] border-amber-600/40 text-amber-900 shadow-md'
    : 'bg-white border-blue-500/40 text-blue-700 shadow-lg';

  return (
    <div className="relative w-full max-w-md h-14 sm:h-16 flex flex-col items-center justify-center pointer-events-none select-none my-0.5">
      {/* SVG Vertical Conduit Lines & Glow Particles */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 200 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="conduitFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>

          <linearGradient id="conduitGradient" x1="100" y1="0" x2="100" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={conduitStroke} stopOpacity="0.4" />
            <stop offset="50%" stopColor={activeGlow} stopOpacity="1" />
            <stop offset="100%" stopColor={isDark ? '#A855F7' : '#7C3AED'} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* 1. Underlying Atmospheric Glow Line */}
        <line
          x1="100"
          y1="2"
          x2="100"
          y2="68"
          stroke={activeGlow}
          strokeWidth="6"
          strokeOpacity={isActive ? 0.35 : 0.12}
          filter="url(#conduitFilter)"
        />

        {/* 2. Crisp Central Conduit Pipeline */}
        <line
          x1="100"
          y1="2"
          x2="100"
          y2="68"
          stroke="url(#conduitGradient)"
          strokeWidth={isActive ? '2.4' : '1.5'}
          strokeDasharray={isActive ? 'none' : '4 3'}
        />

        {/* 3. Continuously Flowing Ambient Stream Packets */}
        {isActive && (
          <>
            {[0, 1.0, 2.0].map((delay, idx) => (
              <motion.circle
                key={idx}
                r="3"
                cx="100"
                fill="#FFFFFF"
                filter="url(#conduitFilter)"
                initial={{ cy: 4, opacity: 0 }}
                animate={{
                  cy: [4, 66],
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1.3, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}
      </svg>

      {/* 4. Central "extends Vehicle" Relationship Token Badge */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.05, 1] : 1,
          borderColor: isActive ? activeGlow : 'rgba(255,255,255,0.15)',
        }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className={`relative z-20 px-3 py-1 rounded-full border backdrop-blur-xl flex items-center gap-1.5 font-mono text-[10px] font-extrabold tracking-wider uppercase transition-all ${badgeBg}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#22D3EE]" />
        <span className="text-[9px] opacity-75 font-normal">relationship:</span>
        <span className="text-cyan-400 font-black">extends</span>
        <span className={isDark ? 'text-amber-300' : 'text-amber-800'}>Vehicle</span>
        <ArrowDown size={11} className="text-cyan-400 animate-bounce" />
      </motion.div>

      {/* 5. Cinematic Transfer Capsule (Animates when a member is actively flowing down) */}
      <AnimatePresence>
        {transferringMember && (
          <motion.div
            key={transferringMember.id}
            initial={{ y: -38, opacity: 0, scale: 0.6 }}
            animate={{
              y: [ -38, 0, 38 ],
              opacity: [ 0, 1, 1, 0 ],
              scale: [ 0.8, 1.15, 0.9 ],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-mono text-[11px] font-black shadow-[0_0_25px_#06B6D4] border-2 border-white pointer-events-none"
          >
            <Sparkles size={11} className="animate-spin" />
            <span>transferring: {transferringMember.name}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
