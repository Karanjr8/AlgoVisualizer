import type { AlgorithmContent } from './algorithmContent';

export const advancedPatternsAlgorithmContent: Record<string, AlgorithmContent> = {
  "monotonic-stack-pattern": {
    id: "monotonic-stack-pattern",
    introduction: "The Monotonic Stack pattern maintains elements in strictly increasing or decreasing order inside a stack. It answers 'Next/Previous Greater or Smaller Element' queries in O(N) linear time by ensuring each element is pushed and popped at most once.",
    intuition: "Instead of searching forward/backward in O(N) per element (O(N²) total), maintain a stack of candidates. When a new element arrives that breaks monotonicity, pop elements off the stack — the new element is the 'Next Greater/Smaller' element for all popped items!",
    recognitionSignals: [
      "Find Next Greater / Previous Greater Element",
      "Find Next Smaller / Previous Smaller Element",
      "Calculate max rectangle area in histogram or matrix",
      "Stock span / Temperature warm days ahead",
      "Subarray minimum / maximum contributions"
    ],
    walkthrough: [
      { phase: "Initialize Stack", description: "Maintain a stack storing element values or array indices." },
      { phase: "Maintain Monotonicity", description: "Before pushing element X, pop all stack elements that violate the monotonic property." },
      { phase: "Record Answers", description: "The element causing the pop is the 'Next Greater/Smaller' element for popped items." },
      { phase: "Push Element", description: "Push current element or index onto the stack." }
    ],
    dryRun: {
      input: "Array: [2, 1, 5, 6, 2, 3] | Next Greater Element",
      output: "Result: [5, 5, 6, -1, 3, -1]",
      steps: [
        "Index 0 (val 2): Stack = [0]",
        "Index 1 (val 1): 1 < 2 -> Stack = [0, 1]",
        "Index 2 (val 5): 5 > 1 (pop 1, nextGreater[1]=5), 5 > 2 (pop 0, nextGreater[0]=5) -> Stack = [2]",
        "Index 3 (val 6): 6 > 5 (pop 2, nextGreater[2]=6) -> Stack = [3]",
        "Index 4 (val 2): 2 < 6 -> Stack = [3, 4]",
        "Index 5 (val 3): 3 > 2 (pop 4, nextGreater[4]=3) -> Stack = [3, 5]",
        "End of array: Remaining stack elements [3, 5] have no greater element (-1)."
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(N)",
      analysis: "Each element is pushed to the stack exactly once and popped at most once. Amortized time per element is O(1), leading to overall O(N) linear time."
    },
    code: {
      cpp: `#include <vector>
#include <stack>
using namespace std;

vector<int> nextGreaterElement(const vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st; // stores indices

    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}`,
      java: `import java.util.*;

public class MonotonicStack {
    public int[] nextGreaterElement(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        Deque<Integer> stack = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
                result[stack.pop()] = nums[i];
            }
            stack.push(i);
        }
        return result;
    }
}`,
      python: `def next_greater_element(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices

    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    return result`,
      javascript: `function nextGreaterElement(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = [];

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`
    },
    interviewNotes: {
      mistakes: [
        "Storing values instead of indices in stack when the problem requires distance or subarray length calculations.",
        "Confusing increasing stack (used for Next Smaller) with decreasing stack (used for Next Greater)."
      ],
      edgeCases: ["Strictly decreasing or strictly increasing input array", "Duplicate elements"],
      tips: [
        "Next Greater -> Monotonic Decreasing Stack",
        "Next Smaller -> Monotonic Increasing Stack"
      ]
    },
    practiceProblems: [
      { title: "Daily Temperatures", difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },
      { title: "Next Greater Element I", difficulty: "Easy", url: "https://leetcode.com/problems/next-greater-element-i/" },
      { title: "Largest Rectangle in Histogram", difficulty: "Hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" }
    ],
    relatedTopics: [
      { title: "Monotonic Queue Pattern", id: "monotonic-queue-pattern" }
    ]
  },

  "monotonic-queue-pattern": {
    id: "monotonic-queue-pattern",
    introduction: "The Monotonic Queue pattern maintains elements in a double-ended queue (deque) in sorted order while sliding a fixed or dynamic window over an array in O(N) linear time.",
    intuition: "When finding the maximum in a sliding window of size K, new larger elements render all older smaller elements useless. Maintain a deque of indices where values are strictly decreasing. The front of the deque ALWAYS holds the maximum element for the current window!",
    recognitionSignals: [
      "Sliding Window Maximum / Minimum",
      "Constrained Subarray Sum with window constraint <= K",
      "Shortest Subarray with Sum at least K",
      "Max value in contiguous subsegments"
    ],
    walkthrough: [
      { phase: "Remove Expired Indices", description: "Pop indices from front of deque if they fall outside current window [i - K + 1, i]." },
      { phase: "Maintain Monotonicity", description: "Pop indices from back of deque if their values are <= current element nums[i]." },
      { phase: "Push Current Index", description: "Push current index i to back of deque." },
      { phase: "Record Window Result", description: "The front element deque[0] is the window maximum for current window." }
    ],
    dryRun: {
      input: "Array: [1, 3, -1, -3, 5, 3, 6, 7], K = 3",
      output: "Window Maxima: [3, 3, 5, 5, 6, 7]",
      steps: [
        "i=0 (1): Deque = [0]",
        "i=1 (3): 3 > 1 -> Deque = [1]",
        "i=2 (-1): -1 < 3 -> Deque = [1, 2] -> Window 1: Max = nums[1] = 3",
        "i=3 (-3): Deque = [1, 2, 3] -> Window 2: Max = nums[1] = 3",
        "i=4 (5): Expire 1. 5 > -3, -1 -> Deque = [4] -> Window 3: Max = nums[4] = 5",
        "i=5 (3): 3 < 5 -> Deque = [4, 5] -> Window 4: Max = nums[4] = 5",
        "i=6 (6): 6 > 3, 5 -> Deque = [6] -> Window 5: Max = nums[6] = 6",
        "i=7 (7): 7 > 6 -> Deque = [7] -> Window 6: Max = nums[7] = 7"
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(K)",
      analysis: "Each index is added to the deque once and removed at most once. Amortized time per element is O(1), leading to O(N) time and O(K) space."
    },
    code: {
      cpp: `#include <vector>
#include <deque>
using namespace std;

vector<int> maxSlidingWindow(const vector<int>& nums, int k) {
    int n = nums.size();
    vector<int> result;
    deque<int> dq; // stores indices

    for (int i = 0; i < n; i++) {
        if (!dq.empty() && dq.front() == i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}`,
      java: `import java.util.*;

public class MonotonicQueue {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            if (!dq.isEmpty() && dq.peekFirst() == i - k) dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) result[i - k + 1] = nums[dq.peekFirst()];
        }
        return result;
    }
}`,
      python: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque()  # stores indices
    result = []

    for i in range(len(nums)):
        if dq and dq[0] == i - k:
            dq.popleft()
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,
      javascript: `function maxSlidingWindow(nums, k) {
  const dq = []; // stores indices
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    if (dq.length > 0 && dq[0] === i - k) dq.shift();
    while (dq.length > 0 && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) result.push(nums[dq[0]]);
  }
  return result;
}`
    },
    interviewNotes: {
      mistakes: ["Using Priority Queue / Heap which results in O(N log K) instead of optimal O(N) Monotonic Queue."],
      edgeCases: ["K = 1", "K = N"],
      tips: ["Monotonic Queue maintains indices, enabling instant expiration checking `dq[0] == i - K`."]
    },
    practiceProblems: [
      { title: "Sliding Window Maximum", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/" },
      { title: "Constrained Subarray Sum", difficulty: "Hard", url: "https://leetcode.com/problems/constrained-subarray-sum/" }
    ],
    relatedTopics: [
      { title: "Monotonic Stack Pattern", id: "monotonic-stack-pattern" }
    ]
  },

  "union-find-pattern": {
    id: "union-find-pattern",
    introduction: "Union Find (Disjoint Set Union - DSU) tracks partitioned connected components and answers connectivity queries in near-constant O(α(N)) amortized time using Path Compression and Union by Rank.",
    intuition: "Instead of running DFS/BFS repeatedly to check if two nodes are connected, represent connected sets as trees where every node points to a root representative. Union merges two trees; Find follows parent pointers to the root with Path Compression flattening the tree!",
    recognitionSignals: [
      "Dynamic Connectivity (edges added incrementally)",
      "Count Connected Components in undirected graph",
      "Detect cycles in undirected graphs",
      "Redundant Connection / Accounts Merge",
      "Kruskal Minimum Spanning Tree"
    ],
    walkthrough: [
      { phase: "Initialization", description: "Set parent[i] = i and rank[i] = 1 for all nodes 0...N-1." },
      { phase: "Find with Path Compression", description: "find(x) recursively finds root of x and updates parent[x] = find(parent[x]) to point directly to root." },
      { phase: "Union by Rank", description: "union(x, y) finds rootX and rootY. If rootX != rootY, attach smaller tree under larger tree." }
    ],
    dryRun: {
      input: "N = 5 nodes | Edges: (0,1), (1,2), (3,4), (2,0 - redundant!)",
      output: "Redundant edge = (2,0)",
      steps: [
        "Edge (0,1): root(0)=0, root(1)=1. Union -> parent[1]=0. Components = 4.",
        "Edge (1,2): root(1)=0, root(2)=2. Union -> parent[2]=0. Components = 3.",
        "Edge (3,4): root(3)=3, root(4)=4. Union -> parent[4]=3. Components = 2.",
        "Edge (2,0): root(2)=0, root(0)=0. Both roots are EQUAL -> Cycle detected! Redundant edge = (2,0)."
      ]
    },
    complexities: {
      time: { best: "O(α(N))", average: "O(α(N))", worst: "O(α(N))" },
      space: "O(N)",
      analysis: "Inverse Ackermann function α(N) <= 4 for all practical N (< 10^80). Operations are effectively constant O(1) time."
    },
    code: {
      cpp: `#include <vector>
#include <numeric>
using namespace std;

class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) : parent(n), rank(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path Compression
    }
    bool unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI != rootJ) {
            if (rank[rootI] < rank[rootJ]) swap(rootI, rootJ);
            parent[rootJ] = rootI;
            if (rank[rootI] == rank[rootJ]) rank[rootI]++;
            return true;
        }
        return false;
    }
};`,
      java: `public class DSU {
    private int[] parent, rank;

    public DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 1;
        }
    }

    public int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path Compression
    }

    public boolean unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI != rootJ) {
            if (rank[rootI] < rank[rootJ]) {
                int temp = rootI; rootI = rootJ; rootJ = temp;
            }
            parent[rootJ] = rootI;
            if (rank[rootI] == rank[rootJ]) rank[rootI]++;
            return true;
        }
        return false;
    }
}`,
      python: `class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [1] * n

    def find(self, i: int) -> int:
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])  # Path Compression
        return self.parent[i]

    def unite(self, i: int, j: int) -> bool:
        root_i, root_j = self.find(i), self.find(j)
        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                root_i, root_j = root_j, root_i
            self.parent[root_j] = root_i
            if self.rank[root_i] == self.rank[root_j]:
                self.rank[root_i] += 1
            return True
        return False`,
      javascript: `class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(1);
  }
  find(i) {
    if (this.parent[i] === i) return i;
    return (this.parent[i] = this.find(this.parent[i]));
  }
  unite(i, j) {
    let rootI = this.find(i), rootJ = this.find(j);
    if (rootI !== rootJ) {
      if (this.rank[rootI] < this.rank[rootJ]) {
        [rootI, rootJ] = [rootJ, rootI];
      }
      this.parent[rootJ] = rootI;
      if (this.rank[rootI] === this.rank[rootJ]) this.rank[rootI]++;
      return true;
    }
    return false;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Forgetting Path Compression (`parent[i] = find(parent[i])`), causing DSU time complexity to degrade from O(α(N)) to O(N)."],
      edgeCases: ["Single element graph N=1", "Graph already fully connected"],
      tips: ["DSU works ONLY for UNDIRECTED graphs. For directed graph cycles, use Topological Sort or Tarjan's SCC."]
    },
    practiceProblems: [
      { title: "Number of Provinces", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-provinces/" },
      { title: "Redundant Connection", difficulty: "Medium", url: "https://leetcode.com/problems/redundant-connection/" },
      { title: "Accounts Merge", difficulty: "Medium", url: "https://leetcode.com/problems/accounts-merge/" }
    ],
    relatedTopics: [
      { title: "MST Patterns", id: "mst-patterns" },
      { title: "Topological Sort Patterns", id: "topological-sort-patterns" }
    ]
  },

  "sweep-line-pattern": {
    id: "sweep-line-pattern",
    introduction: "The Sweep Line pattern converts multi-dimensional spatial or temporal interval problems into a 1D sequence of event points sorted by time/coordinate.",
    intuition: "Instead of comparing every interval against every other interval (O(N²)), decompose each interval [start, end] into two discrete events: (+1 at start) and (-1 at end). Sort all events by timestamp. Moving a conceptual vertical 'sweep line' across the events tracks active overlapping intervals in O(N log N) time!",
    recognitionSignals: [
      "Meeting Rooms / Max Overlapping Intervals",
      "Skyline Problem / Range Max Overlap",
      "Rectangle Area / Interval Overlaps",
      "Concurrency Peaks / CPU Resource Allocation"
    ],
    walkthrough: [
      { phase: "Decompose Intervals", description: "For interval [start, end], create start event (start, +1) and end event (end, -1)." },
      { phase: "Sort Events", description: "Sort events by timestamp. Break ties by processing end events (-1) before start events (+1) if intervals are open." },
      { phase: "Sweep Line Pass", description: "Iterate through sorted events maintaining running count of active intervals. Track peak overlapping count." }
    ],
    dryRun: {
      input: "Intervals: [[0, 30], [5, 10], [15, 20]] | Find min rooms required",
      output: "Peak rooms = 2",
      steps: [
        "Events: (0, +1), (30, -1), (5, +1), (10, -1), (15, +1), (20, -1)",
        "Sorted Events: (0, +1), (5, +1), (10, -1), (15, +1), (20, -1), (30, -1)",
        "Time 0: count = 1, peak = 1",
        "Time 5: count = 2, peak = 2 (Overlapping!)",
        "Time 10: count = 1",
        "Time 15: count = 2, peak = 2",
        "Time 20: count = 1",
        "Time 30: count = 0",
        "Result = Peak rooms = 2."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "Sorting 2N event points dominates execution time at O(N log N)."
    },
    code: {
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int minMeetingRooms(const vector<vector<int>>& intervals) {
    vector<pair<int, int>> events;
    for (const auto& i : intervals) {
        events.push_back({i[0], 1});   // Meeting Start
        events.push_back({i[1], -1});  // Meeting End
    }

    sort(events.begin(), events.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
        if (a.first != b.first) return a.first < b.first;
        return a.second < b.second; // End events (-1) before Start (+1) on tie
    });

    int count = 0, maxRooms = 0;
    for (const auto& e : events) {
        count += e.second;
        maxRooms = max(maxRooms, count);
    }
    return maxRooms;
}`,
      java: `import java.util.*;

public class SweepLine {
    public int minMeetingRooms(int[][] intervals) {
        List<int[]> events = new ArrayList<>();
        for (int[] i : intervals) {
            events.add(new int[]{i[0], 1});
            events.add(new int[]{i[1], -1});
        }

        events.sort((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));

        int count = 0, maxRooms = 0;
        for (int[] e : events) {
            count += e[1];
            maxRooms = Math.max(maxRooms, count);
        }
        return maxRooms;
    }
}`,
      python: `def min_meeting_rooms(intervals: list[list[int]]) -> int:
    events = []
    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))

    # Sort by time. If tie, -1 (end) comes before +1 (start)
    events.sort(key=lambda x: (x[0], x[1]))

    active = 0
    max_rooms = 0
    for time, delta in events:
        active += delta
        max_rooms = max(max_rooms, active)
    return max_rooms`,
      javascript: `function minMeetingRooms(intervals) {
  const events = [];
  for (const [start, end] of intervals) {
    events.push([start, 1]);
    events.push([end, -1]);
  }

  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

  let active = 0, maxRooms = 0;
  for (const [time, delta] of events) {
    active += delta;
    maxRooms = Math.max(maxRooms, active);
  }
  return maxRooms;
}`
    },
    interviewNotes: {
      mistakes: ["Tie-breaking errors when sorting events. If interval boundaries touch at time T (e.g. [1, 5] and [5, 10]), end event MUST be processed before start event to avoid counting unnecessary overlap."],
      edgeCases: ["Empty intervals", "Single interval", "Zero-length intervals [T, T]"],
      tips: ["Sweep Line turns 2D interval problems into 1D sorted event timeline processing."]
    },
    practiceProblems: [
      { title: "Meeting Rooms II", difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/" },
      { title: "The Skyline Problem", difficulty: "Hard", url: "https://leetcode.com/problems/the-skyline-problem/" }
    ],
    relatedTopics: [
      { title: "Difference Array Pattern", id: "difference-array-pattern" }
    ]
  },

  "difference-array-pattern": {
    id: "difference-array-pattern",
    introduction: "The Difference Array pattern performs multiple batch range update operations (add delta +D to sub-array [L, R]) in O(1) constant time per update, and reconstructs the final array in O(N) time using prefix sums.",
    intuition: "Instead of iterating through every index from L to R to add D (O(N) per update), modify only TWO boundary positions in a difference array D: set D[L] += delta and D[R+1] -= delta. Running a single prefix sum sweep at the end reconstructs all updated values!",
    recognitionSignals: [
      "Batch Range Addition (add value V to range [L, R] repeatedly)",
      "Corporate Flight Bookings / Car Pooling",
      "Range updates known in advance before queries",
      "Shifting values across range segments"
    ],
    walkthrough: [
      { phase: "Initialize Difference Array", description: "Allocate diff array of size N+1 initialized to 0." },
      { phase: "O(1) Range Updates", description: "For each update (L, R, delta): diff[L] += delta, diff[R+1] -= delta." },
      { phase: "O(N) Prefix Reconstruction", description: "Reconstruct final array: A[i] = A[i-1] + diff[i]." }
    ],
    dryRun: {
      input: "Array len 5 | Updates: [1, 3, +10], [2, 4, +5]",
      output: "Final Array: [0, 10, 15, 15, 5]",
      steps: [
        "Update 1 [1,3, +10]: diff[1] += 10, diff[4] -= 10 -> diff = [0, 10, 0, 0, -10, 0]",
        "Update 2 [2,4, +5]: diff[2] += 5, diff[5] -= 5 -> diff = [0, 10, 5, 0, -10, -5]",
        "Prefix Sum Sweep:",
        "A[0] = 0",
        "A[1] = A[0] + diff[1] = 10",
        "A[2] = A[1] + diff[2] = 15",
        "A[3] = A[2] + diff[3] = 15",
        "A[4] = A[3] + diff[4] = 5",
        "Final Result = [0, 10, 15, 15, 5]"
      ]
    },
    complexities: {
      time: { best: "O(N + U)", average: "O(N + U)", worst: "O(N + U)" },
      space: "O(N)",
      analysis: "U update operations take O(1) each. Final prefix reconstruction takes O(N) time."
    },
    code: {
      cpp: `#include <vector>
using namespace std;

vector<int> getModifiedArray(int length, const vector<vector<int>>& updates) {
    vector<int> diff(length + 1, 0);

    for (const auto& u : updates) {
        int l = u[0], r = u[1], val = u[2];
        diff[l] += val;
        if (r + 1 < length) diff[r + 1] -= val;
    }

    vector<int> result(length);
    result[0] = diff[0];
    for (int i = 1; i < length; i++) {
        result[i] = result[i - 1] + diff[i];
    }
    return result;
}`,
      java: `public class DifferenceArray {
    public int[] getModifiedArray(int length, int[][] updates) {
        int[] diff = new int[length + 1];

        for (int[] u : updates) {
            int l = u[0], r = u[1], val = u[2];
            diff[l] += val;
            if (r + 1 < length) diff[r + 1] -= val;
        }

        int[] result = new int[length];
        result[0] = diff[0];
        for (int i = 1; i < length; i++) {
            result[i] = result[i - 1] + diff[i];
        }
        return result;
    }
}`,
      python: `def get_modified_array(length: int, updates: list[list[int]]) -> list[int]:
    diff = [0] * (length + 1)

    for l, r, val in updates:
        diff[l] += val
        if r + 1 < length:
            diff[r + 1] -= val

    result = [0] * length
    result[0] = diff[0]
    for i in range(1, length):
        result[i] = result[i - 1] + diff[i]
    return result`,
      javascript: `function getModifiedArray(length, updates) {
  const diff = new Array(length + 1).fill(0);

  for (const [l, r, val] of updates) {
    diff[l] += val;
    if (r + 1 < length) diff[r + 1] -= val;
  }

  const result = new Array(length);
  result[0] = diff[0];
  for (let i = 1; i < length; i++) {
    result[i] = result[i - 1] + diff[i];
  }
  return result;
}`
    },
    interviewNotes: {
      mistakes: ["Forgetting boundary check `r + 1 < length` when setting `diff[r + 1] -= val`."],
      edgeCases: ["Updates covering entire array [0, N-1]", "Negative delta values"],
      tips: ["Use Difference Array when ALL updates occur before any queries. If updates and queries are interleaved, use Fenwick Tree!"]
    },
    practiceProblems: [
      { title: "Range Addition", difficulty: "Medium", url: "https://leetcode.com/problems/range-addition/" },
      { title: "Corporate Flight Bookings", difficulty: "Medium", url: "https://leetcode.com/problems/corporate-flight-bookings/" },
      { title: "Car Pooling", difficulty: "Medium", url: "https://leetcode.com/problems/car-pooling/" }
    ],
    relatedTopics: [
      { title: "Sweep Line Pattern", id: "sweep-line-pattern" },
      { title: "BIT Point Update", id: "bit-point-update" }
    ]
  },

  "binary-search-on-answer-pattern": {
    id: "binary-search-on-answer-pattern",
    introduction: "Binary Search On Answer binary searches over a monotonic search space of potential solution values [low, high] and uses a boolean feasibility function `isPossible(mid)` to find the optimal threshold in O(N log(Range)) time.",
    intuition: "When direct optimization is hard but checking 'Is speed X feasible?' is easy and monotonic (if speed X works, any speed > X also works), binary search the answer! Shift low/high based on feasibility test result.",
    recognitionSignals: [
      "Minimize the Maximum value",
      "Maximize the Minimum value",
      "Feasibility Function is monotonic (True/False split point)",
      "Koko Eating Bananas / Capacity To Ship Packages / Aggressive Cows"
    ],
    walkthrough: [
      { phase: "Define Search Space", description: "Establish low (minimum possible answer) and high (maximum possible answer)." },
      { phase: "Check Feasibility", description: "Calculate mid = low + (high - low)/2. Test `isPossible(mid)`." },
      { phase: "Adjust Bounds", description: "If feasible, record mid as candidate answer and narrow search to find better optimal value. Otherwise, adjust search bound." }
    ],
    dryRun: {
      input: "Piles: [3, 6, 7, 11], H = 8 hours | Koko Eating Bananas",
      output: "Min Speed = 4",
      steps: [
        "Search space: low = 1, high = 11.",
        "Mid = 6: Hours needed = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6) = 1+1+2+2 = 6 <= 8 (Feasible!). Search left: high = 5.",
        "Mid = 3: Hours needed = ceil(3/3)+ceil(6/3)+ceil(7/3)+ceil(11/3) = 1+2+3+4 = 10 > 8 (Infeasible!). Search right: low = 4.",
        "Mid = 4: Hours needed = 1+2+2+3 = 8 <= 8 (Feasible!). High = 3.",
        "Low (4) > High (3). Loop terminates. Optimal Min Speed = 4."
      ]
    },
    complexities: {
      time: { best: "O(N log(Max-Min))", average: "O(N log(Max-Min))", worst: "O(N log(Max-Min))" },
      space: "O(1)",
      analysis: "Binary search performs log2(Range) feasibility checks, taking O(N) time each."
    },
    code: {
      cpp: `#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

bool isFeasible(const vector<int>& piles, int h, int speed) {
    int hours = 0;
    for (int p : piles) {
        hours += (p + speed - 1) / speed; // ceil(p / speed)
    }
    return hours <= h;
}

int minEatingSpeed(const vector<int>& piles, int h) {
    int low = 1, high = *max_element(piles.begin(), piles.end());
    int ans = high;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (isFeasible(piles, h, mid)) {
            ans = mid;
            high = mid - 1; // Try smaller speed
        } else {
            low = mid + 1;  // Need faster speed
        }
    }
    return ans;
}`,
      java: `import java.util.*;

public class BSOnAnswer {
    private boolean isFeasible(int[] piles, int h, int speed) {
        int hours = 0;
        for (int p : piles) {
            hours += (p + speed - 1) / speed;
        }
        return hours <= h;
    }

    public int minEatingSpeed(int[] piles, int h) {
        int low = 1, high = 0;
        for (int p : piles) high = Math.max(high, p);
        int ans = high;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (isFeasible(piles, h, mid)) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }
}`,
      python: `import math

def min_eating_speed(piles: list[int], h: int) -> int:
    def is_feasible(speed):
        return sum(math.ceil(p / speed) for p in piles) <= h

    low, high = 1, max(piles)
    ans = high

    while low <= high:
        mid = low + (high - low) // 2
        if is_feasible(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
    return ans`,
      javascript: `function minEatingSpeed(piles, h) {
  function isFeasible(speed) {
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / speed);
    return hours <= h;
  }

  let low = 1, high = Math.max(...piles);
  let ans = high;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (isFeasible(mid)) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`
    },
    interviewNotes: {
      mistakes: ["Integer overflow when calculating `(low + high) / 2`. Always use `low + (high - low) / 2`."],
      edgeCases: ["H = number of piles (speed must be max pile)", "Very large range values"],
      tips: ["Whenever an interview question asks to 'Minimize Maximum' or 'Maximize Minimum', immediately check for Binary Search On Answer!"]
    },
    practiceProblems: [
      { title: "Koko Eating Bananas", difficulty: "Medium", url: "https://leetcode.com/problems/koko-eating-bananas/" },
      { title: "Capacity To Ship Packages Within D Days", difficulty: "Medium", url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/" }
    ],
    relatedTopics: [
      { title: "Lowbit Operation", id: "lowbit-operation" }
    ]
  },

  "bit-manipulation-patterns": {
    id: "bit-manipulation-patterns",
    introduction: "Bit Manipulation Patterns use low-level bitwise operations (XOR, AND, OR, bit shifts) to achieve O(1) auxiliary space and ultra-fast linear time solutions.",
    intuition: "XOR properties (`A ^ A = 0`, `A ^ 0 = A`, commutative) allow cancelling out duplicate elements instantly. Bitmasks allow representing subsets of size N as integers from 0 to 2^N - 1.",
    recognitionSignals: [
      "Single Number (every element appears twice except one)",
      "Missing Number in sequence 0...N",
      "Generate all subsets / power set without recursion",
      "Check if integer is power of 2: (N & (N - 1)) == 0"
    ],
    walkthrough: [
      { phase: "XOR Cancellation", description: "XOR all numbers together. Duplicates cancel out to 0, leaving single unique element." },
      { phase: "Subset Bitmasking", description: "Iterate bitmask mask from 0 to (1 << N) - 1. Bit k set means include element k." }
    ],
    dryRun: {
      input: "Array: [4, 1, 2, 1, 2]",
      output: "Single Number = 4",
      steps: [
        "Init xor = 0",
        "xor ^= 4 -> 4",
        "xor ^= 1 -> 5",
        "xor ^= 2 -> 7",
        "xor ^= 1 -> 6",
        "xor ^= 2 -> 4",
        "Result = 4 (All duplicate pairs 1 and 2 cancelled out!)."
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(1)",
      analysis: "Single bitwise pass with 0 extra memory allocation."
    },
    code: {
      cpp: `#include <vector>
using namespace std;

int singleNumber(const vector<int>& nums) {
    int res = 0;
    for (int n : nums) res ^= n;
    return res;
}`,
      java: `public class BitManipulation {
    public int singleNumber(int[] nums) {
        int res = 0;
        for (int n : nums) res ^= n;
        return res;
    }
}`,
      python: `def single_number(nums: list[int]) -> int:
    res = 0
    for n in nums:
        res ^= n
    return res`,
      javascript: `function singleNumber(nums) {
  let res = 0;
  for (const n of nums) res ^= n;
  return res;
}`
    },
    interviewNotes: {
      mistakes: ["Using bit shifts `1 << N` when N >= 31 without 64-bit int type."],
      edgeCases: ["N = 1", "Negative numbers"],
      tips: ["Bitwise XOR properties: A ^ A = 0, A ^ 0 = A."]
    },
    practiceProblems: [
      { title: "Single Number", difficulty: "Easy", url: "https://leetcode.com/problems/single-number/" },
      { title: "Missing Number", difficulty: "Easy", url: "https://leetcode.com/problems/missing-number/" },
      { title: "Subsets", difficulty: "Medium", url: "https://leetcode.com/problems/subsets/" }
    ],
    relatedTopics: [
      { title: "Lowbit Operation", id: "lowbit-operation" }
    ]
  },

  "meet-in-the-middle-pattern": {
    id: "meet-in-the-middle-pattern",
    introduction: "Meet In The Middle splits an exponential search space of size 2^N into two smaller halves of size 2^(N/2), computes subsets for each half, and combines them using binary search or two pointers in O(2^(N/2) * N) time.",
    intuition: "For N = 40, brute force 2^40 ≈ 10^12 operations will TLE. Splitting into two halves of N = 20 requires 2^20 ≈ 10^6 operations per half! Sorting one half and binary searching the complement reduces complexity dramatically.",
    recognitionSignals: [
      "N is around 30 to 40 (too large for 2^N, too small for polynomial)",
      "Subset sum target variants",
      "Split Array into two equal sum subsets"
    ],
    walkthrough: [
      { phase: "Split Input", description: "Divide array of size N into left half (size N/2) and right half (size N - N/2)." },
      { phase: "Generate Half Subsets", description: "Generate all 2^(N/2) subset sums for left half and right half separately." },
      { phase: "Sort & Binary Search", description: "Sort right subset sums. For each left sum S, binary search right half for best complement target - S." }
    ],
    dryRun: {
      input: "Array: [1, 3, 9, 27], Target = 31 | N = 4",
      output: "Subset Sum = 31 (1 + 3 + 27)",
      steps: [
        "Left = [1, 3] -> Left Sums = [0, 1, 3, 4]",
        "Right = [9, 27] -> Right Sums = [0, 9, 27, 36]",
        "For Left sum 4: Complement needed = 31 - 4 = 27. Found 27 in Right! Total = 31."
      ]
    },
    complexities: {
      time: { best: "O(2^(N/2) log(2^(N/2)))", average: "O(2^(N/2) log(2^(N/2)))", worst: "O(2^(N/2) log(2^(N/2)))" },
      space: "O(2^(N/2))",
      analysis: "Dramatically reduces complexity from 2^40 (10^12) to 2^20 (10^6)."
    },
    code: {
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<long long> getSubsetSums(const vector<int>& arr) {
    int n = arr.size();
    vector<long long> sums;
    for (int mask = 0; mask < (1 << n); mask++) {
        long long sum = 0;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) sum += arr[i];
        }
        sums.push_back(sum);
    }
    return sums;
}

bool minAbsDiff(vector<int>& nums, int target) {
    int n = nums.size();
    vector<int> left(nums.begin(), nums.begin() + n / 2);
    vector<int> right(nums.begin() + n / 2, nums.end());

    auto leftSums = getSubsetSums(left);
    auto rightSums = getSubsetSums(right);
    sort(rightSums.begin(), rightSums.end());

    for (long long l : leftSums) {
        long long needed = target - l;
        if (binary_search(rightSums.begin(), rightSums.end(), needed)) return true;
    }
    return false;
}`,
      java: `import java.util.*;

public class MeetInMiddle {
    private List<Long> getSubsetSums(int[] arr) {
        int n = arr.length;
        List<Long> sums = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            long sum = 0;
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) sum += arr[i];
            }
            sums.add(sum);
        }
        return sums;
    }
}`,
      python: `import bisect

def meet_in_the_middle(nums: list[int], target: int) -> bool:
    n = len(nums)
    left, right = nums[:n//2], nums[n//2:]

    def get_sums(arr):
        res = []
        for mask in range(1 << len(arr)):
            s = sum(arr[i] for i in range(len(arr)) if (mask & (1 << i)))
            res.append(s)
        return res

    left_sums = get_sums(left)
    right_sums = sorted(get_sums(right))

    for l in left_sums:
        needed = target - l
        idx = bisect.bisect_left(right_sums, needed)
        if idx < len(right_sums) and right_sums[idx] == needed:
            return True
    return False`,
      javascript: `function meetInMiddle(nums, target) {
  const n = nums.length;
  const left = nums.slice(0, Math.floor(n / 2));
  const right = nums.slice(Math.floor(n / 2));

  function getSums(arr) {
    const sums = [];
    const len = arr.length;
    for (let mask = 0; mask < (1 << len); mask++) {
      let s = 0;
      for (let i = 0; i < len; i++) {
        if (mask & (1 << i)) s += arr[i];
      }
      sums.push(s);
    }
    return sums;
  }

  const leftSums = getSums(left);
  const rightSums = getSums(right).sort((a, b) => a - b);

  for (const l of leftSums) {
    const needed = target - l;
    let low = 0, high = rightSums.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (rightSums[mid] === needed) return true;
      if (rightSums[mid] < needed) low = mid + 1;
      else high = mid - 1;
    }
  }
  return false;
}`
    },
    interviewNotes: {
      mistakes: ["Trying to apply Meet In The Middle when N > 45 (2^22 is manageable, 2^30 is too big)."],
      edgeCases: ["Target 0", "Empty array"],
      tips: ["N ≈ 40 is the golden indicator for Meet In The Middle!"]
    },
    practiceProblems: [
      { title: "Partition Array Into Two Arrays to Minimize Sum Difference", difficulty: "Hard", url: "https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/" }
    ],
    relatedTopics: [
      { title: "Bit Manipulation Patterns", id: "bit-manipulation-patterns" }
    ]
  },

  "topological-sort-patterns": {
    id: "topological-sort-patterns",
    introduction: "Topological Sort orders vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u appears before vertex v. Khan's algorithm uses indegree counts and a queue in O(V + E) time.",
    intuition: "Think of course prerequisites: Course A must be taken before Course B. Maintain an `indegree` array counting how many prerequisites each course has. Process courses with 0 prerequisites first, decrementing dependent course indegrees!",
    recognitionSignals: [
      "Prerequisite ordering (Course Schedule)",
      "Build dependency systems / Compilers",
      "Detect cycles in directed graphs",
      "Alien Dictionary / Character precedence"
    ],
    walkthrough: [
      { phase: "Calculate Indegrees", description: "Build adjacency list and compute indegree[v] for every node." },
      { phase: "Queue Zero Indegree Nodes", description: "Push all nodes with indegree == 0 into a BFS queue." },
      { phase: "Process Queue & Decrement", description: "Pop node u, add to topo order. For each neighbor v, decrement indegree[v]. If indegree[v] == 0, push v into queue." },
      { phase: "Cycle Check", description: "If processed node count < total vertices V, a directed cycle exists!" }
    ],
    dryRun: {
      input: "N = 4 courses | Prerequisites: [1,0], [2,0], [3,1], [3,2]",
      output: "Order: [0, 1, 2, 3]",
      steps: [
        "Indegrees: [0:0, 1:1, 2:1, 3:2]",
        "Queue = [0]",
        "Pop 0: Order = [0]. Decrement indegree of 1 -> 0, 2 -> 0. Queue = [1, 2]",
        "Pop 1: Order = [0, 1]. Decrement indegree of 3 -> 1. Queue = [2]",
        "Pop 2: Order = [0, 1, 2]. Decrement indegree of 3 -> 0. Queue = [3]",
        "Pop 3: Order = [0, 1, 2, 3]. Queue empty.",
        "Processed all 4 nodes -> Valid Topo Order!"
      ]
    },
    complexities: {
      time: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
      space: "O(V + E)",
      analysis: "Visits every vertex V and checks every edge E exactly once."
    },
    code: {
      cpp: `#include <vector>
#include <queue>
using namespace std;

vector<int> findOrder(int numCourses, const vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> indegree(numCourses, 0);

    for (const auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        indegree[p[0]]++;
    }

    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) q.push(i);
    }

    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--indegree[v] == 0) q.push(v);
        }
    }

    if (order.size() != numCourses) return {}; // Cycle detected
    return order;
}`,
      java: `import java.util.*;

public class TopoSort {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[numCourses];

        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            indegree[p[0]]++;
        }

        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) q.add(i);
        }

        int[] order = new int[numCourses];
        int idx = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            order[idx++] = u;
            for (int v : adj.get(u)) {
                if (--indegree[v] == 0) q.add(v);
            }
        }

        return idx == numCourses ? order : new int[0];
    }
}`,
      python: `from collections import deque

def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(num_courses)]
    indegree = [0] * num_courses

    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1

    q = deque([i for i in range(num_courses) if indegree[i] == 0])
    order = []

    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)

    return order if len(order) == num_courses else []`,
      javascript: `function findOrder(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);

  for (const [dest, src] of prerequisites) {
    adj[src].push(dest);
    indegree[dest]++;
  }

  const q = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) q.push(i);
  }

  const order = [];
  while (q.length > 0) {
    const u = q.shift();
    order.push(u);
    for (const v of adj[u]) {
      indegree[v]--;
      if (indegree[v] === 0) q.push(v);
    }
  }

  return order.length === numCourses ? order : [];
}`
    },
    interviewNotes: {
      mistakes: ["Using DSU for directed graph cycle detection. DSU works ONLY for undirected graphs! Use Topological Sort or DFS with 3-color state."],
      edgeCases: ["Graph with cycles (returns empty array)", "Disconnected DAG components"],
      tips: ["Kahn's Algorithm (BFS with indegree array) is the cleanest topological sort approach."]
    },
    practiceProblems: [
      { title: "Course Schedule II", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule-ii/" },
      { title: "Alien Dictionary", difficulty: "Hard", url: "https://leetcode.com/problems/alien-dictionary/" }
    ],
    relatedTopics: [
      { title: "Union Find Pattern", id: "union-find-pattern" },
      { title: "Shortest Path Patterns", id: "shortest-path-patterns" }
    ]
  },

  "shortest-path-patterns": {
    id: "shortest-path-patterns",
    introduction: "Shortest Path Patterns (Dijkstra, Bellman-Ford) find the minimum edge weight path from a source node to all other nodes in a weighted graph in O((V + E) log V) time using a Min-Priority Queue.",
    intuition: "Always expand the unvisited node with the SMALLEST tentative distance. Relax all outgoing edges from this node: if `dist[u] + weight < dist[v]`, update `dist[v]` and push `(dist[v], v)` into the priority queue.",
    recognitionSignals: [
      "Minimum cost / travel time in non-negative weighted graph",
      "Network Delay Time",
      "Cheapest Flights Within K Stops",
      "Grid traversal with weighted cost per cell"
    ],
    walkthrough: [
      { phase: "Initialize Distances", description: "Set dist[src] = 0, dist[v] = infinity for all other nodes. Push (0, src) into min-priority queue." },
      { phase: "Extract Minimum", description: "Pop (d, u) with smallest distance from min-heap. If d > dist[u], skip stale entry." },
      { phase: "Relax Edges", description: "For each neighbor (v, weight): if dist[u] + weight < dist[v], update dist[v] = dist[u] + weight and push into min-heap." }
    ],
    dryRun: {
      input: "Nodes 1..3, Edges: (1->2, 1), (2->3, 2), (1->3, 4) | Source = 1",
      output: "Distances: [dist[1]=0, dist[2]=1, dist[3]=3]",
      steps: [
        "Init: dist = [∞, 0, ∞, ∞]. Heap = [(0, 1)]",
        "Pop (0, 1): Relax (1->2, 1) -> dist[2] = 1, Heap = [(1, 2)]. Relax (1->3, 4) -> dist[3] = 4, Heap = [(1, 2), (4, 3)]",
        "Pop (1, 2): Relax (2->3, 2) -> dist[3] = min(4, 1+2=3) = 3! Heap = [(3, 3), (4, 3)]",
        "Pop (3, 3): Relaxed. Pop stale (4, 3) (skipped).",
        "Final distances: dist[2]=1, dist[3]=3."
      ]
    },
    complexities: {
      time: { best: "O((V + E) log V)", average: "O((V + E) log V)", worst: "O((V + E) log V)" },
      space: "O(V + E)",
      analysis: "Priority queue insertions and deletions take O(log V) time per edge."
    },
    code: {
      cpp: `#include <vector>
#include <queue>
using namespace std;

int networkDelayTime(const vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int, int>>> adj(n + 1);
    for (const auto& t : times) {
        adj[t[0]].push_back({t[1], t[2]});
    }

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(n + 1, 1e9);

    dist[k] = 0;
    pq.push({0, k});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;

        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    int maxDist = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == 1e9) return -1;
        maxDist = max(maxDist, dist[i]);
    }
    return maxDist;
}`,
      java: `import java.util.*;

public class Dijkstra {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        int[] dist = new int[n + 1];
        Arrays.fill(dist, 1000000000);

        dist[k] = 0;
        pq.add(new int[]{0, k});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0], u = curr[1];
            if (d > dist[u]) continue;

            for (int[] edge : adj.get(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.add(new int[]{dist[v], v});
                }
            }
        }

        int maxDist = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == 1000000000) return -1;
            maxDist = Math.max(maxDist, dist[i]);
        }
        return maxDist;
    }
}`,
      python: `import heapq

def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    adj = [[] for _ in range(n + 1)]
    for u, v, w in times:
        adj[u].append((v, w))

    pq = [(0, k)]
    dist = {i: float('inf') for i in range(1, n + 1)}
    dist[k] = 0

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))

    max_dist = max(dist.values())
    return max_dist if max_dist < float('inf') else -1`,
      javascript: `function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);

  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const pq = [[0, k]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;

    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }

  let maxDist = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxDist = Math.max(maxDist, dist[i]);
  }
  return maxDist;
}`
    },
    interviewNotes: {
      mistakes: ["Using Dijkstra on graphs with NEGATIVE edge weights! Dijkstra fails on negative weights — use Bellman-Ford algorithm instead."],
      edgeCases: ["Disconnected graph nodes", "Multiple edges between same vertices"],
      tips: ["Dijkstra is greedy: it always pops the node with current smallest distance."]
    },
    practiceProblems: [
      { title: "Network Delay Time", difficulty: "Medium", url: "https://leetcode.com/problems/network-delay-time/" },
      { title: "Cheapest Flights Within K Stops", difficulty: "Medium", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" }
    ],
    relatedTopics: [
      { title: "MST Patterns", id: "mst-patterns" },
      { title: "Topological Sort Patterns", id: "topological-sort-patterns" }
    ]
  },

  "mst-patterns": {
    id: "mst-patterns",
    introduction: "Minimum Spanning Tree (MST) patterns (Kruskal's & Prim's algorithms) connect all vertices in a weighted graph with minimum total edge weight without forming cycles in O(E log E) time.",
    intuition: "Kruskal's algorithm sorts all edges by weight, then uses Union Find (DSU) to greedily add the lightest edge that connects two previously disconnected components until V-1 edges are chosen.",
    recognitionSignals: [
      "Minimum cost to connect all cities / servers / islands",
      "Kruskal's Algorithm / Prim's Algorithm",
      "Min total weight spanning tree",
      "Optimize network cable length"
    ],
    walkthrough: [
      { phase: "Sort Edges", description: "Sort all graph edges in non-decreasing order of weight." },
      { phase: "Initialize DSU", description: "Create Union Find structure for V vertices." },
      { phase: "Greedy Edge Selection", description: "Iterate sorted edges (u, v, weight). If DSU.unite(u, v) succeeds (no cycle), add weight to total cost." },
      { phase: "Termination", description: "Stop when V - 1 edges have been added." }
    ],
    dryRun: {
      input: "4 Cities, Edges: (1-2: 1), (2-3: 4), (1-3: 3), (3-4: 2)",
      output: "Min Cost = 6 (edges: 1-2, 3-4, 1-3)",
      steps: [
        "Sorted edges: (1-2: 1), (3-4: 2), (1-3: 3), (2-3: 4)",
        "Edge (1-2: 1): Unite 1 and 2 (success). Total cost = 1. Edges = 1.",
        "Edge (3-4: 2): Unite 3 and 4 (success). Total cost = 1+2 = 3. Edges = 2.",
        "Edge (1-3: 3): Unite 1 and 3 (success). Total cost = 3+3 = 6. Edges = 3 (V-1!).",
        "Edge (2-3: 4): 2 and 3 already in same component (skipped).",
        "Result MST Total Cost = 6."
      ]
    },
    complexities: {
      time: { best: "O(E log E)", average: "O(E log E)", worst: "O(E log E)" },
      space: "O(V + E)",
      analysis: "Sorting E edges takes O(E log E). DSU operations take near-constant O(E α(V)) time."
    },
    code: {
      cpp: `#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

class DSU {
    vector<int> parent;
public:
    DSU(int n) : parent(n) { iota(parent.begin(), parent.end(), 0); }
    int find(int i) { return parent[i] == i ? i : parent[i] = find(parent[i]); }
    bool unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI != rootJ) { parent[rootI] = rootJ; return true; }
        return false;
    }
};

int minCostToConnect(int n, vector<vector<int>>& edges) {
    // edges: [u, v, weight]
    sort(edges.begin(), edges.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[2] < b[2];
    });

    DSU dsu(n + 1);
    int totalCost = 0, count = 0;

    for (const auto& e : edges) {
        if (dsu.unite(e[0], e[1])) {
            totalCost += e[2];
            if (++count == n - 1) break;
        }
    }
    return count == n - 1 ? totalCost : -1;
}`,
      java: `import java.util.*;

public class KruskalMST {
    static class DSU {
        int[] parent;
        DSU(int n) {
            parent = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        int find(int i) { return parent[i] == i ? i : (parent[i] = find(parent[i])); }
        boolean unite(int i, int j) {
            int rI = find(i), rJ = find(j);
            if (rI != rJ) { parent[rI] = rJ; return true; }
            return false;
        }
    }

    public int minCostToConnect(int n, int[][] edges) {
        Arrays.sort(edges, Comparator.comparingInt(a -> a[2]));
        DSU dsu = new DSU(n + 1);
        int totalCost = 0, count = 0;

        for (int[] e : edges) {
            if (dsu.unite(e[0], e[1])) {
                totalCost += e[2];
                if (++count == n - 1) break;
            }
        }
        return count == n - 1 ? totalCost : -1;
    }
}`,
      python: `def min_cost_to_connect(n: int, edges: list[list[int]]) -> int:
    # edges: [u, v, weight]
    edges.sort(key=lambda x: x[2])
    parent = list(range(n + 1))

    def find(i):
        if parent[i] == i: return i
        parent[i] = find(parent[i])
        return parent[i]

    total_cost = 0
    count = 0
    for u, v, w in edges:
        root_u, root_v = find(u), find(v)
        if root_u != root_v:
            parent[root_u] = root_v
            total_cost += w
            count += 1
            if count == n - 1:
                break
    return total_cost if count == n - 1 else -1`,
      javascript: `function minCostToConnect(n, edges) {
  edges.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({ length: n + 1 }, (_, i) => i);

  function find(i) {
    if (parent[i] === i) return i;
    return (parent[i] = find(parent[i]));
  }

  let totalCost = 0, count = 0;
  for (const [u, v, w] of edges) {
    const rootU = find(u), rootV = find(v);
    if (rootU !== rootV) {
      parent[rootU] = rootV;
      totalCost += w;
      count++;
      if (count === n - 1) break;
    }
  }
  return count === n - 1 ? totalCost : -1;
}`
    },
    interviewNotes: {
      mistakes: ["Confusing MST (minimizes sum of ALL edge weights) with Shortest Path (minimizes distance from ONE source)."],
      edgeCases: ["Graph cannot be connected (returns -1)", "N = 1"],
      tips: ["Kruskal's algorithm uses DSU + Edge Sorting. Prim's algorithm uses Min-Heap + Visited Set."]
    },
    practiceProblems: [
      { title: "Min Cost to Connect All Points", difficulty: "Medium", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/" }
    ],
    relatedTopics: [
      { title: "Union Find Pattern", id: "union-find-pattern" },
      { title: "Shortest Path Patterns", id: "shortest-path-patterns" }
    ]
  },

  "state-compression-dp-pattern": {
    id: "state-compression-dp-pattern",
    introduction: "State Compression DP (Bitmask DP) represents non-boolean visited subsets of small size N (N <= 20) as bitmasks inside integer DP states in O(2^N * N^2) time.",
    intuition: "For Travelling Salesperson Problem (TSP) or subset assignments, the subproblem state requires knowing 'Which subset of cities have I visited?' and 'Which city am I at right now?'. A bitmask integer (0 to 2^N - 1) represents the visited subset compactly!",
    recognitionSignals: [
      "Traveling Salesperson Problem (TSP)",
      "N is very small (N <= 16 to 20)",
      "Subset state transitions `dp(mask, u)`",
      "Bitmask DP / Assign items to workers"
    ],
    walkthrough: [
      { phase: "Define Bitmask State", description: "State: `dp[mask][u]` = min cost to visit subset of nodes encoded by bitmask `mask`, ending at node `u`." },
      { phase: "Base Case", description: "When mask == (1 << N) - 1 (all nodes visited), return distance back to start node." },
      { phase: "Transitions", description: "For next node v not in mask (`!(mask & (1 << v))`): `dp[mask][u] = min(cost(u, v) + dp[mask | (1 << v)][v])`." }
    ],
    dryRun: {
      input: "N = 3 cities | Distances: 0->1: 10, 1->2: 15, 0->2: 20, etc.",
      output: "Min TSP Tour Cost",
      steps: [
        "Initial state: mask = 001₂ (visited city 0), current city = 0.",
        "Option A: Visit city 1 -> mask becomes 011₂, cost = 10 + dp(011₂, 1)",
        "Option B: Visit city 2 -> mask becomes 101₂, cost = 20 + dp(101₂, 2)",
        "Recurse over sub-masks until all cities (mask = 111₂) visited."
      ]
    },
    complexities: {
      time: { best: "O(2^N * N^2)", average: "O(2^N * N^2)", worst: "O(2^N * N^2)" },
      space: "O(2^N * N)",
      analysis: "2^N bitmask states with N possible current node endings."
    },
    code: {
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
    int n;
    vector<vector<int>> dist;
    vector<vector<int>> memo;

    int tsp(int mask, int u) {
        if (mask == (1 << n) - 1) return dist[u][0]; // Return to start
        if (memo[mask][u] != -1) return memo[mask][u];

        int ans = 1e9;
        for (int v = 0; v < n; v++) {
            if (!(mask & (1 << v))) { // Node v not visited
                ans = min(ans, dist[u][v] + tsp(mask | (1 << v), v));
            }
        }
        return memo[mask][u] = ans;
    }

public:
    int totalCost(const vector<vector<int>>& graph) {
        dist = graph;
        n = graph.size();
        memo.assign(1 << n, vector<int>(n, -1));
        return tsp(1, 0); // Start at node 0 with mask 1
    }
};`,
      java: `import java.util.*;

public class BitmaskDP {
    private int n;
    private int[][] dist;
    private int[][] memo;

    private int tsp(int mask, int u) {
        if (mask == (1 << n) - 1) return dist[u][0];
        if (memo[mask][u] != -1) return memo[mask][u];

        int ans = 1000000000;
        for (int v = 0; v < n; v++) {
            if ((mask & (1 << v)) == 0) {
                ans = Math.min(ans, dist[u][v] + tsp(mask | (1 << v), v));
            }
        }
        return memo[mask][u] = ans;
    }

    public int totalCost(int[][] graph) {
        dist = graph;
        n = graph.length;
        memo = new int[1 << n][n];
        for (int[] row : memo) Arrays.fill(row, -1);
        return tsp(1, 0);
    }
}`,
      python: `def solve_tsp(graph: list[list[int]]) -> int:
    n = len(graph)
    memo = {}

    def tsp(mask, u):
        if mask == (1 << n) - 1:
            return graph[u][0]
        if (mask, u) in memo:
            return memo[(mask, u)]

        ans = float('inf')
        for v in range(n):
            if not (mask & (1 << v)):
                ans = min(ans, graph[u][v] + tsp(mask | (1 << v), v))

        memo[(mask, u)] = ans
        return ans

    return tsp(1, 0)`,
      javascript: `function solveTSP(graph) {
  const n = graph.length;
  const memo = Array.from({ length: 1 << n }, () => new Array(n).fill(-1));

  function tsp(mask, u) {
    if (mask === (1 << n) - 1) return graph[u][0];
    if (memo[mask][u] !== -1) return memo[mask][u];

    let ans = Infinity;
    for (let v = 0; v < n; v++) {
      if (!(mask & (1 << v))) {
        ans = Math.min(ans, graph[u][v] + tsp(mask | (1 << v), v));
      }
    }
    return (memo[mask][u] = ans);
  }

  return tsp(1, 0);
}`
    },
    interviewNotes: {
      mistakes: ["Using Bitmask DP when N > 22 (2^22 = 4*10^6, 2^30 will cause Memory Limit Exceeded MLE / Time TLE)."],
      edgeCases: ["N = 1", "Complete graph vs Sparse graph"],
      tips: ["N <= 16 to 20 is the ultimate clue for Bitmask State Compression DP!"]
    },
    practiceProblems: [
      { title: "Shortest Path Visiting All Nodes", difficulty: "Hard", url: "https://leetcode.com/problems/shortest-path-visiting-all-nodes/" },
      { title: "Find the Shortest Superstring", difficulty: "Hard", url: "https://leetcode.com/problems/find-the-shortest-superstring/" }
    ],
    relatedTopics: [
      { title: "Bit Manipulation Patterns", id: "bit-manipulation-patterns" },
      { title: "Meet In The Middle Pattern", id: "meet-in-the-middle-pattern" }
    ]
  }
};
