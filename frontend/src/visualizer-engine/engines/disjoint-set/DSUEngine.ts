import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { DSUVisualizerState, DSUElement } from '../../types/ds-states';

export class DSUEngine implements IVisualizerEngine<DSUVisualizerState> {
  public meta: EngineMeta = {
    id: 'disjoint-set-engine',
    name: 'Disjoint Set Union (DSU) Engine',
    dataStructure: 'disjoint-set',
    category: 'Tree Structures & Connectivity',
    supportedOperations: ['union', 'find', 'connected', 'reset'],
    defaultInput: [0, 1, 2, 3, 4, 5, 6],
  };

  public generateInitialState(input?: number[]): DSUVisualizerState {
    const raw = Array.isArray(input) && input.length > 0 ? input : this.meta.defaultInput;
    const elements: DSUElement[] = raw.map((val: number) => ({
      id: `dsu-${val}`,
      value: val,
      parentId: `dsu-${val}`, // Initially each element is its own parent
      rank: 0,
      size: 1,
      state: 'default',
    }));

    return {
      elements,
      componentsCount: elements.length,
      message: `DSU initialized with ${elements.length} singleton disjoint components.`,
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: DSUVisualizerState
  ): TimelineSnapshot<DSUVisualizerState>[] {
    switch (operation) {
      case 'union':
        return this.runUnion(currentState, Number(params.a ?? 1), Number(params.b ?? 2));
      case 'find':
        return this.runFind(currentState, Number(params.val ?? 2));
      case 'connected':
        return this.runConnected(currentState, Number(params.a ?? 1), Number(params.b ?? 2));
      case 'reset':
        return [
          {
            stepIndex: 0,
            totalSteps: 1,
            event: { id: 'reset', type: 'RESET', description: 'Reset DSU components' },
            state: this.generateInitialState(),
            explanation: 'All elements reset to independent singletons.',
            pseudocodeLine: 1,
          },
        ];
      default:
        return this.runFind(currentState, 1);
    }
  }

  private runFind(state: DSUVisualizerState, val: number): TimelineSnapshot<DSUVisualizerState>[] {
    const snapshots: TimelineSnapshot<DSUVisualizerState>[] = [];
    const elements = JSON.parse(JSON.stringify(state.elements)) as DSUElement[];
    const targetId = `dsu-${val}`;
    const path: number[] = [];

    let curr = elements.find((e) => e.id === targetId);
    if (!curr) return [];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 3,
      event: { id: 'find-start', type: 'FIND_START', description: `find(${val})` },
      state: { ...state, message: `Find root representative of element ${val}...` },
      explanation: 'Follow parent pointers until parent == element (the set representative).',
      pseudocodeLine: 1,
    });

    while (curr.parentId !== curr.id) {
      path.push(curr.value);
      curr.state = 'active';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 4,
        event: { id: `step-${curr.value}`, type: 'TRAVERSE_PARENT', description: `Trace ${curr.value} -> parent` },
        state: {
          ...state,
          elements: JSON.parse(JSON.stringify(elements)),
          findPath: [...path],
          message: `Element ${curr.value} has parent ${curr.parentId.replace('dsu-', '')}. Climbing up...`,
        },
        explanation: 'Follow pointer upward.',
        pseudocodeLine: 2,
      });

      curr = elements.find((e) => e.id === curr!.parentId)!;
    }

    path.push(curr.value);
    const rootVal = curr.value;

    // Path compression
    for (const pVal of path) {
      const el = elements.find((e) => e.value === pVal);
      if (el && el.id !== curr.id) {
        el.parentId = curr.id;
        el.state = 'compressing';
      }
    }

    curr.state = 'representative';

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'find-done', type: 'PATH_COMPRESSION', description: `Root is ${rootVal}. Applied Path Compression.` },
      state: {
        ...state,
        elements,
        findPath: path,
        message: `Root representative of ${val} is ${rootVal}! Path compressed directly to root.`,
      },
      explanation: 'Path compression flattens tree structure, guaranteeing near O(1) amortized inverse Ackermann α(N) runtime.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runUnion(state: DSUVisualizerState, a: number, b: number): TimelineSnapshot<DSUVisualizerState>[] {
    const snapshots: TimelineSnapshot<DSUVisualizerState>[] = [];
    const elements: DSUElement[] = JSON.parse(JSON.stringify(state.elements));

    // Find roots of a and b
    const findRoot = (val: number): DSUElement => {
      let curr = elements.find((e) => e.value === val)!;
      while (curr.parentId !== curr.id) {
        curr = elements.find((e) => e.id === curr.parentId)!;
      }
      return curr;
    };

    const rootA = findRoot(a);
    const rootB = findRoot(b);

    snapshots.push({
      stepIndex: 0,
      totalSteps: 3,
      event: { id: 'union-find', type: 'UNION_PREPARE', description: `Union sets of ${a} and ${b}` },
      state: {
        ...state,
        unionPair: [a, b],
        message: `Union(${a}, ${b}): root(${a}) = ${rootA.value}, root(${b}) = ${rootB.value}.`,
      },
      explanation: 'First find the root representative of both elements.',
      pseudocodeLine: 1,
    });

    if (rootA.id === rootB.id) {
      snapshots.push({
        stepIndex: 1,
        totalSteps: 2,
        event: { id: 'already-connected', type: 'ALREADY_CONNECTED', description: 'Elements already in same set' },
        state: {
          ...state,
          message: `${a} and ${b} are already in the same component (Root: ${rootA.value})! No union needed.`,
        },
        explanation: 'If find(a) == find(b), edge creates a cycle in graph connectivity.',
        pseudocodeLine: 2,
      });
      return snapshots;
    }

    // Union by rank
    if (rootA.rank < rootB.rank) {
      rootA.parentId = rootB.id;
      rootB.size += rootA.size;
    } else if (rootA.rank > rootB.rank) {
      rootB.parentId = rootA.id;
      rootA.size += rootB.size;
    } else {
      rootB.parentId = rootA.id;
      rootA.rank += 1;
      rootA.size += rootB.size;
    }

    const newComponents = state.componentsCount - 1;

    snapshots.push({
      stepIndex: 1,
      totalSteps: 2,
      event: { id: 'union-done', type: 'UNION_MERGED', description: `Merged components` },
      state: {
        ...state,
        elements,
        componentsCount: newComponents,
        unionPair: [a, b],
        message: `Merged set ${rootB.value} into ${rootA.value}. Components remaining: ${newComponents}.`,
      },
      explanation: 'Union by rank attaches shorter tree under taller tree to keep tree balanced.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  private runConnected(state: DSUVisualizerState, a: number, b: number): TimelineSnapshot<DSUVisualizerState>[] {
    const findRoot = (val: number): number => {
      let curr = state.elements.find((e) => e.value === val)!;
      while (curr.parentId !== curr.id) {
        curr = state.elements.find((e) => e.id === curr.parentId)!;
      }
      return curr.value;
    };

    const rootA = findRoot(a);
    const rootB = findRoot(b);
    const isConn = rootA === rootB;

    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'conn-test', type: 'CONNECTED_QUERY', description: `connected(${a}, ${b})` },
        state: {
          ...state,
          message: isConn
            ? `CONNECTED: ${a} and ${b} share root representative ${rootA}.`
            : `DISCONNECTED: root(${a})=${rootA} != root(${b})=${rootB}. Different components.`,
        },
        explanation: 'Connected query checks if find(a) == find(b).',
        pseudocodeLine: 1,
      },
    ];
  }
}
