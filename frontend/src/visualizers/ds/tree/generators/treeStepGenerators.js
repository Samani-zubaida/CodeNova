import {
  createNode,
  cloneTree,
  getAllTreeNodes,
  getNodeHeight,
  getBalanceFactor,
  updateHeights
} from '../utils/treeLayout';

// 1. ADD NODE BY PARENT
export function generateAddByParentSteps(treeRoot, parentVal, side, val) {
  const newSteps = [];
  const cloned = cloneTree(treeRoot);
  const parent = getAllTreeNodes(cloned).find(n => n.val === parentVal);

  if (!parent) {
    return { error: `Parent node [${parentVal}] not found in tree.` };
  }

  // Step 1: Target parent node
  newSteps.push({
    treeSnapshot: cloneTree(cloned),
    activeNodeVal: parent.val,
    explanation: {
      action: `Targeting Parent Node [${parent.val}]`,
      intuition: `Preparing to attach new child with value ${val} on the ${side.toUpperCase()} branch.`
    },
    phase: "LOCATE_PARENT",
    codeStatement: `Node parent = findNode(root, ${parentVal});`,
    sound: 'compare'
  });

  // Step 2: Highlight branch attachment
  const newNode = createNode(val);
  if (side === 'left') parent.left = newNode;
  else parent.right = newNode;
  updateHeights(cloned);

  newSteps.push({
    treeSnapshot: cloneTree(cloned),
    activeNodeVal: val,
    branchEdge: { parentVal: parent.val, childSide: side },
    nodeAnnotations: { [val]: { text: 'NEW +', color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' } },
    explanation: {
      action: `Attached Child [${val}] to ${side.toUpperCase()} of Parent [${parent.val}]`,
      intuition: `Pointer link established: parent.${side} = new Node(${val}). Heights updated.`
    },
    phase: "ATTACH_CHILD",
    codeStatement: `parent.${side} = new Node(${val});`,
    sound: 'insert'
  });

  return { newSteps, newRoot: cloned };
}

// 2. BST INSERTION
export function generateBSTInsertSteps(treeRoot, val) {
  const newSteps = [];
  const cloned = cloneTree(treeRoot);
  const stack = [];

  function insertHelper(node, parent = null, branch = null) {
    if (!node) {
      const created = createNode(val);
      if (parent) {
        if (branch === 'left') parent.left = created;
        else if (branch === 'right') parent.right = created;
      }
      stack.push({ val, label: `new Node(${val})` });
      newSteps.push({
        treeSnapshot: cloneTree(parent ? cloned : created),
        activeNodeVal: val,
        recursionArrow: parent ? { from: parent.val, to: val, label: 'attach' } : null,
        nodeAnnotations: { [val]: { text: 'INSERTED', color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
        explanation: {
          action: `Reached null pointer. Inserted new Node [${val}]!`,
          intuition: `BST Property satisfied: Left < Root < Right.`
        },
        phase: "INSERTED",
        codeStatement: `return new Node(${val});`,
        stack: stack.map(s => s.val),
        sound: 'insert'
      });
      return created;
    }

    stack.push({ val: node.val, label: `insert(${node.val})` });

    const goLeft = val < node.val;
    newSteps.push({
      treeSnapshot: cloneTree(cloned),
      activeNodeVal: node.val,
      comparingVal: val,
      recursionArrow: parent ? { from: parent.val, to: node.val, label: 'search' } : null,
      nodeAnnotations: {
        [node.val]: {
          text: goLeft ? `${val} < ${node.val} (Left)` : `${val} > ${node.val} (Right)`,
          color: '#F0E2A4',
          bg: 'rgba(240, 226, 164, 0.25)'
        }
      },
      explanation: {
        action: `Comparing ${val} with Node [${node.val}]`,
        intuition: goLeft
          ? `${val} < ${node.val} → Recurse down into Left subtree.`
          : `${val} >= ${node.val} → Recurse down into Right subtree.`
      },
      phase: "COMPARE",
      codeStatement: goLeft ? `if (${val} < ${node.val}) root.left = insert(root.left, ${val});` : `root.right = insert(root.right, ${val});`,
      stack: stack.map(s => s.val),
      sound: 'compare'
    });

    if (goLeft) {
      node.left = insertHelper(node.left, node, 'left');
    } else {
      node.right = insertHelper(node.right, node, 'right');
    }

    node.height = 1 + Math.max(getNodeHeight(node.left), getNodeHeight(node.right));
    stack.pop();
    return node;
  }

  const updatedRoot = insertHelper(cloned);
  return { newSteps, newRoot: updatedRoot };
}

// 3. BST SEARCH
export function generateSearchSteps(treeRoot, target) {
  const newSteps = [];
  const path = [];

  function searchHelper(node, parent = null) {
    if (!node) {
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: null,
        highlightPath: [...path],
        stack: [...path],
        traversalSeq: [...path],
        explanation: {
          action: `Reached null reference. Value [${target}] NOT FOUND!`,
          intuition: `Target ${target} is not in the BST.`
        },
        phase: "NOT_FOUND",
        codeStatement: `if (root == null) return false;`,
        sound: 'delete'
      });
      return;
    }

    path.push(node.val);

    if (node.val === target) {
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        highlightPath: [...path],
        stack: [...path],
        traversalSeq: [...path],
        nodeAnnotations: { [node.val]: { text: 'FOUND! ★', color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.3)' } },
        explanation: {
          action: `Match! Target [${target}] FOUND at Node [${node.val}]!`,
          intuition: `Target matches current node value. Search terminates in O(h) time.`
        },
        phase: "FOUND",
        codeStatement: `if (root.val == ${target}) return true;`,
        sound: 'found'
      });
      return;
    }

    const goLeft = target < node.val;
    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      comparingVal: target,
      highlightPath: [...path],
      stack: [...path],
      traversalSeq: [...path],
      recursionArrow: parent ? { from: parent.val, to: node.val, label: 'search' } : null,
      nodeAnnotations: {
        [node.val]: {
          text: goLeft ? `${target} < ${node.val} (Left)` : `${target} > ${node.val} (Right)`,
          color: '#F0E2A4',
          bg: 'rgba(240, 226, 164, 0.25)'
        }
      },
      explanation: {
        action: `Inspect Node [${node.val}]: ${target} ${goLeft ? '<' : '>'} ${node.val}`,
        intuition: goLeft ? `Recurse into left subtree.` : `Recurse into right subtree.`
      },
      phase: "SEARCH_COMPARE",
      codeStatement: goLeft ? `return search(root.left, ${target});` : `return search(root.right, ${target});`,
      sound: 'compare'
    });

    if (goLeft) searchHelper(node.left, node);
    else searchHelper(node.right, node);
  }

  searchHelper(treeRoot);
  return { newSteps };
}

// 4. BST DELETE
export function generateDeleteSteps(treeRoot, key) {
  const newSteps = [];
  const cloned = cloneTree(treeRoot);
  const deleteStack = [];

  function findMin(node) {
    let curr = node;
    while (curr && curr.left) curr = curr.left;
    return curr;
  }

  function deleteHelper(root, target, parent = null) {
    if (!root) {
      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: null,
        stack: [...deleteStack],
        explanation: { action: `Value [${target}] not found to delete.`, intuition: "Search completed without match." },
        phase: "DELETE_FAILED",
        codeStatement: `if (root == null) return null;`,
        sound: 'compare'
      });
      return null;
    }

    deleteStack.push(root.val);

    newSteps.push({
      treeSnapshot: cloneTree(cloned),
      activeNodeVal: root.val,
      comparingVal: target,
      stack: [...deleteStack],
      recursionArrow: parent ? { from: parent.val, to: root.val, label: 'search' } : null,
      explanation: {
        action: `Searching for [${target}] to delete at Node [${root.val}]`,
        intuition: target < root.val ? `Target < ${root.val} → Traverse Left.` : target > root.val ? `Target > ${root.val} → Traverse Right.` : `MATCH! Preparing deletion.`
      },
      phase: "DELETE_SEARCH",
      codeStatement: target < root.val ? `root.left = delete(root.left, ${target});` : target > root.val ? `root.right = delete(root.right, ${target});` : `// Node found: ${target}`,
      sound: 'compare'
    });

    if (target < root.val) {
      root.left = deleteHelper(root.left, target, root);
    } else if (target > root.val) {
      root.right = deleteHelper(root.right, target, root);
    } else {
      // Case 1: Leaf
      if (!root.left && !root.right) {
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: root.val,
          stack: [...deleteStack],
          nodeAnnotations: { [root.val]: { text: 'DELETED ✕', color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' } },
          explanation: {
            action: `Case 1: Node [${root.val}] is a leaf node.`,
            intuition: `Remove node by setting parent pointer to null.`
          },
          phase: "DELETE_LEAF",
          codeStatement: `return null;`,
          sound: 'delete'
        });
        deleteStack.pop();
        return null;
      }
      // Case 2: One child
      if (!root.left) {
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: root.val,
          stack: [...deleteStack],
          nodeAnnotations: { [root.val]: { text: `REPLACED ➔ ${root.right.val}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
          explanation: {
            action: `Case 2: Node [${root.val}] has only Right child [${root.right.val}].`,
            intuition: `Bypass current node with its right child.`
          },
          phase: "DELETE_ONE_CHILD",
          codeStatement: `return root.right;`,
          sound: 'delete'
        });
        deleteStack.pop();
        return root.right;
      } else if (!root.right) {
        newSteps.push({
          treeSnapshot: cloneTree(cloned),
          activeNodeVal: root.val,
          stack: [...deleteStack],
          nodeAnnotations: { [root.val]: { text: `REPLACED ➔ ${root.left.val}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
          explanation: {
            action: `Case 2: Node [${root.val}] has only Left child [${root.left.val}].`,
            intuition: `Bypass current node with its left child.`
          },
          phase: "DELETE_ONE_CHILD",
          codeStatement: `return root.left;`,
          sound: 'delete'
        });
        deleteStack.pop();
        return root.left;
      }
      // Case 3: Two children
      const succ = findMin(root.right);
      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: root.val,
        comparingVal: succ.val,
        stack: [...deleteStack],
        nodeAnnotations: {
          [root.val]: { text: `REPLACE WITH ${succ.val}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' },
          [succ.val]: { text: 'SUCCESSOR', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' }
        },
        explanation: {
          action: `Case 3: Node [${root.val}] has two children. Finding In-Order Successor [${succ.val}].`,
          intuition: `Replace node value with smallest value in right subtree (${succ.val}), then delete successor.`
        },
        phase: "DELETE_TWO_CHILDREN",
        codeStatement: `root.val = minValue(root.right); root.right = delete(root.right, root.val);`,
        sound: 'compare'
      });
      root.val = succ.val;
      root.right = deleteHelper(root.right, succ.val, root);
    }

    root.height = 1 + Math.max(getNodeHeight(root.left), getNodeHeight(root.right));
    deleteStack.pop();
    return root;
  }

  const updatedRoot = deleteHelper(cloned, key);
  return { newSteps, newRoot: updatedRoot };
}

// 5. TRAVERSALS
export function generateTraversalSteps(treeRoot, type) {
  const newSteps = [];
  const order = [];
  const stack = [];

  // In-Order
  function traverseIn(node, parent = null) {
    if (!node) return;
    stack.push(node.val);

    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      recursionArrow: parent ? { from: parent.val, to: node.val, label: 'dfs(left)' } : null,
      explanation: {
        action: `⬇ In-Order: Recurse into Left subtree of [${node.val}]`,
        intuition: "In-Order rule: (Left Subtree -> Current Node -> Right Subtree). Pushing frame to stack."
      },
      phase: "INORDER_LEFT",
      codeStatement: `inOrder(root.left);`,
      stack: [...stack],
      traversalSeq: [...order],
      sound: 'compare'
    });

    traverseIn(node.left, node);

    order.push(node.val);
    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      traversalItem: node.val,
      traversalSeq: [...order],
      nodeAnnotations: { [node.val]: { text: `#${order.length}`, color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' } },
      explanation: {
        action: `Visited Node [${node.val}]! Visit Order #${order.length}`,
        intuition: `Left subtree is complete. Process current node ${node.val}. Stored in output array.`
      },
      phase: "VISITING",
      codeStatement: `visit(root.val); // #${order.length}`,
      stack: [...stack],
      sound: 'found'
    });

    traverseIn(node.right, node);

    const popped = stack.pop();
    if (stack.length > 0) {
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: stack[stack.length - 1],
        traversalSeq: [...order],
        stack: [...stack],
        explanation: {
          action: `Popped [${popped}] from Stack (Backtrack)`,
          intuition: `Subtree of [${popped}] complete. Backtracking to parent [${stack[stack.length - 1]}].`
        },
        phase: "BACKTRACK",
        codeStatement: `// backtrack`,
        sound: 'compare'
      });
    }
  }

  // Pre-Order
  function traversePre(node, parent = null) {
    if (!node) return;
    stack.push(node.val);
    order.push(node.val);

    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      traversalItem: node.val,
      traversalSeq: [...order],
      nodeAnnotations: { [node.val]: { text: `#${order.length}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
      recursionArrow: parent ? { from: parent.val, to: node.val, label: 'preorder' } : null,
      explanation: {
        action: `Pre-Order: Visited Node [${node.val}] FIRST (Order #${order.length})`,
        intuition: "Pre-Order rule: (Root -> Left -> Right). Process root before subtrees."
      },
      phase: "VISITING",
      codeStatement: `visit(root.val); // #${order.length}`,
      stack: [...stack],
      sound: 'found'
    });

    traversePre(node.left, node);
    traversePre(node.right, node);

    const popped = stack.pop();
    if (stack.length > 0) {
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: stack[stack.length - 1],
        traversalSeq: [...order],
        stack: [...stack],
        explanation: {
          action: `Popped [${popped}] from Stack (Backtrack)`,
          intuition: `Subtrees of [${popped}] complete. Backtracking to parent [${stack[stack.length - 1]}].`
        },
        phase: "BACKTRACK",
        codeStatement: `// backtrack`,
        sound: 'compare'
      });
    }
  }

  // Post-Order
  function traversePost(node, parent = null) {
    if (!node) return;
    stack.push(node.val);

    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      recursionArrow: parent ? { from: parent.val, to: node.val, label: 'descend' } : null,
      explanation: {
        action: `⬇ Post-Order: Inspecting subtrees of Node [${node.val}]`,
        intuition: "Post-Order rule: (Left -> Right -> Root). Visit root only after both subtrees are complete."
      },
      phase: "POSTORDER_SUBTREES",
      codeStatement: `postOrder(root.left); postOrder(root.right);`,
      stack: [...stack],
      traversalSeq: [...order],
      sound: 'compare'
    });

    traversePost(node.left, node);
    traversePost(node.right, node);

    order.push(node.val);
    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      traversalItem: node.val,
      traversalSeq: [...order],
      nodeAnnotations: { [node.val]: { text: `#${order.length}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
      explanation: {
        action: `Post-Order: Visited Node [${node.val}]! Visit Order #${order.length}`,
        intuition: "Both children resolved. Now safe to process root."
      },
      phase: "VISITING",
      codeStatement: `visit(root.val); // #${order.length}`,
      stack: [...stack],
      sound: 'found'
    });

    const popped = stack.pop();
    if (stack.length > 0) {
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: stack[stack.length - 1],
        traversalSeq: [...order],
        stack: [...stack],
        explanation: {
          action: `Popped [${popped}] from Stack (Backtrack)`,
          intuition: `Finished node [${popped}]. Returning to parent [${stack[stack.length - 1]}].`
        },
        phase: "BACKTRACK",
        codeStatement: `// backtrack`,
        sound: 'compare'
      });
    }
  }

  // Level-Order (BFS)
  function traverseLevel() {
    const q = [treeRoot];
    const queueDisplay = [treeRoot.val];

    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: treeRoot.val,
      queue: [...queueDisplay],
      traversalSeq: [...order],
      explanation: {
        action: `Level-Order: Initialized queue with Root [${treeRoot.val}]`,
        intuition: "Breadth-First Search: Enqueue root, then process level by level."
      },
      phase: "ENQUEUE_ROOT",
      codeStatement: `Queue q = new LinkedList(); q.add(root);`,
      sound: 'compare'
    });

    while (q.length > 0) {
      const curr = q.shift();
      queueDisplay.shift();
      order.push(curr.val);

      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: curr.val,
        traversalItem: curr.val,
        traversalSeq: [...order],
        queue: [...queueDisplay],
        nodeAnnotations: { [curr.val]: { text: `L-Order #${order.length}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
        explanation: {
          action: `Dequeued & Visited Node [${curr.val}]! Order #${order.length}`,
          intuition: `Processed node ${curr.val}. Now checking its children to enqueue.`
        },
        phase: "DEQUEUE_VISIT",
        codeStatement: `Node curr = q.poll(); visit(curr);`,
        sound: 'found'
      });

      if (curr.left) {
        q.push(curr.left);
        queueDisplay.push(curr.left.val);
        newSteps.push({
          treeSnapshot: treeRoot,
          activeNodeVal: curr.left.val,
          queue: [...queueDisplay],
          traversalSeq: [...order],
          explanation: {
            action: `Enqueued Left Child [${curr.left.val}]`,
            intuition: `Discovered left child of [${curr.val}]. Pushing into FIFO queue entry.`
          },
          phase: "ENQUEUE_CHILD",
          codeStatement: `q.add(curr.left); // ${curr.left.val}`,
          sound: 'insert'
        });
      }

      if (curr.right) {
        q.push(curr.right);
        queueDisplay.push(curr.right.val);
        newSteps.push({
          treeSnapshot: treeRoot,
          activeNodeVal: curr.right.val,
          queue: [...queueDisplay],
          traversalSeq: [...order],
          explanation: {
            action: `Enqueued Right Child [${curr.right.val}]`,
            intuition: `Discovered right child of [${curr.val}]. Pushing into FIFO queue entry.`
          },
          phase: "ENQUEUE_CHILD",
          codeStatement: `q.add(curr.right); // ${curr.right.val}`,
          sound: 'insert'
        });
      }
    }
  }

  if (type === 'inorder') traverseIn(treeRoot);
  else if (type === 'preorder') traversePre(treeRoot);
  else if (type === 'postorder') traversePost(treeRoot);
  else if (type === 'levelorder' || type === 'bfs') traverseLevel();

  return { newSteps, order };
}

// 6. AVL TREE ROTATIONS
export function generateAVLInsertSteps(treeRoot, val) {
  const newSteps = [];
  const cloned = cloneTree(treeRoot);

  function rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = 1 + Math.max(getNodeHeight(y.left), getNodeHeight(y.right));
    x.height = 1 + Math.max(getNodeHeight(x.left), getNodeHeight(x.right));
    return x;
  }

  function leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = 1 + Math.max(getNodeHeight(x.left), getNodeHeight(x.right));
    y.height = 1 + Math.max(getNodeHeight(y.left), getNodeHeight(y.right));
    return y;
  }

  function avlHelper(node, parent = null) {
    if (!node) {
      const created = createNode(val);
      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: val,
        nodeAnnotations: { [val]: { text: 'AVL INSERTED', color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
        explanation: {
          action: `Inserted new leaf Node [${val}] (Height 1).`,
          intuition: `Leaf added. Now backtracking up to verify balance factor at each ancestor.`
        },
        phase: "AVL_INSERT",
        codeStatement: `return new AVLNode(${val});`,
        sound: 'insert'
      });
      return created;
    }

    if (val < node.val) {
      node.left = avlHelper(node.left, node);
    } else if (val > node.val) {
      node.right = avlHelper(node.right, node);
    } else {
      return node;
    }

    node.height = 1 + Math.max(getNodeHeight(node.left), getNodeHeight(node.right));
    const balance = getBalanceFactor(node);

    newSteps.push({
      treeSnapshot: cloneTree(cloned),
      activeNodeVal: node.val,
      nodeAnnotations: {
        [node.val]: {
          text: `BF: ${balance >= 0 ? '+' + balance : balance} (h=${node.height})`,
          color: Math.abs(balance) > 1 ? '#AB526B' : '#C5CEAE',
          bg: Math.abs(balance) > 1 ? 'rgba(171, 82, 107, 0.25)' : 'rgba(197, 206, 174, 0.25)'
        }
      },
      explanation: {
        action: `Node [${node.val}]: Height=${node.height}, Balance Factor = ${balance}`,
        intuition: Math.abs(balance) > 1
          ? `|Balance Factor| > 1! Tree is UNBALANCED at [${node.val}]. Triggering Rotation.`
          : `Balance factor is within [-1, +1]. Node is balanced.`
      },
      phase: Math.abs(balance) > 1 ? "UNBALANCED_DETECTED" : "BALANCED_CHECK",
      codeStatement: `int balance = getBalance(root); // ${balance}`,
      sound: Math.abs(balance) > 1 ? 'rotate' : 'compare'
    });

    // LL Case
    if (balance > 1 && val < node.left.val) {
      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: node.val,
        nodeAnnotations: { [node.val]: { text: 'LL ROTATION ↷', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.3)' } },
        explanation: {
          action: `LL Case: Right Rotation around Node [${node.val}]`,
          intuition: `Left-heavy left subtree. Performing single Right Rotation to restore balance.`
        },
        phase: "ROTATE_LL",
        codeStatement: `return rightRotate(root);`,
        sound: 'rotate'
      });
      return rightRotate(node);
    }

    // RR Case
    if (balance < -1 && val > node.right.val) {
      newSteps.push({
        treeSnapshot: cloneTree(cloned),
        activeNodeVal: node.val,
        nodeAnnotations: { [node.val]: { text: 'RR ROTATION ↶', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.3)' } },
        explanation: {
          action: `RR Case: Left Rotation around Node [${node.val}]`,
          intuition: `Right-heavy right subtree. Performing single Left Rotation to restore balance.`
        },
        phase: "ROTATE_RR",
        codeStatement: `return leftRotate(root);`,
        sound: 'rotate'
      });
      return leftRotate(node);
    }

    // LR Case
    if (balance > 1 && val > node.left.val) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }

    // RL Case
    if (balance < -1 && val < node.right.val) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }

    return node;
  }

  const balancedRoot = avlHelper(cloned);
  return { newSteps, newRoot: balancedRoot };
}

// 7. LCA
export function generateLCASteps(treeRoot, p, q) {
  const newSteps = [];
  const pathP = [];
  const pathQ = [];

  function getPath(root, target, path) {
    if (!root) return false;
    path.push(root.val);
    if (root.val === target) return true;
    if (getPath(root.left, target, path) || getPath(root.right, target, path)) {
      return true;
    }
    path.pop();
    return false;
  }

  getPath(treeRoot, p, pathP);
  getPath(treeRoot, q, pathQ);

  let lca = null;
  const minLen = Math.min(pathP.length, pathQ.length);
  for (let i = 0; i < minLen; i++) {
    if (pathP[i] === pathQ[i]) {
      lca = pathP[i];
    } else {
      break;
    }
  }

  newSteps.push({
    treeSnapshot: treeRoot,
    activeNodeVal: lca,
    lcaNodeVal: lca,
    pathP: [...pathP],
    pathQ: [...pathQ],
    nodeAnnotations: {
      [lca]: { text: `★ LCA: ${lca}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.35)' },
      [p]: { text: `P: ${p}`, color: '#AB526B', bg: 'rgba(171, 82, 107, 0.2)' },
      [q]: { text: `Q: ${q}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.2)' }
    },
    explanation: {
      action: `LCA FOUND: Node [${lca}] is the Lowest Common Ancestor of ${p} and ${q}!`,
      intuition: `Deepest node common to path(${p}): [${pathP.join('→')}] and path(${q}): [${pathQ.join('→')}].`
    },
    phase: "LCA_FOUND",
    codeStatement: `return lca; // ${lca}`,
    sound: 'found'
  });

  return { newSteps, lca };
}

// 8. MAX DEPTH
export function generateMaxDepthSteps(treeRoot) {
  const newSteps = [];
  const depthStack = [];

  function depthHelper(node, parent = null) {
    if (!node) return 0;
    depthStack.push({ val: node.val, label: `maxDepth(${node.val})` });

    const leftH = depthHelper(node.left, node);
    const rightH = depthHelper(node.right, node);
    const h = 1 + Math.max(leftH, rightH);

    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      nodeAnnotations: { [node.val]: { text: `h = ${h}`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.25)' } },
      explanation: {
        action: `Node [${node.val}] Height = 1 + max(${leftH}, ${rightH}) = ${h}`,
        intuition: `Stored height ${h} above node.`
      },
      phase: "HEIGHT_CALCULATED",
      codeStatement: `return 1 + Math.max(${leftH}, ${rightH}); // = ${h}`,
      stack: [...depthStack],
      sound: 'found'
    });

    depthStack.pop();
    return h;
  }

  const totalH = depthHelper(treeRoot);
  return { newSteps, totalH };
}

// 9. INVERT TREE
export function generateInvertTreeSteps(treeRoot) {
  const newSteps = [];
  const cloned = cloneTree(treeRoot);

  function invertHelper(node) {
    if (!node) return;
    const temp = node.left;
    node.left = node.right;
    node.right = temp;

    newSteps.push({
      treeSnapshot: cloneTree(cloned),
      activeNodeVal: node.val,
      nodeAnnotations: { [node.val]: { text: 'mirrored ↺', color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
      explanation: {
        action: `Swapped left and right subtrees of Node [${node.val}]`,
        intuition: `Horizontal reflection applied at node.`
      },
      phase: "INVERT_SWAP",
      codeStatement: `swap(root.left, root.right);`,
      sound: 'compare'
    });

    invertHelper(node.left);
    invertHelper(node.right);
  }

  invertHelper(cloned);
  return { newSteps, newRoot: cloned };
}

// 10. VALIDATE BST
export function generateValidateBSTSteps(treeRoot) {
  const newSteps = [];

  function validateHelper(node, minVal, maxVal) {
    if (!node) return true;
    const minStr = minVal === null ? '-∞' : minVal;
    const maxStr = maxVal === null ? '+∞' : maxVal;
    const isValid = (minVal === null || node.val > minVal) && (maxVal === null || node.val < maxVal);

    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      nodeAnnotations: {
        [node.val]: {
          text: isValid ? `valid (${minStr} < x < ${maxStr})` : '✗ INVALID',
          color: isValid ? '#C5CEAE' : '#AB526B',
          bg: isValid ? 'rgba(197, 206, 174, 0.25)' : 'rgba(171, 82, 107, 0.25)'
        }
      },
      explanation: {
        action: `Testing Node [${node.val}]: Must satisfy ${minStr} < ${node.val} < ${maxStr}`,
        intuition: isValid ? `Constraint satisfied.` : `BST Invariant VIOLATED!`
      },
      phase: isValid ? "BST_VALID" : "BST_INVALID",
      codeStatement: `if (root.val <= ${minStr} || root.val >= ${maxStr}) return false;`,
      sound: isValid ? 'compare' : 'delete'
    });

    if (!isValid) return false;
    return validateHelper(node.left, minVal, node.val) && validateHelper(node.right, node.val, maxVal);
  }

  const isBST = validateHelper(treeRoot, null, null);
  return { newSteps, isBST };
}

// 11. DIAMETER
export function generateDiameterSteps(treeRoot) {
  const newSteps = [];
  let maxDia = 0;

  function diameterHelper(node) {
    if (!node) return 0;
    const leftH = diameterHelper(node.left);
    const rightH = diameterHelper(node.right);
    const diaHere = leftH + rightH;
    if (diaHere > maxDia) maxDia = diaHere;

    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      nodeAnnotations: { [node.val]: { text: `path: ${diaHere}`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
      explanation: {
        action: `Path through [${node.val}] = ${leftH} + ${rightH} = ${diaHere} edges. Max so far: ${maxDia}`,
        intuition: `Diameter calculates the longest path between any two leaf nodes.`
      },
      phase: "DIAMETER_UPDATE",
      codeStatement: `maxDiameter = Math.max(maxDiameter, left + right); // ${maxDia}`,
      sound: 'found'
    });

    return 1 + Math.max(leftH, rightH);
  }

  diameterHelper(treeRoot);
  return { newSteps, maxDia };
}

// 12. SEGMENT TREE RANGE QUERY
export function generateSegmentTreeSteps(treeRoot, L, R) {
  const newSteps = [];

  function querySeg(node, ql, qr) {
    if (!node) return 0;

    if (ql <= node.rangeL && node.rangeR <= qr) {
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        nodeAnnotations: { [node.val]: { text: `+${node.val} [MATCH]`, color: '#C5CEAE', bg: 'rgba(197, 206, 174, 0.3)' } },
        explanation: {
          action: `Interval [${node.rangeL}..${node.rangeR}] completely inside query [${ql}..${qr}]. Value = ${node.val}`,
          intuition: "Complete overlap: Return segment sum immediately in O(1)."
        },
        phase: "SEGMENT_FULL_MATCH",
        codeStatement: `return tree[node]; // ${node.val}`,
        sound: 'found'
      });
      return node.val;
    }

    if (node.rangeR < ql || node.rangeL > qr) {
      newSteps.push({
        treeSnapshot: treeRoot,
        activeNodeVal: node.val,
        nodeAnnotations: { [node.val]: { text: 'NO OVERLAP', color: '#AB526B', bg: 'rgba(171, 82, 107, 0.25)' } },
        explanation: {
          action: `Interval [${node.rangeL}..${node.rangeR}] outside [${ql}..${qr}]. Discard.`,
          intuition: "No overlap: Return 0 identity."
        },
        phase: "SEGMENT_NO_OVERLAP",
        codeStatement: `return 0;`,
        sound: 'compare'
      });
      return 0;
    }

    newSteps.push({
      treeSnapshot: treeRoot,
      activeNodeVal: node.val,
      nodeAnnotations: { [node.val]: { text: `[${node.rangeL}..${node.rangeR}] SPLIT`, color: '#F0E2A4', bg: 'rgba(240, 226, 164, 0.25)' } },
      explanation: {
        action: `Partial overlap at [${node.rangeL}..${node.rangeR}]. Split query into left and right.`,
        intuition: "Partial overlap: Recurse into children."
      },
      phase: "SEGMENT_SPLIT",
      codeStatement: `return query(left) + query(right);`,
      sound: 'compare'
    });

    return querySeg(node.left, ql, qr) + querySeg(node.right, ql, qr);
  }

  const totalSum = querySeg(treeRoot, L, R);
  return { newSteps, totalSum };
}
