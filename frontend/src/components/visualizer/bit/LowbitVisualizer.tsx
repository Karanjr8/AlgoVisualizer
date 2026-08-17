import React, { useState } from 'react';
import { Cpu, RotateCcw, Sparkles } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const LowbitVisualizer: React.FC<Props> = () => {
  const [xVal, setXVal] = useState<number>(6);

  const safeX = Math.max(1, Math.min(255, xVal));
  const notX = (~safeX) & 255;
  const negX = (-safeX) & 255;
  const lowbitRes = safeX & -safeX;

  const toBinStr = (num: number): string => {
    return (num & 255).toString(2).padStart(8, '0');
  };

  const binX = toBinStr(safeX);
  const binNotX = toBinStr(notX);
  const binNegX = toBinStr(negX);
  const binLowbit = toBinStr(lowbitRes);

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Input Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-5 h-5 text-violet-400" /> Lowbit Bitwise Math Engine (x & -x)
          </h3>
          <p className="text-xs text-muted-foreground">Type any integer X (1 to 255) to visualize two's complement LSB isolation in binary.</p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-bold">X =</span>
            <input
              type="number"
              min={1}
              max={255}
              value={xVal}
              onChange={e => setXVal(parseInt(e.target.value) || 1)}
              className="w-16 bg-background border border-border rounded-xl px-3 py-1.5 text-center font-bold text-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>

          <button
            onClick={() => setXVal(6)}
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bitwise Step-by-Step Canvas */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Step 1 & 2: Binary X & ~X */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-background border border-border space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Step 1: Original X = {safeX}</span>
                <span className="text-violet-400 font-bold">Binary (8-bit)</span>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-1">
                {binX.split('').map((bit, idx) => (
                  <span
                    key={idx}
                    className={`w-7 h-8 rounded-lg border flex items-center justify-center font-black ${
                      bit === '1' ? 'bg-violet-500/25 border-violet-400 text-violet-300' : 'bg-card border-border text-muted-foreground'
                    }`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-border space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Step 2: Bitwise NOT ~X</span>
                <span className="text-amber-400 font-bold">Invert All Bits</span>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-1">
                {binNotX.split('').map((bit, idx) => (
                  <span
                    key={idx}
                    className={`w-7 h-8 rounded-lg border flex items-center justify-center font-black ${
                      bit === '1' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-card border-border text-muted-foreground'
                    }`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 & 4: Two's Complement -X & Bitwise AND */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-background border border-border space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Step 3: Two's Complement -X = ~X + 1</span>
                <span className="text-pink-400 font-bold">Add 1</span>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-1">
                {binNegX.split('').map((bit, idx) => (
                  <span
                    key={idx}
                    className={`w-7 h-8 rounded-lg border flex items-center justify-center font-black ${
                      bit === '1' ? 'bg-pink-500/20 border-pink-400 text-pink-300' : 'bg-card border-border text-muted-foreground'
                    }`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-emerald-500/40 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold">Step 4: Bitwise AND (X & -X)</span>
                <span className="text-emerald-400 font-black">Isolated LSB</span>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-1">
                {binLowbit.split('').map((bit, idx) => (
                  <span
                    key={idx}
                    className={`w-7 h-8 rounded-lg border flex items-center justify-center font-black ${
                      bit === '1' ? 'bg-emerald-500 text-black border-emerald-400 ring-2 ring-emerald-400/50 scale-110 shadow-lg shadow-emerald-500/30' : 'bg-card border-border text-muted-foreground'
                    }`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Final Result Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-card to-card border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-violet-300 font-bold text-sm block">
              lowbit({safeX}) = {safeX} & -{safeX} = {lowbitRes}
            </span>
            <span className="text-muted-foreground text-xs block">
              BIT[{safeX}] is responsible for a range of length {lowbitRes} in the array!
            </span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-sm">
            Isolated LSB = {lowbitRes}
          </div>
        </div>

      </div>

      {/* Live Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-mono">Why Bitwise AND Works</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">
            Inverting bits (<code className="text-amber-400">~X</code>) turns all bits opposite. Adding 1 (<code className="text-pink-400">-X</code>) flips trailing 1s back to 0s and restores the single lowest 1-bit. Performing <code className="text-emerald-400">X & -X</code> cancels out all higher bits, leaving only the lowest set bit!
          </p>
        </div>
      </div>

    </div>
  );
};
