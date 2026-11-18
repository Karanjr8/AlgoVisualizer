/**
 * Complexity Laboratory - Mathematical and Utility Functions
 * Pure calculations for Big-O asymptotic growth and formatting
 */

export type ComplexityId =
  | 'o_1'
  | 'o_log_n'
  | 'o_n'
  | 'o_n_log_n'
  | 'o_n_2'
  | 'o_n_3'
  | 'o_2_n'
  | 'o_n_fact';

export type GrowthCategory =
  | 'Constant'
  | 'Logarithmic'
  | 'Linear'
  | 'Linearithmic'
  | 'Quadratic'
  | 'Cubic'
  | 'Exponential'
  | 'Factorial';

export type PerformanceTier =
  | 'Excellent'
  | 'Good'
  | 'Fair'
  | 'Acceptable'
  | 'Slow'
  | 'Very Slow'
  | 'Horrible'
  | 'Intractable';

export interface ComplexityDefinition {
  id: ComplexityId;
  notation: string;
  name: string;
  growthType: GrowthCategory;
  color: string;
  badgeBg: string;
  badgeText: string;
  tier: PerformanceTier;
  tierColor: string;
  description: string;
  intuition: string;
  formula: string;
  examples: string[];
  calc: (n: number) => number;
  // Calculate log10 of the operation count directly for safe high-precision graphing
  log10Calc: (n: number) => number;
}

// Precomputed factorials up to 20 for instant O(1) table lookup
const FACT_TABLE: number[] = [
  1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800,
  39916800, 479001600, 6227020800, 87178291200, 1307674368000,
  20922789888000, 355687428096000, 6402373705728000,
  121645100408832000, 2432902008176640000,
];

// Stirling's approximation for factorial log10: ln(n!) ≈ n*ln(n) - n + 0.5*ln(2*pi*n)
function factorialLog10(n: number): number {
  if (n <= 1) return 0;
  if (n <= 20) {
    return Math.log10(FACT_TABLE[n]);
  }
  const lnFactorial = n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n);
  return lnFactorial / Math.LN10;
}

export function calculateFactorial(n: number): number {
  if (n <= 1) return 1;
  if (n <= 20) return FACT_TABLE[n];
  if (n > 170) return Infinity; // JavaScript 64-bit float overflows above 170!
  let res = FACT_TABLE[20];
  for (let i = 21; i <= n; i++) {
    res *= i;
  }
  return res;
}

export const COMPLEXITY_DEFINITIONS: ComplexityDefinition[] = [
  {
    id: 'o_1',
    notation: 'O(1)',
    name: 'Constant Time',
    growthType: 'Constant',
    color: '#10b981', // emerald-500
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeText: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    tier: 'Excellent',
    tierColor: 'bg-emerald-500 text-white',
    description: 'Execution time remains constant regardless of the input size N.',
    intuition: 'Accessing an item by index or checking a boolean flag takes the exact same number of machine steps whether N is 1 or 1,000,000.',
    formula: 'f(n) = 1',
    examples: ['Array index lookup (arr[i])', 'Hash table lookup (average)', 'Push/Pop on a Stack', 'Checking parity (n % 2)'],
    calc: () => 1,
    log10Calc: () => 0,
  },
  {
    id: 'o_log_n',
    notation: 'O(log n)',
    name: 'Logarithmic Time',
    growthType: 'Logarithmic',
    color: '#06b6d4', // cyan-500
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    badgeText: 'text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    tier: 'Good',
    tierColor: 'bg-cyan-500 text-white',
    description: 'Execution time grows logarithmically by halving the search space at each step.',
    intuition: 'Each comparison eliminates half of the remaining items. Doubling input N only adds a single extra operation.',
    formula: 'f(n) = log₂(n)',
    examples: ['Binary Search on sorted array', 'Balanced Binary Search Tree lookup (AVL/Red-Black)', 'Finding GCD (Euclidean Algorithm)', 'Exponentiation by squaring'],
    calc: (n) => Math.max(1, Math.log2(Math.max(1, n))),
    log10Calc: (n) => Math.log10(Math.max(1, Math.log2(Math.max(1, n)))),
  },
  {
    id: 'o_n',
    notation: 'O(n)',
    name: 'Linear Time',
    growthType: 'Linear',
    color: '#3b82f6', // blue-500
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    badgeText: 'text-blue-600 dark:text-blue-400 border-blue-500/30',
    tier: 'Fair',
    tierColor: 'bg-blue-500 text-white',
    description: 'Execution time grows in direct 1:1 proportion to the input size N.',
    intuition: 'Every element in the dataset must be inspected at least once. If N triples, work triples.',
    formula: 'f(n) = n',
    examples: ['Linear Search', 'Array traversal / Finding min or max', 'Counting elements / Summing', 'String pattern matching (KMP)'],
    calc: (n) => Math.max(1, n),
    log10Calc: (n) => Math.log10(Math.max(1, n)),
  },
  {
    id: 'o_n_log_n',
    notation: 'O(n log n)',
    name: 'Linearithmic Time',
    growthType: 'Linearithmic',
    color: '#8b5cf6', // violet-500
    badgeBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    badgeText: 'text-violet-600 dark:text-violet-400 border-violet-500/30',
    tier: 'Acceptable',
    tierColor: 'bg-violet-500 text-white',
    description: 'Performs a logarithmic number of steps for each of the N elements (divide-and-conquer).',
    intuition: 'The theoretical best-case bound for comparison-based sorting algorithms. Scales remarkably well even for millions of elements.',
    formula: 'f(n) = n · log₂(n)',
    examples: ['Merge Sort', 'Quick Sort (average case)', 'Heap Sort', 'Fast Fourier Transform (FFT)'],
    calc: (n) => Math.max(1, n * Math.log2(Math.max(1, n))),
    log10Calc: (n) => Math.log10(Math.max(1, n * Math.log2(Math.max(1, n)))),
  },
  {
    id: 'o_n_2',
    notation: 'O(n²)',
    name: 'Quadratic Time',
    growthType: 'Quadratic',
    color: '#f59e0b', // amber-500
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeText: 'text-amber-600 dark:text-amber-400 border-amber-500/30',
    tier: 'Slow',
    tierColor: 'bg-amber-500 text-white',
    description: 'Execution time grows proportionally to the square of the input size (nested loops).',
    intuition: 'Comparing every item against every other item. Doubling N multiplies the required operations by 4x. Quickly stalls for large N.',
    formula: 'f(n) = n²',
    examples: ['Bubble Sort', 'Selection Sort', 'Insertion Sort (worst case)', 'Nested pairwise comparisons'],
    calc: (n) => Math.max(1, n * n),
    log10Calc: (n) => Math.log10(Math.max(1, n * n)),
  },
  {
    id: 'o_n_3',
    notation: 'O(n³)',
    name: 'Cubic Time',
    growthType: 'Cubic',
    color: '#f43f5e', // rose-500
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    badgeText: 'text-rose-600 dark:text-rose-400 border-rose-500/30',
    tier: 'Very Slow',
    tierColor: 'bg-rose-500 text-white',
    description: 'Execution time grows proportionally to the cube of N (triple nested loops).',
    intuition: 'Triply nested iterations. Doubling N multiplies operations by 8x. Becomes painfully slow even with modest inputs (N > 500).',
    formula: 'f(n) = n³',
    examples: ['Naive Matrix Multiplication', 'Floyd-Warshall All-Pairs Shortest Path', '3SUM brute force', 'Triple nested coordinate grids'],
    calc: (n) => Math.max(1, Math.pow(n, 3)),
    log10Calc: (n) => Math.log10(Math.max(1, Math.pow(n, 3))),
  },
  {
    id: 'o_2_n',
    notation: 'O(2ⁿ)',
    name: 'Exponential Time',
    growthType: 'Exponential',
    color: '#d946ef', // fuchsia-500
    badgeBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20',
    badgeText: 'text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30',
    tier: 'Horrible',
    tierColor: 'bg-fuchsia-600 text-white',
    description: 'Operations double with every single additional item added to the input (N + 1).',
    intuition: 'Explores all subsets or possibilities. At N=50, the operations exceed the number of grains of sand on Earth.',
    formula: 'f(n) = 2ⁿ',
    examples: ['Recursive Fibonacci (naive)', '0/1 Knapsack (brute force)', 'Tower of Hanoi', 'Generating all power sets / subsets'],
    calc: (n) => {
      if (n > 1023) return Infinity;
      return Math.pow(2, n);
    },
    log10Calc: (n) => n * Math.log10(2),
  },
  {
    id: 'o_n_fact',
    notation: 'O(n!)',
    name: 'Factorial Time',
    growthType: 'Factorial',
    color: '#ef4444', // red-500
    badgeBg: 'bg-red-500/10 dark:bg-red-500/20',
    badgeText: 'text-red-600 dark:text-red-400 border-red-500/30',
    tier: 'Intractable',
    tierColor: 'bg-red-600 text-white',
    description: 'Generates every permutation or ordering of N items. Steepest growth rate in common algorithms.',
    intuition: 'At N=20, 20! is over 2.4 quintillion operations. Even on a supercomputer doing 10¹⁸ ops/sec, N=25 would take centuries.',
    formula: 'f(n) = n!',
    examples: ['Traveling Salesperson Problem (brute force)', 'Generating all permutations', 'Exact String Alignment (naive)', 'Bogosort worst case'],
    calc: (n) => calculateFactorial(n),
    log10Calc: (n) => factorialLog10(n),
  },
];

export interface AlgorithmComplexityInfo {
  id: string;
  name: string;
  category: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  primaryComplexityId: ComplexityId;
  description: string;
  summary: string;
}

export const ALGORITHM_COMPLEXITY_DATA: AlgorithmComplexityInfo[] = [
  {
    id: 'binary_search',
    name: 'Binary Search',
    category: 'Searching',
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(1)',
    primaryComplexityId: 'o_log_n',
    description: 'Halves the search interval repeatedly in a sorted array.',
    summary: 'Best: target found at middle immediately (O(1)). Worst/Average: halving search space yields logarithmic O(log n) time.',
  },
  {
    id: 'linear_search',
    name: 'Linear Search',
    category: 'Searching',
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    primaryComplexityId: 'o_n',
    description: 'Sequentially checks every element from beginning to end until match is found.',
    summary: 'Best: target is the very first element (O(1)). Worst: target is at the end or absent, inspecting all N elements (O(n)).',
  },
  {
    id: 'hash_table',
    name: 'Hash Table Lookup',
    category: 'Data Structures',
    best: 'O(1)',
    average: 'O(1)',
    worst: 'O(n)',
    space: 'O(n)',
    primaryComplexityId: 'o_1',
    description: 'Maps keys to bucket indices using a hash function.',
    summary: 'Direct array indexing through hashing provides O(1) expected lookup. Pathological collisions degrade to O(n).',
  },
  {
    id: 'bubble_sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    primaryComplexityId: 'o_n_2',
    description: 'Repeatedly steps through list, comparing adjacent elements and swapping if out of order.',
    summary: 'Best case with early-termination flag on sorted list is O(n). Average and worst require nested passes: n*(n-1)/2 ≈ O(n²).',
  },
  {
    id: 'selection_sort',
    name: 'Selection Sort',
    category: 'Sorting',
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    primaryComplexityId: 'o_n_2',
    description: 'Repeatedly finds minimum element from unsorted portion and moves it to the front.',
    summary: 'Always performs nested loops regardless of initial arrangement. Best, Average, and Worst are all strictly O(n²).',
  },
  {
    id: 'insertion_sort',
    name: 'Insertion Sort',
    category: 'Sorting',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    primaryComplexityId: 'o_n_2',
    description: 'Builds sorted array one element at a time by sliding elements into their correct position.',
    summary: 'Linear O(n) when array is already sorted. In reverse sorted order, each insertion shifts all prior elements, taking O(n²).',
  },
  {
    id: 'merge_sort',
    name: 'Merge Sort',
    category: 'Sorting',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    primaryComplexityId: 'o_n_log_n',
    description: 'Divide-and-conquer: divides array in halves, recursively sorts them, then merges.',
    summary: 'Log₂ n recursive split levels, each performing O(n) total linear merging work. Guarantees O(n log n) in all cases.',
  },
  {
    id: 'quick_sort',
    name: 'Quick Sort',
    category: 'Sorting',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    primaryComplexityId: 'o_n_log_n',
    description: 'Partitions array around a pivot element into smaller and larger subarrays.',
    summary: 'Balanced pivots divide problem into log n levels of n work (O(n log n)). Extremely unbalanced pivots (already sorted + naive pivot) degrade to O(n²).',
  },
  {
    id: 'heap_sort',
    name: 'Heap Sort',
    category: 'Sorting',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
    primaryComplexityId: 'o_n_log_n',
    description: 'Builds a max-heap and repeatedly extracts the root to sort in-place.',
    summary: 'Heapify takes O(n), followed by n deletions each costing O(log n). Provides in-place O(n log n) worst-case time.',
  },
  {
    id: 'matrix_mult',
    name: 'Naive Matrix Multiplication',
    category: 'Mathematics',
    best: 'O(n³)',
    average: 'O(n³)',
    worst: 'O(n³)',
    space: 'O(n²)',
    primaryComplexityId: 'o_n_3',
    description: 'Computes dot products for each cell of an N×N result matrix using three nested loops.',
    summary: 'Requires calculating N² cells, each taking N multiplication/addition steps, resulting in strict O(n³) operations.',
  },
  {
    id: 'fibonacci_recursive',
    name: 'Naive Recursive Fibonacci',
    category: 'Recursion',
    best: 'O(2ⁿ)',
    average: 'O(2ⁿ)',
    worst: 'O(2ⁿ)',
    space: 'O(n)',
    primaryComplexityId: 'o_2_n',
    description: 'Computes fib(n) = fib(n-1) + fib(n-2) without memoization or dynamic programming.',
    summary: 'Binary recursion tree branches into 2 calls per level up to depth n, performing ≈ 2ⁿ total function invocations.',
  },
  {
    id: 'tsp_brute_force',
    name: 'Traveling Salesperson (Brute Force)',
    category: 'Combinatorics',
    best: 'O(n!)',
    average: 'O(n!)',
    worst: 'O(n!)',
    space: 'O(n)',
    primaryComplexityId: 'o_n_fact',
    description: 'Evaluates total tour distance for all (n-1)! possible visiting permutations of N cities.',
    summary: 'Evaluating all Hamiltonian cycles requires (n-1)! permutations. At N=20, this exceeds 10¹⁷ total routes.',
  },
];

/**
 * Format large operational counts cleanly:
 * - Exact integers for values < 10,000
 * - SI suffixes (K, M, B, T) for 10,000 to 10^12
 * - Scientific notation with superscript for >= 10^12
 * - Safe handling of Infinity or astronomical values
 */
export function formatOperations(val: number): string {
  if (isNaN(val)) return '0';
  if (val === Infinity) return '∞ (Overflow)';
  if (val < 1) return val.toFixed(1);
  if (val < 10000) return Math.round(val).toLocaleString();

  // SI prefixes up to Trillions
  if (val < 1e6) {
    return `${(val / 1e3).toFixed(1)}K`;
  }
  if (val < 1e9) {
    return `${(val / 1e6).toFixed(2)}M`;
  }
  if (val < 1e12) {
    return `${(val / 1e9).toFixed(2)}B`;
  }
  if (val < 1e15) {
    return `${(val / 1e12).toFixed(2)}T`;
  }

  // Scientific notation formatting
  const exponent = Math.floor(Math.log10(val));
  const mantissa = val / Math.pow(10, exponent);
  return `${mantissa.toFixed(2)} × 10${toSuperscript(exponent)}`;
}

/**
 * Formats a log10 value directly into scientific notation
 * Useful when raw value exceeds JavaScript Number.MAX_VALUE (e.g. n! or 2^n for n > 1024)
 */
export function formatFromLog10(log10Val: number): string {
  if (isNaN(log10Val)) return '0';
  if (log10Val <= 0) return '1';
  if (log10Val < 4) {
    const raw = Math.pow(10, log10Val);
    return Math.round(raw).toLocaleString();
  }
  if (log10Val < 6) {
    const raw = Math.pow(10, log10Val);
    return `${(raw / 1e3).toFixed(1)}K`;
  }
  if (log10Val < 9) {
    const raw = Math.pow(10, log10Val);
    return `${(raw / 1e6).toFixed(2)}M`;
  }
  if (log10Val < 12) {
    const raw = Math.pow(10, log10Val);
    return `${(raw / 1e9).toFixed(2)}B`;
  }
  if (log10Val < 15) {
    const raw = Math.pow(10, log10Val);
    return `${(raw / 1e12).toFixed(2)}T`;
  }

  // Large exponents
  const exponent = Math.floor(log10Val);
  const mantissa = Math.pow(10, log10Val - exponent);
  return `${mantissa.toFixed(2)} × 10${toSuperscript(exponent)}`;
}

export function toSuperscript(num: number): string {
  const map: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '-': '⁻',
  };
  return String(num)
    .split('')
    .map((c) => map[c] || c)
    .join('');
}

