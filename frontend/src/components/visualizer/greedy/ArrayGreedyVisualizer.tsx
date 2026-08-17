import React from 'react';
import type { VisualizationFrame, AlgorithmType } from '../../../types/visualizer';

interface Props {
  algorithm: AlgorithmType;
  frame?: VisualizationFrame;
}

export const ArrayGreedyVisualizer: React.FC<Props> = ({ algorithm, frame }) => {
  const isJump = algorithm === 'jump-game' || algorithm === 'jump-game-ii';
  const isGas = algorithm === 'gas-station';
  const isCandy = algorithm === 'candy-distribution';

  const jumpArr = frame?.greedyState?.jumpArray || [2, 3, 1, 1, 4];
  const maxReach = frame?.greedyState?.maxReach ?? 4;
  const currentIdx = frame?.greedyState?.currentIndex ?? 1;

  const gasStations = frame?.greedyState?.gasStations || [
    { gas: 1, cost: 3, net: -2 },
    { gas: 2, cost: 4, net: -2 },
    { gas: 3, cost: 5, net: -2 },
    { gas: 4, cost: 1, net: +3 },
    { gas: 5, cost: 2, net: +3 },
  ];
  const startStation = frame?.greedyState?.startIndex ?? 3;

  const candies = frame?.greedyState?.candies || [2, 1, 2];

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            Array Greedy Engine
          </span>
          <span className="text-muted-foreground">
            {isJump && 'Track Farthest Reachable Index maxReach'}
            {isGas && 'Circular Circuit Net Fuel Surplus & Reset Points'}
            {isCandy && 'Two-Pass Left & Right Neighbor Distribution'}
          </span>
        </div>
      </div>

      {/* JUMP GAME VISUALIZER */}
      {isJump && (
        <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-amber-400 font-bold">Current Index: {currentIdx}</span>
            <span className="text-emerald-400 font-bold">Farthest Reachable (maxReach): {maxReach}</span>
          </div>

          <div className="flex flex-wrap gap-3 py-2 justify-center font-mono">
            {jumpArr.map((val, idx) => {
              const isCurrent = idx === currentIdx;
              const isReachable = idx <= maxReach;

              return (
                <div
                  key={`jump-${idx}`}
                  className={`w-16 h-20 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold shadow-md scale-105'
                      : isReachable
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-background/40 border-border/60 text-muted-foreground opacity-50'
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">idx #{idx}</span>
                  <span className="text-2xl font-black">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GAS STATION VISUALIZER */}
      {isGas && (
        <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="text-xs font-mono text-emerald-400 font-bold">
            Valid Starting Gas Station Index: #{startStation}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            {gasStations.map((st, idx) => {
              const isStart = idx === startStation;

              return (
                <div
                  key={`gas-st-${idx}`}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    isStart
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold shadow-md scale-105'
                      : st.net < 0
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400/70'
                      : 'bg-background/40 border-border text-foreground'
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">Station #{idx}</span>
                  <span className="text-xs">Gas: {st.gas} | Cost: {st.cost}</span>
                  <span className="text-sm font-black mt-1">Net: {st.net > 0 ? `+${st.net}` : st.net}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CANDY DISTRIBUTION VISUALIZER */}
      {isCandy && (
        <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="text-xs font-mono text-emerald-400 font-bold">
            Minimum Total Candies Required: {candies.reduce((a, b) => a + b, 0)}
          </div>

          <div className="flex flex-wrap gap-4 py-2 justify-center font-mono">
            {candies.map((c, idx) => (
              <div
                key={`candy-${idx}`}
                className="w-20 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex flex-col items-center justify-center gap-1 shadow-sm"
              >
                <span className="text-[10px] text-muted-foreground">Child #{idx + 1}</span>
                <span className="text-2xl font-black">{c} 🍬</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
