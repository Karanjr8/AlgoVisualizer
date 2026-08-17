import React from 'react';
import { motion } from 'framer-motion';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const FractionalKnapsackVisualizer: React.FC<Props> = ({ frame }) => {
  const items = frame?.greedyState?.knapsackItems || [
    { id: '1', weight: 10, value: 60, ratio: 6.0, takenFraction: 1 },
    { id: '2', weight: 20, value: 100, ratio: 5.0, takenFraction: 1 },
    { id: '3', weight: 30, value: 120, ratio: 4.0, takenFraction: 0.67 },
  ];

  const maxCap = frame?.greedyState?.maxCapacity || 50;
  const currCap = frame?.greedyState?.currentCapacity ?? 0;
  const totalVal = frame?.greedyState?.totalValue ?? 240;

  const usedCap = maxCap - currCap;
  const fillPct = (usedCap / maxCap) * 100;

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            Fractional Knapsack Filling
          </span>
          <span className="text-muted-foreground">Criterion: Sort by Value/Weight Ratio (v_i / w_i)</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-emerald-400 font-bold">Total Profit: ${totalVal.toFixed(1)}</span>
          <span className="text-amber-400 font-bold">Capacity: {usedCap}/{maxCap} kg</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: ITEMS RATIO TABLE */}
        <div className="lg:col-span-7 bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
            Items Sorted by Ratio
          </span>

          <div className="space-y-3 pt-2">
            {items.map((item) => (
              <div
                key={`knap-item-${item.id}`}
                className={`p-4 rounded-2xl border flex items-center justify-between font-mono text-xs transition-all ${
                  item.takenFraction > 0
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-sm'
                    : 'bg-background/40 border-border/60 text-muted-foreground'
                }`}
              >
                <div>
                  <span className="font-bold text-foreground">Item #{item.id}</span>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Weight: {item.weight}kg | Value: ${item.value}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-amber-400">Ratio: {item.ratio.toFixed(1)} $/kg</div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                    Taken: {(item.takenFraction * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: KNAPSACK BAG CONTAINER ANIMATION */}
        <div className="lg:col-span-5 bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
            Knapsack Container ({usedCap} / {maxCap} kg)
          </span>

          {/* VISUAL BAG */}
          <div className="relative w-36 h-48 border-4 border-amber-500/60 rounded-b-3xl rounded-t-lg bg-background/60 overflow-hidden flex flex-col justify-end shadow-inner">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${fillPct}%` }}
              transition={{ duration: 0.6 }}
              className="w-full bg-gradient-to-t from-amber-500 via-yellow-500 to-amber-400/80 flex items-center justify-center text-black font-mono font-black text-xs shadow-lg"
            >
              {fillPct.toFixed(0)}% Full
            </motion.div>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed">
            Greedy choice fills highest ratio items first. Fractional item taken to utilize 100% of knapsack capacity.
          </div>
        </div>

      </div>
    </div>
  );
};
