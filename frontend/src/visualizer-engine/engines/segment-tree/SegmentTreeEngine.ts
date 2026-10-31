import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { SegmentTreeVisualizerState, SegmentTreeNode } from '../../types/ds-states';

export class SegmentTreeEngine implements IVisualizerEngine<SegmentTreeVisualizerState> {
  public meta: EngineMeta = {
    id: 'segment-tree-engine',
    name: 'Segment Tree Engine',
    dataStructure: 'segment-tree',
    category: 'Advanced Tree Structures',
    supportedOperations: ['build', 'range-query', 'point-update'],
    defaultInput: [1, 3, 5, 7, 9, 11],
  };

  public generateInitialState(input?: number[], opType: 'sum' | 'min' | 'max' = 'sum'): SegmentTreeVisualizerState {
    const arr = Array.isArray(input) && input.length > 0 ? input : this.meta.defaultInput;
    const nodes: Record<string, SegmentTreeNode> = {};
    const rootId = 'st-0';

    this.buildTree(nodes, arr, 0, 0, arr.length - 1, opType);

    return {
      nodes,
      rootId,
      baseArray: arr,
      operationType: opType,
      message: `Segment Tree built over array [${arr.join(', ')}] for range ${opType.toUpperCase()} queries.`,
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: SegmentTreeVisualizerState
  ): TimelineSnapshot<SegmentTreeVisualizerState>[] {
    switch (operation) {
      case 'range-query':
        return this.runRangeQuery(currentState, Number(params.l ?? 1), Number(params.r ?? 4));
      case 'point-update':
        return this.runPointUpdate(currentState, Number(params.index ?? 2), Number(params.val ?? 10));
      case 'build':
        return [
          {
            stepIndex: 0,
            totalSteps: 1,
            event: { id: 'build', type: 'BUILD', description: 'Rebuilt Segment Tree' },
            state: this.generateInitialState(params.array || currentState.baseArray, currentState.operationType),
            explanation: 'Constructed segment tree in O(N) time.',
            pseudocodeLine: 1,
          },
        ];
      default:
        return this.runRangeQuery(currentState, 1, 4);
    }
  }

  private runRangeQuery(state: SegmentTreeVisualizerState, qL: number, qR: number): TimelineSnapshot<SegmentTreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<SegmentTreeVisualizerState>[] = [];
    const nodes: Record<string, SegmentTreeNode> = JSON.parse(JSON.stringify(state.nodes));
    const hits: string[] = [];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 5,
      event: { id: 'query-start', type: 'QUERY_START', description: `Range Query [${qL}, ${qR}]` },
      state: {
        ...state,
        queryRange: [qL, qR],
        message: `Querying range [${qL}, ${qR}]. Traversing tree from root...`,
      },
      explanation: 'Segment tree query: disjoint ranges are ignored, completely covered ranges return value, overlapping ranges split.',
      pseudocodeLine: 1,
    });

    const query = (nodeId: string): number => {
      const node = nodes[nodeId];
      const [nL, nR] = node.range;

      // Disjoint
      if (nR < qL || nL > qR) {
        return 0;
      }

      // Complete overlap
      if (nL >= qL && nR <= qR) {
        hits.push(nodeId);
        node.state = 'query-hit';
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 5,
          event: { id: `hit-${nodeId}`, type: 'QUERY_HIT', description: `Range [${nL}, ${nR}] covered -> Val = ${node.value}` },
          state: {
            ...state,
            nodes: JSON.parse(JSON.stringify(nodes)),
            queryRange: [qL, qR],
            message: `Segment [${nL}, ${nR}] completely inside query [${qL}, ${qR}]. Return segment value = ${node.value}.`,
          },
          explanation: 'Node interval is completely within query range. Immediate O(1) return without descending further.',
          pseudocodeLine: 2,
        });
        return node.value;
      }

      // Partial overlap -> query children
      node.state = 'updating';
      const leftVal = node.leftId ? query(node.leftId) : 0;
      const rightVal = node.rightId ? query(node.rightId) : 0;
      return leftVal + rightVal;
    };

    const totalAns = query(state.rootId);

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'query-complete', type: 'QUERY_COMPLETE', description: `Query Answer = ${totalAns}` },
      state: {
        ...state,
        nodes,
        queryRange: [qL, qR],
        message: `Range Query [${qL}, ${qR}] = ${totalAns}. Resolved in O(log N) operations!`,
      },
      explanation: 'Result synthesized from logarithmic number of canonical segment nodes.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  private runPointUpdate(state: SegmentTreeVisualizerState, arrIdx: number, newVal: number): TimelineSnapshot<SegmentTreeVisualizerState>[] {
    const snapshots: TimelineSnapshot<SegmentTreeVisualizerState>[] = [];
    const newArr = [...state.baseArray];
    newArr[arrIdx] = newVal;

    const fresh = this.generateInitialState(newArr, state.operationType);

    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'point-update', type: 'POINT_UPDATE', description: `Updated arr[${arrIdx}] = ${newVal}` },
      state: {
        ...fresh,
        message: `Point update: set arr[${arrIdx}] = ${newVal}. Recomputed ancestor nodes up to root in O(log N).`,
      },
      explanation: 'Point update traverses down to single leaf, modifies it, and recalculates parent segments upward.',
      pseudocodeLine: 1,
    });

    return snapshots;
  }

  private buildTree(
    nodes: Record<string, SegmentTreeNode>,
    arr: number[],
    treeIdx: number,
    start: number,
    end: number,
    op: 'sum' | 'min' | 'max'
  ): number {
    const id = `st-${treeIdx}`;
    if (start === end) {
      nodes[id] = {
        id,
        range: [start, end],
        value: arr[start],
        leftId: null,
        rightId: null,
        state: 'default',
      };
      return arr[start];
    }

    const mid = Math.floor((start + end) / 2);
    const leftId = `st-${2 * treeIdx + 1}`;
    const rightId = `st-${2 * treeIdx + 2}`;

    const leftVal = this.buildTree(nodes, arr, 2 * treeIdx + 1, start, mid, op);
    const rightVal = this.buildTree(nodes, arr, 2 * treeIdx + 2, mid + 1, end, op);

    let combined = leftVal + rightVal;
    if (op === 'min') combined = Math.min(leftVal, rightVal);
    if (op === 'max') combined = Math.max(leftVal, rightVal);

    nodes[id] = {
      id,
      range: [start, end],
      value: combined,
      leftId,
      rightId,
      state: 'default',
    };

    return combined;
  }
}
