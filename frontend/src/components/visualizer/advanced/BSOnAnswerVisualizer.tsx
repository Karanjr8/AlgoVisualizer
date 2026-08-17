import React, { useState } from 'react';
import { Play, RotateCcw, Target } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const BSOnAnswerVisualizer: React.FC<Props> = () => {
  const piles = [3, 6, 7, 11];
  const H = 8;

  const [low, setLow] = useState<number>(1);
  const [high, setHigh] = useState<number>(11);
  const [candidateAns, setCandidateAns] = useState<number | null>(11);
  const [explanation, setExplanation] = useState<string>(
    'Search space [low=1, high=11]. Click "Test Feasibility (Mid)" to calculate mid speed.'
  );

  const calcHours = (speed: number): number => {
    return piles.reduce((sum, p) => sum + Math.ceil(p / speed), 0);
  };

  const handleStep = () => {
    if (low > high) return;

    const mid = Math.floor(low + (high - low) / 2);
    const hours = calcHours(mid);
    const feasible = hours <= H;

    if (feasible) {
      setCandidateAns(mid);
      setExplanation(
        `Mid Speed = ${mid}: Hours needed = ${hours} <= H(${H}) (FEASIBLE!). Recorded candidate ans = ${mid}. Narrow search left: high = ${mid - 1}.`
      );
      setHigh(mid - 1);
    } else {
      setExplanation(
        `Mid Speed = ${mid}: Hours needed = ${hours} > H(${H}) (INFEASIBLE!). Speed too slow. Narrow search right: low = ${mid + 1}.`
      );
      setLow(mid + 1);
    }
  };

  const handleReset = () => {
    setLow(1);
    setHigh(11);
    setCandidateAns(11);
    setExplanation('Reset Binary Search On Answer state.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-400" /> Binary Search On Answer Engine
          </h3>
          <p className="text-xs text-muted-foreground">Binary search over monotonic answer space [low, high] with feasibility check.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStep}
            disabled={low > high}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-md shadow-rose-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Test Feasibility (Mid) ({low <= high ? `range [${low}..${high}]` : 'Done'})
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
        
        {/* Search Space Range Bar */}
        <div className="p-4 rounded-2xl bg-background border border-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-sans">
              Monotonic Answer Search Space [1 ... 11]
            </span>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              Optimal Min Speed = {candidateAns !== null ? candidateAns : 'Searching...'}
            </span>
          </div>

          <div className="grid grid-cols-11 gap-1.5 text-center">
            {Array.from({ length: 11 }, (_, i) => i + 1).map(val => {
              const inRange = val >= low && val <= high;
              const isCandidate = val === candidateAns;

              return (
                <div
                  key={val}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    isCandidate
                      ? 'bg-rose-500 text-black border-rose-400 font-black scale-105 shadow-md shadow-rose-500/30'
                      : inRange
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-300 font-bold'
                      : 'bg-card border-border text-muted-foreground opacity-30'
                  }`}
                >
                  <span className="text-[9px]">Speed</span>
                  <span className="text-sm font-bold">{val}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Live Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0 mt-0.5">
          <Target className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">BS On Answer Insights</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>
    </div>
  );
};
