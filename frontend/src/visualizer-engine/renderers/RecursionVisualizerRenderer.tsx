import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecursionVisualizerState } from '../types/ds-states';
import { Layers, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  state: RecursionVisualizerState;
}

export const RecursionVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { callStack, maxDepth, currentResult, grid, activeRow, activeCol } = state;

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 py-4 select-none">
      {/* 1. Optional Grid Visualizer (For N-Queens / Maze / Sudoku) */}
      {grid && grid.length > 0 && (
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
            Chessboard ({grid.length}x{grid.length})
          </span>
          <div
            className="grid gap-1 p-2 bg-background/80 border-2 border-border/80 rounded-2xl shadow-xl"
            style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
          >
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isQueen = cell === 1;
                const isChecking = activeRow === rIdx && activeCol === cIdx;
                const isDarkSquare = (rIdx + cIdx) % 2 === 1;

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={cn(
                      'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl font-bold transition-all duration-150',
                      isQueen
                        ? 'bg-amber-500/30 border-2 border-amber-500 text-amber-300 shadow-md scale-105'
                        : isChecking
                        ? 'bg-rose-500/20 border-2 border-rose-500 text-rose-300 animate-pulse'
                        : isDarkSquare
                        ? 'bg-secondary/60 border border-border/40'
                        : 'bg-card border border-border/70'
                    )}
                  >
                    {isQueen ? '♛' : isChecking ? '•' : ''}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 2. System Function Call Stack */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md">
        <div className="flex items-center justify-between w-full px-2 text-xs font-mono font-bold text-muted-foreground">
          <div className="flex items-center gap-1.5 text-primary">
            <Layers className="w-4 h-4" />
            <span>CALL STACK (Depth: {callStack.length})</span>
          </div>
          {currentResult !== undefined && (
            <span className="text-emerald-400">Result: {currentResult}</span>
          )}
        </div>

        {/* Stack Container */}
        <div className="w-full flex flex-col-reverse gap-2 p-3 bg-background/60 border-2 border-border/80 rounded-2xl min-h-[220px] max-h-[380px] overflow-y-auto shadow-inner">
          <AnimatePresence>
            {callStack.map((frame, index) => {
              const isActive = index === callStack.length - 1;
              const hasReturned = frame.status === 'returned';

              return (
                <motion.div
                  key={frame.id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className={cn(
                    'w-full p-3 rounded-xl border flex flex-col gap-1 shadow-sm transition-colors',
                    hasReturned
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : isActive
                      ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary/40'
                      : 'bg-card border-border/80 text-foreground'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm tracking-wide">
                      {frame.functionName}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-background/50 border border-border">
                      Level {frame.depth}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1 border-t border-border/50">
                    <span>
                      Args: {Object.entries(frame.args).map(([k, v]) => `${k}=${v}`).join(', ')}
                    </span>
                    {frame.returnValue !== undefined && (
                      <span className="text-emerald-400 font-bold">
                        return {frame.returnValue}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {callStack.length === 0 && (
            <div className="h-full flex items-center justify-center text-xs font-mono text-muted-foreground/60 py-12">
              [ Call Stack Empty ]
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
