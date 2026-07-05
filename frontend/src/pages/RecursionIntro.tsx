import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Layers, Network, 
  GitBranch, Target, RotateCcw, PackageOpen, LayoutList,
  ListTree, Puzzle, Briefcase, RefreshCw, FileQuestion
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
  }, [isPlaying, demoStep]);

  const handlePlay = () => {
    setDemoStep(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setDemoStep(0);
    setIsPlaying(false);
  };

  const navLinks = [
    { id: 'what-is-recursion', label: 'What is Recursion?', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'importance', label: 'Why it Matters', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'call-stack', label: 'The Call Stack', icon: <Layers className="w-4 h-4" /> },
    { id: 'analogy', label: 'Russian Dolls', icon: <PackageOpen className="w-4 h-4" /> },
    { id: 'applications', label: 'Applications', icon: <Network className="w-4 h-4" /> },
    { id: 'journey', label: 'Learning Journey', icon: <LayoutList className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      {/* 1. Hero Section */}
      <section className="w-full border-b border-border bg-card/10 relative overflow-hidden rounded-3xl mb-12">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/20 opacity-10 pointer-events-none" />
        <div className="px-6 py-12 lg:py-16 relative z-10">
          <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
            Core Concept
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">Master Recursion</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Recursion is the art of solving a massive problem by breaking it down into smaller, identical subproblems. Once you understand recursive thinking, complex algorithms like Trees and Dynamic Programming become incredibly simple.
          </p>
          <button 
            onClick={() => document.getElementById('what-is-recursion')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            Start Learning <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <main className="space-y-24">
        
        {/* 2. What is Recursion? */}
        <section id="what-is-recursion" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">What is Recursion?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In programming, recursion simply means a <strong>function calling itself</strong>. Instead of using a `for` or `while` loop, the function pauses its own execution, calls a fresh copy of itself to solve a smaller piece of the puzzle, and waits for that copy to finish.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> 1. The Base Case
              </h4>
              <p className="text-sm text-muted-foreground">The stopping condition. If you don't have a base case, your function will call itself forever and cause a Stack Overflow.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> 2. The Recursive Case
              </h4>
              <p className="text-sm text-muted-foreground">The part where the function actually calls itself, but with a <em>smaller</em> or <em>simpler</em> input.</p>
            </div>
          </div>
        </section>

        {/* 3. Why Learn Recursion? */}
        <section id="importance" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Why is Recursion Important?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            You can technically solve almost any problem using standard loops. So why bother with recursion? Because many data structures naturally fit the recursive model.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-green-500/30 transition-colors group">
              <ListTree className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2">Trees & Graphs</h4>
              <p className="text-sm text-muted-foreground">A tree is basically a node attached to smaller trees. Recursion makes navigating them effortless.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-purple-500/30 transition-colors group">
              <Puzzle className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2">Dynamic Programming</h4>
              <p className="text-sm text-muted-foreground">DP is fundamentally just recursion with memoization (saving previously calculated answers).</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-orange-500/30 transition-colors group">
              <GitBranch className="w-8 h-8 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2">Divide & Conquer</h4>
              <p className="text-sm text-muted-foreground">Algorithms like Merge Sort split an array, sort the halves recursively, and combine them.</p>
            </div>
          </div>
        </section>

        {/* 4. How Recursion Works (The Call Stack) */}
        <section id="call-stack" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">How it Works: The Call Stack</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            When a function calls itself, the computer places the current function on a "Stack" (a pile of memory). It keeps stacking them up until it hits the Base Case. Then, it resolves them from the top down.
          </p>

          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-bold flex items-center gap-2"><FileQuestion className="w-5 h-5 text-muted-foreground" /> Computing factorial(3)</h4>
              <div className="flex gap-2">
                <button onClick={handleReset} className="px-4 py-2 rounded-lg text-sm font-bold bg-muted hover:bg-muted/80 transition-colors">
                  Reset
                </button>
                <button onClick={handlePlay} disabled={isPlaying} className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:brightness-110 disabled:opacity-50 transition-all">
                  {isPlaying ? 'Running...' : 'Animate Stack'}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-end h-64 border-b-4 border-border px-8 relative overflow-hidden bg-background rounded-xl p-4">
              <AnimatePresence>
                {stackFrames.map((frame, i) => {
                  // Going down (pushing to stack)
                  const isVisible = demoStep > i && demoStep <= (stackFrames.length * 2 - i);
                  // Popping off stack
                  const isPopping = demoStep > stackFrames.length + (stackFrames.length - 1 - i);

                  if (!isVisible && !isPopping) return null;
                  if (isPopping && !isVisible) return null;

                  return (
                    <motion.div
                      key={frame.name}
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`w-full max-w-sm mb-2 p-4 rounded-xl border-2 flex justify-between items-center shadow-lg
                        ${i === stackFrames.length - 1 
                          ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                          : 'bg-card border-border text-foreground'}`}
                    >
                      <span className="font-mono font-bold">{frame.name}</span>
                      <span className="text-sm opacity-70">
                        {demoStep > stackFrames.length + (stackFrames.length - 2 - i) 
                          ? <span className="text-primary font-bold">Returns {frame.returnVal}</span>
                          : 'Waiting...'}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="text-center mt-4 h-6 text-sm text-muted-foreground font-bold uppercase tracking-wider">
              {demoStep === 0 ? "Ready" : 
               demoStep <= stackFrames.length ? "Building the Stack (Winding)" : 
               demoStep <= stackFrames.length * 2 ? "Returning Values (Unwinding)" : "Done!"}
            </div>
          </div>
        </section>

        {/* 5. Real-World Analogy */}
        <section id="analogy" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <PackageOpen className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">The Russian Doll Analogy</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Think of recursion like a set of <strong>Russian Nesting Dolls (Matryoshka)</strong>.
          </p>
          
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-inner">
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-bold">Opening the Dolls (Recursive Case)</h4>
                  <p className="text-sm text-muted-foreground">You want to find the tiny prize inside. You open the big doll, and inside is a slightly smaller doll. You repeat this exact same process.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-bold">The Smallest Doll (Base Case)</h4>
                  <p className="text-sm text-muted-foreground">Eventually, you hit a doll that is completely solid and cannot be opened. This is your base case. You grab the prize.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-bold">Closing them back up (Returning)</h4>
                  <p className="text-sm text-muted-foreground">Now that you have the prize, you must close up every single doll you previously opened, starting from the smallest back to the largest.</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-background rounded-xl border border-border flex items-center justify-center relative overflow-hidden">
               <div className="w-3/4 h-3/4 bg-amber-500/10 border-2 border-amber-500/30 rounded-t-[40%] rounded-b-3xl flex items-center justify-center">
                 <div className="w-3/4 h-3/4 bg-orange-500/20 border-2 border-orange-500/40 rounded-t-[40%] rounded-b-3xl flex items-center justify-center">
                   <div className="w-3/4 h-3/4 bg-red-500/30 border-2 border-red-500/50 rounded-t-[40%] rounded-b-3xl flex items-center justify-center text-xs font-bold text-red-200">
                     Base
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* 6. Applications */}
        <section id="applications" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Where is Recursion Used?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-card border border-border rounded-xl">
              <h4 className="font-bold mb-1">Tree Traversals</h4>
              <p className="text-sm text-muted-foreground">InOrder, PreOrder, and PostOrder traversals are fundamentally recursive 3-line functions.</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-xl">
              <h4 className="font-bold mb-1">Divide and Conquer</h4>
              <p className="text-sm text-muted-foreground">Merge Sort and Quick Sort split arrays in half and recursively sort them.</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-xl">
              <h4 className="font-bold mb-1">Backtracking</h4>
              <p className="text-sm text-muted-foreground">Solving Sudoku, N-Queens, or finding paths in a maze relies heavily on recursive exploration.</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-xl">
              <h4 className="font-bold mb-1">DOM Traversal</h4>
              <p className="text-sm text-muted-foreground">React and the browser itself use recursion to render nested HTML elements.</p>
            </div>
          </div>
        </section>

        {/* 7. Learning Journey */}
        <section id="journey" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <LayoutList className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Module Learning Journey</h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-10">
              
              <div className="relative pl-16">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-background" />
                <h3 className="text-xl font-bold text-blue-400 mb-2">1. Mechanics</h3>
                <p className="text-muted-foreground text-sm">Understanding the Call Stack and how memory is allocated.</p>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-background" />
                <h3 className="text-xl font-bold text-emerald-400 mb-2">2. Visualizing Recursion Trees</h3>
                <p className="text-muted-foreground text-sm">Mapping out recursive calls to calculate time constraints (like the Fibonacci tree).</p>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-background" />
                <h3 className="text-xl font-bold text-purple-400 mb-2">3. Common Patterns</h3>
                <p className="text-muted-foreground text-sm">Identifying Head vs Tail recursion, and when to pass parameters vs return values.</p>
              </div>

            </div>
          </div>
        </section>

        {/* 8. Interview Relevance & CTA */}
        <section id="cta" className="pt-12 border-t border-border scroll-mt-24">
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl md:text-4xl font-black mb-6 relative z-10">Why Top Companies Test This</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 relative z-10">
              Interviewers at MAANG don't ask recursion questions to torture you. They ask them because recursive thinking proves you can decompose a massive, complex architecture into small, manageable, repeatable components.
            </p>
            
            <Link 
              to={category?.algorithms[0]?.id ? `/algorithms/${category.id}/${category.algorithms[0].id}` : `/explore`}
              className="inline-flex px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:scale-105 transition-transform items-center gap-3 shadow-xl relative z-10"
            >
              Start Recursion Journey <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
    </WorkspaceLayout>
  );
};
