import { Clock, CheckCircle2, Video, Code2, Brain } from 'lucide-react';

export interface ActivityLogItem {
  id?: string;
  title: string;
  type?: string;
  timestamp: string;
}

interface RecentActivityTimelineProps {
  activities?: ActivityLogItem[];
}

export const RecentActivityTimeline = ({ activities = [] }: RecentActivityTimelineProps) => {
  const defaultActivities: ActivityLogItem[] = [
    { id: '1', title: 'Completed Heap Sort', type: 'LESSON_COMPLETED', timestamp: '2 hours ago' },
    { id: '2', title: 'Finished Trie Introduction', type: 'LESSON_COMPLETED', timestamp: '5 hours ago' },
    { id: '3', title: 'Practiced Binary Search', type: 'PROBLEM_COMPLETED', timestamp: 'Yesterday' },
    { id: '4', title: 'Attempted Mock Interview', type: 'INTERVIEW_COMPLETED', timestamp: '2 days ago' },
    { id: '5', title: 'Explored Dijkstra Graph Visualizer', type: 'VISUALIZER_USED', timestamp: '3 days ago' },
    { id: '6', title: 'Ran Custom Code in Algorithm Playground', type: 'PLAYGROUND_USED', timestamp: '4 days ago' },
    { id: '7', title: 'Solved Kth Largest Element', type: 'PROBLEM_COMPLETED', timestamp: '5 days ago' },
    { id: '8', title: 'Completed Dynamic Programming Introduction', type: 'LESSON_COMPLETED', timestamp: '6 days ago' },
    { id: '9', title: 'Practiced Two Pointers Techniques', type: 'PROBLEM_COMPLETED', timestamp: '1 week ago' },
    { id: '10', title: 'Explored Segment Tree Visualizer', type: 'VISUALIZER_USED', timestamp: '1 week ago' },
  ];

  const items = activities.length > 0 ? activities.slice(0, 10) : defaultActivities;

  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'PROBLEM_COMPLETED':
        return { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'INTERVIEW_COMPLETED':
        return { icon: Brain, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      case 'PLAYGROUND_USED':
        return { icon: Code2, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      default:
        return { icon: Video, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    }
  };

  return (
    <div className="w-full bg-card/60 backdrop-blur-md transform-gpu border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-xl font-black text-foreground">Recent Activity</h2>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Last 10 Actions
        </span>
      </div>

      {/* Simple Timeline */}
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const { icon: Icon, color } = getActivityIcon(item.type);
          const formattedTime = typeof item.timestamp === 'string' && item.timestamp.includes('ago')
            ? item.timestamp
            : new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div
              key={item.id || idx}
              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-background/50 border border-white/5 hover:border-white/15 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-lg border ${color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedTime}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
