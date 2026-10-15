// Tree Data Structure Layout & Hierarchy Geometry

const createNode = (val, id = null) => ({
  val: Number(val),
  id: id || `node-${val}-${Math.random().toString(36).substr(2, 6)}`,
  left: null,
  right: null,
  height: 1,
  rangeL: null,
  rangeR: null
});

// Deep tree cloner
const cloneTree = (node) => {
  if (!node) return null;
  const copy = createNode(node.val, node.id);
  copy.height = node.height || 1;
  copy.rangeL = node.rangeL;
  copy.rangeR = node.rangeR;
  copy.left = cloneTree(node.left);
  copy.right = cloneTree(node.right);
  return copy;
};

// Flatten tree nodes
const getAllTreeNodes = (root) => {
  if (!root) return [];
  const list = [];
  const q = [root];
  while (q.length > 0) {
    const curr = q.shift();
    list.push(curr);
    if (curr.left) q.push(curr.left);
    if (curr.right) q.push(curr.right);
  }
  return list;
};

// Calculate height of node
const getNodeHeight = (node) => (node ? node.height || 1 : 0);

// Calculate balance factor of node
const getBalanceFactor = (node) => {
  if (!node) return 0;
  return getNodeHeight(node.left) - getNodeHeight(node.right);
};

// Recalculate heights recursively
const updateHeights = (node) => {
  if (!node) return 0;
  node.height = 1 + Math.max(updateHeights(node.left), updateHeights(node.right));
  return node.height;
};

// Get pristine standard tree by algorithm type
const getStandardTree = (algoId) => {
  if (algoId === 'segment_tree') {
    const arr = [2, 4, 5, 7, 8];
    const buildSeg = (start, end) => {
      if (start === end) {
        const leaf = createNode(arr[start]);
        leaf.rangeL = start; leaf.rangeR = end;
        return leaf;
      }
      const mid = Math.floor((start + end) / 2);
      const leftChild = buildSeg(start, mid);
      const rightChild = buildSeg(mid + 1, end);
      const parent = createNode(leftChild.val + rightChild.val);
      parent.rangeL = start; parent.rangeR = end;
      parent.left = leftChild; parent.right = rightChild;
      return parent;
    };
    const segRoot = buildSeg(0, arr.length - 1);
    updateHeights(segRoot);
    return segRoot;
  }

  if (algoId === 'avl') {
    const root = createNode(30);
    root.left = createNode(20);
    root.right = createNode(40);
    root.left.left = createNode(10);
    updateHeights(root);
    return root;
  }

  // Standard Balanced 7-Node BST
  const root = createNode(50);
  root.left = createNode(25);
  root.right = createNode(75);
  root.left.left = createNode(15);
  root.left.right = createNode(35);
  root.right.left = createNode(60);
  root.right.right = createNode(85);
  updateHeights(root);
  return root;
};

// =========================================================================
// PERFORMANCE OPTIMIZED TREE LAYOUT ENGINE
// =========================================================================
function computeTreeLayout(root, canvasWidth = 960, canvasHeight = 560) {
  if (!root) return { nodes: [], edges: [], ghostSlots: [], bounds: { minX: 0, maxX: 960, minY: 0, maxY: 560 } };

  let inOrderIndex = 0;
  const nodeMap = new Map();

  function assignPositions(node, depth = 0) {
    if (!node) return;
    assignPositions(node.left, depth + 1);
    nodeMap.set(node.id || `${node.val}`, {
      node,
      order: inOrderIndex++,
      depth
    });
    assignPositions(node.right, depth + 1);
  }

  assignPositions(root, 0);

  const totalNodes = Math.max(inOrderIndex, 1);
  const xSpacing = Math.max(68, Math.min(125, (canvasWidth - 160) / totalNodes));
  const ySpacing = 82;
  const startY = 72;
  const centerXOffset = (canvasWidth - (totalNodes - 1) * xSpacing) / 2;

  const placedNodes = [];
  const placedEdges = [];
  const ghostSlots = [];

  function buildGeometry(node) {
    if (!node) return null;
    const info = nodeMap.get(node.id || `${node.val}`);
    const x = Math.round(centerXOffset + info.order * xSpacing);
    const y = Math.round(startY + info.depth * ySpacing);

    const currentNodeObj = {
      val: node.val,
      id: node.id || `node-${node.val}`,
      x,
      y,
      height: node.height || 1,
      rangeL: node.rangeL,
      rangeR: node.rangeR,
      hasLeft: !!node.left,
      hasRight: !!node.right
    };
    placedNodes.push(currentNodeObj);

    // Left child
    if (node.left) {
      const leftObj = buildGeometry(node.left);
      if (leftObj) {
        placedEdges.push({
          from: currentNodeObj,
          to: leftObj,
          id: `edge-${node.val}-${node.left.val}`,
          side: 'left'
        });
      }
    } else {
      ghostSlots.push({
        parentVal: node.val,
        side: 'left',
        x: x - 26,
        y: y + 42
      });
    }

    // Right child
    if (node.right) {
      const rightObj = buildGeometry(node.right);
      if (rightObj) {
        placedEdges.push({
          from: currentNodeObj,
          to: rightObj,
          id: `edge-${node.val}-${node.right.val}`,
          side: 'right'
        });
      }
    } else {
      ghostSlots.push({
        parentVal: node.val,
        side: 'right',
        x: x + 26,
        y: y + 42
      });
    }

    return currentNodeObj;
  }

  buildGeometry(root);

  const minX = placedNodes.reduce((min, n) => Math.min(min, n.x), Infinity);
  const maxX = placedNodes.reduce((max, n) => Math.max(max, n.x), -Infinity);
  const minY = placedNodes.reduce((min, n) => Math.min(min, n.y), Infinity);
  const maxY = placedNodes.reduce((max, n) => Math.max(max, n.y), -Infinity);

  return {
    nodes: placedNodes,
    edges: placedEdges,
    ghostSlots,
    bounds: {
      minX: isFinite(minX) ? minX : 0,
      maxX: isFinite(maxX) ? maxX : canvasWidth,
      minY: isFinite(minY) ? minY : 0,
      maxY: isFinite(maxY) ? maxY : canvasHeight
    }
  };
}

// Simple Stack Diagram for Execution Chamber

export {
  createNode,
  cloneTree,
  getAllTreeNodes,
  getNodeHeight,
  getBalanceFactor,
  updateHeights,
  getStandardTree,
  computeTreeLayout
};
