import React, { useMemo } from 'react';
import { TrieVisualizerState } from '../types/ds-states';
import { cn } from '../../lib/utils';

interface Props {
  state: TrieVisualizerState;
}

interface TrieLayoutNode {
  id: string;
  char: string;
  isEndOfWord: boolean;
  state: string;
  x: number;
  y: number;
}

export const TrieVisualizerRenderer: React.FC<Props> = ({ state }) => {
  const { nodes, rootId, currentSearchPrefix, matchedWords } = state;

  // Compute hierarchical layout for Trie Tree
  const { layoutNodes, layoutEdges, svgWidth, svgHeight } = useMemo(() => {
    const lNodes: TrieLayoutNode[] = [];
    const lEdges: Array<{ fromX: number; fromY: number; toX: number; toY: number; id: string }> = [];

    if (!nodes[rootId]) return { layoutNodes: [], layoutEdges: [], svgWidth: 600, svgHeight: 250 };

    let leafCount = 0;
    const xPositions: Record<string, number> = {};
    const ySpacing = 65;
    let maxDepth = 0;

    // Calculate x positions using leaf distribution
    const assignPos = (id: string, depth: number): number => {
      const node = nodes[id];
      if (!node) return 0;
      if (depth > maxDepth) maxDepth = depth;

      const childrenKeys = Object.keys(node.children);
      if (childrenKeys.length === 0) {
        leafCount += 1;
        const x = leafCount * 54;
        xPositions[id] = x;
        return x;
      }

      let sumX = 0;
      for (const char of childrenKeys) {
        const childId = node.children[char];
        sumX += assignPos(childId, depth + 1);
      }

      const avgX = sumX / childrenKeys.length;
      xPositions[id] = avgX;
      return avgX;
    };

    assignPos(rootId, 0);

    const baseWidth = Math.max(600, (leafCount + 1) * 60);
    const baseHeight = Math.max(260, (maxDepth + 2) * ySpacing);

    Object.keys(nodes).forEach((id) => {
      const node = nodes[id];
      const x = xPositions[id] || 300;
      const y = (node.depth + 1) * ySpacing;

      lNodes.push({
        id,
        char: node.char,
        isEndOfWord: node.isEndOfWord,
        state: node.state,
        x,
        y,
      });

      // Edges to children
      Object.entries(node.children).forEach(([char, childId]) => {
        const childX = xPositions[childId] || 300;
        const childY = ((nodes[childId]?.depth || node.depth + 1) + 1) * ySpacing;

        lEdges.push({
          id: `trie-edge-${id}-${childId}`,
          fromX: x,
          fromY: y,
          toX: childX,
          toY: childY,
        });
      });
    });

    return { layoutNodes: lNodes, layoutEdges: lEdges, svgWidth: baseWidth, svgHeight: baseHeight };
  }, [nodes, rootId]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-4 select-none">
      {/* Search / Prefix Matched Words */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
        <span className="text-muted-foreground font-bold uppercase">Words in Trie:</span>
        {matchedWords.map((w) => (
          <span
            key={w}
            className={cn(
              'px-2.5 py-0.5 rounded-full border text-[11px] font-bold',
              currentSearchPrefix && w.startsWith(currentSearchPrefix)
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-secondary border-border text-foreground'
            )}
          >
            {w}
          </span>
        ))}
      </div>

      {/* SVG Trie Canvas */}
      <div className="w-full overflow-auto flex items-center justify-center max-h-[380px]">
        <svg width={svgWidth} height={svgHeight} className="overflow-visible">
          {/* Edges */}
          {layoutEdges.map((e) => (
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
          {layoutNodes.map((n) => {
            const isRoot = n.id === 'root';
            let fill = '#1e1b4b';
            let stroke = '#6366f1';

            if (n.state === 'matched') {
              fill = '#064e3b';
              stroke = '#10b981';
            } else if (n.state === 'end-of-word') {
              fill = '#3b0764';
              stroke = '#d946ef';
            }

            return (
              <g key={n.id}>
                {/* End of Word Outer Ring Halo */}
                {n.isEndOfWord && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={22}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    className="animate-spin"
                  />
                )}

                <circle
                  cx={n.x}
                  cy={n.y}
                  r={18}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                  className="filter drop-shadow-md"
                />

                <text
                  x={n.x}
                  y={n.y + 4}
                  fill="#ffffff"
                  fontSize={isRoot ? 9 : 13}
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono select-none"
                >
                  {n.char}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
