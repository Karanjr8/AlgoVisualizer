import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeroIllustration } from '../components/landing/HeroIllustration';
import { 
  BrainCircuit, SplitSquareHorizontal, Bot, ArrowRight, 
  Play, BookOpen, Trophy, Sparkles, BarChart3, 
  FastForward, Search, Activity
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
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full -z-10 pointer-events-none opacity-50" style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)' }} />
        
        <motion.div 
          className="flex-1 flex flex-col items-start gap-6 z-10 mt-8 md:mt-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>The New Standard in DSA Education</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Visualize. <br/>
            Understand. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Master DSA.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Stop tracing code on paper. Learn algorithms, patterns, and data structures through interactive, physics-driven visualizations that build deep intuition.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Link to="/playground" className="btn btn-primary px-8 py-4 rounded-xl text-lg relative z-10">
              Start Learning <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/explore" className="btn btn-ghost px-8 py-4 rounded-xl text-lg border border-border hover:border-border relative z-10">
              <Play className="w-5 h-5" /> Explore Algorithms
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex-1 w-full max-w-[600px] mx-auto md:mx-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <HeroIllustration />
        </motion.div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 border-t border-border/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for true understanding</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We abandoned the standard "debugger" visualizers to create a pedagogical tool designed specifically for human learning.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <BrainCircuit className="w-8 h-8 text-primary" />,
              title: "Pedagogical Milestones",
              desc: "Instead of stepping through thousands of atomic operations, our Learning Mode intelligently pauses at meaningful phases to explain the 'Why'."
            },
            {
              icon: <SplitSquareHorizontal className="w-8 h-8 text-secondary" />,
              title: "Physical Animations",
              desc: "No more fake bar charts. Arrays and nodes physically swap and shift on the screen using Framer Motion physics, perfectly mirroring the mental model."
            },
            {
              icon: <Bot className="w-8 h-8 text-accent" />,
              title: "AI Tutor Integration",
              desc: "Stuck on a concept? Our integrated Gemini AI tutor has full context of the algorithm and your current step, ready to answer questions instantly."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={itemVariants}
              className="bg-card border border-border p-8 rounded-3xl hover:bg-card transition-colors"
            >
              <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center border border-border mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. LEARNING JOURNEY */}
      <section className="w-full bg-muted/10 py-16 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Your path to mastery</h2>
            <div className="space-y-6">
              {[
                { icon: <Play className="w-5 h-5"/>, title: "1. Observe the Flow", desc: "Watch the algorithm run continuously to grasp the high-level strategy." },
                { icon: <BookOpen className="w-5 h-5"/>, title: "2. Step by Milestone", desc: "Use Learning Mode to pause at critical junctures and read the explanations." },
                { icon: <FastForward className="w-5 h-5"/>, title: "3. Analyze the Details", desc: "Switch to Detailed Mode to inspect every single variable comparison and swap." },
                { icon: <Trophy className="w-5 h-5"/>, title: "4. Track Progress", desc: "Log into your dashboard to track completed algorithms and earn mastery badges." },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 bg-primary/10 p-2 rounded-xl text-primary h-fit">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{step.title}</h4>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative w-full aspect-[4/3] bg-card rounded-3xl border border-border overflow-hidden flex items-center justify-center p-8">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
             {/* Mockup of UI */}
             <div className="w-full max-w-sm space-y-4 relative z-10">
                <div className="w-full h-8 bg-muted rounded-md border border-border" />
                <div className="flex gap-2">
                   <div className="w-12 h-16 bg-primary rounded-md shadow-sm" />
                   <div className="w-12 h-16 bg-secondary rounded-md" />
                   <div className="w-12 h-16 bg-card border border-border rounded-md" />
                   <div className="w-12 h-16 bg-card border border-border rounded-md" />
                   <div className="w-12 h-16 bg-card border border-border rounded-md" />
                </div>
                <div className="w-full h-24 bg-card border border-border rounded-xl mt-8 flex flex-col justify-center p-4">
                  <div className="w-24 h-4 bg-primary/30 rounded-full mb-2" />
                  <div className="w-full h-3 bg-accent rounded-full mb-1" />
                  <div className="w-3/4 h-3 bg-accent rounded-full" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES PREVIEW */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Explore Algorithms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { name: "Sorting", icon: <BarChart3 />, algorithms: 8, color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/30" },
             { name: "Searching", icon: <Search />, algorithms: 4, color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30" },
             { name: "Graphs", icon: <Activity />, algorithms: 12, color: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/30" },
             { name: "Dynamic Prog.", icon: <BrainCircuit />, algorithms: 15, color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30" },
           ].map((cat, i) => (
             <div key={i} className={`card-interactive p-6 rounded-3xl bg-gradient-to-b ${cat.color} border ${cat.border} backdrop-blur-sm flex flex-col items-center text-center cursor-pointer`}>
                <div className="p-4 bg-background/50 rounded-2xl mb-4 backdrop-blur-md">
                   {cat.icon}
                </div>
                <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.algorithms} Algorithms</p>
             </div>
           ))}
        </div>
      </section>

      {/* 5. STATISTICS */}
      <section className="w-full border-y border-border/50 bg-card/10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border text-center">
           {[
             { value: "50+", label: "Algorithms" },
             { value: "1M+", label: "Steps Visualized" },
             { value: "24/7", label: "AI Tutor Access" },
             { value: "100%", label: "Free Forever" },
           ].map((stat, i) => (
             <div key={i} className="flex flex-col items-center justify-center">
                <div className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium uppercase tracking-wider text-xs md:text-sm">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by students</h2>
          <p className="text-muted-foreground text-lg">See how we've helped thousands ace their coding interviews.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { quote: "The physical swapping animations finally made Quick Sort click in my head. I've never seen a visualizer this smooth.", author: "Sarah J.", role: "CS Student" },
             { quote: "The milestone explanations in Learning Mode feel exactly like having a TA sit next to you and explain the tricky parts.", author: "David M.", role: "Software Engineer" },
             { quote: "I used to trace algorithms on a whiteboard for hours. This app does it instantly, and the UI is absolutely gorgeous.", author: "Elena R.", role: "Bootcamp Grad" },
           ].map((test, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="bg-card/20 border border-border p-8 rounded-3xl flex flex-col justify-between"
             >
                <p className="text-sm md:text-base italic text-muted-foreground mb-8 leading-relaxed">"{test.quote}"</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-white font-bold">
                      {test.author[0]}
                   </div>
                   <div>
                     <div className="font-bold text-sm">{test.author}</div>
                     <div className="text-xs text-muted-foreground">{test.role}</div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16 mb-12">
        <div className="relative rounded-[2rem] overflow-hidden bg-card border border-border p-10 md:p-16 text-center">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
           
           <div className="relative z-10 flex flex-col items-center">
             <h2 className="text-3xl md:text-5xl font-black mb-4">Ready to master Data Structures?</h2>
             <p className="text-lg text-muted-foreground max-w-2xl mb-8">
               Join thousands of developers leveling up their algorithm skills with our interactive, physics-driven platform.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn btn-primary px-8 py-4 rounded-xl text-base relative z-10">
                  Create Free Account
                </Link>
                <Link to="/playground" className="btn btn-ghost px-8 py-4 rounded-xl text-base border border-border hover:border-border relative z-10">
                  Try as Guest
                </Link>
             </div>
           </div>
        </div>
      </section>

    </div>
  );
};
