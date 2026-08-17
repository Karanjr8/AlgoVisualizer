import { AnimatePresence, motion } from 'framer-motion';
import type { AlgorithmEventType, VisualizationFrame } from '../../types/visualizer';
import { cn } from '../../lib/utils';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { Target, Info, Sparkles, CheckCircle2, GraduationCap, BrainCircuit, ArrowRight } from 'lucide-react';
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
      <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 min-h-[200px] flex flex-col justify-center max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-6 text-primary font-black">
          <BrainCircuit className="w-8 h-8" />
          <h3 className="text-2xl uppercase tracking-wider">Algorithm Intuition</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed text-lg font-medium">
          {content?.intuition || 'Watch how this algorithm organizes the data step-by-step.'}
        </p>
      </div>
    );
  }

  if (mode === 'interview') {
    return (
      <div className="bg-amber-500/5 rounded-2xl p-8 border border-amber-500/20 min-h-[200px] flex flex-col justify-center max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-6 text-amber-500 font-black">
          <GraduationCap className="w-8 h-8" />
          <h3 className="text-2xl uppercase tracking-wider">Interview Insights</h3>
        </div>
        <div className="space-y-6">
          <div className="bg-background rounded-xl p-6 border border-border shadow-sm">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground block mb-4">Time Complexity</span>
            <div className="text-base font-mono text-foreground flex flex-wrap gap-8">
              <span className="flex items-center gap-2">Best <ArrowRight className="w-4 h-4 text-muted-foreground"/> <span className="text-green-500 font-bold">{content?.complexities.time.best}</span></span>
              <span className="flex items-center gap-2">Average <ArrowRight className="w-4 h-4 text-muted-foreground"/> <span className="text-amber-500 font-bold">{content?.complexities.time.average}</span></span>
              <span className="flex items-center gap-2">Worst <ArrowRight className="w-4 h-4 text-muted-foreground"/> <span className="text-destructive font-bold">{content?.complexities.time.worst}</span></span>
            </div>
          </div>
          {content?.interviewNotes?.tips[0] && (
            <div className="flex gap-4 items-start bg-amber-500/10 rounded-xl p-6 border border-amber-500/20">
              <Info className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
              <p className="text-base font-medium text-amber-700 dark:text-amber-300 leading-relaxed">
                {content.interviewNotes.tips[0]}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Execution Mode (Structured Vertical Flow)
  return (
    <div className="flex flex-col min-h-[240px] max-w-5xl mx-auto w-full bg-card rounded-3xl border border-border shadow-xl p-6 md:p-8">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <AnimatePresence mode="wait">
          {event ? (
            <motion.span
              key={`label-${stepKey}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'inline-flex items-center rounded-xl border px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-sm',
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
              className="inline-flex items-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold uppercase tracking-wider text-muted-foreground shadow-sm"
            >
              Ready
            </motion.span>
          )}
        </AnimatePresence>

        {totalFrames > 0 && (
          <span className="text-sm font-bold text-muted-foreground tabular-nums shrink-0 bg-background px-5 py-2 rounded-xl border border-border shadow-sm">
            Step {Math.min(currentIndex + 1, totalFrames)} / {totalFrames}
          </span>
        )}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex-1 flex flex-col gap-6"
        >
          {context ? (
            <>
              {/* GOAL SECTION */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" /> Goal
                </span>
                <p className="text-lg md:text-xl font-semibold text-foreground leading-snug">
                  {context.goal}
                </p>
              </div>

              {/* ACTION & WHY SECTIONS (Stacked or Side-by-Side dynamically) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col gap-2 bg-background rounded-2xl p-6 border border-border shadow-sm">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" /> Current Action
                  </span>
                  <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                    {context.action || event?.explanation}
                  </p>
                </div>
                
                {context.why ? (
                  <div className="flex flex-col gap-2 bg-amber-500/5 rounded-2xl p-6 border border-amber-500/20 shadow-sm">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-500" /> Observation / Why
                    </span>
                    <p className="text-base sm:text-lg text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
                      {context.why}
                    </p>
                  </div>
                ) : (
                  <div className="hidden md:block"></div>
                )}
              </div>

              {/* RESULT SECTION */}
              {context.result && (
                <div className="flex flex-col gap-2 mt-4 pt-6 border-t border-border">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Result
                  </span>
                  <p className="text-lg font-bold text-foreground leading-snug">
                    {context.result}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[120px]">
              <p className="text-xl leading-relaxed text-muted-foreground font-medium text-center max-w-2xl">
                {event?.explanation ?? 'Press Play or step through to watch the algorithm execute.'}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
