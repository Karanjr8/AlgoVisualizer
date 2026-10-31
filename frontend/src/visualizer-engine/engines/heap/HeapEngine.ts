import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { HeapVisualizerState, TreeNode } from '../../types/ds-states';

export class HeapEngine implements IVisualizerEngine<HeapVisualizerState> {
  public meta: EngineMeta = {
    id: 'heap-engine',
    name: 'Binary Heap & Priority Queue Engine',
    dataStructure: 'heap',
    category: 'Heaps & Priority Queues',
    supportedOperations: ['insert', 'extract', 'heapify-down', 'build-heap', 'toggle-min-max'],
    defaultInput: [45, 30, 80, 10, 25, 60, 90],
  };

  public generateInitialState(input?: number[], type: 'min-heap' | 'max-heap' = 'max-heap'): HeapVisualizerState {
    const raw = Array.isArray(input) && input.length > 0 ? [...input] : [...this.meta.defaultInput];
    // Build heap in-place
    this.buildHeap(raw, type);

    const treeNodes = this.arrayToHeapTree(raw);
    const rootId = raw.length > 0 ? 'node-0' : null;

    return {
      type,
      arrayValues: raw,
      treeNodes,
      rootId,
      message: `${type.toUpperCase()} initialized with ${raw.length} elements. Root is ${raw[0] ?? 'empty'}.`,
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: HeapVisualizerState
  ): TimelineSnapshot<HeapVisualizerState>[] {
    switch (operation) {
      case 'insert':
        return this.runInsert(currentState, Number(params.value ?? 95));
      case 'extract':
        return this.runExtract(currentState);
      case 'build-heap':
        return this.runBuildHeap(currentState, params.values);
      case 'toggle-min-max':
        const nextType = currentState.type === 'max-heap' ? 'min-heap' : 'max-heap';
        return [
          {
            stepIndex: 0,
            totalSteps: 1,
            event: { id: 'toggle', type: 'TOGGLE_HEAP_TYPE', description: `Switched to ${nextType}` },
            state: this.generateInitialState(currentState.arrayValues, nextType),
            explanation: `Rebuilt heap adhering to ${nextType} invariant.`,
            pseudocodeLine: 1,
          },
        ];
      default:
        return this.runExtract(currentState);
    }
  }

  // ================= INSERT =================
  private runInsert(state: HeapVisualizerState, val: number): TimelineSnapshot<HeapVisualizerState>[] {
    const snapshots: TimelineSnapshot<HeapVisualizerState>[] = [];
    const arr = [...state.arrayValues, val];
    const isMax = state.type === 'max-heap';

    // Step 1: Append at end of array / tree leaf
    let currentIdx = arr.length - 1;
    let treeNodes = this.arrayToHeapTree(arr);
    treeNodes[`node-${currentIdx}`].state = 'inserted';

    snapshots.push({
      stepIndex: 0,
      totalSteps: 5,
      event: { id: 'append-leaf', type: 'APPEND_LEAF', description: `Appended ${val} at index ${currentIdx}` },
      state: {
        ...state,
        arrayValues: [...arr],
        treeNodes,
        message: `Appended ${val} at the next complete tree position (index ${currentIdx}). Initiating sift-up...`,
      },
      explanation: 'Complete binary tree property: new element is placed at leftmost available leaf.',
      pseudocodeLine: 1,
    });

    // Step 2: Sift up / Bubble up
    while (currentIdx > 0) {
      const parentIdx = Math.floor((currentIdx - 1) / 2);
      const parentVal = arr[parentIdx];
      const currVal = arr[currentIdx];

      const violates = isMax ? currVal > parentVal : currVal < parentVal;

      treeNodes = this.arrayToHeapTree(arr);
      treeNodes[`node-${currentIdx}`].state = 'comparing';
      treeNodes[`node-${parentIdx}`].state = 'comparing';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 5,
        event: { id: `cmp-${currentIdx}`, type: 'COMPARE_PARENT', description: `Compare ${currVal} with parent ${parentVal}` },
        state: {
          ...state,
          arrayValues: [...arr],
          treeNodes,
          heapifyActivePair: [currentIdx, parentIdx],
          message: `Compare child arr[${currentIdx}] (${currVal}) with parent arr[${parentIdx}] (${parentVal}). ${violates ? 'Violates heap property -> SWAP!' : 'Heap invariant satisfied.'}`,
        },
        explanation: `Index math: parent = floor((${currentIdx} - 1) / 2) = ${parentIdx}. Verify ${isMax ? 'child <= parent' : 'child >= parent'}.`,
        pseudocodeLine: 2,
      });

      if (!violates) break;

      // Swap
      arr[currentIdx] = parentVal;
      arr[parentIdx] = currVal;

      treeNodes = this.arrayToHeapTree(arr);
      treeNodes[`node-${parentIdx}`].state = 'inserted';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 5,
        event: { id: `swap-${currentIdx}`, type: 'SWAP', description: `Swapped child and parent` },
        state: {
          ...state,
          arrayValues: [...arr],
          treeNodes,
          heapifyActivePair: [parentIdx, currentIdx],
          message: `Swapped ${currVal} up to index ${parentIdx}.`,
        },
        explanation: `Swap child with parent to restore heap order.`,
        pseudocodeLine: 3,
      });

      currentIdx = parentIdx;
    }

    treeNodes = this.arrayToHeapTree(arr);
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'insert-done', type: 'HEAP_INSERT_DONE', description: `Insertion complete in O(log N)` },
      state: {
        ...state,
        arrayValues: arr,
        treeNodes,
        heapifyActivePair: undefined,
        message: `Insertion of ${val} complete. ${state.type.toUpperCase()} property restored in O(log N) time.`,
      },
      explanation: 'Sift-up completed in at most O(h) = O(log N) swaps.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  // ================= EXTRACT MIN/MAX =================
  private runExtract(state: HeapVisualizerState): TimelineSnapshot<HeapVisualizerState>[] {
    const snapshots: TimelineSnapshot<HeapVisualizerState>[] = [];
    if (state.arrayValues.length === 0) {
      return [
        {
          stepIndex: 0,
          totalSteps: 1,
          event: { id: 'empty', type: 'EXTRACT_EMPTY', description: 'Heap is empty' },
          state: { ...state, message: 'Heap is empty! Nothing to extract.' },
          explanation: 'Cannot extract from an empty heap.',
          pseudocodeLine: 1,
        },
      ];
    }

    const arr = [...state.arrayValues];
    const extractedVal = arr[0];
    const isMax = state.type === 'max-heap';

    // Step 1: Highlight root
    let treeNodes = this.arrayToHeapTree(arr);
    treeNodes['node-0'].state = 'deleted';

    snapshots.push({
      stepIndex: 0,
      totalSteps: 6,
      event: { id: 'ext-root', type: 'EXTRACT_ROOT', description: `Extract root value ${extractedVal}` },
      state: {
        ...state,
        treeNodes,
        extractedValue: extractedVal,
        message: `Extracting ${isMax ? 'MAXIMUM' : 'MINIMUM'} value (${extractedVal}) from ROOT.`,
      },
      explanation: 'Root always contains the extreme value in a heap.',
      pseudocodeLine: 1,
    });

    if (arr.length === 1) {
      snapshots.push({
        stepIndex: 1,
        totalSteps: 2,
        event: { id: 'single-ext', type: 'EXTRACT_DONE', description: 'Single element extracted' },
        state: { ...state, arrayValues: [], treeNodes: {}, rootId: null, extractedValue: extractedVal, message: 'Extracted last element. Heap is now empty.' },
        explanation: 'Heap empty.',
        pseudocodeLine: 2,
      });
      return snapshots;
    }

    // Step 2: Move last leaf to root
    const lastLeafVal = arr.pop()!;
    arr[0] = lastLeafVal;

    treeNodes = this.arrayToHeapTree(arr);
    treeNodes['node-0'].state = 'inserted';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 6,
      event: { id: 'move-leaf', type: 'MOVE_LAST_LEAF', description: `Moved leaf ${lastLeafVal} to ROOT` },
      state: {
        ...state,
        arrayValues: [...arr],
        treeNodes,
        extractedValue: extractedVal,
        message: `Moved last leaf (${lastLeafVal}) to ROOT position. Initiating sift-down...`,
      },
      explanation: 'Maintain complete tree shape by temporarily replacing root with the last leaf.',
      pseudocodeLine: 2,
    });

    // Step 3: Sift down (Heapify)
    let curr = 0;
    const n = arr.length;

    while (curr < n) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let target = curr;

      if (left < n) {
        if (isMax ? arr[left] > arr[target] : arr[left] < arr[target]) {
          target = left;
        }
      }
      if (right < n) {
        if (isMax ? arr[right] > arr[target] : arr[right] < arr[target]) {
          target = right;
        }
      }

      if (target === curr) break;

      const swapVal = arr[target];
      const currVal = arr[curr];

      treeNodes = this.arrayToHeapTree(arr);
      treeNodes[`node-${curr}`].state = 'comparing';
      treeNodes[`node-${target}`].state = 'comparing';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 6,
        event: { id: `heapify-${curr}`, type: 'HEAPIFY_COMPARE', description: `Compare with children` },
        state: {
          ...state,
          arrayValues: [...arr],
          treeNodes,
          heapifyActivePair: [curr, target],
          message: `Compare parent (${currVal}) with ${target === left ? 'LEFT' : 'RIGHT'} child (${swapVal}). Violates heap property.`,
        },
        explanation: `Identify child with ${isMax ? 'greater' : 'smaller'} value. Swap down to maintain heap property.`,
        pseudocodeLine: 3,
      });

      // Perform swap
      arr[curr] = swapVal;
      arr[target] = currVal;

      curr = target;
    }

    treeNodes = this.arrayToHeapTree(arr);
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'ext-done', type: 'EXTRACT_DONE', description: `Extraction complete. Extracted: ${extractedVal}` },
      state: {
        ...state,
        arrayValues: arr,
        treeNodes,
        heapifyActivePair: undefined,
        extractedValue: extractedVal,
        message: `Extraction complete! Returned ${extractedVal}. ${state.type.toUpperCase()} invariant restored.`,
      },
      explanation: 'Sift-down runs in O(log N) depth iterations.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  private runBuildHeap(state: HeapVisualizerState, customVals?: number[]): TimelineSnapshot<HeapVisualizerState>[] {
    const arr = customVals || [14, 8, 3, 20, 15, 6, 9];
    const fresh = this.generateInitialState(arr, state.type);
    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'build-done', type: 'BUILD_HEAP', description: 'Built heap using Floyd algorithm in O(N)' },
        state: fresh,
        explanation: 'Building heap from bottom-up internal nodes runs in linear O(N) time.',
        pseudocodeLine: 1,
      },
    ];
  }

  private buildHeap(arr: number[], type: 'min-heap' | 'max-heap'): void {
    const isMax = type === 'max-heap';
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapifyDownSync(arr, n, i, isMax);
    }
  }

  private heapifyDownSync(arr: number[], n: number, i: number, isMax: boolean): void {
    let target = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && (isMax ? arr[left] > arr[target] : arr[left] < arr[target])) {
      target = left;
    }
    if (right < n && (isMax ? arr[right] > arr[target] : arr[right] < arr[target])) {
      target = right;
    }

    if (target !== i) {
      const temp = arr[i];
      arr[i] = arr[target];
      arr[target] = temp;
      this.heapifyDownSync(arr, n, target, isMax);
    }
  }

  private arrayToHeapTree(arr: number[]): Record<string, TreeNode> {
    const nodes: Record<string, TreeNode> = {};
    arr.forEach((val, i) => {
      const leftIdx = 2 * i + 1;
      const rightIdx = 2 * i + 2;
      const parentIdx = i > 0 ? Math.floor((i - 1) / 2) : undefined;
      const level = Math.floor(Math.log2(i + 1));

      nodes[`node-${i}`] = {
        id: `node-${i}`,
        value: val,
        leftId: leftIdx < arr.length ? `node-${leftIdx}` : null,
        rightId: rightIdx < arr.length ? `node-${rightIdx}` : null,
        parentId: parentIdx !== undefined ? `node-${parentIdx}` : undefined,
        height: 1,
        level,
        state: 'default',
      };
    });
    return nodes;
  }
}
