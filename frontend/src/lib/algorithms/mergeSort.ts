import type { VisualElement, VisualizationFrame, MergeSortState, MergeTreeNode, CallStackFrame } from '../../types/visualizer';

export function mergeSort(initialArray: VisualElement[]): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  if (!initialArray || initialArray.length === 0) return frames;

  const elements: VisualElement[] = initialArray.map((el, idx) => ({
    ...el,
    state: 'normal',
    label: `idx:${idx}`
  }));

  const n = elements.length;
  let callIdCounter = 0;
  let stack: CallStackFrame[] = [];

  // Helper to construct initial recursive tree nodes layout
  const buildTreeNodes = (l: number, r: number, depth: number, parentId?: string): MergeTreeNode[] => {
    const id = `node-${l}-${r}-${depth}`;
    const nodeElements = elements.slice(l, r + 1).map(el => ({ ...el }));
    const node: MergeTreeNode = {
      id,
      label: `[${l}..${r}]`,
      range: [l, r],
      elements: nodeElements,
      depth,
      status: 'waiting',
      parentId
    };

    if (l === r) {
      return [node];
    }

    const mid = Math.floor(l + (r - l) / 2);
    const leftNodes = buildTreeNodes(l, mid, depth + 1, id);
    const rightNodes = buildTreeNodes(mid + 1, r, depth + 1, id);

    return [node, ...leftNodes, ...rightNodes];
  };

  const treeNodesStore: MergeTreeNode[] = buildTreeNodes(0, n - 1, 0);
  const maxDepth = Math.max(...treeNodesStore.map(node => node.depth));

  const getTreeSnapshot = (activeNodeId?: string): MergeTreeNode[] => {
    return treeNodesStore.map(node => {
      if (node.id === activeNodeId) {
        return { ...node, status: 'active' as const };
      }
      return { ...node };
    });
  };

  const setNodeStatus = (l: number, r: number, depth: number, status: 'active' | 'waiting' | 'base_case' | 'merged') => {
    const id = `node-${l}-${r}-${depth}`;
    const node = treeNodesStore.find(n => n.id === id);
    if (node) {
      node.status = status;
    }
  };

  const updateNodeElements = (l: number, r: number, depth: number, newEls: VisualElement[]) => {
    const id = `node-${l}-${r}-${depth}`;
    const node = treeNodesStore.find(n => n.id === id);
    if (node) {
      node.elements = newEls.map(el => ({ ...el }));
    }
  };

  const pushFrame = (
    eventType: VisualizationFrame['event']['type'],
    mergeState: MergeSortState,
    goal: string,
    action: string,
    why: string,
    result: string
  ) => {
    const elementsSnapshot = JSON.parse(JSON.stringify(elements));
    const stackSnapshot = JSON.parse(JSON.stringify(stack));
    
    frames.push({
      elements: elementsSnapshot,
      event: {
        type: eventType,
        explanation: action
      },
      callStack: stackSnapshot,
      context: {
        phaseName: 'Merge Sort (Divide & Conquer)',
        goal,
        action,
        why,
        result,
        totalPasses: n,
        currentPass: mergeState.currentDepth,
        overallProgress: Math.min(100, Math.round((frames.length / (n * 3)) * 100))
      },
      mergeSortState: JSON.parse(JSON.stringify(mergeState))
    });
  };

  // STAGE 1 — Original Array & Initial Breakdown
  const initialMid = Math.floor((n - 1) / 2);
  pushFrame(
    'INIT',
    {
      stage: 'STAGE_1_ORIGINAL',
      currentDepth: 0,
      maxDepth,
      activeRange: [0, n - 1],
      midIndex: initialMid,
      leftSubarray: elements.slice(0, initialMid + 1),
      rightSubarray: elements.slice(initialMid + 1),
      tempArray: [],
      treeNodes: getTreeSnapshot(`node-0-${n - 1}-0`),
      milestone: 'Stage 1: Original Array loaded.',
      currentActionText: `Array of size ${n} initialized. Initial mid index calculated at ${initialMid}.`,
      explanationText: `Merge Sort begins by identifying the midpoint. Left Half: [0..${initialMid}], Right Half: [${initialMid + 1}..${n - 1}].`
    },
    'Understand Initial Problem',
    `Initialize array of ${n} elements and calculate mid = ${initialMid}`,
    'Merge Sort is a Divide-and-Conquer algorithm. It first splits the problem into left and right subproblems.',
    'Ready to begin recursive splitting.'
  );

  const sortRecursive = (l: number, r: number, depth: number) => {
    const callId = `sort-${callIdCounter++}`;
    const nodeId = `node-${l}-${r}-${depth}`;
    setNodeStatus(l, r, depth, 'active');

    stack.push({
      id: callId,
      name: 'mergeSort',
      args: { l: l.toString(), r: r.toString(), depth: depth.toString() },
      isActive: true,
      status: 'pending'
    });

    if (l < r) {
      const mid = Math.floor(l + (r - l) / 2);

      // Highlight left and right halves on main array
      for (let k = 0; k < elements.length; k++) {
        if (k >= l && k <= mid) elements[k].state = 'selected'; // Blue (Left)
        else if (k >= mid + 1 && k <= r) elements[k].state = 'swapping'; // Purple (Right)
        else elements[k].state = 'normal';
      }

      // STAGE 2 — Recursive Division
      pushFrame(
        'DIVIDE',
        {
          stage: 'STAGE_2_DIVIDE',
          currentDepth: depth,
          maxDepth,
          activeRange: [l, r],
          midIndex: mid,
          leftSubarray: elements.slice(l, mid + 1),
          rightSubarray: elements.slice(mid + 1, r + 1),
          tempArray: [],
          treeNodes: getTreeSnapshot(nodeId),
          milestone: `Depth ${depth}: Splitting subarray [${l}..${r}]`,
          currentActionText: `Splitting [${l}..${r}] at mid=${mid} into Left [${l}..${mid}] and Right [${mid + 1}..${r}].`,
          explanationText: `Divide step: Break problem into subproblem 1 of size ${mid - l + 1} and subproblem 2 of size ${r - mid}.`
        },
        'Divide Problem',
        `Divide [${l}..${r}] into [${l}..${mid}] and [${mid + 1}..${r}]`,
        'Splitting recursively reduces array size down to trivial 1-element arrays.',
        `Divided into left subproblem [${l}..${mid}] and right subproblem [${mid + 1}..${r}].`
      );

      // Recursively sort left half
      sortRecursive(l, mid, depth + 1);

      // Recursively sort right half
      sortRecursive(mid + 1, r, depth + 1);

      // STAGE 4 & 5 & 6 — Merge Phase
      mergePhase(l, mid, r, depth);

      setNodeStatus(l, r, depth, 'merged');
    } else {
      // Base Case: l === r
      elements[l].state = 'normal';
      setNodeStatus(l, r, depth, 'base_case');

      // STAGE 3 — Base Case Reached
      pushFrame(
        'BASE_CASE',
        {
          stage: 'STAGE_3_TREE',
          currentDepth: depth,
          maxDepth,
          activeRange: [l, r],
          tempArray: [],
          treeNodes: getTreeSnapshot(nodeId),
          milestone: `Base Case reached at index ${l}`,
          currentActionText: `Base Case: Subarray [${l}..${r}] has 1 element (${elements[l].value}).`,
          explanationText: 'Single-element arrays are trivially sorted. Recursion stops here and returns up the call stack.'
        },
        'Reach Base Case',
        `Base case reached for element ${elements[l].value} at index ${l}`,
        'An array of size 1 requires no sorting operations.',
        'Ready to merge with adjacent partition.'
      );
    }

    const topFrame = stack.find(f => f.id === callId);
    if (topFrame) {
      topFrame.status = 'resolved';
    }
    stack = stack.filter(f => f.id !== callId);
  };

  const mergePhase = (l: number, mid: number, r: number, depth: number) => {
    const nodeId = `node-${l}-${r}-${depth}`;
    const leftElements = elements.slice(l, mid + 1).map(el => ({ ...el, state: 'selected' as const })); // Blue
    const rightElements = elements.slice(mid + 1, r + 1).map(el => ({ ...el, state: 'swapping' as const })); // Purple

    const temp: VisualElement[] = [];
    let i = 0;
    let j = 0;

    pushFrame(
      'MERGE',
      {
        stage: 'STAGE_4_COMPARE',
        currentDepth: depth,
        maxDepth,
        activeRange: [l, r],
        midIndex: mid,
        leftSubarray: leftElements,
        rightSubarray: rightElements,
        tempArray: [],
        leftPointer: l + i,
        rightPointer: mid + 1 + j,
        treeNodes: getTreeSnapshot(nodeId),
        milestone: `Depth ${depth}: Merging [${l}..${mid}] and [${mid + 1}..${r}]`,
        currentActionText: `Starting merge of Left [${l}..${mid}] and Right [${mid + 1}..${r}].`,
        explanationText: 'We will compare elements at pointers i and j and place the smaller element into the Auxiliary Temp Array.'
      },
      'Merge Sorted Subarrays',
      `Prepare merge for [${l}..${mid}] (size ${mid - l + 1}) and [${mid + 1}..${r}] (size ${r - mid})`,
      'Both left and right halves are individually sorted. Comparing front elements guarantees overall sorted order.',
      'Comparison pointers i and j set to start of each half.'
    );

    // Merge loop
    while (i < leftElements.length && j < rightElements.length) {
      const leftVal = leftElements[i].value;
      const rightVal = rightElements[j].value;

      // STAGE 4 — Comparing
      pushFrame(
        'COMPARE',
        {
          stage: 'STAGE_4_COMPARE',
          currentDepth: depth,
          maxDepth,
          activeRange: [l, r],
          midIndex: mid,
          leftSubarray: leftElements.map((el, idx) => ({
            ...el,
            state: idx === i ? ('comparing' as const) : ('selected' as const)
          })),
          rightSubarray: rightElements.map((el, idx) => ({
            ...el,
            state: idx === j ? ('comparing' as const) : ('swapping' as const)
          })),
          tempArray: [...temp],
          leftPointer: l + i,
          rightPointer: mid + 1 + j,
          comparedPair: [leftVal, rightVal],
          treeNodes: getTreeSnapshot(nodeId),
          milestone: `Comparing ${leftVal} (Left) and ${rightVal} (Right)`,
          currentActionText: `Comparing Left front (${leftVal}) vs Right front (${rightVal}).`,
          explanationText: `Comparing elements to choose the smaller one. ${
            leftVal <= rightVal ? `${leftVal} <= ${rightVal}, so pick ${leftVal} from Left.` : `${rightVal} < ${leftVal}, so pick ${rightVal} from Right.`
          }`
        },
        'Compare Front Elements',
        `Compare ${leftVal} and ${rightVal}`,
        'Merge sort selects the smaller of the two front elements to preserve ascending order.',
        leftVal <= rightVal ? `Pick ${leftVal} from Left half.` : `Pick ${rightVal} from Right half.`
      );

      // STAGE 5 — Temp Array Auxiliary Memory Insertion
      let chosen: VisualElement;
      if (leftVal <= rightVal) {
        chosen = { ...leftElements[i], state: 'found' as const };
        i++;
      } else {
        chosen = { ...rightElements[j], state: 'found' as const };
        j++;
      }
      temp.push(chosen);

      pushFrame(
        'INSERT',
        {
          stage: 'STAGE_5_TEMP',
          currentDepth: depth,
          maxDepth,
          activeRange: [l, r],
          midIndex: mid,
          leftSubarray: leftElements,
          rightSubarray: rightElements,
          tempArray: [...temp],
          leftPointer: l + i,
          rightPointer: mid + 1 + j,
          selectedForMerge: chosen,
          treeNodes: getTreeSnapshot(nodeId),
          milestone: `Added ${chosen.value} to Auxiliary Temp Array`,
          currentActionText: `Placed element ${chosen.value} into Temp Array. Current Temp Array: [${temp.map(t => t.value).join(', ')}].`,
          explanationText: 'Merge Sort uses O(N) auxiliary space. We build the merged sequence in a temporary array before copying back.'
        },
        'Build Temp Array (Auxiliary Memory)',
        `Append ${chosen.value} to Temp Array`,
        'Auxiliary memory prevents overwriting elements in the original array during comparisons.',
        `Temp array updated: [${temp.map(t => t.value).join(', ')}].`
      );
    }

    // Flush remaining left elements
    while (i < leftElements.length) {
      const chosen = { ...leftElements[i], state: 'found' as const };
      i++;
      temp.push(chosen);

      pushFrame(
        'INSERT',
        {
          stage: 'STAGE_5_TEMP',
          currentDepth: depth,
          maxDepth,
          activeRange: [l, r],
          midIndex: mid,
          leftSubarray: leftElements,
          rightSubarray: rightElements,
          tempArray: [...temp],
          leftPointer: l + i,
          rightPointer: mid + 1 + j,
          selectedForMerge: chosen,
          treeNodes: getTreeSnapshot(nodeId),
          milestone: `Flushing remaining Left element ${chosen.value}`,
          currentActionText: `Right half exhausted. Copying remaining Left element ${chosen.value} to Temp Array.`,
          explanationText: 'Since the right half is fully processed, remaining left elements are already sorted and can be appended directly.'
        },
        'Flush Remaining Elements',
        `Copy ${chosen.value} from Left half to Temp Array`,
        'Remaining elements in left half are guaranteed to be larger than all previously inserted items.',
        `Temp array updated: [${temp.map(t => t.value).join(', ')}].`
      );
    }

    // Flush remaining right elements
    while (j < rightElements.length) {
      const chosen = { ...rightElements[j], state: 'found' as const };
      j++;
      temp.push(chosen);

      pushFrame(
        'INSERT',
        {
          stage: 'STAGE_5_TEMP',
          currentDepth: depth,
          maxDepth,
          activeRange: [l, r],
          midIndex: mid,
          leftSubarray: leftElements,
          rightSubarray: rightElements,
          tempArray: [...temp],
          leftPointer: l + i,
          rightPointer: mid + 1 + j,
          selectedForMerge: chosen,
          treeNodes: getTreeSnapshot(nodeId),
          milestone: `Flushing remaining Right element ${chosen.value}`,
          currentActionText: `Left half exhausted. Copying remaining Right element ${chosen.value} to Temp Array.`,
          explanationText: 'Since the left half is fully processed, remaining right elements are already sorted and can be appended directly.'
        },
        'Flush Remaining Elements',
        `Copy ${chosen.value} from Right half to Temp Array`,
        'Remaining elements in right half are guaranteed to be larger than all previously inserted items.',
        `Temp array updated: [${temp.map(t => t.value).join(', ')}].`
      );
    }

    // STAGE 6 — Copy Back to Main Array
    for (let k = 0; k < temp.length; k++) {
      elements[l + k] = {
        ...temp[k],
        id: elements[l + k].id,
        state: 'sorted' as const // Cyan / Sorted state
      };
    }

    updateNodeElements(l, r, depth, elements.slice(l, r + 1));

    pushFrame(
      'PASS_COMPLETE',
      {
        stage: 'STAGE_6_FINAL_MERGE',
        currentDepth: depth,
        maxDepth,
        activeRange: [l, r],
        mergedSubarray: elements.slice(l, r + 1),
        tempArray: [...temp],
        treeNodes: getTreeSnapshot(nodeId),
        milestone: `Merged result copied back to range [${l}..${r}]`,
        currentActionText: `Copied merged array [${temp.map(t => t.value).join(', ')}] back to original positions [${l}..${r}].`,
        explanationText: `Subarray [${l}..${r}] is now fully merged and sorted.`
      },
      'Copy Merged Result Back',
      `Overwrite array segment [${l}..${r}] with merged values`,
      'The temporary array contents are written back to the original array to complete this subproblem.',
      `Segment [${l}..${r}] is now sorted.`
    );
  };

  // Start recursion
  sortRecursive(0, n - 1, 0);

  // Final Complete Frame
  for (let k = 0; k < elements.length; k++) {
    elements[k].state = 'sorted';
  }

  pushFrame(
    'COMPLETE',
    {
      stage: 'STAGE_6_FINAL_MERGE',
      currentDepth: 0,
      maxDepth,
      activeRange: [0, n - 1],
      tempArray: [],
      treeNodes: treeNodesStore.map(n => ({ ...n, status: 'merged' as const })),
      milestone: 'Algorithm Complete!',
      currentActionText: 'Merge Sort complete! All recursive divisions have been merged back together.',
      explanationText: `The array of ${n} elements is now completely sorted in ascending order with O(N log N) time complexity.`
    },
    'Algorithm Complete',
    'Merge Sort finished',
    'All subproblems divided, conquered, and merged back into the final array.',
    'Entire array is sorted.'
  );

  return frames;
}
