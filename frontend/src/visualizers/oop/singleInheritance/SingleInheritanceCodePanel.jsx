import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Copy, Check, Terminal, Sparkles } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';
import { JAVA_CODE_LINES } from '../data/singleInheritanceData';

/**
 * SingleInheritanceCodePanel - Synchronized Java architecture view
 * Automatically highlights code lines corresponding to active transfer animations or hovered members.
 */
export const SingleInheritanceCodePanel = ({
  activeMemberId = null,
  activeHighlightKey = null,
  activeStepNumber = 1,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const [copied, setCopied] = useState(false);

  const fullCodeText = JAVA_CODE_LINES.map(l => l.text).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCodeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Card background and border themes
  const panelBg = isDark
    ? 'bg-[#090D17]/90 border-white/10 text-slate-200'
    : isWarm
    ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] text-[#2D1F23]'
    : 'bg-white/95 border-slate-200 text-slate-800 shadow-xl';

  return (
    <div className={`w-full rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs ${panelBg}`}>
      {/* Top Header Bar */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b ${
        isDark ? 'border-white/10 bg-slate-950/60' : isWarm ? 'border-[#EBE0D3] bg-[#EBE0D3]/30' : 'border-slate-100 bg-slate-50'
      }`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-bold text-[11px] tracking-wider text-slate-400">
            SingleInheritanceDemo.java
          </span>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : isDark
              ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              : 'bg-slate-200/60 hover:bg-slate-200 text-slate-700 border border-slate-300'
          }`}
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Editor Body with Line Highlighting */}
      <div className="p-3 sm:p-4 overflow-x-auto leading-relaxed select-text space-y-0.5 max-h-[460px] overflow-y-auto [scrollbar-width:thin]">
        {JAVA_CODE_LINES.map((lineObj) => {
          const isMemberHighlighted = activeMemberId && lineObj.memberId === activeMemberId;
          const isExtendsHighlighted = (activeHighlightKey === 'car_extends' || activeHighlightKey === 'conduit' || activeHighlightKey === 'extends') && lineObj.highlightKey === 'extends';
          const isLineActive = isMemberHighlighted || isExtendsHighlighted;

          return (
            <div
              key={lineObj.line}
              className={`flex items-center gap-3 px-2 py-0.5 rounded-md transition-colors duration-200 ${
                isLineActive
                  ? isDark
                    ? 'bg-cyan-500/15 border-l-2 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-blue-50 border-l-2 border-blue-600 text-blue-900 font-semibold shadow-xs'
                  : 'hover:bg-white/5'
              }`}
            >
              {/* Line Number */}
              <span className={`w-5 text-right shrink-0 select-none text-[10px] ${
                isLineActive
                  ? 'text-cyan-400 font-bold'
                  : isDark ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {lineObj.line}
              </span>

              {/* Line Code with Syntax Coloring */}
              <span className="flex-1 whitespace-pre">
                {renderSyntaxLine(lineObj, isDark, isWarm)}
              </span>

              {/* Indicator Pill for Highlighted Lines */}
              {isLineActive && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                  isDark ? 'bg-cyan-400/20 text-cyan-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  {isExtendsHighlighted ? 'extends' : lineObj.memberId}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Educational Footnote */}
      <div className={`px-4 py-2 border-t flex items-center justify-between text-[10.5px] ${
        isDark ? 'border-white/10 bg-slate-950/40 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
      }`}>
        <span className="flex items-center gap-1.5">
          <Terminal size={12} className="text-cyan-400" />
          <span>Java OOP Architecture</span>
        </span>
        <span className="font-bold text-cyan-400">
          Car is-a Vehicle
        </span>
      </div>
    </div>
  );
};

// Syntax Highlighting Helper
function renderSyntaxLine(lineObj, isDark, isWarm) {
  const { text, type } = lineObj;

  if (type === 'comment') {
    return <span className={isDark ? 'text-slate-500 italic' : 'text-slate-400 italic'}>{text}</span>;
  }

  if (type === 'child-header') {
    return (
      <>
        <span className={isDark ? 'text-purple-400 font-bold' : 'text-purple-600 font-bold'}>class </span>
        <span className={isDark ? 'text-amber-300 font-bold' : 'text-amber-700 font-bold'}>Car </span>
        <span className="text-cyan-400 font-extrabold underline decoration-cyan-400/50">extends </span>
        <span className={isDark ? 'text-emerald-400 font-bold' : 'text-emerald-600 font-bold'}>Vehicle </span>
        <span>{'{'}</span>
      </>
    );
  }

  if (type === 'class-header') {
    return (
      <>
        <span className={isDark ? 'text-purple-400 font-bold' : 'text-purple-600 font-bold'}>class </span>
        <span className={isDark ? 'text-emerald-400 font-bold' : 'text-emerald-600 font-bold'}>Vehicle </span>
        <span>{'{'}</span>
      </>
    );
  }

  if (type === 'property' || type === 'own-property') {
    const parts = text.trim().split(' ');
    const indent = text.substring(0, text.indexOf(parts[0]));
    return (
      <>
        <span>{indent}</span>
        <span className={isDark ? 'text-cyan-300' : 'text-blue-600'}>{parts[0]} </span>
        <span className={isDark ? 'text-slate-200 font-bold' : 'text-slate-800 font-bold'}>{parts[1]}</span>
      </>
    );
  }

  if (type === 'method-header' || type === 'own-method-header') {
    const parts = text.trim().split(' ');
    const indent = text.substring(0, text.indexOf(parts[0]));
    return (
      <>
        <span>{indent}</span>
        <span className={isDark ? 'text-purple-400' : 'text-purple-600'}>{parts[0]} </span>
        <span className={isDark ? 'text-amber-300 font-bold' : 'text-amber-700 font-bold'}>{parts[1]} </span>
        <span>{'{'}</span>
      </>
    );
  }

  if (type === 'body') {
    return <span className={isDark ? 'text-emerald-300/80' : 'text-emerald-700'}>{text}</span>;
  }

  return <span>{text}</span>;
}
