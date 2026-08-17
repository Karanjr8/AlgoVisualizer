import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const KthLargestVisualizer: React.FC<Props> = () => {
  const nums = [3, 2, 1, 5, 6, 4];
  const k = 2;

  const [stepIdx, setStepIdx] = useState<number>(-1);
  const [heap, setHeap] = useState<number[]>([]);
  const [actionText, setActionText] = useState<string>('Goal: Find the 2nd largest element using a Min-Heap of size K = 2');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    let currentHeap: number[] = [];

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];
      setStepIdx(i);

      // Insert val into Min-Heap
      currentHeap.push(val);
      currentHeap.sort((a, b) => a - b); // Min Heap invariant sort
      setHeap([...currentHeap]);
      setActionText(`Step ${i + 1}: Inserted ${val} into Min-Heap. Current Heap: [${currentHeap.join(', ')}]`);
      await new Promise(r => setTimeout(r, 900));

      if (currentHeap.length > k) {
        const popped = currentHeap.shift()!;
        setHeap([...currentHeap]);
        setActionText(`Heap size ${currentHeap.length + 1} > K (${k}). Popped smallest element ${popped} from root!`);
        await new Promise(r => setTimeout(r, 900));
      }
    }

    setActionText(`Finished processing array! Root of Min-Heap size ${k} is ${currentHeap[0]} (The ${k}nd Largest Element).`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setStepIdx(-1);
    setHeap([]);
    setActionText('Ready to start Kth Largest simulation');
    setIsRunning(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow"
          >
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Running...' : 'Animate Kth Largest'}
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
          <span className="text-muted-foreground">Target Rank K: <strong className="text-amber-400">K = {k}</strong></span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
            Min-Heap Strategy (Size ≤ {k})
          </span>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* INPUT STREAM VS MIN-HEAP PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* INPUT ARRAY STREAM */}
        <div className="lg:col-span-5 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Input Array Stream `nums`
          </span>

          <div className="flex flex-wrap gap-2 justify-center py-4">
            {nums.map((val, idx) => {
              const isCurrent = stepIdx === idx;
              const isProcessed = stepIdx > idx;

              return (
                <div key={`kth-input-${idx}`} className="flex flex-col items-center gap-1">
                  <motion.div
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    className={`
                      w-11 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-md border-2 transition-all
                      ${isCurrent ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/30' :
                        isProcessed ? 'bg-muted border-border text-muted-foreground opacity-50' :
                        'bg-background border-border text-foreground'}
                    `}
                  >
                    {val}
                  </motion.div>
                  <span className="text-[9px] font-mono text-muted-foreground">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            By maintaining a Min-Heap of size K, elements smaller than the top K are evicted at the root, leaving only the K largest values in the heap!
          </p>
        </div>

        {/* MIN-HEAP OF FIXED SIZE K */}
        <div className="lg:col-span-7 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4 border-emerald-500/30">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              Active Min-Heap (Max Capacity: K = {k})
            </span>
            <span className="text-xs font-mono text-muted-foreground">Current Root = Kth Largest Candidate</span>
          </div>

          <div className="flex gap-4 justify-center py-6">
            <AnimatePresence>
              {heap.map((val, idx) => {
                const isRootCandidate = idx === 0;

                return (
                  <motion.div
                    key={`kth-heap-${idx}-${val}`}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    layout
                    className={`
                      w-16 h-20 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-xl shadow-lg border-2 relative transition-all
                      ${isRootCandidate
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-105 ring-4 ring-emerald-500/10'
                        : 'bg-background border-border text-foreground'}
                    `}
                  >
                    <span>{val}</span>
                    <span className="text-[9px] font-sans text-muted-foreground/60 font-normal absolute -bottom-5">
                      {isRootCandidate ? 'Root (Kth Largest)' : `[${idx}]`}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-xs font-mono text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Time Complexity:</span>
              <span className="text-emerald-400 font-bold">O(N log K)</span>
            </div>
            <div className="flex justify-between">
              <span>Space Overhead:</span>
              <span className="text-primary font-bold">O(K) auxiliary memory</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
