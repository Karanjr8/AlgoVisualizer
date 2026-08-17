import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const SearchSuggestionsVisualizer: React.FC<Props> = () => {
  const products = ['mobile', 'mouse', 'monitor', 'moneypot', 'monitorpad'];
  const [typedPrefix, setTypedPrefix] = useState<string>('mo');

  const getSuggestions = (prefix: string) => {
    if (!prefix) return [];
    const p = prefix.toLowerCase();
    return products
      .filter(w => w.toLowerCase().startsWith(p))
      .sort()
      .slice(0, 3);
  };

  const suggestions = getSuggestions(typedPrefix);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={typedPrefix}
              onChange={e => setTypedPrefix(e.target.value)}
              placeholder="Type prefix e.g. mo, mou..."
              className="pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary w-56"
            />
          </div>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          Real-time Trie Subtree Prefix Matcher (Top 3 Suggestions)
        </div>
      </div>

      {/* PRODUCTS CATALOG VS LIVE AUTOCOMPLETE SUGGESTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* PRODUCT CATALOG */}
        <div className="lg:col-span-5 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Products Catalog
          </span>

          <div className="flex flex-wrap gap-2 justify-center py-2">
            {products.map(prod => {
              const isMatched = typedPrefix && prod.startsWith(typedPrefix);

              return (
                <div
                  key={prod}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border-2 transition-all ${
                    isMatched ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-background border-border text-muted-foreground opacity-50'
                  }`}
                >
                  {prod}
                </div>
              );
            })}
          </div>
        </div>

        {/* DYNAMIC SEARCH SUGGESTIONS DROP-DOWN CONTAINER */}
        <div className="lg:col-span-7 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Dynamic Trie Suggestions for "{typedPrefix}"
            </span>
            <span className="text-xs font-mono text-muted-foreground">{suggestions.length} Matches</span>
          </div>

          <div className="space-y-2 py-2">
            <AnimatePresence>
              {suggestions.map((s, idx) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-2xl bg-background border border-emerald-500/40 flex justify-between items-center font-mono text-xs font-bold shadow-sm"
                >
                  <span className="text-foreground">
                    <strong className="text-emerald-400">{typedPrefix}</strong>
                    {s.slice(typedPrefix.length)}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-sans bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                    Rank #{idx + 1}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {suggestions.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground italic">No products matching prefix "{typedPrefix}"</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
