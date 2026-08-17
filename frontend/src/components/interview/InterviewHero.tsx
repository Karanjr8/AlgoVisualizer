import { motion } from 'framer-motion';
import { Bot, Sparkles, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

const BADGES = [
  { label: 'Adaptive AI Interviewer', icon: Bot },
  { label: 'Real-Time Evaluation', icon: Sparkles },
  { label: 'Technical + Behavioral', icon: ShieldCheck },
  { label: 'Detailed Report', icon: FileText },
];

export const InterviewHero = () => {
  return (
    <div className="w-full relative py-2 md:py-3">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-card/60 backdrop-blur-md border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Left Column: Left-Aligned Heading & Subtitle */}
        <div className="flex-1 flex flex-col gap-3.5 text-left">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" /> AI Interview Simulator
            </motion.div>

            <span className="text-xs sm:text-sm font-semibold text-muted-foreground hidden sm:inline">
              • Flagship Practice Suite
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight"
          >
            Practice Technical Interviews{' '}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Tailored to Your Role
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed text-left"
          >
            Configure your target role, difficulty, topics, and interview format below. Get instant AI evaluations on code accuracy, complexity, and communication.
          </motion.p>

          {/* Badges Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-2.5 pt-1"
          >
            {BADGES.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background border border-border/70 text-xs sm:text-sm font-semibold text-foreground shadow-xs"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Column: Minimal Header Status Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-80 shrink-0"
        >
          <div className="bg-background/80 border border-border/80 rounded-2xl p-4.5 shadow-sm flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-foreground">AI Engine Active</span>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Ready
              </span>
            </div>

            <p className="text-xs font-medium text-muted-foreground leading-snug">
              Adaptive questioning based on your problem-solving approach.
            </p>

            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-1.5 border-t border-border/40">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live Scoring
              </span>
              <span>FAANG Standard</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
