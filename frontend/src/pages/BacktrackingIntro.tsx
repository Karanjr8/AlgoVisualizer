import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Waypoints, Network, 
  Target, Route, XCircle, LayoutList,
  Map, BrainCircuit, ShieldAlert, FileQuestion, Sparkles, BookOpen
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const BacktrackingIntro = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const category = CATEGORIES.find(c => c.id === 'backtracking');

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
  }, [isPlaying, demoStep, treeFrames.length]);

  const handlePlay = () => {
    setDemoStep(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setDemoStep(0);
    setIsPlaying(false);
  };

  const navLinks = [
    { id: 'what-is-backtracking', label: '1. What is Backtracking?', icon: <Waypoints className="w-4 h-4" /> },
    { id: 'mechanics', label: '2. Core Mechanics & Pruning', icon: <Target className="w-4 h-4" /> },
    { id: 'analogy', label: '3. Maze Analogy', icon: <Map className="w-4 h-4" /> },
    { id: 'case-studies', label: '4. Classic Problems', icon: <Network className="w-4 h-4" /> },
    { id: 'journey', label: '5. Learning Roadmap', icon: <LayoutList className="w-4 h-4" /> },
    { id: 'interview', label: '6. Interview Strategies', icon: <FileQuestion className="w-4 h-4" /> }
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-rose-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Combinatorial Search Technique
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Master Backtracking
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Backtracking is an algorithmic technique for solving constraint-satisfaction problems recursively by incrementally building solutions and discarding candidates that violate rules.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-backtracking');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-rose-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('journey');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-rose-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-rose-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">1. Choose</span>
                <span className="font-bold text-blue-400">Append state</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">2. Explore</span>
                <span className="font-bold text-emerald-400">Recurse deeper</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">3. Undo</span>
                <span className="font-bold text-rose-400">Backtrack state</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS BACKTRACKING? */}
        <section id="what-is-backtracking" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
              <Waypoints className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is Backtracking?</h2>
              <p className="text-xs text-muted-foreground">Systematic search space exploration with state restoration</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            While basic recursion breaks down a problem into identical subproblems, <strong>Backtracking</strong> systematically iterates through configurations of a state space tree. When a path violates constraints, you "backtrack" (undo your last choice) and explore alternative paths.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-blue-500/40 transition-colors shadow-sm space-y-2">
              <h4 className="font-bold text-blue-400 text-base flex items-center gap-2">
                <Route className="w-4 h-4" /> 1. Choose
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Make a candidate decision and push it onto your active choice stack.</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-emerald-500/40 transition-colors shadow-sm space-y-2">
              <h4 className="font-bold text-emerald-400 text-base flex items-center gap-2">
                <Network className="w-4 h-4" /> 2. Explore
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Recursively dive into the state space tree with the newly appended candidate.</p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-rose-500/40 transition-colors shadow-sm space-y-2">
              <h4 className="font-bold text-rose-400 text-base flex items-center gap-2">
                <XCircle className="w-4 h-4" /> 3. Undo (Backtrack)
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Remove the last choice from the candidate state and continue iteration.</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: MECHANICS & PRUNING */}
        <section id="mechanics" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">2. The Core Mechanics: Pruning</h2>
              <p className="text-xs text-muted-foreground">Cutting dead subtrees early to avoid exponential explosion</p>
            </div>
          </div>

          <div className="bg-card/80 border border-border/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-muted-foreground" /> State Space Tree Execution
              </h4>
              <div className="flex gap-2">
                <button onClick={handleReset} className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">
                  Reset
                </button>
                <button onClick={handlePlay} disabled={isPlaying} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all">
                  {isPlaying ? 'Running...' : 'Animate Tree'}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start min-h-64 border-b-4 border-border/80 px-8 relative overflow-hidden bg-background/90 rounded-2xl p-6 space-y-2">
              <AnimatePresence>
                {treeFrames.slice(0, demoStep === 0 ? 1 : demoStep).map((frame, i) => {
                  let colorClass = "bg-card border-border text-foreground";
                  if (frame.status === 'rejected') colorClass = "bg-rose-500/10 border-rose-500/40 text-rose-400";
                  if (frame.status === 'accepted') colorClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400";
                  if (frame.status === 'backtracking') colorClass = "bg-orange-500/10 border-orange-500/40 text-orange-400 opacity-80";
                  if (frame.status === 'exploring') colorClass = "bg-blue-500/10 border-blue-500/40 text-blue-400";

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`w-full max-w-md p-4 rounded-xl border-2 flex items-center shadow-sm ${colorClass}`}
                    >
                      <span className="font-mono font-bold text-xs sm:text-sm">{frame.text}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SECTION 3: CLASSIC PROBLEMS */}
        <section id="case-studies" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">3. Classic Backtracking Problems</h2>
              <p className="text-xs text-muted-foreground">Standard benchmark algorithms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/explore" className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-primary/50 transition-colors group block space-y-3 shadow-sm">
              <h4 className="font-bold text-primary text-xl">N-Queens</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Place N chess queens on an N×N board such that no two queens attack each other.</p>
              <div className="text-xs space-y-1 font-mono bg-background p-3 rounded-xl border border-border">
                <div><span className="text-muted-foreground">Choice:</span> Place queen</div>
                <div><span className="text-muted-foreground">Constraint:</span> Safe column/diag</div>
              </div>
            </Link>

            <Link to="/explore" className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-primary/50 transition-colors group block space-y-3 shadow-sm">
              <h4 className="font-bold text-primary text-xl">Sudoku Solver</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Fill a partially completed 9×9 grid so every row, column, and 3×3 box has digits 1-9.</p>
              <div className="text-xs space-y-1 font-mono bg-background p-3 rounded-xl border border-border">
                <div><span className="text-muted-foreground">Choice:</span> Try digits 1..9</div>
                <div><span className="text-muted-foreground">Constraint:</span> Valid Sudoku rules</div>
              </div>
            </Link>

            <Link to="/explore" className="bg-card/70 border border-border/80 rounded-3xl p-6 hover:border-primary/50 transition-colors group block space-y-3 shadow-sm">
              <h4 className="font-bold text-primary text-xl">Rat in a Maze</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Find all valid paths from source (0,0) to destination (N-1, N-1) avoiding obstacles.</p>
              <div className="text-xs space-y-1 font-mono bg-background p-3 rounded-xl border border-border">
                <div><span className="text-muted-foreground">Choice:</span> Move Up/Down/Left/Right</div>
                <div><span className="text-muted-foreground">Constraint:</span> Cell unblocked & unvisited</div>
              </div>
            </Link>
          </div>
        </section>

        {/* SECTION 4: CTA / INTERVIEW RELEVANCE */}
        <section id="interview" className="pt-8 border-t border-border/80 scroll-mt-24">
          <div className="bg-gradient-to-br from-rose-500/20 via-card/80 to-primary/20 border border-rose-500/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl space-y-6">
            <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">Interview Performance Note</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Backtracking problems are identifiable by prompts asking for "All Permutations", "All Combinations", or "Find all valid configurations". Focus on aggressive pruning to prevent TLE errors!
            </p>
            <Link 
              to={category?.algorithms[0]?.id ? `/algorithms/${category.id}/${category.algorithms[0].id}` : `/explore`}
              className="inline-flex px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:scale-105 transition-transform items-center gap-2 shadow-xl"
            >
              Start Backtracking Visualizers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
