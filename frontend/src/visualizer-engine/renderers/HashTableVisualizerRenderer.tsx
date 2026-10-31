import React from 'react';
import { motion } from 'framer-motion';
import { HashTableVisualizerState } from '../types/ds-states';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  state: HashTableVisualizerState;
}

export const HashTableVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { capacity, size, method, buckets, currentProbeIndices, loadFactor } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4 select-none">
      {/* Top Meta Details */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold uppercase">
          Method: {method.replace('-', ' ')}
        </div>
        <div className="px-3 py-1 rounded-full bg-secondary border border-border text-foreground">
          Capacity: <span className="font-bold">{capacity}</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-secondary border border-border text-foreground">
          Size: <span className="font-bold">{size}</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-secondary border border-border text-foreground">
          Load Factor: <span className="font-bold text-amber-400">{loadFactor}</span>
        </div>
      </div>

      {/* Bucket Array Rows */}
      <div className="w-full max-w-2xl flex flex-col gap-2.5 px-4 overflow-x-auto">
        {buckets.map((bucket) => {
          const isProbed = currentProbeIndices.includes(bucket.index);

          return (
            <motion.div
              key={bucket.index}
              layout
              className={cn(
                'w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200',
                isProbed
                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                  : 'border-border/70 bg-card/60'
              )}
            >
              {/* Bucket Index */}
              <div className="w-14 h-10 rounded-lg bg-background border border-border/80 flex flex-col items-center justify-center shrink-0">
                <span className="text-[9px] font-mono text-muted-foreground uppercase font-bold">Bucket</span>
                <span className="text-sm font-mono font-bold text-foreground">[{bucket.index}]</span>
              </div>

              {/* Bucket Entries List (Chaining or Single Slot) */}
              <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1">
                {bucket.entries.length === 0 ? (
                  <span className="text-xs font-mono text-muted-foreground/40 italic pl-2">
                    [ Empty Slot ]
                  </span>
                ) : (
                  bucket.entries.map((entry, idx) => (
                    <React.Fragment key={entry.id}>
                      {idx > 0 && <ArrowRight className="w-4 h-4 text-primary shrink-0" />}
                      <div
                        className={cn(
                          'px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs font-mono font-bold shadow-sm shrink-0',
                          entry.state === 'inserted'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-background border-border text-foreground'
                        )}
                      >
                        <span className="text-primary font-bold">"{entry.key}":</span>
                        <span>{JSON.stringify(entry.value)}</span>
                      </div>
                    </React.Fragment>
                  ))
                )}
              </div>

              {/* Collision Badge */}
              {bucket.isColliding && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Collision ({bucket.entries.length})</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
