import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Layers, Network, 
  GitBranch, Target, RotateCcw, PackageOpen, LayoutList,
  ListTree, Puzzle, Briefcase, RefreshCw, FileQuestion, Sparkles, BookOpen
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const RecursionIntro = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const category = CATEGORIES.find(c => c.id === 'recursion');

  // Interactive Call Stack logic
  const stackFrames = [
    { name: 'factorial(3)', returnVal: '3 * factorial(2)' },
    { name: 'factorial(2)', returnVal: '2 * factorial(1)' },
    { name: 'factorial(1)', returnVal: '1 (Base Case!)' },
  ];

  useEffect(() => {
    if (isPlaying) {
      if (demoStep < stackFrames.length * 2) {
        const timer = setTimeout(() => setDemoStep(s => s + 1), 1200);
        return () => clearTimeout(timer);
      } else {
        setIsPlaying(false);
      }
    }
  }, [isPlaying, demoStep, stackFrames.length]);

  const handlePlay = () => {
    setDemoStep(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setDemoStep(0);
    setIsPlaying(false);
  };

  const navLinks = [
    { id: 'what-is-recursion', label: '1. What is Recursion?', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'importance', label: '2. Why it Matters', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'call-stack', label: '3. The Call Stack', icon: <Layers className="w-4 h-4" /> },
    { id: 'analogy', label: '4. Russian Dolls Analogy', icon: <PackageOpen className="w-4 h-4" /> },
    { id: 'applications', label: '5. Real-World Applications', icon: <Network className="w-4 h-4" /> },
    { id: 'journey', label: '6. Learning Roadmap', icon: <LayoutList className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-indigo-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Core Algorithmic Paradigm
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Master Recursion
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Recursion is the art of solving a massive problem by breaking it down into smaller, identical subproblems. Once you master recursive thinking, Trees, Graphs, and Dynamic Programming become simple.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-recursion');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-indigo-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('journey');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-indigo-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Base Case</span>
                <span className="font-bold text-emerald-400">Stop Condition</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Recursive Case</span>
                <span className="font-bold text-indigo-400">Self Call</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Call Stack</span>
                <span className="font-bold text-amber-400">Memory Frames</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS RECURSION? */}
        <section id="what-is-recursion" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is Recursion?</h2>
              <p className="text-xs text-muted-foreground">Functions calling themselves with simplified inputs</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            In programming, recursion simply means a <strong>function calling itself</strong>. Instead of using a standard <code className="font-mono text-primary">for</code> or <code className="font-mono text-primary">while</code> loop, the function pauses its own execution, invokes a fresh copy of itself to solve a smaller piece of the puzzle, and waits for that copy to finish.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm hover:border-emerald-500/40 transition-colors">
              <h4 className="font-bold text-emerald-400 text-base flex items-center gap-2">
                <Target className="w-5 h-5" /> 1. The Base Case
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                The stopping condition. Without a base case, your function will call itself infinitely until the browser or program triggers a <strong>Stack Overflow</strong> error.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm hover:border-indigo-500/40 transition-colors">
              <h4 className="font-bold text-indigo-400 text-base flex items-center gap-2">
                <RefreshCw className="w-5 h-5" /> 2. The Recursive Case
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                The section where the function calls itself with a strictly smaller or simpler input (e.g. <code className="font-mono text-primary">N - 1</code> or <code className="font-mono text-primary">N / 2</code>).
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHY RECURSION MATTERS */}
        <section id="importance" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">2. Why Recursion Matters</h2>
              <p className="text-xs text-muted-foreground">Natural fit for recursive hierarchical data structures</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-emerald-500/40 transition-colors group space-y-2 shadow-sm">
              <ListTree className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-base text-foreground">Trees & Graphs</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">A tree is a node attached to smaller subtrees. Recursion makes traversing hierarchical structures effortless.</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-purple-500/40 transition-colors group space-y-2 shadow-sm">
              <Puzzle className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-base text-foreground">Dynamic Programming</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">DP is fundamentally recursion combined with memoization (saving previously computed subproblem results).</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-orange-500/40 transition-colors group space-y-2 shadow-sm">
              <GitBranch className="w-8 h-8 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-base text-foreground">Divide & Conquer</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Algorithms like Merge Sort split an array, sort the halves recursively, and combine them seamlessly.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE CALL STACK */}
        <section id="call-stack" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">3. How It Works: The Call Stack</h2>
              <p className="text-xs text-muted-foreground">Winding and unwinding execution stack frames</p>
            </div>
          </div>

          <div className="bg-card/80 border border-border/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-muted-foreground" /> Call Stack Execution: computing factorial(3)
              </h4>
              <div className="flex gap-2">
                <button onClick={handleReset} className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">
                  Reset
                </button>
                <button onClick={handlePlay} disabled={isPlaying} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all">
                  {isPlaying ? 'Running...' : 'Animate Call Stack'}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-end h-64 border-b-4 border-border/80 px-8 relative overflow-hidden bg-background/90 rounded-2xl p-4">
              <AnimatePresence>
                {stackFrames.map((frame, i) => {
                  const isVisible = demoStep > i && demoStep <= (stackFrames.length * 2 - i);
                  const isPopping = demoStep > stackFrames.length + (stackFrames.length - 1 - i);

                  if (!isVisible && !isPopping) return null;

                  return (
                    <motion.div
                      key={frame.name}
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`w-full max-w-sm mb-2 p-4 rounded-xl border-2 flex justify-between items-center shadow-lg
                        ${i === stackFrames.length - 1 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                          : 'bg-card border-border text-foreground'}`}
                    >
                      <span className="font-mono font-bold text-xs sm:text-sm">{frame.name}</span>
                      <span className="text-xs font-mono">
                        {demoStep > stackFrames.length + (stackFrames.length - 2 - i) 
                          ? <span className="text-primary font-bold">Returns {frame.returnVal}</span>
                          : <span className="text-muted-foreground">Waiting...</span>}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="text-center h-6 text-xs text-muted-foreground font-bold uppercase tracking-wider">
              {demoStep === 0 ? "Ready" : 
               demoStep <= stackFrames.length ? "Pushing Frames onto Stack (Winding)" : 
               demoStep <= stackFrames.length * 2 ? "Popping & Returning Values (Unwinding)" : "Execution Complete!"}
            </div>
          </div>
        </section>

        {/* SECTION 4: RUSSIAN DOLLS ANALOGY */}
        <section id="analogy" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <PackageOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">4. Russian Nesting Dolls Analogy</h2>
              <p className="text-xs text-muted-foreground">Visualizing opening nested layers down to the solid base case</p>
            </div>
          </div>

          <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 text-xs">1</div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Opening Dolls (Recursive Case)</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">You open the outer doll, only to find a smaller doll inside. You repeat the exact same opening operation.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0 text-xs">2</div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Smallest Solid Doll (Base Case)</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Eventually, you encounter a solid doll that cannot be opened. You collect the prize inside.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0 text-xs">3</div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Closing Them Up (Unwinding Stack)</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">With the prize in hand, you snap every opened doll back together from smallest back to largest.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 aspect-square bg-background/90 rounded-2xl border border-border flex items-center justify-center relative overflow-hidden p-6">
              <div className="w-full h-full bg-amber-500/10 border-2 border-amber-500/30 rounded-t-[40%] rounded-b-3xl flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-orange-500/20 border-2 border-orange-500/40 rounded-t-[40%] rounded-b-3xl flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-red-500/30 border-2 border-red-500/50 rounded-t-[40%] rounded-b-3xl flex items-center justify-center text-xs font-bold text-red-200">
                    Base Case
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: APPLICATIONS */}
        <section id="applications" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">5. Where Recursion is Used</h2>
              <p className="text-xs text-muted-foreground">Practical engineering applications of recursive logic</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-sm text-foreground">Tree Traversals</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">InOrder, PreOrder, and PostOrder traversals are elegant 3-line recursive functions.</p>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-sm text-foreground">Divide & Conquer</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Merge Sort and Quick Sort divide arrays into halves and recursively sort them.</p>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-sm text-foreground">Backtracking</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Solving Sudoku, N-Queens, or finding maze paths relies on recursive decision trees.</p>
            </div>
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-sm text-foreground font-mono">DOM Tree Rendering</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">React and browser engines use recursion to parse and render nested HTML elements.</p>
            </div>
          </div>
        </section>

        {/* SECTION 6: CTA / INTERVIEW RELEVANCE */}
        <section id="journey" className="pt-8 border-t border-border/80 scroll-mt-24">
          <div className="bg-gradient-to-br from-primary/20 via-card/80 to-indigo-500/20 border border-primary/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">Ready to Visualize Recursion in Action?</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore recursive call stack visualizers, recursion tree generators, and step-by-step trace engines in the AlgoVis Playground.
            </p>
            <Link 
              to={category?.algorithms[0]?.id ? `/algorithms/${category.id}/${category.algorithms[0].id}` : `/explore`}
              className="inline-flex px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:scale-105 transition-transform items-center gap-2 shadow-xl"
            >
              Launch Recursion Visualizer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
