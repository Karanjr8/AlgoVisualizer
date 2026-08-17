import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Coins } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const GreedyCoinChangeVisualizer: React.FC<Props> = ({ frame }) => {
  const [targetMode, setTargetMode] = useState<'canonical' | 'failure'>('canonical');
  const [step, setStep] = useState<number>(0);

  // Canonical Case: [1, 2, 5, 10], Target = 18
  const canonicalCoins = [10, 5, 2, 1];
  const canonicalTarget = 18;

  // Failure Case: [4, 3, 1], Target = 6
  // Greedy picks 4, 1, 1 (3 coins) | Optimal DP picks 3, 3 (2 coins)
  const failureCoins = [4, 3, 1];
  const failureTarget = 6;

  const isCanonical = targetMode === 'canonical';
  const coins = isCanonical ? canonicalCoins : failureCoins;
  const target = isCanonical ? canonicalTarget : failureTarget;

  // Milestone steps simulation state
  const milestones = [
    { title: "Step 1: Observe Choices", desc: `Available Coins: [${coins.join(', ')}]. Target Amount = ${target}.` },
    { title: "Step 2: Pick Best Immediate Choice", desc: `Select largest coin ≤ remaining target.` },
    { title: "Step 3: Repeat Process", desc: "Deduct selected coin and repeat on remaining amount." },
    { title: "Step 4: Reach Final Answer", desc: "Target reduced to 0." },
    { title: "Step 5: Understand Why It Works / Fails", desc: isCanonical ? "Works! 10 + 5 + 2 + 1 = 18 (4 coins)." : "Fails! Greedy used 3 coins [4,1,1] but Optimal is 2 coins [3,3]!" }
  ];

  const handleNextStep = () => {
    setStep(prev => Math.min(prev + 1, milestones.length - 1));
  };

  const handleReset = () => {
    setStep(0);
  };

  // Compute Greedy choices for current mode
  const getGreedyChoices = () => {
    let rem = target;
    const picked: number[] = [];
    for (const c of coins) {
      while (rem >= c) {
        picked.push(c);
        rem -= c;
      }
    }
    return picked;
  };

  const greedyPicked = getGreedyChoices();

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls & Mode Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setTargetMode('canonical'); handleReset(); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isCanonical
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Coins [1, 2, 5, 10] (Greedy Works)
          </button>

          <button
            onClick={() => { setTargetMode('failure'); handleReset(); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !isCanonical
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Coins [1, 3, 4] (Greedy Fails Counterexample)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNextStep}
            disabled={step >= milestones.length - 1}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Next Step ({step + 1}/{milestones.length})
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* MILESTONE BANNER */}
      <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-4 shadow-inner">
        <div className={`p-3 rounded-xl border ${isCanonical ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
          <Coins className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">{milestones[step].title}</h3>
          <p className="text-xs text-muted-foreground">{milestones[step].desc}</p>
        </div>
      </div>

      {/* VISUAL DECISION MAKING BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: DENOMINATIONS & SELECTION PROCESS */}
        <div className="lg:col-span-7 bg-card/60 border border-border/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
              Greedy Decision Walkthrough (Target: {target})
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {coins.map((c) => {
                const isPicked = greedyPicked.includes(c) && step >= 1;
                return (
                  <div
                    key={`coin-denom-${c}`}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      isPicked
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold shadow-md scale-105'
                        : 'bg-background/50 border-border text-muted-foreground'
                    }`}
                  >
                    <span className="text-xs text-muted-foreground">Coin</span>
                    <span className="text-xl font-mono font-black">{c}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PICKED COINS TIMELINE */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Coins Picked Greedily:
            </span>
            <div className="flex flex-wrap gap-3 items-center min-h-[60px] p-3 rounded-2xl bg-background/60 border border-border/60">
              <AnimatePresence>
                {step >= 1 && greedyPicked.slice(0, step).map((c, idx) => (
                  <motion.div
                    key={`picked-${idx}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-12 h-12 rounded-full bg-amber-500 text-black font-mono font-black text-sm flex items-center justify-center shadow-lg border-2 border-amber-300"
                  >
                    {c}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT: COMPARISON SUMMARY (GREEDY VS OPTIMAL DP) */}
        <div className="lg:col-span-5 bg-card/60 border border-border/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 font-sans px-2.5 py-1 bg-blue-500/10 rounded-lg border border-blue-500/30 w-max">
            Local vs Global Optimum Analysis
          </span>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase">Greedy Strategy</span>
                <span className="text-xs font-mono font-bold">{greedyPicked.length} Coins</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {greedyPicked.join(' + ')} = {target}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${isCanonical ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase">Optimal Solution (DP)</span>
                <span className="text-xs font-mono font-bold">
                  {isCanonical ? '4 Coins' : '2 Coins (3 + 3)'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isCanonical
                  ? "Greedy choice matches optimal DP solution perfectly!"
                  : "Greedy chosen 4+1+1 = 3 coins, but DP finds 3+3 = 2 coins! Greedy fails when coin values lack the Greedy Choice Property."}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background/80 border border-border text-[11px] text-muted-foreground leading-relaxed">
            💡 <strong>Interview Insight:</strong> Greedy works for canonical systems (e.g. US coins [1, 5, 10, 25] or Euro coins), but fails for arbitrary coin systems where DP is required.
          </div>
        </div>

      </div>
    </div>
  );
};
