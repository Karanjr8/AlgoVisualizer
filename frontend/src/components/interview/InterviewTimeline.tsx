import { MessageCircle, Code2, HelpCircle, BrainCircuit, Award } from 'lucide-react';

const TIMELINE_STEPS = [
  { step: 1, title: 'Introduction', icon: MessageCircle },
  { step: 2, title: 'Technical Rounds', icon: Code2 },
  { step: 3, title: 'Follow-Up Deep Dive', icon: HelpCircle },
  { step: 4, title: 'Problem Solving', icon: BrainCircuit },
  { step: 5, title: 'AI Report & Score', icon: Award },
];

export const InterviewTimeline = () => {
  return (
    <div className="w-full bg-card/60 border border-border/80 rounded-2xl p-4.5 shadow-sm flex flex-col gap-3.5">
      <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
        <span className="text-xs font-black uppercase text-muted-foreground tracking-wider">
          Interview Journey
        </span>
        <span className="text-xs font-bold text-muted-foreground">
          5 Sequential Steps
        </span>
      </div>

      <div className="flex flex-col gap-2.5 relative">
        <div className="absolute left-[15px] top-3.5 bottom-3.5 w-[2px] bg-gradient-to-b from-primary via-purple-500 to-emerald-500 opacity-25 -z-10" />

        {TIMELINE_STEPS.map((s, idx) => {
          const Icon = s.icon;

          return (
            <div key={idx} className="flex items-center gap-3 group py-0.5">
              <div className="w-8 h-8 rounded-lg bg-card border border-border group-hover:border-primary/50 flex items-center justify-center text-primary font-bold text-xs shrink-0 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                Step {s.step}: {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
