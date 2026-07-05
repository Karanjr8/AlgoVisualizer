import type { AlgorithmType, VisualElement, VisualizationFrame } from '../../types/visualizer';
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';
import { heapSort } from './heapSort';
import { binarySearch } from './binarySearch';
import { linearSearch } from './linearSearch';
import { binarySearchVariations } from './binarySearchVariations';
import { jumpSearch, interpolationSearch, exponentialSearch } from './advancedSearching';
import { searchRotatedSortedArray, searchOnAnswer, monotonicPredicate } from './searchPatterns';
import { slidingWindowMaximumSum, slidingWindowAverage, slidingWindowLongestSubstring, slidingWindowMinimumSum } from './slidingWindow';
import { generateFactorialFrames, generateFibonacciFrames } from './recursion';
import { generateSumOfNFrames, generateReverseArrayFrames, generatePalindromeFrames, generateSubsequencesFrames } from './recursionArray';
import { generateHeadRecursionFrames, generateTailRecursionFrames, generateTreeRecursionFrames, generateIndirectRecursionFrames } from './recursionPatterns';
import { generateRecursiveBinarySearchFrames, generateRecursiveMergeSortFrames, generateRecursiveQuickSortFrames } from './recursionDivide';
import {
  generateDfsTreeFrames, generateHeightOfTreeFrames,
  generateTreeInorderFrames, generateTreePreorderFrames,
  generateTreePostorderFrames, generateTreeLevelOrderFrames
} from './recursionTree';
import { generateParenthesesFrames, generateNQueensFrames, generateRatInAMazeFrames, generateSudokuFrames } from './recursionBacktracking';
import { 
  generateSubsetsFrames, generatePermutationsFrames, generateCombinationSumFrames, 
  generateWordSearchFrames, generateLetterCombinationsFrames, generateGenericBacktrackingFrames 
} from './backtrackingGenerators';
import {
  generateSinglyLinkedListFrames, generateDoublyLinkedListFrames, generateLLReversalFrames,
  generateLLDetectCycleFrames, generateCircularLinkedListFrames, generateLLInsertionFrames,
  generateLLDeletionFrames, generateLLMiddleNodeFrames, generateLLMergeFrames, generateGenericLLFrames
} from './linkedListGenerators';
import {
  generateLCAFrames, generateGenericTreeFrames,
  generateBSTInsertFrames, generateBSTDeleteFrames, generateBSTSearchFrames
} from './treeGenerators';

export type AlgorithmGenerator = (
  elements: VisualElement[],
  options?: { searchTarget?: number },
) => VisualizationFrame[];

export const ALGORITHM_REGISTRY: Record<
  AlgorithmType,
  { label: string; generate: AlgorithmGenerator }
> = {
  bubble: { label: 'Bubble Sort', generate: (el: any) => bubbleSort(el) },
  selection: { label: 'Selection Sort', generate: (el: any) => selectionSort(el) },
  insertion: { label: 'Insertion Sort', generate: (el: any) => insertionSort(el) },
  merge: { label: 'Merge Sort', generate: (el: any) => mergeSort(el) },
  quick: { label: 'Quick Sort', generate: (el: any) => quickSort(el) },
  heap: { label: 'Heap Sort', generate: (el: any) => heapSort(el) },
  'linear-search': { label: 'Linear Search', generate: (el: any, options: any) => linearSearch(el, options?.searchTarget ?? el[0]?.value ?? 0) },
  'binary-search': { label: 'Binary Search', generate: (el: any, options: any) => binarySearch(el, options?.searchTarget ?? el[0]?.value ?? 0) },
  'first-occurrence': { label: 'First Occurrence', generate: (el: any, options: any) => binarySearchVariations(el, options?.searchTarget ?? el[0]?.value ?? 0, 'first-occurrence') },
  'last-occurrence': { label: 'Last Occurrence', generate: (el: any, options: any) => binarySearchVariations(el, options?.searchTarget ?? el[0]?.value ?? 0, 'last-occurrence') },
  'lower-bound': { label: 'Lower Bound', generate: (el: any, options: any) => binarySearchVariations(el, options?.searchTarget ?? el[0]?.value ?? 0, 'lower-bound') },
  'upper-bound': { label: 'Upper Bound', generate: (el: any, options: any) => binarySearchVariations(el, options?.searchTarget ?? el[0]?.value ?? 0, 'upper-bound') },
  'floor': { label: 'Floor', generate: (el: any, options: any) => binarySearchVariations(el, options?.searchTarget ?? el[0]?.value ?? 0, 'floor') },
  'ceil': { label: 'Ceil', generate: (el: any, options: any) => binarySearchVariations(el, options?.searchTarget ?? el[0]?.value ?? 0, 'ceil') },
  'search-insert-position': { label: 'Search Insert Position', generate: (el: any, options: any) => binarySearchVariations(el, options?.searchTarget ?? el[0]?.value ?? 0, 'search-insert-position') },
  'jump-search': { label: 'Jump Search', generate: (el: any, options: any) => jumpSearch(el, options?.searchTarget ?? el[0]?.value ?? 0) },
  'interpolation-search': { label: 'Interpolation Search', generate: (el: any, options: any) => interpolationSearch(el, options?.searchTarget ?? el[0]?.value ?? 0) },
  'exponential-search': { label: 'Exponential Search', generate: (el: any, options: any) => exponentialSearch(el, options?.searchTarget ?? el[0]?.value ?? 0) },
  'search-sorted-rotated': { label: 'Search in Rotated Sorted Array', generate: (el: any, options: any) => searchRotatedSortedArray(el, options?.searchTarget ?? el[0]?.value ?? 0) },
  'search-on-answer': { label: 'Search on Answer', generate: (el: any, options: any) => searchOnAnswer(el, options?.searchTarget ?? el[0]?.value ?? 0) },
  'monotonic-predicate': { label: 'Monotonic Predicate', generate: (el: any, options: any) => monotonicPredicate(el, options?.searchTarget ?? el[0]?.value ?? 0) },
  'sliding-window-maximum-sum': { label: 'Maximum Sum Subarray of Size K', generate: (el: any, options: any) => slidingWindowMaximumSum(el, options?.searchTarget ?? 3) },
  'sliding-window-average': { label: 'Average of Subarray of Size K', generate: (el: any, options: any) => slidingWindowAverage(el, options?.searchTarget ?? 3) },
  'sliding-window-longest-substring': { label: 'Longest Substring Without Repeating Characters', generate: (el: any) => slidingWindowLongestSubstring(el) },
  'sliding-window-minimum-sum': { label: 'Minimum Size Subarray Sum', generate: (el: any, options: any) => slidingWindowMinimumSum(el, options?.searchTarget ?? 20) },
  
  'factorial': { label: 'Factorial', generate: (el: any, options: any) => generateFactorialFrames(options?.searchTarget || 5) },
  'fibonacci': { label: 'Fibonacci Sequence', generate: (el: any, options: any) => generateFibonacciFrames(options?.searchTarget || 5) },
  
  'sum-of-n': { label: 'Sum of N', generate: (el: any, options: any) => generateSumOfNFrames(options?.searchTarget || el.length || 5) },
  'reverse-array': { label: 'Reverse Array', generate: (el: any) => generateReverseArrayFrames(el) },
  'check-palindrome': { label: 'Check Palindrome', generate: (el: any) => generatePalindromeFrames(el) },
  'print-subsequences': { label: 'Print Subsequences', generate: (el: any) => generateSubsequencesFrames(el) },
  
  'head-recursion': { label: 'Head Recursion', generate: (el: any, options: any) => generateHeadRecursionFrames(options?.searchTarget || el.length || 5) },
  'tail-recursion': { label: 'Tail Recursion', generate: (el: any, options: any) => generateTailRecursionFrames(options?.searchTarget || el.length || 5) },
  'tree-recursion': { label: 'Tree Recursion', generate: (el: any, options: any) => generateTreeRecursionFrames(options?.searchTarget || Math.min(el.length, 3)) },
  'indirect-recursion': { label: 'Indirect Recursion', generate: (el: any, options: any) => generateIndirectRecursionFrames(options?.searchTarget || el.length || 5) },
  
  'recursive-binary-search': { label: 'Recursive Binary Search', generate: (el: any, options: any) => generateRecursiveBinarySearchFrames(el, options?.searchTarget || el[0]?.value || 0) },
  'recursive-merge-sort': { label: 'Recursive Merge Sort', generate: (el: any) => generateRecursiveMergeSortFrames(el) },
  'recursive-quick-sort': { label: 'Recursive Quick Sort', generate: (el: any) => generateRecursiveQuickSortFrames(el) },
  
  'dfs-tree': { label: 'DFS on Tree', generate: () => generateDfsTreeFrames() },
  'tree-inorder': { label: 'Inorder Traversal', generate: () => generateTreeInorderFrames() },
  'tree-preorder': { label: 'Preorder Traversal', generate: () => generateTreePreorderFrames() },
  'tree-postorder': { label: 'Postorder Traversal', generate: () => generateTreePostorderFrames() },
  'tree-levelorder': { label: 'Level Order Traversal', generate: () => generateTreeLevelOrderFrames() },
  'height-of-tree': { label: 'Height of Tree', generate: () => generateHeightOfTreeFrames() },
  
  'generate-parentheses': { label: 'Generate Parentheses', generate: (el: any, options: any) => generateParenthesesFrames(options?.searchTarget || 3) },
  'n-queens': { label: 'N-Queens (4x4)', generate: () => generateNQueensFrames(4) },
  'rat-in-a-maze': { label: 'Rat in a Maze', generate: () => generateRatInAMazeFrames() },
  'sudoku-solver': { label: 'Sudoku Solver (4x4)', generate: () => generateSudokuFrames() },
  
  'generate-subsets': { label: 'Generate Subsets', generate: () => generateSubsetsFrames() },
  'generate-subsequences': { label: 'Generate Subsequences', generate: () => generateSubsetsFrames() }, // structurally identical for visualization
  'generate-permutations': { label: 'Generate Permutations', generate: () => generatePermutationsFrames() },
  'combination-sum': { label: 'Combination Sum', generate: () => generateCombinationSumFrames() },
  'combination-sum-ii': { label: 'Combination Sum II', generate: () => generateGenericBacktrackingFrames('Combination Sum II') },
  'letter-combinations': { label: 'Letter Combinations', generate: () => generateLetterCombinationsFrames() },
  'palindrome-partitioning': { label: 'Palindrome Partitioning', generate: () => generateGenericBacktrackingFrames('Palindrome Partitioning') },
  'word-search': { label: 'Word Search', generate: () => generateWordSearchFrames() },
  'm-coloring': { label: 'M Coloring Problem', generate: () => generateGenericBacktrackingFrames('M Coloring') },
  'restore-ip-addresses': { label: 'Restore IP Addresses', generate: () => generateGenericBacktrackingFrames('Restore IP Addresses') },
  'beautiful-arrangement': { label: 'Beautiful Arrangement', generate: () => generateGenericBacktrackingFrames('Beautiful Arrangement') },
  
  'singly-linked-list': { label: 'Singly Linked List', generate: () => generateSinglyLinkedListFrames() },
  'doubly-linked-list': { label: 'Doubly Linked List', generate: () => generateDoublyLinkedListFrames() },
  'circular-linked-list': { label: 'Circular Linked List', generate: () => generateCircularLinkedListFrames() },
  'll-insertions': { label: 'Linked List Insertions', generate: () => generateLLInsertionFrames() },
  'll-deletions': { label: 'Linked List Deletions', generate: () => generateLLDeletionFrames() },
  'll-reversal': { label: 'Reverse Linked List', generate: () => generateLLReversalFrames() },
  'll-detect-cycle': { label: 'Detect Cycle', generate: () => generateLLDetectCycleFrames() },
  'll-middle-node': { label: 'Middle Node', generate: () => generateLLMiddleNodeFrames() },
  'll-merge-two-lists': { label: 'Merge Two Sorted Lists', generate: () => generateLLMergeFrames() },
  'll-reverse-k-groups': { label: 'Reverse in K Groups', generate: () => generateGenericLLFrames('Reverse in K Groups') },
  'lru-cache': { label: 'LRU Cache', generate: () => generateGenericLLFrames('LRU Cache') },

  'binary-tree': { label: 'Binary Tree', generate: () => generateGenericTreeFrames('Binary Tree Basics') },
  'tree-types': { label: 'Tree Types', generate: () => generateGenericTreeFrames('Tree Types') },
  'bst-search': { label: 'BST Search', generate: () => generateBSTSearchFrames(25) },
  'bst-insert': { label: 'BST Insert', generate: () => generateBSTInsertFrames(22) },
  'bst-delete': { label: 'BST Delete', generate: () => generateBSTDeleteFrames(20) },
  'avl-tree': { label: 'AVL Tree', generate: () => generateGenericTreeFrames('AVL Tree') },
  'morris-traversal': { label: 'Morris Traversal', generate: () => generateGenericTreeFrames('Morris Traversal') },
  'lca': { label: 'Lowest Common Ancestor', generate: () => generateLCAFrames() },
  'tree-diameter': { label: 'Diameter of Tree', generate: () => generateGenericTreeFrames('Diameter of Tree') },
  'balanced-tree': { label: 'Balanced Trees', generate: () => generateGenericTreeFrames('Balanced Trees') },
  'tree-views': { label: 'Binary Tree Views', generate: () => generateGenericTreeFrames('Binary Tree Views') },
  'serialize-tree': { label: 'Serialization', generate: () => generateGenericTreeFrames('Serialization') },
  'deserialize-tree': { label: 'Deserialization', generate: () => generateGenericTreeFrames('Deserialization') }
} as any; 

export function generateFrames(
  algorithm: AlgorithmType,
  elements: VisualElement[],
  options?: { searchTarget?: number },
): VisualizationFrame[] {
  const backtrackingAlgos = ['generate-subsets', 'generate-subsequences', 'generate-permutations', 'combination-sum', 'combination-sum-ii', 'letter-combinations', 'palindrome-partitioning', 'word-search', 'm-coloring', 'restore-ip-addresses', 'beautiful-arrangement'];
  if (elements.length === 0 && !['dfs-tree', 'tree-traversals', 'height-of-tree', 'n-queens', 'rat-in-a-maze', 'sudoku-solver', 'generate-parentheses', ...backtrackingAlgos].includes(algorithm)) return [];
  const algo = ALGORITHM_REGISTRY[algorithm];
  if (!algo || !algo.generate) {
    return [{ elements, event: { type: 'BASE_CASE', explanation: 'Visualizer not yet implemented.' } }];
  }
  return algo.generate(elements, options);
}
