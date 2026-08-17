import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const MedianStreamVisualizer: React.FC<Props> = () => {
  const stream = [5, 15, 1, 3, 8, 7, 9];

  const [stepIdx, setStepIdx] = useState<number>(-1);
  const [maxHeap, setMaxHeap] = useState<number[]>([]); // Lower half
  const [minHeap, setMinHeap] = useState<number[]>([]); // Upper half
  const [currentMedian, setCurrentMedian] = useState<number | null>(null);
  const [actionText, setActionText] = useState<string>('Find Median from Data Stream: Maintain Lower Half (Max-Heap) and Upper Half (Min-Heap)');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    let lower: number[] = [];
    let upper: number[] = [];

    for (let i = 0; i < stream.length; i++) {
      const num = stream[i];
      setStepIdx(i);

      // Add to Max Heap (lower half) initially
      if (lower.length === 0 || num <= lower[0]) {
        lower.push(num);
        lower.sort((a, b) => b - a); // Max Heap
        setActionText(`Stream [${i + 1}]: Added ${num} to Lower Max-Heap.`);
      } else {
        upper.push(num);
        upper.sort((a, b) => a - b); // Min Heap
        setActionText(`Stream [${i + 1}]: Added ${num} to Upper Min-Heap.`);
      }
      setMaxHeap([...lower]);
      setMinHeap([...upper]);
      await new Promise(r => setTimeout(r, 800));

      // Rebalance if size diff > 1
      if (lower.length > upper.length + 1) {
        const move = lower.shift()!;
        upper.push(move);
        upper.sort((a, b) => a - b);
        setActionText(`Rebalancing: Moved ${move} from Max-Heap root to Min-Heap.`);
      } else if (upper.length > lower.length) {
        const move = upper.shift()!;
        lower.push(move);
        lower.sort((a, b) => b - a);
        setActionText(`Rebalancing: Moved ${move} from Min-Heap root to Max-Heap.`);
      }

      setMaxHeap([...lower]);
      setMinHeap([...upper]);
      await new Promise(r => setTimeout(r, 800));

      // Compute Running Median
      let median = 0;
      if (lower.length > upper.length) {
        median = lower[0];
      } else {
        median = (lower[0] + upper[0]) / 2;
      }
      setCurrentMedian(median);
      setActionText(`Stream size ${i + 1} → Calculated Running Median = ${median}`);
      await new Promise(r => setTimeout(r, 900));
    }

    setActionText(`Data Stream Complete! Final Running Median is ${currentMedian}`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setStepIdx(-1);
    setMaxHeap([]);
    setMinHeap([]);
    setCurrentMedian(null);
    setActionText('Ready to start Data Stream Median simulation');
    setIsRunning(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow"
          >
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Streaming...' : 'Animate Data Stream'}
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-muted-foreground">Running Median: <strong className="text-emerald-400 text-sm">{currentMedian !== null ? currentMedian : '--'}</strong></span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">
            Two Heaps Pattern (Max + Min)
          </span>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* DATA STREAM VS DUAL HEAP CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* STREAM INPUT SEQUENCE */}
        <div className="lg:col-span-4 bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Data Stream Elements
          </span>

          <div className="flex flex-wrap gap-2 justify-center py-4">
            {stream.map((num, idx) => {
              const isCurrent = stepIdx === idx;
              const isProcessed = stepIdx > idx;

              return (
                <div key={`ds-input-${idx}`} className="flex flex-col items-center gap-1">
                  <motion.div
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    className={`
                      w-11 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow border-2 transition-all
                      ${isCurrent ? 'bg-amber-500 border-amber-400 text-black shadow-amber-500/30 font-black' :
                        isProcessed ? 'bg-muted border-border text-muted-foreground opacity-50' :
                        'bg-background border-border text-foreground'}
                    `}
                  >
                    {num}
                  </motion.div>
                  <span className="text-[9px] font-mono text-muted-foreground">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            By balancing size differences between Max-Heap and Min-Heap to ≤ 1, median access takes O(1) time!
          </p>
        </div>

        {/* DUAL HEAPS (LOWER MAX-HEAP VS UPPER MIN-HEAP) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* LOWER HALF: MAX-HEAP */}
          <div className="bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner border-amber-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30 w-max">
              Lower Half: Max-Heap (Size: {maxHeap.length})
            </span>

            <div className="flex flex-wrap gap-2 justify-center py-4">
              <AnimatePresence>
                {maxHeap.map((val, idx) => (
                  <motion.div
                    key={`ds-max-${idx}-${val}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`w-12 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono shadow ${
                      idx === 0 ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold scale-105' : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <span className="text-sm font-bold">{val}</span>
                    <span className="text-[8px] text-muted-foreground font-sans">{idx === 0 ? 'Root' : ''}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <span className="text-[10px] font-mono text-muted-foreground text-center">Root = Max of Smaller Half</span>
          </div>

          {/* UPPER HALF: MIN-HEAP */}
          <div className="bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner border-blue-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 font-sans px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/30 w-max">
              Upper Half: Min-Heap (Size: {minHeap.length})
            </span>

            <div className="flex flex-wrap gap-2 justify-center py-4">
              <AnimatePresence>
                {minHeap.map((val, idx) => (
                  <motion.div
                    key={`ds-min-${idx}-${val}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`w-12 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono shadow ${
                      idx === 0 ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold scale-105' : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <span className="text-sm font-bold">{val}</span>
                    <span className="text-[8px] text-muted-foreground font-sans">{idx === 0 ? 'Root' : ''}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <span className="text-[10px] font-mono text-muted-foreground text-center">Root = Min of Larger Half</span>
          </div>

        </div>

      </div>
    </div>
  );
};
