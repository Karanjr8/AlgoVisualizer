import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualElement } from '../../types/visualizer';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

interface Props {
  elements: VisualElement[];
}

interface NodePos {
  id: string;
  x: number;
  y: number;
  rank: number;
  depth: number;
}

export const TreeRenderer = ({ elements }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, NodePos>>({});
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const calculateLayout = useCallback(() => {
    if (!containerRef.current || elements.length === 0) return;
    const { width, height } = containerRef.current.getBoundingClientRect();

    // Find the root (node that is not a child of any node)
    const childIds = new Set<string>();
    elements.forEach(el => {
      if (el.leftId) childIds.add(el.leftId);
      if (el.rightId) childIds.add(el.rightId);
    });

    const roots = elements.filter(el => !childIds.has(el.id));
    if (roots.length === 0) return;
    const root = roots[0];

    const ranks: Record<string, number> = {};
    const depths: Record<string, number> = {};
    let currentRank = 0;
    let maxDepth = 0;

    const traverse = (id: string, depth: number) => {
      const node = elements.find(e => e.id === id);
      if (!node) return;
      depths[id] = depth;
      if (depth > maxDepth) maxDepth = depth;
      
      if (node.leftId) traverse(node.leftId, depth + 1);
      ranks[id] = currentRank++;
      if (node.rightId) traverse(node.rightId, depth + 1);
    };

    traverse(root.id, 0);

    const totalRanks = currentRank; // ranks go from 0 to totalRanks - 1
    
    const minHorizontalSpacing = 60;
    const verticalSpacing = 80;

    // Calculate required canvas size based on tree bounds
    const requiredWidth = Math.max(width, totalRanks * minHorizontalSpacing);
    const requiredHeight = Math.max(height, (maxDepth + 2) * verticalSpacing);

    setContainerSize({ width: requiredWidth, height: requiredHeight });

    const newPositions: Record<string, NodePos> = {};
    
    const marginX = requiredWidth / (totalRanks + 1);
    
    elements.forEach(el => {
      if (ranks[el.id] !== undefined) {
        newPositions[el.id] = {
          id: el.id,
          rank: ranks[el.id],
          depth: depths[el.id],
          x: marginX * (ranks[el.id] + 1),
          y: (depths[el.id] + 0.8) * verticalSpacing
        };
      }
    });

    setPositions(newPositions);
  }, [elements]);

  useEffect(() => {
    calculateLayout();
    const handleResize = () => calculateLayout();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateLayout]);

  const getElement = (id: string) => elements.find(e => e.id === id);

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] bg-background/50 rounded-xl border border-border overflow-auto custom-scrollbar"
      ref={containerRef}
    >
      <div 
        className="absolute top-0 left-0" 
        style={{ width: Math.max(containerSize.width, 100) + 'px', height: Math.max(containerSize.height, 100) + 'px' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <AnimatePresence>
            {elements.map(node => {
              const pos = positions[node.id];
              if (!pos) return null;

              const lines = [];

              if (node.leftId && positions[node.leftId]) {
                const childPos = positions[node.leftId];
                lines.push(
                  <motion.line
                    key={`edge-${node.id}-L`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x1: pos.x, y1: pos.y, x2: childPos.x, y2: childPos.y }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className={cn(
                      "stroke-2",
                      (node.state === 'comparing' || getElement(node.leftId)?.state === 'comparing') 
                        ? "stroke-primary/70" 
                        : "stroke-border"
                    )}
                  />
                );
              }

              if (node.rightId && positions[node.rightId]) {
                const childPos = positions[node.rightId];
                lines.push(
                  <motion.line
                    key={`edge-${node.id}-R`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x1: pos.x, y1: pos.y, x2: childPos.x, y2: childPos.y }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className={cn(
                      "stroke-2",
                      (node.state === 'comparing' || getElement(node.rightId)?.state === 'comparing') 
                        ? "stroke-primary/70" 
                        : "stroke-border"
                    )}
                  />
                );
              }
              
              return lines;
            })}
          </AnimatePresence>
        </svg>
        
        {/* Draw Nodes */}
        <AnimatePresence>
          {elements.map(el => {
            const pos = positions[el.id];
            if (!pos) return null;
            if (el.state === 'out-of-range' || el.value === -999) return null;
            
            return (
              <motion.div
                key={el.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: (el.state === 'comparing' || el.state === 'swapping' || el.state === 'found') ? 1.15 : 1,
                  x: pos.x - 24, // offset by radius (48/2)
                  y: pos.y - 24
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={cn(
                  "absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shadow-sm border-2 z-10",
                  el.state === 'normal' && "bg-card text-foreground border-border",
                  el.state === 'comparing' && "bg-viz-comparing/20 text-viz-comparing-foreground border-viz-comparing",
                  el.state === 'swapping' && "bg-destructive/20 text-destructive border-destructive shadow-destructive/20 shadow-lg",
                  el.state === 'found' && "bg-viz-found/20 text-viz-found-foreground border-viz-found ring-4 ring-viz-found/30",
                  el.state === 'sorted' && "bg-viz-sorted/10 text-viz-sorted-foreground border-viz-sorted/50",
                  el.state === 'selected' && "bg-primary/20 text-primary border-primary"
                )}
              >
                {el.state === 'found' ? <Check className="w-6 h-6" /> : el.value}
                
                <AnimatePresence>
                  {el.label && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute -top-8 flex flex-col items-center justify-center"
                    >
                      <div className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm whitespace-nowrap">
                        {el.label}
                      </div>
                      <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Pulsing effect for active node */}
                {(el.state === 'comparing' || el.state === 'found') && (
                  <span className={cn(
                    "absolute inset-0 rounded-full animate-ping opacity-30",
                    el.state === 'found' ? "bg-viz-found" : "bg-viz-comparing"
                  )} />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
