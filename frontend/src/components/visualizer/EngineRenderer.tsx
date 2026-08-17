import type { VisualizationFrame, AlgorithmType, VisualElement } from '../../types/visualizer';
import { CallStackRenderer } from './CallStackRenderer';
import { ArrayRenderer } from './ArrayRenderer';
import { TreeRenderer } from './TreeRenderer';
import { GridRenderer } from './GridRenderer';
import { LinkedListRenderer } from './LinkedListRenderer';
import { MergeSortVisualizer } from './MergeSortVisualizer';

// Specialized Heap Visualizers
import { HeapStandardVisualizer } from './heap/HeapStandardVisualizer';
import { HeapSortVisualizer } from './heap/HeapSortVisualizer';
import { KthLargestVisualizer } from './heap/KthLargestVisualizer';
import { KthSmallestVisualizer } from './heap/KthSmallestVisualizer';
import { TopKFrequentVisualizer } from './heap/TopKFrequentVisualizer';
import { KClosestElementsVisualizer } from './heap/KClosestElementsVisualizer';
import { KClosestPointsVisualizer } from './heap/KClosestPointsVisualizer';
import { MergeKSortedListsVisualizer } from './heap/MergeKSortedListsVisualizer';
import { SlidingWindowMaxVisualizer } from './heap/SlidingWindowMaxVisualizer';
import { MedianStreamVisualizer } from './heap/MedianStreamVisualizer';
import { TaskSchedulerVisualizer } from './heap/TaskSchedulerVisualizer';
import { PriorityQueueDesignVisualizer } from './heap/PriorityQueueDesignVisualizer';

// Specialized Trie Visualizers
import { TrieStandardVisualizer } from './trie/TrieStandardVisualizer';
import { WordDictionaryVisualizer } from './trie/WordDictionaryVisualizer';
import { LongestCommonPrefixVisualizer } from './trie/LongestCommonPrefixVisualizer';
import { ReplaceWordsVisualizer } from './trie/ReplaceWordsVisualizer';
import { SearchSuggestionsVisualizer } from './trie/SearchSuggestionsVisualizer';
import { WordSearchIIVisualizer } from './trie/WordSearchIIVisualizer';
import { AutocompleteSystemVisualizer } from './trie/AutocompleteSystemVisualizer';
import { SearchEngineVisualizer } from './trie/SearchEngineVisualizer';
import { TopKFrequentWordsVisualizer } from './trie/TopKFrequentWordsVisualizer';
import { ContactsAppVisualizer } from './trie/ContactsAppVisualizer';
import { FileSystemTrieVisualizer } from './trie/FileSystemTrieVisualizer';

// Specialized Greedy Visualizers
import { GreedyCoinChangeVisualizer } from './greedy/GreedyCoinChangeVisualizer';
import { ActivitySelectionVisualizer } from './greedy/ActivitySelectionVisualizer';
import { FractionalKnapsackVisualizer } from './greedy/FractionalKnapsackVisualizer';
import { JobSequencingVisualizer } from './greedy/JobSequencingVisualizer';
import { HuffmanEncodingVisualizer } from './greedy/HuffmanEncodingVisualizer';
import { MinimumPlatformsVisualizer } from './greedy/MinimumPlatformsVisualizer';
import { MeetingRoomsVisualizer } from './greedy/MeetingRoomsVisualizer';
import { IntervalGreedyVisualizer } from './greedy/IntervalGreedyVisualizer';
import { ArrayGreedyVisualizer } from './greedy/ArrayGreedyVisualizer';
import { AdvancedGreedyVisualizer } from './greedy/AdvancedGreedyVisualizer';

// Specialized Segment Tree Visualizers
import { SegmentTreeIntroVisualizer } from './segmentTree/SegmentTreeIntroVisualizer';
import { SegmentTreeBuildVisualizer } from './segmentTree/SegmentTreeBuildVisualizer';
import { SegmentTreeQueryVisualizer } from './segmentTree/SegmentTreeQueryVisualizer';
import { SegmentTreeUpdateVisualizer } from './segmentTree/SegmentTreeUpdateVisualizer';
import { SegmentTreeLazyVisualizer } from './segmentTree/SegmentTreeLazyVisualizer';
import { SegmentTreeApplicationsVisualizer } from './segmentTree/SegmentTreeApplicationsVisualizer';

// Specialized Binary Indexed Tree (Fenwick) Visualizers
import { BITIntroVisualizer } from './bit/BITIntroVisualizer';
import { LowbitVisualizer } from './bit/LowbitVisualizer';
import { BITUpdateVisualizer } from './bit/BITUpdateVisualizer';
import { BITQueryVisualizer } from './bit/BITQueryVisualizer';
import { BITRangeQueryVisualizer } from './bit/BITRangeQueryVisualizer';
import { BITApplicationsVisualizer } from './bit/BITApplicationsVisualizer';

// Specialized Advanced Patterns Visualizers
import { MonotonicStackVisualizer } from './advanced/MonotonicStackVisualizer';
import { UnionFindVisualizer } from './advanced/UnionFindVisualizer';
import { SweepLineVisualizer } from './advanced/SweepLineVisualizer';
import { DifferenceArrayVisualizer } from './advanced/DifferenceArrayVisualizer';
import { BSOnAnswerVisualizer } from './advanced/BSOnAnswerVisualizer';

interface Props {
  algorithm: AlgorithmType;
  frame?: VisualizationFrame;
  initialElements?: VisualElement[];
}

export const EngineRenderer = ({ algorithm, frame, initialElements }: Props) => {
  const elementsToRender = frame?.elements || initialElements || [];

  // Specialized Advanced Patterns Visualizers
  if (algorithm === 'monotonic-stack-pattern' || algorithm === 'monotonic-queue-pattern') {
    return <MonotonicStackVisualizer frame={frame} />;
  }
  if (algorithm === 'union-find-pattern') {
    return <UnionFindVisualizer frame={frame} />;
  }
  if (algorithm === 'sweep-line-pattern') {
    return <SweepLineVisualizer frame={frame} />;
  }
  if (algorithm === 'difference-array-pattern') {
    return <DifferenceArrayVisualizer frame={frame} />;
  }
  if (algorithm === 'binary-search-on-answer-pattern') {
    return <BSOnAnswerVisualizer frame={frame} />;
  }

  // Specialized Binary Indexed Tree (Fenwick Tree) Visualizers
  if (algorithm === 'fenwick-tree-intro' || algorithm === 'prefix-sum-refresher' || algorithm === 'why-bit-exists' || algorithm === 'bit-structure') {
    return <BITIntroVisualizer frame={frame} />;
  }
  if (algorithm === 'lowbit-operation') {
    return <LowbitVisualizer frame={frame} />;
  }
  if (algorithm === 'bit-point-update') {
    return <BITUpdateVisualizer frame={frame} />;
  }
  if (algorithm === 'prefix-sum-query') {
    return <BITQueryVisualizer frame={frame} />;
  }
  if (algorithm === 'bit-range-sum-query') {
    return <BITRangeQueryVisualizer frame={frame} />;
  }
  if (algorithm === 'coordinate-compression-bit' || algorithm === 'count-inversions' || algorithm === 'order-statistics-bit') {
    return <BITApplicationsVisualizer algorithm={algorithm} frame={frame} />;
  }

  // Specialized Segment Tree Visualizers
  if (algorithm === 'segment-tree-intro') {
    return <SegmentTreeIntroVisualizer frame={frame} />;
  }
  if (algorithm === 'build-segment-tree') {
    return <SegmentTreeBuildVisualizer frame={frame} />;
  }
  if (algorithm === 'range-sum-query') {
    return <SegmentTreeQueryVisualizer defaultMode="sum" frame={frame} />;
  }
  if (algorithm === 'range-min-query') {
    return <SegmentTreeQueryVisualizer defaultMode="min" frame={frame} />;
  }
  if (algorithm === 'range-max-query') {
    return <SegmentTreeQueryVisualizer defaultMode="max" frame={frame} />;
  }
  if (algorithm === 'point-update') {
    return <SegmentTreeUpdateVisualizer frame={frame} />;
  }
  if (algorithm === 'range-update' || algorithm === 'lazy-propagation' || algorithm === 'range-assignment') {
    return <SegmentTreeLazyVisualizer frame={frame} />;
  }
  if (algorithm === 'segment-tree-applications' || algorithm === 'count-smaller-numbers' || algorithm === 'skyline-problem') {
    return <SegmentTreeApplicationsVisualizer algorithm={algorithm} frame={frame} />;
  }

  // Specialized Greedy Visualizers
  if (['greedy-intro', 'greedy-vs-brute-force', 'greedy-vs-dp', 'identify-greedy'].includes(algorithm)) {
    return <GreedyCoinChangeVisualizer frame={frame} />;
  }
  if (algorithm === 'activity-selection') {
    return <ActivitySelectionVisualizer frame={frame} />;
  }
  if (algorithm === 'fractional-knapsack') {
    return <FractionalKnapsackVisualizer frame={frame} />;
  }
  if (algorithm === 'job-sequencing') {
    return <JobSequencingVisualizer frame={frame} />;
  }
  if (algorithm === 'huffman-encoding') {
    return <HuffmanEncodingVisualizer frame={frame} />;
  }
  if (algorithm === 'minimum-platforms') {
    return <MinimumPlatformsVisualizer frame={frame} />;
  }
  if (algorithm === 'meeting-rooms') {
    return <MeetingRoomsVisualizer frame={frame} />;
  }
  if (['non-overlapping-intervals', 'merge-intervals', 'insert-interval', 'minimum-arrows-balloons'].includes(algorithm)) {
    return <IntervalGreedyVisualizer algorithm={algorithm} frame={frame} />;
  }
  if (['jump-game', 'jump-game-ii', 'gas-station', 'candy-distribution'].includes(algorithm)) {
    return <ArrayGreedyVisualizer algorithm={algorithm} frame={frame} />;
  }
  if (['task-scheduling-greedy', 'ipo', 'reorganize-string', 'min-cost-connect-ropes', 'greedy-scheduling'].includes(algorithm)) {
    return <AdvancedGreedyVisualizer algorithm={algorithm} frame={frame} />;
  }

  // Specialized Trie Visualizers
  if (algorithm === 'trie-intro' || algorithm === 'trie-node-structure' || algorithm === 'trie-insert' || algorithm === 'trie-search' || algorithm === 'trie-prefix-search') {
    return <TrieStandardVisualizer frame={frame} />;
  }
  if (algorithm === 'word-dictionary' || algorithm === 'design-add-search') {
    return <WordDictionaryVisualizer frame={frame} />;
  }
  if (algorithm === 'longest-common-prefix') {
    return <LongestCommonPrefixVisualizer frame={frame} />;
  }
  if (algorithm === 'replace-words') {
    return <ReplaceWordsVisualizer frame={frame} />;
  }
  if (algorithm === 'search-suggestions-system') {
    return <SearchSuggestionsVisualizer frame={frame} />;
  }
  if (algorithm === 'word-search-ii') {
    return <WordSearchIIVisualizer frame={frame} />;
  }
  if (algorithm === 'autocomplete-system') {
    return <AutocompleteSystemVisualizer frame={frame} />;
  }
  if (algorithm === 'design-search-engine') {
    return <SearchEngineVisualizer frame={frame} />;
  }
  if (algorithm === 'top-k-frequent-words') {
    return <TopKFrequentWordsVisualizer frame={frame} />;
  }
  if (algorithm === 'contacts-app') {
    return <ContactsAppVisualizer frame={frame} />;
  }
  if (algorithm === 'file-system-trie') {
    return <FileSystemTrieVisualizer frame={frame} />;
  }

  // Specialized Heap / Priority Queue Visualizers
  if (algorithm === 'heap-intro' || algorithm === 'heap-operations' || algorithm === 'heap') {
    return <HeapStandardVisualizer frame={frame} defaultType="max" />;
  }
  if (algorithm === 'min-max-heap') {
    return <HeapStandardVisualizer frame={frame} defaultType="min" />;
  }
  if (algorithm === 'heap-sort') {
    return <HeapSortVisualizer frame={frame} />;
  }
  if (algorithm === 'kth-largest') {
    return <KthLargestVisualizer frame={frame} />;
  }
  if (algorithm === 'kth-smallest') {
    return <KthSmallestVisualizer frame={frame} />;
  }
  if (algorithm === 'top-k-frequent') {
    return <TopKFrequentVisualizer frame={frame} />;
  }
  if (algorithm === 'k-closest-elements') {
    return <KClosestElementsVisualizer frame={frame} />;
  }
  if (algorithm === 'k-closest-points') {
    return <KClosestPointsVisualizer frame={frame} />;
  }
  if (algorithm === 'merge-k-sorted') {
    return <MergeKSortedListsVisualizer frame={frame} />;
  }
  if (algorithm === 'sliding-window-maximum') {
    return <SlidingWindowMaxVisualizer frame={frame} />;
  }
  if (algorithm === 'task-scheduler') {
    return <TaskSchedulerVisualizer frame={frame} />;
  }
  if (algorithm === 'median-data-stream') {
    return <MedianStreamVisualizer frame={frame} />;
  }
  if (algorithm === 'priority-queue-design') {
    return <PriorityQueueDesignVisualizer frame={frame} />;
  }

  // Specialized Merge Sort Renderer
  if (algorithm === 'merge' || algorithm === 'recursive-merge-sort') {
    return <MergeSortVisualizer frame={frame} />;
  }

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
    'bubble', 'selection', 'insertion', 'merge', 'quick',
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
        <div className="w-full bg-card/50 rounded-2xl border border-border p-4 shadow-sm flex items-center justify-center min-h-[160px]">
          <ArrayRenderer elements={elementsToRender} />
        </div>
        <div className="w-full max-w-4xl mx-auto flex-1 overflow-auto min-h-[200px]">
          <CallStackRenderer callStack={frame?.callStack || []} />
        </div>
      </div>
    );
  }

  if (treeAndStackAlgos.includes(algorithm)) {
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="w-full bg-card/50 rounded-2xl border border-border p-4 shadow-sm flex items-center justify-center min-h-[260px]">
          <TreeRenderer elements={elementsToRender} />
        </div>
        <div className="w-full max-w-4xl mx-auto flex-1 overflow-auto min-h-[180px]">
          <CallStackRenderer callStack={frame?.callStack || []} />
        </div>
      </div>
    );
  }

  if (gridAndStackAlgos.includes(algorithm)) {
    return (
      <div className="w-full flex flex-col lg:flex-row gap-6 items-center justify-center">
        <div className="flex-1 w-full bg-card/50 rounded-2xl border border-border p-4 shadow-sm flex items-center justify-center min-h-[300px]">
          <GridRenderer grid={frame?.grid || []} />
        </div>
        <div className="w-full lg:w-[360px] h-full overflow-auto min-h-[240px]">
          <CallStackRenderer callStack={frame?.callStack || []} />
        </div>
      </div>
    );
  }

  // Default Fallback: Array Renderer
  return <ArrayRenderer elements={elementsToRender} />;
};
