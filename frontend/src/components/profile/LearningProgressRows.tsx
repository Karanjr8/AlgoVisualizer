import { motion } from 'framer-motion';

export interface TopicProgressItem {
  key: string;
  name: string;
  completed: number;
  total: number;
  percentage: number;
}

interface LearningProgressRowsProps {
  progressItems: TopicProgressItem[];
}

export const LearningProgressRows = ({ progressItems = [] }: LearningProgressRowsProps) => {
  // Default topics required by prompt if progressItems is empty
  const defaultTopics: TopicProgressItem[] = [
    { key: 'Arrays', name: 'Arrays', completed: 8, total: 15, percentage: 53 },
    { key: 'Trees', name: 'Trees', completed: 6, total: 12, percentage: 50 },
    { key: 'Graphs', name: 'Graphs', completed: 9, total: 15, percentage: 60 },
    { key: 'DP', name: 'Dynamic Programming', completed: 5, total: 18, percentage: 28 },
    { key: 'Greedy', name: 'Greedy', completed: 4, total: 10, percentage: 40 },
    { key: 'Trie', name: 'Trie', completed: 3, total: 8, percentage: 38 },
    { key: 'Heap', name: 'Heap / Priority Queue', completed: 7, total: 10, percentage: 70 },
    { key: 'SegmentTree', name: 'Segment Tree', completed: 2, total: 8, percentage: 25 },
  ];

  const items = progressItems.length > 0 ? progressItems : defaultTopics;

  return (
    <div className="w-full bg-card/60 backdrop-blur-md transform-gpu border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-xl font-black text-foreground">Learning Progress</h2>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Topic Breakdown
        </span>
      </div>

      {/* Compact Rows */}
      <div className="flex flex-col gap-3.5">
        {items.map((item, idx) => (
          <div key={item.key || idx} className="flex flex-col gap-1.5 group">
            {/* Top Info Row */}
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                {item.name}
              </span>
              <span className="text-xs font-mono font-bold text-muted-foreground">
                <span className="text-foreground font-black">{item.completed}</span> / {item.total} completed
              </span>
            </div>

            {/* Compact Sleek Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, delay: idx * 0.04 }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
