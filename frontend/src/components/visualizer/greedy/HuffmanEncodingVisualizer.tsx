import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const HuffmanEncodingVisualizer: React.FC<Props> = ({ frame }) => {
  const nodes = frame?.greedyState?.huffmanNodes || [
    { id: 'AB', label: 'A+B', freq: 14 },
    { id: 'E', label: 'E', freq: 16 },
    { id: 'CD', label: 'C+D', freq: 25 },
    { id: 'F', label: 'F', freq: 45 },
  ];

  const codes = frame?.greedyState?.huffmanCodes || {
    'F': '0',
    'C': '100',
    'D': '101',
    'A': '1100',
    'B': '1101',
    'E': '111'
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            Huffman Tree Construction
          </span>
          <span className="text-muted-foreground">Criterion: Min-Heap Merge Lowest Frequencies</span>
        </div>

        <div className="text-xs font-mono text-emerald-400 font-bold">
          Lossless Prefix-Free Binary Encoding
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: MIN HEAP CURRENT FREQUENCIES */}
        <div className="lg:col-span-7 bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
            Min-Heap Active Frequency Nodes
          </span>

          <div className="flex flex-wrap gap-3 py-4 justify-start">
            <AnimatePresence>
              {nodes.map((node) => (
                <motion.div
                  key={`huff-node-${node.id}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`w-20 h-24 rounded-2xl border flex flex-col items-center justify-center font-mono shadow-sm transition-all ${
                    node.isMerged
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold shadow-md scale-105'
                      : 'bg-background/60 border-border text-foreground'
                  }`}
                >
                  <span className="text-xs text-muted-foreground">{node.label}</span>
                  <span className="text-xl font-black">{node.freq}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: GENERATED BINARY CODES TABLE */}
        <div className="lg:col-span-5 bg-card/60 border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 w-max">
            Generated Huffman Prefix Codes
          </span>

          <div className="space-y-2 pt-1 font-mono text-xs">
            {Object.entries(codes).map(([char, code]) => (
              <div
                key={`code-${char}`}
                className="p-2.5 rounded-xl bg-background/60 border border-border/60 flex items-center justify-between"
              >
                <span className="font-bold text-foreground">Char '{char}'</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black">
                  {code}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-muted-foreground leading-relaxed">
            Higher frequency characters receive shorter binary codes, maximizing total data compression!
          </div>
        </div>

      </div>
    </div>
  );
};
