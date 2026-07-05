import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisualElement } from '../../types/visualizer';
import { cn } from '../../lib/utils';

interface LinkedListRendererProps {
  elements: VisualElement[];
  isDoubly?: boolean;
  isCircular?: boolean; // Kept for generic algorithm support if needed, though explicit nextId handles it
}

const POINTER_COLORS: Record<string, string> = {
  'head': 'bg-blue-500',
  'tail': 'bg-green-500',
  'curr': 'bg-yellow-500',
  'prev': 'bg-purple-500',
  'next': 'bg-pink-500',
  'slow': 'bg-indigo-500',
  'fast': 'bg-red-500',
  'temp': 'bg-orange-500',
  'newNode': 'bg-emerald-500'
};

interface Point {
  x: number;
  y: number;
}

export const LinkedListRenderer = ({ elements, isDoubly = false, isCircular = false }: LinkedListRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [nodePositions, setNodePositions] = useState<Record<string, { rect: DOMRect, cx: number, cy: number }>>({});

  const updatePositions = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPositions: Record<string, { rect: DOMRect, cx: number, cy: number }> = {};
    
    Object.entries(nodeRefs.current).forEach(([id, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        newPositions[id] = {
          rect,
          cx: rect.left - containerRect.left + rect.width / 2,
          cy: rect.top - containerRect.top + rect.height / 2
        };
      }
    });
    setNodePositions(newPositions);
  }, [elements]);

  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    // Add a slight delay just in case of layout shifts
    const timer = setTimeout(updatePositions, 50);
    return () => {
      window.removeEventListener('resize', updatePositions);
      clearTimeout(timer);
    };
  }, [elements, updatePositions]);

  // Helper to generate a curved SVG path between two points
  const generatePath = (source: Point, target: Point, offset: number, isCurve: boolean) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Straight line
    if (!isCurve && Math.abs(dy) < 10) {
       return `M ${source.x} ${source.y + offset} L ${target.x} ${target.y + offset}`;
    }

    // Curved line for backwards pointers (cycles or reversing)
    
    // For a circular list, if going from last to first
    if (dx < 0) {
       return `M ${source.x} ${source.y - 15} Q ${source.x + dx/2} ${source.y - distance * 0.4 - 50} ${target.x} ${target.y - 15}`;
    }
    
    // Default curve
    return `M ${source.x} ${source.y + offset} Q ${source.x + dx/2} ${source.y + dy/2 - 40} ${target.x} ${target.y + offset}`;
  };

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      
      {/* SVG Overlay for drawing pointers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--muted-foreground))" opacity="0.6" />
          </marker>
          <marker id="arrowhead-reverse" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
             <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--muted-foreground))" opacity="0.6" />
          </marker>
        </defs>

        <AnimatePresence>
          {elements.map((el, i) => {
            const sourcePos = nodePositions[el.id];
            if (!sourcePos) return null;

            const paths = [];

            // Forward Pointer (nextId)
            let nextId = el.nextId;
            // Fallback to implicit linear connection if nextId is not explicitly null and not provided
            if (nextId === undefined && i < elements.length - 1) {
               nextId = elements[i+1].id;
            } else if (nextId === undefined && i === elements.length - 1 && isCircular) {
               nextId = elements[0].id; // Circular fallback
            }

            if (nextId && nodePositions[nextId]) {
              const targetPos = nodePositions[nextId];
              const isBackwards = targetPos.cx < sourcePos.cx;
              
              // Calculate offset to touch edge of circle rather than center
              const r = 24; // approx radius of node
              const dx = targetPos.cx - sourcePos.cx;
              const dy = targetPos.cy - sourcePos.cy;
              const angle = Math.atan2(dy, dx);
              
              const startX = sourcePos.cx + (r + 4) * Math.cos(angle);
              const startY = sourcePos.cy + (r + 4) * Math.sin(angle);
              
              let endX = targetPos.cx - (r + 8) * Math.cos(angle);
              let endY = targetPos.cy - (r + 8) * Math.sin(angle);
              
              if (isBackwards) {
                 paths.push(
                    <motion.path
                      key={`next-${el.id}-${nextId}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      d={generatePath({ x: sourcePos.cx, y: sourcePos.cy }, { x: targetPos.cx, y: targetPos.cy }, 0, true)}
                      fill="none"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="2.5"
                      strokeOpacity="0.6"
                      markerEnd="url(#arrowhead)"
                    />
                 );
              } else {
                 paths.push(
                    <motion.line
                      key={`next-${el.id}-${nextId}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="2.5"
                      strokeOpacity="0.6"
                      markerEnd="url(#arrowhead)"
                    />
                 );
              }
            }

            // Backward Pointer (prevId)
            let prevId = el.prevId;
            if (prevId === undefined && isDoubly && i > 0) {
               prevId = elements[i-1].id;
            }

            if (prevId && nodePositions[prevId]) {
              const targetPos = nodePositions[prevId];
              const r = 24;
              const dx = targetPos.cx - sourcePos.cx;
              const dy = targetPos.cy - sourcePos.cy;
              const angle = Math.atan2(dy, dx);
              
              // Shift the prev arrow slightly down so it doesn't overlap with next arrow
              const offset = 12;
              
              const startX = sourcePos.cx + (r + 4) * Math.cos(angle);
              const startY = sourcePos.cy + (r + 4) * Math.sin(angle) + offset;
              
              const endX = targetPos.cx - (r + 8) * Math.cos(angle);
              const endY = targetPos.cy - (r + 8) * Math.sin(angle) + offset;

              paths.push(
                <motion.line
                  key={`prev-${el.id}-${prevId}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="2.5"
                  strokeOpacity="0.4"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead-reverse)"
                />
              );
            }

            return paths;
          })}
        </AnimatePresence>
      </svg>

      {/* Nodes Container */}
      <div className="w-full h-full flex flex-wrap items-center justify-center gap-12 sm:gap-16 px-4 py-20 relative z-10">
        <AnimatePresence mode="popLayout">
          {elements.map((el, index) => (
            <motion.div
              key={el.id}
              layout
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex items-center gap-2 relative shrink-0"
              ref={(node) => { nodeRefs.current[el.id] = node; }}
            >
              
              <div className="flex flex-col items-center gap-1 relative">
                {/* Top Pointers (head, curr, etc) */}
                <AnimatePresence>
                  {el.label && (
                    <div className="absolute -top-14 flex gap-1 justify-center z-20">
                      {el.label.split(',').map((token) => {
                        const t = token.trim();
                        const colorClass = POINTER_COLORS[t] || 'bg-primary';
                        return (
                          <motion.div
                            key={`ptr-${el.id}-${t}`}
                            layoutId={`ptr-badge-${t}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className={`flex flex-col items-center text-white drop-shadow-md`}
                          >
                            <div className={cn("px-2 py-1 rounded text-[10px] sm:text-xs font-black shadow-sm", colorClass)}>
                              {t}
                            </div>
                            <div className={cn("w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent opacity-90", colorClass.replace('bg-', 'border-t-'))} />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>

                {/* The Node Box */}
                <motion.div
                  animate={{ 
                    scale: el.state === 'swapping' ? 1.15 : 1,
                    rotate: el.state === 'swapping' ? 10 : 0
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={cn(
                    'flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full text-[12px] sm:text-base font-bold shadow-md border-2 transition-colors duration-200 z-10 bg-background',
                    el.state === 'normal' && 'border-border text-foreground',
                    el.state === 'comparing' && 'border-viz-comparing text-viz-comparing-foreground bg-viz-comparing/10',
                    el.state === 'swapping' && 'border-destructive text-destructive bg-destructive/10 shadow-lg shadow-destructive/20',
                    el.state === 'sorted' && 'border-viz-sorted text-viz-sorted-foreground bg-viz-sorted/10',
                    el.state === 'selected' && 'border-primary text-primary bg-primary/10',
                    el.state === 'found' && 'border-viz-found text-viz-found bg-viz-found/10 ring-4 ring-viz-found/30',
                    el.state === 'out-of-range' && 'border-border text-muted-foreground opacity-40 scale-90',
                  )}
                >
                  {el.displayValue !== undefined ? el.displayValue : el.value}
                </motion.div>
                
                <span className="text-[10px] font-medium text-muted-foreground tabular-nums opacity-60">
                  Node {index}
                </span>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
        
        {elements.length === 0 && (
          <div className="text-muted-foreground font-medium text-lg">List is empty (null)</div>
        )}
      </div>
    </div>
  );
};
