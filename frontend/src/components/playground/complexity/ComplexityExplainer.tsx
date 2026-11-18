import React from 'react';
import {
  COMPLEXITY_DEFINITIONS,
  ComplexityId,
  formatOperations,
  formatFromLog10,
} from '../../../lib/complexityMath';
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Cpu,
} from 'lucide-react';

interface ComplexityExplainerProps {
  complexityId: ComplexityId;
  nVal: number;
}

export const ComplexityExplainer: React.FC<ComplexityExplainerProps> = React.memo(({
  complexityId,
  nVal,
}) => {
  const currentDef =
    COMPLEXITY_DEFINITIONS.find((c) => c.id === complexityId) ||
    COMPLEXITY_DEFINITIONS[2]; // Default to O(n)

  // Calculate current operations
  const logVal = currentDef.log10Calc(nVal);
  const currentOpsFormatted =
    logVal > 15 ? formatFromLog10(logVal) : formatOperations(currentDef.calc(nVal));

  // Compute operations if N doubles (2 * nVal)
  const doubleN = nVal * 2;
  const doubleLogVal = currentDef.log10Calc(doubleN);
  const doubleOpsFormatted =
    doubleLogVal > 15 ? formatFromLog10(doubleLogVal) : formatOperations(currentDef.calc(doubleN));

  // Growth factor explanation
  const getGrowthMultiplierText = () => {
    switch (currentDef.id) {
      case 'o_1':
        return 'remains strictly unchanged (1x operations)';
      case 'o_log_n':
        return 'increases by only +1 additional operation';
      case 'o_n':
        return 'exactly doubles (2x operations)';
      case 'o_n_log_n':
        return 'slightly more than doubles (~2.1x - 2.3x operations)';
      case 'o_n_2':
        return 'quadruples (4x operations: 2² = 4)';
      case 'o_n_3':
        return 'increases by 8x (2³ = 8)';
      case 'o_2_n':
        return `squares the operation count! Operations multiply by 2^n (astronomical explosion)`;
      case 'o_n_fact':
        return 'grows uncontrollably beyond astronomical cosmic bounds';
      default:
        return 'scales upward';
    }
  };

  return (
    <div className="w-full bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6 text-foreground backdrop-blur-md">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-black text-base sm:text-lg text-foreground tracking-tight">
              Learning Lab: Understanding {currentDef.notation} ({currentDef.name})
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Asymptotic growth deep dive, beginner-friendly intuition, and real-world considerations.
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${currentDef.badgeBg} ${currentDef.badgeText}`}
        >
          {currentDef.tier} Performance
        </span>
      </div>

      {/* THREE-COLUMN INTUITION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WHAT IT MEANS */}
        <div className="bg-background/60 border border-border/70 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" /> What It Means
          </div>
          <h4 className="font-black text-sm text-foreground">{currentDef.description}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{currentDef.intuition}</p>
        </div>

        {/* HOW OPERATIONS GROW (THE DOUBLING EXPERIMENT) */}
        <div className="bg-background/60 border border-border/70 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> The Doubling Test
          </div>
          <h4 className="font-black text-sm text-foreground">
            What happens when N doubles?
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            At <strong>n = {nVal.toLocaleString()}</strong>, work is <strong>{currentOpsFormatted}</strong> ops.
            If N doubles to <strong>n = {doubleN.toLocaleString()}</strong>, work becomes <strong>{doubleOpsFormatted}</strong> ops — which {getGrowthMultiplierText()}.
          </p>
        </div>

        {/* TYPICAL ALGORITHMS & EXAMPLES */}
        <div className="bg-background/60 border border-border/70 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-500 font-bold text-xs uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> Real-World Examples
          </div>
          <h4 className="font-black text-sm text-foreground">Common In:</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            {currentDef.examples.map((ex, i) => (
              <li key={i} className="truncate">
                {ex}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* THEORETICAL ASYMPTOTIC VS MEASURED HARDWARE NOTE */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground/90 leading-relaxed">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-foreground block">
            Important Note: Asymptotic Growth vs. Measured Wall-Clock Time
          </span>
          <p className="text-muted-foreground text-[11px] sm:text-xs">
            Big-O notation describes the <em>theoretical mathematical upper bound</em> of an algorithm as $n \to \infty$. The operation numbers above are illustrative theoretical estimates ($c = 1$). In real-world software, actual execution time depends on CPU branch prediction, hardware cache hits/misses, memory alignment, and low-level compiler optimizations. A well-optimized $O(n^2)$ algorithm can outperform an unoptimized $O(n \log n)$ algorithm on small inputs due to low constant factors!
          </p>
        </div>
      </div>
    </div>
  );
});

ComplexityExplainer.displayName = 'ComplexityExplainer';

