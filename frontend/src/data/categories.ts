import { CategoryIcons } from '../components/explore/CategoryIcons';
import type { AlgorithmType } from '../types/visualizer';

export interface AlgorithmMeta {
  id: AlgorithmType | string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  section?: string;
}

export interface CategoryData {
  id: string;
  title: string;
  count: number;
  desc: string;
  overview: string;
  objectives: string[];
  Icon: React.FC<{ isHovered?: boolean; className?: string }>;
  color: string;
  algorithms: AlgorithmMeta[];
  hasIntro?: boolean;
}

export const CATEGORIES: CategoryData[] = [
  { 
    id: "sorting-algorithms",
    title: "Sorting Algorithms", 
    count: 5, 
    desc: "Organize data efficiently. Learn Bubble, Merge, Quick, and more.", 
    overview: "Sorting algorithms put elements of a list into an order. The most frequently used orders are numerical order and lexicographical order. Efficient sorting is important for optimizing the efficiency of other algorithms (such as search and merge algorithms) that require input data to be in sorted lists. It is also often useful for canonicalizing data and for producing human-readable output.",
    objectives: [
      "Understand the difference between O(N²) and O(N log N) sorting algorithms.",
      "Identify stability in sorting algorithms and when it matters.",
      "Master Divide and Conquer concepts through Merge and Quick Sort.",
      "Analyze in-place vs out-of-place sorting space complexities."
    ],
    Icon: CategoryIcons.Sorting, 
    color: "from-primary to-purple-400",
    hasIntro: true,
    algorithms: [
      {
        id: 'bubble',
        title: 'Bubble Sort',
        difficulty: 'Easy',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
      },
      {
        id: 'selection',
        title: 'Selection Sort',
        difficulty: 'Easy',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        description: 'Divides the array into a sorted and unsorted region, repeatedly selecting the smallest element from the unsorted region.'
      },
      {
        id: 'insertion',
        title: 'Insertion Sort',
        difficulty: 'Easy',
        timeComplexity: 'O(N²)',
        spaceComplexity: 'O(1)',
        description: 'Builds the final sorted array one item at a time, inserting elements into their correct position.'
      },
      {
        id: 'merge',
        title: 'Merge Sort',
        difficulty: 'Medium',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        description: 'Divide and conquer algorithm that splits the array in half, sorts each half, and merges them back together.'
      },
      {
        id: 'quick',
        title: 'Quick Sort',
        difficulty: 'Medium',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(log N)',
        description: 'Picks a pivot, partitions the array around the pivot, and recursively sorts the sub-arrays.'
      }
    ]
  },
  { 
    id: "searching-algorithms",
    title: "Searching Algorithms", 
    count: 16, 
    desc: "Find elements fast with Binary Search, variations, and advanced patterns.", 
    overview: "Search algorithms retrieve information stored within some data structure. They are fundamental to many computational tasks. In interviews, searching often involves finding bounds or searching on theoretical answer spaces.",
    objectives: [
      "Understand the massive difference between O(N) and O(log N).", 
      "Master Binary Search constraints, variations, and bounds.",
      "Explore advanced distribution-based searches like Interpolation Search.",
      "Solve advanced patterns like Search on Answer and Monotonic Predicate."
    ],
    Icon: CategoryIcons.Searching, 
    color: "from-blue-500 to-cyan-400", 
    hasIntro: true,
    algorithms: [
      {
        id: 'linear-search',
        title: 'Linear Search',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Checks every element in the array sequentially until the target is found.',
        section: 'Algorithms'
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        difficulty: 'Easy',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Efficiently finds a target in a sorted array by repeatedly dividing the search interval in half.',
        section: 'Algorithms'
      },
      {
        id: 'jump-search',
        title: 'Jump Search',
        difficulty: 'Easy',
        timeComplexity: 'O(√N)',
        spaceComplexity: 'O(1)',
        description: 'Jumps ahead by fixed steps and performs a linear search backwards when passing the target.',
        section: 'Algorithms'
      },
      {
        id: 'interpolation-search',
        title: 'Interpolation Search',
        difficulty: 'Medium',
        timeComplexity: 'O(log(log N))',
        spaceComplexity: 'O(1)',
        description: 'Improves Binary Search by interpolating the target position based on values at the boundaries.',
        section: 'Algorithms'
      },
      {
        id: 'exponential-search',
        title: 'Exponential Search',
        difficulty: 'Medium',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Finds a range where the target lies by doubling the bound, then applies binary search.',
        section: 'Algorithms'
      },
      {
        id: 'first-occurrence',
        title: 'First Occurrence',
        difficulty: 'Medium',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Finds the very first instance of a target in an array containing duplicates.',
        section: 'Variations'
      },
      {
        id: 'last-occurrence',
        title: 'Last Occurrence',
        difficulty: 'Medium',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Finds the very last instance of a target in an array containing duplicates.',
        section: 'Variations'
      },
      {
        id: 'lower-bound',
        title: 'Lower Bound',
        difficulty: 'Medium',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Finds the first element that is strictly greater than or equal to the target.',
        section: 'Variations'
      },
      {
        id: 'upper-bound',
        title: 'Upper Bound',
        difficulty: 'Medium',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Finds the first element that is strictly greater than the target.',
        section: 'Variations'
      },
      {
        id: 'floor',
        title: 'Floor',
        difficulty: 'Medium',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Finds the largest element that is smaller than or equal to the target.',
        section: 'Variations'
      },
      {
        id: 'ceil',
        title: 'Ceil',
        difficulty: 'Medium',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Finds the smallest element that is greater than or equal to the target.',
        section: 'Variations'
      },
      {
        id: 'search-insert-position',
        title: 'Search Insert Position',
        difficulty: 'Easy',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Finds the index where a target should be inserted to maintain sorted order.',
        section: 'Variations'
      },
      {
        id: 'search-sorted-rotated',
        title: 'Search in Sorted Array',
        difficulty: 'Medium',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'A structural pattern focusing on finding boundaries and handling rotated sorted segments.',
        section: 'Interview Patterns'
      },
      {
        id: 'search-on-answer',
        title: 'Search on Answer',
        difficulty: 'Hard',
        timeComplexity: 'O(N log(Max-Min))',
        spaceComplexity: 'O(1)',
        description: 'Binary Searching an abstract range of possible answers (e.g., minimum capacity) instead of an array.',
        section: 'Interview Patterns'
      },
      {
        id: 'monotonic-predicate',
        title: 'Monotonic Predicate',
        difficulty: 'Hard',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Designing a boolean function that evaluates to TTTTFFFF, allowing Binary Search to find the transition point.',
        section: 'Interview Patterns'
      },
      {
        id: 'peak-element',
        title: 'Peak Element',
        difficulty: 'Medium',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Finds a peak element in an array where an element is strictly greater than its neighbors.',
        section: 'Interview Patterns'
      }
    ] 
  },

  { 
    id: "sliding-window", 
    title: "Sliding Window", 
    count: 4, 
    desc: "Optimize nested loops by maintaining a subset of items.", 
    overview: "Sliding window is a pattern to reduce nested loops and optimize array/string traversals.", 
    objectives: ["Understand when to use fixed vs dynamic windows", "Transform O(N*K) brute force to O(N)", "Master string subset problems"], 
    Icon: CategoryIcons.SlidingWindow, 
    color: "from-cyan-500 to-teal-400", 
    hasIntro: true, 
    algorithms: [
      {
        id: 'sliding-window-maximum-sum',
        title: 'Maximum Sum Subarray of Size K',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Finds the maximum sum of any contiguous subarray of a fixed size K.',
        section: 'Fixed Window'
      },
      {
        id: 'sliding-window-average',
        title: 'Average of Subarray of Size K',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Calculates the average of all contiguous subarrays of a fixed size K.',
        section: 'Fixed Window'
      },
      {
        id: 'sliding-window-longest-substring',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(min(N, M))',
        description: 'Finds the length of the longest substring without repeating characters using a dynamic window.',
        section: 'Variable Window'
      },
      {
        id: 'sliding-window-minimum-sum',
        title: 'Minimum Size Subarray Sum',
        difficulty: 'Medium',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Finds the minimal length of a contiguous subarray of which the sum is greater than or equal to a target.',
        section: 'Variable Window'
      }
    ] 
  },
  { 
    id: "two-pointers", 
    title: "Two Pointers", 
    count: 10, 
    desc: "Search pairs or reverse structures moving pointers simultaneously.", 
    overview: "Two Pointers is a powerful problem-solving pattern used to reduce nested loops. By maintaining two reference points (pointers) that move through the array simultaneously, we can search, filter, or process elements in linear time.", 
    objectives: [
      "Understand the mechanics of Opposite Direction pointers.",
      "Master Same Direction pointers for filtering and shifting.",
      "Detect cycles using Fast & Slow pointer (Tortoise and Hare) techniques.",
      "Transform O(N²) nested loop brute-force solutions into O(N) linear solutions."
    ], 
    Icon: CategoryIcons.TwoPointers, 
    color: "from-purple-500 to-pink-400", 
    hasIntro: true,
    algorithms: [
      {
        id: 'pair-sum',
        title: 'Pair Sum',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Find if any two elements in a sorted array sum up to a target.',
        section: 'Opposite Direction'
      },
      {
        id: 'two-sum-ii',
        title: 'Two Sum II',
        difficulty: 'Medium',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Find indices of two numbers that add up to a specific target in a 1-indexed sorted array.',
        section: 'Opposite Direction'
      },
      {
        id: 'valid-palindrome',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Determine if a string reads the same forwards and backwards ignoring non-alphanumeric characters.',
        section: 'Opposite Direction'
      },
      {
        id: 'container-with-most-water',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Find two lines that together with the x-axis form a container holding the most water.',
        section: 'Opposite Direction'
      },
      {
        id: 'remove-duplicates',
        title: 'Remove Duplicates',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Remove duplicates in-place from a sorted array such that each element appears only once.',
        section: 'Same Direction'
      },
      {
        id: 'move-zeroes',
        title: 'Move Zeroes',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Move all 0s to the end of the array while maintaining the relative order of the non-zero elements.',
        section: 'Same Direction'
      },
      {
        id: 'remove-element',
        title: 'Remove Element',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Remove all instances of a value in-place and return the new length.',
        section: 'Same Direction'
      },
      {
        id: 'middle-of-linked-list',
        title: 'Middle of Linked List',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Find the middle node of a linked list using a fast and slow pointer.',
        section: 'Fast-Slow'
      },
      {
        id: 'floyd-cycle-detection',
        title: 'Floyd Cycle Detection',
        difficulty: 'Medium',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        description: 'Determine if a linked list has a cycle in it using tortoise and hare pointers.',
        section: 'Fast-Slow'
      },
      {
        id: 'happy-number',
        title: 'Happy Number',
        difficulty: 'Easy',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(1)',
        description: 'Determine if a number is happy by detecting cycles in the sum of square of its digits.',
        section: 'Fast-Slow'
      }
    ] 
  },
  { 
    id: "recursion", 
    title: "Recursion", 
    count: 5, 
    desc: "Functions calling themselves to solve smaller subproblems.", 
    overview: "Recursion is a method of solving a problem where the solution depends on solutions to smaller instances of the same problem. It is a fundamental concept in computer science, deeply tied to the call stack, and serves as the foundation for complex algorithms like Tree Traversals, Divide and Conquer, Backtracking, and Dynamic Programming.", 
    objectives: [
      "Understand how the Call Stack handles recursive function calls.",
      "Identify and define robust Base Cases to prevent infinite loops.",
      "Trace execution flow using Recursion Trees.",
      "Compare Recursion with Iteration in terms of time and space complexity."
    ], 
    Icon: CategoryIcons.Recursion, 
    color: "from-indigo-500 to-blue-400", 
    hasIntro: true, 
    algorithms: [
      {
        id: 'factorial',
        title: 'Factorial',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        description: 'The classic introduction to recursion. Calculates the product of all positive integers less than or equal to N.',
        section: 'Basics'
      },
      {
        id: 'fibonacci',
        title: 'Fibonacci Sequence',
        difficulty: 'Easy',
        timeComplexity: 'O(2^N)',
        spaceComplexity: 'O(N)',
        description: 'Generates the nth Fibonacci number by summing the two preceding ones, demonstrating multiple recursive calls (branching).',
        section: 'Basics'
      },
      {
        id: 'sum-of-n',
        title: 'Sum of N Numbers',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        description: 'Recursively calculates the sum of the first N natural numbers.',
        section: 'Array & String'
      },
      {
        id: 'reverse-array',
        title: 'Reverse Array',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        description: 'Reverses an array in-place using recursive pointer swaps.',
        section: 'Array & String'
      },
      {
        id: 'check-palindrome',
        title: 'Check Palindrome',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        description: 'Recursively checks if a string reads the same forwards and backwards.',
        section: 'Array & String'
      },
      {
        id: 'print-subsequences',
        title: 'Print Subsequences',
        difficulty: 'Medium',
        timeComplexity: 'O(2^N)',
        spaceComplexity: 'O(N)',
        description: 'Generates all possible subsequences of an array or string using recursion.',
        section: 'Array & String'
      },
      {
        id: 'head-recursion',
        title: 'Head Recursion',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        description: 'Recursive call occurs at the very beginning of the function before any other operations.',
        section: 'Recursion Patterns'
      },
      {
        id: 'tail-recursion',
        title: 'Tail Recursion',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        description: 'Recursive call occurs at the very end. Often optimized by compilers to use O(1) space.',
        section: 'Recursion Patterns'
      },
      {
        id: 'tree-recursion',
        title: 'Tree Recursion',
        difficulty: 'Medium',
        timeComplexity: 'O(2^N)',
        spaceComplexity: 'O(N)',
        description: 'A function that makes more than one recursive call to itself, creating a branching tree.',
        section: 'Recursion Patterns'
      },
      {
        id: 'indirect-recursion',
        title: 'Indirect Recursion',
        difficulty: 'Medium',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        description: 'Functions calling each other recursively in a cycle (e.g., A calls B, B calls A).',
        section: 'Recursion Patterns'
      },
      {
        id: 'recursive-binary-search',
        title: 'Binary Search (Recursive)',
        difficulty: 'Easy',
        timeComplexity: 'O(log N)',
        spaceComplexity: 'O(log N)',
        description: 'Finds an element in a sorted array by recursively dividing the search space in half.',
        section: 'Divide & Conquer'
      },
      {
        id: 'recursive-merge-sort',
        title: 'Merge Sort',
        difficulty: 'Medium',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(N)',
        description: 'Recursively splits an array and merges the sorted halves.',
        section: 'Divide & Conquer'
      },
      {
        id: 'recursive-quick-sort',
        title: 'Quick Sort',
        difficulty: 'Medium',
        timeComplexity: 'O(N log N)',
        spaceComplexity: 'O(log N)',
        description: 'Partitions an array around a pivot and recursively sorts the segments.',
        section: 'Divide & Conquer'
      },
      {
        id: 'dfs-tree',
        title: 'DFS (Depth First Search)',
        difficulty: 'Medium',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(H)',
        description: 'Recursively explores as far as possible along each branch before backtracking.',
        section: 'Tree Recursion'
      },
      { id: 'tree-inorder', title: 'Inorder Traversal', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', description: 'Left, Root, Right recursive traversal.', section: 'Tree Traversals' },
      { id: 'tree-preorder', title: 'Preorder Traversal', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', description: 'Root, Left, Right recursive traversal.', section: 'Tree Traversals' },
      { id: 'tree-postorder', title: 'Postorder Traversal', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', description: 'Left, Right, Root recursive traversal.', section: 'Tree Traversals' },
      { id: 'tree-levelorder', title: 'Level Order Traversal', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(W)', description: 'Breadth-First traversal using a Queue.', section: 'Tree Traversals' },
      {
        id: 'tree-traversals',
        title: 'Tree Traversals',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(H)',
        description: 'In-order, Pre-order, and Post-order recursive traversals of a binary tree.',
        section: 'Tree Recursion'
      },
      {
        id: 'height-of-tree',
        title: 'Height of Tree',
        difficulty: 'Easy',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(H)',
        description: 'Recursively calculates the maximum depth (height) of a binary tree.',
        section: 'Tree Recursion'
      },
      {
        id: 'generate-parentheses',
        title: 'Generate Parentheses',
        difficulty: 'Medium',
        timeComplexity: 'O(4^N / √N)',
        spaceComplexity: 'O(N)',
        description: 'Uses backtracking to generate all combinations of well-formed parentheses.',
        section: 'Backtracking Introduction'
      },
      {
        id: 'n-queens',
        title: 'N Queens',
        difficulty: 'Hard',
        timeComplexity: 'O(N!)',
        spaceComplexity: 'O(N)',
        description: 'Places N chess queens on an N×N chessboard so that no two queens threaten each other.',
        section: 'Backtracking Introduction'
      },
      {
        id: 'rat-in-a-maze',
        title: 'Rat in a Maze',
        difficulty: 'Medium',
        timeComplexity: 'O(4^(N^2))',
        spaceComplexity: 'O(N^2)',
        description: 'Finds all possible paths for a rat to reach the destination in a grid with obstacles.',
        section: 'Backtracking Introduction'
      },
      {
        id: 'sudoku-solver',
        title: 'Sudoku Solver',
        difficulty: 'Hard',
        timeComplexity: 'O(9^(N^2))',
        spaceComplexity: 'O(N^2)',
        description: 'Fills an empty Sudoku grid recursively, backtracking when a placement is invalid.',
        section: 'Backtracking Introduction'
      }
    ] 
  },
  { 
    id: "backtracking", 
    title: "Backtracking", 
    count: 11, 
    desc: "Explore all possible paths and backtrack when hitting dead ends.", 
    overview: "Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints of the problem at any point of time (by time, here, is referred to the time elapsed till reaching any level of the search tree).", 
    objectives: [
      "Understand how to build and traverse State Space Trees.",
      "Identify the difference between plain Recursion and Backtracking.",
      "Master Constraint Checking to validate paths.",
      "Learn Pruning techniques to eliminate invalid search branches early."
    ], 
    Icon: CategoryIcons.Backtracking, 
    color: "from-rose-500 to-orange-400",
    hasIntro: true,
    algorithms: [
      {
        id: 'generate-subsets',
        title: 'Generate Subsets',
        difficulty: 'Medium',
        timeComplexity: 'O(N * 2^N)',
        spaceComplexity: 'O(N)',
        description: 'Generates all possible subsets (the power set) of an array of unique integers.',
        section: 'Combinatorial Generators'
      },
      {
        id: 'generate-subsequences',
        title: 'Generate Subsequences',
        difficulty: 'Medium',
        timeComplexity: 'O(2^N)',
        spaceComplexity: 'O(N)',
        description: 'Generates all subsequences of a string or array maintaining the relative order.',
        section: 'Combinatorial Generators'
      },
      {
        id: 'generate-permutations',
        title: 'Generate Permutations',
        difficulty: 'Medium',
        timeComplexity: 'O(N * N!)',
        spaceComplexity: 'O(N)',
        description: 'Generates all possible permutations of an array of unique integers.',
        section: 'Combinatorial Generators'
      },
      {
        id: 'combination-sum',
        title: 'Combination Sum',
        difficulty: 'Medium',
        timeComplexity: 'O(2^Target)',
        spaceComplexity: 'O(Target)',
        description: 'Finds all unique combinations in an array where the candidate numbers sum to a target.',
        section: 'Constraint & Pruning'
      },
      {
        id: 'combination-sum-ii',
        title: 'Combination Sum II',
        difficulty: 'Medium',
        timeComplexity: 'O(2^N)',
        spaceComplexity: 'O(N)',
        description: 'Finds all unique combinations that sum to a target, where each number may only be used once.',
        section: 'Constraint & Pruning'
      },
      {
        id: 'letter-combinations',
        title: 'Letter Combinations',
        difficulty: 'Medium',
        timeComplexity: 'O(4^N)',
        spaceComplexity: 'O(N)',
        description: 'Returns all possible letter combinations that a phone number digits could represent.',
        section: 'State Space Exploration'
      },
      {
        id: 'palindrome-partitioning',
        title: 'Palindrome Partitioning',
        difficulty: 'Medium',
        timeComplexity: 'O(N * 2^N)',
        spaceComplexity: 'O(N)',
        description: 'Partitions a string such that every substring of the partition is a palindrome.',
        section: 'State Space Exploration'
      },
      {
        id: 'word-search',
        title: 'Word Search',
        difficulty: 'Medium',
        timeComplexity: 'O(N * M * 4^L)',
        spaceComplexity: 'O(L)',
        description: 'Checks if a word exists in an m x n grid of characters by moving vertically or horizontally.',
        section: 'Grid Backtracking'
      },
      {
        id: 'm-coloring',
        title: 'M Coloring Problem',
        difficulty: 'Medium',
        timeComplexity: 'O(M^V)',
        spaceComplexity: 'O(V)',
        description: 'Determines if a graph can be colored with at most m colors such that no two adjacent vertices of the graph are colored with the same color.',
        section: 'Graph Backtracking'
      },
      {
        id: 'restore-ip-addresses',
        title: 'Restore IP Addresses',
        difficulty: 'Medium',
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        description: 'Restores all possible valid IP addresses by inserting dots into a string containing only digits.',
        section: 'State Space Exploration'
      },
      {
        id: 'beautiful-arrangement',
        title: 'Beautiful Arrangement',
        difficulty: 'Medium',
        timeComplexity: 'O(K)',
        spaceComplexity: 'O(N)',
        description: 'Counts the number of beautiful arrangements of numbers from 1 to N satisfying divisibility constraints.',
        section: 'Constraint & Pruning'
      }
    ]
  },
  { 
    id: "linked-lists", 
    title: "Linked Lists", 
    count: 11, 
    desc: "Sequential nodes containing data and pointers to the next node.", 
    overview: "A linked list is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next.", 
    objectives: ["Understand node pointers", "Master pointer manipulation without losing references", "Solve cycle and intersection problems"], 
    Icon: CategoryIcons.LinkedLists, 
    color: "from-emerald-500 to-green-400", 
    hasIntro: true,
    algorithms: [
      { id: 'singly-linked-list', title: 'Singly Linked List', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Basic linked list with single forward pointers.', section: 'Basics' },
      { id: 'doubly-linked-list', title: 'Doubly Linked List', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Linked list with both forward and backward pointers.', section: 'Basics' },
      { id: 'circular-linked-list', title: 'Circular Linked List', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Linked list where the tail points back to the head.', section: 'Basics' },
      { id: 'll-insertions', title: 'Insertions', difficulty: 'Easy', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Inserting nodes at the head, tail, or middle.', section: 'Operations' },
      { id: 'll-deletions', title: 'Deletions', difficulty: 'Easy', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Deleting nodes from the list safely.', section: 'Operations' },
      { id: 'll-reversal', title: 'Reverse Linked List', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Reversing the direction of all pointers in the list.', section: 'Classic Problems' },
      { id: 'll-detect-cycle', title: 'Detect Cycle', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Using Tortoise and Hare algorithm to find loops.', section: 'Classic Problems' },
      { id: 'll-middle-node', title: 'Middle Node', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Finding the middle node using slow and fast pointers.', section: 'Classic Problems' },
      { id: 'll-merge-two-lists', title: 'Merge Two Sorted Lists', difficulty: 'Easy', timeComplexity: 'O(N+M)', spaceComplexity: 'O(1)', description: 'Splicing two sorted lists together.', section: 'Classic Problems' },
      { id: 'll-reverse-k-groups', title: 'Reverse in K Groups', difficulty: 'Hard', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Reversing chunks of k nodes at a time.', section: 'Advanced' },
      { id: 'lru-cache', title: 'LRU Cache Concept', difficulty: 'Hard', timeComplexity: 'O(1)', spaceComplexity: 'O(N)', description: 'Combining a Hash Map with a Doubly Linked List.', section: 'Advanced' }
    ] 
  },
  { 
    id: "trees", 
    title: "Trees", 
    count: 10, 
    desc: "Hierarchical data structures with roots, branches, and leaves.", 
    overview: "Trees are hierarchical data structures. The topmost node is called the root. Trees are heavily used for representing hierarchical data, optimizing searches, and routing.", 
    objectives: ["Understand Tree vs Graph", "Master DFS and BFS traversals", "Understand BST properties and rotations"], 
    Icon: CategoryIcons.Trees, 
    color: "from-green-500 to-lime-400", 
    hasIntro: true,
    algorithms: [
      { id: 'binary-tree', title: 'Binary Tree', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', description: 'Basic tree structure where nodes have at most two children.', section: 'Basics' },
      { id: 'tree-types', title: 'Types of Binary Trees', difficulty: 'Easy', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Full, Complete, Perfect, and Degenerate Trees.', section: 'Basics' },
      { id: 'bst-search', title: 'BST Search', difficulty: 'Easy', timeComplexity: 'O(log N)', spaceComplexity: 'O(H)', description: 'Searching for a value in a Binary Search Tree.', section: 'BST Operations' },
      { id: 'bst-insert', title: 'BST Insert', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(H)', description: 'Inserting a value maintaining BST properties.', section: 'BST Operations' },
      { id: 'bst-delete', title: 'BST Delete', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(H)', description: 'Deleting a node and replacing it with its successor/predecessor.', section: 'BST Operations' },
      { id: 'avl-tree', title: 'AVL Tree', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Self-balancing binary search tree.', section: 'Advanced Trees' },
      { id: 'morris-traversal', title: 'Morris Traversal', difficulty: 'Hard', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Inorder traversal using O(1) space without recursion stack.', section: 'Advanced Traversals' },
      { id: 'lca', title: 'Lowest Common Ancestor', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', description: 'Finding the lowest node that is an ancestor to two given nodes.', section: 'Classic Problems' },
      { id: 'tree-diameter', title: 'Diameter of Tree', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', description: 'Finding the longest path between any two nodes in a tree.', section: 'Classic Problems' },
      { id: 'balanced-tree', title: 'Balanced Trees', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', description: 'Checking if a tree is height-balanced.', section: 'Classic Problems' },
      { id: 'tree-views', title: 'Binary Tree Views', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', description: 'Top, Bottom, Left, and Right views of a binary tree.', section: 'Classic Problems' },
      { id: 'serialize-tree', title: 'Serialization', difficulty: 'Hard', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', description: 'Converting a tree to a string for storage.', section: 'Advanced Problems' },
      { id: 'deserialize-tree', title: 'Deserialization', difficulty: 'Hard', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', description: 'Rebuilding a tree from a serialized string.', section: 'Advanced Problems' }
    ] 
  },
    { 
    id: "graphs", 
    title: "Graphs", 
    count: 20, 
    desc: "Networks of nodes connected by edges for mapping relationships.", 
    overview: "Graphs are one of the most versatile data structures, representing relationships between entities. Used in social networks, routing algorithms, and map navigation.", 
    objectives: [
      "Understand graph representations (Adjacency Matrix vs List).",
      "Master Breadth-First Search (BFS) and Depth-First Search (DFS).",
      "Learn shortest path algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall).",
      "Understand Minimum Spanning Trees (Prim, Kruskal).",
      "Detect cycles and find topological sorts."
    ], 
    Icon: CategoryIcons.Graphs, 
    color: "from-orange-500 to-amber-400", 
    algorithms: [
      { id: 'graph-representation', title: 'Graph Representation', difficulty: 'Easy', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V+E)', description: 'Adjacency Matrix vs Adjacency List.', section: 'Basics' },
      { id: 'bfs', title: 'Breadth-First Search', difficulty: 'Easy', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Level-order traversal using a queue.', section: 'Traversal' },
      { id: 'dfs', title: 'Depth-First Search', difficulty: 'Easy', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Deep traversal using recursion/stack.', section: 'Traversal' },
      { id: 'topological-sort', title: 'Topological Sort', difficulty: 'Medium', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Linear ordering of vertices in a DAG (Kahn\'s Algorithm).', section: 'Directed Graphs' },
      { id: 'cycle-detection', title: 'Cycle Detection', difficulty: 'Medium', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Detecting cycles in directed and undirected graphs.', section: 'Directed Graphs' },
      { id: 'dijkstra', title: 'Dijkstra\'s Algorithm', difficulty: 'Medium', timeComplexity: 'O((V+E) log V)', spaceComplexity: 'O(V)', description: 'Single-source shortest path for non-negative weights.', section: 'Shortest Paths' },
      { id: 'bellman-ford', title: 'Bellman-Ford', difficulty: 'Medium', timeComplexity: 'O(V*E)', spaceComplexity: 'O(V)', description: 'Shortest path handling negative weights.', section: 'Shortest Paths' },
      { id: 'floyd-warshall', title: 'Floyd-Warshall', difficulty: 'Medium', timeComplexity: 'O(V^3)', spaceComplexity: 'O(V^2)', description: 'All-pairs shortest path algorithm.', section: 'Shortest Paths' },
      { id: 'prim', title: 'Prim\'s Algorithm', difficulty: 'Medium', timeComplexity: 'O((V+E) log V)', spaceComplexity: 'O(V)', description: 'Minimum Spanning Tree building from a start node.', section: 'Spanning Trees' },
      { id: 'kruskal', title: 'Kruskal\'s Algorithm', difficulty: 'Medium', timeComplexity: 'O(E log E)', spaceComplexity: 'O(V)', description: 'MST building by sorting edges and using Disjoint Sets.', section: 'Spanning Trees' },
      { id: 'disjoint-set', title: 'Disjoint Set (Union-Find)', difficulty: 'Medium', timeComplexity: 'O(alpha(V))', spaceComplexity: 'O(V)', description: 'Data structure to track set elements partitioned into disjoint sets.', section: 'Advanced' },
      { id: 'bridges-articulation', title: 'Bridges & Articulation Points', difficulty: 'Hard', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Finding critical connections and nodes (Tarjan\'s Algorithm).', section: 'Advanced' },
      { id: 'kosaraju', title: 'Strongly Connected Components', difficulty: 'Hard', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Kosaraju\'s algorithm for finding SCCs.', section: 'Advanced' }
    ] 
  },
    { 
    id: "dynamic-programming", 
    title: "Dynamic Programming", 
    count: 25, 
    desc: "Solve complex problems by breaking them into overlapping subproblems.", 
    overview: "Dynamic Programming optimizes recursion by storing previously computed results. It transforms exponential time complexities into polynomial time complexities.", 
    objectives: [
      "Understand the difference between Top-Down (Memoization) and Bottom-Up (Tabulation).",
      "Identify optimal substructure and overlapping subproblems.",
      "Solve classic 1D DP problems (Fibonacci, Climbing Stairs).",
      "Solve 2D DP problems (Grid Traveler, Knapsack, LCS)."
    ], 
    Icon: CategoryIcons.DynamicProgramming, 
    color: "from-pink-500 to-rose-400", 
    algorithms: [
      { id: 'dp-intro', title: 'Introduction to DP', difficulty: 'Easy', timeComplexity: 'Varies', spaceComplexity: 'Varies', description: 'Memoization vs Tabulation concepts.', section: 'Basics' },
      { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Find ways to reach the top. Classic 1D DP.', section: '1D DP' },
      { id: 'house-robber', title: 'House Robber', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Max sum of non-adjacent elements.', section: '1D DP' },
      { id: 'coin-change', title: 'Coin Change', difficulty: 'Medium', timeComplexity: 'O(amount * coins)', spaceComplexity: 'O(amount)', description: 'Min coins to make an amount.', section: '1D DP' },
      { id: 'lis', title: 'Longest Increasing Subsequence', difficulty: 'Medium', timeComplexity: 'O(N^2)', spaceComplexity: 'O(N)', description: 'Find the longest strictly increasing subsequence.', section: '1D DP' },
      { id: 'lcs', title: 'Longest Common Subsequence', difficulty: 'Medium', timeComplexity: 'O(N*M)', spaceComplexity: 'O(N*M)', description: 'Longest subsequence common to two strings.', section: '2D DP' },
      { id: 'knapsack-01', title: '0/1 Knapsack', difficulty: 'Medium', timeComplexity: 'O(N*W)', spaceComplexity: 'O(W)', description: 'Maximize value within a weight limit.', section: '2D DP' },
      { id: 'edit-distance', title: 'Edit Distance', difficulty: 'Medium', timeComplexity: 'O(N*M)', spaceComplexity: 'O(N*M)', description: 'Min operations to convert word1 to word2.', section: '2D DP' },
      { id: 'mcm', title: 'Matrix Chain Multiplication', difficulty: 'Hard', timeComplexity: 'O(N^3)', spaceComplexity: 'O(N^2)', description: 'Optimal parenthesis placement for matrix multiplication.', section: 'Advanced DP' },
      { id: 'digit-dp', title: 'Digit DP', difficulty: 'Hard', timeComplexity: 'O(digits * states)', spaceComplexity: 'O(states)', description: 'Counting numbers in a range satisfying properties.', section: 'Advanced DP' }
    ] 
  },
    { 
    id: "greedy-algorithms", 
    title: "Greedy Algorithms", 
    count: 9, 
    desc: "Make the locally optimal choice at each stage to find a global optimum.", 
    overview: "Greedy algorithms build up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit. While they don't always yield the globally optimal solution, when they do, they are incredibly fast.", 
    objectives: [
      "Understand when a problem has the Greedy Choice Property.",
      "Solve interval scheduling problems (Activity Selection).",
      "Solve fractional knapsack problems."
    ], 
    Icon: CategoryIcons.Greedy, 
    color: "from-yellow-500 to-amber-400", 
    algorithms: [
      { id: 'activity-selection', title: 'Activity Selection', difficulty: 'Easy', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'Select the maximum number of non-overlapping activities.', section: 'Intervals' },
      { id: 'fractional-knapsack', title: 'Fractional Knapsack', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'Maximize value in knapsack allowing fractions of items.', section: 'Optimization' },
      { id: 'job-sequencing', title: 'Job Sequencing with Deadlines', difficulty: 'Medium', timeComplexity: 'O(N^2)', spaceComplexity: 'O(N)', description: 'Maximize profit by scheduling jobs before their deadlines.', section: 'Optimization' },
      { id: 'huffman-coding', title: 'Huffman Coding', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Lossless data compression algorithm.', section: 'Strings' }
    ] 
  },
    { 
    id: "heap", 
    title: "Heap / Priority Queue", 
    count: 7, 
    desc: "Specialized tree-based structure maintaining the max/min element.", 
    overview: "A Heap is a complete binary tree where the parent node is either always greater than (Max Heap) or always less than (Min Heap) its children. It's the underlying structure of a Priority Queue.", 
    objectives: [
      "Understand the array representation of a binary heap.",
      "Master the heapify up and heapify down operations.",
      "Solve top K frequent elements and Kth largest element problems."
    ], 
    Icon: CategoryIcons.Heap, 
    color: "from-amber-600 to-orange-500", 
    algorithms: [
      { id: 'heap-intro', title: 'Introduction to Heaps', difficulty: 'Easy', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Insert, Delete, and Peek operations.', section: 'Basics' },
      { id: 'kth-largest', title: 'Kth Largest Element', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Find the Kth largest element in an array using a Min Heap.', section: 'Standard' },
      { id: 'merge-k-sorted', title: 'Merge K Sorted Lists', difficulty: 'Hard', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Merge k linked lists using a Priority Queue.', section: 'Advanced' },
      { id: 'median-data-stream', title: 'Find Median from Data Stream', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Maintain two heaps to find the running median.', section: 'Advanced' }
    ] 
  },
    { 
    id: "trie", 
    title: "Trie", 
    count: 5, 
    desc: "Prefix trees optimized for rapid string searching and autocomplete.", 
    overview: "A Trie (Prefix Tree) is a specialized tree used to store associative data structures. They are exceptionally fast for string matching, autocomplete, and spell checkers.", 
    objectives: [
      "Understand the Node structure of a Trie.",
      "Implement Insert, Search, and StartsWith operations.",
      "Solve advanced word search problems using a Trie."
    ], 
    Icon: CategoryIcons.Trie, 
    color: "from-teal-500 to-emerald-400", 
    algorithms: [
      { id: 'trie-intro', title: 'Implement Trie', difficulty: 'Medium', timeComplexity: 'O(L)', spaceComplexity: 'O(N*L)', description: 'Insert, Search, and Prefix match in O(Length) time.', section: 'Basics' },
      { id: 'design-add-search', title: 'Design Add and Search Words', difficulty: 'Medium', timeComplexity: 'O(26^L)', spaceComplexity: 'O(N*L)', description: 'Search supporting the "." wildcard character.', section: 'Standard' },
      { id: 'word-search-ii', title: 'Word Search II', difficulty: 'Hard', timeComplexity: 'O(M*N*3^L)', spaceComplexity: 'O(K*L)', description: 'Find all words from a dictionary in a 2D board using a Trie.', section: 'Advanced' }
    ] 
  },
    { 
    id: "segment-tree", 
    title: "Segment Tree", 
    count: 4, 
    desc: "Store intervals or segments to query range sums and min/max efficiently.", 
    overview: "A Segment Tree allows querying and updating array intervals in O(log N) time, vastly outperforming the O(N) time of naive approaches.", 
    objectives: [
      "Build a Segment Tree from an array.",
      "Perform Range Queries (Sum, Min, Max).",
      "Perform Point Updates.",
      "Understand Lazy Propagation for Range Updates."
    ], 
    Icon: CategoryIcons.SegmentTree, 
    color: "from-fuchsia-500 to-pink-400", 
    algorithms: [
      { id: 'segment-tree-intro', title: 'Segment Tree Basics', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Build, Point Update, and Range Query.', section: 'Basics' },
      { id: 'lazy-propagation', title: 'Lazy Propagation', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Range Updates without updating every child immediately.', section: 'Advanced' }
    ] 
  },
    { 
    id: "binary-indexed-tree", 
    title: "Binary Indexed Tree", 
    count: 3, 
    desc: "Efficiently update elements and calculate prefix sums in an array.", 
    overview: "Also known as a Fenwick Tree, it provides O(log N) point updates and prefix sum queries using much less code and space than a Segment Tree.", 
    objectives: [
      "Understand the LSB (Least Significant Bit) isolation trick.",
      "Implement Add and Query operations."
    ], 
    Icon: CategoryIcons.BinaryIndexedTree, 
    color: "from-violet-500 to-purple-400", 
    algorithms: [
      { id: 'fenwick-tree-intro', title: 'Fenwick Tree', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Point update and Range Sum query.', section: 'Basics' },
      { id: 'count-inversions', title: 'Count Inversions', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Count smaller elements after self using BIT.', section: 'Applications' }
    ] 
  },
    { 
    id: "advanced-patterns", 
    title: "Advanced Patterns", 
    count: 10, 
    desc: "Master complex interview setups like monotonic stack and sweep line.", 
    overview: "This module covers specialized algorithms and data structure patterns that appear in hard interview rounds.", 
    objectives: [
      "String matching: KMP and Rabin-Karp.",
      "Stack patterns: Monotonic Stack.",
      "Intervals: Sweep Line Algorithm."
    ], 
    Icon: CategoryIcons.Advanced, 
    color: "from-primary to-secondary", 
    algorithms: [
      { id: 'kmp', title: 'KMP String Matching', difficulty: 'Hard', timeComplexity: 'O(N+M)', spaceComplexity: 'O(M)', description: 'Find substring using the LPS array.', section: 'Strings' },
      { id: 'rabin-karp', title: 'Rabin-Karp', difficulty: 'Medium', timeComplexity: 'O(N+M)', spaceComplexity: 'O(1)', description: 'Find substring using Rolling Hash.', section: 'Strings' },
      { id: 'monotonic-stack', title: 'Monotonic Stack', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', description: 'Next Greater Element paradigm.', section: 'Arrays' },
      { id: 'sweep-line', title: 'Sweep Line', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Process intervals sorted by time/coordinate.', section: 'Intervals' }
    ] 
  }
];
