import React, { useState } from 'react';
import { Play, RotateCcw, Hash, CheckCircle2 } from 'lucide-react';
import type { VisualizationFrame, AlgorithmType } from '../../../types/visualizer';

interface Props {
  algorithm?: AlgorithmType;
  frame?: VisualizationFrame;
}

export const BITApplicationsVisualizer: React.FC<Props> = () => {
  const [arr] = useState<number[]>([8, 4, 2, 1]);
  const [currIdx, setCurrIdx] = useState<number>(3);
  const [inversions, setInversions] = useState<number>(0);
  const [bitFreq, setBitFreq] = useState<number[]>([0, 0, 0, 0, 0]); // 1-based index 1..4
  const [explanation, setExplanation] = useState<string>(
    'Right-to-left traversal initialized. Hit "Process Step" to query inversion count in BIT.'
  );

  const handleStepInversion = () => {
    if (currIdx < 0) return;

    const val = arr[currIdx];
    const sortedUnique = [1, 2, 4, 8];
    const rank = sortedUnique.indexOf(val) + 1; // 1-based rank

    // Query BIT up to rank - 1
    let smallerCount = 0;
    let curr = rank - 1;
    while (curr > 0) {
      smallerCount += bitFreq[curr];
      curr -= curr & -curr;
    }

    const nextInversions = inversions + smallerCount;
    setInversions(nextInversions);

    // Add +1 at rank
    const nextFreq = [...bitFreq];
    let updateCurr = rank;
    while (updateCurr <= 4) {
      nextFreq[updateCurr] += 1;
      updateCurr += updateCurr & -updateCurr;
    }
    setBitFreq(nextFreq);

    setExplanation(
      `Processed arr[${currIdx}] = ${val} (rank ${rank}). Queried BIT range [1...${rank - 1}] -> Found ${smallerCount} smaller elements already seen. Cumulative Inversions = ${nextInversions}. Updated rank ${rank} frequency.`
    );

    setCurrIdx(prev => prev - 1);
  };

  const handleReset = () => {
    setCurrIdx(3);
    setInversions(0);
    setBitFreq([0, 0, 0, 0, 0]);
    setExplanation('Reset Inversion Counting state.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Hash className="w-5 h-5 text-violet-400" /> Count Inversions using Fenwick Tree
          </h3>
          <p className="text-xs text-muted-foreground">Right-to-left traversal counting smaller elements after self in O(N log N) time.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStepInversion}
            disabled={currIdx < 0}
            className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-md shadow-violet-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Process Step (i={currIdx >= 0 ? currIdx : 'Done'})
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
        
        {/* Array */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Input Array (Right-to-Left Traversal)</span>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            {arr.map((v, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                  i === currIdx
                    ? 'bg-amber-500/25 border-amber-500 text-amber-300 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/20 scale-105'
                    : i > currIdx
                    ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                    : 'bg-background border-border text-muted-foreground'
                }`}
              >
                <span className="text-[10px] text-muted-foreground">idx {i}</span>
                <span className="text-lg font-black">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BIT Frequency Array */}
        <div className="p-4 rounded-2xl bg-background border border-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-sans">
              Fenwick Frequency Tree (Ranks 1..4 for values 1, 2, 4, 8)
            </span>
            <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
              Total Inversions = {inversions}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Val 1 (Rank 1)', 'Val 2 (Rank 2)', 'Val 4 (Rank 3)', 'Val 8 (Rank 4)'].map((label, idxZero) => {
              const r = idxZero + 1;
              return (
                <div key={r} className="p-3 rounded-xl bg-card border border-border flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                  <span className="text-base font-black text-foreground">BIT[{r}] = {bitFreq[r]}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Live Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-mono">Inversion Counting Insights</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>

    </div>
  );
};
