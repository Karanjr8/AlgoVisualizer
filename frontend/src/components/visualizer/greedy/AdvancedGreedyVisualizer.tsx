import React from 'react';
import type { VisualizationFrame, AlgorithmType } from '../../../types/visualizer';

interface Props {
  algorithm: AlgorithmType;
  frame?: VisualizationFrame;
}

export const AdvancedGreedyVisualizer: React.FC<Props> = ({ algorithm, frame }) => {
  const isTask = algorithm === 'task-scheduling-greedy';
  const isIpo = algorithm === 'ipo';
  const isReorganize = algorithm === 'reorganize-string';
  const isRopes = algorithm === 'min-cost-connect-ropes';
  const isSched = algorithm === 'greedy-scheduling';

  const ropes = frame?.greedyState?.ropes || [2, 3, 4, 6];
  const totalCost = frame?.greedyState?.totalCost ?? 29;
  const reorgResult = frame?.greedyState?.reorganizeResult || 'aba';
  const ipoCapital = frame?.greedyState?.ipoCapital ?? 4;

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            Advanced Greedy Engine
          </span>
          <span className="text-muted-foreground">
            {isTask && 'Max Task Frequency & Idle Cooldown Slots'}
            {isIpo && 'Dual Heap Capital Growth Optimization'}
            {isReorganize && 'Max-Heap Character Interleaving'}
            {isRopes && 'Min-Heap Smallest Ropes Pairwise Combination'}
            {isSched && 'Smith\'s Rule Weighted Completion Time Minimization'}
          </span>
        </div>
      </div>

      {/* ROPES MERGE VISUALIZER */}
      {isRopes && (
        <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-amber-400 font-bold">Rope Lengths Heap: [{ropes.join(', ')}]</span>
            <span className="text-emerald-400 font-bold">Total Minimum Cost = {totalCost}</span>
          </div>

          <div className="p-6 rounded-3xl bg-background/60 border border-border flex items-center justify-center font-mono text-xl font-bold text-amber-400">
            Min Total Merge Cost: {totalCost}
          </div>
        </div>
      )}

      {/* REORGANIZE STRING VISUALIZER */}
      {isReorganize && (
        <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="text-xs font-mono text-emerald-400 font-bold">
            Valid Reorganized Output String: "{reorgResult}"
          </div>

          <div className="flex gap-2 justify-center font-mono text-2xl font-black">
            {reorgResult.split('').map((char, idx) => (
              <div
                key={`char-${idx}`}
                className="w-12 h-14 rounded-2xl bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center shadow"
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IPO / SCHEDULING GENERAL SUMMARY */}
      {(isIpo || isTask || isSched) && (
        <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 w-max">
            Advanced Greedy Metric
          </span>

          <div className="p-6 rounded-3xl bg-background/60 border border-border flex flex-col items-center justify-center font-mono space-y-2">
            <span className="text-xs text-muted-foreground">Optimal Global Result</span>
            <span className="text-3xl font-black text-emerald-400">
              {isIpo ? `Final Capital = $${ipoCapital}` : `Optimal Completion Cost = ${totalCost}`}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
