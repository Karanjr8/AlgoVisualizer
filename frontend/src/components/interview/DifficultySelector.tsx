import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Sparkles, Flame, ShieldAlert } from 'lucide-react';

export interface DifficultyOption {
  id: 'Easy' | 'Medium' | 'Hard';
  label: string;
  tagline: string;
  icon: any;
  color: string;
}

export const DIFFICULTIES: DifficultyOption[] = [
  {
    id: 'Easy',
    label: 'Easy',
    tagline: 'Beginner-friendly & core concepts',
    icon: Sparkles,
    color: 'text-emerald-500',
  },
  {
    id: 'Medium',
    label: 'Medium',
    tagline: 'Standard tech round questions',
    icon: Flame,
    color: 'text-amber-500',
  },
  {
    id: 'Hard',
    label: 'Hard',
    tagline: 'Advanced & FAANG-level depth',
    icon: ShieldAlert,
    color: 'text-destructive',
  },
];

interface DifficultySelectorProps {
  selectedDifficulty: 'Easy' | 'Medium' | 'Hard';
  onSelectDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
}

export const DifficultySelector = ({ selectedDifficulty, onSelectDifficulty }: DifficultySelectorProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          2. Choose Difficulty Level
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          Calibrates question difficulty and interviewer evaluation rigor.
        </p>
      </div>

      {/* Segmented Container */}
      <div className="w-full bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-2 shadow-inner grid grid-cols-1 md:grid-cols-3 gap-2 relative">
        {DIFFICULTIES.map((diff) => {
          const isSelected = selectedDifficulty === diff.id;
          const Icon = diff.icon;

          return (
            <button
              key={diff.id}
              onClick={() => onSelectDifficulty(diff.id)}
              className={cn(
                'relative z-10 p-4 rounded-xl text-left transition-all duration-150 flex flex-col gap-1 cursor-pointer outline-none group border border-transparent',
                isSelected ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Sliding Pill Background */}
              {isSelected && (
                <motion.div
                  layoutId="difficulty-pill"
                  className="absolute inset-0 bg-card rounded-xl border border-primary/40 shadow-md shadow-primary/10 -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="flex items-center gap-2">
                <Icon className={cn('w-4.5 h-4.5', diff.color)} />
                <span className="text-base sm:text-lg font-black">{diff.label}</span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-semibold truncate">
                {diff.tagline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
