import { motion } from 'framer-motion';
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
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            3. Interview Focus Topics
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Select one or multiple domain topics for your session.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs sm:text-sm font-bold hover:border-primary/40 transition-colors"
          >
            All
          </button>
          <button
            onClick={onSelectMixed}
            className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-bold hover:bg-primary/20 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Mixed
          </button>
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs sm:text-sm font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Selectable Chips Grid */}
      <div className="flex flex-wrap gap-2.5">
        {ALL_TOPICS.map((topic) => {
          const isSelected = selectedTopics.includes(topic);

          return (
            <motion.button
              key={topic}
              onClick={() => onToggleTopic(topic)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-2 border cursor-pointer outline-none shadow-xs',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs ring-1 ring-primary/30'
                  : 'bg-secondary/40 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card'
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              <span>{topic}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
