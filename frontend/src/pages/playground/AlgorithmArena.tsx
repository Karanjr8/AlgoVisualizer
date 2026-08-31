import { useState, useMemo, useEffect } from 'react';
import { generateElements } from '../../lib/utils';
import { generateFrames } from '../../lib/algorithms';
import { useSimulation } from '../../hooks/useSimulation';
import { EngineRenderer } from '../../components/visualizer/EngineRenderer';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Swords, 
  Trophy, 
  BarChart3
} from 'lucide-react';
import type { AlgorithmType } from '../../types/visualizer';

import { motion } from 'framer-motion';
import { sectionStaggerContainer, sectionFadeUp } from '../../lib/motion';

interface LeaderboardStats {
  comparisons: number;
  swaps: number;
  memory: string;
  simulatedTimeMs: number;
}

export const AlgorithmArena = () => {
  const [algo1, setAlgo1] = useState<AlgorithmType>('merge');
  const [algo2, setAlgo2] = useState<AlgorithmType>('quick');
  
  // Default to 10 elements for high readability and fast execution
  const [arraySize, setArraySize] = useState<number>(10);
  const [initialElements, setInitialElements] = useState(() => generateElements(10));
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed] = useState(300);

  const frames1 = useMemo(() => generateFrames(algo1, initialElements), [algo1, initialElements]);
  const frames2 = useMemo(() => generateFrames(algo2, initialElements), [algo2, initialElements]);

  const sim1 = useSimulation(frames1, speed, 'execution');
  const sim2 = useSimulation(frames2, speed, 'execution');

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        let active = false;
        if (sim1.currentIndex < sim1.totalFrames - 1) {
          sim1.nextStep();
          active = true;
        }
        if (sim2.currentIndex < sim2.totalFrames - 1) {
          sim2.nextStep();
          active = true;
        }
        if (!active) {
          setIsPlaying(false);
        }
      }, speed);
    }
    return () => window.clearInterval(interval);
  }, [isPlaying, sim1, sim2, speed]);

  const handleReset = () => {
    setIsPlaying(false);
    sim1.reset();
    sim2.reset();
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    const newElements = generateElements(arraySize);
    setInitialElements(newElements);
    sim1.reset();
    sim2.reset();
  };

  // Metrics Extraction Helper
  const getStats = (frames: any[], currentIdx: number): LeaderboardStats => {
    let comparisons = 0;
    let swaps = 0;
    for (let i = 0; i <= currentIdx && i < frames.length; i++) {
      const type = frames[i]?.event?.type;
      if (type === 'COMPARE') comparisons++;
      if (type === 'SWAP') swaps++;
    }
    return { 
      comparisons, 
      swaps, 
      memory: 'O(1) aux', 
      simulatedTimeMs: (currentIdx + 1) * 25 
    };
  };

  const stats1 = getStats(frames1, sim1.currentIndex);
  const stats2 = getStats(frames2, sim2.currentIndex);

  const isFinished1 = sim1.currentIndex >= sim1.totalFrames - 1;
  const isFinished2 = sim2.currentIndex >= sim2.totalFrames - 1;

  const winner = isFinished1 && !isFinished2 ? 'Competitor #1' : isFinished2 && !isFinished1 ? 'Competitor #2' : isFinished1 && isFinished2 ? (sim1.totalFrames < sim2.totalFrames ? 'Competitor #1' : 'Competitor #2') : null;

  const navLinks = [
    { id: 'algorithm-arena', label: 'Algorithm Arena', icon: <Swords className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <motion.div initial="hidden" animate="visible" variants={sectionStaggerContainer} className="w-full space-y-8 text-left pb-16">
        
        {/* HERO HEADER */}
        <motion.section variants={sectionFadeUp} className="w-full border border-border/80 bg-gradient-to-r from-card/90 via-card/50 to-rose-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">
                <Swords className="w-3.5 h-3.5" /> Race Mode & Live Leaderboard
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                Algorithm Arena
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl font-medium">
                Head-to-head algorithm races! Select two algorithms to run simultaneously on identical dataset inputs and watch the live leaderboard update.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CONTROLS BAR */}
        <motion.section variants={sectionFadeUp} className="w-full bg-card/80 border border-border/80 p-5 sm:p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="px-8 py-3.5 bg-primary text-primary-foreground font-black text-xs rounded-2xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center gap-2.5 cursor-pointer shrink-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'PAUSE RACE' : 'START RACE'}
            </button>
            <button 
              onClick={handleReset} 
              className="p-3.5 bg-muted text-muted-foreground rounded-2xl hover:bg-muted/80 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Reset Race"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRandomize} 
              className="px-5 py-3.5 bg-secondary text-secondary-foreground font-bold text-xs rounded-2xl hover:bg-secondary/80 transition-all shadow-sm cursor-pointer"
            >
              Randomize Input
            </button>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex flex-col gap-1 w-full md:w-44">
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>Array Size N</span>
                <span className="text-primary font-black">{arraySize}</span>
              </div>
              <input 
                type="range" 
                min="6" max="15" 
                value={arraySize}
                onChange={(e) => { setArraySize(parseInt(e.target.value)); handleRandomize(); }}
                className="w-full cursor-pointer accent-primary h-2 bg-muted rounded-full appearance-none"
              />
            </div>
          </div>
        </motion.section>

        {/* LIVE LEADERBOARD BANNER */}
        <motion.section variants={sectionFadeUp} className="w-full bg-card/90 border border-border/80 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase">Race Leaderboard</div>
              <div className="text-base font-black text-foreground">
                {winner ? `🏆 Winner: ${winner}!` : isPlaying ? '⚡ Race In Progress...' : 'Ready to Start'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <div>Comp #1 Steps: <span className="font-bold text-primary">{sim1.currentIndex + 1}</span></div>
            <div>Comp #2 Steps: <span className="font-bold text-cyan-400">{sim2.currentIndex + 1}</span></div>
          </div>
        </motion.section>

        {/* SPLIT SCREEN COMPETITORS */}
        <motion.section variants={sectionFadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COMPETITOR 1 */}
          <div className="bg-card/90 border border-border/80 rounded-3xl shadow-2xl p-6 space-y-6 flex flex-col justify-between relative overflow-hidden">
            {winner === 'Competitor #1' && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black uppercase rounded-full flex items-center gap-1.5 z-20">
                <Trophy className="w-4 h-4" /> Winner Card
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <label className="text-xs font-bold text-muted-foreground uppercase">Competitor #1</label>
                <select 
                  value={algo1} 
                  onChange={(e) => { setAlgo1(e.target.value as AlgorithmType); handleReset(); }}
                  className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-foreground"
                >
                  <option value="merge">Merge Sort</option>
                  <option value="quick">Quick Sort</option>
                  <option value="bubble">Bubble Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                </select>
              </div>

              {/* Visual Canvas */}
              <div className="w-full min-h-[280px] bg-background/50 border border-border/60 rounded-2xl flex items-center justify-center p-4">
                <EngineRenderer algorithm={algo1} frame={sim1.currentFrame} initialElements={initialElements} />
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-border/60 text-center">
              <div className="p-2 bg-background/80 border border-border/60 rounded-xl">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Steps</div>
                <div className="text-xs font-black text-foreground">{sim1.currentIndex + 1}</div>
              </div>
              <div className="p-2 bg-background/80 border border-border/60 rounded-xl">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Comps</div>
                <div className="text-xs font-black text-blue-400">{stats1.comparisons}</div>
              </div>
              <div className="p-2 bg-background/80 border border-border/60 rounded-xl">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Swaps</div>
                <div className="text-xs font-black text-rose-400">{stats1.swaps}</div>
              </div>
              <div className="p-2 bg-background/80 border border-border/60 rounded-xl">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Time</div>
                <div className="text-xs font-black text-emerald-400">{stats1.simulatedTimeMs}ms</div>
              </div>
            </div>
          </div>

          {/* COMPETITOR 2 */}
          <div className="bg-card/90 border border-border/80 rounded-3xl shadow-2xl p-6 space-y-6 flex flex-col justify-between relative overflow-hidden">
            {winner === 'Competitor #2' && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black uppercase rounded-full flex items-center gap-1.5 z-20">
                <Trophy className="w-4 h-4" /> Winner Card
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <label className="text-xs font-bold text-muted-foreground uppercase">Competitor #2</label>
                <select 
                  value={algo2} 
                  onChange={(e) => { setAlgo2(e.target.value as AlgorithmType); handleReset(); }}
                  className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-foreground"
                >
                  <option value="quick">Quick Sort</option>
                  <option value="merge">Merge Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="bubble">Bubble Sort</option>
                </select>
              </div>

              {/* Visual Canvas */}
              <div className="w-full min-h-[280px] bg-background/50 border border-border/60 rounded-2xl flex items-center justify-center p-4">
                <EngineRenderer algorithm={algo2} frame={sim2.currentFrame} initialElements={initialElements} />
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-border/60 text-center">
              <div className="p-2 bg-background/80 border border-border/60 rounded-xl">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Steps</div>
                <div className="text-xs font-black text-foreground">{sim2.currentIndex + 1}</div>
              </div>
              <div className="p-2 bg-background/80 border border-border/60 rounded-xl">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Comps</div>
                <div className="text-xs font-black text-blue-400">{stats2.comparisons}</div>
              </div>
              <div className="p-2 bg-background/80 border border-border/60 rounded-xl">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Swaps</div>
                <div className="text-xs font-black text-rose-400">{stats2.swaps}</div>
              </div>
              <div className="p-2 bg-background/80 border border-border/60 rounded-xl">
                <div className="text-[9px] font-bold text-muted-foreground uppercase">Time</div>
                <div className="text-xs font-black text-emerald-400">{stats2.simulatedTimeMs}ms</div>
              </div>
            </div>
          </div>

        </motion.section>

      </motion.div>
    </WorkspaceLayout>
  );
};
