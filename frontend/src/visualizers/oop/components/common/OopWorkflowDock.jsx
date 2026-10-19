import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, ArrowRight, Check, Zap, Sparkles, Info, Lock
} from 'lucide-react';
import useAppStore from '../../../../store/useAppStore';
import { useAuth } from '../../../../context/AuthContext';

/**
 * OopWorkflowDock - Premium Unified Workflow Phase & Explanation Component
 * Used across all OOP Concept routes (/oop/encapsulation, /oop/abstraction,
 * /oop/inheritance, /oop/polymorphism) to present step-by-step phases,
 * rich multi-color state indicators, and high-contrast pedagogical explanations.
 */
export default function OopWorkflowDock({
  // Phase sequence: Array of { id, stepNumber, title, tag, desc, accentColor, icon? }
  phases = [],
  activePhaseId,
  currentStepIndex = 0,
  onSelectPhase,

  // Dedicated explanation details for active phase
  activeExplanation,

  // Playback transport controls (optional)
  isPlaying,
  onTogglePlay,
  onReplay,
  playbackSpeed,
  onChangePlaybackSpeed,

  // Custom primary action (e.g. "Send getData() Request", "Transmit Traits")
  primaryAction,

  // Secondary actions (e.g. code modal button)
  secondaryAction,

  // Navigation to next concept
  onNext,
  nextLabel = 'Next Concept',
  conceptAccent = '#AB526B',
}) {
  const { theme } = useAppStore();
  const { isAuthenticated, requireAuth } = useAuth();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const handleTogglePlay = () => {
    if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) {
      return;
    }
    if (onTogglePlay) onTogglePlay();
  };

  const handleReplay = () => {
    if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) {
      return;
    }
    if (onReplay) onReplay();
  };

  const handlePrimaryAction = () => {
    if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) {
      return;
    }
    if (primaryAction?.onClick) primaryAction.onClick();
  };

  const handleSelectPhase = (id, idx) => {
    if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) {
      return;
    }
    if (onSelectPhase) onSelectPhase(id, idx);
  };

  // Determine active phase object
  const activePhase = (activePhaseId && phases.find(p => p.id === activePhaseId)) ||
    (phases[currentStepIndex] || phases[0]);

  const explanation = activeExplanation || (activePhase ? {
    title: activePhase.title,
    tag: activePhase.tag,
    desc: activePhase.desc,
    accentColor: activePhase.accentColor || conceptAccent,
    principleInsight: activePhase.principleInsight
  } : null);

  // Surface styles
  const dockBgClass = isDark
    ? 'bg-[#080C16]/95 border-white/[0.08] shadow-[0_-12px_40px_rgba(0,0,0,0.7)] text-slate-100'
    : isWarm
    ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] shadow-[0_-8px_30px_rgba(45,31,35,0.08)] text-[#2D1F23]'
    : 'bg-white/95 border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] text-slate-800';

  const explanationBgClass = isDark
    ? 'bg-[#0E1424]/90 border-white/[0.08] text-slate-200 shadow-xl'
    : isWarm
    ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] text-[#2D1F23] shadow-md'
    : 'bg-white border-slate-200/90 text-slate-800 shadow-md';

  return (
    <div className={`w-full max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-300 shrink-0 z-30 ${dockBgClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        
        {/* Left Controls: Transport & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Play/Pause (if supported) */}
          {onTogglePlay && (
            <button
              type="button"
              id="oop-workflow-play-btn"
              onClick={handleTogglePlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                !isAuthenticated ? 'ring-1 ring-white/30 opacity-90' : ''
              }`}
              style={{
                backgroundColor: conceptAccent
              }}
              title={!isAuthenticated ? 'Please log in first to access this feature.' : isPlaying ? 'Pause animation' : 'Play animation'}
              aria-label={isPlaying ? 'Pause workflow' : 'Play workflow'}
            >
              {!isAuthenticated ? (
                <>
                  <Lock size={12} />
                  <span className="hidden sm:inline">Play Flow</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause size={12} />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play size={12} />
                  <span className="hidden sm:inline">Play Flow</span>
                </>
              )}
            </button>
          )}

          {/* Replay Button */}
          {onReplay && (
            <button
              type="button"
              onClick={handleReplay}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10' 
                  : isWarm
                  ? 'bg-black/[0.03] hover:bg-black/[0.06] text-[#2D1F23] border-[#EBE0D3]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
              title={!isAuthenticated ? 'Please log in first to access this feature.' : "Replay from Step 1"}
              aria-label="Replay workflow"
            >
              <RotateCcw size={12} style={{ color: conceptAccent }} />
              <span>Replay</span>
            </button>
          )}

          {/* Primary Interactive Trigger (e.g. Send getData, Transmit Traits) */}
          {primaryAction && (
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={primaryAction.disabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-md cursor-pointer border ${
                isDark
                  ? 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                  : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
              }`}
              style={{
                borderColor: `${conceptAccent}50`
              }}
              title={!isAuthenticated ? 'Please log in first to access this feature.' : primaryAction.label}
              aria-label={primaryAction.label}
            >
              {!isAuthenticated ? <Lock size={12} style={{ color: conceptAccent }} /> : (primaryAction.icon || <Zap size={12} style={{ color: conceptAccent }} />)}
              <span>{primaryAction.label}</span>
            </button>
          )}

          {/* Playback Speed Selector (if supported) */}
          {onChangePlaybackSpeed && (
            <div className={`hidden md:flex items-center p-0.5 rounded-lg border text-[10.5px] font-mono ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}>
              {[1, 1.5, 2].map(speed => (
                <button
                  type="button"
                  key={speed}
                  onClick={() => onChangePlaybackSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`${speed}x speed`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Phase Sequence Indicators */}
        {phases.length > 0 && (
          <div 
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full py-0.5 [scrollbar-width:none]"
            role="navigation"
            aria-label="Workflow Phases"
          >
            {phases.map((st, idx) => {
              const isActive = (activePhaseId && st.id === activePhaseId) ||
                (!activePhaseId && currentStepIndex === idx);
              const isCompleted = currentStepIndex > idx;
              const phaseColor = st.accentColor || conceptAccent;

              return (
                <div key={st.id} className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelectPhase(st.id, idx)}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`Step ${idx + 1}: ${st.title}`}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer select-none border ${
                      isActive
                        ? isDark
                          ? 'text-white font-black shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105'
                          : 'text-white font-black shadow-md scale-105'
                        : isCompleted
                        ? isDark
                          ? 'bg-white/[0.06] text-slate-200 border-white/15 hover:bg-white/10 font-bold'
                          : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 font-bold'
                        : isDark
                        ? 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-white hover:bg-white/[0.07] font-medium'
                        : isWarm
                        ? 'bg-black/[0.03] text-[#2D1F23]/80 border-[#EBE0D3] hover:text-[#2D1F23] hover:bg-black/[0.06] font-medium'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:text-slate-900 hover:bg-slate-100 font-medium'
                    }`}
                    style={{
                      backgroundColor: isActive ? phaseColor : undefined,
                      borderColor: isActive ? '#FFFFFF50' : undefined
                    }}
                  >
                    {/* Step Status Indicator Icon/Number */}
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-500 font-black'
                        : isDark
                        ? 'bg-white/10 text-slate-400'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isCompleted ? <Check size={10} className="stroke-[3]" /> : (st.stepNumber || idx + 1)}
                    </span>

                    <span className="whitespace-nowrap font-sans font-bold text-[11px] sm:text-xs">
                      {st.title.split(':')[0]}
                    </span>
                  </button>

                  {/* Progress Connector Line (between steps) */}
                  {idx < phases.length - 1 && (
                    <div className={`w-2 sm:w-3 h-[2px] mx-0.5 rounded-full transition-colors ${
                      isCompleted 
                        ? 'bg-emerald-500/60' 
                        : isDark 
                        ? 'bg-white/10' 
                        : 'bg-slate-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Right Controls: Secondary Action & Next Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          {secondaryAction}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              style={{
                backgroundColor: conceptAccent
              }}
              aria-label={nextLabel}
            >
              <span>{nextLabel}</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
