import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, SplitSquareHorizontal, MoveRight, Rabbit, Target, BookOpen, Key, MoveLeft, Lightbulb } from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

export const TwoPointersIntro = () => {
  const [learningMode, setLearningMode] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  
  // Opposite Direction Demo State
  const [opStep, setOpStep] = useState(-1);
  const [isOpPlaying, setIsOpPlaying] = useState(false);
  const opArray = [2, 7, 11, 15];
  const target = 9;

  // Same Direction Demo State
  const [sdStep, setSdStep] = useState(-1);
  const [isSdPlaying, setIsSdPlaying] = useState(false);
  const sdArray = [0, 1, 0, 3, 12];
  
  // Fast & Slow Demo State
  const [fsStep, setFsStep] = useState(-1);
  const [isFsPlaying, setIsFsPlaying] = useState(false);
  const listNodes = [1, 2, 3, 4, 5, 6];

  // Opposite Direction Engine
  useEffect(() => {
    if (isOpPlaying) {
      if (opStep < 1) { // Hardcoded for [2,7] reaching target immediately
        const timer = setTimeout(() => {
          setOpStep(prev => prev + 1);
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => setIsOpPlaying(false), 1000);
      }
    }
  }, [isOpPlaying, opStep]);

  // Same Direction Engine (Move Zeroes simulation)
  useEffect(() => {
    if (isSdPlaying) {
      if (sdStep < 5) {
        const timer = setTimeout(() => {
          setSdStep(prev => prev + 1);
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => setIsSdPlaying(false), 1000);
      }
    }
  }, [isSdPlaying, sdStep]);

  // Fast & Slow Engine
  useEffect(() => {
    if (isFsPlaying) {
      if (fsStep < 3) {
        const timer = setTimeout(() => {
          setFsStep(prev => prev + 1);
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => setIsFsPlaying(false), 1000);
      }
    }
  }, [isFsPlaying, fsStep]);

  const resetAll = () => {
    setOpStep(-1); setIsOpPlaying(false);
    setSdStep(-1); setIsSdPlaying(false);
    setFsStep(-1); setIsFsPlaying(false);
  };

  const navLinks = [
    { id: 'what-is-two-pointers', label: 'What is it?', icon: <SplitSquareHorizontal className="w-4 h-4" /> },
    { id: 'opposite-direction', label: 'Opposite Direction', icon: <Target className="w-4 h-4" /> },
    { id: 'same-direction', label: 'Same Direction', icon: <MoveRight className="w-4 h-4" /> },
    { id: 'fast-slow', label: 'Fast & Slow', icon: <Rabbit className="w-4 h-4" /> },
    { id: 'tips', label: 'Interview Tips', icon: <Lightbulb className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      {/* Header */}
      <section className="w-full border-b border-border bg-card/10 relative overflow-hidden rounded-3xl mb-12">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/20 opacity-5 pointer-events-none" />
        <div className="px-6 py-12 lg:py-16 relative z-10">
          <Link to="/explore/two-pointers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Two Pointers
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
            Educational Foundation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">The Two Pointers Pattern</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Learn how coordinating two reference points simultaneously can transform slow, nested loops into highly optimized linear-time algorithms.
          </p>
        </div>
      </section>

      <main className="space-y-24">
        
        {/* Section 1: Introduction */}
        <section id="what-is-two-pointers" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <SplitSquareHorizontal className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">What is Two Pointers?</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Two Pointers pattern involves creating two references (usually indices) that traverse a data structure together. Instead of using a nested loop to compare every element against every other element, we intelligently move one or both pointers based on specific conditions to find our answer in a single pass.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start">
              <BookOpen className="w-6 h-6 text-pink-400 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Reading a Dictionary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If you are looking for a word in a dictionary, you don't read from page 1 to 1000. You open the middle, and if the word is alphabetically earlier, your search space moves left. (Similar to Binary Search, which is a specific type of Two Pointers!)
                </p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start">
              <MoveRight className="w-6 h-6 text-emerald-400 mt-1" />
              <div>
                <h4 className="font-bold mb-1">The Race Track</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If two runners are on a track, and one runs twice as fast as the other, the faster runner will eventually lap the slower runner. This is the intuition behind Fast & Slow pointers!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Opposite Direction Demo */}
        <section id="opposite-direction" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Opposite Direction</h2>
            </div>
            {/* Learning Modes */}
            <div className="flex bg-muted p-1 rounded-lg">
              {(['beginner', 'intermediate', 'advanced'] as const).map(mode => (
                <button 
                  key={mode}
                  onClick={() => { setLearningMode(mode); resetAll(); }}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${learningMode === mode ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {learningMode === 'beginner' && "Start one pointer at the beginning and one at the end. Move them inward until they meet. This is perfect for searching pairs in sorted arrays!"}
              {learningMode === 'intermediate' && "By taking advantage of a sorted array, we can safely eliminate the entire remaining search space on the left or right simply by checking the sum of our two extremes."}
              {learningMode === 'advanced' && "This reduces the search space from O(N²) to O(N). Because the array is monotonically increasing, if sum > target, no element left of Right can possibly sum with Right to reach the target, thus we decrement Right."}
            </p>
          </div>

          {/* Interactive Player */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[100px]" />
            
            <div className="flex justify-between items-end mb-16 relative z-10">
              <div>
                <h3 className="font-bold text-lg mb-1">Two Sum II</h3>
                <p className="text-sm text-muted-foreground">Target Sum: <span className="text-pink-400 font-bold px-2 py-0.5 bg-pink-400/10 rounded">{target}</span></p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setOpStep(-1); setIsOpPlaying(false); }}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-muted border border-border hover:bg-accent transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => { setOpStep(0); setIsOpPlaying(true); }}
                  disabled={isOpPlaying}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {isOpPlaying ? 'Searching...' : 'Play Demo'}
                </button>
              </div>
            </div>

            <div className="flex gap-4 justify-center py-8 relative z-10">
              {opArray.map((num, i) => {
                const isLeft = (opStep === -1 && i === 0) || (opStep === 0 && i === 0) || (opStep === 1 && i === 0);
                const isRight = (opStep === -1 && i === opArray.length - 1) || (opStep === 0 && i === opArray.length - 1) || (opStep === 1 && i === 1);
                
                return (
                  <div key={i} className="relative">
                    <motion.div
                      layout
                      className={`
                        w-16 h-20 rounded-xl flex items-center justify-center font-mono text-3xl font-bold shadow-lg border-2 transition-all duration-500
                        ${isLeft || isRight ? 'bg-pink-500/20 border-pink-500 text-pink-500 dark:text-pink-400 scale-110' : 'bg-background border-border text-muted-foreground/50'}
                      `}
                    >
                      {num}
                    </motion.div>
                    
                    {isLeft && (
                      <motion.div layoutId="left-ptr" className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <MoveLeft className="w-5 h-5 text-pink-500 dark:text-pink-400 rotate-90" />
                        <span className="text-xs font-bold text-pink-500 dark:text-pink-400">L</span>
                      </motion.div>
                    )}
                    {isRight && (
                      <motion.div layoutId="right-ptr" className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <MoveLeft className="w-5 h-5 text-pink-500 dark:text-pink-400 rotate-90" />
                        <span className="text-xs font-bold text-pink-500 dark:text-pink-400">R</span>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation Panel */}
            <div className="mt-12 h-24 flex items-center justify-center bg-background border border-border rounded-xl p-4 text-center">
              {opStep === -1 && <span className="text-muted-foreground">Click play to watch the pointers converge towards the target sum.</span>}
              {opStep === 0 && (
                <div className="space-y-1">
                  <p className="text-sm">L points to <strong className="text-pink-500 dark:text-pink-400">2</strong>, R points to <strong className="text-pink-500 dark:text-pink-400">15</strong>.</p>
                  <p className="text-xs text-muted-foreground"><strong className="text-foreground">Sum = 17</strong>. Since 17 {'>'} 9, we need a smaller sum. <strong>Move R left.</strong></p>
                </div>
              )}
              {opStep === 1 && (
                <div className="space-y-1">
                  <p className="text-sm">L points to <strong className="text-pink-500 dark:text-pink-400">2</strong>, R points to <strong className="text-pink-500 dark:text-pink-400">7</strong>.</p>
                  <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400">Sum = 9! Target found!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Same Direction Demo */}
        <section id="same-direction" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
              <MoveRight className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Same Direction</h2>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-2xl">
            <p className="text-muted-foreground leading-relaxed">
              Both pointers start at the same side. Usually, one pointer (Fast) scans through the array to process elements, while the other pointer (Slow) marks the position where the next valid element should be placed.
            </p>
          </div>

          {/* Interactive Player */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[100px]" />
             <div className="flex justify-between items-end mb-16 relative z-10">
              <div>
                <h3 className="font-bold text-lg mb-1">Move Zeroes</h3>
                <p className="text-sm text-muted-foreground">Shift all 0s to the end while maintaining order.</p>
              </div>
              <button 
                onClick={() => { setSdStep(0); setIsSdPlaying(true); }}
                disabled={isSdPlaying}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {isSdPlaying ? 'Filtering...' : 'Play Demo'}
              </button>
            </div>
            
            <div className="flex gap-4 justify-center py-8 relative z-10">
               {sdArray.map((num, i) => {
                 let val = num;
                 // Simulate Move Zeroes logic
                 if (sdStep >= 1 && i === 0) val = 1;
                 if (sdStep >= 1 && i === 1) val = 0;
                 if (sdStep >= 3 && i === 1) val = 3;
                 if (sdStep >= 3 && i === 3) val = 0;
                 if (sdStep >= 4 && i === 2) val = 12;
                 if (sdStep >= 4 && i === 4) val = 0;

                 // Pointer positions
                 const rPos = Math.max(0, sdStep);
                 let wPos = 0;
                 if (sdStep >= 1) wPos = 1;
                 if (sdStep >= 3) wPos = 2;
                 if (sdStep >= 4) wPos = 3;
                 if (sdStep >= 5) wPos = 3; // Finished

                 const isRead = i === rPos && sdStep !== -1 && sdStep !== 5;
                 const isWrite = i === wPos && sdStep !== -1 && sdStep !== 5;

                 return (
                  <div key={i} className="relative">
                    <motion.div
                      layout
                      className={`
                        w-16 h-20 rounded-xl flex items-center justify-center font-mono text-3xl font-bold shadow-lg border-2 transition-all duration-300
                        ${val === 0 ? 'bg-muted border-border text-muted-foreground' : 'bg-background border-border'}
                        ${isRead ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''}
                        ${isWrite ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
                      `}
                    >
                      {val}
                    </motion.div>
                    
                    {isRead && (
                      <motion.div layoutId="read-ptr" className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                        <MoveLeft className="w-5 h-5 text-emerald-500 rotate-90" />
                        <span className="text-[10px] font-bold text-emerald-500">Read</span>
                      </motion.div>
                    )}
                    {isWrite && (
                      <motion.div layoutId="write-ptr" className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                        <span className="text-[10px] font-bold text-blue-500">Write</span>
                        <MoveLeft className="w-5 h-5 text-blue-500 -rotate-90" />
                      </motion.div>
                    )}
                  </div>
                );
               })}
            </div>
          </div>
        </section>

        {/* Section 4: Fast & Slow */}
        <section id="fast-slow" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 dark:text-orange-400">
              <Rabbit className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Fast & Slow (Tortoise and Hare)</h2>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-2xl">
            <p className="text-muted-foreground leading-relaxed">
              In Linked Lists or cyclical arrays, we can use a Slow pointer that moves 1 step at a time, and a Fast pointer that moves 2 steps at a time. If there is a cycle, the Fast pointer will eventually lap the Slow pointer!
            </p>
          </div>

          {/* Interactive Player */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[100px]" />
             <div className="flex justify-between items-end mb-16 relative z-10">
              <div>
                <h3 className="font-bold text-lg mb-1">Middle of Linked List</h3>
                <p className="text-sm text-muted-foreground">Fast moves 2x. When Fast reaches the end, Slow is at the middle!</p>
              </div>
              <button 
                onClick={() => { setFsStep(0); setIsFsPlaying(true); }}
                disabled={isFsPlaying}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {isFsPlaying ? 'Traversing...' : 'Play Demo'}
              </button>
            </div>
            
            <div className="flex gap-2 justify-center py-8 relative z-10">
               {listNodes.map((num, i) => {
                 let slowIdx = 0;
                 let fastIdx = 0;
                 if (fsStep >= 0) { slowIdx = fsStep; fastIdx = fsStep * 2; }
                 
                 const isSlow = i === slowIdx && fsStep !== -1;
                 const isFast = i === Math.min(fastIdx, 5) && fsStep !== -1;

                 return (
                  <div key={i} className="flex items-center">
                    <div className="relative">
                      <motion.div
                        layout
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-mono text-xl font-bold shadow-sm border-2 transition-all duration-300
                          ${isSlow ? 'bg-orange-500 text-white border-orange-500' : 'bg-background border-border'}
                          ${isFast && !isSlow ? 'ring-4 ring-orange-500/30' : ''}
                        `}
                      >
                        {num}
                      </motion.div>
                      
                      {isSlow && (
                        <motion.div layoutId="slow-ptr" className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <MoveLeft className="w-5 h-5 text-orange-500 dark:text-orange-400 rotate-90" />
                          <span className="text-[10px] font-bold text-orange-500 dark:text-orange-400">Slow</span>
                        </motion.div>
                      )}
                      {isFast && !isSlow && (
                        <motion.div layoutId="fast-ptr" className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-orange-500 dark:text-orange-400">Fast</span>
                          <MoveLeft className="w-5 h-5 text-orange-500 dark:text-orange-400 -rotate-90" />
                        </motion.div>
                      )}
                    </div>
                    {i < listNodes.length - 1 && (
                      <div className="w-4 md:w-8 h-0.5 bg-border mx-1" />
                    )}
                  </div>
                );
               })}
            </div>
          </div>
        </section>

        {/* Section 5: Recognition and Tips */}
        <section id="tips" className="space-y-8 scroll-mt-24">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold">Interview Tips & Recognition</h2>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden">
            <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-500 dark:text-blue-400"><Key className="w-5 h-5" /> Identifying the Pattern</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                <span>The array is <strong className="text-blue-500 dark:text-blue-400">Sorted</strong> and you need to find a pair/triplet (Use Opposite Direction).</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                <span>You need to modify an array <strong className="text-blue-500 dark:text-blue-400">In-Place</strong> (Use Same Direction Write/Read pointers).</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                <span>You need to find a <strong className="text-blue-500 dark:text-blue-400">Cycle</strong> or the <strong className="text-blue-500 dark:text-blue-400">Middle</strong> of a Linked List (Use Fast & Slow).</span>
              </li>
            </ul>
          </div>
        </section>

      </main>
    </WorkspaceLayout>
  );
};
