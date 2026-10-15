import React from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, RefreshCw, Zap } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';

/**
 * MemberBadge - Renders a visually distinct pill for class properties and methods
 * Visually differentiates [ INHERITED ] (Cyan/Sky) vs [ OWN ] (Purple) vs [ OVERRIDDEN ] (Amber/Orange).
 */
export const MemberBadge = ({
  name,
  type = 'property', // 'property' | 'method'
  dataType = '', // e.g. 'String', 'boolean', 'int'
  value = '', // e.g. '"dusky"', 'true'
  isInherited = false,
  isOverridden = false,
  isHighlighted = false,
  showTag = false,
  customTag = null,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Determine badge semantic classification
  const mode = isOverridden ? 'overridden' : isInherited ? 'inherited' : 'own';

  // Dynamic colors based on mode and theme
  const modeStyles = isDark ? {
    inherited: {
      bg: isHighlighted ? 'bg-sky-500/30' : 'bg-sky-950/40 hover:bg-sky-900/50',
      border: isHighlighted ? 'border-sky-400' : 'border-sky-500/30',
      text: 'text-sky-200',
      glow: 'shadow-[0_0_16px_rgba(56,189,248,0.5)]',
      iconBg: 'bg-sky-500/30 border-sky-400/50',
      iconColor: 'text-sky-300',
      tagBg: 'bg-sky-500/25 border-sky-400/50 text-sky-200',
      tagText: 'INHERITED',
    },
    overridden: {
      bg: isHighlighted ? 'bg-amber-500/35' : 'bg-amber-950/45 hover:bg-amber-900/50',
      border: isHighlighted ? 'border-amber-400' : 'border-amber-500/40',
      text: 'text-amber-200',
      glow: 'shadow-[0_0_18px_rgba(245,158,11,0.55)]',
      iconBg: 'bg-amber-500/30 border-amber-400/50',
      iconColor: 'text-amber-300',
      tagBg: 'bg-amber-500/25 border-amber-400/60 text-amber-200',
      tagText: 'OVERRIDDEN',
    },
    own: {
      bg: isHighlighted ? 'bg-purple-500/30' : 'bg-purple-950/40 hover:bg-purple-900/50',
      border: isHighlighted ? 'border-purple-400' : 'border-purple-500/30',
      text: 'text-purple-200',
      glow: 'shadow-[0_0_16px_rgba(168,85,247,0.5)]',
      iconBg: 'bg-purple-500/30 border-purple-400/50',
      iconColor: 'text-purple-300',
      tagBg: 'bg-purple-500/25 border-purple-400/50 text-purple-200',
      tagText: 'OWN',
    },
  }[mode] : isWarm ? {
    inherited: {
      bg: isHighlighted ? 'bg-sky-100/90' : 'bg-sky-50/70 hover:bg-sky-100/80',
      border: isHighlighted ? 'border-sky-500' : 'border-sky-300',
      text: 'text-sky-900',
      glow: 'shadow-[0_0_12px_rgba(56,189,248,0.3)]',
      iconBg: 'bg-sky-200 border-sky-400',
      iconColor: 'text-sky-800',
      tagBg: 'bg-sky-100 border-sky-300 text-sky-800',
      tagText: 'INHERITED',
    },
    overridden: {
      bg: isHighlighted ? 'bg-amber-100/90' : 'bg-amber-50/70 hover:bg-amber-100/80',
      border: isHighlighted ? 'border-amber-500' : 'border-amber-300',
      text: 'text-amber-900',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
      iconBg: 'bg-amber-200 border-amber-400',
      iconColor: 'text-amber-800',
      tagBg: 'bg-amber-100 border-amber-300 text-amber-800',
      tagText: 'OVERRIDDEN',
    },
    own: {
      bg: isHighlighted ? 'bg-purple-100/90' : 'bg-purple-50/70 hover:bg-purple-100/80',
      border: isHighlighted ? 'border-purple-500' : 'border-purple-300',
      text: 'text-purple-900',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]',
      iconBg: 'bg-purple-200 border-purple-400',
      iconColor: 'text-purple-800',
      tagBg: 'bg-purple-100 border-purple-300 text-purple-800',
      tagText: 'OWN',
    },
  }[mode] : {
    inherited: {
      bg: isHighlighted ? 'bg-sky-100' : 'bg-sky-50/80 hover:bg-sky-100',
      border: isHighlighted ? 'border-sky-500' : 'border-sky-200',
      text: 'text-sky-900',
      glow: 'shadow-[0_0_12px_rgba(56,189,248,0.25)]',
      iconBg: 'bg-sky-100 border-sky-300',
      iconColor: 'text-sky-700',
      tagBg: 'bg-sky-50 border-sky-300 text-sky-800',
      tagText: 'INHERITED',
    },
    overridden: {
      bg: isHighlighted ? 'bg-amber-100' : 'bg-amber-50/80 hover:bg-amber-100',
      border: isHighlighted ? 'border-amber-500' : 'border-amber-200',
      text: 'text-amber-900',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      iconBg: 'bg-amber-100 border-amber-300',
      iconColor: 'text-amber-700',
      tagBg: 'bg-amber-50 border-amber-300 text-amber-800',
      tagText: 'OVERRIDDEN',
    },
    own: {
      bg: isHighlighted ? 'bg-purple-100' : 'bg-purple-50/80 hover:bg-purple-100',
      border: isHighlighted ? 'border-purple-500' : 'border-purple-200',
      text: 'text-purple-900',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.25)]',
      iconBg: 'bg-purple-100 border-purple-300',
      iconColor: 'text-purple-700',
      tagBg: 'bg-purple-50 border-purple-300 text-purple-800',
      tagText: 'OWN',
    },
  }[mode];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: isHighlighted ? 1.03 : 1,
        borderColor: isHighlighted
          ? mode === 'overridden'
            ? 'rgba(245, 158, 11, 0.9)'
            : mode === 'inherited'
            ? 'rgba(56, 189, 248, 0.9)'
            : 'rgba(168, 85, 247, 0.9)'
          : undefined,
      }}
      transition={{ duration: 0.2 }}
      className={`group relative flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono select-none transition-all shadow-xs backdrop-blur-md w-full min-w-0 ${
        modeStyles.bg
      } ${modeStyles.border} ${isHighlighted ? `${modeStyles.glow} animate-pulse` : ''}`}
    >
      {/* Left: Indicator Icon + Member Name */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        {mode === 'inherited' && (
          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${modeStyles.iconBg}`}>
            <Check size={8.5} className={`${modeStyles.iconColor} stroke-[3]`} />
          </div>
        )}
        {mode === 'overridden' && (
          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${modeStyles.iconBg}`}>
            <RefreshCw size={8.5} className={`${modeStyles.iconColor} stroke-[2.5] animate-spin`} style={{ animationDuration: '6s' }} />
          </div>
        )}
        {mode === 'own' && (
          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${modeStyles.iconBg}`}>
            <Plus size={8.5} className={`${modeStyles.iconColor} stroke-[3]`} />
          </div>
        )}

        {/* Member Name */}
        <span className={`font-bold truncate text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`} title={name}>
          {name}
          {type === 'method' && <span className={isDark ? 'text-slate-400 font-normal' : 'text-slate-500 font-normal'}>()</span>}
        </span>
      </div>

      {/* Right: Value Pill & Optional Override Chip */}
      <div className="flex items-center gap-1 shrink-0">
        {value && (
          <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
            mode === 'overridden'
              ? (isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-900 border-amber-300')
              : mode === 'inherited'
              ? (isDark ? 'bg-sky-500/15 text-sky-300 border-sky-500/30' : 'bg-sky-100 text-sky-900 border-sky-200')
              : (isDark ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-900 border-purple-200')
          }`}>
            {value}
          </span>
        )}

        {dataType && !value && (
          <span className={`text-[9.5px] font-mono font-medium px-1 py-0.5 rounded ${isDark ? 'text-slate-400 bg-white/5' : 'text-slate-600 bg-black/5'}`}>
            {dataType}
          </span>
        )}

        {isOverridden && (
          <span className="text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/25 text-amber-300 border border-amber-500/40">
            override
          </span>
        )}

        {showTag && !isOverridden && (
          <span className={`text-[8px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase border shadow-xs ${modeStyles.tagBg}`}>
            {customTag || modeStyles.tagText}
          </span>
        )}
      </div>
    </motion.div>
  );
};
