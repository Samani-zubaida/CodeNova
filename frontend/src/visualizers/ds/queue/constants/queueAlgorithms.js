export const QUEUE_ALGORITHMS = [
  { id: 'basic', name: 'FIFO Queue', badge: 'O(1)', desc: 'Enqueue at Rear, Dequeue at Front' },
  { id: 'circular', name: 'Circular Queue (Ring Buffer)', badge: 'O(1)', desc: 'Modulo Indexing with Wrap-around' },
  { id: 'deque', name: 'Double-Ended Queue (Deque)', badge: 'O(1)', desc: 'Push & Pop at Both Ends' },
  { id: 'priority', name: 'Priority Queue', badge: 'O(log N)', desc: 'Key-Ordered Priority Dequeue' },
  { id: 'slidingWindow', name: 'Sliding Window Maximum', badge: 'O(N)', desc: 'Monotonic Decreasing Deque' },
  { id: 'hotPotato', name: 'Hot Potato (Josephus)', badge: 'O(N*K)', desc: 'Circular Elimination Game' },
  { id: 'twoStacks', name: 'Queue via 2 Stacks', badge: 'Amortized O(1)', desc: 'In-Stack to Out-Stack Reversal' },
  { id: 'bfs', name: 'BFS Traversal Queue', badge: 'O(V+E)', desc: 'Level-Order Frontier Exploration' }
];
