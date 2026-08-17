import type { AlgorithmContent } from './algorithmContent';

export const segmentTreeAlgorithmContent: Record<string, AlgorithmContent> = {
  "segment-tree-intro": {
    id: "segment-tree-intro",
    introduction: "A Segment Tree is a full binary tree data structure used to perform range queries (e.g. sum, min, max, GCD) and dynamic updates on an array in optimal O(log N) time per operation.",
    intuition: "Think of a Segment Tree as an interval hierarchy manager. Instead of scanning through array elements one by one (O(N)), the tree precomputes aggregate information for half-intervals. When querying range [L, R], we combine a small number of precomputed sub-interval answers (at most 2 log N nodes).",
    walkthrough: [
      { phase: "Array Partitioning", description: "The root node represents the entire array range [0, N-1]. It is split into left child [0, mid] and right child [mid+1, N-1]." },
      { phase: "Leaf Nodes", description: "The recursion terminates at leaf nodes representing single array elements [i, i]." },
      { phase: "Bottom-Up Aggregation", description: "Each internal node merges the answers of its left and right children (e.g. node.sum = left.sum + right.sum)." },
      { phase: "O(log N) Query Traversal", description: "During a range query, nodes completely inside [L, R] return immediately; nodes completely outside are ignored; partially overlapping nodes delegate to child branches." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | Query range sum [1, 4]",
      output: "Sum = 19 (5 + 1 + 4 + 9)",
      steps: [
        "Root [0,5] (sum=24) partially overlaps query [1,4]. Delegate to left [0,2] and right [3,5].",
        "Left [0,2] (sum=8) partially overlaps [1,4]. Delegate to left [0,1] and right [2].",
        "Left [0,1] (sum=7) partially overlaps [1,4]. Child [1] (sum=5) fully covered. Returns 5.",
        "Right [2] (sum=1) fully covered by [1,4]. Returns 1.",
        "Right [3,5] (sum=16) partially overlaps [1,4]. Delegate to left [3,4] and right [5].",
        "Left [3,4] (sum=13) fully covered by [1,4]. Returns 13.",
        "Right [5] completely outside [1,4]. Ignored (returns 0).",
        "Combine results: 5 + 1 + 13 = 19."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "Tree construction takes O(N) time and requires at most 4N tree space. Both point update and range query visit at most 2 * height = O(log N) nodes."
    },
    code: {
      cpp: `// Segment Tree C++ Implementation (Range Sum & Point Update)
#include <iostream>
#include <vector>
using namespace std;

class SegmentTree {
    int n;
    vector<int> tree;

    void build(const vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = start + (end - start) / 2;
        build(arr, 2 * node, start, mid);
        build(arr, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0; // Disjoint
        if (l <= start && end <= r) return tree[node]; // Fully covered
        int mid = start + (end - start) / 2;
        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }

    void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
            return;
        }
        int mid = start + (end - start) / 2;
        if (start <= idx && idx <= mid)
            update(2 * node, start, mid, idx, val);
        else
            update(2 * node + 1, mid + 1, end, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

public:
    SegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.resize(4 * n, 0);
        build(arr, 1, 0, n - 1);
    }
    int query(int l, int r) { return query(1, 0, n - 1, l, r); }
    void update(int idx, int val) { update(1, 0, n - 1, idx, val); }
};`,
      java: `// Segment Tree Java Implementation
import java.util.*;

public class SegmentTree {
    private int n;
    private int[] tree;

    public SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        build(arr, 1, 0, n - 1);
    }

    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = start + (end - start) / 2;
        build(arr, 2 * node, start, mid);
        build(arr, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public int query(int l, int r) {
        return query(1, 0, n - 1, l, r);
    }

    private int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = start + (end - start) / 2;
        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }

    public void update(int idx, int val) {
        update(1, 0, n - 1, idx, val);
    }

    private void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
            return;
        }
        int mid = start + (end - start) / 2;
        if (idx <= mid) update(2 * node, start, mid, idx, val);
        else update(2 * node + 1, mid + 1, end, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
}`,
      python: `# Segment Tree Python Implementation
class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        if self.n > 0:
            self._build(arr, 1, 0, self.n - 1)

    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
            return
        mid = (start + end) // 2
        self._build(arr, 2 * node, start, mid)
        self._build(arr, 2 * node + 1, mid + 1, end)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def query(self, l, r):
        return self._query(1, 0, self.n - 1, l, r)

    def _query(self, node, start, end, l, r):
        if r < start or end < l:
            return 0
        if l <= start and end <= r:
            return self.tree[node]
        mid = (start + end) // 2
        return self._query(2 * node, start, mid, l, r) + self._query(2 * node + 1, mid + 1, end, l, r)

    def update(self, idx, val):
        self._update(1, 0, self.n - 1, idx, val)

    def _update(self, node, start, end, idx, val):
        if start == end:
            self.tree[node] = val
            return
        mid = (start + end) // 2
        if idx <= mid:
            self._update(2 * node, start, mid, idx, val)
        else:
            self._update(2 * node + 1, mid + 1, end, idx, val)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]`,
      javascript: `// Segment Tree JavaScript Implementation
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    if (this.n > 0) this.build(arr, 1, 0, this.n - 1);
  }

  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }
    const mid = Math.floor((start + end) / 2);
    this.build(arr, 2 * node, start, mid);
    this.build(arr, 2 * node + 1, mid + 1, end);
    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
  }

  query(l, r) {
    return this._query(1, 0, this.n - 1, l, r);
  }

  _query(node, start, end, l, r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree[node];
    const mid = Math.floor((start + end) / 2);
    return this._query(2 * node, start, mid, l, r) + this._query(2 * node + 1, mid + 1, end, l, r);
  }

  update(idx, val) {
    this._update(1, 0, this.n - 1, idx, val);
  }

  _update(node, start, end, idx, val) {
    if (start === end) {
      this.tree[node] = val;
      return;
    }
    const mid = Math.floor((start + end) / 2);
    if (idx <= mid) this._update(2 * node, start, mid, idx, val);
    else this._update(2 * node + 1, mid + 1, end, idx, val);
    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
  }
}`
    },
    interviewNotes: {
      mistakes: [
        "Allocating tree array of size 2*N instead of 4*N. Always allocate 4*N size array for 1-based indexing!",
        "Confusing 0-based array index with 1-based tree node indices."
      ],
      edgeCases: ["Single element array (N = 1)", "Query range covering entire array [0, N-1]", "Query range for a single index [i, i]"],
      tips: [
        "Segment Tree is universal: Works for sum, min, max, GCD, XOR, multiplication, and non-commutative matrix operations.",
        "Use Prefix Sums if there are NO updates. Use Segment Tree when array elements are updated dynamically."
      ]
    },
    practiceProblems: [
      { title: "Range Sum Query - Mutable", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-mutable/" },
      { title: "Segment Tree Build & Query (CSES)", difficulty: "Medium", url: "https://cses.fi/problemset/task/1646" }
    ],
    relatedTopics: [
      { title: "Building a Segment Tree", id: "build-segment-tree" },
      { title: "Range Sum Query", id: "range-sum-query" },
      { title: "Lazy Propagation", id: "lazy-propagation" }
    ]
  },

  "build-segment-tree": {
    id: "build-segment-tree",
    introduction: "Building a Segment Tree takes an array of size N and recursively constructs a full binary tree of segment nodes in bottom-up fashion in O(N) total time.",
    intuition: "The construction follows a classic Divide and Conquer strategy. We recursively split the array into halves until we reach single-element leaf nodes, then merge child nodes upward to form parent nodes.",
    walkthrough: [
      { phase: "Recursive Partitioning", description: "Divide range [start, end] into left subtree [start, mid] and right subtree [mid+1, end]." },
      { phase: "Base Case Leaf Assignment", description: "When start == end, assign tree[node] = arr[start]." },
      { phase: "Parent Node Merging", description: "Compute parent value by merging children: tree[node] = merge(tree[2*node], tree[2*node+1])." },
      { phase: "Root Completion", description: "Root at index 1 contains aggregate value for full range [0, N-1]." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3]",
      output: "Segment Tree with 13 nodes, Root value = 24",
      steps: [
        "Leaf nodes created: [0]=2, [1]=5, [2]=1, [3]=9, [4]=4, [5]=3.",
        "Merge [0] and [1] -> node [0,1] = 2 + 5 = 7.",
        "Merge [0,1] and [2] -> node [0,2] = 7 + 1 = 8.",
        "Merge [3] and [4] -> node [3,4] = 9 + 4 = 13.",
        "Merge [3,4] and [5] -> node [3,5] = 13 + 3 = 16.",
        "Merge left root [0,2] (8) and right root [3,5] (16) -> Root [0,5] = 24."
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(N)",
      analysis: "Number of leaf nodes is N. Total nodes in a full binary tree with N leaves is 2N - 1. Constructing every node takes O(1) time, so total build time is exactly O(N)."
    },
    code: {
      cpp: `void build(const vector<int>& arr, vector<int>& tree, int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = start + (end - start) / 2;
    build(arr, tree, 2 * node, start, mid);
    build(arr, tree, 2 * node + 1, mid + 1, end);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
      java: `void build(int[] arr, int[] tree, int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = start + (end - start) / 2;
    build(arr, tree, 2 * node, start, mid);
    build(arr, tree, 2 * node + 1, mid + 1, end);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
      python: `def build(arr, tree, node, start, end):
    if start == end:
        tree[node] = arr[start]
        return
    mid = (start + end) // 2
    build(arr, tree, 2 * node, start, mid)
    build(arr, tree, 2 * node + 1, mid + 1, end)
    tree[node] = tree[2 * node] + tree[2 * node + 1]`,
      javascript: `function build(arr, tree, node, start, end) {
  if (start === end) {
    tree[node] = arr[start];
    return;
  }
  const mid = Math.floor((start + end) / 2);
  build(arr, tree, 2 * node, start, mid);
  build(arr, tree, 2 * node + 1, mid + 1, end);
  tree[node] = tree[2 * node] + tree[2 * node + 1];
}`
    },
    interviewNotes: {
      mistakes: ["Using N size array instead of 4N. If N is not a power of 2, 2N array will overflow!"],
      edgeCases: ["N = 1 array", "All array elements are zero or negative"],
      tips: ["Memory optimization: 4N is safe, but minimum precise size needed is 2 * 2^(ceil(log2 N)) + 1."]
    },
    practiceProblems: [
      { title: "Static Range Sum Queries (CSES)", difficulty: "Easy", url: "https://cses.fi/problemset/task/1646" }
    ],
    relatedTopics: [
      { title: "Segment Tree Intro", id: "segment-tree-intro" },
      { title: "Range Sum Query", id: "range-sum-query" }
    ]
  },

  "range-sum-query": {
    id: "range-sum-query",
    introduction: "Range Sum Query returns the sum of elements in a range [L, R] in O(log N) time by inspecting tree nodes and summing up disjoint fully covered sub-intervals.",
    intuition: "Instead of adding R - L + 1 elements sequentially, the query algorithm decomposes range [L, R] into at most 2 log N canonical segment tree intervals.",
    walkthrough: [
      { phase: "Total Disjoint Case", description: "If node range [start, end] is completely outside [L, R], return identity 0." },
      { phase: "Complete Coverage Case", description: "If node range [start, end] is completely inside [L, R], return tree[node] immediately without traversing deeper!" },
      { phase: "Partial Overlap Case", description: "If node range partially overlaps [L, R], recurse on left and right children and return leftResult + rightResult." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | Range [1, 4]",
      output: "19",
      steps: [
        "Root [0,5] overlaps [1,4] -> Recurse left [0,2] and right [3,5].",
        "Node [0,2] overlaps [1,4] -> Recurse left [0,1] and right [2].",
        "Node [0,1] overlaps [1,4] -> Leaf [1] is fully covered, returns 5.",
        "Node [2] is fully covered, returns 1.",
        "Node [3,5] overlaps [1,4] -> Node [3,4] fully covered, returns 13.",
        "Node [5] is disjoint, returns 0.",
        "Final sum: 5 + 1 + 13 = 19."
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      space: "O(log N)",
      analysis: "At each level of the tree, at most 4 nodes are visited. Height of tree is log N, giving O(log N) total time complexity."
    },
    code: {
      cpp: `int querySum(vector<int>& tree, int node, int start, int end, int l, int r) {
    if (r < start || end < l) return 0; // Disjoint
    if (l <= start && end <= r) return tree[node]; // Covered
    int mid = start + (end - start) / 2;
    return querySum(tree, 2 * node, start, mid, l, r) +
           querySum(tree, 2 * node + 1, mid + 1, end, l, r);
}`,
      java: `int querySum(int[] tree, int node, int start, int end, int l, int r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return tree[node];
    int mid = start + (end - start) / 2;
    return querySum(tree, 2 * node, start, mid, l, r) +
           querySum(tree, 2 * node + 1, mid + 1, end, l, r);
}`,
      python: `def query_sum(tree, node, start, end, l, r):
    if r < start or end < l:
        return 0
    if l <= start and end <= r:
        return tree[node]
    mid = (start + end) // 2
    return query_sum(tree, 2 * node, start, mid, l, r) + query_sum(tree, 2 * node + 1, mid + 1, end, l, r)`,
      javascript: `function querySum(tree, node, start, end, l, r) {
  if (r < start || end < l) return 0;
  if (l <= start && end <= r) return tree[node];
  const mid = Math.floor((start + end) / 2);
  return querySum(tree, 2 * node, start, mid, l, r) + querySum(tree, 2 * node + 1, mid + 1, end, l, r);
}`
    },
    interviewNotes: {
      mistakes: ["Returning 0 for Range Minimum Query instead of infinity (INT_MAX). 0 is ONLY the identity for addition!"],
      edgeCases: ["L = R (single element query)", "L = 0 and R = N-1 (entire array sum)"],
      tips: ["Identify the identity value for the aggregate operation: 0 for sum, INT_MAX for min, INT_MIN for max, 0 for XOR."]
    },
    practiceProblems: [
      { title: "Range Sum Query - Mutable", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-mutable/" }
    ],
    relatedTopics: [
      { title: "Range Minimum Query", id: "range-min-query" },
      { title: "Point Update", id: "point-update" }
    ]
  },

  "range-min-query": {
    id: "range-min-query",
    introduction: "Range Minimum Query (RMQ) calculates the minimum value in sub-array range [L, R] in O(log N) time using Segment Tree nodes precomputed with minimums.",
    intuition: "Instead of scanning elements to find the minimum, each parent node stores tree[node] = min(left, right). Outside nodes return +INFINITY so they don't corrupt the min calculation.",
    walkthrough: [
      { phase: "Identity Element", description: "Disjoint nodes return +INFINITY (or INT_MAX)." },
      { phase: "Covered Subtree", description: "If node range [start, end] is inside [L, R], return tree[node] (precomputed min)." },
      { phase: "Recursive Combine", description: "Partial overlap returns min(queryMin(left), queryMin(right))." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | RMQ range [3, 5]",
      output: "3 (min of [4, 9, 3])",
      steps: [
        "Root [0,5] (min=1) overlaps [3,5]. Left subtree [0,2] (range 0..2) is completely disjoint -> Returns +INF.",
        "Right subtree [3,5] (min=3) is fully covered by [3,5] -> Returns precomputed min = 3.",
        "min(+INF, 3) = 3."
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "RMQ runs in O(log N) time per query. It is dynamically updatable in O(log N), unlike Sparse Table RMQ which takes O(N log N) build, O(1) query, but O(N) update."
    },
    code: {
      cpp: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class RMQSegmentTree {
    int n;
    vector<int> tree;

    void build(const vector<int>& arr, int node, int start, int end) {
        if (start == end) { tree[node] = arr[start]; return; }
        int mid = start + (end - start) / 2;
        build(arr, 2 * node, start, mid);
        build(arr, 2 * node + 1, mid + 1, end);
        tree[node] = min(tree[2 * node], tree[2 * node + 1]);
    }

    int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return INT_MAX; // Neutral element for MIN
        if (l <= start && end <= r) return tree[node];
        int mid = start + (end - start) / 2;
        return min(query(2 * node, start, mid, l, r), query(2 * node + 1, mid + 1, end, l, r));
    }

public:
    RMQSegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.resize(4 * n, INT_MAX);
        build(arr, 1, 0, n - 1);
    }
    int queryMin(int l, int r) { return query(1, 0, n - 1, l, r); }
};`,
      java: `public class RMQSegmentTree {
    private int n;
    private int[] tree;

    public RMQSegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        build(arr, 1, 0, n - 1);
    }

    private void build(int[] arr, int node, int start, int end) {
        if (start == end) { tree[node] = arr[start]; return; }
        int mid = start + (end - start) / 2;
        build(arr, 2 * node, start, mid);
        build(arr, 2 * node + 1, mid + 1, end);
        tree[node] = Math.min(tree[2 * node], tree[2 * node + 1]);
    }

    public int queryMin(int l, int r) { return query(1, 0, n - 1, l, r); }

    private int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return Integer.MAX_VALUE;
        if (l <= start && end <= r) return tree[node];
        int mid = start + (end - start) / 2;
        return Math.min(query(2 * node, start, mid, l, r), query(2 * node + 1, mid + 1, end, l, r));
    }
}`,
      python: `import math

class RMQSegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [math.inf] * (4 * self.n)
        if self.n > 0: self._build(arr, 1, 0, self.n - 1)

    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
            return
        mid = (start + end) // 2
        self._build(arr, 2 * node, start, mid)
        self._build(arr, 2 * node + 1, mid + 1, end)
        self.tree[node] = min(self.tree[2 * node], self.tree[2 * node + 1])

    def query_min(self, l, r):
        return self._query(1, 0, self.n - 1, l, r)

    def _query(self, node, start, end, l, r):
        if r < start or end < l: return math.inf
        if l <= start and end <= r: return self.tree[node]
        mid = (start + end) // 2
        return min(self._query(2 * node, start, mid, l, r), self._query(2 * node + 1, mid + 1, end, l, r))`,
      javascript: `class RMQSegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(Infinity);
    if (this.n > 0) this.build(arr, 1, 0, this.n - 1);
  }

  build(arr, node, start, end) {
    if (start === end) { this.tree[node] = arr[start]; return; }
    const mid = Math.floor((start + end) / 2);
    this.build(arr, 2 * node, start, mid);
    this.build(arr, 2 * node + 1, mid + 1, end);
    this.tree[node] = Math.min(this.tree[2 * node], this.tree[2 * node + 1]);
  }

  queryMin(l, r) { return this._query(1, 0, this.n - 1, l, r); }

  _query(node, start, end, l, r) {
    if (r < start || end < l) return Infinity;
    if (l <= start && end <= r) return this.tree[node];
    const mid = Math.floor((start + end) / 2);
    return Math.min(this._query(2 * node, start, mid, l, r), this._query(2 * node + 1, mid + 1, end, l, r));
  }
}`
    },
    interviewNotes: {
      mistakes: ["Using 0 as default return value for disjoint nodes in RMQ instead of infinity."],
      edgeCases: ["All negative elements", "Query range out of array bounds"],
      tips: ["RMQ with updates is a classic Segment Tree interview question. Sparse Table is better only if NO updates exist."]
    },
    practiceProblems: [
      { title: "Static Range Minimum Queries (CSES)", difficulty: "Easy", url: "https://cses.fi/problemset/task/1647" },
      { title: "Dynamic Range Minimum Queries (CSES)", difficulty: "Medium", url: "https://cses.fi/problemset/task/1649" }
    ],
    relatedTopics: [
      { title: "Range Maximum Query", id: "range-max-query" },
      { title: "Point Update", id: "point-update" }
    ]
  },

  "range-max-query": {
    id: "range-max-query",
    introduction: "Range Maximum Query calculates the maximum value in sub-array range [L, R] in O(log N) time using Segment Tree nodes precomputed with maximums.",
    intuition: "Similar to RMQ, each parent node stores tree[node] = max(left, right). Disjoint nodes return -INFINITY so they do not affect maximum selection.",
    walkthrough: [
      { phase: "Neutral Element", description: "Disjoint nodes return -INFINITY (INT_MIN)." },
      { phase: "Covered Subtree", description: "If node range [start, end] is inside [L, R], return tree[node] (precomputed max)." },
      { phase: "Recursive Combine", description: "Partial overlap returns max(queryMax(left), queryMax(right))." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | Range Max [0, 3]",
      output: "5 (max of [2, 5, 1, 4])",
      steps: [
        "Root [0,5] (max=9) overlaps [0,3]. Recurse left [0,2] and right [3,5].",
        "Left [0,2] (range 0..2) is fully inside [0,3] -> Returns precomputed max = 5.",
        "Right [3,5] overlaps [0,3]. Node [3] (val=4) inside -> Returns 4; Node [4,5] disjoint -> Returns -INF.",
        "max(5, 4) = 5."
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "Takes O(log N) time per query. Allows dynamic point updates and range updates."
    },
    code: {
      cpp: `int queryMax(vector<int>& tree, int node, int start, int end, int l, int r) {
    if (r < start || end < l) return INT_MIN; // Neutral element for MAX
    if (l <= start && end <= r) return tree[node];
    int mid = start + (end - start) / 2;
    return max(queryMax(tree, 2 * node, start, mid, l, r),
               queryMax(tree, 2 * node + 1, mid + 1, end, l, r));
}`,
      java: `int queryMax(int[] tree, int node, int start, int end, int l, int r) {
    if (r < start || end < l) return Integer.MIN_VALUE;
    if (l <= start && end <= r) return tree[node];
    int mid = start + (end - start) / 2;
    return Math.max(queryMax(tree, 2 * node, start, mid, l, r),
                    queryMax(tree, 2 * node + 1, mid + 1, end, l, r));
}`,
      python: `import math

def query_max(tree, node, start, end, l, r):
    if r < start or end < l: return -math.inf
    if l <= start and end <= r: return tree[node]
    mid = (start + end) // 2
    return max(query_max(tree, 2 * node, start, mid, l, r), query_max(tree, 2 * node + 1, mid + 1, end, l, r))`,
      javascript: `function queryMax(tree, node, start, end, l, r) {
  if (r < start || end < l) return -Infinity;
  if (l <= start && end <= r) return tree[node];
  const mid = Math.floor((start + end) / 2);
  return Math.max(queryMax(tree, 2 * node, start, mid, l, r), queryMax(tree, 2 * node + 1, mid + 1, end, l, r));
}`
    },
    interviewNotes: {
      mistakes: ["Using 0 as default return value when array contains negative numbers."],
      edgeCases: ["All elements negative", "Single element range"],
      tips: ["Range Max Query is essential for solving problems like Skyline, Maximum Overlapping Intervals, and Stock Price Span."]
    },
    practiceProblems: [
      { title: "Dynamic Range Minimum/Maximum Queries", difficulty: "Medium", url: "https://cses.fi/problemset/task/1649" }
    ],
    relatedTopics: [
      { title: "Range Minimum Query", id: "range-min-query" },
      { title: "Skyline Problem", id: "skyline-problem" }
    ]
  },

  "point-update": {
    id: "point-update",
    introduction: "Point Update modifies a single array element at index `idx` to a new value `val` and updates all ancestor segment tree nodes upward in O(log N) time.",
    intuition: "Because array index `idx` is represented by exactly one leaf node in the segment tree, updating it only affects the path from that leaf node up to the root (log N ancestor nodes). All other subtrees remain untouched!",
    walkthrough: [
      { phase: "Leaf Traversal", description: "Recursively navigate down to leaf node where start == end == idx." },
      { phase: "Value Replacement", description: "Set tree[leaf] = val." },
      { phase: "Upward Propagation", description: "As the recursion unrolls, recompute parent node values: tree[node] = tree[2*node] + tree[2*node+1]." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | Update index 3 -> value 10",
      output: "Leaf [3] set to 10. Root [0,5] updated from 24 to 25.",
      steps: [
        "Traverse Root [0,5] -> Right child [3,5] -> Left child [3,4] -> Leaf [3].",
        "Set leaf [3] value to 10.",
        "Recompute parent [3,4] = 10 + 4 = 14 (was 13).",
        "Recompute grandparent [3,5] = 14 + 3 = 17 (was 16).",
        "Recompute root [0,5] = 8 + 17 = 25 (was 24)."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(log N)",
      analysis: "Traverses a single path from root to leaf of length log N. Recomputing each parent takes O(1) time. Total time O(log N)."
    },
    code: {
      cpp: `void pointUpdate(vector<int>& tree, int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
        return;
    }
    int mid = start + (end - start) / 2;
    if (idx <= mid)
        pointUpdate(tree, 2 * node, start, mid, idx, val);
    else
        pointUpdate(tree, 2 * node + 1, mid + 1, end, idx, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
      java: `void pointUpdate(int[] tree, int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
        return;
    }
    int mid = start + (end - start) / 2;
    if (idx <= mid)
        pointUpdate(tree, 2 * node, start, mid, idx, val);
    else
        pointUpdate(tree, 2 * node + 1, mid + 1, end, idx, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
      python: `def point_update(tree, node, start, end, idx, val):
    if start == end:
        tree[node] = val
        return
    mid = (start + end) // 2
    if idx <= mid:
        point_update(tree, 2 * node, start, mid, idx, val)
    else:
        point_update(tree, 2 * node + 1, mid + 1, end, idx, val)
    tree[node] = tree[2 * node] + tree[2 * node + 1]`,
      javascript: `function pointUpdate(tree, node, start, end, idx, val) {
  if (start === end) {
    tree[node] = val;
    return;
  }
  const mid = Math.floor((start + end) / 2);
  if (idx <= mid) pointUpdate(tree, 2 * node, start, mid, idx, val);
  else pointUpdate(tree, 2 * node + 1, mid + 1, end, idx, val);
  tree[node] = tree[2 * node] + tree[2 * node + 1];
}`
    },
    interviewNotes: {
      mistakes: ["Updating the original array but forgetting to update parent nodes in the segment tree upward."],
      edgeCases: ["Updating index 0", "Updating index N-1", "Setting value to same current value"],
      tips: ["Point updates take O(log N). If you need to update an entire RANGE [L, R], naive point updates would take O(K log N) which is O(N log N). Use Lazy Propagation instead!"]
    },
    practiceProblems: [
      { title: "Range Sum Query - Mutable", difficulty: "Medium", url: "https://leetcode.com/problems/range-sum-query-mutable/" }
    ],
    relatedTopics: [
      { title: "Building a Segment Tree", id: "build-segment-tree" },
      { title: "Lazy Propagation", id: "lazy-propagation" }
    ]
  },

  "range-update": {
    id: "range-update",
    introduction: "Range Update adds or modifies values across an entire range [L, R]. Without lazy propagation, updating elements individually takes O(N log N) time. Lazy propagation reduces this to O(log N).",
    intuition: "Instead of updating all leaf nodes inside range [L, R], we update high-level tree nodes that are fully contained in [L, R] and mark them as 'lazy'. The updates to child subtrees are deferred until a subsequent query or update actually needs to visit those children!",
    walkthrough: [
      { phase: "Naive Range Update Fails", description: "Updating K leaves individually requires O(K log N) operations, leading to TLE for many range update queries." },
      { phase: "Lazy Marking Strategy", description: "When a segment node [start, end] is fully inside update range [L, R], apply update to node value immediately and store pending value in lazy[node]." },
      { phase: "Deferral", description: "Stop recursion at the fully covered node! Do not descend to children." },
      { phase: "Push Down On Demand", description: "When future operations visit a node with pending lazy updates, 'pushDown' transfers lazy values to child nodes." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | Range Add +5 to [2, 4]",
      output: "Nodes covering [2, 4] updated and marked lazy. Subtrees deferred.",
      steps: [
        "Traverse Root [0,5] -> Recurse left [0,2] and right [3,5].",
        "Left [0,2] -> Leaf [2] (val=1) is inside [2,4] -> tree[2] becomes 1+5=6, lazy[2] marked +5.",
        "Right [3,5] -> Node [3,4] (range 3..4, length 2) is fully inside [2,4] -> tree[3,4] updated by 2*5 = +10, lazy[3,4] marked +5.",
        "Subtrees of [3,4] (leaves 3 and 4) NOT visited! Update deferred."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "With lazy propagation, a range update visits at most 4 log N nodes, achieving optimal O(log N) time per range update."
    },
    code: {
      cpp: `void rangeUpdate(vector<int>& tree, vector<int>& lazy, int node, int start, int end, int l, int r, int val) {
    if (lazy[node] != 0) {
        tree[node] += (end - start + 1) * lazy[node];
        if (start != end) {
            lazy[2 * node] += lazy[node];
            lazy[2 * node + 1] += lazy[node];
        }
        lazy[node] = 0;
    }
    if (r < start || end < l) return;
    if (l <= start && end <= r) {
        tree[node] += (end - start + 1) * val;
        if (start != end) {
            lazy[2 * node] += val;
            lazy[2 * node + 1] += val;
        }
        return;
    }
    int mid = start + (end - start) / 2;
    rangeUpdate(tree, lazy, 2 * node, start, mid, l, r, val);
    rangeUpdate(tree, lazy, 2 * node + 1, mid + 1, end, l, r, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
      java: `void rangeUpdate(int[] tree, int[] lazy, int node, int start, int end, int l, int r, int val) {
    if (lazy[node] != 0) {
        tree[node] += (end - start + 1) * lazy[node];
        if (start != end) {
            lazy[2 * node] += lazy[node];
            lazy[2 * node + 1] += lazy[node];
        }
        lazy[node] = 0;
    }
    if (r < start || end < l) return;
    if (l <= start && end <= r) {
        tree[node] += (end - start + 1) * val;
        if (start != end) {
            lazy[2 * node] += val;
            lazy[2 * node + 1] += val;
        }
        return;
    }
    int mid = start + (end - start) / 2;
    rangeUpdate(tree, lazy, 2 * node, start, mid, l, r, val);
    rangeUpdate(tree, lazy, 2 * node + 1, mid + 1, end, l, r, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
      python: `def range_update(tree, lazy, node, start, end, l, r, val):
    if lazy[node] != 0:
        tree[node] += (end - start + 1) * lazy[node]
        if start != end:
            lazy[2 * node] += lazy[node]
            lazy[2 * node + 1] += lazy[node]
        lazy[node] = 0

    if r < start or end < l:
        return
    if l <= start and end <= r:
        tree[node] += (end - start + 1) * val
        if start != end:
            lazy[2 * node] += val
            lazy[2 * node + 1] += val
        return

    mid = (start + end) // 2
    range_update(tree, lazy, 2 * node, start, mid, l, r, val)
    range_update(tree, lazy, 2 * node + 1, mid + 1, end, l, r, val)
    tree[node] = tree[2 * node] + tree[2 * node + 1]`,
      javascript: `function rangeUpdate(tree, lazy, node, start, end, l, r, val) {
  if (lazy[node] !== 0) {
    tree[node] += (end - start + 1) * lazy[node];
    if (start !== end) {
      lazy[2 * node] += lazy[node];
      lazy[2 * node + 1] += lazy[node];
    }
    lazy[node] = 0;
  }
  if (r < start || end < l) return;
  if (l <= start && end <= r) {
    tree[node] += (end - start + 1) * val;
    if (start !== end) {
      lazy[2 * node] += val;
      lazy[2 * node + 1] += val;
    }
    return;
  }
  const mid = Math.floor((start + end) / 2);
  rangeUpdate(tree, lazy, 2 * node, start, mid, l, r, val);
  rangeUpdate(tree, lazy, 2 * node + 1, mid + 1, end, l, r, val);
  tree[node] = tree[2 * node] + tree[2 * node + 1];
}`
    },
    interviewNotes: {
      mistakes: [
        "Forgetting to multiply lazy addition by interval length (end - start + 1) for Range Sum trees!",
        "Forgetting to push down lazy values at the start of both query and update functions."
      ],
      edgeCases: ["Range update covering entire array", "Range update with value = 0"],
      tips: ["Always push down pending lazy updates BEFORE making decision choices in query or update functions!"]
    },
    practiceProblems: [
      { title: "Range Update Queries (CSES)", difficulty: "Hard", url: "https://cses.fi/problemset/task/1651" }
    ],
    relatedTopics: [
      { title: "Lazy Propagation", id: "lazy-propagation" },
      { title: "Range Assignment", id: "range-assignment" }
    ]
  },

  "lazy-propagation": {
    id: "lazy-propagation",
    introduction: "Lazy Propagation is an advanced optimization technique for Segment Trees that enables Range Updates in O(log N) time by deferring child node updates until they are explicitly needed.",
    intuition: "Think of lazy propagation like lazy evaluation in software engineering or procrastinating chores until someone asks for them. If a command says 'Add +5 to all numbers from index 2 to 100', we update the root node for range [2, 100], tag it with 'lazy +5', and return immediately. We only pass down the '+5' instruction to lower levels when a query or new update needs to inspect those specific children.",
    walkthrough: [
      { phase: "Dual Array Structure", description: "Maintain primary tree array (4N size) AND secondary lazy array (4N size)." },
      { phase: "Lazy Check & PushDown", description: "At the start of ANY node visit (query or update), if lazy[node] != 0: apply pending update to tree[node], pass lazy value to left & right children, and clear lazy[node] = 0." },
      { phase: "Full Coverage Deferral", description: "If node range [start, end] is inside update range [L, R], update tree[node] directly, set lazy[children] += val, and RETURN." },
      { phase: "Partial Overlap Descent", description: "Recurse on left and right subtrees, then merge updated children: tree[node] = merge(tree[2*node], tree[2*node+1])." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | 1. Add +5 to range [1, 4] | 2. Query sum [2, 3]",
      output: "Query returns 15 (was 5; 1+5 + 4+5 = 15)",
      steps: [
        "1. Range Update +5 to [1,4]:",
        "   - Node [0,1] covered? No. Recurse. Leaf [1] updated to 5+5=10, lazy[1]=0.",
        "   - Node [2] covered. tree[2] updated 1+5=6.",
        "   - Node [3,4] covered. tree[3,4] updated 13 + 2*5 = 23. lazy[3,4] set to +5.",
        "2. Query sum [2,3]:",
        "   - Inspect node [3,4] (lazy[3,4] = +5). PushDown! Push +5 to leaf [3] (tree[3]=9+5=14) and leaf [4] (tree[4]=4+5=9). Clear lazy[3,4] = 0.",
        "   - Query returns tree[2] (6) + tree[3] (14) = 20."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "Lazy propagation ensures every range update and range query processes at most O(log N) tree nodes. Space overhead is an extra 4N size lazy array."
    },
    code: {
      cpp: `// Full Lazy Propagation Segment Tree Class (Range Sum & Range Add)
#include <iostream>
#include <vector>
using namespace std;

class LazySegmentTree {
    int n;
    vector<long long> tree, lazy;

    void pushDown(int node, int start, int end) {
        if (lazy[node] != 0) {
            tree[node] += (end - start + 1) * lazy[node];
            if (start != end) {
                lazy[2 * node] += lazy[node];
                lazy[2 * node + 1] += lazy[node];
            }
            lazy[node] = 0;
        }
    }

    void build(const vector<int>& arr, int node, int start, int end) {
        if (start == end) { tree[node] = arr[start]; return; }
        int mid = start + (end - start) / 2;
        build(arr, 2 * node, start, mid);
        build(arr, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    void updateRange(int node, int start, int end, int l, int r, long long val) {
        pushDown(node, start, end);
        if (r < start || end < l) return;
        if (l <= start && end <= r) {
            lazy[node] += val;
            pushDown(node, start, end);
            return;
        }
        int mid = start + (end - start) / 2;
        updateRange(2 * node, start, mid, l, r, val);
        updateRange(2 * node + 1, mid + 1, end, l, r, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    long long queryRange(int node, int start, int end, int l, int r) {
        pushDown(node, start, end);
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = start + (end - start) / 2;
        return queryRange(2 * node, start, mid, l, r) + queryRange(2 * node + 1, mid + 1, end, l, r);
    }

public:
    LazySegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.resize(4 * n, 0);
        lazy.resize(4 * n, 0);
        build(arr, 1, 0, n - 1);
    }
    void updateRange(int l, int r, long long val) { updateRange(1, 0, n - 1, l, r, val); }
    long long queryRange(int l, int r) { return queryRange(1, 0, n - 1, l, r); }
};`,
      java: `public class LazySegmentTree {
    private int n;
    private long[] tree, lazy;

    public LazySegmentTree(int[] arr) {
        n = arr.length;
        tree = new long[4 * n];
        lazy = new long[4 * n];
        build(arr, 1, 0, n - 1);
    }

    private void pushDown(int node, int start, int end) {
        if (lazy[node] != 0) {
            tree[node] += (end - start + 1) * lazy[node];
            if (start != end) {
                lazy[2 * node] += lazy[node];
                lazy[2 * node + 1] += lazy[node];
            }
            lazy[node] = 0;
        }
    }

    private void build(int[] arr, int node, int start, int end) {
        if (start == end) { tree[node] = arr[start]; return; }
        int mid = start + (end - start) / 2;
        build(arr, 2 * node, start, mid);
        build(arr, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public void updateRange(int l, int r, long val) { updateRange(1, 0, n - 1, l, r, val); }

    private void updateRange(int node, int start, int end, int l, int r, long val) {
        pushDown(node, start, end);
        if (r < start || end < l) return;
        if (l <= start && end <= r) {
            lazy[node] += val;
            pushDown(node, start, end);
            return;
        }
        int mid = start + (end - start) / 2;
        updateRange(2 * node, start, mid, l, r, val);
        updateRange(2 * node + 1, mid + 1, end, l, r, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public long queryRange(int l, int r) { return queryRange(1, 0, n - 1, l, r); }

    private long queryRange(int node, int start, int end, int l, int r) {
        pushDown(node, start, end);
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = start + (end - start) / 2;
        return queryRange(2 * node, start, mid, l, r) + queryRange(2 * node + 1, mid + 1, end, l, r);
    }
}`,
      python: `class LazySegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        if self.n > 0: self._build(arr, 1, 0, self.n - 1)

    def _push_down(self, node, start, end):
        if self.lazy[node] != 0:
            self.tree[node] += (end - start + 1) * self.lazy[node]
            if start != end:
                self.lazy[2 * node] += self.lazy[node]
                self.lazy[2 * node + 1] += self.lazy[node]
            self.lazy[node] = 0

    def _build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
            return
        mid = (start + end) // 2
        self._build(arr, 2 * node, start, mid)
        self._build(arr, 2 * node + 1, mid + 1, end)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def update_range(self, l, r, val):
        self._update_range(1, 0, self.n - 1, l, r, val)

    def _update_range(self, node, start, end, l, r, val):
        self._push_down(node, start, end)
        if r < start or end < l: return
        if l <= start and end <= r:
            self.lazy[node] += val
            self._push_down(node, start, end)
            return
        mid = (start + end) // 2
        self._update_range(2 * node, start, mid, l, r, val)
        self._update_range(2 * node + 1, mid + 1, end, l, r, val)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def query_range(self, l, r):
        return self._query_range(1, 0, self.n - 1, l, r)

    def _query_range(self, node, start, end, l, r):
        self._push_down(node, start, end)
        if r < start or end < l: return 0
        if l <= start and end <= r: return self.tree[node]
        mid = (start + end) // 2
        return self._query_range(2 * node, start, mid, l, r) + self._query_range(2 * node + 1, mid + 1, end, l, r)`,
      javascript: `class LazySegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.lazy = new Array(4 * this.n).fill(0);
    if (this.n > 0) this.build(arr, 1, 0, this.n - 1);
  }

  pushDown(node, start, end) {
    if (this.lazy[node] !== 0) {
      this.tree[node] += (end - start + 1) * this.lazy[node];
      if (start !== end) {
        this.lazy[2 * node] += this.lazy[node];
        this.lazy[2 * node + 1] += this.lazy[node];
      }
      this.lazy[node] = 0;
    }
  }

  build(arr, node, start, end) {
    if (start === end) { this.tree[node] = arr[start]; return; }
    const mid = Math.floor((start + end) / 2);
    this.build(arr, 2 * node, start, mid);
    this.build(arr, 2 * node + 1, mid + 1, end);
    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
  }

  updateRange(l, r, val) { this._updateRange(1, 0, this.n - 1, l, r, val); }

  _updateRange(node, start, end, l, r, val) {
    this.pushDown(node, start, end);
    if (r < start || end < l) return;
    if (l <= start && end <= r) {
      this.lazy[node] += val;
      this.pushDown(node, start, end);
      return;
    }
    const mid = Math.floor((start + end) / 2);
    this._updateRange(2 * node, start, mid, l, r, val);
    this._updateRange(2 * node + 1, mid + 1, end, l, r, val);
    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
  }

  queryRange(l, r) { return this._queryRange(1, 0, this.n - 1, l, r); }

  _queryRange(node, start, end, l, r) {
    this.pushDown(node, start, end);
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree[node];
    const mid = Math.floor((start + end) / 2);
    return this._queryRange(2 * node, start, mid, l, r) + this._queryRange(2 * node + 1, mid + 1, end, l, r);
  }
}`
    },
    interviewNotes: {
      mistakes: [
        "Placing pushDown inside child recursions instead of at the top of the function.",
        "Overwriting lazy tags instead of accumulating (lazy[child] += lazy[parent]) for range addition."
      ],
      edgeCases: ["Overlapping lazy updates on the same sub-range", "Queries on nodes with multiple pending lazy tags"],
      tips: [
        "Mastering Lazy Propagation is essential for FAANG hard system design and competitive coding rounds.",
        "Remember: Range Addition adds (lazy += val), Range Assignment overwrites (lazy = val)."
      ]
    },
    practiceProblems: [
      { title: "Range Update Queries (CSES)", difficulty: "Hard", url: "https://cses.fi/problemset/task/1651" },
      { title: "Polynomial Queries (CSES)", difficulty: "Hard", url: "https://cses.fi/problemset/task/1736" }
    ],
    relatedTopics: [
      { title: "Range Update", id: "range-update" },
      { title: "Range Assignment Updates", id: "range-assignment" }
    ]
  },

  "range-assignment": {
    id: "range-assignment",
    introduction: "Range Assignment Updates overwrite all array elements in range [L, R] to a fixed value V in O(log N) time using lazy propagation with boolean sentinel markers.",
    intuition: "Unlike Range Addition where lazy values accumulate (+=), Range Assignment completely replaces child values (= V). We maintain a boolean `hasLazy` flag or use a sentinel (e.g., -1 or INF) to distinguish whether a node has a pending assignment.",
    walkthrough: [
      { phase: "Boolean Lazy Sentinel", description: "Use `lazyValue` and `hasLazy` boolean array to track pending assignment operations." },
      { phase: "PushDown Replacement", description: "When pushing down assignment V: tree[node] = (end - start + 1) * V. Pass V to left & right children, setting their `hasLazy` flags to true." },
      { phase: "Overwriting Child Lazy Tags", description: "If a child node already had a previous pending assignment, overwrite it with new value V." }
    ],
    dryRun: {
      input: "Array: [2, 5, 1, 4, 9, 3] | Set range [1, 3] to value 7",
      output: "Array becomes [2, 7, 7, 7, 9, 3]. Tree nodes for [1, 3] updated to 7.",
      steps: [
        "Node [1,3] length 3 -> tree value becomes 3 * 7 = 21.",
        "lazyValue set to 7, hasLazy set to true.",
        "Subtrees deferred. Next query to leaf [2] triggers pushDown(7) to leaves 1, 2, 3."
      ]
    },
    complexities: {
      time: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "Each Range Assignment operation takes O(log N) time."
    },
    code: {
      cpp: `void pushDownAssign(int node, int start, int end, vector<int>& tree, vector<int>& lazyVal, vector<bool>& hasLazy) {
    if (hasLazy[node]) {
        tree[node] = (end - start + 1) * lazyVal[node];
        if (start != end) {
            lazyVal[2 * node] = lazyVal[node];
            hasLazy[2 * node] = true;
            lazyVal[2 * node + 1] = lazyVal[node];
            hasLazy[2 * node + 1] = true;
        }
        hasLazy[node] = false;
    }
}`,
      java: `void pushDownAssign(int node, int start, int end, int[] tree, int[] lazyVal, boolean[] hasLazy) {
    if (hasLazy[node]) {
        tree[node] = (end - start + 1) * lazyVal[node];
        if (start != end) {
            lazyVal[2 * node] = lazyVal[node];
            hasLazy[2 * node] = true;
            lazyVal[2 * node + 1] = lazyVal[node];
            hasLazy[2 * node + 1] = true;
        }
        hasLazy[node] = false;
    }
}`,
      python: `def push_down_assign(node, start, end, tree, lazy_val, has_lazy):
    if has_lazy[node]:
        tree[node] = (end - start + 1) * lazy_val[node]
        if start != end:
            lazy_val[2 * node] = lazy_val[node]
            has_lazy[2 * node] = True
            lazy_val[2 * node + 1] = lazy_val[node]
            has_lazy[2 * node + 1] = True
        has_lazy[node] = False`,
      javascript: `function pushDownAssign(node, start, end, tree, lazyVal, hasLazy) {
  if (hasLazy[node]) {
    tree[node] = (end - start + 1) * lazyVal[node];
    if (start !== end) {
      lazyVal[2 * node] = lazyVal[node];
      hasLazy[2 * node] = true;
      lazyVal[2 * node + 1] = lazyVal[node];
      hasLazy[2 * node + 1] = true;
    }
    hasLazy[node] = false;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Using `lazy += val` instead of `lazy = val` for assignment operations!"],
      edgeCases: ["Assigning 0 to a range (0 is a valid assignment value, so `lazy != 0` check will fail without boolean flag)"],
      tips: ["Always use a boolean `hasLazy` array for range assignment to handle value 0 correctly."]
    },
    practiceProblems: [
      { title: "Range Updates and Sums (CSES)", difficulty: "Hard", url: "https://cses.fi/problemset/task/1735" }
    ],
    relatedTopics: [
      { title: "Lazy Propagation", id: "lazy-propagation" },
      { title: "Range Update", id: "range-update" }
    ]
  },

  "segment-tree-applications": {
    id: "segment-tree-applications",
    introduction: "Segment Trees are versatile powerhouses used across competitive programming and production systems for coordinate compression, frequency counting, interval scheduling, and 2D range queries.",
    intuition: "Beyond simple array sums, Segment Trees can index values, coordinates, or time intervals. For instance, by using array values as indices in a Segment Tree, we can count frequencies of elements dynamically.",
    walkthrough: [
      { phase: "Coordinate Compression", description: "Map large arbitrary values (e.g. 10^9) to continuous ranks [0, N-1] to fit into Segment Tree space." },
      { phase: "Frequency Counting", description: "Leaf [v] stores the frequency of value v. Range query [0, v-1] gives count of elements strictly smaller than v!" },
      { phase: "Dynamic Interval Merging", description: "Nodes store structural metadata (e.g. prefix max, suffix max, total max sum) to solve Maximum Subarray Sum in range queries." }
    ],
    dryRun: {
      input: "Numbers: [5, 2, 6, 1]",
      output: "Smaller counts after self: [2, 1, 1, 0]",
      steps: [
        "Process right-to-left: 1 -> query sum [0, 0] = 0, insert 1 into segtree.",
        "Process 6 -> query sum [0, 5] = 1 (1 is smaller), insert 6 into segtree.",
        "Process 2 -> query sum [0, 1] = 1 (1 is smaller), insert 2 into segtree.",
        "Process 5 -> query sum [0, 4] = 2 (1 and 2 are smaller), insert 5 into segtree."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "Processing N elements with coordinate compression takes O(N log N) total time and O(N) space."
    },
    code: {
      cpp: `// Count Smaller Numbers After Self using Segment Tree
#include <vector>
#include <algorithm>
using namespace std;

class CountSmallerSegTree {
    int n;
    vector<int> tree;

    void update(int node, int start, int end, int idx, int val) {
        if (start == end) { tree[node] += val; return; }
        int mid = start + (end - start) / 2;
        if (idx <= mid) update(2 * node, start, mid, idx, val);
        else update(2 * node + 1, mid + 1, end, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l || l > r) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = start + (end - start) / 2;
        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }

public:
    vector<int> countSmaller(vector<int>& nums) {
        vector<int> sorted_nums = nums;
        sort(sorted_nums.begin(), sorted_nums.end());
        sorted_nums.erase(unique(sorted_nums.begin(), sorted_nums.end()), sorted_nums.end());

        n = sorted_nums.size();
        tree.assign(4 * n, 0);
        vector<int> result(nums.size());

        for (int i = nums.size() - 1; i >= 0; i--) {
            int rank = lower_bound(sorted_nums.begin(), sorted_nums.end(), nums[i]) - sorted_nums.begin();
            result[i] = query(1, 0, n - 1, 0, rank - 1);
            update(1, 0, n - 1, rank, 1);
        }
        return result;
    }
};`,
      java: `import java.util.*;

public class CountSmallerSegTree {
    private int[] tree;

    public List<Integer> countSmaller(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        int[] unique = Arrays.stream(sorted).distinct().toArray();
        int n = unique.length;
        tree = new int[4 * Math.max(1, n)];

        Integer[] result = new Integer[nums.length];
        for (int i = nums.length - 1; i >= 0; i--) {
            int rank = Arrays.binarySearch(unique, nums[i]);
            result[i] = query(1, 0, n - 1, 0, rank - 1);
            update(1, 0, n - 1, rank, 1);
        }
        return Arrays.asList(result);
    }

    private void update(int node, int start, int end, int idx, int val) {
        if (start == end) { tree[node] += val; return; }
        int mid = start + (end - start) / 2;
        if (idx <= mid) update(2 * node, start, mid, idx, val);
        else update(2 * node + 1, mid + 1, end, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    private int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l || l > r) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = start + (end - start) / 2;
        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }
}`,
      python: `import bisect

class CountSmallerSegTree:
    def countSmaller(self, nums: list[int]) -> list[int]:
        sorted_unique = sorted(list(set(nums)))
        n = len(sorted_unique)
        tree = [0] * (4 * max(1, n))

        def update(node, start, end, idx, val):
            if start == end:
                tree[node] += val
                return
            mid = (start + end) // 2
            if idx <= mid: update(2 * node, start, mid, idx, val)
            else: update(2 * node + 1, mid + 1, end, idx, val)
            tree[node] = tree[2 * node] + tree[2 * node + 1]

        def query(node, start, end, l, r):
            if r < start or end < l or l > r: return 0
            if l <= start and end <= r: return tree[node]
            mid = (start + end) // 2
            return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r)

        res = [0] * len(nums)
        for i in range(len(nums) - 1, -1, -1):
            rank = bisect.bisect_left(sorted_unique, nums[i])
            res[i] = query(1, 0, n - 1, 0, rank - 1)
            update(1, 0, n - 1, rank, 1)
        return res`,
      javascript: `class CountSmallerSegTree {
  countSmaller(nums) {
    const sortedUnique = Array.from(new Set(nums)).sort((a, b) => a - b);
    const n = sortedUnique.length;
    const tree = new Array(4 * Math.max(1, n)).fill(0);

    function update(node, start, end, idx, val) {
      if (start === end) { tree[node] += val; return; }
      const mid = Math.floor((start + end) / 2);
      if (idx <= mid) update(2 * node, start, mid, idx, val);
      else update(2 * node + 1, mid + 1, end, idx, val);
      tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    function query(node, start, end, l, r) {
      if (r < start || end < l || l > r) return 0;
      if (l <= start && end <= r) return tree[node];
      const mid = Math.floor((start + end) / 2);
      return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }

    const res = new Array(nums.length);
    for (let i = nums.length - 1; i >= 0; i--) {
      const rank = sortedUnique.indexOf(nums[i]);
      res[i] = query(1, 0, n - 1, 0, rank - 1);
      update(1, 0, n - 1, rank, 1);
    }
    return res;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Forgetting coordinate compression when input values can be negative or large (e.g. 10^9)."],
      edgeCases: ["Duplicate numbers in input array", "Array already sorted in ascending/descending order"],
      tips: ["Coordinate compression maps values to [0, N-1] ranks while preserving relative ordering."]
    },
    practiceProblems: [
      { title: "Count of Smaller Numbers After Self", difficulty: "Hard", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" }
    ],
    relatedTopics: [
      { title: "Count Smaller Numbers", id: "count-smaller-numbers" },
      { title: "Skyline Problem", id: "skyline-problem" }
    ]
  },

  "count-smaller-numbers": {
    id: "count-smaller-numbers",
    introduction: "Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].",
    intuition: "By traversing the array from right to left, we build a frequency Segment Tree. For element nums[i], all elements to its right have already been inserted. Querying the range sum [0, rank(nums[i]) - 1] instantly gives the count of smaller numbers!",
    walkthrough: [
      { phase: "Step 1: Coordinate Compression", description: "Collect all unique elements in sorted order to map numbers to ranks 0 to K-1." },
      { phase: "Step 2: Right-to-Left Traversal", description: "Iterate from rightmost element i = N-1 down to 0." },
      { phase: "Step 3: Range Query", description: "Query sum of frequencies in range [0, rank - 1] in Segment Tree." },
      { phase: "Step 4: Point Update", description: "Increment frequency of rank in Segment Tree by +1." }
    ],
    dryRun: {
      input: "nums = [5, 2, 6, 1]",
      output: "[2, 1, 1, 0]",
      steps: [
        "Unique sorted: [1, 2, 5, 6]. Ranks: 1->0, 2->1, 5->2, 6->3.",
        "i=3 (val=1, rank=0): query [0, -1] = 0. Update rank 0.",
        "i=2 (val=6, rank=3): query [0, 2] = 1 (leaf 0 has count 1). Update rank 3.",
        "i=1 (val=2, rank=1): query [0, 0] = 1 (leaf 0 has count 1). Update rank 1.",
        "i=0 (val=5, rank=2): query [0, 1] = 2 (leaves 0 and 1 have count 1 each). Update rank 2.",
        "Result: [2, 1, 1, 0]."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "Sorting takes O(N log N). Processing N elements with O(log N) query & update takes O(N log N) total time."
    },
    code: {
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
    vector<int> tree;
    void update(int node, int start, int end, int idx) {
        if (start == end) { tree[node]++; return; }
        int mid = start + (end - start) / 2;
        if (idx <= mid) update(2 * node, start, mid, idx);
        else update(2 * node + 1, mid + 1, end, idx);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
    int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l || l > r) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = start + (end - start) / 2;
        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }
public:
    vector<int> countSmaller(vector<int>& nums) {
        vector<int> sorted_nums = nums;
        sort(sorted_nums.begin(), sorted_nums.end());
        sorted_nums.erase(unique(sorted_nums.begin(), sorted_nums.end()), sorted_nums.end());
        int n = sorted_nums.size();
        tree.assign(4 * n, 0);
        vector<int> ans(nums.size());
        for (int i = nums.size() - 1; i >= 0; i--) {
            int rank = lower_bound(sorted_nums.begin(), sorted_nums.end(), nums[i]) - sorted_nums.begin();
            ans[i] = query(1, 0, n - 1, 0, rank - 1);
            update(1, 0, n - 1, rank);
        }
        return ans;
    }
};`,
      java: `import java.util.*;

class Solution {
    private int[] tree;
    public List<Integer> countSmaller(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        int[] unique = Arrays.stream(sorted).distinct().toArray();
        int n = unique.length;
        tree = new int[4 * Math.max(1, n)];
        Integer[] res = new Integer[nums.length];
        for (int i = nums.length - 1; i >= 0; i--) {
            int rank = Arrays.binarySearch(unique, nums[i]);
            res[i] = query(1, 0, n - 1, 0, rank - 1);
            update(1, 0, n - 1, rank);
        }
        return Arrays.asList(res);
    }
    private void update(int node, int start, int end, int idx) {
        if (start == end) { tree[node]++; return; }
        int mid = start + (end - start) / 2;
        if (idx <= mid) update(2 * node, start, mid, idx);
        else update(2 * node + 1, mid + 1, end, idx);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
    private int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l || l > r) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = start + (end - start) / 2;
        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }
}`,
      python: `import bisect

class Solution:
    def countSmaller(self, nums: list[int]) -> list[int]:
        unique = sorted(list(set(nums)))
        n = len(unique)
        tree = [0] * (4 * max(1, n))

        def update(node, start, end, idx):
            if start == end:
                tree[node] += 1
                return
            mid = (start + end) // 2
            if idx <= mid: update(2 * node, start, mid, idx)
            else: update(2 * node + 1, mid + 1, end, idx)
            tree[node] = tree[2 * node] + tree[2 * node + 1]

        def query(node, start, end, l, r):
            if r < start or end < l or l > r: return 0
            if l <= start and end <= r: return tree[node]
            mid = (start + end) // 2
            return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r)

        ans = [0] * len(nums)
        for i in range(len(nums) - 1, -1, -1):
            rank = bisect.bisect_left(unique, nums[i])
            ans[i] = query(1, 0, n - 1, 0, rank - 1)
            update(1, 0, n - 1, rank)
        return ans`,
      javascript: `class Solution {
  countSmaller(nums) {
    const unique = Array.from(new Set(nums)).sort((a, b) => a - b);
    const n = unique.length;
    const tree = new Array(4 * Math.max(1, n)).fill(0);

    function update(node, start, end, idx) {
      if (start === end) { tree[node]++; return; }
      const mid = Math.floor((start + end) / 2);
      if (idx <= mid) update(2 * node, start, mid, idx);
      else update(2 * node + 1, mid + 1, end, idx);
      tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    function query(node, start, end, l, r) {
      if (r < start || end < l || l > r) return 0;
      if (l <= start && end <= r) return tree[node];
      const mid = Math.floor((start + end) / 2);
      return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }

    const ans = new Array(nums.length);
    for (let i = nums.length - 1; i >= 0; i--) {
      const rank = unique.indexOf(nums[i]);
      ans[i] = query(1, 0, n - 1, 0, rank - 1);
      update(1, 0, n - 1, rank);
    }
    return ans;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Traversing left-to-right instead of right-to-left."],
      edgeCases: ["Array with all identical numbers", "Array with 1 element"],
      tips: ["Right-to-left traversal ensures only elements after self are stored in the tree when queried."]
    },
    practiceProblems: [
      { title: "Count of Smaller Numbers After Self", difficulty: "Hard", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/" }
    ],
    relatedTopics: [
      { title: "Segment Tree Applications", id: "segment-tree-applications" },
      { title: "Skyline Problem", id: "skyline-problem" }
    ]
  },

  "skyline-problem": {
    id: "skyline-problem",
    introduction: "The Skyline Problem computes the outer silhouette formed by overlapping buildings using a Range Maximum Segment Tree with coordinate compression and line sweep.",
    intuition: "A building adds height H over horizontal range [L, R-1]. We can update the range maximum in a Segment Tree lazily for each building. Sweeping horizontal coordinates then yields the skyline contour points!",
    walkthrough: [
      { phase: "Coordinate Compression", description: "Collect all building start and end x-coordinates into a sorted list of unique points." },
      { phase: "Range Max Update", description: "For each building [L, R, H], perform Range Maximum update over coordinate range [L, R-1] with value H." },
      { phase: "Silhouette Extraction", description: "Scan through all x-coordinates, query point height at x. Record key point whenever height changes." }
    ],
    dryRun: {
      input: "Buildings: [[2,9,10], [3,7,15], [5,12,12]]",
      output: "Skyline key points: [[2,10], [3,15], [7,12], [12,0]]",
      steps: [
        "Unique x coordinates: [2, 3, 5, 7, 9, 12].",
        "Add building 1 [2, 9, 10] -> Range max [2, 8] = 10.",
        "Add building 2 [3, 7, 15] -> Range max [3, 6] = max(10, 15) = 15.",
        "Add building 3 [5, 12, 12] -> Range max [5, 11] = max(..., 12).",
        "Scan height profile: x=2: H=10, x=3: H=15, x=7: H=12, x=12: H=0. Key points recorded!"
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "Sorting N buildings and querying height changes in segment tree takes O(N log N) total time."
    },
    code: {
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

class SkylineSegmentTree {
    int n;
    vector<int> tree, lazy;

    void pushDown(int node) {
        if (lazy[node] != 0) {
            tree[2 * node] = max(tree[2 * node], lazy[node]);
            lazy[2 * node] = max(lazy[2 * node], lazy[node]);
            tree[2 * node + 1] = max(tree[2 * node + 1], lazy[node]);
            lazy[2 * node + 1] = max(lazy[2 * node + 1], lazy[node]);
            lazy[node] = 0;
        }
    }

    void update(int node, int start, int end, int l, int r, int h) {
        if (r < start || end < l) return;
        if (l <= start && end <= r) {
            tree[node] = max(tree[node], h);
            lazy[node] = max(lazy[node], h);
            return;
        }
        pushDown(node);
        int mid = start + (end - start) / 2;
        update(2 * node, start, mid, l, r, h);
        update(2 * node + 1, mid + 1, end, l, r, h);
        tree[node] = max(tree[2 * node], tree[2 * node + 1]);
    }

    int query(int node, int start, int end, int idx) {
        if (start == end) return tree[node];
        pushDown(node);
        int mid = start + (end - start) / 2;
        if (idx <= mid) return query(2 * node, start, mid, idx);
        return query(2 * node + 1, mid + 1, end, idx);
    }
public:
    vector<vector<int>> getSkyline(vector<vector<int>>& buildings) {
        vector<int> coords;
        for (auto& b : buildings) { coords.push_back(b[0]); coords.push_back(b[1]); }
        sort(coords.begin(), coords.end());
        coords.erase(unique(coords.begin(), coords.end()), coords.end());

        n = coords.size();
        tree.assign(4 * n, 0);
        lazy.assign(4 * n, 0);

        for (auto& b : buildings) {
            int l = lower_bound(coords.begin(), coords.end(), b[0]) - coords.begin();
            int r = lower_bound(coords.begin(), coords.end(), b[1]) - coords.begin() - 1;
            update(1, 0, n - 1, l, r, b[2]);
        }

        vector<vector<int>> result;
        int prevH = 0;
        for (int i = 0; i < n; i++) {
            int curH = query(1, 0, n - 1, i);
            if (curH != prevH) {
                result.push_back({coords[i], curH});
                prevH = curH;
            }
        }
        return result;
    }
};`,
      java: `import java.util.*;

public class SkylineSegmentTree {
    private int[] tree, lazy;

    public List<List<Integer>> getSkyline(int[][] buildings) {
        List<Integer> coordsList = new ArrayList<>();
        for (int[] b : buildings) { coordsList.add(b[0]); coordsList.add(b[1]); }
        Collections.sort(coordsList);
        int[] coords = coordsList.stream().distinct().mapToInt(i -> i).toArray();
        int n = coords.length;

        tree = new int[4 * Math.max(1, n)];
        lazy = new int[4 * Math.max(1, n)];

        for (int[] b : buildings) {
            int l = Arrays.binarySearch(coords, b[0]);
            int r = Arrays.binarySearch(coords, b[1]) - 1;
            update(1, 0, n - 1, l, r, b[2]);
        }

        List<List<Integer>> res = new ArrayList<>();
        int prevH = 0;
        for (int i = 0; i < n; i++) {
            int curH = query(1, 0, n - 1, i);
            if (curH != prevH) {
                res.add(Arrays.asList(coords[i], curH));
                prevH = curH;
            }
        }
        return res;
    }

    private void pushDown(int node) {
        if (lazy[node] != 0) {
            tree[2 * node] = Math.max(tree[2 * node], lazy[node]);
            lazy[2 * node] = Math.max(lazy[2 * node], lazy[node]);
            tree[2 * node + 1] = Math.max(tree[2 * node + 1], lazy[node]);
            lazy[2 * node + 1] = Math.max(lazy[2 * node + 1], lazy[node]);
            lazy[node] = 0;
        }
    }

    private void update(int node, int start, int end, int l, int r, int h) {
        if (r < start || end < l) return;
        if (l <= start && end <= r) {
            tree[node] = Math.max(tree[node], h);
            lazy[node] = Math.max(lazy[node], h);
            return;
        }
        pushDown(node);
        int mid = start + (end - start) / 2;
        update(2 * node, start, mid, l, r, h);
        update(2 * node + 1, mid + 1, end, l, r, h);
        tree[node] = Math.max(tree[2 * node], tree[2 * node + 1]);
    }

    private int query(int node, int start, int end, int idx) {
        if (start == end) return tree[node];
        pushDown(node);
        int mid = start + (end - start) / 2;
        if (idx <= mid) return query(2 * node, start, mid, idx);
        return query(2 * node + 1, mid + 1, end, idx);
    }
}`,
      python: `import bisect

class Solution:
    def getSkyline(self, buildings: list[list[int]]) -> list[list[int]]:
        coords = sorted(list(set([b[0] for b in buildings] + [b[1] for b in buildings])))
        n = len(coords)
        tree = [0] * (4 * max(1, n))
        lazy = [0] * (4 * max(1, n))

        def push_down(node):
            if lazy[node] != 0:
                tree[2 * node] = max(tree[2 * node], lazy[node])
                lazy[2 * node] = max(lazy[2 * node], lazy[node])
                tree[2 * node + 1] = max(tree[2 * node + 1], lazy[node])
                lazy[2 * node + 1] = max(lazy[2 * node + 1], lazy[node])
                lazy[node] = 0

        def update(node, start, end, l, r, h):
            if r < start or end < l: return
            if l <= start and end <= r:
                tree[node] = max(tree[node], h)
                lazy[node] = max(lazy[node], h)
                return
            push_down(node)
            mid = (start + end) // 2
            update(2 * node, start, mid, l, r, h)
            update(2 * node + 1, mid + 1, end, l, r, h)
            tree[node] = max(tree[2 * node], tree[2 * node + 1])

        def query(node, start, end, idx):
            if start == end: return tree[node]
            push_down(node)
            mid = (start + end) // 2
            if idx <= mid: return query(2 * node, start, mid, idx)
            return query(2 * node + 1, mid + 1, end, idx)

        for b in buildings:
            l = bisect.bisect_left(coords, b[0])
            r = bisect.bisect_left(coords, b[1]) - 1
            update(1, 0, n - 1, l, r, b[2])

        res = []
        prev_h = 0
        for i in range(n):
            cur_h = query(1, 0, n - 1, i)
            if cur_h != prev_h:
                res.append([coords[i], cur_h])
                prev_h = cur_h
        return res`,
      javascript: `class Solution {
  getSkyline(buildings) {
    const coordsSet = new Set();
    for (const b of buildings) { coordsSet.add(b[0]); coordsSet.add(b[1]); }
    const coords = Array.from(coordsSet).sort((a, b) => a - b);
    const n = coords.length;

    const tree = new Array(4 * Math.max(1, n)).fill(0);
    const lazy = new Array(4 * Math.max(1, n)).fill(0);

    function pushDown(node) {
      if (lazy[node] !== 0) {
        tree[2 * node] = Math.max(tree[2 * node], lazy[node]);
        lazy[2 * node] = Math.max(lazy[2 * node], lazy[node]);
        tree[2 * node + 1] = Math.max(tree[2 * node + 1], lazy[node]);
        lazy[2 * node + 1] = Math.max(lazy[2 * node + 1], lazy[node]);
        lazy[node] = 0;
      }
    }

    function update(node, start, end, l, r, h) {
      if (r < start || end < l) return;
      if (l <= start && end <= r) {
        tree[node] = Math.max(tree[node], h);
        lazy[node] = Math.max(lazy[node], h);
        return;
      }
      pushDown(node);
      const mid = Math.floor((start + end) / 2);
      update(2 * node, start, mid, l, r, h);
      update(2 * node + 1, mid + 1, end, l, r, h);
      tree[node] = Math.max(tree[2 * node], tree[2 * node + 1]);
    }

    function query(node, start, end, idx) {
      if (start === end) return tree[node];
      pushDown(node);
      const mid = Math.floor((start + end) / 2);
      if (idx <= mid) return query(2 * node, start, mid, idx);
      return query(2 * node + 1, mid + 1, end, idx);
    }

    for (const b of buildings) {
      const l = coords.indexOf(b[0]);
      const r = coords.indexOf(b[1]) - 1;
      update(1, 0, n - 1, l, r, b[2]);
    }

    const res = [];
    let prevH = 0;
    for (let i = 0; i < n; i++) {
      const curH = query(1, 0, n - 1, i);
      if (curH !== prevH) {
        res.push([coords[i], curH]);
        prevH = curH;
      }
    }
    return res;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Using inclusive right boundary R instead of R-1. A building of range [L, R] covers interval [L, R-1] in coordinates."],
      edgeCases: ["Adjacent buildings touching at boundary", "Buildings completely nested inside larger buildings"],
      tips: ["Segment Tree simplifies Skyline by turning geometric line sweep into straightforward range maximum updates!"]
    },
    practiceProblems: [
      { title: "The Skyline Problem", difficulty: "Hard", url: "https://leetcode.com/problems/the-skyline-problem/" }
    ],
    relatedTopics: [
      { title: "Segment Tree Applications", id: "segment-tree-applications" },
      { title: "Count Smaller Numbers", id: "count-smaller-numbers" }
    ]
  }
};
