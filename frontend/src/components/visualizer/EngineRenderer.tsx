import type { VisualizationFrame, AlgorithmType, VisualElement } from '../../types/visualizer';
import { CallStackRenderer } from './CallStackRenderer';
import { ArrayRenderer } from './ArrayRenderer';
import { TreeRenderer } from './TreeRenderer';
import { GridRenderer } from './GridRenderer';
import { LinkedListRenderer } from './LinkedListRenderer';

interface Props {
  algorithm: AlgorithmType;
  frame?: VisualizationFrame;
  initialElements?: VisualElement[];
}

export const EngineRenderer = ({ algorithm, frame, initialElements }: Props) => {
  // If no frame yet, use initial elements to show the structure
  const elementsToRender = frame?.elements || initialElements || [];

  // Algorithms that need ONLY a Call Stack
  const pureCallStackAlgos = [
    'factorial', 'fibonacci', 'sum-of-n',
    'head-recursion', 'tail-recursion', 'tree-recursion', 'indirect-recursion'
  ];

  // Algorithms that need BOTH an Array and a Call Stack
  const arrayAndStackAlgos = [
    'reverse-array', 'check-palindrome', 'print-subsequences',
    'recursive-binary-search', 'recursive-merge-sort', 'recursive-quick-sort',
    'generate-parentheses', 'generate-subsets', 'generate-subsequences',
    'generate-permutations', 'combination-sum', 'combination-sum-ii',
    'letter-combinations', 'palindrome-partitioning', 'm-coloring',
    'restore-ip-addresses', 'beautiful-arrangement'
  ];

  // Algorithms that are just purely Arrays without a call stack (Sorting/Searching)
  const pureArrayAlgos = [
    'bubble', 'selection', 'insertion', 'merge', 'quick', 'heap',
    'linear-search', 'binary-search', 'first-occurrence', 'last-occurrence',
    'lower-bound', 'upper-bound', 'floor', 'ceil', 'search-insert-position',
    'jump-search', 'interpolation-search', 'exponential-search',
    'search-sorted-rotated', 'search-on-answer', 'monotonic-predicate',
    'sliding-window-maximum-sum', 'sliding-window-average',
    'sliding-window-longest-substring', 'sliding-window-minimum-sum'
  ];

  const linkedListAlgos = [
    'singly-linked-list', 'doubly-linked-list', 'circular-linked-list',
    'll-insertions', 'll-deletions', 'll-reversal', 'll-detect-cycle', 'll-middle-node',
    'll-merge-two-lists', 'll-reverse-k-groups', 'lru-cache'
  ];

  // Algorithms that need BOTH a Tree and a Call Stack
  const treeAndStackAlgos = [
    'dfs-tree', 'tree-traversals', 'height-of-tree',
    'binary-tree', 'bst', 'avl-tree', 'morris-traversal',
    'lca', 'tree-diameter', 'balanced-tree', 'tree-views',
    'serialize-tree', 'deserialize-tree'
  ];

  // Algorithms that need BOTH a Grid and a Call Stack
  const gridAndStackAlgos = [
    'n-queens', 'rat-in-a-maze', 'sudoku-solver', 'word-search'
  ];

  if (pureCallStackAlgos.includes(algorithm)) {
    return <CallStackRenderer callStack={frame?.callStack || []} />;
  }

  if (pureArrayAlgos.includes(algorithm)) {
    return <ArrayRenderer elements={elementsToRender} />;
  }

  if (linkedListAlgos.includes(algorithm)) {
    const isDoubly = algorithm === 'doubly-linked-list' || algorithm === 'lru-cache';
    const isCircular = algorithm === 'circular-linked-list' || algorithm === 'll-detect-cycle';
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LinkedListRenderer elements={elementsToRender} isDoubly={isDoubly} isCircular={isCircular} />
      </div>
    );
  }

  if (arrayAndStackAlgos.includes(algorithm)) {
    return (
      <div className="w-full flex flex-col gap-6">
        {/* Top: Array Visualization */}
        <div className="w-full bg-card/50 rounded-2xl border border-border p-4 shadow-sm flex items-center justify-center min-h-[160px]">
          <ArrayRenderer elements={elementsToRender} />
        </div>
        {/* Bottom: Call Stack */}
        <div className="w-full max-w-4xl mx-auto flex-1 overflow-auto min-h-[200px]">
          <CallStackRenderer callStack={frame?.callStack || []} />
        </div>
      </div>
    );
  }

  if (treeAndStackAlgos.includes(algorithm)) {
    return (
      <div className="w-full flex flex-col gap-6">
        {/* Top: Tree Visualization */}
        <div className="w-full bg-card/50 rounded-2xl border border-border p-4 shadow-sm flex items-center justify-center min-h-[250px]">
          <TreeRenderer elements={elementsToRender} />
        </div>
        {/* Bottom: Call Stack */}
        <div className="w-full max-w-4xl mx-auto flex-1 overflow-auto min-h-[200px]">
          <CallStackRenderer callStack={frame?.callStack || []} />
        </div>
      </div>
    );
  }

  if (gridAndStackAlgos.includes(algorithm)) {
    return (
      <div className="w-full flex flex-col gap-6">
        {/* Top: Grid Visualization */}
        <div className="w-full bg-card/50 rounded-2xl border border-border p-4 shadow-sm flex items-center justify-center min-h-[300px]">
          {frame?.grid ? <GridRenderer grid={frame.grid} /> : <div className="text-muted-foreground">Grid not initialized</div>}
        </div>
        {/* Bottom: Call Stack */}
        <div className="w-full max-w-4xl mx-auto flex-1 overflow-auto min-h-[200px]">
          <CallStackRenderer callStack={frame?.callStack || []} />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center p-8 bg-card border border-border rounded-3xl max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-2">Visualization Engine Under Construction</h3>
      <p className="text-muted-foreground text-sm">
        The specialized renderer for {algorithm} is being built in a later phase.
      </p>
    </div>
  );
};
