import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import useAppStore from '../../../../store/useAppStore';

/**
 * OopConceptInfoPanel - Merged Top-Left Concept & Active Phase Information HUD
 * Combines:
 * 1. Concept icon and name
 * 2. Short concept description
 * 3. Current workflow phase and status badge
 * 4. In-depth explanation of the active phase
 * 5. Relevant supporting principles, insights, or formulas
 * 
 * Compact, highly legible, viewport-aware, and dynamically synced with the active workflow phase.
 */
export default function OopConceptInfoPanel({
  conceptName,
  conceptIcon: IconComponent,
  conceptDesc,
  conceptAccent = '#AB526B',
  
  // Active workflow phase details
  activePhase, // { id, stepNumber, title, tag, desc, accentColor?, principleInsight? }
  totalSteps = 4,
  currentStepNumber = 1,
  
  // Optional collapsible toggle for ultra-small screens
  className = '',
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const [isExpanded, setIsExpanded] = useState(true);

  const phaseAccent = activePhase?.accentColor || conceptAccent;
  const stepNum = activePhase?.stepNumber || currentStepNumber;

  // Surface classes
  const panelBgClass = isDark
    ? 'bg-[#0B0F17]/90 border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.65)] text-slate-200'
    : isWarm
    ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] shadow-[0_8px_24px_rgba(45,31,35,0.08)] text-[#2D1F23]'
    : 'bg-white/95 border-slate-200/90 shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-slate-800';

  const calloutBgClass = isDark
    ? 'bg-white/[0.03] border-white/10 text-slate-300'
    : isWarm
    ? 'bg-black/[0.02] border-[#EBE0D3] text-[#2D1F23]'
    : 'bg-slate-50 border-slate-200/80 text-slate-700';

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`rounded-2xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden ${panelBgClass} ${className}`}
      style={{
        borderLeftWidth: '3.5px',
        borderLeftColor: phaseAccent
      }}
      aria-label={`${conceptName} Concept Guide and Phase Status`}
    >
      {/* ── 1. CONCEPT HEADER (ICON, NAME & TOGGLE) ── */}
      <div className="p-3 sm:p-3.5 pb-2 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div 
            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs border"
            style={{
              backgroundColor: `${conceptAccent}18`,
              borderColor: `${conceptAccent}35`,
              color: conceptAccent
            }}
          >
            {IconComponent ? <IconComponent size={14} /> : <Sparkles size={14} />}
          </div>

          <div className="min-w-0">
            <span className={`text-[10px] font-mono font-bold tracking-widest uppercase block leading-none ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              OOP Pillar
            </span>
            <h2 className={`text-xs sm:text-sm font-black tracking-tight uppercase truncate ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {conceptName}
            </h2>
          </div>
        </div>

        {/* Mobile / Compact Collapsible Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="lg:hidden p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
          title={isExpanded ? 'Collapse guide' : 'Expand guide'}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 sm:px-3.5 pb-3 sm:pb-3.5 space-y-2.5 max-h-[340px] sm:max-h-[380px] overflow-y-auto [scrollbar-width:thin]"
          >
            {/* ── 2. SHORT CONCEPT DESCRIPTION ── */}
            {conceptDesc && (
              <p className={`text-[11px] sm:text-xs leading-relaxed font-sans ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {conceptDesc}
              </p>
            )}

            {/* Specular Divider */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

            {/* ── 3. CURRENT WORKFLOW PHASE & STATUS ── */}
            <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
              <span className={`font-bold tracking-wider uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                PHASE {stepNum} / {totalSteps}
              </span>

              {activePhase?.tag && (
                <span 
                  className="px-2 py-0.5 rounded-full font-bold tracking-wide uppercase border text-[9.5px]"
                  style={{
                    backgroundColor: `${phaseAccent}18`,
                    borderColor: `${phaseAccent}40`,
                    color: isDark ? phaseAccent : '#0F172A'
                  }}
                >
                  {activePhase.tag}
                </span>
              )}
            </div>

            {/* ── 4. EXPLANATION OF THE ACTIVE PHASE ── */}
            <div className="space-y-1">
              <h3 className={`text-xs font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {activePhase?.title?.replace(/^[0-9]+\.\s*/, '') || 'Phase Active'}
              </h3>
              
              <p className={`text-[11px] leading-relaxed font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {activePhase?.desc}
              </p>
            </div>

            {/* ── 5. RELEVANT SUPPORTING PRINCIPLE INSIGHT ── */}
            {activePhase?.principleInsight && (
              <div className={`p-2 sm:p-2.5 rounded-xl border text-[10.5px] font-mono leading-snug flex items-start gap-1.5 ${calloutBgClass}`}>
                <Info size={13} className="shrink-0 mt-0.5 text-amber-500" />
                <span className="flex-1">{activePhase.principleInsight}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
