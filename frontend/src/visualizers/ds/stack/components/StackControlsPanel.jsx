import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowDown, Plus, Trash2, Eye, RotateCcw, Play, Volume2, VolumeX } from 'lucide-react';
import { STACK_ALGORITHMS } from '../constants/stackAlgorithms';

export default function StackControlsPanel({
  activeAlgo,
  selectAlgorithm,
  inputValue,
  setInputValue,
  handleBasicPush,
  handleBasicPop,
  handleBasicPeek,
  handleBasicClear,
  basicStack,
  maxCapacity,
  parenInput,
  setParenInput,
  resetParentheses,
  postfixInput,
  setPostfixInput,
  resetPostfix,
  infixInput,
  setInfixInput,
  resetInfix,
  ngeInput,
  setNgeInput,
  resetNge,
  minInputVal,
  setMinInputVal,
  handleMinPush,
  handleMinPop,
  minMainStack,
  dailyTempInput,
  setDailyTempInput,
  resetDailyTemp,
  histogramInput,
  setHistogramInput,
  resetHistogram,
  stockSpanInput,
  setStockSpanInput,
  resetStockSpan,
  validParenWildcardInput,
  setValidParenWildcardInput,
  resetValidParenWildcard,
  isMuted = false,
  setIsMuted = () => {}
}) {
  const histInput = histogramInput !== undefined ? histogramInput : '';
  const setHistInput = setHistogramInput || (() => {});
  const wildcardInput = validParenWildcardInput !== undefined ? validParenWildcardInput : '';
  const setWildcardInput = setValidParenWildcardInput || (() => {});
  const bracketString = parenInput !== undefined ? parenInput : '';
  const setBracketString = setParenInput || (() => {});
  const postfixExpr = postfixInput !== undefined ? postfixInput : '';
  const setPostfixExpr = setPostfixInput || (() => {});
  const infixExpr = infixInput !== undefined ? infixInput : '';
  const setInfixExpr = setInfixInput || (() => {});
  const tempInput = dailyTempInput !== undefined ? dailyTempInput : '';
  const setTempInput = setDailyTempInput || (() => {});
  const spanInput = stockSpanInput !== undefined ? stockSpanInput : '';
  const setSpanInput = setStockSpanInput || (() => {});
  const minAuxStack = [];
  return (
    <div className="flex flex-col gap-4 text-xs">
      <Link
        to="/visualizer/stack"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-teal-500/10 text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300 transition-colors self-start border border-gray-200 dark:border-white/10"
      >
        <ArrowLeft size={13} />
        <span>Back to Stack Hub</span>
      </Link>

      {/* 1. Algorithm Selection Hub */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Stack Algorithm Suite
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {STACK_ALGORITHMS.map(a => (
            <button
              key={a.id}
              onClick={() => selectAlgorithm(a.id)}
              className={`flex items-center justify-between p-2 rounded-xl text-left font-bold transition-all border ${
                activeAlgo === a.id
                  ? 'bg-[#AB526B]/15 border-[#AB526B] text-[#AB526B] dark:text-[#F0E2A4] shadow-xs'
                  : 'bg-white/60 dark:bg-[#141416] border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:border-[#AB526B]/40'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs">{a.name}</span>
                <span className="text-[9px] text-gray-400 font-normal">{a.desc}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#AB526B]/15 text-[#AB526B] dark:text-[#F0E2A4]">
                {a.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Algorithm Specific Controls */}
      {/* MODE 1: BASIC STACK */}
      {activeAlgo === 'basic' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            LIFO Operations
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Value"
              className="w-20 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={handleBasicPush}
              className="flex-1 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <Plus size={14} /> Push
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handleBasicPop}
              className="py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <ArrowDown size={13} /> Pop
            </button>
            <button
              onClick={handleBasicPeek}
              className="py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <Eye size={13} /> Peek
            </button>
            <button
              onClick={handleBasicClear}
              className="py-1.5 bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: PARENTHESES */}
      {activeAlgo === 'parentheses' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Bracket String
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={bracketString}
              onChange={e => setBracketString(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => resetParentheses(bracketString)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Test
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '{[()]}', val: '{[()]}' },
                { label: '({[)]}', val: '({[)]}' },
                { label: '((()){[]})', val: '((()){[]})' },
                { label: '{[(])}', val: '{[(])}' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setBracketString(p.val); resetParentheses(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-teal-500/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: POSTFIX */}
      {activeAlgo === 'postfix' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            RPN Expression (Space separated)
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={postfixExpr}
              onChange={e => setPostfixExpr(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => resetPostfix(postfixExpr)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Parse
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '5 1 2 + 4 * + 3 -', val: '5 1 2 + 4 * + 3 -' },
                { label: '2 3 + 4 *', val: '2 3 + 4 *' },
                { label: '10 6 9 3 + -11 * / *', val: '10 6 9 3 + -11 * / *' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setPostfixExpr(p.val); resetPostfix(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-teal-500/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: INFIX TO POSTFIX */}
      {activeAlgo === 'infixToPostfix' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Infix Expression
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={infixExpr}
              onChange={e => setInfixExpr(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => resetInfix(infixExpr)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Convert
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: 'A + B * ( C - D )', val: 'A + B * ( C - D )' },
                { label: '( A + B ) * C', val: '( A + B ) * C' },
                { label: 'A + B * C / D - E', val: 'A + B * C / D - E' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setInfixExpr(p.val); resetInfix(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-teal-500/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 5: NEXT GREATER ELEMENT */}
      {activeAlgo === 'nextGreater' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Array (Comma separated)
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={ngeInput}
              onChange={e => setNgeInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => resetNge(ngeInput)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Analyze
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '4, 5, 2, 25, 7, 18', val: '4, 5, 2, 25, 7, 18' },
                { label: '13, 7, 6, 12, 10', val: '13, 7, 6, 12, 10' },
                { label: '5, 4, 3, 2, 1', val: '5, 4, 3, 2, 1' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setNgeInput(p.val); resetNge(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-teal-500/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 6: MIN STACK */}
      {activeAlgo === 'minStack' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Min-Stack Dual Operations
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minInputVal}
              onChange={e => setMinInputVal(e.target.value)}
              placeholder="Value"
              className="w-20 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={handleMinPush}
              className="flex-1 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <Plus size={14} /> Push
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleMinPop}
              className="py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <ArrowDown size={13} /> Pop
            </button>
            <div className="py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-lg text-amber-700 dark:text-amber-300 font-black text-center text-xs flex items-center justify-center gap-1">
              <span>getMin():</span>
              <span className="font-mono text-sm underline">
                {minAuxStack.length > 0 ? minAuxStack[minAuxStack.length - 1] : 'empty'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODE 7: DAILY TEMPERATURES */}
      {activeAlgo === 'dailyTemp' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Daily Temperatures (°F/°C)
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={tempInput}
              onChange={e => setTempInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#AB526B]"
            />
            <button
              onClick={() => resetDailyTemp(tempInput)}
              className="px-3 py-1.5 bg-[#AB526B] hover:bg-[#8E3B53] text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Run
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '73, 74, 75, 71, 69, 72, 76, 73', val: '73, 74, 75, 71, 69, 72, 76, 73' },
                { label: '30, 40, 50, 60', val: '30, 40, 50, 60' },
                { label: '30, 60, 90', val: '30, 60, 90' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setTempInput(p.val); resetDailyTemp(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-[#AB526B]/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all truncate max-w-full"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 8: HISTOGRAM */}
      {activeAlgo === 'histogram' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Bar Heights Array
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={histInput}
              onChange={e => setHistInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#AB526B]"
            />
            <button
              onClick={() => resetHistogram(histInput)}
              className="px-3 py-1.5 bg-[#AB526B] hover:bg-[#8E3B53] text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Run
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '2, 1, 5, 6, 2, 3', val: '2, 1, 5, 6, 2, 3' },
                { label: '2, 4', val: '2, 4' },
                { label: '6, 2, 5, 4, 5, 1, 6', val: '6, 2, 5, 4, 5, 1, 6' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setHistInput(p.val); resetHistogram(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-[#AB526B]/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all truncate max-w-full"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 9: STOCK SPAN */}
      {activeAlgo === 'stockSpan' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Stock Price Series
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={spanInput}
              onChange={e => setSpanInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#AB526B]"
            />
            <button
              onClick={() => resetStockSpan(spanInput)}
              className="px-3 py-1.5 bg-[#AB526B] hover:bg-[#8E3B53] text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Run
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '100, 80, 60, 70, 60, 75, 85', val: '100, 80, 60, 70, 60, 75, 85' },
                { label: '31, 27, 14, 21, 30, 22', val: '31, 27, 14, 21, 30, 22' },
                { label: '10, 20, 30, 40, 50', val: '10, 20, 30, 40, 50' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setSpanInput(p.val); resetStockSpan(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-[#AB526B]/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all truncate max-w-full"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 10: VALID PARENTHESES WITH WILDCARDS */}
      {activeAlgo === 'validParenWildcard' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Wildcard Expression (with *)
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={wildcardInput}
              onChange={e => setWildcardInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#AB526B]"
            />
            <button
              onClick={() => resetValidParenWildcard(wildcardInput)}
              className="px-3 py-1.5 bg-[#AB526B] hover:bg-[#8E3B53] text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Verify
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '(*))', val: '(*))' },
                { label: '(*)', val: '(*)' },
                { label: '((*)', val: '((*)' },
                { label: '(((**)', val: '(((**)' },
                { label: ')*(', val: ')*(' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setWildcardInput(p.val); resetValidParenWildcard(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-[#AB526B]/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all truncate max-w-full"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audio controls */}
      <div className="flex items-center justify-between p-2.5 bg-white/40 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 text-xs">
        <span className="font-bold text-gray-600 dark:text-gray-300">Audio Tone</span>
        <button
          onClick={() => setIsMuted(m => !m)}
          className={`p-1.5 rounded-lg border transition-all ${
            !isMuted ? 'bg-teal-500/10 text-teal-600 border-teal-500/30' : 'text-gray-400 border-transparent'
          }`}
        >
          {!isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>
    </div>
  );
}
