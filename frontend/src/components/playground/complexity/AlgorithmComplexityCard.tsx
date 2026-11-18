import React from 'react';
import {
  ALGORITHM_COMPLEXITY_DATA,
  AlgorithmComplexityInfo,
  ComplexityId,
  COMPLEXITY_DEFINITIONS,
  formatOperations,
  formatFromLog10,
} from '../../../lib/complexityMath';
import { Cpu, ArrowRight, Sparkles, Check } from 'lucide-react';

interface AlgorithmComplexityCardProps {
  selectedAlgoId: string;
  onSelectAlgo: (algo: AlgorithmComplexityInfo) => void;
  nVal: number;
  onHighlightCurve: (id: ComplexityId) => void;
}

export const AlgorithmComplexityCard: React.FC<AlgorithmComplexityCardProps> = React.memo(({
  selectedAlgoId,
  onSelectAlgo,
  nVal,
  onHighlightCurve,
}) => {
  const currentAlgo =
    ALGORITHM_COMPLEXITY_DATA.find((a) => a.id === selectedAlgoId) ||
    ALGORITHM_COMPLEXITY_DATA[0];

  const primaryDef = COMPLEXITY_DEFINITIONS.find(
    (c) => c.id === currentAlgo.primaryComplexityId
  );

  // Compute dynamic operations estimate for best, average, worst
  const getDynamicOpsForNotation = (notation: string) => {
    const match = COMPLEXITY_DEFINITIONS.find((c) => c.notation === notation);
    if (!match) return '—';
    const logVal = match.log10Calc(nVal);
    if (logVal > 15) return formatFromLog10(logVal);
    return formatOperations(match.calc(nVal));
  };

  return (
    <div className="w-full bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6 text-foreground backdrop-blur-md">
      {/* HEADER & ALGORITHM SELECTOR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <h3 className="font-black text-base sm:text-lg text-foreground tracking-tight">
              Algorithm Complexity Inspector
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Select an algorithm to analyze its asymptotic bounds and map its behavior directly to the complexity graph.
          </p>
        </div>

        {/* ALGO DROPDOWN PICKER */}
        <div className="w-full md:w-auto">
          <select
            value={currentAlgo.id}
            onChange={(e) => {
              const found = ALGORITHM_COMPLEXITY_DATA.find((a) => a.id === e.target.value);
              if (found) {
                onSelectAlgo(found);
                onHighlightCurve(found.primaryComplexityId);
              }
            }}
            className="w-full md:w-64 bg-background/90 border border-border/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer shadow-sm"
          >
            {ALGORITHM_COMPLEXITY_DATA.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name} ({algo.average})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* QUICK CHIP CAROUSEL */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {ALGORITHM_COMPLEXITY_DATA.map((algo) => {
          const isSelected = algo.id === currentAlgo.id;
          return (
            <button
              key={algo.id}
              onClick={() => {
                onSelectAlgo(algo);
                onHighlightCurve(algo.primaryComplexityId);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm font-bold'
                  : 'bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/70'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              <span>{algo.name}</span>
              <span className="font-mono text-[10px] opacity-80">({algo.average})</span>
            </button>
          );
        })}
      </div>

      {/* SELECTED ALGORITHM DETAILED BREAKDOWN */}
      <div className="bg-background/60 border border-border/70 rounded-2xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {currentAlgo.category}
              </span>
              <h4 className="font-black text-lg text-foreground">{currentAlgo.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{currentAlgo.description}</p>
          </div>

          <button
            onClick={() => onHighlightCurve(currentAlgo.primaryComplexityId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border border-primary/20 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Highlight on Graph</span>
          </button>
        </div>

        {/* TIME & SPACE METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* BEST CASE */}
          <div className="bg-card/90 border border-border/70 rounded-xl p-3 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Best Case
            </span>
            <span className="font-mono font-black text-sm sm:text-base text-emerald-500 block">
              {currentAlgo.best}
            </span>
            <div className="text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
              ≈ {getDynamicOpsForNotation(currentAlgo.best)} ops
            </div>
          </div>

          {/* AVERAGE CASE (PRIMARY) */}
          <div
            className="bg-card/90 border-2 rounded-xl p-3 space-y-1 shadow-sm"
            style={{ borderColor: primaryDef?.color || 'hsl(var(--primary))' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                Average Case
              </span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryDef?.color }} />
            </div>
            <span className="font-mono font-black text-sm sm:text-base text-foreground block">
              {currentAlgo.average}
            </span>
            <div className="text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40 font-bold">
              ≈ {getDynamicOpsForNotation(currentAlgo.average)} ops
            </div>
          </div>

          {/* WORST CASE */}
          <div className="bg-card/90 border border-border/70 rounded-xl p-3 space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider block">
              Worst Case
            </span>
            <span className="font-mono font-black text-sm sm:text-base text-rose-500 block">
              {currentAlgo.worst}
            </span>
            <div className="text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
              ≈ {getDynamicOpsForNotation(currentAlgo.worst)} ops
            </div>
          </div>

          {/* SPACE COMPLEXITY */}
          <div className="bg-card/90 border border-border/70 rounded-xl p-3 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Space Complexity
            </span>
            <span className="font-mono font-black text-sm sm:text-base text-foreground block">
              {currentAlgo.space}
            </span>
            <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
              Auxiliary Memory
            </div>
          </div>
        </div>

        {/* ALGORITHMIC SUMMARY BANNER */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground/90 leading-relaxed">
          <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>{currentAlgo.summary}</span>
        </div>
      </div>
    </div>
  );
});

AlgorithmComplexityCard.displayName = 'AlgorithmComplexityCard';

