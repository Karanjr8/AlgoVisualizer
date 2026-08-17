import type { AlgorithmContent } from './algorithmContent';

export const heapAlgorithmContent: Record<string, AlgorithmContent> = {
  "heap-intro": {
    id: "heap-intro",
    introduction: "A Heap is a specialized complete binary tree that maintains the maximum or minimum element at the root node. It is backed by a contiguous array using zero memory pointers.",
    intuition: "Think of an Emergency Room Triage: Patients are not treated strictly in arrival order, but rather by medical urgency. The most critical patient is always at the top of the priority list.",
    walkthrough: [
      { phase: "Shape Property", description: "All levels of the tree are completely filled except possibly the last level, which is filled left-to-right." },
      { phase: "Heap Invariant", description: "In a Max-Heap, every parent node is ≥ its children. In a Min-Heap, every parent node is ≤ its children." },
      { phase: "Array Index Math", description: "For any 0-based index i: Parent = ⌊(i-1)/2⌋, Left Child = 2i+1, Right Child = 2i+2." },
      { phase: "O(1) Root Access", description: "The maximum or minimum element is always stored at array index 0 for instant O(1) peek access." }
    ],
    dryRun: {
      input: "Array: [50, 30, 40, 10, 20]",
      output: "Root Max = 50",
      steps: [
        "Inspect Root index 0 → Value 50",
        "Verify Left Child index 1 → Value 30 ≤ 50",
        "Verify Right Child index 2 → Value 40 ≤ 50",
        "Verify Left Subtree children index 3 (10) and 4 (20) ≤ 30"
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "Peek operation takes O(1) time. Insert (Bubble Up) and Extract (Shift Down) take O(log N) time bounded by tree height H = log₂ N."
    },
    code: {
      cpp: `// C++ Min/Max Priority Queue
#include <iostream>
#include <queue>
#include <vector>

int main() {
    // Default Max-Heap
    std::priority_queue<int> maxHeap;
    maxHeap.push(50);
    maxHeap.push(30);
    maxHeap.push(40);
    
    std::cout << "Max Root: " << maxHeap.top() << std::endl; // 50
    return 0;
}`,
      java: `// Java PriorityQueue
import java.util.PriorityQueue;

public class HeapIntro {
    public static void main(String[] args) {
        // Min-Heap by default
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.add(50);
        minHeap.add(30);
        minHeap.add(40);

        System.out.println("Min Root: " + minHeap.peek()); // 30
    }
}`,
      python: `# Python heapq
import heapq

heap = [50, 30, 40]
heapq.heapify(heap) # Transforms array into Min-Heap in O(N) time
print("Min Root:", heap[0]) # 30`,
      javascript: `// JS Heap Class Representation
class BinaryHeap {
  constructor() {
    this.heap = [];
  }
  peek() {
    return this.heap[0];
  }
}`
    },
    interviewNotes: {
      mistakes: [
        "Confusing Heap with Binary Search Tree (BST). Heaps do NOT maintain left < right ordering among sibling subtrees.",
        "Assuming Build Heap takes O(N log N) time instead of linear O(N) time."
      ],
      edgeCases: ["Empty heap extraction", "Heap with duplicate values", "Single element heap"],
      tips: [
        "Use Min-Heap for Top K Largest elements.",
        "Use Max-Heap for Top K Smallest elements."
      ]
    },
    practiceProblems: [
      { title: "Kth Largest Element in an Array", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      { title: "Top K Frequent Elements", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" }
    ],
    relatedTopics: [
      { title: "Min Heap vs Max Heap", id: "min-max-heap" },
      { title: "Heap Operations", id: "heap-operations" }
    ]
  },

  "min-max-heap": {
    id: "min-max-heap",
    introduction: "Min-Heap and Max-Heap are the two primary variants of a Binary Heap, differing strictly by their parent-child priority invariant.",
    intuition: "In a Max-Heap, think of a Leaderboard where the highest score sits at the top. In a Min-Heap, think of a Golf Scoreboard where the lowest score is at the top.",
    walkthrough: [
      { phase: "Max-Heap Invariant", description: "Parent(i) ≥ Node(i). Root always holds the global maximum." },
      { phase: "Min-Heap Invariant", description: "Parent(i) ≤ Node(i). Root always holds the global minimum." },
      { phase: "Sift Up Direction", description: "In Max-Heap, larger elements bubble up. In Min-Heap, smaller elements bubble up." },
      { phase: "Application Selection", description: "Choose Min-Heap when filtering for largest K items. Choose Max-Heap when filtering for smallest K items." }
    ],
    dryRun: {
      input: "Array: [10, 20, 15, 30, 40]",
      output: "Min Root = 10",
      steps: [
        "Check index 0 (10) ≤ left child index 1 (20)",
        "Check index 0 (10) ≤ right child index 2 (15)",
        "Min-Heap invariant satisfied!"
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "Both Min and Max heaps share identical O(1) peek time and O(log N) insertion/extraction complexities."
    },
    code: {
      cpp: `// Min-Heap vs Max-Heap in C++
#include <queue>
#include <vector>

// Max Heap (default)
std::priority_queue<int> maxH;

// Min Heap
std::priority_queue<int, std::vector<int>, std::greater<int>> minH;`,
      java: `// Min-Heap vs Max-Heap in Java
import java.util.Collections;
import java.util.PriorityQueue;

PriorityQueue<Integer> minH = new PriorityQueue<>();
PriorityQueue<Integer> maxH = new PriorityQueue<>(Collections.reverseOrder());`,
      python: `# Min-Heap vs Max-Heap in Python
import heapq

min_heap = []
# For max heap, push negative values
max_heap = []
heapq.heappush(max_heap, -val)`,
      javascript: `// Min-Heap vs Max-Heap Comparators
const minComparator = (a, b) => a - b;
const maxComparator = (a, b) => b - a;`
    },
    interviewNotes: {
      mistakes: ["Forgetting that Python's heapq library ONLY provides Min-Heap by default."],
      edgeCases: ["Inserting identical keys into min vs max heaps"],
      tips: ["Negate numbers when using Python's heapq to emulate a Max-Heap."]
    },
    practiceProblems: [
      { title: "Kth Smallest Element in a Sorted Matrix", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/" }
    ],
    relatedTopics: [
      { title: "Heap Operations", id: "heap-operations" }
    ]
  },

  "heap-operations": {
    id: "heap-operations",
    introduction: "The core operations of a binary heap are Insert (Bubble Up), Extract Root (Shift Down), and Bottom-Up Build Heap.",
    intuition: "Insert appends at the end and promotes upward. Extract removes the root, puts the last element at the root, and down-sifts it to the right level.",
    walkthrough: [
      { phase: "Insert (Bubble Up)", description: "Append new key at array index N. Compare with parent at ⌊(N-1)/2⌋. Swap upward while invariant is violated." },
      { phase: "Extract Root (Shift Down)", description: "Save root at index 0. Replace index 0 with last element at index N-1. Decrease size by 1 and Heapify Down from index 0." },
      { phase: "Build Heap (Bottom-Up)", description: "Call Heapify Down starting from last internal parent ⌊N/2⌋-1 down to 0 in O(N) linear time." }
    ],
    dryRun: {
      input: "Insert 95 into Max-Heap [90, 80, 70]",
      output: "Heap [95, 90, 70, 80]",
      steps: [
        "Append 95 at index 3",
        "Compare 95 with parent index 1 (80) → 95 > 80, Swap!",
        "Compare 95 with new parent index 0 (90) → 95 > 90, Swap!",
        "95 is now root at index 0."
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      space: "O(1) auxiliary",
      analysis: "Insert takes O(1) average / O(log N) worst case. Extract takes O(log N). Build Heap takes O(N) linear time."
    },
    code: {
      cpp: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}`,
      java: `void siftDown(int[] arr, int n, int i) {
    int largest = i;
    int l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        siftDown(arr, n, largest);
    }
}`,
      python: `def heapify(arr, n, i):
    largest = i
    l, r = 2 * i + 1, 2 * i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
      javascript: `function siftDown(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    siftDown(arr, n, largest);
  }
}`
    },
    interviewNotes: {
      mistakes: ["Trying to heapify from top to bottom when building a heap instead of bottom-up."],
      edgeCases: ["Extracting from single-element heap", "Heapifying leaf nodes (no-op)"],
      tips: ["Build Heap is O(N) because 50% of tree nodes are leaves requiring 0 swaps!"]
    },
    practiceProblems: [
      { title: "Design Heap", difficulty: "Medium", url: "https://leetcode.com/problems/design-a-food-rating-system/" }
    ],
    relatedTopics: [
      { title: "Priority Queue Design", id: "priority-queue-design" }
    ]
  },

  "priority-queue-design": {
    id: "priority-queue-design",
    introduction: "A Priority Queue is an Abstract Data Type (ADT) where elements are dequeued according to assigned priority values rather than FIFO arrival order.",
    intuition: "Airport Boarding: First Class and Gold members board ahead of Economy passengers regardless of when they arrived at the gate.",
    walkthrough: [
      { phase: "Enqueue(val, prio)", description: "Appends element to internal binary heap array and bubbles it up based on priority score in O(log N)." },
      { phase: "Dequeue()", description: "Extracts highest priority element at root, moves last item to root, and sifts down in O(log N)." },
      { phase: "Peek()", description: "Inspects root element priority in O(1) time without removing it." }
    ],
    dryRun: {
      input: "Enqueue('TaskA', prio:95), Enqueue('TaskB', prio:30)",
      output: "Dequeue yields 'TaskA'",
      steps: [
        "Push ('TaskA', 95) at index 0",
        "Push ('TaskB', 30) at index 1 → 30 < 95, stays at index 1",
        "Dequeue() returns root ('TaskA', 95)"
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N)",
      analysis: "Enqueue and Dequeue take O(log N) time. Peek takes O(1) time."
    },
    code: {
      cpp: `struct Task {
    std::string name;
    int priority;
    bool operator<(const Task& other) const {
        return priority < other.priority; // Max-Heap by priority
    }
};
std::priority_queue<Task> pq;`,
      java: `class Task implements Comparable<Task> {
    String name;
    int priority;
    public int compareTo(Task other) {
        return Integer.compare(other.priority, this.priority); // Max-Heap
    }
}
PriorityQueue<Task> pq = new PriorityQueue<>();`,
      python: `import heapq

class Task:
    def __init__(self, name, priority):
        self.name = name
        self.priority = priority
    def __lt__(self, other):
        return self.priority > other.priority # Max-Heap`,
      javascript: `class PriorityQueue {
  constructor(comparator = (a, b) => b.prio - a.prio) {
    this.heap = [];
    this.comparator = comparator;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Using standard FIFO Queue when elements have distinct urgency rankings."],
      edgeCases: ["Handling tie-breakers between elements with identical priority"],
      tips: ["Pass custom comparator object or lambda for custom struct priority queues."]
    },
    practiceProblems: [
      { title: "Design Twitter", difficulty: "Medium", url: "https://leetcode.com/problems/design-twitter/" }
    ],
    relatedTopics: [
      { title: "Heap Sort", id: "heap-sort" }
    ]
  },

  "heap-sort": {
    id: "heap-sort",
    introduction: "Heap Sort is an in-place comparison-based sorting algorithm that converts an array into a Max-Heap and repeatedly extracts the maximum element to the end of the array.",
    intuition: "Build a Max-Heap, then repeatedly move the largest item from root (index 0) to the unsorted array boundary at the end.",
    walkthrough: [
      { phase: "Phase 1: Build Max Heap", description: "Convert unsorted array into valid Max-Heap in O(N) time by running Heapify Down from ⌊N/2⌋-1 down to 0." },
      { phase: "Phase 2: Repeated Extraction", description: "For i = N-1 down to 1: Swap root arr[0] with arr[i], reduce active heap size to i, and Heapify Down arr[0]." },
      { phase: "Sorted Partition Growth", description: "The array is partitioned into [0 .. activeHeapSize-1] and sorted portion [activeHeapSize .. N-1]." }
    ],
    dryRun: {
      input: "Unsorted Array [4, 10, 3, 5, 1]",
      output: "Sorted Array [1, 3, 4, 5, 10]",
      steps: [
        "Build Max Heap → Array becomes [10, 5, 3, 4, 1]",
        "Swap 10 with 1 → Array [1, 5, 3, 4, 10], Heapify 1 → [5, 4, 3, 1, 10]",
        "Swap 5 with 1 → Array [1, 4, 3, 5, 10], Heapify 1 → [4, 1, 3, 5, 10]",
        "Repeat until active heap size is 1. Fully sorted!"
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1) in-place auxiliary",
      analysis: "Guarantees O(N log N) worst-case time without requiring extra memory space."
    },
    code: {
      cpp: `void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
      java: `public void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--)
        siftDown(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
        siftDown(arr, i, 0);
    }
}`,
      python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)`,
      javascript: `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    siftDown(arr, i, 0);
  }
}`
    },
    interviewNotes: {
      mistakes: ["Confusing Heap Sort with Selection Sort. Heap Sort uses heapify in O(log N) instead of linear scan in O(N)."],
      edgeCases: ["Array already sorted", "Array sorted in reverse", "Duplicate values"],
      tips: ["Heap Sort is NOT a stable sort because long-distance swaps alter relative duplicate order."]
    },
    practiceProblems: [
      { title: "Sort an Array", difficulty: "Medium", url: "https://leetcode.com/problems/sort-an-array/" }
    ],
    relatedTopics: [
      { title: "Kth Largest Element", id: "kth-largest" }
    ]
  },

  "kth-largest": {
    id: "kth-largest",
    introduction: "Find the Kth largest element in an unsorted array.",
    intuition: "Maintain a bouncer list of the top K largest elements seen so far using a Min-Heap. The smallest item in that bouncer list sits at the root—which is exactly the Kth largest element overall!",
    walkthrough: [
      { phase: "Initialize Min-Heap", description: "Create an empty Min-Heap to hold at most K items." },
      { phase: "Iterate & Push", description: "For each element num in array: Push num into Min-Heap." },
      { phase: "Maintain Size K", description: "If minHeap.size() > K: Evict smallest root element minHeap.pop()." },
      { phase: "Result", description: "After processing all N numbers, minHeap.peek() is the Kth largest element!" }
    ],
    dryRun: {
      input: "nums = [3, 2, 1, 5, 6, 4], K = 2",
      output: "5",
      steps: [
        "Push 3 → Heap [3]",
        "Push 2 → Heap [2, 3]",
        "Push 1 → Heap [1, 2, 3] → Size > 2, Pop 1 → Heap [2, 3]",
        "Push 5 → Heap [2, 3, 5] → Size > 2, Pop 2 → Heap [3, 5]",
        "Push 6 → Heap [3, 5, 6] → Size > 2, Pop 3 → Heap [5, 6]",
        "Push 4 → Heap [4, 5, 6] → Size > 2, Pop 4 → Heap [5, 6]",
        "Root is 5 → Result is 5!"
      ]
    },
    complexities: {
      time: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log K)" },
      space: "O(K) auxiliary space",
      analysis: "Inserting N items into a heap of fixed size K takes O(N log K) time."
    },
    code: {
      cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) minHeap.pop();
    }
    return minHeap.top();
}`,
      java: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.add(num);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.peek();
}`,
      python: `import heapq

def findKthLargest(nums, k):
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]`,
      javascript: `function findKthLargest(nums, k) {
  // Use Min-Heap of size K
  const minHeap = new MinPriorityQueue();
  for (let num of nums) {
    minHeap.enqueue(num);
    if (minHeap.size() > k) minHeap.dequeue();
  }
  return minHeap.front().element;
}`
    },
    interviewNotes: {
      mistakes: ["Using Max-Heap of size N (O(N log N)) instead of Min-Heap of size K (O(N log K))."],
      edgeCases: ["K = 1 (Find Max)", "K = N (Find Min)", "Array with all duplicate values"],
      tips: ["QuickSelect algorithm can also solve this in O(N) average time, but Heap approach is safer against worst-case O(N²)."]
    },
    practiceProblems: [
      { title: "Kth Largest Element in a Stream", difficulty: "Easy", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" }
    ],
    relatedTopics: [
      { title: "Kth Smallest Element", id: "kth-smallest" },
      { title: "Top K Frequent Elements", id: "top-k-frequent" }
    ]
  },

  "kth-smallest": {
    id: "kth-smallest",
    introduction: "Find the Kth smallest element in an unsorted array.",
    intuition: "Maintain a Max-Heap of size K. The root element holds the largest among the K smallest items seen so far—which is precisely the Kth smallest element overall!",
    walkthrough: [
      { phase: "Initialize Max-Heap", description: "Create an empty Max-Heap of capacity K." },
      { phase: "Iterate & Push", description: "For each element num in array: Push num into Max-Heap." },
      { phase: "Maintain Size K", description: "If maxHeap.size() > K: Evict the largest root element maxHeap.pop()." },
      { phase: "Result", description: "After processing all N elements, maxHeap.peek() holds the Kth smallest element!" }
    ],
    dryRun: {
      input: "nums = [7, 10, 4, 3, 20, 15], K = 3",
      output: "7",
      steps: [
        "Push 7 → Max-Heap [7]",
        "Push 10 → Max-Heap [10, 7]",
        "Push 4 → Max-Heap [10, 7, 4]",
        "Push 3 → Max-Heap [10, 7, 4, 3] → Size > 3, Pop 10 → Heap [7, 4, 3]",
        "Push 20 → Max-Heap [20, 7, 4, 3] → Size > 3, Pop 20 → Heap [7, 4, 3]",
        "Push 15 → Max-Heap [15, 7, 4, 3] → Size > 3, Pop 15 → Heap [7, 4, 3]",
        "Root is 7 → Result is 7!"
      ]
    },
    complexities: {
      time: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log K)" },
      space: "O(K) auxiliary space",
      analysis: "Maintains a Max-Heap of size K across N array elements."
    },
    code: {
      cpp: `int findKthSmallest(vector<int>& nums, int k) {
    priority_queue<int> maxHeap;
    for (int num : nums) {
        maxHeap.push(num);
        if (maxHeap.size() > k) maxHeap.pop();
    }
    return maxHeap.top();
}`,
      java: `public int findKthSmallest(int[] nums, int k) {
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int num : nums) {
        maxHeap.add(num);
        if (maxHeap.size() > k) maxHeap.poll();
    }
    return maxHeap.peek();
}`,
      python: `import heapq

def findKthSmallest(nums, k):
    max_heap = []
    for num in nums:
        heapq.heappush(max_heap, -num)
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    return -max_heap[0]`,
      javascript: `function findKthSmallest(nums, k) {
  const maxHeap = new MaxPriorityQueue();
  for (let num of nums) {
    maxHeap.enqueue(num);
    if (maxHeap.size() > k) maxHeap.dequeue();
  }
  return maxHeap.front().element;
}`
    },
    interviewNotes: {
      mistakes: ["Using Min-Heap of size K for Kth Smallest (wrong invariant)."],
      edgeCases: ["K = 1 (Find Min)", "K = N (Find Max)"],
      tips: ["Remember: Min-Heap for Kth Largest, Max-Heap for Kth Smallest!"]
    },
    practiceProblems: [
      { title: "Kth Smallest Element in a BST", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" }
    ],
    relatedTopics: [
      { title: "Kth Largest Element", id: "kth-largest" }
    ]
  },

  "top-k-frequent": {
    id: "top-k-frequent",
    introduction: "Given an integer array nums and an integer k, return the k most frequent elements.",
    intuition: "1. Count element frequencies using a Hash Map. 2. Filter top K frequent items using a Min-Heap keyed by frequency.",
    walkthrough: [
      { phase: "Stage 1: Frequency Map", description: "Iterate through nums to construct map: element → frequency." },
      { phase: "Stage 2: Min-Heap Filtering", description: "Push (element, frequency) pairs into a Min-Heap of capacity K." },
      { phase: "Stage 3: Evict Low Frequencies", description: "When minHeap.size() > K, pop root to discard lower frequency items." },
      { phase: "Stage 4: Extract Output", description: "Collect remaining K elements from heap into result array." }
    ],
    dryRun: {
      input: "nums = [1, 1, 1, 2, 2, 3], K = 2",
      output: "[1, 2]",
      steps: [
        "Map: {1:3, 2:2, 3:1}",
        "Push (1, freq:3) → Heap [(1,3)]",
        "Push (2, freq:2) → Heap [(2,2), (1,3)]",
        "Push (3, freq:1) → Heap [(3,1), (2,2), (1,3)] → Size > 2, Pop (3,1)",
        "Heap holds [(2,2), (1,3)] → Result [1, 2]"
      ]
    },
    complexities: {
      time: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log K)" },
      space: "O(N + K) space",
      analysis: "Hash Map takes O(N) time and space. Min-Heap of size K processes M unique elements in O(M log K) time."
    },
    code: {
      cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> counts;
    for (int n : nums) counts[n]++;
    
    using pii = pair<int, int>;
    priority_queue<pii, vector<pii>, greater<pii>> minHeap;
    
    for (auto& p : counts) {
        minHeap.push({p.second, p.first});
        if (minHeap.size() > k) minHeap.pop();
    }
    
    vector<int> res;
    while (!minHeap.empty()) {
        res.push_back(minHeap.top().second);
        minHeap.pop();
    }
    return res;
}`,
      java: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int n : nums) map.put(n, map.getOrDefault(n, 0) + 1);

    PriorityQueue<Integer> minHeap = new PriorityQueue<>(
        (a, b) -> map.get(a) - map.get(b)
    );

    for (int key : map.keySet()) {
        minHeap.add(key);
        if (minHeap.size() > k) minHeap.poll();
    }

    int[] res = new int[k];
    for (int i = 0; i < k; i++) res[i] = minHeap.poll();
    return res;
}`,
      python: `import collections, heapq

def topKFrequent(nums, k):
    count = collections.Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)`,
      javascript: `function topKFrequent(nums, k) {
  const map = new Map();
  for (let n of nums) map.set(n, (map.get(n) || 0) + 1);
  
  const minHeap = new MinPriorityQueue({ priority: x => map.get(x) });
  for (let key of map.keys()) {
    minHeap.enqueue(key);
    if (minHeap.size() > k) minHeap.dequeue();
  }
  return minHeap.toArray().map(x => x.element);
}`
    },
    interviewNotes: {
      mistakes: ["Sorting the entire frequency map in O(N log N) instead of using Heap O(N log K)."],
      edgeCases: ["All elements have frequency 1", "K equals total unique elements"],
      tips: ["Bucket Sort can further optimize this problem to O(N) linear time!"]
    },
    practiceProblems: [
      { title: "Sort Characters By Frequency", difficulty: "Medium", url: "https://leetcode.com/problems/sort-characters-by-frequency/" }
    ],
    relatedTopics: [
      { title: "K Closest Elements", id: "k-closest-elements" }
    ]
  },

  "k-closest-elements": {
    id: "k-closest-elements",
    introduction: "Given a sorted integer array arr, two integers k and x, return the k closest integers to x in the array.",
    intuition: "Distance is |num - x|. Maintain a Max-Heap of size K storing pairs (distance, num). If distance exceeds root, pop root!",
    walkthrough: [
      { phase: "Distance Calculation", description: "Compute distance d = |num - x| for each array element." },
      { phase: "Max-Heap Push", description: "Push (d, num) into Max-Heap of size K." },
      { phase: "Evict Furthest", description: "If heap size > K: Pop root containing element with largest distance." },
      { phase: "Sort Result", description: "Extract K elements and sort numerically for final output." }
    ],
    dryRun: {
      input: "arr = [1, 2, 3, 4, 5], k = 4, x = 3",
      output: "[1, 2, 3, 4]",
      steps: [
        "1: |1-3|=2 → Heap [(2,1)]",
        "2: |2-3|=1 → Heap [(2,1), (1,2)]",
        "3: |3-3|=0 → Heap [(2,1), (1,2), (0,3)]",
        "4: |4-3|=1 → Heap [(2,1), (1,2), (1,4), (0,3)]",
        "5: |5-3|=2 → Size > 4, Evict furthest element 5 → Heap holds 1, 2, 3, 4"
      ]
    },
    complexities: {
      time: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log K)" },
      space: "O(K) auxiliary",
      analysis: "Processes N items through Max-Heap of size K in O(N log K) time."
    },
    code: {
      cpp: `vector<int> findClosestElements(vector<int>& arr, int k, int x) {
    priority_queue<pair<int, int>> maxHeap; // {dist, num}
    for (int num : arr) {
        maxHeap.push({abs(num - x), num});
        if (maxHeap.size() > k) maxHeap.pop();
    }
    vector<int> res;
    while (!maxHeap.empty()) {
        res.push_back(maxHeap.top().second);
        maxHeap.pop();
    }
    sort(res.begin(), res.end());
    return res;
}`,
      java: `public List<Integer> findClosestElements(int[] arr, int k, int x) {
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(
        (a, b) -> Math.abs(b - x) == Math.abs(a - x) ? b - a : Math.abs(b - x) - Math.abs(a - x)
    );
    for (int num : arr) {
        maxHeap.add(num);
        if (maxHeap.size() > k) maxHeap.poll();
    }
    List<Integer> res = new ArrayList<>(maxHeap);
    Collections.sort(res);
    return res;
}`,
      python: `import heapq

def findClosestElements(arr, k, x):
    max_heap = []
    for num in arr:
        heapq.heappush(max_heap, (-abs(num - x), -num))
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    res = [-num for _, num in max_heap]
    return sorted(res)`,
      javascript: `function findClosestElements(arr, k, x) {
  const maxHeap = new MaxPriorityQueue({
    priority: num => Math.abs(num - x)
  });
  for (let num of arr) {
    maxHeap.enqueue(num);
    if (maxHeap.size() > k) maxHeap.dequeue();
  }
  return maxHeap.toArray().map(i => i.element).sort((a, b) => a - b);
}`
    },
    interviewNotes: {
      mistakes: ["Forgetting that array elements are sorted and distance ties should pick the smaller value."],
      edgeCases: ["x is smaller than all elements", "x is larger than all elements"],
      tips: ["Binary Search + Two Pointers can solve this in O(log N + K) time!"]
    },
    practiceProblems: [
      { title: "Find K Closest Elements", difficulty: "Medium", url: "https://leetcode.com/problems/find-k-closest-elements/" }
    ],
    relatedTopics: [
      { title: "K Closest Points to Origin", id: "k-closest-points" }
    ]
  },

  "k-closest-points": {
    id: "k-closest-points",
    introduction: "Given an array of 2D points, find the K closest points to the origin (0, 0).",
    intuition: "Euclidean distance squared is d² = x² + y². Maintain a Max-Heap of size K storing (d², point). Pop the root when size exceeds K!",
    walkthrough: [
      { phase: "Distance Squared", description: "Compute d² = x² + y² (avoiding floating point sqrt for accuracy)." },
      { phase: "Max-Heap Push", description: "Push (d², [x, y]) into Max-Heap of capacity K." },
      { phase: "Evict Furthest", description: "If maxHeap.size() > K: Evict root point with maximum distance." },
      { phase: "Extract Result", description: "Collect remaining K points into output matrix." }
    ],
    dryRun: {
      input: "points = [[1,3], [-2,2]], K = 1",
      output: "[[-2, 2]]",
      steps: [
        "[1,3]: d² = 1² + 3² = 10 → Heap [[10, (1,3)]]",
        "[-2,2]: d² = (-2)² + 2² = 8 → Heap [[10, (1,3)], [8, (-2,2)]]",
        "Heap size > 1 → Evict root [10, (1,3)]",
        "Heap holds [[-2, 2]] → Result is [[-2, 2]]!"
      ]
    },
    complexities: {
      time: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log K)" },
      space: "O(K) space",
      analysis: "Computes N distances and maintains Max-Heap of size K in O(N log K) time."
    },
    code: {
      cpp: `vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    auto comp = [](const vector<int>& a, const vector<int>& b) {
        return (a[0]*a[0] + a[1]*a[1]) < (b[0]*b[0] + b[1]*b[1]);
    };
    priority_queue<vector<int>, vector<vector<int>>, decltype(comp)> maxHeap(comp);
    
    for (auto& p : points) {
        maxHeap.push(p);
        if (maxHeap.size() > k) maxHeap.pop();
    }
    
    vector<vector<int>> res;
    while (!maxHeap.empty()) {
        res.push_back(maxHeap.top());
        maxHeap.pop();
    }
    return res;
}`,
      java: `public int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
        (a, b) -> Integer.compare(b[0]*b[0] + b[1]*b[1], a[0]*a[0] + a[1]*a[1])
    );
    for (int[] p : points) {
        maxHeap.add(p);
        if (maxHeap.size() > k) maxHeap.poll();
    }
    int[][] res = new int[k][2];
    for (int i = 0; i < k; i++) res[i] = maxHeap.poll();
    return res;
}`,
      python: `import heapq

def kClosest(points, k):
    max_heap = []
    for x, y in points:
        dist = -(x*x + y*y)
        heapq.heappush(max_heap, (dist, [x, y]))
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    return [p for _, p in max_heap]`,
      javascript: `function kClosest(points, k) {
  const maxHeap = new MaxPriorityQueue({
    priority: p => p[0]*p[0] + p[1]*p[1]
  });
  for (let p of points) {
    maxHeap.enqueue(p);
    if (maxHeap.size() > k) maxHeap.dequeue();
  }
  return maxHeap.toArray().map(i => i.element);
}`
    },
    interviewNotes: {
      mistakes: ["Using Math.sqrt() unnecessarily. Comparing squared distances x² + y² avoids floating point errors."],
      edgeCases: ["Points with identical distances to origin", "K equals total points"],
      tips: ["QuickSelect can also achieve O(N) average time for this problem."]
    },
    practiceProblems: [
      { title: "K Closest Points to Origin", difficulty: "Medium", url: "https://leetcode.com/problems/k-closest-points-to-origin/" }
    ],
    relatedTopics: [
      { title: "Merge K Sorted Lists", id: "merge-k-sorted" }
    ]
  },

  "merge-k-sorted": {
    id: "merge-k-sorted",
    introduction: "Merge K sorted linked lists into one consolidated sorted linked list.",
    intuition: "Compare the current heads of all K lists simultaneously in O(log K) time using a Min-Heap. Extract min, append to result, and push next node from that list into heap.",
    walkthrough: [
      { phase: "Initialize Min-Heap", description: "Insert head node of each of the K sorted lists into Min-Heap." },
      { phase: "Extract Min Node", description: "Extract smallest node from minHeap.top() and append to merged result list." },
      { phase: "Push Next Node", description: "If extracted node.next != null: Push node.next into Min-Heap." },
      { phase: "Repeat Until Empty", description: "Repeat extraction and pushing until Min-Heap is empty." }
    ],
    dryRun: {
      input: "L1: [1,4,5], L2: [1,3,4], L3: [2,6]",
      output: "1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6",
      steps: [
        "Init Heap with heads [1(L1), 1(L2), 2(L3)]",
        "Extract 1(L1) → Append 1. Push 4(L1) → Heap [1(L2), 2(L3), 4(L1)]",
        "Extract 1(L2) → Append 1. Push 3(L2) → Heap [2(L3), 3(L2), 4(L1)]",
        "Extract 2(L3) → Append 2. Push 6(L3) → Heap [3(L2), 4(L1), 6(L3)]",
        "Continue until all nodes are merged!"
      ]
    },
    complexities: {
      time: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log K)" },
      space: "O(K) auxiliary space",
      analysis: "N total nodes across K lists. Each of N nodes is pushed/popped from Min-Heap of size K in O(log K) time."
    },
    code: {
      cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto comp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(comp)> minHeap(comp);
    
    for (auto node : lists) {
        if (node) minHeap.push(node);
    }
    
    ListNode dummy(0);
    ListNode* tail = &dummy;
    
    while (!minHeap.empty()) {
        ListNode* curr = minHeap.top();
        minHeap.pop();
        tail->next = curr;
        tail = tail->next;
        if (curr->next) minHeap.push(curr->next);
    }
    return dummy.next;
}`,
      java: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> minHeap = new PriorityQueue<>(
        (a, b) -> Integer.compare(a.val, b.val)
    );
    for (ListNode node : lists) {
        if (node != null) minHeap.add(node);
    }
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (!minHeap.isEmpty()) {
        ListNode curr = minHeap.poll();
        tail.next = curr;
        tail = tail.next;
        if (curr.next != null) minHeap.add(curr.next);
    }
    return dummy.next;
}`,
      python: `import heapq

def mergeKLists(lists):
    min_heap = []
    for i, l in enumerate(lists):
        if l:
            heapq.heappush(min_heap, (l.val, i, l))
    dummy = tail = ListNode(0)
    while min_heap:
        val, i, node = heapq.heappop(min_heap)
        tail.next = node
        tail = tail.next
        if node.next:
            heapq.heappush(min_heap, (node.next.val, i, node.next))
    return dummy.next`,
      javascript: `function mergeKLists(lists) {
  const minHeap = new MinPriorityQueue({ priority: n => n.val });
  for (let node of lists) if (node) minHeap.enqueue(node);
  const dummy = new ListNode(0);
  let tail = dummy;
  while (!minHeap.isEmpty()) {
    let curr = minHeap.dequeue().element;
    tail.next = curr;
    tail = tail.next;
    if (curr.next) minHeap.enqueue(curr.next);
  }
  return dummy.next;
}`
    },
    interviewNotes: {
      mistakes: ["Pushing null list heads into heap.", "Forgetting tie-breaker in Python tuples to prevent ListNode comparison errors."],
      edgeCases: ["K = 0 (empty input)", "All lists are empty", "Lists with different lengths"],
      tips: ["Divide & Conquer (Merge Pairwise) also achieves O(N log K) time with O(1) space!"]
    },
    practiceProblems: [
      { title: "Merge K Sorted Lists", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" }
    ],
    relatedTopics: [
      { title: "Sliding Window Maximum", id: "sliding-window-maximum" }
    ]
  },

  "sliding-window-maximum": {
    id: "sliding-window-maximum",
    introduction: "Given an array nums and a sliding window of size k, return the maximum element in each sliding window position.",
    intuition: "Use a Max-Heap storing (val, index). As the window slides, lazily pop elements from root if their index is out of the active window boundary!",
    walkthrough: [
      { phase: "Heap Insertion", description: "For index i from 0 to N-1: Push (nums[i], i) into Max-Heap." },
      { phase: "Lazy Stale Eviction", description: "While maxHeap.top().index < i - k + 1: Pop root element (it has fallen outside active window)." },
      { phase: "Extract Window Max", description: "When i ≥ k - 1: Append maxHeap.top().val to result array." }
    ],
    dryRun: {
      input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
      output: "[3, 3, 5, 5, 6, 7]",
      steps: [
        "i=0(1), i=1(3), i=2(-1) → Heap [(3,idx1), (1,idx0), (-1,idx2)] → Window 1 Max = 3",
        "i=3(-3) → Heap [(3,idx1), ...] → Window 2 Max = 3",
        "i=4(5) → Heap [(5,idx4), (3,idx1), ...] → Window 3 Max = 5",
        "i=5(3) → Heap [(5,idx4), ...] → Window 4 Max = 5",
        "i=6(6) → Stale 5 evicted → Window 5 Max = 6",
        "i=7(7) → Window 6 Max = 7"
      ]
    },
    complexities: {
      time: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log N)" },
      space: "O(N) space",
      analysis: "Each element is pushed into heap once. Stale elements are lazily evicted in O(log N) time."
    },
    code: {
      cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    priority_queue<pair<int, int>> maxHeap; // {val, index}
    vector<int> res;
    for (int i = 0; i < nums.size(); i++) {
        maxHeap.push({nums[i], i});
        if (i >= k - 1) {
            while (maxHeap.top().second <= i - k) maxHeap.pop(); // Evict stale
            res.push_back(maxHeap.top().first);
        }
    }
    return res;
}`,
      java: `public int[] maxSlidingWindow(int[] nums, int k) {
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
    int n = nums.length;
    int[] res = new int[n - k + 1];
    for (int i = 0; i < n; i++) {
        maxHeap.add(new int[]{nums[i], i});
        if (i >= k - 1) {
            while (maxHeap.peek()[1] <= i - k) maxHeap.poll();
            res[i - k + 1] = maxHeap.peek()[0];
        }
    }
    return res;
}`,
      python: `import heapq

def maxSlidingWindow(nums, k):
    max_heap = []
    res = []
    for i, num in enumerate(nums):
        heapq.heappush(max_heap, (-num, i))
        if i >= k - 1:
            while max_heap[0][1] <= i - k:
                heapq.heappop(max_heap)
            res.append(-max_heap[0][0])
    return res`,
      javascript: `function maxSlidingWindow(nums, k) {
  const maxHeap = new MaxPriorityQueue({ priority: x => x.val });
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    maxHeap.enqueue({ val: nums[i], idx: i });
    if (i >= k - 1) {
      while (maxHeap.front().element.idx <= i - k) maxHeap.dequeue();
      res.push(maxHeap.front().element.val);
    }
  }
  return res;
}`
    },
    interviewNotes: {
      mistakes: ["Trying to eagerly delete non-root elements from heap when window shifts."],
      edgeCases: ["k = 1", "k = nums.length"],
      tips: ["Monotonic Deque optimizes this problem to strict O(N) linear time!"]
    },
    practiceProblems: [
      { title: "Sliding Window Maximum", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/" }
    ],
    relatedTopics: [
      { title: "Task Scheduler", id: "task-scheduler" }
    ]
  },

  "task-scheduler": {
    id: "task-scheduler",
    introduction: "Given CPU tasks array and a cooldown interval n, return the minimum CPU time units required to execute all tasks.",
    intuition: "Greedy choice: Always pick the task with the highest remaining frequency using a Max-Heap. Put executed tasks into a Cooldown Queue until time T + n + 1.",
    walkthrough: [
      { phase: "Frequency Map", description: "Count frequencies of each task character." },
      { phase: "Max-Heap Initialization", description: "Push frequencies into Max-Heap." },
      { phase: "Cooldown Queue", description: "Maintain queue of (remaining_count, available_time)." },
      { phase: "CPU Tick Loop", description: "For each time unit: Check if any task exited cooldown; execute highest frequency task from heap or insert IDLE." }
    ],
    dryRun: {
      input: "tasks = ['A','A','A','B','B','B'], n = 2",
      output: "8 CPU Units",
      steps: [
        "Heap: [A:3, B:3]",
        "T=1: Exec A → Heap [B:3], Cooldown [(A,2,avail:4)]",
        "T=2: Exec B → Heap [], Cooldown [(A,2,avail:4), (B,2,avail:5)]",
        "T=3: Heap empty → Exec IDLE",
        "T=4: A exits cooldown → Exec A → Cooldown [(B,2,avail:5), (A,1,avail:7)]",
        "T=5: B exits cooldown → Exec B → Cooldown [(A,1,avail:7), (B,1,avail:8)]",
        "T=6: Exec IDLE, T=7: Exec A, T=8: Exec B → Total 8 Units!"
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(1) space (26 max uppercase task letters)",
      analysis: "Frequency counting takes O(N) time. Heap operations run on at most 26 letter keys in O(1) space."
    },
    code: {
      cpp: `int leastInterval(vector<char>& tasks, int n) {
    unordered_map<char, int> counts;
    for (char c : tasks) counts[c]++;
    
    priority_queue<int> maxHeap;
    for (auto& p : counts) maxHeap.push(p.second);
    
    queue<pair<int, int>> cool; // {count, availTime}
    int time = 0;
    
    while (!maxHeap.empty() || !cool.empty()) {
        time++;
        if (!cool.empty() && cool.front().second <= time) {
            maxHeap.push(cool.front().first);
            cool.pop();
        }
        if (!maxHeap.empty()) {
            int cnt = maxHeap.top() - 1;
            maxHeap.pop();
            if (cnt > 0) cool.push({cnt, time + n + 1});
        }
    }
    return time;
}`,
      java: `public int leastInterval(char[] tasks, int n) {
    int[] counts = new int[26];
    for (char c : tasks) counts[c - 'A']++;
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int c : counts) if (c > 0) maxHeap.add(c);
    
    Queue<int[]> cool = new LinkedList<>(); // {count, availTime}
    int time = 0;
    
    while (!maxHeap.isEmpty() || !cool.isEmpty()) {
        time++;
        if (!cool.isEmpty() && cool.peek()[1] <= time) {
            maxHeap.add(cool.poll()[0]);
        }
        if (!maxHeap.isEmpty()) {
            int cnt = maxHeap.poll() - 1;
            if (cnt > 0) cool.add(new int[]{cnt, time + n + 1});
        }
    }
    return time;
}`,
      python: `import collections, heapq

def leastInterval(tasks, n):
    counts = collections.Counter(tasks)
    max_heap = [-cnt for cnt in counts.values()]
    heapq.heapify(max_heap)
    
    cool = collections.deque() # (cnt, availTime)
    time = 0
    
    while max_heap or cool:
        time += 1
        if cool and cool[0][1] <= time:
            heapq.heappush(max_heap, cool.popleft()[0])
        if max_heap:
            cnt = heapq.heappop(max_heap) + 1
            if cnt < 0:
                cool.append((cnt, time + n + 1))
    return time`,
      javascript: `function leastInterval(tasks, n) {
  const map = {};
  for (let t of tasks) map[t] = (map[t] || 0) + 1;
  const maxHeap = new MaxPriorityQueue();
  for (let t in map) maxHeap.enqueue(map[t]);
  
  const cool = [];
  let time = 0;
  while (!maxHeap.isEmpty() || cool.length > 0) {
    time++;
    if (cool.length > 0 && cool[0].availTime <= time) {
      maxHeap.enqueue(cool.shift().cnt);
    }
    if (!maxHeap.isEmpty()) {
      let cnt = maxHeap.dequeue().element - 1;
      if (cnt > 0) cool.push({ cnt, availTime: time + n + 1 });
    }
  }
  return time;
}`
    },
    interviewNotes: {
      mistakes: ["Using simple round-robin scheduling without prioritizing high-frequency tasks."],
      edgeCases: ["n = 0 (no cooldown)", "All tasks have frequency 1"],
      tips: ["Math formula: (max_freq - 1) * (n + 1) + max_freq_count can compute this in O(N) time without simulation!"]
    },
    practiceProblems: [
      { title: "Task Scheduler", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/" }
    ],
    relatedTopics: [
      { title: "Find Median from Data Stream", id: "median-data-stream" }
    ]
  },

  "median-data-stream": {
    id: "median-data-stream",
    introduction: "Design a data structure that supports adding numbers from a continuous data stream and finding the running median in O(1) time.",
    intuition: "Split stream numbers into two halves: Lower Half stored in a Max-Heap and Upper Half stored in a Min-Heap. Keep size difference ≤ 1!",
    walkthrough: [
      { phase: "Two Heaps Partition", description: "Lower Half (Max-Heap) stores numbers ≤ median. Upper Half (Min-Heap) stores numbers ≥ median." },
      { phase: "Add Number", description: "Add num to maxHeap. If maxHeap.top() > minHeap.top(), balance by popping from maxHeap to minHeap." },
      { phase: "Size Rebalancing", description: "If maxHeap.size() > minHeap.size() + 1: Move top to minHeap. If minHeap.size() > maxHeap.size(): Move top to maxHeap." },
      { phase: "Find Median O(1)", description: "If odd size: maxHeap.top(). If even size: (maxHeap.top() + minHeap.top()) / 2.0." }
    ],
    dryRun: {
      input: "Stream: [5, 15, 1, 3]",
      output: "Medians: 5 -> 10 -> 5 -> 4",
      steps: [
        "Add 5 → Max-Heap [5], Min-Heap [] → Median = 5",
        "Add 15 → Max-Heap [5], Min-Heap [15] → Median = (5+15)/2 = 10",
        "Add 1 → Max-Heap [5,1], Min-Heap [15] → Median = 5",
        "Add 3 → Max-Heap [3,1], Min-Heap [5,15] → Median = (3+5)/2 = 4"
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      space: "O(N) space",
      analysis: "addNum takes O(log N) heap insertion time. findMedian takes O(1) constant time."
    },
    code: {
      cpp: `class MedianFinder {
    priority_queue<int> maxHeap; // Lower half
    priority_queue<int, vector<int>, greater<int>> minHeap; // Upper half
public:
    void addNum(int num) {
        maxHeap.push(num);
        minHeap.push(maxHeap.top());
        maxHeap.pop();
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }
    double findMedian() {
        if (maxHeap.size() > minHeap.size()) return maxHeap.top();
        return (maxHeap.top() + minHeap.top()) / 2.0;
    }
};`,
      java: `class MedianFinder {
    private PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    private PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    public void addNum(int num) {
        maxHeap.add(num);
        minHeap.add(maxHeap.poll());
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.add(minHeap.poll());
        }
    }

    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) return maxHeap.peek();
        return (maxHeap.peek() + minHeap.peek()) / 2.0;
    }
}`,
      python: `import heapq

class MedianFinder:
    def __init__(self):
        self.small = [] # Max-Heap (stores negative values)
        self.large = [] # Min-Heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2.0`,
      javascript: `class MedianFinder {
  constructor() {
    this.small = new MaxPriorityQueue();
    this.large = new MinPriorityQueue();
  }
  addNum(num) {
    this.small.enqueue(num);
    this.large.enqueue(this.small.dequeue().element);
    if (this.large.size() > this.small.size()) {
      this.small.enqueue(this.large.dequeue().element);
    }
  }
  findMedian() {
    if (this.small.size() > this.large.size()) return this.small.front().element;
    return (this.small.front().element + this.large.front().element) / 2.0;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Using single sorted array with O(N) insertion time instead of Two Heaps O(log N)."],
      edgeCases: ["Data stream with odd total elements vs even total elements"],
      tips: ["What if 99% of values are between 0 and 100? Use bucket counting array for O(1) addNum!"]
    },
    practiceProblems: [
      { title: "Find Median from Data Stream", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
      { title: "Sliding Window Median", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-median/" }
    ],
    relatedTopics: [
      { title: "Introduction to Heaps", id: "heap-intro" }
    ]
  }
};
