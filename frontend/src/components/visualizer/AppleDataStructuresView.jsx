import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Search, ExternalLink,
  ChevronRight, Sparkles, Layers, Network, Boxes,
  Binary, Cpu, Zap, Sliders, CheckCircle2, X
} from 'lucide-react';

/* ─── Enriched Data Structure Specifications ─── */
const DATA_STRUCTURES_DATA = [
  {
    id: 'array',
    name: 'Array Suite',
    eyebrow: 'CONTIGUOUS PHYSICAL MEMORY',
    sub: '16 Algos',
    path: '/visualizer/array',
    icon: '[ ]',
    family: 'linear',
    accent: '#0071E3',
    accentLight: '#EBF5FF',
    accentBorder: '#B3D7FF',
    desc: 'Contiguous, sequential blocks of memory engineered for instant O(1) random access, hardware cache prefetching, and high-throughput vector transformations.',
    complexity: {
      access: 'O(1)',
      search: 'O(n) / O(log n)',
      insertion: 'O(n)',
      deletion: 'O(n)',
      space: 'O(n)',
    },
    specs: [
      { label: 'Addressing', val: 'Base + i × Size' },
      { label: 'Cache Locality', val: 'L1/L2 Optimal' },
      { label: 'Dynamic Growth', val: 'Amortized 2×' },
      { label: 'Memory Layout', val: 'Physical 1D RAM' },
    ],
    subtopics: [
      { id: 'static_array', name: 'Static 1D Array', tag: 'O(1) Access', desc: 'Fixed-size contiguous memory layout with deterministic addressing.', path: '/visualizer/array/static_array' },
      { id: 'dynamic_array', name: 'Dynamic Array (Vector)', tag: 'Amortized O(1)', desc: 'Geometric capacity doubling with amortized constant-time append.', path: '/visualizer/array/dynamic_array' },
      { id: 'matrix_2d', name: '2D Matrix / Grid', tag: 'Row-Major', desc: 'Multi-dimensional grid mapped into 1D RAM in row-major order.', path: '/visualizer/array/matrix_2d' },
      { id: 'binary_search', name: 'Binary Search', tag: 'O(log n)', desc: 'Logarithmic divide-and-conquer search on sorted sequences.', path: '/visualizer/array/binary_search' },
      { id: 'quick_sort', name: 'Quick Sort', tag: 'O(n log n)', desc: 'Partition-exchange sorting using dual-pivot selection.', path: '/visualizer/array/quick_sort' },
      { id: 'merge_sort', name: 'Merge Sort', tag: 'Stable Sort', desc: 'Stable divide-and-conquer sorting with auxiliary buffers.', path: '/visualizer/array/merge_sort' },
      { id: 'two_sum', name: 'Two Sum (Two Pointers)', tag: 'O(n)', desc: 'Converging opposite pointers to find target sums in linear time.', path: '/visualizer/array/two_sum' },
      { id: 'kadane', name: "Kadane's Algorithm", tag: 'Dynamic Prog.', desc: 'Dynamic programming maximum contiguous subarray tracker.', path: '/visualizer/array/kadane' },
    ],
  },
  {
    id: 'linkedlist',
    name: 'Linked List',
    eyebrow: 'DYNAMIC POINTER CHAIN',
    sub: '5 Operations',
    path: '/visualizer/linkedlist',
    icon: '→',
    family: 'linear',
    accent: '#34C759',
    accentLight: '#E8F9EE',
    accentBorder: '#A6EAC0',
    desc: 'Heap-allocated discrete memory nodes chained together via pointers, offering constant-time insertions at endpoints without array resizing or reallocation penalties.',
    complexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1) Head',
      deletion: 'O(1) Head',
      space: 'O(n)',
    },
    specs: [
      { label: 'Reallocation', val: 'Zero Overhead' },
      { label: 'Pointer Size', val: '8 bytes (64-bit)' },
      { label: 'Head Mutation', val: 'O(1) Instant' },
      { label: 'Topology', val: 'Singly / Doubly' },
    ],
    subtopics: [
      { id: 'singly', name: 'Singly Linked List', tag: 'O(1) Head', desc: 'Forward-pointing node chain with O(1) push and pop at head.', path: '/visualizer/linkedlist' },
      { id: 'doubly', name: 'Doubly Linked List', tag: 'Bidirectional', desc: 'Bidirectional nodes with prev and next pointer links.', path: '/visualizer/linkedlist' },
      { id: 'circular', name: 'Circular Linked List', tag: 'Ring Buffer', desc: 'Continuous ring structure where the tail points back to the head.', path: '/visualizer/linkedlist' },
      { id: 'floyd_cycle', name: "Floyd's Cycle Detection", tag: 'O(1) Space', desc: 'Tortoise and Hare two-pointer cycle detection algorithm.', path: '/visualizer/linkedlist' },
      { id: 'reverse_list', name: 'Reverse Linked List', tag: 'In-Place', desc: 'Iterative and recursive three-pointer list reversal.', path: '/visualizer/linkedlist' },
    ],
  },
  {
    id: 'stack',
    name: 'Stack',
    eyebrow: 'LIFO EXECUTION CHAMBER',
    sub: 'LIFO Structure',
    path: '/visualizer/stack',
    icon: '↑',
    family: 'linear',
    accent: '#FF2D55',
    accentLight: '#FFEBF0',
    accentBorder: '#FFB3C4',
    desc: 'Strict Last-In, First-Out sequence protocol mimicking the CPU hardware call stack, ideal for recursive unwinding, syntax parsing, and undo operations.',
    complexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1) Push',
      deletion: 'O(1) Pop',
      space: 'O(n)',
    },
    specs: [
      { label: 'Protocol', val: 'LIFO Access' },
      { label: 'Top Mutation', val: 'O(1) Constant' },
      { label: 'Hardware Role', val: 'Call Stack' },
      { label: 'Backtracking', val: 'Deterministic' },
    ],
    subtopics: [
      { id: 'array_stack', name: 'Array-Based Stack', tag: 'O(1)', desc: 'Contiguous buffer stack with single pointer top tracking.', path: '/visualizer/stack' },
      { id: 'balanced_parens', name: 'Balanced Parentheses', tag: 'Parser', desc: 'Compiler bracket syntax validation using stack frames.', path: '/visualizer/stack' },
      { id: 'monotonic_stack', name: 'Monotonic Stack', tag: 'O(n)', desc: 'Next greater element resolution via monotonic ordering.', path: '/visualizer/stack' },
      { id: 'min_stack', name: 'Min Stack', tag: 'O(1) Aux', desc: 'Retrieving the absolute minimum element in O(1) constant time.', path: '/visualizer/stack' },
    ],
  },
  {
    id: 'queue',
    name: 'Queue',
    eyebrow: 'FIFO PROCESSING STREAM',
    sub: 'FIFO Structure',
    path: '/visualizer/queue',
    icon: '▶',
    family: 'linear',
    accent: '#5856D6',
    accentLight: '#EFEFFF',
    accentBorder: '#C8C7F7',
    desc: 'First-In, First-Out buffering pipeline providing asynchronous task staging, breadth-first graph explorations, and decoupled event messaging.',
    complexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1) Enqueue',
      deletion: 'O(1) Dequeue',
      space: 'O(n)',
    },
    specs: [
      { label: 'Protocol', val: 'FIFO Access' },
      { label: 'Buffer Type', val: 'Ring / Deque' },
      { label: 'Concurrency', val: 'Producer/Consumer' },
      { label: 'Graph Role', val: 'BFS Breadth' },
    ],
    subtopics: [
      { id: 'linear_queue', name: 'Linear FIFO Queue', tag: 'O(1)', desc: 'FIFO queue with head and tail index tracking.', path: '/visualizer/queue' },
      { id: 'circular_queue', name: 'Circular Queue', tag: 'Ring Modulo', desc: 'Memory-recycling queue utilizing modulo index wrapping.', path: '/visualizer/queue' },
      { id: 'deque', name: 'Double-Ended Queue (Deque)', tag: 'Dual End', desc: 'Push and pop from both front and rear in constant time.', path: '/visualizer/queue' },
      { id: 'priority_queue', name: 'Priority Queue', tag: 'O(log n)', desc: 'Dynamic scheduling with priority-weighted extractions.', path: '/visualizer/queue' },
    ],
  },
  {
    id: 'tree',
    name: 'Tree Suite',
    eyebrow: 'HIERARCHICAL NODE NETWORK',
    sub: '5 Traversals',
    path: '/visualizer/tree',
    icon: '△',
    family: 'nonlinear',
    accent: '#FF9500',
    accentLight: '#FFF5E6',
    accentBorder: '#FFD499',
    desc: 'Hierarchical node graphs maintaining recursive invariants. Binary Search Trees and self-balancing AVL trees provide O(log n) logarithmic search guarantees.',
    complexity: {
      access: 'O(log n)',
      search: 'O(log n)',
      insertion: 'O(log n)',
      deletion: 'O(log n)',
      space: 'O(n)',
    },
    specs: [
      { label: 'BST Invariant', val: 'Left < Root < Right' },
      { label: 'AVL Balance', val: '|Balance Factor| ≤ 1' },
      { label: 'Traversal Modes', val: 'In, Pre, Post, Level' },
      { label: 'Tree Height', val: '⌊log₂ n⌋' },
    ],
    subtopics: [
      { id: 'bst_search', name: 'Binary Search Tree', tag: 'O(log n)', desc: 'Ordered binary tree with left < root < right invariant.', path: '/visualizer/tree' },
      { id: 'avl_tree', name: 'AVL Tree (Rotations)', tag: 'Balanced', desc: 'Self-balancing binary tree using LL/RR/LR/RL rotations.', path: '/visualizer/tree' },
      { id: 'inorder', name: 'In-Order Traversal', tag: 'Sorted Stream', desc: 'Left → Root → Right monotonic sorted retrieval.', path: '/visualizer/tree' },
      { id: 'preorder', name: 'Pre-Order Traversal', tag: 'Serialization', desc: 'Root → Left → Right tree hierarchy cloning and export.', path: '/visualizer/tree' },
      { id: 'level_order', name: 'Level-Order (BFS)', tag: 'Breadth', desc: 'Breadth-first traversal layer by layer using a queue.', path: '/visualizer/tree' },
    ],
  },
  {
    id: 'graph',
    name: 'Graph Suite',
    eyebrow: 'TOPOLOGICAL CONNECTIVITY',
    sub: '8 Algos',
    path: '/visualizer/graph',
    icon: '◎',
    family: 'nonlinear',
    accent: '#AF52DE',
    accentLight: '#F7EDFC',
    accentBorder: '#E2B8F6',
    desc: 'Arbitrary network topologies representing complex pairwise relationships, weighted paths, flow networks, and dependency graphs across vertices and edges.',
    complexity: {
      access: 'O(V + E)',
      search: 'O(V + E)',
      insertion: 'O(1)',
      deletion: 'O(V + E)',
      space: 'O(V + E)',
    },
    specs: [
      { label: 'Representation', val: 'Adjacency List' },
      { label: 'Shortest Path', val: 'Dijkstra / A*' },
      { label: 'Spanning Trees', val: 'Prim & Kruskal' },
      { label: 'Topological', val: 'Kahn / DFS DAG' },
    ],
    subtopics: [
      { id: 'bfs', name: 'Breadth-First Search (BFS)', tag: 'O(V+E)', desc: 'Level-by-level exploration finding unweighted shortest paths.', path: '/visualizer/graph/bfs' },
      { id: 'dfs', name: 'Depth-First Search (DFS)', tag: 'O(V+E)', desc: 'Recursive branch diving with cycle and back-edge detection.', path: '/visualizer/graph/dfs' },
      { id: 'dijkstra', name: "Dijkstra's Algorithm", tag: 'O(E log V)', desc: 'Greedy shortest-path relaxation on non-negative weighted graphs.', path: '/visualizer/graph/dijkstra' },
      { id: 'astar', name: 'A* Pathfinding', tag: 'Heuristic', desc: 'Informed heuristic navigation using Euclidean/Manhattan metrics.', path: '/visualizer/graph/astar' },
      { id: 'prim', name: "Prim's Algorithm", tag: 'MST Greedy', desc: 'Growing minimum spanning tree vertex-by-vertex with priority queue.', path: '/visualizer/graph/prim' },
      { id: 'kruskal', name: "Kruskal's Algorithm", tag: 'DSU / MST', desc: 'Disjoint-set union edge sorting for minimum spanning forest.', path: '/visualizer/graph/kruskal' },
      { id: 'bellman_ford', name: 'Bellman-Ford', tag: 'O(V·E)', desc: 'Edge relaxation capable of detecting negative weight cycles.', path: '/visualizer/graph/bellman_ford' },
      { id: 'topological', name: 'Topological Sort', tag: 'DAG Ordering', desc: 'Linear ordering of vertices for task and build dependency resolution.', path: '/visualizer/graph/topological' },
    ],
  },
  {
    id: 'heap',
    name: 'Binary Heap',
    eyebrow: 'PRIORITY SCHEDULING TREE',
    sub: 'Priority Queue',
    path: '/visualizer/heap',
    icon: '◬',
    family: 'nonlinear',
    accent: '#30B0C7',
    accentLight: '#E8F7FA',
    accentBorder: '#AEE4ED',
    desc: 'Complete binary tree packed contiguously into an array. Guarantees immediate O(1) access to extremal elements with logarithmic maintenance overhead.',
    complexity: {
      access: 'O(1) Top',
      search: 'O(n)',
      insertion: 'O(log n)',
      deletion: 'O(log n)',
      space: 'O(n)',
    },
    specs: [
      { label: 'Array Formula', val: 'Parent=(i-1)/2' },
      { label: 'Child Formula', val: 'Left=2i+1, Right=2i+2' },
      { label: 'Heapify Time', val: 'Linear O(n)' },
      { label: 'Heap Sort', val: 'O(n log n) In-Place' },
    ],
    subtopics: [
      { id: 'min_heap', name: 'Min-Heap', tag: 'O(1) Min', desc: 'Parent invariant is strictly less than or equal to child nodes.', path: '/visualizer/heap' },
      { id: 'max_heap', name: 'Max-Heap', tag: 'O(1) Max', desc: 'Parent invariant is strictly greater than or equal to child nodes.', path: '/visualizer/heap' },
      { id: 'heapify', name: 'Heapify Algorithm', tag: 'O(n) Build', desc: 'Bottom-up sift-down construction of complete binary heap.', path: '/visualizer/heap' },
      { id: 'heap_sort', name: 'Heap Sort', tag: 'In-Place', desc: 'Cache-efficient in-place sorting by repeatedly extracting the root.', path: '/visualizer/heap' },
    ],
  },
  {
    id: 'string',
    name: 'String Engine',
    eyebrow: 'SEQUENTIAL AUTOMATA',
    sub: '4 Algorithms',
    path: '/visualizer/string',
    icon: '" "',
    family: 'text',
    accent: '#FF3B30',
    accentLight: '#FFEBEA',
    accentBorder: '#FFB8B3',
    desc: 'Linear arrays of character bytes paired with pattern matching automata, rolling polynomial hashing, and prefix lookup tables for high-speed text search.',
    complexity: {
      access: 'O(1) Char',
      search: 'O(n + m)',
      insertion: 'O(n)',
      deletion: 'O(n)',
      space: 'O(n + m)',
    },
    specs: [
      { label: 'Encoding', val: 'UTF-8 / ASCII' },
      { label: 'KMP Preprocess', val: 'π Prefix Table' },
      { label: 'Rabin-Karp', val: 'Rolling Hash % p' },
      { label: 'Z-Algorithm', val: 'Longest Common Prefix' },
    ],
    subtopics: [
      { id: 'kmp', name: 'KMP Pattern Matching', tag: 'O(n+m)', desc: 'Knuth-Morris-Pratt search avoiding backtracking via π prefix table.', path: '/visualizer/string' },
      { id: 'rabin_karp', name: 'Rabin-Karp Rolling Hash', tag: 'Hash Match', desc: 'Polynomial checksum rolling window for substring discovery.', path: '/visualizer/string' },
      { id: 'z_algo', name: 'Z-Algorithm', tag: 'O(n+m)', desc: 'Linear-time computation of longest prefix match at every index.', path: '/visualizer/string' },
      { id: 'palindrome', name: 'Longest Palindrome', tag: 'Manacher', desc: 'Center expansion and symmetry optimization for palindromic strings.', path: '/visualizer/string' },
    ],
  },
];

/* ─── Architectural Visual Anatomy Components ─── */
function ArrayAnatomyWidget() {
  const [hoveredIdx, setHoveredIdx] = useState(2);
  const elements = [14, 28, 56, 84, 112, 140, 168, 196];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Physical Memory Allocation (RAM)
        </span>
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#0071E3', fontWeight: 600 }}>
          Base: 0x7FFF0000
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px' }}>
        {elements.map((val, idx) => {
          const isHov = hoveredIdx === idx;
          const address = `0x${(0x7fff0000 + idx * 4).toString(16).toUpperCase().slice(-4)}`;
          return (
            <motion.div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              whileHover={{ scale: 1.05, y: -2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: isHov ? '#0071E3' : '#F5F5F7',
                borderRadius: '10px',
                padding: '10px 4px',
                border: isHov ? '1.5px solid #0071E3' : '1px solid #E5E5EA',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: isHov ? '#FFFFFF' : '#86868B', marginBottom: '4px' }}>
                [{idx}]
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: isHov ? '#FFFFFF' : '#1D1D1F' }}>
                {val}
              </span>
              <span style={{ fontSize: '8.5px', fontFamily: 'monospace', color: isHov ? '#E0EFFF' : '#A1A1A6', marginTop: '6px' }}>
                {address}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 14px', background: '#F5F5F7', borderRadius: '10px',
        fontSize: '12px', color: '#1D1D1F',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0071E3' }} />
          <span>Element at index <strong>[{hoveredIdx}]</strong></span>
        </div>
        <span style={{ fontFamily: 'monospace', color: '#0071E3', fontWeight: 600 }}>
          Addr = Base + {hoveredIdx} × 4 = 0x{(0x7fff0000 + hoveredIdx * 4).toString(16).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

function LinkedListAnatomyWidget() {
  const nodes = [
    { val: '42', next: '0x2A' },
    { val: '88', next: '0x58' },
    { val: '19', next: '0x13' },
    { val: '95', next: 'null' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Heap-Allocated Pointer Nodes
        </span>
        <span style={{ fontSize: '11px', color: '#34C759', fontWeight: 600 }}>
          Head Pointer → Node[0]
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <div style={{
              display: 'flex',
              background: '#FFFFFF',
              border: '1.5px solid #34C759',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(52, 199, 89, 0.12)',
              flexShrink: 0,
            }}>
              <div style={{
                padding: '10px 14px',
                background: '#E8F9EE',
                fontWeight: 700,
                fontSize: '14px',
                color: '#1D1D1F',
                borderRight: '1px solid #A6EAC0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '8.5px', color: '#34C759', fontWeight: 600 }}>DATA</span>
                <span>{node.val}</span>
              </div>
              <div style={{
                padding: '10px 10px',
                background: '#FFFFFF',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: node.next === 'null' ? '#FF3B30' : '#86868B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '8.5px', color: '#86868B', fontWeight: 600 }}>NEXT</span>
                <span>{node.next}</span>
              </div>
            </div>
            {i < nodes.length - 1 && (
              <span style={{ color: '#34C759', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>──▶</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 14px', background: '#F5F5F7', borderRadius: '10px',
        fontSize: '12px', color: '#1D1D1F',
      }}>
        <span>Dynamic Heap Mutation</span>
        <span style={{ fontFamily: 'monospace', color: '#34C759', fontWeight: 600 }}>
          New Node Append: O(1) Time, 0 Reallocation
        </span>
      </div>
    </div>
  );
}

function StackAnatomyWidget() {
  const frames = [
    { name: 'evalExpression()', addr: '0x7FFF0040', top: true },
    { name: 'parseToken()', addr: '0x7FFF0030', top: false },
    { name: 'tokenizer()', addr: '0x7FFF0020', top: false },
    { name: 'main()', addr: '0x7FFF0010', top: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Call Stack Chamber (LIFO)
        </span>
        <span style={{ fontSize: '11px', color: '#FF2D55', fontWeight: 600 }}>
          Top Pointer: SP = 0x7FFF0040
        </span>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '5px',
        background: '#F5F5F7', padding: '10px', borderRadius: '14px',
        border: '1px solid #E5E5EA',
      }}>
        {frames.map((frame, i) => (
          <div
            key={i}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '9px 14px',
              background: frame.top ? '#FF2D55' : '#FFFFFF',
              color: frame.top ? '#FFFFFF' : '#1D1D1F',
              borderRadius: '8px',
              border: frame.top ? 'none' : '1px solid #E5E5EA',
              boxShadow: frame.top ? '0 4px 12px rgba(255, 45, 85, 0.25)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {frame.top && <span style={{ fontSize: '11px', fontWeight: 800, background: '#FFFFFF', color: '#FF2D55', padding: '1px 6px', borderRadius: '4px' }}>TOP</span>}
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{frame.name}</span>
            </div>
            <span style={{ fontSize: '10.5px', fontFamily: 'monospace', opacity: frame.top ? 0.9 : 0.6 }}>
              {frame.addr}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QueueAnatomyWidget() {
  const items = ['Task #104', 'Task #103', 'Task #102', 'Task #101'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          FIFO Stream Conveyor
        </span>
        <span style={{ fontSize: '11px', color: '#5856D6', fontWeight: 600 }}>
          Continuous Processing Pipeline
        </span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: '#F5F5F7', padding: '12px', borderRadius: '14px',
        border: '1px solid #E5E5EA', overflowX: 'auto',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          color: '#5856D6', fontWeight: 700, fontSize: '11px', flexShrink: 0,
        }}>
          <span>◀ DEQUEUE</span>
          <span style={{ fontSize: '9px', color: '#86868B' }}>(Front)</span>
        </div>

        {items.map((task, i) => (
          <div
            key={i}
            style={{
              padding: '10px 14px',
              background: i === 0 ? '#5856D6' : '#FFFFFF',
              color: i === 0 ? '#FFFFFF' : '#1D1D1F',
              borderRadius: '10px',
              border: i === 0 ? 'none' : '1px solid #E5E5EA',
              fontWeight: 600,
              fontSize: '12.5px',
              flexShrink: 0,
              boxShadow: i === 0 ? '0 4px 12px rgba(88, 86, 214, 0.25)' : 'none',
            }}
          >
            {task}
          </div>
        ))}

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          color: '#5856D6', fontWeight: 700, fontSize: '11px', flexShrink: 0,
        }}>
          <span>◀ ENQUEUE</span>
          <span style={{ fontSize: '9px', color: '#86868B' }}>(Rear)</span>
        </div>
      </div>
    </div>
  );
}

function TreeAnatomyWidget() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Balanced Binary Search Hierarchy
        </span>
        <span style={{ fontSize: '11px', color: '#FF9500', fontWeight: 600 }}>
          Height h = ⌊log₂ n⌋ = 2
        </span>
      </div>

      <svg width="280" height="130" viewBox="0 0 280 130" style={{ overflow: 'visible' }}>
        {/* Branches */}
        <line x1="140" y1="24" x2="70" y2="68" stroke="#FF9500" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="140" y1="24" x2="210" y2="68" stroke="#FF9500" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="70" y1="68" x2="35" y2="108" stroke="#E5E5EA" strokeWidth="1.5" />
        <line x1="70" y1="68" x2="105" y2="108" stroke="#E5E5EA" strokeWidth="1.5" />
        <line x1="210" y1="68" x2="175" y2="108" stroke="#E5E5EA" strokeWidth="1.5" />
        <line x1="210" y1="68" x2="245" y2="108" stroke="#E5E5EA" strokeWidth="1.5" />

        {/* Root Node */}
        <circle cx="140" cy="24" r="16" fill="#FF9500" />
        <text x="140" y="29" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">50</text>

        {/* Level 1 Nodes */}
        <circle cx="70" cy="68" r="14" fill="#FFFFFF" stroke="#FF9500" strokeWidth="2" />
        <text x="70" y="72" textAnchor="middle" fill="#1D1D1F" fontSize="10.5" fontWeight="bold">25</text>

        <circle cx="210" cy="68" r="14" fill="#FFFFFF" stroke="#FF9500" strokeWidth="2" />
        <text x="210" y="72" textAnchor="middle" fill="#1D1D1F" fontSize="10.5" fontWeight="bold">75</text>

        {/* Level 2 Leaves */}
        <circle cx="35" cy="108" r="12" fill="#F5F5F7" stroke="#D2D2D7" strokeWidth="1" />
        <text x="35" y="112" textAnchor="middle" fill="#6E6E73" fontSize="9.5">12</text>

        <circle cx="105" cy="108" r="12" fill="#F5F5F7" stroke="#D2D2D7" strokeWidth="1" />
        <text x="105" y="112" textAnchor="middle" fill="#6E6E73" fontSize="9.5">37</text>

        <circle cx="175" cy="108" r="12" fill="#F5F5F7" stroke="#D2D2D7" strokeWidth="1" />
        <text x="175" y="112" textAnchor="middle" fill="#6E6E73" fontSize="9.5">62</text>

        <circle cx="245" cy="108" r="12" fill="#F5F5F7" stroke="#D2D2D7" strokeWidth="1" />
        <text x="245" y="112" textAnchor="middle" fill="#6E6E73" fontSize="9.5">87</text>
      </svg>
    </div>
  );
}

function GraphAnatomyWidget() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Network Mesh & Edge Weights
        </span>
        <span style={{ fontSize: '11px', color: '#AF52DE', fontWeight: 600 }}>
          G = (V, E)
        </span>
      </div>

      <svg width="280" height="130" viewBox="0 0 280 130">
        {/* Edges */}
        <line x1="50" y1="40" x2="140" y2="25" stroke="#AF52DE" strokeWidth="2" />
        <line x1="140" y1="25" x2="230" y2="45" stroke="#AF52DE" strokeWidth="2" />
        <line x1="50" y1="40" x2="90" y2="105" stroke="#E5E5EA" strokeWidth="1.5" />
        <line x1="140" y1="25" x2="160" y2="95" stroke="#AF52DE" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="90" y1="105" x2="160" y2="95" stroke="#AF52DE" strokeWidth="2" />
        <line x1="160" y1="95" x2="230" y2="45" stroke="#E5E5EA" strokeWidth="1.5" />

        {/* Weights */}
        <text x="92" y="26" fill="#86868B" fontSize="9" fontWeight="bold">w:4</text>
        <text x="190" y="32" fill="#86868B" fontSize="9" fontWeight="bold">w:2</text>
        <text x="125" y="112" fill="#AF52DE" fontSize="9" fontWeight="bold">w:1 (Min)</text>

        {/* Vertices */}
        <circle cx="50" cy="40" r="14" fill="#FFFFFF" stroke="#AF52DE" strokeWidth="2" />
        <text x="50" y="44" textAnchor="middle" fill="#1D1D1F" fontSize="10" fontWeight="bold">A</text>

        <circle cx="140" cy="25" r="15" fill="#AF52DE" />
        <text x="140" y="29" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="bold">B</text>

        <circle cx="230" cy="45" r="14" fill="#FFFFFF" stroke="#AF52DE" strokeWidth="2" />
        <text x="230" y="49" textAnchor="middle" fill="#1D1D1F" fontSize="10" fontWeight="bold">C</text>

        <circle cx="90" cy="105" r="13" fill="#FFFFFF" stroke="#D2D2D7" strokeWidth="1.5" />
        <text x="90" y="109" textAnchor="middle" fill="#6E6E73" fontSize="9.5" fontWeight="bold">D</text>

        <circle cx="160" cy="95" r="13" fill="#FFFFFF" stroke="#AF52DE" strokeWidth="2" />
        <text x="160" y="99" textAnchor="middle" fill="#AF52DE" fontSize="9.5" fontWeight="bold">E</text>
      </svg>
    </div>
  );
}

function HeapAnatomyWidget() {
  const heapArray = [98, 86, 74, 52, 45, 60];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Max-Heap Array Invariant
        </span>
        <span style={{ fontSize: '11px', color: '#30B0C7', fontWeight: 600 }}>
          Parent ≥ Children
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
        {heapArray.map((val, i) => (
          <div
            key={i}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '8px 2px',
              background: i === 0 ? '#30B0C7' : '#FFFFFF',
              color: i === 0 ? '#FFFFFF' : '#1D1D1F',
              borderRadius: '8px',
              border: i === 0 ? 'none' : '1px solid #E5E5EA',
              boxShadow: i === 0 ? '0 4px 12px rgba(48, 176, 199, 0.25)' : 'none',
            }}
          >
            <span style={{ fontSize: '9px', fontFamily: 'monospace', opacity: i === 0 ? 0.9 : 0.5 }}>[{i}]</span>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>{val}</span>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '9px 12px', background: '#F5F5F7', borderRadius: '8px',
        fontSize: '11px', color: '#1D1D1F',
      }}>
        <span>Root Maximum Element: <strong>[0] = 98</strong></span>
        <span style={{ color: '#30B0C7', fontWeight: 600 }}>Peek Time: O(1) Instant</span>
      </div>
    </div>
  );
}

function StringAnatomyWidget() {
  const chars = ['A', 'L', 'G', 'O', 'V', 'E', 'R', 'S', 'E'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Character Byte Stream & Rolling Window
        </span>
        <span style={{ fontSize: '11px', color: '#FF3B30', fontWeight: 600 }}>
          Pattern π Table Active
        </span>
      </div>

      <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', padding: '4px 0' }}>
        {chars.map((ch, i) => (
          <div
            key={i}
            style={{
              width: '32px', height: '38px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: i >= 4 && i <= 7 ? '#FFEBEA' : '#FFFFFF',
              color: i >= 4 && i <= 7 ? '#FF3B30' : '#1D1D1F',
              border: i >= 4 && i <= 7 ? '1.5px solid #FF3B30' : '1px solid #E5E5EA',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '13px',
              flexShrink: 0,
            }}
          >
            <span>{ch}</span>
            <span style={{ fontSize: '7.5px', fontFamily: 'monospace', opacity: 0.6 }}>{i}</span>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '9px 12px', background: '#F5F5F7', borderRadius: '8px',
        fontSize: '11px', color: '#1D1D1F',
      }}>
        <span>Matched Substring Window: <strong>"VERS"</strong></span>
        <span style={{ color: '#FF3B30', fontWeight: 600 }}>KMP Shifts: O(n+m)</span>
      </div>
    </div>
  );
}

function AnatomyDispatcher({ id }) {
  switch (id) {
    case 'array': return <ArrayAnatomyWidget />;
    case 'linkedlist': return <LinkedListAnatomyWidget />;
    case 'stack': return <StackAnatomyWidget />;
    case 'queue': return <QueueAnatomyWidget />;
    case 'tree': return <TreeAnatomyWidget />;
    case 'graph': return <GraphAnatomyWidget />;
    case 'heap': return <HeapAnatomyWidget />;
    case 'string': return <StringAnatomyWidget />;
    default: return <ArrayAnatomyWidget />;
  }
}

/* ─── Main Apple Data Structures View ─── */
export default function AppleDataStructuresView({ cat, onClose }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('array');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubtopicsModal, setActiveSubtopicsModal] = useState(null);

  // Active Spotlight item
  const activeStructure = useMemo(() => {
    return DATA_STRUCTURES_DATA.find(d => d.id === selectedId) || DATA_STRUCTURES_DATA[0];
  }, [selectedId]);

  // Search filtering across all structures and subtopics
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results = [];

    DATA_STRUCTURES_DATA.forEach(struct => {
      const matchStruct = struct.name.toLowerCase().includes(q) || struct.desc.toLowerCase().includes(q);
      const matchingSub = struct.subtopics.filter(s =>
        s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q)
      );

      if (matchStruct || matchingSub.length > 0) {
        results.push({
          struct,
          matchingSub: matchingSub.length > 0 ? matchingSub : struct.subtopics,
        });
      }
    });

    return results;
  }, [searchQuery]);

  // Families
  const linearStructures = DATA_STRUCTURES_DATA.filter(d => d.family === 'linear');
  const nonlinearStructures = DATA_STRUCTURES_DATA.filter(d => d.family === 'nonlinear');
  const textStructures = DATA_STRUCTURES_DATA.filter(d => d.family === 'text');

  return (
    <motion.div
      key="apple-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: '#F5F5F7',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        overflowY: 'auto',
        color: '#1D1D1F',
      }}
    >
      {/* ── Top Apple Navigation Bar ── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E5EA',
        padding: '14px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        {/* Left: Back button with Apple pill styling */}
        <button
          onClick={() => {
            if (onClose) onClose();
            else navigate('/oop');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#F5F5F7',
            border: '1px solid #E5E5EA',
            borderRadius: '980px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1D1D1F',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E8E8ED'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F5F5F7'; }}
        >
          <ArrowLeft size={14} /> Back to OOP Hub
        </button>

        {/* Center: Apple Catalog Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#86868B',
          }}>
            Algoverse Architecture Catalog
          </span>
          <span style={{ color: '#D2D2D7' }}>•</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            background: '#EBF5FF',
            color: '#0071E3',
            padding: '3px 10px',
            borderRadius: '980px',
          }}>
            8 Core Systems
          </span>
        </div>

        {/* Right: Close button */}
        <button
          onClick={onClose}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#F5F5F7',
            border: '1px solid #E5E5EA',
            color: '#1D1D1F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E8E8ED'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F5F5F7'; }}
        >
          <X size={16} />
        </button>
      </nav>

      {/* ── Main Content Container ── */}
      <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* ── Editorial Header ── */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#0071E3',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            Algorithms & Data Structures
          </p>

          <h1 style={{
            fontSize: 'clamp(36px, 4.8vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: '#1D1D1F',
            margin: '0 0 16px',
          }}>
            The Architecture of Memory.
          </h1>

          <p style={{
            fontSize: '18px',
            lineHeight: 1.5,
            color: '#6E6E73',
            margin: '0 auto 28px',
            fontWeight: 400,
          }}>
            Eight canonical computational architectures engineered for instant O(1) addressing, recursive hierarchies, and deterministic algorithmic throughput.
          </p>

          {/* Quick Apple Search Input */}
          <div style={{
            position: 'relative',
            maxWidth: '520px',
            margin: '0 auto',
          }}>
            <Search size={16} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#86868B' }} />
            <input
              type="text"
              placeholder="Search data structures, algorithms, complexities (e.g. Quick Sort, BFS, AVL)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: '1.5px solid #E5E5EA',
                borderRadius: '980px',
                padding: '14px 44px 14px 46px',
                fontSize: '14px',
                color: '#1D1D1F',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#0071E3'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0,113,227,0.15)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E5EA'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#E5E5EA',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6E6E73',
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* ── If Searching: Render Live Search Results ── */}
        {searchResults ? (
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#1D1D1F' }}>
                Search Results for "{searchQuery}" ({searchResults.reduce((acc, r) => acc + r.matchingSub.length, 0)} algorithms matched)
              </span>
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#0071E3', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E5E5EA' }}>
                <p style={{ fontSize: '16px', color: '#86868B', margin: 0 }}>No algorithms or data structures matched "{searchQuery}".</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {searchResults.map(({ struct, matchingSub }) => (
                  <div
                    key={struct.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1px solid #E5E5EA',
                      padding: '24px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px', background: struct.accentLight, color: struct.accent, padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}>
                          {struct.icon}
                        </span>
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#1D1D1F' }}>{struct.name}</h3>
                          <span style={{ fontSize: '11px', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{struct.eyebrow}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(struct.path)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          background: struct.accent, color: '#FFFFFF',
                          border: 'none', borderRadius: '980px',
                          padding: '8px 18px', fontSize: '13px', fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Launch Suite <ArrowRight size={13} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                      {matchingSub.map(sub => (
                        <div
                          key={sub.id}
                          onClick={() => navigate(sub.path)}
                          style={{
                            padding: '12px 16px',
                            background: '#F5F5F7',
                            borderRadius: '12px',
                            border: '1px solid #E5E5EA',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = struct.accent; e.currentTarget.style.background = '#FFFFFF'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E5EA'; e.currentTarget.style.background = '#F5F5F7'; }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1D1D1F' }}>{sub.name}</span>
                            <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: struct.accent, background: struct.accentLight, padding: '2px 6px', borderRadius: '4px' }}>
                              {sub.tag}
                            </span>
                          </div>
                          <p style={{ fontSize: '11.5px', color: '#6E6E73', margin: 0 }}>{sub.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ── Apple Segmented Structure Dock (Selector) ── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '32px',
            }}>
              {DATA_STRUCTURES_DATA.map(item => {
                const isSelected = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '980px',
                      border: isSelected ? `2px solid ${item.accent}` : '1px solid #E5E5EA',
                      background: isSelected ? '#FFFFFF' : '#FFFFFF',
                      color: isSelected ? '#1D1D1F' : '#6E6E73',
                      fontSize: '13.5px',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.02)',
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isSelected ? item.accent : '#86868B',
                    }}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* ── Apple Spotlight Studio (The Interactive Stage) ── */}
            <motion.div
              key={activeStructure.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: '#FFFFFF',
                borderRadius: '28px',
                border: '1px solid #E5E5EA',
                boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
                padding: '36px',
                marginBottom: '54px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '36px', alignItems: 'center' }}>
                {/* Left: Architecture Specifications */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: activeStructure.accent,
                      background: activeStructure.accentLight,
                      padding: '4px 10px',
                      borderRadius: '980px',
                    }}>
                      {activeStructure.eyebrow}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#86868B' }}>
                      {activeStructure.sub}
                    </span>
                  </div>

                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    color: '#1D1D1F',
                    margin: '0 0 14px',
                    lineHeight: 1.15,
                  }}>
                    {activeStructure.name}
                  </h2>

                  <p style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: '#424245',
                    margin: '0 0 24px',
                  }}>
                    {activeStructure.desc}
                  </p>

                  {/* Tech Specs Matrix */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    marginBottom: '28px',
                  }}>
                    {activeStructure.specs.map((spec, si) => (
                      <div key={si} style={{
                        background: '#F5F5F7',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        border: '1px solid #E5E5EA',
                      }}>
                        <div style={{ fontSize: '10.5px', color: '#86868B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {spec.label}
                        </div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1D1D1F', marginTop: '2px' }}>
                          {spec.val}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => navigate(activeStructure.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: activeStructure.accent,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '980px',
                        padding: '14px 28px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: `0 4px 14px ${activeStructure.accent}40`,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      Open {activeStructure.name} Visualizer <ArrowRight size={15} />
                    </button>

                    <button
                      onClick={() => setActiveSubtopicsModal(activeStructure)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#F5F5F7',
                        color: '#1D1D1F',
                        border: '1px solid #E5E5EA',
                        borderRadius: '980px',
                        padding: '14px 22px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#E8E8ED'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F5F5F7'; }}
                    >
                      View {activeStructure.subtopics.length} Algorithms ↓
                    </button>
                  </div>
                </div>

                {/* Right: Live Interactive Visual Anatomy */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E5E5EA',
                  padding: '28px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '260px',
                }}>
                  <AnatomyDispatcher id={activeStructure.id} />
                </div>
              </div>

              {/* Subtopic Fast-Track Ribbon */}
              <div style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #E5E5EA',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Quick-Launch Specific Algorithms
                  </span>
                  <span style={{ fontSize: '11px', color: activeStructure.accent, fontWeight: 600 }}>
                    Click to launch step visualizer directly
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {activeStructure.subtopics.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => navigate(sub.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#F5F5F7',
                        border: '1px solid #E5E5EA',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#1D1D1F',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = activeStructure.accent;
                        e.currentTarget.style.background = activeStructure.accentLight;
                        e.currentTarget.style.color = activeStructure.accent;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#E5E5EA';
                        e.currentTarget.style.background = '#F5F5F7';
                        e.currentTarget.style.color = '#1D1D1F';
                      }}
                    >
                      <span>{sub.name}</span>
                      <span style={{
                        fontSize: '9.5px',
                        fontFamily: 'monospace',
                        color: activeStructure.accent,
                        background: '#FFFFFF',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        border: `1px solid ${activeStructure.accent}30`,
                      }}>
                        {sub.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Architectural Families (Categorized Bento Flow) ── */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0071E3' }}>
                  Architecture Family 01
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1D1D1F', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                  Linear Memory & Sequence Pipelines
                </h3>
                <p style={{ fontSize: '14px', color: '#6E6E73', margin: 0 }}>
                  Contiguous buffers, pointer linkages, and strict LIFO / FIFO access patterns.
                </p>
              </div>

              {/* Bento Grid: 2 wide + 2 side-by-side */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {linearStructures.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '22px',
                      border: '1px solid #E5E5EA',
                      padding: '26px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                      e.currentTarget.style.borderColor = item.accentBorder;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                      e.currentTarget.style.borderColor = '#E5E5EA';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          background: item.accentLight,
                          color: item.accent,
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontFamily: 'monospace',
                        }}>
                          {item.icon}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: item.accent,
                          background: item.accentLight,
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}>
                          {item.sub}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#1D1D1F', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                        {item.name}
                      </h4>

                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#6E6E73', margin: '0 0 16px' }}>
                        {item.desc}
                      </p>

                      {/* Complexity Pills */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                        {Object.entries(item.complexity).slice(0, 3).map(([k, v]) => (
                          <span key={k} style={{
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            color: '#1D1D1F',
                            background: '#F5F5F7',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #E5E5EA',
                          }}>
                            {k}: <strong>{v}</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F5F5F7' }}>
                      <span style={{ fontSize: '12px', color: '#86868B', fontWeight: 600 }}>
                        {item.subtopics.length} algorithms
                      </span>
                      <button
                        onClick={() => navigate(item.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: item.accent,
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '980px',
                          padding: '7px 16px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Launch <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Family 02: Non-Linear Hierarchies & Networks */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#AF52DE' }}>
                  Architecture Family 02
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1D1D1F', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                  Hierarchical Trees & Topological Networks
                </h3>
                <p style={{ fontSize: '14px', color: '#6E6E73', margin: 0 }}>
                  Logarithmic binary search trees, weighted graph topologies, and priority binary heaps.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {nonlinearStructures.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '22px',
                      border: '1px solid #E5E5EA',
                      padding: '26px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                      e.currentTarget.style.borderColor = item.accentBorder;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                      e.currentTarget.style.borderColor = '#E5E5EA';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          background: item.accentLight,
                          color: item.accent,
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontFamily: 'monospace',
                        }}>
                          {item.icon}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: item.accent,
                          background: item.accentLight,
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}>
                          {item.sub}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#1D1D1F', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                        {item.name}
                      </h4>

                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#6E6E73', margin: '0 0 16px' }}>
                        {item.desc}
                      </p>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                        {Object.entries(item.complexity).slice(0, 3).map(([k, v]) => (
                          <span key={k} style={{
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            color: '#1D1D1F',
                            background: '#F5F5F7',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #E5E5EA',
                          }}>
                            {k}: <strong>{v}</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F5F5F7' }}>
                      <span style={{ fontSize: '12px', color: '#86868B', fontWeight: 600 }}>
                        {item.subtopics.length} algorithms
                      </span>
                      <button
                        onClick={() => navigate(item.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: item.accent,
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '980px',
                          padding: '7px 16px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Launch <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Family 03: Sequential Streams & String Automata */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FF3B30' }}>
                  Architecture Family 03
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1D1D1F', margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                  Character Streams & String Automata
                </h3>
                <p style={{ fontSize: '14px', color: '#6E6E73', margin: 0 }}>
                  Prefix lookup tables, rolling polynomial checksums, and string indexing algorithms.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {textStructures.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '22px',
                      border: '1px solid #E5E5EA',
                      padding: '26px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                      e.currentTarget.style.borderColor = item.accentBorder;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                      e.currentTarget.style.borderColor = '#E5E5EA';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          background: item.accentLight,
                          color: item.accent,
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontFamily: 'monospace',
                        }}>
                          {item.icon}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: item.accent,
                          background: item.accentLight,
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}>
                          {item.sub}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#1D1D1F', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                        {item.name}
                      </h4>

                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#6E6E73', margin: '0 0 16px' }}>
                        {item.desc}
                      </p>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                        {Object.entries(item.complexity).slice(0, 3).map(([k, v]) => (
                          <span key={k} style={{
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            color: '#1D1D1F',
                            background: '#F5F5F7',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #E5E5EA',
                          }}>
                            {k}: <strong>{v}</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F5F5F7' }}>
                      <span style={{ fontSize: '12px', color: '#86868B', fontWeight: 600 }}>
                        {item.subtopics.length} algorithms
                      </span>
                      <button
                        onClick={() => navigate(item.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: item.accent,
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '980px',
                          padding: '7px 16px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Launch <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Subtopics Apple Modal / Drawer ── */}
      <AnimatePresence>
        {activeSubtopicsModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0,0,0,0.3)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E5E5EA',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: '32px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: activeSubtopicsModal.accent,
                    background: activeSubtopicsModal.accentLight,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                  }}>
                    {activeSubtopicsModal.sub}
                  </span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 4px', color: '#1D1D1F' }}>
                    {activeSubtopicsModal.name} Algorithms
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#6E6E73', margin: 0 }}>
                    Select an algorithm to jump directly into the step-by-step visualizer.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSubtopicsModal(null)}
                  style={{
                    background: '#F5F5F7',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#6E6E73',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeSubtopicsModal.subtopics.map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setActiveSubtopicsModal(null);
                      navigate(sub.path);
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 18px',
                      background: '#F5F5F7',
                      borderRadius: '14px',
                      border: '1px solid #E5E5EA',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = activeSubtopicsModal.accent;
                      e.currentTarget.style.background = '#FFFFFF';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#E5E5EA';
                      e.currentTarget.style.background = '#F5F5F7';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1D1D1F' }}>{sub.name}</span>
                        <span style={{
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          color: activeSubtopicsModal.accent,
                          background: activeSubtopicsModal.accentLight,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}>
                          {sub.tag}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#6E6E73', margin: 0 }}>{sub.desc}</p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: activeSubtopicsModal.accent,
                      fontSize: '12.5px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      Launch <ArrowRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
