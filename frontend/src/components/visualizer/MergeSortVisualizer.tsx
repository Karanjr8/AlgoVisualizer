import { motion, AnimatePresence } from 'framer-motion';
import type { VisualizationFrame } from '../../types/visualizer';
import { cn } from '../../lib/utils';
import { Layers, Database, ArrowRight } from 'lucide-react';

interface MergeSortVisualizerProps {
  frame?: VisualizationFrame;
}

export const MergeSortVisualizer = ({ frame }: MergeSortVisualizerProps) => {
  const elements = frame?.elements || [];
  const state = frame?.mergeSortState;

  const stage = state?.stage || 'STAGE_1_ORIGINAL';
  const currentDepth = state?.currentDepth ?? 0;
  const activeRange = state?.activeRange || [0, Math.max(0, elements.length - 1)];
  const midIndex = state?.midIndex;
  const tempArray = state?.tempArray || [];
  const comparedPair = state?.comparedPair;
  const explanation = state?.currentActionText || frame?.event.explanation || 'Executing Merge Sort...';

  // Helper to color elements cleanly without clutter
  const getElementStyle = (elState: string, index: number) => {
    if (elState === 'comparing') {
      return 'bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/50 shadow-lg scale-110 z-20'; // Yellow
    }
    if (elState === 'found') {
      return 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'; // Green
    }
    if (elState === 'sorted') {
      return 'bg-cyan-500 text-cyan-950 border-cyan-300 shadow-sm'; // Cyan
    }
    if (elState === 'selected') {
      return 'bg-blue-500 text-white border-blue-400 shadow-sm'; // Blue (Left)
    }
    if (elState === 'swapping') {
      return 'bg-purple-500 text-white border-purple-400 shadow-sm'; // Purple (Right)
    }
    if (index >= activeRange[0] && index <= activeRange[1]) {
      if (midIndex !== undefined) {
        if (index <= midIndex) return 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold';
        return 'bg-purple-500/20 border-purple-500 text-purple-400 font-bold';
      }
      return 'bg-primary/20 border-primary text-primary font-bold';
    }
    return 'bg-secondary/60 text-muted-foreground border-border/60 opacity-40';
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4">
      {/* TOP HEADER: Clean Single Status Badge */}
      <div className="w-full flex items-center justify-between gap-4 bg-card border border-border rounded-2xl px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-primary/10 text-primary">
            <Layers className="w-5 h-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase text-muted-foreground tracking-wider">
              Subproblem [{activeRange[0]}..{activeRange[1]}]
            </span>
            <span className="text-sm font-bold text-foreground">
              {stage === 'STAGE_1_ORIGINAL' && 'Stage 1 — Original Array'}
              {stage === 'STAGE_2_DIVIDE' && `Stage 2 — Divide at mid=${midIndex}`}
              {stage === 'STAGE_3_TREE' && 'Stage 3 — Base Case (Size 1)'}
              {stage === 'STAGE_4_COMPARE' && `Stage 4 — Comparing Elements`}
              {stage === 'STAGE_5_TEMP' && 'Stage 5 — Auxiliary Temp Memory'}
              {stage === 'STAGE_6_FINAL_MERGE' && 'Stage 6 — Copy Merged Array Back'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold border border-border">
            Depth {currentDepth}
          </span>
          {comparedPair && (
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-500 border border-amber-400/30 text-xs font-black animate-pulse">
              Comparing {comparedPair[0]} vs {comparedPair[1]}
            </span>
          )}
        </div>
      </div>

      {/* MAIN ARRAY STAGE */}
      <div className="w-full bg-card/80 backdrop-blur-md rounded-3xl border border-border p-6 md:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Main Array
          </span>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" /> Left Half</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> Right Half</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" /> Comparing</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-500" /> Merged</span>
          </div>
        </div>

        {/* Array Elements */}
        <div className="w-full flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-6 min-h-[100px]">
          {elements.map((el, idx) => {
            const isLeft = midIndex !== undefined && idx >= activeRange[0] && idx <= midIndex;
            const isRight = midIndex !== undefined && idx > midIndex && idx <= activeRange[1];

            return (
              <div key={`el-${el.id}`} className="flex flex-col items-center gap-1.5 relative">
                {/* Pointer Label */}
                {idx === activeRange[0] && isLeft && (
                  <span className="absolute -top-7 text-[10px] font-black uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                    L
                  </span>
                )}
                {midIndex !== undefined && idx === midIndex + 1 && isRight && (
                  <span className="absolute -top-7 text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                    R
                  </span>
                )}

                <motion.div
                  layout
                  animate={{
                    y: el.state === 'comparing' ? -10 : 0,
                    scale: el.state === 'comparing' ? 1.1 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={cn(
                    'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-base sm:text-lg border-2 shadow-sm transition-all',
                    getElementStyle(el.state, idx)
                  )}
                >
                  {el.value}
                </motion.div>
                <span className="text-[10px] font-mono text-muted-foreground">{idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AUXILIARY TEMP ARRAY (O(N) Space) */}
      <div className="w-full bg-emerald-500/5 rounded-3xl border border-emerald-500/20 p-6 shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-emerald-500 tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" /> Auxiliary Temp Array (O(N) Auxiliary Space)
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            Building sorted merge result
          </span>
        </div>

        <div className="w-full flex items-center gap-2 overflow-x-auto py-2 min-h-[64px]">
          <AnimatePresence>
            {tempArray.map((el, tIdx) => (
              <motion.div
                key={`temp-${el.id}-${tIdx}`}
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500 text-white font-black text-base flex items-center justify-center border-2 border-emerald-400 shadow-md shadow-emerald-500/20"
              >
                {el.value}
              </motion.div>
            ))}
          </AnimatePresence>
          {tempArray.length === 0 && (
            <span className="text-xs text-muted-foreground italic font-medium px-2">
              Temp array is empty. Elements are placed here in sorted order during comparison.
            </span>
          )}
        </div>
      </div>

      {/* FOOTER: Clean Step Explanation */}
      <div className="w-full bg-card rounded-2xl border border-border p-5 shadow-sm flex items-center gap-3">
        <ArrowRight className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm font-semibold text-foreground leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
};
