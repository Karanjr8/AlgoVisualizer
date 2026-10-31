import { cn } from '../../lib/utils';
import { Zap, Compass, Building2, Server, Users, Check, Clock } from 'lucide-react';

export interface StyleOption {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  duration: string;
  questionCount: string;
}

export const STYLES: StyleOption[] = [
  {
    id: 'rapid-fire',
    name: 'Rapid Fire',
    tagline: 'Fast-paced intuition & quick algorithmic questions',
    icon: Zap,
    duration: '15 min',
    questionCount: '12 Qs',
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    tagline: 'Detailed discussion with follow-up trade-offs',
    icon: Compass,
    duration: '45 min',
    questionCount: '4 Deep Qs',
  },
  {
    id: 'mock-company',
    name: 'Mock Company Round',
    tagline: 'Full 45-min technical interview simulation',
    icon: Building2,
    duration: '45 min',
    questionCount: '2 Medium/Hard',
  },
  {
    id: 'system-design',
    name: 'System Design Round',
    tagline: 'High-level architecture, scalability & constraints',
    icon: Server,
    duration: '60 min',
    questionCount: '1 Full System',
  },
  {
    id: 'behavioral-round',
    name: 'Behavioral Round',
    tagline: 'Leadership, collaboration & STAR scenarios',
    icon: Users,
    duration: '30 min',
    questionCount: '6 Scenarios',
  },
];

interface InterviewStyleCardGroupProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
}

export const InterviewStyleCardGroup = ({ selectedStyle, onSelectStyle }: InterviewStyleCardGroupProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Interview Format & Style
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Choose the session structure, duration, and question pacing.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          const Icon = style.icon;

          return (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              className={cn(
                'relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer outline-none group transform-gpu hover:-translate-y-[1px]',
                isSelected
                  ? 'bg-primary/5 border-primary/60 shadow-xs ring-1 ring-primary/40'
                  : 'bg-card border-border/80 hover:border-primary/40 hover:bg-card/90'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={cn(
                    'p-2 rounded-xl transition-colors',
                    isSelected
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-secondary text-muted-foreground group-hover:text-primary transition-colors'
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md border border-border/60">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {style.duration}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {style.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-snug">
                  {style.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
