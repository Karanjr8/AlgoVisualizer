import { motion } from 'framer-motion';
import type { VisualElement } from '../../types/visualizer';
import { cn } from '../../lib/utils';

interface ArrayRendererProps {
  elements: VisualElement[];
}

const POINTER_COLORS: Record<string, string> = {
  'L': 'bg-blue-500',
  'Left': 'bg-blue-500',
  'R': 'bg-green-500',
  'Right': 'bg-green-500',
  'M': 'bg-yellow-500',
  'Mid': 'bg-yellow-500',
  'Pivot': 'bg-purple-500',
  'i': 'bg-indigo-500',
  'j': 'bg-pink-500',
};

export const ArrayRenderer = ({ elements }: ArrayRendererProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center gap-1 sm:gap-2 md:gap-3 px-2 py-12 flex-nowrap overflow-hidden relative">
      {/* Background Bounding Box for Windows */}
      <div className="absolute inset-0 flex items-center justify-center gap-1 sm:gap-2 md:gap-3 px-2 pointer-events-none z-0">
        {elements.map((el, index) => (
          <div key={`bg-${el.id}`} className="flex-1 min-w-0 max-w-[64px] h-full flex flex-col justify-center relative">
            {el.isWindow && (
              <motion.div
                layoutId="window-highlight"
                className="absolute inset-y-8 inset-x-0 bg-primary/10 border-t-2 border-b-2 border-primary/30 rounded-lg"
              />
            )}
          </div>
        ))}
      </div>

      {elements.map((el, index) => (
        <div key={el.id} className="flex flex-col items-center gap-1 flex-1 min-w-0 max-w-[64px] relative z-10">
          
          {/* Top Pointers */}
          {el.label && (
            <div className="absolute -top-12 flex gap-1 justify-center z-20">
              {el.label.split(',').map((token) => {
                const t = token.trim();
                const colorClass = POINTER_COLORS[t] || 'bg-primary';
                return (
                  <motion.div
                    key={`ptr-${t}`}
                    layoutId={`ptr-${t}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col items-center text-white drop-shadow-md`}
                  >
                    <div className={cn("px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-black shadow-sm", colorClass)}>
                      {t}
                    </div>
                    <div className={cn("w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent opacity-90", colorClass.replace('bg-', 'border-t-'))} />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* The Array Box with Lift -> Move -> Settle Animation */}
          <motion.div
            layout
            animate={{ 
              y: el.state === 'swapping' ? -24 : 0,
              scale: el.state === 'swapping' ? 1.05 : 1,
              zIndex: el.state === 'swapping' ? 30 : 10
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              'flex items-center justify-center w-full aspect-square rounded-md sm:rounded-lg text-[10px] sm:text-sm md:text-lg font-bold shadow-sm border-2 transition-colors duration-150',
              el.state === 'normal' && 'bg-secondary text-secondary-foreground border-border',
              el.state === 'comparing' &&
                'bg-viz-comparing text-viz-comparing-foreground border-viz-comparing',
              el.state === 'swapping' &&
                'bg-destructive text-destructive-foreground border-destructive shadow-xl shadow-destructive/20',
              el.state === 'sorted' &&
                'bg-viz-sorted text-viz-sorted-foreground border-viz-sorted',
              el.state === 'selected' && 'bg-primary text-primary-foreground border-primary',
              el.state === 'found' &&
                'bg-viz-found text-viz-found-foreground border-viz-found ring-2 ring-viz-found/50',
              el.state === 'out-of-range' &&
                'bg-muted text-muted-foreground border-border opacity-20 scale-90',
            )}
          >
            {el.displayValue !== undefined ? el.displayValue : el.value}
          </motion.div>
          
          <span className="text-[8px] sm:text-[10px] font-medium text-muted-foreground tabular-nums">
            {index}
          </span>
        </div>
      ))}
    </div>
  );
};
