import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const WordSearchIIVisualizer: React.FC<Props> = () => {
  const board = [
    ['o', 'a', 'a', 'n'],
    ['e', 't', 'a', 'e'],
    ['i', 'h', 'k', 'r'],
    ['i', 'f', 'l', 'v']
  ];
  const targetWords = ['oath', 'pea', 'eat', 'rain'];

  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [actionText, setActionText] = useState<string>('Word Search II: 2D Matrix Board + Trie DFS Pruning');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setFoundWords([]);

    // 1. Search for "oath"
    setActionText('Searching for "oath" starting at cell (0,0) ["o"]...');
    setActiveCell([0, 0]);
    await new Promise(r => setTimeout(r, 600));
    setActiveCell([1, 0]); // 'e' -> mismatch, backtrack
    await new Promise(r => setTimeout(r, 600));
    setActiveCell([0, 1]); // 'a' -> matches 'oath'
    await new Promise(r => setTimeout(r, 600));
    setActiveCell([1, 1]); // 't' -> matches 'oath'
    await new Promise(r => setTimeout(r, 600));
    setActiveCell([2, 1]); // 'h' -> matches 'oath'
    await new Promise(r => setTimeout(r, 800));

    setFoundWords(prev => [...prev, 'oath']);
    setActionText('Found word "oath" in 2D Board! Marked endOfWord node in Trie as pruned.');
    await new Promise(r => setTimeout(r, 800));

    // 2. Search for "eat"
    setActionText('Searching for "eat" starting at cell (1,0) ["e"]...');
    setActiveCell([1, 0]);
    await new Promise(r => setTimeout(r, 600));
    setActiveCell([1, 1]); // 't' -> mismatch
    await new Promise(r => setTimeout(r, 600));
    setActiveCell([0, 0]); // 'o' -> mismatch
    await new Promise(r => setTimeout(r, 600));

    // 3. Search for "pea" -> Pruned immediately!
    setActionText('Searching for "pea" → Cell character "p" NOT in Trie root! Pruned entire DFS branch in O(1) time!');
    setActiveCell(null);
    await new Promise(r => setTimeout(r, 1000));

    setFoundWords(['oath', 'eat']);
    setActionText('Word Search II Simulation Complete! Found 2 words: ["oath", "eat"].');
    setIsRunning(false);
  };

  const handleReset = () => {
    setActiveCell(null);
    setFoundWords([]);
    setActionText('Ready to start Word Search II simulation');
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
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Searching Board...' : 'Animate Board DFS + Trie'}
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
          Target Words: <strong className="text-amber-400">[{targetWords.join(', ')}]</strong>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* 2D MATRIX BOARD VS FOUND WORDS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 2D CHARACTER GRID BOARD */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col items-center justify-center space-y-4 shadow-inner">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60">
            4x4 Character Board Grid
          </span>

          <div className="grid grid-cols-4 gap-2">
            {board.map((row, r) =>
              row.map((char, c) => {
                const isActive = activeCell && activeCell[0] === r && activeCell[1] === c;

                return (
                  <motion.div
                    key={`cell-${r}-${c}`}
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    className={`w-12 h-12 rounded-xl font-mono text-lg font-bold flex items-center justify-center border-2 transition-all shadow ${
                      isActive ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/30' : 'bg-background border-border text-foreground'
                    }`}
                  >
                    {char}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* FOUND WORDS SUMMARY & TRIE PRUNING BENEFITS */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4 border-emerald-500/30">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              Found Words in Board
            </span>
            <div className="flex flex-wrap gap-2 py-2">
              {foundWords.map(w => (
                <span key={w} className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-mono font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {w}
                </span>
              ))}
              {foundWords.length === 0 && <span className="text-xs text-muted-foreground italic">None yet...</span>}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-background/80 border border-border/60 text-xs font-mono text-muted-foreground space-y-1">
            <span className="text-[10px] uppercase text-amber-400 font-bold font-sans block">Why Trie Pruning is Powerful</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Without a Trie, DFS must search every board cell for every dictionary word ($O(W \cdot M \cdot N \cdot 4^L)$). With a Trie, invalid prefixes are pruned immediately ($O(M \cdot N \cdot 3^L)$)!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
