import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Sparkles, BookOpen, CheckCircle2, AlertTriangle, 
  Zap, Play, Scale, Cpu, Code2, Layers
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { BITIntroVisualizer } from '../components/visualizer/bit/BITIntroVisualizer';

interface BITTopicDetail {
  id: string;
  title: string;
  badge: string;
  overview: string;
  intuition: string;
  formula: string;
  complexity: string;
  interviewInsight: string;
}

const BIT_TOPICS_DATA: BITTopicDetail[] = [
  {
    id: 'fenwick-tree-intro',
    title: '1. Binary Indexed Tree Intro',
    badge: 'Basics',
    overview: 'Compact data structure that maintains prefix sums over a dynamic array in O(log N) time with 10 lines of code.',
    intuition: 'Accounting Ledger: Stores partial sums of binary intervals determined by lowbit.',
    formula: 'BIT[i] stores range sum [i - lowbit(i) + 1 ... i]',
    complexity: 'Query O(log N) | Update O(log N) | Space O(N)',
    interviewInsight: 'Use BIT when you only need point updates and prefix sum/XOR queries.'
  },
  {
    id: 'prefix-sum-refresher',
    title: '2. Prefix Sum Refresher',
    badge: 'Foundations',
    overview: 'Precomputes cumulative totals P[i] = A[0] + ... + A[i] for constant O(1) static queries.',
    intuition: 'Trade precomputation for ultra-fast queries. Bottleneck occurs on updates.',
    formula: 'range_sum(L, R) = P[R] - P[L - 1]',
    complexity: 'Query O(1) | Update O(N) | Space O(N)',
    interviewInsight: 'Static array queries? Use Prefix Sum. Dynamic array updates? Use Fenwick Tree.'
  },
  {
    id: 'why-bit-exists',
    title: '3. Why BIT Exists',
    badge: 'Foundations',
    overview: 'Bridges the trade-off between Naive Array (slow queries O(N)) and Prefix Sum (slow updates O(N)).',
    intuition: 'Performs Partial Precomputation: breaks prefix sum into log N binary sub-ranges.',
    formula: 'Balances Query O(log N) and Update O(log N)',
    complexity: 'Query O(log N) | Update O(log N) | Space O(N)',
    interviewInsight: 'BIT uses 4x less memory and has a 3x faster constant factor than Segment Tree.'
  },
  {
    id: 'bit-structure',
    title: '4. BIT Structure & Ranges',
    badge: 'Core Concept',
    overview: 'Understanding what range each BIT[i] cell stores based on binary lowbit length.',
    intuition: 'Odd indices store len=1. Powers of 2 (1, 2, 4, 8) store full prefix sums.',
    formula: 'lowbit(i) = i & -i | len = lowbit(i)',
    complexity: 'Range Lookup O(1) | Space O(N) 1D Array',
    interviewInsight: 'BIT is NOT a linked tree — it is a flat contiguous 1D array of size N + 1!'
  },
  {
    id: 'lowbit-operation',
    title: '5. Lowbit Operation (x & -x)',
    badge: 'Core Concept',
    overview: 'Extracts the lowest set bit (LSB) of integer x in constant O(1) bitwise time.',
    intuition: 'Two\'s complement (-x = ~x + 1) flips bits, restoring LSB when combined via bitwise AND.',
    formula: 'lowbit(x) = x & -x',
    complexity: 'Time O(1) constant | Space O(1)',
    interviewInsight: 'lowbit(x) gives the length of the interval responsible for BIT[x].'
  },
  {
    id: 'bit-point-update',
    title: '6. Point Update in BIT',
    badge: 'Operations',
    overview: 'Adds delta to index i and propagates updates upward to parent cells in O(log N) time.',
    intuition: 'Step UP to parent responsibility ranges by adding lowbit(i).',
    formula: 'for (; i <= n; i += i & -i) bit[i] += delta;',
    complexity: 'Time O(log N) | Space O(1)',
    interviewInsight: 'Point update steps UPWARDS: `i += i & -i`.'
  },
  {
    id: 'prefix-sum-query',
    title: '7. Prefix Sum Query in BIT',
    badge: 'Operations',
    overview: 'Accumulates prefix sum from 1 to i by stepping backward in O(log N) time.',
    intuition: 'Step DOWN by stripping lowbit(i) to collect disjoint sub-range sums.',
    formula: 'for (; i > 0; i -= i & -i) sum += bit[i];',
    complexity: 'Time O(log N) | Space O(1)',
    interviewInsight: 'Prefix sum query steps DOWNWARDS: `i -= i & -i`.'
  },
  {
    id: 'bit-range-sum-query',
    title: '8. Range Sum Query in BIT',
    badge: 'Operations',
    overview: 'Calculates range sum [L, R] via visual subtraction: query(R) - query(L - 1).',
    intuition: 'Subtracting prefix(L-1) from prefix(R) isolates exact sub-array sum.',
    formula: 'range_sum(L, R) = query(R) - query(L - 1)',
    complexity: 'Time O(log N) | Space O(1)',
    interviewInsight: 'Always subtract `query(L - 1)` (subtracting `query(L)` removes element A[L]).'
  },
  {
    id: 'coordinate-compression-bit',
    title: '9. Coordinate Compression',
    badge: 'Advanced',
    overview: 'Maps large numbers (-10^9 to 10^9) to small ranks 1..K for BIT indexing.',
    intuition: 'Sort unique values and use binary search rank instead of raw number.',
    formula: 'rank = lower_bound(unique, val) + 1',
    complexity: 'Time O(N log N) | Space O(N)',
    interviewInsight: 'Essential preprocessing step for inversion counting and frequency trees.'
  },
  {
    id: 'count-inversions',
    title: '10. Count Inversions',
    badge: 'Problem',
    overview: 'Counts pairs (i, j) with i < j and A[i] > A[j] in O(N log N) time using BIT frequency tree.',
    intuition: 'Traverse right-to-left. Query BIT for numbers smaller than current, then insert.',
    formula: 'inversions += query(rank - 1); add(rank, 1);',
    complexity: 'Time O(N log N) | Space O(N)',
    interviewInsight: 'Inversion counts can reach N*(N-1)/2 ≈ 5*10^9. Always use 64-bit int / long!'
  },
  {
    id: 'order-statistics-bit',
    title: '11. Order Statistics & Lifting',
    badge: 'Advanced',
    overview: 'Finds K-th smallest element dynamically in O(log N) time using Binary Lifting on BIT.',
    intuition: 'Step down powers of 2 (1<<18 down to 1) accumulating ranks without nested binary search.',
    formula: 'if(idx + step <= n && bit[idx + step] < k) idx += step, k -= bit[idx];',
    complexity: 'Time O(log N) | Space O(1)',
    interviewInsight: 'Replaces O(log^2 N) binary search with O(log N) single pass binary lifting.'
  }
];

export const BinaryIndexedTreeIntro: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>('fenwick-tree-intro');
  const activeTopicDetail = BIT_TOPICS_DATA.find(t => t.id === activeTopicId) || BIT_TOPICS_DATA[0];

  const navLinks = [
    { id: 'what-is-bit', label: '1. What Is A BIT?', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'why-bit', label: '2. Why Does BIT Exist?', icon: <Zap className="w-4 h-4" /> },
    { id: 'core-idea', label: '3. Core Idea & Lowbit', icon: <Cpu className="w-4 h-4" /> },
    { id: 'interactive-demo', label: '4. Interactive Demonstration', icon: <Play className="w-4 h-4" /> },
    { id: 'subtopic-explorer', label: '5. 11 Subtopics Detail Explorer', icon: <Layers className="w-4 h-4" /> },
    { id: 'bit-vs-segtree', label: '6. BIT vs Segment Tree', icon: <Scale className="w-4 h-4" /> },
    { id: 'interview-signals', label: '7. Interview Signals', icon: <Code2 className="w-4 h-4" /> }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-12 sm:space-y-16 text-left pb-12">
        
        {/* HERO SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-violet-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold uppercase tracking-wider border border-violet-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> High-Performance Data Structure
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Binary Indexed Tree
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Also known as a Fenwick Tree. Master O(log N) prefix sum queries and point updates with 10 lines of elegant bitwise math.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollTo('what-is-bit')}
                  className="px-6 py-3 rounded-2xl bg-violet-500 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => scrollTo('subtopic-explorer')}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-violet-500/40 transition-all"
                >
                  Explore 11 Subtopics
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-violet-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <span className="font-bold text-violet-400 font-sans">Fenwick / Bitwise Tree</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Prefix Query Time</span>
                <span className="font-bold text-emerald-400">O(log N)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Point Update Time</span>
                <span className="font-bold text-amber-400">O(log N)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Extra Memory</span>
                <span className="font-bold text-blue-400">Exact N Array (1D)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS A BIT? */}
        <section id="what-is-bit" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What Is A Binary Indexed Tree?</h2>
              <p className="text-xs text-muted-foreground">Simple explanation without academic jargon</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">Dynamic Prefix Sum Engine</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A <strong className="text-foreground">Binary Indexed Tree (Fenwick Tree)</strong> is a data structure that provides:
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Fast Prefix Queries:</strong> Calculate sum(1...i) in O(log N) time.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Fast Point Updates:</strong> Add +V to index i in O(log N) time.</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">Lightweight & Fast</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlike Segment Trees which require node objects and a <code className="text-violet-400 font-mono">4N</code> array size, a Fenwick Tree uses a single <strong className="text-foreground font-mono">N-size 1D array</strong> and requires less than <strong className="text-emerald-400 font-mono">10 lines of code</strong>!
              </p>
              <div className="p-4 rounded-xl bg-background/80 border border-border text-xs font-mono space-y-1">
                <span className="text-violet-400 font-bold block">The Fenwick Code Core:</span>
                <span>void add(int i, int delta) &#123; for(; i &lt;= n; i += i & -i) bit[i] += delta; &#125;</span><br />
                <span>int query(int i) &#123; int s=0; for(; i &gt; 0; i -= i & -i) s += bit[i]; return s; &#125;</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHY DOES BIT EXIST? */}
        <section id="why-bit" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">2. Why Does BIT Exist?</h2>
              <p className="text-xs text-muted-foreground">Motivating example demonstrating the update/query trade-off</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-500/10 via-card to-card border border-violet-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Motivating Problem</span>
              <h3 className="text-xl font-bold text-foreground">Array: [2, 5, 1, 4, 9, 3] | Queries: sum(0,4), sum(2,5), sum(1,3) with dynamic updates</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-background/80 border border-rose-500/30 space-y-2">
                <span className="font-bold text-rose-400 uppercase tracking-wider block font-sans">Naive Array</span>
                <span className="text-muted-foreground block text-[11px]">Updates: O(1)</span>
                <span className="text-rose-400 font-bold block text-[11px]">Queries: O(N)</span>
              </div>

              <div className="p-4 rounded-2xl bg-background/80 border border-amber-500/30 space-y-2">
                <span className="font-bold text-amber-400 uppercase tracking-wider block font-sans">Prefix Sum Array</span>
                <span className="text-emerald-400 font-bold block text-[11px]">Queries: O(1)</span>
                <span className="text-rose-400 font-bold block text-[11px]">Updates: O(N)</span>
              </div>

              <div className="p-4 rounded-2xl bg-background/80 border border-emerald-500/30 space-y-2">
                <span className="font-bold text-emerald-400 uppercase tracking-wider block font-sans">Binary Indexed Tree</span>
                <span className="text-emerald-400 font-bold block text-[11px]">Queries: O(log N)</span>
                <span className="text-emerald-400 font-bold block text-[11px]">Updates: O(log N)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CORE IDEA */}
        <section id="core-idea" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">3. Core Idea & Lowbit Operation</h2>
              <p className="text-xs text-muted-foreground">The magic of two's complement LSB isolation: x & -x</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">1</div>
              <h3 className="text-base font-bold text-foreground">LSB Isolation (x & -x)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Evaluating <code className="text-violet-400 font-mono font-bold">x & -x</code> isolates the lowest set 1-bit in integer x.
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">2</div>
              <h3 className="text-base font-bold text-foreground">Stepping UP on Update</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Point updates step upward by adding lowbit: <code className="text-violet-400 font-mono font-bold">i += i & -i</code>.
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">3</div>
              <h3 className="text-base font-bold text-foreground">Stepping DOWN on Query</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Prefix queries step backward by stripping lowbit: <code className="text-violet-400 font-mono font-bold">i -= i & -i</code>.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE DEMONSTRATION */}
        <section id="interactive-demo" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">4. Interactive Demonstration</h2>
              <p className="text-xs text-muted-foreground">Click any BIT cell to see its exact original array range responsibility</p>
            </div>
          </div>

          <div className="w-full bg-card rounded-3xl border border-border p-6 shadow-xl">
            <BITIntroVisualizer />
          </div>
        </section>

        {/* SECTION 5: 11 SUBTOPICS DETAIL EXPLORER */}
        <section id="subtopic-explorer" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">5. 11 Subtopics Detail Explorer</h2>
              <p className="text-xs text-muted-foreground">Click any subtopic card to inspect formulas, intuition, and complexities</p>
            </div>
          </div>

          {/* Active Detail Drawer */}
          <div className="bg-card border border-violet-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold uppercase tracking-wider border border-violet-500/20">
                  {activeTopicDetail.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">{activeTopicDetail.title}</h3>
              </div>

              <Link
                to={`/algorithms/binary-indexed-tree/${activeTopicDetail.id}`}
                className="px-5 py-2.5 rounded-2xl bg-violet-500 text-white font-bold text-xs hover:brightness-110 transition-all shadow-md flex items-center gap-2"
              >
                Start Visualizer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overview & Concept</h4>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">{activeTopicDetail.overview}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Core Intuition</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{activeTopicDetail.intuition}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-background border border-border space-y-1 font-mono text-xs">
                  <span className="text-xs font-bold text-violet-400 block">Formula / Snippet</span>
                  <code className="text-muted-foreground block text-[11px] font-mono">{activeTopicDetail.formula}</code>
                </div>

                <div className="p-4 rounded-2xl bg-background border border-border space-y-1 font-mono text-xs">
                  <span className="text-xs font-bold text-emerald-400 block">Complexity Specs</span>
                  <span className="text-muted-foreground text-[11px]">{activeTopicDetail.complexity}</span>
                </div>

                <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 space-y-1 text-xs">
                  <span className="text-xs font-bold text-violet-400 block">Interview Insight</span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">{activeTopicDetail.interviewInsight}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subtopic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BIT_TOPICS_DATA.map(topic => {
              const isSelected = topic.id === activeTopicId;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${
                    isSelected
                      ? 'bg-violet-500/15 border-violet-400 text-foreground ring-2 ring-violet-400/40 shadow-lg scale-[1.02]'
                      : 'bg-card border-border/80 hover:border-violet-500/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-bold border border-violet-500/20">
                      {topic.badge}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{topic.complexity.split('|')[0]}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-foreground">{topic.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{topic.overview}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 6: BIT VS SEGMENT TREE */}
        <section id="bit-vs-segtree" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">6. BIT vs Segment Tree Comparison</h2>
              <p className="text-xs text-muted-foreground">Knowing when to use Fenwick Tree vs when Segment Tree is required</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-violet-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Use Fenwick Tree (BIT) When:
              </h3>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">•</span>
                  <span><strong>Range Sum / Prefix XOR Queries:</strong> You only need prefix sums, range sums, or bitwise XOR queries with point updates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">•</span>
                  <span><strong>Memory & Speed:</strong> You need minimal space overhead (N size vs 4N size) and maximum CPU cache efficiency.</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-fuchsia-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Use Segment Tree When:
              </h3>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 font-bold">•</span>
                  <span><strong>Range Minimum / Maximum (RMQ):</strong> You need arbitrary range min/max queries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 font-bold">•</span>
                  <span><strong>Range Updates & Lazy Propagation:</strong> You need to perform range addition (+V to range [L, R]) or range assignment.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 7: INTERVIEW SIGNALS */}
        <section id="interview-signals" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">7. Interview Signals</h2>
              <p className="text-xs text-muted-foreground">Key problem patterns that signal a Fenwick Tree approach</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2 shadow-sm">
              <span className="text-emerald-400 font-bold uppercase tracking-wider block font-sans">Pattern 1: Count Inversions</span>
              <p className="text-muted-foreground font-sans text-xs">
                Find pairs (i, j) where i &lt; j and A[i] &gt; A[j]. Combine Coordinate Compression + Fenwick frequency tree.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2 shadow-sm">
              <span className="text-violet-400 font-bold uppercase tracking-wider block font-sans">Pattern 2: Dynamic Range Sum</span>
              <p className="text-muted-foreground font-sans text-xs">
                Array elements are updated dynamically while range sum queries occur repeatedly in real time.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2 shadow-sm">
              <span className="text-amber-400 font-bold uppercase tracking-wider block font-sans">Pattern 3: Order Statistics</span>
              <p className="text-muted-foreground font-sans text-xs">
                Find K-th smallest element dynamically in O(log N) time using binary lifting on Fenwick Tree.
              </p>
            </div>
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
