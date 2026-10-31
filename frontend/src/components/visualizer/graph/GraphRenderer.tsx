import React from 'react';
import { motion } from 'framer-motion';
import type { VisualizationFrame, GraphNode, GraphEdge } from '../../../types/visualizer';
import { cn } from '../../../lib/utils';
import { Network, Layers, Clock, GitCommit, AlertTriangle, Lightbulb } from 'lucide-react';

interface Props {
  frame?: VisualizationFrame;
}

export const GraphRenderer: React.FC<Props> = ({ frame }) => {
  const state = frame?.graphState;

  // Fallback demo graph layout if state is absent
  const defaultNodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 100, y: 180, state: 'unvisited', distance: 0 },
    { id: 'B', label: 'B', x: 240, y: 80, state: 'unvisited', distance: '∞' },
    { id: 'C', label: 'C', x: 240, y: 280, state: 'unvisited', distance: '∞' },
    { id: 'D', label: 'D', x: 400, y: 80, state: 'unvisited', distance: '∞' },
    { id: 'E', label: 'E', x: 400, y: 280, state: 'unvisited', distance: '∞' },
    { id: 'F', label: 'F', x: 540, y: 180, state: 'unvisited', distance: '∞' },
  ];

  const defaultEdges: GraphEdge[] = [
    { from: 'A', to: 'B', weight: 4, state: 'normal' },
    { from: 'A', to: 'C', weight: 2, state: 'normal' },
    { from: 'B', to: 'C', weight: 1, state: 'normal' },
    { from: 'B', to: 'D', weight: 5, state: 'normal' },
    { from: 'C', to: 'E', weight: 8, state: 'normal' },
    { from: 'D', to: 'E', weight: 2, state: 'normal' },
    { from: 'D', to: 'F', weight: 6, state: 'normal' },
    { from: 'E', to: 'F', weight: 3, state: 'normal' },
  ];

  const nodes = state?.nodes || defaultNodes;
  const edges = state?.edges || defaultEdges;
  const visitedNodes = state?.visitedNodes || [];
  const queue = state?.queue;
  const stack = state?.stack;
  const activePath = state?.activePath;
  const priorityQueue = state?.priorityQueue;
  const distances = state?.distances;
  const inDegrees = state?.inDegrees;
  const resultOrder = state?.resultOrder;
  const sortedEdges = state?.sortedEdges;
  const disjointSet = state?.disjointSet;
  const components = state?.components;
  const totalComponents = state?.totalComponents;
  const isCycleDetected = state?.isCycleDetected;
  const isBipartite = state?.isBipartite;
  const passNumber = state?.passNumber;
  const totalPasses = state?.totalPasses;
  const floydMatrix = state?.floydMatrix;
  const floydK = state?.floydK;
  const matrix = state?.matrix;
  const matrixLabels = state?.matrixNodeLabels;
  const adjList = state?.adjList;
  const decisionReason = state?.decisionReason;
  const changeSummary = state?.changeSummary;
  const explanation = state?.explanationText || frame?.event?.explanation || 'Interactive Graph Visualizer Ready';

  const getNodePos = (id: string) => {
    const node = nodes.find(n => n.id === id);
    return { x: node?.x ?? 100, y: node?.y ?? 100 };
  };

  const getNodeStyle = (node: GraphNode) => {
    if (node.colorHex) {
      return `text-slate-950 font-bold border-white/80 shadow-md`;
    }
    if (node.bipartiteColor === 'A') {
      return 'bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-400/50 shadow-md';
    }
    if (node.bipartiteColor === 'B') {
      return 'bg-pink-500 text-white border-pink-300 ring-2 ring-pink-400/50 shadow-md';
    }

    switch (node.state) {
      case 'current':
        return 'bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/50 shadow-xl scale-110 z-20';
      case 'visiting':
      case 'queued':
        return 'bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/20';
      case 'visited':
        return 'bg-emerald-500 text-white border-emerald-400 shadow-sm';
      case 'mst':
        return 'bg-purple-500 text-white border-purple-400 ring-2 ring-purple-400/40 shadow-md';
      case 'cycle':
        return 'bg-rose-600 text-white border-rose-400 ring-4 ring-rose-500/60 shadow-xl animate-pulse';
      case 'articulation':
        return 'bg-orange-500 text-slate-950 border-orange-300 ring-4 ring-orange-400/60 shadow-lg';
      case 'conflict':
        return 'bg-red-600 text-white border-red-300 ring-4 ring-red-500/80 shadow-xl';
      default:
        return 'bg-card text-foreground border-border/80 hover:border-muted-foreground/40';
    }
  };

  const getEdgeStyle = (edgeState: GraphEdge['state']) => {
    switch (edgeState) {
      case 'active':
        return 'stroke-amber-400 stroke-[3.5] stroke-dasharray-4 animate-pulse';
      case 'traversed':
        return 'stroke-blue-400 stroke-[3]';
      case 'relaxed':
        return 'stroke-emerald-400 stroke-[3.5]';
      case 'mst':
        return 'stroke-purple-500 stroke-[4]';
      case 'cycle':
      case 'conflict':
        return 'stroke-rose-500 stroke-[4] animate-pulse';
      case 'bridge':
        return 'stroke-orange-400 stroke-[4] stroke-dasharray-2';
      case 'rejected':
        return 'stroke-muted-foreground/40 stroke-1 stroke-dasharray-2';
      default:
        return 'stroke-border stroke-2';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 py-2 text-left">
      
      {/* HEADER STATUS BAR */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Network className="w-5 h-5" />
          </span>
          <div>
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">
              Educational Graph Engine
            </span>
            <span className="text-base font-extrabold text-foreground">
              {state?.algorithmName || 'Graph Traversal & Analysis'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          {totalComponents !== undefined && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Components: {totalComponents}
            </span>
          )}
          {passNumber !== undefined && totalPasses !== undefined && (
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
              Pass {passNumber} / {totalPasses}
            </span>
          )}
          {isCycleDetected && (
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Cycle Detected
            </span>
          )}
          {isBipartite !== undefined && isBipartite !== null && (
            <span className={cn('px-3 py-1 rounded-full font-bold border', isBipartite ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20')}>
              {isBipartite ? 'Bipartite Graph' : 'Not Bipartite'}
            </span>
          )}
          <span className="px-3 py-1.5 rounded-full bg-secondary/80 text-secondary-foreground font-bold border border-border">
            |V| = {nodes.length}, |E| = {edges.length}
          </span>
        </div>
      </div>

      {/* GRAPH CANVAS & DATA STRUCTURE PANELS */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRAPH SVG CANVAS */}
        <div className="lg:col-span-7 bg-card/70 backdrop-blur-xl rounded-3xl border border-border/80 p-5 shadow-xl relative min-h-[400px] flex items-center justify-center overflow-hidden">
          <svg className="w-full h-[360px] pointer-events-none" viewBox="0 0 640 360">
            <defs>
              <marker
                id="arrowhead-directed"
                markerWidth="8"
                markerHeight="6"
                refX="24"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="currentColor" className="text-orange-400" />
              </marker>
            </defs>

            {/* EDGES */}
            {edges.map((edge, idx) => {
              const p1 = getNodePos(edge.from);
              const p2 = getNodePos(edge.to);
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              return (
                <g key={`edge-${edge.from}-${edge.to}-${idx}`}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    className={cn('transition-all duration-300', getEdgeStyle(edge.state))}
                    markerEnd={edge.isDirected ? 'url(#arrowhead-directed)' : undefined}
                  />

                  {/* Edge Weight / Label */}
                  {(edge.weight !== undefined || edge.label) && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-14"
                        y="-10"
                        width="28"
                        height="20"
                        rx="6"
                        className="fill-background stroke-border stroke-1 shadow-sm"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        className="fill-foreground font-mono text-[11px] font-bold"
                      >
                        {edge.label || edge.weight}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* NODES */}
            {nodes.map(node => {
              const pos = getNodePos(node.id);
              const dist = distances?.[node.id] !== undefined ? distances[node.id] : node.distance;

              return (
                <g key={`node-${node.id}`} transform={`translate(${pos.x}, ${pos.y})`}>
                  {/* Outer Pulsing Ping Ring */}
                  {(node.state === 'current' || node.state === 'cycle') && (
                    <circle r="28" className={cn('animate-ping', node.state === 'cycle' ? 'fill-rose-500/30' : 'fill-amber-400/25')} />
                  )}

                  {/* Node Circle */}
                  <foreignObject x="-24" y="-24" width="48" height="48">
                    <motion.div
                      layout
                      style={node.colorHex ? { backgroundColor: node.colorHex } : undefined}
                      animate={{ scale: node.state === 'current' ? 1.15 : 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={cn(
                        'w-12 h-12 rounded-full flex flex-col items-center justify-center font-black text-sm border-2 shadow-md pointer-events-auto transition-all',
                        getNodeStyle(node)
                      )}
                    >
                      <span>{node.label}</span>
                    </motion.div>
                  </foreignObject>

                  {/* Distance Badge */}
                  {dist !== undefined && (
                    <g transform="translate(0, -32)">
                      <rect
                        x="-18"
                        y="-8"
                        width="36"
                        height="16"
                        rx="4"
                        className="fill-primary text-primary-foreground"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        className="fill-primary-foreground font-mono text-[10px] font-black"
                      >
                        {dist}
                      </text>
                    </g>
                  )}

                  {/* InDegree Badge */}
                  {inDegrees?.[node.id] !== undefined && (
                    <g transform="translate(22, -16)">
                      <rect x="-10" y="-8" width="20" height="16" rx="4" className="fill-purple-600" />
                      <text x="0" y="3" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">
                        in:{inDegrees[node.id]}
                      </text>
                    </g>
                  )}

                  {/* Tarjan Low-Link Badge */}
                  {node.discoveryTime !== undefined && (
                    <g transform="translate(0, 32)">
                      <rect x="-24" y="-8" width="48" height="16" rx="4" className="fill-slate-800 stroke-border stroke-1" />
                      <text x="0" y="3" textAnchor="middle" className="fill-orange-400 font-mono text-[9px] font-bold">
                        d:{node.discoveryTime} l:{node.lowValue}
                      </text>
                    </g>
                  )}

                  {/* Component / Color Label Badge */}
                  {node.colorLabel && (
                    <g transform="translate(0, 32)">
                      <rect x="-22" y="-8" width="44" height="16" rx="4" className="fill-background stroke-border stroke-1" />
                      <text x="0" y="3" textAnchor="middle" className="fill-foreground font-mono text-[9px] font-extrabold">
                        {node.colorLabel}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* DATA STRUCTURE & EDUCATIONAL DECISION PANELS */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* EDUCATIONAL DECISION REASON BOX */}
          <div className="bg-gradient-to-br from-amber-500/10 via-card to-card border border-amber-500/30 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-sans">
              <Lightbulb className="w-4 h-4" /> Algorithm Decision
            </span>
            <p className="text-xs sm:text-sm text-foreground font-semibold leading-relaxed">
              {decisionReason || explanation}
            </p>
            {changeSummary && (
              <div className="pt-1 text-[11px] font-mono text-muted-foreground border-t border-border/60">
                <span className="text-emerald-400 font-bold">State Update:</span> {changeSummary}
              </div>
            )}
          </div>

          {/* VISITED NODES SEQUENCE */}
          {visitedNodes.length > 0 && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block font-sans">
                Visited Nodes Sequence
              </span>
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                {visitedNodes.map((nId, idx) => (
                  <span key={`v-${idx}`} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    {nId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CONNECTED COMPONENTS LIST */}
          {components && components.length > 0 && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 block font-sans">
                Discovered Components
              </span>
              <div className="flex flex-col gap-1 text-xs font-mono">
                {components.map(comp => (
                  <div key={`comp-${comp.id}`} className="flex items-center gap-2 p-1.5 rounded-xl bg-background border border-border">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />
                    <span className="font-bold text-foreground">Comp #{comp.id}:</span>
                    <span className="text-muted-foreground">[{comp.nodes.join(', ')}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADJACENCY MATRIX & LIST (FOR REPRESENTATION) */}
          {matrix && matrixLabels && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-orange-400 block">
                Adjacency Matrix
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-center font-mono text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-1 text-muted-foreground"></th>
                      {matrixLabels.map(l => <th key={l} className="p-1 text-orange-400 font-bold">{l}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row, i) => (
                      <tr key={`mr-${i}`}>
                        <td className="p-1 text-orange-400 font-bold">{matrixLabels[i]}</td>
                        {row.map((val, j) => (
                          <td key={`mc-${i}-${j}`} className={cn("p-1 border border-border/60 font-bold", val > 0 ? "text-emerald-400 bg-emerald-500/10" : "text-muted-foreground/40")}>
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adjList && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400 block font-sans">
                Adjacency List
              </span>
              <div className="flex flex-col gap-1 text-xs font-mono max-h-[120px] overflow-y-auto">
                {Object.entries(adjList).map(([nodeId, neighbors]) => (
                  <div key={`al-${nodeId}`} className="p-1.5 bg-background border border-border rounded-xl flex items-center justify-between">
                    <span className="font-bold text-blue-400">{nodeId} →</span>
                    <span className="text-foreground">[{neighbors.join(', ')}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FIFO QUEUE */}
          {queue && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5 font-sans">
                <Layers className="w-3.5 h-3.5" /> FIFO Queue
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 min-h-[40px]">
                {queue.map((item, idx) => (
                  <span
                    key={`q-${idx}`}
                    className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs font-mono shadow-sm"
                  >
                    {item}
                  </span>
                ))}
                {queue.length === 0 && <span className="text-xs text-muted-foreground italic">Queue is empty</span>}
              </div>
            </div>
          )}

          {/* LIFO CALL STACK & ACTIVE PATH */}
          {stack && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5 font-sans">
                <GitCommit className="w-3.5 h-3.5" /> Call Stack & Path
              </span>
              <div className="flex flex-wrap items-center gap-1.5 py-1 min-h-[40px]">
                {stack.map((item, idx) => (
                  <span
                    key={`st-${idx}`}
                    className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-xs font-mono"
                  >
                    {item}
                  </span>
                ))}
                {stack.length === 0 && <span className="text-xs text-muted-foreground italic">Stack is empty</span>}
              </div>
              {activePath && activePath.length > 0 && (
                <div className="text-xs font-mono text-muted-foreground pt-1">
                  <span className="text-purple-400 font-bold">Active Path:</span> {activePath.join(' → ')}
                </div>
              )}
            </div>
          )}

          {/* MIN-HEAP PRIORITY QUEUE */}
          {priorityQueue && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-sans">
                <Clock className="w-3.5 h-3.5" /> Priority Queue (Min-Heap)
              </span>
              <div className="flex flex-wrap gap-2 py-1 max-h-[120px] overflow-y-auto">
                {priorityQueue.map((item, idx) => (
                  <span
                    key={`pq-${idx}`}
                    className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold"
                  >
                    {item.label || `${item.node} (dist:${item.dist ?? item.weight})`}
                  </span>
                ))}
                {priorityQueue.length === 0 && <span className="text-xs text-muted-foreground italic">Priority Queue is empty</span>}
              </div>
            </div>
          )}

          {/* DISTANCE TABLE */}
          {distances && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block font-sans">
                Distance Table
              </span>
              <div className="grid grid-cols-6 gap-1.5 font-mono text-xs text-center">
                {Object.entries(distances).map(([nodeId, distVal]) => (
                  <div key={`d-${nodeId}`} className="bg-background border border-border rounded-xl p-1.5 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground block font-bold">{nodeId}</span>
                    <span className="font-black text-amber-400">{distVal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KRUSKAL SORTED EDGES LIST */}
          {sortedEdges && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 block font-sans">
                Sorted Edge List (Kruskal)
              </span>
              <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto text-xs font-mono">
                {sortedEdges.map((e, idx) => (
                  <div
                    key={`se-${idx}`}
                    className={cn(
                      'px-3 py-1 rounded-lg border flex justify-between items-center',
                      e.status === 'accepted' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      e.status === 'rejected' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 line-through' :
                      e.status === 'evaluating' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold' :
                      'bg-background border-border text-muted-foreground'
                    )}
                  >
                    <span>{e.from} — {e.to} (w:{e.weight})</span>
                    <span className="text-[10px] font-black uppercase">{e.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISJOINT SET PARENT TABLE */}
          {disjointSet && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 block font-sans">
                Union-Find Disjoint Set Parent Array
              </span>
              <div className="grid grid-cols-6 gap-1 text-center font-mono text-xs">
                {Object.entries(disjointSet).map(([id, info]) => (
                  <div key={`uf-${id}`} className="bg-background border border-border rounded-xl p-1.5">
                    <span className="text-[10px] text-muted-foreground block">{id}</span>
                    <span className="font-bold text-cyan-400">p:{info.parent}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FLOYD-WARSHALL MATRIX */}
          {floydMatrix && matrixLabels && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block font-sans">
                Floyd-Warshall Matrix (Pivot K = {floydK ?? '-'})
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-center font-mono text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-1 text-muted-foreground"></th>
                      {matrixLabels.map(l => <th key={l} className="p-1 text-emerald-400 font-bold">{l}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {floydMatrix.map((row, i) => (
                      <tr key={`fr-${i}`}>
                        <td className="p-1 text-emerald-400 font-bold">{matrixLabels[i]}</td>
                        {row.map((cell, j) => (
                          <td key={`fc-${i}-${j}`} className="p-1 border border-border/60 bg-background/60 font-bold text-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TOPOLOGICAL SORT / VISITED SEQUENCE */}
          {resultOrder && resultOrder.length > 0 && (
            <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block font-sans">
                Topological Order Output
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-1 font-mono text-sm font-bold text-emerald-400">
                {resultOrder.join(' → ')}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
