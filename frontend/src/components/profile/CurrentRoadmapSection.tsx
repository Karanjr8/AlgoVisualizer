import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, Play, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface CurrentRoadmapSectionProps {
  currentTopic?: string;
  nextTopic?: string;
  estimatedHoursRemaining?: number;
}

export const CurrentRoadmapSection = ({
  currentTopic = 'Graphs & BFS/DFS',
  nextTopic = 'Dynamic Programming (DP)',
  estimatedHoursRemaining = 3.5,
}: CurrentRoadmapSectionProps) => {
  const navigate = useNavigate();

  const pipeline = [
    { title: 'Arrays & Hashing', status: 'completed' },
    { title: 'Two Pointers & Sliding Window', status: 'completed' },
    { title: 'Stack & Queues', status: 'completed' },
    { title: 'Trees & BST', status: 'completed' },
    { title: currentTopic, status: 'current' },
    { title: nextTopic, status: 'next' },
    { title: 'Advanced Patterns & Trie', status: 'upcoming' },
  ];

  return (
    <section className="w-full flex flex-col gap-6 bg-card/40 backdrop-blur-md transform-gpu border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3">
            <Compass className="w-7 h-7 text-blue-400" />
            Current Learning Roadmap
          </h2>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Your structured learning path toward Data Structure & Algorithm mastery
          </p>
        </div>

        <button
          onClick={() => navigate('/roadmap')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-blue-600 text-white font-black text-sm shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2.5 self-start sm:self-auto group"
        >
          <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
          Continue Learning
        </button>
      </div>

      {/* Roadmap Metrics & Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 pr-0 md:pr-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <MapPin className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Current Focus Topic</span>
            <span className="text-base font-black text-foreground">{currentTopic}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 pr-0 md:pr-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
            <ArrowRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Next Up</span>
            <span className="text-base font-black text-foreground">{nextTopic}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Est. Completion</span>
            <span className="text-base font-black text-foreground">~{estimatedHoursRemaining} hrs remaining</span>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Pipeline View */}
      <div className="w-full overflow-x-auto custom-scrollbar py-2">
        <div className="flex items-center gap-3 min-w-max">
          {pipeline.map((node, idx) => {
            const isCompleted = node.status === 'completed';
            const isCurrent = node.status === 'current';
            const isNext = node.status === 'next';

            return (
              <div key={idx} className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`px-4 py-3 rounded-2xl border flex items-center gap-3 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-purple-600/20 border-purple-400/80 shadow-purple-500/30 shadow-lg text-white ring-2 ring-purple-500/40'
                      : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isNext
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                      : 'bg-white/5 border-white/10 text-muted-foreground'
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isCurrent && <MapPin className="w-5 h-5 text-purple-400 animate-pulse shrink-0" />}
                  {isNext && <ArrowRight className="w-5 h-5 text-blue-400 shrink-0" />}

                  <div className="flex flex-col">
                    <span className="text-xs font-black tracking-tight">{node.title}</span>
                    <span className="text-[10px] font-bold opacity-75 uppercase">
                      {isCompleted ? 'Completed' : isCurrent ? 'Active Focus' : isNext ? 'Recommended Next' : 'Upcoming'}
                    </span>
                  </div>
                </motion.div>

                {idx < pipeline.length - 1 && (
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 ${
                      isCompleted ? 'text-emerald-400' : isCurrent ? 'text-purple-400' : 'text-white/20'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
