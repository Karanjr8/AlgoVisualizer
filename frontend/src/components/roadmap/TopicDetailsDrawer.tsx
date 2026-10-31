import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Play, Lock, BookOpen, Sparkles, ArrowRight, Code2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { RoadmapNodeData } from './RoadmapNode';

interface TopicDetailsDrawerProps {
  node: RoadmapNodeData | null;
  onClose: () => void;
  onToggleComplete: (nodeId: string) => void;
}

export const TopicDetailsDrawer: React.FC<TopicDetailsDrawerProps> = ({ node, onClose, onToggleComplete }) => {
  const navigate = useNavigate();

  if (!node) return null;

  const isCompleted = node.state === 'completed';
  const isCurrent = node.state === 'current';

  // Mock computed stats derived from topic details
  const conceptsCount = Math.floor(Math.random() * 3) + 7;
  const conceptsDone = isCompleted ? conceptsCount : isCurrent ? Math.floor(conceptsCount * 0.7) : 2;
  const problemsTotal = Math.floor(Math.random() * 15) + 25;
  const problemsDone = isCompleted ? problemsTotal : isCurrent ? Math.floor(problemsTotal * 0.5) : 4;
  const readiness = isCompleted ? 95 : isCurrent ? 68 : 20;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          className="relative w-full max-w-lg bg-card border-l border-border/80 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto z-10"
        >
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm flex items-center gap-1.5',
                  node.state === 'completed' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                  node.state === 'current' && 'bg-purple-500/10 border-purple-500/30 text-purple-400',
                  node.state === 'recommended' && 'bg-blue-500/10 border-blue-500/30 text-blue-400',
                  node.state === 'future' && 'bg-muted border-border text-muted-foreground'
                )}>
                  {node.state === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {node.state === 'current' && <Play className="w-3.5 h-3.5" />}
                  {node.state === 'future' && <Lock className="w-3.5 h-3.5" />}
                  {node.state.toUpperCase()}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-secondary border border-border text-[11px] font-bold text-muted-foreground">
                  {node.difficulty}
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Icon */}
            <div className="flex items-start gap-4">
              <div className={cn(
                'w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg',
                node.state === 'completed' && 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
                node.state === 'current' && 'bg-purple-500/10 border-purple-500/40 text-purple-400',
                node.state === 'recommended' && 'bg-blue-500/10 border-blue-500/40 text-blue-400',
                node.state === 'future' && 'bg-muted border-border text-muted-foreground'
              )}>
                <node.icon className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">{node.title}</h2>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Estimated Study Time: <span className="text-foreground font-bold">{node.estimatedTime}</span>
                </p>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-background/80 border border-border/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-purple-400" /> Concepts
                </span>
                <p className="text-lg font-black text-foreground">{conceptsDone} / {conceptsCount}</p>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(conceptsDone/conceptsCount)*100}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/80 border border-border/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Code2 className="w-3 h-3 text-blue-400" /> Problems
                </span>
                <p className="text-lg font-black text-foreground">{problemsDone} / {problemsTotal}</p>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(problemsDone/problemsTotal)*100}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/80 border border-border/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Visualizer
                </span>
                <p className={cn('text-sm font-bold', isCompleted ? 'text-emerald-400' : 'text-amber-400')}>
                  {isCompleted ? 'Completed' : 'In Progress'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-background/80 border border-border/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-emerald-400" /> Interview Ready
                </span>
                <p className="text-sm font-bold text-emerald-400">{readiness}%</p>
              </div>
            </div>

            {/* Prerequisites */}
            {node.prerequisites.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Prerequisites
                </span>
                <div className="flex flex-wrap gap-2">
                  {node.prerequisites.map(req => (
                    <span key={req} className="px-3 py-1 rounded-xl bg-secondary border border-border text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-border/80">
            <button
              onClick={() => {
                onClose();
                navigate(`/explore/${node.id}`);
              }}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-black text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              Continue Learning <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/practice?category=${node.id}`);
                }}
                className="py-2.5 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
              >
                <Code2 className="w-4 h-4 text-blue-400" /> Practice
              </button>

              <button
                onClick={() => onToggleComplete(node.id)}
                className={cn(
                  'py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5',
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-secondary border-border text-foreground hover:bg-muted'
                )}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCompleted ? 'Completed ✓' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
