import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Eye, Compass, Layers, CheckCircle2, AlertCircle, ArrowRight,
  ArrowLeft, Sparkles, Binary, Check, X, ShieldAlert, Cpu, Hash, Flame, Trophy,
  ArrowUp, ArrowDown, Activity, RefreshCw
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';

// Sound synthesizer for tactile queue audio feedback
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
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    } else if (type === 'dequeue') {
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(290, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    } else if (type === 'pass') {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    } else if (type === 'eliminate') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    }
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    // Ignore audio failures
  }
};

const QUEUE_ALGORITHMS = [
  { id: 'basic', name: 'FIFO Queue', badge: 'O(1)', desc: 'Enqueue at Rear, Dequeue at Front' },
  { id: 'circular', name: 'Circular Queue', badge: 'O(1)', desc: 'Ring Buffer with Modulo Indexing' },
  { id: 'deque', name: 'Double-Ended Queue (Deque)', badge: 'O(1)', desc: 'Push & Pop at Both Ends' },
  { id: 'priority', name: 'Priority Queue', badge: 'O(log N)', desc: 'Elements Ordered by Priority Key' },
  { id: 'slidingWindow', name: 'Sliding Window Maximum', badge: 'O(N)', desc: 'Monotonic Decreasing Deque' },
  { id: 'hotPotato', name: 'Hot Potato (Josephus)', badge: 'O(N*K)', desc: 'Circular Elimination Game' },
  { id: 'twoStacks', name: 'Queue using 2 Stacks', badge: 'Amortized O(1)', desc: 'Reversal via In-Stack & Out-Stack' },
  { id: 'bfs', name: 'BFS Traversal Queue', badge: 'O(V+E)', desc: 'Level-Order Traversal Frontier' }
];

const CODE_SNIPPETS = {
  basic: {
    javascript: `// Standard FIFO Queue Class
class Queue {
  constructor() { this.items = []; }
  enqueue(element) { this.items.push(element); }
  dequeue() { return this.items.shift(); }
  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
}`,
    python: `from collections import deque
q = deque()
q.append(10)      # Enqueue O(1)
val = q.popleft() # Dequeue O(1)
front_item = q[0] # Peek`,
    cpp: `#include <queue>
std::queue<int> q;
q.push(10);  // Enqueue O(1)
q.pop();     // Dequeue O(1)
int f = q.front();`,
    java: `import java.util.LinkedList;
import java.util.Queue;
Queue<Integer> q = new LinkedList<>();
q.offer(10); // Enqueue O(1)
int val = q.poll(); // Dequeue`
  },
  circular: {
    javascript: `class CircularQueue {
  constructor(k) {
    this.queue = new Array(k);
    this.head = -1; this.tail = -1; this.size = k;
  }
  enQueue(val) {
    if (this.isFull()) return false;
    if (this.isEmpty()) this.head = 0;
    this.tail = (this.tail + 1) % this.size;
    this.queue[this.tail] = val;
    return true;
  }
  deQueue() {
    if (this.isEmpty()) return false;
    if (this.head === this.tail) { this.head = -1; this.tail = -1; }
    else this.head = (this.head + 1) % this.size;
    return true;
  }
}`,
    python: `class CircularQueue:
  def __init__(self, k: int):
    self.q = [None] * k
    self.head = self.tail = -1
    self.k = k

  def enqueue(self, val: int) -> bool:
    if self.is_full(): return False
    if self.is_empty(): self.head = 0
    self.tail = (self.tail + 1) % self.k
    self.q[self.tail] = val
    return True`,
    cpp: `// C++ Circular Queue with Modulo
int tail = (tail + 1) % capacity;
queue[tail] = value;`,
    java: `// Java Circular Queue Implementation
int tail = (tail + 1) % capacity;
queue[tail] = value;`
  },
  deque: {
    javascript: `class Deque {
  constructor() { this.items = []; }
  pushFront(val) { this.items.unshift(val); }
  pushRear(val) { this.items.push(val); }
  popFront() { return this.items.shift(); }
  popRear() { return this.items.pop(); }
}`,
    python: `from collections import deque
dq = deque()
dq.appendleft(5) # Push Front
dq.append(10)    # Push Rear
val_f = dq.popleft() # Pop Front
val_r = dq.pop()     # Pop Rear`,
    cpp: `#include <deque>
std::deque<int> dq;
dq.push_front(5);
dq.push_back(10);
dq.pop_front();
dq.pop_back();`,
    java: `import java.util.ArrayDeque;
import java.util.Deque;
Deque<Integer> dq = new ArrayDeque<>();
dq.addFirst(5);
dq.addLast(10);
dq.removeFirst();
dq.removeLast();`
  },
  priority: {
    javascript: `// Priority Queue (Min-Heap / Sorted Order)
class PriorityQueue {
  constructor() { this.items = []; }
  enqueue(val, priority) {
    const qElement = { val, priority };
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        this.items.splice(i, 0, qElement);
        added = true; break;
      }
    }
    if (!added) this.items.push(qElement);
  }
  dequeue() { return this.items.shift(); }
}`,
    python: `import heapq
# Python Min-Heap Priority Queue
pq = []
heapq.heappush(pq, (1, "Emergency Task"))
heapq.heappush(pq, (3, "Low Priority Task"))
val = heapq.heappop(pq) # Extracts Highest Priority`,
    cpp: `#include <queue>
std::priority_queue<int, std::vector<int>, std::greater<int>> pq;
pq.push(10);
pq.push(5); // Higher priority
int topVal = pq.top(); pq.pop();`,
    java: `import java.util.PriorityQueue;
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.add(10);
pq.add(5); // Highest priority first
int minVal = pq.poll();`
  },
  slidingWindow: {
    javascript: `function maxSlidingWindow(nums, k) {
  const q = []; // Monotonic Decreasing Deque
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    while (q.length && q[0] <= i - k) q.shift();
    while (q.length && nums[q[q.length - 1]] < nums[i]) q.pop();
    q.push(i);
    if (i >= k - 1) res.push(nums[q[0]]);
  }
  return res;
}`,
    python: `from collections import deque
def maxSlidingWindow(nums, k):
  q = deque()
  res = []
  for i, num in enumerate(nums):
    while q and q[0] <= i - k: q.popleft()
    while q and nums[q[-1]] < num: q.pop()
    q.append(i)
    if i >= k - 1: res.append(nums[q[0]])
  return res`,
    cpp: `// C++ Monotonic Deque Sliding Window O(n)
std::deque<int> dq;
for (int i = 0; i < nums.size(); ++i) {
  if (!dq.empty() && dq.front() == i - k) dq.pop_front();
  while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
  dq.push_back(i);
  if (i >= k - 1) res.push_back(nums[dq.front()]);
}`,
    java: `// Java Monotonic Deque Sliding Window O(n)
Deque<Integer> dq = new ArrayDeque<>();
for (int i = 0; i < nums.length; i++) {
  if (!dq.isEmpty() && dq.peekFirst() == i - k) dq.pollFirst();
  while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
  dq.offerLast(i);
  if (i >= k - 1) res.add(nums[dq.peekFirst()]);
}`
  },
  hotPotato: {
    javascript: `function hotPotato(namelist, num) {
  const queue = [...namelist];
  while (queue.length > 1) {
    for (let i = 0; i < num; i++) {
      queue.push(queue.shift()); // Pass potato
    }
    const eliminated = queue.shift(); // Eliminate
  }
  return queue[0]; // Winner
}`,
    python: `from collections import deque
def hot_potato(namelist, num):
  q = deque(namelist)
  while len(q) > 1:
    for _ in range(num):
      q.append(q.popleft())
    eliminated = q.popleft()
  return q[0]`,
    cpp: `// C++ Circular Elimination Queue
for (int i = 0; i < num; i++) {
  q.push(q.front()); q.pop();
}
q.pop(); // Eliminated`,
    java: `// Java Hot Potato Circular Queue
for (int i = 0; i < num; i++) {
  q.offer(q.poll());
}
q.poll(); // Eliminated`
  },
  twoStacks: {
    javascript: `class QueueViaTwoStacks {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  enqueue(val) { this.inStack.push(val); }
  dequeue() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
    return this.outStack.pop();
  }
}`,
    python: `class QueueTwoStacks:
  def __init__(self):
    self.in_stack = []
    self.out_stack = []
  def enqueue(self, val):
    self.in_stack.append(val)
  def dequeue(self):
    if not self.out_stack:
      while self.in_stack:
        self.out_stack.append(self.in_stack.pop())
    return self.out_stack.pop()`,
    cpp: `// C++ Queue via 2 Stacks
void enqueue(int val) { inStack.push(val); }
int dequeue() {
  if (outStack.empty()) {
    while (!inStack.empty()) {
      outStack.push(inStack.top()); inStack.pop();
    }
  }
  int val = outStack.top(); outStack.pop(); return val;
}`,
    java: `// Java Queue via 2 Stacks
public void enqueue(int val) { inStack.push(val); }
public int dequeue() {
  if (outStack.isEmpty()) {
    while (!inStack.isEmpty()) {
      outStack.push(inStack.pop());
    }
  }
  return outStack.pop();
}`
  },
  bfs: {
    javascript: `function bfsTraversal(graph, startNode) {
  const visited = new Set([startNode]);
  const queue = [startNode];
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift(); // Dequeue
    order.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor); // Enqueue
      }
    }
  }
  return order;
}`,
    python: `from collections import deque
def bfs(graph, start):
  visited = {start}
  q = deque([start])
  order = []
  while q:
    node = q.popleft()
    order.append(node)
    for neighbor in graph[node]:
      if neighbor not in visited:
        visited.add(neighbor)
        q.append(neighbor)
  return order`,
    cpp: `// C++ BFS Level Order Queue
std::queue<char> q;
q.push('A'); visited.insert('A');
while (!q.empty()) {
  char u = q.front(); q.pop();
  for (char v : adj[u]) {
    if (!visited.count(v)) { visited.insert(v); q.push(v); }
  }
}`,
    java: `// Java BFS Traversal Queue
Queue<Character> q = new LinkedList<>();
q.offer('A'); visited.add('A');
while (!q.isEmpty()) {
  char u = q.poll();
  for (char v : adj.get(u)) {
    if (!visited.contains(v)) { visited.add(v); q.offer(v); }
  }
}`
  }
};

export default function QueueVisualizer({ initialAlgoId }) {
  const params = useParams();
  const urlAlgoId = params.algoId || initialAlgoId;
  const [activeAlgo, setActiveAlgo] = useState(urlAlgoId || 'basic');
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [logs, setLogs] = useState([]);
  const [activeLine, setActiveLine] = useState(1);

  useEffect(() => {
    if (urlAlgoId && urlAlgoId !== activeAlgo) setActiveAlgo(urlAlgoId);
  }, [urlAlgoId]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 19)]);
  };

  // 1. Basic FIFO Queue State
  const [basicItems, setBasicItems] = useState([15, 28, 42, 65]);
  const [basicInput, setBasicInput] = useState('88');

  // 2. Circular Queue State
  const circularCapacity = 6;
  const [circularSlots, setCircularSlots] = useState([12, 24, 36, null, null, null]);
  const [circularFront, setCircularFront] = useState(0);
  const [circularRear, setCircularRear] = useState(2);
  const [circularInput, setCircularInput] = useState('48');

  // 3. Deque State
  const [dequeItems, setDequeItems] = useState([25, 50, 75]);
  const [dequeInput, setDequeInput] = useState('100');

  // 4. Priority Queue State
  const [priorityItems, setPriorityItems] = useState([
    { id: 1, val: 99, priority: 1, label: 'High (P1)' },
    { id: 2, val: 45, priority: 2, label: 'Med (P2)' },
    { id: 3, val: 12, priority: 3, label: 'Low (P3)' }
  ]);
  const [prioValInput, setPrioValInput] = useState('77');
  const [prioLevelInput, setPrioLevelInput] = useState(2);

  // 5. Sliding Window State
  const [swArray, setSwArray] = useState([1, 3, -1, -3, 5, 3, 6, 7]);
  const [swK, setSwK] = useState(3);
  const [swDeque, setSwDeque] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // 6. Hot Potato State
  const [potatoPlayers, setPotatoPlayers] = useState(['Alice', 'Bob', 'Charlie', 'David', 'Emma']);
  const [potatoK, setPotatoK] = useState(3);

  // 7. Queue via 2 Stacks State
  const [inStack, setInStack] = useState([10, 20, 30]);
  const [outStack, setOutStack] = useState([]);
  const [stackInput, setStackInput] = useState('40');

  // 8. BFS Queue State
  const graphAdj = useMemo(() => ({
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
  }), []);
  const [bfsQueue, setBfsQueue] = useState(['A']);
  const [bfsVisited, setBfsVisited] = useState(['A']);
  const [bfsOrder, setBfsOrder] = useState([]);
  const [bfsActiveNode, setBfsActiveNode] = useState(null);

  // Sync mode changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
    setActiveLine(1);
    addLog(`> Switched algorithm mode to ${QUEUE_ALGORITHMS.find(a => a.id === activeAlgo)?.name}.`);
  }, [activeAlgo]);

  // Variables tracking
  const activeVariables = useMemo(() => {
    if (activeAlgo === 'basic') {
      return {
        front: basicItems[0] ?? 'empty',
        rear: basicItems[basicItems.length - 1] ?? 'empty',
        size: basicItems.length,
        capacity: 10
      };
    } else if (activeAlgo === 'circular') {
      return {
        front: circularFront,
        rear: circularRear,
        capacity: circularCapacity,
        isFull: (circularRear + 1) % circularCapacity === circularFront,
        isEmpty: circularFront === -1
      };
    } else if (activeAlgo === 'deque') {
      return {
        front: dequeItems[0] ?? 'empty',
        rear: dequeItems[dequeItems.length - 1] ?? 'empty',
        size: dequeItems.length
      };
    } else if (activeAlgo === 'priority') {
      return {
        highestPriorityVal: priorityItems[0]?.val ?? 'empty',
        totalItems: priorityItems.length,
        topPriorityLevel: priorityItems[0]?.priority ?? 'N/A'
      };
    } else if (activeAlgo === 'twoStacks') {
      return {
        inStackSize: inStack.length,
        outStackSize: outStack.length,
        totalElements: inStack.length + outStack.length
      };
    } else if (activeAlgo === 'bfs') {
      return {
        frontierSize: bfsQueue.length,
        activeNode: bfsActiveNode || 'None',
        visitedCount: bfsVisited.length
      };
    }
    return { step: currentStepIdx, status: 'Active' };
  }, [activeAlgo, basicItems, circularFront, circularRear, dequeItems, priorityItems, inStack, outStack, bfsQueue, bfsVisited, bfsActiveNode, currentStepIdx]);

  // BASIC QUEUE HANDLERS
  const handleBasicEnqueue = () => {
    const val = parseInt(basicInput, 10);
    if (isNaN(val)) return;
    if (basicItems.length >= 10) {
      addLog(`⚠️ Queue Overflow! Maximum capacity 10 reached.`);
      return;
    }
    setBasicItems(prev => [...prev, val]);
    playSynthTone('enqueue', isMuted);
    addLog(`> Enqueued value ${val} at Rear index [${basicItems.length}].`);
    setActiveLine(3);
  };

  const handleBasicDequeue = () => {
    if (basicItems.length === 0) {
      addLog(`⚠️ Queue Underflow! Queue is empty.`);
      return;
    }
    const removed = basicItems[0];
    setBasicItems(prev => prev.slice(1));
    playSynthTone('dequeue', isMuted);
    addLog(`> Dequeued value ${removed} from Front index [0].`);
    setActiveLine(4);
  };

  const handleBasicClear = () => {
    setBasicItems([]);
    addLog(`> Cleared basic queue.`);
  };

  // CIRCULAR QUEUE HANDLERS
  const handleCircularEnqueue = () => {
    const val = parseInt(circularInput, 10);
    if (isNaN(val)) return;
    const isFull = (circularRear + 1) % circularCapacity === circularFront && circularFront !== -1;
    if (isFull) {
      addLog(`⚠️ Circular Queue Overflow! Ring buffer is full.`);
      return;
    }
    let nextFront = circularFront;
    let nextRear = circularRear;
    if (circularFront === -1) {
      nextFront = 0;
      nextRear = 0;
    } else {
      nextRear = (circularRear + 1) % circularCapacity;
    }
    const newSlots = [...circularSlots];
    newSlots[nextRear] = val;
    setCircularSlots(newSlots);
    setCircularFront(nextFront);
    setCircularRear(nextRear);
    playSynthTone('enqueue', isMuted);
    addLog(`> Circular Enqueue ${val}: Rear set to (${circularRear} + 1) % ${circularCapacity} = ${nextRear}.`);
    setActiveLine(8);
  };

  const handleCircularDequeue = () => {
    if (circularFront === -1) {
      addLog(`⚠️ Circular Queue Underflow! Ring buffer is empty.`);
      return;
    }
    const removedVal = circularSlots[circularFront];
    const newSlots = [...circularSlots];
    newSlots[circularFront] = null;
    let nextFront = circularFront;
    let nextRear = circularRear;

    if (circularFront === circularRear) {
      nextFront = -1;
      nextRear = -1;
    } else {
      nextFront = (circularFront + 1) % circularCapacity;
    }

    setCircularSlots(newSlots);
    setCircularFront(nextFront);
    setCircularRear(nextRear);
    playSynthTone('dequeue', isMuted);
    addLog(`> Circular Dequeue ${removedVal}: Front set to (${circularFront} + 1) % ${circularCapacity} = ${nextFront}.`);
    setActiveLine(14);
  };

  // DEQUE HANDLERS
  const handleDequePushFront = () => {
    const val = parseInt(dequeInput, 10);
    if (isNaN(val)) return;
    setDequeItems(prev => [val, ...prev]);
    playSynthTone('enqueue', isMuted);
    addLog(`> Deque Push Front: ${val}`);
  };

  const handleDequePushBack = () => {
    const val = parseInt(dequeInput, 10);
    if (isNaN(val)) return;
    setDequeItems(prev => [...prev, val]);
    playSynthTone('enqueue', isMuted);
    addLog(`> Deque Push Rear: ${val}`);
  };

  const handleDequePopFront = () => {
    if (dequeItems.length === 0) return;
    const removed = dequeItems[0];
    setDequeItems(prev => prev.slice(1));
    playSynthTone('dequeue', isMuted);
    addLog(`> Deque Pop Front: ${removed}`);
  };

  const handleDequePopBack = () => {
    if (dequeItems.length === 0) return;
    const removed = dequeItems[dequeItems.length - 1];
    setDequeItems(prev => prev.slice(0, -1));
    playSynthTone('dequeue', isMuted);
    addLog(`> Deque Pop Rear: ${removed}`);
  };

  // PRIORITY QUEUE HANDLERS
  const handlePriorityEnqueue = () => {
    const val = parseInt(prioValInput, 10);
    const prio = parseInt(prioLevelInput, 10);
    if (isNaN(val)) return;

    const newItem = {
      id: Date.now(),
      val,
      priority: prio,
      label: prio === 1 ? 'High (P1)' : prio === 2 ? 'Med (P2)' : 'Low (P3)'
    };

    setPriorityItems(prev => {
      const next = [...prev, newItem];
      next.sort((a, b) => a.priority - b.priority);
      return next;
    });
    playSynthTone('enqueue', isMuted);
    addLog(`> Priority Enqueue: Val ${val} with Priority P${prio}. Inserted in sorted position.`);
    setActiveLine(7);
  };

  const handlePriorityDequeue = () => {
    if (priorityItems.length === 0) return;
    const highest = priorityItems[0];
    setPriorityItems(prev => prev.slice(1));
    playSynthTone('dequeue', isMuted);
    addLog(`> Priority Dequeue: Extracted highest priority element (${highest.val}, P${highest.priority}).`);
    setActiveLine(12);
  };

  // QUEUE VIA 2 STACKS HANDLERS
  const handleTwoStacksEnqueue = () => {
    const val = parseInt(stackInput, 10);
    if (isNaN(val)) return;
    setInStack(prev => [...prev, val]);
    playSynthTone('enqueue', isMuted);
    addLog(`> Enqueued ${val} onto In-Stack.`);
    setActiveLine(7);
  };

  const handleTwoStacksDequeue = () => {
    if (outStack.length > 0) {
      const val = outStack[outStack.length - 1];
      setOutStack(prev => prev.slice(0, -1));
      playSynthTone('dequeue', isMuted);
      addLog(`> Dequeued ${val} directly from Out-Stack.`);
      setActiveLine(15);
    } else if (inStack.length > 0) {
      // Transfer In-Stack to Out-Stack
      const reversed = [...inStack].reverse();
      const val = reversed[0];
      setOutStack(reversed.slice(1));
      setInStack([]);
      playSynthTone('dequeue', isMuted);
      addLog(`> Out-Stack was empty! Transferred all ${inStack.length} items from In-Stack ➔ Out-Stack (Reversed LIFO ➔ FIFO). Dequeued ${val}.`);
      setActiveLine(12);
    } else {
      addLog(`⚠️ Queue Underflow! Both In-Stack and Out-Stack are empty.`);
    }
  };

  // BFS QUEUE HANDLERS
  const handleStepBFS = () => {
    if (bfsQueue.length === 0) {
      addLog(`✅ BFS Traversal Complete! All reachable nodes processed.`);
      return;
    }

    const current = bfsQueue[0];
    const newQueue = bfsQueue.slice(1);
    const newOrder = [...bfsOrder, current];
    setBfsActiveNode(current);

    const neighbors = graphAdj[current] || [];
    const newVisited = [...bfsVisited];
    const toEnqueue = [];

    neighbors.forEach(n => {
      if (!newVisited.includes(n)) {
        newVisited.push(n);
        toEnqueue.push(n);
      }
    });

    const updatedQueue = [...newQueue, ...toEnqueue];

    setBfsQueue(updatedQueue);
    setBfsVisited(newVisited);
    setBfsOrder(newOrder);
    playSynthTone('pass', isMuted);
    addLog(`> BFS Step: Dequeued '${current}', enqueued unvisited neighbors: [${toEnqueue.join(', ') || 'none'}]. Frontier: [${updatedQueue.join(', ')}].`);
    setActiveLine(7);
  };

  const handleResetBFS = () => {
    setBfsQueue(['A']);
    setBfsVisited(['A']);
    setBfsOrder([]);
    setBfsActiveNode(null);
    addLog(`> Reset BFS Queue to start at root node 'A'.`);
  };

  // SLIDING WINDOW & HOT POTATO TRAJECTORY STEPS
  const steps = useMemo(() => {
    if (activeAlgo === 'slidingWindow') {
      const trajectory = [];
      const nums = swArray;
      const k = swK;
      const q = [];
      const res = [];
      trajectory.push({ idx: 0, num: nums[0], deque: [], res: [], desc: 'Initialize Monotonic Decreasing Deque.' });
      for (let i = 0; i < nums.length; i++) {
        while (q.length && q[0] <= i - k) q.shift();
        while (q.length && nums[q[q.length - 1]] < nums[i]) q.pop();
        q.push(i);
        if (i >= k - 1) res.push(nums[q[0]]);
        trajectory.push({
          idx: i,
          num: nums[i],
          deque: [...q],
          res: [...res],
          desc: `Index ${i} (${nums[i]}): Window [${Math.max(0, i-k+1)}..${i}]. Window Max = ${q.length ? nums[q[0]] : 'N/A'}`
        });
      }
      return trajectory;
    } else if (activeAlgo === 'hotPotato') {
      const trajectory = [];
      let q = [...potatoPlayers];
      const eliminatedList = [];
      trajectory.push({ q: [...q], eliminated: [], currentHolder: q[0], desc: 'Game start! Potato initialized with ' + q[0] });
      while (q.length > 1) {
        for (let pass = 0; pass < potatoK; pass++) {
          const p = q.shift();
          q.push(p);
          trajectory.push({
            q: [...q],
            eliminated: [...eliminatedList],
            currentHolder: q[q.length - 1],
            desc: `Pass ${pass + 1}/${potatoK}: Passed potato from ${p} to ${q[q.length - 1]}.`
          });
        }
        const eliminated = q.shift();
        eliminatedList.push(eliminated);
        trajectory.push({
          q: [...q],
          eliminated: [...eliminatedList],
          currentHolder: q[0],
          desc: `💥 Potato exploded! ${eliminated} is ELIMINATED!`
        });
      }
      trajectory.push({
        q: [...q],
        eliminated: [...eliminatedList],
        winner: q[0],
        desc: `🏆 Winner Winner! ${q[0]} is the Hot Potato champion!`
      });
      return trajectory;
    }
    return [];
  }, [activeAlgo, swArray, swK, potatoPlayers, potatoK]);

  // PLAYBACK AUTOPLAY TIMER
  useEffect(() => {
    let timer;
    if (isPlaying && (activeAlgo === 'slidingWindow' || activeAlgo === 'hotPotato')) {
      timer = setTimeout(() => {
        setCurrentStepIdx(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200 / playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps, playbackSpeed, activeAlgo]);

  // CONTROLS PANEL RENDERING
  const renderControls = (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {/* Algorithm Mode Dropdown */}
      <div className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#331921] px-3 py-1.5 rounded-xl border border-[#5C4E49]/40 shadow-xs">
        <Layers size={14} className="text-[#AB526B]" />
        <select
          value={activeAlgo}
          onChange={(e) => setActiveAlgo(e.target.value)}
          className="bg-transparent text-xs font-mono font-bold text-[#423834] dark:text-[#FAF7F2] focus:outline-none cursor-pointer"
        >
          {QUEUE_ALGORITHMS.map(a => (
            <option key={a.id} value={a.id} className="bg-[#FAF7F2] dark:bg-[#331921] text-[#423834] dark:text-[#FAF7F2]">
              {a.name} ({a.badge})
            </option>
          ))}
        </select>
      </div>

      {/* Basic FIFO Controls */}
      {activeAlgo === 'basic' && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={basicInput}
            onChange={e => setBasicInput(e.target.value)}
            className="w-16 px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-[#331921] border border-[#5C4E49]/40 text-xs font-mono font-bold focus:outline-none"
          />
          <button
            onClick={handleBasicEnqueue}
            className="px-3 py-1 rounded-lg bg-[#AB526B] hover:bg-[#8F3E53] text-white text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <Plus size={14} /> Enqueue
          </button>
          <button
            onClick={handleBasicDequeue}
            className="px-3 py-1 rounded-lg bg-[#423834] hover:bg-[#5C4E49] text-white text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <Trash2 size={14} /> Dequeue
          </button>
          <button
            onClick={handleBasicClear}
            className="px-2.5 py-1 rounded-lg bg-[#5C4E49]/20 hover:bg-[#5C4E49]/40 text-[#FAF7F2] text-xs font-mono transition-all"
          >
            Clear
          </button>
        </div>
      )}

      {/* Circular Queue Controls */}
      {activeAlgo === 'circular' && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={circularInput}
            onChange={e => setCircularInput(e.target.value)}
            className="w-16 px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-[#331921] border border-[#5C4E49]/40 text-xs font-mono font-bold focus:outline-none"
          />
          <button
            onClick={handleCircularEnqueue}
            className="px-3 py-1 rounded-lg bg-[#AB526B] hover:bg-[#8F3E53] text-white text-xs font-mono font-bold transition-all shadow-xs"
          >
            (rear+1)%N Enqueue
          </button>
          <button
            onClick={handleCircularDequeue}
            className="px-3 py-1 rounded-lg bg-[#423834] hover:bg-[#5C4E49] text-white text-xs font-mono font-bold transition-all shadow-xs"
          >
            (front+1)%N Dequeue
          </button>
        </div>
      )}

      {/* Deque Controls */}
      {activeAlgo === 'deque' && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={dequeInput}
            onChange={e => setDequeInput(e.target.value)}
            className="w-16 px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-[#331921] border border-[#5C4E49]/40 text-xs font-mono font-bold focus:outline-none"
          />
          <button onClick={handleDequePushFront} className="px-2.5 py-1 rounded-lg bg-[#AB526B] text-white text-xs font-mono font-bold">Push Front</button>
          <button onClick={handleDequePushBack} className="px-2.5 py-1 rounded-lg bg-[#C5CEAE] text-[#333] text-xs font-mono font-bold">Push Rear</button>
          <button onClick={handleDequePopFront} className="px-2.5 py-1 rounded-lg bg-[#423834] text-white text-xs font-mono font-bold">Pop Front</button>
          <button onClick={handleDequePopBack} className="px-2.5 py-1 rounded-lg bg-[#5C4E49] text-white text-xs font-mono font-bold">Pop Rear</button>
        </div>
      )}

      {/* Priority Queue Controls */}
      {activeAlgo === 'priority' && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={prioValInput}
            onChange={e => setPrioValInput(e.target.value)}
            placeholder="Val"
            className="w-14 px-2 py-1 rounded-lg bg-[#FAF7F2] dark:bg-[#331921] border border-[#5C4E49]/40 text-xs font-mono font-bold"
          />
          <select
            value={prioLevelInput}
            onChange={e => setPrioLevelInput(parseInt(e.target.value, 10))}
            className="px-2 py-1 rounded-lg bg-[#FAF7F2] dark:bg-[#331921] border border-[#5C4E49]/40 text-xs font-mono font-bold text-[#423834] dark:text-[#FAF7F2]"
          >
            <option value={1}>P1 (High)</option>
            <option value={2}>P2 (Med)</option>
            <option value={3}>P3 (Low)</option>
          </select>
          <button onClick={handlePriorityEnqueue} className="px-3 py-1 rounded-lg bg-[#AB526B] text-white text-xs font-mono font-bold">Enqueue Prio</button>
          <button onClick={handlePriorityDequeue} className="px-3 py-1 rounded-lg bg-[#423834] text-white text-xs font-mono font-bold">Dequeue Highest</button>
        </div>
      )}

      {/* Two Stacks Controls */}
      {activeAlgo === 'twoStacks' && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={stackInput}
            onChange={e => setStackInput(e.target.value)}
            className="w-16 px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-[#331921] border border-[#5C4E49]/40 text-xs font-mono font-bold focus:outline-none"
          />
          <button onClick={handleTwoStacksEnqueue} className="px-3 py-1 rounded-lg bg-[#AB526B] text-white text-xs font-mono font-bold">Push to In-Stack</button>
          <button onClick={handleTwoStacksDequeue} className="px-3 py-1 rounded-lg bg-[#423834] text-white text-xs font-mono font-bold">Pop from Out-Stack</button>
        </div>
      )}

      {/* BFS Controls */}
      {activeAlgo === 'bfs' && (
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleStepBFS} className="px-3 py-1 rounded-lg bg-[#AB526B] text-white text-xs font-mono font-bold flex items-center gap-1">
            <ArrowRight size={14} /> Step BFS Dequeue
          </button>
          <button onClick={handleResetBFS} className="px-2.5 py-1 rounded-lg bg-[#423834] text-white text-xs font-mono font-bold flex items-center gap-1">
            <RotateCcw size={14} /> Reset BFS
          </button>
        </div>
      )}
    </div>
  );

  // RIGHT CODE & LOGS PANEL
  const rightPanel = (
    <div className="space-y-4">
      {/* Code Inspector */}
      <CodeInspector
        codeSnippets={CODE_SNIPPETS[activeAlgo]}
        activeLine={activeLine}
        variables={activeVariables}
        title={`${QUEUE_ALGORITHMS.find(a => a.id === activeAlgo)?.name} Logic`}
      />

      {/* Live Variable Tracker */}
      <DryRunVariableTracker variables={activeVariables} />

      {/* Activity Logs */}
      <div className="bg-[#331921] border border-[#5C4E49] rounded-2xl p-4 shadow-md">
        <h4 className="text-xs font-mono font-bold text-[#F0E2A4] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Activity size={14} /> Execution Trace Log
        </h4>
        <div className="h-32 overflow-y-auto font-mono text-[11px] space-y-1 text-[#FAF7F2]">
          {logs.length === 0 ? (
            <p className="text-[#BCA297] italic">No queue events logged yet.</p>
          ) : (
            logs.map((l, i) => (
              <div key={i} className="leading-snug text-xs">{l}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // MAIN VISUAL CANVAS STAGE
  return (
    <ResponsiveVisualizerShell
      title="Queue Data Structure & Algorithms Studio"
      subtitle="Interactive FIFO track, Circular Ring Buffer, Priority Queue, Monotonic Deque & BFS Traversal"
      currentPath="/visualizer/queue"
      category="ds"
      controls={renderControls}
      playback={
        activeAlgo === 'slidingWindow' || activeAlgo === 'hotPotato' ? (
          <VisualizerPlaybackBar
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(p => !p)}
            onStepForward={() => setCurrentStepIdx(p => Math.min(steps.length - 1, p + 1))}
            onStepBack={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
            onReset={() => setCurrentStepIdx(0)}
            speed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            currentStep={currentStepIdx}
            totalSteps={steps.length}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => setIsVoiceEnabled(v => !v)}
          />
        ) : null
      }
      rightPanel={rightPanel}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 min-h-[450px]">
        
        {/* 1. BASIC FIFO QUEUE CANVAS */}
        {activeAlgo === 'basic' && (
          <div className="w-full max-w-3xl space-y-8 text-center">
            <h3 className="text-lg font-mono font-bold text-[#FAF7F2] flex items-center justify-center gap-2">
              <Layers size={18} className="text-[#AB526B]" /> Linear FIFO Queue Track
            </h3>

            {/* Queue Track Container */}
            <div className="relative bg-[#331921] border-2 border-[#5C4E49] rounded-3xl p-6 shadow-2xl flex items-center justify-center min-h-[140px] overflow-x-auto">
              <div className="flex items-center gap-3">
                <AnimatePresence mode="popLayout">
                  {basicItems.map((item, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === basicItems.length - 1;
                    return (
                      <motion.div
                        key={`${item}-${idx}`}
                        initial={{ scale: 0, y: -30 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 30 }}
                        className={`relative w-16 h-20 rounded-2xl flex flex-col items-center justify-center font-mono font-extrabold border-2 shadow-lg ${
                          isFront
                            ? 'bg-[#AB526B] border-[#F0E2A4] text-white shadow-[#AB526B]/40'
                            : isRear
                            ? 'bg-[#5C4E49] border-[#C5CEAE] text-white'
                            : 'bg-[#423834] border-[#5C4E49] text-[#FAF7F2]'
                        }`}
                      >
                        <span className="text-lg">{item}</span>
                        <span className="text-[10px] text-[#BCA297]">[{idx}]</span>

                        {/* Front Tag */}
                        {isFront && (
                          <span className="absolute -top-7 text-[10px] font-mono font-bold text-[#AB526B] bg-[#AB526B]/20 px-2 py-0.5 rounded-full border border-[#AB526B]/40">
                            FRONT
                          </span>
                        )}

                        {/* Rear Tag */}
                        {isRear && (
                          <span className="absolute -bottom-7 text-[10px] font-mono font-bold text-[#C5CEAE] bg-[#C5CEAE]/20 px-2 py-0.5 rounded-full border border-[#C5CEAE]/40">
                            REAR
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {basicItems.length === 0 && (
                  <p className="text-sm font-mono text-[#BCA297] italic">Queue is empty. Click Enqueue above!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. CIRCULAR QUEUE CANVAS */}
        {activeAlgo === 'circular' && (
          <div className="w-full max-w-2xl space-y-6 text-center">
            <h3 className="text-lg font-mono font-bold text-[#FAF7F2]">
              Circular Ring Buffer (Capacity {circularCapacity})
            </h3>
            
            {/* Ring Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {circularSlots.map((val, idx) => {
                const isFront = idx === circularFront;
                const isRear = idx === circularRear;
                return (
                  <div
                    key={idx}
                    className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold relative transition-all ${
                      val !== null
                        ? isFront
                          ? 'bg-[#AB526B] border-[#F0E2A4] text-white shadow-lg'
                          : isRear
                          ? 'bg-[#5C4E49] border-[#C5CEAE] text-white'
                          : 'bg-[#423834] border-[#5C4E49] text-[#FAF7F2]'
                        : 'bg-[#331921]/40 border-[#5C4E49]/30 text-[#BCA297]'
                    }`}
                  >
                    <span className="text-xs text-[#BCA297] font-normal">Slot [{idx}]</span>
                    <span className="text-base font-extrabold">{val !== null ? val : 'Empty'}</span>
                    
                    {isFront && <span className="text-[9px] font-bold text-[#F0E2A4]">FRONT</span>}
                    {isRear && <span className="text-[9px] font-bold text-[#C5CEAE]">REAR</span>}
                  </div>
                );
              })}
            </div>
            <div className="bg-[#331921] p-4 rounded-2xl border border-[#5C4E49] font-mono text-xs text-[#BCA297] flex items-center justify-between">
              <span>Front Index: <strong className="text-[#AB526B]">{circularFront}</strong></span>
              <span>Rear Index: <strong className="text-[#C5CEAE]">{circularRear}</strong></span>
              <span>Modulo Formula: <strong className="text-[#F0E2A4]">(i + 1) % {circularCapacity}</strong></span>
            </div>
          </div>
        )}

        {/* 3. DEQUE CANVAS */}
        {activeAlgo === 'deque' && (
          <div className="w-full max-w-3xl space-y-6 text-center">
            <h3 className="text-lg font-mono font-bold text-[#FAF7F2]">Double-Ended Queue (Deque)</h3>
            <div className="bg-[#331921] border-2 border-[#5C4E49] rounded-3xl p-6 shadow-2xl flex items-center justify-center gap-3">
              <AnimatePresence mode="popLayout">
                {dequeItems.map((val, idx) => (
                  <motion.div
                    key={`${val}-${idx}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-16 h-20 rounded-2xl bg-[#423834] border-2 border-[#AB526B] text-white flex flex-col items-center justify-center font-mono font-bold shadow-lg"
                  >
                    <span className="text-lg">{val}</span>
                    <span className="text-[9px] text-[#BCA297]">[{idx}]</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* 4. PRIORITY QUEUE CANVAS */}
        {activeAlgo === 'priority' && (
          <div className="w-full max-w-3xl space-y-6 text-center">
            <h3 className="text-lg font-mono font-bold text-[#FAF7F2]">Priority Queue (Min Priority First)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {priorityItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 font-mono flex flex-col items-center justify-center space-y-1 shadow-lg ${
                    item.priority === 1
                      ? 'bg-[#AB526B] border-[#F0E2A4] text-white'
                      : item.priority === 2
                      ? 'bg-[#5C4E49] border-[#C5CEAE] text-white'
                      : 'bg-[#423834] border-[#5C4E49] text-[#FAF7F2]'
                  }`}
                >
                  <span className="text-xs uppercase font-extrabold">{item.label}</span>
                  <span className="text-2xl font-black">{item.val}</span>
                  <span className="text-[10px] text-[#FAF7F2]/70">Position #{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SLIDING WINDOW CANVAS */}
        {activeAlgo === 'slidingWindow' && steps.length > 0 && (
          <div className="w-full max-w-3xl space-y-6 text-center">
            <h3 className="text-lg font-mono font-bold text-[#FAF7F2]">Sliding Window Maximum</h3>
            <p className="text-xs font-mono text-[#F0E2A4]">{steps[currentStepIdx]?.desc}</p>
            <div className="flex items-center justify-center gap-2">
              {swArray.map((val, idx) => {
                const stepData = steps[currentStepIdx];
                const inWindow = idx >= stepData.idx - swK + 1 && idx <= stepData.idx;
                return (
                  <div
                    key={idx}
                    className={`w-14 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold transition-all ${
                      inWindow
                        ? 'bg-[#AB526B] border-[#F0E2A4] text-white scale-110 shadow-lg'
                        : 'bg-[#423834] border-[#5C4E49] text-[#FAF7F2]'
                    }`}
                  >
                    <span>{val}</span>
                    <span className="text-[9px] opacity-70">[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. HOT POTATO CANVAS */}
        {activeAlgo === 'hotPotato' && steps.length > 0 && (
          <div className="w-full max-w-2xl space-y-6 text-center">
            <h3 className="text-lg font-mono font-bold text-[#FAF7F2]">Hot Potato Elimination Game</h3>
            <p className="text-xs font-mono text-[#F0E2A4]">{steps[currentStepIdx]?.desc}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {steps[currentStepIdx]?.q?.map((player) => (
                <div key={player} className="px-4 py-3 rounded-2xl bg-[#AB526B] border-2 border-[#F0E2A4] text-white font-mono font-bold text-sm shadow-xl flex items-center gap-2">
                  <span>🥔 {player}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. QUEUE VIA 2 STACKS CANVAS */}
        {activeAlgo === 'twoStacks' && (
          <div className="w-full max-w-3xl space-y-6 text-center">
            <h3 className="text-lg font-mono font-bold text-[#FAF7F2]">Queue via 2 Stacks (In-Stack & Out-Stack)</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* In Stack */}
              <div className="bg-[#331921] border-2 border-[#5C4E49] rounded-3xl p-5 min-h-[200px] flex flex-col-reverse items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#C5CEAE]">In-Stack (Push Target)</span>
                {inStack.map((val, i) => (
                  <div key={i} className="w-full py-2 rounded-xl bg-[#5C4E49] text-white font-mono font-bold text-xs">{val}</div>
                ))}
              </div>
              {/* Out Stack */}
              <div className="bg-[#331921] border-2 border-[#5C4E49] rounded-3xl p-5 min-h-[200px] flex flex-col-reverse items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#AB526B]">Out-Stack (Pop Target)</span>
                {outStack.map((val, i) => (
                  <div key={i} className="w-full py-2 rounded-xl bg-[#AB526B] text-white font-mono font-bold text-xs">{val}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. BFS TRAVERSAL CANVAS */}
        {activeAlgo === 'bfs' && (
          <div className="w-full max-w-3xl space-y-6 text-center">
            <h3 className="text-lg font-mono font-bold text-[#FAF7F2]">Breadth-First Search (BFS Queue)</h3>
            <div className="bg-[#331921] border-2 border-[#5C4E49] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs font-mono text-[#BCA297]">Frontier Queue:</span>
                {bfsQueue.map((n) => (
                  <span key={n} className="px-3 py-1 rounded-lg bg-[#AB526B] text-white font-mono font-bold text-xs">{n}</span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-mono text-[#BCA297]">Level Order Output:</span>
                {bfsOrder.map((n) => (
                  <span key={n} className="px-2.5 py-1 rounded-lg bg-[#C5CEAE] text-[#333] font-mono font-bold text-xs">{n}</span>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </ResponsiveVisualizerShell>
  );
}
