import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const LongestCommonPrefixVisualizer: React.FC<Props> = () => {
  const words = ['flower', 'flow', 'flight'];
  const [lcp, setLcp] = useState<string>('');
  const [stepChar, setStepChar] = useState<string | null>(null);
  const [actionText, setActionText] = useState<string>('Longest Common Prefix: Traverse single-child unbranched path from Trie Root');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setLcp('');
    let currentPrefix = '';

    setActionText('Step 1: Inspecting Root node. All 3 words ["flower", "flow", "flight"] share character "f"');
    setStepChar('f');
    await new Promise(r => setTimeout(r, 900));
    currentPrefix += 'f';
    setLcp(currentPrefix);

    setActionText('Step 2: Inspecting node "f". All words share character "l" (single child branch)');
    setStepChar('l');
    await new Promise(r => setTimeout(r, 900));
    currentPrefix += 'l';
    setLcp(currentPrefix);

    setActionText('Step 3: Inspecting node "l". Branching occurs! Node "l" has children "o" (flower, flow) and "i" (flight).');
    setStepChar(null);
    await new Promise(r => setTimeout(r, 1000));

    setActionText(`Longest Common Prefix Search Complete! LCP is "${currentPrefix}".`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setLcp('');
    setStepChar(null);
    setActionText('Ready to demonstrate Longest Common Prefix');
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
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Searching...' : 'Animate LCP'}
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
          Result LCP: <strong className="text-emerald-400 text-sm">{lcp ? `"${lcp}"` : '""'}</strong>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* WORDS VS COMMON PREFIX PATH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* INPUT WORDS WITH CHARACTER HIGHLIGHT */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            Input Words List
          </span>

          <div className="space-y-3 py-2">
            {words.map(w => (
              <div key={w} className="flex gap-1.5 justify-center">
                {w.split('').map((char, i) => {
                  const isCommon = lcp.length > i && lcp[i] === char;
                  const isCurrentStep = stepChar === char && lcp.length === i;

                  return (
                    <motion.span
                      key={`${w}-${i}`}
                      animate={{ scale: isCurrentStep ? 1.2 : 1 }}
                      className={`w-9 h-11 rounded-xl font-mono font-bold text-sm flex items-center justify-center border-2 transition-all ${
                        isCommon ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-black' :
                        isCurrentStep ? 'bg-amber-500 border-amber-400 text-black shadow-lg' :
                        'bg-background border-border text-foreground'
                      }`}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* TRIE PATH UNBRANCHED CHARACTER STEP SUMMARY */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4 border-emerald-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 w-max">
            Trie Common Unbranched Path Result
          </span>

          <div className="flex items-center justify-center gap-3 py-6">
            <span className="px-4 py-2 rounded-xl bg-background border border-border font-mono text-xs text-muted-foreground font-bold">
              root
            </span>
            {lcp.split('').map((char, idx) => (
              <React.Fragment key={idx}>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 font-mono font-bold text-lg flex items-center justify-center shadow"
                >
                  {char}
                </motion.span>
              </React.Fragment>
            ))}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Traverse down the Trie from the root as long as every node has exactly 1 child and is not marked as endOfWord.
          </p>
        </div>

      </div>
    </div>
  );
};
