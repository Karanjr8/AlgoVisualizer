import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, ArrowDownUp, Search, Contact, LayoutList, 
  Database, LineChart, Zap, Layers, GitMerge, ListOrdered, BarChart2,
  Clock, ShieldCheck, HelpCircle
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
    { id: 'how-sorting-helps', label: 'How It Helps', icon: <Zap className="w-4 h-4" /> },
    { id: 'types', label: 'Types of Algorithms', icon: <Layers className="w-4 h-4" /> },
    { id: 'comparison', label: 'Comparison Overview', icon: <GitMerge className="w-4 h-4" /> },
    { id: 'learning-path', label: 'Learning Path', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'demo', label: 'Interactive Demo', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'faq', label: 'Common Questions', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      {/* Header */}
      <section className="w-full border-b border-border bg-card/10 relative overflow-hidden rounded-3xl mb-12">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/20 opacity-5 pointer-events-none" />
        <div className="px-6 py-12 lg:py-16 relative z-10">
          <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
            Educational Foundation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">Introduction to Sorting</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Sorting is one of the most fundamental operations in computer science. Before we jump into specific algorithms, let's understand what sorting is, why it's crucial, and how it powers the modern digital world.
          </p>
        </div>
      </section>

      <main className="space-y-24">
        
        {/* Section 1: What is Sorting? */}
        <section id="what-is-sorting" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <ArrowDownUp className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">What is Sorting?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Sorting is the process of arranging data into a specific, meaningful order—usually numerical (1, 2, 3...) or lexicographical (A, B, C...).
          </p>
          
          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-center gap-8 shadow-inner">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-4">Unsorted Data</span>
              <div className="flex gap-2">
                {[8, 3, 5, 1].map((n, i) => (
                  <div key={i} className="w-12 h-16 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg flex items-center justify-center text-2xl font-bold">{n}</div>
                ))}
              </div>
            </div>
            <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
            <ArrowDownUp className="w-8 h-8 text-muted-foreground block md:hidden" />
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-4">Sorted Data</span>
              <div className="flex gap-2">
                {[1, 3, 5, 8].map((n, i) => (
                  <div key={i} className="w-12 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center justify-center text-2xl font-bold">{n}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Why Do We Sort Data? */}
        <section id="why-sort" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Contact className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Why Do We Sort Data?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Look at the apps on your phone. Almost every interface relies on sorted data. If data wasn't sorted, applications would be chaotic and unusable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-blue-500/30 transition-colors group">
              <Contact className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2">Contact Lists</h4>
              <p className="text-sm text-muted-foreground">Names arranged alphabetically so you can instantly scroll to 'M' for Mom.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-amber-500/30 transition-colors group">
              <ListOrdered className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2">Leaderboards</h4>
              <p className="text-sm text-muted-foreground">Players ranked from highest score to lowest score in video games.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-emerald-500/30 transition-colors group">
              <Search className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2">Search Engines</h4>
              <p className="text-sm text-muted-foreground">Google sorting billions of web pages by relevance in milliseconds.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-rose-500/30 transition-colors group">
              <LayoutList className="w-8 h-8 text-rose-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2">E-commerce</h4>
              <p className="text-sm text-muted-foreground">Filtering Amazon products by "Price: Low to High".</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-purple-500/30 transition-colors group">
              <Database className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2">Databases</h4>
              <p className="text-sm text-muted-foreground">SQL queries using ORDER BY to retrieve structured records.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-cyan-500/30 transition-colors group">
              <LineChart className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2">Analytics</h4>
              <p className="text-sm text-muted-foreground">Sorting financial transactions by date to show spending trends.</p>
            </div>
          </div>
        </section>

        {/* Section 3: How Does Sorting Help? */}
        <section id="how-sorting-helps" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">How Does Sorting Help?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Sorting isn't just for humans to read things easier—it's primarily for computers to <strong>search</strong> faster. When data is sorted, algorithms like Binary Search can find items in $O(\log N)$ time instead of $O(N)$.
          </p>
          <div className="bg-card border border-border rounded-3xl p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <h4 className="text-red-400 font-bold mb-2">Before Sorting (O(N))</h4>
              <p className="text-sm text-muted-foreground mb-4">Finding the number 99 in an unsorted array of 1 million items requires checking every single item one by one.</p>
              <div className="h-2 w-full bg-red-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-full animate-pulse" />
              </div>
            </div>
            <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <h4 className="text-emerald-400 font-bold mb-2">After Sorting (O(log N))</h4>
              <p className="text-sm text-muted-foreground mb-4">Finding the number 99 in a sorted array of 1 million items takes a maximum of 20 guesses using Binary Search.</p>
              <div className="h-2 w-full bg-emerald-500/20 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 w-[2%]" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Types of Sorting Algorithms */}
        <section id="types" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Types of Sorting Algorithms</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            There isn't one "perfect" sorting algorithm. Different algorithms were invented to handle different constraints (memory limits, data sizes, pre-sorted data).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category?.algorithms.slice(0, 4).map(algo => (
              <div key={algo.id} className="bg-card border border-border rounded-2xl p-5 hover:bg-card/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg">{algo.title}</h4>
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border 
                    ${algo.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      algo.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                      'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {algo.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-3 text-xs font-mono font-bold text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> {algo.timeComplexity}</span>
                  <span className="flex items-center gap-1"><Database className="w-3 h-3 text-secondary" /> {algo.spaceComplexity}</span>
                </div>
                <p className="text-sm text-muted-foreground">{algo.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Comparison Overview */}
        <section id="comparison" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
              <GitMerge className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Why So Many Algorithms?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            If Quick Sort is so fast, why does Bubble Sort exist? Because different situations require different tradeoffs.
          </p>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-bold text-primary mb-2">Simplicity (Bubble, Selection, Insertion)</h4>
              <p className="text-sm text-muted-foreground">These are $O(N^2)$ algorithms. They are terrible for large datasets, but their code is incredibly simple. Insertion Sort is actually faster than Quick Sort for tiny arrays (less than 20 items)!</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-bold text-secondary mb-2">Scale & Power (Merge, Quick)</h4>
              <p className="text-sm text-muted-foreground">These are $O(N \log N)$ Divide and Conquer algorithms. They are the backbone of modern standard libraries (like Python's `sort()` or Java's `Arrays.sort()`).</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-bold text-emerald-400 mb-2">Stability</h4>
              <p className="text-sm text-muted-foreground">A "Stable" sort keeps identical items in their original order. Merge Sort is stable, but Quick Sort is not. If you sort a list of students by Grade, and then sort by Age, a Stable sort keeps the Grades ordered within the same Age groups.</p>
            </div>
          </div>
        </section>

        {/* Section 6: Learning Path */}
        <section id="learning-path" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Recommended Learning Path</h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-12">
              
              <div className="relative pl-16">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-background" />
                <h3 className="text-xl font-bold text-green-400 mb-2">1. The Fundamentals</h3>
                <p className="text-muted-foreground mb-4">Start here to build intuition around nested loops and array swapping.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded bg-card border border-border text-sm">Bubble Sort</span>
                  <span className="px-3 py-1 rounded bg-card border border-border text-sm">Selection Sort</span>
                  <span className="px-3 py-1 rounded bg-card border border-border text-sm">Insertion Sort</span>
                </div>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-yellow-500 ring-4 ring-background" />
                <h3 className="text-xl font-bold text-yellow-400 mb-2">2. Divide & Conquer</h3>
                <p className="text-muted-foreground mb-4">Learn how recursion drastically speeds up sorting.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded bg-card border border-border text-sm">Merge Sort</span>
                  <span className="px-3 py-1 rounded bg-card border border-border text-sm">Quick Sort</span>
                </div>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-red-500 ring-4 ring-background" />
                <h3 className="text-xl font-bold text-red-400 mb-2">3. Advanced Concepts</h3>
                <p className="text-muted-foreground mb-4">Master specialized structures and non-comparison sorts.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded bg-card border border-border text-sm opacity-50">Heap Sort</span>
                  <span className="px-3 py-1 rounded bg-card border border-border text-sm opacity-50">Counting Sort</span>
                  <span className="px-3 py-1 rounded bg-card border border-border text-sm opacity-50">Radix Sort</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 7: Interactive Demonstration */}
        <section id="demo" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Same Goal, Different Strategies</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Watch how different algorithms sort the exact same array. Notice how Bubble Sort slowly bubbles items up, while Merge and Quick Sort make larger, structural changes.
          </p>

          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex gap-2 p-1 bg-card border border-border rounded-xl">
                {(['bubble', 'merge', 'quick'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setDemoType(type);
                      setDemoStep(0);
                      setIsPlaying(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                      demoType === type ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={handleReset} className="px-4 py-2 rounded-lg text-sm font-bold bg-card border border-border hover:bg-accent transition-colors">
                  Reset
                </button>
                <button onClick={handlePlay} disabled={isPlaying} className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:brightness-110 disabled:opacity-50 transition-all">
                  {isPlaying ? 'Sorting...' : 'Play Animation'}
                </button>
              </div>
            </div>

            <div className="flex gap-4 justify-center py-12">
              <AnimatePresence mode="popLayout">
                {currentArray.map((num, i) => (
                  <motion.div
                    key={`${num}`} // Use value as key for layout animations
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="w-16 h-20 rounded-xl flex items-center justify-center font-mono text-2xl font-bold bg-card border-2 border-border text-foreground shadow-lg"
                  >
                    {num}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="text-center h-8">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                {demoStep === MOCK_ARRAYS[demoType].length - 1 ? 'Sorted!' : `Step ${demoStep + 1}`}
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Common Questions */}
        <section id="faq" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Common Questions</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h4 className="font-bold text-lg mb-2">Which sorting algorithm is the "best"?</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                There is no single best algorithm. Quick Sort is generally the fastest for arrays in memory, Merge Sort is best for Linked Lists or data too large to fit in memory, and Insertion Sort is best for nearly-sorted or tiny arrays.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h4 className="font-bold text-lg mb-2">Is Bubble Sort actually used in the real world?</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Almost never. It is extremely slow. However, it is taught universally because it's the easiest algorithm to understand, acting as a stepping stone to harder concepts.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h4 className="font-bold text-lg mb-2">Do I need to write these from scratch in a job?</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No. In the real world, you will just call `array.sort()`. However, tech interviews test your ability to implement them to gauge your understanding of algorithmic logic, recursion, and time complexity.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9: Begin Learning */}
        <section id="start" className="pt-12 border-t border-border scroll-mt-24">
          <h2 className="text-3xl font-black mb-8 text-center">Ready to dive in?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category?.algorithms.map(algo => (
              <Link 
                key={algo.id}
                to={`/algorithms/${algo.id}`}
                className="p-5 bg-card border border-border hover:border-primary/50 hover:bg-primary/5 rounded-2xl transition-all group flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{algo.title}</h4>
                  <span className="text-xs text-muted-foreground font-mono">{algo.timeComplexity}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

      </main>
    </WorkspaceLayout>
  );
};
