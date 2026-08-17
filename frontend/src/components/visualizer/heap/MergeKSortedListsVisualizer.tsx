import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface ListNode {
  val: number;
  listId: number;
}

interface Props {
  frame?: VisualizationFrame;
}

export const MergeKSortedListsVisualizer: React.FC<Props> = () => {
  const initialLists: ListNode[][] = [
    [{ val: 1, listId: 1 }, { val: 4, listId: 1 }, { val: 7, listId: 1 }],
    [{ val: 2, listId: 2 }, { val: 5, listId: 2 }, { val: 8, listId: 2 }],
    [{ val: 3, listId: 3 }, { val: 6, listId: 3 }, { val: 9, listId: 3 }]
  ];

  const [lists, setLists] = useState<ListNode[][]>(initialLists);
  const [pointers, setPointers] = useState<number[]>([0, 0, 0]);
  const [heap, setHeap] = useState<ListNode[]>([]);
  const [merged, setMerged] = useState<number[]>([]);
  const [actionText, setActionText] = useState<string>('Merge K = 3 Sorted Lists using a Min-Heap storing active list head nodes');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setMerged([]);
    const ptrs = [0, 0, 0];
    setPointers([...ptrs]);

    // Step 1: Initialize Min-Heap with head of each list
    let currentHeap: ListNode[] = [];
    setActionText('Step 1: Pushing active head node of each of the K lists into Min-Heap...');
    await new Promise(r => setTimeout(r, 600));

    for (let l = 0; l < initialLists.length; l++) {
      if (initialLists[l].length > 0) {
        currentHeap.push(initialLists[l][0]);
      }
    }
    currentHeap.sort((a, b) => a.val - b.val);
    setHeap([...currentHeap]);
    setActionText(`Min-Heap initialized with heads: [${currentHeap.map(n => n.val).join(', ')}]`);
    await new Promise(r => setTimeout(r, 800));

    const mergedList: number[] = [];

    while (currentHeap.length > 0) {
      // Extract Min
      const minNode = currentHeap.shift()!;
      setHeap([...currentHeap]);
      mergedList.push(minNode.val);
      setMerged([...mergedList]);

      setActionText(`Extracted min node ${minNode.val} from List ${minNode.listId} into Merged List.`);
      await new Promise(r => setTimeout(r, 800));

      // Advance pointer of listId
      const lIdx = minNode.listId - 1;
      ptrs[lIdx] += 1;
      setPointers([...ptrs]);

      // Push next node if exists
      if (ptrs[lIdx] < initialLists[lIdx].length) {
        const nextNode = initialLists[lIdx][ptrs[lIdx]];
        currentHeap.push(nextNode);
        currentHeap.sort((a, b) => a.val - b.val);
        setHeap([...currentHeap]);
        setActionText(`Pushed next node ${nextNode.val} from List ${nextNode.listId} into Min-Heap.`);
        await new Promise(r => setTimeout(r, 800));
      }
    }

    setActionText('Merge Complete! All K lists merged into a single sorted output list.');
    setIsRunning(false);
  };

  const handleReset = () => {
    setLists(initialLists);
    setPointers([0, 0, 0]);
    setHeap([]);
    setMerged([]);
    setActionText('Ready to start Merge K Sorted Lists simulation');
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
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Merging...' : 'Animate Merge K Lists'}
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
          <span className="text-muted-foreground">Number of Lists K: <strong className="text-amber-400">K = 3</strong></span>
          <span className="text-emerald-400 font-bold">Time O(N log K)</span>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* K INPUT LISTS VS MIN-HEAP VS OUTPUT MERGED LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* K SORTED INPUT LISTS */}
        <div className="lg:col-span-5 bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            K = 3 Sorted Input Lists
          </span>

          <div className="space-y-3 py-2">
            {lists.map((list, listIdx) => (
              <div key={`list-${listIdx}`} className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 w-12 shrink-0">L{listIdx + 1}:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {list.map((node, nodeIdx) => {
                    const isHead = pointers[listIdx] === nodeIdx;
                    const isProcessed = pointers[listIdx] > nodeIdx;

                    return (
                      <div key={`node-${listIdx}-${nodeIdx}`} className="flex items-center gap-1">
                        <span
                          className={`w-9 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow border-2 transition-all ${
                            isHead ? 'bg-amber-500/20 border-amber-500 text-amber-400 ring-2 ring-amber-500/20 scale-105' :
                            isProcessed ? 'bg-muted border-border text-muted-foreground opacity-40 line-through' :
                            'bg-background border-border text-foreground'
                          }`}
                        >
                          {node.val}
                        </span>
                        {nodeIdx < list.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground/40" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MIN-HEAP OF LIST HEADS & MERGED RESULT */}
        <div className="lg:col-span-7 grid grid-cols-1 gap-4">
          
          {/* MIN-HEAP */}
          <div className="bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner border-blue-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 font-sans px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/30 w-max">
              Min-Heap of Active Heads (Size ≤ K)
            </span>

            <div className="flex gap-3 justify-center py-4">
              <AnimatePresence>
                {heap.map((node, idx) => (
                  <motion.div
                    key={`mk-heap-${node.listId}-${node.val}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`w-14 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-mono shadow ${
                      idx === 0 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold scale-105' : 'bg-background border-border text-foreground'
                    }`}
                  >
                    <span className="text-base font-bold">{node.val}</span>
                    <span className="text-[9px] text-muted-foreground font-sans">L{node.listId}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* OUTPUT MERGED LIST */}
          <div className="bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner border-emerald-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 w-max">
              Consolidated Merged Output List
            </span>

            <div className="flex gap-1.5 flex-wrap justify-start py-3">
              {merged.map((val, idx) => (
                <span key={`merged-${idx}`} className="w-9 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shadow-sm">
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
