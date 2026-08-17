import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const TopKFrequentVisualizer: React.FC<Props> = () => {
  const array = [1, 1, 1, 2, 2, 3];
  const k = 2;

  const [phase, setPhase] = useState<number>(0);
  const [freqMap, setFreqMap] = useState<Record<number, number>>({});
  const [heap, setHeap] = useState<{ val: number; freq: number }[]>([]);
  const [result, setResult] = useState<number[]>([]);
  const [actionText, setActionText] = useState<string>('Top K Frequent Elements Pipeline: Array → Frequency Map → Min-Heap size K → Result');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setFreqMap({});
    setHeap([]);
    setResult([]);

    // Stage 1: Build Frequency Map
    setPhase(1);
    setActionText('Stage 1: Building Frequency Map from Array...');
    await new Promise(r => setTimeout(r, 600));

    const map: Record<number, number> = {};
    for (const num of array) {
      map[num] = (map[num] || 0) + 1;
      setFreqMap({ ...map });
      setActionText(`Counting element ${num} → frequency is now ${map[num]}`);
      await new Promise(r => setTimeout(r, 600));
    }

    // Stage 2: Push into Min-Heap of size K
    setPhase(2);
    setActionText('Stage 2: Inserting (val, frequency) entries into Min-Heap of size K = 2...');
    await new Promise(r => setTimeout(r, 800));

    let currentHeap: { val: number; freq: number }[] = [];
    for (const [valStr, freq] of Object.entries(map)) {
      const val = Number(valStr);
      currentHeap.push({ val, freq });
      currentHeap.sort((a, b) => a.freq - b.freq); // Min-Heap keyed by frequency
      setHeap([...currentHeap]);
      setActionText(`Pushed (${val}, freq: ${freq}) into Min-Heap. Size: ${currentHeap.length}`);
      await new Promise(r => setTimeout(r, 900));

      if (currentHeap.length > k) {
        const popped = currentHeap.shift()!;
        setHeap([...currentHeap]);
        setActionText(`Heap size > K (${k}). Evicted lower frequency element (${popped.val}, freq: ${popped.freq}) from root!`);
        await new Promise(r => setTimeout(r, 900));
      }
    }

    // Stage 3: Extract Result
    setPhase(3);
    const finalResult = currentHeap.map(item => item.val);
    setResult(finalResult);
    setActionText(`Stage 3: Extraction complete! The Top K = ${k} Frequent Elements are [${finalResult.join(', ')}]`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setPhase(0);
    setFreqMap({});
    setHeap([]);
    setResult([]);
    setActionText('Ready to demonstrate Top K Frequent Elements pipeline');
    setIsRunning(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls & Pipeline Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow"
          >
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Running Pipeline...' : 'Animate Pipeline'}
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={`px-2.5 py-1 rounded-lg border ${phase === 1 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold' : 'bg-muted text-muted-foreground'}`}>
            1. Freq Map
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className={`px-2.5 py-1 rounded-lg border ${phase === 2 ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-bold' : 'bg-muted text-muted-foreground'}`}>
            2. Min-Heap (K={k})
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className={`px-2.5 py-1 rounded-lg border ${phase === 3 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold' : 'bg-muted text-muted-foreground'}`}>
            3. Result
          </span>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* 4-STAGE PIPELINE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        
        {/* STAGE 1: INPUT ARRAY */}
        <div className="bg-card/60 border border-border/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-inner">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Stage 1: Input Array
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center py-2">
            {array.map((num, i) => (
              <span key={i} className="w-9 h-10 rounded-xl bg-background border border-border font-mono font-bold text-xs flex items-center justify-center">
                {num}
              </span>
            ))}
          </div>
          <span className="text-[10px] font-mono text-muted-foreground text-center">Target K = {k}</span>
        </div>

        {/* STAGE 2: FREQUENCY MAP */}
        <div className="bg-card/60 border border-border/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-inner">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Stage 2: Frequency Map
          </span>
          <div className="space-y-1.5 py-1 font-mono text-xs">
            {Object.entries(freqMap).map(([val, freq]) => (
              <div key={val} className="p-2 rounded-xl bg-background border border-border flex justify-between items-center">
                <span className="text-muted-foreground">Num <strong className="text-foreground">{val}</strong></span>
                <span className="font-bold text-amber-400">Freq: {freq}</span>
              </div>
            ))}
            {Object.keys(freqMap).length === 0 && (
              <div className="text-xs text-muted-foreground/50 text-center py-4">Waiting...</div>
            )}
          </div>
        </div>

        {/* STAGE 3: MIN-HEAP SIZE K */}
        <div className="bg-card/60 border border-border/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-inner border-blue-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            Stage 3: Min-Heap (Size ≤ {k})
          </span>
          <div className="space-y-1.5 py-1 font-mono text-xs">
            <AnimatePresence>
              {heap.map((item, idx) => (
                <motion.div
                  key={item.val}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`p-2 rounded-xl border flex justify-between items-center ${
                    idx === 0 ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold' : 'bg-background border-border text-foreground'
                  }`}
                >
                  <span>Val: {item.val}</span>
                  <span className="text-xs font-bold">Freq: {item.freq}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {heap.length === 0 && (
              <div className="text-xs text-muted-foreground/50 text-center py-4">Waiting...</div>
            )}
          </div>
        </div>

        {/* STAGE 4: OUTPUT RESULT */}
        <div className="bg-card/60 border border-border/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-inner border-emerald-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Stage 4: Top K Result
          </span>
          <div className="flex flex-wrap gap-2 justify-center py-4">
            {result.map((num, i) => (
              <span key={i} className="w-12 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 font-mono font-bold text-lg flex items-center justify-center shadow-md">
                {num}
              </span>
            ))}
            {result.length === 0 && (
              <div className="text-xs text-muted-foreground/50 text-center py-4">Waiting...</div>
            )}
          </div>
          <span className="text-[10px] font-mono text-emerald-400 text-center">Top {k} Most Frequent</span>
        </div>

      </div>
    </div>
  );
};
