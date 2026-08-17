import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Layers, Clock, 
  Sparkles, BookOpen, CheckCircle2, AlertTriangle, 
  Zap, LayoutList, Lightbulb, Workflow, Calendar,
  TrendingUp, HardDrive, ListFilter, Play
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { GreedyCoinChangeVisualizer } from '../components/visualizer/greedy/GreedyCoinChangeVisualizer';

export const GreedyIntro = () => {
  const navLinks = [
    { id: 'what-is-greedy', label: '1. What Are Greedy Algorithms?', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'why-greedy', label: '2. Why Do We Need Greedy?', icon: <Zap className="w-4 h-4" /> },
    { id: 'core-idea', label: '3. Core Greedy Idea', icon: <Workflow className="w-4 h-4" /> },
    { id: 'interactive-demo', label: '4. Interactive Demonstration', icon: <Play className="w-4 h-4" /> },
    { id: 'when-it-works', label: '5. When Greedy Works', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'when-it-fails', label: '6. When Greedy Fails (vs DP)', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'patterns', label: '7. Common Greedy Patterns', icon: <Layers className="w-4 h-4" /> },
    { id: 'interview-signals', label: '8. Interview Signals', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'learning-journey', label: '9. Learning Journey', icon: <LayoutList className="w-4 h-4" /> },
  ];

  const learningJourney = [
    { id: 'greedy-intro', step: '1', title: 'Introduction', difficulty: 'Easy', time: 'O(N)', desc: 'Core principles: local choice, global optimum, and counter-examples.' },
    { id: 'activity-selection', step: '2', title: 'Activity Selection', difficulty: 'Easy', time: 'O(N log N)', desc: 'Select maximum non-conflicting activities by sorting finish times.' },
    { id: 'fractional-knapsack', step: '3', title: 'Fractional Knapsack', difficulty: 'Easy', time: 'O(N log N)', desc: 'Maximize profit by taking items sorted by value-to-weight ratio.' },
    { id: 'job-sequencing', step: '4', title: 'Job Sequencing', difficulty: 'Medium', time: 'O(N log N)', desc: 'Schedule jobs in free slots before deadlines to maximize profit.' },
    { id: 'merge-intervals', step: '5', title: 'Intervals', difficulty: 'Medium', time: 'O(N log N)', desc: 'Merge overlapping intervals and optimize range scheduling.' },
    { id: 'jump-game', step: '6', title: 'Jump Game', difficulty: 'Medium', time: 'O(N)', desc: 'Track farthest reachable index to reach the destination in minimum steps.' },
    { id: 'reorganize-string', step: '7', title: 'Advanced Greedy', difficulty: 'Hard', time: 'O(N log K)', desc: 'Priority queues, IPO capital growth, and complex scheduling optimization.' }
  ];

  const patterns = [
    {
      title: 'Interval Scheduling',
      icon: <Calendar className="w-5 h-5 text-amber-400" />,
      desc: 'Sort intervals by end time to maximize non-overlapping selections.',
      linkId: 'activity-selection',
      linkText: 'Activity Selection & Merge Intervals →'
    },
    {
      title: 'Sorting-Based Greedy',
      icon: <ListFilter className="w-5 h-5 text-blue-400" />,
      desc: 'Sort candidates by density, ratio, or deadline before a single pass.',
      linkId: 'fractional-knapsack',
      linkText: 'Fractional Knapsack →'
    },
    {
      title: 'Priority Queue Greedy',
      icon: <HardDrive className="w-5 h-5 text-purple-400" />,
      desc: 'Dynamically extract the top min/max element as candidates update.',
      linkId: 'huffman-encoding',
      linkText: 'Huffman Encoding & Connect Ropes →'
    },
    {
      title: 'Resource Allocation',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      desc: 'Calculate peak concurrent resource usage for overlapping timelines.',
      linkId: 'minimum-platforms',
      linkText: 'Minimum Platforms & Meeting Rooms →'
    },
    {
      title: 'Scheduling Problems',
      icon: <Clock className="w-5 h-5 text-pink-400" />,
      desc: 'Order tasks with deadlines or cooldowns to minimize idle CPU time.',
      linkId: 'job-sequencing',
      linkText: 'Job Sequencing & Task Scheduler →'
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
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-amber-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Foundational Paradigm
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Greedy Algorithms
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Learn how making the best local decision at every step can sometimes lead to an optimal global solution.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => scrollTo('what-is-greedy')}
                  className="px-6 py-3 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => scrollTo('learning-journey')}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-amber-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Decision Paradigm</span>
                <span className="font-bold text-amber-400">Locally Optimal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Reversibility</span>
                <span className="font-bold text-rose-400">No Backtracking</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Typical Complexity</span>
                <span className="font-bold text-emerald-400">O(N log N) / O(N)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT ARE GREEDY ALGORITHMS? */}
        <section id="what-is-greedy" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">What Are Greedy Algorithms?</h2>
              <p className="text-xs text-muted-foreground">Simple beginner-friendly explanation</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A <strong>greedy algorithm</strong> makes the best possible decision at the current step without reconsidering previous choices or evaluating future possibilities. It focuses purely on immediate local gain to construct a solution.
          </p>
        </section>

        {/* SECTION 2: WHY DO WE NEED GREEDY? */}
        <section id="why-greedy" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Why Do We Need Greedy?</h2>
              <p className="text-xs text-muted-foreground">Common real-world and algorithmic domains</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <Calendar className="w-6 h-6 text-amber-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">1. Scheduling</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Selecting maximum non-overlapping events or meeting slots.</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <TrendingUp className="w-6 h-6 text-emerald-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">2. Optimization</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Maximizing profit or minimizing total cost efficiently.</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <HardDrive className="w-6 h-6 text-purple-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">3. Resource Allocation</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Allocating minimum platforms or CPU slots without conflicts.</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <Layers className="w-6 h-6 text-cyan-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">4. Intervals</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Merging overlapping segments or finding minimum points.</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-2xl p-5 space-y-2">
              <ListFilter className="w-6 h-6 text-pink-400 mb-1" />
              <h4 className="font-bold text-sm text-foreground">5. Priority Queues</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Dynamically picking the smallest/largest candidate in O(log N).</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: CORE GREEDY IDEA */}
        <section id="core-idea" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Core Greedy Idea</h2>
              <p className="text-xs text-muted-foreground">The sequential choice flow</p>
            </div>
          </div>

          <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-center">
              <div className="flex-1 w-full p-4 rounded-2xl bg-background/60 border border-border">
                <span className="text-xs text-muted-foreground block mb-1">Step 1</span>
                <span className="font-bold text-amber-400">Available Choices</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              <div className="flex-1 w-full p-4 rounded-2xl bg-background/60 border border-border">
                <span className="text-xs text-muted-foreground block mb-1">Step 2</span>
                <span className="font-bold text-emerald-400">Pick Best Current Choice</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              <div className="flex-1 w-full p-4 rounded-2xl bg-background/60 border border-border">
                <span className="text-xs text-muted-foreground block mb-1">Step 3</span>
                <span className="font-bold text-purple-400">Repeat Process</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              <div className="flex-1 w-full p-4 rounded-2xl bg-background/60 border border-border">
                <span className="text-xs text-muted-foreground block mb-1">Step 4</span>
                <span className="font-bold text-pink-400">Final Solution</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: INTERACTIVE DEMONSTRATION */}
        <section id="interactive-demo" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Interactive Demonstration</h2>
              <p className="text-xs text-muted-foreground">Coins = [1, 2, 5, 10], Target = 18</p>
            </div>
          </div>

          <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <GreedyCoinChangeVisualizer />
          </div>
        </section>

        {/* SECTION 5: WHEN GREEDY WORKS */}
        <section id="when-it-works" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">When Greedy Works</h2>
              <p className="text-xs text-muted-foreground">The two essential prerequisites</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs">
                Prerequisite #1
              </span>
              <h4 className="font-bold text-lg text-foreground">Greedy Choice Property</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                A global optimal solution can be arrived at by making locally optimal (greedy) choices without ruining future choices.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs">
                Prerequisite #2
              </span>
              <h4 className="font-bold text-lg text-foreground">Optimal Substructure</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                An optimal solution to the overall problem contains optimal solutions to all of its subproblems.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6: WHEN GREEDY FAILS */}
        <section id="when-it-fails" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">When Greedy Fails</h2>
              <p className="text-xs text-muted-foreground">Counter-example demonstrating why DP is necessary</p>
            </div>
          </div>

          <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Greedy Works</span>
                <h4 className="font-bold text-foreground">Coins [1, 2, 5, 10], Target = 18</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Picks 10 + 5 + 2 + 1 = <strong>4 coins</strong> (Optimal!).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase">Greedy Fails (Counter-Example)</span>
                <h4 className="font-bold text-foreground">Coins [1, 3, 4], Target = 6</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Greedy picks 4 + 1 + 1 = <strong>3 coins</strong>.<br />
                  Optimal DP picks 3 + 3 = <strong>2 coins</strong>!<br />
                  Greedy fails because picking 4 ruins the combination of two 3s. Dynamic Programming becomes necessary!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: COMMON GREEDY PATTERNS */}
        <section id="patterns" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Common Greedy Patterns</h2>
              <p className="text-xs text-muted-foreground">Select a pattern card to jump into problem visualizers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.map((p, idx) => (
              <Link
                key={`pat-${idx}`}
                to={`/algorithms/${p.linkId}`}
                className="group bg-card/70 border border-border/80 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-background border border-border shadow-inner">
                      {p.icon}
                    </div>
                    <h4 className="font-bold text-base text-foreground group-hover:text-amber-400 transition-colors">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 text-xs font-mono font-bold text-amber-400 group-hover:translate-x-1 transition-transform mt-4">
                  {p.linkText}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 8: INTERVIEW SIGNALS */}
        <section id="interview-signals" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Interview Signals</h2>
              <p className="text-xs text-muted-foreground">How to identify Greedy questions in technical rounds</p>
            </div>
          </div>

          <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Keywords to look for in interview problems:
            </span>

            <div className="flex flex-wrap gap-2.5 font-mono text-xs">
              {['maximize', 'minimize', 'scheduling', 'intervals', 'resource allocation', 'priority decisions'].map((kw) => (
                <span key={kw} className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                  "{kw}"
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: LEARNING JOURNEY */}
        <section id="learning-journey" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <LayoutList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Learning Journey</h2>
              <p className="text-xs text-muted-foreground">Recommended progression through the Greedy Algorithms track</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningJourney.map((t) => (
              <Link
                key={t.id}
                to={t.id === 'greedy-intro' ? '/explore/greedy-algorithms/intro' : `/algorithms/${t.id}`}
                className="group bg-card/70 border border-border/80 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Step #{t.step}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      t.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {t.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-amber-400 transition-colors flex items-center justify-between">
                    {t.title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-4">
                  <span>Time: {t.time}</span>
                  <span className="group-hover:text-amber-400 transition-colors font-bold">Open Visualizer →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
