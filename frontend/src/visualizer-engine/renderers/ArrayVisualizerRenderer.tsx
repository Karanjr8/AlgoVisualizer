import React from 'react';
import { motion } from 'framer-motion';
import { ArrayVisualizerState } from '../types/ds-states';
import { cn } from '../../lib/utils';

interface Props {
  state: ArrayVisualizerState;
}

export const ArrayVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { cells, comparisonsCount, swapsCount } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-6 select-none">
      {/* Top Metrics Badge */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
          Comparisons: <span className="font-bold">{comparisonsCount}</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
          Swaps: <span className="font-bold">{swapsCount}</span>
        </div>
      </div>

      {/* Array Elements Row */}
      <div className="flex items-end justify-center gap-2 sm:gap-3 px-4 overflow-x-auto max-w-full pb-6 pt-10">
        {cells.map((cell) => {
          let bgClass = 'bg-card border-border/80 text-foreground';
          if (cell.state === 'comparing') {
            bgClass = 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/50 scale-105';
          } else if (cell.state === 'swapping') {
            bgClass = 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/50 scale-110';
          } else if (cell.state === 'sorted') {
            bgClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
          } else if (cell.state === 'found') {
            bgClass = 'bg-green-500/30 border-green-500 text-green-300 ring-4 ring-green-500/50 scale-110 font-black';
          } else if (cell.state === 'current') {
            bgClass = 'bg-primary/25 border-primary text-primary scale-105';
          } else if (cell.state === 'eliminated') {
            bgClass = 'bg-muted/30 border-border/40 text-muted-foreground/50 opacity-40';
          }

          return (
            <motion.div
              key={cell.id}
              layout
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="flex flex-col items-center gap-1.5 shrink-0 relative"
            >
              {/* Pointer Labels above cell */}
              {cell.pointers && cell.pointers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 px-2 py-0.5 rounded bg-primary text-primary-foreground font-mono text-[10px] font-bold shadow-md uppercase tracking-wider shrink-0 z-10 whitespace-nowrap"
                >
                  {cell.pointers.join(', ')}
                </motion.div>
              )}

              {/* Value Box */}
              <div
                className={cn(
                  'w-12 h-14 sm:w-14 sm:h-16 rounded-xl border flex items-center justify-center text-base sm:text-lg font-bold shadow-sm transition-all duration-200',
                  bgClass
                )}
              >
                {cell.value}
              </div>

              {/* Index Indicator below cell */}
              <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                [{cell.index}]
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
