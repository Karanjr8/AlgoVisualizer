import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface PQItem {
  val: string;
  prio: number;
}

interface Props {
  frame?: VisualizationFrame;
}

export const PriorityQueueDesignVisualizer: React.FC<Props> = () => {
  const [pq, setPq] = useState<PQItem[]>([
    { val: 'Emergency Surgery', prio: 95 },
    { val: 'ICU Patient', prio: 85 },
    { val: 'Fracture Treatment', prio: 60 },
    { val: 'Fever Checkup', prio: 30 },
    { val: 'Routine Scan', prio: 20 }
  ]);
  const [inputVal, setInputVal] = useState<string>('Critical Trauma');
  const [inputPrio, setInputPrio] = useState<number>(90);
  const [actionText, setActionText] = useState<string>('Priority Queue Abstract Data Type (ADT) backed by Max Binary Heap');

  const bubbleUp = (arr: PQItem[], index: number) => {
    let curr = index;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (arr[curr].prio > arr[parent].prio) {
        const temp = arr[curr];
        arr[curr] = arr[parent];
        arr[parent] = temp;
        curr = parent;
      } else {
        break;
      }
    }
  };

  const handleEnqueue = () => {
    if (!inputVal) return;
    const newItem = { val: inputVal, prio: Number(inputPrio) || 50 };
    const arr = [...pq, newItem];
    bubbleUp(arr, arr.length - 1);
    setPq(arr);
    setActionText(`Enqueued "${newItem.val}" with Priority ${newItem.prio}. Bubbled up to correct heap position.`);
  };

  const siftDown = (arr: PQItem[], index: number) => {
    let curr = index;
    while (true) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let largest = curr;

      if (left < arr.length && arr[left].prio > arr[largest].prio) largest = left;
      if (right < arr.length && arr[right].prio > arr[largest].prio) largest = right;

      if (largest !== curr) {
        const temp = arr[curr];
        arr[curr] = arr[largest];
        arr[largest] = temp;
        curr = largest;
      } else {
        break;
      }
    }
  };

  const handleDequeue = () => {
    if (pq.length === 0) return;
    const dequeued = pq[0];
    const arr = [...pq];
    const last = arr.pop()!;
    if (arr.length > 0) {
      arr[0] = last;
      siftDown(arr, 0);
    }
    setPq(arr);
    setActionText(`Dequeued highest priority element "${dequeued.val}" (Priority ${dequeued.prio}). Root sifted down.`);
  };

  const handleReset = () => {
    setPq([
      { val: 'Emergency Surgery', prio: 95 },
      { val: 'ICU Patient', prio: 85 },
      { val: 'Fracture Treatment', prio: 60 },
      { val: 'Fever Checkup', prio: 30 },
      { val: 'Routine Scan', prio: 20 }
    ]);
    setActionText('Reset Priority Queue to default state.');
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Task Name"
            className="w-36 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            value={inputPrio}
            onChange={e => setInputPrio(Number(e.target.value))}
            placeholder="Prio"
            className="w-20 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleEnqueue}
            className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all shadow"
          >
            <Plus className="w-3.5 h-3.5" /> Enqueue
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDequeue}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Dequeue Highest Prio
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* PRIORITY QUEUE CONTAINER */}
      <div className="bg-card/60 border border-border/80 rounded-3xl p-5 space-y-4 shadow-inner">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
          Priority Queue Dynamic Binary Heap Elements
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 py-2">
          <AnimatePresence>
            {pq.map((item, idx) => (
              <motion.div
                key={`pq-item-${item.val}-${idx}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`p-3 rounded-2xl border-2 flex flex-col justify-between space-y-1 shadow ${
                  idx === 0 ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold scale-105' : 'bg-background border-border text-foreground'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[10px] text-muted-foreground">[{idx}]</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">Prio: {item.prio}</span>
                </div>
                <span className="text-xs font-bold truncate">{item.val}</span>
                <span className="text-[9px] font-sans text-muted-foreground">{idx === 0 ? 'Root (Next Dequeued)' : 'Child Node'}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
