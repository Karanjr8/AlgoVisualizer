import { motion } from 'framer-motion';

export interface IconProps {
  isHovered?: boolean;
  className?: string;
}

export const CategoryIcons = {
  Sorting: ({ isHovered, className = "w-full h-full" }: IconProps) => (
    <svg viewBox="0 0 100 100" className={`${className} text-primary`} fill="currentColor">
      <motion.rect x="10" y="40" width="16" height="40" rx="4" animate={isHovered ? { height: [40, 20, 40], y: [40, 60, 40] } : {}} transition={{ duration: 0.6 }} />
      <motion.rect x="36" y="20" width="16" height="60" rx="4" animate={isHovered ? { height: [60, 80, 60], y: [20, 0, 20] } : {}} transition={{ duration: 0.6, delay: 0.1 }} />
      <motion.rect x="62" y="50" width="16" height="30" rx="4" animate={isHovered ? { x: [62, 88, 62] } : {}} transition={{ duration: 0.8 }} />
      <motion.rect x="88" y="30" width="16" height="50" rx="4" animate={isHovered ? { x: [88, 62, 88] } : {}} transition={{ duration: 0.8 }} />
    </svg>
  ),
  Searching: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500">
      <rect x="10" y="40" width="80" height="20" rx="4" fill="currentColor" fillOpacity="0.2" />
      <rect x="15" y="45" width="10" height="10" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="35" y="45" width="10" height="10" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="55" y="45" width="10" height="10" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="75" y="45" width="10" height="10" rx="2" fill="currentColor" fillOpacity="0.5" />
      <motion.g animate={isHovered ? { x: [0, 60, 0] } : {}} transition={{ duration: 1.5, ease: "easeInOut" }}>
        <circle cx="20" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
        <line x1="28" y1="58" x2="36" y2="66" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
    </svg>
  ),
  SlidingWindow: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-500">
      <g fill="currentColor" fillOpacity="0.2">
        <rect x="10" y="40" width="16" height="16" rx="2" />
        <rect x="30" y="40" width="16" height="16" rx="2" />
        <rect x="50" y="40" width="16" height="16" rx="2" />
        <rect x="70" y="40" width="16" height="16" rx="2" />
        <rect x="90" y="40" width="16" height="16" rx="2" />
      </g>
      <motion.rect 
        x="8" y="38" width="40" height="20" rx="4" 
        fill="none" stroke="currentColor" strokeWidth="2"
        animate={isHovered ? { x: [8, 48, 8] } : {}} 
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </svg>
  ),
  TwoPointers: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-purple-400">
      <rect x="10" y="45" width="80" height="10" rx="2" fill="currentColor" fillOpacity="0.2" />
      <motion.path 
        d="M 20 25 L 20 40 L 15 35 M 20 40 L 25 35" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        animate={isHovered ? { x: [0, 30, 0] } : {}} transition={{ duration: 1.5 }}
      />
      <motion.path 
        d="M 80 75 L 80 60 L 75 65 M 80 60 L 85 65" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        animate={isHovered ? { x: [0, -30, 0] } : {}} transition={{ duration: 1.5 }}
      />
    </svg>
  ),
  Recursion: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2">
      <motion.rect x="10" y="10" width="80" height="80" rx="8" animate={isHovered ? { rotate: 90, scale: 0.9 } : {}} transition={{ duration: 1 }} />
      <motion.rect x="25" y="25" width="50" height="50" rx="6" animate={isHovered ? { rotate: -90, scale: 0.8 } : {}} transition={{ duration: 1, delay: 0.1 }} />
      <motion.rect x="40" y="40" width="20" height="20" rx="4" animate={isHovered ? { rotate: 90, scale: 0.5 } : {}} transition={{ duration: 1, delay: 0.2 }} />
    </svg>
  ),
  Backtracking: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M 50 80 L 50 50 L 20 50 L 20 20" strokeOpacity="0.3" />
      <path d="M 50 50 L 80 50 L 80 20" strokeOpacity="0.3" />
      <motion.path 
        d="M 50 80 L 50 50 L 20 50"
        strokeDasharray="100"
        strokeDashoffset="100"
        animate={isHovered ? { strokeDashoffset: [100, 0, 100] } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.circle cx="20" cy="50" r="4" fill="currentColor" animate={isHovered ? { scale: [0, 1.5, 0], opacity: [0, 1, 0] } : { opacity: 0 }} transition={{ duration: 1.5, times: [0, 0.5, 1] }} />
    </svg>
  ),
  LinkedLists: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-500">
      <rect x="10" y="40" width="20" height="20" rx="4" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      <rect x="40" y="40" width="20" height="20" rx="4" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      <rect x="70" y="40" width="20" height="20" rx="4" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" />
      <line x1="30" y1="50" x2="38" y2="50" stroke="currentColor" strokeWidth="2" />
      <polygon points="36,48 40,50 36,52" fill="currentColor" />
      <line x1="60" y1="50" x2="68" y2="50" stroke="currentColor" strokeWidth="2" />
      <polygon points="66,48 70,50 66,52" fill="currentColor" />
      <motion.circle cx="20" cy="50" r="3" fill="currentColor" animate={isHovered ? { cx: [20, 50, 80] } : {}} transition={{ duration: 1.5 }} />
    </svg>
  ),
  Trees: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
      <line x1="50" y1="20" x2="25" y2="50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="50" y1="20" x2="75" y2="50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="25" y1="50" x2="15" y2="80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="25" y1="50" x2="35" y2="80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <circle cx="50" cy="20" r="8" fill="currentColor" />
      <circle cx="25" cy="50" r="8" fill="currentColor" />
      <circle cx="75" cy="50" r="8" fill="currentColor" />
      <circle cx="15" cy="80" r="8" fill="currentColor" />
      <circle cx="35" cy="80" r="8" fill="currentColor" />
      <motion.circle cx="50" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="2" animate={isHovered ? { scale: [1, 1.5, 1], opacity: [1, 0, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} />
    </svg>
  ),
  Graphs: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500">
      <line x1="50" y1="20" x2="20" y2="45" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="50" y1="20" x2="80" y2="45" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="20" y1="45" x2="50" y2="80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="80" y1="45" x2="50" y2="80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="20" y1="45" x2="80" y2="45" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <circle cx="50" cy="20" r="8" fill="currentColor" />
      <circle cx="20" cy="45" r="8" fill="currentColor" />
      <circle cx="80" cy="45" r="8" fill="currentColor" />
      <circle cx="50" cy="80" r="8" fill="currentColor" />
      <motion.circle cx="50" cy="20" r="8" fill="currentColor" animate={isHovered ? { cx: [50, 80, 50, 20, 50], cy: [20, 45, 80, 45, 20] } : {}} transition={{ duration: 2, ease: "linear" }} />
    </svg>
  ),
  DynamicProgramming: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-pink-500">
      <rect x="20" y="20" width="60" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <line x1="40" y1="20" x2="40" y2="80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <line x1="60" y1="20" x2="60" y2="80" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <line x1="20" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <line x1="20" y1="60" x2="80" y2="60" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <motion.rect x="22" y="22" width="16" height="16" rx="2" fill="currentColor" animate={isHovered ? { opacity: [0, 1] } : { opacity: 0.5 }} transition={{ delay: 0 }} />
      <motion.rect x="42" y="22" width="16" height="16" rx="2" fill="currentColor" animate={isHovered ? { opacity: [0, 1] } : { opacity: 0.5 }} transition={{ delay: 0.2 }} />
      <motion.rect x="42" y="42" width="16" height="16" rx="2" fill="currentColor" animate={isHovered ? { opacity: [0, 1] } : { opacity: 0.5 }} transition={{ delay: 0.4 }} />
      <motion.rect x="62" y="62" width="16" height="16" rx="2" fill="currentColor" animate={isHovered ? { opacity: [0, 1] } : { opacity: 0.5 }} transition={{ delay: 0.6 }} />
    </svg>
  ),
  Greedy: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-500">
      <circle cx="30" cy="50" r="10" fill="currentColor" fillOpacity="0.3" />
      <circle cx="50" cy="70" r="15" fill="currentColor" fillOpacity="0.3" />
      <circle cx="75" cy="40" r="20" fill="currentColor" fillOpacity="0.3" />
      <motion.path 
        d="M 50 20 L 75 40" 
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"
        animate={isHovered ? { pathLength: [0, 1] } : { pathLength: 1 }}
      />
      <motion.circle cx="75" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="3" animate={isHovered ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.5, delay: 0.5 }} />
    </svg>
  ),
  Heap: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
      <polygon points="50,20 20,80 80,80" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <line x1="50" y1="20" x2="35" y2="50" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="20" x2="65" y2="50" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="20" r="10" fill="currentColor" />
      <circle cx="35" cy="50" r="8" fill="currentColor" fillOpacity="0.7" />
      <circle cx="65" cy="50" r="8" fill="currentColor" fillOpacity="0.7" />
      <motion.circle cx="50" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="2" animate={isHovered ? { r: [12, 16, 12], opacity: [1, 0, 1] } : {}} transition={{ duration: 1 }} />
    </svg>
  ),
  Trie: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-teal-500">
      <line x1="50" y1="20" x2="30" y2="45" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="20" x2="70" y2="45" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <line x1="30" y1="45" x2="20" y2="75" stroke="currentColor" strokeWidth="2" />
      <line x1="30" y1="45" x2="40" y2="75" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
      <circle cx="50" cy="20" r="6" fill="currentColor" />
      <circle cx="30" cy="45" r="6" fill="currentColor" />
      <circle cx="70" cy="45" r="6" fill="currentColor" fillOpacity="0.3" />
      <circle cx="20" cy="75" r="6" fill="currentColor" />
      <circle cx="40" cy="75" r="6" fill="currentColor" fillOpacity="0.3" />
      <motion.path d="M 50 20 L 30 45 L 20 75" fill="none" stroke="currentColor" strokeWidth="3" animate={isHovered ? { pathLength: [0, 1] } : { pathLength: 0 }} transition={{ duration: 1 }} />
    </svg>
  ),
  SegmentTree: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-fuchsia-500">
      <rect x="10" y="80" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="30" y="80" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="50" y="80" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.5" />
      <rect x="70" y="80" width="16" height="10" rx="2" fill="currentColor" fillOpacity="0.5" />
      
      <rect x="20" y="50" width="20" height="10" rx="2" fill="currentColor" fillOpacity="0.7" />
      <rect x="60" y="50" width="20" height="10" rx="2" fill="currentColor" fillOpacity="0.7" />
      
      <rect x="40" y="20" width="20" height="10" rx="2" fill="currentColor" />
      
      <line x1="50" y1="30" x2="30" y2="50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="50" y1="30" x2="70" y2="50" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      
      <motion.rect x="40" y="20" width="20" height="10" rx="2" fill="currentColor" animate={isHovered ? { opacity: [0, 1, 0] } : { opacity: 0 }} transition={{ duration: 0.5, delay: 0.5 }} />
    </svg>
  ),
  BinaryIndexedTree: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-violet-500">
      <rect x="10" y="20" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="10" y="40" width="30" height="10" rx="2" fill="currentColor" fillOpacity="0.8" />
      <rect x="10" y="60" width="50" height="10" rx="2" fill="currentColor" fillOpacity="0.6" />
      <rect x="10" y="80" width="80" height="10" rx="2" fill="currentColor" fillOpacity="0.4" />
      <motion.rect x="10" y="40" width="30" height="10" rx="2" fill="currentColor" animate={isHovered ? { opacity: [0, 1, 0] } : { opacity: 0 }} transition={{ duration: 1 }} />
    </svg>
  ),
  Advanced: ({ isHovered }: IconProps) => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-primary" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" strokeOpacity="0.3" />
      <polygon points="50,25 75,40 75,60 50,75 25,60 25,40" />
      <line x1="50" y1="10" x2="50" y2="25" />
      <line x1="90" y1="30" x2="75" y2="40" />
      <line x1="90" y1="70" x2="75" y2="60" />
      <line x1="50" y1="90" x2="50" y2="75" />
      <line x1="10" y1="70" x2="25" y2="60" />
      <line x1="10" y1="30" x2="25" y2="40" />
      <motion.circle cx="50" cy="50" r="5" fill="currentColor" animate={isHovered ? { scale: [1, 2, 1] } : {}} transition={{ duration: 1 }} />
      <motion.polygon points="50,25 75,40 75,60 50,75 25,60 25,40" stroke="currentColor" animate={isHovered ? { rotate: 180 } : {}} transition={{ duration: 1.5, ease: "easeInOut" }} style={{ transformOrigin: "50px 50px" }} />
    </svg>
  )
};
