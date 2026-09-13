import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Volume2,
  VolumeX,
  Code2,
  Terminal,
  Zap
} from 'lucide-react';

/**
 * Universal Speech Synthesizer Helper
 * Uses the Web Speech API (speechSynthesis) to narrate the dry-run steps aloud.
 */
export const speakStepNarrative = (text, isVoiceEnabled = false, rate = 0.92) => {
  if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // Stop any pending or ongoing speech
    if (!text || typeof text !== 'string') return;

    // Clean text of emojis, symbols, and formatting for clean pronunciation
    const cleanText = text
      .replace(/[^\w\s.,?!'"-]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate; // Slightly relaxed pace for educational digestion
    utterance.pitch = 1.0;

    // Select the best natural-sounding English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice =
      voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Jenny') || v.name.includes('Guy'))) ||
      voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

/**
 * DryRunVariableTracker Component
 * Provides a professional debugger watch window / exam-style dry-run execution trace
 * with live variable mutation highlights and optional voice narration.
 */
export default function DryRunVariableTracker({
  title = 'Live Dry Run & Execution Trace',
  stepNumber = 1,
  totalSteps = 1,
  actionBadge = null,
  codeStatement = '',
  explanation = '',
  variables = [], // Array of { name, value, prevValue, type, role, isChanged, color }
  isVoiceEnabled = false,
  onToggleVoice,
  className = ''
}) {
  // Trigger speech narration whenever stepNumber or explanation changes
  useEffect(() => {
    if (isVoiceEnabled && explanation) {
      speakStepNarrative(explanation, isVoiceEnabled);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stepNumber, explanation, isVoiceEnabled]);

  // Normalize variables: universally handle Array of objects, plain Key-Value objects, null, or primitives
  const varList = useMemo(() => {
    if (!variables) return [];
    if (Array.isArray(variables)) {
      return variables.map((v, idx) => {
        if (typeof v === 'object' && v !== null) {
          return {
            name: v.name || `var_${idx}`,
            value: v.value !== undefined ? (typeof v.value === 'object' && v.value !== null ? JSON.stringify(v.value) : String(v.value)) : '-',
            prevValue: v.prevValue,
            type: v.type || (typeof v.value === 'number' ? 'Number' : typeof v.value === 'boolean' ? 'Boolean' : 'Value'),
            role: v.role || 'Scope Variable',
            isChanged: v.isChanged ?? false,
            color: v.color
          };
        }
        return {
          name: `item_${idx}`,
          value: String(v),
          type: typeof v,
          role: 'Scope Item',
          isChanged: false
        };
      });
    }
    if (typeof variables === 'object') {
      return Object.entries(variables).map(([key, val]) => ({
        name: key,
        value: typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val),
        prevValue: undefined,
        type: typeof val === 'number' ? 'Number' : typeof val === 'boolean' ? 'Boolean' : typeof val === 'string' ? 'String' : 'Value',
        role: 'Scope Variable',
        isChanged: true
      }));
    }
    return [];
  }, [variables]);

  return (
    <div className={`w-full bg-white/95 dark:bg-[#423834]/95 dark:bg-[#121214]/95 backdrop-blur-xl border border-cyan-500/30 dark:border-cyan-500/20 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col gap-4 transition-all duration-300 ${className}`}>
      
      {/* 1. Header Bar: Title, Mode Status, Action Badge, Voice Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBE0D3] dark:border-[#5C4E49]/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-[#2D1F23] dark:text-[#F4EBC3] uppercase">
                {title}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                TRACE ACTIVE
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-500 dark:text-[#BCA297]">
              Live variable inspector & memory trace for dry run verification
            </span>
          </div>
        </div>

        {/* Right Header Actions: Voice Narration Toggle & Step Badge */}
        <div className="flex items-center gap-2">
          {onToggleVoice && (
            <button
              onClick={onToggleVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border shadow-sm ${
                isVoiceEnabled
                  ? 'bg-amber-500/20 border-amber-400/80 text-amber-300 ring-2 ring-amber-500/30'
                  : 'bg-gray-100 dark:bg-[#5C4E49]/80 hover:bg-gray-100 dark:bg-[#5C4E49] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-500 dark:text-[#BCA297] hover:text-[#2D1F23] dark:text-[#F4EBC3]'
              }`}
              title={isVoiceEnabled ? "Voice narration enabled (Click to mute speech)" : "Enable AI Voice Narration (Hear the step dry run spoken aloud)"}
            >
              {isVoiceEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>🎙️ Voice: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>🎙️ Voice: OFF</span>
                </>
              )}
            </button>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-[#5C4E49]/80 border border-[#EBE0D3] dark:border-[#5C4E49] text-cyan-300 text-xs font-mono font-bold">
            Step {stepNumber} / {Math.max(1, totalSteps)}
          </div>
        </div>
      </div>

      {/* 2. Action Badge & Statement Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white/90 dark:bg-[#423834]/95 border border-[#EBE0D3] dark:border-[#5C4E49]/80 rounded-xl">
        <div className="flex items-center gap-2 flex-wrap">
          {actionBadge && (
            <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border shadow-sm ${actionBadge.bg || 'bg-cyan-500/20 border-cyan-400 text-cyan-300'}`}>
              {actionBadge.icon && (
                React.isValidElement(actionBadge.icon) ? (
                  actionBadge.icon
                ) : typeof actionBadge.icon === 'function' || actionBadge.icon?.render ? (
                  <actionBadge.icon className="w-3.5 h-3.5" />
                ) : (
                  actionBadge.icon
                )
              )}
              {actionBadge.label}
            </span>
          )}
          {codeStatement && (
            <div className="flex items-center gap-1.5 text-xs font-mono bg-white dark:bg-[#423834] px-3 py-1 rounded-lg border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3]">
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-gray-500 dark:text-[#BCA297] font-bold">EXEC:</span>
              <code className="text-purple-300 font-semibold">{codeStatement}</code>
            </div>
          )}
        </div>

        {/* Voice Visualizer Indicator */}
        {isVoiceEnabled && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span>Narrating aloud</span>
          </div>
        )}
      </div>

      {/* 3. Pedagogical Explanation Box ("Why this happened") */}
      {explanation && (
        <div className="flex items-start gap-3 p-3.5 bg-white/70 dark:bg-[#331921]/80 border border-cyan-500/20 rounded-xl">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mt-0.5 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              Dry Run Evaluation & Reasoning:
            </span>
            <p className="text-xs md:text-sm font-mono text-[#2D1F23] dark:text-[#F4EBC3] leading-relaxed font-medium">
              {explanation}
            </p>
          </div>
        </div>
      )}

      {/* 4. Live Variables Watch Table (Responsive Grid) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-500 dark:text-[#BCA297] px-1">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Active Scope Variables ({varList.length})
          </span>
          <span className="text-[10px] text-slate-500">
            Values updated in real-time
          </span>
        </div>

        {varList.length === 0 ? (
          <div className="p-4 bg-white/50 dark:bg-[#331921]/50 border border-[#EBE0D3] dark:border-[#5C4E49]/80 rounded-xl text-center text-xs font-mono text-slate-500">
            No active variables to track for this step.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {varList.map((v, idx) => {
              const isChanged = v.isChanged ?? false;
              const hasPrev = v.prevValue !== undefined && v.prevValue !== null && v.prevValue !== v.value;

              return (
                <motion.div
                  key={v.name || idx}
                  animate={{
                    borderColor: isChanged ? '#f59e0b' : '#334155',
                    scale: isChanged ? [1, 1.03, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className={`p-2.5 rounded-xl border bg-white/90 dark:bg-[#423834]/95 flex flex-col justify-between gap-1.5 shadow-sm transition-all ${
                    isChanged ? 'ring-1 ring-amber-500/40 bg-amber-500/5' : ''
                  }`}
                >
                  {/* Variable Header: Name, Type, Change Tag */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-sky-300">
                        {v.name}
                      </span>
                      {v.type && (
                        <span className="text-[9px] font-mono text-slate-500 uppercase">
                          {v.type}
                        </span>
                      )}
                    </div>
                    {isChanged && (
                      <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                        MODIFIED
                      </span>
                    )}
                  </div>

                  {/* Variable Value Display */}
                  <div className="flex items-baseline justify-between gap-2 mt-0.5">
                    <div className="font-mono text-sm font-extrabold text-[#2D1F23] dark:text-[#F4EBC3] truncate" title={String(v.value)}>
                      {v.value !== undefined && v.value !== null && v.value !== '' ? String(v.value) : 'undefined'}
                    </div>
                    {hasPrev && (
                      <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
                        <span>was</span>
                        <span className="line-through text-slate-600">{String(v.prevValue)}</span>
                      </div>
                    )}
                  </div>

                  {/* Variable Role / Context */}
                  {v.role && (
                    <div className="text-[10px] font-mono text-gray-500 dark:text-[#BCA297] truncate border-t border-[#EBE0D3] dark:border-[#5C4E49]/60 pt-1" title={v.role}>
                      {v.role}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
