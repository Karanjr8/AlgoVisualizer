import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Play, Circle, CircleDashed, Clock, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export type NodeState = 'completed' | 'current' | 'recommended' | 'future';

export interface RoadmapNodeData {
  id: string;
  title: string;
  icon: React.FC<{ className?: string; isHovered?: boolean }>;
  state: NodeState;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  estimatedTime: string;
  whyLater?: string;
}

interface Props {
  data: RoadmapNodeData;
  position?: 'left' | 'right' | 'center';
  index?: number;
}

export const RoadmapNode = ({ data, position = 'center', index = 0 }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const stateConfig = {
    completed: {
      color: 'text-green-500 dark:text-green-400',
      bg: 'bg-green-500/10 border-green-500/30',
      icon: CheckCircle2,
      label: 'Completed',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]'
    },
    current: {
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/40',
      icon: Play,
      label: 'Current Focus',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)] ring-2 ring-primary/50'
    },
    recommended: {
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: Circle,
      label: 'Recommended Next',
      glow: 'shadow-lg'
    },
    future: {
      color: 'text-muted-foreground',
      bg: 'bg-muted/50 border-border',
      icon: CircleDashed,
      label: 'Future Topic',
      glow: 'opacity-70 hover:opacity-100 transition-opacity'
    }
  };

  const config = stateConfig[data.state];
  const StatusIcon = config.icon;
  const CategoryIcon = data.icon;

  return (
    <div className="relative z-20 group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Stationary Connection anchor points */}
      <div className="absolute top-1/2 -left-4 w-4 h-1 invisible" id={`anchor-left-${data.id}`} />
      <div className="absolute top-1/2 -right-4 w-4 h-1 invisible" id={`anchor-right-${data.id}`} />
      <div className="absolute top-0 left-1/2 w-1 h-4 invisible" id={`anchor-top-${data.id}`} />
      <div className="absolute bottom-0 left-1/2 w-1 h-4 invisible" id={`anchor-bottom-${data.id}`} />

      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3 + (index % 4) * 0.4, ease: 'easeInOut' }}
      >
        <Link to={`/explore/${data.id}`} className="block relative">

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 backdrop-blur-md transition-all cursor-pointer relative",
            config.bg,
            config.glow
          )}
        >
          <CategoryIcon className={cn("w-10 h-10 md:w-12 md:h-12", config.color)} isHovered={isHovered} />
          
          {/* Status Badge */}
          <div className={cn(
            "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-background shadow-lg",
            data.state === 'completed' ? 'bg-green-500 text-white' : 
            data.state === 'current' ? 'bg-primary text-white' :
            data.state === 'recommended' ? 'bg-blue-500 text-white' :
            'bg-muted-foreground text-background'
          )}>
            <StatusIcon className="w-5 h-5" />
          </div>
        </motion.div>
        
        {/* Topic Title (Always visible) */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-max text-center">
          <p className={cn("font-bold text-sm", data.state === 'future' ? 'text-muted-foreground' : 'text-foreground')}>
            {data.title}
          </p>
        </div>
      </Link>
      </motion.div>

      {/* Custom Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 w-72 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-5 pointer-events-none",
              position === 'center' ? 'top-full mt-12 left-1/2 -translate-x-1/2' :
              position === 'left' ? 'top-1/2 -translate-y-1/2 right-full mr-6' :
              'top-1/2 -translate-y-1/2 left-full ml-6'
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-background", config.color)}>
                {config.label}
              </span>
            </div>
            
            <h3 className="text-xl font-black mb-4">{data.title}</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase block">Difficulty</span>
                  <span className="text-sm font-medium">{data.difficulty}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase block">Estimated Time</span>
                  <span className="text-sm font-medium">{data.estimatedTime}</span>
                </div>
              </div>

              {data.prerequisites.length > 0 && (
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Recommended After</span>
                    <ul className="space-y-1">
                      {data.prerequisites.map(req => (
                        <li key={req} className="text-sm flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-green-500" /> {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {data.whyLater && data.state === 'future' && (
                <div className="flex items-start gap-2 bg-muted/50 p-2.5 rounded-lg border border-border mt-2">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground block mb-0.5">Why it comes later:</strong>
                    {data.whyLater}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
