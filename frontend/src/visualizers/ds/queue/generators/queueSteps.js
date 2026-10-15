/**
 * Trajectory Step Generators for Queue Visualizers
 * Pure simulation functions generating step-by-step playback states.
 */

export function generateBasicQueueSteps() {
      const trajectory = [];
      const items = [12, 24, 36, 48];
      trajectory.push({
        items: [...items],
        action: 'Initial linear FIFO queue loaded with 4 items.',
        intuition: 'Enqueue inserts at the Rear pointer. Dequeue removes from the Front pointer in O(1) time.',
        front: items[0],
        rear: items[items.length - 1],
        activeLine: 2
      });
      // Demo Enqueue 60
      const enq = [...items, 60];
      trajectory.push({
        items: enq,
        action: 'Enqueue value 60 to REAR [index 4].',
        intuition: 'items.push(60): New element enters the end of the line. Rear advances.',
        front: enq[0],
        rear: 60,
        sound: 'enqueue',
        activeLine: 3
      });
      // Demo Enqueue 72
      const enq2 = [...enq, 72];
      trajectory.push({
        items: enq2,
        action: 'Enqueue value 72 to REAR [index 5].',
        intuition: 'items.push(72): Rear moves to index 5.',
        front: enq2[0],
        rear: 72,
        sound: 'enqueue',
        activeLine: 3
      });
      // Demo Dequeue Front
      const deq1 = enq2.slice(1);
      trajectory.push({
        items: deq1,
        action: `Dequeued value ${enq2[0]} from FRONT [index 0].`,
        intuition: 'items.shift(): First element leaves. All subsequent elements advance.',
        front: deq1[0],
        rear: deq1[deq1.length - 1],
        sound: 'dequeue',
        activeLine: 4
      });
      // Demo Dequeue Front 2
      const deq2 = deq1.slice(1);
      trajectory.push({
        items: deq2,
        action: `Dequeued value ${deq1[0]} from FRONT [index 0].`,
        intuition: 'Next in line departs. FIFO order guaranteed.',
        front: deq2[0],
        rear: deq2[deq2.length - 1],
        sound: 'dequeue',
        activeLine: 4
      });
      return trajectory;
}

export function generateCircularQueueSteps() {
      const trajectory = [];
      const cap = 6;
      let slots = [15, 30, 45, null, null, null];
      let f = 0;
      let r = 2;
      trajectory.push({
        slots: [...slots],
        front: f,
        rear: r,
        action: 'Circular Ring Buffer initialized. Capacity 6.',
        intuition: 'Modulo indexing (i + 1) % N allows circular wrap-around without array shifting.',
        activeLine: 2
      });
      // Enqueue 60 at slot 3
      slots[3] = 60; r = 3;
      trajectory.push({
        slots: [...slots],
        front: f,
        rear: r,
        action: 'Enqueue 60: Rear = (2 + 1) % 6 = Slot [3].',
        intuition: 'New item added at rear. No memory shifting required.',
        sound: 'enqueue',
        activeLine: 9
      });
      // Enqueue 75 at slot 4
      slots[4] = 75; r = 4;
      trajectory.push({
        slots: [...slots],
        front: f,
        rear: r,
        action: 'Enqueue 75: Rear = (3 + 1) % 6 = Slot [4].',
        intuition: 'Rear advances to next vacant pod.',
        sound: 'enqueue',
        activeLine: 9
      });
      // Enqueue 90 at slot 5 (end of physical array)
      slots[5] = 90; r = 5;
      trajectory.push({
        slots: [...slots],
        front: f,
        rear: r,
        action: 'Enqueue 90: Rear reaches physical boundary at Slot [5].',
        intuition: 'Next enqueue will wrap around modulo to slot [0] if space permits!',
        sound: 'enqueue',
        activeLine: 9
      });
      // Dequeue from front (slot 0)
      const removed = slots[0];
      slots[0] = null; f = 1;
      trajectory.push({
        slots: [...slots],
        front: f,
        rear: r,
        action: `Dequeued ${removed} from Slot [0]. Front advances to (0 + 1) % 6 = Slot [1].`,
        intuition: 'Freed up slot [0] for circular re-use.',
        sound: 'dequeue',
        activeLine: 16
      });
      // Wrap-around Enqueue 105 into Slot 0!
      slots[0] = 105; r = 0;
      trajectory.push({
        slots: [...slots],
        front: f,
        rear: r,
        action: 'CIRCULAR WRAP-AROUND! Enqueued 105 into Slot [0] via (5 + 1) % 6 = 0.',
        intuition: 'Ring buffer successfully wrapped around to the beginning! O(1) space reuse without reallocation.',
        sound: 'rotate',
        activeLine: 9
      });
      return trajectory;
}

export function generateDequeSteps() {
      const trajectory = [];
      let dq = [20, 40, 60];
      trajectory.push({
        items: [...dq],
        action: 'Double-Ended Queue (Deque) initialized with [20, 40, 60].',
        intuition: 'Supports pushFront, pushRear, popFront, and popRear all in strictly O(1) time.',
        activeLine: 2
      });
      // Push Front 10
      dq = [10, ...dq];
      trajectory.push({
        items: [...dq],
        action: 'Push Front: 10 inserted at Left head.',
        intuition: 'unshift(10): prepends element directly to the front chamber.',
        sound: 'enqueue',
        activeLine: 3
      });
      // Push Rear 70
      dq = [...dq, 70];
      trajectory.push({
        items: [...dq],
        action: 'Push Rear: 70 appended at Right tail.',
        intuition: 'push(70): appends element directly to the rear chamber.',
        sound: 'enqueue',
        activeLine: 4
      });
      // Pop Front
      const pF = dq[0]; dq = dq.slice(1);
      trajectory.push({
        items: [...dq],
        action: `Pop Front: Extracted ${pF} from head.`,
        intuition: 'O(1) extraction from front port.',
        sound: 'dequeue',
        activeLine: 5
      });
      // Pop Rear
      const pR = dq[dq.length - 1]; dq = dq.slice(0, -1);
      trajectory.push({
        items: [...dq],
        action: `Pop Rear: Extracted ${pR} from tail.`,
        intuition: 'O(1) extraction from rear port.',
        sound: 'dequeue',
        activeLine: 6
      });
      return trajectory;
}

export function generatePriorityQueueSteps() {
      const trajectory = [];
      let pItems = [
        { id: 1, val: 95, priority: 1, label: 'P1 (Urgent)' },
        { id: 2, val: 50, priority: 2, label: 'P2 (Normal)' },
        { id: 3, val: 20, priority: 3, label: 'P3 (Low)' }
      ];
      trajectory.push({
        items: [...pItems],
        action: 'Priority Queue initialized: Highest priority element always on top.',
        intuition: 'Elements are ordered by rank key. Dequeue always extracts min/max priority first.',
        activeLine: 2
      });
      // Enqueue high priority task (val 88, P1)
      const newItem = { id: 4, val: 88, priority: 1, label: 'P1 (Urgent)' };
      pItems = [...pItems, newItem].sort((a, b) => a.priority - b.priority);
      trajectory.push({
        items: [...pItems],
        action: 'Enqueue Task 88 with Priority P1 (Urgent).',
        intuition: 'Inserted into highest priority tier. Automatically shifts ahead of P2 and P3 elements.',
        sound: 'enqueue',
        activeLine: 4
      });
      // Dequeue highest
      const highest = pItems[0];
      pItems = pItems.slice(1);
      trajectory.push({
        items: [...pItems],
        action: `Dequeued Highest Priority Task (${highest.val}, ${highest.label}).`,
        intuition: 'Critical task executed first regardless of arrival time.',
        sound: 'dequeue',
        activeLine: 8
      });
      return trajectory;
}

export function generateSlidingWindowSteps(nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3) {
      const trajectory = [];
      const q = [];
      const res = [];
      trajectory.push({
        idx: -1,
        num: null,
        deque: [],
        res: [],
        action: 'Sliding Window Maximum initialized with Monotonic Decreasing Deque.',
        intuition: 'Deque stores indices of numbers in decreasing order. The front of the deque is ALWAYS the window maximum!',
        activeLine: 2
      });

      for (let i = 0; i < nums.length; i++) {
        // Pop elements outside window boundary
        while (q.length && q[0] <= i - k) {
          const removedIdx = q.shift();
          trajectory.push({
            idx: i,
            num: nums[i],
            deque: [...q],
            res: [...res],
            action: `Purged index [${removedIdx}] (${nums[removedIdx]}) from Front: Fell outside window range [${i - k + 1}..${i}].`,
            intuition: 'Indices older than (i - k) are no longer inside the current sliding subarray.',
            sound: 'dequeue',
            activeLine: 5
          });
        }

        // Pop smaller elements from back
        while (q.length && nums[q[q.length - 1]] < nums[i]) {
          const poppedIdx = q.pop();
          trajectory.push({
            idx: i,
            num: nums[i],
            deque: [...q],
            res: [...res],
            action: `Popped index [${poppedIdx}] (${nums[poppedIdx]}) from Rear: Smaller than incoming ${nums[i]}.`,
            intuition: `Monotonic invariant: Since nums[${i}] = ${nums[i]} is larger and arrived later, ${nums[poppedIdx]} can never be a maximum again!`,
            sound: 'eliminate',
            activeLine: 6
          });
        }

        q.push(i);
        if (i >= k - 1) {
          res.push(nums[q[0]]);
        }

        trajectory.push({
          idx: i,
          num: nums[i],
          deque: [...q],
          res: [...res],
          action: `Examining nums[${i}] = ${nums[i]}. Window: [${Math.max(0, i - k + 1)}..${i}]. Window Max = ${nums[q[0]]}.`,
          intuition: i >= k - 1 ? `Window is complete! Front of deque index [${q[0]}] has maximum value ${nums[q[0]]}. Appended to result.` : 'Building initial window.',
          sound: 'pass',
          activeLine: 7
        });
      }

      trajectory.push({
        idx: nums.length,
        num: null,
        deque: [...q],
        res: [...res],
        action: `🎉 Sliding Window Complete! Result array: [${res.join(', ')}].`,
        intuition: 'Achieved optimal O(N) linear time complexity with monotonic deque!',
        activeLine: 10
      });
      return trajectory;
}

export function generateHotPotatoSteps(players = ['Alice', 'Bob', 'Charlie', 'David', 'Emma'], k = 3) {
      const trajectory = [];
      let q = [...players];
      const eliminatedList = [];
      trajectory.push({
        q: [...q],
        eliminated: [],
        currentHolder: q[0],
        passCount: 0,
        action: 'Hot Potato Game started! Circle formed with 5 players.',
        intuition: `Queue simulates circular passing: enqueue(dequeue()) repeats ${k} times, then the unlucky holder is eliminated!`,
        activeLine: 2
      });

      while (q.length > 1) {
        for (let pass = 1; pass <= k; pass++) {
          const p = q.shift();
          q.push(p);
          trajectory.push({
            q: [...q],
            eliminated: [...eliminatedList],
            currentHolder: q[q.length - 1],
            passCount: pass,
            action: `Pass ${pass}/${k}: Hot potato passed from ${p} ➔ ${q[q.length - 1]}!`,
            intuition: 'Dequeued from front and immediately enqueued at rear to rotate the circle.',
            sound: 'pass',
            activeLine: 5
          });
        }

        const eliminated = q.shift();
        eliminatedList.push(eliminated);
        trajectory.push({
          q: [...q],
          eliminated: [...eliminatedList],
          currentHolder: q[0],
          eliminatedPlayer: eliminated,
          passCount: k,
          action: `💥 SIZZLE! Timer expired! ${eliminated} is ELIMINATED!`,
          intuition: 'Potato exploded in holder\'s hands. Player permanently dequeued.',
          sound: 'eliminate',
          activeLine: 7
        });
      }

      trajectory.push({
        q: [...q],
        eliminated: [...eliminatedList],
        winner: q[0],
        currentHolder: q[0],
        action: `🏆 VICTORY! ${q[0]} is the Hot Potato Champion!`,
        intuition: 'Sole survivor of the circular elimination queue.',
        sound: 'rotate',
        activeLine: 9
      });
      return trajectory;
}

export function generateTwoStacksQueueSteps() {
      const trajectory = [];
      let inS = [10, 20, 30];
      let outS = [];
      trajectory.push({
        inStack: [...inS],
        outStack: [...outS],
        action: 'Queue via 2 Stacks initialized with In-Stack [10, 20, 30].',
        intuition: 'In-Stack handles incoming enqueues (LIFO). Out-Stack handles dequeues (FIFO order when reversed).',
        activeLine: 2
      });
      // Push 40 to In-Stack
      inS = [...inS, 40];
      trajectory.push({
        inStack: [...inS],
        outStack: [...outS],
        action: 'Enqueue 40: Pushed onto In-Stack.',
        intuition: 'Enqueue is always an O(1) push directly to In-Stack.',
        sound: 'enqueue',
        activeLine: 6
      });
      // Dequeue requested, but Out-Stack is empty!
      trajectory.push({
        inStack: [...inS],
        outStack: [...outS],
        action: 'Dequeue requested! Out-Stack is empty ➔ Triggering Transfer Bridge!',
        intuition: 'To get the oldest element, we must pop all items from In-Stack and push them to Out-Stack.',
        activeLine: 9
      });
      // Transfer step-by-step
      const reversed = [...inS].reverse();
      outS = [...reversed];
      inS = [];
      trajectory.push({
        inStack: [],
        outStack: [...outS],
        action: 'Transfer complete! In-Stack emptied ➔ Out-Stack now in inverted order [40, 30, 20, 10].',
        intuition: 'Two reversals cancel out: LIFO + LIFO = FIFO! Oldest element 10 is now on top of Out-Stack.',
        sound: 'rotate',
        activeLine: 12
      });
      // Pop 10 from Out-Stack
      const popped = outS.pop();
      trajectory.push({
        inStack: [],
        outStack: [...outS],
        action: `Dequeued ${popped} directly from top of Out-Stack!`,
        intuition: 'Immediate O(1) pop. Subsequent dequeues will be O(1) as long as Out-Stack has items.',
        sound: 'dequeue',
        activeLine: 15
      });
      return trajectory;
}

export function generateBfsQueueSteps() {
      const trajectory = [];
      const visited = ['A'];
      const q = ['A'];
      const order = [];
      trajectory.push({
        queue: [...q],
        visited: [...visited],
        order: [...order],
        activeNode: null,
        action: 'Breadth-First Search initialized at Root Node "A".',
        intuition: 'BFS expands node frontiers level-by-level using a FIFO queue to guarantee shortest-path exploration.',
        activeLine: 2
      });

      const adj = {
        'A': ['B', 'C'],
        'B': ['D', 'E'],
        'C': ['F'],
        'D': [],
        'E': [],
        'F': []
      };

      while (q.length > 0) {
        const curr = q.shift();
        order.push(curr);
        const unvisitedNbrs = (adj[curr] || []).filter(n => !visited.includes(n));
        unvisitedNbrs.forEach(n => {
          visited.push(n);
          q.push(n);
        });

        trajectory.push({
          queue: [...q],
          visited: [...visited],
          order: [...order],
          activeNode: curr,
          enqueued: unvisitedNbrs,
          action: `Dequeued & Visited Node "${curr}". Enqueued unvisited neighbors: [${unvisitedNbrs.join(', ') || 'None'}].`,
          intuition: `Level-order expansion: "${curr}" processed. Frontier now holds: [${q.join(', ')}].`,
          sound: 'pass',
          activeLine: 7
        });
      }

      trajectory.push({
        queue: [],
        visited: [...visited],
        order: [...order],
        activeNode: null,
        action: `✅ BFS Traversal Complete! Final Level-Order Sequence: [${order.join(' ➔ ')}].`,
        intuition: 'All reachable graph nodes explored in minimum edge distance order.',
        sound: 'rotate',
        activeLine: 12
      });
      return trajectory;
}

export function generateQueueSteps(algoId, options = {}) {
  switch (algoId) {
    case 'basic': return generateBasicQueueSteps();
    case 'circular': return generateCircularQueueSteps();
    case 'deque': return generateDequeSteps();
    case 'priority': return generatePriorityQueueSteps();
    case 'slidingWindow': return generateSlidingWindowSteps(options.swArray, options.swK);
    case 'hotPotato': return generateHotPotatoSteps(options.potatoPlayers, options.potatoK);
    case 'twoStacks': return generateTwoStacksQueueSteps();
    case 'bfs': return generateBfsQueueSteps();
    default: return generateBasicQueueSteps();
  }
}
