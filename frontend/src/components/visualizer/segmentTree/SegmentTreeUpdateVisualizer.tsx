import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, RefreshCw, ArrowUp } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const SegmentTreeUpdateVisualizer: React.FC<Props> = () => {
  const [array, setArray] = useState<number[]>([2, 5, 1, 4, 9, 3]);
  const [updateIdx, setUpdateIdx] = useState<number>(3);
  const [updateVal, setUpdateVal] = useState<number>(10);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [pathNodeIds, setPathNodeIds] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>('Select an array index and a new value to visualize upward point update propagation.');

  // Pre-calculate tree values based on current array state
  const L0 = array[0];
  const L1 = array[1];
  const L2 = array[2];
  const L3 = array[3];
  const L4 = array[4];
  const L5 = array[5];

  const node100 = L0 + L1;
  const node101 = L2;
  const node110 = L3 + L4;
  const node111 = L5;

  const node10 = node100 + node101;
  const node11 = node110 + node111;
  const rootVal = node10 + node11;

  const nodes = [
    { id: '1', l: 0, r: 5, val: rootVal, x: 380, y: 50 },
    { id: '10', l: 0, r: 2, val: node10, x: 220, y: 125 },
    { id: '11', l: 3, r: 5, val: node11, x: 540, y: 125 },
    { id: '100', l: 0, r: 1, val: node100, x: 140, y: 200 },
    { id: '101', l: 2, r: 2, val: node101, x: 300, y: 200 },
    { id: '110', l: 3, r: 4, val: node110, x: 460, y: 200 },
    { id: '111', l: 5, r: 5, val: node111, x: 620, y: 200 },
    { id: 'L0', l: 0, r: 0, val: L0, x: 100, y: 275 },
    { id: 'L1', l: 1, r: 1, val: L1, x: 180, y: 275 },
    { id: 'L3', l: 3, r: 3, val: L3, x: 420, y: 275 },
    { id: 'L4', l: 4, r: 4, val: L4, x: 500, y: 275 }
  ];

  const edges = [
    { from: '1', to: '10' }, { from: '1', to: '11' },
    { from: '10', to: '100' }, { from: '10', to: '101' },
    { from: '11', to: '110' }, { from: '11', to: '111' },
    { from: '100', to: 'L0' }, { from: '100', to: 'L1' },
    { from: '110', to: 'L3' }, { from: '110', to: 'L4' }
  ];

  const getTargetLeafId = (idx: number) => {
    if (idx === 0) return 'L0';
    if (idx === 1) return 'L1';
    if (idx === 2) return '101';
    if (idx === 3) return 'L3';
    if (idx === 4) return 'L4';
    return '111';
  };

  const getUpwardPath = (leafId: string) => {
    if (leafId === 'L0' || leafId === 'L1') return ['L0', '100', '10', '1'];
    if (leafId === '101') return ['101', '10', '1'];
    if (leafId === 'L3' || leafId === 'L4') return ['L3', '110', '11', '1'];
    return ['111', '11', '1'];
  };

  const handlePointUpdate = async () => {
    const leafId = getTargetLeafId(updateIdx);
    const path = getUpwardPath(leafId);
    setPathNodeIds(path);

    // Step 1: Traverse Down
    setActiveStep(1);
    setExplanation(`Step 1: Traversing down from root to target leaf node for index ${updateIdx}...`);
    await new Promise(r => setTimeout(r, 600));

    // Step 2: Change Leaf Value
    setActiveStep(2);
    const newArr = [...array];
    newArr[updateIdx] = updateVal;
    setArray(newArr);
    setExplanation(`Step 2: Replaced leaf value at index ${updateIdx} with new value ${updateVal}.`);
    await new Promise(r => setTimeout(r, 600));

    // Step 3: Upward Recomputation
    setActiveStep(3);
    setExplanation(`Step 3: Recomputing ancestor node sums upward from leaf [${updateIdx}] to Root [0,5]...`);
    await new Promise(r => setTimeout(r, 800));

    setActiveStep(4);
    setExplanation(`Point Update complete! Updated 1 leaf and ${path.length - 1} ancestor nodes in O(log N) total time.`);
  };

  const handleReset = () => {
    setArray([2, 5, 1, 4, 9, 3]);
    setUpdateIdx(3);
    setUpdateVal(10);
    setActiveStep(0);
    setPathNodeIds([]);
    setExplanation('Reset to initial state.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Control Panel */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-sans">
            <RefreshCw className="w-4 h-4" /> Point Update Control
          </span>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-muted-foreground font-bold">Index:</span>
            <input
              type="number"
              min={0}
              max={5}
              value={updateIdx}
              onChange={e => setUpdateIdx(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
              className="w-12 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-bold">New Val:</span>
            <input
              type="number"
              value={updateVal}
              onChange={e => setUpdateVal(parseInt(e.target.value) || 0)}
              className="w-14 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePointUpdate}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Execute Point Update
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-4 sm:p-6 overflow-x-auto min-h-[400px] flex flex-col items-center justify-between relative">
        <div className="relative w-[760px] h-[300px]">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map(e => {
              const fromNode = nodes.find(n => n.id === e.from)!;
              const toNode = nodes.find(n => n.id === e.to)!;
              const isPath = pathNodeIds.includes(fromNode.id) && pathNodeIds.includes(toNode.id);

              return (
                <line
                  key={`${e.from}->${e.to}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="currentColor"
                  strokeWidth={isPath ? "3.5" : "1.5"}
                  className={isPath ? "text-amber-400" : "text-border/60"}
                />
              );
            })}
          </svg>

          {nodes.map(n => {
            const isPath = pathNodeIds.includes(n.id);
            const isLeaf = n.l === updateIdx && n.r === updateIdx;

            let style = 'bg-background/90 border-border text-foreground';
            if (isLeaf && activeStep >= 2) {
              style = 'bg-cyan-500/25 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20';
            } else if (isPath && activeStep >= 3) {
              style = 'bg-amber-500/25 border-amber-500 text-amber-300 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20';
            } else if (isPath && activeStep === 1) {
              style = 'bg-amber-500/10 border-amber-500/40 text-amber-400';
            }

            return (
              <motion.div
                key={n.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ left: n.x - 46, top: n.y - 20 }}
                className={`absolute w-23 h-10 rounded-2xl border-2 backdrop-blur-md flex flex-col items-center justify-center font-mono transition-all z-10 ${style}`}
              >
                <span className="text-[9px] font-bold text-muted-foreground">[{n.l},{n.r}]</span>
                <span className="text-xs font-black">Sum={n.val}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Array */}
        <div className="w-full flex items-center justify-center gap-2 pt-3 border-t border-border/40 font-mono text-xs">
          <span className="text-muted-foreground font-bold">Array:</span>
          {array.map((v, i) => (
            <div
              key={i}
              className={`px-3 py-1 rounded-xl border flex flex-col items-center font-bold ${
                i === updateIdx ? 'bg-amber-500/20 border-amber-500 text-amber-400 ring-1 ring-amber-500/40' : 'bg-background border-border text-foreground'
              }`}
            >
              <span className="text-[9px] text-muted-foreground">[{i}]</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
          <ArrowUp className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Upward Propagation Explanation</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>

    </div>
  );
};
