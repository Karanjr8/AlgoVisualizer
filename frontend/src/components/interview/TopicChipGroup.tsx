import { cn } from '../../lib/utils';
import { Check, Sparkles, X } from 'lucide-react';

export const ALL_TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues',
  'Trees', 'BST', 'Heap', 'Trie', 'Graphs', 'DP',
  'Greedy', 'Backtracking', 'Recursion', 'Searching', 'Sorting',
  'System Design', 'Behavioral', 'Mixed'
];

interface TopicChipGroupProps {
  selectedTopics: string[];
  onToggleTopic: (topic: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSelectMixed: () => void;
}

export const TopicChipGroup = ({
  selectedTopics,
  onToggleTopic,
  onSelectAll,
  onClearAll,
  onSelectMixed,
}: TopicChipGroupProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Interview Topics
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">
              {selectedTopics.length} selected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Choose the algorithmic domains to include in your question pool.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-2.5 py-1 rounded-lg bg-card border border-border/80 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
          >
            All
          </button>
          <button
            type="button"
            onClick={onSelectMixed}
            className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" /> Mixed
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
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
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
