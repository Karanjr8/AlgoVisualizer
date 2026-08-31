import { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, ExternalLink, Bookmark, Sparkles, 
  Clock, Trophy, Filter 
} from 'lucide-react';
import { 
  RECOMMENDED_PROBLEMS_BY_TOPIC, 
  PracticeProblem, 
  ProblemTier 
} from '../../data/recommendedProblems';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';

interface RecommendedPracticeProblemsProps {
  categoryKey: string;
  titleOverride?: string;
}

const TIER_METADATA: Record<ProblemTier, { label: string; desc: string; color: string; badgeBg: string }> = {
  Foundation: {
    label: 'Foundation',
    desc: 'Learn fundamental concepts & core mechanics',
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  Intermediate: {
    label: 'Intermediate',
    desc: 'Build problem-solving confidence & subpattern intuition',
    color: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  'Interview Level': {
    label: 'Interview Level',
    desc: 'Most frequently asked FAANG & top tech interview questions',
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  Advanced: {
    label: 'Advanced',
    desc: 'Master complex edge cases, hard optimizations & variations',
    color: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
};

const DIFFICULTY_COLOR = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export const RecommendedPracticeProblems = ({ categoryKey, titleOverride }: RecommendedPracticeProblemsProps) => {
  // Key lookup normalize (e.g., 'trie-intro' -> 'trie', 'sorting-algorithms' -> 'sorting')
  const normalizedKey = categoryKey.toLowerCase().replace('-intro', '').replace('-algorithms', '');
  const problems: PracticeProblem[] = RECOMMENDED_PROBLEMS_BY_TOPIC[normalizedKey] || RECOMMENDED_PROBLEMS_BY_TOPIC['trie'];

  // Persistent States
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('algovis_completed_problems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('algovis_bookmarked_problems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter State
  const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard' | 'LeetCode' | 'GFG' | 'Bookmarked' | 'Completed'>('All');

  useEffect(() => {
    try {
      localStorage.setItem('algovis_completed_problems', JSON.stringify(completedIds));
    } catch (e) {
      console.error('Failed to save completed problems', e);
    }
  }, [completedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('algovis_bookmarked_problems', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed to save bookmarked problems', e);
    }
  }, [bookmarkedIds]);

  // Toggle Completed
  const toggleCompleted = (problem: PracticeProblem) => {
    const isCompleted = completedIds.includes(problem.id);
    const updated = isCompleted
      ? completedIds.filter((id) => id !== problem.id)
      : [...completedIds, problem.id];

    setCompletedIds(updated);

    if (!isCompleted) {
      // Log event to backend profile
      api.post('/profile/events', {
        eventType: 'PROBLEM_COMPLETED',
        topic: normalizedKey,
        details: `Solved ${problem.title} (${problem.difficulty})`,
      }).catch((err) => console.error('Failed to log event', err));
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Progress metrics
  const totalCount = problems.length;
  const completedCount = problems.filter((p) => completedIds.includes(p.id)).length;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  // Apply filters
  const filteredProblems = problems.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'Easy') return p.difficulty === 'Easy';
    if (filter === 'Medium') return p.difficulty === 'Medium';
    if (filter === 'Hard') return p.difficulty === 'Hard';
    if (filter === 'LeetCode') return p.platform === 'LeetCode';
    if (filter === 'GFG') return p.platform === 'GeeksForGeeks';
    if (filter === 'Bookmarked') return bookmarkedIds.includes(p.id);
    if (filter === 'Completed') return completedIds.includes(p.id);
    return true;
  });

  // Group by Tier
  const tiers: ProblemTier[] = ['Foundation', 'Intermediate', 'Interview Level', 'Advanced'];

  return (
    <section id="curriculum" className="w-full flex flex-col gap-8 text-left py-4">
      {/* SECTION HEADER CARD */}
      <div className="w-full bg-card/60 backdrop-blur-md transform-gpu border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-primary" /> Curated Learning Roadmap
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
              {titleOverride || 'Recommended Practice Problems'}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl">
              Solve carefully ordered interview questions designed to build mastery from basic concepts to FAANG-level hard problems.
            </p>
          </div>

          {/* PROGRESS COUNTER & BAR */}
          <div className="w-full md:w-72 bg-background/60 border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5 shrink-0 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Progress
              </span>
              <span className="text-sm font-black text-foreground tabular-nums">
                {completedCount} / {totalCount} <span className="text-xs text-muted-foreground font-semibold">({progressPercent}%)</span>
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-secondary/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* SMART FILTER BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['All', 'Easy', 'Medium', 'Hard', 'LeetCode', 'GFG', 'Bookmarked', 'Completed'] as const).map((item) => {
            const isActive = filter === item;
            return (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer outline-none transform-gpu hover:-translate-y-[1px]',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background/50 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* ROADMAP STAGES & PROBLEM ROWS */}
      <div className="flex flex-col gap-8">
        {tiers.map((tierKey) => {
          const tierProblems = filteredProblems.filter((p) => p.tier === tierKey);
          if (tierProblems.length === 0) return null;

          const meta = TIER_METADATA[tierKey];

          return (
            <div key={tierKey} className="flex flex-col gap-4">
              {/* TIER HEADER */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-2.5">
                <span className={cn('px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border', meta.badgeBg)}>
                  {meta.label}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  {meta.desc}
                </span>
              </div>

              {/* PROBLEM ITEMS CONTAINER */}
              <div className="flex flex-col gap-2.5">
                {tierProblems.map((problem) => {
                  const isDone = completedIds.includes(problem.id);
                  const isSaved = bookmarkedIds.includes(problem.id);

                  return (
                    <div
                      key={problem.id}
                      className={cn(
                        'w-full bg-card/60 backdrop-blur-md border rounded-2xl p-4 sm:p-4.5 transition-all duration-150 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 group transform-gpu hover:-translate-y-[2px]',
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-white/10 hover:border-white/20 bg-card/40'
                      )}
                    >
                      {/* Left: Completion Checkbox + Title */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <button
                          onClick={() => toggleCompleted(problem)}
                          title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                          className="shrink-0 text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer outline-none"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-5 h-5 stroke-[1.5]" />
                          )}
                        </button>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                'text-sm sm:text-base font-bold transition-colors hover:text-primary truncate max-w-md',
                                isDone ? 'text-muted-foreground line-through decoration-emerald-500/50' : 'text-foreground'
                              )}
                            >
                              {problem.title}
                            </a>

                            {/* Difficulty Badge */}
                            <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0', DIFFICULTY_COLOR[problem.difficulty])}>
                              {problem.difficulty}
                            </span>

                            {/* Platform Badge */}
                            <span className="px-2 py-0.5 rounded-md bg-secondary/80 border border-white/10 text-xs font-semibold text-muted-foreground shrink-0">
                              {problem.platform}
                            </span>
                          </div>

                          {/* Tags & Time */}
                          <div className="flex items-center gap-2.5 text-xs text-muted-foreground pt-1 flex-wrap">
                            <span className="flex items-center gap-1 font-semibold">
                              <Clock className="w-3 h-3" /> {problem.estimatedTime}
                            </span>
                            <span className="text-white/20">•</span>
                            {problem.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="bg-background/40 px-2 py-0.5 rounded border border-white/5 font-mono text-[11px]">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions (Bookmark + Solve External Link) */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => toggleBookmark(problem.id)}
                          title={isSaved ? 'Remove Bookmark' : 'Bookmark Problem'}
                          className={cn(
                            'p-2 rounded-xl border transition-colors cursor-pointer outline-none',
                            isSaved
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-background/50 border-white/10 text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>

                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-primary/20 cursor-pointer"
                        >
                          <span>Solve</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
