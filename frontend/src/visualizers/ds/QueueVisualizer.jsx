import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layers, Activity, Volume2, VolumeX } from 'lucide-react';

import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import CodeInspector from '../../components/visualizer/CodeInspector';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import QuickCornerCard from '../../components/visualizer/QuickCornerCard';

// Modular queue domain imports
import { QUEUE_ALGORITHMS } from './queue/constants/queueAlgorithms';
import { CODE_SNIPPETS } from './queue/constants/queueSnippets';
import { generateQueueSteps } from './queue/generators/queueSteps';
import { playSynthTone } from './queue/utils/audio';
import QueueOperationsPanel from './queue/components/QueueOperationsPanel';

// Subview Renderers
import LinearQueueView from './queue/views/LinearQueueView';
import CircularQueueView from './queue/views/CircularQueueView';
import DequeView from './queue/views/DequeView';
import PriorityQueueView from './queue/views/PriorityQueueView';
import SlidingWindowView from './queue/views/SlidingWindowView';
import HotPotatoView from './queue/views/HotPotatoView';
import TwoStacksQueueView from './queue/views/TwoStacksQueueView';
import BfsQueueView from './queue/views/BfsQueueView';

// Re-export constants for backward compatibility
export { QUEUE_ALGORITHMS };

export default function QueueVisualizer({ initialAlgoId }) {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const activeAlgo = useMemo(() => {
    const candidate = algoId || initialAlgoId || 'basic';
    return QUEUE_ALGORITHMS.some(a => a.id === candidate) ? candidate : 'basic';
  }, [algoId, initialAlgoId]);

  const [activeLine, setActiveLine] = useState(1);
  const [logs, setLogs] = useState([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const addLog = useCallback((msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 19)]);
  }, []);

  const handleSelectAlgo = (id) => {
    navigate(`/visualizer/queue/${id}`);
  };

  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // 1. Basic FIFO Queue State
  const [basicItems, setBasicItems] = useState([12, 24, 36, 48]);
  const [basicInput, setBasicInput] = useState('60');

  // 2. Circular Queue State (Capacity = 6)
  const circularCapacity = 6;
  const [circularSlots, setCircularSlots] = useState([15, 30, 45, null, null, null]);
  const [circularFront, setCircularFront] = useState(0);
  const [circularRear, setCircularRear] = useState(2);
  const [circularInput, setCircularInput] = useState('60');

  // 3. Deque State
  const [dequeItems, setDequeItems] = useState([20, 40, 60]);
  const [dequeInput, setDequeInput] = useState('80');

  // 4. Priority Queue State
  const [priorityItems, setPriorityItems] = useState([
    { id: 1, val: 95, priority: 1, label: 'P1 (Urgent)' },
    { id: 2, val: 50, priority: 2, label: 'P2 (Normal)' },
    { id: 3, val: 20, priority: 3, label: 'P3 (Low)' }
  ]);
  const [prioValInput, setPrioValInput] = useState('75');
  const [prioLevelInput, setPrioLevelInput] = useState(1);

  // 5. Sliding Window State
  const [swArray, setSwArray] = useState([1, 3, -1, -3, 5, 3, 6, 7]);
  const [swK, setSwK] = useState(3);

  // 6. Hot Potato State
  const [potatoPlayers, setPotatoPlayers] = useState(['Alice', 'Bob', 'Charlie', 'David', 'Emma']);
  const [potatoK, setPotatoK] = useState(3);

  // 7. Queue via 2 Stacks State
  const [inStack, setInStack] = useState([10, 20, 30]);
  const [outStack, setOutStack] = useState([]);
  const [stackInput, setStackInput] = useState('40');

  // 8. BFS Queue State
  const [bfsQueue, setBfsQueue] = useState(['A']);
  const [bfsVisited, setBfsVisited] = useState(['A']);
  const [bfsOrder, setBfsOrder] = useState([]);
  const [bfsActiveNode, setBfsActiveNode] = useState(null);

  // Step trajectory generation
  const steps = useMemo(() => {
    return generateQueueSteps(activeAlgo, { swArray, swK, potatoPlayers, potatoK });
  }, [activeAlgo, swArray, swK, potatoPlayers, potatoK]);

  // Reset step counter on algo change
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [activeAlgo]);

  // Playback Timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          setCurrentStepIdx(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1400 / playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps.length, playbackSpeed]);

  // Acoustic trigger on step change
  useEffect(() => {
    if (steps.length > 0 && steps[currentStepIdx]?.sound) {
      playSynthTone(steps[currentStepIdx].sound, isMuted);
    }
  }, [currentStepIdx, steps, isMuted]);

  const activeStep = steps[currentStepIdx] || {
    action: 'Queue visualizer ready.',
    intuition: 'Interact with controls or press Play to run step-by-step dry run.',
    activeLine: 1
  };

  // Sync active step line
  useEffect(() => {
    if (activeStep.activeLine) {
      setActiveLine(activeStep.activeLine);
    }
  }, [activeStep]);

  // Dynamic variables for DryRunVariableTracker
  const activeVariables = useMemo(() => {
    if (activeAlgo === 'basic') {
      const items = activeStep.items || basicItems;
      return {
        front: items.length ? items[0] : 'empty',
        rear: items.length ? items[items.length - 1] : 'empty',
        size: items.length,
        capacity: 10,
        status: items.length === 0 ? 'UNDERFLOW' : items.length >= 10 ? 'OVERFLOW' : 'NOMINAL'
      };
    }
    if (activeAlgo === 'circular') {
      return {
        frontIndex: activeStep.front !== undefined ? activeStep.front : circularFront,
        rearIndex: activeStep.rear !== undefined ? activeStep.rear : circularRear,
        capacity: circularCapacity,
        formula: `(${activeStep.rear !== undefined ? activeStep.rear : circularRear} + 1) % ${circularCapacity}`,
        headVal: circularSlots[circularFront] ?? 'null'
      };
    }
    if (activeAlgo === 'deque') {
      const items = activeStep.items || dequeItems;
      return {
        frontVal: items.length ? items[0] : 'empty',
        rearVal: items.length ? items[items.length - 1] : 'empty',
        length: items.length,
        structure: 'Double-Ended Queue'
      };
    }
    if (activeAlgo === 'priority') {
      const items = activeStep.items || priorityItems;
      return {
        topPriority: items.length ? `${items[0].val} (${items[0].label})` : 'empty',
        queueLength: items.length,
        ordering: 'Min-Heap Priority'
      };
    }
    if (activeAlgo === 'slidingWindow') {
      return {
        currentIndex: activeStep.idx ?? -1,
        windowRange: activeStep.idx >= 0 ? `[${Math.max(0, activeStep.idx - swK + 1)}..${activeStep.idx}]` : '[]',
        dequeIndices: activeStep.deque ? `[${activeStep.deque.join(', ')}]` : '[]',
        windowMax: activeStep.deque?.length ? swArray[activeStep.deque[0]] : 'N/A',
        k: swK
      };
    }
    if (activeAlgo === 'hotPotato') {
      return {
        currentHolder: activeStep.currentHolder || 'None',
        passesMade: `${activeStep.passCount || 0}/${potatoK}`,
        remainingPlayers: activeStep.q?.length || potatoPlayers.length,
        eliminatedCount: activeStep.eliminated?.length || 0
      };
    }
    if (activeAlgo === 'twoStacks') {
      const inS = activeStep.inStack || inStack;
      const outS = activeStep.outStack || outStack;
      return {
        inStackSize: inS.length,
        inStackTop: inS.length ? inS[inS.length - 1] : 'empty',
        outStackSize: outS.length,
        outStackTop: outS.length ? outS[outS.length - 1] : 'empty',
        nextDequeue: outS.length ? outS[outS.length - 1] : (inS.length ? inS[0] : 'None')
      };
    }
    if (activeAlgo === 'bfs') {
      return {
        activeNode: activeStep.activeNode || bfsActiveNode || 'None',
        frontierQueue: activeStep.queue ? `[${activeStep.queue.join(', ')}]` : `[${bfsQueue.join(', ')}]`,
        visitedCount: activeStep.visited?.length || bfsVisited.length,
        orderOutput: activeStep.order ? `[${activeStep.order.join(', ')}]` : `[${bfsOrder.join(', ')}]`
      };
    }
    return {};
  }, [activeAlgo, activeStep, basicItems, circularFront, circularRear, circularSlots, dequeItems, priorityItems, swArray, swK, potatoPlayers, potatoK, inStack, outStack, bfsActiveNode, bfsQueue, bfsVisited, bfsOrder]);

  // =========================================================================
  // DIRECT INTERACTIVE HANDLERS (Allows real-time user mutations)
  // =========================================================================
  const handleBasicEnqueue = () => {
    const val = parseInt(basicInput, 10);
    if (isNaN(val)) return;
    if (basicItems.length >= 8) {
      addLog('⚠️ Basic queue overflow! Maximum capacity reached.');
      return;
    }
    setBasicItems(prev => [...prev, val]);
    addLog(`> Enqueued ${val} at Rear.`);
    playSynthTone('enqueue', isMuted);
  };

  const handleBasicDequeue = () => {
    if (basicItems.length === 0) {
      addLog('⚠️ Basic queue underflow! Queue is empty.');
      return;
    }
    const removed = basicItems[0];
    setBasicItems(prev => prev.slice(1));
    addLog(`> Dequeued ${removed} from Front.`);
    playSynthTone('dequeue', isMuted);
  };

  const handleCircularEnqueue = () => {
    const val = parseInt(circularInput, 10);
    if (isNaN(val)) return;
    const nextRear = (circularRear + 1) % circularCapacity;
    if (nextRear === circularFront && circularSlots[nextRear] !== null) {
      addLog(`⚠️ Circular Queue Full! (rear + 1) % ${circularCapacity} === front`);
      return;
    }
    const updated = [...circularSlots];
    updated[nextRear] = val;
    setCircularSlots(updated);
    setCircularRear(nextRear);
    addLog(`> Enqueued ${val} at slot [${nextRear}] using modulo wrap-around.`);
    playSynthTone('enqueue', isMuted);
  };

  const handleCircularDequeue = () => {
    if (circularSlots[circularFront] === null) {
      addLog('⚠️ Circular Queue Underflow! Slot is empty.');
      return;
    }
    const val = circularSlots[circularFront];
    const updated = [...circularSlots];
    updated[circularFront] = null;
    const nextFront = (circularFront + 1) % circularCapacity;
    setCircularSlots(updated);
    setCircularFront(nextFront);
    addLog(`> Dequeued ${val} from slot [${circularFront}]. Front moved to [${nextFront}].`);
    playSynthTone('dequeue', isMuted);
  };

  const handleDequePushFront = () => {
    const val = parseInt(dequeInput, 10);
    if (isNaN(val) || dequeItems.length >= 7) return;
    setDequeItems(prev => [val, ...prev]);
    addLog(`> Deque: Push Front ${val}.`);
    playSynthTone('enqueue', isMuted);
  };

  const handleDequePushRear = () => {
    const val = parseInt(dequeInput, 10);
    if (isNaN(val) || dequeItems.length >= 7) return;
    setDequeItems(prev => [...prev, val]);
    addLog(`> Deque: Push Rear ${val}.`);
    playSynthTone('enqueue', isMuted);
  };

  const handleDequePopFront = () => {
    if (dequeItems.length === 0) return;
    const val = dequeItems[0];
    setDequeItems(prev => prev.slice(1));
    addLog(`> Deque: Pop Front ${val}.`);
    playSynthTone('dequeue', isMuted);
  };

  const handleDequePopRear = () => {
    if (dequeItems.length === 0) return;
    const val = dequeItems[dequeItems.length - 1];
    setDequeItems(prev => prev.slice(0, -1));
    addLog(`> Deque: Pop Rear ${val}.`);
    playSynthTone('dequeue', isMuted);
  };

  const handlePriorityEnqueue = () => {
    const val = parseInt(prioValInput, 10);
    if (isNaN(val) || priorityItems.length >= 6) return;
    const label = prioLevelInput === 1 ? 'P1 (Urgent)' : prioLevelInput === 2 ? 'P2 (Normal)' : 'P3 (Low)';
    const newItem = { id: Date.now(), val, priority: prioLevelInput, label };
    const updated = [...priorityItems, newItem].sort((a, b) => a.priority - b.priority);
    setPriorityItems(updated);
    addLog(`> Enqueued with Priority ${prioLevelInput}: Value ${val}.`);
    playSynthTone('enqueue', isMuted);
  };

  const handlePriorityDequeue = () => {
    if (priorityItems.length === 0) return;
    const highest = priorityItems[0];
    setPriorityItems(prev => prev.slice(1));
    addLog(`> Dequeued Highest Priority Task: ${highest.val} (${highest.label}).`);
    playSynthTone('dequeue', isMuted);
  };

  const handleTwoStacksEnqueue = () => {
    const val = parseInt(stackInput, 10);
    if (isNaN(val) || inStack.length >= 6) return;
    setInStack(prev => [...prev, val]);
    addLog(`> Enqueued ${val} directly onto In-Stack.`);
    playSynthTone('enqueue', isMuted);
  };

  const handleTwoStacksDequeue = () => {
    if (outStack.length > 0) {
      const val = outStack[outStack.length - 1];
      setOutStack(prev => prev.slice(0, -1));
      addLog(`> Dequeued ${val} from Out-Stack.`);
      playSynthTone('dequeue', isMuted);
      return;
    }
    if (inStack.length === 0) {
      addLog('⚠️ Both stacks empty! Queue underflow.');
      return;
    }
    // Transfer from In-Stack to Out-Stack
    const reversed = [...inStack].reverse();
    const val = reversed[reversed.length - 1];
    setOutStack(reversed.slice(0, -1));
    setInStack([]);
    addLog(`> In-Stack dumped to Out-Stack! Dequeued oldest item: ${val}.`);
    playSynthTone('rotate', isMuted);
  };

  // Left Controls Slot
  const controlsSlot = (
    <div className="flex flex-col gap-3.5 p-1 text-xs">
      {/* 1. Algorithm Selector Pill */}
      <div className="bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3 shadow-sm flex flex-col gap-2">
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4] flex items-center gap-1.5">
          <Layers size={13} />
          Select Queue Algorithm Mode
        </label>
        <select
          value={activeAlgo}
          onChange={(e) => handleSelectAlgo(e.target.value)}
          className="w-full bg-gray-50 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3] text-xs rounded-xl px-2.5 py-2 font-mono font-bold focus:outline-none focus:border-[#AB526B]"
        >
          {QUEUE_ALGORITHMS.map(a => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.badge})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Interactive Operations Panel */}
      <div className="bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3 shadow-sm flex flex-col gap-2.5">
        <span className="font-bold text-[11px] uppercase tracking-wider text-gray-700 dark:text-[#F4EBC3] flex items-center gap-1.5">
          <Activity size={13} className="text-[#AB526B]" />
          Direct Queue Operations
        </span>
        <QueueOperationsPanel
          activeAlgo={activeAlgo}
          basicInput={basicInput}
          setBasicInput={setBasicInput}
          onBasicEnqueue={handleBasicEnqueue}
          onBasicDequeue={handleBasicDequeue}
          onBasicClear={() => { setBasicItems([]); addLog('> Cleared basic queue.'); }}
          circularInput={circularInput}
          setCircularInput={setCircularInput}
          onCircularEnqueue={handleCircularEnqueue}
          onCircularDequeue={handleCircularDequeue}
          dequeInput={dequeInput}
          setDequeInput={setDequeInput}
          onDequePushFront={handleDequePushFront}
          onDequePushRear={handleDequePushRear}
          onDequePopFront={handleDequePopFront}
          onDequePopRear={handleDequePopRear}
          prioValInput={prioValInput}
          setPrioValInput={setPrioValInput}
          prioLevelInput={prioLevelInput}
          setPrioLevelInput={setPrioLevelInput}
          onPriorityEnqueue={handlePriorityEnqueue}
          onPriorityDequeue={handlePriorityDequeue}
          stackInput={stackInput}
          setStackInput={setStackInput}
          onTwoStacksEnqueue={handleTwoStacksEnqueue}
          onTwoStacksDequeue={handleTwoStacksDequeue}
          swK={swK}
          setSwK={setSwK}
          potatoK={potatoK}
          setPotatoK={setPotatoK}
        />
      </div>
    </div>
  );

  // Dedicated Playback Bar Slot (always visible below canvas)
  const playbackBarSlot = (
    <VisualizerPlaybackBar
      isPlaying={isPlaying}
      onPlay={() => {
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
      speed={playbackSpeed}
      onSpeedChange={setPlaybackSpeed}
      currentStep={currentStepIdx}
      totalSteps={Math.max(steps.length, 1)}
      stepDescription={activeStep?.action || 'Ready to execute'}
      isVoiceEnabled={isVoiceEnabled}
      onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
    />
  );

  // Right Panel Slot
  const rightPanelSlot = (
    <div className="flex flex-col h-full gap-3 overflow-y-auto pr-1">
      {/* Code Inspector */}
      <CodeInspector
        codeSnippets={CODE_SNIPPETS[activeAlgo]}
        activeLine={activeLine}
        variables={activeVariables}
        title={`${QUEUE_ALGORITHMS.find(a => a.id === activeAlgo)?.name} Logic`}
      />

      {/* Live Variable Tracker */}
      <DryRunVariableTracker
        title={`${QUEUE_ALGORITHMS.find(a => a.id === activeAlgo)?.name} State`}
        stepNumber={currentStepIdx + 1}
        totalSteps={Math.max(1, steps.length)}
        actionBadge={{
          label: activeStep?.action ? 'ACTIVE' : 'READY',
          icon: <Activity className="w-3.5 h-3.5 text-[#AB526B]" />,
          bg: 'bg-[#AB526B]/15 text-[#AB526B] dark:text-[#F0E2A4] border border-[#AB526B]/30'
        }}
        codeStatement={activeStep?.action || '// Operation trace'}
        explanation={activeStep?.intuition || 'Step trace executed'}
        variables={Object.entries(activeVariables).map(([k, v]) => ({
          name: k,
          value: v,
          type: typeof v === 'number' ? 'number' : 'string',
          color: k.toLowerCase().includes('front') ? '#AB526B' : k.toLowerCase().includes('rear') ? '#C5CEAE' : '#F0E2A4'
        }))}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
      />

      {/* Execution Trace Log */}
      <div className="bg-white dark:bg-[#331921] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-2xl p-3.5 shadow-sm">
        <h4 className="text-xs font-mono font-bold text-[#AB526B] dark:text-[#F0E2A4] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Activity size={14} /> Execution Trace Log
        </h4>
        <div className="h-28 overflow-y-auto font-mono text-[11px] space-y-1.5 text-gray-700 dark:text-[#FAF7F2]">
          {logs.length === 0 ? (
            <p className="text-[#BCA297] italic">No queue events logged yet.</p>
          ) : (
            logs.map((l, i) => (
              <div key={i} className="leading-snug flex items-start gap-1">
                <span className="text-[#AB526B] font-bold">›</span>
                <span>{l}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveVisualizerShell
      title={QUEUE_ALGORITHMS.find(a => a.id === activeAlgo)?.name || 'Queue Visualizer'}
      subtitle={QUEUE_ALGORITHMS.find(a => a.id === activeAlgo)?.desc || 'Interactive Queue Data Structure Studio'}
      currentPath={`/visualizer/queue/${activeAlgo}`}
      category="ds"
      cornerCard={
        <QuickCornerCard
          title="Queue FIFO Controls"
          subtitle="Instant Enqueue & Dequeue"
          position="top-left"
          addInput={{
            label: "Enqueue Element",
            value: basicInput,
            onChange: setBasicInput,
            onAdd: handleBasicEnqueue,
            placeholder: "Value"
          }}
          removeInput={{
            label: "Dequeue Element",
            hint: "Removes from Front (FIFO)",
            onRemove: handleBasicDequeue
          }}
          customActions={
            <div className="flex items-center gap-1.5 w-full pt-1">
              <button
                onClick={() => {
                  setBasicItems([10, 25, 40, 55, 70]);
                  addLog('> Queue reset to default items.');
                }}
                className="flex-1 py-1 rounded-xl bg-gray-100 dark:bg-[#423834] hover:bg-gray-200 dark:hover:bg-[#5C4E49] text-[10px] font-mono font-bold text-gray-700 dark:text-[#F0E2A4] transition-colors flex items-center justify-center gap-1"
                title="Reset Queue"
              >
                <span>↺ Reset</span>
              </button>
              <button
                onClick={() => {
                  setBasicItems([]);
                  addLog('> Queue cleared.');
                }}
                className="flex-1 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-[10px] font-mono font-bold text-rose-700 dark:text-rose-300 transition-colors flex items-center justify-center gap-1"
                title="Clear Queue"
              >
                <span>🗑 Clear</span>
              </button>
            </div>
          }
        />
      }
      headerRight={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4] hover:text-[#AB526B] transition-colors"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#C5CEAE]" />}
          </button>
          <Link
            to="/visualizer/queue"
            className="text-xs px-3 py-1.5 bg-[#AB526B] hover:bg-[#964259] text-white rounded-lg font-mono font-bold transition-colors shadow-xs"
          >
            All Queue Types
          </Link>
        </div>
      }
      controls={controlsSlot}
      playback={playbackBarSlot}
      rightPanel={rightPanelSlot}
      consoleOutput={logs}
    >
      <div className="flex-1 w-full h-full min-h-[560px] bg-white/90 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl relative overflow-hidden shadow-xl p-4 sm:p-6 flex flex-col items-center justify-center">

        {/* Top-Left Floating HUD */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 p-3 rounded-2xl bg-white/90 dark:bg-[#331921]/90 backdrop-blur-xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-lg max-w-[280px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#AB526B] dark:text-[#F0E2A4]">
              {QUEUE_ALGORITHMS.find(a => a.id === activeAlgo)?.name}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              O(1) FIFO
            </span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-[#FAF7F2] line-clamp-2 leading-tight mt-0.5">
            {activeStep.action || 'Ready for operations.'}
          </p>
        </div>

        {/* Modular Algorithm Views */}
        {activeAlgo === 'basic' && (
          <LinearQueueView items={activeStep.items || basicItems} />
        )}

        {activeAlgo === 'circular' && (
          <CircularQueueView
            slots={activeStep.slots || circularSlots}
            frontIdx={activeStep.front !== undefined ? activeStep.front : circularFront}
            rearIdx={activeStep.rear !== undefined ? activeStep.rear : circularRear}
            capacity={circularCapacity}
          />
        )}

        {activeAlgo === 'deque' && (
          <DequeView items={activeStep.items || dequeItems} />
        )}

        {activeAlgo === 'priority' && (
          <PriorityQueueView items={activeStep.items || priorityItems} />
        )}

        {activeAlgo === 'slidingWindow' && (
          <SlidingWindowView
            swArray={swArray}
            swK={swK}
            stepData={activeStep}
          />
        )}

        {activeAlgo === 'hotPotato' && (
          <HotPotatoView
            potatoPlayers={potatoPlayers}
            stepData={activeStep}
          />
        )}

        {activeAlgo === 'twoStacks' && (
          <TwoStacksQueueView
            inStack={activeStep.inStack || inStack}
            outStack={activeStep.outStack || outStack}
          />
        )}

        {activeAlgo === 'bfs' && (
          <BfsQueueView
            currentQ={activeStep.queue || bfsQueue}
            visited={activeStep.visited || bfsVisited}
            activeNode={activeStep.activeNode || bfsActiveNode}
            order={activeStep.order || bfsOrder}
          />
        )}

      </div>
    </ResponsiveVisualizerShell>
  );
}
