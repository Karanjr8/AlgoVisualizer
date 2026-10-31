import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { VisualizationFrame } from '../../../types/visualizer';
import { cn } from '../../../lib/utils';
import { Database, Cpu, ArrowRight, Zap } from 'lucide-react';

interface Props {
  frame?: VisualizationFrame;
}

export const DPVisualizer: React.FC<Props> = ({ frame }) => {
  const [activeTab, setActiveTab] = useState<'memo' | 'tabulation'>('tabulation');
  const [n] = useState<number>(6);

  // Fibonacci DP demo table values: 0, 1, 1, 2, 3, 5, 8
  const fibTable = [0, 1, 1, 2, 3, 5, 8, 13];
  const explanation = frame?.event?.explanation || `Tabulation DP: Computing dp[i] = dp[i-1] + dp[i-2] step-by-step in O(N) time and O(N) space.`;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4">
      {/* TOP BAR & TAB SELECTOR */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-card border border-border rounded-2xl px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Cpu className="w-5 h-5" />
          </span>
          <div>
            <span className="text-xs font-black uppercase text-muted-foreground tracking-wider block">
              Dynamic Programming Engine
            </span>
            <span className="text-sm font-bold text-foreground">
              Overlapping Subproblems & State Transitions
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-secondary p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('tabulation')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all',
              activeTab === 'tabulation' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Tabulation (Bottom-Up)
          </button>
          <button
            onClick={() => setActiveTab('memo')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all',
              activeTab === 'memo' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Memoization (Top-Down)
          </button>
        </div>
      </div>

      {/* DP TABLE & SUBPROBLEM TRANSITION CARD */}
      <div className="w-full bg-card/80 backdrop-blur-md rounded-3xl border border-border p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
            <Database className="w-4 h-4" /> {activeTab === 'tabulation' ? '1D DP Tabulation Array dp[i]' : 'Memoization Cache Table'}
          </span>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            State Equation: dp[i] = dp[i-1] + dp[i-2]
          </span>
        </div>

        {/* DP Array Cells */}
        <div className="w-full flex items-center justify-center gap-3 overflow-x-auto py-6">
          {fibTable.slice(0, n + 1).map((val, idx) => (
            <div key={`dp-cell-${idx}`} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground font-bold">i = {idx}</span>
              <motion.div
                layout
                animate={{ scale: idx === n ? 1.1 : 1 }}
                className={cn(
                  'w-12 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-black text-lg border-2 shadow-sm transition-all',
                  idx === n ? 'bg-primary text-primary-foreground border-primary ring-4 ring-primary/30' :
                  idx >= n - 2 && idx < n ? 'bg-purple-500/20 text-purple-300 border-purple-500 font-bold' :
                  'bg-background border-border text-foreground'
                )}
              >
                <span className="text-xs font-normal text-muted-foreground font-mono">dp[{idx}]</span>
                <span>{val}</span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Subproblem Overlap / Transition Insight */}
        <div className="w-full bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
            <Zap className="w-4 h-4 fill-current" />
            <span>Why Dynamic Programming? (Eliminating Exponential Redundancy)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Without DP, naive recursion calculates <code>fib({n})</code> by expanding an exponential tree of size <code className="font-mono text-amber-400">O(2^N)</code>, computing <code>fib(2)</code> multiple redundant times.
            With DP, each state <code>dp[i]</code> is computed <strong>exactly once</strong> in <code className="font-mono text-emerald-400">O(1)</code> from precomputed dependencies <code>dp[i-1]</code> and <code>dp[i-2]</code>, reducing overall time to <code className="font-mono text-emerald-400">O(N)</code>.
          </p>
        </div>
      </div>

      {/* FOOTER EXPLANATION */}
      <div className="w-full bg-card rounded-2xl border border-border p-5 shadow-sm flex items-center gap-3">
        <ArrowRight className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm font-semibold text-foreground leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
};
