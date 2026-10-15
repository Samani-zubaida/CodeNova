import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Volume2, VolumeX, FastForward, CheckCircle, AlertCircle
} from 'lucide-react';

import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import QuickCornerCard from '../../components/visualizer/QuickCornerCard';
import { LINKED_LIST_ALGORITHMS } from './LinkedListHub';

import { CODE_SNIPPETS } from './linkedlist/constants/linkedListSnippets';
import { INTUITIONS } from './linkedlist/constants/linkedListIntuitions';
import {
  generateSearchGoalSteps,
  generateInsertAtPosSteps,
  generateDeleteAtPosSteps,
  generateSinglySteps,
  generateDoublySteps,
  generateCircularSteps,
  generateReverseSteps,
  generateMiddleSteps,
  generateFloydSteps,
  generateRemoveNthSteps,
  generatePalindromeSteps,
  generateMergeSteps,
  generateIntersectionSteps,
  generateDeleteValSteps,
  generateLruSteps
} from './linkedlist/generators/linkedListStepGenerators';

import LinkedListControlsPanel from './linkedlist/components/LinkedListControlsPanel';
import LinkedListRightPanel from './linkedlist/components/LinkedListRightPanel';
import LinkedListCanvasView from './linkedlist/views/LinkedListCanvasView';

// Web Audio Sound Synthesizer
const playSynthTone = (type = 'visit', isMuted = false) => {
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

    if (type === 'insert') {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'delete') {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.19);
    } else if (type === 'flip') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'match') {
      osc.frequency.setValueAtTime(587.33, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.21);
    } else {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  } catch (e) {}
};

export default function LinkedListVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  // Normalize algoId
  const currentAlgoId = useMemo(() => {
    if (algoId === 'middle') return 'middle_node';
    const valid = LINKED_LIST_ALGORITHMS.find(a => a.id === algoId);
    return valid ? valid.id : LINKED_LIST_ALGORITHMS[0].id;
  }, [algoId]);

  const currentAlgo = useMemo(() => {
    return LINKED_LIST_ALGORITHMS.find(a => a.id === currentAlgoId) || LINKED_LIST_ALGORITHMS[0];
  }, [currentAlgoId]);

  // Base state for linked list nodes
  const [nodeList, setNodeList] = useState([
    { id: 'n1', val: 12 },
    { id: 'n2', val: 25 },
    { id: 'n3', val: 40 },
    { id: 'n4', val: 55 },
    { id: 'n5', val: 70 },
    { id: 'n6', val: 88 }
  ]);

  // Input states
  const [customListInput, setCustomListInput] = useState('12, 25, 40, 55, 70, 88');
  const [nodeValToAdd, setNodeValToAdd] = useState('99');
  const [nodePositionToAdd, setNodePositionToAdd] = useState('2');
  const [goalNodeVal, setGoalNodeVal] = useState('40');
  const [positionToDelete, setPositionToDelete] = useState('0');
  const [nthParam, setNthParam] = useState(2);
  const [deleteTarget, setDeleteTarget] = useState('40');
  const [cycleIndex, setCycleIndex] = useState(2);
  const [hasCycle, setHasCycle] = useState(true);

  // Merge Sorted Lists inputs
  const [mergeList1, setMergeList1] = useState([10, 30, 50, 70]);
  const [mergeList2, setMergeList2] = useState([20, 40, 60, 80]);
  const [mergeInput1, setMergeInput1] = useState('10, 30, 50, 70');
  const [mergeInput2, setMergeInput2] = useState('20, 40, 60, 80');
  const [intersectA] = useState(['A1', 'A2']);
  const [intersectB] = useState(['B1', 'B2', 'B3']);
  const [intersectCommon] = useState(['C1', 'C2', 'C3']);
  const [lruCache] = useState([]);

  // Audio / Voice
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  // Playback state
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);
  const pendingUpdateRef = useRef(null);

  // Step computation helper
  const computeSteps = (overrideNodes = null, overrideAlgo = null) => {
    const nodes = overrideNodes || nodeList;
    const targetAlgo = overrideAlgo || currentAlgoId;
    let gen = [];

    if (targetAlgo === 'singly') {
      gen = generateSinglySteps(nodes);
    } else if (targetAlgo === 'doubly') {
      gen = generateDoublySteps(nodes);
    } else if (targetAlgo === 'circular') {
      gen = generateCircularSteps(nodes);
    } else if (targetAlgo === 'reverse') {
      gen = generateReverseSteps(nodes);
    } else if (targetAlgo === 'floyd_cycle') {
      gen = generateFloydSteps(nodes, hasCycle ? cycleIndex : -1);
    } else if (targetAlgo === 'middle_node') {
      gen = generateMiddleSteps(nodes);
    } else if (targetAlgo === 'merge_sorted') {
      gen = generateMergeSteps(mergeList1, mergeList2);
    } else if (targetAlgo === 'remove_nth') {
      gen = generateRemoveNthSteps(nodes, nthParam);
    } else if (targetAlgo === 'palindrome') {
      gen = generatePalindromeSteps(nodes);
    } else if (targetAlgo === 'intersection') {
      gen = generateIntersectionSteps(['A1', 'A2'], ['B1', 'B2', 'B3'], ['C1', 'C2', 'C3']);
    } else if (targetAlgo === 'delete_val') {
      gen = generateDeleteValSteps(nodes, parseInt(deleteTarget) || 40);
    } else if (targetAlgo === 'lru_cache') {
      gen = generateLruSteps([
        { type: 'put', key: 'A', val: 100 },
        { type: 'put', key: 'B', val: 200 },
        { type: 'put', key: 'C', val: 300 },
        { type: 'get', key: 'A' },
        { type: 'put', key: 'D', val: 400 },
        { type: 'get', key: 'B' },
        { type: 'put', key: 'E', val: 500 }
      ]);
    }

    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Re-generate steps on algorithm change or key settings change
  useEffect(() => {
    if (!pendingUpdateRef.current) {
      computeSteps();
    }
  }, [currentAlgoId, nthParam, deleteTarget, cycleIndex, hasCycle]);

  // Apply custom comma-separated list
  const handleApplyCustomList = () => {
    const rawVals = customListInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (rawVals.length === 0) return;
    const newNodes = rawVals.map((v, i) => ({ id: `cn_${Date.now()}_${i}`, val: v }));
    setNodeList(newNodes);
    computeSteps(newNodes);
  };

  // Randomize list
  const handleRandomizeList = () => {
    const len = Math.floor(Math.random() * 3) + 4; // 4 to 6 nodes
    const vals = [];
    let cur = Math.floor(Math.random() * 20) + 10;
    for (let i = 0; i < len; i++) {
      vals.push(cur);
      cur += Math.floor(Math.random() * 15) + 5;
    }
    const newNodes = vals.map((v, i) => ({ id: `rn_${Date.now()}_${i}`, val: v }));
    setNodeList(newNodes);
    setCustomListInput(vals.join(', '));
    computeSteps(newNodes);
  };

  // Load Palindrome preset
  const handleLoadPalindrome = (isTrue) => {
    const vals = isTrue ? [1, 2, 3, 2, 1] : [1, 2, 3, 4, 5];
    const newNodes = vals.map((v, i) => ({ id: `pn_${Date.now()}_${i}`, val: v }));
    setNodeList(newNodes);
    setCustomListInput(vals.join(', '));
    computeSteps(newNodes, 'palindrome');
  };

  // Toggle Floyd Cycle
  const handleToggleCycle = () => {
    setHasCycle(!hasCycle);
  };

  // Apply Merge inputs
  const handleMergeLists = () => {
    const l1 = mergeInput1.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).sort((a,b) => a - b);
    const l2 = mergeInput2.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).sort((a,b) => a - b);
    setMergeList1(l1);
    setMergeList2(l2);
    const gen = generateMergeSteps(l1, l2);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // Interactive LRU action
  const handleLruOp = (type, key, val) => {
    const gen = generateLruSteps([
      { type, key, val: val || Math.floor(Math.random() * 800) + 100 }
    ]);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // Action: Search Goal Node
  const handleSearchGoalNode = () => {
    const gen = generateSearchGoalSteps(nodeList, goalNodeVal);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    playSynthTone('traverse', isMuted);
  };

  // Action: Insert Node at Position
  const handleInsertAtPosition = () => {
    const val = parseInt(nodeValToAdd) || Math.floor(Math.random() * 90) + 10;
    const pos = Math.max(0, Math.min(parseInt(nodePositionToAdd) || 0, nodeList.length));
    const gen = generateInsertAtPosSteps(nodeList, val, pos);
    const finalNodes = gen[gen.length - 1]?.nodes || nodeList;

    pendingUpdateRef.current = finalNodes;
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    playSynthTone('insert', isMuted);
  };

  // Action: Insert Head
  const handleInsertHead = () => {
    const val = parseInt(nodeValToAdd) || Math.floor(Math.random() * 90) + 10;
    const gen = generateInsertAtPosSteps(nodeList, val, 0);
    const finalNodes = gen[gen.length - 1]?.nodes || nodeList;

    pendingUpdateRef.current = finalNodes;
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    playSynthTone('insert', isMuted);
  };

  // Action: Insert Tail
  const handleInsertTail = () => {
    const val = parseInt(nodeValToAdd) || Math.floor(Math.random() * 90) + 10;
    const gen = generateInsertAtPosSteps(nodeList, val, nodeList.length);
    const finalNodes = gen[gen.length - 1]?.nodes || nodeList;

    pendingUpdateRef.current = finalNodes;
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    playSynthTone('insert', isMuted);
  };

  // Action: Delete at Position
  const handleDeleteAtPosition = () => {
    if (nodeList.length <= 1) return;
    const pos = Math.max(0, Math.min(parseInt(positionToDelete) || 0, nodeList.length - 1));
    const gen = generateDeleteAtPosSteps(nodeList, pos);
    const finalNodes = gen[gen.length - 1]?.nodes || nodeList;

    pendingUpdateRef.current = finalNodes;
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    playSynthTone('delete', isMuted);
  };

  // Action: Delete by Value
  const handleDeleteTargetVal = () => {
    const gen = generateDeleteValSteps(nodeList, parseInt(deleteTarget) || 40);
    const finalNodes = gen[gen.length - 1]?.nodes || nodeList;

    pendingUpdateRef.current = finalNodes;
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    playSynthTone('delete', isMuted);
  };

  // Ticker loop
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(160, Math.round(1400 / speed));
      timerRef.current = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          const nextIdx = currentStepIdx + 1;
          setCurrentStepIdx(nextIdx);
          playSynthTone('traverse', isMuted);
        } else {
          setIsPlaying(false);
          playSynthTone('success', isMuted);
          // Sync pending list update once animation finishes
          if (pendingUpdateRef.current) {
            setNodeList(pendingUpdateRef.current);
            setCustomListInput(pendingUpdateRef.current.map(x => x.val).join(', '));
            pendingUpdateRef.current = null;
          }
        }
      }, delay);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIdx, steps.length, speed, isMuted]);

  const step = steps[currentStepIdx] || {};

  // Playback Handlers
  const handlePlay = () => {
    if (steps.length === 0) computeSteps();
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      playSynthTone('traverse', isMuted);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      playSynthTone('traverse', isMuted);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (pendingUpdateRef.current) {
      setNodeList(pendingUpdateRef.current);
      pendingUpdateRef.current = null;
    }
    setCurrentStepIdx(0);
  };

  // ========================================================

  // Live Dry-Run Variables Tracker
  const trackedVariables = useMemo(() => {
    const vars = [];
    const nodes = step.nodes || nodeList;

    if (currentAlgoId === 'reverse') {
      vars.push({
        name: 'prev',
        value: step.prevIdx >= 0 && step.prevIdx < nodes.length ? `Node(${nodes[step.prevIdx]?.val})` : 'NULL',
        type: 'Pointer',
        role: 'Inverted predecessor node',
        isChanged: true
      });
      vars.push({
        name: 'curr',
        value: step.currIdx >= 0 && step.currIdx < nodes.length ? `Node(${nodes[step.currIdx]?.val})` : 'NULL',
        type: 'Pointer',
        role: 'Active node being reversed',
        isChanged: true
      });
      vars.push({
        name: 'next',
        value: step.nextIdx >= 0 && step.nextIdx < nodes.length ? `Node(${nodes[step.nextIdx]?.val})` : 'NULL',
        type: 'Pointer',
        role: 'Saved forward link (curr.next)',
        isChanged: true
      });
      vars.push({
        name: 'reversedCount',
        value: `${step.reversedLinks ? step.reversedLinks.length : 0} / ${nodes.length}`,
        type: 'Count',
        role: 'Number of inverted links'
      });
    } else if (currentAlgoId === 'floyd_cycle') {
      vars.push({
        name: 'slow (1x)',
        value: step.slow !== undefined && step.slow < nodes.length ? `Node(${nodes[step.slow]?.val}) [idx ${step.slow}]` : '-',
        type: 'Pointer',
        role: 'Tortoise stepping 1 node per iteration',
        isChanged: true
      });
      vars.push({
        name: 'fast (2x)',
        value: step.fast !== undefined && step.fast < nodes.length ? `Node(${nodes[step.fast]?.val}) [idx ${step.fast}]` : '-',
        type: 'Pointer',
        role: 'Hare leaping 2 nodes per iteration',
        isChanged: true
      });
      vars.push({
        name: 'phase',
        value: step.phase === 1 ? 'Phase 1: Detection' : 'Phase 2: Entrance',
        type: 'State',
        role: 'Current Floyd phase'
      });
      vars.push({
        name: 'collision',
        value: step.collision ? 'YES' : 'NO',
        type: 'Boolean',
        role: 'Whether pointers met in loop'
      });
    } else if (currentAlgoId === 'middle_node' || currentAlgoId === 'middle') {
      vars.push({
        name: 'slow (1x)',
        value: step.slow !== undefined && step.slow < nodes.length ? `Node(${nodes[step.slow]?.val})` : '-',
        type: 'Pointer',
        role: 'Midpoint tracker moving 1 step',
        isChanged: true
      });
      vars.push({
        name: 'fast (2x)',
        value: step.fast !== undefined && step.fast < nodes.length ? `Node(${nodes[step.fast]?.val})` : (step.foundMiddle ? 'TAIL / NULL' : '-'),
        type: 'Pointer',
        role: 'Lead tracker moving 2 steps',
        isChanged: true
      });
      vars.push({
        name: 'middleFound',
        value: step.foundMiddle ? 'TRUE' : 'Searching...',
        type: 'Boolean',
        role: 'Whether middle reached'
      });
    } else if (currentAlgoId === 'merge_sorted') {
      const l1 = step.list1 || mergeList1;
      const l2 = step.list2 || mergeList2;
      vars.push({
        name: 'p1',
        value: step.p1 !== undefined && step.p1 < l1.length ? `val: ${l1[step.p1]}` : 'EOF',
        type: 'Pointer',
        role: 'Pointer in List 1'
      });
      vars.push({
        name: 'p2',
        value: step.p2 !== undefined && step.p2 < l2.length ? `val: ${l2[step.p2]}` : 'EOF',
        type: 'Pointer',
        role: 'Pointer in List 2'
      });
      vars.push({
        name: 'mergedCount',
        value: step.merged ? step.merged.length : 0,
        type: 'Count',
        role: 'Merged elements'
      });
    } else if (currentAlgoId === 'remove_nth') {
      vars.push({
        name: 'n',
        value: step.safeN || nthParam,
        type: 'Number',
        role: 'Offset from end of list'
      });
      vars.push({
        name: 'slow',
        value: step.slow !== undefined && step.slow >= 0 && step.slow < nodes.length ? `Node(${nodes[step.slow]?.val})` : '-',
        type: 'Pointer',
        role: 'Predecessor pointer'
      });
      vars.push({
        name: 'fast',
        value: step.fast !== undefined && step.fast < nodes.length ? `Node(${nodes[step.fast]?.val})` : 'END',
        type: 'Pointer',
        role: 'Lead pointer creating gap'
      });
    } else if (currentAlgoId === 'palindrome') {
      vars.push({
        name: 'p1 (left)',
        value: step.p1 !== undefined && step.p1 < nodes.length ? `Node(${nodes[step.p1]?.val})` : '-',
        type: 'Pointer',
        role: 'Inward left pointer'
      });
      vars.push({
        name: 'p2 (right)',
        value: step.p2 !== undefined && step.p2 < nodes.length ? `Node(${nodes[step.p2]?.val})` : '-',
        type: 'Pointer',
        role: 'Inward right pointer'
      });
      vars.push({
        name: 'symmetric',
        value: step.isSymmetric !== false ? 'YES' : 'NO',
        type: 'Boolean',
        role: 'Pair match status'
      });
    } else {
      if (step.currIdx !== undefined && step.currIdx >= 0) {
        vars.push({
          name: 'curr',
          value: `Node(${nodes[step.currIdx]?.val}) [idx ${step.currIdx}]`,
          type: 'Pointer',
          role: 'Current node being inspected',
          isChanged: true
        });
      }
      if (step.prevIdx !== undefined && step.prevIdx >= 0) {
        vars.push({
          name: 'prev',
          value: `Node(${nodes[step.prevIdx]?.val}) [idx ${step.prevIdx}]`,
          type: 'Pointer',
          role: 'Predecessor node pointer'
        });
      }
      vars.push({
        name: 'listLength',
        value: nodes.length,
        type: 'Number',
        role: 'Total nodes in list'
      });
    }

    return vars;
  }, [currentAlgoId, step, nodeList, mergeList1, mergeList2, nthParam]);

  // Code Statement for Dry Run trace
  const currentCodeStatement = useMemo(() => {
    if (currentAlgoId === 'reverse') {
      if (step.isFlipping) return 'curr.next = prev;';
      if (step.status?.includes('next = curr.next')) return 'next = curr.next;';
      if (step.status?.includes('Advancing')) return 'prev = curr; curr = next;';
      return 'ListNode prev = null, curr = head;';
    }
    if (currentAlgoId === 'floyd_cycle') {
      if (step.phase === 1) return 'slow = slow.next; fast = fast.next.next;';
      if (step.phase === 2) return 'slow = slow.next; fast = fast.next;';
      return 'ListNode slow = head, fast = head;';
    }
    if (currentAlgoId === 'middle_node' || currentAlgoId === 'middle') {
      return 'slow = slow.next; fast = fast.next.next;';
    }
    if (currentAlgoId === 'merge_sorted') {
      return 'if (p1.val <= p2.val) { curr.next = p1; p1 = p1.next; } else { curr.next = p2; p2 = p2.next; }';
    }
    if (currentAlgoId === 'remove_nth') {
      if (step.bypassing) return 'slow.next = slow.next.next;';
      if (step.phase === 'slide_window') return 'slow = slow.next; fast = fast.next;';
      return 'fast = fast.next;';
    }
    if (currentAlgoId === 'palindrome') {
      return 'if (left.val != right.val) return false;';
    }
    return 'curr = curr.next;';
  }, [currentAlgoId, step]);


  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      category="Linked List Data Structures"
      cornerCard={
        <QuickCornerCard
          title="List Operations"
          subtitle="Instant Node Actions"
          position="top-left"
          targetInput={{
            label: "Target Search Value",
            value: goalNodeVal,
            onChange: setGoalNodeVal,
            onSearch: handleSearchGoalNode,
            placeholder: "Search val (e.g. 40)..."
          }}
          addInput={{
            label: "Insert Node",
            value: nodeValToAdd,
            onChange: setNodeValToAdd,
            posValue: nodePositionToAdd,
            onPosChange: setNodePositionToAdd,
            onAdd: handleInsertAtPosition,
            onAddHead: handleInsertHead,
            onAddTail: handleInsertTail,
            placeholder: "Val"
          }}
          removeInput={{
            label: "Delete Node",
            value: positionToDelete,
            onChange: setPositionToDelete,
            onRemove: handleDeleteAtPosition,
            placeholder: "Pos index (0..n)..."
          }}
          customActions={
            <div className="flex items-center gap-1.5 w-full pt-1">
              <button
                onClick={handleRandomizeList}
                className="flex-1 py-1 rounded-xl bg-gray-100 dark:bg-[#423834] hover:bg-gray-200 dark:hover:bg-[#5C4E49] text-[10px] font-mono font-bold text-gray-700 dark:text-[#F0E2A4] transition-colors flex items-center justify-center gap-1"
                title="Generate Random List"
              >
                <span>🎲 Randomize List</span>
              </button>
            </div>
          }
        />
      }
      headerRight={
        <div className="flex items-center gap-3">
          <select
            value={currentAlgoId}
            onChange={(e) => navigate(`/visualizer/linkedlist/${e.target.value}`)}
            className="bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono font-bold"
          >
            {LINKED_LIST_ALGORITHMS.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-[#5C4E49] rounded-lg border border-[#EBE0D3] dark:border-[#5C4E49] text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3]">
            <span>Time: </span>
            <span className="font-bold text-amber-500">{currentAlgo.time}</span>
          </div>
          <button
            onClick={() => setIsMuted(m => !m)}
            className="p-1.5 rounded-lg border border-[#EBE0D3] dark:border-[#5C4E49] bg-gray-100 dark:bg-[#5C4E49] text-gray-500 hover:text-cyan-400 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      }
      controls={
        <div className="flex flex-col gap-3 w-full">
          <LinkedListControlsPanel
            customListInput={customListInput}
            setCustomListInput={setCustomListInput}
            handleApplyCustomList={handleApplyCustomList}
            handleRandomizeList={handleRandomizeList}
            currentAlgoId={currentAlgoId}
            cycleIndex={cycleIndex}
            setCycleIndex={setCycleIndex}
            handleToggleCycle={() => setHasCycle(prev => !prev)}
            hasCycle={hasCycle}
            nthParam={nthParam}
            setNthParam={setNthParam}
            handleLoadPalindrome={handleLoadPalindrome}
            deleteTarget={deleteTarget}
            setDeleteTarget={setDeleteTarget}
            handleDeleteTargetVal={handleDeleteTargetVal}
            handleLruOp={handleLruOp}
            goalNodeVal={goalNodeVal}
            setGoalNodeVal={setGoalNodeVal}
            handleSearchGoalNode={handleSearchGoalNode}
            nodeValToAdd={nodeValToAdd}
            setNodeValToAdd={setNodeValToAdd}
            nodePositionToAdd={nodePositionToAdd}
            setNodePositionToAdd={setNodePositionToAdd}
            handleInsertAtPosition={handleInsertAtPosition}
            handleInsertHead={handleInsertHead}
            handleInsertTail={handleInsertTail}
            positionToDelete={positionToDelete}
            setPositionToDelete={setPositionToDelete}
            handleDeleteAtPosition={handleDeleteAtPosition}
            nodeList={nodeList}
          />
        </div>
      }
      playback={
        <VisualizerPlaybackBar
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStepIdx}
          totalSteps={steps.length}
          stepDescription={step.status || ''}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        />
      }
      rightPanel={
        <LinkedListRightPanel
          currentAlgo={currentAlgo}
          currentAlgoId={currentAlgoId}
          currentStepIdx={currentStepIdx}
          steps={steps}
          step={step}
          nodeList={nodeList}
          currentDryRunVariables={trackedVariables}
          currentCodeStatement={currentCodeStatement}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        />
      }
    >
      <LinkedListCanvasView
        currentAlgoId={currentAlgoId}
        step={step}
        currentStepIdx={currentStepIdx}
        steps={steps}
        nodeList={nodeList}
        mergeList1={mergeList1}
        mergeList2={mergeList2}
        intersectA={intersectA}
        intersectB={intersectB}
        intersectCommon={intersectCommon}
        lruCache={lruCache}
        hasCycle={hasCycle}
        cycleIndex={cycleIndex}
        nthParam={nthParam}
      />
    </ResponsiveVisualizerShell>
  );
}
