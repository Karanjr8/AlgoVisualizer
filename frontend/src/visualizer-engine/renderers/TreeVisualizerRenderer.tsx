import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TreeVisualizerState, TreeNode } from '../types/ds-states';
import { cn } from '../../lib/utils';

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
  const { nodes, rootId, traversalOrder } = state;

  // Hierarchical Layout Calculation (SVG Canvas Coordinates)
  const { positions, edges, svgWidth, svgHeight } = useMemo(() => {
    if (!rootId || !nodes[rootId]) {
      return { positions: [], edges: [], svgWidth: 600, svgHeight: 250 };
    }

    const nodePositions: ComputedNodePos[] = [];
    const edgeList: Array<{ fromX: number; fromY: number; toX: number; toY: number; id: string }> = [];

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

    const minSpacingX = 56;
    const spacingY = 70;
    const width = Math.max(640, (rank + 1) * minSpacingX);
    const height = Math.max(280, (maxDepth + 2) * spacingY);
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
          edgeList.push({
            id: `${pos.id}-${leftChild.id}`,
            fromX: pos.x,
            fromY: pos.y,
            toX: leftChild.x,
            toY: leftChild.y,
          });
        }
      }
      if (pos.node.rightId && ranks[pos.node.rightId] !== undefined) {
        const rightChild = nodePositions.find((p) => p.id === pos.node.rightId);
        if (rightChild) {
          edgeList.push({
            id: `${pos.id}-${rightChild.id}`,
            fromX: pos.x,
            fromY: pos.y,
            toX: rightChild.x,
            toY: rightChild.y,
          });
        }
      }
    });

    return { positions: nodePositions, edges: edgeList, svgWidth: width, svgHeight: height };
  }, [nodes, rootId]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-4 select-none">
      {/* Traversal Order Pill */}
      {traversalOrder && traversalOrder.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 border border-border text-xs font-mono">
          <span className="text-muted-foreground uppercase font-bold">Traversal:</span>
          <span className="text-primary font-bold">{traversalOrder.join(' -> ')}</span>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="w-full overflow-auto max-h-[460px] flex items-center justify-center">
        {positions.length === 0 ? (
          <div className="py-20 text-muted-foreground font-mono text-sm">Tree is empty.</div>
        ) : (
          <svg width={svgWidth} height={svgHeight} className="overflow-visible">
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Tree Branch Edges */}
            {edges.map((e) => (
              <line
                key={e.id}
                x1={e.fromX}
                y1={e.fromY}
                x2={e.toX}
                y2={e.toY}
                stroke="url(#edgeGrad)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            ))}

            {/* Tree Nodes */}
            {positions.map((pos) => {
              const node = pos.node;
              let fill = '#1e1b4b'; // dark indigo
              let stroke = '#6366f1'; // indigo
              let textColor = '#ffffff';

              if (node.state === 'comparing') {
                fill = '#78350f'; // amber
                stroke = '#f59e0b';
              } else if (node.state === 'inserted') {
                fill = '#064e3b'; // emerald
                stroke = '#10b981';
              } else if (node.state === 'visited') {
                fill = '#3b0764'; // purple
                stroke = '#a855f7';
              } else if (node.state === 'deleted') {
                fill = '#881337'; // rose
                stroke = '#f43f5e';
              }

              return (
                <g key={pos.id} className="transition-all duration-300">
                  {/* Outer circle halo */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={22}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2.5}
                    className="filter drop-shadow-md transition-colors"
                  />

                  {/* Value Text */}
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    fill={textColor}
                    fontSize={13}
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono select-none"
                  >
                    {node.value}
                  </text>

                  {/* Node Height/Balance Badge */}
                  {node.height !== undefined && (
                    <text
                      x={pos.x + 18}
                      y={pos.y - 12}
                      fill="#94a3b8"
                      fontSize={9}
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
