import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Zap, Compass, Building2, Server, Users, Check } from 'lucide-react';

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
    tagline: 'Fast-paced intuition & quick CS questions',
    icon: Zap,
    duration: '15 min',
    questionCount: '12 Qs',
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    tagline: 'Detailed discussion & follow-up trade-offs',
    icon: Compass,
    duration: '45 min',
    questionCount: '4 Deep Qs',
  },
  {
    id: 'mock-company',
    name: 'Mock Company Round',
    tagline: 'Simulated 45-min full technical interview',
    icon: Building2,
    duration: '45 min',
    questionCount: '2 Medium/Hard',
  },
  {
    id: 'system-design',
    name: 'System Design Round',
    tagline: 'High-level architecture & scalability',
    icon: Server,
    duration: '60 min',
    questionCount: '1 Full System',
  },
  {
    id: 'behavioral-round',
    name: 'Behavioral Round',
    tagline: 'Leadership, teamwork & STAR scenarios',
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
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          4. Choose Interview Style
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          Select session format, duration, and questioning pace.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          const Icon = style.icon;

          return (
            <motion.button
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'relative p-4.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer outline-none group',
                isSelected
                  ? 'bg-card border-primary shadow-md shadow-primary/10 ring-2 ring-primary/30'
                  : 'bg-card/60 border-border/70 hover:border-primary/40 hover:bg-card'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={cn(
                    'p-2.5 rounded-xl transition-colors',
                    isSelected ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  )}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded border border-border/50">
                    {style.duration}
                  </span>
                  {isSelected && (
                    <span className="w-4.5 h-4.5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {style.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-semibold truncate">
                  {style.tagline}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
