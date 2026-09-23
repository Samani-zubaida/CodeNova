export const INTUITIONS = {
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

