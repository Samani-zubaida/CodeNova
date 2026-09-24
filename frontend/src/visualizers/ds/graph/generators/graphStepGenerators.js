/**
 * Step Generators for Graph Algorithms
 * Pure simulation functions generating state playback steps.
 */

export const getInitialVisitedTable = (nodes = []) => {
  const tbl = {};
  nodes.forEach(n => { tbl[n.id] = false; });
  return tbl;
};

export const buildAdjacency = (graphData) => {
  const adj = {};
  (graphData.nodes || []).forEach(n => { adj[n.id] = []; });
  (graphData.edges || []).forEach(e => {
    adj[e.u]?.push({ v: e.v, weight: e.weight || 1 });
    if (!graphData.isDirected) {
      adj[e.v]?.push({ v: e.u, weight: e.weight || 1 });
    }
  });
  return adj;
};

  export function generateKruskalSteps(graphData) {
    const steps = [];
    const sortedEdges = [...graphData.edges].sort((a, b) => (a.weight || 1) - (b.weight || 1));
    const parent = {};
    const rank = {};

    graphData.nodes.forEach(n => {
      parent[n.id] = n.id;
      rank[n.id] = 0;
    });

    function find(i) {
      if (parent[i] === i) return i;
      parent[i] = find(parent[i]);
      return parent[i];
    }

    function union(i, j) {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
        else if (rank[rootI] > rank[rootJ]) parent[rootI] = rootI;
        else { parent[rootJ] = rootI; rank[rootI]++; }
        return true;
      }
      return false;
    }

    function getDsuComponents() {
      const comp = {};
      graphData.nodes.forEach(n => {
        const root = find(n.id);
        if (!comp[root]) comp[root] = [];
        comp[root].push(n.id);
      });
      return comp;
    }

    const mst = [];
    let currentCost = 0;
    const edgeStatuses = sortedEdges.map(e => ({ ...e, status: 'pending' }));

    steps.push({
      log: `> Kruskal's MST initialized. Sorted ${sortedEdges.length} edges by ascending weight.`,
      codeLine: 1,
      kruskalEdges: [...edgeStatuses],
      mstCost: 0,
      dsuSets: getDsuComponents(),
      explanation: {
        title: "Step 1: Sort All Edges Ascending by Weight",
        action: `Sorted ${sortedEdges.length} edges from lowest weight (${sortedEdges[0]?.weight}) to highest (${sortedEdges[sortedEdges.length - 1]?.weight}).`,
        why: "Kruskal is a Greedy algorithm. By always trying the lightest available edge first, it guarantees the minimum total cost spanning tree.",
        next: "Iterate through sorted edges one-by-one. Use Disjoint Set Union (DSU) to check if an edge connects two separate components.",
        badge: 'SORTING'
      }
    });

    for (let i = 0; i < sortedEdges.length; i++) {
      const edge = sortedEdges[i];
      const uRoot = find(edge.u);
      const vRoot = find(edge.v);
      const formsCycle = uRoot === vRoot;
      const edgeKey = `${edge.u}-${edge.v}`;

      // Evaluating edge
      edgeStatuses[i].status = 'evaluating';
      steps.push({
        log: `  Evaluating edge (${edge.u} ⟷ ${edge.v}, w=${edge.weight}). find(${edge.u})=${uRoot}, find(${edge.v})=${vRoot}.`,
        codeLine: 6,
        activeNode: edge.u,
        probingNode: edge.v,
        activeEdge: edgeKey,
        kruskalEdges: [...edgeStatuses],
        mstCost: currentCost,
        dsuSets: getDsuComponents(),
        pathEdges: mst.map(e => `${e.u}-${e.v}`),
        explanation: {
          title: `Evaluating Lightest Edge: (${edge.u} ⟷ ${edge.v}, Weight ${edge.weight})`,
          action: `Running DSU find(${edge.u}) ➔ Component ${uRoot}, and find(${edge.v}) ➔ Component ${vRoot}.`,
          why: formsCycle 
            ? `Both vertices already belong to Component [${uRoot}]. Connecting them would create a redundant closed loop (cycle)!`
            : `Vertex [${edge.u}] is in Component [${uRoot}] while [${edge.v}] is in Component [${vRoot}]. They are currently disconnected!`,
          next: formsCycle ? "Reject edge and discard it from MST." : "Accept edge, union the two components, and add weight to MST cost.",
          badge: formsCycle ? 'CYCLE WARNING' : 'SAFE CONNECTION'
        }
      });

      if (!formsCycle) {
        union(edge.u, edge.v);
        mst.push(edge);
        currentCost += edge.weight;
        edgeStatuses[i].status = 'accepted';

        steps.push({
          log: `    ✅ Edge (${edge.u} ⟷ ${edge.v}) ACCEPTED into MST! DSU union completed. MST Cost = ${currentCost}.`,
          codeLine: 8,
          activeNode: edge.u,
          probingNode: edge.v,
          activeEdge: edgeKey,
          kruskalEdges: [...edgeStatuses],
          mstCost: currentCost,
          dsuSets: getDsuComponents(),
          pathEdges: mst.map(e => `${e.u}-${e.v}`),
          explanation: {
            title: `✅ Edge Accepted: (${edge.u} ⟷ ${edge.v}) Added to Spanning Tree!`,
            action: `Merged Component [${uRoot}] and Component [${vRoot}] into one unified set. Running MST Cost = ${currentCost}.`,
            why: "Because their roots were different, adding this edge safely bridges two separate islands of nodes without any cycle.",
            next: mst.length === graphData.nodes.length - 1 
              ? "All vertices connected! Minimum Spanning Tree is complete." 
              : "Move to next lowest-weight edge in the sorted queue.",
            badge: 'ACCEPTED'
          }
        });
      } else {
        edgeStatuses[i].status = 'rejected';
        steps.push({
          log: `    ❌ Edge (${edge.u} ⟷ ${edge.v}) REJECTED! Already connected in same component ${uRoot}. Avoids cycle.`,
          codeLine: 6,
          activeNode: edge.u,
          probingNode: edge.v,
          activeEdge: edgeKey,
          kruskalEdges: [...edgeStatuses],
          mstCost: currentCost,
          dsuSets: getDsuComponents(),
          pathEdges: mst.map(e => `${e.u}-${e.v}`),
          explanation: {
            title: `❌ Edge Rejected: (${edge.u} ⟷ ${edge.v}) Creates a Cycle!`,
            action: `Discarded edge (${edge.u} ⟷ ${edge.v}, w=${edge.weight}) from the MST.`,
            why: `A tree by mathematical definition has zero cycles. Since a path between ${edge.u} and ${edge.v} already exists through component [${uRoot}], this edge is redundant.`,
            next: "Continue inspecting next lowest-weight edge.",
            badge: 'CYCLE REJECTED'
          }
        });
      }

      if (mst.length === graphData.nodes.length - 1) {
        break;
      }
    }

    steps.push({
      log: `🎉 Kruskal's MST Complete! Selected ${mst.length} edges with Total Minimum Cost = ${currentCost}.`,
      codeLine: 12,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      kruskalEdges: [...edgeStatuses],
      mstCost: currentCost,
      dsuSets: getDsuComponents(),
      pathEdges: mst.map(e => `${e.u}-${e.v}`),
      pathNodes: graphData.nodes.map(n => n.id),
      explanation: {
        title: `🎉 Kruskal's MST Complete! Total Minimum Cost = ${currentCost}`,
        action: `All ${graphData.nodes.length} vertices successfully connected using exactly ${mst.length} edges (|V| - 1).`,
        why: "By greedily picking the lightest cycle-free edges, Kruskal's algorithm guarantees the globally optimal Minimum Spanning Tree.",
        next: "Network fully connected with zero loops and minimum total cable/route length!",
        badge: 'COMPLETE'
      }
    });

    return steps;
}

  // ========================================================
  // 2. PRIM'S MST GENERATOR (Cut-Edge Priority Queue)
  // ========================================================

  export function generatePrimSteps(graphData, startNode = "A") {
    const steps = [];
    const adj = buildAdjacency(graphData);
    const inMST = new Set([startNode]);
    const mst = [];
    let currentCost = 0;

    const cutEdges = [];
    (adj[startNode] || []).forEach(e => {
      cutEdges.push({ u: startNode, v: e.v, weight: e.weight });
    });

    const vTable = getInitialVisitedTable(graphData.nodes);
    vTable[startNode] = true;

    steps.push({
      log: `> Prim's MST initialized at vertex [${startNode}]. Incidental edges added to Min-PQ.`,
      codeLine: 1,
      activeNode: startNode,
      visitedSet: [startNode],
      visitedTable: { ...vTable },
      mstCost: 0,
      explanation: {
        title: `Step 1: Grow Spanning Tree from Starting Node [${startNode}]`,
        action: `Added starting vertex [${startNode}] to MST tree set. Added its ${cutEdges.length} incident edges into Min-Priority Queue.`,
        why: "Unlike Kruskal which works on edges globally, Prim grows a single connected tree outwards by always crossing the cut with the lightest edge.",
        next: "Pick the lowest-weight cut-edge connecting an in-tree vertex to an unvisited vertex.",
        badge: 'TREE SEED'
      }
    });

    while (cutEdges.length > 0 && inMST.size < graphData.nodes.length) {
      cutEdges.sort((a, b) => a.weight - b.weight);
      const minCut = cutEdges.shift();
      const edgeKey = `${minCut.u}-${minCut.v}`;

      if (inMST.has(minCut.v)) {
        continue;
      }

      steps.push({
        log: `  Selected cut edge (${minCut.u} ⟷ ${minCut.v}, w=${minCut.weight}) crossing frontier into unvisited node [${minCut.v}].`,
        codeLine: 8,
        activeNode: minCut.u,
        probingNode: minCut.v,
        activeEdge: edgeKey,
        visitedSet: Array.from(inMST),
        visitedTable: { ...vTable },
        mstCost: currentCost,
        pathEdges: mst.map(e => `${e.u}-${e.v}`),
        explanation: {
          title: `Inspecting Lightest Cut-Edge: (${minCut.u} ➔ ${minCut.v}, Weight ${minCut.weight})`,
          action: `Examining cheapest edge crossing the frontier from visited tree into unvisited node [${minCut.v}].`,
          why: "Cut Property: The lightest edge crossing any cut between visited and unvisited vertices must belong to the Minimum Spanning Tree.",
          next: `Add vertex [${minCut.v}] to MST tree and absorb its outward edges into the cut frontier.`,
          badge: 'GREEDY CUT'
        }
      });

      inMST.add(minCut.v);
      vTable[minCut.v] = true;
      mst.push(minCut);
      currentCost += minCut.weight;

      (adj[minCut.v] || []).forEach(e => {
        if (!inMST.has(e.v)) {
          cutEdges.push({ u: minCut.v, v: e.v, weight: e.weight });
        }
      });

      steps.push({
        log: `    Added vertex [${minCut.v}] and edge (${minCut.u}-${minCut.v}) to MST. Current Cost = ${currentCost}.`,
        codeLine: 11,
        activeNode: minCut.v,
        probingNode: null,
        activeEdge: edgeKey,
        visitedSet: Array.from(inMST),
        visitedTable: { ...vTable },
        mstCost: currentCost,
        pathEdges: mst.map(e => `${e.u}-${e.v}`),
        explanation: {
          title: `✅ Connected Node [${minCut.v}] to Tree! Running Cost = ${currentCost}`,
          action: `Vertex [${minCut.v}] marked visited. Outward edges from [${minCut.v}] added to candidate cut pool.`,
          why: `Edge (${minCut.u}-${minCut.v}) was the minimum weight available connection to the unvisited frontier.`,
          next: inMST.size === graphData.nodes.length ? "All vertices reached! Spanning tree complete." : "Evaluate next cheapest cut edge.",
          badge: 'EXPANDED'
        }
      });
    }

    steps.push({
      log: `🎉 Prim's MST Complete! Connected all ${inMST.size} vertices with Total Cost = ${currentCost}.`,
      codeLine: 14,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      visitedSet: Array.from(inMST),
      visitedTable: { ...vTable },
      mstCost: currentCost,
      pathEdges: mst.map(e => `${e.u}-${e.v}`),
      pathNodes: graphData.nodes.map(n => n.id),
      explanation: {
        title: `🎉 Prim's Minimum Spanning Tree Complete! Total Cost = ${currentCost}`,
        action: `Connected all ${inMST.size} vertices into a single continuous tree with zero cycles.`,
        why: "Greedy cut selections at each step guarantee the globally minimal total tree weight.",
        next: "Minimum Spanning Tree verified and complete.",
        badge: 'COMPLETE'
      }
    });

    return steps;
}

  // ========================================================
  // 3. BFS GENERATOR (Animated FIFO Queue + Visited Set)
  // ========================================================

  export function generateBfsSteps(graphData, startNode = "A", targetNode = null) {
    const steps = [];
    const adj = buildAdjacency(graphData);
    const visited = new Set([startNode]);
    const sequence = [startNode];
    const queue = [startNode];
    const parent = {};
    const treeEdges = [];
    const vTable = getInitialVisitedTable(graphData.nodes);
    vTable[startNode] = true;

    steps.push({
      log: `> BFS Traversal initiated from start node [${startNode}].`,
      codeLine: 1,
      activeNode: startNode,
      probingNode: null,
      visitedSet: [startNode],
      visitedSequence: [startNode],
      visitedTable: { ...vTable },
      queueState: [startNode],
      pathEdges: [],
      explanation: {
        title: `Step 1: Enqueue Starting Vertex [${startNode}]`,
        action: `Pushed [${startNode}] into the rear of our FIFO Queue. Marked vis[${startNode}] = true.`,
        why: "BFS explores layer-by-layer. We initialize the queue with the origin frontier.",
        next: `Dequeue node [${startNode}] to discover its immediate neighbors.`,
        badge: 'ENQUEUED'
      }
    });

    while (queue.length > 0) {
      const u = queue.shift();

      steps.push({
        log: `  Dequeued node [${u}] from front of queue. Exploring neighbors.`,
        codeLine: 5,
        activeNode: u,
        probingNode: null,
        visitedSet: Array.from(visited),
        visitedSequence: [...sequence],
        visitedTable: { ...vTable },
        queueState: [...queue],
        pathEdges: [...treeEdges],
        explanation: {
          title: `Dequeued Node [${u}] from Front of Queue`,
          action: `Removed [${u}] from queue HEAD. Node [${u}] is now the ACTIVE FRONTIER vertex.`,
          why: "FIFO Queue ensures we finish processing all nodes at depth d before moving to depth d + 1.",
          next: `Inspect adjacent neighbors of [${u}].`,
          badge: 'DEQUEUED'
        }
      });

      const neighbors = adj[u] || [];
      for (const { v } of neighbors) {
        const edgeKey = `${u}-${v}`;

        if (!visited.has(v)) {
          visited.add(v);
          parent[v] = u;
          queue.push(v);
          sequence.push(v);
          vTable[v] = true;
          treeEdges.push(edgeKey);

          steps.push({
            log: `    Discovered unvisited neighbor [${v}] via edge (${u} ➔ ${v}). Enqueueing!`,
            codeLine: 8,
            activeNode: u,
            probingNode: v,
            activeEdge: edgeKey,
            visitedSet: Array.from(visited),
            visitedSequence: [...sequence],
            visitedTable: { ...vTable },
            queueState: [...queue],
            pathEdges: [...treeEdges],
            explanation: {
              title: `Discovered Unvisited Neighbor [${v}] via (${u} ➔ ${v})`,
              action: `Added [${v}] to REAR of queue. Marked vis[${v}] = true. Edge (${u} ➔ ${v}) added to BFS Tree.`,
              why: `Direct unvisited neighbor found. Added to tree with persistent directed connection.`,
              next: `Continue checking remaining neighbors of [${u}].`,
              badge: 'DISCOVERED'
            }
          });
        } else {
          steps.push({
            log: `    Neighbor [${v}] already visited. Skipping edge (${u} ➔ ${v}).`,
            codeLine: 7,
            activeNode: u,
            probingNode: v,
            activeEdge: edgeKey,
            isRejected: true,
            visitedSet: Array.from(visited),
            visitedSequence: [...sequence],
            visitedTable: { ...vTable },
            queueState: [...queue],
            pathEdges: [...treeEdges],
            explanation: {
              title: `Neighbor [${v}] Already Visited (Skip)`,
              action: `Inspected edge (${u} ➔ ${v}). Skipped enqueueing [${v}] to prevent cycle.`,
              why: "Already visited vertices are ignored to maintain O(V + E) efficiency.",
              next: `Move to next adjacent neighbor.`,
              badge: 'ALREADY VISITED'
            }
          });
        }
      }
    }

    // Reconstruct chosen shortest path to targetNode
    const bfsPath = [];
    if (visited.has(targetNode)) {
      let curr = targetNode;
      while (curr) {
        bfsPath.unshift(curr);
        if (curr === startNode) break;
        curr = parent[curr];
      }
    }

    const bfsPathEdges = [];
    if (bfsPath.length > 1) {
      for (let i = 0; i < bfsPath.length - 1; i++) {
        bfsPathEdges.push(`${bfsPath[i]}-${bfsPath[i + 1]}`);
      }
    }

    steps.push({
      log: bfsPath.length > 1
        ? `⭐ Shortest Path to [${targetNode}] Found: ${bfsPath.join(' ➔ ')} (${bfsPathEdges.length} hops).`
        : `✓ BFS Traversal Complete! Explored ${sequence.length} Vertices.`,
      codeLine: 12,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      visitedSet: Array.from(visited),
      visitedSequence: [...sequence],
      visitedTable: { ...vTable },
      queueState: [],
      pathEdges: bfsPathEdges.length > 0 ? bfsPathEdges : treeEdges,
      pathNodes: bfsPath.length > 0 ? bfsPath : sequence,
      explanation: {
        title: bfsPath.length > 1
          ? `⭐ Shortest Path to [${targetNode}]: ${bfsPath.join(' ➔ ')}`
          : `✓ BFS Traversal Complete! Explored ${sequence.length} Vertices`,
        action: bfsPath.length > 1
          ? `Highlighted optimal path: ${bfsPath.join(' ➔ ')} (${bfsPathEdges.length} hops) in radiant emerald.`
          : `Queue is empty. Traversal sequence: ${sequence.join(' ➔ ')}.`,
        why: "Breadth-First Search systematically guarantees the shortest unweighted path.",
        next: "Exploration verified and complete.",
        badge: 'COMPLETE'
      }
    });

    return steps;
}

  // ========================================================
  // 4. DFS GENERATOR (Animated LIFO Call Stack + Visited Set)
  // ========================================================

  export function generateDfsSteps(graphData, startNode = "A", targetNode = null) {
    const steps = [];
    const adj = buildAdjacency(graphData);
    const visited = new Set();
    const sequence = [];
    const stack = [];
    const parentMap = {};
    const treeEdges = [];
    const vTable = getInitialVisitedTable(graphData.nodes);

    function dfsVisit(u, parent = null) {
      if (parent) {
        parentMap[u] = parent;
        treeEdges.push(`${parent}-${u}`);
      }
      visited.add(u);
      sequence.push(u);
      stack.push(u);
      vTable[u] = true;

      steps.push({
        log: `  Visiting node [${u}]. Pushed onto Call Stack (Depth: ${stack.length}).`,
        codeLine: 2,
        activeNode: u,
        probingNode: null,
        activeEdge: parent ? `${parent}-${u}` : null,
        visitedSet: Array.from(visited),
        visitedSequence: [...sequence],
        visitedTable: { ...vTable },
        stackState: [...stack],
        pathEdges: [...treeEdges],
        explanation: {
          title: `Pushed Node [${u}] onto Call Stack (Depth: ${stack.length})`,
          action: `Active recursion frame created for [${u}]. Marked vis[${u}] = true.`,
          why: "DFS dives as deep as possible along each branch before backtracking.",
          next: `Look for unvisited neighbors of [${u}] to dive deeper immediately.`,
          badge: 'STACK PUSH'
        }
      });

      const neighbors = adj[u] || [];
      for (const { v } of neighbors) {
        const edgeKey = `${u}-${v}`;
        if (!visited.has(v)) {
          // Push probing step before diving
          steps.push({
            log: `    Inspecting edge (${u} ➔ ${v}). Neighbor [${v}] is unvisited — diving deeper!`,
            codeLine: 4,
            activeNode: u,
            probingNode: v,
            activeEdge: edgeKey,
            visitedSet: Array.from(visited),
            visitedSequence: [...sequence],
            visitedTable: { ...vTable },
            stackState: [...stack],
            pathEdges: [...treeEdges],
            explanation: {
              title: `Exploring Edge (${u} ➔ ${v})`,
              action: `Diving into unvisited neighbor [${v}].`,
              why: "Greedy depth exploration immediately branches into first unvisited neighbor.",
              next: `Recurse into [${v}].`,
              badge: 'DIVE DEEPER'
            }
          });
          dfsVisit(v, u);
        } else if (v !== parent) {
          // Probed already visited back-edge
          steps.push({
            log: `    Inspecting edge (${u} ➔ ${v}). Neighbor [${v}] is already visited — skipping.`,
            codeLine: 4,
            activeNode: u,
            probingNode: v,
            activeEdge: edgeKey,
            isRejected: true,
            visitedSet: Array.from(visited),
            visitedSequence: [...sequence],
            visitedTable: { ...vTable },
            stackState: [...stack],
            pathEdges: [...treeEdges],
            explanation: {
              title: `Inspected Edge (${u} ➔ ${v}): Already Visited`,
              action: `Skipped [${v}] to prevent cycles.`,
              why: "Back-edge or cross-edge detected.",
              next: `Continue exploring remaining neighbors of [${u}].`,
              badge: 'BACK-EDGE'
            }
          });
        }
      }

      stack.pop();
      steps.push({
        log: `  Backtracking from node [${u}]. Popped from Call Stack.`,
        codeLine: 6,
        activeNode: stack[stack.length - 1] || u,
        probingNode: null,
        visitedSet: Array.from(visited),
        visitedSequence: [...sequence],
        visitedTable: { ...vTable },
        stackState: [...stack],
        pathEdges: [...treeEdges],
        explanation: {
          title: `↩️ Backtracking from Node [${u}]`,
          action: `All paths from [${u}] explored. Popped [${u}] from call stack.`,
          why: "When a vertex has no more unvisited neighbors, DFS backtracks to the caller.",
          next: stack.length > 0 ? `Resuming search at caller [${stack[stack.length - 1]}].` : "DFS complete.",
          badge: 'BACKTRACK'
        }
      });
    }

    steps.push({
      log: `> DFS Traversal initiated from start node [${startNode}].`,
      codeLine: 0,
      activeNode: startNode,
      probingNode: null,
      visitedSet: [],
      visitedSequence: [],
      visitedTable: { ...vTable },
      stackState: [],
      pathEdges: [],
      explanation: {
        title: `Step 1: DFS Initialized at Root [${startNode}]`,
        action: `Beginning Depth-First Search traversal from vertex [${startNode}].`,
        why: "DFS explores branch-by-branch with backtracking.",
        next: `Push starting node [${startNode}] onto the call stack.`,
        badge: 'INITIALIZE'
      }
    });

    dfsVisit(startNode);

    steps.push({
      log: `✓ DFS Traversal Complete! Explored ${sequence.length} vertices.`,
      codeLine: 8,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      visitedSet: Array.from(visited),
      visitedSequence: [...sequence],
      visitedTable: { ...vTable },
      stackState: [],
      pathEdges: treeEdges,
      pathNodes: sequence,
      explanation: {
        title: `✓ DFS Traversal Complete! Visited ${sequence.length} Vertices`,
        action: `Finished depth exploration. Discovered full DFS spanning forest.`,
        why: "Every reachable vertex was visited and retracted.",
        next: "DFS verification complete.",
        badge: 'COMPLETE'
      }
    });

    return steps;
}

  // ========================================================
  // 5. DIJKSTRA'S GENERATOR (Priority Queue + Distance Table)
  // ========================================================

  export function generateDijkstraSteps(graphData, startNode = "A", targetNode = null) {
    const steps = [];
    const adj = buildAdjacency(graphData);
    const dist = {};
    const prev = {};
    const treeEdgesMap = new Map();
    const vTable = getInitialVisitedTable(graphData.nodes);

    graphData.nodes.forEach(n => {
      dist[n.id] = Infinity;
      prev[n.id] = null;
    });

    dist[startNode] = 0;
    const pq = [{ node: startNode, dist: 0 }];
    const visitedNodes = new Set();

    steps.push({
      log: `> Dijkstra initialized: dist[${startNode}] = 0, all others = ∞.`,
      codeLine: 1,
      activeNode: startNode,
      probingNode: null,
      distanceMap: { ...dist },
      priorityQueueState: [...pq],
      visitedSet: [],
      visitedTable: { ...vTable },
      pathEdges: [],
      explanation: {
        title: `Step 1: Distance Table Initialization`,
        action: `Set dist[${startNode}] = 0, all other distances = ∞. Enqueued (0, ${startNode}).`,
        why: "Dijkstra is a greedy shortest-path algorithm starting at origin distance 0.",
        next: `Extract vertex with smallest tentative distance from Min-Heap.`,
        badge: 'INITIALIZE'
      }
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a.dist - b.dist);
      const { node: u, dist: d } = pq.shift();

      if (visitedNodes.has(u)) continue;
      visitedNodes.add(u);
      vTable[u] = true;

      steps.push({
        log: `  Settled node [${u}] with finalized shortest distance d = ${d}.`,
        codeLine: 7,
        activeNode: u,
        probingNode: null,
        distanceMap: { ...dist },
        priorityQueueState: [...pq],
        visitedSet: Array.from(visitedNodes),
        visitedTable: { ...vTable },
        pathEdges: Array.from(treeEdgesMap.values()),
        explanation: {
          title: `Settled Shortest Distance to [${u}]: dist = ${d}`,
          action: `Finalized dist[${u}] = ${d}. Min-Heap guaranteed minimal path.`,
          why: "Non-negative edge weights guarantee smallest distance item cannot be improved.",
          next: `Relax outgoing edges from [${u}].`,
          badge: 'SETTLED'
        }
      });

      if (u === targetNode) break;

      const neighbors = adj[u] || [];
      for (const { v, weight } of neighbors) {
        if (!visitedNodes.has(v)) {
          const alt = dist[u] + weight;
          const edgeKey = `${u}-${v}`;

          if (alt < dist[v]) {
            const oldDist = dist[v];
            dist[v] = alt;
            prev[v] = u;
            pq.push({ node: v, dist: alt });
            treeEdgesMap.set(v, edgeKey);

            steps.push({
              log: `    Relaxed edge (${u} ➔ ${v}): dist[${v}] updated from ${oldDist === Infinity ? '∞' : oldDist} to ${alt}.`,
              codeLine: 11,
              activeNode: u,
              probingNode: v,
              activeEdge: edgeKey,
              distanceMap: { ...dist },
              priorityQueueState: [...pq],
              visitedSet: Array.from(visitedNodes),
              visitedTable: { ...vTable },
              pathEdges: Array.from(treeEdgesMap.values()),
              explanation: {
                title: `⚡ Edge Relaxation: dist[${v}] = ${alt}`,
                action: `Updated dist[${v}] = ${dist[u]} + ${weight} = ${alt}. Enqueued (${alt}, ${v}).`,
                math: `${dist[u]} + ${weight} = ${alt} < ${oldDist === Infinity ? '∞' : oldDist} ➔ SHORTCUT!`,
                why: `The route through [${u}] (cost ${alt}) is strictly shorter than previous distance.`,
                next: `Continue checking neighbors.`,
                badge: 'RELAXED'
              }
            });
          } else {
            steps.push({
              log: `    Checked edge (${u} ➔ ${v}): cost ${alt} is not better than existing dist[${v}] = ${dist[v]}.`,
              codeLine: 10,
              activeNode: u,
              probingNode: v,
              activeEdge: edgeKey,
              isRejected: true,
              distanceMap: { ...dist },
              priorityQueueState: [...pq],
              visitedSet: Array.from(visitedNodes),
              visitedTable: { ...vTable },
              pathEdges: Array.from(treeEdgesMap.values()),
              explanation: {
                title: `Edge (${u} ➔ ${v}): No Improvement`,
                action: `Alternative path cost ${alt} ≥ existing ${dist[v]}. Retaining current best route.`,
                math: `${dist[u]} + ${weight} = ${alt} ≥ ${dist[v]} (No Shortcut)`,
                why: "We only update tentative distances when a strictly cheaper route is discovered.",
                next: `Check next outgoing edge.`,
                badge: 'NO SHORTCUT'
              }
            });
          }
        }
      }
    }

    // Reconstruct optimal shortest path
    const shortestPath = [];
    if (dist[targetNode] < Infinity) {
      let curr = targetNode;
      while (curr) {
        shortestPath.unshift(curr);
        if (curr === startNode) break;
        curr = prev[curr];
      }
    }

    const pathEdgesList = [];
    for (let i = 0; i < shortestPath.length - 1; i++) {
      pathEdgesList.push(`${shortestPath[i]}-${shortestPath[i + 1]}`);
    }

    steps.push({
      log: `⭐ Dijkstra Shortest Path Complete! Total Cost = ${dist[targetNode]}. Route: ${shortestPath.join(' ➔ ')}.`,
      codeLine: 14,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      distanceMap: { ...dist },
      priorityQueueState: [],
      visitedSet: Array.from(visitedNodes),
      visitedTable: { ...vTable },
      pathEdges: pathEdgesList.length > 0 ? pathEdgesList : Array.from(treeEdgesMap.values()),
      pathNodes: shortestPath.length > 0 ? shortestPath : Array.from(visitedNodes),
      explanation: {
        title: `⭐ Shortest Path Found to [${targetNode}]: Cost = ${dist[targetNode]}`,
        action: `Optimal route: ${shortestPath.join(' ➔ ')} highlighted in glowing emerald.`,
        math: `Total Shortest Path Distance = ${dist[targetNode]}`,
        why: "Dijkstra's greedy choice property ensures the extracted path is globally optimal.",
        next: "Dijkstra verification complete.",
        badge: 'OPTIMAL PATH'
      }
    });

    return steps;
}

  // ========================================================
  // 6. TOPOLOGICAL SORT (Kahn's In-Degree Algorithm)
  // ========================================================

  export function generateTopoSortSteps(graphData) {
    const steps = [];
    const inDegree = {};
    const adj = {};

    graphData.nodes.forEach(n => {
      inDegree[n.id] = 0;
      adj[n.id] = [];
    });

    graphData.edges.forEach(e => {
      adj[e.u]?.push(e.v);
      inDegree[e.v] = (inDegree[e.v] || 0) + 1;
    });

    const queue = [];
    graphData.nodes.forEach(n => {
      if (inDegree[n.id] === 0) queue.push(n.id);
    });

    const topo = [];

    steps.push({
      log: `> Kahn's Algorithm initialized. In-degree computed for all vertices.`,
      codeLine: 1,
      inDegreeMap: { ...inDegree },
      queueState: [...queue],
      topoOrder: [],
      explanation: {
        title: "Step 1: Calculate In-Degree (Prerequisites) for Each Task",
        action: `Counted incoming edges for each node. Found ${queue.length} node(s) with in-degree = 0: [${queue.join(', ')}].`,
        why: "In a dependency graph, any node with in-degree 0 has NO prerequisites and can be scheduled or executed immediately.",
        next: "Remove a 0-indegree node from queue, add it to our valid topological order, and decrement prerequisites of its child tasks.",
        badge: 'PREREQUISITES'
      }
    });

    while (queue.length > 0) {
      const u = queue.shift();
      topo.push(u);

      steps.push({
        log: `  Removed [${u}] with 0 dependencies. Added to Topological Sequence.`,
        codeLine: 5,
        activeNode: u,
        inDegreeMap: { ...inDegree },
        queueState: [...queue],
        topoOrder: [...topo],
        explanation: {
          title: `Executing Task [${u}] (0 Prerequisites Pending)`,
          action: `Added [${u}] to topological order. Sequence so far: [${topo.join(' ➔ ')}].`,
          why: "Since all prerequisites for task [${u}] have been satisfied, it is safe to execute.",
          next: `Remove outbound edges from [${u}] to reduce remaining in-degree for downstream tasks.`,
          badge: 'SCHEDULED'
        }
      });

      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        inDegree[v]--;
        const edgeKey = `${u}-${v}`;

        steps.push({
          log: `    Decremented in-degree of child [${v}]: new in-degree = ${inDegree[v]}.`,
          codeLine: 8,
          activeNode: u,
          probingNode: v,
          activeEdge: edgeKey,
          inDegreeMap: { ...inDegree },
          queueState: [...queue],
          topoOrder: [...topo],
          explanation: {
            title: `Dependency Edge (${u} ➔ ${v}) Resolved`,
            action: `Decremented in-degree of child [${v}] by 1 (now ${inDegree[v]} remaining).`,
            why: `Because parent task [${u}] finished, child task [${v}] is one prerequisite closer to execution.`,
            next: inDegree[v] === 0 ? `Task [${v}] has 0 prerequisites left! Add it to execution queue.` : `Task [${v}] still waiting on ${inDegree[v]} other tasks.`,
            badge: 'DECREMENT'
          }
        });

        if (inDegree[v] === 0) {
          queue.push(v);
          steps.push({
            log: `    Vertex [${v}] now has 0 in-degree. Enqueueing!`,
            codeLine: 9,
            activeNode: v,
            probingNode: null,
            inDegreeMap: { ...inDegree },
            queueState: [...queue],
            topoOrder: [...topo],
            explanation: {
              title: `Task [${v}] Ready for Execution!`,
              action: `In-degree of [${v}] dropped to 0! Added [${v}] to Kahn's Queue.`,
              why: "All prerequisite dependencies for task [${v}] are now fully satisfied.",
              next: "Process next ready task in queue.",
              badge: 'READY'
            }
          });
        }
      }
    }

    const hasCycle = topo.length < graphData.nodes.length;

    steps.push({
      log: hasCycle ? `⚠️ Cycle detected in graph! Topological sort incomplete.` : `🎉 Topological Order: ${topo.join(' ➔ ')}.`,
      codeLine: 12,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      inDegreeMap: { ...inDegree },
      queueState: [],
      topoOrder: [...topo],
      explanation: {
        title: hasCycle ? "⚠️ Cycle Detected! Not a DAG" : "🎉 Valid Topological Schedule Found!",
        action: hasCycle ? "Could not resolve all dependencies due to circular loops." : `Complete Linear Ordering: ${topo.join(' ➔ ')}.`,
        why: hasCycle ? "Topological sorting is only possible on Directed Acyclic Graphs (DAGs)." : "Every directed edge (u ➔ v) goes from an earlier task to a later task in this sequence.",
        next: "Ordering verified.",
        badge: hasCycle ? 'CYCLE ERROR' : 'VALID DAG ORDER'
      }
    });

    return steps;
}

  // ========================================================
  // 7. CYCLE DETECTION (3-Color DFS)
  // ========================================================

  export function generateCycleDetectionSteps(graphData) {
    const steps = [];
    const adj = buildAdjacency(graphData);
    const colors = {};
    const stack = [];
    let cycleFound = false;

    graphData.nodes.forEach(n => colors[n.id] = 'WHITE');

    steps.push({
      log: `> 3-Color Cycle Detection initialized: All nodes colored WHITE (unvisited).`,
      codeLine: 0,
      nodeColors: { ...colors },
      stackState: [],
      explanation: {
        title: "Step 1: 3-Coloring State Initialization",
        action: "All nodes marked WHITE (unvisited).",
        why: "WHITE = Unvisited, GRAY = On active recursion stack, BLACK = Finished exploring all descendants.",
        next: "Cycle occurs if an edge ever points back to a GRAY node (back-edge).",
        badge: '3-COLOR'
      }
    });

    function dfsCycle(u) {
      colors[u] = 'GRAY';
      stack.push(u);

      steps.push({
        log: `  Entering node [${u}]: Colored GRAY (Active on call stack). Depth: ${stack.length}.`,
        codeLine: 1,
        activeNode: u,
        nodeColors: { ...colors },
        stackState: [...stack],
        explanation: {
          title: `Node [${u}] Marked GRAY (Active on Call Stack)`,
          action: `Pushed [${u}] onto stack. Recursion depth: ${stack.length}.`,
          why: "A GRAY node represents an ancestor currently on our active traversal path.",
          next: `Inspect neighbors of [${u}].`,
          badge: 'ACTIVE (GRAY)'
        }
      });

      const neighbors = adj[u] || [];
      for (const { v } of neighbors) {
        const edgeKey = `${u}-${v}`;

        if (colors[v] === 'GRAY') {
          cycleFound = true;
          steps.push({
            log: `🚨 BACK-EDGE FOUND (${u} ➔ ${v})! Node [${v}] is GRAY. Directed cycle detected!`,
            codeLine: 4,
            activeNode: u,
            probingNode: v,
            activeEdge: edgeKey,
            nodeColors: { ...colors },
            stackState: [...stack],
            explanation: {
              title: `🚨 DIRECTED CYCLE DETECTED! Back-Edge to [${v}]`,
              action: `Edge (${u} ➔ ${v}) points to node [${v}] which is currently GRAY on the call stack!`,
              why: "Because [${v}] is an ancestor in our active recursion chain, closing this edge forms a directed loop (cycle)!",
              next: "Cycle confirmed. Terminating search.",
              badge: 'CYCLE DETECTED'
            }
          });
          return true;
        }

        if (colors[v] === 'WHITE') {
          if (dfsCycle(v)) return true;
        }
      }

      colors[u] = 'BLACK';
      stack.pop();

      steps.push({
        log: `  Node [${u}] fully explored: Colored BLACK (removed from recursion stack).`,
        codeLine: 6,
        activeNode: u,
        nodeColors: { ...colors },
        stackState: [...stack],
        explanation: {
          title: `Node [${u}] Colored BLACK (Fully Explored)`,
          action: `Popped [${u}] from call stack.`,
          why: "All descendants of [${u}] have been explored with zero cycle back-edges found in this branch.",
          next: "Backtrack to parent frame.",
          badge: 'FINISHED (BLACK)'
        }
      });

      return false;
    }

    for (const node of graphData.nodes) {
      if (colors[node.id] === 'WHITE') {
        if (dfsCycle(node.id)) break;
      }
    }

    steps.push({
      log: cycleFound ? `⚠️ Graph contains at least one directed cycle.` : `✅ Graph is acyclic (No cycles).`,
      codeLine: 7,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      nodeColors: { ...colors },
      stackState: [],
      explanation: {
        title: cycleFound ? "⚠️ Directed Cycle Confirmed!" : "✅ Graph is Acyclic (DAG)!",
        action: cycleFound ? "Loop detected in network." : "All vertices processed with 0 back-edges.",
        why: cycleFound ? "Circular dependency prevents linear topological ordering." : "No node ever pointed back to an active ancestor frame.",
        next: "Analysis complete.",
        badge: cycleFound ? 'HAS CYCLE' : 'NO CYCLES'
      }
    });

    return steps;
}

  // ========================================================
  // 8. BIPARTITE GRAPH CHECK (2-Coloring)
  // ========================================================

  export function generateBipartiteSteps(graphData) {
    const steps = [];
    const adj = buildAdjacency(graphData);
    const colors = {};
    const queue = [graphData.nodes[0].id];
    colors[graphData.nodes[0].id] = 'CYAN';
    let isBipartite = true;

    steps.push({
      log: `> Bipartite 2-Coloring Check initialized. Color node [${graphData.nodes[0].id}] with CYAN.`,
      codeLine: 2,
      activeNode: graphData.nodes[0].id,
      nodeColors: { ...colors },
      queueState: [...queue],
      explanation: {
        title: `Step 1: Color Root [${graphData.nodes[0].id}] CYAN (Set A)`,
        action: `Assigned Set A (CYAN) to initial node.`,
        why: "A bipartite graph must be partitionable into two sets (A and B) such that no edge connects vertices of the same set.",
        next: "Every neighbor of a CYAN node MUST be colored ROSE (Set B).",
        badge: 'SET A'
      }
    });

    while (queue.length > 0) {
      const u = queue.shift();
      const nextColor = colors[u] === 'CYAN' ? 'ROSE' : 'CYAN';

      steps.push({
        log: `  Processing node [${u}] (Color: ${colors[u]}). Checking neighbors for 2-coloring.`,
        codeLine: 6,
        activeNode: u,
        nodeColors: { ...colors },
        queueState: [...queue],
        explanation: {
          title: `Processing Node [${u}] (${colors[u]})`,
          action: `All neighbors of [${u}] must have opposite color: ${nextColor}.`,
          why: "Adjacent vertices can never share the same color in a bipartite graph.",
          next: `Inspect adjacent vertices of [${u}].`,
          badge: 'CHECKING'
        }
      });

      const neighbors = adj[u] || [];
      for (const { v } of neighbors) {
        if (!colors[v]) {
          colors[v] = nextColor;
          queue.push(v);

          steps.push({
            log: `    Assigned neighbor [${v}] opposite color: ${nextColor}. Added to Queue.`,
            codeLine: 9,
            activeNode: u,
            probingNode: v,
            activeEdge: `${u}-${v}`,
            nodeColors: { ...colors },
            queueState: [...queue],
            explanation: {
              title: `Assigned Neighbor [${v}] Color ${nextColor}`,
              action: `Colored [${v}] ${nextColor} (opposite of [${u}]). Enqueued [${v}].`,
              why: "Maintains valid 2-coloring across the edge.",
              next: "Continue inspecting other neighbors.",
              badge: nextColor === 'CYAN' ? 'SET A' : 'SET B'
            }
          });
        } else if (colors[v] === colors[u]) {
          isBipartite = false;
          steps.push({
            log: `🚨 COLOR CONFLICT: Adjacent nodes [${u}] and [${v}] both have color ${colors[u]}! NOT BIPARTITE!`,
            codeLine: 10,
            activeNode: u,
            probingNode: v,
            activeEdge: `${u}-${v}`,
            nodeColors: { ...colors },
            queueState: [...queue],
            explanation: {
              title: `🚨 COLOR CONFLICT! Adjacent Nodes Share Same Color (${colors[u]})`,
              action: `Both [${u}] and [${v}] are colored ${colors[u]} and share an edge!`,
              why: "An odd-length cycle exists in the graph, making 2-coloring mathematically impossible. The graph is NOT Bipartite!",
              next: "Stop check: Graph cannot be partitioned into 2 independent sets.",
              badge: 'CONFLICT'
            }
          });
          break;
        }
      }
      if (!isBipartite) break;
    }

    steps.push({
      log: isBipartite ? `✅ Graph is Bipartite (2-Colorable without conflicts).` : `❌ Graph is NOT Bipartite.`,
      codeLine: 13,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      nodeColors: { ...colors },
      queueState: [],
      explanation: {
        title: isBipartite ? "✅ Graph is Bipartite!" : "❌ Graph is NOT Bipartite!",
        action: isBipartite ? "Successfully partitioned vertices into Set A (Cyan) and Set B (Rose)." : "Odd cycle found. 2-coloring failed.",
        why: isBipartite ? "Zero adjacent vertices share the same color partition." : "Odd-length cycles cannot be 2-colored.",
        next: "Verification complete.",
        badge: isBipartite ? 'BIPARTITE' : 'NOT BIPARTITE'
      }
    });

    return steps;
}

export function generateGraphSteps(algoId, graphData, { startNode, targetNode } = {}) {
  switch (algoId) {
    case 'kruskal': return generateKruskalSteps(graphData);
    case 'prim': return generatePrimSteps(graphData, startNode);
    case 'bfs': return generateBfsSteps(graphData, startNode, targetNode);
    case 'dfs': return generateDfsSteps(graphData, startNode, targetNode);
    case 'dijkstra': return generateDijkstraSteps(graphData, startNode, targetNode);
    case 'toposort': return generateTopoSortSteps(graphData);
    case 'cycle': return generateCycleDetectionSteps(graphData);
    case 'bipartite': return generateBipartiteSteps(graphData);
    default: return generateBfsSteps(graphData, startNode, targetNode);
  }
}
