import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, Sparkles, Layers, ArrowDown, Zap } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface Props {
  frame?: VisualizationFrame;
}

export const SegmentTreeLazyVisualizer: React.FC<Props> = () => {
  const [updateL, setUpdateL] = useState<number>(2);
  const [updateR, setUpdateR] = useState<number>(4);
  const [updateVal, setUpdateVal] = useState<number>(5);

  const [treeState, setTreeState] = useState<Record<string, { val: number; lazyVal: number; hasLazy: boolean }>>({
    '1': { val: 24, lazyVal: 0, hasLazy: false },
    '10': { val: 8, lazyVal: 0, hasLazy: false },
    '11': { val: 16, lazyVal: 0, hasLazy: false },
    '100': { val: 7, lazyVal: 0, hasLazy: false },
    '101': { val: 1, lazyVal: 0, hasLazy: false },
    '110': { val: 13, lazyVal: 0, hasLazy: false },
    '111': { val: 3, lazyVal: 0, hasLazy: false },
    'L0': { val: 2, lazyVal: 0, hasLazy: false },
    'L1': { val: 5, lazyVal: 0, hasLazy: false },
    'L3': { val: 9, lazyVal: 0, hasLazy: false },
    'L4': { val: 4, lazyVal: 0, hasLazy: false }
  });

  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);
  const [pushDownNodeId, setPushDownNodeId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>(
    'Segment Tree & Lazy Array initialized. Select range [L, R] to test deferred lazy updates.'
  );

  const treeLayout: Array<{ id: string; nodeIndex: number; l: number; r: number; x: number; y: number }> = [
    { id: '1', nodeIndex: 1, l: 0, r: 5, x: 380, y: 50 },
    { id: '10', nodeIndex: 2, l: 0, r: 2, x: 220, y: 125 },
    { id: '11', nodeIndex: 3, l: 3, r: 5, x: 540, y: 125 },
    { id: '100', nodeIndex: 4, l: 0, r: 1, x: 140, y: 200 },
    { id: '101', nodeIndex: 5, l: 2, r: 2, x: 300, y: 200 },
    { id: '110', nodeIndex: 6, l: 3, r: 4, x: 460, y: 200 },
    { id: '111', nodeIndex: 7, l: 5, r: 5, x: 620, y: 200 },
    { id: 'L0', nodeIndex: 8, l: 0, r: 0, x: 100, y: 275 },
    { id: 'L1', nodeIndex: 9, l: 1, r: 1, x: 180, y: 275 },
    { id: 'L3', nodeIndex: 12, l: 3, r: 3, x: 420, y: 275 },
    { id: 'L4', nodeIndex: 13, l: 4, r: 4, x: 500, y: 275 }
  ];

  const edges = [
    { from: '1', to: '10' }, { from: '1', to: '11' },
    { from: '10', to: '100' }, { from: '10', to: '101' },
    { from: '11', to: '110' }, { from: '11', to: '111' },
    { from: '100', to: 'L0' }, { from: '100', to: 'L1' },
    { from: '110', to: 'L3' }, { from: '110', to: 'L4' }
  ];

  // Range Add Operation with Lazy Tagging animation
  const handleRangeAdd = async () => {
    setActiveNodeIds([]);
    setPushDownNodeId(null);

    setExplanation(`Initiating Range Add +${updateVal} to range [${updateL}, ${updateR}]...`);
    await new Promise(r => setTimeout(r, 400));

    const nextState = { ...treeState };
    const active: string[] = [];

    // Apply Range Add
    if (updateL <= 2 && 2 <= updateR) {
      // Leaf 101 [2] is fully covered by range
      active.push('101');
      nextState['101'] = {
        val: nextState['101'].val + updateVal,
        lazyVal: nextState['101'].lazyVal + updateVal,
        hasLazy: true
      };
    }

    if (updateL <= 3 && 4 <= updateR) {
      // Node 110 [3,4] is fully covered by range
      active.push('110');
      nextState['110'] = {
        val: nextState['110'].val + (4 - 3 + 1) * updateVal,
        lazyVal: nextState['110'].lazyVal + updateVal,
        hasLazy: true
      };
    }

    // Recompute parent sums upward
    nextState['10'] = { ...nextState['10'], val: nextState['100'].val + nextState['101'].val };
    nextState['11'] = { ...nextState['11'], val: nextState['110'].val + nextState['111'].val };
    nextState['1'] = { ...nextState['1'], val: nextState['10'].val + nextState['11'].val };

    setTreeState(nextState);
    setActiveNodeIds(active);

    setExplanation(
      `Range Add Complete! Nodes covering range [${updateL}, ${updateR}] updated directly & tagged with Lazy +${updateVal}. Lower child nodes (e.g. leaves [3] & [4]) were UNTOUCHED and deferred!`
    );
  };

  // PushDown Lazy Value Trigger
  const handlePushDown = async (nodeId: string) => {
    const nodeState = treeState[nodeId];
    if (!nodeState.hasLazy) {
      setExplanation(`Node ${nodeId} has no pending lazy tag.`);
      return;
    }

    setPushDownNodeId(nodeId);
    setExplanation(`Pushing down lazy tag (+${nodeState.lazyVal}) from parent node ${nodeId} down to its left and right children...`);
    await new Promise(r => setTimeout(r, 600));

    const nextState = { ...treeState };
    const valToPush = nodeState.lazyVal;

    // Clear parent lazy
    nextState[nodeId] = { ...nextState[nodeId], lazyVal: 0, hasLazy: false };

    // Delegate to children if node 110 [3,4]
    if (nodeId === '110') {
      nextState['L3'] = { val: nextState['L3'].val + valToPush, lazyVal: nextState['L3'].lazyVal + valToPush, hasLazy: true };
      nextState['L4'] = { val: nextState['L4'].val + valToPush, lazyVal: nextState['L4'].lazyVal + valToPush, hasLazy: true };
    }

    setTreeState(nextState);
    setPushDownNodeId(null);
    setExplanation(`PushDown Complete! Lazy tag transferred from node ${nodeId} down to child leaves. Parent lazy tag cleared.`);
  };

  const handleReset = () => {
    setTreeState({
      '1': { val: 24, lazyVal: 0, hasLazy: false },
      '10': { val: 8, lazyVal: 0, hasLazy: false },
      '11': { val: 16, lazyVal: 0, hasLazy: false },
      '100': { val: 7, lazyVal: 0, hasLazy: false },
      '101': { val: 1, lazyVal: 0, hasLazy: false },
      '110': { val: 13, lazyVal: 0, hasLazy: false },
      '111': { val: 3, lazyVal: 0, hasLazy: false },
      'L0': { val: 2, lazyVal: 0, hasLazy: false },
      'L1': { val: 5, lazyVal: 0, hasLazy: false },
      'L3': { val: 9, lazyVal: 0, hasLazy: false },
      'L4': { val: 4, lazyVal: 0, hasLazy: false }
    });
    setUpdateL(2);
    setUpdateR(4);
    setUpdateVal(5);
    setActiveNodeIds([]);
    setPushDownNodeId(null);
    setExplanation('Reset lazy state to initial values.');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Control Header */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-foreground">Lazy Propagation Engine</h3>
          </div>

          {/* Inputs */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-bold">L:</span>
              <input
                type="number"
                min={0}
                max={5}
                value={updateL}
                onChange={e => setUpdateL(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
                className="w-12 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-bold">R:</span>
              <input
                type="number"
                min={0}
                max={5}
                value={updateR}
                onChange={e => setUpdateR(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
                className="w-12 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-bold">Add:</span>
              <input
                type="number"
                value={updateVal}
                onChange={e => setUpdateVal(parseInt(e.target.value) || 0)}
                className="w-14 bg-background border border-border rounded-lg px-2 py-1 text-center font-bold text-foreground focus:outline-none"
              />
            </div>

            <button
              onClick={handleRangeAdd}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> Execute Lazy Range Add
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual Display Canvas */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Segment Tree Display */}
        <div className="lg:col-span-8 bg-card rounded-3xl border border-border shadow-2xl p-4 sm:p-6 overflow-x-auto min-h-[380px] flex flex-col items-center justify-between relative">
          <div className="w-full flex items-center justify-between border-b border-border/40 pb-2 text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Layers className="w-4 h-4 text-amber-400" /> Primary Segment Tree
            </span>
            <span className="text-[10px] text-amber-400 font-mono">Orange badges indicate pending Lazy tags</span>
          </div>

          <div className="relative w-[700px] h-[290px] my-3">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {edges.map(e => {
                const fromNode = treeLayout.find(n => n.id === e.from)!;
                const toNode = treeLayout.find(n => n.id === e.to)!;
                const isPushing = pushDownNodeId === e.from;

                return (
                  <line
                    key={`${e.from}->${e.to}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="currentColor"
                    strokeWidth={isPushing ? "3" : "1.5"}
                    className={isPushing ? "text-amber-400 animate-pulse" : "text-border/60"}
                  />
                );
              })}
            </svg>

            {treeLayout.map(n => {
              const state = treeState[n.id];
              const isActive = activeNodeIds.includes(n.id);
              const isLazy = state?.hasLazy;
              const isPushing = pushDownNodeId === n.id;

              let style = 'bg-background/90 border-border text-foreground';
              if (isPushing) style = 'bg-amber-500/40 border-amber-400 text-amber-200 ring-4 ring-amber-400/60 shadow-xl scale-105';
              else if (isLazy) style = 'bg-amber-500/25 border-amber-500 text-amber-300 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20';
              else if (isActive) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40';

              return (
                <motion.div
                  key={n.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ left: n.x - 44, top: n.y - 20 }}
                  className={`absolute w-22 h-10 rounded-2xl border-2 backdrop-blur-md flex flex-col items-center justify-center font-mono transition-all z-10 ${style}`}
                >
                  <span className="text-[9px] font-bold text-muted-foreground">[{n.l},{n.r}]</span>
                  <span className="text-xs font-black">Sum={state?.val ?? 0}</span>

                  {isLazy && (
                    <button
                      onClick={() => handlePushDown(n.id)}
                      title="Click to trigger PushDown"
                      className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black border border-amber-300 shadow-md hover:scale-110 transition-all flex items-center gap-0.5"
                    >
                      Lazy: +{state.lazyVal}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Secondary Lazy Array Display */}
        <div className="lg:col-span-4 bg-card rounded-3xl border border-border shadow-2xl p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="border-b border-border/40 pb-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> Secondary Lazy Array
            </h4>
            <p className="text-xs text-muted-foreground">Stores deferred update values corresponding to tree nodes.</p>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {treeLayout.map(n => {
              const state = treeState[n.id];
              const isLazy = state?.hasLazy;

              return (
                <div
                  key={n.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between font-mono text-xs transition-all ${
                    isLazy
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                      : 'bg-background/80 border-border/80 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">Node [{n.l},{n.r}]</span>
                    <span className="text-[10px] text-muted-foreground">(idx {n.nodeIndex})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`font-black ${isLazy ? 'text-amber-400' : 'text-muted-foreground'}`}>
                      lazy = {state?.lazyVal ?? 0}
                    </span>

                    {isLazy && (
                      <button
                        onClick={() => handlePushDown(n.id)}
                        className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-bold hover:brightness-110 transition-all flex items-center gap-1"
                      >
                        <ArrowDown className="w-3 h-3" /> PushDown
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-background border border-border/80 text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-bold text-amber-400 block mb-0.5">Why Lazy Deferral Works:</span>
            Subtree updates are stored in the <code className="text-foreground font-mono">lazy[]</code> array and only pushed down when a query or new update needs to visit child nodes.
          </div>
        </div>

      </div>

      {/* Live Explanation Panel */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Lazy Propagation Explanation</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{explanation}</p>
        </div>
      </div>

    </div>
  );
};
