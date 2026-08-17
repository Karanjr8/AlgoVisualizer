import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const TaskSchedulerVisualizer: React.FC<Props> = () => {
  const tasks = ['A', 'A', 'A', 'B', 'B', 'B'];
  const cooldown = 2;

  const [heap, setHeap] = useState<{ task: string; count: number }[]>([]);
  const [coolQueue, setCoolQueue] = useState<{ task: string; count: number; availTime: number }[]>([]);
  const [timeline, setTimeline] = useState<{ time: number; task: string }[]>([]);
  const [actionText, setActionText] = useState<string>(`Task Scheduler: Tasks ['A','A','A','B','B','B'], Cooldown n = ${cooldown}`);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setTimeline([]);
    setCoolQueue([]);

    // Step 1: Build initial Max-Heap of frequencies
    const map: Record<string, number> = {};
    for (const t of tasks) map[t] = (map[t] || 0) + 1;

    let currentHeap = Object.entries(map).map(([task, count]) => ({ task, count }));
    currentHeap.sort((a, b) => b.count - a.count); // Max-Heap by frequency
    setHeap([...currentHeap]);

    setActionText(`Initial Max-Heap built: [${currentHeap.map(h => `${h.task}:${h.count}`).join(', ')}]`);
    await new Promise(r => setTimeout(r, 800));

    let time = 0;
    let cool: { task: string; count: number; availTime: number }[] = [];
    const execTimeline: { time: number; task: string }[] = [];

    while (currentHeap.length > 0 || cool.length > 0) {
      time += 1;

      // Check if any task in cooldown is now available
      if (cool.length > 0 && cool[0].availTime <= time) {
        const item = cool.shift()!;
        currentHeap.push({ task: item.task, count: item.count });
        currentHeap.sort((a, b) => b.count - a.count);
        setHeap([...currentHeap]);
        setCoolQueue([...cool]);
        setActionText(`Time ${time}: Task ${item.task} exited cooldown queue and returned to Max-Heap.`);
        await new Promise(r => setTimeout(r, 600));
      }

      if (currentHeap.length > 0) {
        const top = currentHeap.shift()!;
        setHeap([...currentHeap]);
        execTimeline.push({ time, task: top.task });
        setTimeline([...execTimeline]);

        setActionText(`Time ${time}: Executed Task ${top.task} (Remaining frequency: ${top.count - 1}).`);
        await new Promise(r => setTimeout(r, 800));

        if (top.count - 1 > 0) {
          cool.push({ task: top.task, count: top.count - 1, availTime: time + cooldown + 1 });
          setCoolQueue([...cool]);
        }
      } else {
        // Idle slot
        execTimeline.push({ time, task: 'IDLE' });
        setTimeline([...execTimeline]);
        setActionText(`Time ${time}: All available tasks in cooldown. Inserted IDLE slot.`);
        await new Promise(r => setTimeout(r, 800));
      }
    }

    setActionText(`Simulation Complete! Minimum total time needed to schedule all tasks: ${time} CPU units.`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setHeap([]);
    setCoolQueue([]);
    setTimeline([]);
    setActionText('Ready to start Task Scheduler simulation');
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
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Scheduling...' : 'Animate Scheduler'}
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
          <span className="text-muted-foreground">Cooldown n: <strong className="text-amber-400">n = {cooldown}</strong></span>
          <span className="text-emerald-400 font-bold">Max-Heap + Cooldown Queue</span>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* MAX-HEAP VS COOLDOWN QUEUE VS EXECUTION TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* MAX-HEAP & COOLDOWN QUEUE */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4">
          
          {/* MAX-HEAP */}
          <div className="bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner border-amber-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30 w-max">
              Ready Task Max-Heap
            </span>

            <div className="flex gap-2 flex-wrap justify-center py-3">
              <AnimatePresence>
                {heap.map((item, idx) => (
                  <motion.div
                    key={`ts-heap-${item.task}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-12 h-14 rounded-xl border border-amber-500/40 bg-amber-500/20 text-amber-400 font-mono flex flex-col items-center justify-center shadow"
                  >
                    <span className="text-sm font-bold">{item.task}</span>
                    <span className="text-[9px] text-muted-foreground font-sans">cnt:{item.count}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* COOLDOWN QUEUE */}
          <div className="bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col justify-between shadow-inner border-blue-500/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 font-sans px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/30 w-max">
              Cooldown Queue (Task, Avail Time)
            </span>

            <div className="flex gap-2 flex-wrap justify-center py-3">
              <AnimatePresence>
                {coolQueue.map((item) => (
                  <motion.div
                    key={`ts-cool-${item.task}-${item.availTime}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-14 h-14 rounded-xl border border-blue-500/40 bg-blue-500/20 text-blue-400 font-mono flex flex-col items-center justify-center shadow"
                  >
                    <span className="text-sm font-bold">{item.task} ({item.count})</span>
                    <span className="text-[9px] text-muted-foreground font-sans">T={item.availTime}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* CPU EXECUTION TIMELINE */}
        <div className="lg:col-span-7 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 w-max">
            CPU Execution Timeline
          </span>

          <div className="flex flex-wrap gap-2 justify-start py-4">
            {timeline.map((slot) => {
              const isIdle = slot.task === 'IDLE';

              return (
                <div key={`timeline-${slot.time}`} className="flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`
                      w-11 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow border-2 transition-all
                      ${isIdle
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 italic'
                        : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'}
                    `}
                  >
                    {slot.task}
                  </motion.div>
                  <span className="text-[9px] font-mono text-muted-foreground">T={slot.time}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            CPU timeline records task execution and necessary IDLE slots to enforce the n = {cooldown} cooldown period between identical tasks.
          </p>
        </div>

      </div>
    </div>
  );
};
