import { motion } from 'framer-motion';

// Stage 1: Animated Array & Sliding Window Preview
export const FoundationsAnimation = () => {
  return (
    <div className="w-full h-32 rounded-2xl bg-card/60 border border-white/10 p-3 flex flex-col justify-between overflow-hidden relative select-none">
      <div className="flex items-center justify-between text-[10px] font-black uppercase text-cyan-400 tracking-wider">
        <span>Sliding Window & Array Traversal</span>
        <span className="animate-pulse">Active Traversal</span>
      </div>

      {/* Array Bars with Sliding Window Frame */}
      <div className="relative flex items-end justify-around h-16 pt-2">
        {/* Animated Window Frame */}
        <motion.div
          animate={{ x: [-60, 0, 60, -60] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 w-24 h-16 rounded-xl border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.3)] z-10 pointer-events-none"
        />

        {[40, 75, 55, 90, 65, 80, 45, 95].map((height, i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="w-5 bg-gradient-to-t from-cyan-500/40 to-cyan-400 rounded-t-md relative z-0 origin-bottom"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
};

// Stage 2: Animated Tree & Linked List Node Connections Preview
export const StructuredThinkingAnimation = () => {
  return (
    <div className="w-full h-32 rounded-2xl bg-card/60 border border-white/10 p-3 flex flex-col justify-between overflow-hidden relative select-none">
      <div className="flex items-center justify-between text-[10px] font-black uppercase text-purple-400 tracking-wider">
        <span>Hierarchical Tree Traversal</span>
        <span className="animate-pulse">Tree & Heap</span>
      </div>

      <div className="relative w-full h-16 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full stroke-purple-500/40 stroke-2" fill="none">
          <line x1="50%" y1="15%" x2="30%" y2="55%" />
          <line x1="50%" y1="15%" x2="70%" y2="55%" />
          <line x1="30%" y1="55%" x2="20%" y2="85%" />
          <line x1="30%" y1="55%" x2="40%" y2="85%" />
        </svg>

        {/* Tree Nodes */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], boxShadow: ['0 0 0px #c084fc', '0 0 15px #c084fc', '0 0 0px #c084fc'] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute top-[10%] w-7 h-7 rounded-full bg-purple-500 text-white font-black text-[10px] flex items-center justify-center shadow-lg"
        >
          50
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
          className="absolute top-[50%] left-[26%] w-6 h-6 rounded-full bg-purple-600/80 text-white font-bold text-[9px] flex items-center justify-center border border-purple-400"
        >
          25
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
          className="absolute top-[50%] right-[26%] w-6 h-6 rounded-full bg-purple-600/80 text-white font-bold text-[9px] flex items-center justify-center border border-purple-400"
        >
          75
        </motion.div>
      </div>
    </div>
  );
};

// Stage 3: Animated Binary Search Shrinking Preview
export const PatternRecognitionAnimation = () => {
  return (
    <div className="w-full h-32 rounded-2xl bg-card/60 border border-white/10 p-3 flex flex-col justify-between overflow-hidden relative select-none">
      <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-400 tracking-wider">
        <span>Binary Search Interval Shrinking</span>
        <span className="animate-pulse">O(log N) Search</span>
      </div>

      <div className="relative w-full h-16 flex items-center justify-between px-4">
        {[10, 20, 30, 45, 60, 75, 90].map((val, i) => (
          <motion.div
            key={i}
            animate={i === 3 ? { scale: [1, 1.3, 1], backgroundColor: ['#10b981', '#34d399', '#10b981'] } : {}}
            transition={{ duration: 1.8, repeat: Infinity }}
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[10px] ${
              i === 3
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10'
                : 'bg-emerald-950/40 text-emerald-300/60 border border-emerald-500/20'
            }`}
          >
            {val}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Stage 4: Animated Graph Pulse Beam Preview
export const NetworkIntelligenceAnimation = () => {
  return (
    <div className="w-full h-32 rounded-2xl bg-card/60 border border-white/10 p-3 flex flex-col justify-between overflow-hidden relative select-none">
      <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-400 tracking-wider">
        <span>Graph Network & Shortest Path Routing</span>
        <span className="animate-pulse">Dijkstra / BFS</span>
      </div>

      <div className="relative w-full h-16 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full stroke-amber-500/40 stroke-2" fill="none">
          <line x1="20%" y1="50%" x2="50%" y2="20%" />
          <line x1="50%" y1="20%" x2="80%" y2="50%" />
          <line x1="20%" y1="50%" x2="50%" y2="80%" />
          <line x1="50%" y1="80%" x2="80%" y2="50%" />
        </svg>

        {/* Pulse Beam Particle */}
        <motion.div
          animate={{ x: [-80, 0, 80, -80], y: [0, -25, 0, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24]"
        />

        <div className="absolute left-[18%] top-[42%] w-6 h-6 rounded-full bg-amber-500 text-black font-extrabold text-[9px] flex items-center justify-center shadow-md">A</div>
        <div className="absolute top-[12%] left-[47%] w-6 h-6 rounded-full bg-amber-600 text-white font-extrabold text-[9px] flex items-center justify-center shadow-md">B</div>
        <div className="absolute right-[18%] top-[42%] w-6 h-6 rounded-full bg-amber-500 text-black font-extrabold text-[9px] flex items-center justify-center shadow-md">C</div>
        <div className="absolute bottom-[12%] left-[47%] w-6 h-6 rounded-full bg-amber-600 text-white font-extrabold text-[9px] flex items-center justify-center shadow-md">D</div>
      </div>
    </div>
  );
};

// Stage 5: Animated DP State Grid Fill Preview
export const OptimizationMindsetAnimation = () => {
  return (
    <div className="w-full h-32 rounded-2xl bg-card/60 border border-white/10 p-3 flex flex-col justify-between overflow-hidden relative select-none">
      <div className="flex items-center justify-between text-[10px] font-black uppercase text-rose-400 tracking-wider">
        <span>Dynamic Programming Table Fill</span>
        <span className="animate-pulse">Memoization</span>
      </div>

      <div className="grid grid-cols-6 gap-1.5 h-16 pt-1">
        {[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89].map((val, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], backgroundColor: ['rgba(244,63,94,0.1)', 'rgba(244,63,94,0.4)', 'rgba(244,63,94,0.1)'] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            className="rounded-lg border border-rose-500/30 flex items-center justify-center font-bold text-[9px] text-rose-300"
          >
            {val}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Stage 6: Animated Interview Mastery Emblem
export const InterviewMasteryAnimation = () => {
  return (
    <div className="w-full h-32 rounded-2xl bg-card/60 border border-white/10 p-3 flex flex-col justify-between overflow-hidden relative select-none">
      <div className="flex items-center justify-between text-[10px] font-black uppercase text-indigo-400 tracking-wider">
        <span>Real-World Interview Synthesis</span>
        <span className="animate-pulse">Full Mastery</span>
      </div>

      <div className="relative w-full h-16 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 rounded-full border-2 border-dashed border-indigo-400/60 flex items-center justify-center"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-[10px] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]"
        >
          100%
        </motion.div>
      </div>
    </div>
  );
};
