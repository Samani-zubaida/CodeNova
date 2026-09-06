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
  Maximize2 
} from 'lucide-react';
import VisualizerNav from '../layout/VisualizerNav';

/**
 * Universal Responsive Shell for all visualizer pages.
 * Handles desktop split-screen and mobile-first bottom-drawer architecture.
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
  consoleOutput = [],
  children
}) {
  // Desktop sidebar collapse state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState('controls'); // 'controls' | 'code' | 'console'

  // Console collapse state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-[#FDFBF7] dark:bg-[#0E0E0E] text-gray-900 dark:text-gray-100 flex flex-col lg:flex-row overflow-hidden select-none font-sans">
      
      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR (lg:flex)                                 */}
      {/* ======================================================== */}
      <div 
        className={`hidden lg:flex flex-col bg-white/95 dark:bg-[#141414]/95 backdrop-blur-xl border-r border-[#EBE0D3] dark:border-[#262626] shadow-xl z-20 shrink-0 transition-all duration-300 ${
          isSidebarOpen ? 'w-[360px] xl:w-[400px]' : 'w-0 -ml-[360px] xl:-ml-[400px] overflow-hidden border-none'
        }`}
      >
        <div className="p-4 xl:p-5 flex flex-col gap-4 h-full overflow-y-auto">
          {/* Navigation Bar */}
          <VisualizerNav currentPath={currentPath} />

          {/* Header */}
          <div className="pb-1 border-b border-gray-100 dark:border-[#222]">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Controls Slot */}
          {controls && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">
                Operations & Inputs
              </span>
              {controls}
            </div>
          )}

          {/* Playback Slot */}
          {playback && (
            <div className="flex flex-col gap-1.5">
              {playback}
            </div>
          )}

          {/* Metrics Slot */}
          {metrics && (
            <div className="flex flex-col gap-1.5">
              {metrics}
            </div>
          )}

          {/* Code Inspector Slot */}
          {codeInspector && (
            <div className="flex flex-col gap-1.5 mt-auto pt-2">
              {codeInspector}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT CANVAS: MAIN VISUALIZATION & CONSOLE               */}
      {/* ======================================================== */}
      <div className="flex-1 w-full flex flex-col relative overflow-hidden h-full">
        
        {/* Desktop Sidebar Toggle Floating Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? 'Collapse Controls' : 'Expand Controls'}
          className="hidden lg:flex absolute top-4 left-4 z-40 p-2 rounded-xl bg-white/90 dark:bg-[#1C1C1C]/90 backdrop-blur-md border border-[#EBE0D3] dark:border-[#333] shadow-md hover:bg-gray-100 dark:hover:bg-[#252525] transition-all"
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Mobile Header Bar (Navigation & Title on Mobile) */}
        <div className="lg:hidden flex items-center justify-between p-3 bg-white/95 dark:bg-[#161616]/95 border-b border-[#EBE0D3] dark:border-[#262626] z-20 shrink-0">
          <div className="flex items-center gap-2">
            <VisualizerNav currentPath={currentPath} />
          </div>
          <div className="font-bold text-sm truncate text-gray-900 dark:text-white max-w-[140px] sm:max-w-[200px]">
            {title}
          </div>
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-[#BC4A54] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-transform"
          >
            <Sliders size={13} />
            <span>Controls</span>
          </button>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-auto flex items-center justify-center p-4 md:p-8">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#BC4A54]/5 dark:bg-[#BC4A54]/10 rounded-full blur-[120px] pointer-events-none" />
          
          {children}
        </div>

        {/* Mobile Floating Quick Playback Bar (Visible when drawer is closed) */}
        {playback && !isMobileDrawerOpen && (
          <div className="lg:hidden p-3 bg-white/95 dark:bg-[#141414]/95 border-t border-[#EBE0D3] dark:border-[#262626] shadow-lg shrink-0">
            {playback}
          </div>
        )}

        {/* Desktop Console Output Bar */}
        {consoleOutput && (
          <div 
            className={`hidden lg:flex w-full bg-[#0F1117] border-t border-white/10 flex-col shrink-0 font-mono shadow-xl z-20 transition-all duration-300 ${
              isConsoleOpen ? 'h-44' : 'h-8'
            }`}
          >
            <div
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-b border-white/5 cursor-pointer hover:bg-[#1c222b] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-emerald-400" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Live Console Stream
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  ({consoleOutput.length} entries)
                </span>
              </div>
              {isConsoleOpen ? (
                <ChevronDown size={14} className="text-gray-400" />
              ) : (
                <ChevronUp size={14} className="text-gray-400" />
              )}
            </div>

            {isConsoleOpen && (
              <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-1 text-xs text-gray-300">
                {consoleOutput.length === 0 ? (
                  <span className="text-gray-500 italic">No console logs yet.</span>
                ) : (
                  consoleOutput.map((item, i) => {
                    const text = typeof item === 'string' ? item : item.msg;
                    const isErr = typeof item === 'object' && item.isError;
                    return (
                      <div 
                        key={i} 
                        className={`truncate ${
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
      {/* MOBILE BOTTOM DRAWER (Full features on Mobile / Tablet)   */}
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
              className="lg:hidden fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-[#161616] rounded-t-3xl border-t border-[#EBE0D3] dark:border-[#333] shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Drag Handle Bar */}
              <div className="pt-3 pb-2 flex flex-col items-center gap-2 shrink-0 border-b border-gray-100 dark:border-[#222]">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                
                {/* Mobile Drawer Tab Selector */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#222] p-1 rounded-xl w-[90%] max-w-sm justify-between">
                  <button
                    onClick={() => setMobileActiveTab('controls')}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mobileActiveTab === 'controls' 
                        ? 'bg-white dark:bg-[#333] text-[#BC4A54] shadow-xs' 
                        : 'text-gray-500'
                    }`}
                  >
                    <Sliders size={13} />
                    <span>Controls</span>
                  </button>
                  
                  <button
                    onClick={() => setMobileActiveTab('code')}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mobileActiveTab === 'code' 
                        ? 'bg-white dark:bg-[#333] text-[#BC4A54] shadow-xs' 
                        : 'text-gray-500'
                    }`}
                  >
                    <Code2 size={13} />
                    <span>Logic</span>
                  </button>

                  <button
                    onClick={() => setMobileActiveTab('console')}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mobileActiveTab === 'console' 
                        ? 'bg-white dark:bg-[#333] text-[#BC4A54] shadow-xs' 
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
                    {metrics}
                  </div>
                )}

                {mobileActiveTab === 'code' && (
                  <div className="flex flex-col gap-3">
                    {metrics}
                    {codeInspector}
                  </div>
                )}

                {mobileActiveTab === 'console' && (
                  <div className="bg-[#0F1117] rounded-xl p-3 font-mono text-xs text-gray-300 max-h-60 overflow-y-auto flex flex-col gap-1">
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
                  className="mt-2 w-full py-2.5 rounded-xl font-bold text-xs bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors text-center"
                >
                  Apply & View Canvas
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
