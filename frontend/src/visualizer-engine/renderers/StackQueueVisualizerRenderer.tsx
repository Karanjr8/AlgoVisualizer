import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StackQueueVisualizerState } from '../types/ds-states';
import { AlertCircle, ArrowDown, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  state: StackQueueVisualizerState;
}

export const StackQueueVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { kind, items, capacity, overflow, underflow } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4 select-none">
      {/* Status Warning Banner */}
      {overflow && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono">
          <AlertCircle className="w-4 h-4" />
          <span>OVERFLOW: Capacity limit ({capacity}) reached!</span>
        </div>
      )}
      {underflow && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
          <AlertCircle className="w-4 h-4" />
          <span>UNDERFLOW: Operation attempted on empty structure!</span>
        </div>
      )}

      {/* STACK: Genuine Vertical Container with Open Top */}
      {kind === 'stack' && (
        <div className="flex flex-col items-center gap-3">
          {/* Top Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary tracking-wider">
            <ArrowDown className="w-4 h-4 animate-bounce" />
            <span>TOP (Index {items.length - 1})</span>
          </div>

          {/* Vertical Open-Top Bucket Container */}
          <div className="w-44 sm:w-52 border-b-4 border-l-4 border-r-4 border-primary/50 bg-background/50 rounded-b-2xl p-2.5 flex flex-col-reverse gap-2 min-h-[260px] shadow-inner">
            <AnimatePresence>
              {items.map((item, index) => {
                const isTop = index === items.length - 1;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -40, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={cn(
                      'w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-sm sm:text-base font-bold shadow-md',
                      isTop
                        ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary/40'
                        : 'bg-card border-border text-foreground'
                    )}
                  >
                    <span>{item.value}</span>
                    <span className="text-[10px] font-mono font-medium text-muted-foreground">
                      [{index}]
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs font-mono text-muted-foreground/60 py-16">
                [ Empty Stack ]
              </div>
            )}
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            LIFO (Last-In First-Out)
          </span>
        </div>
      )}

      {/* QUEUE / CIRCULAR QUEUE / DEQUE: Horizontal Tunnel Layout */}
      {kind !== 'stack' && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-3 text-xs font-mono font-bold text-muted-foreground">
            <div className="flex items-center gap-1 text-emerald-400">
              <span>FRONT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <span>• FIFO Queue Flow •</span>
            <div className="flex items-center gap-1 text-purple-400">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>REAR</span>
            </div>
          </div>

          {/* Horizontal Tube Container */}
          <div className="flex items-center justify-start gap-2 sm:gap-3 p-4 bg-background/50 border-t-2 border-b-2 border-primary/40 rounded-xl min-h-[90px] max-w-full overflow-x-auto">
            <AnimatePresence>
              {items.map((item, index) => {
                const isFront = index === 0;
                const isRear = index === items.length - 1;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 40, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -40, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={cn(
                      'w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex flex-col items-center justify-center font-bold text-base sm:text-lg shadow-md shrink-0 relative',
                      isFront
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40'
                        : isRear
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 ring-2 ring-purple-500/40'
                        : 'bg-card border-border text-foreground'
                    )}
                  >
                    <span>{item.value}</span>
                    <span className="text-[9px] font-mono text-muted-foreground font-normal">
                      [{index}]
                    </span>

                    {/* Badge */}
                    {(isFront || isRear) && (
                      <span className="absolute -bottom-5 text-[9px] font-mono font-bold tracking-wider text-muted-foreground uppercase">
                        {isFront && isRear ? 'F & R' : isFront ? 'FRONT' : 'REAR'}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="px-12 py-3 text-xs font-mono text-muted-foreground/60">
                [ Empty Queue ]
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
