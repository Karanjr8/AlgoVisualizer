import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  History,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PastInterviewItem {
  id: string;
  role: string;
  difficulty: string;
  interviewStyle: string;
  topics: string[];
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  turnCount: number;
  maxTurns: number;
  timeLimitPerQuestion?: number;
  startedAt: string;
  completedAt?: string | null;
  overallScore?: number | null;
  performanceGrade?: string | null;
  summary?: string | null;
}

export const InterviewHistorySection: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PastInterviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/interviews');
        if (res.data?.sessions) {
          setHistory(res.data.sessions);
        }
      } catch (err) {
        console.warn('Could not load interview history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading || history.length === 0) {
    return null; // Don't take up space if no past sessions exist
  }

  const getGradeBadge = (score?: number | null, grade?: string | null) => {
    if (score === null || score === undefined) {
      return 'bg-secondary text-muted-foreground border-border/80';
    }
    if (score >= 85) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (score >= 70) return 'bg-primary/10 text-primary border-primary/20';
    if (score >= 55) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
  };

  return (
    <div className="w-full flex flex-col gap-3 pt-4 border-t border-border/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Interview History & Performance Logs
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">
            {history.length} attempts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.slice(0, 6).map((item) => {
          const isCompleted = item.status === 'COMPLETED';
          const formattedDate = new Date(item.startedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/practice/interview/session/${item.id}`)}
              className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:bg-card/90 transition-all cursor-pointer flex flex-col justify-between gap-3 group shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground truncate">
                      {item.role}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{formattedDate}</span>
                    <span>&bull;</span>
                    <span>{item.topics.slice(0, 2).join(', ')}</span>
                  </div>
                </div>

                {isCompleted && item.overallScore !== null ? (
                  <div className={cn('px-2.5 py-1 rounded-xl text-xs font-mono font-black border text-center shrink-0', getGradeBadge(item.overallScore))}>
                    {item.overallScore}/100
                  </div>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                    In Progress
                  </span>
                )}
              </div>

              {item.summary && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              )}

              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary group-hover:underline">
                <span>{isCompleted ? 'View Full Assessment Report' : 'Resume Interview Session'}</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

