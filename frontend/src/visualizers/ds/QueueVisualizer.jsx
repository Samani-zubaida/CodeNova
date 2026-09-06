import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Eye, Compass, Layers, CheckCircle, RefreshCw, ArrowRight, ArrowLeft
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';

const playSynthTone = (type = 'enqueue', isMuted = false) => {
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

    if (type === 'enqueue') {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'dequeue') {
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    }
  } catch (e) {}
};

const CODE_SNIPPETS = {
  javascript: `// Queue Implementation (FIFO)
class Queue {
  constructor() {
    this.items = [];
  }
  
  // Enqueue O(1)
  enqueue(item) {
    this.items.push(item);
  }
  
  // Dequeue O(1) amortized
  dequeue() {
    if (this.isEmpty()) return "Underflow";
    return this.items.shift();
  }
  
  front() {
    return this.items[0];
  }
}`,
  python: `# Queue in Python (collections.deque)
from collections import deque

class Queue:
    def __init__(self):
        self.q = deque()
        
    def enqueue(self, val):
        self.q.append(val)
        
    def dequeue(self):
        if not self.q:
            raise IndexError("Queue is empty")
        return self.q.popleft()`,
  cpp: `// C++ std::queue
#include <queue>

std::queue<int> q;
q.push(10);      // Enqueue
int front = q.front();
q.pop();         // Dequeue`,
  java: `// Java Queue
import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> q = new LinkedList<>();
q.offer(10);
int front = q.poll();`
};

export default function QueueVisualizer() {
  const [queueMode, setQueueMode] = useState('fifo'); // 'fifo' | 'circular' | 'deque'
  const [queue, setQueue] = useState([12, 24, 36, 48]);
  const [inputValue, setInputValue] = useState('60');
  const [maxCapacity] = useState(8);
  const [highlightIdx, setHighlightIdx] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [logs, setLogs] = useState(['> Queue initialized with 4 items.']);

  const [currentExplanation, setCurrentExplanation] = useState({
    action: "Queue Ready (FIFO: First-In, First-Out)",
    intuition: "Elements enter at the REAR and depart from the FRONT, preserving arrival sequence.",
    next: "Type a value and click 'Enqueue', or click 'Dequeue' to remove the front item."
  });
  const [phase, setPhase] = useState('IDLE');
  const [activeLine, setActiveLine] = useState(-1);

  const addLog = (msg) => setLogs(prev => [...prev.slice(-15), msg]);

  // Enqueue
  const handleEnqueue = () => {
    const val = Number(inputValue);
    if (isNaN(val)) return;

    if (queue.length >= maxCapacity) {
      setCurrentExplanation({
        action: `Queue Overflow: Capacity limit (${maxCapacity}) reached!`,
        intuition: "Queue is completely full. Dequeue items before inserting new elements.",
        next: "Call Dequeue to free space."
      });
      setPhase('OVERFLOW');
      addLog(`> ERROR: Queue Overflow!`);
      return;
    }

    const newQueue = [...queue, val];
    setQueue(newQueue);
    setHighlightIdx(newQueue.length - 1);
    setCurrentExplanation({
      action: `Enqueued [${val}] at REAR of queue (Index ${newQueue.length - 1})`,
      intuition: "FIFO principle: Elements wait in line. New arrivals join the back in O(1) time.",
      next: `Rear pointer updated to [${val}]. Total items: ${newQueue.length}.`
    });
    setPhase('ENQUEUED');
    setActiveLine(8);
    playSynthTone('enqueue', isMuted);
    addLog(`> enqueue(${val}): Added to rear.`);

    setTimeout(() => setHighlightIdx(null), 1000);
  };

  // Dequeue
  const handleDequeue = () => {
    if (queue.length === 0) {
      setCurrentExplanation({
        action: "Queue Underflow: Queue is empty!",
        intuition: "No items remain in queue to dequeue.",
        next: "Enqueue elements before calling dequeue."
      });
      setPhase('UNDERFLOW');
      addLog(`> ERROR: Queue Underflow!`);
      return;
    }

    const removed = queue[0];
    setHighlightIdx(0);
    setPhase('DEQUEUING');
    playSynthTone('dequeue', isMuted);

    setTimeout(() => {
      const newQueue = queue.slice(1);
      setQueue(newQueue);
      setHighlightIdx(null);
      setCurrentExplanation({
        action: `Dequeued [${removed}] from FRONT of queue!`,
        intuition: "The oldest element in the queue was processed and removed in O(1) time.",
        next: newQueue.length > 0 ? `New front is [${newQueue[0]}].` : "Queue is now empty."
      });
      setPhase('DEQUEUED');
      setActiveLine(14);
      addLog(`> dequeue(): Removed ${removed} from front.`);
    }, 350);
  };

  // Deque operations: PushFront & PopBack
  const handlePushFront = () => {
    const val = Number(inputValue);
    if (isNaN(val) || queue.length >= maxCapacity) return;
    const newQueue = [val, ...queue];
    setQueue(newQueue);
    setCurrentExplanation({
      action: `Deque Push-Front: Added [${val}] to the front!`,
      intuition: "Double-ended queues permit O(1) insertions at both front and back.",
      next: "Queue updated."
    });
    setPhase('PUSH_FRONT');
    playSynthTone('enqueue', isMuted);
    addLog(`> deque.pushFront(${val})`);
  };

  const handlePopBack = () => {
    if (queue.length === 0) return;
    const popped = queue[queue.length - 1];
    const newQueue = queue.slice(0, -1);
    setQueue(newQueue);
    setCurrentExplanation({
      action: `Deque Pop-Back: Removed [${popped}] from rear!`,
      intuition: "Double-ended queues permit O(1) deletions from both ends.",
      next: "Queue updated."
    });
    setPhase('POP_BACK');
    playSynthTone('dequeue', isMuted);
    addLog(`> deque.popBack(): Removed ${popped}`);
  };

  const handleReset = () => {
    setQueue([12, 24, 36, 48]);
    setHighlightIdx(null);
    setPhase('IDLE');
    setCurrentExplanation({
      action: "Queue reset to default 4 items.",
      intuition: "Ready for FIFO operations.",
      next: "Click Enqueue or Dequeue."
    });
    addLog(`> Queue reset.`);
  };

  const controlsSlot = (
    <div className="flex flex-col gap-4">
      {/* Mode Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Queue Architecture</label>
        <div className="grid grid-cols-3 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-white/10">
          {[
            { id: 'fifo', label: 'Linear FIFO' },
            { id: 'circular', label: 'Circular' },
            { id: 'deque', label: 'Deque' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => {
                setQueueMode(m.id);
                addLog(`> Switched queue mode to ${m.label}.`);
              }}
              className={`py-1.5 text-[11px] font-bold rounded-md transition-all ${
                queueMode === m.id ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enqueue Section */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-teal-500/5 border border-teal-500/20">
        <span className="text-xs font-black text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
          <Plus size={14} /> Enqueue at Rear (O(1))
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
            onClick={handleEnqueue}
            className="py-1.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Enqueue
          </button>
        </div>
      </div>

      {/* Dequeue Section */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleDequeue}
          className="py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Trash2 size={13} /> Dequeue (Front)
        </button>
        <button
          onClick={() => {
            if (queue.length > 0) {
              setHighlightIdx(0);
              setTimeout(() => setHighlightIdx(null), 1000);
              playSynthTone('enqueue', isMuted);
              addLog(`> peek(): Front element is ${queue[0]}`);
            }
          }}
          className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Eye size={13} /> Front Item
        </button>
      </div>

      {/* Deque controls if in deque mode */}
      {queueMode === 'deque' && (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <label className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Deque Extensions</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePushFront}
              className="py-1.5 px-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all"
            >
              Push Front
            </button>
            <button
              onClick={handlePopBack}
              className="py-1.5 px-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold transition-all"
            >
              Pop Back
            </button>
          </div>
        </div>
      )}

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
          <RotateCcw size={12} /> Reset Queue
        </button>
      </div>
    </div>
  );

  return (
    <ResponsiveVisualizerShell
      title="Queue"
      subtitle="First-In, First-Out (FIFO) linear data structure where elements enter at the rear and exit at the front."
      currentPath="/visualizer/queue"
      category="ds"
      controls={controlsSlot}
      metrics={
        <ComplexityBadge
          timeComplexity={{
            average: "Enqueue: O(1) | Dequeue: O(1)",
            worst: "O(1) Constant Time"
          }}
          spaceComplexity={`O(n) - Current: ${queue.length}/${maxCapacity}`}
          activeOperation={phase}
          notes="FIFO conveyor belt guarantees fair processing in exact arrival sequence."
        />
      }
      codeInspector={
        <CodeInspector
          codeSnippets={CODE_SNIPPETS}
          activeLine={activeLine}
          variables={{ front: queue[0] ?? 'null', rear: queue[queue.length - 1] ?? 'null', size: queue.length }}
          title="Queue Source Logic"
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
                ELI5 Intuition: FIFO Conveyor Chamber
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

        {/* Visual Conveyor Belt Canvas */}
        <div className="flex-1 min-h-[360px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative shadow-inner overflow-x-auto">
          {/* Conveyor Belt Chamber */}
          <div className="w-full max-w-2xl flex items-center justify-between gap-4 p-4 rounded-2xl border-2 border-dashed border-teal-500/40 bg-black/5 dark:bg-black/40 relative">
            {/* FRONT (Exit) Gate */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-1">
                FRONT ◀ EXIT
              </span>
              <ArrowLeft size={20} className="text-rose-400 animate-pulse" />
            </div>

            {/* Queue items conveyor */}
            <div className="flex-1 flex items-center justify-center gap-2 overflow-x-auto py-4 min-h-[90px]">
              <AnimatePresence>
                {queue.map((val, idx) => {
                  const isFront = idx === 0;
                  const isRear = idx === queue.length - 1;
                  const isHighlighted = highlightIdx === idx;

                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ x: 60, opacity: 0, scale: 0.8 }}
                      animate={{ 
                        x: 0, 
                        opacity: 1, 
                        scale: isHighlighted ? 1.1 : 1,
                        transition: { type: 'spring', stiffness: 350, damping: 25 }
                      }}
                      exit={{ x: -60, opacity: 0, scale: 0.8 }}
                      className={`h-16 min-w-[64px] rounded-xl flex flex-col items-center justify-center p-2 font-black border shadow-md relative transition-all ${
                        isHighlighted
                          ? 'bg-amber-500 text-black border-amber-400 shadow-amber-500/40'
                          : isFront
                            ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30'
                            : isRear
                              ? 'bg-teal-500 text-black border-teal-400 shadow-teal-500/30'
                              : 'bg-white/90 dark:bg-[#1f1f23] text-gray-900 dark:text-white border-gray-300 dark:border-white/10'
                      }`}
                    >
                      <span className="text-[9px] font-mono opacity-60">[{idx}]</span>
                      <span className="text-base">{val}</span>
                      {isFront && (
                        <span className="absolute -top-3 px-1.5 py-0.5 rounded text-[8px] font-black bg-rose-500 text-white shadow-xs">
                          FRONT
                        </span>
                      )}
                      {isRear && !isFront && (
                        <span className="absolute -bottom-3 px-1.5 py-0.5 rounded text-[8px] font-black bg-teal-500 text-black shadow-xs">
                          REAR
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {queue.length === 0 && (
                <div className="text-gray-400 text-xs font-bold italic py-4">
                  Queue is Empty (Underflow)
                </div>
              )}
            </div>

            {/* REAR (Entry) Gate */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 mb-1">
                ENTRY ◀ REAR
              </span>
              <ArrowLeft size={20} className="text-teal-400" />
            </div>
          </div>

          <div className="mt-4 text-xs font-bold text-gray-400 flex items-center gap-2">
            <span>Capacity: {queue.length} / {maxCapacity}</span>
            <div className="w-24 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${(queue.length / maxCapacity) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveVisualizerShell>
  );
}
