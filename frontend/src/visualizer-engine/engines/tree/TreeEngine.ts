import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { TreeVisualizerState, TreeNode } from '../../types/ds-states';

export class TreeEngine implements IVisualizerEngine<TreeVisualizerState> {
  public meta: EngineMeta = {
    id: 'tree-engine',
    name: 'Tree & AVL Engine',
    dataStructure: 'tree',
    category: 'Trees & Hierarchical Structures',
    supportedOperations: [
      'insert',
      'search',
      'delete',
      'inorder',
      'preorder',
      'postorder',
      'levelorder',
      'avl-balance',
      'rotate-left',
      'rotate-right',
    ],
    defaultInput: [50, 30, 70, 20, 40, 60, 80],
  };

  public generateInitialState(input?: number[], treeType: 'binary-tree' | 'bst' | 'avl' = 'bst'): TreeVisualizerState {
    const rawValues = Array.isArray(input) && input.length > 0 ? input : this.meta.defaultInput;
    const nodes: Record<string, TreeNode> = {};
    let rootId: string | null = null;

    // Build standard BST from initial input
    for (const val of rawValues) {
      rootId = this.insertRawBST(nodes, rootId, val);
    }

    this.recomputeHeights(nodes, rootId);

    return {
      nodes,
      rootId,
      traversalOrder: [],
      activePath: [],
      treeType,
      message: `Binary Search Tree initialized with ${Object.keys(nodes).length} nodes. Root is Node(${rootId ? nodes[rootId].value : 'none'}).`,
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: TreeVisualizerState
  ): TimelineSnapshot<TreeVisualizerState>[] {
    switch (operation) {
      case 'insert':
        return this.runInsert(currentState, Number(params.value ?? 45));
      case 'search':
        return this.runSearch(currentState, Number(params.target ?? 40));
      case 'delete':
        return this.runDelete(currentState, Number(params.value ?? 20));
      case 'inorder':
        return this.runTraversal(currentState, 'inorder');
      case 'preorder':
        return this.runTraversal(currentState, 'preorder');
      case 'postorder':
        return this.runTraversal(currentState, 'postorder');
      case 'levelorder':
        return this.runTraversal(currentState, 'levelorder');
      case 'rotate-left':
        return this.runRotateLeft(currentState);
      case 'rotate-right':
        return this.runRotateRight(currentState);
      default:
        return this.runTraversal(currentState, 'inorder');
    }
  }

  // ================= BST INSERTION =================
  private runInsert(state: TreeVisualizerState, value: number): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const nodes: Record<string, TreeNode> = JSON.parse(JSON.stringify(state.nodes));

    if (!state.rootId) {
      const newRootId = `node-${value}`;
      nodes[newRootId] = {
        id: newRootId,
        value,
        leftId: null,
        rightId: null,
        height: 1,
        balanceFactor: 0,
        state: 'inserted',
        level: 0,
      };

      snapshots.push({
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'ins-root', type: 'INSERT_ROOT', description: `Tree empty. Node(${value}) is new root.` },
        state: { ...state, nodes, rootId: newRootId, message: `Node(${value}) created as ROOT of the tree.` },
        explanation: 'If tree is empty, new node becomes the root node.',
        pseudocodeLine: 1,
      });
      return snapshots;
    }

    let currId: string | null = state.rootId;
    let parentId: string | null = null;
    let isLeftChild = false;
    const path: string[] = [];

    while (currId) {
      const currNode: TreeNode = nodes[currId];
      path.push(currId);

      // Snapshot: Inspecting node
      const activeNodes = JSON.parse(JSON.stringify(nodes));
      activeNodes[currId].state = 'comparing';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 10,
        event: { id: `cmp-${currId}`, type: 'COMPARE', description: `Compare ${value} with Node(${currNode.value})` },
        state: {
          ...state,
          nodes: activeNodes,
          activePath: [...path],
          message: `Compare ${value} with current node ${currNode.value}. ${value < currNode.value ? `${value} < ${currNode.value} -> Go LEFT` : `${value} > ${currNode.value} -> Go RIGHT`}`,
        },
        explanation: `In a BST: values smaller than current node belong in LEFT subtree, larger in RIGHT subtree.`,
        pseudocodeLine: 2,
      });

      parentId = currId;
      if (value < currNode.value) {
        isLeftChild = true;
        currId = currNode.leftId;
      } else if (value > currNode.value) {
        isLeftChild = false;
        currId = currNode.rightId;
      } else {
        // Duplicate
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: snapshots.length + 1,
          event: { id: 'dup', type: 'DUPLICATE', description: `Value ${value} already exists` },
          state: { ...state, nodes, activePath: [], message: `Value ${value} already exists in BST. Duplicates ignored.` },
          explanation: 'Standard BST does not store duplicate values.',
          pseudocodeLine: 4,
        });
        return snapshots;
      }
    }

    // Insert new node
    const newNodeId = `node-${value}`;
    nodes[newNodeId] = {
      id: newNodeId,
      value,
      leftId: null,
      rightId: null,
      parentId,
      height: 1,
      balanceFactor: 0,
      state: 'inserted',
      level: (nodes[parentId!].level || 0) + 1,
    };

    if (isLeftChild) {
      nodes[parentId!].leftId = newNodeId;
    } else {
      nodes[parentId!].rightId = newNodeId;
    }

    this.recomputeHeights(nodes, state.rootId);

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'ins-done', type: 'INSERT_DONE', description: `Inserted Node(${value})` },
      state: {
        ...state,
        nodes,
        activePath: [],
        message: `Attached Node(${value}) as ${isLeftChild ? 'LEFT' : 'RIGHT'} child of Node(${nodes[parentId!].value}).`,
      },
      explanation: `Insertion complete. Tree height recalculated. O(log N) average runtime.`,
      pseudocodeLine: 5,
    });

    return snapshots;
  }

  // ================= BST SEARCH =================
  private runSearch(state: TreeVisualizerState, target: number): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId) {
      return [
        {
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'search-empty', type: 'SEARCH_EMPTY', description: 'Tree is empty' },
          state: { ...state, message: 'Tree is empty. Target not found.' },
          explanation: 'Searching an empty tree returns null.',
          pseudocodeLine: 1,
        },
      ];
    }

    let currId: string | null = state.rootId;
    const path: string[] = [];
    let found = false;

    while (currId) {
      const node: TreeNode = state.nodes[currId];
      path.push(currId);

      const activeNodes: Record<string, TreeNode> = JSON.parse(JSON.stringify(state.nodes));
      const isMatch = node.value === target;
      activeNodes[currId].state = isMatch ? 'inserted' : 'comparing';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 8,
        event: { id: `search-cmp-${currId}`, type: 'COMPARE', description: `Compare ${target} with Node(${node.value})` },
        state: {
          ...state,
          nodes: activeNodes,
          activePath: [...path],
          message: isMatch
            ? `Target ${target} matches Node(${node.value})! Search successful.`
            : `Node(${node.value}) != ${target}. ${target < node.value ? 'Navigate LEFT' : 'Navigate RIGHT'}.`,
        },
        explanation: isMatch
          ? `Value matches current node! Return pointer.`
          : `Binary Search Tree property eliminates half the remaining tree at each decision branch.`,
        pseudocodeLine: isMatch ? 4 : 2,
      });

      if (isMatch) {
        found = true;
        break;
      }

      if (target < node.value) {
        currId = node.leftId;
      } else {
        currId = node.rightId;
      }
    }

    if (!found) {
      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: snapshots.length + 1,
        event: { id: 'not-found', type: 'NOT_FOUND', description: `Target ${target} not in BST` },
        state: { ...state, activePath: [], message: `Target ${target} not found. Reached NULL leaf branch.` },
        explanation: 'Reached null child without finding target. Value does not exist in BST.',
        pseudocodeLine: 6,
      });
    }

    return snapshots;
  }

  // ================= BST DELETION =================
  private runDelete(state: TreeVisualizerState, value: number): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const nodes: Record<string, TreeNode> = JSON.parse(JSON.stringify(state.nodes));

    // Find node to delete
    let targetId: string | null = null;
    for (const [id, n] of Object.entries(nodes)) {
      if (n.value === value) {
        targetId = id;
        break;
      }
    }

    if (!targetId) {
      snapshots.push({
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'del-not-found', type: 'NOT_FOUND', description: `Node(${value}) not in tree` },
        state: { ...state, message: `Node with value ${value} does not exist in the tree.` },
        explanation: 'Cannot delete non-existent node.',
        pseudocodeLine: 1,
      });
      return snapshots;
    }

    const targetNode = nodes[targetId];

    // Snapshot: Highlight node to delete
    nodes[targetId].state = 'deleted';
    snapshots.push({
      stepIndex: 0,
      totalSteps: 3,
      event: { id: 'del-locate', type: 'LOCATE_DEL', description: `Located Node(${value}) for deletion` },
      state: { ...state, nodes: JSON.parse(JSON.stringify(nodes)), message: `Located Node(${value}). Analyzing child cases...` },
      explanation: 'Three cases: Leaf (0 children), 1 child (bypass), 2 children (replace with inorder successor).',
      pseudocodeLine: 2,
    });

    // Case 1: Leaf node (no children)
    if (!targetNode.leftId && !targetNode.rightId) {
      if (targetNode.parentId) {
        const parent = nodes[targetNode.parentId];
        if (parent.leftId === targetId) parent.leftId = null;
        if (parent.rightId === targetId) parent.rightId = null;
      }
      delete nodes[targetId];
      const newRoot = targetId === state.rootId ? null : state.rootId;
      this.recomputeHeights(nodes, newRoot);

      snapshots.push({
        stepIndex: 1,
        totalSteps: 2,
        event: { id: 'del-leaf', type: 'DELETE_LEAF', description: `Removed leaf Node(${value})` },
        state: { ...state, nodes, rootId: newRoot, message: `Case 1: Leaf node removed directly.` },
        explanation: 'Leaf node has no children. Simply sever parent link.',
        pseudocodeLine: 3,
      });
      return snapshots;
    }

    // Case 2: One child
    if (!targetNode.leftId || !targetNode.rightId) {
      const childId = targetNode.leftId || targetNode.rightId;
      if (targetNode.parentId) {
        const parent = nodes[targetNode.parentId];
        if (parent.leftId === targetId) parent.leftId = childId;
        if (parent.rightId === targetId) parent.rightId = childId;
        nodes[childId!].parentId = targetNode.parentId;
      }
      delete nodes[targetId];
      const newRoot = targetId === state.rootId ? childId : state.rootId;
      this.recomputeHeights(nodes, newRoot);

      snapshots.push({
        stepIndex: 1,
        totalSteps: 2,
        event: { id: 'del-one-child', type: 'DELETE_ONE_CHILD', description: `Bypassed Node(${value}) with its child` },
        state: { ...state, nodes, rootId: newRoot, message: `Case 2: Bypassed Node(${value}) with its single child.` },
        explanation: 'Replace node with its only child to maintain tree continuity.',
        pseudocodeLine: 4,
      });
      return snapshots;
    }

    // Case 3: Two children -> find in-order successor (min in right subtree)
    let succId = targetNode.rightId!;
    while (nodes[succId].leftId) {
      succId = nodes[succId].leftId!;
    }
    const succVal = nodes[succId].value;

    targetNode.value = succVal;
    targetNode.state = 'inserted';

    // Remove successor leaf
    const succParent = nodes[nodes[succId].parentId!];
    if (succParent.leftId === succId) succParent.leftId = nodes[succId].rightId || null;
    else succParent.rightId = nodes[succId].rightId || null;
    delete nodes[succId];

    this.recomputeHeights(nodes, state.rootId);

    snapshots.push({
      stepIndex: 1,
      totalSteps: 2,
      event: { id: 'del-two-children', type: 'INORDER_SUCCESSOR', description: `Replaced with In-order Successor ${succVal}` },
      state: {
        ...state,
        nodes,
        message: `Case 3: Replaced Node(${value}) with in-order successor (${succVal}) and deleted successor.`,
      },
      explanation: 'Two children case: swap with smallest node in right subtree, then remove that duplicate leaf.',
      pseudocodeLine: 5,
    });

    return snapshots;
  }

  // ================= TREE TRAVERSALS =================
  private runTraversal(state: TreeVisualizerState, order: 'inorder' | 'preorder' | 'postorder' | 'levelorder'): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId) return [];

    const orderSequence: number[] = [];
    const visitIds: string[] = [];

    const traverse = (nodeId: string | null) => {
      if (!nodeId) return;
      const node = state.nodes[nodeId];

      if (order === 'preorder') {
        orderSequence.push(node.value);
        visitIds.push(nodeId);
      }
      traverse(node.leftId);
      if (order === 'inorder') {
        orderSequence.push(node.value);
        visitIds.push(nodeId);
      }
      traverse(node.rightId);
      if (order === 'postorder') {
        orderSequence.push(node.value);
        visitIds.push(nodeId);
      }
    };

    if (order === 'levelorder') {
      const q: string[] = [state.rootId];
      while (q.length > 0) {
        const curr = q.shift()!;
        const node = state.nodes[curr];
        orderSequence.push(node.value);
        visitIds.push(curr);
        if (node.leftId) q.push(node.leftId);
        if (node.rightId) q.push(node.rightId);
      }
    } else {
      traverse(state.rootId);
    }

    snapshots.push({
      stepIndex: 0,
      totalSteps: visitIds.length + 1,
      event: { id: 'trav-start', type: 'TRAVERSE_START', description: `Starting ${order.toUpperCase()} Traversal` },
      state: { ...state, traversalOrder: [], message: `Beginning ${order.toUpperCase()} Traversal at root.` },
      explanation: `${order.toUpperCase()} traversal algorithm initiated.`,
      pseudocodeLine: 1,
    });

    const currentOrder: number[] = [];
    for (let i = 0; i < visitIds.length; i++) {
      const activeId = visitIds[i];
      const activeNode = state.nodes[activeId];
      currentOrder.push(activeNode.value);

      const updatedNodes: Record<string, TreeNode> = JSON.parse(JSON.stringify(state.nodes));
      updatedNodes[activeId].state = 'visited';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: visitIds.length + 1,
        event: { id: `visit-${activeId}`, type: 'VISIT_NODE', description: `Visited Node(${activeNode.value})` },
        state: {
          ...state,
          nodes: updatedNodes,
          traversalOrder: [...currentOrder],
          message: `Visited Node(${activeNode.value}). Order so far: [${currentOrder.join(', ')}]`,
        },
        explanation: `Process node data. Current output sequence: ${currentOrder.join(' -> ')}`,
        pseudocodeLine: 2,
      });
    }

    return snapshots;
  }

  // ================= AVL TREE ROTATIONS =================
  private runRotateLeft(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    if (!state.rootId || !state.nodes[state.rootId].rightId) {
      return [
        {
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'no-rot', type: 'ROTATE_FAIL', description: 'Cannot rotate left (no right child)' },
          state: { ...state, message: 'Cannot perform Left Rotation: root has no right child.' },
          explanation: 'Left rotation requires a right child to become the new subtree root.',
          pseudocodeLine: 1,
        },
      ];
    }

    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const nodes: Record<string, TreeNode> = JSON.parse(JSON.stringify(state.nodes));
    const oldRoot = nodes[state.rootId];
    const newRootId = oldRoot.rightId!;
    const newRoot = nodes[newRootId];

    oldRoot.rightId = newRoot.leftId;
    newRoot.leftId = oldRoot.id;

    this.recomputeHeights(nodes, newRootId);

    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'rot-left', type: 'ROTATE_LEFT', description: `Left Rotation around Node(${oldRoot.value})` },
      state: {
        ...state,
        nodes,
        rootId: newRootId,
        rotationInfo: {
          type: 'LL',
          pivotNodeId: oldRoot.id,
          description: `Rotated left around Node(${oldRoot.value}). Node(${newRoot.value}) is new root.`,
        },
        message: `Left Rotation complete. Node(${newRoot.value}) elevated to root. Tree rebalanced!`,
      },
      explanation: 'Left Rotation: Right child moves up to root, old root becomes its left child.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runRotateRight(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    if (!state.rootId || !state.nodes[state.rootId].leftId) {
      return [
        {
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'no-rot', type: 'ROTATE_FAIL', description: 'Cannot rotate right (no left child)' },
          state: { ...state, message: 'Cannot perform Right Rotation: root has no left child.' },
          explanation: 'Right rotation requires a left child to become the new subtree root.',
          pseudocodeLine: 1,
        },
      ];
    }

    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const nodes: Record<string, TreeNode> = JSON.parse(JSON.stringify(state.nodes));
    const oldRoot = nodes[state.rootId];
    const newRootId = oldRoot.leftId!;
    const newRoot = nodes[newRootId];

    oldRoot.leftId = newRoot.rightId;
    newRoot.rightId = oldRoot.id;

    this.recomputeHeights(nodes, newRootId);

    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'rot-right', type: 'ROTATE_RIGHT', description: `Right Rotation around Node(${oldRoot.value})` },
      state: {
        ...state,
        nodes,
        rootId: newRootId,
        rotationInfo: {
          type: 'RR',
          pivotNodeId: oldRoot.id,
          description: `Rotated right around Node(${oldRoot.value}). Node(${newRoot.value}) is new root.`,
        },
        message: `Right Rotation complete. Node(${newRoot.value}) elevated to root. Tree rebalanced!`,
      },
      explanation: 'Right Rotation: Left child moves up to root, old root becomes its right child.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private insertRawBST(nodes: Record<string, TreeNode>, rootId: string | null, val: number): string {
    const id = `node-${val}`;
    if (!rootId) {
      nodes[id] = { id, value: val, leftId: null, rightId: null, height: 1, balanceFactor: 0, state: 'default', level: 0 };
      return id;
    }

    let curr = rootId;
    while (curr) {
      const node = nodes[curr];
      if (val < node.value) {
        if (!node.leftId) {
          nodes[id] = { id, value: val, leftId: null, rightId: null, parentId: curr, height: 1, balanceFactor: 0, state: 'default', level: node.level + 1 };
          node.leftId = id;
          break;
        }
        curr = node.leftId;
      } else if (val > node.value) {
        if (!node.rightId) {
          nodes[id] = { id, value: val, leftId: null, rightId: null, parentId: curr, height: 1, balanceFactor: 0, state: 'default', level: node.level + 1 };
          node.rightId = id;
          break;
        }
        curr = node.rightId;
      } else {
        break;
      }
    }

    return rootId;
  }

  private recomputeHeights(nodes: Record<string, TreeNode>, rootId: string | null): number {
    if (!rootId || !nodes[rootId]) return 0;
    const node = nodes[rootId];

    const leftH = this.recomputeHeights(nodes, node.leftId);
    const rightH = this.recomputeHeights(nodes, node.rightId);

    node.height = 1 + Math.max(leftH, rightH);
    node.balanceFactor = leftH - rightH;
    return node.height;
  }
}
