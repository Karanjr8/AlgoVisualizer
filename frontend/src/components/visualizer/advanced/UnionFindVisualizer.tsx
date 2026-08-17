import React, { useState } from 'react';
import { Play, RotateCcw, Share2, CheckCircle2 } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const UnionFindVisualizer: React.FC<Props> = () => {
  const operations = [
    { u: 0, v: 1, desc: 'Union(0, 1)' },
    { u: 1, v: 2, desc: 'Union(1, 2)' },
    { u: 3, v: 4, desc: 'Union(3, 4)' },
    { u: 2, v: 0, desc: 'Union(2, 0) [Cycle Check!]' }
  ];

  const [stepIdx, setStepIdx] = useState<number>(0);
  const [parent, setParent] = useState<number[]>([0, 1, 2, 3, 4]);
  const [rank, setRank] = useState<number[]>([1, 1, 1, 1, 1]);
  const [components, setComponents] = useState<number>(5);
  const [explanation, setExplanation] = useState<string>(
    'Click "Execute Next Union" to process union operations with path compression.'
  );

  const find = (i: number, pArr: number[]): number => {
    let curr = i;
    while (curr !== pArr[curr]) {
      curr = pArr[curr];
    }
    return curr;
  };

  const handleStep = () => {
    if (stepIdx >= operations.length) return;

    const op = operations[stepIdx];
    const nextParent = [...parent];
    const nextRank = [...rank];

    const rootU = find(op.u, nextParent);
    const rootV = find(op.v, nextParent);

    if (rootU !== rootV) {
      if (nextRank[rootU] < nextRank[rootV]) {
        nextParent[rootU] = rootV;
      } else {
        nextParent[rootV] = rootU;
        if (nextRank[rootU] === nextRank[rootV]) nextRank[rootU]++;
      }
      const nextComp = components - 1;
      setComponents(nextComp);
      setExplanation(
        `${op.desc}: Disjoint roots found (root(${op.u})=${rootU}, root(${op.v})=${rootV}). Merged sets! Remaining components = ${nextComp}.`
      );
    } else {
      setExplanation(
        `${op.desc}: Nodes ${op.u} and ${op.v} ALREADY share same root ${rootU}! Cycle / Redundant connection detected!`
      );
    }

    setParent(nextParent);
    setRank(nextRank);
    setStepIdx(prev => prev + 1);
  };

  const handleReset = () => {
    setStepIdx(0);
    setParent([0, 1, 2, 3, 4]);
    setRank([1, 1, 1, 1, 1]);
    setComponents(5);
    setExplanation('Reset Union Find state.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" /> Union Find (DSU) Pattern Engine
          </h3>
          <p className="text-xs text-muted-foreground">Dynamic Connectivity & Component merging in O(α(N)) near-constant time.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStep}
            disabled={stepIdx >= operations.length}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Execute Next Union ({stepIdx < operations.length ? operations[stepIdx].desc : 'Done'})
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            DSU Parent Array & Component Representative
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
            Connected Components = {components}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-3 font-mono text-xs">
          {parent.map((p, node) => (
            <div key={node} className="p-4 rounded-2xl bg-background border border-border flex flex-col items-center space-y-2">
              <span className="text-[10px] text-muted-foreground font-bold">Node [{node}]</span>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-base">
                Parent = {p}
              </div>
              <span className="text-[9px] text-muted-foreground">Rank = {rank[node]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">DSU Operational Insights</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>
    </div>
  );
};
