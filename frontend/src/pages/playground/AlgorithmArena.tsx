import { useState, useMemo, useEffect } from 'react';
import { generateElements } from '../../lib/utils';
import { generateFrames } from '../../lib/algorithms';
import { useSimulation } from '../../hooks/useSimulation';
import { EngineRenderer } from '../../components/visualizer/EngineRenderer';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { Play, Pause, RotateCcw, FastForward, Swords } from 'lucide-react';
import type { AlgorithmType } from '../../types/visualizer';

export const AlgorithmArena = () => {
  const [algo1, setAlgo1] = useState<AlgorithmType>('bubble');
  const [algo2, setAlgo2] = useState<AlgorithmType>('quick');
  const [initialElements, setInitialElements] = useState(() => generateElements(15));
  
  // Shared controls for arena
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  const frames1 = useMemo(() => generateFrames(algo1, initialElements), [algo1, initialElements]);
  const frames2 = useMemo(() => generateFrames(algo2, initialElements), [algo2, initialElements]);

  // We don't use standard useSimulation's play controls because we want to sync them
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
    setInitialElements(generateElements(15));
    sim1.reset();
    sim2.reset();
  };

  const navLinks = [
    { id: 'arena', label: 'Algorithm Arena', icon: <Swords className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Algorithm Arena</h1>
        <p className="text-muted-foreground text-xl max-w-3xl">Race two algorithms side by side on the exact same dataset. Which one will finish first?</p>
      </header>

      <div className="flex flex-col gap-10">
        
        {/* Global Controls */}
        <div className="flex flex-wrap items-center justify-between gap-6 bg-card border border-border p-6 rounded-3xl shadow-lg w-full max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="px-8 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center gap-3"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              {isPlaying ? 'PAUSE RACE' : 'START RACE'}
            </button>
            <button 
              onClick={handleReset} 
              className="p-4 bg-muted text-muted-foreground rounded-2xl hover:bg-muted/80 transition-all shadow-sm active:scale-95"
              title="Reset Race"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1 max-w-sm">
            <div className="flex items-center gap-4 w-full px-4">
              <FastForward className="w-5 h-5 text-muted-foreground shrink-0" />
              <input 
                type="range" 
                min="50" max="1000" step="50"
                value={1050 - speed} 
                onChange={(e) => setSpeed(1050 - parseInt(e.target.value))}
                className="w-full cursor-pointer accent-primary h-2 bg-muted rounded-full appearance-none"
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Race Speed</span>
          </div>
          <button 
            onClick={handleRandomize} 
            className="px-6 py-4 bg-secondary text-secondary-foreground font-bold rounded-2xl hover:bg-secondary/80 transition-all shadow-sm active:scale-95"
          >
            Generate New Array
          </button>
        </div>

        {/* The Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-[1600px] mx-auto">
          
          {/* Competitor 1 */}
          <div className="bg-card border-2 border-border rounded-[2rem] p-8 shadow-2xl flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-black text-muted-foreground/30">#1</span>
              <select 
                value={algo1} 
                onChange={(e) => { setAlgo1(e.target.value as AlgorithmType); handleReset(); }}
                className="flex-1 bg-background border border-border rounded-xl p-4 outline-none focus:border-primary transition-colors text-2xl font-black tracking-tight shadow-sm"
              >
                <option value="bubble">Bubble Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="quick">Quick Sort</option>
              </select>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center min-h-[400px] bg-gradient-to-b from-transparent to-muted/20 rounded-2xl p-4 mb-8">
              <EngineRenderer algorithm={algo1} frame={sim1.currentFrame} initialElements={initialElements} />
            </div>
            
            <div className="flex justify-between items-center p-6 bg-background rounded-2xl border border-border shadow-inner">
              <div className="flex flex-col">
                <span className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-1">Operations</span>
                <span className="text-4xl font-black tabular-nums">{sim1.currentIndex + 1}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-2">Status</span>
                <div className={`text-sm font-black px-6 py-2 rounded-full tracking-wider ${sim1.currentIndex === sim1.totalFrames - 1 ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                  {sim1.currentIndex === sim1.totalFrames - 1 ? 'FINISHED' : 'RACING'}
                </div>
              </div>
            </div>
          </div>

          {/* Competitor 2 */}
          <div className="bg-card border-2 border-border rounded-[2rem] p-8 shadow-2xl flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-black text-muted-foreground/30">#2</span>
              <select 
                value={algo2} 
                onChange={(e) => { setAlgo2(e.target.value as AlgorithmType); handleReset(); }}
                className="flex-1 bg-background border border-border rounded-xl p-4 outline-none focus:border-primary transition-colors text-2xl font-black tracking-tight shadow-sm"
              >
                <option value="bubble">Bubble Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="quick">Quick Sort</option>
              </select>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center min-h-[400px] bg-gradient-to-b from-transparent to-muted/20 rounded-2xl p-4 mb-8">
              <EngineRenderer algorithm={algo2} frame={sim2.currentFrame} initialElements={initialElements} />
            </div>
            
            <div className="flex justify-between items-center p-6 bg-background rounded-2xl border border-border shadow-inner">
              <div className="flex flex-col">
                <span className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-1">Operations</span>
                <span className="text-4xl font-black tabular-nums">{sim2.currentIndex + 1}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-2">Status</span>
                <div className={`text-sm font-black px-6 py-2 rounded-full tracking-wider ${sim2.currentIndex === sim2.totalFrames - 1 ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                  {sim2.currentIndex === sim2.totalFrames - 1 ? 'FINISHED' : 'RACING'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </WorkspaceLayout>
  );
};
