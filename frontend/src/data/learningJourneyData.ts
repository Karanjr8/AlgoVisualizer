import {
  Layers, Database, ArrowRightLeft, AppWindow, Split,
  GitCommit, Network, FolderTree, Cpu, Sparkles, Binary,
  GitBranch, RefreshCw, Workflow, Route, Shuffle, KeyRound,
  Shield, Trophy, Flame, Target
} from 'lucide-react';

export interface JourneyTopic {
  id: string;
  name: string;
  count: number;
  tagline: string; // Motivational momentum tagline
  icon: React.ElementType;
  path: string;
  completed?: boolean;
}

export interface LearningStage {
  id: number;
  stageNumber: string;
  title: string;
  subtitle: string;
  colorGradient: string;
  badgeColor: string;
  topics: JourneyTopic[];
}

export const LEARNING_STAGES: LearningStage[] = [
  {
    id: 1,
    stageNumber: "Stage 1",
    title: "Foundations",
    subtitle: "Build the core instincts every problem solver relies on.",
    colorGradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    topics: [
      {
        id: "arrays",
        name: "Arrays",
        count: 5,
        tagline: "Unlocks Linear Memory Traversal & Indexing",
        icon: Database,
        path: "/explore/sorting-algorithms",
        completed: true,
      },
      {
        id: "hashing",
        name: "Hashing",
        count: 6,
        tagline: "Constant-Time Lookups & Frequency Analysis",
        icon: KeyRound,
        path: "/explore/searching-algorithms",
        completed: true,
      },
      {
        id: "two-pointers",
        name: "Two Pointers",
        count: 4,
        tagline: "Squeezes Search Space Efficiently",
        icon: ArrowRightLeft,
        path: "/explore/two-pointers",
        completed: false,
      },
      {
        id: "sliding-window",
        name: "Sliding Window",
        count: 5,
        tagline: "Subarray Optimization Strategy",
        icon: AppWindow,
        path: "/explore/sliding-window",
        completed: false,
      },
      {
        id: "stack",
        name: "Stack",
        count: 4,
        tagline: "LIFO State Traversal & Expression Parsing",
        icon: Layers,
        path: "/explore/linked-lists",
        completed: false,
      },
      {
        id: "queue",
        name: "Queue",
        count: 4,
        tagline: "FIFO Level-Order Flow Management",
        icon: Shuffle,
        path: "/explore/linked-lists",
        completed: false,
      },
    ]
  },
  {
    id: 2,
    stageNumber: "Stage 2",
    title: "Structured Thinking",
    subtitle: "Learn how data is organized, connected, and traversed.",
    colorGradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    topics: [
      {
        id: "linked-list",
        name: "Linked List",
        count: 6,
        tagline: "Dynamic Pointer Manipulations & Nodes",
        icon: GitCommit,
        path: "/explore/linked-lists",
        completed: false,
      },
      {
        id: "trees",
        name: "Trees",
        count: 8,
        tagline: "Hierarchical Branching & Node Traversals",
        icon: FolderTree,
        path: "/explore/trees",
        completed: false,
      },
      {
        id: "bst",
        name: "Binary Search Tree",
        count: 5,
        tagline: "Ordered Dynamic Collections & Search Trees",
        icon: GitBranch,
        path: "/explore/trees",
        completed: false,
      },
      {
        id: "heap",
        name: "Heap / Priority Queue",
        count: 6,
        tagline: "Instant Minimum/Maximum Extraction",
        icon: Cpu,
        path: "/explore/heap",
        completed: false,
      },
      {
        id: "trie",
        name: "Trie",
        count: 4,
        tagline: "Efficient Prefix & Word Search Tree",
        icon: Split,
        path: "/explore/trie",
        completed: false,
      },
    ]
  },
  {
    id: 3,
    stageNumber: "Stage 3",
    title: "Pattern Recognition",
    subtitle: "Start spotting reusable problem-solving strategies.",
    colorGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    topics: [
      {
        id: "binary-search",
        name: "Binary Search",
        count: 7,
        tagline: "Logarithmic Search Space Reduction",
        icon: Binary,
        path: "/explore/searching-algorithms",
        completed: false,
      },
      {
        id: "greedy",
        name: "Greedy Algorithms",
        count: 6,
        tagline: "Locally Optimal Decision Making",
        icon: Target,
        path: "/explore/greedy",
        completed: false,
      },
      {
        id: "backtracking",
        name: "Backtracking",
        count: 6,
        tagline: "Systematic State Space Exploration",
        icon: RefreshCw,
        path: "/explore/backtracking",
        completed: false,
      },
      {
        id: "recursion",
        name: "Recursion",
        count: 5,
        tagline: "Divide & Master Self-Similar Sub-problems",
        icon: Workflow,
        path: "/explore/recursion",
        completed: false,
      },
    ]
  },
  {
    id: 4,
    stageNumber: "Stage 4",
    title: "Network Intelligence",
    subtitle: "Understand relationships, paths, and connectivity.",
    colorGradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    topics: [
      {
        id: "graphs",
        name: "Graphs",
        count: 16,
        tagline: "Complex Entity Relationship Networks",
        icon: Network,
        path: "/explore/graph-algorithms",
        completed: false,
      },
      {
        id: "union-find",
        name: "Union Find",
        count: 4,
        tagline: "Dynamic Disjoint Set Connectivity",
        icon: Route,
        path: "/explore/graph-algorithms",
        completed: false,
      },
      {
        id: "topological-sort",
        name: "Topological Sort",
        count: 4,
        tagline: "Dependency Order Scheduling on DAGs",
        icon: Workflow,
        path: "/explore/graph-algorithms",
        completed: false,
      },
      {
        id: "shortest-paths",
        name: "Shortest Path Algorithms",
        count: 5,
        tagline: "Optimal Path Routing (Dijkstra, Bellman-Ford)",
        icon: Route,
        path: "/explore/graph-algorithms",
        completed: false,
      },
    ]
  },
  {
    id: 5,
    stageNumber: "Stage 5",
    title: "Optimization Mindset",
    subtitle: "Learn how efficient solutions are built.",
    colorGradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    topics: [
      {
        id: "dp",
        name: "Dynamic Programming",
        count: 12,
        tagline: "Unlocks Powerful Optimization Patterns",
        icon: Sparkles,
        path: "/explore/dp",
        completed: false,
      },
      {
        id: "segment-tree",
        name: "Segment Tree",
        count: 5,
        tagline: "Fast Range Query & Update Engine",
        icon: FolderTree,
        path: "/explore/segment-tree",
        completed: false,
      },
      {
        id: "fenwick-tree",
        name: "Binary Indexed Tree",
        count: 4,
        tagline: "High Impact Prefix Sum Engine",
        icon: Binary,
        path: "/explore/fenwick-tree",
        completed: false,
      },
      {
        id: "advanced-range-queries",
        name: "Advanced Range Queries",
        count: 5,
        tagline: "Complex Range Mutations & Range Aggregations",
        icon: Cpu,
        path: "/explore/advanced-patterns",
        completed: false,
      },
    ]
  },
  {
    id: 6,
    stageNumber: "Stage 6",
    title: "Interview Mastery",
    subtitle: "Combine everything into real-world problem solving.",
    colorGradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    topics: [
      {
        id: "advanced-patterns",
        name: "Advanced Patterns",
        count: 8,
        tagline: "Frequently Seen In Top Interview Problems",
        icon: Shield,
        path: "/explore/advanced-patterns",
        completed: false,
      },
      {
        id: "mixed-problems",
        name: "Mixed Interview Problems",
        count: 15,
        tagline: "Multi-Data Structure Synthesis under Constraints",
        icon: Trophy,
        path: "/interview/practice",
        completed: false,
      },
      {
        id: "systematic-solving",
        name: "Systematic Problem Solving",
        count: 10,
        tagline: "End-to-End Interview Strategy & Framing",
        icon: Target,
        path: "/interview/setup",
        completed: false,
      },
      {
        id: "contest-techniques",
        name: "Contest Techniques",
        count: 8,
        tagline: "Speed & Precision Under Time Pressure",
        icon: Flame,
        path: "/interview/timed",
        completed: false,
      },
    ]
  }
];

export function getRecommendedNextStep() {
  return {
    recentlyCompleted: ["Arrays", "Hashing"],
    recommendedTopic: {
      name: "Two Pointers",
      path: "/explore/two-pointers",
      tagline: "Squeezes Search Space Efficiently"
    },
    reason: "Most interview patterns build directly on array traversal concepts."
  };
}
