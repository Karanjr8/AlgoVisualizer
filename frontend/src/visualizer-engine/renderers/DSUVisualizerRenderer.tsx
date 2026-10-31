import React from 'react';
import { motion } from 'framer-motion';
import { DSUVisualizerState } from '../types/ds-states';
import { ArrowUp, Network } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  state: DSUVisualizerState;
}

export const DSUVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { elements, componentsCount, unionPair, findPath } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4 select-none">
      {/* Component Count Header */}
      <div className="flex items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
          <Network className="w-4 h-4" />
          <span>Disjoint Components: {componentsCount}</span>
        </div>
        {unionPair && (
          <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 font-bold">
            Active Union: ({unionPair[0]}, {unionPair[1]})
          </span>
        )}
      </div>

      {/* DSU Node Elements Grid */}
      <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl px-4 py-4">
        {elements.map((el) => {
          const isRoot = el.parentId === el.id;
          const isInFindPath = findPath && findPath.includes(el.value);
          const parentVal = el.parentId.replace('dsu-', '');

          let borderClass = 'border-border/80 bg-card text-foreground';
          if (isRoot) {
            borderClass = 'border-primary bg-primary/15 text-primary ring-2 ring-primary/40';
          } else if (isInFindPath) {
            borderClass = 'border-amber-500 bg-amber-500/20 text-amber-300 ring-2 ring-amber-500/50';
          }

          return (
            <motion.div
              key={el.id}
              layout
              className={cn(
                'w-20 p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 shadow-md transition-all duration-200',
                borderClass
              )}
            >
              {/* Element Value */}
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-mono font-bold text-base">
                {el.value}
              </div>

              {/* Parent Pointer Indicator */}
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-muted-foreground">
                <ArrowUp className="w-3 h-3 text-primary" />
                <span>parent: {isRoot ? 'SELF' : parentVal}</span>
              </div>

              {/* Rank & Size Badges */}
              <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground/80">
                <span>rk:{el.rank}</span>
                <span>•</span>
                <span>sz:{el.size}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
