import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const HeapSortVisualizer: React.FC<Props> = () => {
  const [array, setArray] = useState<number[]>([12, 11, 13, 5, 6, 7, 19, 3]);
  const [heapSize, setHeapSize] = useState<number>(8);
  const [phase, setPhase] = useState<'build' | 'extract' | 'complete'>('build');
  const [activeIndices, setActiveIndices] = useState<[number, number] | null>(null);
  const [actionText, setActionText] = useState<string>('Phase 1: Build Max Heap from unsorted array');
  const [isSorting, setIsSorting] = useState<boolean>(false);

  const getNodeCoordinates = (index: number, total: number) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelCount = Math.pow(2, level);
    const indexInLevel = index - (levelCount - 1);
    
    const width = 500;
    const yStep = 60;
    const y = 40 + level * yStep;
    const segmentWidth = width / (levelCount + 1);
    const x = segmentWidth * (indexInLevel + 1);

    return { x, y };
  };

  const heapify = async (arr: number[], n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      setActiveIndices([i, largest]);
      setActionText(`Swapping index ${i} (${arr[i]}) with larger child ${arr[largest]}`);
      await new Promise(r => setTimeout(r, 600));
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      setArray([...arr]);
      await heapify(arr, n, largest);
    }
  };

  const runHeapSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;

    // Phase 1: Build Max Heap
    setPhase('build');
    setActionText('Phase 1: Build Max Heap (Heapify internal nodes bottom-up)');
    const startIdx = Math.floor(n / 2) - 1;
    for (let i = startIdx; i >= 0; i--) {
      setActionText(`Phase 1: Heapifying internal node index ${i} (${arr[i]})`);
      await new Promise(r => setTimeout(r, 600));
      await heapify(arr, n, i);
    }

    // Phase 2: Repeated Extraction
    setPhase('extract');
    setActionText('Phase 2: Repeatedly swap Max Root to end and shrink Heap Size');
    for (let i = n - 1; i > 0; i--) {
      setHeapSize(i);
      setActiveIndices([0, i]);
      setActionText(`Swapping Max Root (${arr[0]}) with end index ${i} (${arr[i]}). Heap size shrinks to ${i}.`);
      await new Promise(r => setTimeout(r, 800));
      
      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      setArray([...arr]);

      setActionText(`Heapifying root after swap...`);
      await heapify(arr, i, 0);
    }

    setHeapSize(0);
    setActiveIndices(null);
    setPhase('complete');
    setActionText('Heap Sort Complete! Array is fully sorted in O(N log N) time and O(1) space.');
    setIsSorting(false);
  };

  const handleReset = () => {
    setArray([12, 11, 13, 5, 6, 7, 19, 3]);
    setHeapSize(8);
    setPhase('build');
    setActiveIndices(null);
    setActionText('Ready to demonstrate Heap Sort');
    setIsSorting(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls & Phase Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={runHeapSort}
            disabled={isSorting}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow"
          >
            <Play className="w-4 h-4 fill-current" /> {isSorting ? 'Sorting...' : 'Animate Heap Sort'}
          </button>
          <button
            onClick={handleReset}
            disabled={isSorting}
            className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`px-3 py-1 rounded-xl border ${phase === 'build' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-muted text-muted-foreground'}`}>
            Phase 1: Build Max Heap
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className={`px-3 py-1 rounded-xl border ${phase === 'extract' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-muted text-muted-foreground'}`}>
            Phase 2: Extract & Shrink Heap
          </span>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* DUAL DISPLAY CANVAS (TREE + ARRAY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* HEAP TREE CANVAS */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-4 min-h-[320px] flex flex-col justify-between relative overflow-hidden shadow-inner">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Active Max-Heap Tree (Size: {heapSize})
          </span>

          <div className="relative w-full h-[240px] flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {array.slice(0, heapSize).map((_, idx) => {
                if (idx === 0) return null;
                const parentIdx = Math.floor((idx - 1) / 2);
                if (parentIdx >= heapSize) return null;

                const from = getNodeCoordinates(parentIdx, heapSize);
                const to = getNodeCoordinates(idx, heapSize);

                return (
                  <line
                    key={`edge-hs-${idx}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#3f3f46"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>

            {array.slice(0, heapSize).map((val, idx) => {
              const pos = getNodeCoordinates(idx, heapSize);
              const isActive = activeIndices && (activeIndices[0] === idx || activeIndices[1] === idx);

              return (
                <motion.div
                  key={`hs-node-${idx}-${val}`}
                  layout
                  style={{ left: `${pos.x - 18}px`, top: `${pos.y - 18}px` }}
                  className={`
                    absolute w-9 h-9 rounded-full flex flex-col items-center justify-center font-mono font-bold text-xs shadow-md border-2 z-10 transition-all
                    ${isActive ? 'bg-amber-500 border-amber-400 text-black scale-110 shadow-amber-500/30' : 'bg-background border-border text-foreground'}
                  `}
                >
                  <span>{val}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ARRAY VIEW (ACTIVE HEAP VS SORTED REGION) */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
              Array: Active Heap Region vs Sorted Region
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              As Max Root is repeatedly swapped to the end, the active heap shrinks (left) while the sorted region grows (right).
            </p>
          </div>

          <div className="flex flex-wrap gap-2 py-8 justify-center">
            {array.map((val, idx) => {
              const inHeap = idx < heapSize;
              const isSorted = idx >= heapSize && phase === 'extract' || phase === 'complete';
              const isActive = activeIndices && (activeIndices[0] === idx || activeIndices[1] === idx);

              return (
                <div key={`hs-arr-${idx}`} className="flex flex-col items-center gap-1">
                  <motion.div
                    layout
                    className={`
                      w-11 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-md border-2 transition-all
                      ${isActive ? 'bg-amber-500 border-amber-400 text-black scale-110' :
                        isSorted ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-black' :
                        inHeap ? 'bg-background border-border text-foreground' :
                        'bg-muted border-border text-muted-foreground opacity-60'}
                    `}
                  >
                    {val}
                  </motion.div>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {isSorted ? 'Sorted' : `[${idx}]`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-xs font-mono flex justify-between">
            <span className="text-muted-foreground">Heap Partition: <strong className="text-amber-400">[0 .. {Math.max(0, heapSize - 1)}]</strong></span>
            <span className="text-muted-foreground">Sorted Partition: <strong className="text-emerald-400">[{heapSize} .. {array.length - 1}]</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
