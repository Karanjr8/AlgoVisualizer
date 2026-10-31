import React from 'react';
import { Sparkles, Bot, ShieldCheck, Zap } from 'lucide-react';

export const InterviewHero: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-3 pb-2 border-b border-border/60">
      {/* Section Badge & Category Link */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Practice Arena &bull; Technical Interviews</span>
        </div>

        {/* Compact AI Status Indicator */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-card border border-border/80 text-xs font-semibold text-foreground shrink-0 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground">AI Engine:</span>
          <span className="text-emerald-500 font-bold">Ready</span>
        </div>
      </div>

      {/* Main Title & Subtitle Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">Simulator</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
            Configure and practice realistic technical interviews tailored to your target role, difficulty, and focus topics with live AI evaluation.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border/80 text-xs font-semibold text-muted-foreground">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span>Adaptive Questioning</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border/80 text-xs font-semibold text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Evaluation</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border/80 text-xs font-semibold text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Detailed Feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
};
