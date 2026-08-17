import React from 'react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const MinimumPlatformsVisualizer: React.FC<Props> = ({ frame }) => {
  const platformsCount = frame?.greedyState?.platformsCount ?? 2;
  const maxPlatforms = frame?.greedyState?.maxPlatforms ?? 3;
  const activeTrains = frame?.greedyState?.activeTrains || ['Train 1', 'Train 2', 'Train 3'];

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            Minimum Platforms Tracker
          </span>
          <span className="text-muted-foreground">Criterion: Sort arr[] & dep[] independently + Sweep Line</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-amber-400 font-bold">Active Platforms: {platformsCount}</span>
          <span className="text-emerald-400 font-bold">Peak Required: {maxPlatforms}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: ACTIVE PLATFORM TRACKS */}
        <div className="lg:col-span-8 bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
            Railway Station Platform Tracks
          </span>

          <div className="space-y-3 pt-2">
            {Array.from({ length: Math.max(3, maxPlatforms) }).map((_, idx) => {
              const platformNum = idx + 1;
              const trainOnPlatform = activeTrains[idx];
              const isOccupied = Boolean(trainOnPlatform);

              return (
                <div
                  key={`platform-${platformNum}`}
                  className={`p-4 rounded-2xl border flex items-center justify-between font-mono text-xs transition-all ${
                    isOccupied
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold shadow-md'
                      : 'bg-background/40 border-border/60 text-muted-foreground/40 border-dashed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-muted-foreground">Track #{platformNum}</span>
                    <span className="text-sm font-bold text-foreground">
                      {isOccupied ? trainOnPlatform : 'EMPTY TRACK'}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${isOccupied ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-muted text-muted-foreground'}`}>
                    {isOccupied ? 'Occupied' : 'Free'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: PEAK COUNTER SUMMARY */}
        <div className="lg:col-span-4 bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
            Peak Platforms Metric
          </span>

          <div className="p-6 rounded-3xl bg-background/60 border border-border flex flex-col items-center justify-center space-y-2">
            <span className="text-xs text-muted-foreground font-mono">Max Concurrent Trains</span>
            <span className="text-5xl font-black font-mono text-emerald-400">{maxPlatforms}</span>
            <span className="text-[10px] text-muted-foreground font-mono">Platforms Guaranteed</span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Every train arrival increments platform count; departure decrements it. The peak simultaneous count gives the minimum required platforms.
          </p>
        </div>

      </div>
    </div>
  );
};
