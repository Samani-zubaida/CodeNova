import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Eye, Compass, Layers, CheckCircle, AlertCircle, ArrowDown
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';

const playSynthTone = (type = 'push', isMuted = false) => {
  if (isMuted || typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'push') {
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'pop') {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'peek') {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
    }
  } catch (e) {}
};

const CODE_SNIPPETS = {
  javascript: `// Stack Implementation (LIFO)
class Stack {
  constructor() {
    this.items = [];
  }
  
  // Push O(1)
  push(element) {
    this.items.push(element);
  }
  
  // Pop O(1)
  pop() {
    if (this.isEmpty()) return "Underflow";
    return this.items.pop();
  }
  
  // Peek O(1)
  peek() {
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}`,
  python: `# Stack in Python (LIFO)
class Stack:
    def __init__(self):
        self.items = []
        
    def push(self, item):
        self.items.append(item)
        
    def pop(self):
        if not self.items:
            raise IndexError("pop from empty stack")
        return self.items.pop()
        
    def peek(self):
        return self.items[-1] if self.items else None`,
  cpp: `// C++ std::stack
#include <stack>

std::stack<int> s;
s.push(10);     // Push O(1)
int top = s.top(); // Peek O(1)
s.pop();        // Pop O(1)`,
  java: `// Java Stack
import java.util.Stack;

Stack<Integer> stack = new Stack<>();
stack.push(10);
int top = stack.peek();
stack.pop();`
};

export default function StackVisualizer() {
  const [stack, setStack] = useState([15, 30, 45, 60]);
  const [inputValue, setInputValue] = useState('75');
  const [maxCapacity] = useState(8);
  const [highlightIdx, setHighlightIdx] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [logs, setLogs] = useState(['> Stack initialized with 4 items.']);

  // ELI5 state
  const [currentExplanation, setCurrentExplanation] = useState({
    action: "Stack Ready (LIFO: Last-In, First-Out)",
    intuition: "Items are pushed onto and popped from the TOP only. The most recently added item is always accessed first.",
    next: "Type a value and click 'Push', or click 'Pop' to remove the top item."
  });
  const [phase, setPhase] = useState('IDLE');
  const [activeLine, setActiveLine] = useState(-1);

  const addLog = (msg) => setLogs(prev => [...prev.slice(-15), msg]);

  // Dynamic Push
  const handlePush = () => {
    const val = Number(inputValue);
    if (isNaN(val)) return;

    if (stack.length >= maxCapacity) {
      setCurrentExplanation({
        action: `Stack Overflow: Cannot push [${val}]!`,
        intuition: `Stack has reached its maximum allocated capacity of ${maxCapacity} elements.`,
        next: "Pop elements to free memory."
      });
      setPhase('OVERFLOW');
      playSynthTone('pop', isMuted);
      addLog(`> ERROR: Stack Overflow! (Max: ${maxCapacity})`);
      return;
    }

    const newStack = [...stack, val];
    setStack(newStack);
    setHighlightIdx(newStack.length - 1);
    setCurrentExplanation({
      action: `Pushed [${val}] onto TOP of stack (Index ${newStack.length - 1})`,
      intuition: "In LIFO data structures, new elements are placed directly on top in constant O(1) time.",
      next: `Top pointer updated to [${val}]. Stack size is now ${newStack.length}.`
    });
    setPhase('PUSHED');
    setActiveLine(8);
    playSynthTone('push', isMuted);
    addLog(`> push(${val}): Top item is now ${val}.`);

    setTimeout(() => setHighlightIdx(null), 1200);
  };

  // Dynamic Pop
  const handlePop = () => {
    if (stack.length === 0) {
      setCurrentExplanation({
        action: "Stack Underflow: Cannot pop from an empty stack!",
        intuition: "Stack contains 0 elements. Popping from an empty collection is undefined.",
        next: "Push elements before attempting to pop."
      });
      setPhase('UNDERFLOW');
      addLog(`> ERROR: Stack Underflow!`);
      return;
    }

    const poppedVal = stack[stack.length - 1];
    setHighlightIdx(stack.length - 1);
    setPhase('POPPING');
    playSynthTone('pop', isMuted);

    setTimeout(() => {
      const newStack = stack.slice(0, -1);
      setStack(newStack);
      setHighlightIdx(null);
      setCurrentExplanation({
        action: `Popped [${poppedVal}] from TOP of stack!`,
        intuition: `LIFO principle: The last element pushed was the first one removed. Takes O(1) time.`,
        next: newStack.length > 0 ? `New top element is [${newStack[newStack.length - 1]}].` : "Stack is now empty."
      });
      setPhase('POPPED');
      setActiveLine(14);
      addLog(`> pop(): Removed ${poppedVal}.`);
    }, 400);
  };

  // Peek
  const handlePeek = () => {
    if (stack.length === 0) return;
    const topVal = stack[stack.length - 1];
    setHighlightIdx(stack.length - 1);
    setCurrentExplanation({
      action: `Peek: Current TOP element is [${topVal}]`,
      intuition: "Peek inspects the element at the top of the stack without removing it (O(1) time).",
      next: "Stack state remains unchanged."
    });
    setPhase('PEEK');
    setActiveLine(19);
    playSynthTone('peek', isMuted);
    addLog(`> peek(): Returned top element ${topVal}.`);
    setTimeout(() => setHighlightIdx(null), 1200);
  };

  // Application: Balanced Parentheses Demo
  const handleBalancedParentheses = async () => {
    const expr = "{[()]}";
    addLog(`> Testing Balanced Parentheses: "${expr}"`);
    setCurrentExplanation({
      action: `Evaluating string "${expr}" for balanced brackets`,
      intuition: "An opening bracket is pushed onto the stack. A closing bracket must match the top of the stack.",
      next: "Simulating step-by-step bracket matching."
    });
    setPhase('EVALUATING');

    const tempStack = [];
    const pairs = { '}': '{', ']': '[', ')': '(' };

    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];
      if (['{', '[', '('].includes(ch)) {
        tempStack.push(ch);
        playSynthTone('push', isMuted);
      } else {
        const top = tempStack.pop();
        if (top !== pairs[ch]) {
          addLog(`> Unbalanced at index ${i}: '${ch}' does not match '${top}'`);
          return;
        }
        playSynthTone('pop', isMuted);
      }
      await new Promise(r => setTimeout(r, 400));
    }
    addLog(`> Result: Valid & Balanced expression!`);
    setCurrentExplanation({
      action: "Expression is 100% BALANCED!",
      intuition: "All opening brackets were matched and popped in exact reverse order.",
      next: "Stack cleared."
    });
    setPhase('BALANCED');
  };

  // Reset
  const handleReset = () => {
    setStack([15, 30, 45, 60]);
    setHighlightIdx(null);
    setPhase('IDLE');
    setCurrentExplanation({
      action: "Stack reset to default 4 elements.",
      intuition: "Items ready for LIFO operations.",
      next: "Click Push or Pop."
    });
    addLog(`> Stack reset.`);
  };

  const controlsSlot = (
    <div className="flex flex-col gap-4">
      {/* Push Section */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-teal-500/5 border border-teal-500/20">
        <span className="text-xs font-black text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
          <Plus size={14} /> Push Element (O(1))
        </span>
        <div className="flex gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="flex-1 bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
            placeholder="Value"
          />
          <button
            onClick={handlePush}
            className="py-1.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Push Top
          </button>
        </div>
      </div>

      {/* Pop & Peek */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handlePop}
          className="py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Trash2 size={13} /> Pop Top (O(1))
        </button>
        <button
          onClick={handlePeek}
          className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Eye size={13} /> Peek (O(1))
        </button>
      </div>

      {/* Practical Applications */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Applications</label>
        <button
          onClick={handleBalancedParentheses}
          className="py-2 px-3 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold hover:border-teal-500 transition-all text-left flex items-center justify-between"
        >
          <span>Balanced Parentheses ("{`{[()]}`}")</span>
          <CheckCircle size={13} className="text-teal-500" />
        </button>
      </div>

      {/* Sound & Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-teal-400" />}
          <span>{isMuted ? 'Muted' : 'Sound Active'}</span>
        </button>
        <button
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} /> Reset Stack
        </button>
      </div>
    </div>
  );

  return (
    <ResponsiveVisualizerShell
      title="Stack"
      subtitle="Last-In, First-Out (LIFO) linear data structure where all insertions and deletions occur at the top."
      currentPath="/visualizer/stack"
      category="ds"
      controls={controlsSlot}
      metrics={
        <ComplexityBadge
          timeComplexity={{
            average: "Push: O(1) | Pop: O(1) | Peek: O(1)",
            worst: "O(1) Constant Time"
          }}
          spaceComplexity={`O(n) - Current: ${stack.length}/${maxCapacity}`}
          activeOperation={phase}
          notes="Stack operations only touch the memory element at top."
        />
      }
      codeInspector={
        <CodeInspector
          codeSnippets={CODE_SNIPPETS}
          activeLine={activeLine}
          variables={{ topIndex: stack.length - 1, size: stack.length }}
          title="Stack Source Logic"
        />
      }
      consoleOutput={logs}
    >
      <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto w-full max-w-4xl mx-auto gap-4">
        {/* ELI5 Intuition Card */}
        <div className="bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md border border-teal-500/20 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-teal-500" />
              <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                ELI5 Intuition: Stack Container
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-teal-500/10 text-teal-500 border border-teal-500/30">
              PHASE: {phase}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/5 border border-teal-500/10">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1">
                🎯 What's Happening
              </span>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {currentExplanation.action}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                💡 Why It Happens
              </span>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {currentExplanation.intuition}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                🔮 What Happens Next
              </span>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {currentExplanation.next}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Stack Bucket Canvas */}
        <div className="flex-1 min-h-[360px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative shadow-inner">
          <div className="flex flex-col items-center">
            {/* Top Pointer Badge */}
            <div className="flex items-center gap-1.5 text-teal-500 text-xs font-black mb-2 animate-bounce">
              <ArrowDown size={18} />
              <span>TOP OF STACK</span>
            </div>

            {/* Vertical Stack Chamber */}
            <div className="w-56 min-h-[260px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-3 flex flex-col-reverse gap-2.5 bg-black/5 dark:bg-black/40 relative">
              <AnimatePresence>
                {stack.map((val, idx) => {
                  const isTop = idx === stack.length - 1;
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
                          ? 'bg-amber-500 text-black border-amber-400 shadow-amber-500/40 ring-2 ring-amber-400'
                          : isTop
                            ? 'bg-teal-500 text-black border-teal-300 shadow-teal-500/30'
                            : 'bg-white/90 dark:bg-[#1f1f23] text-gray-900 dark:text-white border-gray-300 dark:border-white/10'
                      }`}
                    >
                      <span className="text-xs font-mono opacity-60">[{idx}]</span>
                      <span className="text-base">{val}</span>
                      {isTop && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/20 text-black">
                          TOP
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {stack.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-xs font-bold italic py-8">
                  Stack is Empty (Underflow)
                </div>
              )}
            </div>

            {/* Capacity gauge */}
            <div className="mt-3 text-xs font-bold text-gray-400 flex items-center gap-2">
              <span>Capacity: {stack.length} / {maxCapacity}</span>
              <div className="w-24 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${(stack.length / maxCapacity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveVisualizerShell>
  );
}
