import React, { useState } from 'react';
import { Play, RotateCcw, Calculator } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const DifferenceArrayVisualizer: React.FC<Props> = () => {
  const [diff, setDiff] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [reconstructed, setReconstructed] = useState<number[]>([0, 0, 0, 0, 0]);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>(
    'Click "Step Update" to apply O(1) difference array boundary modifications.'
  );

  const steps = [
    { type: 'update', l: 1, r: 3, val: 10, desc: 'Update 1: Add +10 to range [1, 3] -> diff[1] += 10, diff[4] -= 10' },
    { type: 'update', l: 2, r: 4, val: 5, desc: 'Update 2: Add +5 to range [2, 4] -> diff[2] += 5, diff[5] -= 5' },
    { type: 'reconstruct', desc: 'Reconstruction: Compute Prefix Sum of Difference Array to get final values!' }
  ];

  const handleStep = () => {
    if (stepIdx >= steps.length) return;

    const st = steps[stepIdx];
    const nextDiff = [...diff];

    if (st.type === 'update') {
      nextDiff[st.l!] += st.val!;
      if (st.r! + 1 < nextDiff.length) nextDiff[st.r! + 1] -= st.val!;
      setDiff(nextDiff);
      setExplanation(st.desc);
    } else {
      // Reconstruct
      const res = new Array(5).fill(0);
      res[0] = diff[0];
      for (let i = 1; i < 5; i++) {
        res[i] = res[i - 1] + diff[i];
      }
      setReconstructed(res);
      setExplanation(st.desc);
    }

    setStepIdx(prev => prev + 1);
  };

  const handleReset = () => {
    setStepIdx(0);
    setDiff([0, 0, 0, 0, 0, 0]);
    setReconstructed([0, 0, 0, 0, 0]);
    setExplanation('Reset Difference Array state.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" /> Difference Array Pattern Engine
          </h3>
          <p className="text-xs text-muted-foreground">O(1) Range updates via boundary modifications + O(N) prefix reconstruction.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStep}
            disabled={stepIdx >= steps.length}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 text-black font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Step Operation ({stepIdx < steps.length ? steps[stepIdx].type : 'Done'})
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
        
        {/* Difference Array Display */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            Difference Array diff[0...5] (Boundary Markers)
          </span>

          <div className="grid grid-cols-6 gap-3 font-mono text-xs">
            {diff.map((val, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-background border border-border flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">diff[{idx}]</span>
                <span className="text-base font-black text-cyan-300">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reconstructed Final Array */}
        {stepIdx >= 3 && (
          <div className="space-y-2 pt-2 border-t border-border/60">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Reconstructed Final Array A[0...4] (Prefix Sum of diff)
            </span>

            <div className="grid grid-cols-5 gap-3 font-mono text-xs">
              {reconstructed.map((val, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">A[{idx}]</span>
                  <span className="text-lg font-black text-emerald-300">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Live Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
          <Calculator className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">Difference Array Insights</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>
    </div>
  );
};
