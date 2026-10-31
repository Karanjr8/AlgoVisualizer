import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Play, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Target, 
  Layers, 
  Code2, 
  BookOpen
} from 'lucide-react';
import { CATEGORIES, CategoryData } from '../data/categories';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export type RoadmapTopicState = 'completed' | 'current' | 'recommended' | 'locked';

export interface RoadmapTopicItem {
  category: CategoryData;
  state: RoadmapTopicState;
  completedLessons: string[];
  remainingLessons: string[];
  totalConceptsCount: number;
  completedConceptsCount: number;
}

export const Roadmap: React.FC = () => {
  const navigate = useNavigate();

  // Persistent Completed Topics State
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('algovis_completed_topics');
      return saved ? JSON.parse(saved) : ['sorting-algorithms', 'searching-algorithms', 'sliding-window', 'two-pointers', 'recursion', 'linked-lists'];
    } catch {
      return ['sorting-algorithms', 'searching-algorithms', 'sliding-window', 'two-pointers', 'recursion', 'linked-lists'];
    }
  });

  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('trees');

  useEffect(() => {
    try {
      localStorage.setItem('algovis_completed_topics', JSON.stringify(completedTopicIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedTopicIds]);

  const toggleTopicComplete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCompletedTopicIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // Build Topic List Items
  const topicItems: RoadmapTopicItem[] = useMemo(() => {
    return CATEGORIES.map((cat, idx) => {
      const isDone = completedTopicIds.includes(cat.id);
      const isCurrent = !isDone && (idx === 0 || completedTopicIds.includes(CATEGORIES[idx - 1]?.id));
      const isRec = !isDone && !isCurrent && idx <= completedTopicIds.length + 1;

      let state: RoadmapTopicState = 'locked';
      if (isDone) state = 'completed';
      else if (isCurrent) state = 'current';
      else if (isRec) state = 'recommended';

      const algoTitles = cat.algorithms.map(a => a.title);
      const half = Math.ceil(algoTitles.length / 2);
      const completedLessons = isDone ? algoTitles : isCurrent ? algoTitles.slice(0, half) : [];
      const remainingLessons = isDone ? [] : isCurrent ? algoTitles.slice(half) : algoTitles;

      return {
        category: cat,
        state,
        completedLessons,
        remainingLessons,
        totalConceptsCount: cat.algorithms.length || cat.count,
        completedConceptsCount: isDone ? (cat.algorithms.length || cat.count) : isCurrent ? Math.floor((cat.algorithms.length || cat.count) * 0.6) : 0
      };
    });
  }, [completedTopicIds]);

  // Overall Stats
  const totalTopics = CATEGORIES.length;
  const completedCount = completedTopicIds.length;
  const progressPercent = Math.round((completedCount / totalTopics) * 100);

  const currentTopic = topicItems.find(t => t.state === 'current')?.category || topicItems[0].category;

  // Recommendations: Maximum 2
  const recommendations = useMemo(() => {
    const recs = topicItems.filter(t => t.state === 'current' || t.state === 'recommended').slice(0, 2);
    return recs.map(r => ({
      id: r.category.id,
      title: r.category.title,
      reason: r.state === 'current' ? `Active Focus: Continue learning ${r.category.title} concepts & visualizers.` : `Recommended next topic after ${currentTopic.title}.`
    }));
  }, [topicItems, currentTopic]);

  return (
    <WorkspaceLayout>
      <div className="w-full relative text-left flex flex-col gap-8 pb-16">
        
        {/* ==================== COMPACT TOP SECTION ==================== */}
        <div className="bg-card border border-border/80 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">DSA Journey</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              A clean, guided vertical learning path to master algorithms.
            </p>
          </div>

          {/* Compact Stat Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-background/80 border border-border/80 p-3.5 rounded-2xl shrink-0">
            <div className="space-y-0.5 border-r border-border/50 pr-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Layers className="w-3 h-3 text-purple-400" /> Completed
              </span>
              <p className="text-base font-black text-foreground">{completedCount} / {totalTopics}</p>
            </div>

            <div className="space-y-0.5 border-r border-border/50 pr-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> Streak
              </span>
              <p className="text-base font-black text-amber-400">7 Days</p>
            </div>

            <div className="space-y-0.5 border-r border-border/50 pr-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Target className="w-3 h-3 text-emerald-400" /> Progress
              </span>
              <p className="text-base font-black text-emerald-400">{progressPercent}%</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Play className="w-3 h-3 text-purple-400" /> Current
              </span>
              <p className="text-sm font-bold text-purple-400 truncate max-w-[100px]">{currentTopic.title}</p>
            </div>
          </div>
        </div>

        {/* ==================== NEXT RECOMMENDATIONS (MAX 2) ==================== */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs uppercase font-black text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> Recommended Next Steps (Max 2)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => setExpandedTopicId(rec.id)}
                  className="p-4 rounded-2xl bg-card border border-purple-500/30 hover:border-purple-500/60 shadow-sm flex items-center justify-between gap-4 cursor-pointer transition-all"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold text-[10px] uppercase">
                      Recommended
                    </span>
                    <h3 className="text-base font-bold text-foreground">{rec.title}</h3>
                    <p className="text-xs text-muted-foreground">{rec.reason}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/explore/${rec.id}`);
                    }}
                    className="p-2.5 rounded-xl bg-purple-500 text-white hover:brightness-110 shrink-0 transition-all shadow-md"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== CLEAN VERTICAL LEARNING PATH ==================== */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase font-black text-muted-foreground tracking-wider">
            Learning Path
          </h2>

          <div className="flex flex-col gap-3 relative">
            {/* Vertical Connecting Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-border/60 z-0 pointer-events-none" />

            {topicItems.map(({ category, state, completedLessons, remainingLessons, totalConceptsCount, completedConceptsCount }) => {
              const isExpanded = expandedTopicId === category.id;

              return (
                <div
                  key={category.id}
                  className={cn(
                    'relative z-10 rounded-2xl border transition-all duration-200 overflow-hidden',
                    state === 'completed' && 'bg-card border-emerald-500/30 shadow-sm',
                    state === 'current' && 'bg-card border-purple-500/60 shadow-md ring-2 ring-purple-500/20',
                    state === 'recommended' && 'bg-card border-blue-500/40 shadow-sm',
                    state === 'locked' && 'bg-card/40 border-border/60 opacity-70'
                  )}
                >
                  {/* Topic Card Header (Click to Expand) */}
                  <div
                    onClick={() => setExpandedTopicId(isExpanded ? null : category.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      {/* State Indicator Icon */}
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border shadow-sm',
                        state === 'completed' && 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
                        state === 'current' && 'bg-purple-500/10 border-purple-500/50 text-purple-400 ring-2 ring-purple-500/40',
                        state === 'recommended' && 'bg-blue-500/10 border-blue-500/40 text-blue-400',
                        state === 'locked' && 'bg-muted border-border text-muted-foreground'
                      )}>
                        {state === 'completed' && <CheckCircle2 className="w-5 h-5" />}
                        {state === 'current' && <Play className="w-5 h-5 fill-purple-400" />}
                        {state === 'recommended' && <ArrowRight className="w-5 h-5" />}
                        {state === 'locked' && <Lock className="w-4 h-4" />}
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-foreground">{category.title}</h3>
                          <span className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                            state === 'completed' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
                            state === 'current' && 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
                            state === 'recommended' && 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
                            state === 'locked' && 'bg-muted text-muted-foreground'
                          )}>
                            {state === 'current' ? 'Current Focus' : state === 'recommended' ? 'Recommended Next' : state}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">
                          {category.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Progress Count & Expand Toggle */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-muted-foreground hidden sm:inline-block">
                        {completedConceptsCount} / {totalConceptsCount} Concepts
                      </span>

                      <button
                        onClick={(e) => toggleTopicComplete(category.id, e)}
                        title={state === 'completed' ? 'Mark In Progress' : 'Mark Completed'}
                        className={cn(
                          'p-1.5 rounded-lg border text-xs font-bold transition-all',
                          state === 'completed' 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Expandable Topic Details Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="border-t border-border/60 bg-background/60 p-5 space-y-5 transform-gpu"
                      >
                        {/* Concept Progress Header */}
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-muted-foreground">Progress:</span>
                          <span className="font-bold text-purple-400">{completedConceptsCount} / {totalConceptsCount} Concepts Completed</span>
                        </div>

                        {/* Lessons Lists (Completed vs Remaining) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                          {/* Completed Lessons */}
                          <div className="space-y-2 p-3.5 rounded-xl bg-card border border-border/80">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed Lessons ({completedLessons.length})
                            </span>
                            {completedLessons.length > 0 ? (
                              <ul className="space-y-1.5 pt-1">
                                {completedLessons.map(l => (
                                  <li key={l} className="flex items-center gap-2 text-foreground font-semibold">
                                    <span className="text-emerald-400 font-bold">✓</span> {l}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground text-[11px]">No lessons completed yet.</p>
                            )}
                          </div>

                          {/* Remaining Lessons */}
                          <div className="space-y-2 p-3.5 rounded-xl bg-card border border-border/80">
                            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" /> Remaining Lessons ({remainingLessons.length})
                            </span>
                            {remainingLessons.length > 0 ? (
                              <ul className="space-y-1.5 pt-1">
                                {remainingLessons.map(l => (
                                  <li key={l} className="flex items-center gap-2 text-muted-foreground font-semibold">
                                    <span className="text-muted-foreground font-bold">○</span> {l}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-emerald-400 text-[11px] font-bold">All lessons completed!</p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            onClick={() => navigate(`/explore/${category.id}`)}
                            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
                          >
                            Continue Learning <ArrowRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => navigate(`/practice?category=${category.id}`)}
                            className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs hover:bg-muted transition-colors flex items-center gap-1.5 border border-border"
                          >
                            <Code2 className="w-4 h-4 text-blue-400" /> Practice Problems
                          </button>

                          <button
                            onClick={() => navigate(`/visualizer/${category.algorithms[0]?.id || 'bubble'}`)}
                            className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs hover:bg-muted transition-colors flex items-center gap-1.5 border border-border"
                          >
                            <Play className="w-4 h-4 text-purple-400" /> Open Visualizer
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
};
