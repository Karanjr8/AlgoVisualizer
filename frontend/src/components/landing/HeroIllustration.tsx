import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NODES = [
  { id: 'trees', cx: 18, cy: 18, type: 'Trees', delay: 0, waveY: -12, duration: 4.5, ctrlY: 10 },
  { id: 'graphs', cx: 82, cy: 18, type: 'Graphs', delay: 0.5, waveY: 15, duration: 5.2, ctrlY: 10 },
  { id: 'sorting-algorithms', cx: 10, cy: 50, type: 'Sorting', delay: 1, waveY: -10, duration: 4.8, ctrlY: 25 },
  { id: 'searching-algorithms', cx: 90, cy: 50, type: 'Searching', delay: 1.5, waveY: 14, duration: 5.5, ctrlY: 75 },
  { id: 'linked-lists', cx: 25, cy: 82, type: 'Linked List', delay: 2, waveY: -15, duration: 6.0, ctrlY: 90 },
  { id: 'dynamic-programming', cx: 75, cy: 82, type: 'DP', delay: 2.5, waveY: 12, duration: 5.0, ctrlY: 90 },
];

export const HeroIllustration = () => {
  return (
    <div className="relative w-full aspect-square max-w-[700px] mx-auto md:mx-0">
      {/* Background glowing orb */}
      <div className="absolute inset-0 rounded-full opacity-10 dark:opacity-30 animate-pulse pointer-events-none" style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 60%)' }} />
      
      {/* Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Draw static paths */}
        <motion.g 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          fill="none" 
          strokeWidth="0.5"
          strokeDasharray="1 1"
          stroke="url(#lineGrad)"
        >
          {NODES.map((node, i) => (
            <path key={`path-${i}`} d={`M 50 50 Q ${(50+node.cx)/2} ${node.ctrlY} ${node.cx} ${node.cy}`} />
          ))}
        </motion.g>
        
        {/* Flowing dots (SVG native for perfect path alignment) */}
        {NODES.map((node, i) => (
          <circle 
            key={`dot-${i}`}
            r="1" 
            fill="var(--color-primary)"
          >
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path={`M 50 50 Q ${(50+node.cx)/2} ${node.ctrlY} ${node.cx} ${node.cy}`}
              keyPoints="0;1;0"
              keyTimes="0;0.5;1"
              calcMode="linear"
              begin={`-${node.delay}s`}
            />
          </circle>
        ))}
      </svg>

      {/* Central Hub */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full bg-card backdrop-blur-xl border border-primary/20 dark:border-primary/50 flex items-center justify-center shadow-xl dark:shadow-[0_0_40px_rgba(168,85,247,0.4)] z-30"
      >
        <div className="text-center">
          <div className="w-8 h-8 md:w-10 md:h-10 mx-auto rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-1 shadow-inner">
             <span className="text-primary-foreground font-bold text-lg md:text-xl">A</span>
          </div>
          <div className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase text-primary">AlgoVis</div>
        </div>
      </motion.div>

      {/* Render 6 Animated Modules as Links */}
      {NODES.map((node) => (
        <div
          key={node.id}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-24 h-24 md:w-32 md:h-32"
          style={{ left: `${node.cx}%`, top: `${node.cy}%` }}
        >
          {/* Waving/Floating Animation Wrapper */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, node.waveY, 0] }}
            transition={{ 
              scale: { delay: node.delay * 0.5, type: "spring" },
              opacity: { delay: node.delay * 0.5 },
              y: { repeat: Infinity, duration: node.duration, ease: "easeInOut", delay: node.delay }
            }}
            className="w-full h-full"
          >
            <Link 
              to={`/explore/${node.id}`} 
              className="block w-full h-full bg-card backdrop-blur-md border border-border shadow-md transition-all hover:scale-110 hover:border-primary/50 hover:z-40 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] rounded-2xl p-2 md:p-3 flex flex-col items-center justify-center group"
            >
              <div className="text-[8px] md:text-[10px] text-muted-foreground group-hover:text-foreground font-bold uppercase mb-1 md:mb-2 transition-colors">{node.type}</div>
              
              {node.type === 'Trees' && (
                <svg viewBox="0 0 100 80" className="w-full h-full text-foreground/80 pointer-events-none">
                  <path d="M 50 10 L 25 40 M 50 10 L 75 40 M 25 40 L 15 70 M 25 40 L 35 70" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" fill="none" />
                  <circle cx="50" cy="10" r="8" fill="currentColor" />
                  <circle cx="25" cy="40" r="8" fill="var(--color-primary)" />
                  <circle cx="75" cy="40" r="8" fill="currentColor" />
                  <motion.circle cx="15" cy="70" r="8" fill="var(--color-primary)" animate={{ fillOpacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2 }} />
                  <circle cx="35" cy="70" r="8" fill="currentColor" />
                </svg>
              )}

              {node.type === 'Graphs' && (
                <svg viewBox="0 0 100 80" className="w-full h-full text-foreground/80 pointer-events-none">
                  <path d="M 20 20 L 80 20 L 50 60 Z M 20 20 L 50 60" stroke="var(--color-secondary)" strokeWidth="2" strokeOpacity="0.5" fill="none" />
                  <motion.circle cx="20" cy="20" r="6" fill="var(--color-secondary)" />
                  <motion.circle cx="80" cy="20" r="6" fill="currentColor" />
                  <motion.circle cx="50" cy="60" r="6" fill="currentColor" />
                  <motion.circle cx="50" cy="20" r="4" fill="var(--color-secondary)" animate={{ cx: [20, 80, 50, 20], cy: [20, 20, 60, 20] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} />
                </svg>
              )}

              {node.type === 'Sorting' && (
                <div className="flex-1 flex flex-col justify-end gap-0.5 md:gap-1 w-full px-2 pointer-events-none">
                  <div className="flex justify-between items-end h-full">
                    {[8, 3, 6, 2, 5].map((h, idx) => (
                      <motion.div key={idx} className="w-[15%] bg-primary rounded-t-sm" animate={{ height: `${h * 10}%` }} transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }} />
                    ))}
                  </div>
                </div>
              )}

              {node.type === 'Searching' && (
                <div className="flex-1 flex flex-col justify-center gap-1 w-full px-1 md:px-2 pointer-events-none relative">
                  <div className="flex justify-between w-full">
                    {[1, 3, 5, 7].map((val, idx) => (
                      <div key={idx} className="w-3 h-3 md:w-5 md:h-5 border border-border flex items-center justify-center text-[6px] md:text-[8px]">{val}</div>
                    ))}
                  </div>
                  <motion.div className="absolute bottom-0 left-1 md:left-2 w-3 md:w-4 h-1 bg-green-500" animate={{ x: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
                </div>
              )}

              {node.type === 'Linked List' && (
                <div className="flex-1 flex items-center justify-center gap-0.5 md:gap-1 w-full pointer-events-none text-[8px] md:text-[10px]">
                  <div className="w-4 h-4 md:w-6 md:h-6 border border-border rounded-sm flex items-center justify-center">A</div>
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.div>
                  <div className="w-4 h-4 md:w-6 md:h-6 border border-primary/50 bg-primary/10 rounded-sm flex items-center justify-center">B</div>
                </div>
              )}

              {node.type === 'DP' && (
                <div className="flex-1 grid grid-cols-3 gap-0.5 md:gap-1 w-full px-1 md:px-2 pointer-events-none">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <motion.div key={idx} className="aspect-square border border-border rounded-[2px] bg-card" animate={{ backgroundColor: ["rgba(255,255,255,0)", "rgba(168,85,247,0.3)", "rgba(255,255,255,0)"] }} transition={{ repeat: Infinity, duration: 3, delay: idx * 0.2 }} />
                  ))}
                </div>
              )}
            </Link>
          </motion.div>
        </div>
      ))}
    </div>
  );
};
