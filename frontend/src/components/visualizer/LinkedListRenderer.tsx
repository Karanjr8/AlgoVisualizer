import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisualElement } from '../../types/visualizer';
import { cn } from '../../lib/utils';

interface LinkedListRendererProps {
  elements: VisualElement[];
  isDoubly?: boolean;
  isCircular?: boolean;
}

const POINTER_COLORS: Record<string, string> = {
  'HEAD': 'bg-blue-600 border-blue-400 text-white font-black ring-2 ring-blue-400/40',
  'TAIL': 'bg-emerald-600 border-emerald-400 text-white font-black ring-2 ring-emerald-400/40',
  'head': 'bg-blue-600 text-white',
  'tail': 'bg-emerald-600 text-white',
  'curr': 'bg-amber-400 text-slate-950 font-bold',
  'prev': 'bg-purple-600 text-white',
  'next': 'bg-pink-600 text-white',
  'slow': 'bg-indigo-600 text-white',
  'fast': 'bg-rose-600 text-white',
  'temp': 'bg-orange-500 text-white',
  'newNode': 'bg-emerald-500 text-white font-bold'
};

interface Point {
  x: number;
  y: number;
}

export const LinkedListRenderer = memo(({ elements, isDoubly = false, isCircular = false }: LinkedListRendererProps) => {
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
  }, []);

  useEffect(() => {
    updatePositions();
    let ticking = false;
    const handleResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updatePositions();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    const timer = setTimeout(updatePositions, 50);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [elements, updatePositions]);

  // Helper to generate a curved SVG path between two points (e.g. Circular back-link)
  const generateCircularPath = (source: Point, target: Point) => {
    return `M ${source.x} ${source.y - 20} C ${source.x + 80} ${source.y - 100}, ${target.x - 80} ${target.y - 100}, ${target.x} ${target.y - 20}`;
  };

  // Find explicit head and tail indices
  const headIndex = elements.findIndex(e => e.label?.toLowerCase().includes('head')) >= 0 
    ? elements.findIndex(e => e.label?.toLowerCase().includes('head')) 
    : 0;

  const tailIndex = elements.findIndex(e => e.label?.toLowerCase().includes('tail')) >= 0 
    ? elements.findIndex(e => e.label?.toLowerCase().includes('tail')) 
    : elements.length - 1;

  return (
    <div className="w-full h-full relative py-12 flex flex-col items-center justify-center" ref={containerRef}>
      
      {/* SVG Overlay for drawing pointers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="arrowhead-next" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="currentColor" className="text-primary" />
          </marker>
          <marker id="arrowhead-prev" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="currentColor" className="text-purple-400" />
          </marker>
          <marker id="arrowhead-circular" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="currentColor" className="text-amber-400" />
          </marker>
        </defs>

        <AnimatePresence>
          {elements.map((el, i) => {
            const sourcePos = nodePositions[el.id];
            if (!sourcePos) return null;

            const paths = [];

            // Forward Pointer (nextId)
            let nextId = el.nextId;
            if (nextId === undefined && i < elements.length - 1) {
              nextId = elements[i+1].id;
            } else if (nextId === undefined && i === elements.length - 1 && isCircular && elements.length > 0) {
              nextId = elements[0].id;
            }

            if (nextId && nodePositions[nextId]) {
              const targetPos = nodePositions[nextId];
              const isBackwards = targetPos.cx < sourcePos.cx;
              
              const r = 28;
              const dx = targetPos.cx - sourcePos.cx;
              const dy = targetPos.cy - sourcePos.cy;
              const angle = Math.atan2(dy, dx);
              
              const startX = sourcePos.cx + r * Math.cos(angle);
              const startY = sourcePos.cy + r * Math.sin(angle);
              const endX = targetPos.cx - (r + 4) * Math.cos(angle);
              const endY = targetPos.cy - (r + 4) * Math.sin(angle);

              if (isBackwards || isCircular && i === elements.length - 1) {
                paths.push(
                  <motion.path
                    key={`next-circ-${el.id}-${nextId}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    d={generateCircularPath({ x: sourcePos.cx, y: sourcePos.cy }, { x: targetPos.cx, y: targetPos.cy })}
                    fill="none"
                    stroke="currentColor"
                    className="text-amber-400 stroke-[3] stroke-dasharray-4"
                    markerEnd="url(#arrowhead-circular)"
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
                    y1={startY - (isDoubly ? 6 : 0)}
                    x2={endX}
                    y2={endY - (isDoubly ? 6 : 0)}
                    stroke="currentColor"
                    className="text-primary stroke-[3]"
                    markerEnd="url(#arrowhead-next)"
                  />
                );
              }
            }

            // Backward Pointer (prevId) for Doubly Linked List
            let prevId = el.prevId;
            if (prevId === undefined && isDoubly && i > 0) {
              prevId = elements[i-1].id;
            }

            if (prevId && nodePositions[prevId]) {
              const targetPos = nodePositions[prevId];
              const r = 28;
              const dx = targetPos.cx - sourcePos.cx;
              const dy = targetPos.cy - sourcePos.cy;
              const angle = Math.atan2(dy, dx);
              
              const startX = sourcePos.cx + r * Math.cos(angle);
              const startY = sourcePos.cy + r * Math.sin(angle) + 10;
              const endX = targetPos.cx - (r + 4) * Math.cos(angle);
              const endY = targetPos.cy - (r + 4) * Math.sin(angle) + 10;

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
                  stroke="currentColor"
                  className="text-purple-400 stroke-[2.5] stroke-dasharray-4"
                  markerEnd="url(#arrowhead-prev)"
                />
              );
            }

            return paths;
          })}
        </AnimatePresence>
      </svg>

      {/* Nodes Container */}
      <div className="w-full flex flex-wrap items-center justify-center gap-12 sm:gap-16 px-6 py-12 relative z-10">
        <AnimatePresence mode="popLayout">
          {elements.map((el, index) => {
            const isHead = index === headIndex;
            const isTail = index === tailIndex && elements.length > 0;

            // Extra pointer labels excluding duplicate head/tail
            const customLabels = (el.label || '')
              .split(',')
              .map(s => s.trim())
              .filter(s => s && s.toLowerCase() !== 'head' && s.toLowerCase() !== 'tail');

            return (
              <motion.div
                key={el.id}
                layout
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex items-center gap-4 relative shrink-0"
                ref={(node) => { nodeRefs.current[el.id] = node; }}
              >
                
                <div className="flex flex-col items-center gap-2 relative">
                  
                  {/* Top Pointer Badges (STRICTLY ONE HEAD, ONE TAIL, plus active pointers) */}
                  <div className="absolute -top-16 flex flex-col items-center gap-1 z-20">
                    {isHead && (
                      <motion.div
                        layoutId="ptr-head"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-white drop-shadow-md"
                      >
                        <div className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-blue-600 border border-blue-400 shadow-md">
                          HEAD
                        </div>
                        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-blue-600" />
                      </motion.div>
                    )}

                    {isTail && !isHead && (
                      <motion.div
                        layoutId="ptr-tail"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-white drop-shadow-md"
                      >
                        <div className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-600 border border-emerald-400 shadow-md">
                          TAIL
                        </div>
                        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-emerald-600" />
                      </motion.div>
                    )}

                    {customLabels.map(lbl => (
                      <div key={`lbl-${el.id}-${lbl}`} className="flex flex-col items-center">
                        <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold shadow-sm", POINTER_COLORS[lbl] || 'bg-amber-500 text-black')}>
                          {lbl}
                        </div>
                        <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-amber-500" />
                      </div>
                    ))}
                  </div>

                  {/* Node Memory Box */}
                  <motion.div
                    animate={{ 
                      scale: (el.state === 'swapping' || el.state === 'comparing') ? 1.12 : 1,
                      rotate: el.state === 'swapping' ? 6 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={cn(
                      'flex items-center justify-between w-20 h-14 sm:w-24 sm:h-16 rounded-2xl text-xs sm:text-sm font-black shadow-lg border-2 transition-all duration-200 z-10 px-3 bg-card',
                      el.state === 'normal' && 'border-border text-foreground',
                      el.state === 'comparing' && 'border-amber-400 text-amber-400 bg-amber-400/10 ring-4 ring-amber-400/30',
                      el.state === 'swapping' && 'border-destructive text-destructive bg-destructive/10 shadow-lg shadow-destructive/20',
                      el.state === 'sorted' && 'border-cyan-400 text-cyan-400 bg-cyan-400/10',
                      el.state === 'selected' && 'border-primary text-primary bg-primary/10',
                      el.state === 'found' && 'border-emerald-400 text-emerald-400 bg-emerald-400/10 ring-4 ring-emerald-400/30',
                    )}
                  >
                    {/* Node Data Value */}
                    <span className="font-mono text-base font-black">{el.displayValue !== undefined ? el.displayValue : el.value}</span>

                    {/* Node Next Pointer Box */}
                    <div className="w-6 h-6 rounded-lg bg-muted border border-border flex items-center justify-center text-[9px] font-mono font-bold text-muted-foreground">
                      next
                    </div>
                  </motion.div>
                  
                  <span className="text-[10px] font-mono font-semibold text-muted-foreground tracking-tight opacity-75">
                    node[{index}]
                  </span>
                </div>

                {/* NULL Pointer Terminal for last node in Singly Linked List */}
                {index === elements.length - 1 && !isCircular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 pl-4"
                  >
                    <span className="text-muted-foreground font-mono text-lg font-bold">→</span>
                    <span className="px-2.5 py-1 rounded-xl bg-muted border border-border font-mono text-xs font-black text-muted-foreground uppercase shadow-sm">
                      NULL
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {elements.length === 0 && (
          <div className="text-muted-foreground font-mono font-bold text-base px-6 py-4 bg-card border border-border rounded-2xl">
            HEAD → NULL (Empty Linked List)
          </div>
        )}
      </div>
    </div>
  );
});

LinkedListRenderer.displayName = 'LinkedListRenderer';


