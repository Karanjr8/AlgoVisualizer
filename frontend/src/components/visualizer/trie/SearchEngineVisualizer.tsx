import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const SearchEngineVisualizer: React.FC<Props> = () => {
  const queries = [
    { text: 'algo visualizer', count: 1240 },
    { text: 'algorithm complexity', count: 850 },
    { text: 'algo structures', count: 620 },
    { text: 'binary tree', count: 910 }
  ];

  const [inputQuery, setInputQuery] = useState<string>('algo');

  const matches = queries.filter(q => q.text.startsWith(inputQuery.toLowerCase()));

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Search engine query prefix..."
              className="pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary w-64"
            />
          </div>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          Web Search Engine Query Trie Prefix Indexer
        </div>
      </div>

      {/* SEARCH ENGINE QUERY HITS */}
      <div className="bg-card/60 border border-border/80 rounded-3xl p-5 space-y-4 shadow-inner">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
          Matched Search Queries for Prefix "{inputQuery}"
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
          {matches.map(q => (
            <motion.div
              key={q.text}
              layout
              className="p-4 rounded-2xl bg-background border border-border flex justify-between items-center shadow-sm"
            >
              <span className="font-mono text-xs font-bold text-foreground">
                <strong className="text-amber-400">{inputQuery}</strong>
                {q.text.slice(inputQuery.length)}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {q.count} Hits
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
