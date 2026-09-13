import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Search, ArrowRight, ArrowLeft, RefreshCw, Layers,
  Compass, Lightbulb, FastForward, CheckCircle, AlertCircle, Eye,
  Sliders, Activity, Cpu, Database, GitMerge, Split, ShieldCheck, Repeat, Target, Award, Zap, Check, X, Sparkles, Flame, Info, Shuffle
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';
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


// ========================================================
// STEP GENERATORS FOR ALL 12 LINKED LIST ALGORITHMS + OPERATIONS
// ========================================================

function generateSearchGoalSteps(nodes, goalVal) {
  const steps = [];
  const target = Number(goalVal);
  steps.push({
    status: `Searching for Goal Node (${target}). Starting at Head...`,
    nodes: [...nodes],
    currIdx: 0,
    goalVal: target
  });

  let found = false;
  for (let i = 0; i < nodes.length; i++) {
    const isMatch = nodes[i].val === target;
    steps.push({
      status: isMatch 
        ? `FOUND! Node at index ${i} has value ${nodes[i].val} == Goal ${target}.`
        : `Checking index ${i}: Value ${nodes[i].val} !== ${target}. Moving next...`,
      nodes: [...nodes],
      currIdx: i,
      goalVal: target,
      isGoalFound: isMatch
    });
    if (isMatch) {
      found = true;
      break;
    }
  }

  if (!found) {
    steps.push({
      status: `Goal ${target} not found in linked list (reached NULL).`,
      nodes: [...nodes],
      currIdx: -1,
      goalVal: target,
      notFound: true,
      isComplete: true
    });
  }
  return steps;
}

function generateInsertAtPosSteps(nodes, val, pos) {
  const steps = [];
  const safePos = Math.max(0, Math.min(pos, nodes.length));
  
  steps.push({
    status: `Target: Insert new node (${val}) at index ${safePos}.`,
    nodes: [...nodes],
    currIdx: 0,
    insertPos: safePos,
    newVal: val
  });

  if (safePos === 0) {
    // Insert at Head
    const newNodes = [{ id: `n_${Date.now()}`, val }, ...nodes];
    steps.push({
      status: `Created new node (${val}). Setting newNode.next = head.`,
      nodes: newNodes,
      currIdx: 0,
      insertPos: 0,
      newVal: val,
      isNew: true
    });
    steps.push({
      status: `Head updated! New node (${val}) is now HEAD of the list.`,
      nodes: newNodes,
      currIdx: 0,
      insertPos: 0,
      isComplete: true
    });
    return steps;
  }

  for (let i = 0; i < safePos; i++) {
    steps.push({
      status: `Traversing index ${i} (${nodes[i].val}). Finding insertion predecessor...`,
      nodes: [...nodes],
      currIdx: i,
      prevIdx: i - 1,
      insertPos: safePos,
      newVal: val
    });
  }

  const updatedNodes = [...nodes];
  updatedNodes.splice(safePos, 0, { id: `n_${Date.now()}`, val });

  steps.push({
    status: `Linking newNode (${val}).next = curr.next. Then curr.next = newNode.`,
    nodes: updatedNodes,
    currIdx: safePos,
    prevIdx: safePos - 1,
    insertPos: safePos,
    newVal: val,
    isNew: true
  });

  steps.push({
    status: `Node (${val}) inserted cleanly at index ${safePos}!`,
    nodes: updatedNodes,
    currIdx: safePos,
    insertPos: safePos,
    isComplete: true
  });

  return steps;
}

function generateDeleteAtPosSteps(nodes, pos) {
  const steps = [];
  if (nodes.length <= 1) {
    steps.push({
      status: `Cannot delete: list must retain at least 1 node.`,
      nodes: [...nodes],
      currIdx: 0,
      isComplete: true
    });
    return steps;
  }

  const targetPos = Math.max(0, Math.min(pos, nodes.length - 1));

  steps.push({
    status: `Target: Delete node at index ${targetPos} (Val: ${nodes[targetPos]?.val}).`,
    nodes: [...nodes],
    currIdx: 0,
    targetPos
  });

  for (let i = 0; i <= targetPos; i++) {
    steps.push({
      status: i === targetPos
        ? `Target reached at index ${i} (${nodes[i]?.val}).`
        : `Traversing index ${i} (${nodes[i]?.val}). Advancing...`,
      nodes: [...nodes],
      currIdx: i,
      prevIdx: i - 1,
      targetPos
    });
  }

  steps.push({
    status: `Bypassing node at index ${targetPos}: prev.next = curr.next. Severing link.`,
    nodes: [...nodes],
    currIdx: targetPos,
    prevIdx: targetPos - 1,
    targetPos,
    isSevering: true
  });

  const updatedNodes = nodes.filter((_, idx) => idx !== targetPos);

  steps.push({
    status: `Node at index ${targetPos} removed. Memory recycled.`,
    nodes: updatedNodes,
    currIdx: Math.min(targetPos, updatedNodes.length - 1),
    isComplete: true
  });

  return steps;
}

function generateSinglySteps(nodes) {
  const steps = [];
  steps.push({
    status: `Singly Linked List: Head is [${nodes[0]?.val ?? 'null'}].`,
    nodes: [...nodes],
    currIdx: 0,
    nextIdx: nodes.length > 1 ? 1 : -1
  });
  for (let i = 0; i < nodes.length; i++) {
    steps.push({
      status: `Visiting node ${i} (${nodes[i].val}). Following .next pointer to [${nodes[i+1]?.val ?? 'NULL'}].`,
      nodes: [...nodes],
      currIdx: i,
      prevIdx: i - 1,
      nextIdx: i + 1 < nodes.length ? i + 1 : -1
    });
  }
  steps.push({
    status: `Reached end of list (NULL pointer). Traversal complete.`,
    nodes: [...nodes],
    currIdx: -1,
    prevIdx: nodes.length - 1,
    nextIdx: -1,
    isComplete: true
  });
  return steps;
}

function generateDoublySteps(nodes) {
  const steps = [];
  steps.push({
    status: `Doubly Linked List: Bidirectional pointer chain.`,
    nodes: [...nodes],
    currIdx: 0,
    nextIdx: nodes.length > 1 ? 1 : -1,
    direction: 'forward'
  });
  // Forward pass
  for (let i = 0; i < nodes.length; i++) {
    steps.push({
      status: `Forward scan at node ${i} (${nodes[i].val}): Prev=[${nodes[i-1]?.val ?? 'NULL'}], Next=[${nodes[i+1]?.val ?? 'NULL'}].`,
      nodes: [...nodes],
      currIdx: i,
      prevIdx: i - 1,
      nextIdx: i + 1 < nodes.length ? i + 1 : -1,
      direction: 'forward'
    });
  }
  // Backward pass
  for (let i = nodes.length - 1; i >= 0; i--) {
    steps.push({
      status: `Backward scan at node ${i} (${nodes[i].val}): Following curr = curr.prev.`,
      nodes: [...nodes],
      currIdx: i,
      prevIdx: i - 1,
      nextIdx: i + 1 < nodes.length ? i + 1 : -1,
      direction: 'backward'
    });
  }
  steps.push({
    status: `Two-way traversal complete.`,
    nodes: [...nodes],
    currIdx: 0,
    direction: 'done',
    isComplete: true
  });
  return steps;
}

function generateCircularSteps(nodes) {
  const steps = [];
  const totalLaps = 2;
  const totalSteps = nodes.length * totalLaps;
  steps.push({
    status: `Circular List: Tail [${nodes[nodes.length-1]?.val}] points back to Head [${nodes[0]?.val}].`,
    nodes: [...nodes],
    currIdx: 0,
    nextIdx: 1 % nodes.length,
    lap: 1
  });
  for (let s = 0; s < totalSteps; s++) {
    const idx = s % nodes.length;
    const nextIdx = (idx + 1) % nodes.length;
    const lap = Math.floor(s / nodes.length) + 1;
    steps.push({
      status: `Lap ${lap}: Visiting node ${idx} (${nodes[idx].val}). Next: [${nodes[nextIdx].val}].`,
      nodes: [...nodes],
      currIdx: idx,
      nextIdx,
      lap
    });
  }
  steps.push({
    status: `Demonstrated circular ring continuity across ${totalLaps} laps.`,
    nodes: [...nodes],
    currIdx: 0,
    lap: totalLaps,
    isComplete: true
  });
  return steps;
}

function generateReverseSteps(nodes) {
  const steps = [];
  const n = nodes.length;
  steps.push({
    status: `Starting 3-pointer reversal. prev = NULL, curr = Head (${nodes[0]?.val}).`,
    nodes: [...nodes],
    prevIdx: -1,
    currIdx: 0,
    nextIdx: n > 1 ? 1 : -1,
    reversedLinks: []
  });

  const reversed = [];
  for (let i = 0; i < n; i++) {
    const nextIdx = i + 1 < n ? i + 1 : -1;
    
    // Step A: Stash next
    steps.push({
      status: `Step ${i + 1}: next = curr.next (${nextIdx >= 0 ? nodes[nextIdx].val : 'NULL'}).`,
      nodes: [...nodes],
      prevIdx: i - 1,
      currIdx: i,
      nextIdx,
      reversedLinks: [...reversed]
    });

    // Step B: Flip arrow
    reversed.push(i);
    steps.push({
      status: `Flipping link: curr.next = prev (${i > 0 ? nodes[i-1].val : 'NULL'}). Link reversed!`,
      nodes: [...nodes],
      prevIdx: i - 1,
      currIdx: i,
      nextIdx,
      reversedLinks: [...reversed],
      isFlipping: true
    });

    // Step C: Advance pointers
    steps.push({
      status: `Advancing: prev = curr (${nodes[i].val}), curr = next (${nextIdx >= 0 ? nodes[nextIdx].val : 'NULL'}).`,
      nodes: [...nodes],
      prevIdx: i,
      currIdx: nextIdx,
      nextIdx: nextIdx >= 0 && nextIdx + 1 < n ? nextIdx + 1 : -1,
      reversedLinks: [...reversed]
    });
  }

  steps.push({
    status: `Reversal complete! New HEAD is [${nodes[n-1]?.val}].`,
    nodes: [...nodes],
    prevIdx: n - 1,
    currIdx: -1,
    nextIdx: -1,
    reversedLinks: [...reversed],
    isComplete: true
  });

  return steps;
}

function generateMiddleSteps(nodes) {
  const steps = [];
  steps.push({
    status: `Starting Tortoise & Hare race: Slow (1x), Fast (2x).`,
    nodes: [...nodes],
    slow: 0,
    fast: 0
  });

  let slow = 0, fast = 0;
  while (fast < nodes.length - 1 && fast + 1 < nodes.length) {
    slow += 1;
    fast += 2;
    steps.push({
      status: `Slow advanced 1x to [${nodes[slow]?.val}]. Fast advanced 2x to [${fast < nodes.length ? nodes[fast]?.val : 'End'}].`,
      nodes: [...nodes],
      slow,
      fast: Math.min(fast, nodes.length - 1)
    });
  }

  steps.push({
    status: `Fast pointer reached end! Slow pointer is on MIDDLE NODE: [${nodes[slow]?.val}].`,
    nodes: [...nodes],
    slow,
    fast: Math.min(fast, nodes.length - 1),
    foundMiddle: true,
    isComplete: true
  });

  return steps;
}

function generateFloydSteps(nodes, cycleEntryIndex = 2) {
  const steps = [];
  const n = nodes.length;
  const hasLoop = cycleEntryIndex >= 0 && cycleEntryIndex < n;
  const cycleEntry = hasLoop ? cycleEntryIndex : -1;

  if (!hasLoop) {
    // Clean run with no cycle
    steps.push({
      status: `Floyd Cycle Check: Testing list with NO cycle.`,
      nodes: [...nodes],
      slow: 0,
      fast: 0,
      phase: 1,
      hasCycle: false
    });

    let slow = 0, fast = 0;
    while (fast < n - 1 && fast + 1 < n) {
      slow += 1;
      fast += 2;
      steps.push({
        status: `Slow at [${nodes[slow]?.val}], Fast at [${fast < n ? nodes[fast]?.val : 'NULL'}].`,
        nodes: [...nodes],
        slow,
        fast: Math.min(fast, n - 1),
        phase: 1,
        hasCycle: false
      });
    }

    steps.push({
      status: `Fast reached NULL pointer! No cycle exists in list.`,
      nodes: [...nodes],
      slow,
      fast: n,
      phase: 1,
      hasCycle: false,
      noCycleFound: true,
      isComplete: true
    });
    return steps;
  }

  // List with cycle
  steps.push({
    status: `Floyd's Cycle: Tail (${nodes[n-1]?.val}) loops back to Node ${cycleEntry} (${nodes[cycleEntry]?.val}).`,
    nodes: [...nodes],
    slow: 0,
    fast: 0,
    phase: 1,
    cycleEntry
  });

  let slow = 0, fast = 0;
  const nextOf = (idx) => (idx === n - 1 ? cycleEntry : idx + 1);

  let stepCount = 0;
  while (stepCount < 25) {
    slow = nextOf(slow);
    fast = nextOf(nextOf(fast));
    stepCount++;

    const isCollision = slow === fast;
    steps.push({
      status: isCollision
        ? `COLLISION at node [${nodes[slow]?.val}]! Loop mathematically proven.`
        : `Phase 1: Slow (1x) at [${nodes[slow]?.val}], Fast (2x) at [${nodes[fast]?.val}].`,
      nodes: [...nodes],
      slow,
      fast,
      phase: 1,
      cycleEntry,
      collision: isCollision
    });

    if (isCollision) break;
  }

  // Phase 2: Find entrance
  steps.push({
    status: `Phase 2: Reset slow to Head (0). Fast stays at collision. Both move at 1x speed.`,
    nodes: [...nodes],
    slow: 0,
    fast,
    phase: 2,
    cycleEntry
  });

  slow = 0;
  while (slow !== fast) {
    slow = nextOf(slow);
    fast = nextOf(fast);
    const atEntrance = slow === fast;
    steps.push({
      status: atEntrance
        ? `MATCH! Pointers met at CYCLE ENTRANCE: Node ${slow} (${nodes[slow]?.val})!`
        : `Phase 2 Step: Slow at [${nodes[slow]?.val}], Fast at [${nodes[fast]?.val}].`,
      nodes: [...nodes],
      slow,
      fast,
      phase: 2,
      cycleEntry,
      cycleFound: atEntrance
    });
  }

  steps.push({
    status: `Cycle Entry verified at Node ${cycleEntry} (${nodes[cycleEntry]?.val}). Algorithm complete.`,
    nodes: [...nodes],
    slow,
    fast,
    phase: 2,
    cycleEntry,
    cycleFound: true,
    isComplete: true
  });

  return steps;
}

function generateRemoveNthSteps(nodes, nParam = 2) {
  const steps = [];
  const safeN = Math.min(Math.max(1, Number(nParam) || 1), nodes.length);
  const targetIdx = nodes.length - safeN;

  steps.push({
    status: `Target: Remove ${safeN}-th node from end (Index ${targetIdx}, Val: ${nodes[targetIdx]?.val}).`,
    nodes: [...nodes],
    slow: 0,
    fast: 0,
    phase: 'advance_fast',
    safeN
  });

  let fast = 0;
  for (let i = 0; i < safeN; i++) {
    fast++;
    steps.push({
      status: `Advancing fast pointer ${i + 1}/${safeN} steps ahead. (Currently on [${nodes[fast]?.val ?? 'End'}]).`,
      nodes: [...nodes],
      slow: 0,
      fast: Math.min(fast, nodes.length),
      phase: 'advance_fast',
      safeN
    });
  }

  let slow = 0;
  while (fast < nodes.length - 1) {
    slow++;
    fast++;
    steps.push({
      status: `Sliding gap of ${safeN}: Slow at [${nodes[slow]?.val}], Fast at [${nodes[fast]?.val}].`,
      nodes: [...nodes],
      slow,
      fast,
      phase: 'slide_window',
      safeN
    });
  }

  steps.push({
    status: `Fast reached tail! Target to remove is at index ${targetIdx} (${nodes[targetIdx]?.val}).`,
    nodes: [...nodes],
    slow,
    fast,
    targetIdx,
    bypassing: true,
    safeN
  });

  const updatedNodes = nodes.filter((_, i) => i !== targetIdx);

  steps.push({
    status: `Rerouted slow.next = slow.next.next. Node (${nodes[targetIdx]?.val}) deleted!`,
    nodes: updatedNodes,
    slow: -1,
    fast: -1,
    deleted: true,
    safeN,
    isComplete: true
  });

  return steps;
}

function generatePalindromeSteps(nodes) {
  const steps = [];
  const n = nodes.length;
  steps.push({
    status: `Testing palindrome symmetry on [${nodes.map(x => x.val).join(', ')}].`,
    nodes: [...nodes],
    p1: 0,
    p2: n - 1,
    isSymmetric: true
  });

  let l = 0, r = n - 1;
  let isPal = true;
  while (l <= r) {
    const match = nodes[l].val === nodes[r].val;
    steps.push({
      status: match
        ? `Comparing Left [idx ${l}: ${nodes[l].val}] == Right [idx ${r}: ${nodes[r].val}]. Symmetric! ✓`
        : `MISMATCH! Left (${nodes[l].val}) !== Right (${nodes[r].val}). NOT a palindrome! ✗`,
      nodes: [...nodes],
      p1: l,
      p2: r,
      isSymmetric: match
    });

    if (!match) {
      isPal = false;
      steps.push({
        status: `Validation failed: List is NOT a palindrome.`,
        nodes: [...nodes],
        p1: l,
        p2: r,
        isSymmetric: false,
        failed: true,
        isComplete: true
      });
      return steps;
    }
    l++;
    r--;
  }

  steps.push({
    status: `All mirrored pairs matched! Linked list IS a valid PALINDROME! ✓`,
    nodes: [...nodes],
    p1: Math.floor(n / 2),
    p2: Math.floor(n / 2),
    isSymmetric: true,
    success: true,
    isComplete: true
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
        status: `Comparison: ${v1} <= ${v2}. Appending ${v1} from List 1 to Merged List.`,
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
        status: `Comparison: ${v2} < ${v1}. Appending ${v2} from List 2 to Merged List.`,
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
      status: `List 2 exhausted. Appending remaining [${list1[p1]}] from List 1.`,
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
      status: `List 1 exhausted. Appending remaining [${list2[p2]}] from List 2.`,
      list1: [...list1],
      list2: [...list2],
      merged: [...merged],
      p1,
      p2: p2 + 1
    });
    p2++;
  }

  steps.push({
    status: `Merge complete! Merged list contains ${merged.length} sorted elements.`,
    list1: [...list1],
    list2: [...list2],
    merged: [...merged],
    p1,
    p2,
    isComplete: true
  });

  return steps;
}

function generateIntersectionSteps(listA, listB, common) {
  const steps = [];
  const fullA = [...listA, ...common];
  const fullB = [...listB, ...common];

  steps.push({
    status: `Testing 2 lists: List A (${fullA.join('➔')}) & List B (${fullB.join('➔')}).`,
    fullA,
    fullB,
    idxA: 0,
    idxB: 0,
    isIntersect: false
  });

  const maxSteps = fullA.length + fullB.length;
  let pA = 0, pB = 0;

  for (let s = 0; s < maxSteps; s++) {
    const valA = fullA[pA];
    const valB = fullB[pB];
    const isCommon = valA === valB && valA.startsWith('C');

    steps.push({
      status: isCommon
        ? `COLLISION! Both pointers met at shared node [${valA}]. Intersection confirmed!`
        : `Pointer A on [${valA}], Pointer B on [${valB}]. Advancing...`,
      fullA,
      fullB,
      idxA: pA,
      idxB: pB,
      isIntersect: isCommon
    });

    if (isCommon) {
      steps.push({
        status: `Intersection detected at node [${valA}]! Algorithm complete.`,
        fullA,
        fullB,
        idxA: pA,
        idxB: pB,
        isIntersect: true,
        isComplete: true
      });
      return steps;
    }

    pA = pA + 1 < fullA.length ? pA + 1 : 0;
    pB = pB + 1 < fullB.length ? pB + 1 : 0;
  }

  return steps;
}

function generateDeleteValSteps(nodes, targetVal = 40) {
  const steps = [];
  const target = Number(targetVal);

  steps.push({
    status: `Searching to delete value (${target}). Starting at Head...`,
    nodes: [...nodes],
    currIdx: 0,
    targetVal: target
  });

  let foundIdx = -1;
  for (let i = 0; i < nodes.length; i++) {
    const isMatch = nodes[i].val === target;
    steps.push({
      status: isMatch
        ? `Found node with value ${target} at index ${i}!`
        : `Index ${i}: Value ${nodes[i].val} !== ${target}. Advancing...`,
      nodes: [...nodes],
      currIdx: i,
      prevIdx: i - 1,
      targetVal: target,
      isTarget: isMatch
    });

    if (isMatch) {
      foundIdx = i;
      break;
    }
  }

  if (foundIdx === -1) {
    steps.push({
      status: `Value ${target} not found in linked list (reached NULL).`,
      nodes: [...nodes],
      currIdx: -1,
      targetVal: target,
      isComplete: true
    });
    return steps;
  }

  steps.push({
    status: `Rerouting links: prev.next = curr.next. Bypassing node (${target}).`,
    nodes: [...nodes],
    currIdx: foundIdx,
    prevIdx: foundIdx - 1,
    targetVal: target,
    isSevering: true
  });

  const updatedNodes = nodes.filter((_, idx) => idx !== foundIdx);

  steps.push({
    status: `Node (${target}) deleted! Memory freed.`,
    nodes: updatedNodes,
    currIdx: Math.min(foundIdx, updatedNodes.length - 1),
    targetVal: target,
    isComplete: true
  });

  return steps;
}

function generateLruSteps(operations) {
  const steps = [];
  const capacity = 4;
  let cache = [];

  steps.push({
    status: `Initialized LRU Cache with capacity = ${capacity}.`,
    cache: [],
    capacity
  });

  for (const op of operations) {
    if (op.type === 'put') {
      const existingIdx = cache.findIndex(item => item.key === op.key);
      let evicted = null;

      if (existingIdx !== -1) {
        // Update & move to head
        const item = { ...cache[existingIdx], val: op.val };
        cache = [item, ...cache.filter((_, i) => i !== existingIdx)];
      } else {
        if (cache.length >= capacity) {
          evicted = cache[cache.length - 1];
          cache = cache.slice(0, capacity - 1);
        }
        cache = [{ key: op.key, val: op.val }, ...cache];
      }

      steps.push({
        status: evicted
          ? `PUT(${op.key}, ${op.val}): Cache full! Evicted LRU tail [${evicted.key}] and added [${op.key}] to MRU Head.`
          : `PUT(${op.key}, ${op.val}): Added [${op.key}] to MRU Head.`,
        cache: [...cache],
        activeKey: op.key,
        evictedKey: evicted?.key,
        op
      });
    } else if (op.type === 'get') {
      const existing = cache.find(item => item.key === op.key);
      if (existing) {
        cache = [existing, ...cache.filter(item => item.key !== op.key)];
        steps.push({
          status: `GET(${op.key}): Cache HIT (Val: ${existing.val})! Moved [${op.key}] to MRU Head.`,
          cache: [...cache],
          activeKey: op.key,
          op
        });
      } else {
        steps.push({
          status: `GET(${op.key}): Cache MISS (Key not present in cache).`,
          cache: [...cache],
          activeKey: null,
          op
        });
      }
    }
  }

  steps.push({
    status: `LRU Cache simulation complete.`,
    cache: [...cache],
    capacity,
    isComplete: true
  });

  return steps;
}

// Pedagogical HUD Helper to explain WHY each step happens
const getLinkedListHUDInfo = (algoId, step, nodes) => {
  const n = nodes || [];
  const currVal = step.currIdx >= 0 && step.currIdx < n.length ? n[step.currIdx]?.val : null;
  const prevVal = step.prevIdx >= 0 && step.prevIdx < n.length ? n[step.prevIdx]?.val : null;
  const nextVal = step.nextIdx >= 0 && step.nextIdx < n.length ? n[step.nextIdx]?.val : null;
  const slowVal = step.slow !== undefined && step.slow < n.length ? n[step.slow]?.val : null;
  const fastVal = step.fast !== undefined && step.fast < n.length ? n[step.fast]?.val : null;

  if (algoId === 'floyd_cycle') {
    if (step.collision) {
      return {
        badge: 'Collision Detected',
        icon: AlertCircle,
        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        why: `Fast and slow pointers occupy the same node [${n[step.slow]?.val}]. This mathematically proves a loop exists.`
      };
    }
    if (step.cycleFound) {
      return {
        badge: 'Cycle Entrance Found',
        icon: CheckCircle,
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        why: `Slow pointer from head and fast pointer from collision point met at entrance Node [${n[step.slow]?.val}].`
      };
    }
    if (step.noCycleFound) {
      return {
        badge: 'No Cycle Found',
        icon: CheckCircle,
        bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        why: `Fast pointer reached NULL. The linked list is linear with no loop.`
      };
    }
    return {
      badge: step.phase === 2 ? 'Phase 2: Finding Entrance' : 'Phase 1: Race',
      icon: Activity,
      bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      why: step.phase === 2
        ? `Both pointers advance 1 step until meeting at the cycle entrance.`
        : `Hare leaps 2x while tortoise steps 1x. Distance between them shrinks by 1 each iteration.`
    };
  }

  if (algoId === 'reverse') {
    if (step.isFlipping) {
      return {
        badge: 'Flipping Pointer',
        icon: Repeat,
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        why: `Rewired curr.next = prev. Arrow direction is reversed without losing next node address.`
      };
    }
    if (step.isComplete) {
      return {
        badge: 'Reversal Complete',
        icon: CheckCircle,
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        why: `All links inverted in O(N) time and O(1) auxiliary memory.`
      };
    }
    return {
      badge: '3-Pointer Reversal',
      icon: RefreshCw,
      bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      why: `Saved next pointer before inverting link to maintain traversal access.`
    };
  }

  if (algoId === 'middle_node' || algoId === 'middle') {
    if (step.foundMiddle) {
      return {
        badge: 'Middle Node Found',
        icon: Target,
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        why: `When fast pointer hits the end of list, slow pointer is at the exact midpoint.`
      };
    }
    return {
      badge: 'Two-Pointer Midpoint Race',
      icon: FastForward,
      bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      why: `Fast moves at 2x velocity while slow moves at 1x. Ratio ensures midpoint convergence.`
    };
  }

  if (algoId === 'merge_sorted') {
    return {
      badge: 'Merge Sorted Lists',
      icon: GitMerge,
      bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      why: `Comparing head values of both lists and appending the smaller node to the merged list.`
    };
  }

  if (algoId === 'remove_nth') {
    return {
      badge: 'Remove N-th From End',
      icon: Trash2,
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      why: `Maintaining a gap of N between fast and slow pointers identifies the target in 1 pass.`
    };
  }

  if (algoId === 'palindrome') {
    return {
      badge: 'Palindrome Symmetry Check',
      icon: ShieldCheck,
      bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      why: `Comparing inward pointers from head and tail to verify mirrored symmetry.`
    };
  }

  return {
    badge: 'Linked List Traversal',
    icon: Compass,
    bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    why: step.status || 'Iterating through dynamic node references via .next pointers.'
  };
};

// ========================================================
// MAIN EXPORT COMPONENT
// ========================================================

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
  // ZERO-TEXT FLOATING VARIABLE HUD (Directly on Visualization)
  // ========================================================
  const renderVariableHUD = () => {
    const activeNodes = step.nodes || nodeList;
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#423834]/90 border border-[#EBE0D3] dark:border-[#5C4E49]/80 shadow-2xl backdrop-blur-md text-xs font-mono">
        {/* Step Indicator */}
        <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-[#5C4E49] text-gray-500 dark:text-[#BCA297] font-bold border border-[#EBE0D3] dark:border-[#5C4E49]/50">
          Step {currentStepIdx + 1}/{Math.max(1, steps.length)}
        </span>

        {currentAlgoId === 'reverse' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
              prev: {step.prevIdx >= 0 && step.prevIdx < activeNodes.length ? activeNodes[step.prevIdx].val : 'NULL'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
              curr: {step.currIdx >= 0 && step.currIdx < activeNodes.length ? activeNodes[step.currIdx].val : 'NULL'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
              next: {step.nextIdx >= 0 && step.nextIdx < activeNodes.length ? activeNodes[step.nextIdx].val : 'NULL'}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
              flipped: {step.reversedLinks ? step.reversedLinks.length : 0}/{activeNodes.length}
            </span>
          </>
        )}

        {(currentAlgoId === 'middle_node' || currentAlgoId === 'middle') && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-400/30">
              slow (1x): {step.slow !== undefined && step.slow < activeNodes.length ? activeNodes[step.slow]?.val : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 font-bold border border-fuchsia-400/30">
              fast (2x): {step.fast !== undefined && step.fast < activeNodes.length ? activeNodes[step.fast]?.val : 'END'}
            </span>
            {step.foundMiddle && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/25 text-emerald-300 font-extrabold border border-emerald-400">
                MID: {activeNodes[step.slow]?.val}
              </span>
            )}
          </>
        )}

        {currentAlgoId === 'floyd_cycle' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-400/30">
              slow: {step.slow !== undefined && step.slow < activeNodes.length ? activeNodes[step.slow]?.val : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
              fast: {step.fast !== undefined && step.fast < activeNodes.length ? activeNodes[step.fast]?.val : '-'}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
              phase: {step.phase || 1}
            </span>
            {step.collision && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-500/30 text-rose-300 font-black border border-rose-400 animate-bounce">
                💥 COLLISION
              </span>
            )}
            {step.cycleFound && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/30 text-emerald-300 font-black border border-emerald-400">
                ENTRY: Node {step.cycleEntry}
              </span>
            )}
          </>
        )}

        {currentAlgoId === 'remove_nth' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
              N: {step.safeN || nthParam}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-400/30">
              slow: {step.slow !== undefined && step.slow >= 0 && step.slow < activeNodes.length ? activeNodes[step.slow]?.val : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 font-bold border border-fuchsia-400/30">
              fast: {step.fast !== undefined && step.fast < activeNodes.length ? activeNodes[step.fast]?.val : 'END'}
            </span>
            {step.targetIdx !== undefined && (
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/25 text-rose-300 font-extrabold border border-rose-400">
                TARGET: {activeNodes[step.targetIdx]?.val}
              </span>
            )}
          </>
        )}

        {currentAlgoId === 'palindrome' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
              left: {step.p1 !== undefined && step.p1 < activeNodes.length ? activeNodes[step.p1]?.val : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
              right: {step.p2 !== undefined && step.p2 < activeNodes.length ? activeNodes[step.p2]?.val : '-'}
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg font-bold border ${
              step.failed ? 'bg-rose-500/25 text-rose-300 border-rose-400' :
              step.success ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400' :
              'bg-gray-100 dark:bg-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4] border-[#EBE0D3] dark:border-[#5C4E49]'
            }`}>
              {step.failed ? '✗ NOT PALINDROME' : step.success ? '✓ PALINDROME' : 'CHECKING...'}
            </span>
          </>
        )}

        {currentAlgoId === 'merge_sorted' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
              p1: {step.p1 !== undefined && step.p1 < (step.list1?.length || 0) ? step.list1[step.p1] : 'EOF'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
              p2: {step.p2 !== undefined && step.p2 < (step.list2?.length || 0) ? step.list2[step.p2] : 'EOF'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
              merged: {step.merged ? step.merged.length : 0}
            </span>
          </>
        )}

        {currentAlgoId === 'intersection' && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
              pA: {step.idxA !== undefined ? (step.fullA?.[step.idxA] || '-') : '-'}
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
              pB: {step.idxB !== undefined ? (step.fullB?.[step.idxB] || '-') : '-'}
            </span>
            {step.isIntersect && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/25 text-emerald-300 font-extrabold border border-emerald-400">
                INTERSECT!
              </span>
            )}
          </>
        )}

        {(currentAlgoId === 'singly' || currentAlgoId === 'doubly' || currentAlgoId === 'circular' || currentAlgoId === 'delete_val') && (
          <>
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
              curr: {step.currIdx >= 0 && step.currIdx < activeNodes.length ? activeNodes[step.currIdx]?.val : 'NULL'}
            </span>
            {step.nextIdx !== undefined && step.nextIdx >= 0 && (
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                next: {activeNodes[step.nextIdx]?.val}
              </span>
            )}
            {step.targetVal !== undefined && (
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-bold border border-rose-400/30">
                target: {step.targetVal}
              </span>
            )}
          </>
        )}
      </div>
    );
  };

  // ========================================================
  // VISUALIZATION CANVAS (PURE HERO GRAPHICS, ZERO TEXT WALLS)
  // ========================================================
  const renderCanvas = () => {
    // 1. MERGE SORTED CANVAS
    if (currentAlgoId === 'merge_sorted') {
      const l1 = step.list1 || mergeList1;
      const l2 = step.list2 || mergeList2;
      const merged = step.merged || [];

      return (
        <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
          {renderVariableHUD()}

          {/* List 1 & List 2 rows */}
          <div className="flex flex-col lg:flex-row items-center justify-around gap-8 w-full max-w-4xl pt-8">
            {/* List 1 */}
            <div className="flex flex-col items-center p-4 bg-white dark:bg-[#423834]/60 border border-[#EBE0D3] dark:border-[#5C4E49]/80 rounded-2xl shadow-xl">
              <span className="text-xs font-mono text-cyan-400 font-bold mb-3 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" /> List 1 (p1)
              </span>
              <div className="flex items-center gap-2 overflow-x-auto p-1">
                {l1.map((v, i) => {
                  const isCurrent = step.p1 === i;
                  const isConsumed = i < (step.p1 || 0);
                  return (
                    <React.Fragment key={`l1_${i}`}>
                      <div className="flex flex-col items-center">
                        <div className="h-5 text-[10px] font-mono text-cyan-400 font-bold">
                          {isCurrent ? 'p1' : ''}
                        </div>
                        <motion.div
                          animate={{
                            scale: isCurrent ? 1.15 : 1,
                            borderColor: isCurrent ? '#22d3ee' : isConsumed ? '#1e293b' : '#334155',
                            backgroundColor: isCurrent ? 'rgba(6, 182, 212, 0.25)' : isConsumed ? 'rgba(15, 23, 42, 0.4)' : '#1e293b'
                          }}
                          className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold shadow-md ${
                            isConsumed ? 'text-slate-600 line-through' : 'text-[#2D1F23] dark:text-[#F4EBC3]'
                          }`}
                        >
                          <span className="text-base font-extrabold">{v}</span>
                          <span className="text-[8px] font-mono text-slate-500">0x{(100 + i*8).toString(16)}</span>
                        </motion.div>
                      </div>
                      {i < l1.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 mt-4" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* List 2 */}
            <div className="flex flex-col items-center p-4 bg-white dark:bg-[#423834]/60 border border-[#EBE0D3] dark:border-[#5C4E49]/80 rounded-2xl shadow-xl">
              <span className="text-xs font-mono text-purple-400 font-bold mb-3 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm" /> List 2 (p2)
              </span>
              <div className="flex items-center gap-2 overflow-x-auto p-1">
                {l2.map((v, i) => {
                  const isCurrent = step.p2 === i;
                  const isConsumed = i < (step.p2 || 0);
                  return (
                    <React.Fragment key={`l2_${i}`}>
                      <div className="flex flex-col items-center">
                        <div className="h-5 text-[10px] font-mono text-purple-400 font-bold">
                          {isCurrent ? 'p2' : ''}
                        </div>
                        <motion.div
                          animate={{
                            scale: isCurrent ? 1.15 : 1,
                            borderColor: isCurrent ? '#c084fc' : isConsumed ? '#1e293b' : '#334155',
                            backgroundColor: isCurrent ? 'rgba(192, 132, 252, 0.25)' : isConsumed ? 'rgba(15, 23, 42, 0.4)' : '#1e293b'
                          }}
                          className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold shadow-md ${
                            isConsumed ? 'text-slate-600 line-through' : 'text-[#2D1F23] dark:text-[#F4EBC3]'
                          }`}
                        >
                          <span className="text-base font-extrabold">{v}</span>
                          <span className="text-[8px] font-mono text-slate-500">0x{(200 + i*8).toString(16)}</span>
                        </motion.div>
                      </div>
                      {i < l2.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 mt-4" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Merged Output Chain */}
          <div className="w-full max-w-3xl bg-white dark:bg-[#423834]/80 border border-emerald-500/30 rounded-3xl p-5 flex flex-col items-center shadow-2xl">
            <span className="text-xs font-mono text-emerald-400 font-bold mb-3 flex items-center gap-2">
              <GitMerge className="w-4 h-4" /> Merged Sorted Chain
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {merged.length === 0 ? (
                <span className="text-xs font-mono text-slate-500 py-3 italic">Empty (traversing lists...)</span>
              ) : (
                merged.map((v, i) => (
                  <React.Fragment key={`m_${i}`}>
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="h-4 text-[9px] font-mono text-emerald-400 font-bold">
                        {i === 0 ? 'HEAD' : i === merged.length - 1 ? 'TAIL' : ''}
                      </div>
                      <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex flex-col items-center justify-center font-mono font-bold text-emerald-200 shadow-md">
                        <span className="text-base font-black">{v}</span>
                        <span className="text-[8px] text-emerald-400/70">0x{(300 + i*8).toString(16)}</span>
                      </div>
                    </motion.div>
                    {i < merged.length - 1 && <ArrowRight className="w-4 h-4 text-emerald-500 mt-3" />}
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
      const fullA = step.fullA || ['A1', 'A2', 'C1', 'C2', 'C3'];
      const fullB = step.fullB || ['B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

      return (
        <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
          {renderVariableHUD()}

          <div className="flex flex-col items-center gap-6 pt-8 w-full max-w-3xl">
            {/* List A */}
            <div className="flex items-center gap-2 overflow-x-auto p-2">
              <span className="text-xs font-mono text-amber-400 font-bold w-16">List A:</span>
              {fullA.map((val, i) => {
                const isShared = val.startsWith('C');
                const isCurr = step.idxA === i;
                return (
                  <React.Fragment key={`ia_${i}`}>
                    <div className="flex flex-col items-center">
                      <div className="h-5 text-[10px] font-mono text-amber-400 font-bold">
                        {isCurr ? 'pA' : ''}
                      </div>
                      <div className={`px-3.5 py-2.5 rounded-2xl border-2 font-mono font-bold text-base shadow-md transition-all ${
                        isShared 
                          ? 'border-emerald-500 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-500/40' 
                          : 'border-[#EBE0D3] dark:border-[#5C4E49] bg-gray-100 dark:bg-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3]'
                      }`}>
                        {val}
                      </div>
                    </div>
                    {i < fullA.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 mt-5" />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* List B */}
            <div className="flex items-center gap-2 overflow-x-auto p-2">
              <span className="text-xs font-mono text-indigo-400 font-bold w-16">List B:</span>
              {fullB.map((val, i) => {
                const isShared = val.startsWith('C');
                const isCurr = step.idxB === i;
                return (
                  <React.Fragment key={`ib_${i}`}>
                    <div className="flex flex-col items-center">
                      <div className="h-5 text-[10px] font-mono text-indigo-400 font-bold">
                        {isCurr ? 'pB' : ''}
                      </div>
                      <div className={`px-3.5 py-2.5 rounded-2xl border-2 font-mono font-bold text-base shadow-md transition-all ${
                        isShared 
                          ? 'border-emerald-500 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-500/40' 
                          : 'border-[#EBE0D3] dark:border-[#5C4E49] bg-gray-100 dark:bg-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3]'
                      }`}>
                        {val}
                      </div>
                    </div>
                    {i < fullB.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600 mt-5" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 3. LRU CACHE CANVAS
    if (currentAlgoId === 'lru_cache') {
      const cache = step.cache || [];
      return (
        <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
          {renderVariableHUD()}

          <div className="flex items-center gap-3 max-w-full overflow-x-auto p-4 pt-10">
            <span className="text-xs font-mono text-emerald-400 font-bold px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
              HEAD (MRU)
            </span>
            <div className="flex items-center gap-3">
              {cache.map((item, idx) => (
                <React.Fragment key={item.key}>
                  <motion.div
                    animate={{
                      scale: step.activeKey === item.key ? 1.15 : 1,
                      borderColor: step.activeKey === item.key ? '#06b6d4' : '#334155'
                    }}
                    className="flex flex-col items-center p-3 rounded-2xl border-2 bg-white dark:bg-[#423834] min-w-[85px] shadow-xl"
                  >
                    <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297] font-semibold">Key: <strong className="text-cyan-400">{item.key}</strong></span>
                    <span className="text-base font-mono font-extrabold text-[#2D1F23] dark:text-[#F4EBC3] mt-1">Val: {item.val}</span>
                    <span className="text-[9px] font-mono text-slate-500 mt-1">0x{(400 + idx*8).toString(16)}</span>
                  </motion.div>
                  {idx < cache.length - 1 && (
                    <div className="flex flex-col items-center text-xs font-mono text-slate-500 font-bold">
                      <span>◄──►</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {cache.length === 0 && (
                <span className="text-xs font-mono text-slate-500 italic">Cache Empty</span>
              )}
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold px-3 py-1.5 bg-rose-950/40 border border-rose-500/40 rounded-xl">
              TAIL (LRU)
            </span>
          </div>
        </div>
      );
    }

    // 4. FLOYD CYCLE CANVAS (Loop curve)
    if (currentAlgoId === 'floyd_cycle') {
      const activeNodes = step.nodes || nodeList;
      const cycleEntry = step.cycleEntry !== undefined ? step.cycleEntry : (hasCycle ? cycleIndex : -1);

      return (
        <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
          {renderVariableHUD()}

          <div className="flex flex-wrap items-center justify-center gap-4 max-w-full overflow-x-auto p-4 pt-10 relative">
            {activeNodes.map((n, i) => {
              const isSlow = step.slow === i;
              const isFast = step.fast === i;
              const isEntry = cycleEntry >= 0 && i === cycleEntry;
              const inLoop = cycleEntry >= 0 && i >= cycleEntry;
              const isCollision = step.collision && isSlow && isFast;

              return (
                <React.Fragment key={n.id || i}>
                  <div className="flex flex-col items-center relative">
                    {/* Floating Badges */}
                    <div className="h-6 flex items-center gap-1 mb-1.5">
                      {isCollision && (
                        <span className="px-2 py-0.5 bg-rose-500/30 border border-rose-400 rounded-md text-[10px] font-mono text-rose-300 font-black animate-bounce">
                          💥 COLLISION
                        </span>
                      )}
                      {isSlow && !isCollision && (
                        <span className="px-1.5 py-0.5 bg-teal-500/25 border border-teal-400 rounded-md text-[10px] font-mono text-teal-300 font-bold">
                          SLOW
                        </span>
                      )}
                      {isFast && !isCollision && (
                        <span className="px-1.5 py-0.5 bg-fuchsia-500/25 border border-fuchsia-400 rounded-md text-[10px] font-mono text-fuchsia-300 font-bold">
                          FAST
                        </span>
                      )}
                      {isEntry && (
                        <span className="px-1.5 py-0.5 bg-purple-500/25 border border-purple-400 rounded-md text-[10px] font-mono text-purple-300 font-bold">
                          ENTRY
                        </span>
                      )}
                    </div>

                    {/* Node Card */}
                    <motion.div
                      animate={{
                        scale: isCollision ? 1.25 : (isSlow || isFast) ? 1.15 : 1,
                        borderColor: isCollision ? '#f43f5e' : (isSlow && isFast) ? '#f43f5e' : isFast ? '#d946ef' : isSlow ? '#14b8a6' : inLoop ? '#a855f7' : '#334155',
                        backgroundColor: isCollision ? 'rgba(244, 63, 94, 0.3)' : (isSlow || isFast) ? 'rgba(20, 184, 166, 0.2)' : inLoop ? 'rgba(168, 85, 247, 0.15)' : '#423834'
                      }}
                      className={`w-24 h-26 rounded-2xl border-2 flex flex-col items-center justify-between p-2 font-mono shadow-xl transition-all ${
                        isEntry ? 'ring-2 ring-purple-500/50' : ''
                      }`}
                    >
                      <span className="text-[10px] text-gray-500 dark:text-[#BCA297] font-bold">idx {i}</span>
                      <span className="text-2xl font-black text-[#2D1F23] dark:text-[#F4EBC3]">{n.val}</span>
                      <span className="text-[9px] text-cyan-400 font-mono">
                        {cycleEntry >= 0 && i === activeNodes.length - 1 ? `↺0x${(100 + cycleEntry*8).toString(16)}` : `0x${(100 + (i+1)*8).toString(16)}`}
                      </span>
                    </motion.div>

                    <span className="text-[10px] font-mono text-slate-500 mt-1 font-semibold">
                      0x{(100 + i*8).toString(16)}
                    </span>
                  </div>

                  {i < activeNodes.length - 1 && (
                    <div className="flex items-center text-slate-500 pt-5">
                      <ArrowRight className={`w-5 h-5 ${inLoop ? 'text-purple-400' : 'text-cyan-400'}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* Loopback Arrow to Entry Node */}
            {cycleEntry >= 0 && (
              <div className="flex items-center gap-1.5 pl-2 pt-5">
                <Repeat className="w-5 h-5 text-purple-400 animate-spin" />
                <span className="text-xs font-mono font-bold text-purple-300">
                  ↺ Node {cycleEntry}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 5. STANDARD CHAIN CANVAS (Singly, Doubly, Circular, Reverse, Middle, RemoveNth, Palindrome, Delete, Search)
    const activeNodes = step.nodes || nodeList;

    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full py-8">
        {renderVariableHUD()}

        <div className="flex flex-wrap items-center justify-center gap-4 max-w-full overflow-x-auto p-4 pt-10">
          {activeNodes.map((node, idx) => {
            const isCurr = step.currIdx === idx;
            const isPrev = step.prevIdx === idx;
            const isNext = step.nextIdx === idx;
            const isSlow = (currentAlgoId === 'middle_node' || currentAlgoId === 'middle' || currentAlgoId === 'remove_nth') && step.slow === idx;
            const isFast = (currentAlgoId === 'middle_node' || currentAlgoId === 'middle' || currentAlgoId === 'remove_nth') && step.fast === idx;
            const isReversed = step.reversedLinks && step.reversedLinks.includes(idx);
            const isMiddle = step.foundMiddle && step.slow === idx;
            const isGoal = step.isGoalFound && step.currIdx === idx;
            const isLeft = currentAlgoId === 'palindrome' && step.p1 === idx;
            const isRight = currentAlgoId === 'palindrome' && step.p2 === idx;
            const isTargetPos = step.insertPos === idx || step.targetPos === idx || (step.targetVal && node.val === step.targetVal);
            const isSevering = step.isSevering || (currentAlgoId === 'reverse' && step.currIdx === idx && step.isFlipping);

            // Memory address
            const nodeAddr = `0x${(100 + idx*8).toString(16)}`;
            const nextAddr = isReversed
              ? (idx > 0 ? `0x${(100 + (idx-1)*8).toString(16)}` : 'NULL')
              : (idx < activeNodes.length - 1 ? `0x${(100 + (idx+1)*8).toString(16)}` : (currentAlgoId === 'circular' ? '0x100' : 'NULL'));

            return (
              <React.Fragment key={node.id || idx}>
                <div className="flex flex-col items-center">
                  {/* Floating Variable Badges Rack */}
                  <div className="h-6 flex items-center gap-1 mb-1.5">
                    {isGoal && (
                      <span className="px-2 py-0.5 bg-emerald-500/30 border border-emerald-400 rounded-md text-[10px] font-mono text-emerald-300 font-extrabold flex items-center gap-0.5">
                        <Award className="w-3 h-3" /> GOAL!
                      </span>
                    )}
                    {idx === 0 && !isGoal && (
                      <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-400 rounded-md text-[10px] font-mono text-amber-300 font-bold">
                        HEAD
                      </span>
                    )}
                    {idx === activeNodes.length - 1 && currentAlgoId !== 'circular' && (
                      <span className="px-1.5 py-0.5 bg-slate-700/40 border border-slate-600 rounded-md text-[10px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] font-bold">
                        TAIL
                      </span>
                    )}
                    {isPrev && (
                      <span className="px-1.5 py-0.5 bg-sky-500/25 border border-sky-400 rounded-md text-[10px] font-mono text-sky-300 font-bold">
                        PREV
                      </span>
                    )}
                    {isCurr && !isGoal && !isSlow && (
                      <span className="px-1.5 py-0.5 bg-amber-500/25 border border-amber-400 rounded-md text-[10px] font-mono text-amber-300 font-bold animate-pulse">
                        CURR
                      </span>
                    )}
                    {isNext && (
                      <span className="px-1.5 py-0.5 bg-emerald-500/25 border border-emerald-400 rounded-md text-[10px] font-mono text-emerald-300 font-bold">
                        NEXT
                      </span>
                    )}
                    {isSlow && (
                      <span className="px-1.5 py-0.5 bg-teal-500/25 border border-teal-400 rounded-md text-[10px] font-mono text-teal-300 font-bold">
                        SLOW
                      </span>
                    )}
                    {isFast && (
                      <span className="px-1.5 py-0.5 bg-fuchsia-500/25 border border-fuchsia-400 rounded-md text-[10px] font-mono text-fuchsia-300 font-bold">
                        FAST
                      </span>
                    )}
                    {isLeft && (
                      <span className="px-1.5 py-0.5 bg-cyan-500/25 border border-cyan-400 rounded-md text-[10px] font-mono text-cyan-300 font-bold">
                        LEFT
                      </span>
                    )}
                    {isRight && (
                      <span className="px-1.5 py-0.5 bg-purple-500/25 border border-purple-400 rounded-md text-[10px] font-mono text-purple-300 font-bold">
                        RIGHT
                      </span>
                    )}
                    {isMiddle && (
                      <span className="px-2 py-0.5 bg-emerald-500/30 border border-emerald-400 rounded-md text-[10px] font-mono text-emerald-300 font-extrabold">
                        MID
                      </span>
                    )}
                  </div>

                  {/* 3-Layer Hero Node Card */}
                  <motion.div
                    animate={{
                      scale: isGoal ? 1.25 : (isCurr || isMiddle || isLeft || isRight) ? 1.15 : 1,
                      borderColor: isGoal ? '#10b981' : isMiddle ? '#10b981' : isTargetPos ? '#f59e0b' : isCurr ? '#f59e0b' : isPrev ? '#38bdf8' : isNext ? '#10b981' : '#334155',
                      backgroundColor: isGoal ? 'rgba(16, 185, 129, 0.35)' : isMiddle ? 'rgba(16, 185, 129, 0.25)' : isCurr ? 'rgba(245, 158, 11, 0.2)' : isPrev ? 'rgba(56, 189, 248, 0.15)' : '#423834'
                    }}
                    className="flex flex-col rounded-2xl border-2 overflow-hidden shadow-2xl min-w-[102px] transition-all"
                  >
                    {/* Top Cell: Data Value */}
                    <div className="px-4 py-3 font-mono font-black text-2xl text-[#2D1F23] dark:text-[#F4EBC3] flex items-center justify-center bg-white dark:bg-[#423834]/90 border-b border-[#EBE0D3] dark:border-[#5C4E49]">
                      {node.val}
                    </div>
                    {/* Bottom Cell: Next Address Pointer */}
                    <div className="px-2.5 py-1.5 bg-white dark:bg-[#331921] text-[10px] font-mono text-cyan-400 flex items-center justify-between gap-1.5">
                      <span className="text-slate-500 font-semibold">.next:</span>
                      <span className="font-bold">{nextAddr}</span>
                    </div>
                  </motion.div>

                  {/* Heap Memory Address */}
                  <span className="text-[10px] font-mono text-slate-500 mt-1.5 font-medium">
                    {nodeAddr}
                  </span>
                </div>

                {/* Connecting Arrow */}
                {idx < activeNodes.length - 1 && (
                  <div className="flex flex-col items-center justify-center px-1 text-slate-500 pt-6">
                    {currentAlgoId === 'doubly' ? (
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-mono font-bold text-cyan-400">◄──►</span>
                      </div>
                    ) : isSevering ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <span className="text-[9px] font-mono text-amber-400 font-extrabold">⚡ FLIP ⚡</span>
                        <span className="text-xs font-mono text-amber-400 font-bold">- - -</span>
                      </div>
                    ) : isReversed ? (
                      <div className="flex flex-col items-center">
                        <ArrowLeft className="w-8 h-8 text-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-mono text-emerald-400 font-bold">REVERSED</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-8 h-8 text-cyan-400" />
                        <span className="text-[8px] font-mono text-slate-500">.next</span>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {currentAlgoId !== 'circular' && (
            <div className="flex flex-col items-center gap-1 pl-2 pt-6">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="w-5 h-5 text-slate-600" />
                <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-xs font-mono text-rose-400/90 font-black shadow-inner">
                  NULL
                </div>
              </div>
            </div>
          )}

          {currentAlgoId === 'circular' && (
            <div className="flex flex-col items-center gap-1 pl-2 pt-6">
              <div className="flex items-center gap-1.5">
                <Repeat className="w-5 h-5 text-amber-400 animate-spin" />
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 font-bold">
                  ↺ HEAD (0x100)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4] hover:text-white transition-colors"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <Link
            to="/visualizer/linkedlist"
            className="text-xs px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-mono font-bold transition-colors"
          >
            All Algorithms
          </Link>
        </div>
      }
      controls={
        <div className="flex flex-col gap-3 w-full">
          {/* 1. FLEXIBLE DATA & PRESETS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#423834]/80 rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-md">
            {/* Custom List Input */}
            <div className="flex items-center gap-2 flex-1 min-w-[260px]">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> List:
              </span>
              <input
                type="text"
                value={customListInput}
                onChange={(e) => setCustomListInput(e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                placeholder="10, 20, 30, 40, 50"
              />
              <button
                onClick={handleApplyCustomList}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
              >
                Apply
              </button>
              <button
                onClick={handleRandomizeList}
                className="px-2.5 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4] rounded-lg text-xs font-mono flex items-center gap-1 transition-all active:scale-95"
                title="Generate clean random list"
              >
                <Shuffle className="w-3.5 h-3.5" /> Random
              </button>
            </div>

            {/* Quick Algorithm-Specific Adjusters */}
            <div className="flex flex-wrap items-center gap-2">
              {currentAlgoId === 'floyd_cycle' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-purple-400 font-bold">Loop:</span>
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, nodeList.length - 1)}
                    value={cycleIndex}
                    onChange={(e) => setCycleIndex(parseInt(e.target.value) || 0)}
                    className="w-12 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-purple-300"
                  />
                  <button
                    onClick={handleToggleCycle}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                      hasCycle 
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
                        : 'bg-gray-100 dark:bg-[#5C4E49] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-500 dark:text-[#BCA297]'
                    }`}
                  >
                    Cycle: {hasCycle ? 'ON' : 'OFF'}
                  </button>
                </div>
              )}

              {currentAlgoId === 'remove_nth' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-indigo-400 font-bold">N from end:</span>
                  <input
                    type="number"
                    min="1"
                    max={nodeList.length}
                    value={nthParam}
                    onChange={(e) => setNthParam(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-indigo-300"
                  />
                </div>
              )}

              {currentAlgoId === 'palindrome' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLoadPalindrome(true)}
                    className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-mono font-bold"
                  >
                    1,2,3,2,1
                  </button>
                  <button
                    onClick={() => handleLoadPalindrome(false)}
                    className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono font-bold"
                  >
                    1,2,3,4,5
                  </button>
                </div>
              )}

              {currentAlgoId === 'delete_val' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-rose-400 font-bold">Target Val:</span>
                  <input
                    type="number"
                    value={deleteTarget}
                    onChange={(e) => setDeleteTarget(e.target.value)}
                    className="w-14 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-rose-300"
                  />
                  <button
                    onClick={handleDeleteTargetVal}
                    className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono font-bold"
                  >
                    Delete Val
                  </button>
                </div>
              )}

              {currentAlgoId === 'lru_cache' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLruOp('put', 'A', 100)}
                    className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono"
                  >
                    PUT(A)
                  </button>
                  <button
                    onClick={() => handleLruOp('get', 'A')}
                    className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-emerald-300 rounded-lg text-xs font-mono"
                  >
                    GET(A)
                  </button>
                  <button
                    onClick={() => handleLruOp('put', 'X', 999)}
                    className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-purple-300 rounded-lg text-xs font-mono"
                  >
                    PUT(X)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. NODE MANIPULATION BAR (Add, Delete, Search) */}
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#423834]/80 rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-md">
            {/* Search Goal Node */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Goal:
              </span>
              <input
                type="number"
                value={goalNodeVal}
                onChange={(e) => setGoalNodeVal(e.target.value)}
                className="w-16 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2.5 py-1 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                placeholder="40"
              />
              <button
                onClick={handleSearchGoalNode}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all active:scale-95"
              >
                <Search className="w-3.5 h-3.5" /> Find
              </button>
            </div>

            {/* Add Node */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add:
              </span>
              <input
                type="number"
                value={nodeValToAdd}
                onChange={(e) => setNodeValToAdd(e.target.value)}
                className="w-14 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                placeholder="Val"
              />
              <span className="text-xs font-mono text-gray-500 dark:text-[#BCA297]">at:</span>
              <input
                type="number"
                min="0"
                max={nodeList.length}
                value={nodePositionToAdd}
                onChange={(e) => setNodePositionToAdd(e.target.value)}
                className="w-12 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-cyan-500"
                placeholder="Pos"
              />
              <button
                onClick={handleInsertAtPosition}
                className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500 text-cyan-200 rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
              >
                Insert
              </button>
              <button
                onClick={handleInsertHead}
                className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg text-xs font-mono text-[#2D1F23] dark:text-[#F0E2A4]"
              >
                Head
              </button>
              <button
                onClick={handleInsertTail}
                className="px-2 py-1 bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg text-xs font-mono text-[#2D1F23] dark:text-[#F0E2A4]"
              >
                Tail
              </button>
            </div>

            {/* Delete at Position */}
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
                className="w-12 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-2 py-1 text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={handleDeleteAtPosition}
                className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono font-bold transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>

          {/* 3. CORE PLAYBACK BAR */}
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
        </div>
      }
      rightPanel={
        <div className="flex flex-col gap-3">
          <DryRunVariableTracker
            title={`${currentAlgo.name} — Dry Run`}
            stepNumber={currentStepIdx + 1}
            totalSteps={Math.max(1, steps.length)}
            actionBadge={(() => {
              const h = getLinkedListHUDInfo(currentAlgoId, step, step.nodes || nodeList);
              const IconComp = h.icon;
              return { 
                label: h.badge, 
                icon: IconComp ? <IconComp className="w-3.5 h-3.5" /> : null, 
                bg: h.bg 
              };
            })()}
            codeStatement={currentCodeStatement}
            explanation={(() => {
              const h = getLinkedListHUDInfo(currentAlgoId, step, step.nodes || nodeList);
              return h.why;
            })()}
            variables={trackedVariables}
            isVoiceEnabled={isVoiceEnabled}
            onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
          />
        </div>
      }
    >
      {/* PURE VISUALIZATION STAGE (HERO, BIGGER, UNOBSTRUCTED, ZERO TEXT CLUTTER) */}
      <div className="w-full h-full flex-1 flex flex-col p-3 sm:p-5 overflow-hidden">
        <div className="w-full h-full flex-1 min-h-[580px] flex items-center justify-center bg-white/80 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl p-6 relative overflow-x-auto shadow-sm backdrop-blur-sm transition-colors">
          {renderCanvas()}
        </div>
      </div>
    </ResponsiveVisualizerShell>
  );
}