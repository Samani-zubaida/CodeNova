import React from 'react';
import { Layers, CheckCircle2, AlertCircle, ArrowRight, ArrowDown } from 'lucide-react';
import { STACK_ALGORITHMS } from '../constants/stackAlgorithms';
import DryRunVariableTracker from '../../../../components/visualizer/DryRunVariableTracker';
import CodeInspector from '../../../../components/visualizer/CodeInspector';

export default function StackRightPanel({
  activeAlgo,
  parenStatus,
  parenTokens,
  parenActiveIdx,
  parenthesesStack,
  ngeArray,
  ngeActiveIdx,
  ngeStack,
  ngeResults,
  infixTokens,
  infixActiveIdx,
  infixStack,
  infixOutput,
  tempTemps,
  tempActiveIdx,
  tempStack,
  tempResult,
  histHeights,
  histActiveIdx,
  histStack,
  histMaxArea,
  spanPrices,
  spanActiveIdx,
  spanStack,
  spanResults,
  wildcardTokens,
  wildcardActiveIdx,
  wildcardOpenStack,
  wildcardStarStack,
  wildcardStatus,
  activeVariables,
  currentCodeSnippet,
  activeLine
}) {
  const parenStack = parenthesesStack || [];
  const ngeResult = ngeResults || [];
  const tempArray = tempTemps || [];
  const histActiveRect = null;
  const isVoiceEnabled = false;
  const setIsVoiceEnabled = () => {};
  const explanation = { action: 'Active Stack step execution' };
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Dedicated Auxiliary HUD per Algorithm */}
      {activeAlgo === 'parentheses' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-teal-500/20 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Bracket Match Status
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
              parenStatus === 'valid'
                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                : parenStatus === 'invalid'
                ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                : 'bg-teal-500/10 text-teal-600'
            }`}>
              {parenStatus}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Active bracket stack size: <span className="font-mono font-bold text-teal-500">{parenStack.length}</span>
          </div>
        </div>
      )}

      {activeAlgo === 'nextGreater' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-teal-500/20 shadow-xs flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Next Greater Lookup Table
          </span>
          <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-center font-bold border-b border-gray-200 dark:border-white/10 pb-1 text-gray-400">
            <span>Index</span>
            <span>Value</span>
            <span>Next Greater</span>
          </div>
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
            {ngeArray.map((val, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 gap-1 text-xs font-mono text-center py-1 rounded transition-all ${
                  ngeActiveIdx === idx ? 'bg-amber-500/20 text-amber-500 font-black' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>[{idx}]</span>
                <span>{val}</span>
                <span className={ngeResult[idx] !== null && ngeResult[idx] !== -1 ? 'text-emerald-500 font-black' : 'text-gray-400'}>
                  {ngeResult[idx] !== null ? ngeResult[idx] : 'pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAlgo === 'infixToPostfix' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-teal-500/20 shadow-xs flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Operator Precedence Rules
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-gray-700 dark:text-gray-300">
            <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 flex justify-between">
              <span>^ (Exponent)</span>
              <span className="font-bold text-teal-500">Rank 3</span>
            </div>
            <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 flex justify-between">
              <span>*, / (Multiply/Div)</span>
              <span className="font-bold text-teal-500">Rank 2</span>
            </div>
            <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 flex justify-between col-span-2">
              <span>+, - (Add/Subtract)</span>
              <span className="font-bold text-teal-500">Rank 1</span>
            </div>
          </div>
        </div>
      )}

      {activeAlgo === 'dailyTemp' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-[#AB526B]/20 shadow-xs flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4]">
            Warmer Day Wait Table
          </span>
          <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-center font-bold border-b border-gray-200 dark:border-white/10 pb-1 text-gray-400">
            <span>Day</span>
            <span>Temp</span>
            <span>Wait (days)</span>
          </div>
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
            {tempArray.map((t, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 gap-1 text-xs font-mono text-center py-1 rounded transition-all ${
                  tempActiveIdx === idx ? 'bg-[#AB526B]/20 text-[#AB526B] dark:text-[#F0E2A4] font-black' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>[{idx}]</span>
                <span>{t}°</span>
                <span className={tempResult[idx] > 0 ? 'text-emerald-500 font-black' : 'text-gray-400'}>
                  {tempResult[idx]}d
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAlgo === 'histogram' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-[#AB526B]/20 shadow-xs flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4]">
            Histogram Area Tracker
          </span>
          <div className="flex flex-col gap-1.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5">
              <span className="text-gray-500">Max Area Found:</span>
              <span className="font-bold text-lg text-emerald-500">{histMaxArea} sq units</span>
            </div>
            {histActiveRect && (
              <div className="p-2 rounded-xl bg-[#AB526B]/10 border border-[#AB526B]/20 text-[11px] text-[#AB526B] dark:text-[#F0E2A4]">
                Active bounds: [{histActiveRect.left} ... {histActiveRect.right}] | Height: {histActiveRect.height} | Area: {histActiveRect.area}
              </div>
            )}
          </div>
        </div>
      )}

      {activeAlgo === 'stockSpan' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-[#AB526B]/20 shadow-xs flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4]">
            Stock Span Table
          </span>
          <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-center font-bold border-b border-gray-200 dark:border-white/10 pb-1 text-gray-400">
            <span>Day</span>
            <span>Price</span>
            <span>Span</span>
          </div>
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
            {spanPrices.map((p, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 gap-1 text-xs font-mono text-center py-1 rounded transition-all ${
                  spanActiveIdx === idx ? 'bg-[#AB526B]/20 text-[#AB526B] dark:text-[#F0E2A4] font-black' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>Day {idx}</span>
                <span>${p}</span>
                <span className={spanResults[idx] !== null ? 'text-emerald-500 font-bold' : 'text-gray-400'}>
                  {spanResults[idx] !== null ? `${spanResults[idx]}d` : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAlgo === 'validParenWildcard' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-[#AB526B]/20 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4]">
              Wildcard Validation
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
              wildcardStatus === 'valid'
                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                : wildcardStatus === 'invalid'
                ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                : 'bg-[#AB526B]/10 text-[#AB526B]'
            }`}>
              {wildcardStatus}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 font-mono">
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5">
              Open '(' Stack: <span className="font-bold text-[#AB526B]">{wildcardOpenStack.length}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5">
              Star '*' Stack: <span className="font-bold text-amber-500">{wildcardStarStack.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Dry Run Variable Tracker with AI Voice narration */}
      <DryRunVariableTracker
        variables={activeVariables}
        activeLine={activeLine}
        explanation={explanation.action}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => setIsVoiceEnabled(v => !v)}
      />

      {/* 3. Code Inspector with tabs */}
      <CodeInspector
        codeSnippets={currentCodeSnippet}
        activeLine={activeLine}
        variables={activeVariables}
        title={`${STACK_ALGORITHMS.find(a => a.id === activeAlgo)?.name} Logic`}
      />
    </div>
  );
}
