import { useState, useMemo, useEffect } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { useSimulation } from '../../hooks/useSimulation';
import { generateElements, parseCustomInput } from '../../lib/utils';
import { generateFrames } from '../../lib/algorithms';
import { EngineRenderer } from '../../components/visualizer/EngineRenderer';
import { SideControls } from '../../components/visualizer/SideControls';
import { ExplanationPanel } from '../../components/visualizer/ExplanationPanel';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { RefreshCw, PlayCircle, Settings } from 'lucide-react';
import type { AlgorithmType } from '../../types/visualizer';

export const AlgorithmLab = () => {
  const { initialElements, setInitialElements, speed, mode } = useVisualizerStore();
  const [algo, setAlgo] = useState<AlgorithmType>('bubble');
  const [dataset, setDataset] = useState<string>('random');
  const [customVal, setCustomVal] = useState('');

  const handleGenerate = () => {
    if (dataset === 'custom') {
      const parsed = parseCustomInput(customVal);
      if (parsed) setInitialElements(generateElements(parsed.length, 'custom', parsed));
    } else {
      setInitialElements(generateElements(15, dataset as any));
    }
  };

  useEffect(() => {
    if (initialElements.length === 0) {
      setInitialElements(generateElements(15, 'random'));
    }
  }, [initialElements, setInitialElements]);

  const frames = useMemo(() => generateFrames(algo, initialElements), [algo, initialElements]);
  const simulation = useSimulation(frames, speed, mode);

  const navLinks = [
    { id: 'lab', label: 'Algorithm Lab', icon: <PlayCircle className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Algorithm Laboratory</h1>
        <p className="text-muted-foreground text-xl max-w-3xl">Freely experiment with any algorithm and input type. No timers. No scores. Pure exploration.</p>
      </header>

      <div className="flex flex-col gap-10">
        {/* Top Control Bar */}
        <div className="w-full bg-card border border-border p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-end gap-6">
          <div className="w-full md:w-1/3 flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" /> Algorithm
            </label>
            <select 
              value={algo} 
              onChange={(e) => setAlgo(e.target.value as AlgorithmType)}
              className="w-full bg-background border border-border rounded-xl p-4 outline-none focus:border-primary transition-colors font-bold text-base shadow-sm"
            >
              <option value="bubble">Bubble Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
              <option value="linearSearch">Linear Search</option>
              <option value="binarySearch">Binary Search</option>
            </select>
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dataset Type</label>
            <select 
              value={dataset} 
              onChange={(e) => setDataset(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-4 outline-none focus:border-primary transition-colors font-bold text-base shadow-sm"
            >
              <option value="random">Random</option>
              <option value="reverse-sorted">Reverse Sorted</option>
              <option value="nearly-sorted">Nearly Sorted</option>
              <option value="duplicates-heavy">Many Duplicates</option>
              <option value="custom">Custom Input</option>
            </select>
          </div>

          {dataset === 'custom' && (
            <div className="w-full md:w-1/3 flex flex-col gap-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Custom Array (comma separated)</label>
              <input 
                type="text" 
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                placeholder="e.g. 5, 2, 9, 1, 5"
                className="w-full bg-background border border-border rounded-xl p-4 outline-none focus:border-primary transition-colors font-mono text-sm shadow-sm"
              />
            </div>
          )}

          <div className="w-full md:w-auto flex-shrink-0">
            <button 
              onClick={handleGenerate}
              className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-black shadow-md hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Apply Setup
            </button>
          </div>
        </div>

        {/* Massive Visualization Panel */}
        <div className="w-full bg-card rounded-[2rem] border border-border shadow-2xl overflow-hidden flex flex-col relative min-h-[500px]">
          <div className="flex-1 w-full flex flex-col items-center justify-center p-8 relative bg-gradient-to-b from-transparent to-background/50">
            <div className="flex-1 w-full flex items-center justify-center min-h-[400px] z-10">
              <EngineRenderer algorithm={algo} frame={simulation.currentFrame} initialElements={initialElements} />
            </div>
            <div className="w-full max-w-4xl mx-auto mt-8 z-20">
              <SideControls simulation={simulation} algorithm={algo} />
            </div>
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="w-full mt-4">
          <ExplanationPanel 
            frame={simulation.currentFrame} 
            currentIndex={simulation.currentIndex} 
            totalFrames={simulation.totalFrames} 
          />
        </div>
      </div>
    </WorkspaceLayout>
  );
};
