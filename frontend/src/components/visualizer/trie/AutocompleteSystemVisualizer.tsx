import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const AutocompleteSystemVisualizer: React.FC<Props> = () => {
  const dataset = [
    { word: 'program', hits: 105 },
    { word: 'programming', hits: 230 },
    { word: 'programmer', hits: 88 },
    { word: 'progress', hits: 60 },
    { word: 'product', hits: 45 }
  ];

  const [query, setQuery] = useState<string>('prog');

  const suggestions = dataset
    .filter(item => item.word.startsWith(query.toLowerCase()))
    .sort((a, b) => b.hits - a.hits);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type query e.g. prog, pro..."
              className="pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary w-64"
            />
          </div>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          Real-Time Search Bar Autocomplete Engine
        </div>
      </div>

      {/* SEARCH ENGINE AUTCOMPLETE CARD */}
      <div className="bg-card/60 border border-border/80 rounded-3xl p-6 shadow-inner space-y-4 border-emerald-500/30">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-sans flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Live Trie Subtree Candidate Ranking for "{query}"
          </span>
          <span className="text-xs font-mono text-muted-foreground">{suggestions.length} Results</span>
        </div>

        <div className="space-y-2 py-2">
          <AnimatePresence>
            {suggestions.map((item, idx) => (
              <motion.div
                key={item.word}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-3.5 rounded-2xl bg-background border border-border flex justify-between items-center font-mono text-xs shadow-sm hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-sans text-[10px] font-bold flex items-center justify-center border border-emerald-500/20">
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    <strong className="text-emerald-400">{query}</strong>
                    {item.word.slice(query.length)}
                  </span>
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                  {item.hits} Search Hits
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {suggestions.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground italic">No search candidates matching prefix "{query}"</div>
          )}
        </div>
      </div>
    </div>
  );
};
