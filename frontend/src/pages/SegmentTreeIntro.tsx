import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Layers, Clock, 
  Sparkles, BookOpen, CheckCircle2, AlertTriangle, 
  Zap, Workflow,
  TrendingUp, HardDrive, ListFilter, Play, RefreshCw, Scale
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { SegmentTreeIntroVisualizer } from '../components/visualizer/segmentTree/SegmentTreeIntroVisualizer';

export const SegmentTreeIntro = () => {
  const navLinks = [
    { id: 'what-is-segment-tree', label: '1. What Is A Segment Tree?', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'why-segment-tree', label: '2. Why Do We Need It?', icon: <Zap className="w-4 h-4" /> },
    { id: 'core-idea', label: '3. Core Idea & Structure', icon: <Workflow className="w-4 h-4" /> },
    { id: 'interactive-demo', label: '4. Interactive Demonstration', icon: <Play className="w-4 h-4" /> },
    { id: 'patterns', label: '5. Common Patterns', icon: <Layers className="w-4 h-4" /> },
    { id: 'interview-signals', label: '6. Interview Signals & Tradeoffs', icon: <Scale className="w-4 h-4" /> },
    { id: 'learning-journey', label: '7. Learning Journey', icon: <BookOpen className="w-4 h-4" /> }
  ];

  const learningJourney = [
    { id: 'segment-tree-intro', step: '1', title: 'Segment Tree Intro', difficulty: 'Easy', time: 'O(log N)', desc: 'What is a Segment Tree & Why do we need it?' },
    { id: 'build-segment-tree', step: '2', title: 'Building a Segment Tree', difficulty: 'Medium', time: 'O(N)', desc: 'Leaf creation, parent merge, and tree construction.' },
    { id: 'range-sum-query', step: '3', title: 'Range Sum Query', difficulty: 'Medium', time: 'O(log N)', desc: 'Query range sums traversing covered, partial, and disjoint nodes.' },
    { id: 'range-min-query', step: '4', title: 'Range Minimum Query', difficulty: 'Medium', time: 'O(log N)', desc: 'Query minimum values over arbitrary sub-arrays.' },
    { id: 'range-max-query', step: '5', title: 'Range Maximum Query', difficulty: 'Medium', time: 'O(log N)', desc: 'Query maximum values over arbitrary sub-arrays.' },
    { id: 'point-update', step: '6', title: 'Point Update', difficulty: 'Medium', time: 'O(log N)', desc: 'Update a single element and propagate changes upward.' },
    { id: 'range-update', step: '7', title: 'Range Update', difficulty: 'Hard', time: 'O(log N)', desc: 'Updating intervals with lazy state management.' },
    { id: 'lazy-propagation', step: '8', title: 'Lazy Propagation', difficulty: 'Hard', time: 'O(log N)', desc: 'Defer updates to child nodes using a secondary lazy array.' },
    { id: 'range-assignment', step: '9', title: 'Range Assignment Updates', difficulty: 'Hard', time: 'O(log N)', desc: 'Overwriting ranges with uniform values lazily.' },
    { id: 'segment-tree-applications', step: '10', title: 'Segment Tree Applications', difficulty: 'Hard', time: 'O(N log N)', desc: 'Real-world and competitive programming applications.' },
    { id: 'count-smaller-numbers', step: '11', title: 'Count Smaller Numbers', difficulty: 'Hard', time: 'O(N log N)', desc: 'Dynamic frequency counts using segment tree traversal.' },
    { id: 'skyline-problem', step: '12', title: 'Skyline Overlap Query', difficulty: 'Hard', time: 'O(N log N)', desc: 'Building heights and range maximum overlap tracking.' }
  ];

  const patterns = [
    {
      title: 'Range Sum Queries',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      desc: 'Decompose range [L, R] into canonical sub-intervals to query sums in O(log N).',
      linkId: 'range-sum-query',
      linkText: 'Range Sum Query →'
    },
    {
      title: 'Range Minimum Queries (RMQ)',
      icon: <ListFilter className="w-5 h-5 text-blue-400" />,
      desc: 'Store precomputed minimums in nodes. Disjoint nodes return +INFINITY.',
      linkId: 'range-min-query',
      linkText: 'Range Minimum Query →'
    },
    {
      title: 'Range Maximum Queries',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      desc: 'Store precomputed maximums in nodes. Disjoint nodes return -INFINITY.',
      linkId: 'range-max-query',
      linkText: 'Range Maximum Query →'
    },
    {
      title: 'Dynamic Point Updates',
      icon: <RefreshCw className="w-5 h-5 text-purple-400" />,
      desc: 'Modify array element A[i] and propagate changes up the log N height to root.',
      linkId: 'point-update',
      linkText: 'Point Update →'
    },
    {
      title: 'Lazy Propagation',
      icon: <Clock className="w-5 h-5 text-pink-400" />,
      desc: 'Defer range updates to child subtrees using a secondary lazy array for O(log N) updates.',
      linkId: 'lazy-propagation',
      linkText: 'Lazy Propagation →'
    },
    {
      title: 'Competitive Applications',
      icon: <HardDrive className="w-5 h-5 text-cyan-400" />,
      desc: 'Coordinate compression, frequency trees, and skyline range overlap queries.',
      linkId: 'segment-tree-applications',
      linkText: 'Segment Tree Applications →'
    }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left pb-12">
        
        {/* HERO SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-pink-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-fuchsia-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-xs font-bold uppercase tracking-wider border border-fuchsia-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Core Data Structure
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Segment Tree
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Master O(log N) Range Queries (Sum, Min, Max) and Dynamic Range Updates through intuitive visual animations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollTo('what-is-segment-tree')}
                  className="px-6 py-3 rounded-2xl bg-fuchsia-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-fuchsia-500/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => scrollTo('learning-journey')}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-fuchsia-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-fuchsia-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <span className="font-bold text-fuchsia-400">Advanced Tree</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Range Query Time</span>
                <span className="font-bold text-emerald-400">O(log N)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Update Time</span>
                <span className="font-bold text-amber-400">O(log N)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Build Time & Space</span>
                <span className="font-bold text-blue-400">O(N) time / O(N) space</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS A SEGMENT TREE? */}
        <section id="what-is-segment-tree" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">What Is A Segment Tree?</h2>
              <p className="text-xs text-muted-foreground">Understanding the structure of an interval management tree</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground">A Hierarchy of Sub-Arrays</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A <strong className="text-foreground">Segment Tree</strong> is a full binary tree data structure where each node represents an aggregate answer (Sum, Min, Max, GCD) over a specific range <code className="text-primary">[L, R]</code> of an array.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Root Node:</strong> Represents full array range [0, N-1].</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Leaf Nodes:</strong> Represent individual array elements [i, i].</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Internal Nodes:</strong> Merge answers from left child [L, mid] and right child [mid+1, R].</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground">The Power of Binary Intervals</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Because any arbitrary range query <code className="text-primary">[L, R]</code> can be decomposed into at most <strong className="text-foreground font-mono">2 log N</strong> canonical segment tree sub-intervals, queries take <strong className="text-emerald-400 font-mono">O(log N)</strong> time!
              </p>
              <div className="p-4 rounded-xl bg-background/80 border border-border text-xs font-mono space-y-1">
                <span className="text-amber-400 font-bold block">Interval Partitioning Formula:</span>
                <span>Mid = floor((L + R) / 2)</span><br />
                <span>Left Child = [L, Mid]</span><br />
                <span>Right Child = [Mid + 1, R]</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHY DO WE NEED IT? */}
        <section id="why-segment-tree" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Why Do We Need Segment Trees?</h2>
              <p className="text-xs text-muted-foreground">Motivation through concrete example and time complexity comparison</p>
            </div>
          </div>

          {/* Concrete Example Box */}
          <div className="bg-gradient-to-r from-amber-500/10 via-card to-card border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Concrete Motivation Example</span>
              <h3 className="text-xl font-bold text-foreground">Array: [2, 5, 1, 4, 9, 3] | Query: Sum from index 1 to 4</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              
              {/* Naive Approach */}
              <div className="p-5 rounded-2xl bg-background/80 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 uppercase tracking-wider">Naive Array Approach</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold">Query O(N)</span>
                </div>
                <p className="text-muted-foreground leading-relaxed font-sans text-xs">
                  Iterate through indices 1, 2, 3, 4 sequentially: 5 + 1 + 4 + 9 = 19.
                </p>
                <div className="p-3 rounded-xl bg-card border border-border text-rose-300">
                  ⚠️ Performing Q queries takes O(Q × N) time! For 10⁵ elements and 10⁵ queries, this requires 10¹⁰ operations → TLE!
                </div>
              </div>

              {/* Segment Tree Approach */}
              <div className="p-5 rounded-2xl bg-background/80 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider">Segment Tree Approach</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Query O(log N)</span>
                </div>
                <p className="text-muted-foreground leading-relaxed font-sans text-xs">
                  Combines precomputed sub-tree node sums: Node [1] (5) + Node [2] (1) + Node [3,4] (13) = 19.
                </p>
                <div className="p-3 rounded-xl bg-card border border-border text-emerald-300">
                  ✅ Visits only 3 nodes out of 13! 10⁵ queries take only 1.7 × 10⁶ operations → Instant 0.01s execution!
                </div>
              </div>

            </div>

            {/* Comprehensive Comparison Matrix */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-foreground">Data Structure Comparison Matrix</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-card">
                      <th className="p-3 text-muted-foreground">Data Structure</th>
                      <th className="p-3 text-muted-foreground">Range Sum Query</th>
                      <th className="p-3 text-muted-foreground">Point Update</th>
                      <th className="p-3 text-muted-foreground">Range Min / Max</th>
                      <th className="p-3 text-muted-foreground">Range Update (Lazy)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr className="hover:bg-accent/40">
                      <td className="p-3 font-bold text-foreground">Brute Force Array</td>
                      <td className="p-3 text-rose-400 font-bold">O(N)</td>
                      <td className="p-3 text-emerald-400 font-bold">O(1)</td>
                      <td className="p-3 text-rose-400 font-bold">O(N)</td>
                      <td className="p-3 text-rose-400 font-bold">O(N)</td>
                    </tr>
                    <tr className="hover:bg-accent/40">
                      <td className="p-3 font-bold text-foreground">Prefix Sum Array</td>
                      <td className="p-3 text-emerald-400 font-bold">O(1)</td>
                      <td className="p-3 text-rose-400 font-bold">O(N)</td>
                      <td className="p-3 text-rose-400 font-bold">Not Supported</td>
                      <td className="p-3 text-rose-400 font-bold">O(N)</td>
                    </tr>
                    <tr className="hover:bg-accent/40">
                      <td className="p-3 font-bold text-foreground">Fenwick Tree (BIT)</td>
                      <td className="p-3 text-emerald-400 font-bold">O(log N)</td>
                      <td className="p-3 text-emerald-400 font-bold">O(log N)</td>
                      <td className="p-3 text-amber-400 font-bold">Limited / Complex</td>
                      <td className="p-3 text-amber-400 font-bold">O(log N)</td>
                    </tr>
                    <tr className="bg-fuchsia-500/10 border-l-4 border-l-fuchsia-500">
                      <td className="p-3 font-bold text-fuchsia-400">Segment Tree</td>
                      <td className="p-3 text-emerald-400 font-bold">O(log N)</td>
                      <td className="p-3 text-emerald-400 font-bold">O(log N)</td>
                      <td className="p-3 text-emerald-400 font-bold">O(log N) Universal</td>
                      <td className="p-3 text-emerald-400 font-bold">O(log N) Universal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CORE IDEA */}
        <section id="core-idea" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Core Idea & Tree Structure</h2>
              <p className="text-xs text-muted-foreground">Associative merge property and tree partitioning</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
              <h3 className="text-base font-bold text-foreground">Associative Property</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Segment Trees work for ANY aggregate function that is associative: <code className="text-primary font-mono">f(a, f(b, c)) = f(f(a, b), c)</code>. Examples: Sum, Minimum, Maximum, GCD, Bitwise XOR, Matrix Multiplication.
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">2</div>
              <h3 className="text-base font-bold text-foreground">Bottom-Up Merge</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                During construction or point update, each parent node combines its left and right child answers: <code className="text-primary font-mono">tree[node] = merge(tree[2*node], tree[2*node+1])</code>.
              </p>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">3</div>
              <h3 className="text-base font-bold text-foreground">4N Array Storage</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Represented in 1D memory array using 1-based indexing: Node <code className="text-primary font-mono">i</code> has left child at <code className="text-primary font-mono">2i</code> and right child at <code className="text-primary font-mono">2i + 1</code>.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE DEMONSTRATION */}
        <section id="interactive-demo" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Interactive Demonstration</h2>
              <p className="text-xs text-muted-foreground">Experiment with range sum queries and point updates in real time</p>
            </div>
          </div>

          <div className="w-full bg-card rounded-3xl border border-border p-6 shadow-xl">
            <SegmentTreeIntroVisualizer />
          </div>
        </section>

        {/* SECTION 5: COMMON PATTERNS */}
        <section id="patterns" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Common Segment Tree Patterns</h2>
              <p className="text-xs text-muted-foreground">Click any pattern card to jump into specialized interactive visualizers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.map(p => (
              <Link
                key={p.title}
                to={`/algorithms/segment-tree/${p.linkId}`}
                className="bg-card border border-border/80 rounded-2xl p-6 hover:border-fuchsia-500/50 hover:shadow-lg transition-all space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-fuchsia-400 transition-colors">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
                <span className="text-xs font-bold text-fuchsia-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {p.linkText}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 6: INTERVIEW SIGNALS & TRADEOFFS */}
        <section id="interview-signals" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Interview Signals & Clues</h2>
              <p className="text-xs text-muted-foreground">When to choose Segment Trees during coding interviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Positive Interview Signals
              </h3>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Frequent Range Queries + Frequent Updates:</strong> Problem requires querying range sum, min, max, or GCD while values are dynamically updated.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Range Updates:</strong> Add +V or set range [L, R] to V (requires Lazy Propagation).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Dynamic Interval Overlaps:</strong> Skyline problem, maximum overlapping intervals, coordinate compression.</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> When NOT To Use Segment Trees
              </h3>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>No Updates Exist:</strong> Use <strong>Prefix Sum Array</strong> (O(1) query time) or <strong>Sparse Table</strong> for RMQ (O(1) query time).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Only Range Sum & Point Update:</strong> Consider <strong>Fenwick Tree (BIT)</strong> — uses 1/4th the space and simpler 10-line code.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 7: LEARNING JOURNEY */}
        <section id="learning-journey" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Segment Tree Learning Track</h2>
              <p className="text-xs text-muted-foreground">Follow this structured roadmap from fundamentals to advanced competitive topics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningJourney.map(item => (
              <Link
                key={item.id}
                to={`/algorithms/segment-tree/${item.id}`}
                className="bg-card border border-border/80 rounded-2xl p-5 hover:border-fuchsia-500/50 hover:shadow-lg transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 font-bold text-xs flex items-center justify-center border border-fuchsia-500/20">
                    {item.step}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    item.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    item.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {item.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-fuchsia-400 transition-colors">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-2 border-t border-border/60">
                  <span>Complexity: {item.time}</span>
                  <span className="text-fuchsia-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    Start <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
