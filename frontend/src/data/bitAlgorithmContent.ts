import type { AlgorithmContent } from './algorithmContent';

export const bitAlgorithmContent: Record<string, AlgorithmContent> = {
  "fenwick-tree-intro": {
    id: "fenwick-tree-intro",
    introduction: "A Binary Indexed Tree (BIT), also called a Fenwick Tree, is a compact data structure that maintains prefix sums over a dynamic array in O(log N) time per update and query while using only N extra space and 10 lines of code.",
    intuition: "Think of BIT as an intelligent accounting ledger. Instead of storing cumulative totals for all previous elements (which makes updates slow) or storing raw numbers (which makes queries slow), each BIT index stores the sum of a specific sub-range whose length is determined by the index's lowest set bit (LSB).",
    walkthrough: [
      { phase: "1-Based Array Indexing", description: "BIT uses 1-based indexing [1...N]. The binary representation of index i determines the range of elements it covers." },
      { phase: "LSB Range Responsibility", description: "BIT[i] stores the sum of elements from index (i - lowbit(i) + 1) to i. Range length is lowbit(i) = i & -i." },
      { phase: "O(log N) Point Update", description: "To add value V at index i, step upward to all ancestor responsibility ranges using i += i & -i." },
      { phase: "O(log N) Prefix Sum Query", description: "To calculate prefix sum from index 1 to i, step backward decomposing the range using i -= i & -i." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3, 7, 8] | Query prefix sum up to index 7",
      output: "Prefix Sum(7) = 31",
      steps: [
        "Index 7 (0111_2): lowbit(7) = 1. Add BIT[7] = 7. Next index: 7 - 1 = 6.",
        "Index 6 (0110_2): lowbit(6) = 2. Add BIT[6] = 12. Next index: 6 - 2 = 4.",
        "Index 4 (0100_2): lowbit(4) = 4. Add BIT[4] = 12. Next index: 4 - 4 = 0.",
        "Index 0 reached! Total Prefix Sum = 7 + 12 + 12 = 31."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "Both point update and prefix query step through set bits in binary representation. Since a number up to N has at most log2(N) set bits, operations run in O(log N) time with 1D array space."
    },
    code: {
      cpp: `// Binary Indexed Tree (Fenwick Tree) C++ Implementation
#include <iostream>
#include <vector>
using namespace std;

class FenwickTree {
    int n;
    vector<int> bit;

public:
    FenwickTree(int n) : n(n), bit(n + 1, 0) {}

    FenwickTree(const vector<int>& arr) : n(arr.size()), bit(arr.size() + 1, 0) {
        for (int i = 0; i < n; i++) {
            add(i + 1, arr[i]);
        }
    }

    void add(int i, int delta) {
        for (; i <= n; i += i & -i) {
            bit[i] += delta;
        }
    }

    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) {
            sum += bit[i];
        }
        return sum;
    }

    int queryRange(int l, int r) {
        return query(r) - query(l - 1);
    }
};`,
      java: `// Fenwick Tree Java Implementation
public class FenwickTree {
    private int n;
    private int[] bit;

    public FenwickTree(int n) {
        this.n = n;
        this.bit = new int[n + 1];
    }

    public FenwickTree(int[] arr) {
        this(arr.length);
        for (int i = 0; i < arr.length; i++) {
            add(i + 1, arr[i]);
        }
    }

    public void add(int i, int delta) {
        for (; i <= n; i += i & -i) {
            bit[i] += delta;
        }
    }

    public int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) {
            sum += bit[i];
        }
        return sum;
    }

    public int queryRange(int l, int r) {
        return query(r) - query(l - 1);
    }
}`,
      python: `# Fenwick Tree Python Implementation
class FenwickTree:
    def __init__(self, n_or_arr):
        if isinstance(n_or_arr, int):
            self.n = n_or_arr
            self.bit = [0] * (self.n + 1)
        else:
            self.n = len(n_or_arr)
            self.bit = [0] * (self.n + 1)
            for i, val in enumerate(n_or_arr):
                self.add(i + 1, val)

    def add(self, i, delta):
        while i <= self.n:
            self.bit[i] += delta
            i += i & -i

    def query(self, i):
        total = 0
        while i > 0:
            total += self.bit[i]
            i -= i & -i
        return total

    def query_range(self, l, r):
        return self.query(r) - self.query(l - 1)`,
      javascript: `// Fenwick Tree JavaScript Implementation
class FenwickTree {
  constructor(sizeOrArr) {
    if (typeof sizeOrArr === 'number') {
      this.n = sizeOrArr;
      this.bit = new Array(this.n + 1).fill(0);
    } else {
      this.n = sizeOrArr.length;
      this.bit = new Array(this.n + 1).fill(0);
      for (let i = 0; i < this.n; i++) {
        this.add(i + 1, sizeOrArr[i]);
      }
    }
  }

  add(i, delta) {
    for (; i <= this.n; i += i & -i) {
      this.bit[i] += delta;
    }
  }

  query(i) {
    let sum = 0;
    for (; i > 0; i -= i & -i) {
      sum += this.bit[i];
    }
    return sum;
  }

  queryRange(l, r) {
    return this.query(r) - this.query(l - 1);
  }
}`
    },
    interviewNotes: {
      mistakes: [
        "Using 0-based index directly in BIT loops. BIT REQUIRES 1-based indexing because lowbit(0) = 0 & -0 = 0 causing an infinite loop!",
        "Confusing add(i, delta) which adds a difference, with set(i, val) which overwrites the value (set requires delta = val - old_val)."
      ],
      edgeCases: ["Query index i = 0 (returns 0)", "Single element array N = 1", "Range query L > R"],
      tips: [
        "Use BIT when you only need range sum/XOR and point updates — code is 10 lines vs 80 lines for Segment Tree!",
        "Remember: Add steps UP (i += i & -i), Query steps DOWN (i -= i & -i)."
      ]
    },
    practiceProblems: [
      { title: "Range Sum Query - Mutable", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-mutable/" },
      { title: "Dynamic Range Sum Queries (CSES)", difficulty: "Medium", url: "https://cses.fi/problemset/task/1648" }
    ],
    relatedTopics: [
      { title: "Lowbit Operation", id: "lowbit-operation" },
      { title: "BIT Structure", id: "bit-structure" },
      { title: "Point Update", id: "bit-point-update" }
    ]
  },

  "prefix-sum-refresher": {
    id: "prefix-sum-refresher",
    introduction: "A Prefix Sum Array precomputes cumulative totals P[i] = A[0] + ... + A[i], enabling O(1) static range sum queries P[R] - P[L-1]. However, point updates require O(N) time to recompute the entire prefix array.",
    intuition: "Prefix sums trade precomputation for ultra-fast queries. If an array is static (never modified), Prefix Sum is perfect. But when elements change dynamically, updating a single number forces every downstream prefix to recalculate — creating an O(N) bottleneck.",
    walkthrough: [
      { phase: "Precomputation", description: "Compute P[i] = P[i-1] + A[i] in O(N) time." },
      { phase: "O(1) Range Query", description: "Sum range [L, R] = P[R] - P[L-1] in constant O(1) time." },
      { phase: "O(N) Update Bottleneck", description: "Updating A[k] forces updating P[k], P[k+1], ..., P[N-1] in linear O(N) time." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | Query range [1, 4]",
      output: "Sum = P[4] - P[0] = 21 - 2 = 19",
      steps: [
        "Construct Prefix Array: P = [2, 7, 8, 12, 21, 24].",
        "Query range [1, 4]: P[4] - P[0] = 21 - 2 = 19.",
        "Point update index 2 to value 10: Must recompute P[2]..P[5] (O(N) operations!)."
      ]
    },
    complexities: {
      time: { best: "O(1) query / O(N) update", average: "O(1) query / O(N) update", worst: "O(1) query / O(N) update" },
      space: "O(N)",
      analysis: "Static queries are O(1), but dynamic updates take O(N) time. Fenwick Tree bridges this gap to provide O(log N) for BOTH query and update."
    },
    code: {
      cpp: `// Standard Static Prefix Sum Array
#include <vector>
using namespace std;

class PrefixSum {
    vector<int> pref;
public:
    PrefixSum(const vector<int>& arr) {
        int n = arr.size();
        pref.resize(n);
        pref[0] = arr[0];
        for (int i = 1; i < n; i++) pref[i] = pref[i - 1] + arr[i];
    }
    int query(int l, int r) {
        if (l == 0) return pref[r];
        return pref[r] - pref[l - 1];
    }
};`,
      java: `public class PrefixSum {
    private int[] pref;
    public PrefixSum(int[] arr) {
        pref = new int[arr.length];
        pref[0] = arr[0];
        for (int i = 1; i < arr.length; i++) pref[i] = pref[i - 1] + arr[i];
    }
    public int query(int l, int r) {
        if (l == 0) return pref[r];
        return pref[r] - pref[l - 1];
    }
}`,
      python: `class PrefixSum:
    def __init__(self, arr):
        self.pref = [0] * len(arr)
        self.pref[0] = arr[0]
        for i in range(1, len(arr)):
            self.pref[i] = self.pref[i-1] + arr[i]

    def query(self, l, r):
        if l == 0: return self.pref[r]
        return self.pref[r] - self.pref[l-1]`,
      javascript: `class PrefixSum {
  constructor(arr) {
    this.pref = new Array(arr.length);
    this.pref[0] = arr[0];
    for (let i = 1; i < arr.length; i++) this.pref[i] = this.pref[i - 1] + arr[i];
  }
  query(l, r) {
    if (l === 0) return this.pref[r];
    return this.pref[r] - this.pref[l - 1];
  }
}`
    },
    interviewNotes: {
      mistakes: ["Using Prefix Sum Array when the problem involves dynamic updates."],
      edgeCases: ["L = 0 query (avoid out-of-bounds P[-1])"],
      tips: ["Static queries? Use Prefix Sum. Dynamic updates? Use Fenwick Tree or Segment Tree."]
    },
    practiceProblems: [
      { title: "Range Sum Query - Immutable", difficulty: "Easy", url: "https://leetcode.com/problems/range-sum-query-immutable/" }
    ],
    relatedTopics: [
      { title: "Why BIT Exists", id: "why-bit-exists" },
      { title: "Fenwick Tree Intro", id: "fenwick-tree-intro" }
    ]
  },

  "why-bit-exists": {
    id: "why-bit-exists",
    introduction: "Binary Indexed Tree (BIT) exists to solve the fundamental trade-off between naive arrays (fast updates O(1), slow queries O(N)) and prefix sum arrays (fast queries O(1), slow updates O(N)) by achieving O(log N) for both.",
    intuition: "Instead of choosing between zero precomputation (array) or full precomputation (prefix sum), BIT performs Partial Precomputation. It breaks the prefix sum into log N binary sub-ranges, allowing both query and update to modify only log N cells.",
    walkthrough: [
      { phase: "Naive Array", description: "Update: O(1). Query: O(N). For Q queries, total time O(Q * N) -> TLE." },
      { phase: "Prefix Sum Array", description: "Query: O(1). Update: O(N). For U updates, total time O(U * N) -> TLE." },
      { phase: "Fenwick Tree (BIT)", description: "Query: O(log N). Update: O(log N). Total time O((Q + U) log N) -> Optimal 0.01s!" }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | Perform 1000 Queries & 1000 Updates",
      output: "BIT takes 1000 * log2(6) ≈ 3000 ops vs Naive/Prefix 6,000,000 ops!",
      steps: [
        "Query sum(0, 4): BIT decomposes range into BIT[4] + BIT[5] (2 ops).",
        "Update index 2: BIT updates BIT[3], BIT[4] (2 ops).",
        "Both operations run in under 3 operations!"
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "BIT balances query and update workloads perfectly at O(log N) per operation."
    },
    code: {
      cpp: `// Trade-off summary: Fenwick Tree vs Naive vs Prefix
// Fenwick Tree: Add O(log N), Query O(log N), Space O(N), Code 10 lines`,
      java: `// Trade-off summary: Fenwick Tree vs Naive vs Prefix
// Fenwick Tree: Add O(log N), Query O(log N), Space O(N), Code 10 lines`,
      python: `# Trade-off summary: Fenwick Tree vs Naive vs Prefix
# Fenwick Tree: Add O(log N), Query O(log N), Space O(N), Code 10 lines`,
      javascript: `// Trade-off summary: Fenwick Tree vs Naive vs Prefix
// Fenwick Tree: Add O(log N), Query O(log N), Space O(N), Code 10 lines`
    },
    interviewNotes: {
      mistakes: ["Using Segment Tree when Fenwick Tree is sufficient (BIT has 4x less memory and 3x faster constant factor)."],
      edgeCases: ["N = 10^5 operations"],
      tips: ["If problem only requires point updates and range sums, Fenwick Tree is preferred over Segment Tree by competitive programmers."]
    },
    practiceProblems: [
      { title: "Dynamic Range Sum Queries (CSES)", difficulty: "Medium", url: "https://cses.fi/problemset/task/1648" }
    ],
    relatedTopics: [
      { title: "Prefix Sum Refresher", id: "prefix-sum-refresher" },
      { title: "BIT Structure", id: "bit-structure" }
    ]
  },

  "bit-structure": {
    id: "bit-structure",
    introduction: "Understanding what each BIT[i] cell stores is the single most important concept in Fenwick Trees. BIT[i] stores the sum of elements in sub-array range [i - lowbit(i) + 1 ... i].",
    intuition: "Instead of every node covering the same length, BIT uses binary lengths! Index i in binary determines its responsibility length length = lowbit(i) = i & -i. Odd indices (lowbit=1) store only themselves; powers of 2 store huge prefixes!",
    walkthrough: [
      { phase: "1-Based Indexing", description: "Array A is 1-indexed [1...N]. BIT array is 1-indexed [1...N]." },
      { phase: "Lowbit Responsibility Range", description: "BIT[i] = A[i - lowbit(i) + 1] + ... + A[i]." },
      { phase: "Concrete Examples", description: "BIT[1] stores A[1] (len 1). BIT[2] stores A[1..2] (len 2). BIT[4] stores A[1..4] (len 4). BIT[6] stores A[5..6] (len 2)." }
    ],
    dryRun: {
      input: "Original Array A = [2, 5, 1, 4, 9, 3, 7, 8]",
      output: "BIT = [2, 7, 1, 12, 9, 12, 7, 39]",
      steps: [
        "BIT[1] (idx 1 = 0001_2, len 1): A[1] = 2.",
        "BIT[2] (idx 2 = 0010_2, len 2): A[1..2] = 2 + 5 = 7.",
        "BIT[3] (idx 3 = 0011_2, len 1): A[3] = 1.",
        "BIT[4] (idx 4 = 0100_2, len 4): A[1..4] = 2 + 5 + 1 + 4 = 12.",
        "BIT[5] (idx 5 = 0101_2, len 1): A[5] = 9.",
        "BIT[6] (idx 6 = 0110_2, len 2): A[5..6] = 9 + 3 = 12.",
        "BIT[7] (idx 7 = 0111_2, len 1): A[7] = 7.",
        "BIT[8] (idx 8 = 1000_2, len 8): A[1..8] = 2 + 5 + 1 + 4 + 9 + 3 + 7 + 8 = 39."
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
      space: "O(N)",
      analysis: "Each BIT cell is stored in a 1D array of size N + 1."
    },
    code: {
      cpp: `// Range Responsibility Formula:
// BIT[i] covers interval [i - (i & -i) + 1, i]
int getRangeLength(int i) { return i & -i; }
int getRangeStart(int i) { return i - (i & -i) + 1; }`,
      java: `int getRangeLength(int i) { return i & -i; }
int getRangeStart(int i) { return i - (i & -i) + 1; }`,
      python: `def get_range_length(i): return i & -i
def get_range_start(i): return i - (i & -i) + 1`,
      javascript: `function getRangeLength(i) { return i & -i; }
function getRangeStart(i) { return i - (i & -i) + 1; }`
    },
    interviewNotes: {
      mistakes: ["Thinking BIT stores tree pointers or node objects. BIT is just a flat 1D array!"],
      edgeCases: ["BIT[4] covers 4 elements, BIT[8] covers 8 elements"],
      tips: ["Any index i that is a power of 2 (1, 2, 4, 8, 16) stores the prefix sum from index 1 up to i."]
    },
    practiceProblems: [
      { title: "Binary Indexed Tree Fundamentals", difficulty: "Easy", url: "https://cses.fi/problemset/task/1648" }
    ],
    relatedTopics: [
      { title: "Lowbit Operation", id: "lowbit-operation" },
      { title: "Point Update", id: "bit-point-update" }
    ]
  },

  "lowbit-operation": {
    id: "lowbit-operation",
    introduction: "The lowbit operation `lowbit(x) = x & -x` extracts the lowest set bit (the least significant 1-bit) of integer x in O(1) bitwise time using two's complement arithmetic.",
    intuition: "In binary, `-x` is represented in two's complement as `~x + 1`. Inverting all bits (`~x`) turns the lowest set bit 1 into 0, and all trailing 0s into 1s. Adding 1 flips those trailing 1s back to 0s and restores the lowest set bit to 1! Bitwise AND (`x & -x`) cancels out all higher bits and isolates this single lowest set bit.",
    walkthrough: [
      { phase: "Binary x", description: "Let x = 6 (00000110 in binary)." },
      { phase: "Bitwise NOT (~x)", description: "~6 = 11111001 (invert all bits)." },
      { phase: "Two's Complement (-x)", description: "-6 = ~6 + 1 = 11111010." },
      { phase: "Bitwise AND (x & -x)", description: "00000110 & 11111010 = 00000010 = 2. Lowest set bit isolated!" }
    ],
    dryRun: {
      input: "x = 6 (binary 110_2)",
      output: "lowbit(6) = 2 (binary 010_2)",
      steps: [
        "x = 6 = 0110_2",
        "~x = 1001_2",
        "-x = ~x + 1 = 1010_2",
        "x & -x = 0110_2 & 1010_2 = 0010_2 = 2.",
        "Interval length stored at BIT[6] is 2 (covers indices 5 and 6)."
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
      space: "O(1)",
      analysis: "Extremely fast single CPU hardware instruction."
    },
    code: {
      cpp: `int lowbit(int x) {
    return x & -x;
}`,
      java: `int lowbit(int x) {
    return x & -x;
}`,
      python: `def lowbit(x):
    return x & -x`,
      javascript: `function lowbit(x) {
  return x & -x;
}`
    },
    interviewNotes: {
      mistakes: ["Trying to implement lowbit with a loop while(x % 2 == 0). Use `x & -x` in constant O(1) time!"],
      edgeCases: ["x = 0 (lowbit(0) = 0). BIT must NEVER call lowbit(0)."],
      tips: ["lowbit(x) gives the length of the interval responsible for BIT[x]."]
    },
    practiceProblems: [
      { title: "Number of 1 Bits", difficulty: "Easy", url: "https://leetcode.com/problems/number-of-1-bits/" }
    ],
    relatedTopics: [
      { title: "BIT Structure", id: "bit-structure" },
      { title: "Point Update", id: "bit-point-update" }
    ]
  },

  "bit-point-update": {
    id: "bit-point-update",
    introduction: "Point Update adds a difference `delta` to an element at index `idx` and updates all BIT parent responsibility cells upward by stepping `idx += idx & -idx` in O(log N) time.",
    intuition: "When element A[idx] changes, which BIT cells need to be updated? Exactly those cells whose responsibility range covers `idx`. By repeatedly adding `lowbit(idx)`, we step upward to larger parent responsibility ranges in the tree hierarchy!",
    walkthrough: [
      { phase: "Start at Target Index", description: "Set current index i = idx." },
      { phase: "Add Delta", description: "Add delta to BIT[i]." },
      { phase: "Step Upward to Parent", description: "Advance i += i & -i." },
      { phase: "Loop Termination", description: "Repeat until i > N." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3, 7, 8] | Add +3 at index 5",
      output: "BIT cells 5, 6, 8 updated by +3.",
      steps: [
        "Start i = 5 (0101_2): BIT[5] += 3 (was 9 -> now 12). Next i = 5 + lowbit(5) = 5 + 1 = 6.",
        "Step i = 6 (0110_2): BIT[6] += 3 (was 12 -> now 15). Next i = 6 + lowbit(6) = 6 + 2 = 8.",
        "Step i = 8 (1000_2): BIT[8] += 3 (was 39 -> now 42). Next i = 8 + lowbit(8) = 8 + 8 = 16 > N.",
        "Terminated! Affected nodes: 5 -> 6 -> 8. Live explanation: Node 6 stores range [5,6] containing index 5."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(1)",
      analysis: "Steps through at most log2(N) set bit propagation states."
    },
    code: {
      cpp: `void add(vector<int>& bit, int n, int i, int delta) {
    for (; i <= n; i += i & -i) {
        bit[i] += delta;
    }
}`,
      java: `void add(int[] bit, int n, int i, int delta) {
    for (; i <= n; i += i & -i) {
        bit[i] += delta;
    }
}`,
      python: `def add(bit, n, i, delta):
    while i <= n:
        bit[i] += delta
        i += i & -i`,
      javascript: `function add(bit, n, i, delta) {
  for (; i <= n; i += i & -i) {
    bit[i] += delta;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Using `bit[i] = val` instead of `bit[i] += delta`. If you want to SET value, delta = val - old_val."],
      edgeCases: ["Updating index 1", "Updating index N"],
      tips: ["Point update steps UPWARDS: `i += i & -i`."]
    },
    practiceProblems: [
      { title: "Range Sum Query - Mutable", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-mutable/" }
    ],
    relatedTopics: [
      { title: "Prefix Sum Query", id: "prefix-sum-query" },
      { title: "Range Sum Query", id: "bit-range-sum-query" }
    ]
  },

  "prefix-sum-query": {
    id: "prefix-sum-query",
    introduction: "Prefix Sum Query calculates the cumulative sum of elements from index 1 to `i` by stepping backward `i -= i & -i` and accumulating precomputed sub-range answers in O(log N) time.",
    intuition: "Any integer i can be expressed as a sum of powers of 2 (its set bits). BIT[i] covers the last binary sub-range. By subtracting `lowbit(i)`, we jump backward to the preceding disjoint sub-range until we reach 0!",
    walkthrough: [
      { phase: "Initialize Accumulator", description: "Set sum = 0, current index i = query_idx." },
      { phase: "Accumulate BIT[i]", description: "sum += BIT[i]." },
      { phase: "Step Backward", description: "Advance i -= i & -i (strip lowest set bit)." },
      { phase: "Loop Termination", description: "Repeat until i == 0. Return sum." }
    ],
    dryRun: {
      input: "BIT = [2, 7, 1, 12, 9, 12, 7, 39] | Query prefix sum up to index 7",
      output: "31",
      steps: [
        "Start i = 7 (0111_2): sum += BIT[7] (7). Range covered [7,7]. Next i = 7 - 1 = 6.",
        "Step i = 6 (0110_2): sum += BIT[6] (12). Range covered [5,6]. Next i = 6 - 2 = 4.",
        "Step i = 4 (0100_2): sum += BIT[4] (12). Range covered [1,4]. Next i = 4 - 4 = 0.",
        "Terminated at i = 0! Disjoint ranges combined: [7,7] + [5,6] + [1,4] = [1,7]. Total = 7 + 12 + 12 = 31."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(1)",
      analysis: "Strips one set bit per step. Maximum set bits in integer up to N is log2(N)."
    },
    code: {
      cpp: `int query(const vector<int>& bit, int i) {
    int sum = 0;
    for (; i > 0; i -= i & -i) {
        sum += bit[i];
    }
    return sum;
}`,
      java: `int query(int[] bit, int i) {
    int sum = 0;
    for (; i > 0; i -= i & -i) {
        sum += bit[i];
    }
    return sum;
}`,
      python: `def query(bit, i):
    total = 0
    while i > 0:
        total += bit[i]
        i -= i & -i
    return total`,
      javascript: `function query(bit, i) {
  let sum = 0;
  for (; i > 0; i -= i & -i) {
    sum += bit[i];
  }
  return sum;
}`
    },
    interviewNotes: {
      mistakes: ["Using `i >= 0` in loop condition. `i = 0` causes `0 - (0 & -0) = 0` infinite loop! Condition must be `i > 0`."],
      edgeCases: ["query(0) returns 0", "query(N) returns total array sum"],
      tips: ["Prefix Sum Query steps DOWNWARDS: `i -= i & -i`."]
    },
    practiceProblems: [
      { title: "Range Sum Query - Mutable", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-mutable/" }
    ],
    relatedTopics: [
      { title: "Point Update", id: "bit-point-update" },
      { title: "Range Sum Query", id: "bit-range-sum-query" }
    ]
  },

  "bit-range-sum-query": {
    id: "bit-range-sum-query",
    introduction: "Range Sum Query calculates the sum of elements in sub-array range [L, R] using visual subtraction: `range_sum(L, R) = query(R) - query(L - 1)` in O(log N) time.",
    intuition: "Because prefix(R) calculates the sum of elements from index 1 to R, and prefix(L-1) calculates the sum of elements from index 1 to L-1, subtracting prefix(L-1) from prefix(R) isolates the exact sub-array sum from index L to R!",
    walkthrough: [
      { phase: "Calculate Right Prefix", description: "Compute prefix(R) = sum of A[1...R]." },
      { phase: "Calculate Left Prefix", description: "Compute prefix(L-1) = sum of A[1...L-1]." },
      { phase: "Subtract Sub-Ranges", description: "Return prefix(R) - prefix(L-1)." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3, 7, 8] | Range sum(3, 6)",
      output: "17 (1 + 4 + 9 + 3)",
      steps: [
        "prefix(6) = query(6) = 24 (sum of A[1..6]).",
        "prefix(2) = query(2) = 7 (sum of A[1..2]).",
        "range_sum(3, 6) = prefix(6) - prefix(2) = 24 - 7 = 17."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(1)",
      analysis: "Executes 2 prefix queries, taking 2 * log N operations."
    },
    code: {
      cpp: `int queryRange(const vector<int>& bit, int l, int r) {
    auto query = [&](int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += bit[i];
        return sum;
    };
    return query(r) - query(l - 1);
}`,
      java: `int queryRange(int[] bit, int l, int r) {
    return query(bit, r) - query(bit, l - 1);
}`,
      python: `def query_range(bit, l, r):
    return query(bit, r) - query(bit, l - 1)`,
      javascript: `function queryRange(bit, l, r) {
  return query(bit, r) - query(bit, l - 1);
}`
    },
    interviewNotes: {
      mistakes: ["Subtracting query(l) instead of query(l - 1). Subtracting query(l) incorrectly removes element A[l]!"],
      edgeCases: ["l = 1 (subtracts query(0) = 0)"],
      tips: ["Range Sum trick: `sum(L, R) = prefix(R) - prefix(L-1)`."]
    },
    practiceProblems: [
      { title: "Dynamic Range Sum Queries (CSES)", difficulty: "Medium", url: "https://cses.fi/problemset/task/1648" }
    ],
    relatedTopics: [
      { title: "Prefix Sum Query", id: "prefix-sum-query" },
      { title: "Point Update", id: "bit-point-update" }
    ]
  },

  "coordinate-compression-bit": {
    id: "coordinate-compression-bit",
    introduction: "Coordinate Compression maps large or negative input values (e.g., -10^9 to +10^9) to small 1-based rank indices [1...K] so they can be indexed inside a Fenwick Tree.",
    intuition: "Fenwick Trees index values directly. If numbers in an array are 1,000,000,000, we cannot allocate a 10^9 size BIT array. By sorting unique values and mapping each to its sorted rank 1..K, we compress coordinates while preserving relative order!",
    walkthrough: [
      { phase: "Step 1: Extract & Sort", description: "Collect all unique input values and sort them." },
      { phase: "Step 2: Binary Search Rank", description: "Map number x to rank = lower_bound(unique_vals, x) + 1." },
      { phase: "Step 3: BIT Query/Update", description: "Use rank in BIT operations instead of original value x." }
    ],
    dryRun: {
      input: "Input numbers: [1000, -500, 999999, 1000]",
      output: "Compressed ranks: [2, 1, 3, 2]",
      steps: [
        "Unique sorted: [-500, 1000, 999999].",
        "-500 -> Rank 1",
        "1000 -> Rank 2",
        "999999 -> Rank 3",
        "BIT array size is now only 3!"
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "Sorting unique values takes O(N log N). Binary searching rank takes O(log N) per element."
    },
    code: {
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<int> compressCoordinates(const vector<int>& arr) {
    vector<int> sorted = arr;
    sort(sorted.begin(), sorted.end());
    sorted.erase(unique(sorted.begin(), sorted.end()), sorted.end());

    vector<int> ranks(arr.size());
    for (int i = 0; i < arr.size(); i++) {
        ranks[i] = (lower_bound(sorted.begin(), sorted.end(), arr[i]) - sorted.begin()) + 1; // 1-based rank
    }
    return ranks;
}`,
      java: `import java.util.*;

public class CoordinateCompression {
    public static int[] compress(int[] arr) {
        int[] sorted = arr.clone();
        Arrays.sort(sorted);
        int[] unique = Arrays.stream(sorted).distinct().toArray();

        int[] ranks = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            ranks[i] = Arrays.binarySearch(unique, arr[i]) + 1;
        }
        return ranks;
    }
}`,
      python: `import bisect

def compress(arr):
    unique = sorted(list(set(arr)))
    return [bisect.bisect_left(unique, val) + 1 for val in arr]`,
      javascript: `function compress(arr) {
  const unique = Array.from(new Set(arr)).sort((a, b) => a - b);
  return arr.map(val => unique.indexOf(val) + 1);
}`
    },
    interviewNotes: {
      mistakes: ["Using 0-based rank for BIT (remember to add +1 for 1-based indexing!)."],
      edgeCases: ["Negative numbers", "Duplicate numbers"],
      tips: ["Coordinate compression is standard for inversion counting and order statistics problems."]
    },
    practiceProblems: [
      { title: "Count of Smaller Numbers After Self", difficulty: "Hard", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" }
    ],
    relatedTopics: [
      { title: "Count Inversions", id: "count-inversions" },
      { title: "Order Statistics", id: "order-statistics-bit" }
    ]
  },

  "count-inversions": {
    id: "count-inversions",
    introduction: "Count Inversions calculates the number of pairs (i, j) such that i < j and A[i] > A[j] in O(N log N) time using a Fenwick Tree frequency counter.",
    intuition: "Traverse the array from right to left (or left to right). For each element x, query how many numbers smaller than x have already been inserted into the Fenwick Tree, then add +1 to frequency at rank(x).",
    walkthrough: [
      { phase: "Coordinate Compression", description: "Compress array elements to ranks 1..K." },
      { phase: "Traverse Right-to-Left", description: "For element at index i, query count of numbers in BIT from range 1 to rank(x) - 1." },
      { phase: "Update Frequency", description: "Add +1 to BIT at rank(x)." }
    ],
    dryRun: {
      input: "Array: [8, 4, 2, 1]",
      output: "6 inversions",
      steps: [
        "Process right-to-left: 1 -> query(0) = 0. Add 1 to BIT.",
        "Process 2 -> query(1) = 1 (1 is smaller). Add 2 to BIT.",
        "Process 4 -> query(2) = 2 (1 and 2 are smaller). Add 4 to BIT.",
        "Process 8 -> query(3) = 3 (1, 2, 4 are smaller). Add 8 to BIT.",
        "Total inversions: 0 + 1 + 2 + 3 = 6."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "Sorting unique ranks takes O(N log N). N insertions and queries in BIT take O(N log N)."
    },
    code: {
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
    vector<int> bit;
    int n;
    void add(int i, int delta) {
        for (; i <= n; i += i & -i) bit[i] += delta;
    }
    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += bit[i];
        return sum;
    }
public:
    long long countInversions(vector<int>& arr) {
        vector<int> sorted = arr;
        sort(sorted.begin(), sorted.end());
        sorted.erase(unique(sorted.begin(), sorted.end()), sorted.end());
        n = sorted.size();
        bit.assign(n + 1, 0);

        long long inversions = 0;
        for (int i = arr.size() - 1; i >= 0; i--) {
            int rank = (lower_bound(sorted.begin(), sorted.end(), arr[i]) - sorted.begin()) + 1;
            inversions += query(rank - 1);
            add(rank, 1);
        }
        return inversions;
    }
};`,
      java: `import java.util.*;

class Solution {
    private int[] bit;
    private int n;
    private void add(int i, int delta) {
        for (; i <= n; i += i & -i) bit[i] += delta;
    }
    private int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += bit[i];
        return sum;
    }
    public long countInversions(int[] arr) {
        int[] sorted = arr.clone();
        Arrays.sort(sorted);
        int[] unique = Arrays.stream(sorted).distinct().toArray();
        n = unique.length;
        bit = new int[n + 1];

        long inversions = 0;
        for (int i = arr.length - 1; i >= 0; i--) {
            int rank = Arrays.binarySearch(unique, arr[i]) + 1;
            inversions += query(rank - 1);
            add(rank, 1);
        }
        return inversions;
    }
}`,
      python: `import bisect

class Solution:
    def countInversions(self, arr: list[int]) -> int:
        unique = sorted(list(set(arr)))
        n = len(unique)
        bit = [0] * (n + 1)

        def add(i, delta):
            while i <= n:
                bit[i] += delta
                i += i & -i

        def query(i):
            total = 0
            while i > 0:
                total += bit[i]
                i -= i & -i
            return total

        inversions = 0
        for i in range(len(arr) - 1, -1, -1):
            rank = bisect.bisect_left(unique, arr[i]) + 1
            inversions += query(rank - 1)
            add(rank, 1)
        return inversions`,
      javascript: `class Solution {
  countInversions(arr) {
    const unique = Array.from(new Set(arr)).sort((a, b) => a - b);
    const n = unique.length;
    const bit = new Array(n + 1).fill(0);

    function add(i, delta) {
      for (; i <= n; i += i & -i) bit[i] += delta;
    }

    function query(i) {
      let sum = 0;
      for (; i > 0; i -= i & -i) sum += bit[i];
      return sum;
    }

    let inversions = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
      const rank = unique.indexOf(arr[i]) + 1;
      inversions += query(rank - 1);
      add(rank, 1);
    }
    return inversions;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Using standard 32-bit int for inversion count. Inversions can reach N*(N-1)/2 ≈ 5*10^9 for N=10^5, overflowing 32-bit int! Use 64-bit long/long long."],
      edgeCases: ["Array sorted in reverse order (maximum inversions)", "Array already sorted (0 inversions)"],
      tips: ["Traversing right-to-left simplifies querying elements after self."]
    },
    practiceProblems: [
      { title: "Count of Smaller Numbers After Self", difficulty: "Hard", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" },
      { title: "Inversion Count (SPOJ)", difficulty: "Medium", url: "https://www.spoj.com/problems/INVCNT/" }
    ],
    relatedTopics: [
      { title: "Coordinate Compression", id: "coordinate-compression-bit" },
      { title: "Order Statistics", id: "order-statistics-bit" }
    ]
  },

  "order-statistics-bit": {
    id: "order-statistics-bit",
    introduction: "Order Statistics on a Fenwick Tree finds the K-th smallest element dynamically in O(log N) time using Binary Lifting on the tree structure.",
    intuition: "Instead of binary searching the answer space in O(log^2 N), we can walk down the Fenwick Tree using power-of-2 bit steps (binary lifting) in a single O(log N) pass! We jump across BIT cells as long as cumulative sum is less than K.",
    walkthrough: [
      { phase: "Find Highest Power of 2", description: "Find largest power of 2 <= N (e.g. 1 << 18)." },
      { phase: "Binary Lifting Pass", description: "Step down powers of 2. If idx + step <= N and BIT[idx + step] < K: idx += step, K -= BIT[idx]." },
      { phase: "Return Result", description: "Resulting index idx + 1 is the K-th smallest element." }
    ],
    dryRun: {
      input: "BIT frequencies: [1, 1, 1, 1] at ranks 1, 2, 3, 4 | Find K=3 (3rd smallest)",
      output: "Rank 3",
      steps: [
        "Step 4: idx=0, 0+4=4 <= N, BIT[4]=4 >= 3 (don't jump).",
        "Step 2: idx=0, 0+2=2 <= N, BIT[2]=2 < 3 -> Jump! idx=2, K=3-2=1.",
        "Step 1: idx=2, 2+1=3 <= N, BIT[3]=1 >= 1 (don't jump).",
        "Result rank = idx + 1 = 2 + 1 = 3."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(1)",
      analysis: "Binary lifting takes exactly log2(N) steps without nested binary search."
    },
    code: {
      cpp: `int findKthSmallest(const vector<int>& bit, int n, int k) {
    int idx = 0;
    for (int i = 1 << 18; i > 0; i >>= 1) { // 1 << 18 > max_N
        if (idx + i <= n && bit[idx + i] < k) {
            idx += i;
            k -= bit[idx];
        }
    }
    return idx + 1; // 1-based rank
}`,
      java: `int findKthSmallest(int[] bit, int n, int k) {
    int idx = 0;
    for (int i = 1 << 18; i > 0; i >>= 1) {
        if (idx + i <= n && bit[idx + i] < k) {
            idx += i;
            k -= bit[idx];
        }
    }
    return idx + 1;
}`,
      python: `def find_kth_smallest(bit, n, k):
    idx = 0
    step = 1 << 18
    while step > 0:
        if idx + step <= n and bit[idx + step] < k:
            idx += step
            k -= bit[idx]
        step >>= 1
    return idx + 1`,
      javascript: `function findKthSmallest(bit, n, k) {
  let idx = 0;
  for (let i = 1 << 18; i > 0; i >>= 1) {
    if (idx + i <= n && bit[idx + i] < k) {
      idx += i;
      k -= bit[idx];
    }
  }
  return idx + 1;
}`
    },
    interviewNotes: {
      mistakes: ["Using standard binary search + query(mid) which takes O(log^2 N). Binary lifting takes O(log N)!"],
      edgeCases: ["K = 1 (smallest element)", "K = total elements"],
      tips: ["Fenwick Tree binary lifting is an advanced competitive programming trick."]
    },
    practiceProblems: [
      { title: "Find K-th Smallest Element in Dynamic Stream", difficulty: "Hard", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" }
    ],
    relatedTopics: [
      { title: "Coordinate Compression", id: "coordinate-compression-bit" },
      { title: "Count Inversions", id: "count-inversions" }
    ]
  }
};
