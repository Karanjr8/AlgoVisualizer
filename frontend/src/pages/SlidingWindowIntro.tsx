import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BoxSelect, Zap, Clock, Maximize, Train, LineChart, Sparkles, BookOpen } from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const SlidingWindowIntro = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const array = [2, 1, 5, 1, 3, 2];
  const k = 3;

  useEffect(() => {
    if (isPlaying) {
      if (step < array.length - k) {
        const timer = setTimeout(() => {
          setStep(prev => prev + 1);
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        setIsPlaying(false);
      }
    }
  }, [isPlaying, step, array.length, k]);

  const handlePlayDemo = () => {
    setStep(0);
    setIsPlaying(true);
  };

  const handleResetDemo = () => {
    setStep(-1);
    setIsPlaying(false);
  };

  const getCurrentSum = () => {
    if (step === -1) return 0;
    return array.slice(step, step + k).reduce((a, b) => a + b, 0);
  };

  const navLinks = [
    { id: 'what-is-sliding-window', label: '1. What is Sliding Window?', icon: <BoxSelect className="w-4 h-4" /> },
    { id: 'brute-force', label: '2. Improving Brute Force', icon: <Maximize className="w-4 h-4" /> },
    { id: 'demo', label: '3. Visual Demonstration', icon: <Zap className="w-4 h-4" /> },
    { id: 'recognition', label: '4. How to Recognize It', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-16 sm:space-y-20 text-left">
        
        {/* HERO BANNER SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/80 via-card/50 to-cyan-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-lg">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/20 opacity-15 pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> Array Optimization Pattern
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                Sliding Window Pattern
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Transform O(N²) quadratic nested loops into O(N) linear time using a dynamic moving subsegment over contiguous elements.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('what-is-sliding-window');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-cyan-500 text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-current" /> Start Learning
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('demo');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-card border border-border/80 text-foreground font-bold text-sm hover:border-cyan-500/40 transition-all"
                >
                  Explore Problems
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-background/80 border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Topic Summary
              </span>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Time Complexity</span>
                <span className="font-bold text-emerald-400">O(N) Linear</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Space Overhead</span>
                <span className="font-bold text-cyan-400">O(1) Auxiliary</span>
              </div>
              <div className="p-2.5 rounded-xl bg-card border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Primary Focus</span>
                <span className="font-bold text-purple-400">Contiguous Subarrays</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHAT IS SLIDING WINDOW? */}
        <section id="what-is-sliding-window" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              <BoxSelect className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">1. What is Sliding Window?</h2>
              <p className="text-xs text-muted-foreground">Contiguous subsegments moving incrementally</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Sliding Window is a problem-solving pattern used to eliminate redundant work in nested loops. It works by maintaining a "window" (a contiguous subsegment of elements) over an array or string. As the window moves, you add a new right element and drop an old left element in <code className="font-mono text-primary font-bold">O(1)</code> time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <Train className="w-7 h-7 text-emerald-400 mb-2" />
              <h4 className="font-bold text-base text-foreground">Train Window Analogy</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                As a train moves forward, new scenery enters your view from the right and old scenery exits to the left. You only process what is currently visible in the active frame.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-2 shadow-sm">
              <LineChart className="w-7 h-7 text-purple-400 mb-2" />
              <h4 className="font-bold text-base text-foreground">Moving Averages</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Calculating a 7-day stock price average doesn't require summing 7 days from scratch every day. Simply add today's price and subtract the price from 8 days ago!
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: BRUTE FORCE VS SLIDING WINDOW */}
        <section id="brute-force" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              <Maximize className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">2. Improving Brute Force</h2>
              <p className="text-xs text-muted-foreground">Eliminating duplicate computations across subarray overlaps</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">Brute Force O(N × K)</span>
              <h4 className="font-bold text-base text-foreground">Nested Re-summation</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                For every subarray of size K, iterate over all K elements to calculate their sum. Subarrays overlap heavily, leading to repeated addition of the exact same middle elements.
              </p>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm border-emerald-500/30">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Sliding Window O(N)</span>
              <h4 className="font-bold text-base text-foreground">Reuse Overlapping Sum</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Compute the sum of the first K elements once. For each subsequent step, subtract the outgoing element on the left and add the incoming element on the right: <code className="font-mono text-primary">newSum = oldSum - outgoing + incoming</code>.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: INTERACTIVE DEMONSTRATION */}
        <section id="demo" className="space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">3. Visual Demonstration</h2>
              <p className="text-xs text-muted-foreground">Fixed window of size K = 3 moving across array</p>
            </div>
          </div>

          <div className="bg-card/80 border border-border/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h4 className="font-bold text-base text-foreground">Sliding Window of Size K = {k}</h4>
                <p className="text-xs text-muted-foreground font-mono">
                  Current Subarray Sum: <span className="text-cyan-400 font-bold text-sm">{getCurrentSum()}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleResetDemo} className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors">
                  Reset
                </button>
                <button onClick={handlePlayDemo} disabled={isPlaying} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all">
                  {isPlaying ? 'Sliding...' : 'Play Window'}
                </button>
              </div>
            </div>

            <div className="flex gap-3 md:gap-6 justify-center py-10">
              <AnimatePresence>
                {array.map((num, i) => {
                  const isInWindow = step >= 0 && i >= step && i < step + k;

                  return (
                    <motion.div
                      key={i}
                      layout
                      className={`
                        w-14 h-20 md:w-20 md:h-24 rounded-2xl flex flex-col items-center justify-center font-mono text-xl md:text-3xl font-bold shadow-md border-2 transition-all duration-300 relative
                        ${isInWindow 
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 scale-105 shadow-cyan-500/20 ring-4 ring-cyan-500/10' 
                          : 'bg-card border-border text-muted-foreground opacity-50'}
                      `}
                    >
                      <span>{num}</span>
                      <span className="text-[10px] font-mono opacity-60 font-normal">[{i}]</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>

      </div>
    </WorkspaceLayout>
  );
};
