import React, { useState } from 'react';
import { Play, RotateCcw, Building2, Hash, CheckCircle2 } from 'lucide-react';
import type { VisualizationFrame, AlgorithmType } from '../../../types/visualizer';

interface Props {
  algorithm?: AlgorithmType;
  frame?: VisualizationFrame;
}

export const SegmentTreeApplicationsVisualizer: React.FC<Props> = ({ algorithm = 'count-smaller-numbers' }) => {
  const isSkyline = algorithm === 'skyline-problem';

  // Count Smaller Numbers Demo Data
  const [nums] = useState<number[]>([5, 2, 6, 1]);
  const [currentIdx, setCurrentIdx] = useState<number>(3);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const [freqTree, setFreqTree] = useState<number[]>([0, 0, 0, 0]); // Ranks: 1->0, 2->1, 5->2, 6->3
  const [countExplanation, setCountExplanation] = useState<string>(
    'Right-to-left traversal initialized. Hit "Process Step" to query smaller numbers.'
  );

  // Skyline Demo Data
  const [buildings] = useState<Array<{ id: string; l: number; r: number; h: number }>>([
    { id: 'B1', l: 2, r: 9, h: 10 },
    { id: 'B2', l: 3, r: 7, h: 15 },
    { id: 'B3', l: 5, r: 12, h: 12 }
  ]);
  const [skylineHeights] = useState<Record<number, number>>({
    2: 10, 3: 15, 4: 15, 5: 15, 6: 15, 7: 12, 8: 12, 9: 12, 10: 12, 11: 12
  });

  const handleStepCountSmaller = () => {
    if (currentIdx < 0) return;

    const val = nums[currentIdx];
    const sortedUnique = [1, 2, 5, 6];
    const rank = sortedUnique.indexOf(val);

    // Sum frequency tree elements up to rank - 1
    let smallerCount = 0;
    for (let r = 0; r < rank; r++) {
      smallerCount += freqTree[r];
    }

    const nextCounts = [...counts];
    nextCounts[currentIdx] = smallerCount;
    setCounts(nextCounts);

    const nextFreq = [...freqTree];
    nextFreq[rank] += 1;
    setFreqTree(nextFreq);

    setCountExplanation(
      `Processed nums[${currentIdx}] = ${val} (rank ${rank}). Queried frequency tree range [0, ${rank - 1}] -> Found ${smallerCount} smaller elements. Updated rank ${rank} count to ${nextFreq[rank]}.`
    );

    setCurrentIdx(prev => prev - 1);
  };

  const handleResetCountSmaller = () => {
    setCurrentIdx(3);
    setCounts([0, 0, 0, 0]);
    setFreqTree([0, 0, 0, 0]);
    setCountExplanation('Reset Right-to-Left Traversal state.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            {isSkyline ? <Building2 className="w-5 h-5 text-amber-400" /> : <Hash className="w-5 h-5 text-emerald-400" />}
            {isSkyline ? 'Skyline Range Maximum Overlap' : 'Count Smaller Numbers After Self'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isSkyline ? 'Coordinate compressed range max updates for overlapping building silhouettes.' : 'Right-to-left frequency segment tree queries in O(N log N) time.'}
          </p>
        </div>

        {!isSkyline && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleStepCountSmaller}
              disabled={currentIdx < 0}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Process Step (i={currentIdx >= 0 ? currentIdx : 'Done'})
            </button>

            <button
              onClick={handleResetCountSmaller}
              className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Mode 1: Count Smaller Numbers */}
      {!isSkyline && (
        <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-6 space-y-6">
          
          {/* Numbers Array */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Original Input Array (Traversed Right-to-Left)
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {nums.map((v, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1 font-mono transition-all ${
                    i === currentIdx
                      ? 'bg-amber-500/25 border-amber-500 text-amber-300 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/20'
                      : i > currentIdx
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-background border-border text-muted-foreground'
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">idx {i}</span>
                  <span className="text-lg font-black">{v}</span>
                  <span className="text-[10px] font-bold text-emerald-400">Smaller: {counts[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Frequency Segment Tree (Ranks) */}
          <div className="p-4 rounded-2xl bg-background border border-border space-y-3 font-mono text-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block font-sans">
              Coordinate Compressed Frequency Segment Tree (Values: 1, 2, 5, 6)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Val 1 (Rank 0)', 'Val 2 (Rank 1)', 'Val 5 (Rank 2)', 'Val 6 (Rank 3)'].map((label, r) => (
                <div key={r} className="p-3 rounded-xl bg-card border border-border flex flex-col items-center space-y-1">
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                  <span className="text-base font-black text-foreground">Freq = {freqTree[r]}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Mode 2: Skyline Overlap */}
      {isSkyline && (
        <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overlapping Buildings [L, R, H]</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              {buildings.map(b => (
                <div key={b.id} className="p-3 rounded-xl bg-background border border-border space-y-1">
                  <span className="text-amber-400 font-bold">{b.id}: [{b.l}, {b.r}, H={b.h}]</span>
                  <span className="text-[10px] text-muted-foreground block">Updates range max [{b.l}, {b.r - 1}] to H={b.h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border space-y-3 font-mono text-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block font-sans">
              Max Height Profile Extracted from Segment Tree
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(skylineHeights).map(([x, h]) => (
                <div key={x} className="px-3 py-1.5 rounded-lg bg-card border border-border flex items-center gap-2">
                  <span className="text-muted-foreground">x={x}:</span>
                  <span className="font-black text-amber-400">H={h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Interview Application Insights</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">
            {isSkyline
              ? 'Segment Trees resolve geometry and overlapping interval problems by reducing 2D height updates to 1D Range Max Lazy updates in O(N log N) time.'
              : countExplanation}
          </p>
        </div>
      </div>

    </div>
  );
};
