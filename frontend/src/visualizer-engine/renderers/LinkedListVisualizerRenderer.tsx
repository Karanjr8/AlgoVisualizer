import React from 'react';
import { motion } from 'framer-motion';
import { LinkedListVisualizerState } from '../types/ds-states';
import { ArrowRight, ArrowLeftRight, Repeat } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  state: LinkedListVisualizerState;
}

export const LinkedListVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { nodes, kind } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-6 select-none overflow-x-auto">
      {/* List Type Badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-mono font-semibold">
        {kind === 'doubly' && <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />}
        {kind === 'circular' && <Repeat className="w-3.5 h-3.5 text-purple-400" />}
        <span>{kind.toUpperCase()} LINKED LIST (Size: {nodes.length})</span>
      </div>

      {/* Nodes Chain */}
      <div className="flex items-center gap-3 sm:gap-4 px-6 py-8 min-w-max">
        {nodes.length === 0 ? (
          <div className="text-muted-foreground font-mono text-sm py-8">List is Empty (HEAD = NULL)</div>
        ) : (
          nodes.map((node, index) => {
            let borderClass = 'border-border/80 bg-card';
            if (node.state === 'active') {
              borderClass = 'border-amber-500 bg-amber-500/20 ring-2 ring-amber-500/50 scale-105';
            } else if (node.state === 'highlight') {
              borderClass = 'border-primary bg-primary/20 ring-2 ring-primary/50 scale-110';
            } else if (node.state === 'new') {
              borderClass = 'border-emerald-500 bg-emerald-500/20 ring-2 ring-emerald-500/50 scale-105';
            } else if (node.state === 'deleting') {
              borderClass = 'border-rose-500 bg-rose-500/20 ring-2 ring-rose-500/50 opacity-60';
            }

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="flex flex-col items-center relative shrink-0"
                >
                  {/* Floating Pointers Header */}
                  {node.pointers && node.pointers.length > 0 && (
                    <div className="absolute -top-7 flex gap-1 items-center">
                      {node.pointers.map((p, i) => (
                        <span
                          key={i}
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-md uppercase tracking-wider',
                            p.includes('HEAD')
                              ? 'bg-primary text-primary-foreground'
                              : p.includes('TAIL')
                              ? 'bg-purple-600 text-white'
                              : 'bg-amber-500 text-black'
                          )}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dual Compartment Node: [ DATA | NEXT ] */}
                  <div className={cn('flex rounded-xl border overflow-hidden shadow-md transition-all', borderClass)}>
                    {/* Previous pointer field (for doubly linked list) */}
                    {kind === 'doubly' && (
                      <div className="w-7 h-14 bg-background/50 border-r border-border/60 flex items-center justify-center font-mono text-[9px] text-muted-foreground">
                        {node.prevId ? 'prev' : 'null'}
                      </div>
                    )}

                    {/* Value Field */}
                    <div className="w-12 h-14 sm:w-14 sm:h-14 flex items-center justify-center text-base sm:text-lg font-bold text-foreground">
                      {node.value}
                    </div>

                    {/* Next Pointer Field */}
                    <div className="w-8 h-14 bg-background/60 border-l border-border/60 flex items-center justify-center text-xs text-primary font-mono font-bold">
                      •
                    </div>
                  </div>

                  {/* Node Address / Identifier */}
                  <span className="text-[10px] font-mono text-muted-foreground mt-1.5">
                    {node.id.replace('node-', '#')}
                  </span>
                </motion.div>

                {/* Connecting Arrow */}
                {index < nodes.length - 1 && (
                  <div className="flex items-center text-primary/80 shrink-0">
                    {kind === 'doubly' ? (
                      <ArrowLeftRight className="w-6 h-6 stroke-[2.5]" />
                    ) : (
                      <ArrowRight className="w-6 h-6 stroke-[2.5]" />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}

        {/* Termination Indicator */}
        {nodes.length > 0 && (
          <div className="flex items-center gap-2 pl-1 shrink-0">
            {kind === 'circular' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-400 font-mono text-xs font-bold">
                <Repeat className="w-3.5 h-3.5" />
                <span>-&gt; HEAD</span>
              </div>
            ) : (
              <>
                <ArrowRight className="w-5 h-5 text-muted-foreground/60" />
                <div className="px-3 py-1.5 rounded-lg border border-dashed border-border bg-background/50 font-mono text-xs font-bold text-muted-foreground">
                  NULL
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
