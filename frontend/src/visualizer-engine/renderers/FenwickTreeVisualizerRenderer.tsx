import React from 'react';
import { motion } from 'framer-motion';
import { FenwickTreeVisualizerState } from '../types/ds-states';
import { cn } from '../../lib/utils';

interface Props {
  state: FenwickTreeVisualizerState;
}

export const FenwickTreeVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { cells, currentQuerySum } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4 select-none">
      {/* Current Query Sum Banner */}
      {currentQuerySum !== undefined && (
        <div className="px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
          Calculated Prefix Sum: <span className="text-sm font-black">{currentQuerySum}</span>
        </div>
      )}

      {/* BIT Array Grid with Responsibility Bars */}
      <div className="flex items-end justify-center gap-2 sm:gap-3 px-4 overflow-x-auto max-w-full pb-6 pt-4">
        {cells.map((cell) => {
          const isQueryStep = cell.state === 'query-step';
          const isUpdateStep = cell.state === 'update-step';
          const isActive = cell.state === 'active';

          let borderClass = 'border-border/80 bg-card text-foreground';
          if (isQueryStep) {
            borderClass = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/40 scale-105';
          } else if (isUpdateStep) {
            borderClass = 'border-amber-500 bg-amber-500/20 text-amber-300 ring-2 ring-amber-500/40 scale-105';
          } else if (isActive) {
            borderClass = 'border-primary bg-primary/20 text-primary';
          }

          return (
            <motion.div
              key={cell.index}
              layout
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              {/* Responsibility Window Badge */}
              <span className="px-1.5 py-0.5 rounded bg-background/60 border border-border/60 text-[9px] font-mono text-muted-foreground font-semibold">
                [{cell.responsibleRange[0]}-{cell.responsibleRange[1]}]
              </span>

              {/* Value Cell */}
              <div
                className={cn(
                  'w-13 h-14 sm:w-14 sm:h-16 rounded-xl border flex flex-col items-center justify-center font-bold text-sm sm:text-base shadow-sm transition-all duration-200',
                  borderClass
                )}
              >
                <span>{cell.value}</span>
                <span className="text-[9px] font-mono text-muted-foreground font-normal">
                  lowbit: {cell.lowbit}
                </span>
              </div>

              {/* 1-Based Index Label */}
              <span className="text-[11px] font-mono font-semibold text-primary">
                i = {cell.index}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
