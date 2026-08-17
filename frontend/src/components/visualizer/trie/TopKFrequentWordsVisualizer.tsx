import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const TopKFrequentWordsVisualizer: React.FC<Props> = () => {
  const words = ['i', 'love', 'leetcode', 'i', 'love', 'coding'];
  const k = 2;

  const [topWords, setTopWords] = useState<string[]>([]);
  const [actionText, setActionText] = useState<string>('Top K Frequent Words: Count frequencies with Trie, rank with Min-Heap');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setTopWords([]);

    setActionText('Step 1: Inserting words into Trie & counting word frequencies...');
    await new Promise(r => setTimeout(r, 800));

    setActionText('Step 2: Pushing (freq, word) pairs into Min-Heap of size K = 2 with lexicographical tie-breaking...');
    await new Promise(r => setTimeout(r, 900));

    setTopWords(['i', 'love']);
    setActionText('Top K = 2 Frequent Words: ["i", "love"] (Both frequency 2, "i" comes before "love" lexicographically).');
    setIsRunning(false);
  };

  const handleReset = () => {
    setTopWords([]);
    setActionText('Ready to start Top K Frequent Words simulation');
    setIsRunning(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow"
          >
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Running...' : 'Animate Top K Words'}
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          Target Rank K: <strong className="text-amber-400">K = {k}</strong>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* INPUT WORDS VS TOP K RESULT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* INPUT WORDS */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Input Words Stream
          </span>

          <div className="flex flex-wrap gap-2 justify-center py-4">
            {words.map((w, idx) => (
              <span key={`tk-${idx}`} className="px-3 py-1.5 rounded-xl bg-background border border-border font-mono text-xs font-bold shadow-sm">
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* TOP K FREQUENT WORDS RESULT */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4 border-emerald-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 w-max">
            Top K = {k} Frequent Words Output
          </span>

          <div className="flex flex-wrap gap-3 justify-center py-4">
            {topWords.map((w, idx) => (
              <motion.div
                key={`tk-res-${w}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-20 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 font-mono font-bold text-sm flex items-center justify-center shadow"
              >
                #{idx + 1} {w}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
