import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const SlidingWindowMaxVisualizer: React.FC<Props> = () => {
  const arr = [1, 3, -1, -3, 5, 3, 6, 7];
  const k = 3;

  const [windowStart, setWindowStart] = useState<number>(-1);
  const [heap, setHeap] = useState<{ val: number; idx: number }[]>([]);
  const [maxResult, setMaxResult] = useState<number[]>([]);
  const [actionText, setActionText] = useState<string>(`Sliding Window Maximum: Array size N = ${arr.length}, Window K = ${k}`);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setMaxResult([]);
    let currentHeap: { val: number; idx: number }[] = [];
    const results: number[] = [];

    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const start = i - k + 1;
      if (start >= 0) setWindowStart(start);

      // Insert (val, idx) into Max-Heap
      currentHeap.push({ val, idx: i });
      currentHeap.sort((a, b) => b.val - a.val); // Max Heap by value
      setHeap([...currentHeap]);

      setActionText(`Step ${i + 1}: Pushed array[${i}] = ${val} into Max-Heap.`);
      await new Promise(r => setTimeout(r, 700));

      // Remove stale elements from root if index < windowStart
      if (start >= 0) {
        while (currentHeap.length > 0 && currentHeap[0].idx < start) {
          const stale = currentHeap.shift()!;
          setHeap([...currentHeap]);
          setActionText(`Stale element (${stale.val} at index ${stale.idx}) is out of active window [${start}..${i}]. Popped from root!`);
          await new Promise(r => setTimeout(r, 700));
        }

        results.push(currentHeap[0].val);
        setMaxResult([...results]);
        setActionText(`Window [${start}..${i}] Maximum is ${currentHeap[0].val} at root.`);
        await new Promise(r => setTimeout(r, 800));
      }
    }

    setActionText(`Simulation Complete! Sliding Window Maximums: [${results.join(', ')}]`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setWindowStart(-1);
    setHeap([]);
    setMaxResult([]);
    setActionText('Ready to start Sliding Window Maximum simulation');
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
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Sliding Window...' : 'Animate Window Max'}
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
          <span className="text-muted-foreground">Window Size K: <strong className="text-amber-400">K = {k}</strong></span>
          <span className="text-emerald-400 font-bold">O(N log K) Heap / O(N) Deque</span>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* MOVING WINDOW ARRAY VS MAX-HEAP vs RESULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ARRAY WITH HIGHLIGHTED SLIDING WINDOW */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Array with Active Sliding Window Box
          </span>

          <div className="flex flex-wrap gap-2 justify-center py-4">
            {arr.map((val, idx) => {
              const isInWindow = windowStart >= 0 && idx >= windowStart && idx < windowStart + k;

              return (
                <div key={`sw-arr-${idx}`} className="flex flex-col items-center gap-1">
                  <motion.div
                    animate={{ scale: isInWindow ? 1.1 : 1 }}
                    className={`
                      w-12 h-16 rounded-xl flex flex-col items-center justify-center font-mono shadow-md border-2 transition-all
                      ${isInWindow
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-black shadow-amber-500/20 ring-2 ring-amber-500/20'
                        : 'bg-background border-border text-foreground'}
                    `}
                  >
                    <span className="text-sm font-bold">{val}</span>
                  </motion.div>
                  <span className="text-[9px] font-mono text-muted-foreground">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            As the window slides right, older elements outside the active frame become stale. We lazily pop stale elements from the heap root.
          </p>
        </div>

        {/* MAX-HEAP & MAXIMUM RESULT ARRAY */}
        <div className="lg:col-span-6 grid grid-cols-1 gap-4">
          
          {/* MAX-HEAP (VAL, INDEX) */}
          <div className="bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner border-blue-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 font-sans px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/30 w-max">
              Max-Heap (Value, Array Index)
            </span>

            <div className="flex gap-3 justify-center py-3">
              <AnimatePresence>
                {heap.map((item, idx) => (
                  <motion.div
                    key={`sw-heap-${item.idx}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`w-14 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-mono shadow ${
                      idx === 0 ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold scale-105' : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <span className="text-base font-bold">{item.val}</span>
                    <span className="text-[9px] text-muted-foreground font-sans">idx:{item.idx}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* MAXIMUM RESULTS ARRAY */}
          <div className="bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner border-emerald-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 w-max">
              Sliding Window Maximum Output List
            </span>

            <div className="flex gap-2 flex-wrap justify-start py-3">
              {maxResult.map((val, idx) => (
                <span key={`sw-res-${idx}`} className="w-10 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-mono font-bold text-sm flex items-center justify-center shadow-sm">
                  {val}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
