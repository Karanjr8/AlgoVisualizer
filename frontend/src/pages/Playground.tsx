import { Link } from 'react-router-dom';
import { 
  FlaskConical, 
  Network, 
  Swords, 
  Activity, 
  PenTool, 
  GitBranch, 
  Sparkles,
  ArrowRight,
  Trophy,
  Zap,
  Target,
  UserCheck,
  LogIn,
  PlayCircle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const Playground = () => {
  const { user } = useAuthStore();

  const modules = [
    {
      id: 'algorithm-lab',
      title: "Algorithm Lab",
      subtitle: "Side-by-Side Experimentation",
      description: "Experiment with Sorting and Searching algorithms. Run 2 algorithms simultaneously side-by-side on identical datasets with live updating metrics.",
      icon: <FlaskConical className="w-7 h-7 text-blue-400" />,
      color: "from-blue-500/20 to-cyan-500/10",
      borderColor: "hover:border-blue-500/50",
      accentBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      to: "/playground/algorithm-lab",
      tag: "Dual Comparison"
    },
    {
      id: 'structure-builder',
      title: "Data Structure Builder",
      subtitle: "Interactive Construction Canvas",
      description: "Build Linked Lists at position, BSTs with height/node/leaf counters, Heaps with dual Tree + Array views, and Tries with prefix highlighting.",
      icon: <Network className="w-7 h-7 text-purple-400" />,
      color: "from-purple-500/20 to-pink-500/10",
      borderColor: "hover:border-purple-500/50",
      accentBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      to: "/playground/structure-builder",
      tag: "Dual Tree/Array"
    },
    {
      id: 'algorithm-arena',
      title: "Algorithm Arena",
      subtitle: "Race Mode & Leaderboards",
      description: "Race algorithms head-to-head (Merge vs Quick, DFS vs BFS, Dijkstra vs Bellman-Ford). Live leaderboard for swaps, time, memory, and winner badge.",
      icon: <Swords className="w-7 h-7 text-rose-400" />,
      color: "from-rose-500/20 to-orange-500/10",
      borderColor: "hover:border-rose-500/50",
      accentBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      to: "/playground/algorithm-arena",
      tag: "Live Leaderboard"
    },
    {
      id: 'complexity-lab',
      title: "Complexity Laboratory",
      subtitle: "Asymptotic Growth (N = 10 → 10k)",
      description: "Visualize scaling behavior from N=10 to N=10,000 across O(1), O(log N), O(N), O(N log N), and O(N²). Live operation count estimator.",
      icon: <Activity className="w-7 h-7 text-amber-400" />,
      color: "from-amber-500/20 to-yellow-500/10",
      borderColor: "hover:border-amber-500/50",
      accentBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      to: "/playground/complexity-lab",
      tag: "N = 10,000 Scaling"
    },
    {
      id: 'input-studio',
      title: "Input Studio",
      subtitle: "Tailored Dataset Generation",
      description: "Generate tailored datasets for Arrays (Sorted, Reverse, Duplicate Heavy), Trees (Balanced, Skewed), and Graphs (Sparse, Dense, DAG, Weighted).",
      icon: <PenTool className="w-7 h-7 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/10",
      borderColor: "hover:border-emerald-500/50",
      accentBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      to: "/playground/input-studio",
      tag: "Dataset Factory"
    },
    {
      id: 'what-if',
      title: "What-If Simulator",
      subtitle: "Dynamic Algorithm Rules",
      description: "Modify binary search midpoint strategies, pivot selection rules in Quick Sort, or live edge weights in Dijkstra to observe behavioral shifts.",
      icon: <GitBranch className="w-7 h-7 text-cyan-400" />,
      color: "from-cyan-500/20 to-blue-500/10",
      borderColor: "hover:border-cyan-500/50",
      accentBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      to: "/playground/what-if",
      tag: "Dynamic Rules"
    },
  ];

  const featuredExperiments = [
    {
      title: "Quick Sort vs Merge Sort Arena",
      category: "Algorithm Arena",
      description: "Race Quick Sort against Merge Sort on random vs duplicate-heavy datasets.",
      to: "/playground/algorithm-arena",
      icon: <Swords className="w-5 h-5 text-rose-400" />,
      badge: "Leaderboard Race"
    },
    {
      title: "Heap Tree & Array Sync",
      category: "Data Structure Builder",
      description: "Insert elements into a Heap and watch the 2D Tree and 1D Array update in sync.",
      to: "/playground/structure-builder",
      icon: <Network className="w-5 h-5 text-purple-400" />,
      badge: "Dual Representation"
    },
    {
      title: "Scaling Up to N = 10,000",
      category: "Complexity Laboratory",
      description: "See why O(N²) explodes to 100M operations while O(N log N) stays under 140k.",
      to: "/playground/complexity-lab",
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      badge: "Asymptotic Analysis"
    },
    {
      title: "Dynamic Midpoint Simulator",
      category: "What-If Simulator",
      description: "Experiment with standard vs safe vs overflow midpoint formulas in Binary Search.",
      to: "/playground/what-if",
      icon: <GitBranch className="w-5 h-5 text-cyan-400" />,
      badge: "Rule Simulation"
    }
  ];

  const scrollToGrid = () => {
    const el = document.getElementById('labs-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-background text-foreground min-h-screen relative overflow-hidden pb-20">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 sm:space-y-10">
        
        {/* HERO SECTION */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/90 via-card/60 to-primary/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> AlgoVis Interactive Suite
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
                Learn By <span className="bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">Experimenting</span>
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                The interactive laboratory where algorithms become hands-on experiences. Build data structures, race execution speeds, modify rules, and master asymptotic complexity.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={scrollToGrid}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" /> Open Playground
                </button>
                <Link
                  to="/playground/algorithm-lab"
                  className="px-6 py-3 rounded-xl bg-card border border-border/80 hover:border-primary/50 text-foreground font-bold text-sm hover:bg-accent/50 active:scale-95 transition-all flex items-center gap-2"
                >
                  Explore Labs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Stat Callout */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="p-4 bg-background/80 border border-border/80 backdrop-blur-md rounded-2xl space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-primary">6</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Experimentation Labs</div>
              </div>
              <div className="p-4 bg-background/80 border border-border/80 backdrop-blur-md rounded-2xl space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-cyan-400">100%</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hands-On Control</div>
              </div>
              <div className="p-4 bg-background/80 border border-border/80 backdrop-blur-md rounded-2xl space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-purple-400">N=10k</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Max Growth Scale</div>
              </div>
              <div className="p-4 bg-background/80 border border-border/80 backdrop-blur-md rounded-2xl space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">8-12</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Optimal Default Size</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESS TRACKING SECTION */}
        <section className="w-full bg-card/70 border border-border/80 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-lg">
          {user ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Welcome back, {user.username}!</h3>
                    <p className="text-xs text-muted-foreground font-medium">Here is your Playground activity summary</p>
                  </div>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Playground Active Member
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                <div className="p-4 bg-background/60 border border-border/60 rounded-2xl flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-foreground">6</div>
                    <div className="text-[11px] text-muted-foreground font-semibold">Labs Available</div>
                  </div>
                </div>
                <div className="p-4 bg-background/60 border border-border/60 rounded-2xl flex items-center gap-4">
                  <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-foreground">450 XP</div>
                    <div className="text-[11px] text-muted-foreground font-semibold">Playground Points</div>
                  </div>
                </div>
                <div className="p-4 bg-background/60 border border-border/60 rounded-2xl flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-foreground">94%</div>
                    <div className="text-[11px] text-muted-foreground font-semibold">Step Accuracy</div>
                  </div>
                </div>
                <div className="p-4 bg-background/60 border border-border/60 rounded-2xl flex items-center gap-4">
                  <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground truncate">Algorithm Arena</div>
                    <div className="text-[11px] text-muted-foreground font-semibold">Favorite Category</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5" /> Track Your Progress & Earn XP
                </div>
                <h3 className="text-xl font-black text-foreground">Sign in to save test cases & earn badges</h3>
                <p className="text-muted-foreground text-xs max-w-xl font-medium">
                  Logged-in users unlock Playground XP tracking, step-accuracy metrics, saved custom graph datasets, and completion badges.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5" /> Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-background border border-border hover:border-primary/40 font-bold text-xs transition-all"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* PLAYGROUND MODULES GRID */}
        <section id="labs-grid" className="space-y-5 text-left">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" /> 6 Specialized Mini-Labs
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Select An Interactive Module
            </h2>
            <p className="text-muted-foreground text-sm font-medium max-w-2xl">
              Choose a lab to dive deep into custom inputs, interactive structures, side-by-side races, or dynamic rule simulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <Link
                key={mod.id}
                to={mod.to}
                className={`group relative p-6 bg-card/90 border border-border/80 rounded-3xl overflow-hidden ${mod.borderColor} transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between hover:-translate-y-1 text-left`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${mod.color} rounded-bl-[100px] transition-transform duration-500 group-hover:scale-125`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-background border border-border/80 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {mod.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${mod.accentBg}`}>
                      {mod.tag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs font-bold text-primary/80 uppercase tracking-wider">
                      {mod.subtitle}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium pt-1">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 relative z-10 flex items-center justify-between border-t border-border/40 mt-5">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                    Launch Module
                  </span>
                  <div className="w-8 h-8 rounded-full bg-background border border-border/80 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/50 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED EXPERIMENTS SECTION */}
        <section className="space-y-5 text-left">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> Presets & Shortcuts
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Featured Experiments
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              Jump directly into pre-configured experiments designed to reveal non-obvious algorithmic behavior.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredExperiments.map((exp, idx) => (
              <Link
                key={idx}
                to={exp.to}
                className="p-5 bg-card/60 border border-border/80 hover:border-cyan-500/40 rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-col justify-between group text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-background rounded-xl border border-border">
                      {exp.icon}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider border border-cyan-500/20">
                      {exp.badge}
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{exp.category}</div>
                    <h4 className="text-base font-bold text-foreground group-hover:text-cyan-400 transition-colors mt-0.5">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-1">
                      {exp.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Launch Experiment <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};
