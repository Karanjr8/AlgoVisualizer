import { VisualizationFrame, VisualElement, CallStackFrame } from '../../types/visualizer';

function pushFrame(
  frames: VisualizationFrame[],
  stack: CallStackFrame[],
  elements: VisualElement[],
  eventType: any,
  explanation: string,
  goal: string,
  totalPasses: number,
  metadata?: any
) {
  frames.push({
    elements: JSON.parse(JSON.stringify(elements)),
    event: { type: eventType, explanation },
    callStack: stack ? JSON.parse(JSON.stringify(stack)) : undefined,
    context: { phaseName: 'Tree', goal, totalPasses, currentPass: 0, overallProgress: 0 },
    treeMetadata: metadata
  });
}

// Helper to create a standard BST for visualization
export function createStandardBST(): VisualElement[] {
  //        20
  //     10      30
  //    5  15  25  35
  return [
    { id: 'n20', value: 20, state: 'normal', leftId: 'n10', rightId: 'n30', parentId: null, height: 3, level: 0, hd: 0, role: 'Root' },
    { id: 'n10', value: 10, state: 'normal', leftId: 'n5', rightId: 'n15', parentId: 'n20', height: 2, level: 1, hd: -1 },
    { id: 'n30', value: 30, state: 'normal', leftId: 'n25', rightId: 'n35', parentId: 'n20', height: 2, level: 1, hd: 1 },
    { id: 'n5', value: 5, state: 'normal', leftId: null, rightId: null, parentId: 'n10', height: 1, level: 2, hd: -2, role: 'Leaf' },
    { id: 'n15', value: 15, state: 'normal', leftId: null, rightId: null, parentId: 'n10', height: 1, level: 2, hd: 0, role: 'Leaf' },
    { id: 'n25', value: 25, state: 'normal', leftId: null, rightId: null, parentId: 'n30', height: 1, level: 2, hd: 0, role: 'Leaf' },
    { id: 'n35', value: 35, state: 'normal', leftId: null, rightId: null, parentId: 'n30', height: 1, level: 2, hd: 2, role: 'Leaf' },
  ];
}

// ----------------------------------------------------------------------
// 1. BINARY TREE BASICS
// ----------------------------------------------------------------------
export function generateBinaryTreeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const stack: CallStackFrame[] = [];

  pushFrame(frames, stack, elements, 'INIT', 'Binary Tree: Hierarchical node structure where each node has at most two children (Left and Right).', 'Binary Tree Structure', 6);

  // 1. Root Node
  elements[0].state = 'comparing';
  elements[0].label = 'Root Node';
  pushFrame(frames, stack, elements, 'SELECT', 'Root Node (20): The topmost node in the tree with no parent pointers. All paths originate here.', 'Binary Tree Structure', 6);

  // 2. Left Subtree
  elements[0].state = 'normal';
  elements.forEach(e => {
    if (['n10', 'n5', 'n15'].includes(e.id)) { e.state = 'comparing'; e.label = 'Left Subtree'; }
  });
  pushFrame(frames, stack, elements, 'DIVIDE', 'Left Subtree of 20: Rooted at Node(10), contains all descendants branching left (values 10, 5, 15).', 'Binary Tree Structure', 6);

  // 3. Right Subtree
  elements.forEach(e => {
    if (['n30', 'n25', 'n35'].includes(e.id)) { e.state = 'comparing'; e.label = 'Right Subtree'; }
    else { e.state = 'normal'; e.label = ''; }
  });
  pushFrame(frames, stack, elements, 'DIVIDE', 'Right Subtree of 20: Rooted at Node(30), contains all descendants branching right (values 30, 25, 35).', 'Binary Tree Structure', 6);

  // 4. Internal Nodes vs Leaves
  elements.forEach(e => {
    if (['n5', 'n15', 'n25', 'n35'].includes(e.id)) { e.state = 'found'; e.label = 'Leaf (Degree 0)'; }
    else { e.state = 'normal'; e.label = 'Internal'; }
  });
  pushFrame(frames, stack, elements, 'FOUND', 'Leaf Nodes (5, 15, 25, 35): Terminal nodes with degree 0 (no child pointers). Internal nodes have at least one child.', 'Binary Tree Structure', 6);

  // 5. Height & Depth Metrics
  elements.forEach(e => { e.state = 'normal'; e.label = `Level ${e.level}`; });
  elements[0].state = 'comparing';
  elements[0].label = 'Height = 3';
  pushFrame(frames, stack, elements, 'COMPLETE', 'Tree Height = 3 (longest path from root to leaf). Root is at Level 0, leaves at Level 2.', 'Binary Tree Structure', 6);

  return frames;
}

// ----------------------------------------------------------------------
// 2. TYPES OF BINARY TREES
// ----------------------------------------------------------------------
export function generateTreeTypesFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const stack: CallStackFrame[] = [];

  // 1. Full Binary Tree
  const fullTree: VisualElement[] = [
    { id: 'f1', value: 20, leftId: 'f2', rightId: 'f3', state: 'comparing', label: '2 children' },
    { id: 'f2', value: 10, leftId: 'f4', rightId: 'f5', state: 'comparing', label: '2 children' },
    { id: 'f3', value: 30, leftId: null, rightId: null, state: 'found', label: '0 children' },
    { id: 'f4', value: 5, leftId: null, rightId: null, state: 'found', label: '0 children' },
    { id: 'f5', value: 15, leftId: null, rightId: null, state: 'found', label: '0 children' },
  ];
  pushFrame(frames, stack, fullTree, 'CHECK_CONDITION', '1. Full Binary Tree: Every node has strictly 0 or 2 children. No node has only 1 child pointer.', 'Binary Tree Classifications', 4);

  // 2. Complete Binary Tree
  const completeTree: VisualElement[] = [
    { id: 'c1', value: 1, leftId: 'c2', rightId: 'c3', state: 'normal' },
    { id: 'c2', value: 2, leftId: 'c4', rightId: 'c5', state: 'normal' },
    { id: 'c3', value: 3, leftId: 'c6', rightId: null, state: 'normal' },
    { id: 'c4', value: 4, leftId: null, rightId: null, state: 'found', label: 'Leaf' },
    { id: 'c5', value: 5, leftId: null, rightId: null, state: 'found', label: 'Leaf' },
    { id: 'c6', value: 6, leftId: null, rightId: null, state: 'found', label: 'Left-aligned' },
  ];
  pushFrame(frames, stack, completeTree, 'CHECK_CONDITION', '2. Complete Binary Tree: All levels are completely filled except possibly the last, which is filled from left to right without gaps.', 'Binary Tree Classifications', 4);

  // 3. Perfect Binary Tree
  const perfectTree = createStandardBST();
  perfectTree.forEach(e => { e.state = 'found'; e.label = e.level === 2 ? 'Leaf (Level 2)' : '2 Children'; });
  pushFrame(frames, stack, perfectTree, 'CHECK_CONDITION', '3. Perfect Binary Tree: All internal nodes have exactly 2 children, and all leaves are at the exact same depth level. Total nodes N = 2^h - 1.', 'Binary Tree Classifications', 4);

  // 4. Degenerate (Skewed) Tree
  const degenerateTree: VisualElement[] = [
    { id: 'd1', value: 10, leftId: null, rightId: 'd2', state: 'swapping', label: '1 child' },
    { id: 'd2', value: 20, leftId: null, rightId: 'd3', state: 'swapping', label: '1 child' },
    { id: 'd3', value: 30, leftId: null, rightId: 'd4', state: 'swapping', label: '1 child' },
    { id: 'd4', value: 40, leftId: null, rightId: null, state: 'found', label: 'Leaf' },
  ];
  pushFrame(frames, stack, degenerateTree, 'CHECK_CONDITION', '4. Degenerate (Skewed) Tree: Each parent has only one child pointer. Tree degrades to a linked list with worst-case O(N) operations.', 'Binary Tree Classifications', 4);

  return frames;
}

// ----------------------------------------------------------------------
// 3. BST SEARCH
// ----------------------------------------------------------------------
export function generateBSTSearchFrames(target: number = 25): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const stack: CallStackFrame[] = [];

  pushFrame(frames, stack, elements, 'INIT', `Starting BST Search for target ${target}. Invariant: Left < Node < Right.`, 'BST Search', 8);

  let currId: string | null = 'n20'; // root
  let comparisons = 0;

  while (currId) {
    comparisons++;
    const currIdx = elements.findIndex(e => e.id === currId);
    const currNode = elements[currIdx];

    // Highlight current comparing node
    elements.forEach(e => { if (e.state === 'comparing') e.state = 'normal'; e.label = ''; });
    currNode.state = 'comparing';
    currNode.label = `Compare ${target}`;

    pushFrame(frames, stack, elements, 'COMPARE', `Comparison #${comparisons}: Comparing target ${target} with Node(${currNode.value}).`, 'BST Search', 8);

    if (currNode.value === target) {
      currNode.state = 'found';
      currNode.label = 'Target Found!';
      pushFrame(frames, stack, elements, 'FOUND', `MATCH FOUND! Target ${target} matches Node(${currNode.value}) at depth ${currNode.level} after ${comparisons} comparisons.`, 'BST Search', 8);
      return frames;
    }

    if (target < currNode.value) {
      currNode.label = `${target} < ${currNode.value} (Go Left)`;
      pushFrame(frames, stack, elements, 'DIVIDE', `${target} < ${currNode.value} -> BST invariant guarantees target must be in LEFT subtree. Following LEFT branch.`, 'BST Search', 8);
      
      if (!currNode.leftId) {
        currNode.state = 'normal';
        pushFrame(frames, stack, elements, 'COMPLETE', `Reached NULL left child. Target ${target} does not exist in BST. Search terminated in O(log N).`, 'BST Search', 8);
        return frames;
      }
      currId = currNode.leftId;
    } else {
      currNode.label = `${target} > ${currNode.value} (Go Right)`;
      pushFrame(frames, stack, elements, 'DIVIDE', `${target} > ${currNode.value} -> BST invariant guarantees target must be in RIGHT subtree. Following RIGHT branch.`, 'BST Search', 8);

      if (!currNode.rightId) {
        currNode.state = 'normal';
        pushFrame(frames, stack, elements, 'COMPLETE', `Reached NULL right child. Target ${target} does not exist in BST. Search terminated in O(log N).`, 'BST Search', 8);
        return frames;
      }
      currId = currNode.rightId;
    }
  }

  return frames;
}

// ----------------------------------------------------------------------
// 4. BST INSERT
// ----------------------------------------------------------------------
export function generateBSTInsertFrames(target: number = 22): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const stack: CallStackFrame[] = [];

  pushFrame(frames, stack, elements, 'INIT', `Starting BST Insertion of value ${target}. Invariant: Left child < Node < Right child.`, 'BST Insert', 10);

  let currId: string | null = 'n20'; // root
  let parentId: string | null = null;
  let isLeftChild = false;

  while (currId) {
    const currIdx = elements.findIndex(e => e.id === currId);
    const currNode = elements[currIdx];

    elements.forEach(e => { if (e.state === 'comparing') e.state = 'normal'; e.label = ''; });
    currNode.state = 'comparing';
    currNode.label = `Compare ${target}`;

    pushFrame(frames, stack, elements, 'COMPARE', `Inspecting Node(${currNode.value}): Compare ${target} with ${currNode.value}.`, 'BST Insert', 10);

    parentId = currId;

    if (target === currNode.value) {
      currNode.state = 'selected';
      currNode.label = 'Duplicate';
      pushFrame(frames, stack, elements, 'CHECK_CONDITION', `Value ${target} already exists in BST! Duplicates are ignored in standard BST.`, 'BST Insert', 10);
      return frames;
    }

    if (target < currNode.value) {
      isLeftChild = true;
      currNode.label = `${target} < ${currNode.value} (Go Left)`;
      pushFrame(frames, stack, elements, 'DIVIDE', `${target} < ${currNode.value} -> Branching LEFT.`, 'BST Insert', 10);
      
      if (!currNode.leftId) {
        currNode.state = 'selected';
        currNode.label = 'Parent Spot Found';
        pushFrame(frames, stack, elements, 'SELECT', `Node(${currNode.value}) has NO left child (NULL pointer reached). Insertion position found!`, 'BST Insert', 10);
        break;
      }
      currId = currNode.leftId;
    } else {
      isLeftChild = false;
      currNode.label = `${target} > ${currNode.value} (Go Right)`;
      pushFrame(frames, stack, elements, 'DIVIDE', `${target} > ${currNode.value} -> Branching RIGHT.`, 'BST Insert', 10);

      if (!currNode.rightId) {
        currNode.state = 'selected';
        currNode.label = 'Parent Spot Found';
        pushFrame(frames, stack, elements, 'SELECT', `Node(${currNode.value}) has NO right child (NULL pointer reached). Insertion position found!`, 'BST Insert', 10);
        break;
      }
      currId = currNode.rightId;
    }
  }

  // Found insertion parent
  elements.forEach(e => { if (e.state === 'comparing') e.state = 'normal'; e.label = ''; });
  const parentIdx = elements.findIndex(e => e.id === parentId);
  elements[parentIdx].state = 'selected';
  elements[parentIdx].label = 'Parent';

  // Allocate new node
  const newNodeId = `n${target}`;
  const newNode: VisualElement = {
    id: newNodeId,
    value: target,
    state: 'swapping',
    label: 'New Node',
    parentId: elements[parentIdx].id,
    height: 1,
    level: (elements[parentIdx].level || 0) + 1,
    role: 'Leaf'
  };

  if (isLeftChild) elements[parentIdx].leftId = newNodeId;
  else elements[parentIdx].rightId = newNodeId;

  elements.push(newNode);
  pushFrame(frames, stack, elements, 'INSERT', `Allocated Node(${target}) and connected edge as ${isLeftChild ? 'LEFT' : 'RIGHT'} child of Node(${elements[parentIdx].value}).`, 'BST Insert', 10);

  // Recalculate heights
  elements[elements.length - 1].state = 'found';
  elements[elements.length - 1].label = `Inserted (${target})`;
  elements[parentIdx].state = 'normal';
  elements[parentIdx].label = '';

  pushFrame(frames, stack, elements, 'COMPLETE', `BST insertion complete! Node(${target}) integrated. BST invariant Left < Node < Right maintained.`, 'BST Insert', 10);

  return frames;
}

// ----------------------------------------------------------------------
// 5. BST DELETE
// ----------------------------------------------------------------------
export function generateBSTDeleteFrames(target: number = 20): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const stack: CallStackFrame[] = [];

  pushFrame(frames, stack, elements, 'INIT', `Starting deletion of Node(${target}) from BST.`, 'BST Delete', 12);

  // 1. Search for target node
  let currId: string | null = 'n20';
  while (currId) {
    const node = elements.find(e => e.id === currId)!;
    elements.forEach(e => { if (e.state === 'comparing') e.state = 'normal'; });
    node.state = 'comparing';
    node.label = `Searching for ${target}`;

    pushFrame(frames, stack, elements, 'COMPARE', `Searching for Node(${target}): Currently comparing with Node(${node.value}).`, 'BST Delete', 12);

    if (node.value === target) break;
    if (target < node.value) currId = node.leftId || null;
    else currId = node.rightId || null;
  }

  const targetIdx = elements.findIndex(e => e.value === target);
  if (targetIdx < 0) {
    pushFrame(frames, stack, elements, 'COMPLETE', `Node(${target}) not found in BST. Deletion aborted.`, 'BST Delete', 12);
    return frames;
  }

  const targetNode = elements[targetIdx];
  targetNode.state = 'swapping';
  targetNode.label = 'Target to Delete';
  pushFrame(frames, stack, elements, 'SELECT', `Located Node(${target}). Node has TWO children (10 and 30). Must find In-Order Successor (smallest in right subtree).`, 'BST Delete', 12);

  // 2. Find In-Order Successor (smallest in right subtree)
  let succId: string | null = targetNode.rightId || null;
  let parentId: string | null = targetNode.id;

  // Step 2a: Move to right child
  const rightChild = elements.find(e => e.id === succId)!;
  rightChild.state = 'comparing';
  rightChild.label = 'Right Subtree Root';
  pushFrame(frames, stack, elements, 'DIVIDE', `Step 2a: Moved to Right Child Node(${rightChild.value}). Now following left pointers to find minimum node...`, 'BST Delete', 12);

  // Step 2b: Follow left branch
  while (succId) {
    const succNode = elements.find(e => e.id === succId)!;
    if (!succNode.leftId) break;

    parentId = succId;
    succId = succNode.leftId;

    const nextSucc = elements.find(e => e.id === succId)!;
    nextSucc.state = 'comparing';
    nextSucc.label = 'Checking Left...';
    pushFrame(frames, stack, elements, 'DIVIDE', `Traversing left: Checking Node(${nextSucc.value})...`, 'BST Delete', 12);
  }

  const succIdx = elements.findIndex(e => e.id === succId);
  const succNode = elements[succIdx];
  succNode.state = 'found';
  succNode.label = 'In-Order Successor';

  pushFrame(frames, stack, elements, 'FOUND', `In-Order Successor found: Node(${succNode.value}) (smallest node in right subtree).`, 'BST Delete', 12);

  // 3. Replace target value with successor value
  const originalValue = targetNode.value;
  targetNode.value = succNode.value;
  targetNode.state = 'found';
  targetNode.label = `Copied (${succNode.value})`;
  succNode.state = 'swapping';
  succNode.label = 'Duplicate to Remove';

  pushFrame(frames, stack, elements, 'INSERT', `Step 3: Copied successor value (${succNode.value}) into target node position (overwriting ${originalValue}). Now removing old duplicate successor leaf...`, 'BST Delete', 12);

  // 4. Remove duplicate successor node
  const parentNode = elements.find(e => e.id === parentId)!;
  if (parentNode.leftId === succNode.id) parentNode.leftId = succNode.rightId || null;
  else if (parentNode.rightId === succNode.id) parentNode.rightId = succNode.rightId || null;

  elements.splice(succIdx, 1);
  elements.forEach(e => { e.state = 'normal'; e.label = ''; });
  targetNode.state = 'found';
  targetNode.label = `Node(${succNode.value})`;

  pushFrame(frames, stack, elements, 'COMPLETE', `Deleted duplicate successor leaf node. Subtree heights recomputed. BST invariant fully restored!`, 'BST Delete', 12);

  return frames;
}

// ----------------------------------------------------------------------
// 6. AVL TREE ROTATIONS
// ----------------------------------------------------------------------
export function generateAVLTreeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const stack: CallStackFrame[] = [];

  // Unbalanced tree (Right-Right heavy: 10 -> 20 -> 30)
  const elements: VisualElement[] = [
    { id: 'a10', value: 10, leftId: null, rightId: 'a20', state: 'comparing', label: 'BF = -2 (Unbalanced)', height: 3 },
    { id: 'a20', value: 20, leftId: null, rightId: 'a30', state: 'normal', label: 'BF = -1', height: 2 },
    { id: 'a30', value: 30, leftId: null, rightId: null, state: 'normal', label: 'BF = 0', height: 1 },
  ];

  pushFrame(frames, stack, elements, 'INIT', 'AVL Tree: Checking Balance Factors. BF = Height(Left) - Height(Right).', 'AVL Rotation', 6);

  pushFrame(frames, stack, elements, 'CHECK_CONDITION', 'Node(10) has Balance Factor BF = H(Left) - H(Right) = 0 - 2 = -2. Imbalance detected (|BF| > 1)!', 'AVL Rotation', 6);

  elements[0].state = 'swapping';
  elements[0].label = 'Pivot (Rotate Left)';
  elements[1].state = 'comparing';
  elements[1].label = 'Right Child';
  pushFrame(frames, stack, elements, 'SELECT', 'Right-Right (RR) heavy case detected. Initiating Left Rotation around pivot Node(10)...', 'AVL Rotation', 6);

  // Elevate 20 to root
  const balancedElements: VisualElement[] = [
    { id: 'a20', value: 20, leftId: 'a10', rightId: 'a30', state: 'found', label: 'New Root (BF=0)', height: 2 },
    { id: 'a10', value: 10, leftId: null, rightId: null, state: 'normal', label: 'Left Child (BF=0)', height: 1 },
    { id: 'a30', value: 30, leftId: null, rightId: null, state: 'normal', label: 'Right Child (BF=0)', height: 1 },
  ];

  pushFrame(frames, stack, balancedElements, 'DIVIDE', 'Detaching inner subtrees and elevating Node(20) to become the new subtree root.', 'AVL Rotation', 6);
  pushFrame(frames, stack, balancedElements, 'ROTATE_LEFT', 'Left Rotation complete: Node(20) elevated to Root. Node(10) becomes its left child.', 'AVL Rotation', 6);
  pushFrame(frames, stack, balancedElements, 'COMPLETE', 'Tree rebalanced! All nodes satisfy |BF| <= 1. O(log N) operations guaranteed.', 'AVL Rotation', 6);

  return frames;
}

// ----------------------------------------------------------------------
// 7. MORRIS TRAVERSAL
// ----------------------------------------------------------------------
export function generateMorrisTraversalFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const stack: CallStackFrame[] = [];

  pushFrame(frames, stack, elements, 'INIT', 'Morris Traversal: In-order traversal using O(1) auxiliary space without recursion stack or parent pointers.', 'Morris Traversal', 8);

  // 1. Thread creation from predecessor 15 to 20
  elements[0].state = 'comparing';
  elements[0].label = 'curr (20)';
  const node15 = elements.find(e => e.id === 'n15')!;
  node15.threadToId = 'n20';
  node15.state = 'swapping';
  node15.label = 'Predecessor (Thread -> 20)';

  pushFrame(frames, stack, elements, 'INSERT', 'Found in-order predecessor Node(15) of Node(20). Created temporary thread link: 15 -> 20.', 'Morris Traversal', 8);

  // 2. Traversing left child
  elements.forEach(e => { if (e.id !== 'n15') { e.state = 'normal'; e.label = ''; } });
  const node10 = elements.find(e => e.id === 'n10')!;
  node10.state = 'comparing';
  node10.label = 'curr (10)';
  pushFrame(frames, stack, elements, 'DIVIDE', 'Moved to left child Node(10) to continue in-order traversal.', 'Morris Traversal', 8);

  // 3. Thread creation from 5 to 10
  const node5 = elements.find(e => e.id === 'n5')!;
  node5.threadToId = 'n10';
  node5.state = 'swapping';
  node5.label = 'Thread -> 10';
  pushFrame(frames, stack, elements, 'INSERT', 'Found in-order predecessor Node(5) of Node(10). Created temporary thread link: 5 -> 10.', 'Morris Traversal', 8);

  // 4. Visit node 5
  node5.threadToId = null;
  node5.state = 'found';
  node5.label = 'Visited (5)';
  pushFrame(frames, stack, elements, 'CHECK_CONDITION', 'Node(5) has NO left child. Visited Node(5). Output: [5]. Followed thread back to Node(10).', 'Morris Traversal', 8);

  // 5. Visit node 10
  node10.state = 'found';
  node10.label = 'Visited (10)';
  pushFrame(frames, stack, elements, 'CHECK_CONDITION', 'Severed thread 5 -> 10. Visited Node(10). Output: [5, 10]. Advancing to right child Node(15).', 'Morris Traversal', 8);

  // 6. Visit node 15 and sever thread to 20
  node15.threadToId = null;
  node15.state = 'found';
  node15.label = 'Visited (15)';
  pushFrame(frames, stack, elements, 'DELETE', 'Visited Node(15). Followed thread back to Node(20). Severed temporary thread pointer 15 -> 20!', 'Morris Traversal', 8);

  // 7. Visit remaining nodes
  elements.forEach(e => { e.state = 'found'; e.label = 'Visited'; });
  pushFrame(frames, stack, elements, 'COMPLETE', 'Morris Traversal complete! Visited all nodes in sorted order [5, 10, 15, 20, 25, 30, 35] in O(1) space.', 'Morris Traversal', 8);

  return frames;
}

// ----------------------------------------------------------------------
// 8. LOWEST COMMON ANCESTOR (LCA)
// ----------------------------------------------------------------------
export function generateLCAFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const stack: CallStackFrame[] = [];
  const elements = createStandardBST();
  const p = 5;
  const q = 25;

  elements.find(e => e.value === p)!.label = 'Target P (5)';
  elements.find(e => e.value === p)!.state = 'comparing';
  elements.find(e => e.value === q)!.label = 'Target Q (25)';
  elements.find(e => e.value === q)!.state = 'comparing';

  pushFrame(frames, stack, elements, 'INIT', `Finding Lowest Common Ancestor (LCA) of Node(${p}) and Node(${q}).`, 'Lowest Common Ancestor', 5);

  // Root inspection
  elements[0].state = 'comparing';
  elements[0].label = 'Inspecting Root (20)';
  pushFrame(frames, stack, elements, 'COMPARE', `At Root (20): Compare targets: P (${p} < 20) is in LEFT subtree; Q (${q} > 20) is in RIGHT subtree.`, 'Lowest Common Ancestor', 5);

  // Split detected
  elements[0].state = 'found';
  elements[0].label = 'LCA (Node 20)';
  pushFrame(frames, stack, elements, 'SELECT', `SPLIT DETECTED: Because P (${p}) and Q (${q}) diverge on opposite sides of Node(20), Node(20) IS the Lowest Common Ancestor!`, 'Lowest Common Ancestor', 5);

  pushFrame(frames, stack, elements, 'COMPLETE', `LCA found: Node(20). Search completed in O(h) = O(log N) time without extra memory.`, 'Lowest Common Ancestor', 5);

  return frames;
}

// ----------------------------------------------------------------------
// 9. TREE DIAMETER
// ----------------------------------------------------------------------
export function generateTreeDiameterFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const stack: CallStackFrame[] = [];

  pushFrame(frames, stack, elements, 'INIT', 'Diameter of Tree: The longest path between any two leaf nodes (measured in edges).', 'Tree Diameter', 6);

  // Leaf heights
  elements.forEach(e => {
    if (!e.leftId && !e.rightId) { e.state = 'comparing'; e.label = 'h=1, path=0'; }
  });
  pushFrame(frames, stack, elements, 'CHECK_CONDITION', 'Step 1: Leaves (5, 15, 25, 35) have height 1. Longest path through leaf alone is 0 edges.', 'Tree Diameter', 6);

  // Internal node heights
  elements.forEach(e => { e.state = 'normal'; e.label = ''; });
  elements.find(e => e.id === 'n10')!.state = 'comparing';
  elements.find(e => e.id === 'n10')!.label = 'Left Path = 2';
  elements.find(e => e.id === 'n30')!.state = 'comparing';
  elements.find(e => e.id === 'n30')!.label = 'Right Path = 2';

  pushFrame(frames, stack, elements, 'CHECK_CONDITION', 'Step 2: Subtree at 10 has max path = 2 edges. Subtree at 30 has max path = 2 edges.', 'Tree Diameter', 6);

  // Root calculation
  elements[0].state = 'comparing';
  elements[0].label = 'Path = 2 + 2 = 4';
  pushFrame(frames, stack, elements, 'CHECK_CONDITION', 'Step 3: Path passing through Root 20 = Left Height (2) + Right Height (2) = 4 edges.', 'Tree Diameter', 6);

  // Highlight diameter path
  const diameterIds = ['n5', 'n10', 'n20', 'n30', 'n35'];
  elements.forEach(e => {
    if (diameterIds.includes(e.id)) {
      e.state = 'found';
      e.inDiameter = true;
      e.label = 'Diameter Path';
    } else {
      e.state = 'normal';
      e.label = '';
    }
  });

  pushFrame(frames, stack, elements, 'FOUND', 'Diameter Path Identified: [5 -> 10 -> 20 -> 30 -> 35]. Longest distance between any two leaves.', 'Tree Diameter', 6);
  pushFrame(frames, stack, elements, 'COMPLETE', 'Diameter = 4 edges (5 nodes). Computed in O(N) using bottom-up postorder height traversal.', 'Tree Diameter', 6);

  return frames;
}

// ----------------------------------------------------------------------
// 10. BALANCED TREES
// ----------------------------------------------------------------------
export function generateBalancedTreeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const stack: CallStackFrame[] = [];

  pushFrame(frames, stack, elements, 'INIT', 'Height-Balanced Tree Verification: Checking if |Height(Left) - Height(Right)| <= 1 at every node.', 'Balanced Trees', 5);

  // Check leaves
  elements.forEach(e => {
    if (!e.leftId && !e.rightId) {
      e.state = 'comparing';
      e.label = '|0 - 0| = 0 <= 1';
    }
  });
  pushFrame(frames, stack, elements, 'CHECK_CONDITION', 'Step 1: Leaves (5, 15, 25, 35) have height 1 and left/right heights 0. Balanced!', 'Balanced Trees', 5);

  // Check internal nodes 10 and 30
  elements.forEach(e => { e.state = 'normal'; e.label = ''; });
  elements.find(e => e.id === 'n10')!.state = 'comparing';
  elements.find(e => e.id === 'n10')!.label = '|1 - 1| = 0 <= 1';
  elements.find(e => e.id === 'n30')!.state = 'comparing';
  elements.find(e => e.id === 'n30')!.label = '|1 - 1| = 0 <= 1';
  pushFrame(frames, stack, elements, 'CHECK_CONDITION', 'Step 2: Nodes 10 and 30 have left height 1 and right height 1. Difference is 0 <= 1. Balanced!', 'Balanced Trees', 5);

  // Check root
  elements.forEach(e => { e.state = 'found'; e.label = 'Balanced'; });
  elements[0].label = 'Root |2 - 2| = 0';
  pushFrame(frames, stack, elements, 'FOUND', 'Step 3: Root 20 has left height 2 and right height 2. Entire tree is HEIGHT-BALANCED!', 'Balanced Trees', 5);
  pushFrame(frames, stack, elements, 'COMPLETE', 'Tree verified as Height-Balanced in O(N) time.', 'Balanced Trees', 5);

  return frames;
}

// ----------------------------------------------------------------------
// 11. BINARY TREE VIEWS
// ----------------------------------------------------------------------
export function generateTreeViewsFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const stack: CallStackFrame[] = [];

  // Step 1: Horizontal Distance
  elements.forEach(e => {
    e.state = 'comparing';
    e.label = `HD: ${e.hd! >= 0 ? '+' : ''}${e.hd}`;
  });
  pushFrame(frames, stack, elements, 'INIT', 'Step 1: Compute Horizontal Distance (HD) for each node. Root is HD 0. Left child is HD - 1. Right child is HD + 1.', 'Tree Views', 6);

  // Top View
  const topViewIds = ['n5', 'n10', 'n20', 'n30', 'n35'];
  elements.forEach(e => {
    if (topViewIds.includes(e.id)) { e.state = 'found'; e.label = 'Top View'; }
    else { e.state = 'normal'; e.label = ''; }
  });
  pushFrame(frames, stack, elements, 'FOUND', 'Top View: [5, 10, 20, 30, 35]. First node visible from above at each unique horizontal distance coordinate.', 'Tree Views', 6);

  // Bottom View
  elements.forEach(e => {
    if (['n5', 'n10', 'n25', 'n30', 'n35'].includes(e.id)) { e.state = 'found'; e.label = 'Bottom View'; }
    else { e.state = 'normal'; e.label = ''; }
  });
  pushFrame(frames, stack, elements, 'FOUND', 'Bottom View: [5, 10, 25, 30, 35]. Deepest node visible from below at each horizontal distance coordinate.', 'Tree Views', 6);

  // Left View
  elements.forEach(e => {
    if (['n20', 'n10', 'n5'].includes(e.id)) { e.state = 'comparing'; e.label = 'Left View'; }
    else { e.state = 'normal'; e.label = ''; }
  });
  pushFrame(frames, stack, elements, 'SELECT', 'Left View: [20, 10, 5]. First node encountered at each depth level looking from the left.', 'Tree Views', 6);

  // Right View
  elements.forEach(e => {
    if (['n20', 'n30', 'n35'].includes(e.id)) { e.state = 'found'; e.label = 'Right View'; }
    else { e.state = 'normal'; e.label = ''; }
  });
  pushFrame(frames, stack, elements, 'COMPLETE', 'Right View: [20, 30, 35]. Last node encountered at each depth level looking from the right.', 'Tree Views', 6);

  return frames;
}

// ----------------------------------------------------------------------
// 12. SERIALIZATION
// ----------------------------------------------------------------------
export function generateSerializeTreeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const stack: CallStackFrame[] = [];

  pushFrame(frames, stack, elements, 'INIT', 'Tree Serialization: Encoding hierarchical node pointers into a linear string stream using Level-Order (BFS).', 'Serialization', 6);

  // Step 1: Root
  elements[0].state = 'found';
  elements[0].label = 'Stream: [20]';
  pushFrame(frames, stack, elements, 'INSERT', 'Level 0: Enqueue Root Node(20) and append to stream. Stream = "20"', 'Serialization', 6);

  // Step 2: Level 1
  elements.find(e => e.id === 'n10')!.state = 'found';
  elements.find(e => e.id === 'n10')!.label = 'Appended';
  elements.find(e => e.id === 'n30')!.state = 'found';
  elements.find(e => e.id === 'n30')!.label = 'Appended';
  pushFrame(frames, stack, elements, 'INSERT', 'Level 1: Enqueue and append children 10, 30. Stream = "20,10,30"', 'Serialization', 6);

  // Step 3: Level 2
  elements.forEach(e => { e.state = 'found'; e.label = 'Serialized'; });
  pushFrame(frames, stack, elements, 'INSERT', 'Level 2: Enqueue and append leaves 5, 15, 25, 35. Stream = "20,10,30,5,15,25,35"', 'Serialization', 6);

  // Step 4: Terminal Nulls
  pushFrame(frames, stack, elements, 'CHECK_CONDITION', 'Append terminal null indicators for leaves to preserve pointer topology.', 'Serialization', 6);

  // Step 5: Complete
  pushFrame(frames, stack, elements, 'COMPLETE', 'Serialization Complete! Output string: "20,10,30,5,15,25,35,null,null..."', 'Serialization', 6);

  return frames;
}

// ----------------------------------------------------------------------
// 13. DESERIALIZATION
// ----------------------------------------------------------------------
export function generateDeserializeTreeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const stack: CallStackFrame[] = [];

  // Start with root
  const elements: VisualElement[] = [
    { id: 'n20', value: 20, state: 'found', leftId: null, rightId: null, label: 'Parsed Root 20' }
  ];
  pushFrame(frames, stack, elements, 'INIT', 'Deserialization: Reading stream "20,10,30,5,15,25,35" and reconstructing nodes and pointers.', 'Deserialization', 6);

  // Add children 10 and 30
  elements[0].leftId = 'n10';
  elements[0].rightId = 'n30';
  elements.push({ id: 'n10', value: 10, state: 'swapping', leftId: null, rightId: null, parentId: 'n20', label: 'Linked Left' });
  elements.push({ id: 'n30', value: 30, state: 'swapping', leftId: null, rightId: null, parentId: 'n20', label: 'Linked Right' });
  pushFrame(frames, stack, elements, 'INSERT', 'Parsed tokens "10" and "30": Linked as left and right children of Root Node(20).', 'Deserialization', 6);

  // Add left leaves 5 and 15
  elements.find(e => e.id === 'n10')!.leftId = 'n5';
  elements.find(e => e.id === 'n10')!.rightId = 'n15';
  elements.push({ id: 'n5', value: 5, state: 'swapping', leftId: null, rightId: null, parentId: 'n10', label: 'Linked Left' });
  elements.push({ id: 'n15', value: 15, state: 'swapping', leftId: null, rightId: null, parentId: 'n10', label: 'Linked Right' });
  pushFrame(frames, stack, elements, 'INSERT', 'Parsed tokens "5" and "15": Linked as left and right children of Node(10).', 'Deserialization', 6);

  // Add right leaves 25 and 35
  elements.find(e => e.id === 'n30')!.leftId = 'n25';
  elements.find(e => e.id === 'n30')!.rightId = 'n35';
  elements.push({ id: 'n25', value: 25, state: 'swapping', leftId: null, rightId: null, parentId: 'n30', label: 'Linked Left' });
  elements.push({ id: 'n35', value: 35, state: 'swapping', leftId: null, rightId: null, parentId: 'n30', label: 'Linked Right' });
  pushFrame(frames, stack, elements, 'INSERT', 'Parsed tokens "25" and "35": Linked as left and right children of Node(30).', 'Deserialization', 6);

  // Full tree restored
  const fullTree = createStandardBST();
  fullTree.forEach(e => { e.state = 'found'; e.label = 'Rebuilt'; });
  pushFrame(frames, stack, fullTree, 'COMPLETE', 'Full Binary Tree Reconstructed! All 7 nodes, 6 edges, and levels completely restored.', 'Deserialization', 6);

  return frames;
}

export function generateGenericTreeFrames(title: string): VisualizationFrame[] {
  return generateBinaryTreeFrames();
}
