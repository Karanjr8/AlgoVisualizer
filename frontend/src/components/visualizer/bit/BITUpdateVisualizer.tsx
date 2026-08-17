import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, RefreshCw, ArrowUp } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const BITUpdateVisualizer: React.FC<Props> = () => {
  const [bit, setBit] = useState<number[]>([0, 2, 7, 1, 12, 9, 12, 7, 39]); // 1-based index 1..8
  const [updateIdx, setUpdateIdx] = useState<number>(5);
  const [updateDelta, setUpdateDelta] = useState<number>(3);

  const [activePath, setActivePath] = useState<number[]>([]);
  const [currentStepNode, setCurrentStepNode] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>(
    'Select a 1-based index and delta value to visualize upward point update propagation.'
  );

  const handleExecuteUpdate = async () => {
    if (updateIdx < 1 || updateIdx > 8) return;

    setActivePath([]);
    setCurrentStepNode(null);

    setExplanation(`Initiating Point Update: Add +${updateDelta} at index ${updateIdx}...`);
    await new Promise(r => setTimeout(r, 400));

    const path: number[] = [];
    const nextBit = [...bit];
    let curr = updateIdx;

    while (curr <= 8) {
      path.push(curr);
      setActivePath([...path]);
      setCurrentStepNode(curr);

      const oldVal = nextBit[curr];
      nextBit[curr] += updateDelta;
      setBit([...nextBit]);

      const lowbitVal = curr & -curr;
      const nextCurr = curr + lowbitVal;

      setExplanation(
        `Index ${curr} (binary ${curr.toString(2).padStart(4, '0')}): BIT[${curr}] updated from ${oldVal} to ${nextBit[curr]}. Node ${curr} stores a range containing index ${updateIdx}. Next parent index: ${curr} + lowbit(${curr}) (${lowbitVal}) = ${nextCurr}.`
      );

      await new Promise(r => setTimeout(r, 1000));
      curr = nextCurr;
    }

    setCurrentStepNode(null);
    setExplanation(
      `Point Update Complete! Updated ${path.length} BIT nodes (${path.join(' → ')}) in O(log N) total operations.`
    );
  };

  const handleReset = () => {
    setBit([0, 2, 7, 1, 12, 9, 12, 7, 39]);
    setUpdateIdx(5);
    setUpdateDelta(3);
    setActivePath([]);
    setCurrentStepNode(null);
    setExplanation('Reset BIT array to initial values.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Control Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-sans">
            <RefreshCw className="w-4 h-4" /> Point Update Control
          </span>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-muted-foreground font-bold">Index:</span>
            <input
              type="number"
              min={1}
              max={8}
              value={updateIdx}
              onChange={e => setUpdateIdx(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
              className="w-12 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-bold">Delta:</span>
            <input
              type="number"
              value={updateDelta}
              onChange={e => setUpdateDelta(parseInt(e.target.value) || 0)}
              className="w-14 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExecuteUpdate}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Execute Point Update
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
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            BIT Array Update Propagation Path (i += i & -i)
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Active Path: {activePath.length > 0 ? activePath.join(' → ') : 'None'}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {bit.slice(1).map((val, idxZero) => {
            const idx = idxZero + 1;
            const isCurrent = currentStepNode === idx;
            const isPath = activePath.includes(idx);

            let style = 'bg-background/80 border-border text-foreground';
            if (isCurrent) style = 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-4 ring-cyan-400/60 shadow-xl scale-110';
            else if (isPath) style = 'bg-amber-500/25 border-amber-500 text-amber-300 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20';

            return (
              <motion.div
                key={idx}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1 font-mono transition-all ${style}`}
              >
                <span className="text-[10px] text-muted-foreground font-bold">BIT[{idx}]</span>
                <span className="text-lg font-black">{val}</span>
                {isPath && <span className="text-[9px] font-bold text-amber-400">Updated</span>}
              </motion.div>
            );
          })}
        </div>

        {/* Upward Stepping Diagram */}
        {activePath.length > 0 && (
          <div className="p-4 rounded-2xl bg-background border border-amber-500/30 flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
            <span className="text-muted-foreground">Propagation Steps:</span>
            {activePath.map((stepNode, i) => (
              <React.Fragment key={stepNode}>
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                  Node {stepNode}
                </span>
                {i < activePath.length - 1 && <ArrowUp className="w-4 h-4 text-amber-400 rotate-90" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Live Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
          <RefreshCw className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">Point Update Propagation</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>

    </div>
  );
};
