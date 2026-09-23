import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, X, Copy, Check, Terminal, ExternalLink, Sparkles } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';
import { CLASS_JAVA_CODE, JAVA_MULTILEVEL_CODE } from '../data/multilevelInheritanceData';

/**
 * MultilevelCodeDrawer - Premium Interactive Java Code Panel
 * Displays complete and per-class Java implementation with live syntax highlighting,
 * synchronized active line highlighting, copy button, and class switcher tabs.
 */
export const MultilevelCodeDrawer = ({
  isOpen = false,
  onClose,
  activeHighlightKey = null,
  activeClassTab: initialClassTab = 'all',
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const [activeTab, setActiveTab] = useState(initialClassTab || 'all');
  const [copied, setCopied] = useState(false);

  // Sync tab if prop changes
  React.useEffect(() => {
    if (initialClassTab) {
      setActiveTab(initialClassTab);
    }
  }, [initialClassTab]);

  const currentCode = activeTab === 'all' 
    ? JAVA_MULTILEVEL_CODE 
    : (CLASS_JAVA_CODE[activeTab] || JAVA_MULTILEVEL_CODE);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax Token Highlighter
  const renderHighlightedLine = (line, lineIdx) => {
    const trimmed = line.trim();

    // Check if line should be dynamically highlighted
    let isLineHighlighted = false;
    let highlightBadge = null;

    if (activeHighlightKey === 'name' && trimmed.includes('String name;')) {
      isLineHighlighted = true;
      highlightBadge = 'Person Property';
    } else if (activeHighlightKey === 'age' && trimmed.includes('int age;')) {
      isLineHighlighted = true;
      highlightBadge = 'Person Property';
    } else if (activeHighlightKey === 'introduce' && trimmed.includes('void introduce()')) {
      isLineHighlighted = true;
      highlightBadge = 'Person Method';
    } else if (activeHighlightKey === 'employeeId' && trimmed.includes('String employeeId;')) {
      isLineHighlighted = true;
      highlightBadge = 'Employee Property';
    } else if (activeHighlightKey === 'department' && trimmed.includes('String department;')) {
      isLineHighlighted = true;
      highlightBadge = 'Employee Property';
    } else if (activeHighlightKey === 'work' && trimmed.includes('void work()')) {
      isLineHighlighted = true;
      highlightBadge = 'Employee Method';
    } else if (activeHighlightKey === 'teamSize' && trimmed.includes('int teamSize;')) {
      isLineHighlighted = true;
      highlightBadge = 'Manager Property';
    } else if (activeHighlightKey === 'conductMeeting' && trimmed.includes('void conductMeeting()')) {
      isLineHighlighted = true;
      highlightBadge = 'Manager Method';
    } else if (
      (activeHighlightKey === 'employee_extends' || activeHighlightKey === 'transfer_p_to_e') &&
      trimmed.includes('class Employee extends Person')
    ) {
      isLineHighlighted = true;
      highlightBadge = 'Level 2: extends Person';
    } else if (
      (activeHighlightKey === 'manager_extends' || activeHighlightKey === 'transfer_e_to_m' || activeHighlightKey === 'transfer_deep_chain') &&
      trimmed.includes('class Manager extends Employee')
    ) {
      isLineHighlighted = true;
      highlightBadge = 'Level 3: extends Employee';
    }

    // Line Syntax Classification
    const isComment = trimmed.startsWith('//');
    const isClassHeader = trimmed.startsWith('class ') || trimmed.startsWith('public class ');
    const isMethod = trimmed.includes('void ') || trimmed.includes('public static void');
    const isField = (trimmed.startsWith('String ') || trimmed.startsWith('int ') || trimmed.startsWith('boolean ')) && trimmed.endsWith(';');

    let textColor = isDark ? 'text-slate-300' : 'text-slate-800';
    if (isComment) textColor = isDark ? 'text-emerald-400 font-italic' : 'text-emerald-700 italic font-semibold';
    else if (isClassHeader) textColor = isDark ? 'text-purple-300 font-bold' : 'text-purple-800 font-bold';
    else if (isMethod) textColor = isDark ? 'text-sky-300' : 'text-blue-800 font-semibold';
    else if (isField) textColor = isDark ? 'text-amber-300' : 'text-amber-800 font-medium';

    return (
      <div
        key={lineIdx}
        className={`flex items-center px-4 py-0.5 font-mono text-xs sm:text-[13px] transition-colors ${
          isLineHighlighted
            ? isDark
              ? 'bg-sky-500/20 text-white border-l-4 border-sky-400 pl-3 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
              : 'bg-amber-100 text-slate-900 border-l-4 border-amber-500 pl-3 font-bold'
            : isDark
            ? 'hover:bg-white/[0.03]'
            : 'hover:bg-slate-100'
        }`}
      >
        {/* Line Number */}
        <span className={`w-8 shrink-0 select-none text-[11px] text-right pr-4 ${
          isLineHighlighted
            ? (isDark ? 'text-sky-300 font-black' : 'text-amber-800 font-black')
            : (isDark ? 'text-slate-600' : 'text-slate-400')
        }`}>
          {lineIdx + 1}
        </span>

        {/* Code Content */}
        <span className={`flex-1 whitespace-pre ${textColor}`}>
          {line}
        </span>

        {/* Highlight Tag */}
        {isLineHighlighted && highlightBadge && (
          <span className={`ml-2 px-2 py-0.2 rounded text-[10px] font-mono font-bold shrink-0 border ${
            isDark 
              ? 'bg-sky-400/20 text-sky-300 border-sky-400/40' 
              : 'bg-amber-500/20 text-amber-900 border-amber-500/40'
          }`}>
            {highlightBadge}
          </span>
        )}
      </div>
    );
  };

  const lines = currentCode.split('\n');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22 }}
            className={`w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden font-sans transition-colors ${
              isDark
                ? 'bg-[#090D17] border-white/15 text-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]'
                : isWarm
                ? 'bg-[#FDFBF7] border-[#D8C7B8] text-[#2D1F23]'
                : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
            }`}
          >
            {/* ── HEADER ── */}
            <div className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'border-white/10 bg-[#060912]' : 'border-slate-200 bg-slate-50'
            }`}>
              {/* Left Title */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Terminal size={18} />
                </div>
                <div>
                  <h3 className={`font-mono text-sm sm:text-base font-black tracking-wide uppercase ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    CODE IMPLEMENTATION: MULTILEVEL INHERITANCE
                  </h3>
                  <span className={`text-[11px] block font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Person (Base) → Employee (Intermediate) → Manager (Final Subclass)
                  </span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
                  }`}
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-all cursor-pointer border ${
                    isDark
                      ? 'bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border-white/10'
                      : 'bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-300'
                  }`}
                  title="Close Code Panel"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── CLASS TABS NAVIGATION ── */}
            <div className={`px-5 py-2.5 border-b flex items-center gap-1.5 sm:gap-2 overflow-x-auto ${
              isDark ? 'border-white/10 bg-[#080C16]' : 'border-slate-200 bg-slate-100'
            }`}>
              {[
                { id: 'all', label: 'Show Full Code', badge: 'All 3 Levels' },
                { id: 'person', label: 'Person', badge: 'Base Class' },
                { id: 'employee', label: 'Employee', badge: 'extends Person' },
                { id: 'manager', label: 'Manager', badge: 'extends Employee' },
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? isDark
                          ? 'bg-purple-500/20 text-white border-purple-500/50 shadow-xs'
                          : 'bg-purple-600 text-white border-purple-700 shadow-sm'
                        : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-transparent'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive
                        ? (isDark ? 'bg-purple-400/30 text-purple-200' : 'bg-purple-700 text-purple-100')
                        : (isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-200 text-slate-600')
                    }`}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── CODE EDITOR VIEWPORT ── */}
            <div className={`flex-1 overflow-y-auto py-3 font-mono ${
              isDark ? 'bg-[#070A12]' : 'bg-[#F8FAFC]'
            }`}>
              {lines.map((line, idx) => renderHighlightedLine(line, idx))}
            </div>

            {/* ── FOOTER HINT BANNER ── */}
            <div className={`px-5 py-2.5 border-t flex flex-wrap items-center justify-between text-xs font-mono ${
              isDark ? 'border-white/10 bg-[#080C16] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                <span>Lines dynamically highlight based on selected timeline phase and hovered members</span>
              </div>
              <div className="font-bold text-[11px]">
                Java 17+ OOP Standard
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
