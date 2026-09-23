import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, GitFork, ShieldCheck } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';

/**
 * MultilevelConduit - High-Tech Animated Data Conduit Connecting the 3 Inheritance Levels
 * Segment 1: Person -> Employee (extends Person)
 * Segment 2: Employee -> Manager (extends Employee)
 * Handles sequential member particle packets, stream lines, and deep-chain traversal.
 */
export const MultilevelConduit = ({
  level, // 1 (Person -> Employee) or 2 (Employee -> Manager)
  isActive = false,
  isDeepPassing = false,
  transferringMember = null,
  currentPhase = '',
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Conduit Theme Tokens
  const conduitColor = level === 1
    ? (isDark ? '#38BDF8' : isWarm ? '#0284C7' : '#0284C7')
    : (isDark ? '#C084FC' : isWarm ? '#9333EA' : '#7E22CE');

  const conduitGlow = level === 1
    ? 'rgba(56, 189, 248, 0.4)'
    : 'rgba(192, 132, 252, 0.4)';

  const labelText = level === 1 ? 'extends Person' : 'extends Employee';
  const levelBadge = level === 1 ? 'INHERITANCE LINK 1' : 'INHERITANCE LINK 2';

  return (
    <div className="relative w-full max-w-lg py-2 my-1 flex flex-col items-center justify-center shrink-0">
      
      {/* ── 1. AMBIENT GLOW BACKDROP ── */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isDeepPassing ? [0.6, 0.9, 0.6] : [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute w-48 h-12 rounded-full blur-xl pointer-events-none"
          style={{ backgroundColor: conduitGlow }}
        />
      )}

      {/* ── 2. CENTRAL DATA PIPELINE TRACK ── */}
      <div className="relative flex flex-col items-center">
        {/* Top Connecting Node */}
        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 z-10 ${
          isActive 
            ? 'bg-white shadow-[0_0_10px_currentColor]' 
            : isDark ? 'bg-slate-800 border-white/20' : 'bg-slate-200 border-slate-300'
        }`} style={{ color: conduitColor, borderColor: conduitColor }} />

        {/* Central Vertical Conduit Beam */}
        <div className="relative w-1.5 h-10 sm:h-12 flex items-center justify-center">
          {/* Base Track */}
          <div className={`w-full h-full rounded-full transition-colors duration-300 ${
            isDark ? 'bg-white/10' : 'bg-slate-300'
          }`} />

          {/* Active Energy Stream Glow */}
          {isActive && (
            <motion.div
              initial={{ height: '0%' }}
              animate={{ height: '100%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute top-0 w-full rounded-full"
              style={{
                background: level === 1
                  ? 'linear-gradient(to bottom, #0284C7, #38BDF8, #818CF8)'
                  : 'linear-gradient(to bottom, #818CF8, #A855F7, #EC4899)',
                boxShadow: `0 0 10px ${conduitColor}`,
              }}
            />
          )}

          {/* Flowing Laser Photons */}
          {isActive && (
            <motion.div
              animate={{ y: [-15, 45] }}
              transition={{ repeat: Infinity, duration: isDeepPassing ? 0.9 : 1.4, ease: 'linear' }}
              className="absolute top-0 w-2.5 h-5 rounded-full blur-[1px] pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent, #FFFFFF, transparent)',
                boxShadow: `0 0 8px #FFFFFF, 0 0 14px ${conduitColor}`,
              }}
            />
          )}

          {/* Deep Transitive Multi-Level Trail Particle */}
          {isDeepPassing && (
            <motion.div
              animate={{ y: [-20, 50], scale: [0.8, 1.3, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              className="absolute top-0 w-3 h-3 rounded-full bg-cyan-300 blur-[0.5px] pointer-events-none"
              style={{
                boxShadow: '0 0 12px #22D3EE, 0 0 20px #A855F7',
              }}
            />
          )}

          {/* Centered Inherited Badge Pill */}
          <div className="absolute z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full backdrop-blur-xl border shadow-md font-mono text-[11px] font-bold select-none whitespace-nowrap transition-all duration-300"
            style={{
              backgroundColor: isDark ? 'rgba(9, 13, 23, 0.95)' : isWarm ? '#FAF7F2' : '#FFFFFF',
              borderColor: isActive ? conduitColor : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(203,213,225,0.9)'),
              color: isDark ? (isActive ? '#FFFFFF' : '#94A3B8') : '#0F172A',
              boxShadow: isActive ? `0 0 14px ${conduitGlow}` : 'none',
            }}
          >
            <GitFork size={12} className={isActive ? 'animate-pulse' : 'opacity-60'} style={{ color: conduitColor }} />
            <span className="tracking-wide font-extrabold">{labelText}</span>
            <ArrowDown size={11} className={`transition-transform duration-300 ${isActive ? 'translate-y-0.5 text-emerald-500' : 'opacity-50'}`} />
          </div>

          {/* Live Transferring Member Particle Capsule */}
          {transferringMember && (
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.8 }}
              animate={{ y: 15, opacity: 1, scale: 1.05 }}
              exit={{ y: 45, opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
              className="absolute z-30 px-3 py-0.5 rounded-full shadow-2xl font-mono text-xs font-black flex items-center gap-1.5 border"
              style={{
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                borderColor: conduitColor,
                color: isDark ? '#FFFFFF' : '#0F172A',
                boxShadow: `0 0 16px ${conduitColor}`,
              }}
            >
              <Sparkles size={11} className="animate-spin text-amber-500" />
              <span>{transferringMember.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase"
                style={{ backgroundColor: `${conduitColor}25`, color: isDark ? conduitColor : '#0F172A' }}
              >
                {transferringMember.dataType || transferringMember.returnType}
              </span>
            </motion.div>
          )}
        </div>

        {/* Bottom Connecting Terminal Arrow */}
        <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10 flex items-center justify-center ${
          isActive 
            ? 'bg-white shadow-[0_0_10px_currentColor]' 
            : isDark ? 'bg-slate-800 border-white/20' : 'bg-slate-200 border-slate-300'
        }`} style={{ color: conduitColor, borderColor: conduitColor }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: conduitColor }} />
        </div>
      </div>
    </div>
  );
};
