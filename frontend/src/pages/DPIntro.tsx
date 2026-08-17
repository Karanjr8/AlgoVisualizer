import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Sparkles, BookOpen, 
  LayoutList, Grid, Cpu
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const DPIntro: React.FC = () => {
  const navLinks = [
    { id: 'what-is-dp', label: '1. What is Dynamic Programming?', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'memoization-vs-tabulation', label: '2. Top-Down vs Bottom-Up', icon: <Cpu className="w-4 h-4" /> },
    { id: 'patterns', label: '3. Core DP Patterns', icon: <Grid className="w-4 h-4" /> },
    { id: 'curriculum', label: '4. Curriculum Roadmap', icon: <LayoutList className="w-4 h-4" /> },
  ];

  const topics = [
    { id: 'dp-intro', title: 'Introduction to DP', difficulty: 'Easy', time: 'Varies', desc: 'Overlapping subproblems, optimal substructure, and state definition.' },
    { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', time: 'O(N)', desc: 'Classic 1D DP counting ways to reach state N.' },
    { id: 'house-robber', title: 'House Robber', difficulty: 'Medium', time: 'O(N)', desc: 'Maximum non-adjacent subarray element sum selection.' },
    { id: 'coin-change', title: 'Coin Change', difficulty: 'Medium', time: 'O(N * W)', desc: 'Minimum coin combination problem using 1D DP table.' },
    { id: 'lis', title: 'Longest Increasing Subsequence', difficulty: 'Medium', time: 'O(N²)', desc: 'Finding longest strictly increasing sub-sequence.' },
    { id: 'lcs', title: 'Longest Common Subsequence', difficulty: 'Medium', time: 'O(N * M)', desc: '2D grid DP finding matching character sequence between two strings.' },
    { id: 'knapsack-01', title: '0/1 Knapsack', difficulty: 'Medium', time: 'O(N * W)', desc: '2D DP grid maximizing total value within weight constraint.' },
    { id: 'edit-distance', title: 'Edit Distance', difficulty: 'Medium', time: 'O(N * M)', desc: 'Levenshtein distance counting insert, delete, and substitute edits.' },
    { id: 'mcm', title: 'Matrix Chain Multiplication', difficulty: 'Hard', time: 'O(N³)', desc: 'Interval DP computing optimal parenthesis evaluation order.' },
    { id: 'digit-dp', title: 'Digit DP', difficulty: 'Hard', time: 'O(Digits * States)', desc: 'Counting valid range numbers satisfying digit property constraints.' }
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-pink-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-pink-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Recursion Optimization
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Dynamic Programming
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Transform exponential $O(2^N)$ brute force recursion into polynomial $O(N)$ polynomial time by caching overlapping subproblem results.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-dp');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-pink-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-pink-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('curriculum');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-pink-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-pink-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Time Reduction</span>
                <span className="font-bold text-emerald-400">O(2ⁿ) → O(N)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Top-Down</span>
                <span className="font-bold text-pink-400">Recursion + Memoization</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Bottom-Up</span>
                <span className="font-bold text-purple-400">Iterative DP Table</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS DP? */}
        <section id="what-is-dp" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is Dynamic Programming?</h2>
              <p className="text-xs text-muted-foreground">Smart recursion with caching of redundant state evaluations</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            <strong>Dynamic Programming (DP)</strong> is an optimization technique used when a problem possesses two core characteristics: <strong>Optimal Substructure</strong> (solution can be constructed from optimal subproblem solutions) and <strong>Overlapping Subproblems</strong> (same subproblems are evaluated repeatedly).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <h4 className="font-bold text-base text-pink-400">Top-Down (Memoization)</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Write standard recursion. Before evaluating a subproblem state, check if it already exists in a lookup table/hash map. Store result before returning.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <h4 className="font-bold text-base text-pink-400">Bottom-Up (Tabulation)</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Build an iterative array/table starting from base cases <code className="font-mono text-emerald-400">dp[0]</code> up to target <code className="font-mono text-emerald-400">dp[N]</code>, eliminating recursion stack memory overhead.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: CURRICULUM ROADMAP */}
        <section id="curriculum" className="space-y-6 scroll-mt-24">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Dynamic Programming Curriculum</h2>
            <span className="text-xs font-mono text-muted-foreground">{topics.length} Interactive Topics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((t) => (
              <Link
                key={t.id}
                to={`/algorithms/${t.id}`}
                className="group bg-card/70 border border-border/80 rounded-3xl p-6 flex flex-col justify-between hover:border-pink-500/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      Dynamic Programming
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      t.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {t.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-foreground group-hover:text-pink-400 transition-colors flex items-center justify-between">
                    {t.title}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground mt-4">
                  <span>Time Complexity:</span>
                  <strong className="text-foreground">{t.time}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
