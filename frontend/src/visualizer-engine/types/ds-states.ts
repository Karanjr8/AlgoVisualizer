/**
 * Specialized State Models for Each Data Structure Engine.
 * Every data structure has an authentic, accurate representation.
 */

// ==================== ARRAY ====================
export interface ArrayCell {
  id: string;
  index: number;
  value: number;
  state: 'default' | 'current' | 'comparing' | 'swapping' | 'sorted' | 'found' | 'eliminated';
  pointers?: string[]; // e.g., ['i', 'j'], ['left', 'right', 'mid']
}

export interface ArrayVisualizerState {
  cells: ArrayCell[];
  comparisonsCount: number;
  swapsCount: number;
  activeWindow?: [number, number];
  pivotIndex?: number;
  sortedRange?: [number, number];
  message?: string;
}

// ==================== LINKED LIST ====================
export type LinkedListKind = 'singly' | 'doubly' | 'circular';

export interface LinkedListNode {
  id: string;
  value: number | string;
  nextId: string | null;
  prevId?: string | null;
  state: 'default' | 'active' | 'highlight' | 'new' | 'deleting' | 'visited';
  pointers?: string[]; // e.g. ['head', 'curr'], ['tail'], ['slow', 'fast']
}

export interface LinkedListVisualizerState {
  kind: LinkedListKind;
  nodes: LinkedListNode[];
  headId: string | null;
  tailId: string | null;
  fastPointerId?: string | null;
  slowPointerId?: string | null;
  length: number;
  message?: string;
}

// ==================== STACK & QUEUE ====================
export type StackQueueKind = 'stack' | 'queue' | 'circular-queue' | 'deque';

export interface StackQueueItem {
  id: string;
  value: number | string;
  state: 'default' | 'active' | 'pushed' | 'popped' | 'peeked' | 'front' | 'rear';
  label?: string;
}

export interface StackQueueVisualizerState {
  kind: StackQueueKind;
  capacity: number;
  items: StackQueueItem[];
  topIndex: number;
  frontIndex: number;
  rearIndex: number;
  overflow: boolean;
  underflow: boolean;
  message?: string;
}

// ==================== TREE & AVL ====================
export interface TreeNode {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
  parentId?: string | null;
  height: number;
  balanceFactor?: number;
  state: 'default' | 'active' | 'comparing' | 'rotating' | 'inserted' | 'deleted' | 'visited';
  level: number;
  x?: number;
  y?: number;
  role?: string;
  label?: string;
  hd?: number;
  inDiameter?: boolean;
  viewTag?: string;
  threadToId?: string | null;
}

export interface TreeVisualizerState {
  nodes: Record<string, TreeNode>;
  rootId: string | null;
  traversalOrder: number[];
  activePath: string[];
  rotationInfo?: {
    type: 'LL' | 'RR' | 'LR' | 'RL';
    pivotNodeId: string;
    description: string;
  };
  treeType: 'binary-tree' | 'bst' | 'avl' | 'full' | 'complete' | 'perfect' | 'degenerate';
  message?: string;
  threadEdges?: Array<{ from: string; to: string; id: string }>;
  activeEdgeId?: string | null;
  highlightEdges?: string[];
  diameterEdges?: string[];
  lcaEdges?: string[];
  serializedStream?: string;
  activeView?: 'top' | 'bottom' | 'left' | 'right' | null;
  viewNodes?: Record<string, number[]>;
  queue?: (number | string)[];
  callStack?: string[];
  activeComparison?: { value: number; comparedWith: number; result: string };
}

// ==================== GRAPH ====================
export interface GraphVertex {
  id: string;
  label: string;
  x: number;
  y: number;
  state: 'unvisited' | 'visiting' | 'visited' | 'current' | 'in-queue';
  distance?: number | string;
  predecessor?: string | null;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
  directed: boolean;
  state: 'default' | 'active' | 'traversed' | 'mst' | 'relaxed';
}

export interface GraphVisualizerState {
  vertices: GraphVertex[];
  edges: GraphEdge[];
  isDirected: boolean;
  isWeighted: boolean;
  visitedOrder: string[];
  activeEdgeId?: string | null;
  queueOrStack?: string[];
  message?: string;
}

// ==================== HASH TABLE ====================
export type CollisionResolutionMethod = 'separate-chaining' | 'linear-probing' | 'quadratic-probing' | 'double-hashing';

export interface HashEntry {
  id: string;
  key: string | number;
  value: any;
  hash: number;
  state: 'default' | 'probing' | 'collision' | 'inserted' | 'found' | 'deleted';
}

export interface HashBucket {
  index: number;
  entries: HashEntry[];
  isColliding?: boolean;
}

export interface HashTableVisualizerState {
  capacity: number;
  size: number;
  method: CollisionResolutionMethod;
  buckets: HashBucket[];
  currentProbeIndices: number[];
  lastCalculatedHash?: number;
  loadFactor: number;
  message?: string;
}

// ==================== HEAP & PRIORITY QUEUE ====================
export interface HeapVisualizerState {
  type: 'min-heap' | 'max-heap';
  arrayValues: number[];
  treeNodes: Record<string, TreeNode>;
  rootId: string | null;
  heapifyActivePair?: [number, number];
  extractedValue?: number | null;
  message?: string;
}

// ==================== TRIE (PREFIX TREE) ====================
export interface TrieNode {
  id: string;
  char: string;
  isEndOfWord: boolean;
  children: Record<string, string>; // char -> child node id
  state: 'default' | 'active' | 'matched' | 'end-of-word' | 'inserted';
  depth: number;
}

export interface TrieVisualizerState {
  nodes: Record<string, TrieNode>;
  rootId: string;
  currentSearchPrefix: string;
  matchedWords: string[];
  message?: string;
}

// ==================== RECURSION & BACKTRACKING ====================
export interface RecursionStackFrame {
  id: string;
  functionName: string;
  args: Record<string, any>;
  locals?: Record<string, any>;
  returnValue?: any;
  status: 'active' | 'waiting' | 'returned' | 'backtracked';
  depth: number;
}

export interface RecursionVisualizerState {
  callStack: RecursionStackFrame[];
  maxDepth: number;
  currentResult?: any;
  grid?: (number | string)[][]; // For N-Queens, Sudoku, Maze
  activeRow?: number;
  activeCol?: number;
  message?: string;
}

// ==================== DYNAMIC PROGRAMMING ====================
export interface DPTableCell {
  row: number;
  col: number;
  value: number | string | null;
  state: 'uncomputed' | 'active' | 'dependent' | 'computed' | 'optimal';
  formula?: string;
}

export interface DPVisualizerState {
  title: string;
  dimensions: '1D' | '2D';
  rowLabels: string[];
  colLabels: string[];
  cells: DPTableCell[][];
  activeCell?: { row: number; col: number };
  dependencyCells?: Array<{ row: number; col: number }>;
  memoValues?: Record<string, any>;
  optimalValue?: number | string;
  message?: string;
}

// ==================== DISJOINT SET UNION (DSU) ====================
export interface DSUElement {
  id: string;
  value: number;
  parentId: string;
  rank: number;
  size: number;
  state: 'default' | 'active' | 'representative' | 'compressing';
}

export interface DSUVisualizerState {
  elements: DSUElement[];
  componentsCount: number;
  unionPair?: [number, number];
  findPath?: number[];
  message?: string;
}

// ==================== SEGMENT TREE ====================
export interface SegmentTreeNode {
  id: string;
  range: [number, number];
  value: number;
  lazy?: number;
  leftId: string | null;
  rightId: string | null;
  state: 'default' | 'query-hit' | 'updating' | 'lazy-propagation';
}

export interface SegmentTreeVisualizerState {
  nodes: Record<string, SegmentTreeNode>;
  rootId: string;
  baseArray: number[];
  queryRange?: [number, number];
  operationType?: 'sum' | 'min' | 'max';
  message?: string;
}

// ==================== FENWICK TREE (BIT) ====================
export interface FenwickCell {
  index: number; // 1-based
  value: number;
  originalValue: number;
  lowbit: number;
  responsibleRange: [number, number];
  state: 'default' | 'active' | 'query-step' | 'update-step';
}

export interface FenwickTreeVisualizerState {
  cells: FenwickCell[];
  currentQuerySum?: number;
  activeIndices: number[];
  message?: string;
}
