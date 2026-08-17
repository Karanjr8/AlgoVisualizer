import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Search, Calculator } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  defaultMode?: 'sum' | 'min' | 'max';
  frame?: VisualizationFrame;
}

interface NodeState {
  id: string;
  l: number;
  r: number;
  sumVal: number;
  minVal: number;
  maxVal: number;
  x: number;
  y: number;
}

export const SegmentTreeQueryVisualizer: React.FC<Props> = ({ defaultMode = 'sum' }) => {
  const [opMode, setOpMode] = useState<'sum' | 'min' | 'max'>(defaultMode);
  const [queryL, setQueryL] = useState<number>(1);
  const [queryR, setQueryR] = useState<number>(4);

  const array = [2, 5, 1, 4, 9, 3];

  const nodesList: NodeState[] = [
    { id: '1', l: 0, r: 5, sumVal: 24, minVal: 1, maxVal: 9, x: 380, y: 50 },
    { id: '10', l: 0, r: 2, sumVal: 8, minVal: 1, maxVal: 5, x: 220, y: 125 },
    { id: '11', l: 3, r: 5, sumVal: 16, minVal: 3, maxVal: 9, x: 540, y: 125 },
    { id: '100', l: 0, r: 1, sumVal: 7, minVal: 2, maxVal: 5, x: 140, y: 200 },
    { id: '101', l: 2, r: 2, sumVal: 1, minVal: 1, maxVal: 1, x: 300, y: 200 },
    { id: '110', l: 3, r: 4, sumVal: 13, minVal: 4, maxVal: 9, x: 460, y: 200 },
    { id: '111', l: 5, r: 5, sumVal: 3, minVal: 3, maxVal: 3, x: 620, y: 200 },
    { id: 'L0', l: 0, r: 0, sumVal: 2, minVal: 2, maxVal: 2, x: 100, y: 275 },
    { id: 'L1', l: 1, r: 1, sumVal: 5, minVal: 5, maxVal: 5, x: 180, y: 275 },
    { id: 'L3', l: 3, r: 3, sumVal: 9, minVal: 9, maxVal: 9, x: 420, y: 275 },
    { id: 'L4', l: 4, r: 4, sumVal: 4, minVal: 4, maxVal: 4, x: 500, y: 275 }
  ];

  const edges = [
    { from: '1', to: '10' }, { from: '1', to: '11' },
    { from: '10', to: '100' }, { from: '10', to: '101' },
    { from: '11', to: '110' }, { from: '11', to: '111' },
    { from: '100', to: 'L0' }, { from: '100', to: 'L1' },
    { from: '110', to: 'L3' }, { from: '110', to: 'L4' }
  ];

  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [coveredIds, setCoveredIds] = useState<string[]>([]);
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [partialIds, setPartialIds] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>('Select query range [L, R] and operation mode to visualize traversal.');
  const [runningAccumulator, setRunningAccumulator] = useState<string>('');
  const [resultVal, setResultVal] = useState<number | null>(null);

  const getNodeVal = (n: NodeState) => {
    if (opMode === 'sum') return n.sumVal;
    if (opMode === 'min') return n.minVal;
    return n.maxVal;
  };

  const handleExecuteQuery = async () => {
    setVisitedIds([]);
    setCoveredIds([]);
    setIgnoredIds([]);
    setPartialIds([]);
    setResultVal(null);

    const covered: string[] = [];
    const ignored: string[] = [];
    const partial: string[] = [];
    const visited: string[] = [];

    const accumSteps: string[] = [];

    const evaluate = async (id: string): Promise<number> => {
      const node = nodesList.find(n => n.id === id)!;
      visited.push(id);
      setVisitedIds([...visited]);

      await new Promise(r => setTimeout(r, 450));

      // Case 1: Disjoint
      if (node.r < queryL || node.l > queryR) {
        ignored.push(id);
        setIgnoredIds([...ignored]);
        const identity = opMode === 'sum' ? '0' : opMode === 'min' ? '+∞' : '-∞';
        setExplanation(`Node [${node.l}, ${node.r}] is completely OUTSIDE query range [${queryL}, ${queryR}]. Disjoint -> returns identity (${identity}).`);
        await new Promise(r => setTimeout(r, 400));
        return opMode === 'sum' ? 0 : opMode === 'min' ? Infinity : -Infinity;
      }

      // Case 2: Fully Covered
      if (queryL <= node.l && node.r <= queryR) {
        covered.push(id);
        setCoveredIds([...covered]);
        const val = getNodeVal(node);
        accumSteps.push(`[${node.l},${node.r}]: ${val}`);
        setRunningAccumulator(accumSteps.join('  +  '));
        setExplanation(`Node [${node.l}, ${node.r}] is FULLY COVERED by [${queryL}, ${queryR}]. Returns precomputed value ${val} instantly.`);
        await new Promise(r => setTimeout(r, 400));
        return val;
      }

      // Case 3: Partial Overlap
      partial.push(id);
      setPartialIds([...partial]);
      setExplanation(`Node [${node.l}, ${node.r}] PARTIALLY overlaps [${queryL}, ${queryR}]. Recursively delegating to left & right subtrees...`);
      await new Promise(r => setTimeout(r, 400));

      const childEdges = edges.filter(e => e.from === id);
      let leftRes = opMode === 'sum' ? 0 : opMode === 'min' ? Infinity : -Infinity;
      let rightRes = opMode === 'sum' ? 0 : opMode === 'min' ? Infinity : -Infinity;

      if (childEdges.length > 0) leftRes = await evaluate(childEdges[0].to);
      if (childEdges.length > 1) rightRes = await evaluate(childEdges[1].to);

      let finalRes = 0;
      if (opMode === 'sum') finalRes = (leftRes === Infinity ? 0 : leftRes) + (rightRes === Infinity ? 0 : rightRes);
      else if (opMode === 'min') finalRes = Math.min(leftRes, rightRes);
      else finalRes = Math.max(leftRes, rightRes);

      return finalRes;
    };

    const finalVal = await evaluate('1');
    setResultVal(finalVal);
    const modeName = opMode.toUpperCase();
    setExplanation(`Query Complete! Range ${modeName} for [${queryL}, ${queryR}] = ${finalVal}. Visited ONLY ${visited.length} of ${nodesList.length} total nodes (${Math.round((visited.length / nodesList.length) * 100)}% of tree) — proving O(log N) efficiency!`);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Query Bar */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border">
            <button
              onClick={() => setOpMode('sum')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                opMode === 'sum' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Range Sum
            </button>
            <button
              onClick={() => setOpMode('min')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                opMode === 'min' ? 'bg-blue-500 text-black shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Range Min
            </button>
            <button
              onClick={() => setOpMode('max')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                opMode === 'max' ? 'bg-purple-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Range Max
            </button>
          </div>

          {/* Range Inputs */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-bold">L:</span>
              <input
                type="number"
                min={0}
                max={5}
                value={queryL}
                onChange={e => setQueryL(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
                className="w-12 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-bold">R:</span>
              <input
                type="number"
                min={0}
                max={5}
                value={queryR}
                onChange={e => setQueryR(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
                className="w-12 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
              />
            </div>

            <button
              onClick={handleExecuteQuery}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Execute Traversal
            </button>
          </div>
        </div>

        {/* Live Accumulator & Result */}
        {resultVal !== null && (
          <div className="p-3 rounded-xl bg-background/90 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Covered Subtrees Contributed:</span>
              <span className="text-emerald-300 font-bold">{runningAccumulator}</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-sm border border-emerald-500/40">
              Result = {resultVal}
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-4 sm:p-6 overflow-x-auto min-h-[420px] flex flex-col items-center justify-between relative">
        
        {/* Legend */}
        <div className="w-full flex flex-wrap items-center justify-center gap-5 text-xs font-medium pb-2 border-b border-border/40">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
            <span className="text-amber-400 font-bold">Traversing / Visited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-emerald-400 font-bold">Fully Covered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
            <span className="text-purple-400 font-bold">Partially Overlapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/40 border border-rose-500/50" />
            <span className="text-rose-400 font-bold">Ignored / Out of Range</span>
          </div>
        </div>

        {/* Tree SVG */}
        <div className="relative w-[760px] h-[300px] my-3">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map(e => {
              const fromNode = nodesList.find(n => n.id === e.from)!;
              const toNode = nodesList.find(n => n.id === e.to)!;
              const isVisited = visitedIds.includes(toNode.id);

              return (
                <line
                  key={`${e.from}->${e.to}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="currentColor"
                  strokeWidth={isVisited ? "2.5" : "1.5"}
                  className={isVisited ? "text-amber-400" : "text-border/60"}
                />
              );
            })}
          </svg>

          {nodesList.map(n => {
            const isCovered = coveredIds.includes(n.id);
            const isIgnored = ignoredIds.includes(n.id);
            const isPartial = partialIds.includes(n.id);
            const isVisited = visitedIds.includes(n.id);

            let style = 'bg-background/90 border-border text-foreground';
            if (isCovered) style = 'bg-emerald-500/25 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20';
            else if (isPartial) style = 'bg-purple-500/25 border-purple-500 text-purple-300 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20';
            else if (isIgnored) style = 'bg-rose-500/10 border-rose-500/30 text-muted-foreground opacity-50';
            else if (isVisited) style = 'bg-amber-500/25 border-amber-500 text-amber-300 ring-2 ring-amber-500/40';

            const valDisplay = getNodeVal(n);

            return (
              <motion.div
                key={n.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ left: n.x - 46, top: n.y - 20 }}
                className={`absolute w-23 h-10 rounded-2xl border-2 backdrop-blur-md flex flex-col items-center justify-center font-mono transition-all z-10 ${style}`}
              >
                <span className="text-[9px] font-bold text-muted-foreground">[{n.l},{n.r}]</span>
                <span className="text-xs font-black">
                  {opMode.toUpperCase()}={valDisplay}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Array Indicator */}
        <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-border/40 font-mono text-xs">
          <span className="text-muted-foreground">Array:</span>
          {array.map((v, i) => (
            <span
              key={i}
              className={`px-2.5 py-1 rounded-lg border font-bold ${
                i >= queryL && i <= queryR ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-background border-border text-muted-foreground'
              }`}
            >
              A[{i}]={v}
            </span>
          ))}
        </div>

      </div>

      {/* Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
          <Search className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Traversal Explanation</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>

    </div>
  );
};
