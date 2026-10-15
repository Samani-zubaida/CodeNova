export const CODE_SNIPPETS = {
  basic: {
    javascript: `// Standard FIFO Linear Queue
class Queue {
  constructor() { this.items = []; }
  enqueue(val) { this.items.push(val); }
  dequeue() { return this.items.shift(); }
  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
}`,
    python: `from collections import deque
q = deque()
q.append(10)      # Enqueue O(1)
val = q.popleft() # Dequeue O(1)
peek = q[0]       # Front element`,
    cpp: `#include <queue>
std::queue<int> q;
q.push(10);       // Enqueue O(1)
q.pop();          // Dequeue O(1)
int f = q.front();`,
    java: `import java.util.LinkedList;
import java.util.Queue;
Queue<Integer> q = new LinkedList<>();
q.offer(10);      // Enqueue O(1)
int val = q.poll(); // Dequeue`
  },
  circular: {
    javascript: `class CircularQueue {
  constructor(k) {
    this.q = new Array(k);
    this.front = -1;
    this.rear = -1;
    this.size = k;
  }
  enqueue(val) {
    if ((this.rear + 1) % this.size === this.front) return false; // Full
    if (this.front === -1) this.front = 0;
    this.rear = (this.rear + 1) % this.size;
    this.q[this.rear] = val;
    return true;
  }
  dequeue() {
    if (this.front === -1) return false; // Empty
    if (this.front === this.rear) { this.front = -1; this.rear = -1; }
    else this.front = (this.front + 1) % this.size;
    return true;
  }
}`,
    python: `class CircularQueue:
  def __init__(self, k: int):
    self.q = [None] * k
    self.front = self.rear = -1
    self.k = k

  def enqueue(self, val: int) -> bool:
    if (self.rear + 1) % self.k == self.front:
      return False
    if self.front == -1: self.front = 0
    self.rear = (self.rear + 1) % self.k
    self.q[self.rear] = val
    return True

  def dequeue(self) -> bool:
    if self.front == -1: return False
    if self.front == self.rear:
      self.front = self.rear = -1
    else:
      self.front = (self.front + 1) % self.k
    return True`,
    cpp: `class CircularQueue {
  int front = -1, rear = -1, size;
  vector<int> q;
public:
  CircularQueue(int k) : size(k), q(k) {}
  bool enqueue(int val) {
    if ((rear + 1) % size == front) return false;
    if (front == -1) front = 0;
    rear = (rear + 1) % size;
    q[rear] = val;
    return true;
  }
  bool dequeue() {
    if (front == -1) return false;
    if (front == rear) front = rear = -1;
    else front = (front + 1) % size;
    return true;
  }
};`,
    java: `class CircularQueue {
  int[] q;
  int front = -1, rear = -1, size;
  public CircularQueue(int k) { size = k; q = new int[k]; }
  public boolean enqueue(int val) {
    if ((rear + 1) % size == front) return false;
    if (front == -1) front = 0;
    rear = (rear + 1) % size;
    q[rear] = val;
    return true;
  }
  public boolean dequeue() {
    if (front == -1) return false;
    if (front == rear) front = rear = -1;
    else front = (front + 1) % size;
    return true;
  }
}`
  },
  deque: {
    javascript: `// Double-Ended Queue (Deque)
class Deque {
  constructor() { this.items = []; }
  pushFront(val) { this.items.unshift(val); }
  pushRear(val) { this.items.push(val); }
  popFront() { return this.items.shift(); }
  popRear() { return this.items.pop(); }
}`,
    python: `from collections import deque
dq = deque()
dq.appendleft(10) # Push Front
dq.append(20)     # Push Rear
v1 = dq.popleft() # Pop Front
v2 = dq.pop()     # Pop Rear`,
    cpp: `#include <deque>
std::deque<int> dq;
dq.push_front(10); // Push Front
dq.push_back(20);  // Push Rear
dq.pop_front();    // Pop Front
dq.pop_back();     // Pop Rear`,
    java: `import java.util.ArrayDeque;
import java.util.Deque;
Deque<Integer> dq = new ArrayDeque<>();
dq.addFirst(10);   // Push Front
dq.addLast(20);    // Push Rear
dq.removeFirst();  // Pop Front
dq.removeLast();   // Pop Rear`
  },
  priority: {
    javascript: `// Priority Queue (Ordered Elements)
class PriorityQueue {
  constructor() { this.heap = []; }
  enqueue(val, priority) {
    this.heap.push({ val, priority });
    this.heap.sort((a, b) => a.priority - b.priority);
  }
  dequeue() { return this.heap.shift(); }
}`,
    python: `import heapq
pq = []
# Enqueue (priority, value)
heapq.heappush(pq, (1, 99))
heapq.heappush(pq, (2, 45))
# Dequeue highest priority
prio, val = heapq.heappop(pq)`,
    cpp: `#include <queue>
// Min-priority queue
std::priority_queue<std::pair<int, int>,
  std::vector<std::pair<int, int>>,
  std::greater<std::pair<int, int>>> pq;
pq.push({1, 99});
auto top = pq.top(); pq.pop();`,
    java: `import java.util.PriorityQueue;
PriorityQueue<Element> pq = new PriorityQueue<>(
  (a, b) -> a.priority - b.priority
);
pq.offer(new Element(99, 1));
Element highest = pq.poll();`
  },
  slidingWindow: {
    javascript: `function maxSlidingWindow(nums, k) {
  const deque = []; // monotonic decreasing indices
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) res.push(nums[deque[0]]);
  }
  return res;
}`,
    python: `from collections import deque
def maxSlidingWindow(nums, k):
  dq = deque()
  res = []
  for i, n in enumerate(nums):
    while dq and dq[0] <= i - k: dq.popleft()
    while dq and nums[dq[-1]] < n: dq.pop()
    dq.append(i)
    if i >= k - 1: res.append(nums[dq[0]])
  return res`,
    cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
  deque<int> dq;
  vector<int> res;
  for (int i = 0; i < nums.size(); i++) {
    if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
    while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
    dq.push_back(i);
    if (i >= k - 1) res.push_back(nums[dq.front()]);
  }
  return res;
}`,
    java: `public int[] maxSlidingWindow(int[] nums, int k) {
  Deque<Integer> dq = new ArrayDeque<>();
  int[] res = new int[nums.length - k + 1];
  for (int i = 0; i < nums.length; i++) {
    if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
    while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
    dq.offerLast(i);
    if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
  }
  return res;
}`
  },
  hotPotato: {
    javascript: `function hotPotato(players, k) {
  const queue = [...players];
  while (queue.length > 1) {
    for (let i = 0; i < k; i++) {
      queue.push(queue.shift()); // pass potato
    }
    queue.shift(); // eliminated
  }
  return queue[0]; // winner
}`,
    python: `from collections import deque
def hot_potato(players, num):
  q = deque(players)
  while len(q) > 1:
    for _ in range(num):
      q.append(q.popleft())
    eliminated = q.popleft()
  return q[0]`,
    cpp: `string hotPotato(vector<string> players, int k) {
  queue<string> q;
  for (auto& p : players) q.push(p);
  while (q.size() > 1) {
    for (int i = 0; i < k; i++) {
      q.push(q.front()); q.pop();
    }
    q.pop(); // eliminated
  }
  return q.front();
}`,
    java: `public String hotPotato(String[] players, int k) {
  Queue<String> q = new LinkedList<>(Arrays.asList(players));
  while (q.size() > 1) {
    for (int i = 0; i < k; i++) q.offer(q.poll());
    q.poll(); // eliminated
  }
  return q.peek();
}`
  },
  twoStacks: {
    javascript: `class QueueViaTwoStacks {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  enqueue(val) { this.inStack.push(val); }
  dequeue() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
    return this.outStack.pop();
  }
}`,
    python: `class QueueTwoStacks:
  def __init__(self):
    self.in_stack = []
    self.out_stack = []
  def enqueue(self, val):
    self.in_stack.append(val)
  def dequeue(self):
    if not self.out_stack:
      while self.in_stack:
        self.out_stack.append(self.in_stack.pop())
    return self.out_stack.pop()`,
    cpp: `class QueueTwoStacks {
  stack<int> inStack, outStack;
public:
  void enqueue(int val) { inStack.push(val); }
  int dequeue() {
    if (outStack.empty()) {
      while (!inStack.empty()) {
        outStack.push(inStack.top()); inStack.pop();
      }
    }
    int v = outStack.top(); outStack.pop();
    return v;
  }
};`,
    java: `class QueueTwoStacks {
  Stack<Integer> inStack = new Stack<>();
  Stack<Integer> outStack = new Stack<>();
  public void enqueue(int val) { inStack.push(val); }
  public int dequeue() {
    if (outStack.isEmpty()) {
      while (!inStack.isEmpty()) outStack.push(inStack.pop());
    }
    return outStack.pop();
  }
}`
  },
  bfs: {
    javascript: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    const curr = queue.shift(); // Dequeue
    order.push(curr);
    for (const neighbor of graph[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor); // Enqueue
      }
    }
  }
  return order;
}`,
    python: `from collections import deque
def bfs(graph, start):
  visited = {start}
  q = deque([start])
  order = []
  while q:
    node = q.popleft()
    order.append(node)
    for nbr in graph[node]:
      if nbr not in visited:
        visited.add(nbr)
        q.append(nbr)
  return order`,
    cpp: `vector<char> bfs(map<char, vector<char>>& adj, char start) {
  queue<char> q;
  set<char> visited;
  vector<char> order;
  q.push(start); visited.insert(start);
  while (!q.empty()) {
    char u = q.front(); q.pop();
    order.push_back(u);
    for (char v : adj[u]) {
      if (!visited.count(v)) {
        visited.insert(v); q.push(v);
      }
    }
  }
  return order;
}`,
    java: `public List<Character> bfs(Map<Character, List<Character>> adj, char start) {
  Queue<Character> q = new LinkedList<>();
  Set<Character> visited = new HashSet<>();
  List<Character> order = new ArrayList<>();
  q.offer(start); visited.add(start);
  while (!q.isEmpty()) {
    char u = q.poll(); order.add(u);
    for (char v : adj.get(u)) {
      if (!visited.contains(v)) {
        visited.add(v); q.offer(v);
      }
    }
  }
  return order;
}`
  }
};
