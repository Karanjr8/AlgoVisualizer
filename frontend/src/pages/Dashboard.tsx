import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Trophy, Flame, Clock, BookOpen, ChevronRight, 
  PlayCircle, Bookmark, Star, Sparkles, Compass 
} from 'lucide-react';
import { StatCard, AnimatedProgressRing, ActivityHeatmap } from '../components/dashboard/DashboardComponents';
import { AlgorithmCard } from '../components/explore/AlgorithmCard';
import { CATEGORIES } from '../data/categories';

interface Progress {
  algorithmId: string;
  completedAt: string;
}

export const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress');
        setProgress(res.data.progress);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-primary animate-pulse">Loading dashboard...</div>;

  // Mock calculations based on actual backend data
  const totalAlgorithmsMastered = progress.length;
  
  // Extract algorithm data for recently viewed (mocking that sorting algos are recent)
  const sortingCategory = CATEGORIES.find(c => c.id === 'sorting-algorithms');
  const recentAlgos = sortingCategory?.algorithms.slice(0, 3) || [];

  return (
    <div className="w-full pb-16 overflow-x-hidden">
      
      {/* Welcome Banner */}
      <section className="w-full border-b border-border bg-card backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-primary font-semibold mb-2">
              <Sparkles className="w-5 h-5" /> Welcome back
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Hello, {user?.username || 'Student'}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground text-lg max-w-xl">
              You're currently in the top 15% of active learners this week. Keep up the great work and tackle your next milestone!
            </motion.p>
          </div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 bg-card border border-border p-4 rounded-3xl shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-2xl font-black text-white shadow-inner">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="pr-4">
              <div className="font-bold text-lg">Level 4 Scholar</div>
              <div className="text-sm text-primary font-semibold">1,250 XP to Next Level</div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col gap-8">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Algorithms Mastered" 
            value={totalAlgorithmsMastered.toString()} 
            subtitle={<><span className="text-green-400">+1</span> since last week</>}
            icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            colorClass="from-yellow-500 to-amber-600"
            delay={0.1}
          />
          <StatCard 
            title="Current Streak" 
            value="4 Days" 
            subtitle="Personal best: 12 days"
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            colorClass="from-orange-500 to-red-500"
            delay={0.2}
          />
          <StatCard 
            title="Time Studied" 
            value="12h 45m" 
            subtitle="Top 10% this month"
            icon={<Clock className="w-6 h-6 text-blue-500" />}
            colorClass="from-blue-500 to-cyan-500"
            delay={0.3}
          />
          <StatCard 
            title="Topics Learned" 
            value="2" 
            subtitle="Sorting, Searching"
            icon={<BookOpen className="w-6 h-6 text-purple-500" />}
            colorClass="from-purple-500 to-pink-500"
            delay={0.4}
          />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Roadmap & Heatmap */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card backdrop-blur-md border border-border rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8">Roadmap Progress</h2>
              <div className="flex flex-col md:flex-row items-center gap-12">
                <AnimatedProgressRing percentage={65} label="Sorting Mastery" colorClass="from-primary to-secondary" />
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-bold">You're making great progress!</h3>
                  <p className="text-muted-foreground">You have mastered 3 out of 5 sorting algorithms. Once you complete Merge Sort and Quick Sort, you'll unlock the Divide & Conquer badge.</p>
                  <Link to="/explore/sorting-algorithms" className="inline-flex items-center gap-2 text-primary font-bold hover:underline mt-2">
                    Continue Sorting Path <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card backdrop-blur-md border border-border rounded-3xl p-8 overflow-hidden">
              <h2 className="text-2xl font-bold mb-6">Activity Heatmap</h2>
              <ActivityHeatmap />
            </motion.div>
          </div>

          {/* Right Column: Recommendations & Bookmarks */}
          <div className="flex flex-col gap-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-gradient-to-br from-primary/20 to-card border border-primary/20 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Compass className="w-24 h-24" />
              </div>
              <h2 className="text-lg font-bold text-primary mb-2 flex items-center gap-2"><Star className="w-4 h-4" /> Recommended Next</h2>
              <h3 className="text-3xl font-black mb-4 tracking-tight">Merge Sort</h3>
              <p className="text-muted-foreground text-sm mb-6 relative z-10">
                Dive into Divide and Conquer strategies. It's the perfect follow-up to your recent completion of Insertion Sort.
              </p>
              <Link to="/explore/sorting-algorithms" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold transition-colors relative z-10">
                <PlayCircle className="w-5 h-5" /> Start Learning
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="bg-card backdrop-blur-md border border-border rounded-3xl p-8 flex-1">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Bookmark className="w-5 h-5 text-secondary" /> Bookmarked Topics</h2>
              <div className="space-y-4">
                {[
                  { name: "Graph Traversal (BFS/DFS)", tag: "Graphs" },
                  { name: "Sliding Window Maximum", tag: "Arrays" },
                  { name: "0/1 Knapsack Problem", tag: "DP" }
                ].map((item, i) => (
                  <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border hover:border-border transition-colors cursor-pointer">
                    <div>
                      <div className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{item.name}</div>
                      <div className="text-xs text-muted-foreground font-semibold">{item.tag}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>

        {/* Bottom Section: Recently Viewed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Recently Viewed Algorithms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAlgos.map((algo) => (
              <AlgorithmCard key={algo.id} algorithm={algo} colorClass="from-primary to-purple-400" />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
