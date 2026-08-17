import React, { useState } from 'react';
import { Play, RotateCcw, Layers, ArrowRight } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const MonotonicStackVisualizer: React.FC<Props> = () => {
  const [arr] = useState<number[]>([2, 1, 5, 6, 2, 3]);
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [stack, setStack] = useState<number[]>([]);
  const [result, setResult] = useState<(number | string)[]>(['- ', '- ', '- ', '- ', '- ', '- ']);
  const [explanation, setExplanation] = useState<string>(
    'Click "Step Forward" to iterate through the array and maintain the monotonic decreasing stack.'
  );

  const handleStep = () => {
    if (currIdx >= arr.length) return;

    const val = arr[currIdx];
    const nextStack = [...stack];
    const nextResult = [...result];
    const poppedVals: number[] = [];

    // Monotonic Decreasing Stack for Next Greater Element
    while (nextStack.length > 0 && arr[nextStack[nextStack.length - 1]] < val) {
      const poppedIdx = nextStack.pop()!;
      poppedVals.push(arr[poppedIdx]);
      nextResult[poppedIdx] = val;
    }

    nextStack.push(currIdx);
    setStack(nextStack);
    setResult(nextResult);

    if (poppedVals.length > 0) {
      setExplanation(
        `Index ${currIdx} (val ${val}) is GREATER than popped stack elements [${poppedVals.join(', ')}]. Next Greater Element recorded! Pushed index ${currIdx} onto stack.`
      );
    } else {
      setExplanation(
        `Index ${currIdx} (val ${val}) is <= top of stack. Pushed index ${currIdx} onto stack to maintain monotonicity.`
      );
    }

    setCurrIdx(prev => prev + 1);
  };

  const handleReset = () => {
    setCurrIdx(0);
    setStack([]);
    setResult(['- ', '- ', '- ', '- ', '- ', '- ']);
    setExplanation('Reset Monotonic Stack visualization.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Control Bar */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" /> Monotonic Stack Pattern Engine
          </h3>
          <p className="text-xs text-muted-foreground">Next Greater Element in O(N) linear time using stack monotonicity.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStep}
            disabled={currIdx >= arr.length}
            className="px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-md shadow-violet-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Step Forward (i={currIdx < arr.length ? currIdx : 'Done'})
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Display */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Input Array & Next Greater Array */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Input Array</span>
            <div className="grid grid-cols-6 gap-2 font-mono text-xs">
              {arr.map((v, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                    i === currIdx - 1
                      ? 'bg-amber-500/25 border-amber-500 text-amber-300 ring-2 ring-amber-500/40 shadow-lg scale-105'
                      : i < currIdx
                      ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                      : 'bg-background border-border text-muted-foreground'
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">idx {i}</span>
                  <span className="text-base font-black">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Next Greater Element Result</span>
            <div className="grid grid-cols-6 gap-2 font-mono text-xs">
              {result.map((res, i) => (
                <div key={i} className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex flex-col items-center gap-1 font-bold">
                  <span className="text-[10px] text-muted-foreground">idx {i}</span>
                  <span className="text-base font-black">{res}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stack Representation */}
        <div className="p-5 rounded-2xl bg-background border border-border flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-mono">
              Monotonic Stack (Stores Indices)
            </span>
            <span className="text-xs font-mono text-muted-foreground">Size = {stack.length}</span>
          </div>

          <div className="min-h-[140px] flex flex-col-reverse items-center justify-start gap-2 p-3 rounded-xl bg-card border border-border/60">
            {stack.length === 0 ? (
              <span className="text-xs text-muted-foreground font-mono self-center my-auto">Stack is Empty</span>
            ) : (
              stack.map((stackIdx, i) => (
                <div
                  key={i}
                  className="w-full py-2 px-4 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-between font-mono text-xs font-bold shadow-sm"
                >
                  <span>Stack Level {i}</span>
                  <span>Index [{stackIdx}] (Val = {arr[stackIdx]})</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Live Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 mt-0.5">
          <ArrowRight className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-mono">Monotonic Stack Insights</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>
    </div>
  );
};
