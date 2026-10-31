import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { LinkedListVisualizerState, LinkedListNode, LinkedListKind } from '../../types/ds-states';

export class LinkedListEngine implements IVisualizerEngine<LinkedListVisualizerState> {
  public meta: EngineMeta = {
    id: 'linked-list-engine',
    name: 'Linked List Visualization Engine',
    dataStructure: 'linked-list',
    category: 'Linked Lists',
    supportedOperations: [
      'traverse',
      'insert-head',
      'insert-tail',
      'insert-at',
      'delete-head',
      'delete-tail',
      'delete-at',
      'search',
      'reverse',
      'slow-fast-pointers',
    ],
    defaultInput: [12, 99, 37, 45, 8],
  };

  public generateInitialState(input?: number[], kind: LinkedListKind = 'singly'): LinkedListVisualizerState {
    const rawValues = Array.isArray(input) && input.length > 0 ? input : this.meta.defaultInput;
    const nodes: LinkedListNode[] = [];

    rawValues.forEach((val: number, i: number) => {
      const id = `node-${i + 1}`;
      const nextId = i < rawValues.length - 1 ? `node-${i + 2}` : kind === 'circular' ? `node-1` : null;
      const prevId = kind === 'doubly' ? (i > 0 ? `node-${i}` : null) : undefined;

      const pointers: string[] = [];
      if (i === 0) pointers.push('HEAD');
      if (i === rawValues.length - 1) pointers.push('TAIL');

      nodes.push({
        id,
        value: val,
        nextId,
        prevId,
        state: 'default',
        pointers: pointers.length > 0 ? pointers : undefined,
      });
    });

    return {
      kind,
      nodes,
      headId: nodes.length > 0 ? nodes[0].id : null,
      tailId: nodes.length > 0 ? nodes[nodes.length - 1].id : null,
      length: nodes.length,
      message: `${kind.toUpperCase()} Linked List initialized with ${nodes.length} nodes.`,
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: LinkedListVisualizerState
  ): TimelineSnapshot<LinkedListVisualizerState>[] {
    switch (operation) {
      case 'traverse':
        return this.runTraversal(currentState);
      case 'insert-head':
        return this.runInsertHead(currentState, Number(params.value ?? 50));
      case 'insert-tail':
        return this.runInsertTail(currentState, Number(params.value ?? 88));
      case 'insert-at':
        return this.runInsertAt(currentState, Number(params.index ?? 2), Number(params.value ?? 77));
      case 'delete-head':
        return this.runDeleteHead(currentState);
      case 'delete-tail':
        return this.runDeleteTail(currentState);
      case 'delete-at':
        return this.runDeleteAt(currentState, Number(params.index ?? 1));
      case 'search':
        return this.runSearch(currentState, Number(params.target ?? 37));
      case 'reverse':
        return this.runReverse(currentState);
      case 'slow-fast-pointers':
        return this.runSlowFastPointers(currentState);
      default:
        return this.runTraversal(currentState);
    }
  }

  private runTraversal(state: LinkedListVisualizerState): TimelineSnapshot<LinkedListVisualizerState>[] {
    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    const nodes = [...state.nodes];

    snapshots.push({
      stepIndex: 0,
      totalSteps: nodes.length + 1,
      event: { id: 'trav-start', type: 'TRAVERSE_START', description: 'Start Linked List Traversal' },
      state: { ...state, message: 'Initialize current pointer at HEAD node.' },
      explanation: 'Linked list traversal starts at HEAD and follows node.next references sequentially.',
      pseudocodeLine: 1,
    });

    let currId = state.headId;
    let stepCount = 0;

    while (currId && stepCount < nodes.length) {
      const activeId = currId;
      const targetNode = nodes.find((n) => n.id === activeId);
      if (!targetNode) break;

      const updatedNodes = nodes.map((n) => ({
        ...n,
        state: n.id === activeId ? ('active' as const) : ('default' as const),
        pointers: n.id === activeId ? ['curr'] : n.id === state.headId ? ['HEAD'] : undefined,
      }));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: nodes.length + 1,
        event: { id: `visit-${activeId}`, type: 'VISIT_NODE', description: `Visited Node(${targetNode.value})` },
        state: { ...state, nodes: updatedNodes, message: `Visiting node with value ${targetNode.value}. Pointer = curr.` },
        explanation: `Node data accessed. Advance curr = curr.next.`,
        pseudocodeLine: 2,
      });

      currId = targetNode.nextId;
      stepCount++;
      if (state.kind === 'circular' && currId === state.headId) break;
    }

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'trav-end', type: 'TRAVERSE_END', description: 'Traversal Reached End (NULL / Cycle)' },
      state: {
        ...state,
        nodes: nodes.map((n) => ({ ...n, state: 'visited' as const })),
        message: 'Reached NULL terminator. Traversal complete.',
      },
      explanation: 'curr == NULL signals the end of a singly linked list in O(N) time.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runInsertHead(state: LinkedListVisualizerState, value: number): TimelineSnapshot<LinkedListVisualizerState>[] {
    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    const newNodeId = `node-new-${Date.now()}`;
    const newNode: LinkedListNode = {
      id: newNodeId,
      value,
      nextId: null,
      prevId: state.kind === 'doubly' ? null : undefined,
      state: 'new',
      pointers: ['NEW'],
    };

    // Step 1: Allocate new node
    snapshots.push({
      stepIndex: 0,
      totalSteps: 3,
      event: { id: 'alloc-node', type: 'ALLOC_NODE', description: `Allocated Node(${value})` },
      state: {
        ...state,
        nodes: [newNode, ...state.nodes],
        message: `Created new node with value ${value} in memory.`,
      },
      explanation: 'Allocate memory for new node with data = val and next = null.',
      pseudocodeLine: 1,
    });

    // Step 2: Point new node's next to current HEAD
    const oldHeadId = state.headId;
    newNode.nextId = oldHeadId;
    if (state.kind === 'doubly' && oldHeadId) {
      const oldHead = state.nodes.find((n) => n.id === oldHeadId);
      if (oldHead) oldHead.prevId = newNodeId;
    }

    snapshots.push({
      stepIndex: 1,
      totalSteps: 3,
      event: { id: 'link-next', type: 'LINK_NEXT', description: `Linked newNode.next -> HEAD (${oldHeadId})` },
      state: {
        ...state,
        nodes: [newNode, ...state.nodes],
        message: `Set newNode.next = HEAD. Pointing new node to previous head.`,
      },
      explanation: 'Connect new node to the existing chain before moving the head pointer.',
      pseudocodeLine: 2,
    });

    // Step 3: Move HEAD to new node
    const finalNodes = [newNode, ...state.nodes].map((n) => ({
      ...n,
      state: n.id === newNodeId ? ('highlight' as const) : ('default' as const),
      pointers: n.id === newNodeId ? ['HEAD'] : n.id === state.tailId ? ['TAIL'] : undefined,
    }));

    snapshots.push({
      stepIndex: 2,
      totalSteps: 3,
      event: { id: 'update-head', type: 'UPDATE_HEAD', description: 'Updated HEAD pointer to newNode' },
      state: {
        ...state,
        nodes: finalNodes,
        headId: newNodeId,
        length: finalNodes.length,
        message: `HEAD pointer successfully updated to Node(${value}). Operation O(1).`,
      },
      explanation: 'HEAD = newNode. Insertion at beginning runs in constant O(1) time.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runInsertTail(state: LinkedListVisualizerState, value: number): TimelineSnapshot<LinkedListVisualizerState>[] {
    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    const newNodeId = `node-tail-${Date.now()}`;
    const oldTailId = state.tailId;

    const newNode: LinkedListNode = {
      id: newNodeId,
      value,
      nextId: state.kind === 'circular' ? state.headId : null,
      prevId: state.kind === 'doubly' ? oldTailId : undefined,
      state: 'new',
      pointers: ['NEW'],
    };

    snapshots.push({
      stepIndex: 0,
      totalSteps: 3,
      event: { id: 'alloc-tail', type: 'ALLOC_NODE', description: `Allocated tail Node(${value})` },
      state: { ...state, message: `Created new node with value ${value}.` },
      explanation: 'Create new node to be appended at the end of the linked list.',
      pseudocodeLine: 1,
    });

    // Link old tail's next to new node
    const linkedNodes = state.nodes.map((n) => {
      if (n.id === oldTailId) {
        return { ...n, nextId: newNodeId, state: 'active' as const };
      }
      return n;
    });

    snapshots.push({
      stepIndex: 1,
      totalSteps: 3,
      event: { id: 'link-tail', type: 'LINK_NEXT', description: `Linked TAIL.next -> newNode` },
      state: {
        ...state,
        nodes: [...linkedNodes, newNode],
        message: `Connected previous TAIL (${oldTailId}) to Node(${value}).`,
      },
      explanation: 'tail.next = newNode connects the chain to the new end node.',
      pseudocodeLine: 2,
    });

    // Update tail pointer
    const finalNodes = [...linkedNodes, newNode].map((n) => ({
      ...n,
      state: n.id === newNodeId ? ('highlight' as const) : ('default' as const),
      pointers: n.id === newNodeId ? ['TAIL'] : n.id === state.headId ? ['HEAD'] : undefined,
    }));

    snapshots.push({
      stepIndex: 2,
      totalSteps: 3,
      event: { id: 'update-tail', type: 'UPDATE_TAIL', description: 'Updated TAIL pointer' },
      state: {
        ...state,
        nodes: finalNodes,
        tailId: newNodeId,
        length: finalNodes.length,
        message: `TAIL updated. Node(${value}) is now the last node. O(1) with tail pointer.`,
      },
      explanation: 'tail = newNode completes append operation.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runInsertAt(state: LinkedListVisualizerState, index: number, value: number): TimelineSnapshot<LinkedListVisualizerState>[] {
    if (index <= 0 || state.nodes.length === 0) return this.runInsertHead(state, value);
    if (index >= state.nodes.length) return this.runInsertTail(state, value);

    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    const prevNode = state.nodes[index - 1];
    const nextNode = state.nodes[index];
    const newNodeId = `node-mid-${Date.now()}`;

    snapshots.push({
      stepIndex: 0,
      totalSteps: 4,
      event: { id: 'traverse-insert', type: 'TRAVERSE', description: `Traversing to position ${index}` },
      state: {
        ...state,
        nodes: state.nodes.map((n, i) => ({ ...n, state: i === index - 1 ? 'active' : 'default' })),
        message: `Located previous node at index ${index - 1} (value ${prevNode.value}).`,
      },
      explanation: `Step through list up to index ${index - 1} to find insertion point.`,
      pseudocodeLine: 1,
    });

    const newNode: LinkedListNode = {
      id: newNodeId,
      value,
      nextId: nextNode.id,
      prevId: state.kind === 'doubly' ? prevNode.id : undefined,
      state: 'new',
      pointers: ['NEW'],
    };

    snapshots.push({
      stepIndex: 1,
      totalSteps: 4,
      event: { id: 'point-new', type: 'POINT_NEW', description: `Set newNode.next -> Node(${nextNode.value})` },
      state: {
        ...state,
        nodes: [...state.nodes.slice(0, index), newNode, ...state.nodes.slice(index)],
        message: `Set newNode.next = prev.next (Node ${nextNode.value}).`,
      },
      explanation: 'Always point the new node to the successor before breaking predecessor link to prevent memory loss.',
      pseudocodeLine: 2,
    });

    // Point prev to new node
    const updated = state.nodes.map((n) => {
      if (n.id === prevNode.id) return { ...n, nextId: newNodeId };
      return n;
    });

    const finalNodes = [...updated.slice(0, index), newNode, ...updated.slice(index)].map((n) => ({
      ...n,
      state: n.id === newNodeId ? ('highlight' as const) : ('default' as const),
    }));

    snapshots.push({
      stepIndex: 2,
      totalSteps: 4,
      event: { id: 'link-prev', type: 'LINK_PREV', description: `Set prevNode.next -> newNode` },
      state: {
        ...state,
        nodes: finalNodes,
        length: finalNodes.length,
        message: `Inserted Node(${value}) at index ${index} successfully!`,
      },
      explanation: 'prev.next = newNode links predecessor to new node. Operation complete.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runDeleteHead(state: LinkedListVisualizerState): TimelineSnapshot<LinkedListVisualizerState>[] {
    if (state.nodes.length <= 1) {
      return [
        {
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'clear', type: 'CLEAR', description: 'Removed single node' },
          state: { ...state, nodes: [], headId: null, tailId: null, length: 0, message: 'List is now empty.' },
          explanation: 'HEAD deleted. List length is 0.',
          pseudocodeLine: 1,
        },
      ];
    }

    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    const oldHead = state.nodes[0];
    const newHead = state.nodes[1];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 2,
      event: { id: 'del-head-select', type: 'SELECT_DEL', description: `Mark HEAD (${oldHead.value}) for deletion` },
      state: {
        ...state,
        nodes: state.nodes.map((n, i) => ({ ...n, state: i === 0 ? 'deleting' : 'default' })),
        message: `Marking current HEAD (Node ${oldHead.value}) for removal.`,
      },
      explanation: 'Save temp = HEAD so it can be deallocated.',
      pseudocodeLine: 1,
    });

    const remaining = state.nodes.slice(1).map((n, i) => ({
      ...n,
      state: i === 0 ? ('highlight' as const) : ('default' as const),
      pointers: i === 0 ? ['HEAD'] : n.id === state.tailId ? ['TAIL'] : undefined,
    }));

    snapshots.push({
      stepIndex: 1,
      totalSteps: 2,
      event: { id: 'del-head-done', type: 'UPDATE_HEAD', description: `HEAD moved to Node(${newHead.value})` },
      state: {
        ...state,
        nodes: remaining,
        headId: newHead.id,
        length: remaining.length,
        message: `HEAD updated to Node(${newHead.value}). Node(${oldHead.value}) removed in O(1) time.`,
      },
      explanation: 'HEAD = HEAD.next advances head pointer.',
      pseudocodeLine: 2,
    });

    return snapshots;
  }

  private runDeleteTail(state: LinkedListVisualizerState): TimelineSnapshot<LinkedListVisualizerState>[] {
    if (state.nodes.length <= 1) return this.runDeleteHead(state);

    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    const newTail = state.nodes[state.nodes.length - 2];
    const oldTail = state.nodes[state.nodes.length - 1];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 2,
      event: { id: 'del-tail-find', type: 'FIND_SECOND_LAST', description: 'Found second-to-last node' },
      state: {
        ...state,
        nodes: state.nodes.map((n, i) => ({
          ...n,
          state: i === state.nodes.length - 2 ? 'active' : i === state.nodes.length - 1 ? 'deleting' : 'default',
        })),
        message: `Traversed to second-last node (${newTail.value}). Preparing to remove TAIL (${oldTail.value}).`,
      },
      explanation: 'In singly linked list, deleting tail requires traversing to node right before tail: O(N).',
      pseudocodeLine: 1,
    });

    const remaining = state.nodes.slice(0, -1).map((n, i) => {
      const isNewTail = i === state.nodes.length - 2;
      return {
        ...n,
        nextId: isNewTail ? (state.kind === 'circular' ? state.headId : null) : n.nextId,
        state: isNewTail ? ('highlight' as const) : ('default' as const),
        pointers: isNewTail ? ['TAIL'] : n.id === state.headId ? ['HEAD'] : undefined,
      };
    });

    snapshots.push({
      stepIndex: 1,
      totalSteps: 2,
      event: { id: 'del-tail-done', type: 'UPDATE_TAIL', description: `TAIL updated to Node(${newTail.value})` },
      state: {
        ...state,
        nodes: remaining,
        tailId: newTail.id,
        length: remaining.length,
        message: `Removed tail. New TAIL is Node(${newTail.value}).`,
      },
      explanation: 'secondLast.next = NULL. Node deallocated.',
      pseudocodeLine: 2,
    });

    return snapshots;
  }

  private runDeleteAt(state: LinkedListVisualizerState, index: number): TimelineSnapshot<LinkedListVisualizerState>[] {
    if (index <= 0) return this.runDeleteHead(state);
    if (index >= state.nodes.length - 1) return this.runDeleteTail(state);

    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    const prevNode = state.nodes[index - 1];
    const targetNode = state.nodes[index];
    const nextNode = state.nodes[index + 1];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 2,
      event: { id: 'del-at-locate', type: 'LOCATE', description: `Located target node at index ${index}` },
      state: {
        ...state,
        nodes: state.nodes.map((n, i) => ({
          ...n,
          state: i === index ? 'deleting' : i === index - 1 ? 'active' : 'default',
        })),
        message: `Located node to delete: Node(${targetNode.value}) between Node(${prevNode.value}) and Node(${nextNode.value}).`,
      },
      explanation: 'Traverse to index - 1. Hold reference to node being deleted.',
      pseudocodeLine: 1,
    });

    // Bypass target node
    const updated = state.nodes
      .filter((n) => n.id !== targetNode.id)
      .map((n) => {
        if (n.id === prevNode.id) return { ...n, nextId: nextNode.id, state: 'highlight' as const };
        return { ...n, state: 'default' as const };
      });

    snapshots.push({
      stepIndex: 1,
      totalSteps: 2,
      event: { id: 'del-at-bypass', type: 'BYPASS_LINK', description: `prev.next = target.next` },
      state: {
        ...state,
        nodes: updated,
        length: updated.length,
        message: `Bypassed Node(${targetNode.value}). Linked Node(${prevNode.value}) directly to Node(${nextNode.value}).`,
      },
      explanation: 'prev.next = target.next removes node from chain.',
      pseudocodeLine: 2,
    });

    return snapshots;
  }

  private runSearch(state: LinkedListVisualizerState, target: number): TimelineSnapshot<LinkedListVisualizerState>[] {
    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    let found = false;

    snapshots.push({
      stepIndex: 0,
      totalSteps: state.nodes.length + 1,
      event: { id: 'search-start', type: 'INIT', description: `Search for value ${target}` },
      state: { ...state, message: `Searching linked list for target = ${target}...` },
      explanation: 'Begin linear scan from HEAD.',
      pseudocodeLine: 1,
    });

    for (let i = 0; i < state.nodes.length; i++) {
      const node = state.nodes[i];
      const isMatch = Number(node.value) === target;

      const nodes = state.nodes.map((n, idx) => ({
        ...n,
        state: idx === i ? (isMatch ? ('highlight' as const) : ('active' as const)) : idx < i ? ('visited' as const) : ('default' as const),
        pointers: idx === i ? ['curr'] : undefined,
      }));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: state.nodes.length + 1,
        event: { id: `cmp-${node.id}`, type: 'COMPARE', description: `Checking Node(${node.value}) == ${target}` },
        state: {
          ...state,
          nodes,
          message: isMatch ? `Found target value ${target} at node index ${i}!` : `Node(${node.value}) != ${target}. Advancing...`,
        },
        explanation: isMatch ? `Match located! Return pointer to node.` : `Compare curr.val with target. Move curr = curr.next.`,
        pseudocodeLine: isMatch ? 3 : 2,
      });

      if (isMatch) {
        found = true;
        break;
      }
    }

    if (!found) {
      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: snapshots.length + 1,
        event: { id: 'search-fail', type: 'NOT_FOUND', description: `Target ${target} not found` },
        state: { ...state, message: `Target ${target} does not exist in the linked list.` },
        explanation: 'Reached NULL. Target not found.',
        pseudocodeLine: 4,
      });
    }

    return snapshots;
  }

  private runReverse(state: LinkedListVisualizerState): TimelineSnapshot<LinkedListVisualizerState>[] {
    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    let prev: string | null = null;
    let curr = state.headId;
    let next: string | null = null;

    snapshots.push({
      stepIndex: 0,
      totalSteps: state.nodes.length + 2,
      event: { id: 'rev-init', type: 'INIT_REVERSE', description: 'Start 3-pointer list reversal' },
      state: { ...state, message: 'Initialize prev = NULL, curr = HEAD.' },
      explanation: 'Iterative in-place reversal maintains 3 pointers: prev, curr, next.',
      pseudocodeLine: 1,
    });

    let currentNodes = state.nodes.map((n) => ({ ...n }));

    while (curr) {
      const currNode = currentNodes.find((n) => n.id === curr);
      if (!currNode) break;

      next = currNode.nextId;

      // Reverse pointer
      currNode.nextId = prev;

      currentNodes = currentNodes.map((n) => {
        const pointers: string[] = [];
        if (n.id === prev) pointers.push('prev');
        if (n.id === curr) pointers.push('curr');
        if (n.id === next) pointers.push('next');

        return {
          ...n,
          state: n.id === curr ? ('highlight' as const) : n.id === prev ? ('active' as const) : ('default' as const),
          pointers: pointers.length > 0 ? pointers : undefined,
        };
      });

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: state.nodes.length + 2,
        event: { id: `rev-${curr}`, type: 'REVERSE_LINK', description: `Reversed pointer of Node(${currNode.value})` },
        state: {
          ...state,
          nodes: [...currentNodes],
          message: `Reversed link: Node(${currNode.value}).next = ${prev ? `Node(${prev})` : 'NULL'}.`,
        },
        explanation: 'next = curr.next; curr.next = prev; prev = curr; curr = next;',
        pseudocodeLine: 3,
      });

      prev = curr;
      curr = next;
    }

    // Update head and tail
    const reversedNodes = [...currentNodes].reverse().map((n, i) => ({
      ...n,
      state: 'default' as const,
      pointers: i === 0 ? ['HEAD'] : i === currentNodes.length - 1 ? ['TAIL'] : undefined,
    }));

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'rev-done', type: 'REVERSE_DONE', description: 'List reversal complete' },
      state: {
        ...state,
        nodes: reversedNodes,
        headId: prev,
        tailId: state.headId,
        message: 'Reversal complete! HEAD and TAIL pointers swapped in O(N) time and O(1) space.',
      },
      explanation: 'HEAD = prev. All next pointers reversed.',
      pseudocodeLine: 5,
    });

    return snapshots;
  }

  private runSlowFastPointers(state: LinkedListVisualizerState): TimelineSnapshot<LinkedListVisualizerState>[] {
    const snapshots: TimelineSnapshot<LinkedListVisualizerState>[] = [];
    const nodes = state.nodes;
    let slowIdx = 0;
    let fastIdx = 0;

    snapshots.push({
      stepIndex: 0,
      totalSteps: Math.ceil(nodes.length / 2) + 2,
      event: { id: 'sf-init', type: 'INIT', description: 'Initialize Slow & Fast pointers at HEAD' },
      state: {
        ...state,
        nodes: nodes.map((n, i) => ({
          ...n,
          state: i === 0 ? 'active' : 'default',
          pointers: i === 0 ? ['slow', 'fast'] : undefined,
        })),
        message: 'Floyd Pointer Algorithm: slow moves 1 step, fast moves 2 steps.',
      },
      explanation: 'Slow moves 1 step per turn, fast moves 2 steps per turn. When fast reaches end, slow is at the middle node.',
      pseudocodeLine: 1,
    });

    while (fastIdx < nodes.length - 1 && fastIdx + 1 < nodes.length) {
      slowIdx += 1;
      fastIdx += 2;
      if (fastIdx >= nodes.length) fastIdx = nodes.length - 1;

      const updated = nodes.map((n, i) => {
        const pointers: string[] = [];
        if (i === slowIdx) pointers.push('SLOW (1x)');
        if (i === fastIdx) pointers.push('FAST (2x)');

        return {
          ...n,
          state: i === slowIdx ? ('highlight' as const) : i === fastIdx ? ('active' as const) : ('default' as const),
          pointers: pointers.length > 0 ? pointers : undefined,
        };
      });

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: Math.ceil(nodes.length / 2) + 2,
        event: { id: `sf-step-${slowIdx}`, type: 'STEP_POINTERS', description: `Slow at ${slowIdx}, Fast at ${fastIdx}` },
        state: {
          ...state,
          nodes: updated,
          slowPointerId: nodes[slowIdx].id,
          fastPointerId: nodes[fastIdx].id,
          message: `Slow moved to Node(${nodes[slowIdx].value}). Fast moved to Node(${nodes[fastIdx].value}).`,
        },
        explanation: 'slow = slow.next; fast = fast.next.next;',
        pseudocodeLine: 2,
      });
    }

    const midNode = nodes[slowIdx];
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'sf-found', type: 'MIDDLE_FOUND', description: `Middle node is Node(${midNode.value})` },
      state: {
        ...state,
        nodes: nodes.map((n, i) => ({
          ...n,
          state: i === slowIdx ? ('highlight' as const) : ('default' as const),
          pointers: i === slowIdx ? ['MIDDLE NODE'] : undefined,
        })),
        message: `Fast reached end! Middle node identified: Node(${midNode.value}) at index ${slowIdx}.`,
      },
      explanation: 'Middle node identified in single pass O(N) time and O(1) space.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }
}
