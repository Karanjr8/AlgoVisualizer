import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { ArrayVisualizerState, ArrayCell } from '../../types/ds-states';

export class ArrayEngine implements IVisualizerEngine<ArrayVisualizerState> {
  public meta: EngineMeta = {
    id: 'array-engine',
    name: 'Array Visualization Engine',
    dataStructure: 'array',
    category: 'Arrays & Searching & Sorting',
    supportedOperations: [
      'traverse',
      'search-linear',
      'search-binary',
      'insert',
      'delete',
      'bubble-sort',
      'selection-sort',
      'insertion-sort',
    ],
    defaultInput: [29, 10, 14, 37, 13, 42, 25],
  };

  public generateInitialState(input?: number[]): ArrayVisualizerState {
    const rawValues = Array.isArray(input) && input.length > 0 ? input : this.meta.defaultInput;
    const cells: ArrayCell[] = rawValues.map((val: number, idx: number) => ({
      id: `arr-${idx}-${val}`,
      index: idx,
      value: val,
      state: 'default',
    }));

    return {
      cells,
      comparisonsCount: 0,
      swapsCount: 0,
      message: 'Array initialized. Select an operation or search/sort algorithm.',
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: ArrayVisualizerState
  ): TimelineSnapshot<ArrayVisualizerState>[] {
    switch (operation) {
      case 'traverse':
        return this.runTraversal(currentState);
      case 'search-linear':
        return this.runLinearSearch(currentState, Number(params.target ?? 14));
      case 'search-binary':
        return this.runBinarySearch(currentState, Number(params.target ?? 14));
      case 'insert':
        return this.runInsert(currentState, Number(params.index ?? 2), Number(params.value ?? 99));
      case 'delete':
        return this.runDelete(currentState, Number(params.index ?? 2));
      case 'bubble-sort':
        return this.runBubbleSort(currentState);
      case 'selection-sort':
        return this.runSelectionSort(currentState);
      case 'insertion-sort':
        return this.runInsertionSort(currentState);
      default:
        return this.runTraversal(currentState);
    }
  }

  private runTraversal(state: ArrayVisualizerState): TimelineSnapshot<ArrayVisualizerState>[] {
    const snapshots: TimelineSnapshot<ArrayVisualizerState>[] = [];
    let currentCells: ArrayCell[] = state.cells.map((c) => ({ ...c, state: 'default', pointers: [] }));

    snapshots.push({
      stepIndex: 0,
      totalSteps: currentCells.length + 1,
      event: { id: 'init', type: 'INIT', description: 'Start array sequential traversal' },
      state: { ...state, cells: currentCells, message: 'Beginning array traversal from index 0' },
      explanation: 'Array traversal visits each element sequentially from left to right.',
      pseudocodeLine: 1,
    });

    for (let i = 0; i < currentCells.length; i++) {
      currentCells = currentCells.map((c, idx) => ({
        ...c,
        state: idx === i ? ('current' as const) : idx < i ? ('sorted' as const) : ('default' as const),
        pointers: idx === i ? [`index ${i}`] : undefined,
      }));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: currentCells.length + 1,
        event: { id: `visit-${i}`, type: 'VISIT', description: `Visited element at index ${i}` },
        state: { ...state, cells: currentCells, message: `Accessing arr[${i}] = ${currentCells[i].value}` },
        explanation: `O(1) direct memory access via index offset base + ${i} * sizeof(element).`,
        pseudocodeLine: 2,
      });
    }

    currentCells = currentCells.map((c) => ({ ...c, state: 'sorted' as const, pointers: [] }));
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'complete', type: 'COMPLETE', description: 'Array traversal complete' },
      state: { ...state, cells: currentCells, message: 'Completed full array traversal.' },
      explanation: 'All elements visited in O(N) linear time and O(1) space.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runLinearSearch(state: ArrayVisualizerState, target: number): TimelineSnapshot<ArrayVisualizerState>[] {
    const snapshots: TimelineSnapshot<ArrayVisualizerState>[] = [];
    let currentCells: ArrayCell[] = state.cells.map((c) => ({ ...c, state: 'default', pointers: [] }));
    let comparisons = 0;
    let found = false;

    snapshots.push({
      stepIndex: 0,
      totalSteps: currentCells.length + 1,
      event: { id: 'init-search', type: 'INIT', description: `Linear Search for target = ${target}` },
      state: { ...state, cells: currentCells, comparisonsCount: 0, message: `Searching for value ${target}...` },
      explanation: `Linear Search checks each array position from index 0 upwards until target is found.`,
      pseudocodeLine: 1,
    });

    for (let i = 0; i < currentCells.length; i++) {
      comparisons++;
      const isMatch = currentCells[i].value === target;

      currentCells = currentCells.map((c, idx) => ({
        ...c,
        state: idx === i ? (isMatch ? ('found' as const) : ('comparing' as const)) : idx < i ? ('eliminated' as const) : ('default' as const),
        pointers: idx === i ? [`compare ${c.value} == ${target}`] : undefined,
      }));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: currentCells.length + 1,
        event: { id: `cmp-${i}`, type: 'COMPARE', description: `Comparing arr[${i}] (${currentCells[i].value}) with ${target}` },
        state: {
          ...state,
          cells: currentCells,
          comparisonsCount: comparisons,
          message: isMatch ? `Match found at index ${i}!` : `arr[${i}] (${currentCells[i].value}) != ${target}. Continuing...`,
        },
        explanation: isMatch
          ? `Target ${target} located at index ${i} in ${comparisons} comparison(s).`
          : `Element does not match target. Advance pointer to next index.`,
        pseudocodeLine: isMatch ? 4 : 2,
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
        event: { id: 'not-found', type: 'NOT_FOUND', description: `Target ${target} not in array` },
        state: {
          ...state,
          cells: currentCells.map((c) => ({ ...c, state: 'eliminated' as const })),
          comparisonsCount: comparisons,
          message: `Target ${target} was not found in array.`,
        },
        explanation: `Searched entire array of size ${currentCells.length}. Result: -1 (Not found).`,
        pseudocodeLine: 5,
      });
    }

    return snapshots;
  }

  private runBinarySearch(state: ArrayVisualizerState, target: number): TimelineSnapshot<ArrayVisualizerState>[] {
    const snapshots: TimelineSnapshot<ArrayVisualizerState>[] = [];
    // Ensure sorted for binary search
    const sortedValues = [...state.cells.map((c) => c.value)].sort((a, b) => a - b);
    let cells: ArrayCell[] = sortedValues.map((val, idx) => ({
      id: `bs-cell-${idx}`,
      index: idx,
      value: val,
      state: 'default' as const,
    }));

    let left = 0;
    let right = cells.length - 1;
    let comparisons = 0;
    let found = false;

    snapshots.push({
      stepIndex: 0,
      totalSteps: 8,
      event: { id: 'init-bs', type: 'INIT', description: `Binary Search for target ${target}` },
      state: { ...state, cells, message: `Sorted array ready. Initial search range [${left}, ${right}].` },
      explanation: 'Binary Search requires a sorted array. Search boundary initially covers entire array.',
      pseudocodeLine: 1,
    });

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);
      comparisons++;
      const midVal = cells[mid].value;

      cells = cells.map((c, idx) => {
        let s: ArrayCell['state'] = 'default';
        if (idx < left || idx > right) s = 'eliminated';
        else if (idx === mid) s = midVal === target ? 'found' : 'comparing';
        else s = 'current';

        const pointers: string[] = [];
        if (idx === left) pointers.push('L');
        if (idx === mid) pointers.push('M');
        if (idx === right) pointers.push('R');

        return { ...c, state: s, pointers: pointers.length > 0 ? pointers : undefined };
      });

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 8,
        event: { id: `mid-${mid}`, type: 'CHECK_MID', description: `Checking mid index ${mid} (value ${midVal})` },
        state: {
          ...state,
          cells,
          comparisonsCount: comparisons,
          message: `Left=${left}, Mid=${mid} (${midVal}), Right=${right}. Target=${target}`,
        },
        explanation: `Calculate mid = left + (right - left) / 2 = ${mid}. Inspect arr[${mid}] = ${midVal}.`,
        pseudocodeLine: 3,
      });

      if (midVal === target) {
        found = true;
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 8,
          event: { id: 'bs-found', type: 'FOUND', description: `Target found at index ${mid}` },
          state: {
            ...state,
            cells: cells.map((c, idx) => ({ ...c, state: idx === mid ? 'found' : c.state })),
            comparisonsCount: comparisons,
            message: `Target ${target} found at index ${mid}!`,
          },
          explanation: `arr[${mid}] == ${target}. Return index ${mid}. O(log N) runtime verified.`,
          pseudocodeLine: 4,
        });
        break;
      } else if (midVal < target) {
        left = mid + 1;
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 8,
          event: { id: 'bs-right', type: 'ELIMINATE_LEFT', description: `${midVal} < ${target}. Search right half.` },
          state: { ...state, cells, comparisonsCount: comparisons, message: `${midVal} < ${target}. New Left = ${left}.` },
          explanation: `Since arr[mid] < target, target must be in the right subarray. Eliminate left half.`,
          pseudocodeLine: 6,
        });
      } else {
        right = mid - 1;
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 8,
          event: { id: 'bs-left', type: 'ELIMINATE_RIGHT', description: `${midVal} > ${target}. Search left half.` },
          state: { ...state, cells, comparisonsCount: comparisons, message: `${midVal} > ${target}. New Right = ${right}.` },
          explanation: `Since arr[mid] > target, target must be in the left subarray. Eliminate right half.`,
          pseudocodeLine: 8,
        });
      }
    }

    if (!found) {
      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 8,
        event: { id: 'bs-none', type: 'NOT_FOUND', description: `Target ${target} not in sorted array` },
        state: {
          ...state,
          cells: cells.map((c) => ({ ...c, state: 'eliminated' as const, pointers: [] })),
          comparisonsCount: comparisons,
          message: `Target ${target} not found. Left > Right boundary cross.`,
        },
        explanation: 'Search interval exhausted without match. Return -1.',
        pseudocodeLine: 10,
      });
    }

    return snapshots;
  }

  private runInsert(state: ArrayVisualizerState, targetIdx: number, val: number): TimelineSnapshot<ArrayVisualizerState>[] {
    const snapshots: TimelineSnapshot<ArrayVisualizerState>[] = [];
    const origValues = state.cells.map((c) => c.value);
    const clampedIdx = Math.max(0, Math.min(origValues.length, targetIdx));

    snapshots.push({
      stepIndex: 0,
      totalSteps: origValues.length - clampedIdx + 3,
      event: { id: 'insert-start', type: 'INSERT_START', description: `Insert ${val} at index ${clampedIdx}` },
      state: { ...state, message: `Preparing to insert ${val} at index ${clampedIdx}. Shifting elements right...` },
      explanation: 'In a fixed array, inserting at index k requires shifting all elements from k to end one step right.',
      pseudocodeLine: 1,
    });

    // Make space by shifting
    const newValues = [...origValues, 0];
    for (let i = origValues.length; i > clampedIdx; i--) {
      newValues[i] = newValues[i - 1];
      const cells: ArrayCell[] = newValues.map((v, idx) => ({
        id: `ins-${idx}`,
        index: idx,
        value: v,
        state: idx === i ? ('swapping' as const) : idx === clampedIdx ? ('current' as const) : ('default' as const),
        pointers: idx === i ? [`shift to ${i}`] : undefined,
      }));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: origValues.length - clampedIdx + 3,
        event: { id: `shift-${i}`, type: 'SHIFT', description: `Shift element at ${i - 1} to ${i}` },
        state: { ...state, cells, message: `Shifted element ${newValues[i]} from index ${i - 1} to ${i}` },
        explanation: `Freeing up slot at index ${clampedIdx} by shifting elements rightward.`,
        pseudocodeLine: 2,
      });
    }

    // Place element
    newValues[clampedIdx] = val;
    const finalCells: ArrayCell[] = newValues.map((v, idx) => ({
      id: `ins-${idx}-${v}`,
      index: idx,
      value: v,
      state: idx === clampedIdx ? ('found' as const) : ('default' as const),
      pointers: idx === clampedIdx ? ['inserted'] : undefined,
    }));

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'insert-done', type: 'INSERT_DONE', description: `Placed ${val} at index ${clampedIdx}` },
      state: { ...state, cells: finalCells, message: `Inserted ${val} into position ${clampedIdx}.` },
      explanation: `Insertion complete. Worst-case O(N) shift operations performed.`,
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  private runDelete(state: ArrayVisualizerState, targetIdx: number): TimelineSnapshot<ArrayVisualizerState>[] {
    const snapshots: TimelineSnapshot<ArrayVisualizerState>[] = [];
    const origValues = state.cells.map((c) => c.value);
    const clampedIdx = Math.max(0, Math.min(origValues.length - 1, targetIdx));
    const deletedVal = origValues[clampedIdx];

    snapshots.push({
      stepIndex: 0,
      totalSteps: origValues.length - clampedIdx + 2,
      event: { id: 'del-start', type: 'DELETE_START', description: `Delete element at index ${clampedIdx}` },
      state: {
        ...state,
        cells: state.cells.map((c, i) => ({ ...c, state: i === clampedIdx ? 'swapping' : 'default' })),
        message: `Removing arr[${clampedIdx}] = ${deletedVal}. Shifting remaining elements left...`,
      },
      explanation: 'Deleting from an array requires removing element and shifting all subsequent elements left by 1.',
      pseudocodeLine: 1,
    });

    const newValues = [...origValues];
    for (let i = clampedIdx; i < newValues.length - 1; i++) {
      newValues[i] = newValues[i + 1];
      const cells: ArrayCell[] = newValues.slice(0, newValues.length - 1).map((v, idx) => ({
        id: `del-${idx}`,
        index: idx,
        value: v,
        state: idx === i ? ('swapping' as const) : ('default' as const),
      }));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: origValues.length - clampedIdx + 2,
        event: { id: `shift-left-${i}`, type: 'SHIFT_LEFT', description: `Shifted arr[${i + 1}] to arr[${i}]` },
        state: { ...state, cells, message: `Shifted element ${newValues[i]} leftward into index ${i}` },
        explanation: `Overwriting index ${i} with value from index ${i + 1}.`,
        pseudocodeLine: 2,
      });
    }

    const finalCells: ArrayCell[] = newValues.slice(0, newValues.length - 1).map((v, idx) => ({
      id: `del-final-${idx}`,
      index: idx,
      value: v,
      state: 'default' as const,
    }));

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'del-done', type: 'DELETE_DONE', description: `Deleted ${deletedVal}. Length now ${finalCells.length}` },
      state: { ...state, cells: finalCells, message: `Deletion complete. Removed element ${deletedVal}.` },
      explanation: `Element removed and contiguous memory restored in O(N) time.`,
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runBubbleSort(state: ArrayVisualizerState): TimelineSnapshot<ArrayVisualizerState>[] {
    const snapshots: TimelineSnapshot<ArrayVisualizerState>[] = [];
    const values = state.cells.map((c) => c.value);
    const n = values.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        const cmpFirst = values[j];
        const cmpSecond = values[j + 1];
        const shouldSwap = cmpFirst > cmpSecond;

        // Snapshot: Comparison
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 20,
          event: { id: `cmp-${i}-${j}`, type: 'COMPARE', description: `Compare ${cmpFirst} and ${cmpSecond}` },
          state: {
            ...state,
            comparisonsCount: comparisons,
            swapsCount: swaps,
            cells: values.map((v, idx) => ({
              id: `bb-${idx}-${v}`,
              index: idx,
              value: v,
              state: idx === j || idx === j + 1 ? 'comparing' : idx >= n - i ? 'sorted' : 'default',
              pointers: idx === j ? ['j'] : idx === j + 1 ? ['j+1'] : undefined,
            })),
            message: `Pass ${i + 1}: Comparing arr[${j}] (${cmpFirst}) and arr[${j + 1}] (${cmpSecond})`,
          },
          explanation: `Compare adjacent elements at index ${j} and ${j + 1}.`,
          pseudocodeLine: 2,
        });

        if (shouldSwap) {
          swaps++;
          swapped = true;
          values[j] = cmpSecond;
          values[j + 1] = cmpFirst;

          // Snapshot: Swap
          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: 20,
            event: { id: `swap-${i}-${j}`, type: 'SWAP', description: `Swapped ${cmpFirst} and ${cmpSecond}` },
            state: {
              ...state,
              comparisonsCount: comparisons,
              swapsCount: swaps,
              cells: values.map((v, idx) => ({
                id: `bb-${idx}-${v}`,
                index: idx,
                value: v,
                state: idx === j || idx === j + 1 ? 'swapping' : idx >= n - i ? 'sorted' : 'default',
              })),
              message: `Swapped: ${cmpFirst} > ${cmpSecond}. Moved larger value to the right.`,
            },
            explanation: `Swapping ${cmpFirst} and ${cmpSecond} since order is inverted.`,
            pseudocodeLine: 3,
          });
        }
      }

      if (!swapped) break;
    }

    // Final sorted snapshot
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'bubble-done', type: 'SORT_DONE', description: 'Bubble sort finished' },
      state: {
        ...state,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        cells: values.map((v, idx) => ({
          id: `bb-final-${idx}-${v}`,
          index: idx,
          value: v,
          state: 'sorted' as const,
        })),
        message: `Bubble Sort complete! ${comparisons} comparisons, ${swaps} swaps.`,
      },
      explanation: 'Array is completely sorted in non-decreasing order.',
      pseudocodeLine: 5,
    });

    return snapshots;
  }

  private runSelectionSort(state: ArrayVisualizerState): TimelineSnapshot<ArrayVisualizerState>[] {
    const snapshots: TimelineSnapshot<ArrayVisualizerState>[] = [];
    const values = state.cells.map((c) => c.value);
    const n = values.length;
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        if (values[j] < values[minIdx]) {
          minIdx = j;
        }

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 20,
          event: { id: `sel-cmp-${i}-${j}`, type: 'COMPARE', description: `Scanning for min value` },
          state: {
            ...state,
            comparisonsCount: comparisons,
            swapsCount: swaps,
            cells: values.map((v, idx) => ({
              id: `sel-${idx}-${v}`,
              index: idx,
              value: v,
              state: idx === minIdx ? 'found' : idx === j ? 'comparing' : idx < i ? 'sorted' : 'default',
              pointers: idx === i ? ['start'] : idx === minIdx ? ['min'] : undefined,
            })),
            message: `Pass ${i + 1}: Current minimum is arr[${minIdx}] (${values[minIdx]})`,
          },
          explanation: `Scan unsorted portion to find the absolute minimum element.`,
          pseudocodeLine: 3,
        });
      }

      if (minIdx !== i) {
        swaps++;
        const temp = values[i];
        values[i] = values[minIdx];
        values[minIdx] = temp;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 20,
          event: { id: `sel-swap-${i}`, type: 'SWAP', description: `Swapped min element into index ${i}` },
          state: {
            ...state,
            comparisonsCount: comparisons,
            swapsCount: swaps,
            cells: values.map((v, idx) => ({
              id: `sel-${idx}-${v}`,
              index: idx,
              value: v,
              state: idx === i ? 'sorted' : idx === minIdx ? 'swapping' : idx < i ? 'sorted' : 'default',
            })),
            message: `Placed minimum value ${values[i]} at sorted boundary index ${i}.`,
          },
          explanation: `Swap minimum element with first position of unsorted boundary.`,
          pseudocodeLine: 5,
        });
      }
    }

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'sel-done', type: 'SORT_DONE', description: 'Selection sort finished' },
      state: {
        ...state,
        comparisonsCount: comparisons,
        swapsCount: swaps,
        cells: values.map((v, idx) => ({ id: `sel-fin-${idx}-${v}`, index: idx, value: v, state: 'sorted' as const })),
        message: `Selection Sort complete with ${swaps} swaps.`,
      },
      explanation: 'Array is sorted with exactly O(N) swaps.',
      pseudocodeLine: 6,
    });

    return snapshots;
  }

  private runInsertionSort(state: ArrayVisualizerState): TimelineSnapshot<ArrayVisualizerState>[] {
    const snapshots: TimelineSnapshot<ArrayVisualizerState>[] = [];
    const values = state.cells.map((c) => c.value);
    const n = values.length;
    let comparisons = 0;

    for (let i = 1; i < n; i++) {
      const key = values[i];
      let j = i - 1;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 20,
        event: { id: `ins-key-${i}`, type: 'SELECT_KEY', description: `Selected key = ${key}` },
        state: {
          ...state,
          comparisonsCount: comparisons,
          cells: values.map((v, idx) => ({
            id: `ins-${idx}-${v}`,
            index: idx,
            value: v,
            state: idx === i ? 'found' : idx < i ? 'sorted' : 'default',
            pointers: idx === i ? ['key'] : undefined,
          })),
          message: `Inserting key = ${key} into sorted subarray [0...${i - 1}].`,
        },
        explanation: `Key ${key} picked. Compare backwards and shift larger elements rightward.`,
        pseudocodeLine: 2,
      });

      while (j >= 0 && values[j] > key) {
        comparisons++;
        values[j + 1] = values[j];

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 20,
          event: { id: `ins-shift-${j}`, type: 'SHIFT', description: `Shifted ${values[j]} to index ${j + 1}` },
          state: {
            ...state,
            comparisonsCount: comparisons,
            cells: values.map((v, idx) => ({
              id: `ins-${idx}-${v}`,
              index: idx,
              value: v,
              state: idx === j + 1 ? 'swapping' : idx <= i ? 'sorted' : 'default',
            })),
            message: `${values[j]} > ${key}. Shifted ${values[j]} to position ${j + 1}.`,
          },
          explanation: `Element is larger than key, shift it right to make space.`,
          pseudocodeLine: 4,
        });

        j--;
      }

      values[j + 1] = key;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 20,
        event: { id: `ins-place-${i}`, type: 'PLACE_KEY', description: `Inserted key ${key} at index ${j + 1}` },
        state: {
          ...state,
          comparisonsCount: comparisons,
          cells: values.map((v, idx) => ({
            id: `ins-${idx}-${v}`,
            index: idx,
            value: v,
            state: idx <= i ? 'sorted' : 'default',
          })),
          message: `Placed key ${key} at sorted position ${j + 1}.`,
        },
        explanation: `Key inserted. Subarray [0...${i}] is now sorted.`,
        pseudocodeLine: 6,
      });
    }

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'ins-done', type: 'SORT_DONE', description: 'Insertion sort complete' },
      state: {
        ...state,
        cells: values.map((v, idx) => ({ id: `ins-fin-${idx}-${v}`, index: idx, value: v, state: 'sorted' as const })),
        message: 'Insertion Sort complete.',
      },
      explanation: 'Array is sorted. Highly efficient for nearly sorted datasets.',
      pseudocodeLine: 8,
    });

    return snapshots;
  }
}
