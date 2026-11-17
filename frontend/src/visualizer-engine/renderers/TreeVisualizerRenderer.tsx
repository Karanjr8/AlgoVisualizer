import React, { useMemo } from 'react';
import { TreeVisualizerState, TreeNode } from '../types/ds-states';

interface Props {
  state: TreeVisualizerState;
}

interface ComputedNodePos {
  id: string;
  x: number;
  y: number;
  node: TreeNode;
}

export const TreeVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const {
    nodes,
    rootId,
    traversalOrder,
    message,
    threadEdges,
    diameterEdges,
    serializedStream,
    queue,
    activeComparison,
    highlightEdges,
    activeEdgeId,
    activePath,
    activeView,
  } = state;

  // Hierarchical Layout Calculation (SVG Canvas Coordinates)
  const { positions, edges, svgWidth, svgHeight } = useMemo(() => {
    if (!rootId || !nodes[rootId] || Object.keys(nodes).length === 0) {
      return { positions: [], edges: [], svgWidth: 640, svgHeight: 280 };
    }

    const nodePositions: ComputedNodePos[] = [];
    const edgeList: Array<{
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      id: string;
      isDiameter?: boolean;
      isActive?: boolean;
    }> = [];

    // Assign x coordinates based on inorder traversal rank
    let rank = 0;
    const ranks: Record<string, number> = {};
    const depths: Record<string, number> = {};
    let maxDepth = 0;

    const inorder = (id: string | null, depth: number) => {
      if (!id || !nodes[id]) return;
      if (depth > maxDepth) maxDepth = depth;
      depths[id] = depth;

      inorder(nodes[id].leftId, depth + 1);
      ranks[id] = rank++;
      inorder(nodes[id].rightId, depth + 1);
    };

    inorder(rootId, 0);

    // Any unvisited nodes (e.g. disconnected or during transition)
    Object.keys(nodes).forEach(id => {
      if (ranks[id] === undefined) {
        depths[id] = nodes[id].level || 0;
        ranks[id] = rank++;
      }
    });

    const minSpacingX = 68;
    const spacingY = 78;
    const width = Math.max(680, (rank + 1) * minSpacingX);
    const height = Math.max(320, (maxDepth + 2) * spacingY + 20);
    const marginX = width / (rank + 1);

    Object.keys(nodes).forEach((id) => {
      if (ranks[id] !== undefined) {
        nodePositions.push({
          id,
          x: marginX * (ranks[id] + 1),
          y: (depths[id] + 0.9) * spacingY,
          node: nodes[id],
        });
      }
    });

    // Build edges
    nodePositions.forEach((pos) => {
      if (pos.node.leftId && ranks[pos.node.leftId] !== undefined) {
        const leftChild = nodePositions.find((p) => p.id === pos.node.leftId);
        if (leftChild) {
          const edgeId = `edge-${pos.id}-${leftChild.id}`;
          const isDiam = Boolean(
            diameterEdges?.includes(edgeId) ||
            (pos.node.inDiameter && leftChild.node.inDiameter)
          );
          const isHighlight = Boolean(
            highlightEdges?.includes(edgeId) ||
            activeEdgeId === edgeId ||
            (activePath && activePath.includes(pos.id) && activePath.includes(leftChild.id)) ||
            (pos.node.state === 'comparing' && leftChild.node.state === 'comparing')
          );
          edgeList.push({
            id: edgeId,
            fromX: pos.x,
            fromY: pos.y,
            toX: leftChild.x,
            toY: leftChild.y,
            isDiameter: isDiam,
            isActive: isHighlight,
          });
        }
      }
      if (pos.node.rightId && ranks[pos.node.rightId] !== undefined) {
        const rightChild = nodePositions.find((p) => p.id === pos.node.rightId);
        if (rightChild) {
          const edgeId = `edge-${pos.id}-${rightChild.id}`;
          const isDiam = Boolean(
            diameterEdges?.includes(edgeId) ||
            (pos.node.inDiameter && rightChild.node.inDiameter)
          );
          const isHighlight = Boolean(
            highlightEdges?.includes(edgeId) ||
            activeEdgeId === edgeId ||
            (activePath && activePath.includes(pos.id) && activePath.includes(rightChild.id)) ||
            (pos.node.state === 'comparing' && rightChild.node.state === 'comparing')
          );
          edgeList.push({
            id: edgeId,
            fromX: pos.x,
            fromY: pos.y,
            toX: rightChild.x,
            toY: rightChild.y,
            isDiameter: isDiam,
            isActive: isHighlight,
          });
        }
      }
    });

    return { positions: nodePositions, edges: edgeList, svgWidth: width, svgHeight: height };
  }, [nodes, rootId, diameterEdges, highlightEdges, activeEdgeId, activePath]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-3 select-none">
      {/* Dynamic Status / Queue / Traversal / Comparison Info Banners */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-4xl">
        {/* Active Comparison Badge */}
        {activeComparison && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 shadow-sm animate-pulse">
            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-400">Comparing:</span>
            <span className="font-black">
              {activeComparison.value}{' '}
              {activeComparison.result === 'smaller' ? '<' : activeComparison.result === 'greater' ? '>' : '=='}{' '}
              {activeComparison.comparedWith}
            </span>
          </div>
        )}

        {/* Live Queue Banner for Level Order BFS */}
        {queue && queue.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono shadow-sm">
            <span className="text-blue-400 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              BFS Queue:
            </span>
            <div className="flex items-center gap-1 text-foreground font-bold">
              <span className="text-[10px] text-muted-foreground mr-1">FRONT &rarr;</span>
              {queue.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono"
                >
                  {item}
                </span>
              ))}
              <span className="text-[10px] text-muted-foreground ml-1">&larr; REAR</span>
            </div>
          </div>
        )}

        {/* Live Traversal Order Stream */}
        {traversalOrder && traversalOrder.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 border border-border text-xs font-mono shadow-sm">
            <span className="text-muted-foreground uppercase font-bold">Output Stream:</span>
            <span className="text-emerald-400 font-bold">{traversalOrder.join(' -> ')}</span>
          </div>
        )}

        {/* Serialized Stream Banner */}
        {serializedStream && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 border border-border text-xs font-mono shadow-sm">
            <span className="text-muted-foreground uppercase font-bold">Stream:</span>
            <span className="text-blue-400 font-bold">[{serializedStream}]</span>
          </div>
        )}

        {/* Active View Tag */}
        {activeView && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">
            {activeView} View Active
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div className="w-full text-xs font-mono text-muted-foreground text-center px-4 leading-relaxed">
            {message}
          </div>
        )}
      </div>

      {/* SVG Canvas Container */}
      <div className="w-full overflow-auto max-h-[500px] flex items-center justify-center custom-scrollbar border border-border/50 rounded-2xl bg-background/40 backdrop-blur-sm p-4">
        {positions.length === 0 ? (
          <div className="py-24 text-muted-foreground font-mono text-sm">Tree is empty.</div>
        ) : (
          <svg width={svgWidth} height={svgHeight} className="overflow-visible select-none">
            <defs>
              <linearGradient id="edgeGradDefault" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
              </linearGradient>

              <linearGradient id="edgeGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="1" />
              </linearGradient>

              <linearGradient id="edgeGradDiameter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
              </linearGradient>

              <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Tree Branch Edges */}
            {edges.map((e) => (
              <line
                key={e.id}
                x1={e.fromX}
                y1={e.fromY}
                x2={e.toX}
                y2={e.toY}
                stroke={e.isDiameter ? 'url(#edgeGradDiameter)' : (e.isActive ? 'url(#edgeGradActive)' : 'url(#edgeGradDefault)')}
                strokeWidth={e.isDiameter ? 4 : (e.isActive ? 3.5 : 2.5)}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            ))}

            {/* Morris Threaded Edges if any */}
            {threadEdges?.map((th) => {
              const fromP = positions.find((p) => p.id === th.from);
              const toP = positions.find((p) => p.id === th.to);
              if (!fromP || !toP) return null;
              const cx = (fromP.x + toP.x) / 2 + 35;
              const cy = (fromP.y + toP.y) / 2 - 25;
              return (
                <g key={th.id}>
                  <path
                    d={`M ${fromP.x} ${fromP.y} Q ${cx} ${cy} ${toP.x} ${toP.y}`}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth={2.5}
                    strokeDasharray="5,5"
                  />
                  <text x={cx} y={cy - 5} fill="#ec4899" fontSize={10} fontWeight="bold" fontFamily="monospace">
                    Thread Link
                  </text>
                </g>
              );
            })}

            {/* Tree Nodes */}
            {positions.map((pos) => {
              const node = pos.node;
              let fill = '#0f172a'; // dark slate
              let stroke = '#3b82f6'; // indigo/blue
              const textColor = '#ffffff';

              if (node.state === 'comparing') {
                fill = '#451a03'; // amber
                stroke = '#f59e0b';
              } else if (node.state === 'inserted') {
                fill = '#064e3b'; // emerald
                stroke = '#10b981';
              } else if (node.state === 'visited') {
                fill = '#1e1b4b'; // indigo
                stroke = '#818cf8';
              } else if (node.state === 'deleted') {
                fill = '#881337'; // rose
                stroke = '#f43f5e';
              } else if (node.state === 'active') {
                fill = '#083344'; // cyan
                stroke = '#06b6d4';
              } else if (node.state === 'rotating') {
                fill = '#3b0764'; // purple
                stroke = '#a855f7';
              }

              const tag = node.label || node.viewTag || node.role;

              return (
                <g key={pos.id} className="transition-all duration-300">
                  {/* Floating Tooltip / Status Tag above Node */}
                  {tag && (
                    <g className="transition-all">
                      <rect
                        x={pos.x - 42}
                        y={pos.y - 42}
                        width={84}
                        height={18}
                        rx={6}
                        fill={
                          node.state === 'comparing'
                            ? '#d97706'
                            : node.state === 'deleted'
                            ? '#e11d48'
                            : node.state === 'inserted'
                            ? '#059669'
                            : '#2563eb'
                        }
                        opacity={0.95}
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 29}
                        fill="#ffffff"
                        fontSize={9}
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {tag.length > 15 ? tag.substring(0, 14) + '...' : tag}
                      </text>
                    </g>
                  )}

                  {/* Pulsing ring for active or comparing nodes */}
                  {(node.state === 'comparing' || node.state === 'inserted') && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={28}
                      fill="none"
                      stroke={stroke}
                      strokeWidth={1.5}
                      opacity={0.4}
                      className="animate-pulse"
                    />
                  )}

                  {/* Outer circle node body */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={22}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2.5}
                    filter="url(#nodeGlow)"
                    className="transition-colors"
                  />

                  {/* Node Numerical Value (ALWAYS visible!) */}
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    fill={textColor}
                    fontSize={13}
                    fontWeight="black"
                    textAnchor="middle"
                    className="font-mono select-none"
                  >
                    {node.value}
                  </text>

                  {/* Balance Factor badge if available */}
                  {node.balanceFactor !== undefined && (
                    <text
                      x={pos.x + 16}
                      y={pos.y - 10}
                      fill={Math.abs(node.balanceFactor) > 1 ? '#ef4444' : '#10b981'}
                      fontSize={8.5}
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      BF:{node.balanceFactor > 0 ? '+' : ''}{node.balanceFactor}
                    </text>
                  )}

                  {/* Node Height badge */}
                  {node.height !== undefined && node.balanceFactor === undefined && (
                    <text
                      x={pos.x + 18}
                      y={pos.y - 12}
                      fill="#94a3b8"
                      fontSize={8.5}
                      fontFamily="monospace"
                    >
                      h:{node.height}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};
