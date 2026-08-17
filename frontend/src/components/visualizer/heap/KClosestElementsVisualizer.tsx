import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const KClosestElementsVisualizer: React.FC<Props> = () => {
  const arr = [1, 2, 3, 4, 5, 8, 10];
  const target = 4;
  const k = 4;

  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [heap, setHeap] = useState<{ val: number; dist: number }[]>([]);
  const [actionText, setActionText] = useState<string>(`Find K = ${k} closest elements to Target = ${target} using Max-Heap of distances`);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    let currentHeap: { val: number; dist: number }[] = [];

    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const dist = Math.abs(val - target);
      setActiveIdx(i);

      currentHeap.push({ val, dist });
      // Max Heap by distance (if distance tie, larger value is larger)
      currentHeap.sort((a, b) => b.dist - a.dist || b.val - a.val);
      setHeap([...currentHeap]);

      setActionText(`Step ${i + 1}: Element ${val} has distance |${val} - ${target}| = ${dist}. Inserted into Heap.`);
      await new Promise(r => setTimeout(r, 900));

      if (currentHeap.length > k) {
        const popped = currentHeap.shift()!;
        setHeap([...currentHeap]);
        setActionText(`Heap size > K (${k}). Popped element with largest distance (${popped.val}, dist: ${popped.dist}) from root!`);
        await new Promise(r => setTimeout(r, 900));
      }
    }

    const finalResult = currentHeap.map(item => item.val).sort((a, b) => a - b);
    setActionText(`Simulation Complete! The K = ${k} closest elements to ${target} are [${finalResult.join(', ')}]`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setActiveIdx(-1);
    setHeap([]);
    setActionText('Ready to start K Closest Elements simulation');
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
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Running...' : 'Animate K Closest'}
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
          <span className="text-muted-foreground">Target: <strong className="text-amber-400">{target}</strong></span>
          <span className="text-muted-foreground">K: <strong className="text-emerald-400">{k}</strong></span>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* ARRAY DISTANCES VS MAX-HEAP PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* INPUT ARRAY WITH DISTANCE LABELS */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Array Elements & Distance to Target ({target})
          </span>

          <div className="flex flex-wrap gap-2 justify-center py-4">
            {arr.map((val, idx) => {
              const dist = Math.abs(val - target);
              const isCurrent = activeIdx === idx;
              const isInHeap = heap.some(h => h.val === val);

              return (
                <div key={`kc-${idx}`} className="flex flex-col items-center gap-1">
                  <motion.div
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    className={`
                      w-12 h-16 rounded-xl flex flex-col items-center justify-center font-mono shadow-md border-2 transition-all
                      ${isCurrent ? 'bg-amber-500 border-amber-400 text-black font-bold' :
                        isInHeap ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' :
                        'bg-background border-border text-foreground'}
                    `}
                  >
                    <span className="text-sm font-bold">{val}</span>
                    <span className="text-[9px] font-sans text-muted-foreground">|d|={dist}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Max-Heap keeps the largest distance candidate at the root. When heap size exceeds K, the furthest element is popped from root!
          </p>
        </div>

        {/* MAX-HEAP OF SIZE K (DISTANCES) */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4 border-amber-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
            Max-Heap of Size K = {k} (Keyed by Distance)
          </span>

          <div className="flex flex-wrap gap-3 justify-center py-4">
            <AnimatePresence>
              {heap.map((item, idx) => (
                <motion.div
                  key={`kc-heap-${item.val}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-mono shadow-md ${
                    idx === 0 ? 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold' : 'bg-background border-border text-foreground'
                  }`}
                >
                  <span className="text-base font-bold">{item.val}</span>
                  <span className="text-[10px] text-muted-foreground">dist: {item.dist}</span>
                  <span className="text-[8px] font-sans text-muted-foreground/60">{idx === 0 ? 'Root (Furthest)' : ''}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-xs font-mono text-muted-foreground flex justify-between">
            <span>Complexity: <strong className="text-emerald-400">O(N log K)</strong></span>
            <span>Space: <strong className="text-primary">O(K)</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
