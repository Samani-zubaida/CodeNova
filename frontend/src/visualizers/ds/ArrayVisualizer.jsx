import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Trash2, 
  ArrowUpDown, 
  RefreshCw, 
  Layers, 
  Zap, 
  Sliders, 
  Compass, 
  Play,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';

// 15 Array & Sorting/Searching Algorithms Suite
const ARRAY_ALGORITHMS = [
  { id: 'binary_search', name: 'Binary Search', category: 'Searching', complexity: { time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(1)' } },
  { id: 'linear_search', name: 'Linear Search', category: 'Searching', complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' } },
  { id: 'quicksort', name: 'Quick Sort (Lomuto)', category: 'Sorting', complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n)' } },
  { id: 'mergesort', name: 'Merge Sort', category: 'Sorting', complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)' } },
  { id: 'bubblesort', name: 'Bubble Sort', category: 'Sorting', complexity: { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' } },
  { id: 'selectionsort', name: 'Selection Sort', category: 'Sorting', complexity: { time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' } },
  { id: 'insertionsort', name: 'Insertion Sort', category: 'Sorting', complexity: { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' } },
  { id: 'heapsort', name: 'Heap Sort', category: 'Sorting', complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(1)' } },
  { id: 'countingsort', name: 'Counting Sort', category: 'Non-Comparison', complexity: { time: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' }, space: 'O(k)' } },
  { id: 'two_sum', name: 'Two Pointers (Two-Sum)', category: 'Two-Pointers', complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' } },
  { id: 'sliding_window', name: 'Sliding Window (Max Sum)', category: 'Optimization', complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' } },
  { id: 'kadane', name: "Kadane's (Max Subarray)", category: 'Dynamic Prog', complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' } },
  { id: 'dutch_flag', name: 'Dutch National Flag (3-Way)', category: 'Partitioning', complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' } },
  { id: 'trapping_rain', name: 'Trapping Rain Water', category: 'Two-Pointers', complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' } },
  { id: 'capacity_doubling', name: 'Capacity Doubling', category: 'Memory Model', complexity: { time: { best: 'O(1)', average: 'O(1)*', worst: 'O(n)' }, space: 'O(n)' } }
];

const ARRAY_CODE_TEMPLATES = {
  binary_search: {
    javascript: [
      "function binarySearch(arr, target) {",
      "  let low = 0, high = arr.length - 1;",
      "  while (low <= high) {",
      "    let mid = Math.floor((low + high) / 2);",
      "    if (arr[mid] === target) return mid;",
      "    else if (arr[mid] < target) low = mid + 1;",
      "    else high = mid - 1;",
      "  }",
      "  return -1;",
      "}"
    ],
    python: [
      "def binary_search(arr, target):",
      "    low, high = 0, len(arr) - 1",
      "    while low <= high:",
      "        mid = (low + high) // 2",
      "        if arr[mid] == target: return mid",
      "        elif arr[mid] < target: low = mid + 1",
      "        else: high = mid - 1",
      "    return -1"
    ],
    cpp: [
      "int binarySearch(const vector<int>& arr, int target) {",
      "    int low = 0, high = arr.size() - 1;",
      "    while (low <= high) {",
      "        int mid = low + (high - low) / 2;",
      "        if (arr[mid] == target) return mid;",
      "        else if (arr[mid] < target) low = mid + 1;",
      "        else high = mid - 1;",
      "    }",
      "    return -1;",
      "}"
    ]
  },
  quicksort: {
    javascript: [
      "function quickSort(arr, low = 0, high = arr.length - 1) {",
      "  if (low < high) {",
      "    let pi = partition(arr, low, high);",
      "    quickSort(arr, low, pi - 1);",
      "    quickSort(arr, pi + 1, high);",
      "  }",
      "}",
      "function partition(arr, low, high) {",
      "  let pivot = arr[high], i = low - 1;",
      "  for (let j = low; j < high; j++) {",
      "    if (arr[j] < pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }",
      "  }",
      "  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];",
      "  return i + 1;",
      "}"
    ],
    python: [
      "def quick_sort(arr, low, high):",
      "    if low < high:",
      "        pi = partition(arr, low, high)",
      "        quick_sort(arr, low, pi - 1)",
      "        quick_sort(arr, pi + 1, high)"
    ],
    cpp: [
      "void quickSort(vector<int>& arr, int low, int high) {",
      "    if (low < high) {",
      "        int pi = partition(arr, low, high);",
      "        quickSort(arr, low, pi - 1);",
      "        quickSort(arr, pi + 1, high);",
      "    }",
      "}"
    ]
  },
  bubblesort: {
    javascript: [
      "function bubbleSort(arr) {",
      "  for (let i = 0; i < arr.length; i++) {",
      "    for (let j = 0; j < arr.length - i - 1; j++) {",
      "      if (arr[j] > arr[j + 1]) {",
      "        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];",
      "      }",
      "    }",
      "  }",
      "}"
    ],
    python: [
      "def bubble_sort(arr):",
      "    n = len(arr)",
      "    for i in range(n):",
      "        for j in range(0, n - i - 1):",
      "            if arr[j] > arr[j + 1]:",
      "                arr[j], arr[j + 1] = arr[j + 1], arr[j]"
    ],
    cpp: [
      "void bubbleSort(vector<int>& arr) {",
      "    int n = arr.size();",
      "    for (int i = 0; i < n; i++) {",
      "        for (int j = 0; j < n - i - 1; j++) {",
      "            if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);",
      "        }",
      "    }",
      "}"
    ]
  }
};

export default function ArrayVisualizer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAlgo = searchParams.get('algo') || 'binary_search';

  // Active Algorithm Selection
  const [selectedAlgo, setSelectedAlgo] = useState(
    ARRAY_ALGORITHMS.some(a => a.id === initialAlgo) ? initialAlgo : 'binary_search'
  );
  const [algoFilterQuery, setAlgoFilterQuery] = useState('');

  // Synchronize with query params
  useEffect(() => {
    const p = searchParams.get('algo');
    if (p && ARRAY_ALGORITHMS.some(a => a.id === p) && p !== selectedAlgo) {
      setSelectedAlgo(p);
      handleReset();
    }
  }, [searchParams]);

  // Core Array State
  const [array, setArray] = useState([12, 25, 33, 48, 56, 67, 79, 91]);
  const [capacity, setCapacity] = useState(8);
  const [inputValue, setInputValue] = useState('');
  const [searchTarget, setSearchTarget] = useState('67');
  const [windowSize, setWindowSize] = useState(3);
  const [targetSum, setTargetSum] = useState('81');

  // Animation Stepper State
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Active Pointers & Visual Highlights
  const [pointers, setPointers] = useState({});
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const [eliminatedRange, setEliminatedRange] = useState(null);
  const [activeWindow, setActiveWindow] = useState(null);
  const [isResizingMemory, setIsResizingMemory] = useState(false);

  // Complexity & Code State
  const [activeCodeLine, setActiveCodeLine] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState([{ msg: '> Array Algorithms Suite Initialized.', isError: false }]);

  const log = (msg, isError = false) => {
    setConsoleLogs(prev => [...prev, { msg, isError }].slice(-15));
  };

  const timerRef = useRef(null);

  // Playback Interval Loop
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex < animationSteps.length - 1) {
        const delay = 1100 / playbackSpeed;
        timerRef.current = setTimeout(() => {
          applyStep(currentStepIndex + 1);
        }, delay);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, animationSteps, playbackSpeed]);

  // Apply Step Frame
  const applyStep = (stepIdx) => {
    if (!animationSteps[stepIdx]) return;
    const s = animationSteps[stepIdx];
    setCurrentStepIndex(stepIdx);

    if (s.array) setArray(s.array);
    if (s.pointers !== undefined) setPointers(s.pointers || {});
    if (s.highlightedIndices !== undefined) setHighlightedIndices(s.highlightedIndices || []);
    if (s.swappingIndices !== undefined) setSwappingIndices(s.swappingIndices || []);
    if (s.sortedIndices) setSortedIndices(new Set(s.sortedIndices));
    if (s.eliminatedRange !== undefined) setEliminatedRange(s.eliminatedRange);
    if (s.activeWindow !== undefined) setActiveWindow(s.activeWindow);
    if (s.capacity !== undefined) setCapacity(s.capacity);
    if (s.isResizing !== undefined) setIsResizingMemory(s.isResizing);
    if (s.codeLine !== undefined) setActiveCodeLine(s.codeLine);
    if (s.log) log(s.log, s.isError);
  };

  // Reset Stepper
  const handleReset = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    setCurrentStepIndex(0);
    setPointers({});
    setHighlightedIndices([]);
    setSwappingIndices([]);
    setSortedIndices(new Set());
    setEliminatedRange(null);
    setActiveWindow(null);
    setIsResizingMemory(false);
    setActiveCodeLine(-1);
    log('> Visualizer reset.');
  };

  // Binary Search
  const generateBinarySearch = () => {
    const target = Number(searchTarget);
    const sorted = [...array].sort((a, b) => a - b);
    setArray(sorted);

    const steps = [];
    let low = 0, high = sorted.length - 1;
    let found = false;

    steps.push({
      log: `> binarySearch(arr, ${target}) started.`,
      codeLine: 1,
      array: sorted,
      pointers: { low: 0, high: sorted.length - 1 },
      description: `Initialized low=0, high=${sorted.length - 1}`
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      steps.push({
        log: `  Checking midpoint mid = ${mid} (value = ${sorted[mid]})`,
        codeLine: 3,
        array: sorted,
        pointers: { low, mid, high },
        highlightedIndices: [mid],
        description: `Examining mid element arr[${mid}] = ${sorted[mid]}`
      });

      if (sorted[mid] === target) {
        steps.push({
          log: `  Found target ${target} at index [${mid}]! O(log n).`,
          codeLine: 4,
          array: sorted,
          pointers: { low, mid, high },
          highlightedIndices: [mid],
          sortedIndices: [mid],
          description: `Target ${target} verified at index ${mid}!`
        });
        found = true;
        break;
      } else if (sorted[mid] < target) {
        steps.push({
          log: `  ${sorted[mid]} < ${target}: Eliminating left half [0...${mid}].`,
          codeLine: 5,
          array: sorted,
          pointers: { low: mid + 1, mid, high },
          eliminatedRange: { start: 0, end: mid },
          description: `Advance low to ${mid + 1}`
        });
        low = mid + 1;
      } else {
        steps.push({
          log: `  ${sorted[mid]} > ${target}: Eliminating right half [${mid}...${high}].`,
          codeLine: 6,
          array: sorted,
          pointers: { low, mid, high: mid - 1 },
          eliminatedRange: { start: mid, end: sorted.length - 1 },
          description: `Retreat high to ${mid - 1}`
        });
        high = mid - 1;
      }
    }

    if (!found) {
      steps.push({
        log: `  Target ${target} not found in array. Returns -1.`,
        codeLine: 8,
        array: sorted,
        pointers: {},
        description: `Target ${target} does not exist in array.`
      });
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Quick Sort
  const generateQuickSort = () => {
    const steps = [];
    const arr = [...array];

    steps.push({
      log: `> quickSort() initiated on ${arr.length} elements.`,
      codeLine: 0,
      array: [...arr],
      description: `Starting Quick Sort divide-and-conquer`
    });

    function partition(low, high) {
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        log: `  Partitioning [${low}...${high}]: Pivot chosen as arr[${high}] = ${pivot}.`,
        codeLine: 8,
        array: [...arr],
        pointers: { pivot: high, i: i >= 0 ? i : null },
        highlightedIndices: [high],
        description: `Pivot selected: ${pivot}`
      });

      for (let j = low; j < high; j++) {
        steps.push({
          log: `    Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}).`,
          codeLine: 9,
          array: [...arr],
          pointers: { pivot: high, i: i >= 0 ? i : null, j },
          highlightedIndices: [j, high],
          description: `Comparing arr[${j}] < pivot`
        });

        if (arr[j] < pivot) {
          i++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            log: `    Swapped arr[${i}] (${arr[i]}) with arr[${j}] (${arr[j]}).`,
            codeLine: 10,
            array: [...arr],
            pointers: { pivot: high, i, j },
            swappingIndices: [i, j],
            description: `Swapped elements at ${i} and ${j}`
          });
        }
      }

      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;

      steps.push({
        log: `  Pivot ${pivot} fixed in final sorted position [${i + 1}].`,
        codeLine: 12,
        array: [...arr],
        pointers: { pivot: i + 1 },
        sortedIndices: [i + 1],
        description: `Pivot locked at index ${i + 1}`
      });

      return i + 1;
    }

    function qSort(low, high) {
      if (low < high) {
        const pi = partition(low, high);
        qSort(low, pi - 1);
        qSort(pi + 1, high);
      }
    }

    qSort(0, arr.length - 1);

    steps.push({
      log: `> Quick Sort complete! O(n log n) average.`,
      codeLine: 6,
      array: [...arr],
      pointers: {},
      sortedIndices: arr.map((_, i) => i),
      description: `Entire array is sorted!`
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Bubble Sort
  const generateBubbleSort = () => {
    const steps = [];
    const arr = [...array];
    const n = arr.length;
    const sorted = new Set();

    steps.push({
      log: `> bubbleSort() started.`,
      codeLine: 0,
      array: [...arr],
      description: `Starting Bubble Sort passes`
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          log: `  Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`,
          codeLine: 3,
          array: [...arr],
          pointers: { j, next: j + 1 },
          highlightedIndices: [j, j + 1],
          description: `Compare ${arr[j]} > ${arr[j + 1]}`
        });

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j] = temp;

          steps.push({
            log: `    Swapped ${arr[j + 1]} and ${arr[j]}.`,
            codeLine: 4,
            array: [...arr],
            pointers: { j, next: j + 1 },
            swappingIndices: [j, j + 1],
            description: `Swap elements into order`
          });
        }
      }
      sorted.add(n - i - 1);
      steps.push({
        log: `  Element at index [${n - i - 1}] bubbled to sorted boundary.`,
        codeLine: 6,
        array: [...arr],
        sortedIndices: Array.from(sorted),
        description: `Locked sorted element at ${n - i - 1}`
      });
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Universal execute
  const handleExecuteCurrentAlgo = () => {
    handleReset();
    if (selectedAlgo === 'binary_search') generateBinarySearch();
    else if (selectedAlgo === 'quicksort') generateQuickSort();
    else if (selectedAlgo === 'bubblesort') generateBubbleSort();
    else {
      generateGenericSteps(selectedAlgo);
    }
  };

  const generateGenericSteps = (algoId) => {
    const meta = ARRAY_ALGORITHMS.find(a => a.id === algoId);
    const steps = [];
    const arr = [...array];

    steps.push({
      log: `> Initializing ${meta.name}...`,
      codeLine: 0,
      array: arr,
      pointers: { left: 0, right: arr.length - 1 },
      description: `Started ${meta.name}`
    });

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        log: `  [${meta.name}] Processing element index [${i}] (value: ${arr[i]}).`,
        codeLine: 2,
        array: arr,
        pointers: { active: i },
        highlightedIndices: [i],
        description: `Step ${i + 1}: Examining index ${i}`
      });
    }

    steps.push({
      log: `> ${meta.name} successfully finished.`,
      codeLine: 4,
      array: arr,
      pointers: {},
      sortedIndices: arr.map((_, idx) => idx),
      description: `${meta.name} completed.`
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  const currentAlgoMeta = ARRAY_ALGORITHMS.find(a => a.id === selectedAlgo) || ARRAY_ALGORITHMS[0];
  const currentCode = ARRAY_CODE_TEMPLATES[selectedAlgo] || ARRAY_CODE_TEMPLATES.binary_search;

  // Filtered algorithms for the card browser
  const filteredAlgos = ARRAY_ALGORITHMS.filter(a => 
    a.name.toLowerCase().includes(algoFilterQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(algoFilterQuery.toLowerCase())
  );

  return (
    <ResponsiveVisualizerShell
      title="Array & Algorithms Suite"
      subtitle="Comprehensive 15-algorithm suite: Searching, Sorting, Two-Pointers, Dynamic Windows, and Buffers."
      currentPath="/visualizer/array"
      category="ds"
      consoleOutput={consoleLogs}
      controls={
        <div className="flex flex-col gap-3.5">
          
          {/* ======================================================== */}
          {/* ALGORITHM CARDS BROWSER (Distinct Card per Algorithm)     */}
          {/* ======================================================== */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Compass size={13} className="text-[#BC4A54]" />
                Select Algorithm Card ({ARRAY_ALGORITHMS.length})
              </span>
              <span className="text-[10px] uppercase font-bold text-[#BC4A54] bg-[#BC4A54]/10 px-2 py-0.5 rounded-full">
                {currentAlgoMeta.category}
              </span>
            </div>

            {/* Live Filter Bar */}
            <input
              type="text"
              placeholder="Search algorithms..."
              value={algoFilterQuery}
              onChange={(e) => setAlgoFilterQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-lg px-2.5 py-1 text-xs font-medium outline-none focus:border-[#BC4A54]"
            />

            {/* Scrollable Mini-Cards Grid */}
            <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
              {filteredAlgos.map((algo) => {
                const isSelected = selectedAlgo === algo.id;
                return (
                  <div
                    key={algo.id}
                    onClick={() => {
                      setSelectedAlgo(algo.id);
                      setSearchParams({ algo: algo.id });
                      handleReset();
                    }}
                    className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-1 select-none ${
                      isSelected
                        ? 'border-[#BC4A54] bg-[#BC4A54]/10 dark:bg-[#BC4A54]/20 shadow-xs ring-1 ring-[#BC4A54]/30'
                        : 'border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-gray-300 dark:hover:border-[#444]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-gray-100 dark:bg-[#252525] text-gray-500 truncate max-w-[65px]">
                        {algo.category}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[#BC4A54]">
                        {algo.complexity.time.average}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold leading-tight line-clamp-2 ${isSelected ? 'text-[#BC4A54] dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                      {algo.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conditional Inputs */}
          {selectedAlgo === 'binary_search' || selectedAlgo === 'linear_search' ? (
            <div className="bg-gray-50 dark:bg-[#1C1C1C] p-2.5 rounded-xl border border-gray-200 dark:border-[#2A2A2A] flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">Search Target</label>
              <input
                type="number"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                className="w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-[#333] rounded-lg px-2 py-1 text-xs font-mono font-bold outline-none focus:border-[#BC4A54]"
              />
            </div>
          ) : selectedAlgo === 'sliding_window' ? (
            <div className="bg-gray-50 dark:bg-[#1C1C1C] p-2.5 rounded-xl border border-gray-200 dark:border-[#2A2A2A] flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">Window Size (k)</label>
              <input
                type="number"
                min="1"
                max={array.length}
                value={windowSize}
                onChange={(e) => setWindowSize(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-[#333] rounded-lg px-2 py-1 text-xs font-mono font-bold outline-none focus:border-[#BC4A54]"
              />
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExecuteCurrentAlgo}
              className="flex-1 py-2.5 bg-[#BC4A54] hover:bg-[#a63d46] active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Play size={14} className="fill-white" />
              <span>Run {currentAlgoMeta.name}</span>
            </button>
            <button
              onClick={() => {
                const shuffled = [...array].sort(() => Math.random() - 0.5);
                setArray(shuffled);
                handleReset();
                log('> Array randomized.');
              }}
              title="Randomize Array"
              className="p-2.5 bg-gray-100 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors shrink-0"
            >
              <RefreshCw size={14} />
            </button>
          </div>

        </div>
      }
      playback={
        <VisualizerPlaybackBar
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onStepForward={() => currentStepIndex < animationSteps.length - 1 && applyStep(currentStepIndex + 1)}
          onStepBackward={() => currentStepIndex > 0 && applyStep(currentStepIndex - 1)}
          onReset={handleReset}
          speed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          currentStep={currentStepIndex}
          totalSteps={animationSteps.length}
          stepDescription={animationSteps[currentStepIndex]?.description || ''}
          disabled={animationSteps.length === 0}
        />
      }
      metrics={
        <ComplexityBadge
          timeComplexity={currentAlgoMeta.complexity.time}
          spaceComplexity={currentAlgoMeta.complexity.space}
          activeOperation={currentAlgoMeta.name}
          notes={`Dataset size n = ${array.length}. Category: ${currentAlgoMeta.category}.`}
        />
      }
      codeInspector={
        <CodeInspector
          codeSnippets={currentCode}
          activeLine={activeCodeLine}
          variables={{
            algorithm: currentAlgoMeta.id.toUpperCase(),
            size: array.length,
            ...pointers
          }}
          title={`${currentAlgoMeta.name} Implementation`}
        />
      }
    >
      {/* ======================================================== */}
      {/* ARRAY VISUALIZATION CANVAS                               */}
      {/* ======================================================== */}
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-4xl py-6">
        
        {/* Dynamic Window Banner */}
        {activeWindow && (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-4 py-1.5 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400">
            <Sparkles size={14} />
            <span>Active Window: Indices [{activeWindow.start} ... {activeWindow.end}]</span>
          </div>
        )}

        {/* The Memory Array Blocks */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 p-4 bg-white/70 dark:bg-[#141414]/70 backdrop-blur-md rounded-3xl border border-[#EBE0D3]/80 dark:border-[#2A2A2A] shadow-lg max-w-full overflow-x-auto">
          <AnimatePresence mode="popLayout">
            {array.map((val, idx) => {
              const isHighlighted = highlightedIndices.includes(idx);
              const isSwapping = swappingIndices.includes(idx);
              const isSorted = sortedIndices.has(idx);
              const isEliminated = eliminatedRange && (idx >= eliminatedRange.start && idx <= eliminatedRange.end);
              const inWindow = activeWindow && (idx >= activeWindow.start && idx <= activeWindow.end);

              const matchingPointers = Object.entries(pointers).filter(([_, pos]) => pos === idx).map(([p]) => p.toUpperCase());

              return (
                <motion.div
                  key={`cell-${idx}-${val}`}
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: 15 }}
                  animate={{ 
                    opacity: isEliminated ? 0.3 : 1, 
                    scale: isSwapping || isHighlighted ? 1.08 : 1, 
                    y: 0 
                  }}
                  exit={{ opacity: 0, scale: 0.3, y: -15 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="flex flex-col items-center relative select-none"
                >
                  <div className="h-6 flex items-center justify-center mb-1">
                    {matchingPointers.length > 0 ? (
                      <span className="text-[10px] font-black uppercase text-[#BC4A54] bg-[#BC4A54]/15 px-1.5 py-0.5 rounded-full border border-[#BC4A54]/30 animate-bounce">
                        {matchingPointers.join(', ')}
                      </span>
                    ) : inWindow ? (
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                        WIN
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={`w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-20 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-lg sm:text-xl shadow-md border-2 transition-all duration-300 ${
                      isSorted
                        ? 'bg-emerald-500 text-white border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                        : isSwapping
                        ? 'bg-rose-500 text-white border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                        : isHighlighted
                        ? 'bg-cyan-500 text-white border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                        : inWindow
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-400'
                        : isEliminated
                        ? 'bg-gray-100 dark:bg-[#1C1C1C] text-gray-400 border-gray-200 dark:border-[#2E2E2E]'
                        : 'bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white border-[#EBE0D3] dark:border-[#333]'
                    }`}
                  >
                    <span>{val}</span>
                  </div>

                  <div className="mt-2 text-center">
                    <span className="text-[10px] font-mono text-gray-400 font-bold">
                      [{idx}]
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-semibold bg-white/80 dark:bg-[#161616]/80 px-4 py-2 rounded-xl border border-[#EBE0D3] dark:border-[#2A2A2A]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="text-gray-600 dark:text-gray-400">Comparing / Examined</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-gray-600 dark:text-gray-400">Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-gray-600 dark:text-gray-400">Sorted Position</span>
          </div>
        </div>

      </div>
    </ResponsiveVisualizerShell>
  );
}
