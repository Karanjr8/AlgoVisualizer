import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const ReplaceWordsVisualizer: React.FC<Props> = () => {
  const dictionaryRoots = ['cat', 'bat', 'rat'];
  const sentence = 'the cattle was rattled by the battery';

  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1);
  const [replacedWords, setReplacedWords] = useState<string[]>([]);
  const [actionText, setActionText] = useState<string>('Replace Words: Replace sentence words with shortest matching Trie root');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setReplacedWords([]);
    const words = sentence.split(' ');
    const res: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      setActiveWordIdx(i);

      let rootMatch = w;
      for (const r of dictionaryRoots) {
        if (w.startsWith(r)) {
          if (r.length < rootMatch.length) {
            rootMatch = r;
          }
        }
      }

      setActionText(`Word ${i + 1} ("${w}"): Searching shortest matching root in Trie...`);
      await new Promise(r => setTimeout(r, 700));

      if (rootMatch !== w) {
        setActionText(`Replaced "${w}" with root "${rootMatch}"!`);
      } else {
        setActionText(`No root match for "${w}". Kept original word.`);
      }

      res.push(rootMatch);
      setReplacedWords([...res]);
      await new Promise(r => setTimeout(r, 700));
    }

    setActionText(`Replace Words Complete! Output: "${res.join(' ')}"`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setActiveWordIdx(-1);
    setReplacedWords([]);
    setActionText('Ready to start Replace Words simulation');
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
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Replacing...' : 'Animate Replace Words'}
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
          Trie Roots: <strong className="text-amber-400">[{dictionaryRoots.join(', ')}]</strong>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* SENTENCE TRANSFORMATION DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* INPUT SENTENCE WORDS */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Original Input Sentence
          </span>

          <div className="flex flex-wrap gap-2 justify-center py-4">
            {sentence.split(' ').map((w, idx) => {
              const isCurrent = activeWordIdx === idx;
              const isProcessed = activeWordIdx > idx;

              return (
                <motion.div
                  key={`orig-${idx}`}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border-2 transition-all ${
                    isCurrent ? 'bg-amber-500 border-amber-400 text-black shadow-md' :
                    isProcessed ? 'bg-muted border-border text-muted-foreground opacity-50' :
                    'bg-background border-border text-foreground'
                  }`}
                >
                  {w}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* REPLACED OUTPUT SENTENCE */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4 border-emerald-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 w-max">
            Transformed Sentence Output
          </span>

          <div className="flex flex-wrap gap-2 justify-center py-4">
            {replacedWords.map((w, idx) => (
              <motion.span
                key={`repl-${idx}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-3 py-2 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 font-mono font-bold text-xs shadow-sm"
              >
                {w}
              </motion.span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
