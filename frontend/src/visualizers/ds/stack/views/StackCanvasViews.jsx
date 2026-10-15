import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDown, ArrowRight, Check, X, ShieldAlert, Cpu, Hash,
  BarChart3, TrendingUp, Sun, Thermometer, AlertCircle, CheckCircle2,
  Sparkles, Layers
} from 'lucide-react';

export default function StackCanvasViews({
  activeAlgo,
  basicStack,
  peekingIdx,
  maxCapacity,
  parenTokens,
  parenActiveIdx,
  parenthesesStack,
  parenStatus,
  parenPairMap,
  postfixTokens,
  postfixActiveIdx,
  postfixStack,
  postfixResult,
  infixTokens,
  infixActiveIdx,
  infixStack,
  infixOutput,
  ngeArray,
  ngeActiveIdx,
  ngeStack,
  ngeResults,
  minMainStack,
  minAuxStack,
  tempTemps,
  tempActiveIdx,
  tempStack,
  tempResult,
  histHeights,
  histActiveIdx,
  histStack,
  histMaxArea,
  histActiveRect,
  spanPrices,
  spanActiveIdx,
  spanStack,
  spanResults,
  wildcardTokens,
  wildcardActiveIdx,
  wildcardOpenStack,
  wildcardStarStack,
  wildcardStatus,
  wildcardMatches
}) {
  const highlightIdx = peekingIdx;
  const parenStack = parenthesesStack || [];
  const postfixLastOp = postfixResult;
  const infixOpStack = infixStack || [];
  const postfixOutput = infixOutput || [];
  const ngeResult = ngeResults || [];
  const tempArray = tempTemps || [];
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[460px]">
        {activeAlgo === 'basic' && (
          <div className="flex-1 w-full h-full min-h-[550px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-2xl">
            <div className="flex items-center gap-1.5 text-teal-500 text-xs font-black mb-2 animate-bounce">
              <ArrowDown size={18} />
              <span>TOP OF STACK</span>
            </div>

            <div className="w-72 sm:w-80 min-h-[340px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-3xl p-4 flex flex-col-reverse gap-2.5 bg-black/5 dark:bg-black/40 relative shadow-inner">
              <AnimatePresence>
                {basicStack.map((val, idx) => {
                  const isTop = idx === basicStack.length - 1;
                  const isHighlighted = highlightIdx === idx;

                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ y: -60, opacity: 0, scale: 0.8 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1, 
                        scale: isHighlighted ? 1.06 : 1,
                        transition: { type: 'spring', stiffness: 350, damping: 25 }
                      }}
                      exit={{ y: -60, opacity: 0, scale: 0.8 }}
                      className={`h-11 rounded-xl flex items-center justify-between px-4 font-black text-sm border shadow-md transition-all ${
                        isHighlighted
                          ? 'bg-amber-500 text-black border-amber-400 ring-2 ring-amber-400'
                          : isTop
                          ? 'bg-teal-500 text-black border-teal-300 shadow-teal-500/30'
                          : 'bg-white/90 dark:bg-[#1f1f23] text-gray-900 dark:text-white border-gray-300 dark:border-white/10'
                      }`}
                    >
                      <span className="text-xs font-mono opacity-60">[{idx}]</span>
                      <span className="text-base font-mono">{val}</span>
                      {isTop && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/20 text-black">
                          TOP
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {basicStack.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-xs font-bold italic py-8">
                  Stack is Empty (Underflow)
                </div>
              )}
            </div>

            <div className="mt-4 text-xs font-bold text-gray-400 flex items-center gap-2">
              <span>Capacity: {basicStack.length} / {maxCapacity}</span>
              <div className="w-28 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${(basicStack.length / maxCapacity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: BALANCED PARENTHESES */}
        {activeAlgo === 'parentheses' && (
          <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Scanned String Tokens Banner */}
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Scanned Character Stream
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {parenTokens.map((char, idx) => {
                  const isActive = parenActiveIdx === idx;
                  const isProcessed = parenActiveIdx > idx;

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.25 : 1 }}
                      className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-black text-lg border transition-all ${
                        isActive
                          ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/40 ring-2 ring-amber-400'
                          : isProcessed
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/5'
                          : 'bg-white dark:bg-[#18181b] text-gray-800 dark:text-gray-200 border-gray-300 dark:border-white/15'
                      }`}
                    >
                      <span>{char}</span>
                      <span className="text-[9px] opacity-60">[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Parentheses Stack Chamber */}
            <div className="flex flex-col items-center">
              <div className="text-teal-500 text-xs font-black mb-1 flex items-center gap-1">
                <ArrowDown size={14} /> Open Brackets in Stack
              </div>
              <div className="w-48 min-h-[160px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                <AnimatePresence>
                  {parenStack.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="h-9 rounded-lg bg-teal-500 text-black font-mono font-black text-base flex items-center justify-between px-3 shadow-sm"
                    >
                      <span className="text-[10px] opacity-75">#{i}</span>
                      <span>{c}</span>
                      <span className="text-[9px] uppercase tracking-wider font-sans">Open</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {parenStack.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>

            {/* Verdict Chip */}
            <div className="flex items-center gap-2">
              {parenStatus === 'valid' && (
                <div className="px-4 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center gap-2 shadow-sm">
                  <CheckCircle2 size={16} /> Expression is Valid & Balanced!
                </div>
              )}
              {parenStatus === 'invalid' && (
                <div className="px-4 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400 font-black text-xs flex items-center gap-2 shadow-sm">
                  <AlertCircle size={16} /> Syntax Error: Unbalanced Bracket detected!
                </div>
              )}
            </div>
          </div>
        )}

        {/* CASE 3: POSTFIX (RPN) EVALUATION */}
        {activeAlgo === 'postfix' && (
          <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Tokens Stream */}
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Postfix Tokens Stream
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {postfixTokens.map((t, idx) => {
                  const isActive = postfixActiveIdx === idx;
                  const isProcessed = postfixActiveIdx > idx;
                  const isOperator = ['+', '-', '*', '/', '^'].includes(t);

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.25 : 1 }}
                      className={`min-w-10 h-11 px-2.5 rounded-xl flex flex-col items-center justify-center font-mono font-black text-base border transition-all ${
                        isActive
                          ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/40 ring-2 ring-amber-400'
                          : isProcessed
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/5'
                          : isOperator
                          ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                          : 'bg-white dark:bg-[#18181b] text-gray-800 dark:text-gray-200 border-gray-300 dark:border-white/15'
                      }`}
                    >
                      <span>{t}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Arithmetic Spark banner if operator active */}
            {postfixLastOp && typeof postfixLastOp === 'object' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-4 py-2 rounded-xl bg-teal-500/15 border border-teal-500/30 font-mono text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>Evaluating: {postfixLastOp.a} {postfixLastOp.op} {postfixLastOp.b} = <strong className="text-sm font-black text-teal-500">{postfixLastOp.result}</strong></span>
              </motion.div>
            )}

            {/* Postfix Operand Stack */}
            <div className="flex flex-col items-center">
              <div className="text-teal-500 text-xs font-black mb-1 flex items-center gap-1">
                <ArrowDown size={14} /> Evaluation Operand Stack
              </div>
              <div className="w-56 min-h-[170px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                <AnimatePresence>
                  {postfixStack.map((val, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className={`h-9 rounded-lg font-mono font-black text-sm flex items-center justify-between px-3 shadow-sm ${
                        i === postfixStack.length - 1
                          ? 'bg-teal-500 text-black shadow-teal-500/30'
                          : 'bg-white/90 dark:bg-[#1f1f23] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <span className="text-[10px] opacity-60">[{i}]</span>
                      <span className="text-base">{val}</span>
                      {i === postfixStack.length - 1 && (
                        <span className="text-[9px] uppercase tracking-wider font-sans bg-black/20 px-1 rounded">TOP</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {postfixStack.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CASE 4: INFIX TO POSTFIX (SHUNTING-YARD) */}
        {activeAlgo === 'infixToPostfix' && (
          <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Infix Input Tokens */}
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Infix Expression Stream
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {infixTokens.map((t, idx) => {
                  const isActive = infixActiveIdx === idx;
                  const isProcessed = infixActiveIdx > idx;

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.25 : 1 }}
                      className={`min-w-9 h-10 px-2 rounded-xl flex flex-col items-center justify-center font-mono font-black text-base border transition-all ${
                        isActive
                          ? 'bg-amber-500 text-black border-amber-300 shadow-md ring-2 ring-amber-400'
                          : isProcessed
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent'
                          : 'bg-white dark:bg-[#18181b] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <span>{t}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Dual Stage: Operator Stack + Postfix Output Stream */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              {/* Operator Stack */}
              <div className="flex flex-col items-center">
                <div className="text-teal-500 text-xs font-black mb-1 flex items-center gap-1">
                  <ArrowDown size={14} /> Operator Waiting Stack
                </div>
                <div className="w-48 min-h-[140px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                  <AnimatePresence>
                    {infixOpStack.map((op, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="h-8 rounded-lg bg-teal-500 text-black font-mono font-black text-base flex items-center justify-between px-3"
                      >
                        <span className="text-[10px] opacity-75">#{i}</span>
                        <span>{op}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {infixOpStack.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                      No Operators in Stack
                    </div>
                  )}
                </div>
              </div>

              {/* Output Postfix Buffer */}
              <div className="flex flex-col items-center">
                <div className="text-cyan-500 text-xs font-black mb-1 flex items-center gap-1">
                  <ArrowRight size={14} /> Resulting Postfix Stream
                </div>
                <div className="w-full min-h-[140px] border-2 border-dashed border-cyan-500/40 rounded-2xl p-3 flex flex-wrap gap-2 items-center bg-cyan-500/5">
                  <AnimatePresence>
                    {postfixOutput.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-9 px-3 rounded-lg bg-cyan-500 text-black font-mono font-black text-sm flex items-center justify-center shadow-xs"
                      >
                        {t}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {postfixOutput.length === 0 && (
                    <div className="text-gray-400 text-xs italic font-bold">
                      Output buffer is empty...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE 5: NEXT GREATER ELEMENT */}
        {activeAlgo === 'nextGreater' && (
          <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Input Array Elements */}
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Array Elements with Monotonic Pointer
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {ngeArray.map((val, idx) => {
                  const isActive = ngeActiveIdx === idx;
                  const isResolved = ngeResult[idx] !== null;

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.25 : 1 }}
                      className={`w-14 h-16 rounded-xl flex flex-col items-center justify-between p-1.5 border transition-all font-mono ${
                        isActive
                          ? 'bg-amber-500 text-black border-amber-300 shadow-lg ring-2 ring-amber-400'
                          : isResolved
                          ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
                          : 'bg-white dark:bg-[#18181b] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <span className="text-[10px] opacity-60">[{idx}]</span>
                      <span className="text-lg font-black">{val}</span>
                      <span className="text-[9px] font-bold text-gray-400">
                        NGE: {ngeResult[idx] !== null ? ngeResult[idx] : '?'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Monotonic Decreasing Stack */}
            <div className="flex flex-col items-center">
              <div className="text-teal-500 text-xs font-black mb-1 flex items-center gap-1">
                <ArrowDown size={14} /> Monotonic Decreasing Stack (Indices)
              </div>
              <div className="w-60 min-h-[160px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                <AnimatePresence>
                  {ngeStack.map((idxVal, i) => (
                    <motion.div
                      key={idxVal}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="h-9 rounded-lg bg-teal-500 text-black font-mono font-black text-sm flex items-center justify-between px-3"
                    >
                      <span className="text-xs opacity-75">idx: {idxVal}</span>
                      <span className="text-base font-black">val: {ngeArray[idxVal]}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {ngeStack.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CASE 6: MIN STACK */}
        {activeAlgo === 'minStack' && (
          <div className="flex-1 w-full h-full min-h-[550px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">
              {/* Primary Main Stack */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-teal-500 text-xs font-black mb-2">
                  <Layers size={16} />
                  <span>MAIN STACK</span>
                </div>
                <div className="w-48 min-h-[220px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-2 bg-black/5 dark:bg-black/40">
                  <AnimatePresence>
                    {minMainStack.map((val, idx) => (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        className="h-10 rounded-xl bg-teal-500 text-black font-mono font-black text-sm flex items-center justify-between px-3"
                      >
                        <span className="text-xs opacity-70">[{idx}]</span>
                        <span className="text-base">{val}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {minMainStack.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic">
                      Empty
                    </div>
                  )}
                </div>
              </div>

              {/* Auxiliary Min Stack */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-black mb-2">
                  <ShieldAlert size={16} />
                  <span>RUNNING MIN STACK</span>
                </div>
                <div className="w-48 min-h-[220px] border-b-4 border-l-4 border-r-4 border-amber-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-2 bg-black/5 dark:bg-black/40">
                  <AnimatePresence>
                    {minAuxStack.map((minVal, idx) => (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        className="h-10 rounded-xl bg-amber-500 text-black font-mono font-black text-sm flex items-center justify-between px-3 ring-2 ring-amber-400"
                      >
                        <span className="text-xs opacity-70">min:</span>
                        <span className="text-base">{minVal}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {minAuxStack.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-2">
              <Cpu size={16} />
              <span>O(1) Guarantee: Top of Min Stack is ALWAYS the global minimum element of the current stack!</span>
            </div>
          </div>
        )}

        {/* CASE 7: DAILY TEMPERATURES */}
        {activeAlgo === 'dailyTemp' && (
          <div className="flex-1 min-h-[480px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Day Temperature Bars & Cards */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Sun size={15} className="text-amber-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Daily Temperatures Sequence & Wait Days
                </span>
              </div>
              <div className="flex items-end gap-2 sm:gap-3 flex-wrap justify-center pt-4">
                {tempArray.map((temp, idx) => {
                  const isActive = tempActiveIdx === idx;
                  const wait = tempResult[idx];
                  const hasResolved = wait > 0;
                  const inStack = tempStack.includes(idx);

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      {/* Wait days pill badge */}
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all ${
                        hasResolved
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-black'
                          : isActive
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/30'
                          : 'bg-black/5 dark:bg-white/5 text-gray-400 border-transparent'
                      }`}>
                        {hasResolved ? `+${wait}d` : inStack ? 'waiting' : '0d'}
                      </span>

                      {/* Visual temperature bar */}
                      <div className="w-12 sm:w-14 h-32 bg-gray-100 dark:bg-white/5 rounded-2xl p-1.5 flex flex-col justify-end border border-gray-200 dark:border-white/10 relative overflow-hidden">
                        <div
                          className={`w-full rounded-xl transition-all duration-300 flex items-center justify-center font-mono font-bold text-xs ${
                            isActive
                              ? 'bg-gradient-to-t from-amber-500 to-rose-500 text-white shadow-lg'
                              : inStack
                              ? 'bg-[#AB526B] text-white'
                              : hasResolved
                              ? 'bg-[#D3DFC8] dark:bg-[#5C4E49] text-gray-800 dark:text-gray-100'
                              : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                          }`}
                          style={{ height: `${Math.min(100, Math.max(25, (temp / 100) * 100))}%` }}
                        >
                          {temp}°
                        </div>
                      </div>

                      {/* Index identifier */}
                      <span className="text-[10px] font-mono text-gray-400 font-bold">
                        Day {idx}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Monotonic Decreasing Stack of Day Indices */}
            <div className="flex flex-col items-center">
              <div className="text-[#AB526B] dark:text-[#F0E2A4] text-xs font-black mb-1 flex items-center gap-1.5">
                <ArrowDown size={14} />
                <span>Monotonic Decreasing Stack (Day Indices & Temps)</span>
              </div>
              <div className="w-72 min-h-[140px] border-b-4 border-l-4 border-r-4 border-[#AB526B]/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                <AnimatePresence>
                  {tempStack.map((dayIdx) => (
                    <motion.div
                      key={dayIdx}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="h-9 rounded-xl bg-[#AB526B] text-white font-mono font-bold text-xs flex items-center justify-between px-3.5 shadow-sm"
                    >
                      <span className="opacity-80">Day [{dayIdx}]</span>
                      <span className="text-sm font-black">{tempArray[dayIdx]}°F</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {tempStack.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CASE 8: LARGEST RECTANGLE IN HISTOGRAM */}
        {activeAlgo === 'histogram' && (
          <div className="flex-1 min-h-[480px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Histogram Bars Chart */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="flex items-center justify-between w-full max-w-xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 size={15} className="text-[#AB526B]" /> Histogram Height Bars
                </span>
                <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Max Area: {histMaxArea}
                </span>
              </div>

              {/* Graphical Bar Container with Area Overlay */}
              <div className="relative w-full max-w-xl h-52 flex items-end justify-center gap-2 sm:gap-3 pt-6 px-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                {histHeights.map((h, idx) => {
                  const isActive = histActiveIdx === idx;
                  const inStack = histStack.includes(idx);
                  const inBestRect = histActiveRect && idx >= histActiveRect.left && idx <= histActiveRect.right;
                  const maxHeight = Math.max(...histHeights, 1);
                  const barHeightPercent = (h / maxHeight) * 80;

                  return (
                    <motion.div
                      key={idx}
                      className="flex-1 max-w-[48px] flex flex-col items-center justify-end relative h-full"
                    >
                      {/* Height value label */}
                      <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-300 mb-1">
                        {h}
                      </span>

                      {/* Bar Column */}
                      <motion.div
                        animate={{ scale: isActive ? 1.05 : 1 }}
                        className={`w-full rounded-t-xl transition-all duration-300 flex flex-col items-center justify-start pt-2 border ${
                          inBestRect
                            ? 'bg-[#AB526B] text-white border-white/40 ring-2 ring-[#AB526B]/50'
                            : inStack
                            ? 'bg-[#D3DFC8] text-gray-800 dark:bg-[#5C4E49] dark:text-white border-[#AB526B]/30'
                            : 'bg-white/80 dark:bg-white/10 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-white/10'
                        }`}
                        style={{ height: `${Math.max(15, barHeightPercent)}%` }}
                      />

                      {/* Index underneath */}
                      <span className="text-[9px] font-mono text-gray-400 mt-1.5 font-bold">
                        [{idx}]
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Monotonic Increasing Heights Stack */}
            <div className="flex flex-col items-center">
              <div className="text-[#AB526B] dark:text-[#F0E2A4] text-xs font-black mb-1 flex items-center gap-1.5">
                <ArrowDown size={14} />
                <span>Monotonic Increasing Height Stack (Indices)</span>
              </div>
              <div className="w-64 min-h-[130px] border-b-4 border-l-4 border-r-4 border-[#AB526B]/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                <AnimatePresence>
                  {histStack.map((barIdx) => (
                    <motion.div
                      key={barIdx}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="h-8 rounded-xl bg-[#AB526B] text-white font-mono font-bold text-xs flex items-center justify-between px-3 shadow-sm"
                    >
                      <span className="opacity-80">Index [{barIdx}]</span>
                      <span className="font-black">Height: {histHeights[barIdx]}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {histStack.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CASE 9: ONLINE STOCK SPAN */}
        {activeAlgo === 'stockSpan' && (
          <div className="flex-1 min-h-[480px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Daily Price Cards & Spans */}
            <div className="w-full flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-[#AB526B]" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  Daily Stock Price Stream & Calculated Span
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center pt-2">
                {spanPrices.map((price, idx) => {
                  const isActive = spanActiveIdx === idx;
                  const span = spanResults[idx];
                  const hasSpan = span !== null;

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      className={`w-16 h-20 rounded-2xl flex flex-col items-center justify-between p-2 font-mono border transition-all ${
                        isActive
                          ? 'bg-[#AB526B] text-white border-[#AB526B] shadow-lg ring-2 ring-[#AB526B]/50'
                          : hasSpan
                          ? 'bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/10'
                          : 'bg-black/5 dark:bg-white/5 text-gray-400 border-dashed border-gray-300 dark:border-white/10'
                      }`}
                    >
                      <span className="text-[9px] opacity-70">Day {idx}</span>
                      <span className="text-base font-black">${price}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        hasSpan
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-400'
                      }`}>
                        {hasSpan ? `span: ${span}` : 'pending'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Monotonic Decreasing Stack storing [price, span] */}
            <div className="flex flex-col items-center">
              <div className="text-[#AB526B] dark:text-[#F0E2A4] text-xs font-black mb-1 flex items-center gap-1.5">
                <ArrowDown size={14} />
                <span>Monotonic Stack: (Price, Accumulated Span)</span>
              </div>
              <div className="w-72 min-h-[140px] border-b-4 border-l-4 border-r-4 border-[#AB526B]/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                <AnimatePresence>
                  {spanStack.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="h-9 rounded-xl bg-[#AB526B] text-white font-mono font-bold text-xs flex items-center justify-between px-3.5 shadow-sm"
                    >
                      <span>Day [{item.dayIdx}]: ${item.price}</span>
                      <span className="px-2 py-0.5 rounded-md bg-black/20 text-white font-black text-[11px]">
                        Span: {item.span}d
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {spanStack.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CASE 10: VALID PARENTHESES WITH WILDCARDS */}
        {activeAlgo === 'validParenWildcard' && (
          <div className="flex-1 min-h-[480px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Scanned Wildcard Tokens */}
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Character Token Stream (with Wildcards)
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center pt-2">
                {wildcardTokens.map((char, idx) => {
                  const isActive = wildcardActiveIdx === idx;
                  const isProcessed = wildcardActiveIdx > idx;

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.25 : 1 }}
                      className={`w-12 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-xl border transition-all ${
                        isActive
                          ? 'bg-[#AB526B] text-white border-[#AB526B] shadow-lg ring-2 ring-[#AB526B]/50'
                          : char === '*'
                          ? 'bg-[#F0E2A4]/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30'
                          : isProcessed
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/5'
                          : 'bg-white dark:bg-[#18181b] text-gray-800 dark:text-gray-200 border-gray-300 dark:border-white/15'
                      }`}
                    >
                      <span>{char}</span>
                      <span className="text-[9px] opacity-60">[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Dual Stacks Chamber: Open '(' Stack and Star '*' Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
              {/* Left Stack: Open Parentheses '(' */}
              <div className="flex flex-col items-center">
                <div className="text-[#AB526B] dark:text-[#F0E2A4] text-xs font-black mb-1 flex items-center gap-1">
                  <ArrowDown size={14} /> Open '(' Stack (Indices)
                </div>
                <div className="w-48 min-h-[140px] border-b-4 border-l-4 border-r-4 border-[#AB526B]/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                  <AnimatePresence>
                    {wildcardOpenStack.map((idxVal) => (
                      <motion.div
                        key={idxVal}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="h-8 rounded-xl bg-[#AB526B] text-white font-mono font-bold text-xs flex items-center justify-between px-3 shadow-sm"
                      >
                        <span>Index: {idxVal}</span>
                        <span className="font-black text-sm">'('</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {wildcardOpenStack.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                      Stack is Empty
                    </div>
                  )}
                </div>
              </div>

              {/* Right Stack: Star '*' Wildcards */}
              <div className="flex flex-col items-center">
                <div className="text-amber-600 dark:text-amber-400 text-xs font-black mb-1 flex items-center gap-1">
                  <ArrowDown size={14} /> Wildcard '*' Stack (Indices)
                </div>
                <div className="w-48 min-h-[140px] border-b-4 border-l-4 border-r-4 border-amber-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                  <AnimatePresence>
                    {wildcardStarStack.map((idxVal) => (
                      <motion.div
                        key={idxVal}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="h-8 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs flex items-center justify-between px-3 shadow-sm"
                      >
                        <span className="opacity-75">idx: {idxVal}</span>
                        <span className="font-black text-sm">'*'</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {wildcardStarStack.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                      Stack is Empty
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
