import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Activity } from 'lucide-react';

import { ARRAY_CATALOG } from './ArrayHub';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';
import QuickCornerCard from '../../components/visualizer/QuickCornerCard';

// Modular array domain imports
import { CODE_SNIPPETS } from './array/constants/arraySnippets';
import { generateArraySteps } from './array/generators/arrayStepGenerators';
import MergeSortView from './array/views/MergeSortView';
import RainWaterView from './array/views/RainWaterView';
import SortingBarsView from './array/views/SortingBarsView';
import ArrayControlsPanel from './array/components/ArrayControlsPanel';

export { CODE_SNIPPETS };

export default function Array3DVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const currentAlgo = ARRAY_CATALOG.find(a => a.id === algoId) || ARRAY_CATALOG[0];
  const isTrappingRain = currentAlgo.id === 'trapping_rain';
  const isMergeSort = currentAlgo.id === 'mergesort';
  const isBubbleSort = currentAlgo.id === 'bubblesort';

  // Seed default arrays based on algorithm characteristics
  const getDefaultArray = () => {
    if (currentAlgo.id === 'trapping_rain') return [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    if (currentAlgo.id === 'mergesort') return [38, 27, 43, 3, 9, 82, 10, 19];
    if (currentAlgo.id === 'quicksort' || currentAlgo.id === 'bubblesort' || currentAlgo.id === 'insertionsort') {
      return [52, 28, 85, 14, 63, 37, 91, 44];
    }
    if (currentAlgo.id === 'binary_search') return [12, 24, 35, 47, 59, 68, 77, 86, 95];
    if (currentAlgo.id === 'two_sum') return [10, 20, 35, 48, 55, 62, 79];
    if (currentAlgo.id === 'dutch_flag') return [2, 0, 1, 2, 1, 0, 2];
    return [45, 18, 72, 31, 89, 54, 23];
  };

  const [array, setArray] = useState(getDefaultArray);
  const [searchTarget, setSearchTarget] = useState(77);
  const [targetSum, setTargetSum] = useState(83);
  const [goalIndex, setGoalIndex] = useState(7); // Column for trapping rain water inspection
  const [quickAddVal, setQuickAddVal] = useState('50');

  const handleQuickAdd = () => {
    const val = Number(quickAddVal);
    if (!isNaN(val)) {
      setArray(prev => [...prev, val]);
      handleReset();
      log(`> Appended element ${val} to array.`);
    }
  };

  const handleQuickRemove = () => {
    if (array.length > 0) {
      const removed = array[array.length - 1];
      setArray(prev => prev.slice(0, -1));
      handleReset();
      log(`> Removed element ${removed} from array.`);
    }
  };

  // Playback & Animation Engine
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [animationSteps, setAnimationSteps] = useState([]);
  const timerRef = useRef(null);

  // Active step visual highlights
  const [pointers, setPointers] = useState({});
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const [eliminatedRange, setEliminatedRange] = useState(null);
  const [trappedWaterHeights, setTrappedWaterHeights] = useState([]);
  const [trappingWaterStats, setTrappingWaterStats] = useState({ leftMax: 0, rightMax: 0, totalTrapped: 0 });

  // Merge Sort High-Fidelity Divide-and-Conquer State
  const [activeStepType, setActiveStepType] = useState('INIT');
  const [activeDivideState, setActiveDivideState] = useState(null);
  const [activeMergeState, setActiveMergeState] = useState(null);
  const [activeRange, setActiveRange] = useState(null);

  // Code inspection & logging
  const [activeCodeLine, setActiveCodeLine] = useState(-1);
  const [logs, setLogs] = useState([
    { msg: `> ${currentAlgo.name} visualizer ready.`, isError: false }
  ]);
  const [actionBanner, setActionBanner] = useState('');

  const log = (msg, isError = false) => {
    setLogs(prev => [{ msg, isError, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 40));
  };

  // Re-seed data on algorithm switch
  useEffect(() => {
    const defaultArr = getDefaultArray();
    setArray(defaultArr);
    handleReset();
    let st = 77;
    let ts = 83;
    let gi = 7;
    if (currentAlgo.id === 'trapping_rain') {
      setGoalIndex(7);
      gi = 7;
    } else if (currentAlgo.id === 'binary_search') {
      setSearchTarget(77);
      st = 77;
    } else if (currentAlgo.id === 'two_sum') {
      setTargetSum(83);
      ts = 83;
    }
    log(`> Switched model to ${currentAlgo.name}.`);

    // Auto-generate steps immediately so Play button & step explanation are ready
    const steps = generateArraySteps(currentAlgo.id, defaultArr, {
      searchTarget: st,
      targetSum: ts,
      goalIndex: gi
    });
    if (steps && steps.length > 0) {
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      // apply initial step visual state
      const s0 = steps[0];
      if (s0.array) setArray(s0.array);
      if (s0.pointers !== undefined) setPointers(s0.pointers || {});
      if (s0.highlightedIndices !== undefined) setHighlightedIndices(s0.highlightedIndices || []);
      if (s0.swappingIndices !== undefined) setSwappingIndices(s0.swappingIndices || []);
      if (s0.sortedIndices) setSortedIndices(new Set(s0.sortedIndices));
      if (s0.eliminatedRange !== undefined) setEliminatedRange(s0.eliminatedRange);
      if (s0.waterHeights) setTrappedWaterHeights(s0.waterHeights);
      if (s0.waterStats) setTrappingWaterStats(s0.waterStats);
      if (s0.stepType !== undefined) setActiveStepType(s0.stepType);
      if (s0.actionBanner !== undefined) setActionBanner(s0.actionBanner);
    }
  }, [algoId]);

  // Playback Controller loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < animationSteps.length - 1) {
          applyStep(currentStepIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1000 / playbackSpeed);
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
  };

  // Trapping Rain Water Column Goal Breakdown Helper
  const computeGoalIndexBreakdown = (targetIdx) => {
    if (!array || targetIdx < 0 || targetIdx >= array.length) return null;
    let lMax = 0;
    for (let i = 0; i < targetIdx; i++) {
      if (array[i] > lMax) lMax = array[i];
    }
    let rMax = 0;
    for (let i = targetIdx + 1; i < array.length; i++) {
      if (array[i] > rMax) rMax = array[i];
    }
    const boundary = Math.min(lMax, rMax);
    const height = array[targetIdx];
    const trappedAtCol = Math.max(0, boundary - height);

    return {
      index: targetIdx,
      colHeight: height,
      leftMax: lMax,
      rightMax: rMax,
      boundary,
      trappedAtCol
    };
  };

  const goalCalculation = isTrappingRain ? computeGoalIndexBreakdown(goalIndex) : null;

  // Universal Dispatcher
  const handleExecute = () => {
    handleReset();
    const steps = generateArraySteps(currentAlgo.id, array, { searchTarget, targetSum });
    if (steps && steps.length > 0) {
      setAnimationSteps(steps);
      setCurrentStepIndex(0);
      applyStep(0);
      setIsPlaying(true);
    }
  };

  const currentCode = CODE_SNIPPETS[currentAlgo.codeId] || CODE_SNIPPETS.mergesort || CODE_SNIPPETS.bubblesort;
  const maxSortingVal = Math.max(...array.map(v => Math.abs(v)), 10);
  const compactUnitPx = 20; 
  const maxRainVal = Math.max(...array, 3);
  const rainTicks = Array.from({ length: maxRainVal + 2 }, (_, i) => i);

  // Dynamic Variable Tracker state
  const currentStepData = animationSteps[currentStepIndex] || {};

  const trackedVariables = useMemo(() => {
    const vars = [];
    const s = currentStepData;
    const ptrs = s.pointers || pointers || {};
    const rng = s.activeRange || activeRange || {};

    if (isMergeSort) {
      if (rng.l !== undefined) vars.push({ name: 'left', value: rng.l, color: '#38BDF8', type: 'index' });
      if (rng.m !== undefined) vars.push({ name: 'mid', value: rng.m, color: '#F59E0B', type: 'index' });
      if (rng.r !== undefined) vars.push({ name: 'right', value: rng.r, color: '#C084FC', type: 'index' });

      if (activeMergeState) {
        if (activeMergeState.p1 !== undefined) vars.push({ name: 'ptr_i (left)', value: activeMergeState.p1, color: '#F59E0B' });
        if (activeMergeState.p2 !== undefined) vars.push({ name: 'ptr_j (right)', value: activeMergeState.p2, color: '#EC4899' });
      }
      vars.push({ name: 'phase', value: activeMergeState ? 'MERGING' : activeDivideState ? 'DIVIDING' : 'IDLE', color: '#10B981' });
    } else if (isTrappingRain) {
      if (ptrs.left !== undefined) vars.push({ name: 'left', value: ptrs.left, color: '#38BDF8' });
      if (ptrs.right !== undefined) vars.push({ name: 'right', value: ptrs.right, color: '#C084FC' });
      if (s.waterStats) {
        vars.push({ name: 'leftMax', value: s.waterStats.leftMax, color: '#0284C7' });
        vars.push({ name: 'rightMax', value: s.waterStats.rightMax, color: '#9333EA' });
        vars.push({ name: 'waterUnits', value: s.waterStats.totalTrapped, color: '#06B6D4' });
      }
    } else {
      Object.entries(ptrs).forEach(([k, v]) => {
        vars.push({
          name: k,
          value: `${v} (val: ${array[v] !== undefined ? array[v] : 'ø'})`,
          color: k === 'pivot' || k === 'mid' ? '#F59E0B' : k.includes('min') || k === 'i' ? '#38BDF8' : '#EC4899'
        });
      });

      if (currentAlgo.id === 'binary_search') {
        vars.push({ name: 'target', value: searchTarget, color: '#10B981' });
      } else if (currentAlgo.id === 'two_sum') {
        vars.push({ name: 'targetSum', value: targetSum, color: '#10B981' });
      }
    }

    if (swappingIndices.length > 0) {
      vars.push({ name: 'swapping', value: `[${swappingIndices.join(', ')}]`, color: '#EF4444' });
    }
    return vars;
  }, [currentStepData, pointers, activeRange, isMergeSort, isTrappingRain, activeMergeState, activeDivideState, array, swappingIndices, currentAlgo.id, searchTarget, targetSum]);

  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      subtitle={currentAlgo.desc}
      currentPath={`/visualizer/array/${currentAlgo.id}`}
      category="ds"
      cornerCard={
        <QuickCornerCard
          title="Array Controls"
          subtitle="Instant Target & Array Ops"
          position="top-left"
          targetInput={{
            label: currentAlgo.id === 'two_sum' ? "Target Sum" : "Search Target",
            value: currentAlgo.id === 'two_sum' ? targetSum : searchTarget,
            onChange: (v) => currentAlgo.id === 'two_sum' ? setTargetSum(Number(v)) : setSearchTarget(Number(v)),
            onSearch: handleExecute,
            placeholder: currentAlgo.id === 'two_sum' ? "Target sum..." : "Search value..."
          }}
          addInput={{
            label: "Append Element",
            value: quickAddVal,
            onChange: setQuickAddVal,
            onAdd: handleQuickAdd,
            placeholder: "Val"
          }}
          removeInput={{
            label: "Pop Element",
            hint: "Removes rightmost element",
            onRemove: handleQuickRemove
          }}
          customActions={
            <div className="flex items-center gap-1.5 w-full pt-1">
              <button
                onClick={() => {
                  const shuffled = [...array].sort(() => Math.random() - 0.5);
                  setArray(shuffled);
                  handleReset();
                }}
                className="flex-1 py-1 rounded-xl bg-gray-100 dark:bg-[#423834] hover:bg-gray-200 dark:hover:bg-[#5C4E49] text-[10px] font-mono font-bold text-gray-700 dark:text-[#F0E2A4] transition-colors flex items-center justify-center gap-1"
                title="Randomize Array"
              >
                <span>🎲 Randomize</span>
              </button>
              <button
                onClick={handleExecute}
                className="flex-1 py-1 rounded-xl bg-[#AB526B] hover:bg-[#8F3E53] text-white text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1"
                title="Run Algorithm"
              >
                <span>▶ Run</span>
              </button>
            </div>
          }
        />
      }
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
        <ArrayControlsPanel
          currentAlgo={currentAlgo}
          onSelectAlgo={(id) => navigate(`/visualizer/array/${id}`)}
          searchTarget={searchTarget}
          setSearchTarget={setSearchTarget}
          targetSum={targetSum}
          setTargetSum={setTargetSum}
          isTrappingRain={isTrappingRain}
          goalIndex={goalIndex}
          setGoalIndex={setGoalIndex}
          arrayLength={array.length}
          onExecute={handleExecute}
          onRandomize={() => {
            const shuffled = [...array].sort(() => Math.random() - 0.5);
            setArray(shuffled);
            handleReset();
          }}
        />
      }
      playback={
        <VisualizerPlaybackBar
          currentStep={currentStepIndex}
          totalSteps={animationSteps.length}
          isPlaying={isPlaying}
          onPlay={() => {
            if (animationSteps.length === 0) {
              handleExecute();
              return;
            }
            if (currentStepIndex >= animationSteps.length - 1) {
              applyStep(0);
            }
            setIsPlaying(true);
          }}
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
          stepDescription={currentStepData.actionBanner || currentStepData.description || 'Step ready'}
        />
      }
      rightPanel={
        <div className="flex flex-col gap-4">
          <DryRunVariableTracker
            title={`${currentAlgo.name} State Tracker`}
            stepNumber={currentStepIndex + 1}
            totalSteps={animationSteps.length}
            actionBadge={{
              label: currentStepData.stepType || (isPlaying ? 'RUNNING' : 'STEP'),
              icon: <Activity size={12} />,
              bg: 'bg-[#AB526B]/15 text-[#AB526B] dark:text-[#F0E2A4] border border-[#AB526B]/30'
            }}
            codeStatement={
              currentStepData.codeLine !== undefined && currentCode?.javascript?.[currentStepData.codeLine]
                ? currentCode.javascript[currentStepData.codeLine]
                : currentStepData.actionBanner || '// Algorithm step'
            }
            explanation={currentStepData.description || currentStepData.log || 'Step trace active'}
            variables={trackedVariables}
          />

          <CodeInspector
            codeSnippets={currentCode}
            activeLine={activeCodeLine}
            variables={trackedVariables.reduce((acc, v) => ({ ...acc, [v.name]: v.value }), {})}
            title={`${currentAlgo.name} Source Code`}
          />
        </div>
      }
      consoleOutput={logs}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto gap-4">
        {/* Dynamic Action Banner */}
        {actionBanner && (
          <div className="w-full max-w-4xl px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-mono font-bold flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500 shrink-0" />
              <span>{actionBanner}</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider opacity-70">
              Step {currentStepIndex + 1} / {animationSteps.length}
            </span>
          </div>
        )}

        {/* Trapping Rain Water: Goal Inspection Breakdown HUD */}
        {isTrappingRain && goalCalculation && (
          <div className="w-full max-w-3xl bg-blue-50/70 dark:bg-[#1A2332] rounded-2xl border border-blue-200 dark:border-blue-900/60 p-3 sm:p-4 shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-950 dark:text-blue-200">
              <span className="font-mono flex items-center gap-1.5">
                <span>🎯 Goal Inspection (Column [{goalCalculation.index}])</span>
              </span>
              <span className="text-[11px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded-full font-black">
                Water = {goalCalculation.trappedAtCol} Units
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded-xl bg-white dark:bg-[#121A24] border border-blue-100 dark:border-blue-900/40">
                <span className="text-gray-400 block text-[9px] uppercase">Left Max</span>
                <span className="font-black text-sm text-blue-600">{goalCalculation.leftMax}</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-[#121A24] border border-blue-100 dark:border-blue-900/40">
                <span className="text-gray-400 block text-[9px] uppercase">Right Max</span>
                <span className="font-black text-sm text-purple-600">{goalCalculation.rightMax}</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-[#121A24] border border-blue-100 dark:border-blue-900/40">
                <span className="text-gray-400 block text-[9px] uppercase">Min Boundary</span>
                <span className="font-black text-sm text-amber-600">{goalCalculation.boundary}</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-[#121A24] border border-blue-100 dark:border-blue-900/40">
                <span className="text-gray-400 block text-[9px] uppercase">Col Height</span>
                <span className="font-black text-sm text-gray-700 dark:text-gray-300">{goalCalculation.colHeight}</span>
              </div>
            </div>
          </div>
        )}

        {/* Case A: Merge Sort Divide & Conquer View */}
        {isMergeSort ? (
          <MergeSortView
            array={array}
            activeRange={activeRange}
            sortedIndices={sortedIndices}
            activeDivideState={activeDivideState}
            activeMergeState={activeMergeState}
          />
        ) : isTrappingRain ? (
          /* Case B: Trapping Rain Water 2D Histogram View */
          <RainWaterView
            array={array}
            pointers={pointers}
            goalIndex={goalIndex}
            setGoalIndex={setGoalIndex}
            trappedWaterHeights={trappedWaterHeights}
            computeGoalIndexBreakdown={computeGoalIndexBreakdown}
            trappingWaterStats={trappingWaterStats}
            rainTicks={rainTicks}
            compactUnitPx={compactUnitPx}
          />
        ) : (
          /* Case C: Sorting, Searching & Array Bars View */
          <SortingBarsView
            array={array}
            swappingIndices={swappingIndices}
            highlightedIndices={highlightedIndices}
            sortedIndices={sortedIndices}
            pointers={pointers}
            eliminatedRange={eliminatedRange}
            maxSortingVal={maxSortingVal}
            currentAlgo={currentAlgo}
            searchTarget={searchTarget}
            targetSum={targetSum}
          />
        )}
      </div>
    </ResponsiveVisualizerShell>
  );
}
