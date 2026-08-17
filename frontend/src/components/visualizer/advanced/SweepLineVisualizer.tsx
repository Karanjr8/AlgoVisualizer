import React, { useState } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const SweepLineVisualizer: React.FC<Props> = () => {
  const events = [
    { time: 0, delta: 1, desc: 'Time 0: Meeting 1 Starts (+1 room)' },
    { time: 5, delta: 1, desc: 'Time 5: Meeting 2 Starts (+1 room)' },
    { time: 10, delta: -1, desc: 'Time 10: Meeting 2 Ends (-1 room)' },
    { time: 15, delta: 1, desc: 'Time 15: Meeting 3 Starts (+1 room)' },
    { time: 20, delta: -1, desc: 'Time 20: Meeting 3 Ends (-1 room)' },
    { time: 30, delta: -1, desc: 'Time 30: Meeting 1 Ends (-1 room)' }
  ];

  const [stepIdx, setStepIdx] = useState<number>(0);
  const [activeRooms, setActiveRooms] = useState<number>(0);
  const [peakRooms, setPeakRooms] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>(
    'Click "Sweep Forward" to advance the vertical sweep line across sorted interval event points.'
  );

  const handleStep = () => {
    if (stepIdx >= events.length) return;

    const ev = events[stepIdx];
    const nextActive = activeRooms + ev.delta;
    const nextPeak = Math.max(peakRooms, nextActive);

    setActiveRooms(nextActive);
    setPeakRooms(nextPeak);
    setExplanation(`${ev.desc}. Currently active rooms = ${nextActive}, Peak rooms required = ${nextPeak}.`);
    setStepIdx(prev => prev + 1);
  };

  const handleReset = () => {
    setStepIdx(0);
    setActiveRooms(0);
    setPeakRooms(0);
    setExplanation('Reset Sweep Line timeline.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" /> Sweep Line Event Engine
          </h3>
          <p className="text-xs text-muted-foreground">Process interval overlap events sorted by coordinate in O(N log N) time.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStep}
            disabled={stepIdx >= events.length}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Sweep Forward ({stepIdx < events.length ? `t=${events[stepIdx].time}` : 'Done'})
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Display */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            Sorted Event Timeline
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
            Peak Concurrency = {peakRooms} Rooms
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          {events.map((ev, i) => {
            const isPassed = i < stepIdx;
            const isCurrent = i === stepIdx - 1;

            return (
              <div
                key={i}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                  isCurrent
                    ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-105 shadow-lg shadow-amber-500/20'
                    : isPassed
                    ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                    : 'bg-background border-border text-muted-foreground opacity-50'
                }`}
              >
                <span className="text-[10px] text-muted-foreground">Time t = {ev.time}</span>
                <span className="text-base font-black">{ev.delta > 0 ? `+${ev.delta} Start` : `${ev.delta} End`}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
          <Activity className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">Sweep Line Insights</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>
    </div>
  );
};
