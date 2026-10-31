import React from 'react';
import { DPVisualizerState } from '../types/ds-states';
import { cn } from '../../lib/utils';

interface Props {
  state: DPVisualizerState;
}

export const DPVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { title, dimensions, rowLabels, colLabels, cells, activeCell, dependencyCells, optimalValue } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5 py-4 select-none">
      {/* Table Header Pill */}
      <div className="flex items-center gap-3 text-xs font-mono">
        <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
          {title} ({dimensions})
        </span>
        {optimalValue !== undefined && (
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
            Optimal: {optimalValue}
          </span>
        )}
      </div>

      {/* DP Grid */}
      <div className="overflow-x-auto max-w-full p-2 bg-background/50 border border-border/80 rounded-2xl shadow-xl">
        <table className="border-collapse font-mono text-xs">
          <thead>
            <tr>
              <th className="p-2.5 border-b border-r border-border/60 text-muted-foreground text-[10px] uppercase font-bold">
                i \ j
              </th>
              {colLabels.map((col, cIdx) => (
                <th
                  key={cIdx}
                  className="p-2.5 border-b border-border/60 text-center font-bold text-foreground text-xs min-w-[54px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, rIdx) => (
              <tr key={rIdx}>
                {/* Row Header */}
                <td className="p-2.5 border-r border-b border-border/60 text-left font-bold text-muted-foreground text-xs whitespace-nowrap bg-secondary/30">
                  {rowLabels[rIdx] || `R${rIdx}`}
                </td>

                {/* Cells */}
                {row.map((cell, cIdx) => {
                  const isActive = activeCell?.row === rIdx && activeCell?.col === cIdx;
                  const isDep = dependencyCells?.some((d) => d.row === rIdx && d.col === cIdx);
                  const isOptimal = cell.state === 'optimal';

                  let cellClass = 'bg-card/50 text-foreground border-border/50';
                  if (isActive) {
                    cellClass = 'bg-primary/30 border-primary text-primary font-black ring-2 ring-primary/50 scale-105';
                  } else if (isDep) {
                    cellClass = 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/40';
                  } else if (isOptimal) {
                    cellClass = 'bg-emerald-500/25 border-emerald-500 text-emerald-300 font-black ring-2 ring-emerald-500/50';
                  } else if (cell.state === 'computed') {
                    cellClass = 'bg-background/80 text-foreground border-border/70';
                  } else if (cell.state === 'uncomputed') {
                    cellClass = 'bg-muted/10 text-muted-foreground/30 border-border/30';
                  }

                  return (
                    <td
                      key={cIdx}
                      className={cn(
                        'w-14 h-12 text-center border p-2 text-sm font-bold transition-all duration-200',
                        cellClass
                      )}
                    >
                      {cell.value !== null && cell.value !== undefined ? cell.value : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
