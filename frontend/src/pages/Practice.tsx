
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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-card border border-border pt-16 pb-12 rounded-3xl mb-12 shadow-sm">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6">
              <Crosshair className="w-4 h-4" />
              <span>Training Ground Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Arena</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Step into the arena to test your skills. Apply your knowledge through timed challenges, debugging sessions, and simulated interviews.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="pt-4 w-full">
        {/* Progress Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-16"
        >
          {/* Attempts */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Attempts</h3>
            </div>
            <div className="text-3xl font-black">{MOCK_STATS.attempts}</div>
          </div>

          {/* Accuracy */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <Crosshair className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Accuracy</h3>
            </div>
            <div className="text-3xl font-black text-green-500">{MOCK_STATS.accuracy}%</div>
          </div>

          {/* Completion */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Completion</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">{MOCK_STATS.completionRate}</span>
              <span className="text-muted-foreground font-medium">/{MOCK_STATS.totalAvailable}</span>
            </div>
          </div>

          {/* Best Score */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <Trophy className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Best Score</h3>
            </div>
            <div className="text-3xl font-black text-yellow-500">{MOCK_STATS.bestScore}</div>
          </div>

          {/* Recent Performance */}
          <div className="col-span-2 lg:col-span-1 bg-card border border-border p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-3 text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Recent</h3>
            </div>
            <div className="flex items-center gap-1.5 h-8">
              {MOCK_STATS.recentPerformance.map((success, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-full rounded-sm ${success ? 'bg-green-500/80' : 'bg-red-500/50'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Practice Modes */}
        <div className="mb-8">
          <h2 className="text-2xl font-black tracking-tight mb-2">Training Modes</h2>
          <p className="text-muted-foreground">Select a mode to begin your session.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_MODES.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link 
                  to={`/practice/${mode.id}`}
                  className={`block h-full bg-card border border-border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden`}
                >
                  {/* Subtle Background Glow on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon & Badges */}
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl ${mode.bgLight} ${mode.borderLight} border flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      {/* Icon with gradient mapping correctly */}
                      <Icon className="w-7 h-7 text-foreground" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-muted rounded-full text-muted-foreground">
                        {mode.difficulty}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-background rounded-full border border-border">
                        {mode.duration}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-black mb-3">{mode.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {mode.description}
                    </p>
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center text-sm font-bold text-primary mt-auto relative z-10 group-hover:translate-x-2 transition-transform duration-300">
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
