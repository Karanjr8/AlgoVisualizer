import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { FenwickTreeVisualizerState, FenwickCell } from '../../types/ds-states';

export class FenwickTreeEngine implements IVisualizerEngine<FenwickTreeVisualizerState> {
  public meta: EngineMeta = {
    id: 'fenwick-tree-engine',
    name: 'Fenwick Tree (Binary Indexed Tree) Engine',
    dataStructure: 'fenwick-tree',
    category: 'Tree Structures & Range Queries',
    supportedOperations: ['prefix-query', 'point-update', 'range-sum'],
    defaultInput: [3, 2, -1, 6, 5, 4, -3, 3],
  };

  public generateInitialState(input?: number[]): FenwickTreeVisualizerState {
    const raw = Array.isArray(input) && input.length > 0 ? input : this.meta.defaultInput;
    const n = raw.length;
    const tree = Array(n + 1).fill(0);

    // Build BIT
    raw.forEach((val: number, idx: number) => {
      let i = idx + 1;
      while (i <= n) {
        tree[i] += val;
        i += i & -i;
      }
    });

    const cells: FenwickCell[] = [];
    for (let i = 1; i <= n; i++) {
      const lowbit = i & -i;
      const startIdx = i - lowbit + 1;
      cells.push({
        index: i,
        value: tree[i],
        originalValue: raw[i - 1],
        lowbit,
        responsibleRange: [startIdx, i],
        state: 'default',
      });
    }

    return {
      cells,
      activeIndices: [],
      message: `Binary Indexed Tree constructed for ${n} elements. Each index i covers [i - lowbit + 1, i].`,
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: FenwickTreeVisualizerState
  ): TimelineSnapshot<FenwickTreeVisualizerState>[] {
    switch (operation) {
      case 'prefix-query':
        return this.runPrefixQuery(currentState, Number(params.index ?? 7));
      case 'point-update':
        return this.runPointUpdate(currentState, Number(params.index ?? 3), Number(params.delta ?? 5));
      case 'range-sum':
        return this.runRangeSum(currentState, Number(params.l ?? 2), Number(params.r ?? 6));
      default:
        return this.runPrefixQuery(currentState, 7);
    }
  }

  private runPrefixQuery(state: FenwickTreeVisualizerState, queryIdx: number): TimelineSnapshot<FenwickTreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<FenwickTreeVisualizerState>[] = [];
    const n = state.cells.length;
    const clamped = Math.max(1, Math.min(n, queryIdx));
    let i = clamped;
    let sum = 0;
    const visitedIndices: number[] = [];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 5,
      event: { id: 'query-start', type: 'PREFIX_INIT', description: `Compute prefixSum(${clamped})` },
      state: { ...state, message: `Starting Prefix Sum Query up to index ${clamped}.` },
      explanation: 'Binary Indexed Tree sums intervals backward by clearing lowest set bits (i -= i & -i).',
      pseudocodeLine: 1,
    });

    while (i > 0) {
      visitedIndices.push(i);
      const cell = state.cells[i - 1];
      sum += cell.value;

      const cells = state.cells.map((c) => ({
        ...c,
        state: c.index === i ? ('query-step' as const) : visitedIndices.includes(c.index) ? ('active' as const) : ('default' as const),
      }));

      const lowbit = i & -i;
      const nextI = i - lowbit;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 5,
        event: { id: `step-${i}`, type: 'QUERY_STEP', description: `Add BIT[${i}] (${cell.value}), next = ${nextI}` },
        state: {
          ...state,
          cells,
          currentQuerySum: sum,
          activeIndices: [...visitedIndices],
          message: `Index ${i} (lowbit ${lowbit}): add BIT[${i}] = ${cell.value}. Running Sum = ${sum}. Next: ${i} - ${lowbit} = ${nextI}.`,
        },
        explanation: `Index binary: ${i.toString(2)} -> remove LSB -> ${nextI.toString(2)}. Runs in O(log N).`,
        pseudocodeLine: 2,
      });

      i = nextI;
    }

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'query-complete', type: 'PREFIX_COMPLETE', description: `Prefix Sum = ${sum}` },
      state: {
        ...state,
        currentQuerySum: sum,
        message: `Prefix Sum from 1 to ${clamped} is ${sum}! Computed in O(log N) iterations.`,
      },
      explanation: 'Sum computed by combining logarithmic non-overlapping power-of-two responsibility intervals.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runPointUpdate(state: FenwickTreeVisualizerState, targetIdx: number, delta: number): TimelineSnapshot<FenwickTreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<FenwickTreeVisualizerState>[] = [];
    const n = state.cells.length;
    const clamped = Math.max(1, Math.min(n, targetIdx));
    let i = clamped;
    const visitedIndices: number[] = [];

    const cells: FenwickCell[] = JSON.parse(JSON.stringify(state.cells));
    cells[clamped - 1].originalValue += delta;

    snapshots.push({
      stepIndex: 0,
      totalSteps: 5,
      event: { id: 'update-start', type: 'UPDATE_INIT', description: `Add ${delta} to index ${clamped}` },
      state: { ...state, message: `Updating index ${clamped} by delta ${delta}. Propagating upward through responsibility ancestors...` },
      explanation: 'Point update steps upward to ancestor intervals using (i += i & -i).',
      pseudocodeLine: 1,
    });

    while (i <= n) {
      visitedIndices.push(i);
      cells[i - 1].value += delta;
      const lowbit = i & -i;
      const nextI = i + lowbit;

      const visualCells = cells.map((c) => ({
        ...c,
        state: c.index === i ? ('update-step' as const) : visitedIndices.includes(c.index) ? ('active' as const) : ('default' as const),
      }));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 5,
        event: { id: `upd-${i}`, type: 'UPDATE_STEP', description: `Updated BIT[${i}] (+${delta}), next = ${nextI}` },
        state: {
          ...state,
          cells: visualCells,
          activeIndices: [...visitedIndices],
          message: `Index ${i} responsibility covers updated item: added ${delta} to BIT[${i}] (new total ${cells[i - 1].value}). Next: ${i} + ${lowbit} = ${nextI}.`,
        },
        explanation: 'Add lowbit to index to find the next containing responsibility window.',
        pseudocodeLine: 2,
      });

      i = nextI;
    }

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'update-done', type: 'UPDATE_COMPLETE', description: 'Point update complete' },
      state: {
        ...state,
        cells,
        activeIndices: [],
        message: `Point update complete! All ${visitedIndices.length} ancestor windows updated in O(log N).`,
      },
      explanation: 'Tree updated with zero extra memory allocation.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runRangeSum(state: FenwickTreeVisualizerState, L: number, R: number): TimelineSnapshot<FenwickTreeVisualizerState>[] {
    const sumR = this.calcPrefix(state, R);
    const sumLMinus1 = this.calcPrefix(state, L - 1);
    const rangeAns = sumR - sumLMinus1;

    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'range-sum', type: 'RANGE_SUM', description: `Range Sum [${L}, ${R}]` },
        state: {
          ...state,
          currentQuerySum: rangeAns,
          message: `Range Sum [${L}...${R}] = prefixSum(${R}) [${sumR}] - prefixSum(${L - 1}) [${sumLMinus1}] = ${rangeAns}.`,
        },
        explanation: 'Arbitrary range sum [L, R] evaluated via inclusion-exclusion in 2 * O(log N) operations.',
        pseudocodeLine: 1,
      },
    ];
  }

  private calcPrefix(state: FenwickTreeVisualizerState, idx: number): number {
    let i = idx;
    let s = 0;
    while (i > 0) {
      if (i - 1 < state.cells.length) {
        s += state.cells[i - 1].value;
      }
      i -= i & -i;
    }
    return s;
  }
}
