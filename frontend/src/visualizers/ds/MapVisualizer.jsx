import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Search, Compass, Layers, Hash, CheckCircle
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';

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
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'found') {
      osc.frequency.setValueAtTime(580, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {}
};

const CODE_SNIPPETS = {
  javascript: `// Hash Map Implementation (Separate Chaining)
class HashMap {
  constructor(size = 8) {
    this.buckets = Array(size).fill(null).map(() => []);
    this.size = size;
  }
  
  hash(key) {
    let sum = 0;
    for (let char of String(key)) sum += char.charCodeAt(0);
    return sum % this.size;
  }
  
  // Put O(1) avg
  put(key, value) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const existing = bucket.find(item => item.key === key);
    if (existing) existing.value = value;
    else bucket.push({ key, value });
  }
  
  // Get O(1) avg
  get(key) {
    const idx = this.hash(key);
    const item = this.buckets[idx].find(i => i.key === key);
    return item ? item.value : undefined;
  }
}`,
  python: `# Hash Table with Chaining in Python
class HashMap:
    def __init__(self, size=8):
        self.size = size
        self.buckets = [[] for _ in range(size)]
        
    def _hash(self, key):
        return sum(ord(c) for c in str(key)) % self.size
        
    def put(self, key, value):
        idx = self._hash(key)
        for item in self.buckets[idx]:
            if item[0] == key:
                item[1] = value
                return
        self.buckets[idx].append([key, value])`,
  cpp: `// C++ Hash Map with std::vector buckets
#include <vector>
#include <string>

struct Entry { std::string key; int val; };
std::vector<std::vector<Entry>> buckets(8);

int hashKey(const std::string& key) {
    int sum = 0;
    for (char c : key) sum += c;
    return sum % 8;
}`,
  java: `// Java Hash Map Concept
public class HashMap {
    private LinkedList<Entry>[] buckets = new LinkedList[8];
    
    private int hash(String key) {
        int sum = 0;
        for (char c : key.toCharArray()) sum += c;
        return sum % buckets.length;
    }
}`
};

export default function MapVisualizer() {
  const [bucketCount] = useState(7);
  // Buckets: array of arrays for separate chaining
  const [buckets, setBuckets] = useState(() => {
    const initial = Array(7).fill(null).map(() => []);
    initial[1].push({ key: 'apple', val: '$1.50' });
    initial[3].push({ key: 'banana', val: '$0.75' });
    initial[3].push({ key: 'cherry', val: '$3.00' });
    initial[5].push({ key: 'date', val: '$4.20' });
    return initial;
  });

  const [inputKey, setInputKey] = useState('grape');
  const [inputVal, setInputVal] = useState('$2.50');
  const [searchKey, setSearchKey] = useState('cherry');
  const [activeBucket, setActiveBucket] = useState(null);
  const [hashFormula, setHashFormula] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [logs, setLogs] = useState(['> Hash Map ready (Size: 7 buckets).']);

  const [currentExplanation, setCurrentExplanation] = useState({
    action: "Hash Map / Hash Table Ready",
    intuition: "Keys are transformed into array indices via hash(key) = sum(charCodes) % buckets, yielding O(1) average lookup.",
    next: "Put a key-value pair or search by key."
  });
  const [phase, setPhase] = useState('IDLE');
  const [activeLine, setActiveLine] = useState(-1);

  const addLog = (msg) => setLogs(prev => [...prev.slice(-15), msg]);

  // Hash calculation
  const calculateHash = (key) => {
    let sum = 0;
    const chars = [];
    for (let i = 0; i < String(key).length; i++) {
      const code = String(key).charCodeAt(i);
      sum += code;
      chars.push(`'${key[i]}'(${code})`);
    }
    const idx = sum % bucketCount;
    return { idx, formula: `(${chars.join(' + ')}) % ${bucketCount} = ${sum} % ${bucketCount} = Bucket [${idx}]` };
  };

  // Put
  const handlePut = async () => {
    if (!inputKey) return;
    const { idx, formula } = calculateHash(inputKey);
    setHashFormula(formula);
    setActiveBucket(idx);
    setActiveLine(8);

    setCurrentExplanation({
      action: `Computing Hash for key "${inputKey}" ➔ Bucket [${idx}]`,
      intuition: `Hash Function transforms ASCII characters to numeric sum ${formula}.`,
      next: `Placing { ${inputKey}: ${inputVal} } into Bucket ${idx}.`
    });
    setPhase('HASHING');
    playSynthTone('hash', isMuted);

    await new Promise(r => setTimeout(r, 700));

    const newBuckets = buckets.map((b, i) => {
      if (i !== idx) return b;
      const existingIdx = b.findIndex(item => item.key === inputKey);
      if (existingIdx !== -1) {
        const updated = [...b];
        updated[existingIdx] = { key: inputKey, val: inputVal };
        return updated;
      }
      return [...b, { key: inputKey, val: inputVal }];
    });

    setBuckets(newBuckets);
    setCurrentExplanation({
      action: `Stored { ${inputKey}: "${inputVal}" } at Bucket [${idx}]!`,
      intuition: "Separate Chaining handles collisions gracefully by appending entries into the bucket's linked list.",
      next: "Operation complete in O(1) average time."
    });
    setPhase('STORED');
    setActiveLine(15);
    playSynthTone('found', isMuted);
    addLog(`> put("${inputKey}", "${inputVal}"): Stored in Bucket ${idx}`);

    setTimeout(() => {
      setActiveBucket(null);
    }, 1500);
  };

  // Get / Search
  const handleGet = async () => {
    if (!searchKey) return;
    const { idx, formula } = calculateHash(searchKey);
    setHashFormula(formula);
    setActiveBucket(idx);
    setActiveLine(21);

    setCurrentExplanation({
      action: `Searching for key "${searchKey}": Hashing to Bucket [${idx}]`,
      intuition: `Direct indexing: Hash function points directly to Bucket ${idx} without scanning other buckets.`,
      next: `Searching linked chain in Bucket ${idx}.`
    });
    setPhase('SEARCHING');
    playSynthTone('hash', isMuted);

    await new Promise(r => setTimeout(r, 700));

    const bucket = buckets[idx];
    const found = bucket.find(item => item.key === searchKey);

    if (found) {
      setCurrentExplanation({
        action: `MATCH FOUND! Key "${searchKey}" has value: "${found.val}"`,
        intuition: `Retrieved value in O(1) direct lookup from Bucket ${idx}.`,
        next: "Search completed successfully."
      });
      setPhase('FOUND');
      setActiveLine(23);
      playSynthTone('found', isMuted);
      addLog(`> get("${searchKey}"): Found value "${found.val}" in Bucket ${idx}`);
    } else {
      setCurrentExplanation({
        action: `Key "${searchKey}" NOT FOUND in Bucket [${idx}]!`,
        intuition: "Scanned all elements in bucket chain without finding key.",
        next: "Returns undefined."
      });
      setPhase('NOT_FOUND');
      addLog(`> get("${searchKey}"): Not present in hash map.`);
    }

    setTimeout(() => setActiveBucket(null), 1500);
  };

  // Remove
  const handleRemove = (keyToRemove) => {
    const { idx } = calculateHash(keyToRemove);
    const newBuckets = buckets.map((b, i) => {
      if (i !== idx) return b;
      return b.filter(item => item.key !== keyToRemove);
    });
    setBuckets(newBuckets);
    addLog(`> remove("${keyToRemove}"): Removed from Bucket ${idx}`);
    setCurrentExplanation({
      action: `Removed key "${keyToRemove}" from Bucket [${idx}].`,
      intuition: "Unlinked entry from bucket chain.",
      next: "Hash map updated."
    });
    setPhase('REMOVED');
  };

  const handleReset = () => {
    const initial = Array(7).fill(null).map(() => []);
    initial[1].push({ key: 'apple', val: '$1.50' });
    initial[3].push({ key: 'banana', val: '$0.75' });
    initial[3].push({ key: 'cherry', val: '$3.00' });
    initial[5].push({ key: 'date', val: '$4.20' });
    setBuckets(initial);
    setActiveBucket(null);
    setHashFormula('');
    setPhase('IDLE');
    addLog(`> Hash Map reset to default items.`);
  };

  const controlsSlot = (
    <div className="flex flex-col gap-4">
      {/* Put Section */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-teal-500/5 border border-teal-500/20">
        <span className="text-xs font-black text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
          <Plus size={14} /> Put(Key, Value) (O(1) Avg)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={inputKey}
            onChange={e => setInputKey(e.target.value)}
            className="bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
            placeholder="Key (e.g. apple)"
          />
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
            placeholder="Value"
          />
        </div>
        <button
          onClick={handlePut}
          className="py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
        >
          Compute Hash & Put
        </button>
      </div>

      {/* Get / Search Section */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <Search size={14} /> Get(Key) Lookup
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchKey}
            onChange={e => setSearchKey(e.target.value)}
            className="flex-1 bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
            placeholder="Search Key"
          />
          <button
            onClick={handleGet}
            className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Lookup
          </button>
        </div>
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
          <RotateCcw size={12} /> Reset Map
        </button>
      </div>
    </div>
  );

  return (
    <ResponsiveVisualizerShell
      title="Hash Map / Hash Table"
      subtitle="Key-value mapping providing average O(1) constant time insertion, search, and deletion via hash functions."
      currentPath="/visualizer/map"
      category="ds"
      controls={controlsSlot}
      metrics={
        <ComplexityBadge
          timeComplexity={{
            average: "Put: O(1) | Get: O(1) | Delete: O(1)",
            worst: "O(n) Extreme Collision"
          }}
          spaceComplexity={`O(n) - ${bucketCount} Buckets`}
          activeOperation={phase}
          notes="Separate chaining resolves collisions using linked list buckets."
        />
      }
      codeInspector={
        <CodeInspector
          codeSnippets={CODE_SNIPPETS}
          activeLine={activeLine}
          variables={{ activeBucket: activeBucket ?? 'none', formula: hashFormula || 'none' }}
          title="Hash Map Source Logic"
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
                ELI5 Intuition: Hash Function & Buckets
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

          {/* Real-time Hash Formula Bar */}
          {hashFormula && (
            <div className="p-2 rounded-xl bg-black/5 dark:bg-black/40 border border-teal-500/20 text-xs font-mono text-teal-400 flex items-center gap-2 overflow-x-auto">
              <Hash size={14} className="shrink-0 text-teal-500" />
              <span><strong>Hash Math:</strong> {hashFormula}</span>
            </div>
          )}
        </div>

        {/* Visual Buckets & Chaining Layout */}
        <div className="flex-1 min-h-[360px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-3 shadow-inner overflow-y-auto">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Bucket Table (Separate Chaining)
          </span>

          <div className="flex flex-col gap-2.5">
            {buckets.map((chain, bIdx) => {
              const isActive = activeBucket === bIdx;

              return (
                <div
                  key={bIdx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-teal-500/20 border-teal-400 shadow-teal-500/30 ring-2 ring-teal-400'
                      : 'bg-white/80 dark:bg-[#141416] border-gray-200 dark:border-white/10'
                  }`}
                >
                  {/* Bucket Index badge */}
                  <div className={`w-20 h-10 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isActive ? 'bg-teal-500 text-black' : 'bg-black/10 dark:bg-black/40 text-gray-400'
                  }`}>
                    <span>Bucket</span>
                    <span className="text-sm font-black">[{bIdx}]</span>
                  </div>

                  {/* Chained Linked List entries */}
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    {chain.length === 0 ? (
                      <span className="text-xs font-mono text-gray-400 italic">empty (null)</span>
                    ) : (
                      chain.map((item, iIdx) => (
                        <div key={item.key} className="flex items-center gap-2">
                          <motion.div
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="px-3 py-1.5 rounded-lg bg-teal-500/15 border border-teal-500/30 text-xs font-mono flex items-center gap-2 shadow-xs group"
                          >
                            <span className="font-bold text-teal-400">{item.key}</span>
                            <span className="text-gray-400">:</span>
                            <span className="font-black text-white">{item.val}</span>
                            <button
                              onClick={() => handleRemove(item.key)}
                              className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 transition-opacity ml-1"
                              title="Delete entry"
                            >
                              <Trash2 size={12} />
                            </button>
                          </motion.div>
                          {iIdx < chain.length - 1 && (
                            <span className="text-teal-500 text-xs font-mono">➔</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ResponsiveVisualizerShell>
  );
}
