import React, { useState } from 'react';
import { Play, RotateCcw, Calculator, Minus } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const BITRangeQueryVisualizer: React.FC<Props> = () => {
  const originalArray = [2, 5, 1, 4, 9, 3, 7, 8]; // 1-based indices 1..8
  const bit = [0, 2, 7, 1, 12, 9, 12, 7, 39];

  const [queryL, setQueryL] = useState<number>(3);
  const [queryR, setQueryR] = useState<number>(6);
  const [rightSum, setRightSum] = useState<number | null>(null);
  const [leftSum, setLeftSum] = useState<number | null>(null);
  const [rangeSumResult, setRangeSumResult] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>(
    'Select range [L, R] to visualize range_sum(L, R) = prefix(R) - prefix(L - 1) subtraction.'
  );

  const calcPrefix = (index: number): number => {
    let sum = 0;
    let curr = index;
    while (curr > 0) {
      sum += bit[curr];
      curr -= curr & -curr;
    }
    return sum;
  };

  const handleExecuteRangeQuery = async () => {
    if (queryL > queryR || queryL < 1 || queryR > 8) return;

    setRightSum(null);
    setLeftSum(null);
    setRangeSumResult(null);

    // Step 1: Query Prefix(R)
    const pR = calcPrefix(queryR);
    setRightSum(pR);
    setExplanation(`Step 1: Calculated prefix(${queryR}) = sum of elements A[1...${queryR}] = ${pR}.`);
    await new Promise(r => setTimeout(r, 600));

    // Step 2: Query Prefix(L - 1)
    const pLMinus1 = calcPrefix(queryL - 1);
    setLeftSum(pLMinus1);
    setExplanation(`Step 2: Calculated prefix(${queryL - 1}) = sum of elements A[1...${queryL - 1}] = ${pLMinus1}.`);
    await new Promise(r => setTimeout(r, 600));

    // Step 3: Subtraction
    const result = pR - pLMinus1;
    setRangeSumResult(result);
    setExplanation(
      `Step 3: Visual Subtraction: range_sum(${queryL}, ${queryR}) = prefix(${queryR}) [${pR}] - prefix(${queryL - 1}) [${pLMinus1}] = ${result}.`
    );
  };

  const handleReset = () => {
    setQueryL(3);
    setQueryR(6);
    setRightSum(null);
    setLeftSum(null);
    setRangeSumResult(null);
    setExplanation('Reset range query visualizer.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Input Bar */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 font-sans">
            <Calculator className="w-4 h-4" /> Range Sum Subtraction Engine
          </span>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-muted-foreground font-bold">L:</span>
            <input
              type="number"
              min={1}
              max={8}
              value={queryL}
              onChange={e => setQueryL(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
              className="w-12 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-bold">R:</span>
            <input
              type="number"
              min={1}
              max={8}
              value={queryR}
              onChange={e => setQueryR(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
              className="w-12 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExecuteRangeQuery}
            className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs transition-all shadow-md shadow-violet-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Execute Subtraction
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Subtraction Display */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-6 space-y-6">
        
        {/* Array Visualization */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Target Range A[{queryL}...{queryR}] (Isolated via prefix subtraction)
          </span>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 font-mono text-xs">
            {originalArray.map((val, idxZero) => {
              const idx = idxZero + 1;
              const inTargetRange = idx >= queryL && idx <= queryR;
              const inSubtractedLeft = idx < queryL;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                    inTargetRange
                      ? 'bg-violet-500/25 border-violet-400 text-violet-300 ring-2 ring-violet-400/50 shadow-lg shadow-violet-500/20'
                      : inSubtractedLeft
                      ? 'bg-rose-500/10 border-rose-500/30 text-muted-foreground opacity-50'
                      : 'bg-background/80 border-border text-muted-foreground opacity-40'
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">A[{idx}]</span>
                  <span className="text-lg font-black">{val}</span>
                  {inTargetRange && <span className="text-[9px] font-bold text-violet-400">Included</span>}
                  {inSubtractedLeft && <span className="text-[9px] font-bold text-rose-400">Subtracted</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtraction Formula Cards */}
        {rightSum !== null && leftSum !== null && rangeSumResult !== null && (
          <div className="p-4 rounded-2xl bg-background border border-violet-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs items-center">
            
            <div className="p-3 rounded-xl bg-card border border-border space-y-1 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">prefix({queryR})</span>
              <span className="text-base font-black text-emerald-400">A[1...{queryR}] = {rightSum}</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Minus className="w-5 h-5 text-rose-400" />
              <div className="p-3 rounded-xl bg-card border border-border space-y-1 text-center flex-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">prefix({queryL - 1})</span>
                <span className="text-base font-black text-rose-400">A[1...{queryL - 1}] = {leftSum}</span>
              </div>
              <span className="text-lg font-black text-muted-foreground">=</span>
            </div>

            <div className="p-3 rounded-xl bg-violet-500/20 border border-violet-500/40 text-center space-y-1">
              <span className="text-[10px] text-violet-300 uppercase tracking-wider block">range_sum({queryL}, {queryR})</span>
              <span className="text-lg font-black text-violet-300">{rangeSumResult}</span>
            </div>

          </div>
        )}

      </div>

      {/* Live Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 mt-0.5">
          <Calculator className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-mono">Range Subtraction Explanation</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>

    </div>
  );
};
