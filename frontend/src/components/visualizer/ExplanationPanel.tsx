import { AnimatePresence, motion } from 'framer-motion';
import type { AlgorithmEventType, VisualizationFrame } from '../../types/visualizer';
import { cn } from '../../lib/utils';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { Target, Info, Sparkles, CheckCircle2, GraduationCap, BrainCircuit } from 'lucide-react';
import { algorithmContent } from '../../data/algorithmContent';

const EVENT_LABELS: Record<AlgorithmEventType, string> = {
  INIT: 'Getting Started',
  COMPARE: 'Comparing',
  SWAP: 'Swapping',
  NO_SWAP: 'No Swap Needed',
  SELECT: 'Selecting',
  INSERT: 'Inserting',
  DIVIDE: 'Dividing',
  MERGE: 'Merging',
  PIVOT: 'Pivot',
  PARTITION: 'Partitioning',
  HEAPIFY: 'Heapifying',
  EXTRACT: 'Extracting',
  PASS_COMPLETE: 'Pass Complete',
  SEARCH: 'Searching',
  FOUND: 'Found',
  ELIMINATE: 'Eliminating',
  COMPLETE: 'Complete',
  SLIDE_WINDOW: 'Sliding Window',
  EXPAND_WINDOW: 'Expanding Window',
  SHRINK_WINDOW: 'Shrinking Window',
  CHECK_CONDITION: 'Checking Condition',
  UPDATE_BEST: 'Updating Best',
  CALL: 'Calling Function',
  RETURN: 'Returning Value',
  BASE_CASE: 'Base Case Reached',
};

const EVENT_COLORS: Record<string, string> = {
  INIT: 'bg-primary/10 text-primary border-primary/20',
  COMPARE: 'bg-viz-comparing/10 text-viz-comparing border-viz-comparing/20',
  SWAP: 'bg-destructive/10 text-destructive border-destructive/20',
  NO_SWAP: 'bg-muted text-muted-foreground border-border',
  SELECT: 'bg-primary/10 text-primary border-primary/20',
  INSERT: 'bg-secondary text-secondary-foreground border-border',
  DIVIDE: 'bg-primary/10 text-primary border-primary/20',
  MERGE: 'bg-viz-sorted/10 text-viz-sorted border-viz-sorted/20',
  PIVOT: 'bg-viz-comparing/10 text-viz-comparing border-viz-comparing/20',
  PARTITION: 'bg-muted text-muted-foreground border-border',
  HEAPIFY: 'bg-primary/10 text-primary border-primary/20',
  EXTRACT: 'bg-viz-found/10 text-viz-found border-viz-found/20',
  PASS_COMPLETE: 'bg-viz-sorted/10 text-viz-sorted border-viz-sorted/20',
  SEARCH: 'bg-primary/10 text-primary border-primary/20',
  FOUND: 'bg-viz-found/10 text-viz-found border-viz-found/20 ring-2 ring-viz-found/50',
  ELIMINATE: 'bg-muted text-muted-foreground border-border',
  COMPLETE: 'bg-viz-sorted/10 text-viz-sorted border-viz-sorted/20',
  SLIDE_WINDOW: 'bg-primary/10 text-primary border-primary/20',
  EXPAND_WINDOW: 'bg-secondary text-secondary-foreground border-border',
  SHRINK_WINDOW: 'bg-destructive/10 text-destructive border-destructive/20',
  CHECK_CONDITION: 'bg-viz-comparing/10 text-viz-comparing border-viz-comparing/20',
  UPDATE_BEST: 'bg-viz-found/10 text-viz-found border-viz-found/20',
};

interface ExplanationPanelProps {
  frame: VisualizationFrame | null;
  currentIndex: number;
  totalFrames: number;
}

export const ExplanationPanel = ({ frame, currentIndex, totalFrames }: ExplanationPanelProps) => {
  const { mode, algorithm } = useVisualizerStore();
  const event = frame?.event;
  const context = frame?.context;
  const content = algorithmContent[algorithm];
  
  const stepKey = frame ? `${currentIndex}-${event?.type}` : 'idle';

  if (mode === 'intuition') {
    return (
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 min-h-[160px] flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4 text-primary font-bold">
          <BrainCircuit className="w-5 h-5" />
          <h3 className="text-lg uppercase tracking-wider">Algorithm Intuition</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
          {content?.intuition || 'Watch how this algorithm organizes the data step-by-step.'}
        </p>
      </div>
    );
  }

  if (mode === 'interview') {
    return (
      <div className="bg-amber-500/5 rounded-xl p-6 border border-amber-500/20 min-h-[160px] flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4 text-amber-500 font-bold">
          <GraduationCap className="w-5 h-5" />
          <h3 className="text-lg uppercase tracking-wider">Interview Insights</h3>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase text-muted-foreground block mb-1">Time Complexity</span>
            <div className="text-sm font-mono text-foreground flex gap-4">
              <span>Best: <span className="text-green-400">{content?.complexities.time.best}</span></span>
              <span>Avg: <span className="text-yellow-400">{content?.complexities.time.average}</span></span>
              <span>Worst: <span className="text-red-400">{content?.complexities.time.worst}</span></span>
            </div>
          </div>
          {content?.interviewNotes?.tips[0] && (
            <p className="text-sm text-muted-foreground border-l-2 border-amber-500/50 pl-3">
              {content.interviewNotes.tips[0]}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Execution Mode (Default 5-Part Structure)
  return (
    <div className="flex flex-col min-h-[180px]">
      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border/50">
        <AnimatePresence mode="wait">
          {event ? (
            <motion.span
              key={`label-${stepKey}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                EVENT_COLORS[event.type],
              )}
            >
              {EVENT_LABELS[event.type]}
            </motion.span>
          ) : (
            <motion.span
              key="label-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Ready
            </motion.span>
          )}
        </AnimatePresence>

        {totalFrames > 0 && (
          <span className="text-xs font-medium text-muted-foreground tabular-nums shrink-0 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
            Step {Math.min(currentIndex + 1, totalFrames)} / {totalFrames}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepKey}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1"
        >
          {context ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Target className="w-3 h-3 text-blue-400" /> Goal
                  </span>
                  <p className="text-sm font-medium text-foreground">{context.goal}</p>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3 text-purple-400" /> Current Action
                  </span>
                  <p className="text-sm font-medium text-foreground">{context.action || event?.explanation}</p>
                </div>
              </div>

              <div className="space-y-4">
                {context.why && (
                  <div className="flex flex-col bg-muted/50 p-3 rounded-lg border border-border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Info className="w-3 h-3 text-amber-400" /> Why
                    </span>
                    <p className="text-sm text-muted-foreground">{context.why}</p>
                  </div>
                )}

                {context.result && (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-green-400" /> Result
                    </span>
                    <p className="text-sm font-medium text-foreground">{context.result}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-base leading-relaxed text-foreground font-medium flex items-center h-full">
              {event?.explanation ?? 'Press Play or step through to watch the algorithm execute.'}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
