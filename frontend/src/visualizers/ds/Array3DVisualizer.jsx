import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  ArrowLeft, 
  ChevronDown, 
  Play, 
  Sparkles, 
  Target, 
  Compass, 
  GitFork,
  ArrowDown,
  Scissors,
  Layers,
  CheckCircle,
  Activity
} from 'lucide-react';
import { ARRAY_CATALOG } from './ArrayHub';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';

// Multi-language code snippets
const CODE_SNIPPETS = {
  mergesort: {
    javascript: [
      "function mergeSort(arr, l = 0, r = arr.length - 1) {",
      "  if (l >= r) return;",
      "  const m = Math.floor((l + r) / 2);",
      "  mergeSort(arr, l, m);",
      "  mergeSort(arr, m + 1, r);",
      "  merge(arr, l, m, r);",
      "}",
      "function merge(arr, l, m, r) {",
      "  const left = arr.slice(l, m + 1);",
      "  const right = arr.slice(m + 1, r + 1);",
      "  let i = 0, j = 0, k = l;",
      "  while (i < left.length && j < right.length) {",
      "    if (left[i] <= right[j]) arr[k++] = left[i++];",
      "    else arr[k++] = right[j++];",
      "  }",
      "  while (i < left.length) arr[k++] = left[i++];",
      "  while (j < right.length) arr[k++] = right[j++];",
      "}"
    ],
    python: [
      "def merge_sort(arr, l, r):",
      "    if l >= r: return",
      "    m = (l + r) // 2",
      "    merge_sort(arr, l, m)",
      "    merge_sort(arr, m + 1, r)",
      "    merge(arr, l, m, r)",
      "",
      "def merge(arr, l, m, r):",
      "    left, right = arr[l:m+1], arr[m+1:r+1]",
      "    i = j = 0; k = l",
      "    while i < len(left) and j < len(right):",
      "        if left[i] <= right[j]:",
      "            arr[k] = left[i]; i += 1",
      "        else:",
      "            arr[k] = right[j]; j += 1",
      "        k += 1",
      "    while i < len(left): arr[k] = left[i]; i += 1; k += 1",
      "    while j < len(right): arr[k] = right[j]; j += 1; k += 1"
    ],
    cpp: [
      "void mergeSort(vector<int>& arr, int l, int r) {",
      "    if (l >= r) return;",
      "    int m = l + (r - l) / 2;",
      "    mergeSort(arr, l, m);",
      "    mergeSort(arr, m + 1, r);",
      "    merge(arr, l, m, r);",
      "}",
      "void merge(vector<int>& arr, int l, int m, int r) {",
      "    vector<int> left(arr.begin() + l, arr.begin() + m + 1);",
      "    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);",
      "    int i = 0, j = 0, k = l;",
      "    while (i < left.size() && j < right.size()) {",
      "        if (left[i] <= right[j]) arr[k++] = left[i++];",
      "        else arr[k++] = right[j++];",
      "    }",
      "    while (i < left.size()) arr[k++] = left[i++];",
      "    while (j < right.size()) arr[k++] = right[j++];",
      "}"
    ]
  },
  trapping_rain: {
    javascript: [
      "function trapRainWater(heights) {",
      "  let l = 0, r = heights.length - 1;",
      "  let leftMax = 0, rightMax = 0, water = 0;",
      "  while (l < r) {",
      "    if (heights[l] < heights[r]) {",
      "      heights[l] >= leftMax ? (leftMax = heights[l]) : (water += leftMax - heights[l]);",
      "      l++;",
      "    } else {",
      "      heights[r] >= rightMax ? (rightMax = heights[r]) : (water += rightMax - heights[r]);",
      "      r--;",
      "    }",
      "  }",
      "  return water;",
      "}"
    ],
    python: [
      "def trap_rain_water(heights):",
      "    l, r = 0, len(heights) - 1",
      "    left_max = right_max = water = 0",
      "    while l < r:",
      "        if heights[l] < heights[r]:",
      "            left_max = max(left_max, heights[l])",
      "            water += left_max - heights[l]",
      "            l += 1",
      "        else:",
      "            right_max = max(right_max, heights[r])",
      "            water += right_max - heights[r]",
      "            r -= 1",
      "    return water"
    ],
    cpp: [
      "int trapRainWater(const vector<int>& h) {",
      "    int l = 0, r = h.size() - 1;",
      "    int lMax = 0, rMax = 0, totalWater = 0;",
      "    while (l < r) {",
      "        if (h[l] < h[r]) {",
      "            if (h[l] >= lMax) lMax = h[l];",
      "            else totalWater += lMax - h[l];",
      "            l++;",
      "        } else {",
      "            if (h[r] >= rMax) rMax = h[r];",
      "            else totalWater += rMax - h[r];",
      "            r--;",
      "        }",
      "    }",
      "    return totalWater;",
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
  },
  quicksort: {
    javascript: [
      "function quickSort(arr, low = 0, high = arr.length - 1) {",
      "  if (low < high) {",
      "    const pi = partition(arr, low, high);",
      "    quickSort(arr, low, pi - 1);",
      "    quickSort(arr, pi + 1, high);",
      "  }",
      "}",
      "function partition(arr, low, high) {",
      "  const pivot = arr[high];",
      "  let i = low - 1;",
      "  for (let j = low; j < high; j++) {",
      "    if (arr[j] < pivot) {",
      "      i++;",
      "      [arr[i], arr[j]] = [arr[j], arr[i]];",
      "    }",
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
      "        quick_sort(arr, pi + 1, high)",
      "",
      "def partition(arr, low, high):",
      "    pivot = arr[high]",
      "    i = low - 1",
      "    for j in range(low, high):",
      "        if arr[j] < pivot:",
      "            i += 1",
      "            arr[i], arr[j] = arr[j], arr[i]",
      "    arr[i + 1], arr[high] = arr[high], arr[i + 1]",
      "    return i + 1"
    ],
    cpp: [
      "int partition(vector<int>& arr, int low, int high) {",
      "    int pivot = arr[high], i = low - 1;",
      "    for (int j = low; j < high; j++) {",
      "        if (arr[j] < pivot) swap(arr[++i], arr[j]);",
      "    }",
      "    swap(arr[i + 1], arr[high]);",
      "    return i + 1;",
      "}",
      "void quickSort(vector<int>& arr, int low, int high) {",
      "    if (low < high) {",
      "        int pi = partition(arr, low, high);",
      "        quickSort(arr, low, pi - 1);",
      "        quickSort(arr, pi + 1, high);",
      "    }",
      "}"
    ]
  },
  insertionsort: {
    javascript: [
      "function insertionSort(arr) {",
      "  for (let i = 1; i < arr.length; i++) {",
      "    let key = arr[i];",
      "    let j = i - 1;",
      "    while (j >= 0 && arr[j] > key) {",
      "      arr[j + 1] = arr[j];",
      "      j--;",
      "    }",
      "    arr[j + 1] = key;",
      "  }",
      "}"
    ],
    python: [
      "def insertion_sort(arr):",
      "    for i in range(1, len(arr)):",
      "        key = arr[i]",
      "        j = i - 1",
      "        while j >= 0 and arr[j] > key:",
      "            arr[j + 1] = arr[j]",
      "            j -= 1",
      "        arr[j + 1] = key"
    ],
    cpp: [
      "void insertionSort(vector<int>& arr) {",
      "    for (int i = 1; i < arr.size(); i++) {",
      "        int key = arr[i], j = i - 1;",
      "        while (j >= 0 && arr[j] > key) {",
      "            arr[j + 1] = arr[j];",
      "            j--;",
      "        }",
      "        arr[j + 1] = key;",
      "    }",
      "}"
    ]
  },
  binary_search: {
    javascript: [
      "function binarySearch(arr, target) {",
      "  let low = 0, high = arr.length - 1;",
      "  while (low <= high) {",
      "    const mid = Math.floor((low + high) / 2);",
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
  two_sum: {
    javascript: [
      "function twoSumSorted(arr, target) {",
      "  let left = 0, right = arr.length - 1;",
      "  while (left < right) {",
      "    const sum = arr[left] + arr[right];",
      "    if (sum === target) return [left, right];",
      "    else if (sum < target) left++;",
      "    else right--;",
      "  }",
      "  return [];",
      "}"
    ],
    python: [
      "def two_sum_sorted(arr, target):",
      "    l, r = 0, len(arr) - 1",
      "    while l < r:",
      "        s = arr[l] + arr[r]",
      "        if s == target: return [l, r]",
      "        elif s < target: l += 1",
      "        else: r -= 1",
      "    return []"
    ],
    cpp: [
      "vector<int> twoSum(vector<int>& arr, int target) {",
      "    int l = 0, r = arr.size() - 1;",
      "    while (l < r) {",
      "        int s = arr[l] + arr[r];",
      "        if (s == target) return {l, r};",
      "        else if (s < target) l++;",
      "        else r--;",
      "    }",
      "    return {};",
      "}"
    ]
  },
  dutch_flag: {
    javascript: [
      "function sortColors(nums) {",
      "  let low = 0, mid = 0, high = nums.length - 1;",
      "  while (mid <= high) {",
      "    if (nums[mid] === 0) {",
      "      [nums[low], nums[mid]] = [nums[mid], nums[low]];",
      "      low++; mid++;",
      "    } else if (nums[mid] === 1) {",
      "      mid++;",
      "    } else {",
      "      [nums[mid], nums[high]] = [nums[high], nums[mid]];",
      "      high--;",
      "    }",
      "  }",
      "}"
    ],
    python: [
      "def sort_colors(nums):",
      "    low, mid, high = 0, 0, len(nums) - 1",
      "    while mid <= high:",
      "        if nums[mid] == 0:",
      "            nums[low], nums[mid] = nums[mid], nums[low]",
      "            low += 1; mid += 1",
      "        elif nums[mid] == 1: mid += 1",
      "        else:",
      "            nums[mid], nums[high] = nums[high], nums[mid]",
      "            high -= 1"
    ],
    cpp: [
      "void sortColors(vector<int>& nums) {",
      "    int low = 0, mid = 0, high = nums.size() - 1;",
      "    while (mid <= high) {",
      "        if (nums[mid] == 0) swap(nums[low++], nums[mid++]);",
      "        else if (nums[mid] == 1) mid++;",
      "        else swap(nums[mid], nums[high--]);",
      "    }",
      "}"
    ]
  },
  kadane: {
    javascript: [
      "function maxSubArray(nums) {",
      "  let currentSum = nums[0], maxSum = nums[0];",
      "  for (let i = 1; i < nums.length; i++) {",
      "    currentSum = Math.max(nums[i], currentSum + nums[i]);",
      "    maxSum = Math.max(maxSum, currentSum);",
      "  }",
      "  return maxSum;",
      "}"
    ],
    python: [
      "def max_sub_array(nums):",
      "    cur = m = nums[0]",
      "    for x in nums[1:]:",
      "        cur = max(x, cur + x)",
      "        m = max(m, cur)",
      "    return m"
    ],
    cpp: [
      "int maxSubArray(vector<int>& nums) {",
      "    int cur = nums[0], maxS = nums[0];",
      "    for (int i = 1; i < nums.size(); i++) {",
      "        cur = max(nums[i], cur + nums[i]);",
      "        maxS = max(maxS, cur);",
      "    }",
      "    return maxS;",
      "}"
    ]
  },
  sliding_window: {
    javascript: [
      "function maxSumSubarray(arr, k) {",
      "  let windowSum = 0, maxSum = 0;",
      "  for (let i = 0; i < k; i++) windowSum += arr[i];",
      "  maxSum = windowSum;",
      "  for (let i = k; i < arr.length; i++) {",
      "    windowSum += arr[i] - arr[i - k];",
      "    maxSum = Math.max(maxSum, windowSum);",
      "  }",
      "  return maxSum;",
      "}"
    ],
    python: [
      "def max_sum_subarray(arr, k):",
      "    w = sum(arr[:k])",
      "    m = w",
      "    for i in range(k, len(arr)):",
      "        w += arr[i] - arr[i - k]",
      "        m = max(m, w)",
      "    return m"
    ],
    cpp: [
      "int maxSumSubarray(vector<int>& arr, int k) {",
      "    int w = 0; for(int i=0; i<k; i++) w += arr[i];",
      "    int m = w;",
      "    for (int i = k; i < arr.size(); i++) {",
      "        w += arr[i] - arr[i - k];",
      "        m = max(m, w);",
      "    }",
      "    return m;",
      "}"
    ]
  }
};

export default function Array3DVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const currentAlgo = ARRAY_CATALOG.find(a => a.id === algoId) || ARRAY_CATALOG[0];
  const isTrappingRain = currentAlgo.id === 'trapping_rain';
  const isMergeSort = currentAlgo.id === 'mergesort';
  const isBubbleSort = currentAlgo.id === 'bubblesort';

  // Core Array State
  const [array, setArray] = useState(() => {
    if (currentAlgo.id === 'trapping_rain') return [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    if (currentAlgo.id === 'mergesort') return [38, 27, 43, 3, 9, 82, 10, 19];
    if (currentAlgo.id === 'quicksort' || currentAlgo.id === 'bubblesort' || currentAlgo.id === 'insertionsort') {
      return [52, 28, 14, 40, 18, 9, 65];
    }
    if (currentAlgo.id === 'two_sum') return [10, 20, 35, 48, 55, 62, 79];
    if (currentAlgo.id === 'dutch_flag') return [2, 0, 1, 2, 1, 0, 2];
    return [14, 28, 35, 49, 62, 77, 85, 96];
  });

  const [searchTarget, setSearchTarget] = useState('77');
  const [targetSum, setTargetSum] = useState('83');
  const [trappedWaterHeights, setTrappedWaterHeights] = useState([]);
  const [trappingWaterStats, setTrappingWaterStats] = useState({ leftMax: 0, rightMax: 0, totalWater: 0 });

  // Merge Sort Dedicated States
  const [activeStepType, setActiveStepType] = useState('INIT');
  const [activeDivideState, setActiveDivideState] = useState(null);
  const [activeMergeState, setActiveMergeState] = useState(null);
  const [activeRange, setActiveRange] = useState(null);

  // Goal Index Inspector (Trapping Rain)
  const [goalIndex, setGoalIndex] = useState(5);

  // Animation Stepper State
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Active Pointers & Visual Highlights
  const [pointers, setPointers] = useState({});
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const [eliminatedRange, setEliminatedRange] = useState(null);
  const [actionBanner, setActionBanner] = useState('');
  const [activeCodeLine, setActiveCodeLine] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState([
    { msg: `> ${currentAlgo.name} visualizer ready.`, isError: false }
  ]);

  const log = (msg, isError = false) => {
    setConsoleLogs(prev => [...prev, { msg, isError }].slice(-15));
  };

  const timerRef = useRef(null);

  // Auto initialize when algorithm changes
  useEffect(() => {
    handleReset();
    let initialArr = [14, 28, 35, 49, 62, 77, 85, 96];
    if (currentAlgo.id === 'trapping_rain') {
      initialArr = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
      setGoalIndex(5);
    } else if (currentAlgo.id === 'mergesort') {
      initialArr = [38, 27, 43, 3, 9, 82, 10, 19];
    } else if (currentAlgo.id === 'quicksort' || currentAlgo.id === 'bubblesort' || currentAlgo.id === 'insertionsort') {
      initialArr = [52, 28, 14, 40, 18, 9, 65];
    } else if (currentAlgo.id === 'two_sum') {
      initialArr = [10, 20, 35, 48, 55, 62, 79];
      setTargetSum('83');
    }
    setArray(initialArr);
    log(`> Switched model to ${currentAlgo.name}.`);
  }, [algoId]);

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex < animationSteps.length - 1) {
        const delay = Math.max(200, Math.round(1600 / playbackSpeed));
        timerRef.current = setTimeout(() => {
          applyStep(currentStepIndex + 1);
        }, delay);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, animationSteps, playbackSpeed]);

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
    if (s.waterHeights) setTrappedWaterHeights(s.waterHeights);
    if (s.waterStats) setTrappingWaterStats(s.waterStats);
    if (s.stepType !== undefined) setActiveStepType(s.stepType);
    if (s.divideState !== undefined) setActiveDivideState(s.divideState);
    if (s.mergeState !== undefined) setActiveMergeState(s.mergeState);
    if (s.activeRange !== undefined) setActiveRange(s.activeRange);
    if (s.codeLine !== undefined) setActiveCodeLine(s.codeLine);
    if (s.actionBanner !== undefined) setActionBanner(s.actionBanner);
    if (s.log) log(s.log, s.isError);
  };

  const handleReset = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    setCurrentStepIndex(0);
    setPointers({});
    setHighlightedIndices([]);
    setSwappingIndices([]);
    setSortedIndices(new Set());
    setEliminatedRange(null);
    setTrappedWaterHeights([]);
    setTrappingWaterStats({ leftMax: 0, rightMax: 0, totalWater: 0 });
    setActiveStepType('INIT');
    setActiveDivideState(null);
    setActiveMergeState(null);
    setActiveRange(null);
    setActiveCodeLine(-1);
    setActionBanner('');
    log('> Visualizer reset.');
  };

  // Trapping Rain Water Column Calculation
  const computeGoalIndexBreakdown = (targetIdx) => {
    if (targetIdx < 0 || targetIdx >= array.length) return null;
    const h = array;
    let lMax = 0;
    for (let i = 0; i <= targetIdx; i++) {
      if (h[i] >= lMax) lMax = h[i];
    }

    let rMax = 0;
    for (let i = targetIdx; i < h.length; i++) {
      if (h[i] >= rMax) rMax = h[i];
    }

    const colHeight = h[targetIdx];
    const waterLevel = Math.min(lMax, rMax);
    const trappedAtCol = Math.max(0, waterLevel - colHeight);

    return {
      index: targetIdx,
      colHeight,
      leftMax: lMax,
      rightMax: rMax,
      waterLevel,
      trappedAtCol
    };
  };

  const goalCalculation = isTrappingRain ? computeGoalIndexBreakdown(goalIndex) : null;

  // ========================================================
  // MERGE SORT: DIVIDE & CONQUER + LIVE MERGING ANIMATION
  // ========================================================
  const generateMergeSort = () => {
    const steps = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
      stepType: 'INIT',
      log: `> Merge Sort initialized on n = ${n} elements.`,
      codeLine: 0,
      array: [...arr],
      activeRange: { l: 0, m: Math.floor((n - 1) / 2), r: n - 1 },
      actionBanner: '🚀 Starting Merge Sort: Divide & Conquer Strategy.',
      description: 'Recursively divides array into halves until base cases (size 1), then merges sorted halves.'
    });

    function sort(l, r) {
      if (l >= r) {
        steps.push({
          stepType: 'BASE_CASE',
          log: `  [Base Case] Index [${l}] (${arr[l]}): Size 1 subarray is inherently sorted.`,
          codeLine: 1,
          array: [...arr],
          pointers: { base: l },
          highlightedIndices: [l],
          sortedIndices: [l],
          activeRange: { l, m: l, r },
          divideState: {
            range: `[${l}]`,
            val: arr[l],
            l, r
          },
          mergeState: null,
          actionBanner: `🎯 BASE CASE: Subarray [${l}] has only 1 element (${arr[l]}). Already sorted!`,
          description: `Subarrays of length 1 require no sorting.`
        });
        return;
      }

      const m = Math.floor((l + r) / 2);
      const leftPart = arr.slice(l, m + 1);
      const rightPart = arr.slice(m + 1, r + 1);

      // 1. DIVIDE ANIMATION STEP
      steps.push({
        stepType: 'DIVIDE',
        log: `✂️ DIVIDE: Splitting range [${l}...${r}] at midpoint m = ${m}.`,
        codeLine: 2,
        array: [...arr],
        pointers: { l, m, r },
        highlightedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        activeRange: { l, m, r },
        divideState: {
          range: `[${l}...${r}]`,
          l, m, r,
          leftPart: [...leftPart],
          rightPart: [...rightPart]
        },
        mergeState: null,
        actionBanner: `✂️ DIVIDING: Range [${l}...${r}] ➔ Left Half [${l}...${m}] & Right Half [${m + 1}...${r}].`,
        description: `Divide step: Halves the subarray at index ${m}.`
      });

      // Recurse left half
      sort(l, m);

      // Recurse right half
      sort(m + 1, r);

      // 2. MERGE ANIMATION STEPS
      const left = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);

      steps.push({
        stepType: 'MERGE_START',
        log: `🔄 MERGE: Ready to combine sorted Left [${left.join(', ')}] and Right [${right.join(', ')}].`,
        codeLine: 5,
        array: [...arr],
        pointers: { l, r },
        highlightedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        activeRange: { l, m, r },
        divideState: null,
        mergeState: {
          phase: 'start',
          range: `[${l}...${r}]`,
          l, m, r,
          leftSub: [...left],
          rightSub: [...right],
          activeI: 0,
          activeJ: 0,
          targetK: l,
          compared: null,
          mergedBuffer: [],
      merged: [],
          isComplete: false
        },
        actionBanner: `🔄 MERGING: Range [${l}...${r}] ➔ Combining Left [${left.join(', ')}] & Right [${right.join(', ')}].`,
        description: `Starting two-pointer comparison to merge into sorted order.`
      });

      let i = 0, j = 0, k = l;
      const buffer = [];

      while (i < left.length && j < right.length) {
        const valL = left[i];
        const valR = right[j];
        const isLeftSmaller = valL <= valR;

        // Step: Comparing Left[i] vs Right[j]
        steps.push({
          stepType: 'MERGE_COMPARE',
          log: `  Comparing left[${i}] (${valL}) vs right[${j}] (${valR}).`,
          codeLine: 11,
          array: [...arr],
          pointers: { i: l + i, j: m + 1 + j, k },
          highlightedIndices: [l + i, m + 1 + j],
          activeRange: { l, m, r },
          divideState: null,
          mergeState: {
            phase: 'compare',
            range: `[${l}...${r}]`,
            l, m, r,
            leftSub: [...left],
            rightSub: [...right],
            activeI: i,
            activeJ: j,
            targetK: k,
            compared: { leftVal: valL, rightVal: valR, winner: isLeftSmaller ? 'left' : 'right' },
            mergedBuffer: [...buffer],
      merged: [...buffer],
            isComplete: false
          },
          actionBanner: `⚖️ COMPARING: Left[${i}] (${valL}) vs Right[${j}] (${valR}) ➔ ${isLeftSmaller ? `${valL} ≤ ${valR} (Left smaller)` : `${valR} < ${valL} (Right smaller)`}`,
          description: `Evaluating which element comes next in sorted order.`
        });

        const chosenVal = isLeftSmaller ? valL : valR;
        buffer.push(chosenVal);
        arr[k] = chosenVal;

        // Step: Element placed into Merged Buffer
        steps.push({
          stepType: 'MERGE_PLACE',
          log: `  Placed ${chosenVal} into merged buffer at index ${k}.`,
          codeLine: isLeftSmaller ? 12 : 13,
          array: [...arr],
          pointers: { k },
          highlightedIndices: [k],
          activeRange: { l, m, r },
          divideState: null,
          mergeState: {
            phase: 'place',
            range: `[${l}...${r}]`,
            l, m, r,
            leftSub: [...left],
            rightSub: [...right],
            activeI: isLeftSmaller ? i + 1 : i,
            activeJ: isLeftSmaller ? j : j + 1,
            targetK: k + 1,
            compared: { leftVal: valL, rightVal: valR, winner: isLeftSmaller ? 'left' : 'right' },
            mergedBuffer: [...buffer],
      merged: [...buffer],
            isComplete: false
          },
          actionBanner: `⬇️ PLACED: Added ${chosenVal} to merged buffer for slot [${k}].`,
          description: `Element ${chosenVal} inserted into sorted buffer.`
        });

        if (isLeftSmaller) i++;
        else j++;
        k++;
      }

      // Flush remaining left elements
      while (i < left.length) {
        const val = left[i];
        buffer.push(val);
        arr[k] = val;
        steps.push({
          stepType: 'MERGE_FLUSH',
          log: `  Flushing remaining Left element (${val}) into index ${k}.`,
          codeLine: 14,
          array: [...arr],
          pointers: { i: l + i, k },
          highlightedIndices: [k],
          activeRange: { l, m, r },
          divideState: null,
          mergeState: {
            phase: 'flush',
            range: `[${l}...${r}]`,
            l, m, r,
            leftSub: [...left],
            rightSub: [...right],
            activeI: i + 1,
            activeJ: j,
            targetK: k + 1,
            compared: null,
            mergedBuffer: [...buffer],
      merged: [...buffer],
            isComplete: false
          },
          actionBanner: `➡️ FLUSHING: Right half exhausted; appending remaining Left (${val}) into slot [${k}].`,
          description: `Right half completed; copy remaining sorted left elements.`
        });
        i++;
        k++;
      }

      // Flush remaining right elements
      while (j < right.length) {
        const val = right[j];
        buffer.push(val);
        arr[k] = val;
        steps.push({
          stepType: 'MERGE_FLUSH',
          log: `  Flushing remaining Right element (${val}) into index ${k}.`,
          codeLine: 15,
          array: [...arr],
          pointers: { j: m + 1 + j, k },
          highlightedIndices: [k],
          activeRange: { l, m, r },
          divideState: null,
          mergeState: {
            phase: 'flush',
            range: `[${l}...${r}]`,
            l, m, r,
            leftSub: [...left],
            rightSub: [...right],
            activeI: i,
            activeJ: j + 1,
            targetK: k + 1,
            compared: null,
            mergedBuffer: [...buffer],
      merged: [...buffer],
            isComplete: false
          },
          actionBanner: `➡️ FLUSHING: Left half exhausted; appending remaining Right (${val}) into slot [${k}].`,
          description: `Left half completed; copy remaining sorted right elements.`
        });
        j++;
        k++;
      }

      // Range merge complete step
      steps.push({
        stepType: 'MERGE_DONE',
        log: `✅ Merged range [${l}...${r}] successfully: [${arr.slice(l, r + 1).join(', ')}].`,
        codeLine: 5,
        array: [...arr],
        pointers: {},
        sortedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        highlightedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        activeRange: { l, m, r },
        divideState: null,
        mergeState: {
          phase: 'done',
          range: `[${l}...${r}]`,
          l, m, r,
          leftSub: [...left],
          rightSub: [...right],
          activeI: left.length,
          activeJ: right.length,
          targetK: k,
          compared: null,
          mergedBuffer: [...buffer],
      merged: [...buffer],
          isComplete: true
        },
        actionBanner: `✨ MERGED: Range [${l}...${r}] sorted and written back to main array: [${arr.slice(l, r + 1).join(', ')}]!`,
        description: `Subarray [${l}...${r}] is now fully sorted in main array.`
      });
    }

    sort(0, n - 1);

    steps.push({
      stepType: 'COMPLETE',
      log: `🎉 Merge Sort complete! Final sorted array: [${arr.join(', ')}].`,
      codeLine: 6,
      array: [...arr],
      pointers: {},
      sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      activeRange: null,
      divideState: null,
      mergeState: null,
      actionBanner: '🎉 Merge Sort Complete! All subarrays combined in O(n log n) time.',
      description: 'The entire array is now completely sorted.'
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Trapping Rain Water Generator
  const generateTrappingRainWater = () => {
    const steps = [];
    const heights = [...array];
    const n = heights.length;
    let l = 0;
    let r = n - 1;
    let leftMax = 0;
    let rightMax = 0;
    let totalWater = 0;
    const waterArr = new Array(n).fill(0);

    steps.push({
      log: `> Trapping Rain Water started.`,
      codeLine: 1,
      array: [...heights],
      waterHeights: [...waterArr],
      waterStats: { leftMax: 0, rightMax: 0, totalWater: 0 },
      pointers: { left: l, right: r },
      actionBanner: `Pointers set: Left wall at [0] (h=${heights[0]}), Right wall at [${n - 1}] (h=${heights[n - 1]}).`,
      description: `Left and right boundary pointers start at opposite ends.`
    });

    while (l < r) {
      const hL = heights[l];
      const hR = heights[r];

      if (hL < hR) {
        if (hL >= leftMax) {
          leftMax = hL;
          steps.push({
            log: `  Left wall [${l}] >= leftMax. New leftMax = ${leftMax}.`,
            codeLine: 4,
            array: [...heights],
            waterHeights: [...waterArr],
            waterStats: { leftMax, rightMax, totalWater },
            pointers: { left: l, right: r },
            highlightedIndices: [l],
            actionBanner: `⛰️ Left Wall updated to ${leftMax} at index [${l}].`,
            description: `Left boundary peak increases.`
          });
        } else {
          const trapped = leftMax - hL;
          totalWater += trapped;
          waterArr[l] = trapped;

          steps.push({
            log: `💧 Column [${l}]: Trapped = ${leftMax} - ${hL} = ${trapped} units!`,
            codeLine: 5,
            array: [...heights],
            waterHeights: [...waterArr],
            waterStats: { leftMax, rightMax, totalWater },
            pointers: { left: l, right: r },
            highlightedIndices: [l],
            actionBanner: `💧 Column [${l}] trapped: min(leftMax=${leftMax}, rightMax=${rightMax}) - height=${hL} = ${trapped} units!`,
            description: `Trapped ${trapped} units of water at column ${l}.`
          });
        }
        l++;
      } else {
        if (hR >= rightMax) {
          rightMax = hR;
          steps.push({
            log: `  Right wall [${r}] >= rightMax. New rightMax = ${rightMax}.`,
            codeLine: 7,
            array: [...heights],
            waterHeights: [...waterArr],
            waterStats: { leftMax, rightMax, totalWater },
            pointers: { left: l, right: r },
            highlightedIndices: [r],
            actionBanner: `⛰️ Right Wall updated to ${rightMax} at index [${r}].`,
            description: `Right boundary peak increases.`
          });
        } else {
          const trapped = rightMax - hR;
          totalWater += trapped;
          waterArr[r] = trapped;

          steps.push({
            log: `💧 Column [${r}]: Trapped = ${rightMax} - ${hR} = ${trapped} units!`,
            codeLine: 8,
            array: [...heights],
            waterHeights: [...waterArr],
            waterStats: { leftMax, rightMax, totalWater },
            pointers: { left: l, right: r },
            highlightedIndices: [r],
            actionBanner: `💧 Column [${r}] trapped: min(leftMax=${leftMax}, rightMax=${rightMax}) - height=${hR} = ${trapped} units!`,
            description: `Trapped ${trapped} units of water at column ${r}.`
          });
        }
        r--;
      }
    }

    steps.push({
      log: `🎉 Complete! Total trapped water = ${totalWater} units.`,
      codeLine: 11,
      array: [...heights],
      waterHeights: [...waterArr],
      waterStats: { leftMax, rightMax, totalWater },
      pointers: {},
      actionBanner: `🌊 Trapping Complete! Total Water: ${totalWater} units.`,
      description: `Finished calculation.`
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Bubble Sort Generator
  const generateBubbleSort = () => {
    const steps = [];
    const arr = [...array];
    const n = arr.length;
    const sorted = new Set();

    steps.push({
      log: `> Bubble Sort started on n = ${n} elements.`,
      codeLine: 0,
      array: [...arr],
      pointers: { i: 0, j: 0 },
      actionBanner: 'Starting Pass i = 0. Comparing adjacent elements with pointer j.',
      description: `Bubble sort compares adjacent pairs [j] and [j+1].`
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const valJ = arr[j];
        const valJNext = arr[j + 1];
        const isBigger = valJ > valJNext;

        steps.push({
          log: `  Comparing arr[${j}] (${valJ}) and arr[${j + 1}] (${valJNext}).`,
          codeLine: 2,
          array: [...arr],
          pointers: { i, j, 'j+1': j + 1 },
          highlightedIndices: [j, j + 1],
          actionBanner: isBigger 
            ? `⚠️ arr[${j}] (${valJ}) > arr[${j + 1}] (${valJNext}) ➔ Out of order! Swapping.`
            : `✅ arr[${j}] (${valJ}) ≤ arr[${j + 1}] (${valJNext}) ➔ In correct relative order.`,
          description: isBigger ? `Swap elements into ascending order.` : `Elements are in correct relative order.`
        });

        if (isBigger) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          steps.push({
            log: `    Swapped: [${arr[j]}, ${arr[j + 1]}].`,
            codeLine: 3,
            array: [...arr],
            pointers: { i, j, 'j+1': j + 1 },
            swappingIndices: [j, j + 1],
            actionBanner: `🔄 Swapped: ${valJ} ⟷ ${valJNext}`,
            description: `Swapped elements at index ${j} and ${j + 1}.`
          });
        }
      }

      const sortedIdx = n - i - 1;
      sorted.add(sortedIdx);
      steps.push({
        log: `  Element ${arr[sortedIdx]} locked at sorted index [${sortedIdx}].`,
        codeLine: 6,
        array: [...arr],
        pointers: { i },
        sortedIndices: Array.from(sorted),
        actionBanner: `🔒 Max element (${arr[sortedIdx]}) locked at index [${sortedIdx}].`,
        description: `Pass i = ${i} complete.`
      });
    }

    steps.push({
      log: `> Bubble Sort complete!`,
      codeLine: 6,
      array: [...arr],
      pointers: {},
      sortedIndices: arr.map((_, idx) => idx),
      actionBanner: '🎉 Array is fully sorted!',
      description: `All passes finished.`
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Quick Sort Generator (Lomuto Partition)
  const generateQuickSort = () => {
    const steps = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
      log: `> Quick Sort started on n = ${n} elements.`,
      codeLine: 0,
      array: [...arr],
      actionBanner: '🚀 Quick Sort: Partitioning around pivot element.',
      description: 'Elements smaller than pivot move left; larger move right.'
    });

    function partition(low, high) {
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        log: `  Partitioning [${low}...${high}] with pivot = ${pivot} at index [${high}].`,
        codeLine: 8,
        array: [...arr],
        pointers: { pivot: high, i: Math.max(low, i), j: low },
        highlightedIndices: [high],
        actionBanner: `🎯 Pivot chosen: arr[${high}] = ${pivot}. Scanning elements with pointer j.`,
        description: `Elements < ${pivot} will be placed before index i.`
      });

      for (let j = low; j < high; j++) {
        const isSmaller = arr[j] < pivot;
        steps.push({
          log: `    Comparing arr[${j}] (${arr[j]}) < pivot (${pivot})? ${isSmaller}`,
          codeLine: 11,
          array: [...arr],
          pointers: { pivot: high, i: Math.max(0, i), j },
          highlightedIndices: [j, high],
          actionBanner: isSmaller 
            ? `✅ arr[${j}] (${arr[j]}) < pivot (${pivot}) ➔ Increment i & swap.`
            : `❌ arr[${j}] (${arr[j]}) ≥ pivot (${pivot}) ➔ Keep moving.`,
          description: `Evaluating element against pivot.`
        });

        if (isSmaller) {
          i++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            log: `    Swapped arr[${i}] and arr[${j}].`,
            codeLine: 13,
            array: [...arr],
            pointers: { pivot: high, i, j },
            swappingIndices: [i, j],
            actionBanner: `🔄 Swapped: ${arr[i]} ⟷ ${arr[j]} into smaller partition.`,
            description: `Shifted smaller element leftward.`
          });
        }
      }

      // Swap pivot into place
      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;

      steps.push({
        log: `  Pivot ${pivot} placed at final position index [${i + 1}].`,
        codeLine: 15,
        array: [...arr],
        pointers: { pivot: i + 1 },
        sortedIndices: [i + 1],
        swappingIndices: [i + 1, high],
        actionBanner: `🔒 Pivot ${pivot} locked at sorted index [${i + 1}]!`,
        description: `Pivot is now in its permanently sorted position.`
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

    qSort(0, n - 1);

    steps.push({
      log: `> Quick Sort complete!`,
      codeLine: 5,
      array: [...arr],
      pointers: {},
      sortedIndices: arr.map((_, idx) => idx),
      actionBanner: '🎉 Quick Sort Complete! Array fully sorted.',
      description: 'All partitions resolved.'
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Insertion Sort Generator
  const generateInsertionSort = () => {
    const steps = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
      log: `> Insertion Sort started.`,
      codeLine: 0,
      array: [...arr],
      pointers: { i: 1 },
      actionBanner: '🚀 Insertion Sort: Incrementally building sorted prefix.',
      description: 'Extracting key element and shifting larger elements to the right.'
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        log: `  Picking key = arr[${i}] (${key}).`,
        codeLine: 2,
        array: [...arr],
        pointers: { key: i, j },
        highlightedIndices: [i],
        actionBanner: `🔑 Selected Key = ${key} at index [${i}]. Shifting elements > ${key} right.`,
        description: `Comparing key with sorted prefix.`
      });

      while (j >= 0 && arr[j] > key) {
        steps.push({
          log: `    arr[${j}] (${arr[j]}) > key (${key}) ➔ Shifting arr[${j}] to index [${j + 1}].`,
          codeLine: 5,
          array: [...arr],
          pointers: { key: i, j },
          highlightedIndices: [j, j + 1],
          actionBanner: `➡️ Shifting ${arr[j]} from [${j}] ➔ [${j + 1}].`,
          description: `Creating slot for key.`
        });

        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = key;

      steps.push({
        log: `  Inserted key ${key} at index [${j + 1}].`,
        codeLine: 8,
        array: [...arr],
        pointers: { inserted: j + 1 },
        sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
        actionBanner: `✅ Inserted key ${key} into sorted position [${j + 1}].`,
        description: `Prefix [0...${i}] is now sorted.`
      });
    }

    steps.push({
      log: `> Insertion Sort complete!`,
      codeLine: 9,
      array: [...arr],
      pointers: {},
      sortedIndices: arr.map((_, idx) => idx),
      actionBanner: '🎉 Insertion Sort Complete!',
      description: 'Array fully sorted.'
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Binary Search Generator
  const generateBinarySearch = () => {
    const steps = [];
    const arr = [...array].sort((a, b) => a - b);
    const target = parseInt(searchTarget, 10) || 77;
    let low = 0;
    let high = arr.length - 1;

    steps.push({
      log: `> Binary Search for target = ${target}.`,
      codeLine: 1,
      array: [...arr],
      pointers: { low, high },
      highlightedIndices: [low, high],
      actionBanner: `Search space: low = 0, high = ${high}. Target = ${target}.`,
      description: `Binary search divides search space by half.`
    });

    let found = false;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midVal = arr[mid];

      steps.push({
        log: `  Midpoint index [${mid}] = ${midVal}.`,
        codeLine: 3,
        array: [...arr],
        pointers: { low, mid, high },
        highlightedIndices: [mid],
        actionBanner: `🔍 Checking Midpoint index [${mid}] = ${midVal} vs Target ${target}.`,
        description: `Examining mid element arr[${mid}] = ${midVal}.`
      });

      if (midVal === target) {
        found = true;
        steps.push({
          log: `🎯 Target ${target} found at index [${mid}]!`,
          codeLine: 4,
          array: [...arr],
          pointers: { mid },
          sortedIndices: [mid],
          actionBanner: `🎯 Found target ${target} at index [${mid}]!`,
          description: `Target located in O(log n) time.`
        });
        break;
      } else if (midVal < target) {
        steps.push({
          log: `  ${midVal} < ${target} ➔ Discarding left half [${low} ... ${mid}].`,
          codeLine: 5,
          array: [...arr],
          pointers: { low: mid + 1, high },
          eliminatedRange: { start: 0, end: mid },
          actionBanner: `➡️ ${midVal} < ${target} ➔ Shifting low to ${mid + 1}.`,
          description: `Target is larger than mid.`
        });
        low = mid + 1;
      } else {
        steps.push({
          log: `  ${midVal} > ${target} ➔ Discarding right half [${mid} ... ${high}].`,
          codeLine: 6,
          array: [...arr],
          pointers: { low, high: mid - 1 },
          eliminatedRange: { start: mid, end: arr.length - 1 },
          actionBanner: `⬅️ ${midVal} > ${target} ➔ Shifting high to ${mid - 1}.`,
          description: `Target is smaller than mid.`
        });
        high = mid - 1;
      }
    }

    if (!found) {
      steps.push({
        log: `❌ Target ${target} not found.`,
        codeLine: 8,
        array: [...arr],
        pointers: {},
        actionBanner: `❌ Target ${target} not found in array.`,
        description: `Search space exhausted.`
      });
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Two Sum Two-Pointer Generator
  const generateTwoSum = () => {
    const steps = [];
    const arr = [...array].sort((a, b) => a - b);
    const target = parseInt(targetSum, 10) || 83;
    let l = 0, r = arr.length - 1;

    steps.push({
      log: `> Two-Pointer Two-Sum started. Target = ${target}.`,
      codeLine: 1,
      array: [...arr],
      pointers: { left: l, right: r },
      highlightedIndices: [l, r],
      actionBanner: `Dual pointers initialized: left = [0], right = [${r}]. Target Sum = ${target}.`,
      description: 'Converging inwards from both ends.'
    });

    let found = false;
    while (l < r) {
      const curSum = arr[l] + arr[r];
      steps.push({
        log: `  arr[${l}] (${arr[l]}) + arr[${r}] (${arr[r]}) = ${curSum}.`,
        codeLine: 3,
        array: [...arr],
        pointers: { left: l, right: r },
        highlightedIndices: [l, r],
        actionBanner: `Current Sum: ${arr[l]} + ${arr[r]} = ${curSum} (Target: ${target}).`,
        description: `Checking pair sum.`
      });

      if (curSum === target) {
        found = true;
        steps.push({
          log: `🎯 Pair found! indices [${l}, ${r}] sum to ${target}.`,
          codeLine: 4,
          array: [...arr],
          pointers: { left: l, right: r },
          sortedIndices: [l, r],
          actionBanner: `🎯 Solution Pair Found: arr[${l}] (${arr[l]}) + arr[${r}] (${arr[r]}) = ${target}!`,
          description: `Target sum satisfied in O(n) time.`
        });
        break;
      } else if (curSum < target) {
        steps.push({
          log: `  Sum ${curSum} < ${target} ➔ Advancing left pointer.`,
          codeLine: 5,
          array: [...arr],
          pointers: { left: l + 1, right: r },
          actionBanner: `⬆️ Sum too small: Moving left pointer to [${l + 1}].`,
          description: `Increasing sum.`
        });
        l++;
      } else {
        steps.push({
          log: `  Sum ${curSum} > ${target} ➔ Decrementing right pointer.`,
          codeLine: 6,
          array: [...arr],
          pointers: { left: l, right: r - 1 },
          actionBanner: `⬇️ Sum too large: Moving right pointer to [${r - 1}].`,
          description: `Decreasing sum.`
        });
        r--;
      }
    }

    if (!found) {
      steps.push({
        log: `❌ No two numbers sum to ${target}.`,
        codeLine: 8,
        array: [...arr],
        pointers: {},
        actionBanner: `❌ No valid two-sum pair exists for target ${target}.`,
        description: `Search completed.`
      });
    }

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Dutch National Flag Generator
  const generateDutchFlag = () => {
    const steps = [];
    const arr = [...array];
    let low = 0, mid = 0, high = arr.length - 1;

    steps.push({
      log: `> Dutch National Flag (3-way partition) started.`,
      codeLine: 1,
      array: [...arr],
      pointers: { low, mid, high },
      actionBanner: '🚀 Dijkstra 3-way partition: Sorting 0s, 1s, and 2s.',
      description: 'Using low, mid, and high pointers.'
    });

    while (mid <= high) {
      const val = arr[mid];
      if (val === 0) {
        steps.push({
          log: `  arr[${mid}] is 0 ➔ Swapping with arr[${low}].`,
          codeLine: 3,
          array: [...arr],
          pointers: { low, mid, high },
          swappingIndices: [low, mid],
          actionBanner: `🔴 Element 0 found: Swap arr[${mid}] with arr[${low}]. Advance low & mid.`,
          description: `Placing 0 in left segment.`
        });
        const temp = arr[low];
        arr[low] = arr[mid];
        arr[mid] = temp;
        low++;
        mid++;
      } else if (val === 1) {
        steps.push({
          log: `  arr[${mid}] is 1 ➔ In place, advancing mid.`,
          codeLine: 6,
          array: [...arr],
          pointers: { low, mid, high },
          highlightedIndices: [mid],
          actionBanner: `⚪ Element 1 found: Already in middle segment. Advance mid to [${mid + 1}].`,
          description: `Leaving 1 in middle.`
        });
        mid++;
      } else {
        steps.push({
          log: `  arr[${mid}] is 2 ➔ Swapping with arr[${high}].`,
          codeLine: 8,
          array: [...arr],
          pointers: { low, mid, high },
          swappingIndices: [mid, high],
          actionBanner: `🔵 Element 2 found: Swap arr[${mid}] with arr[${high}]. Decrement high.`,
          description: `Placing 2 in right segment.`
        });
        const temp = arr[mid];
        arr[mid] = arr[high];
        arr[high] = temp;
        high--;
      }
    }

    steps.push({
      log: `> Dutch National Flag partitioning complete!`,
      codeLine: 11,
      array: [...arr],
      pointers: {},
      sortedIndices: arr.map((_, idx) => idx),
      actionBanner: '🎉 3-Way Partition Complete! 0s, 1s, and 2s segregated.',
      description: 'Finished in single pass O(n).'
    });

    setAnimationSteps(steps);
    setCurrentStepIndex(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Universal Dispatcher
  const handleExecute = () => {
    handleReset();
    if (isTrappingRain) generateTrappingRainWater();
    else if (isMergeSort) generateMergeSort();
    else if (currentAlgo.id === 'quicksort') generateQuickSort();
    else if (currentAlgo.id === 'insertionsort') generateInsertionSort();
    else if (currentAlgo.id === 'binary_search') generateBinarySearch();
    else if (currentAlgo.id === 'two_sum') generateTwoSum();
    else if (currentAlgo.id === 'dutch_flag') generateDutchFlag();
    else generateBubbleSort();
  };

  const currentCode = CODE_SNIPPETS[currentAlgo.codeId] || CODE_SNIPPETS.mergesort || CODE_SNIPPETS.bubblesort;
  const maxSortingVal = Math.max(...array.map(v => Math.abs(v)), 10);
  const compactUnitPx = 20; 
  const maxRainVal = Math.max(...array, 3);
  const rainTicks = Array.from({ length: maxRainVal + 2 }, (_, i) => i);


  // Extract active step for Dry Run Variable Tracker
  const currentStepData = animationSteps[currentStepIndex] || {};

  const trackedVariables = useMemo(() => {
    const vars = [];
    const s = currentStepData;
    const ptrs = s.pointers || pointers || {};
    const rng = s.activeRange || activeRange || {};

    // 1. Pointers
    if (ptrs.i !== undefined) {
      vars.push({
        name: 'i',
        value: ptrs.i >= 0 && ptrs.i < array.length ? `${ptrs.i} (val: ${array[ptrs.i]})` : ptrs.i,
        type: 'Pointer',
        role: 'Outer loop index / Left scanner',
        isChanged: true
      });
    }
    if (ptrs.j !== undefined) {
      vars.push({
        name: 'j',
        value: ptrs.j >= 0 && ptrs.j < array.length ? `${ptrs.j} (val: ${array[ptrs.j]})` : ptrs.j,
        type: 'Pointer',
        role: 'Inner loop index / Right scanner',
        isChanged: true
      });
    }
    if (ptrs.mid !== undefined) {
      vars.push({
        name: 'mid',
        value: ptrs.mid >= 0 && ptrs.mid < array.length ? `${ptrs.mid} (val: ${array[ptrs.mid]})` : ptrs.mid,
        type: 'Index',
        role: 'Middle pivot / split index',
        isChanged: true
      });
    }
    if (ptrs.low !== undefined) {
      vars.push({
        name: 'low',
        value: ptrs.low >= 0 && ptrs.low < array.length ? `${ptrs.low} (val: ${array[ptrs.low]})` : ptrs.low,
        type: 'Boundary',
        role: 'Search window lower bound'
      });
    }
    if (ptrs.high !== undefined) {
      vars.push({
        name: 'high',
        value: ptrs.high >= 0 && ptrs.high < array.length ? `${ptrs.high} (val: ${array[ptrs.high]})` : ptrs.high,
        type: 'Boundary',
        role: 'Search window upper bound'
      });
    }

    // 2. Active Range
    if (rng.l !== undefined && ptrs.i === undefined) {
      vars.push({
        name: 'left',
        value: rng.l,
        type: 'Range',
        role: 'Subarray left boundary'
      });
    }
    if (rng.r !== undefined && ptrs.j === undefined) {
      vars.push({
        name: 'right',
        value: rng.r,
        type: 'Range',
        role: 'Subarray right boundary'
      });
    }

    // 3. Highlighted / Swapping elements
    if (s.swappingIndices && s.swappingIndices.length > 0) {
      vars.push({
        name: 'swapping',
        value: `Indices [${s.swappingIndices.join(', ')}]`,
        type: 'Action',
        role: 'Elements being exchanged in-place',
        isChanged: true
      });
    }

    // 4. Target search value
    if (searchTarget !== undefined) {
      vars.push({
        name: 'target',
        value: searchTarget,
        type: 'Target',
        role: 'Goal search value'
      });
    }

    // 5. Array size
    vars.push({
      name: 'n',
      value: array.length,
      type: 'Size',
      role: 'Total elements in array'
    });

    return vars;
  }, [currentStepData, pointers, activeRange, array, searchTarget]);

  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      subtitle={currentAlgo.desc}
      currentPath={`/visualizer/array/${currentAlgo.id}`}
      category="ds"
      bannerAction={
        <div className="flex items-center gap-2">
          <Link
            to="/visualizer/array"
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#AB526B] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Array Suite</span>
          </Link>
          <ComplexityBadge complexity={currentAlgo.complexity} />
        </div>
      }
      controls={
        <div className="flex flex-col gap-3">
          
          {/* Algorithm Selector Switcher */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Select Algorithm Model
            </label>
            <div className="relative">
              <select
                value={currentAlgo.id}
                onChange={(e) => navigate(`/visualizer/array/${e.target.value}`)}
                className="w-full bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#5C4E49] rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-100 appearance-none cursor-pointer pr-8 focus:outline-hidden focus:ring-2 focus:ring-[#AB526B]"
              >
                {ARRAY_CATALOG.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.tag})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Contextual Config Controls */}
          {currentAlgo.id === 'binary_search' && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#2A2A2A]">
              <Target size={14} className="text-[#AB526B] shrink-0" />
              <input
                type="number"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                placeholder="Search Target"
                className="w-full bg-transparent text-xs font-mono font-bold focus:outline-hidden"
              />
            </div>
          )}

          {currentAlgo.id === 'two_sum' && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-[#1C1C1C] border border-gray-200 dark:border-[#2A2A2A]">
              <Target size={14} className="text-[#AB526B] shrink-0" />
              <input
                type="number"
                value={targetSum}
                onChange={(e) => setTargetSum(e.target.value)}
                placeholder="Target Sum"
                className="w-full bg-transparent text-xs font-mono font-bold focus:outline-hidden"
              />
            </div>
          )}

          {/* Trapping Rain Water: Goal Index Inspector Input */}
          {isTrappingRain && (
            <div className="p-3 bg-blue-50/70 dark:bg-[#15202B] rounded-xl border border-blue-200 dark:border-blue-900/60 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 dark:text-blue-300">
                <span className="flex items-center gap-1.5">
                  <Compass size={13} className="text-blue-600" />
                  <span>Inspect Column (Goal Index)</span>
                </span>
                <span className="font-mono text-blue-600 bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.2 rounded">
                  Index [{goalIndex}]
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={array.length - 1}
                  value={goalIndex}
                  onChange={(e) => setGoalIndex(parseInt(e.target.value, 10))}
                  className="flex-1 accent-blue-600 h-1.5 cursor-pointer bg-blue-200 dark:bg-blue-950 rounded-lg"
                />
                <span className="text-xs font-mono font-bold w-5 text-center text-blue-800 dark:text-blue-300">
                  {goalIndex}
                </span>
              </div>
            </div>
          )}

          {/* Action Triggers */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleExecute}
              className="flex-1 py-2.5 bg-[#AB526B] hover:bg-[#a63d46] active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Play size={14} className="fill-white" />
              <span>Simulate {currentAlgo.name}</span>
            </button>
            <button
              onClick={() => {
                const shuffled = [...array].sort(() => Math.random() - 0.5);
                setArray(shuffled);
                handleReset();
              }}
              title="Randomize Elements"
              className="p-2.5 bg-gray-100 dark:bg-[#202020] border border-gray-200 dark:border-[#5C4E49] rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors shrink-0"
            >
              <RefreshCw size={14} />
            </button>
          </div>

        </div>
      }
      playbackBar={
        <VisualizerPlaybackBar
          currentStep={currentStepIndex}
          totalSteps={animationSteps.length}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onReset={handleReset}
          onStepForward={() => {
            if (currentStepIndex < animationSteps.length - 1) {
              applyStep(currentStepIndex + 1);
            }
          }}
          onStepBackward={() => {
            if (currentStepIndex > 0) {
              applyStep(currentStepIndex - 1);
            }
          }}
          speed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
          stepDescription={currentStepData.actionBanner || currentStepData.description || ''}
        />
      }
      codeInspector={
        <CodeInspector
          codeSnippets={currentCode}
          activeLine={activeCodeLine}
        />
      }
      rightPanel={
        <div className="flex flex-col gap-3">
          <DryRunVariableTracker
            title={`${currentAlgo.title || currentAlgo.name || 'Array'} — Dry Run`}
            stepNumber={currentStepIndex + 1}
            totalSteps={Math.max(1, animationSteps.length)}
            actionBadge={(() => {
              const st = currentStepData.stepType || 'STEP';
              return { label: st, icon: '⚡', bg: 'bg-cyan-500/20 border-cyan-400 text-cyan-300' };
            })()}
            codeStatement={(() => {
              const snippets = currentCode?.javascript || [];
              return snippets[activeCodeLine] || '';
            })()}
            explanation={currentStepData.description || currentStepData.actionBanner || currentStepData.log || 'Executing array algorithm step.'}
            variables={trackedVariables}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
          />
        </div>
      }
      consoleLogs={consoleLogs}
    >
      {/* Visual Canvas Area - UNOBSTRUCTED HERO CANVAS AT TOP */}
      <div className="relative w-full h-full flex flex-col items-center justify-start p-3 sm:p-5 overflow-y-auto gap-4">
        
        {/* 1. Dynamic Action Banner (Crisp 1-line HUD) */}
        <div className="w-full flex flex-col gap-2 max-w-3xl">
          <AnimatePresence mode="wait">
            {actionBanner ? (
              <motion.div
                key={actionBanner}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="px-4 py-2 rounded-xl bg-[#F4E9D4] dark:bg-[#251E1C] border border-[#E4D1BC] dark:border-[#3D2C28] text-[#8B2635] dark:text-[#E27D89] text-xs font-bold shadow-xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <Sparkles size={14} className="shrink-0 text-[#AB526B]" />
                  <span className="truncate">{actionBanner}</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#AB526B]/10 dark:bg-[#AB526B]/20 shrink-0">
                  Step {currentStepIndex + 1}/{Math.max(1, animationSteps.length)}
                </span>
              </motion.div>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] text-gray-500 text-xs flex items-center gap-2">
                <Sparkles size={14} className="text-gray-400" />
                <span>Press <strong>Simulate {currentAlgo.name}</strong> to begin step-by-step execution.</span>
              </div>
            )}
          </AnimatePresence>

          {/* TRAPPING RAIN WATER EXCLUSIVE FORMULA CALLOUT */}
          {isTrappingRain && goalCalculation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2.5 bg-blue-50/80 dark:bg-[#111A24] rounded-xl border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2 text-[11px] text-gray-700 dark:text-gray-200">
                <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded font-mono font-bold text-[10px]">
                  Col [{goalCalculation.index}]
                </span>
                <span>Terrain = {goalCalculation.colHeight}</span>
                <span>• LeftWall = {goalCalculation.leftMax}</span>
                <span>• RightWall = {goalCalculation.rightMax}</span>
              </div>

              <div className="px-2 py-1 bg-white dark:bg-[#1E1E1E] rounded-md border border-blue-100 dark:border-blue-900 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px] shrink-0">
                Water = min({goalCalculation.leftMax}, {goalCalculation.rightMax}) - {goalCalculation.colHeight} = <strong>+{goalCalculation.trappedAtCol} 💧</strong>
              </div>
            </motion.div>
          )}
        </div>

        {/* ======================================================== */}
        {/* CASE A: DEDICATED MERGE SORT DIVIDE & CONQUER ARENA      */}
        {/* ======================================================== */}
        {isMergeSort ? (
          <div className="w-full max-w-3xl bg-white dark:bg-[#423834] rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] p-4 sm:p-5 shadow-sm flex flex-col gap-4">
            
            {/* 1. Global Array State with Active Range Frame */}
            <div className="flex flex-col gap-1.5 pb-3 border-b border-gray-100 dark:border-[#222]">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={13} className="text-[#AB526B]" />
                  <span>Main Array State [0...{array.length - 1}]</span>
                </span>
                <span className="font-mono text-[#AB526B] bg-[#AB526B]/10 dark:bg-[#AB526B]/20 px-2 py-0.5 rounded-full text-[10px]">
                  {activeRange ? `Active Range: [${activeRange.l}...${activeRange.r}]` : 'Divide & Conquer Root'}
                </span>
              </div>

              <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-2">
                {array.map((val, idx) => {
                  const inRange = activeRange ? (idx >= activeRange.l && idx <= activeRange.r) : true;
                  const isMid = activeRange && idx === activeRange.m;
                  const isLeft = activeRange && idx >= activeRange.l && idx <= activeRange.m;
                  const isRight = activeRange && idx > activeRange.m && idx <= activeRange.r;
                  const isSorted = sortedIndices.has(idx);

                  return (
                    <motion.div
                      key={`ms-global-${idx}`}
                      className={`relative flex flex-col items-center justify-end rounded-xl p-2 transition-all flex-1 max-w-[52px] min-w-[34px] ${
                        !inRange 
                          ? 'opacity-30 grayscale' 
                          : isSorted
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-700'
                          : isLeft
                          ? 'bg-cyan-50 dark:bg-cyan-950/40 border-2 border-cyan-400'
                          : isRight
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-400'
                          : 'bg-gray-50 dark:bg-[#1E1E1E] border border-gray-300 dark:border-[#5C4E49]'
                      }`}
                    >
                      {/* Pointer Tag */}
                      <div className="absolute -top-5 text-[9px] font-mono font-black uppercase text-[#AB526B]">
                        {activeRange?.l === idx && 'L'}
                        {activeRange?.m === idx && ' M'}
                        {activeRange?.r === idx && ' R'}
                      </div>

                      <span className={`font-mono font-bold text-sm ${isSorted ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-gray-900 dark:text-gray-100'}`}>
                        {val}
                      </span>
                      <span className="text-[9px] font-mono text-gray-400">[{idx}]</span>
                      {isSorted && (
                        <span className="absolute -top-2 -right-1 text-[10px]">✓</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 2. Divide Tree Level Visualizer */}
            {activeDivideState ? (
              (() => {
                const leftArr = activeDivideState.left || activeDivideState.leftPart || (activeDivideState.val !== undefined ? [activeDivideState.val] : []);
                const rightArr = activeDivideState.right || activeDivideState.rightPart || [];
                const isBase = activeDivideState.val !== undefined && rightArr.length === 0;

                return (
                  <div className="flex flex-col items-center gap-3 p-3 rounded-xl bg-[#FDFBF7] dark:bg-[#423834] border border-dashed border-[#E4D1BC] dark:border-[#5C4E49]">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <span className={`w-2 h-2 rounded-full ${isBase ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
                      <span>{isBase ? 'Phase: BASE CASE SUBARRAY' : 'Phase: DIVIDING SUBARRAYS'}</span>
                      {activeDivideState.range && (
                        <span className="text-[10px] font-mono text-gray-400">
                          Range: {activeDivideState.range}
                        </span>
                      )}
                    </div>

                    {isBase ? (
                      <div className="flex items-center justify-center p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          ✓ Base Element: [{activeDivideState.val}] at index [{activeDivideState.l}] (Size 1 — Inherently Sorted)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-6 sm:gap-8 w-full pt-1">
                        {/* Left Half Box */}
                        <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-800">
                          <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300">
                            Left: [{leftArr.join(', ')}]
                          </span>
                        </div>

                        <span className="text-gray-400 font-mono text-xs">➔ SPLIT ➔</span>

                        {/* Right Half Box */}
                        <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800">
                          <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300">
                            Right: [{rightArr.join(', ')}]
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : activeMergeState ? (
              (() => {
                const leftSub = activeMergeState.leftSub || [];
                const rightSub = activeMergeState.rightSub || [];
                const mergedArr = activeMergeState.merged || activeMergeState.mergedBuffer || [];

                return (
                  /* 3. Conquering / Merging Active Buffers Comparison Desk */
                  <div className="flex flex-col gap-3 p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <ArrowRight size={13} className="text-amber-600" />
                        <span>Phase: TWO-POINTER MERGE CONQUER</span>
                      </span>
                      <span className="text-[10px] font-mono">
                        Comparing pointers: p1 vs p2
                      </span>
                    </div>

                    {/* Auxiliary Buffers Display */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Left Subarray with pointer */}
                      <div className="flex flex-col gap-1 p-2 rounded-lg bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#5C4E49]">
                        <span className="text-[10px] font-mono text-gray-400 font-bold">Left Buffer</span>
                        <div className="flex items-center gap-1 overflow-x-auto">
                          {leftSub.map((v, i) => (
                            <span
                              key={`ms-lsub-${i}`}
                              className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                                activeMergeState.p1 === i || activeMergeState.activeI === i
                                  ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                                  : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Subarray with pointer */}
                      <div className="flex flex-col gap-1 p-2 rounded-lg bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#5C4E49]">
                        <span className="text-[10px] font-mono text-gray-400 font-bold">Right Buffer</span>
                        <div className="flex items-center gap-1 overflow-x-auto">
                          {rightSub.map((v, i) => (
                            <span
                              key={`ms-rsub-${i}`}
                              className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                                activeMergeState.p2 === i || activeMergeState.activeJ === i
                                  ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                                  : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Merge Destination Result Buffer */}
                    <div className="flex flex-col gap-1 p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                        Merged Result Buffer:
                      </span>
                      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                        {mergedArr.length > 0 ? (
                          mergedArr.map((mv, mi) => (
                            <span
                              key={`ms-merged-${mi}`}
                              className="px-2 py-0.5 rounded bg-emerald-500 text-white font-mono text-xs font-bold shadow-2xs"
                            >
                              {mv}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-mono text-gray-400 italic">Empty</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* --- BASE CASE ANIMATION VIEW --- */
              <div className="p-3 text-center text-xs font-mono text-gray-400 border border-dashed border-gray-200 dark:border-[#5C4E49] rounded-xl">
                Merge sort divide & conquer ready. Press Simulate to observe split and two-way merge.
              </div>
            )}

            {/* Merge Sort Legend */}
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono pt-1 text-gray-500">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400" />
                <span>Left Branch</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-purple-400" />
                <span>Right Branch</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                <span>Comparing Pointers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <span>Merged & Sorted</span>
              </div>
            </div>

          </div>
        ) : isTrappingRain ? (
          /* ======================================================== */
          /* CASE B: TRAPPING RAIN WATER COMPACT 2D HISTOGRAM         */
          /* ======================================================== */
          <div className="w-full max-w-3xl bg-white dark:bg-[#423834] rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] p-4 sm:p-5 shadow-sm overflow-x-auto">
            
            <div className="relative flex items-end min-h-[160px] pl-7 pb-6 min-w-[380px]">
              
              {/* Y-Axis Arrow */}
              <div className="absolute left-5 top-0 bottom-6 flex flex-col items-center pointer-events-none">
                <div className="w-0 h-0 border-x-3 border-x-transparent border-b-6 border-b-gray-900 dark:border-b-gray-100" />
                <div className="w-0.5 flex-1 bg-gray-900 dark:bg-gray-100" />
              </div>

              {/* Y-Axis Ticks */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col-reverse justify-between pointer-events-none text-[10px] font-mono font-bold text-gray-400 pr-1">
                {rainTicks.map((tick) => (
                  <div 
                    key={`tick-${tick}`}
                    className="relative flex items-center justify-end h-0"
                    style={{ bottom: `${tick * compactUnitPx}px` }}
                  >
                    <span className="mr-2">{tick}</span>
                    <div className="w-1 h-0.5 bg-gray-400" />
                  </div>
                ))}
              </div>

              {/* X-Axis Baseline */}
              <div className="absolute left-5 right-0 bottom-6 h-0.5 bg-gray-900 dark:bg-gray-100 pointer-events-none" />

              {/* Contiguous Black Bars + Blue Water Blocks (Compact & Neat) */}
              <div className="flex items-end gap-1 w-full justify-start pl-1 z-10">
                {array.map((val, idx) => {
                  const trapped = trappedWaterHeights[idx] || computeGoalIndexBreakdown(idx)?.trappedAtCol || 0;
                  const isGoal = idx === goalIndex;

                  const matchingPointers = Object.entries(pointers)
                    .filter(([_, pos]) => pos === idx)
                    .map(([p]) => p.toUpperCase());

                  return (
                    <div 
                      key={`rain-col-${idx}`} 
                      className="relative flex flex-col items-center justify-end flex-1 max-w-[42px] min-w-[26px] group cursor-pointer"
                      onClick={() => setGoalIndex(idx)}
                    >
                      {/* Active Pointers Floating Tag (Left / Right) */}
                      <div className="absolute -top-7 flex flex-col items-center pointer-events-none z-20">
                        {matchingPointers.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white text-[9px] font-mono font-black uppercase shadow-xs">
                            {matchingPointers.join(',')}
                          </span>
                        )}
                        {isGoal && (
                          <span className="px-1 py-0.2 rounded bg-blue-600 text-white text-[8px] font-mono font-bold uppercase shadow-xs">
                            INSPECT
                          </span>
                        )}
                      </div>

                      {/* Stacked Tower: Water (Top) + Solid Terrain Bar (Bottom) */}
                      <div className={`w-full flex flex-col items-center justify-end rounded-t-sm transition-all duration-200 ${
                        isGoal ? 'ring-2 ring-blue-500 shadow-md' : ''
                      }`}>
                        {/* Trapped Water Block */}
                        {trapped > 0 && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${trapped * compactUnitPx}px` }}
                            transition={{ duration: 0.25 }}
                            className="w-full bg-blue-500/80 dark:bg-blue-600/80 border-t border-blue-400 flex items-center justify-center text-[10px] font-mono font-black text-white"
                          >
                            {trapped > 0.5 ? `+${trapped}` : ''}
                          </motion.div>
                        )}

                        {/* Solid Elevation Terrain Bar (Dark Obsidian / Slate) */}
                        <div
                          className="w-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center text-[11px] font-mono font-bold text-white dark:text-gray-900 rounded-t-xs"
                          style={{ height: `${Math.max(val * compactUnitPx, 4)}px` }}
                        >
                          {val > 0 && val}
                        </div>
                      </div>

                      {/* Index Label */}
                      <div className="absolute -bottom-5 text-center">
                        <span className={`text-[9px] font-mono ${isGoal ? 'font-black text-blue-600 dark:text-blue-400 underline' : 'text-gray-400'}`}>
                          [{idx}]
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Trapping Rain Water Real-Time Running Total Banner */}
            <div className="mt-5 pt-3 border-t border-gray-100 dark:border-[#222] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3 text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-gray-900 dark:bg-gray-100 rounded-xs" />
                  <span>Terrain</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-xs" />
                  <span>Trapped Water</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
                <span>Total Accumulated:</span>
                <span className="text-sm font-black">{trappingWaterStats.totalTrapped} Units 💧</span>
              </div>
            </div>

          </div>
        ) : (
          /* ======================================================== */
          /* CASE C: SORTING, SEARCHING & ARRAY LOGIC (UNOBSTRUCTED)  */
          /* ======================================================== */
          <div className="w-full max-w-3xl bg-white dark:bg-[#423834] rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] p-5 shadow-sm flex flex-col items-center">
            
            {/* 1. INSTANT INTUITION FLOATING COMPARISON / CONDITION BRIDGE */}
            {(() => {
              // Check if currently swapping or comparing 2 elements
              const activePair = swappingIndices.length >= 2 
                ? swappingIndices 
                : highlightedIndices.length >= 2 
                ? highlightedIndices 
                : [];
              
              if (activePair.length >= 2) {
                const idxA = Math.min(activePair[0], activePair[1]);
                const idxB = Math.max(activePair[0], activePair[1]);
                const valA = array[idxA];
                const valB = array[idxB];
                const isSwappingNow = swappingIndices.includes(idxA) && swappingIndices.includes(idxB);
                const needsSwap = valA > valB; // Ascending sort condition

                return (
                  <motion.div
                    key={`compare-bridge-${idxA}-${idxB}`}
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`mb-5 px-4 py-2 rounded-xl text-xs font-mono font-bold flex flex-wrap items-center justify-center gap-3 shadow-sm border ${
                      isSwappingNow
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                        : needsSwap
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    }`}
                  >
                    <span className="px-2.5 py-1 rounded-md bg-white dark:bg-black/50 border border-current font-black">
                      [{idxA}] = {valA}
                    </span>
                    <span className="text-sm font-black">
                      {valA === valB ? '==' : needsSwap ? '>' : '<='}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white dark:bg-black/50 border border-current font-black">
                      [{idxB}] = {valB}
                    </span>
                    <span className="text-gray-400">➔</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider text-white shadow-xs ${
                      isSwappingNow 
                        ? 'bg-rose-600 animate-pulse' 
                        : needsSwap 
                        ? 'bg-amber-600' 
                        : 'bg-emerald-600'
                    }`}>
                      {isSwappingNow 
                        ? '🔄 SWAPPING NOW' 
                        : needsSwap 
                        ? '⚠️ SWAP: Out of Order (A > B)' 
                        : '✓ OK: In Correct Order'}
                    </span>
                  </motion.div>
                );
              }

              // Check if Binary Search is active
              if (currentAlgo.id === 'binary-search' || pointers.mid !== undefined) {
                const target = searchTarget !== undefined ? searchTarget : targetSum;
                const midIdx = pointers.mid;
                const midVal = midIdx !== undefined ? array[midIdx] : undefined;
                const isFound = midVal == target;

                return (
                  <motion.div
                    key={`bs-hud-${midIdx}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 flex flex-wrap items-center justify-center gap-2.5"
                  >
                    <div className="px-3.5 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-800 text-cyan-800 dark:text-cyan-200 font-mono text-xs font-bold flex items-center gap-2 shadow-xs">
                      <span>🎯 Target to Find:</span>
                      <span className="text-sm font-black underline decoration-cyan-500">{target}</span>
                    </div>

                    {midIdx !== undefined && (
                      <div className={`px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-2 shadow-xs ${
                        isFound
                          ? 'bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-300 animate-bounce'
                          : midVal > target
                          ? 'bg-amber-500 text-white border-amber-400'
                          : 'bg-indigo-500 text-white border-indigo-400'
                      }`}>
                        <span>MID [{midIdx}] = {midVal}</span>
                        <span>➔</span>
                        <span className="font-black uppercase tracking-wide">
                          {isFound
                            ? '🎉 MATCH FOUND!'
                            : midVal > target
                            ? `${midVal} > ${target} ➔ Discard Right Half`
                            : `${midVal} < ${target} ➔ Discard Left Half`}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              }

              // Check if Quick Sort Pivot is active
              if (pointers.pivot !== undefined) {
                const pVal = array[pointers.pivot];
                return (
                  <div className="mb-4 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 font-mono text-xs font-bold flex items-center gap-2">
                    <span>👑 PIVOT ELEMENT:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-black">
                      [{pointers.pivot}] = {pVal}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      (Partitioning: elements &lt; {pVal} on left, &gt; {pVal} on right)
                    </span>
                  </div>
                );
              }

              return null;
            })()}

            {/* 2. MAIN ARRAY BARS DISPLAY */}
            <div className="w-full flex items-end justify-center gap-2 sm:gap-3 min-h-[200px] pb-6 pt-4">
              <AnimatePresence mode="popLayout">
                {array.map((val, idx) => {
                  const isHighlighted = highlightedIndices.includes(idx);
                  const isSwapping = swappingIndices.includes(idx);
                  const isSorted = sortedIndices.has(idx);
                  const isEliminated = eliminatedRange && (idx >= eliminatedRange.start && idx <= eliminatedRange.end);
                  const isMid = pointers.mid === idx;
                  const isPivot = pointers.pivot === idx;

                  // Normalized height for sorting bars (tall & clear, max 150px)
                  const barHeight = Math.max(34, (Math.abs(val) / maxSortingVal) * 150);

                  // Active pointers matching this index
                  const matchingPointers = Object.entries(pointers)
                    .filter(([_, pos]) => pos === idx)
                    .map(([p]) => p.toUpperCase());

                  return (
                    <motion.div
                      key={`sort-bar-${idx}-${val}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: isEliminated ? 0.25 : 1, 
                        scale: isSwapping ? 1.1 : isMid ? 1.05 : 1,
                        y: isSwapping ? -18 : 0
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                      className="relative flex flex-col items-center justify-end flex-1 max-w-[54px] min-w-[32px]"
                    >
                      {/* Top Badges (Pointers, Mid, Pivot, Swapping) */}
                      <div className="absolute -top-8 flex flex-col items-center pointer-events-none z-20 gap-0.5">
                        {isPivot && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[8px] font-black uppercase shadow-xs">
                            👑 PIVOT
                          </span>
                        )}
                        {isMid && (
                          <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-white text-[8px] font-black uppercase shadow-xs">
                            🎯 MID
                          </span>
                        )}
                        {matchingPointers.length > 0 && !isPivot && !isMid && (
                          <span className={`px-1.5 py-0.5 rounded text-white text-[9px] font-black tracking-wider uppercase shadow-xs ${
                            isSwapping ? 'bg-rose-500' : 'bg-[#AB526B]'
                          }`}>
                            {matchingPointers.join(',')}
                          </span>
                        )}
                      </div>

                      {/* Discarded Overlay Hatched Pattern for Eliminated Ranges */}
                      {isEliminated && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-red-500 font-black text-xs">✕</span>
                          <span className="text-[8px] font-mono font-bold text-red-500/80 uppercase">OUT</span>
                        </div>
                      )}

                      {/* The Array Bar */}
                      <div
                        className={`w-full rounded-xl flex flex-col items-center justify-between p-1 font-mono font-bold text-xs shadow-xs border transition-all duration-200 ${
                          isSorted
                            ? 'bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-300/40 shadow-sm'
                            : isSwapping
                            ? 'bg-rose-500 text-white border-rose-400 shadow-md ring-2 ring-rose-400/60'
                            : isHighlighted
                            ? 'bg-cyan-500 text-white border-cyan-400 ring-2 ring-cyan-400/60 shadow-sm'
                            : isMid
                            ? 'bg-indigo-500 text-white border-indigo-400 ring-2 ring-indigo-300'
                            : isEliminated
                            ? 'bg-gray-200 dark:bg-[#5C4E49] text-gray-400 border-dashed border-red-300 dark:border-red-900/50'
                            : 'bg-gray-100 dark:bg-[#1E1E1E] text-gray-900 dark:text-gray-100 border-gray-300 dark:border-[#5C4E49]'
                        }`}
                        style={{ height: `${barHeight}px` }}
                      >
                        <span className="text-[12px] font-black">{val}</span>
                        {isSorted && (
                          <span className="text-[9px] font-mono text-emerald-100">✓</span>
                        )}
                      </div>

                      {/* Index Label */}
                      <div className="absolute -bottom-5 text-center">
                        <span className={`text-[9px] font-mono font-bold ${
                          isHighlighted ? 'text-cyan-600 dark:text-cyan-400 underline' : 'text-gray-400'
                        }`}>
                          [{idx}]
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Subtitle / Legend */}
            <div className="mt-7 pt-3 border-t border-gray-100 dark:border-[#222] flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-cyan-500 rounded-xs" />
                <span className="text-gray-600 dark:text-gray-400">Comparing Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-xs" />
                <span className="text-gray-600 dark:text-gray-400">Swapping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
                <span className="text-gray-600 dark:text-gray-400">Sorted Locked (✓)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-xs" />
                <span className="text-gray-600 dark:text-gray-400">Mid / Pivot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700 rounded-xs border border-dashed border-red-400" />
                <span className="text-gray-600 dark:text-gray-400">Eliminated (✕)</span>
              </div>
            </div>

          </div>
        )}

      </div>

    </ResponsiveVisualizerShell>
  );
}
