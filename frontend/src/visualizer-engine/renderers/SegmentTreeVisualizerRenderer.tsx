import React, { useMemo } from 'react';
import { SegmentTreeVisualizerState, SegmentTreeNode } from '../types/ds-states';
import { cn } from '../../lib/utils';

interface Props {
  state: SegmentTreeVisualizerState;
}

export const SegmentTreeVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { nodes, rootId, baseArray, queryRange, operationType } = state;

  const { positions, edges } = useMemo(() => {
    if (!rootId || !nodes[rootId]) return { positions: [], edges: [] };

    const posList: Array<{ id: string; x: number; y: number; node: SegmentTreeNode }> = [];
    const edgeList: Array<{ id: string; fromX: number; fromY: number; toX: number; toY: number }> = [];

    // Traverse and assign positions
    let leafCount = 0;
    const xPositions: Record<string, number> = {};
    const ySpacing = 65;

    const assignX = (id: string, depth: number): number => {
      const node = nodes[id];
      if (!node) return 0;

      if (!node.leftId && !node.rightId) {
        leafCount += 1;
        const x = leafCount * 76;
        xPositions[id] = x;
        return x;
      }

      const leftX = node.leftId ? assignX(node.leftId, depth + 1) : 0;
      const rightX = node.rightId ? assignX(node.rightId, depth + 1) : 0;
      const avg = (leftX + rightX) / 2;
      xPositions[id] = avg;
      return avg;
    };

    assignX(rootId, 0);

    const calcY = (id: string, depth: number) => {
      const node = nodes[id];
      if (!node) return;

      const x = xPositions[id] || 300;
      const y = (depth + 1) * ySpacing;
      posList.push({ id, x, y, node });

      if (node.leftId) {
        edgeList.push({
          id: `${id}-${node.leftId}`,
          fromX: x,
          fromY: y,
          toX: xPositions[node.leftId] || 300,
          toY: (depth + 2) * ySpacing,
        });
        calcY(node.leftId, depth + 1);
      }
      if (node.rightId) {
        edgeList.push({
          id: `${id}-${node.rightId}`,
          fromX: x,
          fromY: y,
          toX: xPositions[node.rightId] || 300,
          toY: (depth + 2) * ySpacing,
        });
        calcY(node.rightId, depth + 1);
      }
    };

    calcY(rootId, 0);

    return { positions: posList, edges: edgeList };
  }, [nodes, rootId]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5 py-4 select-none">
      {/* Query Banner */}
      <div className="flex items-center gap-3 text-xs font-mono">
        <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
          Range {operationType?.toUpperCase()} Segment Tree
        </span>
        {queryRange && (
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
            Query Range: [{queryRange[0]}, {queryRange[1]}]
          </span>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-auto flex items-center justify-center max-h-[400px]">
        <svg width={Math.max(680, baseArray.length * 80)} height={280} className="overflow-visible">
          {/* Edges */}
          {edges.map((e) => (
            <line
              key={e.id}
              x1={e.fromX}
              y1={e.fromY}
              x2={e.toX}
              y2={e.toY}
              stroke="#6366f1"
              strokeWidth={2}
              opacity={0.6}
            />
          ))}

          {/* Nodes */}
          {positions.map((p) => {
            const isHit = p.node.state === 'query-hit';
            const isUpdating = p.node.state === 'updating';

            let fill = '#1e1b4b';
            let stroke = '#6366f1';

            if (isHit) {
              fill = '#064e3b';
              stroke = '#10b981';
            } else if (isUpdating) {
              fill = '#78350f';
              stroke = '#f59e0b';
            }

            return (
              <g key={p.id}>
                {/* Node Box */}
                <rect
                  x={p.x - 28}
                  y={p.y - 18}
                  width={56}
                  height={36}
                  rx={10}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                  className="filter drop-shadow-md transition-colors"
                />

                {/* Node Value */}
                <text
                  x={p.x}
                  y={p.y + 1}
                  fill="#ffffff"
                  fontSize={12}
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono select-none"
                >
                  {p.node.value}
                </text>

                {/* Range Label [L, R] */}
                <text
                  x={p.x}
                  y={p.y + 13}
                  fill="#94a3b8"
                  fontSize={8}
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono select-none"
                >
                  [{p.node.range[0]},{p.node.range[1]}]
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
