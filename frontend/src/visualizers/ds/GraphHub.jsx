import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ArrowLeft, Network, Waypoints, Compass } from 'lucide-react';

// ========================================================
// 16 CUSTOM MINIMALIST PASTEL SVG GRAPHICS FOR GRAPH ALGORITHMS
// ========================================================

const BFSGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <circle cx="50" cy="24" r="9" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
    <text x="50" y="27.5" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">A</text>
    
    <line x1="44" y1="30" x2="30" y2="48" stroke="#333" strokeWidth="1.5"/>
    <line x1="56" y1="30" x2="70" y2="48" stroke="#333" strokeWidth="1.5"/>

    <circle cx="28" cy="54" r="8" fill="#06B6D4" stroke="#333" strokeWidth="1.5"/>
    <text x="28" y="57" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">B</text>

    <circle cx="72" cy="54" r="8" fill="#06B6D4" stroke="#333" strokeWidth="1.5"/>
    <text x="72" y="57" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">C</text>

    <line x1="24" y1="60" x2="16" y2="76" stroke="#333" strokeWidth="1.2" strokeDasharray="2 2"/>
    <line x1="32" y1="60" x2="40" y2="76" stroke="#333" strokeWidth="1.2" strokeDasharray="2 2"/>
    <line x1="72" y1="62" x2="72" y2="76" stroke="#333" strokeWidth="1.2" strokeDasharray="2 2"/>

    <rect x="22" y="86" width="56" height="10" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <text x="50" y="94" fontSize="7" fill="#333" textAnchor="middle" fontFamily="monospace">Queue: [B, C]</text>
  </svg>
);

const DFSGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <circle cx="25" cy="25" r="9" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
    <text x="25" y="28.5" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">1</text>
    
    <line x1="25" y1="34" x2="25" y2="52" stroke="#BC4A54" strokeWidth="2.5"/>
    <circle cx="25" cy="58" r="8" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
    <text x="25" y="61" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">2</text>

    <line x1="25" y1="66" x2="25" y2="82" stroke="#BC4A54" strokeWidth="2.5"/>
    <circle cx="25" cy="88" r="7" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
    <text x="25" y="90.5" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">3</text>

    <line x1="33" y1="28" x2="60" y2="45" stroke="#888" strokeWidth="1.2" strokeDasharray="2 2"/>
    <circle cx="65" cy="48" r="7" fill="#FDFBF7" stroke="#888" strokeWidth="1"/>
    <text x="65" y="50.5" fontSize="7" fill="#888" textAnchor="middle" fontFamily="monospace">4</text>

    {/* Stack HUD */}
    <g transform="translate(60, 65)">
      <rect x="0" y="0" width="30" height="28" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
      <rect x="3" y="3" width="24" height="6" fill="#BC4A54"/>
      <text x="15" y="8" fontSize="5" fill="#fff" textAnchor="middle" fontWeight="bold">Top: [3]</text>
      <rect x="3" y="11" width="24" height="6" fill="#A855F7" opacity="0.6"/>
      <text x="15" y="16" fontSize="5" fill="#fff" textAnchor="middle" fontWeight="bold">[2]</text>
      <rect x="3" y="19" width="24" height="6" fill="#666" opacity="0.4"/>
      <text x="15" y="24" fontSize="5" fill="#fff" textAnchor="middle" fontWeight="bold">[1]</text>
    </g>
  </svg>
);

const DijkstraGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <circle cx="22" cy="50" r="9" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
    <text x="22" y="53.5" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">A</text>
    <text x="22" y="35" fontSize="8" fill="#BC4A54" textAnchor="middle" fontWeight="bold">d=0</text>

    <line x1="30" y1="46" x2="68" y2="28" stroke="#10B981" strokeWidth="2.5"/>
    <rect x="46" y="31" width="14" height="10" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
    <text x="53" y="38.5" fontSize="7" fill="#10B981" textAnchor="middle" fontWeight="bold">w:2</text>

    <line x1="30" y1="54" x2="68" y2="72" stroke="#94A3B8" strokeWidth="1.5"/>
    <rect x="46" y="66" width="14" height="10" rx="3" fill="#FDFBF7" stroke="#333" strokeWidth="0.8"/>
    <text x="53" y="73.5" fontSize="7" fill="#64748B" textAnchor="middle">w:7</text>

    <circle cx="76" cy="26" r="8" fill="#10B981" stroke="#333" strokeWidth="1.5"/>
    <text x="76" y="29" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="monospace">B</text>
    <text x="76" y="14" fontSize="8" fill="#10B981" textAnchor="middle" fontWeight="bold">d=2</text>

    <circle cx="76" cy="74" r="8" fill="#FDFBF7" stroke="#333" strokeWidth="1.5"/>
    <text x="76" y="77" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold" fontFamily="monospace">C</text>
    <text x="76" y="90" fontSize="8" fill="#64748B" textAnchor="middle" fontWeight="bold">d=7</text>
  </svg>
);

const TopoSortGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <circle cx="20" cy="35" r="8" fill="#BC4A54" stroke="#333" strokeWidth="1.5"/>
    <text x="20" y="38" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">0</text>
    <text x="20" y="22" fontSize="7" fill="#BC4A54" textAnchor="middle" fontWeight="bold">in:0</text>

    <path d="M28 35 L48 35" stroke="#333" strokeWidth="1.5"/>
    <polygon points="48,32 54,35 48,38" fill="#333"/>

    <circle cx="60" cy="35" r="8" fill="#06B6D4" stroke="#333" strokeWidth="1.5"/>
    <text x="60" y="38" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">1</text>
    <text x="60" y="22" fontSize="7" fill="#06B6D4" textAnchor="middle" fontWeight="bold">in:1</text>

    <path d="M68 35 L82 35" stroke="#333" strokeWidth="1.5"/>
    <polygon points="82,32 88,35 82,38" fill="#333"/>

    <circle cx="92" cy="35" r="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>

    <rect x="15" y="65" width="70" height="22" rx="6" fill="#FDFBF7" stroke="#333" strokeWidth="1"/>
    <text x="50" y="79" fontSize="8" fill="#10B981" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Order: [0 ➔ 1 ➔ 2]</text>
  </svg>
);

const AStarGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(18, 20)">
      <rect x="0" y="0" width="16" height="16" fill="#BC4A54" stroke="#333" rx="3"/>
      <text x="8" y="11" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">S</text>
      
      <rect x="24" y="0" width="16" height="16" fill="#D3DFC8" stroke="#333" rx="3"/>
      <rect x="48" y="0" width="16" height="16" fill="#D3DFC8" stroke="#333" rx="3"/>

      <rect x="24" y="22" width="16" height="16" fill="#333" stroke="#333" rx="3"/>

      <rect x="0" y="44" width="16" height="16" fill="#FDFBF7" stroke="#333" rx="3"/>
      <rect x="24" y="44" width="16" height="16" fill="#10B981" stroke="#333" rx="3"/>
      <rect x="48" y="44" width="16" height="16" fill="#10B981" stroke="#333" rx="3"/>
      <text x="56" y="55" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="bold">G</text>
    </g>
    <text x="50" y="90" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace" fontWeight="bold">f(n) = g(n) + h(n)</text>
  </svg>
);

const PrimMSTGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <circle cx="30" cy="30" r="8" fill="#10B981" stroke="#333" strokeWidth="1.5"/>
    <circle cx="70" cy="30" r="8" fill="#10B981" stroke="#333" strokeWidth="1.5"/>
    <circle cx="50" cy="70" r="8" fill="#10B981" stroke="#333" strokeWidth="1.5"/>
    <circle cx="85" cy="75" r="7" fill="#FDFBF7" stroke="#888" strokeWidth="1"/>

    <line x1="38" y1="30" x2="62" y2="30" stroke="#10B981" strokeWidth="3"/>
    <line x1="35" y1="37" x2="46" y2="63" stroke="#10B981" strokeWidth="3"/>
    <line x1="65" y1="37" x2="54" y2="63" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3"/>
    <line x1="57" y1="71" x2="78" y2="74" stroke="#BC4A54" strokeWidth="2" strokeDasharray="2 2"/>

    <text x="50" y="90" fontSize="8" fill="#10B981" textAnchor="middle" fontWeight="bold" fontFamily="monospace">MST Cost: 6</text>
  </svg>
);

const KruskalGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <line x1="20" y1="30" x2="50" y2="20" stroke="#10B981" strokeWidth="3"/>
    <text x="35" y="20" fontSize="7" fill="#10B981" fontWeight="bold">w:1</text>
    
    <line x1="50" y1="70" x2="80" y2="70" stroke="#10B981" strokeWidth="3"/>
    <text x="65" y="65" fontSize="7" fill="#10B981" fontWeight="bold">w:2</text>

    <line x1="50" y1="20" x2="50" y2="70" stroke="#BC4A54" strokeWidth="2" strokeDasharray="3 3"/>
    <text x="55" y="45" fontSize="7" fill="#BC4A54" fontWeight="bold">w:3 (Union)</text>

    <circle cx="20" cy="30" r="7" fill="#3B82F6" stroke="#333"/>
    <circle cx="50" cy="20" r="7" fill="#3B82F6" stroke="#333"/>
    <circle cx="50" cy="70" r="7" fill="#A855F7" stroke="#333"/>
    <circle cx="80" cy="70" r="7" fill="#A855F7" stroke="#333"/>

    <text x="50" y="90" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">Disjoint Set Union</text>
  </svg>
);

const CycleDetectionGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <circle cx="30" cy="35" r="8" fill="#64748B" stroke="#333" strokeWidth="1.5"/>
    <text x="30" y="38" fontSize="7" fill="#fff" textAnchor="middle">Gray</text>

    <line x1="38" y1="35" x2="62" y2="35" stroke="#333" strokeWidth="2"/>
    <circle cx="70" cy="35" r="8" fill="#64748B" stroke="#333" strokeWidth="1.5"/>
    <text x="70" y="38" fontSize="7" fill="#fff" textAnchor="middle">Gray</text>

    <line x1="70" y1="43" x2="50" y2="65" stroke="#333" strokeWidth="2"/>
    <circle cx="50" cy="70" r="8" fill="#64748B" stroke="#333" strokeWidth="1.5"/>

    <path d="M43 68 Q 20 60 27 42" stroke="#BC4A54" strokeWidth="2.5" fill="none" strokeDasharray="3 2"/>
    <polygon points="27,42 22,46 30,47" fill="#BC4A54"/>

    <text x="50" y="90" fontSize="8" fill="#BC4A54" textAnchor="middle" fontWeight="bold">⚠️ Back-Edge = Cycle!</text>
  </svg>
);

const BipartiteGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <rect x="15" y="15" width="28" height="65" rx="8" fill="#06B6D4" opacity="0.2"/>
    <text x="29" y="12" fontSize="7" fill="#06B6D4" textAnchor="middle" fontWeight="bold">Set U</text>
    <circle cx="29" cy="30" r="7" fill="#06B6D4" stroke="#333"/>
    <circle cx="29" cy="60" r="7" fill="#06B6D4" stroke="#333"/>

    <rect x="57" y="15" width="28" height="65" rx="8" fill="#F43F5E" opacity="0.2"/>
    <text x="71" y="12" fontSize="7" fill="#F43F5E" textAnchor="middle" fontWeight="bold">Set V</text>
    <circle cx="71" cy="30" r="7" fill="#F43F5E" stroke="#333"/>
    <circle cx="71" cy="60" r="7" fill="#F43F5E" stroke="#333"/>

    <line x1="36" y1="30" x2="64" y2="60" stroke="#333" strokeWidth="1.5"/>
    <line x1="36" y1="60" x2="64" y2="30" stroke="#333" strokeWidth="1.5"/>

    <text x="50" y="92" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">2-Colorable (No Odd Cycle)</text>
  </svg>
);

const BellmanFordGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <circle cx="25" cy="50" r="8" fill="#BC4A54" stroke="#333"/>
    <circle cx="75" cy="50" r="8" fill="#10B981" stroke="#333"/>

    <line x1="33" y1="46" x2="67" y2="46" stroke="#BC4A54" strokeWidth="2"/>
    <text x="50" y="40" fontSize="8" fill="#BC4A54" textAnchor="middle" fontWeight="bold">w: -3</text>

    <text x="50" y="75" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">|V| - 1 Relaxations</text>
    <text x="50" y="88" fontSize="7" fill="#BC4A54" textAnchor="middle" fontWeight="bold">Detects -ve Cycles</text>
  </svg>
);

const FloydWarshallGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <g transform="translate(25, 20)">
      <rect x="0" y="0" width="16" height="16" fill="#FDFBF7" stroke="#333"/>
      <text x="8" y="11" fontSize="8" textAnchor="middle">0</text>
      <rect x="17" y="0" width="16" height="16" fill="#FDFBF7" stroke="#333"/>
      <text x="25" y="11" fontSize="8" textAnchor="middle">3</text>
      <rect x="34" y="0" width="16" height="16" fill="#FDFBF7" stroke="#333"/>
      <text x="42" y="11" fontSize="8" textAnchor="middle">8</text>

      <rect x="0" y="17" width="16" height="16" fill="#FDFBF7" stroke="#333"/>
      <text x="8" y="28" fontSize="8" textAnchor="middle">∞</text>
      <rect x="17" y="17" width="16" height="16" fill="#FDFBF7" stroke="#333"/>
      <text x="25" y="28" fontSize="8" textAnchor="middle">0</text>
      <rect x="34" y="17" width="16" height="16" fill="#BC4A54" stroke="#333"/>
      <text x="42" y="28" fontSize="8" fill="#fff" fontWeight="bold" textAnchor="middle">1</text>

      <rect x="0" y="34" width="16" height="16" fill="#FDFBF7" stroke="#333"/>
      <text x="8" y="45" fontSize="8" textAnchor="middle">∞</text>
      <rect x="17" y="34" width="16" height="16" fill="#FDFBF7" stroke="#333"/>
      <text x="25" y="45" fontSize="8" textAnchor="middle">∞</text>
      <rect x="34" y="34" width="16" height="16" fill="#FDFBF7" stroke="#333"/>
      <text x="42" y="45" fontSize="8" textAnchor="middle">0</text>
    </g>
    <text x="50" y="88" fontSize="8" fill="#333" textAnchor="middle" fontFamily="monospace">dist[i][j] via k</text>
  </svg>
);

const TarjanSCCGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <circle cx="30" cy="30" r="7" fill="#BC4A54" stroke="#333"/>
    <circle cx="60" cy="30" r="7" fill="#BC4A54" stroke="#333"/>
    <circle cx="45" cy="55" r="7" fill="#BC4A54" stroke="#333"/>

    <path d="M36 28 L54 28" stroke="#BC4A54" strokeWidth="2"/>
    <path d="M60 37 L48 50" stroke="#BC4A54" strokeWidth="2"/>
    <path d="M42 50 L32 37" stroke="#BC4A54" strokeWidth="2"/>

    <rect x="20" y="18" width="50" height="46" rx="8" fill="none" stroke="#BC4A54" strokeWidth="1.5" strokeDasharray="3 3"/>

    <text x="50" y="82" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">Low-Link on Stack</text>
    <text x="50" y="92" fontSize="7" fill="#BC4A54" textAnchor="middle">Strongly Connected</text>
  </svg>
);

const KosarajuGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <circle cx="30" cy="40" r="7" fill="#3B82F6" stroke="#333"/>
    <circle cx="70" cy="40" r="7" fill="#3B82F6" stroke="#333"/>
    
    <path d="M37 38 L63 38" stroke="#333" strokeWidth="1.5"/>
    <polygon points="63,35 68,38 63,41" fill="#333"/>

    <path d="M63 45 L37 45" stroke="#BC4A54" strokeWidth="1.5" strokeDasharray="2 2"/>
    <polygon points="37,42 32,45 37,48" fill="#BC4A54"/>

    <text x="50" y="70" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">G ➔ G^T (Transpose)</text>
    <text x="50" y="85" fontSize="7" fill="#666" textAnchor="middle">2-Pass DFS</text>
  </svg>
);

const BridgesGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#E8D1CB"/>
    <circle cx="20" cy="50" r="7" fill="#10B981" stroke="#333"/>
    <circle cx="40" cy="50" r="7" fill="#10B981" stroke="#333"/>
    
    <line x1="27" y1="50" x2="33" y2="50" stroke="#10B981" strokeWidth="2"/>

    {/* The Bridge Edge */}
    <line x1="47" y1="50" x2="63" y2="50" stroke="#BC4A54" strokeWidth="3" strokeDasharray="3 2"/>

    <circle cx="70" cy="50" r="7" fill="#3B82F6" stroke="#333"/>
    <circle cx="90" cy="50" r="7" fill="#3B82F6" stroke="#333"/>
    <line x1="77" y1="50" x2="83" y2="50" stroke="#3B82F6" strokeWidth="2"/>

    <text x="55" y="38" fontSize="8" fill="#BC4A54" textAnchor="middle" fontWeight="bold">✂️ Cut Edge</text>
    <text x="50" y="85" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">Critical Bottlenecks</text>
  </svg>
);

const EulerianGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#F4E9D4"/>
    <polygon points="50,20 20,50 80,50" fill="none" stroke="#BC4A54" strokeWidth="2"/>
    <rect x="20" y="50" width="60" height="30" fill="none" stroke="#BC4A54" strokeWidth="2"/>
    <line x1="20" y1="50" x2="80" y2="80" stroke="#BC4A54" strokeWidth="2"/>
    <line x1="80" y1="50" x2="20" y2="80" stroke="#BC4A54" strokeWidth="2"/>

    <text x="50" y="93" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">Every Edge Visited Once</text>
  </svg>
);

const GraphColoringGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#D3DFC8"/>
    <circle cx="50" cy="25" r="8" fill="#EF4444" stroke="#333" strokeWidth="1.5"/>
    <circle cx="25" cy="65" r="8" fill="#3B82F6" stroke="#333" strokeWidth="1.5"/>
    <circle cx="75" cy="65" r="8" fill="#10B981" stroke="#333" strokeWidth="1.5"/>

    <line x1="44" y1="30" x2="30" y2="58" stroke="#333" strokeWidth="1.5"/>
    <line x1="56" y1="30" x2="70" y2="58" stroke="#333" strokeWidth="1.5"/>
    <line x1="33" y1="65" x2="67" y2="65" stroke="#333" strokeWidth="1.5"/>

    <text x="50" y="88" fontSize="8" fill="#333" textAnchor="middle" fontWeight="bold">Chromatic Number χ(G) = 3</text>
  </svg>
);

// ========================================================
// 16 GRAPH ALGORITHMS METADATA CATALOG
// ========================================================

export const GRAPH_CATALOG = [
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'Traversal',
    desc: 'Layer-by-layer frontier expansion using an animated FIFO Queue with visited state tracking.',
    tag: 'O(V + E)',
    complexity: { time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)' },
    codeId: 'bfs',
    graphic: <BFSGraphic />
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'Traversal',
    desc: 'Deep branch recursive traversal with animated LIFO Call Stack and backtracking.',
    tag: 'O(V + E)',
    complexity: { time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)' },
    codeId: 'dfs',
    graphic: <DFSGraphic />
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    category: 'Shortest Path',
    desc: 'Greedy pathfinding with Min-Priority Queue and live distance table relaxation.',
    tag: 'O((V + E) log V)',
    complexity: { time: { best: 'O(E log V)', average: 'O((V + E) log V)', worst: 'O(V²)' }, space: 'O(V)' },
    codeId: 'dijkstra',
    graphic: <DijkstraGraphic />
  },
  {
    id: 'toposort',
    name: "Topological Sort (Kahn's)",
    category: 'DAG Ordering',
    desc: 'Dependency resolution on Directed Acyclic Graphs using in-degree array and zero-indegree queue.',
    tag: 'O(V + E)',
    complexity: { time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)' },
    codeId: 'toposort',
    graphic: <TopoSortGraphic />
  },
  {
    id: 'astar',
    name: 'A* Heuristic Search',
    category: 'Shortest Path',
    desc: 'Goal-directed pathfinding using cost function f(n) = g(n) + h(n) with Euclidean distance.',
    tag: 'O(E)',
    complexity: { time: { best: 'O(d)', average: 'O(E)', worst: 'O(b^d)' }, space: 'O(V)' },
    codeId: 'astar',
    graphic: <AStarGraphic />
  },
  {
    id: 'prim',
    name: "Prim's Minimum Spanning Tree",
    category: 'MST',
    desc: 'Greedy growing tree connecting lowest-weight cut edges from visited frontier.',
    tag: 'O(E log V)',
    complexity: { time: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(V²)' }, space: 'O(V)' },
    codeId: 'prim',
    graphic: <PrimMSTGraphic />
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST (DSU)",
    category: 'MST',
    desc: 'Edge-centric greedy tree construction utilizing Disjoint Set Union (Union-Find) with path compression.',
    tag: 'O(E log E)',
    complexity: { time: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' }, space: 'O(V)' },
    codeId: 'kruskal',
    graphic: <KruskalGraphic />
  },
  {
    id: 'cycle',
    name: 'Cycle Detection (3-Color)',
    category: 'Structural',
    desc: 'White-Gray-Black node state tracking detecting back-edges in directed and undirected graphs.',
    tag: 'O(V + E)',
    complexity: { time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)' },
    codeId: 'cycle',
    graphic: <CycleDetectionGraphic />
  },
  {
    id: 'bipartite',
    name: 'Bipartite Graph (2-Coloring)',
    category: 'Structural',
    desc: 'Dual-partition graph check validating whether nodes can be partitioned into 2 independent sets.',
    tag: 'O(V + E)',
    complexity: { time: { best: 'O(1)', average: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)' },
    codeId: 'bipartite',
    graphic: <BipartiteGraphic />
  },
  {
    id: 'bellmanford',
    name: 'Bellman-Ford Algorithm',
    category: 'Shortest Path',
    desc: '|V|-1 relaxation rounds capable of handling negative weights and detecting negative cycles.',
    tag: 'O(V · E)',
    complexity: { time: { best: 'O(E)', average: 'O(V · E)', worst: 'O(V · E)' }, space: 'O(V)' },
    codeId: 'bellmanford',
    graphic: <BellmanFordGraphic />
  },
  {
    id: 'floydwarshall',
    name: 'Floyd-Warshall (All-Pairs)',
    category: 'Dynamic Prog',
    desc: 'Dynamic programming matrix relaxation discovering shortest distances between every pair of vertices.',
    tag: 'O(V³)',
    complexity: { time: { best: 'O(V³)', average: 'O(V³)', worst: 'O(V³)' }, space: 'O(V²)' },
    codeId: 'floydwarshall',
    graphic: <FloydWarshallGraphic />
  },
  {
    id: 'tarjan_scc',
    name: "Tarjan's SCC Algorithm",
    category: 'Structural',
    desc: 'Discovery and low-link tracking in a single DFS pass partitioning directed graphs into SCC components.',
    tag: 'O(V + E)',
    complexity: { time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)' },
    codeId: 'tarjan_scc',
    graphic: <TarjanSCCGraphic />
  },
  {
    id: 'kosaraju',
    name: "Kosaraju's SCC Algorithm",
    category: 'Structural',
    desc: 'Two-pass DFS leveraging finish order on the transposed graph to extract strongly connected components.',
    tag: 'O(V + E)',
    complexity: { time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)' },
    codeId: 'kosaraju',
    graphic: <KosarajuGraphic />
  },
  {
    id: 'bridges',
    name: 'Bridges & Articulation Points',
    category: 'Structural',
    desc: 'Identifies critical connections and vulnerable single points of failure whose removal disconnects the graph.',
    tag: 'O(V + E)',
    complexity: { time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)' },
    codeId: 'bridges',
    graphic: <BridgesGraphic />
  },
  {
    id: 'eulerian',
    name: 'Eulerian Path & Circuit',
    category: 'Eulerian',
    desc: "Hierholzer's algorithm finding a continuous trail visiting every edge exactly once.",
    tag: 'O(V + E)',
    complexity: { time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' }, space: 'O(V)' },
    codeId: 'eulerian',
    graphic: <EulerianGraphic />
  },
  {
    id: 'coloring',
    name: 'Greedy Graph Coloring',
    category: 'Optimization',
    desc: 'Assigns minimum colors to vertices such that no two adjacent vertices share the same color.',
    tag: 'O(V² + E)',
    complexity: { time: { best: 'O(V + E)', average: 'O(V² + E)', worst: 'O(V² + E)' }, space: 'O(V)' },
    codeId: 'coloring',
    graphic: <GraphColoringGraphic />
  }
];

export default function GraphHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', 'Traversal', 'Shortest Path', 'MST', 'DAG Ordering', 'Structural', 'Dynamic Prog'];

  const filteredCatalog = GRAPH_CATALOG.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0D0D0D] text-gray-900 dark:text-gray-100 p-6 sm:p-10 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE0D3] dark:border-[#262626] pb-6">
          <div className="space-y-1">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#BC4A54] transition-colors uppercase tracking-wider mb-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <span>Graph Suite</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#BC4A54]/10 dark:bg-[#BC4A54]/20 text-[#BC4A54] font-mono font-bold">
                16 Algorithms
              </span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
              Explore graph network topologies with live animated <strong>Queue (BFS)</strong>, <strong>Stack (DFS)</strong>, <strong>Visited Set</strong>, and <strong>Priority Queue</strong> inspection.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search graph algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium rounded-xl bg-white dark:bg-[#161616] border border-[#EBE0D3] dark:border-[#2A2A2A] focus:outline-hidden focus:ring-2 focus:ring-[#BC4A54] transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#BC4A54] text-white shadow-xs'
                  : 'bg-white dark:bg-[#161616] border border-[#EBE0D3] dark:border-[#2A2A2A] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#202020]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 16-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCatalog.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="group relative bg-white dark:bg-[#141414] rounded-2xl border border-[#EBE0D3] dark:border-[#262626] overflow-hidden hover:shadow-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Pastel SVG Graphic Area */}
                  <div className="w-full h-36 border-b border-[#EBE0D3] dark:border-[#262626] overflow-hidden p-2 flex items-center justify-center bg-gray-50/50 dark:bg-black/20 group-hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-full h-full max-w-[130px] flex items-center justify-center">
                      {item.graphic}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#202020] text-gray-600 dark:text-gray-300">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#BC4A54] bg-[#BC4A54]/10 dark:bg-[#BC4A54]/20 px-2 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#BC4A54] transition-colors line-clamp-1">
                      {item.name}
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 pt-0 border-t border-transparent flex items-center justify-between mt-2">
                  <span className="text-[10px] font-mono text-gray-400 font-medium">
                    {item.complexity.time.average}
                  </span>
                  <Link
                    to={`/visualizer/graph/${item.id}`}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#202020] group-hover:bg-[#BC4A54] text-gray-600 dark:text-gray-300 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs"
                    title={`Launch ${item.name} Visualizer`}
                  >
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
