import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDown, ArrowUp, ArrowRight, ArrowLeft, Check, X, ShieldAlert, Cpu, Sparkles, AlertCircle, CheckCircle, Repeat, RefreshCw, Layers, Zap, Award
} from 'lucide-react';

export default function StringCanvasView({
  currentAlgoId,
  step = {},
  currentStepIdx = 0,
  steps = [],
  textInput = '',
  patternInput = '',
  secondTextInput = ''
}) {
  const renderCanvas = () => {
    // 1. KMP CANVAS (DIRECT SLIDING ALIGNMENT + LASER CONNECTOR + INTERACTIVE LPS)
    if (currentAlgoId === 'kmp') {
      const cellStride = 46; // 40px cell + 6px gap
      const pOffset = ((step.tIdx ?? 0) - (step.pIdx ?? 0)) * cellStride;
      const isCharMatch = step.status?.includes('Match:');
      const isCharMismatch = step.status?.includes('Mismatch:');
      const currentTChar = textInput[step.tIdx ?? 0];
      const currentPChar = patternInput[step.pIdx ?? 0];

      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          {/* Active Comparison Laser HUD Callout */}
          <div className="w-full max-w-xl p-3 bg-white dark:bg-[#423834]/90 border border-cyan-500/40 rounded-2xl shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gray-600 dark:text-[#BCA297]">Comparing:</span>
              <span className="px-2.5 py-1 rounded bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-400 text-cyan-800 dark:text-cyan-200 font-mono text-xs font-bold">
                Text[t={step.tIdx ?? 0}]: '{currentTChar ?? ''}'
              </span>
              <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297] font-extrabold">vs</span>
              <span className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-400 text-amber-800 dark:text-amber-200 font-mono text-xs font-bold">
                Pattern[p={step.pIdx ?? 0}]: '{currentPChar ?? ''}'
              </span>
            </div>
            {isCharMatch ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> MATCH (Advance t, p)
              </span>
            ) : isCharMismatch ? (
              <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 border border-rose-400 text-rose-800 dark:text-rose-300 text-xs font-mono font-bold flex items-center gap-1 animate-pulse">
                <X className="w-3.5 h-3.5" /> MISMATCH (Consult LPS)
              </span>
            ) : (
              <span className="text-xs font-mono text-gray-500 dark:text-slate-400">Aligning...</span>
            )}
          </div>

          {/* Interactive Aligned Canvas Tracks */}
          <div className="w-full max-w-3xl overflow-x-auto p-4 bg-white dark:bg-[#331921]/80 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl flex flex-col gap-6 relative shadow-lg">
            {/* Track 1: Text String Array */}
            <div className="flex flex-col">
              <div className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold mb-2 flex items-center justify-between">
                <span>Text Array (Pointer t = {step.tIdx ?? 0})</span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400">Indices 0 to {textInput.length - 1}</span>
              </div>
              <div className="flex gap-1.5 relative">
                {textInput.split('').map((char, idx) => {
                  const isCurrent = step.tIdx === idx;
                  const isMatched = step.matches && step.matches.some(m => idx >= m && idx < m + patternInput.length);
                  return (
                    <div key={idx} className="flex flex-col items-center min-w-[40px]">
                      <span className={`text-[10px] font-mono mb-1 font-semibold ${isCurrent ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-gray-500 dark:text-slate-400'}`}>
                        {idx}
                      </span>
                      <motion.div
                        animate={{
                          scale: isCurrent ? 1.15 : 1,
                          borderColor: isMatched ? '#10b981' : isCurrent ? '#06b6d4' : undefined
                        }}
                        className={`w-10 h-12 rounded-xl border flex items-center justify-center font-mono font-extrabold text-base shadow-md transition-colors ${
                          isMatched
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                            : isCurrent
                            ? 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-500 text-cyan-900 dark:text-cyan-200 ring-2 ring-cyan-400/50'
                            : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F4EBC3]'
                        }`}
                      >
                        {char}
                      </motion.div>
                      {isCurrent && (
                        <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 font-bold mt-1">▲ t</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vertical Comparison Laser Beam */}
            {step.phase === 'search' && step.tIdx !== undefined && step.pIdx !== undefined && (
              <div className="w-full flex items-center justify-center my-[-8px]">
                <div className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold flex items-center gap-1.5 border shadow-lg ${
                  isCharMatch ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/20 border-rose-400 text-rose-800 dark:text-rose-300'
                }`}>
                  {isCharMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {isCharMatch ? 'Characters Match' : 'Mismatch: Trigger LPS Jump'}
                </div>
              </div>
            )}

            {/* Track 2: Aligned Sliding Pattern Array */}
            <div className="flex flex-col">
              <div className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold mb-2 flex items-center justify-between">
                <span>Pattern Sliding Track (Pointer p = {step.pIdx ?? 0})</span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400">Aligned under Text at offset {pOffset / cellStride} chars</span>
              </div>
              <div className="relative overflow-visible" style={{ height: '70px' }}>
                <motion.div
                  animate={{ x: pOffset }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="flex gap-1.5 absolute top-0 left-0"
                >
                  {patternInput.split('').map((char, idx) => {
                    const isP = step.pIdx === idx;
                    return (
                      <div key={idx} className="flex flex-col items-center min-w-[40px]">
                        <span className={`text-[10px] font-mono mb-1 font-semibold ${isP ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-gray-500 dark:text-slate-400'}`}>
                          p={idx}
                        </span>
                        <motion.div
                          animate={{
                            scale: isP ? 1.15 : 1,
                            borderColor: isP ? '#f59e0b' : undefined
                          }}
                          className={`w-10 h-12 rounded-xl border flex items-center justify-center font-mono font-extrabold text-base shadow-md transition-colors ${
                            isP
                              ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/50'
                              : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F0E2A4]'
                          }`}
                        >
                          {char}
                        </motion.div>
                        {isP && (
                          <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold mt-1">▲ p</span>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Preprocessed LPS Table with Interactive Pointer */}
          <div className="w-full max-w-xl bg-white dark:bg-[#423834]/90 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-5 flex flex-col items-center shadow-xl">
            <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-3 flex items-center justify-between w-full">
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> Preprocessed LPS (Longest Prefix Suffix) Table</span>
              <span className="text-[10px] text-gray-500 dark:text-[#BCA297] font-normal">LPS[p-1] determines jump on mismatch</span>
            </div>
            <div className="flex gap-2.5">
              {patternInput.split('').map((char, idx) => {
                const isActiveLps = step.pIdx !== undefined && (idx === step.pIdx || idx === step.pIdx - 1);
                const lpsVal = step.lps ? step.lps[idx] : 0;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs font-mono text-gray-900 dark:text-[#F0E2A4] font-bold">{char}</span>
                    <span className="text-[9px] font-mono text-gray-500 dark:text-slate-400">[{idx}]</span>
                    <motion.div
                      animate={{
                        scale: isActiveLps ? 1.15 : 1,
                        borderColor: isActiveLps ? '#22d3ee' : undefined
                      }}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center font-mono text-sm mt-1 font-extrabold shadow-sm transition-colors ${
                        isActiveLps
                          ? 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-400 text-cyan-900 dark:text-cyan-200 ring-2 ring-cyan-400/50'
                          : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F4EBC3]'
                      }`}
                    >
                      {lpsVal}
                    </motion.div>
                  </div>
                );
              })}
            </div>
            {isCharMismatch && step.pIdx > 0 && (
              <div className="mt-3 text-xs font-mono text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                LPS[{step.pIdx - 1}] = {step.lps?.[step.pIdx - 1] ?? 0} ➔ Slide pattern so prefix matches suffix without rewinding text!
              </div>
            )}
          </div>
        </div>
      );
    }

    // 2. RABIN-KARP CANVAS (SLIDING WINDOW BRACKET + LIVE ROLLING MATH)
    if (currentAlgoId === 'rabin_karp') {
      const wStart = step.windowStart ?? 0;
      const wEnd = wStart + patternInput.length;
      const currentWinStr = textInput.substring(wStart, wEnd);

      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          {/* Side-by-Side Hash Inspector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="p-4 bg-white dark:bg-[#423834]/90 border border-amber-500/40 rounded-2xl flex flex-col items-center shadow-lg">
              <span className="text-xs font-mono text-gray-600 dark:text-[#BCA297] font-semibold">Target Pattern Hash ("{patternInput}")</span>
              <span className="text-2xl font-mono font-extrabold text-amber-600 dark:text-amber-400 mt-1">{step.pHash ?? 0}</span>
            </div>
            <div className={`p-4 bg-white dark:bg-[#423834]/90 border rounded-2xl flex flex-col items-center shadow-lg transition-all ${
              step.hashMatch ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/40' : 'border-cyan-500/40'
            }`}>
              <span className="text-xs font-mono text-gray-600 dark:text-[#BCA297] font-semibold">Current Window Hash ("{currentWinStr}")</span>
              <span className={`text-2xl font-mono font-extrabold mt-1 ${
                step.hashMatch ? 'text-emerald-700 dark:text-emerald-300' : 'text-cyan-700 dark:text-cyan-400'
              }`}>{step.wHash ?? 0}</span>
            </div>
          </div>

          {/* Text String with Physical Sliding Bracket */}
          <div className="w-full max-w-3xl overflow-x-auto p-4 bg-white dark:bg-[#331921]/80 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl flex flex-col items-center shadow-lg">
            <div className="text-xs font-mono text-gray-600 dark:text-[#BCA297] mb-3 font-semibold">
              Text Array with Sliding Substring Frame [Window {wStart} to {wEnd - 1}]
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full">
              {textInput.split('').map((char, idx) => {
                const inWindow = idx >= wStart && idx < wEnd;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className={`text-[10px] font-mono mb-1 ${inWindow ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-gray-500 dark:text-slate-400'}`}>
                      {idx}
                    </span>
                    <motion.div
                      animate={{
                        scale: inWindow ? 1.12 : 1,
                        borderColor: inWindow ? (step.hashMatch ? '#10b981' : '#38bdf8') : undefined
                      }}
                      className={`w-10 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-base shadow-sm transition-colors ${
                        inWindow
                          ? step.hashMatch
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                            : 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-500 text-cyan-900 dark:text-cyan-100'
                          : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F0E2A4]'
                      }`}
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rolling Hash Formula Banner */}
          <div className="w-full max-w-xl p-3 bg-white dark:bg-[#423834]/80 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl flex items-center justify-between text-xs font-mono text-gray-900 dark:text-[#F0E2A4] shadow-sm">
            <span className="text-cyan-700 dark:text-cyan-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Rolling Math:
            </span>
            <span className="text-gray-600 dark:text-[#BCA297]">
              Hash = ((OldHash - OutChar × d<sup>m-1</sup>) × d + InChar) % q
            </span>
          </div>
        </div>
      );
    }

    // 3. BOYER-MOORE CANVAS
    if (currentAlgoId === 'boyer_moore') {
      const wStart = step.shift ?? 0;
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-600 dark:text-[#BCA297] mb-2 font-bold">Right-to-Left Scanning Window</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const inWin = idx >= wStart && idx < wStart + patternInput.length;
                const isCheck = step.textIdx === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-gray-500 dark:text-slate-400 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: isCheck ? 1.15 : inWin ? 1.05 : 1,
                        borderColor: isCheck ? '#06b6d4' : inWin ? '#f59e0b' : undefined
                      }}
                      className={`w-10 h-11 rounded-xl border flex items-center justify-center font-mono font-bold shadow-sm transition-colors ${
                        isCheck
                          ? 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-500 text-cyan-900 dark:text-cyan-100'
                          : inWin
                          ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-100'
                          : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F4EBC3]'
                      }`}
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-lg bg-white dark:bg-[#423834]/90 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-4 shadow-md">
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Bad Character Last Occurrence Table
            </div>
            <div className="flex flex-wrap gap-2">
              {patternInput.split('').map((char, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-[#5C4E49] border border-gray-200 dark:border-[#5C4E49] rounded-lg text-xs font-mono">
                  <span className="text-gray-900 dark:text-[#F0E2A4] font-bold">{char}:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">{idx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 4. LONGEST PALINDROME CANVAS (EXPANDING WINGS & CHAMPION TROPHY)
    if (currentAlgoId === 'longest_palindrome') {
      const bestStr = step.longest || textInput[0] || '';
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          {/* Champion Palindrome Trophy Card */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-rose-500/40 rounded-2xl flex items-center gap-4 shadow-xl">
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-gray-400">Current Longest Palindrome</div>
              <div className="text-2xl font-mono font-extrabold text-rose-300 tracking-wider">
                "{bestStr}" <span className="text-xs font-mono text-gray-400 font-normal">({bestStr.length} characters)</span>
              </div>
            </div>
          </div>

          {/* Text String with Expanding Center & Wings */}
          <div className="w-full max-w-3xl overflow-x-auto p-4 bg-white dark:bg-[#331921]/80 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl flex flex-col items-center shadow-lg">
            <div className="text-xs font-mono text-gray-600 dark:text-[#BCA297] mb-3 font-semibold">
              Expanding Outward from Center [left = {step.currL ?? 0}, right = {step.currR ?? 0}]
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-full">
              {textInput.split('').map((char, idx) => {
                const isCenter = (step.centerL === idx || step.centerR === idx);
                const isLeftWing = step.currL === idx;
                const isRightWing = step.currR === idx;
                const inBestPalindrome = idx >= step.bestStart && idx <= step.bestEnd;

                return (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Top Marker Badges */}
                    <div className="h-5 flex items-center gap-1 mb-1">
                      {isCenter && (
                        <span className="px-1.5 py-0.5 bg-rose-500/20 border border-rose-400 rounded text-[9px] font-mono text-rose-500 dark:text-rose-300 font-bold">
                          📍
                        </span>
                      )}
                      {isLeftWing && (
                        <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-400 rounded text-[9px] font-mono text-amber-600 dark:text-amber-300 font-bold">
                          ⇦ L
                        </span>
                      )}
                      {isRightWing && (
                        <span className="px-1.5 py-0.5 bg-cyan-500/20 border border-cyan-400 rounded text-[9px] font-mono text-cyan-600 dark:text-cyan-300 font-bold">
                          R ⇨
                        </span>
                      )}
                    </div>

                    <motion.div
                      animate={{
                        scale: (isLeftWing || isRightWing) ? 1.2 : isCenter ? 1.1 : 1,
                        borderColor: (isLeftWing || isRightWing) ? '#f43f5e' : isCenter ? '#e11d48' : inBestPalindrome ? '#10b981' : undefined
                      }}
                      className={`w-11 h-12 rounded-xl border flex items-center justify-center font-mono font-extrabold text-base shadow-md transition-colors ${
                        (isLeftWing || isRightWing)
                          ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100'
                          : inBestPalindrome
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                          : isCenter
                          ? 'bg-red-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200'
                          : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F4EBC3]'
                      }`}
                    >
                      {char}
                    </motion.div>

                    <span className="text-[10px] font-mono text-gray-500 dark:text-slate-400 mt-1">{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 5. Z-ALGORITHM CANVAS
    if (currentAlgoId === 'z_algorithm') {
      const s = step.s || textInput;
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-600 dark:text-[#BCA297] mb-2 font-bold">Concatenated String S = P + "$" + T</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {s.split('').map((char, idx) => {
                const inBox = idx >= step.l && idx <= step.r && step.r > 0;
                const isI = step.i === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-gray-500 dark:text-slate-400 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: isI ? 1.15 : 1,
                        borderColor: isI ? '#f59e0b' : inBox ? '#8b5cf6' : undefined
                      }}
                      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold shadow-sm transition-colors ${
                        isI
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-100'
                          : inBox
                          ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-500 text-purple-900 dark:text-purple-100'
                          : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F4EBC3]'
                      }`}
                    >
                      {char}
                    </motion.div>
                    <div className="w-8 h-7 mt-1 border border-gray-200 dark:border-[#5C4E49] bg-gray-50 dark:bg-[#5C4E49]/80 rounded flex items-center justify-center font-mono text-xs text-purple-700 dark:text-purple-300 font-bold">
                      {step.z ? step.z[idx] : 0}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-xs font-mono text-gray-600 dark:text-[#BCA297]">
            Z-Box: [L={step.l ?? 0}, R={step.r ?? 0}] | Purple numbers below characters denote Z[i]
          </div>
        </div>
      );
    }

    // 6. LEVENSHTEIN CANVAS (2D DP GRID)
    if (currentAlgoId === 'levenshtein') {
      const dp = step.dp || [];
      return (
        <div className="flex flex-col items-center gap-4 w-full py-2 overflow-x-auto">
          <div className="text-xs uppercase font-mono tracking-wider text-gray-600 dark:text-[#BCA297] font-bold">2D Dynamic Programming Edit Distance Grid</div>
          <div className="inline-block border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl overflow-hidden bg-white dark:bg-[#331921] p-3 shadow-2xl">
            <table className="border-collapse font-mono text-xs">
              <thead>
                <tr>
                  <th className="p-2.5 border border-gray-200 dark:border-[#5C4E49] bg-gray-50 dark:bg-[#423834] text-gray-400"></th>
                  <th className="p-2.5 border border-gray-200 dark:border-[#5C4E49] bg-gray-50 dark:bg-[#423834] text-gray-700 dark:text-[#BCA297]">ε</th>
                  {secondTextInput.split('').map((c, j) => (
                    <th key={j} className="p-2.5 border border-gray-200 dark:border-[#5C4E49] bg-gray-50 dark:bg-[#423834] text-cyan-700 dark:text-cyan-400 font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2.5 border border-gray-200 dark:border-[#5C4E49] bg-gray-50 dark:bg-[#423834] text-amber-700 dark:text-amber-400 font-bold">
                      {i === 0 ? 'ε' : textInput[i - 1]}
                    </td>
                    {row.map((val, j) => {
                      const isActive = step.activeI === i && step.activeJ === j;
                      return (
                        <td
                          key={j}
                          className={`p-2.5 text-center border font-bold min-w-[36px] transition-all ${
                            isActive
                              ? 'border-cyan-500 bg-cyan-100 dark:bg-cyan-500/30 text-cyan-900 dark:text-white scale-110 ring-2 ring-cyan-400/50'
                              : 'border-gray-200 dark:border-[#5C4E49]/80 text-gray-800 dark:text-[#F0E2A4] bg-white dark:bg-[#423834]/40'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // 7. LCS CANVAS
    if (currentAlgoId === 'lcs') {
      const dp = step.dp || [];
      return (
        <div className="flex flex-col items-center gap-4 w-full py-2 overflow-x-auto">
          <div className="text-xs uppercase font-mono tracking-wider text-gray-600 dark:text-[#BCA297] font-bold">Longest Common Subsequence DP Matrix</div>
          <div className="inline-block border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl overflow-hidden bg-white dark:bg-[#331921] p-3 shadow-2xl">
            <table className="border-collapse font-mono text-xs">
              <thead>
                <tr>
                  <th className="p-2.5 border border-gray-200 dark:border-[#5C4E49] bg-gray-50 dark:bg-[#423834] text-gray-400"></th>
                  <th className="p-2.5 border border-gray-200 dark:border-[#5C4E49] bg-gray-50 dark:bg-[#423834] text-gray-700 dark:text-[#BCA297]">ε</th>
                  {secondTextInput.split('').map((c, j) => (
                    <th key={j} className="p-2.5 border border-gray-200 dark:border-[#5C4E49] bg-gray-50 dark:bg-[#423834] text-emerald-700 dark:text-emerald-400 font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2.5 border border-gray-200 dark:border-[#5C4E49] bg-gray-50 dark:bg-[#423834] text-cyan-700 dark:text-cyan-400 font-bold">
                      {i === 0 ? 'ε' : textInput[i - 1]}
                    </td>
                    {row.map((val, j) => {
                      const isActive = step.activeI === i && step.activeJ === j;
                      return (
                        <td
                          key={j}
                          className={`p-2.5 text-center border font-bold min-w-[36px] ${
                            isActive
                              ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-500/30 text-emerald-900 dark:text-emerald-200 scale-110 ring-2 ring-emerald-400/50'
                              : 'border-gray-200 dark:border-[#5C4E49]/80 text-gray-800 dark:text-[#F0E2A4] bg-white dark:bg-[#423834]/40'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // 8. ANAGRAM SEARCH CANVAS
    if (currentAlgoId === 'anagram_search') {
      const pMap = step.pMap || {};
      const wMap = step.wMap || {};
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-600 dark:text-[#BCA297] mb-2 font-bold">Sliding Frequency Window</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const inWin = idx >= step.windowStart && idx < step.windowStart + patternInput.length;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-gray-500 dark:text-slate-400 mb-1">{idx}</span>
                    <motion.div
                      animate={{
                        scale: inWin ? 1.1 : 1,
                        borderColor: inWin ? (step.isMatch ? '#10b981' : '#f59e0b') : undefined
                      }}
                      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold shadow-sm transition-colors ${
                        inWin
                          ? step.isMatch
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                            : 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-100'
                          : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F4EBC3]'
                      }`}
                    >
                      {char}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <div className="p-3 bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl shadow-xs">
              <div className="text-xs font-mono text-gray-600 dark:text-[#BCA297] mb-1.5 font-bold">Pattern Frequency:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(pMap).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 bg-gray-100 dark:bg-[#5C4E49] border border-gray-200 dark:border-transparent rounded text-xs font-mono text-amber-700 dark:text-amber-300 font-bold">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl shadow-xs">
              <div className="text-xs font-mono text-gray-600 dark:text-[#BCA297] mb-1.5 font-bold">Window Frequency:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(wMap).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 bg-gray-100 dark:bg-[#5C4E49] border border-gray-200 dark:border-transparent rounded text-xs font-mono text-cyan-700 dark:text-cyan-300 font-bold">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 9. RUN-LENGTH ENCODING CANVAS
    if (currentAlgoId === 'run_length') {
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="w-full flex flex-col items-center">
            <div className="text-xs uppercase font-mono tracking-wider text-gray-600 dark:text-[#BCA297] mb-2 font-bold">Original Character Stream</div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-full overflow-x-auto p-2">
              {textInput.split('').map((char, idx) => {
                const isCurrent = step.currentIdx === idx;
                return (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: isCurrent ? 1.15 : 1,
                      borderColor: isCurrent ? '#06b6d4' : undefined
                    }}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold shadow-sm transition-colors ${
                      isCurrent
                        ? 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-500 text-cyan-900 dark:text-cyan-100'
                        : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F4EBC3]'
                    }`}
                  >
                    {char}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-md p-4 bg-white dark:bg-[#423834] border border-cyan-500/30 rounded-xl flex flex-col items-center shadow-md">
            <div className="text-xs font-mono text-gray-600 dark:text-[#BCA297] mb-1 font-semibold">Compressed Output Stream</div>
            <div className="text-2xl font-mono font-extrabold text-cyan-600 dark:text-cyan-400 tracking-wider">
              {step.encoded || '...'}
            </div>
          </div>
        </div>
      );
    }

    // 10. REVERSE WORDS CANVAS
    if (currentAlgoId === 'reverse_words') {
      const words = step.words || textInput.trim().split(/\s+/);
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="text-xs uppercase font-mono tracking-wider text-gray-600 dark:text-[#BCA297] font-bold">Two-Pointer Word Reversal</div>
          <div className="flex flex-wrap gap-3 justify-center p-3">
            {words.map((w, idx) => {
              const isL = step.left === idx;
              const isR = step.right === idx;
              return (
                <motion.div
                  key={idx}
                  animate={{
                    scale: (isL || isR) ? 1.1 : 1,
                    borderColor: (isL || isR) ? '#f59e0b' : undefined
                  }}
                  className={`px-4 py-2.5 rounded-xl border font-mono font-bold text-lg shadow-md transition-colors ${
                    (isL || isR)
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-100'
                      : 'bg-white dark:bg-[#423834] border-gray-200 dark:border-[#5C4E49] text-gray-900 dark:text-[#F4EBC3]'
                  }`}
                >
                  {w}
                  {(isL || isR) && (
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-0.5 text-center font-extrabold">
                      {isL ? 'PTR L' : 'PTR R'}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    // 11. ISOMORPHIC CANVAS
    if (currentAlgoId === 'isomorphic') {
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {textInput.split('').map((c, i) => (
                <div key={i} className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold shadow-xs transition-colors ${
                  step.idx === i ? 'border-amber-500 bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200' : 'border-gray-200 dark:border-[#5C4E49] bg-white dark:bg-[#5C4E49] text-gray-900 dark:text-[#F0E2A4]'
                }`}>{c}</div>
              ))}
            </div>
            <span className="text-gray-500 dark:text-slate-400 font-mono text-xs font-bold">↕ 1-to-1 bijection</span>
            <div className="flex gap-2">
              {secondTextInput.split('').map((c, i) => (
                <div key={i} className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold shadow-xs transition-colors ${
                  step.idx === i ? 'border-cyan-500 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-200' : 'border-gray-200 dark:border-[#5C4E49] bg-white dark:bg-[#5C4E49] text-gray-900 dark:text-[#F0E2A4]'
                }`}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 12. VALID PARENTHESES CANVAS
    const stack = step.stack || [];
    return (
      <div className="flex flex-col items-center gap-6 w-full py-4">
        <div className="flex gap-2 justify-center">
          {textInput.split('').map((c, i) => (
            <div key={i} className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl border-2 text-xl flex items-center justify-center font-mono font-bold shadow-xs transition-colors ${
              step.idx === i ? 'border-cyan-500 bg-cyan-100 dark:bg-cyan-500/30 text-cyan-900 dark:text-white scale-110' : 'border-gray-200 dark:border-[#5C4E49] bg-white dark:bg-[#5C4E49] text-gray-900 dark:text-[#F0E2A4]'
            }`}>{c}</div>
          ))}
        </div>
        <div className="flex flex-col items-center p-4 bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl w-48 shadow-lg">
          <span className="text-xs font-mono text-gray-600 dark:text-[#BCA297] mb-2 font-bold">Stack (LIFO)</span>
          <div className="flex flex-col-reverse gap-1.5 w-full items-center">
            {stack.map((c, i) => (
              <div key={i} className="w-full py-1.5 text-center rounded bg-gray-50 dark:bg-[#5C4E49] border border-gray-200 dark:border-[#5C4E49] font-mono text-sm text-cyan-700 dark:text-cyan-300 font-bold">
                {c}
              </div>
            ))}
            {stack.length === 0 && <span className="text-xs font-mono text-gray-400 italic">Stack Empty</span>}
          </div>
        </div>
      </div>
    );
  };

  // Live Dry-Run Variables Tracker

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[460px] relative">
      {renderCanvas()}
    </div>
  );
}
