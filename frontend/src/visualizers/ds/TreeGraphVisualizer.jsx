import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import QuickCornerCard from '../../components/visualizer/QuickCornerCard';
import { TREE_ALGORITHMS } from './TreeHub';

// Tree Utilities
import {
  createNode,
  getAllTreeNodes,
  updateHeights,
  getStandardTree,
  computeTreeLayout
} from './tree/utils/treeLayout';
import { playSynthTone } from './tree/utils/audio';

// Tree Components & Views
import TreeControlsPanel from './tree/components/TreeControlsPanel';
import TreeRightPanel from './tree/components/TreeRightPanel';
import TreeCanvasView from './tree/views/TreeCanvasView';

// Algorithm Step Generators
import {
  generateAddByParentSteps,
  generateBSTInsertSteps,
  generateSearchSteps,
  generateDeleteSteps,
  generateTraversalSteps,
  generateAVLInsertSteps,
  generateLCASteps,
  generateMaxDepthSteps,
  generateInvertTreeSteps,
  generateValidateBSTSteps,
  generateDiameterSteps,
  generateSegmentTreeSteps
} from './tree/generators/treeStepGenerators';

export default function TreeGraphVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const currentAlgo = useMemo(() => {
    return TREE_ALGORITHMS.find(a => a.id === algoId) || TREE_ALGORITHMS[0];
  }, [algoId]);

  const currentPath = `/visualizer/tree/${currentAlgo.id}`;

  // Tree Root State - Initialize cleanly per algorithm category
  const [treeRoot, setTreeRoot] = useState(() => getStandardTree(currentAlgo.id));

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

  // In-Canvas Modal State (Completely replaces window.prompt!)
  const [inCanvasModal, setInCanvasModal] = useState(null);

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

  // Auto-generate simulation steps when switching algorithm category
  const triggerDefaultAlgo = useCallback((algoIdToRun = currentAlgo.id, root = treeRoot) => {
    if (!root) return;
    if (['inorder', 'preorder', 'postorder', 'bfs', 'dfs', 'levelorder'].includes(algoIdToRun)) {
      const type = algoIdToRun === 'levelorder' ? 'bfs' : algoIdToRun;
      const { newSteps, order } = generateTraversalSteps(root, type);
      setTraversalOutput(order);
      addLog(`> ${type.toUpperCase()} Traversal started: [${order.join(', ')}].`);
      executeSteps(newSteps);
    } else if (algoIdToRun === 'invert') {
      const { newSteps, newRoot } = generateInvertTreeSteps(root);
      setTreeRoot(newRoot);
      executeSteps(newSteps);
      addLog('> Inverted binary tree.');
    } else if (algoIdToRun === 'validate_bst') {
      const { newSteps, isBST } = generateValidateBSTSteps(root);
      executeSteps(newSteps);
      addLog(`> Validate BST: ${isBST ? 'Valid BST' : 'Invalid BST'}.`);
    } else if (algoIdToRun === 'max_depth') {
      const { newSteps, totalH } = generateMaxDepthSteps(root);
      executeSteps(newSteps);
      addLog(`> Maximum tree depth is ${totalH}.`);
    } else if (algoIdToRun === 'diameter') {
      const { newSteps, maxDia } = generateDiameterSteps(root);
      executeSteps(newSteps);
      addLog(`> Tree diameter is ${maxDia}.`);
    } else if (algoIdToRun === 'lca') {
      const { newSteps } = generateLCASteps(root, Number(lcaP) || 15, Number(lcaQ) || 35);
      executeSteps(newSteps);
      addLog(`> Finding Lowest Common Ancestor.`);
    } else if (algoIdToRun === 'segment_tree') {
      const { newSteps } = generateSegmentTreeSteps(Number(segRangeL) || 1, Number(segRangeR) || 4);
      executeSteps(newSteps);
    } else if (algoIdToRun === 'bst' || algoIdToRun === 'bst_search') {
      const { newSteps } = generateSearchSteps(root, Number(searchVal) || 40);
      executeSteps(newSteps);
      addLog(`> Searching for Node [${searchVal || 40}] in BST.`);
    } else if (algoIdToRun === 'avl') {
      const { newSteps, newRoot } = generateAVLInsertSteps(root, Number(newNodeVal) || 45);
      setTreeRoot(newRoot);
      executeSteps(newSteps);
      addLog(`> AVL balancing simulation for [${newNodeVal || 45}].`);
    } else {
      const { newSteps } = generateTraversalSteps(root, 'inorder');
      executeSteps(newSteps);
    }
  }, [currentAlgo.id, treeRoot, lcaP, lcaQ, segRangeL, segRangeR, searchVal, newNodeVal]);

  // Reset tree root and auto-populate simulation steps on algorithm change
  useEffect(() => {
    const freshTree = getStandardTree(currentAlgo.id);
    setTreeRoot(freshTree);
    setSelectedNode(null);
    setCurrentStepIdx(0);
    setIsPlaying(false);

    let initSteps = [];
    if (['inorder', 'preorder', 'postorder', 'bfs', 'dfs', 'levelorder'].includes(currentAlgo.id)) {
      const type = currentAlgo.id === 'levelorder' ? 'bfs' : currentAlgo.id;
      const res = generateTraversalSteps(freshTree, type);
      initSteps = res.newSteps;
      setTraversalOutput(res.order);
    } else if (currentAlgo.id === 'invert') {
      initSteps = generateInvertTreeSteps(freshTree).newSteps;
    } else if (currentAlgo.id === 'validate_bst') {
      initSteps = generateValidateBSTSteps(freshTree).newSteps;
    } else if (currentAlgo.id === 'max_depth') {
      initSteps = generateMaxDepthSteps(freshTree).newSteps;
    } else if (currentAlgo.id === 'diameter') {
      initSteps = generateDiameterSteps(freshTree).newSteps;
    } else if (currentAlgo.id === 'lca') {
      initSteps = generateLCASteps(freshTree, 15, 35).newSteps;
    } else if (currentAlgo.id === 'segment_tree') {
      initSteps = generateSegmentTreeSteps(1, 4).newSteps;
    } else if (currentAlgo.id === 'bst' || currentAlgo.id === 'bst_search') {
      initSteps = generateSearchSteps(freshTree, 40).newSteps;
    } else if (currentAlgo.id === 'avl') {
      initSteps = generateAVLInsertSteps(freshTree, 45).newSteps;
    }
    setSteps(initSteps);
  }, [currentAlgo.id]);

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

  // Algorithm Action Handlers
  const handleAddByParent = (customParent = null, customSide = null, customVal = null) => {
    const parentVal = customParent !== null ? Number(customParent) : Number(selectedParentVal);
    const side = customSide || childSide;
    const val = customVal !== null ? Number(customVal) : Number(newNodeVal);
    if (isNaN(parentVal) || isNaN(val)) return;

    const res = generateAddByParentSteps(treeRoot, parentVal, side, val);
    if (res.error) {
      addLog(`Error: ${res.error}`);
      return;
    }
    setTreeRoot(res.newRoot);
    executeSteps(res.newSteps);
    addLog(`> Added Node [${val}] as ${side} child of [${parentVal}].`);
  };

  const handleBSTInsert = (customVal = null) => {
    const val = customVal !== null ? Number(customVal) : Number(newNodeVal);
    if (isNaN(val)) return;
    const { newSteps, newRoot } = generateBSTInsertSteps(treeRoot, val);
    setTreeRoot(newRoot);
    executeSteps(newSteps);
    addLog(`> Inserted Node [${val}] into BST.`);
  };

  const handleSearch = (customVal = null) => {
    const target = customVal !== null ? Number(customVal) : Number(searchVal);
    if (isNaN(target) || !treeRoot) return;
    const { newSteps } = generateSearchSteps(treeRoot, target);
    executeSteps(newSteps);
    addLog(`> Searched for Node [${target}] in BST.`);
  };

  const handleDelete = (targetVal = null) => {
    const key = targetVal !== null ? Number(targetVal) : Number(deleteVal);
    if (isNaN(key) || !treeRoot) return;
    const { newSteps, newRoot } = generateDeleteSteps(treeRoot, key);
    setTreeRoot(newRoot);
    executeSteps(newSteps);
    setSelectedNode(null);
    addLog(`> Deleted Node [${key}] from tree.`);
  };

  const handleTraversal = (type) => {
    if (!treeRoot) return;
    const { newSteps, order } = generateTraversalSteps(treeRoot, type);
    setTraversalOutput(order);
    addLog(`> ${type.toUpperCase()} Traversal completed: [${order.join(', ')}].`);
    executeSteps(newSteps);
  };

  const handleAVLInsert = (customVal = null) => {
    const val = customVal !== null ? Number(customVal) : Number(newNodeVal);
    if (isNaN(val)) return;
    const { newSteps, newRoot } = generateAVLInsertSteps(treeRoot, val);
    setTreeRoot(newRoot);
    executeSteps(newSteps);
    addLog(`> AVL Tree balanced after inserting [${val}].`);
  };

  const handleLCA = (pInput = null, qInput = null) => {
    const p = pInput !== null ? Number(pInput) : Number(lcaP);
    const q = qInput !== null ? Number(qInput) : Number(lcaQ);
    if (isNaN(p) || isNaN(q) || !treeRoot) return;
    const { newSteps, lca } = generateLCASteps(treeRoot, p, q);
    executeSteps(newSteps);
    addLog(`> LCA of [${p}] and [${q}] is Node [${lca}].`);
  };

  const handleMaxDepth = () => {
    if (!treeRoot) return;
    const { newSteps, totalH } = generateMaxDepthSteps(treeRoot);
    executeSteps(newSteps);
    addLog(`> Maximum tree depth is ${totalH}.`);
  };

  const handleInvertTree = () => {
    if (!treeRoot) return;
    const { newSteps, newRoot } = generateInvertTreeSteps(treeRoot);
    setTreeRoot(newRoot);
    executeSteps(newSteps);
    addLog('> Inverted binary tree.');
  };

  const handleValidateBST = () => {
    if (!treeRoot) return;
    const { newSteps, isBST } = generateValidateBSTSteps(treeRoot);
    executeSteps(newSteps);
    addLog(`> Validate BST result: ${isBST ? 'Valid BST' : 'Invalid BST'}.`);
  };

  const handleDiameter = () => {
    if (!treeRoot) return;
    const { newSteps, maxDia } = generateDiameterSteps(treeRoot);
    executeSteps(newSteps);
    addLog(`> Tree Diameter is ${maxDia} edges.`);
  };

  const handleSegmentTree = () => {
    const L = parseInt(segRangeL, 10);
    const R = parseInt(segRangeR, 10);
    if (isNaN(L) || isNaN(R)) return;
    const { newSteps, totalSum } = generateSegmentTreeSteps(treeRoot, L, R);
    executeSteps(newSteps);
    addLog(`> Segment Tree Range Sum [${L}..${R}] = ${totalSum}.`);
  };

  // Presets Loader
  const loadPreset = (type) => {
    setIsPlaying(false);
    setSelectedNode(null);

    let newRoot = null;
    if (type === 'balanced7') {
      newRoot = getStandardTree('bst');
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
    } else if (type === 'clear') {
      newRoot = createNode(50);
      addLog('> Tree cleared to root [50].');
    }

    updateHeights(newRoot);
    setTreeRoot(newRoot);
  };

  // Live variables for DryRunVariableTracker
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

    vars.push({
      name: 'phase',
      value: activeStep?.phase || 'READY',
      type: 'string',
      color: '#C5CEAE'
    });

    return vars;
  }, [activeStep]);

  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      subtitle="Interactive tree visualization with step-by-step memory dry runs, directional arrows, and calculation badges."
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
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#C5CEAE]" />}
          </button>
          <Link
            to="/visualizer/tree"
            className="text-xs px-3 py-1.5 bg-[#AB526B] hover:bg-[#8F3E53] text-white rounded-lg font-mono font-bold transition-colors"
          >
            All Tree Algorithms
          </Link>
        </div>
      }
      cornerCard={
        <QuickCornerCard
          title="Tree Operations"
          subtitle="Instant Node Operations"
          position="top-left"
          targetInput={{
            label: "Search Tree Node",
            value: searchVal,
            onChange: setSearchVal,
            onSearch: () => handleSearch(searchVal),
            placeholder: "Search value..."
          }}
          addInput={{
            label: currentAlgo.id === 'avl' ? "Insert AVL Node" : "Insert Node",
            value: newNodeVal,
            onChange: setNewNodeVal,
            onAdd: () => currentAlgo.id === 'avl' ? handleAVLInsert(newNodeVal) : handleBSTInsert(newNodeVal),
            placeholder: "Val"
          }}
          removeInput={{
            label: "Delete Tree Node",
            value: deleteVal,
            onChange: setDeleteVal,
            onRemove: () => handleDelete(deleteVal),
            placeholder: "Val to delete..."
          }}
          customActions={
            <div className="flex items-center gap-1.5 w-full pt-1">
              <button
                onClick={handleAutoCenter}
                className="flex-1 py-1 rounded-xl bg-gray-100 dark:bg-[#423834] hover:bg-gray-200 dark:hover:bg-[#5C4E49] text-[10px] font-mono font-bold text-gray-700 dark:text-[#F0E2A4] transition-colors flex items-center justify-center gap-1"
                title="Auto-Center Canvas"
              >
                <span>🎯 Center</span>
              </button>
              <button
                onClick={() => {
                  const freshTree = getStandardTree(currentAlgo.id);
                  setTreeRoot(freshTree);
                  setSelectedNode(null);
                  setCurrentStepIdx(0);
                  setIsPlaying(false);
                  addLog('> Reset to standard tree structure.');
                }}
                className="flex-1 py-1 rounded-xl bg-gray-100 dark:bg-[#423834] hover:bg-gray-200 dark:hover:bg-[#5C4E49] text-[10px] font-mono font-bold text-gray-700 dark:text-[#F0E2A4] transition-colors flex items-center justify-center gap-1"
                title="Reset Tree"
              >
                <span>↺ Reset</span>
              </button>
            </div>
          }
        />
      }
      controls={
        <TreeControlsPanel
          currentAlgo={currentAlgo}
          allNodes={allNodes}
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          handleSearch={handleSearch}
          newNodeVal={newNodeVal}
          setNewNodeVal={setNewNodeVal}
          handleBSTInsert={handleBSTInsert}
          handleAVLInsert={handleAVLInsert}
          handleTraversal={handleTraversal}
          lcaP={lcaP}
          setLcaP={setLcaP}
          lcaQ={lcaQ}
          setLcaQ={setLcaQ}
          handleLCA={handleLCA}
          handleMaxDepth={handleMaxDepth}
          handleInvertTree={handleInvertTree}
          handleValidateBST={handleValidateBST}
          handleDiameter={handleDiameter}
          segRangeL={segRangeL}
          setSegRangeL={setSegRangeL}
          segRangeR={segRangeR}
          setSegRangeR={setSegRangeR}
          handleSegmentTree={handleSegmentTree}
          selectedParentVal={selectedParentVal}
          setSelectedParentVal={setSelectedParentVal}
          childSide={childSide}
          setChildSide={setChildSide}
          handleAddByParent={handleAddByParent}
          loadPreset={loadPreset}
        />
      }
      rightPanel={null}
      playback={
        <VisualizerPlaybackBar
          isPlaying={isPlaying}
          onPlay={() => {
            if (steps.length === 0) {
              triggerDefaultAlgo();
              return;
            }
            if (currentStepIdx >= steps.length - 1) {
              setCurrentStepIdx(0);
            }
            setIsPlaying(true);
          }}
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
          stepDescription={activeStep?.explanation?.action || activeStep?.explanation?.intuition || 'Tree simulation ready'}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        />
      }
      consoleOutput={logs}
    >
      <TreeCanvasView
        canvasRef={canvasRef}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleWheel={handleWheel}
        currentAlgo={currentAlgo}
        activeStep={activeStep}
        zoom={zoom}
        setZoom={setZoom}
        pan={pan}
        setPan={setPan}
        handleAutoCenter={handleAutoCenter}
        svgEdges={svgEdges}
        ghostSlots={ghostSlots}
        svgNodes={svgNodes}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        selectedParentVal={selectedParentVal}
        setSelectedParentVal={setSelectedParentVal}
        accumulatedAnnotations={accumulatedAnnotations}
        inCanvasModal={inCanvasModal}
        setInCanvasModal={setInCanvasModal}
        handleAddByParent={handleAddByParent}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentStepIdx={currentStepIdx}
        setCurrentStepIdx={setCurrentStepIdx}
        steps={steps}
        speed={speed}
        setSpeed={setSpeed}
        traversalOutput={traversalOutput}
      />
    </ResponsiveVisualizerShell>
  );
}
