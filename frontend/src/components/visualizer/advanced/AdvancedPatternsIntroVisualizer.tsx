import React, { useState } from 'react';
import { MonotonicStackVisualizer } from './MonotonicStackVisualizer';
import { UnionFindVisualizer } from './UnionFindVisualizer';
import { SweepLineVisualizer } from './SweepLineVisualizer';
import { DifferenceArrayVisualizer } from './DifferenceArrayVisualizer';
import { BSOnAnswerVisualizer } from './BSOnAnswerVisualizer';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const AdvancedPatternsIntroVisualizer: React.FC<Props> = () => {
  const [activePattern, setActivePattern] = useState<'stack' | 'dsu' | 'sweep' | 'diff' | 'bs'>(
    'stack'
  );

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Pattern Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-background border border-border">
        <button
          onClick={() => setActivePattern('stack')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePattern === 'stack'
              ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Monotonic Stack
        </button>

        <button
          onClick={() => setActivePattern('dsu')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePattern === 'dsu'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Union Find (DSU)
        </button>

        <button
          onClick={() => setActivePattern('sweep')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePattern === 'sweep'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sweep Line
        </button>

        <button
          onClick={() => setActivePattern('diff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePattern === 'diff'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Difference Array
        </button>

        <button
          onClick={() => setActivePattern('bs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePattern === 'bs'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Binary Search On Answer
        </button>
      </div>

      {/* Active Pattern Visualizer Render */}
      <div className="w-full">
        {activePattern === 'stack' && <MonotonicStackVisualizer />}
        {activePattern === 'dsu' && <UnionFindVisualizer />}
        {activePattern === 'sweep' && <SweepLineVisualizer />}
        {activePattern === 'diff' && <DifferenceArrayVisualizer />}
        {activePattern === 'bs' && <BSOnAnswerVisualizer />}
      </div>
    </div>
  );
};
