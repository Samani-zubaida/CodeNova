import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, ChevronDown, Lock, Shield, GitFork, RefreshCw, 
  Sparkles, X 
} from 'lucide-react';
import useAppStore from '../../../../store/useAppStore';

/**
 * Compact OOP Information Widget
 * Floats unobtrusively in the upper-left of the /oop page.
 * Provides accessible hover, click, and keyboard popover detailing OOP and its 4 core pillars.
 */
export default function OopInfoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const closeTimerRef = useRef(null);
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Handle outside clicks to close popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard Escape to dismiss
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const PILLARS_INFO = [
    {
      name: 'Encapsulation',
      icon: Lock,
      accent: '#F43F5E',
      badgeBg: 'bg-rose-500/15 text-rose-500 border-rose-500/25',
      summary: 'Bundles data and methods together while controlling access to internal state.'
    },
    {
      name: 'Abstraction',
      icon: Shield,
      accent: '#10B981',
      badgeBg: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25',
      summary: 'Hides implementation complexity and exposes only essential functionality.'
    },
    {
      name: 'Inheritance',
      icon: GitFork,
      accent: '#38BDF8',
      badgeBg: 'bg-sky-500/15 text-sky-500 border-sky-500/25',
      summary: 'Allows classes to derive properties and behavior from existing classes.'
    },
    {
      name: 'Polymorphism',
      icon: RefreshCw,
      accent: '#F59E0B',
      badgeBg: 'bg-amber-500/15 text-amber-500 border-amber-500/25',
      summary: 'Allows a common interface or method call to produce different behavior depending on the object.'
    }
  ];

  return (
    <div 
      className="relative inline-block z-30"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Pill */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 backdrop-blur-md border shadow-xs select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#AB526B] ${
          isOpen
            ? isDark
              ? 'bg-slate-800 text-white border-white/20 shadow-md ring-1 ring-white/10'
              : 'bg-white text-slate-900 border-slate-300 shadow-md ring-1 ring-black/5'
            : isDark
            ? 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 hover:text-white border-white/10 hover:border-white/20'
            : isWarm
            ? 'bg-[#FAF7F2]/90 hover:bg-[#FAF7F2] text-[#2D1F23]/80 hover:text-[#2D1F23] border-[#EBE0D3] hover:border-slate-300'
            : 'bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-[#AB526B]/15 text-[#AB526B] dark:text-rose-400 flex items-center justify-center shrink-0">
          <Info size={12} className="stroke-[2.5]" />
        </span>
        
        <span className="font-bold tracking-tight">OOP Guide</span>
        
        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border hidden sm:inline-block ${
          isDark 
            ? 'bg-white/5 border-white/10 text-slate-400 group-hover:text-slate-300' 
            : 'bg-slate-100 border-slate-200 text-slate-500'
        }`}>
          4 Pillars
        </span>

        <ChevronDown 
          size={12} 
          className={`transition-transform duration-200 opacity-60 group-hover:opacity-100 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Polished Glass Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            role="dialog"
            aria-label="Object-Oriented Programming Guide"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute top-full left-0 mt-2 w-[340px] sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl p-4 sm:p-5 border shadow-2xl backdrop-blur-2xl z-50 text-left ${
              isDark
                ? 'bg-[#0E131F]/95 border-white/15 text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
                : isWarm
                ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] text-[#2D1F23] shadow-[0_20px_40px_rgba(45,31,35,0.12)]'
                : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)]'
            }`}
          >
            {/* Popover Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#AB526B] to-[#F43F5E] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h4 className={`text-sm font-black tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Object-Oriented Programming
                  </h4>
                  <span className="text-[10px] font-mono font-semibold tracking-wide uppercase text-[#AB526B] dark:text-rose-400">
                    Core Architectural Paradigm
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close guide"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Concise Definition */}
            <p className={`text-xs mt-3 leading-relaxed font-normal ${
              isDark ? 'text-slate-300' : isWarm ? 'text-[#2D1F23]/80' : 'text-slate-600'
            }`}>
              OOP organizes software around modular <strong>objects</strong> containing both data (state) and behavior (methods), promoting maintainable, reusable, and secure system design.
            </p>

            {/* The 4 Pillars Breakdown */}
            <div className="mt-3.5 space-y-2.5">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 block">
                The 4 Pillars at a Glance
              </span>

              {PILLARS_INFO.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div 
                    key={pillar.name}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isDark 
                        ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]' 
                        : 'bg-slate-50/80 border-slate-200/60 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${pillar.accent}15`,
                          borderColor: `${pillar.accent}30`,
                          color: pillar.accent
                        }}
                      >
                        <Icon size={11} />
                      </div>
                      <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {pillar.name}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed pl-7 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {pillar.summary}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Interactive Footer Callout */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                Tip: Click any card below to launch its simulator
              </span>
              <span className="text-[10px] font-bold text-[#AB526B] dark:text-rose-400">
                Live Labs
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
