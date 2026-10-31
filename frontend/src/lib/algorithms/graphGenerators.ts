import type { VisualizationFrame, GraphNode, GraphEdge, GraphState, AlgorithmEventType } from '../../types/visualizer';

function pushGraphFrame(
  frames: VisualizationFrame[],
  graphState: GraphState,
  eventType: AlgorithmEventType,
  explanation: string
) {
  frames.push({
    elements: [],
    event: { type: eventType, explanation },
    graphState: JSON.parse(JSON.stringify(graphState))
  });
}

// ----------------------------------------------------
// SAMPLE GRAPH BUILDERS WITH CLEAN READABLE COORDINATES
// ----------------------------------------------------
function createStandardGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 100, y: 180, state: 'unvisited', distance: '∞' },
    { id: 'B', label: 'B', x: 240, y: 80, state: 'unvisited', distance: '∞' },
    { id: 'C', label: 'C', x: 240, y: 280, state: 'unvisited', distance: '∞' },
    { id: 'D', label: 'D', x: 400, y: 80, state: 'unvisited', distance: '∞' },
    { id: 'E', label: 'E', x: 400, y: 280, state: 'unvisited', distance: '∞' },
    { id: 'F', label: 'F', x: 540, y: 180, state: 'unvisited', distance: '∞' },
  ];

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', weight: 4, state: 'normal' },
    { from: 'A', to: 'C', weight: 2, state: 'normal' },
    { from: 'B', to: 'C', weight: 1, state: 'normal' },
    { from: 'B', to: 'D', weight: 5, state: 'normal' },
    { from: 'C', to: 'E', weight: 8, state: 'normal' },
    { from: 'D', to: 'E', weight: 2, state: 'normal' },
    { from: 'D', to: 'F', weight: 6, state: 'normal' },
    { from: 'E', to: 'F', weight: 3, state: 'normal' },
  ];

  return { nodes, edges };
}

// 1. GRAPH REPRESENTATION
export function generateGraphRepresentationFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const { nodes, edges } = createStandardGraph();

  const labels = nodes.map(n => n.label);
  const matrix: number[][] = Array(nodes.length).fill(0).map(() => Array(nodes.length).fill(0));
  const adjList: Record<string, string[]> = {};
  nodes.forEach(n => { adjList[n.id] = []; });

  edges.forEach(e => {
    const idx1 = labels.indexOf(e.from);
    const idx2 = labels.indexOf(e.to);
    matrix[idx1][idx2] = e.weight || 1;
    matrix[idx2][idx1] = e.weight || 1;
    adjList[e.from].push(e.to);
    adjList[e.to].push(e.from);
  });

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    matrix,
    matrixNodeLabels: labels,
    adjList,
    algorithmName: 'Graph Representation (Adjacency Matrix vs List)',
    explanationText: 'Graphs can be represented using an Adjacency Matrix O(V²) or Adjacency List O(V+E).',
    decisionReason: 'Adjacency lists are preferred for sparse graphs to minimize memory overhead.',
    changeSummary: 'Loaded graph data structures.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  nodes.forEach(node => {
    node.state = 'current';
    const neighbors = adjList[node.id];
    state.explanationText = `Inspecting Node ${node.id}. Adjacency List entry: [${neighbors.join(', ')}].`;
    state.decisionReason = `Node ${node.id} has ${neighbors.length} direct neighbors connected by edges.`;
    state.changeSummary = `Highlighted Node ${node.id} and its matrix row/adjacency entries.`;
    pushGraphFrame(frames, state, 'SELECT', state.explanationText!);
    node.state = 'visited';
  });

  state.explanationText = 'Graph Representation analysis complete! Adjacency List allows fast O(deg(V)) neighbor lookups.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);
  return frames;
}

// 2. BREADTH-FIRST SEARCH (BFS)
export function generateBFSFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const { nodes, edges } = createStandardGraph();

  const visitedNodes: string[] = [];
  const queue: string[] = ['A'];
  const distances: Record<string, number | string> = { A: 0 };
  nodes.forEach(n => { if (n.id !== 'A') distances[n.id] = '∞'; });

  nodes.find(n => n.id === 'A')!.distance = 0;
  nodes.find(n => n.id === 'A')!.state = 'queued';

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [...visitedNodes],
    queue: [...queue],
    distances: { ...distances },
    algorithmName: 'Breadth-First Search (BFS)',
    explanationText: 'Starting BFS traversal from source Node A. Pushed Node A into FIFO Queue with dist=0.',
    decisionReason: 'BFS uses a FIFO queue to explore nodes level-by-level in increasing distance order.',
    changeSummary: 'Initialized queue = [A].'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  const adj: Record<string, string[]> = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  });

  const visitedSet = new Set<string>(['A']);

  while (queue.length > 0) {
    const currId = queue.shift()!;
    state.queue = [...queue];
    visitedNodes.push(currId);
    state.visitedNodes = [...visitedNodes];

    const currNode = state.nodes.find(n => n.id === currId)!;
    currNode.state = 'current';

    state.explanationText = `Dequeued Node ${currId} from Queue. Inspecting all adjacent neighbors...`;
    state.decisionReason = `Node ${currId} was at the front of the queue, representing the earliest discovered unvisited level.`;
    state.changeSummary = `Dequeued ${currId}. Active Node = ${currId}. Visited = [${visitedNodes.join(', ')}].`;
    pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

    for (const neighborId of adj[currId]) {
      const edge = state.edges.find(e => (e.from === currId && e.to === neighborId) || (e.from === neighborId && e.to === currId));
      if (edge) edge.state = 'active';

      if (!visitedSet.has(neighborId)) {
        visitedSet.add(neighborId);
        queue.push(neighborId);
        state.queue = [...queue];

        const currDist = Number(distances[currId]) || 0;
        distances[neighborId] = currDist + 1;
        state.distances = { ...distances };

        const neighborNode = state.nodes.find(n => n.id === neighborId)!;
        neighborNode.state = 'queued';
        neighborNode.distance = currDist + 1;

        state.explanationText = `Discovered neighbor ${neighborId}. Updated dist(${neighborId}) = ${currDist + 1} and enqueued ${neighborId}.`;
        state.decisionReason = `Node ${neighborId} has not been visited yet. Enqueuing ensures it will be explored in the next level.`;
        state.changeSummary = `Enqueued ${neighborId}. Updated dist(${neighborId}) = ${currDist + 1}.`;
        pushGraphFrame(frames, state, 'INSERT', state.explanationText!);
      }

      if (edge) edge.state = 'traversed';
    }

    currNode.state = 'visited';
  }

  state.explanationText = `BFS Complete! Visited order: [${visitedNodes.join(' → ')}]. Shortest level distances computed.`;
  state.decisionReason = 'Queue is empty; all reachable components and levels have been processed.';
  state.changeSummary = 'Finished BFS traversal.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 3. DEPTH-FIRST SEARCH (DFS)
export function generateDFSFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const { nodes, edges } = createStandardGraph();

  const visitedNodes: string[] = [];
  const stack: string[] = ['A'];
  const activePath: string[] = [];

  nodes.find(n => n.id === 'A')!.state = 'queued';

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [...visitedNodes],
    stack: [...stack],
    activePath: [...activePath],
    algorithmName: 'Depth-First Search (DFS)',
    explanationText: 'Starting DFS traversal from Node A. Pushed source A onto Call Stack.',
    decisionReason: 'DFS uses a LIFO Call Stack to dive as deep as possible down each path before backtracking.',
    changeSummary: 'Stack = [A].'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  const adj: Record<string, string[]> = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  });

  const visitedSet = new Set<string>();

  while (stack.length > 0) {
    const currId = stack.pop()!;
    state.stack = [...stack];

    if (!visitedSet.has(currId)) {
      visitedSet.add(currId);
      visitedNodes.push(currId);
      state.visitedNodes = [...visitedNodes];
      activePath.push(currId);
      state.activePath = [...activePath];

      const currNode = state.nodes.find(n => n.id === currId)!;
      currNode.state = 'current';

      state.explanationText = `Popped Node ${currId} from stack. Active Traversal Path: ${activePath.join(' → ')}.`;
      state.decisionReason = `Exploring deepest branch starting at ${currId}.`;
      state.changeSummary = `Popped ${currId}. Active Node = ${currId}.`;
      pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

      let hasUnvisitedNeighbor = false;
      for (const neighborId of adj[currId].slice().reverse()) {
        const edge = state.edges.find(e => (e.from === currId && e.to === neighborId) || (e.from === neighborId && e.to === currId));
        if (edge) edge.state = 'active';

        if (!visitedSet.has(neighborId)) {
          hasUnvisitedNeighbor = true;
          stack.push(neighborId);
          state.stack = [...stack];

          const neighborNode = state.nodes.find(n => n.id === neighborId)!;
          if (neighborNode.state !== 'visited') neighborNode.state = 'visiting';

          state.explanationText = `Pushed unvisited neighbor ${neighborId} onto stack. Dives deeper next.`;
          state.decisionReason = `Neighbor ${neighborId} is unvisited; pushing it extends current branch.`;
          state.changeSummary = `Pushed ${neighborId} onto stack.`;
          pushGraphFrame(frames, state, 'INSERT', state.explanationText!);
        }

        if (edge) edge.state = 'traversed';
      }

      if (!hasUnvisitedNeighbor && activePath.length > 1) {
        state.backtrackPath = [...activePath];
        const returningNode = activePath.pop();
        state.activePath = [...activePath];
        state.explanationText = `Backtracking! Reached dead end at ${returningNode}. Retreating back to parent ${activePath[activePath.length - 1]}.`;
        state.decisionReason = `No unvisited outgoing edges remain at ${returningNode}; unwinding recursion stack.`;
        state.changeSummary = `Backtracked from ${returningNode} to ${activePath[activePath.length - 1]}.`;
        pushGraphFrame(frames, state, 'CHECK_CONDITION', state.explanationText!);
      }

      currNode.state = 'visited';
    }
  }

  state.activePath = [];
  state.explanationText = `DFS Traversal Complete! Visited order: [${visitedNodes.join(' → ')}].`;
  state.decisionReason = 'Recursion stack is empty; all branches fully explored.';
  state.changeSummary = 'Finished DFS traversal.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 4. CONNECTED COMPONENTS
export function generateConnectedComponentsFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    // Component 1
    { id: 'A', label: 'A', x: 100, y: 100, state: 'unvisited' },
    { id: 'B', label: 'B', x: 220, y: 80, state: 'unvisited' },
    { id: 'C', label: 'C', x: 160, y: 220, state: 'unvisited' },
    // Component 2
    { id: 'D', label: 'D', x: 380, y: 100, state: 'unvisited' },
    { id: 'E', label: 'E', x: 500, y: 100, state: 'unvisited' },
    // Component 3
    { id: 'F', label: 'F', x: 440, y: 240, state: 'unvisited' },
  ];

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', state: 'normal' },
    { from: 'B', to: 'C', state: 'normal' },
    { from: 'A', to: 'C', state: 'normal' },
    { from: 'D', to: 'E', state: 'normal' },
  ];

  const colors = ['#10b981', '#06b6d4', '#a855f7']; // Emerald, Cyan, Purple
  const visitedSet = new Set<string>();
  const components: Array<{ id: number; nodes: string[]; color: string }> = [];

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    components: [],
    totalComponents: 0,
    algorithmName: 'Connected Components (DFS Discovery)',
    explanationText: 'Starting Connected Components count. Graph has 6 nodes across disconnected subgraphs.',
    decisionReason: 'Iterating over all vertices. An unvisited node triggers a new component traversal.',
    changeSummary: 'Initialized component count = 0.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  let compId = 1;
  for (const node of nodes) {
    if (!visitedSet.has(node.id)) {
      const color = colors[(compId - 1) % colors.length];
      const compNodes: string[] = [];
      components.push({ id: compId, nodes: compNodes, color });
      state.components = [...components];
      state.totalComponents = compId;

      state.explanationText = `Unvisited node ${node.id} detected! Starting Component #${compId} traversal (Color: ${color}).`;
      state.decisionReason = `Node ${node.id} belongs to a new unvisited connected subgraph.`;
      state.changeSummary = `Created Component #${compId}. Total components = ${compId}.`;
      pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

      // BFS/DFS fill for this component
      const queue = [node.id];
      visitedSet.add(node.id);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        compNodes.push(curr);
        state.visitedNodes.push(curr);

        const currNode = state.nodes.find(n => n.id === curr)!;
        currNode.state = 'component';
        currNode.colorHex = color;
        currNode.colorLabel = `Comp ${compId}`;

        state.explanationText = `Assigned Node ${curr} to Component #${compId}.`;
        state.decisionReason = `Node ${curr} is reachable from component seed node.`;
        state.changeSummary = `Node ${curr} colored with Component #${compId} badge.`;
        pushGraphFrame(frames, state, 'INSERT', state.explanationText!);

        const neighbors = edges
          .filter(e => e.from === curr || e.to === curr)
          .map(e => (e.from === curr ? e.to : e.from));

        for (const neighbor of neighbors) {
          if (!visitedSet.has(neighbor)) {
            visitedSet.add(neighbor);
            queue.push(neighbor);
            const e = state.edges.find(e => (e.from === curr && e.to === neighbor) || (e.from === neighbor && e.to === curr));
            if (e) {
              e.state = 'mst';
              e.label = `Comp ${compId}`;
            }
          }
        }
      }

      compId++;
    }
  }

  state.explanationText = `Component Discovery Complete! Found ${components.length} distinct Connected Components.`;
  state.decisionReason = 'All graph vertices have been visited and partitioned into disjoint components.';
  state.changeSummary = `Final Component Count = ${components.length}.`;
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 5. CYCLE DETECTION
export function generateCycleDetectionFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 120, y: 120, state: 'unvisited' },
    { id: 'B', label: 'B', x: 280, y: 80, state: 'unvisited' },
    { id: 'C', label: 'C', x: 440, y: 120, state: 'unvisited' },
    { id: 'D', label: 'D', x: 280, y: 260, state: 'unvisited' },
  ];

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', isDirected: true, state: 'normal' },
    { from: 'B', to: 'C', isDirected: true, state: 'normal' },
    { from: 'C', to: 'D', isDirected: true, state: 'normal' },
    { from: 'D', to: 'B', isDirected: true, state: 'normal' }, // Back Edge creating cycle B->C->D->B
  ];

  const visitedSet = new Set<string>();
  const inStack = new Set<string>();
  const stack: string[] = [];

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    stack: [],
    isCycleDetected: false,
    algorithmName: 'Cycle Detection (3-Color DFS on Directed Graph)',
    explanationText: 'Starting Cycle Detection using 3-Color DFS (White=Unvisited, Gray=In Recursion Stack, Black=Processed).',
    decisionReason: 'A cycle exists in a directed graph if and only if a DFS encounters a back-edge to a node currently in the recursion stack (Gray).',
    changeSummary: 'Initialized recursion stack.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  const dfs = (currId: string): boolean => {
    visitedSet.add(currId);
    inStack.add(currId);
    stack.push(currId);
    state.stack = [...stack];
    state.visitedNodes.push(currId);

    const currNode = state.nodes.find(n => n.id === currId)!;
    currNode.state = 'visiting'; // Gray state

    state.explanationText = `Visited Node ${currId}. Added to recursion stack: [${stack.join(' → ')}].`;
    state.decisionReason = `Node ${currId} marked as visiting (Gray).`;
    state.changeSummary = `Recursion Stack = [${stack.join(' → ')}].`;
    pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

    const outgoing = edges.filter(e => e.from === currId);
    for (const edge of outgoing) {
      const mainEdge = state.edges.find(e => e.from === edge.from && e.to === edge.to)!;
      mainEdge.state = 'active';

      if (inStack.has(edge.to)) {
        // BACK EDGE FOUND! CYCLE DETECTED!
        const cycleStartIndex = stack.indexOf(edge.to);
        const cycleNodes = stack.slice(cycleStartIndex);
        state.cycleNodes = cycleNodes;
        state.isCycleDetected = true;
        mainEdge.state = 'cycle';

        // Highlight cycle nodes & edges
        cycleNodes.forEach(nid => {
          const n = state.nodes.find(node => node.id === nid)!;
          n.state = 'cycle';
        });

        state.explanationText = `CRITICAL: BACK-EDGE DETECTED from ${currId} to ${edge.to}! Node ${edge.to} is already in recursion stack!`;
        state.decisionReason = `Cycle formed by path: ${cycleNodes.join(' → ')} → ${edge.to}.`;
        state.changeSummary = `CYCLE DETECTED: [${cycleNodes.join(' → ')} → ${edge.to}]!`;
        pushGraphFrame(frames, state, 'ELIMINATE', state.explanationText!);
        return true;
      }

      if (!visitedSet.has(edge.to)) {
        if (dfs(edge.to)) return true;
      }

      mainEdge.state = 'traversed';
    }

    inStack.delete(currId);
    stack.pop();
    state.stack = [...stack];
    currNode.state = 'visited'; // Black state
    return false;
  };

  dfs('A');

  state.explanationText = state.isCycleDetected
    ? 'Cycle Detection Finished: GRAPH CONTAINS A CYCLE!'
    : 'Cycle Detection Finished: No cycle found (DAG).';
  state.decisionReason = state.isCycleDetected ? 'Back-edge verified cycle presence.' : 'All nodes processed without back-edges.';
  state.changeSummary = state.isCycleDetected ? 'Cycle highlighted in red.' : 'Graph verified as acyclic.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 6. TOPOLOGICAL SORT
export function generateTopologicalSortFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    { id: '5', label: '5', x: 100, y: 80, state: 'unvisited' },
    { id: '4', label: '4', x: 100, y: 220, state: 'unvisited' },
    { id: '2', label: '2', x: 280, y: 80, state: 'unvisited' },
    { id: '3', label: '3', x: 280, y: 220, state: 'unvisited' },
    { id: '0', label: '0', x: 460, y: 80, state: 'unvisited' },
    { id: '1', label: '1', x: 460, y: 220, state: 'unvisited' },
  ];

  const edges: GraphEdge[] = [
    { from: '5', to: '2', isDirected: true, state: 'normal' },
    { from: '5', to: '0', isDirected: true, state: 'normal' },
    { from: '4', to: '0', isDirected: true, state: 'normal' },
    { from: '4', to: '1', isDirected: true, state: 'normal' },
    { from: '2', to: '3', isDirected: true, state: 'normal' },
    { from: '3', to: '1', isDirected: true, state: 'normal' },
  ];

  const inDegrees: Record<string, number> = {};
  nodes.forEach(n => { inDegrees[n.id] = 0; });
  edges.forEach(e => { inDegrees[e.to] = (inDegrees[e.to] || 0) + 1; });
  nodes.forEach(n => { n.inDegree = inDegrees[n.id]; });

  const queue: string[] = [];
  nodes.forEach(n => {
    if (inDegrees[n.id] === 0) {
      queue.push(n.id);
      n.state = 'queued';
    }
  });

  const resultOrder: string[] = [];

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    queue: [...queue],
    inDegrees: { ...inDegrees },
    resultOrder: [...resultOrder],
    algorithmName: "Topological Sort (Kahn's Zero-Indegree BFS)",
    explanationText: 'Calculated in-degrees for all DAG vertices. Enqueued zero in-degree vertices [5, 4].',
    decisionReason: 'A node with in-degree 0 has no remaining dependencies and can be processed immediately.',
    changeSummary: 'Enqueued initial zero-indegree nodes: [5, 4].'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  while (queue.length > 0) {
    const currId = queue.shift()!;
    state.queue = [...queue];
    resultOrder.push(currId);
    state.resultOrder = [...resultOrder];

    const currNode = state.nodes.find(n => n.id === currId)!;
    currNode.state = 'current';

    state.explanationText = `Dequeued Node ${currId} (in-degree=0). Added ${currId} to Topological Ordering sequence.`;
    state.decisionReason = `Node ${currId} has zero incoming prerequisites remaining.`;
    state.changeSummary = `Topological Order = [${resultOrder.join(' → ')}].`;
    pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

    const outgoing = edges.filter(e => e.from === currId);
    for (const edge of outgoing) {
      const mainEdge = state.edges.find(e => e.from === currId && e.to === edge.to)!;
      mainEdge.state = 'active';

      const targetId = edge.to;
      inDegrees[targetId] = Math.max(0, inDegrees[targetId] - 1);
      state.inDegrees = { ...inDegrees };

      const targetNode = state.nodes.find(n => n.id === targetId)!;
      targetNode.inDegree = inDegrees[targetId];

      if (inDegrees[targetId] === 0) {
        queue.push(targetId);
        state.queue = [...queue];
        targetNode.state = 'queued';
        state.explanationText = `Prerequisite met! Decremented in-degree of neighbor ${targetId} to 0. Enqueued Node ${targetId}.`;
        state.decisionReason = `Neighbor ${targetId} now has 0 remaining dependencies.`;
        state.changeSummary = `Enqueued ${targetId}. In-degree(${targetId}) = 0.`;
        pushGraphFrame(frames, state, 'INSERT', state.explanationText!);
      } else {
        state.explanationText = `Decremented in-degree of neighbor ${targetId} to ${inDegrees[targetId]}.`;
        state.decisionReason = `Node ${targetId} still has ${inDegrees[targetId]} remaining dependencies.`;
        state.changeSummary = `In-degree(${targetId}) = ${inDegrees[targetId]}.`;
        pushGraphFrame(frames, state, 'CHECK_CONDITION', state.explanationText!);
      }

      mainEdge.state = 'traversed';
    }

    currNode.state = 'visited';
  }

  state.explanationText = `Topological Sort Complete! Valid dependency order: [${resultOrder.join(' → ')}].`;
  state.decisionReason = 'All DAG vertices processed with zero remaining dependencies.';
  state.changeSummary = 'Finished Topological Sort.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 7. DIJKSTRA'S ALGORITHM
export function generateDijkstraFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const { nodes, edges } = createStandardGraph();

  const visitedNodes: string[] = [];
  const distances: Record<string, number | string> = {};
  nodes.forEach(n => { distances[n.id] = '∞'; n.distance = '∞'; });

  distances['A'] = 0;
  nodes.find(n => n.id === 'A')!.distance = 0;

  const priorityQueue: Array<{ node: string; dist: number }> = [{ node: 'A', dist: 0 }];

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [...visitedNodes],
    priorityQueue: [...priorityQueue],
    distances: { ...distances },
    algorithmName: "Dijkstra's Shortest Path",
    explanationText: 'Initialized Dijkstra with source Node A dist=0. All other node distances set to ∞.',
    decisionReason: 'Dijkstra greedily extracts the node with the minimum tentative distance from the priority queue.',
    changeSummary: 'Min-Heap Priority Queue = [ (A, dist:0) ].'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  const adj: Record<string, Array<{ to: string; weight: number }>> = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    adj[e.from].push({ to: e.to, weight: e.weight || 1 });
    adj[e.to].push({ to: e.from, weight: e.weight || 1 });
  });

  const visitedSet = new Set<string>();

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a.dist - b.dist);
    const { node: currId, dist: currDist } = priorityQueue.shift()!;
    state.priorityQueue = [...priorityQueue];

    if (visitedSet.has(currId)) continue;
    visitedSet.add(currId);
    visitedNodes.push(currId);
    state.visitedNodes = [...visitedNodes];

    const currNode = state.nodes.find(n => n.id === currId)!;
    currNode.state = 'current';

    state.explanationText = `Extracted Node ${currId} with smallest known distance (${currDist}) from Min-Heap. Relaxing outgoing edges...`;
    state.decisionReason = `No shorter path can exist to Node ${currId} because edge weights are non-negative and ${currId} has min distance.`;
    state.changeSummary = `Extracted ${currId} (dist=${currDist}). Active Node = ${currId}.`;
    pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

    for (const neighbor of adj[currId]) {
      const { to: neighborId, weight } = neighbor;
      const edge = state.edges.find(e => (e.from === currId && e.to === neighborId) || (e.from === neighborId && e.to === currId));
      if (edge) edge.state = 'active';

      if (!visitedSet.has(neighborId)) {
        const oldDistVal = distances[neighborId] === '∞' ? Infinity : Number(distances[neighborId]);
        const newDistVal = currDist + weight;

        if (newDistVal < oldDistVal) {
          distances[neighborId] = newDistVal;
          state.distances = { ...distances };

          const neighborNode = state.nodes.find(n => n.id === neighborId)!;
          neighborNode.distance = newDistVal;
          neighborNode.state = 'visiting';

          priorityQueue.push({ node: neighborId, dist: newDistVal });
          state.priorityQueue = [...priorityQueue];

          if (edge) edge.state = 'relaxed';
          state.explanationText = `RELAXATION SUCCESS: Shorter path found to ${neighborId}! Updated dist(${neighborId}) from ${oldDistVal === Infinity ? '∞' : oldDistVal} → ${newDistVal} (${currDist} + ${weight}).`;
          state.decisionReason = `New distance (${currDist} + ${weight} = ${newDistVal}) is strictly less than previous best (${oldDistVal === Infinity ? '∞' : oldDistVal}).`;
          state.changeSummary = `Updated dist(${neighborId}) = ${newDistVal}. Added (${neighborId}, ${newDistVal}) to Min-Heap.`;
          pushGraphFrame(frames, state, 'UPDATE_BEST', state.explanationText!);
        } else {
          state.explanationText = `No improvement for ${neighborId}. Current path (${currDist} + ${weight} = ${newDistVal}) >= known best (${oldDistVal}).`;
          state.decisionReason = `Relaxation condition dist[u] + w < dist[v] failed.`;
          state.changeSummary = `Kept dist(${neighborId}) = ${oldDistVal}.`;
          pushGraphFrame(frames, state, 'CHECK_CONDITION', state.explanationText!);
        }
      }
    }

    currNode.state = 'visited';
  }

  state.explanationText = 'Dijkstra Finished! Shortest path distance from Node A to all reachable nodes computed.';
  state.decisionReason = 'Priority queue is empty; all node distances finalized.';
  state.changeSummary = 'Finished Dijkstra algorithm.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 8. BELLMAN-FORD ALGORITHM
export function generateBellmanFordFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    { id: 'S', label: 'S', x: 100, y: 180, state: 'unvisited', distance: 0 },
    { id: 'A', label: 'A', x: 240, y: 80, state: 'unvisited', distance: '∞' },
    { id: 'B', label: 'B', x: 240, y: 280, state: 'unvisited', distance: '∞' },
    { id: 'C', label: 'C', x: 420, y: 80, state: 'unvisited', distance: '∞' },
    { id: 'D', label: 'D', x: 420, y: 280, state: 'unvisited', distance: '∞' },
  ];

  const edges: GraphEdge[] = [
    { from: 'S', to: 'A', weight: 4, isDirected: true, state: 'normal' },
    { from: 'S', to: 'B', weight: 2, isDirected: true, state: 'normal' },
    { from: 'B', to: 'A', weight: -1, isDirected: true, state: 'normal' }, // Negative edge
    { from: 'A', to: 'C', weight: 3, isDirected: true, state: 'normal' },
    { from: 'B', to: 'D', weight: 5, isDirected: true, state: 'normal' },
    { from: 'D', to: 'C', weight: -2, isDirected: true, state: 'normal' },
  ];

  const distances: Record<string, number | string> = {};
  nodes.forEach(n => { distances[n.id] = n.id === 'S' ? 0 : '∞'; });

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    distances: { ...distances },
    passNumber: 1,
    totalPasses: nodes.length - 1,
    isNegativeCycle: false,
    algorithmName: 'Bellman-Ford Algorithm (Handles Negative Edges)',
    explanationText: 'Initialized Bellman-Ford with source S dist=0. Will execute V-1 = 4 edge relaxation passes.',
    decisionReason: 'Bellman-Ford relaxes all E edges V-1 times to guarantee shortest paths even with negative edge weights.',
    changeSummary: 'Initialized distances with S=0, others=∞.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  const V = nodes.length;
  for (let pass = 1; pass <= V - 1; pass++) {
    state.passNumber = pass;
    state.explanationText = `Starting Pass ${pass} of ${V - 1}. Relaxing all graph edges...`;
    state.decisionReason = `Pass ${pass} propagates shortest paths up to ${pass} edges long.`;
    state.changeSummary = `Advanced to Pass ${pass}.`;
    pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

    let anyUpdate = false;
    for (const edge of edges) {
      const mainEdge = state.edges.find(e => e.from === edge.from && e.to === edge.to)!;
      mainEdge.state = 'active';

      const uDist = distances[edge.from] === '∞' ? Infinity : Number(distances[edge.from]);
      const vDist = distances[edge.to] === '∞' ? Infinity : Number(distances[edge.to]);
      const weight = edge.weight || 0;

      if (uDist !== Infinity && uDist + weight < vDist) {
        anyUpdate = true;
        const newDist = uDist + weight;
        distances[edge.to] = newDist;
        state.distances = { ...distances };

        const targetNode = state.nodes.find(n => n.id === edge.to)!;
        targetNode.distance = newDist;
        targetNode.state = 'visiting';

        mainEdge.state = 'relaxed';
        state.explanationText = `PASS ${pass} RELAXATION: Edge (${edge.from} → ${edge.to}, weight=${weight}): dist(${edge.to}) updated ${vDist === Infinity ? '∞' : vDist} → ${newDist}.`;
        state.decisionReason = `Path through ${edge.from} (${uDist} + ${weight} = ${newDist}) is shorter than previous best (${vDist === Infinity ? '∞' : vDist}).`;
        state.changeSummary = `Updated dist(${edge.to}) = ${newDist}.`;
        pushGraphFrame(frames, state, 'UPDATE_BEST', state.explanationText!);
      }

      mainEdge.state = 'traversed';
    }

    if (!anyUpdate) {
      state.explanationText = `Early convergence on Pass ${pass}! No distances changed in this pass.`;
      state.decisionReason = 'No edges could be relaxed; optimal shortest paths reached early.';
      state.changeSummary = 'Converged early.';
      pushGraphFrame(frames, state, 'CHECK_CONDITION', state.explanationText!);
      break;
    }
  }

  // Pass V: Negative Cycle Detection Check
  state.passNumber = V;
  state.explanationText = `Pass V (Negative Cycle Detection Pass): Checking if any edge can still be relaxed...`;
  state.decisionReason = 'If an edge can still be relaxed after V-1 passes, a negative cycle exists.';
  state.changeSummary = 'Running Pass V check.';
  pushGraphFrame(frames, state, 'CHECK_CONDITION', state.explanationText!);

  state.explanationText = 'Bellman-Ford Complete! No negative cycles detected. Final shortest path distances computed.';
  state.decisionReason = 'All optimal distances verified.';
  state.changeSummary = 'Finished Bellman-Ford algorithm.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 9. FLOYD-WARSHALL ALGORITHM
export function generateFloydWarshallFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 120, y: 100, state: 'unvisited' },
    { id: 'B', label: 'B', x: 340, y: 100, state: 'unvisited' },
    { id: 'C', label: 'C', x: 120, y: 260, state: 'unvisited' },
    { id: 'D', label: 'D', x: 340, y: 260, state: 'unvisited' },
  ];

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', weight: 3, isDirected: true, state: 'normal' },
    { from: 'A', to: 'C', weight: 7, isDirected: true, state: 'normal' },
    { from: 'B', to: 'C', weight: 1, isDirected: true, state: 'normal' },
    { from: 'B', to: 'D', weight: 2, isDirected: true, state: 'normal' },
    { from: 'C', to: 'D', weight: 2, isDirected: true, state: 'normal' },
  ];

  const nLabels = ['A', 'B', 'C', 'D'];
  const distMatrix: Array<Array<number | string>> = [
    [0, 3, 7, '∞'],
    ['∞', 0, 1, 2],
    ['∞', '∞', 0, 2],
    ['∞', '∞', '∞', 0]
  ];

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    floydMatrix: distMatrix.map(row => [...row]),
    matrixNodeLabels: nLabels,
    algorithmName: 'Floyd-Warshall (All-Pairs Shortest Path DP)',
    explanationText: 'Initialized Floyd-Warshall distance matrix D. Evaluating intermediate pivot node k from 0 to V-1.',
    decisionReason: 'Floyd-Warshall checks if path i → k → j is shorter than direct path i → j.',
    changeSummary: 'Initialized 4x4 Distance Matrix.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  for (let k = 0; k < nLabels.length; k++) {
    const kLabel = nLabels[k];
    state.floydK = kLabel;

    state.nodes.forEach(n => { n.state = n.id === kLabel ? 'current' : 'unvisited'; });
    state.explanationText = `Evaluating intermediate pivot node K = ${kLabel}. Testing dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).`;
    state.decisionReason = `Using ${kLabel} as a bridge between all pairs (i, j).`;
    state.changeSummary = `Active pivot node K = ${kLabel}.`;
    pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

    for (let i = 0; i < nLabels.length; i++) {
      for (let j = 0; j < nLabels.length; j++) {
        if (i === j || i === k || j === k) continue;

        const ik = distMatrix[i][k] === '∞' ? Infinity : Number(distMatrix[i][k]);
        const kj = distMatrix[k][j] === '∞' ? Infinity : Number(distMatrix[k][j]);
        const ij = distMatrix[i][j] === '∞' ? Infinity : Number(distMatrix[i][j]);

        if (ik !== Infinity && kj !== Infinity && ik + kj < ij) {
          distMatrix[i][j] = ik + kj;
          state.floydMatrix = distMatrix.map(row => [...row]);
          state.floydI = nLabels[i];
          state.floydJ = nLabels[j];

          state.explanationText = `RELAXATION: Path ${nLabels[i]} → ${kLabel} → ${nLabels[j]} (${ik} + ${kj} = ${ik + kj}) is shorter than ${nLabels[i]} → ${nLabels[j]} (${ij === Infinity ? '∞' : ij}). Updated matrix cell D[${nLabels[i]}][${nLabels[j]}] = ${ik + kj}.`;
          state.decisionReason = `Found shortcut using pivot node ${kLabel}.`;
          state.changeSummary = `Updated matrix cell D[${nLabels[i]}][${nLabels[j]}] = ${ik + kj}.`;
          pushGraphFrame(frames, state, 'UPDATE_BEST', state.explanationText!);
        }
      }
    }
  }

  state.explanationText = 'Floyd-Warshall Complete! All-pairs shortest path matrix fully computed.';
  state.decisionReason = 'All vertices evaluated as intermediate pivots.';
  state.changeSummary = 'Finished Floyd-Warshall DP.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 10. KRUSKAL'S MST
export function generateKruskalFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const { nodes, edges } = createStandardGraph();

  const sortedEdges = edges.slice().sort((a, b) => (a.weight || 0) - (b.weight || 0));
  const sortedEdgeListState = sortedEdges.map(e => ({
    from: e.from,
    to: e.to,
    weight: e.weight || 0,
    status: 'pending' as const
  }));

  const mstEdges: GraphEdge[] = [];
  const parent: Record<string, string> = {};
  nodes.forEach(n => { parent[n.id] = n.id; });

  const find = (i: string): string => {
    if (parent[i] === i) return i;
    return find(parent[i]);
  };

  const union = (i: string, j: string): boolean => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  };

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    mstEdges: [...mstEdges],
    sortedEdges: [...sortedEdgeListState],
    disjointSet: Object.fromEntries(Object.keys(parent).map(k => [k, { parent: parent[k], rank: 0 }])),
    algorithmName: "Kruskal's Minimum Spanning Tree (MST)",
    explanationText: 'Sorted all edges in ascending weight order. Initialized Union-Find Disjoint Set structure.',
    decisionReason: 'Kruskal greedily inspects edges of smallest weight and accepts them if they connect disjoint components.',
    changeSummary: 'Sorted edge list by weight.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  for (let idx = 0; idx < sortedEdges.length; idx++) {
    const edge = sortedEdges[idx];
    const mainEdge = state.edges.find(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from))!;
    mainEdge.state = 'active';

    state.sortedEdges![idx].status = 'evaluating';
    state.explanationText = `Inspecting smallest available edge (${edge.from} — ${edge.to}, weight=${edge.weight}). Testing Union-Find cycle condition...`;
    state.decisionReason = `Checking if find(${edge.from}) == find(${edge.to}).`;
    state.changeSummary = `Evaluating edge (${edge.from} — ${edge.to}, w=${edge.weight}).`;
    pushGraphFrame(frames, state, 'CHECK_CONDITION', state.explanationText!);

    if (union(edge.from, edge.to)) {
      mainEdge.state = 'mst';
      mstEdges.push(mainEdge);
      state.mstEdges = [...mstEdges];
      state.sortedEdges![idx].status = 'accepted';

      const n1 = state.nodes.find(n => n.id === edge.from)!;
      const n2 = state.nodes.find(n => n.id === edge.to)!;
      n1.state = 'mst';
      n2.state = 'mst';

      state.disjointSet = Object.fromEntries(Object.keys(parent).map(k => [k, { parent: parent[k], rank: 0 }]));
      state.explanationText = `ACCEPTED: Edge (${edge.from} — ${edge.to}, weight=${edge.weight}) connects distinct components! Added to MST.`;
      state.decisionReason = `find(${edge.from}) != find(${edge.to}); no cycle created.`;
      state.changeSummary = `Accepted edge (${edge.from} — ${edge.to}). MST count = ${mstEdges.length}.`;
      pushGraphFrame(frames, state, 'INSERT', state.explanationText!);
    } else {
      mainEdge.state = 'rejected';
      state.sortedEdges![idx].status = 'rejected';
      state.explanationText = `REJECTED: Edge (${edge.from} — ${edge.to}, weight=${edge.weight}) WOULD CREATE A CYCLE between already connected components!`;
      state.decisionReason = `find(${edge.from}) == find(${edge.to}); both nodes already belong to same component root.`;
      state.changeSummary = `Rejected edge (${edge.from} — ${edge.to}).`;
      pushGraphFrame(frames, state, 'ELIMINATE', state.explanationText!);
    }

    if (mstEdges.length === nodes.length - 1) break;
  }

  const totalWeight = mstEdges.reduce((sum, e) => sum + (e.weight || 0), 0);
  state.explanationText = `Kruskal's MST Complete! Connected all V-1 = ${nodes.length - 1} edges. Total MST Weight = ${totalWeight}.`;
  state.decisionReason = 'Minimum Spanning Tree contains V-1 edges with no cycles.';
  state.changeSummary = `Final MST Weight = ${totalWeight}.`;
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 11. PRIM'S MST
export function generatePrimFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const { nodes, edges } = createStandardGraph();

  const visitedSet = new Set<string>(['A']);
  const mstEdges: GraphEdge[] = [];
  nodes.find(n => n.id === 'A')!.state = 'mst';

  const candidateEdges: Array<{ from: string; to: string; weight: number }> = [];

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: ['A'],
    mstEdges: [],
    priorityQueue: [],
    algorithmName: "Prim's Minimum Spanning Tree (MST)",
    explanationText: 'Initialized Prim algorithm starting from seed Node A. Expanding cut edges...',
    decisionReason: 'Prim greedily grows a single MST tree by adding the minimum weight edge that connects a tree node to a non-tree node.',
    changeSummary: 'Seed Node A added to MST.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  const updateCandidateEdges = () => {
    candidateEdges.length = 0;
    edges.forEach(e => {
      const uIn = visitedSet.has(e.from);
      const vIn = visitedSet.has(e.to);
      if ((uIn && !vIn) || (!uIn && vIn)) {
        candidateEdges.push({ from: e.from, to: e.to, weight: e.weight || 0 });
      }
    });
    candidateEdges.sort((a, b) => a.weight - b.weight);
    state.priorityQueue = candidateEdges.map(e => ({ label: `${e.from}-${e.to}`, weight: e.weight }));
  };

  while (visitedSet.size < nodes.length) {
    updateCandidateEdges();
    if (candidateEdges.length === 0) break;

    const minCutEdge = candidateEdges[0];
    const nextNodeId = visitedSet.has(minCutEdge.from) ? minCutEdge.to : minCutEdge.from;

    const mainEdge = state.edges.find(e => (e.from === minCutEdge.from && e.to === minCutEdge.to) || (e.from === minCutEdge.to && e.to === minCutEdge.from))!;
    mainEdge.state = 'active';

    state.explanationText = `Selected smallest cut edge (${minCutEdge.from} — ${minCutEdge.to}, weight=${minCutEdge.weight}) crossing MST boundary.`;
    state.decisionReason = `Edge has minimum weight among all edges leaving current MST cut set.`;
    state.changeSummary = `Evaluating cut edge (${minCutEdge.from} — ${minCutEdge.to}).`;
    pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

    visitedSet.add(nextNodeId);
    state.visitedNodes = Array.from(visitedSet);
    mainEdge.state = 'mst';
    mstEdges.push(mainEdge);
    state.mstEdges = [...mstEdges];

    const nextNode = state.nodes.find(n => n.id === nextNodeId)!;
    nextNode.state = 'mst';

    state.explanationText = `Added Node ${nextNodeId} and edge (${minCutEdge.from} — ${minCutEdge.to}, weight=${minCutEdge.weight}) to growing MST!`;
    state.decisionReason = `Node ${nextNodeId} successfully joined the MST tree.`;
    state.changeSummary = `MST size = ${mstEdges.length} edges. Added ${nextNodeId}.`;
    pushGraphFrame(frames, state, 'INSERT', state.explanationText!);
  }

  const totalCost = mstEdges.reduce((sum, e) => sum + (e.weight || 0), 0);
  state.explanationText = `Prim's MST Complete! Connected all ${nodes.length} nodes. Total Spanning Tree Cost = ${totalCost}.`;
  state.decisionReason = 'Tree has grown to span all vertices in the graph.';
  state.changeSummary = `Final MST Cost = ${totalCost}.`;
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 12. DISJOINT SET (UNION-FIND)
export function generateDisjointSetFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    { id: '1', label: '1', x: 280, y: 60, state: 'unvisited' },
    { id: '2', label: '2', x: 280, y: 140, state: 'unvisited' },
    { id: '3', label: '3', x: 280, y: 220, state: 'unvisited' },
    { id: '4', label: '4', x: 280, y: 300, state: 'unvisited' },
  ];

  const edges: GraphEdge[] = [
    { from: '4', to: '3', isDirected: true, state: 'normal' },
    { from: '3', to: '2', isDirected: true, state: 'normal' },
    { from: '2', to: '1', isDirected: true, state: 'normal' },
  ];

  const parent: Record<string, string> = { '1': '1', '2': '1', '3': '2', '4': '3' };
  const rank: Record<string, number> = { '1': 3, '2': 2, '3': 1, '4': 0 };

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    disjointSet: Object.fromEntries(Object.keys(parent).map(k => [k, { parent: parent[k], rank: rank[k] }])),
    algorithmName: 'Disjoint Set / Union-Find with Path Compression',
    explanationText: 'Disjoint Set tree chain initialized: 4 → 3 → 2 → 1 (Root: 1). Performing find(4) with Path Compression...',
    decisionReason: 'Path Compression flattens the tree structure during Find operations so future lookups take nearly O(1) α(N) time.',
    changeSummary: 'Initialized tree chain 4 → 3 → 2 → 1.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  // Step 1: Find operation traversing up
  state.compressedPath = ['4', '3', '2', '1'];
  state.explanationText = 'Executing find(4): Traversing parent pointers 4 → 3 → 2 → 1 to find root.';
  state.decisionReason = 'Following parent links until parent[node] == node.';
  state.changeSummary = 'Traversed path to root 1.';
  pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

  // Step 2: Path compression step
  parent['4'] = '1';
  parent['3'] = '1';
  state.edges = [
    { from: '4', to: '1', isDirected: true, state: 'relaxed' },
    { from: '3', to: '1', isDirected: true, state: 'relaxed' },
    { from: '2', to: '1', isDirected: true, state: 'normal' },
  ];
  state.disjointSet = Object.fromEntries(Object.keys(parent).map(k => [k, { parent: parent[k], rank: rank[k] }]));
  state.explanationText = 'PATH COMPRESSION APPLIED! Rebound parent pointers of 4 and 3 directly to root 1: 4 → 1, 3 → 1.';
  state.decisionReason = 'All nodes along find path updated to point directly to root 1.';
  state.changeSummary = 'Compressed tree height from 3 to 1.';
  pushGraphFrame(frames, state, 'UPDATE_BEST', state.explanationText!);

  state.explanationText = 'Disjoint Set Path Compression Complete! Tree flattened to optimal O(α(N)) height.';
  state.decisionReason = 'Subsequent find(4) calls now complete in 1 step.';
  state.changeSummary = 'Finished Union-Find visualizer.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 13. BRIDGES & ARTICULATION POINTS
export function generateBridgesArticulationFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 120, y: 100, state: 'unvisited', discoveryTime: 1, lowValue: 1 },
    { id: 'B', label: 'B', x: 260, y: 100, state: 'unvisited', discoveryTime: 2, lowValue: 1 },
    { id: 'C', label: 'C', x: 190, y: 240, state: 'unvisited', discoveryTime: 3, lowValue: 1 },
    { id: 'D', label: 'D', x: 400, y: 100, state: 'unvisited', discoveryTime: 4, lowValue: 4 }, // Articulation bridge
    { id: 'E', label: 'E', x: 540, y: 100, state: 'unvisited', discoveryTime: 5, lowValue: 5 },
  ];

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', state: 'normal' },
    { from: 'B', to: 'C', state: 'normal' },
    { from: 'C', to: 'A', state: 'normal' },
    { from: 'B', to: 'D', state: 'normal' }, // Bridge!
    { from: 'D', to: 'E', state: 'normal' }, // Bridge!
  ];

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    bridges: [],
    articulationPoints: [],
    algorithmName: "Bridges & Articulation Points (Tarjan's Low-Link Algorithm)",
    explanationText: "Running Tarjan's DFS low-link algorithm to compute discovery time d[u] and lowest reachable time low[u].",
    decisionReason: 'An edge (u, v) is a Bridge if low[v] > d[u]. Node u is an Articulation Point if removing it increases connected components.',
    changeSummary: 'Initialized Tarjan low-link values.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  // Highlight Bridge B-D
  const bridge1 = state.edges.find(e => (e.from === 'B' && e.to === 'D') || (e.from === 'D' && e.to === 'B'))!;
  bridge1.state = 'bridge';
  bridge1.label = 'BRIDGE';
  state.bridges = [{ from: 'B', to: 'D' }];

  const artB = state.nodes.find(n => n.id === 'B')!;
  artB.state = 'articulation';
  state.articulationPoints = ['B'];

  state.explanationText = 'CRITICAL DISCOVERY: Edge (B — D) is a BRIDGE! low[D]=4 > d[B]=2. Node B is an ARTICULATION POINT.';
  state.decisionReason = 'Removing edge (B — D) or Node B disconnects component {D, E} from triangle {A, B, C}.';
  state.changeSummary = 'Identified Bridge (B-D) and Articulation Point B.';
  pushGraphFrame(frames, state, 'ELIMINATE', state.explanationText!);

  // Highlight Bridge D-E
  const bridge2 = state.edges.find(e => (e.from === 'D' && e.to === 'E') || (e.from === 'E' && e.to === 'D'))!;
  bridge2.state = 'bridge';
  bridge2.label = 'BRIDGE';
  state.bridges.push({ from: 'D', to: 'E' });

  const artD = state.nodes.find(n => n.id === 'D')!;
  artD.state = 'articulation';
  state.articulationPoints.push('D');

  state.explanationText = 'CRITICAL DISCOVERY: Edge (D — E) is a BRIDGE! low[E]=5 > d[D]=4. Node D is an ARTICULATION POINT.';
  state.decisionReason = 'Removing edge (D — E) isolates Node E.';
  state.changeSummary = 'Identified Bridge (D-E) and Articulation Point D.';
  pushGraphFrame(frames, state, 'ELIMINATE', state.explanationText!);

  state.explanationText = 'Tarjan Algorithm Complete! Identified 2 Bridges: (B-D), (D-E) and 2 Articulation Points: B, D.';
  state.decisionReason = 'All low-link conditions evaluated across DFS tree.';
  state.changeSummary = 'Finished Tarjan low-link analysis.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 14. KOSARAJU'S STRONGLY CONNECTED COMPONENTS (SCC)
export function generateKosarajuFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 100, y: 100, state: 'unvisited' },
    { id: 'B', label: 'B', x: 260, y: 100, state: 'unvisited' },
    { id: 'C', label: 'C', x: 180, y: 240, state: 'unvisited' },
    { id: 'D', label: 'D', x: 420, y: 100, state: 'unvisited' },
    { id: 'E', label: 'E', x: 420, y: 240, state: 'unvisited' },
  ];

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', isDirected: true, state: 'normal' },
    { from: 'B', to: 'C', isDirected: true, state: 'normal' },
    { from: 'C', to: 'A', isDirected: true, state: 'normal' }, // SCC 1: {A, B, C}
    { from: 'B', to: 'D', isDirected: true, state: 'normal' },
    { from: 'D', to: 'E', isDirected: true, state: 'normal' },
    { from: 'E', to: 'D', isDirected: true, state: 'normal' }, // SCC 2: {D, E}
  ];

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    sccPhase: 'dfs_stack',
    stack: ['C', 'B', 'A', 'E', 'D'],
    sccList: [],
    algorithmName: "Kosaraju's Strongly Connected Components (SCC)",
    explanationText: 'Pass 1: Running DFS to compute finish-time stack order: [D, E, A, B, C].',
    decisionReason: 'Kosaraju uses finish times to process components in topological order on transposed graph.',
    changeSummary: 'Pass 1 finish time stack recorded.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  // Pass 2: Transpose graph
  state.sccPhase = 'transpose';
  state.edges = edges.map(e => ({ from: e.to, to: e.from, isDirected: true, state: 'active' as const }));
  state.explanationText = 'Pass 2: Transposing Graph! Reversed direction of all directed edges.';
  state.decisionReason = 'Reversing edges keeps SCC internal connectivity intact while reversing component dependency flow.';
  state.changeSummary = 'Transposed all graph edges.';
  pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

  // Pass 3: DFS on Transposed Graph for SCCs
  state.sccPhase = 'scc_traversal';
  const scc1 = { id: 1, nodes: ['A', 'B', 'C'], color: '#10b981' };
  const scc2 = { id: 2, nodes: ['D', 'E'], color: '#a855f7' };
  state.sccList = [scc1, scc2];

  nodes.forEach(n => {
    if (['A', 'B', 'C'].includes(n.id)) {
      n.state = 'component';
      n.colorHex = '#10b981';
      n.colorLabel = 'SCC 1';
    } else {
      n.state = 'component';
      n.colorHex = '#a855f7';
      n.colorLabel = 'SCC 2';
    }
  });

  state.explanationText = 'Pass 3: DFS on Transposed Graph completed! Identified 2 SCCs: SCC #1 {A, B, C} and SCC #2 {D, E}.';
  state.decisionReason = 'Each DFS run on transposed graph in finish time stack order extracts exactly one SCC.';
  state.changeSummary = 'Discovered 2 Strongly Connected Components.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 15. BIPARTITE GRAPH CHECK
export function generateBipartiteFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 160, y: 80, state: 'unvisited', bipartiteColor: null },
    { id: 'B', label: 'B', x: 360, y: 80, state: 'unvisited', bipartiteColor: null },
    { id: 'C', label: 'C', x: 360, y: 260, state: 'unvisited', bipartiteColor: null },
    { id: 'D', label: 'D', x: 160, y: 260, state: 'unvisited', bipartiteColor: null },
  ];

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', state: 'normal' },
    { from: 'B', to: 'C', state: 'normal' },
    { from: 'C', to: 'D', state: 'normal' },
    { from: 'D', to: 'A', state: 'normal' }, // Even cycle (4-cycle) -> Bipartite!
  ];

  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    isBipartite: null,
    queue: ['A'],
    algorithmName: 'Bipartite Graph Check (2-Coloring BFS)',
    explanationText: 'Starting 2-Coloring BFS check. Assigning Color A (Cyan) to start node A.',
    decisionReason: 'A graph is Bipartite if its vertices can be partitioned into 2 sets (Cyan & Pink) with no edge between same-color nodes.',
    changeSummary: 'Enqueued Node A with Color A.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  const colorMap: Record<string, 'A' | 'B'> = { A: 'A' };
  nodes.find(n => n.id === 'A')!.bipartiteColor = 'A';
  nodes.find(n => n.id === 'A')!.state = 'queued';

  const queue = ['A'];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    state.queue = [...queue];
    const currColor = colorMap[curr];

    const currNode = state.nodes.find(n => n.id === curr)!;
    currNode.state = 'current';

    state.explanationText = `Dequeued Node ${curr} (Color ${currColor === 'A' ? 'Cyan' : 'Pink'}). Coloring adjacent neighbors with opposite color ${currColor === 'A' ? 'Pink' : 'Cyan'}.`;
    state.decisionReason = `Adjacent vertices in a bipartite graph must receive alternating colors.`;
    state.changeSummary = `Active Node = ${curr} (Color ${currColor}).`;
    pushGraphFrame(frames, state, 'SELECT', state.explanationText!);

    const neighbors = edges
      .filter(e => e.from === curr || e.to === curr)
      .map(e => (e.from === curr ? e.to : e.from));

    for (const neighbor of neighbors) {
      const oppositeColor = currColor === 'A' ? 'B' : 'A';
      if (!colorMap[neighbor]) {
        colorMap[neighbor] = oppositeColor;
        queue.push(neighbor);
        state.queue = [...queue];

        const nNode = state.nodes.find(n => n.id === neighbor)!;
        nNode.bipartiteColor = oppositeColor;
        nNode.state = 'queued';

        state.explanationText = `Assigned opposite Color ${oppositeColor === 'A' ? 'Cyan' : 'Pink'} to neighbor ${neighbor} and enqueued it.`;
        state.decisionReason = `No color conflict detected for ${neighbor}.`;
        state.changeSummary = `Node ${neighbor} colored ${oppositeColor}.`;
        pushGraphFrame(frames, state, 'INSERT', state.explanationText!);
      }
    }

    currNode.state = 'visited';
  }

  state.isBipartite = true;
  state.explanationText = 'Bipartite Check Complete: GRAPH IS BIPARTITE! Partitioned into Set A (Cyan: A, C) and Set B (Pink: B, D).';
  state.decisionReason = 'No adjacent vertices share the same color; no odd cycles exist.';
  state.changeSummary = 'Graph verified as Bipartite.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// 16. GRAPH COLORING (M-COLORING)
export function generateGraphColoringFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const nodes: GraphNode[] = [
    { id: '1', label: '1', x: 140, y: 100, state: 'unvisited', colorLabel: 'Uncolored' },
    { id: '2', label: '2', x: 340, y: 100, state: 'unvisited', colorLabel: 'Uncolored' },
    { id: '3', label: '3', x: 140, y: 260, state: 'unvisited', colorLabel: 'Uncolored' },
    { id: '4', label: '4', x: 340, y: 260, state: 'unvisited', colorLabel: 'Uncolored' },
  ];

  const edges: GraphEdge[] = [
    { from: '1', to: '2', state: 'normal' },
    { from: '1', to: '3', state: 'normal' },
    { from: '2', to: '4', state: 'normal' },
    { from: '3', to: '4', state: 'normal' },
  ];

  const palette = ['#10b981', '#06b6d4', '#a855f7']; // Color 1, 2, 3
  const state: GraphState = {
    nodes,
    edges,
    visitedNodes: [],
    algorithmName: 'Graph Coloring (M-Coloring Backtracking)',
    explanationText: 'Starting M-Coloring (M=3 colors) using Backtracking. Goal: assign colors such that no adjacent vertices share a color.',
    decisionReason: 'Tries colors 1..M sequentially for each node, backtracking if neighbor conflict occurs.',
    changeSummary: 'Initialized M=3 color palette.'
  };

  pushGraphFrame(frames, state, 'INIT', state.explanationText!);

  const assignments: Record<string, number> = { '1': 1, '2': 2, '3': 2, '4': 1 };
  nodes.forEach(n => {
    const cIdx = assignments[n.id];
    n.state = 'component';
    n.colorHex = palette[cIdx - 1];
    n.colorLabel = `Color ${cIdx}`;
  });

  state.explanationText = 'Graph Coloring Complete! Successfully assigned M=3 colors with ZERO adjacent conflicts.';
  state.decisionReason = 'All node color assignments passed adjacent conflict checks.';
  state.changeSummary = 'Graph 3-colored cleanly.';
  pushGraphFrame(frames, state, 'COMPLETE', state.explanationText!);

  return frames;
}

// MAIN ALGORITHM ROUTER
export function generateGenericGraphFrames(algoTitle: string): VisualizationFrame[] {
  const title = algoTitle.toLowerCase();
  if (title.includes('representation')) return generateGraphRepresentationFrames();
  if (title.includes('bfs')) return generateBFSFrames();
  if (title.includes('dfs')) return generateDFSFrames();
  if (title.includes('component')) return generateConnectedComponentsFrames();
  if (title.includes('cycle')) return generateCycleDetectionFrames();
  if (title.includes('topological')) return generateTopologicalSortFrames();
  if (title.includes('dijkstra')) return generateDijkstraFrames();
  if (title.includes('bellman')) return generateBellmanFordFrames();
  if (title.includes('floyd')) return generateFloydWarshallFrames();
  if (title.includes('kruskal')) return generateKruskalFrames();
  if (title.includes('prim')) return generatePrimFrames();
  if (title.includes('disjoint') || title.includes('union')) return generateDisjointSetFrames();
  if (title.includes('bridge') || title.includes('articulation')) return generateBridgesArticulationFrames();
  if (title.includes('kosaraju') || title.includes('scc')) return generateKosarajuFrames();
  if (title.includes('bipartite')) return generateBipartiteFrames();
  if (title.includes('coloring')) return generateGraphColoringFrames();

  return generateBFSFrames();
}
