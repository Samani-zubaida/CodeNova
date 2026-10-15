export const CODE_SNIPPETS = {
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
  },
  dailyTemp: {
    javascript: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const res = new Array(n).fill(0);
  const stack = []; // stores indices
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const prev = stack.pop();
      res[prev] = i - prev;
    }
    stack.push(i);
  }
  return res;
}`,
    python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    res = [0] * n
    stack = []  # stores indices
    for i in range(n):
        while stack and temperatures[stack[-1]] < temperatures[i]:
            prev = stack.pop()
            res[prev] = i - prev
        stack.append(i)
    return res`,
    cpp: `vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> res(n, 0);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && temperatures[st.top()] < temperatures[i]) {
            int prev = st.top(); st.pop();
            res[prev] = i - prev;
        }
        st.push(i);
    }
    return res;
}`,
    java: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] res = new int[n];
    Stack<Integer> st = new Stack<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && temperatures[st.peek()] < temperatures[i]) {
            int prev = st.pop();
            res[prev] = i - prev;
        }
        st.push(i);
    }
    return res;
}`
  },
  histogram: {
    javascript: `function largestRectangleArea(heights) {
  const stack = []; // stores indices
  let maxArea = 0;
  const extended = [...heights, 0];
  for (let i = 0; i < extended.length; i++) {
    while (stack.length && extended[stack[stack.length - 1]] > extended[i]) {
      const h = extended[stack.pop()];
      const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, h * w);
    }
    stack.push(i);
  }
  return maxArea;
}`,
    python: `def largestRectangleArea(heights: list[int]) -> int:
    stack = []
    max_area = 0
    heights.append(0)
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    return max_area`,
    cpp: `int largestRectangleArea(vector<int>& heights) {
    heights.push_back(0);
    stack<int> st;
    int maxArea = 0;
    for (int i = 0; i < heights.size(); i++) {
        while (!st.empty() && heights[st.top()] > heights[i]) {
            int h = heights[st.top()]; st.pop();
            int w = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        st.push(i);
    }
    return maxArea;
}`,
    java: `public int largestRectangleArea(int[] heights) {
    Stack<Integer> st = new Stack<>();
    int maxArea = 0, n = heights.length;
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        while (!st.isEmpty() && heights[st.peek()] > h) {
            int height = heights[st.pop()];
            int width = st.isEmpty() ? i : i - st.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        st.push(i);
    }
    return maxArea;
}`
  },
  stockSpan: {
    javascript: `class StockSpanner {
  constructor() {
    this.stack = []; // pairs of [price, span]
  }
  next(price) {
    let span = 1;
    while (this.stack.length && this.stack[this.stack.length - 1].price <= price) {
      span += this.stack.pop().span;
    }
    this.stack.push({ price, span });
    return span;
  }
}`,
    python: `class StockSpanner:
    def __init__(self):
        self.stack = []  # (price, span)

    def next(self, price: int) -> int:
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span`,
    cpp: `class StockSpanner {
    stack<pair<int, int>> st; // price, span
public:
    int next(int price) {
        int span = 1;
        while (!st.empty() && st.top().first <= price) {
            span += st.top().second;
            st.pop();
        }
        st.push({price, span});
        return span;
    }
};`,
    java: `class StockSpanner {
    Stack<int[]> stack = new Stack<>(); // [price, span]
    public int next(int price) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            span += stack.pop()[1];
        }
        stack.push(new int[]{price, span});
        return span;
    }
}`
  },
  validParenWildcard: {
    javascript: `function checkValidString(s) {
  const openStack = []; // stores indices of '('
  const starStack = []; // stores indices of '*'
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(') openStack.push(i);
    else if (c === '*') starStack.push(i);
    else {
      if (openStack.length) openStack.pop();
      else if (starStack.length) starStack.pop();
      else return false;
    }
  }
  while (openStack.length && starStack.length) {
    if (openStack.pop() > starStack.pop()) return false;
  }
  return openStack.length === 0;
}`,
    python: `def checkValidString(s: str) -> bool:
    open_stack, star_stack = [], []
    for i, char in enumerate(s):
        if char == '(': open_stack.append(i)
        elif char == '*': star_stack.append(i)
        elif open_stack: open_stack.pop()
        elif star_stack: star_stack.pop()
        else: return False
    while open_stack and star_stack:
        if open_stack.pop() > star_stack.pop():
            return False
    return not open_stack`,
    cpp: `bool checkValidString(string s) {
    stack<int> open, star;
    for (int i = 0; i < s.size(); i++) {
        if (s[i] == '(') open.push(i);
        else if (s[i] == '*') star.push(i);
        else if (!open.empty()) open.pop();
        else if (!star.empty()) star.pop();
        else return false;
    }
    while (!open.empty() && !star.empty()) {
        if (open.top() > star.top()) return false;
        open.pop(); star.pop();
    }
    return open.empty();
}`,
    java: `public boolean checkValidString(String s) {
    Stack<Integer> open = new Stack<>();
    Stack<Integer> star = new Stack<>();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '(') open.push(i);
        else if (c == '*') star.push(i);
        else if (!open.isEmpty()) open.pop();
        else if (!star.isEmpty()) star.pop();
        else return false;
    }
    while (!open.isEmpty() && !star.isEmpty()) {
        if (open.pop() > star.pop()) return false;
    }
    return open.isEmpty();
}`
  }
};
