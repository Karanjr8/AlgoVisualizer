import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroIllustration } from '../components/landing/HeroIllustration';
import { 
  BrainCircuit, SplitSquareHorizontal, Bot, ArrowRight, 
  Play, BookOpen, Trophy, Sparkles, BarChart3, 
  FastForward, Search, Activity, ShieldCheck, Cpu
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export const Landing = () => {
  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden pt-0">
      
      {/* 1. HERO SECTION */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-4 md:pt-1 md:pb-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full -z-10 pointer-events-none opacity-40" style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)' }} />
        
        <motion.div 
          className="flex-1 flex flex-col items-start gap-6 z-10 w-full max-w-xl lg:max-w-2xl xl:max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary type-badge">
            <Sparkles className="w-4 h-4" />
            <span>The New Standard in DSA Education</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="type-hero-title text-left">
            Visualize. Understand.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">
              Master DSA.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="type-body max-w-xl lg:max-w-2xl xl:max-w-3xl text-left">
            Stop tracing code on paper. Learn algorithms, data structures, and problem-solving patterns through physics-driven animations, interactive step execution, and live AI guidance.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 w-full sm:w-auto mt-2">
            <Link to="/playground" className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-base shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2">
              Start Learning <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/explore" className="px-8 py-4 rounded-2xl bg-card border border-border hover:border-primary/40 font-bold text-base transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> Explore Algorithms
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex-1 w-full max-w-[650px] shrink-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HeroIllustration />
        </motion.div>
      </section>

      {/* 2. FEATURES GRID (4 COLUMNS) */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/50">
        <div className="flex flex-col gap-2 mb-8 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">Built for True Mastery</h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl">
            Designed specifically for human visual learning rather than standard linear debuggers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: <BrainCircuit className="w-6 h-6 text-primary" />,
              title: "Pedagogical Milestones",
              desc: "Instead of stepping through thousands of atomic ops, our Learning Mode pauses at key phases to explain the core intuition."
            },
            {
              icon: <SplitSquareHorizontal className="w-6 h-6 text-purple-400" />,
              title: "Physical Animations",
              desc: "Array elements and tree nodes physically swap and shift on screen using physics, perfectly matching your mental model."
            },
            {
              icon: <Bot className="w-6 h-6 text-emerald-400" />,
              title: "Integrated AI Tutor",
              desc: "Ask questions on any step. The integrated Gemini AI tutor analyzes the exact array state to give instant explanations."
            },
            {
              icon: <Cpu className="w-6 h-6 text-blue-400" />,
              title: "Interactive Sandbox",
              desc: "Experiment with custom input sets, change array sizes, toggle edge cases, and inspect step execution in real time."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={itemVariants}
              className="bg-card border border-border/80 p-6 rounded-3xl hover:border-primary/40 transition-colors flex flex-col gap-4 text-left"
            >
              <div className="bg-secondary/50 w-12 h-12 rounded-2xl flex items-center justify-center border border-border/60 shrink-0">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. LEARNING JOURNEY DASHBOARD */}
      <section className="w-full bg-card/40 py-12 border-y border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6 text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">Your Structured Path to Mastery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Play className="w-4 h-4"/>, title: "1. Observe the Strategy", desc: "Watch high-level execution to grasp overall approach." },
                { icon: <BookOpen className="w-4 h-4"/>, title: "2. Step by Milestone", desc: "Pause at critical junctures for detailed explanations." },
                { icon: <FastForward className="w-4 h-4"/>, title: "3. Inspect Variable State", desc: "Inspect pointers, auxiliary memory, and comparisons." },
                { icon: <Trophy className="w-4 h-4"/>, title: "4. Practice & Validate", desc: "Test your skills in practice arena challenges." },
              ].map((step, i) => (
                <div key={i} className="bg-card border border-border/70 p-4.5 rounded-2xl flex items-start gap-3.5">
                  <div className="mt-0.5 bg-primary/10 p-2.5 rounded-xl text-primary shrink-0 border border-primary/20">
                    {step.icon}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">{step.title}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 aspect-[16/9] bg-card rounded-3xl border border-border/80 overflow-hidden flex items-center justify-center p-6 relative shadow-lg">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
             <div className="w-full space-y-4 relative z-10">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground font-bold">MergeSortVisualizer.tsx</span>
                </div>

                <div className="flex justify-center gap-3 py-4">
                   <div className="w-12 h-16 bg-primary rounded-xl flex items-center justify-center font-mono font-bold text-white shadow-md">1</div>
                   <div className="w-12 h-16 bg-purple-500 rounded-xl flex items-center justify-center font-mono font-bold text-white shadow-md">3</div>
                   <div className="w-12 h-16 bg-emerald-500 rounded-xl flex items-center justify-center font-mono font-bold text-white shadow-md">5</div>
                   <div className="w-12 h-16 bg-secondary border border-border rounded-xl flex items-center justify-center font-mono font-bold text-foreground">8</div>
                </div>

                <div className="w-full bg-background border border-border/80 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> Auxiliary Array Merged (Sub-problem Solved)
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">O(N log N)</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES PREVIEW (4 COLUMNS) */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-1 mb-8 text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">Explore Algorithm Domains</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Select a category to start interactive visual step execution.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { name: "Sorting", icon: <BarChart3 className="w-6 h-6 text-purple-400" />, algorithms: 8, color: "from-purple-500/10 to-transparent", border: "border-purple-500/30" },
             { name: "Searching", icon: <Search className="w-6 h-6 text-blue-400" />, algorithms: 4, color: "from-blue-500/10 to-transparent", border: "border-blue-500/30" },
             { name: "Graphs", icon: <Activity className="w-6 h-6 text-cyan-400" />, algorithms: 12, color: "from-cyan-500/10 to-transparent", border: "border-cyan-500/30" },
             { name: "Dynamic Prog.", icon: <BrainCircuit className="w-6 h-6 text-emerald-400" />, algorithms: 15, color: "from-emerald-500/10 to-transparent", border: "border-emerald-500/30" },
           ].map((cat, i) => (
             <Link key={i} to="/explore" className={`p-6 rounded-3xl bg-gradient-to-br ${cat.color} border ${cat.border} flex flex-col gap-4 text-left hover:border-primary/60 transition-all group`}>
                <div className="p-3 bg-background border border-border/60 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                   {cat.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-xs font-semibold text-muted-foreground">{cat.algorithms} Algorithms Tracked</p>
                </div>
             </Link>
           ))}
        </div>
      </section>

      {/* 5. STATISTICS STRIP */}
      <section className="w-full border-y border-border/50 bg-card/20 py-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
           {[
             { value: "50+", label: "Algorithms Visualized" },
             { value: "1M+", label: "Step Frames Rendered" },
             { value: "24/7", label: "AI Tutor Assistance" },
             { value: "100%", label: "Free Educational Resource" },
           ].map((stat, i) => (
             <div key={i} className="flex flex-col gap-1 p-4 rounded-2xl bg-card/40 border border-border/50">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-purple-400">{stat.value}</div>
                <div className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS (3 COLUMNS) */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-1 mb-8 text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">Loved by Students & Engineers</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">Feedback from developers using AlgoVis to master computer science concepts.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { quote: "The physical swapping animations finally made Merge Sort and Quick Sort click in my head. Smooth, clean, and pedagogical.", author: "Sarah J.", role: "CS Student @ Berkeley" },
             { quote: "The milestone explanations in Learning Mode feel like having a senior engineer sit next to you and explain the edge cases.", author: "David M.", role: "Frontend Developer" },
             { quote: "I used to trace algorithms on a whiteboard for hours. AlgoVis does it instantly, and the widescreen UI is incredible.", author: "Elena R.", role: "Full Stack Developer" },
           ].map((test, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="bg-card border border-border/80 p-6 rounded-3xl flex flex-col justify-between text-left gap-6"
             >
                <p className="text-xs sm:text-sm italic text-muted-foreground leading-relaxed font-medium">"{test.quote}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                   <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {test.author[0]}
                   </div>
                   <div className="flex flex-col text-left">
                     <span className="font-bold text-xs sm:text-sm text-foreground">{test.author}</span>
                     <span className="text-[11px] text-muted-foreground font-medium">{test.role}</span>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-card border border-border p-8 md:p-12 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-purple-500/10 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">Ready to Master Data Structures & Algorithms?</h2>
             <p className="text-xs sm:text-sm text-muted-foreground font-medium">
               Join thousands of developers leveling up their algorithm intuition with our physics-driven visual platform.
             </p>
           </div>

           <div className="relative z-10 flex flex-wrap gap-3 shrink-0">
              <Link to="/register" className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md hover:brightness-110 transition-all">
                Create Free Account
              </Link>
              <Link to="/playground" className="px-6 py-3.5 rounded-2xl bg-background border border-border hover:border-primary/40 font-bold text-sm transition-all">
                Try Sandbox Mode
              </Link>
           </div>
        </div>
      </section>

    </div>
  );
};
