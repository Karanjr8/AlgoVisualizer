import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Timer, Bug, Zap, Activity, Briefcase, 
  Crosshair, CheckCircle2, TrendingUp, Trophy, ChevronRight, BarChart3
} from 'lucide-react';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

const MOCK_STATS = {
  attempts: 42,
  accuracy: 87,
  completionRate: 24,
  totalAvailable: 150,
  bestScore: 2450,
  recentPerformance: [true, true, false, true, true, false, true] // true = success, false = fail
};

const PRACTICE_MODES = [
  {
    id: 'timed-challenges',
    title: 'Timed Challenges',
    description: 'Solve classic algorithmic problems before the clock runs out. Tests your raw coding speed and accuracy under pressure.',
    difficulty: 'All Levels',
    duration: '15-30 min',
    icon: Timer,
    color: 'from-blue-500 to-cyan-400',
    bgLight: 'bg-blue-500/10',
    borderLight: 'border-blue-500/20'
  },
  {
    id: 'debug',
    title: 'Debug The Algorithm',
    description: 'We wrote a broken sorting or searching algorithm. Your job is to find the bug and fix it as fast as possible.',
    difficulty: 'Intermediate',
    duration: '10-20 min',
    icon: Bug,
    color: 'from-rose-500 to-orange-400',
    bgLight: 'bg-rose-500/10',
    borderLight: 'border-rose-500/20'
  },
  {
    id: 'speed-run',
    title: 'Speed Run',
    description: 'Rapid-fire questions testing your fundamental knowledge. Multiple choice, time complexity analysis, and quick tracing.',
    difficulty: 'Beginner',
    duration: '5-10 min',
    icon: Zap,
    color: 'from-yellow-500 to-amber-400',
    bgLight: 'bg-yellow-500/10',
    borderLight: 'border-yellow-500/20'
  },
  {
    id: 'complexity',
    title: 'Complexity Challenges',
    description: 'Analyze given code snippets and correctly deduce their Big-O Time and Space complexities.',
    difficulty: 'Intermediate',
    duration: '15 min',
    icon: Activity,
    color: 'from-emerald-500 to-teal-400',
    bgLight: 'bg-emerald-500/10',
    borderLight: 'border-emerald-500/20'
  },
  {
    id: 'interview',
    title: 'Interview Simulator',
    description: 'A mock 45-minute technical interview setup. Includes an initial problem, a follow-up constraint, and complexity analysis.',
    difficulty: 'Advanced',
    duration: '45 min',
    icon: Briefcase,
    color: 'from-purple-500 to-pink-400',
    bgLight: 'bg-purple-500/10',
    borderLight: 'border-purple-500/20'
  }
];

export const Practice = () => {
  return (
    <WorkspaceLayout>
      {/* Widescreen Left-Aligned Hero */}
      <div className="relative overflow-hidden bg-card border border-border/80 p-8 sm:p-10 rounded-3xl mb-8 shadow-sm">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-start text-left gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary type-badge">
            <Crosshair className="w-4 h-4" />
            <span>Training Ground Active</span>
          </div>
          
          <h1 className="type-page-title">
            Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">Arena</span>
          </h1>
          
          <p className="type-body max-w-3xl">
            Step into the arena to test your skills. Apply your knowledge through timed challenges, debugging sessions, complexity analysis, and simulated company rounds.
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-8">
        {/* Progress Dashboard Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {/* Attempts */}
          <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm text-left">
            <div className="flex items-center gap-2.5 mb-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Attempts</h3>
            </div>
            <div className="text-3xl font-black text-foreground">{MOCK_STATS.attempts}</div>
          </div>

          {/* Accuracy */}
          <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm text-left">
            <div className="flex items-center gap-2.5 mb-2 text-muted-foreground">
              <Crosshair className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Accuracy</h3>
            </div>
            <div className="text-3xl font-black text-emerald-500">{MOCK_STATS.accuracy}%</div>
          </div>

          {/* Completion */}
          <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm text-left">
            <div className="flex items-center gap-2.5 mb-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Completion</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-foreground">{MOCK_STATS.completionRate}</span>
              <span className="text-xs text-muted-foreground font-semibold">/{MOCK_STATS.totalAvailable}</span>
            </div>
          </div>

          {/* Best Score */}
          <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm text-left">
            <div className="flex items-center gap-2.5 mb-2 text-muted-foreground">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Best Score</h3>
            </div>
            <div className="text-3xl font-black text-amber-400">{MOCK_STATS.bestScore}</div>
          </div>

          {/* Recent Performance */}
          <div className="col-span-2 lg:col-span-1 bg-card border border-border/80 p-5 rounded-2xl shadow-sm text-left">
            <div className="flex items-center gap-2.5 mb-3 text-muted-foreground">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Recent</h3>
            </div>
            <div className="flex items-center gap-1.5 h-7">
              {MOCK_STATS.recentPerformance.map((success, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-full rounded-sm ${success ? 'bg-emerald-500/80' : 'bg-rose-500/60'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Practice Modes */}
        <div className="flex flex-col gap-1 text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Training Modes</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Select a mode to begin your interactive training session.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_MODES.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <Link 
                  to={`/practice/${mode.id}`}
                  className="block h-full bg-card border border-border/80 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group relative overflow-hidden text-left"
                >
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon & Badges */}
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl ${mode.bgLight} ${mode.borderLight} border flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-muted rounded-full text-muted-foreground">
                        {mode.difficulty}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-background rounded-full border border-border">
                        {mode.duration}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col gap-2">
                    <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">{mode.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-3">
                      {mode.description}
                    </p>
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center text-xs font-bold text-primary mt-6 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300">
                    Enter Mode <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </WorkspaceLayout>
  );
};
