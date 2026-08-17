import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, ArrowDownUp, Search, Contact, 
  Database, Layers, GitMerge, ListOrdered, BarChart2,
  ShieldCheck, HelpCircle, BookOpen, Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

const MOCK_ARRAYS = {
  bubble: [
    [8, 3, 5, 1], [3, 8, 5, 1], [3, 5, 8, 1], [3, 5, 1, 8],
    [3, 5, 1, 8], [3, 1, 5, 8], [3, 1, 5, 8], [1, 3, 5, 8]
  ],
  merge: [
    [8, 3, 5, 1], [3, 8, 1, 5], [1, 3, 5, 8]
  ],
  quick: [
    [8, 3, 5, 1], [1, 3, 5, 8]
  ]
};

export const SortingIntro = () => {
  const [demoType, setDemoType] = useState<'bubble' | 'merge' | 'quick'>('bubble');
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const category = CATEGORIES.find(c => c.id === 'sorting-algorithms');

  useEffect(() => {
    if (isPlaying) {
      const frames = MOCK_ARRAYS[demoType];
      if (demoStep < frames.length - 1) {
        const timer = setTimeout(() => setDemoStep(s => s + 1), demoType === 'bubble' ? 800 : 1500);
        return () => clearTimeout(timer);
      } else {
        setIsPlaying(false);
      }
    }
  }, [isPlaying, demoStep, demoType]);

  const handlePlay = () => {
    setDemoStep(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setDemoStep(0);
    setIsPlaying(false);
  };

  const currentArray = MOCK_ARRAYS[demoType][demoStep];

  const navLinks = [
    { id: 'what-is-sorting', label: 'What is Sorting?', icon: <ArrowDownUp className="w-4 h-4" /> },
    { id: 'why-sort', label: 'Why Do We Sort?', icon: <Contact className="w-4 h-4" /> },
    { id: 'types', label: 'Types of Algorithms', icon: <Layers className="w-4 h-4" /> },
    { id: 'comparison', label: 'Comparison Overview', icon: <GitMerge className="w-4 h-4" /> },
    { id: 'demo', label: 'Interactive Demo', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'algorithms-grid', label: 'Algorithm Visualizers', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'faq', label: 'Common Questions', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-purple-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Core Algorithmic Concept
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Introduction to Sorting
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Sorting is one of the most fundamental operations in computer science. Understand what sorting is, why it's crucial, and how algorithms rearrange elements to optimize search and retrieval.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-sorting');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-purple-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('algorithms-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-purple-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Optimal Time</span>
                <span className="font-bold text-emerald-400">O(N log N)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Naive Time</span>
                <span className="font-bold text-rose-400">O(N²)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Memory Space</span>
                <span className="font-bold text-purple-400">O(1) to O(N)</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS SORTING? */}
        <section id="what-is-sorting" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <ArrowDownUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is Sorting?</h2>
              <p className="text-xs text-muted-foreground">Arranging data into meaningful numerical or lexicographical order</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Sorting is the process of arranging data into a specific, meaningful order—usually numerical (1, 2, 3...) or lexicographical (A, B, C...).
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Efficient sorting is essential for optimizing higher-level algorithms like Binary Search, Kruskal's MST, and database indexing.
              </p>
            </div>

            <div className="lg:col-span-6 bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">Unsorted Data</span>
                <div className="flex gap-2">
                  {[8, 3, 5, 1].map((n, i) => (
                    <div key={i} className="w-12 h-14 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl flex items-center justify-center text-xl font-bold font-mono">{n}</div>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground hidden sm:block" />
              <ArrowDownUp className="w-6 h-6 text-muted-foreground block sm:hidden" />
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">Sorted Data</span>
                <div className="flex gap-2">
                  {[1, 3, 5, 8].map((n, i) => (
                    <div key={i} className="w-12 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center text-xl font-bold font-mono">{n}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHY DO WE SORT? */}
        <section id="why-sort" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              <Contact className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">2. Why Do We Sort Data?</h2>
              <p className="text-xs text-muted-foreground">Every digital interface relies on sorted data to present information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-blue-500/40 transition-colors group space-y-2">
              <Contact className="w-7 h-7 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-foreground">Contact Lists</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Names arranged alphabetically so you can instantly jump to 'M'.</p>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-amber-500/40 transition-colors group space-y-2">
              <ListOrdered className="w-7 h-7 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-foreground">Leaderboards</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Players ranked from highest score to lowest score in games.</p>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-emerald-500/40 transition-colors group space-y-2">
              <Search className="w-7 h-7 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-foreground">Search Engines</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Sorting millions of web pages by relevance in milliseconds.</p>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-purple-500/40 transition-colors group space-y-2">
              <Database className="w-7 h-7 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-sm text-foreground">Databases</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">B-Trees maintain sorted indices to enable fast SQL queries.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: TYPES OF ALGORITHMS */}
        <section id="types" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">3. Categories of Sorting Algorithms</h2>
              <p className="text-xs text-muted-foreground">Naive vs Efficient Divide and Conquer paradigms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Simple / Quadratic O(N²)</span>
              <h3 className="text-lg font-bold text-foreground">Bubble, Selection, Insertion Sort</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Iterate through nested loops comparing elements. Simple to implement and operate in-place with O(1) space, but scale poorly on large datasets.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Divide & Conquer O(N log N)</span>
              <h3 className="text-lg font-bold text-foreground">Merge Sort, Quick Sort, Heap Sort</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Recursively partition arrays into smaller subproblems, solve them, and combine results. Essential for production systems handling millions of elements.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: COMPARISON OVERVIEW */}
        <section id="comparison" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">4. Comparison Overview</h2>
              <p className="text-xs text-muted-foreground">Time, space, and stability metrics</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/70 shadow-sm p-2">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-muted/50 border-b border-border text-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Algorithm</th>
                  <th className="p-4">Best Case</th>
                  <th className="p-4">Average Case</th>
                  <th className="p-4">Worst Case</th>
                  <th className="p-4">Space Complexity</th>
                  <th className="p-4">Stable?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground font-mono">
                <tr>
                  <td className="p-4 font-sans font-bold text-foreground">Bubble Sort</td>
                  <td className="p-4 text-emerald-400">O(N)</td>
                  <td className="p-4 text-rose-400">O(N²)</td>
                  <td className="p-4 text-rose-400">O(N²)</td>
                  <td className="p-4 text-emerald-400">O(1)</td>
                  <td className="p-4 text-emerald-400 font-bold">Yes</td>
                </tr>
                <tr>
                  <td className="p-4 font-sans font-bold text-foreground">Selection Sort</td>
                  <td className="p-4 text-rose-400">O(N²)</td>
                  <td className="p-4 text-rose-400">O(N²)</td>
                  <td className="p-4 text-rose-400">O(N²)</td>
                  <td className="p-4 text-emerald-400">O(1)</td>
                  <td className="p-4 text-rose-400 font-bold">No</td>
                </tr>
                <tr>
                  <td className="p-4 font-sans font-bold text-foreground">Insertion Sort</td>
                  <td className="p-4 text-emerald-400">O(N)</td>
                  <td className="p-4 text-rose-400">O(N²)</td>
                  <td className="p-4 text-rose-400">O(N²)</td>
                  <td className="p-4 text-emerald-400">O(1)</td>
                  <td className="p-4 text-emerald-400 font-bold">Yes</td>
                </tr>
                <tr className="bg-purple-500/10 font-bold text-purple-400">
                  <td className="p-4 font-sans text-foreground">Merge Sort ⭐</td>
                  <td className="p-4 text-emerald-400">O(N log N)</td>
                  <td className="p-4 text-emerald-400">O(N log N)</td>
                  <td className="p-4 text-emerald-400">O(N log N)</td>
                  <td className="p-4 text-amber-400">O(N)</td>
                  <td className="p-4 text-emerald-400 font-bold">Yes</td>
                </tr>
                <tr className="bg-amber-500/10 font-bold text-amber-400">
                  <td className="p-4 font-sans text-foreground">Quick Sort ⭐</td>
                  <td className="p-4 text-emerald-400">O(N log N)</td>
                  <td className="p-4 text-emerald-400">O(N log N)</td>
                  <td className="p-4 text-rose-400">O(N²)</td>
                  <td className="p-4 text-emerald-400">O(log N)</td>
                  <td className="p-4 text-rose-400 font-bold">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 5: INTERACTIVE DEMO */}
        <section id="demo" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">5. Interactive Step Demonstration</h2>
              <p className="text-xs text-muted-foreground">Watch state transformations step-by-step</p>
            </div>
          </div>

          <div className="bg-card/80 border border-border/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex gap-2">
                {(['bubble', 'merge', 'quick'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => { setDemoType(type); handleReset(); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      demoType === type ? 'bg-primary text-primary-foreground shadow' : 'bg-background hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {type} Sort
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={handleReset} className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">
                  Reset
                </button>
                <button onClick={handlePlay} disabled={isPlaying} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all">
                  {isPlaying ? 'Sorting...' : 'Animate Steps'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 py-8 bg-background/90 rounded-2xl border border-border">
              <AnimatePresence mode="popLayout">
                {currentArray.map((val, idx) => (
                  <motion.div
                    key={`${val}-${idx}`}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="w-14 h-16 rounded-2xl bg-primary/20 border-2 border-primary text-primary font-mono font-bold text-xl flex items-center justify-center shadow-md"
                  >
                    {val}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SECTION 6: ALGORITHM VISUALIZERS GRID */}
        <section id="algorithms-grid" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">6. Explore Sorting Visualizers</h2>
              <p className="text-xs text-muted-foreground">Select an algorithm to open the full interactive visualizer engine</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category?.algorithms.map(algo => (
              <Link 
                key={algo.id}
                to={`/algorithms/${algo.id}`}
                className="bg-card/70 border border-border/80 hover:border-primary/50 hover:bg-primary/5 rounded-3xl p-6 transition-all group flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {algo.difficulty}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">{algo.timeComplexity}</span>
                  </div>
                  <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{algo.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{algo.description}</p>
                </div>
                <div className="flex items-center text-xs font-bold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Visualizer <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
