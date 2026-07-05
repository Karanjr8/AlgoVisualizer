import { useEffect, useMemo } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { useSimulation } from '../hooks/useSimulation';
import { generateElements } from '../lib/utils';
import { generateFrames } from '../lib/algorithms';
import { ArrayRenderer } from '../components/visualizer/ArrayRenderer';
import { PlaygroundControls } from '../components/visualizer/PlaygroundControls';

export const Playground = () => {
  const { initialElements, setInitialElements, speed, algorithm, searchTarget, mode } = useVisualizerStore();

  useEffect(() => {
    if (initialElements.length === 0) {
      setInitialElements(generateElements(15));
    }
  }, [initialElements, setInitialElements]);

  const frames = useMemo(
    () => generateFrames(algorithm, initialElements, { searchTarget: searchTarget ?? undefined }),
    [initialElements, algorithm, searchTarget],
  );

  const simulation = useSimulation(frames, speed, mode);

  return (
    <div className="w-full bg-background text-foreground flex justify-center min-h-[calc(100vh-4rem)]">
      <main className="flex-1 max-w-5xl w-full px-4 md:px-8 py-12">
        <div className="space-y-8">
          
          <header className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Algorithm Playground</h1>
            <p className="text-muted-foreground text-lg">
              Experiment with different algorithms, visualize their execution, and compare how they handle various data sets in real-time.
            </p>
          </header>

          <section className="space-y-6">
            <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col">
              {/* Visualizer Canvas */}
              <div className="px-4 py-6 md:px-6 md:py-12 min-h-[300px] flex items-center justify-center relative bg-gradient-to-b from-transparent to-background/50 border-b border-border">
                <ArrayRenderer elements={simulation.currentFrame?.elements || initialElements} />
              </div>
              
              {/* Controls */}
              <div className="p-4 md:p-6 bg-background/30">
                <PlaygroundControls simulation={simulation} />
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};
