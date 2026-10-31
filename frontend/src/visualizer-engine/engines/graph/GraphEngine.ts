import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { GraphVisualizerState, GraphVertex, GraphEdge } from '../../types/ds-states';

export class GraphEngine implements IVisualizerEngine<GraphVisualizerState> {
  public meta: EngineMeta = {
    id: 'graph-engine',
    name: 'Graph Visualization Engine',
    dataStructure: 'graph',
    category: 'Graphs & Networks',
    supportedOperations: [
      'bfs',
      'dfs',
      'dijkstra',
      'prim',
      'topological-sort',
      'cycle-detection',
      'toggle-directed',
      'reset-visited',
    ],
    defaultInput: null,
  };

  public generateInitialState(customGraph?: { vertices?: GraphVertex[]; edges?: GraphEdge[]; isDirected?: boolean; isWeighted?: boolean }): GraphVisualizerState {
    const vertices: GraphVertex[] = customGraph?.vertices || [
      { id: 'A', label: 'A', x: 120, y: 160, state: 'unvisited', distance: 0 },
      { id: 'B', label: 'B', x: 280, y: 80, state: 'unvisited', distance: Infinity },
      { id: 'C', label: 'C', x: 280, y: 240, state: 'unvisited', distance: Infinity },
      { id: 'D', label: 'D', x: 440, y: 80, state: 'unvisited', distance: Infinity },
      { id: 'E', label: 'E', x: 440, y: 240, state: 'unvisited', distance: Infinity },
      { id: 'F', label: 'F', x: 600, y: 160, state: 'unvisited', distance: Infinity },
    ];

    const edges: GraphEdge[] = customGraph?.edges || [
      { id: 'A-B', from: 'A', to: 'B', weight: 4, directed: false, state: 'default' },
      { id: 'A-C', from: 'A', to: 'C', weight: 2, directed: false, state: 'default' },
      { id: 'B-C', from: 'B', to: 'C', weight: 1, directed: false, state: 'default' },
      { id: 'B-D', from: 'B', to: 'D', weight: 5, directed: false, state: 'default' },
      { id: 'C-E', from: 'C', to: 'E', weight: 8, directed: false, state: 'default' },
      { id: 'D-E', from: 'D', to: 'E', weight: 2, directed: false, state: 'default' },
      { id: 'D-F', from: 'D', to: 'F', weight: 6, directed: false, state: 'default' },
      { id: 'E-F', from: 'E', to: 'F', weight: 3, directed: false, state: 'default' },
    ];

    return {
      vertices,
      edges,
      isDirected: customGraph?.isDirected ?? false,
      isWeighted: customGraph?.isWeighted ?? true,
      visitedOrder: [],
      message: 'Graph initialized with 6 vertices and 8 weighted edges.',
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: GraphVisualizerState
  ): TimelineSnapshot<GraphVisualizerState>[] {
    switch (operation) {
      case 'bfs':
        return this.runBFS(currentState, params.startNode ?? 'A');
      case 'dfs':
        return this.runDFS(currentState, params.startNode ?? 'A');
      case 'dijkstra':
        return this.runDijkstra(currentState, params.startNode ?? 'A');
      case 'prim':
        return this.runPrim(currentState, params.startNode ?? 'A');
      case 'topological-sort':
        return this.runTopologicalSort(currentState);
      case 'cycle-detection':
        return this.runCycleDetection(currentState);
      case 'toggle-directed':
        const nextDirected = !currentState.isDirected;
        return [
          {
            stepIndex: 0,
            totalSteps: 1,
            event: { id: 'toggle-dir', type: 'TOGGLE_DIRECTED', description: `Set directed to ${nextDirected}` },
            state: {
              ...currentState,
              isDirected: nextDirected,
              edges: currentState.edges.map((e) => ({ ...e, directed: nextDirected })),
              message: `Graph set to ${nextDirected ? 'DIRECTED' : 'UNDIRECTED'}.`,
            },
            explanation: 'Edge direction toggled.',
            pseudocodeLine: 1,
          },
        ];
      case 'reset-visited':
        return [
          {
            stepIndex: 0,
            totalSteps: 1,
            event: { id: 'reset', type: 'RESET', description: 'Reset visited markers' },
            state: {
              ...currentState,
              visitedOrder: [],
              activeEdgeId: null,
              vertices: currentState.vertices.map((v) => ({ ...v, state: 'unvisited', distance: Infinity })),
              edges: currentState.edges.map((e) => ({ ...e, state: 'default' })),
              message: 'Reset all visited markers and distances.',
            },
            explanation: 'Cleared graph state.',
            pseudocodeLine: 1,
          },
        ];
      default:
        return this.runBFS(currentState, 'A');
    }
  }

  // ================= BREADTH-FIRST SEARCH (BFS) =================
  private runBFS(state: GraphVisualizerState, startId: string): TimelineSnapshot<GraphVisualizerState>[] {
    const snapshots: TimelineSnapshot<GraphVisualizerState>[] = [];
    const queue: string[] = [startId];
    const visited = new Set<string>([startId]);
    const visitedList: string[] = [];

    let currentVertices: GraphVertex[] = state.vertices.map((v) => ({
      ...v,
      state: v.id === startId ? ('in-queue' as const) : ('unvisited' as const),
    }));
    let currentEdges: GraphEdge[] = state.edges.map((e) => ({ ...e, state: 'default' as const }));

    snapshots.push({
      stepIndex: 0,
      totalSteps: state.vertices.length + 3,
      event: { id: 'bfs-init', type: 'BFS_INIT', description: `Enqueue start vertex ${startId}` },
      state: {
        ...state,
        vertices: currentVertices,
        edges: currentEdges,
        queueOrStack: [...queue],
        visitedOrder: [],
        message: `BFS initialized at Vertex ${startId}. Added to FIFO Queue.`,
      },
      explanation: 'Breadth-First Search uses a Queue to explore neighbor vertices in order of distance layers.',
      pseudocodeLine: 1,
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      visitedList.push(u);

      currentVertices = currentVertices.map((v) => ({
        ...v,
        state: v.id === u ? ('current' as const) : visited.has(v.id) ? ('visited' as const) : ('unvisited' as const),
      }));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: state.vertices.length + 3,
        event: { id: `bfs-pop-${u}`, type: 'DEQUEUE_VERTEX', description: `Dequeued vertex ${u}` },
        state: {
          ...state,
          vertices: currentVertices,
          edges: currentEdges,
          queueOrStack: [...queue],
          visitedOrder: [...visitedList],
          message: `Dequeued Vertex ${u}. Inspecting all adjacent neighbors...`,
        },
        explanation: `De-queue vertex ${u} and discover all adjacent unvisited vertices.`,
        pseudocodeLine: 2,
      });

      // Find neighbors
      const outgoingEdges = currentEdges.filter(
        (e) => (e.from === u || (!state.isDirected && e.to === u))
      );

      for (const edge of outgoingEdges) {
        const neighbor = edge.from === u ? edge.to : edge.from;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);

          currentEdges = currentEdges.map((e) => (e.id === edge.id ? { ...e, state: 'active' as const } : e));
          currentVertices = currentVertices.map((v) => (v.id === neighbor ? { ...v, state: 'in-queue' as const } : v));

          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: state.vertices.length + 3,
            event: { id: `bfs-edge-${edge.id}`, type: 'DISCOVER_NEIGHBOR', description: `Discovered Vertex ${neighbor}` },
            state: {
              ...state,
              vertices: currentVertices,
              edges: currentEdges,
              activeEdgeId: edge.id,
              queueOrStack: [...queue],
              visitedOrder: [...visitedList],
              message: `Traversed edge (${u} -> ${neighbor}). Enqueued Vertex ${neighbor}.`,
            },
            explanation: `Unvisited neighbor ${neighbor} enqueued. Marked edge as traversed.`,
            pseudocodeLine: 3,
          });
        }
      }
    }

    currentVertices = currentVertices.map((v) => ({ ...v, state: 'visited' as const }));
    currentEdges = currentEdges.map((e) => ({ ...e, state: e.state === 'active' ? ('traversed' as const) : ('default' as const) }));

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'bfs-complete', type: 'BFS_COMPLETE', description: 'BFS Traversal complete' },
      state: {
        ...state,
        vertices: currentVertices,
        edges: currentEdges,
        activeEdgeId: null,
        queueOrStack: [],
        visitedOrder: visitedList,
        message: `BFS Complete! Visited order: [${visitedList.join(' -> ')}].`,
      },
      explanation: 'All connected vertices visited in O(V + E) time.',
      pseudocodeLine: 5,
    });

    return snapshots;
  }

  // ================= DEPTH-FIRST SEARCH (DFS) =================
  private runDFS(state: GraphVisualizerState, startId: string): TimelineSnapshot<GraphVisualizerState>[] {
    const snapshots: TimelineSnapshot<GraphVisualizerState>[] = [];
    const visited = new Set<string>();
    const visitedList: string[] = [];
    let currentVertices: GraphVertex[] = state.vertices.map((v) => ({ ...v, state: 'unvisited' as const }));
    let currentEdges: GraphEdge[] = state.edges.map((e) => ({ ...e, state: 'default' as const }));

    const dfs = (u: string) => {
      visited.add(u);
      visitedList.push(u);

      currentVertices = currentVertices.map((v) => ({
        ...v,
        state: v.id === u ? ('current' as const) : visited.has(v.id) ? ('visited' as const) : ('unvisited' as const),
      }));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: state.vertices.length + 3,
        event: { id: `dfs-visit-${u}`, type: 'DFS_VISIT', description: `Visited vertex ${u}` },
        state: {
          ...state,
          vertices: currentVertices,
          edges: currentEdges,
          visitedOrder: [...visitedList],
          message: `DFS Call on Vertex ${u}. Exploring deepest unvisited branch...`,
        },
        explanation: `Recursive DFS visits deep down a path before backtracking.`,
        pseudocodeLine: 2,
      });

      const neighbors = currentEdges.filter(
        (e) => (e.from === u || (!state.isDirected && e.to === u))
      );

      for (const edge of neighbors) {
        const v = edge.from === u ? edge.to : edge.from;
        if (!visited.has(v)) {
          currentEdges = currentEdges.map((e) => (e.id === edge.id ? { ...e, state: 'active' as const } : e));
          dfs(v);
        }
      }
    };

    dfs(startId);

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'dfs-done', type: 'DFS_COMPLETE', description: 'DFS complete' },
      state: {
        ...state,
        vertices: currentVertices.map((v) => ({ ...v, state: 'visited' as const })),
        edges: currentEdges,
        visitedOrder: visitedList,
        message: `DFS Traversal Complete! Order: [${visitedList.join(' -> ')}].`,
      },
      explanation: 'Depth-first search traversal finished in O(V + E) time.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  // ================= DIJKSTRA ALGORITHM =================
  private runDijkstra(state: GraphVisualizerState, startId: string): TimelineSnapshot<GraphVisualizerState>[] {
    const snapshots: TimelineSnapshot<GraphVisualizerState>[] = [];
    const distances: Record<string, number> = {};
    const unvisited = new Set<string>();

    state.vertices.forEach((v) => {
      distances[v.id] = v.id === startId ? 0 : Infinity;
      unvisited.add(v.id);
    });

    let currentVertices: GraphVertex[] = state.vertices.map((v) => ({
      ...v,
      distance: distances[v.id],
      state: v.id === startId ? ('current' as const) : ('unvisited' as const),
    }));
    let currentEdges: GraphEdge[] = state.edges.map((e) => ({ ...e, state: 'default' as const }));

    snapshots.push({
      stepIndex: 0,
      totalSteps: state.vertices.length * 2,
      event: { id: 'dijkstra-init', type: 'DIJKSTRA_INIT', description: `Initialize Dijkstra from ${startId}` },
      state: {
        ...state,
        vertices: currentVertices,
        edges: currentEdges,
        message: `Dijkstra: dist[${startId}] = 0, all other distances = ∞.`,
      },
      explanation: 'Dijkstra maintains a greedy priority of smallest tentative distance.',
      pseudocodeLine: 1,
    });

    while (unvisited.size > 0) {
      // Pick node with minimum tentative distance
      let minDist = Infinity;
      let u: string | null = null;
      for (const node of unvisited) {
        if (distances[node] < minDist) {
          minDist = distances[node];
          u = node;
        }
      }

      if (!u || minDist === Infinity) break;
      unvisited.delete(u);

      currentVertices = currentVertices.map((v) => ({
        ...v,
        distance: distances[v.id],
        state: v.id === u ? ('current' as const) : !unvisited.has(v.id) ? ('visited' as const) : ('unvisited' as const),
      }));

      // Relax outgoing edges
      const outgoing = currentEdges.filter(
        (e) => (e.from === u || (!state.isDirected && e.to === u))
      );

      for (const edge of outgoing) {
        const v = edge.from === u ? edge.to : edge.from;
        if (unvisited.has(v)) {
          const weight = edge.weight ?? 1;
          const newDist = distances[u] + weight;

          if (newDist < distances[v]) {
            distances[v] = newDist;
            currentEdges = currentEdges.map((e) => (e.id === edge.id ? { ...e, state: 'relaxed' as const } : e));
            currentVertices = currentVertices.map((vert) => (vert.id === v ? { ...vert, distance: newDist, predecessor: u } : vert));

            snapshots.push({
              stepIndex: snapshots.length,
              totalSteps: state.vertices.length * 2,
              event: { id: `relax-${u}-${v}`, type: 'RELAX_EDGE', description: `Relaxed edge (${u} -> ${v}): dist=${newDist}` },
              state: {
                ...state,
                vertices: currentVertices,
                edges: currentEdges,
                activeEdgeId: edge.id,
                message: `Relaxed edge (${u} -> ${v}): new shortest distance to ${v} = ${newDist} (via ${u}).`,
              },
              explanation: `dist[${v}] was updated from ${distances[v] === Infinity ? '∞' : distances[v]} to ${newDist}.`,
              pseudocodeLine: 3,
            });
          }
        }
      }
    }

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'dijkstra-done', type: 'DIJKSTRA_COMPLETE', description: 'All shortest paths computed' },
      state: {
        ...state,
        vertices: currentVertices.map((v) => ({ ...v, state: 'visited' as const })),
        edges: currentEdges,
        activeEdgeId: null,
        message: 'Dijkstra shortest path computation complete for all reachable vertices.',
      },
      explanation: 'Optimal single-source shortest path tree generated in O((V + E) log V).',
      pseudocodeLine: 5,
    });

    return snapshots;
  }

  // ================= PRIM'S MINIMUM SPANNING TREE =================
  private runPrim(state: GraphVisualizerState, startId: string): TimelineSnapshot<GraphVisualizerState>[] {
    const snapshots: TimelineSnapshot<GraphVisualizerState>[] = [];
    const inMST = new Set<string>([startId]);
    const mstEdges: string[] = [];
    let currentEdges: GraphEdge[] = state.edges.map((e) => ({ ...e, state: 'default' as const }));

    snapshots.push({
      stepIndex: 0,
      totalSteps: state.vertices.length,
      event: { id: 'prim-start', type: 'PRIM_INIT', description: `Start Prim MST at vertex ${startId}` },
      state: {
        ...state,
        vertices: state.vertices.map((v) => ({ ...v, state: v.id === startId ? 'visited' : 'unvisited' })),
        edges: currentEdges,
        message: `Prim's Minimum Spanning Tree initialized with Vertex ${startId}.`,
      },
      explanation: 'Prim builds MST by greedily selecting lowest weight edge crossing into the unvisited set.',
      pseudocodeLine: 1,
    });

    while (inMST.size < state.vertices.length) {
      let minEdge: GraphEdge | null = null;
      let minWeight = Infinity;
      let nextVertex: string | null = null;

      for (const edge of currentEdges) {
        const uIn = inMST.has(edge.from);
        const vIn = inMST.has(edge.to);

        // Edge crosses cut
        if ((uIn && !vIn) || (!uIn && vIn)) {
          const w = edge.weight ?? 1;
          if (w < minWeight) {
            minWeight = w;
            minEdge = edge;
            nextVertex = uIn ? edge.to : edge.from;
          }
        }
      }

      if (!minEdge || !nextVertex) break;

      inMST.add(nextVertex);
      mstEdges.push(minEdge.id);

      currentEdges = currentEdges.map((e) => (e.id === minEdge!.id ? { ...e, state: 'mst' as const } : e));

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: state.vertices.length,
        event: { id: `mst-add-${minEdge.id}`, type: 'ADD_MST_EDGE', description: `Added edge ${minEdge.from}-${minEdge.to} (wt: ${minWeight})` },
        state: {
          ...state,
          vertices: state.vertices.map((v) => ({ ...v, state: inMST.has(v.id) ? 'visited' : 'unvisited' })),
          edges: currentEdges,
          activeEdgeId: minEdge.id,
          message: `Added cheapest cut edge (${minEdge.from}-${minEdge.to}, weight ${minWeight}) to MST.`,
        },
        explanation: 'Greedy choice: lowest weight edge connecting visited set to remaining vertices.',
        pseudocodeLine: 2,
      });
    }

    return snapshots;
  }

  // ================= TOPOLOGICAL SORT =================
  private runTopologicalSort(state: GraphVisualizerState): TimelineSnapshot<GraphVisualizerState>[] {
    const snapshots: TimelineSnapshot<GraphVisualizerState>[] = [];
    const inDegree: Record<string, number> = {};
    state.vertices.forEach((v) => (inDegree[v.id] = 0));

    state.edges.forEach((e) => {
      inDegree[e.to] = (inDegree[e.to] || 0) + 1;
    });

    const queue: string[] = state.vertices.filter((v) => inDegree[v.id] === 0).map((v) => v.id);
    const topoOrder: string[] = [];

    snapshots.push({
      stepIndex: 0,
      totalSteps: state.vertices.length + 1,
      event: { id: 'kahn-init', type: 'KAHN_INIT', description: 'Compute in-degrees for Kahn Algorithm' },
      state: {
        ...state,
        queueOrStack: [...queue],
        message: `Kahn Algorithm: Vertices with In-Degree 0: [${queue.join(', ')}].`,
      },
      explanation: 'Topological sort requires vertices with in-degree 0 (no prerequisites) to be processed first.',
      pseudocodeLine: 1,
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      topoOrder.push(u);

      const outgoing = state.edges.filter((e) => e.from === u);
      for (const e of outgoing) {
        inDegree[e.to]--;
        if (inDegree[e.to] === 0) {
          queue.push(e.to);
        }
      }

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: state.vertices.length + 1,
        event: { id: `topo-proc-${u}`, type: 'TOPO_PROCESS', description: `Processed ${u}` },
        state: {
          ...state,
          visitedOrder: [...topoOrder],
          queueOrStack: [...queue],
          message: `Processed Vertex ${u}. Decremented neighbor in-degrees. Topo order: [${topoOrder.join(' -> ')}]`,
        },
        explanation: `Remove node ${u} and reduce dependency count of its successors.`,
        pseudocodeLine: 2,
      });
    }

    return snapshots;
  }

  // ================= CYCLE DETECTION =================
  private runCycleDetection(state: GraphVisualizerState): TimelineSnapshot<GraphVisualizerState>[] {
    // DFS cycle detection using 3 states: 0=unvisited, 1=visiting (current recursion stack), 2=visited
    const snapshots: TimelineSnapshot<GraphVisualizerState>[] = [];
    const visitedState: Record<string, number> = {};
    state.vertices.forEach((v) => (visitedState[v.id] = 0));
    let hasCycle = false;

    for (const v of state.vertices) {
      if (visitedState[v.id] === 0) {
        if (this.dfsCycleHelper(v.id, state, visitedState, snapshots)) {
          hasCycle = true;
          break;
        }
      }
    }

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'cycle-result', type: 'CYCLE_RESULT', description: hasCycle ? 'Cycle Detected!' : 'No Cycle Found' },
      state: {
        ...state,
        message: hasCycle ? 'Cycle Detected! Back-edge found in current recursion stack.' : 'Graph is Acyclic (DAG). No cycle found.',
      },
      explanation: hasCycle ? 'Encountered vertex currently in the call stack (back-edge).' : 'All vertices explored without encountering ancestor.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  private dfsCycleHelper(
    u: string,
    state: GraphVisualizerState,
    vis: Record<string, number>,
    snapshots: TimelineSnapshot<GraphVisualizerState>[]
  ): boolean {
    vis[u] = 1; // visiting

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: 10,
      event: { id: `cycle-vis-${u}`, type: 'CYCLE_VISIT', description: `Visiting ${u} (in call stack)` },
      state: {
        ...state,
        vertices: state.vertices.map((vert) => ({
          ...vert,
          state: vis[vert.id] === 1 ? 'visiting' : vis[vert.id] === 2 ? 'visited' : 'unvisited',
        })),
        message: `Visiting Vertex ${u}. Marked as grey (active recursion stack).`,
      },
      explanation: '3-color cycle detection: white=unvisited, grey=in-stack, black=finished.',
      pseudocodeLine: 2,
    });

    const neighbors = state.edges.filter((e) => e.from === u);
    for (const edge of neighbors) {
      const v = edge.to;
      if (vis[v] === 1) {
        // Back-edge found!
        return true;
      }
      if (vis[v] === 0) {
        if (this.dfsCycleHelper(v, state, vis, snapshots)) return true;
      }
    }

    vis[u] = 2; // finished
    return false;
  }
}
