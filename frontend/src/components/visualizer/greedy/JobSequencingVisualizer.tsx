import React from 'react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const JobSequencingVisualizer: React.FC<Props> = ({ frame }) => {
  const jobs = frame?.greedyState?.jobs || [
    { id: 'J4', profit: 100, deadline: 1, status: 'scheduled', slotAssigned: 1 },
    { id: 'J2', profit: 80, deadline: 1, status: 'skipped' },
    { id: 'J1', profit: 70, deadline: 4, status: 'scheduled', slotAssigned: 4 },
    { id: 'J3', profit: 30, deadline: 1, status: 'skipped' },
  ];

  const timeSlots = frame?.greedyState?.timeSlots || [
    { slot: 1, jobId: 'J4', profit: 100 },
    { slot: 2 },
    { slot: 3 },
    { slot: 4, jobId: 'J1', profit: 70 },
  ];

  const totalProfit = timeSlots.reduce((sum, s) => sum + (s.profit || 0), 0);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            Job Sequencing with Deadlines
          </span>
          <span className="text-muted-foreground">Criterion: Sort by Profit Descending + Latest Free Slot</span>
        </div>

        <div className="text-xs font-mono text-emerald-400 font-bold">
          Total Profit: ${totalProfit}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: JOBS PROFIT LIST */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
            Jobs Sorted by Profit
          </span>

          <div className="space-y-3 pt-2">
            {jobs.map((j) => {
              const isScheduled = j.status === 'scheduled';
              const isSkipped = j.status === 'skipped';

              return (
                <div
                  key={`job-${j.id}`}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between font-mono text-xs transition-all ${
                    isScheduled
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-sm'
                      : isSkipped
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400/60 line-through opacity-70'
                      : 'bg-background/40 border-border/60 text-muted-foreground'
                  }`}
                >
                  <div>
                    <span className="font-bold text-foreground">Job {j.id}</span>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Deadline: Slot {j.deadline}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-amber-400">${j.profit}</div>
                    <div className="text-[10px] uppercase font-bold mt-0.5">
                      {isScheduled ? `Scheduled (Slot ${j.slotAssigned})` : isSkipped ? 'Skipped' : 'Pending'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: TIMELINE SLOTS RESERVATION GRID */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 w-max">
            Timeline Slots Assignment
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
            {timeSlots.map((s) => {
              const isFilled = Boolean(s.jobId);
              return (
                <div
                  key={`slot-${s.slot}`}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 font-mono transition-all ${
                    isFilled
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold shadow-md'
                      : 'bg-background/40 border-border/60 text-muted-foreground/40 border-dashed'
                  }`}
                >
                  <span className="text-[10px] uppercase text-muted-foreground">Slot {s.slot}</span>
                  <span className="text-lg font-black">{isFilled ? s.jobId : 'EMPTY'}</span>
                  {isFilled && <span className="text-[10px] text-amber-400">${s.profit}</span>}
                </div>
              );
            })}
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed">
            High profit jobs are assigned to the latest available free slot ≤ deadline, leaving earlier slots available for tight deadlines.
          </div>
        </div>

      </div>
    </div>
  );
};
