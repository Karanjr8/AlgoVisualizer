import { cn } from '../../lib/utils';
import { Check, X } from 'lucide-react';

export const ALL_TOPICS = [
  'Data Structures and Algorithms',
  'Object-Oriented Programming',
  'DBMS and SQL',
  'Operating Systems',
  'Computer Networks',
  'System Design',
  'JavaScript',
  'React.js',
  'Node.js and Express.js',
  'Backend Development',
  'Frontend Development',
  'Database Management',
  'Problem Solving',
  'Behavioral Questions',
  'Arrays',
  'Trees and BST',
  'Graphs',
  'Dynamic Programming',
];

export const TOPIC_PRESETS: Record<string, string[]> = {
  csCore: ['Data Structures and Algorithms', 'Operating Systems', 'DBMS and SQL', 'Computer Networks', 'Object-Oriented Programming'],
  frontend: ['JavaScript', 'React.js', 'Frontend Development', 'Problem Solving'],
  backend: ['Node.js and Express.js', 'Backend Development', 'DBMS and SQL', 'System Design', 'Operating Systems'],
  dsa: ['Data Structures and Algorithms', 'Arrays', 'Trees and BST', 'Graphs', 'Dynamic Programming', 'Problem Solving'],
};

interface TopicChipGroupProps {
  selectedTopics: string[];
  onToggleTopic: (topic: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSelectPreset?: (preset: string[]) => void;
}

export const TopicChipGroup = ({
  selectedTopics,
  onToggleTopic,
  onSelectAll,
  onClearAll,
  onSelectPreset,
}: TopicChipGroupProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Interview Topics
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {selectedTopics.length} selected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Select the technical domains to assess. The AI interviewer will generate questions strictly from these topics.
          </p>
        </div>

        {/* Quick Filter Actions */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0 self-end sm:self-auto">
          {onSelectPreset && (
            <>
              <button
                type="button"
                onClick={() => onSelectPreset(TOPIC_PRESETS.csCore)}
                className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                title="Select Core CS Fundamentals"
              >
                CS Core
              </button>
              <button
                type="button"
                onClick={() => onSelectPreset(TOPIC_PRESETS.frontend)}
                className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                title="Select Frontend Stack"
              >
                Frontend
              </button>
              <button
                type="button"
                onClick={() => onSelectPreset(TOPIC_PRESETS.backend)}
                className="px-2.5 py-1 rounded-lg bg-secondary text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                title="Select Backend Stack"
              >
                Backend
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onSelectAll}
            className="px-2.5 py-1 rounded-lg bg-card border border-border/80 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
          >
            All
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="px-2.5 py-1 rounded-lg bg-card border border-border/80 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* Selectable Chips Grid */}
      <div className="flex flex-wrap gap-2 pt-0.5">
        {ALL_TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic);

          return (
            <button
              type="button"
              key={topic}
              onClick={() => onToggleTopic(topic)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 border cursor-pointer outline-none transform-gpu hover:-translate-y-[1px]',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs font-bold'
                  : 'bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card/90'
              )}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              <span>{topic}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
