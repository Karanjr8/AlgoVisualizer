import { useState, useMemo, useEffect } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { useSimulation } from '../../hooks/useSimulation';
import { generateElements, parseCustomInput } from '../../lib/utils';
import { generateFrames } from '../../lib/algorithms';
import { EngineRenderer } from '../../components/visualizer/EngineRenderer';
import { SideControls } from '../../components/visualizer/SideControls';
import { ExplanationPanel } from '../../components/visualizer/ExplanationPanel';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { 
  FlaskConical, 
  RefreshCw, 
  Settings, 
  Zap, 
  Sparkles,
  Columns,
  Square,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Gauge
} from 'lucide-react';
import type { AlgorithmType } from '../../types/visualizer';

interface AlgoMetadata {
  name: string;
  category: string;
  best: string;
  avg: string;
  worst: string;
  space: string;
  description: string;
}

const ALGO_METADATA: Partial<Record<AlgorithmType, AlgoMetadata>> = {
  bubble: {
    name: 'Bubble Sort',
    category: 'Sorting',
    best: 'O(N)',
    avg: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if out of order.'
  },
  insertion: {
    name: 'Insertion Sort',
    category: 'Sorting',
    best: 'O(N)',
    avg: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    description: 'Builds final sorted array one item at a time by inserting elements into correct position.'
  },
  selection: {
    name: 'Selection Sort',
    category: 'Sorting',
    best: 'O(N²)',
    avg: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    description: 'Repeatedly selects minimum element from unsorted portion and moves it to beginning.'
  },
  merge: {
    name: 'Merge Sort',
    category: 'Sorting',
    best: 'O(N log N)',
    avg: 'O(N log N)',
    worst: 'O(N log N)',
    space: 'O(N)',
    description: 'Divide and conquer algorithm that recursively splits array and merges sorted halves.'
  },
  quick: {
    name: 'Quick Sort',
    category: 'Sorting',
    best: 'O(N log N)',
    avg: 'O(N log N)',
    worst: 'O(N²)',
    space: 'O(log N)',
    description: 'Picks pivot element and partitions array into items smaller and larger than pivot.'
  },
  'heap-sort': {
    name: 'Heap Sort',
    category: 'Sorting',
    best: 'O(N log N)',
    avg: 'O(N log N)',
    worst: 'O(N log N)',
    space: 'O(1)',
    description: 'Converts array into Max-Heap and repeatedly extracts max element.'
  }
};

export const AlgorithmLab = () => {
  const { speed, setSpeed, mode } = useVisualizerStore();
  const [algo1, setAlgo1] = useState<AlgorithmType>('bubble');
  const [algo2, setAlgo2] = useState<AlgorithmType>('quick');
  const [isSideBySide, setIsSideBySide] = useState<boolean>(false);
  const [dataset, setDataset] = useState<string>('random');
  const [inputSize, setInputSize] = useState<number>(10);
  const [customVal, setCustomVal] = useState('');

  // Dual Playback State for Side-by-Side Mode
  const [isPlayingSideBySide, setIsPlayingSideBySide] = useState(false);

  // Default to 10 elements for optimal readability & scaling
  const [initialElements, setInitialElements] = useState(() => generateElements(10, 'random'));

  const meta1: AlgoMetadata = ALGO_METADATA[algo1] || {
    name: 'Bubble Sort',
    category: 'Sorting',
    best: 'O(N)',
    avg: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    description: 'Sorting algorithm'
  };

  const meta2: AlgoMetadata = ALGO_METADATA[algo2] || {
    name: 'Quick Sort',
    category: 'Sorting',
    best: 'O(N log N)',
    avg: 'O(N log N)',
    worst: 'O(N²)',
    space: 'O(log N)',
    description: 'Sorting algorithm'
  };

  const handleApplySetup = () => {
    setIsPlayingSideBySide(false);
    if (dataset === 'custom') {
      const parsed = parseCustomInput(customVal);
      if (parsed && parsed.length > 0) {
        setInitialElements(generateElements(Math.min(parsed.length, 15), 'custom', parsed));
      }
    } else {
      setInitialElements(generateElements(inputSize, dataset as any));
    }
  };

  useEffect(() => {
    setIsPlayingSideBySide(false);
    setInitialElements(generateElements(inputSize, dataset as any));
  }, [algo1, algo2, inputSize]);

  const frames1 = useMemo(() => generateFrames(algo1, initialElements), [algo1, initialElements]);
  const frames2 = useMemo(() => generateFrames(algo2, initialElements), [algo2, initialElements]);

  const sim1 = useSimulation(frames1, speed, mode);
  const sim2 = useSimulation(frames2, speed, mode);

  // Side-by-Side Dual Playback Loop
  useEffect(() => {
    let interval: number;
    if (isPlayingSideBySide) {
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
          setIsPlayingSideBySide(false);
        }
      }, speed);
    }
    return () => window.clearInterval(interval);
  }, [isPlayingSideBySide, sim1, sim2, speed]);

  const handleResetSideBySide = () => {
    setIsPlayingSideBySide(false);
    sim1.reset();
    sim2.reset();
  };

  // Calculate live metrics
  const getMetrics = (frames: any[], currentIdx: number) => {
    let comparisons = 0;
    let swaps = 0;
    for (let i = 0; i <= currentIdx && i < frames.length; i++) {
      const type = frames[i]?.event?.type;
      if (type === 'COMPARE') comparisons++;
      if (type === 'SWAP') swaps++;
    }
    return { comparisons, swaps };
  };

  const metrics1 = getMetrics(frames1, sim1.currentIndex);
  const metrics2 = getMetrics(frames2, sim2.currentIndex);

  const navLinks = [
    { id: 'algorithm-lab', label: 'Algorithm Lab', icon: <FlaskConical className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-8 text-left pb-16">
        
        {/* HERO HEADER */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/90 via-card/50 to-blue-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                <FlaskConical className="w-3.5 h-3.5" /> Experimentation Sandbox
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                Algorithm Laboratory
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl font-medium">
                Test sorting algorithms under different dataset distributions. Toggle Side-by-Side mode to compare two algorithms live on the exact same dataset.
              </p>
            </div>

            {/* Side-by-Side Mode Toggle */}
            <div className="flex items-center gap-2 bg-background/80 border border-border p-1.5 rounded-2xl shadow-inner shrink-0">
              <button
                onClick={() => { setIsSideBySide(false); setIsPlayingSideBySide(false); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${!isSideBySide ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Square className="w-4 h-4" /> Single View
              </button>
              <button
                onClick={() => setIsSideBySide(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${isSideBySide ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Columns className="w-4 h-4" /> Side-by-Side Mode
              </button>
            </div>
          </div>
        </section>

        {/* SETUP CONTROLS BAR */}
        <section className="w-full bg-card/80 border border-border/80 p-5 sm:p-6 rounded-3xl shadow-lg flex flex-col lg:flex-row items-end gap-6">
          
          {/* Primary Algorithm */}
          <div className="w-full lg:w-1/4 flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-primary" /> {isSideBySide ? 'Algorithm #1' : 'Algorithm'}
            </label>
            <select 
              value={algo1} 
              onChange={(e) => setAlgo1(e.target.value as AlgorithmType)}
              className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary transition-colors font-bold text-xs shadow-sm text-foreground"
            >
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
              <option value="heap-sort">Heap Sort</option>
            </select>
          </div>

          {/* Secondary Algorithm (Side-by-Side Mode) */}
          {isSideBySide && (
            <div className="w-full lg:w-1/4 flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-cyan-400" /> Algorithm #2
              </label>
              <select 
                value={algo2} 
                onChange={(e) => setAlgo2(e.target.value as AlgorithmType)}
                className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary transition-colors font-bold text-xs shadow-sm text-foreground"
              >
                <option value="quick">Quick Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
                <option value="bubble">Bubble Sort</option>
                <option value="heap-sort">Heap Sort</option>
              </select>
            </div>
          )}

          {/* Dataset Type */}
          <div className="w-full lg:w-1/4 flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dataset Type</label>
            <select 
              value={dataset} 
              onChange={(e) => setDataset(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary transition-colors font-bold text-xs shadow-sm text-foreground"
            >
              <option value="random">Random Order</option>
              <option value="reverse-sorted">Reverse Sorted (Worst Case)</option>
              <option value="nearly-sorted">Nearly Sorted</option>
              <option value="duplicates-heavy">Duplicate Heavy</option>
              <option value="custom">Custom Input Array</option>
            </select>
          </div>

          {/* Array Size Slider (Default 10, Range 5 to 15) */}
          {dataset !== 'custom' ? (
            <div className="w-full lg:w-1/4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <span>Array Size N</span>
                <span className="text-primary font-black text-xs">{inputSize} elements</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="15" 
                value={inputSize}
                onChange={(e) => setInputSize(parseInt(e.target.value))}
                className="w-full cursor-pointer accent-primary h-2 bg-muted rounded-full appearance-none my-auto"
              />
            </div>
          ) : (
            <div className="w-full lg:w-1/4 flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Custom Array (comma separated)</label>
              <input 
                type="text" 
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                placeholder="e.g. 45, 12, 89, 23, 7"
                className="w-full bg-background border border-border rounded-xl p-3 outline-none focus:border-primary transition-colors font-mono text-xs shadow-sm"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="w-full lg:w-auto flex items-center gap-3 shrink-0">
            <button 
              onClick={handleApplySetup}
              className="w-full lg:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-xs shadow-md hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Apply Setup
            </button>
          </div>
        </section>

        {/* SINGLE VIEW vs SIDE-BY-SIDE VIEW */}
        {!isSideBySide ? (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Visualizer Canvas */}
            <div className="lg:col-span-8 bg-card rounded-3xl border border-border/80 shadow-2xl overflow-hidden flex flex-col relative min-h-[460px]">
              <div className="flex-1 w-full flex flex-col items-center justify-center p-6 relative bg-gradient-to-b from-transparent to-background/60">
                <div className="flex-1 w-full flex items-center justify-center min-h-[320px] z-10">
                  <EngineRenderer algorithm={algo1} frame={sim1.currentFrame} initialElements={initialElements} />
                </div>
                <div className="w-full max-w-3xl mx-auto mt-4 z-20">
                  <SideControls simulation={sim1} algorithm={algo1} />
                </div>
              </div>
            </div>

            {/* Right Live Metrics & Theory */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 bg-card/90 border border-border/80 rounded-3xl shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="font-black text-base text-foreground">{meta1.name} Info</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase">
                    {meta1.category}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {meta1.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Best Case</div>
                    <div className="text-xs font-black text-emerald-400 font-mono">{meta1.best}</div>
                  </div>
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Average Case</div>
                    <div className="text-xs font-black text-blue-400 font-mono">{meta1.avg}</div>
                  </div>
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Worst Case</div>
                    <div className="text-xs font-black text-rose-400 font-mono">{meta1.worst}</div>
                  </div>
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Space</div>
                    <div className="text-xs font-black text-purple-400 font-mono">{meta1.space}</div>
                  </div>
                </div>
              </div>

              {/* Live Metrics Card */}
              <div className="p-6 bg-card/90 border border-border/80 rounded-3xl shadow-lg space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="font-black text-base text-foreground">Live Execution Metrics</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-1 text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Comparisons</div>
                    <div className="text-lg font-black text-blue-400">{metrics1.comparisons}</div>
                  </div>
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-1 text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Swaps</div>
                    <div className="text-lg font-black text-rose-400">{metrics1.swaps}</div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        ) : (
          /* SIDE-BY-SIDE DUAL VIEW */
          <section className="space-y-6">
            
            {/* UNIFIED DUAL PLAYBACK CONTROL BAR */}
            <div className="w-full bg-card/90 border border-border/80 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
              
              {/* Combined Play/Pause & Step Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-start">
                <button
                  onClick={() => setIsPlayingSideBySide(!isPlayingSideBySide)}
                  className="px-7 py-3 bg-primary text-primary-foreground font-black text-xs rounded-xl shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isPlayingSideBySide ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5" />}
                  {isPlayingSideBySide ? 'Pause Algorithms' : 'Start All Algorithms'}
                </button>

                <div className="flex items-center gap-1.5 bg-background/80 border border-border p-1 rounded-xl">
                  <button
                    onClick={() => {
                      if (sim1.currentIndex > 0) sim1.prevStep();
                      if (sim2.currentIndex > 0) sim2.prevStep();
                    }}
                    className="p-2.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    title="Step Back All Algorithms"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (sim1.currentIndex < sim1.totalFrames - 1) sim1.nextStep();
                      if (sim2.currentIndex < sim2.totalFrames - 1) sim2.nextStep();
                    }}
                    className="p-2.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    title="Step Forward All Algorithms"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleResetSideBySide}
                    className="p-2.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer text-rose-400"
                    title="Reset All Algorithms"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Speed & Progress Stats */}
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border/60 pt-3 md:pt-0">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Gauge className="w-4 h-4 text-primary" />
                  <span className="hidden sm:inline">Speed:</span>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={1050 - speed}
                    onChange={(e) => setSpeed(1050 - parseInt(e.target.value))}
                    className="w-24 accent-primary cursor-pointer h-1.5 bg-muted rounded-full appearance-none"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs font-mono font-bold text-muted-foreground bg-background/60 px-3 py-1.5 border border-border/60 rounded-xl">
                  <span>{meta1.name}: <strong className="text-primary">{sim1.currentIndex + 1}/{sim1.totalFrames}</strong></span>
                  <span>{meta2.name}: <strong className="text-cyan-400">{sim2.currentIndex + 1}/{sim2.totalFrames}</strong></span>
                </div>
              </div>
            </div>

            {/* DUAL CANVAS CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Algorithm 1 Canvas */}
              <div className="bg-card/90 border border-border/80 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <h3 className="font-black text-lg text-foreground">{meta1.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary">{meta1.avg}</span>
                </div>

                <div className="w-full min-h-[280px] bg-background/50 border border-border/60 rounded-2xl flex items-center justify-center p-4">
                  <EngineRenderer algorithm={algo1} frame={sim1.currentFrame} initialElements={initialElements} />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                  <div className="p-2.5 bg-background/80 border border-border/60 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Step</div>
                    <div className="text-xs font-black text-foreground">{sim1.currentIndex + 1} / {sim1.totalFrames}</div>
                  </div>
                  <div className="p-2.5 bg-background/80 border border-border/60 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Comparisons</div>
                    <div className="text-xs font-black text-blue-400">{metrics1.comparisons}</div>
                  </div>
                  <div className="p-2.5 bg-background/80 border border-border/60 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Swaps</div>
                    <div className="text-xs font-black text-rose-400">{metrics1.swaps}</div>
                  </div>
                </div>
              </div>

              {/* Algorithm 2 Canvas */}
              <div className="bg-card/90 border border-border/80 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400" />
                    <h3 className="font-black text-lg text-foreground">{meta2.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">{meta2.avg}</span>
                </div>

                <div className="w-full min-h-[280px] bg-background/50 border border-border/60 rounded-2xl flex items-center justify-center p-4">
                  <EngineRenderer algorithm={algo2} frame={sim2.currentFrame} initialElements={initialElements} />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                  <div className="p-2.5 bg-background/80 border border-border/60 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Step</div>
                    <div className="text-xs font-black text-foreground">{sim2.currentIndex + 1} / {sim2.totalFrames}</div>
                  </div>
                  <div className="p-2.5 bg-background/80 border border-border/60 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Comparisons</div>
                    <div className="text-xs font-black text-blue-400">{metrics2.comparisons}</div>
                  </div>
                  <div className="p-2.5 bg-background/80 border border-border/60 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Swaps</div>
                    <div className="text-xs font-black text-rose-400">{metrics2.swaps}</div>
                  </div>
                </div>
              </div>

            </div>

          </section>
        )}

        {/* BOTTOM EXPLANATION PANEL */}
        <section className="w-full">
          <ExplanationPanel 
            frame={sim1.currentFrame} 
            currentIndex={sim1.currentIndex} 
            totalFrames={sim1.totalFrames} 
          />
        </section>

      </div>
    </WorkspaceLayout>
  );
};
