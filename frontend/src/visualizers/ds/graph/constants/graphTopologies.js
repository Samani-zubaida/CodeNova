export const PRESET_TOPOLOGIES = {
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
