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
    id: "heap", 
    title: "Heap / Priority Queue", 
    count: 14, 
    desc: "Specialized tree-based structure maintaining the max/min element.", 
    overview: "A Heap is a complete binary tree where the parent node is either always greater than (Max Heap) or always less than (Min Heap) its children. It's the underlying structure of a Priority Queue.", 
    objectives: [
      "Understand the array representation of a binary heap.",
      "Master the heapify up and heapify down operations.",
      "Solve top K frequent elements, Kth largest, and streaming median problems."
    ], 
    Icon: CategoryIcons.Heap, 
    color: "from-amber-600 to-orange-500", 
    hasIntro: true,
    algorithms: [
      { id: 'heap-intro', title: 'Introduction to Heaps', difficulty: 'Easy', timeComplexity: 'O(1) / O(log N)', spaceComplexity: 'O(N)', description: 'Complete binary tree, array indexing, and core operations.', section: 'Fundamentals' },
      { id: 'min-max-heap', title: 'Min Heap vs Max Heap', difficulty: 'Easy', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Comparison of parent-child invariants and extract operations.', section: 'Fundamentals' },
      { id: 'heap-operations', title: 'Heap Operations', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', description: 'Step-by-step Insert (Bubble Up) and Extract (Shift Down).', section: 'Fundamentals' },
      { id: 'priority-queue-design', title: 'Priority Queue Design', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Building an Abstract Priority Queue on top of a Binary Heap.', section: 'Fundamentals' },
      
      { id: 'heap-sort', title: 'Heap Sort', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'In-place comparison sort using Max Heap extraction.', section: 'Intermediate' },
      { id: 'kth-largest', title: 'Kth Largest Element', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Find the Kth largest element in an array using a Min Heap.', section: 'Intermediate' },
      { id: 'kth-smallest', title: 'Kth Smallest Element', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Find the Kth smallest element in an array using a Max Heap.', section: 'Intermediate' },
      { id: 'top-k-frequent', title: 'Top K Frequent Elements', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(N)', description: 'Frequency map pipeline paired with a Min Heap of size K.', section: 'Intermediate' },
      { id: 'k-closest-elements', title: 'K Closest Elements', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Find K numbers closest to target using distance comparisons.', section: 'Intermediate' },
      { id: 'k-closest-points', title: 'K Closest Points to Origin', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Euclidean distance calculation on 2D plane with Max Heap.', section: 'Intermediate' },

      { id: 'merge-k-sorted', title: 'Merge K Sorted Lists', difficulty: 'Hard', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Merge k linked lists using a Priority Queue.', section: 'Advanced' },
      { id: 'sliding-window-maximum', title: 'Sliding Window Maximum', difficulty: 'Hard', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Dynamic heap tracking of maximum values in a moving window.', section: 'Advanced' },
      { id: 'task-scheduler', title: 'Task Scheduler', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'CPU task execution timeline with cooldowns via Max Heap.', section: 'Advanced' },
      { id: 'median-data-stream', title: 'Find Median from Data Stream', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Maintain two heaps (Max & Min) to find the running median.', section: 'Advanced' }
    ] 
  },
    { 
    id: "trie", 
    title: "Trie (Prefix Tree)", 
    count: 15, 
    desc: "Prefix trees optimized for rapid string searching, autocomplete, and dictionary lookups.", 
    overview: "A Trie (Prefix Tree) is a tree-like data structure used to locate specific keys within a set. Characters are stored on tree edges and nodes, enabling O(L) time lookups where L is string length.", 
    objectives: [
      "Understand character edge branching and endOfWord node markers.",
      "Master Insert, Search, and StartsWith prefix operations in O(L) time.",
      "Build real-world systems like Autocomplete, Contacts, and File System Tries."
    ], 
    Icon: CategoryIcons.Trie, 
    color: "from-teal-500 to-emerald-400", 
    hasIntro: true,
    algorithms: [
      { id: 'trie-intro', title: 'Introduction to Trie', difficulty: 'Easy', timeComplexity: 'O(L)', spaceComplexity: 'O(N * L)', description: 'Core prefix tree structure and shared prefix storage.', section: 'Fundamentals' },
      { id: 'trie-node-structure', title: 'Trie Node Structure', difficulty: 'Easy', timeComplexity: 'O(1)', spaceComplexity: 'O(26)', description: 'Memory layout, child pointers array, and endOfWord flag.', section: 'Fundamentals' },
      { id: 'trie-insert', title: 'Insert Word', difficulty: 'Easy', timeComplexity: 'O(L)', spaceComplexity: 'O(L)', description: 'Character-by-character node creation and traversal.', section: 'Fundamentals' },
      { id: 'trie-search', title: 'Search Word', difficulty: 'Easy', timeComplexity: 'O(L)', spaceComplexity: 'O(1)', description: 'Exact word search vs missing node detection.', section: 'Fundamentals' },
      { id: 'trie-prefix-search', title: 'Starts With / Prefix Search', difficulty: 'Easy', timeComplexity: 'O(L)', spaceComplexity: 'O(1)', description: 'Prefix match traversal without requiring endOfWord flag.', section: 'Fundamentals' },

      { id: 'word-dictionary', title: 'Word Dictionary (Wildcard Search)', difficulty: 'Medium', timeComplexity: 'O(26^L)', spaceComplexity: 'O(N * L)', description: 'Search supporting the "." wildcard character via DFS.', section: 'Intermediate' },
      { id: 'longest-common-prefix', title: 'Longest Common Prefix', difficulty: 'Easy', timeComplexity: 'O(N * L)', spaceComplexity: 'O(N * L)', description: 'Unbranched path traversal until first branching node.', section: 'Intermediate' },
      { id: 'replace-words', title: 'Replace Words', difficulty: 'Medium', timeComplexity: 'O(N * L)', spaceComplexity: 'O(N * L)', description: 'Root word replacement in sentences using prefix matching.', section: 'Intermediate' },
      { id: 'search-suggestions-system', title: 'Search Suggestions System', difficulty: 'Medium', timeComplexity: 'O(L + M)', spaceComplexity: 'O(N * L)', description: 'Product search suggestions updating dynamically per key press.', section: 'Intermediate' },
      { id: 'word-search-ii', title: 'Word Search II', difficulty: 'Hard', timeComplexity: 'O(M * N * 3^L)', spaceComplexity: 'O(K * L)', description: 'Find all valid words in 2D matrix using Trie + DFS pruning.', section: 'Advanced' },

      { id: 'autocomplete-system', title: 'Auto Complete System', difficulty: 'Hard', timeComplexity: 'O(L + K)', spaceComplexity: 'O(N * L)', description: 'Real-time search bar autocomplete with candidate ranking.', section: 'Advanced' },
      { id: 'design-search-engine', title: 'Design Search Engine Prefix Matching', difficulty: 'Hard', timeComplexity: 'O(L)', spaceComplexity: 'O(N * L)', description: 'Search query engine prefix matching and hit counting.', section: 'Advanced' },
      { id: 'top-k-frequent-words', title: 'Top K Frequent Words', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(N)', description: 'Trie frequency counter paired with Min-Heap ranking.', section: 'Advanced' },
      { id: 'contacts-app', title: 'Contacts Application', difficulty: 'Medium', timeComplexity: 'O(L + K)', spaceComplexity: 'O(N * L)', description: 'Phonebook contact search by name prefix.', section: 'Advanced' },
      { id: 'file-system-trie', title: 'File System Path Trie', difficulty: 'Hard', timeComplexity: 'O(L)', spaceComplexity: 'O(N * L)', description: 'Directory hierarchy tree splitting on path slashes.', section: 'Advanced' }
    ] 
  },
    { 
    id: "segment-tree", 
    title: "Segment Tree", 
    count: 12, 
    desc: "Store intervals or segments to query range sums, min/max, and perform lazy propagation efficiently.", 
    overview: "A Segment Tree allows querying and updating array intervals in O(log N) time, vastly outperforming naive O(N) approaches for dynamic range operations.", 
    objectives: [
      "Understand why Segment Trees outperform naive O(N) and prefix sum O(1) query / O(N) update approaches.",
      "Build a Segment Tree bottom-up and top-down.",
      "Perform Range Queries (Sum, Minimum, Maximum) in O(log N).",
      "Execute Point Updates and propagate updates upward.",
      "Master Lazy Propagation for O(log N) Range Updates and Range Assignments."
    ], 
    Icon: CategoryIcons.SegmentTree, 
    color: "from-fuchsia-500 to-pink-400",
    hasIntro: true, 
    algorithms: [
      { id: 'segment-tree-intro', title: 'Segment Tree Intro', difficulty: 'Easy', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'What is a Segment Tree & Why do we need it?', section: 'Introduction' },
      { id: 'build-segment-tree', title: 'Building a Segment Tree', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', description: 'Leaf creation, parent merge, and tree construction.', section: 'Core Topics' },
      { id: 'range-sum-query', title: 'Range Sum Query', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Query range sums traversing covered, partial, and disjoint nodes.', section: 'Core Topics' },
      { id: 'range-min-query', title: 'Range Minimum Query', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Query minimum values over arbitrary sub-arrays.', section: 'Core Topics' },
      { id: 'range-max-query', title: 'Range Maximum Query', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Query maximum values over arbitrary sub-arrays.', section: 'Core Topics' },
      { id: 'point-update', title: 'Point Update', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Update a single element and propagate changes upward.', section: 'Core Topics' },
      { id: 'range-update', title: 'Range Update', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Updating intervals with lazy state management.', section: 'Core Topics' },
      { id: 'lazy-propagation', title: 'Lazy Propagation', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Defer updates to child nodes using a secondary lazy array.', section: 'Advanced Topics' },
      { id: 'range-assignment', title: 'Range Assignment Updates', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Overwriting ranges with uniform values lazily.', section: 'Advanced Topics' },
      { id: 'segment-tree-applications', title: 'Segment Tree Applications', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Real-world and competitive programming applications.', section: 'Advanced Topics' },
      { id: 'count-smaller-numbers', title: 'Count Smaller Numbers After Self', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Dynamic frequency counts using segment tree traversal.', section: 'Interview Problems' },
      { id: 'skyline-problem', title: 'Skyline-Style Range Maximum Overlap', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Building heights and range maximum overlap tracking.', section: 'Interview Problems' }
    ] 
  },
    { 
    id: "binary-indexed-tree", 
    title: "Binary Indexed Tree", 
    count: 11, 
    desc: "Perform dynamic prefix sums and point updates in O(log N) time with elegant LSB bitwise math.", 
    overview: "Also known as a Fenwick Tree, a Binary Indexed Tree (BIT) provides O(log N) point updates and prefix sum queries using an incredibly lightweight N-size array and simple bit manipulation.", 
    objectives: [
      "Understand why BIT overcomes Prefix Sum update bottlenecks and array search queries.",
      "Master the LSB (Least Significant Bit) isolation trick: x & -x.",
      "Understand what sub-range each BIT[i] node stores.",
      "Execute Point Updates (add +V at index i) in O(log N).",
      "Execute Prefix Sum and Range Sum Queries in O(log N).",
      "Compare BIT vs Segment Tree trade-offs in memory, code simplicity, and flexibility."
    ], 
    Icon: CategoryIcons.BinaryIndexedTree, 
    color: "from-violet-500 to-purple-400",
    hasIntro: true, 
    algorithms: [
      { id: 'fenwick-tree-intro', title: 'Binary Indexed Tree Intro', difficulty: 'Easy', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'What is a BIT & How does it work?', section: 'Introduction' },
      { id: 'prefix-sum-refresher', title: 'Prefix Sum Refresher', difficulty: 'Easy', timeComplexity: 'O(1) / O(N)', spaceComplexity: 'O(N)', description: 'O(1) prefix sums vs O(N) update bottleneck.', section: 'Foundations' },
      { id: 'why-bit-exists', title: 'Why BIT Exists', difficulty: 'Easy', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Motivating example: Dynamic prefix sums & updates.', section: 'Foundations' },
      { id: 'bit-structure', title: 'BIT Structure & Ranges', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Understanding what range each BIT[i] node stores.', section: 'Core Concepts' },
      { id: 'lowbit-operation', title: 'Lowbit Operation (x & -x)', difficulty: 'Medium', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Bitwise two\'s complement LSB isolation animation.', section: 'Core Concepts' },
      { id: 'bit-point-update', title: 'Point Update in BIT', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Add +V at index i and propagate via i += i & -i.', section: 'Operations' },
      { id: 'prefix-sum-query', title: 'Prefix Sum Query in BIT', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Accumulate prefix sum by stepping i -= i & -i.', section: 'Operations' },
      { id: 'bit-range-sum-query', title: 'Range Sum Query', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Range sum(L, R) = prefix(R) - prefix(L-1).', section: 'Operations' },
      { id: 'coordinate-compression-bit', title: 'Coordinate Compression', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Mapping large numbers to small ranks for BIT indexing.', section: 'Advanced Topics' },
      { id: 'count-inversions', title: 'Count Inversions', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Counting smaller elements after self using BIT frequency tree.', section: 'Interview Problems' },
      { id: 'order-statistics-bit', title: 'Order Statistics & Frequency Queries', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'K-th smallest element binary lifting on Fenwick Tree.', section: 'Interview Problems' }
    ] 
  },
    { 
    id: "advanced-patterns", 
    title: "Advanced Patterns", 
    count: 14, 
    desc: "Master high-frequency interview pattern recognition & problem mapping.", 
    overview: "The final stage of the AlgoVis roadmap. Learn how to map complex problem descriptions to optimal algorithmic patterns, decode disguised interview questions, and execute production solutions.", 
    objectives: [
      "Master Monotonic Stack & Monotonic Queue window maintenance.",
      "Apply Union Find (DSU) for dynamic connectivity and component tracking.",
      "Process intervals and overlaps with Sweep Line event algorithms.",
      "Execute O(1) range updates using Difference Arrays.",
      "Identify Binary Search On Answer feasibility functions.",
      "Solve advanced Graph (Topological Sort, Shortest Path, MST) & State Compression DP problems."
    ], 
    Icon: CategoryIcons.Advanced, 
    color: "from-primary to-secondary",
    hasIntro: true, 
    algorithms: [
      { id: 'monotonic-stack-pattern', title: 'Monotonic Stack Pattern', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', description: 'Next Greater Element, Daily Temps, and Histogram Area.', section: 'Monotonic Structures' },
      { id: 'monotonic-queue-pattern', title: 'Monotonic Queue Pattern', difficulty: 'Hard', timeComplexity: 'O(N)', spaceComplexity: 'O(K)', description: 'Sliding Window Maximum and Constrained Window Sums.', section: 'Monotonic Structures' },
      { id: 'union-find-pattern', title: 'Union Find (DSU) Pattern', difficulty: 'Medium', timeComplexity: 'O(α(N))', spaceComplexity: 'O(N)', description: 'Dynamic Connectivity, Provinces, and Cycle Detection.', section: 'Disjoint Sets' },
      { id: 'sweep-line-pattern', title: 'Sweep Line Pattern', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Meeting Rooms, Interval Overlaps, and Timeline Events.', section: 'Intervals' },
      { id: 'difference-array-pattern', title: 'Difference Array Pattern', difficulty: 'Medium', timeComplexity: 'O(1) update / O(N)', spaceComplexity: 'O(N)', description: 'Batch range updates (+D at L, -D at R+1) & reconstruction.', section: 'Range Modifications' },
      { id: 'binary-search-on-answer-pattern', title: 'Binary Search On Answer', difficulty: 'Medium', timeComplexity: 'O(N log(Max-Min))', spaceComplexity: 'O(1)', description: 'Minimize Maximum, Koko Bananas, and Feasibility Checks.', section: 'Search Space' },
      { id: 'bit-manipulation-patterns', title: 'Bit Manipulation Patterns', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'XOR Cancellation, Single Number, and Subsets.', section: 'Bitwise Tricks' },
      { id: 'meet-in-the-middle-pattern', title: 'Meet In The Middle Pattern', difficulty: 'Hard', timeComplexity: 'O(2^(N/2) log(2^(N/2)))', spaceComplexity: 'O(2^(N/2))', description: 'Splitting N=40 search space into two N/2 halves.', section: 'Divide & Conquer' },
      { id: 'topological-sort-patterns', title: 'Topological Sort Patterns', difficulty: 'Medium', timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', description: 'Dependency Ordering, Course Schedule, and Alien Dictionary.', section: 'Graph Patterns' },
      { id: 'shortest-path-patterns', title: 'Shortest Path Patterns', difficulty: 'Hard', timeComplexity: 'O((V + E) log V)', spaceComplexity: 'O(V)', description: 'Dijkstra Minimum Cost, Network Delay, and Flights.', section: 'Graph Patterns' },
      { id: 'mst-patterns', title: 'Minimum Spanning Tree Patterns', difficulty: 'Hard', timeComplexity: 'O(E log E)', spaceComplexity: 'O(V)', description: 'Kruskal, Prim, and Connecting City Infrastructure.', section: 'Graph Patterns' },
      { id: 'state-compression-dp-pattern', title: 'State Compression DP Pattern', difficulty: 'Hard', timeComplexity: 'O(2^N * N^2)', spaceComplexity: 'O(2^N * N)', description: 'Bitmask DP, Traveling Salesperson, and Subsets DP.', section: 'Advanced DP' },
      { id: 'kmp', title: 'KMP String Matching', difficulty: 'Hard', timeComplexity: 'O(N+M)', spaceComplexity: 'O(M)', description: 'Find substring using the LPS array.', section: 'String Patterns' },
      { id: 'rabin-karp', title: 'Rabin-Karp', difficulty: 'Medium', timeComplexity: 'O(N+M)', spaceComplexity: 'O(1)', description: 'Find substring using Rolling Hash.', section: 'String Patterns' }
    ] 
  },
  {
    id: "greedy-algorithms",
    title: "Greedy Algorithms",
    count: 23,
    desc: "Make locally optimal choices to find global solutions. Master interval scheduling, heaps, and array greedy strategies.",
    overview: "A Greedy Algorithm makes the locally optimal choice at each step with the hope of finding a global optimum. Learn when greedy works, why it fails, how to prove greedy choice properties, and pattern recognition for interview problem solving.",
    objectives: [
      "Understand Local vs Global Optimum and the Greedy Choice Property.",
      "Identify greedy subproblem properties and proving optimality.",
      "Master Interval Scheduling, Activity Selection, and Sweep Line techniques.",
      "Use Priority Queues to make efficient greedy choices in O(log N) time."
    ],
    Icon: CategoryIcons.Greedy,
    color: "from-yellow-500 to-amber-400",
    hasIntro: true,
    algorithms: [
      { id: 'greedy-intro', title: 'Introduction to Greedy', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Core principles: local optimum, global optimum, choices, and failure cases.', section: 'Fundamentals' },
      { id: 'greedy-vs-brute-force', title: 'Greedy vs Brute Force', difficulty: 'Easy', timeComplexity: 'O(N) vs O(2ⁿ)', spaceComplexity: 'O(1)', description: 'Tradeoff between exhaustive search and immediate choice decisions.', section: 'Fundamentals' },
      { id: 'greedy-vs-dp', title: 'Greedy vs Dynamic Programming', difficulty: 'Easy', timeComplexity: 'O(N log N) vs O(N×W)', spaceComplexity: 'O(1)', description: 'When local choice is sufficient vs when subproblem overlap requires DP.', section: 'Fundamentals' },
      { id: 'identify-greedy', title: 'How to Identify Greedy Problems', difficulty: 'Easy', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', description: 'Interview heuristics: sorting, min/max choices, non-overlapping intervals.', section: 'Fundamentals' },

      { id: 'activity-selection', title: 'Activity Selection', difficulty: 'Easy', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'Select maximum non-conflicting activities by sorting finish times.', section: 'Classic Problems' },
      { id: 'fractional-knapsack', title: 'Fractional Knapsack', difficulty: 'Easy', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'Maximize value by taking items sorted by value-to-weight ratio.', section: 'Classic Problems' },
      { id: 'job-sequencing', title: 'Job Sequencing with Deadlines', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Schedule jobs in free slots before deadlines to maximize profit.', section: 'Classic Problems' },
      { id: 'huffman-encoding', title: 'Huffman Encoding', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Construct optimal prefix codes by merging lowest character frequencies.', section: 'Classic Problems' },
      { id: 'minimum-platforms', title: 'Minimum Platforms', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'Determine minimum railway platforms needed using arrival/departure sorting.', section: 'Classic Problems' },
      { id: 'meeting-rooms', title: 'Meeting Rooms', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Find minimum meeting rooms required for overlapping time slots.', section: 'Classic Problems' },

      { id: 'non-overlapping-intervals', title: 'Non Overlapping Intervals', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'Find minimum number of intervals to remove to make remaining non-overlapping.', section: 'Interval Problems' },
      { id: 'merge-intervals', title: 'Merge Intervals', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Combine all overlapping intervals after sorting by start time.', section: 'Interval Problems' },
      { id: 'insert-interval', title: 'Insert Interval', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', description: 'Insert new interval into sorted non-overlapping list and merge if necessary.', section: 'Interval Problems' },
      { id: 'minimum-arrows-balloons', title: 'Minimum Arrows to Burst Balloons', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'Shoot minimum vertical arrows to burst all overlapping balloon intervals.', section: 'Interval Problems' },

      { id: 'jump-game', title: 'Jump Game', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Determine if you can reach the last index by tracking max reachable reach.', section: 'Array Greedy' },
      { id: 'jump-game-ii', title: 'Jump Game II', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Find minimum number of jumps to reach end using layer-by-layer window.', section: 'Array Greedy' },
      { id: 'gas-station', title: 'Gas Station', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Find starting station index to complete circular tour with net fuel surplus.', section: 'Array Greedy' },
      { id: 'candy-distribution', title: 'Candy Distribution', difficulty: 'Hard', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', description: 'Distribute minimum candies to children based on ratings using left & right passes.', section: 'Array Greedy' },

      { id: 'task-scheduling-greedy', title: 'Task Scheduling', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Calculate minimum CPU time to execute tasks with cooldown period n.', section: 'Advanced Greedy' },
      { id: 'ipo', title: 'IPO', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Maximize final capital by picking top profit projects available within capital limit.', section: 'Advanced Greedy' },
      { id: 'reorganize-string', title: 'Reorganize String', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Rearrange characters so no adjacent characters are identical using Max Heap.', section: 'Advanced Greedy' },
      { id: 'min-cost-connect-ropes', title: 'Minimum Cost to Connect Ropes', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Connect all ropes into one rope with minimum cost by repeatedly merging 2 smallest.', section: 'Advanced Greedy' },
      { id: 'greedy-scheduling', title: 'Greedy Scheduling Problems', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Optimize total penalty and weighted completion times in complex schedulers.', section: 'Advanced Greedy' }
    ]
  }
];
