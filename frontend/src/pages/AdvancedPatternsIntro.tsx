import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Sparkles, BookOpen, CheckCircle2, 
  Zap, LayoutList, Lightbulb, Workflow,
  ListFilter, Play, Layers, Activity, Calculator, Target, Cpu
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { AdvancedPatternsIntroVisualizer } from '../components/visualizer/advanced/AdvancedPatternsIntroVisualizer';

export const AdvancedPatternsIntro = () => {
  const navLinks = [
    { id: 'what-are-patterns', label: '1. What Are Advanced Patterns?', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'why-patterns', label: '2. Why Do Patterns Matter?', icon: <Zap className="w-4 h-4" /> },
    { id: 'core-idea', label: '3. Pattern Recognition Flow', icon: <Workflow className="w-4 h-4" /> },
    { id: 'interactive-demo', label: '4. Interactive Demonstration', icon: <Play className="w-4 h-4" /> },
    { id: 'recognition-signals', label: '5. Mandatory Recognition Signals', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'patterns-catalog', label: '6. Common Advanced Patterns', icon: <Layers className="w-4 h-4" /> },
    { id: 'learning-journey', label: '7. Learning Journey Roadmap', icon: <LayoutList className="w-4 h-4" /> }
  ];

  const learningJourney = [
    { id: 'monotonic-stack-pattern', step: '1', title: 'Monotonic Stack', difficulty: 'Medium', time: 'O(N)', desc: 'Next Greater Element, Daily Temperatures, and Histogram Area.' },
    { id: 'monotonic-queue-pattern', step: '2', title: 'Monotonic Queue', difficulty: 'Hard', time: 'O(N)', desc: 'Sliding Window Maximum and Constrained Window Sums.' },
    { id: 'union-find-pattern', step: '3', title: 'Union Find (DSU)', difficulty: 'Medium', time: 'O(α(N))', desc: 'Dynamic Connectivity, Provinces, and Cycle Detection.' },
    { id: 'sweep-line-pattern', step: '4', title: 'Sweep Line', difficulty: 'Hard', time: 'O(N log N)', desc: 'Meeting Rooms, Interval Overlaps, and Timeline Events.' },
    { id: 'difference-array-pattern', step: '5', title: 'Difference Array', difficulty: 'Medium', time: 'O(1) update', desc: 'Batch range updates (+D at L, -D at R+1) & reconstruction.' },
    { id: 'binary-search-on-answer-pattern', step: '6', title: 'BS On Answer', difficulty: 'Medium', time: 'O(N log Range)', desc: 'Minimize Maximum, Koko Bananas, and Feasibility Checks.' },
    { id: 'bit-manipulation-patterns', step: '7', title: 'Bit Manipulation', difficulty: 'Medium', time: 'O(N)', desc: 'XOR Cancellation, Single Number, and Subsets.' },
    { id: 'meet-in-the-middle-pattern', step: '8', title: 'Meet In The Middle', difficulty: 'Hard', time: 'O(2^(N/2))', desc: 'Splitting N=40 search space into two N/2 halves.' },
    { id: 'topological-sort-patterns', step: '9', title: 'Topological Sort', difficulty: 'Medium', time: 'O(V + E)', desc: 'Dependency Ordering, Course Schedule, and Alien Dictionary.' },
    { id: 'shortest-path-patterns', step: '10', title: 'Shortest Path', difficulty: 'Hard', time: 'O((V+E)logV)', desc: 'Dijkstra Minimum Cost, Network Delay, and Flights.' },
    { id: 'mst-patterns', step: '11', title: 'MST Patterns', difficulty: 'Hard', time: 'O(E log E)', desc: 'Kruskal, Prim, and Connecting City Infrastructure.' },
    { id: 'state-compression-dp-pattern', step: '12', title: 'State Compression DP', difficulty: 'Hard', time: 'O(2^N * N^2)', desc: 'Bitmask DP, Traveling Salesperson, and Subsets DP.' }
  ];

  const patternsCatalog = [
    {
      title: 'Monotonic Structures',
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      desc: 'Maintain stack or deque monotonicity to find next/previous greater elements or window maxima in O(N).',
      linkId: 'monotonic-stack-pattern',
      linkText: 'Monotonic Stack & Queue →'
    },
    {
      title: 'Disjoint Sets (DSU)',
      icon: <ListFilter className="w-5 h-5 text-blue-400" />,
      desc: 'Track dynamic connectivity and merge connected components in near-constant O(α(N)) time.',
      linkId: 'union-find-pattern',
      linkText: 'Union Find & Provinces →'
    },
    {
      title: 'Sweep Line & Intervals',
      icon: <Activity className="w-5 h-5 text-purple-400" />,
      desc: 'Convert 2D interval overlaps into a 1D event timeline sorted by start and end timestamps.',
      linkId: 'sweep-line-pattern',
      linkText: 'Sweep Line & Meeting Rooms →'
    },
    {
      title: 'Range Modifications',
      icon: <Calculator className="w-5 h-5 text-emerald-400" />,
      desc: 'Perform O(1) batch range updates using boundary markers and reconstruct via prefix sum.',
      linkId: 'difference-array-pattern',
      linkText: 'Difference Array →'
    },
    {
      title: 'Search Space Optimization',
      icon: <Target className="w-5 h-5 text-rose-400" />,
      desc: 'Binary search over monotonic answer spaces [low, high] with a boolean feasibility test.',
      linkId: 'binary-search-on-answer-pattern',
      linkText: 'Binary Search On Answer →'
    },
    {
      title: 'Graph & DP Patterns',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      desc: 'Solve topological sorting, shortest path Dijkstra, Kruskal MST, and Bitmask State Compression DP.',
      linkId: 'state-compression-dp-pattern',
      linkText: 'Advanced Graph & Bitmask DP →'
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
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-primary/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" /> AlgoVis Mastery Stage
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Advanced Patterns
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Master pattern recognition. Learn how top interview candidates decode disguised problem descriptions and map them to optimal algorithmic solutions.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollTo('what-are-patterns')}
                  className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => scrollTo('learning-journey')}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-primary/40 transition-all"
                >
                  Explore Roadmap
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground font-sans">Level</span>
                <span className="font-bold text-primary font-sans">Final Mastery</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground font-sans">Core Objective</span>
                <span className="font-bold text-emerald-400 font-sans">Pattern Mapping</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground font-sans">Total Patterns</span>
                <span className="font-bold text-amber-400 font-sans">12 High-Frequency</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT ARE ADVANCED PATTERNS? */}
        <section id="what-are-patterns" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">What Are Advanced Patterns?</h2>
              <p className="text-xs text-muted-foreground">Moving beyond rote memory to deep algorithmic intuition</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            An <strong>advanced pattern</strong> is a structural template that connects disguised real-world problem statements to proven algorithmic techniques. Instead of memorizing hundreds of solution scripts, mastering pattern recognition allows you to instantly map any interview problem to its optimal data structure and complexity bound.
          </p>
        </section>

        {/* SECTION 2: WHY DO PATTERNS MATTER? */}
        <section id="why-patterns" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Why Do Patterns Matter?</h2>
              <p className="text-xs text-muted-foreground">Common real-world and interview problem domains</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <Layers className="w-6 h-6 text-amber-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">1. Monotonicity</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Finding next greater element or sliding window bounds in O(N).</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <ListFilter className="w-6 h-6 text-blue-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">2. Connectedness</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Tracking dynamic component merges and cycles in near O(1).</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <Activity className="w-6 h-6 text-purple-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">3. Event Timelines</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Processing meeting overlaps via sorted sweep line events.</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <Calculator className="w-6 h-6 text-emerald-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">4. Range Updates</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Executing O(1) batch range additions via difference arrays.</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <Target className="w-6 h-6 text-rose-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">5. Optimization</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Minimizing maximum value via binary search feasibility.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: CORE PATTERN RECOGNITION FLOW */}
        <section id="core-idea" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Pattern Recognition Flow</h2>
              <p className="text-xs text-muted-foreground">The 5-step problem-solving sequence</p>
            </div>
          </div>

          <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-center">
              <div className="flex-1 w-full p-4 rounded-2xl bg-background/60 border border-border">
                <span className="text-xs text-muted-foreground block mb-1">Step 1</span>
                <span className="font-bold text-amber-400 font-sans">Disguised Problem</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              <div className="flex-1 w-full p-4 rounded-2xl bg-background/60 border border-border">
                <span className="text-xs text-muted-foreground block mb-1">Step 2</span>
                <span className="font-bold text-emerald-400 font-sans">Observation Signal</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              <div className="flex-1 w-full p-4 rounded-2xl bg-background/60 border border-border">
                <span className="text-xs text-muted-foreground block mb-1">Step 3</span>
                <span className="font-bold text-purple-400 font-sans">Pattern Identification</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              <div className="flex-1 w-full p-4 rounded-2xl bg-background/60 border border-border">
                <span className="text-xs text-muted-foreground block mb-1">Step 4</span>
                <span className="font-bold text-cyan-400 font-sans">Technique Selection</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              <div className="flex-1 w-full p-4 rounded-2xl bg-primary/20 border border-primary/40">
                <span className="text-xs text-primary-foreground block mb-1">Step 5</span>
                <span className="font-bold text-emerald-300 font-sans">Optimal Solution</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE DEMONSTRATION (HIGH VISIBILITY CENTERPIECE) */}
        <section id="interactive-demo" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Interactive Demonstration</h2>
              <p className="text-xs text-muted-foreground">Select a pattern tab below to test its visual engine</p>
            </div>
          </div>

          <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <AdvancedPatternsIntroVisualizer />
          </div>
        </section>

        {/* SECTION 5: MANDATORY RECOGNITION SIGNALS */}
        <section id="recognition-signals" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Mandatory Recognition Signals</h2>
              <p className="text-xs text-muted-foreground">Key phrases and constraints that trigger specific pattern mappings</p>
            </div>
          </div>

          <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Pattern Signal Triggers:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-background border border-border space-y-2">
                <span className="text-amber-400 font-bold uppercase tracking-wider block font-sans">Monotonic Stack</span>
                <ul className="space-y-1 text-muted-foreground text-[11px] font-sans">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> "Next Greater / Previous Greater"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> "Nearest Smaller Element"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> "Daily Temperatures / Histogram Area"</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border space-y-2">
                <span className="text-rose-400 font-bold uppercase tracking-wider block font-sans">BS On Answer</span>
                <ul className="space-y-1 text-muted-foreground text-[11px] font-sans">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> "Minimize the Maximum value"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> "Maximize the Minimum distance"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> "Monotonic feasibility check `isPossible`"</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border space-y-2">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block font-sans">Union Find (DSU)</span>
                <ul className="space-y-1 text-muted-foreground text-[11px] font-sans">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> "Dynamic Connectivity (edges added)"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> "Count Connected Components"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> "Detect Cycle in Undirected Graph"</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border space-y-2">
                <span className="text-purple-400 font-bold uppercase tracking-wider block font-sans">Sweep Line</span>
                <ul className="space-y-1 text-muted-foreground text-[11px] font-sans">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> "Meeting Rooms / Max interval overlap"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> "Skyline problem / Range max overlap"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> "Event start & end timeline sorting"</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border space-y-2">
                <span className="text-cyan-400 font-bold uppercase tracking-wider block font-sans">Difference Array</span>
                <ul className="space-y-1 text-muted-foreground text-[11px] font-sans">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> "Batch range updates +D at L, -D at R+1"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> "Flight bookings / Car pooling"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> "Updates known before queries"</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border space-y-2">
                <span className="text-pink-400 font-bold uppercase tracking-wider block font-sans">State Compression DP</span>
                <ul className="space-y-1 text-muted-foreground text-[11px] font-sans">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-pink-400" /> "Small N &le; 20"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-pink-400" /> "TSP / Subset visited states"</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-pink-400" /> "Bitmask integer representation `dp[mask][u]`"</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: COMMON ADVANCED PATTERNS CATALOG */}
        <section id="patterns-catalog" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Common Advanced Patterns</h2>
              <p className="text-xs text-muted-foreground">Select a pattern card to jump into problem visualizers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patternsCatalog.map((p, idx) => (
              <Link
                key={`pat-${idx}`}
                to={`/algorithms/advanced-patterns/${p.linkId}`}
                className="group bg-card/70 border border-border/80 rounded-3xl p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-background border border-border shadow-inner">
                      {p.icon}
                    </div>
                    <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 text-xs font-mono font-bold text-primary group-hover:translate-x-1 transition-transform mt-4">
                  {p.linkText}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 7: LEARNING JOURNEY ROADMAP */}
        <section id="learning-journey" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <LayoutList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Learning Journey Roadmap</h2>
              <p className="text-xs text-muted-foreground">Recommended progression through the Advanced Patterns track</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningJourney.map((t) => (
              <Link
                key={t.id}
                to={`/algorithms/advanced-patterns/${t.id}`}
                className="group bg-card/70 border border-border/80 rounded-3xl p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Step #{t.step}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {t.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    {t.title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-4">
                  <span>Time: {t.time}</span>
                  <span className="group-hover:text-primary transition-colors font-bold">Open Visualizer →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
