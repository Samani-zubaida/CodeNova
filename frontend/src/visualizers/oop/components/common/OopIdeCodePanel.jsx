import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Copy, Check, Terminal, ChevronDown, ChevronUp,
  Maximize2, Minimize2, Sparkles, Info, ShieldCheck
} from 'lucide-react';
import useAppStore from '../../../../store/useAppStore';

/**
 * OopIdeCodePanel - Compact, Professional IDE-Style Source Code Viewer
 * 
 * Features:
 * - IDE Header: Window indicators, filename, copy button, collapse/expand toggle
 * - Syntax-highlighted code editor body with line numbers
 * - Synchronized active line highlighting with subtle background glow & left accent border
 * - Smooth INTERNAL auto-scroll to the active line (never scrolls the window/page)
 * - Compact telemetry status bar showing inspected member metadata
 * - Independent vertical & horizontal scrolling
 * - Collapsible toggle with persistent state
 * - Viewport-aware responsive design for both Light and Dark themes
 */
export default function OopIdeCodePanel({
  filename = 'SourceDemo.java',
  codeLines = [],
  rawCode = '',

  // Highlighting synchronization props
  activeLineNumbers = [], // e.g. [16] or 16
  activeHighlightKey = null,
  activeMemberId = null,
  activeBadgeText = null,

  // Active member telemetry for status bar
  telemetry = null,

  // Collapse control
  isOpen = true,
  onToggleOpen,

  // Multi-file tabs support
  tabs = [],
  activeTab = null,
  onSelectTab,

  maxHeight = '230px',
  accentColor = '#0EA5E9',
  className = '',
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef(null);
  const activeLineRef = useRef(null);

  // Normalize active line numbers into a Set for fast lookup
  const activeLinesSet = new Set(
    Array.isArray(activeLineNumbers)
      ? activeLineNumbers
      : activeLineNumbers ? [activeLineNumbers] : []
  );

  // Prepare lines from codeLines prop or rawCode string
  const linesToRender = codeLines.length > 0
    ? codeLines
    : rawCode.split('\n').map((text, idx) => ({
      line: idx + 1,
      text,
      type: detectLineType(text)
    }));

  const fullCodeText = linesToRender.map(l => l.text).join('\n');

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullCodeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if a line is active based on line number, memberId, or highlightKey
  const isLineHighlighted = (lineObj) => {
    if (activeLinesSet.has(lineObj.line)) return true;
    if (activeMemberId && lineObj.memberId === activeMemberId) return true;
    if (activeHighlightKey) {
      if (lineObj.highlightKey === activeHighlightKey) return true;
      if (lineObj.memberId === activeHighlightKey) return true;

      // Extended semantic keys
      if (activeHighlightKey === 'car_extends' && lineObj.highlightKey === 'extends') return true;
      if (activeHighlightKey === 'conduit' && lineObj.highlightKey === 'extends') return true;
      if (activeHighlightKey === 'vehicle' && (lineObj.line === 2 || lineObj.highlightKey === 'vehicle')) return true;
      if (activeHighlightKey === 'own_members' && (lineObj.type === 'own-property' || lineObj.type === 'own-method-header')) return true;
      if (activeHighlightKey === 'person_class' && lineObj.line === 1) return true;
      if (activeHighlightKey === 'employee_extends' && lineObj.text.includes('extends Person')) return true;
      if (activeHighlightKey === 'manager_extends' && lineObj.text.includes('extends Employee')) return true;
    }
    return false;
  };

  // Smooth internal auto-scroll to active line without scrolling the webpage
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (activeLineRef.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const lineEl = activeLineRef.current;
        const containerRect = container.getBoundingClientRect();
        const lineRect = lineEl.getBoundingClientRect();

        // Check if line is outside the visible viewport of the container
        if (lineRect.top < containerRect.top || lineRect.bottom > containerRect.bottom) {
          const scrollTarget = lineEl.offsetTop - container.offsetTop - (container.clientHeight / 2) + (lineEl.clientHeight / 2);
          container.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: 'smooth'
          });
        }
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [activeLineNumbers, activeHighlightKey, activeMemberId, isOpen, activeTab]);

  // Surface theme classes
  const panelBg = isDark
    ? 'bg-[#080C16]/95 border-white/[0.1] text-slate-200 shadow-[0_16px_36px_rgba(0,0,0,0.65)]'
    : isWarm
      ? 'bg-[#FAF7F2]/98 border-[#EBE0D3] text-[#2D1F23] shadow-xl'
      : 'bg-white/98 border-slate-300 text-slate-800 shadow-xl';

  const headerBg = isDark
    ? 'bg-slate-950/80 border-white/[0.08]'
    : isWarm
      ? 'bg-[#EFE7DE]/70 border-[#E2D5C5]'
      : 'bg-slate-100/90 border-slate-200';

  const footerBg = isDark
    ? 'bg-slate-950/90 border-white/[0.08] text-slate-400'
    : isWarm
      ? 'bg-[#EFE7DE]/80 border-[#E2D5C5] text-slate-600'
      : 'bg-slate-100/90 border-slate-200 text-slate-600';

  return (
    <div
      className={`w-full rounded-2xl border backdrop-blur-2xl flex flex-col overflow-hidden font-mono text-xs transition-all duration-300 ${panelBg} ${className}`}
      style={{ borderTopWidth: '2px', borderTopColor: accentColor }}
      role="region"
      aria-label={`Java Source Code Viewer: ${filename}`}
    >
      {/* ── 1. COMPACT IDE HEADER BAR ── */}
      <div
        className={`px-3 sm:px-4 py-2 flex items-center justify-between border-b select-none transition-colors ${headerBg}`}
      >
        {/* Left: Window Indicators & Filename */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* macOS / Modern IDE dots */}
          <div className="flex gap-1.5 items-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* Filename & Code Icon */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Code2 size={13} style={{ color: accentColor }} className="shrink-0" />
            <span className={`font-bold text-[11px] sm:text-xs tracking-wide truncate ${isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
              {filename}
            </span>
          </div>

          {/* Optional Multi-file tabs */}
          {tabs.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 ml-2 border-l border-white/10 dark:border-white/10 pl-2">
              {tabs.map(tab => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => onSelectTab && onSelectTab(tab)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${activeTab === tab
                      ? 'bg-white/15 dark:bg-white/20 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions & Collapse Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Working Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer ${copied
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : isDark
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
              }`}
            title="Copy source code to clipboard"
            aria-label="Copy code"
          >
            {copied ? <Check size={11} className="text-emerald-400 stroke-[3]" /> : <Copy size={11} />}
            <span className="hidden xs:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Collapse / Expand Toggle Button */}
          {onToggleOpen && (
            <button
              type="button"
              onClick={onToggleOpen}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-bold border transition-all cursor-pointer ${isDark
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs'
                }`}
              title={isOpen ? 'Collapse Code Editor' : 'Expand Code Editor'}
              aria-expanded={isOpen}
            >
              {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              <span className="hidden sm:inline">{isOpen ? 'Hide Code' : 'Show Code'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 2. SCROLLABLE CODE EDITOR BODY ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col"
          >
            <div
              ref={scrollContainerRef}
              style={{ maxHeight }}
              className="p-2 sm:p-3 overflow-x-auto overflow-y-auto leading-relaxed select-text space-y-0.5 [scrollbar-width:thin] focus:outline-none"
              tabIndex={0}
              role="region"
              aria-label="Source code lines"
            >
              {linesToRender.map((lineObj, idx) => {
                const isActive = isLineHighlighted(lineObj);

                return (
                  <div
                    key={lineObj.line || idx}
                    ref={isActive ? activeLineRef : null}
                    className={`flex items-center gap-2.5 sm:gap-3 px-2 py-0.5 rounded-md font-mono text-[11px] sm:text-xs transition-colors duration-150 ${isActive
                        ? isDark
                          ? 'bg-sky-500/20 border-l-4 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.2)] font-semibold'
                          : 'bg-blue-100/90 border-l-4 border-blue-600 text-slate-900 font-bold shadow-xs'
                        : isDark
                          ? 'hover:bg-white/[0.04]'
                          : 'hover:bg-black/[0.03]'
                      }`}
                  >
                    {/* Line Number */}
                    <span className={`w-6 sm:w-7 text-right shrink-0 select-none text-[10px] sm:text-[10.5px] ${isActive
                        ? isDark ? 'text-sky-300 font-black' : 'text-blue-700 font-black'
                        : isDark ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                      {lineObj.line || idx + 1}
                    </span>

                    {/* Line Code Text with Syntax Highlighting */}
                    <span className="flex-1 whitespace-pre overflow-x-visible">
                      {renderSyntaxLine(lineObj.text, lineObj.type, isDark, isWarm)}
                    </span>

                    {/* Active Line Indicator Tag Pill */}
                    {isActive && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase shrink-0 border select-none ${isDark
                          ? 'bg-sky-400/25 text-sky-200 border-sky-400/40 shadow-xs'
                          : 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        }`}>
                        {activeBadgeText || lineObj.memberId || lineObj.highlightKey || 'ACTIVE'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── 3. COMPACT IDE STATUS BAR / TELEMETRY FOOTER ── */}
            <div className={`px-3 py-1.5 border-t flex flex-wrap items-center justify-between gap-2 text-[10.5px] select-none ${footerBg}`}>
              {/* Telemetry info when member is hovered / inspected */}
              {telemetry ? (
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className={`font-bold uppercase tracking-wider text-[9.5px] px-1.5 py-0.2 rounded ${isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100 text-amber-800'
                    }`}>
                    {telemetry.kind || 'MEMBER'}
                  </span>
                  <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {telemetry.name}
                  </span>
                  <span className="text-slate-400">
                    &bull; {telemetry.dataType || telemetry.returnType}
                  </span>
                  <span className={`text-[10px] font-bold ${telemetry.status === 'Inherited'
                      ? (isDark ? 'text-cyan-400' : 'text-blue-600')
                      : (isDark ? 'text-purple-400' : 'text-purple-700')
                    }`}>
                    ({telemetry.status || telemetry.source})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Terminal size={11} style={{ color: accentColor }} />
                  <span>Java OOP Compilation Target &bull; JDK 21</span>
                </div>
              )}

              {/* Relationship or Principle Rule */}
              <div className="flex items-center gap-2 font-bold shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">RULE:</span>
                <span style={{ color: accentColor }}>
                  {filename.includes('Single')
                    ? 'Car is-a Vehicle'
                    : filename.includes('Multilevel')
                      ? 'Manager is-a Employee is-a Person'
                      : 'Encapsulation & Access Control'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Line Type Detection Helper
 */
function detectLineType(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return 'comment';
  if (trimmed.includes('extends')) return 'child-header';
  if (trimmed.startsWith('class ') || trimmed.startsWith('public class ') || trimmed.startsWith('abstract class ')) return 'class-header';
  if (trimmed.startsWith('public interface ') || trimmed.startsWith('interface ')) return 'interface-header';
  if (trimmed.includes('void ') || trimmed.includes('int ') && trimmed.includes('(')) return 'method-header';
  if (trimmed.endsWith('{') || trimmed === '}') return 'bracket';
  if (trimmed.length === 0) return 'empty';
  return 'body';
}

/**
 * High-Performance Syntax Highlighter Helper
 */
function renderSyntaxLine(text, type, isDark, isWarm) {
  if (!text) return <span>&nbsp;</span>;

  // Comments
  if (type === 'comment' || text.trim().startsWith('//')) {
    return <span className={isDark ? 'text-emerald-400/90 italic' : 'text-emerald-700 italic font-medium'}>{text}</span>;
  }

  // Tokenization for keywords, identifiers, brackets, and strings
  const tokens = tokenizeJavaLine(text);

  return (
    <>
      {tokens.map((token, i) => {
        let colorClass = isDark ? 'text-slate-200' : 'text-slate-800';

        if (token.type === 'keyword') {
          colorClass = isDark ? 'text-purple-400 font-bold' : 'text-purple-700 font-bold';
        } else if (token.type === 'type') {
          colorClass = isDark ? 'text-cyan-300 font-bold' : 'text-blue-700 font-bold';
        } else if (token.type === 'string') {
          colorClass = isDark ? 'text-emerald-300' : 'text-emerald-600 font-medium';
        } else if (token.type === 'method') {
          colorClass = isDark ? 'text-amber-300 font-bold' : 'text-amber-800 font-bold';
        } else if (token.type === 'comment') {
          colorClass = isDark ? 'text-emerald-400/80 italic' : 'text-emerald-700 italic';
        } else if (token.type === 'number') {
          colorClass = isDark ? 'text-orange-400 font-mono' : 'text-orange-600 font-mono';
        } else if (token.type === 'bracket') {
          colorClass = isDark ? 'text-slate-400' : 'text-slate-600';
        }

        return (
          <span key={i} className={colorClass}>
            {token.value}
          </span>
        );
      })}
    </>
  );
}

/**
 * Lightweight Java Lexer
 */
function tokenizeJavaLine(line) {
  const keywords = new Set([
    'class', 'extends', 'implements', 'interface', 'public', 'private', 'protected',
    'static', 'final', 'abstract', 'void', 'new', 'return', 'super', 'this',
    'import', 'package', 'if', 'else', 'for', 'while', 'boolean', 'int', 'double',
    'float', 'long', 'short', 'byte', 'char'
  ]);

  const commonTypes = new Set([
    'String', 'Vehicle', 'Car', 'Person', 'Employee', 'Manager', 'BankAccount',
    'Smartphone', 'System', 'Object'
  ]);

  const regex = /(\/\/.*$)|(".*?"|'.*?')|(\b[0-9]+\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|([{}();,])|(\s+)|([^\s\w{}();,]+)/g;
  const tokens = [];
  let match;

  while ((match = regex.exec(line)) !== null) {
    const [full, comment, str, num, ident, bracket, ws, other] = match;

    if (comment) {
      tokens.push({ type: 'comment', value: comment });
    } else if (str) {
      tokens.push({ type: 'string', value: str });
    } else if (num) {
      tokens.push({ type: 'number', value: num });
    } else if (ident) {
      if (keywords.has(ident)) {
        tokens.push({ type: 'keyword', value: ident });
      } else if (commonTypes.has(ident)) {
        tokens.push({ type: 'type', value: ident });
      } else {
        // Peek ahead to see if it's a method call
        const nextChar = line[regex.lastIndex];
        if (nextChar === '(') {
          tokens.push({ type: 'method', value: ident });
        } else {
          tokens.push({ type: 'ident', value: ident });
        }
      }
    } else if (bracket) {
      tokens.push({ type: 'bracket', value: bracket });
    } else if (ws) {
      tokens.push({ type: 'whitespace', value: ws });
    } else if (other) {
      tokens.push({ type: 'operator', value: other });
    }
  }

  return tokens;
}
