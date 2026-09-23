import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Eye, Compass, Layers, CheckCircle2, AlertCircle, ArrowDown,
  ArrowRight, Sparkles, Binary, Check, X, ShieldAlert, Cpu, Hash, ArrowUpDown, Award
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';

// Sound synthesizer for heap swaps and compares
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
    } else if (type === 'compare') {
      osc.frequency.setValueAtTime(500, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'extract') {
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.15);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch (e) {}
};

const HEAP_ALGORITHMS = [
  { id: 'operations', name: 'Min / Max Heap Operations', badge: 'O(log n)', desc: 'Dynamic Insert, Extract, Bubble-Up & Down' },
  { id: 'heapify', name: 'Bottom-Up Heapify', badge: 'O(n)', desc: 'Convert Unsorted Array to Heap' },
  { id: 'heapSort', name: 'In-Place Heap Sort', badge: 'O(n log n)', desc: 'Max-Heap Root Swaps & Sorted Suffix' },
  { id: 'kthElement', name: 'K-th Largest / Smallest', badge: 'O(n log k)', desc: 'Priority Queue Top-K Window' }
];

const CODE_SNIPPETS = {
  operations: {
    javascript: `// Binary Heap Implementation
class BinaryHeap {
  constructor(isMin = true) {
    this.heap = [];
    this.isMin = isMin;
  }
  insert(val) {
    this.heap.push(val);
    this.siftUp(this.heap.length - 1);
  }
  extract() {
    if (this.heap.length === 0) return null;
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return root;
  }
}`,
    python: `import heapq
# Python min-heap by default
heap = [15, 25, 35, 45, 60, 80]
heapq.heapify(heap)
heapq.heappush(heap, 20) # Insert O(log n)
min_val = heapq.heappop(heap) # Extract-Min O(log n)`,
    cpp: `#include <queue>
std::priority_queue<int> maxHeap; // Max-Heap
std::priority_queue<int, vector<int>, greater<int>> minHeap; // Min-Heap
minHeap.push(20);
int root = minHeap.top();
minHeap.pop();`,
    java: `import java.util.PriorityQueue;
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(20);
int root = minHeap.poll();`
  },
  heapify: {
    javascript: `function buildHeap(arr) {
  const n = arr.length;
  // Sift down all non-leaf nodes from floor(n/2)-1 down to 0
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, n, i);
  }
  return arr;
}`,
    python: `def build_heap(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, n, i)
    return arr`,
    cpp: `void buildHeap(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--)
        siftDown(arr, n, i);
}`,
    java: `void buildHeap(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--)
        siftDown(arr, n, i);
}`
  },
  heapSort: {
    javascript: `function heapSort(arr) {
  const n = arr.length;
  // 1. Build Max-Heap O(n)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, n, i);
  // 2. Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // Move current max to end
    siftDown(arr, i, 0); // Sift down root within reduced heap [0..i-1]
  }
  return arr;
}`,
    python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        sift_down(arr, i, 0)
    return arr`,
    cpp: `void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) siftDown(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        siftDown(arr, i, 0);
    }
}`,
    java: `public void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) siftDown(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
        siftDown(arr, i, 0);
    }
}`
  },
  kthElement: {
    javascript: `function findKthLargest(nums, k) {
  // Use Min-Heap of size k
  const minHeap = new MinHeap();
  for (let num of nums) {
    minHeap.push(num);
    if (minHeap.size() > k) minHeap.pop();
  }
  return minHeap.peek(); // O(n log k) time, O(k) space
}`,
    python: `import heapq
def findKthLargest(nums: list[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]`,
    cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minH;
    for (int n : nums) {
        minH.push(n);
        if (minH.size() > k) minH.pop();
    }
    return minH.top();
}`,
    java: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minH = new PriorityQueue<>();
    for (int n : nums) {
        minH.offer(n);
        if (minH.size() > k) minH.poll();
    }
    return minH.peek();
}`
  }
};

export default function HeapVisualizer() {
  const [activeAlgo, setActiveAlgo] = useState('operations');
  const [heapType, setHeapType] = useState('min'); // 'min' or 'max'

  // Primary Heap array
  const [heap, setHeap] = useState([15, 25, 35, 45, 60, 80]);
  const [inputValue, setInputValue] = useState('20');
  const maxCapacity = 15;
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [swapPair, setSwapPair] = useState(null);

  // Heapify state
  const [heapifyInput, setHeapifyInput] = useState('4, 10, 3, 5, 1, 12, 7, 2, 9');

  // Heap Sort state
  const [heapSortInput, setHeapSortInput] = useState('65, 30, 85, 15, 55, 95, 25, 40');
  const [sortedBoundary, setSortedBoundary] = useState(null);

  // Kth Element state
  const [kthInput, setKthInput] = useState('3, 2, 1, 5, 6, 4');
  const [kthVal, setKthVal] = useState(2);
  const [kthResult, setKthResult] = useState(null);

  // Playback state
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [logs, setLogs] = useState(['> Heap Visualizer initialized. Ready for operations.']);

  // ELI5 Explanation State
  const [explanation, setExplanation] = useState({
    action: "Min-Heap Ready (Parent ≤ Children)",
    intuition: "Complete binary tree stored contiguously in an array. Root always holds global minimum in O(1).",
    next: "Insert new element or extract root."
  });

  // Track active variables for DryRunVariableTracker
  const [activeVariables, setActiveVariables] = useState({
    rootVal: 15,
    size: 6,
    heapType: 'min',
    lastIndex: 5,
    isHeapSatisfied: true
  });

  const [activeLine, setActiveLine] = useState(1);
  const [currentCodeSnippet, setCurrentCodeSnippet] = useState(CODE_SNIPPETS.operations);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 49)]);
  };

  // Sync mode changes
  useEffect(() => {
    setCurrentCodeSnippet(CODE_SNIPPETS[activeAlgo] || CODE_SNIPPETS.operations);
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIdx(0);
    setHighlightIndices([]);
    setSwapPair(null);
    setSortedBoundary(null);
    addLog(`> Switched algorithm mode to ${HEAP_ALGORITHMS.find(a => a.id === activeAlgo)?.name}.`);

    if (activeAlgo === 'operations') {
      buildOperationsDemo(heapType);
    } else if (activeAlgo === 'heapify') {
      resetHeapify(heapifyInput);
    } else if (activeAlgo === 'heapSort') {
      resetHeapSort(heapSortInput);
    } else if (activeAlgo === 'kthElement') {
      resetKth(kthInput, kthVal);
    }
  }, [activeAlgo, heapType]);

  // =========================================================================
  // DEMO: MIN / MAX HEAP DYNAMIC OPERATIONS ANIMATION
  // =========================================================================
  const buildOperationsDemo = (type = heapType) => {
    const isMin = type === 'min';
    let h = isMin ? [15, 25, 35, 45, 60, 80] : [90, 75, 60, 45, 30, 20];
    const recorded = [];

    recorded.push({
      action: `${isMin ? 'Min' : 'Max'}-Heap Initial State`,
      intuition: `Binary heap guarantees parent is ${isMin ? '≤' : '≥'} both children. Stored as contiguous array.`,
      next: `Insert ${isMin ? 20 : 85} into heap.`,
      heapState: [...h],
      highlight: [0],
      variables: { heapType: type, size: h.length, root: h[0] },
      line: 1
    });

    const insertVal = isMin ? 20 : 85;
    h.push(insertVal);
    const leafIdx = h.length - 1;
    recorded.push({
      action: `INSERT ${insertVal}: Placed at index [${leafIdx}] as rightmost leaf`,
      intuition: "Always insert new elements at the end of the array to maintain complete binary tree structure.",
      next: "Compare with parent and bubble up (sift up).",
      heapState: [...h],
      highlight: [leafIdx],
      variables: { inserted: insertVal, index: leafIdx, size: h.length },
      line: 6
    });

    const parentIdx = Math.floor((leafIdx - 1) / 2);
    const temp = h[parentIdx];
    h[parentIdx] = h[leafIdx];
    h[leafIdx] = temp;
    recorded.push({
      action: `⚡ SIFT-UP: Swapped ${insertVal} with parent ${temp} at index [${parentIdx}]`,
      intuition: `${insertVal} is ${isMin ? '<' : '>'} parent ${temp}. Swapping restores the ${type}-heap property!`,
      next: `Extract root element (${h[0]}).`,
      heapState: [...h],
      highlight: [parentIdx, leafIdx],
      variables: { swapped: [parentIdx, leafIdx], newRoot: h[0] },
      line: 8
    });

    const extracted = h[0];
    const lastVal = h.pop();
    h[0] = lastVal;
    recorded.push({
      action: `EXTRACT-${isMin ? 'MIN' : 'MAX'}(): Removed root ${extracted}, moved last leaf ${lastVal} to root`,
      intuition: "Root is the extremum (O(1) read). Moving the last element to root maintains the complete tree shape.",
      next: "Sift-Down (Bubble-Down) from root to restore heap invariant.",
      heapState: [...h],
      highlight: [0],
      variables: { extracted, rootTemp: lastVal, size: h.length },
      line: 12
    });

    const leftChild = 1;
    const rightChild = 2;
    let targetChild = leftChild;
    if (rightChild < h.length) {
      if (isMin ? h[rightChild] < h[leftChild] : h[rightChild] > h[leftChild]) {
        targetChild = rightChild;
      }
    }
    const tVal = h[targetChild];
    h[targetChild] = h[0];
    h[0] = tVal;
    recorded.push({
      action: `⚡ SIFT-DOWN: Swapped root ${lastVal} with child ${tVal} at index [${targetChild}]`,
      intuition: `Sift-down trickles the element down the tree in O(log n) height comparisons until valid.`,
      next: "Heap property fully restored! Ready for further operations.",
      heapState: [...h],
      highlight: [0, targetChild],
      variables: { newRoot: h[0], size: h.length, status: 'RESTORED' },
      line: 15
    });

    setSteps(recorded);
    setCurrentStepIdx(0);
    applyHeapStep(recorded[0]);
  };

  // =========================================================================
  // ALGORITHM 1: MIN / MAX HEAP DYNAMIC OPERATIONS
  // =========================================================================
  const handleInsert = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    if (heap.length >= maxCapacity) {
      addLog(`⚠️ Heap capacity (${maxCapacity}) reached.`);
      return;
    }

    playSynthTone('compare', isMuted);
    const newHeap = [...heap, val];
    setHeap(newHeap);
    addLog(`> INSERT: Appended ${val} at index [${newHeap.length - 1}] as next leaf.`);

    // Bubble up step by step
    let curr = newHeap.length - 1;
    const stepsArr = [];

    stepsArr.push({
      heapState: [...newHeap],
      highlight: [curr],
      action: `Appended ${val} at index [${curr}]`,
      intuition: "Every new node starts at the first available leaf slot to maintain the Complete Binary Tree shape property.",
      next: curr > 0 ? `Compare with parent at index [${Math.floor((curr - 1) / 2)}]` : "Root placed.",
      line: 7
    });

    const isBetter = (child, parent) => heapType === 'min' ? child < parent : child > parent;

    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (isBetter(newHeap[curr], newHeap[parent])) {
        // Swap
        const temp = newHeap[curr];
        newHeap[curr] = newHeap[parent];
        newHeap[parent] = temp;
        stepsArr.push({
          heapState: [...newHeap],
          highlight: [curr, parent],
          swapped: [curr, parent],
          action: `Sift-Up Swap: ${newHeap[parent]} with parent ${newHeap[curr]}`,
          intuition: `${heapType === 'min' ? 'Child < Parent' : 'Child > Parent'} violates heap invariant. Bubble node upward!`,
          next: parent > 0 ? `Check higher parent at index [${Math.floor((parent - 1) / 2)}]` : "Reached root.",
          line: 8
        });
        curr = parent;
      } else {
        stepsArr.push({
          heapState: [...newHeap],
          highlight: [curr, parent],
          action: `Heap Invariant Satisfied: ${newHeap[parent]} ${heapType === 'min' ? '≤' : '≥'} ${newHeap[curr]}`,
          intuition: "No further swaps needed. Node is in its correct priority position.",
          next: "Insertion complete.",
          line: 9
        });
        break;
      }
    }

    // Animate the steps
    let i = 0;
    const interval = setInterval(() => {
      if (i < stepsArr.length) {
        const s = stepsArr[i];
        setHeap(s.heapState);
        setHighlightIndices(s.highlight);
        if (s.swapped) playSynthTone('swap', isMuted);
        setExplanation({
          action: s.action,
          intuition: s.intuition,
          next: s.next
        });
        setActiveVariables({
          rootVal: s.heapState[0],
          size: s.heapState.length,
          lastInserted: val,
          activeIdx: s.highlight[0]
        });
        setActiveLine(s.line);
        i++;
      } else {
        clearInterval(interval);
        setHighlightIndices([]);
        setSwapPair(null);
      }
    }, 450);
  };

  const handleExtract = () => {
    if (heap.length === 0) {
      addLog("⚠️ Heap is empty. Cannot extract.");
      return;
    }

    playSynthTone('extract', isMuted);
    const rootVal = heap[0];
    if (heap.length === 1) {
      setHeap([]);
      addLog(`> EXTRACT: Removed sole root ${rootVal}. Heap is now empty.`);
      return;
    }

    const newHeap = [...heap];
    const lastVal = newHeap.pop();
    newHeap[0] = lastVal;
    addLog(`> EXTRACT: Removed root ${rootVal}. Moved last leaf ${lastVal} to root. Sifting down...`);

    // Sift down steps
    let curr = 0;
    const n = newHeap.length;
    const stepsArr = [];

    stepsArr.push({
      heapState: [...newHeap],
      highlight: [0],
      action: `Extracted ${rootVal}. Placed last leaf ${lastVal} at root`,
      intuition: "Replacing root with the last leaf preserves tree shape. Now sift down to restore heap ordering.",
      next: "Compare root with left and right children.",
      line: 14
    });

    const isBetter = (a, b) => heapType === 'min' ? a < b : a > b;

    while (true) {
      let target = curr;
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      if (left < n && isBetter(newHeap[left], newHeap[target])) {
        target = left;
      }
      if (right < n && isBetter(newHeap[right], newHeap[target])) {
        target = right;
      }

      if (target !== curr) {
        const temp = newHeap[curr];
        newHeap[curr] = newHeap[target];
        newHeap[target] = temp;
        stepsArr.push({
          heapState: [...newHeap],
          highlight: [curr, target],
          swapped: [curr, target],
          action: `Sift-Down Swap: [${curr}] (${newHeap[target]}) with priority child [${target}] (${newHeap[curr]})`,
          intuition: `Swapping with the ${heapType === 'min' ? 'smaller' : 'larger'} child restores local heap invariant.`,
          next: "Check subchildren below.",
          line: 18
        });
        curr = target;
      } else {
        stepsArr.push({
          heapState: [...newHeap],
          highlight: [curr],
          action: `Sift-Down Complete: [${curr}] (${newHeap[curr]}) satisfies heap property`,
          intuition: "Node is correctly prioritized relative to all descendants.",
          next: "Extraction complete.",
          line: 20
        });
        break;
      }
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < stepsArr.length) {
        const s = stepsArr[i];
        setHeap(s.heapState);
        setHighlightIndices(s.highlight);
        if (s.swapped) playSynthTone('swap', isMuted);
        setExplanation({
          action: s.action,
          intuition: s.intuition,
          next: s.next
        });
        setActiveVariables({
          extractedVal: rootVal,
          rootVal: s.heapState[0],
          size: s.heapState.length,
          activeIdx: s.highlight[0]
        });
        setActiveLine(s.line);
        i++;
      } else {
        clearInterval(interval);
        setHighlightIndices([]);
        setSwapPair(null);
      }
    }, 450);
  };

  // =========================================================================
  // ALGORITHM 2: BOTTOM-UP HEAPIFY O(N)
  // =========================================================================
  const resetHeapify = (rawInput) => {
    const nums = rawInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (nums.length === 0) return;
    setHeap([...nums]);
    buildHeapifySteps(nums);
  };

  const buildHeapifySteps = (initialNums) => {
    const arr = [...initialNums];
    const n = arr.length;
    const recorded = [];

    recorded.push({
      heapState: [...arr],
      highlight: [],
      action: `Bottom-Up Heapify Initialized for [${arr.join(', ')}]`,
      intuition: `Leaf nodes (indices ${Math.floor(n / 2)} to ${n - 1}) are trivially valid 1-element heaps! We only need to sift-down internal nodes from index ${Math.floor(n / 2) - 1} down to 0.`,
      next: `Start sifting down at index ${Math.floor(n / 2) - 1}.`,
      variables: { totalNodes: n, firstNonLeaf: Math.floor(n / 2) - 1, step: 'Init' },
      line: 4
    });

    const isBetter = (a, b) => heapType === 'min' ? a < b : a > b;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      recorded.push({
        heapState: [...arr],
        highlight: [i],
        action: `Processing internal node at index [${i}] (value ${arr[i]})`,
        intuition: `Sift-down ensures that the subtree rooted at index ${i} becomes a valid ${heapType}-heap.`,
        next: `Compare [${i}] with left child [${2 * i + 1}] and right child [${2 * i + 2}]`,
        variables: { currentIndex: i, value: arr[i], left: 2 * i + 1, right: 2 * i + 2 },
        line: 5
      });

      // Sift down logic for i
      let curr = i;
      while (true) {
        let target = curr;
        const left = 2 * curr + 1;
        const right = 2 * curr + 2;

        if (left < n && isBetter(arr[left], arr[target])) target = left;
        if (right < n && isBetter(arr[right], arr[target])) target = right;

        if (target !== curr) {
          const temp = arr[curr];
          arr[curr] = arr[target];
          arr[target] = temp;
          recorded.push({
            heapState: [...arr],
            highlight: [curr, target],
            action: `Sift-Down: Swapped index [${curr}] with priority child [${target}]`,
            intuition: `Subtree at [${curr}] needed rebalancing. Swapped ${arr[target]} with ${arr[curr]}.`,
            next: target < Math.floor(n / 2) ? `Continue checking descendants of [${target}]` : `Node [${i}] finished. Move to index [${i - 1}]`,
            variables: { swappedA: curr, swappedB: target, newRootOfSubtree: arr[curr] },
            line: 6
          });
          curr = target;
        } else {
          break;
        }
      }
    }

    recorded.push({
      heapState: [...arr],
      highlight: [0],
      action: `🎉 O(n) Bottom-Up Heapify Complete! Root = ${arr[0]}`,
      intuition: "The entire array satisfies the binary heap invariant in linear time (sum of tree heights ≤ 2n).",
      next: "Ready for priority operations.",
      variables: { finalHeap: arr.join(', '), completed: true },
      line: 8
    });

    setSteps(recorded);
    setCurrentStepIdx(0);
    applyHeapStep(recorded[0]);
  };

  // =========================================================================
  // ALGORITHM 3: IN-PLACE HEAP SORT
  // =========================================================================
  const resetHeapSort = (rawInput) => {
    const nums = rawInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (nums.length === 0) return;
    setHeap([...nums]);
    buildHeapSortSteps(nums);
  };

  const buildHeapSortSteps = (initialNums) => {
    const arr = [...initialNums];
    const n = arr.length;
    const recorded = [];

    recorded.push({
      heapState: [...arr],
      highlight: [],
      boundary: n,
      action: `In-Place Heap Sort Initialized: [${arr.join(', ')}]`,
      intuition: "Step 1: Convert array into Max-Heap so arr[0] is maximum. Step 2: Swap max to end, reduce heap size, and sift down.",
      next: "Build Max-Heap...",
      variables: { arrayLength: n, heapSize: n },
      line: 3
    });

    // Step 1: Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      let curr = i;
      while (true) {
        let largest = curr;
        const left = 2 * curr + 1;
        const right = 2 * curr + 2;
        if (left < n && arr[left] > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;
        if (largest !== curr) {
          const temp = arr[curr]; arr[curr] = arr[largest]; arr[largest] = temp;
          curr = largest;
        } else break;
      }
    }

    recorded.push({
      heapState: [...arr],
      highlight: [0],
      boundary: n,
      action: `Max-Heap constructed: Root max = ${arr[0]}`,
      intuition: "The global maximum is now guaranteed to reside at index 0.",
      next: `Swap root with last unsorted index [${n - 1}].`,
      variables: { maxRoot: arr[0], heapSize: n },
      line: 4
    });

    // Step 2: In-place extract and sort
    for (let i = n - 1; i > 0; i--) {
      // Swap root with i
      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;

      recorded.push({
        heapState: [...arr],
        highlight: [0, i],
        boundary: i,
        action: `Moved Max element ${temp} to sorted position [${i}]`,
        intuition: `Index [${i}] is now permanently sorted! Active heap size is reduced to ${i}.`,
        next: `Sift-down new root ${arr[0]} within active heap boundary [0..${i - 1}].`,
        variables: { sortedElement: temp, sortedIndex: i, activeHeapSize: i },
        line: 7
      });

      // Sift down root within [0..i]
      let curr = 0;
      while (true) {
        let largest = curr;
        const left = 2 * curr + 1;
        const right = 2 * curr + 2;

        if (left < i && arr[left] > arr[largest]) largest = left;
        if (right < i && arr[right] > arr[largest]) largest = right;

        if (largest !== curr) {
          const t = arr[curr]; arr[curr] = arr[largest]; arr[largest] = t;
          recorded.push({
            heapState: [...arr],
            highlight: [curr, largest],
            boundary: i,
            action: `Sift-Down: Swapped root [${curr}] (${arr[largest]}) with child [${largest}] (${arr[curr]})`,
            intuition: `Restoring Max-Heap property for next extraction.`,
            next: "Check deeper children.",
            variables: { activeHeapSize: i, rootVal: arr[0] },
            line: 8
          });
          curr = largest;
        } else break;
      }
    }

    recorded.push({
      heapState: [...arr],
      highlight: [],
      boundary: 0,
      action: `🎉 Heap Sort Complete! Sorted Array: [${arr.join(', ')}]`,
      intuition: "In-place O(n log n) sorting achieved with O(1) auxiliary space.",
      next: "Sorted.",
      variables: { sortedArray: arr.join(', '), completed: true },
      line: 10
    });

    setSteps(recorded);
    setCurrentStepIdx(0);
    applyHeapStep(recorded[0]);
  };

  // =========================================================================
  // ALGORITHM 4: K-TH LARGEST / SMALLEST ELEMENT
  // =========================================================================
  const resetKth = (inputStr, k) => {
    const nums = inputStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (nums.length === 0) return;
    buildKthSteps(nums, k);
  };

  const buildKthSteps = (nums, k) => {
    const recorded = [];
    const minHeap = []; // will hold top-k

    const siftUp = (h, idx) => {
      let c = idx;
      while (c > 0) {
        const p = Math.floor((c - 1) / 2);
        if (h[c] < h[p]) {
          const t = h[c]; h[c] = h[p]; h[p] = t;
          c = p;
        } else break;
      }
    };

    const siftDown = (h, idx) => {
      let c = idx;
      const n = h.length;
      while (true) {
        let sm = c;
        const l = 2 * c + 1;
        const r = 2 * c + 2;
        if (l < n && h[l] < h[sm]) sm = l;
        if (r < n && h[r] < h[sm]) sm = r;
        if (sm !== c) {
          const t = h[c]; h[c] = h[sm]; h[sm] = t;
          c = sm;
        } else break;
      }
    };

    recorded.push({
      heapState: [],
      highlight: [],
      action: `Finding ${k}-th Largest Element using Min-Heap of size ${k}`,
      intuition: `A Min-Heap of size k stores the k largest elements seen so far. The root of this min-heap is precisely the k-th largest element!`,
      next: "Stream numbers one by one.",
      variables: { k, arrayLength: nums.length },
      line: 3
    });

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];

      if (minHeap.length < k) {
        minHeap.push(val);
        siftUp(minHeap, minHeap.length - 1);
        recorded.push({
          heapState: [...minHeap],
          highlight: [minHeap.indexOf(val)],
          action: `Pushed ${val} into Min-Heap (Size: ${minHeap.length}/${k})`,
          intuition: `Heap has not yet reached capacity k. Always accept candidates.`,
          next: i + 1 < nums.length ? `Next stream item: ${nums[i + 1]}` : "Finalize answer.",
          variables: { streamedVal: val, heapSize: minHeap.length, kthCandidate: minHeap[0] },
          line: 5
        });
      } else {
        if (val > minHeap[0]) {
          const oldMin = minHeap[0];
          minHeap[0] = val;
          siftDown(minHeap, 0);
          recorded.push({
            heapState: [...minHeap],
            highlight: [0],
            action: `New element ${val} > current k-th largest ${oldMin} -> Replaced root!`,
            intuition: `${val} belongs in the top-${k}. Replaced ${oldMin} and sifted down to restore heap.`,
            next: i + 1 < nums.length ? `Next stream item: ${nums[i + 1]}` : "Finalize answer.",
            variables: { evicted: oldMin, inserted: val, newKthLargest: minHeap[0] },
            line: 7
          });
        } else {
          recorded.push({
            heapState: [...minHeap],
            highlight: [],
            action: `Ignored ${val} (≤ current k-th largest ${minHeap[0]})`,
            intuition: `${val} is not large enough to displace any element in the top-${k}.`,
            next: i + 1 < nums.length ? `Next stream item: ${nums[i + 1]}` : "Finalize answer.",
            variables: { ignored: val, currentKth: minHeap[0] },
            line: 8
          });
        }
      }
    }

    recorded.push({
      heapState: [...minHeap],
      highlight: [0],
      action: `🎉 The ${k}-th Largest Element is ${minHeap[0]}!`,
      intuition: `Root of size-${k} Min-Heap is mathematically the ${k}-th largest element. Time complexity: O(n log k).`,
      next: "Complete.",
      variables: { answer: minHeap[0], k, completed: true },
      line: 10
    });

    setSteps(recorded);
    setCurrentStepIdx(0);
    applyHeapStep(recorded[0]);
  };

  const applyHeapStep = (step) => {
    if (!step) return;
    setHeap(step.heapState);
    setHighlightIndices(step.highlight || []);
    setSortedBoundary(step.boundary !== undefined ? step.boundary : null);
    setActiveVariables(step.variables || {});
    setActiveLine(step.line || 1);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  // Playback dispatcher
  const handlePlayPause = () => {
    if (steps.length === 0) {
      if (activeAlgo === 'operations') buildOperationsDemo(heapType);
      else if (activeAlgo === 'heapify') resetHeapify(heapifyInput);
      else if (activeAlgo === 'heapSort') resetHeapSort(heapSortInput);
      else if (activeAlgo === 'kthElement') resetKth(kthInput, kthVal);
      setIsPlaying(true);
      return;
    }
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
      applyHeapStep(steps[0]);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(p => !p);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      const nxt = currentStepIdx + 1;
      setCurrentStepIdx(nxt);
      applyHeapStep(steps[nxt]);
      playSynthTone('compare', isMuted);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      const prev = currentStepIdx - 1;
      setCurrentStepIdx(prev);
      applyHeapStep(steps[prev]);
      playSynthTone('compare', isMuted);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    applyHeapStep(steps[0]);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && steps.length > 0) {
      timer = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          const nxt = currentStepIdx + 1;
          setCurrentStepIdx(nxt);
          applyHeapStep(steps[nxt]);
          playSynthTone('compare', isMuted);
        } else {
          setIsPlaying(false);
        }
      }, 1000 / playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps, playbackSpeed]);

  // Coordinate math for Binary Tree rendering
  const getNodeCoordinates = (index, totalNodes) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelStart = Math.pow(2, level) - 1;
    const posInLevel = index - levelStart;
    const maxInLevel = Math.pow(2, level);

    const width = 600;
    const x = (width / (maxInLevel + 1)) * (posInLevel + 1);
    const y = 40 + level * 70;

    return { x, y };
  };

  // =========================================================================
  // LEFT CONTROLS
  // =========================================================================
  const renderControls = (
    <div className="flex flex-col gap-4 text-xs">
      {/* Algorithm Suite Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Heap Algorithm Suite
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {HEAP_ALGORITHMS.map(a => (
            <button
              key={a.id}
              onClick={() => setActiveAlgo(a.id)}
              className={`flex items-center justify-between p-2 rounded-xl text-left font-bold transition-all border ${
                activeAlgo === a.id
                  ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'bg-white/60 dark:bg-[#141416] border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:border-teal-500/40'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs">{a.name}</span>
                <span className="text-[9px] text-gray-400 font-normal">{a.desc}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400">
                {a.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Heap Type Toggle: Min vs Max */}
      <div className="p-2.5 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
          Heap Invariant Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setHeapType('min')}
            className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
              heapType === 'min'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
          >
            Min-Heap (P ≤ C)
          </button>
          <button
            onClick={() => setHeapType('max')}
            className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
              heapType === 'max'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
          >
            Max-Heap (P ≥ C)
          </button>
        </div>
      </div>

      {/* MODE 1: DYNAMIC OPERATIONS */}
      {activeAlgo === 'operations' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Heap Dynamic Mutation
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
              onClick={handleInsert}
              className="flex-1 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <Plus size={14} /> Insert
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleExtract}
              className="py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <ArrowDown size={13} /> Extract {heapType === 'min' ? 'Min' : 'Max'}
            </button>
            <button
              onClick={() => setHeap([])}
              className="py-1.5 bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: HEAPIFY */}
      {activeAlgo === 'heapify' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Array to Heapify (O(n))
          </label>
          <input
            type="text"
            value={heapifyInput}
            onChange={e => setHeapifyInput(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold"
          />
          <button
            onClick={() => resetHeapify(heapifyInput)}
            className="w-full py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all"
          >
            Run Bottom-Up Heapify
          </button>
        </div>
      )}

      {/* MODE 3: HEAP SORT */}
      {activeAlgo === 'heapSort' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Array to Heap Sort
          </label>
          <input
            type="text"
            value={heapSortInput}
            onChange={e => setHeapSortInput(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold"
          />
          <button
            onClick={() => resetHeapSort(heapSortInput)}
            className="w-full py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all"
          >
            Start Heap Sort
          </button>
        </div>
      )}

      {/* MODE 4: KTH ELEMENT */}
      {activeAlgo === 'kthElement' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Numbers Stream & K Value
          </label>
          <input
            type="text"
            value={kthInput}
            onChange={e => setKthInput(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold"
          />
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500">K:</span>
            <input
              type="number"
              min="1"
              max="5"
              value={kthVal}
              onChange={e => setKthVal(parseInt(e.target.value, 10) || 1)}
              className="w-16 px-2 py-1 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold text-center"
            />
            <button
              onClick={() => resetKth(kthInput, kthVal)}
              className="flex-1 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all"
            >
              Find K-th
            </button>
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

  // =========================================================================
  // RIGHT INSPECTOR
  // =========================================================================
  const renderRightPanel = (
    <div className="flex flex-col gap-4">
      {/* 1. Auxiliary HUD: Index Invariant Guide */}
      <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-teal-500/20 shadow-xs flex flex-col gap-2 text-xs">
        <span className="font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
          Array Indexing Invariants
        </span>
        <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
          <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 flex justify-between">
            <span>Parent(i):</span>
            <span className="font-bold text-teal-500">⌊(i - 1) / 2⌋</span>
          </div>
          <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 flex justify-between">
            <span>Left Child:</span>
            <span className="font-bold text-cyan-500">2i + 1</span>
          </div>
          <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 flex justify-between col-span-2">
            <span>Right Child:</span>
            <span className="font-bold text-indigo-500">2i + 2</span>
          </div>
        </div>
      </div>

      {/* Heap Sort Partitioned Boundary HUD */}
      {activeAlgo === 'heapSort' && sortedBoundary !== null && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-teal-500/20 shadow-xs flex flex-col gap-1 text-xs">
          <span className="font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
            In-Place Sort Boundary
          </span>
          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Active Heap: <span className="font-mono text-teal-500 font-bold">[0 .. {sortedBoundary - 1}]</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Sorted Suffix: <span className="font-mono text-emerald-500 font-bold">[{sortedBoundary} .. {heap.length - 1}]</span>
          </div>
        </div>
      )}

      {/* 2. Dry Run Variable Tracker */}
      <DryRunVariableTracker
        variables={activeVariables}
        activeLine={activeLine}
        explanation={explanation.action}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => setIsVoiceEnabled(v => !v)}
      />

      {/* 3. Code Inspector */}
      <CodeInspector
        codeSnippets={currentCodeSnippet}
        activeLine={activeLine}
        variables={activeVariables}
        title={`${HEAP_ALGORITHMS.find(a => a.id === activeAlgo)?.name} Logic`}
      />
    </div>
  );

  // =========================================================================
  // CENTER CANVAS STAGE
  // =========================================================================
  return (
    <ResponsiveVisualizerShell
      title="Heap & Priority Queue Studio"
      subtitle="Synchronized Binary Tree & Contiguous Array Views with O(n) Heapify and In-Place Heap Sort"
      currentPath="/visualizer/heap"
      category="ds"
      controls={renderControls}
      playback={
        <VisualizerPlaybackBar
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onStepForward={handleStepForward}
          onStepBack={handleStepBackward}
          onReset={handleReset}
          speed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          currentStep={currentStepIdx}
          totalSteps={Math.max(steps.length, 1)}
          stepDescription={explanation.action || 'Heap simulation ready'}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(v => !v)}
        />
      }
      rightPanel={renderRightPanel}
      consoleOutput={logs}
    >
      <div className="flex-1 flex flex-col p-3 sm:p-5 overflow-hidden w-full h-full">
        {/* SYNCHRONIZED DUAL VIEW STAGE (HERO & UNOBSTRUCTED) */}
        <div className="flex-1 w-full h-full min-h-[560px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-between relative shadow-2xl gap-8">
          {/* VIEW 1: HIERARCHICAL BINARY TREE SVG */}
          <div className="w-full flex-1 flex flex-col items-center justify-center relative min-h-[240px]">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
              Hierarchical Binary Tree Representation
            </span>

            <svg width="100%" height="320" viewBox="0 0 700 320" className="overflow-visible max-w-2xl">
              {/* Connecting Edges */}
              {heap.map((val, idx) => {
                if (idx === 0) return null;
                const parentIdx = Math.floor((idx - 1) / 2);
                const pCoords = getNodeCoordinates(parentIdx, heap.length);
                const cCoords = getNodeCoordinates(idx, heap.length);

                return (
                  <line
                    key={`edge-${idx}`}
                    x1={pCoords.x}
                    y1={pCoords.y}
                    x2={cCoords.x}
                    y2={cCoords.y}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-300 dark:text-white/15"
                  />
                );
              })}

              {/* Tree Nodes */}
              {heap.map((val, idx) => {
                const coords = getNodeCoordinates(idx, heap.length);
                const isHigh = highlightIndices.includes(idx);
                const isSorted = sortedBoundary !== null && idx >= sortedBoundary;

                return (
                  <g key={`node-${idx}`} className="cursor-pointer">
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="18"
                      className={`transition-all duration-300 ${
                        isHigh
                          ? 'fill-amber-500 stroke-amber-300 stroke-[3]'
                          : isSorted
                          ? 'fill-emerald-500 stroke-emerald-300 stroke-[2]'
                          : idx === 0
                          ? 'fill-teal-500 stroke-teal-300 stroke-[2]'
                          : 'fill-white dark:fill-[#1b1b1f] stroke-gray-300 dark:stroke-white/20 stroke-[1.5]'
                      }`}
                    />
                    <text
                      x={coords.x}
                      y={coords.y + 4}
                      textAnchor="middle"
                      className={`text-xs font-mono font-black ${
                        isHigh || isSorted || idx === 0 ? 'fill-black' : 'fill-gray-900 dark:fill-white'
                      }`}
                    >
                      {val}
                    </text>
                    <text
                      x={coords.x}
                      y={coords.y - 22}
                      textAnchor="middle"
                      className="text-[9px] font-mono fill-gray-400 font-bold"
                    >
                      [{idx}]
                    </text>
                  </g>
                );
              })}
            </svg>

            {heap.length === 0 && (
              <div className="text-gray-400 text-xs italic font-bold">Heap is Empty</div>
            )}
          </div>

          {/* VIEW 2: CONTIGUOUS ARRAY MAPPING */}
          <div className="w-full flex flex-col items-center gap-2 border-t border-gray-200 dark:border-white/10 pt-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Contiguous Array Memory Mapping (0-Indexed)
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {heap.map((val, idx) => {
                const isHigh = highlightIndices.includes(idx);
                const isSorted = sortedBoundary !== null && idx >= sortedBoundary;

                return (
                  <motion.div
                    key={idx}
                    animate={{ scale: isHigh ? 1.15 : 1 }}
                    className={`min-w-12 h-14 rounded-xl border flex flex-col items-center justify-between p-1 font-mono transition-all ${
                      isHigh
                        ? 'bg-amber-500 text-black border-amber-300 shadow-md ring-2 ring-amber-400'
                        : isSorted
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                        : idx === 0
                        ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/40 font-black'
                        : 'bg-white dark:bg-[#161619] text-gray-800 dark:text-gray-200 border-gray-300 dark:border-white/10'
                    }`}
                  >
                    <span className="text-[8px] opacity-60">[{idx}]</span>
                    <span className="text-sm font-black">{val}</span>
                    <span className="text-[7px] uppercase font-sans font-bold">
                      {idx === 0 ? 'ROOT' : isSorted ? 'SORT' : 'NODE'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveVisualizerShell>
  );
}
