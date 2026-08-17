import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Search, Calculator } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const BITQueryVisualizer: React.FC<Props> = () => {
  const bit = [0, 2, 7, 1, 12, 9, 12, 7, 39]; // 1-based index 1..8
  const ranges: Record<number, { start: number; end: number }> = {
    1: { start: 1, end: 1 }, 2: { start: 1, end: 2 }, 3: { start: 3, end: 3 },
    4: { start: 1, end: 4 }, 5: { start: 5, end: 5 }, 6: { start: 5, end: 6 },
    7: { start: 7, end: 7 }, 8: { start: 1, end: 8 }
  };

  const [queryIdx, setQueryIdx] = useState<number>(7);
  const [activePath, setActivePath] = useState<number[]>([]);
  const [accumSum, setAccumSum] = useState<number | null>(null);
  const [runningTerms, setRunningTerms] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>(
    'Select a 1-based index i to visualize backward prefix sum decomposition.'
  );

  const handleExecuteQuery = async () => {
    if (queryIdx < 1 || queryIdx > 8) return;

    setActivePath([]);
    setAccumSum(null);
    setRunningTerms([]);

    setExplanation(`Initiating Prefix Sum Query up to index ${queryIdx}...`);
    await new Promise(r => setTimeout(r, 400));

    const path: number[] = [];
    const terms: string[] = [];
    let currentSum = 0;
    let curr = queryIdx;

    while (curr > 0) {
      path.push(curr);
      setActivePath([...path]);

      const val = bit[curr];
      currentSum += val;
      const range = ranges[curr];
      terms.push(`BIT[${curr}] (${val})`);

      setRunningTerms([...terms]);
      setAccumSum(currentSum);

      const lowbitVal = curr & -curr;
      const nextCurr = curr - lowbitVal;

      setExplanation(
        `Index ${curr} (binary ${curr.toString(2).padStart(4, '0')}): Add BIT[${curr}] = ${val} (covers range [${range.start}, ${range.end}]). Accumulated Sum = ${currentSum}. Next index: ${curr} - lowbit(${curr}) (${lowbitVal}) = ${nextCurr}.`
      );

      await new Promise(r => setTimeout(r, 1000));
      curr = nextCurr;
    }

    setExplanation(
      `Prefix Sum Query Complete! PrefixSum(${queryIdx}) = ${currentSum}. Visited ONLY ${path.length} BIT nodes (${path.join(' → ')}) — proving O(log N) efficiency!`
    );
  };

  const handleReset = () => {
    setQueryIdx(7);
    setActivePath([]);
    setAccumSum(null);
    setRunningTerms([]);
    setExplanation('Reset query visualization.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Control Bar */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-sans">
            <Search className="w-4 h-4" /> Prefix Sum Query Engine
          </span>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-muted-foreground font-bold">Query Index (i):</span>
            <input
              type="number"
              min={1}
              max={8}
              value={queryIdx}
              onChange={e => setQueryIdx(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
              className="w-14 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExecuteQuery}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Execute Prefix Query
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BIT Array Display */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Backward Prefix Sum Decomposition Path (i -= i & -i)
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Decomposed Path: {activePath.length > 0 ? activePath.join(' → ') + ' → 0' : 'None'}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {bit.slice(1).map((val, idxZero) => {
            const idx = idxZero + 1;
            const isPath = activePath.includes(idx);
            const range = ranges[idx];

            let style = 'bg-background/80 border-border text-foreground';
            if (isPath) style = 'bg-emerald-500/25 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20 scale-105';

            return (
              <motion.div
                key={idx}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1 font-mono transition-all ${style}`}
              >
                <span className="text-[10px] text-muted-foreground font-bold">BIT[{idx}]</span>
                <span className="text-lg font-black">{val}</span>
                <span className="text-[9px] text-muted-foreground font-bold">[{range.start}..{range.end}]</span>
              </motion.div>
            );
          })}
        </div>

        {/* Live Accumulator */}
        {accumSum !== null && (
          <div className="p-4 rounded-2xl bg-background border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span className="text-muted-foreground">Accumulating:</span>
              <span className="text-emerald-300 font-bold">{runningTerms.join('  +  ')}</span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-sm">
              PrefixSum({queryIdx}) = {accumSum}
            </div>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
          <Search className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Prefix Sum Query Explanation</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>

    </div>
  );
};
