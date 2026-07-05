import { ComplexityChallenge } from '../../types/practice';

export const COMPLEXITY_BANK: ComplexityChallenge[] = [
  {
    id: 'comp-1',
    title: 'Nested Dependent Loops',
    difficulty: 'Medium',
    pattern: 'Loops',
    codeSnippet: `function printPairs(n: number) {
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            console.log(i, j);
        }
    }
}`,
    optionsTime: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'],
    correctTime: 'O(N²)',
    optionsSpace: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
    correctSpace: 'O(1)',
    explanation: `The outer loop runs N times. The inner loop runs (N-i) times. The total number of iterations is the sum of the first N integers: N + (N-1) + (N-2) + ... + 1. 
By Gauss's formula, this equals N(N+1)/2, which simplifies to O(N²) time. 
Space complexity is O(1) because we only allocate variables \`i\` and \`j\`, regardless of N.`
  },
  {
    id: 'comp-2',
    title: 'Recursive Fibonacci (Naive)',
    difficulty: 'Medium',
    pattern: 'Recursion',
    codeSnippet: `function fib(n: number): number {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`,
    optionsTime: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'],
    correctTime: 'O(2^N)',
    optionsSpace: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
    correctSpace: 'O(N)',
    explanation: `This is a classic exponential time recursion. Each call branches into 2 more calls, creating a tree of depth N. Thus, the time complexity is O(2^N).
The space complexity is determined by the maximum depth of the call stack, which goes as deep as N, so space is O(N).`
  },
  {
    id: 'comp-3',
    title: 'Binary Search Tree Traversal',
    difficulty: 'Easy',
    pattern: 'Trees',
    codeSnippet: `function inorderTraversal(root: TreeNode | null, result: number[] = []) {
    if (!root) return result;
    
    inorderTraversal(root.left, result);
    result.push(root.val);
    inorderTraversal(root.right, result);
    
    return result;
}`,
    optionsTime: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctTime: 'O(N)',
    optionsSpace: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
    correctSpace: 'O(N)',
    explanation: `Time complexity is O(N) because the algorithm visits every single node exactly once to build the result array.
Space complexity is O(N) for two reasons: the \`result\` array stores N elements, and the recursion call stack will go as deep as the height of the tree (which is O(N) in the worst-case skewed tree, or O(log N) in a balanced tree). In Big-O, we state the worst-case, which is O(N).`
  }
];
