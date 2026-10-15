export const GRAPH_INTUITIONS = {
  bfs: {
    name: 'Breadth-First Search (BFS)',
    analogy: 'Ripples in a pond or a search party expanding outwards in concentric rings.',
    concept: 'Explores the graph layer-by-layer (distance 0, then distance 1, then distance 2...). It checks every direct neighbor of the current vertex before moving to grandchildren.',
    goldenRule: 'First-Discovered = First-Explored. Nodes closer to the Start are ALWAYS processed before farther nodes.',
    whyDataStructure: 'A FIFO (First-In, First-Out) Queue guarantees that all vertices discovered at distance d are popped and explored before any vertex discovered at distance d + 1.',
    steps: [
      '1. Enqueue starting node with distance 0.',
      '2. Pop front node u from Queue; inspect all its neighbors v.',
      '3. Enqueue any unvisited neighbor v with distance = dist[u] + 1.'
    ]
  },
  dfs: {
    name: 'Depth-First Search (DFS)',
    analogy: 'Exploring an ancient maze with a ball of thread — walk deep into one passage until you hit a dead end, then retrace your steps.',
    concept: 'Explores as deep as possible along each branch before backtracking. It dives down one path to its absolute limit, then rewinds to the latest fork to explore unexplored paths.',
    goldenRule: 'Go deep first. When you hit a dead end or an already visited node, backtrack to the nearest unvisited fork.',
    whyDataStructure: 'A LIFO (Last-In, First-Out) Call Stack naturally remembers the chain of parents so the algorithm can retrace its steps backward when backtracking.',
    steps: [
      '1. Push start node to call stack and mark as visited.',
      '2. Recurse down an unvisited neighbor as deep as possible.',
      '3. When dead end reached, pop node from stack and backtrack to previous fork.'
    ]
  },
  dijkstra: {
    name: "Dijkstra's Shortest Path",
    analogy: 'GPS Navigation (Google Maps) finding the fastest highway route between cities.',
    concept: 'Finds the shortest travel distance from a start vertex to all other vertices in non-negative weighted graphs by greedily locking in the closest unvisited city at each turn.',
    goldenRule: 'Greedy Relaxation: If dist[u] + weight(u, v) < dist[v], we have discovered a faster shortcut to v! Update dist[v].',
    whyDataStructure: 'A Min-Priority Queue (Min-Heap) instantly extracts the absolute cheapest frontier vertex in O(log V) time, guaranteeing we never waste time exploring longer detours.',
    steps: [
      '1. Initialize dist[start] = 0, and all other nodes to ∞. Enqueue start.',
      '2. Extract node u with lowest tentative distance from Min-Priority Queue.',
      '3. For each neighbor v, if dist[u] + weight < dist[v], update dist[v] and enqueue v.'
    ]
  },
  astar: {
    name: 'A* Heuristic Search',
    analogy: 'A hiker using both a pedometer (actual distance walked) and a compass (straight-line distance to peak).',
    concept: 'An intelligent pathfinding algorithm that extends Dijkstra by using a heuristic function h(v) (estimated distance to goal). It prioritizes exploring routes that head directly toward the destination.',
    goldenRule: 'Evaluation function f(v) = g(v) + h(v), where g is exact cost so far and h is estimated cost to goal.',
    whyDataStructure: 'A Min-Priority Queue orders vertices by f(v), ensuring the most promising direction toward the goal is explored first.',
    steps: [
      '1. Set f(start) = g(start) + h(start). Push start to Priority Queue.',
      '2. Pop vertex u with lowest f(u). If u is target, path is found!',
      '3. For each neighbor v, compute tentative g(v); if lower, update f(v) and enqueue v.'
    ]
  },
  bellmanford: {
    name: 'Bellman-Ford Algorithm',
    analogy: 'Currency arbitrage detector / gradual ripple relaxation across financial networks.',
    concept: 'Computes shortest paths even in networks with negative edge weights. In round k, it finds all shortest paths using at most k edges. It can also detect infinite-money negative cycles!',
    goldenRule: 'Any shortest path has at most |V| - 1 edges. If an edge can STILL be relaxed on round |V|, a negative-weight cycle exists!',
    whyDataStructure: 'Uses simple array iteration: relaxing all |V| - 1 edges |V| - 1 times guarantees shortest distance propagation across the entire network.',
    steps: [
      '1. Set dist[start] = 0, all others = ∞.',
      '2. Relax every edge (u, v) in the entire graph |V| - 1 times.',
      '3. Run a |V|-th pass: if any edge can still relax, report a negative cycle!'
    ]
  },
  bellman_ford: {
    name: 'Bellman-Ford Algorithm',
    analogy: 'Currency arbitrage detector / gradual ripple relaxation across financial networks.',
    concept: 'Computes shortest paths even in networks with negative edge weights. In round k, it finds all shortest paths using at most k edges. It can also detect infinite-money negative cycles!',
    goldenRule: 'Any shortest path has at most |V| - 1 edges. If an edge can STILL be relaxed on round |V|, a negative-weight cycle exists!',
    whyDataStructure: 'Uses simple array iteration: relaxing all |V| - 1 edges |V| - 1 times guarantees shortest distance propagation across the entire network.',
    steps: [
      '1. Set dist[start] = 0, all others = ∞.',
      '2. Relax every edge (u, v) in the entire graph |V| - 1 times.',
      '3. Run a |V|-th pass: if any edge can still relax, report a negative cycle!'
    ]
  },
  toposort: {
    name: "Topological Sort (Kahn's Algorithm)",
    analogy: 'University degree course prerequisites or task dependency scheduling.',
    concept: 'Produces a linear ordering of vertices such that for every directed edge u ➔ v, task u comes before task v. You cannot take Advanced AI until you pass Intro to CS!',
    goldenRule: 'A task is only ready to be taken when all its prerequisites have been fulfilled (in-degree == 0).',
    whyDataStructure: 'A Queue holds all courses whose prerequisites have dropped to 0, providing a steady stream of ready-to-execute tasks.',
    steps: [
      '1. Compute in-degree (number of prerequisites) for every node.',
      '2. Enqueue all nodes with in-degree == 0 (no prerequisites).',
      '3. Pop node u, append to order, and decrement in-degree for all its neighbors.'
    ]
  },
  kruskal: {
    name: "Kruskal's Minimum Spanning Tree (MST)",
    analogy: 'Connecting towns with electrical power cables using the minimum total wire length.',
    concept: 'Builds a tree connecting all vertices with the smallest possible total edge weight. It greedily inspects edges from lightest to heaviest and adds them if they do not create a loop.',
    goldenRule: 'Always pick the cheapest available cable, provided it connects two different disconnected components (prevents cycles).',
    whyDataStructure: 'Disjoint Set Union (DSU / Union-Find) checks in near O(1) time whether two vertices already belong to the same connected electrical grid.',
    steps: [
      '1. Sort all edges in ascending order of their weight.',
      '2. Iterate through sorted edges: if find(u) != find(v), add edge to MST and union(u, v).',
      '3. Stop when |V| - 1 edges are accepted.'
    ]
  },
  prim: {
    name: "Prim's Minimum Spanning Tree (MST)",
    analogy: 'Growing an interconnected fiber-optic network outward from a central city.',
    concept: 'Grows a single continuous tree from a starting vertex. At every step, it finds the cheapest bridge edge connecting the existing tree to an outside vertex.',
    goldenRule: 'Cut Property: The cheapest edge crossing the boundary between explored and unexplored vertices is guaranteed to belong to the MST.',
    whyDataStructure: 'A Min-Priority Queue stores all boundary crossing edges sorted by cost, allowing instant retrieval of the cheapest bridge.',
    steps: [
      '1. Start with single node in MST set. Add its incident edges to Priority Queue.',
      '2. Extract lightest edge (u, v) from Priority Queue where v is outside the MST.',
      "3. Add v and edge (u, v) to MST; push outward edges of v to Priority Queue."
    ]
  },
  bipartite: {
    name: 'Bipartite Graph Check (2-Coloring)',
    analogy: 'Dividing players into two opposing teams (Red vs Blue) so no two teammates play on the same side.',
    concept: 'Checks if vertices can be partitioned into two independent sets such that every edge connects a Red vertex to a Blue vertex with zero conflicts.',
    goldenRule: 'Adjacent vertices MUST have opposite colors. If two connected nodes demand the same color, the graph contains an odd cycle and is NOT bipartite!',
    whyDataStructure: 'A BFS Queue or DFS Stack systematically traverses level-by-level, assigning alternating colors 0 and 1 to subsequent layers.',
    steps: [
      '1. Color start node RED (color 0) and enqueue it.',
      '2. For each neighbor v of u: if uncolored, assign opposite color BLUE (color 1).',
      '3. If neighbor v already has the same color as u, report CONFLICT (not bipartite)!'
    ]
  },
  cycle: {
    name: 'Cycle Detection (Directed Graph)',
    analogy: 'Following footprints in the forest — if you step on a footprint that is currently on your active journey path, you walked in a circle!',
    concept: 'Detects if a directed graph contains a closed loop where starting at a vertex and following arrows brings you back to where you started.',
    goldenRule: 'A directed cycle exists if and only if DFS encounters a Back-Edge pointing to an ancestor currently in the active recursion stack.',
    whyDataStructure: 'An active recursion stack set tracks the exact chain of ancestors from the search root down to the current node.',
    steps: [
      '1. Mark current node as VISITED and add to inStack set.',
      '2. For each neighbor v: if v is in inStack, a CYCLE is detected!',
      '3. When all neighbors of u finish, remove u from inStack (backtrack).'
    ]
  },
  floydwarshall: {
    name: 'Floyd-Warshall (All-Pairs Shortest Path)',
    analogy: 'A global flight timetable comparing direct flights against every possible connecting layover city k.',
    concept: 'Calculates the shortest paths between EVERY pair of vertices simultaneously using dynamic programming by testing if routing through an intermediate hub k is faster.',
    goldenRule: 'Optimal substructure: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) for all intermediate hubs k.',
    whyDataStructure: 'A 2D adjacency distance matrix represents all-pairs direct and indirect travel distances.',
    steps: [
      '1. Initialize dist[i][j] with direct edge weights, and 0 on the diagonal.',
      '2. Triple nested loop over all intermediate hubs k, origins i, and destinations j.',
      '3. Update dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).'
    ]
  },
  tarjan_scc: {
    name: "Tarjan's Strongly Connected Components (SCC)",
    analogy: 'Detecting isolated roundabout traffic systems where cars can circulate between any two exits.',
    concept: 'Partitions a directed graph into maximal subgraphs where every vertex in the component can reach every other vertex in that component.',
    goldenRule: 'A node is the root of an SCC if and only if low[u] == discoveryTime[u] (it has no back-edge escaping to an earlier ancestor).',
    whyDataStructure: 'A DFS Stack keeps track of nodes in the candidate component until the root is settled, then pops the entire SCC in one go.',
    steps: [
      '1. Assign discoveryTime and low-link to current node u; push to stack.',
      '2. For each neighbor v: update low[u] = min(low[u], low[v]) or discoveryTime[v].',
      '3. If low[u] == discoveryTime[u], pop all nodes from stack up to u as a completed SCC!'
    ]
  },
  kosaraju: {
    name: "Kosaraju's SCC Algorithm",
    analogy: 'Two-pass wave: shout forward down all hallways, then turn around and walk back through the reversed echoes.',
    concept: 'Finds strongly connected components using two simple DFS passes: first pass orders nodes by finish time; second pass traverses the transposed (reversed) graph in reverse finish order.',
    goldenRule: 'In the transposed graph, SCCs remain intact, but cross-component edges are inverted, preventing search leaks!',
    whyDataStructure: 'A Stack stores the finish ordering of the first DFS pass.',
    steps: [
      '1. Run DFS on original graph; push finished nodes to a stack.',
      '2. Reverse all directed edges to create transposed graph G^T.',
      '3. Pop nodes from stack and run DFS on G^T; each tree discovered is a full SCC!'
    ]
  },
  bridges: {
    name: "Bridge Finding (Tarjan's Critical Connections)",
    analogy: 'Identifying critical single bridges connecting islands — if a bridge collapses, islands are stranded.',
    concept: 'Finds every edge whose removal strictly increases the number of connected components in the network.',
    goldenRule: 'Edge (u, v) is a bridge if and only if low[v] > discoveryTime[u] (no back-edge exists from v or its descendants to reach u or ancestors).',
    whyDataStructure: 'DFS traversal tree with discovery and low-link arrays.',
    steps: [
      '1. Run DFS and assign discovery time to each node.',
      '2. Compute low[u] as the earliest discovery time reachable via back-edges.',
      '3. If low[v] > disc[u], then edge (u, v) is a critical bridge!'
    ]
  },
  eulerian: {
    name: 'Eulerian Path & Circuit (Hierholzer)',
    analogy: 'Seven Bridges of Königsberg: Can you walk across every bridge in a city exactly once without retracing your steps?',
    concept: 'Finds a trail in a graph that visits every edge exactly once. An Eulerian Circuit exists if and only if every vertex has an even degree.',
    goldenRule: 'Even degree condition: Every time you enter a vertex via one edge, you must leave it via another distinct edge.',
    whyDataStructure: 'A Stack or Doubly Linked List tracks sub-circuits spliced together (Hierholzer algorithm).',
    steps: [
      '1. Check degree conditions (all even for circuit; exactly two odd for path).',
      '2. Follow unused edges greedily until returning to start of sub-circuit.',
      '3. Splice all sub-circuits together into one grand Eulerian trail.'
    ]
  },
  coloring: {
    name: 'Greedy Graph Coloring',
    analogy: 'Coloring a political map so no two neighboring countries share the same color.',
    concept: 'Assigns colors to vertices such that no two adjacent vertices share the same color, using the minimum number of colors possible.',
    goldenRule: 'Greedy pick: For vertex u, find the lowest integer color not used by any of its neighbors.',
    whyDataStructure: 'A boolean array of available colors marks which colors neighbors are currently occupying.',
    steps: [
      '1. Color first vertex with Color 0.',
      '2. For each vertex u, mark colors used by all its already-colored neighbors as unavailable.',
      '3. Assign u the lowest available color number.'
    ]
  }
};

