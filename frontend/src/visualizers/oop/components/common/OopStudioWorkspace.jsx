import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, ArrowRight, Zap, Sparkles,
  Code2, CheckCircle2, ChevronRight, Layers, Eye, Lock
} from 'lucide-react';
import useAppStore from '../../../../store/useAppStore';
import { useAuth } from '../../../../context/AuthContext';
import OopIdeCodePanel from './OopIdeCodePanel';

/**
 * OopStudioWorkspace - Professional Interactive OOP Learning Studio
 *
 * Implements the robust two-column desktop workspace architecture:
 * - Left Panel (~35-38% width):
 *   1. Concept Header & Category Badge
 *   2. Normal Mode: Orderly vertical Workflow Phase Stepper
 *   3. Smart Code Mode: Embedded Java Code Terminal (stepper hidden, editor occupies space)
 *   4. Playback Toolbar (Play/Pause, Replay, primaryAction, Show/Hide Code)
 *   5. Contextual Phase Information Section (contained strictly inside Left Panel)
 * - Right Panel (~62-65% width):
 *   1. Canvas Explorer Header & Actions
 *   2. Interactive Diagram Canvas (Independent vertical & horizontal scrolling)
 *
 * Guaranteed:
 * - Both panels fill the available workspace width without collapsing into narrow strips.
 * - Phase information stays entirely inside the left panel and never spans both columns.
 * - Switching between Normal Mode and Show Code preserves phase state, diagram visibility,
 *   and phase information visibility.
 */
export default function OopStudioWorkspace({
  // Concept metadata
  conceptName = 'OOP Concept',
  conceptSubtitle = 'Core OOP Pillar',
  conceptDesc = '',
  conceptIcon: ConceptIcon = Layers,
  conceptAccent = '#0EA5E9',

  // Workflow phases list: Array of { id, stepNumber, title, tag?, desc, accentColor?, principleInsight?, details? }
  phases = [],
  currentStepIndex = 0,
  activePhaseId = null,
  onSelectPhase,

  // Playback transport controls
  isPlaying = false,
  onTogglePlay,
  onReplay,
  onPrevPhase,
  onNextPhase,
  primaryAction, // optional { label, onClick, icon, disabled }

  // Smart Code Mode & Terminal props
  isCodeOpen = false,
  onToggleCode,
  codeFilename = 'Demo.java',
  codeLines = [],
  rawCode = '',
  activeHighlightKey = null,
  activeMemberId = null,
  activeLineNumbers = [],
  activeBadgeText = null,
  codeTabs = [],
  activeCodeTab = null,
  onSelectCodeTab,

  // Right Canvas Content
  children,

  // Optional contextual badges or next navigation
  nextConcept = null, // { label, onNext }
  canvasHeaderAction = null,
  canvasHeaderActions = null,
  canvasHeaderTitle = 'INTERACTIVE DIAGRAM EXPLORER',
  canvasHeaderBadge = null,
}) {
  const { theme } = useAppStore();
  const { isAuthenticated, requireAuth } = useAuth();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Active phase resolution
  const resolvedActivePhase = (activePhaseId && phases.find(p => p.id === activePhaseId)) ||
    phases[currentStepIndex] ||
    phases[0] ||
    { stepNumber: 1, title: 'Concept Exploration', desc: conceptDesc };

  const activeIndex = activePhaseId
    ? phases.findIndex(p => p.id === activePhaseId)
    : currentStepIndex;

  const phaseAccent = resolvedActivePhase.accentColor || conceptAccent;
  const resolvedCanvasHeaderAction = canvasHeaderAction || canvasHeaderActions;

  // Surface colors matching the Code Nova theme system
  const studioBgClass = isDark
    ? 'bg-[#080C16] text-slate-100'
    : isWarm
      ? 'bg-[#FDFBF7] text-[#2D1F23]'
      : 'bg-[#F8FAFC] text-slate-900';

  const panelSurfaceClass = isDark
    ? 'bg-[#0B0F19]/90 border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.55)]'
    : isWarm
      ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] shadow-[0_8px_30px_rgba(45,31,35,0.06)]'
      : 'bg-white/95 border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)]';

  const cardHeaderBgClass = isDark
    ? 'bg-white/[0.02] border-white/[0.06]'
    : isWarm
      ? 'bg-[#F5EFE6]/60 border-[#EBE0D3]'
      : 'bg-slate-50/80 border-slate-200/80';

  const infoSectionBgClass = isDark
    ? 'bg-[#070A12]/95 border-white/[0.08] text-slate-200'
    : isWarm
      ? 'bg-[#F7EFE4]/80 border-[#EBE0D3] text-[#2D1F23]'
      : 'bg-slate-50/90 border-slate-200 text-slate-800';

  return (
    <div className={`w-full h-full min-h-0 flex-1 flex flex-col font-sans relative ${studioBgClass} transition-colors duration-300`}>

      {/* Atmospheric Background Aurora Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-[10%] left-1/4 w-[650px] h-[350px] rounded-full blur-[160px] opacity-20 pointer-events-none"
          style={{ backgroundColor: conceptAccent }}
        />
        <div
          className="absolute bottom-[10%] right-1/4 w-[550px] h-[300px] rounded-full blur-[150px] opacity-15 pointer-events-none"
          style={{ backgroundColor: phaseAccent }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:36px_36px] opacity-60 pointer-events-none" />
      </div>

      {/* ── TWO-COLUMN WORKSPACE GRID (Left ~38% min 340px, Right ~62% min 0 1fr) ── */}
      <div className="relative z-10 w-full max-w-[1840px] mx-auto p-2.5 sm:p-3.5 lg:p-4 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(340px,38%)_minmax(0,62%)] gap-3.5 lg:gap-4.5">

        {/* ════════════════════════════════════════════════════════════════════
            LEFT PANEL: INTERACTIVE WORKFLOW STUDIO (~38% of workspace)
            Contains:
            1. Concept Header & Session Tag
            2. Swappable Stepper (Normal Mode) / Java Code Terminal (Code Mode)
            3. Playback Toolbar
            4. Contextual Phase Information Section (Contained inside this panel!)
            ════════════════════════════════════════════════════════════════════ */}
        <aside
          className={`w-full flex flex-col rounded-3xl border backdrop-blur-2xl transition-all duration-300 min-h-0 overflow-hidden lg:h-full ${panelSurfaceClass}`}
          aria-label="Workflow Studio Controls"
        >
          {/* 1. Studio Header */}
          <div className={`p-3 sm:p-3.5 border-b flex items-center justify-between gap-3 shrink-0 ${cardHeaderBgClass}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md border"
                style={{
                  backgroundColor: `${conceptAccent}18`,
                  borderColor: `${conceptAccent}40`,
                  color: conceptAccent,
                }}
              >
                <ConceptIcon size={18} />
              </div>

              <div className="min-w-0">
                <span
                  className="text-[9.5px] font-mono font-extrabold uppercase tracking-wider block truncate"
                  style={{ color: conceptAccent }}
                >
                  {conceptSubtitle}
                </span>
                <h2 className="text-sm sm:text-base font-black tracking-tight truncate">
                  {conceptName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Studio
              </span>
            </div>
          </div>

          {/* 2. Middle Region: Swapped between Normal Mode & Smart Code Mode */}
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
            {!isCodeOpen ? (
              /* ── NORMAL MODE: WORKFLOW PHASE SELECTOR ── */
              <div className="flex-1 overflow-y-auto [scrollbar-width:thin] p-2.5 sm:p-3 space-y-1.5 min-h-[140px]">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1 px-1">
                  <span>WORKFLOW PHASES</span>
                  <span>{activeIndex + 1} / {phases.length}</span>
                </div>

                <div className="space-y-1.5 relative">
                  {phases.map((phase, idx) => {
                    const isCompleted = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    const isUpcoming = idx > activeIndex;
                    const stepNum = phase.stepNumber || idx + 1;
                    const pAccent = phase.accentColor || conceptAccent;

                    return (
                      <button
                        key={phase.id || idx}
                        type="button"
                        onClick={() => {
                          if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) return;
                          onSelectPhase && onSelectPhase(phase.id, idx);
                        }}
                        className={`w-full text-left p-2.5 rounded-2xl border font-mono transition-all duration-200 cursor-pointer relative group flex items-start gap-2.5 ${
                          isActive
                            ? isDark
                              ? 'bg-white/[0.08] border-white/20 shadow-md'
                              : isWarm
                                ? 'bg-white border-[#D9CAB9] shadow-sm'
                                : 'bg-white border-slate-300 shadow-md'
                            : isCompleted
                              ? isDark
                                ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] text-slate-300'
                                : 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-100/70 text-slate-700'
                              : isDark
                                ? 'bg-transparent border-transparent hover:bg-white/[0.02] text-slate-400 opacity-75'
                                : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-500 opacity-75'
                        }`}
                        style={{
                          borderLeftWidth: isActive ? '4px' : '1px',
                          borderLeftColor: isActive ? pAccent : undefined,
                        }}
                      >
                        {/* Phase Number / Completion Indicator */}
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-mono font-black transition-all ${
                            isActive
                              ? 'text-white shadow-sm'
                              : isCompleted
                                ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                                : isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'
                          }`}
                          style={{
                            backgroundColor: isActive ? pAccent : undefined,
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={12} /> : (stepNum < 10 ? `0${stepNum}` : stepNum)}
                        </div>

                        {/* Phase Title & Tag */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className={`text-xs font-bold truncate ${isActive ? (isDark ? 'text-white' : 'text-slate-900') : ''}`}>
                              {phase.title}
                            </span>
                            {phase.tag && (
                              <span
                                className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider shrink-0 border ${
                                  isActive
                                    ? isDark ? 'bg-white/10 text-slate-200 border-white/20' : 'bg-slate-100 text-slate-800 border-slate-300'
                                    : isDark ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                              >
                                {phase.tag}
                              </span>
                            )}
                          </div>
                          <p className={`text-[10.5px] leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {phase.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ── SMART CODE MODE: EMBEDDED JAVA CODE TERMINAL ── */
              <div className="flex-1 flex flex-col min-h-[220px] overflow-hidden p-2">
                <OopIdeCodePanel
                  filename={codeFilename}
                  codeLines={codeLines}
                  rawCode={rawCode}
                  activeHighlightKey={activeHighlightKey}
                  activeMemberId={activeMemberId}
                  activeLineNumbers={activeLineNumbers}
                  activeBadgeText={activeBadgeText}
                  tabs={codeTabs}
                  activeTab={activeCodeTab}
                  onSelectTab={onSelectCodeTab}
                  isOpen={true}
                  onToggleOpen={onToggleCode}
                  maxHeight="100%"
                  accentColor={conceptAccent}
                  className="h-full flex flex-col"
                />
              </div>
            )}
          </div>

          {/* 3. Left Panel Playback & Code Toolbar (Always visible right above the phase info section) */}
          <div className={`px-3 py-2 border-t flex flex-wrap items-center justify-between gap-2 shrink-0 ${cardHeaderBgClass}`}>
            {/* Playback Transport Controls */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {onTogglePlay && (
                <button
                  type="button"
                  id="oop-workflow-play-btn"
                  onClick={() => {
                    if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) return;
                    onTogglePlay();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                    !isAuthenticated ? 'ring-1 ring-white/30 opacity-90' : ''
                  }`}
                  style={{ backgroundColor: conceptAccent }}
                  title={!isAuthenticated ? 'Please log in first to access this feature.' : isPlaying ? 'Pause Workflow' : 'Play Workflow'}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {!isAuthenticated ? (
                    <>
                      <Lock size={12} />
                      <span>Play Flow</span>
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause size={12} />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} />
                      <span>Play Flow</span>
                    </>
                  )}
                </button>
              )}

              {onReplay && (
                <button
                  type="button"
                  id="oop-workflow-replay-btn"
                  onClick={() => {
                    if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) return;
                    onReplay();
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                      : isWarm
                        ? 'bg-black/[0.03] hover:bg-black/[0.06] text-[#2D1F23] border-[#EBE0D3]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                  title={!isAuthenticated ? 'Please log in first to access this feature.' : "Replay from Step 1"}
                  aria-label="Replay"
                >
                  {!isAuthenticated ? (
                    <Lock size={12} style={{ color: conceptAccent }} />
                  ) : (
                    <RotateCcw size={12} style={{ color: conceptAccent }} />
                  )}
                  <span className="hidden sm:inline">Replay</span>
                </button>
              )}

              {primaryAction && (
                <button
                  type="button"
                  onClick={() => {
                    if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) return;
                    primaryAction.onClick?.();
                  }}
                  disabled={primaryAction.disabled}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-md cursor-pointer border ${
                    isDark
                      ? 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                      : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
                  }`}
                  style={{ borderColor: `${conceptAccent}60` }}
                  title={!isAuthenticated ? 'Please log in first to access this feature.' : primaryAction.label}
                >
                  {!isAuthenticated ? <Lock size={12} style={{ color: conceptAccent }} /> : (primaryAction.icon || <Zap size={12} style={{ color: conceptAccent }} />)}
                  <span>{primaryAction.label}</span>
                </button>
              )}
            </div>

            {/* Smart Code Mode Toggle */}
            {onToggleCode && (
              <button
                type="button"
                onClick={onToggleCode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                  isCodeOpen
                    ? isDark
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'bg-sky-500 text-white border-sky-600 shadow-md'
                    : isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
                title={isCodeOpen ? 'Hide Java Code Terminal' : 'Show Java Code Terminal'}
              >
                <Code2 size={13} className={isCodeOpen ? (isDark ? 'text-sky-400' : 'text-white') : 'text-slate-400'} />
                <span>{isCodeOpen ? 'Hide Code' : 'Show Code'}</span>
              </button>
            )}
          </div>

          {/* 4. CONTEXTUAL PHASE INFORMATION SECTION (Contained entirely within the Left Panel!) */}
          <div
            className={`p-3 sm:p-3.5 border-t shrink-0 flex flex-col gap-2 overflow-y-auto max-h-[220px] lg:max-h-[260px] [scrollbar-width:thin] ${infoSectionBgClass}`}
            aria-label="Phase Explanation & OOP Insights"
          >
            {/* Header: Phase Number & Title & Tag */}
            <div className={`flex items-center justify-between gap-2 pb-1.5 border-b ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider border shrink-0"
                  style={{
                    backgroundColor: `${phaseAccent}18`,
                    borderColor: `${phaseAccent}40`,
                    color: isDark ? phaseAccent : '#0F172A',
                  }}
                >
                  PHASE {resolvedActivePhase.stepNumber || activeIndex + 1}
                </span>
                <h3 className="text-xs font-black tracking-tight truncate">
                  {resolvedActivePhase.title}
                </h3>
              </div>

              {resolvedActivePhase.tag && (
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border ${
                    isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {resolvedActivePhase.tag}
                </span>
              )}
            </div>

            {/* Concise Explanation Body */}
            <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {resolvedActivePhase.desc}
            </p>

            {/* OOP Principle Insight */}
            {resolvedActivePhase.principleInsight && (
              <div
                className={`p-2 rounded-xl border text-[10.5px] font-mono leading-relaxed transition-colors ${
                  isDark
                    ? 'bg-white/[0.03] border-white/10 text-slate-300'
                    : isWarm
                      ? 'bg-black/[0.02] border-[#EBE0D3] text-[#2D1F23]'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5" style={{ color: phaseAccent }}>
                  <Sparkles size={11} />
                  <span className="text-[9.5px] uppercase tracking-wider">OOP PRINCIPLE INSIGHT</span>
                </div>
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {resolvedActivePhase.principleInsight}
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT PANEL: INTERACTIVE VISUALIZATION CANVAS (~62% of workspace)
            Contains:
            1. Explorer Header with action buttons & next concept link
            2. Full-bleed, independently scrollable canvas (vertical & horizontal)
            ════════════════════════════════════════════════════════════════════ */}
        <main
          className={`w-full flex flex-col rounded-3xl border backdrop-blur-2xl transition-all duration-300 min-h-0 overflow-hidden lg:h-full ${panelSurfaceClass}`}
          aria-label="Interactive Diagram Canvas"
        >
          {/* Right Canvas Header / Legend Bar */}
          <div className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono shrink-0 ${cardHeaderBgClass}`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
              <span className={`font-bold tracking-wider uppercase text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {canvasHeaderTitle}
              </span>
              {canvasHeaderBadge && (
                <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  {canvasHeaderBadge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {resolvedCanvasHeaderAction}
              {nextConcept && (
                <button
                  type="button"
                  onClick={nextConcept.onNext}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                  title={nextConcept.label}
                >
                  <span>{nextConcept.label}</span>
                  <ArrowRight size={12} style={{ color: conceptAccent }} />
                </button>
              )}
            </div>
          </div>

          {/* Independently Scrollable Diagram Canvas (Vertical & Horizontal Scrolling) */}
          <div className="w-full flex-1 min-h-0 overflow-y-auto overflow-x-auto [scrollbar-width:thin] [overscroll-behavior:contain] p-3 sm:p-5 lg:p-6 flex flex-col items-center justify-center">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}
