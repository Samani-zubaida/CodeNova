import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Eye, Compass, Layers, CheckCircle2, AlertCircle, ArrowRight,
  ArrowDown, Sparkles, Binary, Check, X, ShieldAlert, Cpu, Hash, Link as LinkIcon, RefreshCw
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';

// Sound synthesizer for hashing & collision events
const playSynthTone = (type = 'hash', isMuted = false) => {
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

    if (type === 'hash') {
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'collision') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'found') {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    }
  } catch (e) {}
};

const MAP_STRATEGIES = [
  { id: 'chaining', name: 'Separate Chaining', badge: 'O(1) avg', desc: 'Linked List Collision Chains' },
  { id: 'linear', name: 'Linear Probing', badge: 'O(1) avg', desc: 'Open Addressing: (h + i) % M' },
  { id: 'quadratic', name: 'Quadratic Probing', badge: 'O(1) avg', desc: 'Open Addressing: (h + i²) % M' },
  { id: 'doubleHashing', name: 'Double Hashing', badge: 'O(1) avg', desc: 'Dual Hash: (h₁ + i·h₂) % M' },
  { id: 'rehash', name: 'Dynamic Resize & Rehash', badge: 'Amortized', desc: 'Auto-Double Table on λ ≥ 0.75' }
];

const CODE_SNIPPETS = {
  chaining: {
    javascript: `class HashMapChaining {
  constructor(size = 7) {
    this.size = size;
    this.buckets = Array.from({ length: size }, () => []);
  }
  hash(key) {
    let h = 0;
    for (let c of String(key)) h = (h * 31 + c.charCodeAt(0)) % this.size;
    return h;
  }
  put(key, value) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const existing = bucket.find(pair => pair.key === key);
    if (existing) existing.value = value;
    else bucket.push({ key, value });
  }
}`,
    python: `class HashMapChaining:
    def __init__(self, size=7):
        self.size = size
        self.buckets = [[] for _ in range(size)]

    def _hash(self, key):
        return hash(key) % self.size

    def put(self, key, value):
        idx = self._hash(key)
        for i, (k, v) in enumerate(self.buckets[idx]):
            if k == key:
                self.buckets[idx][i] = (key, value)
                return
        self.buckets[idx].append((key, value))`,
    cpp: `// C++ Hash Map with Separate Chaining`,
    java: `// Java HashMap Separate Chaining`
  },
  linear: {
    javascript: `// Linear Probing: (h + i) % M
function linearProbe(table, key, value, M) {
  let h = hash(key) % M;
  let i = 0;
  while (table[(h + i) % M] !== null && table[(h + i) % M].key !== key) {
    i++; // Linear search for next empty slot
  }
  table[(h + i) % M] = { key, value };
}`,
    python: `def linear_probe(table, key, value, M):
    h = hash(key) % M
    i = 0
    while table[(h + i) % M] is not None and table[(h + i) % M][0] != key:
        i += 1
    table[(h + i) % M] = (key, value)`,
    cpp: `// C++ Linear Probing Hash Table`,
    java: `// Java Linear Probing Hash Table`
  },
  quadratic: {
    javascript: `// Quadratic Probing: (h + i^2) % M
function quadraticProbe(table, key, value, M) {
  let h = hash(key) % M;
  let i = 0;
  while (table[(h + i * i) % M] !== null && table[(h + i * i) % M].key !== key) {
    i++; // Parabolic step
  }
  table[(h + i * i) % M] = { key, value };
}`,
    python: `def quadratic_probe(table, key, value, M):
    h = hash(key) % M
    i = 0
    while table[(h + i * i) % M] is not None and table[(h + i * i) % M][0] != key:
        i += 1
    table[(h + i * i) % M] = (key, value)`,
    cpp: `// C++ Quadratic Probing`,
    java: `// Java Quadratic Probing`
  },
  doubleHashing: {
    javascript: `// Double Hashing: (h1 + i * h2) % M
function doubleHash(table, key, value, M) {
  const h1 = hash1(key) % M;
  const h2 = 5 - (hash1(key) % 5); // Non-zero step
  let i = 0;
  while (table[(h1 + i * h2) % M] !== null && table[(h1 + i * h2) % M].key !== key) {
    i++;
  }
  table[(h1 + i * h2) % M] = { key, value };
}`,
    python: `def double_hash(table, key, value, M):
    h1 = hash(key) % M
    h2 = 5 - (hash(key) % 5)
    i = 0
    while table[(h1 + i * h2) % M] is not None:
        i += 1
    table[(h1 + i * h2) % M] = (key, value)`,
    cpp: `// C++ Double Hashing`,
    java: `// Java Double Hashing`
  },
  rehash: {
    javascript: `// Rehash when Load Factor >= 0.75
function resizeAndRehash(oldTable) {
  const newCapacity = nextPrime(oldTable.length * 2);
  const newTable = new Array(newCapacity).fill(null);
  for (let item of oldTable) {
    if (item) insertInto(newTable, item.key, item.value);
  }
  return newTable;
}`,
    python: `def rehash(old_table):
    new_cap = next_prime(len(old_table) * 2)
    new_table = [None] * new_cap
    for item in old_table:
        if item: insert(new_table, item[0], item[1])
    return new_table`,
    cpp: `// C++ Hash Map Rehashing`,
    java: `// Java HashMap Rehashing`
  }
};

// Simple polynomial hash function
const computeHash = (key, M) => {
  let hashVal = 0;
  const str = String(key);
  for (let i = 0; i < str.length; i++) {
    hashVal = (hashVal * 31 + str.charCodeAt(i)) % M;
  }
  return hashVal;
};

export default function MapVisualizer() {
  const [strategy, setStrategy] = useState('chaining');
  const [tableSize, setTableSize] = useState(7);

  // Inputs
  const [inputKey, setInputKey] = useState('apple');
  const [inputVal, setInputVal] = useState('42');
  const [lookupKey, setLookupKey] = useState('');

  // Table states
  // Chaining: array of arrays: [[{key, value}], ...]
  const [chainTable, setChainTable] = useState([
    [{ key: 'cat', value: '10' }],
    [],
    [{ key: 'apple', value: '42' }, { key: 'banana', value: '88' }],
    [],
    [{ key: 'dog', value: '35' }],
    [],
    []
  ]);

  // Open Addressing: array of objects: [{ key, value, status: 'occupied' | 'tombstone' } | null]
  const [openTable, setOpenTable] = useState([
    { key: 'cat', value: '10', status: 'occupied' },
    null,
    { key: 'apple', value: '42', status: 'occupied' },
    { key: 'banana', value: '88', status: 'occupied' },
    { key: 'dog', value: '35', status: 'occupied' },
    null,
    null
  ]);

  // Active highlights
  const [highlightSlot, setHighlightSlot] = useState(null);
  const [probeTrail, setProbeTrail] = useState([]);
  const [collisionCount, setCollisionCount] = useState(0);

  // Playback & Step tracking for rehash demo
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [logs, setLogs] = useState(['> Hash Map Visualizer initialized. Ready for operations.']);

  // ELI5 Explanation State
  const [explanation, setExplanation] = useState({
    action: "Hash Map Ready (Key-Value Dictionary)",
    intuition: "Keys are mapped to bucket slots via hash(key) % M in O(1) average time.",
    next: "Put new key-value pair or Lookup existing key."
  });

  // Track active variables
  const [activeVariables, setActiveVariables] = useState({
    strategy: 'chaining',
    tableSize: 7,
    itemCount: 4,
    loadFactor: (4 / 7).toFixed(2),
    threshold: 0.75
  });

  const [activeLine, setActiveLine] = useState(1);
  const [currentCodeSnippet, setCurrentCodeSnippet] = useState(CODE_SNIPPETS.chaining);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 49)]);
  };

  // Sync mode changes
  useEffect(() => {
    setCurrentCodeSnippet(CODE_SNIPPETS[strategy] || CODE_SNIPPETS.chaining);
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIdx(0);
    setHighlightSlot(null);
    setProbeTrail([]);
    addLog(`> Switched collision strategy to ${MAP_STRATEGIES.find(s => s.id === strategy)?.name}.`);

    if (strategy === 'chaining') {
      const count = chainTable.reduce((acc, b) => acc + b.length, 0);
      setActiveVariables({
        strategy: 'Separate Chaining',
        tableSize,
        itemCount: count,
        loadFactor: (count / tableSize).toFixed(2),
        collisionResolution: 'Linked Buckets'
      });
      setExplanation({
        action: "Separate Chaining Collision Resolution",
        intuition: "Colliding keys share the same slot by chaining as a linked list.",
        next: "Put a key that collides to see chain link extension."
      });
    } else if (['linear', 'quadratic', 'doubleHashing'].includes(strategy)) {
      const count = openTable.filter(item => item && item.status === 'occupied').length;
      setActiveVariables({
        strategy: MAP_STRATEGIES.find(s => s.id === strategy)?.name,
        tableSize,
        itemCount: count,
        loadFactor: (count / tableSize).toFixed(2),
        collisionResolution: 'Open Addressing'
      });
      setExplanation({
        action: `${MAP_STRATEGIES.find(s => s.id === strategy)?.name} Active`,
        intuition: "Open addressing stores all items directly in the table. Collisions probe subsequent slots.",
        next: "Put a key to watch jump probing sequence."
      });
    } else if (strategy === 'rehash') {
      buildRehashDemo();
    }
  }, [strategy, tableSize]);

  // =========================================================================
  // OPERATION 1: PUT (INSERT / UPDATE)
  // =========================================================================
  const handlePut = () => {
    if (!inputKey.trim()) return;
    const key = inputKey.trim();
    const val = inputVal.trim() || '1';

    playSynthTone('hash', isMuted);
    const initialHash = computeHash(key, tableSize);

    if (strategy === 'chaining') {
      const newTable = [...chainTable];
      const bucket = [...newTable[initialHash]];
      const existingIdx = bucket.findIndex(p => p.key === key);

      let hadCollision = false;
      if (existingIdx !== -1) {
        bucket[existingIdx] = { key, value: val };
        addLog(`> UPDATED: Key '${key}' in bucket [${initialHash}] updated to value '${val}'.`);
      } else {
        if (bucket.length > 0) {
          hadCollision = true;
          playSynthTone('collision', isMuted);
          setCollisionCount(c => c + 1);
          addLog(`⚡ COLLISION: Bucket [${initialHash}] already has ${bucket.length} item(s)! Chaining '${key}'.`);
        }
        bucket.push({ key, value: val });
        addLog(`> PUT: Key '${key}' added to bucket [${initialHash}].`);
      }

      newTable[initialHash] = bucket;
      setChainTable(newTable);
      setHighlightSlot(initialHash);

      const totalItems = newTable.reduce((acc, b) => acc + b.length, 0);
      setActiveVariables({
        key,
        hashValue: initialHash,
        bucketSlot: initialHash,
        chainLength: bucket.length,
        itemCount: totalItems,
        loadFactor: (totalItems / tableSize).toFixed(2)
      });
      setActiveLine(12);

      setExplanation({
        action: hadCollision ? `Collision chained at slot [${initialHash}]` : `Inserted '${key}' into slot [${initialHash}]`,
        intuition: `hash('${key}') % ${tableSize} = ${initialHash}. ${hadCollision ? 'Linked to collision list.' : 'Bucket was empty.'}`,
        next: "Key-value pair is stored and ready for O(1) lookup."
      });

      setTimeout(() => setHighlightSlot(null), 800);
    } else {
      // Open Addressing (Linear, Quadratic, Double Hashing)
      const newTable = [...openTable];
      const trail = [];
      let i = 0;
      let placedIdx = -1;

      while (i < tableSize) {
        let slot;
        if (strategy === 'linear') {
          slot = (initialHash + i) % tableSize;
        } else if (strategy === 'quadratic') {
          slot = (initialHash + i * i) % tableSize;
        } else {
          // Double Hashing
          const h2 = 5 - (initialHash % 5);
          slot = (initialHash + i * h2) % tableSize;
        }

        trail.push(slot);

        if (newTable[slot] === null || newTable[slot].status === 'tombstone' || newTable[slot].key === key) {
          placedIdx = slot;
          newTable[slot] = { key, value: val, status: 'occupied' };
          break;
        }

        playSynthTone('collision', isMuted);
        setCollisionCount(c => c + 1);
        i++;
      }

      setProbeTrail(trail);

      if (placedIdx !== -1) {
        setOpenTable(newTable);
        setHighlightSlot(placedIdx);
        addLog(`> OPEN PUT: Placed '${key}' at slot [${placedIdx}] after ${i} probe(s).`);

        const totalItems = newTable.filter(item => item && item.status === 'occupied').length;
        setActiveVariables({
          key,
          initialHash,
          probeSteps: i,
          finalSlot: placedIdx,
          probeSequence: trail.join(' ➔ '),
          loadFactor: (totalItems / tableSize).toFixed(2)
        });
        setActiveLine(8);

        setExplanation({
          action: i > 0 ? `Resolved collision after ${i} probe jumps` : `Placed '${key}' in primary slot [${placedIdx}]`,
          intuition: `Probing checked slots [${trail.join(' ➔ ')}] until finding an open cell.`,
          next: "Slot is now marked as OCCUPIED."
        });
      } else {
        addLog(`⚠️ Table Full! Cannot insert '${key}'.`);
      }

      setTimeout(() => {
        setHighlightSlot(null);
        setProbeTrail([]);
      }, 1000);
    }
  };

  // =========================================================================
  // OPERATION 2: LOOKUP
  // =========================================================================
  const handleLookup = () => {
    if (!lookupKey.trim()) return;
    const key = lookupKey.trim();
    const initialHash = computeHash(key, tableSize);

    if (strategy === 'chaining') {
      const bucket = chainTable[initialHash];
      const match = bucket.find(p => p.key === key);

      setHighlightSlot(initialHash);
      if (match) {
        playSynthTone('found', isMuted);
        addLog(`🔍 FOUND: Key '${key}' in bucket [${initialHash}] with value '${match.value}'.`);
        setActiveVariables({ searchKey: key, status: 'FOUND', value: match.value, slot: initialHash });
        setExplanation({
          action: `Found Key '${key}' in Bucket [${initialHash}]`,
          intuition: `hash('${key}') pointed straight to bucket [${initialHash}]. Linear chain scan found value '${match.value}'.`,
          next: "Lookup completed in O(chain length) time."
        });
      } else {
        playSynthTone('collision', isMuted);
        addLog(`❌ NOT FOUND: Key '${key}' is not present in bucket [${initialHash}].`);
        setActiveVariables({ searchKey: key, status: 'NOT_FOUND', slot: initialHash });
        setExplanation({
          action: `Key '${key}' Not Found`,
          intuition: `Bucket [${initialHash}] was examined, but key does not exist in chain.`,
          next: "Return null / undefined."
        });
      }
      setTimeout(() => setHighlightSlot(null), 900);
    } else {
      // Open Addressing Lookup
      const trail = [];
      let i = 0;
      let found = false;
      let foundIdx = -1;

      while (i < tableSize) {
        let slot;
        if (strategy === 'linear') slot = (initialHash + i) % tableSize;
        else if (strategy === 'quadratic') slot = (initialHash + i * i) % tableSize;
        else slot = (initialHash + i * (5 - (initialHash % 5))) % tableSize;

        trail.push(slot);

        if (openTable[slot] === null) {
          break; // Empty slot stops search
        }
        if (openTable[slot].status === 'occupied' && openTable[slot].key === key) {
          found = true;
          foundIdx = slot;
          break;
        }
        i++;
      }

      setProbeTrail(trail);
      setHighlightSlot(foundIdx !== -1 ? foundIdx : initialHash);

      if (found) {
        playSynthTone('found', isMuted);
        addLog(`🔍 FOUND: Key '${key}' at slot [${foundIdx}] after ${i} probe(s). Value = '${openTable[foundIdx].value}'.`);
        setActiveVariables({ searchKey: key, status: 'FOUND', slot: foundIdx, probeSteps: i });
      } else {
        playSynthTone('collision', isMuted);
        addLog(`❌ NOT FOUND: Key '${key}' not found after probing slots [${trail.join(', ')}].`);
        setActiveVariables({ searchKey: key, status: 'NOT_FOUND', probesChecked: trail.join(' ➔ ') });
      }

      setTimeout(() => {
        setHighlightSlot(null);
        setProbeTrail([]);
      }, 1000);
    }
  };

  // =========================================================================
  // DEMO 3: DYNAMIC REHASHING ANIMATION
  // =========================================================================
  const buildRehashDemo = () => {
    const oldItems = [
      { key: 'alpha', value: '1' },
      { key: 'beta', value: '2' },
      { key: 'gamma', value: '3' },
      { key: 'delta', value: '4' },
      { key: 'epsilon', value: '5' },
      { key: 'zeta', value: '6' }
    ];

    const oldCap = 7;
    const newCap = 17; // next prime
    const recorded = [];

    // Step 1: Initial state exceeding load factor
    recorded.push({
      action: `Load Factor Alert: 6 items in 7 slots -> λ = ${(6 / 7).toFixed(2)} ≥ 0.75!`,
      intuition: "When load factor crosses 0.75, collision frequency skyrockets. The hash table must allocate double capacity and rehash all keys.",
      next: "Allocate new array of prime capacity 17.",
      table: [
        { key: 'alpha', value: '1' }, { key: 'beta', value: '2' }, null,
        { key: 'gamma', value: '3' }, { key: 'delta', value: '4' },
        { key: 'epsilon', value: '5' }, { key: 'zeta', value: '6' }
      ],
      capacity: 7,
      highlight: null,
      variables: { oldCapacity: 7, itemCount: 6, loadFactor: 0.86, state: 'REHASH_TRIGGERED' },
      line: 3
    });

    // Step 2: Empty enlarged table
    let newT = new Array(newCap).fill(null);
    recorded.push({
      action: `Allocated expanded table with prime capacity M = ${newCap}`,
      intuition: "Using prime table sizes drastically reduces clustering from common key multiples.",
      next: "Rehash each existing key using new modulus % 17.",
      table: [...newT],
      capacity: newCap,
      highlight: null,
      variables: { newCapacity: newCap, itemCount: 0, newLoadFactor: 0.0, state: 'EXPANDED' },
      line: 4
    });

    // Step 3: Rehash each element one by one
    for (let item of oldItems) {
      const newHash = computeHash(item.key, newCap);
      newT[newHash] = item;
      recorded.push({
        action: `Rehashed '${item.key}': hash('${item.key}') % ${newCap} = slot [${newHash}]`,
        intuition: `Modulo changed from % 7 to % ${newCap}. Key distributes to its new slot.`,
        next: "Rehash next key...",
        table: [...newT],
        capacity: newCap,
        highlight: newHash,
        variables: { rehashedKey: item.key, newSlot: newHash, capacity: newCap },
        line: 6
      });
    }

    recorded.push({
      action: `🎉 Dynamic Rehash Complete! New Load Factor = ${(6 / newCap).toFixed(2)}`,
      intuition: "Spacious hash table guarantees average O(1) constant time lookups with minimal collision overhead.",
      next: "Ready for new insertions.",
      table: [...newT],
      capacity: newCap,
      highlight: null,
      variables: { completed: true, capacity: newCap, finalLoadFactor: (6 / newCap).toFixed(2) },
      line: 8
    });

    setSteps(recorded);
    setCurrentStepIdx(0);
    applyRehashStep(recorded[0]);
  };

  const applyRehashStep = (step) => {
    if (!step) return;
    setTableSize(step.capacity);
    setOpenTable(step.table);
    setHighlightSlot(step.highlight);
    setActiveVariables(step.variables);
    setActiveLine(step.line);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  const handlePlayPause = () => {
    if (steps.length === 0) return;
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
      applyRehashStep(steps[0]);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(p => !p);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      const nxt = currentStepIdx + 1;
      setCurrentStepIdx(nxt);
      applyRehashStep(steps[nxt]);
      playSynthTone('hash', isMuted);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      const prev = currentStepIdx - 1;
      setCurrentStepIdx(prev);
      applyRehashStep(steps[prev]);
      playSynthTone('hash', isMuted);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    if (steps.length > 0) applyRehashStep(steps[0]);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && steps.length > 0) {
      timer = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          const nxt = currentStepIdx + 1;
          setCurrentStepIdx(nxt);
          applyRehashStep(steps[nxt]);
          playSynthTone('hash', isMuted);
        } else {
          setIsPlaying(false);
        }
      }, 1000 / playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps, playbackSpeed]);

  // =========================================================================
  // LEFT CONTROLS
  // =========================================================================
  const renderControls = (
    <div className="flex flex-col gap-4 text-xs">
      {/* Strategy Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Collision Resolution Strategy
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {MAP_STRATEGIES.map(s => (
            <button
              key={s.id}
              onClick={() => setStrategy(s.id)}
              className={`flex items-center justify-between p-2 rounded-xl text-left font-bold transition-all border ${
                strategy === s.id
                  ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'bg-white/60 dark:bg-[#141416] border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:border-teal-500/40'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs">{s.name}</span>
                <span className="text-[9px] text-gray-400 font-normal">{s.desc}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400">
                {s.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Insert & Update Controls */}
      {strategy !== 'rehash' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Put (Key, Value)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
              placeholder="Key"
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold"
            />
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Value"
              className="px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold"
            />
          </div>
          <button
            onClick={handlePut}
            className="w-full py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
          >
            <Plus size={14} /> Compute Hash & Put
          </button>
        </div>
      )}

      {/* Lookup Controls */}
      {strategy !== 'rehash' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Lookup Key (Get)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={lookupKey}
              onChange={e => setLookupKey(e.target.value)}
              placeholder="Key to search"
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold"
            />
            <button
              onClick={handleLookup}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-all"
            >
              Get
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
      {/* 1. Auxiliary HUD: Hash Function & Metrics */}
      <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-teal-500/20 shadow-xs flex flex-col gap-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Hash Metrics & Load Factor
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/10 text-teal-600">
            M = {tableSize}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 flex flex-col">
            <span className="text-[10px] text-gray-400">Load Factor (λ):</span>
            <span className="text-base font-bold text-teal-500">{activeVariables.loadFactor || '0.00'}</span>
          </div>
          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 flex flex-col">
            <span className="text-[10px] text-gray-400">Collisions Count:</span>
            <span className="text-base font-bold text-amber-500">{collisionCount}</span>
          </div>
        </div>

        {probeTrail.length > 0 && (
          <div className="text-[11px] font-mono text-gray-600 dark:text-gray-400">
            Probe Sequence: <strong className="text-amber-500">{probeTrail.join(' ➔ ')}</strong>
          </div>
        )}
      </div>

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
        title={`${MAP_STRATEGIES.find(s => s.id === strategy)?.name} Source`}
      />
    </div>
  );

  // =========================================================================
  // CENTER CANVAS STAGE
  // =========================================================================
  return (
    <ResponsiveVisualizerShell
      title="Hash Map & Collision Resolution Studio"
      subtitle="Separate Chaining, Open Addressing (Linear, Quadratic, Double Hashing) & Dynamic Rehashing"
      currentPath="/visualizer/map"
      category="ds"
      controls={renderControls}
      playback={
        strategy === 'rehash' ? (
          <VisualizerPlaybackBar
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onStepForward={handleStepForward}
            onStepBack={handleStepBackward}
            onReset={handleReset}
            speed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            currentStep={currentStepIdx}
            totalSteps={steps.length}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => setIsVoiceEnabled(v => !v)}
          />
        ) : null
      }
      rightPanel={renderRightPanel}
      consoleOutput={logs}
    >
      <div className="flex-1 flex flex-col p-3 sm:p-5 overflow-hidden w-full h-full">
        {/* Dynamic Center Stage Canvas (HERO & UNOBSTRUCTED) */}
        {/* CASE 1: SEPARATE CHAINING */}
        {strategy === 'chaining' && (
          <div className="flex-1 w-full h-full min-h-[560px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-start relative shadow-2xl gap-4 overflow-y-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
              Bucket Array Slots with Collision Linked Chains
            </span>

            <div className="flex flex-col gap-2.5">
              {chainTable.map((bucket, slotIdx) => {
                const isTarget = highlightSlot === slotIdx;

                return (
                  <div key={slotIdx} className="flex items-center gap-2">
                    {/* Bucket Slot Cell */}
                    <motion.div
                      animate={{ scale: isTarget ? 1.05 : 1 }}
                      className={`w-14 h-11 rounded-xl font-mono flex flex-col items-center justify-center border text-xs font-black transition-all ${
                        isTarget
                          ? 'bg-amber-500 text-black border-amber-300 ring-2 ring-amber-400 shadow-md'
                          : bucket.length > 0
                          ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/40'
                          : 'bg-black/5 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <span className="text-[9px] opacity-60">Slot</span>
                      <span>[{slotIdx}]</span>
                    </motion.div>

                    {/* Arrow to Linked Chain */}
                    <ArrowRight size={14} className="text-gray-300 dark:text-white/20" />

                    {/* Linked List Chain Nodes */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <AnimatePresence>
                        {bucket.map((pair, pIdx) => (
                          <motion.div
                            key={pair.key}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/15 shadow-xs flex items-center gap-1.5 font-mono text-xs"
                          >
                            <span className="font-bold text-teal-600 dark:text-teal-400">{pair.key}:</span>
                            <span className="text-gray-800 dark:text-gray-200">{pair.value}</span>
                            {pIdx < bucket.length - 1 && (
                              <ArrowRight size={12} className="text-gray-400 ml-1" />
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {bucket.length === 0 && (
                        <span className="text-[11px] font-mono text-gray-400 italic">null (empty)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CASE 2: OPEN ADDRESSING (LINEAR, QUADRATIC, DOUBLE HASHING, REHASH) */}
        {strategy !== 'chaining' && (
          <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center relative shadow-inner gap-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Contiguous Hash Table Slots ({openTable.length} Cells)
            </span>

            <div className="flex items-center gap-2 flex-wrap justify-center max-w-3xl">
              {openTable.map((item, idx) => {
                const isTarget = highlightSlot === idx;
                const isProbed = probeTrail.includes(idx);
                const isOccupied = item && item.status === 'occupied';

                return (
                  <motion.div
                    key={idx}
                    animate={{ scale: isTarget ? 1.15 : 1 }}
                    className={`w-16 h-20 rounded-2xl border flex flex-col items-center justify-between p-2 font-mono transition-all ${
                      isTarget
                        ? 'bg-amber-500 text-black border-amber-300 ring-2 ring-amber-400 shadow-lg'
                        : isProbed
                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/50'
                        : isOccupied
                        ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/40'
                        : 'bg-black/5 dark:bg-white/5 border-dashed border-gray-200 dark:border-white/10 text-gray-400'
                    }`}
                  >
                    <span className="text-[9px] opacity-60">[{idx}]</span>
                    {isOccupied ? (
                      <>
                        <span className="text-xs font-black truncate max-w-[50px]">{item.key}</span>
                        <span className="text-[10px] opacity-75">{item.value}</span>
                      </>
                    ) : (
                      <span className="text-xs italic text-gray-400 my-auto">null</span>
                    )}
                    <span className="text-[7px] uppercase font-sans font-bold">
                      {isOccupied ? 'OCCUPIED' : 'FREE'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ResponsiveVisualizerShell>
  );
}
