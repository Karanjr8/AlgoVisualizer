import React from 'react';
import { GraphVisualizerState } from '../types/ds-states';

interface Props {
  state: GraphVisualizerState;
}

export const GraphVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { vertices, edges, isDirected, isWeighted, visitedOrder, activeEdgeId } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-4 select-none">
      {/* Visited Order Indicator */}
      {visitedOrder && visitedOrder.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 border border-border text-xs font-mono">
          <span className="text-muted-foreground uppercase font-bold">Traversal Order:</span>
          <span className="text-primary font-bold">{visitedOrder.join(' -> ')}</span>
        </div>
      )}

      {/* SVG Graph View */}
      <div className="w-full overflow-auto flex items-center justify-center max-h-[460px]">
        <svg width={720} height={320} className="overflow-visible">
          <defs>
            <marker
              id="graph-arrow"
              viewBox="0 0 10 10"
              refX="24"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge) => {
            const fromV = vertices.find((v) => v.id === edge.from);
            const toV = vertices.find((v) => v.id === edge.to);
            if (!fromV || !toV) return null;

            const isActive = edge.id === activeEdgeId || edge.state === 'active';
            const isMST = edge.state === 'mst';
            const isRelaxed = edge.state === 'relaxed';

            let strokeColor = '#334155';
            let strokeWidth = 2;
            if (isActive) {
              strokeColor = '#f59e0b'; // amber
              strokeWidth = 3.5;
            } else if (isMST) {
              strokeColor = '#10b981'; // emerald
              strokeWidth = 4;
            } else if (isRelaxed) {
              strokeColor = '#06b6d4'; // cyan
              strokeWidth = 3;
            }

            const midX = (fromV.x + toV.x) / 2;
            const midY = (fromV.y + toV.y) / 2;

            return (
              <g key={edge.id}>
                <line
                  x1={fromV.x}
                  y1={fromV.y}
                  x2={toV.x}
                  y2={toV.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  markerEnd={isDirected ? 'url(#graph-arrow)' : undefined}
                />

                {/* Edge Weight Badge */}
                {isWeighted && edge.weight !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x={-12}
                      y={-10}
                      width={24}
                      height={20}
                      rx={6}
                      fill="#0f172a"
                      stroke={strokeColor}
                      strokeWidth={1}
                    />
                    <text
                      x={0}
                      y={4}
                      fill="#e2e8f0"
                      fontSize={11}
                      fontWeight="bold"
                      textAnchor="middle"
                      className="font-mono select-none"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Vertices */}
          {vertices.map((v) => {
            let fill = '#1e293b';
            let stroke = '#64748b';
            if (v.state === 'current') {
              fill = '#78350f';
              stroke = '#f59e0b';
            } else if (v.state === 'visited') {
              fill = '#3b0764';
              stroke = '#a855f7';
            } else if (v.state === 'in-queue') {
              fill = '#064e3b';
              stroke = '#10b981';
            }

            return (
              <g key={v.id} className="transition-all duration-300">
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.5}
                  className="filter drop-shadow-md"
                />

                {/* Vertex Label */}
                <text
                  x={v.x}
                  y={v.y + 5}
                  fill="#ffffff"
                  fontSize={14}
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono select-none"
                >
                  {v.label}
                </text>

                {/* Distance Indicator (Dijkstra) */}
                {v.distance !== undefined && (
                  <text
                    x={v.x}
                    y={v.y - 28}
                    fill="#38bdf8"
                    fontSize={11}
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono select-none"
                  >
                    dist: {v.distance === Infinity ? '∞' : v.distance}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
