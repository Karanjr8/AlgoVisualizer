import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Search, AlertCircle, RefreshCw } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface TreeNode {
  id: string;
  l: number;
  r: number;
  val: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
}

interface Props {
  frame?: VisualizationFrame;
}

export const SegmentTreeIntroVisualizer: React.FC<Props> = () => {
  const [array, setArray] = useState<number[]>([2, 5, 1, 4, 9, 3]);
  const [queryL, setQueryL] = useState<number>(1);
  const [queryR, setQueryR] = useState<number>(4);
  const [updateIdx, setUpdateIdx] = useState<number>(3);
  const [updateVal, setUpdateVal] = useState<number>(10);
  
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);
  const [coveredNodeIds, setCoveredNodeIds] = useState<string[]>([]);
  const [ignoredNodeIds, setIgnoredNodeIds] = useState<string[]>([]);
  const [partialNodeIds, setPartialNodeIds] = useState<string[]>([]);
  
  const [actionText, setActionText] = useState<string>(
    'Segment Tree is ready. Select a range query [L, R] or update an array element.'
  );
  const [queryResult, setQueryResult] = useState<number | null>(null);

  // Build tree data structure dynamically from state array
  const buildTree = (l: number, r: number, id: string = '1'): TreeNode => {
    if (l === r) {
      return { id, l, r, val: array[l] };
    }
    const mid = Math.floor((l + r) / 2);
    const left = buildTree(l, mid, `${id}0`);
    const right = buildTree(mid + 1, r, `${id}1`);
    return {
      id,
      l,
      r,
      val: left.val + right.val,
      left,
      right
    };
  };

  const rootNode = buildTree(0, array.length - 1);

  // Flatten tree for rendering
  const flattenTree = (node: TreeNode, depth: number = 0, xOffset: number = 380, span: number = 320): TreeNode[] => {
    const y = 50 + depth * 75;
    const currentNode = { ...node, x: xOffset, y };

    let childrenNodes: TreeNode[] = [];
    if (node.left && node.right) {
      const childSpan = span / 2;
      const leftNodes = flattenTree(node.left, depth + 1, xOffset - childSpan, childSpan);
      const rightNodes = flattenTree(node.right, depth + 1, xOffset + childSpan, childSpan);
      childrenNodes = [...leftNodes, ...rightNodes];
    }

    return [currentNode, ...childrenNodes];
  };

  const nodesList = flattenTree(rootNode);

  // Collect edges for rendering SVG connection lines
  const getEdges = (node: TreeNode): Array<{ x1: number; y1: number; x2: number; y2: number; id: string }> => {
    const edges: Array<{ x1: number; y1: number; x2: number; y2: number; id: string }> = [];
    if (node.left && node.right && node.x !== undefined && node.y !== undefined) {
      const flattenedLeft = nodesList.find(n => n.id === node.left?.id);
      const flattenedRight = nodesList.find(n => n.id === node.right?.id);

      if (flattenedLeft && flattenedLeft.x !== undefined && flattenedLeft.y !== undefined) {
        edges.push({ x1: node.x, y1: node.y, x2: flattenedLeft.x, y2: flattenedLeft.y, id: `${node.id}->${node.left.id}` });
        edges.push(...getEdges(node.left));
      }

      if (flattenedRight && flattenedRight.x !== undefined && flattenedRight.y !== undefined) {
        edges.push({ x1: node.x, y1: node.y, x2: flattenedRight.x, y2: flattenedRight.y, id: `${node.id}->${node.right.id}` });
        edges.push(...getEdges(node.right));
      }
    }
    return edges;
  };

  const edgesList = getEdges(rootNode);

  // Execute Range Query sum(l, r) with animation steps
  const handleRangeQuery = async () => {
    if (queryL > queryR || queryL < 0 || queryR >= array.length) {
      setActionText('Invalid range! Please select 0 <= L <= R < N');
      return;
    }

    setActiveNodeIds([]);
    setCoveredNodeIds([]);
    setIgnoredNodeIds([]);
    setPartialNodeIds([]);
    setQueryResult(null);

    setActionText(`Initiating Range Sum Query for interval [${queryL}, ${queryR}]...`);

    const covered: string[] = [];
    const ignored: string[] = [];
    const partial: string[] = [];

    const traverse = async (curr: TreeNode): Promise<number> => {
      setActiveNodeIds(prev => [...prev, curr.id]);
      await new Promise(r => setTimeout(r, 400));

      if (curr.r < queryL || curr.l > queryR) {
        ignored.push(curr.id);
        setIgnoredNodeIds([...ignored]);
        setActionText(`Node [${curr.l}, ${curr.r}] is completely OUTSIDE range [${queryL}, ${queryR}]. Ignored (returns 0).`);
        await new Promise(r => setTimeout(r, 400));
        return 0;
      }

      if (queryL <= curr.l && curr.r <= queryR) {
        covered.push(curr.id);
        setCoveredNodeIds([...covered]);
        setActionText(`Node [${curr.l}, ${curr.r}] is FULLY COVERED by [${queryL}, ${queryR}]. Returns value ${curr.val}.`);
        await new Promise(r => setTimeout(r, 400));
        return curr.val;
      }

      partial.push(curr.id);
      setPartialNodeIds([...partial]);
      setActionText(`Node [${curr.l}, ${curr.r}] PARTIALLY overlaps [${queryL}, ${queryR}]. Splitting into left & right children...`);
      await new Promise(r => setTimeout(r, 400));

      let leftRes = 0;
      let rightRes = 0;
      if (curr.left) leftRes = await traverse(curr.left);
      if (curr.right) rightRes = await traverse(curr.right);

      return leftRes + rightRes;
    };

    const totalSum = await traverse(rootNode);
    setQueryResult(totalSum);
    setActionText(`Query complete! Sum for range [${queryL}, ${queryR}] = ${totalSum}. Visited ${covered.length + ignored.length + partial.length} total nodes.`);
  };

  // Execute Point Update: index idx -> new value
  const handlePointUpdate = async () => {
    if (updateIdx < 0 || updateIdx >= array.length) {
      setActionText('Invalid index! Please select 0 <= index < N');
      return;
    }

    const oldVal = array[updateIdx];
    const newArr = [...array];
    newArr[updateIdx] = updateVal;
    setArray(newArr);

    setActiveNodeIds([]);
    setCoveredNodeIds([]);
    setIgnoredNodeIds([]);
    setPartialNodeIds([]);
    setQueryResult(null);

    setActionText(`Updated array element at index ${updateIdx} from ${oldVal} to ${updateVal}. Propagating changes upward in Segment Tree...`);

    // Highlight path from leaf to root
    const pathIds: string[] = [];
    const findPath = (curr: TreeNode) => {
      pathIds.push(curr.id);
      if (curr.l === curr.r) return;
      const mid = Math.floor((curr.l + curr.r) / 2);
      if (updateIdx <= mid && curr.left) findPath(curr.left);
      else if (curr.right) findPath(curr.right);
    };

    findPath(rootNode);
    setActiveNodeIds(pathIds);
    setCoveredNodeIds(pathIds);

    await new Promise(r => setTimeout(r, 800));
    setActionText(`Point update complete! Leaf [${updateIdx}] set to ${updateVal}. Recomputed ${pathIds.length} ancestor nodes in O(log N) time.`);
  };

  const handleReset = () => {
    setArray([2, 5, 1, 4, 9, 3]);
    setQueryL(1);
    setQueryR(4);
    setUpdateIdx(3);
    setUpdateVal(10);
    setActiveNodeIds([]);
    setCoveredNodeIds([]);
    setIgnoredNodeIds([]);
    setPartialNodeIds([]);
    setQueryResult(null);
    setActionText('Reset to initial state: Array [2, 5, 1, 4, 9, 3].');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Top Controls Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> Segment Tree & Array Dual Engine
            </h3>
            <p className="text-xs text-muted-foreground">Interactive demo visualizing tree construction, range queries, and point updates.</p>
          </div>

          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-xl bg-background border border-border text-xs font-bold hover:bg-accent text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Range Query Control */}
          <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> Range Sum Query
              </span>
              {queryResult !== null && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono border border-emerald-500/30">
                  Sum = {queryResult}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">L:</span>
                <input
                  type="number"
                  min={0}
                  max={array.length - 1}
                  value={queryL}
                  onChange={e => setQueryL(Math.max(0, Math.min(array.length - 1, parseInt(e.target.value) || 0)))}
                  className="w-12 bg-card border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">R:</span>
                <input
                  type="number"
                  min={0}
                  max={array.length - 1}
                  value={queryR}
                  onChange={e => setQueryR(Math.max(0, Math.min(array.length - 1, parseInt(e.target.value) || 0)))}
                  className="w-12 bg-card border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                onClick={handleRangeQuery}
                className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Query Sum
              </button>
            </div>
          </div>

          {/* Point Update Control */}
          <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Point Update
            </span>

            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Idx:</span>
                <input
                  type="number"
                  min={0}
                  max={array.length - 1}
                  value={updateIdx}
                  onChange={e => setUpdateIdx(Math.max(0, Math.min(array.length - 1, parseInt(e.target.value) || 0)))}
                  className="w-12 bg-card border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Val:</span>
                <input
                  type="number"
                  value={updateVal}
                  onChange={e => setUpdateVal(parseInt(e.target.value) || 0)}
                  className="w-14 bg-card border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                onClick={handlePointUpdate}
                className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Update Index
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-4 sm:p-6 overflow-x-auto min-h-[440px] flex flex-col items-center justify-between relative">
        
        {/* Visual Legend */}
        <div className="w-full flex flex-wrap items-center justify-center gap-4 text-xs font-medium pb-2 border-b border-border/40">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-500" />
            <span className="text-muted-foreground">Default Node</span>
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

        {/* Tree SVG Visualization Canvas */}
        <div className="relative w-[760px] h-[320px] my-4">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edgesList.map(e => (
              <line
                key={e.id}
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                stroke="currentColor"
                strokeWidth="2"
                className="text-border/70"
              />
            ))}
          </svg>

          {/* Render Nodes */}
          {nodesList.map(n => {
            const isCovered = coveredNodeIds.includes(n.id);
            const isIgnored = ignoredNodeIds.includes(n.id);
            const isPartial = partialNodeIds.includes(n.id);
            const isActive = activeNodeIds.includes(n.id);

            let nodeStyle = 'bg-background/90 border-border text-foreground';
            if (isCovered) nodeStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/40';
            else if (isPartial) nodeStyle = 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/20 ring-2 ring-purple-500/40';
            else if (isIgnored) nodeStyle = 'bg-rose-500/10 border-rose-500/30 text-muted-foreground opacity-60';
            else if (isActive) nodeStyle = 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/40';

            return (
              <motion.div
                key={n.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ left: n.x! - 48, top: n.y! - 22 }}
                className={`absolute w-24 h-11 rounded-2xl border-2 backdrop-blur-md flex flex-col items-center justify-center font-mono transition-all z-10 ${nodeStyle}`}
              >
                <span className="text-[10px] font-bold text-muted-foreground tracking-tight">
                  [{n.l},{n.r}]
                </span>
                <span className="text-xs font-black">
                  Sum={n.val}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Underlying Array View */}
        <div className="w-full bg-background/80 border border-border/80 rounded-2xl p-4 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Original Underlying Array A[0...{array.length - 1}]
          </span>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {array.map((val, idx) => {
              const inQueryRange = idx >= queryL && idx <= queryR;
              const isUpdated = idx === updateIdx;

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono font-bold text-sm transition-all ${
                      inQueryRange
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/40'
                        : isUpdated
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-card border-border text-foreground'
                    }`}
                  >
                    {val}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">idx {idx}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Live Explanation Panel */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Explanation</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{actionText}</p>
        </div>
      </div>

    </div>
  );
};
