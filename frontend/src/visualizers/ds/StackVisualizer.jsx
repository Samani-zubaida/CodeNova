import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import QuickCornerCard from '../../components/visualizer/QuickCornerCard';

import { STACK_ALGORITHMS } from './stack/constants/stackAlgorithms';
import { CODE_SNIPPETS } from './stack/constants/stackSnippets';
import {
  buildParenthesesSteps,
  buildPostfixSteps,
  buildInfixSteps,
  buildNgeSteps,
  buildDailyTempSteps,
  buildHistogramSteps,
  buildStockSpanSteps,
  buildValidParenWildcardSteps,
  buildBasicStackSteps,
  buildMinStackSteps
} from './stack/generators/stackStepGenerators';

import StackControlsPanel from './stack/components/StackControlsPanel';
import StackRightPanel from './stack/components/StackRightPanel';
import StackCanvasViews from './stack/views/StackCanvasViews';

// Audio feedback synthesizer
const playSynthTone = (type = 'push', isMuted = false) => {
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

    if (type === 'push') {
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'pop') {
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'peek' || type === 'match') {
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.21);
    }
  } catch (e) {}
};

export default function StackVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const [activeAlgo, setActiveAlgo] = useState(algoId || 'basic');

  const selectAlgorithm = (id) => {
    setActiveAlgo(id);
    navigate(`/visualizer/stack/${id}`);
  };

  useEffect(() => {
    if (algoId && algoId !== activeAlgo) {
      setActiveAlgo(algoId);
    }
  }, [algoId]);

  // Basic Stack state
  const [basicStack, setBasicStack] = useState([15, 30, 45, 60]);
  const [inputValue, setInputValue] = useState('75');
  const maxCapacity = 8;
  const [highlightIdx, setHighlightIdx] = useState(null);

  // Parentheses algorithm state
  const [bracketString, setBracketString] = useState('{[()]}');
  const [parenTokens, setParenTokens] = useState([]);
  const [parenActiveIdx, setParenActiveIdx] = useState(-1);
  const [parenStack, setParenStack] = useState([]);
  const [parenStatus, setParenStatus] = useState('idle'); // idle, valid, invalid

  // Postfix evaluation state
  const [postfixExpr, setPostfixExpr] = useState('5 1 2 + 4 * + 3 -');
  const [postfixTokens, setPostfixTokens] = useState([]);
  const [postfixActiveIdx, setPostfixActiveIdx] = useState(-1);
  const [postfixStack, setPostfixStack] = useState([]);
  const [postfixLastOp, setPostfixLastOp] = useState(null);

  // Infix to Postfix state
  const [infixExpr, setInfixExpr] = useState('A + B * ( C - D )');
  const [infixTokens, setInfixTokens] = useState([]);
  const [infixActiveIdx, setInfixActiveIdx] = useState(-1);
  const [infixOpStack, setInfixOpStack] = useState([]);
  const [postfixOutput, setPostfixOutput] = useState([]);

  // Next Greater Element state
  const [ngeInput, setNgeInput] = useState('4, 5, 2, 25, 7, 18');
  const [ngeArray, setNgeArray] = useState([4, 5, 2, 25, 7, 18]);
  const [ngeStack, setNgeStack] = useState([]); // indices
  const [ngeResult, setNgeResult] = useState(new Array(6).fill(null));
  const [ngeActiveIdx, setNgeActiveIdx] = useState(-1);

  // Min-Stack state
  const [minMainStack, setMinMainStack] = useState([18, 29, 12, 15]);
  const [minAuxStack, setMinAuxStack] = useState([18, 18, 12, 12]);
  const [minInputVal, setMinInputVal] = useState('8');

  // Daily Temperatures state
  const [tempInput, setTempInput] = useState('73, 74, 75, 71, 69, 72, 76, 73');
  const [tempArray, setTempArray] = useState([73, 74, 75, 71, 69, 72, 76, 73]);
  const [tempStack, setTempStack] = useState([]); // indices
  const [tempResult, setTempResult] = useState(new Array(8).fill(0));
  const [tempActiveIdx, setTempActiveIdx] = useState(-1);

  // Largest Rectangle in Histogram state
  const [histInput, setHistInput] = useState('2, 1, 5, 6, 2, 3');
  const [histHeights, setHistHeights] = useState([2, 1, 5, 6, 2, 3]);
  const [histStack, setHistStack] = useState([]); // indices
  const [histActiveIdx, setHistActiveIdx] = useState(-1);
  const [histMaxArea, setHistMaxArea] = useState(0);
  const [histActiveRect, setHistActiveRect] = useState(null); // { left, right, height, area }

  // Stock Span state
  const [spanInput, setSpanInput] = useState('100, 80, 60, 70, 60, 75, 85');
  const [spanPrices, setSpanPrices] = useState([100, 80, 60, 70, 60, 75, 85]);
  const [spanStack, setSpanStack] = useState([]); // [{ price, span, dayIdx }]
  const [spanResults, setSpanResults] = useState(new Array(7).fill(null));
  const [spanActiveIdx, setSpanActiveIdx] = useState(-1);

  // Valid Parentheses with Wildcards state
  const [wildcardInput, setWildcardInput] = useState('(*))');
  const [wildcardTokens, setWildcardTokens] = useState(['(', '*', ')', ')']);
  const [wildcardOpenStack, setWildcardOpenStack] = useState([]); // indices of '('
  const [wildcardStarStack, setWildcardStarStack] = useState([]); // indices of '*'
  const [wildcardActiveIdx, setWildcardActiveIdx] = useState(-1);
  const [wildcardStatus, setWildcardStatus] = useState('idle'); // idle, valid, invalid
  const [wildcardMatches, setWildcardMatches] = useState([]);

  // Shared playback & execution state
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [logs, setLogs] = useState(['> Stack Visualizer initialized. Ready for operations.']);

  // ELI5 Explanation State
  const [explanation, setExplanation] = useState({
    action: "Stack Ready (LIFO: Last-In, First-Out)",
    intuition: "Operations strictly mutate the TOP of the container. The most recently pushed item is the first one popped.",
    next: "Select an algorithm or perform operations using the control panel."
  });

  // Track active variables for DryRunVariableTracker
  const [activeVariables, setActiveVariables] = useState({
    topIndex: 3,
    topValue: 60,
    size: 4,
    capacity: 8,
    status: 'Ready'
  });

  const parenInput = bracketString;
  const setParenInput = setBracketString;
  const postfixInput = postfixExpr;
  const setPostfixInput = setPostfixExpr;
  const infixInput = infixExpr;
  const setInfixInput = setInfixExpr;
  const dailyTempInput = tempInput;
  const setDailyTempInput = setTempInput;
  const histogramInput = histInput;
  const setHistogramInput = setHistInput;
  const stockSpanInput = spanInput;
  const setStockSpanInput = setSpanInput;
  const validParenWildcardInput = wildcardInput;
  const setValidParenWildcardInput = setWildcardInput;
  const consoleLogs = logs;
  const peekingIdx = highlightIdx;
  const parenthesesStack = parenStack;
  const parenPairMap = {};
  const ngeResults = ngeResult;
  const postfixResult = postfixLastOp;
  const infixStack = infixOpStack;
  const infixOutput = postfixOutput;
  const tempTemps = tempArray;

  const [activeLine, setActiveLine] = useState(1);
  const [currentCodeSnippet, setCurrentCodeSnippet] = useState(CODE_SNIPPETS.basic);

  // Helper log function
  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 49)]);
  };

  // Sync code snippets whenever active algorithm changes
  useEffect(() => {
    setCurrentCodeSnippet(CODE_SNIPPETS[activeAlgo] || CODE_SNIPPETS.basic);
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIdx(0);
    setLogs([`> Switched algorithm mode to ${STACK_ALGORITHMS.find(a => a.id === activeAlgo)?.name}.`]);

    if (activeAlgo === 'basic') {
      const initSteps = buildBasicStackSteps(basicStack, parseInt(inputValue, 10) || 75);
      setSteps(initSteps);
      setCurrentStepIdx(0);
      setActiveVariables(initSteps[0].variables);
      setExplanation({
        action: "Basic LIFO Stack Operations",
        intuition: "Push adds to the top; Pop removes from the top; Peek inspects without removing.",
        next: "Click 'Push' or 'Pop' to see real-time state mutation."
      });
    } else if (activeAlgo === 'parentheses') {
      resetParentheses(bracketString);
    } else if (activeAlgo === 'postfix') {
      resetPostfix(postfixExpr);
    } else if (activeAlgo === 'infixToPostfix') {
      resetInfix(infixExpr);
    } else if (activeAlgo === 'nextGreater') {
      resetNge(ngeInput);
    } else if (activeAlgo === 'minStack') {
      setActiveVariables({
        mainTop: minMainStack[minMainStack.length - 1],
        currentMin: minAuxStack[minAuxStack.length - 1],
        size: minMainStack.length
      });
      setExplanation({
        action: "Min-Stack: O(1) Minimum Retrieval",
        intuition: "Two synchronized stacks: Main Stack stores items, Min Stack caches the running minimum at each height.",
        next: "Push or Pop to observe both stacks staying in sync."
      });
    } else if (activeAlgo === 'dailyTemp') {
      resetDailyTemp(tempInput);
    } else if (activeAlgo === 'histogram') {
      resetHistogram(histInput);
    } else if (activeAlgo === 'stockSpan') {
      resetStockSpan(spanInput);
    } else if (activeAlgo === 'validParenWildcard') {
      resetValidParenWildcard(wildcardInput);
    }
  }, [activeAlgo]);

  // =========================================================================
  // ALGORITHM 1: BASIC STACK
  // =========================================================================

  const handleBasicPush = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) {
      addLog("❌ Please enter a valid number to push.");
      return;
    }
    if (basicStack.length >= maxCapacity) {
      addLog(`⚠️ Stack Overflow! Capacity (${maxCapacity}) reached.`);
      playSynthTone('error', isMuted);
      return;
    }

    playSynthTone('push', isMuted);
    const newStack = [...basicStack, val];
    setBasicStack(newStack);
    setHighlightIdx(newStack.length - 1);
    addLog(`> PUSH: Element ${val} added onto top of stack (Index ${newStack.length - 1}).`);

    setActiveLine(5);
    setActiveVariables({
      topIndex: newStack.length - 1,
      topValue: val,
      size: newStack.length,
      capacity: maxCapacity,
      operation: 'PUSH',
      pushedVal: val
    });

    setExplanation({
      action: `Pushed ${val} onto top of Stack`,
      intuition: "In LIFO, newly appended items sit at the highest index and become the immediate top.",
      next: "You can push another value or pop the current top."
    });

    setTimeout(() => setHighlightIdx(null), 600);
  };

  const handleBasicPop = () => {
    if (basicStack.length === 0) {
      addLog("⚠️ Stack Underflow! Cannot pop from empty stack.");
      playSynthTone('error', isMuted);
      return;
    }

    playSynthTone('pop', isMuted);
    const popped = basicStack[basicStack.length - 1];
    const newStack = basicStack.slice(0, -1);
    setBasicStack(newStack);
    addLog(`> POP: Element ${popped} removed from top.`);

    setActiveLine(6);
    setActiveVariables({
      topIndex: newStack.length - 1,
      topValue: newStack.length > 0 ? newStack[newStack.length - 1] : 'empty',
      size: newStack.length,
      poppedValue: popped,
      operation: 'POP'
    });

    setExplanation({
      action: `Popped ${popped} from Stack top`,
      intuition: "The top item is removed in O(1) constant time without shifting any other items.",
      next: newStack.length > 0 ? `Current top is now ${newStack[newStack.length - 1]}` : "Stack is now empty."
    });
  };

  const handleBasicPeek = () => {
    if (basicStack.length === 0) {
      addLog("⚠️ Stack is empty. Nothing to peek.");
      return;
    }
    playSynthTone('peek', isMuted);
    const topIdx = basicStack.length - 1;
    setHighlightIdx(topIdx);
    addLog(`> PEEK: Top item is ${basicStack[topIdx]} at index [${topIdx}].`);

    setActiveLine(7);
    setActiveVariables({
      topIndex: topIdx,
      topValue: basicStack[topIdx],
      size: basicStack.length,
      operation: 'PEEK'
    });

    setExplanation({
      action: `Inspecting Top Element: ${basicStack[topIdx]}`,
      intuition: "Peek reads the top value without mutating the stack structure.",
      next: "No elements were removed."
    });

    setTimeout(() => setHighlightIdx(null), 700);
  };

  const handleBasicClear = () => {
    setBasicStack([]);
    addLog("> Stack cleared.");
    setActiveVariables({ topIndex: -1, topValue: 'empty', size: 0, capacity: maxCapacity });
  };

  // =========================================================================
  // ALGORITHM 2: BALANCED PARENTHESES GENERATOR
  // =========================================================================

  const resetParentheses = (inputStr) => {
    const chars = inputStr.replace(/\s+/g, '').split('');
    setParenTokens(chars);
    setParenActiveIdx(-1);
    setParenStack([]);
    setParenStatus('idle');
    buildParenthesesSteps(chars);
  };

  const applyParenStep = (step) => {
    if (!step) return;
    setParenActiveIdx(step.activeIdx);
    setParenStack(step.stack);
    setParenStatus(step.status);
    setActiveVariables(step.variables);
    setActiveLine(step.activeLine);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  // =========================================================================
  // ALGORITHM 3: POSTFIX (RPN) EVALUATOR GENERATOR
  // =========================================================================

  const resetPostfix = (exprStr) => {
    const tokens = exprStr.trim().split(/\s+/);
    setPostfixTokens(tokens);
    setPostfixActiveIdx(-1);
    setPostfixStack([]);
    setPostfixLastOp(null);
    buildPostfixSteps(tokens);
  };

  const applyPostfixStep = (step) => {
    if (!step) return;
    setPostfixActiveIdx(step.activeIdx);
    setPostfixStack(step.stack);
    setPostfixLastOp(step.lastOp);
    setActiveVariables(step.variables);
    setActiveLine(step.activeLine);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  // =========================================================================
  // ALGORITHM 4: INFIX TO POSTFIX (SHUNTING-YARD)
  // =========================================================================

  const resetInfix = (exprStr) => {
    const rawTokens = exprStr.replace(/([()+\-*\/^])/g, ' $1 ').trim().split(/\s+/).filter(Boolean);
    setInfixTokens(rawTokens);
    setInfixActiveIdx(-1);
    setInfixOpStack([]);
    setPostfixOutput([]);
    buildInfixSteps(rawTokens);
  };

  const applyInfixStep = (step) => {
    if (!step) return;
    setInfixActiveIdx(step.activeIdx);
    setInfixOpStack(step.opStack);
    setPostfixOutput(step.output);
    setActiveVariables(step.variables);
    setActiveLine(step.activeLine);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  // =========================================================================
  // ALGORITHM 5: NEXT GREATER ELEMENT (MONOTONIC STACK)
  // =========================================================================

  const resetNge = (rawInput) => {
    const nums = rawInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (nums.length === 0) return;
    setNgeArray(nums);
    setNgeStack([]);
    setNgeResult(new Array(nums.length).fill(null));
    setNgeActiveIdx(-1);
    buildNgeSteps(nums);
  };

  const applyNgeStep = (step) => {
    if (!step) return;
    setNgeActiveIdx(step.activeIdx);
    setNgeStack(step.stack);
    setNgeResult(step.result);
    setActiveVariables(step.variables);
    setActiveLine(step.activeLine);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  // =========================================================================
  // ALGORITHM 6: MIN-STACK DUAL STACK O(1)
  // =========================================================================

  const handleMinPush = () => {
    const val = parseInt(minInputVal, 10);
    if (isNaN(val)) return;
    if (minMainStack.length >= maxCapacity) {
      addLog("⚠️ Min-Stack capacity reached.");
      playSynthTone('error', isMuted);
      return;
    }

    playSynthTone('push', isMuted);
    const newMain = [...minMainStack, val];
    const currentMin = minAuxStack.length === 0 ? val : Math.min(val, minAuxStack[minAuxStack.length - 1]);
    const newAux = [...minAuxStack, currentMin];

    setMinMainStack(newMain);
    setMinAuxStack(newAux);
    addLog(`> PUSH MinStack(${val}): Main Stack added ${val}, Min Stack cached running min ${currentMin}.`);

    setActiveLine(7);
    setActiveVariables({
      pushedValue: val,
      runningMin: currentMin,
      stackHeight: newMain.length,
      getMinResult: currentMin
    });

    setExplanation({
      action: `Pushed ${val} (New Running Min: ${currentMin})`,
      intuition: `Min Stack duplicates height so that every element corresponds to the minimum element from bottom up to that level.`,
      next: `Calling getMin() returns ${currentMin} in O(1) constant time without scanning!`
    });
  };

  const handleMinPop = () => {
    if (minMainStack.length === 0) {
      addLog("⚠️ Min-Stack is empty.");
      playSynthTone('error', isMuted);
      return;
    }

    playSynthTone('pop', isMuted);
    const popped = minMainStack[minMainStack.length - 1];
    const newMain = minMainStack.slice(0, -1);
    const newAux = minAuxStack.slice(0, -1);
    setMinMainStack(newMain);
    setMinAuxStack(newAux);

    const newMin = newAux.length > 0 ? newAux[newAux.length - 1] : 'empty';
    addLog(`> POP MinStack: Removed ${popped}. Current min is now ${newMin}.`);

    setActiveLine(12);
    setActiveVariables({
      poppedValue: popped,
      newMin,
      stackHeight: newMain.length,
      getMinResult: newMin
    });

    setExplanation({
      action: `Popped ${popped} from both Main and Min Stacks`,
      intuition: "Popping simultaneously keeps the running min stack synchronized with the exact historical state.",
      next: newAux.length > 0 ? `Current O(1) minimum is ${newMin}` : "Stack empty."
    });
  };

  // =========================================================================
  // ALGORITHM 7: DAILY TEMPERATURES (MONOTONIC STACK)
  // =========================================================================

  const resetDailyTemp = (rawInput) => {
    const temps = rawInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (temps.length === 0) return;
    setTempArray(temps);
    setTempStack([]);
    setTempResult(new Array(temps.length).fill(0));
    setTempActiveIdx(-1);
    buildDailyTempSteps(temps);
  };

  const applyDailyTempStep = (step) => {
    if (!step) return;
    setTempActiveIdx(step.activeIdx);
    setTempStack(step.stack);
    setTempResult(step.result);
    setActiveVariables(step.variables);
    setActiveLine(step.activeLine);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  // =========================================================================
  // ALGORITHM 8: LARGEST RECTANGLE IN HISTOGRAM (MONOTONIC STACK)
  // =========================================================================

  const resetHistogram = (rawInput) => {
    const nums = rawInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (nums.length === 0) return;
    setHistHeights(nums);
    setHistStack([]);
    setHistActiveIdx(-1);
    setHistMaxArea(0);
    setHistActiveRect(null);
    buildHistogramSteps(nums);
  };

  const applyHistogramStep = (step) => {
    if (!step) return;
    setHistActiveIdx(step.activeIdx);
    setHistStack(step.stack);
    setHistMaxArea(step.maxArea);
    setHistActiveRect(step.activeRect);
    setActiveVariables(step.variables);
    setActiveLine(step.activeLine);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  // =========================================================================
  // ALGORITHM 9: ONLINE STOCK SPAN (MONOTONIC STACK)
  // =========================================================================

  const resetStockSpan = (rawInput) => {
    const nums = rawInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (nums.length === 0) return;
    setSpanPrices(nums);
    setSpanStack([]);
    setSpanResults(new Array(nums.length).fill(null));
    setSpanActiveIdx(-1);
    buildStockSpanSteps(nums);
  };

  const applyStockSpanStep = (step) => {
    if (!step) return;
    setSpanActiveIdx(step.activeIdx);
    setSpanStack(step.stack);
    setSpanResults(step.results);
    setActiveVariables(step.variables);
    setActiveLine(step.activeLine);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  // =========================================================================
  // ALGORITHM 10: VALID PARENTHESES WITH WILDCARDS (DUAL STACK)
  // =========================================================================
  const resetValidParenWildcard = (inputStr) => {

    const chars = inputStr.replace(/\s+/g, '').split('');
    setWildcardTokens(chars);
    setWildcardOpenStack([]);
    setWildcardStarStack([]);
    setWildcardActiveIdx(-1);
    setWildcardStatus('idle');
    setWildcardMatches([]);
    buildValidParenWildcardSteps(chars);
  };

  const applyValidParenWildcardStep = (step) => {
    if (!step) return;
    setWildcardActiveIdx(step.activeIdx);
    setWildcardOpenStack(step.openStack);
    setWildcardStarStack(step.starStack);
    setWildcardStatus(step.status);
    setWildcardMatches(step.matches || []);
    setActiveVariables(step.variables);
    setActiveLine(step.activeLine);
    setExplanation({
      action: step.action,
      intuition: step.intuition,
      next: step.next
    });
  };

  // =========================================================================

  // TIMELINE PLAYBACK DISPATCHER
  // =========================================================================
  const applyStepAtIndex = (idx) => {
    if (idx < 0 || idx >= steps.length) return;
    const step = steps[idx];
    if (activeAlgo === 'basic') {
      if (step.stack) setBasicStack(step.stack);
      if (step.highlightIdx !== undefined) setHighlightIdx(step.highlightIdx);
      if (step.variables) setActiveVariables(step.variables);
      if (step.activeLine) setActiveLine(step.activeLine);
      if (step.action) setExplanation({ action: step.action, intuition: step.intuition, next: step.next });
    }
    else if (activeAlgo === 'minStack') {
      if (step.mainStack) setMinMainStack(step.mainStack);
      if (step.auxStack) setMinAuxStack(step.auxStack);
      if (step.variables) setActiveVariables(step.variables);
      if (step.activeLine) setActiveLine(step.activeLine);
      if (step.action) setExplanation({ action: step.action, intuition: step.intuition, next: step.next });
    }
    else if (activeAlgo === 'parentheses') applyParenStep(step);
    else if (activeAlgo === 'postfix') applyPostfixStep(step);
    else if (activeAlgo === 'infixToPostfix') applyInfixStep(step);
    else if (activeAlgo === 'nextGreater') applyNgeStep(step);
    else if (activeAlgo === 'dailyTemp') applyDailyTempStep(step);
    else if (activeAlgo === 'histogram') applyHistogramStep(step);
    else if (activeAlgo === 'stockSpan') applyStockSpanStep(step);
    else if (activeAlgo === 'validParenWildcard') applyValidParenWildcardStep(step);
  };

  const handlePlayPause = () => {
    if (steps.length === 0) {
      if (activeAlgo === 'basic') {
        const initSteps = buildBasicStackSteps(basicStack, parseInt(inputValue, 10) || 75);
        setSteps(initSteps);
        setCurrentStepIdx(0);
        applyStepAtIndex(0);
        setIsPlaying(true);
        return;
      } else if (activeAlgo === 'minStack') {
        const initSteps = buildMinStackSteps(minMainStack, parseInt(minInputVal, 10) || 8);
        setSteps(initSteps);
        setCurrentStepIdx(0);
        applyStepAtIndex(0);
        setIsPlaying(true);
        return;
      }
      return;
    }
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
      applyStepAtIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(p => !p);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      applyStepAtIndex(nextIdx);
      playSynthTone('peek', isMuted);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      applyStepAtIndex(prevIdx);
      playSynthTone('peek', isMuted);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    applyStepAtIndex(0);
    addLog("> Playback timeline reset to start.");
  };

  // Automated playback ticker
  useEffect(() => {
    let timer;
    if (isPlaying && steps.length > 0) {
      timer = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          const nxt = currentStepIdx + 1;
          setCurrentStepIdx(nxt);
          applyStepAtIndex(nxt);
          playSynthTone('peek', isMuted);
        } else {
          setIsPlaying(false);
        }
      }, 1000 / playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps, playbackSpeed]);

  // =========================================================================

  return (
    <ResponsiveVisualizerShell
      title="Stack Data Structure & Algorithms"
      subtitle="Interactive LIFO chamber, Shunting-Yard, Monotonic Stack & RPN Evaluator"
      currentPath="/visualizer/stack"
      category="ds"
      cornerCard={
        <QuickCornerCard
          title="Stack LIFO Controls"
          subtitle="Instant Push & Pop"
          position="top-left"
          addInput={{
            label: "Push to Stack",
            value: inputValue,
            onChange: setInputValue,
            onAdd: handleBasicPush,
            placeholder: "Value"
          }}
          removeInput={{
            label: "Pop from Stack",
            hint: "Removes top element (LIFO)",
            onRemove: handleBasicPop
          }}
          customActions={
            <div className="flex items-center gap-1.5 w-full pt-1">
              <button
                onClick={handleBasicPeek}
                className="flex-1 py-1 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-[10px] font-mono font-bold text-teal-700 dark:text-teal-300 transition-colors flex items-center justify-center gap-1"
                title="Inspect top element"
              >
                <span>👁 Peek</span>
              </button>
              <button
                onClick={handleBasicClear}
                className="flex-1 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-[10px] font-mono font-bold text-rose-700 dark:text-rose-300 transition-colors flex items-center justify-center gap-1"
                title="Clear stack"
              >
                <span>🗑 Clear</span>
              </button>
            </div>
          }
        />
      }
      bannerAction={
        <div className="flex items-center gap-2">
          <Link
            to="/visualizer/stack"
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-teal-500 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Stack Hub</span>
          </Link>
          <ComplexityBadge
            complexity={
              STACK_ALGORITHMS.find(a => a.id === activeAlgo)?.badge || 'O(1)'
            }
          />
        </div>
      }
      controls={
        <StackControlsPanel
          activeAlgo={activeAlgo}
          selectAlgorithm={selectAlgorithm}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleBasicPush={handleBasicPush}
          handleBasicPop={handleBasicPop}
          handleBasicPeek={handleBasicPeek}
          handleBasicClear={handleBasicClear}
          basicStack={basicStack}
          maxCapacity={maxCapacity}
          parenInput={parenInput}
          setParenInput={setParenInput}
          resetParentheses={resetParentheses}
          postfixInput={postfixInput}
          setPostfixInput={setPostfixInput}
          resetPostfix={resetPostfix}
          infixInput={infixInput}
          setInfixInput={setInfixInput}
          resetInfix={resetInfix}
          ngeInput={ngeInput}
          setNgeInput={setNgeInput}
          resetNge={resetNge}
          minInputVal={minInputVal}
          setMinInputVal={setMinInputVal}
          handleMinPush={handleMinPush}
          handleMinPop={handleMinPop}
          minMainStack={minMainStack}
          dailyTempInput={dailyTempInput}
          setDailyTempInput={setDailyTempInput}
          resetDailyTemp={resetDailyTemp}
          histogramInput={histogramInput}
          setHistogramInput={setHistogramInput}
          resetHistogram={resetHistogram}
          stockSpanInput={stockSpanInput}
          setStockSpanInput={setStockSpanInput}
          resetStockSpan={resetStockSpan}
          validParenWildcardInput={validParenWildcardInput}
          setValidParenWildcardInput={setValidParenWildcardInput}
          resetValidParenWildcard={resetValidParenWildcard}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />
      }
      playback={
        <VisualizerPlaybackBar
          currentStep={currentStepIdx}
          totalSteps={steps.length}
          isPlaying={isPlaying}
          onPlay={handlePlayPause}
          onPause={handlePlayPause}
          onReset={handleReset}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          speed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          stepDescription={explanation.action || ''}
          isVoiceEnabled={!isMuted}
          onToggleVoice={() => setIsMuted(m => !m)}
        />
      }
      consoleOutput={consoleLogs}
      rightPanel={
        <StackRightPanel
          activeAlgo={activeAlgo}
          parenStatus={parenStatus}
          parenTokens={parenTokens}
          parenActiveIdx={parenActiveIdx}
          parenthesesStack={parenthesesStack}
          ngeArray={ngeArray}
          ngeActiveIdx={ngeActiveIdx}
          ngeStack={ngeStack}
          ngeResults={ngeResults}
          infixTokens={infixTokens}
          infixActiveIdx={infixActiveIdx}
          infixStack={infixStack}
          infixOutput={infixOutput}
          tempTemps={tempTemps}
          tempActiveIdx={tempActiveIdx}
          tempStack={tempStack}
          tempResult={tempResult}
          histHeights={histHeights}
          histActiveIdx={histActiveIdx}
          histStack={histStack}
          histMaxArea={histMaxArea}
          spanPrices={spanPrices}
          spanActiveIdx={spanActiveIdx}
          spanStack={spanStack}
          spanResults={spanResults}
          wildcardTokens={wildcardTokens}
          wildcardActiveIdx={wildcardActiveIdx}
          wildcardOpenStack={wildcardOpenStack}
          wildcardStarStack={wildcardStarStack}
          wildcardStatus={wildcardStatus}
          activeVariables={activeVariables}
          currentCodeSnippet={currentCodeSnippet}
          activeLine={activeLine}
        />
      }
    >
      <StackCanvasViews
        activeAlgo={activeAlgo}
        basicStack={basicStack}
        peekingIdx={peekingIdx}
        maxCapacity={maxCapacity}
        parenTokens={parenTokens}
        parenActiveIdx={parenActiveIdx}
        parenthesesStack={parenthesesStack}
        parenStatus={parenStatus}
        parenPairMap={parenPairMap}
        postfixTokens={postfixTokens}
        postfixActiveIdx={postfixActiveIdx}
        postfixStack={postfixStack}
        postfixResult={postfixResult}
        infixTokens={infixTokens}
        infixActiveIdx={infixActiveIdx}
        infixStack={infixStack}
        infixOutput={infixOutput}
        ngeArray={ngeArray}
        ngeActiveIdx={ngeActiveIdx}
        ngeStack={ngeStack}
        ngeResults={ngeResults}
        minMainStack={minMainStack}
        minAuxStack={minAuxStack}
        tempTemps={tempTemps}
        tempActiveIdx={tempActiveIdx}
        tempStack={tempStack}
        tempResult={tempResult}
        histHeights={histHeights}
        histActiveIdx={histActiveIdx}
        histStack={histStack}
        histMaxArea={histMaxArea}
        histActiveRect={histActiveRect}
        spanPrices={spanPrices}
        spanActiveIdx={spanActiveIdx}
        spanStack={spanStack}
        spanResults={spanResults}
        wildcardTokens={wildcardTokens}
        wildcardActiveIdx={wildcardActiveIdx}
        wildcardOpenStack={wildcardOpenStack}
        wildcardStarStack={wildcardStarStack}
        wildcardStatus={wildcardStatus}
        wildcardMatches={wildcardMatches}
      />
    </ResponsiveVisualizerShell>
  );
}
