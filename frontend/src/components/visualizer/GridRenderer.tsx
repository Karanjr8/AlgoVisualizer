import { VisualElement } from '../../types/visualizer';
import { cn } from '../../lib/utils';
import { Ghost, CircleDot, X } from 'lucide-react'; // Icons for maze / N-queens

interface Props {
  grid: VisualElement[][];
}

export const GridRenderer = ({ grid }: Props) => {
  if (!grid || grid.length === 0) return null;
  
  const cols = grid[0].length;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className="grid gap-1 bg-border p-1 rounded-xl overflow-hidden shadow-sm"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {grid.map((row, rIdx) => 
          row.map((cell, cIdx) => {
            
            // Checkerboard for N-Queens
            const isDark = (rIdx + cIdx) % 2 === 1;
            
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={cn(
                  "relative w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-bold transition-all duration-300",
                  cell.state === 'normal' && (isDark ? "bg-muted" : "bg-card"),
                  cell.state === 'comparing' && "bg-primary/30 text-primary scale-105 z-10 rounded-md shadow-md",
                  cell.state === 'swapping' && "bg-destructive/30 text-destructive scale-105 z-10 rounded-md", // Backtracking
                  cell.state === 'found' && "bg-emerald-500/30 text-emerald-500 scale-105 z-10 rounded-md shadow-emerald-500/20 shadow-lg", // Success
                  cell.state === 'out-of-range' && "bg-slate-900 text-slate-500" // Maze Walls
                )}
              >
                {/* Special rendering logic based on value or string */}
                {cell.displayValue === 'Q' && <CircleDot className="w-8 h-8 text-primary drop-shadow-md" />}
                {cell.displayValue === 'x' && <X className="w-8 h-8 text-destructive opacity-50" />}
                {cell.displayValue === 'R' && <Ghost className="w-8 h-8 text-emerald-500 drop-shadow-md" />}
                {!['Q', 'x', 'R'].includes(cell.displayValue || '') && (cell.displayValue || (cell.value !== 0 && cell.value !== -999 ? cell.value : ''))}
                
                {/* Ping animation if active */}
                {(cell.state === 'comparing') && (
                  <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
