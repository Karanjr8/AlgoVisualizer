import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Layers, Zap, Clock, 
  BookOpen, Sparkles, ListTree, Activity
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { HeapVisualizer } from '../components/visualizer/HeapVisualizer';

interface TopicDetail {
  id: string;
  title: string;
  badge: string;
  overview: string;
  intuition: string;
  whyHeap: string;
  visualSnippet: string;
  complexity: string;
  interviewInsight: string;
  isProblem?: boolean;
}

const TOPICS_DATA: TopicDetail[] = [
  {
    id: 'heap-fundamentals',
    title: '1. Heap Fundamentals',
    badge: 'Basics',
    overview: 'A Heap is a complete binary tree that maintains the maximum or minimum element at the root.',
    intuition: 'Hospital ER Triage: The most urgent patient is always treated first, regardless of arrival order.',
    whyHeap: 'Provides instant O(1) access to min/max without spending O(N log N) to sort the entire list.',
    visualSnippet: 'Root [100] -> Children [90, 80]',
    complexity: 'Peek O(1) | Insert/Extract O(log N) | Space O(N)',
    interviewInsight: 'Default choice whenever you need constant-time access to the largest or smallest element.'
  },
  {
    id: 'binary-heap',
    title: '2. Binary Heap & Array Representation',
    badge: 'Structure',
    overview: 'A complete binary tree stored in a flat contiguous array using zero pointer overhead.',
    intuition: 'Tree levels map directly to array indices. Math replaces memory pointers.',
    whyHeap: 'High CPU cache locality and zero memory overhead for left/right pointers.',
    visualSnippet: 'Array [100, 90, 80, 70, 60] -> Parent ⌊(i-1)/2⌋ | Left 2i+1 | Right 2i+2',
    complexity: 'Index Lookup O(1) | Space O(N) Contiguous',
    interviewInsight: 'Array indexing makes Binary Heaps significantly faster in practice than BSTs.'
  },
  {
    id: 'min-heap',
    title: '3. Min Heap',
    badge: 'Variant',
    overview: 'Every parent node is ≤ its children. Root always contains the global minimum.',
    intuition: 'Smallest element bubbles up to rank #1 at the top.',
    whyHeap: 'Instantly answers "What is the current smallest value?" in O(1) time.',
    visualSnippet: 'Root = 10 -> Left = 20, Right = 15',
    complexity: 'Find Min O(1) | Insert/Extract O(log N)',
    interviewInsight: 'Standard structure for Dijkstra Shortest Path, Prim MST, and Kth Largest problems.'
  },
  {
    id: 'max-heap',
    title: '4. Max Heap',
    badge: 'Variant',
    overview: 'Every parent node is ≥ its children. Root always contains the global maximum.',
    intuition: 'Video Game Leaderboard: Highest score sits at position #1.',
    whyHeap: 'Instantly answers "What is the current largest value?" in O(1) time.',
    visualSnippet: 'Root = 95 -> Left = 80, Right = 75',
    complexity: 'Find Max O(1) | Insert/Extract O(log N)',
    interviewInsight: 'Used in Heap Sort and OS CPU Priority Schedulers.'
  },
  {
    id: 'heapify-operation',
    title: '5. Heapify Operation (Shift Down)',
    badge: 'Core Op',
    overview: 'Fixes heap invariant at node i by comparing with children and swapping downward.',
    intuition: 'Down-sifting a rule-violating element down the tree until order is restored.',
    whyHeap: 'Restores valid heap property in O(log N) steps bounded by tree height H.',
    visualSnippet: 'Node 20 at root -> Swaps 20 ↔ 50 down to restore Max-Heap',
    complexity: 'Time O(log N) | Space O(1)',
    interviewInsight: 'Essential building block of Extract Root and linear O(N) Build Heap.'
  },
  {
    id: 'insert-into-heap',
    title: '6. Insert into Heap (Bubble Up)',
    badge: 'Core Op',
    overview: 'Appends new element at array end, then bubbles up past smaller/larger parents.',
    intuition: 'New hire enters at bottom, gets promoted upward if performance exceeds manager.',
    whyHeap: 'Maintains complete binary tree shape while preserving heap invariant.',
    visualSnippet: 'Insert 95 at end -> Swaps 95 ↔ 60 -> 95 ↔ 90 to root',
    complexity: 'Time O(log N) worst case, O(1) average | Space O(1)',
    interviewInsight: 'O(1) average insertion because most nodes stay near bottom levels.'
  },
  {
    id: 'extract-min-max',
    title: '7. Extract Root (Shift Down)',
    badge: 'Core Op',
    overview: 'Removes root element, replaces root with last element, and runs Heapify Down.',
    intuition: 'CEO leaves, newest hire steps in temporarily, then down-sifts to right rank.',
    whyHeap: 'Removes extremum and restores valid heap structure in O(log N) time.',
    visualSnippet: 'Pop root 100 -> Move last element 40 to root -> Heapify 40 down',
    complexity: 'Time O(log N) | Space O(1)',
    interviewInsight: 'Replaces O(N) array element deletion with fast O(log N) heap removal.'
  },
  {
    id: 'build-heap',
    title: '8. Build Heap (Bottom-Up O(N))',
    badge: 'Algorithm',
    overview: 'Converts an unsorted array into a valid heap in linear O(N) time.',
    intuition: 'Start heapifying bottom-up from deepest internal nodes. Leaves require 0 work.',
    whyHeap: 'Sum of heights series ∑ (h / 2^h) converges to O(1) work per node.',
    visualSnippet: 'Iterate i = ⌊N/2⌋ - 1 down to 0 -> Run Heapify(i)',
    complexity: 'Time O(N) linear | Space O(1) in-place',
    interviewInsight: 'FAANG Classic: Why is Build Heap O(N) and not O(N log N)? Because 50% of nodes are leaves!'
  },
  {
    id: 'priority-queue',
    title: '9. Priority Queue ADT',
    badge: 'ADT',
    overview: 'Abstract Queue where elements are dequeued by priority rather than arrival time.',
    intuition: 'Airport Boarding: First Class boards before Economy regardless of arrival time.',
    whyHeap: 'Binary Heap provides O(log N) enqueue/dequeue and O(1) peek for Priority Queue.',
    visualSnippet: 'PriorityQueue[ (Surgery, 95), (ICU, 85), (Fever, 30) ]',
    complexity: 'Enqueue O(log N) | Dequeue O(log N) | Peek O(1)',
    interviewInsight: 'Implemented via PriorityQueue (Java/C++) or heapq (Python).'
  },
  {
    id: 'heap-sort',
    title: '10. Heap Sort',
    badge: 'Algorithm',
    overview: 'In-place comparison sort algorithm using a Max-Heap.',
    intuition: 'Build Max-Heap, repeatedly swap root (max) to end, and heapify reduced heap.',
    whyHeap: 'Guarantees O(N log N) worst-case time with O(1) auxiliary space.',
    visualSnippet: 'Build Max Heap -> Swap root ↔ end -> Heapify reduced size',
    complexity: 'Time O(N log N) all cases | Space O(1) in-place',
    interviewInsight: 'The only comparison sort achieving O(N log N) worst-case time with O(1) extra memory.'
  },
  {
    id: 'kth-largest-element',
    title: '11. Kth Largest Element in an Array',
    badge: 'Problem',
    isProblem: true,
    overview: 'Find the K-th largest element in an unsorted array.',
    intuition: 'Maintain a bouncer list of the top K elements seen so far.',
    whyHeap: 'Min-Heap of size K keeps smallest candidate at root. Ejects smaller items.',
    visualSnippet: 'Array [3,2,1,5,6,4], K=2 -> Min-Heap size 2 holds [5,6] -> Root = 5',
    complexity: 'Time O(N log K) | Space O(K)',
    interviewInsight: 'Why Min-Heap for Kth largest? Because root ejects elements smaller than top K!'
  },
  {
    id: 'top-k-frequent-elements',
    title: '12. Top K Frequent Elements',
    badge: 'Problem',
    isProblem: true,
    overview: 'Return the K most frequent elements in an array.',
    intuition: 'Count frequencies with a Hash Map, then filter top K using a Min-Heap.',
    whyHeap: 'Min-Heap of size K keyed by frequency keeps only highest frequency items.',
    visualSnippet: 'Frequencies {1:3, 2:2, 3:1}, K=2 -> Min-Heap size 2 holds [1, 2]',
    complexity: 'Time O(N log K) | Space O(N + K)',
    interviewInsight: 'Can be further optimized to O(N) using Bucket Sort by frequency.'
  },
  {
    id: 'merge-k-sorted-lists',
    title: '13. Merge K Sorted Lists',
    badge: 'Problem',
    isProblem: true,
    overview: 'Merge K sorted linked lists into one consolidated sorted list.',
    intuition: 'Compare the heads of all K lists simultaneously in O(log K) time.',
    whyHeap: 'Min-Heap stores active head pointer of each list. Extract min and push next.',
    visualSnippet: 'Min-Heap size K holds head pointer of each sorted list',
    complexity: 'Time O(N log K) | Space O(K)',
    interviewInsight: 'Essential algorithm for external multi-way merge sort on disk databases.'
  },
  {
    id: 'median-in-data-stream',
    title: '14. Find Median from Data Stream',
    badge: 'Problem',
    isProblem: true,
    overview: 'Find the running median of a continuous stream of numbers.',
    intuition: 'Divide numbers into Lower Half (Max-Heap) and Upper Half (Min-Heap).',
    whyHeap: 'Max-Heap root gives max of lower half; Min-Heap root gives min of upper half.',
    visualSnippet: 'Lower Max-Heap [2, 3] | Upper Min-Heap [4] -> Median = 3',
    complexity: 'Add Num O(log N) | Find Median O(1) | Space O(N)',
    interviewInsight: 'Classic Two Heaps pattern. Balance sizes so maxHeap has at most 1 extra element.'
  },
  {
    id: 'priority-queue-patterns',
    title: '15. Priority Queue Interview Patterns Summary',
    badge: 'Interview Strategy',
    overview: 'Summary of 5 core FAANG Priority Queue interview patterns.',
    intuition: 'Match problem requirements directly to Heap structures.',
    whyHeap: 'Optimal for Top K, K-Way Merge, Two Heaps, and Scheduling/Intervals.',
    visualSnippet: 'Top K → Min-Heap size K | Running Median → Two Heaps',
    complexity: 'Pattern average: O(N log K) time, O(K) space',
    interviewInsight: 'If prompt asks for "Top K", "Kth Smallest", or "Running Median", choose Heap immediately!'
  }
];

export const HeapIntro: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>('heap-fundamentals');
  const activeTopic = TOPICS_DATA.find(t => t.id === activeTopicId) || TOPICS_DATA[0];

  const navLinks = [
    { id: 'quick-start', label: '1. Quick Summary', icon: <Zap className="w-4 h-4" /> },
    { id: 'core-intuition', label: '2. Core Intuition & Comparison', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'array-math', label: '3. Array Index Math', icon: <Layers className="w-4 h-4" /> },
    { id: 'visualization', label: '4. Interactive Heap Engine', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'subtopics', label: '5. 15 Subtopics & Problems', icon: <ListTree className="w-4 h-4" /> },
    { id: 'complexity', label: '6. Complexity Quick Card', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-12 sm:space-y-16 text-left">
        
        {/* HERO BANNER SECTION (PUNCHY & VISUAL) */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-amber-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Fast 3-Minute Guide
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Heap & Priority Queue
              </h1>
              
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                A <strong>Heap</strong> gives you instant <code className="text-emerald-400 font-mono font-bold">O(1)</code> access to the minimum or maximum element without sorting the entire array.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('quick-start');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('subtopics');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-amber-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            {/* Quick Stat Summary Cards */}
            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-4 shadow-sm space-y-2 font-mono text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Topic Summary
              </span>
              <div className="p-2 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground font-sans">Peek Min/Max</span>
                <span className="font-bold text-emerald-400">O(1)</span>
              </div>
              <div className="p-2 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground font-sans">Insert / Extract</span>
                <span className="font-bold text-amber-500">O(log N)</span>
              </div>
              <div className="p-2 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground font-sans">Build Heap</span>
                <span className="font-bold text-blue-400">O(N)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: QUICK START SUMMARY */}
        <section id="quick-start" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">1. What is a Heap?</h2>
              <p className="text-xs text-muted-foreground">The 4 core questions answered in 30 seconds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">What is it?</span>
              <h4 className="font-bold text-sm text-foreground">Complete Binary Tree</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A binary tree filled left-to-right that keeps the extremum (max or min) at the root node.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Why do we need it?</span>
              <h4 className="font-bold text-sm text-foreground">O(1) Peek Access</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Finding min/max in unsorted array takes O(N). Sorting takes O(N log N). Heap gives O(1) peek!
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">When to use it?</span>
              <h4 className="font-bold text-sm text-foreground">Top K & Priority</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Whenever you need Top K elements, K-way merges, or running medians from dynamic data streams.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">vs Normal Binary Tree?</span>
              <h4 className="font-bold text-sm text-foreground">Array-Backed No Pointers</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No left/right node pointers needed! Stored as a flat contiguous array using fast index math.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: CORE INTUITION & COMPARISON */}
        <section id="core-intuition" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">2. Mental Model: Hospital ER Triage</h2>
              <p className="text-xs text-muted-foreground">Why heaps process priority without sorting everything</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-card/70 border border-border/80 rounded-3xl p-6 space-y-3 shadow-sm">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" /> Hospital ER Triage Mental Model
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                In a hospital ER, patients arrive in random order. The doctor doesn't sort all 1,000 waiting patients. They only need to instantly identify the <strong>most critical patient (priority 95)</strong>. A Heap keeps the top patient at index 0 without sorting the remaining queue!
              </p>
            </div>

            <div className="lg:col-span-5 bg-background/90 border border-border/80 rounded-3xl p-5 shadow-sm space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">Max-Heap vs Min-Heap Invariants</span>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center text-amber-400 font-bold">
                  <span>Max-Heap</span>
                  <span>Parent ≥ Children (Root = Max)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex justify-between items-center text-blue-400 font-bold">
                  <span>Min-Heap</span>
                  <span>Parent ≤ Children (Root = Min)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: ARRAY INDEX MATH */}
        <section id="array-math" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">3. How Heaps Map to Arrays</h2>
              <p className="text-xs text-muted-foreground">3 simple 0-based array index formulas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 text-center space-y-1 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Parent Index</span>
              <div className="text-xl font-mono font-bold text-amber-500">⌊(i - 1) / 2⌋</div>
              <p className="text-[11px] text-muted-foreground">Jump from child i to parent</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 text-center space-y-1 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Left Child</span>
              <div className="text-xl font-mono font-bold text-blue-500">2i + 1</div>
              <p className="text-[11px] text-muted-foreground">Jump from parent i to left child</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 text-center space-y-1 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Right Child</span>
              <div className="text-xl font-mono font-bold text-emerald-500">2i + 2</div>
              <p className="text-[11px] text-muted-foreground">Jump from parent i to right child</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE HEAP ENGINE */}
        <section id="visualization" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">4. Interactive Heap Engine</h2>
              <p className="text-xs text-muted-foreground">Learn primarily through visual tree + array step animations</p>
            </div>
          </div>

          <HeapVisualizer />
        </section>

        {/* SECTION 5: 15 SUBTOPICS & PROBLEM CARDS */}
        <section id="subtopics" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
              <ListTree className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">5. Concise Subtopic & Problem Guide</h2>
              <p className="text-xs text-muted-foreground">Click any topic for clean intuition, complexity, and interview insights</p>
            </div>
          </div>

          {/* Topic Selector Pills */}
          <div className="flex flex-wrap gap-2 p-3 bg-card/60 border border-border/80 rounded-2xl">
            {TOPICS_DATA.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTopicId(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTopicId === t.id
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>

          {/* Clean 6-Part Topic Explorer Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopic.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-card/80 border border-border/90 rounded-3xl p-6 shadow-xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    {activeTopic.badge}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-1.5">{activeTopic.title}</h3>
                </div>
                <div className="font-mono text-xs text-primary font-bold bg-background px-3 py-1.5 rounded-xl border border-border">
                  {activeTopic.complexity}
                </div>
              </div>

              {/* Structured 6-Part Clean Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">1. {activeTopic.isProblem ? 'Problem Statement' : 'Overview'}</span>
                  <p className="text-muted-foreground text-xs leading-relaxed">{activeTopic.overview}</p>
                </div>

                <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">2. {activeTopic.isProblem ? 'Key Observation' : 'Core Intuition'}</span>
                  <p className="text-muted-foreground text-xs leading-relaxed">{activeTopic.intuition}</p>
                </div>

                <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">3. {activeTopic.isProblem ? 'Heap Approach' : 'Why Heap Works'}</span>
                  <p className="text-muted-foreground text-xs leading-relaxed">{activeTopic.whyHeap}</p>
                </div>

                <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">4. Visual Snippet</span>
                  <p className="font-mono text-xs text-amber-400 leading-relaxed">{activeTopic.visualSnippet}</p>
                </div>

                <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">5. Complexity</span>
                  <p className="font-mono text-xs text-foreground font-bold leading-relaxed">{activeTopic.complexity}</p>
                </div>

                <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">6. {activeTopic.isProblem ? 'Interview Follow-up' : 'Interview Insight'}</span>
                  <p className="text-muted-foreground text-xs leading-relaxed">{activeTopic.interviewInsight}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* SECTION 6: COMPLEXITY QUICK CARD */}
        <section id="complexity" className="space-y-4 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">6. Complexity Reference Cheat Card</h2>
              <p className="text-xs text-muted-foreground">Quick performance benchmarks</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
            <div className="bg-card/70 border border-border/80 rounded-2xl p-3 space-y-1 shadow-sm">
              <span className="text-[10px] text-muted-foreground font-sans uppercase font-bold block">Peek</span>
              <span className="text-emerald-400 font-bold text-sm">O(1)</span>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-2xl p-3 space-y-1 shadow-sm">
              <span className="text-[10px] text-muted-foreground font-sans uppercase font-bold block">Insert</span>
              <span className="text-amber-400 font-bold text-sm">O(log N)</span>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-2xl p-3 space-y-1 shadow-sm">
              <span className="text-[10px] text-muted-foreground font-sans uppercase font-bold block">Extract</span>
              <span className="text-amber-400 font-bold text-sm">O(log N)</span>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-2xl p-3 space-y-1 shadow-sm">
              <span className="text-[10px] text-muted-foreground font-sans uppercase font-bold block">Build Heap</span>
              <span className="text-blue-400 font-bold text-sm">O(N)</span>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-2xl p-3 space-y-1 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-[10px] text-muted-foreground font-sans uppercase font-bold block">Heap Sort</span>
              <span className="text-purple-400 font-bold text-sm">O(N log N)</span>
            </div>
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
