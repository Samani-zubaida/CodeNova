import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause,
  RotateCcw, 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight,
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Compass, 
  Activity,
  ListOrdered,
  Maximize2,
  GitCommit,
  Share2,
  TrendingDown,
  Grid,
  Zap,
  Award,
  HelpCircle,
  Clock,
  Eye,
  Check,
  X,
  FastForward
} from 'lucide-react';
import { GRAPH_CATALOG } from './GraphHub';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import DryRunVariableTracker from '../../components/visualizer/DryRunVariableTracker';

// Preset Network Topologies
const PRESET_TOPOLOGIES = {
  standard: {
    name: 'Standard Weighted Network (6 Vertices)',
    isDirected: false,
    nodes: [
      { id: 'A', x: 120, y: 270, label: 'A' },
      { id: 'B', x: 350, y: 120, label: 'B' },
      { id: 'C', x: 350, y: 420, label: 'C' },
      { id: 'D', x: 570, y: 120, label: 'D' },
      { id: 'E', x: 570, y: 420, label: 'E' },
      { id: 'F', x: 800, y: 270, label: 'F' },
    ],
    edges: [
      { u: 'A', v: 'B', weight: 4 },
      { u: 'A', v: 'C', weight: 2 },
      { u: 'B', v: 'C', weight: 1 },
      { u: 'B', v: 'D', weight: 5 },
      { u: 'C', v: 'E', weight: 8 },
      { u: 'C', v: 'D', weight: 10 },
      { u: 'D', v: 'E', weight: 2 },
      { u: 'D', v: 'F', weight: 6 },
      { u: 'E', v: 'F', weight: 3 },
    ]
  },
  dag: {
    name: 'Directed Acyclic Graph (DAG for TopoSort)',
    isDirected: true,
    nodes: [
      { id: '0', x: 140, y: 140, label: '0' },
      { id: '1', x: 140, y: 400, label: '1' },
      { id: '2', x: 450, y: 140, label: '2' },
      { id: '3', x: 450, y: 400, label: '3' },
      { id: '4', x: 760, y: 140, label: '4' },
      { id: '5', x: 760, y: 400, label: '5' },
    ],
    edges: [
      { u: '0', v: '2', weight: 1 },
      { u: '0', v: '3', weight: 1 },
      { u: '1', v: '3', weight: 1 },
      { u: '2', v: '4', weight: 1 },
      { u: '3', v: '4', weight: 1 },
      { u: '3', v: '5', weight: 1 },
      { u: '4', v: '5', weight: 1 },
    ]
  },
  cyclic: {
    name: 'Cyclic Network (Cycle Detection)',
    isDirected: true,
    nodes: [
      { id: 'A', x: 230, y: 170, label: 'A' },
      { id: 'B', x: 450, y: 90, label: 'B' },
      { id: 'C', x: 670, y: 170, label: 'C' },
      { id: 'D', x: 590, y: 440, label: 'D' },
      { id: 'E', x: 310, y: 440, label: 'E' },
    ],
    edges: [
      { u: 'A', v: 'B', weight: 1 },
      { u: 'B', v: 'C', weight: 1 },
      { u: 'C', v: 'D', weight: 1 },
      { u: 'D', v: 'E', weight: 1 },
      { u: 'E', v: 'A', weight: 1 },
      { u: 'B', v: 'D', weight: 1 },
    ]
  },
  bipartite: {
    name: 'Bipartite Network (2-Colorable Sets)',
    isDirected: false,
    nodes: [
      { id: 'U1', x: 220, y: 120, label: 'U1' },
      { id: 'U2', x: 220, y: 270, label: 'U2' },
      { id: 'U3', x: 220, y: 420, label: 'U3' },
      { id: 'V1', x: 680, y: 120, label: 'V1' },
      { id: 'V2', x: 680, y: 270, label: 'V2' },
      { id: 'V3', x: 680, y: 420, label: 'V3' },
    ],
    edges: [
      { u: 'U1', v: 'V1', weight: 1 },
      { u: 'U1', v: 'V2', weight: 1 },
      { u: 'U2', v: 'V2', weight: 1 },
      { u: 'U2', v: 'V3', weight: 1 },
      { u: 'U3', v: 'V1', weight: 1 },
      { u: 'U3', v: 'V3', weight: 1 },
    ]
  }
};

// Original multi-language code snippets for all 16 algorithms
const GRAPH_CODE_SNIPPETS = {
  kruskal: {
    javascript: [
      "function kruskalMST(numNodes, edges) {",
      "  edges.sort((a, b) => a.weight - b.weight); // 1. Sort edges ascending",
      "  const dsu = new DisjointSet(numNodes);      // 2. Initialize DSU sets",
      "  const mst = [];",
      "  let totalCost = 0;",
      "  for (const edge of edges) {",
      "    if (dsu.find(edge.u) !== dsu.find(edge.v)) { // 3. No cycle formed",
      "      dsu.union(edge.u, edge.v);             // 4. Merge components",
      "      mst.push(edge);",
      "      totalCost += edge.weight;",
      "    }",
      "  }",
      "  return { mst, totalCost };",
      "}"
    ],
    python: [
      "def kruskal_mst(nodes, edges):",
      "    edges.sort(key=lambda e: e['weight']) # Sort edges ascending",
      "    dsu = DisjointSet(nodes)               # DSU with find & union",
      "    mst, total_cost = [], 0",
      "    for u, v, w in edges:",
      "        if dsu.find(u) != dsu.find(v):     # Different components",
      "            dsu.union(u, v)                # Merge sets",
      "            mst.append((u, v, w))",
      "            total_cost += w",
      "    return mst, total_cost"
    ],
    cpp: [
      "struct Edge { int u, v, w; };",
      "int kruskalMST(int V, vector<Edge>& edges) {",
      "    sort(edges.begin(), edges.end(), [](Edge a, Edge b) { return a.w < b.w; });",
      "    DSU dsu(V);",
      "    int totalCost = 0;",
      "    for (auto& e : edges) {",
      "        if (dsu.find(e.u) != dsu.find(e.v)) {",
      "            dsu.unite(e.u, e.v);",
      "            totalCost += e.w;",
      "        }",
      "    }",
      "    return totalCost;",
      "}"
    ]
  },
  prim: {
    javascript: [
      "function primMST(graph, start) {",
      "  const visited = new Set([start]);",
      "  const pq = new MinPriorityQueue();",
      "  for (const edge of graph[start]) pq.push(edge);",
      "  const mst = []; let totalCost = 0;",
      "  while (!pq.isEmpty() && visited.size < numNodes) {",
      "    const { u, v, weight } = pq.pop(); // Min cut edge",
      "    if (visited.has(v)) continue;",
      "    visited.add(v);",
      "    mst.push({ u, v, weight }); totalCost += weight;",
      "    for (const next of graph[v]) if (!visited.has(next.v)) pq.push(next);",
      "  }",
      "  return { mst, totalCost };",
      "}"
    ],
    python: [
      "def prim_mst(graph, start):",
      "    visited = {start}",
      "    edges = [(w, start, v) for v, w in graph[start]]",
      "    heapq.heapify(edges)",
      "    mst, total_cost = [], 0",
      "    while edges:",
      "        w, u, v = heapq.heappop(edges)",
      "        if v not in visited:",
      "            visited.add(v)",
      "            mst.append((u, v, w)); total_cost += w",
      "            for nxt, nxt_w in graph[v]:",
      "                if nxt not in visited: heapq.heappush(edges, (nxt_w, v, nxt))",
      "    return mst, total_cost"
    ],
    cpp: [
      "int primMST(int V, const vector<vector<pii>>& adj) {",
      "    priority_queue<pii, vector<pii>, greater<pii>> pq;",
      "    vector<bool> inMST(V, false);",
      "    pq.push({0, 0}); int totalCost = 0;",
      "    while (!pq.empty()) {",
      "        auto [w, u] = pq.top(); pq.pop();",
      "        if (inMST[u]) continue;",
      "        inMST[u] = true; totalCost += w;",
      "        for (auto& [v, weight] : adj[u])",
      "            if (!inMST[v]) pq.push({weight, v});",
      "    }",
      "    return totalCost;",
      "}"
    ]
  },
  bfs: {
    javascript: [
      "function bfs(graph, startNode) {",
      "  const visited = new Set([startNode]);",
      "  const queue = [startNode]; // FIFO Queue",
      "  while (queue.length > 0) {",
      "    const curr = queue.shift(); // Dequeue from front",
      "    for (const neighbor of graph[curr]) {",
      "      if (!visited.has(neighbor)) {",
      "        visited.add(neighbor);",
      "        queue.push(neighbor);   // Enqueue at rear",
      "      }",
      "    }",
      "  }",
      "}"
    ],
    python: [
      "def bfs(graph, start):",
      "    visited = {start}",
      "    queue = deque([start])",
      "    while queue:",
      "        curr = queue.popleft() # Dequeue front",
      "        for neighbor in graph[curr]:",
      "            if neighbor not in visited:",
      "                visited.add(neighbor)",
      "                queue.append(neighbor) # Enqueue rear"
    ],
    cpp: [
      "void bfs(const Graph& g, int start) {",
      "    vector<bool> visited(g.size(), false);",
      "    queue<int> q; q.push(start);",
      "    visited[start] = true;",
      "    while (!q.empty()) {",
      "        int curr = q.front(); q.pop();",
      "        for (int v : g[curr]) if (!visited[v]) { visited[v] = true; q.push(v); }",
      "    }",
      "}"
    ]
  },
  dfs: {
    javascript: [
      "function dfs(graph, node, visited = new Set()) {",
      "  visited.add(node); // Push call stack frame",
      "  for (const neighbor of graph[node]) {",
      "    if (!visited.has(neighbor)) {",
      "      dfs(graph, neighbor, visited);",
      "    }",
      "  }",
      "  // Pop call stack frame (backtrack)",
      "}"
    ],
    python: [
      "def dfs(graph, node, visited=None):",
      "    if visited is None: visited = set()",
      "    visited.add(node) # Push onto stack",
      "    for neighbor in graph[node]:",
      "        if neighbor not in visited:",
      "            dfs(graph, neighbor, visited)",
      "    # Pop stack frame"
    ],
    cpp: [
      "void dfs(int u, const vector<vector<int>>& adj, vector<bool>& vis) {",
      "    vis[u] = true; // Push stack",
      "    for (int v : adj[u]) {",
      "        if (!vis[v]) dfs(v, adj, vis);",
      "    }",
      "    // Pop stack frame",
      "}"
    ]
  },
  dijkstra: {
    javascript: [
      "function dijkstra(graph, start) {",
      "  const dist = {};",
      "  for (const node of Object.keys(graph)) dist[node] = Infinity;",
      "  dist[start] = 0;",
      "  const pq = new MinPriorityQueue();",
      "  pq.enqueue(start, 0);",
      "  while (!pq.isEmpty()) {",
      "    const { element: u, priority: d } = pq.dequeue();",
      "    if (d > dist[u]) continue;",
      "    for (const { v, weight } of graph[u]) {",
      "      if (dist[u] + weight < dist[v]) { // Relaxation",
      "        dist[v] = dist[u] + weight;",
      "        pq.enqueue(v, dist[v]);",
      "      }",
      "    }",
      "  }",
      "  return dist;",
      "}"
    ],
    python: [
      "def dijkstra(graph, start):",
      "    dist = {node: float('inf') for node in graph}",
      "    dist[start] = 0; pq = [(0, start)]",
      "    while pq:",
      "        d, u = heapq.heappop(pq)",
      "        if d > dist[u]: continue",
      "        for v, weight in graph[u]:",
      "            if dist[u] + weight < dist[v]:",
      "                dist[v] = dist[u] + weight",
      "                heapq.heappush(pq, (dist[v], v))",
      "    return dist"
    ],
    cpp: [
      "vector<int> dijkstra(int V, const vector<vector<pii>>& adj, int src) {",
      "    vector<int> dist(V, 1e9); dist[src] = 0;",
      "    priority_queue<pii, vector<pii>, greater<pii>> pq;",
      "    pq.push({0, src});",
      "    while(!pq.empty()) {",
      "        auto [d, u] = pq.top(); pq.pop();",
      "        if (d > dist[u]) continue;",
      "        for (auto& [v, w] : adj[u]) {",
      "            if (dist[u] + w < dist[v]) {",
      "                dist[v] = dist[u] + w;",
      "                pq.push({dist[v], v});",
      "            }",
      "        }",
      "    }",
      "    return dist;",
      "}"
    ]
  },
  toposort: {
    javascript: [
      "function topologicalSortKahn(numNodes, inDegree, adj) {",
      "  const queue = [];",
      "  for (let i = 0; i < numNodes; i++) if (inDegree[i] === 0) queue.push(i);",
      "  const order = [];",
      "  while (queue.length > 0) {",
      "    const u = queue.shift();",
      "    order.push(u);",
      "    for (const v of adj[u]) {",
      "      inDegree[v]--;",
      "      if (inDegree[v] === 0) queue.push(v);",
      "    }",
      "  }",
      "  return order.length === numNodes ? order : 'Cycle detected!';",
      "}"
    ],
    python: [
      "def kahn_toposort(V, in_degree, adj):",
      "    q = deque([u for u in range(V) if in_degree[u] == 0])",
      "    order = []",
      "    while q:",
      "        u = q.popleft(); order.append(u)",
      "        for v in adj[u]:",
      "            in_degree[v] -= 1",
      "            if in_degree[v] == 0: q.append(v)",
      "    return order"
    ],
    cpp: [
      "vector<int> topoSortKahn(int V, vector<int> adj[]) {",
      "    vector<int> inDegree(V, 0);",
      "    for (int u = 0; u < V; u++) for (int v : adj[u]) inDegree[v]++;",
      "    queue<int> q;",
      "    for (int i = 0; i < V; i++) if (inDegree[i] == 0) q.push(i);",
      "    vector<int> topo;",
      "    while (!q.empty()) {",
      "        int u = q.front(); q.pop(); topo.push_back(u);",
      "        for (int v : adj[u]) if (--inDegree[v] == 0) q.push(v);",
      "    }",
      "    return topo;",
      "}"
    ]
  },
  cycle: {
    javascript: [
      "function detectCycle3Color(u, graph, colors) {",
      "  colors[u] = 'GRAY'; // In active recursion stack",
      "  for (const v of graph[u]) {",
      "    if (colors[v] === 'GRAY') return true; // Back-edge found!",
      "    if (colors[v] === 'WHITE' && detectCycle3Color(v, graph, colors)) return true;",
      "  }",
      "  colors[u] = 'BLACK'; // Fully explored",
      "  return false;",
      "}"
    ],
    python: [
      "def has_cycle(u, graph, colors):",
      "    colors[u] = 'GRAY' # On active call path",
      "    for v in graph[u]:",
      "        if colors[v] == 'GRAY': return True # Back edge",
      "        if colors[v] == 'WHITE' and has_cycle(v, graph, colors): return True",
      "    colors[u] = 'BLACK'",
      "    return False"
    ],
    cpp: [
      "bool hasCycle(int u, vector<int> adj[], vector<int>& color) {",
      "    color[u] = 1; // GRAY",
      "    for (int v : adj[u]) {",
      "        if (color[v] == 1) return true;",
      "        if (color[v] == 0 && hasCycle(v, adj, color)) return true;",
      "    }",
      "    color[u] = 2; // BLACK",
      "    return false;",
      "}"
    ]
  },
  bipartite: {
    javascript: [
      "function isBipartite(graph) {",
      "  const color = {};",
      "  for (const node of Object.keys(graph)) {",
      "    if (!color[node]) {",
      "      color[node] = 1;",
      "      const queue = [node];",
      "      while (queue.length > 0) {",
      "        const u = queue.shift();",
      "        for (const v of graph[u]) {",
      "          if (!color[v]) { color[v] = 3 - color[u]; queue.push(v); }",
      "          else if (color[v] === color[u]) return false; // Conflict!",
      "        }",
      "      }",
      "    }",
      "  }",
      "  return true;",
      "}"
    ],
    python: [
      "def is_bipartite(graph):",
      "    color = {}",
      "    for node in graph:",
      "        if node not in color:",
      "            color[node] = 1; q = deque([node])",
      "            while q:",
      "                u = q.popleft()",
      "                for v in graph[u]:",
      "                    if v not in color: color[v] = 1 - color[u]; q.append(v)",
      "                    elif color[v] == color[u]: return False",
      "    return True"
    ],
    cpp: [
      "bool isBipartite(int V, vector<int> adj[]) {",
      "    vector<int> col(V, -1);",
      "    queue<int> q; q.push(0); col[0] = 0;",
      "    while(!q.empty()) {",
      "        int u = q.front(); q.pop();",
      "        for(int v: adj[u]) {",
      "            if(col[v] == -1) { col[v] = 1 - col[u]; q.push(v); }",
      "            else if(col[v] == col[u]) return false;",
      "        }",
      "    }",
      "    return true;",
      "}"
    ]
  },
  astar: {
    javascript: [
      "function aStar(graph, start, target, h) {",
      "  const gScore = { [start]: 0 };",
      "  const fScore = { [start]: h(start, target) };",
      "  const openSet = new MinPriorityQueue();",
      "  openSet.enqueue(start, fScore[start]);",
      "  while (!openSet.isEmpty()) {",
      "    const current = openSet.dequeue().element;",
      "    if (current === target) return reconstructPath(cameFrom, current);",
      "    for (const { v, weight } of graph[current]) {",
      "      const tentativeG = gScore[current] + weight;",
      "      if (tentativeG < (gScore[v] || Infinity)) {",
      "        cameFrom[v] = current;",
      "        gScore[v] = tentativeG;",
      "        fScore[v] = tentativeG + h(v, target);",
      "        openSet.enqueue(v, fScore[v]);",
      "      }",
      "    }",
      "  }",
      "}"
    ],
    python: [
      "def a_star(graph, start, goal, h):",
      "    open_set = [(h(start, goal), 0, start, [])]",
      "    visited = set()",
      "    while open_set:",
      "        f, g, u, path = heapq.heappop(open_set)",
      "        if u == goal: return path + [u]",
      "        if u in visited: continue",
      "        visited.add(u)",
      "        for v, weight in graph[u]:",
      "            if v not in visited:",
      "                heapq.heappush(open_set, (g + weight + h(v, goal), g + weight, v, path + [u]))"
    ],
    cpp: [
      "vector<int> aStar(int start, int target, const Graph& g, auto heuristic) {",
      "    priority_queue<Node, vector<Node>, greater<Node>> openSet;",
      "    openSet.push({start, 0, heuristic(start, target)});",
      "    while (!openSet.empty()) {",
      "        auto curr = openSet.top(); openSet.pop();",
      "        if (curr.id == target) return reconstruct(curr);",
      "        for (auto& edge : g[curr.id]) {",
      "            int tentG = curr.g + edge.w;",
      "            if (tentG < gScore[edge.to]) openSet.push({edge.to, tentG, tentG + heuristic(edge.to, target)});",
      "        }",
      "    }",
      "}"
    ]
  },
  bellmanford: {
    javascript: [
      "function bellmanFord(numNodes, edges, start) {",
      "  const dist = new Array(numNodes).fill(Infinity);",
      "  dist[start] = 0;",
      "  for (let i = 0; i < numNodes - 1; i++) { // |V| - 1 passes",
      "    for (const { u, v, weight } of edges) {",
      "      if (dist[u] + weight < dist[v]) dist[v] = dist[u] + weight;",
      "    }",
      "  }",
      "  for (const { u, v, weight } of edges) {",
      "    if (dist[u] + weight < dist[v]) throw new Error('Negative cycle!');",
      "  }",
      "  return dist;",
      "}"
    ],
    python: [
      "def bellman_ford(V, edges, src):",
      "    dist = [float('inf')] * V; dist[src] = 0",
      "    for _ in range(V - 1):",
      "        for u, v, w in edges:",
      "            if dist[u] + w < dist[v]: dist[v] = dist[u] + w",
      "    for u, v, w in edges:",
      "        if dist[u] + w < dist[v]: raise Exception('Negative cycle!')",
      "    return dist"
    ],
    cpp: [
      "vector<int> bellmanFord(int V, const vector<Edge>& edges, int src) {",
      "    vector<int> dist(V, 1e9); dist[src] = 0;",
      "    for (int i = 0; i < V - 1; i++)",
      "        for (auto& e : edges) if (dist[e.u] + e.w < dist[e.v]) dist[e.v] = dist[e.u] + e.w;",
      "    return dist;",
      "}"
    ]
  },
  floydwarshall: {
    javascript: [
      "function floydWarshall(V, graph) {",
      "  const dist = Array.from({ length: V }, (_, i) => [...graph[i]]);",
      "  for (let k = 0; k < V; k++) {",
      "    for (let i = 0; i < V; i++) {",
      "      for (let j = 0; j < V; j++) {",
      "        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];",
      "      }",
      "    }",
      "  }",
      "  return dist;",
      "}"
    ],
    python: [
      "def floyd_warshall(V, dist):",
      "    for k in range(V):",
      "        for i in range(V):",
      "            for j in range(V):",
      "                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])",
      "    return dist"
    ],
    cpp: [
      "void floydWarshall(int V, vector<vector<int>>& dist) {",
      "    for (int k = 0; k < V; k++)",
      "        for (int i = 0; i < V; i++)",
      "            for (int j = 0; j < V; j++)",
      "                if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];",
      "}"
    ]
  },
  tarjan_scc: {
    javascript: [
      "function tarjanSCC(V, adj) {",
      "  let timer = 0;",
      "  const disc = new Array(V).fill(-1), low = new Array(V).fill(-1);",
      "  const inStack = new Array(V).fill(false), stack = [], sccs = [];",
      "  function dfs(u) {",
      "    disc[u] = low[u] = ++timer;",
      "    stack.push(u); inStack[u] = true;",
      "    for (const v of adj[u]) {",
      "      if (disc[v] === -1) { dfs(v); low[u] = Math.min(low[u], low[v]); }",
      "      else if (inStack[v]) low[u] = Math.min(low[u], disc[v]);",
      "    }",
      "    if (low[u] === disc[u]) {",
      "      const component = [];",
      "      while (true) {",
      "        const v = stack.pop(); inStack[v] = false; component.push(v);",
      "        if (u === v) break;",
      "      }",
      "      sccs.push(component);",
      "    }",
      "  }",
      "  for (let i = 0; i < V; i++) if (disc[i] === -1) dfs(i);",
      "  return sccs;",
      "}"
    ],
    python: [
      "def tarjan_scc(V, adj):",
      "    disc, low = [-1]*V, [-1]*V; stack, in_stack, sccs = [], [False]*V, []",
      "    timer = 0",
      "    def dfs(u):",
      "        nonlocal timer; timer += 1",
      "        disc[u] = low[u] = timer; stack.append(u); in_stack[u] = True",
      "        for v in adj[u]:",
      "            if disc[v] == -1: dfs(v); low[u] = min(low[u], low[v])",
      "            elif in_stack[v]: low[u] = min(low[u], disc[v])",
      "        if low[u] == disc[u]:",
      "            comp = []",
      "            while True:",
      "                v = stack.pop(); in_stack[v] = False; comp.append(v)",
      "                if u == v: break",
      "            sccs.append(comp)",
      "    for i in range(V): if disc[i] == -1: dfs(i)",
      "    return sccs"
    ],
    cpp: [
      "void tarjanDFS(int u, vector<int>& disc, vector<int>& low, stack<int>& st, vector<bool>& inSt, vector<vector<int>>& adj) {",
      "    static int timer = 0;",
      "    disc[u] = low[u] = ++timer;",
      "    st.push(u); inSt[u] = true;",
      "    for (int v : adj[u]) {",
      "        if (disc[v] == -1) { tarjanDFS(v, disc, low, st, inSt, adj); low[u] = min(low[u], low[v]); }",
      "        else if (inSt[v]) low[u] = min(low[u], disc[v]);",
      "    }",
      "    if (low[u] == disc[u]) {",
      "        while (true) { int v = st.top(); st.pop(); inSt[v] = false; if (u == v) break; }",
      "    }",
      "}"
    ]
  },
  kosaraju: {
    javascript: [
      "function kosarajuSCC(V, adj) {",
      "  const visited = new Set(), stack = [];",
      "  function dfs1(u) {",
      "    visited.add(u);",
      "    for (const v of adj[u]) if (!visited.has(v)) dfs1(v);",
      "    stack.push(u);",
      "  }",
      "  for (let i = 0; i < V; i++) if (!visited.has(i)) dfs1(i);",
      "  const revAdj = reverseGraph(V, adj);",
      "  visited.clear(); const sccs = [];",
      "  function dfs2(u, comp) {",
      "    visited.add(u); comp.push(u);",
      "    for (const v of revAdj[u]) if (!visited.has(v)) dfs2(v, comp);",
      "  }",
      "  while (stack.length > 0) {",
      "    const u = stack.pop();",
      "    if (!visited.has(u)) { const comp = []; dfs2(u, comp); sccs.push(comp); }",
      "  }",
      "  return sccs;",
      "}"
    ],
    python: [
      "def kosaraju(V, adj):",
      "    visited, stack = set(), []",
      "    def dfs1(u):",
      "        visited.add(u)",
      "        for v in adj[u]: if v not in visited: dfs1(v)",
      "        stack.append(u)",
      "    for i in range(V): if i not in visited: dfs1(i)",
      "    rev_adj = get_transpose(V, adj); visited.clear(); sccs = []",
      "    def dfs2(u, comp):",
      "        visited.add(u); comp.append(u)",
      "        for v in rev_adj[u]: if v not in visited: dfs2(v, comp)",
      "    while stack:",
      "        u = stack.pop()",
      "        if u not in visited: comp = []; dfs2(u, comp); sccs.append(comp)",
      "    return sccs"
    ],
    cpp: [
      "vector<vector<int>> kosaraju(int V, vector<int> adj[]) {",
      "    vector<bool> vis(V, false); stack<int> st;",
      "    for (int i = 0; i < V; i++) if (!vis[i]) dfs1(i, adj, vis, st);",
      "    vector<int> revAdj[V]; transpose(V, adj, revAdj); fill(vis.begin(), vis.end(), false);",
      "    vector<vector<int>> sccs;",
      "    while (!st.empty()) {",
      "        int u = st.top(); st.pop();",
      "        if (!vis[u]) { vector<int> comp; dfs2(u, revAdj, vis, comp); sccs.push_back(comp); }",
      "    }",
      "    return sccs;",
      "}"
    ]
  },
  bridges: {
    javascript: [
      "function findBridges(V, adj) {",
      "  let timer = 0;",
      "  const tin = new Array(V).fill(-1), low = new Array(V).fill(-1);",
      "  const bridges = [];",
      "  function dfs(u, p = -1) {",
      "    tin[u] = low[u] = ++timer;",
      "    for (const v of adj[u]) {",
      "      if (v === p) continue;",
      "      if (tin[v] !== -1) low[u] = Math.min(low[u], tin[v]);",
      "      else {",
      "        dfs(v, u); low[u] = Math.min(low[u], low[v]);",
      "        if (low[v] > tin[u]) bridges.push([u, v]); // Bridge edge!",
      "      }",
      "    }",
      "  }",
      "  for (let i = 0; i < V; i++) if (tin[i] === -1) dfs(i);",
      "  return bridges;",
      "}"
    ],
    python: [
      "def find_bridges(V, adj):",
      "    tin, low = [-1]*V, [-1]*V; timer = 0; bridges = []",
      "    def dfs(u, p=-1):",
      "        nonlocal timer; timer += 1; tin[u] = low[u] = timer",
      "        for v in adj[u]:",
      "            if v == p: continue",
      "            if tin[v] != -1: low[u] = min(low[u], tin[v])",
      "            else:",
      "                dfs(v, u); low[u] = min(low[u], low[v])",
      "                if low[v] > tin[u]: bridges.append((u, v))",
      "    for i in range(V): if tin[i] == -1: dfs(i)",
      "    return bridges"
    ],
    cpp: [
      "void findBridges(int u, int p, vector<int>& tin, vector<int>& low, int& timer, vector<pair<int,int>>& bridges, const vector<vector<int>>& adj) {",
      "    tin[u] = low[u] = ++timer;",
      "    for (int v : adj[u]) {",
      "        if (v == p) continue;",
      "        if (tin[v]) low[u] = min(low[u], tin[v]);",
      "        else {",
      "            findBridges(v, u, tin, low, timer, bridges, adj);",
      "            low[u] = min(low[u], low[v]);",
      "            if (low[v] > tin[u]) bridges.push_back({u, v});",
      "        }",
      "    }",
      "}"
    ]
  },
  eulerian: {
    javascript: [
      "function hierholzerEulerian(start, adjMatrix) {",
      "  const stack = [start], path = [];",
      "  while (stack.length > 0) {",
      "    const u = stack[stack.length - 1];",
      "    const nextEdge = getUnusedEdge(u, adjMatrix);",
      "    if (nextEdge !== null) {",
      "      removeEdge(u, nextEdge, adjMatrix);",
      "      stack.push(nextEdge);",
      "    } else {",
      "      path.push(stack.pop());",
      "    }",
      "  }",
      "  return path.reverse();",
      "}"
    ],
    python: [
      "def hierholzer(start, adj):",
      "    stack, path = [start], []",
      "    while stack:",
      "        u = stack[-1]",
      "        if adj[u]:",
      "            v = adj[u].pop()",
      "            adj[v].remove(u); stack.append(v)",
      "        else:",
      "            path.append(stack.pop())",
      "    return path[::-1]"
    ],
    cpp: [
      "vector<int> eulerianPath(int start, vector<unordered_set<int>>& adj) {",
      "    stack<int> st; st.push(start); vector<int> path;",
      "    while (!st.empty()) {",
      "        int u = st.top();",
      "        if (!adj[u].empty()) {",
      "            int v = *adj[u].begin(); adj[u].erase(v); adj[v].erase(u); st.push(v);",
      "        } else { path.push_back(u); st.pop(); }",
      "    }",
      "    reverse(path.begin(), path.end()); return path;",
      "}"
    ]
  },
  coloring: {
    javascript: [
      "function greedyColoring(V, adj) {",
      "  const result = new Array(V).fill(-1);",
      "  result[0] = 0; // First color to first node",
      "  const available = new Array(V).fill(true);",
      "  for (let u = 1; u < V; u++) {",
      "    for (const v of adj[u]) if (result[v] !== -1) available[result[v]] = false;",
      "    let cr = 0;",
      "    while (cr < V && !available[cr]) cr++;",
      "    result[u] = cr;",
      "    available.fill(true);",
      "  }",
      "  return result;",
      "}"
    ],
    python: [
      "def greedy_coloring(V, adj):",
      "    result = [-1] * V; result[0] = 0",
      "    available = [True] * V",
      "    for u in range(1, V):",
      "        for v in adj[u]:",
      "            if result[v] != -1: available[result[v]] = False",
      "        cr = next(c for c in range(V) if available[c])",
      "        result[u] = cr; available = [True] * V",
      "    return result"
    ],
    cpp: [
      "vector<int> greedyColoring(int V, vector<int> adj[]) {",
      "    vector<int> result(V, -1); result[0] = 0;",
      "    vector<bool> available(V, true);",
      "    for (int u = 1; u < V; u++) {",
      "        for (int v : adj[u]) if (result[v] != -1) available[result[v]] = false;",
      "        int cr = 0; while (!available[cr]) cr++;",
      "        result[u] = cr; fill(available.begin(), available.end(), true);",
      "    }",
      "    return result;",
      "}"
    ]
  }
};

// =========================================================================
// SIMPLE TEXTBOOK QUEUE (FIFO) DIAGRAM (MATCHING TEXTBOOK SPECIFICATION)
// =========================================================================
const SimpleQueueDiagram = ({ queue = [], activeVal }) => {
  const items = queue.length > 0 
    ? queue.map(item => (typeof item === 'object' ? (item.node || item.val || JSON.stringify(item)) : item))
    : [];

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-slate-100/90 dark:bg-[#12131a]/90 border border-gray-300 dark:border-white/10 rounded-2xl shadow-xl w-full select-none">
      {/* Horizontal Tube Container */}
      <div className="w-full flex items-center justify-center gap-3 py-6">
        {/* Left Side: Exit Arrow (pointing left) and Exit text */}
        <div className="flex flex-col items-center gap-1">
          <svg width="44" height="20" viewBox="0 0 44 20" className="overflow-visible">
            <line x1="44" y1="10" x2="10" y2="10" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="14,4 0,10 14,16" fill="currentColor" className="text-slate-900 dark:text-white" />
          </svg>
          <span className="text-sm font-black text-slate-900 dark:text-white font-sans tracking-wide">
            Exit
          </span>
        </div>

        {/* The Queue Chamber: Top & Bottom Horizontal Walls with Open Ends */}
        <div className="relative min-w-[180px] max-w-[270px] h-12 border-t-[3px] border-b-[3px] border-slate-900 dark:border-white bg-slate-200/60 dark:bg-black/40 flex items-center justify-start overflow-x-auto px-0">
          <AnimatePresence initial={false}>
            {items.length === 0 ? (
              <div className="w-full text-center text-xs text-gray-500 font-mono italic">
                [ Empty ]
              </div>
            ) : (
              items.map((val, idx) => {
                const isFront = idx === 0;

                return (
                  <motion.div
                    key={`queue-block-${idx}-${val}`}
                    layout
                    initial={{ opacity: 0, x: 35, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -35, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className={`h-full min-w-[50px] px-3.5 border-r-2 last:border-r-0 border-slate-900 dark:border-white flex items-center justify-center font-mono text-base font-black transition-colors shrink-0 ${
                      isFront
                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white shadow-inner'
                        : 'bg-slate-200 dark:bg-gray-100 dark:bg-[#5C4E49] text-slate-900 dark:text-[#2D1F23] dark:text-[#F4EBC3]'
                    }`}
                  >
                    {val}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Entry text and Entry Arrow (pointing left into tube) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-black text-slate-900 dark:text-white font-sans tracking-wide">
            Entry
          </span>
          <svg width="44" height="20" viewBox="0 0 44 20" className="overflow-visible">
            <line x1="44" y1="10" x2="10" y2="10" stroke="currentColor" className="text-slate-900 dark:text-white" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="14,4 0,10 14,16" fill="currentColor" className="text-slate-900 dark:text-white" />
          </svg>
        </div>
      </div>

      {/* Caption Underneath */}
      <div className="text-center mt-3">
        <div className="text-base font-black text-slate-900 dark:text-white font-sans tracking-wide">
          Queues
        </div>
        <div className="text-sm font-bold text-slate-600 dark:text-gray-500 dark:text-[#BCA297] font-sans">
          (FIFO)
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SIMPLE TEXTBOOK LINKED LIST (ADJACENCY & PATH) DIAGRAM
// =========================================================================
const SimpleLinkedListDiagram = ({ adjacencyList = {}, activeNode, probingNode, visitedSequence = [] }) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-100/90 dark:bg-[#12131a]/90 border border-gray-300 dark:border-white/10 rounded-2xl shadow-xl w-full select-none">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
        <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-[#2D1F23] dark:text-[#F4EBC3] font-mono">
          Adjacency Linked List
        </span>
        <span className="text-[10px] font-mono font-bold text-gray-500">
          {Object.keys(adjacencyList).length} Vertices
        </span>
      </div>

      {/* Traversal Path Linked List Chain */}
      {visitedSequence && visitedSequence.length > 0 && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 font-mono">
            Visited Linked List:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px] font-black shrink-0">
              HEAD
            </span>
            <span className="text-emerald-500 font-bold shrink-0">➔</span>
            {visitedSequence.map((vId, idx) => (
              <React.Fragment key={`visited-ll-${idx}-${vId}`}>
                <div className="flex items-stretch border border-emerald-500/50 rounded-lg overflow-hidden shrink-0 bg-white dark:bg-gray-100 dark:bg-[#5C4E49] shadow-xs">
                  <span className="px-2 py-0.5 font-mono text-xs font-black text-emerald-700 dark:text-emerald-300">
                    {vId}
                  </span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] border-l border-emerald-500/30 flex items-center">
                    •
                  </span>
                </div>
                <span className="text-emerald-500 font-bold shrink-0">➔</span>
              </React.Fragment>
            ))}
            <span className="px-1.5 py-0.5 rounded bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono text-[10px] font-bold shrink-0">
              NULL
            </span>
          </div>
        </div>
      )}

      {/* Adjacency List Rows */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {Object.entries(adjacencyList).map(([u, neighbors]) => {
          const isRowActive = activeNode === u;

          return (
            <div
              key={`adj-row-${u}`}
              className={`flex items-center gap-1.5 p-1.5 rounded-xl transition-all ${
                isRowActive
                  ? 'bg-amber-500/15 border border-amber-500/40 shadow-xs'
                  : 'bg-black/5 dark:bg-white/5 border border-transparent'
              }`}
            >
              {/* Vertex Head Node */}
              <div className={`flex items-stretch border-2 rounded-lg overflow-hidden shrink-0 shadow-xs ${
                isRowActive
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-[#EBE0D3] dark:border-[#5C4E49] dark:border-slate-300 bg-gray-100 dark:bg-[#5C4E49] dark:bg-slate-200 text-white dark:text-slate-900'
              }`}>
                <span className="px-2.5 py-1 font-mono text-xs font-black">
                  {u}
                </span>
                <span className="px-1.5 py-1 bg-black/20 text-[10px] font-mono border-l border-white/20 flex items-center">
                  •
                </span>
              </div>

              <span className="text-gray-400 dark:text-gray-500 font-bold shrink-0">➔</span>

              {/* Linked List of Neighbors */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {neighbors.length === 0 ? (
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-500 font-mono text-[10px] font-bold">
                    NULL
                  </span>
                ) : (
                  neighbors.map((nbr, nIdx) => {
                    const isNbrProbing = isRowActive && probingNode === nbr.target;

                    return (
                      <React.Fragment key={`adj-${u}-${nbr.target}-${nIdx}`}>
                        <div className={`flex items-stretch border rounded-lg overflow-hidden shrink-0 shadow-xs transition-all ${
                          isNbrProbing
                            ? 'border-amber-400 bg-amber-500/30 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/50'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-100 dark:bg-[#5C4E49] text-gray-800 dark:text-gray-200'
                        }`}>
                          <span className="px-2 py-0.5 font-mono text-xs font-black flex items-center gap-1">
                            {nbr.target}
                            {nbr.weight !== undefined && (
                              <span className="text-[9px] text-gray-400 font-normal">
                                (w:{nbr.weight})
                              </span>
                            )}
                          </span>
                          <span className="px-1.5 py-0.5 bg-black/5 dark:bg-white/5 border-l border-gray-200 dark:border-gray-700 font-mono text-[9px] text-gray-400 flex items-center">
                            •
                          </span>
                        </div>
                        <span className="text-gray-400 dark:text-gray-500 font-bold shrink-0 text-xs">➔</span>
                      </React.Fragment>
                    );
                  })
                )}
                {neighbors.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-500 font-mono text-[10px] font-bold shrink-0">
                    NULL
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 font-sans mt-1">
        Graph Adjacency List Representation (Linked List)
      </div>
    </div>
  );
};


// =========================================================================
// ALGORITHM INTUITIONS & REAL-WORLD MENTAL MODELS (ELI5)
// =========================================================================
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

export default function GraphVisualizer() {
  const { algoId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Resolve current algorithm
  const currentAlgoId = algoId || searchParams.get('algo') || 'bfs';
  const currentAlgo = GRAPH_CATALOG.find(a => a.id === currentAlgoId) || GRAPH_CATALOG[0];

  // Active Topology
  const [selectedTopologyKey, setSelectedTopologyKey] = useState(() => {
    if (currentAlgo.id === 'toposort') return 'dag';
    if (currentAlgo.id === 'cycle' || currentAlgo.id === 'tarjan_scc' || currentAlgo.id === 'kosaraju') return 'cyclic';
    if (currentAlgo.id === 'bipartite') return 'bipartite';
    return 'standard';
  });

  const [graphData, setGraphData] = useState(() => PRESET_TOPOLOGIES[selectedTopologyKey]);
  const [startNode, setStartNode] = useState('A');
  const [targetNode, setTargetNode] = useState('F');

  // Animation Stepper State
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  // VISUAL LIVE STATE: Queue, Stack, Visited, Distance, Edge Highlights
  const [activeNode, setActiveNode] = useState(null);
  // Tab selection for right panel: Queue vs Linked List
  const [rightPanelTab, setRightPanelTab] = useState('queue');
  const [showIntuitionModal, setShowIntuitionModal] = useState(false);

  // Adjacency Linked List representation
  const adjacencyList = useMemo(() => {
    const list = {};
    if (!graphData?.nodes) return list;
    graphData.nodes.forEach(n => {
      list[n.id] = [];
    });
    if (!graphData?.edges) return list;
    graphData.edges.forEach(e => {
      if (list[e.u]) list[e.u].push({ target: e.v, weight: e.weight });
      if (!graphData.isDirected && list[e.v]) {
        list[e.v].push({ target: e.u, weight: e.weight });
      }
    });
    return list;
  }, [graphData]);

  // Accumulated Traversed Edges (ARROWS NEVER FADE AFTER NEXT STEP)
  const accumulatedTraversedEdges = useMemo(() => {
    const map = new Map();
    if (!animationSteps || animationSteps.length === 0) return map;

    const limit = Math.min(currentStepIdx, animationSteps.length - 1);
    for (let i = 0; i <= limit; i++) {
      const step = animationSteps[i];
      if (!step) continue;

      // Only confirmed path/tree edges are tracked as traversed
      if (step.pathEdges && Array.isArray(step.pathEdges)) {
        step.pathEdges.forEach(pe => {
          const parts = pe.split('-');
          if (parts.length === 2) {
            map.set(pe, { from: parts[0], to: parts[1] });
          }
        });
      }
    }
    return map;
  }, [animationSteps, currentStepIdx]);

  // Calculation Badge Stored Above Each Node
  const getNodeCalculationBadge = (node) => {
    const nId = node.id;
    const isCur = activeNode === nId;
    const isPrb = probingNode === nId;
    const isPth = highlightedPathNodes.has(nId);

    // 1. Distance for Dijkstra / Bellman-Ford / BFS
    if (distanceMap && distanceMap[nId] !== undefined) {
      const d = distanceMap[nId];
      const isStart = nId === startNode;
      const label = d === Infinity ? 'd: ∞' : isStart ? `d: ${d} (Start)` : `d: ${d}`;
      return {
        text: label,
        color: isCur ? '#AB526B' : isPrb ? '#D97706' : d < Infinity ? '#059669' : '#475569',
        border: isCur ? '#FCA5A5' : isPrb ? '#FDE68A' : d < Infinity ? '#34D399' : '#64748B',
        textColor: '#FFFFFF',
        icon: isCur ? '👑' : isPrb ? '👀' : isPth ? '🎯' : d === 0 ? '🏁' : '📏'
      };
    }

    // 2. Topological Sort In-Degree & Order
    if (inDegreeMap && inDegreeMap[nId] !== undefined) {
      const deg = inDegreeMap[nId];
      const topoIdx = topoOrder.indexOf(nId);
      const label = topoIdx !== -1 ? `topo: #${topoIdx + 1}` : `in-deg: ${deg}`;
      return {
        text: label,
        color: topoIdx !== -1 ? '#059669' : deg === 0 ? '#10B981' : '#AB526B',
        border: topoIdx !== -1 ? '#34D399' : '#FCA5A5',
        textColor: '#FFFFFF',
        icon: topoIdx !== -1 ? '✓' : deg === 0 ? '🔓' : '🔒'
      };
    }

    // 3. Prim / Kruskal MST Component
    if (currentAlgo.id === 'prim' || currentAlgo.id === 'kruskal') {
      if (dsuSets && Object.keys(dsuSets).length > 0) {
        const root = Object.entries(dsuSets).find(([r, members]) => members.includes(nId))?.[0];
        if (root) {
          return {
            text: `set: {${root}}`,
            color: isCur ? '#AB526B' : '#0D9488',
            border: '#5EEAD4',
            textColor: '#FFFFFF',
            icon: '🌳'
          };
        }
      }
      if (isPth) {
        return {
          text: 'in MST',
          color: '#059669',
          border: '#34D399',
          textColor: '#FFFFFF',
          icon: '🌲'
        };
      }
    }

    // 4. Bipartite Coloring
    if (nodeColors && nodeColors[nId] && nodeColors[nId] !== 'UNCOLORED') {
      const col = nodeColors[nId];
      return {
        text: `Color: ${col}`,
        color: col === 'RED' ? '#DC2626' : '#2563EB',
        border: col === 'RED' ? '#F87171' : '#60A5FA',
        textColor: '#FFFFFF',
        icon: '🎨'
      };
    }

    // 5. General DFS / BFS / Traversal: Visit Sequence Number
    if (visitedSequence && visitedSequence.includes(nId)) {
      const order = visitedSequence.indexOf(nId) + 1;
      return {
        text: `visit: #${order}`,
        color: isCur ? '#AB526B' : isPth ? '#059669' : '#475569',
        border: isCur ? '#FCA5A5' : isPth ? '#34D399' : '#94A3B8',
        textColor: '#FFFFFF',
        icon: isCur ? '👑' : '✓'
      };
    }

    // 6. Active / Probing / Start
    if (isCur) {
      return {
        text: 'CURRENT',
        color: '#AB526B',
        border: '#FCA5A5',
        textColor: '#FFFFFF',
        icon: '👑'
      };
    }
    if (isPrb) {
      return {
        text: 'PROBING',
        color: '#D97706',
        border: '#FDE68A',
        textColor: '#FFFFFF',
        icon: '👀'
      };
    }
    if (nId === startNode) {
      return {
        text: 'START',
        color: '#6366F1',
        border: '#A5B4FC',
        textColor: '#FFFFFF',
        icon: '🏁'
      };
    }

    return null;
  };

  const [probingNode, setProbingNode] = useState(null);
  const [visitedSet, setVisitedSet] = useState(new Set());
  const [visitedSequence, setVisitedSequence] = useState([]);
  const [visitedTable, setVisitedTable] = useState({});
  const [queueState, setQueueState] = useState([]);
  const [stackState, setStackState] = useState([]);
  const [priorityQueueState, setPriorityQueueState] = useState([]);
  const [distanceMap, setDistanceMap] = useState({});
  const [inDegreeMap, setInDegreeMap] = useState({});
  const [topoOrder, setTopoOrder] = useState([]);
  const [nodeColors, setNodeColors] = useState({});
  const [activeEdge, setActiveEdge] = useState(null);
  const [highlightedPathEdges, setHighlightedPathEdges] = useState(new Set());
  const [highlightedPathNodes, setHighlightedPathNodes] = useState(new Set());
  const [kruskalEdgesState, setKruskalEdgesState] = useState([]);
  const [mstCost, setMstCost] = useState(0);
  const [dsuSets, setDsuSets] = useState({});
  const [activeCodeLine, setActiveCodeLine] = useState(-1);
  
  // ELI5 Explanation State (Intuitive 3-Field Inspector)
  const [explanation, setExplanation] = useState({
    title: `Simulate ${currentAlgo.name}`,
    action: `Ready to run ${currentAlgo.name}. Click 'Simulate' to start step-by-step visual animation.`,
    why: currentAlgo.desc,
    next: `Choose start vertex or press Simulate to see queue, stack, and visited state evolve live.`,
    badge: 'IDLE'
  });

  const [consoleLogs, setConsoleLogs] = useState([
    { msg: `> ${currentAlgo.name} engine initialized.`, isError: false }
  ]);

  const log = (msg, isError = false) => {
    setConsoleLogs(prev => [...prev, { msg, isError }].slice(-20));
  };

  const timerRef = useRef(null);

  // Build initial visited table with all nodes false
  const getInitialVisitedTable = (nodes) => {
    const tbl = {};
    nodes.forEach(n => { tbl[n.id] = false; });
    return tbl;
  };

  // Synchronize topology with algorithm selection
  useEffect(() => {
    handleReset();
    let preferredTopo = 'standard';
    if (currentAlgo.id === 'toposort') preferredTopo = 'dag';
    else if (currentAlgo.id === 'cycle' || currentAlgo.id === 'tarjan_scc' || currentAlgo.id === 'kosaraju') preferredTopo = 'cyclic';
    else if (currentAlgo.id === 'bipartite') preferredTopo = 'bipartite';

    setSelectedTopologyKey(preferredTopo);
    const newGraph = PRESET_TOPOLOGIES[preferredTopo];
    setGraphData(newGraph);
    setStartNode(newGraph.nodes[0]?.id || 'A');
    setTargetNode(newGraph.nodes[newGraph.nodes.length - 1]?.id || 'F');
    setVisitedTable(getInitialVisitedTable(newGraph.nodes));
    log(`> Switched model to ${currentAlgo.name} on ${newGraph.name}.`);
  }, [currentAlgo.id]);

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIdx < animationSteps.length - 1) {
        timerRef.current = setTimeout(() => {
          applyStep(currentStepIdx + 1);
        }, Math.max(120, Math.round(650 / playbackSpeed)));
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIdx, animationSteps, playbackSpeed]);

  const applyStep = (idx) => {
    if (!animationSteps[idx]) return;
    const s = animationSteps[idx];
    setCurrentStepIdx(idx);
    if (s.activeNode !== undefined) setActiveNode(s.activeNode);
    if (s.probingNode !== undefined) setProbingNode(s.probingNode);
    if (s.visitedSet) setVisitedSet(new Set(s.visitedSet));
    if (s.visitedSequence) setVisitedSequence([...s.visitedSequence]);
    if (s.visitedTable) setVisitedTable({ ...s.visitedTable });
    if (s.queueState !== undefined) setQueueState(s.queueState);
    if (s.stackState !== undefined) setStackState(s.stackState);
    if (s.priorityQueueState !== undefined) setPriorityQueueState(s.priorityQueueState);
    if (s.distanceMap) setDistanceMap(s.distanceMap);
    if (s.inDegreeMap) setInDegreeMap(s.inDegreeMap);
    if (s.topoOrder) setTopoOrder(s.topoOrder);
    if (s.nodeColors) setNodeColors(s.nodeColors);
    if (s.activeEdge !== undefined) setActiveEdge(s.activeEdge);
    if (s.pathEdges && s.pathEdges.length > 0) {
      setHighlightedPathEdges(new Set(s.pathEdges));
      if (s.pathNodes && s.pathNodes.length > 0) {
        setHighlightedPathNodes(new Set(s.pathNodes));
      } else {
        const pNodes = new Set();
        s.pathEdges.forEach(pe => {
          const parts = pe.split('-');
          if (parts[0]) pNodes.add(parts[0]);
          if (parts[1]) pNodes.add(parts[1]);
        });
        setHighlightedPathNodes(pNodes);
      }
    } else {
      setHighlightedPathEdges(new Set());
    setHighlightedPathNodes(new Set());
      setHighlightedPathNodes(new Set());
    }
    if (s.kruskalEdges !== undefined) setKruskalEdgesState(s.kruskalEdges);
    if (s.mstCost !== undefined) setMstCost(s.mstCost);
    if (s.dsuSets !== undefined) setDsuSets(s.dsuSets);
    if (s.codeLine !== undefined) setActiveCodeLine(s.codeLine);
    if (s.explanation) setExplanation(s.explanation);
    if (s.log) log(s.log, s.isError);
  };

  const handleReset = () => {
    setIsPlaying(false);
    clearTimeout(timerRef.current);
    setCurrentStepIdx(0);
    setActiveNode(null);
    setProbingNode(null);
    setVisitedSet(new Set());
    setVisitedSequence([]);
    setVisitedTable(getInitialVisitedTable(graphData.nodes));
    setQueueState([]);
    setStackState([]);
    setPriorityQueueState([]);
    setDistanceMap({});
    setInDegreeMap({});
    setTopoOrder([]);
    setNodeColors({});
    setActiveEdge(null);
    setHighlightedPathEdges(new Set());
    setKruskalEdgesState([]);
    setMstCost(0);
    setDsuSets({});
    setActiveCodeLine(-1);
    setExplanation({
      title: `Reset: ${currentAlgo.name}`,
      action: `Visualizer reset to initial graph state.`,
      why: `Select start node or topology, then press Simulate to begin step-by-step animation.`,
      next: `Press Simulate ${currentAlgo.name.split(' ')[0]} to start.`,
      badge: 'RESET'
    });
    log('> Graph visualizer reset.');
  };

  // Helper adjacency builder
  const buildAdjacency = () => {
    const adj = {};
    graphData.nodes.forEach(n => adj[n.id] = []);
    graphData.edges.forEach(e => {
      adj[e.u]?.push({ v: e.v, weight: e.weight || 1 });
      if (!graphData.isDirected) {
        adj[e.v]?.push({ v: e.u, weight: e.weight || 1 });
      }
    });
    return adj;
  };

  // ========================================================
  // 1. KRUSKAL'S MST GENERATOR (DSU / UNION-FIND)
  // ========================================================
  const generateKruskal = () => {
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

    setAnimationSteps(steps);
    setCurrentStepIdx(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // ========================================================
  // 2. PRIM'S MST GENERATOR (Cut-Edge Priority Queue)
  // ========================================================
  const generatePrim = () => {
    const steps = [];
    const adj = buildAdjacency();
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

    setAnimationSteps(steps);
    setCurrentStepIdx(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // ========================================================
  // 3. BFS GENERATOR (Animated FIFO Queue + Visited Set)
  // ========================================================
  const generateBFS = () => {
    const steps = [];
    const adj = buildAdjacency();
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

    setAnimationSteps(steps);
    setCurrentStepIdx(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // ========================================================
  // 4. DFS GENERATOR (Animated LIFO Call Stack + Visited Set)
  // ========================================================
  const generateDFS = () => {
    const steps = [];
    const adj = buildAdjacency();
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

    setAnimationSteps(steps);
    setCurrentStepIdx(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // ========================================================
  // 5. DIJKSTRA'S GENERATOR (Priority Queue + Distance Table)
  // ========================================================
  const generateDijkstra = () => {
    const steps = [];
    const adj = buildAdjacency();
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

    setAnimationSteps(steps);
    setCurrentStepIdx(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // ========================================================
  // 6. TOPOLOGICAL SORT (Kahn's In-Degree Algorithm)
  // ========================================================
  const generateTopoSort = () => {
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

    setAnimationSteps(steps);
    setCurrentStepIdx(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // ========================================================
  // 7. CYCLE DETECTION (3-Color DFS)
  // ========================================================
  const generateCycleDetection = () => {
    const steps = [];
    const adj = buildAdjacency();
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

    setAnimationSteps(steps);
    setCurrentStepIdx(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // ========================================================
  // 8. BIPARTITE GRAPH CHECK (2-Coloring)
  // ========================================================
  const generateBipartite = () => {
    const steps = [];
    const adj = buildAdjacency();
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

    setAnimationSteps(steps);
    setCurrentStepIdx(0);
    applyStep(0);
    setIsPlaying(true);
  };

  // Universal Dispatcher
  const handleExecute = () => {
    handleReset();
    switch (currentAlgo.id) {
      case 'kruskal': generateKruskal(); break;
      case 'prim': generatePrim(); break;
      case 'bfs': generateBFS(); break;
      case 'dfs': generateDFS(); break;
      case 'dijkstra': generateDijkstra(); break;
      case 'toposort': generateTopoSort(); break;
      case 'cycle': generateCycleDetection(); break;
      case 'bipartite': generateBipartite(); break;
      default: generateBFS(); break;
    }
  };

  const currentCode = GRAPH_CODE_SNIPPETS[currentAlgo.codeId] || GRAPH_CODE_SNIPPETS.kruskal || GRAPH_CODE_SNIPPETS.bfs;


  // Convert Graph active state into formatted cards for DryRunVariableTracker
  const trackedVariables = useMemo(() => {
    const vars = [];
    const s = animationSteps[currentStepIdx] || {};

    if (activeNode) {
      vars.push({
        name: 'activeNode (u)',
        value: activeNode,
        type: 'Vertex',
        role: 'Current vertex being expanded',
        isChanged: true
      });
    }

    if (probingNode) {
      vars.push({
        name: 'probingNode (v)',
        value: probingNode,
        type: 'Vertex',
        role: 'Adjacent neighbor being inspected',
        isChanged: true
      });
    }

    if (activeEdge) {
      const edgeLabel = typeof activeEdge === 'string'
        ? activeEdge
        : `${activeEdge.u} ➔ ${activeEdge.v}${activeEdge.weight !== undefined ? ` (w: ${activeEdge.weight})` : ''}`;
      vars.push({
        name: 'activeEdge',
        value: edgeLabel,
        type: 'Edge',
        role: 'Edge being relaxed / explored'
      });
    }

    if (visitedSet && visitedSet.size > 0) {
      vars.push({
        name: 'visitedSet',
        value: `{ ${Array.from(visitedSet).join(', ')} }`,
        type: 'Set',
        role: 'Set of processed vertices'
      });
    }

    if (queueState && queueState.length > 0) {
      vars.push({
        name: 'BFS Queue',
        value: `[ ${queueState.join(', ')} ]`,
        type: 'Queue',
        role: 'FIFO queue of pending vertices',
        isChanged: true
      });
    }

    if (stackState && stackState.length > 0) {
      vars.push({
        name: 'DFS Stack',
        value: `[ ${stackState.join(', ')} ]`,
        type: 'Stack',
        role: 'LIFO stack of pending vertices',
        isChanged: true
      });
    }

    if (priorityQueueState && priorityQueueState.length > 0) {
      vars.push({
        name: 'PriorityQueue (Min)',
        value: `[ ${priorityQueueState.map(item => `${item.node ?? item.id}:${item.dist ?? item.weight ?? ''}`).join(', ')} ]`,
        type: 'Heap',
        role: 'Greedy frontier for shortest path / MST',
        isChanged: true
      });
    }

    if (mstCost !== undefined && mstCost !== null) {
      vars.push({
        name: 'mstCost',
        value: mstCost,
        type: 'Cost',
        role: 'Total accumulated MST weight'
      });
    }

    vars.push({
      name: 'totalNodes',
      value: graphData?.nodes?.length || 0,
      type: 'Count',
      role: 'Vertex cardinality |V|'
    });

    return vars;
  }, [animationSteps, currentStepIdx, activeNode, probingNode, activeEdge, visitedSet, queueState, stackState, priorityQueueState, mstCost, graphData?.nodes?.length]);

  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      subtitle={currentAlgo.desc}
      currentPath={`/visualizer/graph/${currentAlgo.id}`}
      category="ds"
      bannerAction={
        <div className="flex items-center gap-2">
          <Link
            to="/visualizer/graph"
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#AB526B] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Graph Suite</span>
          </Link>
          <ComplexityBadge complexity={currentAlgo.complexity} />
        </div>
      }
      controls={
        <div className="flex flex-col gap-3.5">
          
          {/* Algorithm Model Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Select Algorithm Model
            </label>
            <div className="relative">
              <select
                value={currentAlgo.id}
                onChange={(e) => navigate(`/visualizer/graph/${e.target.value}`)}
                className="w-full appearance-none bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#AB526B] cursor-pointer"
              >
                {GRAPH_CATALOG.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.tag})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Topology Preset Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Network Topology Preset
            </label>
            <div className="relative">
              <select
                value={selectedTopologyKey}
                onChange={(e) => {
                  setSelectedTopologyKey(e.target.value);
                  const newGraph = PRESET_TOPOLOGIES[e.target.value];
                  setGraphData(newGraph);
                  setStartNode(newGraph.nodes[0]?.id || 'A');
                  setTargetNode(newGraph.nodes[newGraph.nodes.length - 1]?.id || 'F');
                  setVisitedTable(getInitialVisitedTable(newGraph.nodes));
                  handleReset();
                }}
                className="w-full appearance-none bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#AB526B] cursor-pointer"
              >
                {Object.entries(PRESET_TOPOLOGIES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none text-gray-400" />
            </div>
          </div>

          {/* Start & Goal Node Selectors */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Start Vertex</label>
              <select
                value={startNode}
                onChange={(e) => { setStartNode(e.target.value); handleReset(); }}
                className="bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {graphData.nodes.map(n => <option key={n.id} value={n.id}>Node {n.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Target Goal</label>
              <select
                value={targetNode}
                onChange={(e) => { setTargetNode(e.target.value); handleReset(); }}
                className="bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {graphData.nodes.map(n => <option key={n.id} value={n.id}>Node {n.label}</option>)}
              </select>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleExecute}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#AB526B] hover:bg-[#A33D46] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Play size={14} fill="currentColor" />
              <span>Simulate {currentAlgo.name.split(' ')[0]}</span>
            </button>
            <button
              onClick={handleReset}
              title="Reset Visualizer"
              className="p-2.5 bg-gray-100 dark:bg-[#202020] border border-gray-200 dark:border-[#5C4E49] rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors shrink-0"
            >
              <RotateCcw size={14} />
            </button>
          </div>

        </div>
      }
      playback={
        <VisualizerPlaybackBar
          currentStep={currentStepIdx}
          totalSteps={animationSteps.length}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onReset={handleReset}
          onStepForward={() => {
            if (currentStepIdx < animationSteps.length - 1) {
              applyStep(currentStepIdx + 1);
            }
          }}
          onStepBackward={() => {
            if (currentStepIdx > 0) {
              applyStep(currentStepIdx - 1);
            }
          }}
          speed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          stepDescription={explanation.action || ''}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        />
      }
      codeInspector={null}
      consoleOutput={consoleLogs}
      rightPanel={
        <div className="flex flex-col gap-3 h-full">
          {/* Top Tabs: Queue vs Linked List */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl">
            <button
              onClick={() => setRightPanelTab('queue')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'queue'
                  ? 'bg-white dark:bg-[#5C4E49] text-[#AB526B] dark:text-red-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <span>📥</span>
              <span>Queues (FIFO)</span>
              {(queueState.length > 0 || priorityQueueState.length > 0) && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-100 dark:bg-red-950/80 text-[10px] font-mono text-red-700 dark:text-red-300">
                  {priorityQueueState.length || queueState.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setRightPanelTab('linkedlist')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'linkedlist'
                  ? 'bg-white dark:bg-[#5C4E49] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <span>🔗</span>
              <span>Linked List (Adjacency)</span>
              {visitedSequence.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                  {visitedSequence.length}
                </span>
              )}
            </button>
          </div>

          {/* Active Tab View */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3">
            {rightPanelTab === 'queue' ? (
              <SimpleQueueDiagram
                queue={
                  priorityQueueState.length > 0
                    ? priorityQueueState.map(item => (typeof item === 'object' ? `${item.node || item.val} (d:${item.dist ?? item.priority})` : item))
                    : queueState.length > 0
                    ? queueState
                    : stackState.length > 0
                    ? stackState
                    : []
                }
                activeVal={activeNode}
              />
            ) : (
              <SimpleLinkedListDiagram
                adjacencyList={adjacencyList}
                activeNode={activeNode}
                probingNode={probingNode}
                visitedSequence={visitedSequence}
              />
            )}

            {/* Clean Action & Step Pill with Math and Teacher Decision */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-[#282828] shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {explanation.title || currentAlgo.name}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-[10px] font-mono font-bold text-gray-600 dark:text-gray-300">
                  Step {animationSteps.length > 0 ? currentStepIdx + 1 : 1}/{Math.max(1, animationSteps.length)}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans font-medium">
                {explanation.action || 'Ready to run step-by-step traversal.'}
              </p>
              {explanation.math && (
                <div className="p-2 rounded-lg bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/40 text-amber-900 dark:text-amber-200 font-mono text-[11px] font-bold">
                  🧮 {explanation.math}
                </div>
              )}
              {explanation.why && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-black/20 p-2 rounded-lg border border-gray-100 dark:border-white/5">
                  💡 {explanation.why}
                </p>
              )}
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full h-full flex flex-col p-2 sm:p-4 overflow-hidden">
        {/* ================================================================= */}
        {/* HERO GRAPH CANVAS (UNOBSTRUCTED, LARGE, CINEMATIC VIEW)           */}
        {/* ================================================================= */}
        <div className="relative w-full h-full flex-1 min-h-[520px] bg-slate-50/60 dark:bg-[#12131a] rounded-3xl border border-[#EBE0D3] dark:border-[#282828] shadow-xl overflow-hidden flex flex-col">
          
          {/* Minimal Floating Step Action Pill (Top Left - Zero Clutter) */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/85 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-md pointer-events-none select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-800 dark:text-gray-100 font-sans">
              {explanation.action || currentAlgo.name}
            </span>
            <span className="text-[10px] font-mono font-bold text-gray-400 pl-2 border-l border-gray-200 dark:border-white/10">
              Step {animationSteps.length > 0 ? currentStepIdx + 1 : 1}/{Math.max(1, animationSteps.length)}
            </span>
          </div>

          {/* Concept Guide Button (Top Right) */}
          <button
            onClick={() => setShowIntuitionModal(true)}
            className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/85 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-md text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-amber-500 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            <span>💡</span>
            <span>Concept</span>
          </button>

          {/* The Large, Immersive SVG Canvas */}
          <div className="w-full flex-1 min-h-0 flex items-center justify-center p-2">
            <svg
              viewBox="0 0 900 540"
              className="w-full h-full max-h-[78vh] select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* High-Tech Glow Filters */}
                <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="emeraldGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Gradients for Nodes */}
                <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#BE123C" />
                </linearGradient>
                <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                {/* Pixel-Perfect Arrowheads (userSpaceOnUse: Exact 14px size, positioned exactly at node boundary) */}
                <marker id="arrowhead" markerWidth="14" markerHeight="14" refX="35" refY="7" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 2 L 12 7 L 1 12 z" fill="#64748B" />
                </marker>
                <marker id="arrowhead-active" markerWidth="16" markerHeight="16" refX="35" refY="8" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 2 L 14 8 L 1 14 z" fill="#F43F5E" />
                </marker>
                <marker id="arrowhead-path" markerWidth="16" markerHeight="16" refX="35" refY="8" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 2 L 14 8 L 1 14 z" fill="#10B981" />
                </marker>
                <marker id="arrowhead-reject" markerWidth="14" markerHeight="14" refX="35" refY="7" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M 1 2 L 12 7 L 1 12 z" fill="#EF4444" />
                </marker>
              </defs>

              {/* Render Graph Edges */}
              {graphData.edges.map((edge, idx) => {
                const uNode = graphData.nodes.find(n => n.id === edge.u);
                const vNode = graphData.nodes.find(n => n.id === edge.v);
                if (!uNode || !vNode) return null;

                const edgeKey = `${edge.u}-${edge.v}`;
                const reverseKey = `${edge.v}-${edge.u}`;

                // Active State (currently being inspected)
                const isActive = activeEdge === edgeKey || activeEdge === reverseKey;
                const isRejected = isActive && animationSteps[currentStepIdx]?.isRejected;

                // Path State (accepted in MST, shortest path, or traversal tree)
                const isPath = highlightedPathEdges.has(edgeKey) || highlightedPathEdges.has(reverseKey);
                const isTraversed = accumulatedTraversedEdges.has(edgeKey) || accumulatedTraversedEdges.has(reverseKey);

                // Determine correct source -> target alignment for active traversal
                const isTraversingReverse = isActive ? activeEdge === reverseKey : (isPath && highlightedPathEdges.has(reverseKey) && !highlightedPathEdges.has(edgeKey));
                const sourceNode = isTraversingReverse ? vNode : uNode;
                const targetNode = isTraversingReverse ? uNode : vNode;

                const midX = (uNode.x + vNode.x) / 2;
                const midY = (uNode.y + vNode.y) / 2;

                // Marker selection
                const edgeMarker = isActive
                  ? (isRejected ? 'url(#arrowhead-reject)' : 'url(#arrowhead-active)')
                  : (isPath || isTraversed)
                  ? 'url(#arrowhead-path)'
                  : graphData.isDirected
                  ? 'url(#arrowhead)'
                  : undefined;

                return (
                  <g key={`graph-edge-${idx}`}>
                    {/* Active Laser Glow Conduit */}
                    {isActive && !isRejected && (
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke="#F43F5E"
                        strokeWidth={9}
                        opacity={0.4}
                        filter="url(#laserGlow)"
                      />
                    )}

                    {/* Confirmed Path Emerald Glow Conduit */}
                    {(isPath || isTraversed) && !isActive && (
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke="#10B981"
                        strokeWidth={7}
                        opacity={0.3}
                        filter="url(#emeraldGlow)"
                      />
                    )}

                    {/* Main Edge Line */}
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={
                        isActive 
                          ? (isRejected ? '#EF4444' : '#F43F5E')
                          : (isPath || isTraversed)
                          ? '#10B981' 
                          : '#CBD5E1'
                      }
                      strokeWidth={isActive ? 4.5 : (isPath || isTraversed) ? 4 : 2.5}
                      strokeDasharray={
                        isRejected 
                          ? '6 4' 
                          : isActive 
                          ? '10 5' 
                          : 'none'
                      }
                      markerEnd={edgeMarker}
                      className="transition-colors duration-200"
                    />

                    {/* High-Speed Traveling Photon Beam along Active Edge */}
                    {isActive && !isRejected && (
                      <g>
                        <circle r="6.5" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="2.5" filter="url(#laserGlow)">
                          <animateMotion
                            path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                            dur="0.55s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        <circle r="3.5" fill="#FDA4AF" opacity={0.75}>
                          <animateMotion
                            path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                            dur="0.55s"
                            begin="0.12s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    )}

                    {/* Ambient Flow Particle along Confirmed Route */}
                    {(isPath || isTraversed) && !isActive && (
                      <circle r="3.5" fill="#34D399" opacity={0.65} filter="url(#emeraldGlow)">
                        <animateMotion
                          path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                          dur="2.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Edge Weight Pill */}
                    {edge.weight !== undefined && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-14"
                          y="-10"
                          width="28"
                          height="20"
                          rx="7"
                          fill="#FFFFFF"
                          className="dark:fill-[#1E1E1E] stroke-gray-300 dark:stroke-[#333] shadow-md"
                          strokeWidth="1.5"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="11"
                          fontWeight="bold"
                          fill={isPath || isTraversed ? '#059669' : isActive ? '#F43F5E' : '#64748B'}
                          className="font-mono select-none"
                        >
                          {edge.weight}
                        </text>
                      </g>
                    )}

                    {/* Live Arithmetic / Inspection Callout directly on Active Edge */}
                    {isActive && (explanation.math || explanation.badge) && (
                      <g transform={`translate(${midX}, ${midY - 28})`} className="pointer-events-none select-none">
                        <rect
                          x={-(Math.min((explanation.math || explanation.badge).length, 36) * 3.6 + 14)}
                          y="-12"
                          width={Math.min((explanation.math || explanation.badge).length, 36) * 7.2 + 28}
                          height="24"
                          rx="8"
                          fill="#0F172A"
                          stroke={isRejected ? '#EF4444' : '#F43F5E'}
                          strokeWidth="1.8"
                          className="shadow-2xl"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="900"
                          fill={isRejected ? '#FCA5A5' : '#FFFFFF'}
                        >
                          {explanation.math ? (
                            explanation.math.length > 36 ? explanation.math.slice(0, 34) + '…' : explanation.math
                          ) : (
                            isRejected ? `⚠️ ${explanation.badge}` : `⚡ ${explanation.badge}`
                          )}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Render Graph Nodes (Bigger, Vibrant, Animated) */}
              {graphData.nodes.map((node) => {
                const isCurrent = activeNode === node.id;
                const isProbing = probingNode === node.id;
                const isVisited = visitedSet.has(node.id);
                const isStart = startNode === node.id;
                const isPathNode = highlightedPathNodes.has(node.id);
                const inQueue = queueState.includes(node.id);
                const inStack = stackState.includes(node.id);
                const nodeColorVal = nodeColors[node.id];

                return (
                  <g
                    key={`graph-node-${node.id}`}
                    onClick={() => {
                      setStartNode(node.id);
                      handleReset();
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Active Frontier Expanding Shockwave */}
                    {isCurrent && (
                      <>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="44"
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth="2.5"
                          className="animate-ping opacity-50 pointer-events-none"
                          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="35"
                          fill="none"
                          stroke="#F43F5E"
                          strokeWidth="3"
                          opacity="0.85"
                          filter="url(#laserGlow)"
                          className="pointer-events-none"
                        />
                      </>
                    )}

                    {/* Probed Neighbor Amber Orbit Ring */}
                    {isProbing && !isCurrent && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="37"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                        strokeDasharray="6 3"
                        className="opacity-90 pointer-events-none animate-pulse"
                      />
                    )}

                    {/* Start Vertex Marker Halo */}
                    {isStart && !isCurrent && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="35"
                        fill="none"
                        stroke="#6366F1"
                        strokeWidth="2.5"
                        strokeDasharray="5 3"
                      />
                    )}

                    {/* Path Vertex Radiant Halo */}
                    {isPathNode && !isCurrent && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="35"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        opacity="0.75"
                        filter="url(#emeraldGlow)"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Main Node Circle (r=28) */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      fill={
                        isCurrent 
                          ? 'url(#laserGrad)' 
                          : isProbing 
                          ? '#F59E0B' 
                          : (isPathNode || isVisited) 
                          ? 'url(#emeraldGrad)' 
                          : inQueue || inStack
                          ? '#D97706'
                          : '#1E293B'
                      }
                      stroke={
                        isCurrent 
                          ? '#FFFFFF' 
                          : isProbing 
                          ? '#FEF08A' 
                          : (isPathNode || isVisited) 
                          ? '#A7F3D0' 
                          : '#475569'
                      }
                      strokeWidth={isCurrent || isProbing ? '3.5' : isPathNode ? '3.5' : '2.5'}
                      filter={isCurrent ? 'url(#laserGlow)' : (isPathNode || isVisited) ? 'url(#emeraldGlow)' : 'none'}
                      className="transition-colors duration-200 shadow-xl group-hover:scale-105"
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />

                    {/* Node Text Label (High Contrast) */}
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="15"
                      fontWeight="900"
                      fill="#FFFFFF"
                      className="select-none pointer-events-none font-mono"
                    >
                      {node.label}
                    </text>

                    {/* Unified Calculation Value Stored Above Node */}
                    {(() => {
                      const calc = getNodeCalculationBadge(node);
                      if (!calc) return null;
                      return (
                        <g transform={`translate(${node.x}, ${node.y - 42})`} className="pointer-events-none select-none">
                          {/* Connecting stem line to node */}
                          <line x1="0" y1="12" x2="0" y2="28" stroke="#64748B" strokeWidth="1.5" strokeDasharray="2 2" />
                          <rect
                            x={-(Math.min(calc.text.length, 18) * 3.6 + 10)}
                            y="-11"
                            width={Math.min(calc.text.length, 18) * 7.2 + 20}
                            height="22"
                            rx="8"
                            fill="#0F172A"
                            stroke={calc.border}
                            strokeWidth="1.6"
                            className="shadow-md"
                          />
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="10.5"
                            fontFamily="monospace"
                            fontWeight="800"
                            fill={calc.color}
                          >
                            {calc.text}
                          </text>
                        </g>
                      );
                    })()}

                    {/* Visited Checkmark Badge on Node Shoulder */}
                    {isVisited && !isCurrent && (
                      <g transform={`translate(${node.x + 18}, ${node.y - 18})`} className="pointer-events-none select-none">
                        <circle r="9" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" filter="url(#emeraldGlow)" />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="10"
                          fontWeight="900"
                          fill="#FFFFFF"
                        >
                          ✓
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Minimal Interactive Legend Ribbon at Canvas Bottom */}
          <div className="w-full flex items-center justify-between px-4 py-2 bg-white/70 dark:bg-black/40 border-t border-gray-200/80 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 select-none shrink-0">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#AB526B]" />
                <span>Active: <strong className="text-gray-800 dark:text-gray-200">{activeNode || 'None'}</strong></span>
              </span>
              {probingNode && (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span>Probing: [{probingNode}]</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span>Visited: <strong className="text-gray-800 dark:text-gray-200">{visitedSet.size}/{graphData.nodes.length}</strong></span>
              </span>
              {highlightedPathEdges.size > 0 && (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>🛣️ Path: {highlightedPathEdges.size} Edges</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-gray-400">
                Click any node to set Start
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* OPTIONAL MODAL FOR CONCEPT & ELI5 GUIDE (CLEAN & NON-INTRUSIVE)   */}
        {/* ================================================================= */}
        {showIntuitionModal && GRAPH_INTUITIONS[currentAlgo.id] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl p-6 bg-white dark:bg-[#423834] border border-amber-500/40 rounded-3xl shadow-2xl text-white flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-amber-400 font-sans font-black text-base">
                  <span className="text-xl">💡</span>
                  <span>{GRAPH_INTUITIONS[currentAlgo.id].name} — Concept Guide</span>
                </div>
                <button
                  onClick={() => setShowIntuitionModal(false)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="flex flex-col gap-3.5 max-h-[70vh] overflow-y-auto pr-1">
                {/* 1. Mental Model */}
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-xs font-mono font-black text-cyan-400 flex items-center gap-1.5">
                    <span>🧠</span>
                    <span>Real-World Mental Model (ELI5)</span>
                  </span>
                  <p className="text-xs text-[#2D1F23] dark:text-[#F0E2A4] leading-relaxed font-sans">
                    {GRAPH_INTUITIONS[currentAlgo.id].analogy}
                  </p>
                  <div className="mt-1 pt-1.5 border-t border-white/10 text-xs text-gray-500 dark:text-[#BCA297] italic">
                    {GRAPH_INTUITIONS[currentAlgo.id].concept}
                  </div>
                </div>

                {/* 2. Golden Rule */}
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-xs font-mono font-black text-emerald-400 flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>The 1 Golden Rule</span>
                  </span>
                  <p className="text-xs text-emerald-200 font-bold leading-snug font-sans">
                    {GRAPH_INTUITIONS[currentAlgo.id].goldenRule}
                  </p>
                  <div className="mt-1.5 flex flex-col gap-1 pt-1.5 border-t border-white/10">
                    {GRAPH_INTUITIONS[currentAlgo.id].steps.map((st, sIdx) => (
                      <span key={sIdx} className="text-xs text-[#2D1F23] dark:text-[#F0E2A4] font-mono leading-relaxed">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Why Data Structure */}
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1.5">
                  <span className="text-xs font-mono font-black text-amber-400 flex items-center gap-1.5">
                    <span>📦</span>
                    <span>Why This Data Structure?</span>
                  </span>
                  <p className="text-xs text-[#2D1F23] dark:text-[#F0E2A4] leading-relaxed font-sans">
                    {GRAPH_INTUITIONS[currentAlgo.id].whyDataStructure}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsiveVisualizerShell>
  );
}
