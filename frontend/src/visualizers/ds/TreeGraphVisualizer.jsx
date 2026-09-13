import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Compass, Layers, CheckCircle2, AlertCircle, ArrowDown,
  ArrowRight, ArrowLeft, Sparkles, Binary, Check, X, ShieldAlert, Cpu, Hash, Search,
  GitFork, RefreshCw, ZoomIn, ZoomOut, Maximize2, Move, Target, CornerDownRight, ChevronRight,
  ArrowUp, Shuffle, Sliders, Activity, Info, Eye
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';
import { TREE_ALGORITHMS } from './TreeHub';

// Web Audio API Synthesizer for high-precision acoustic feedback
const playSynthTone = (type = 'compare', isMuted = false) => {
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

    if (type === 'compare') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'insert') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'found') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'delete') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'rotate') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    // Audio context restricted until user interaction
  }
};

// Tree node constructor
const createNode = (val, id = null) => ({
  val: Number(val),
  id: id || `node-${val}-${Math.random().toString(36).substr(2, 6)}`,
  left: null,
  right: null,
  height: 1,
  rangeL: null,
  rangeR: null
});

// Deep tree cloner to preserve immutable history for animation snapshots
const cloneTree = (node) => {
  if (!node) return null;
  const copy = createNode(node.val, node.id);
  copy.height = node.height || 1;
  copy.rangeL = node.rangeL;
  copy.rangeR = node.rangeR;
  copy.left = cloneTree(node.left);
  copy.right = cloneTree(node.right);
  return copy;
};

// Flatten tree nodes
const getAllTreeNodes = (root) => {
  if (!root) return [];
  const list = [];
  const q = [root];
  while (q.length > 0) {
    const curr = q.shift();
    list.push(curr);
    if (curr.left) q.push(curr.left);
    if (curr.right) q.push(curr.right);
  }
  return list;
};

// Calculate height of node
const getNodeHeight = (node) => (node ? node.height || 1 : 0);

// Calculate balance factor of node (left height - right height)
const getBalanceFactor = (node) => {
  if (!node) return 0;
  return getNodeHeight(node.left) - getNodeHeight(node.right);
};

// Recalculate heights recursively
const updateHeights = (node) => {
  if (!node) return 0;
  node.height = 1 + Math.max(updateHeights(node.left), updateHeights(node.right));
  return node.height;
};

// Fingerprint tree structure to avoid layout recomputations when structure is unchanged
const getTreeFingerprint = (node) => {
  if (!node) return '#';
  return `${node.val}(${getTreeFingerprint(node.left)},${getTreeFingerprint(node.right)})`;
};

// =========================================================================
// PERFORMANCE OPTIMIZED TREE LAYOUT ENGINE
// Computes collision-free coordinates with in-order ordering and level spacing
// =========================================================================
function computeTreeLayout(root, canvasWidth = 960, canvasHeight = 560) {
  if (!root) return { nodes: [], edges: [], ghostSlots: [], bounds: { minX: 0, maxX: 960, minY: 0, maxY: 560 } };

  let inOrderIndex = 0;
  const nodeMap = new Map();

  function assignPositions(node, depth = 0) {
    if (!node) return;
    assignPositions(node.left, depth + 1);
    nodeMap.set(node.id || `${node.val}`, {
      node,
      order: inOrderIndex++,
      depth
    });
    assignPositions(node.right, depth + 1);
  }

  assignPositions(root, 0);

  const totalNodes = Math.max(inOrderIndex, 1);
  const xSpacing = Math.max(68, Math.min(125, (canvasWidth - 160) / totalNodes));
  const ySpacing = 82;
  const startY = 72;
  const centerXOffset = (canvasWidth - (totalNodes - 1) * xSpacing) / 2;

  const placedNodes = [];
  const placedEdges = [];
  const ghostSlots = [];

  function buildGeometry(node) {
    if (!node) return null;
    const info = nodeMap.get(node.id || `${node.val}`);
    const x = Math.round(centerXOffset + info.order * xSpacing);
    const y = Math.round(startY + info.depth * ySpacing);

    const currentNodeObj = {
      val: node.val,
      id: node.id || `node-${node.val}`,
      x,
      y,
      height: node.height || 1,
      rangeL: node.rangeL,
      rangeR: node.rangeR,
      hasLeft: !!node.left,
      hasRight: !!node.right
    };
    placedNodes.push(currentNodeObj);

    // Left child edge or interactive ghost slot
    if (node.left) {
      const leftObj = buildGeometry(node.left);
      if (leftObj) {
        placedEdges.push({
          from: currentNodeObj,
          to: leftObj,
          id: `edge-${node.val}-${node.left.val}`,
          side: 'left'
        });
      }
    } else {
      ghostSlots.push({
        parentVal: node.val,
        parentId: currentNodeObj.id,
        side: 'left',
        x: x - Math.max(30, xSpacing * 0.4),
        y: y + ySpacing * 0.7
      });
    }

    // Right child edge or interactive ghost slot
    if (node.right) {
      const rightObj = buildGeometry(node.right);
      if (rightObj) {
        placedEdges.push({
          from: currentNodeObj,
          to: rightObj,
          id: `edge-${node.val}-${node.right.val}`,
          side: 'right'
        });
      }
    } else {
      ghostSlots.push({
        parentVal: node.val,
        parentId: currentNodeObj.id,
        side: 'right',
        x: x + Math.max(30, xSpacing * 0.4),
        y: y + ySpacing * 0.7
      });
    }

    return currentNodeObj;
  }

  buildGeometry(root);

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  placedNodes.forEach(n => {
    minX = Math.min(minX, n.x - 45);
    maxX = Math.max(maxX, n.x + 45);
    minY = Math.min(minY, n.y - 45);
    maxY = Math.max(maxY, n.y + 45);
  });

  return {
    nodes: placedNodes,
    edges: placedEdges,
    ghostSlots,
    bounds: {
      minX: isFinite(minX) ? minX : 0,
      maxX: isFinite(maxX) ? maxX : canvasWidth,
      minY: isFinite(minY) ? minY : 0,
      maxY: isFinite(maxY) ? maxY : canvasHeight
    }
  };
}

// Simple Stack Diagram for Execution Chamber
function SimpleStackDiagram({ stack = [], activeVal = null }) {
  const items = stack.length > 0 ? stack : [{ val: 'empty', label: 'Stack is Empty' }];

  return (
    <div className="flex flex-col gap-2 p-3 bg-white dark:bg-[#331921] rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400 flex items-center gap-1">
          <Layers size={13} />
          Call Stack (LIFO)
        </span>
        <span className="text-[10px] font-mono text-gray-400">
          Depth: {stack.length}
        </span>
      </div>

      <div className="flex flex-col-reverse gap-1.5 min-h-[140px] max-h-[220px] overflow-y-auto p-2 bg-gray-50 dark:bg-[#423834] rounded-xl border border-dashed border-[#EBE0D3] dark:border-[#5C4E49]">
        {items.map((item, idx) => {
          const isTop = idx === items.length - 1 && stack.length > 0;
          const isActive = item.val === activeVal;
          return (
            <motion.div
              key={`stack-${idx}-${item.val}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between border transition-all ${
                isTop
                  ? 'bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300 font-bold shadow-sm'
                  : isActive
                  ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-[#331921] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-700 dark:text-[#F4EBC3]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">#{idx + 1}</span>
                <span>{item.label || `dfs(${item.val})`}</span>
              </div>
              {isTop && (
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500 text-white font-black">
                  TOP
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Simple Queue Diagram for BFS Chamber
function SimpleQueueDiagram({ queue = [], activeVal = null }) {
  const items = queue.length > 0 ? queue : [{ val: 'empty', label: 'Queue is Empty' }];

  return (
    <div className="flex flex-col gap-2 p-3 bg-white dark:bg-[#331921] rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase text-teal-600 dark:text-[#C5CEAE] flex items-center gap-1">
          <GitFork size={13} />
          BFS Queue (FIFO)
        </span>
        <span className="text-[10px] font-mono text-gray-400">
          Size: {queue.length}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 min-h-[90px] max-h-[160px] overflow-y-auto p-2 bg-gray-50 dark:bg-[#423834] rounded-xl border border-dashed border-[#EBE0D3] dark:border-[#5C4E49]">
        {items.map((item, idx) => {
          const isFront = idx === 0 && queue.length > 0;
          return (
            <motion.div
              key={`queue-${idx}-${item.val}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                isFront
                  ? 'bg-teal-500/20 border-teal-500 text-teal-700 dark:text-[#C5CEAE] font-bold shadow-sm'
                  : 'bg-white dark:bg-[#331921] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-700 dark:text-[#F4EBC3]'
              }`}
            >
              {isFront && (
                <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded bg-teal-500 text-white font-black">
                  FRONT
                </span>
              )}
              <span>{item.label || item.val}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// MAIN TREE VISUALIZER COMPONENT
// =========================================================================
export default function TreeGraphVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const currentAlgo = useMemo(() => {
    return TREE_ALGORITHMS.find(a => a.id === algoId) || TREE_ALGORITHMS[0];
  }, [algoId]);

  const currentPath = `/visualizer/tree/${currentAlgo.id}`;

  // Tree Root State
  const [treeRoot, setTreeRoot] = useState(() => {
    const root = createNode(50);
    root.left = createNode(25);
    root.right = createNode(75);
    root.left.left = createNode(15);
    root.left.right = createNode(35);
    root.right.left = createNode(60);
    root.right.right = createNode(85);
    updateHeights(root);
    return root;
  });

  const allNodes = useMemo(() => getAllTreeNodes(treeRoot), [treeRoot]);

  // Form Inputs
  const [newNodeVal, setNewNodeVal] = useState('42');
  const [selectedParentVal, setSelectedParentVal] = useState('50');
  const [childSide, setChildSide] = useState('left');
  const [searchVal, setSearchVal] = useState('35');
  const [deleteVal, setDeleteVal] = useState('25');
  const [lcaP, setLcaP] = useState('15');
  const [lcaQ, setLcaQ] = useState('35');
  const [segRangeL, setSegRangeL] = useState('1');
  const [segRangeR, setSegRangeR] = useState('4');

  // Canvas Pan & Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Selected Node Card
  const [selectedNode, setSelectedNode] = useState(null);

  // Playback & Animation states
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [traversalOutput, setTraversalOutput] = useState([]);
  const [logs, setLogs] = useState([`> Tree Visualizer ready in [${currentAlgo.name}] mode.`]);
  const [rightPanelTab, setRightPanelTab] = useState('tracker'); // 'tracker' | 'chamber'
  const [diagramTab, setDiagramTab] = useState('stack'); // 'stack' | 'queue'

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-25), msg]);
  };

  const executeSteps = (newSteps) => {
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // Step ticker
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      if (currentStepIdx < steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIdx(prev => prev + 1);
        }, 1100 / speed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps.length, speed]);

  // Audio trigger on step change
  useEffect(() => {
    if (steps.length > 0 && steps[currentStepIdx]) {
      const step = steps[currentStepIdx];
      if (step.sound) {
        playSynthTone(step.sound, isMuted);
      }
    }
  }, [currentStepIdx, steps, isMuted]);

  // Update tree root on final step if changed
  useEffect(() => {
    if (steps.length > 0 && currentStepIdx === steps.length - 1) {
      const lastStep = steps[steps.length - 1];
      if (lastStep.treeSnapshot) {
        setTreeRoot(lastStep.treeSnapshot);
      }
    }
  }, [currentStepIdx, steps]);

  const activeStep = steps[currentStepIdx] || {
    treeSnapshot: treeRoot,
    activeNodeVal: null,
    explanation: { action: "Ready", intuition: `Select an operation or click Play to run ${currentAlgo.name}.` },
    phase: "READY",
    sound: null,
    stack: [],
    queue: [],
    codeStatement: `// Algorithm: ${currentAlgo.name}`
  };

  // Accumulated annotations
  const accumulatedAnnotations = useMemo(() => {
    const map = {};
    for (let i = 0; i <= currentStepIdx && i < steps.length; i++) {
      if (steps[i].nodeAnnotations) {
        Object.assign(map, steps[i].nodeAnnotations);
      }
    }
    return map;
  }, [currentStepIdx, steps]);

  // Layout calculations
  const displayRoot = activeStep.treeSnapshot || treeRoot;
  const { nodes: svgNodes, edges: svgEdges, ghostSlots, bounds } = useMemo(() => {
    return computeTreeLayout(displayRoot, 1000, 560);
  }, [displayRoot]);

  // Auto center tree
  const handleAutoCenter = useCallback(() => {
    if (!canvasRef.current || !bounds) return;
    const cw = canvasRef.current.clientWidth || 900;
    const ch = canvasRef.current.clientHeight || 560;
    const treeW = bounds.maxX - bounds.minX;
    const treeH = bounds.maxY - bounds.minY;
    const scaleX = (cw * 0.85) / Math.max(treeW, 200);
    const scaleY = (ch * 0.82) / Math.max(treeH, 200);
    const optimalScale = Math.min(1.2, Math.max(0.45, Math.min(scaleX, scaleY)));
    const centerX = (cw - treeW * optimalScale) / 2 - bounds.minX * optimalScale;
    const centerY = Math.max(30, (ch - treeH * optimalScale) / 2 - bounds.minY * optimalScale);

    setZoom(optimalScale);
    setPan({ x: centerX, y: centerY });
  }, [bounds]);

  useEffect(() => {
    handleAutoCenter();
  }, [handleAutoCenter]);

  // Smooth mouse drag panning
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.interactive-node') || e.target.closest('input') || e.target.closest('select')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom(prev => Math.max(0.35, Math.min(2.5, prev * zoomFactor)));
  };

  const isQueueMode = currentAlgo.id === 'levelorder' || (activeStep?.queue && activeStep.queue.length > 0);
  const activeDiagram = diagramTab || (isQueueMode ? 'queue' : 'stack');

  // Selected parent node info & occupancy
  const selectedParentNode = useMemo(() => {
    if (!selectedParentVal) return null;
    return allNodes.find(n => n.val === Number(selectedParentVal)) || null;
  }, [allNodes, selectedParentVal]);

  const isSlotOccupied = useMemo(() => {
    if (!selectedParentNode) return false;
    return childSide === 'left' ? !!selectedParentNode.left : !!selectedParentNode.right;
  }, [selectedParentNode, childSide]);

  // =========================================================================
  // ALGORITHM STEP GENERATORS
  // =========================================================================

  // 1. ADD NODE BY PARENT
  const handleAddByParent = (customParent = null, customSide = null, customVal = null) => {
    const parentVal = customParent !== null ? Number(customParent) : Number(selectedParentVal);
    const side = customSide || childSide;
    const val = customVal !== null ? Number(customVal) : Number(newNodeVal);

    if (isNaN(parentVal) || isNaN(val)) return;

    const newSteps = [];
    const cloned = cloneTree(treeRoot);
    const parent = getAllTreeNodes(cloned).find(n => n.val === parentVal);

    if (!parent) {
      addLog(`Error: Parent node [${parentVal}] not found in tree.`);
      return;
    }

    if (side === 'left' && parent.left) {
      addLog(`Notice: Overwriting left child of Node [${parentVal}]`);
    } else if (side === 'right' && parent.right) {
      addLog(`Notice: Overwriting right child of Node [${parentVal}]`);
    }

    // Step 1: Target parent node
    newSteps.push({
      treeSnapshot: cloneTree(cloned),
      activeNodeVal: parent.val,
      explanation: {
        action: `Targeting Parent Node [${parent.val}]`,
        intuition: `Preparing to attach new child with value ${val} on the ${side.toUpperCase()} branch.`
      },
      phase: "LOCATE_PARENT",
      codeStatement: `Node parent = findNode(root, ${parentVal});`,
      sound: 'compare'
    });

    // Step 2: Highlight branch attachment
    const newNode = createNode(val);
    if (side === 'left') parent.left = newNode;
    else parent.right = newNode;
    updateHeights(cloned);

    newSteps.push({
      treeSnapshot: cloneTree(cloned),
      activeNodeVal: val,
      branchEdge: { parentVal: parent.val, childSide: side },
      nodeAnnotations: { [val]: { text: 'NEW +', color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' } },
      explanation: {
        action: `Attached Child [${val}] to ${side.toUpperCase()} of Parent [${parent.val}]`,
        intuition: `Pointer link established: parent.${side} = new Node(${val}). Heights updated.`
      },
      phase: "ATTACH_CHILD",
      codeStatement: `parent.${side} = new Node(${val});`,
      sound: 'insert'
    });

    setTreeRoot(cloned);
    executeSteps(newSteps);
    addLog(`> Added Node [${val}] as ${side} child of [${parentVal}].`);
  };

  // 2. BST INSERTION
  const handleBSTInsert = (customVal = null) => {
    const val = customVal !== null ? Number(customVal) : Number(newNodeVal);
    if (isNaN(val)) return;

    const newSteps = [];
    const cloned = cloneTree(treeRoot);
    const stack = [];

    function insertHelper(node, parent = null) {
      if (!node) {
        const created = createNode(val);
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: val,
          recursionArrow: parent ? { from: parent.val, to: val, label: 'attach' } : null,
          nodeAnnotations: { [val]: { text: 'INSERTED', color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
          explanation: {
            action: `Reached null pointer. Inserted new Node [${val}]!`,
            intuition: `BST Property satisfied: Left < Root < Right.`
          },
          phase: "INSERTED",
          codeStatement: `return new Node(${val});`,
          sound: 'insert'
        });
        return created;
      }

      stack.push({ val: node.val, label: `insert(${node.val})` });

      // Comparison step
      const goLeft = val < node.val;
      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: node.val,
        comparingVal: val,
        recursionArrow: parent ? { from: parent.val, to: node.val, label: 'search' } : null,
        nodeAnnotations: {
          [node.val]: {
            text: goLeft ? `${val} < ${node.val} (Left)` : `${val} > ${node.val} (Right)`,
            color: '#F0E2A4',
            bg: 'rgba(240, 226, 164, 0.25)'
          }
        },
        explanation: {
          action: `Comparing ${val} with Node [${node.val}]`,
          intuition: goLeft
            ? `${val} < ${node.val} → Recurse down into Left subtree.`
            : `${val} >= ${node.val} → Recurse down into Right subtree.`
        },
        phase: "COMPARE",
        codeStatement: goLeft ? `if (${val} < ${node.val}) root.left = insert(root.left, ${val});` : `root.right = insert(root.right, ${val});`,
        sound: 'compare'
      });

      if (goLeft) {
        node.left = insertHelper(node.left, node);
      } else {
        node.right = insertHelper(node.right, node);
      }

      node.height = 1 + Math.max(getNodeHeight(node.left), getNodeHeight(node.right));
      return node;
    }

    const updatedRoot = insertHelper(cloned);
    setTreeRoot(updatedRoot);
    executeSteps(newSteps);
    addLog(`> Inserted Node [${val}] into BST.`);
  };

  // 3. BST SEARCH
  const handleSearch = (customVal = null) => {
    const target = customVal !== null ? Number(customVal) : Number(searchVal);
    if (isNaN(target) || !treeRoot) return;

    const newSteps = [];
    const path = [];

    function searchHelper(node, parent = null) {
      if (!node) {
        newSteps.push({
          treeSnapshot: treeRoot,
          activeNodeVal: null,
          highlightPath: [...path],
          explanation: {
            action: `Reached null reference. Value [${target}] NOT FOUND!`,
            intuition: `Target ${target} is not in the BST.`
          },
          phase: "NOT_FOUND",
          codeStatement: `if (root == null) return false;`,
          sound: 'delete'
        });
        return;
      }

      path.push(node.val);

      if (node.val === target) {
        newSteps.push({
          treeSnapshot: treeRoot,
          activeNodeVal: node.val,
          highlightPath: [...path],
          nodeAnnotations: { [node.val]: { text: 'FOUND! ★', color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.3)' } },
          explanation: {
            action: `Match! Target [${target}] FOUND at Node [${node.val}]!`,
            intuition: `Target matches current node value. Search terminates in O(h) time.`
          },
          phase: "FOUND",
          codeStatement: `if (root.val == ${target}) return true;`,
          sound: 'found'
        });
        return;
      }

      const goLeft = target < node.val;
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        comparingVal: target,
        highlightPath: [...path],
        recursionArrow: parent ? { from: parent.val, to: node.val, label: 'search' } : null,
        nodeAnnotations: {
          [node.val]: {
            text: goLeft ? `${target} < ${node.val} (Left)` : `${target} > ${node.val} (Right)`,
            color: '#F0E2A4',
            bg: 'rgba(240, 226, 164, 0.25)'
          }
        },
        explanation: {
          action: `Inspect Node [${node.val}]: ${target} ${goLeft ? '<' : '>'} ${node.val}`,
          intuition: goLeft ? `Recurse into left subtree.` : `Recurse into right subtree.`
        },
        phase: "SEARCH_COMPARE",
        codeStatement: goLeft ? `return search(root.left, ${target});` : `return search(root.right, ${target});`,
        sound: 'compare'
      });

      if (goLeft) searchHelper(node.left, node);
      else searchHelper(node.right, node);
    }

    searchHelper(treeRoot);
    executeSteps(newSteps);
    addLog(`> Searched for Node [${target}] in BST.`);
  };

  // 4. BST DELETE
  const handleDelete = (targetVal = null) => {
    const key = targetVal !== null ? Number(targetVal) : Number(deleteVal);
    if (isNaN(key) || !treeRoot) return;

    const newSteps = [];
    const cloned = cloneTree(treeRoot);

    function findMin(node) {
      let curr = node;
      while (curr && curr.left) curr = curr.left;
      return curr;
    }

    function deleteHelper(root, target, parent = null) {
      if (!root) {
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: null,
          explanation: { action: `Value [${target}] not found to delete.`, intuition: "Search completed without match." },
          phase: "DELETE_FAILED",
          codeStatement: `if (root == null) return null;`,
          sound: 'compare'
        });
        return null;
      }

      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: root.val,
        comparingVal: target,
        recursionArrow: parent ? { from: parent.val, to: root.val, label: 'search' } : null,
        explanation: {
          action: `Searching for [${target}] to delete at Node [${root.val}]`,
          intuition: target < root.val ? `Target < ${root.val} → Traverse Left.` : target > root.val ? `Target > ${root.val} → Traverse Right.` : `MATCH! Preparing deletion.`
        },
        phase: "DELETE_SEARCH",
        codeStatement: target < root.val ? `root.left = delete(root.left, ${target});` : target > root.val ? `root.right = delete(root.right, ${target});` : `// Node found: ${target}`,
        sound: 'compare'
      });

      if (target < root.val) {
        root.left = deleteHelper(root.left, target, root);
      } else if (target > root.val) {
        root.right = deleteHelper(root.right, target, root);
      } else {
        // Node found!
        // Case 1: Leaf
        if (!root.left && !root.right) {
          newSteps.push({
            treeSnapshot: cloneTree(cloned),
            activeNodeVal: root.val,
            nodeAnnotations: { [root.val]: { text: 'DELETED ✕', color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' } },
            explanation: {
              action: `Case 1: Node [${root.val}] is a leaf node.`,
              intuition: `Remove node by setting parent pointer to null.`
            },
            phase: "DELETE_LEAF",
            codeStatement: `return null;`,
            sound: 'delete'
          });
          return null;
        }
        // Case 2: One child
        if (!root.left) {
          newSteps.push({
            treeSnapshot: cloneTree(cloned),
            activeNodeVal: root.val,
            nodeAnnotations: { [root.val]: { text: `REPLACED ➔ ${root.right.val}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
            explanation: {
              action: `Case 2: Node [${root.val}] has only Right child [${root.right.val}].`,
              intuition: `Bypass current node with its right child.`
            },
            phase: "DELETE_ONE_CHILD",
            codeStatement: `return root.right;`,
            sound: 'delete'
          });
          return root.right;
        } else if (!root.right) {
          newSteps.push({
            treeSnapshot: cloneTree(cloned),
            activeNodeVal: root.val,
            nodeAnnotations: { [root.val]: { text: `REPLACED ➔ ${root.left.val}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
            explanation: {
              action: `Case 2: Node [${root.val}] has only Left child [${root.left.val}].`,
              intuition: `Bypass current node with its left child.`
            },
            phase: "DELETE_ONE_CHILD",
            codeStatement: `return root.left;`,
            sound: 'delete'
          });
          return root.left;
        }
        // Case 3: Two children
        const succ = findMin(root.right);
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: root.val,
          comparingVal: succ.val,
          nodeAnnotations: {
            [root.val]: { text: `REPLACE WITH ${succ.val}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' },
            [succ.val]: { text: 'SUCCESSOR', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' }
          },
          explanation: {
            action: `Case 3: Node [${root.val}] has two children. Finding In-Order Successor [${succ.val}].`,
            intuition: `Replace node value with smallest value in right subtree (${succ.val}), then delete successor.`
          },
          phase: "DELETE_TWO_CHILDREN",
          codeStatement: `root.val = minValue(root.right); root.right = delete(root.right, root.val);`,
          sound: 'compare'
        });
        root.val = succ.val;
        root.right = deleteHelper(root.right, succ.val, root);
      }

      root.height = 1 + Math.max(getNodeHeight(root.left), getNodeHeight(root.right));
      return root;
    }

    const updatedRoot = deleteHelper(cloned, key);
    setTreeRoot(updatedRoot);
    executeSteps(newSteps);
    setSelectedNode(null);
    addLog(`> Deleted Node [${key}] from tree.`);
  };

  // 5. TRAVERSALS (In-Order, Pre-Order, Post-Order, Level-Order)
  const handleTraversal = (type) => {
    if (!treeRoot) return;

    const newSteps = [];
    const order = [];
    const stack = [];

    // In-Order: Left -> Root -> Right
    function traverseIn(node, parent = null) {
      if (!node) return;
      stack.push({ val: node.val, label: `dfs(${node.val})` });

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        recursionArrow: parent ? { from: parent.val, to: node.val, label: 'dfs(left)' } : null,
        explanation: {
          action: `⬇ In-Order: Recurse into Left subtree of [${node.val}]`,
          intuition: "In-Order rule: (Left Subtree -> Current Node -> Right Subtree). Pushing frame to stack."
        },
        phase: "INORDER_LEFT",
        codeStatement: `inOrder(root.left);`,
        stack: [...stack],
        sound: 'compare'
      });

      traverseIn(node.left, node);

      order.push(node.val);
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        traversalItem: node.val,
        traversalSeq: [...order],
        nodeAnnotations: { [node.val]: { text: `#${order.length}`, color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' } },
        explanation: {
          action: `Visited Node [${node.val}]! Visit Order #${order.length}`,
          intuition: `Left subtree is complete. Process current node ${node.val}. Value stored above node.`
        },
        phase: "VISITING",
        codeStatement: `visit(root.val); // #${order.length}`,
        stack: [...stack],
        sound: 'found'
      });

      traverseIn(node.right, node);

      stack.pop();
      if (parent) {
        newSteps.push({
          treeSnapshot: treeRoot,
          activeNodeVal: node.val,
          backtrackArrow: { from: node.val, to: parent.val, label: 'backtrack' },
          explanation: {
            action: `⬆ In-Order: Backtracking from [${node.val}] up to Parent [${parent.val}]`,
            intuition: "Both subtrees inspected. Returning to caller."
          },
          phase: "BACKTRACK",
          codeStatement: `return; // up to ${parent.val}`,
          stack: [...stack],
          sound: 'compare'
        });
      }
    }

    // Pre-Order: Root -> Left -> Right
    function traversePre(node, parent = null) {
      if (!node) return;
      stack.push({ val: node.val, label: `dfs(${node.val})` });
      order.push(node.val);

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        traversalItem: node.val,
        traversalSeq: [...order],
        nodeAnnotations: { [node.val]: { text: `#${order.length}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
        recursionArrow: parent ? { from: parent.val, to: node.val, label: 'preorder' } : null,
        explanation: {
          action: `Pre-Order: Visited Node [${node.val}] FIRST (Order #${order.length})`,
          intuition: "Pre-Order rule: (Root -> Left -> Right). Process root before subtrees."
        },
        phase: "VISITING",
        codeStatement: `visit(root.val); // #${order.length}`,
        stack: [...stack],
        sound: 'found'
      });

      traversePre(node.left, node);
      traversePre(node.right, node);

      stack.pop();
      if (parent) {
        newSteps.push({
          treeSnapshot: treeRoot,
          activeNodeVal: node.val,
          backtrackArrow: { from: node.val, to: parent.val, label: 'backtrack' },
          explanation: {
            action: `⬆ Pre-Order: Backtracking from [${node.val}] to [${parent.val}]`,
            intuition: "Subtrees finished. Returning up call stack."
          },
          phase: "BACKTRACK",
          codeStatement: `return;`,
          stack: [...stack],
          sound: 'compare'
        });
      }
    }

    // Post-Order: Left -> Right -> Root
    function traversePost(node, parent = null) {
      if (!node) return;
      stack.push({ val: node.val, label: `dfs(${node.val})` });

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        recursionArrow: parent ? { from: parent.val, to: node.val, label: 'descend' } : null,
        explanation: {
          action: `⬇ Post-Order: Inspecting subtrees of Node [${node.val}]`,
          intuition: "Post-Order rule: (Left -> Right -> Root). Visit root only after both subtrees are complete."
        },
        phase: "POSTORDER_SUBTREES",
        codeStatement: `postOrder(root.left); postOrder(root.right);`,
        stack: [...stack],
        sound: 'compare'
      });

      traversePost(node.left, node);
      traversePost(node.right, node);

      order.push(node.val);
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        traversalItem: node.val,
        traversalSeq: [...order],
        nodeAnnotations: { [node.val]: { text: `#${order.length}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
        explanation: {
          action: `Post-Order: Visited Node [${node.val}]! Visit Order #${order.length}`,
          intuition: "Both children resolved. Now safe to process root."
        },
        phase: "VISITING",
        codeStatement: `visit(root.val); // #${order.length}`,
        stack: [...stack],
        sound: 'found'
      });

      stack.pop();
    }

    // Level-Order (BFS): Queue-based
    function traverseLevel() {
      const q = [treeRoot];
      const queueDisplay = [{ val: treeRoot.val, label: `Root (${treeRoot.val})` }];

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: treeRoot.val,
        queue: [...queueDisplay],
        explanation: {
          action: `Level-Order: Initialized queue with Root [${treeRoot.val}]`,
          intuition: "Breadth-First Search: Enqueue root, then process level by level."
        },
        phase: "ENQUEUE_ROOT",
        codeStatement: `Queue q = new LinkedList(); q.add(root);`,
        sound: 'compare'
      });

      while (q.length > 0) {
        const curr = q.shift();
        queueDisplay.shift();
        order.push(curr.val);

        newSteps.push({
          treeSnapshot: treeRoot,
          activeNodeVal: curr.val,
          traversalItem: curr.val,
          traversalSeq: [...order],
          queue: [...queueDisplay],
          nodeAnnotations: { [curr.val]: { text: `L-Order #${order.length}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
          explanation: {
            action: `Dequeued & Visited Node [${curr.val}]! Order #${order.length}`,
            intuition: `Processed node ${curr.val}. Now checking its children to enqueue.`
          },
          phase: "DEQUEUE_VISIT",
          codeStatement: `Node curr = q.poll(); visit(curr);`,
          sound: 'found'
        });

        if (curr.left) {
          q.push(curr.left);
          queueDisplay.push({ val: curr.left.val, label: `Left (${curr.left.val})` });
          newSteps.push({
            treeSnapshot: treeRoot,
            activeNodeVal: curr.left.val,
            queue: [...queueDisplay],
            explanation: {
              action: `Enqueued Left child [${curr.left.val}] of [${curr.val}]`,
              intuition: "Add left child to FIFO queue for upcoming level."
            },
            phase: "ENQUEUE_CHILD",
            codeStatement: `if (curr.left) q.add(curr.left);`,
            sound: 'compare'
          });
        }

        if (curr.right) {
          q.push(curr.right);
          queueDisplay.push({ val: curr.right.val, label: `Right (${curr.right.val})` });
          newSteps.push({
            treeSnapshot: treeRoot,
            activeNodeVal: curr.right.val,
            queue: [...queueDisplay],
            explanation: {
              action: `Enqueued Right child [${curr.right.val}] of [${curr.val}]`,
              intuition: "Add right child to FIFO queue for upcoming level."
            },
            phase: "ENQUEUE_CHILD",
            codeStatement: `if (curr.right) q.add(curr.right);`,
            sound: 'compare'
          });
        }
      }
    }

    if (type === 'inorder') traverseIn(treeRoot);
    else if (type === 'preorder') traversePre(treeRoot);
    else if (type === 'postorder') traversePost(treeRoot);
    else if (type === 'levelorder') traverseLevel();

    setTraversalOutput(order);
    addLog(`> ${type.toUpperCase()} Traversal completed: [${order.join(', ')}].`);
    executeSteps(newSteps);
  };

  // 6. AVL TREE SELF-BALANCING WITH ROTATIONS (LL, RR, LR, RL)
  const handleAVLInsert = (customVal = null) => {
    const val = customVal !== null ? Number(customVal) : Number(newNodeVal);
    if (isNaN(val)) return;

    const newSteps = [];
    const cloned = cloneTree(treeRoot);

    function rightRotate(y) {
      const x = y.left;
      const T2 = x.right;
      x.right = y;
      y.left = T2;
      y.height = 1 + Math.max(getNodeHeight(y.left), getNodeHeight(y.right));
      x.height = 1 + Math.max(getNodeHeight(x.left), getNodeHeight(x.right));
      return x;
    }

    function leftRotate(x) {
      const y = x.right;
      const T2 = y.left;
      y.left = x;
      x.right = T2;
      x.height = 1 + Math.max(getNodeHeight(x.left), getNodeHeight(x.right));
      y.height = 1 + Math.max(getNodeHeight(y.left), getNodeHeight(y.right));
      return y;
    }

    function avlHelper(node, parent = null) {
      if (!node) {
        const created = createNode(val);
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: val,
          nodeAnnotations: { [val]: { text: 'AVL INSERTED', color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
          explanation: {
            action: `Inserted new leaf Node [${val}] (Height 1).`,
            intuition: `Leaf added. Now backtracking up to verify balance factor at each ancestor.`
          },
          phase: "AVL_INSERT",
          codeStatement: `return new AVLNode(${val});`,
          sound: 'insert'
        });
        return created;
      }

      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: node.val,
        comparingVal: val,
        explanation: {
          action: `Traversing BST down: ${val} ${val < node.val ? '<' : '>'} ${node.val}`,
          intuition: val < node.val ? `Recurse Left.` : `Recurse Right.`
        },
        phase: "AVL_SEARCH",
        codeStatement: val < node.val ? `root.left = avlInsert(root.left, ${val});` : `root.right = avlInsert(root.right, ${val});`,
        sound: 'compare'
      });

      if (val < node.val) {
        node.left = avlHelper(node.left, node);
      } else if (val > node.val) {
        node.right = avlHelper(node.right, node);
      } else {
        return node;
      }

      // Update height & check balance
      node.height = 1 + Math.max(getNodeHeight(node.left), getNodeHeight(node.right));
      const balance = getBalanceFactor(node);

      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: node.val,
        nodeAnnotations: {
          [node.val]: {
            text: `BF: ${balance >= 0 ? '+' + balance : balance} (h=${node.height})`,
            color: Math.abs(balance) > 1 ? '#AB526B' : '#C5CEAE',
            bg: Math.abs(balance) > 1 ? 'rgba(171, 82, 107, 0.25)' : 'rgba(197, 206, 174, 0.25)'
          }
        },
        explanation: {
          action: `Node [${node.val}]: Height=${node.height}, Balance Factor = ${balance}`,
          intuition: Math.abs(balance) > 1
            ? `|Balance Factor| > 1! Tree is UNBALANCED at [${node.val}]. Triggering Rotation.`
            : `Balance factor is within [-1, +1]. Node is balanced.`
        },
        phase: Math.abs(balance) > 1 ? "UNBALANCED_DETECTED" : "BALANCED_CHECK",
        codeStatement: `int balance = getBalance(root); // ${balance}`,
        sound: Math.abs(balance) > 1 ? 'rotate' : 'compare'
      });

      // LL Case
      if (balance > 1 && val < node.left.val) {
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: node.val,
          nodeAnnotations: { [node.val]: { text: 'LL ROTATION ↷', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.3)' } },
          explanation: {
            action: `LL Case: Right Rotation around Node [${node.val}]`,
            intuition: `Left-heavy left subtree. Performing single Right Rotation to restore balance.`
          },
          phase: "ROTATE_LL",
          codeStatement: `return rightRotate(root);`,
          sound: 'rotate'
        });
        return rightRotate(node);
      }

      // RR Case
      if (balance < -1 && val > node.right.val) {
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: node.val,
          nodeAnnotations: { [node.val]: { text: 'RR ROTATION ↶', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.3)' } },
          explanation: {
            action: `RR Case: Left Rotation around Node [${node.val}]`,
            intuition: `Right-heavy right subtree. Performing single Left Rotation to restore balance.`
          },
          phase: "ROTATE_RR",
          codeStatement: `return leftRotate(root);`,
          sound: 'rotate'
        });
        return leftRotate(node);
      }

      // LR Case
      if (balance > 1 && val > node.left.val) {
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: node.left.val,
          nodeAnnotations: { [node.left.val]: { text: 'LR: STEP 1 ↶', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.3)' } },
          explanation: {
            action: `LR Case: Step 1 - Left Rotate Left Child [${node.left.val}]`,
            intuition: `Transforming LR configuration into pure LL configuration.`
          },
          phase: "ROTATE_LR_STEP1",
          codeStatement: `root.left = leftRotate(root.left);`,
          sound: 'rotate'
        });
        node.left = leftRotate(node.left);
        return rightRotate(node);
      }

      // RL Case
      if (balance < -1 && val < node.right.val) {
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: node.right.val,
          nodeAnnotations: { [node.right.val]: { text: 'RL: STEP 1 ↷', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.3)' } },
          explanation: {
            action: `RL Case: Step 1 - Right Rotate Right Child [${node.right.val}]`,
            intuition: `Transforming RL configuration into pure RR configuration.`
          },
          phase: "ROTATE_RL_STEP1",
          codeStatement: `root.right = rightRotate(root.right);`,
          sound: 'rotate'
        });
        node.right = rightRotate(node.right);
        return leftRotate(node);
      }

      return node;
    }

    const balancedRoot = avlHelper(cloned);
    setTreeRoot(balancedRoot);
    executeSteps(newSteps);
    addLog(`> AVL Tree balanced after inserting [${val}].`);
  };

  // 7. LOWEST COMMON ANCESTOR (LCA)
  const handleLCA = (pInput = null, qInput = null) => {
    const p = pInput !== null ? Number(pInput) : Number(lcaP);
    const q = qInput !== null ? Number(qInput) : Number(lcaQ);
    if (isNaN(p) || isNaN(q) || !treeRoot) return;

    const newSteps = [];
    const pathP = [];
    const pathQ = [];

    function getPath(root, target, path) {
      if (!root) return false;
      path.push(root.val);
      if (root.val === target) return true;
      if (getPath(root.left, target, path) || getPath(root.right, target, path)) {
        return true;
      }
      path.pop();
      return false;
    }

    getPath(treeRoot, p, pathP);
    getPath(treeRoot, q, pathQ);

    let lca = null;
    const minLen = Math.min(pathP.length, pathQ.length);
    for (let i = 0; i < minLen; i++) {
      if (pathP[i] === pathQ[i]) {
        lca = pathP[i];
      } else {
        break;
      }
    }

    // Trace path to P
    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: p,
      pathP: [...pathP],
      nodeAnnotations: { [p]: { text: `TARGET P: ${p}`, color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' } },
      explanation: {
        action: `Traced path to Node P [${p}]: ${pathP.join(' → ')}`,
        intuition: `Recorded ancestral path for target P.`
      },
      phase: "TRACE_P",
      codeStatement: `findPath(root, ${p}, pathP);`,
      sound: 'compare'
    });

    // Trace path to Q
    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: q,
      pathP: [...pathP],
      pathQ: [...pathQ],
      nodeAnnotations: {
        [p]: { text: `TARGET P: ${p}`, color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' },
        [q]: { text: `TARGET Q: ${q}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' }
      },
      explanation: {
        action: `Traced path to Node Q [${q}]: ${pathQ.join(' → ')}`,
        intuition: `Comparing both paths to find the lowest split point.`
      },
      phase: "TRACE_Q",
      codeStatement: `findPath(root, ${q}, pathQ);`,
      sound: 'compare'
    });

    // Final LCA Node
    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: lca,
      lcaNodeVal: lca,
      pathP: [...pathP],
      pathQ: [...pathQ],
      nodeAnnotations: {
        [lca]: { text: `★ LCA: ${lca}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.35)' },
        [p]: { text: `P: ${p}`, color: '#AB526B', bg: 'rgba(171, 82, 107, 0.2)' },
        [q]: { text: `Q: ${q}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.2)' }
      },
      explanation: {
        action: `LCA FOUND: Node [${lca}] is the Lowest Common Ancestor!`,
        intuition: `Node ${lca} is the deepest node shared by both path(P) and path(Q).`
      },
      phase: "LCA_FOUND",
      codeStatement: `return lca; // ${lca}`,
      sound: 'found'
    });

    executeSteps(newSteps);
    addLog(`> LCA of [${p}] and [${q}] is Node [${lca}].`);
  };

  // 8. MAX DEPTH / HEIGHT
  const handleMaxDepth = () => {
    if (!treeRoot) return;
    const newSteps = [];
    const depthStack = [];

    function depthHelper(node, parent = null) {
      if (!node) return 0;
      depthStack.push({ val: node.val, label: `maxDepth(${node.val})` });

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        recursionArrow: parent ? { from: parent.val, to: node.val, label: 'depth' } : null,
        explanation: {
          action: parent ? `⬇ Recursing into Node [${node.val}] from Parent [${parent.val}]` : `Starting maxDepth at Root [${node.val}]`,
          intuition: "Formula: 1 + max(depth(left), depth(right)). Pushing frame to stack."
        },
        phase: "MEASURING_DEPTH",
        codeStatement: `int left = maxDepth(root.left); int right = maxDepth(root.right);`,
        stack: [...depthStack],
        sound: 'compare'
      });

      const leftH = depthHelper(node.left, node);
      const rightH = depthHelper(node.right, node);
      const h = 1 + Math.max(leftH, rightH);

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        nodeAnnotations: { [node.val]: { text: `h = ${h}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
        backtrackArrow: parent ? { from: node.val, to: parent.val, label: `ret h=${h}`, returnVal: h } : null,
        explanation: {
          action: `Node [${node.val}] Height = 1 + max(${leftH}, ${rightH}) = ${h}`,
          intuition: `Stored height ${h} above node. Returning value up to caller.`
        },
        phase: "HEIGHT_CALCULATED",
        codeStatement: `return 1 + Math.max(${leftH}, ${rightH}); // = ${h}`,
        stack: [...depthStack],
        sound: 'found'
      });

      depthStack.pop();
      return h;
    }

    const totalH = depthHelper(treeRoot);
    executeSteps(newSteps);
    addLog(`> Maximum tree depth is ${totalH}.`);
  };

  // 9. INVERT / MIRROR TREE
  const handleInvertTree = () => {
    if (!treeRoot) return;
    const newSteps = [];
    const cloned = cloneTree(treeRoot);

    function invertHelper(node, parent = null) {
      if (!node) return;

      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: node.val,
        recursionArrow: parent ? { from: parent.val, to: node.val, label: 'invert' } : null,
        nodeAnnotations: { [node.val]: { text: 'swapped ↺', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
        explanation: {
          action: `Swapping children of Node [${node.val}]`,
          intuition: `Left child (${node.left?.val ?? 'null'}) ⇄ Right child (${node.right?.val ?? 'null'}).`
        },
        phase: "INVERT_SWAP",
        codeStatement: `Node temp = root.left; root.left = root.right; root.right = temp;`,
        sound: 'compare'
      });

      const temp = node.left;
      node.left = node.right;
      node.right = temp;

      invertHelper(node.left, node);
      invertHelper(node.right, node);
    }

    invertHelper(cloned);
    setTreeRoot(cloned);
    executeSteps(newSteps);
    addLog('> Inverted binary tree.');
  };

  // 10. VALIDATE BST
  const handleValidateBST = () => {
    if (!treeRoot) return;
    const newSteps = [];
    const stack = [];

    function validateHelper(node, minVal, maxVal, parent = null) {
      if (!node) return true;
      const minStr = minVal === null ? '-∞' : minVal;
      const maxStr = maxVal === null ? '+∞' : maxVal;
      stack.push({ val: node.val, label: `validate(${node.val})` });

      const isValid = (minVal === null || node.val > minVal) && (maxVal === null || node.val < maxVal);

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        recursionArrow: parent ? { from: parent.val, to: node.val, label: 'check' } : null,
        nodeAnnotations: {
          [node.val]: {
            text: isValid ? `${minStr} < x < ${maxStr}` : '✗ INVALID',
            color: isValid ? '#C5CEAE' : '#AB526B',
            bg: isValid ? 'rgba(197, 206, 174, 0.25)' : 'rgba(171, 82, 107, 0.25)'
          }
        },
        explanation: {
          action: `Testing Node [${node.val}]: Must satisfy ${minStr} < ${node.val} < ${maxStr}`,
          intuition: isValid ? `Constraint satisfied. Recursing to children.` : `BST Invariant VIOLATED!`
        },
        phase: isValid ? "BST_VALID" : "BST_INVALID",
        codeStatement: `if (root.val <= ${minStr} || root.val >= ${maxStr}) return false;`,
        stack: [...stack],
        sound: isValid ? 'compare' : 'delete'
      });

      if (!isValid) {
        stack.pop();
        return false;
      }

      const leftOk = validateHelper(node.left, minVal, node.val, node);
      const rightOk = validateHelper(node.right, node.val, maxVal, node);
      stack.pop();
      return leftOk && rightOk;
    }

    const isBST = validateHelper(treeRoot, null, null);
    executeSteps(newSteps);
    addLog(`> Validate BST result: ${isBST ? 'Valid BST' : 'Invalid BST'}.`);
  };

  // 11. DIAMETER OF BINARY TREE
  const handleDiameter = () => {
    if (!treeRoot) return;
    const newSteps = [];
    let maxDia = 0;

    function diameterHelper(node, parent = null) {
      if (!node) return 0;

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        recursionArrow: parent ? { from: parent.val, to: node.val, label: 'diameter' } : null,
        explanation: {
          action: `Calculating longest path through Node [${node.val}]`,
          intuition: "Diameter = left_height + right_height. Computing subtree depths."
        },
        phase: "DIAMETER_CHECK",
        codeStatement: `int left = height(root.left); int right = height(root.right);`,
        sound: 'compare'
      });

      const leftH = diameterHelper(node.left, node);
      const rightH = diameterHelper(node.right, node);
      const diaHere = leftH + rightH;
      if (diaHere > maxDia) maxDia = diaHere;

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        nodeAnnotations: { [node.val]: { text: `path: ${diaHere}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
        explanation: {
          action: `Path through [${node.val}] = ${leftH} + ${rightH} = ${diaHere} edges. (Max: ${maxDia})`,
          intuition: `Returning height to parent.`
        },
        phase: "DIAMETER_UPDATE",
        codeStatement: `maxDiameter = Math.max(maxDiameter, left + right); // ${maxDia}`,
        sound: 'found'
      });

      return 1 + Math.max(leftH, rightH);
    }

    diameterHelper(treeRoot);
    executeSteps(newSteps);
    addLog(`> Tree Diameter is ${maxDia} edges.`);
  };

  // 12. SEGMENT TREE
  const handleSegmentTree = () => {
    const L = parseInt(segRangeL, 10);
    const R = parseInt(segRangeR, 10);
    if (isNaN(L) || isNaN(R)) return;

    const arr = [2, 4, 5, 7, 8];
    function buildSegTree(start, end) {
      if (start === end) {
        const leaf = createNode(arr[start]);
        leaf.rangeL = start;
        leaf.rangeR = end;
        return leaf;
      }
      const mid = Math.floor((start + end) / 2);
      const leftChild = buildSegTree(start, mid);
      const rightChild = buildSegTree(mid + 1, end);
      const parent = createNode(leftChild.val + rightChild.val);
      parent.rangeL = start;
      parent.rangeR = end;
      parent.left = leftChild;
      parent.right = rightChild;
      return parent;
    }

    const segRoot = buildSegTree(0, arr.length - 1);
    setTreeRoot(segRoot);

    const newSteps = [];
    function querySegTree(node, ql, qr) {
      if (!node) return 0;

      if (ql <= node.rangeL && node.rangeR <= qr) {
        newSteps.push({
          treeSnapshot: segRoot,
          activeNodeVal: node.val,
          nodeAnnotations: { [node.val]: { text: `+${node.val} [FULL MATCH]`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.3)' } },
          explanation: {
            action: `Range [${node.rangeL}..${node.rangeR}] fully inside [${ql}..${qr}]. Take Sum = ${node.val}`,
            intuition: "Complete overlap: Return segment sum immediately in O(1)."
          },
          phase: "SEGMENT_FULL_MATCH",
          codeStatement: `return tree[node]; // ${node.val}`,
          sound: 'found'
        });
        return node.val;
      }

      if (node.rangeR < ql || node.rangeL > qr) {
        newSteps.push({
          treeSnapshot: segRoot,
          activeNodeVal: node.val,
          nodeAnnotations: { [node.val]: { text: 'NO OVERLAP', color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' } },
          explanation: {
            action: `Range [${node.rangeL}..${node.rangeR}] outside [${ql}..${qr}]. Discard.`,
            intuition: "No overlap: Return 0 identity."
          },
          phase: "SEGMENT_NO_OVERLAP",
          codeStatement: `return 0;`,
          sound: 'compare'
        });
        return 0;
      }

      newSteps.push({
        treeSnapshot: segRoot,
        activeNodeVal: node.val,
        nodeAnnotations: { [node.val]: { text: `[${node.rangeL}..${node.rangeR}] SPLIT`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
        explanation: {
          action: `Partial overlap at [${node.rangeL}..${node.rangeR}]. Split query into left and right.`,
          intuition: "Partial overlap: Recurse into children."
        },
        phase: "SEGMENT_SPLIT",
        codeStatement: `return query(left) + query(right);`,
        sound: 'compare'
      });

      const sumLeft = querySegTree(node.left, ql, qr);
      const sumRight = querySegTree(node.right, ql, qr);
      return sumLeft + sumRight;
    }

    const totalSum = querySegTree(segRoot, L, R);
    executeSteps(newSteps);
    addLog(`> Segment Tree Range Sum [${L}..${R}] = ${totalSum}.`);
  };

  // PRESETS LOADER
  const loadPreset = (type) => {
    setIsPlaying(false);
    setSelectedNode(null);

    let newRoot = null;
    if (type === 'balanced7') {
      newRoot = createNode(50);
      newRoot.left = createNode(25);
      newRoot.right = createNode(75);
      newRoot.left.left = createNode(15);
      newRoot.left.right = createNode(35);
      newRoot.right.left = createNode(60);
      newRoot.right.right = createNode(85);
      addLog('> Loaded Preset: Balanced 7-Node BST.');
    } else if (type === 'full15') {
      newRoot = createNode(50);
      newRoot.left = createNode(25);
      newRoot.right = createNode(75);
      newRoot.left.left = createNode(15);
      newRoot.left.right = createNode(35);
      newRoot.right.left = createNode(60);
      newRoot.right.right = createNode(85);
      newRoot.left.left.left = createNode(10);
      newRoot.left.left.right = createNode(20);
      newRoot.left.right.left = createNode(30);
      newRoot.left.right.right = createNode(40);
      newRoot.right.left.left = createNode(55);
      newRoot.right.left.right = createNode(65);
      newRoot.right.right.left = createNode(80);
      newRoot.right.right.right = createNode(90);
      addLog('> Loaded Preset: Full 15-Node Tree.');
    } else if (type === 'random') {
      const vals = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
      newRoot = createNode(vals[0]);
      for (let i = 1; i < vals.length; i++) {
        let curr = newRoot;
        while (curr) {
          if (vals[i] < curr.val) {
            if (!curr.left) { curr.left = createNode(vals[i]); break; }
            curr = curr.left;
          } else {
            if (!curr.right) { curr.right = createNode(vals[i]); break; }
            curr = curr.right;
          }
        }
      }
      addLog('> Loaded Preset: Random BST.');
    } else if (type === 'left_skewed') {
      newRoot = createNode(60);
      newRoot.left = createNode(50);
      newRoot.left.left = createNode(40);
      newRoot.left.left.left = createNode(30);
      addLog('> Loaded Preset: Left Skewed Tree.');
    } else if (type === 'right_skewed') {
      newRoot = createNode(20);
      newRoot.right = createNode(30);
      newRoot.right.right = createNode(40);
      newRoot.right.right.right = createNode(50);
      addLog('> Loaded Preset: Right Skewed Tree.');
    } else if (type === 'clear') {
      newRoot = createNode(50);
      addLog('> Tree cleared to root [50].');
    }

    updateHeights(newRoot);
    setTreeRoot(newRoot);
  };

  // AUTO-GENERATE INITIAL STEPS ON LOAD & ALGORITHM CHANGE
  // Ensures steps.length > 0 so PLAY BUTTON IS ALWAYS VISIBLE AND READY!
  useEffect(() => {
    if (!treeRoot) return;

    if (currentAlgo.id === 'inorder') handleTraversal('inorder');
    else if (currentAlgo.id === 'preorder') handleTraversal('preorder');
    else if (currentAlgo.id === 'postorder') handleTraversal('postorder');
    else if (currentAlgo.id === 'levelorder') handleTraversal('levelorder');
    else if (currentAlgo.id === 'bst') handleSearch(35);
    else if (currentAlgo.id === 'avl') handleAVLInsert(42);
    else if (currentAlgo.id === 'lca') handleLCA(15, 35);
    else if (currentAlgo.id === 'max_depth') handleMaxDepth();
    else if (currentAlgo.id === 'invert_tree') handleInvertTree();
    else if (currentAlgo.id === 'validate_bst') handleValidateBST();
    else if (currentAlgo.id === 'diameter') handleDiameter();
    else if (currentAlgo.id === 'segment_tree') handleSegmentTree();
    else handleTraversal('inorder');

    // Default to paused state on first load so user can press play
    setIsPlaying(false);
  }, [currentAlgo.id]);

  // LIVE VARIABLES FOR DRY RUN TRACKER
  const stepVariables = useMemo(() => {
    const vars = [
      {
        name: 'curr.val',
        value: activeStep?.activeNodeVal !== null && activeStep?.activeNodeVal !== undefined ? activeStep.activeNodeVal : 'null',
        type: 'number',
        role: 'pointer',
        isChanged: true,
        color: '#AB526B'
      }
    ];

    if (activeStep?.comparingVal !== undefined && activeStep?.comparingVal !== null) {
      vars.push({
        name: 'target / compare',
        value: activeStep.comparingVal,
        type: 'number',
        role: 'input',
        color: '#F0E2A4'
      });
    }

    if (activeStep?.traversalSeq?.length > 0) {
      vars.push({
        name: 'visitedCount',
        value: activeStep.traversalSeq.length,
        type: 'number',
        color: '#C5CEAE'
      });
    }

    if (activeStep?.stack?.length > 0) {
      vars.push({
        name: 'callStackDepth',
        value: activeStep.stack.length,
        type: 'number'
      });
    }

    if (activeStep?.queue?.length > 0) {
      vars.push({
        name: 'queueSize',
        value: activeStep.queue.length,
        type: 'number'
      });
    }

    vars.push({
      name: 'phase',
      value: activeStep?.phase || 'READY',
      type: 'string',
      color: '#C5CEAE'
    });

    return vars;
  }, [activeStep]);

  // =========================================================================
  // LEFT CONTROLS PANEL
  // =========================================================================
  const controlsSlot = (
    <div className="flex flex-col gap-3.5 p-1 text-xs">
      {/* 1. Algorithm Action Bar */}
      <div className="bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4] flex items-center gap-1.5">
            <Activity size={13} className="text-[#AB526B]" />
            {currentAlgo.name} Controls
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            {allNodes.length} nodes
          </span>
        </div>

        {/* Algorithm Specific Trigger Buttons */}
        {currentAlgo.id === 'bst' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search Val"
                className="flex-1 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-[#AB526B]"
              />
              <button
                onClick={() => handleSearch()}
                className="px-3 py-1.5 rounded-xl bg-[#AB526B] hover:bg-[#964259] text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm"
              >
                <Search size={12} /> Search
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newNodeVal}
                onChange={(e) => setNewNodeVal(e.target.value)}
                placeholder="Insert Val"
                className="flex-1 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-[#AB526B]"
              />
              <button
                onClick={() => handleBSTInsert()}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm"
              >
                <Plus size={12} /> Insert
              </button>
            </div>
          </div>
        )}

        {currentAlgo.id === 'avl' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newNodeVal}
                onChange={(e) => setNewNodeVal(e.target.value)}
                placeholder="AVL Value"
                className="flex-1 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1.5 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-[#AB526B]"
              />
              <button
                onClick={() => handleAVLInsert()}
                className="px-3 py-1.5 rounded-xl bg-[#AB526B] hover:bg-[#964259] text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm"
              >
                <Plus size={12} /> AVL Insert
              </button>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-[#BCA297] leading-relaxed">
              Maintains strict height balance via LL, RR, LR, and RL rotations.
            </p>
          </div>
        )}

        {['inorder', 'preorder', 'postorder', 'levelorder'].includes(currentAlgo.id) && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTraversal(currentAlgo.id)}
              className="col-span-2 py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#964259] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Play size={13} fill="currentColor" /> Run {currentAlgo.name}
            </button>
          </div>
        )}

        {currentAlgo.id === 'lca' && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Node P:</label>
                <input
                  type="number"
                  value={lcaP}
                  onChange={(e) => setLcaP(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Node Q:</label>
                <input
                  type="number"
                  value={lcaQ}
                  onChange={(e) => setLcaQ(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1 text-xs font-mono"
                />
              </div>
            </div>
            <button
              onClick={() => handleLCA()}
              className="w-full py-1.5 px-2 rounded-xl bg-[#AB526B] hover:bg-[#964259] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              <Target size={13} /> Find Lowest Common Ancestor
            </button>
          </div>
        )}

        {currentAlgo.id === 'max_depth' && (
          <button
            onClick={handleMaxDepth}
            className="w-full py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#964259] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Layers size={13} /> Calculate Tree Depth / Height
          </button>
        )}

        {currentAlgo.id === 'invert_tree' && (
          <button
            onClick={handleInvertTree}
            className="w-full py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#964259] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={13} /> Invert / Mirror Tree
          </button>
        )}

        {currentAlgo.id === 'validate_bst' && (
          <button
            onClick={handleValidateBST}
            className="w-full py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#964259] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 size={13} /> Validate BST Invariant
          </button>
        )}

        {currentAlgo.id === 'diameter' && (
          <button
            onClick={handleDiameter}
            className="w-full py-2 px-3 rounded-xl bg-[#AB526B] hover:bg-[#964259] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Activity size={13} /> Calculate Diameter
          </button>
        )}

        {currentAlgo.id === 'segment_tree' && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Left L:</label>
                <input
                  type="number"
                  value={segRangeL}
                  onChange={(e) => setSegRangeL(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Right R:</label>
                <input
                  type="number"
                  value={segRangeR}
                  onChange={(e) => setSegRangeR(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2.5 py-1 text-xs font-mono"
                />
              </div>
            </div>
            <button
              onClick={handleSegmentTree}
              className="w-full py-1.5 px-2 rounded-xl bg-[#AB526B] hover:bg-[#964259] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              <Cpu size={13} /> Query Range Sum [L..R]
            </button>
          </div>
        )}
      </div>

      {/* 2. Quick Node Operations (Add Child, Delete) */}
      <div className="bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3 shadow-sm flex flex-col gap-2">
        <span className="font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-[#F4EBC3] flex items-center gap-1">
          <Plus size={13} className="text-teal-500" />
          Add Node by Parent
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Parent Node:</label>
            <select
              value={selectedParentVal}
              onChange={(e) => setSelectedParentVal(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2 py-1 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3]"
            >
              {allNodes.map(n => (
                <option key={n.id} value={n.val}>Node [{n.val}]</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 dark:text-[#BCA297] block mb-0.5">Branch:</label>
            <div className="flex rounded-xl overflow-hidden border border-[#EBE0D3] dark:border-[#5C4E49]">
              <button
                type="button"
                onClick={() => setChildSide('left')}
                className={`flex-1 py-1 text-[11px] font-bold ${childSide === 'left' ? 'bg-[#AB526B] text-white' : 'bg-gray-50 dark:bg-[#423834] text-gray-600 dark:text-[#BCA297]'}`}
              >
                Left
              </button>
              <button
                type="button"
                onClick={() => setChildSide('right')}
                className={`flex-1 py-1 text-[11px] font-bold ${childSide === 'right' ? 'bg-[#AB526B] text-white' : 'bg-gray-50 dark:bg-[#423834] text-gray-600 dark:text-[#BCA297]'}`}
              >
                Right
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            value={newNodeVal}
            onChange={(e) => setNewNodeVal(e.target.value)}
            placeholder="Val"
            className="w-20 bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl px-2 py-1 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3]"
          />
          <button
            onClick={() => handleAddByParent()}
            className="flex-1 py-1.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            <Plus size={12} /> Add {childSide.toUpperCase()} Child
          </button>
        </div>
      </div>

      {/* 3. Tree Presets Bar */}
      <div className="bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3 shadow-sm flex flex-col gap-2">
        <span className="font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-[#F4EBC3] flex items-center gap-1">
          <Shuffle size={13} className="text-amber-500" />
          Tree Presets
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => loadPreset('balanced7')}
            className="py-1 px-1.5 rounded-lg bg-gray-50 dark:bg-[#423834] hover:bg-gray-100 dark:hover:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[10px] text-gray-700 dark:text-[#F4EBC3] font-bold text-center"
          >
            Balanced 7
          </button>
          <button
            onClick={() => loadPreset('full15')}
            className="py-1 px-1.5 rounded-lg bg-gray-50 dark:bg-[#423834] hover:bg-gray-100 dark:hover:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[10px] text-gray-700 dark:text-[#F4EBC3] font-bold text-center"
          >
            Full 15
          </button>
          <button
            onClick={() => loadPreset('random')}
            className="py-1 px-1.5 rounded-lg bg-gray-50 dark:bg-[#423834] hover:bg-gray-100 dark:hover:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[10px] text-gray-700 dark:text-[#F4EBC3] font-bold text-center"
          >
            Random
          </button>
          <button
            onClick={() => loadPreset('left_skewed')}
            className="py-1 px-1.5 rounded-lg bg-gray-50 dark:bg-[#423834] hover:bg-gray-100 dark:hover:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[10px] text-gray-700 dark:text-[#F4EBC3] font-bold text-center"
          >
            Left Skewed
          </button>
          <button
            onClick={() => loadPreset('right_skewed')}
            className="py-1 px-1.5 rounded-lg bg-gray-50 dark:bg-[#423834] hover:bg-gray-100 dark:hover:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[10px] text-gray-700 dark:text-[#F4EBC3] font-bold text-center"
          >
            Right Skewed
          </button>
          <button
            onClick={() => loadPreset('clear')}
            className="py-1 px-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-[10px] font-bold text-center"
          >
            Clear Tree
          </button>
        </div>
      </div>

      {/* 4. ALWAYS-PRESENT CORE PLAYBACK BAR IN CONTROLS */}
      <VisualizerPlaybackBar
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={() => setCurrentStepIdx(prev => Math.min(prev + 1, Math.max(0, steps.length - 1)))}
        onStepBackward={() => setCurrentStepIdx(prev => Math.max(prev - 1, 0))}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStepIdx(0);
        }}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIdx}
        totalSteps={Math.max(steps.length, 1)}
        stepDescription={activeStep?.explanation?.action || 'Ready to execute'}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
      />
    </div>
  );

  // =========================================================================
  // RIGHT PANEL: LIVE DRY RUN TRACKER & EXECUTION CHAMBER
  // =========================================================================
  const renderRightPanel = (
    <div className="flex flex-col h-full gap-3 overflow-y-auto pr-1">
      {/* Tab Switcher */}
      <div className="flex items-center p-1 bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl gap-1">
        <button
          onClick={() => setRightPanelTab('tracker')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
            rightPanelTab === 'tracker'
              ? 'bg-[#AB526B] text-white shadow-sm'
              : 'text-gray-600 dark:text-[#BCA297] hover:text-[#2D1F23] dark:hover:text-white'
          }`}
        >
          Dry Run
        </button>
        <button
          onClick={() => setRightPanelTab('chamber')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
            rightPanelTab === 'chamber'
              ? 'bg-[#AB526B] text-white shadow-sm'
              : 'text-gray-600 dark:text-[#BCA297] hover:text-[#2D1F23] dark:hover:text-white'
          }`}
        >
          Chamber
        </button>
      </div>

      {rightPanelTab === 'tracker' ? (
        <DryRunVariableTracker
          title={`${currentAlgo.name} — Execution Trace`}
          stepNumber={currentStepIdx + 1}
          totalSteps={Math.max(1, steps.length)}
          actionBadge={{
            label: activeStep?.phase || 'READY',
            icon: <Activity className="w-3.5 h-3.5 text-[#AB526B]" />,
            bg: 'bg-[#AB526B]/15 text-[#AB526B] dark:text-[#F0E2A4] border border-[#AB526B]/30'
          }}
          codeStatement={activeStep?.codeStatement || `// Algorithm: ${currentAlgo.name}`}
          explanation={activeStep?.explanation?.intuition || activeStep?.explanation?.action || 'Step trace'}
          variables={stepVariables}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {/* Stack vs Queue Mode Switcher */}
          <div className="flex items-center justify-between p-1 bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-xl gap-1">
            <button
              onClick={() => setDiagramTab('stack')}
              className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                activeDiagram === 'stack'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-500 dark:text-[#BCA297]'
              }`}
            >
              Stack (LIFO)
            </button>
            <button
              onClick={() => setDiagramTab('queue')}
              className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                activeDiagram === 'queue'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-500 dark:text-[#BCA297]'
              }`}
            >
              Queue (FIFO)
            </button>
          </div>

          {activeDiagram === 'queue' ? (
            <SimpleQueueDiagram
              queue={activeStep?.queue || []}
              activeVal={activeStep?.activeNodeVal}
            />
          ) : (
            <SimpleStackDiagram
              stack={activeStep?.stack || []}
              activeVal={activeStep?.activeNodeVal}
            />
          )}
        </div>
      )}

      {/* Selected Node Details Card */}
      {selectedNode && (
        <div className="p-3 rounded-2xl bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] shadow-lg mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4]">
              Selected Node [{selectedNode.val}]
            </span>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-white p-0.5"
            >
              <X size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                setSelectedParentVal(String(selectedNode.val));
                setChildSide('left');
                const userVal = window.prompt(`Enter value for LEFT child of Node [${selectedNode.val}]:`, String(selectedNode.val - 5));
                if (userVal !== null && userVal.trim() !== '') {
                  handleAddByParent(selectedNode.val, 'left', parseInt(userVal, 10));
                }
              }}
              className="py-1 px-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-700 dark:text-teal-300 border border-teal-500/40 text-[10px] font-bold flex items-center justify-center gap-1"
            >
              <Plus size={12} /> Add Left
            </button>
            <button
              onClick={() => {
                setSelectedParentVal(String(selectedNode.val));
                setChildSide('right');
                const userVal = window.prompt(`Enter value for RIGHT child of Node [${selectedNode.val}]:`, String(selectedNode.val + 5));
                if (userVal !== null && userVal.trim() !== '') {
                  handleAddByParent(selectedNode.val, 'right', parseInt(userVal, 10));
                }
              }}
              className="py-1 px-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 dark:text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center justify-center gap-1"
            >
              <Plus size={12} /> Add Right
            </button>
            <button
              onClick={() => handleDelete(selectedNode.val)}
              className="col-span-2 py-1 px-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-600 dark:text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center justify-center gap-1 mt-0.5"
            >
              <Trash2 size={12} /> Delete [{selectedNode.val}]
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // =========================================================================
  // MAIN VIEWPORT AND CANVAS RENDER
  // =========================================================================
  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      subtitle="Interactive tree with stored calculations, recursion/backtracking directional arrows, and real-time execution tracing."
      currentPath={currentPath}
      category="ds"
      headerRight={
        <div className="flex items-center gap-2">
          <select
            value={currentAlgo.id}
            onChange={(e) => navigate(`/visualizer/tree/${e.target.value}`)}
            className="bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#AB526B] font-mono font-bold"
          >
            {TREE_ALGORITHMS.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4] hover:text-[#AB526B] transition-colors"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <Link
            to="/visualizer/tree"
            className="text-xs px-3 py-1.5 bg-[#AB526B] hover:bg-[#964259] text-white rounded-lg font-mono font-bold transition-colors"
          >
            All Algorithms
          </Link>
        </div>
      }
      controls={controlsSlot}
      rightPanel={renderRightPanel}
      consoleOutput={logs}
    >
      <div className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden w-full h-full">
        {/* Interactive Tree Viewport */}
        <div
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="flex-1 w-full h-full min-h-[560px] bg-white/90 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl relative overflow-hidden shadow-xl cursor-grab active:cursor-grabbing select-none"
        >
          {/* Top-Left Floating Variable HUD (Clean, Glassmorphism, Zero Clutter) */}
          <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 p-3 rounded-2xl bg-white/90 dark:bg-[#331921]/90 backdrop-blur-xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-xl max-w-[260px] pointer-events-none select-none transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4] flex items-center gap-1">
                <Activity size={12} className="text-[#AB526B]" />
                {currentAlgo.name}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                LIVE
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100 dark:border-[#5C4E49]/60">
              <span className="text-gray-500 dark:text-[#BCA297] text-[11px]">Active Node:</span>
              <span className="font-mono font-black text-xs text-[#2D1F23] dark:text-[#F4EBC3] bg-[#AB526B]/15 px-2 py-0.5 rounded-lg border border-[#AB526B]/30">
                {activeStep?.activeNodeVal !== null && activeStep?.activeNodeVal !== undefined ? `[${activeStep.activeNodeVal}]` : 'None'}
              </span>
            </div>

            {activeStep?.phase && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-[#BCA297] text-[11px]">Phase:</span>
                <span className="font-mono font-bold text-[10px] text-teal-700 dark:text-[#C5CEAE]">
                  {activeStep.phase}
                </span>
              </div>
            )}

            {activeStep?.explanation?.action && (
              <div className="text-[11px] font-medium text-gray-700 dark:text-[#F0E2A4] line-clamp-2 pt-0.5 leading-tight">
                {activeStep.explanation.action}
              </div>
            )}

            {/* Visited Sequence Pills */}
            {(activeStep?.traversalSeq?.length > 0 || traversalOutput.length > 0) && (
              <div className="flex flex-col gap-1 pt-1 border-t border-gray-100 dark:border-[#5C4E49]/60">
                <span className="text-[10px] text-gray-500 dark:text-[#BCA297]">Visited:</span>
                <div className="flex flex-wrap items-center gap-1">
                  {(activeStep?.traversalSeq || traversalOutput).slice(-6).map((val, idx) => (
                    <span key={idx} className="px-1.5 py-0.2 rounded bg-[#C5CEAE]/25 text-[#2D1F23] dark:text-[#C5CEAE] font-mono font-bold text-[10px] border border-[#C5CEAE]/40">
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top-Right Pan & Zoom Viewport Controls */}
          <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 bg-white/90 dark:bg-[#331921]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-lg">
            <button
              onClick={() => setZoom(prev => Math.min(prev * 1.15, 2.5))}
              className="p-1.5 rounded-lg text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-[#F0E2A4] hover:bg-gray-100 dark:hover:bg-[#423834] transition-all"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev * 0.85, 0.35))}
              className="p-1.5 rounded-lg text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-[#F0E2A4] hover:bg-gray-100 dark:hover:bg-[#423834] transition-all"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-white transition-all"
              title="Reset 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleAutoCenter}
              className="p-1.5 rounded-lg text-teal-600 dark:text-[#C5CEAE] hover:bg-teal-500/10 transition-all"
              title="Auto-Fit Tree to Screen"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          {/* SVG Canvas with Zoom & Pan transform */}
          <svg className="w-full h-full">
            <defs>
              <filter id="treeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Arrow marker for recursion (downward: parent -> child) */}
              <marker id="arrow-down" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#AB526B" />
              </marker>

              {/* Arrow marker for backtracking (upward: child -> parent) */}
              <marker id="arrow-up" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#C5CEAE" />
              </marker>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* 1. EDGES */}
              {svgEdges.map((edge) => {
                const isTraveled = activeStep.branchEdge && (
                  (activeStep.branchEdge.parentVal === edge.from.val &&
                   activeStep.branchEdge.childSide === edge.side)
                );
                const isPathEdge = activeStep.highlightPath && (
                  activeStep.highlightPath.includes(edge.from.val) &&
                  activeStep.highlightPath.includes(edge.to.val)
                );

                const cY = (edge.from.y + edge.to.y) / 2;
                const pathD = `M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${cY}, ${edge.to.x} ${cY}, ${edge.to.x} ${edge.to.y}`;

                return (
                  <g key={edge.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isTraveled ? "#AB526B" : isPathEdge ? "#C5CEAE" : "#BCA297"}
                      strokeWidth={isTraveled ? "3.5" : isPathEdge ? "3" : "2"}
                      strokeDasharray={isTraveled ? "6,3" : "none"}
                      className="transition-all duration-300 dark:stroke-[#5C4E49]"
                      style={{
                        stroke: isTraveled ? '#AB526B' : isPathEdge ? '#C5CEAE' : undefined
                      }}
                    />
                    {isTraveled && (
                      <circle r="4.5" fill="#AB526B" filter="url(#treeGlow)">
                        <animateMotion path={pathD} dur="0.9s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* 2. RECURSION DOWNWARD ARROW OVERLAY (PARENT -> CHILD) */}
              {activeStep?.recursionArrow && (() => {
                const pNode = svgNodes.find(n => n.val === activeStep.recursionArrow.from);
                const cNode = svgNodes.find(n => n.val === activeStep.recursionArrow.to);
                if (!pNode || !cNode) return null;

                const startX = pNode.x;
                const startY = pNode.y + 22;
                const endX = cNode.x;
                const endY = cNode.y - 24;
                const midY = (startY + endY) / 2;
                const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
                const labelX = (startX + endX) / 2 + (endX < startX ? -28 : 28);
                const labelY = midY;
                const labelText = activeStep.recursionArrow.label || 'recurse';

                return (
                  <g className="pointer-events-none transition-all duration-300">
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#AB526B"
                      strokeWidth="5"
                      opacity="0.3"
                      filter="url(#treeGlow)"
                    />
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#AB526B"
                      strokeWidth="2.5"
                      markerEnd="url(#arrow-down)"
                      strokeDasharray="5,3"
                    />
                    <circle r="4" fill="#AB526B" filter="url(#treeGlow)">
                      <animateMotion path={pathD} dur="0.85s" repeatCount="indefinite" />
                    </circle>
                    <g transform={`translate(${labelX}, ${labelY})`}>
                      <rect
                        x="-34"
                        y="-10"
                        width="68"
                        height="20"
                        rx="6"
                        fill="#331921"
                        stroke="#AB526B"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#F0E2A4"
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {labelText}
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* 3. BACKTRACKING UPWARD ARROW OVERLAY (CHILD -> PARENT) */}
              {activeStep?.backtrackArrow && (() => {
                const cNode = svgNodes.find(n => n.val === activeStep.backtrackArrow.from);
                const pNode = svgNodes.find(n => n.val === activeStep.backtrackArrow.to);
                if (!cNode || !pNode) return null;

                const startX = cNode.x;
                const startY = cNode.y - 22;
                const endX = pNode.x;
                const endY = pNode.y + 24;
                const midY = (startY + endY) / 2;
                const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
                const labelX = (startX + endX) / 2 + (startX < endX ? -32 : 32);
                const labelY = midY;
                const retVal = activeStep.backtrackArrow.returnVal !== undefined ? `ret: ${activeStep.backtrackArrow.returnVal}` : 'backtrack';
                const labelText = `⬆ ${retVal}`;

                return (
                  <g className="pointer-events-none transition-all duration-300">
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#C5CEAE"
                      strokeWidth="5"
                      opacity="0.3"
                      filter="url(#treeGlow)"
                    />
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#C5CEAE"
                      strokeWidth="2.5"
                      markerEnd="url(#arrow-up)"
                      strokeDasharray="5,3"
                    />
                    <g transform={`translate(${labelX}, ${labelY})`}>
                      <rect
                        x="-38"
                        y="-10"
                        width="76"
                        height="20"
                        rx="6"
                        fill="#331921"
                        stroke="#C5CEAE"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#C5CEAE"
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {labelText}
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* 4. GHOST (+) SLOTS FOR 1-CLICK NODE ADDITIONS */}
              {ghostSlots.map((slot) => (
                <g
                  key={`ghost-${slot.parentVal}-${slot.side}`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedParentVal(String(slot.parentVal));
                    setChildSide(slot.side);
                    const defVal = slot.side === 'left' ? slot.parentVal - 5 : slot.parentVal + 5;
                    const userVal = window.prompt(
                      `Add ${slot.side.toUpperCase()} Child to Node [${slot.parentVal}]:\nEnter integer value:`,
                      String(defVal)
                    );
                    if (userVal !== null && userVal.trim() !== '') {
                      handleAddByParent(slot.parentVal, slot.side, parseInt(userVal, 10));
                    }
                  }}
                >
                  <circle
                    cx={slot.x}
                    cy={slot.y}
                    r="14"
                    fill="rgba(171, 82, 107, 0.05)"
                    stroke="rgba(171, 82, 107, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    className="group-hover:stroke-[#AB526B] group-hover:fill-[#AB526B]/20 transition-all"
                  />
                  <text
                    x={slot.x}
                    y={slot.y + 4}
                    textAnchor="middle"
                    fill="rgba(171, 82, 107, 0.8)"
                    fontSize="13"
                    fontWeight="bold"
                    className="pointer-events-none group-hover:fill-[#AB526B]"
                  >
                    +
                  </text>
                </g>
              ))}

              {/* 5. NODES */}
              {svgNodes.map((node) => {
                const isActive = activeStep.activeNodeVal === node.val;
                const isComparing = activeStep.comparingVal === node.val;
                const isPath = activeStep.highlightPath?.includes(node.val);
                const isPathP = activeStep.pathP?.includes(node.val);
                const isPathQ = activeStep.pathQ?.includes(node.val);
                const isLCA = activeStep.lcaNodeVal === node.val;
                const isSelected = selectedNode && selectedNode.val === node.val;
                const isChosenParent = Number(selectedParentVal) === node.val;

                // Color themes
                let fill = "#FAF7F2";
                let stroke = "#BCA297";
                let textFill = "#2D1F23";

                if (isLCA) {
                  fill = "#AB526B";
                  stroke = "#F0E2A4";
                  textFill = "#ffffff";
                } else if (isActive) {
                  fill = "#AB526B";
                  stroke = "#F0E2A4";
                  textFill = "#ffffff";
                } else if (isComparing) {
                  fill = "#F0E2A4";
                  stroke = "#AB526B";
                  textFill = "#2D1F23";
                } else if (isPathP) {
                  fill = "#AB526B";
                  stroke = "#F0E2A4";
                  textFill = "#ffffff";
                } else if (isPathQ) {
                  fill = "#C5CEAE";
                  stroke = "#AB526B";
                  textFill = "#2D1F23";
                } else if (isPath) {
                  fill = "#C5CEAE";
                  stroke = "#AB526B";
                  textFill = "#2D1F23";
                } else if (isChosenParent) {
                  fill = "#F4EBC3";
                  stroke = "#AB526B";
                  textFill = "#2D1F23";
                }

                return (
                  <g
                    key={node.id}
                    className="interactive-node cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                      setSelectedParentVal(String(node.val));
                    }}
                  >
                    {/* Pulsing ring for active or parent node */}
                    {(isActive || isChosenParent) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="29"
                        fill="none"
                        stroke={isActive ? "#AB526B" : "#F0E2A4"}
                        strokeWidth="2"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="r"
                          values="24;32;24"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8;0.2;0.8"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Outer selected glow */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="26"
                        fill="none"
                        stroke="#AB526B"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="2.2"
                      className="transition-colors duration-300"
                    />

                    {/* Node Value Label */}
                    <text
                      x={node.x}
                      y={node.y + 4.5}
                      textAnchor="middle"
                      fill={textFill}
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="pointer-events-none select-none"
                    >
                      {node.val}
                    </text>

                    {/* Parent indicator tag */}
                    {isChosenParent && !accumulatedAnnotations[node.val] && (
                      <text
                        x={node.x}
                        y={node.y - 27}
                        textAnchor="middle"
                        fill="#AB526B"
                        fontSize="9"
                        fontWeight="bold"
                        className="pointer-events-none uppercase tracking-wide"
                      >
                        PARENT
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 6. STORED CALCULATION BADGES ABOVE NODES */}
              {svgNodes.map((node) => {
                const annotation = accumulatedAnnotations[node.val];
                if (!annotation) return null;

                const text = String(annotation.text);
                const badgeW = Math.max(38, text.length * 7 + 14);
                const badgeH = 19;
                const badgeX = node.x - badgeW / 2;
                const badgeY = node.y - 45;
                const color = annotation.color || '#AB526B';
                const bg = annotation.bg || 'rgba(51, 25, 33, 0.9)';

                return (
                  <g key={`annotation-${node.id}`} className="pointer-events-none transition-all duration-300">
                    <line
                      x1={node.x}
                      y1={node.y - 26}
                      x2={node.x}
                      y2={node.y - 22}
                      stroke={color}
                      strokeWidth="1.5"
                    />
                    <rect
                      x={badgeX}
                      y={badgeY}
                      width={badgeW}
                      height={badgeH}
                      rx="6"
                      fill={bg}
                      stroke={color}
                      strokeWidth="1.2"
                      filter="url(#treeGlow)"
                    />
                    <text
                      x={node.x}
                      y={badgeY + 13}
                      textAnchor="middle"
                      fill={color}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {text}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* FLOATING CANVAS PLAYBACK DOCK (Pinned at Bottom Center of Canvas) */}
          {/* Guarantees Play Button is ALWAYS directly in front of user */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#331921]/95 backdrop-blur-xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-2xl transition-all">
            {/* Step Backward */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(prev => Math.max(prev - 1, 0));
              }}
              disabled={currentStepIdx === 0}
              className="p-1.5 rounded-xl text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-[#F0E2A4] hover:bg-gray-100 dark:hover:bg-[#423834] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              title="Step Backward"
            >
              <SkipBack size={16} />
            </button>

            {/* Main PLAY / PAUSE Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all shadow-md active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                  : 'bg-[#AB526B] hover:bg-[#964259] text-white shadow-[#AB526B]/40'
              }`}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>

            {/* Step Forward */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(prev => Math.min(prev + 1, Math.max(0, steps.length - 1)));
              }}
              disabled={currentStepIdx >= steps.length - 1}
              className="p-1.5 rounded-xl text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-[#F0E2A4] hover:bg-gray-100 dark:hover:bg-[#423834] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              title="Step Forward"
            >
              <SkipForward size={16} />
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(0);
              }}
              className="p-1.5 rounded-xl text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] dark:hover:text-[#F0E2A4] hover:bg-gray-100 dark:hover:bg-[#423834] transition-all active:scale-95"
              title="Reset to Step 1"
            >
              <RotateCcw size={15} />
            </button>

            {/* Step Counter Badge */}
            <span className="text-[11px] font-mono font-black px-2 py-1 rounded-lg bg-gray-100 dark:bg-[#423834] text-[#AB526B] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49] whitespace-nowrap">
              {currentStepIdx + 1}/{Math.max(1, steps.length)}
            </span>

            {/* Progress Scrubber Slider */}
            <input
              type="range"
              min="0"
              max={Math.max(0, steps.length - 1)}
              value={currentStepIdx}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStepIdx(Number(e.target.value));
              }}
              className="w-20 sm:w-28 accent-[#AB526B] cursor-pointer"
            />

            {/* Speed Selector */}
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="text-[11px] font-mono font-bold bg-gray-100 dark:bg-[#423834] text-[#2D1F23] dark:text-[#F4EBC3] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-1.5 py-1 focus:outline-none"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1.0x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2.0x</option>
            </select>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-xl text-gray-600 dark:text-[#BCA297] hover:text-[#AB526B] hover:bg-gray-100 dark:hover:bg-[#423834] transition-all"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-[#C5CEAE]" />}
            </button>
          </div>
        </div>
      </div>
    </ResponsiveVisualizerShell>
  );
}
