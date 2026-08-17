import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, SplitSquareHorizontal, MoveRight, Rabbit, Target, BookOpen, Key, MoveLeft, Lightbulb, Sparkles } from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const TwoPointersIntro = () => {
  const [learningMode, setLearningMode] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  
  // Opposite Direction Demo State
  const [opStep, setOpStep] = useState(-1);
  const [isOpPlaying, setIsOpPlaying] = useState(false);
  const opArray = [2, 7, 11, 15];
  const target = 9;

  // Opposite Direction Engine
  useEffect(() => {
    if (isOpPlaying) {
      if (opStep < 1) {
        const timer = setTimeout(() => {
          setOpStep(prev => prev + 1);
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => setIsOpPlaying(false), 1000);
      }
    }
  }, [isOpPlaying, opStep]);

  const resetAll = () => {
    setOpStep(-1); 
    setIsOpPlaying(false);
  };

  const navLinks = [
    { id: 'what-is-two-pointers', label: '1. What is Two Pointers?', icon: <SplitSquareHorizontal className="w-4 h-4" /> },
    { id: 'opposite-direction', label: '2. Opposite Direction', icon: <Target className="w-4 h-4" /> },
    { id: 'same-direction', label: '3. Same Direction', icon: <MoveRight className="w-4 h-4" /> },
    { id: 'fast-slow', label: '4. Fast & Slow Pointers', icon: <Rabbit className="w-4 h-4" /> },
    { id: 'tips', label: '5. Interview Patterns & Tips', icon: <Lightbulb className="w-4 h-4" /> },
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
                  <Sparkles className="w-3.5 h-3.5" /> Essential Pointer Pattern
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                The Two Pointers Pattern
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Coordinating two reference pointers simultaneously transforms slow nested loops into clean linear-time algorithms.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-two-pointers');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-purple-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('opposite-direction');
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
                <span className="text-muted-foreground">Time Complexity</span>
                <span className="font-bold text-emerald-400">O(N) Linear</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Space Complexity</span>
                <span className="font-bold text-purple-400">O(1) In-Place</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Fast & Slow</span>
                <span className="font-bold text-pink-400">Cycle Detection</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS TWO POINTERS? */}
        <section id="what-is-two-pointers" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              <SplitSquareHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is Two Pointers?</h2>
              <p className="text-xs text-muted-foreground">Synchronized index references traversing arrays or lists</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            The Two Pointers pattern creates two references (usually integer array indices) that traverse a data structure concurrently. Instead of using nested loops comparing every pair in <code className="font-mono text-primary font-bold">O(N²)</code> time, we move one or both pointers based on mathematical conditions to solve problems in a single <code className="font-mono text-emerald-400 font-bold">O(N)</code> pass.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <BookOpen className="w-7 h-7 text-pink-400 mb-2" />
              <h4 className="font-bold text-base text-foreground">Dictionary Page Search</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                When searching a dictionary, you don't flip from page 1 to 1000. You hold two fingers at opposite ends and adjust toward the middle based on alphabetical ordering.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <MoveRight className="w-7 h-7 text-emerald-400 mb-2" />
              <h4 className="font-bold text-base text-foreground">Race Track Runner Analogy</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                If two runners run at different speeds on a circular track, the faster runner will eventually lap the slower runner. This is the core intuition behind Tortoise & Hare cycle detection!
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: OPPOSITE DIRECTION DEMO */}
        <section id="opposite-direction" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">2. Opposite Direction</h2>
                <p className="text-xs text-muted-foreground">Converging Left and Right pointers on sorted input</p>
              </div>
            </div>

            <div className="flex bg-muted p-1 rounded-xl">
              {(['beginner', 'intermediate', 'advanced'] as const).map(mode => (
                <button 
                  key={mode}
                  onClick={() => { setLearningMode(mode); resetAll(); }}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    learningMode === mode ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card/80 border border-border/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {learningMode === 'beginner' && "Start one pointer at index 0 and one at index N-1. Move them inward until they meet. Ideal for sorted pair searching!"}
              {learningMode === 'intermediate' && "In a sorted array, checking extreme elements allows us to safely eliminate entire search spaces without checking middle pairs."}
              {learningMode === 'advanced' && "Reduces complexity from O(N²) to O(N). If current sum > target, decrement Right pointer; if sum < target, increment Left pointer."}
            </p>

            <div className="flex justify-between items-end border-b border-border pb-4">
              <div>
                <h4 className="font-bold text-base text-foreground">Two Sum II (Sorted Array)</h4>
                <p className="text-xs text-muted-foreground font-mono">Target Sum: <span className="text-pink-400 font-bold px-2 py-0.5 bg-pink-400/10 rounded">{target}</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={resetAll} className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">
                  Reset
                </button>
                <button onClick={() => { setOpStep(0); setIsOpPlaying(true); }} disabled={isOpPlaying} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all">
                  {isOpPlaying ? 'Searching...' : 'Play Demo'}
                </button>
              </div>
            </div>

            <div className="flex gap-4 justify-center py-8">
              {opArray.map((num, i) => {
                const isLeft = (opStep === -1 && i === 0) || (opStep === 0 && i === 0) || (opStep === 1 && i === 0);
                const isRight = (opStep === -1 && i === opArray.length - 1) || (opStep === 0 && i === opArray.length - 1) || (opStep === 1 && i === 1);
                
                return (
                  <div key={i} className="relative">
                    <motion.div
                      layout
                      className={`
                        w-14 h-18 rounded-2xl flex items-center justify-center font-mono text-2xl font-bold shadow-md border-2 transition-all duration-500
                        ${isLeft || isRight ? 'bg-pink-500/20 border-pink-500 text-pink-400 scale-110' : 'bg-background border-border text-muted-foreground/50'}
                      `}
                    >
                      {num}
                    </motion.div>
                    
                    {isLeft && (
                      <motion.div layoutId="left-ptr" className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <MoveLeft className="w-4 h-4 text-pink-400 rotate-90" />
                        <span className="text-[10px] font-bold text-pink-400 font-mono">L</span>
                      </motion.div>
                    )}
                    {isRight && (
                      <motion.div layoutId="right-ptr" className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <MoveLeft className="w-4 h-4 text-pink-400 rotate-90" />
                        <span className="text-[10px] font-bold text-pink-400 font-mono">R</span>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: INTERVIEW TIPS */}
        <section id="tips" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">3. Interview Tips & Pattern Recognition</h2>
              <p className="text-xs text-muted-foreground">How to spot when Two Pointers is the optimal solution</p>
            </div>
          </div>

          <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h4 className="font-bold text-base text-foreground flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" /> Pattern Recognition Signatures
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                <span className="font-bold text-primary">1. Sorted Input</span>
                <p className="text-muted-foreground text-xs">Finding pairs, triplets, or container water boundaries in sorted arrays.</p>
              </div>
              <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                <span className="font-bold text-emerald-400">2. In-Place Array Modifications</span>
                <p className="text-muted-foreground text-xs">Remove duplicates or move zeroes with O(1) space using Read/Write pointers.</p>
              </div>
              <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
                <span className="font-bold text-orange-400">3. Cycles & Middle Elements</span>
                <p className="text-muted-foreground text-xs">Floyd's Cycle Detection and middle node traversal using Fast & Slow pointers.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
