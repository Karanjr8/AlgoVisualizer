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

export type MergeSortStage =
  | 'STAGE_1_ORIGINAL'
  | 'STAGE_2_DIVIDE'
  | 'STAGE_3_TREE'
  | 'STAGE_4_COMPARE'
  | 'STAGE_5_TEMP'
  | 'STAGE_6_FINAL_MERGE';

export interface MergeTreeNode {
  id: string;
  label: string;
  range: [number, number];
  elements: VisualElement[];
  depth: number;
  status: 'active' | 'waiting' | 'base_case' | 'merged';
  parentId?: string;
}

export interface MergeSortState {
  stage: MergeSortStage;
  currentDepth: number;
  maxDepth: number;
  activeRange?: [number, number];
  midIndex?: number;
  leftSubarray?: VisualElement[];
  rightSubarray?: VisualElement[];
  tempArray?: VisualElement[];
  leftPointer?: number;
  rightPointer?: number;
  comparedPair?: [number, number];
  selectedForMerge?: VisualElement | null;
  mergedSubarray?: VisualElement[];
  treeNodes?: MergeTreeNode[];
  milestone?: string;
  currentActionText?: string;
  explanationText?: string;
}

export interface GreedyState {
  stepIndex?: number;
  phase?: string;
  activities?: Array<{ id: string; name?: string; start: number; end: number; selected?: boolean; discarded?: boolean; active?: boolean }>;
  knapsackItems?: Array<{ id: string; weight: number; value: number; ratio: number; takenFraction: number; active?: boolean }>;
  currentCapacity?: number;
  maxCapacity?: number;
  totalValue?: number;
  jobs?: Array<{ id: string; profit: number; deadline: number; status: 'pending' | 'scheduled' | 'skipped' | 'checking'; slotAssigned?: number }>;
  timeSlots?: Array<{ slot: number; jobId?: string; profit?: number }>;
  huffmanNodes?: Array<{ id: string; label: string; freq: number; code?: string; left?: string; right?: string; isMerged?: boolean }>;
  huffmanCodes?: Record<string, string>;
  trainEvents?: Array<{ time: number; type: 'arrival' | 'departure'; trainId: string }>;
  platformsCount?: number;
  maxPlatforms?: number;
  activeTrains?: string[];
  meetingRooms?: Array<{ roomId: number; currentMeeting?: string }>;
  intervals?: Array<{ id: string; start: number; end: number; status: 'normal' | 'selected' | 'removed' | 'merged' | 'comparing' }>;
  mergedIntervals?: Array<{ start: number; end: number }>;
  balloons?: Array<{ id: string; start: number; end: number; bursted?: boolean; arrowIndex?: number }>;
  arrows?: Array<{ pos: number; id: number }>;
  jumpArray?: number[];
  currentIndex?: number;
  maxReach?: number;
  currentWindow?: [number, number];
  nextWindowEnd?: number;
  jumpCount?: number;
  gasStations?: Array<{ gas: number; cost: number; net: number }>;
  currentTank?: number;
  startIndex?: number;
  candies?: number[];
  leftPassCandies?: number[];
  rightPassCandies?: number[];
  passPhase?: 'init' | 'left' | 'right' | 'complete';
  ropes?: number[];
  currentMergeCost?: number;
  totalCost?: number;
  heapItems?: Array<{ label: string; val: number }>;
  coinChoices?: Array<{ coin: number; remaining: number; status: 'picked' | 'rejected' | 'exploring' }>;
  targetCoins?: number;
  coinsUsed?: number[];
  reorganizeChar?: string;
  reorganizeResult?: string;
  ipoCapital?: number;
  ipoProfits?: number[];
}

export interface VisualizationFrame {
  elements: VisualElement[];
  grid?: VisualElement[][];
  event: AlgorithmEvent;
  /** @deprecated Use event.explanation — kept for backward compatibility */
  description?: string;
  context?: EducationalContext;
  callStack?: CallStackFrame[];
  mergeSortState?: MergeSortState;
  greedyState?: GreedyState;
  segmentTreeState?: any;
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
  | 'deserialize-tree'
  | 'heap-intro'
  | 'min-max-heap'
  | 'heap-operations'
  | 'priority-queue-design'
  | 'heap-sort'
  | 'kth-largest'
  | 'kth-smallest'
  | 'top-k-frequent'
  | 'k-closest-elements'
  | 'k-closest-points'
  | 'merge-k-sorted'
  | 'sliding-window-maximum'
  | 'task-scheduler'
  | 'median-data-stream'
  | 'trie-intro'
  | 'trie-node-structure'
  | 'trie-insert'
  | 'trie-search'
  | 'trie-prefix-search'
  | 'word-dictionary'
  | 'design-add-search'
  | 'longest-common-prefix'
  | 'replace-words'
  | 'search-suggestions-system'
  | 'word-search-ii'
  | 'autocomplete-system'
  | 'design-search-engine'
  | 'top-k-frequent-words'
  | 'contacts-app'
  | 'file-system-trie'
  | 'greedy-intro'
  | 'greedy-vs-brute-force'
  | 'greedy-vs-dp'
  | 'identify-greedy'
  | 'activity-selection'
  | 'fractional-knapsack'
  | 'job-sequencing'
  | 'huffman-encoding'
  | 'minimum-platforms'
  | 'meeting-rooms'
  | 'non-overlapping-intervals'
  | 'merge-intervals'
  | 'insert-interval'
  | 'minimum-arrows-balloons'
  | 'jump-game'
  | 'jump-game-ii'
  | 'gas-station'
  | 'candy-distribution'
  | 'task-scheduling-greedy'
  | 'ipo'
  | 'reorganize-string'
  | 'min-cost-connect-ropes'
  | 'greedy-scheduling'
  | 'segment-tree-intro'
  | 'build-segment-tree'
  | 'range-sum-query'
  | 'range-min-query'
  | 'range-max-query'
  | 'point-update'
  | 'range-update'
  | 'lazy-propagation'
  | 'range-assignment'
  | 'segment-tree-applications'
  | 'count-smaller-numbers'
  | 'skyline-problem'
  | 'fenwick-tree-intro'
  | 'prefix-sum-refresher'
  | 'why-bit-exists'
  | 'bit-structure'
  | 'lowbit-operation'
  | 'bit-point-update'
  | 'prefix-sum-query'
  | 'bit-range-sum-query'
  | 'coordinate-compression-bit'
  | 'count-inversions'
  | 'order-statistics-bit'
  | 'monotonic-stack-pattern'
  | 'monotonic-queue-pattern'
  | 'union-find-pattern'
  | 'sweep-line-pattern'
  | 'difference-array-pattern'
  | 'binary-search-on-answer-pattern'
  | 'bit-manipulation-patterns'
  | 'meet-in-the-middle-pattern'
  | 'topological-sort-patterns'
  | 'shortest-path-patterns'
  | 'mst-patterns'
  | 'state-compression-dp-pattern';
