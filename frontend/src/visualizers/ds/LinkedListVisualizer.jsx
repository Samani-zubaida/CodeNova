import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Search, ArrowRight, ArrowLeft, RefreshCw, Layers,
  Compass, Lightbulb, FastForward, CheckCircle, AlertCircle, Eye,
  Sliders, Activity, Cpu, Database, GitMerge, Split, ShieldCheck, Repeat, Target
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import { LINKED_LIST_ALGORITHMS } from './LinkedListHub';

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
    } else if (type === 'traverse') {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'reverse') {
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.linearRampToValueAtTime(580, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {}
};

// CODE SNIPPETS FOR ALL 12 LINKED LIST ALGORITHMS
const CODE_SNIPPETS = {
  singly: {
    javascript: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}
class SinglyLinkedList {
  constructor() {
    this.head = null;
  }
  insertAtPosition(val, pos) {
    const node = new Node(val);
    if (pos === 0) { node.next = this.head; this.head = node; return; }
    let curr = this.head;
    for (let i = 0; i < pos - 1 && curr; i++) curr = curr.next;
    if (curr) { node.next = curr.next; curr.next = node; }
  }
  searchGoalNode(target) {
    let curr = this.head;
    let idx = 0;
    while (curr) {
      if (curr.val === target) return idx;
      curr = curr.next;
      idx++;
    }
    return -1;
  }
}`,
    python: `class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class SinglyLinkedList:
    def __init__(self):
        self.head = None

    def insert_at_pos(self, val, pos):
        if pos == 0:
            self.head = Node(val, self.head)
            return
        curr = self.head
        for _ in range(pos - 1):
            if not curr: break
            curr = curr.next
        if curr:
            curr.next = Node(val, curr.next)

    def search_goal(self, target):
        curr, idx = self.head, 0
        while curr:
            if curr.val == target: return idx
            curr = curr.next
            idx += 1
        return -1`,
    cpp: `struct Node {
    int val;
    Node* next;
    Node(int v) : val(v), next(nullptr) {}
};
class SinglyLinkedList {
    Node* head = nullptr;
public:
    void insertAtPos(int val, int pos) {
        if (pos == 0) {
            Node* node = new Node(val);
            node->next = head;
            head = node;
            return;
        }
        Node* curr = head;
        for (int i = 0; i < pos - 1 && curr; i++) curr = curr->next;
        if (curr) {
            Node* node = new Node(val);
            node->next = curr->next;
            curr->next = node;
        }
    }
};`,
    java: `class Node {
    int val;
    Node next;
    Node(int v) { this.val = v; }
}
class SinglyLinkedList {
    Node head;
    public void insertAtPos(int val, int pos) {
        if (pos == 0) {
            Node node = new Node(val);
            node.next = head;
            head = node;
            return;
        }
        Node curr = head;
        for (int i = 0; i < pos - 1 && curr != null; i++) curr = curr.next;
        if (curr != null) {
            Node node = new Node(val);
            node.next = curr.next;
            curr.next = node;
        }
    }
}`
  },
  doubly: {
    javascript: `class DNode {
  constructor(val) {
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}`,
    python: `class DNode:
    def __init__(self, val=0):
        self.val = val
        self.prev = None
        self.next = None`,
    cpp: `struct DNode {
    int val;
    DNode* prev = nullptr;
    DNode* next = nullptr;
    DNode(int v) : val(v) {}
};`,
    java: `class DNode {
    int val;
    DNode prev, next;
    DNode(int v) { this.val = v; }
}`
  },
  circular: {
    javascript: `function traverseCircular(head) {
  if (!head) return;
  let curr = head;
  do {
    console.log(curr.val);
    curr = curr.next;
  } while (curr !== head);
}`,
    python: `def traverse_circular(head):
    if not head: return
    curr = head
    while True:
        print(curr.val)
        curr = curr.next
        if curr == head: break`,
    cpp: `void traverseCircular(Node* head) {
    if (!head) return;
    Node* curr = head;
    do {
        cout << curr->val << " ";
        curr = curr->next;
    } while (curr != head);
}`,
    java: `void traverseCircular(Node head) {
    if (head == null) return;
    Node curr = head;
    do {
        System.out.print(curr.val + " ");
        curr = curr.next;
    } while (curr != head);
}`
  },
  reverse: {
    javascript: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const nxt = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nxt;
  }
  return prev;
}`,
    python: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    cpp: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`,
    java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`
  },
  floyd_cycle: {
    javascript: `function detectCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let entry = head;
      while (entry !== slow) {
        entry = entry.next;
        slow = slow.next;
      }
      return entry;
    }
  }
  return null;
}`,
    python: `def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            entry = head
            while entry != slow:
                entry = entry.next
                slow = slow.next
            return entry
    return None`,
    cpp: `ListNode *detectCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            ListNode* entry = head;
            while (entry != slow) {
                entry = entry->next;
                slow = slow->next;
            }
            return entry;
        }
    }
    return nullptr;
}`,
    java: `public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            ListNode entry = head;
            while (entry != slow) {
                entry = entry.next;
                slow = slow.next;
            }
            return entry;
        }
    }
    return null;
}`
  },
  middle_node: {
    javascript: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
    python: `def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
    cpp: `ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
    java: `public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`
  },
  merge_sorted: {
    javascript: `function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}`,
    python: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    while l1 and l2:
        if l1.val <= l2.val: curr.next = l1; l1 = l1.next
        else: curr.next = l2; l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`,
    cpp: `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* curr = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) { curr->next = l1; l1 = l1->next; }
        else { curr->next = l2; l2 = l2->next; }
        curr = curr->next;
    }
    curr->next = l1 ? l1 : l2;
    return dummy.next;
}`,
    java: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode curr = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
        else { curr.next = l2; l2 = l2.next; }
        curr = curr.next;
    }
    curr.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`
  },
  remove_nth: {
    javascript: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0);
  dummy.next = head;
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    python: `def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1): fast = fast.next
    while fast: fast = fast.next; slow = slow.next
    slow.next = slow.next.next
    return dummy.next`,
    cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode* dummy = new ListNode(0, head);
    ListNode *fast = dummy, *slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast->next;
    while (fast) { fast = fast->next; slow = slow->next; }
    slow->next = slow->next->next;
    return dummy->next;
}`,
    java: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast.next;
    while (fast != null) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
}`
  },
  palindrome: {
    javascript: `function isPalindrome(head) {
  if (!head || !head.next) return true;
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  let prev = null, curr = slow;
  while (curr) { const nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; }
  let p1 = head, p2 = prev;
  while (p2) {
    if (p1.val !== p2.val) return false;
    p1 = p1.next; p2 = p2.next;
  }
  return true;
}`,
    python: `def is_palindrome(head):
    if not head or not head.next: return True
    slow = fast = head
    while fast and fast.next: slow = slow.next; fast = fast.next.next
    prev, curr = None, slow
    while curr: nxt = curr.next; curr.next = prev; prev = curr; curr = nxt
    p1, p2 = head, prev
    while p2:
        if p1.val != p2.val: return False
        p1 = p1.next; p2 = p2.next
    return True`,
    cpp: `bool isPalindrome(ListNode* head) {
    if (!head || !head->next) return true;
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode *prev = nullptr, *curr = slow;
    while (curr) { ListNode* nxt = curr->next; curr->next = prev; prev = curr; curr = nxt; }
    ListNode *p1 = head, *p2 = prev;
    while (p2) {
        if (p1->val != p2->val) return false;
        p1 = p1->next; p2 = p2->next;
    }
    return true;
}`,
    java: `public boolean isPalindrome(ListNode head) {
    if (head == null || head.next == null) return true;
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
    ListNode prev = null, curr = slow;
    while (curr != null) { ListNode nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; }
    ListNode p1 = head, p2 = prev;
    while (p2 != null) {
        if (p1.val != p2.val) return false;
        p1 = p1.next; p2 = p2.next;
    }
    return true;
}`
  },
  intersection: {
    javascript: `function getIntersectionNode(headA, headB) {
  let pA = headA, pB = headB;
  while (pA !== pB) {
    pA = pA ? pA.next : headB;
    pB = pB ? pB.next : headA;
  }
  return pA;
}`,
    python: `def get_intersection_node(headA, headB):
    pA, pB = headA, headB
    while pA != pB:
        pA = pA.next if pA else headB
        pB = pB.next if pB else headA
    return pA`,
    cpp: `ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
    ListNode *pA = headA, *pB = headB;
    while (pA != pB) {
        pA = pA ? pA->next : headB;
        pB = pB ? pB->next : headA;
    }
    return pA;
}`,
    java: `public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    ListNode pA = headA, pB = headB;
    while (pA != pB) {
        pA = (pA != null) ? pA.next : headB;
        pB = (pB != null) ? pB.next : headA;
    }
    return pA;
}`
  },
  delete_val: {
    javascript: `function removeElements(head, val) {
  const dummy = new ListNode(0);
  dummy.next = head;
  let prev = dummy, curr = head;
  while (curr) {
    if (curr.val === val) prev.next = curr.next;
    else prev = curr;
    curr = curr.next;
  }
  return dummy.next;
}`,
    python: `def remove_elements(head, val):
    dummy = ListNode(0, head)
    prev, curr = dummy, head
    while curr:
        if curr.val == val: prev.next = curr.next
        else: prev = curr
        curr = curr.next
    return dummy.next`,
    cpp: `ListNode* removeElements(ListNode* head, int val) {
    ListNode dummy(0, head);
    ListNode *prev = &dummy, *curr = head;
    while (curr) {
        if (curr->val == val) prev->next = curr->next;
        else prev = curr;
        curr = curr->next;
    }
    return dummy.next;
}`,
    java: `public ListNode removeElements(ListNode head, int val) {
    ListNode dummy = new ListNode(0, head);
    ListNode prev = dummy, curr = head;
    while (curr != null) {
        if (curr.val == val) prev.next = curr.next;
        else prev = curr;
        curr = curr.next;
    }
    return dummy.next;
}`
  },
  lru_cache: {
    javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const lru = this.map.keys().next().value;
      this.map.delete(lru);
    }
  }
}`,
    python: `from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()
    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    def put(self, key: int, value: int) -> None:
        if key in self.cache: self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap: self.cache.popitem(last=False)`,
    cpp: `class LRUCache {
    int cap;
    list<pair<int, int>> lru;
    unordered_map<int, list<pair<int, int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (!mp.count(key)) return -1;
        lru.splice(lru.begin(), lru, mp[key]);
        return mp[key]->second;
    }
    void put(int key, int value) {
        if (mp.count(key)) {
            lru.splice(lru.begin(), lru, mp[key]);
            mp[key]->second = value;
            return;
        }
        if (lru.size() == cap) { mp.erase(lru.back().first); lru.pop_back(); }
        lru.emplace_front(key, value);
        mp[key] = lru.begin();
    }
};`,
    java: `class LRUCache extends LinkedHashMap<Integer, Integer> {
    private int capacity;
    public LRUCache(int capacity) { super(capacity, 0.75f, true); this.capacity = capacity; }
    public int get(int key) { return super.getOrDefault(key, -1); }
    public void put(int key, int value) { super.put(key, value); }
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) { return size() > capacity; }
}`
  }
};

// INTUITIONS FOR ALL 12 LINKED LIST ALGORITHMS
const INTUITIONS = {
  singly: {
    concept: "Nodes scattered freely in RAM, linked solely by forward pointer addresses. Dynamic O(1) prepend without memory reallocation.",
    whyItWorks: "Unlike arrays which require contiguous memory, linked lists stitch dynamic heaps together using next pointers.",
    analogy: "Like a treasure hunt where every clue gives you the GPS coordinate of the next hidden chest."
  },
  doubly: {
    concept: "Every node remembers both who came before it (prev) and who comes next (next). Allows backward traversal and O(1) splicing.",
    whyItWorks: "Knowing your predecessor means you can delete or insert around yourself in O(1) time without scanning from the head.",
    analogy: "Like dancers in a conga line holding hands: each person holds the shoulders of the person in front and the waist of the person behind."
  },
  circular: {
    concept: "The final node points directly back to head instead of null, creating an unbroken ring buffer.",
    whyItWorks: "Ideal for round-robin scheduling (CPU time-slices, turn-based games) where the process cycles indefinitely.",
    analogy: "Like a carousel or spinning roulette wheel: there is no beginning or end; it just cycles continuously."
  },
  reverse: {
    concept: "Turn a one-way street around in-place by flipping every node's pointer backward using 3 temporary pointers (prev, curr, next).",
    whyItWorks: "By stashing curr.next before overwriting it, we reverse each link sequentially without losing the rest of the chain.",
    analogy: "Like untangling a string of pearls and re-threading them in reverse order."
  },
  floyd_cycle: {
    concept: "The Tortoise and the Hare! Slow moves 1 step; Fast moves 2 steps. If a loop exists, the hare must lap and collide with the tortoise.",
    whyItWorks: "In relative terms, the distance between them shrinks by 1 node per step inside the cycle until they occupy the identical node.",
    analogy: "Like two runners on a circular track: the faster runner will eventually lap the slower runner from behind."
  },
  middle_node: {
    concept: "Find the exact midpoint of a list in a single pass without knowing the total length in advance.",
    whyItWorks: "When a runner moving at 200 km/h crosses the finish line, a runner moving at 100 km/h is exactly at the half-way mark.",
    analogy: "Like a shadow moving at half the speed of a jet: when the jet reaches destination, the shadow is at the exact center."
  },
  merge_sorted: {
    concept: "Zipper two pre-sorted lists into a single consolidated sorted list in O(N+M) time.",
    whyItWorks: "Compare heads: attach whichever node has smaller value, advance that pointer, and repeat.",
    analogy: "Like merging two lanes of traffic into a single highway lane: the car closest to the merge point goes first."
  },
  remove_nth: {
    concept: "Delete the N-th node from the end of the list in one pass using a fixed-width two-pointer sliding window.",
    whyItWorks: "Send fast N steps ahead. Then move slow and fast together until fast reaches the end; slow will be positioned right before target.",
    analogy: "Like holding a stick of length N: when the front of the stick touches the wall, the back of the stick marks the target spot."
  },
  palindrome: {
    concept: "Verify whether a linked list reads identically forwards and backwards in O(N) time and O(1) extra space.",
    whyItWorks: "Find middle with slow/fast, reverse the second half, and compare values from head and reversed half inwards.",
    analogy: "Like folding a paper strip in half and holding it up to the light to see if both halves align."
  },
  intersection: {
    concept: "Find where two independent lists merge into a shared common tail without modifying node data.",
    whyItWorks: "Pointer A walks List A then List B; Pointer B walks List B then List A. Both travel equal total distance (A+B) and collide at intersection!",
    analogy: "Like two travelers who walk different routes from two different cities but agree to meet at a shared highway interchange."
  },
  delete_val: {
    concept: "Remove all nodes matching a target value by rewiring the predecessor's next pointer around the target.",
    whyItWorks: "Executing prev.next = curr.next bypasses the matched node entirely, dropping it for garbage collection.",
    analogy: "Like detaching a broken carriage from a train and coupling the car in front directly to the car behind it."
  },
  lru_cache: {
    concept: "Combines a Hash Map (for O(1) key lookups) and a Doubly Linked List (for O(1) order tracking and eviction).",
    whyItWorks: "Accessing a node moves it to the MRU head. When cache exceeds capacity, the LRU tail node is pruned instantly.",
    analogy: "Like a desk organizer: whatever paper you just read goes on top of the pile; when the tray overflows, the bottom paper goes in the trash."
  }
};

// STEP GENERATORS FOR ALL 12 LINKED LIST ALGORITHMS + GOAL SEARCH & POSITION INSERT
function generateSearchGoalSteps(nodes, goalVal) {
  const steps = [];
  const target = Number(goalVal);
  steps.push({
    status: `Initiating Search for Goal Node [${target}]. Starting at Head node [${nodes[0]?.val ?? 'NULL'}].`,
    nodes: [...nodes],
    currIdx: 0,
    goalVal: target,
    highlightIdx: [0]
  });

  let found = false;
  for (let i = 0; i < nodes.length; i++) {
    const isGoal = nodes[i].val === target;
    steps.push({
      status: `Inspecting Node ${i} (Value: ${nodes[i].val}). Comparing with Goal Node [${target}]: ${isGoal ? 'GOAL MATCH FOUND!' : 'Mismatch, advancing pointer to next.'}`,
      nodes: [...nodes],
      currIdx: i,
      goalVal: target,
      highlightIdx: [i],
      isGoalFound: isGoal
    });
    if (isGoal) {
      found = true;
      steps.push({
        status: `SUCCESS! Reached Goal Node [${target}] at index ${i}!`,
        nodes: [...nodes],
        currIdx: i,
        goalVal: target,
        highlightIdx: [i],
        isGoalFound: true,
        isComplete: true
      });
      break;
    }
  }

  if (!found) {
    steps.push({
      status: `Reached NULL terminator. Goal Node [${target}] was NOT found in the linked list.`,
      nodes: [...nodes],
      currIdx: nodes.length - 1,
      goalVal: target,
      highlightIdx: [],
      notFound: true
    });
  }
  return steps;
}

function generateInsertAtPosSteps(nodes, val, pos) {
  const targetPos = Math.max(0, Math.min(Number(pos), nodes.length));
  const numVal = Number(val);
  const steps = [];

  steps.push({
    status: `Goal: Insert Node [${numVal}] at Position ${targetPos}. Traversing list...`,
    nodes: [...nodes],
    currIdx: 0,
    insertPos: targetPos,
    insertVal: numVal
  });

  for (let i = 0; i < targetPos; i++) {
    steps.push({
      status: `Traversing node ${i} (${nodes[i].val}) towards insertion target index ${targetPos}.`,
      nodes: [...nodes],
      currIdx: i,
      insertPos: targetPos,
      insertVal: numVal
    });
  }

  const newNode = { id: `n_${Date.now()}`, val: numVal };
  const updatedNodes = [...nodes];
  updatedNodes.splice(targetPos, 0, newNode);

  steps.push({
    status: `Creating new Node [${numVal}] and splicing link at index ${targetPos}: (newNode.next = curr.next, curr.next = newNode).`,
    nodes: updatedNodes,
    currIdx: targetPos,
    insertPos: targetPos,
    insertVal: numVal,
    isNewNode: true
  });

  steps.push({
    status: `Successfully inserted Node [${numVal}] at position ${targetPos}!`,
    nodes: updatedNodes,
    currIdx: targetPos,
    insertPos: targetPos,
    isComplete: true
  });
  return steps;
}

function generateDeleteAtPosSteps(nodes, pos) {
  const targetPos = Math.max(0, Math.min(Number(pos), nodes.length - 1));
  const steps = [];

  steps.push({
    status: `Goal: Delete Node at Position ${targetPos} (Value: [${nodes[targetPos]?.val}]). Traversing...`,
    nodes: [...nodes],
    currIdx: 0,
    targetPos
  });

  for (let i = 0; i <= targetPos; i++) {
    steps.push({
      status: `Traversing index ${i} (${nodes[i]?.val}). ${i === targetPos ? 'Reached target position!' : 'Advancing...'}`,
      nodes: [...nodes],
      currIdx: i,
      targetPos
    });
  }

  steps.push({
    status: `Bypassing node at index ${targetPos} (prev.next = curr.next). Removing from chain.`,
    nodes: [...nodes],
    currIdx: targetPos,
    targetPos,
    bypassing: true
  });

  const updatedNodes = nodes.filter((_, idx) => idx !== targetPos);
  steps.push({
    status: `Node at position ${targetPos} successfully deleted from list!`,
    nodes: updatedNodes,
    currIdx: -1,
    isComplete: true
  });
  return steps;
}

function generateSinglySteps(nodes) {
  const steps = [];
  steps.push({
    status: `Initialized Singly Linked List with ${nodes.length} nodes. Head is [${nodes[0]?.val ?? 'null'}].`,
    nodes: [...nodes],
    currIdx: 0,
    highlightIdx: [0]
  });
  for (let i = 0; i < nodes.length; i++) {
    steps.push({
      status: `Visiting node ${i} (Value: ${nodes[i].val}). Following next pointer to [${nodes[i+1]?.val ?? 'NULL'}].`,
      nodes: [...nodes],
      currIdx: i,
      highlightIdx: [i]
    });
  }
  steps.push({
    status: `Reached end of list (NULL pointer). Traversal complete.`,
    nodes: [...nodes],
    currIdx: nodes.length - 1,
    highlightIdx: []
  });
  return steps;
}

function generateDoublySteps(nodes) {
  const steps = [];
  steps.push({
    status: `Initialized Doubly Linked List with bidirectional pointers.`,
    nodes: [...nodes],
    currIdx: 0,
    direction: 'forward'
  });
  for (let i = 0; i < nodes.length; i++) {
    steps.push({
      status: `Forward scan at node ${i} (${nodes[i].val}): Prev=[${nodes[i-1]?.val ?? 'NULL'}], Next=[${nodes[i+1]?.val ?? 'NULL'}].`,
      nodes: [...nodes],
      currIdx: i,
      direction: 'forward'
    });
  }
  for (let i = nodes.length - 1; i >= 0; i--) {
    steps.push({
      status: `Backward scan at node ${i} (${nodes[i].val}): Following curr = curr.prev.`,
      nodes: [...nodes],
      currIdx: i,
      direction: 'backward'
    });
  }
  steps.push({
    status: `Bidirectional traversal verified successfully!`,
    nodes: [...nodes],
    currIdx: 0,
    direction: 'none'
  });
  return steps;
}

function generateCircularSteps(nodes) {
  const steps = [];
  const totalSteps = nodes.length * 2;
  steps.push({
    status: `Circular List: Tail node [${nodes[nodes.length-1].val}] points directly back to Head [${nodes[0].val}].`,
    nodes: [...nodes],
    currIdx: 0,
    lap: 1
  });
  for (let s = 0; s < totalSteps; s++) {
    const idx = s % nodes.length;
    const lap = Math.floor(s / nodes.length) + 1;
    steps.push({
      status: `Lap ${lap}: Visiting node ${idx} (${nodes[idx].val}). Next: [${nodes[(idx+1)%nodes.length].val}]. Infinite loop proof.`,
      nodes: [...nodes],
      currIdx: idx,
      lap
    });
  }
  return steps;
}

function generateReverseSteps(nodes) {
  const steps = [];
  const currentNodes = nodes.map(n => ({ ...n }));
  steps.push({
    status: `Starting 3-pointer reversal. prev = NULL, curr = Head [${currentNodes[0].val}].`,
    nodes: [...currentNodes],
    prevIdx: -1,
    currIdx: 0,
    nextIdx: 1,
    reversedLinks: []
  });

  const reversed = [];
  for (let i = 0; i < currentNodes.length; i++) {
    const nextIdx = i + 1 < currentNodes.length ? i + 1 : -1;
    steps.push({
      status: `Step ${i+1}: next = curr.next [${nextIdx >= 0 ? currentNodes[nextIdx].val : 'NULL'}]. Stashing next pointer.`,
      nodes: [...currentNodes],
      prevIdx: i - 1,
      currIdx: i,
      nextIdx: nextIdx,
      reversedLinks: [...reversed]
    });

    reversed.push(i);
    steps.push({
      status: `Flipping arrow: curr.next = prev [${i > 0 ? currentNodes[i-1].val : 'NULL'}]. Arrow direction reversed!`,
      nodes: [...currentNodes],
      prevIdx: i - 1,
      currIdx: i,
      nextIdx: nextIdx,
      reversedLinks: [...reversed]
    });

    steps.push({
      status: `Advancing pointers: prev = curr [${currentNodes[i].val}], curr = next [${nextIdx >= 0 ? currentNodes[nextIdx].val : 'NULL'}].`,
      nodes: [...currentNodes],
      prevIdx: i,
      currIdx: nextIdx,
      nextIdx: nextIdx >= 0 && nextIdx + 1 < currentNodes.length ? nextIdx + 1 : -1,
      reversedLinks: [...reversed]
    });
  }

  steps.push({
    status: `Reversal complete! New Head is [${currentNodes[currentNodes.length - 1].val}].`,
    nodes: [...currentNodes].reverse(),
    prevIdx: currentNodes.length - 1,
    currIdx: -1,
    nextIdx: -1,
    reversedLinks: currentNodes.map((_, i) => i)
  });
  return steps;
}

function generateFloydSteps(nodes) {
  const steps = [];
  const cycleEntry = 2;
  const loopNodes = [...nodes];
  steps.push({
    status: `List has a loop! Tail [${nodes[nodes.length-1].val}] points back to Node [${nodes[cycleEntry].val}].`,
    nodes: loopNodes,
    slow: 0,
    fast: 0,
    phase: 1
  });

  let slow = 0, fast = 0;
  const nextOf = (idx) => (idx === loopNodes.length - 1 ? cycleEntry : idx + 1);

  let stepsCount = 0;
  while (stepsCount < 20) {
    slow = nextOf(slow);
    fast = nextOf(nextOf(fast));
    stepsCount++;
    steps.push({
      status: `Phase 1 Race: Slow (1x) at [${loopNodes[slow].val}], Fast (2x) at [${loopNodes[fast].val}].`,
      nodes: loopNodes,
      slow,
      fast,
      phase: 1
    });
    if (slow === fast) {
      steps.push({
        status: `COLLISION DETECTED at node [${loopNodes[slow].val}]! Cycle mathematically proven.`,
        nodes: loopNodes,
        slow,
        fast,
        phase: 1,
        collision: true
      });
      break;
    }
  }

  let entry = 0;
  steps.push({
    status: `Phase 2: Reset slow = Head [${loopNodes[0].val}]. Keep fast at collision node. Move both 1 step at a time.`,
    nodes: loopNodes,
    slow: entry,
    fast,
    phase: 2
  });

  while (entry !== fast) {
    entry = nextOf(entry);
    fast = nextOf(fast);
    steps.push({
      status: `Phase 2: Pointer A at [${loopNodes[entry].val}], Pointer B at [${loopNodes[fast].val}].`,
      nodes: loopNodes,
      slow: entry,
      fast,
      phase: 2
    });
  }

  steps.push({
    status: `CYCLE START FOUND at Node [${loopNodes[entry].val}] (Index ${cycleEntry})!`,
    nodes: loopNodes,
    slow: entry,
    fast: entry,
    phase: 2,
    cycleFound: true
  });
  return steps;
}

function generateMiddleSteps(nodes) {
  const steps = [];
  steps.push({
    status: `Starting Fast & Slow pointer race. Slow moves 1x speed, Fast moves 2x speed.`,
    nodes: [...nodes],
    slow: 0,
    fast: 0
  });

  let slow = 0, fast = 0;
  while (fast < nodes.length && fast + 1 < nodes.length) {
    slow += 1;
    fast += 2;
    steps.push({
      status: `Slow advanced 1 step to [${nodes[slow].val}]. Fast advanced 2 steps to [${fast < nodes.length ? nodes[fast].val : 'End'}].`,
      nodes: [...nodes],
      slow,
      fast: Math.min(fast, nodes.length - 1)
    });
  }

  steps.push({
    status: `Fast pointer reached end! Slow pointer is on MIDDLE NODE: [${nodes[slow].val}].`,
    nodes: [...nodes],
    slow,
    fast: Math.min(fast, nodes.length - 1),
    foundMiddle: true
  });
  return steps;
}

function generateMergeSteps(list1, list2) {
  const steps = [];
  const merged = [];
  let p1 = 0, p2 = 0;

  steps.push({
    status: `Comparing List 1 [${list1.join(', ')}] with List 2 [${list2.join(', ')}].`,
    list1: [...list1],
    list2: [...list2],
    merged: [],
    p1: 0,
    p2: 0
  });

  while (p1 < list1.length && p2 < list2.length) {
    const v1 = list1[p1], v2 = list2[p2];
    if (v1 <= v2) {
      merged.push(v1);
      steps.push({
        status: `Comparison: ${v1} <= ${v2}. Appending ${v1} from List 1 to Merged List. Advance p1.`,
        list1: [...list1],
        list2: [...list2],
        merged: [...merged],
        p1: p1 + 1,
        p2
      });
      p1++;
    } else {
      merged.push(v2);
      steps.push({
        status: `Comparison: ${v2} < ${v1}. Appending ${v2} from List 2 to Merged List. Advance p2.`,
        list1: [...list1],
        list2: [...list2],
        merged: [...merged],
        p1,
        p2: p2 + 1
      });
      p2++;
    }
  }

  while (p1 < list1.length) {
    merged.push(list1[p1]);
    steps.push({
      status: `List 2 exhausted. Appending remaining node ${list1[p1]} from List 1.`,
      list1: [...list1],
      list2: [...list2],
      merged: [...merged],
      p1: p1 + 1,
      p2
    });
    p1++;
  }

  while (p2 < list2.length) {
    merged.push(list2[p2]);
    steps.push({
      status: `List 1 exhausted. Appending remaining node ${list2[p2]} from List 2.`,
      list1: [...list1],
      list2: [...list2],
      merged: [...merged],
      p1,
      p2: p2 + 1
    });
    p2++;
  }

  steps.push({
    status: `Merge complete! Consolidated Sorted List: [${merged.join(' ➔ ')}].`,
    list1: [...list1],
    list2: [...list2],
    merged: [...merged],
    p1: list1.length,
    p2: list2.length,
    complete: true
  });
  return steps;
}

function generateRemoveNthSteps(nodes, n = 2) {
  const steps = [];
  const safeN = Math.min(Math.max(1, Number(n)), nodes.length);
  steps.push({
    status: `Target: Remove ${safeN}-th node from end of list. Advance fast pointer by ${safeN} nodes.`,
    nodes: [...nodes],
    slow: 0,
    fast: 0,
    phase: 'advance_fast'
  });

  let fast = 0;
  for (let i = 0; i < safeN; i++) {
    fast++;
    steps.push({
      status: `Fast pointer offset: ${i + 1}/${safeN} (Currently on [${nodes[fast]?.val ?? 'End'}]).`,
      nodes: [...nodes],
      slow: 0,
      fast: Math.min(fast, nodes.length)
    });
  }

  let slow = 0;
  while (fast < nodes.length) {
    slow++;
    fast++;
    steps.push({
      status: `Sliding window: Slow at [${nodes[slow]?.val}], Fast at [${nodes[fast]?.val ?? 'NULL'}].`,
      nodes: [...nodes],
      slow,
      fast: Math.min(fast, nodes.length)
    });
  }

  const targetIdx = nodes.length - safeN;
  steps.push({
    status: `Found target node to remove: [${nodes[targetIdx].val}] at index ${targetIdx}!`,
    nodes: [...nodes],
    slow,
    fast,
    targetIdx,
    bypassing: true
  });

  const updatedNodes = nodes.filter((_, i) => i !== targetIdx);
  steps.push({
    status: `Rerouted link around [${nodes[targetIdx].val}]. Node deleted successfully!`,
    nodes: updatedNodes,
    slow: -1,
    fast: -1,
    deleted: true
  });
  return steps;
}

function generatePalindromeSteps(nodes) {
  const steps = [];
  const vals = nodes.map(n => n.val);
  steps.push({
    status: `Testing palindrome symmetry on [${vals.join(' ➔ ')}].`,
    nodes: [...nodes],
    p1: 0,
    p2: vals.length - 1,
    isSymmetric: true
  });

  let l = 0, r = vals.length - 1;
  while (l < r) {
    steps.push({
      status: `Comparing node ${l} (${vals[l]}) with node ${r} (${vals[r]}).`,
      nodes: [...nodes],
      p1: l,
      p2: r,
      isSymmetric: vals[l] === vals[r]
    });

    if (vals[l] !== vals[r]) {
      steps.push({
        status: `MISMATCH: ${vals[l]} !== ${vals[r]}. Linked list is NOT a palindrome!`,
        nodes: [...nodes],
        p1: l,
        p2: r,
        isSymmetric: false,
        failed: true
      });
      return steps;
    }
    l++;
    r--;
  }

  steps.push({
    status: `All mirrored pairs matched! Linked list IS a valid PALINDROME.`,
    nodes: [...nodes],
    p1: l,
    p2: r,
    isSymmetric: true,
    success: true
  });
  return steps;
}

function generateIntersectionSteps(listA, listB, common) {
  const steps = [];
  const fullA = [...listA, ...common];
  const fullB = [...listB, ...common];

  steps.push({
    status: `List A: [${fullA.join(' ➔ ')}]. List B: [${fullB.join(' ➔ ')}]. Common tail starts at [${common[0]}].`,
    fullA,
    fullB,
    pA: 0,
    pB: 0,
    switchA: false,
    switchB: false
  });

  let pA = 0, pB = 0;
  let switchedA = false, switchedB = false;

  for (let s = 0; s < 12; s++) {
    const nodeA = switchedA ? fullB[pA] : fullA[pA];
    const nodeB = switchedB ? fullA[pB] : fullB[pB];

    steps.push({
      status: `Step ${s+1}: Pointer A at [${nodeA}], Pointer B at [${nodeB}].`,
      fullA,
      fullB,
      pA,
      pB,
      switchedA,
      switchedB
    });

    if (switchedA && switchedB && nodeA === nodeB && nodeA === common[0]) {
      steps.push({
        status: `INTERSECTION FOUND! Both pointers met at shared node [${common[0]}].`,
        fullA,
        fullB,
        pA,
        pB,
        intersectNode: common[0],
        found: true
      });
      break;
    }

    pA++;
    if (!switchedA && pA >= fullA.length) {
      pA = 0;
      switchedA = true;
    } else if (switchedA && pA >= fullB.length) {
      pA = 0;
    }

    pB++;
    if (!switchedB && pB >= fullB.length) {
      pB = 0;
      switchedB = true;
    } else if (switchedB && pB >= fullA.length) {
      pB = 0;
    }
  }
  return steps;
}

function generateDeleteValSteps(nodes, targetVal = 42) {
  const steps = [];
  const target = Number(targetVal);
  steps.push({
    status: `Searching for node with value ${target} to delete.`,
    nodes: [...nodes],
    prev: -1,
    curr: 0
  });

  let prev = -1, curr = 0;
  let found = false;

  for (let i = 0; i < nodes.length; i++) {
    steps.push({
      status: `Inspecting node ${i} (${nodes[i].val}). Does it equal target ${target}?`,
      nodes: [...nodes],
      prev: i - 1,
      curr: i
    });

    if (nodes[i].val === target) {
      found = true;
      steps.push({
        status: `MATCH! Node ${i} has value ${target}. Rewiring: prev.next = curr.next.`,
        nodes: [...nodes],
        prev: i - 1,
        curr: i,
        targetFound: true
      });
      break;
    }
  }

  if (found) {
    const updated = nodes.filter(n => n.val !== target);
    steps.push({
      status: `Node ${target} bypassed and removed from memory!`,
      nodes: updated,
      prev: -1,
      curr: -1,
      deleted: true
    });
  } else {
    steps.push({
      status: `Value ${target} not found in the list. List remains unchanged.`,
      nodes: [...nodes],
      prev: -1,
      curr: -1
    });
  }
  return steps;
}

function generateLruSteps(operations) {
  const steps = [];
  const capacity = 3;
  let cache = [];

  steps.push({
    status: `LRU Cache initialized with Capacity = ${capacity}. MRU is Head, LRU is Tail.`,
    cache: [],
    capacity
  });

  for (let op of operations) {
    if (op.type === 'put') {
      const existingIdx = cache.findIndex(c => c.key === op.key);
      if (existingIdx !== -1) {
        cache.splice(existingIdx, 1);
        cache.unshift({ key: op.key, val: op.val });
        steps.push({
          status: `PUT(${op.key}, ${op.val}): Key ${op.key} existed. Updated and moved to MRU Head.`,
          cache: [...cache],
          capacity,
          activeKey: op.key
        });
      } else {
        let evicted = null;
        if (cache.length >= capacity) {
          evicted = cache.pop();
        }
        cache.unshift({ key: op.key, val: op.val });
        steps.push({
          status: `PUT(${op.key}, ${op.val}): Inserted at MRU Head. ${evicted ? `Evicted LRU key '${evicted.key}' from tail.` : ''}`,
          cache: [...cache],
          capacity,
          activeKey: op.key,
          evictedKey: evicted ? evicted.key : null
        });
      }
    } else if (op.type === 'get') {
      const idx = cache.findIndex(c => c.key === op.key);
      if (idx !== -1) {
        const item = cache.splice(idx, 1)[0];
        cache.unshift(item);
        steps.push({
          status: `GET(${op.key}): Cache HIT! Value = ${item.val}. Node promoted to MRU Head.`,
          cache: [...cache],
          capacity,
          activeKey: op.key,
          hit: true
        });
      } else {
        steps.push({
          status: `GET(${op.key}): Cache MISS (-1). Key not found in cache.`,
          cache: [...cache],
          capacity,
          activeKey: op.key,
          hit: false
        });
      }
    }
  }
  return steps;
}

// MAIN EXPORT COMPONENT
export default function LinkedListVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const currentAlgoId = useMemo(() => {
    const valid = LINKED_LIST_ALGORITHMS.find(a => a.id === algoId);
    return valid ? valid.id : 'singly';
  }, [algoId]);

  const currentAlgo = useMemo(() => {
    return LINKED_LIST_ALGORITHMS.find(a => a.id === currentAlgoId) || LINKED_LIST_ALGORITHMS[0];
  }, [currentAlgoId]);

  // General linked list state
  const [nodeList, setNodeList] = useState([
    { id: 'n1', val: 12 },
    { id: 'n2', val: 24 },
    { id: 'n3', val: 36 },
    { id: 'n4', val: 48 },
    { id: 'n5', val: 60 }
  ]);

  // Node Insertion & Position Inputs
  const [nodeValToAdd, setNodeValToAdd] = useState('99');
  const [nodePositionToAdd, setNodePositionToAdd] = useState('2');

  // Goal Node to Search Input
  const [goalNodeVal, setGoalNodeVal] = useState('48');

  // Position to delete input
  const [positionToDelete, setPositionToDelete] = useState('0');

  // Extra inputs
  const [nthParam, setNthParam] = useState(2);
  const [deleteTarget, setDeleteTarget] = useState('36');
  const [isMuted, setIsMuted] = useState(false);

  // Playback state
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  // Default step generator
  const computeSteps = () => {
    let gen = [];
    if (currentAlgoId === 'singly') {
      gen = generateSinglySteps(nodeList);
    } else if (currentAlgoId === 'doubly') {
      gen = generateDoublySteps(nodeList);
    } else if (currentAlgoId === 'circular') {
      gen = generateCircularSteps(nodeList);
    } else if (currentAlgoId === 'reverse') {
      gen = generateReverseSteps(nodeList);
    } else if (currentAlgoId === 'floyd_cycle') {
      gen = generateFloydSteps([
        { id: 'c1', val: 1 }, { id: 'c2', val: 2 }, { id: 'c3', val: 3 },
        { id: 'c4', val: 4 }, { id: 'c5', val: 5 }, { id: 'c6', val: 6 }
      ]);
    } else if (currentAlgoId === 'middle_node') {
      gen = generateMiddleSteps(nodeList.length >= 3 ? nodeList : [
        { id: 'm1', val: 10 }, { id: 'm2', val: 20 }, { id: 'm3', val: 30 },
        { id: 'm4', val: 40 }, { id: 'm5', val: 50 }, { id: 'm6', val: 60 }, { id: 'm7', val: 70 }
      ]);
    } else if (currentAlgoId === 'merge_sorted') {
      gen = generateMergeSteps([1, 3, 5, 7], [2, 4, 6, 8]);
    } else if (currentAlgoId === 'remove_nth') {
      gen = generateRemoveNthSteps(nodeList, nthParam);
    } else if (currentAlgoId === 'palindrome') {
      gen = generatePalindromeSteps([
        { id: 'p1', val: 1 }, { id: 'p2', val: 2 }, { id: 'p3', val: 3 },
        { id: 'p4', val: 2 }, { id: 'p5', val: 1 }
      ]);
    } else if (currentAlgoId === 'intersection') {
      gen = generateIntersectionSteps(['A1', 'A2'], ['B1', 'B2', 'B3'], ['C1', 'C2', 'C3']);
    } else if (currentAlgoId === 'delete_val') {
      gen = generateDeleteValSteps(nodeList, parseInt(deleteTarget) || 36);
    } else if (currentAlgoId === 'lru_cache') {
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

  useEffect(() => {
    computeSteps();
  }, [currentAlgoId, nodeList, nthParam, deleteTarget]);

  // Action: Search Goal Node
  const handleSearchGoalNode = () => {
    const gen = generateSearchGoalSteps(nodeList, goalNodeVal);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    playSynthTone('traverse', isMuted);
  };

  // Action: Insert Node at Specified Position
  const handleInsertAtPosition = () => {
    const val = parseInt(nodeValToAdd) || Math.floor(Math.random() * 90) + 10;
    const pos = Math.max(0, Math.min(parseInt(nodePositionToAdd) || 0, nodeList.length));
    const gen = generateInsertAtPosSteps(nodeList, val, pos);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);

    // Also persist into nodeList once complete
    const updated = [...nodeList];
    updated.splice(pos, 0, { id: `n_${Date.now()}`, val });
    setNodeList(updated);
    playSynthTone('insert', isMuted);
  };

  // Action: Insert Head
  const handleInsertHead = () => {
    const val = parseInt(nodeValToAdd) || Math.floor(Math.random() * 90) + 10;
    const gen = generateInsertAtPosSteps(nodeList, val, 0);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setNodeList([{ id: `n_${Date.now()}`, val }, ...nodeList]);
    playSynthTone('insert', isMuted);
  };

  // Action: Insert Tail
  const handleInsertTail = () => {
    const val = parseInt(nodeValToAdd) || Math.floor(Math.random() * 90) + 10;
    const pos = nodeList.length;
    const gen = generateInsertAtPosSteps(nodeList, val, pos);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setNodeList([...nodeList, { id: `n_${Date.now()}`, val }]);
    playSynthTone('insert', isMuted);
  };

  // Action: Delete at Position
  const handleDeleteAtPosition = () => {
    if (nodeList.length <= 1) return;
    const pos = Math.max(0, Math.min(parseInt(positionToDelete) || 0, nodeList.length - 1));
    const gen = generateDeleteAtPosSteps(nodeList, pos);
    setSteps(gen);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setNodeList(nodeList.filter((_, idx) => idx !== pos));
    playSynthTone('delete', isMuted);
  };

  // Ticker loop with speed handling
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(80, Math.round(900 / speed));
      timerRef.current = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          const nextIdx = currentStepIdx + 1;
          setCurrentStepIdx(nextIdx);
          playSynthTone('traverse', isMuted);
        } else {
          setIsPlaying(false);
          playSynthTone('success', isMuted);
        }
      }, delay);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIdx, steps.length, speed, isMuted]);

  const step = steps[currentStepIdx] || {};

  // Playback Handlers (Matches VisualizerPlaybackBar props exactly!)
  const handlePlay = () => {
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
    setCurrentStepIdx(0);
  };

  // DYNAMIC CANVAS RENDERER
  const renderCanvas = () => {
    // 1. MERGE SORTED CANVAS
    if (currentAlgoId === 'merge_sorted') {
      const l1 = step.list1 || [];
      const l2 = step.list2 || [];
      const merged = step.merged || [];
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 w-full">
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-cyan-400 font-bold mb-2">List 1 (Pointer p1: {step.p1 ?? 0})</span>
              <div className="flex items-center gap-2">
                {l1.map((v, i) => (
                  <React.Fragment key={i}>
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono font-bold ${
                      step.p1 === i ? 'border-cyan-400 bg-cyan-500/30 text-white scale-110' : i < step.p1 ? 'border-slate-800 bg-slate-900/40 text-slate-600' : 'border-slate-700 bg-slate-800 text-slate-200'
                    }`}>
                      {v}
                    </div>
                    {i < l1.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-mono text-purple-400 font-bold mb-2">List 2 (Pointer p2: {step.p2 ?? 0})</span>
              <div className="flex items-center gap-2">
                {l2.map((v, i) => (
                  <React.Fragment key={i}>
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono font-bold ${
                      step.p2 === i ? 'border-purple-400 bg-purple-500/30 text-white scale-110' : i < step.p2 ? 'border-slate-800 bg-slate-900/40 text-slate-600' : 'border-slate-700 bg-slate-800 text-slate-200'
                    }`}>
                      {v}
                    </div>
                    {i < l2.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-xs font-mono text-emerald-400 font-bold mb-3 flex items-center gap-1.5">
              <GitMerge className="w-4 h-4" /> Consolidated Zippered Merged List
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {merged.length === 0 ? (
                <span className="text-xs font-mono text-slate-500">Merging in progress...</span>
              ) : (
                merged.map((v, i) => (
                  <React.Fragment key={i}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-mono font-bold text-emerald-200"
                    >
                      {v}
                    </motion.div>
                    {i < merged.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    // 2. INTERSECTION CANVAS
    if (currentAlgoId === 'intersection') {
      const fullA = step.fullA || [];
      const fullB = step.fullB || [];
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold w-14">List A:</span>
              {fullA.map((val, i) => (
                <React.Fragment key={i}>
                  <div className={`px-3 py-2 rounded-xl border font-mono font-bold text-sm ${
                    val.startsWith('C') ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-700 bg-slate-800 text-slate-200'
                  }`}>
                    {val}
                  </div>
                  {i < fullA.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600" />}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 font-bold w-14">List B:</span>
              {fullB.map((val, i) => (
                <React.Fragment key={i}>
                  <div className={`px-3 py-2 rounded-xl border font-mono font-bold text-sm ${
                    val.startsWith('C') ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-700 bg-slate-800 text-slate-200'
                  }`}>
                    {val}
                  </div>
                  {i < fullB.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600" />}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
            Green nodes [C1, C2, C3] represent the shared memory intersection tail.
          </div>
        </div>
      );
    }

    // 3. LRU CACHE CANVAS
    if (currentAlgoId === 'lru_cache') {
      const cache = step.cache || [];
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 font-bold">MRU (Head)</span>
            <div className="flex items-center gap-3">
              {cache.map((item, idx) => (
                <React.Fragment key={item.key}>
                  <motion.div
                    animate={{
                      scale: step.activeKey === item.key ? 1.12 : 1,
                      borderColor: step.activeKey === item.key ? '#06b6d4' : '#334155'
                    }}
                    className="flex flex-col items-center p-3 rounded-xl border bg-slate-900 min-w-[70px] shadow-md"
                  >
                    <span className="text-xs font-mono text-slate-400">Key: <strong className="text-cyan-400">{item.key}</strong></span>
                    <span className="text-sm font-mono font-bold text-slate-100 mt-1">{item.val}</span>
                  </motion.div>
                  {idx < cache.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
                </React.Fragment>
              ))}
              {cache.length === 0 && (
                <span className="text-xs font-mono text-slate-500">Cache Empty</span>
              )}
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold">LRU (Tail)</span>
          </div>
        </div>
      );
    }

    // 4. FLOYD CYCLE CANVAS
    if (currentAlgoId === 'floyd_cycle') {
      const nodes = step.nodes || [];
      return (
        <div className="flex flex-col items-center gap-6 w-full py-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {nodes.map((n, i) => {
              const isSlow = step.slow === i;
              const isFast = step.fast === i;
              const inCycle = i >= 2;
              return (
                <div key={n.id} className="flex flex-col items-center">
                  <div className="flex gap-1 mb-1">
                    {isSlow && <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-400 rounded text-[9px] font-mono text-amber-300 font-bold">SLOW</span>}
                    {isFast && <span className="px-1.5 py-0.5 bg-cyan-500/20 border border-cyan-400 rounded text-[9px] font-mono text-cyan-300 font-bold">FAST</span>}
                  </div>
                  <motion.div
                    animate={{
                      scale: (isSlow || isFast) ? 1.15 : 1,
                      borderColor: inCycle ? '#8b5cf6' : '#334155',
                      backgroundColor: inCycle ? 'rgba(139, 92, 246, 0.15)' : '#0f172a'
                    }}
                    className="w-12 h-12 rounded-2xl border flex items-center justify-center font-mono font-bold text-slate-100 shadow-md"
                  >
                    {n.val}
                  </motion.div>
                </div>
              );
            })}
          </div>
          <div className="text-xs font-mono text-purple-400 bg-purple-950/30 border border-purple-800/40 px-4 py-2 rounded-xl">
            Loop Link: Node 6 ➔ loops back to Node 3 (Purple nodes are inside loop)
          </div>
        </div>
      );
    }

    // 5. STANDARD CHAIN CANVAS (Singly, Doubly, Circular, Reverse, Middle, RemoveNth, Palindrome, DeleteVal, SearchGoal)
    const activeNodes = step.nodes || nodeList;
    return (
      <div className="flex flex-col items-center gap-6 w-full py-4">
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-full overflow-x-auto p-4">
          {activeNodes.map((node, idx) => {
            const isCurr = step.currIdx === idx || step.slow === idx || step.p1 === idx;
            const isPrev = step.prevIdx === idx || step.p2 === idx;
            const isNext = step.nextIdx === idx || step.fast === idx;
            const isReversed = step.reversedLinks && step.reversedLinks.includes(idx);
            const isMiddle = step.foundMiddle && step.slow === idx;
            const isGoal = step.isGoalFound && step.currIdx === idx;
            const isTargetPos = step.insertPos === idx || step.targetPos === idx;

            return (
              <React.Fragment key={node.id || idx}>
                <div className="flex flex-col items-center">
                  {/* Pointer Badges */}
                  <div className="h-5 flex items-center gap-1 mb-1">
                    {isGoal && <span className="px-2 py-0.5 bg-emerald-500/30 border border-emerald-400 rounded text-[9px] font-mono text-emerald-300 font-bold">GOAL!</span>}
                    {isPrev && <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-400 rounded text-[9px] font-mono text-amber-300 font-bold">PREV</span>}
                    {isCurr && !isGoal && <span className="px-1.5 py-0.5 bg-cyan-500/20 border border-cyan-400 rounded text-[9px] font-mono text-cyan-300 font-bold">CURR</span>}
                    {isNext && <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-400 rounded text-[9px] font-mono text-purple-300 font-bold">NEXT</span>}
                    {isMiddle && <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-400 rounded text-[9px] font-mono text-emerald-300 font-bold">MID</span>}
                  </div>

                  {/* Node Pill */}
                  <motion.div
                    animate={{
                      scale: isGoal ? 1.25 : isCurr || isMiddle ? 1.15 : 1,
                      borderColor: isGoal ? '#10b981' : isMiddle ? '#10b981' : isTargetPos ? '#f59e0b' : isCurr ? '#06b6d4' : '#334155',
                      backgroundColor: isGoal ? 'rgba(16, 185, 129, 0.35)' : isMiddle ? 'rgba(16, 185, 129, 0.25)' : isCurr ? 'rgba(6, 182, 212, 0.25)' : '#0f172a'
                    }}
                    className="flex rounded-xl border overflow-hidden shadow-lg"
                  >
                    <div className="px-3.5 py-2 font-mono font-bold text-slate-100 flex items-center justify-center min-w-[44px]">
                      {node.val}
                    </div>
                    <div className="px-2 py-2 bg-slate-900 border-l border-slate-800 text-[10px] font-mono text-slate-500 flex items-center">
                      •
                    </div>
                  </motion.div>

                  <span className="text-[10px] font-mono text-slate-500 mt-1">pos {idx}</span>
                </div>

                {/* Connecting Arrow */}
                {idx < activeNodes.length - 1 && (
                  <div className="flex items-center text-slate-500 px-1">
                    {currentAlgoId === 'doubly' ? (
                      <span className="text-xs font-mono font-bold text-slate-400">⇄</span>
                    ) : isReversed ? (
                      <ArrowLeft className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-cyan-500" />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {currentAlgoId !== 'circular' && (
            <div className="flex items-center gap-1.5 pl-2">
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <div className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-500 font-bold">
                NULL
              </div>
            </div>
          )}

          {currentAlgoId === 'circular' && (
            <div className="flex items-center gap-1.5 pl-2">
              <Repeat className="w-4 h-4 text-amber-400 animate-spin" />
              <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 font-bold">
                ➔ HEAD
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      category="Linked List Data Structures"
      headerRight={
        <div className="flex items-center gap-3">
          <select
            value={currentAlgoId}
            onChange={(e) => navigate(`/visualizer/linkedlist/${e.target.value}`)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {LINKED_LIST_ALGORITHMS.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <Link
            to="/visualizer/linkedlist"
            className="text-xs px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-mono transition-colors"
          >
            All Algorithms
          </Link>
        </div>
      }
      controls={
        <div className="flex flex-col gap-3.5 w-full">
          {/* USER INTERACTION BAR: GOAL NODE & INSERT AT POSITION CONTROLS */}
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-md">
            
            {/* 1. Goal Node Search Input & Trigger */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Goal Node:
              </span>
              <input
                type="number"
                value={goalNodeVal}
                onChange={(e) => setGoalNodeVal(e.target.value)}
                className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                placeholder="48"
              />
              <button
                onClick={handleSearchGoalNode}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all active:scale-95"
              >
                <Search className="w-3.5 h-3.5" /> Find Goal
              </button>
            </div>

            {/* 2. Add Node with Value & Position Input */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Node:
              </span>
              <input
                type="number"
                value={nodeValToAdd}
                onChange={(e) => setNodeValToAdd(e.target.value)}
                className="w-14 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                placeholder="Val"
                title="Node Value to add"
              />
              <span className="text-xs font-mono text-slate-400">at Pos:</span>
              <input
                type="number"
                min="0"
                max={nodeList.length}
                value={nodePositionToAdd}
                onChange={(e) => setNodePositionToAdd(e.target.value)}
                className="w-12 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="Pos"
                title="Position / Index to insert"
              />
              <button
                onClick={handleInsertAtPosition}
                className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500 text-cyan-200 rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
              >
                Insert at Pos
              </button>
              <button
                onClick={handleInsertHead}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-mono text-slate-300"
              >
                Head
              </button>
              <button
                onClick={handleInsertTail}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-mono text-slate-300"
              >
                Tail
              </button>
            </div>

            {/* 3. Delete at Position */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Del Pos:
              </span>
              <input
                type="number"
                min="0"
                max={Math.max(0, nodeList.length - 1)}
                value={positionToDelete}
                onChange={(e) => setPositionToDelete(e.target.value)}
                className="w-12 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={handleDeleteAtPosition}
                className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Core Playback Controller with Exact Prop Binding */}
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
          />
        </div>
      }
    >
      <div className="flex flex-col gap-6 w-full">
        {/* Step Status Callout */}
        <div className="p-3.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl flex items-start gap-3 shadow-lg">
          <Activity className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Step {currentStepIdx + 1} of {Math.max(1, steps.length)}
            </span>
            <span className="text-sm font-mono text-slate-200 mt-0.5 leading-relaxed">
              {step.status || "Click Play or Step Forward to start simulation."}
            </span>
          </div>
        </div>

        {/* Dynamic Canvas */}
        <div className="min-h-[280px] flex items-center justify-center bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
          {renderCanvas()}
        </div>

        {/* Intuition (ELI5) Card */}
        {INTUITIONS[currentAlgoId] && (
          <div className="p-5 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
              <Lightbulb className="w-5 h-5" /> Intuition & ELI5: {currentAlgo.name}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">How To Think About It</span>
                <p className="text-xs text-slate-300 leading-relaxed">{INTUITIONS[currentAlgoId].concept}</p>
              </div>
              <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">Why It Works</span>
                <p className="text-xs text-slate-300 leading-relaxed">{INTUITIONS[currentAlgoId].whyItWorks}</p>
              </div>
              <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <span className="text-xs font-mono font-bold text-amber-400 block mb-1">Real-World Metaphor</span>
                <p className="text-xs text-slate-300 leading-relaxed">{INTUITIONS[currentAlgoId].analogy}</p>
              </div>
            </div>
          </div>
        )}

        {/* Complexity Badges */}
        <div className="flex flex-wrap gap-4 items-center">
          <ComplexityBadge type="time" complexity={currentAlgo.complexity?.time?.average || currentAlgo.tag} />
          <ComplexityBadge type="space" complexity={currentAlgo.complexity?.space || "O(1)"} />
        </div>

        {/* Code Inspector */}
        {CODE_SNIPPETS[currentAlgoId] && (
          <CodeInspector snippets={CODE_SNIPPETS[currentAlgoId]} />
        )}
      </div>
    </ResponsiveVisualizerShell>
  );
}
