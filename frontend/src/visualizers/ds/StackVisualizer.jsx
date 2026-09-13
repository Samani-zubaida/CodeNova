import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Eye, Compass, Layers, CheckCircle2, AlertCircle, ArrowDown,
  ArrowRight, Sparkles, Binary, Check, X, ShieldAlert, Cpu, Hash
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';

// Sound synthesizer for tactile audio feedback
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

// Available Stack Algorithms
const STACK_ALGORITHMS = [
  { id: 'basic', name: 'Basic LIFO Operations', badge: 'O(1)', desc: 'Push, Pop, Peek, Clear' },
  { id: 'parentheses', name: 'Balanced Parentheses', badge: 'O(n)', desc: 'Bracket Matching & Validation' },
  { id: 'postfix', name: 'RPN Postfix Evaluation', badge: 'O(n)', desc: 'Evaluate Math Expressions' },
  { id: 'infixToPostfix', name: 'Infix to Postfix', badge: 'O(n)', desc: 'Shunting-Yard Parser' },
  { id: 'nextGreater', name: 'Next Greater Element', badge: 'O(n)', desc: 'Monotonic Decreasing Stack' },
  { id: 'minStack', name: 'Min-Stack O(1)', badge: 'O(1)', desc: 'Dual Stack Running Minimum' }
];

const CODE_SNIPPETS = {
  basic: {
    javascript: `// Stack (LIFO) Class
class Stack {
  constructor() { this.items = []; }
  push(val) { this.items.push(val); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}`,
    python: `class Stack:
    def __init__(self): self.items = []
    def push(self, val): self.items.append(val)
    def pop(self): return self.items.pop() if self.items else None
    def peek(self): return self.items[-1] if self.items else None`,
    cpp: `#include <stack>
std::stack<int> s;
s.push(42);
int top = s.top();
s.pop();`,
    java: `import java.util.Stack;
Stack<Integer> s = new Stack<>();
s.push(42);
int top = s.peek();
s.pop();`
  },
  parentheses: {
    javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let c of s) {
    if ('({['.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}`,
    python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in "({[":
            stack.append(char)
        elif not stack or stack.pop() != mapping[char]:
            return False
    return len(stack) == 0`,
    cpp: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;
        }
    }
    return st.empty();
}`,
    java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') stack.push(c);
        else if (stack.isEmpty()) return false;
        else if (c == ')' && stack.pop() != '(') return false;
        else if (c == '}' && stack.pop() != '{') return false;
        else if (c == ']' && stack.pop() != '[') return false;
    }
    return stack.isEmpty();
}`
  },
  postfix: {
    javascript: `function evalRPN(tokens) {
  const stack = [];
  for (let t of tokens) {
    if (!isNaN(t)) stack.push(Number(t));
    else {
      const b = stack.pop(), a = stack.pop();
      if (t === '+') stack.push(a + b);
      if (t === '-') stack.push(a - b);
      if (t === '*') stack.push(a * b);
      if (t === '/') stack.push(Math.trunc(a / b));
    }
  }
  return stack.pop();
}`,
    python: `def evalRPN(tokens: list[str]) -> int:
    stack = []
    for t in tokens:
        if t not in "+-*/":
            stack.append(int(t))
        else:
            b, a = stack.pop(), stack.pop()
            if t == '+': stack.append(a + b)
            elif t == '-': stack.append(a - b)
            elif t == '*': stack.append(a * b)
            elif t == '/': stack.append(int(a / b))
    return stack[0]`,
    cpp: `int evalRPN(vector<string>& tokens) {
    stack<int> st;
    for (string& t : tokens) {
        if (t != "+" && t != "-" && t != "*" && t != "/") st.push(stoi(t));
        else {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if (t == "+") st.push(a + b);
            if (t == "-") st.push(a - b);
            if (t == "*") st.push(a * b);
            if (t == "/") st.push(a / b);
        }
    }
    return st.top();
}`,
    java: `public int evalRPN(String[] tokens) {
    Stack<Integer> stack = new Stack<>();
    for (String t : tokens) {
        if (!"+-*/".contains(t)) stack.push(Integer.parseInt(t));
        else {
            int b = stack.pop(), a = stack.pop();
            if (t.equals("+")) stack.push(a + b);
            if (t.equals("-")) stack.push(a - b);
            if (t.equals("*")) stack.push(a * b);
            if (t.equals("/")) stack.push(a / b);
        }
    }
    return stack.pop();
}`
  },
  infixToPostfix: {
    javascript: `function infixToPostfix(expr) {
  const prec = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
  const stack = [], out = [];
  for (let c of expr.split(' ')) {
    if (!isNaN(c) || /[A-Za-z]/.test(c)) out.push(c);
    else if (c === '(') stack.push(c);
    else if (c === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') out.push(stack.pop());
      stack.pop();
    } else {
      while (stack.length && prec[stack[stack.length - 1]] >= prec[c]) out.push(stack.pop());
      stack.push(c);
    }
  }
  while (stack.length) out.push(stack.pop());
  return out.join(' ');
}`,
    python: `def infixToPostfix(expression: str) -> str:
    prec = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    stack, output = [], []
    for token in expression.split():
        if token.isalnum(): output.append(token)
        elif token == '(': stack.append(token)
        elif token == ')':
            while stack and stack[-1] != '(': output.append(stack.pop())
            stack.pop()
        else:
            while stack and prec.get(stack[-1], 0) >= prec.get(token, 0):
                output.append(stack.pop())
            stack.append(token)
    while stack: output.append(stack.pop())
    return ' '.join(output)`,
    cpp: `// C++ Shunting-Yard Infix to Postfix Algorithm`,
    java: `// Java Shunting-Yard Infix to Postfix Algorithm`
  },
  nextGreater: {
    javascript: `function nextGreaterElement(nums) {
  const n = nums.length;
  const res = new Array(n).fill(-1);
  const stack = []; // stores indices
  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      res[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return res;
}`,
    python: `def nextGreaterElements(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    stack = [] # stores indices
    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            res[stack.pop()] = nums[i]
        stack.append(i)
    return res`,
    cpp: `vector<int> nextGreaterElements(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, -1);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            res[st.top()] = nums[i]; st.pop();
        }
        st.push(i);
    }
    return res;
}`,
    java: `public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    Stack<Integer> stack = new Stack<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            res[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return res;
}`
  },
  minStack: {
    javascript: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    const min = this.minStack.length === 0 ? val : Math.min(val, this.getMin());
    this.minStack.push(min);
  }
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return this.minStack[this.minStack.length - 1]; } // O(1)
}`,
    python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    def push(self, val: int):
        self.stack.append(val)
        current_min = val if not self.min_stack else min(val, self.min_stack[-1])
        self.min_stack.append(current_min)
    def pop(self):
        self.stack.pop()
        self.min_stack.pop()
    def getMin(self) -> int:
        return self.min_stack[-1]`,
    cpp: `class MinStack {
    stack<int> s, minS;
public:
    void push(int val) {
        s.push(val);
        if (minS.empty() || val <= minS.top()) minS.push(val);
        else minS.push(minS.top());
    }
    void pop() { s.pop(); minS.pop(); }
    int getMin() { return minS.top(); }
};`,
    java: `class MinStack {
    Stack<Integer> stack = new Stack<>();
    Stack<Integer> minStack = new Stack<>();
    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val);
        else minStack.push(minStack.peek());
    }
    public void pop() { stack.pop(); minStack.pop(); }
    public int getMin() { return minStack.peek(); }
}`
  }
};

export default function StackVisualizer() {
  // Algorithm selection
  const [activeAlgo, setActiveAlgo] = useState('basic');

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
      setActiveVariables({ topIndex: basicStack.length - 1, topValue: basicStack[basicStack.length - 1] ?? 'null', size: basicStack.length, capacity: maxCapacity });
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

  const buildParenthesesSteps = (tokens) => {
    const recorded = [];
    const st = [];
    const matchMap = { ')': '(', '}': '{', ']': '[' };

    recorded.push({
      action: "Begin validation scan",
      intuition: "Scan expression from left to right. Push open brackets; match and pop corresponding closing brackets.",
      next: "Examine first character.",
      tokens: [...tokens],
      activeIdx: -1,
      stack: [],
      status: 'idle',
      variables: { index: 0, char: tokens[0] || 'none', stackSize: 0, status: 'Scanning' },
      activeLine: 4
    });

    let isValid = true;
    for (let i = 0; i < tokens.length; i++) {
      const c = tokens[i];
      if ('({['.includes(c)) {
        st.push(c);
        recorded.push({
          action: `Open bracket '${c}' encountered at [${i}]`,
          intuition: `Open bracket requires a matching '${c === '(' ? ')' : c === '{' ? '}' : ']'}' in the future. Push onto stack.`,
          next: i + 1 < tokens.length ? `Next character is '${tokens[i + 1]}'` : "End of string reached.",
          tokens: [...tokens],
          activeIdx: i,
          stack: [...st],
          status: 'scanning',
          variables: { index: i, char: c, stackTop: c, stackSize: st.length },
          activeLine: 5
        });
      } else if (')}]'.includes(c)) {
        if (st.length === 0) {
          isValid = false;
          recorded.push({
            action: `Premature closing bracket '${c}' at [${i}] with EMPTY stack!`,
            intuition: "Cannot match closing bracket because there are no pending opening brackets.",
            next: "Validation failed: Unmatched closer.",
            tokens: [...tokens],
            activeIdx: i,
            stack: [],
            status: 'invalid',
            variables: { index: i, char: c, error: 'Empty Stack on Closer', isValid: false },
            activeLine: 6
          });
          break;
        }

        const top = st.pop();
        if (top !== matchMap[c]) {
          isValid = false;
          recorded.push({
            action: `Mismatched bracket! Expected matching closing bracket for '` + top + `', got '` + c + `'`,
            intuition: `LIFO violation: '${c}' does not match the most recently opened bracket '${top}'.`,
            next: "Validation failed: Bracket mismatch.",
            tokens: [...tokens],
            activeIdx: i,
            stack: [...st],
            status: 'invalid',
            variables: { index: i, expected: matchMap[c], got: top, isValid: false },
            activeLine: 6
          });
          break;
        } else {
          recorded.push({
            action: `Bracket match successful! Matched '${top}' with '${c}'`,
            intuition: `Popped '${top}' from stack. Sub-expression is balanced.`,
            next: i + 1 < tokens.length ? `Proceed to token [${i + 1}]: '${tokens[i + 1]}'` : "All tokens processed.",
            tokens: [...tokens],
            activeIdx: i,
            stack: [...st],
            status: 'scanning',
            variables: { index: i, matchedPair: `${top}${c}`, remainingStack: st.length },
            activeLine: 6
          });
        }
      }
    }

    if (isValid) {
      if (st.length === 0) {
        recorded.push({
          action: "✅ Expression is perfectly BALANCED!",
          intuition: "Every opening bracket found its exact closing partner in proper nested order.",
          next: "Algorithm complete.",
          tokens: [...tokens],
          activeIdx: tokens.length,
          stack: [],
          status: 'valid',
          variables: { result: 'BALANCED', isValid: true, stackSize: 0 },
          activeLine: 8
        });
      } else {
        recorded.push({
          action: `❌ Unbalanced! ${st.length} opening bracket(s) never closed.`,
          intuition: `Remaining unclosed brackets in stack: [${st.join(', ')}].`,
          next: "Validation failed: Missing closing bracket.",
          tokens: [...tokens],
          activeIdx: tokens.length,
          stack: [...st],
          status: 'invalid',
          variables: { result: 'UNBALANCED', unclosed: st.join(' '), isValid: false },
          activeLine: 8
        });
      }
    }

    setSteps(recorded);
    setCurrentStepIdx(0);
    applyParenStep(recorded[0]);
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

  const buildPostfixSteps = (tokens) => {
    const recorded = [];
    const st = [];

    recorded.push({
      action: "RPN Evaluation initialized",
      intuition: "Operands are pushed onto stack. When an operator is encountered, pop 2 operands, evaluate, and push result back.",
      next: "Read first token from left to right.",
      tokens: [...tokens],
      activeIdx: -1,
      stack: [],
      lastOp: null,
      variables: { tokenIndex: 0, stackSize: 0 },
      activeLine: 2
    });

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (!isNaN(t)) {
        const num = Number(t);
        st.push(num);
        recorded.push({
          action: `Encountered operand ${num} -> Push to stack`,
          intuition: "Numbers wait in the LIFO stack until an operator consumes them.",
          next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Finish evaluation.",
          tokens: [...tokens],
          activeIdx: i,
          stack: [...st],
          lastOp: null,
          variables: { tokenIndex: i, token: num, isOperand: true, stackTop: num, stackSize: st.length },
          activeLine: 4
        });
      } else if (['+', '-', '*', '/', '^'].includes(t)) {
        if (st.length < 2) {
          recorded.push({
            action: `⚠️ Error: Not enough operands for operator '${t}'!`,
            intuition: "Binary operators require at least 2 values in stack.",
            next: "Evaluation failed.",
            tokens: [...tokens],
            activeIdx: i,
            stack: [...st],
            lastOp: 'error',
            variables: { error: 'Stack Underflow on Operator', operator: t },
            activeLine: 6
          });
          break;
        }

        const b = st.pop();
        const a = st.pop();
        let res = 0;
        if (t === '+') res = a + b;
        else if (t === '-') res = a - b;
        else if (t === '*') res = a * b;
        else if (t === '/') res = Math.trunc(a / b);
        else if (t === '^') res = Math.pow(a, b);

        st.push(res);
        recorded.push({
          action: `Applied '${t}': ${a} ${t} ${b} = ${res}`,
          intuition: `Popped b=${b} (second operand) and a=${a} (first operand). Computed ${a} ${t} ${b} = ${res} and pushed ${res} back.`,
          next: i + 1 < tokens.length ? `Next token is '${tokens[i + 1]}'` : "All tokens processed.",
          tokens: [...tokens],
          activeIdx: i,
          stack: [...st],
          lastOp: { a, b, op: t, result: res },
          variables: { operator: t, operandA: a, operandB: b, computedResult: res, stackSize: st.length },
          activeLine: 7
        });
      }
    }

    if (st.length === 1) {
      recorded.push({
        action: `🎉 Final Evaluation Result = ${st[0]}`,
        intuition: "Expression evaluated completely. The single value remaining in the stack is the final answer.",
        next: "RPN evaluation complete.",
        tokens: [...tokens],
        activeIdx: tokens.length,
        stack: [...st],
        lastOp: null,
        variables: { finalResult: st[0], completed: true },
        activeLine: 12
      });
    }

    setSteps(recorded);
    setCurrentStepIdx(0);
    applyPostfixStep(recorded[0]);
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

  const buildInfixSteps = (tokens) => {
    const prec = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const recorded = [];
    const opStack = [];
    const out = [];

    recorded.push({
      action: "Shunting-Yard Parser initialized",
      intuition: "Operands stream straight to output. Operators wait on stack until lower/equal precedence operators force them to pop.",
      next: "Parse first token.",
      activeIdx: -1,
      opStack: [],
      output: [],
      variables: { index: 0, outputLength: 0, stackSize: 0 },
      activeLine: 2
    });

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (!isNaN(t) || /[a-zA-Z]/.test(t)) {
        out.push(t);
        recorded.push({
          action: `Operand '${t}' streamed directly to Output`,
          intuition: "Operands preserve their relative left-to-right order in Reverse Polish Notation.",
          next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Empty remaining stack.",
          activeIdx: i,
          opStack: [...opStack],
          output: [...out],
          variables: { token: t, type: 'OPERAND', output: out.join(' ') },
          activeLine: 5
        });
      } else if (t === '(') {
        opStack.push(t);
        recorded.push({
          action: "Open parenthesis '(' pushed to Operator Stack",
          intuition: "'(' creates an isolated sub-expression frame with highest grouping precedence.",
          next: `Parse next token inside parenthesis.`,
          activeIdx: i,
          opStack: [...opStack],
          output: [...out],
          variables: { token: t, type: 'OPEN_PAREN', stack: opStack.join(' ') },
          activeLine: 6
        });
      } else if (t === ')') {
        recorded.push({
          action: "Closing parenthesis ')' found -> Pop operators until '('",
          intuition: "Sub-expression finished. Unwind operators inside this parenthesized block to output.",
          next: "Popping operators...",
          activeIdx: i,
          opStack: [...opStack],
          output: [...out],
          variables: { token: t, type: 'CLOSE_PAREN' },
          activeLine: 8
        });

        while (opStack.length && opStack[opStack.length - 1] !== '(') {
          const popped = opStack.pop();
          out.push(popped);
          recorded.push({
            action: `Popped '${popped}' to output buffer`,
            intuition: `Operator '${popped}' inside parentheses evaluated and emitted to postfix.`,
            next: opStack[opStack.length - 1] === '(' ? "Discard matching '('" : "Continue popping...",
            activeIdx: i,
            opStack: [...opStack],
            output: [...out],
            variables: { poppedOperator: popped, output: out.join(' ') },
            activeLine: 9
          });
        }
        if (opStack.length && opStack[opStack.length - 1] === '(') {
          opStack.pop(); // discard '('
          recorded.push({
            action: "Discarded matching '(' from stack",
            intuition: "Parentheses themselves do not appear in the final postfix expression.",
            next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Empty remaining stack.",
            activeIdx: i,
            opStack: [...opStack],
            output: [...out],
            variables: { discarded: '()', stack: opStack.join(' ') },
            activeLine: 10
          });
        }
      } else if (['+', '-', '*', '/', '^'].includes(t)) {
        while (
          opStack.length &&
          opStack[opStack.length - 1] !== '(' &&
          prec[opStack[opStack.length - 1]] >= prec[t]
        ) {
          const popped = opStack.pop();
          out.push(popped);
          recorded.push({
            action: `Operator '${popped}' has higher/equal precedence (>= '${t}') -> Pop to output`,
            intuition: `Precedence of '${popped}' (${prec[popped]}) >= '${t}' (${prec[t]}). Higher precedence operations must execute first.`,
            next: "Check next operator on stack.",
            activeIdx: i,
            opStack: [...opStack],
            output: [...out],
            variables: { incoming: t, poppedHigherPrec: popped, output: out.join(' ') },
            activeLine: 12
          });
        }

        opStack.push(t);
        recorded.push({
          action: `Pushed '${t}' onto Operator Stack`,
          intuition: `'${t}' waits until its right operand or lower precedence operator arrives.`,
          next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Flush stack.",
          activeIdx: i,
          opStack: [...opStack],
          output: [...out],
          variables: { pushedOp: t, prec: prec[t], stack: opStack.join(' ') },
          activeLine: 13
        });
      }
    }

    while (opStack.length) {
      const popped = opStack.pop();
      out.push(popped);
      recorded.push({
        action: `Flushed remaining operator '${popped}' to output`,
        intuition: "End of expression reached. Flush any remaining deferred operators.",
        next: opStack.length ? "Flush next operator" : "Complete.",
        activeIdx: tokens.length,
        opStack: [...opStack],
        output: [...out],
        variables: { flushedOp: popped, output: out.join(' ') },
        activeLine: 16
      });
    }

    recorded.push({
      action: `🎉 Infix to Postfix Complete: "${out.join(' ')}"`,
      intuition: "Unambiguous Reverse Polish Notation ready for O(n) linear evaluation without brackets.",
      next: "Conversion finished.",
      activeIdx: tokens.length,
      opStack: [],
      output: [...out],
      variables: { finalPostfix: out.join(' '), completed: true },
      activeLine: 18
    });

    setSteps(recorded);
    setCurrentStepIdx(0);
    applyInfixStep(recorded[0]);
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

  const buildNgeSteps = (nums) => {
    const n = nums.length;
    const res = new Array(n).fill(-1);
    const stack = []; // store indices
    const recorded = [];

    recorded.push({
      action: "Monotonic Stack NGE initialized",
      intuition: "We maintain indices of elements in decreasing order. When we see a larger number, it resolves the next greater element for smaller items on top!",
      next: "Inspect first element.",
      activeIdx: -1,
      stack: [],
      result: [...res],
      variables: { currentIndex: 0, stack: '[]' },
      activeLine: 3
    });

    for (let i = 0; i < n; i++) {
      const currentVal = nums[i];

      recorded.push({
        action: `Examining nums[${i}] = ${currentVal}`,
        intuition: `Compare current value ${currentVal} against values pointed to by top of stack.`,
        next: stack.length ? `Check if ${currentVal} > nums[${stack[stack.length - 1]}] (${nums[stack[stack.length - 1]]})` : "Stack empty: Push index directly.",
        activeIdx: i,
        stack: [...stack],
        result: [...res],
        variables: { currentIndex: i, currentVal, stackTopIdx: stack[stack.length - 1] ?? 'empty' },
        activeLine: 5
      });

      while (stack.length && nums[stack[stack.length - 1]] < currentVal) {
        const topIdx = stack.pop();
        res[topIdx] = currentVal;
        recorded.push({
          action: `💥 Found Next Greater: nums[${i}] (${currentVal}) > nums[${topIdx}] (${nums[topIdx]})`,
          intuition: `The first element to the right of index ${topIdx} larger than ${nums[topIdx]} is ${currentVal}! Set res[${topIdx}] = ${currentVal}.`,
          next: stack.length ? `Continue popping if top < ${currentVal}` : `Push current index ${i} to stack.`,
          activeIdx: i,
          stack: [...stack],
          result: [...res],
          variables: { resolvedIndex: topIdx, resolvedVal: nums[topIdx], nextGreater: currentVal },
          activeLine: 7
        });
      }

      stack.push(i);
      recorded.push({
        action: `Pushed index ${i} (value ${currentVal}) onto monotonic stack`,
        intuition: `Stack maintains descending invariant: [${stack.map(idx => nums[idx]).join(', ')}].`,
        next: i + 1 < n ? `Proceed to index ${i + 1}` : "End of array reached. Remaining items have no next greater element.",
        activeIdx: i,
        stack: [...stack],
        result: [...res],
        variables: { pushedIndex: i, currentStackValues: stack.map(idx => nums[idx]).join(' ') },
        activeLine: 9
      });
    }

    recorded.push({
      action: "✅ Next Greater Element search complete!",
      intuition: "Indices left on stack have no larger element to their right, hence they remain -1.",
      next: "All elements processed in O(n) time.",
      activeIdx: n,
      stack: [...stack],
      result: [...res],
      variables: { completed: true, finalResults: res.join(', ') },
      activeLine: 11
    });

    setSteps(recorded);
    setCurrentStepIdx(0);
    applyNgeStep(recorded[0]);
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
  // TIMELINE PLAYBACK DISPATCHER
  // =========================================================================
  const applyStepAtIndex = (idx) => {
    if (idx < 0 || idx >= steps.length) return;
    const step = steps[idx];
    if (activeAlgo === 'parentheses') applyParenStep(step);
    else if (activeAlgo === 'postfix') applyPostfixStep(step);
    else if (activeAlgo === 'infixToPostfix') applyInfixStep(step);
    else if (activeAlgo === 'nextGreater') applyNgeStep(step);
  };

  const handlePlayPause = () => {
    if (steps.length === 0) return;
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
  // CONTROLS PANEL (LEFT SIDEBAR)
  // =========================================================================
  const renderControls = (
    <div className="flex flex-col gap-4 text-xs">
      {/* 1. Algorithm Selection Hub */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Stack Algorithm Suite
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {STACK_ALGORITHMS.map(a => (
            <button
              key={a.id}
              onClick={() => setActiveAlgo(a.id)}
              className={`flex items-center justify-between p-2 rounded-xl text-left font-bold transition-all border ${
                activeAlgo === a.id
                  ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'bg-white/60 dark:bg-[#141416] border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:border-teal-500/40'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs">{a.name}</span>
                <span className="text-[9px] text-gray-400 font-normal">{a.desc}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400">
                {a.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Algorithm Specific Controls */}
      {/* MODE 1: BASIC STACK */}
      {activeAlgo === 'basic' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            LIFO Operations
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Value"
              className="w-20 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={handleBasicPush}
              className="flex-1 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <Plus size={14} /> Push
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handleBasicPop}
              className="py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <ArrowDown size={13} /> Pop
            </button>
            <button
              onClick={handleBasicPeek}
              className="py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <Eye size={13} /> Peek
            </button>
            <button
              onClick={handleBasicClear}
              className="py-1.5 bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: PARENTHESES */}
      {activeAlgo === 'parentheses' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Bracket String
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={bracketString}
              onChange={e => setBracketString(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => resetParentheses(bracketString)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Test
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '{[()]}', val: '{[()]}' },
                { label: '({[)]}', val: '({[)]}' },
                { label: '((()){[]})', val: '((()){[]})' },
                { label: '{[(])}', val: '{[(])}' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setBracketString(p.val); resetParentheses(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-teal-500/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: POSTFIX */}
      {activeAlgo === 'postfix' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            RPN Expression (Space separated)
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={postfixExpr}
              onChange={e => setPostfixExpr(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => resetPostfix(postfixExpr)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Parse
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '5 1 2 + 4 * + 3 -', val: '5 1 2 + 4 * + 3 -' },
                { label: '2 3 + 4 *', val: '2 3 + 4 *' },
                { label: '10 6 9 3 + -11 * / *', val: '10 6 9 3 + -11 * / *' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setPostfixExpr(p.val); resetPostfix(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-teal-500/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: INFIX TO POSTFIX */}
      {activeAlgo === 'infixToPostfix' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Infix Expression
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={infixExpr}
              onChange={e => setInfixExpr(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => resetInfix(infixExpr)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Convert
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: 'A + B * ( C - D )', val: 'A + B * ( C - D )' },
                { label: '( A + B ) * C', val: '( A + B ) * C' },
                { label: 'A + B * C / D - E', val: 'A + B * C / D - E' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setInfixExpr(p.val); resetInfix(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-teal-500/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 5: NEXT GREATER ELEMENT */}
      {activeAlgo === 'nextGreater' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Array (Comma separated)
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={ngeInput}
              onChange={e => setNgeInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => resetNge(ngeInput)}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              Analyze
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 font-bold">PRESETS</span>
            <div className="flex flex-wrap gap-1">
              {[
                { label: '4, 5, 2, 25, 7, 18', val: '4, 5, 2, 25, 7, 18' },
                { label: '13, 7, 6, 12, 10', val: '13, 7, 6, 12, 10' },
                { label: '5, 4, 3, 2, 1', val: '5, 4, 3, 2, 1' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => { setNgeInput(p.val); resetNge(p.val); }}
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 hover:bg-teal-500/10 text-[10px] font-mono text-gray-700 dark:text-gray-300 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 6: MIN STACK */}
      {activeAlgo === 'minStack' && (
        <div className="p-3 bg-white/70 dark:bg-[#151518] rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col gap-2.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Min-Stack Dual Operations
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={minInputVal}
              onChange={e => setMinInputVal(e.target.value)}
              placeholder="Value"
              className="w-20 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={handleMinPush}
              className="flex-1 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <Plus size={14} /> Push
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleMinPop}
              className="py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <ArrowDown size={13} /> Pop
            </button>
            <div className="py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-lg text-amber-700 dark:text-amber-300 font-black text-center text-xs flex items-center justify-center gap-1">
              <span>getMin():</span>
              <span className="font-mono text-sm underline">
                {minAuxStack.length > 0 ? minAuxStack[minAuxStack.length - 1] : 'empty'}
              </span>
            </div>
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
  // AUXILIARY DATA STRUCTURE HUD (RIGHT PANEL)
  // =========================================================================
  const renderRightPanel = (
    <div className="flex flex-col gap-4">
      {/* 1. Dedicated Auxiliary HUD per Algorithm */}
      {activeAlgo === 'parentheses' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-teal-500/20 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Bracket Match Status
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
              parenStatus === 'valid'
                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                : parenStatus === 'invalid'
                ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                : 'bg-teal-500/10 text-teal-600'
            }`}>
              {parenStatus}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Active bracket stack size: <span className="font-mono font-bold text-teal-500">{parenStack.length}</span>
          </div>
        </div>
      )}

      {activeAlgo === 'nextGreater' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-teal-500/20 shadow-xs flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Next Greater Lookup Table
          </span>
          <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-center font-bold border-b border-gray-200 dark:border-white/10 pb-1 text-gray-400">
            <span>Index</span>
            <span>Value</span>
            <span>Next Greater</span>
          </div>
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
            {ngeArray.map((val, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 gap-1 text-xs font-mono text-center py-1 rounded transition-all ${
                  ngeActiveIdx === idx ? 'bg-amber-500/20 text-amber-500 font-black' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>[{idx}]</span>
                <span>{val}</span>
                <span className={ngeResult[idx] !== null && ngeResult[idx] !== -1 ? 'text-emerald-500 font-black' : 'text-gray-400'}>
                  {ngeResult[idx] !== null ? ngeResult[idx] : 'pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAlgo === 'infixToPostfix' && (
        <div className="p-3 bg-white dark:bg-[#151518] rounded-2xl border border-teal-500/20 shadow-xs flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Operator Precedence Rules
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-gray-700 dark:text-gray-300">
            <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 flex justify-between">
              <span>^ (Exponent)</span>
              <span className="font-bold text-teal-500">Rank 3</span>
            </div>
            <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 flex justify-between">
              <span>*, / (Multiply/Div)</span>
              <span className="font-bold text-teal-500">Rank 2</span>
            </div>
            <div className="p-1.5 rounded bg-black/5 dark:bg-white/5 flex justify-between col-span-2">
              <span>+, - (Add/Subtract)</span>
              <span className="font-bold text-teal-500">Rank 1</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Dry Run Variable Tracker with AI Voice narration */}
      <DryRunVariableTracker
        variables={activeVariables}
        activeLine={activeLine}
        explanation={explanation.action}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => setIsVoiceEnabled(v => !v)}
      />

      {/* 3. Code Inspector with tabs */}
      <CodeInspector
        codeSnippets={currentCodeSnippet}
        activeLine={activeLine}
        variables={activeVariables}
        title={`${STACK_ALGORITHMS.find(a => a.id === activeAlgo)?.name} Logic`}
      />
    </div>
  );

  // =========================================================================
  // MAIN VISUAL CANVAS RENDERING (CENTER STAGE)
  // =========================================================================
  return (
    <ResponsiveVisualizerShell
      title="Stack Data Structure & Algorithms"
      subtitle="Interactive LIFO chamber, Shunting-Yard, Monotonic Stack & RPN Evaluator"
      currentPath="/visualizer/stack"
      category="ds"
      controls={renderControls}
      playback={
        activeAlgo !== 'basic' && activeAlgo !== 'minStack' ? (
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
        {/* Dynamic Center Canvas Stage (HERO & UNOBSTRUCTED) */}
        {/* CASE 1: BASIC STACK */}
        {activeAlgo === 'basic' && (
          <div className="flex-1 w-full h-full min-h-[550px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-2xl">
            <div className="flex items-center gap-1.5 text-teal-500 text-xs font-black mb-2 animate-bounce">
              <ArrowDown size={18} />
              <span>TOP OF STACK</span>
            </div>

            <div className="w-72 sm:w-80 min-h-[340px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-3xl p-4 flex flex-col-reverse gap-2.5 bg-black/5 dark:bg-black/40 relative shadow-inner">
              <AnimatePresence>
                {basicStack.map((val, idx) => {
                  const isTop = idx === basicStack.length - 1;
                  const isHighlighted = highlightIdx === idx;

                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ y: -60, opacity: 0, scale: 0.8 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1, 
                        scale: isHighlighted ? 1.06 : 1,
                        transition: { type: 'spring', stiffness: 350, damping: 25 }
                      }}
                      exit={{ y: -60, opacity: 0, scale: 0.8 }}
                      className={`h-11 rounded-xl flex items-center justify-between px-4 font-black text-sm border shadow-md transition-all ${
                        isHighlighted
                          ? 'bg-amber-500 text-black border-amber-400 ring-2 ring-amber-400'
                          : isTop
                          ? 'bg-teal-500 text-black border-teal-300 shadow-teal-500/30'
                          : 'bg-white/90 dark:bg-[#1f1f23] text-gray-900 dark:text-white border-gray-300 dark:border-white/10'
                      }`}
                    >
                      <span className="text-xs font-mono opacity-60">[{idx}]</span>
                      <span className="text-base font-mono">{val}</span>
                      {isTop && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/20 text-black">
                          TOP
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {basicStack.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-xs font-bold italic py-8">
                  Stack is Empty (Underflow)
                </div>
              )}
            </div>

            <div className="mt-4 text-xs font-bold text-gray-400 flex items-center gap-2">
              <span>Capacity: {basicStack.length} / {maxCapacity}</span>
              <div className="w-28 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${(basicStack.length / maxCapacity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: BALANCED PARENTHESES */}
        {activeAlgo === 'parentheses' && (
          <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Scanned String Tokens Banner */}
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Scanned Character Stream
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {parenTokens.map((char, idx) => {
                  const isActive = parenActiveIdx === idx;
                  const isProcessed = parenActiveIdx > idx;

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.25 : 1 }}
                      className={`w-11 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-black text-lg border transition-all ${
                        isActive
                          ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/40 ring-2 ring-amber-400'
                          : isProcessed
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/5'
                          : 'bg-white dark:bg-[#18181b] text-gray-800 dark:text-gray-200 border-gray-300 dark:border-white/15'
                      }`}
                    >
                      <span>{char}</span>
                      <span className="text-[9px] opacity-60">[{idx}]</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Parentheses Stack Chamber */}
            <div className="flex flex-col items-center">
              <div className="text-teal-500 text-xs font-black mb-1 flex items-center gap-1">
                <ArrowDown size={14} /> Open Brackets in Stack
              </div>
              <div className="w-48 min-h-[160px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                <AnimatePresence>
                  {parenStack.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="h-9 rounded-lg bg-teal-500 text-black font-mono font-black text-base flex items-center justify-between px-3 shadow-sm"
                    >
                      <span className="text-[10px] opacity-75">#{i}</span>
                      <span>{c}</span>
                      <span className="text-[9px] uppercase tracking-wider font-sans">Open</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {parenStack.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>

            {/* Verdict Chip */}
            <div className="flex items-center gap-2">
              {parenStatus === 'valid' && (
                <div className="px-4 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center gap-2 shadow-sm">
                  <CheckCircle2 size={16} /> Expression is Valid & Balanced!
                </div>
              )}
              {parenStatus === 'invalid' && (
                <div className="px-4 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400 font-black text-xs flex items-center gap-2 shadow-sm">
                  <AlertCircle size={16} /> Syntax Error: Unbalanced Bracket detected!
                </div>
              )}
            </div>
          </div>
        )}

        {/* CASE 3: POSTFIX (RPN) EVALUATION */}
        {activeAlgo === 'postfix' && (
          <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Tokens Stream */}
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Postfix Tokens Stream
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {postfixTokens.map((t, idx) => {
                  const isActive = postfixActiveIdx === idx;
                  const isProcessed = postfixActiveIdx > idx;
                  const isOperator = ['+', '-', '*', '/', '^'].includes(t);

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.25 : 1 }}
                      className={`min-w-10 h-11 px-2.5 rounded-xl flex flex-col items-center justify-center font-mono font-black text-base border transition-all ${
                        isActive
                          ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/40 ring-2 ring-amber-400'
                          : isProcessed
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/5'
                          : isOperator
                          ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                          : 'bg-white dark:bg-[#18181b] text-gray-800 dark:text-gray-200 border-gray-300 dark:border-white/15'
                      }`}
                    >
                      <span>{t}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Arithmetic Spark banner if operator active */}
            {postfixLastOp && typeof postfixLastOp === 'object' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-4 py-2 rounded-xl bg-teal-500/15 border border-teal-500/30 font-mono text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>Evaluating: {postfixLastOp.a} {postfixLastOp.op} {postfixLastOp.b} = <strong className="text-sm font-black text-teal-500">{postfixLastOp.result}</strong></span>
              </motion.div>
            )}

            {/* Postfix Operand Stack */}
            <div className="flex flex-col items-center">
              <div className="text-teal-500 text-xs font-black mb-1 flex items-center gap-1">
                <ArrowDown size={14} /> Evaluation Operand Stack
              </div>
              <div className="w-56 min-h-[170px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                <AnimatePresence>
                  {postfixStack.map((val, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className={`h-9 rounded-lg font-mono font-black text-sm flex items-center justify-between px-3 shadow-sm ${
                        i === postfixStack.length - 1
                          ? 'bg-teal-500 text-black shadow-teal-500/30'
                          : 'bg-white/90 dark:bg-[#1f1f23] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <span className="text-[10px] opacity-60">[{i}]</span>
                      <span className="text-base">{val}</span>
                      {i === postfixStack.length - 1 && (
                        <span className="text-[9px] uppercase tracking-wider font-sans bg-black/20 px-1 rounded">TOP</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {postfixStack.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CASE 4: INFIX TO POSTFIX (SHUNTING-YARD) */}
        {activeAlgo === 'infixToPostfix' && (
          <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Infix Input Tokens */}
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Infix Expression Stream
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {infixTokens.map((t, idx) => {
                  const isActive = infixActiveIdx === idx;
                  const isProcessed = infixActiveIdx > idx;

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.25 : 1 }}
                      className={`min-w-9 h-10 px-2 rounded-xl flex flex-col items-center justify-center font-mono font-black text-base border transition-all ${
                        isActive
                          ? 'bg-amber-500 text-black border-amber-300 shadow-md ring-2 ring-amber-400'
                          : isProcessed
                          ? 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent'
                          : 'bg-white dark:bg-[#18181b] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <span>{t}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Dual Stage: Operator Stack + Postfix Output Stream */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              {/* Operator Stack */}
              <div className="flex flex-col items-center">
                <div className="text-teal-500 text-xs font-black mb-1 flex items-center gap-1">
                  <ArrowDown size={14} /> Operator Waiting Stack
                </div>
                <div className="w-48 min-h-[140px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                  <AnimatePresence>
                    {infixOpStack.map((op, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="h-8 rounded-lg bg-teal-500 text-black font-mono font-black text-base flex items-center justify-between px-3"
                      >
                        <span className="text-[10px] opacity-75">#{i}</span>
                        <span>{op}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {infixOpStack.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                      No Operators in Stack
                    </div>
                  )}
                </div>
              </div>

              {/* Output Postfix Buffer */}
              <div className="flex flex-col items-center">
                <div className="text-cyan-500 text-xs font-black mb-1 flex items-center gap-1">
                  <ArrowRight size={14} /> Resulting Postfix Stream
                </div>
                <div className="w-full min-h-[140px] border-2 border-dashed border-cyan-500/40 rounded-2xl p-3 flex flex-wrap gap-2 items-center bg-cyan-500/5">
                  <AnimatePresence>
                    {postfixOutput.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-9 px-3 rounded-lg bg-cyan-500 text-black font-mono font-black text-sm flex items-center justify-center shadow-xs"
                      >
                        {t}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {postfixOutput.length === 0 && (
                    <div className="text-gray-400 text-xs italic font-bold">
                      Output buffer is empty...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE 5: NEXT GREATER ELEMENT */}
        {activeAlgo === 'nextGreater' && (
          <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between relative shadow-inner gap-6">
            {/* Input Array Elements */}
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Array Elements with Monotonic Pointer
              </span>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {ngeArray.map((val, idx) => {
                  const isActive = ngeActiveIdx === idx;
                  const isResolved = ngeResult[idx] !== null;

                  return (
                    <motion.div
                      key={idx}
                      animate={{ scale: isActive ? 1.25 : 1 }}
                      className={`w-14 h-16 rounded-xl flex flex-col items-center justify-between p-1.5 border transition-all font-mono ${
                        isActive
                          ? 'bg-amber-500 text-black border-amber-300 shadow-lg ring-2 ring-amber-400'
                          : isResolved
                          ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
                          : 'bg-white dark:bg-[#18181b] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10'
                      }`}
                    >
                      <span className="text-[10px] opacity-60">[{idx}]</span>
                      <span className="text-lg font-black">{val}</span>
                      <span className="text-[9px] font-bold text-gray-400">
                        NGE: {ngeResult[idx] !== null ? ngeResult[idx] : '?'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Monotonic Decreasing Stack */}
            <div className="flex flex-col items-center">
              <div className="text-teal-500 text-xs font-black mb-1 flex items-center gap-1">
                <ArrowDown size={14} /> Monotonic Decreasing Stack (Indices)
              </div>
              <div className="w-60 min-h-[160px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-1.5 bg-black/5 dark:bg-black/40">
                <AnimatePresence>
                  {ngeStack.map((idxVal, i) => (
                    <motion.div
                      key={idxVal}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="h-9 rounded-lg bg-teal-500 text-black font-mono font-black text-sm flex items-center justify-between px-3"
                    >
                      <span className="text-xs opacity-75">idx: {idxVal}</span>
                      <span className="text-base font-black">val: {ngeArray[idxVal]}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {ngeStack.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic font-bold">
                    Stack is Empty
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CASE 6: MIN STACK */}
        {activeAlgo === 'minStack' && (
          <div className="flex-1 w-full h-full min-h-[550px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-xl">
              {/* Primary Main Stack */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-teal-500 text-xs font-black mb-2">
                  <Layers size={16} />
                  <span>MAIN STACK</span>
                </div>
                <div className="w-48 min-h-[220px] border-b-4 border-l-4 border-r-4 border-teal-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-2 bg-black/5 dark:bg-black/40">
                  <AnimatePresence>
                    {minMainStack.map((val, idx) => (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        className="h-10 rounded-xl bg-teal-500 text-black font-mono font-black text-sm flex items-center justify-between px-3"
                      >
                        <span className="text-xs opacity-70">[{idx}]</span>
                        <span className="text-base">{val}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {minMainStack.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic">
                      Empty
                    </div>
                  )}
                </div>
              </div>

              {/* Auxiliary Min Stack */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-black mb-2">
                  <ShieldAlert size={16} />
                  <span>RUNNING MIN STACK</span>
                </div>
                <div className="w-48 min-h-[220px] border-b-4 border-l-4 border-r-4 border-amber-500/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-2 bg-black/5 dark:bg-black/40">
                  <AnimatePresence>
                    {minAuxStack.map((minVal, idx) => (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        className="h-10 rounded-xl bg-amber-500 text-black font-mono font-black text-sm flex items-center justify-between px-3 ring-2 ring-amber-400"
                      >
                        <span className="text-xs opacity-70">min:</span>
                        <span className="text-base">{minVal}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {minAuxStack.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-2">
              <Cpu size={16} />
              <span>O(1) Guarantee: Top of Min Stack is ALWAYS the global minimum element of the current stack!</span>
            </div>
          </div>
        )}
      </div>
    </ResponsiveVisualizerShell>
  );
}
