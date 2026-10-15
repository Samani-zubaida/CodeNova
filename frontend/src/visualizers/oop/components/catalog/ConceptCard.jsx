import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * ConceptCard - Displays each OOP Pillar in the 4-cards catalog grid
 */
export const ConceptCard = ({ item, index = 0, onEnter }) => {
  const IconComp = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.3 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onEnter(item.id)}
      className={`group cursor-pointer rounded-3xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 backdrop-blur-xl
        bg-white/80 dark:bg-slate-900/70 border border-slate-200/90 dark:border-white/10 ${item.borderHover}
        shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:shadow-2xl`}
    >
      {/* Subtle Top Ambient Glow Accent */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[45px] pointer-events-none opacity-20 group-hover:opacity-45 transition-opacity"
        style={{ backgroundColor: item.accentColor }}
      />

      <div>
        {/* Header Row: Pillar Number & Concept Badge */}
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="font-extrabold tracking-widest text-slate-400 dark:text-slate-500">
            {item.num} / 04
          </span>
          <span 
            className="px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase border"
            style={{
              backgroundColor: `${item.accentColor}15`,
              borderColor: `${item.accentColor}40`,
              color: item.accentColor
            }}
          >
            {item.badgeText}
          </span>
        </div>

        {/* Animated Graphic Preview Box */}
        <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden mb-4 p-2 bg-[#0C0F17] border border-slate-700/50 group-hover:border-slate-500/80 transition-colors shadow-inner flex items-center justify-center">
          {item.graphic}
        </div>

        {/* Title & Icon Header */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110"
            style={{ 
              backgroundColor: `${item.accentColor}25`, 
              border: `1.5px solid ${item.accentColor}70` 
            }}
          >
            <IconComp size={16} style={{ color: item.accentColor }} />
          </div>
          <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white group-hover:text-rose-500 dark:group-hover:text-[#FAF7F2] transition-colors">
            {item.name}
          </h3>
        </div>

        {/* Description & Feature tags */}
        <div 
          className="text-xs font-mono font-semibold mt-1"
          style={{ color: item.accentColor }}
        >
          {item.category}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
          &bull; {item.tag}
        </div>
      </div>

      {/* Card Bottom CTA Bar */}
      <div className="mt-6 pt-3.5 border-t border-slate-200/70 dark:border-white/10 flex items-center justify-between">
        <span 
          className="text-xs font-bold flex items-center gap-1.5 transition-colors group-hover:underline"
          style={{ color: item.accentColor }}
        >
          Launch Simulator
        </span>
        <div 
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1"
          style={{ backgroundColor: `${item.accentColor}20` }}
        >
          <ArrowRight size={14} style={{ color: item.accentColor }} />
        </div>
      </div>
    </motion.div>
  );
};
