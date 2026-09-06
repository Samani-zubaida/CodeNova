import React, { useState, useEffect, useRef } from 'react';
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

// Preset Network Topologies
const PRESET_TOPOLOGIES = {
  standard: {
    name: 'Standard Weighted Network (6 Vertices)',
    isDirected: false,
    nodes: [
      { id: 'A', x: 90, y: 120, label: 'A' },
      { id: 'B', x: 240, y: 65, label: 'B' },
      { id: 'C', x: 240, y: 250, label: 'C' },
      { id: 'D', x: 420, y: 75, label: 'D' },
      { id: 'E', x: 420, y: 260, label: 'E' },
      { id: 'F', x: 570, y: 165, label: 'F' },
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
      { id: '0', x: 90, y: 80, label: '0' },
      { id: '1', x: 90, y: 250, label: '1' },
      { id: '2', x: 280, y: 80, label: '2' },
      { id: '3', x: 280, y: 250, label: '3' },
      { id: '4', x: 480, y: 80, label: '4' },
      { id: '5', x: 480, y: 250, label: '5' },
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
      { id: 'A', x: 110, y: 80, label: 'A' },
      { id: 'B', x: 330, y: 80, label: 'B' },
      { id: 'C', x: 530, y: 165, label: 'C' },
      { id: 'D', x: 330, y: 250, label: 'D' },
      { id: 'E', x: 110, y: 250, label: 'E' },
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
      { id: 'U1', x: 160, y: 70, label: 'U1' },
      { id: 'U2', x: 160, y: 165, label: 'U2' },
      { id: 'U3', x: 160, y: 260, label: 'U3' },
      { id: 'V1', x: 500, y: 70, label: 'V1' },
      { id: 'V2', x: 500, y: 165, label: 'V2' },
      { id: 'V3', x: 500, y: 260, label: 'V3' },
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

  // VISUAL LIVE STATE: Queue, Stack, Visited, Distance, Edge Highlights
  const [activeNode, setActiveNode] = useState(null);
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
        }, 1200 / playbackSpeed);
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
    if (s.pathEdges) setHighlightedPathEdges(new Set(s.pathEdges));
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
      explanation: {
        title: `Step 1: Enqueue Starting Vertex [${startNode}]`,
        action: `Pushed [${startNode}] into the rear of our FIFO Queue. Marked vis[${startNode}] = true.`,
        why: "BFS explores layer-by-layer. We must initialize our queue with the starting frontier so we can explore its direct immediate neighbors first.",
        next: `Dequeue node [${startNode}] from front of queue to discover all its neighbors.`,
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
        explanation: {
          title: `Dequeued Node [${u}] from Front of Queue`,
          action: `Removed [${u}] from queue HEAD. Node [${u}] is now the ACTIVE FRONTIER vertex.`,
          why: "FIFO Queue (First-In, First-Out) ensures we finish processing all nodes at depth d before moving to depth d + 1.",
          next: `Inspect all adjacent neighbors of [${u}]. Any unvisited neighbor will be placed at the queue rear.`,
          badge: 'DEQUEUED'
        }
      });

      const neighbors = adj[u] || [];
      for (const { v } of neighbors) {
        const edgeKey = `${u}-${v}`;

        if (!visited.has(v)) {
          visited.add(v);
          queue.push(v);
          sequence.push(v);
          vTable[v] = true;

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
            explanation: {
              title: `Discovered Unvisited Neighbor [${v}] via (${u} ➔ ${v})`,
              action: `Added [${v}] to REAR of queue. Marked vis[${v}] = true to prevent duplicate visits.`,
              why: `Node [${v}] is a direct neighbor of [${u}] that has not been visited yet. Marking it visited now guarantees O(V + E) time efficiency.`,
              next: `Continue checking remaining neighbors of [${u}].`,
              badge: 'DISCOVERED'
            }
          });
        } else {
          steps.push({
            log: `    Neighbor [${v}] already visited. Skipping.`,
            codeLine: 7,
            activeNode: u,
            probingNode: v,
            activeEdge: edgeKey,
            visitedSet: Array.from(visited),
            visitedSequence: [...sequence],
            visitedTable: { ...vTable },
            queueState: [...queue],
            explanation: {
              title: `Neighbor [${v}] Already Visited (vis[${v}] = true)`,
              action: `Inspected edge (${u} ➔ ${v}). Skipped enqueueing [${v}].`,
              why: "Since [${v}] is already in our visited set, processing it again would cause an infinite cycle and waste computation.",
              next: `Move to next adjacent neighbor.`,
              badge: 'ALREADY VISITED'
            }
          });
        }
      }
    }

    steps.push({
      log: `🎉 BFS Traversal Complete! Order: ${sequence.join(' ➔ ')}.`,
      codeLine: 12,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      visitedSet: Array.from(visited),
      visitedSequence: [...sequence],
      visitedTable: { ...vTable },
      queueState: [],
      explanation: {
        title: `🎉 BFS Traversal Complete! Explored ${sequence.length} Vertices`,
        action: `Queue is empty. Traversal sequence: ${sequence.join(' ➔ ')}.`,
        why: "All reachable vertices from the start node have been fully explored in shortest-path-edge-count order.",
        next: "Traversal finished successfully.",
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
    const vTable = getInitialVisitedTable(graphData.nodes);

    function dfsVisit(u, parent = null) {
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
        explanation: {
          title: `Pushed Node [${u}] onto Call Stack (Depth: ${stack.length})`,
          action: `Active recursion frame created for [${u}]. Marked vis[${u}] = true.`,
          why: "DFS dives as deep as possible along each branch before backtracking. LIFO (Last-In, First-Out) call stack records our active search path.",
          next: `Look for the first unvisited neighbor of [${u}] to dive deeper immediately.`,
          badge: 'STACK PUSH'
        }
      });

      const neighbors = adj[u] || [];
      for (const { v } of neighbors) {
        if (!visited.has(v)) {
          dfsVisit(v, u);
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
        explanation: {
          title: `↩️ Backtracking from Node [${u}] (Popped Stack Frame)`,
          action: `All recursive paths through [${u}] have been fully explored. Popped [${u}] from top of stack.`,
          why: "When a vertex has no more unvisited neighbors, DFS returns to the parent caller on the stack to explore alternative branches.",
          next: stack.length > 0 ? `Resuming search at parent frame [${stack[stack.length - 1]}].` : "Call stack empty. DFS complete.",
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
      explanation: {
        title: `Step 1: DFS Initialized at Root [${startNode}]`,
        action: `Beginning Depth-First Search traversal from starting vertex [${startNode}].`,
        why: "DFS explores branch-by-branch, maintaining a recursion call stack to allow backtracking once dead ends are hit.",
        next: `Push starting node [${startNode}] onto the call stack.`,
        badge: 'INITIALIZE'
      }
    });

    dfsVisit(startNode);

    steps.push({
      log: `🎉 DFS Traversal Complete! Order: ${sequence.join(' ➔ ')}.`,
      codeLine: 6,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      visitedSet: Array.from(visited),
      visitedSequence: [...sequence],
      visitedTable: { ...vTable },
      stackState: [],
      explanation: {
        title: `🎉 DFS Traversal Complete! Explored ${sequence.length} Vertices`,
        action: `All branches explored. Traversal order: ${sequence.join(' ➔ ')}.`,
        why: "Depth-First Search systematically visited every reachable component with complete backtracking verification.",
        next: "Traversal finished.",
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
      explanation: {
        title: `Step 1: Distance Table Initialization`,
        action: `Set dist[${startNode}] = 0, and all other vertex distances to ∞ (Infinity). Enqueued (0, ${startNode}) in Min-Heap.`,
        why: "Dijkstra is a greedy shortest path algorithm. We start with distance 0 to our origin, and relax neighbor distances as better routes are discovered.",
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
        explanation: {
          title: `Settled Shortest Distance to Node [${u}]: dist = ${d}`,
          action: `Popped [${u}] from Min-Heap. Its shortest distance from [${startNode}] is now guaranteed to be ${d}.`,
          why: "Because all edge weights are non-negative, the smallest distance element in the Min-Heap can never be improved by any indirect path.",
          next: `Relax all outgoing edges from [${u}].`,
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
              explanation: {
                title: `✨ Edge Relaxation: dist[${v}] Lowered to ${alt}`,
                action: `Updated dist[${v}] = dist[${u}] (${dist[u]}) + weight (${weight}) = ${alt}. Enqueued (${alt}, ${v}) into Min-Heap.`,
                why: `The route through [${u}] (cost ${alt}) is strictly shorter than the previously recorded distance (${oldDist === Infinity ? '∞' : oldDist}).`,
                next: `Continue checking remaining neighbors of [${u}].`,
                badge: 'RELAXED'
              }
            });
          }
        }
      }
    }

    const path = [];
    let curr = targetNode;
    while (curr) {
      path.unshift(curr);
      curr = prev[curr];
    }

    const pathEdges = [];
    for (let i = 0; i < path.length - 1; i++) {
      pathEdges.push(`${path[i]}-${path[i+1]}`);
    }

    steps.push({
      log: `🎉 Dijkstra Complete! Shortest path to [${targetNode}] has distance = ${dist[targetNode]}.`,
      codeLine: 16,
      activeNode: null,
      probingNode: null,
      activeEdge: null,
      distanceMap: { ...dist },
      visitedSet: Array.from(visitedNodes),
      visitedTable: { ...vTable },
      pathEdges: pathEdges,
      explanation: {
        title: `🎉 Optimal Shortest Path Found to [${targetNode}]: Cost = ${dist[targetNode]}`,
        action: `Finalized Shortest Path: ${path.join(' ➔ ')}. Total cumulative distance: ${dist[targetNode]} units.`,
        why: "Dijkstra's greedy relaxation guarantees the globally optimal shortest route in non-negative weighted graphs.",
        next: "Shortest path highlighted in emerald green.",
        badge: 'SHORTEST PATH'
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
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#BC4A54] transition-colors"
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
                className="w-full appearance-none bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#BC4A54] cursor-pointer"
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
                className="w-full appearance-none bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#282828] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#BC4A54] cursor-pointer"
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
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#BC4A54] hover:bg-[#A33D46] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Play size={14} fill="currentColor" />
              <span>Simulate {currentAlgo.name.split(' ')[0]}</span>
            </button>
            <button
              onClick={handleReset}
              title="Reset Visualizer"
              className="p-2.5 bg-gray-100 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors shrink-0"
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
        />
      }
      codeInspector={
        <CodeInspector
          codeSnippets={currentCode}
          activeLine={activeCodeLine}
        />
      }
      consoleOutput={consoleLogs}
    >
      {/* ======================================================== */}
      {/* MAIN VISUAL CANVAS & INTUITIVE HUD SYSTEM               */}
      {/* ======================================================== */}
      <div className="relative w-full h-full flex flex-col items-center justify-start p-3 sm:p-5 overflow-y-auto gap-4">
        
        {/* ======================================================== */}
        {/* 1. ELI5 INTUITION HERO CARD: WHAT, WHY & WHAT'S NEXT     */}
        {/* ======================================================== */}
        <div className="w-full max-w-5xl bg-white dark:bg-[#151515] border border-[#EBE0D3] dark:border-[#282828] rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-[#222]">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#BC4A54]/10 text-[#BC4A54]">
                <Sparkles size={16} />
              </span>
              <h2 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                {explanation.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#BC4A54] text-white">
                {explanation.badge}
              </span>
              <span className="text-[11px] font-mono text-gray-400">
                Step {animationSteps.length > 0 ? currentStepIdx + 1 : 0} / {animationSteps.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
            {/* Action */}
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-gray-50/80 dark:bg-[#1C1C1C]/80 border border-gray-100 dark:border-[#252525]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <span>🎯 What's Happening</span>
              </span>
              <p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                {explanation.action}
              </p>
            </div>

            {/* Why (Intuition) */}
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <HelpCircle size={12} />
                <span>💡 Why It Happens (Intuition)</span>
              </span>
              <p className="text-xs text-amber-900 dark:text-amber-200/90 font-medium leading-relaxed">
                {explanation.why}
              </p>
            </div>

            {/* What's Next */}
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-900/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                <ArrowRight size={12} />
                <span>🔮 What Happens Next</span>
              </span>
              <p className="text-xs text-cyan-900 dark:text-cyan-200/90 font-medium leading-relaxed">
                {explanation.next}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. DEDICATED DATA STRUCTURE HUD: QUEUE vs STACK vs KRUSKAL */}
        {/* ======================================================== */}
        
        {/* CASE A: KRUSKAL'S DSU & SORTED EDGE HUD */}
        {currentAlgo.id === 'kruskal' && (
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* 1. MST Total Cost & Edge Count */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="uppercase tracking-wide">MST Total Weight</span>
                <GitCommit size={15} />
              </div>
              <div className="my-1.5 flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {mstCost}
                </span>
                <span className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-300/80">
                  units total
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 font-medium pt-1 border-t border-emerald-200 dark:border-emerald-900/50">
                <span>Edges in MST:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {kruskalEdgesState.filter(e => e.status === 'accepted').length} / {graphData.nodes.length - 1} required
                </span>
              </div>
            </div>

            {/* 2. DSU Disjoint Sets / Connected Components */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151515] border border-[#EBE0D3] dark:border-[#282828] flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
                <span className="flex items-center gap-1.5">
                  <Share2 size={14} className="text-[#BC4A54]" />
                  <span>DSU Components ({Object.keys(dsuSets).length} Sets)</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400">Union-Find</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 overflow-y-auto max-h-[64px]">
                {Object.keys(dsuSets).length === 0 ? (
                  <span className="text-xs text-gray-400 italic">DSU ready.</span>
                ) : (
                  Object.entries(dsuSets).map(([root, members], idx) => (
                    <div 
                      key={`comp-${root}`}
                      className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-[#202020] border border-gray-200 dark:border-[#333] text-[11px] font-mono flex items-center gap-1"
                    >
                      <span className="font-bold text-[#BC4A54]">Set {idx + 1}:</span>
                      <span>&#123; {members.join(', ')} &#125;</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. Sorted Edges Consideration Strip */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151515] border border-[#EBE0D3] dark:border-[#282828] flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
                <span>Sorted Edges (Ascending)</span>
                <span className="text-[10px] font-mono text-gray-400">{kruskalEdgesState.length} edges</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {kruskalEdgesState.map((e, idx) => (
                  <div
                    key={`k-edge-${idx}`}
                    className={`px-2 py-1 rounded-lg font-mono text-[10px] font-bold border shrink-0 transition-all flex items-center gap-1 ${
                      e.status === 'accepted'
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                        : e.status === 'rejected'
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-300 line-through opacity-60'
                        : e.status === 'evaluating'
                        ? 'bg-amber-500 text-white border-amber-400 ring-2 ring-amber-300 scale-105'
                        : 'bg-gray-50 dark:bg-[#202020] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#333]'
                    }`}
                  >
                    <span>{e.u}-{e.v}</span>
                    <span className="opacity-80">({e.weight})</span>
                    {e.status === 'accepted' && <span>✓</span>}
                    {e.status === 'rejected' && <span>✗</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASE B: PRIM'S MST HUD */}
        {currentAlgo.id === 'prim' && (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="uppercase tracking-wide">Prim MST Running Cost</span>
                <GitCommit size={15} />
              </div>
              <div className="my-1.5 flex items-baseline gap-1.5">
                <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {mstCost}
                </span>
                <span className="text-xs font-semibold text-emerald-700/80 dark:text-emerald-300/80">
                  units total
                </span>
              </div>
              <span className="text-[11px] text-gray-600 dark:text-gray-400">
                Connected Nodes: {visitedSet.size} / {graphData.nodes.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151515] border border-[#EBE0D3] dark:border-[#282828] flex flex-col gap-2 shadow-2xs">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Nodes Inside Growing Tree (`visited`)
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {Array.from(visitedSet).map((v, i) => (
                  <span key={`p-v-${i}`} className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-mono text-xs font-bold shadow-2xs">
                    Node {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASE C: BFS / TOPOSORT / BIPARTITE FIFO QUEUE HUD */}
        {(currentAlgo.id === 'bfs' || currentAlgo.id === 'toposort' || currentAlgo.id === 'bipartite') && (
          <div className="w-full max-w-5xl bg-white dark:bg-[#151515] border border-[#EBE0D3] dark:border-[#282828] rounded-2xl p-3.5 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-700 dark:text-cyan-400">
              <div className="flex items-center gap-1.5">
                <Activity size={15} className="text-cyan-500" />
                <span>FIFO Queue (First-In, First-Out Buffer)</span>
                <span className="px-1.5 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-[10px] font-mono">
                  Length: {queueState.length}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                Enqueue at REAR ➔ Dequeue from FRONT
              </span>
            </div>

            {/* Interactive Visual Queue Chamber */}
            <div className="relative flex items-center justify-between border-2 border-dashed border-cyan-300 dark:border-cyan-900/60 rounded-xl p-2 min-h-[52px] bg-cyan-50/40 dark:bg-cyan-950/20 overflow-x-auto gap-3">
              {/* Dequeue Exit Gate */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-600 text-white text-[10px] font-black tracking-wider uppercase shrink-0 shadow-xs">
                <span>◀ EXIT (DEQUEUE)</span>
              </div>

              {/* Elements in Queue */}
              <div className="flex items-center gap-2 flex-1 min-h-[36px]">
                <AnimatePresence mode="popLayout">
                  {queueState.length === 0 ? (
                    <span className="text-xs text-gray-400 italic mx-auto">
                      Queue is currently empty.
                    </span>
                  ) : (
                    queueState.map((qNode, idx) => (
                      <motion.div
                        key={`queue-item-${qNode}-${idx}`}
                        layout
                        initial={{ scale: 0.8, x: 30, opacity: 0 }}
                        animate={{ scale: 1, x: 0, opacity: 1 }}
                        exit={{ scale: 0.5, y: -20, opacity: 0 }}
                        className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 ${
                          idx === 0 
                            ? 'bg-cyan-500 text-white ring-2 ring-cyan-300 shadow-md' 
                            : 'bg-white dark:bg-[#222] text-gray-800 dark:text-gray-200 border border-cyan-200 dark:border-cyan-800'
                        }`}
                      >
                        <span className="text-xs">{qNode}</span>
                        {idx === 0 ? (
                          <span className="text-[8px] uppercase bg-cyan-800 text-cyan-100 px-1.5 py-0.5 rounded font-black">
                            HEAD
                          </span>
                        ) : (
                          <span className="text-[9px] opacity-60">
                            #{idx + 1}
                          </span>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Enqueue Entry Hopper */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-600 text-white text-[10px] font-black tracking-wider uppercase shrink-0 shadow-xs">
                <span>ENTRY (ENQUEUE) ◀</span>
              </div>
            </div>
          </div>
        )}

        {/* CASE D: DFS / CYCLE / STACK HUD */}
        {(currentAlgo.id === 'dfs' || currentAlgo.id === 'cycle') && (
          <div className="w-full max-w-5xl bg-white dark:bg-[#151515] border border-[#EBE0D3] dark:border-[#282828] rounded-2xl p-3.5 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400">
              <div className="flex items-center gap-1.5">
                <Layers size={15} className="text-purple-500" />
                <span>LIFO Call Stack (Last-In, First-Out Recursion Frames)</span>
                <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-[10px] font-mono">
                  Depth: {stackState.length}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                Top of Stack (Active Frame) ➔ Base (Root)
              </span>
            </div>

            <div className="relative flex items-center border-2 border-dashed border-purple-300 dark:border-purple-900/60 rounded-xl p-2 min-h-[52px] bg-purple-50/40 dark:bg-purple-950/20 overflow-x-auto gap-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-black tracking-wider uppercase shrink-0 shadow-xs">
                <span>▲ TOP (ACTIVE)</span>
              </div>

              <div className="flex items-center gap-2 flex-1 min-h-[36px]">
                <AnimatePresence mode="popLayout">
                  {stackState.length === 0 ? (
                    <span className="text-xs text-gray-400 italic mx-auto">
                      Call stack is empty (Idle).
                    </span>
                  ) : (
                    stackState.slice().reverse().map((sNode, idx) => (
                      <motion.div
                        key={`stack-item-${sNode}-${idx}`}
                        layout
                        initial={{ scale: 0.8, y: -20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.5, y: 20, opacity: 0 }}
                        className={`px-3 py-1.5 rounded-xl font-mono font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 ${
                          idx === 0 
                            ? 'bg-purple-600 text-white ring-2 ring-purple-300 shadow-md' 
                            : 'bg-white dark:bg-[#222] text-gray-800 dark:text-gray-200 border border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        <span className="text-xs">{sNode}</span>
                        {idx === 0 ? (
                          <span className="text-[8px] uppercase bg-purple-900 text-purple-100 px-1.5 py-0.5 rounded font-black">
                            FRAME
                          </span>
                        ) : (
                          <span className="text-[9px] opacity-60">
                            depth:{stackState.length - idx}
                          </span>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-600 text-white text-[10px] font-black tracking-wider uppercase shrink-0 shadow-xs">
                <span>BASE (MAIN)</span>
              </div>
            </div>
          </div>
        )}

        {/* CASE E: DIJKSTRA DISTANCE RELAXATION TABLE */}
        {currentAlgo.id === 'dijkstra' && (
          <div className="w-full max-w-5xl bg-white dark:bg-[#151515] border border-[#EBE0D3] dark:border-[#282828] rounded-2xl p-3.5 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>Shortest Distance Table (`dist[v]`)</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400">Target: Node [{targetNode}]</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {graphData.nodes.map(n => {
                const d = distanceMap[n.id];
                const isInf = d === undefined || d === Infinity;
                const isCurrent = activeNode === n.id;
                return (
                  <div
                    key={`dijk-card-${n.id}`}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-[#BC4A54] text-white border-[#BC4A54] shadow-md scale-105'
                        : !isInf
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200'
                        : 'bg-gray-50 dark:bg-[#1E1E1E] border-gray-200 dark:border-[#333] text-gray-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">Node {n.id}</span>
                    <span className="text-base font-black font-mono">
                      {isInf ? '∞' : d}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. VISITED SET (`vis`) DUAL-VIEW INSPECTOR               */}
        {/* ======================================================== */}
        <div className="w-full max-w-5xl bg-white dark:bg-[#151515] border border-[#EBE0D3] dark:border-[#282828] rounded-2xl p-3.5 shadow-2xs flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span>Visited State Table (`vis[node]` in Memory)</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-[10px] font-mono">
                {visitedSet.size} / {graphData.nodes.length} Visited
              </span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              Guarantees each vertex is explored once with O(1) membership lookup
            </span>
          </div>

          {/* Row 1: In-Memory Boolean Array vis[node] */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {graphData.nodes.map((node) => {
              const isVis = visitedTable[node.id] || visitedSet.has(node.id);
              return (
                <div
                  key={`vis-cell-${node.id}`}
                  className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-xs font-mono font-bold transition-all ${
                    isVis
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-2xs ring-1 ring-emerald-300'
                      : 'bg-gray-50 dark:bg-[#1C1C1C] text-gray-500 border-gray-200 dark:border-[#333]'
                  }`}
                >
                  <span>{node.id}</span>
                  <span className="text-[10px] flex items-center gap-0.5">
                    {isVis ? (
                      <>
                        <Check size={12} strokeWidth={3} />
                        <span>TRUE</span>
                      </>
                    ) : (
                      <>
                        <X size={12} strokeWidth={2} />
                        <span className="opacity-70">FALSE</span>
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Row 2: Chronological Traversal Path Stream */}
          {visitedSequence.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-gray-100 dark:border-[#222]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide shrink-0">
                Order Visited:
              </span>
              {visitedSequence.map((vId, idx) => (
                <div 
                  key={`seq-${vId}-${idx}`} 
                  className="flex items-center gap-1 shrink-0"
                >
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold">
                    #{idx + 1}: {vId}
                  </span>
                  {idx < visitedSequence.length - 1 && (
                    <ArrowRight size={10} className="text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 4. MAIN INTERACTIVE SVG GRAPH CANVAS                     */}
        {/* ======================================================== */}
        <div className="w-full max-w-5xl bg-white dark:bg-[#151515] rounded-3xl border border-[#EBE0D3] dark:border-[#282828] p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center relative">
          
          <svg 
            viewBox="0 0 680 340" 
            className="w-full h-auto max-h-[55vh] select-none"
          >
            <defs>
              <marker id="arrowhead" markerWidth="9" markerHeight="9" refX="25" refY="4.5" orient="auto">
                <polygon points="0 1, 9 4.5, 0 8" fill="#64748B" />
              </marker>
              <marker id="arrowhead-active" markerWidth="9" markerHeight="9" refX="25" refY="4.5" orient="auto">
                <polygon points="0 1, 9 4.5, 0 8" fill="#BC4A54" />
              </marker>
              <marker id="arrowhead-path" markerWidth="9" markerHeight="9" refX="25" refY="4.5" orient="auto">
                <polygon points="0 1, 9 4.5, 0 8" fill="#10B981" />
              </marker>
            </defs>

            {/* Render Graph Edges */}
            {graphData.edges.map((edge, idx) => {
              const uNode = graphData.nodes.find(n => n.id === edge.u);
              const vNode = graphData.nodes.find(n => n.id === edge.v);
              if (!uNode || !vNode) return null;

              const edgeKey = `${edge.u}-${edge.v}`;
              const reverseKey = `${edge.v}-${edge.u}`;
              const isPath = highlightedPathEdges.has(edgeKey) || highlightedPathEdges.has(reverseKey);
              const isActive = activeEdge === edgeKey || activeEdge === reverseKey;

              const midX = (uNode.x + vNode.x) / 2;
              const midY = (uNode.y + vNode.y) / 2;

              return (
                <g key={`graph-edge-${idx}`}>
                  <line
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke={isPath ? '#10B981' : isActive ? '#BC4A54' : '#CBD5E1'}
                    strokeWidth={isPath ? 4 : isActive ? 3.5 : 2}
                    strokeDasharray={isActive ? '6 4' : 'none'}
                    markerEnd={graphData.isDirected ? (isPath ? 'url(#arrowhead-path)' : isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)') : undefined}
                    className="transition-colors duration-300"
                  />

                  {/* Edge Weight Pill */}
                  {edge.weight !== undefined && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-12"
                        y="-9"
                        width="24"
                        height="18"
                        rx="6"
                        fill="#FDFBF7"
                        className="dark:fill-[#1E1E1E] stroke-gray-300 dark:stroke-[#333] shadow-xs"
                        strokeWidth="1.2"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="10"
                        fontWeight="bold"
                        fill={isPath ? '#10B981' : isActive ? '#BC4A54' : '#64748B'}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Render Graph Nodes (With Verified cy={node.y} Attributes) */}
            {graphData.nodes.map((node) => {
              const isCurrent = activeNode === node.id;
              const isProbing = probingNode === node.id;
              const isVisited = visitedSet.has(node.id);
              const inQueue = queueState.includes(node.id);
              const inStack = stackState.includes(node.id);
              const nodeColorVal = nodeColors[node.id];
              const nodeDist = distanceMap[node.id];

              let fillColor = '#FFFFFF';
              let strokeColor = '#CBD5E1';

              if (isCurrent) {
                fillColor = '#BC4A54';
                strokeColor = '#BC4A54';
              } else if (isProbing) {
                fillColor = '#F59E0B';
                strokeColor = '#D97706';
              } else if (nodeColorVal === 'CYAN') {
                fillColor = '#06B6D4';
                strokeColor = '#0891B2';
              } else if (nodeColorVal === 'ROSE') {
                fillColor = '#F43F5E';
                strokeColor = '#E11D48';
              } else if (nodeColorVal === 'GRAY') {
                fillColor = '#64748B';
                strokeColor = '#475569';
              } else if (nodeColorVal === 'BLACK') {
                fillColor = '#1E293B';
                strokeColor = '#0F172A';
              } else if (inQueue) {
                fillColor = '#06B6D4';
                strokeColor = '#0891B2';
              } else if (inStack) {
                fillColor = '#8B5CF6';
                strokeColor = '#7C3AED';
              } else if (isVisited) {
                fillColor = '#10B981';
                strokeColor = '#059669';
              }

              const isStart = startNode === node.id;

              return (
                <g 
                  key={`graph-node-${node.id}`} 
                  onClick={() => {
                    setStartNode(node.id);
                    handleReset();
                  }}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Ping when active */}
                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="30"
                      fill="none"
                      stroke="#BC4A54"
                      strokeWidth="2.5"
                      className="animate-ping opacity-50 pointer-events-none"
                    />
                  )}

                  {/* Start Node Indicator Halo */}
                  {isStart && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="27"
                      fill="none"
                      stroke="#BC4A54"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isCurrent || isProbing ? '3.5' : '2.5'}
                    className="transition-all duration-300 shadow-md group-hover:scale-105"
                  />

                  {/* Node Text Label */}
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="bold"
                    fill={isCurrent || isProbing || isVisited || inQueue || inStack || (nodeColorVal && nodeColorVal !== 'WHITE') ? '#FFFFFF' : '#1E293B'}
                    className="select-none pointer-events-none font-mono"
                  >
                    {node.label}
                  </text>

                  {/* Floating Action Badge Above Node */}
                  {isCurrent && (
                    <g transform={`translate(${node.x}, ${node.y - 30})`}>
                      <rect
                        x="-24"
                        y="-8"
                        width="48"
                        height="16"
                        rx="5"
                        fill="#BC4A54"
                        className="shadow-sm"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="8"
                        fontWeight="black"
                        fill="#FFFFFF"
                      >
                        ACTIVE
                      </text>
                    </g>
                  )}

                  {isProbing && !isCurrent && (
                    <g transform={`translate(${node.x}, ${node.y - 30})`}>
                      <rect
                        x="-26"
                        y="-8"
                        width="52"
                        height="16"
                        rx="5"
                        fill="#F59E0B"
                        className="shadow-sm"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="8"
                        fontWeight="black"
                        fill="#FFFFFF"
                      >
                        PROBING
                      </text>
                    </g>
                  )}

                  {/* Distance Flag Tag (for Dijkstra) */}
                  {nodeDist !== undefined && !isCurrent && !isProbing && (
                    <g transform={`translate(${node.x}, ${node.y - 28})`}>
                      <rect
                        x="-16"
                        y="-7"
                        width="32"
                        height="14"
                        rx="4"
                        fill="#1E293B"
                        className="stroke-gray-600 shadow-xs"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill={nodeDist === Infinity ? '#94A3B8' : '#34D399'}
                      >
                        {nodeDist === Infinity ? 'd:∞' : `d:${nodeDist}`}
                      </text>
                    </g>
                  )}

                  {/* In-Degree Tag (for Topological Sort) */}
                  {inDegreeMap[node.id] !== undefined && (
                    <g transform={`translate(${node.x + 18}, ${node.y - 14})`}>
                      <circle r="8" fill="#BC4A54" />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="8"
                        fontWeight="bold"
                        fill="#FFFFFF"
                      >
                        {inDegreeMap[node.id]}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Graph Interactive Legend Footer */}
          <div className="w-full flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#202020] text-[11px] text-gray-500 font-medium overflow-x-auto gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#BC4A54]" />
                <span>Active / Frontier</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span>Probing Neighbor</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span>Visited / In Tree</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#06B6D4]" />
                <span>In Queue</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                <span>In Call Stack</span>
              </span>
            </div>
            <span className="shrink-0 italic text-gray-400">
              💡 Click any vertex on canvas to set as origin
            </span>
          </div>

        </div>

      </div>
    </ResponsiveVisualizerShell>
  );
}
