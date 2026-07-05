export type ElementState =
  | 'normal'
  | 'comparing'
  | 'swapping'
  | 'selected'
  | 'sorted'
  | 'found'
  | 'out-of-range';

export interface VisualElement {
  id: string;
  value: number;
  state: ElementState;
  label?: string; // e.g., 'L', 'M', 'R', or 'curr, prev'
  displayValue?: string;
  isWindow?: boolean;
  nextId?: string | null;
  prevId?: string | null;
  leftId?: string | null;
  rightId?: string | null;
}

export type AlgorithmEventType =
  | 'INIT'
  | 'COMPARE'
  | 'SWAP'
  | 'NO_SWAP'
  | 'SELECT'
  | 'INSERT'
  | 'DIVIDE'
  | 'MERGE'
  | 'PIVOT'
  | 'PARTITION'
  | 'HEAPIFY'
  | 'EXTRACT'
  | 'PASS_COMPLETE'
  | 'SEARCH'
  | 'FOUND'
  | 'ELIMINATE'
  | 'SLIDE_WINDOW'
  | 'EXPAND_WINDOW'
  | 'SHRINK_WINDOW'
  | 'CHECK_CONDITION'
  | 'UPDATE_BEST'
  | 'CALL'
  | 'RETURN'
  | 'BASE_CASE'
  | 'COMPLETE';

export interface CallStackFrame {
  id: string;
  name: string;
  args: Record<string, string>;
  locals?: Record<string, string>;
  returnedValue?: string;
  isActive: boolean;
  status: 'pending' | 'resolving' | 'resolved';
}

export interface AlgorithmEvent {
  type: AlgorithmEventType;
  explanation: string;
}

export interface EducationalContext {
  action?: string;
  result?: string;
  why?: string;
  isMilestone?: boolean;
  overallProgress: number;
  phaseName: string;
  goal: string;
  totalPasses: number;
  currentPass: number;
}

export interface VisualizationFrame {
  elements: VisualElement[];
  grid?: VisualElement[][];
  event: AlgorithmEvent;
  /** @deprecated Use event.explanation — kept for backward compatibility */
  description?: string;
  context?: EducationalContext;
  callStack?: CallStackFrame[];
}

export type AlgorithmType =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap'
  | 'linear-search'
  | 'binary-search'
  | 'first-occurrence'
  | 'last-occurrence'
  | 'lower-bound'
  | 'upper-bound'
  | 'floor'
  | 'ceil'
  | 'search-insert-position'
  | 'jump-search'
  | 'interpolation-search'
  | 'exponential-search'
  | 'search-sorted-rotated'
  | 'search-on-answer'
  | 'monotonic-predicate'
  | 'sliding-window-maximum-sum'
  | 'sliding-window-average'
  | 'sliding-window-longest-substring'
  | 'sliding-window-minimum-sum'
  | 'factorial'
  | 'fibonacci'
  | 'sum-of-n'
  | 'reverse-array'
  | 'check-palindrome'
  | 'print-subsequences'
  | 'head-recursion'
  | 'tail-recursion'
  | 'tree-recursion'
  | 'indirect-recursion'
  | 'recursive-binary-search'
  | 'recursive-merge-sort'
  | 'recursive-quick-sort'
  | 'dfs-tree'
  | 'tree-traversals'
  | 'height-of-tree'
  | 'generate-parentheses'
  | 'n-queens'
  | 'rat-in-a-maze'
  | 'sudoku-solver'
  | 'generate-subsets'
  | 'generate-subsequences'
  | 'generate-permutations'
  | 'combination-sum'
  | 'combination-sum-ii'
  | 'letter-combinations'
  | 'palindrome-partitioning'
  | 'm-coloring'
  | 'restore-ip-addresses'
  | 'beautiful-arrangement'
  | 'singly-linked-list'
  | 'doubly-linked-list'
  | 'circular-linked-list'
  | 'll-insertions'
  | 'll-deletions'
  | 'll-reversal'
  | 'll-detect-cycle'
  | 'll-middle-node'
  | 'll-merge-two-lists'
  | 'll-reverse-k-groups'
  | 'lru-cache'
  | 'binary-tree'
  | 'bst'
  | 'avl-tree'
  | 'morris-traversal'
  | 'lca'
  | 'tree-diameter'
  | 'balanced-tree'
  | 'tree-views'
  | 'serialize-tree'
  | 'deserialize-tree';
