import { motion } from 'framer-motion';
import { History, CheckCircle2, Trophy, Brain, Video, Clock } from 'lucide-react';

interface ActivityItem {
  id?: string;
  action: string;
  description: string;
  timestamp: string;
  type?: 'algorithm' | 'practice' | 'interview' | 'achievement';
}

interface RecentActivitySectionProps {
  activities?: any[];
}

export const RecentActivitySection = ({ activities = [] }: RecentActivitySectionProps) => {
  // Mock fallback activities if feed is empty
  const defaultActivities: ActivityItem[] = [
    {
      action: 'Completed Visualization',
      description: 'Completed Merge Sort visualizer walkthrough & step-by-step trace',
      timestamp: '2 hours ago',
      type: 'algorithm',
    },
    {
      action: 'Solved Practice Problem',
      description: 'Solved Kth Largest Element in an Array (Heap Priority Queue)',
      timestamp: '5 hours ago',
      type: 'practice',
    },
    {
      action: 'Finished Curriculum Topic',
      description: 'Finished Dynamic Programming Introduction & Tabulation vs Memoization',
      timestamp: 'Yesterday',
      type: 'algorithm',
    },
    {
      action: 'Completed Mock Interview',
      description: 'Completed Interview Simulation for Senior Frontend Engineer role',
      timestamp: '2 days ago',
      type: 'interview',
    },
    {
      action: 'Earned Mastery Badge',
      description: 'Earned Graph Explorer Badge by exploring Dijkstra & BFS visualizers',
      timestamp: '3 days ago',
      type: 'achievement',
    },
  ];

  const displayList = activities.length > 0 ? activities : defaultActivities;

  const getIcon = (type?: string, action?: string) => {
    const act = (action || '').toLowerCase();
    if (act.includes('badge') || act.includes('achievement')) {
      return { icon: Trophy, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    }
    if (act.includes('interview') || act.includes('simulation')) {
      return { icon: Brain, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
    }
    if (act.includes('solved') || act.includes('practice')) {
      return { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    }
    return { icon: Video, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
  };

  return (
    <section className="w-full flex flex-col gap-6 bg-card/40 backdrop-blur-md transform-gpu border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3">
            <History className="w-7 h-7 text-purple-400" />
            Recent Activity Feed
          </h2>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Chronological record of your algorithm study, practice attempts, and earned achievements
          </p>
        </div>
      </div>

      {/* Timeline Feed */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-purple-500 before:via-blue-500 before:to-transparent">
        {displayList.map((item, idx) => {
          const { icon: Icon, color } = getIcon(item.type, item.action);
          const formattedTime = item.timestamp
            ? typeof item.timestamp === 'string' && item.timestamp.includes('ago')
              ? item.timestamp
              : new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Recently';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-purple-500/40 transition-all duration-300 shadow-md group"
            >
              {/* Timeline Bullet Node */}
              <div className={`absolute -left-9 sm:-left-11 top-4 p-2 rounded-xl border ${color} shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Action Description */}
              <div className="flex flex-col">
                <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                  {item.action}
                </span>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground shrink-0 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{formattedTime}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
