import React, { useMemo } from 'react';
import { HeapVisualizerState } from '../types/ds-states';
import { cn } from '../../lib/utils';

interface Props {
  state: HeapVisualizerState;
}

export const HeapVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { type, arrayValues, treeNodes, heapifyActivePair, extractedValue } = state;

  // Build binary heap tree SVG coordinates
  const { positions, edges } = useMemo(() => {
    const posList: Array<{ id: string; x: number; y: number; val: number; index: number; state: string }> = [];
    const edgeList: Array<{ fromX: number; fromY: number; toX: number; toY: number; id: string }> = [];

    const n = arrayValues.length;
    if (n === 0) return { positions: [], edges: [] };

    const baseWidth = 640;

    arrayValues.forEach((val, i) => {
      const level = Math.floor(Math.log2(i + 1));
      const posInLevel = i - (Math.pow(2, level) - 1);
      const nodesInLevel = Math.pow(2, level);

      const levelWidth = baseWidth / (nodesInLevel + 1);
      const x = levelWidth * (posInLevel + 1);
      const y = (level + 1) * 60;

      posList.push({
        id: `node-${i}`,
        index: i,
        val,
        x,
        y,
        state: treeNodes[`node-${i}`]?.state || 'default',
      });

      // Add parent edge
      if (i > 0) {
        const parentIdx = Math.floor((i - 1) / 2);
        const pLevel = Math.floor(Math.log2(parentIdx + 1));
        const pPosInLevel = parentIdx - (Math.pow(2, pLevel) - 1);
        const pNodesInLevel = Math.pow(2, pLevel);
        const pLevelWidth = baseWidth / (pNodesInLevel + 1);
        const px = pLevelWidth * (pPosInLevel + 1);
        const py = (pLevel + 1) * 60;

        edgeList.push({
          id: `heap-edge-${parentIdx}-${i}`,
          fromX: px,
          fromY: py,
          toX: x,
          toY: y,
        });
      }
    });

    return { positions: posList, edges: edgeList };
  }, [arrayValues, treeNodes]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-4 select-none">
      {/* Heap Type Badge */}
      <div className="flex items-center gap-3 text-xs font-mono">
        <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold uppercase">
          {type.toUpperCase()}
        </span>
        {extractedValue !== undefined && extractedValue !== null && (
          <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold">
            Extracted: {extractedValue}
          </span>
        )}
      </div>

      {/* 1. Synchronized Array Representation */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider font-semibold">
          Synchronized Array Representation
        </span>
        <div className="flex items-center gap-2 overflow-x-auto max-w-full px-4 py-2">
          {arrayValues.map((val, idx) => {
            const isActive = heapifyActivePair && heapifyActivePair.includes(idx);

            return (
              <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={cn(
                    'w-11 h-12 rounded-xl border flex items-center justify-center font-bold text-sm shadow-sm transition-colors',
                    isActive
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 ring-2 ring-amber-500/40'
                      : 'border-border/80 bg-card text-foreground'
                  )}
                >
                  {val}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Binary Heap Tree */}
      <div className="w-full overflow-auto flex items-center justify-center max-h-[340px]">
        {positions.length === 0 ? (
          <div className="py-12 text-muted-foreground font-mono text-sm">Heap is empty.</div>
        ) : (
          <svg width={640} height={260} className="overflow-visible">
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
                strokeLinecap="round"
                opacity={0.6}
              />
            ))}

            {/* Tree Nodes */}
            {positions.map((p) => {
              const isPair = heapifyActivePair && heapifyActivePair.includes(p.index);
              let fill = '#1e1b4b';
              let stroke = '#6366f1';

              if (isPair || p.state === 'comparing') {
                fill = '#78350f';
                stroke = '#f59e0b';
              } else if (p.state === 'inserted') {
                fill = '#064e3b';
                stroke = '#10b981';
              } else if (p.state === 'deleted') {
                fill = '#881337';
                stroke = '#f43f5e';
              }

              return (
                <g key={p.id}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={20}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2.5}
                    className="filter drop-shadow-md transition-colors"
                  />
                  <text
                    x={p.x}
                    y={p.y + 4}
                    fill="#ffffff"
                    fontSize={12}
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono select-none"
                  >
                    {p.val}
                  </text>
                  <text
                    x={p.x + 14}
                    y={p.y - 12}
                    fill="#94a3b8"
                    fontSize={9}
                    className="font-mono select-none"
                  >
                    {p.index}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};
