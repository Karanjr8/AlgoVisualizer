import { cn } from '../../lib/utils';
import { Sparkles, Flame, ShieldAlert, Check } from 'lucide-react';

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
    tagline: 'Foundations & core algorithmic concepts',
    icon: Sparkles,
    color: 'text-emerald-500',
  },
  {
    id: 'Medium',
    label: 'Medium',
    tagline: 'Standard technical interview rounds',
    icon: Flame,
    color: 'text-amber-500',
  },
  {
    id: 'Hard',
    label: 'Hard',
    tagline: 'Advanced constraints & FAANG-level depth',
    icon: ShieldAlert,
    color: 'text-rose-500',
  },
];

interface DifficultySelectorProps {
  selectedDifficulty: 'Easy' | 'Medium' | 'Hard';
  onSelectDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
}

export const DifficultySelector = ({ selectedDifficulty, onSelectDifficulty }: DifficultySelectorProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Difficulty Level
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Calibrates problem complexity, constraint strictness, and interviewer rigor.
        </p>
      </div>

      {/* 3-Column Difficulty Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DIFFICULTIES.map((diff) => {
          const isSelected = selectedDifficulty === diff.id;
          const Icon = diff.icon;

          return (
            <button
              key={diff.id}
              onClick={() => onSelectDifficulty(diff.id)}
              className={cn(
                'relative p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-1.5 cursor-pointer outline-none group transform-gpu hover:-translate-y-[1px]',
                isSelected
                  ? 'bg-primary/5 border-primary/60 shadow-xs ring-1 ring-primary/40'
                  : 'bg-card border-border/80 hover:border-primary/40 hover:bg-card/90'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-secondary shrink-0">
                    <Icon className={cn('w-4 h-4', diff.color)} />
                  </div>
                  <span className="text-sm font-bold text-foreground">{diff.label}</span>
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground font-medium leading-snug">
                {diff.tagline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
