import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Waypoints, Network, 
  Target, Route, XCircle, LayoutList,
  Map, BrainCircuit, ShieldAlert, FileQuestion
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const BacktrackingIntro = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const category = CATEGORIES.find(c => c.id === 'backtracking');

  // Interactive Tree logic (simulating a maze choice)
  const treeFrames = [
    { text: "Start: Choose Path A or B?", status: "pending" },
    { text: "Choosing Path A...", status: "exploring" },
    { text: "Constraint Failed: Dead end!", status: "rejected" },
    { text: "Backtracking... undoing Path A", status: "backtracking" },
    { text: "Choosing Path B...", status: "exploring" },
    { text: "Valid Path! Solution Found.", status: "accepted" }
  ];

  useEffect(() => {
    if (isPlaying) {
      if (demoStep < treeFrames.length) {
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
    { id: 'what-is-backtracking', label: 'What is Backtracking?', icon: <Waypoints className="w-4 h-4" /> },
    { id: 'mechanics', label: 'The Core Mechanics', icon: <Target className="w-4 h-4" /> },
    { id: 'analogy', label: 'Real World Analogy', icon: <Map className="w-4 h-4" /> },
    { id: 'case-studies', label: 'Real Problems', icon: <Network className="w-4 h-4" /> },
    { id: 'journey', label: 'Learning Journey', icon: <LayoutList className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview Notes', icon: <FileQuestion className="w-4 h-4" /> }
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      {/* 1. Hero Section */}
      <section className="w-full border-b border-border bg-card/10 relative overflow-hidden rounded-3xl mb-12">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-500/20 opacity-10 pointer-events-none" />
        <div className="px-6 py-12 lg:py-16 relative z-10">
          <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider mb-6">
            Core Technique
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">Master Backtracking</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints.
          </p>
          <button 
            onClick={() => document.getElementById('what-is-backtracking')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            Start Learning <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <main className="space-y-24">
        
        {/* 2. What is Backtracking? */}
        <section id="what-is-backtracking" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Waypoints className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">What is Backtracking?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            While basic Recursion involves breaking down a problem into identical subproblems, Backtracking is a systematic way to iterate through all possible configurations of a search space. If the current configuration cannot yield a valid solution, you "backtrack" (undo the choice) and try another path.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                <Route className="w-4 h-4" /> 1. Choose
              </h4>
              <p className="text-sm text-muted-foreground">Make a choice and add it to your current candidate state.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                <Network className="w-4 h-4" /> 2. Explore
              </h4>
              <p className="text-sm text-muted-foreground">Recursively dive deeper into the state space tree with this new choice.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h4 className="font-bold text-rose-400 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> 3. Undo (Backtrack)
              </h4>
              <p className="text-sm text-muted-foreground">Remove the choice from the candidate state and try the next available option.</p>
            </div>
          </div>
        </section>

        {/* 3. Mechanics (Visualization) */}
        <section id="mechanics" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">The Core Mechanics: Pruning</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The power of backtracking lies in <strong>Pruning</strong>. By checking constraints early, we avoid exploring massive portions of the search space that we know are invalid.
          </p>

          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-bold flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-muted-foreground" /> State Space Tree Execution</h4>
              <div className="flex gap-2">
                <button onClick={handleReset} className="px-4 py-2 rounded-lg text-sm font-bold bg-muted hover:bg-muted/80 transition-colors">
                  Reset
                </button>
                <button onClick={handlePlay} disabled={isPlaying} className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:brightness-110 disabled:opacity-50 transition-all">
                  {isPlaying ? 'Running...' : 'Animate Tree'}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start min-h-64 border-b-4 border-border px-8 relative overflow-hidden bg-background rounded-xl p-4 space-y-2">
              <AnimatePresence>
                {treeFrames.slice(0, demoStep === 0 ? 1 : demoStep).map((frame, i) => {
                  let colorClass = "bg-card border-border text-foreground";
                  if (frame.status === 'rejected') colorClass = "bg-rose-500/10 border-rose-500/30 text-rose-400";
                  if (frame.status === 'accepted') colorClass = "bg-green-500/10 border-green-500/30 text-green-400";
                  if (frame.status === 'backtracking') colorClass = "bg-orange-500/10 border-orange-500/30 text-orange-400 opacity-70";
                  if (frame.status === 'exploring') colorClass = "bg-blue-500/10 border-blue-500/30 text-blue-400";

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`w-full max-w-md p-4 rounded-xl border-2 flex items-center shadow-sm ${colorClass}`}
                    >
                      <span className="font-mono font-bold text-sm">{frame.text}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="text-center mt-4 h-6 text-sm text-muted-foreground font-bold uppercase tracking-wider">
              {demoStep === 0 ? "Ready" : 
               demoStep < treeFrames.length ? "Exploring State Space..." : "Exploration Complete!"}
            </div>
          </div>
        </section>

        {/* 4. Real-World Analogy */}
        <section id="analogy" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Map className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">The Maze Analogy</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Imagine navigating a complex maze. When you reach a fork, you make a choice. If you hit a dead end, you don't panic—you simply turn around (backtrack) to the most recent fork and try the other path.
          </p>
          
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-inner">
             <div className="flex-1 space-y-4">
              <p className="text-muted-foreground">Every step you take is added to your <strong>current path state</strong>. Every wall you hit triggers a <strong>constraint check failure</strong>. Retracing your steps to a previous intersection is the <strong>undo</strong> action.</p>
              <p className="text-muted-foreground">You repeat this process systematically until you find the exit, guaranteeing you explore all possible valid routes without getting stuck in infinite loops.</p>
             </div>
             <div className="w-full md:w-1/3 aspect-square flex items-center justify-center text-rose-500/20">
               <Route className="w-full h-full p-8" />
             </div>
          </div>
        </section>

        {/* 5. Case Studies Section */}
        <section id="case-studies" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Backtracking in Real Problems</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Recursion module introduces some of the most famous Backtracking problems. Here is how the technique applies to them:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/algorithms/recursion/n-queens" className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group block">
              <h4 className="font-bold text-primary mb-2 text-xl">N-Queens</h4>
              <p className="text-sm text-muted-foreground mb-4">Place N queens on a board without them threatening each other.</p>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Choice:</strong> Place queen in a column.</li>
                <li><strong className="text-foreground">Constraint:</strong> Is the cell attacked?</li>
                <li><strong className="text-foreground">Pruning:</strong> Skip row/col/diag loops.</li>
              </ul>
            </Link>

            <Link to="/algorithms/recursion/sudoku-solver" className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group block">
              <h4 className="font-bold text-primary mb-2 text-xl">Sudoku Solver</h4>
              <p className="text-sm text-muted-foreground mb-4">Fill a 9x9 grid so every row, col, and 3x3 box has 1-9.</p>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Choice:</strong> Try number 1 through 9.</li>
                <li><strong className="text-foreground">Constraint:</strong> Does it violate Sudoku rules?</li>
                <li><strong className="text-foreground">Pruning:</strong> Backtrack on rule failure.</li>
              </ul>
            </Link>

            <Link to="/algorithms/recursion/rat-in-a-maze" className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors group block">
              <h4 className="font-bold text-primary mb-2 text-xl">Rat in a Maze</h4>
              <p className="text-sm text-muted-foreground mb-4">Find all paths from top-left to bottom-right avoiding obstacles.</p>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Choice:</strong> Move U/D/L/R.</li>
                <li><strong className="text-foreground">Constraint:</strong> Is cell blocked or visited?</li>
                <li><strong className="text-foreground">Pruning:</strong> Stop if out of bounds.</li>
              </ul>
            </Link>
          </div>
        </section>

        {/* 6. Learning Journey */}
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
                <h3 className="text-xl font-bold text-blue-400 mb-2">1. Combinatorial Generators</h3>
                <p className="text-muted-foreground text-sm">Learn to generate Subsets, Permutations, and Subsequences systematically without duplicates.</p>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-background" />
                <h3 className="text-xl font-bold text-emerald-400 mb-2">2. Constraints & Pruning</h3>
                <p className="text-muted-foreground text-sm">Tackle Combination Sum and its variations by aggressively pruning the search tree.</p>
              </div>

              <div className="relative pl-16">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-background" />
                <h3 className="text-xl font-bold text-purple-400 mb-2">3. Advanced Grid & Graph</h3>
                <p className="text-muted-foreground text-sm">Apply backtracking to 2D matrices (Word Search) and Graphs (M Coloring).</p>
              </div>

            </div>
          </div>
        </section>

        {/* 7. Interview Relevance & CTA */}
        <section id="interview" className="pt-12 border-t border-border scroll-mt-24">
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
            
            <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-6 relative z-10">Interview Importance</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 relative z-10">
              Identifying a Backtracking problem is usually easy: the question asks for "All combinations", "All paths", or "Generate all...". The tricky part is writing the code cleanly without duplicate states and implementing constraints efficiently to prevent Time Limit Exceeded (TLE).
            </p>
            
            <Link 
              to={category?.algorithms[0]?.id ? `/algorithms/${category.id}/${category.algorithms[0].id}` : `/explore`}
              className="inline-flex px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:scale-105 transition-transform items-center gap-3 shadow-xl relative z-10"
            >
              Start Backtracking Journey <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
    </WorkspaceLayout>
  );
};
