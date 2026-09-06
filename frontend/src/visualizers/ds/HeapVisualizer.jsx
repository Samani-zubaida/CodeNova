import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Layers, Compass, ArrowDown, ArrowUp, RefreshCw, CheckCircle
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';

const playSynthTone = (type = 'swap', isMuted = false) => {
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

    if (type === 'swap') {
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'extract') {
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch (e) {}
};

const CODE_SNIPPETS = {
  javascript: `// Binary Max-Heap Implementation
class MaxHeap {
  constructor() {
    this.heap = [];
  }
  
  parent(i) { return Math.floor((i - 1) / 2); }
  left(i) { return 2 * i + 1; }
  right(i) { return 2 * i + 2; }
  
  // Insert with Sift-Up (O(log n))
  insert(val) {
    this.heap.push(val);
    let i = this.heap.length - 1;
    while (i > 0 && this.heap[this.parent(i)] < this.heap[i]) {
      [this.heap[i], this.heap[this.parent(i)]] = [this.heap[this.parent(i)], this.heap[i]];
      i = this.parent(i);
    }
  }
  
  // Extract Max with Sift-Down (O(log n))
  extractMax() {
    if (this.heap.length === 0) return null;
    const max = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return max;
  }
}`,
  python: `# Binary Max-Heap in Python
class MaxHeap:
    def __init__(self):
        self.heap = []
        
    def parent(self, i): return (i - 1) // 2
    def left(self, i): return 2 * i + 1
    def right(self, i): return 2 * i + 2
    
    def insert(self, val):
        self.heap.append(val)
        i = len(self.heap) - 1
        while i > 0 and self.heap[self.parent(i)] < self.heap[i]:
            self.heap[i], self.heap[self.parent(i)] = self.heap[self.parent(i)], self.heap[i]
            i = self.parent(i)`,
  cpp: `// C++ Binary Heap
#include <vector>
#include <algorithm>

class MaxHeap {
    std::vector<int> heap;
    int parent(int i) { return (i - 1) / 2; }
    int left(int i) { return 2 * i + 1; }
    int right(int i) { return 2 * i + 2; }
public:
    void insert(int val) {
        heap.push_back(val);
        int i = heap.size() - 1;
        while (i > 0 && heap[parent(i)] < heap[i]) {
            std::swap(heap[i], heap[parent(i)]);
            i = parent(i);
        }
    }
};`,
  java: `// Java Max Heap
import java.util.ArrayList;

public class MaxHeap {
    ArrayList<Integer> heap = new ArrayList<>();
    
    public void insert(int val) {
        heap.add(val);
        int i = heap.size() - 1;
        while (i > 0 && heap.get((i - 1) / 2) < heap.get(i)) {
            int p = (i - 1) / 2;
            int temp = heap.get(i);
            heap.set(i, heap.get(p));
            heap.set(p, temp);
            i = p;
        }
    }
}`
};

export default function HeapVisualizer() {
  const [heapType, setHeapType] = useState('max'); // 'max' | 'min'
  const [heap, setHeap] = useState([90, 75, 60, 45, 30, 20]);
  const [inputValue, setInputValue] = useState('80');
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [logs, setLogs] = useState(['> Heap initialized with 6 items.']);

  const [currentExplanation, setCurrentExplanation] = useState({
    action: "Binary Heap Ready (Complete Binary Tree)",
    intuition: "In a Max-Heap, every parent node is >= its children. The highest value is always at Root (Index 0).",
    next: "Insert an element to watch Sift-Up bubble swaps, or Extract Root."
  });
  const [phase, setPhase] = useState('IDLE');
  const [activeLine, setActiveLine] = useState(-1);

  const addLog = (msg) => setLogs(prev => [...prev.slice(-15), msg]);

  // Sift-Up Insert
  const handleInsert = async () => {
    const val = Number(inputValue);
    if (isNaN(val)) return;

    let h = [...heap, val];
    setHeap(h);
    let i = h.length - 1;
    setActiveLine(14);
    addLog(`> insert(${val}): Placed at bottom leaf (Index ${i}).`);

    setCurrentExplanation({
      action: `Appended [${val}] as the rightmost bottom leaf (Index ${i})`,
      intuition: "Complete binary trees must maintain structural completeness: all levels filled left-to-right.",
      next: "Check if heap invariant is violated with parent."
    });
    setPhase('INSERT_LEAF');
    playSynthTone('swap', isMuted);

    await new Promise(r => setTimeout(r, 600));

    // Sift up
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      const isViolation = heapType === 'max' ? h[p] < h[i] : h[p] > h[i];

      if (isViolation) {
        setSwappingIndices([p, i]);
        setCurrentExplanation({
          action: `Heap Invariant Violated! Child [${h[i]}] ${heapType === 'max' ? '>' : '<'} Parent [${h[p]}]`,
          intuition: `Sift-Up (Bubble-Up): Swap child [${h[i]}] with parent [${h[p]}] to restore heap property.`,
          next: `Continue bubbling up to index ${p}.`
        });
        setPhase('SIFT_UP');
        setActiveLine(16);
        playSynthTone('swap', isMuted);

        await new Promise(r => setTimeout(r, 700));

        // Perform swap
        const temp = h[i];
        h[i] = h[p];
        h[p] = temp;
        setHeap([...h]);
        i = p;

        await new Promise(r => setTimeout(r, 400));
      } else {
        break;
      }
    }

    setSwappingIndices([]);
    setCurrentExplanation({
      action: `Insertion of [${val}] complete! Heap invariant restored in O(log n) time.`,
      intuition: "Binary heap height is bounded by floor(log2(n)), so at most log(n) swaps occur.",
      next: "Heap ready for next operation."
    });
    setPhase('COMPLETE');
    addLog(`> Heap property fully satisfied.`);
  };

  // Extract Root (Min/Max)
  const handleExtract = async () => {
    if (heap.length === 0) return;
    const rootVal = heap[0];
    addLog(`> extract${heapType === 'max' ? 'Max' : 'Min'}(): Extracted root value ${rootVal}`);

    if (heap.length === 1) {
      setHeap([]);
      setPhase('EMPTY');
      return;
    }

    // Step 1: Swap root with last element
    let h = [...heap];
    const lastVal = h.pop();
    h[0] = lastVal;
    setHeap([...h]);
    playSynthTone('extract', isMuted);

    setCurrentExplanation({
      action: `Extracted Root [${rootVal}]. Replaced root with last leaf [${lastVal}].`,
      intuition: "Replacing root with the last leaf maintains complete binary tree structure. Now Sift-Down to restore order.",
      next: "Compare new root with left and right children."
    });
    setPhase('REPLACE_ROOT');
    setActiveLine(25);

    await new Promise(r => setTimeout(r, 700));

    // Sift down
    let i = 0;
    const n = h.length;

    while (true) {
      let target = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (heapType === 'max') {
        if (left < n && h[left] > h[target]) target = left;
        if (right < n && h[right] > h[target]) target = right;
      } else {
        if (left < n && h[left] < h[target]) target = left;
        if (right < n && h[right] < h[target]) target = right;
      }

      if (target !== i) {
        setSwappingIndices([i, target]);
        setCurrentExplanation({
          action: `Sift-Down: Node [${h[i]}] swapped with larger child [${h[target]}]`,
          intuition: "Promoting the larger child ensures the parent is strictly greater than both subtrees.",
          next: `Continue pushing down to index ${target}.`
        });
        setPhase('SIFT_DOWN');
        playSynthTone('swap', isMuted);

        await new Promise(r => setTimeout(r, 700));

        const temp = h[i];
        h[i] = h[target];
        h[target] = temp;
        setHeap([...h]);
        i = target;

        await new Promise(r => setTimeout(r, 400));
      } else {
        break;
      }
    }

    setSwappingIndices([]);
    setCurrentExplanation({
      action: `Extracted [${rootVal}] successfully! New Root is [${h[0]}].`,
      intuition: "Extraction finished in O(log n) time.",
      next: "Heap stabilized."
    });
    setPhase('COMPLETE');
  };

  const handleReset = () => {
    setHeap([90, 75, 60, 45, 30, 20]);
    setSwappingIndices([]);
    setPhase('IDLE');
    setCurrentExplanation({
      action: "Heap reset to standard 6-node configuration.",
      intuition: "Ready for insertion and extraction.",
      next: "Click Insert or Extract Root."
    });
    addLog(`> Heap reset.`);
  };

  // SVG coordinate layout for complete binary tree
  const getTreeLayout = () => {
    const nodes = [];
    const edges = [];
    const width = 560;

    heap.forEach((val, i) => {
      const depth = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, depth) - 1);
      const levelTotal = Math.pow(2, depth);
      const x = (width / (levelTotal + 1)) * (posInLevel + 1);
      const y = 40 + depth * 75;

      nodes.push({ i, val, x, y });

      if (i > 0) {
        const parentIdx = Math.floor((i - 1) / 2);
        const pNode = nodes[parentIdx];
        if (pNode) {
          edges.push({
            id: `e_${parentIdx}_${i}`,
            x1: pNode.x,
            y1: pNode.y,
            x2: x,
            y2: y
          });
        }
      }
    });

    return { nodes, edges };
  };

  const { nodes: svgNodes, edges: svgEdges } = getTreeLayout();

  const controlsSlot = (
    <div className="flex flex-col gap-4">
      {/* Type Toggle */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Heap Type</label>
        <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-white/10">
          <button
            onClick={() => {
              setHeapType('max');
              setHeap([90, 75, 60, 45, 30, 20]);
              addLog(`> Switched to Max-Heap mode.`);
            }}
            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
              heapType === 'max' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Max-Heap (Parent ≥ Child)
          </button>
          <button
            onClick={() => {
              setHeapType('min');
              setHeap([15, 25, 35, 45, 60, 80]);
              addLog(`> Switched to Min-Heap mode.`);
            }}
            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
              heapType === 'min' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Min-Heap (Parent ≤ Child)
          </button>
        </div>
      </div>

      {/* Insert */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-teal-500/5 border border-teal-500/20">
        <span className="text-xs font-black text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
          <Plus size={14} /> Insert + Sift-Up (O(log n))
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
            onClick={handleInsert}
            className="py-1.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Insert
          </button>
        </div>
      </div>

      {/* Extract */}
      <button
        onClick={handleExtract}
        className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
      >
        <Trash2 size={13} /> Extract {heapType === 'max' ? 'Max' : 'Min'} Root (O(log n))
      </button>

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
          <RotateCcw size={12} /> Reset Heap
        </button>
      </div>
    </div>
  );

  return (
    <ResponsiveVisualizerShell
      title="Binary Heap / Priority Queue"
      subtitle="Complete binary tree satisfying the heap invariant, backed by a compact 1D array."
      currentPath="/visualizer/heap"
      category="ds"
      controls={controlsSlot}
      metrics={
        <ComplexityBadge
          timeComplexity={{
            average: "Insert: O(log n) | Extract: O(log n)",
            worst: "Peek: O(1) Constant Time"
          }}
          spaceComplexity={`O(n) - Array backed`}
          activeOperation={phase}
          notes="Array formulas: Parent=(i-1)/2, Left=2i+1, Right=2i+2."
        />
      }
      codeInspector={
        <CodeInspector
          codeSnippets={CODE_SNIPPETS}
          activeLine={activeLine}
          variables={{ root: heap[0] ?? 'null', totalElements: heap.length }}
          title="Binary Heap Source Logic"
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
                ELI5 Intuition: Complete Binary Tree Invariant
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

        {/* Tree SVG Canvas */}
        <div className="min-h-[260px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-inner">
          <div className="absolute top-3 left-4 text-xs font-semibold text-gray-400">
            <span>Synchronized View 1: <strong>Complete Binary Tree</strong></span>
          </div>

          <svg className="w-full h-[220px]">
            {svgEdges.map(edge => (
              <line
                key={edge.id}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke="currentColor"
                strokeWidth={2.5}
                className="text-gray-300 dark:text-white/20"
              />
            ))}

            {svgNodes.map(node => {
              const isSwapping = swappingIndices.includes(node.i);
              const isRoot = node.i === 0;

              return (
                <g key={node.i} transform={`translate(${node.x}, ${node.y})`}>
                  {isSwapping && (
                    <circle
                      r={24}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      strokeDasharray="4 3"
                      className="animate-spin"
                      style={{ animationDuration: '3s' }}
                    />
                  )}
                  <circle
                    r={18}
                    fill={isSwapping ? '#F59E0B' : isRoot ? '#14B8A6' : '#18181b'}
                    stroke={isSwapping ? '#FCD34D' : isRoot ? '#5EEAD4' : '#3F3F46'}
                    strokeWidth={2.5}
                    className="shadow-md"
                  />
                  <text
                    textAnchor="middle"
                    dy=".35em"
                    fill="white"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {node.val}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="-1.8em"
                    fill="#9CA3AF"
                    fontSize={9}
                    fontWeight="bold"
                  >
                    [{node.i}]
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Synchronized 1D Array Layout */}
        <div className="p-4 rounded-2xl bg-black/5 dark:bg-black/40 border border-gray-200 dark:border-white/10 flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Synchronized View 2: Physical 1D Array Memory
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {heap.map((val, idx) => {
              const isSwapping = swappingIndices.includes(idx);
              const isRoot = idx === 0;

              return (
                <div
                  key={idx}
                  className={`min-w-[54px] p-2 rounded-xl flex flex-col items-center border font-mono transition-all ${
                    isSwapping
                      ? 'bg-amber-500 text-black border-amber-400 ring-2 ring-amber-400'
                      : isRoot
                        ? 'bg-teal-500/20 border-teal-400 text-teal-400'
                        : 'bg-white/80 dark:bg-[#18181b] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white'
                  }`}
                >
                  <span className="text-[9px] opacity-60">[{idx}]</span>
                  <span className="text-sm font-black">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ResponsiveVisualizerShell>
  );
}
