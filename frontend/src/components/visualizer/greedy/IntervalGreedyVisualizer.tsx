import React from 'react';
import type { VisualizationFrame, AlgorithmType } from '../../../types/visualizer';

interface Props {
  algorithm: AlgorithmType;
  frame?: VisualizationFrame;
}

export const IntervalGreedyVisualizer: React.FC<Props> = ({ algorithm, frame }) => {
  const isBalloons = algorithm === 'minimum-arrows-balloons';
  const isMerge = algorithm === 'merge-intervals';
  const isInsert = algorithm === 'insert-interval';
  const isNonOverlap = algorithm === 'non-overlapping-intervals';

  const intervals = frame?.greedyState?.intervals || [
    { id: '1', start: 1, end: 3, status: 'normal' as const },
    { id: '2', start: 2, end: 6, status: 'normal' as const },
    { id: '3', start: 8, end: 10, status: 'normal' as const },
  ];

  const mergedIntervals = frame?.greedyState?.mergedIntervals || [
    { start: 1, end: 6 },
    { start: 8, end: 10 },
  ];

  const balloons = frame?.greedyState?.balloons || [
    { id: '1', start: 1, end: 6, bursted: true },
    { id: '2', start: 2, end: 8, bursted: true },
    { id: '3', start: 7, end: 12, bursted: true },
  ];

  const arrows = frame?.greedyState?.arrows || [{ id: 1, pos: 6 }, { id: 2, pos: 12 }];

  const maxCoord = 18;

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            Interval Greedy Engine
          </span>
          <span className="text-muted-foreground">
            {isBalloons && 'Shoot Arrow at Balloon End Coordinate'}
            {isMerge && 'Merge Overlapping Intervals Sorted by Start Time'}
            {isInsert && 'Linear 3-Phase Insert & Merge'}
            {isNonOverlap && 'Keep Earliest Finish Time Intervals'}
          </span>
        </div>
      </div>

      {/* BALLOONS VIEW */}
      {isBalloons ? (
        <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
            Balloons Intervals & Vertical Arrow Shots
          </span>

          <div className="relative w-full space-y-3 pt-4 font-mono text-xs">
            {balloons.map((b) => {
              const leftPct = (b.start / maxCoord) * 100;
              const widthPct = ((b.end - b.start) / maxCoord) * 100;

              return (
                <div key={`bal-${b.id}`} className="relative h-10 flex items-center bg-background/40 rounded-xl px-2">
                  <span className="w-16 text-xs text-muted-foreground">Bal #{b.id}:</span>
                  <div className="relative flex-1 h-full">
                    <div
                      className={`absolute top-1 bottom-1 rounded-xl flex items-center justify-center font-bold shadow transition-all ${
                        b.bursted
                          ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400'
                          : 'bg-muted border border-border text-muted-foreground'
                      }`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    >
                      [{b.start}, {b.end}]
                    </div>
                  </div>
                </div>
              );
            })}

            {/* VERTICAL ARROW LINES */}
            {arrows.map((a) => (
              <div
                key={`arrow-${a.id}`}
                className="absolute top-0 bottom-0 border-l-2 border-dashed border-rose-500 flex flex-col justify-start items-center"
                style={{ left: `${(a.pos / maxCoord) * 100}%` }}
              >
                <span className="bg-rose-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                  Arrow #{a.id} @ x={a.pos}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* STANDARD INTERVALS / MERGED VIEW */
        <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
            Intervals Result State
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs pt-2">
            {(isMerge || isInsert ? mergedIntervals : intervals).map((int: any, idx: number) => (
              <div
                key={`int-res-${idx}`}
                className="p-4 rounded-2xl bg-background/60 border border-border flex items-center justify-between shadow-sm"
              >
                <span className="text-muted-foreground">Interval #{idx + 1}</span>
                <span className="text-sm font-black text-emerald-400">
                  [{int.start ?? int.left}, {int.end ?? int.right}]
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
