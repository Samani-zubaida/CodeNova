import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * ConceptCard - Displays each OOP Pillar in the 4-cards catalog grid
 * Enhanced with consistent height, theme-adaptive surfaces (deep charcoal in dark mode,
 * frosted glass in light mode), keyboard accessibility, and concept-specific accent states.
 */
export const ConceptCard = ({ item, index = 0, onEnter }) => {
  const IconComp = item.icon;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEnter(item.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.28, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-label={`Launch ${item.name} Interactive Simulator`}
      onClick={() => onEnter(item.id)}
      onKeyDown={handleKeyDown}
      className={`group cursor-pointer rounded-3xl p-5 sm:p-5.5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 backdrop-blur-xl h-full select-none focus:outline-hidden focus-visible:ring-2
        bg-white/90 dark:bg-[#0E131F]/90 border border-slate-200/80 dark:border-white/[0.08] ${item.borderHover}
        shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.55)] hover:shadow-2xl`}
      style={{
        '--accent': item.accentColor
      }}
    >
      {/* Dynamic Specular Ambient Glow Accent */}
      <div 
        className="absolute top-0 right-0 w-36 h-36 rounded-full blur-[50px] pointer-events-none opacity-15 group-hover:opacity-35 transition-opacity duration-300"
        style={{ backgroundColor: item.accentColor }}
      />

      <div className="flex flex-col flex-1">
        {/* Header Row: Pillar Number & Concept Badge */}
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="font-extrabold tracking-widest text-slate-400 dark:text-slate-500 text-[11px]">
            {item.num} / 04
          </span>
          <span 
            className="px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase border transition-all"
            style={{
              backgroundColor: `${item.accentColor}15`,
              borderColor: `${item.accentColor}35`,
              color: item.accentColor
            }}
          >
            {item.badgeText}
          </span>
        </div>

        {/* Animated Graphic Preview Box */}
        <div className="w-full h-32 sm:h-34 rounded-2xl overflow-hidden mb-4 p-2 bg-[#0C0F17] border border-slate-800/80 group-hover:border-slate-700 transition-colors shadow-inner flex items-center justify-center shrink-0">
          {item.graphic}
        </div>

        {/* Title & Icon Header */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105"
            style={{ 
              backgroundColor: `${item.accentColor}20`, 
              border: `1.5px solid ${item.accentColor}60` 
            }}
          >
            <IconComp size={16} style={{ color: item.accentColor }} />
          </div>
          <h3 
            className="font-bold text-lg md:text-xl text-slate-900 dark:text-white transition-colors duration-200"
            style={{
              color: undefined
            }}
          >
            {item.name}
          </h3>
        </div>

        {/* Description & Feature tags */}
        <div 
          className="text-xs font-mono font-semibold mt-1 tracking-tight"
          style={{ color: item.accentColor }}
        >
          {item.category}
        </div>
        
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed flex-1">
          &bull; {item.tag}
        </p>
      </div>

      {/* Card Bottom CTA Bar */}
      <div className="mt-5 pt-3.5 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between">
        <span 
          className="text-xs font-bold flex items-center gap-1.5 transition-colors group-hover:opacity-90"
          style={{ color: item.accentColor }}
        >
          Launch Simulator
        </span>
        <div 
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 group-hover:translate-x-1 group-hover:scale-105"
          style={{ 
            backgroundColor: `${item.accentColor}20`,
            border: `1px solid ${item.accentColor}40`
          }}
        >
          <ArrowRight size={13} style={{ color: item.accentColor }} />
        </div>
      </div>
    </motion.div>
  );
};
