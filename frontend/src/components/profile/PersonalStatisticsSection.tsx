import { motion } from 'framer-motion';
import { PieChart, Clock, Flame, Target, TrendingUp, BarChart3, CheckCircle, Activity, Award } from 'lucide-react';

interface PersonalStatisticsSectionProps {
  learningHours?: number;
  lastActiveDate?: string;
  algorithmsLearned?: number;
  practiceAccuracy?: number;
}

export const PersonalStatisticsSection = ({
  learningHours = 24.5,
  lastActiveDate,
  algorithmsLearned = 14,
  practiceAccuracy = 87.5,
}: PersonalStatisticsSectionProps) => {
  const formattedLastActive = lastActiveDate
    ? new Date(lastActiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  const stats = [
    {
      title: 'Total Learning Time',
      value: `${learningHours.toFixed(1)} hrs`,
      icon: Clock,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      subtitle: 'Cumulative time in visualizers',
    },
    {
      title: 'Avg Daily Study Time',
      value: '45 mins/day',
      icon: Flame,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      subtitle: 'Based on 30-day activity',
    },
    {
      title: 'Most Active Day',
      value: 'Wednesday',
      icon: Activity,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      subtitle: 'Peak practice session velocity',
    },
    {
      title: 'Favorite Topic',
      value: 'Graph Traversal',
      icon: Target,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      subtitle: 'Most visualizer sessions',
    },
    {
      title: 'Strongest Topic',
      value: 'Arrays & Hashing',
      icon: CheckCircle,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      subtitle: '94% practice accuracy',
    },
    {
      title: 'Weakest Topic',
      value: 'Segment Tree',
      icon: TrendingUp,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      subtitle: 'Target area for revision',
    },
    {
      title: 'Algorithms Visualized',
      value: `${algorithmsLearned} Modules`,
      icon: BarChart3,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      subtitle: 'Interactive step runs',
    },
    {
      title: 'Practice Accuracy',
      value: `${practiceAccuracy}%`,
      icon: Award,
      color: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
      subtitle: 'Overall first-try accuracy',
    },
    {
      title: 'Last Active Timestamp',
      value: formattedLastActive,
      icon: PieChart,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      subtitle: 'Latest system activity',
    },
  ];

  return (
    <section className="w-full flex flex-col gap-6 bg-card/40 backdrop-blur-md transform-gpu border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3">
            <PieChart className="w-7 h-7 text-purple-400" />
            Personal Learning Analytics & Deep Metrics
          </h2>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Deep analytical insights into your habits, strengths, and targeted improvement areas
          </p>
        </div>
      </div>

      {/* Grid of 9 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-background/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-purple-500/40 transition-all duration-300 shadow-md group"
            >
              <div className={`p-3.5 rounded-2xl border ${st.color} shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">
                  {st.title}
                </span>
                <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate mt-0.5">
                  {st.value}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground/80 truncate mt-0.5">
                  {st.subtitle}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
