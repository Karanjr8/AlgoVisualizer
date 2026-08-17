import { useState, useMemo, useEffect } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { useSimulation } from '../../hooks/useSimulation';
import { generateElements } from '../../lib/utils';
import { generateFrames } from '../../lib/algorithms';
import { EngineRenderer } from '../../components/visualizer/EngineRenderer';
import { SideControls } from '../../components/visualizer/SideControls';
import { ExplanationPanel } from '../../components/visualizer/ExplanationPanel';
import { CodeTabs } from '../../components/visualizer/CodeTabs';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { Code2, Settings } from 'lucide-react';
import type { AlgorithmType } from '../../types/visualizer';
import { algorithmContent } from '../../data/algorithmContent';

export const CodeExplorer = () => {
  const { initialElements, setInitialElements, speed, mode } = useVisualizerStore();
  const [algo, setAlgo] = useState<AlgorithmType>('bubble');

  useEffect(() => {
    if (initialElements.length === 0) {
      setInitialElements(generateElements(10, 'random'));
    }
  }, [initialElements, setInitialElements]);

  const frames = useMemo(() => generateFrames(algo, initialElements), [algo, initialElements]);
  const simulation = useSimulation(frames, speed, mode);

  const content = algorithmContent[algo];

  const navLinks = [
    { id: 'code', label: 'Code Explorer', icon: <Code2 className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Code Explorer</h1>
        <p className="text-muted-foreground text-xl max-w-3xl">Watch code execute line by line, perfectly synchronized with the algorithm visualization.</p>
      </header>

      <div className="flex flex-col gap-10">
        
        {/* Controls Bar */}
        <div className="w-full bg-card border border-border p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-end gap-6 max-w-4xl mx-auto">
          <div className="w-full md:flex-1 flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" /> Active Algorithm
            </label>
            <select 
              value={algo} 
              onChange={(e) => setAlgo(e.target.value as AlgorithmType)}
              className="w-full bg-background border border-border rounded-xl p-4 outline-none focus:border-primary transition-colors font-bold text-lg shadow-sm"
            >
              <option value="bubble">Bubble Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
            </select>
          </div>
          
          <button 
            onClick={() => { setInitialElements(generateElements(10, 'random')); simulation.reset(); }}
            className="w-full md:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-black shadow-md hover:bg-secondary/80 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Randomize Array
          </button>
        </div>

        {/* Split Screen Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-[1600px] mx-auto min-h-[600px]">
          
          {/* Left Side: Code */}
          <div className="flex flex-col h-full min-h-[600px] shadow-2xl rounded-[2rem] overflow-hidden border border-border">
            {content?.code ? (
              <CodeTabs codeData={content.code} />
            ) : (
              <div className="flex-1 bg-card flex items-center justify-center text-muted-foreground text-lg font-medium p-8 text-center">
                Code snippets are not available for this algorithm yet.
              </div>
            )}
          </div>

          {/* Right Side: Visualizer */}
          <div className="w-full bg-card rounded-[2rem] border border-border shadow-2xl overflow-hidden flex flex-col relative min-h-[600px]">
            <div className="flex-1 w-full flex flex-col items-center justify-center p-8 relative bg-gradient-to-b from-transparent to-background/50">
              <div className="flex-1 w-full flex items-center justify-center min-h-[400px] z-10">
                <EngineRenderer algorithm={algo} frame={simulation.currentFrame} initialElements={initialElements} />
              </div>
              <div className="w-full mt-8 z-20">
                <SideControls simulation={simulation} algorithm={algo} />
              </div>
            </div>
          </div>

        </div>

        {/* Explanation Panel (Below everything) */}
        <div className="w-full">
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
