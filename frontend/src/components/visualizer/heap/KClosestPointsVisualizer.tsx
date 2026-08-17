import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Point {
  x: number;
  y: number;
  id: string;
}

interface Props {
  frame?: VisualizationFrame;
}

export const KClosestPointsVisualizer: React.FC<Props> = () => {
  const points: Point[] = [
    { x: 1, y: 3, id: 'P1' },
    { x: -2, y: 2, id: 'P2' },
    { x: 5, y: 8, id: 'P3' },
    { x: 3, y: 3, id: 'P4' },
    { x: -1, y: -1, id: 'P5' }
  ];
  const k = 2;

  const [stepIdx, setStepIdx] = useState<number>(-1);
  const [heap, setHeap] = useState<{ point: Point; distSq: number }[]>([]);
  const [actionText, setActionText] = useState<string>(`Find K = ${k} closest 2D points to Origin (0,0) using Euclidean Distance x² + y²`);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const getDistSq = (p: Point) => p.x * p.x + p.y * p.y;

  const runSimulation = async () => {
    setIsRunning(true);
    let currentHeap: { point: Point; distSq: number }[] = [];

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const distSq = getDistSq(pt);
      setStepIdx(i);

      currentHeap.push({ point: pt, distSq });
      // Max Heap by distance squared
      currentHeap.sort((a, b) => b.distSq - a.distSq);
      setHeap([...currentHeap]);

      setActionText(`Processing point ${pt.id}(${pt.x}, ${pt.y}) → Dist² = ${pt.x}² + ${pt.y}² = ${distSq}. Inserted into Max-Heap.`);
      await new Promise(r => setTimeout(r, 900));

      if (currentHeap.length > k) {
        const popped = currentHeap.shift()!;
        setHeap([...currentHeap]);
        setActionText(`Heap size > K (${k}). Evicted furthest point ${popped.point.id}(${popped.point.x},${popped.point.y}) with Dist² = ${popped.distSq}!`);
        await new Promise(r => setTimeout(r, 900));
      }
    }

    const finalPoints = currentHeap.map(item => `${item.point.id}(${item.point.x},${item.point.y})`).join(', ');
    setActionText(`Complete! The K = ${k} closest points to Origin (0,0) are [${finalPoints}]`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setStepIdx(-1);
    setHeap([]);
    setActionText('Ready to start K Closest Points simulation');
    setIsRunning(false);
  };

  // Convert (x, y) coordinates to SVG canvas space (centered at 150, 150)
  const mapToCanvas = (x: number, y: number) => {
    const scale = 16;
    const cx = 150 + x * scale;
    const cy = 150 - y * scale; // Invert Y for Cartesian plane
    return { cx, cy };
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow"
          >
            <Play className="w-4 h-4 fill-current" /> {isRunning ? 'Running...' : 'Animate 2D Points'}
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-muted-foreground">Origin: <strong className="text-emerald-400">(0, 0)</strong></span>
          <span className="text-muted-foreground">K Points: <strong className="text-amber-400">K = {k}</strong></span>
        </div>
      </div>

      {/* Action Text Banner */}
      <div className="p-3 rounded-xl bg-background/90 border border-border/80 font-mono text-xs text-amber-400 font-semibold shadow-inner text-center">
        {actionText}
      </div>

      {/* 2D COORDINATE PLANE VS MAX-HEAP CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 2D CARTESIAN COORDINATE PLANE CANVAS */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-4 flex flex-col items-center justify-center relative shadow-inner min-h-[320px]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans px-2 py-1 bg-background/60 rounded-lg w-max border border-border/60 absolute top-4 left-4 z-10">
            2D Cartesian Plane (Origin 0,0)
          </span>

          <div className="relative w-[300px] h-[300px] bg-background/80 rounded-2xl border border-border/80 overflow-hidden flex items-center justify-center">
            {/* Axis Lines */}
            <div className="absolute w-full h-[1px] bg-border/80 top-1/2" />
            <div className="absolute h-full w-[1px] bg-border/80 left-1/2" />

            <svg className="absolute inset-0 w-full h-full">
              {points.map((pt, i) => {
                const { cx, cy } = mapToCanvas(pt.x, pt.y);
                const isInHeap = heap.some(h => h.point.id === pt.id);
                const isCurrent = stepIdx === i;

                return (
                  <g key={`pt-svg-${pt.id}`}>
                    <line
                      x1={150}
                      y1={150}
                      x2={cx}
                      y2={cy}
                      stroke={isCurrent ? '#f59e0b' : isInHeap ? '#10b981' : '#3f3f46'}
                      strokeWidth={isCurrent ? 2 : 1}
                      strokeDasharray={isInHeap ? 'none' : '3'}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isCurrent ? 8 : 6}
                      fill={isCurrent ? '#f59e0b' : isInHeap ? '#10b981' : '#6b7280'}
                    />
                    <text
                      x={cx + 8}
                      y={cy - 8}
                      fill="#e4e4e7"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {pt.id}({pt.x},{pt.y})
                    </text>
                  </g>
                );
              })}
              {/* Origin Marker */}
              <circle cx={150} cy={150} r={4} fill="#10b981" />
            </svg>
          </div>
        </div>

        {/* MAX-HEAP OF SIZE K (DISTANCES) */}
        <div className="lg:col-span-6 bg-card/60 border border-border/80 rounded-3xl p-5 flex flex-col justify-between shadow-inner space-y-4 border-amber-500/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
            Max-Heap of Size K = {k} (Keyed by Distance²)
          </span>

          <div className="flex flex-wrap gap-3 justify-center py-4">
            <AnimatePresence>
              {heap.map((item, idx) => (
                <motion.div
                  key={`kp-heap-${item.point.id}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center font-mono shadow-md ${
                    idx === 0 ? 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold' : 'bg-background border-border text-foreground'
                  }`}
                >
                  <span className="text-sm font-bold text-emerald-400">{item.point.id}</span>
                  <span className="text-xs font-mono">({item.point.x}, {item.point.y})</span>
                  <span className="text-[9px] text-muted-foreground mt-1">Dist² = {item.distSq}</span>
                  <span className="text-[8px] font-sans text-muted-foreground/60">{idx === 0 ? 'Root (Furthest)' : ''}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-xs font-mono text-muted-foreground flex justify-between">
            <span>Complexity: <strong className="text-emerald-400">O(N log K)</strong></span>
            <span>Space: <strong className="text-primary">O(K)</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
