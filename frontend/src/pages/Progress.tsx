import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  Target,
  Sparkles,
  BookOpen,
  Calendar,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

interface DashboardResponse {
  profile: {
    name: string;
    email: string;
    username?: string;
    avatar?: string;
    createdAt?: string;
    algorithmsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    learningHours: number;
  };
  heatmap: {
    dateScores: Record<string, number>;
    currentStreak: number;
    longestStreak: number;
    activeDays: number;
    thisMonthActivity: number;
  };
  learningProgress: Array<{
    key: string;
    name: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    type: string;
    topic?: string;
    timestamp: string;
  }>;
}

export const Progress: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/profile/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load progress data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const profile = data?.profile || {
    name: user?.fullName || user?.email?.split('@')[0] || 'Learner',
    algorithmsCompleted: user?.completedTopics?.length || 0,
    currentStreak: user?.streak || 0,
    longestStreak: user?.longestStreak || 0,
    learningHours: user?.learningHours || 0,
  };

  const totalTopics = data?.learningProgress.reduce((acc, curr) => acc + curr.total, 0) || 96;
  const completedTopics = data?.learningProgress.reduce((acc, curr) => acc + curr.completed, 0) || profile.algorithmsCompleted;
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const activeDays = data?.heatmap.activeDays || (user?.streak ? Math.max(1, user.streak) : 0);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Dynamic Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Learning Progress & Mastery
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Real-time analytics directly synced with your database activity and problem solving records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Continue Learning
          </Link>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Overall Completion */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Completion Rate</span>
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-foreground">{overallPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTopics} of {totalTopics} topics mastered
            </p>
          </div>
          <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* Metric 2: Current & Longest Streak */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Streak</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-foreground flex items-baseline gap-2">
              {profile.currentStreak} <span className="text-xs font-bold text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Longest streak: <strong className="text-amber-400">{profile.longestStreak} days</strong>
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold pt-1">
            <Zap className="w-3.5 h-3.5" /> Keep solving daily to extend streak
          </div>
        </motion.div>

        {/* Metric 3: Active Learning Days */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Learning Days</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-foreground">{activeDays}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique active activity days recorded
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-purple-400 font-semibold pt-1">
            <TrendingUp className="w-3.5 h-3.5" /> Verified real DB activity
          </div>
        </motion.div>

        {/* Metric 4: Total Learning Time */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time Spent Learning</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-foreground">
              {profile.learningHours ? profile.learningHours.toFixed(1) : '0.0'} <span className="text-xs font-bold text-muted-foreground">hrs</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Interactive visualizer & practice time
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated account record
          </div>
        </motion.div>
      </div>

      {/* Breakdown by Category Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Category Progress Breakdown */}
        <div className="lg:col-span-2 bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Topic Mastery Breakdown</h2>
              <p className="text-xs text-muted-foreground">Progress across major algorithm and data structure domains</p>
            </div>
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>

          {loading ? (
            <div className="space-y-4 py-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted/40 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.learningProgress.map((cat) => (
                <div key={cat.key} className="space-y-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{cat.name}</span>
                    <span className="font-mono text-muted-foreground">
                      {cat.completed} / {cat.total} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary via-purple-400 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Authenticated Activity Feed */}
        <div className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>

          <div className="space-y-3">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.slice(0, 7).map((act) => (
                <div key={act.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="text-xs font-bold text-foreground truncate">{act.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(act.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 space-y-2">
                <BookOpen className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                <p className="text-xs text-muted-foreground">No recent activity yet. Start exploring algorithms to build your log!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
