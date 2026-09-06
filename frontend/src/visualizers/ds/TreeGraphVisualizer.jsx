import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX,
  Plus, Trash2, Search, RefreshCw, GitCommit, Layers,
  Compass, Lightbulb, CheckCircle, AlertCircle, ArrowDown, Activity
} from 'lucide-react';
import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import ComplexityBadge from '../../components/visualizer/ComplexityBadge';
import CodeInspector from '../../components/visualizer/CodeInspector';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import { TREE_ALGORITHMS } from './TreeHub';

// Web Audio API Synthesizer
const playSynthTone = (type = 'visit', isMuted = false) => {
  if (isMuted || typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'compare') {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'insert') {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'delete') {
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.19);
    } else if (type === 'rotate') {
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'found') {
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = f;
        g.gain.setValueAtTime(0.1, now + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);
        o.start(now + i * 0.06);
        o.stop(now + i * 0.06 + 0.13);
      });
    }
  } catch (e) {
    // Audio Context handled safely
  }
};

const CODE_SNIPPETS = {
  javascript: `// Binary Search Tree (BST) Node
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Insert Node into BST (O(log n) avg)
function insert(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) {
    root.left = insert(root.left, val);
  } else if (val > root.val) {
    root.right = insert(root.right, val);
  }
  return root;
}

// Delete Node from BST (Handles 0, 1, 2 children)
function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) {
    root.left = deleteNode(root.left, key);
  } else if (key > root.val) {
    root.right = deleteNode(root.right, key);
  } else {
    // Case 1 & 2: 0 or 1 child
    if (!root.left) return root.right;
    if (!root.right) return root.left;

    // Case 3: 2 children -> Find In-Order Successor
    let succ = findMin(root.right);
    root.val = succ.val;
    root.right = deleteNode(root.right, succ.val);
  }
  return root;
}

function findMin(node) {
  while (node.left) node = node.left;
  return node;
}`,
  python: `# Binary Search Tree in Python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root

def delete_node(root, key):
    if not root:
        return None
    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        # Case 1 & 2: 0 or 1 child
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        # Case 3: 2 children -> In-order successor
        succ = root.right
        while succ.left:
            succ = succ.left
        root.val = succ.val
        root.right = delete_node(root.right, succ.val)
    return root`,
  cpp: `// C++ Binary Search Tree Implementation
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    return root;
}

TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        if (!root->left) return root->right;
        if (!root->right) return root->left;
        // In-order successor (min in right subtree)
        TreeNode* succ = root->right;
        while (succ->left) succ = succ->left;
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}`,
  java: `// Java BST Implementation
public class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    return root;
}

public TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) root.left = deleteNode(root.left, key);
    else if (key > root.val) root.right = deleteNode(root.right, key);
    else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode succ = root.right;
        while (succ.left != null) succ = succ.left;
        root.val = succ.val;
        root.right = deleteNode(root.right, succ.val);
    }
    return root;
}`
};

// Tree Helper functions
function createNode(val) {
  return {
    id: `node_${val}_${Date.now()}_${Math.floor(Math.random()*1000)}`,
    val,
    left: null,
    right: null,
    height: 1
  };
}

function cloneTree(node) {
  if (!node) return null;
  return {
    id: node.id,
    val: node.val,
    height: node.height || 1,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
}

function getHeight(node) {
  return node ? node.height : 0;
}

function updateHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function getBalance(node) {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

// Layout coordinate calculations for SVG
function computeTreeLayout(root, width = 640, height = 360) {
  if (!root) return { nodes: [], edges: [] };

  const nodes = [];
  const edges = [];

  function layout(node, depth, leftBound, rightBound, parentPos = null) {
    if (!node) return;
    const x = (leftBound + rightBound) / 2;
    const y = 45 + depth * 75;

    const nodeItem = {
      id: node.id,
      val: node.val,
      height: node.height,
      bf: getBalance(node),
      x,
      y
    };
    nodes.push(nodeItem);

    if (parentPos) {
      edges.push({
        id: `e_${parentPos.id}_${node.id}`,
        x1: parentPos.x,
        y1: parentPos.y,
        x2: x,
        y2: y
      });
    }

    if (node.left) {
      layout(node.left, depth + 1, leftBound, x, nodeItem);
    }
    if (node.right) {
      layout(node.right, depth + 1, x, rightBound, nodeItem);
    }
  }

  layout(root, 0, 20, width - 20);
  return { nodes, edges };
}

export default function TreeGraphVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();
  const currentAlgo = TREE_ALGORITHMS.find(a => a.id === algoId) || TREE_ALGORITHMS[0];

  // Tree Mode: 'bst' | 'avl'
  const [treeMode, setTreeMode] = useState(algoId === 'avl' ? 'avl' : 'bst');

  // Initial balanced tree: 50 -> (25, 75) -> (15, 35, 60, 85)
  const [treeRoot, setTreeRoot] = useState(() => {
    const root = createNode(50);
    root.left = createNode(25);
    root.right = createNode(75);
    root.left.left = createNode(15);
    root.left.right = createNode(35);
    root.right.left = createNode(60);
    root.right.right = createNode(85);
    return root;
  });

  // Inputs
  const [inputVal, setInputVal] = useState('40');
  const [deleteVal, setDeleteVal] = useState('25');
  const [searchVal, setSearchVal] = useState('35');

  // Playback & Animation states
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [traversalOutput, setTraversalOutput] = useState([]);
  const [logs, setLogs] = useState(['> Dynamic Binary Tree & BST visualizer loaded.']);

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-15), msg]);
  };

  const executeSteps = (newSteps) => {
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      if (currentStepIdx < steps.length - 1) {
        const step = steps[currentStepIdx];
        if (step?.sound) playSynthTone(step.sound, isMuted);
        if (step?.traversalItem !== undefined) {
          setTraversalOutput(prev => [...prev, step.traversalItem]);
        }
        timer = setTimeout(() => {
          setCurrentStepIdx(prev => prev + 1);
        }, 1000 / speed);
      } else {
        const lastStep = steps[steps.length - 1];
        if (lastStep?.sound) playSynthTone(lastStep.sound, isMuted);
        if (lastStep?.traversalItem !== undefined) {
          setTraversalOutput(prev => [...prev, lastStep.traversalItem]);
        }
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps, speed, isMuted]);

  // Current active step
  const activeStep = steps[currentStepIdx] || {
    treeSnapshot: treeRoot,
    activeNodeVal: null,
    comparingVal: null,
    successorVal: null,
    highlightPath: [],
    explanation: {
      action: "Tree ready for dynamic additions, deletions, or traversals",
      intuition: "Binary Search Tree maintains the invariant: Left Subtree < Root < Right Subtree at every node.",
      next: "Type a value and click 'Insert BST' or 'Delete Node' to watch step-by-step pointers."
    },
    phase: "IDLE",
    activeLine: -1,
    variables: {}
  };

  // Compute SVG layout for current snapshot
  const { nodes: svgNodes, edges: svgEdges } = computeTreeLayout(activeStep.treeSnapshot || treeRoot);

  // DYNAMIC OPERATION: Insert Node (BST)
  const handleInsert = () => {
    const val = Number(inputVal);
    if (isNaN(val)) return;

    const newSteps = [];
    const path = [];

    function insertHelper(node, treeCopy) {
      if (!node) {
        const leaf = createNode(val);
        newSteps.push({
          treeSnapshot: treeCopy,
          activeNodeVal: val,
          highlightPath: [...path],
          explanation: {
            action: `Inserted new leaf node [${val}] into tree!`,
            intuition: `Found the appropriate null leaf position honoring BST ordering. New node is attached.`,
            next: "Tree state stabilized. Height updated."
          },
          phase: "INSERTED",
          activeLine: 16,
          variables: { insertedVal: val, path: path.join(' ➔ ') },
          sound: 'insert'
        });
        return leaf;
      }

      path.push(node.val);
      const isLess = val < node.val;
      const isGreater = val > node.val;

      newSteps.push({
        treeSnapshot: treeCopy,
        activeNodeVal: node.val,
        comparingVal: val,
        highlightPath: [...path],
        explanation: {
          action: `Comparing target [${val}] with current node [${node.val}]`,
          intuition: isLess
            ? `${val} < ${node.val}: By BST definition, all values smaller than root must reside in the LEFT subtree.`
            : isGreater
              ? `${val} > ${node.val}: By BST definition, all values greater than root must reside in the RIGHT subtree.`
              : `Value ${val} already exists in BST. Duplicates typically ignored or handled by count.`,
          next: isLess ? `Branch LEFT toward ${node.left ? node.left.val : 'NULL'}.` : `Branch RIGHT toward ${node.right ? node.right.val : 'NULL'}.`
        },
        phase: "COMPARING",
        activeLine: isLess ? 12 : 14,
        variables: { currNode: node.val, targetVal: val, direction: isLess ? 'LEFT' : 'RIGHT' },
        sound: 'compare'
      });

      if (isLess) {
        node.left = insertHelper(node.left, treeCopy);
      } else if (isGreater) {
        node.right = insertHelper(node.right, treeCopy);
      }
      node.height = updateHeight(node);
      return node;
    }

    const workingRoot = cloneTree(treeRoot);
    const updatedRoot = insertHelper(workingRoot, workingRoot);

    newSteps.push({
      treeSnapshot: updatedRoot,
      activeNodeVal: val,
      highlightPath: [],
      explanation: {
        action: `Node [${val}] successfully incorporated into BST in O(log n) time.`,
        intuition: "BST allows binary division of the search space at each step, cutting remaining nodes in half.",
        next: "Ready for subsequent operations."
      },
      phase: "COMPLETE",
      activeLine: 17,
      variables: { rootVal: updatedRoot.val },
      sound: 'found'
    });

    setTreeRoot(updatedRoot);
    addLog(`> insert(${val}): Node added to BST.`);
    executeSteps(newSteps);
  };

  // DYNAMIC OPERATION: Delete Node (Handling 0, 1, 2 children)
  const handleDelete = (targetVal = null) => {
    const key = targetVal !== null ? targetVal : Number(deleteVal);
    if (isNaN(key)) return;

    const newSteps = [];
    const path = [];

    function findMinNode(node) {
      let curr = node;
      while (curr.left) curr = curr.left;
      return curr;
    }

    function deleteHelper(node, treeCopy) {
      if (!node) {
        newSteps.push({
          treeSnapshot: treeCopy,
          activeNodeVal: null,
          highlightPath: [...path],
          explanation: {
            action: `Key [${key}] was not found in the BST.`,
            intuition: "Reached null leaf without finding target key. No structural changes needed.",
            next: "Search terminated."
          },
          phase: "NOT_FOUND",
          activeLine: 21,
          variables: { key, result: 'null' },
          sound: 'delete'
        });
        return null;
      }

      path.push(node.val);

      if (key < node.val) {
        newSteps.push({
          treeSnapshot: treeCopy,
          activeNodeVal: node.val,
          comparingVal: key,
          highlightPath: [...path],
          explanation: {
            action: `Searching for key [${key}]: ${key} < ${node.val} ➔ Travesing LEFT`,
            intuition: "Target value is smaller than current node, so it can only exist in the left branch.",
            next: `Move to left child (${node.left ? node.left.val : 'NULL'}).`
          },
          phase: "SEARCHING",
          activeLine: 23,
          variables: { curr: node.val, key, branch: 'LEFT' },
          sound: 'compare'
        });
        node.left = deleteHelper(node.left, treeCopy);
      } else if (key > node.val) {
        newSteps.push({
          treeSnapshot: treeCopy,
          activeNodeVal: node.val,
          comparingVal: key,
          highlightPath: [...path],
          explanation: {
            action: `Searching for key [${key}]: ${key} > ${node.val} ➔ Traversing RIGHT`,
            intuition: "Target value is greater than current node, so it can only exist in the right branch.",
            next: `Move to right child (${node.right ? node.right.val : 'NULL'}).`
          },
          phase: "SEARCHING",
          activeLine: 25,
          variables: { curr: node.val, key, branch: 'RIGHT' },
          sound: 'compare'
        });
        node.right = deleteHelper(node.right, treeCopy);
      } else {
        // MATCH FOUND! Check child count
        const hasLeft = !!node.left;
        const hasRight = !!node.right;

        if (!hasLeft && !hasRight) {
          // Case 1: Leaf node (0 children)
          newSteps.push({
            treeSnapshot: treeCopy,
            activeNodeVal: node.val,
            highlightPath: [...path],
            explanation: {
              action: `MATCH FOUND: Node [${node.val}] is a LEAF (0 children)`,
              intuition: "Case 1: Leaf nodes have no subtree dependencies. Simply unbind parent's pointer to null.",
              next: "Prune node from tree."
            },
            phase: "DELETE_LEAF",
            activeLine: 28,
            variables: { deletingNode: node.val, children: 0 },
            sound: 'delete'
          });
          return null;
        } else if (!hasLeft || !hasRight) {
          // Case 2: 1 child
          const child = node.left || node.right;
          newSteps.push({
            treeSnapshot: treeCopy,
            activeNodeVal: node.val,
            highlightPath: [...path],
            explanation: {
              action: `MATCH FOUND: Node [${node.val}] has 1 CHILD (Node [${child.val}])`,
              intuition: "Case 2: Splice parent's pointer directly to this child, bypassing the deleted node.",
              next: `Promote child [${child.val}] into position of [${node.val}].`
            },
            phase: "DELETE_1_CHILD",
            activeLine: 29,
            variables: { deletingNode: node.val, promotingChild: child.val },
            sound: 'delete'
          });
          return child;
        } else {
          // Case 3: 2 children
          const succ = findMinNode(node.right);
          newSteps.push({
            treeSnapshot: treeCopy,
            activeNodeVal: node.val,
            successorVal: succ.val,
            highlightPath: [...path],
            explanation: {
              action: `MATCH FOUND: Node [${node.val}] has 2 CHILDREN. Finding In-Order Successor!`,
              intuition: "Case 3: Cannot simply delete node with two children. We find the In-Order Successor (smallest value in right subtree) to take its place while preserving BST ordering.",
              next: `Found successor [${succ.val}]. Swap values and delete successor node.`
            },
            phase: "SUCCESSOR_SEARCH",
            activeLine: 33,
            variables: { target: node.val, inOrderSuccessor: succ.val },
            sound: 'found'
          });

          // Swap value
          node.val = succ.val;
          newSteps.push({
            treeSnapshot: treeCopy,
            activeNodeVal: succ.val,
            successorVal: null,
            highlightPath: [...path],
            explanation: {
              action: `Copied successor value [${succ.val}] into target node!`,
              intuition: "Now we delete the original successor node from the right subtree (which is guaranteed to have at most 1 child).",
              next: `Delete duplicate leaf node [${succ.val}] from right subtree.`
            },
            phase: "SWAPPED_SUCCESSOR",
            activeLine: 34,
            variables: { nodeVal: node.val, rightSubtree: node.right.val },
            sound: 'rotate'
          });

          node.right = deleteHelper(node.right, treeCopy);
        }
      }

      node.height = updateHeight(node);
      return node;
    }

    const workingRoot = cloneTree(treeRoot);
    const updatedRoot = deleteHelper(workingRoot, workingRoot);

    newSteps.push({
      treeSnapshot: updatedRoot,
      activeNodeVal: null,
      highlightPath: [],
      explanation: {
        action: `Deletion of [${key}] completed successfully!`,
        intuition: "BST invariant (Left < Root < Right) is strictly preserved across all branches.",
        next: "Tree is balanced and ready."
      },
      phase: "COMPLETE",
      activeLine: 37,
      variables: { deletedKey: key },
      sound: 'delete'
    });

    setTreeRoot(updatedRoot);
    addLog(`> deleteNode(${key}): Node removed from BST.`);
    executeSteps(newSteps);
  };

  // DYNAMIC OPERATION: Search BST
  const handleSearch = () => {
    const target = Number(searchVal);
    if (isNaN(target)) return;

    const newSteps = [];
    const path = [];
    let curr = treeRoot;
    let found = false;

    while (curr) {
      path.push(curr.val);
      const isMatch = curr.val === target;
      const isLess = target < curr.val;

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: curr.val,
        comparingVal: target,
        highlightPath: [...path],
        explanation: {
          action: isMatch 
            ? `TARGET FOUND: Value [${target}] located!` 
            : `Comparing target [${target}] with Node [${curr.val}]: ${target} ${isLess ? '<' : '>'} ${curr.val}`,
          intuition: isMatch
            ? `Found key in ${path.length} comparisons! BST lookup is O(h) = O(log n).`
            : isLess 
              ? `${target} is smaller than ${curr.val} ➔ Following LEFT branch.`
              : `${target} is greater than ${curr.val} ➔ Following RIGHT branch.`,
          next: isMatch ? "Search complete." : `Inspect child node.`
        },
        phase: isMatch ? "FOUND" : "SEARCHING",
        activeLine: isMatch ? 20 : (isLess ? 23 : 25),
        variables: { current: curr.val, target, stepCount: path.length },
        sound: isMatch ? 'found' : 'compare'
      });

      if (isMatch) {
        found = true;
        break;
      }
      curr = isLess ? curr.left : curr.right;
    }

    if (!found) {
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: null,
        highlightPath: [...path],
        explanation: {
          action: `Target [${target}] was not found in the BST.`,
          intuition: "Hit null leaf pointer without finding target.",
          next: "Search terminated."
        },
        phase: "NOT_FOUND",
        activeLine: 21,
        variables: { target, result: 'NOT_FOUND' },
        sound: 'delete'
      });
    }

    addLog(`> search(${target}): ${found ? 'Found in BST' : 'Not found'}.`);
    executeSteps(newSteps);
  };

  // DYNAMIC OPERATION: Traversals (Inorder, Preorder, Postorder, Level-order)
  const handleTraversal = (type = 'inorder') => {
    setTraversalOutput([]);
    const newSteps = [];
    const order = [];

    function traverseIn(node) {
      if (!node) return;
      traverseIn(node.left);
      order.push(node.val);
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        traversalItem: node.val,
        explanation: {
          action: `In-Order: Visited Node [${node.val}] (Left ➔ ROOT ➔ Right)`,
          intuition: "In-Order traversal of a BST visits nodes in strictly ASCENDING sorted order!",
          next: "Proceed to right subtree."
        },
        phase: "INORDER_VISIT",
        activeLine: 12,
        variables: { visited: node.val, orderLength: order.length },
        sound: 'compare'
      });
      traverseIn(node.right);
    }

    function traversePre(node) {
      if (!node) return;
      order.push(node.val);
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        traversalItem: node.val,
        explanation: {
          action: `Pre-Order: Visited Node [${node.val}] (ROOT ➔ Left ➔ Right)`,
          intuition: "Pre-Order visits parent before children, ideal for cloning or serializing trees.",
          next: "Traverse left subtree."
        },
        phase: "PREORDER_VISIT",
        activeLine: 10,
        variables: { visited: node.val },
        sound: 'compare'
      });
      traversePre(node.left);
      traversePre(node.right);
    }

    function traversePost(node) {
      if (!node) return;
      traversePost(node.left);
      traversePost(node.right);
      order.push(node.val);
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        traversalItem: node.val,
        explanation: {
          action: `Post-Order: Visited Node [${node.val}] (Left ➔ Right ➔ ROOT)`,
          intuition: "Post-Order visits children first, ideal for calculating subtree sizes or deleting trees.",
          next: "Ascend to parent node."
        },
        phase: "POSTORDER_VISIT",
        activeLine: 14,
        variables: { visited: node.val },
        sound: 'compare'
      });
    }

    function traverseLevel(root) {
      if (!root) return;
      const q = [root];
      while (q.length > 0) {
        const curr = q.shift();
        order.push(curr.val);
        newSteps.push({
          treeSnapshot: treeRoot,
          activeNodeVal: curr.val,
          traversalItem: curr.val,
          explanation: {
            action: `Level-Order (BFS): Dequeued Node [${curr.val}]`,
            intuition: "Level-Order processes nodes row-by-row using a FIFO Queue.",
            next: `Enqueue children (${curr.left ? curr.left.val : ''} ${curr.right ? curr.right.val : ''}).`
          },
          phase: "LEVEL_VISIT",
          activeLine: 15,
          variables: { dequeued: curr.val, queueRemaining: q.length },
          sound: 'compare'
        });
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
      }
    }

    if (type === 'inorder') traverseIn(treeRoot);
    else if (type === 'preorder') traversePre(treeRoot);
    else if (type === 'postorder') traversePost(treeRoot);
    else if (type === 'levelorder') traverseLevel(treeRoot);

    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: null,
      explanation: {
        action: `${type.toUpperCase()} Traversal Complete! Output: [${order.join(', ')}]`,
        intuition: `Visited all ${order.length} nodes in O(n) linear time.`,
        next: "Ready for next command."
      },
      phase: "COMPLETE",
      activeLine: 16,
      variables: { totalNodes: order.length },
      sound: 'found'
    });

    addLog(`> ${type}Traversal(): Completed. Output = [${order.join(', ')}].`);
    executeSteps(newSteps);
  };

  // Reset tree
  const handleReset = () => {
    const root = createNode(50);
    root.left = createNode(25);
    root.right = createNode(75);
    root.left.left = createNode(15);
    root.left.right = createNode(35);
    root.right.left = createNode(60);
    root.right.right = createNode(85);

    setTreeRoot(root);
    setSteps([]);
    setCurrentStepIdx(0);
    setTraversalOutput([]);
    setIsPlaying(false);
    addLog(`> Tree reset to default 7-node balanced BST.`);
  };

  // Controls Slot for ResponsiveVisualizerShell
  const controlsSlot = (
    <div className="flex flex-col gap-4">
      {/* Back to Tree Catalog */}
      <Link
        to="/visualizer/tree"
        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
      >
        <span>‹ Back to 12 Tree Cards</span>
      </Link>

      {/* Algorithm Quick Switcher Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Select Tree Concept</label>
        <select
          value={algoId || 'bst'}
          onChange={(e) => navigate(`/visualizer/tree/${e.target.value}`)}
          className="w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        >
          {TREE_ALGORITHMS.map(a => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.tag})
            </option>
          ))}
        </select>
      </div>

      {/* Tree Architecture Toggle */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Tree Mode</label>
        <div className="grid grid-cols-2 gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setTreeMode('bst')}
            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
              treeMode === 'bst' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-white'
            }`}
          >
            Binary Search Tree (BST)
          </button>
          <button
            onClick={() => setTreeMode('avl')}
            className={`py-1.5 text-xs font-bold rounded-md transition-all ${
              treeMode === 'avl' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-white'
            }`}
          >
            AVL Tree (Self-Balancing)
          </button>
        </div>
      </div>

      {/* Dynamic Insertion Section */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-teal-500/5 border border-teal-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
            <Plus size={14} /> Insert Node Dynamically
          </span>
          <span className="text-[10px] text-gray-400">BST Placement</span>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="flex-1 bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
            placeholder="Node Value"
          />
          <button
            onClick={handleInsert}
            className="py-1.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Insert BST
          </button>
        </div>
      </div>

      {/* Dynamic Deletion Section */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Trash2 size={14} /> Delete Node Dynamically
          </span>
          <span className="text-[10px] text-gray-400">Click node or by value</span>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={deleteVal}
            onChange={e => setDeleteVal(e.target.value)}
            className="flex-1 bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
            placeholder="Delete Value"
          />
          <button
            onClick={() => handleDelete()}
            className="py-1.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Delete Node
          </button>
        </div>
        <p className="text-[10px] text-gray-400 italic">
          Handles all 3 cases: 0 children (leaf), 1 child (splice), 2 children (in-order successor swap).
        </p>
      </div>

      {/* Search BST */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
          <Search size={14} /> Search Value
        </span>
        <div className="flex gap-2">
          <input
            type="number"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="flex-1 bg-white dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
            placeholder="Search Value"
          />
          <button
            onClick={handleSearch}
            className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Search
          </button>
        </div>
      </div>

      {/* Traversals */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Tree Traversals</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleTraversal('inorder')}
            className="py-1.5 px-2 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold hover:border-teal-500 transition-all text-left"
          >
            In-Order (Sorted)
          </button>
          <button
            onClick={() => handleTraversal('preorder')}
            className="py-1.5 px-2 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold hover:border-teal-500 transition-all text-left"
          >
            Pre-Order (Clone)
          </button>
          <button
            onClick={() => handleTraversal('postorder')}
            className="py-1.5 px-2 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold hover:border-teal-500 transition-all text-left"
          >
            Post-Order (Bottom-Up)
          </button>
          <button
            onClick={() => handleTraversal('levelorder')}
            className="py-1.5 px-2 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold hover:border-teal-500 transition-all text-left"
          >
            Level-Order (BFS)
          </button>
        </div>
      </div>

      {/* Sound & Reset */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} className="text-teal-400" />}
          <span>{isMuted ? 'Sound Muted' : 'Synthesizer Active'}</span>
        </button>
        <button
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} /> Reset Tree
        </button>
      </div>
    </div>
  );

  return (
    <ResponsiveVisualizerShell
      title="Binary Tree & BST"
      subtitle="Hierarchical tree with left-smaller, right-larger invariant and self-balancing rotations."
      currentPath="/visualizer/tree"
      category="ds"
      controls={controlsSlot}
      metrics={
        <ComplexityBadge
          timeComplexity={{
            average: "O(log n) Search/Insert/Delete",
            worst: "O(n) Skewed | O(log n) AVL"
          }}
          spaceComplexity="O(h) Call Stack"
          activeOperation={activeStep.phase}
          notes="Subtrees maintain the binary search invariant: Left < Root < Right."
        />
      }
      codeInspector={
        <CodeInspector
          codeSnippets={CODE_SNIPPETS}
          activeLine={activeStep.activeLine}
          variables={activeStep.variables}
          title="Tree Source Implementation"
        />
      }
      consoleOutput={logs}
      playback={
        <VisualizerPlaybackBar
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onStepForward={() => setCurrentStepIdx(prev => Math.min(prev + 1, steps.length - 1))}
          onStepBackward={() => setCurrentStepIdx(prev => Math.max(prev - 1, 0))}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStepIdx + 1}
          totalSteps={Math.max(steps.length, 1)}
        />
      }
    >
      <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto w-full max-w-5xl mx-auto gap-4">
        {/* ELI5 Intuition Card */}
        <div className="bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md border border-teal-500/20 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-teal-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
                ELI5 Intuition: Tree Structure & Successor Mechanics
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-teal-500/10 text-teal-500 border border-teal-500/30">
              PHASE: {activeStep.phase}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/5 border border-teal-500/10">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                🎯 What's Happening
              </span>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                {activeStep.explanation?.action || "Ready for operation."}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                💡 Why It Happens (Intuition)
              </span>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                {activeStep.explanation?.intuition || "BST splits search space by half at each comparison."}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                🔮 What Happens Next
              </span>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                {activeStep.explanation?.next || "Click any node circle to delete it."}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic SVG Tree Canvas */}
        <div className="flex-1 min-h-[380px] bg-white/50 dark:bg-[#0c0c0e]/80 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute top-3 left-4 text-xs font-semibold text-gray-400 flex items-center gap-2">
            <span>Mode: <strong className="text-teal-500 uppercase">{treeMode}</strong></span>
            <span>•</span>
            <span>Nodes: <strong className="text-teal-500">{svgNodes.length}</strong></span>
          </div>

          <svg className="w-full h-[340px] select-none">
            {/* Edges */}
            {svgEdges.map(edge => (
              <line
                key={edge.id}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke="currentColor"
                strokeWidth={2.5}
                className="text-gray-300 dark:text-white/20 transition-all duration-300"
              />
            ))}

            {/* Nodes */}
            {svgNodes.map(node => {
              const isActive = activeStep.activeNodeVal === node.val;
              const isComparing = activeStep.comparingVal === node.val;
              const isSuccessor = activeStep.successorVal === node.val;
              const isPath = activeStep.highlightPath?.includes(node.val);

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleDelete(node.val)}
                  className="cursor-pointer group"
                >
                  {/* Outer glow ring for active / successor */}
                  {(isActive || isSuccessor || isPath) && (
                    <circle
                      r={26}
                      fill="none"
                      stroke={isSuccessor ? '#F59E0B' : isActive ? '#14B8A6' : '#3B82F6'}
                      strokeWidth={3}
                      strokeDasharray="4 3"
                      className="animate-spin"
                      style={{ animationDuration: '4s' }}
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={20}
                    fill={
                      isSuccessor
                        ? '#F59E0B'
                        : isActive
                          ? '#14B8A6'
                          : isPath
                            ? '#2563EB'
                            : '#18181b'
                    }
                    stroke={
                      isSuccessor
                        ? '#FCD34D'
                        : isActive
                          ? '#5EEAD4'
                          : '#3F3F46'
                    }
                    strokeWidth={2.5}
                    className="transition-all duration-300 group-hover:scale-110 shadow-lg"
                  />

                  {/* Value Text */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fill="white"
                    fontSize={13}
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {node.val}
                  </text>

                  {/* Balance factor pill in AVL mode */}
                  {treeMode === 'avl' && (
                    <g transform="translate(14, -14)">
                      <circle r={8} fill="#3F3F46" />
                      <text
                        textAnchor="middle"
                        dy=".35em"
                        fill="#A1A1AA"
                        fontSize={9}
                        fontWeight="bold"
                      >
                        {node.bf}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Traversal Output Ribbon */}
          {traversalOutput.length > 0 && (
            <div className="w-full mt-2 p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-black tracking-wider uppercase text-teal-600 dark:text-teal-400 whitespace-nowrap">
                Traversal Output:
              </span>
              <div className="flex items-center gap-1.5 flex-1">
                {traversalOutput.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-teal-500 text-black text-xs font-mono font-bold shadow-xs"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="absolute bottom-2 text-center text-xs text-gray-400">
            💡 <em>Tip: Click on any circle node to delete it with animated 0/1/2-child handling!</em>
          </div>
        </div>
      </div>
    </ResponsiveVisualizerShell>
  );
}
