import { motion, AnimatePresence } from 'framer-motion';
import type { CallStackFrame } from '../../types/visualizer';
import { cn } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';

interface Props {
  callStack?: CallStackFrame[];
}

export const CallStackRenderer = ({ callStack }: Props) => {
  if (!callStack || callStack.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-muted-foreground font-mono">Call stack is empty</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-card/50 border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-3 relative overflow-hidden">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 border-b border-border/50 pb-2 flex items-center justify-between">
          <span>Call Stack</span>
          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px]">LIFO</span>
        </h3>
        
        <div className="flex flex-col-reverse gap-3">
          <AnimatePresence initial={false}>
            {callStack.map((frame, idx) => {
              const isTop = idx === callStack.length - 1;
              return (
                <motion.div
                  key={frame.id}
                  layout
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, backgroundColor: '#22c55e20' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={cn(
                    "flex flex-col p-4 rounded-2xl border-2 transition-all relative",
                    frame.status === 'resolving' ? "bg-green-500/10 border-green-500/50" :
                    frame.status === 'resolved' ? "bg-muted border-border opacity-50" :
                    isTop ? "bg-primary/10 border-primary shadow-lg shadow-primary/10 ring-4 ring-primary/5" : 
                    "bg-card border-border/50"
                  )}
                >
                  {isTop && frame.status === 'pending' && (
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                      <ArrowRight className="w-3 h-3" /> ACTIVE
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn("font-mono font-bold text-base sm:text-lg", isTop ? "text-primary" : "text-foreground")}>
                      {frame.name}({Object.values(frame.args).join(', ')})
                    </span>
                    {frame.returnedValue !== undefined && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500 text-green-100 px-2 py-1 rounded font-mono text-sm font-bold shadow-sm"
                      >
                        Return: {frame.returnedValue}
                      </motion.span>
                    )}
                  </div>

                  <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                    {Object.entries(frame.args).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-1">
                        <span className="text-foreground/50">{key}:</span>
                        <span className="text-foreground font-semibold">{val}</span>
                      </div>
                    ))}
                    {frame.locals && Object.entries(frame.locals).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-1 ml-4 border-l border-border pl-4">
                        <span className="text-purple-400/70">{key}:</span>
                        <span className="text-purple-400 font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
