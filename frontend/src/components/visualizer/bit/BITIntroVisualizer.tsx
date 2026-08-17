import React, { useState } from 'react';
import { Layers, RotateCcw, Info } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const BITIntroVisualizer: React.FC<Props> = () => {
  // 1-based indexing data
  const originalArray = [2, 5, 1, 4, 9, 3, 7, 8];
  const bitArray = [2, 7, 1, 12, 9, 12, 7, 39];

  const ranges: Record<number, { start: number; end: number; len: number; calc: string }> = {
    1: { start: 1, end: 1, len: 1, calc: 'A[1] = 2' },
    2: { start: 1, end: 2, len: 2, calc: 'A[1] + A[2] = 2 + 5 = 7' },
    3: { start: 3, end: 3, len: 1, calc: 'A[3] = 1' },
    4: { start: 1, end: 4, len: 4, calc: 'A[1..4] = 2 + 5 + 1 + 4 = 12' },
    5: { start: 5, end: 5, len: 1, calc: 'A[5] = 9' },
    6: { start: 5, end: 6, len: 2, calc: 'A[5..6] = 9 + 3 = 12' },
    7: { start: 7, end: 7, len: 1, calc: 'A[7] = 7' },
    8: { start: 1, end: 8, len: 8, calc: 'A[1..8] = 2+5+1+4+9+3+7+8 = 39' }
  };

  const [selectedIdx, setSelectedIdx] = useState<number>(4);

  const currentRange = ranges[selectedIdx];

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Header Info */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" /> BIT Range Responsibility Engine
          </h3>
          <p className="text-xs text-muted-foreground">Click any BIT node to inspect its exact binary range coverage in the original array.</p>
        </div>

        <button
          onClick={() => setSelectedIdx(4)}
          className="px-3.5 py-1.5 rounded-xl bg-background border border-border text-xs font-bold hover:bg-accent text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Select BIT[4]
        </button>
      </div>

      {/* Main Dual Array Canvas */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-6 space-y-8">
        
        {/* BIT Array Display (Top) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Binary Indexed Tree Array (BIT[1...8])
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">Click a cell to inspect responsibility range</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {bitArray.map((val, idxZero) => {
              const idx = idxZero + 1;
              const isSelected = idx === selectedIdx;
              const lowbitVal = idx & -idx;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 font-mono transition-all ${
                    isSelected
                      ? 'bg-violet-500/25 border-violet-400 text-violet-300 ring-2 ring-violet-400/50 shadow-lg shadow-violet-500/20 scale-105'
                      : 'bg-background/80 border-border hover:border-violet-500/40 text-foreground'
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground font-bold">BIT[{idx}]</span>
                  <span className="text-lg font-black">{val}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-bold border border-violet-500/20">
                    len={lowbitVal}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Range Connector Box */}
        <div className="p-4 rounded-2xl bg-background border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-violet-400 font-bold block text-sm">
              BIT[{selectedIdx}] (lowbit = {currentRange.len}) stores range A[{currentRange.start}...{currentRange.end}]
            </span>
            <span className="text-muted-foreground text-xs block">
              Calculation: {currentRange.calc}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 font-bold text-center">
            Range Length = {currentRange.len} Elements
          </div>
        </div>

        {/* Original Array Display (Bottom) */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Original Underlying Array A[1...8]
          </span>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {originalArray.map((val, idxZero) => {
              const idx = idxZero + 1;
              const isCovered = idx >= currentRange.start && idx <= currentRange.end;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 font-mono transition-all ${
                    isCovered
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20'
                      : 'bg-background/80 border-border text-muted-foreground opacity-50'
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground font-bold">A[{idx}]</span>
                  <span className="text-lg font-black">{val}</span>
                  {isCovered && <span className="text-[9px] font-bold text-emerald-400">Covered</span>}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Structure Insight</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">
            <strong className="text-violet-400">BIT[{selectedIdx}]</strong> is responsible for <strong className="text-emerald-400">{currentRange.len}</strong> array elements from index {currentRange.start} to {selectedIdx}. Notice how odd indices only cover themselves (len=1), while powers of 2 cover large cumulative prefixes!
          </p>
        </div>
      </div>

    </div>
  );
};
