export const CODE_SNIPPETS = {
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
