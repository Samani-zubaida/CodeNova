import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Code2, 
  Zap, 
  Layers, 
  Maximize2,
  X,
  Sparkles
} from 'lucide-react';
import VisualizerNav from '../layout/VisualizerNav';

/**
 * Universal Responsive Visualizer Shell
 * Provides a 3-Zone Architecture:
 * - Left Panel (Controls & Parameters) - Collapsible with animation
 * - Center Canvas (Visualization Animation Stage) - Smoothly expands with layout transitions
 * - Right Panel (Inspector, State, Dry Run, Logic) - Collapsible with animation
 * - Full Mobile Responsiveness with bottom drawer & quick toggles
 */
export default function ResponsiveVisualizerShell({
  title = '',
  subtitle = '',
  currentPath = '',
  category = 'ds',
  controls = null,
  playback = null,
  metrics = null,
  codeInspector = null,
  rightPanel = null,
  consoleOutput = [],
  bannerAction = null,
  headerRight = null,
  children
}) {
  // Desktop panel collapse states
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  
  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState('controls'); // 'controls' | 'inspector' | 'console'

  // Console collapse state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Check if there is content for the right panel
  const hasRightContent = Boolean(rightPanel || codeInspector || metrics);

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-[#FDFBF7] dark:bg-[#331921] text-gray-900 dark:text-[#F4EBC3] flex flex-col lg:flex-row overflow-hidden select-none font-sans">
      
      {/* ======================================================== */}
      {/* 1. DESKTOP LEFT PANEL (CONTROLS & PARAMETERS)             */}
      {/* Collapses with smooth animated slide                      */}
      {/* ======================================================== */}
      <div 
        className={`hidden lg:flex flex-col bg-white/95 dark:bg-[#423834]/95 backdrop-blur-xl border-r border-[#EBE0D3] dark:border-[#5C4E49] shadow-xl z-20 shrink-0 transition-all duration-300 ease-in-out ${
          isLeftPanelOpen 
            ? 'w-[320px] xl:w-[360px] 2xl:w-[380px] opacity-100' 
            : 'w-0 -ml-[320px] xl:-ml-[360px] 2xl:-ml-[380px] opacity-0 overflow-hidden pointer-events-none border-none'
        }`}
      >
        <div className="p-3.5 xl:p-4 flex flex-col gap-3.5 h-full overflow-y-auto">
          
          {/* Top Bar: Nav Breadcrumb + Close Button */}
          <div className="flex items-center justify-between pb-1">
            <VisualizerNav currentPath={currentPath} />
            <button
              onClick={() => setIsLeftPanelOpen(false)}
              className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#5C4E49] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-1 text-[11px] font-mono font-bold"
              title="Collapse Left Controls Panel"
            >
              <span>Hide</span>
              <ChevronLeft size={15} />
            </button>
          </div>

          {/* Algorithm Title & Header Badge */}
          <div className="pb-2 border-b border-gray-100 dark:border-[#5C4E49]">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl xl:text-2xl font-black text-gray-900 dark:text-[#F4EBC3] tracking-tight leading-tight">
                {title}
              </h1>
              {bannerAction && (
                <div className="shrink-0">{bannerAction}</div>
              )}
              {headerRight && (
                <div className="shrink-0">{headerRight}</div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-[#BCA297] mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Controls Slot */}
          {controls && (
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 flex items-center gap-1">
                <Sliders size={12} className="text-[#AB526B]" />
                <span>Operations & Parameters</span>
              </span>
              {controls}
            </div>
          )}

          {/* Playback Slot */}
          {playback && (
            <div className="flex flex-col gap-1.5 pt-1">
              {playback}
            </div>
          )}

          {/* Metrics Slot (if no right panel available) */}
          {metrics && !hasRightContent && (
            <div className="flex flex-col gap-1.5 mt-auto pt-2">
              {metrics}
            </div>
          )}

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CENTER CANVAS: MAIN VISUALIZATION STAGE               */}
      {/* Dynamically expands to fill space when panels collapse   */}
      {/* ======================================================== */}
      <div className="flex-1 w-full flex flex-col relative overflow-hidden h-full min-w-0 transition-all duration-300 ease-in-out">
        
        {/* Floating Left Panel Open Pill (Visible on desktop when Left Panel is collapsed) */}
        {!isLeftPanelOpen && (
          <motion.button
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            onClick={() => setIsLeftPanelOpen(true)}
            className="hidden lg:flex items-center gap-1.5 absolute top-3.5 left-3.5 z-40 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#423834]/90 backdrop-blur-md border border-[#EBE0D3] dark:border-[#5C4E49] shadow-md hover:bg-gray-100 dark:hover:bg-[#5C4E49] text-xs font-bold font-mono text-gray-700 dark:text-[#F0E2A4] transition-all hover:scale-105"
            title="Expand Controls Panel"
          >
            <Sliders size={13} className="text-[#AB526B]" />
            <span>Controls</span>
            <ChevronRight size={13} className="text-gray-400" />
          </motion.button>
        )}

        {/* Floating Right Panel Open Pill (Visible on desktop when Right Panel is collapsed) */}
        {hasRightContent && !isRightPanelOpen && (
          <motion.button
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            onClick={() => setIsRightPanelOpen(true)}
            className="hidden lg:flex items-center gap-1.5 absolute top-3.5 right-3.5 z-40 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#423834]/90 backdrop-blur-md border border-[#EBE0D3] dark:border-[#5C4E49] shadow-md hover:bg-gray-100 dark:hover:bg-[#5C4E49] text-xs font-bold font-mono text-gray-700 dark:text-[#F0E2A4] transition-all hover:scale-105"
            title="Expand Inspector & Logic Panel"
          >
            <ChevronLeft size={13} className="text-gray-400" />
            <Code2 size={13} className="text-purple-400" />
            <span>Inspector</span>
          </motion.button>
        )}

        {/* Fullscreen Canvas Mode Indicator (Visible when BOTH panels are collapsed) */}
        {!isLeftPanelOpen && (!hasRightContent || !isRightPanelOpen) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:flex items-center gap-2 absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-black/60 dark:bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white shadow-xl pointer-events-none select-none"
          >
            <Maximize2 size={12} className="text-emerald-400" />
            <span>CINEMATIC FULLSCREEN CANVAS</span>
          </motion.div>
        )}

        {/* Mobile Top Header Bar (Navigation & Quick Toggle Chips on Mobile) */}
        <div className="lg:hidden flex items-center justify-between p-2.5 bg-white/95 dark:bg-[#423834]/95 border-b border-[#EBE0D3] dark:border-[#5C4E49] z-20 shrink-0">
          <div className="flex items-center gap-2">
            <VisualizerNav currentPath={currentPath} />
            <span className="text-xs font-black text-gray-900 dark:text-[#F4EBC3] truncate max-w-[150px]">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setMobileActiveTab('controls'); setIsMobileDrawerOpen(true); }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-[#423834] text-[11px] font-bold text-gray-700 dark:text-[#F0E2A4] border border-gray-200 dark:border-[#5C4E49]"
            >
              <Sliders size={12} className="text-[#AB526B]" />
              <span>Controls</span>
            </button>

            {hasRightContent && (
              <button
                onClick={() => { setMobileActiveTab('inspector'); setIsMobileDrawerOpen(true); }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-[11px] font-bold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60"
              >
                <Code2 size={12} />
                <span>Inspector</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Visualization Interactive Stage (Children) */}
        <div className="flex-1 relative overflow-hidden flex flex-col w-full h-full">
          {children}
        </div>

        {/* Mobile Floating Quick Dock (Visible when drawer is closed) */}
        {playback && !isMobileDrawerOpen && (
          <div className="lg:hidden fixed bottom-3 left-3 right-3 z-30 p-2 bg-white/95 dark:bg-[#423834]/95 backdrop-blur-md rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-xl flex items-center justify-between gap-2">
            <button
              onClick={() => { setMobileActiveTab('controls'); setIsMobileDrawerOpen(true); }}
              className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-[#423834] text-xs font-bold flex items-center gap-1 text-gray-700 dark:text-[#F0E2A4] shrink-0"
            >
              <Sliders size={13} className="text-[#AB526B]" />
              <span>Controls</span>
            </button>

            <div className="flex-1 min-w-0 flex items-center justify-center overflow-x-auto">
              {playback}
            </div>

            {hasRightContent && (
              <button
                onClick={() => { setMobileActiveTab('inspector'); setIsMobileDrawerOpen(true); }}
                className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1 text-purple-700 dark:text-purple-300 shrink-0"
              >
                <Code2 size={13} />
                <span>Inspector</span>
              </button>
            )}
          </div>
        )}

        {/* Desktop Live Console Output Bar */}
        {consoleOutput && (
          <div 
            className={`hidden lg:flex w-full bg-[#331921] border-t border-white/10 flex-col shrink-0 font-mono shadow-xl z-20 transition-all duration-300 ${
              isConsoleOpen ? 'h-40' : 'h-7'
            }`}
          >
            <div
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="flex items-center justify-between px-3 py-1 bg-[#423834] border-b border-white/5 cursor-pointer hover:bg-[#1c222b] transition-colors select-none"
            >
              <div className="flex items-center gap-2">
                <Terminal size={11} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Live Console Stream
                </span>
                <span className="text-[9px] text-gray-500 font-mono">
                  ({consoleOutput.length} entries)
                </span>
              </div>
              {isConsoleOpen ? (
                <ChevronDown size={13} className="text-gray-400" />
              ) : (
                <ChevronUp size={13} className="text-gray-400" />
              )}
            </div>

            {isConsoleOpen && (
              <div className="p-2.5 overflow-y-auto flex-1 flex flex-col gap-1 text-xs text-gray-300">
                {consoleOutput.length === 0 ? (
                  <span className="text-gray-500 italic">No console logs yet.</span>
                ) : (
                  consoleOutput.map((item, i) => {
                    const text = typeof item === 'string' ? item : item.msg;
                    const isErr = typeof item === 'object' && item.isError;
                    return (
                      <div 
                        key={i} 
                        className={`truncate font-mono ${
                          isErr ? 'text-rose-400 font-bold' : text.startsWith('>') ? 'text-emerald-400 font-bold' : 'text-gray-300 pl-3'
                        }`}
                      >
                        {text}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 3. DESKTOP RIGHT PANEL (INSPECTOR, LOGIC, DRY RUN)       */}
      {/* Collapses with smooth animated slide to the right        */}
      {/* ======================================================== */}
      {hasRightContent && (
        <div 
          className={`hidden lg:flex flex-col bg-white/95 dark:bg-[#423834]/95 backdrop-blur-xl border-l border-[#EBE0D3] dark:border-[#5C4E49] shadow-xl z-20 shrink-0 transition-all duration-300 ease-in-out ${
            isRightPanelOpen 
              ? 'w-[360px] xl:w-[420px] 2xl:w-[460px] opacity-100' 
              : 'w-0 -mr-[360px] xl:-mr-[420px] 2xl:-mr-[460px] opacity-0 overflow-hidden pointer-events-none border-none'
          }`}
        >
          <div className="p-3.5 xl:p-4 flex flex-col gap-3 h-full overflow-y-auto">
            
            {/* Top Bar: Title & Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#5C4E49]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-[#F0E2A4]">
                <Code2 size={15} className="text-purple-500" />
                <span>Algorithm Inspector & State</span>
              </div>
              <button
                onClick={() => setIsRightPanelOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#5C4E49] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-1 text-[11px] font-mono font-bold"
                title="Collapse Right Inspector Panel"
              >
                <span>Hide</span>
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Content Slot: Custom rightPanel OR codeInspector + metrics */}
            <div className="flex-1 flex flex-col gap-3">
              {rightPanel ? (
                rightPanel
              ) : (
                <>
                  {metrics && (
                    <div className="flex flex-col gap-1.5">
                      {metrics}
                    </div>
                  )}
                  {codeInspector && (
                    <div className="flex flex-col gap-1.5 flex-1">
                      {codeInspector}
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MOBILE BOTTOM DRAWER (Full features on Mobile/Tablet) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            />

            {/* Bottom Drawer Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-[#423834] rounded-t-3xl border-t border-[#EBE0D3] dark:border-[#5C4E49] shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Drag Handle Bar */}
              <div className="pt-3 pb-2 flex flex-col items-center gap-2 shrink-0 border-b border-gray-100 dark:border-[#5C4E49]">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                
                {/* Mobile Drawer Tab Selector */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#423834] p-1 rounded-xl w-[92%] max-w-sm justify-between">
                  <button
                    onClick={() => setMobileActiveTab('controls')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mobileActiveTab === 'controls' 
                        ? 'bg-white dark:bg-[#5C4E49] text-[#AB526B] shadow-xs' 
                        : 'text-gray-500'
                    }`}
                  >
                    <Sliders size={13} />
                    <span>Controls</span>
                  </button>
                  
                  {hasRightContent && (
                    <button
                      onClick={() => setMobileActiveTab('inspector')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        mobileActiveTab === 'inspector' 
                          ? 'bg-white dark:bg-[#5C4E49] text-purple-600 dark:text-purple-400 shadow-xs' 
                          : 'text-gray-500'
                      }`}
                    >
                      <Code2 size={13} />
                      <span>Inspector</span>
                    </button>
                  )}

                  <button
                    onClick={() => setMobileActiveTab('console')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mobileActiveTab === 'console' 
                        ? 'bg-white dark:bg-[#5C4E49] text-[#AB526B] shadow-xs' 
                        : 'text-gray-500'
                    }`}
                  >
                    <Terminal size={13} />
                    <span>Logs</span>
                  </button>
                </div>
              </div>

              {/* Drawer Tab Content */}
              <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
                {mobileActiveTab === 'controls' && (
                  <div className="flex flex-col gap-4">
                    {controls}
                    {playback}
                  </div>
                )}

                {mobileActiveTab === 'inspector' && (
                  <div className="flex flex-col gap-3">
                    {rightPanel ? (
                      rightPanel
                    ) : (
                      <>
                        {metrics}
                        {codeInspector}
                      </>
                    )}
                  </div>
                )}

                {mobileActiveTab === 'console' && (
                  <div className="bg-[#331921] rounded-xl p-3 font-mono text-xs text-gray-300 max-h-60 overflow-y-auto flex flex-col gap-1">
                    {consoleOutput.length === 0 ? (
                      <span className="text-gray-500 italic">No output generated yet.</span>
                    ) : (
                      consoleOutput.map((item, i) => {
                        const text = typeof item === 'string' ? item : item.msg;
                        const isErr = typeof item === 'object' && item.isError;
                        return (
                          <div 
                            key={i} 
                            className={`truncate ${
                              isErr ? 'text-rose-400 font-bold' : text.startsWith('>') ? 'text-emerald-400 font-bold' : 'text-gray-300 pl-2'
                            }`}
                          >
                            {text}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Close Drawer Button */}
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="mt-2 w-full py-2.5 rounded-xl font-bold text-xs bg-gray-100 dark:bg-[#423834] text-gray-700 dark:text-[#F0E2A4] hover:bg-gray-200 transition-colors text-center shadow-xs"
                >
                  Close & View Fullscreen Canvas
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
