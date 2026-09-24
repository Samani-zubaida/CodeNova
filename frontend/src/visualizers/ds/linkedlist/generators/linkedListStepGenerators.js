// Pure Step Generators for Linked List Visualizer

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

export function generateLinkedListSteps(algoId, { nodes, list1, list2, listA, listB, common, goalVal, val, pos, targetVal, nParam, operations }) {
  switch (algoId) {
    case 'singly': return generateSinglySteps(nodes);
    case 'doubly': return generateDoublySteps(nodes);
    case 'circular': return generateCircularSteps(nodes);
    case 'reverse': return generateReverseSteps(nodes);
    case 'middle': return generateMiddleSteps(nodes);
    case 'floyd': return generateFloydSteps(nodes, 2);
    case 'removeNth': return generateRemoveNthSteps(nodes, nParam || 2);
    case 'palindrome': return generatePalindromeSteps(nodes);
    case 'merge': return generateMergeSteps(list1 || nodes, list2 || []);
    case 'intersection': return generateIntersectionSteps(listA || nodes, listB || [], common || []);
    case 'deleteVal': return generateDeleteValSteps(nodes, targetVal || 40);
    case 'lru': return generateLruSteps(operations || []);
    case 'searchGoal': return generateSearchGoalSteps(nodes, goalVal);
    case 'insertAtPos': return generateInsertAtPosSteps(nodes, val, pos);
    case 'deleteAtPos': return generateDeleteAtPosSteps(nodes, pos);
    default: return generateSinglySteps(nodes);
  }
}

export {
  generateSearchGoalSteps,
  generateInsertAtPosSteps,
  generateDeleteAtPosSteps,
  generateSinglySteps,
  generateDoublySteps,
  generateCircularSteps,
  generateReverseSteps,
  generateMiddleSteps,
  generateFloydSteps,
  generateRemoveNthSteps,
  generatePalindromeSteps,
  generateMergeSteps,
  generateIntersectionSteps,
  generateDeleteValSteps,
  generateLruSteps
};
