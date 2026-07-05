import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BoxSelect, Zap, Clock, Maximize, Train, LineChart } from 'lucide-react';
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
    { id: 'what-is-sliding-window', label: 'What is it?', icon: <BoxSelect className="w-4 h-4" /> },
    { id: 'brute-force', label: 'Improving Brute Force', icon: <Maximize className="w-4 h-4" /> },
    { id: 'demo', label: 'Visual Demonstration', icon: <Zap className="w-4 h-4" /> },
    { id: 'recognition', label: 'How to Recognize It', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      {/* Header */}
      <section className="w-full border-b border-border bg-card/10 relative overflow-hidden rounded-3xl mb-12">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/20 opacity-5 pointer-events-none" />
        <div className="px-6 py-12 lg:py-16 relative z-10">
          <Link to="/explore/sliding-window" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Sliding Window
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            Educational Foundation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">Introduction to Sliding Window</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Before jumping into complex string manipulations and dynamic constraints, let's understand how a simple moving window can transform a slow algorithm into a lightning-fast one.
          </p>
        </div>
      </section>

      <main className="space-y-24">
        
        {/* Section 1: What is Sliding Window? */}
        <section id="what-is-sliding-window" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BoxSelect className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">What is Sliding Window?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Sliding Window is a powerful problem-solving pattern used to reduce nested loops into a single loop. It works by maintaining a "window" (a contiguous subsegment of elements) over an array or string. As you iterate, the window "slides" forward by adding a new element on the right and removing an old element from the left.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start">
              <Train className="w-6 h-6 text-emerald-400 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Real-World Analogy</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Imagine looking through a train window. As the train moves forward, new scenery enters your view from the right, and old scenery disappears to the left. You only process what you currently see in the window.
                </p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start">
              <LineChart className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Stock Market Moving Average</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Financial analysts use a "7-day moving average" to smooth out stock prices. Instead of recalculating 7 days from scratch every day, they just add today's price and subtract the price from 8 days ago.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Why it matters (The Problem with Brute Force) */}
        <section id="brute-force" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
              <Maximize className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Improving Brute Force</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Let's say you want to find the maximum sum of any contiguous subarray of size <strong className="text-cyan-400">k = 3</strong>.
          </p>
          <div className="bg-card p-6 rounded-2xl border border-border space-y-4">
            <h4 className="font-bold text-red-400">The Brute Force Way: O(N * K)</h4>
            <p className="text-sm text-muted-foreground">
              You would calculate the sum of indices `0,1,2`. Then calculate `1,2,3` entirely from scratch. Then `2,3,4`. Notice that elements `1` and `2` were summed multiple times! This overlapping work is inefficient.
            </p>
            <h4 className="font-bold text-emerald-400 mt-6">The Sliding Window Way: O(N)</h4>
            <p className="text-sm text-muted-foreground">
              Calculate the sum of `0,1,2`. To get the next sum, simply take the previous sum, <strong className="text-red-400">subtract</strong> element `0`, and <strong className="text-emerald-400">add</strong> element `3`. You recycle your previous work!
            </p>
          </div>
        </section>

        {/* Section 3: Interactive Visual Demonstration */}
        <section id="demo" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Visual Demonstration</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Watch how the window of size 3 slides across the array. Notice how only the edges change while the middle elements remain inside the window.
          </p>

          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[100px]" />
            
            <div className="flex justify-between items-end mb-12 relative z-10">
              <div>
                <h3 className="font-bold text-lg mb-1">Maximum Sum Subarray</h3>
                <p className="text-sm text-muted-foreground">Window Size (k): <span className="text-cyan-400 font-bold px-2 py-0.5 bg-cyan-400/10 rounded">{k}</span></p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleResetDemo}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-card border border-border hover:bg-accent transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={handlePlayDemo}
                  disabled={isPlaying}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {isPlaying ? 'Sliding...' : 'Play Demo'}
                </button>
              </div>
            </div>

            <div className="flex gap-2 md:gap-4 justify-center py-12 relative z-10">
              <AnimatePresence>
                {array.map((num, i) => {
                  const isInWindow = step !== -1 && i >= step && i < step + k;
                  const isLeaving = step > 0 && i === step - 1;
                  const isEntering = step !== -1 && i === step + k - 1;

                  return (
                    <motion.div
                      key={i}
                      layout
                      className={`
                        w-12 h-16 md:w-16 md:h-20 rounded-xl flex items-center justify-center font-mono text-xl md:text-3xl font-bold shadow-lg border-2 transition-all duration-500 relative
                        ${isInWindow ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 scale-110 z-10' : 
                          'bg-card border-border text-muted-foreground/50'}
                      `}
                    >
                      {num}
                      
                      {isEntering && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-8 text-xs text-emerald-400 font-bold tracking-wider"
                        >
                          +ADD
                        </motion.div>
                      )}
                      
                      {isLeaving && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-8 text-xs text-red-400 font-bold tracking-wider"
                        >
                          -SUB
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            <div className="flex flex-col items-center justify-center h-20 relative z-10">
              {step !== -1 && (
                <>
                  <p className="text-sm text-muted-foreground mb-2">Current Window Sum</p>
                  <motion.div 
                    key={step}
                    initial={{ scale: 1.5, color: '#22d3ee' }}
                    animate={{ scale: 1, color: '#e2e8f0' }}
                    className="text-4xl font-black font-mono"
                  >
                    {getCurrentSum()}
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: How to recognize it */}
        <section id="recognition" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">How to Recognize It</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In technical interviews, certain keywords are dead giveaways that you should use a Sliding Window approach.
          </p>

          <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
            <h4 className="font-bold text-xl mb-4">Look for these keywords:</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span><strong className="text-cyan-400">"Contiguous"</strong> subarray or substring.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Finding the <strong className="text-cyan-400">"Maximum"</strong>, <strong className="text-cyan-400">"Minimum"</strong>, or <strong className="text-cyan-400">"Longest"</strong> of a segment.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>The size of the segment is either <strong className="text-cyan-400">fixed</strong> (e.g., exactly k elements) or <strong className="text-cyan-400">dynamic</strong> (e.g., sum must be less than S).</span>
              </li>
            </ul>
          </div>
        </section>

      </main>
    </WorkspaceLayout>
  );
};
