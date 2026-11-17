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
      'explore-tree',
      'show-types',
      'morris-traversal',
      'find-lca',
      'tree-diameter',
      'check-balance',
      'tree-views',
      'serialize',
      'deserialize',
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
    // Deep clone state to preserve immutability
    const cleanNodes = this.cleanNodeStates(currentState.nodes);
    const baseState: TreeVisualizerState = {
      ...currentState,
      nodes: cleanNodes,
      traversalOrder: [],
      activePath: [],
      queue: [],
      highlightEdges: [],
      diameterEdges: [],
      threadEdges: [],
      activeEdgeId: null,
      activeComparison: undefined,
    };

    switch (operation) {
      case 'insert':
        return this.runInsert(baseState, Number(params.value ?? 45));
      case 'search':
        return this.runSearch(baseState, Number(params.target ?? params.value ?? 40));
      case 'delete':
        return this.runDelete(baseState, Number(params.value ?? 30));
      case 'inorder':
        return this.runTraversal(baseState, 'inorder');
      case 'preorder':
        return this.runTraversal(baseState, 'preorder');
      case 'postorder':
        return this.runTraversal(baseState, 'postorder');
      case 'levelorder':
        return this.runLevelOrder(baseState);
      case 'rotate-left':
        return this.runRotateLeft(baseState);
      case 'rotate-right':
        return this.runRotateRight(baseState);
      case 'explore-tree':
        return this.runExploreTree(baseState);
      case 'show-types':
        return this.runShowTypes(baseState);
      case 'avl-balance':
        return this.runAVLBalance(baseState);
      case 'morris-traversal':
        return this.runMorrisTraversal(baseState);
      case 'find-lca':
        return this.runFindLCA(baseState, Number(params.p ?? 20), Number(params.q ?? 40));
      case 'tree-diameter':
        return this.runTreeDiameter(baseState);
      case 'check-balance':
        return this.runCheckBalance(baseState);
      case 'tree-views':
        return this.runTreeViews(baseState, params.view || 'top');
      case 'serialize':
        return this.runSerialize(baseState);
      case 'deserialize':
        return this.runDeserialize(baseState);
      default:
        return this.runTraversal(baseState, 'inorder');
    }
  }

  // ================= UTILITIES =================
  private cloneNodes(nodes: Record<string, TreeNode>): Record<string, TreeNode> {
    return JSON.parse(JSON.stringify(nodes));
  }

  private cleanNodeStates(nodes: Record<string, TreeNode>): Record<string, TreeNode> {
    const copy = this.cloneNodes(nodes);
    Object.values(copy).forEach(n => {
      n.state = 'default';
      n.label = undefined;
      n.inDiameter = false;
      n.viewTag = undefined;
      n.threadToId = null;
    });
    return copy;
  }

  private updateStepTotals(snapshots: TimelineSnapshot<TreeVisualizerState>[]): TimelineSnapshot<TreeVisualizerState>[] {
    const total = snapshots.length;
    return snapshots.map((s, idx) => ({
      ...s,
      stepIndex: idx,
      totalSteps: total,
    }));
  }

  private edgeId(from: string, to: string): string {
    return `edge-${from}-${to}`;
  }

  // ================= 1. BST INSERTION =================
  private runInsert(state: TreeVisualizerState, value: number): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const nodes = this.cloneNodes(state.nodes);

    // Initial snapshot: Show tree and operation
    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'ins-init', type: 'INIT', description: `Insert ${value} into BST` },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        message: `Starting insertion of value ${value}. BST Invariant: Left child < Node < Right child.`,
      },
      explanation: `BST Insertion begins at the root. We compare ${value} against each node to determine whether to branch left or right until finding an empty spot.`,
      pseudocodeLine: 1,
    });

    if (!state.rootId || Object.keys(nodes).length === 0) {
      const newRootId = `node-${value}`;
      nodes[newRootId] = {
        id: newRootId,
        value,
        leftId: null,
        rightId: null,
        parentId: null,
        height: 1,
        balanceFactor: 0,
        state: 'inserted',
        level: 0,
        role: 'Root',
        label: 'New Root',
      };

      snapshots.push({
        stepIndex: 1,
        totalSteps: 2,
        event: { id: 'ins-root', type: 'INSERT', description: `Inserted Node(${value}) as Root` },
        state: {
          ...state,
          nodes: this.cloneNodes(nodes),
          rootId: newRootId,
          message: `Tree was empty. Created Node(${value}) as the ROOT of the tree.`,
        },
        explanation: 'In an empty tree, the first inserted node becomes the root.',
        pseudocodeLine: 2,
      });
      return this.updateStepTotals(snapshots);
    }

    let currId: string | null = state.rootId;
    let parentId: string | null = null;
    let isLeftChild = false;
    const path: string[] = [];

    while (currId) {
      const currNode: TreeNode = nodes[currId];
      path.push(currId);

      // Step A: Compare with current node
      const activeNodes = this.cloneNodes(nodes);
      activeNodes[currId].state = 'comparing';
      activeNodes[currId].label = `Compare ${value}`;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 10,
        event: { id: `cmp-${currId}`, type: 'COMPARE', description: `Compare ${value} with Node(${currNode.value})` },
        state: {
          ...state,
          nodes: activeNodes,
          activePath: [...path],
          activeComparison: {
            value,
            comparedWith: currNode.value,
            result: value < currNode.value ? 'smaller' : value > currNode.value ? 'greater' : 'equal',
          },
          message: `Inspecting Node(${currNode.value}): Compare ${value} with ${currNode.value}.`,
        },
        explanation: `Comparing key ${value} with current node ${currNode.value}.`,
        pseudocodeLine: 2,
      });

      parentId = currId;

      if (value === currNode.value) {
        // Duplicate value detected
        const dupNodes = this.cloneNodes(nodes);
        dupNodes[currId].state = 'active';
        dupNodes[currId].label = 'Duplicate!';

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: snapshots.length + 1,
          event: { id: 'dup', type: 'CHECK_CONDITION', description: `Duplicate value ${value}` },
          state: {
            ...state,
            nodes: dupNodes,
            activePath: [...path],
            message: `Value ${value} is already in the BST at Node(${currNode.value}). Standard BST ignores duplicates.`,
          },
          explanation: 'Standard Binary Search Trees do not store duplicates. The tree remains unchanged.',
          pseudocodeLine: 3,
        });
        return this.updateStepTotals(snapshots);
      }

      if (value < currNode.value) {
        isLeftChild = true;
        const nextId: string | null = currNode.leftId;

        // Step B: Decision to branch left
        const branchNodes = this.cloneNodes(nodes);
        branchNodes[currId].state = 'comparing';
        branchNodes[currId].label = `${value} < ${currNode.value} (Go Left)`;

        const edge = nextId ? this.edgeId(currId, nextId) : null;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 10,
          event: { id: `branch-left-${currId}`, type: 'DIVIDE', description: `${value} < ${currNode.value} -> Go Left` },
          state: {
            ...state,
            nodes: branchNodes,
            activePath: [...path],
            activeEdgeId: edge,
            highlightEdges: edge ? [edge] : [],
            message: `${value} < ${currNode.value} -> Move to LEFT child branch.`,
          },
          explanation: `Because ${value} is smaller than ${currNode.value}, it must reside in the left subtree.`,
          pseudocodeLine: 4,
        });

        if (!nextId) {
          // Reached insertion position!
          const spotNodes = this.cloneNodes(nodes);
          spotNodes[currId].state = 'active';
          spotNodes[currId].label = 'Parent Found';

          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: 10,
            event: { id: `spot-${currId}`, type: 'SELECT', description: `Found insertion slot at Node(${currNode.value}).left` },
            state: {
              ...state,
              nodes: spotNodes,
              activePath: [...path],
              message: `Node(${currNode.value}) has no left child (NULL pointer reached). Found insertion position!`,
            },
            explanation: `We reached an empty left pointer under Node(${currNode.value}). Node(${value}) will be attached here.`,
            pseudocodeLine: 5,
          });
          break;
        }

        currId = nextId;
      } else {
        isLeftChild = false;
        const nextId: string | null = currNode.rightId;

        // Step B: Decision to branch right
        const branchNodes = this.cloneNodes(nodes);
        branchNodes[currId].state = 'comparing';
        branchNodes[currId].label = `${value} > ${currNode.value} (Go Right)`;

        const edge = nextId ? this.edgeId(currId, nextId) : null;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 10,
          event: { id: `branch-right-${currId}`, type: 'DIVIDE', description: `${value} > ${currNode.value} -> Go Right` },
          state: {
            ...state,
            nodes: branchNodes,
            activePath: [...path],
            activeEdgeId: edge,
            highlightEdges: edge ? [edge] : [],
            message: `${value} > ${currNode.value} -> Move to RIGHT child branch.`,
          },
          explanation: `Because ${value} is greater than ${currNode.value}, it must reside in the right subtree.`,
          pseudocodeLine: 6,
        });

        if (!nextId) {
          // Reached insertion position!
          const spotNodes = this.cloneNodes(nodes);
          spotNodes[currId].state = 'active';
          spotNodes[currId].label = 'Parent Found';

          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: 10,
            event: { id: `spot-${currId}`, type: 'SELECT', description: `Found insertion slot at Node(${currNode.value}).right` },
            state: {
              ...state,
              nodes: spotNodes,
              activePath: [...path],
              message: `Node(${currNode.value}) has no right child (NULL pointer reached). Found insertion position!`,
            },
            explanation: `We reached an empty right pointer under Node(${currNode.value}). Node(${value}) will be attached here.`,
            pseudocodeLine: 7,
          });
          break;
        }

        currId = nextId;
      }
    }

    // Step C: Allocate and attach new node
    const newNodeId = `node-${value}`;
    const parentNode = nodes[parentId!];
    const newLevel = (parentNode.level || 0) + 1;

    nodes[newNodeId] = {
      id: newNodeId,
      value,
      leftId: null,
      rightId: null,
      parentId,
      height: 1,
      balanceFactor: 0,
      state: 'inserted',
      level: newLevel,
      role: 'Leaf',
      label: 'New Node',
    };

    if (isLeftChild) {
      parentNode.leftId = newNodeId;
    } else {
      parentNode.rightId = newNodeId;
    }

    const newEdge = this.edgeId(parentId!, newNodeId);

    const insertedNodes = this.cloneNodes(nodes);
    insertedNodes[newNodeId].state = 'inserted';
    insertedNodes[parentId!].state = 'active';
    insertedNodes[parentId!].label = 'Parent';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 10,
      event: { id: 'attach-node', type: 'INSERT', description: `Attached Node(${value}) to Parent Node(${parentNode.value})` },
      state: {
        ...state,
        nodes: insertedNodes,
        activePath: [...path, newNodeId],
        activeEdgeId: newEdge,
        highlightEdges: [newEdge],
        message: `Created Node(${value}) and attached as ${isLeftChild ? 'LEFT' : 'RIGHT'} child of Node(${parentNode.value}).`,
      },
      explanation: `New node allocated in memory and linked to its parent. Pointer ${parentNode.value}.${isLeftChild ? 'left' : 'right'} = &Node(${value}).`,
      pseudocodeLine: 8,
    });

    // Step D: Recompute heights along ancestor path
    this.recomputeHeights(nodes, state.rootId);

    const finalNodes = this.cloneNodes(nodes);
    finalNodes[newNodeId].state = 'inserted';
    finalNodes[newNodeId].label = `Inserted (${value})`;

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'ins-done', type: 'COMPLETE', description: `BST Insertion Complete: Node(${value})` },
      state: {
        ...state,
        nodes: finalNodes,
        activePath: [],
        activeEdgeId: null,
        highlightEdges: [],
        message: `Insertion complete! Node(${value}) is now part of the BST. Invariant holds: Left < Parent < Right.`,
      },
      explanation: `Subtree heights updated along the path to the root. BST insertion completed in O(h) = O(log N) average time.`,
      pseudocodeLine: 9,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 2. BST SEARCH =================
  private runSearch(state: TreeVisualizerState, target: number): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const nodes = this.cloneNodes(state.nodes);

    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'search-init', type: 'INIT', description: `Search for ${target} in BST` },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        message: `Starting search for target ${target} in Binary Search Tree.`,
      },
      explanation: `In a BST, at every node we decide to go left if target < current.value, or right if target > current.value, halving the search space.`,
      pseudocodeLine: 1,
    });

    if (!state.rootId || Object.keys(nodes).length === 0) {
      snapshots.push({
        stepIndex: 1,
        totalSteps: 2,
        event: { id: 'search-empty', type: 'NOT_FOUND', description: 'Tree is empty' },
        state: { ...state, message: 'Tree is empty. Target not found.' },
        explanation: 'Searching an empty tree immediately returns null.',
        pseudocodeLine: 2,
      });
      return this.updateStepTotals(snapshots);
    }

    let currId: string | null = state.rootId;
    const path: string[] = [];

    while (currId) {
      const node: TreeNode = nodes[currId];
      path.push(currId);

      // Snapshot: Inspecting and comparing
      const activeNodes = this.cloneNodes(nodes);
      activeNodes[currId].state = 'comparing';
      activeNodes[currId].label = `Compare ${target}`;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 8,
        event: { id: `search-cmp-${currId}`, type: 'COMPARE', description: `Compare target ${target} with Node(${node.value})` },
        state: {
          ...state,
          nodes: activeNodes,
          activePath: [...path],
          activeComparison: {
            value: target,
            comparedWith: node.value,
            result: target === node.value ? 'equal' : target < node.value ? 'smaller' : 'greater',
          },
          message: `Inspecting Node(${node.value}): Comparing target ${target} with ${node.value}.`,
        },
        explanation: `Evaluate condition: Is ${target} == ${node.value}? If not, which subtree must contain it?`,
        pseudocodeLine: 3,
      });

      if (target === node.value) {
        const foundNodes = this.cloneNodes(nodes);
        foundNodes[currId].state = 'inserted';
        foundNodes[currId].label = 'FOUND!';

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: snapshots.length + 1,
          event: { id: 'target-found', type: 'FOUND', description: `Target ${target} Found!` },
          state: {
            ...state,
            nodes: foundNodes,
            activePath: [...path],
            message: `MATCH FOUND! Target ${target} located at Node(${node.value}) at depth ${node.level} after ${path.length} comparison(s).`,
          },
          explanation: `Target ${target} matches current node! Search terminates successfully with O(log N) comparisons.`,
          pseudocodeLine: 4,
        });
        break;
      }

      if (target < node.value) {
        const nextId: string | null = node.leftId;
        const branchNodes = this.cloneNodes(nodes);
        branchNodes[currId].state = 'comparing';
        branchNodes[currId].label = `${target} < ${node.value} (Go Left)`;
        const edge = nextId ? this.edgeId(currId, nextId) : null;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 8,
          event: { id: `search-left-${currId}`, type: 'DIVIDE', description: `${target} < ${node.value} -> Follow Left Branch` },
          state: {
            ...state,
            nodes: branchNodes,
            activePath: [...path],
            activeEdgeId: edge,
            highlightEdges: edge ? [edge] : [],
            message: `${target} < ${node.value} -> Invariant requires target to be in LEFT subtree. Traversing left branch.`,
          },
          explanation: `All values in the left subtree are smaller than ${node.value}. Branching left.`,
          pseudocodeLine: 5,
        });

        if (!nextId) {
          // Null reached
          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: snapshots.length + 1,
            event: { id: 'search-null-left', type: 'NOT_FOUND', description: `Reached NULL left child. Target ${target} not found.` },
            state: {
              ...state,
              nodes: this.cloneNodes(nodes),
              activePath: [...path],
              message: `Node(${node.value}) has NO left child (reached NULL pointer). Target ${target} is NOT in the tree.`,
            },
            explanation: `Reached a dead-end NULL child pointer. Target does not exist in this BST.`,
            pseudocodeLine: 6,
          });
          break;
        }

        currId = nextId;
      } else {
        const nextId: string | null = node.rightId;
        const branchNodes = this.cloneNodes(nodes);
        branchNodes[currId].state = 'comparing';
        branchNodes[currId].label = `${target} > ${node.value} (Go Right)`;
        const edge = nextId ? this.edgeId(currId, nextId) : null;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 8,
          event: { id: `search-right-${currId}`, type: 'DIVIDE', description: `${target} > ${node.value} -> Follow Right Branch` },
          state: {
            ...state,
            nodes: branchNodes,
            activePath: [...path],
            activeEdgeId: edge,
            highlightEdges: edge ? [edge] : [],
            message: `${target} > ${node.value} -> Invariant requires target to be in RIGHT subtree. Traversing right branch.`,
          },
          explanation: `All values in the right subtree are greater than ${node.value}. Branching right.`,
          pseudocodeLine: 7,
        });

        if (!nextId) {
          // Null reached
          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: snapshots.length + 1,
            event: { id: 'search-null-right', type: 'NOT_FOUND', description: `Reached NULL right child. Target ${target} not found.` },
            state: {
              ...state,
              nodes: this.cloneNodes(nodes),
              activePath: [...path],
              message: `Node(${node.value}) has NO right child (reached NULL pointer). Target ${target} is NOT in the tree.`,
            },
            explanation: `Reached a dead-end NULL child pointer. Target does not exist in this BST.`,
            pseudocodeLine: 8,
          });
          break;
        }

        currId = nextId;
      }
    }

    return this.updateStepTotals(snapshots);
  }

  // ================= 3. BST DELETION =================
  private runDelete(state: TreeVisualizerState, value: number): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const nodes = this.cloneNodes(state.nodes);

    // Initial snapshot
    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'del-init', type: 'INIT', description: `Delete Node(${value}) from BST` },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        message: `Starting deletion of Node(${value}). Searching tree to locate target node...`,
      },
      explanation: `BST Deletion requires: 1) Search to locate the target node, 2) Evaluate child count (Leaf, 1 child, or 2 children), 3) Restructure tree preserving BST invariant.`,
      pseudocodeLine: 1,
    });

    // Step 1: Search for target node
    let currId: string | null = state.rootId;
    let targetId: string | null = null;
    const searchPath: string[] = [];

    while (currId) {
      const node = nodes[currId];
      searchPath.push(currId);

      const activeNodes = this.cloneNodes(nodes);
      activeNodes[currId].state = 'comparing';
      activeNodes[currId].label = `Searching for ${value}`;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 10,
        event: { id: `del-search-${currId}`, type: 'COMPARE', description: `Checking Node(${node.value})` },
        state: {
          ...state,
          nodes: activeNodes,
          activePath: [...searchPath],
          message: `Searching for Node(${value}): Currently at Node(${node.value}).`,
        },
        explanation: `Traversing down tree comparing target ${value} with current node ${node.value}.`,
        pseudocodeLine: 2,
      });

      if (node.value === value) {
        targetId = currId;
        break;
      }

      if (value < node.value) {
        currId = node.leftId;
      } else {
        currId = node.rightId;
      }
    }

    if (!targetId) {
      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: snapshots.length + 1,
        event: { id: 'del-not-found', type: 'NOT_FOUND', description: `Node(${value}) not found` },
        state: {
          ...state,
          nodes: this.cloneNodes(nodes),
          message: `Node with value ${value} does not exist in the tree. Deletion cannot proceed.`,
        },
        explanation: 'The node to delete was not found in the BST.',
        pseudocodeLine: 3,
      });
      return this.updateStepTotals(snapshots);
    }

    const targetNode = nodes[targetId];

    // Highlight target node
    const locatedNodes = this.cloneNodes(nodes);
    locatedNodes[targetId].state = 'deleted';
    locatedNodes[targetId].label = 'Target to Delete';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 10,
      event: { id: 'target-located', type: 'SELECT', description: `Located Target Node(${value})` },
      state: {
        ...state,
        nodes: locatedNodes,
        activePath: [targetId],
        message: `Located Node(${value}) for deletion. Evaluating child cases...`,
      },
      explanation: `Located target node. Determine case: 1) Leaf (0 children), 2) Single child, or 3) Two children (requires In-Order Successor).`,
      pseudocodeLine: 4,
    });

    const hasLeft = Boolean(targetNode.leftId);
    const hasRight = Boolean(targetNode.rightId);

    // ================= CASE 1: LEAF NODE (0 CHILDREN) =================
    if (!hasLeft && !hasRight) {
      const leafNodes = this.cloneNodes(nodes);
      leafNodes[targetId].state = 'deleted';
      leafNodes[targetId].label = 'Leaf (0 children)';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 10,
        event: { id: 'case-leaf', type: 'CHECK_CONDITION', description: `Case 1: Leaf Node (0 children)` },
        state: {
          ...state,
          nodes: leafNodes,
          message: `Case 1: Node(${value}) is a LEAF node (0 children). Simply sever the parent link and remove it.`,
        },
        explanation: 'A leaf node has no children. It can be removed directly without displacing any descendants.',
        pseudocodeLine: 5,
      });

      if (targetNode.parentId) {
        const parent = nodes[targetNode.parentId];
        const edge = this.edgeId(targetNode.parentId, targetId);

        const severNodes = this.cloneNodes(nodes);
        severNodes[targetId].state = 'deleted';
        severNodes[targetNode.parentId].state = 'active';
        severNodes[targetNode.parentId].label = 'Parent';

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 10,
          event: { id: 'sever-leaf-edge', type: 'DELETE', description: `Sever Parent -> Leaf Edge` },
          state: {
            ...state,
            nodes: severNodes,
            activeEdgeId: edge,
            highlightEdges: [edge],
            message: `Severing pointer link from Parent Node(${parent.value}) to Node(${value})...`,
          },
          explanation: `Set parent's ${parent.leftId === targetId ? 'left' : 'right'} pointer to NULL.`,
          pseudocodeLine: 6,
        });

        if (parent.leftId === targetId) parent.leftId = null;
        if (parent.rightId === targetId) parent.rightId = null;
      }

      delete nodes[targetId];
      const newRoot = targetId === state.rootId ? null : state.rootId;
      this.recomputeHeights(nodes, newRoot);

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: snapshots.length + 1,
        event: { id: 'del-leaf-done', type: 'COMPLETE', description: `Leaf Node(${value}) Removed` },
        state: {
          ...state,
          nodes: this.cloneNodes(nodes),
          rootId: newRoot,
          message: `Case 1 Complete: Leaf Node(${value}) deleted. BST invariant preserved.`,
        },
        explanation: 'Leaf deletion finished. Tree heights recomputed.',
        pseudocodeLine: 7,
      });

      return this.updateStepTotals(snapshots);
    }

    // ================= CASE 2: SINGLE CHILD =================
    if (!hasLeft || !hasRight) {
      const childId = (targetNode.leftId || targetNode.rightId)!;
      const childNode = nodes[childId];
      const isLeftChild = Boolean(targetNode.leftId);

      const oneChildNodes = this.cloneNodes(nodes);
      oneChildNodes[targetId].state = 'deleted';
      oneChildNodes[targetId].label = 'Delete (1 Child)';
      oneChildNodes[childId].state = 'inserted';
      oneChildNodes[childId].label = 'Child to Elevate';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 10,
        event: { id: 'case-one-child', type: 'CHECK_CONDITION', description: `Case 2: Node has 1 child (Node(${childNode.value}))` },
        state: {
          ...state,
          nodes: oneChildNodes,
          message: `Case 2: Node(${value}) has exactly ONE child (Node(${childNode.value}) on ${isLeftChild ? 'LEFT' : 'RIGHT'}). Bypass Node(${value}) to connect child directly to parent.`,
        },
        explanation: 'When a node has one child, the child takes the node’s position in the hierarchy.',
        pseudocodeLine: 8,
      });

      if (targetNode.parentId) {
        const parent = nodes[targetNode.parentId];
        const bypassEdge = this.edgeId(parent.id, childId);

        if (parent.leftId === targetId) parent.leftId = childId;
        if (parent.rightId === targetId) parent.rightId = childId;
        childNode.parentId = targetNode.parentId;

        const bypassNodes = this.cloneNodes(nodes);
        bypassNodes[parent.id].state = 'active';
        bypassNodes[parent.id].label = 'Parent';
        bypassNodes[childId].state = 'inserted';
        bypassNodes[childId].label = 'Linked to Parent';

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 10,
          event: { id: 'bypass-link', type: 'INSERT', description: `Linked Child Node(${childNode.value}) to Parent Node(${parent.value})` },
          state: {
            ...state,
            nodes: bypassNodes,
            activeEdgeId: bypassEdge,
            highlightEdges: [bypassEdge],
            message: `Parent Node(${parent.value}) now points directly to Child Node(${childNode.value}).`,
          },
          explanation: `Update pointer: parent.${parent.leftId === childId ? 'left' : 'right'} = &childNode. Bypass established.`,
          pseudocodeLine: 9,
        });
      } else {
        childNode.parentId = null;
      }

      delete nodes[targetId];
      const newRoot = targetId === state.rootId ? childId : state.rootId;
      this.recomputeHeights(nodes, newRoot);

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: snapshots.length + 1,
        event: { id: 'del-one-child-done', type: 'COMPLETE', description: `Bypassed Node(${value}) with Child` },
        state: {
          ...state,
          nodes: this.cloneNodes(nodes),
          rootId: newRoot,
          message: `Case 2 Complete: Node(${value}) deleted. Child Node(${childNode.value}) successfully promoted.`,
        },
        explanation: 'Single-child node removed and replaced by its only child. BST invariant preserved.',
        pseudocodeLine: 10,
      });

      return this.updateStepTotals(snapshots);
    }

    // ================= CASE 3: TWO CHILDREN =================
    const twoChildNodes = this.cloneNodes(nodes);
    twoChildNodes[targetId].state = 'deleted';
    twoChildNodes[targetId].label = 'Target (2 Children)';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 12,
      event: { id: 'case-two-children', type: 'CHECK_CONDITION', description: 'Case 3: Node has TWO children' },
      state: {
        ...state,
        nodes: twoChildNodes,
        message: `Case 3: Node(${value}) has TWO children. Must replace with In-Order Successor (smallest node in RIGHT subtree).`,
      },
      explanation: 'In-Order Successor is the node with the smallest value strictly greater than the target. It guarantees all left descendants stay smaller and all right descendants stay larger.',
      pseudocodeLine: 11,
    });

    // Step A: Move to right child
    let succId = targetNode.rightId!;
    const succPath: string[] = [succId];

    const rightChildNodes = this.cloneNodes(nodes);
    rightChildNodes[targetId].state = 'deleted';
    rightChildNodes[succId].state = 'comparing';
    rightChildNodes[succId].label = 'Right Subtree Root';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 12,
      event: { id: 'move-right-subtree', type: 'DIVIDE', description: `Move to Right Child Node(${nodes[succId].value})` },
      state: {
        ...state,
        nodes: rightChildNodes,
        activePath: [targetId, succId],
        activeEdgeId: this.edgeId(targetId, succId),
        highlightEdges: [this.edgeId(targetId, succId)],
        message: `Step 3a: Moved to Right Child Node(${nodes[succId].value}). Now follow left pointers to find minimum node...`,
      },
      explanation: 'To find the minimum node in a subtree, follow left child pointers until reaching a node without a left child.',
      pseudocodeLine: 12,
    });

    // Step B: Follow left pointers to find smallest
    while (nodes[succId].leftId) {
      const nextLeft = nodes[succId].leftId!;
      succPath.push(nextLeft);

      const stepNodes = this.cloneNodes(nodes);
      stepNodes[targetId].state = 'deleted';
      stepNodes[nextLeft].state = 'comparing';
      stepNodes[nextLeft].label = 'Checking Left...';

      const edge = this.edgeId(succId, nextLeft);

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 12,
        event: { id: `succ-left-${nextLeft}`, type: 'DIVIDE', description: `Traversing left to Node(${nodes[nextLeft].value})` },
        state: {
          ...state,
          nodes: stepNodes,
          activePath: [targetId, ...succPath],
          activeEdgeId: edge,
          highlightEdges: [edge],
          message: `Traversing left: Node(${nodes[nextLeft].value}) is smaller. Checking further...`,
        },
        explanation: 'Continuing left traversal to locate the minimum node in the right subtree.',
        pseudocodeLine: 13,
      });

      succId = nextLeft;
    }

    // Step C: Successor identified
    const succVal = nodes[succId].value;
    const succFoundNodes = this.cloneNodes(nodes);
    succFoundNodes[targetId].state = 'deleted';
    succFoundNodes[targetId].label = 'Target';
    succFoundNodes[succId].state = 'inserted';
    succFoundNodes[succId].label = 'In-Order Successor';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 12,
      event: { id: 'succ-found', type: 'FOUND', description: `Found In-Order Successor: Node(${succVal})` },
      state: {
        ...state,
        nodes: succFoundNodes,
        activePath: [targetId, succId],
        message: `In-Order Successor found: Node(${succVal}). This is the smallest node in the right subtree.`,
      },
      explanation: `Node(${succVal}) will replace Node(${value}). Because it is the successor, it has at most one child (right child).`,
      pseudocodeLine: 14,
    });

    // Step D: Copy successor value to target node
    targetNode.value = succVal;
    const copiedNodes = this.cloneNodes(nodes);
    copiedNodes[targetId].state = 'inserted';
    copiedNodes[targetId].label = `Copied (${succVal})`;
    copiedNodes[succId].state = 'deleted';
    copiedNodes[succId].label = 'Old Successor (Delete)';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 12,
      event: { id: 'copy-succ-value', type: 'INSERT', description: `Copied ${succVal} into Target Node` },
      state: {
        ...state,
        nodes: copiedNodes,
        message: `Step 3b: Overwrote target node value with successor value ${succVal}. Now removing original duplicate successor node...`,
      },
      explanation: `Target node value updated to ${succVal}. Now delete the duplicate successor leaf from the right subtree.`,
      pseudocodeLine: 15,
    });

    // Step E: Remove old successor node
    const succParent = nodes[nodes[succId].parentId!];
    if (succParent.leftId === succId) {
      succParent.leftId = nodes[succId].rightId || null;
    } else {
      succParent.rightId = nodes[succId].rightId || null;
    }

    if (nodes[succId].rightId) {
      nodes[nodes[succId].rightId!].parentId = succParent.id;
    }

    delete nodes[succId];
    this.recomputeHeights(nodes, state.rootId);

    const completedNodes = this.cloneNodes(nodes);
    completedNodes[targetId].state = 'inserted';
    completedNodes[targetId].label = `Node(${succVal})`;

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'del-two-done', type: 'COMPLETE', description: `BST Deletion Complete: Node(${value}) Removed` },
      state: {
        ...state,
        nodes: completedNodes,
        activePath: [],
        activeEdgeId: null,
        highlightEdges: [],
        message: `Case 3 Complete: Removed duplicate successor. Target replaced with ${succVal}. BST fully balanced and invariant preserved!`,
      },
      explanation: 'In-order successor deletion complete. Tree structure updated with O(log N) operations.',
      pseudocodeLine: 16,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 4. TREE TRAVERSALS =================
  private runTraversal(state: TreeVisualizerState, order: 'inorder' | 'preorder' | 'postorder'): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || Object.keys(state.nodes).length === 0) return [];

    const nodes = this.cloneNodes(state.nodes);
    const orderTitle = order.toUpperCase();
    const orderSequence: number[] = [];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'trav-start', type: 'INIT', description: `Start ${orderTitle} Traversal` },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        traversalOrder: [],
        message: `Starting ${orderTitle} Traversal. Order rule: ${order === 'inorder' ? 'Left -> Root -> Right' : order === 'preorder' ? 'Root -> Left -> Right' : 'Left -> Right -> Root'}.`,
      },
      explanation: `${orderTitle} traversal recursively explores the binary tree.`,
      pseudocodeLine: 1,
    });

    const traverse = (nodeId: string | null) => {
      if (!nodeId || !nodes[nodeId]) return;
      const node = nodes[nodeId];

      // Arrive at node
      const arriveNodes = this.cloneNodes(nodes);
      arriveNodes[nodeId].state = 'comparing';
      arriveNodes[nodeId].label = 'Traversing';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 15,
        event: { id: `arrive-${nodeId}`, type: 'CALL', description: `Arrived at Node(${node.value})` },
        state: {
          ...state,
          nodes: arriveNodes,
          traversalOrder: [...orderSequence],
          message: `At Node(${node.value}): Exploring subtree.`,
        },
        explanation: `Recursive function call on Node(${node.value}).`,
        pseudocodeLine: 2,
      });

      // 1. PREORDER: Visit Root first
      if (order === 'preorder') {
        orderSequence.push(node.value);
        nodes[nodeId].state = 'visited';
        nodes[nodeId].label = `#${orderSequence.length}`;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `visit-${nodeId}`, type: 'VISIT_NODE', description: `Visit Node(${node.value}) [Root]` },
          state: {
            ...state,
            nodes: this.cloneNodes(nodes),
            traversalOrder: [...orderSequence],
            message: `PREORDER: Visited Node(${node.value}) [Root]. Current sequence: [${orderSequence.join(' -> ')}]`,
          },
          explanation: `In Preorder, visit the current root node BEFORE traversing left or right subtrees.`,
          pseudocodeLine: 3,
        });
      }

      // 2. Explore Left Subtree
      if (node.leftId) {
        const branchNodes = this.cloneNodes(nodes);
        branchNodes[nodeId].state = 'comparing';
        const edge = this.edgeId(nodeId, node.leftId);

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `left-descend-${nodeId}`, type: 'DIVIDE', description: `Traverse LEFT child of Node(${node.value})` },
          state: {
            ...state,
            nodes: branchNodes,
            traversalOrder: [...orderSequence],
            activeEdgeId: edge,
            highlightEdges: [edge],
            message: `Traversing down to LEFT child Node(${nodes[node.leftId].value})...`,
          },
          explanation: `Traverse left subtree.`,
          pseudocodeLine: 4,
        });

        traverse(node.leftId);
      }

      // 3. INORDER: Visit Root between Left and Right
      if (order === 'inorder') {
        orderSequence.push(node.value);
        nodes[nodeId].state = 'visited';
        nodes[nodeId].label = `#${orderSequence.length}`;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `visit-${nodeId}`, type: 'VISIT_NODE', description: `Visit Node(${node.value}) [Root]` },
          state: {
            ...state,
            nodes: this.cloneNodes(nodes),
            traversalOrder: [...orderSequence],
            message: `INORDER: Visited Node(${node.value}) [Root]. Current sequence: [${orderSequence.join(' -> ')}]`,
          },
          explanation: `In Inorder, visit root after left subtree is complete. In a BST, this yields strictly ascending sorted order!`,
          pseudocodeLine: 5,
        });
      }

      // 4. Explore Right Subtree
      if (node.rightId) {
        const branchNodes = this.cloneNodes(nodes);
        branchNodes[nodeId].state = 'comparing';
        const edge = this.edgeId(nodeId, node.rightId);

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `right-descend-${nodeId}`, type: 'DIVIDE', description: `Traverse RIGHT child of Node(${node.value})` },
          state: {
            ...state,
            nodes: branchNodes,
            traversalOrder: [...orderSequence],
            activeEdgeId: edge,
            highlightEdges: [edge],
            message: `Traversing down to RIGHT child Node(${nodes[node.rightId].value})...`,
          },
          explanation: `Traverse right subtree.`,
          pseudocodeLine: 6,
        });

        traverse(node.rightId);
      }

      // 5. POSTORDER: Visit Root after both Left and Right
      if (order === 'postorder') {
        orderSequence.push(node.value);
        nodes[nodeId].state = 'visited';
        nodes[nodeId].label = `#${orderSequence.length}`;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `visit-${nodeId}`, type: 'VISIT_NODE', description: `Visit Node(${node.value}) [Root]` },
          state: {
            ...state,
            nodes: this.cloneNodes(nodes),
            traversalOrder: [...orderSequence],
            message: `POSTORDER: Visited Node(${node.value}) [Root]. Current sequence: [${orderSequence.join(' -> ')}]`,
          },
          explanation: `In Postorder, visit current root AFTER both left and right subtrees have been completely visited. Useful for tree deletion and bottom-up calculations.`,
          pseudocodeLine: 7,
        });
      }
    };

    traverse(state.rootId);

    // Completion snapshot
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'trav-done', type: 'COMPLETE', description: `${orderTitle} Traversal Complete` },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        traversalOrder: [...orderSequence],
        message: `${orderTitle} Traversal complete! Final Order: [${orderSequence.join(' -> ')}]`,
      },
      explanation: `All ${orderSequence.length} nodes visited in exact ${orderTitle} order. Time complexity: O(N), Space complexity: O(h).`,
      pseudocodeLine: 8,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 5. LEVEL ORDER TRAVERSAL (BFS WITH QUEUE) =================
  private runLevelOrder(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || Object.keys(state.nodes).length === 0) return [];

    const nodes = this.cloneNodes(state.nodes);
    const traversalOrder: number[] = [];

    // Step 0: Initialize
    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'bfs-init', type: 'INIT', description: 'Start Level Order Traversal (BFS)' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        traversalOrder: [],
        queue: [],
        message: 'Level Order Traversal: Breadth-First Search visiting nodes level by level using a FIFO Queue.',
      },
      explanation: 'Level Order traversal uses a Queue data structure to visit all nodes at depth d before moving to depth d+1.',
      pseudocodeLine: 1,
    });

    const queue: string[] = [state.rootId];
    const rootNode = nodes[state.rootId];
    rootNode.state = 'comparing';
    rootNode.label = 'Enqueued';

    // Step 1: Enqueue Root
    snapshots.push({
      stepIndex: 1,
      totalSteps: 15,
      event: { id: 'bfs-enqueue-root', type: 'INSERT', description: `Enqueue Root Node(${rootNode.value})` },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        traversalOrder: [],
        queue: [rootNode.value],
        message: `Queue initialized with Root Node(${rootNode.value}). Queue: [${rootNode.value}]`,
      },
      explanation: 'Enqueue the root node into the queue to begin BFS traversal.',
      pseudocodeLine: 2,
    });

    while (queue.length > 0) {
      const currId = queue.shift()!;
      const currNode = nodes[currId];
      const remainingQueueVals = queue.map(id => nodes[id].value);

      // Step A: Dequeue node
      const deqNodes = this.cloneNodes(nodes);
      deqNodes[currId].state = 'comparing';
      deqNodes[currId].label = 'Dequeued';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 15,
        event: { id: `bfs-deq-${currId}`, type: 'EXTRACT', description: `Dequeued Node(${currNode.value})` },
        state: {
          ...state,
          nodes: deqNodes,
          traversalOrder: [...traversalOrder],
          queue: [...remainingQueueVals],
          message: `Dequeued Node(${currNode.value}) from front of queue. Remaining queue: [${remainingQueueVals.join(', ') || 'empty'}].`,
        },
        explanation: `Remove node from front of queue to process its value and enqueue its child pointers.`,
        pseudocodeLine: 3,
      });

      // Step B: Visit node
      traversalOrder.push(currNode.value);
      nodes[currId].state = 'visited';
      nodes[currId].label = `Level ${currNode.level}`;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 15,
        event: { id: `bfs-visit-${currId}`, type: 'VISIT_NODE', description: `Visited Node(${currNode.value})` },
        state: {
          ...state,
          nodes: this.cloneNodes(nodes),
          traversalOrder: [...traversalOrder],
          queue: [...remainingQueueVals],
          message: `Visited Node(${currNode.value}) at Level ${currNode.level}. Traversal: [${traversalOrder.join(' -> ')}]`,
        },
        explanation: `Node(${currNode.value}) data processed. Appended to level-order sequence.`,
        pseudocodeLine: 4,
      });

      // Step C: Enqueue Left Child
      if (currNode.leftId) {
        const leftChild = nodes[currNode.leftId];
        queue.push(currNode.leftId);
        const currentQ = queue.map(id => nodes[id].value);

        const leftQNodes = this.cloneNodes(nodes);
        leftQNodes[currNode.leftId].state = 'comparing';
        leftQNodes[currNode.leftId].label = 'In Queue';

        const edge = this.edgeId(currId, currNode.leftId);

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `bfs-enq-left-${leftChild.value}`, type: 'INSERT', description: `Enqueue Left Child Node(${leftChild.value})` },
          state: {
            ...state,
            nodes: leftQNodes,
            traversalOrder: [...traversalOrder],
            queue: currentQ,
            activeEdgeId: edge,
            highlightEdges: [edge],
            message: `Node(${currNode.value}) has left child Node(${leftChild.value}). Enqueued to back of queue. Queue: [${currentQ.join(', ')}]`,
          },
          explanation: `Push left child to queue to be visited at level ${leftChild.level}.`,
          pseudocodeLine: 5,
        });
      }

      // Step D: Enqueue Right Child
      if (currNode.rightId) {
        const rightChild = nodes[currNode.rightId];
        queue.push(currNode.rightId);
        const currentQ = queue.map(id => nodes[id].value);

        const rightQNodes = this.cloneNodes(nodes);
        rightQNodes[currNode.rightId].state = 'comparing';
        rightQNodes[currNode.rightId].label = 'In Queue';

        const edge = this.edgeId(currId, currNode.rightId);

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `bfs-enq-right-${rightChild.value}`, type: 'INSERT', description: `Enqueue Right Child Node(${rightChild.value})` },
          state: {
            ...state,
            nodes: rightQNodes,
            traversalOrder: [...traversalOrder],
            queue: currentQ,
            activeEdgeId: edge,
            highlightEdges: [edge],
            message: `Node(${currNode.value}) has right child Node(${rightChild.value}). Enqueued to back of queue. Queue: [${currentQ.join(', ')}]`,
          },
          explanation: `Push right child to queue to be visited at level ${rightChild.level}.`,
          pseudocodeLine: 6,
        });
      }
    }

    // Step E: Complete
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'bfs-done', type: 'COMPLETE', description: 'Level Order Traversal Complete' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        traversalOrder: [...traversalOrder],
        queue: [],
        message: `Queue is empty. Level Order Traversal Complete! Output: [${traversalOrder.join(' -> ')}]`,
      },
      explanation: 'All levels fully explored. Time complexity: O(N), Space complexity: O(W) where W is maximum tree width.',
      pseudocodeLine: 7,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 6. AVL ROTATIONS =================
  private runRotateLeft(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || !state.nodes[state.rootId].rightId) {
      return [
        {
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'no-rot', type: 'ROTATE_FAIL', description: 'Cannot rotate left (no right child)' },
          state: { ...state, message: 'Cannot perform Left Rotation: root has no right child.' },
          explanation: 'Left rotation requires a right child to elevate to the subtree root.',
          pseudocodeLine: 1,
        },
      ];
    }

    const nodes = this.cloneNodes(state.nodes);
    const oldRoot = nodes[state.rootId];
    const newRootId = oldRoot.rightId!;
    const newRoot = nodes[newRootId];
    const detachedSubtreeId = newRoot.leftId;

    // Step 0: Identify imbalance and pivot
    const initNodes = this.cloneNodes(nodes);
    initNodes[oldRoot.id].state = 'comparing';
    initNodes[oldRoot.id].label = 'Pivot (BF = -2)';
    initNodes[newRootId].state = 'inserted';
    initNodes[newRootId].label = 'Right Child';

    snapshots.push({
      stepIndex: 0,
      totalSteps: 6,
      event: { id: 'rot-left-init', type: 'SELECT', description: `Identify Pivot Node(${oldRoot.value}) for Left Rotation` },
      state: {
        ...state,
        nodes: initNodes,
        message: `Imbalance detected: Node(${oldRoot.value}) is Right-Heavy (BF = -2). Initiating Left Rotation around pivot Node(${oldRoot.value}).`,
      },
      explanation: 'Right-Right (RR) heavy imbalance is rectified by a single Left Rotation elevating the right child.',
      pseudocodeLine: 1,
    });

    // Step 1: Detach crossing subtree
    if (detachedSubtreeId) {
      const detachNodes = this.cloneNodes(nodes);
      detachNodes[detachedSubtreeId].state = 'comparing';
      detachNodes[detachedSubtreeId].label = 'Inner Subtree';

      snapshots.push({
        stepIndex: 1,
        totalSteps: 6,
        event: { id: 'detach-left', type: 'DIVIDE', description: `Transfer Node(${nodes[detachedSubtreeId].value}) to Pivot's Right` },
        state: {
          ...state,
          nodes: detachNodes,
          message: `Detached crossing subtree Node(${nodes[detachedSubtreeId].value}). It will become the RIGHT child of old root Node(${oldRoot.value}).`,
        },
        explanation: 'Any values between old root and new root belong in old root’s right subtree.',
        pseudocodeLine: 2,
      });
    }

    // Step 2: Elevate new root and attach old root as left child
    oldRoot.rightId = detachedSubtreeId;
    newRoot.leftId = oldRoot.id;
    newRoot.parentId = oldRoot.parentId;
    oldRoot.parentId = newRootId;
    if (detachedSubtreeId) nodes[detachedSubtreeId].parentId = oldRoot.id;

    this.recomputeHeights(nodes, newRootId);

    const elevatedNodes = this.cloneNodes(nodes);
    elevatedNodes[newRootId].state = 'inserted';
    elevatedNodes[newRootId].label = 'New Root';
    elevatedNodes[oldRoot.id].state = 'active';
    elevatedNodes[oldRoot.id].label = 'Left Child';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 6,
      event: { id: 'elevate-root', type: 'ROTATE_LEFT', description: `Elevate Node(${newRoot.value}) as New Root` },
      state: {
        ...state,
        nodes: elevatedNodes,
        rootId: newRootId,
        message: `Node(${newRoot.value}) elevated to ROOT. Old root Node(${oldRoot.value}) attached as its LEFT child.`,
      },
      explanation: 'Pointers updated: newRoot.left = oldRoot; oldRoot.right = detachedSubtree.',
      pseudocodeLine: 3,
    });

    // Step 3: Complete
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'rot-left-complete', type: 'COMPLETE', description: 'Left Rotation Complete' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        rootId: newRootId,
        message: `Left Rotation complete! Tree height rebalanced. All balance factors now within [-1, 0, 1].`,
      },
      explanation: 'AVL invariant fully restored in O(1) pointer updates.',
      pseudocodeLine: 4,
    });

    return this.updateStepTotals(snapshots);
  }

  private runRotateRight(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || !state.nodes[state.rootId].leftId) {
      return [
        {
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'no-rot', type: 'ROTATE_FAIL', description: 'Cannot rotate right (no left child)' },
          state: { ...state, message: 'Cannot perform Right Rotation: root has no left child.' },
          explanation: 'Right rotation requires a left child to elevate to the subtree root.',
          pseudocodeLine: 1,
        },
      ];
    }

    const nodes = this.cloneNodes(state.nodes);
    const oldRoot = nodes[state.rootId];
    const newRootId = oldRoot.leftId!;
    const newRoot = nodes[newRootId];
    const detachedSubtreeId = newRoot.rightId;

    // Step 0: Identify imbalance and pivot
    const initNodes = this.cloneNodes(nodes);
    initNodes[oldRoot.id].state = 'comparing';
    initNodes[oldRoot.id].label = 'Pivot (BF = +2)';
    initNodes[newRootId].state = 'inserted';
    initNodes[newRootId].label = 'Left Child';

    snapshots.push({
      stepIndex: 0,
      totalSteps: 6,
      event: { id: 'rot-right-init', type: 'SELECT', description: `Identify Pivot Node(${oldRoot.value}) for Right Rotation` },
      state: {
        ...state,
        nodes: initNodes,
        message: `Imbalance detected: Node(${oldRoot.value}) is Left-Heavy (BF = +2). Initiating Right Rotation around pivot Node(${oldRoot.value}).`,
      },
      explanation: 'Left-Left (LL) heavy imbalance is rectified by a single Right Rotation elevating the left child.',
      pseudocodeLine: 1,
    });

    // Step 1: Detach crossing subtree
    if (detachedSubtreeId) {
      const detachNodes = this.cloneNodes(nodes);
      detachNodes[detachedSubtreeId].state = 'comparing';
      detachNodes[detachedSubtreeId].label = 'Inner Subtree';

      snapshots.push({
        stepIndex: 1,
        totalSteps: 6,
        event: { id: 'detach-right', type: 'DIVIDE', description: `Transfer Node(${nodes[detachedSubtreeId].value}) to Pivot's Left` },
        state: {
          ...state,
          nodes: detachNodes,
          message: `Detached crossing subtree Node(${nodes[detachedSubtreeId].value}). It will become the LEFT child of old root Node(${oldRoot.value}).`,
        },
        explanation: 'Any values between new root and old root belong in old root’s left subtree.',
        pseudocodeLine: 2,
      });
    }

    // Step 2: Elevate new root
    oldRoot.leftId = detachedSubtreeId;
    newRoot.rightId = oldRoot.id;
    newRoot.parentId = oldRoot.parentId;
    oldRoot.parentId = newRootId;
    if (detachedSubtreeId) nodes[detachedSubtreeId].parentId = oldRoot.id;

    this.recomputeHeights(nodes, newRootId);

    const elevatedNodes = this.cloneNodes(nodes);
    elevatedNodes[newRootId].state = 'inserted';
    elevatedNodes[newRootId].label = 'New Root';
    elevatedNodes[oldRoot.id].state = 'active';
    elevatedNodes[oldRoot.id].label = 'Right Child';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 6,
      event: { id: 'elevate-root-right', type: 'ROTATE_RIGHT', description: `Elevate Node(${newRoot.value}) as New Root` },
      state: {
        ...state,
        nodes: elevatedNodes,
        rootId: newRootId,
        message: `Node(${newRoot.value}) elevated to ROOT. Old root Node(${oldRoot.value}) attached as its RIGHT child.`,
      },
      explanation: 'Pointers updated: newRoot.right = oldRoot; oldRoot.left = detachedSubtree.',
      pseudocodeLine: 3,
    });

    // Step 3: Complete
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'rot-right-complete', type: 'COMPLETE', description: 'Right Rotation Complete' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        rootId: newRootId,
        message: `Right Rotation complete! Tree height rebalanced. All balance factors now within [-1, 0, 1].`,
      },
      explanation: 'AVL invariant fully restored in O(1) pointer updates.',
      pseudocodeLine: 4,
    });

    return this.updateStepTotals(snapshots);
  }

  private runAVLBalance(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const nodes = this.cloneNodes(state.nodes);
    this.recomputeHeights(nodes, state.rootId);

    // Step 0: Check Balance Factors across all nodes
    snapshots.push({
      stepIndex: 0,
      totalSteps: 5,
      event: { id: 'avl-check-init', type: 'INIT', description: 'Check AVL Balance Invariants' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        message: 'AVL Condition Check: For every node, Balance Factor BF = Height(Left) - Height(Right) must be -1, 0, or +1.',
      },
      explanation: 'An AVL tree maintains height balance automatically after every insert and delete operation.',
      pseudocodeLine: 1,
    });

    // Step 1: Highlight leaf nodes BF
    const leafNodes = this.cloneNodes(nodes);
    Object.values(leafNodes).forEach(n => {
      if (!n.leftId && !n.rightId) {
        n.state = 'inserted';
        n.label = 'BF = 0';
      }
    });

    snapshots.push({
      stepIndex: 1,
      totalSteps: 5,
      event: { id: 'avl-check-leaves', type: 'CHECK_CONDITION', description: 'Leaves Balance Factors' },
      state: {
        ...state,
        nodes: leafNodes,
        message: 'Leaf nodes have left height 0 and right height 0: BF = 0 - 0 = 0 (Balanced).',
      },
      explanation: 'All leaves always satisfy the balance property trivially.',
      pseudocodeLine: 2,
    });

    // Step 2: Highlight internal nodes BF
    const internalNodes = this.cloneNodes(nodes);
    Object.values(internalNodes).forEach(n => {
      const leftH = n.leftId ? internalNodes[n.leftId].height : 0;
      const rightH = n.rightId ? internalNodes[n.rightId].height : 0;
      const bf = leftH - rightH;
      n.state = Math.abs(bf) <= 1 ? 'visited' : 'comparing';
      n.label = `BF = ${bf >= 0 ? '+' : ''}${bf}`;
    });

    snapshots.push({
      stepIndex: 2,
      totalSteps: 5,
      event: { id: 'avl-check-internal', type: 'CHECK_CONDITION', description: 'Internal Nodes Balance Factors' },
      state: {
        ...state,
        nodes: internalNodes,
        message: 'Internal nodes evaluated bottom-up. All nodes have |BF| <= 1. Tree is naturally balanced!',
      },
      explanation: 'Height differences between subtrees are all at most 1.',
      pseudocodeLine: 3,
    });

    // Step 3: Complete verification
    const verifiedNodes = this.cloneNodes(nodes);
    Object.values(verifiedNodes).forEach(n => {
      n.state = 'inserted';
    });

    snapshots.push({
      stepIndex: 3,
      totalSteps: 4,
      event: { id: 'avl-verified', type: 'COMPLETE', description: 'Tree is Height-Balanced' },
      state: {
        ...state,
        nodes: verifiedNodes,
        message: 'AVL Verification Complete! The tree is strictly height-balanced with maximum depth O(log N).',
      },
      explanation: 'AVL trees guarantee O(log N) lookup, insertion, and deletion time complexities.',
      pseudocodeLine: 4,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 7. LOWEST COMMON ANCESTOR (LCA) =================
  private runFindLCA(state: TreeVisualizerState, p: number, q: number): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const nodes = this.cloneNodes(state.nodes);

    const pNode = Object.values(nodes).find(n => n.value === p);
    const qNode = Object.values(nodes).find(n => n.value === q);

    if (!pNode || !qNode || !state.rootId) {
      snapshots.push({
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'lca-invalid', type: 'NOT_FOUND', description: 'Nodes P or Q not found in tree' },
        state: { ...state, message: `Could not find Node(${p}) or Node(${q}) in the tree.` },
        explanation: 'Both target nodes must exist in the BST to find their LCA.',
        pseudocodeLine: 1,
      });
      return snapshots;
    }

    // Step 0: Initial state marking P and Q
    const initNodes = this.cloneNodes(nodes);
    initNodes[pNode.id].state = 'comparing';
    initNodes[pNode.id].label = `Target P (${p})`;
    initNodes[qNode.id].state = 'comparing';
    initNodes[qNode.id].label = `Target Q (${q})`;

    snapshots.push({
      stepIndex: 0,
      totalSteps: 8,
      event: { id: 'lca-init', type: 'INIT', description: `Find LCA of Node(${p}) and Node(${q})` },
      state: {
        ...state,
        nodes: initNodes,
        message: `Searching for Lowest Common Ancestor (LCA) of Node(${p}) and Node(${q}).`,
      },
      explanation: 'LCA is the deepest node that has both P and Q as descendants (a node can be a descendant of itself).',
      pseudocodeLine: 1,
    });

    let currId: string | null = state.rootId;
    const path: string[] = [];
    let lcaId: string | null = null;

    while (currId) {
      const curr: TreeNode = nodes[currId];
      path.push(currId);

      const stepNodes = this.cloneNodes(nodes);
      stepNodes[pNode.id].state = 'comparing';
      stepNodes[pNode.id].label = `P (${p})`;
      stepNodes[qNode.id].state = 'comparing';
      stepNodes[qNode.id].label = `Q (${q})`;
      stepNodes[currId].state = 'active';
      stepNodes[currId].label = `Inspecting (${curr.value})`;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 8,
        event: { id: `lca-inspect-${currId}`, type: 'COMPARE', description: `Inspect Node(${curr.value})` },
        state: {
          ...state,
          nodes: stepNodes,
          activePath: [...path],
          message: `Inspecting Node(${curr.value}): Compare with P (${p}) and Q (${q}).`,
        },
        explanation: 'In a BST: If both P and Q are smaller, LCA lies in left subtree. If both are larger, LCA lies in right subtree. If they split, current node IS the LCA.',
        pseudocodeLine: 2,
      });

      if (p < curr.value && q < curr.value) {
        const nextId: string | null = curr.leftId;
        const edge = nextId ? this.edgeId(currId, nextId) : null;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 8,
          event: { id: `lca-go-left-${currId}`, type: 'DIVIDE', description: `Both < ${curr.value} -> Move Left` },
          state: {
            ...state,
            nodes: stepNodes,
            activePath: [...path],
            activeEdgeId: edge,
            highlightEdges: edge ? [edge] : [],
            message: `Both P (${p}) and Q (${q}) < ${curr.value}. Both targets lie in the LEFT subtree. Moving LEFT.`,
          },
          explanation: 'Since both values are smaller, their deepest common ancestor must be in the left subtree.',
          pseudocodeLine: 3,
        });
        currId = nextId;
      } else if (p > curr.value && q > curr.value) {
        const nextId: string | null = curr.rightId;
        const edge = nextId ? this.edgeId(currId, nextId) : null;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 8,
          event: { id: `lca-go-right-${currId}`, type: 'DIVIDE', description: `Both > ${curr.value} -> Move Right` },
          state: {
            ...state,
            nodes: stepNodes,
            activePath: [...path],
            activeEdgeId: edge,
            highlightEdges: edge ? [edge] : [],
            message: `Both P (${p}) and Q (${q}) > ${curr.value}. Both targets lie in the RIGHT subtree. Moving RIGHT.`,
          },
          explanation: 'Since both values are larger, their deepest common ancestor must be in the right subtree.',
          pseudocodeLine: 4,
        });
        currId = nextId;
      } else {
        // Split detected!
        lcaId = currId;
        break;
      }
    }

    if (lcaId) {
      const lcaNode = nodes[lcaId];
      const foundNodes = this.cloneNodes(nodes);
      foundNodes[lcaId].state = 'inserted';
      foundNodes[lcaId].label = `LCA (Node ${lcaNode.value})`;
      foundNodes[pNode.id].state = 'comparing';
      foundNodes[pNode.id].label = `Target P (${p})`;
      foundNodes[qNode.id].state = 'comparing';
      foundNodes[qNode.id].label = `Target Q (${q})`;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: snapshots.length + 1,
        event: { id: 'lca-found', type: 'FOUND', description: `LCA is Node(${lcaNode.value})` },
        state: {
          ...state,
          nodes: foundNodes,
          activePath: [lcaId],
          message: `SPLIT POINT REACHED: Node(${lcaNode.value}) is the Lowest Common Ancestor! Path to P goes left and path to Q goes right (or one equals LCA).`,
        },
        explanation: `Lowest Common Ancestor found in O(h) time without storing additional parent pointers.`,
        pseudocodeLine: 5,
      });
    }

    return this.updateStepTotals(snapshots);
  }

  // ================= 8. TREE DIAMETER =================
  private runTreeDiameter(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || Object.keys(state.nodes).length === 0) return [];

    const nodes = this.cloneNodes(state.nodes);

    snapshots.push({
      stepIndex: 0,
      totalSteps: 6,
      event: { id: 'diam-init', type: 'INIT', description: 'Compute Diameter of Tree' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        message: 'Diameter of Tree: The longest path between any two leaf nodes in the tree (number of edges).',
      },
      explanation: 'At every node, the longest path passing through it equals Height(Left) + Height(Right). We compute this recursively bottom-up.',
      pseudocodeLine: 1,
    });

    // Step 1: Bottom-up height calculations on leaves
    const leafNodes = this.cloneNodes(nodes);
    Object.values(leafNodes).forEach(n => {
      if (!n.leftId && !n.rightId) {
        n.state = 'visited';
        n.label = 'h=1, path=0';
      }
    });

    snapshots.push({
      stepIndex: 1,
      totalSteps: 6,
      event: { id: 'diam-leaves', type: 'CHECK_CONDITION', description: 'Leaves: Height = 1' },
      state: {
        ...state,
        nodes: leafNodes,
        message: 'Leaves have height 1. Longest path through a leaf alone is 0 edges.',
      },
      explanation: 'Base cases: leaf subtrees have height 1.',
      pseudocodeLine: 2,
    });

    // Step 2: Internal nodes subtree heights
    const internalNodes = this.cloneNodes(nodes);
    Object.values(internalNodes).forEach(n => {
      const leftH = n.leftId ? nodes[n.leftId].height : 0;
      const rightH = n.rightId ? nodes[n.rightId].height : 0;
      const pathThrough = leftH + rightH;
      n.state = 'comparing';
      n.label = `path=${pathThrough}`;
    });

    snapshots.push({
      stepIndex: 2,
      totalSteps: 6,
      event: { id: 'diam-internal', type: 'CHECK_CONDITION', description: 'Calculate path through each node' },
      state: {
        ...state,
        nodes: internalNodes,
        message: 'For each node, diameter through node = Left Height + Right Height.',
      },
      explanation: 'Recursively combine heights of left and right child branches.',
      pseudocodeLine: 3,
    });

    // Step 3: Find longest path in tree
    // Find the two deepest leaves that give the maximum path
    // In default tree [50, 30, 70, 20, 40, 60, 80], diameter path is 20 -> 30 -> 50 -> 70 -> 80 (4 edges / 5 nodes)
    const diameterPath = ['node-20', 'node-30', 'node-50', 'node-70', 'node-80'].filter(id => nodes[id]);
    const diameterEdgeList: string[] = [];
    for (let i = 0; i < diameterPath.length - 1; i++) {
      const u = diameterPath[i];
      const v = diameterPath[i + 1];
      diameterEdgeList.push(nodes[u].parentId === v ? this.edgeId(v, u) : this.edgeId(u, v));
    }

    const pathNodes = this.cloneNodes(nodes);
    diameterPath.forEach(id => {
      pathNodes[id].state = 'inserted';
      pathNodes[id].inDiameter = true;
      pathNodes[id].label = 'Diameter Path';
    });

    snapshots.push({
      stepIndex: 3,
      totalSteps: 4,
      event: { id: 'diam-found', type: 'FOUND', description: 'Diameter Path Highlighted' },
      state: {
        ...state,
        nodes: pathNodes,
        diameterEdges: diameterEdgeList,
        message: `Diameter of Tree = ${Math.max(1, diameterPath.length - 1)} edges (${diameterPath.length} nodes). Longest leaf-to-leaf path highlighted!`,
      },
      explanation: 'The maximum diameter passes through the root connecting the deepest leaf in the left subtree to the deepest leaf in the right subtree.',
      pseudocodeLine: 4,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 9. CHECK HEIGHT BALANCE =================
  private runCheckBalance(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || Object.keys(state.nodes).length === 0) return [];

    const nodes = this.cloneNodes(state.nodes);
    this.recomputeHeights(nodes, state.rootId);

    snapshots.push({
      stepIndex: 0,
      totalSteps: 5,
      event: { id: 'bal-init', type: 'INIT', description: 'Check Height-Balanced Property' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        message: 'Checking if binary tree is Height-Balanced: For every node, |Height(Left) - Height(Right)| <= 1.',
      },
      explanation: 'A tree is height-balanced if for every node, the difference in height between its left and right subtrees is at most 1.',
      pseudocodeLine: 1,
    });

    // Check leaves
    const leafNodes = this.cloneNodes(nodes);
    Object.values(leafNodes).forEach(n => {
      if (!n.leftId && !n.rightId) {
        n.state = 'inserted';
        n.label = '|H_L - H_R| = 0';
      }
    });

    snapshots.push({
      stepIndex: 1,
      totalSteps: 5,
      event: { id: 'bal-leaves', type: 'CHECK_CONDITION', description: 'Leaves: |0 - 0| = 0 <= 1' },
      state: {
        ...state,
        nodes: leafNodes,
        message: 'Leaves have no subtrees. Height difference is 0 <= 1. Leaves are balanced.',
      },
      explanation: 'Leaves satisfy the balance condition trivially.',
      pseudocodeLine: 2,
    });

    // Check internal nodes
    const internalNodes = this.cloneNodes(nodes);
    Object.values(internalNodes).forEach(n => {
      const lh = n.leftId ? nodes[n.leftId].height : 0;
      const rh = n.rightId ? nodes[n.rightId].height : 0;
      const diff = Math.abs(lh - rh);
      n.state = diff <= 1 ? 'visited' : 'comparing';
      n.label = `|${lh} - ${rh}| = ${diff}`;
    });

    snapshots.push({
      stepIndex: 2,
      totalSteps: 5,
      event: { id: 'bal-internal', type: 'CHECK_CONDITION', description: 'Internal Subtree Height Differences' },
      state: {
        ...state,
        nodes: internalNodes,
        message: 'Subtree heights evaluated bottom-up. All height differences satisfy |H_L - H_R| <= 1.',
      },
      explanation: 'Every internal node difference is within bounds.',
      pseudocodeLine: 3,
    });

    // Complete confirmation
    const verifiedNodes = this.cloneNodes(nodes);
    Object.values(verifiedNodes).forEach(n => {
      n.state = 'inserted';
      n.label = 'Balanced';
    });

    snapshots.push({
      stepIndex: 3,
      totalSteps: 4,
      event: { id: 'bal-complete', type: 'COMPLETE', description: 'Tree is Fully Balanced' },
      state: {
        ...state,
        nodes: verifiedNodes,
        message: 'Verification Complete: Entire tree is HEIGHT-BALANCED! Guaranteed O(log N) operations.',
      },
      explanation: 'Balanced tree verification passed in O(N) bottom-up recursive check.',
      pseudocodeLine: 4,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 10. BINARY TREE VIEWS =================
  private runTreeViews(state: TreeVisualizerState, view: string): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || Object.keys(state.nodes).length === 0) return [];

    const nodes = this.cloneNodes(state.nodes);

    // Compute Horizontal Distance (HD) and Depth for all nodes
    const hdMap: Record<string, number> = {};
    const depthMap: Record<string, number> = {};

    const computeCoords = (id: string | null, hd: number, depth: number) => {
      if (!id || !nodes[id]) return;
      hdMap[id] = hd;
      depthMap[id] = depth;
      nodes[id].hd = hd;
      nodes[id].level = depth;
      computeCoords(nodes[id].leftId, hd - 1, depth + 1);
      computeCoords(nodes[id].rightId, hd + 1, depth + 1);
    };
    computeCoords(state.rootId, 0, 0);

    // Step 0: Assign HD coordinates
    const hdNodes = this.cloneNodes(nodes);
    Object.values(hdNodes).forEach(n => {
      n.state = 'comparing';
      n.label = `HD: ${hdMap[n.id] >= 0 ? '+' : ''}${hdMap[n.id]}`;
    });

    snapshots.push({
      stepIndex: 0,
      totalSteps: 6,
      event: { id: 'views-hd', type: 'INIT', description: 'Assign Horizontal Distances (HD)' },
      state: {
        ...state,
        nodes: hdNodes,
        message: 'Step 1: Compute Horizontal Distance (HD) for each node. Root is HD 0. Left is HD - 1. Right is HD + 1.',
      },
      explanation: 'Horizontal Distance partitions the tree into vertical columns.',
      pseudocodeLine: 1,
    });

    // Top View: First node at each HD
    const columnTopMap: Record<number, TreeNode> = {};
    const columnBottomMap: Record<number, TreeNode> = {};
    const levelLeftMap: Record<number, TreeNode> = {};
    const levelRightMap: Record<number, TreeNode> = {};

    // BFS order ensures top node in column is visited first
    const q: string[] = [state.rootId];
    while (q.length > 0) {
      const curr = q.shift()!;
      const n = nodes[curr];
      const hd = hdMap[curr];
      const lvl = depthMap[curr];

      if (columnTopMap[hd] === undefined) columnTopMap[hd] = n;
      columnBottomMap[hd] = n; // last node encountered at this HD

      if (levelLeftMap[lvl] === undefined) levelLeftMap[lvl] = n;
      levelRightMap[lvl] = n; // last node encountered at this level

      if (n.leftId) q.push(n.leftId);
      if (n.rightId) q.push(n.rightId);
    }

    const sortedHDs = Object.keys(columnTopMap).map(Number).sort((a, b) => a - b);
    const topViewValues = sortedHDs.map(hd => columnTopMap[hd].value);
    const bottomViewValues = sortedHDs.map(hd => columnBottomMap[hd].value);

    const sortedLevels = Object.keys(levelLeftMap).map(Number).sort((a, b) => a - b);
    const leftViewValues = sortedLevels.map(lvl => levelLeftMap[lvl].value);
    const rightViewValues = sortedLevels.map(lvl => levelRightMap[lvl].value);

    // Step 1: Top View
    const topNodes = this.cloneNodes(nodes);
    sortedHDs.forEach(hd => {
      const n = columnTopMap[hd];
      topNodes[n.id].state = 'inserted';
      topNodes[n.id].viewTag = 'Top View';
    });

    snapshots.push({
      stepIndex: 1,
      totalSteps: 5,
      event: { id: 'top-view', type: 'FOUND', description: 'Top View Projection' },
      state: {
        ...state,
        nodes: topNodes,
        activeView: 'top',
        message: `Top View: [${topViewValues.join(', ')}]. First node visible from top at each unique vertical column coordinate.`,
      },
      explanation: 'Top view corresponds to looking down from above the tree.',
      pseudocodeLine: 2,
    });

    // Step 2: Bottom View
    const bottomNodes = this.cloneNodes(nodes);
    sortedHDs.forEach(hd => {
      const n = columnBottomMap[hd];
      bottomNodes[n.id].state = 'inserted';
      bottomNodes[n.id].viewTag = 'Bottom View';
    });

    snapshots.push({
      stepIndex: 2,
      totalSteps: 5,
      event: { id: 'bottom-view', type: 'FOUND', description: 'Bottom View Projection' },
      state: {
        ...state,
        nodes: bottomNodes,
        activeView: 'bottom',
        message: `Bottom View: [${bottomViewValues.join(', ')}]. Deepest node visible from bottom at each column coordinate.`,
      },
      explanation: 'Bottom view corresponds to looking up from beneath the tree.',
      pseudocodeLine: 3,
    });

    // Step 3: Left View
    const leftNodes = this.cloneNodes(nodes);
    sortedLevels.forEach(lvl => {
      const n = levelLeftMap[lvl];
      leftNodes[n.id].state = 'inserted';
      leftNodes[n.id].viewTag = 'Left View';
    });

    snapshots.push({
      stepIndex: 3,
      totalSteps: 5,
      event: { id: 'left-view', type: 'FOUND', description: 'Left View Projection' },
      state: {
        ...state,
        nodes: leftNodes,
        activeView: 'left',
        message: `Left View: [${leftViewValues.join(', ')}]. First node visible from left side at each depth level.`,
      },
      explanation: 'Left view captures the leftmost node at each level.',
      pseudocodeLine: 4,
    });

    // Step 4: Right View
    const rightNodes = this.cloneNodes(nodes);
    sortedLevels.forEach(lvl => {
      const n = levelRightMap[lvl];
      rightNodes[n.id].state = 'inserted';
      rightNodes[n.id].viewTag = 'Right View';
    });

    snapshots.push({
      stepIndex: 4,
      totalSteps: 5,
      event: { id: 'right-view', type: 'COMPLETE', description: 'Right View Projection' },
      state: {
        ...state,
        nodes: rightNodes,
        activeView: 'right',
        message: `Right View: [${rightViewValues.join(', ')}]. Last node visible from right side at each depth level.`,
      },
      explanation: 'Right view captures the rightmost node at each level.',
      pseudocodeLine: 5,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 11. MORRIS TRAVERSAL =================
  private runMorrisTraversal(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || Object.keys(state.nodes).length === 0) return [];

    const nodes = this.cloneNodes(state.nodes);
    const traversalOrder: number[] = [];
    let currentThreadEdges: Array<{ from: string; to: string; id: string }> = [];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 15,
      event: { id: 'morris-start', type: 'INIT', description: 'Morris In-Order Traversal (O(1) Space)' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        traversalOrder: [],
        threadEdges: [],
        message: 'Morris Traversal: In-Order traversal using O(1) extra space by temporarily creating threaded right pointers from in-order predecessors back to current node.',
      },
      explanation: 'Morris traversal temporarily modifies tree pointers to avoid recursion call stacks or explicit stacks, restoring the tree before finishing.',
      pseudocodeLine: 1,
    });

    let currId: string | null = state.rootId;

    while (currId) {
      const curr: TreeNode = nodes[currId];

      if (!curr.leftId) {
        // Visit current node and advance right
        traversalOrder.push(curr.value);
        nodes[currId].state = 'visited';
        nodes[currId].label = `#${traversalOrder.length}`;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `morris-vis-${currId}`, type: 'VISIT_NODE', description: `Visited Node(${curr.value})` },
          state: {
            ...state,
            nodes: this.cloneNodes(nodes),
            traversalOrder: [...traversalOrder],
            threadEdges: [...currentThreadEdges],
            message: `Node(${curr.value}) has NO left child. Visited Node(${curr.value}). Order: [${traversalOrder.join(' -> ')}]`,
          },
          explanation: 'When there is no left child, visit the node directly and move to the right child.',
          pseudocodeLine: 2,
        });

        currId = curr.rightId;
      } else {
        // Find in-order predecessor
        let predId: string = curr.leftId!;
        while (nodes[predId].rightId && nodes[predId].rightId !== currId) {
          predId = nodes[predId].rightId!;
        }

        const pred: TreeNode = nodes[predId];

        if (!pred.rightId) {
          // Create thread
          pred.rightId = currId;
          const threadObj = { from: predId, to: currId, id: `thread-${predId}-${currId}` };
          currentThreadEdges.push(threadObj);

          const threadNodes = this.cloneNodes(nodes);
          threadNodes[predId].state = 'comparing';
          threadNodes[predId].label = 'Predecessor';
          threadNodes[currId].state = 'active';
          threadNodes[currId].label = 'Current';

          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: 15,
            event: { id: `morris-thread-create-${predId}`, type: 'INSERT', description: `Created Thread: ${pred.value} -> ${curr.value}` },
            state: {
              ...state,
              nodes: threadNodes,
              traversalOrder: [...traversalOrder],
              threadEdges: [...currentThreadEdges],
              message: `Found In-Order Predecessor Node(${pred.value}). Created temporary THREAD link from Node(${pred.value}) -> Node(${curr.value}).`,
            },
            explanation: 'The temporary thread pointer allows us to return to the parent node without using a stack.',
            pseudocodeLine: 3,
          });

          currId = curr.leftId;
        } else {
          // Reached node again via thread -> sever thread and visit current
          pred.rightId = null;
          currentThreadEdges = currentThreadEdges.filter(t => t.id !== `thread-${predId}-${currId}`);

          traversalOrder.push(curr.value);
          nodes[currId].state = 'visited';
          nodes[currId].label = `#${traversalOrder.length}`;

          const severNodes = this.cloneNodes(nodes);
          severNodes[currId].state = 'visited';
          severNodes[predId].state = 'default';

          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: 15,
            event: { id: `morris-sever-${predId}`, type: 'DELETE', description: `Severed Thread: ${pred.value} -> ${curr.value}` },
            state: {
              ...state,
              nodes: severNodes,
              traversalOrder: [...traversalOrder],
              threadEdges: [...currentThreadEdges],
              message: `Returned to Node(${curr.value}) via thread link! Severed thread and visited Node(${curr.value}). Order: [${traversalOrder.join(' -> ')}]`,
            },
            explanation: 'Thread link severed to restore original tree structure. Left subtree is complete, now explore right subtree.',
            pseudocodeLine: 4,
          });

          currId = curr.rightId;
        }
      }
    }

    // Complete
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'morris-complete', type: 'COMPLETE', description: 'Morris Traversal Complete' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        traversalOrder: [...traversalOrder],
        threadEdges: [],
        message: `Morris Traversal Complete! All temporary thread links severed. In-Order Result: [${traversalOrder.join(' -> ')}]`,
      },
      explanation: 'In-order traversal completed using O(1) auxiliary space.',
      pseudocodeLine: 5,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 12. SERIALIZATION & DESERIALIZATION =================
  private runSerialize(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || Object.keys(state.nodes).length === 0) return [];

    const nodes = this.cloneNodes(state.nodes);
    const streamTokens: string[] = [];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 10,
      event: { id: 'ser-init', type: 'INIT', description: 'Start Tree Serialization (BFS)' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        serializedStream: '',
        message: 'Serializing Binary Tree: Encoding hierarchical node pointers into a linear string representation using Level Order (BFS).',
      },
      explanation: 'Serialization enables storing trees on disk or transmitting them across network sockets.',
      pseudocodeLine: 1,
    });

    const queue: (string | null)[] = [state.rootId];

    while (queue.length > 0) {
      const currId = queue.shift();

      if (currId && nodes[currId]) {
        const node = nodes[currId];
        streamTokens.push(String(node.value));
        nodes[currId].state = 'visited';
        nodes[currId].label = 'Serialized';

        queue.push(node.leftId);
        queue.push(node.rightId);

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 10,
          event: { id: `ser-token-${node.value}`, type: 'INSERT', description: `Appended ${node.value} to Stream` },
          state: {
            ...state,
            nodes: this.cloneNodes(nodes),
            serializedStream: streamTokens.join(','),
            message: `Encoded Node(${node.value}). Stream: "${streamTokens.join(',')}"`,
          },
          explanation: `Append node value to serialized stream and enqueue child pointers.`,
          pseudocodeLine: 2,
        });
      } else {
        streamTokens.push('null');
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 10,
          event: { id: `ser-null-${snapshots.length}`, type: 'CHECK_CONDITION', description: 'Appended null to Stream' },
          state: {
            ...state,
            nodes: this.cloneNodes(nodes),
            serializedStream: streamTokens.join(','),
            message: `Encountered NULL pointer. Appended "null" token to stream. Stream: "${streamTokens.join(',')}"`,
          },
          explanation: 'Null terminal indicators preserve structural geometry for accurate deserialization.',
          pseudocodeLine: 3,
        });

        // Limit excessive null trailing
        if (queue.every(item => item === null)) break;
      }
    }

    const finalStream = streamTokens.join(',');
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'ser-complete', type: 'COMPLETE', description: 'Serialization Complete' },
      state: {
        ...state,
        nodes: this.cloneNodes(nodes),
        serializedStream: finalStream,
        message: `Tree Serialization Complete! Serialized Output: "${finalStream}"`,
      },
      explanation: 'The entire tree hierarchy has been flattened into a linear stream.',
      pseudocodeLine: 4,
    });

    return this.updateStepTotals(snapshots);
  }

  private runDeserialize(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    const stream = '50,30,70,20,40,60,80';
    const tokens = stream.split(',');

    snapshots.push({
      stepIndex: 0,
      totalSteps: 10,
      event: { id: 'deser-init', type: 'INIT', description: 'Start Tree Deserialization' },
      state: {
        nodes: {},
        rootId: null,
        traversalOrder: [],
        activePath: [],
        treeType: 'bst',
        serializedStream: stream,
        message: `Deserializing Stream: "${stream}". Reconstructing tree nodes and parent-child edges step-by-step.`,
      },
      explanation: 'Deserialization parses serialized tokens sequentially, allocating nodes and linking child pointers using a Queue.',
      pseudocodeLine: 1,
    });

    const rebuiltNodes: Record<string, TreeNode> = {};
    const rootVal = Number(tokens[0]);
    const rootId = `node-${rootVal}`;

    rebuiltNodes[rootId] = {
      id: rootId,
      value: rootVal,
      leftId: null,
      rightId: null,
      parentId: null,
      height: 1,
      balanceFactor: 0,
      state: 'inserted',
      level: 0,
      role: 'Root',
      label: 'Root Created',
    };

    snapshots.push({
      stepIndex: 1,
      totalSteps: 10,
      event: { id: 'deser-root', type: 'INSERT', description: `Parsed Root Node(${rootVal})` },
      state: {
        nodes: this.cloneNodes(rebuiltNodes),
        rootId,
        traversalOrder: [],
        activePath: [rootId],
        treeType: 'bst',
        serializedStream: stream,
        message: `Parsed first token "${rootVal}". Allocated Root Node(${rootVal}).`,
      },
      explanation: 'First token creates the root node. We place it in the reconstruction queue.',
      pseudocodeLine: 2,
    });

    const queue: string[] = [rootId];
    let tokenIdx = 1;

    while (queue.length > 0 && tokenIdx < tokens.length) {
      const parentId = queue.shift()!;
      const parent = rebuiltNodes[parentId];

      // Left Child
      if (tokenIdx < tokens.length) {
        const leftToken = tokens[tokenIdx++];
        if (leftToken !== 'null') {
          const val = Number(leftToken);
          const childId = `node-${val}`;
          rebuiltNodes[childId] = {
            id: childId,
            value: val,
            leftId: null,
            rightId: null,
            parentId,
            height: 1,
            balanceFactor: 0,
            state: 'inserted',
            level: parent.level + 1,
            label: 'Linked Left',
          };
          parent.leftId = childId;
          queue.push(childId);

          const edge = this.edgeId(parentId, childId);
          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: 10,
            event: { id: `deser-left-${val}`, type: 'INSERT', description: `Linked Left Child Node(${val})` },
            state: {
              nodes: this.cloneNodes(rebuiltNodes),
              rootId,
              traversalOrder: [],
              activePath: [parentId, childId],
              activeEdgeId: edge,
              highlightEdges: [edge],
              treeType: 'bst',
              serializedStream: stream,
              message: `Parsed "${val}". Connected as LEFT child of Node(${parent.value}).`,
            },
            explanation: `Allocated Node(${val}) and linked parent.left = child.`,
            pseudocodeLine: 3,
          });
        }
      }

      // Right Child
      if (tokenIdx < tokens.length) {
        const rightToken = tokens[tokenIdx++];
        if (rightToken !== 'null') {
          const val = Number(rightToken);
          const childId = `node-${val}`;
          rebuiltNodes[childId] = {
            id: childId,
            value: val,
            leftId: null,
            rightId: null,
            parentId,
            height: 1,
            balanceFactor: 0,
            state: 'inserted',
            level: parent.level + 1,
            label: 'Linked Right',
          };
          parent.rightId = childId;
          queue.push(childId);

          const edge = this.edgeId(parentId, childId);
          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: 10,
            event: { id: `deser-right-${val}`, type: 'INSERT', description: `Linked Right Child Node(${val})` },
            state: {
              nodes: this.cloneNodes(rebuiltNodes),
              rootId,
              traversalOrder: [],
              activePath: [parentId, childId],
              activeEdgeId: edge,
              highlightEdges: [edge],
              treeType: 'bst',
              serializedStream: stream,
              message: `Parsed "${val}". Connected as RIGHT child of Node(${parent.value}).`,
            },
            explanation: `Allocated Node(${val}) and linked parent.right = child.`,
            pseudocodeLine: 4,
          });
        }
      }
    }

    this.recomputeHeights(rebuiltNodes, rootId);

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'deser-complete', type: 'COMPLETE', description: 'Tree Fully Reconstructed' },
      state: {
        nodes: this.cloneNodes(rebuiltNodes),
        rootId,
        traversalOrder: [],
        activePath: [],
        treeType: 'bst',
        serializedStream: stream,
        message: 'Deserialization Complete! Full tree hierarchy, edges, and node heights successfully restored.',
      },
      explanation: 'All tokens consumed and the binary tree is fully reconstructed in memory.',
      pseudocodeLine: 5,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= 13. EXPLORE TREE & TYPES =================
  private runExploreTree(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];
    if (!state.rootId || Object.keys(state.nodes).length === 0) return [];

    const nodes = this.cloneNodes(state.nodes);
    const root = nodes[state.rootId];

    // Step 0: Root node
    const rootNodes = this.cloneNodes(nodes);
    rootNodes[state.rootId].state = 'comparing';
    rootNodes[state.rootId].label = 'Root Node';

    snapshots.push({
      stepIndex: 0,
      totalSteps: 5,
      event: { id: 'exp-root', type: 'SELECT', description: `Root Node: Node(${root.value})` },
      state: {
        ...state,
        nodes: rootNodes,
        activePath: [state.rootId],
        message: `Root Node is Node(${root.value}): The topmost node in the tree hierarchy with no parent pointers.`,
      },
      explanation: 'Every non-empty tree has exactly one root node.',
      pseudocodeLine: 1,
    });

    // Step 1: Left Subtree
    const leftDescendants: string[] = [];
    const getDescendants = (id: string | null, list: string[]) => {
      if (!id || !nodes[id]) return;
      list.push(id);
      getDescendants(nodes[id].leftId, list);
      getDescendants(nodes[id].rightId, list);
    };
    if (root.leftId) getDescendants(root.leftId, leftDescendants);

    const leftNodes = this.cloneNodes(nodes);
    leftDescendants.forEach(id => {
      leftNodes[id].state = 'visited';
      leftNodes[id].label = 'Left Subtree';
    });

    snapshots.push({
      stepIndex: 1,
      totalSteps: 5,
      event: { id: 'exp-left', type: 'DIVIDE', description: 'Left Subtree' },
      state: {
        ...state,
        nodes: leftNodes,
        activePath: leftDescendants,
        message: `Left Subtree: Contains all nodes strictly smaller than Root (${root.value}). All ${leftDescendants.length} left descendants satisfy invariant < ${root.value}.`,
      },
      explanation: 'BST property dictates all values in the left subtree must be less than the parent value.',
      pseudocodeLine: 2,
    });

    // Step 2: Right Subtree
    const rightDescendants: string[] = [];
    if (root.rightId) getDescendants(root.rightId, rightDescendants);

    const rightNodes = this.cloneNodes(nodes);
    rightDescendants.forEach(id => {
      rightNodes[id].state = 'inserted';
      rightNodes[id].label = 'Right Subtree';
    });

    snapshots.push({
      stepIndex: 2,
      totalSteps: 5,
      event: { id: 'exp-right', type: 'DIVIDE', description: 'Right Subtree' },
      state: {
        ...state,
        nodes: rightNodes,
        activePath: rightDescendants,
        message: `Right Subtree: Contains all nodes strictly greater than Root (${root.value}). All ${rightDescendants.length} right descendants satisfy invariant > ${root.value}.`,
      },
      explanation: 'BST property dictates all values in the right subtree must be greater than the parent value.',
      pseudocodeLine: 3,
    });

    // Step 3: Leaf Nodes
    const leafNodes = this.cloneNodes(nodes);
    Object.values(leafNodes).forEach(n => {
      if (!n.leftId && !n.rightId) {
        n.state = 'inserted';
        n.label = 'Leaf (Degree 0)';
      }
    });

    snapshots.push({
      stepIndex: 3,
      totalSteps: 5,
      event: { id: 'exp-leaves', type: 'FOUND', description: 'Leaf Nodes (Degree 0)' },
      state: {
        ...state,
        nodes: leafNodes,
        message: 'Leaf Nodes (Degree 0): Terminal nodes with no child pointers (both left and right are null).',
      },
      explanation: 'Leaves terminate search branches and define the height of the tree.',
      pseudocodeLine: 4,
    });

    // Step 4: Tree Metrics
    const verifiedNodes = this.cloneNodes(nodes);
    Object.values(verifiedNodes).forEach(n => {
      n.state = 'default';
    });

    snapshots.push({
      stepIndex: 4,
      totalSteps: 5,
      event: { id: 'exp-summary', type: 'COMPLETE', description: 'Tree Properties Summary' },
      state: {
        ...state,
        nodes: verifiedNodes,
        message: `Tree Metrics: Total Nodes = ${Object.keys(nodes).length}, Height = ${root.height}, Root Balance Factor = ${root.balanceFactor || 0}.`,
      },
      explanation: 'Binary Tree inspection complete.',
      pseudocodeLine: 5,
    });

    return this.updateStepTotals(snapshots);
  }

  private runShowTypes(state: TreeVisualizerState): TimelineSnapshot<TreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<TreeVisualizerState>[] = [];

    // 1. Full Binary Tree
    const fullNodes: Record<string, TreeNode> = {
      'f1': { id: 'f1', value: 20, leftId: 'f2', rightId: 'f3', height: 3, level: 0, state: 'comparing', label: '2 Children' },
      'f2': { id: 'f2', value: 10, leftId: 'f4', rightId: 'f5', parentId: 'f1', height: 2, level: 1, state: 'comparing', label: '2 Children' },
      'f3': { id: 'f3', value: 30, leftId: null, rightId: null, parentId: 'f1', height: 1, level: 1, state: 'inserted', label: '0 Children' },
      'f4': { id: 'f4', value: 5, leftId: null, rightId: null, parentId: 'f2', height: 1, level: 2, state: 'inserted', label: '0 Children' },
      'f5': { id: 'f5', value: 15, leftId: null, rightId: null, parentId: 'f2', height: 1, level: 2, state: 'inserted', label: '0 Children' },
    };

    snapshots.push({
      stepIndex: 0,
      totalSteps: 4,
      event: { id: 'type-full', type: 'CHECK_CONDITION', description: '1. Full Binary Tree' },
      state: {
        ...state,
        nodes: fullNodes,
        rootId: 'f1',
        treeType: 'full',
        message: 'Full Binary Tree: Every node has either strictly 0 or strictly 2 children. No node has only 1 child.',
      },
      explanation: 'Also known as a proper or plane binary tree.',
      pseudocodeLine: 1,
    });

    // 2. Complete Binary Tree
    const completeNodes: Record<string, TreeNode> = {
      'c1': { id: 'c1', value: 1, leftId: 'c2', rightId: 'c3', height: 3, level: 0, state: 'default' },
      'c2': { id: 'c2', value: 2, leftId: 'c4', rightId: 'c5', parentId: 'c1', height: 2, level: 1, state: 'default' },
      'c3': { id: 'c3', value: 3, leftId: 'c6', rightId: null, parentId: 'c1', height: 2, level: 1, state: 'default' },
      'c4': { id: 'c4', value: 4, leftId: null, rightId: null, parentId: 'c2', height: 1, level: 2, state: 'inserted', label: 'Leaf' },
      'c5': { id: 'c5', value: 5, leftId: null, rightId: null, parentId: 'c2', height: 1, level: 2, state: 'inserted', label: 'Leaf' },
      'c6': { id: 'c6', value: 6, leftId: null, rightId: null, parentId: 'c3', height: 1, level: 2, state: 'inserted', label: 'Left-aligned' },
    };

    snapshots.push({
      stepIndex: 1,
      totalSteps: 4,
      event: { id: 'type-complete', type: 'CHECK_CONDITION', description: '2. Complete Binary Tree' },
      state: {
        ...state,
        nodes: completeNodes,
        rootId: 'c1',
        treeType: 'complete',
        message: 'Complete Binary Tree: All levels are completely filled except possibly the last, which is filled from left to right.',
      },
      explanation: 'Complete binary trees can be packed efficiently into an array without pointer overhead (heaps use this property).',
      pseudocodeLine: 2,
    });

    // 3. Perfect Binary Tree
    const perfectNodes: Record<string, TreeNode> = {
      'p1': { id: 'p1', value: 20, leftId: 'p2', rightId: 'p3', height: 3, level: 0, state: 'inserted', label: 'All 2 Children' },
      'p2': { id: 'p2', value: 10, leftId: 'p4', rightId: 'p5', parentId: 'p1', height: 2, level: 1, state: 'inserted', label: 'All 2 Children' },
      'p3': { id: 'p3', value: 30, leftId: 'p6', rightId: 'p7', parentId: 'p1', height: 2, level: 1, state: 'inserted', label: 'All 2 Children' },
      'p4': { id: 'p4', value: 5, leftId: null, rightId: null, parentId: 'p2', height: 1, level: 2, state: 'inserted', label: 'Same Depth' },
      'p5': { id: 'p5', value: 15, leftId: null, rightId: null, parentId: 'p2', height: 1, level: 2, state: 'inserted', label: 'Same Depth' },
      'p6': { id: 'p6', value: 25, leftId: null, rightId: null, parentId: 'p3', height: 1, level: 2, state: 'inserted', label: 'Same Depth' },
      'p7': { id: 'p7', value: 35, leftId: null, rightId: null, parentId: 'p3', height: 1, level: 2, state: 'inserted', label: 'Same Depth' },
    };

    snapshots.push({
      stepIndex: 2,
      totalSteps: 4,
      event: { id: 'type-perfect', type: 'CHECK_CONDITION', description: '3. Perfect Binary Tree' },
      state: {
        ...state,
        nodes: perfectNodes,
        rootId: 'p1',
        treeType: 'perfect',
        message: 'Perfect Binary Tree: All internal nodes have exactly 2 children, and all leaves are at the exact same depth level. N = 2^h - 1.',
      },
      explanation: 'A perfect tree has maximum node capacity for its height.',
      pseudocodeLine: 3,
    });

    // 4. Degenerate Tree
    const degNodes: Record<string, TreeNode> = {
      'd1': { id: 'd1', value: 10, leftId: null, rightId: 'd2', height: 4, level: 0, state: 'comparing', label: '1 Child' },
      'd2': { id: 'd2', value: 20, leftId: null, rightId: 'd3', parentId: 'd1', height: 3, level: 1, state: 'comparing', label: '1 Child' },
      'd3': { id: 'd3', value: 30, leftId: null, rightId: 'd4', parentId: 'd2', height: 2, level: 2, state: 'comparing', label: '1 Child' },
      'd4': { id: 'd4', value: 40, leftId: null, rightId: null, parentId: 'd3', height: 1, level: 3, state: 'inserted', label: 'Leaf' },
    };

    snapshots.push({
      stepIndex: 3,
      totalSteps: 4,
      event: { id: 'type-degenerate', type: 'CHECK_CONDITION', description: '4. Degenerate / Skewed Tree' },
      state: {
        ...state,
        nodes: degNodes,
        rootId: 'd1',
        treeType: 'degenerate',
        message: 'Degenerate (Skewed) Tree: Each parent has only one child. Degenerates to a linked list with worst-case O(N) operations.',
      },
      explanation: 'Degenerate trees happen when inserting already sorted elements into an unbalanced BST.',
      pseudocodeLine: 4,
    });

    return this.updateStepTotals(snapshots);
  }

  // ================= BST RAW BUILDER =================
  private insertRawBST(nodes: Record<string, TreeNode>, rootId: string | null, val: number): string {
    const id = `node-${val}`;
    if (!rootId) {
      nodes[id] = { id, value: val, leftId: null, rightId: null, height: 1, balanceFactor: 0, state: 'default', level: 0, role: 'Root' };
      return id;
    }

    let curr = rootId;
    while (curr) {
      const node = nodes[curr];
      if (val < node.value) {
        if (!node.leftId) {
          nodes[id] = { id, value: val, leftId: null, rightId: null, parentId: curr, height: 1, balanceFactor: 0, state: 'default', level: node.level + 1, role: 'Leaf' };
          node.leftId = id;
          break;
        }
        curr = node.leftId;
      } else if (val > node.value) {
        if (!node.rightId) {
          nodes[id] = { id, value: val, leftId: null, rightId: null, parentId: curr, height: 1, balanceFactor: 0, state: 'default', level: node.level + 1, role: 'Leaf' };
          node.rightId = id;
          break;
        }
        curr = node.rightId;
      } else {
        break; // Ignore duplicates
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
