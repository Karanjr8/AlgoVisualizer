import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Plus, Trash2, Sparkles } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
  defaultType?: 'max' | 'min';
}

export const HeapStandardVisualizer: React.FC<Props> = ({ frame, defaultType = 'max' }) => {
  const [heapType, setHeapType] = useState<'max' | 'min'>(defaultType);
  const [heap, setHeap] = useState<number[]>([50, 30, 40, 10, 20, 35, 15]);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [swapPair, setSwapPair] = useState<[number, number] | null>(null);
  const [actionText, setActionText] = useState<string>('Interactive Binary Heap Engine Ready');
  const [inputValue, setInputValue] = useState<number>(45);

  // If a frame is passed from simulation engine, use its elements
  const currentArray = frame?.elements?.map(e => e.value) || heap;
  const activeFrameText = frame?.event?.explanation || actionText;

  // Helper for binary tree node coordinates
  const getNodeCoordinates = (index: number, total: number) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelCount = Math.pow(2, level);
    const indexInLevel = index - (levelCount - 1);
    
    const width = 600;
    const yStep = 70;
    const y = 50 + level * yStep;

    const segmentWidth = width / (levelCount + 1);
    const x = segmentWidth * (indexInLevel + 1);

    return { x, y };
  };

  const bubbleUp = async (arr: number[], index: number) => {
    let curr = index;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      const condition = heapType === 'max' ? arr[curr] > arr[parent] : arr[curr] < arr[parent];
      if (condition) {
        setSwapPair([curr, parent]);
        setActionText(`Swapping index ${curr} (${arr[curr]}) with parent index ${parent} (${arr[parent]})`);
        await new Promise(r => setTimeout(r, 600));
        const temp = arr[curr];
        arr[curr] = arr[parent];
        arr[parent] = temp;
        setHeap([...arr]);
        curr = parent;
      } else {
        break;
      }
    }
    setSwapPair(null);
    setHighlightIdx(null);
    setActionText(`Heap property restored for ${heapType.toUpperCase()} Heap`);
  };

  const handleInsert = async () => {
    const val = Number(inputValue) || Math.floor(Math.random() * 90) + 10;
    const newArr = [...heap, val];
    setHeap(newArr);
    setActionText(`Inserted ${val} at index ${newArr.length - 1}. Bubbling up...`);
    setHighlightIdx(newArr.length - 1);
    await new Promise(r => setTimeout(r, 600));
    await bubbleUp(newArr, newArr.length - 1);
  };

  const siftDown = async (arr: number[], index: number, length: number) => {
    let curr = index;
    while (true) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let target = curr;

      if (left < length) {
        const condLeft = heapType === 'max' ? arr[left] > arr[target] : arr[left] < arr[target];
        if (condLeft) target = left;
      }
      if (right < length) {
        const condRight = heapType === 'max' ? arr[right] > arr[target] : arr[right] < arr[target];
        if (condRight) target = right;
      }

      if (target !== curr) {
        setSwapPair([curr, target]);
        setActionText(`Heapify Down: Swapping root ${arr[curr]} with child ${arr[target]}`);
        await new Promise(r => setTimeout(r, 600));
        const temp = arr[curr];
        arr[curr] = arr[target];
        arr[target] = temp;
        setHeap([...arr]);
        curr = target;
      } else {
        break;
      }
    }
    setSwapPair(null);
    setHighlightIdx(null);
    setActionText(`Heapify Down complete.`);
  };

  const handleExtract = async () => {
    if (heap.length === 0) return;
    const extracted = heap[0];
    const newArr = [...heap];
    const last = newArr.pop()!;
    if (newArr.length > 0) {
      newArr[0] = last;
      setHeap(newArr);
      setActionText(`Extracted root ${extracted}. Replaced root with last element ${last}. Sifting down...`);
      setHighlightIdx(0);
      await new Promise(r => setTimeout(r, 600));
      await siftDown(newArr, 0, newArr.length);
    } else {
      setHeap([]);
      setActionText(`Extracted final element ${extracted}. Heap is now empty.`);
    }
  };

  const handleBuildHeap = async () => {
    const raw = [12, 35, 87, 24, 9, 65, 42, 51];
    setHeap(raw);
    setActionText(`Building ${heapType.toUpperCase()} Heap from unsorted array: [${raw.join(', ')}]`);
    await new Promise(r => setTimeout(r, 800));
    
    const arr = [...raw];
    const startIdx = Math.floor(arr.length / 2) - 1;
    for (let i = startIdx; i >= 0; i--) {
      setActionText(`Running Heapify down at internal parent index ${i} (${arr[i]})`);
      setHighlightIdx(i);
      await new Promise(r => setTimeout(r, 600));
      await siftDown(arr, i, arr.length);
    }
    setActionText(`Build Heap O(N) Complete!`);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHeapType(t => t === 'max' ? 'min' : 'max')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              heapType === 'max'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
            }`}
          >
            Mode: {heapType.toUpperCase()} HEAP
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(Number(e.target.value))}
              className="w-20 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleInsert}
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" /> Insert
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExtract}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Extract Root
          </button>
          <button
            onClick={handleBuildHeap}
            className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-500/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Build Heap O(N)
          </button>
          <button
            onClick={() => { setHeap([50, 30, 40, 10, 20, 35, 15]); setActionText('Reset to default heap'); }}
            className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {activeFrameText}
      </div>

      {/* DUAL DISPLAY CONTAINER (TREE + ARRAY SIMULTANEOUSLY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* TREE REPRESENTATION CANVAS */}
        <div className="lg:col-span-7 bg-card/60 border border-border/80 rounded-3xl p-4 min-h-[340px] flex flex-col justify-between relative overflow-hidden shadow-inner">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Binary Tree View (2D Coordinate Spatial Nodes)
          </span>

          <div className="relative w-full h-[280px] flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {currentArray.map((_, idx) => {
                if (idx === 0) return null;
                const parentIdx = Math.floor((idx - 1) / 2);
                const from = getNodeCoordinates(parentIdx, currentArray.length);
                const to = getNodeCoordinates(idx, currentArray.length);

                const isSwappingEdge = swapPair && (
                  (swapPair[0] === idx && swapPair[1] === parentIdx) ||
                  (swapPair[1] === idx && swapPair[0] === parentIdx)
                );

                return (
                  <line
                    key={`edge-${idx}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isSwappingEdge ? '#f59e0b' : '#3f3f46'}
                    strokeWidth={isSwappingEdge ? 3 : 1.5}
                    strokeDasharray={isSwappingEdge ? '4' : 'none'}
                  />
                );
              })}
            </svg>

            {currentArray.map((val, idx) => {
              const pos = getNodeCoordinates(idx, currentArray.length);
              const isHighlight = highlightIdx === idx;
              const isSwapping = swapPair && (swapPair[0] === idx || swapPair[1] === idx);
              const isRoot = idx === 0;

              return (
                <motion.div
                  key={`node-${idx}-${val}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: isSwapping ? 1.2 : 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{ left: `${pos.x - 20}px`, top: `${pos.y - 20}px` }}
                  className={`
                    absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-mono font-bold text-xs shadow-lg border-2 z-10 cursor-default transition-colors
                    ${isRoot ? 'bg-amber-500/20 border-amber-500 text-amber-400 ring-2 ring-amber-500/20' : 
                      isSwapping ? 'bg-amber-500 border-amber-400 text-black shadow-amber-500/40' :
                      isHighlight ? 'bg-blue-500/20 border-blue-400 text-blue-400' :
                      'bg-background border-border text-foreground'}
                  `}
                >
                  <span>{val}</span>
                  <span className="text-[9px] font-sans text-muted-foreground/60 font-normal absolute -bottom-4">
                    [{idx}]
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ARRAY REPRESENTATION CONTAINER */}
        <div className="lg:col-span-5 bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
              Flat Contiguous Array Representation
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No memory pointers needed! The tree structure is mapped directly to array indices using fast arithmetic.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 py-6 justify-center">
            {currentArray.map((val, idx) => {
              const isSwapping = swapPair && (swapPair[0] === idx || swapPair[1] === idx);
              const isRoot = idx === 0;

              return (
                <div key={`arr-${idx}`} className="flex flex-col items-center gap-1">
                  <motion.div
                    layout
                    className={`
                      w-11 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-md border-2 transition-all
                      ${isRoot ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-black' :
                        isSwapping ? 'bg-amber-500 border-amber-400 text-black scale-110 shadow-lg' :
                        'bg-background border-border text-foreground'}
                    `}
                  >
                    {val}
                  </motion.div>
                  <span className="text-[10px] font-mono text-muted-foreground">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-xs font-mono space-y-1">
            <div className="flex justify-between text-muted-foreground">
              <span>Parent Index:</span>
              <span className="text-amber-400 font-bold">⌊(i - 1) / 2⌋</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Left Child Index:</span>
              <span className="text-blue-400 font-bold">2i + 1</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Right Child Index:</span>
              <span className="text-emerald-400 font-bold">2i + 2</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
