import React from 'react';
import {
  COMPLEXITY_DEFINITIONS,
  ComplexityId,
  formatOperations,
  formatFromLog10,
} from '../../../lib/complexityMath';
import { Table, CheckCircle2 } from 'lucide-react';

interface ComplexityComparisonTableProps {
  nVal: number;
  selectedComplexity?: ComplexityId | null;
  onSelectComplexity: (id: ComplexityId) => void;
  selectedCurves: ComplexityId[];
}

export const ComplexityComparisonTable: React.FC<ComplexityComparisonTableProps> = React.memo(({
  nVal,
  selectedComplexity,
  onSelectComplexity,
  selectedCurves,
}) => {
  return (
    <div className="w-full bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 text-foreground backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-primary" />
            <h3 className="font-black text-base sm:text-lg text-foreground tracking-tight">
              Complexity Comparison Matrix
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Estimated operations evaluated at <span className="font-mono font-bold text-foreground">n = {nVal.toLocaleString()}</span>. Click any row to focus its curve on the graph.
          </p>
        </div>

        <div className="text-xs font-mono font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border/60">
          Showing 8 Theoretical Orders
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full text-left text-xs sm:text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
              <th className="py-2.5 px-3.5">Complexity</th>
              <th className="py-2.5 px-3.5">Growth Type</th>
              <th className="py-2.5 px-3.5">Rating</th>
              <th className="py-2.5 px-3.5 text-right font-mono">Formula</th>
              <th className="py-2.5 px-4 text-right font-mono">Estimated Operations</th>
            </tr>
          </thead>
          <tbody>
            {COMPLEXITY_DEFINITIONS.map((c) => {
              const isSelected = selectedComplexity === c.id;
              const isCurveVisible = selectedCurves.includes(c.id);

              // Calculate operations using safe float or log10 for large numbers
              const logVal = c.log10Calc(nVal);
              const formattedOps = logVal > 15
                ? formatFromLog10(logVal)
                : formatOperations(c.calc(nVal));

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectComplexity(c.id)}
                  className={`group transition-all cursor-pointer rounded-2xl ${
                    isSelected
                      ? 'bg-card border-2 shadow-md ring-2 ring-primary/30'
                      : 'bg-background/60 hover:bg-muted/50 border border-border/60'
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 0 16px ${c.color}20` : undefined,
                  }}
                >
                  {/* COMPLEXITY NOTATION */}
                  <td className="py-3 px-3.5 rounded-l-2xl border-y border-l border-border/60">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-125"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="font-mono font-black text-sm sm:text-base text-foreground">
                        {c.notation}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 hidden sm:inline" />
                      )}
                      {!isCurveVisible && (
                        <span className="text-[10px] text-muted-foreground/60 italic hidden lg:inline">
                          (hidden on graph)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* GROWTH TYPE */}
                  <td className="py-3 px-3.5 border-y border-border/60 font-semibold text-foreground/90">
                    {c.growthType}
                  </td>

                  {/* EFFICIENCY TIER */}
                  <td className="py-3 px-3.5 border-y border-border/60">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${c.badgeBg} ${c.badgeText}`}
                    >
                      {c.tier}
                    </span>
                  </td>

                  {/* FORMULA */}
                  <td className="py-3 px-3.5 border-y border-border/60 text-right font-mono text-xs text-muted-foreground">
                    {c.formula}
                  </td>

                  {/* DYNAMIC OPERATIONS COUNT */}
                  <td className="py-3 px-4 rounded-r-2xl border-y border-r border-border/60 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-black text-sm sm:text-base text-foreground">
                        {formattedOps}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {nVal === 1 ? 'operation' : 'operations'}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

ComplexityComparisonTable.displayName = 'ComplexityComparisonTable';

