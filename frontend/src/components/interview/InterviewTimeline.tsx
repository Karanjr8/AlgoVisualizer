import { MessageCircle, Code2, HelpCircle, BrainCircuit, Award } from 'lucide-react';

const TIMELINE_STEPS = [
  { step: 1, title: 'Candidate Introduction', icon: MessageCircle },
  { step: 2, title: 'Problem Formulation', icon: Code2 },
  { step: 3, title: 'Live Coding & Tracing', icon: BrainCircuit },
  { step: 4, title: 'Follow-Up Constraints', icon: HelpCircle },
  { step: 5, title: 'AI Diagnostic Report', icon: Award },
];

export const InterviewTimeline = () => {
  return (
    <div className="w-full bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <span className="text-xs font-bold uppercase text-foreground tracking-wider">
          Session Flow
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground">
          5 Phases
        </span>
      </div>

      <div className="flex flex-col gap-1.5 relative pt-1">
        <div className="absolute left-[13px] top-3.5 bottom-3.5 w-px bg-border -z-10" />

        {TIMELINE_STEPS.map((s, idx) => {
          const Icon = s.icon;

          return (
            <div key={idx} className="flex items-center gap-2.5 group py-0.5">
              <div className="w-6 h-6 rounded-md bg-secondary border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 shrink-0 transition-colors">
                <Icon className="w-3 h-3" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="text-foreground font-semibold">{s.step}.</span> {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
