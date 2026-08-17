import React from 'react';
import { motion } from 'framer-motion';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const ActivitySelectionVisualizer: React.FC<Props> = ({ frame }) => {
  const activities = frame?.greedyState?.activities || [
    { id: 'A', name: 'A', start: 1, end: 3, selected: true },
    { id: 'B', name: 'B', start: 2, end: 5, discarded: true },
    { id: 'C', name: 'C', start: 4, end: 6, selected: true },
    { id: 'D', name: 'D', start: 6, end: 7, selected: true },
  ];

  const maxTime = 8;
  const timeTicks = Array.from({ length: maxTime + 1 }, (_, i) => i);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            Activity Selection Timeline
          </span>
          <span className="text-muted-foreground">Criterion: Sort by Earliest Finish Time (end_i)</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Selected
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Conflicting / Discarded
          </span>
        </div>
      </div>

      {/* TIMELINE RULER & INTERVAL BARS GRID */}
      <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-6 overflow-x-auto">
        
        {/* TIMELINE RULER */}
        <div className="relative w-full h-8 border-b border-border/80 flex items-center">
          {timeTicks.map((t) => (
            <div
              key={`tick-${t}`}
              className="absolute text-[10px] font-mono text-muted-foreground flex flex-col items-center"
              style={{ left: `${(t / maxTime) * 100}%` }}
            >
              <span>T={t}</span>
              <div className="w-0.5 h-2 bg-border mt-1" />
            </div>
          ))}
        </div>

        {/* INTERVAL BARS */}
        <div className="space-y-4 pt-2">
          {activities.map((act) => {
            const leftPct = (act.start / maxTime) * 100;
            const widthPct = ((act.end - act.start) / maxTime) * 100;

            const isSelected = act.selected;
            const isDiscarded = act.discarded;

            return (
              <div key={`act-${act.id}`} className="relative h-12 flex items-center bg-background/40 rounded-xl px-2">
                <span className="w-8 text-xs font-mono font-bold text-muted-foreground">
                  {act.name || act.id}:
                </span>

                <div className="relative flex-1 h-full">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                    className={`absolute top-1 bottom-1 rounded-xl flex items-center justify-between px-3 font-mono text-xs font-bold shadow-md transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 shadow-emerald-500/10'
                        : isDiscarded
                        ? 'bg-rose-500/10 border-2 border-rose-500/40 text-rose-400/50 line-through opacity-60'
                        : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    }`}
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      transformOrigin: 'left'
                    }}
                  >
                    <span>{act.name || act.id}</span>
                    <span className="text-[10px] opacity-80">[{act.start}, {act.end}]</span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
