import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Sparkles, Flame, CheckCircle, Brain, Users } from 'lucide-react';

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'Learning' | 'Practice' | 'Consistency' | 'Interviews' | 'Community';
  iconName: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface AchievementsSectionProps {
  userAchievements?: any[];
}

export const AchievementsSection = ({ userAchievements = [] }: AchievementsSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>('All');

  const catalog: AchievementItem[] = [
    {
      id: '1',
      title: 'First Step Visualizer',
      description: 'Explore your first interactive algorithm visualization in AlgoVis',
      category: 'Learning',
      iconName: 'Sparkles',
      xpReward: 100,
      unlocked: true,
      unlockedAt: 'Aug 10, 2025',
    },
    {
      id: '2',
      title: 'Consistency Champion',
      description: 'Maintain an active daily study streak for 7 consecutive days',
      category: 'Consistency',
      iconName: 'Flame',
      xpReward: 250,
      unlocked: true,
      unlockedAt: 'Aug 17, 2025',
    },
    {
      id: '3',
      title: 'Graph Architect',
      description: 'Master Graph Traversal algorithms including BFS, DFS, and Dijkstra',
      category: 'Learning',
      iconName: 'Award',
      xpReward: 500,
      unlocked: true,
      unlockedAt: 'Aug 22, 2025',
    },
    {
      id: '4',
      title: 'DP Specialist',
      description: 'Solve 10 Dynamic Programming problems across Memoization & Tabulation',
      category: 'Practice',
      iconName: 'Trophy',
      xpReward: 400,
      unlocked: true,
      unlockedAt: 'Aug 26, 2025',
    },
    {
      id: '5',
      title: 'Interview Ace',
      description: 'Achieve a score over 85% in a full technical Mock Interview simulation',
      category: 'Interviews',
      iconName: 'Brain',
      xpReward: 600,
      unlocked: false,
    },
    {
      id: '6',
      title: 'Recursion Master',
      description: 'Complete all recursion visualizers and call stack animations',
      category: 'Learning',
      iconName: 'Shield',
      xpReward: 300,
      unlocked: true,
      unlockedAt: 'Aug 29, 2025',
    },
    {
      id: '7',
      title: 'Community Mentor',
      description: 'Share your solution breakdown and visual notes with the AlgoVis community',
      category: 'Community',
      iconName: 'Users',
      xpReward: 200,
      unlocked: false,
    },
    {
      id: '8',
      title: 'Speed Demon',
      description: 'Complete a timed challenge practice test with 100% accuracy',
      category: 'Practice',
      iconName: 'Flame',
      xpReward: 500,
      unlocked: false,
    },
  ];

  // Merge backend user achievements if present
  const mergedCatalog = catalog.map((badge) => {
    const userAch = userAchievements.find(
      (ua) => ua.achievementId === badge.id || ua.achievement?.title?.toLowerCase() === badge.title.toLowerCase()
    );
    if (userAch) {
      return {
        ...badge,
        unlocked: true,
        unlockedAt: userAch.unlockedAt
          ? new Date(userAch.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : badge.unlockedAt,
      };
    }
    return badge;
  });

  const categories = ['All', 'Learning', 'Practice', 'Consistency', 'Interviews', 'Community'];

  const filteredBadges = activeTab === 'All' ? mergedCatalog : mergedCatalog.filter((b) => b.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Learning':
        return Sparkles;
      case 'Practice':
        return CheckCircle;
      case 'Consistency':
        return Flame;
      case 'Interviews':
        return Brain;
      case 'Community':
        return Users;
      default:
        return Trophy;
    }
  };

  return (
    <section className="w-full flex flex-col gap-6 bg-card/40 backdrop-blur-md transform-gpu border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-400" />
            Badges & Achievements Showcase
          </h2>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Unlock prestige badges by maintaining streaks, mastering topics, and excelling in practice
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-xs font-bold text-muted-foreground self-start sm:self-auto">
          <span>Unlocked:</span>
          <span className="text-amber-400 font-black text-sm">
            {mergedCatalog.filter((b) => b.unlocked).length} / {mergedCatalog.length} Badges
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
                : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge, idx) => {
          const BadgeIcon = getCategoryIcon(badge.category);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              className={`rounded-2xl p-4 border flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden ${
                badge.unlocked
                  ? 'bg-background/70 backdrop-blur-md border-amber-500/30 hover:border-amber-500/60 hover:-translate-y-1 shadow-lg'
                  : 'bg-background/30 border-white/5 opacity-60 grayscale hover:opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`p-3 rounded-2xl border ${
                    badge.unlocked
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-500/20 shadow-md'
                      : 'bg-white/5 border-white/10 text-muted-foreground'
                  }`}
                >
                  <BadgeIcon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
                  +{badge.xpReward} XP
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-1.5">
                  {badge.title}
                  {!badge.unlocked && <Lock className="w-3.5 h-3.5 text-muted-foreground ml-auto" />}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground mt-1 line-clamp-2">
                  {badge.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">{badge.category}</span>
                {badge.unlocked ? (
                  <span className="text-emerald-400 font-bold">Unlocked {badge.unlockedAt || 'Aug 2025'}</span>
                ) : (
                  <span className="text-muted-foreground font-bold italic">Locked</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
